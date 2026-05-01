export default function LocalNetworkDemo() {
  const systems = [
    {
      name: "Only The Essentials Cleaning",
      type: "Cleaning Service",
      status: "Live working board",
      detail: "Customer requests, messages, jobs, payment notes, and daily service visibility.",
      href: "/planet/demo/only-the-essentials",
      accent: "border-pink-300/30 bg-pink-400/10 text-pink-100",
    },
    {
      name: "Taylor Creek Laundry",
      type: "Laundry Service",
      status: "Connected demo board",
      detail: "Wash and fold, pickup and delivery, washing status, ready-for-pickup flow.",
      href: "/planet/demo/laundry",
      accent: "border-cyan-300/30 bg-cyan-400/10 text-cyan-100",
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_85%_12%,rgba(244,114,182,0.10),transparent_28%),#050509] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[34px] border border-white/12 bg-white/5 p-6 sm:p-8">
          <div className="inline-flex rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
            HomePlanet Local Network Demo
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
            Real local systems, connected.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">
            This is not Caitlin&apos;s live board. This is the separate HomePlanet network demo showing how real working business boards can connect without changing the businesses themselves.
          </p>
        </header>

        <section className="mt-6 grid gap-5 md:grid-cols-2">
          {systems.map((system) => (
            <a
              key={system.name}
              href={system.href}
              className="group rounded-[30px] border border-white/12 bg-black/35 p-5 transition hover:-translate-y-1 hover:border-white/25"
            >
              <div className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${system.accent}`}>
                {system.type}
              </div>

              <h2 className="mt-4 text-3xl font-black">{system.name}</h2>

              <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                  Status
                </div>
                <div className="mt-1 text-sm font-bold text-white">{system.status}</div>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/65">{system.detail}</p>

              <div className="mt-5 inline-flex rounded-2xl bg-white/90 px-4 py-3 text-sm font-bold text-black">
                Open System
              </div>
            </a>
          ))}
        </section>

        <section className="mt-6 rounded-[30px] border border-white/12 bg-white/5 p-5">
          <h2 className="text-2xl font-black">What this proves</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
            HomePlanet can run separate local businesses with the same operating structure, while giving each one its own identity. The network layer connects them without turning any customer&apos;s real board into a test page.
          </p>
        </section>
      </div>
      <footer className="mt-8 text-center text-xs text-white/40">
    HomePlanet © 2026 — real systems, live truth.
  </footer>
</main>
  );
}

