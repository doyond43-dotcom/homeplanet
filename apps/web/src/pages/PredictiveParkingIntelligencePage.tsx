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

  const systems = [
    {
      title: "Arrival Prediction",
      status: "Active",
      description:
        "The system predicts likely parking pressure before congestion forms.",
      tone: "border-sky-400/25 bg-sky-500/10 text-sky-300",
    },
    {
      title: "Overflow Awareness",
      status: "Monitoring",
      description:
        "Overflow movement and secondary parking guidance stay operationally visible.",
      tone: "border-orange-400/25 bg-orange-500/10 text-orange-300",
    },
    {
      title: "Family & ADA Flow",
      status: "Protected",
      description:
        "Priority movement and calm arrival guidance reduce friction and confusion.",
      tone: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    },
    {
      title: "Environmental Visibility",
      status: "Stable",
      description:
        "Less signage clutter preserves visibility, openness, and environmental calm.",
      tone: "border-cyan-400/25 bg-cyan-500/10 text-cyan-300",
    },
  ];

  const principles = [
    {
      icon: Navigation,
      title: "Awareness Over Signage",
      description:
        "The system guides movement intelligently instead of overwhelming people with visual clutter.",
    },
    {
      icon: Car,
      title: "Predictive Movement",
      description:
        "Arrival timing and parking pressure become visible before congestion begins.",
    },
    {
      icon: ShieldCheck,
      title: "Safer Visibility",
      description:
        "Reducing excessive signs, poles, and blind spots creates calmer and safer movement.",
    },
    {
      icon: Map,
      title: "Connected Ecosystem DNA",
      description:
        "Parking awareness shares intelligence with restaurants, circulation, and Hub systems.",
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

          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 1400 700" fill="none">
              <path
                d="M100 180 C 340 240, 500 290, 710 350"
                stroke="rgba(56,189,248,0.45)"
                strokeWidth="5"
                strokeDasharray="12 12"
              />

              <path
                d="M710 350 C 930 250, 1110 190, 1290 110"
                stroke="rgba(249,115,22,0.35)"
                strokeWidth="5"
                strokeDasharray="12 12"
              />

              <path
                d="M710 350 C 930 450, 1100 520, 1280 600"
                stroke="rgba(16,185,129,0.35)"
                strokeWidth="5"
                strokeDasharray="12 12"
              />

              <circle
                cx="710"
                cy="350"
                r="145"
                stroke="rgba(56,189,248,0.16)"
                strokeWidth="3"
              />
            </svg>
          </div>

          <div className="relative z-10 grid gap-10 p-8 md:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
                Predictive Parking Intelligence
              </div>

              <h1 className="mt-10 text-5xl font-black leading-none tracking-tight md:text-7xl">
                The environment starts understanding arrival before humans do.
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
                Parking pressure, arrival timing, overflow movement, family
                access, ADA guidance, and circulation awareness become visible
                before confusion forms.
              </p>

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

            <div className="rounded-[36px] border border-zinc-800 bg-black/45 p-6 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Parking State
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {systems.map((item) => (
                  <div
                    key={item.title}
                    className={`rounded-3xl border p-5 ${item.tone}`}
                  >
                    <div className="text-xs uppercase tracking-[0.25em] opacity-70">
                      Awareness
                    </div>

                    <div className="mt-3 text-2xl font-black text-white">
                      {item.title}
                    </div>

                    <div className="mt-3 inline-flex rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold">
                      {item.status}
                    </div>

                    <p className="mt-4 text-sm leading-7 text-zinc-200">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[40px] border border-zinc-800 bg-zinc-950 p-8">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Awareness Over Signage
            </div>

            <h2 className="mt-4 text-5xl font-black leading-tight">
              Fewer signs. Less confusion. Better movement.
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-9 text-zinc-300">
              Traditional systems react to confusion by adding more signs,
              poles, arrows, painted warnings, and visual clutter. Predictive
              parking intelligence replaces overload with awareness.
            </p>

            <p className="mt-6 max-w-3xl text-lg leading-9 text-zinc-400">
              The environment quietly understands movement before congestion
              forms, preserving visibility, reducing blind spots, and creating
              calmer circulation for residents, families, guests, and services.
            </p>
          </div>

          <div className="space-y-6">
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <div
                  key={principle.title}
                  className="rounded-[32px] border border-white/10 bg-zinc-950 p-6"
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

        <section className="rounded-[40px] border border-cyan-400/15 bg-cyan-500/5 p-8">
          <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">
            Final Operational Principle
          </div>

          <h2 className="mt-4 text-5xl font-black leading-tight">
            The system quietly guides people before confusion begins.
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
        </section>
      </div>
    </div>
  );
}