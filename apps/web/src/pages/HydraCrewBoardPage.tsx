import { Link } from "react-router-dom";

export default function HydraCrewBoardPage() {
  const jobs = [
    {
      asset: "Treatment Plant 12A",
      slug: "treatment-plant-12a",
      status: "Assigned",
      technician: "Mike Rodriguez",
      priority: "High",
      location: "Okeechobee Water District",
    },
    {
      asset: "Reservoir North",
      slug: "reservoir-north",
      status: "En Route",
      technician: "Sarah Johnson",
      priority: "Medium",
      location: "North Reservoir",
    },
    {
      asset: "Wet Well 7",
      slug: "wet-well-7",
      status: "Inspection In Progress",
      technician: "Chris Miller",
      priority: "Critical",
      location: "South Lift Station",
    },
  ];

  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-5xl font-black">Hydra Crew Board</h1>

        <div className="mt-8 space-y-5">
          {jobs.map((job) => (
            <div
              key={job.asset}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-black">{job.asset}</h2>

                  <div className="mt-4 space-y-1 text-slate-300">
                    <p>Technician: {job.technician}</p>
                    <p>Priority: {job.priority}</p>
                    <p>Location: {job.location}</p>
                    <p className="text-cyan-300">Status: {job.status}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/planet/hydra/job/${job.slug}`}
                    className="rounded-full bg-cyan-300 px-5 py-3 font-black text-slate-950"
                  >
                    Start Job
                  </Link>

                  <Link
                    to={`/planet/hydra/report?asset=${encodeURIComponent(job.asset)}`}
                    className="rounded-full border border-white/15 px-5 py-3 font-black"
                  >
                    Asset History
                  </Link>

                  <Link
                    to={`/planet/hydra/job/${job.slug}`}
                    className="rounded-full border border-white/15 px-5 py-3 font-black"
                  >
                    Upload Photos
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}