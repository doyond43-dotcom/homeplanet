import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Row = {
  id: string;
  created_at: string;
  slug: string;
  payload: any;
};

type Props = {
  row: Row;
  onClose: () => void;
};

type Line = {
  description: string;
  price: string;
};

export default function WorkOrderDrawer({ row, onClose }: Props) {
  const nav = useNavigate();

  const [notes, setNotes] = useState("");
  const [labor, setLabor] = useState<Line[]>([{ description: "", price: "" }]);
  const [parts, setParts] = useState<Line[]>([{ description: "", price: "" }]);

  function updateLine(setter: any, arr: Line[], i: number, key: keyof Line, val: string) {
    const copy = [...arr];
    copy[i][key] = val;
    setter(copy);
  }

  function addLine(setter: any, arr: Line[]) {
    setter([...arr, { description: "", price: "" }]);
  }

  function total(lines: Line[]) {
    return lines.reduce((t, l) => t + (parseFloat(l.price) || 0), 0);
  }

  const laborTotal = total(labor);
  const partsTotal = total(parts);
  const grand = laborTotal + partsTotal;

  function goPrint() {
    const data = {
      row,
      notes,
      labor,
      parts,
      laborTotal,
      partsTotal,
      grand
    };

    sessionStorage.setItem("printWorkOrder", JSON.stringify(data));
    nav(`/print/${row.id}`);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-end z-50">
      <div className="w-[520px] bg-slate-950 text-white h-full overflow-y-auto p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <div className="text-2xl font-bold">{row.payload?.vehicle || "Vehicle"}</div>
            <div className="text-sm text-slate-300">{row.payload?.name || "Customer"}</div>
            <div className="text-xs text-slate-500 mt-1">
              {new Date(row.created_at).toLocaleString()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="border border-slate-700 px-3 py-2 rounded-lg hover:border-slate-400"
          >
            Close
          </button>
        </div>

        {/* NOTES */}
        <div>
          <div className="text-sm text-slate-400 mb-1">Technician Notes</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-28 bg-slate-900 border border-slate-700 rounded-xl p-3"
            placeholder="Diagnosis, findings, recommendations..."
          />
        </div>

        {/* LABOR */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Labor</div>
            <button onClick={() => addLine(setLabor, labor)} className="text-xs text-blue-400">+ Add</button>
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

        {/* PARTS */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Parts</div>
            <button onClick={() => addLine(setParts, parts)} className="text-xs text-blue-400">+ Add</button>
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

        {/* GRAND TOTAL */}
        <div className="border-t border-slate-700 pt-4 text-right text-lg font-bold">
          Grand Total: ${grand.toFixed(2)}
        </div>

        {/* PRINT */}
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