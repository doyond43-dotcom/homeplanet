import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { PrintData } from "./WorkOrderDrawer";

const SHOP = {
  name: "Taylor Creek Auto Repair Inc",
  address1: "3826 Highway 441 SE",
  cityStateZip: "Okeechobee, FL 34974",
  phone: "(863) 357-2880",
  mvRegistration: "MV-112385",
};

function money(n: unknown) {
  const v = Number(n || 0);
  return v.toFixed(2);
}

export default function PrintWorkOrder() {
  const { id: routeId } = useParams();
  const loc = useLocation();
  const nav = useNavigate();

  const printId = useMemo(() => {
    const q = new URLSearchParams(loc.search).get("print");
    return (q || routeId || "").trim();
  }, [loc.search, routeId]);

  const [data, setData] = useState<PrintData | null>(null);

  useEffect(() => {
    if (!printId) {
      setData(null);
      return;
    }

    const tryRead = () => {
      try {
        const rawScoped = sessionStorage.getItem(`printWorkOrder:${printId}`);
        if (rawScoped) return JSON.parse(rawScoped) as PrintData;
      } catch {}

      try {
        const raw = sessionStorage.getItem("printWorkOrder");
        if (raw) return JSON.parse(raw) as PrintData;
      } catch {}

      try {
        const rawDraft = localStorage.getItem(`workOrderDraft:${printId}`);
        if (rawDraft) return JSON.parse(rawDraft) as PrintData;
      } catch {}

      return null;
    };

    setData(tryRead());
  }, [printId]);

  useEffect(() => {
    if (!data) return;
    const t = window.setTimeout(() => window.print(), 250);
    return () => window.clearTimeout(t);
  }, [data]);

  if (!printId) {
    return (
      <div className="min-h-screen bg-white text-black p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-2xl font-bold">Nothing to print</div>
          <div className="mt-2 text-sm text-slate-700">Missing print id in URL.</div>
          <button className="mt-6 px-4 py-2 rounded border border-slate-300" onClick={() => nav(-1)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white text-black p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-2xl font-bold">Loading work order…</div>
          <div className="mt-2 text-sm text-slate-700">
            If you refreshed the print page, the session snapshot may be gone. Go back to the board and press{" "}
            <b>Print Work Order</b> again.
          </div>
          <button className="mt-6 px-4 py-2 rounded border border-slate-300" onClick={() => nav(-1)}>
            Back
          </button>
          <div className="mt-4 text-xs text-slate-500">Requested ID: {printId}</div>
        </div>
      </div>
    );
  }

  const p = data.row?.payload ?? {};
  const vehicle = p.vehicle || "Vehicle";
  const customer = p.name || "Customer";
  const customerPhone = p.phone || p.phone_number || p.customer_phone || "";

  const techName = (data.technicianName || "").trim();
  const techCode = (data.technicianCode || "").trim();
  const techLine = techName || techCode
    ? `${techName || "Technician"}${techCode ? ` (Code ${techCode})` : ""}`
    : "";

  const laborLines = (data.labor || []).filter(
    (l) => (l.description || "").trim() || (l.price || "").trim()
  );
  const partsLines = (data.parts || []).filter(
    (l) => (l.description || "").trim() || (l.price || "").trim()
  );

  return (
    <div className="min-h-screen bg-white text-black p-3 print:p-0">
      <style>{`
        @page { size: letter landscape; margin: 0.45in; }
        @media print {
          html, body { background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="mx-auto" style={{ maxWidth: "10.5in" }}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b pb-2">
          <div className="min-w-0">
            <div className="text-xl font-bold leading-tight">{SHOP.name}</div>

            <div className="text-xs text-slate-700 leading-tight">
              {SHOP.address1} • {SHOP.cityStateZip} • Phone: {SHOP.phone}
            </div>

            {/* ✅ MV REGISTRATION LINE */}
            <div className="text-xs text-slate-700 leading-tight">
              FLORIDA REGISTRATION:{" "}
              <span className="font-semibold">{SHOP.mvRegistration}</span>
            </div>

            <div className="mt-2 text-xs text-slate-700">
              Date/Time:{" "}
              <span className="font-semibold">
                {new Date(data.row.created_at).toLocaleString()}
              </span>
              <span className="mx-2">•</span>
              Work Order ID:{" "}
              <span className="font-semibold">{data.row.id}</span>
            </div>

            {techLine ? (
              <div className="text-xs text-slate-700">
                Technician: <span className="font-semibold">{techLine}</span>
              </div>
            ) : null}
          </div>

          <button
            className="no-print px-3 py-2 rounded border border-slate-300"
            onClick={() => window.print()}
          >
            Print
          </button>
        </div>

        {/* Body */}
        <div className="mt-3 grid grid-cols-12 gap-3">
          <div className="col-span-5 space-y-2">
            <div className="border rounded p-2">
              <div className="text-[10px] uppercase text-slate-500">Vehicle</div>
              <div className="text-sm font-semibold">{vehicle}</div>
            </div>

            <div className="border rounded p-2">
              <div className="text-[10px] uppercase text-slate-500">Customer</div>
              <div className="text-sm font-semibold">{customer}</div>
              {customerPhone ? (
                <div className="text-xs text-slate-700 mt-1">
                  Phone: {customerPhone}
                </div>
              ) : null}
            </div>

            <div className="border rounded p-2" style={{ minHeight: "1.6in" }}>
              <div className="text-[10px] uppercase text-slate-500">
                Technician Notes
              </div>
              <div className="mt-1 text-xs whitespace-pre-wrap">
                {data.notes || ""}
              </div>
            </div>
          </div>

          <div className="col-span-7 space-y-2">
            <div className="border rounded overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-100 text-xs font-semibold px-2 py-1">
                <div className="col-span-9">Labor</div>
                <div className="col-span-3 text-right">Price</div>
              </div>

              {laborLines.length ? (
                laborLines.slice(0, 6).map((l, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 px-2 py-1 border-t text-xs"
                  >
                    <div className="col-span-9">{l.description}</div>
                    <div className="col-span-3 text-right">
                      ${money(parseFloat(l.price) || 0)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-2 py-2 border-t text-xs text-slate-500">
                  —
                </div>
              )}

              <div className="px-2 py-1 border-t text-xs text-right">
                <span className="font-semibold">Labor Total:</span>{" "}
                ${money(data.laborTotal)}
              </div>
            </div>

            <div className="border rounded overflow-hidden">
              <div className="grid grid-cols-12 bg-slate-100 text-xs font-semibold px-2 py-1">
                <div className="col-span-9">Parts</div>
                <div className="col-span-3 text-right">Price</div>
              </div>

              {partsLines.length ? (
                partsLines.slice(0, 6).map((l, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 px-2 py-1 border-t text-xs"
                  >
                    <div className="col-span-9">{l.description}</div>
                    <div className="col-span-3 text-right">
                      ${money(parseFloat(l.price) || 0)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-2 py-2 border-t text-xs text-slate-500">
                  —
                </div>
              )}

              <div className="px-2 py-1 border-t text-xs text-right">
                <span className="font-semibold">Parts Total:</span>{" "}
                ${money(data.partsTotal)}
              </div>
            </div>

            <div className="text-right text-xl font-bold pt-1">
              Total Due: ${money(data.grand)}
            </div>

            <div className="text-[10px] text-slate-500">
              Proof note: This printout is generated from a timestamp-anchored intake record.
              {techCode ? ` • Technician Code: ${techCode}` : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}