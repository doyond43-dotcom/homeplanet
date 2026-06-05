import { Link } from "react-router-dom";

const assets = ["Reservoirs", "Ground Storage Tanks", "Treatment Plants", "Wet Wells", "Dams", "Source Water Structures"];

function assetHref(asset: string) {
  return `/planet/hydra/intake?asset=${encodeURIComponent(asset)}`;
}

export default function HydraLandingPage() {
  return (
    <main className="min-h-screen bg-[#071427] text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-[2rem] border border-cyan-400/20 bg-white/5 p-8 shadow-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">Hydra Operations</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            Water Infrastructure Operations Platform
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            Commercial diving, inspections, repairs, asset intelligence, product recommendations, and emergency response in one operational flow.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/planet/hydra/assets" className="rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950">
              Request Project
            </Link>
            <Link to="/planet/hydra/intake?priority=Emergency" className="rounded-full border border-red-400/50 px-6 py-3 font-bold text-red-200">
              Emergency Service
            </Link>
            <Link to="/planet/hydra/assets" className="rounded-full border border-white/20 px-6 py-3 font-bold">
              View Infrastructure Assets
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {["Assets Supported", "Emergency Response", "Inspection Services", "Nationwide Coverage"].map((item, i) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-3xl font-black text-cyan-300">{[48, 24, 12, 50][i]}+</div>
              <div className="mt-1 text-sm text-slate-300">{item}</div>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-black">Infrastructure Assets</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {assets.map((asset) => (
              <Link key={asset} to={assetHref(asset)} className="rounded-3xl border border-cyan-400/20 bg-slate-900 p-6 hover:border-cyan-300">
                <div className="text-xl font-black">{asset}</div>
                <p className="mt-2 text-sm text-slate-400">Inspections, maintenance, repairs, and operational visibility.</p>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
