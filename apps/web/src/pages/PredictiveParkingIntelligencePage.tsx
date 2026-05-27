import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Car,
  Map,
  Navigation,
  ShieldCheck,
} from "lucide-react";

export default function PredictiveParkingIntelligencePage() {
  const navigate = useNavigate();

  const principles = [
    {
      icon: Navigation,
      title: "Awareness Over Signage",
      description:
        "Movement guidance becomes calmer and more intelligent instead of visually overwhelming.",
    },
    {
      icon: Car,
      title: "Predictive Movement",
      description:
        "The system understands arrival pressure before congestion forms.",
    },
    {
      icon: ShieldCheck,
      title: "Safer Visibility",
      description:
        "Reducing poles, arrows, and sign clutter preserves environmental visibility.",
    },
    {
      icon: Map,
      title: "Connected Ecosystem DNA",
      description:
        "Parking, restaurants, circulation, and Hub systems work together as one awareness layer.",
    },
  ];

  return (
    <div className="min-h-screen bg-black p-5 text-white md:p-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
      >
        Back
      </button>

      <div className="mx-auto max-w-7xl space-y-6">

        <section className="relative overflow-hidden rounded-[40px] border border-cyan-400/20 bg-[#06090b]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_36%)]" />

          <div className="relative z-10 grid gap-10 p-8 md:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

            <div>
              <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
                Predictive Parking Intelligence
              </div>

              <h1 className="mt-10 text-5xl font-black leading-none tracking-tight md:text-7xl">
                Calm guidance replaces clutter.
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
                Parking pressure, overflow movement, and circulation guidance
                become visible before confusion begins.
              </p>

              <div className="mt-8 rounded-3xl border border-cyan-400/15 bg-cyan-500/5 p-5">
                <p className="text-base leading-8 text-zinc-300">
                  One calm awareness point replaces dozens of reactive signs,
                  arrows, warnings, and visual noise.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="/planet/live-circulation-heartbeat"
                  className="rounded-2xl bg-white px-5 py-4 font-black text-black"
                >
                  Circulation Heartbeat
                </a>

                <a
                  href="/planet/restaurant-awareness-intelligence"
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white"
                >
                  Restaurant Awareness
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-white/10">
              <img
                src="/images/HomePlanet-PredictiveParking-GuidedArrival-Sunset-v1.png"
                alt="Guided arrival awareness"
                className="h-full w-full object-cover"
              />
            </div>

          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">

          <div className="overflow-hidden rounded-[36px] border border-red-400/15 bg-zinc-950">
            <img
              src="/images/HomePlanet-PredictiveParking-OverflowCongestion-BeforeAwareness-v1.png"
              alt="Overflow congestion before awareness"
              className="h-[320px] w-full object-cover"
            />

            <div className="p-7">
              <div className="text-xs uppercase tracking-[0.35em] text-red-300">
                Before Awareness
              </div>

              <h2 className="mt-4 text-3xl font-black leading-tight">
                Congestion forms because the environment reacts too late.
              </h2>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                Traditional parking systems wait until confusion already exists
                before responding with more signs, cones, arrows, and overload.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-emerald-400/15 bg-zinc-950">
            <img
              src="/images/HomePlanet-ParticipationCommunity-CalmCirculation-Evening-v1.png"
              alt="Calm participation community"
              className="h-[320px] w-full object-cover"
            />

            <div className="p-7">
              <div className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                After Awareness
              </div>

              <h2 className="mt-4 text-3xl font-black leading-tight">
                The environment quietly guides movement before pressure builds.
              </h2>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                Cleaner visibility, calmer circulation, and fewer reactive signs
                create a more human ecosystem experience.
              </p>
            </div>
          </div>

        </section>

        <section className="rounded-[40px] border border-cyan-400/15 bg-zinc-950 p-8 md:p-10">

          <div className="grid gap-6 md:grid-cols-2">

            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <div
                  key={principle.title}
                  className="rounded-[28px] border border-white/10 bg-black/30 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-cyan-500/10 p-3">
                      <Icon className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white">
                        {principle.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-zinc-400">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

        </section>

        <section className="overflow-hidden rounded-[40px] border border-white/10 bg-zinc-950">

          <img
            src="/images/HomePlanet-Ecosystem-LiveOperationalHeartbeat-Evening-v1.png"
            alt="Live operational heartbeat"
            className="h-[420px] w-full object-cover"
          />

          <div className="p-8 md:p-10">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">
              Final Operational Principle
            </div>

            <h2 className="mt-4 text-5xl font-black leading-tight">
              The ecosystem quietly guides people before confusion begins.
            </h2>

            <p className="mt-8 max-w-4xl text-lg leading-9 text-zinc-300">
              Predictive parking intelligence is not about controlling people.
              It is about reducing friction, preserving visibility, protecting
              calm movement, and helping the ecosystem move naturally together.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/planet/restaurant-awareness-intelligence"
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-4 font-bold text-cyan-200 transition hover:bg-cyan-500/20"
              >
                Restaurant Awareness Intelligence
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/planet/hub"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Open Hub
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}