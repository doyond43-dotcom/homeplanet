import { supabase } from "./supabase";

export type CreatorDraft = {
  id: string;            // "working" or uuid
  projectId: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

const TABLE = "hp_creator_build_drafts"; // create in Supabase; if missing -> fallback local
const LS_PREFIX = "hp.creator.build.drafts.v2."; // new key so we don't fight old experiments

function lsKey(projectId: string) {
  return `${LS_PREFIX}${projectId}`;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function isSupabaseConfigured() {
  try {
    // supabase client exists if env is set; still might fail at runtime if anon key/url missing.
    return !!supabase;
  } catch {
    return false;
  }
}

async function canUseSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const { data } = await supabase.auth.getSession();
    return !!data?.session?.user;
  } catch {
    return false;
  }
}

function fromRow(r: any): CreatorDraft {
  return {
    id: String(r.draft_id ?? r.id ?? ""),
    projectId: String(r.project_id ?? ""),
    title: String(r.title ?? ""),
    body: String(r.body ?? ""),
    createdAt: Number(new Date(r.created_at ?? Date.now()).getTime()),
    updatedAt: Number(new Date(r.updated_at ?? Date.now()).getTime()),
  };
}

function toLocalShape(d: CreatorDraft) {
  return {
    id: d.id,
    title: d.title,
    body: d.body,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

function readLocal(projectId: string): CreatorDraft[] {
  const raw = localStorage.getItem(lsKey(projectId));
  const list = safeParse<any[]>(raw, []);
  return (list || []).map((x) => ({
    id: String(x.id),
    projectId,
    title: String(x.title ?? ""),
    body: String(x.body ?? ""),
    createdAt: Number(x.createdAt ?? Date.now()),
    updatedAt: Number(x.updatedAt ?? Date.now()),
  }));
}

function writeLocal(projectId: string, drafts: CreatorDraft[]) {
  const list = drafts.map(toLocalShape);
  localStorage.setItem(lsKey(projectId), JSON.stringify(list));
}

export async function listCreatorDrafts(projectId: string): Promise<CreatorDraft[]> {
  // Supabase-first
  if (await canUseSupabase()) {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("project_id", projectId)
        .order("updated_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(fromRow);
      }
      // fallthrough to local
    } catch {
      // fallthrough to local
    }
  }

  return readLocal(projectId);
}

export async function upsertCreatorDraft(d: CreatorDraft): Promise<void> {
  const now = Date.now();
  const next: CreatorDraft = { ...d, updatedAt: now };

  // Supabase-first
  if (await canUseSupabase()) {
    try {
      const { data: sess } = await supabase.auth.getSession();
      const userId = sess?.session?.user?.id ?? null;

      // upsert by (project_id, draft_id)
      const payload = {
        project_id: next.projectId,
        draft_id: next.id,
        title: next.title,
        body: next.body,
        created_at: new Date(next.createdAt || now).toISOString(),
        updated_at: new Date(next.updatedAt).toISOString(),
        user_id: userId,
      };

      const { error } = await supabase.from(TABLE).upsert(payload, {
        onConflict: "project_id,draft_id",
      });

      if (!error) return;
      // if table missing or RLS blocks, fallthrough to local
    } catch {
      // fallthrough to local
    }
  }

  // Local fallback (always works)
  const cur = readLocal(next.projectId);
  const merged = [
    next,
    ...cur.filter((x) => x.id !== next.id),
  ].slice(0, 200);
  writeLocal(next.projectId, merged);
}

export async function deleteCreatorDraft(projectId: string, draftId: string): Promise<void> {
  if (await canUseSupabase()) {
    try {
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq("project_id", projectId)
        .eq("draft_id", draftId);

      if (!error) return;
    } catch {
      // fallthrough
    }
  }

  const cur = readLocal(projectId).filter((d) => d.id !== draftId);
  writeLocal(projectId, cur);
}
