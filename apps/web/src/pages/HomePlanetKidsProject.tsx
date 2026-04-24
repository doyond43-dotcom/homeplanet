import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type KidProject = {
  id: string;
  title: string;
  type: "game" | "story" | "art";
  level: string;
  nextQuest: string;
  badge: string;
  createdAt: string;
};

type ProjectEvent = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tag: string;
};

type TrickMode = "none" | "jump" | "axel" | "spin" | "triple";

const CONES = [18, 42, 66, 78];

function stampTime() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function readAllProjects(): KidProject[] {
  const out: KidProject[] = [];

  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("homeplanet-kids-projects:")) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          if (item?.id && item?.title) out.push(item);
        });
      }
    }
  } catch {
    return out;
  }

  return out;
}

function findProject(projectId: string | undefined): KidProject | null {
  if (!projectId) return null;
  return readAllProjects().find((project) => project.id === projectId) || null;
}

function buildDefaultEvents(project: KidProject | null): ProjectEvent[] {
  return [
    {
      id: "project-opened",
      title: "Project opened",
      detail: project
        ? `${project.title} opened as a playable kid creator project.`
        : "This kid creator project is now open.",
      time: "Just now",
      tag: "PROJECT ACTIVE",
    },
  ];
}

export default function HomePlanetKidsProject() {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const project = useMemo(() => findProject(projectId), [projectId]);

  const keysRef = useRef({ left: false, right: false });
  const trickLockedRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [skaterX, setSkaterX] = useState(34);
  const [trickMode, setTrickMode] = useState<TrickMode>("none");
  const [score, setScore] = useState(0);
  const [tricks, setTricks] = useState(0);
  const [conesCleared, setConesCleared] = useState<number[]>([]);
  const [message, setMessage] = useState("Press Play My Game to start skating.");
  const [level, setLevel] = useState(1);

  const [events, setEvents] = useState<ProjectEvent[]>(() => {
    if (!projectId) return buildDefaultEvents(project);

    try {
      const raw = localStorage.getItem(`homeplanet-kids-project-events:${projectId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      return buildDefaultEvents(project);
    }

    return buildDefaultEvents(project);
  });

  useEffect(() => {
    if (!projectId) return;

    try {
      localStorage.setItem(
        `homeplanet-kids-project-events:${projectId}`,
        JSON.stringify(events)
      );
    } catch {
      // keep usable
    }
  }, [events, projectId]);

  function addEvent(title: string, detail: string, tag: string) {
    setEvents((current) => [
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

  function playGame() {
    setPlaying(true);
    setMessage("Cone Trick Run started. Hold ← → to skate. Tap tricks near cones.");
    addEvent("Game played", "Cone Trick Run started.", "GAME EVENT");
  }

  function clearConeIfNear(mode: TrickMode, currentX: number) {
    const nearbyCone = CONES.find(
      (cone) => Math.abs(cone - currentX) <= 6 && !conesCleared.includes(cone)
    );

    if (!nearbyCone) return false;

    setConesCleared((current) => [...current, nearbyCone]);
    setScore((current) => current + 300);
    setMessage(`🏆 Cone cleared with ${mode === "triple" ? "TRIPLE AXEL" : mode.toUpperCase()}!`);
    addEvent("Cone cleared", `A cone was cleared using ${mode}.`, "CONE CLEAR");

    return true;
  }

  function performTrick(mode: Exclude<TrickMode, "none">) {
    if (!playing || trickLockedRef.current) return;

    trickLockedRef.current = true;

    const trickMap: Record<
      Exclude<TrickMode, "none">,
      { title: string; message: string; score: number; duration: number }
    > = {
      jump: {
        title: "Jump",
        message: "⭐ Jump landed.",
        score: 80,
        duration: 450,
      },
      axel: {
        title: "Axel",
        message: "🔥 Axel landed.",
        score: 160,
        duration: 650,
      },
      spin: {
        title: "Spin",
        message: "🌀 Spin held.",
        score: 120,
        duration: 750,
      },
      triple: {
        title: "Triple Axel",
        message: "💥 Triple axel landed!",
        score: 350,
        duration: 950,
      },
    };

    const trick = trickMap[mode];

    setTrickMode(mode);
    setScore((current) => current + trick.score);
    setTricks((current) => current + 1);

    const cleared = clearConeIfNear(mode, skaterX);
    if (!cleared) setMessage(trick.message);

    if (mode === "triple" || cleared) {
      addEvent(
        mode === "triple" ? "Triple axel landed" : `${trick.title} landed`,
        cleared
          ? `${trick.title} cleared a cone.`
          : `${trick.title} was landed in the playable skating game.`,
        cleared ? "CONE CLEAR" : "TRICK"
      );
    }

    window.setTimeout(() => {
      setTrickMode("none");
      trickLockedRef.current = false;
    }, trick.duration);
  }

  function completeQuest() {
    setLevel((current) => current + 1);
    setScore((current) => current + 250);
    setMessage("⭐ LEVEL UP! Character Creator unlocked.");
    addEvent(
      "Quest completed",
      "The project leveled up and unlocked the next creator layer.",
      "LEVEL UP"
    );
  }

  useEffect(() => {
    if (!playing) return;

    let frame = 0;

    function loop() {
      setSkaterX((current) => {
        let next = current;

        if (keysRef.current.left) next -= 0.7;
        if (keysRef.current.right) next += 0.7;

        return Math.max(5, Math.min(86, next));
      });

      frame = window.requestAnimationFrame(loop);
    }

    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!playing) return;

      if (event.key === "ArrowLeft") keysRef.current.left = true;
      if (event.key === "ArrowRight") keysRef.current.right = true;

      if (event.repeat) return;

      if (event.code === "Space") {
        event.preventDefault();
        performTrick("jump");
      }

      if (event.key.toLowerCase() === "a") performTrick("axel");
      if (event.key.toLowerCase() === "s") performTrick("spin");
      if (event.key.toLowerCase() === "t") performTrick("triple");
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") keysRef.current.left = false;
      if (event.key === "ArrowRight") keysRef.current.right = false;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [playing, skaterX, conesCleared]);

  const skaterMoveClass =
    trickMode === "jump"
      ? "-translate-y-16"
      : trickMode === "axel"
      ? "-translate-y-20 scale-105"
      : trickMode === "spin"
      ? "scale-105"
      : trickMode === "triple"
      ? "-translate-y-24 scale-110"
      : "";

  const bodySpinClass =
    trickMode === "axel"
      ? "rotate-[360deg]"
      : trickMode === "spin"
      ? "rotate-[720deg]"
      : trickMode === "triple"
      ? "rotate-[1080deg]"
      : "";

  const armPose =
    trickMode === "spin" || trickMode === "axel" || trickMode === "triple"
      ? "arms-tight"
      : "arms-open";

  if (!project) {
    return (
      <main className="min-h-screen bg-[#f7fbff] px-5 py-10 text-slate-950">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
            Project not found
          </p>
          <h1 className="mt-3 text-4xl font-black">This project could not be found.</h1>
          <button
            onClick={() => navigate("/planet/kids/start")}
            className="mt-6 rounded-2xl bg-slate-950 px-6 py-4 font-black text-white"
          >
            ← Back to Kids Start
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-sky-700 shadow-sm"
        >
          ← Back to Creator Space
        </button>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
                Project Status
              </p>
              <h2 className="mt-3 text-2xl font-black">Level {level}: Cone Trick Run</h2>

              <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${Math.min(level * 25, 100)}%` }}
                />
              </div>

              <p className="mt-5 text-sm font-black text-violet-700">Next Quest</p>
              <p className="mt-2 font-black">Clear all cones with tricks</p>

              <button
                onClick={completeQuest}
                className="mt-5 w-full rounded-2xl bg-violet-600 px-5 py-4 font-black text-white"
              >
                Complete Quest ⭐
              </button>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">
                Run Status
              </p>
              <p className="mt-3 text-lg font-black">
                🧊 {conesCleared.length}/{CONES.length} cones cleared
              </p>
            </div>

            <div className="rounded-[2rem] border border-blue-200 bg-blue-50 p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-700">
                Play Your Game
              </p>
              <button
                onClick={playGame}
                className="mt-4 w-full rounded-2xl bg-blue-600 px-5 py-4 font-black text-white"
              >
                🚀 Play My Game
              </button>
              <p className="mt-3 text-center text-sm font-semibold text-slate-600">
                Hop cones. Land tricks. Build your score.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">
                Game Controls
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["←", "→", "SPACE", "A", "S", "T"].map((key) => (
                  <div
                    key={key}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-center font-black"
                  >
                    {key}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-600">
                Hold ← → to skate. SPACE = Jump. A = Axel. S = Spin. T = Triple Axel.
              </p>
            </div>

            <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="font-black text-emerald-800">🛡 Predator Shield Active</p>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                You are protected. Have fun and stay safe.
              </p>
            </div>
          </aside>

          <section className="space-y-5">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-700">
                  Project World
                </p>
                <h1 className="mt-2 text-4xl font-black md:text-5xl">{project.title}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                    LIVE
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-800">
                    🎮 GAME PROJECT
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                    Created at {project.createdAt}
                  </span>
                </div>
              </div>

              <div className="rounded-full bg-emerald-100 px-5 py-3 text-sm font-black text-emerald-800">
                🛡 SAFE ZONE
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-300 bg-slate-950 shadow-2xl">
              <div className="absolute left-6 top-5 z-20 text-sm font-black uppercase tracking-[0.35em] text-sky-300">
                Ice Skating Playground
              </div>

              <div className="absolute right-6 top-5 z-20 rounded-2xl border border-white/20 bg-black/70 px-6 py-4 text-center text-white">
                <p className="text-xs font-black uppercase tracking-widest text-sky-300">
                  Score
                </p>
                <p className="text-4xl font-black">{score}</p>
              </div>

              <div className="relative h-[420px] bg-gradient-to-b from-[#07142f] via-[#153463] to-[#8fc8f8]">
                <div className="absolute inset-0 opacity-80">
                  {Array.from({ length: 40 }).map((_, index) => (
                    <span
                      key={index}
                      className="absolute h-1 w-1 rounded-full bg-white"
                      style={{
                        left: `${(index * 17) % 100}%`,
                        top: `${10 + ((index * 23) % 40)}%`,
                      }}
                    />
                  ))}
                </div>

                <div className="absolute bottom-32 left-0 right-0 h-32 bg-gradient-to-t from-[#dff4ff] to-[#b9ddff]" />
                <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-[#b9ddff] to-[#7ebff1]" />

                <div className="absolute bottom-24 left-0 right-0 h-px bg-white/80" />
                <div className="absolute bottom-16 left-10 right-10 h-px bg-white/40" />
                <div className="absolute bottom-8 left-20 right-20 h-px bg-white/30" />

                {CONES.map((cone) => (
                  <div
                    key={cone}
                    className={`absolute bottom-[86px] h-0 w-0 border-l-[12px] border-r-[12px] border-b-[30px] border-l-transparent border-r-transparent ${
                      conesCleared.includes(cone)
                        ? "border-b-emerald-400 opacity-40"
                        : "border-b-orange-500"
                    }`}
                    style={{ left: `${cone}%` }}
                  />
                ))}

                <div
                  className={`absolute bottom-[92px] transition-transform duration-300 ${skaterMoveClass}`}
                  style={{ left: `${skaterX}%` }}
                >
                  <div
                    className={`relative h-40 w-28 origin-center transition-transform duration-700 ${bodySpinClass}`}
                  >
                    <div className="absolute left-[42px] top-0 h-12 w-12 rounded-full bg-black" />
                    <div className="absolute left-[50px] top-[46px] h-20 w-5 rounded-full bg-black" />

                    <div
                      className={`absolute top-[56px] h-4 w-16 rounded-full bg-black ${
                        armPose === "arms-tight"
                          ? "left-[28px] rotate-[88deg]"
                          : "left-[8px] rotate-[140deg]"
                      }`}
                    />
                    <div
                      className={`absolute top-[62px] h-4 w-16 rounded-full bg-black ${
                        armPose === "arms-tight"
                          ? "left-[48px] rotate-[88deg]"
                          : "left-[55px] rotate-[20deg]"
                      }`}
                    />

                    <div className="absolute left-[45px] top-[112px] h-16 w-4 origin-top rotate-[20deg] rounded-full bg-black" />
                    <div className="absolute left-[62px] top-[112px] h-16 w-4 origin-top -rotate-[18deg] rounded-full bg-black" />

                    <div className="absolute left-[28px] top-[158px] h-5 w-12 rotate-[8deg] rounded bg-white shadow" />
                    <div className="absolute left-[66px] top-[158px] h-5 w-12 -rotate-[8deg] rounded bg-white shadow" />
                  </div>
                </div>

                <div className="absolute bottom-5 left-6 rounded-2xl bg-black/80 px-6 py-4 text-white">
                  <p className="text-lg font-black">{message}</p>
                </div>

                <div className="absolute bottom-5 right-6 rounded-2xl bg-black/80 px-6 py-4 text-center text-white">
                  <p className="text-xs font-black uppercase tracking-widest text-sky-300">
                    Tricks Landed
                  </p>
                  <p className="text-4xl font-black">{tricks}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-3 md:grid-cols-5">
                <button className="rounded-2xl bg-blue-50 p-4 font-black text-blue-700">
                  🎮 Build Game
                </button>
                <button className="rounded-2xl bg-slate-50 p-4 font-black text-slate-700">
                  👤 Add Character
                </button>
                <button className="rounded-2xl bg-slate-50 p-4 font-black text-slate-700">
                  🏔 Add Level
                </button>
                <button className="rounded-2xl bg-slate-50 p-4 font-black text-slate-700">
                  🧊 Add Obstacle
                </button>
                <button className="rounded-2xl bg-slate-50 p-4 font-black text-slate-700">
                  👨‍👩‍👧 Share with Parent
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
                Project Timeline
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-4">
                {events.slice(0, 4).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="font-black">{event.title}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {event.detail}
                    </p>
                    <p className="mt-3 text-sm font-bold text-slate-500">
                      {event.time}
                    </p>
                    <p className="mt-2 text-xs font-black uppercase tracking-widest text-emerald-700">
                      {event.tag}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}