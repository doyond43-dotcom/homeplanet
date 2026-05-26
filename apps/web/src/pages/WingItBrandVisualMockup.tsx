import { useNavigate } from "react-router-dom";

export default function WingItBrandVisualMockup() {
  const navigate = useNavigate();

  const infrastructureNodes = [
    {
      title: "Residents + Guests",
      label: "Demand Source",
      status: "Active",
      description:
        "Walk-up orders, group meals, game-day rushes, family dinners, and shared-table demand enter the WingIt node.",
      tone: "border-orange-400/15 bg-orange-400/5 text-orange-300",
    },
    {
      title: "WingIt Food Hall",
      label: "Experience Node",
      status: "Open",
      description:
        "The public-facing food hall gathers people, handles ordering, creates social energy, and pushes demand into the kitchen line.",
      tone: "border-yellow-400/15 bg-yellow-400/5 text-yellow-300",
    },
    {
      title: "Kitchen Line",
      label: "Production Node",
      status: "Firing",
      description:
        "Tickets, prep timing, pickup readiness, rush pressure, and food flow stay visible so the ecosystem can respond.",
      tone: "border-red-400/15 bg-red-400/5 text-red-300",
    },
    {
      title: "Pickup Counter",
      label: "Handoff Node",
      status: "Moving",
      description:
        "Pickup shelves, counter timing, takeout bags, and resident handoff keep orders moving without clogging the room.",
      tone: "border-sky-400/15 bg-sky-400/5 text-sky-300",
    },
    {
      title: "GreenBasket Warehouse",
      label: "Supply Node",
      status: "Restocking",
      description:
        "Food, drinks, packaging, dry goods, and rush supplies move from GreenBasket Warehouse into WingIt when pressure rises.",
      tone: "border-lime-400/15 bg-lime-400/5 text-lime-300",
    },
    {
      title: "Hub Coordination",
      label: "Control Layer",
      status: "Watching",
      description:
        "The Hub watches guest flow, kitchen pressure, shuttle support, cleanup rhythm, restock needs, and timing across the ecosystem.",
      tone: "border-fuchsia-400/15 bg-fuchsia-400/5 text-fuchsia-300",
    },
  ];

  const liveSignals = [
    {
      title: "Counter Demand",
      value: "42 orders",
      detail: "Walk-up and resident orders active",
      tone: "border-orange-400/15 text-orange-300",
    },
    {
      title: "Kitchen Pressure",
      value: "14 firing",
      detail: "Tickets moving through production",
      tone: "border-red-400/15 text-red-300",
    },
    {
      title: "Pickup Flow",
      value: "9m avg",
      detail: "Average counter handoff timing",
      tone: "border-sky-400/15 text-sky-300",
    },
    {
      title: "Warehouse Support",
      value: "14m ETA",
      detail: "GreenBasket restock inbound",
      tone: "border-lime-400/15 text-lime-300",
    },
  ];

  const operatingTimeline = [
    "Residents and guests create food hall demand.",
    "WingIt counter converts demand into kitchen tickets.",
    "Kitchen Line produces meals while pickup timing stays visible.",
    "GreenBasket Warehouse responds to restock and supply pressure.",
    "Hub Coordination watches the whole rhythm and keeps the node moving.",
  ];

  const connections = [
    "Residents",
    "WingIt",
    "Kitchen",
    "Pickup",
    "GreenBasket Warehouse",
    "Hub",
  ];

  return (
    <div className="min-h-screen bg-[#120f0b] p-6 text-white md:p-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
      >
        Back
      </button>

      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[36px] border border-orange-500/20 bg-gradient-to-br from-[#1a120c] via-[#130f0c] to-[#0d0b09]">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="flex flex-col justify-between p-8 md:p-12">
              <div>
                <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-orange-300">
                  WingIt Infrastructure Node
                </div>

                <div className="mt-10">
                  <h1 className="text-5xl font-black leading-none tracking-tight text-white md:text-7xl">
                    Food hall energy connected to ecosystem operations.
                  </h1>

                  <p className="mt-6 max-w-xl text-xl leading-relaxed text-zinc-300">
                    WingIt is not presented as a standalone restaurant. It is a
                    food, kitchen, pickup, supply, and social-flow node inside
                    the larger ecosystem.
                  </p>
                </div>

                <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-zinc-800 bg-black/25 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Node Type
                    </div>
                    <div className="mt-3 text-xl font-bold text-orange-300">
                      Social Food Engine
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-black/25 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Connected To
                    </div>
                    <div className="mt-3 text-xl font-bold text-orange-300">
                      Warehouse + Hub
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap gap-3">
                <div className="rounded-full bg-orange-400 px-5 py-3 font-black text-black">
                  Food Hall Node Live
                </div>

                <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-5 py-3 font-semibold text-orange-200">
                  Supply Connection Active
                </div>
              </div>
            </div>

            <div className="relative min-h-[540px] overflow-hidden bg-[#0d0b09] p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_35%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(234,88,12,0.14),transparent_35%)]" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.35em] text-zinc-500">
                      System Map
                    </div>

                    <div className="mt-3 text-3xl font-black text-white">
                      WingIt Operating Chain
                    </div>
                  </div>

                  <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">
                    94 Active Guests
                  </div>
                </div>

                <div className="mt-8 grid gap-3">
                  {connections.map((node, index) => (
                    <div key={node} className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-400 font-black text-black">
                        {index + 1}
                      </div>

                      <div className="flex-1 rounded-3xl border border-zinc-800 bg-black/45 p-4 backdrop-blur">
                        <div className="flex items-center justify-between gap-4">
                          <div className="font-bold text-white">{node}</div>
                          <div className="text-xs uppercase tracking-[0.2em] text-orange-300">
                            {index === 0
                              ? "Demand"
                              : index === 1
                              ? "Order"
                              : index === 2
                              ? "Produce"
                              : index === 3
                              ? "Handoff"
                              : index === 4
                              ? "Restock"
                              : "Coordinate"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-3xl border border-zinc-800 bg-[#1a1510]/90 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Orders
                    </div>
                    <div className="mt-2 text-3xl font-black text-orange-300">
                      42
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-[#1a1510]/90 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Avg Pickup
                    </div>
                    <div className="mt-2 text-3xl font-black text-orange-300">
                      9m
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-[#1a1510]/90 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Restock ETA
                    </div>
                    <div className="mt-2 text-3xl font-black text-orange-300">
                      14m
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl border border-orange-500/10 bg-orange-500/5 p-5">
                  <div className="text-xs uppercase tracking-[0.25em] text-orange-300">
                    Infrastructure Meaning
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    WingIt is the social food node. It pulls people in, creates
                    demand, pushes production pressure to the kitchen, and
                    triggers warehouse and Hub support when the flow changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {infrastructureNodes.map((card) => (
            <div
              key={card.title}
              className="rounded-[2rem] border border-zinc-800 bg-[#171411] p-8"
            >
              <div
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${card.tone}`}
              >
                {card.status}
              </div>

              <div className="mt-6 text-xs uppercase tracking-[0.3em] text-zinc-500">
                {card.label}
              </div>

              <h2 className="mt-4 text-3xl font-black text-white">
                {card.title}
              </h2>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                {card.description}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-orange-400/10 bg-black/30 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-orange-300">
                Live Operating Sequence
              </div>

              <h2 className="mt-4 text-4xl font-black text-white">
                WingIt operates as a connected food-flow system.
              </h2>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                The page should feel like infrastructure in motion: demand,
                ordering, production, pickup, supply, and coordination all
                visible at once.
              </p>
            </div>

            <div className="space-y-4">
              {operatingTimeline.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-3xl border border-zinc-800 bg-[#120f0b] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-400 font-black text-black">
                    {index + 1}
                  </div>

                  <div className="pt-2 text-zinc-300">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {liveSignals.map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border bg-[#171411] p-5 ${item.tone}`}
            >
              <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                {item.title}
              </div>

              <div className="mt-3 text-lg font-bold text-white">
                {item.value}
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {item.detail}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[#120f0b] p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-orange-300">
                Brand Marker Inside The System
              </div>

              <h2 className="mt-5 text-4xl font-black leading-tight text-white">
                The identity stays visible, but it supports the infrastructure.
              </h2>

              <p className="mt-6 text-lg leading-9 text-zinc-400">
                WingIt still needs the orange glow, food hall energy, and bold
                logo feel. But on this page, the brand should act like a system
                marker inside the ecosystem, not like a standalone restaurant
                advertisement.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Food hall node",
                  "Kitchen pressure",
                  "Pickup timing",
                  "Warehouse supply",
                  "Hub awareness",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-bold text-orange-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-orange-500/10 bg-black/40 p-4">
              <img
                src="/images/wingit-foodhall-energy-cover.png"
                alt="WingIt brand identity marker"
                className="h-full max-h-[360px] w-full rounded-[24px] object-cover opacity-80"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-orange-400/10 bg-gradient-to-br from-orange-500/10 via-[#1b120d] to-[#120d0a] p-8">
          <div className="text-xs uppercase tracking-[0.25em] text-orange-300">
            Why It Matters
          </div>

          <h2 className="mt-4 text-3xl font-black text-white">
            WingIt is the social food node of the ecosystem.
          </h2>

          <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-300">
            It connects resident demand, food hall energy, kitchen production,
            pickup timing, warehouse restock, shuttle support, and Hub
            coordination into one visible operating layer.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/planet/ecosystem-infrastructure"
              className="rounded-2xl bg-white px-5 py-4 font-black text-black"
            >
              Open Infrastructure Portal
            </a>

            <a
              href="/planet/greenbasket"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white"
            >
              Open GreenBasket
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}