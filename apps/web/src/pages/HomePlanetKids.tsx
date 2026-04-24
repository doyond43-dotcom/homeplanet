import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type TimelineItem = {
  label: string;
  time: string;
  tag: string;
};

const timeline: TimelineItem[] = [
  { label: "Idea created: Skate Game", time: "2:14 PM", tag: "ORIGIN LOCKED" },
  { label: "First character sketch added", time: "2:22 PM", tag: "CREATION" },
  { label: "Jump mechanic idea saved", time: "2:31 PM", tag: "TIMESTAMPED" },
  { label: "Shared safely with parent", time: "2:36 PM", tag: "GUARDIAN VISIBLE" },
];

const steps = [
  "Enter Creator Space",
  "Start creating with ideas, drawings, clips, and notes",
  "Build games, projects, and moments",
  "Origin-lock every important step",
  "Protect the space with Predator Shield",
  "Carry the work forward as they grow",
];

export default function HomePlanetKids() {
  const navigate = useNavigate();

  const today = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-[1.05fr_.95fr] md:px-8 md:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              HomePlanet Kids
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Kids don’t need another coding class.
              <span className="block text-sky-700">
                They need a place to build safely.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700 md:text-xl">
              A protected creator space where kids can build games, ideas, and
              real projects — backed by Predator Shield, parent visibility, and
              timestamped origin truth.
            </p>

            <div className="mt-7 grid gap-3 text-sm font-bold text-slate-700 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                🛡 Protected by Predator Shield
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                🧾 Every creation is timestamped
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                🎮 Build games, ideas, and projects
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                👨‍👩‍👧 Parent-visible, not creepy
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/planet/creator/studio")}
                className="rounded-2xl bg-slate-950 px-6 py-4 text-base font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                🚀 Enter Creator Space
              </button>

              <button
                onClick={() => navigate("/planet/predator-shield")}
                className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300"
              >
                View Predator Shield
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
                    Kid Creator Space
                  </p>
                  <h2 className="mt-1 text-2xl font-black">My First Game</h2>
                </div>
                <div className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-emerald-950">
                  SAFE
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <button className="rounded-2xl bg-white/10 p-4 text-left font-black text-white ring-1 ring-white/10">
                  Add Image
                </button>
                <button className="rounded-2xl bg-white/10 p-4 text-left font-black text-white ring-1 ring-white/10">
                  Add Idea
                </button>
                <button className="rounded-2xl bg-white/10 p-4 text-left font-black text-white ring-1 ring-white/10">
                  Add Clip
                </button>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-4 text-slate-950">
                <div className="flex items-center justify-between">
                  <p className="font-black">Live Origin Timeline</p>
                  <p className="text-xs font-bold text-slate-500">{today}</p>
                </div>

                <div className="mt-4 space-y-3">
                  {timeline.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-black">{item.label}</p>
                        <span className="shrink-0 rounded-full bg-sky-100 px-2 py-1 text-[10px] font-black text-sky-800">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-emerald-700">
                        {item.tag}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-300/40 bg-emerald-400/10 p-4">
                <p className="text-sm font-black text-emerald-200">
                  Predator Shield Active
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-200">
                  Unsafe interaction detection, Guardian visibility, and protected
                  creation are part of the space from the start.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
            The difference
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">
            This isn’t a class. This is their space.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-semibold text-slate-600">
            Other platforms teach the lesson. HomePlanet protects the child,
            preserves the work, and gives the creation a place to live.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] border border-red-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-red-600">
              The old way
            </p>
            <h3 className="mt-3 text-2xl font-black">Take a class</h3>
            <ul className="mt-5 space-y-3 text-sm font-bold text-slate-600">
              <li>Work disappears after the lesson</li>
              <li>No real ownership trail</li>
              <li>Unknown online interaction risk</li>
              <li>Parent sees only the surface</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-sky-100 bg-sky-50 p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-sky-700">
              The shift
            </p>
            <h3 className="mt-3 text-2xl font-black">Build with proof</h3>
            <p className="mt-5 text-sm font-bold leading-7 text-slate-700">
              Every meaningful action becomes part of a visible, protected,
              timestamped journey. The child is not just learning. They are
              building a record of who they are becoming.
            </p>
          </div>

          <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
              HomePlanet
            </p>
            <h3 className="mt-3 text-2xl font-black">A protected creator world</h3>
            <ul className="mt-5 space-y-3 text-sm font-bold text-slate-600">
              <li>Builds real creations</li>
              <li>Everything saved and timestamped</li>
              <li>Predator Shield safety layer</li>
              <li>Grows with them for years</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-700">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                From first idea to protected proof.
              </h2>
              <p className="mt-4 text-lg font-semibold leading-8 text-slate-600">
                HomePlanet Kids turns creativity into a visible journey. The
                child creates. The parent can see. The origin stays protected.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                    {index + 1}
                  </div>
                  <p className="text-base font-black text-slate-900">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_.9fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-sky-300">
                Parent Trust Layer
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Built for kids. Designed for parents.
              </h2>
              <p className="mt-5 text-lg font-semibold leading-8 text-slate-300">
                No hidden chats. No creepy tracking. No data-harvesting games.
                Just a protected place where creation can happen safely and truth
                stays visible.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-white p-5 text-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Guardian View
                  </p>
                  <h3 className="mt-1 text-2xl font-black">Parent View ON</h3>
                </div>
                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                  ACTIVE
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold">
                  See activity timeline
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold">
                  Approve sharing
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold">
                  Receive alerts if needed
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-bold">
                  Keep creation protected
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-sky-50 via-white to-indigo-50 px-5 py-14 text-center md:px-8">
        <h2 className="mx-auto max-w-4xl text-3xl font-black leading-tight md:text-5xl">
          Other platforms teach kids how to build.
          <span className="block text-sky-700">
            HomePlanet gives them a place to become.
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold text-slate-600">
          This is where creation begins, stays protected, and follows them into
          the future.
        </p>

        <button
          onClick={() => navigate("/planet/creator/studio")}
          className="mt-8 rounded-2xl bg-slate-950 px-8 py-4 text-base font-black text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          🚀 Launch Creator Space
        </button>
      </section>
    </main>
  );
}