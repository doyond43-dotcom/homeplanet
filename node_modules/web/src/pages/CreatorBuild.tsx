import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { ensureProject } from "../data/ensureProject";
import { useProjectStore } from "../state/projectStore";
import { BuildPreview } from "../components/BuildPreview";
import {
  getActiveProjectId as getActiveProjectIdLocal,
  setActiveProjectId as setActiveProjectIdLocal,
} from "../lib/projectsStore";

type DraftRow = {
  project_id: string;
  body: string;
};

function deriveTitle(body: string): string {
  const lines = (body ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return "Untitled Build";

  const first = lines[0].replace(/^#+\s*/, "").trim();
  const cleaned = first.replace(/^["'“”‘’]+|["'“”‘’]+$/g, "").trim();

  return cleaned.slice(0, 72) || "Untitled Build";
}

export default function CreatorBuild() {
  const navigate = useNavigate();
  const { activeProjectId, setActiveProjectId, hydrateActiveFromStorage } = useProjectStore();

  const [text, setText] = useState(
`H1: My Demo Page
Subheadline: Watch this turn into a site

Benefits:
- Instant pages
- Canonical origin
- Proof trail

Proof:
- Saved to Supabase
- Title derived from first line
- Refresh and it persists

CTA: Get Started`
  );

  const [status, setStatus] = useState<"idle" | "creating" | "saving" | "saved" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  const creatingRef = useRef<Promise<string> | null>(null);
  const saveTimer = useRef<number | null>(null);
  const lastTitleRef = useRef<string>("");

  // Hydrate active project from BOTH:
  // - your zustand store (whatever it does)
  // - the explicit LocalStorage key in projectsStore.ts (authoritative fallback)
  useEffect(() => {
    hydrateActiveFromStorage?.();

    const local = getActiveProjectIdLocal();
    if (local && !activeProjectId) {
      setActiveProjectId(local);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function ensureActiveBuildProject(): Promise<string> {
    if (activeProjectId) return activeProjectId;

    if (!creatingRef.current) {
      setStatus("creating");
      creatingRef.current = (async () => {
        const p = await ensureProject("build", "Untitled Build");
        setActiveProjectId(p.id);
        setActiveProjectIdLocal(p.id); // <-- LOCK IT IN (refresh-proof)
        setStatus("idle");
        return p.id;
      })();
    }

    return creatingRef.current;
  }

  async function loadDraft(projectId: string) {
    const { data, error } = await supabase
      .from("project_drafts")
      .select("project_id, body")
      .eq("project_id", projectId)
      .maybeSingle();

    if (error) throw error;

    const row = data as DraftRow | null;
    if (row?.body != null) {
      setText(row.body);
      lastTitleRef.current = deriveTitle(row.body);
    }
  }

  async function maybeUpdateProjectTitle(projectId: string, body: string) {
    try {
      const nextTitle = deriveTitle(body);
      if (!nextTitle || nextTitle === lastTitleRef.current) return;

      const { data: proj, error: readErr } = await supabase
        .from("projects")
        .select("title")
        .eq("id", projectId)
        .maybeSingle();

      if (readErr) return;

      const currentTitle = (proj?.title ?? "").trim();
      const isUntitled = !currentTitle || currentTitle.toLowerCase() === "untitled build";
      if (!isUntitled) return;

      const { error: upErr } = await supabase
        .from("projects")
        .update({ title: nextTitle })
        .eq("id", projectId);

      if (!upErr) lastTitleRef.current = nextTitle;
    } catch {
      // best-effort only
    }
  }

  async function saveDraft(projectId: string, body: string) {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) throw new Error("Not authenticated");

    setStatus("saving");
    const { error } = await supabase
      .from("project_drafts")
      .upsert({ project_id: projectId, owner_id: authData.user.id, body }, { onConflict: "project_id" });

    if (error) throw error;

    void maybeUpdateProjectTitle(projectId, body);

    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 650);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!activeProjectId) return;
      try {
        await loadDraft(activeProjectId);
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message ?? String(e));
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeProjectId]);

  function scheduleSave(nextBody: string) {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      try {
        setErr(null);
        const pid = await ensureActiveBuildProject();
        // keep local storage active ID synced even if zustand ever glitches
        setActiveProjectIdLocal(pid);
        await saveDraft(pid, nextBody);
      } catch (e: any) {
        setErr(e?.message ?? String(e));
        setStatus("error");
      }
    }, 350);
  }

  // OPTIONAL: don’t silently swallow boot errors (this was masking “not authenticated”)
  useEffect(() => {
    void (async () => {
      try {
        if (!activeProjectId) {
          // only create after we can auth; otherwise it appears “saved” but doesn’t exist
          const { data: auth } = await supabase.auth.getUser();
          if (!auth?.user) return;

          const pid = await ensureActiveBuildProject();
          setActiveProjectIdLocal(pid);
          await saveDraft(pid, text);
        }
      } catch (e: any) {
        setErr(e?.message ?? String(e));
        setStatus("error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 18, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Creator Build</h1>
          <div style={{ opacity: 0.65, fontSize: 12 }}>
            Canonical: projects (registry) → project_drafts (autosave)
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ opacity: 0.75, fontSize: 12 }}>
            {status === "creating" && "creating project…"}
            {status === "saving" && "saving…"}
            {status === "saved" && "saved"}
            {status === "error" && "error"}
            {status === "idle" && (activeProjectId ? "ready" : "start typing")}
          </div>

          <button
            onClick={() => navigate("/planet/creator/projects")}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.06)",
              cursor: "pointer",
              fontWeight: 800
            }}
          >
            Projects
          </button>
        </div>
      </div>

      {err && (
        <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.14)", marginBottom: 12 }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Save error</div>
          <div style={{ opacity: 0.85, fontSize: 13 }}>{err}</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>
        <div>
          <div style={{ opacity: 0.7, fontSize: 12, marginBottom: 8 }}>
            Builder text (type here)
          </div>

          <textarea
            id="creator-build-text"
            name="creator-build-text"
            value={text}
            onChange={(e) => {
              const next = e.target.value;
              setText(next);
              scheduleSave(next);
            }}
            placeholder="H1: ...  Subheadline: ...  Benefits: ...  Proof: ...  CTA: ..."
            style={{
              width: "100%",
              minHeight: 420,
              padding: 14,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              outline: "none",
              fontSize: 15,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.92)",
              caretColor: "rgba(255,255,255,0.92)"
            }}
          />

          <div style={{ marginTop: 10, opacity: 0.65, fontSize: 12 }}>
            Active Project ID: {activeProjectId ?? "none yet"}
          </div>
        </div>

        <div>
          <BuildPreview text={text} projectId={activeProjectId} />
        </div>
      </div>
    </div>
  );
}
