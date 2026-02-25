// apps/web/src/routes/LiveIntakeBoard.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getSupabase } from "../lib/supabase";
import WorkOrderDrawer from "./WorkOrderDrawer";
import PrintWorkOrder from "./PrintWorkOrder";

type JobStage = "diagnosing" | "waiting_parts" | "repairing" | "done";

type Row = {
  id: string; // uuid
  created_at: string;
  slug: string;
  payload: any;

  current_stage: JobStage | null;
  stage_updated_at?: string | null;
  stage_updated_by_employee_code?: string | null;
  handled_by_employee_code?: string | null;
};

const STAGES: { key: JobStage; label: string; help: string }[] = [
  { key: "diagnosing", label: "Diagnosing", help: "Inspection / diagnosis in progress" },
  { key: "waiting_parts", label: "Waiting Parts", help: "Blocked waiting on parts" },
  { key: "repairing", label: "Repairing", help: "Repair work underway" },
  { key: "done", label: "Done", help: "Completed (removes from board)" },
];

function isQuickJob(payload: any) {
  const p = payload ?? {};
  const txt = `${p.message ?? ""} ${p.notes ?? ""} ${p.problem ?? ""}`.toLowerCase();
  return /oil|tire|flat|battery|jump|wiper|bulb|light|inspection|rotate|patch|plug/.test(txt);
}

