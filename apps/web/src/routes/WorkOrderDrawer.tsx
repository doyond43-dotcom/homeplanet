import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

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

  // ✅ technician attribution
  technicianCode?: string;
  technicianName?: string;

  // metadata
  savedAtIso?: string;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function normalizeLines(lines: Line[]) {
  const cleaned = (lines || []).filter((l) => (l.description || "").trim() || (l.price || "").trim());
  return cleaned.length ? cleaned : [{ description: "", price: "" }];
}

function total(lines: Line[]) {
  return (lines || []).reduce((t, l) => t + (parseFloat(l.price) || 0), 0);
}

/** -------- Voice (Web Speech API) -------- */
type SpeechRec = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((ev: any) => void) | null;
  onerror: ((ev: any) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRec) | null {
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

  const jobId = row?.id || "";
  const draftKey = useMemo(() => (jobId ? `workOrderDraft:${jobId}` : ""), [jobId]);

  const [notes, setNotes] = useState("");
  const [labor, setLabor] = useState<Line[]>([{ description: "", price: "" }]);
  const [parts, setParts] = useState<Line[]>([{ description: "", price: "" }]);

  const [dictating, setDictating] = useState<null | { kind: "notes" | "labor" | "parts"; index?: number }>(null);
  const recRef = useRef<SpeechRec | null>(null);

  const speechCtor = useMemo(() => getSpeechRecognition(), []);

  // Load draft when opening a job
  useEffect(() => {
    if (!row?.id) return;

    let nextNotes = "";
    let nextLabor: Line[] = [{ description: "", price: "" }];
    let nextParts: Line[] = [{ description: "", price: "" }];

    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PrintData>;
        nextNotes = String(parsed.notes || "");
        nextLabor = normalizeLines((parsed.labor as Line[]) || []);
        nextParts = normalizeLines((parsed.parts as Line[]) || []);
      }
    } catch {}

    setNotes(nextNotes);
    setLabor(nextLabor);
    setParts(nextParts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row?.id]);

  // Auto-save draft
  useEffect(() => {
    if (!row?.id) return;

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
      savedAtIso: new Date().toISOString(),
    };

    try {
      localStorage.setItem(draftKey, JSON.stringify(payload));
    } catch {}
  }, [row?.id, draftKey, notes, labor, parts, row, employeeCode, employeeName]);

  function updateLine(
    setter: Dispatch<SetStateAction<Line[]>>,
    arr: Line[],
    i: number,
    key: keyof Line,
    val: string
  ) {
    const copy = [...arr];
    copy[i] = { ...copy[i], [key]: val };
    setter(copy);
  }

  function addLine(setter: Dispatch<SetStateAction<Line[]>>, arr: Line[]) {
    setter([...arr, { description: "", price: "" }]);
  }

  const laborTotal = total(labor);
  const partsTotal = total(parts);
  const grand = laborTotal + partsTotal;

  function close() {
    // stop dictation if drawer is closing
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

    // toggle off if already dictating notes
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

    rec.onresult = (ev: any) => {
      const t = ev?.results?.[0]?.[0]?.transcript;
      if (typeof t === "string" && t.trim()) {
        setNotes((prev) => (prev ? prev.trimEnd() + "\n" + t.trim() : t.trim()));
      }
    };
    rec.onerror = () => {};
    rec.onend = () => {
      setDictating((d) => (d?.kind === "notes" ? null : d));
    };

    setDictating({ kind: "notes" });
    rec.start();
  }

  function startDictationForLine(kind: "labor" | "parts", index: number) {
    if (!speechCtor) return;

    // toggle off if already dictating this exact line
    if (dictating?.kind === kind && dictating?.index === index) {
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

    rec.onresult = (ev: any) => {
      const t = ev?.results?.[0]?.[0]?.transcript;
      if (typeof t === "string" && t.trim()) {
        const text = t.trim();
        if (kind === "labor") {
          setLabor((prev) => {
            const copy = [...prev];
            const cur = copy[index] || { description: "", price: "" };
            const merged = cur.description ? cur.description.trimEnd() + " " + text : text;
            copy[index] = { ...cur, description: merged };
            return copy;
          });
        } else {
          setParts((prev) => {
            const copy = [...prev];
            const cur = copy[index] || { description: "", price: "" };
            const merged = cur.description ? cur.description.trimEnd() + " " + text : text;
            copy[index] = { ...cur, description: merged };
            return copy;
          });
        }
      }
    };

    rec.onerror = () => {};
    rec.onend = () => {
      setDictating((d) => (d?.kind === kind && d?.index === index ? null : d));
    };

    setDictating({ kind, index });
    rec.start();
  }

  if (!open || !row) return null;

  const stage = (row.current_stage || "diagnosing") as JobStage;
  const lastBy = row.stage_updated_by_employee_code || row.handled_by_employee_code || "";
  const lastAt = row.stage_updated_at || "";

  const techLabel =
    (employeeName || "").trim() ||
    (employeeCode || "").trim() ||
    (lastBy || "").trim() ||
    "";

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
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-28 bg-slate-900 border border-slate-700 rounded-xl p-3"
            placeholder="Diagnosis, findings, recommendations..."
          />
          <div className="text-[11px] text-slate-500 mt-2">(Draft auto-saves locally per job — so refresh won’t nuke it.)</div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Labor</div>
            <button onClick={() => addLine(setLabor, labor)} className="text-xs text-blue-400">
              + Add
            </button>
          </div>

          {labor.map((l, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={() => startDictationForLine("labor", i)}
                disabled={!speechCtor}
                className={`h-9 px-2 rounded-lg border ${
                  !speechCtor
                    ? "border-slate-800 text-slate-600"
                    : dictating?.kind === "labor" && dictating?.index === i
                    ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                    : "border-slate-700 text-slate-200 hover:border-slate-400"
                }`}
                title={!speechCtor ? "Voice input not supported" : "Dictate labor description"}
              >
                🎙️
              </button>

              <input
                value={l.description}
                onChange={(e) => updateLine(setLabor, labor, i, "description", e.target.value)}
                placeholder="Labor description"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 h-9"
              />
              <input
                value={l.price}
                onChange={(e) => updateLine(setLabor, labor, i, "price", e.target.value)}
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
            <button onClick={() => addLine(setParts, parts)} className="text-xs text-blue-400">
              + Add
            </button>
          </div>

          {parts.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={() => startDictationForLine("parts", i)}
                disabled={!speechCtor}
                className={`h-9 px-2 rounded-lg border ${
                  !speechCtor
                    ? "border-slate-800 text-slate-600"
                    : dictating?.kind === "parts" && dictating?.index === i
                    ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                    : "border-slate-700 text-slate-200 hover:border-slate-400"
                }`}
                title={!speechCtor ? "Voice input not supported" : "Dictate part description"}
              >
                🎙️
              </button>

              <input
                value={p.description}
                onChange={(e) => updateLine(setParts, parts, i, "description", e.target.value)}
                placeholder="Part"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 h-9"
              />
              <input
                value={p.price}
                onChange={(e) => updateLine(setParts, parts, i, "price", e.target.value)}
                placeholder="0.00"
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right h-9"
              />
            </div>
          ))}

          <div className="text-right text-sm text-slate-300 mt-1">Parts Total: ${partsTotal.toFixed(2)}</div>
        </div>

        <div className="border-t border-slate-700 pt-4 text-right text-lg font-bold">Grand Total: ${grand.toFixed(2)}</div>

        <button onClick={goPrint} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold">
          Print Work Order
        </button>
      </div>
    </div>
  );
}