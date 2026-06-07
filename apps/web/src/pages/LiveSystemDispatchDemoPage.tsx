import { Link } from "react-router-dom";

const techDetails = [
  ["Assigned Technician", "Jason Miller"],
  ["Phone", "(863) 555-0194"],
  ["Trade", "Licensed Electrician"],
  ["Vehicle", "Service Truck 03"],
  ["ETA", "12 Minutes"],
  ["Status", "Ready to Dispatch"],
];

const actions = [
  "Tap to Call",
  "Tap to Text",
  "Open Maps",
  "Send Job Details",
  "Accept Assignment",
];

const timeline = [
  ["8:03 AM", "Request created"],
  ["8:04 AM", "Assigned to Jason Miller"],
  ["8:05 AM", "Job details sent to technician"],
  ["8:06 AM", "Technician accepted assignment"],
];

export default function LiveSystemDispatchDemoPage() {
  return (
    <main className="min-h-screen bg-[#050812] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/planet/build-your-live-system"
          className="text-sm font-black text-emerald-300"
        >
          Back to Build Your Live System
        </Link>

        <section className="mt-8 rounded-[2rem] bg-white/[0.04] p-8">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-emerald-300">
            Dispatch Desk Demo
          </p>

          <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">
            Crew Assignment
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            The urgent electrical request moves from intake into dispatch. The
            right technician gets the job details, customer contact, and location
            without anyone copying information by hand.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-white/[0.04] p-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
              Technician Assignment
            </div>

            <h2 className="mt-4 text-3xl font-black">
              Jason is ready for dispatch.
            </h2>

            <div className="mt-6 grid gap-3">
              {techDetails.map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-black/35 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    {label}
                  </div>
                  <div className="mt-1 text-lg font-black text-white">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/[0.04] p-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              One-Tap Dispatch
            </div>

            <h2 className="mt-4 text-3xl font-black">
              Everything the dispatcher needs is one tap away.
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {actions.map((action) => (
                <button
                  key={action}
                  className="rounded-full bg-emerald-300 px-5 py-3 font-black text-slate-950 transition hover:bg-white"
                >
                  {action}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-[2rem] bg-black/35 p-5">
              <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                Dispatch Timeline
              </div>

              <div className="mt-5 grid gap-3">
                {timeline.map(([time, event]) => (
                  <div
                    key={time}
                    className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="text-sm font-black text-emerald-300">
                      {time}
                    </div>
                    <div className="text-sm font-bold text-slate-300">
                      {event}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-emerald-300/10 p-6">
          <h2 className="text-3xl font-black">
            Dispatch becomes action, not phone tag.
          </h2>

          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">
            The crew member knows who to call, where to go, what happened, and
            what needs to be done before they ever leave the truck.
          </p>
        </section>
      </div>
    </main>
  );
}


