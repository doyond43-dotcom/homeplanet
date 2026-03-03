import { supabase } from "./supabase";

function throwIfError(error: any, msg: string) {
  if (!error) return;
  throw new Error(error.message || msg);
}

/* =========================
   LIST JOBS
========================= */
export async function awnitListJobs() {
  const { data, error } = await supabase
    .from("awnit_jobs")
    .select("*")
    .order("updated_at", { ascending: false });

  throwIfError(error, "awnitListJobs failed");
  return data || [];
}

/* =========================
   CREATE JOB
========================= */
export async function awnitCreateJob(payload: any) {
  const row = {
    title: payload.title ?? null,
    summary: payload.summary ?? null,
    stage: payload.stage ?? "Scheduled",

    customer_name: payload.customer_name ?? null,
    customer_phone: payload.customer_phone ?? null,
    customer_email: payload.customer_email ?? null,
    customer_address: payload.customer_address ?? null,

    appt_date: payload.appt_date ?? null,
    appt_time: payload.appt_time ?? null,
    crew: payload.crew ?? null,

    scope_items: [],
    materials: [],
    tech_notes: "",
    meta: {},
  };

  const { data, error } = await supabase
    .from("awnit_jobs")
    .insert([row])
    .select("*")
    .single();

  throwIfError(error, "awnitCreateJob failed");
  return data;
}

/* =========================
   UPDATE JOB
========================= */
export async function awnitUpdateJob(id: string, patch: any) {
  if (!id) throw new Error("Missing job id");

  const { data, error } = await supabase
    .from("awnit_jobs")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  throwIfError(error, "awnitUpdateJob failed");
  return data;
}