import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/**
 * AWNIT Jobs API — Single source of truth: public.awnit_jobs
 */

export type AwnitJobRow = Record<string, any>;

function throwIfError(error: PostgrestError | null, context: string) {
  if (error) throw new Error(`${context}: ${error.message || "Unknown database error"}`);
}

export async function awnitListJobs(): Promise<AwnitJobRow[]> {
  const { data, error } = await supabase
    .from("awnit_jobs")
    .select("*")
    .order("updated_at", { ascending: false });

  throwIfError(error, "awnitListJobs failed");
  return (data || []) as AwnitJobRow[];
}

export async function awnitCreateJob(payload: Record<string, any>): Promise<AwnitJobRow> {
  const { data, error } = await supabase
    .from("awnit_jobs")
    .insert(payload)
    .select("*")
    .single();

  throwIfError(error, "awnitCreateJob failed");
  return data as AwnitJobRow;
}

export async function awnitUpdateJob(id: string, patch: Record<string, any>): Promise<AwnitJobRow> {
  if (!id) throw new Error("awnitUpdateJob: missing id");

  const { data, error } = await supabase
    .from("awnit_jobs")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  throwIfError(error, "awnitUpdateJob failed");
  return data as AwnitJobRow;
}
