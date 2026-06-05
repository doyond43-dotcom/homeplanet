import { Link } from "react-router-dom";

const assets = [
  "Reservoirs",
  "Ground Storage Tanks",
  "Treatment Plants",
  "Wet Wells",
  "Dams",
  "Source Water Structures",
];

const proofCards = [
  [
    "Asset Intelligence",
    "Track tanks, reservoirs, wet wells, treatment assets, service history, and field activity.",
  ],
  [
    "Inspection Reports",
    "Turn findings, photos, recommendations, and asset scores into a clean project record.",
  ],
  [
    "Field Operations",
    "Crew status, ETA, equipment verification, and location markers in one dashboard.",
  ],
  [
    "Emergency Response",
    "Fast intake for urgent water infrastructure issues with priority visibility.",
  ],
];

const workflow = [
  [
    "01",
    "Select the asset",
    "Reservoir, wet well, treatment plant, dam, tank, or source water structure.",
  ],
  [
    "02",
    "Submit the project",
    "Issue type, priority, location, notes, and photos move into the project record.",
  ],
  [
    "03",
    "Track the truth chain",
    "Inspection, findings, recommendations, crew status, ETA, equipment, and completion history.",
  ],
];

function assetHref(asset: string) {
  return `/planet/hydra/intake?asset=${encodeURIComponent(asset)}`;
}

export default function HydraLandingPage() {
  return (
    <main className="min-h-screen bg-[#061426] text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 shadow-2xl">
          <img
            src="/images/hydra-commercial-diver-hero.jpg"
            alt="Hydra Operations commercial diver"
            className="absolute inset-0 h-full w-full object-cover object-right opacity-100"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#061426]/80 via-[#061426]/35 to-transparent" />

          <div className="relative grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
            <div className="py-10">
              <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
                Hydra Operations
              </p>

              <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
                Water Infrastructure Operations Intelligence
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                A modern operations platform for inspections, repairs, asset
                history, crew visibility, equipment readiness, emergency
                response, and project truth chains.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/planet/hydra/assets"
                  className="rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-white"
                >
                  Start Project
                </Link>

                <Link
                  to="/planet/hydra/intake?priority=Emergency"
                  className="rounded-full border border-red-400/60 bg-red-500/15 px-6 py-3 font-black text-red-100 transition hover:bg-red-500/25"
                >
                  Emergency Request
                </Link>

                <Link
                  to="/planet/hydra/dashboard?asset=Treatment%20Plant"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-black text-white backdrop-blur transition hover:bg-white/15"
                >
                  View Operations Center
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-end lg:translate-x-10">
              <div className="w-[88%] rounded-[2rem] border border-cyan-300/20 bg-slate-950/35 p-5 shadow-2xl backdrop-blur-sm">
                <div className="rounded-3xl border border-white/10 bg-[#0d1d33]/45 p-5 backdrop-blur-sm">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                    Live Project Snapshot
                  </p>

                  <h2 className="mt-4 text-3xl font-black">
                    Treatment Plant 12A
                  </h2>

                  <p className="mt-2 text-slate-400">
                    Status: Awaiting Approval
                  </p>

                  <div className="mt-5 grid gap-3">
                    {[
                      "Inspection Complete",
                      "Findings Delivered",
                      "Crew En Route",
                      "ETA 7:18 AM",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-cyan-300/20 bg-cyan-300/8 p-4 font-bold text-cyan-100 backdrop-blur-sm"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {proofCards.map(([title, body]) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10"
            >
              <h3 className="text-xl font-black text-cyan-100">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>

        <section className="mt-12 overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[#091a2d] shadow-2xl shadow-black/30">
          <img
            src="/images/hydra-assets-grid.jpg"
            alt="Hydra Operations infrastructure asset grid"
            className="w-full object-cover"
          />

          <div className="p-8">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
              Infrastructure Assets
            </p>

            <h2 className="mt-3 text-4xl font-black">
              Built around the asset, not just the form.
            </h2>

            <p className="mt-4 max-w-3xl text-slate-300">
              Hydra connects the real-world infrastructure asset to the request,
              the inspection, the crew, the report, and the operations center.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="grid gap-4 md:grid-cols-3">
            {assets.map((asset) => (
              <Link
                key={asset}
                to={assetHref(asset)}
                className="rounded-3xl border border-cyan-300/20 bg-slate-900 p-6 transition hover:border-cyan-300 hover:bg-slate-800"
              >
                <div className="text-2xl font-black">{asset}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Request work, track findings, attach field activity, and build
                  asset memory.
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          {workflow.map(([step, title, body]) => (
            <div
              key={step}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                Step {step}
              </p>
              <h3 className="mt-3 text-2xl font-black">{title}</h3>
              <p className="mt-2 leading-7 text-slate-400">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-8">
          <h2 className="text-4xl font-black">
            From website to operating system.
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            Hydra Operations gives owners, crews, and customers one connected
            view of what happened, what is happening, and what needs to happen
            next.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/planet/hydra/assets"
              className="rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950 transition hover:bg-white"
            >
              Enter Demo
            </Link>

            <Link
              to="/planet/hydra/dashboard?asset=Treatment%20Plant"
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-black transition hover:bg-white/15"
            >
              View Dashboard
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}











