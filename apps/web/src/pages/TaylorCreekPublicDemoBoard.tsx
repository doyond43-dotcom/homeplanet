import React, { useState } from "react";

type PublicJob = {
  id: string;
  label: string;
  vehicle: string;
  status: string;
  message: string;
  time: string;
  proof: string;
  nextStep: string;
};

const publicJobs: PublicJob[] = [
  {
    id: "TC-DEMO-101",
    label: "Sample Customer",
    vehicle: "2018 Ford F-150",
    status: "Checked in",
    message: "Vehicle received. Waiting for inspection.",
    time: "9:15 AM",
    proof: "Check-in receipt created",
    nextStep: "Technician review",
  },
  {
    id: "TC-DEMO-102",
    label: "Demo Walk-In",
    vehicle: "2020 Chevy Silverado",
    status: "In progress",
    message: "Technician is reviewing the reported issue.",
    time: "10:40 AM",
    proof: "Inspection note attached",
    nextStep: "Approval update",
  },
  {
    id: "TC-DEMO-103",
    label: "Test Customer",
    vehicle: "2016 Toyota Camry",
    status: "Ready soon",
    message: "Service is finishing up. Pickup update coming shortly.",
    time: "11:25 AM",
    proof: "Completion proof pending",
    nextStep: "Pickup notice",
  },
];

function PublicJobCard({
  job,
  onOpen,
}: {
  job: PublicJob;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] p-5 text-left transition hover:border-emerald-300/30 hover:bg-white/[0.06]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
            {job.id}
          </div>
          <h2 className="mt-2 text-lg font-black">{job.vehicle}</h2>
          <p className="mt-1 text-sm text-white/70">{job.label}</p>
          <p className="mt-1 text-xs text-white/40">{job.time}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <div className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[11px] font-black text-emerald-100">
            {job.status}
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs leading-5 text-white/65">
        {job.message}
      </p>
    </button>
  );
}

export default function TaylorCreekPublicDemoBoard() {
  const [selected, setSelected] = useState<PublicJob | null>(publicJobs[0]);

  return (
    <main className="min-h-screen bg-[#050816] px-5 py-8 text-white">
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
              Taylor Creek Live Board
            </p>
            <h1 className="mt-3 text-3xl font-black">
              Customer-safe demo view
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Safe duplicate with sample data only. Customers can see job progress
              without exposing phone numbers, emails, addresses, payments, or internal notes.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                Active
              </div>
              <div className="mt-2 text-3xl font-black">3</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                In progress
              </div>
              <div className="mt-2 text-3xl font-black">1</div>
            </div>
            <div className="rounded-[22px] border border-emerald-300/20 bg-emerald-300/10 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-100/70">
                Live updates
              </div>
              <div className="mt-2 text-3xl font-black">On</div>
            </div>
          </div>

          <div className="grid gap-4">
            {publicJobs.map((job) => (
              <PublicJobCard
                key={job.id}
                job={job}
                onOpen={() => setSelected(job)}
              />
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 lg:sticky lg:top-6 lg:h-fit">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
            Status Details
          </p>

          {selected ? (
            <>
              <h2 className="mt-3 text-2xl font-black">{selected.vehicle}</h2>
              <p className="mt-1 text-sm text-white/60">{selected.label}</p>

              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Current status
                  </div>
                  <div className="mt-1 font-bold text-emerald-200">
                    {selected.status}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Public update
                  </div>
                  <div className="mt-1 text-white/75">{selected.message}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/35">
                    Proof
                  </div>
                  <div className="mt-1 text-white/75">{selected.proof}</div>
                </div>

                <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-emerald-100/60">
                    Next step
                  </div>
                  <div className="mt-1 font-bold text-emerald-100">
                    {selected.nextStep}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-white/50">Select a card.</p>
          )}
        </aside>
      </section>
    </main>
  );
}
