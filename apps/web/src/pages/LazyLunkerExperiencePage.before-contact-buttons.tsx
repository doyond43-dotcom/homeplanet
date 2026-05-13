const packages = [
  {
    title: "Weekend Escape",
    description:
      "A relaxing Lake Okeechobee stay with room to unwind, grill, fish, and enjoy the whole weekend.",
    image: "/images/lazy-lunker-tiki-deck.jpg",
  },
  {
    title: "Stay + Fish Package",
    description:
      "A connected experience that can combine vacation stay details with guided fishing trip planning.",
    image: "/images/lazy-lunker-vacation-homes.jpg",
  },
  {
    title: "Family Lake Getaway",
    description:
      "Simple planning for families who want the house, the fishing, the memories, and the local experience in one place.",
    image: "/images/lazy-lunker-living-room.jpg",
  },
];

export default function LazyLunkerExperiencePage() {
  return (
    <main className="min-h-screen bg-[#071019] text-white">
      <section
        className="relative overflow-hidden border-b border-cyan-400/20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(7,16,25,0.55), rgba(7,16,25,0.92)), url('/images/lazy-lunker-tiki-deck.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
            LAKE OKEECHOBEE STAY EXPERIENCE
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Stay. Fish. Relax. Remember.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75 md:text-xl">
            Vacation stays, guided fishing, local recommendations, trip planning, and shareable memories connected into one simple Lake Okeechobee experience.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/planet/demo/lazy-lunker-booking"
              className="rounded-full bg-cyan-300 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.02]"
            >
              Plan Your Stay
            </a>

            <a
              href="/planet/demo/lazy-lunker-fishing"
              className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-400/20"
            >
              Add Fishing To My Stay
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-4">
          {["Stay request", "Fishing add-on", "Call unlocked after info", "Memory-ready experience"].map((item) => (
            <div key={item} className="rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-5">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">
                EXPERIENCE FLOW
              </div>
              <div className="mt-3 text-lg font-bold text-white">{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[#0c1824]">
          <div
            className="min-h-[430px] bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/lazy-lunker-vacation-homes.jpg')",
            }}
          />

          <div className="grid gap-6 p-8 md:grid-cols-[1fr_0.7fr] md:items-center">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
                CONNECTED PACKAGE SYSTEM
              </div>

              <h2 className="mt-2 text-4xl font-black tracking-tight">
                Not just a rental. A full Lake Okeechobee experience.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
                Customers can request a stay, add a fishing charter, share what kind of trip they want, and then unlock a planning call after the important details are captured first.
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">
                WHY IT WORKS
              </div>

              <div className="mt-4 space-y-3 text-sm font-bold text-white">
                <div>? Basic info captured first</div>
                <div>? Stay + charter requests stay organized</div>
                <div>? Package interest is clear</div>
                <div>? Planning call happens after details</div>
                <div>? Memories and reviews can follow the trip</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
            EXPERIENCE PACKAGES
          </div>

          <h2 className="mt-2 text-4xl font-black tracking-tight">
            Built for stays, fishing, families, and return guests.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0c1824]">
              <div
                className="h-72 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="p-6">
                <h3 className="text-2xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{item.description}</p>
                <a
                  href="/planet/demo/lazy-lunker-booking"
                  className="mt-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100"
                >
                  Start Request
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}


