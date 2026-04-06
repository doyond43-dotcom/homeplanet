import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anon) {
  throw new Error(
    "Supabase env missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in apps/web/.env.local"
  );
}

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storageKey: "hp-auth",
  },
});

export function getSupabase() {
  return supabase;
}
