// apps/web/src/routes/WorkOrderDrawer.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "../lib/supabase";

export type JobStage = "diagnosing" | "waiting_parts" | "repairing" | "done";

export type Row = {
  id: string;
  created_at: string;
  slug: string;
  payload: any;

  current_stage?: JobStage | null;
  stage_updated_at?: string | null;
  stage_updated_by_employee_code?: string | null;
  handled_by_employee_code?: string | null;
};

type Props = {
  open: boolean;
  row: Row | null;
  onOpenChange: (open: boolean) => void;

  employeeCode?: string;
  employeeName?: string;
  onStageChange?: (stage: JobStage) => void | Promise<void>;
};

export type Line = {
  id: string; // ✅ stable key prevents “other row changed” bugs
  description: string;
  price: string;
};

export type PrintData = {
  row: {
    id: string;
    created_at: string;
    slug: string;
    payload: any;
  };
  notes: string;
  labor: Line[];
  parts: Line[];
  laborTotal: number;
  partsTotal: number;
  grand: number;

  technicianCode?: string;
  technicianName?: string;

  savedAtIso?: string;
};

/* ---------- shared doc (Supabase) ---------- */

type WorkOrderDoc = {
  shop_slug: string;
  job_id: string;

  technician_notes: string;
  labor: Line[];
  parts: Line[];

  labor_total: number;
  parts_total: number;
  grand_total: number;

  updated_by_employee_code?: string | null;
  updated_at?: string | null;
};

/* ---------- utils ---------- */

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function total(lines: Line[]) {
  return (lines || []).reduce((t, l) => t + (parseFloat(l.price) || 0), 0);
}

function makeId() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = (globalThis as any)?.crypto;
    if (c?.randomUUID) return c.randomUUID();
  } catch {}
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeLines(lines: Partial<Line>[]) {
  const cleaned = (lines || [])
    .map((l) => ({
      id: String(l.id || makeId()),
      description: String(l.description || ""),
      price: String(l.price || ""),
    }))
    .filter((l) => l.description.trim() || l.price.trim());

  return cleaned.length ? cleaned : [{ id: makeId(), description: "", price: "" }];
}

function safeJson(x: unknown) {
  try {
    return JSON.stringify(x ?? null);
  } catch {
    return "";
  }
}

function computeTotals(labor: Line[], parts: Line[]) {
  const laborTotal = total(labor);
  const partsTotal = total(parts);
  const grand = laborTotal + partsTotal;
  return { laborTotal, partsTotal, grand };
}

/** -------- Quick Text (Tab shorthand expansion) --------
 *  - Invisible
 *  - Expands only on Tab
 *  - Expands only when caret is at END of field
 *  - ✅ ONLY USED IN Labor + Parts (NOT Technician Notes)
 */
const QUICK_TEXT: Record<string, string> = {
  // sides / position
  ds: "driver side",
  drv: "driver side",
  driver: "driver side",

  ps: "passenger side",
  pass: "passenger side",
  passenger: "passenger side",

  fr: "front",
  front: "front",
  rr: "rear",
  rear: "rear",

  l: "left",
  left: "left",
  r: "right",
  right: "right",

  // common parts / jobs
  hl: "headlamp",
  headlamp: "headlamp",
  headlight: "headlamp",

  alt: "alternator",
  alternator: "alternator",

  batt: "battery",
  battery: "battery",

  wm: "window motor",
  "window-motor": "window motor",

  sw: "switch",
  switch: "switch",

  plug: "tire plug",
  "tire-plug": "tire plug",

  rot: "rotation",
  rotate: "rotation",
  rotation: "rotation",

  // verbs / actions
  rep: "replace",
  repl: "replace",
  replace: "replace",

  test: "test",
  diag: "diagnostic",
  diagnostic: "diagnostic",

  inst: "install",
  install: "install",

  // your shop shorthand
  br: "brake",
  bt: "battery test",
  at: "alternator test",
};

type TextEl = HTMLInputElement;

