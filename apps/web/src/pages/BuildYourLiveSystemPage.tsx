import { ArrowRight, Building2, ClipboardList, Globe2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const recommendations = [
  "Before & after photos",
  "Customer request intake",
  "Job dispatch",
  "Crew routing",
  "Completion proof",
  "Payment links",
  "Customer updates",
  "Owner live view",
];

export default function BuildYourLiveSystemPage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <section className="mx-auto max-w-5xl px-5 py-6">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-xl">
          <Link to="/planet/business-systems" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400 text-black">
              <Globe2 size={21} />
            </div>
            <div>
              <p className="text-sm font-black tracking-wide">HomePlanet</p>
              <p className="text-[11px] text-white/50">Build Your Live System</p>
            </div>
          </Link>

          <Link to="/planet/home" className="rounded-full bg-white px-4 py-2 text-xs font-black text-black">
            Home
          </Link>
        </header>

        <div className="py-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-200">
            <Sparkles size={14} />
            Business Systems selected
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-tight sm:text-6xl lg:text-7xl">
            Build your live business system.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">
            Start with your business name and what you do. HomePlanet will recommend the operational pieces that fit your work.
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_.85fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex items-center gap-3">
                <Building2 className="text-emerald-300" size={24} />
                <h2 className="text-2xl font-black">Quick Build</h2>
              </div>

              <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/45">
                Business Name
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none focus:border-emerald-300/50"
                placeholder="Example: ABC Pressure Cleaning"
              />

              <label className="mt-5 block text-xs font-black uppercase tracking-[0.2em] text-white/45">
                What do you do?
              </label>
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none focus:border-emerald-300/50"
                placeholder="Pressure washing, HVAC, landscaping, pest control..."
              />

              <button
                type="button"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black shadow-xl shadow-emerald-500/20"
              >
                Build My System <ArrowRight size={18} />
              </button>

              <p className="mt-4 text-sm leading-6 text-white/45">
                This locks the correct architecture first. The generated board connection comes next.
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex items-center gap-3">
                <ClipboardList className="text-emerald-300" size={24} />
                <h2 className="text-2xl font-black">Recommended Modules</h2>
              </div>

              <div className="grid gap-3">
                {recommendations.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-bold text-white/70">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
