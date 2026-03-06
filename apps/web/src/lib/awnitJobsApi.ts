// src/lib/awnitJobsApi.ts
import { supabase } from "./supabase";

/**
 * IMPORTANT:
 * scope_items + materials are JSONB arrays of OBJECTS (not string arrays).
 * Do NOT stringify them. Persist them as arrays.
 */
export type AwnitJobRow = {
  id: string;

  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  customer_address: string | null;

  title: string | null;
  summary: string;

  stage: string | null;

  appt_date: string | null;
  appt_time: string | null;
  crew: string | null;

  // ? JSONB arrays (object shapes owned by UI)
  scope_items: any[]; // NOT NULL
  materials: any[]; // NOT NULL
  tech_notes: string; // NOT NULL

  // ? DB constraint: meta is NOT NULL
  meta: Record<string, any>;

  created_at?: string;
  updated_at?: string;
};

export type AwnitCreateJobInput = {
  // required
  customer_name: string;
  summary: string;

  // optional
  customer_phone?: string | null;
  customer_email?: string | null;
  customer_address?: string | null;

  title?: string | null;
  stage?: string | null;

  appt_date?: string | null;
  appt_time?: string | null;
  crew?: string | null;

  scope_items?: any[] | null;
  materials?: any[] | null;
  tech_notes?: string | null;

  meta?: Record<string, any> | null;
};

export type AwnitUpdateJobInput = Partial<Omit<AwnitCreateJobInput, "customer_name" | "summary">> & {
  customer_name?: string;
  summary?: string;
};

function throwIfError(error: any, fallbackMsg: string) {
  if (!error) return;
  const msg = error?.message || fallbackMsg;
  throw new Error(msg);
}

function normStr(v: any) {
  return String(v ?? "").trim();
}

function normOptStr(v: any) {
  const s = String(v ?? "").trim();
  return s ? s : null;
}

function normNotes(v: any): string {
  return String(v ?? "").trim();
}

function normMeta(v: any): Record<string, any> {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, any>;
  return {};
}

/**
 * ? JSONB array normalizer
 * - Keep objects as-is
 * - Never return null
 */
function normJsonArray(v: any): any[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return [];
}

function isEmptyObj(o: any) {
  return !o || (typeof o === "object" && !Array.isArray(o) && Object.keys(o).length === 0);
}

function normalizeRow(row: any): AwnitJobRow {
  const r = row as any;
  if (!r.meta) r.meta = {};
  if (!Array.isArray(r.scope_items)) r.scope_items = [];
  if (!Array.isArray(r.materials)) r.materials = [];
  if (typeof r.tech_notes !== "string") r.tech_notes = "";
  return r as AwnitJobRow;
}

/**
 * Creates a job in public.awnit_jobs using flat columns.
 * IMPORTANT: Do not nest { customer: { ... } }
 * IMPORTANT: scope_items/materials must NEVER be null
 * IMPORTANT: meta must NEVER be null
 */
export async function awnitCreateJob(input: AwnitCreateJobInput): Promise<AwnitJobRow> {
  const customer_name = normStr(input.customer_name);
  const summary = normStr(input.summary);

  if (!customer_name) throw new Error("customer_name is required");
  if (!summary) throw new Error("summary is required");

  const payload = {
    customer_name,
    customer_phone: normOptStr(input.customer_phone),
    customer_email: normOptStr(input.customer_email),
    customer_address: normOptStr(input.customer_address),

    title: normStr(input.title || summary).slice(0, 80),
    summary,

    stage: normStr(input.stage || "Scheduled") || "Scheduled",

    appt_date: input.appt_date ?? null,
    appt_time: input.appt_time ?? null,
    crew: input.crew ?? null,

    // ? NEVER NULL JSON arrays
    scope_items: normJsonArray(input.scope_items),
    materials: normJsonArray(input.materials),
    tech_notes: normNotes(input.tech_notes),

    // ? NEVER NULL object
    meta: normMeta(input.meta),
  };

  console.log("[awnitCreateJob] INSERT payload:", payload);

  const res = await supabase.from("awnit_jobs").insert([payload]).select("*").maybeSingle();

  if (res.error) {
    console.error("[awnitCreateJob] ERROR:", res.error);
    throwIfError(res.error, "Failed to create job.");
  }
  if (!res.data) throw new Error("Create job returned no data.");

  return normalizeRow(res.data);
}