function safeText(x: unknown, max = 140): string {
  const s = (typeof x === "string" ? x : JSON.stringify(x ?? "")).replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function stageColor(stage: string) {
  switch (stage) {
    case "diagnosing":
      return "text-blue-300";
    case "waiting_parts":
      return "text-orange-300";
    case "repairing":
      return "text-emerald-300";
    case "done":
      return "text-green-300";
    default:
      return "text-slate-300";
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDateTimeLocalPretty(v: string) {
  // v is typically "YYYY-MM-DDTHH:mm" (datetime-local)
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return v;
    const date = d.toLocaleDateString([], { month: "numeric", day: "numeric" });
    const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return `${date} ${time}`;
  } catch {
    return v;
  }
}

// Basic UUID sanity check (prevents "invalid input syntax for type uuid" mystery 400s)
function isUuid(v: unknown) {
  if (typeof v !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function formatSupabaseError(e: any) {
  if (!e) return "Unknown error";
  if (typeof e === "string") return e;

  const code = e.code ? `code=${e.code}` : "";
  const msg = e.message ? `message=${e.message}` : "";
  const details = e.details ? `details=${e.details}` : "";
  const hint = e.hint ? `hint=${e.hint}` : "";
  const parts = [code, msg, details, hint].filter(Boolean);

  return parts.length ? parts.join(" | ") : safeText(e, 400);
}

/**
 * Wrapper component:
 * - Only contains the minimal hooks needed for print-mode decision
 * - Prevents "Rendered fewer hooks than expected" by NOT mixing board hooks with print early-return
 */
export default function LiveIntakeBoard() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const loc = useLocation();

  // ✅ PRINT MODE (router-bypass): /live/<slug>/staff?print=<jobId>
  const printId = useMemo(() => {
    try {
      const v = new URLSearchParams(loc.search).get("print");
      return (v || "").trim() || null;
    } catch {
      return null;
    }
  }, [loc.search]);

  // Bridge sessionStorage key if PrintWorkOrder expects "printWorkOrder"
  useEffect(() => {
    if (!printId) return;
    try {
      const raw = sessionStorage.getItem("printWorkOrder");
      if (raw) sessionStorage.setItem(`printWorkOrder:${printId}`, raw);
    } catch {}
  }, [printId]);

  if (printId) {
    return <PrintWorkOrder />;
  }

  return <LiveIntakeBoardBody shopSlug={shopSlug} />;
}

/* ----------------------------- Next Date chips ----------------------------- */

type NextDateChip = {
  jobId: string;
  at: string; // datetime-local string
  label: string; // "Part ETA" etc
  note?: string;
  updatedAt?: string; // db updated_at
};

function chipBadgeColor(label: string) {
  const x = (label || "").toLowerCase();
  if (x.includes("eta")) return "border-orange-500/30 bg-orange-500/10 text-orange-200";
  if (x.includes("appointment")) return "border-blue-500/30 bg-blue-500/10 text-blue-200";
  if (x.includes("recheck")) return "border-purple-500/30 bg-purple-500/10 text-purple-200";
  if (x.includes("drop")) return "border-slate-500/30 bg-slate-500/10 text-slate-200";
  if (x.includes("return")) return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  return "border-slate-600/30 bg-slate-900/40 text-slate-200";
}

function toChipFromDraft(jobId: string, doc: any, updatedAt?: string | null): NextDateChip | null {
  if (!doc) return null;
  const at = String(doc?.next_action_at ?? "").trim();
  const label = String(doc?.next_action_label ?? "").trim();
  const note = String(doc?.next_action_note ?? "").trim();

  if (!at) return null;

  return {
    jobId,
    at,
    label: label || "Next Date",
    note: note || undefined,
    updatedAt: updatedAt ? String(updatedAt) : undefined,
  };
}

function LiveIntakeBoardBody({ shopSlug }: { shopSlug: string }) {
  const buildTag = useMemo(() => {
    const env = (import.meta as any).env ?? {};
    return (
      env.VITE_VERCEL_GIT_COMMIT_SHA ||
      env.VITE_GIT_COMMIT_SHA ||
      env.VERCEL_GIT_COMMIT_SHA ||
      env.GIT_COMMIT_SHA ||
      "dev"
    );
  }, []);

  // ✅ singleton client (one per tab)
  const supabase = useMemo(() => getSupabase(), []);

  const storageKey = useMemo(() => `hp_employee_code:${shopSlug || "no-slug"}`, [shopSlug]);
  const nameKey = useMemo(() => `hp_employee_name:${shopSlug || "no-slug"}`, [shopSlug]);

  const [employeeCode, setEmployeeCode] = useState<string>(() => localStorage.getItem(storageKey) || "");
  const [employeeName, setEmployeeName] = useState<string>(() => localStorage.getItem(nameKey) || "");
  const [rows, setRows] = useState<Row[]>([]);
  const [active, setActive] = useState<Row | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // ✅ Next Date chips map: job_id -> chip
  const [nextDateByJob, setNextDateByJob] = useState<Record<string, NextDateChip | null>>({});
  const nextDateByJobRef = useRef<Record<string, NextDateChip | null>>({});
  useEffect(() => {
    nextDateByJobRef.current = nextDateByJob;
  }, [nextDateByJob]);

  // ✅ Customer lookup (surgical add-on; does NOT touch board load/realtime/stages)
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupBusy, setLookupBusy] = useState(false);
  const [lookupErr, setLookupErr] = useState<string | null>(null);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupResults, setLookupResults] = useState<Row[]>([]);
  const lookupReqSeqRef = useRef(0);
  const lookupWrapRef = useRef<HTMLDivElement | null>(null);
  const lookupInputRef = useRef<HTMLInputElement | null>(null);

  // keep refs so realtime handlers never use stale state
  const rowsRef = useRef<Row[]>([]);
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  useEffect(() => {
    activeIdRef.current = active?.id ?? null;
  }, [active]);

  const inFlightRef = useRef(false);

  // ✅ broadcast "nudge" channel reference (used by setJobStage to poke other devices)
  const rtChannelRef = useRef<any>(null);

  useEffect(() => {
    if (!shopSlug) return;
    localStorage.setItem(storageKey, employeeCode || "");
    localStorage.setItem(nameKey, employeeName || "");
  }, [employeeCode, employeeName, shopSlug, storageKey, nameKey]);

  function upsertRow(next: Row) {
    setRows((prev) => {
      // remove done
      if ((next.current_stage || "diagnosing") === "done") {
        return prev.filter((r) => r.id !== next.id);
      }

      const i = prev.findIndex((r) => r.id === next.id);
      if (i === -1) {
        // new row at top
        return [next, ...prev];
      }
      const copy = prev.slice();
      copy[i] = { ...copy[i], ...next };
      // keep newest-first sort stable on created_at
      copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return copy;
    });

    // if drawer is open for same job, keep it in sync too
    const activeId = activeIdRef.current;
    if (activeId && activeId === next.id) {
      setActive((prev) => (prev ? { ...prev, ...next } : prev));
    }
  }

  async function load(reason = "load") {
    if (!shopSlug) return;
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    setErr(null);

    const { data, error } = await supabase
      .from("public_intake_submissions")
      .select(
        [
          "id",
          "created_at",
          "slug",
          "payload",
          "current_stage",
          "stage_updated_at",
          "stage_updated_by_employee_code",
          "handled_by_employee_code",
        ].join(",")
      )
      .eq("slug", shopSlug)
      .neq("current_stage", "done")
      .order("created_at", { ascending: false });

    inFlightRef.current = false;

    if (error) {
      setErr(`[${reason}] ${formatSupabaseError(error)}`);
      return;
    }

    const nextRows = ((data as any) || []) as Row[];
    setRows(nextRows);

    // keep active in sync if still exists
    const activeId = activeIdRef.current;
    if (activeId) {
      const found = nextRows.find((r) => r.id === activeId) || null;
      if (found) setActive(found);
    }
  }

  // ✅ Next Date: batched fetch for current rows (quiet, cached)
  useEffect(() => {
    if (!shopSlug) return;

    const ids = rows.map((r) => r.id).filter((id) => isUuid(id));
    if (ids.length === 0) return;

    let cancelled = false;

    // Debounce a bit so quick bursts of row updates don't spam reads
    const timer = window.setTimeout(async () => {
      try {
        // Only fetch ids we don't already have in the map
        const existing = nextDateByJobRef.current || {};
        const missing = ids.filter((id) => !(id in existing));

        if (missing.length === 0) return;

        const { data, error } = await supabase
          .from("work_order_drafts")
          .select("job_id, doc, updated_at")
          .eq("shop_slug", shopSlug)
          .in("job_id", missing);

        if (cancelled) return;

        if (error) {
          // don't blow up UI for this (keep board stable)
          console.warn("Next Date fetch error:", error);
          // still mark as known-missing to avoid re-query loop
          setNextDateByJob((prev) => {
            const next = { ...prev };
            for (const id of missing) next[id] = null;
            return next;
          });
          return;
        }

        const rowsData = ((data as any) || []) as Array<{ job_id: string; doc: any; updated_at?: string | null }>;
        const got = new Set<string>(rowsData.map((x) => String(x.job_id)));

        setNextDateByJob((prev) => {
          const next = { ...prev };
          for (const id of missing) {
            // default: no chip unless doc has next_action_at
            next[id] = null;
          }
          for (const it of rowsData) {
            const jobId = String(it.job_id || "");
            const chip = toChipFromDraft(jobId, it.doc, it.updated_at || null);
            next[jobId] = chip;
          }
          // any missing not returned -> null (already set above)
          for (const id of missing) {
            if (!got.has(id)) next[id] = null;
          }
          return next;
        });
      } catch (e: any) {
        if (cancelled) return;
        console.warn("Next Date fetch exception:", e);
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, shopSlug]);

  // ✅ Next Date: realtime updates from work_order_drafts (instant chip refresh)
  useEffect(() => {
    if (!shopSlug) return;

    let mounted = true;

    const ch = supabase
      .channel(`wo-drafts:${shopSlug}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "work_order_drafts", filter: `shop_slug=eq.${shopSlug}` },
        (p: any) => {
          if (!mounted) return;

          const next = p?.new ?? null;
          const jobId = String(next?.job_id ?? "").trim();
          if (!jobId) return;

          const chip = toChipFromDraft(jobId, next?.doc, next?.updated_at ?? null);

          setNextDateByJob((prev) => ({ ...prev, [jobId]: chip }));
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      try {
        supabase.removeChannel(ch);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  // ✅ Realtime-first + ✅ low-frequency heartbeat fallback (iPad/Safari-safe, NOT chatty)
  useEffect(() => {
    if (!shopSlug) return;

    let mounted = true;
    let heartbeatMs = 20000;
    let lastRealtimeAt = 0;
    let subStatus = "INIT";

    const setSubStatus = (s: string) => {
      subStatus = s;
      heartbeatMs = s === "SUBSCRIBED" ? 20000 : 5000;
    };

    load("initial");

    let loadTimer: number | null = null;
    const scheduleLoad = (why: string) => {
      if (!mounted) return;
      if (loadTimer) window.clearTimeout(loadTimer);
      loadTimer = window.setTimeout(() => load(why), 250);
    };

    const channel = supabase
      .channel(`board:${shopSlug}`, {
        config: { broadcast: { ack: true }, presence: { key: shopSlug } },
      })
      // ✅ DB changes on the main board table (INSERT/UPDATE/DELETE)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "public_intake_submissions", filter: `slug=eq.${shopSlug}` },
        (p: any) => {
          lastRealtimeAt = Date.now();

          const eventType = p.eventType as "INSERT" | "UPDATE" | "DELETE";
          if (eventType === "DELETE") {
            const oldId = p.old?.id;
            if (oldId) {
              setRows((prev) => prev.filter((r) => r.id !== oldId));
              if (activeIdRef.current === oldId) setActive(null);
            }
            return;
          }

          const next = (p.new ?? null) as Row | null;
          if (next && next.slug === shopSlug) {
            upsertRow(next);
          } else {
            scheduleLoad("realtime:fallback");
          }
        }
      )
      // ✅ Stage-event table (some environments emit updates via an event row instead of a row update)
      // IMPORTANT: we do NOT rely on filter here because schemas vary (slug vs shop_slug).
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "job_stage_events" }, (p: any) => {
        lastRealtimeAt = Date.now();
        const n = p?.new ?? {};
        const inferredSlug = String(n.slug ?? n.shop_slug ?? n.shopSlug ?? "").trim();
        // only react to our shop if we can infer it; otherwise ignore
        if (inferredSlug && inferredSlug !== shopSlug) return;
        scheduleLoad("realtime:stage-event");
      })
      // ✅ Broadcast "nudge": if DB realtime glitches, devices still get a refresh cue instantly
      .on("broadcast", { event: "hp_refresh" }, (msg: any) => {
        lastRealtimeAt = Date.now();
        const slugFromMsg = String(msg?.payload?.slug ?? "").trim();
        if (slugFromMsg && slugFromMsg !== shopSlug) return;
        scheduleLoad("broadcast:hp_refresh");
      })
      .subscribe((status) => {
        console.log("Realtime status:", status);
        setSubStatus(String(status));
      });

    // store channel so setJobStage can broadcast a refresh nudge to other devices
    rtChannelRef.current = channel;

    const tick = async () => {
      if (!mounted) return;
      if (document.visibilityState !== "visible") return;

      const since = Date.now() - lastRealtimeAt;
      if (subStatus === "SUBSCRIBED" && lastRealtimeAt && since < 15000) return;

      await load("heartbeat");
    };

    let pollId: number | null = null;
    const armPoll = () => {
      if (pollId) window.clearInterval(pollId);
      pollId = window.setInterval(tick, heartbeatMs);
    };
    armPoll();

    const statusWatcher = window.setInterval(() => {
      armPoll();
    }, 2000);

    const onVis = () => {
      if (document.visibilityState === "visible") load("focus");
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mounted = false;

      if (loadTimer) window.clearTimeout(loadTimer);
      if (pollId) window.clearInterval(pollId);
      window.clearInterval(statusWatcher);

      document.removeEventListener("visibilitychange", onVis);

      rtChannelRef.current = null;

      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  // ✅ Customer lookup search (includes completed jobs; does not affect board rows)
  useEffect(() => {
    if (!shopSlug) return;

    const qRaw = lookupQuery.trim();
    if (!qRaw) {
      setLookupErr(null);
      setLookupBusy(false);
      setLookupResults([]);
      setLookupOpen(false);
      return;
    }

    const seq = ++lookupReqSeqRef.current;
    setLookupBusy(true);
    setLookupErr(null);
    setLookupOpen(true);

    const timer = window.setTimeout(async () => {
      try {
        // We support:
        // - name + vehicle fuzzy search (always safe)
        // - id exact match ONLY when input looks like a UUID (uuid cannot be ilike'd)
        const isId = isUuid(qRaw);
        const q = qRaw.replace(/,/g, " ").replace(/\s+/g, " ").trim(); // mild sanitize (avoid breaking .or)

        let query = supabase
          .from("public_intake_submissions")
          .select(
            [
              "id",
              "created_at",
              "slug",
              "payload",
              "current_stage",
              "stage_updated_at",
              "stage_updated_by_employee_code",
              "handled_by_employee_code",
            ].join(",")
          )
          .eq("slug", shopSlug)
          .order("created_at", { ascending: false })
          .limit(25);

        if (isId) {
          // ✅ id exact match + name/vehicle fuzzy
          query = query.or(`id.eq.${q},payload->>name.ilike.%${q}%,payload->>vehicle.ilike.%${q}%`);
        } else {
          // ✅ name/vehicle fuzzy ONLY (avoid uuid ilike operator error)
          query = query.or(`payload->>name.ilike.%${q}%,payload->>vehicle.ilike.%${q}%`);
        }

        const { data, error } = await query;

        if (lookupReqSeqRef.current !== seq) return; // stale
        setLookupBusy(false);

        if (error) {
          setLookupErr(formatSupabaseError(error));
          setLookupResults([]);
          return;
        }

        setLookupErr(null);
        setLookupResults((((data as any) || []) as Row[]) || []);
      } catch (e: any) {
        if (lookupReqSeqRef.current !== seq) return;
        setLookupBusy(false);
        setLookupErr(formatSupabaseError(e));
        setLookupResults([]);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [lookupQuery, shopSlug]);

  // Close lookup dropdown when clicking outside
  useEffect(() => {
    const onDown = (ev: MouseEvent) => {
      const el = lookupWrapRef.current;
      if (!el) return;
      if (el.contains(ev.target as any)) return;
      setLookupOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, []);

  async function setJobStage(row: Row, stage: JobStage) {
    if (!shopSlug) {
      setErr("Missing shop slug in URL. Open /live/<slug>/staff and try again.");
      return;
    }

    if (!isUuid(row?.id)) {
      setErr(`Bad job id (expected uuid). Got: ${String(row?.id)}`);
      return;
    }

    let code = employeeCode.trim();

    if (!code) {
      const input = window.prompt("Enter your mechanic code (initials or 4-digit PIN):", "");
      code = (input || "").trim();

      if (!code) {
        setErr("Stage change cancelled — employee code required.");
        return;
      }

      setEmployeeCode(code);
      localStorage.setItem(storageKey, code);

      if (!employeeName.trim()) {
        setEmployeeName(code);
        localStorage.setItem(nameKey, code);
      }
    }

    setBusy(true);
    setErr(null);

    const nowIso = new Date().toISOString();
    const prevRows = rowsRef.current;

    const optimistic: Row = {
      ...row,
      current_stage: stage,
      stage_updated_at: nowIso,
      stage_updated_by_employee_code: code,
      handled_by_employee_code: code,
    };

    upsertRow(optimistic);
    if (stage === "done") setActive(null);

    try {
      const res = (await (supabase as any).rpc("hp_set_job_stage", {
        p_shop_slug: shopSlug,
        p_job_id: row.id,
        p_employee_code: code,
        p_stage: stage,
      })) as any;

      setBusy(false);

      if (res?.error) {
        setRows(prevRows);
        setErr(`RPC hp_set_job_stage failed | ${formatSupabaseError(res.error)}`);
        await load("rpc-error-refresh");
        return;
      }

      // ✅ NUDGE OTHER DEVICES IMMEDIATELY (works even if postgres_changes glitches)
      try {
        const ch = rtChannelRef.current;
        if (ch?.send) {
          await ch.send({
            type: "broadcast",
            event: "hp_refresh",
            payload: { slug: shopSlug, job_id: row.id, stage },
          });
        }
      } catch {}

      await load("stage-update");
    } catch (e: any) {
      setBusy(false);
      setRows(prevRows);
      setErr(`RPC threw exception | ${formatSupabaseError(e)}`);
      await load("rpc-exception-refresh");
    }
  }

  const quickRows = rows.filter((r) => isQuickJob(r.payload));
  const longRows = rows.filter((r) => !isQuickJob(r.payload));
  const employeeReady = !!employeeCode.trim();

  const renderNextDateChip = (jobId: string) => {
    const chip = nextDateByJob[jobId];
    if (!chip || !chip.at) return null;

    const label = chip.label || "Next Date";
    const when = formatDateTimeLocalPretty(chip.at);
    const note = chip.note ? safeText(chip.note, 80) : "";

    return (
      <div className="mt-2 flex items-center justify-between gap-2">
        <div
          className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 text-[11px] font-semibold ${chipBadgeColor(
            label
          )}`}
          title={note ? `${label} • ${when}\n${note}` : `${label} • ${when}`}
        >
          <span>📅</span>
          <span className="truncate max-w-[220px]">
            {label}: {when}
          </span>
        </div>

        {note ? (
          <div className="text-[11px] text-slate-500 truncate max-w-[240px]" title={note}>
            {note}
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-lg font-bold flex items-center gap-2">
            <span>Employee Board</span>
            <span className="text-[11px] text-slate-400 font-semibold rounded-md border border-slate-800 px-2 py-0.5">
              build {String(buildTag).slice(0, 10)}
            </span>
          </div>
          <div className="text-xs text-slate-400 truncate">/live/{shopSlug || "no-slug"}/staff</div>
        </div>

        <div className="flex items-center gap-2">
          {/* ✅ Customer lookup (includes done; does NOT touch board logic) */}
          <div ref={lookupWrapRef} className="relative hidden lg:block">
            <input
              ref={lookupInputRef}
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              onFocus={() => {
                if (lookupQuery.trim()) setLookupOpen(true);
              }}
              placeholder="Customer lookup (name / vehicle / id)"
              className="w-[360px] rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />

            {lookupOpen ? (
              <div className="absolute right-0 mt-2 w-[560px] max-w-[80vw] rounded-xl border border-slate-800 bg-slate-950 shadow-2xl z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Search: <span className="text-slate-200 font-semibold">{lookupQuery.trim()}</span>{" "}
                    <span className="text-slate-500">(includes completed)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    {lookupBusy ? <span className="text-slate-300">Searching…</span> : null}
                    <button
                      type="button"
                      onClick={() => {
                        setLookupOpen(false);
                      }}
                      className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 hover:border-slate-600"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {lookupErr ? (
                  <div className="px-3 py-3 text-sm text-red-200 bg-red-500/10 border-b border-red-500/20 whitespace-pre-wrap">
                    {lookupErr}
                  </div>
                ) : null}

                <div className="max-h-[420px] overflow-y-auto">
                  {lookupResults.map((r) => {
                    const stage = (r.current_stage || "diagnosing") as string;
                    const vehicle = safeText(r.payload?.vehicle || "Vehicle", 52);
                    const name = safeText(r.payload?.name || "Customer", 40);
                    const msg = safeText(r.payload?.message || r.payload?.notes || "", 120);

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setActive(r);
                          setLookupOpen(false);
                        }}
                        className="w-full text-left px-3 py-3 border-b border-slate-900 hover:bg-slate-900/50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{vehicle}</div>
                            <div className="text-sm text-slate-300 truncate">{name}</div>
                            {msg ? <div className="text-xs text-slate-500 mt-1 truncate">{msg}</div> : null}
                            <div className="text-[11px] text-slate-600 mt-1 truncate">id: {r.id}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className={"text-xs font-semibold " + stageColor(stage)}>
                              {STAGES.find((s) => s.key === stage)?.label ?? stage}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">{formatTime(r.created_at)}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {!lookupBusy && lookupResults.length === 0 ? (
                    <div className="px-3 py-4 text-sm text-slate-500">No matches. (Tip: ID search requires full UUID.)</div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <input
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            placeholder="Employee code"
            className="w-40 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <input
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="Name (optional)"
            className="w-48 hidden md:block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <button
            type="button"
            onClick={() => load("manual-refresh")}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:border-slate-500"
          >
            Refresh
          </button>
        </div>
      </div>

      {err ? (
        <div className="mx-6 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 whitespace-pre-wrap">
          {err}
        </div>
      ) : null}

      {!employeeReady ? (
        <div className="p-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 max-w-xl">
            <div className="text-xl font-bold">Enter employee code to continue</div>
            <div className="text-sm text-slate-300 mt-2">
              This makes every stage change attributable — and writes an immutable event stamp for proof.
            </div>
            <div className="text-xs text-slate-500 mt-3">Stored locally on this device for this shop slug.</div>
            <div className="text-xs text-slate-500 mt-2">
              (You can also skip this and just change a stage — it will prompt you the first time.)
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-full p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 font-semibold mb-2">Quick jobs</div>
                <div className="space-y-3">
                  {quickRows.map((r) => {
                    const stage = (r.current_stage || "diagnosing") as string;
                    const vehicle = safeText(r.payload?.vehicle || "Vehicle", 48);
                    const name = safeText(r.payload?.name || "Customer", 40);
                    const message = safeText(r.payload?.message || "", 160);
                    const lastBy = r.stage_updated_by_employee_code || r.handled_by_employee_code || null;
                    const lastAt = r.stage_updated_at || null;

                    return (
                      <div
                        key={r.id}
                        onClick={() => setActive(r)}
                        className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-blue-400"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-bold text-lg">{vehicle}</div>
                          <div className={"text-xs font-semibold " + stageColor(stage)}>
                            {STAGES.find((s) => s.key === stage)?.label ?? stage}
                          </div>
                        </div>
                        <div className="text-sm text-slate-300">{name}</div>
                        <div className="text-xs text-slate-400 mt-1">{message}</div>

                        {/* ✅ Next Date chip */}
                        {renderNextDateChip(r.id)}

                        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{formatTime(r.created_at)}</span>
                          {lastBy && (
                            <span className="text-slate-400">
                              Last:{" "}
                              <span className="text-slate-200 font-semibold">
                                {lastBy}
                                {lastAt ? ` @ ${formatTime(lastAt)}` : ""}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {quickRows.length === 0 ? <div className="text-sm text-slate-500">No quick jobs yet.</div> : null}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-semibold mb-2">Longer jobs</div>
                <div className="space-y-3">
                  {longRows.map((r) => {
                    const stage = (r.current_stage || "diagnosing") as string;
                    const vehicle = safeText(r.payload?.vehicle || "Vehicle", 48);
                    const name = safeText(r.payload?.name || "Customer", 40);
                    const message = safeText(r.payload?.message || "", 160);
                    const lastBy = r.stage_updated_by_employee_code || r.handled_by_employee_code || null;
                    const lastAt = r.stage_updated_at || null;

                    return (
                      <div
                        key={r.id}
                        onClick={() => setActive(r)}
                        className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-blue-400"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-bold text-lg">{vehicle}</div>
                          <div className={"text-xs font-semibold " + stageColor(stage)}>
                            {STAGES.find((s) => s.key === stage)?.label ?? stage}
                          </div>
                        </div>
                        <div className="text-sm text-slate-300">{name}</div>
                        <div className="text-xs text-slate-400 mt-1">{message}</div>

                        {/* ✅ Next Date chip */}
                        {renderNextDateChip(r.id)}

                        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{formatTime(r.created_at)}</span>
                          {lastBy && (
                            <span className="text-slate-400">
                              Last:{" "}
                              <span className="text-slate-200 font-semibold">
                                {lastBy}
                                {lastAt ? ` @ ${formatTime(lastAt)}` : ""}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {longRows.length === 0 ? <div className="text-sm text-slate-500">No longer jobs yet.</div> : null}
                </div>
              </div>
            </div>

            <WorkOrderDrawer
              open={!!active}
              row={active}
              employeeCode={employeeCode}
              employeeName={employeeName}
              onStageChange={(stage: JobStage) => {
                if (!active) return;
                return setJobStage(active, stage);
              }}
              onOpenChange={(open) => {
                if (!open) setActive(null);
              }}
            />
          </div>
        </div>
      )}

      {busy ? null : null}
    </div>
  );
}