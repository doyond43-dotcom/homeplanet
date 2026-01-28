import { supabase } from "../lib/supabaseClient";

export type StarRow = {
  id: string;
  project_id: string;
  orbit_id: string;
  title: string;
  body: string;
  star_type: string;
  status: string;
  position: number;
};

export async function createStar(args: {
  project_id: string;
  orbit_id: string;
  title: string;
  body?: string;
  star_type?: string;
  position?: number;
}): Promise<StarRow> {
  const { data: auth } = await supabase.auth.getUser();
  const owner_id = auth?.user?.id;
  if (!owner_id) throw new Error("Not signed in (missing owner_id).");

  const { project_id, orbit_id } = args;

  const { data, error } = await supabase
    .from("project_stars")
    .insert({
      project_id,
      orbit_id,
      owner_id,
      title: args.title ?? "",
      body: args.body ?? "",
      star_type: args.star_type ?? "note",
      position: args.position ?? 0,
      status: "active",
    })
    .select("id, project_id, orbit_id, title, body, star_type, status, position")
    .single();

  if (error) throw error;
  return data as StarRow;
}

export async function listStars(project_id: string, orbit_id: string): Promise<StarRow[]> {
  const { data, error } = await supabase
    .from("project_stars")
    .select("id, project_id, orbit_id, title, body, star_type, status, position")
    .eq("project_id", project_id)
    .eq("orbit_id", orbit_id)
    .eq("status", "active")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as StarRow[];
}
