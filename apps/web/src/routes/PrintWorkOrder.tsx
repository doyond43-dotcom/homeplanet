import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

type Line = { description: string; price: string };

type PrintData = {
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
};

export default function PrintWorkOrder() {
  const { id } = useParams();
  const nav = useNavigate();

  const data = useMemo<PrintData | null>(() => {
    try {
      const raw = sessionStorage.getItem("printWorkOrder");
      if (!raw) return null;
      return JSON.parse(raw) as PrintData;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    // Auto-open print dialog once the page loads (optional but nice)
    if (data) {
      setTimeout(() => window.print(), 250);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-white text-black p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-2xl font-bold">Nothing to print</div>
          <div className="mt-2 text-sm text-slate-700">
            The print payload was not found in sessionStorage. Go back to the board and press “Print Work Order” again.
          </div>
          <button
            className="mt-6 px-4 py-2 rounded border border-slate-300"
            onClick={() => nav(-1)}
          >
            Back
          </button>
          <div className="mt-4 text-xs text-slate-500">Requested ID: {String(id || "")}</div>
        </div>
      </div>
    );
  }

  const p = data.row?.payload ?? {};
  const vehicle = p.vehicle || "Vehicle";
  const customer = p.name || "Customer";

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b pb-4">
          <div>
            <div className="text-3xl font-bold">Work Order</div>
            <div className="text-sm text-slate-700 mt-1">
              Shop: <span className="font-semibold">{data.row.slug}</span>
            </div>
            <div className="text-sm text-slate-700">
              Created: <span className="font-semibold">{new Date(data.row.created_at).toLocaleString()}</span>
            </div>
            <div className="text-sm text-slate-700">
              Work Order ID: <span className="font-semibold">{data.row.id}</span>
            </div>
          </div>

          <button
            className="px-4 py-2 rounded border border-slate-300 print:hidden"
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>

        {/* Vehicle/Customer */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-3">
            <div className="text-xs uppercase text-slate-500">Vehicle</div>
            <div className="text-lg font-semibold">{vehicle}</div>
          </div>
          <div className="border rounded p-3">
            <div className="text-xs uppercase text-slate-500">Customer</div>
            <div className="text-lg font-semibold">{customer}</div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4 border rounded p-3">
          <div className="text-xs uppercase text-slate-500">Technician Notes</div>
          <div className="mt-2 whitespace-pre-wrap">{data.notes || ""}</div>
        </div>

        {/* Labor */}
        <div className="mt-6">
          <div className="text-lg font-bold">Labor</div>
          <div className="mt-2 border rounded overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-100 text-sm font-semibold px-3 py-2">
              <div className="col-span-9">Description</div>
              <div className="col-span-3 text-right">Price</div>
            </div>
            {(data.labor || []).filter(l => (l.description || "").trim() || (l.price || "").trim()).map((l, i) => (
              <div key={i} className="grid grid-cols-12 px-3 py-2 border-t text-sm">
                <div className="col-span-9">{l.description}</div>
                <div className="col-span-3 text-right">${(parseFloat(l.price) || 0).toFixed(2)}</div>
              </div>
            ))}
            <div className="px-3 py-2 border-t text-sm text-right">
              <span className="font-semibold">Labor Total:</span> ${Number(data.laborTotal || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Parts */}
        <div className="mt-6">
          <div className="text-lg font-bold">Parts</div>
          <div className="mt-2 border rounded overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-100 text-sm font-semibold px-3 py-2">
              <div className="col-span-9">Description</div>
              <div className="col-span-3 text-right">Price</div>
            </div>
            {(data.parts || []).filter(l => (l.description || "").trim() || (l.price || "").trim()).map((l, i) => (
              <div key={i} className="grid grid-cols-12 px-3 py-2 border-t text-sm">
                <div className="col-span-9">{l.description}</div>
                <div className="col-span-3 text-right">${(parseFloat(l.price) || 0).toFixed(2)}</div>
              </div>
            ))}
            <div className="px-3 py-2 border-t text-sm text-right">
              <span className="font-semibold">Parts Total:</span> ${Number(data.partsTotal || 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Grand */}
        <div className="mt-6 border-t pt-4 text-right text-2xl font-bold">
          Grand Total: ${Number(data.grand || 0).toFixed(2)}
        </div>

        <div className="mt-6 text-xs text-slate-500">
          Proof note: This printout is generated from a timestamp-anchored intake record.
        </div>
      </div>
    </div>
  );
}