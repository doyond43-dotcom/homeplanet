import { useEffect, useState } from "react";
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

type Line = {
  description: string;
  price: string;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
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

  const [notes, setNotes] = useState("");
  const [labor, setLabor] = useState<Line[]>([{ description: "", price: "" }]);
  const [parts, setParts] = useState<Line[]>([{ description: "", price: "" }]);

  useEffect(() => {
    if (!row) return;
    setNotes("");
    setLabor([{ description: "", price: "" }]);
    setParts([{ description: "", price: "" }]);
  }, [row?.id]);

  function updateLine(
    setter: React.Dispatch<React.SetStateAction<Line[]>>,
    arr: Line[],
    i: number,
    key: keyof Line,
    val: string
  ) {
    const copy = [...arr];
    copy[i] = { ...copy[i], [key]: val };
    setter(copy);
  }

  function addLine(setter: React.Dispatch<React.SetStateAction<Line[]>>, arr: Line[]) {
    setter([...arr, { description: "", price: "" }]);
  }

  function total(lines: Line[]) {
    return lines.reduce((t, l) => t + (parseFloat(l.price) || 0), 0);
  }

  const laborTotal = total(labor);
  const partsTotal = total(parts);
  const grand = laborTotal + partsTotal;

  function close() {
    onOpenChange(false);
  }

  async function setStage(stage: JobStage) {
    if (!onStageChange) return;
    await onStageChange(stage);
    if (stage === "done") close();
  }

  function goPrint() {
    if (!row) return;

    const data = {
      row,
      notes,
      labor,
      parts,
      laborTotal,
      partsTotal,
      grand,
    };

    sessionStorage.setItem("printWorkOrder", JSON.stringify(data));

    // IMPORTANT:
    // Your global router is hijacking /print/* and /live/*/print/* and sending it to Public Intake (/c/:slug).
    // So we STAY on the already-working staff route and trigger print mode via querystring.
    nav(`/live/${row.slug}/staff?print=${encodeURIComponent(row.id)}`);
  }

  if (!open || !row) return null;

  const stage = (row.current_stage || "diagnosing") as JobStage;
  const lastBy = row.stage_updated_by_employee_code || row.handled_by_employee_code || "";
  const lastAt = row.stage_updated_at || "";

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

            {(employeeCode || employeeName) ? (
              <div className="text-[11px] text-slate-500 mt-1">
                You: <span className="text-slate-300 font-semibold">{employeeName || employeeCode}</span>
              </div>
            ) : null}
          </div>

          <button
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

        <div>
          <div className="text-sm text-slate-400 mb-1">Technician Notes</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-28 bg-slate-900 border border-slate-700 rounded-xl p-3"
            placeholder="Diagnosis, findings, recommendations..."
          />
          <div className="text-[11px] text-slate-500 mt-2">
            (Notes are currently local in the drawer. Next step: save notes to Supabase with a timestamped event.)
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Labor</div>
            <button onClick={() => addLine(setLabor, labor)} className="text-xs text-blue-400">
              + Add
            </button>
          </div>

          {labor.map((l, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={l.description}
                onChange={(e) => updateLine(setLabor, labor, i, "description", e.target.value)}
                placeholder="Labor description"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1"
              />
              <input
                value={l.price}
                onChange={(e) => updateLine(setLabor, labor, i, "price", e.target.value)}
                placeholder="0.00"
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right"
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
            <button onClick={() => addLine(setParts, parts)} className="text-xs text-blue-400">
              + Add
            </button>
          </div>

          {parts.map((p, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={p.description}
                onChange={(e) => updateLine(setParts, parts, i, "description", e.target.value)}
                placeholder="Part"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1"
              />
              <input
                value={p.price}
                onChange={(e) => updateLine(setParts, parts, i, "price", e.target.value)}
                placeholder="0.00"
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right"
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
          onClick={goPrint}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold"
        >
          Print Work Order
        </button>
      </div>
    </div>
  );
}