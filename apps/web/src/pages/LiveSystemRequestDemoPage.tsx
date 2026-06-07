import { Link } from "react-router-dom";

const requestDetails = [
  ["Customer", "Sarah Johnson"],
  ["Phone", "(863) 555-0148"],
  ["Request", "Main breaker panel keeps tripping"],
  ["Issue", "Half the house has no power"],
  ["Priority", "Urgent"],
  ["Location", "456 Oak Drive, Okeechobee, FL"],
];

const intakeItems = [
  "Customer details captured",
  "Power outage notes attached",
  "Photos uploaded",
  "Priority marked urgent",
  "Location ready for dispatch",
];

export default function LiveSystemRequestDemoPage() {
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
            Request Center Demo
          </p>

          <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">
            Customer Request
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            A live request comes in with customer details, service notes, photos,
            priority, and location already connected.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-white/[0.04] p-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
              Incoming Request
            </div>

            <h2 className="mt-4 text-3xl font-black">
              New Service Request
            </h2>

            <div className="mt-6 grid gap-3">
              {requestDetails.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-black/35 p-4"
                >
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
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                  Connected Intake
                </div>
                <h2 className="mt-4 text-3xl font-black">
                  Ready for Dispatch
                </h2>
              </div>

              <div className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-black text-red-200">
                Urgent Priority
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {intakeItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-black text-emerald-100"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button className="rounded-full bg-emerald-300 px-5 py-3 font-black text-slate-950">
                Send to Dispatch
              </button>

              <button className="rounded-full bg-white/10 px-5 py-3 font-black text-white">
                Tap to Call
              </button>

              <button className="rounded-full bg-white/10 px-5 py-3 font-black text-white">
                Open Map
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-emerald-300/10 p-6">
          <h2 className="text-3xl font-black">
            Nothing gets lost between request and assignment.
          </h2>

          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">
            The request becomes the first truth event in the live system. From
            here, it can move directly into dispatch without copying texts,
            addresses, photos, or notes.
          </p>
        </section>
      </div>
    </main>
  );
}

