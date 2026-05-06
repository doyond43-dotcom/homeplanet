export default function CaptainDChartersPage() {
  const catches = [
    {
      title: "Big Bass Memory",
      detail: "A real Lake Okeechobee trip moment customers will remember and share.",
      image: "/images/captain-d-big-bass-memory.jpg",
    },
    {
      title: "Kids First Catch",
      detail: "The kind of moment families talk about long after the trip is over.",
      image: "/images/captain-d-kids-first-catch.jpg",
    },
    {
      title: "Tournament Guide Experience",
      detail: "Local fishing knowledge, real catches, and proven time on the water.",
      image: "/images/captain-d-tournament-win.jpg",
    },
  ];

  const updates = [
    "Water clarity: Good",
    "Morning bite active",
    "Wind: Light",
    "Trips running on time",
  ];

  return (
    <main className="min-h-screen bg-[#071019] text-white">
      <section className="relative overflow-hidden border-b border-cyan-400/20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('/images/captain-d-double-bass.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-[#071019]/80 to-[#071019]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-24">
          <div className="inline-flex w-fit rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
            LIVE FISHING EXPERIENCE
          </div>

          <div className="max-w-3xl">
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Captain D Charters
            </h1>

            <p className="mt-6 text-lg leading-8 text-cyan-50/80 md:text-xl">
              Guided fishing trips, pontoon experiences, live catch updates, unforgettable memories, and shareable trip moments without giving away private fishing spots.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="/planet/demo/captain-d-live"
              className="rounded-full bg-cyan-300 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.02]"
            >
              Open Live Trip
            </a>

            <a
              href="/planet/demo/captain-d-memory"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            >
              View Trip Memories
            </a>

            <a
              href="/planet/demo/captain-d-privacy"
              className="rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10"
            >
              Privacy Controls
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-4">
          {updates.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-5"
            >
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">
                WATER UPDATE
              </div>

              <div className="mt-3 text-lg font-bold text-white">{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[#0c1824]">
          <div
            className="min-h-[420px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/images/captain-d-double-bass.jpg')",
            }}
          />

          <div className="grid gap-6 p-8 md:grid-cols-[1fr_0.7fr] md:items-center">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
                FEATURED CATCH
              </div>

              <h2 className="mt-2 text-4xl font-black tracking-tight">
                Real Trips. Real Catches. Real Memories.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
                Every charter can become more than a booking. It can become a live trip timeline, a customer memory page, and a shareable catch gallery while keeping exact fishing spots private.
              </p>
            </div>

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">
                TRIP EXPERIENCE SYSTEM
              </div>

              <div className="mt-4 space-y-3 text-sm font-bold text-white">
                <div>? Morning check-in</div>
                <div>? Weather + water updates</div>
                <div>? Live catch photos</div>
                <div>? Trip completed timeline</div>
                <div>? Instant review + share page</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
              RECENT EXPERIENCES
            </div>

            <h2 className="mt-2 text-4xl font-black tracking-tight">
              Moments Worth Remembering
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {catches.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0c1824]"
            >
              <div
                className="h-72 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              />

              <div className="p-6">
                <h3 className="text-2xl font-black">{item.title}</h3>

                <p className="mt-3 text-sm leading-7 text-white/70">
                  {item.detail}
                </p>

                <a
                  href="/planet/demo/captain-d-memory"
                  className="mt-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100"
                >
                  Open Trip Memory
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[0.8fr_1fr] md:items-center">
          <div
            className="min-h-[320px] rounded-[28px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/images/lazy-lunker-vacation-homes.jpg')",
            }}
          />

          <div className="p-2 md:p-6">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
              STAY + FISH CONNECTION
            </div>

            <h2 className="mt-2 text-4xl font-black tracking-tight">
              Turn a trip into the whole Lake Okeechobee experience.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Vacation homes, bait delivery, concierge help, fishing trips, live updates,
              memories, and reviews can all connect into one simple customer experience.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


