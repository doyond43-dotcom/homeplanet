export default function WingItBrandVisualMockup() {
  return (
    <div className="min-h-screen bg-[#111111] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-[32px] overflow-hidden border border-orange-500/20 bg-gradient-to-br from-[#1a1a1a] via-[#18120f] to-[#120d0b]">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs tracking-[0.3em] uppercase text-orange-300">
                  Ecosystem Restaurant Anchor
                </div>

                <div className="mt-8">
                  <div className="text-6xl md:text-7xl font-black tracking-tight text-orange-400">
                    WingIt
                  </div>

                  <div className="mt-3 text-zinc-300 text-xl max-w-lg leading-relaxed">
                    Fast wings. Local energy. Community movement.
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 max-w-md">
                  <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                    <div className="text-xs uppercase tracking-wider text-zinc-500">
                      Mood
                    </div>
                    <div className="mt-2 font-semibold text-orange-300">
                      Warm + Fast
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
                    <div className="text-xs uppercase tracking-wider text-zinc-500">
                      Role
                    </div>
                    <div className="mt-2 font-semibold text-orange-300">
                      Social Hub
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap gap-3">
                <div className="rounded-full bg-orange-500 px-5 py-3 text-black font-bold">
                  Order Pickup
                </div>

                <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-orange-200 font-semibold">
                  Shuttle Stop Nearby
                </div>
              </div>
            </div>

            <div className="relative min-h-[420px] bg-[#0f0f0f] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,120,0,0.28),transparent_45%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,70,0,0.18),transparent_40%)]" />

              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm uppercase tracking-[0.3em] text-zinc-500">
                      WingIt Kitchen
                    </div>
                    <div className="mt-2 text-3xl font-black text-white">
                      Live Queue
                    </div>
                  </div>

                  <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                    14 Active Orders
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  {[
                    {
                      name: "Pickup #204",
                      status: "Cooking",
                      color: "bg-orange-500/20 text-orange-300 border-orange-500/30",
                    },
                    {
                      name: "Shuttle Group Order",
                      status: "Ready",
                      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                    },
                    {
                      name: "Resident Family Combo",
                      status: "Preparing",
                      color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-zinc-800 bg-black/40 p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-lg">
                            {item.name}
                          </div>
                          <div className="text-zinc-500 text-sm mt-1">
                            Connected to ecosystem ordering flow
                          </div>
                        </div>

                        <div
                          className={`rounded-full border px-4 py-2 text-sm font-semibold ${item.color}`}
                        >
                          {item.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-8">
                  <div className="rounded-2xl bg-[#1a1a1a] border border-zinc-800 p-4">
                    <div className="text-xs uppercase tracking-wider text-zinc-500">
                      Residents
                    </div>
                    <div className="mt-2 text-2xl font-black text-orange-300">
                      82
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#1a1a1a] border border-zinc-800 p-4">
                    <div className="text-xs uppercase tracking-wider text-zinc-500">
                      Drivers
                    </div>
                    <div className="mt-2 text-2xl font-black text-orange-300">
                      6
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#1a1a1a] border border-zinc-800 p-4">
                    <div className="text-xs uppercase tracking-wider text-zinc-500">
                      Pickup ETA
                    </div>
                    <div className="mt-2 text-2xl font-black text-orange-300">
                      7m
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            {
              title: "Primary",
              value: "Warm Orange",
              bg: "bg-orange-500",
            },
            {
              title: "Secondary",
              value: "Charcoal Black",
              bg: "bg-zinc-900",
            },
            {
              title: "Accent",
              value: "Hot Sauce Red",
              bg: "bg-red-500",
            },
            {
              title: "Energy",
              value: "Fast + Local",
              bg: "bg-amber-400",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-[#141414] overflow-hidden"
            >
              <div className={`h-3 ${item.bg}`} />
              <div className="p-5">
                <div className="text-xs uppercase tracking-wider text-zinc-500">
                  {item.title}
                </div>
                <div className="mt-2 font-semibold text-lg">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
