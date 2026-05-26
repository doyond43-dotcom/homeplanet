import { useNavigate } from "react-router-dom";

export default function GreenBasketMarketBrandVisualDirection() {
  const navigate = useNavigate();

  const systemCards = [
    {
      title: "GreenBasket Fresh",
      eyebrow: "Daily Essentials",
      status: "Open",
      description:
        "Fresh produce, coffee, grab-and-go food, resident pickup, and everyday grocery support.",
      items: ["Resident pickup", "Fresh produce", "Coffee + grab-and-go", "Daily essentials"],
      tone: "border-lime-400/15 bg-lime-400/5 text-lime-300",
    },
    {
      title: "GreenBasket Warehouse",
      eyebrow: "Supply + Logistics",
      status: "Moving",
      description:
        "Bulk supply, inventory rotation, delivery staging, WingIt restock, and ecosystem distribution flow.",
      items: ["Warehouse restock", "Delivery staging", "WingIt supply", "Inventory movement"],
      tone: "border-yellow-400/15 bg-yellow-400/5 text-yellow-300",
    },
    {
      title: "GreenBasket Commons",
      eyebrow: "Community Layer",
      status: "Active",
      description:
        "Coffee lounge, coworking, bookshop, community tables, meetings, and resident participation.",
      items: ["Coffee commons", "Coworking", "Community events", "Resident connection"],
      tone: "border-emerald-400/15 bg-emerald-400/5 text-emerald-300",
    },
  ];

  const liveFlow = [
    {
      title: "Resident Pickup",
      value: "18 completed",
      detail: "Fresh orders moving through pickup lane",
      tone: "border-lime-400/15 text-lime-300",
    },
    {
      title: "Warehouse Restock",
      value: "In motion",
      detail: "Fresh and WingIt supply staged together",
      tone: "border-yellow-400/15 text-yellow-300",
    },
    {
      title: "Commons Activity",
      value: "Lunch rush active",
      detail: "Coffee, coworking, and gathering flow",
      tone: "border-emerald-400/15 text-emerald-300",
    },
    {
      title: "Shuttle Route",
      value: "Tower B active",
      detail: "Family essentials and daycare supply route",
      tone: "border-sky-400/15 text-sky-300",
    },
  ];

  const operatingTimeline = [
    "Fresh receives resident pickup and daily grocery demand.",
    "Warehouse checks supply levels and stages restock movement.",
    "Commons opens coffee, coworking, and participation flow.",
    "Hub watches timing, shuttle movement, delivery rhythm, and supply pressure.",
  ];

  return (
    <div className="min-h-screen bg-[#0f1110] p-6 text-white md:p-10">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
      >
        Back
      </button>

      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[36px] border border-lime-500/20 bg-gradient-to-br from-[#141816] via-[#111513] to-[#0d100f]">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="flex flex-col justify-between p-8 md:p-12">
              <div>
                <div className="inline-flex items-center rounded-full border border-lime-500/20 bg-lime-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-lime-300">
                  GreenBasket Infrastructure System
                </div>

                <div className="mt-10">
                  <h1 className="text-5xl font-black leading-none tracking-tight text-white md:text-7xl">
                    Fresh, Warehouse, and Commons operating together.
                  </h1>

                  <p className="mt-6 max-w-xl text-xl leading-relaxed text-zinc-300">
                    GreenBasket is the food, supply, gathering, and circulation
                    layer inside the ecosystem. It is not isolated retail.
                  </p>
                </div>

                <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-zinc-800 bg-black/25 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      System Role
                    </div>
                    <div className="mt-3 text-xl font-bold text-lime-300">
                      Daily Life Infrastructure
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-black/25 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Live Flow
                    </div>
                    <div className="mt-3 text-xl font-bold text-lime-300">
                      Food + Supply + Community
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap gap-3">
                <div className="rounded-full bg-lime-400 px-5 py-3 font-black text-black">
                  Resident Pickup Active
                </div>

                <div className="rounded-full border border-lime-500/20 bg-lime-500/10 px-5 py-3 font-semibold text-lime-200">
                  Warehouse Movement Live
                </div>
              </div>
            </div>

            <div className="relative min-h-[500px] overflow-hidden bg-[#0c0f0d]">
              <img
                src="/images/greenbasket-warehouse-commons-cover.png"
                alt="GreenBasket warehouse commons infrastructure"
                className="absolute inset-0 h-full w-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black via-black/55 to-black/25" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.2),transparent_35%)]" />

              <div className="relative z-10 flex h-full flex-col justify-between p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.35em] text-zinc-500">
                      Live System View
                    </div>

                    <div className="mt-3 text-3xl font-black text-white">
                      Ecosystem Circulation
                    </div>
                  </div>

                  <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                    62 Active Residents
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  {[
                    {
                      title: "Fresh Pickup Demand",
                      subtitle: "Resident orders, groceries, coffee, and daily needs",
                      status: "Ready",
                      tone: "bg-emerald-500/15 border-emerald-500/20 text-emerald-300",
                    },
                    {
                      title: "Warehouse Supply Movement",
                      subtitle: "Restock, inventory rotation, and delivery staging",
                      status: "Moving",
                      tone: "bg-yellow-500/15 border-yellow-500/20 text-yellow-300",
                    },
                    {
                      title: "Commons Participation Flow",
                      subtitle: "Coffee, coworking, gathering, and community rhythm",
                      status: "Active",
                      tone: "bg-lime-500/15 border-lime-500/20 text-lime-300",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-zinc-800 bg-black/45 p-5 backdrop-blur"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-lg font-bold text-white">
                            {item.title}
                          </div>

                          <div className="mt-2 text-sm text-zinc-400">
                            {item.subtitle}
                          </div>
                        </div>

                        <div
                          className={`rounded-full border px-4 py-2 text-sm font-bold ${item.tone}`}
                        >
                          {item.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-3xl border border-zinc-800 bg-[#171a18]/90 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Fresh Stock
                    </div>
                    <div className="mt-2 text-3xl font-black text-lime-300">
                      92%
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-[#171a18]/90 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Deliveries
                    </div>
                    <div className="mt-2 text-3xl font-black text-lime-300">
                      18
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-800 bg-[#171a18]/90 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Next ETA
                    </div>
                    <div className="mt-2 text-3xl font-black text-lime-300">
                      11m
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {systemCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[2rem] border border-zinc-800 bg-[#151816] p-8"
            >
              <div
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${card.tone}`}
              >
                {card.status}
              </div>

              <div className="mt-6 text-xs uppercase tracking-[0.3em] text-zinc-500">
                {card.eyebrow}
              </div>

              <h2 className="mt-4 text-3xl font-black text-white">
                {card.title}
              </h2>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                {card.description}
              </p>

              <div className="mt-8 space-y-3">
                {card.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/5 bg-black/30 px-4 py-3 text-zinc-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[2rem] border border-lime-400/10 bg-black/30 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-lime-300">
                Live Operating Sequence
              </div>

              <h2 className="mt-4 text-4xl font-black text-white">
                The system keeps food, people, supply, and gathering moving.
              </h2>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                Fresh handles everyday resident demand. Warehouse keeps the
                supply chain moving. Commons turns the market into a place for
                gathering and participation. The Hub watches the rhythm.
              </p>
            </div>

            <div className="space-y-4">
              {operatingTimeline.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-3xl border border-zinc-800 bg-[#101310] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 font-black text-black">
                    {index + 1}
                  </div>

                  <div className="pt-2 text-zinc-300">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          {liveFlow.map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border bg-[#151816] p-5 ${item.tone}`}
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

        <section className="rounded-[2rem] border border-white/10 bg-[#101310] p-8 md:p-10">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Community Responsive Inventory
          </div>

          <h2 className="mt-5 text-4xl font-black text-white">
            The community helps shape the store.
          </h2>

          <p className="mt-6 max-w-5xl text-lg leading-9 text-zinc-400">
            GreenBasket adapts to the people living and working inside the
            ecosystem. Local culture, workforce demand, resident requests,
            regional products, delivery flow, daycare support, and daily
            circulation all influence inventory and operational rhythm.
          </p>
        </section>

        <section className="rounded-[2rem] border border-lime-400/10 bg-lime-400/5 p-8">
          <div className="text-xs uppercase tracking-[0.25em] text-lime-300">
            Why It Matters
          </div>

          <h2 className="mt-4 text-3xl font-black text-white">
            GreenBasket becomes daily-life infrastructure.
          </h2>

          <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-300">
            It connects food, coffee, warehouse movement, delivery, community
            gathering, cultural responsiveness, logistics, and resident
            circulation into one working system.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/planet/ecosystem-infrastructure"
              className="rounded-2xl bg-white px-5 py-4 font-black text-black"
            >
              Open Infrastructure Portal
            </a>

            <a
              href="/planet/circulation"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white"
            >
              Open Circulation Board
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}








