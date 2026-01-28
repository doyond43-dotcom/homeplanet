import { supabase } from "../lib/supabaseClient";

export type OrbitRow = {
  id: string;
  project_id: string;
  name: string;
  kind: string;
  position: number;
};

export async function createOrbit(project_id: string, name: string, kind = "orbit", position = 0): Promise<OrbitRow> {
  const { data: auth } = await supabase.auth.getUser();
  const owner_id = auth?.user?.id;
  if (!owner_id) throw new Error("Not signed in (missing owner_id).");

  const { data, error } = await supabase
    .from("project_orbits")
    .insert({ project_id, owner_id, name, kind, position })
    .select("id, project_id, name, kind, position")
    .single();

  if (error) throw error;
  return data as OrbitRow;
}

export async function listOrbits(project_id: string): Promise<OrbitRow[]> {
  const { data, error } = await supabase
    .from("project_orbits")
    .select("id, project_id, name, kind, position")
    .eq("project_id", project_id)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as OrbitRow[];
}
