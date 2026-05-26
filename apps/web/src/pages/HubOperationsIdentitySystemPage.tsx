import { useNavigate } from "react-router-dom";

export default function HubOperationsIdentitySystemPage() {
  const navigate = useNavigate();

  const colors = [
    {
      title: "Emerald",
      role: "Healthy operational flow",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    },
    {
      title: "Amber",
      role: "Pressure / pending awareness",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    },
    {
      title: "Red",
      role: "Critical escalation",
      className: "border-red-500/30 bg-red-500/10 text-red-300",
    },
    {
      title: "Sky",
      role: "Transit + circulation movement",
      className: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    },
    {
      title: "Lime",
      role: "Supply + essentials",
      className: "border-lime-500/30 bg-lime-500/10 text-lime-300",
    },
    {
      title: "Orange",
      role: "Social food energy",
      className: "border-orange-500/30 bg-orange-500/10 text-orange-300",
    },
    {
      title: "Fuchsia",
      role: "Care + support systems",
      className: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300",
    },
  ];

  const signals = [
    {
      title: "Movement",
      detail: "Shuttle routes, workforce circulation, delivery flow, and ecosystem transit visibility.",
    },
    {
      title: "Pressure",
      detail: "Kitchen load, resident demand, maintenance buildup, and support strain.",
    },
    {
      title: "Truth",
      detail: "Timestamped operational verification instead of assumptions or confusion.",
    },
    {
      title: "Awareness",
      detail: "The Hub sees relationships between systems instead of isolated events.",
    },
  ];

  const layers = [
    "Transportation routing",
    "Workforce coordination",
    "Resident support",
    "Maintenance operations",
    "Food + grocery circulation",
    "Daycare awareness",
    "Truth-chain verification",
    "Live operational alerts",
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
        <section className="relative overflow-hidden rounded-[36px] border border-zinc-800 bg-[#060606]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_30%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_35%)]" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] p-8 md:p-10">
            <div>
              <div className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-emerald-300">
                Operational Nervous System
              </div>

              <h1 className="mt-8 text-5xl font-black leading-none tracking-tight md:text-7xl">
                The Hub coordinates the ecosystem.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                The Hub is the operational awareness layer connecting
                circulation, workforce support, maintenance, food flow,
                resident services, transportation, and truth-chain visibility
                into one coordinated system.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="/planet/hub"
                  className="rounded-2xl bg-white px-5 py-4 font-black text-black"
                >
                  Open Hub
                </a>

                <a
                  href="/planet/circulation"
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white"
                >
                  Open Circulation
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950 p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.10),transparent_40%)]" />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      Live Awareness
                    </div>

                    <div className="mt-3 text-3xl font-black">
                      Operational Signal Layer
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-300">
                    Stable
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {signals.map((signal) => (
                    <div
                      key={signal.title}
                      className="rounded-3xl border border-zinc-800 bg-black/40 p-5"
                    >
                      <div className="text-xl font-black text-white">
                        {signal.title}
                      </div>

                      <p className="mt-3 leading-7 text-zinc-400">
                        {signal.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-7">
          {colors.map((color) => (
            <div
              key={color.title}
              className={`rounded-3xl border p-5 ${color.className}`}
            >
              <div className="text-xs uppercase tracking-[0.25em] opacity-70">
                Operational Tone
              </div>

              <div className="mt-3 text-3xl font-black text-white">
                {color.title}
              </div>

              <div className="mt-3 text-sm leading-6 opacity-80">
                {color.role}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[36px] border border-zinc-800 bg-zinc-950 p-8">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Coordination Philosophy
            </div>

            <h2 className="mt-5 text-4xl font-black leading-tight">
              The Hub is not monitoring.
            </h2>

            <div className="mt-8 space-y-5 text-lg leading-8 text-zinc-300">
              <p>
                The Hub coordinates movement, support, supply, awareness,
                pressure, and operational truth across the ecosystem.
              </p>

              <p>
                Instead of isolated systems operating independently, every
                operational layer becomes visible and connected.
              </p>

              <p>
                Workforce support, transportation, maintenance, food flow,
                daycare visibility, resident requests, and circulation become
                one living operational environment.
              </p>
            </div>
          </div>

          <div className="rounded-[36px] border border-zinc-800 bg-[#090909] p-8">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Infrastructure Layers
            </div>

            <div className="mt-6 space-y-4">
              {layers.map((layer) => (
                <div
                  key={layer}
                  className="rounded-2xl border border-zinc-800 bg-black/40 px-5 py-4 text-zinc-300"
                >
                  {layer}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-emerald-500/15 bg-emerald-500/5 p-8 md:p-10">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Operational DNA
          </div>

          <h2 className="mt-5 text-4xl font-black">
            Coordination first. Everything else builds on top.
          </h2>

          <p className="mt-6 max-w-5xl text-lg leading-9 text-zinc-300">
            Most systems build outward-in using disconnected businesses and
            disconnected operational tools. The HomePlanet ecosystem builds
            inward-out by establishing the operational backbone first, allowing
            circulation, workforce support, food systems, daycare, maintenance,
            and resident services to inherit awareness naturally.
          </p>
        </section>
      </div>
    </div>
  );
}