function expandLastTokenOnTab(e: KeyboardEvent<TextEl>, dict = QUICK_TEXT) {
  if (e.key !== "Tab") return;

  const el = e.currentTarget;
  const value = el.value ?? "";

  const caret = el.selectionStart ?? value.length;

  // only expand when caret is at end (prevents mid-string weirdness)
  if (caret !== value.length) return;

  const parts = value.split(/\s+/);
  const last = (parts[parts.length - 1] ?? "").trim().toLowerCase();
  if (!last) return;

  const replacement = dict[last];
  if (!replacement) return;

  // only block Tab when we actually expand
  e.preventDefault();

  parts[parts.length - 1] = replacement;
  const next = parts.join(" ").replace(/\s+/g, " ").trimStart();

  // set DOM value and notify React
  el.value = next;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/** -------- Voice (Web Speech API) -------- */
type SpeechRec = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onresult: ((ev: any) => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onerror: ((ev: any) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRec) | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export default function WorkOrderDrawer({
  open,
  row,
  onOpenChange,
  employeeCode,
  employeeName,
  onStageChange,
}: Props) {
  const nav = useNavigate();

  const supabase = useMemo(() => getSupabase(), []);

  const jobId = row?.id || "";
  const shopSlug = row?.slug || "";

  const draftKey = useMemo(() => (jobId ? `workOrderDraft:${jobId}` : ""), [jobId]);

  const [notes, setNotes] = useState("");
  const [labor, setLabor] = useState<Line[]>(() => [{ id: makeId(), description: "", price: "" }]);
  const [parts, setParts] = useState<Line[]>(() => [{ id: makeId(), description: "", price: "" }]);

  const [dictating, setDictating] = useState<null | { kind: "notes" | "labor" | "parts"; id?: string }>(null);
  const recRef = useRef<SpeechRec | null>(null);

  const speechCtor = useMemo(() => getSpeechRecognition(), []);

  // Realtime / save indicators
  const [syncStatus, setSyncStatus] = useState<"idle" | "loading" | "saving" | "live" | "error">("idle");
  const [syncMsg, setSyncMsg] = useState<string>("");
  const [lastSavedIso, setLastSavedIso] = useState<string>("");

  // Guards to prevent overwriting local edits with incoming realtime
  const lastLocalEditAtRef = useRef<number>(0);
  const lastServerUpdatedAtRef = useRef<string | null>(null);

  const saveTimerRef = useRef<number | null>(null);

  // Track current job key (helps prevent stale updates)
  const jobKey = useMemo(() => (shopSlug && jobId ? `${shopSlug}:${jobId}` : ""), [shopSlug, jobId]);

  function markLocalEdit() {
    lastLocalEditAtRef.current = Date.now();
  }

  function updateLine(
    setter: Dispatch<SetStateAction<Line[]>>,
    id: string,
    key: keyof Omit<Line, "id">,
    val: string
  ) {
    markLocalEdit();
    setter((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: val } : l)));
  }

  function addLine(setter: Dispatch<SetStateAction<Line[]>>) {
    markLocalEdit();
    setter((prev) => [...prev, { id: makeId(), description: "", price: "" }]);
  }

  const laborTotal = total(labor);
  const partsTotal = total(parts);
  const grand = laborTotal + partsTotal;

  function close() {
    try {
      recRef.current?.abort?.();
    } catch {}
    recRef.current = null;
    setDictating(null);
    onOpenChange(false);
  }

  async function setStage(stage: JobStage) {
    if (!onStageChange) return;
    await onStageChange(stage);
    if (stage === "done") close();
  }

  function goPrint() {
    if (!row) return;

    const techCode =
      (employeeCode || "").trim() ||
      (row.stage_updated_by_employee_code || row.handled_by_employee_code || "").trim() ||
      "";

    const data: PrintData = {
      row,
      notes,
      labor: normalizeLines(labor),
      parts: normalizeLines(parts),
      laborTotal,
      partsTotal,
      grand,
      technicianCode: techCode || undefined,
      technicianName: (employeeName || "").trim() || undefined,
      savedAtIso: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem("printWorkOrder", JSON.stringify(data)); // legacy
      sessionStorage.setItem(`printWorkOrder:${row.id}`, JSON.stringify(data)); // scoped
    } catch {}

    try {
      localStorage.setItem(`workOrderDraft:${row.id}`, JSON.stringify(data));
    } catch {}

    nav(`/live/${row.slug}/staff?print=${encodeURIComponent(row.id)}`);
  }

  function startDictationForNotes() {
    if (!speechCtor) return;

    if (dictating?.kind === "notes") {
      try {
        recRef.current?.stop?.();
      } catch {}
      return;
    }

    try {
      recRef.current?.abort?.();
    } catch {}

    const rec = new speechCtor();
    recRef.current = rec;

    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (ev: any) => {
      const t = ev?.results?.[0]?.[0]?.transcript;
      if (typeof t === "string" && t.trim()) {
        markLocalEdit();
        setNotes((prev) => (prev ? prev.trimEnd() + "\n" + t.trim() : t.trim()));
      }
    };
    rec.onerror = () => {};
    rec.onend = () => setDictating((d) => (d?.kind === "notes" ? null : d));

    setDictating({ kind: "notes" });
    rec.start();
  }

  function startDictationForLine(kind: "labor" | "parts", lineId: string) {
    if (!speechCtor) return;

    if (dictating?.kind === kind && dictating?.id === lineId) {
      try {
        recRef.current?.stop?.();
      } catch {}
      return;
    }

    try {
      recRef.current?.abort?.();
    } catch {}

    const rec = new speechCtor();
    recRef.current = rec;

    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (ev: any) => {
      const t = ev?.results?.[0]?.[0]?.transcript;
      if (typeof t === "string" && t.trim()) {
        markLocalEdit();
        const text = t.trim();
        if (kind === "labor") {
          setLabor((prev) =>
            prev.map((l) => {
              if (l.id !== lineId) return l;
              const merged = l.description ? l.description.trimEnd() + " " + text : text;
              return { ...l, description: merged };
            })
          );
        } else {
          setParts((prev) =>
            prev.map((p) => {
              if (p.id !== lineId) return p;
              const merged = p.description ? p.description.trimEnd() + " " + text : text;
              return { ...p, description: merged };
            })
          );
        }
      }
    };

    rec.onerror = () => {};
    rec.onend = () => setDictating((d) => (d?.kind === kind && d?.id === lineId ? null : d));

    setDictating({ kind, id: lineId });
    rec.start();
  }

  /* =========================
     1) Load doc on open
     - Prefer server doc (job_work_orders)
     - Fall back to local draft if server missing
     - Ensure server doc exists (upsert empty if needed)
  ========================= */

  useEffect(() => {
    if (!open) return;
    if (!row?.id) return;
    if (!shopSlug || !jobId) return;

    let cancelled = false;

    const loadDoc = async () => {
      setSyncStatus("loading");
      setSyncMsg("");

      // 1) Start with local draft fallback (fast)
      let nextNotes = "";
      let nextLabor: Line[] = [{ id: makeId(), description: "", price: "" }];
      let nextParts: Line[] = [{ id: makeId(), description: "", price: "" }];

      try {
        const raw = localStorage.getItem(draftKey);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PrintData>;
          nextNotes = String(parsed.notes || "");
          nextLabor = normalizeLines((parsed.labor as Partial<Line>[]) || []);
          nextParts = normalizeLines((parsed.parts as Partial<Line>[]) || []);
        }
      } catch {}

      // Apply local first (so UI isn't blank)
      setNotes(nextNotes);
      setLabor(nextLabor);
      setParts(nextParts);

      // 2) Now prefer server (true shared doc)
      try {
        const { data, error } = await supabase
          .from("job_work_orders")
          .select("*")
          .eq("shop_slug", shopSlug)
          .eq("job_id", jobId)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          setSyncStatus("error");
          setSyncMsg(String(error?.message || "Failed to load shared doc"));
          return;
        }

        if (data) {
          const d = data as WorkOrderDoc;
          lastServerUpdatedAtRef.current = d.updated_at ?? null;

          setNotes(String(d.technician_notes || ""));
          setLabor(normalizeLines((d.labor as any) || []));
          setParts(normalizeLines((d.parts as any) || []));

          setLastSavedIso(d.updated_at || "");
          setSyncStatus("live");
          setSyncMsg("Live");
          return;
        }

        // 3) No server doc yet -> create one (upsert empty or based on local)
        const baseLabor = normalizeLines(nextLabor);
        const baseParts = normalizeLines(nextParts);
        const baseTotals = computeTotals(baseLabor, baseParts);

        const emptyDoc: Partial<WorkOrderDoc> = {
          shop_slug: shopSlug,
          job_id: jobId,
          technician_notes: nextNotes || "",
          labor: baseLabor,
          parts: baseParts,
          labor_total: baseTotals.laborTotal,
          parts_total: baseTotals.partsTotal,
          grand_total: baseTotals.grand,
          updated_by_employee_code: (employeeCode || "").trim() || null,
          updated_at: new Date().toISOString(),
        };

        const { error: upErr } = await supabase
          .from("job_work_orders")
          .upsert(emptyDoc, { onConflict: "shop_slug,job_id" });

        if (cancelled) return;

        if (upErr) {
          setSyncStatus("error");
          setSyncMsg(String(upErr?.message || "Failed to create shared doc"));
          return;
        }

        setSyncStatus("live");
        setSyncMsg("Live");
      } catch (e: any) {
        if (cancelled) return;
        setSyncStatus("error");
        setSyncMsg(String(e?.message || e || "Failed to load shared doc"));
      }
    };

    loadDoc();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, row?.id, jobKey]);

  /* =========================
     2) Realtime subscribe for this job doc
     - When another device saves, we update instantly
     - Guard against stomping local edits (short window)
  ========================= */

  useEffect(() => {
    if (!open) return;
    if (!row?.id) return;
    if (!shopSlug || !jobId) return;

    let isMounted = true;

    const channel = supabase
      .channel(`wo:${shopSlug}:${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "job_work_orders",
          filter: `shop_slug=eq.${shopSlug}`,
        },
        (payload: any) => {
          if (!isMounted) return;

          const next = payload?.new as WorkOrderDoc | undefined;
          if (!next) return;
          if (String(next.job_id) !== String(jobId)) return;

          // If we just edited locally, don't overwrite mid-typing
          const msSinceLocal = Date.now() - lastLocalEditAtRef.current;
          if (msSinceLocal < 700) return;

          // Apply only if newer than what we have
          const nextAt = next.updated_at ?? null;
          const prevAt = lastServerUpdatedAtRef.current;
          if (nextAt && prevAt && nextAt <= prevAt) return;

          lastServerUpdatedAtRef.current = nextAt;

          setNotes(String(next.technician_notes || ""));
          setLabor(normalizeLines((next.labor as any) || []));
          setParts(normalizeLines((next.parts as any) || []));

          setLastSavedIso(nextAt || "");
          setSyncStatus("live");
          setSyncMsg("Live");
        }
      )
      .subscribe((status) => {
        // status can be 'SUBSCRIBED' / 'CHANNEL_ERROR' / etc.
        if (String(status) === "SUBSCRIBED") {
          setSyncStatus("live");
          setSyncMsg("Live");
        }
      });

    return () => {
      isMounted = false;
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, row?.id, jobKey]);

  /* =========================
     3) Local draft autosave (safety fallback)
     - Keeps your existing "refresh won't nuke it" behavior
  ========================= */

  useEffect(() => {
    if (!row?.id) return;

    const { laborTotal, partsTotal, grand } = computeTotals(labor, parts);

    const payload: PrintData = {
      row,
      notes,
      labor,
      parts,
      laborTotal,
      partsTotal,
      grand,
      technicianCode: (employeeCode || "").trim() || undefined,
      technicianName: (employeeName || "").trim() || undefined,
      savedAtIso: new Date().toISOString(),
    };

    try {
      localStorage.setItem(draftKey, JSON.stringify(payload));
    } catch {}
  }, [row?.id, draftKey, notes, labor, parts, row, employeeCode, employeeName]);

  /* =========================
     4) Shared doc autosave (Google Docs)
     - Debounced upsert to job_work_orders
     - Writes notes + labor + parts + totals
  ========================= */

  useEffect(() => {
    if (!open) return;
    if (!row?.id) return;
    if (!shopSlug || !jobId) return;

    // debounce saves
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(async () => {
      try {
        setSyncStatus("saving");
        setSyncMsg("Saving…");

        const nlabor = normalizeLines(labor);
        const nparts = normalizeLines(parts);
        const { laborTotal, partsTotal, grand } = computeTotals(nlabor, nparts);

        const nowIso = new Date().toISOString();

        // mark last local edit (prevents immediate realtime echo overwrites)
        lastLocalEditAtRef.current = Date.now();

        const doc: Partial<WorkOrderDoc> = {
          shop_slug: shopSlug,
          job_id: jobId,
          technician_notes: String(notes || ""),
          labor: nlabor,
          parts: nparts,
          labor_total: laborTotal,
          parts_total: partsTotal,
          grand_total: grand,
          updated_by_employee_code: (employeeCode || "").trim() || null,
          updated_at: nowIso,
        };

        const { error } = await supabase
          .from("job_work_orders")
          .upsert(doc, { onConflict: "shop_slug,job_id" });

        if (error) {
          setSyncStatus("error");
          setSyncMsg(String(error?.message || "Save failed"));
          return;
        }

        lastServerUpdatedAtRef.current = nowIso;
        setLastSavedIso(nowIso);
        setSyncStatus("live");
        setSyncMsg("Live");
      } catch (e: any) {
        setSyncStatus("error");
        setSyncMsg(String(e?.message || e || "Save failed"));
      }
    }, 350);

    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };

    // IMPORTANT: stabilize deps to prevent save-loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, row?.id, jobKey, safeJson(notes), safeJson(labor), safeJson(parts), (employeeCode || "").trim()]);

  if (!open || !row) return null;

  const stage = (row.current_stage || "diagnosing") as JobStage;
  const lastBy = row.stage_updated_by_employee_code || row.handled_by_employee_code || "";
  const lastAt = row.stage_updated_at || "";

  const techLabel = (employeeName || "").trim() || (employeeCode || "").trim() || (lastBy || "").trim() || "";

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-end z-50" onClick={close}>
      <div
        className="w-[520px] bg-slate-950 text-white h-full overflow-y-auto p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <div className="text-2xl font-bold truncate">{row.payload?.vehicle || "Vehicle"}</div>
            <div className="text-sm text-slate-300 truncate">{row.payload?.name || "Customer"}</div>

            <div className="text-xs text-slate-500 mt-1">{new Date(row.created_at).toLocaleString()}</div>

            <div className="text-xs text-slate-400 mt-2">
              Stage: <span className="text-slate-200 font-semibold">{stage}</span>
              {lastBy ? (
                <>
                  {" "}
                  • Last: <span className="text-slate-200 font-semibold">{lastBy}</span>
                  {lastAt ? <span className="text-slate-400"> @ {formatTime(lastAt)}</span> : null}
                </>
              ) : null}
            </div>

            {techLabel ? (
              <div className="text-[11px] text-slate-500 mt-1">
                Technician: <span className="text-slate-300 font-semibold">{techLabel}</span>
              </div>
            ) : null}

            {/* Live Sync badge */}
            <div className="mt-2 inline-flex items-center gap-2 text-[11px]">
              <span
                className={`rounded-md border px-2 py-0.5 font-semibold ${
                  syncStatus === "live"
                    ? "border-emerald-400/40 text-emerald-200 bg-emerald-500/10"
                    : syncStatus === "saving"
                    ? "border-blue-400/40 text-blue-200 bg-blue-500/10"
                    : syncStatus === "loading"
                    ? "border-slate-600 text-slate-300 bg-slate-900/40"
                    : syncStatus === "error"
                    ? "border-red-400/40 text-red-200 bg-red-500/10"
                    : "border-slate-700 text-slate-300 bg-slate-900/40"
                }`}
                title={syncMsg || ""}
              >
                {syncStatus === "loading"
                  ? "Loading…"
                  : syncStatus === "saving"
                  ? "Saving…"
                  : syncStatus === "error"
                  ? "Sync error"
                  : "Live sync"}
              </span>

              {lastSavedIso ? (
                <span className="text-slate-500">Saved: {formatTime(lastSavedIso)}</span>
              ) : null}
            </div>

            {syncStatus === "error" && syncMsg ? (
              <div className="mt-2 text-[11px] text-red-200 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-2 whitespace-pre-wrap">
                {syncMsg}
              </div>
            ) : null}
          </div>

          <button onClick={close} className="border border-slate-700 px-3 py-2 rounded-lg hover:border-slate-400">
            Close
          </button>
        </div>

        {onStageChange ? (
          <div className="space-y-2">
            <div className="text-sm text-slate-400">Job Stage</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setStage("diagnosing")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  stage === "diagnosing" ? "border-blue-400 bg-blue-500/10" : "border-slate-700 hover:border-slate-400"
                }`}
              >
                Diagnosing
              </button>
              <button
                onClick={() => setStage("waiting_parts")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  stage === "waiting_parts"
                    ? "border-orange-400 bg-orange-500/10"
                    : "border-slate-700 hover:border-slate-400"
                }`}
              >
                Waiting Parts
              </button>
              <button
                onClick={() => setStage("repairing")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  stage === "repairing"
                    ? "border-emerald-400 bg-emerald-500/10"
                    : "border-slate-700 hover:border-slate-400"
                }`}
              >
                Repairing
              </button>
              <button
                onClick={() => setStage("done")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  stage === "done" ? "border-green-400 bg-green-500/10" : "border-slate-700 hover:border-slate-400"
                }`}
              >
                Done
              </button>
            </div>
          </div>
        ) : null}

        {/* Technician Notes (NO quick-text Tab expansion here) */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="text-sm text-slate-400">Technician Notes</div>

            <button
              type="button"
              onClick={startDictationForNotes}
              disabled={!speechCtor}
              className={`text-xs px-3 py-1 rounded-lg border ${
                !speechCtor
                  ? "border-slate-800 text-slate-600"
                  : dictating?.kind === "notes"
                  ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                  : "border-slate-700 text-slate-200 hover:border-slate-400"
              }`}
              title={!speechCtor ? "Voice input not supported in this browser" : "Dictate notes"}
            >
              {dictating?.kind === "notes" ? "🎙️ Listening…" : "🎙️ Mic"}
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => {
              markLocalEdit();
              setNotes(e.target.value);
            }}
            className="w-full h-28 bg-slate-900 border border-slate-700 rounded-xl p-3"
            placeholder="Diagnosis, findings, recommendations..."
          />
          <div className="text-[11px] text-slate-500 mt-2">
            (Live sync + local safety draft — so refresh won’t nuke it.)
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Labor</div>
            <button
              onClick={() => addLine(setLabor)}
              className="text-xs text-blue-400"
              type="button"
            >
              + Add
            </button>
          </div>

          {labor.map((l) => (
            <div key={l.id} className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={() => startDictationForLine("labor", l.id)}
                disabled={!speechCtor}
                className={`h-9 px-2 rounded-lg border ${
                  !speechCtor
                    ? "border-slate-800 text-slate-600"
                    : dictating?.kind === "labor" && dictating?.id === l.id
                    ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                    : "border-slate-700 text-slate-200 hover:border-slate-400"
                }`}
                title={!speechCtor ? "Voice input not supported" : "Dictate labor description"}
              >
                🎙️
              </button>

              <input
                value={l.description}
                onChange={(e) => updateLine(setLabor, l.id, "description", e.target.value)}
                onKeyDown={expandLastTokenOnTab} // ✅ quick-text ON (Labor)
                placeholder="Labor description"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 h-9"
              />
              <input
                value={l.price}
                onChange={(e) => updateLine(setLabor, l.id, "price", e.target.value)}
                placeholder="0.00"
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right h-9"
              />
            </div>
          ))}

          <div className="text-right text-sm text-slate-300 mt-1">Labor Total: ${laborTotal.toFixed(2)}</div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Parts</div>
            <button
              onClick={() => addLine(setParts)}
              className="text-xs text-blue-400"
              type="button"
            >
              + Add
            </button>
          </div>

          {parts.map((p) => (
            <div key={p.id} className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={() => startDictationForLine("parts", p.id)}
                disabled={!speechCtor}
                className={`h-9 px-2 rounded-lg border ${
                  !speechCtor
                    ? "border-slate-800 text-slate-600"
                    : dictating?.kind === "parts" && dictating?.id === p.id
                    ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                    : "border-slate-700 text-slate-200 hover:border-slate-400"
                }`}
                title={!speechCtor ? "Voice input not supported" : "Dictate part description"}
              >
                🎙️
              </button>

              <input
                value={p.description}
                onChange={(e) => updateLine(setParts, p.id, "description", e.target.value)}
                onKeyDown={expandLastTokenOnTab} // ✅ quick-text ON (Parts)
                placeholder="Part"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 h-9"
              />
              <input
                value={p.price}
                onChange={(e) => updateLine(setParts, p.id, "price", e.target.value)}
                placeholder="0.00"
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right h-9"
              />
            </div>
          ))}

          <div className="text-right text-sm text-slate-300 mt-1">Parts Total: ${partsTotal.toFixed(2)}</div>
        </div>

        <div className="border-t border-slate-700 pt-4 text-right text-lg font-bold">
          Grand Total: ${grand.toFixed(2)}
        </div>

        <button onClick={goPrint} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold">
          Print Work Order
        </button>
      </div>
    </div>
  );
}