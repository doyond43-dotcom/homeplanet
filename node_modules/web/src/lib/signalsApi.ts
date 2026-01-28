import { supabase } from "./supabase";

export type PresenceSignalRow = {
  id: string;
  user_id: string;
  signal: string;
  severity: number;
  payload: any;
  created_at: string;
};

export async function getMySignals(limit: number = 25): Promise<PresenceSignalRow[]> {
  const { data, error } = await supabase.rpc("signals_for_me", { p_limit: limit });
  if (error) throw error;
  return (data ?? []) as PresenceSignalRow[];
}
