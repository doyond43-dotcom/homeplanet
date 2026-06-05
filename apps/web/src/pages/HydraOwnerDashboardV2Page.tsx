export default function HydraOwnerDashboardV2Page() {
  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
          Hydra Operations
        </p>

        <h1 className="mt-4 text-5xl font-black">Operations Center</h1>

        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-white/5 p-6">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            Active Project
          </p>

          <h2 className="mt-4 text-3xl font-black">Treatment Plant 12A</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Status</p>
              <p className="mt-2 text-xl font-black text-cyan-300">Crew En Route</p>
            </div>

            <div className="rounded-2xl bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Lead Diver</p>
              <p className="mt-2 text-xl font-black">Xander</p>
            </div>

            <div className="rounded-2xl bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">ETA</p>
              <p className="mt-2 text-xl font-black">22 Minutes</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">Latest Crew Activity</h2>

            <div className="mt-5 space-y-3">
              {["Crew Assigned", "Equipment Verified", "En Route"].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-950/70 p-4 font-black">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">Latest Finding</h2>

            <div className="mt-5 rounded-2xl bg-slate-950/70 p-5">
              <p className="inline-flex rounded-full bg-cyan-300 px-3 py-1 text-sm font-black text-slate-950">
                Leak
              </p>

              <p className="mt-4 text-slate-200">
                Medium severity finding reported near the intake access point.
              </p>

              <p className="mt-3 text-sm font-black text-cyan-300">
                Photo attached
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">Asset History</h2>

          <div className="mt-5 space-y-3">
            {[
              "2026 — Current inspection completed",
              "2025 — Sediment removal performed",
              "2024 — Annual inspection completed",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-950/70 p-4 font-black">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
