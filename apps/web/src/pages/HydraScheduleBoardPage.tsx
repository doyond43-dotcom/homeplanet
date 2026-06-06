import { Link } from "react-router-dom";

export default function HydraScheduleBoardPage() {
  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/planet/hydra"
          className="text-sm font-black text-cyan-300"
        >
          ← Hydra Operations
        </Link>

        <h1 className="mt-6 text-5xl font-black">
          Schedule Projects
        </h1>

        <p className="mt-3 text-slate-300">
          Assign walkdowns, inspections, crews, and project dates.
        </p>

        <div className="mt-10 grid grid-cols-7 gap-3">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
            <div
              key={day}
              className="rounded-2xl bg-white/5 p-4 text-center"
            >
              <div className="text-sm text-slate-400">{day}</div>
              <div className="mt-2 text-2xl font-black">
                {Math.floor(Math.random() * 28) + 1}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] bg-white/5 p-6">
          <h2 className="text-2xl font-black">
            June 10
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-white/5 p-4">
              Treatment Plant 12A • Xander Team
            </div>

            <div className="rounded-xl bg-white/5 p-4">
              North Reservoir • Team 2
            </div>
          </div>

          <Link to="/planet/hydra/assets" className="mt-6 inline-block rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950">
            + Schedule Project
          </Link>
        </div>
      </div>
    </main>
  );
}
