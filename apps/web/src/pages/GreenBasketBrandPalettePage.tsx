import { useNavigate } from "react-router-dom";

export default function GreenBasketBrandPalettePage() {
  const navigate = useNavigate();

  const flow = [
    {
      title: "GreenBasket Fresh",
      label: "Daily essentials",
      status: "Open",
      description:
        "Resident pickup, fresh produce, grab-and-go essentials, coffee, and everyday grocery support.",
      items: ["Fresh produce", "Coffee pickup", "Daily essentials", "Resident requests"],
    },
    {
      title: "GreenBasket Warehouse",
      label: "Supply and logistics",
      status: "Moving",
      description:
        "Bulk supply, inventory rotation, delivery routing, storage, and restock coordination for the ecosystem.",
      items: ["Inventory flow", "Warehouse restock", "Delivery staging", "Supply tracking"],
    },
    {
      title: "GreenBasket Commons",
      label: "Community participation",
      status: "Active",
      description:
        "Coffee lounge, coworking, bookshop, community tables, local gathering, and resident participation.",
      items: ["Coffee commons", "Coworking", "Community events", "Resident connection"],
    },
  ];

  const timeline = [
    "Fresh receives morning resident pickup demand.",
    "Warehouse checks supply levels and prepares restock movement.",
    "Commons opens gathering and participation flow.",
    "Hub watches timing, movement, shuttle support, and delivery rhythm.",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.18),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-14">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            Back
          </button>

          <div className="inline-flex rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-lime-300">
            GreenBasket Infrastructure System
          </div>

          <h1 className="mt-8 max-w-5xl text-5xl font-black leading-none tracking-tight md:text-7xl">
            Fresh, Warehouse, and Commons operating as one connected ecosystem.
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-400 md:text-xl">
            GreenBasket is not just a store. It is the food, supply, gathering,
            and movement layer inside the ecosystem.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="overflow-hidden rounded-[36px] border border-zinc-800 bg-zinc-950">
          <img
            src="/images/greenbasket-warehouse-commons-cover.png"
            alt="GreenBasket infrastructure"
            className="h-[320px] w-full object-cover opacity-85 md:h-[460px]"
          />

          <div className="grid gap-6 p-6 md:grid-cols-3">
            {flow.map((part) => (
              <div
                key={part.title}
                className="rounded-[28px] border border-zinc-800 bg-black p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.25em] text-lime-300">
                      {part.label}
                    </div>
                    <h2 className="mt-3 text-3xl font-black">{part.title}</h2>
                  </div>

                  <span className="rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-bold text-lime-300">
                    {part.status}
                  </span>
                </div>

                <p className="mt-4 leading-relaxed text-zinc-400">
                  {part.description}
                </p>

                <div className="mt-6 space-y-2">
                  {part.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
          <div className="rounded-[36px] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-zinc-500">
              Live ecosystem flow
            </div>

            <h2 className="mt-4 text-4xl font-black">
              The system keeps food, people, supply, and community moving.
            </h2>

            <div className="mt-8 grid gap-4">
              {timeline.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-3xl border border-zinc-800 bg-black p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 font-black text-black">
                    {index + 1}
                  </div>
                  <p className="leading-relaxed text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] border border-lime-400/20 bg-lime-400/10 p-6 md:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-lime-300">
              Why it matters
            </div>

            <h2 className="mt-4 text-4xl font-black">
              GreenBasket becomes infrastructure.
            </h2>

            <p className="mt-5 leading-relaxed text-zinc-300">
              Fresh handles daily resident needs. Warehouse keeps supply moving.
              Commons creates participation and gathering. The Hub coordinates
              timing, delivery, shuttle movement, and operational rhythm.
            </p>

            <a
              href="/planet/ecosystem-infrastructure"
              className="mt-8 inline-flex rounded-2xl bg-white px-5 py-4 font-black text-black"
            >
              Open Infrastructure Portal
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}