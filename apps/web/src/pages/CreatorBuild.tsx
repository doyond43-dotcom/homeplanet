import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { normalizeStringsDeep } from "../lib/text/normalizeText";
import { ensureProject } from "../data/ensureProject";
import { useProjectStore } from "../state/projectStore";
import { BuildPreview } from "../components/BuildPreview";
import VoiceDictationButton from "../components/VoiceDictationButton";
import {
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

  const firstLine =
    s
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)[0] || s;

  const firstSentence =
    firstLine.split(/[.!?]/).map((x) => x.trim()).filter(Boolean)[0] || firstLine;

  const called = firstSentence.match(/\b(called|named)\s+([A-Za-z0-9&'".\- ]{2,60})/i);
  if (called?.[2]) return called[2].trim().replace(/^["'“”]+|["'“”]+$/g, "");

  const brandish = firstSentence.replace(/^i\s+(run|own|have|started)\s+/i, "").trim();
  const cleaned = brandish.replace(/^a\s+|an\s+|the\s+/i, "").trim();

  const title = cleaned.slice(0, 56).trim();
  return title ? title.replace(/^["'“”]+|["'“”]+$/g, "") : "Untitled Site";
}

// Plain English -> structured BuildPreview format
function generateStructuredBuild(input: string): string {
  const raw = String(input || "").trim();
  const name = inferNameFromText(raw);

  const grab = (re: RegExp) => raw.match(re)?.[1]?.trim();

  const location = grab(/\b(?:in|based in|located in)\s+([A-Za-z .,'-]{2,40})/i);

  const email = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2}/i)?.[0];
  const phone = raw.match(/\b(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/)?.[0];

  const wantsBook = /\b(book|booking|schedule|appointment|reserve)\b/i.test(raw);
  const wantsQuote = /\b(quote|estimate|pricing|price)\b/i.test(raw);
  const wantsShop = /\b(shop|store|buy|order)\b/i.test(raw);

  const cta = (wantsBook && "View Schedule") || (wantsShop && "Shop") || (wantsQuote && "Get a Quote") || "Contact";

  return `H1: ${name}

Subheadline: Built from your description — ready to share

About:
${raw || "Describe what you do, who it's for, and what you want customers to do."}

Services:
- Classes
- Private lessons
- Events

Products:
- Merchandise
- Gift cards

CTA: ${cta}

Contact:
${[
    location ? `Location: ${location}` : "Location:",
    phone ? `Phone: ${phone}` : "Phone:",
    email ? `Email: ${email}` : "Email:",
    "Instagram:",
    "Website:",
  ].join("\n")}
`;
}

export default function CreatorBuild() {
  const navigate = useNavigate();

  // --- Responsive layout (mobile = 1 column) ---
  const [isNarrow, setIsNarrow] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 900 : true));

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { activeProjectId, setActiveProjectId, hydrateActiveFromStorage } = useProjectStore();

  // Human input (non-technical)
  const [idea, setIdea] = useState<string>(
    "I run a Tampa-based dance studio that teaches hip hop and contemporary classes for kids and adults. Booking online. Contact: hello@movetampa.com"
  );

  // Generated “build text” that powers the preview + autosave
  const [buildText, setBuildText] = useState<string>(() =>
    generateStructuredBuild(
      "I run a Tampa-based dance studio that teaches hip hop and contemporary classes for kids and adults. Booking online. Contact: hello@movetampa.com"
    )
  );

  // Force preview refresh
  const [buildVersion, setBuildVersion] = useState<number>(1);

  const [status, setStatus] = useState<"idle" | "creating" | "saving" | "saved" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  const creatingRef = useRef<Promise<string> | null>(null);
  const saveTimer = useRef<number | null>(null);
  const lastTitleRef = useRef<string>("");

  const autoName = useMemo(() => inferNameFromText(idea), [idea]);

  function appendFromVoice(chunk: any) {
    const cleaned = String(chunk ?? "").trim();
    if (!cleaned) return;

    setIdea((prev) => {
      const sep = prev && !prev.endsWith("\n") ? "\n" : "";
      const nextIdea = `${prev}${sep}${cleaned}`;

      const nextBuild = generateStructuredBuild(nextIdea);
      const fixedBuild = normalizeStringsDeep(nextBuild);

      setBuildText(fixedBuild);
      scheduleSave(fixedBuild, nextIdea);

      return nextIdea;
    });
  }

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
      const fixedBody = normalizeStringsDeep(row.body);
      setBuildText(fixedBody);

      // Extract the About block from our structured template
      const m = fixedBody.match(/About:\s*([\s\S]*?)\n\n(?:Services:|Products:|CTA:|Contact:)/i);
      if (m?.[1]) setIdea(m[1].trim());

      lastTitleRef.current = inferNameFromText(m?.[1] || fixedBody);
    }
  }

  async function maybeUpdateProjectTitle(projectId: string, ideaText: string) {
    try {
      const nextTitle = inferNameFromText(ideaText);
      if (!nextTitle || nextTitle === lastTitleRef.current) return;

      const { data: proj, error: readErr } = await supabase.from("projects").select("title").eq("id", projectId).maybeSingle();
      if (readErr) return;

      const currentTitle = (proj?.title ?? "").trim();
      const isUntitled = !currentTitle || currentTitle.toLowerCase().includes("untitled");
      if (!isUntitled) return;

      const { error: upErr } = await supabase.from("projects").update({ title: nextTitle }).eq("id", projectId);
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

  // Load the draft when activeProjectId is present
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

  // --- Ghost repair + hard reset helpers (dev-only but safe) ---
  const DEFAULT_IDEA =
    "I run a Tampa-based dance studio that teaches hip hop and contemporary classes for kids and adults. Booking online. Contact: hello@movetampa.com";

  async function repairGhostsAndSave() {
    try {
      setErr(null);
      const pid = await ensureActiveBuildProject();
      setActiveProjectIdLocal(pid);

      const fixedIdea = normalizeStringsDeep(idea);
      const fixedBuild = normalizeStringsDeep(buildText);

      setIdea(fixedIdea);
      setBuildText(fixedBuild);

      await saveDraft(pid, fixedBuild, fixedIdea);

      setBuildVersion((v) => v + 1); // force preview refresh
    } catch (e: any) {
      setErr(e?.message ?? String(e));
      setStatus("error");
    }
  }

  async function resetBuildFresh() {
    try {
      setErr(null);
      const pid = await ensureActiveBuildProject();
      setActiveProjectIdLocal(pid);

      const nextIdea = DEFAULT_IDEA;
      const nextBuild = generateStructuredBuild(nextIdea);

      const fixedIdea = normalizeStringsDeep(nextIdea);
      const fixedBuild = normalizeStringsDeep(nextBuild);

      setIdea(fixedIdea);
      setBuildText(fixedBuild);

      await saveDraft(pid, fixedBuild, fixedIdea);

      setBuildVersion((v) => v + 1); // force preview refresh
    } catch (e: any) {
      setErr(e?.message ?? String(e));
      setStatus("error");
    }
  }
  // ------------------------------------------------------------

  const statusLabel =
    (status === "creating" && "creating…") ||
    (status === "saving" && "saving…") ||
    (status === "saved" && "saved ✓") ||
    (status === "error" && "error") ||
    (activeProjectId ? "auto-saved" : "start typing");

  // Shared HP pill + soft card styles
  const hpPill: any = {
    height: 40,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const hpCard: any = {
    padding: 14,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.22)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    minWidth: 0,
  };

  return (
    <div style={{ padding: 18, maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          marginBottom: 12,
          padding: "10px 12px",
          borderRadius: 14,
          border: "2px solid rgba(0,255,150,0.55)",
          background: "rgba(0,255,150,0.14)",
          color: "white",
          fontWeight: 900,
        }}
      >
        MIC BUILD ACTIVE ✓ (CreatorBuild.tsx)
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.print();
            }}
            style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
          >
            Print / Save PDF
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void repairGhostsAndSave();
            }}
            style={{
              marginLeft: 10,
              height: 40,
              padding: "0 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 12,
            }}
            title="Fix ghost characters by rewriting cleaned text back into Supabase"
          >
            Repair ghosts &amp; save
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void resetBuildFresh();
            }}
            style={{
              marginLeft: 10,
              height: 40,
              padding: "0 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,120,120,0.35)",
              background: "rgba(255,80,80,0.14)",
              color: "white",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: 12,
            }}
            title="Nuclear option: regenerate from idea and overwrite the stored draft"
          >
            Reset build fresh
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Creator</h1>
          <div style={{ opacity: 0.65, fontSize: 12 }}>Describe • Build • Preview</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{ opacity: 0.75, fontSize: 12 }}>{statusLabel}</div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(-1);
            }}
            style={hpPill}
            title="Back"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate("/planet/creator/projects");
            }}
            style={hpPill}
          >
            Projects
          </button>
        </div>
      </div>

      {err && (
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            marginBottom: 12,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Save error</div>
          <div style={{ opacity: 0.85, fontSize: 13 }}>{err}</div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isNarrow ? "1fr" : "1fr 1fr",
          gap: 18,
          alignItems: "start",
        }}
      >
        <div style={hpCard}>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Describe your business or idea</div>
          <div style={{ opacity: 0.75, fontSize: 12, marginBottom: 10 }}>
            Type a few sentences — or tap the mic — we’ll turn it into a site.
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 10 }}>
            <div style={{ opacity: 0.65, fontSize: 12 }}>Speak it</div>
            <VoiceDictationButton onFinal={appendFromVoice} />
          </div>

          <textarea
            id="creator-idea"
            name="creator-idea"
            value={idea}
            onChange={(e) => {
              const nextIdea = e.target.value;
              setIdea(nextIdea);

              const nextBuild = generateStructuredBuild(nextIdea);
              const fixedBuild = normalizeStringsDeep(nextBuild);

              setBuildText(fixedBuild);
              scheduleSave(fixedBuild, nextIdea);
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
              onClick={async () => {
                const nextBuild = generateStructuredBuild(idea);
                const fixedBuild = normalizeStringsDeep(nextBuild);

                setBuildText(fixedBuild);
                setBuildVersion((v) => v + 1);

                try {
                  const pid = await ensureActiveBuildProject();
                  setActiveProjectIdLocal(pid);
                  await saveDraft(pid, fixedBuild, idea);
                } catch {
                  // best-effort; still allow studio
                }

                navigate("/planet/creator/studio");
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
              Launch Creator Studio
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

        <div style={hpCard}>
          <BuildPreview key={buildVersion} rawText={buildText} projectId={activeProjectId} />
        </div>
      </div>
    </div>
  );
}


