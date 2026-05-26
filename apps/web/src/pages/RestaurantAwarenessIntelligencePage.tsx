import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  ChefHat,
  Clock3,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export default function RestaurantAwarenessIntelligencePage() {
  const navigate = useNavigate();

  const awareness = [
    {
      title: "Pickup Pressure",
      status: "Building",
      description:
        "The restaurant detects growing pickup movement before congestion forms.",
      tone: "border-orange-400/25 bg-orange-500/10 text-orange-300",
    },
    {
      title: "Kitchen Rhythm",
      status: "Balanced",
      description:
        "Kitchen timing, order pacing, and circulation remain synchronized.",
      tone: "border-red-400/25 bg-red-500/10 text-red-300",
    },
    {
      title: "Table Awareness",
      status: "Active",
      description:
        "Dining turnover, shared tables, and waiting flow stay operationally visible.",
      tone: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    },
    {
      title: "Arrival Coordination",
      status: "Synchronizing",
      description:
        "Restaurant flow is quietly coordinating with parking and circulation awareness.",
      tone: "border-sky-400/25 bg-sky-500/10 text-sky-300",
    },
  ];

  const systems = [
    {
      icon: ChefHat,
      title: "Kitchen Pressure",
      description:
        "The system understands order buildup before the kitchen becomes overloaded.",
    },
    {
      icon: Clock3,
      title: "Wait Timing",
      description:
        "Hostess timing and table balancing become operationally visible.",
    },
    {
      icon: Users,
      title: "Dining Circulation",
      description:
        "Shared movement, family zones, and restaurant flow remain calm and readable.",
    },
    {
      icon: UtensilsCrossed,
      title: "Pickup Rhythm",
      description:
        "Pickup movement flows naturally without overwhelming dining circulation.",
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
        <section className="relative overflow-hidden rounded-[40px] border border-orange-400/20 bg-[#090909]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_36%)]" />

          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" viewBox="0 0 1400 700" fill="none">
              <path
                d="M110 170 C 350 240, 520 300, 700 350"
                stroke="rgba(249,115,22,0.45)"
                strokeWidth="5"
                strokeDasharray="12 12"
              />
              <path
                d="M700 350 C 910 280, 1110 220, 1280 150"
                stroke="rgba(56,189,248,0.40)"
                strokeWidth="5"
                strokeDasharray="12 12"
              />
              <path
                d="M700 350 C 930 440, 1120 520, 1290 590"
                stroke="rgba(132,204,22,0.35)"
                strokeWidth="5"
                strokeDasharray="12 12"
              />
              <circle
                cx="700"
                cy="350"
                r="135"
                stroke="rgba(249,115,22,0.15)"
                strokeWidth="3"
              />
            </svg>
          </div>

          <div className="relative z-10 grid gap-10 p-8 md:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-orange-300">
                Restaurant Awareness Intelligence
              </div>

              <h1 className="mt-10 text-5xl font-black leading-none tracking-tight md:text-7xl">
                The restaurant starts understanding movement.
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
                Arrival pressure, pickup rhythm, table flow, kitchen timing,
                hostess awareness, and circulation movement become visible
                before congestion forms.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="/planet/wingit-brand-palette"
                  className="rounded-2xl bg-white px-5 py-4 font-black text-black"
                >
                  Open WingIt Identity
                </a>

                <a
                  href="/planet/live-circulation-heartbeat"
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white"
                >
                  Circulation Heartbeat
                </a>
              </div>
            </div>

            <div className="rounded-[36px] border border-zinc-800 bg-black/45 p-6 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Restaurant State
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {awareness.map((item) => (
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

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[40px] border border-zinc-800 bg-zinc-950 p-8">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Restaurant Nervous System
            </div>

            <h2 className="mt-4 text-5xl font-black leading-tight">
              The environment quietly guides movement before confusion begins.
            </h2>

            <div className="relative mt-10 h-[520px] overflow-hidden rounded-[32px] border border-white/10 bg-black">
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 1200 520"
                fill="none"
              >
                <path
                  d="M120 120 C 320 180, 460 230, 600 260"
                  stroke="rgba(249,115,22,0.50)"
                  strokeWidth="5"
                  strokeDasharray="12 12"
                />

                <path
                  d="M600 260 C 840 180, 980 140, 1120 90"
                  stroke="rgba(56,189,248,0.45)"
                  strokeWidth="5"
                  strokeDasharray="12 12"
                />

                <path
                  d="M600 260 C 850 340, 980 400, 1120 460"
                  stroke="rgba(132,204,22,0.35)"
                  strokeWidth="5"
                  strokeDasharray="12 12"
                />

                <circle
                  cx="600"
                  cy="260"
                  r="120"
                  stroke="rgba(249,115,22,0.18)"
                  strokeWidth="3"
                />
              </svg>

              <Node
                title="Hostess"
                subtitle="Wait balancing"
                className="left-[6%] top-[10%] border-orange-400/25 bg-orange-500/10 text-orange-300"
              />

              <Node
                title="Dining"
                subtitle="Shared circulation"
                className="left-[36%] top-[34%] border-emerald-400/25 bg-emerald-500/10 text-emerald-300"
              />

              <Node
                title="Kitchen"
                subtitle="Pressure awareness"
                className="right-[8%] top-[10%] border-red-400/25 bg-red-500/10 text-red-300"
              />

              <Node
                title="Pickup"
                subtitle="Movement rhythm"
                className="right-[8%] bottom-[10%] border-sky-400/25 bg-sky-500/10 text-sky-300"
              />
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[40px] border border-zinc-800 bg-zinc-950 p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Operational Awareness
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                Calm movement replaces operational chaos.
              </h2>

              <div className="mt-8 space-y-4">
                {systems.map((system) => {
                  const Icon = system.icon;

                  return (
                    <div
                      key={system.title}
                      className="rounded-3xl border border-white/10 bg-black/40 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-orange-500/10 p-3">
                          <Icon className="h-5 w-5 text-orange-300" />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {system.title}
                          </h3>

                          <p className="mt-2 text-sm leading-7 text-zinc-400">
                            {system.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[40px] border border-sky-400/20 bg-sky-500/5 p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-sky-300">
                Shared Ecosystem DNA
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                Restaurant awareness shares intelligence with circulation and parking systems.
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-300">
                The restaurant does not operate alone. Arrival awareness,
                circulation timing, and parking intelligence quietly feed into
                restaurant movement so congestion can be understood before it
                forms.
              </p>

              <a
                href="/planet/predictive-parking-intelligence"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-5 py-4 font-bold text-sky-200 transition hover:bg-sky-500/20"
              >
                Open Predictive Parking Intelligence
                <ArrowRight className="h-4 w-4" />
              </a>
            </section>

            <section className="rounded-[40px] border border-orange-400/15 bg-orange-500/5 p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-orange-300">
                Final Operational Principle
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                The environment quietly guides people before confusion begins.
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-300">
                This is not a restaurant dashboard. This is operational
                awareness infrastructure connected to a living ecosystem.
              </p>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

function Node({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle: string;
  className: string;
}) {
  return (
    <div
      className={`absolute w-[220px] rounded-[28px] border p-5 backdrop-blur ${className}`}
    >
      <div className="text-2xl font-black">{title}</div>

      <div className="mt-2 text-sm opacity-80">{subtitle}</div>

      <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.25em] opacity-60">
        <Activity className="h-3.5 w-3.5" />
        Live
      </div>
    </div>
  );
}