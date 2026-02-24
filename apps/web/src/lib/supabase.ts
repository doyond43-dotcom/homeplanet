// apps/web/src/lib/supabase.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Hard-sanitized env loader for Vite
 */
function readEnv(key: string): string {
  const raw = (import.meta.env as any)?.[key];

  if (!raw || typeof raw !== "string") {
    throw new Error(`Missing ${key}`);
  }

  const value = raw.trim();

  // Keep this if you like seeing env in console (optional)
  console.log(`✅ ${key} =`, value);

  if (!/^https?:\/\//i.test(value) && key.includes("URL")) {
    throw new Error(`Invalid ${key}: ${value}`);
  }

  return value;
}

const SUPABASE_URL = readEnv("VITE_SUPABASE_URL");
const SUPABASE_ANON_KEY = readEnv("VITE_SUPABASE_ANON_KEY");

// ✅ singleton per browser tab
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "hp-auth",
    },
    realtime: {
      params: { eventsPerSecond: 20 },
    },
  });

  return _client;
}

// Back-compat: existing code can still import { supabase }
export const supabase = getSupabase();