import { supabase } from "../lib/supabaseClient";

type EnsureProjectResult = {
  id: string;
};

export async function ensureProject(
  kind: string,
  fallbackTitle: string
): Promise<EnsureProjectResult> {
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) throw new Error("Not authenticated");

  const owner_id = authData.user.id;

  // 1) Try to reuse the most recent active project for this user + kind
  const { data: existing, error: findErr } = await supabase
    .from("projects")
    .select("id")
    .eq("owner_id", owner_id)
    .eq("kind", kind)
    .eq("status", "active")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (!findErr && existing && existing.length > 0) {
    return { id: existing[0].id };
  }

  // 2) Otherwise create a new canonical project row
  const { data, error } = await supabase
    .from("projects")
    .insert({
      kind,
      title: fallbackTitle,
      status: "active",
      owner_id,
    })
    .select("id")
    .single();

  if (error) throw error;

  return { id: data.id };
}
