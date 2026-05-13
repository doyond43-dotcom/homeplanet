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
    {
      title: "Sunset Pontoon Cruise",
      detail: "A slower family-friendly lake experience built for sunsets, photos, birthdays, and relaxing time on the water.",
      image: "/images/captain-d-double-bass.jpg",
    },
  ];

  const updates = [
    "Water clarity: Good",
    "Morning bite active",
    "Pontoon family trips available",
    "Trips running on time",
  ];

  const liveMemories = [
    {
      title: "Big Bass Morning",
      meta: "Shared trip memory",
      detail: "Catch photos, trip recap, private spot protection, and a live memory link for the family.",
    },
    {
      title: "Family Pontoon Sunset",
      meta: "Pontoon experience",
      detail: "Guests can scan, upload their favorite sunset photos, and keep the lake day connected after the ride.",
    },
    {
      title: "Lake House Weekend",
      meta: "Stay + water experience",
      detail: "Vacation stays can connect into charters, pontoon days, guest uploads, and future booking links.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#071019] text-white">
      <section className="relative overflow-hidden border-b border-cyan-400/20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: "url('/images/captain-d-double-bass.jpg')",
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
              href="/planet/demo/captain-d-booking"
              className="rounded-full bg-cyan-300 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.02]"
            >
              Book Your Charter
            </a>

            <a
              href="/planet/demo/captain-d-memory"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            >
              View Trip Memories
            </a>

            <a
              href="#guest-upload"
              className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-emerald-100 transition hover:bg-emerald-400/15"
            >
              Upload Lake Memories
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
                LIVE UPDATE
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
              backgroundImage: "url('/images/captain-d-double-bass.jpg')",
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
                <div>? Guest photo uploads</div>
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

        <div className="grid gap-6 md:grid-cols-4">
          {catches.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0c1824]"
            >
              <div
                className="h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${item.image})`,
                }}
              />

              <div className="p-6">
                <h3 className="text-2xl font-black">{item.title}</h3>

                <p className="mt-3 text-sm leading-7 text-white/70">
                  {item.detail}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href="/planet/demo/captain-d-memory"
                    className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100"
                  >
                    Open Memory
                  </a>

                  <a
                    href="/planet/demo/captain-d-booking"
                    className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-100"
                  >
                    Book This
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="guest-upload" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 rounded-[34px] border border-emerald-400/20 bg-emerald-400/10 p-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="rounded-[28px] border border-white/10 bg-[#071019] p-6">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100/60">
              GUEST MEMORY UPLOAD
            </div>

            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Upload your lake memories.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/70">
              Guests can scan a QR code or open a trip link from their phone, upload favorite photos, and keep their charter, pontoon ride, or vacation stay connected to one private memory page.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/planet/demo/captain-d-memory"
                className="rounded-full bg-emerald-300 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#071019]"
              >
                Open Memory Page
              </a>

              <a
                href="/planet/demo/captain-d-privacy"
                className="rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white"
              >
                Public / Private Controls
              </a>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {["Scan QR", "Upload Photos", "Choose Public or Private"].map((step) => (
              <div
                key={step}
                className="rounded-3xl border border-white/10 bg-[#071019]/80 p-5"
              >
                <div className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100/50">
                  SIMPLE FLOW
                </div>
                <div className="mt-3 text-xl font-black">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
            LIVE GUEST MOMENTS
          </div>

          <h2 className="mt-2 text-4xl font-black tracking-tight">
            Recent Lake Memories
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
            Not fake reviews. Real experiences, shared memories, and guest-approved moments from the water, pontoon rides, and lake stays.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {liveMemories.map((item) => (
            <article
              key={item.title}
              className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/45">
                {item.meta}
              </div>

              <h3 className="mt-3 text-2xl font-black">{item.title}</h3>

              <p className="mt-3 text-sm leading-7 text-white/68">
                {item.detail}
              </p>

              <a
                href="/planet/demo/captain-d-memory"
                className="mt-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100"
              >
                View Moment
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 rounded-[34px] border border-cyan-400/20 bg-[#0c1824] p-6 md:grid-cols-[0.75fr_1.25fr] md:items-center">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
              MEET THE CAPTAIN
            </div>

            <h2 className="mt-2 text-4xl font-black tracking-tight">
              Local water. Real trips. Memories protected.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/70">
              Captain D Charters is built around more than putting people on fish. Every trip can become a private memory page, a family share link, and a way to relive the day without exposing private fishing spots.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {["Book", "Fish", "Upload", "Share"].map((step) => (
              <div
                key={step}
                className="rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-5 text-center"
              >
                <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/45">
                  Guest Flow
                </div>
                <div className="mt-3 text-2xl font-black">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[0.8fr_1fr] md:items-center">
          <div
            className="min-h-[320px] rounded-[28px] bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/lazy-lunker-vacation-homes.jpg')",
            }}
          />

          <div className="p-2 md:p-6">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
              STAY + FISH + PONTOON CONNECTION
            </div>

            <h2 className="mt-2 text-4xl font-black tracking-tight">
              Turn a trip into the whole Lake Okeechobee experience.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Vacation homes, pontoon cruises, bait delivery, concierge help, fishing trips, live updates, guest uploads, memories, and reviews can all connect into one simple customer experience.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/planet/demo/lazy-lunker"
                className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-100"
              >
                View Vacation Stay
              </a>

              <a
                href="/planet/demo/captain-d-booking"
                className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-emerald-100"
              >
                Plan Fishing + Pontoon
              </a>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
              CAPTAIN D CHARTERS
            </div>
            <h2 className="mt-2 text-3xl font-black">Lake Okeechobee Experiences</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
              Fishing charters, pontoon trips, guest memories, and connected lake experiences built to feel alive before, during, and after the trip.
            </p>
          </div>

          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
              Quick Links
            </div>
            <div className="mt-4 grid gap-3 text-sm font-bold text-white/70">
              <a href="/planet/demo/captain-d-booking" className="hover:text-cyan-100">Book Charter</a>
              <a href="/planet/demo/captain-d-memory" className="hover:text-cyan-100">Trip Memories</a>
              <a href="#guest-upload" className="hover:text-cyan-100">Upload Memories</a>
              <a href="/planet/demo/lazy-lunker" className="hover:text-cyan-100">Vacation Stay</a>
            </div>
          </div>

          <div>
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
              Contact
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href="tel:8635320683" className="rounded-full bg-cyan-300 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#071019]">
                Call
              </a>
              <a href="sms:8635320683" className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white">
                Text
              </a>
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
              Built on HomePlanet Live
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

