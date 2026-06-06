import { Link } from "react-router-dom";

const jobs = [
  {
    name: "Treatment Plant 12A",
    crew: "Xander Team",
    walkdown: "June 10",
    status: "Scheduled",
  },
  {
    name: "North Reservoir Inspection",
    crew: "Team 2",
    walkdown: "June 12",
    status: "Scheduled",
  },
  {
    name: "South Dam Assessment",
    crew: "Dive Team",
    walkdown: "June 14",
    status: "Scheduled",
  },
  {
    name: "East Wet Well Survey",
    crew: "Inspection Crew",
    walkdown: "June 15",
    status: "Scheduled",
  },
];

export default function HydraJobsBoardPage() {
  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/planet/hydra"
          className="text-sm font-black text-cyan-300"
        >
          ← Hydra Operations
        </Link>

        <h1 className="mt-6 text-5xl font-black">
          This Week's Work
        </h1>

        <p className="mt-3 max-w-2xl text-slate-300">
          Upcoming walkdowns, inspections, and assigned crew work.
        </p>

        <div className="mt-10 space-y-4">
          {jobs.map((job) => (
            <div
              key={job.name}
              className="rounded-[2rem] bg-white/5 p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black">
                    {job.name}
                  </h2>

                  <div className="mt-2 text-slate-400">
                    Walkdown: {job.walkdown}
                  </div>

                  <div className="text-slate-400">
                    Crew: {job.crew}
                  </div>

                  <div className="text-cyan-300">
                    {job.status}
                  </div>
                </div>

                <Link
                  to="/planet/hydra/intake"
                  className="rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950"
                >
                  Start Inspection
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
