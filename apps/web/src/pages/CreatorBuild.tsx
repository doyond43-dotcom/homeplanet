import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { ensureProject } from "../data/ensureProject";
import { useProjectStore } from "../state/projectStore";
import { BuildPreview } from "../components/BuildPreview";
import * as VoiceDictation from "../components/VoiceDictationButton";import {
  getActiveProjectId as getActiveProjectIdLocal,
  setActiveProjectId as setActiveProjectIdLocal,
} from "../lib/projectsStore";

type DraftRow = {
  project_id: string;
  body: string;
};

function inferNameFromText(input: string): string {
  const s = String(input || "").trim();
  if (!s) return "Untitled Site";

  // Grab first sentence-ish chunk
  const firstLine = s.split("\n").map((x) => x.trim()).filter(Boolean)[0] || s;
  const firstSentence = firstLine.split(/[.!?]/).map((x) => x.trim()).filter(Boolean)[0] || firstLine;

  // Common patterns: "called X", "named X", "I'm X", "we are X"
  const called = firstSentence.match(/\b(called|named)\s+([A-Za-z0-9&'".\- ]{2,60})/i);
  if (called?.[2]) return called[2].trim().replace(/^["'“”]+|["'“”]+$/g, "");

  // If they start with a brand-like phrase
  const brandish = firstSentence.replace(/^i\s+(run|own|have|started)\s+/i, "").trim();
  const cleaned = brandish.replace(/^a\s+|an\s+|the\s+/i, "").trim();

  // Keep it short and title-ish
  const title = cleaned.slice(0, 56).trim();
  return title ? title.replace(/^["'“”]+|["'“”]+$/g, "") : "Untitled Site";
}

// Turn plain English into the existing “structured” format BuildPreview already expects.
// This gives us the holy-shit moment without rewriting the renderer today.
function generateStructuredBuild(input: string): string {
  const raw = String(input || "").trim();

  const name = inferNameFromText(raw);

  // Simple heuristic sections
  const locationMatch = raw.match(/\b(in|based in|located in)\s+([A-Za-z .,'-]{2,40})/i);
  const location = locationMatch?.[2]?.trim();

  const emailMatch = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const email = emailMatch?.[0];

  const phoneMatch = raw.match(/\b(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/);
  const phone = phoneMatch?.[0];

  const wantsBook = /\b(book|booking|schedule|appointment|reserve)\b/i.test(raw);
  const wantsQuote = /\b(quote|estimate|pricing|price)\b/i.test(raw);
  const wantsShop = /\b(shop|store|buy|order)\b/i.test(raw);

  const cta =
    (wantsBook && "Book Now") ||
    (wantsShop && "Shop Now") ||
    (wantsQuote && "Get a Quote") ||
    "Contact";

  const benefits = [
    "Launch a clean site in seconds",
    "One link you own (no platform risk)",
    "Update anytime — always saved",
  ];

  const proof = [
    "Auto-saved draft",
    "Auto-generated page title",
    "Export-ready artifact",
  ];

  const contactBits = [email ? `Email: ${email}` : "", phone ? `Phone: ${phone}` : "", location ? `Location: ${location}` : ""]
    .filter(Boolean)
    .join("\n");

  return `H1: ${name}
Subheadline: Built from your description — ready to share

About:
${raw || "Describe your business and what you want customers to do."}

Benefits:
- ${benefits[0]}
- ${benefits[1]}
- ${benefits[2]}

Proof:
- ${proof[0]}
- ${proof[1]}
- ${proof[2]}

CTA: ${cta}

Contact:
${contactBits || "Add your email / phone / location to make this real."}
`;
}

export default function CreatorBuild() {
  const navigate = useNavigate();
  const { activeProjectId, setActiveProjectId, hydrateActiveFromStorage } = useProjectStore();

  // Human input (non-technical)
  const [idea, setIdea] = useState<string>(
    "I run a Tampa-based dance studio that teaches hip hop and contemporary classes for kids and adults. Booking online. Contact: hello@movetampa.com"
  );

  // Generated “build text” that powers the existing preview + autosave
  const [buildText, setBuildText] = useState<string>(() => generateStructuredBuild(
    "I run a Tampa-based dance studio that teaches hip hop and contemporary classes for kids and adults. Booking online. Contact: hello@movetampa.com"
  ));

  // Preview should jump / refresh on “Build My Site”
  const [buildVersion, setBuildVersion] = useState<number>(1);

  const [status, setStatus] = useState<"idle" | "creating" | "saving" | "saved" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

// ---------- Voice Dictation ----------
function appendFromVoice(chunk: any) {
  const cleaned = String(chunk ?? "").trim();
  if (!cleaned) return;

  setText((prev) => {
    const sep = prev && !prev.endsWith("\n") ? "\n" : "";
    const next = `${prev}${sep}${cleaned}\n`;
    scheduleSave(next);
    return next;
  });
}
// ------------------------------------

  const creatingRef = useRef<Promise<string> | null>(null);
  const saveTimer = useRef<number | null>(null);
  const lastTitleRef = useRef<string>("");

  const autoName = useMemo(() => inferNameFromText(idea), [idea]);

  // Hydrate active project from BOTH:
  // - zustand store
  // - LocalStorage key in projectsStore.ts (authoritative fallback)
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
        const p = await ensureProject("build", "Untitled Site");
        setActiveProjectId(p.id);
        setActiveProjectIdLocal(p.id); // refresh-proof
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
      // Draft body is the structured buildText
      setBuildText(row.body);

      // Best-effort: also back-fill the idea box from the “About:” section if present
      const m = row.body.match(/About:\s*([\s\S]*?)\n\nBenefits:/i);
      if (m?.[1]) setIdea(m[1].trim());

      lastTitleRef.current = inferNameFromText(m?.[1] || row.body);
    }
  }

  async function maybeUpdateProjectTitle(projectId: string, ideaText: string) {
    try {
      const nextTitle = inferNameFromText(ideaText);
      if (!nextTitle || nextTitle === lastTitleRef.current) return;

      const { data: proj, error: readErr } = await supabase
        .from("projects")
        .select("title")
        .eq("id", projectId)
        .maybeSingle();

      if (readErr) return;

      const currentTitle = (proj?.title ?? "").trim();
      const isUntitled = !currentTitle || currentTitle.toLowerCase().includes("untitled");
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

  async function saveDraft(projectId: string, body: string, ideaText: string) {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) throw new Error("Not authenticated");

    setStatus("saving");
    const { error } = await supabase
      .from("project_drafts")
      .upsert({ project_id: projectId, owner_id: authData.user.id, body }, { onConflict: "project_id" });

    if (error) throw error;

    void maybeUpdateProjectTitle(projectId, ideaText);

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

  function scheduleSave(nextBuildText: string, ideaText: string) {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      try {
        setErr(null);
        const pid = await ensureActiveBuildProject();
        setActiveProjectIdLocal(pid);
        await saveDraft(pid, nextBuildText, ideaText);
      } catch (e: any) {
        setErr(e?.message ?? String(e));
        setStatus("error");
      }
    }, 350);
  }

  // Boot: if authenticated and no active project, create + save once
  useEffect(() => {
    void (async () => {
      try {
        if (!activeProjectId) {
          const { data: auth } = await supabase.auth.getUser();
          if (!auth?.user) return;

          const pid = await ensureActiveBuildProject();
          setActiveProjectIdLocal(pid);
          await saveDraft(pid, buildText, idea);
        }
      } catch (e: any) {
        setErr(e?.message ?? String(e));
        setStatus("error");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusLabel =
    (status === "creating" && "creating…") ||
    (status === "saving" && "saving…") ||
    (status === "saved" && "saved ✓") ||
    (status === "error" && "error") ||
    (activeProjectId ? "auto-saved" : "start typing");

  return (
    <div style={{ padding: 18, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Creator</h1>
          <div style={{ opacity: 0.65, fontSize: 12 }}>
            Describe → Build → Preview
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ opacity: 0.75, fontSize: 12 }}>{statusLabel}</div>

          <button
            onClick={() => navigate("/planet/creator/projects")}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.06)",
              cursor: "pointer",
              fontWeight: 800,
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
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>
            Describe your business or idea
          </div>
          <div style={{ opacity: 0.75, fontSize: 12, marginBottom: 10 }}>
            Type a few sentences — we’ll turn it into a site.
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
  <div style={{ opacity: 0.65, fontSize: 12 }}>
    Describe your business — or speak it 🎤
  </div>

  <VoiceDictationButton
    onFinal={appendFromVoice}
    onText={appendFromVoice}
    onTranscript={appendFromVoice}
  />
</div>

<textarea
            id="creator-idea"
            name="creator-idea"
            value={idea}
            onChange={(e) => {
              const nextIdea = e.target.value;
              setIdea(nextIdea);

              // Keep build text in sync, but do not steal the wow moment (button still matters)
              const nextBuild = generateStructuredBuild(nextIdea);
              setBuildText(nextBuild);
              scheduleSave(nextBuild, nextIdea);
            }}
            placeholder="Example: I run a Tampa-based dance studio teaching hip hop & contemporary for kids and adults. Booking online. Contact: hello@..."
            style={{
              width: "100%",
              minHeight: 280,
              padding: 14,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
              outline: "none",
              fontSize: 15,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.92)",
              caretColor: "rgba(255,255,255,0.92)",
            }}
          />

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                // Generate + force preview to “jump” (holy-shit moment)
                const nextBuild = generateStructuredBuild(idea);
                setBuildText(nextBuild);
                setBuildVersion((v) => v + 1);
                scheduleSave(nextBuild, idea);
              }}
              style={{
                height: 46,
                padding: "0 16px",
                borderRadius: 14,
                border: "none",
                background: "white",
                color: "black",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Build My Site
            </button>

            <div style={{ fontSize: 12, opacity: 0.75 }}>
              <span style={{ fontWeight: 900 }}>{autoName}</span>{" "}
              <span style={{ opacity: 0.85 }}>• Auto-generated — rename anytime.</span>
            </div>
          </div>

          <div style={{ marginTop: 10, opacity: 0.65, fontSize: 12 }}>
            Active Project ID: {activeProjectId ?? "none yet"}
          </div>
        </div>

        <div>
          <BuildPreview key={buildVersion} text={buildText} projectId={activeProjectId} />
        </div>
      </div>
    </div>
  );
}



