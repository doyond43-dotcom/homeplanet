import { useNavigate } from "react-router-dom";

export default function EcosystemCirculationBoard() {
  const navigate = useNavigate();

  const flowCards = [
    {
      title: "Workforce",
      value: "148",
      label: "people housed close",
      tone: "text-sky-300 border-sky-500/30 bg-sky-500/10",
    },
    {
      title: "Shuttles",
      value: "12",
      label: "routes moving",
      tone: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      title: "GreenBasket",
      value: "34",
      label: "orders in flow",
      tone: "text-lime-300 border-lime-500/30 bg-lime-500/10",
    },
    {
      title: "WingIt",
      value: "19",
      label: "kitchen orders active",
      tone: "text-orange-300 border-orange-500/30 bg-orange-500/10",
    },
  ];

  const movements = [
    {
      route: "Tower A > Nest Daycare > Hub",
      detail: "Parent workforce route with child handoff visibility.",
      status: "On Time",
      tone: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      route: "GreenBasket Warehouse > WingIt",
      detail: "Food hall supply restock tied to lunch pressure.",
      status: "In Transit",
      tone: "text-lime-300 border-lime-500/30 bg-lime-500/10",
    },
    {
      route: "Tower C > WingIt Food Hall",
      detail: "Resident lunch circulation moving toward the social food node.",
      status: "Building",
      tone: "text-orange-300 border-orange-500/30 bg-orange-500/10",
    },
    {
      route: "Laundry Ops > Daycare",
      detail: "Clean towel and uniform rotation supporting daily childcare flow.",
      status: "Queued",
      tone: "text-amber-300 border-amber-500/30 bg-amber-500/10",
    },
  ];

  const timeline = [
    "6:45 AM - Workforce tower shuttle routes activated",
    "7:05 AM - Daycare parent drop-off circulation begins",
    "8:10 AM - GreenBasket resident pickup queue opens",
    "10:30 AM - WingIt lunch prep load increases",
    "12:00 PM - Hub watches food hall and shuttle traffic",
  ];

  const lanes = [
    {
      title: "People",
      detail:
        "Residents, workers, parents, children, and guests move through predictable daily paths.",
      tone: "border-sky-500/20 bg-sky-500/10 text-sky-300",
    },
    {
      title: "Goods",
      detail:
        "Food, groceries, laundry, supplies, and maintenance materials move through coordinated routes.",
      tone: "border-lime-500/20 bg-lime-500/10 text-lime-300",
    },
    {
      title: "Support",
      detail:
        "Daycare, workforce help, repairs, alerts, and resident needs stay visible to the Hub.",
      tone: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    },
    {
      title: "Truth",
      detail:
        "Every movement can become a timestamped operational record instead of a guess.",
      tone: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300",
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
        <section className="relative min-h-[720px] overflow-hidden rounded-[36px] border border-zinc-800 bg-zinc-950">
          <img
            src="/images/circulation-delivery-shuttle-cover.png"
            alt="Circulation infrastructure"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/75 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_30%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_35%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="max-w-2xl">
                <div className="inline-flex rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-sky-300">
                  Movement Layer
                </div>

                <h1 className="mt-8 text-5xl font-black leading-none tracking-tight md:text-7xl">
                  The bloodstream between every ecosystem node.
                </h1>

                <p className="mt-6 text-lg leading-8 text-zinc-300">
                  Circulation connects people, goods, services, daycare, food,
                  workforce support, resident requests, and Hub awareness into
                  one living operational flow.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href="/planet/hub"
                    className="rounded-2xl bg-white px-5 py-4 font-black text-black"
                  >
                    Open Hub
                  </a>

                  <a
                    href="/planet/ecosystem-infrastructure"
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white"
                  >
                    Infrastructure Portal
                  </a>
                </div>
              </div>

              <div className="flex flex-col justify-start">
                <div className="flex justify-end">
                  <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                      Status
                    </div>

                    <div className="mt-2 text-2xl font-black text-white">
                      Moving
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {flowCards.map((card) => (
                    <div
                      key={card.title}
                      className={`rounded-3xl border p-5 backdrop-blur-md ${card.tone}`}
                    >
                      <div className="text-xs uppercase tracking-[0.22em] opacity-70">
                        {card.title}
                      </div>

                      <div className="mt-3 text-4xl font-black text-white">
                        {card.value}
                      </div>

                      <div className="mt-1 text-sm opacity-80">
                        {card.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-black/40 p-5 backdrop-blur">
                  <div className="text-xs uppercase tracking-[0.25em] text-sky-300">
                    Circulation Meaning
                  </div>

                  <p className="mt-3 leading-7 text-zinc-300">
                    The ecosystem becomes affordable and coordinated when
                    movement, support, supply, and workforce circulation are
                    intentionally connected.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-4">
              {lanes.map((lane) => (
                <div
                  key={lane.title}
                  className={`rounded-3xl border p-5 backdrop-blur-md ${lane.tone}`}
                >
                  <div className="text-xs uppercase tracking-[0.25em] opacity-70">
                    Circulation Lane
                  </div>

                  <div className="mt-3 text-3xl font-black text-white">
                    {lane.title}
                  </div>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {lane.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative min-h-[680px] overflow-hidden rounded-[36px] border border-zinc-800 bg-zinc-950 p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.10),transparent_45%)]" />

            <div className="absolute inset-0 pointer-events-none">
              <svg className="h-full w-full" viewBox="0 0 1000 680" fill="none">
                <path
                  d="M160 120 C 320 160, 390 250, 500 320"
                  stroke="rgba(56,189,248,0.55)"
                  strokeWidth="5"
                  strokeDasharray="12 12"
                />
                <path
                  d="M500 320 C 620 250, 720 190, 850 130"
                  stroke="rgba(132,204,22,0.55)"
                  strokeWidth="5"
                  strokeDasharray="12 12"
                />
                <path
                  d="M500 320 C 350 410, 270 500, 180 570"
                  stroke="rgba(249,115,22,0.55)"
                  strokeWidth="5"
                  strokeDasharray="12 12"
                />
                <path
                  d="M500 320 C 650 420, 750 500, 850 570"
                  stroke="rgba(234,179,8,0.55)"
                  strokeWidth="5"
                  strokeDasharray="12 12"
                />
                <circle
                  cx="500"
                  cy="320"
                  r="82"
                  stroke="rgba(16,185,129,0.28)"
                  strokeWidth="3"
                />
                <circle
                  cx="500"
                  cy="320"
                  r="150"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2"
                />
              </svg>
            </div>

            <div className="relative z-10 mb-6">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Live Circulation Map
              </div>

              <h2 className="mt-3 text-4xl font-black">
                Nodes stay useful because movement connects them.
              </h2>
            </div>

            <div className="relative z-10 h-[560px]">
              <Node
                title="The Hub"
                label="Operations brain"
                className="left-[34%] top-[38%] border-emerald-400/50 bg-emerald-500/20 text-emerald-200 shadow-[0_0_80px_rgba(16,185,129,0.22)]"
              />
              <Node
                title="Workforce Towers"
                label="People housed close"
                className="left-[4%] top-[4%] border-sky-500/30 bg-sky-500/10 text-sky-300"
              />
              <Node
                title="GreenBasket"
                label="Supply + essentials"
                className="right-[2%] top-[4%] border-lime-500/30 bg-lime-500/10 text-lime-300"
              />
              <Node
                title="WingIt"
                label="Social food node"
                className="bottom-[2%] left-[4%] border-orange-500/30 bg-orange-500/10 text-orange-300"
              />
              <Node
                title="Laundry + Maintenance"
                label="Service circulation"
                className="bottom-[2%] right-[2%] border-amber-500/30 bg-amber-500/10 text-amber-300"
              />
              <Node
                title="Nest Daycare"
                label="Parent workforce support"
                className="left-[4%] top-[35%] border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300"
              />
              <Node
                title="Resident Requests"
                label="Daily life support"
                className="right-[5%] top-[35%] border-zinc-500/40 bg-zinc-500/10 text-zinc-200"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Active Movement Chains
              </div>

              <div className="mt-5 space-y-4">
                {movements.map((item) => (
                  <div
                    key={item.route}
                    className="rounded-3xl border border-zinc-800 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-white">{item.route}</div>
                        <div className="mt-1 text-sm text-zinc-500">
                          {item.detail}
                        </div>
                      </div>

                      <div
                        className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${item.tone}`}
                      >
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Circulation Timeline
              </div>

              <div className="mt-5 space-y-3">
                {timeline.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Why It Matters
              </div>

              <div className="mt-4 text-2xl font-black leading-tight">
                Affordability comes from circulation.
              </div>

              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                Workers live closer. Shuttles reduce friction. GreenBasket
                moves essentials through the ecosystem. WingIt supports daily
                food flow. The Hub keeps movement coordinated instead of
                chaotic.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Node({
  title,
  label,
  className,
}: {
  title: string;
  label: string;
  className: string;
}) {
  return (
    <div
      className={`absolute w-[210px] rounded-3xl border p-5 backdrop-blur-xl transition duration-500 hover:scale-[1.02] ${className}`}
    >
      <div className="text-2xl font-black leading-tight">{title}</div>
      <div className="mt-2 text-sm leading-relaxed opacity-80">{label}</div>
      <div className="mt-4 text-xs uppercase tracking-[0.25em] opacity-60">
        In Flow
      </div>
    </div>
  );
}


