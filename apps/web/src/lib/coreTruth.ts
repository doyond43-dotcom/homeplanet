import { supabase } from "./supabase";

export type CoreTruthKind =
  | "presence_ping"
  | "presence_auto"
  | "presence_exit"
  | "presence_conflict"
  | "presence_verify";

export async function emitCoreTruth(kind: CoreTruthKind, payload: Record<string, any> = {}) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;

  if (!user) throw new Error("Not signed in");

  const row = {
    user_id: user.id,
    kind,
    payload,
  };

  const { error } = await supabase.from("core_truth_events").insert(row);
  if (error) throw error;
}
