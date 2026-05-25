export default function EcosystemInfrastructureLayer() {
  const infrastructureNodes = [
    {
      title: "GreenBasket",
      role: "Food circulation + resident pickup",
      tone: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    },
    {
      title: "WingIt",
      role: "Social energy + kitchen flow",
      tone: "border-orange-400/20 bg-orange-500/10 text-orange-300",
    },
    {
      title: "Coffee",
      role: "Morning activation + gathering",
      tone: "border-amber-400/20 bg-amber-500/10 text-amber-300",
    },
    {
      title: "Warehouse",
      role: "Inventory + ecosystem intake",
      tone: "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",
    },
  ];

  const infrastructureFlow = [
    "Vendor Arrival",
    "Warehouse Intake",
    "Kitchen + Inventory Sync",
    "Resident Demand",
    "Pickup + Delivery",
    "Community Participation",
  ];

  const liveSystems = [
    {
      title: "Shared Infrastructure",
      text: "Every ecosystem anchor operates on the same operational truth layer.",
    },
    {
      title: "Operational Awareness",
      text: "Pickup timing, kitchen flow, inventory movement, workforce participation, and resident interaction stay connected.",
    },
    {
      title: "Live Circulation",
      text: "Movement across the ecosystem becomes visible instead of fragmented between disconnected businesses.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#101010] px-5 py-6 text-white md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <a
          href="/planet/ecosystem"
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-emerald-400/40 hover:text-white"
        >
          ? Back to Ecosystem
        </a>
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#171717] via-[#141414] to-[#101010]">
          <div className="relative overflow-hidden p-8 md:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.10),transparent_40%)]" />

            <div className="relative z-10 max-w-4xl">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-zinc-300">
                Shared Ecosystem Infrastructure
              </div>

              <h1 className="mt-8 text-5xl font-black leading-tight md:text-7xl">
                One infrastructure.
                <br />
                Multiple ecosystem anchors.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-9 text-zinc-400">
                GreenBasket, WingIt, coffee, warehouse coordination, delivery,
                resident pickup, workforce participation, and ecosystem movement
                all operate on the same shared HomePlanet infrastructure layer.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {infrastructureNodes.map((node) => (
            <div
              key={node.title}
              className="rounded-[2rem] border border-white/10 bg-[#151515] p-6"
            >
              <div
                className={`inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] ${node.tone}`}
              >
                {node.title}
              </div>

              <div className="mt-6 text-2xl font-black">{node.title}</div>

              <div className="mt-3 text-base leading-7 text-zinc-400">
                {node.role}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#141414] p-8 md:p-10">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">
            Ecosystem Flow
          </div>

          <h2 className="mt-5 text-4xl font-black">
            Infrastructure adapts across the ecosystem.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {infrastructureFlow.map((step, index) => (
              <div
                key={step}
                className="relative rounded-2xl border border-white/10 bg-[#181818] p-5"
              >
                <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Step {index + 1}
                </div>

                <div className="mt-3 text-lg font-bold">{step}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {liveSystems.map((item) => (
            <div
              key={item.title}
              className="rounded-[2rem] border border-white/10 bg-[#151515] p-8"
            >
              <div className="text-2xl font-black">{item.title}</div>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                {item.text}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-emerald-400/10 bg-[#121614] p-8 md:p-10">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">
            HomePlanet Infrastructure Layer
          </div>

          <h2 className="mt-5 text-4xl font-black leading-tight">
            The ecosystem stops operating like disconnected businesses.
          </h2>

          <p className="mt-6 max-w-4xl text-lg leading-9 text-zinc-400">
            Food movement, delivery coordination, workforce participation,
            inventory timing, resident interaction, kitchen flow, and operational
            awareness become part of one connected circulation system instead of
            isolated apps, websites, and disconnected workflows.
          </p>

          <div className="mt-10">
            <a
              href="/planet/greenbasket"
              className="inline-flex rounded-full bg-emerald-500 px-6 py-3 text-sm font-black text-black transition hover:bg-emerald-400"
            >
              Open GreenBasket Brand Direction
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
