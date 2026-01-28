import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

// Gentle: updates email if needed, but won't block or explode the app.
export async function ensureProfile(user: User) {
  const payload = {
    id: user.id,
    email: user.email ?? null,
  };

  // Try upsert, but treat failures as non-fatal (RLS/schema issues shouldn't brick UI)
  const { error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    // Log only; do not throw.
    console.warn("ensureProfile upsert failed:", error.message);
  }
}
