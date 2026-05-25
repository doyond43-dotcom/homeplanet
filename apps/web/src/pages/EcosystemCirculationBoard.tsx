export default function EcosystemCirculationBoard() {
  const flowCards = [
    {
      title: "Workforce Towers",
      value: "148",
      label: "workers housed",
      tone: "text-sky-300 border-sky-500/30 bg-sky-500/10",
    },
    {
      title: "Active Shuttles",
      value: "12",
      label: "routes moving",
      tone: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      title: "GreenBasket Transit",
      value: "34",
      label: "orders in flow",
      tone: "text-lime-300 border-lime-500/30 bg-lime-500/10",
    },
    {
      title: "WingIt Load",
      value: "19",
      label: "active kitchen orders",
      tone: "text-orange-300 border-orange-500/30 bg-orange-500/10",
    },
  ];

  const movements = [
    {
      route: "Tower A → Nest Daycare → Hub",
      detail: "Morning workforce parent route",
      status: "On Time",
      tone: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      route: "GreenBasket → WingIt",
      detail: "Restaurant supply restock",
      status: "In Transit",
      tone: "text-lime-300 border-lime-500/30 bg-lime-500/10",
    },
    {
      route: "Tower C → WingIt Food Hall",
      detail: "Lunch circulation spike",
      status: "Building",
      tone: "text-orange-300 border-orange-500/30 bg-orange-500/10",
    },
    {
      route: "Laundry Ops → Daycare",
      detail: "Clean towel + uniform rotation",
      status: "Queued",
      tone: "text-amber-300 border-amber-500/30 bg-amber-500/10",
    },
  ];

  const timeline = [
    "6:45 AM — Workforce Tower shuttle routes activated",
    "7:05 AM — Daycare parent drop-off circulation begins",
    "8:10 AM — GreenBasket resident pickup queue opens",
    "10:30 AM — WingIt lunch prep load increased",
    "12:00 PM — Hub monitoring food hall and shuttle traffic",
  ];

  return (
    <div className="min-h-screen bg-black text-white p-5 md:p-8">
        <a
          data-ecosystem-nav="true"
          href="/planet/ecosystem"
          className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-emerald-400/40 hover:text-white"
        >
          ? Back to Ecosystem
        </a>
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-6 md:p-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_35%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_35%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                Coordinated Living Infrastructure
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">
                Ecosystem Circulation Board
              </h1>
              <p className="mt-4 max-w-3xl text-zinc-400 text-lg leading-relaxed">
                Live movement between workforce housing, shuttles, daycare,
                food, grocery, maintenance, resident requests, and daily
                ecosystem operations.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 min-w-[240px]">
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                Current Pulse
              </div>
              <div className="mt-3 text-3xl font-black">Balanced</div>
              <div className="mt-2 text-sm text-zinc-300">
                Workforce, delivery, and resident movement are operating inside
                normal load.
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {flowCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-3xl border p-5 ${card.tone}`}
            >
              <div className="text-xs uppercase tracking-[0.22em] opacity-70">
                {card.title}
              </div>
              <div className="mt-3 text-4xl font-black text-white">
                {card.value}
              </div>
              <div className="mt-1 text-sm opacity-80">{card.label}</div>
            </div>
          ))}
        </section>

        <section className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6">
          <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-6 relative overflow-hidden min-h-[680px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.10),transparent_45%)]" />
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 680" fill="none">
                <path d="M160 120 C 320 160, 390 250, 500 320" stroke="rgba(56,189,248,0.45)" strokeWidth="5" strokeDasharray="12 12" />
                <path d="M500 320 C 620 250, 720 190, 850 130" stroke="rgba(132,204,22,0.45)" strokeWidth="5" strokeDasharray="12 12" />
                <path d="M500 320 C 350 410, 270 500, 180 570" stroke="rgba(249,115,22,0.45)" strokeWidth="5" strokeDasharray="12 12" />
                <path d="M500 320 C 650 420, 750 500, 850 570" stroke="rgba(234,179,8,0.45)" strokeWidth="5" strokeDasharray="12 12" />
                <circle cx="500" cy="320" r="82" stroke="rgba(16,185,129,0.22)" strokeWidth="3" />
                <circle cx="500" cy="320" r="150" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              </svg>
            </div>

            <div className="relative z-10 h-full">
              <Node
                title="The Hub"
                label="Operations Brain"
                className="top-[42%] left-[38%] border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
              />
              <Node
                title="Workforce Towers"
                label="Affordable employee housing"
                className="top-[8%] left-[4%] border-sky-500/40 bg-sky-500/10 text-sky-300"
              />
              <Node
                title="GreenBasket"
                label="Essentials + delivery"
                className="top-[8%] right-[4%] border-lime-500/40 bg-lime-500/10 text-lime-300"
              />
              <Node
                title="WingIt"
                label="Food hall + social load"
                className="bottom-[8%] left-[6%] border-orange-500/40 bg-orange-500/10 text-orange-300"
              />
              <Node
                title="Laundry + Maintenance"
                label="Service circulation"
                className="bottom-[8%] right-[4%] border-amber-500/40 bg-amber-500/10 text-amber-300"
              />
              <Node
                title="Nest Daycare"
                label="Parent workforce support"
                className="top-[35%] left-[6%] border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300"
              />
              <Node
                title="Resident Requests"
                label="Daily life support"
                className="top-[35%] right-[5%] border-zinc-500/40 bg-zinc-500/10 text-zinc-200"
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
                        className={`rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap ${item.tone}`}
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
              <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
                Workers live closer. Shuttles reduce friction. GreenBasket moves
                essentials through the ecosystem. WingIt supports daily food
                flow. The Hub keeps movement coordinated instead of chaotic.
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
      className={`absolute w-[230px] rounded-3xl border p-5 backdrop-blur-md ${className}`}
    >
      <div className="text-2xl font-black leading-tight">{title}</div>
      <div className="mt-2 text-sm opacity-80 leading-relaxed">{label}</div>
      <div className="mt-4 text-xs uppercase tracking-[0.25em] opacity-60">
        In Flow
      </div>
    </div>
  );
}

