import { Link } from "react-router-dom";

const workPerformed = [
  "Main breaker inspected",
  "Loose neutral identified",
  "Connection repaired",
  "Panel tested",
];

const timeline = [
  ["8:03 AM", "Request created"],
  ["8:04 AM", "Assigned to Jason Miller"],
  ["8:06 AM", "Technician accepted assignment"],
  ["8:18 AM", "Arrived on site"],
  ["8:31 AM", "Inspection completed"],
  ["8:47 AM", "Repair completed"],
  ["9:02 AM", "Customer approved work"],
  ["9:03 AM", "Feedback request sent"],
  ["9:05 AM", "Customer submitted feedback"],
];

export default function LiveSystemOperationsDemoPage() {
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
            Live Command View
          </p>

          <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">
            Job Completion
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Follow the job from arrival to completion with proof, history,
            technician activity, customer approval, and feedback connected in
            one place.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-white/[0.04] p-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
              Active Job
            </div>

            <h2 className="mt-4 text-3xl font-black">
              Electrical Service Call
            </h2>

            <div className="mt-6 grid gap-3">
              {[
                ["Status", "Completed"],
                ["Customer", "Sarah Johnson"],
                ["Technician", "Jason Miller"],
                ["Arrival Time", "8:18 AM"],
                ["Location", "456 Oak Drive, Okeechobee, FL"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-black/35 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    {label}
                  </div>
                  <div className="mt-1 text-lg font-black">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/[0.04] p-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              Work Performed
            </div>

            <div className="mt-5 grid gap-3">
              {workPerformed.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 font-black"
                >
                  Complete: {item}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                Proof of Work
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  "Before: Scorch marks near neutral connection",
                  "During: Loose neutral isolated and repaired",
                  "After: Panel tested and power restored",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex h-32 items-center justify-center rounded-2xl bg-black/35 p-4 text-center text-sm font-black leading-6 text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-emerald-300/10 p-6">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
            Job Status
          </div>

          <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
            Completed successfully.
          </h2>

          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">
            Customer approved the completed electrical repair at 9:02 AM. The
            request, dispatch, work performed, proof, and completion history are
            now permanently connected.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white/[0.04] p-6">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
            Customer Feedback
          </div>

          <div className="mt-4 text-4xl font-black text-emerald-300">
            5 Stars
          </div>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            "Jason was professional, explained the issue clearly, and restored
            power quickly."
          </p>

          <div className="mt-4 text-sm font-black text-emerald-300">
            Submitted: 9:05 AM
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-white/[0.04] p-6">
          <div className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
            Job Timeline
          </div>

          <div className="mt-5 grid gap-3">
            {timeline.map(([time, event]) => (
              <div
                key={time}
                className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/35 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="font-black text-emerald-300">{time}</div>
                <div className="font-bold text-slate-300">{event}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] bg-emerald-300/10 p-6">
          <h2 className="text-3xl font-black">
            Proof. History. Feedback. Completion.
          </h2>

          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">
            The owner, dispatcher, technician, and customer all see the same
            truth. The work happened, the proof is attached, the customer
            responded, and the job is permanently recorded.
          </p>
        </section>
      </div>
    </main>
  );
}


