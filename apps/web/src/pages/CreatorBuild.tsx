import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  FileText,
  Mic,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react";

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

type BuildIntent =
  | "landing-page"
  | "live-board"
  | "workflow-tool"
  | "intake-flow"
  | "payment-flow"
  | "full-system";

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
  if (called?.[2]) {
    return called[2].trim().replace(/^["'â€œâ€]+|["'â€œâ€]+$/g, "");
  }

  const brandish = firstSentence.replace(/^i\s+(run|own|have|started)\s+/i, "").trim();
  const cleaned = brandish.replace(/^a\s+|an\s+|the\s+/i, "").trim();

  const title = cleaned.slice(0, 56).trim();
  return title ? title.replace(/^["'â€œâ€]+|["'â€œâ€]+$/g, "") : "Untitled Site";
}

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

  const cta =
    (wantsBook && "View Schedule") ||
    (wantsShop && "Shop") ||
    (wantsQuote && "Get a Quote") ||
    "Contact";

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

function formatIntent(intent: string) {
  return intent
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function inferNextSurface(
  _businessType: string,
  _intent: string
): { href: string; label: string } {
  return {
    href: "/planet/creator/studio",
    label: "Open Creator Studio",
  };
}

const DEFAULT_IDEA =
  "I run a Tampa-based dance studio that teaches hip hop and contemporary classes for kids and adults. Booking online. Contact: hello@movetampa.com";

export default function CreatorBuild() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const carriedBusinessName =
    query.get("businessName") ||
    query.get("business") ||
    "";

  const carriedBusinessType =
    query.get("businessType") ||
    query.get("service") ||
    "service business";

  const carriedIntent =
    (query.get("buildIntent") ||
      query.get("build") ||
      "full-system") as BuildIntent;

  const nextSurface = useMemo(
    () => inferNextSurface(carriedBusinessType, carriedIntent),
    [carriedBusinessType, carriedIntent]
  );

  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 900 : true
  );

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { activeProjectId, setActiveProjectId, hydrateActiveFromStorage } =
    useProjectStore();

  const [idea, setIdea] = useState<string>(
    carriedBusinessName || carriedBusinessType
      ? `${carriedBusinessName || "This business"} is a ${carriedBusinessType}. We want a cleaner workflow, better visibility, and a system that feels organized for customers and staff.`
      : DEFAULT_IDEA
  );

  const [buildText, setBuildText] = useState<string>(() =>
    generateStructuredBuild(
      carriedBusinessName || carriedBusinessType
        ? `${carriedBusinessName || "This business"} is a ${carriedBusinessType}. We want a cleaner workflow, better visibility, and a system that feels organized for customers and staff.`
        : DEFAULT_IDEA
    )
  );

  const [buildVersion, setBuildVersion] = useState<number>(1);
  const [status, setStatus] = useState<
    "idle" | "creating" | "saving" | "saved" | "error"
  >("idle");
  const [err, setErr] = useState<string | null>(null);

  const creatingRef = useRef<Promise<string> | null>(null);
  const saveTimer = useRef<number | null>(null);
  const lastTitleRef = useRef<string>("");

  const autoName = useMemo(() => inferNameFromText(idea), [idea]);
  const wordCount = useMemo(() => {
    const text = idea.trim();
    return text ? text.split(/\s+/).length : 0;
  }, [idea]);

  function appendFromVoice(chunk: unknown) {
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
        setActiveProjectIdLocal(p.id);
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

      const m = fixedBody.match(
        /About:\s*([\s\S]*?)\n\n(?:Services:|Products:|CTA:|Contact:)/i
      );
      if (m?.[1]) setIdea(m[1].trim());

      lastTitleRef.current = inferNameFromText(m?.[1] || fixedBody);
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
      const isUntitled =
        !currentTitle || currentTitle.toLowerCase().includes("untitled");
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

    const { error } = await supabase.from("project_drafts").upsert(
      { project_id: projectId, owner_id: authData.user.id, body },
      { onConflict: "project_id" }
    );

    if (error) throw error;

    void maybeUpdateProjectTitle(projectId, ideaText);

    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 650);
  }

  useEffect(() => {
    let cancelled = false;

    void (async () => {
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
      setBuildVersion((v) => v + 1);
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
      setBuildVersion((v) => v + 1);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
      setStatus("error");
    }
  }

  const statusLabel =
    (status === "creating" && "Creating project…") ||
    (status === "saving" && "Saving…") ||
    (status === "saved" && "Saved ✓") ||
    (status === "error" && "Save error") ||
    (activeProjectId ? "Auto-saved" : "Start describing to begin");

  const statusTone =
    status === "error"
      ? "text-rose-300"
      : status === "saved"
      ? "text-emerald-300"
      : "text-cyan-200";

  return (
    <div className="min-h-screen bg-[#06111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_28%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-cyan-400/20 bg-white/5 shadow-[0_20px_90px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Creator Build Active
              </div>

              <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                Build your business presence
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  the current HomePlanet way
                </span>
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Describe the real business in plain language. HomePlanet turns it
                into structured build text, saves the draft, and shows a living
                preview beside you while you work.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/planet/creator/projects")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <FileText className="h-4 w-4" />
                  Projects
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <Save className="h-4 w-4" />
                  Print / Save PDF
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-cyan-400/20 bg-slate-950/60 p-5 shadow-inner shadow-cyan-500/5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Build session identity
                  </div>
                  <div className="text-xs text-slate-400">
                    Current project context and live status
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Project title
                  </div>
                  <div className="mt-1 text-sm text-white">{autoName}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Build intent
                  </div>
                  <div className="mt-1 text-sm text-white">
                    {formatIntent(carriedIntent)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Save state
                  </div>
                  <div className={`mt-1 text-sm font-medium ${statusTone}`}>
                    {statusLabel}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Next surface
                  </div>
                  <div className="mt-1 text-sm text-white">
                    {nextSurface.label}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => void repairGhostsAndSave()}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Repair ghosts
                  </button>

                  <button
                    type="button"
                    onClick={() => void resetBuildFresh()}
                    className="inline-flex items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-400/15"
                  >
                    Reset fresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {err ? (
          <div className="mt-6 rounded-[24px] border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
            <div className="mb-1 font-semibold">Save error</div>
            <div>{err}</div>
          </div>
        ) : null}

        <section
          className={`mt-8 grid gap-6 ${
            isNarrow ? "grid-cols-1" : "lg:grid-cols-[1fr_1fr]"
          }`}
        >
          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur lg:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Describe
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Tell HomePlanet what this business really is
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                  Use natural language. Talk like a real owner. Mention what you
                  do, where you are, who you serve, how customers book, and what
                  you want people to feel or do next.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Word count
                </div>
                <div className="mt-1 text-lg font-semibold text-white">
                  {wordCount}
                </div>
              </div>
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300">
                Speak it, type it, or paste it. HomePlanet keeps the draft alive
                while the preview updates beside you.
              </div>

              <div className="flex items-center justify-end">
                <div className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/15 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100">
                  <Mic className="h-4 w-4" />
                  <VoiceDictationButton onFinal={appendFromVoice} />
                </div>
              </div>
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
              placeholder="Example: Taylor Creek Auto Repair in Okeechobee is a local shop built around trust, visibility, and real workflow..."
              className="min-h-[320px] w-full rounded-[24px] border border-white/10 bg-slate-950/55 p-5 text-[15px] leading-7 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300">
                <span className="font-semibold text-white">{autoName}</span>
                <span className="text-slate-400"> • auto-generated title</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
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
                      // best-effort
                    }

                    navigate(nextSurface.href);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  <Eye className="h-4 w-4" />
                  {nextSurface.label}
                </button>

                <button
                  type="button"
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
                      // best-effort
                    }

                    navigate("/planet/creator/studio");
                  }}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Creator Studio Assets
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur lg:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Preview
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Live build preview
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                  This panel shows the structured output your description is
                  generating right now.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-300">
                Version <span className="font-semibold text-white">{buildVersion}</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-[26px] border border-cyan-400/15 bg-slate-950/60 p-3 shadow-inner shadow-cyan-500/5">
              <BuildPreview
                key={buildVersion}
                rawText={buildText}
                projectId={activeProjectId}
              />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[30px] border border-cyan-400/15 bg-gradient-to-r from-cyan-400/10 via-sky-400/10 to-indigo-400/10 p-6">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Corrected flow
              </div>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                Creator Build now leads into the creator surface
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">
                Creator Build is the landing-page and asset surface. This is where
                the business presence gets written, shaped, previewed, and saved
                before it branches into Creator Studio assets, print pieces, and
                connected live system surfaces.
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-slate-950/45 p-5">
              <div className="text-sm font-semibold text-white">
                Flow now
              </div>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                <div>1. Creator City starts the business build</div>
                <div>2. Creator Build shapes the landing page and business presence</div>
                <div>3. Creator Studio handles assets, print pieces, and supporting surfaces</div>
                <div>4. Live boards and customer/staff systems stay connected as part of the same DNA</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}