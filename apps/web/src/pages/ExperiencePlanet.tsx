import { Link } from "react-router-dom";
import {
  Lock,
  GraduationCap,
  Search,
  PartyPopper,
  Users,
  Trees,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TimerReset,
  MapPinned,
} from "lucide-react";

const experienceModes = [
  {
    title: "Escape Room",
    description:
      "Turn every clue, hint, stage, and final outcome into a live replayable board.",
    icon: Lock,
  },
  {
    title: "Classroom Challenge",
    description:
      "Track stations, support moments, student progress, and completion in one truth-driven flow.",
    icon: GraduationCap,
  },
  {
    title: "Scavenger Hunt",
    description:
      "Anchor route stops, clue reveals, found locations, and final check-ins as one timeline.",
    icon: Search,
  },
  {
    title: "Birthday Quest",
    description:
      "Run birthday adventures, surprise paths, clue drops, and celebration moments from one board.",
    icon: PartyPopper,
  },
  {
    title: "Team Building",
    description:
      "Organize checkpoints, facilitator notes, support moments, and team wins in a shared experience board.",
    icon: Users,
  },
  {
    title: "Haunted Route",
    description:
      "Track scare zones, route checkpoints, clue drops, pacing changes, and final exits live.",
    icon: Trees,
  },
];

const proofPoints = [
  {
    title: "Live Board Structure",
    description:
      "Every experience gets the same clean HomePlanet shell: progress, team, truth layer, and outcome.",
    icon: Sparkles,
  },
  {
    title: "Replayable Timeline",
    description:
      "Hints, moments, support, time changes, and stage movement become anchored events instead of forgotten noise.",
    icon: TimerReset,
  },
  {
    title: "Presence + Truth Layer",
    description:
      "This is not just a game board. It is a structured proof-driven story of what happened and when.",
    icon: ShieldCheck,
  },
];

export default function ExperiencePlanet() {
  return (
    <div className="min-h-screen bg-[#061018] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_30%)]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[30px] border border-cyan-400/20 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="grid gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                <MapPinned className="h-3.5 w-3.5" />
                Experience Planet
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Build live boards for real-world experiences
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Escape rooms, classroom challenges, scavenger hunts, birthday quests,
                team-building events, and haunted routes can all run through the same
                HomePlanet experience system. Every stage, moment, hint, support event,
                and outcome becomes a replayable timeline.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/planet/experience/escape-board"
                  className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/12 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/18"
                >
                  Open Experience Demo
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/planet/creator"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Back to Creator City
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {proofPoints.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/12 text-cyan-200">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h2 className="text-sm font-semibold text-white">{item.title}</h2>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Experience Modes
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                One system. Multiple experience types.
              </h2>
            </div>

            <Link
              to="/planet/experience/escape-board"
              className="hidden items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/18 md:inline-flex"
            >
              View Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {experienceModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.title}
                  className="rounded-[24px] border border-white/10 bg-black/20 p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/12 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-white">{mode.title}</h3>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {mode.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[30px] border border-emerald-400/15 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-200/80">
            Why this matters
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            This is not an escape-room page. This is a universal experience system.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-200 sm:text-base">
            HomePlanet can now show how any challenge-based real-world activity becomes
            a structured, live, proof-driven board. That makes Experience a real planet,
            not just another hidden demo route.
          </p>
        </section>
      </div>
    </div>
  );
}