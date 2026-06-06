import { Link, useSearchParams } from "react-router-dom";

const activity = [
  "Reservoir inspection completed",
  "Findings delivered to review queue",
  "Mixer installation recommendation created",
  "Chemical wash opportunity added to pipeline",
  "Asset history updated"
];

const timeline = [
  ["complete", "Request Submitted"],
  ["complete", "Asset Selected"],
  ["complete", "Inspection Scheduled"],
  ["complete", "Inspection Completed"],
  ["complete", "Findings Delivered"],
  ["pending", "Awaiting Approval"],
  ["upcoming", "Crew Assigned"],
  ["upcoming", "Equipment Verified"],
  ["upcoming", "En Route"],
  ["upcoming", "On Site"],
  ["upcoming", "Project Complete"]
];

const history = [
  ["2024", "Annual inspection completed"],
  ["2025", "Sediment removal performed"],
  ["2025", "Mixer installation reviewed"],
  ["2026", "Current inspection completed"]
];

const locations = [
  ["Main Gate", "Primary crew entry point"],
  ["Staging Area", "Equipment drop and prep zone"],
  ["Dive Entry Point", "Water access for inspection crew"],
  ["North Access Hatch", "Primary structure access marker"],
  ["Mixer Location", "Recommended active mixer placement"],
  ["Chemical Feed Room", "Treatment support access point"]
];

const crew = [
  ["Lead Diver", "Xander"],
  ["Support Diver", "John"],
  ["Tender", "Mike"]
];

const equipment = [
  "Harness",
  "Air Supply",
  "Dive Communications",
  "Camera Equipment",
  "Mixer Equipment",
  "Safety Kit",
  "Cooler",
  "Extra Hardware"
];

const futureModules = [
  "Live GPS Tracking",
  "Customer ETA View",
  "Automated Notifications",
  "Inventory Management",
  "Emergency Dispatch",
  "Photo Verification Timeline"
];

export default function HydraOwnerDashboardPage() {
  const [searchParams] = useSearchParams();
  const selectedAsset = searchParams.get("asset") || "Reservoir";

  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          to={`/planet/hydra/report?asset=${encodeURIComponent(selectedAsset)}`}
          className="text-sm text-cyan-300"
        >
          Back to Inspection Report
        </Link>

        <h1 className="mt-6 text-5xl font-black">
          Hydra Operations Center
        </h1>

        <p className="mt-3 text-slate-300">
          Owner visibility across active projects, crews, locations,
          equipment, approvals, and pipeline.
        </p>

        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">
            Active Project
          </p>

          <div className="mt-4 grid gap-5 md:grid-cols-4">
            {[
              ["Project", "HYD-2026-001"],
              ["Asset", `${selectedAsset} 12A`],
              ["Status", "Awaiting Approval"],
              ["Estimated Value", "$14,500"]
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-slate-950/60 p-5"
              >
                <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  {label}
                </div>

                <div className="mt-2 text-2xl font-black text-white">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {[
            ["17", "Projects Active"],
            ["8", "Pending Reviews"],
            ["5", "Quotes Out"],
            ["1", "Emergency Requests"],
            ["9", "Product Opportunities"]
          ].map(([num, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="text-4xl font-black text-cyan-300">
                {num}
              </div>

              <div className="mt-1 text-sm text-slate-300">
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">
              Truth Chain Timeline
            </h2>

            <div className="mt-4 grid gap-3">
              {timeline.map(([status, label]) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 p-4"
                >
                  <span
                    className={`h-3 w-3 rounded-full ${
                      status === "complete"
                        ? "bg-cyan-300"
                        : status === "pending"
                        ? "bg-amber-300"
                        : "bg-slate-600"
                    }`}
                  />

                  <span
                    className={`font-bold ${
                      status === "upcoming"
                        ? "text-slate-500"
                        : "text-slate-100"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">
              Asset History
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {selectedAsset} 12A service memory
            </p>

            <div className="mt-4 grid gap-3">
              {history.map(([year, item]) => (
                <div
                  key={`${year}-${item}`}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-4"
                >
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                    {year}
                  </div>

                  <div className="mt-1 font-bold text-slate-100">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-[2rem] border border-cyan-300/20 bg-white/5 p-6 lg:col-span-2">
            <h2 className="text-2xl font-black">
              Location Intelligence
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Crew-ready site markers attached to {selectedAsset} 12A.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {locations.map(([title, body]) => (
                <button
                  key={title}
                  className="rounded-2xl border border-cyan-300/20 bg-slate-950 p-4 text-left hover:border-cyan-300"
                >
                  <div className="font-black text-cyan-100">
                    {title}
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    {body}
                  </p>

                  <div className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                    Open Maps
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">
              Field Operations
            </h2>

            <div className="mt-4 rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-green-200">
                Crew Status
              </div>

              <div className="mt-2 text-2xl font-black text-green-100">
                En Route
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {crew.map(([role, name]) => (
                <div
                  key={role}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-4"
                >
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    {role}
                  </div>

                  <div className="mt-1 text-xl font-black text-white">
                    {name}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                Departure Time
              </div>

              <div className="mt-2 text-xl font-black">
                6:42 AM
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                ETA
              </div>

              <div className="mt-2 text-xl font-black">
                7:18 AM
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                Current Location
              </div>

              <div className="mt-2 font-bold">
                Traveling To {selectedAsset} 12A
              </div>

              <div className="mt-1 text-sm text-slate-300">
                12 Miles Away
              </div>

              <button className="mt-3 rounded-xl border border-cyan-300/20 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                Open GPS
              </button>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">
            Equipment Verification
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Warehouse checklist before the crew leaves for the project.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {equipment.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 font-bold text-cyan-100"
              >
                Checked - {item}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">
              Recent Activity
            </h2>

            <div className="mt-4 grid gap-3">
              {activity.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-4 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">
              Future Field Modules
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Locked roadmap items for the next operational layer.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {futureModules.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950 p-4 font-bold text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}