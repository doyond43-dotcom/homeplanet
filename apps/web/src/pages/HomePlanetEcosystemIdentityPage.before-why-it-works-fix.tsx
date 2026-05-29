export default function HomePlanetEcosystemIdentityPage() {
  const anchors = [
    ["GreenBasket", "Daily Life Anchor", "Essentials, coffee, pickup, delivery, workforce support, and community circulation."],
    ["WingIt", "Social Anchor", "Food, gathering, events, families, sports nights, and community energy."],
    ["Delaney's Gym", "Wellness Anchor", "Fitness, recovery, workforce wellness, classes, and participation."],
    ["Garrett's Laundromat", "Infrastructure Anchor", "Laundry, towels, restaurant linens, pickup, delivery, and operational support."],
    ["Commons Coffee", "Gathering Anchor", "Morning flow, remote work, late-night coffee, conversation, and connection."],
    ["The Hub", "Coordination Layer", "The nervous system that keeps circulation, logistics, maintenance, workforce, and transportation moving."],
  ];

  return (
    <main className="min-h-screen bg-[#0b0b08] text-stone-100">
      <section className="relative overflow-hidden px-6 py-20 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#3f3a22_0%,transparent_38%),linear-gradient(180deg,#111009_0%,#0b0b08_60%,#050504_100%)]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300/80">
            HomePlanet Ecosystem
          </p>

          <h1 className="max-w-5xl text-5xl font-semibold tracking-tight sm:text-7xl">
            Designed around circulation.
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-8 text-stone-300">
            Most developments are designed around buildings. HomePlanet is designed
            around how life actually moves — daily needs, social energy, wellness,
            infrastructure, gathering, coordination, and reduced friction.
          </p>

          <div className="mt-12 rounded-[2rem] border border-stone-700/70 bg-stone-950/70 p-5 shadow-2xl">
            <div className="grid gap-4 lg:grid-cols-3">
              {anchors.map(([name, role, description]) => (
                <div
                  key={name}
                  className="rounded-[1.5rem] border border-stone-700/70 bg-[#17150f] p-6"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-300/70">
                    {role}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    {name}
                  </h2>
                  <p className="mt-4 leading-7 text-stone-300">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-stone-700/70 bg-[#15130d] p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300/70">
                Investor Feeling
              </p>
              <h2 className="mt-4 text-4xl font-semibold">
                Not a collection of businesses. A living place.
              </h2>
              <p className="mt-6 text-lg leading-8 text-stone-300">
                GreenBasket wakes the ecosystem up. WingIt gives it social energy.
                Delaney&apos;s keeps people active. Garrett&apos;s keeps the invisible
                infrastructure moving. Commons Coffee creates the in-between gathering
                space. The Hub quietly coordinates the whole thing.
              </p>
            </div>

            <div className="rounded-[2rem] border border-amber-400/30 bg-amber-300/10 p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-200">
                Core Message
              </p>
              <h2 className="mt-4 text-4xl font-semibold text-white">
                The city that never sleeps.
              </h2>
              <p className="mt-6 text-lg leading-8 text-stone-200">
                Not Vegas. Not New York. A calm ecosystem that never stops flowing.
                People moving. Services connecting. Work getting done. Life feeling
                easier because the place was designed around participation.
              </p>
            </div>
          </div>

          <section className="mt-20 rounded-[2rem] border border-stone-700/70 bg-stone-950/80 p-8">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-300/70">
              The Difference
            </p>
            <h2 className="mt-5 max-w-4xl text-4xl font-semibold sm:text-5xl">
              Most developments are designed around buildings.
              HomePlanet is designed around circulation.
            </h2>
            <div className="mt-8 grid gap-4 text-stone-300 sm:grid-cols-5">
              {["Daily life", "Wellness", "Community", "Infrastructure", "Coordination"].map((item) => (
                <div key={item} className="rounded-2xl border border-stone-700/70 bg-[#17150f] px-4 py-5 text-center text-sm uppercase tracking-[0.18em] text-stone-200">
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-stone-300">
              These are not separate amenities. They are connected anchors working
              together as one ecosystem.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

