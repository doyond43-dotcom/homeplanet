export default function HomePlanetLiveBriefingPresentationPage() {
  const slides = [
    {
      title: "Predictive Parking Awareness",
      subtitle: "Movement begins before congestion forms.",
      image: "/images/HomePlanet-PredictiveParking-GuidedArrival-Sunset-v1.png",
      description:
        "The environment quietly guides circulation before pressure builds. Parking, arrivals, movement, and destination awareness work together instead of reacting late.",
      accent: "from-cyan-500/20 to-emerald-500/10",
    },
    {
      title: "GreenBasket Market",
      subtitle: "Daily ecosystem circulation.",
      image: "/images/greenbasket-market-brand-identity-v1.png",
      description:
        "Fresh essentials, workforce circulation, resident pickup, delivery flow, and ecosystem logistics connected together through one awareness layer.",
      accent: "from-lime-500/20 to-emerald-500/10",
    },
    {
      title: "WingIt Social Energy",
      subtitle: "Restaurants become circulation anchors.",
      image: "/images/wingit-social-energy-brand-v1.png",
      description:
        "WingIt is more than food. It becomes a social gravity layer connected to movement, participation, timing, delivery coordination, and resident experience.",
      accent: "from-orange-500/20 to-red-500/10",
    },
    {
      title: "Participation Living",
      subtitle: "Reduced stress through coordination.",
      image: "/images/HomePlanet-ParticipationCommunity-CalmCirculation-Evening-v1.png",
      description:
        "Workforce housing, shuttle coordination, daycare movement, grocery circulation, and operational timing all move together as one connected ecosystem.",
      accent: "from-emerald-500/20 to-cyan-500/10",
    },
    {
      title: "The Hub",
      subtitle: "Operational intelligence for the ecosystem.",
      image: "/images/homeplanet-hub-operations-center-v1.png",
      description:
        "The Hub coordinates movement, logistics, restaurant flow, workforce circulation, maintenance, delivery timing, and ecosystem awareness in real time.",
      accent: "from-violet-500/20 to-cyan-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-white/10 bg-[#070707] overflow-hidden">
          <div className="border-b border-white/10 px-6 py-5 md:px-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                  HomePlanet Live Operational Briefing
                </div>

                <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
                  One Ecosystem. One Circulation Layer.
                </h1>

                <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-400 md:text-lg">
                  This presentation is designed to explain how awareness,
                  circulation, workforce participation, logistics, dining,
                  movement, and daily life infrastructure work together as one
                  connected operational ecosystem.
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-5">
                <div className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                  Live Briefing Timer
                </div>
                <div className="mt-3 text-5xl font-black text-white">
                  30:00
                </div>
                <div className="mt-2 text-sm text-emerald-100/70">
                  Guided operational walkthrough
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 md:p-10">
            {slides.map((slide, index) => (
              <section
                key={slide.title}
                className={`overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${slide.accent}`}
              >
                <div className="grid lg:grid-cols-2">
                  <div className="relative min-h-[340px] border-b border-white/10 lg:border-b-0 lg:border-r">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  </div>

                  <div className="flex flex-col justify-between p-8 md:p-10">
                    <div>
                      <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                        Section {index + 1}
                      </div>

                      <h2 className="mt-5 text-4xl font-black leading-tight text-white md:text-5xl">
                        {slide.title}
                      </h2>

                      <div className="mt-4 text-xl font-medium text-zinc-200">
                        {slide.subtitle}
                      </div>

                      <p className="mt-6 text-base leading-8 text-zinc-300 md:text-lg">
                        {slide.description}
                      </p>
                    </div>

                    <div className="mt-10 flex flex-wrap gap-3">
                      <button className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]">
                        Open Live Page
                      </button>

                      <button className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                        View Circulation Flow
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <div className="border-t border-white/10 px-6 py-5 md:px-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold text-white">
                  Live Operational Briefing
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  Awareness • Circulation • Participation • Coordination
                </div>
              </div>

              <div className="rounded-full border border-red-500/20 bg-red-500/10 px-5 py-2 text-sm text-red-200">
                Presentation expires in 3 days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
