import { createClient } from "@supabase/supabase-js";

const url = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const anon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anon) {
  // This throws only when the module is actually imported at runtime.
  console.warn("Supabase env missing: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(url || "", anon || "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: "hp-auth", // IMPORTANT: single shared key
  },
});
// Back-compat export for older imports (ex: LiveShopTV.tsx)
export function getSupabase() {
  return supabase;
}