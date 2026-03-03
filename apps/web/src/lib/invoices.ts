import { supabase } from "./supabaseClient";

export type UiInvoiceLine = {
  qty: number;
  description: string;
  unit_price: number;
};

function toNum(v: any, fallback = 0) {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Creates an invoice + invoice_lines from a Job object.
 *
 * IMPORTANT:
 * - You MUST map your job drawer fields into `lines` below.
 * - Right now this supports 2 optional arrays on the job:
 *   - job.material_items: [{ qty, description, unit_price }]
 *   - job.labor_items:    [{ qty, description, unit_price }]
 *
 * If your job uses different fields, paste your job shape and we’ll adjust.
 */
export async function createInvoiceFromJob(input: any) {
  // Supports:
  //  - createInvoiceFromJob(job)
  //  - createInvoiceFromJob({ job, scopeItems, materials, notes })
  const payload = input?.job ? input : { job: input, scopeItems: [], materials: [], notes: "" };
  const job = payload?.job;

  // ---- DEMO SAFETY: if job.id is NOT a UUID (ex: "job_1001"), use LOCAL invoice mode ----
  const isUuid = (v: any) => typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

  if (!isUuid(job?.id)) {
    const id = `inv_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
    const key = `awnit_demo_invoice_${id}`;

    const localPayload = {
      id,
      mode: "local",
      created_at: new Date().toISOString(),
      job: job ?? null,
      scopeItems: payload?.scopeItems ?? [],
      materials: payload?.materials ?? [],
      notes: payload?.notes ?? "",
    };

    try { localStorage.setItem(key, JSON.stringify(localPayload)); } catch {}
    return id;
  }

  if (!job?.id) throw new Error("createInvoiceFromJob: job.id is required");

  const lines: UiInvoiceLine[] = [];

  // 1) Materials -> lines (adjust mapping to match your job shape)
  if (Array.isArray(job.material_items)) {
    for (const m of job.material_items) {
      const description = String(m?.description ?? "").trim();
      if (!description) continue;

      lines.push({
        qty: toNum(m?.qty, 1),
        description,
        unit_price: toNum(m?.unit_price, 0),
      });
    }
  }

  // 2) Labor -> lines (adjust mapping to match your job shape)
  if (Array.isArray(job.labor_items)) {
    for (const l of job.labor_items) {
      const description = String(l?.description ?? "").trim();
      if (!description) continue;

      lines.push({
        qty: toNum(l?.qty, 1),
        description,
        unit_price: toNum(l?.unit_price, 0),
      });
    }
  }

  // 3) Fallback if nothing structured yet
  if (lines.length === 0) {
    lines.push({
      qty: 1,
      description: "Scope of work (see job details)",
      unit_price: 0,
    });
  }

  // Totals (tax/shipping/deposit can come from job fields if you store them)
  const subtotal = lines.reduce(
    (sum, x) => sum + toNum(x.qty, 1) * toNum(x.unit_price, 0),
    0
  );

  const tax = toNum(job?.tax, 0);
  const shipping = toNum(job?.shipping, 0);
  const total = subtotal + tax + shipping;
  const deposit = toNum(job?.deposit, 0);
  const balance = total - deposit;

  // 4) Create invoice row (invoice_number defaults in DB)
  const { data: inv, error: invErr } = await supabase
    .from("invoices")
    .insert({
      job_id: job.id,
      status: "draft",
      subtotal,
      tax,
      shipping,
      total,
      deposit,
      balance,
    })
    .select("*")
    .single();

  if (invErr) throw invErr;

  // 5) Insert invoice lines
  const lineRows = lines.map((x) => ({
    invoice_id: inv.id,
    qty: toNum(x.qty, 1),
    description: String(x.description ?? "").trim(),
    unit_price: toNum(x.unit_price, 0),
    line_total: toNum(x.qty, 1) * toNum(x.unit_price, 0),
  }));

  const { error: lineErr } = await supabase.from("invoice_lines").insert(lineRows);
  if (lineErr) throw lineErr;

  return inv;
}


