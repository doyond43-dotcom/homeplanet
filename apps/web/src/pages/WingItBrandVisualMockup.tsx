export default function WingItBrandVisualMockup() {
  const liveOrders = [
    {
      name: "Pickup #204",
      note: "Connected to ecosystem ordering flow",
      status: "Cooking",
      color: "border-orange-500/30 bg-orange-500/15 text-orange-300",
    },
    {
      name: "Shuttle Group Order",
      note: "Ready for route handoff",
      status: "Ready",
      color: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
    },
    {
      name: "Resident Family Combo",
      note: "Dinner flow attached to resident pickup",
      status: "Preparing",
      color: "border-amber-500/30 bg-amber-500/15 text-amber-300",
    },
  ];

  const colorSystem = [
    { title: "Primary", value: "Warm Orange", bg: "bg-orange-500" },
    { title: "Secondary", value: "Charcoal Black", bg: "bg-zinc-900" },
    { title: "Accent", value: "Hot Sauce Red", bg: "bg-red-500" },
    { title: "Energy", value: "Fast + Local", bg: "bg-amber-400" },
  ];

  const ecosystemCards = [
    {
      eyebrow: "Kitchen Flow",
      title: "Food that keeps the ecosystem moving.",
      text: "Wings, pickup orders, lunch rush, resident dinner flow, and kitchen timing all connect into ecosystem circulation.",
      tone: "text-orange-300 border-orange-400/10",
      items: ["Pickup timing", "Lunch rush coordination", "Driver routing", "Kitchen queue awareness"],
    },
    {
      eyebrow: "Social Gravity",
      title: "The place people naturally gather.",
      text: "WingIt becomes the warm social layer: lunch breaks, casual meetups, game nights, event energy, and community movement.",
      tone: "text-red-300 border-red-400/10",
      items: ["Commons overflow", "Game night traffic", "Resident meetups", "Event participation"],
    },
    {
      eyebrow: "Pickup + Delivery",
      title: "Orders move through the ecosystem.",
      text: "Resident pickup, tower delivery, shuttle routes, driver timing, and GreenBasket warehouse support keep food moving.",
      tone: "text-amber-300 border-amber-400/10",
      items: ["Resident pickup", "Tower delivery", "Shuttle coordination", "Driver awareness"],
    },
  ];

  const liveStats = [
    { title: "Lunch Rush", value: "Active", tone: "border-orange-400/10 text-orange-300" },
    { title: "Pickup Queue", value: "14 orders", tone: "border-red-400/10 text-red-300" },
    { title: "Tower Delivery", value: "6 en route", tone: "border-amber-400/10 text-amber-300" },
    { title: "Commons Traffic", value: "Game night", tone: "border-cyan-400/10 text-cyan-300" },
    { title: "GreenBasket Restock", value: "Ready", tone: "border-emerald-400/10 text-emerald-300" },
  ];

  return (
    <main className="min-h-screen bg-[#101010] px-5 py-6 text-white md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-orange-500/20 bg-gradient-to-br from-[#1a1a1a] via-[#18120f] to-[#100b08] shadow-2xl shadow-black/40">
          <div className="grid lg:grid-cols-2">
            <div className="flex min-h-[520px] flex-col justify-between p-8 md:p-12">
              <div>
                <div className="inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-300">
                  Ecosystem Restaurant Anchor
                </div>

                <div className="mt-9">
                  <h1 className="text-6xl font-black tracking-tight text-orange-400 md:text-8xl">
                    WingIt
                  </h1>

                  <p className="mt-4 max-w-lg text-xl leading-8 text-zinc-300">
                    Fast wings. Local energy. Community movement.
                  </p>
                </div>

                <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-zinc-800 bg-black/35 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Mood</div>
                    <div className="mt-2 text-lg font-bold text-orange-300">Warm + Fast</div>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-black/35 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Role</div>
                    <div className="mt-2 text-lg font-bold text-orange-300">Social Hub</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <div className="rounded-full bg-orange-500 px-5 py-3 font-black text-black">
                  Order Pickup
                </div>

                <div className="rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-3 font-bold text-orange-200">
                  Shuttle Stop Nearby
                </div>
              </div>
            </div>

            <div className="relative min-h-[520px] overflow-hidden bg-[#0f0f0f]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,120,0,0.28),transparent_45%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,40,0,0.18),transparent_42%)]" />

              <div className="relative z-10 flex h-full flex-col justify-between p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.28em] text-zinc-500">
                      WingIt Kitchen
                    </div>
                    <div className="mt-2 text-3xl font-black">Live Queue</div>
                  </div>

                  <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300">
                    14 Active Orders
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {liveOrders.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-lg font-bold">{item.name}</div>
                          <div className="mt-1 text-sm text-zinc-500">{item.note}</div>
                        </div>

                        <div className={`rounded-full border px-4 py-2 text-sm font-bold ${item.color}`}>
                          {item.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    ["Residents", "82"],
                    ["Drivers", "6"],
                    ["Pickup ETA", "7m"],
                  ].map(([title, value]) => (
                    <div key={title} className="rounded-2xl border border-zinc-800 bg-[#181818] p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{title}</div>
                      <div className="mt-2 text-2xl font-black text-orange-300">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {colorSystem.map((item) => (
            <div key={item.title} className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#141414]">
              <div className={`h-3 ${item.bg}`} />
              <div className="p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{item.title}</div>
                <div className="mt-2 text-lg font-bold">{item.value}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {ecosystemCards.map((card) => (
            <div key={card.eyebrow} className={`rounded-[2rem] border bg-[#181310] p-8 shadow-[0_0_40px_rgba(255,120,0,0.03)] ${card.tone}`}>
              <div className="text-xs font-bold uppercase tracking-[0.28em]">{card.eyebrow}</div>

              <h2 className="mt-5 text-3xl font-black leading-tight text-white">
                {card.title}
              </h2>

              <p className="mt-5 text-base leading-8 text-zinc-400">{card.text}</p>

              <div className="mt-8 space-y-3">
                {card.items.map((item) => (
                  <div key={item} className="rounded-xl bg-[#0f0f0f]/80 px-4 py-3 text-sm font-medium text-zinc-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#141414] p-8 md:p-10">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">
            WingIt Ecosystem Role
          </div>

          <h2 className="mt-5 text-4xl font-black leading-tight">
            WingIt is not just a restaurant.
          </h2>

          <p className="mt-6 max-w-5xl text-lg leading-9 text-zinc-400">
            WingIt gives the ecosystem energy. It supports food movement, gathering, resident interaction, lunch and dinner circulation, events, pickup timing, and social participation.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-5">
          {liveStats.map((item) => (
            <div key={item.title} className={`rounded-2xl border bg-[#18120f] p-5 ${item.tone}`}>
              <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                {item.title}
              </div>

              <div className="mt-3 text-lg font-black text-white">{item.value}</div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}




