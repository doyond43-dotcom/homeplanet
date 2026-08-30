import { Link } from "react-router-dom";

const systemWorlds = [
  {
    number: "01",
    label: "Home Services",
    title: "Pest Control System",
    text: "Customer request, estimate, scheduling, service, payment, proof, and follow-up.",
  },
  {
    number: "02",
    label: "Shop Operations",
    title: "Mechanic Shop System",
    text: "Customer, vehicle, diagnosis, approval, parts, repair, payment, and completion.",
  },
  {
    number: "03",
    label: "Nonprofit + Community",
    title: "Okeechobee Together",
    text: "Needs, people, resources, funding, work, receipts, proof, and outcomes.",
  },
];

export default function HomePlanetCustomSystemsExamplesPage() {
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
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  Systems Active
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[0.16em] text-zinc-400 sm:gap-7">
              <a
                href="#system-worlds"
                className="hidden transition hover:text-white sm:inline"
              >
                Examples
              </a>

              <Link
                to="/planet/custom-websites"
                className="hidden transition hover:text-white sm:inline"
              >
                Custom Websites
              </Link>

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
              Custom Systems
            </p>

            <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-[5.8rem]">
              Different Work.
              <br />
              <span className="text-emerald-300">Different System.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              HomePlanet does not force every business or organization into the
              same software. The system changes because the work changes.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#system-worlds"
                className="rounded-full bg-emerald-300 px-6 py-3 text-sm font-black text-black transition hover:bg-emerald-200"
              >
                See The Systems
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

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
          Three Different Worlds
        </p>

        <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          Same architecture. Completely different workflow.
        </h2>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {systemWorlds.map((world) => (
            <article
              key={world.number}
              className="rounded-[28px] border border-white/10 bg-white/[0.02] p-7"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-300/60">
                {world.number} · {world.label}
              </p>

              <h3 className="mt-5 text-2xl font-black text-white">
                {world.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-zinc-400">
                {world.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="max-w-3xl text-2xl font-black leading-9 text-white sm:text-3xl">
            Your business will not look exactly like any of these.
            <span className="text-emerald-300"> That is the point.</span>
          </p>
        </div>
      </section>
      <section
        id="home-services-proof"
        className="border-t border-white/10 bg-white/[0.012]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
              01 · Home Services
            </p>

            <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl">
              The website does not stop at the form.
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-400">
              A customer request from the public page becomes active work.
              The same record can carry follow-up, scheduling, payment, proof,
              and review instead of disappearing into texts, email, or paper.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            {[
              "Customer Request",
              "Follow-Up",
              "Schedule",
              "Service",
              "Payment",
              "Proof",
              "Review",
            ].map((step, index, steps) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.04] px-4 py-2 text-xs font-black text-white">
                  {step}
                </span>

                {index < steps.length - 1 ? (
                  <span className="text-emerald-300/35">→</span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-[30px] border border-white/10 bg-[#030807] shadow-[0_0_80px_rgba(31,111,190,0.08)]">
            <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-emerald-300">
                  Live System Preview
                </p>

                <p className="mt-1 text-sm font-bold text-zinc-300">
                  Pest Control Operator Board
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/planet/demo/pest-control"
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-zinc-300 transition hover:border-white/25 hover:text-white"
                >
                  View Customer Page
                </Link>

                <Link
                  to="/planet/demo/pest-control/board"
                  className="rounded-full bg-emerald-300 px-4 py-2 text-xs font-black text-black transition hover:bg-emerald-200"
                >
                  Open Full System
                </Link>
              </div>
            </div>

            <div className="relative h-[700px] bg-[#020706] sm:h-[760px] lg:h-[820px]">
              <iframe
                src="/planet/demo/pest-control/board"
                title="Live Pest Control HomePlanet system"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
          
          <p className="mt-8 max-w-3xl text-xl font-black leading-8 text-white sm:text-2xl">
            The public page is the doorway.
            <span className="text-emerald-300">
              {" "}The working system is what happens after the click.
            </span>
          </p>
        </div>
      </section>
      <section
        id="shop-operations-proof"
        className="border-t border-white/10 bg-[#040403]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-orange-300">
              02 · Shop Operations
            </p>

            <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl">
              One vehicle becomes one complete job record.
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-400">
              A repair shop needs more than incoming requests. The customer,
              vehicle, diagnosis, approvals, parts, repair progress, payment,
              proof, and completion all need to stay connected.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            {[
              "Check-In",
              "Diagnose",
              "Estimate",
              "Approval",
              "Parts",
              "Repair",
              "Payment",
              "Proof",
              "Complete",
            ].map((step, index, steps) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-orange-300/20 bg-orange-300/[0.05] px-4 py-2 text-xs font-black text-white">
                  {step}
                </span>

                {index < steps.length - 1 ? (
                  <span className="text-orange-300/40">→</span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-[30px] border border-orange-300/15 bg-[#080705] shadow-[0_0_90px_rgba(251,146,60,0.06)]">
            <div className="flex flex-col gap-4 border-b border-orange-300/10 bg-orange-300/[0.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-orange-300">
                  Live System Preview
                </p>

                <p className="mt-1 text-sm font-bold text-zinc-300">
                  Wrench Boys Shop Operating System
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/planet/wrench-boys"
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-zinc-300 transition hover:border-white/25 hover:text-white"
                >
                  View Customer Page
                </Link>

                <Link
                  to="/planet/wrench-boys/staff"
                  className="rounded-full border border-orange-300/20 px-4 py-2 text-xs font-black text-orange-200 transition hover:border-orange-300/45 hover:text-orange-100"
                >
                  Technician Board
                </Link>

                <Link
                  to="/planet/wrench-boys/owner"
                  className="rounded-full bg-orange-300 px-4 py-2 text-xs font-black text-black transition hover:bg-orange-200"
                >
                  Owner Board
                </Link>
              </div>
            </div>

            <div className="relative h-[760px] bg-[#050403] sm:h-[820px] lg:h-[880px]">
              <iframe
                src="/planet/wrench-boys/owner"
                title="Wrench Boys HomePlanet owner board"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <p className="mt-8 max-w-4xl text-xl font-black leading-8 text-white sm:text-2xl">
            The owner sees the whole shop.
            <span className="text-orange-300">
              {" "}The technician sees the work. Both are working from the same vehicle record.
            </span>
          </p>
        </div>
      </section>
      <section
        id="community-operations-proof"
        className="border-t border-white/10 bg-[#030604]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
              03 · Community Operations
            </p>

            <h2 className="mt-4 text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-6xl">
              A community need becomes an organized response.
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-400">
              Someone shares a need. It gets reviewed, made active, connected
              with helpers and resources, and followed through to a visible
              outcome. Support can stay attached to the work it was meant to
              accomplish instead of disappearing into a general pool.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2">
            {[
              "Need",
              "Review",
              "Helpers / Resources",
              "Active Project",
              "Work",
              "Support",
              "Proof",
              "Outcome",
            ].map((step, index, steps) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.04] px-4 py-2 text-xs font-black text-white">
                  {step}
                </span>

                {index < steps.length - 1 ? (
                  <span className="text-emerald-300/35">→</span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-[30px] border border-emerald-300/15 bg-[#030806] shadow-[0_0_90px_rgba(110,231,183,0.06)]">
            <div className="flex flex-col gap-4 border-b border-emerald-300/10 bg-emerald-300/[0.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-emerald-300">
                  Live System Preview
                </p>

                <p className="mt-1 text-sm font-bold text-zinc-300">
                  Okeechobee Together Community Operations
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/planet/okeechobee"
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-zinc-300 transition hover:border-white/25 hover:text-white"
                >
                  View Public Community Page
                </Link>

                <Link
                  to="/planet/okeechobee/operations-preview"
                  className="rounded-full bg-emerald-300 px-4 py-2 text-xs font-black text-black transition hover:bg-emerald-200"
                >
                  Open Community System
                </Link>
              </div>
            </div>

            <div className="relative h-[900px] bg-[#030806] sm:h-[980px] lg:h-[1120px]">
              <iframe
                src="/planet/okeechobee/operations-preview"
                title="Okeechobee Together HomePlanet community operations preview"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          <p className="mt-8 max-w-5xl text-xl font-black leading-8 text-white sm:text-2xl">
            A business can organize customers and jobs.
            <span className="text-emerald-300">
              {" "}A community can organize people and needs.
            </span>
            {" "}The principle is the same: keep the entire story connected.
          </p>
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
              href="#system-worlds"
              className="transition hover:text-white"
            >
              Examples
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