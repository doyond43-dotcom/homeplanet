// apps/web/src/routes/LiveIntakeBoard.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useLocation, useParams, useNavigate } from "react-router-dom";
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

export default function LiveIntakeBoard() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const loc = useLocation();
  const nav = useNavigate();

  // ✅ PRINT MODE (router-bypass): /live/<slug>/staff?print=<jobId>
  const printId = useMemo(() => {
    try {
      const v = new URLSearchParams(loc.search).get("print");
      return (v || "").trim() || null;
    } catch {
      return null;
    }
  }, [loc.search]);

  // If in print mode, render PrintWorkOrder directly (bypasses global router)
  // Also: bridge sessionStorage key if PrintWorkOrder expects "printWorkOrder"
  useEffect(() => {
    if (!printId) return;

    // If print payload already exists, duplicate it into an id-scoped key too
    // (safe no-op if PrintWorkOrder only uses "printWorkOrder")
    try {
      const raw = sessionStorage.getItem("printWorkOrder");
      if (raw) {
        sessionStorage.setItem(`printWorkOrder:${printId}`, raw);
      }
    } catch {}
  }, [printId]);

  if (printId) {
    return <PrintWorkOrder />;
  }

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

  const supabase = useMemo(() => {
    const url = (import.meta as any).env?.VITE_SUPABASE_URL;
    const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;

    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }, []);

  const storageKey = useMemo(() => `hp_employee_code:${shopSlug || "no-slug"}`, [shopSlug]);
  const nameKey = useMemo(() => `hp_employee_name:${shopSlug || "no-slug"}`, [shopSlug]);

  const [employeeCode, setEmployeeCode] = useState<string>(() => localStorage.getItem(storageKey) || "");
  const [employeeName, setEmployeeName] = useState<string>(() => localStorage.getItem(nameKey) || "");
  const [rows, setRows] = useState<Row[]>([]);
  const [active, setActive] = useState<Row | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
    if (!supabase || !shopSlug) return;
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

  // ✅ Realtime-first + ✅ low-frequency heartbeat fallback (iPad/Safari-safe, NOT chatty)
  useEffect(() => {
    if (!supabase || !shopSlug) return;

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
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "job_stage_events", filter: `slug=eq.${shopSlug}` },
        () => {
          lastRealtimeAt = Date.now();
          scheduleLoad("realtime:stage-event");
        }
      )
      .subscribe((status) => {
        console.log("Realtime status:", status);
        setSubStatus(String(status));
      });

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

      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, shopSlug]);

  async function setJobStage(row: Row, stage: JobStage) {
    if (!supabase) {
      setErr("Supabase client not initialized (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
      return;
    }

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