export default function EcosystemCirculationMapMVP() {
  const zones = [
    {
      title: "The Hub",
      role: "Operations + Coordination",
      position: "top-[8%] left-[38%]",
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    },
    {
      title: "WingIt Food Hall",
      role: "Social + Restaurant Core",
      position: "top-[30%] left-[12%]",
      color: "border-orange-500/40 bg-orange-500/10 text-orange-300",
    },
    {
      title: "GreenBasket Market",
      role: "Groceries + Essentials",
      position: "top-[30%] right-[10%]",
      color: "border-lime-500/40 bg-lime-500/10 text-lime-300",
    },
    {
      title: "Nest Daycare",
      role: "Childcare + Presence",
      position: "top-[58%] left-[18%]",
      color: "border-sky-500/40 bg-sky-500/10 text-sky-300",
    },
    {
      title: "Resident Living",
      role: "Homes + Apartments",
      position: "top-[58%] right-[14%]",
      color: "border-zinc-500/40 bg-zinc-500/10 text-zinc-200",
    },
    {
      title: "Gym + Lounge",
      role: "Community Wellness",
      position: "bottom-[10%] left-[32%]",
      color: "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300",
    },
    {
      title: "Laundry + Maintenance",
      role: "Operations Support",
      position: "bottom-[10%] right-[18%]",
      color: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    },
  ];

  const connections = [
    "Hub → Shuttle Routes",
    "WingIt → Resident Orders",
    "GreenBasket → Restaurant Supply",
    "Nest → Parent Pickup Flow",
    "Laundry → Workforce Support",
    "Gym → Resident Community",
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                Coordinated Living Ecosystem
              </div>

              <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
                Ecosystem Circulation Map
              </h1>

              <p className="mt-4 text-zinc-400 text-lg max-w-3xl leading-relaxed">
                Operational circulation between residents, businesses,
                transportation, childcare, workforce coordination, food,
                wellness, and everyday essentials.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-5 min-w-[240px]">
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                Ecosystem State
              </div>

              <div className="mt-3 text-3xl font-black text-white">
                Operational
              </div>

              <div className="mt-2 text-sm text-zinc-300 leading-relaxed">
                Live circulation between workforce, residents, transportation,
                services, and commercial infrastructure.
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6">
          <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-6 relative overflow-hidden min-h-[760px]">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_35%)]" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.10),transparent_40%)]" />

            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 760" fill="none">
                <path d="M500 120 C 350 200, 300 320, 260 420" stroke="rgba(16,185,129,0.35)" strokeWidth="4" strokeDasharray="10 10" />
                <path d="M500 120 C 650 220, 720 320, 760 420" stroke="rgba(249,115,22,0.35)" strokeWidth="4" strokeDasharray="10 10" />
                <path d="M260 420 C 380 500, 460 560, 500 640" stroke="rgba(56,189,248,0.35)" strokeWidth="4" strokeDasharray="10 10" />
                <path d="M760 420 C 680 520, 620 580, 560 640" stroke="rgba(234,179,8,0.35)" strokeWidth="4" strokeDasharray="10 10" />
                <path d="M260 420 C 420 380, 600 360, 760 420" stroke="rgba(244,114,182,0.22)" strokeWidth="3" strokeDasharray="8 12" />
              </svg>
            </div>

            <div className="relative z-10 w-full h-full">
              {zones.map((zone) => (
                <div
                  key={zone.title}
                  className={`absolute ${zone.position} w-[240px] rounded-3xl border p-5 backdrop-blur-md ${zone.color}`}
                >
                  <div className="text-2xl font-black leading-tight">
                    {zone.title}
                  </div>

                  <div className="mt-3 text-sm opacity-80 leading-relaxed">
                    {zone.role}
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.25em] opacity-70">
                    Connected
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Live Operational Flows
              </div>

              <div className="mt-6 space-y-4">
                {connections.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-zinc-800 bg-black/30 p-4"
                  >
                    <div className="font-semibold text-zinc-100">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Ecosystem Philosophy
              </div>

              <div className="mt-5 text-lg leading-relaxed text-zinc-300">
                One hand washes the other.
              </div>

              <div className="mt-5 space-y-3 text-sm text-zinc-400 leading-relaxed">
                <div>
                  Residents work inside the ecosystem.
                </div>

                <div>
                  Businesses circulate value back into the community.
                </div>

                <div>
                  Transportation, childcare, food, wellness, and operations all coordinate together.
                </div>

                <div>
                  Shared infrastructure reduces friction and operational waste.
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900 p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Future Expansion
              </div>

              <div className="mt-4 text-2xl font-black text-white leading-tight">
                Coordinated Living Infrastructure
              </div>

              <div className="mt-4 text-sm text-zinc-400 leading-relaxed">
                This circulation model can scale into mixed-use communities,
                campus-style developments, operational districts, and future
                ecosystem environments.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
