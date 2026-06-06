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
  ["01", "Select the asset", "Reservoir, wet well, treatment plant, dam, tank, or source water structure."],
  ["02", "Submit the project", "Issue type, priority, location, notes, and photos move into the project record."],
  ["03", "Track the truth chain", "Inspection, findings, recommendations, crew status, ETA, equipment, and completion history."],
];

function assetHref(asset: string) {
  return `/planet/hydra/intake?asset=${encodeURIComponent(asset)}`;
}

export default function HydraLandingPage() {
  return (
    <main className="min-h-screen bg-[#061426] text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 rounded-[2rem] border border-cyan-300/20 bg-white/5 p-8 shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
              Hydra Operations
            </p>

            <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">
              Commercial Diving Meets Water Infrastructure Intelligence
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              A modern operations platform for inspections, repairs, asset history,
              crew visibility, equipment readiness, emergency response, and project truth chains.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/planet/hydra/assets"
                className="rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950"
              >
                Start Project
              </Link>

              <Link
                to="/planet/hydra/intake?priority=Emergency"
                className="rounded-full border border-red-400/50 px-6 py-3 font-black text-red-200"
              >
                Emergency Request
              </Link>

              <Link
                to="/planet/hydra/dashboard?asset=Treatment%20Plant"
                className="rounded-full border border-white/20 px-6 py-3 font-black"
              >
                View Operations Center
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/20 bg-slate-950 p-5">
            <div className="rounded-3xl border border-white/10 bg-[#0d1d33] p-5">
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
                    className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 font-bold text-cyan-100"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {proofCards.map(([title, body]) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <h3 className="text-xl font-black text-cyan-100">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>

        <section className="mt-12">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            Infrastructure Assets
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Built around the asset, not just the form.
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {assets.map((asset) => (
              <Link
                key={asset}
                to={assetHref(asset)}
                className="rounded-3xl border border-cyan-300/20 bg-slate-900 p-6 transition hover:border-cyan-300"
              >
                <div className="text-2xl font-black">{asset}</div>
                <p className="mt-2 text-sm text-slate-400">
                  Request work, track findings, attach field activity, and build asset memory.
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
              <p className="mt-2 text-slate-400">{body}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-8">
          <h2 className="text-4xl font-black">
            From website to operating system.
          </h2>

          <p className="mt-3 max-w-3xl text-slate-300">
            Hydra Operations gives owners, crews, and customers one connected view of what happened,
            what is happening, and what needs to happen next.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/planet/hydra/assets"
              className="rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950"
            >
              Enter Demo
            </Link>

            <Link
              to="/planet/hydra/dashboard?asset=Treatment%20Plant"
              className="rounded-full border border-white/20 px-6 py-3 font-black"
            >
              View Dashboard
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}