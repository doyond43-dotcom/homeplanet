// apps/web/src/routes/WorkOrderDrawer.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "../lib/supabase";

export type JobStage = "diagnosing" | "waiting_parts" | "repairing" | "done";

export type Row = {
  id: string;
  created_at: string;
  slug: string; // this is your SHOP slug (e.g. "taylor-creek")
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
  id: string; // stable key
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
  // local draft extras (for refresh safety)
  nextActionLabel?: string;
  nextActionAt?: string; // datetime-local value
  nextActionNote?: string;

  savedAtIso?: string;
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

function normalizeLinesForDoc(lines: Partial<Line>[]) {
  // For DB doc: store only meaningful lines, never create placeholders (prevents id churn)
  return (lines || [])
    .map((l) => ({
      id: String(l.id || makeId()),
      description: String(l.description || ""),
      price: String(l.price || ""),
    }))
    .filter((l) => l.description.trim() || l.price.trim());
}

function ensureUiLines(lines: Partial<Line>[]) {
  // For UI: always show at least one editable row
  const cleaned = (lines || []).map((l) => ({
    id: String(l.id || makeId()),
    description: String(l.description || ""),
    price: String(l.price || ""),
  }));

  return cleaned.length
    ? (cleaned as Line[])
    : [{ id: makeId(), description: "", price: "" }];
}

/** -------- Quick Text (Tab shorthand expansion) -------- */
const QUICK_TEXT: Record<string, string> = {
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

  rep: "replace",
  repl: "replace",
  replace: "replace",

  test: "test",
  diag: "diagnostic",
  diagnostic: "diagnostic",

  inst: "install",
  install: "install",

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
  if (caret !== value.length) return;

  const parts = value.split(/\s+/);
  const last = (parts[parts.length - 1] ?? "").trim().toLowerCase();
  if (!last) return;

  const replacement = dict[last];
  if (!replacement) return;

  e.preventDefault();

  parts[parts.length - 1] = replacement;
  const next = parts.join(" ").replace(/\s+/g, " ").trimStart();

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

/* ---------- realtime shared draft model ---------- */

type DraftDoc = {
  notes: string;
  labor: Line[];
  parts: Line[];
  // calendar anchor stored in shared doc
  next_action_at?: string | null; // datetime-local string (or ISO if you prefer)
  next_action_label?: string | null;
  next_action_note?: string | null;
};

function toDraftDoc(
  notes: string,
  labor: Line[],
  parts: Line[],
  next_action_at?: string | null,
  next_action_label?: string | null,
  next_action_note?: string | null,
): DraftDoc {
  return {
    notes: String(notes || ""),
    labor: normalizeLinesForDoc(labor || []),
    parts: normalizeLinesForDoc(parts || []),

    next_action_at: next_action_at ? String(next_action_at) : null,
    next_action_label: next_action_label ? String(next_action_label) : null,
    next_action_note: next_action_note ? String(next_action_note) : null,
  };
}

function shallowEqDoc(a: DraftDoc, b: DraftDoc) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/* ---------- tuning ---------- */
// Option B: tone down DB writes (quieter pulse)
const SAVE_DEBOUNCE_MS = 1200;

export default function WorkOrderDrawer({
  open,
  row,
  onOpenChange,
  employeeCode,
  employeeName,
  onStageChange,
}: Props) {
  const nav = useNavigate();
  // singleton client (one per tab)
  const supabase = useMemo(() => getSupabase(), []);

  const jobId = row?.id || "";
  const draftKey = useMemo(
    () => (jobId ? `workOrderDraft:${jobId}` : ""),
    [jobId],
  );

  const [notes, setNotes] = useState("");
  const [labor, setLabor] = useState<Line[]>(() => [
    { id: makeId(), description: "", price: "" },
  ]);
  const [parts, setParts] = useState<Line[]>(() => [
    { id: makeId(), description: "", price: "" },
  ]);

  // calendar anchor state (local + shared doc)
  const [nextActionLabel, setNextActionLabel] = useState<string>("Part ETA");
  const [nextActionAt, setNextActionAt] = useState<string>(""); // datetime-local value
  const [nextActionNote, setNextActionNote] = useState<string>("");

  // keep latest values for realtime callback without re-subscribing
  const notesRef = useRef(notes);
  const laborRef = useRef(labor);
  const partsRef = useRef(parts);

  const nextActionLabelRef = useRef(nextActionLabel);
  const nextActionAtRef = useRef(nextActionAt);
  const nextActionNoteRef = useRef(nextActionNote);

  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);
  useEffect(() => {
    laborRef.current = labor;
  }, [labor]);
  useEffect(() => {
    partsRef.current = parts;
  }, [parts]);

  useEffect(() => {
    nextActionLabelRef.current = nextActionLabel;
  }, [nextActionLabel]);
  useEffect(() => {
    nextActionAtRef.current = nextActionAt;
  }, [nextActionAt]);
  useEffect(() => {
    nextActionNoteRef.current = nextActionNote;
  }, [nextActionNote]);

  // Live sync status UI
  const [syncLabel, setSyncLabel] = useState<string>("");
  const [savedAt, setSavedAt] = useState<string>("");

  // identify this tab/device so we can ignore our own realtime echoes
  const clientId = useMemo(() => {
    try {
      const existing = sessionStorage.getItem("hp_client_id");
      if (existing) return existing;
      const id = makeId();
      sessionStorage.setItem("hp_client_id", id);
      return id;
    } catch {
      return makeId();
    }
  }, []);

  const [dictating, setDictating] = useState<null | {
    kind: "notes" | "labor" | "parts";
    id?: string;
  }>(null);

  const recRef = useRef<SpeechRec | null>(null);
  const speechCtor = useMemo(() => getSpeechRecognition(), []);

  // refs for debounce + stale-guard
  const lastAppliedRemoteRef = useRef<string>(""); // json string
  const lastSentRef = useRef<string>(""); // json string
  const saveTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  // prevent "blank overwrite" during initial open/load
  const hydratingRef = useRef<boolean>(false); // true while we are loading initial state
  const hydratedOnceRef = useRef<boolean>(false); // becomes true after DB load finishes at least once

  /* ---------- Load draft when opening a job (local first, then DB) ---------- */
  useEffect(() => {
    if (!row?.id) return;

    mountedRef.current = true;
    // block save effect until DB read finishes (prevents blank overwrite)
    hydratingRef.current = true;
    hydratedOnceRef.current = false;

    setSyncLabel("Live sync");
    setSavedAt("");

    // 1) load local immediately (fast UX)
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PrintData>;
        setNotes(String(parsed.notes || ""));
        setLabor(ensureUiLines((parsed.labor as Partial<Line>[]) || []));
        setParts(ensureUiLines((parsed.parts as Partial<Line>[]) || []));

        // calendar anchor from local
        setNextActionLabel(String(parsed.nextActionLabel || "Part ETA"));
        setNextActionAt(String(parsed.nextActionAt || ""));
        setNextActionNote(String(parsed.nextActionNote || ""));

        if (parsed.savedAtIso) {
          setSavedAt(formatTime(String(parsed.savedAtIso)));
        }
      } else {
        setNotes("");
        setLabor([{ id: makeId(), description: "", price: "" }]);
        setParts([{ id: makeId(), description: "", price: "" }]);

        setNextActionLabel("Part ETA");
        setNextActionAt("");
        setNextActionNote("");
      }
    } catch {
      setNotes("");
      setLabor([{ id: makeId(), description: "", price: "" }]);
      setParts([{ id: makeId(), description: "", price: "" }]);

      setNextActionLabel("Part ETA");
      setNextActionAt("");
      setNextActionNote("");
    }

    // 2) load shared DB draft (authoritative for cross-device)
    (async () => {
      try {
        const { data, error } = await supabase
          .from("work_order_drafts")
          .select("doc, updated_at, updated_by_device_id")
          .eq("job_id", row.id)
          .limit(1)
          .maybeSingle();

        if (!mountedRef.current) return;

        if (error) {
          setSyncLabel("Live sync (read err)");
          // still unblock saving so user edits can persist
          hydratedOnceRef.current = true;
          hydratingRef.current = false;
          return;
        }

        if (data?.doc) {
          const doc = data.doc as DraftDoc;

          const normalized = toDraftDoc(
            doc.notes || "",
            (doc.labor as any) || [],
            (doc.parts as any) || [],
            (doc as any).next_action_at || null,
            (doc as any).next_action_label || null,
            (doc as any).next_action_note || null,
          );

          const js = JSON.stringify(normalized);
          lastAppliedRemoteRef.current = js;

          setNotes(normalized.notes);
          setLabor(ensureUiLines(normalized.labor));
          setParts(ensureUiLines(normalized.parts));

          // calendar anchor from DB
          setNextActionLabel(
            String((normalized as any).next_action_label || "Part ETA"),
          );
          setNextActionAt(String((normalized as any).next_action_at || ""));
          setNextActionNote(String((normalized as any).next_action_note || ""));

          if (data.updated_at) setSavedAt(formatTime(String(data.updated_at)));
          setSyncLabel("Live sync");
        }

        // DB read finished (even if no doc existed)
        hydratedOnceRef.current = true;
        hydratingRef.current = false;
      } catch {
        if (!mountedRef.current) return;
        setSyncLabel("Live sync (read err)");
        // still unblock saving so user edits can persist
        hydratedOnceRef.current = true;
        hydratingRef.current = false;
      }
    })();

    return () => {
      mountedRef.current = false;
      hydratingRef.current = false;
      hydratedOnceRef.current = false;

      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row?.id, draftKey]);

  /* ---------- Realtime subscribe to shared DB draft ---------- */
  useEffect(() => {
    if (!open || !row?.id) return;

    const chan = supabase
      .channel(`wo-draft:${row.id}`, { config: { broadcast: { ack: true } } })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "work_order_drafts",
          filter: `job_id=eq.${row.id}`,
        },
        (p: any) => {
          const next = p.new;
          if (!next?.doc) return;

          // ignore our own writes (device/tab)
          const updatedByDevice = String(next.updated_by_device_id || "");
          if (updatedByDevice && updatedByDevice === clientId) return;

          const doc = next.doc as DraftDoc;
          const normalized = toDraftDoc(
            doc.notes || "",
            (doc.labor as any) || [],
            (doc.parts as any) || [],
            (doc as any).next_action_at || null,
            (doc as any).next_action_label || null,
            (doc as any).next_action_note || null,
          );

          const js = JSON.stringify(normalized);

          // prevent loops + redundant sets
          if (js === lastAppliedRemoteRef.current) return;
          lastAppliedRemoteRef.current = js;

          // compare against latest local state (refs)
          const current = toDraftDoc(
            notesRef.current,
            laborRef.current,
            partsRef.current,
            nextActionAtRef.current || null,
            nextActionLabelRef.current || null,
            nextActionNoteRef.current || null,
          );
          if (shallowEqDoc(current, normalized)) return;

          setNotes(normalized.notes);
          setLabor(ensureUiLines(normalized.labor));
          setParts(ensureUiLines(normalized.parts));

          // calendar anchor from realtime
          setNextActionLabel(
            String((normalized as any).next_action_label || "Part ETA"),
          );
          setNextActionAt(String((normalized as any).next_action_at || ""));
          setNextActionNote(String((normalized as any).next_action_note || ""));

          if (next.updated_at) setSavedAt(formatTime(String(next.updated_at)));
          setSyncLabel("Live sync");
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setSyncLabel("Live sync");
        else setSyncLabel(`Live sync (${String(status)})`);
      });

    return () => {
      try {
        supabase.removeChannel(chan);
      } catch {}
    };
    // NOTE: do NOT include notes/labor/parts here; prevents re-subscribing on every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, row?.id, clientId]);

  /* ---------- Save: local (always) + shared DB (debounced) ---------- */
  useEffect(() => {
    if (!row?.id) return;
    // Critical: do NOT save while initial local+DB hydration is happening
    if (hydratingRef.current || !hydratedOnceRef.current) return;

    const laborTotal = total(labor);
    const partsTotal = total(parts);
    const grand = laborTotal + partsTotal;

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

      // store for local reload convenience
      nextActionLabel,
      nextActionAt,
      nextActionNote,

      savedAtIso: new Date().toISOString(),
    };

    // 1) local safety draft
    try {
      localStorage.setItem(draftKey, JSON.stringify(payload));
    } catch {}

    // 2) shared DB (debounced)
    const doc = toDraftDoc(
      notes,
      labor,
      parts,
      nextActionAt || null,
      nextActionLabel || null,
      nextActionNote || null,
    );
    const js = JSON.stringify(doc);

    // If we just applied this from remote, don't immediately re-upsert
    if (js === lastAppliedRemoteRef.current) return;

    // If we already sent same content, skip
    if (js === lastSentRef.current) return;

    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(async () => {
      try {
        setSyncLabel("Live sync");

        const tech =
          (employeeCode || "").trim() ||
          (
            row.stage_updated_by_employee_code ||
            row.handled_by_employee_code ||
            ""
          ).trim() ||
          "";

        const { error } = await supabase.from("work_order_drafts").upsert(
          {
            job_id: row.id,
            // your table expects shop_slug
            shop_slug: row.slug,

            doc,
            // device id to ignore our own realtime echoes
            updated_by_device_id: clientId,
            // optional: who typed it
            updated_by_employee_code: tech || null,
            updated_by: tech || null,
          },
          { onConflict: "job_id" },
        );

        if (error) {
          setSyncLabel("Live sync (save err)");
          return;
        }

        lastSentRef.current = js;
        setSavedAt(formatTime(new Date().toISOString()));
        setSyncLabel("Live sync");
      } catch {
        setSyncLabel("Live sync (save err)");
      }
    }, SAVE_DEBOUNCE_MS);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    row?.id,
    draftKey,
    notes,
    labor,
    parts,
    nextActionLabel,
    nextActionAt,
    nextActionNote,
    row,
    employeeCode,
    employeeName,
    clientId,
  ]);

  function updateLine(
    setter: Dispatch<SetStateAction<Line[]>>,
    id: string,
    key: keyof Omit<Line, "id">,
    val: string,
  ) {
    setter((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: val } : l)));
  }

  function addLine(setter: Dispatch<SetStateAction<Line[]>>) {
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
      (
        row.stage_updated_by_employee_code ||
        row.handled_by_employee_code ||
        ""
      ).trim() ||
      "";

    const data: PrintData = {
      row,
      notes,
      labor: ensureUiLines(normalizeLinesForDoc(labor)),
      parts: ensureUiLines(normalizeLinesForDoc(parts)),
      laborTotal,
      partsTotal,
      grand,
      technicianCode: techCode || undefined,
      technicianName: (employeeName || "").trim() || undefined,

      // carry into print payload too (harmless even if print page ignores)
      nextActionLabel,
      nextActionAt,
      nextActionNote,

      savedAtIso: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem("printWorkOrder", JSON.stringify(data));
      sessionStorage.setItem(`printWorkOrder:${row.id}`, JSON.stringify(data));
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
        setNotes((prev) =>
          prev ? prev.trimEnd() + "\n" + t.trim() : t.trim(),
        );
      }
    };

    rec.onerror = () => {
      // iOS/Safari can get stuck "green" without onend; force reset
      try {
        rec.abort();
      } catch {}
      recRef.current = null;
      setDictating(null);
    };

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
        const text = t.trim();
        if (kind === "labor") {
          setLabor((prev) =>
            prev.map((l) => {
              if (l.id !== lineId) return l;
              const merged = l.description
                ? l.description.trimEnd() + " " + text
                : text;
              return { ...l, description: merged };
            }),
          );
        } else {
          setParts((prev) =>
            prev.map((p) => {
              if (p.id !== lineId) return p;
              const merged = p.description
                ? p.description.trimEnd() + " " + text
                : text;
              return { ...p, description: merged };
            }),
          );
        }
      }
    };

    rec.onerror = () => {
      // iOS/Safari can get stuck "green" without onend; force reset
      try {
        rec.abort();
      } catch {}
      recRef.current = null;
      setDictating(null);
    };

    rec.onend = () =>
      setDictating((d) => (d?.kind === kind && d?.id === lineId ? null : d));

    setDictating({ kind, id: lineId });
    rec.start();
  }

  if (!open || !row) return null;

  const stage = (row.current_stage || "diagnosing") as JobStage;
  const lastBy =
    row.stage_updated_by_employee_code || row.handled_by_employee_code || "";
  const lastAt = row.stage_updated_at || "";

  const techLabel =
    (employeeName || "").trim() ||
    (employeeCode || "").trim() ||
    (lastBy || "").trim() ||
    "";

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-end z-50"
      onClick={close}
    >
      <div
        className="w-[520px] bg-slate-950 text-white h-full overflow-y-auto p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <div className="text-2xl font-bold truncate">
              {row.payload?.vehicle || "Vehicle"}
            </div>
            <div className="text-sm text-slate-300 truncate">
              {row.payload?.name || "Customer"}
            </div>

            <div className="text-xs text-slate-500 mt-1">
              {new Date(row.created_at).toLocaleString()}
            </div>

            <div className="text-xs text-slate-400 mt-2">
              Stage:{" "}
              <span className="text-slate-200 font-semibold">{stage}</span>
              {lastBy ? (
                <>
                  {" "}
                  - Last:{" "}
                  <span className="text-slate-200 font-semibold">{lastBy}</span>
                  {lastAt ? (
                    <span className="text-slate-400">
                      {" "}
                      @ {formatTime(lastAt)}
                    </span>
                  ) : null}
                </>
              ) : null}
            </div>

            {techLabel ? (
              <div className="text-[11px] text-slate-500 mt-1">
                Technician:{" "}
                <span className="text-slate-300 font-semibold">{techLabel}</span>
              </div>
            ) : null}

            <div className="mt-2 flex items-center gap-3">
              <span className="text-[11px] font-semibold rounded-md border border-emerald-700/60 bg-emerald-600/10 px-2 py-1 text-emerald-200">
                {syncLabel || "Live sync"}
              </span>
              {savedAt ? (
                <span className="text-[11px] text-slate-500">
                  Saved: {savedAt}
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            className="border border-slate-700 px-3 py-2 rounded-lg hover:border-slate-400"
          >
            Close
          </button>
        </div>

        {onStageChange ? (
          <div className="space-y-2">
            <div className="text-sm text-slate-400">Job Stage</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStage("diagnosing")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  stage === "diagnosing"
                    ? "border-blue-400 bg-blue-500/10"
                    : "border-slate-700 hover:border-slate-400"
                }`}
              >
                Diagnosing
              </button>
              <button
                type="button"
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
                type="button"
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
                type="button"
                onClick={() => setStage("done")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  stage === "done"
                    ? "border-green-400 bg-green-500/10"
                    : "border-slate-700 hover:border-slate-400"
                }`}
              >
                Done
              </button>
            </div>
          </div>
        ) : null}

        {/* Technician Notes */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="text-sm text-slate-400">Technician Notes</div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startDictationForNotes();
              }}
              disabled={!speechCtor}
              className={`text-xs px-3 py-1 rounded-lg border ${
                !speechCtor
                  ? "border-slate-800 text-slate-600"
                  : dictating?.kind === "notes"
                    ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                    : "border-slate-700 text-slate-200 hover:border-slate-400"
              }`}
              title={
                !speechCtor
                  ? "Voice input not supported in this browser"
                  : "Dictate notes"
              }
            >
              {dictating?.kind === "notes" ? "Listening..." : "Mic"}
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-28 bg-slate-900 border border-slate-700 rounded-xl p-3"
            placeholder="Diagnosis, findings, recommendations..."
          />
          <div className="text-[11px] text-slate-500 mt-2">
            (Live sync + local safety draft - so refresh will not nuke it.)
          </div>
        </div>

        {/* Next Date (Calendar Anchor) */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-sm text-slate-400">Next Date</div>
            <div className="text-[11px] text-slate-500">
              Part ETA / customer return
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={nextActionLabel}
              onChange={(e) => setNextActionLabel(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm"
            >
              <option>Part ETA</option>
              <option>Customer Return</option>
              <option>Appointment</option>
              <option>Recheck</option>
              <option>Drop-off</option>
              <option>Other</option>
            </select>

            <input
              type="datetime-local"
              value={nextActionAt}
              onChange={(e) => setNextActionAt(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm"
            />
          </div>

          <input
            value={nextActionNote}
            onChange={(e) => setNextActionNote(e.target.value)}
            placeholder='Optional note (e.g., "AutoZone arriving", "customer after 3pm")'
            className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Labor</div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addLine(setLabor);
              }}
              className="text-xs text-blue-400"
            >
              + Add
            </button>
          </div>

          {labor.map((l) => (
            <div key={l.id} className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  startDictationForLine("labor", l.id);
                }}
                disabled={!speechCtor}
                className={`h-9 px-2 rounded-lg border ${
                  !speechCtor
                    ? "border-slate-800 text-slate-600"
                    : dictating?.kind === "labor" && dictating?.id === l.id
                      ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                      : "border-slate-700 text-slate-200 hover:border-slate-400"
                }`}
                title={
                  !speechCtor
                    ? "Voice input not supported"
                    : "Dictate labor description"
                }
              >
                Mic
              </button>

              <input
                value={l.description}
                onChange={(e) =>
                  updateLine(setLabor, l.id, "description", e.target.value)
                }
                onKeyDown={expandLastTokenOnTab}
                placeholder="Labor description"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 h-9"
              />
              <input
                value={l.price}
                onChange={(e) =>
                  updateLine(setLabor, l.id, "price", e.target.value)
                }
                placeholder="0.00"
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right h-9"
              />
            </div>
          ))}

          <div className="text-right text-sm text-slate-300 mt-1">
            Labor Total: ${laborTotal.toFixed(2)}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Parts</div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addLine(setParts);
              }}
              className="text-xs text-blue-400"
            >
              + Add
            </button>
          </div>

          {parts.map((p) => (
            <div key={p.id} className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  startDictationForLine("parts", p.id);
                }}
                disabled={!speechCtor}
                className={`h-9 px-2 rounded-lg border ${
                  !speechCtor
                    ? "border-slate-800 text-slate-600"
                    : dictating?.kind === "parts" && dictating?.id === p.id
                      ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                      : "border-slate-700 text-slate-200 hover:border-slate-400"
                }`}
                title={
                  !speechCtor
                    ? "Voice input not supported"
                    : "Dictate part description"
                }
              >
                Mic
              </button>

              <input
                value={p.description}
                onChange={(e) =>
                  updateLine(setParts, p.id, "description", e.target.value)
                }
                onKeyDown={expandLastTokenOnTab}
                placeholder="Part"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 h-9"
              />
              <input
                value={p.price}
                onChange={(e) =>
                  updateLine(setParts, p.id, "price", e.target.value)
                }
                placeholder="0.00"
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right h-9"
              />
            </div>
          ))}

          <div className="text-right text-sm text-slate-300 mt-1">
            Parts Total: ${partsTotal.toFixed(2)}
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4 text-right text-lg font-bold">
          Grand Total: ${grand.toFixed(2)}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goPrint();
          }}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold"
        >
          Print Work Order
        </button>
      </div>
    </div>
  );
}