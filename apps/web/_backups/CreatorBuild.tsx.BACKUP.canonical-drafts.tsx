cd C:\Users\dan\Desktop\homeplanet\apps\web

# Backups
Copy-Item -Force src\pages\CreatorBuild.tsx src\pages\CreatorBuild.tsx.BACKUP.canonical-drafts.tsx

# Ensure folders
New-Item -ItemType Directory -Force src\lib | Out-Null

# =========================================================
# A) Create Supabase-first draft store (fallback to localStorage)
# =========================================================
@'
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
'@ | Set-Content -Encoding UTF8 src\lib\creatorBuildDrafts.ts

# =========================================================
# B) Replace CreatorBuild.tsx to use canonical draft store
# =========================================================
@'
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveProject, getActiveProjectId, subscribeProjects } from "../lib/projectsStore";
import type { CreatorDraft } from "../lib/creatorBuildDrafts";
import { deleteCreatorDraft, listCreatorDrafts, upsertCreatorDraft } from "../lib/creatorBuildDrafts";

type Draft = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

function makeId(prefix = "draft") {
  const c: any = typeof globalThis !== "undefined" ? (globalThis as any).crypto : undefined;
  return c?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const wrap: React.CSSProperties = {
  maxWidth: 1060,
  margin: "0 auto",
  padding: "26px 16px",
  color: "#fff",
};

const card: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.35)",
  padding: 14,
};

const input: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  padding: "10px 12px",
  outline: "none",
};

const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const btnDanger: React.CSSProperties = {
  ...btn,
  border: "1px solid rgba(255,80,80,0.25)",
  background: "rgba(255,80,80,0.06)",
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 12px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  cursor: "pointer",
};

function toDraft(d: CreatorDraft): Draft {
  return {
    id: d.id,
    title: d.title,
    body: d.body,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export default function CreatorBuild() {
  const nav = useNavigate();

  // Tick on project registry change
  const [tick, setTick] = useState(0);
  useEffect(() => subscribeProjects(() => setTick((t) => t + 1)), []);

  const activeId = useMemo(() => getActiveProjectId(), [tick]);
  const activeProject = useMemo(() => getActiveProject(), [tick]);

  // If no active project, go to canonical projects registry
  useEffect(() => {
    if (!activeId) nav("/creator/projects");
  }, [activeId, nav]);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [savedPulse, setSavedPulse] = useState(false);
  const [loading, setLoading] = useState(false);

  async function reloadDrafts(projectId: string) {
    setLoading(true);
    try {
      const list = await listCreatorDrafts(projectId);
      const mapped = list.map(toDraft);
      setDrafts(mapped);

      // If a "working" draft exists, hydrate editor (nice continuity)
      const working = mapped.find((d) => d.id === "working");
      if (working) {
        setTitle(working.title === "Untitled" ? "" : working.title);
        setBody(working.body || "");
      }
    } finally {
      setLoading(false);
    }
  }

  // Load drafts when project changes
  useEffect(() => {
    if (!activeId) return;
    reloadDrafts(activeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Autosave as canonical "working" draft (debounced)
  useEffect(() => {
    if (!activeId) return;

    const t = setTimeout(async () => {
      const now = Date.now();
      const working: CreatorDraft = {
        id: "working",
        projectId: activeId,
        title: title || "Untitled",
        body,
        createdAt: now,
        updatedAt: now,
      };

      await upsertCreatorDraft(working);

      // Local UI list update without refetch
      setDrafts((cur) => {
        const next: Draft[] = [
          toDraft(working),
          ...cur.filter((d) => d.id !== "working"),
        ].slice(0, 200);
        return next;
      });

      setSavedPulse(true);
      setTimeout(() => setSavedPulse(false), 450);
    }, 450);

    return () => clearTimeout(t);
  }, [activeId, title, body]);

  function newDraft() {
    setTitle("");
    setBody("");
  }

  async function saveAsDraft() {
    if (!activeId) return;
    const now = Date.now();
    const d: CreatorDraft = {
      id: makeId(),
      projectId: activeId,
      title: title || "Untitled",
      body,
      createdAt: now,
      updatedAt: now,
    };

    await upsertCreatorDraft(d);

    setDrafts((cur) => [toDraft(d), ...cur.filter((x) => x.id !== "working")].slice(0, 200));
  }

  function openDraft(d: Draft) {
    setTitle(d.title === "Untitled" ? "" : d.title);
    setBody(d.body);
  }

  async function removeDraft(draftId: string) {
    if (!activeId) return;
    await deleteCreatorDraft(activeId, draftId);
    setDrafts((cur) => cur.filter((d) => d.id !== draftId));
  }

  if (!activeId) return null;

  const visibleDrafts = drafts.filter((d) => d.id !== "working");
  const count = visibleDrafts.length;

  return (
    <div style={wrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0 }}>Creator City</h2>

            <span style={{ opacity: 0.75, fontSize: 12 }}>
              {activeProject ? `Project: ${activeProject.name}` : "Project: (unknown)"}
            </span>

            <span style={{ opacity: savedPulse ? 1 : 0.55, fontSize: 12 }}>
              • {savedPulse ? "Saved" : "Saved"}
            </span>

            <span style={{ opacity: 0.55, fontSize: 12 }}>
              {loading ? "• syncing…" : ""}
            </span>
          </div>

          <div style={{ opacity: 0.7, marginTop: 6 }}>
            Start with an idea. No setup. No confusion. Projects persist canonically now.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button style={btn} onClick={() => nav("/creator/projects")}>Switch Project</button>
          <button style={btn} onClick={() => nav("/")}>Home</button>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div style={card}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Idea</div>
        <div style={{ display: "grid", gap: 10 }}>
          <input
            style={input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Creator flow that actually works"
          />
          <textarea
            style={{ ...input, minHeight: 160, resize: "vertical" }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write here…"
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={btn} onClick={saveAsDraft}>Save as Draft</button>
            <button style={{ ...btn, opacity: 0.9 }} onClick={newDraft}>New</button>
          </div>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontWeight: 800 }}>Drafts</div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>count: {count}</div>
        </div>

        <div style={{ height: 10 }} />

        {count === 0 ? (
          <div style={{ opacity: 0.7 }}>No drafts yet. Start above.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {visibleDrafts.map((d) => (
              <div key={d.id} style={row} title="Open draft">
                <div style={{ display: "grid", gap: 4, minWidth: 220 }} onClick={() => openDraft(d)}>
                  <div style={{ fontWeight: 800 }}>{d.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>{new Date(d.updatedAt).toLocaleString()}</div>
                </div>

                <div
                  onClick={() => openDraft(d)}
                  style={{
                    opacity: 0.65,
                    fontSize: 12,
                    flex: 1,
                    maxWidth: 520,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    alignSelf: "center",
                  }}
                >
                  {d.body || "(empty)"}
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button
                    style={btnDanger}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDraft(d.id);
                    }}
                    title="Delete draft"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 10, opacity: 0.5, fontSize: 12 }}>
        Stored at: hp.projects.v1 + hp.activeProjectId.v1 + (Supabase: hp_creator_build_drafts OR local: hp.creator.build.drafts.v2.&lt;projectId&gt;)
      </div>
    </div>
  );
}
'@ | Set-Content -Encoding UTF8 src\pages\CreatorBuild.tsx

Write-Host "`n✔ Canonical Creator drafts installed (Supabase-first + local fallback)." -ForegroundColor Green
Write-Host "Open Creator Projects: http://localhost:5173/creator/projects" -ForegroundColor Cyan
Write-Host "Open Creator Build:    http://localhost:5173/creator/build" -ForegroundColor Cyan

