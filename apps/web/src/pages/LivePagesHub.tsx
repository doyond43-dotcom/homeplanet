export default function LivePagesHub() {
  const flow = ["Customer", "Intake", "Owner", "Staff", "Crew", "Payment", "Proof"]

  const systems = [
    { title: "Home Services", line: "The business keeps moving.", items: ["Requests", "Scheduling", "Dispatch", "Crew Work", "Payments", "Proof"], link: "/planet/live-pages/home-services" },
    { title: "Food & Restaurants", line: "The kitchen keeps moving.", items: ["Tables", "Kitchen", "Staff", "Orders", "Payments", "Experience"], link: "/planet/brahma-bull" },
    { title: "Transportation", line: "The route keeps moving.", items: ["Ride Requests", "Dispatch", "Drivers", "Routes", "Payments"], link: "/planet/transportation" },
    { title: "Community Board", line: "The community keeps moving.", items: ["Needs", "Projects", "Volunteers", "Workforce", "Support"], link: "/planet/okeechobee" },
    { title: "Auto Repair", line: "The repair keeps moving.", items: ["Approvals", "Updates", "Payments", "Proof", "Delivery"], link: "/planet/auto-repair" },
    { title: "Pet & Guardian", line: "Protection keeps moving.", items: ["Profiles", "Alerts", "Sightings", "Safety", "History"], link: "/planet/guardian" },
    { title: "Retail & Local Shops", line: "Orders keep moving.", items: ["Orders", "Pickup", "Inventory", "Customer Updates"], link: "/planet/printshop" },
    { title: "Experiences & Events", line: "The experience keeps moving.", items: ["Tours", "Charters", "Guest Moments", "Memory Pages"], link: "/planet/demo/lake-experience-preview" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-green-950 to-black px-5 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">
            HomePlanet Live Pages
          </p>

          <h1 className="mt-4 text-6xl font-black leading-[0.9] md:text-8xl">
            WEBSITES SIT THERE.
            <br />
            LIVE PAGES WORK.
          </h1>

          <p className="mt-5 text-base leading-relaxed text-zinc-300 md:text-lg">
            A website shows information. A Live Page keeps customers, staff,
            payments, and operations moving.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-green-400/20 bg-zinc-950/80 p-5 shadow-2xl shadow-green-500/10">
          <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.25em] text-green-300">
            How A Live Page Moves
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {flow.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-zinc-800 bg-black/40 px-3 py-3 text-center min-w-[110px]"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  {step}
                </p>

                {index < flow.length - 1 && (
                  <span className="text-green-400 text-xl font-bold">→</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-500/10 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-300">
              Movement Layer
            </p>

            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              Information stops at a website. Operations continue through a Live Page.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
            Live Systems
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {systems.map((system) => (
              <a
                key={system.title}
                href={system.link}
                className="block rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 transition hover:border-green-400/40 hover:bg-green-500/10"
              >
                <p className="text-2xl font-black uppercase">{system.title}</p>
                <p className="mt-2 text-sm font-semibold text-green-300">
                  {system.line}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {system.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-zinc-700 bg-black/40 px-3 py-1 text-xs font-semibold text-zinc-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-zinc-800 bg-black/30 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-green-300">
                    Live Preview
                  </p>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Activity</span>
                      <span className="font-semibold text-white">New Request</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Status</span>
                      <span className="font-semibold text-green-400">In Motion</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Awareness</span>
                      <span className="font-semibold text-white">Live</span>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm font-bold text-green-300">
                  View Live Example →
                </p>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-red-400/30 bg-red-500/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-300">
            Why It Matters
          </p>

          <p className="mt-4 text-base leading-relaxed text-zinc-100">
            Most businesses operate through disconnected tools: websites, forms,
            calls, texts, payments, and scheduling. Live Pages connect customer
            movement, operational awareness, and real-world work into one
            connected system.
          </p>

          <p className="mt-6 text-2xl font-black leading-tight">
            One architecture.
            <br />
            Many industries.
          </p>
        </div>

        <p className="mt-10 text-center text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
          Powered by HomePlanet
        </p>
      </section>
    </main>
  )
}







