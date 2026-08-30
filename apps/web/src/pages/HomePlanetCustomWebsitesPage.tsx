import { Link } from "react-router-dom";

const traditionalFlow = [
  "Visit",
  "Read",
  "Contact Form",
  "Email",
];

const homePlanetFlow = [
  "Request",
  "Estimate",
  "Approval",
  "Schedule",
  "Work",
  "Payment",
  "Proof",
  "Follow-up",
];

const examples = [
  {
    name: "Performance Powerboats",
    type: "Sales + production system",
    description: "Sales, customer projects, production, updates, and delivery stay connected.",
    image: "/images/performance-powerboats/performance-hero-boat.png",
    href: "/planet/performance-powerboats",
  },
  {
    name: "Electrician System",
    type: "Service-business operating system",
    description: "Requests move through estimates, scheduling, work, payment, proof, and follow-up.",
    image: "/images/homeplanet-electrician-system.png",
    href: "/planet/demo/electrician",
  },
  {
    name: "Okeechobee Together",
    type: "Organization + community system",
    description: "Needs, people, projects, communication, and outcomes stay organized in one place.",
    image: "/images/homeplanet-okeechobee-together-system.png",
    href: "/planet/okeechobee",
  },
];

export default function HomePlanetCustomWebsitesPage() {
  return (
    <main className="min-h-screen bg-[#020504] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <img
          src="/images/homeplanet-hero-earth-glow.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[68%] object-cover object-right opacity-95 lg:block"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#020504] via-[#020504]/90 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-6 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32">
          <header className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300"
              >
                HomePlanet
              </Link>

              <div className="hidden items-center gap-2 sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-30 [animation-duration:2.8s]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                </span>

                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-500">
                  Systems Active
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-400 sm:gap-7">
              <a
                href="#difference"
                className="hidden transition hover:text-white sm:inline"
              >
                Difference
              </a>

              <a
                href="#real-systems"
                className="hidden transition hover:text-white sm:inline"
              >
                Real Systems
              </a>

              <Link
                to="/planet/custom-systems"
                className="transition hover:text-white"
              >
                Start A Project
              </Link>
            </nav>
          </header>

          <div className="max-w-4xl pt-16 sm:pt-20 lg:pt-24">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-emerald-300">
              Looking For A Website?
            </p>

            <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-[5.8rem]">
              Custom Websites
              <br />
              Built Around How
              <br />
              Your Business
              <br />
              <span className="text-emerald-300">Actually Works.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              You may be looking for a website. What you actually need might be
              the working system underneath it.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#difference"
                className="rounded-full bg-emerald-300 px-6 py-3 text-sm font-black text-black transition hover:bg-emerald-200"
              >
                See The Difference
              </a>

              <Link
                to="/planet/custom-systems"
                className="rounded-full border border-white/15 bg-black/20 px-6 py-3 text-sm font-black text-white transition hover:border-white/30"
              >
                Start A Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="difference"
        className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
          The Difference
        </p>

        <h2 className="mt-4 max-w-5xl text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl">
          A website can collect attention.
          <br />
          A system carries the work forward.
        </h2>

        <div className="mt-12 space-y-5">
          <article className="rounded-[28px] border border-white/10 bg-white/[0.018] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[230px_1fr] lg:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
                  01
                </p>

                <h3 className="mt-3 text-2xl font-black text-white">
                  Traditional Website
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
                  The customer reaches the website, reads, and sends a message.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {traditionalFlow.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="rounded-full border border-white/10 bg-black/30 px-5 py-3 text-sm font-bold text-zinc-300">
                      {step}
                    </span>

                    {index < traditionalFlow.length - 1 ? (
                      <span className="text-zinc-700">→</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-white/8 pt-6 text-base leading-7 text-zinc-500">
              Then the real work usually moves somewhere else.
            </div>
          </article>

          <div className="flex items-center gap-4 px-2 py-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent" />

            <span className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300">
              What Happens Next?
            </span>

            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent" />
          </div>

          <article className="relative overflow-hidden rounded-[30px] border border-emerald-300/25 bg-emerald-300/[0.045] p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute right-[-10%] top-[-80%] h-[420px] w-[420px] rounded-full bg-emerald-300/[0.055] blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[230px_1fr] lg:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-300/60">
                  02
                </p>

                <h3 className="mt-3 text-2xl font-black text-emerald-300">
                  HomePlanet System
                </h3>

                <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-400">
                  The customer doorway and the work underneath become one connected story.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {homePlanetFlow.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="rounded-full border border-emerald-300/20 bg-black/30 px-5 py-3 text-sm font-black text-white">
                      {step}
                    </span>

                    {index < homePlanetFlow.length - 1 ? (
                      <span className="text-emerald-300/45">→</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 border-t border-emerald-300/10 pt-6 text-base font-semibold leading-7 text-zinc-300">
              Request, work, money, proof, and follow-up stay connected from beginning to end.
            </div>
          </article>
        </div>
      </section>

      <section
        id="real-systems"
        className="border-y border-white/10 bg-white/[0.015]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
            Real Systems
          </p>

          <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Different businesses. Different workflows.
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">
            The front door can look different because the work underneath is different.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {examples.map((example) => (
              <Link
                key={example.name}
                to={example.href}
                className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#050807] transition hover:border-emerald-300/20"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-black">
                  <img
                    src={example.image}
                    alt={example.name}
                    className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.015]"
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050807] to-transparent" />
                </div>

                <div className="p-6">
                  <div className="mb-4 h-1 w-8 rounded-full bg-emerald-300" />

                  <h3 className="text-xl font-black text-white">
                    {example.name}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-zinc-500">
                    {example.type}
                  </p>

                  <p className="mt-4 min-h-[48px] text-sm leading-6 text-zinc-400">
                    {example.description}
                  </p>

                  <div className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    View System →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 lg:py-32">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
          Start With The Real Workflow
        </p>

        <h2 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">
          Show me what happens now.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          You do not need to design the system first. Show us how the work
          happens today, where it gets messy, and what you are trying to make
          easier.
        </p>

        <Link
          to="/planet/custom-systems"
          className="mt-9 inline-flex rounded-full bg-emerald-300 px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-black"
        >
          Start Your System
        </Link>
      </section>

      <section
        id="homeplanet-question-doorway"
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
                Have A Question?
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] sm:text-3xl">
                Not ready to start a project? That is fine.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                Ask us about HomePlanet, how the systems work, or whether
                something could work for your business or organization.
              </p>
            </div>

            <Link
              to="/contact"
              className="w-fit shrink-0 rounded-full border border-emerald-300/25 bg-emerald-300/[0.05] px-6 py-3 text-sm font-black text-emerald-200 transition hover:border-emerald-300/50 hover:bg-emerald-300/[0.08]"
            >
              Ask A Question
            </Link>
          </div>
        </div>
      </section>
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div>
            <Link
              to="/"
              className="text-sm font-black uppercase tracking-[0.24em] text-white"
            >
              HomePlanet
            </Link>

            <p className="mt-2 text-xs text-zinc-600">
              Systems {"\u2022"} Workflows {"\u2022"} Intelligence
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-zinc-500">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>

            <Link
              to="/planet/custom-systems/examples"
              className="transition hover:text-white"
            >
              Custom Systems
            </Link>

            <a
              href="#real-systems"
              className="transition hover:text-white"
            >
              Real Systems
            </a>

            <Link
              to="/planet/custom-systems"
              className="transition hover:text-white"
            >
              Start A Project
            </Link>

            <Link
              to="/contact"
              className="transition hover:text-white"
            >
              Contact
            </Link>

            <Link
              to="/privacy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>
          </nav>

          <p className="text-xs text-zinc-700">
            {"\u00A9"} 2026 HomePlanet
          </p>
        </div>
      </footer>
    </main>
  );
}