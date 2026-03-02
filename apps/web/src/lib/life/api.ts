import type { LifeEvent, LifeEventType } from "./types";

/**
 * IMPORTANT:
 * Fix the import below to match YOUR project.
 * Use the path you found with:
 *   Select-String -Path .\src\**\*.ts* -Pattern "createClient" -List
 *
 * Examples you might need:
 *   import { supabase } from "../supabase";
 *   import { supabase } from "../supabase";
 *   import { supabase } from "../supabase";
 */
import { supabase } from "../supabase";

const TABLE = "life_events";

async function ensureAnonSession() {
  // If already authed, do nothing
  const { data } = await supabase.auth.getSession();
  if (data?.session) return;

  // Dev-friendly: anonymous sign-in (must be enabled in Supabase Auth providers)
  const res = await supabase.auth.signInAnonymously();
  if (res.error) throw res.error;
}

export async function listLifeEvents(limit = 200): Promise<LifeEvent[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as LifeEvent[];
}

export async function createLifeEvent(input: {
  type: LifeEventType;
  title: string;
  notes?: string;
  location?: string;
}): Promise<LifeEvent> {
  const payload = {
    type: input.type,
    title: input.title.trim(),
    notes: input.notes?.trim() || null,
    location: input.location?.trim() || null,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data as LifeEvent;
}

export async function updateLifeEvent(
  id: string,
  patch: Partial<Pick<LifeEvent, "type" | "title" | "notes" | "location">>
): Promise<LifeEvent> {
  const payload: any = {};
  if (patch.type) payload.type = patch.type;
  if (typeof patch.title === "string") payload.title = patch.title.trim();
  if (typeof patch.notes === "string") payload.notes = patch.notes.trim() || null;
  if (typeof patch.location === "string") payload.location = patch.location.trim() || null;

  const { data, error } = await supabase
    .from(TABLE)
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data as LifeEvent;
}

export async function deleteLifeEvent(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}



