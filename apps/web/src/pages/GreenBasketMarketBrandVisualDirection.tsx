export default function GreenBasketMarketBrandVisualDirection() {
  return (
    <div className="min-h-screen bg-[#0f1110] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-[36px] overflow-hidden border border-lime-500/20 bg-gradient-to-br from-[#141816] via-[#111513] to-[#0d100f]">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-lime-500/20 bg-lime-500/10 px-4 py-2 text-xs tracking-[0.35em] uppercase text-lime-300">
                  Ecosystem Grocery Market
                </div>

                <div className="mt-10">
                  <div className="text-6xl md:text-7xl font-black tracking-tight text-lime-300 leading-none">
                    GreenBasket
                  </div>

                  <div className="mt-4 text-zinc-300 text-xl max-w-xl leading-relaxed">
                    Fresh essentials. Resident circulation. Everyday ecosystem living.
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 max-w-lg">
                  <div className="rounded-3xl border border-zinc-800 bg-black/20 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Mood
                    </div>
                    <div className="mt-3 text-xl font-bold text-lime-300">
                      Fresh + Calm
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-black/20 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Role
                    </div>
                    <div className="mt-3 text-xl font-bold text-lime-300">
                      Daily Essentials
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap gap-3">
                <div className="rounded-full bg-lime-400 px-5 py-3 text-black font-black">
                  Resident Pickup
                </div>

                <div className="rounded-full border border-lime-500/20 bg-lime-500/10 px-5 py-3 text-lime-200 font-semibold">
                  Shuttle Delivery Active
                </div>
              </div>
            </div>

            <div className="relative min-h-[500px] overflow-hidden bg-[#0c0f0d]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.18),transparent_35%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(250,204,21,0.12),transparent_35%)]" />

              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.35em] text-zinc-500">
                      GreenBasket Market
                    </div>

                    <div className="mt-3 text-3xl font-black text-white">
                      Live Resident Flow
                    </div>
                  </div>

                  <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                    62 Active Residents
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  {[
                    {
                      title: "Fresh Produce Pickup",
                      subtitle: "Resident Tower B",
                      status: "Ready",
                      tone: "bg-emerald-500/15 border-emerald-500/20 text-emerald-300",
                    },
                    {
                      title: "WingIt Supply Restock",
                      subtitle: "Connected ecosystem supply chain",
                      status: "In Transit",
                      tone: "bg-orange-500/15 border-orange-500/20 text-orange-300",
                    },
                    {
                      title: "Shuttle Delivery Route",
                      subtitle: "Family essentials + daycare supplies",
                      status: "Departing",
                      tone: "bg-sky-500/15 border-sky-500/20 text-sky-300",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-zinc-800 bg-black/20 p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-lg font-bold text-white">
                            {item.title}
                          </div>

                          <div className="mt-2 text-sm text-zinc-500">
                            {item.subtitle}
                          </div>
                        </div>

                        <div className={`rounded-full border px-4 py-2 text-sm font-bold ${item.tone}`}>
                          {item.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mt-8">
                  <div className="rounded-3xl border border-zinc-800 bg-[#171a18] p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Fresh Stock
                    </div>
                    <div className="mt-2 text-3xl font-black text-lime-300">
                      92%
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-[#171a18] p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Deliveries
                    </div>
                    <div className="mt-2 text-3xl font-black text-lime-300">
                      18
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-[#171a18] p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      ETA
                    </div>
                    <div className="mt-2 text-3xl font-black text-lime-300">
                      11m
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
              value: "Fresh Lime",
              color: "bg-lime-400",
            },
            {
              title: "Secondary",
              value: "Natural Charcoal",
              color: "bg-zinc-900",
            },
            {
              title: "Accent",
              value: "Citrus Gold",
              color: "bg-yellow-400",
            },
            {
              title: "Energy",
              value: "Fresh + Local",
              color: "bg-emerald-400",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl overflow-hidden border border-zinc-800 bg-[#151816]"
            >
              <div className={`h-3 ${item.color}`} />

              <div className="p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {item.title}
                </div>

                <div className="mt-3 text-xl font-bold text-white">
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
