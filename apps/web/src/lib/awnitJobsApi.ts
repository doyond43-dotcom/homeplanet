import { supabase } from "./supabase";

type UiCustomer = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type UiAwnitJob = {
  id: string;
  title: string;
  summary: string;
  stage: string;

  customer: UiCustomer;

  apptDate?: string | null;
  apptTime?: string | null;
  crew?: string | null;

  scopeItems: string[];
  materials: string[];
  techNotes: string;
  meta: Record<string, any>;

  createdAt?: string | null;
  updatedAt?: string | null;
};

function throwIfError(error: any, msg: string) {
  if (!error) return;
  throw new Error(error?.message || msg);
}

function toUiJob(r: any): UiAwnitJob {
  return {
    id: r.id,
    title: r.title ?? "",
    summary: r.summary ?? "",
    stage: r.stage ?? "Scheduled",

    customer: {
      name: r.customer_name ?? "",
      phone: r.customer_phone ?? "",
      email: r.customer_email ?? "",
      address: r.customer_address ?? "",
    },

    apptDate: r.appt_date ?? null,
    apptTime: r.appt_time ?? null,
    crew: r.crew ?? null,

    scopeItems: Array.isArray(r.scope_items) ? r.scope_items : [],
    materials: Array.isArray(r.materials) ? r.materials : [],

    // IMPORTANT: normalize NULL -> ""
    techNotes: typeof r.tech_notes === "string" ? r.tech_notes : "",
    meta: r.meta && typeof r.meta === "object" ? r.meta : {},

    createdAt: r.created_at ?? null,
    updatedAt: r.updated_at ?? null,
  };
}

function toDbCreate(input: {
  title?: string;
  summary: string;
  stage?: string;
  customer: UiCustomer;
  apptDate?: string | null;
  apptTime?: string | null;
  crew?: string | null;
  scopeItems?: string[];
  materials?: string[];
  techNotes?: string | null;
  meta?: Record<string, any>;
}) {
  return {
    title: (input.title ?? input.summary ?? "").trim(),
    summary: (input.summary ?? "").trim(),
    stage: (input.stage ?? "Scheduled").trim(),

    customer_name: (input.customer?.name ?? "").trim(),
    customer_phone: (input.customer?.phone ?? "").trim() || null,
    customer_email: (input.customer?.email ?? "").trim() || null,
    customer_address: (input.customer?.address ?? "").trim() || null,

    appt_date: input.apptDate ?? null,
    appt_time: input.apptTime ?? null,
    crew: input.crew ?? null,

    scope_items: Array.isArray(input.scopeItems) ? input.scopeItems : [],
    materials: Array.isArray(input.materials) ? input.materials : [],

    // IMPORTANT: do NOT send null if the column is not-null (or you flip it back later)
    tech_notes: (input.techNotes ?? "").toString(),

    meta: input.meta && typeof input.meta === "object" ? input.meta : {},
  };
}

/* =========================
   LIST JOBS
========================= */
export async function awnitListJobs(): Promise<UiAwnitJob[]> {
  const { data, error } = await supabase
    .from("awnit_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  throwIfError(error, "awnitListJobs failed");
  return (data ?? []).map(toUiJob);
}

/* =========================
   GET JOB BY ID
========================= */
export async function awnitGetJob(id: string): Promise<UiAwnitJob | null> {
  const { data, error } = await supabase
    .from("awnit_jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  throwIfError(error, "awnitGetJob failed");
  return data ? toUiJob(data) : null;
}

/* =========================
   CREATE JOB
========================= */
export async function awnitCreateJob(input: {
  title?: string;
  summary: string;
  stage?: string;
  customer: UiCustomer;
  apptDate?: string | null;
  apptTime?: string | null;
  crew?: string | null;
  scopeItems?: string[];
  materials?: string[];
  techNotes?: string | null;
  meta?: Record<string, any>;
}): Promise<UiAwnitJob> {
  const row = toDbCreate(input);

  // guard rails (matches your UI canSubmit)
  if (!row.customer_name) throw new Error("customer_name is required");
  if (!row.summary) throw new Error("summary is required");

  const { data, error } = await supabase
    .from("awnit_jobs")
    .insert(row)
    ;

  throwIfError(error, "awnitCreateJob failed");
}

/* =========================
   UPDATE STAGE
========================= */
export async function awnitSetJobStage(id: string, stage: string): Promise<void> {
  const { data, error } = await supabase
    .from("awnit_jobs")
    .update({ stage })
    .eq("id", id)
    ;

  throwIfError(error, "awnitSetJobStage failed");
}

/* =========================
   UPDATE DETAILS (PATCH)
========================= */
export async function awnitUpdateJob(
  id: string,
  patch: Partial<{
    title: string;
    summary: string;
    customer: UiCustomer;
    apptDate: string | null;
    apptTime: string | null;
    crew: string | null;
    scopeItems: string[];
    materials: string[];
    techNotes: string;
    meta: Record<string, any>;
  }>
): Promise<void> {
  const updateRow: any = {};

  if (typeof patch.title === "string") updateRow.title = patch.title;
  if (typeof patch.summary === "string") updateRow.summary = patch.summary;
  if ((patch as any).stage != null) updateRow.stage = (patch as any).stage;
if (patch.customer) {
    if (typeof patch.customer.name === "string") updateRow.customer_name = patch.customer.name;
    if (typeof patch.customer.phone === "string") updateRow.customer_phone = patch.customer.phone || null;
    if (typeof patch.customer.email === "string") updateRow.customer_email = patch.customer.email || null;
    if (typeof patch.customer.address === "string") updateRow.customer_address = patch.customer.address || null;
  }

  if ("apptDate" in patch) updateRow.appt_date = patch.apptDate ?? null;
  if ("apptTime" in patch) updateRow.appt_time = patch.apptTime ?? null;
  if ("crew" in patch) updateRow.crew = patch.crew ?? null;

  if (Array.isArray(patch.scopeItems)) updateRow.scope_items = patch.scopeItems;
  if (Array.isArray((patch as any).scope_items)) updateRow.scope_items = (patch as any).scope_items;
if (Array.isArray(patch.materials)) updateRow.materials = patch.materials;

  if (typeof patch.techNotes === "string") updateRow.tech_notes = patch.techNotes;
  if (typeof (patch as any).tech_notes === "string") updateRow.tech_notes = (patch as any).tech_notes;
if (patch.meta && typeof patch.meta === "object") updateRow.meta = patch.meta;

  const { data, error } = await supabase
    .from("awnit_jobs")
    .update(updateRow)
    .eq("id", id)
    ;

  throwIfError(error, "awnitUpdateJob failed");
}