/**
 * Lists jobs for the board.
 */
export async function awnitListJobs(): Promise<AwnitJobRow[]> {
  const res = await supabase.from("awnit_jobs").select("*").order("created_at", { ascending: false });

  if (res.error) {
    console.error("[awnitListJobs] ERROR:", res.error);
    throwIfError(res.error, "Failed to list jobs.");
  }

  return (res.data ?? []).map(normalizeRow);
}

/**
 * Updates a job by id.
 *
 * ? CRITICAL:
 * - Do NOT stringify JSON arrays
 * - Throw if update returns 0 rows (commonly RLS/policy)
 */
export async function awnitUpdateJob(id: string, patch: AwnitUpdateJobInput): Promise<AwnitJobRow> {
  if (!id) throw new Error("id is required");

  const updatePayload: any = {};

  // strings
  if (patch.customer_name !== undefined) updatePayload.customer_name = normStr(patch.customer_name);
  if (patch.summary !== undefined) updatePayload.summary = normStr(patch.summary);
  if (patch.title !== undefined) updatePayload.title = patch.title ? normStr(patch.title).slice(0, 80) : null;

  if (patch.customer_phone !== undefined) updatePayload.customer_phone = normOptStr(patch.customer_phone);
  if (patch.customer_email !== undefined) updatePayload.customer_email = normOptStr(patch.customer_email);
  if (patch.customer_address !== undefined) updatePayload.customer_address = normOptStr(patch.customer_address);

  if (patch.stage !== undefined) updatePayload.stage = patch.stage ? normStr(patch.stage) : null;

  // schedule
  if (patch.appt_date !== undefined) updatePayload.appt_date = patch.appt_date ?? null;
  if (patch.appt_time !== undefined) updatePayload.appt_time = patch.appt_time ?? null;
  if (patch.crew !== undefined) updatePayload.crew = patch.crew ?? null;

  // ? JSON arrays: NEVER NULL, NEVER STRINGIFY
  if (patch.scope_items !== undefined) updatePayload.scope_items = normJsonArray(patch.scope_items);
  if (patch.materials !== undefined) updatePayload.materials = normJsonArray(patch.materials);

  // ? notes: NEVER NULL
  if (patch.tech_notes !== undefined) updatePayload.tech_notes = normNotes(patch.tech_notes);

  // ? meta: NEVER NULL
  if (patch.meta !== undefined) updatePayload.meta = normMeta(patch.meta);

  // Avoid PATCH {} -> 406; return current row
  if (isEmptyObj(updatePayload) || Object.keys(updatePayload).length === 0) {
    console.warn("[awnitUpdateJob] Empty patch; skipping update + returning current row.");
    const cur = await supabase.from("awnit_jobs").select("*").eq("id", id).maybeSingle();
    if (cur.error) throwIfError(cur.error, "Failed to fetch job after empty patch.");
    if (!cur.data) throw new Error("Job not found.");
    return normalizeRow(cur.data);
  }

  console.log("[awnitUpdateJob] UPDATE payload:", { id, ...updatePayload });

  const res = await supabase.from("awnit_jobs").update(updatePayload).eq("id", id).select("*").maybeSingle();

  if (res.error) {
    console.error("[awnitUpdateJob] ERROR:", res.error);
    throwIfError(res.error, "Failed to update job.");
  }

  // ?? If RLS blocks, you can get null data with no error.
  if (!res.data) {
    const msg =
      "Update blocked (0 rows returned). Usually RLS/policy preventing update for this row/column.";
    console.error("[awnitUpdateJob]", msg, { id, updatePayload });
    throw new Error(msg);
  }

  return normalizeRow(res.data);
}
