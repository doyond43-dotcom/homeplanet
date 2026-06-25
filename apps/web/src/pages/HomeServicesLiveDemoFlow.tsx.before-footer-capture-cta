import { Link } from "react-router-dom";

const problems = [
  { label: "HOUSE WASH", service: "House Wash" },
  { label: "DRIVEWAY", service: "Driveway Cleaning" },
  { label: "ROOF SOFTWASH", service: "Roof Softwash" },
  { label: "POOL CAGE", service: "Pool Cage" },
  { label: "GUTTERS", service: "Gutters" },
  { label: "OTHER", service: "Other" },
];

const flowCards = [
  {
    title: "1. Customer clicks",
    text: "They land on a real branded page and tap what they need.",
    to: "/planet/home-services/request",
    label: "Open Customer Request",
  },
  {
    title: "2. Request hits the board",
    text: "The business sees the new lead instead of digging through texts.",
    to: "/planet/home-services/leads",
    label: "Open Workboard",
  },
  {
    title: "3. Crew works the job",
    text: "Estimate, photos, payment, notes, and job status stay connected.",
    to: "/planet/job-workspace-v3",
    label: "Open Staff Board",
  },
];

export default function HomeServicesLiveDemoFlow() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* LIVE LANDING PAGE */}
      <section
        className="relative min-h-[455px] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,.74), rgba(0,0,0,.22), rgba(0,0,0,.66)), url('/images/a_dramatic_cinematic_ultra_realistic_sunset_scen_1.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/72" />

        <div className="relative mx-auto flex min-h-[455px] max-w-6xl flex-col items-center justify-center px-4 py-8 text-center">
          <h1 className="text-5xl font-black tracking-[0.02em] text-white sm:text-6xl lg:text-7xl">
            RIDGELINE
          </h1>

          <p className="mt-1 text-lg font-black uppercase tracking-wide text-orange-500 sm:text-xl">
            Pro Wash
          </p>

          <div className="mt-3 h-[2px] w-72 max-w-full bg-white/70" />

          <h2 className="mt-5 text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
            Keeping Okeechobee Clean
          </h2>

          <p className="mt-3 max-w-2xl text-xs font-semibold text-white/70 sm:text-sm">
            House washing • Driveways • Roof softwash • Pool cages • Gutters • Property cleanup
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/planet/home-services/request?service=House%20Wash"
              className="rounded-xl bg-orange-500 px-7 py-3 text-xs font-black uppercase text-black shadow-[0_0_30px_rgba(249,115,22,.38)] hover:bg-orange-400"
            >
              Get Estimate
            </Link>

            <a
              href="#after-click"
              className="rounded-xl border border-white/45 bg-black/40 px-7 py-3 text-xs font-black uppercase text-white hover:bg-white/10"
            >
              After The Click
            </a>
            <a
              href="#business-intelligence"
              className="rounded-xl border border-orange-500/70 bg-orange-500/15 px-7 py-3 text-xs font-black uppercase text-orange-100 hover:bg-orange-500 hover:text-black"
            >
              Business Intelligence
            </a>

          </div>
        </div>
      </section>

      {/* PROBLEM BUTTONS */}
      <section className="bg-black px-4 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
            What&apos;s Going On?
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <Link
                key={problem.label}
                to={`/planet/home-services/request?service=${encodeURIComponent(problem.service)}`}
                className="rounded-2xl border border-white/10 bg-[#1b1b1d] px-6 py-7 text-base font-black uppercase text-white shadow-[0_18px_40px_rgba(0,0,0,.35)] transition hover:border-orange-500/70 hover:bg-orange-500 hover:text-black"
              >
                {problem.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="border-y border-white/10 bg-[#0b0b0d] px-4 py-14 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
            A Live Page Is Just The Start
          </h2>
          <p className="mt-6 text-lg font-semibold leading-relaxed text-white/70">
            This is what HomePlanet builds: the public page, the request flow, the business board,
            and the crew workspace all connected in one clean system.
          </p>
        </div>
      </section>

      {/* AFTER THE CLICK */}
      <section id="after-click" className="bg-black px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-orange-500">
              HomePlanet System Demo
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-5xl">
              What Happens After The Click?
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold text-white/65">
              Most websites stop at the form. This demo shows the work system underneath:
              request, lead, estimate, job, crew, photos, payment, and proof.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {flowCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-white/10 bg-[#141416] p-6 shadow-[0_20px_60px_rgba(0,0,0,.45)]"
              >
                <h3 className="text-2xl font-black uppercase">{card.title}</h3>
                <p className="mt-4 min-h-[72px] text-base font-semibold leading-relaxed text-white/65">
                  {card.text}
                </p>
                <Link
                  to={card.to}
                  className="mt-6 block rounded-2xl bg-orange-500 px-5 py-4 text-center text-sm font-black uppercase text-black hover:bg-orange-400"
                >
                  {card.label}
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[2rem] border border-orange-500/40 bg-orange-500/12 p-6 text-center">
            <h3 className="text-2xl font-black uppercase text-white">
              The demo path
            </h3>
            <p className="mt-3 text-base font-bold text-white/70">
              Live Landing Page → Customer Request → New Requests Board → Estimate Builder → Staff Job Workspace
            </p>
          </div>
        </div>
      </section>


      {/* BUSINESS INTELLIGENCE */}
      <section id="business-intelligence" className="border-y border-orange-500/20 bg-[#050505] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-9 flex flex-col gap-3 text-center">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-orange-500">
              Business Intelligence
            </p>
            <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
              Every click starts telling the business what to do next.
            </h2>
            <p className="mx-auto max-w-3xl text-lg font-semibold leading-relaxed text-white/65">
              The live page is not just taking requests. It shows what customers want,
              who is coming back, what is open, and where the next move is.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(18,18,20,.90),rgba(5,5,5,.86))] p-5 shadow-[0_28px_80px_rgba(0,0,0,.50)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
                    Customer Intelligence
                  </p>
                  <h3 className="mt-2 text-3xl font-black uppercase">Active Customer Signals</h3>
                </div>
                <div className="rounded-2xl border border-orange-500/35 bg-orange-500/10 px-4 py-3 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">
                    Today
                  </p>
                  <p className="text-2xl font-black">4 New</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  {
                    name: "Maria Jenkins",
                    signal: "Repeat customer • 3 jobs this year • $950 value",
                    move: "Next move: send payment link after driveway is complete",
                    tag: "Scheduled",
                  },
                  {
                    name: "Robert Hale",
                    signal: "Roof softwash clicked twice • estimate still open",
                    move: "Next move: follow up before Friday",
                    tag: "Follow Up",
                  },
                  {
                    name: "Amanda Cruz",
                    signal: "Driveway cleaning clicked • did not submit form",
                    move: "Next move: show driveway before/after proof higher",
                    tag: "Hot Click",
                  },
                ].map((customer) => (
                  <div
                    key={customer.name}
                    className="rounded-3xl border border-white/10 bg-black/70 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="text-xl font-black">{customer.name}</h4>
                        <p className="mt-1 text-sm font-bold text-white/55">{customer.signal}</p>
                        <p className="mt-2 text-sm font-black text-orange-300">{customer.move}</p>
                      </div>
                      <span className="w-fit rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase text-black">
                        {customer.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(18,18,20,.90),rgba(5,5,5,.86))] p-5 shadow-[0_28px_80px_rgba(0,0,0,.50)] backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
                  What Customers Clicked
                </p>

                <div className="mt-5 grid gap-4">
                  {[
                    ["Driveway Cleaning", "42 clicks", "84%"],
                    ["House Wash", "31 clicks", "62%"],
                    ["Roof Softwash", "18 clicks", "36%"],
                    ["Pool Cage", "11 clicks", "22%"],
                    ["Gutters", "8 clicks", "16%"],
                  ].map(([label, clicks, width]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-sm font-black">
                        <span>{label}</span>
                        <span className="text-orange-300">{clicks}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-orange-500 shadow-[0_0_22px_rgba(249,115,22,.35)]"
                          style={{ width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-orange-500/35 bg-[linear-gradient(145deg,rgba(249,115,22,.16),rgba(5,5,5,.90))] p-5 shadow-[0_28px_80px_rgba(0,0,0,.50)] backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-300">
                  Live Suggestions
                </p>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-black/70 p-4">
                    <p className="text-lg font-black">Driveway Cleaning is hot this week.</p>
                    <p className="mt-1 text-sm font-bold text-white/55">
                      Feature driveway proof higher on the live page.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-black/70 p-4">
                    <p className="text-lg font-black">7 estimates are still open.</p>
                    <p className="mt-1 text-sm font-bold text-white/55">
                      Follow up before the weekend before the leads go cold.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-black/70 p-4">
                    <p className="text-lg font-black">Repeat customers are visible.</p>
                    <p className="mt-1 text-sm font-bold text-white/55">
                      Maria Jenkins should see a bundle offer next time.
                    </p>
                  </div>
                </div>

                <a
                  href="/planet/home-services/leads"
                  className="mt-5 block rounded-2xl bg-orange-500 px-5 py-4 text-center text-sm font-black uppercase tracking-[0.12em] text-black hover:bg-orange-400"
                >
                  Open Live Business Board
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black px-4 py-12 text-center">
        <div className="mx-auto flex h-24 w-24 rotate-[-2deg] items-center justify-center rounded-full border-[3px] border-orange-500 bg-[#0b0b0d] shadow-[0_0_34px_rgba(249,115,22,.32)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black">
            <span className="skew-x-[-10deg] text-4xl font-black italic leading-none tracking-[-0.12em] text-white drop-shadow">
              RL
            </span>
          </div>
        </div>
        <h2 className="mt-5 text-xl font-black uppercase">
          Ridgeline Pro Wash
        </h2>
        <p className="mt-2 text-sm font-semibold text-white/45">
          Powered by HomePlanet Live Systems
        </p>
      </footer>
    </main>
  );
}












