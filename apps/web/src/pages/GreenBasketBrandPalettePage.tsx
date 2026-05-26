import { useNavigate } from "react-router-dom";

export default function GreenBasketBrandPalettePage() {
  const navigate = useNavigate();

  const palette = [
    {
      name: "Fresh Lime",
      hex: "#A3E635",
      role: "Fresh produce + daily essentials",
      className: "bg-lime-400 text-black",
    },
    {
      name: "Deep Market Green",
      hex: "#14532D",
      role: "Warehouse trust + operational flow",
      className: "bg-green-900 text-white",
    },
    {
      name: "Commons Emerald",
      hex: "#10B981",
      role: "Community gathering + participation",
      className: "bg-emerald-500 text-black",
    },
    {
      name: "Warehouse Olive",
      hex: "#365314",
      role: "Inventory + logistics rhythm",
      className: "bg-lime-900 text-white",
    },
    {
      name: "Natural Charcoal",
      hex: "#111312",
      role: "Grounded infrastructure base",
      className: "bg-[#111312] text-white",
    },
    {
      name: "Soft Cream",
      hex: "#F5F1E8",
      role: "Warmth + readability",
      className: "bg-[#F5F1E8] text-black",
    },
  ];

  const ecosystemLayers = [
    {
      title: "Fresh",
      detail:
        "Produce, groceries, coffee pickup, daily essentials, and resident support.",
      tone: "border-lime-400/20 bg-lime-400/10 text-lime-300",
    },
    {
      title: "Warehouse",
      detail:
        "Supply staging, inventory movement, delivery flow, and ecosystem logistics.",
      tone: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    },
    {
      title: "Commons",
      detail:
        "Coworking, coffee lounge, gathering, participation, and social circulation.",
      tone: "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
    },
  ];

  const identitySignals = [
    "Fresh food",
    "Resident pickup",
    "Warehouse movement",
    "Coffee commons",
    "Community gathering",
    "Operational circulation",
    "Daily ecosystem life",
    "Local participation",
  ];

  return (
    <div className="min-h-screen bg-black p-5 text-white md:p-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
      >
        Back
      </button>

      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-[40px] border border-lime-400/15 bg-[#070907]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.18),transparent_35%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_35%)]" />

          <div className="relative z-10 p-8 md:p-12">
            <div className="inline-flex rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-lime-300">
              GreenBasket Identity System
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <h1 className="text-5xl font-black leading-none tracking-tight md:text-7xl">
                  Fresh food.
                  <br />
                  Strong community.
                  <br />
                  Daily ecosystem flow.
                </h1>

                <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">
                  GreenBasket is the visual identity for food, warehouse
                  movement, resident pickup, supply circulation, and daily
                  ecosystem participation.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                  <a
                    href="/planet/greenbasket"
                    className="rounded-2xl bg-white px-5 py-4 font-black text-black"
                  >
                    Open GreenBasket
                  </a>

                  <a
                    href="/planet/ecosystem-infrastructure"
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white"
                  >
                    Infrastructure Portal
                  </a>
                </div>
              </div>

              <div className="overflow-hidden rounded-[36px] border border-lime-400/15 bg-black/50 p-3">
                <img
                  src="/images/GreenBasket-RealWorld-BrandDirection.jpg"
                  alt="GreenBasket real world direction"
                  className="w-full rounded-[28px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[40px] border border-zinc-800 bg-zinc-950">
          <div className="border-b border-zinc-800 px-8 py-8 md:px-10">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Brand Direction Board
            </div>

            <h2 className="mt-4 text-5xl font-black leading-none">
              The polished ecosystem identity.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              This is where the operational ecosystem starts becoming emotionally
              understandable through visuals, food systems, gathering energy,
              and circulation design.
            </p>
          </div>

          <img
            src="/images/greenbasket-brand-direction-board.png"
            alt="GreenBasket brand direction board"
            className="w-full object-cover"
          />
        </section>

        <section className="rounded-[40px] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Hand Sketch Exploration
              </div>

              <h2 className="mt-4 text-5xl font-black leading-tight">
                Infrastructure ideas should begin human first.
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Early sketches, circulation thinking, and ecosystem mapping are
                part of the identity system itself. The project should feel
                designed from real thought and operational purpose instead of
                generic templates.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {identitySignals.map((signal) => (
                  <div
                    key={signal}
                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-300"
                  >
                    {signal}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[36px] border border-zinc-800 bg-black">
              <img
                src="/images/greenbasket-hand-sketch.png"
                alt="GreenBasket hand sketch"
                className="w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[40px] border border-zinc-800 bg-zinc-950">
          <div className="border-b border-zinc-800 px-8 py-8 md:px-10">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Palette + Real World Direction
            </div>

            <h2 className="mt-4 text-5xl font-black leading-none">
              The ecosystem should feel calm, useful, and alive.
            </h2>
          </div>

          <img
            src="/images/GreenBasket-Ecosystem-BrandPalette.jpg"
            alt="GreenBasket ecosystem palette"
            className="w-full object-cover"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {ecosystemLayers.map((layer) => (
            <div
              key={layer.title}
              className={`rounded-[32px] border p-6 ${layer.tone}`}
            >
              <div className="text-xs uppercase tracking-[0.28em] opacity-70">
                Ecosystem Layer
              </div>

              <h2 className="mt-4 text-4xl font-black text-white">
                {layer.title}
              </h2>

              <p className="mt-5 leading-7 text-zinc-300">
                {layer.detail}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-[40px] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Color System
              </div>

              <h2 className="mt-4 text-5xl font-black leading-tight">
                Calm, operational, natural, and trustworthy.
              </h2>

              <p className="mt-6 leading-8 text-zinc-400">
                The GreenBasket palette should work across vans, warehouse
                signage, pickup systems, commons spaces, ecosystem maps, and
                operational infrastructure.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {palette.map((color) => (
                <div
                  key={color.name}
                  className="overflow-hidden rounded-[28px] border border-zinc-800 bg-black"
                >
                  <div
                    className={`flex h-32 items-end p-5 ${color.className}`}
                  >
                    <div>
                      <div className="text-2xl font-black">{color.name}</div>

                      <div className="mt-1 text-xs font-bold uppercase tracking-[0.25em] opacity-70">
                        {color.hex}
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-sm leading-7 text-zinc-400">
                      {color.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[40px] border border-lime-400/15 bg-lime-400/5 p-8 md:p-10">
          <div className="text-xs uppercase tracking-[0.35em] text-lime-300">
            Infrastructure Meaning
          </div>

          <h2 className="mt-4 max-w-5xl text-5xl font-black leading-tight">
            GreenBasket becomes ecosystem infrastructure instead of isolated
            retail.
          </h2>

          <p className="mt-8 max-w-4xl text-lg leading-9 text-zinc-300">
            Food. Coffee. Warehouse. Delivery. Commons. Participation.
            Workforce circulation. Resident support. Daily life movement.
            GreenBasket becomes part of the operational bloodstream of the
            ecosystem.
          </p>
        </section>
      </div>
    </div>
  );
}