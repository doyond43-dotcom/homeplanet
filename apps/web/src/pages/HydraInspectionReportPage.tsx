import { Link, useSearchParams } from "react-router-dom";

const findings = [
  ["Sediment accumulation detected", "Visible buildup along the reservoir floor. Cleaning is recommended before the next service cycle."],
  ["Thermal stratification present", "Water layers are showing signs of separation, which can impact circulation and water quality."],
  ["Biofilm growth observed", "Surface growth was noted during inspection and should be addressed as part of the maintenance plan."],
  ["Circulation deficiencies identified", "Current movement patterns suggest the asset may benefit from active mixing support."]
];

const recommendations = [
  ["Sediment Removal", "Remove settled material and restore cleaner operating conditions."],
  ["Kasco Active Mixer Installation", "Improve circulation and reduce stagnant zones inside the asset."],
  ["Pantonite PM88 Chemical Wash", "Support deeper cleaning where buildup or biological growth is present."]
];

export default function HydraInspectionReportPage() {
  const [searchParams] = useSearchParams();
  const selectedAsset = searchParams.get("asset") || "Reservoir";

  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link to={`/planet/hydra/intake?asset=${encodeURIComponent(selectedAsset)}`} className="text-sm text-cyan-300">Back to Project Intake</Link>

        <div className="mt-6 rounded-[2rem] border border-cyan-400/20 bg-white/5 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">Inspection Report</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black">HYD-2026-001</h1>
              <p className="mt-2 text-slate-300">{selectedAsset} 12A • City of Clearwater Water Department</p>
            </div>
            <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-5 text-right">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Asset Score</div>
              <div className="text-5xl font-black text-cyan-200">78</div>
              <div className="text-sm text-slate-300">out of 100</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["Inspection Date", "06/04/2026"],
            ["Inspector", "Hydra Dive Operations Team"],
            ["Status", "Inspection Complete"],
            ["Condition", "Attention Recommended"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{label}</div>
              <div className="mt-2 font-black text-white">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:col-span-2">
            <h2 className="text-2xl font-black">Inspection Findings</h2>
            <div className="mt-4 grid gap-3">
              {findings.map(([title, body], index) => (
                <div key={title} className="rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">Finding {index + 1}</div>
                  <div className="mt-1 font-black text-amber-50">{title}</div>
                  <p className="mt-2 text-sm text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">Estimated Impact</h2>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li>Improved circulation</li>
              <li>Reduced nitrification risk</li>
              <li>Improved chlorine residual consistency</li>
              <li>Extended asset lifespan</li>
            </ul>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">Recommended Actions</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {recommendations.map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
                <div className="text-xl font-black text-cyan-100">{title}</div>
                <p className="mt-2 text-sm text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">Inspection Photos</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {["Before", "Inspection", "After"].map((p) => (
              <div key={p} className="flex h-44 items-center justify-center rounded-3xl border border-white/10 bg-slate-950 text-slate-400">{p} Photo</div>
            ))}
          </div>
          <Link to={`/planet/hydra/dashboard?asset=${encodeURIComponent(selectedAsset)}`} className="mt-6 inline-flex rounded-full bg-cyan-300 px-7 py-3 font-black text-slate-950">
            View Owner Dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}
