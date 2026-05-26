import { useNavigate } from "react-router-dom";

export default function WingItBrandIdentityPage() {
  const navigate = useNavigate();

  const palette = [
    {
      name: "Neon Orange",
      hex: "#F97316",
      role: "Energy, appetite, food hall pulse",
      className: "bg-orange-500 text-black",
    },
    {
      name: "Hot Wing Red",
      hex: "#DC2626",
      role: "Heat, urgency, kitchen pressure",
      className: "bg-red-600 text-white",
    },
    {
      name: "Golden Fry",
      hex: "#FACC15",
      role: "Warmth, menu highlights, comfort",
      className: "bg-yellow-400 text-black",
    },
    {
      name: "Night Charcoal",
      hex: "#120F0B",
      role: "Neon contrast and food hall depth",
      className: "bg-[#120f0b] text-white",
    },
    {
      name: "Cream Signage",
      hex: "#FFF7ED",
      role: "Readable signs, menus, human warmth",
      className: "bg-orange-50 text-black",
    },
  ];

  const signals = [
    "Food hall energy",
    "Shared tables",
    "Pickup rhythm",
    "Kitchen pressure",
    "Game night",
    "Warehouse restock",
    "Community gathering",
    "Social circulation",
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
        <section className="relative overflow-hidden rounded-[40px] border border-orange-400/20 bg-[#120f0b]">
          <img
            src="/images/wingit-foodhall-energy-cover.png"
            alt="WingIt food hall energy"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.24),transparent_35%)]" />

          <div className="relative z-10 p-8 md:p-12">
            <div className="inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-orange-300">
              WingIt Identity System
            </div>

            <h1 className="mt-10 max-w-5xl text-5xl font-black leading-none tracking-tight md:text-7xl">
              Good wings. Good people. Good energy.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
              WingIt is the social food identity inside the ecosystem: kitchen
              pressure, shared tables, pickup flow, neon energy, warehouse
              support, and community gathering moving together.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/planet/wingit"
                className="rounded-2xl bg-white px-5 py-4 font-black text-black"
              >
                Open WingIt
              </a>

              <a
                href="/planet/ecosystem-infrastructure"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white"
              >
                Infrastructure Portal
              </a>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[40px] border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Raw Concept Sketch
              </div>
              <h2 className="mt-4 text-4xl font-black leading-tight">
                The first spark of the food hall system.
              </h2>
            </div>

            <img
              src="/images/wingit-hand-sketch-v1.png"
              alt="WingIt raw hand sketch"
              className="w-full object-cover"
            />
          </div>

          <div className="overflow-hidden rounded-[40px] border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Refined Concept Sketch
              </div>
              <h2 className="mt-4 text-4xl font-black leading-tight">
                Energy becoming a real identity system.
              </h2>
            </div>

            <img
              src="/images/wingit-hand-sketch-v2.png"
              alt="WingIt refined hand sketch"
              className="w-full object-cover"
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-[40px] border border-zinc-800 bg-zinc-950">
          <div className="border-b border-zinc-800 px-8 py-8 md:px-10">
            <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Brand Direction Board
            </div>

            <h2 className="mt-4 text-5xl font-black leading-none">
              The polished food hall identity.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-400">
              WingIt has to feel loud, warm, local, social, and operational:
              not just a restaurant, but a living food node inside the
              ecosystem.
            </p>
          </div>

          <img
            src="/images/wingit-brand-direction-board.png"
            alt="WingIt brand direction board"
            className="w-full object-cover"
          />
        </section>

        <section className="overflow-hidden rounded-[40px] border border-orange-400/20 bg-[#120f0b]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 md:p-10">
              <div className="text-xs uppercase tracking-[0.35em] text-orange-300">
                Real World Ecosystem Flow
              </div>

              <h2 className="mt-4 text-5xl font-black leading-tight">
                Restaurant energy becomes circulation infrastructure.
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-400">
                WingIt pulls people in, creates demand, activates kitchen
                pressure, drives pickup movement, and triggers warehouse and Hub
                support when the food hall gets busy.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {signals.map((signal) => (
                  <div
                    key={signal}
                    className="rounded-2xl border border-orange-400/15 bg-black/35 px-4 py-3 text-sm text-zinc-300"
                  >
                    {signal}
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden border-t border-orange-400/15 lg:border-l lg:border-t-0">
              <img
                src="/images/WingIt-RealWorld-EcosystemFlow.jpg.png"
                alt="WingIt real world ecosystem flow"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[40px] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Color System
              </div>

              <h2 className="mt-4 text-5xl font-black leading-tight">
                Hot, social, readable, and alive.
              </h2>

              <p className="mt-6 leading-8 text-zinc-400">
                The WingIt palette should work across neon signage, menu boards,
                kitchen screens, pickup counters, food hall wayfinding, social
                posts, and ecosystem infrastructure maps.
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

        <section className="rounded-[40px] border border-orange-400/15 bg-orange-400/5 p-8 md:p-10">
          <div className="text-xs uppercase tracking-[0.35em] text-orange-300">
            Infrastructure Meaning
          </div>

          <h2 className="mt-4 max-w-5xl text-5xl font-black leading-tight">
            WingIt becomes the social food engine of the ecosystem.
          </h2>

          <p className="mt-8 max-w-4xl text-lg leading-9 text-zinc-300">
            Food hall energy. Kitchen pressure. Shared tables. Pickup timing.
            Warehouse support. Hub awareness. Community gathering. WingIt is not
            just where people eat. It is where social circulation becomes
            operationally visible.
          </p>
        </section>
      </div>
    </div>
  );
}
