export default function EcosystemInfrastructurePortal() {
  const sections = [
    {
      title: "GreenBasket",
      description:
        "Fresh, Warehouse, and Commons working together as one circulation ecosystem.",
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop",
      link: "/planet/greenbasket",
      accent: "from-lime-500/20 to-emerald-500/10",
    },
    {
      title: "WingIt",
      description:
        "Food hall energy, social circulation, resident interaction, and community gathering.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
      link: "/planet/wingit",
      accent: "from-orange-500/20 to-yellow-500/10",
    },
    {
      title: "Circulation",
      description:
        "The living bloodstream of the ecosystem — workforce, delivery, daycare, and shuttle movement.",
      image:
        "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop",
      link: "/planet/circulation",
      accent: "from-sky-500/20 to-cyan-500/10",
    },
    {
      title: "Operations Hub",
      description:
        "Operational coordination layer managing timing, movement, workforce, and ecosystem flow.",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
      link: "/planet/hub",
      accent: "from-fuchsia-500/20 to-purple-500/10",
    },
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-emerald-300">
            Ecosystem Infrastructure
          </div>

          <h1 className="mt-8 text-5xl md:text-7xl font-black tracking-tight max-w-5xl leading-none">
            Connected operational systems for coordinated communities.
          </h1>

          <p className="mt-8 max-w-3xl text-lg md:text-xl text-zinc-400 leading-relaxed">
            A circulation-first ecosystem combining food, wellness,
            transportation, childcare, logistics, operations, and resident life
            into one connected environment.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/planet/circulation"
              className="rounded-2xl bg-white text-black px-6 py-4 font-bold hover:scale-[1.02] transition"
            >
              Open Circulation Board
            </a>

            <a
              href="/planet/greenbasket"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-6 py-4 font-semibold hover:bg-zinc-800 transition"
            >
              Explore GreenBasket
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-6">
          {sections.map((section) => (
            <a
              key={section.title}
              href={section.link}
              className="group relative overflow-hidden rounded-[32px] border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.accent}`}
              />

              <div className="relative z-10">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition duration-700"
                  />
                </div>

                <div className="p-6">
                  <div className="text-3xl font-black">
                    {section.title}
                  </div>

                  <p className="mt-4 text-zinc-400 leading-relaxed">
                    {section.description}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold">
                    Open Experience →
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10">
            <div>
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Ecosystem Philosophy
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                Built around circulation, not isolated development.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
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
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="rounded-[32px] border border-zinc-800 bg-black p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                GreenBasket
              </div>

              <div className="mt-4 text-3xl font-black">
                Three Parts. One Ecosystem.
              </div>

              <p className="mt-4 text-zinc-400 leading-relaxed">
                Fresh. Warehouse. Commons. Connected through circulation,
                delivery, logistics, and resident participation.
              </p>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-black p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Workforce Support
              </div>

              <div className="mt-4 text-3xl font-black">
                Live closer. Circulate better.
              </div>

              <p className="mt-4 text-zinc-400 leading-relaxed">
                Workforce towers, daycare integration, shuttle systems, and
                ecosystem coordination reduce operational friction and improve
                affordability.
              </p>
            </div>

            <div className="rounded-[32px] border border-zinc-800 bg-black p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                Long-Term Direction
              </div>

              <div className="mt-4 text-3xl font-black">
                Connected operational infrastructure.
              </div>

              <p className="mt-4 text-zinc-400 leading-relaxed">
                A living ecosystem where transportation, food, wellness,
                logistics, operations, and community support work together
                naturally.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}