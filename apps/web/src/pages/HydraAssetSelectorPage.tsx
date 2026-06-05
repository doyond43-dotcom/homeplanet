import { Link } from "react-router-dom";

const groups = [
  { title: "Distribution Systems", items: ["Reservoir", "Ground Storage Tank", "Elevated Tank", "Wet Well"] },
  { title: "Treatment Plants", items: ["Clearwell", "Contact Chamber", "Backwash Tank", "Filtration System"] },
  { title: "Source Water", items: ["Lake", "Stream", "Dam", "Pond", "Screenhouse"] },
];

function assetHref(asset: string) {
  return `/planet/hydra/intake?asset=${encodeURIComponent(asset)}`;
}

function reportHref(asset: string) {
  return `/planet/hydra/report?asset=${encodeURIComponent(asset)}`;
}

function dashboardHref(asset: string) {
  return `/planet/hydra/dashboard?asset=${encodeURIComponent(asset)}`;
}

export default function HydraAssetSelectorPage() {
  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link to="/planet/hydra" className="text-sm text-cyan-300">? Hydra Operations</Link>
        <h1 className="mt-6 text-5xl font-black">Select Asset Type</h1>
        <p className="mt-3 max-w-2xl text-slate-300">Start with the asset. Hydra connects the inspection, findings, recommendation, and project visibility from there.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {groups.map((group) => (
            <section key={group.title} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-black text-cyan-200">{group.title}</h2>
              <div className="mt-5 grid gap-3">
                {group.items.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 hover:border-cyan-300">
                      <div className="font-black text-white">{item}</div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link to={assetHref(item)} className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">
                          Start Intake
                        </Link>
                        <Link to={reportHref(item)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-black text-cyan-200">
                          View Inspection Report
                        </Link>
                        <Link to={dashboardHref(item)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-black text-white">
                          View Dashboard
                        </Link>
                      </div>
                    </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}


