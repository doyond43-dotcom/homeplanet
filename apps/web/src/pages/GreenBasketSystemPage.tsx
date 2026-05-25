export default function GreenBasketSystemPage() {
  const layers = [
    ["Fresh", "Daily essentials, groceries, pharmacy, coffee, grab-and-go, pickup, and resident convenience."],
    ["Warehouse", "Inventory, bulk supply, delivery support, restaurant restock, logistics flow, and ecosystem distribution."],
    ["Commons", "Bookstore, coffee lounge, coworking, gathering space, community interaction, and social circulation."],
  ];

  const flows = [
    "Fresh / Warehouse / Commons",
    "Community-responsive inventory",
    "Resident pickup + delivery flow",
    "WingIt supply restock",
    "Workforce tower support",
    "Hub logistics coordination",
    "Local culture + regional product demand",
    "Ecosystem participation",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
        <section className="rounded-3xl border border-lime-400/20 bg-zinc-950 p-8">
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-lime-300">
            GreenBasket System
          </div>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Not just a grocery store.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
            GreenBasket is designed as a circulation-supported ecosystem system:
            fresh food, warehouse logistics, community commons, local-responsive
            inventory, delivery flow, and operational support working together.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {layers.map(([title, body]) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
            >
              <div className="text-xs uppercase tracking-[0.25em] text-lime-300">
                GreenBasket
              </div>
              <h2 className="mt-3 text-3xl font-semibold">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-zinc-400">{body}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-2xl font-semibold">How GreenBasket Works</h2>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {flows.map((flow) => (
              <div
                key={flow}
                className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300"
              >
                {flow}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}