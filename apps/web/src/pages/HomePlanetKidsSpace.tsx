import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type SpacePayload = {
  childName?: string;
  spaceName?: string;
  sharingMode?: "private" | "family" | "showcase";
};

type TimelineItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tag: string;
};

type KidProject = {
  id: string;
  title: string;
  type: "game" | "story" | "art";
  level: string;
  nextQuest: string;
  badge: string;
  createdAt: string;
};

function safeRead(slug: string | undefined): SpacePayload | null {
  if (!slug) return null;
  try {
    const raw = localStorage.getItem(`homeplanet-kids-space:${slug}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function buildDefaultTimeline(spaceName: string): TimelineItem[] {
  return [
    {
      id: "origin",
      title: "Creator space opened",
      detail: `${spaceName} was started as a protected HomePlanet Kids space.`,
      time: "Just now",
      tag: "ORIGIN LOCKED",
    },
    {
      id: "shield",
      title: "Predator Shield active",
      detail: "Unsafe interaction detection and parent visibility are running.",
      time: "Just now",
      tag: "PROTECTED",
    },
    {
      id: "private",
      title: "Private by default",
      detail: "Nothing is public unless a parent approves it.",
      time: "Just now",
      tag: "PARENT CONTROLLED",
    },
  ];
}

function projectTemplate(type: KidProject["type"], title?: string): KidProject {
  const now = new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (type === "game") {
    return {
      id: crypto.randomUUID(),
      title: title || "My First Game",
      type,
      level: "Level 1: Idea Locked",
      nextQuest: "Design your main character",
      badge: "First Spark unlocked",
      createdAt: now,
    };
  }

  if (type === "story") {
    return {
      id: crypto.randomUUID(),
      title: title || "My First Story World",
      type,
      level: "Level 1: Story Seed",
      nextQuest: "Name your hero",
      badge: "World Builder unlocked",
      createdAt: now,
    };
  }

  return {
    id: crypto.randomUUID(),
    title: title || "My First Art Project",
    type,
    level: "Level 1: First Sketch",
    nextQuest: "Add colors or a scene",
    badge: "Creator Mark unlocked",
    createdAt: now,
  };
}

export default function HomePlanetKidsSpace() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const saved = useMemo(() => safeRead(slug), [slug]);

  const spaceName = saved?.spaceName || "Demo Creator Space";
  const childName = saved?.childName || "Creator";
  const sharingMode = saved?.sharingMode || "private";

  const [idea, setIdea] = useState("");

  const [timeline, setTimeline] = useState<TimelineItem[]>(() => {
    if (!slug) return buildDefaultTimeline(spaceName);

    try {
      const raw = localStorage.getItem(`homeplanet-kids-timeline:${slug}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}

    return buildDefaultTimeline(spaceName);
  });

  const [projects, setProjects] = useState<KidProject[]>(() => {
    if (!slug) return [];
    try {
      const raw = localStorage.getItem(`homeplanet-kids-projects:${slug}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    if (!slug) return;
    try {
      localStorage.setItem(
        `homeplanet-kids-timeline:${slug}`,
        JSON.stringify(timeline)
      );
    } catch {}
  }, [timeline, slug]);

  useEffect(() => {
    if (!slug) return;
    try {
      localStorage.setItem(
        `homeplanet-kids-projects:${slug}`,
        JSON.stringify(projects)
      );
    } catch {}
  }, [projects, slug]);

  function stampTime() {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function addTimeline(title: string, detail: string, tag: string) {
    setTimeline((current) => [
      {
        id: crypto.randomUUID(),
        title,
        detail,
        time: stampTime(),
        tag,
      },
      ...current,
    ]);
  }

  function addIdea() {
    const clean = idea.trim();
    if (!clean) return;

    addTimeline("New idea added", clean, "TIMESTAMPED");
    setIdea("");
  }

  function addQuick(title: string, detail: string) {
    addTimeline(title, detail, "CREATION EVENT");
  }

  function addProject(type: KidProject["type"]) {
    const cleanIdea = idea.trim();
    const title =
      cleanIdea.length > 0
        ? cleanIdea.length > 38
          ? `${cleanIdea.slice(0, 38)}...`
          : cleanIdea
        : undefined;

    const project = projectTemplate(type, title);

    setProjects((current) => [project, ...current]);

    addTimeline(
      "Project card created",
      `${project.title} became a real project card with a next quest and badge.`,
      "PROJECT STARTED"
    );

    setIdea("");
  }

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
          <button
            onClick={() => navigate("/planet/kids/start")}
            className="mb-6 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-sky-700 shadow-sm"
          >
            ← Back to Kids Start
          </button>

          <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
                Kid Creator Space
              </p>

              <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
                {spaceName}
              </h1>

              <p className="mt-4 text-lg font-semibold leading-8 text-slate-700">
                {childName} now has a protected space to build ideas, projects,
                games, drawings, and moments with origin proof from the start.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Safety
                  </p>
                  <p className="mt-1 font-black">Predator Shield Active</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Sharing
                  </p>
                  <p className="mt-1 font-black capitalize">{sharingMode}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Owner
                  </p>
                  <p className="mt-1 font-black">{childName}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Status
                  </p>
                  <p className="mt-1 font-black text-emerald-700">
                    Protected Started
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
                <p className="font-black text-emerald-800">
                  Now it feels like a creator world.
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                  Kids can turn an idea into a project card with a level, next
                  quest, and badge. Parents still get the proof layer underneath.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
                    Build Panel
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    Turn an idea into something real
                  </h2>
                </div>
                <div className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-emerald-950">
                  SAFE
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] bg-white p-4 text-slate-950">
                <label className="block">
                  <span className="text-sm font-black text-slate-700">
                    Add idea, project note, game thought, or drawing description
                  </span>

                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    rows={5}
                    className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold outline-none focus:ring-4 focus:ring-sky-300/30"
                    placeholder="Example: I want to build an ice skating game where the character unlocks new tricks..."
                  />
                </label>

                <button
                  onClick={addIdea}
                  disabled={!idea.trim()}
                  className="mt-3 w-full rounded-2xl bg-slate-950 px-5 py-4 font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  🧾 Add Timestamped Idea
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() => addProject("game")}
                  className="rounded-2xl bg-sky-300 p-4 text-left font-black text-slate-950"
                >
                  🎮 Start Game Project
                </button>

                <button
                  onClick={() => addProject("story")}
                  className="rounded-2xl bg-violet-300 p-4 text-left font-black text-slate-950"
                >
                  📖 Start Story Project
                </button>

                <button
                  onClick={() => addProject("art")}
                  className="rounded-2xl bg-emerald-300 p-4 text-left font-black text-slate-950"
                >
                  🎨 Start Art Project
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <button
                  onClick={() =>
                    addQuick(
                      "Drawing added",
                      "A drawing placeholder was added to the creator space."
                    )
                  }
                  className="rounded-2xl bg-white/10 p-4 text-left font-black ring-1 ring-white/10"
                >
                  🎨 Add Drawing
                </button>

                <button
                  onClick={() =>
                    addQuick(
                      "Clip added",
                      "A clip placeholder was added to the creator space."
                    )
                  }
                  className="rounded-2xl bg-white/10 p-4 text-left font-black ring-1 ring-white/10"
                >
                  🎬 Add Clip
                </button>

                <button
                  onClick={() =>
                    addQuick(
                      "Game mechanic added",
                      "A gameplay idea was added to the creator space."
                    )
                  }
                  className="rounded-2xl bg-white/10 p-4 text-left font-black ring-1 ring-white/10"
                >
                  🎮 Add Game Idea
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-4">
                <p className="text-sm font-black text-emerald-200">
                  Predator Shield check
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-300">
                  This demo assumes safe content. Later, this layer can flag
                  unsafe language, contact attempts, grooming patterns, or risky
                  sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
                Project Cards
              </p>
              <h2 className="mt-2 text-3xl font-black">
                My creator projects
              </h2>
            </div>
            <div className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">
              {projects.length} projects
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-xl font-black">No project cards yet.</p>
              <p className="mt-2 text-sm font-semibold text-slate-600">
                Type an idea above, then click Start Game Project, Start Story
                Project, or Start Art Project.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-sky-700">
                        {project.type} project
                      </p>
                      <h3 className="mt-2 text-2xl font-black">
                        {project.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                      LIVE
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Level
                      </p>
                      <p className="mt-1 font-black">{project.level}</p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Next Quest
                      </p>
                      <p className="mt-1 font-black">{project.nextQuest}</p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Badge
                      </p>
                      <p className="mt-1 font-black">⭐ {project.badge}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-widest text-emerald-700">
                    Origin started at {project.createdAt}
                  </p>

                  <button
                    onClick={() => navigate(`/planet/kids/project/${project.id}`)}
                    className="mt-4 w-full rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition hover:-translate-y-0.5"
                  >
                    🚀 Open Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-8 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
                Live Origin Timeline
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Everything starts with proof.
              </h2>
            </div>
            <div className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">
              {timeline.length} events
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {timeline.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black">{item.title}</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                      {item.detail}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 shadow-sm">
                    {item.time}
                  </span>
                </div>
                <p className="mt-3 text-xs font-black uppercase tracking-widest text-emerald-700">
                  {item.tag}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
              Parent Visibility
            </p>
            <h2 className="mt-2 text-3xl font-black">Parent view is ready.</h2>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4 font-bold">
                See activity timeline
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 font-bold">
                Approve family sharing
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 font-bold">
                Receive safety alerts later
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 font-bold">
                Keep public sharing off by default
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-300">
              Kid Magic Layer
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Ideas become quests.
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-300">
              This is the layer that makes kids want to come back. The proof
              layer stays underneath, but the child sees progress, badges, and
              next steps.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}