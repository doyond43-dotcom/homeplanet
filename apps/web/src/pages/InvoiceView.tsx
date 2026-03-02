import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { supabase } from "../lib/supabase";

type InvoiceRow = {
  id: string;
  created_at?: string | null;
  status?: string | null;

  // Totals
  subtotal?: number | null;
  tax?: number | null;
  shipping?: number | null;
  discount?: number | null;
  deposit?: number | null;
  total?: number | null;

  // Customer snapshot fields (if your table has them)
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  customer_address?: string | null;

  // Optional metadata
  meta?: any;
};

type InvoiceLineRow = {
  id: string;
  invoice_id: string;
  line_type: "labor" | "material" | "part" | "fee" | "note" | string;
  qty?: number | null;
  unit_price?: number | null;
  description?: string | null;
  created_at?: string | null;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function money(n: any) {
  const v = typeof n === "number" ? n : parseFloat(String(n ?? ""));
  if (!Number.isFinite(v)) return "$0.00";
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function InvoiceView() {
  const navigate = useNavigate();

  // Support either :invoiceId or :id depending on your route
  const params = useParams();
  const invoiceId = (params as any)?.invoiceId || (params as any)?.id || "";

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<InvoiceRow | null>(null);
  const [lines, setLines] = useState<InvoiceLineRow[]>([]);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!invoiceId) {
        setErr("Missing invoice id.");
        setInvoice(null);
        setLines([]);
        return;
      }

      // Helpful failure message if env keys are missing.
      const url = (import.meta as any).env?.VITE_SUPABASE_URL;
      const anon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
      if (!url || !anon) {
        setErr("Supabase env missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErr(null);

        const invRes = await supabase
          .from("invoices")
          .select("*")
          .eq("id", invoiceId)
          .maybeSingle();

        if (invRes.error) throw invRes.error;
        if (!invRes.data) throw new Error("Invoice not found.");

        const linesRes = await supabase
          .from("invoice_lines")
          .select("*")
          .eq("invoice_id", invoiceId)
          .order("created_at", { ascending: true });

        if (linesRes.error) throw linesRes.error;

        if (!alive) return;
        setInvoice(invRes.data as any);
        setLines((linesRes.data || []) as any);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load invoice.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [invoiceId]);

  const shell =
    "min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-100";
  const wrap = "mx-auto max-w-4xl px-4 py-6";
  const card =
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.06)]";

  const pillBtn =
    "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold border border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 transition";
  const greenBtn =
    "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-bold border border-emerald-400/30 bg-emerald-400/15 hover:bg-emerald-400/20 active:bg-emerald-400/25 transition";

  const grouped = useMemo(() => {
    const labor = lines.filter((l) => l.line_type === "labor");
    const material = lines.filter((l) => l.line_type === "material");
    const other = lines.filter((l) => l.line_type !== "labor" && l.line_type !== "material");
    return { labor, material, other };
  }, [lines]);

  return (
    <div className={shell}>
      <div className={wrap}>
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            className={pillBtn}
            onClick={() => navigate("/planet/vehicles/awnit-demo")}
          >
            ← Back to Board
          </button>

          <div className="flex items-center gap-2">
            <button type="button" className={pillBtn} onClick={() => window.print()}>
              Print
            </button>
            <button
              type="button"
              className={greenBtn}
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href).catch(() => {});
              }}
            >
              Copy Link
            </button>
          </div>
        </div>

        <div className={cn(card, "p-5")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold tracking-wide text-emerald-300/90">
                AWNIT — Invoice
              </div>
              <div className="text-2xl font-extrabold leading-tight">
                {invoiceId ? `#${String(invoiceId).slice(0, 8).toUpperCase()}` : "#—"}
              </div>
              <div className="mt-1 text-sm text-slate-300">
                {invoice?.created_at ? new Date(invoice.created_at).toLocaleString() : "—"}
              </div>
            </div>

            <div className="text-right text-sm text-slate-300">
              <div>
                Status:{" "}
                <span className="font-extrabold text-slate-100">{invoice?.status ?? "draft"}</span>
              </div>
            </div>
          </div>

          {loading && (
            <div className="mt-5 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-slate-300">
              Loading invoice…
            </div>
          )}

          {err && !loading && (
            <div className="mt-5 rounded-xl border border-rose-300/30 bg-rose-300/10 px-3 py-3 text-sm text-rose-100">
              {err}
            </div>
          )}

          {!loading && !err && invoice && (
            <>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-extrabold">Customer</div>
                  <div className="mt-2 text-sm">
                    <div className="font-bold">{invoice.customer_name ?? "—"}</div>
                    <div className="text-slate-300">{invoice.customer_phone ?? "—"}</div>
                    <div className="text-slate-300">{invoice.customer_email ?? "—"}</div>
                    <div className="text-slate-300 whitespace-pre-line">
                      {invoice.customer_address ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm font-extrabold">Totals</div>
                  <div className="mt-2 space-y-1 text-sm text-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Subtotal</span>
                      <span className="font-bold">{money(invoice.subtotal ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Tax</span>
                      <span className="font-bold">{money(invoice.tax ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Shipping</span>
                      <span className="font-bold">{money(invoice.shipping ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Deposit</span>
                      <span className="font-bold">-{money(invoice.deposit ?? 0)}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10 flex justify-between">
                      <span className="text-slate-200 font-extrabold">Total</span>
                      <span className="text-slate-100 font-extrabold">{money(invoice.total ?? 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {grouped.labor.length > 0 && (
                  <Section title="Scope / Labor">
                    {grouped.labor.map((l) => (
                      <LineRow key={l.id} line={l} />
                    ))}
                  </Section>
                )}

                {grouped.material.length > 0 && (
                  <Section title="Materials">
                    {grouped.material.map((l) => (
                      <LineRow key={l.id} line={l} />
                    ))}
                  </Section>
                )}

                {grouped.other.length > 0 && (
                  <Section title="Other">
                    {grouped.other.map((l) => (
                      <LineRow key={l.id} line={l} />
                    ))}
                  </Section>
                )}

                {lines.length === 0 && (
                  <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-slate-300">
                    No line items.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="h-8" />
      </div>

      <style>{`
        @media print {
          button { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-extrabold">{title}</div>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}

function LineRow({ line }: { line: any }) {
  const qty = typeof line.qty === "number" ? line.qty : parseFloat(String(line.qty ?? "")) || 1;
  const unit =
    typeof line.unit_price === "number" ? line.unit_price : parseFloat(String(line.unit_price ?? "")) || 0;
  const ext = qty * unit;

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-100 whitespace-pre-line">
          {line.description ?? "—"}
        </div>
        <div className="text-[11px] text-slate-400">
          {line.line_type ?? "line"} • Qty {qty} • Unit {unit.toFixed(2)}
        </div>
      </div>
      <div className="shrink-0 text-sm font-extrabold text-slate-100">{money(ext)}</div>
    </div>
  );
}
