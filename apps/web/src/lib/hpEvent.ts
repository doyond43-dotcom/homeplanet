/**
 * HomePlanet Event Tracking (Presence-first, no creepiness)
 * - Logs to console
 * - Optionally sends to Supabase table: hp_events (if it exists)
 * - No cookies, no PII by default
 */

import { supabase } from "../lib/supabaseClient";

export type HpEvent = {
  event: string;
  board?: string;
  entityId?: string;
  meta?: Record<string, any>;
  ts?: number;
};

export async function hpEvent(input: HpEvent) {
  const payload = {
    event: input.event,
    board: input.board || "unknown",
    entity_id: input.entityId || null,
    meta: input.meta || {},
    created_at: new Date().toISOString(),
  };

  // 1) Always log (dev visibility)
  try {
    console.log("HP_EVENT", payload);
  } catch {}

  // 2) Try to send to Supabase (fail silently if table/policy not ready)
  try {
    await supabase.from("hp_events").insert([payload]);
  } catch (e) {
    // silent by design (demo-safe)
  }
}
