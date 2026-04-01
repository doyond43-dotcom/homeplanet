import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GuardianStartPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const target = `/planet/guardian/onboarding${location.search || ""}`;
    navigate(target, { replace: true });
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen bg-[#020611] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[980px] items-center justify-center px-4 py-6 md:px-6 lg:px-8">
        <div className="w-full max-w-[760px] rounded-[30px] border border-emerald-500/18 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_rgba(2,6,17,0.96)_38%)] p-6 text-center shadow-[0_0_0_1px_rgba(16,185,129,0.05),0_22px_70px_rgba(0,0,0,0.5)] md:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
              Guardian reroute
            </span>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Correct live flow
            </span>
          </div>

          <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
            Routing into Guardian onboarding…
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
            The shortcut start page is no longer the main Guardian entry. HomePlanet now routes this
            handoff into the real onboarding flow so users can add real names, build the first live
            protection layer, and then enter the protected Guardian dashboard.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                Step 1
              </div>
              <div className="mt-2 text-base font-semibold text-white">Onboarding</div>
              <div className="mt-1 text-xs text-slate-400">Add real household names.</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                Step 2
              </div>
              <div className="mt-2 text-base font-semibold text-white">Activation</div>
              <div className="mt-1 text-xs text-slate-400">Show the build moment.</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                Step 3
              </div>
              <div className="mt-2 text-base font-semibold text-white">Protected dashboard</div>
              <div className="mt-1 text-xs text-slate-400">Enter the live Guardian board.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
