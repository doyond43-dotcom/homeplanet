// apps/web/src/routes/PrivateBetaLanding.tsx
import { Link } from "react-router-dom";

export default function PrivateBetaLanding() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500" />
          <div className="min-w-0">
            <div className="text-xl font-bold leading-tight">HomePlanet</div>
            <div className="text-xs text-slate-400">Private Beta</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="text-2xl font-bold">Private beta in progress</div>
          <div className="mt-2 text-sm text-slate-300">
            This environment is intentionally minimal while core routing + proof engine stabilize.
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/cities"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold hover:border-slate-500"
            >
              Open City Index
              <div className="text-[11px] text-slate-500 font-normal mt-1">Geography layer (internal)</div>
            </Link>

            <Link
              to="/service/taylor-creek"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold hover:border-slate-500"
            >
              Service City
              <div className="text-[11px] text-slate-500 font-normal mt-1">Mechanic intake + tools</div>
            </Link>

            <Link
              to="/live/taylor-creek/staff"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold hover:border-slate-500"
            >
              Live Staff Board
              <div className="text-[11px] text-slate-500 font-normal mt-1">Realtime board + drawer</div>
            </Link>

            <Link
              to="/c/taylor-creek"
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold hover:border-slate-500"
            >
              Public Intake
              <div className="text-[11px] text-slate-500 font-normal mt-1">Customer-facing one-page</div>
            </Link>
          </div>

          <div className="mt-5 text-[11px] text-slate-500">
            Note: Root homepage is intentionally “quiet” until protection + core engine are locked.
          </div>
        </div>
      </div>
    </div>
  );
}