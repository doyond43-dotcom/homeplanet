import React, { useState } from "react";

type StaffJob = {
  id: string;
  customer: string;
  vehicle: string;
  status: string;
  internal: string;
  lane: "quick" | "long";
  time: string;
  proof: string;
  nextAction: string;
};

const staffJobs: StaffJob[] = [
  {
    id: "TC-STAFF-201",
    customer: "Sample Owner",
    vehicle: "2019 Dodge Ram",
    status: "Needs approval",
    internal: "Demo note: estimate ready. No real customer data shown.",
    lane: "quick",
    time: "9:15 AM",
    proof: "Estimate proof ready",
    nextAction: "Send approval",
  },
  {
    id: "TC-STAFF-202",
    customer: "Demo Customer",
    vehicle: "2017 Honda Accord",
    status: "In bay",
    internal: "Demo note: technician assigned. Parts staged.",
    lane: "quick",
    time: "10:40 AM",
    proof: "Inspection started",
    nextAction: "Attach inspection photo",
  },
  {
    id: "TC-STAFF-203",
    customer: "Test Customer",
    vehicle: "2021 Nissan Altima",
    status: "Waiting parts",
    internal: "Demo note: customer notified through sample flow.",
    lane: "long",
    time: "11:05 AM",
    proof: "Customer update logged",
    nextAction: "Confirm parts ETA",
  },
  {
    id: "TC-STAFF-204",
    customer: "Demo Driver",
    vehicle: "2016 Chevy Silverado",
    status: "Diagnosing",
    internal: "Demo note: issue being verified.",
    lane: "long",
    time: "1:20 PM",
    proof: "Diagnostic note pending",
    nextAction: "Finish diagnosis",
  },
  {
    id: "TC-STAFF-205",
    customer: "Sample Client",
    vehicle: "2015 Toyota Camry",
    status: "Ready soon",
    internal: "Demo note: pickup window approaching.",
    lane: "quick",
    time: "2:10 PM",
    proof: "Final proof attached",
    nextAction: "Send pickup notice",
  },
];

function JobCard({
  job,
  onOpen,
  active,
}: {
  job: StaffJob;
  onOpen: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`w-full rounded-[24px] border p-5 text-left transition ${
        active
          ? "border-cyan-300/40 bg-cyan-300/10"
          : "border-white/10 bg-white/[0.04] hover:border-cyan-300/25 hover:bg-white/[0.06]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
            {job.id}
          </div>
          <h2 className="mt-2 text-lg font-black">{job.vehicle}</h2>
          <p className="mt-1 text-sm text-white/70">{job.customer}</p>
          <p className="mt-1 text-xs text-white/40">{job.time}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <div className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[11px] font-black text-cyan-100">
            {job.status}
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-white/65">
        {job.internal}
      </p>
    </button>
  );
}

export default function TaylorCreekStaffDemoBoard() {
  const quickJobs = staffJobs.filter((j) => j.lane === "quick");
  const longJobs = staffJobs.filter((j) => j.lane === "long");
  const [selected, setSelected] = useState<StaffJob>(staffJobs[0]);
  const [stepCount, setStepCount] = useState(0);

  function markNextStep() {
    setStepCount((current) => current + 1);
  }

  return (
    <main className="min-h-screen bg-[#020617] px-5 py-8 text-white">
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[1fr_390px]">
        <div>
          <div className="mb-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Taylor Creek Staff Demo
            </p>
            <h1 className="mt-3 text-3xl font-black">Live staff board (demo)</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Safe duplicate with sample data only. No real customer info is ever shown here.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
                  Quick Jobs
                </h2>
                <span className="text-xs text-white/40">{quickJobs.length} active</span>
              </div>

              <div className="space-y-4">
                {quickJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    active={selected.id === job.id}
                    onOpen={() => setSelected(job)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">
                  Longer Jobs
                </h2>
                <span className="text-xs text-white/40">{longJobs.length} active</span>
              </div>

              <div className="space-y-4">
                {longJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    active={selected.id === job.id}
                    onOpen={() => setSelected(job)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 xl:sticky xl:top-6 xl:h-fit">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Work Drawer
          </p>

          <h2 className="mt-3 text-2xl font-black">{selected.vehicle}</h2>
          <p className="mt-1 text-sm text-white/60">
            {selected.id} • {selected.customer}
          </p>

          <div className="mt-5 space-y-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/35">
                Status
              </div>
              <div className="mt-1 font-bold text-cyan-100">{selected.status}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/35">
                Internal note
              </div>
              <div className="mt-1 text-white/75">{selected.internal}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/35">
                Proof status
              </div>
              <div className="mt-1 text-white/75">{selected.proof}</div>
            </div>

            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-cyan-100/60">
                Next action
              </div>
              <div className="mt-1 font-bold text-cyan-100">
                {selected.nextAction}
              </div>
            </div>

            <button
              type="button"
              onClick={markNextStep}
              className="w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
            >
              Mark next step
            </button>

            {stepCount > 0 ? (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-xs text-emerald-100">
                Demo action logged: {stepCount} sample update{stepCount === 1 ? "" : "s"}.
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
