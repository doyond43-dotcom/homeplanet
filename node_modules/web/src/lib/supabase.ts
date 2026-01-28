import { createClient } from "@supabase/supabase-js";

/**
 * Hard-sanitized env loader for Vite
 */

function readEnv(key: string): string {
  const raw = (import.meta.env as any)?.[key];

  if (!raw || typeof raw !== "string") {
    throw new Error(`Missing ${key}`);
  }

  const value = raw.trim();

  console.log(`✅ ${key} =`, value);

  if (!/^https?:\/\//i.test(value) && key.includes("URL")) {
    throw new Error(`Invalid ${key}: ${value}`);
  }

  return value;
}

const SUPABASE_URL = readEnv("VITE_SUPABASE_URL");
const SUPABASE_ANON_KEY = readEnv("VITE_SUPABASE_ANON_KEY");

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
