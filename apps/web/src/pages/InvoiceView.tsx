import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type InvoiceRow = {
  id: string;
  created_at?: string | null;
  status?: string | null;
  invoice_number?: string | null;

  subtotal?: number | null;
  tax?: number | null;
  shipping?: number | null;
  discount?: number | null;
  deposit?: number | null;
  total?: number | null;

  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  customer_address?: string | null;

  meta?: any;
};

type InvoiceLineRow = {
  id: string;
  invoice_id: string;
  qty?: number | null;
  unit_price?: number | null;
  description?: string | null;
  created_at?: string | null;
};

function toNum(v: any, fallback = 0) {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : fallback;
}

function money(n: any) {
  const v = typeof n === "number" ? n : parseFloat(String(n ?? ""));
  if (!Number.isFinite(v)) return "$0.00";
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function fmtDate(d?: string | null) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString();
}

function safeText(v: any) {
  return String(v ?? "").trim();
}

function digitsPhone(v: any) {
  const raw = String(v ?? "").trim();
  if (!raw) return "";
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}

export default function InvoiceView() {
  const navigate = useNavigate();
  const params = useParams();
  const invoiceId = (params as any)?.invoiceId || (params as any)?.id || "";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<InvoiceRow | null>(null);
  const [lines, setLines] = useState<InvoiceLineRow[]>([]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setErr(null);

      try {
        const invRes = await supabase.from("invoices").select("*").eq("id", invoiceId).maybeSingle();
        if (invRes.error) throw invRes.error;
        if (!invRes.data) {
          setErr("Invoice not found.");
          return;
        }

        const linesRes = await supabase
          .from("invoice_lines")
          .select("id, invoice_id, qty, unit_price, description, created_at")
          .eq("invoice_id", invoiceId)
          .order("created_at", { ascending: true });

        if (linesRes.error) throw linesRes.error;

        if (alive) {
          setInvoice(invRes.data as any);
          setLines((linesRes.data ?? []) as any);
        }
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Failed to load invoice.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (invoiceId) run();

    return () => {
      alive = false;
    };
  }, [invoiceId]);

  const computed = useMemo(() => {
    const subtotal = lines.reduce((sum, ln) => sum + toNum(ln.qty, 0) * toNum(ln.unit_price, 0), 0);

    const tax = invoice?.tax ?? 0;
    const shipping = invoice?.shipping ?? 0;
    const discount = invoice?.discount ?? 0;
    const deposit = invoice?.deposit ?? 0;

    const total = subtotal + toNum(tax) + toNum(shipping) - toNum(discount) - toNum(deposit);

    return { subtotal, tax, shipping, discount, deposit, total };
  }, [lines, invoice]);

  // Demo-friendly placeholders (only used if DB values are blank)
  const demo = useMemo(() => {
    const meta = (invoice?.meta ?? {}) as any;

    const name = safeText(invoice?.customer_name) || safeText(meta.customer_name) || "John & Jane Homeowner";
    const address = safeText(invoice?.customer_address) || safeText(meta.customer_address) || "123 Sunshine Blvd";
    const cityStateZip = safeText(meta.city_state_zip) || "Okeechobee, FL 34974";
    const phone = safeText(invoice?.customer_phone) || safeText(meta.customer_phone) || "(863) 555-0147";
    const email = safeText(invoice?.customer_email) || safeText(meta.customer_email) || "customer@example.com";

    return { name, address, cityStateZip, phone, email };
  }, [invoice]);

  const invoiceNumber = invoice?.invoice_number ?? `AWN-${String(invoice?.id ?? "").slice(0, 6).toUpperCase()}`;

  const estimateSubject = useMemo(() => {
    return `Estimate / Invoice ${invoiceNumber} – Awnit`;
  }, [invoiceNumber]);

  const estimateBody = useMemo(() => {
    const lineText =
      lines.length > 0
        ? lines
            .map((ln) => {
              const qty = toNum(ln.qty);
              const unit = toNum(ln.unit_price);
              const total = qty * unit;
              return `• ${qty} x ${safeText(ln.description) || "Line Item"} — ${money(total)}`;
            })
            .join("\n")
        : "• No line items added yet";

    return [
      `Hi ${demo.name},`,
      ``,
      `Here is your estimate / invoice from Awnit.`,
      ``,
      `Invoice Number: ${invoiceNumber}`,
      `Invoice Date: ${fmtDate(invoice?.created_at) || "Today"}`,
      ``,
      `Project Address:`,
      `${demo.address}`,
      `${demo.cityStateZip}`,
      ``,
      `Items:`,
      `${lineText}`,
      ``,
      `Subtotal: ${money(computed.subtotal)}`,
      `Tax: ${money(computed.tax)}`,
      `Total: ${money(computed.total)}`,
      ``,
      `Thank you,`,
      `Awnit`,
      `Awnit.com`,
      `(863) 634-3100`,
    ].join("\n");
  }, [demo, invoiceNumber, invoice?.created_at, lines, computed]);

  const emailHref = useMemo(() => {
    const email = safeText(demo.email);
    if (!email) return "";
    return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
      estimateSubject
    )}&body=${encodeURIComponent(estimateBody)}`;
  }, [demo.email, estimateSubject, estimateBody]);

  const smsHref = useMemo(() => {
    const phone = digitsPhone(demo.phone);
    if (!phone) return "";
    return `sms:${phone}?&body=${encodeURIComponent(
      `Awnit estimate / invoice ${invoiceNumber}\nTotal: ${money(computed.total)}`
    )}`;
  }, [demo.phone, invoiceNumber, computed.total]);

  // ONE-PAGE PRINT: total table rows (real lines + blanks) capped so it won't spill
  const MAX_TABLE_ROWS_ONE_PAGE = 12;
  const blankRowsCount = Math.max(0, MAX_TABLE_ROWS_ONE_PAGE - (lines?.length ?? 0));
  const blankRows = Array.from({ length: blankRowsCount });

  return (
    <div className="min-h-screen bg-gray-200 py-10 text-black">
      <div className="max-w-5xl mx-auto px-6">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap justify-between gap-2 no-print">
          <button onClick={() => navigate(-1)} className="border border-black px-4 py-2 rounded bg-white">
            ← Back
          </button>

          <div className="flex flex-wrap gap-2">
            {emailHref ? (
              <a
                href={emailHref}
                className="border border-black px-4 py-2 rounded bg-white font-semibold"
                title="Open email app with estimate prefilled"
              >
                Email Customer
              </a>
            ) : null}

            {smsHref ? (
              <a
                href={smsHref}
                className="border border-black px-4 py-2 rounded bg-white font-semibold"
                title="Text customer"
              >
                Text Customer
              </a>
            ) : null}

            <button onClick={() => window.print()} className="border border-black px-4 py-2 rounded bg-white font-semibold">
              Print
            </button>
          </div>
        </div>

        {loading && <div className="text-sm">Loading invoice…</div>}
        {err && <div className="text-red-600 text-sm">{err}</div>}

        {!loading && !err && invoice && (
          <div
            className="bg-[#fdfdfc] border-2 border-black shadow-xl p-10"
            style={{ breakInside: "avoid", pageBreakInside: "avoid" as any }}
          >
            {/* Header */}
            <div className="flex justify-between mb-8">
              <div>
                <div className="text-4xl font-extrabold tracking-tight">Awnit</div>
                <div className="mt-1 text-sm">Awnit.com</div>
                <div className="text-sm">(863) 634-3100</div>
                <div className="text-sm">Okeechobee, FL</div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold tracking-wide">INVOICE</div>
                <div className="text-2xl font-extrabold mt-1">{invoiceNumber}</div>
                <div className="mt-2 text-sm">Invoice Date: {fmtDate(invoice.created_at)}</div>
              </div>
            </div>

            {/* Quick send strip */}
            <div className="mb-6 rounded-xl border border-black bg-gray-50 p-4 no-print">
              <div className="text-sm font-bold">Field Actions</div>
              <div className="mt-1 text-sm">
                Send this estimate / invoice to the customer immediately from the tablet or phone.
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {emailHref ? (
                  <a
                    href={emailHref}
                    className="border border-black px-4 py-2 rounded bg-white font-semibold"
                  >
                    Send Estimate by Email
                  </a>
                ) : (
                  <div className="text-sm text-red-700">Customer email missing</div>
                )}

                {smsHref ? (
                  <a
                    href={smsHref}
                    className="border border-black px-4 py-2 rounded bg-white font-semibold"
                  >
                    Text Customer
                  </a>
                ) : null}
              </div>
            </div>

            {/* Customer block (paper-style lines) */}
            <div className="mb-8">
              <div className="font-semibold border-b border-black pb-1 mb-3">Customer</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex gap-2">
                  <div className="w-24 font-semibold">Name:</div>
                  <div className="flex-1 border-b border-black">{demo.name}</div>
                </div>

                <div className="flex gap-2">
                  <div className="w-24 font-semibold">Phone:</div>
                  <div className="flex-1 border-b border-black">{demo.phone}</div>
                </div>

                <div className="flex gap-2">
                  <div className="w-24 font-semibold">Address:</div>
                  <div className="flex-1 border-b border-black">{demo.address}</div>
                </div>

                <div className="flex gap-2">
                  <div className="w-24 font-semibold">Email:</div>
                  <div className="flex-1 border-b border-black">{demo.email}</div>
                </div>

                <div className="flex gap-2 md:col-span-2">
                  <div className="w-24 font-semibold">City/Zip:</div>
                  <div className="flex-1 border-b border-black">{demo.cityStateZip}</div>
                </div>
              </div>
            </div>

            {/* Line Table */}
            <table className="w-full border-collapse border border-black mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 w-16">Qty</th>
                  <th className="border border-black p-2 text-left">Description</th>
                  <th className="border border-black p-2 w-32 text-right">Unit Price</th>
                  <th className="border border-black p-2 w-32 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {/* Real lines */}
                {lines.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="border border-black p-3 text-sm">
                      No line items.
                    </td>
                  </tr>
                ) : (
                  lines.map((ln) => {
                    const qty = toNum(ln.qty);
                    const unit = toNum(ln.unit_price);
                    const total = qty * unit;

                    return (
                      <tr key={ln.id}>
                        <td className="border border-black p-2 text-center">{qty}</td>
                        <td className="border border-black p-2 text-sm">{ln.description}</td>
                        <td className="border border-black p-2 text-right text-sm">{money(unit)}</td>
                        <td className="border border-black p-2 text-right font-semibold text-sm">
                          {money(total)}
                        </td>
                      </tr>
                    );
                  })
                )}

                {/* Blank rows */}
                {blankRows.map((_, idx) => (
                  <tr key={`blank_${idx}`} className="h-7">
                    <td className="border border-black p-2 text-center">&nbsp;</td>
                    <td className="border border-black p-2">&nbsp;</td>
                    <td className="border border-black p-2 text-right">&nbsp;</td>
                    <td className="border border-black p-2 text-right">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80 border-2 border-black p-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{money(computed.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>{money(computed.tax)}</span>
                </div>

                <div className="border-t-2 border-black mt-3 pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{money(computed.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-sm">Thank you for your business!</div>

            <div className="no-print mt-4 text-xs text-gray-600">
              Demo note: customer details show real DB values when present; otherwise placeholders are shown for a complete demo invoice.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}