import { supabase } from "./supabase";

export type PresenceStateRow = {
  user_id: string;
  state: "present" | "absent" | "unknown";
  last_seen_at: string;
  last_kind: string | null;
  age_seconds: number | null;
  ttl_seconds: number | null;
  last_payload: Record<string, any> | null;
};

export type PresenceResult =
  | { ok: true; data: PresenceStateRow | null }
  | { ok: false; error: string };

/**
 * Fetch the current user's presence_state row (0 or 1 row expected).
 * - ok=true + data=null means "no presence row yet" (not an error)
 * - ok=false means a real error happened
 */
export async function getMyPresenceState(userId: string): Promise<PresenceResult> {
  const { data, error } = await supabase
    .from("presence_state")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: data ?? null };
}
