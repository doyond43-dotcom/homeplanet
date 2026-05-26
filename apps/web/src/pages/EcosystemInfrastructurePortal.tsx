import { useNavigate } from "react-router-dom";

export default function EcosystemInfrastructurePortal() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "GreenBasket",
      role: "Supply Infrastructure",
      description:
        "Fresh, Warehouse, and Commons working together as the food, supply, and community layer.",
      image: "/images/greenbasket-warehouse-commons-cover.png",
      link: "/planet/greenbasket",
      brandLink: "/planet/greenbasket-brand-palette",
      accent: "from-lime-500/20 to-emerald-500/10",
      status: "Supply live",
    },
    {
      title: "WingIt",
      role: "Social Food Node",
      description:
        "Food hall demand, kitchen pressure, pickup timing, warehouse support, and gathering energy.",
      image: "/images/wingit-foodhall-energy-cover.png",
      link: "/planet/wingit",
      brandLink: "/planet/wingit-brand-palette",
      accent: "from-orange-500/20 to-yellow-500/10",
      status: "Node active",
    },
    {
      title: "Circulation",
      role: "Movement Layer",
      description:
        "The living bloodstream of the ecosystem: workforce, delivery, daycare, resident flow, and shuttle movement.",
      image: "/images/circulation-delivery-shuttle-cover.png",
      link: "/planet/circulation",
      brandLink: "",
      accent: "from-sky-500/20 to-cyan-500/10",
      status: "Routes moving",
    },
    {
      title: "Operations Hub",
      role: "Nervous System",
      description:
        "The coordination layer watching timing, movement, workforce, alerts, support, and ecosystem rhythm.",
      image: "/images/operations-hub-command-center-cover.png",
      link: "/planet/hub",
      brandLink: "",
      accent: "from-fuchsia-500/20 to-purple-500/10",
      status: "Operational",
    },
  ];

  const flow = [
    "Residents create demand",
    "GreenBasket supplies daily life",
    "WingIt creates social food movement",
    "Circulation moves people and goods",
    "Hub coordinates timing and truth",
  ];

  const philosophy = [
    "Circulation over retail",
    "Connected infrastructure over isolated businesses",
    "Operational harmony over operational chaos",
    "Participation over rewards points",
    "Community flow over suburban sprawl",
    "Walkable ecosystem support",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.14),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.75))]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Back
          </button>

          <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-emerald-300">
            Ecosystem Infrastructure
          </div>

          <h1 className="mt-8 max-w-5xl text-5xl font-black leading-none tracking-tight md:text-7xl">
            One connected operating system for coordinated community life.
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-400 md:text-xl">
            GreenBasket, WingIt, Circulation, and the Hub are not separate pages.
            They are connected infrastructure layers inside one live ecosystem.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/planet/hub"
              className="rounded-2xl bg-white px-6 py-4 font-bold text-black transition hover:scale-[1.02]"
            >
              Open Hub
            </a>

            <a
              href="/planet/circulation"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold transition hover:bg-zinc-800"
            >
              Open Circulation
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-[36px] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Ecosystem Flow
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                Demand, supply, movement, and coordination working together.
              </h2>

              <p className="mt-5 leading-8 text-zinc-400">
                This is the top-level infrastructure view. Each node has its own
                role, but the value comes from the way they connect.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              {flow.map((item, index) => (
                <div
                  key={item}
                  className="rounded-3xl border border-zinc-800 bg-black/40 p-5"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-sm font-black text-black">
                    {index + 1}
                  </div>

                  <div className="mt-5 text-lg font-black text-white">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.title}
              className="group relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950 transition hover:border-zinc-700"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.accent}`}
              />

              <div className="relative z-10">
                <a href={section.link} className="block">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105"
                    />
                  </div>
                </a>

                <div className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">
                        {section.role}
                      </div>

                      <div className="mt-2 text-3xl font-black">
                        {section.title}
                      </div>
                    </div>

                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-300">
                      {section.status}
                    </div>
                  </div>

                  <p className="mt-4 leading-relaxed text-zinc-400">
                    {section.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={section.link}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
                    >
                      Open Infrastructure
                    </a>

                    {section.brandLink && (
                      <a
                        href={section.brandLink}
                        className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                      >
                        Open Brand Palette
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Ecosystem Philosophy
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                Built around circulation, not isolated development.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {philosophy.map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[32px] border border-zinc-800 bg-black p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Supply Layer
              </div>

              <div className="mt-4 text-3xl font-black">
                GreenBasket feeds the ecosystem.
              </div>

              <p className="mt-4 leading-relaxed text-zinc-400">
                Fresh, Warehouse, and Commons create the daily supply and
                participation layer.
              </p>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-black p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Movement Layer
              </div>

              <div className="mt-4 text-3xl font-black">
                Circulation keeps everything moving.
              </div>

              <p className="mt-4 leading-relaxed text-zinc-400">
                Shuttle routes, delivery, daycare movement, and workforce flow
                connect daily life.
              </p>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-black p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Coordination Layer
              </div>

              <div className="mt-4 text-3xl font-black">
                The Hub watches the rhythm.
              </div>

              <p className="mt-4 leading-relaxed text-zinc-400">
                Timing, alerts, workforce support, and the truth chain make the
                whole ecosystem visible.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


