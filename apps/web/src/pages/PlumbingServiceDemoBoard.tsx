import { useEffect, useMemo, useState } from "react";

type BoardColumn = "Incoming" | "Scheduled" | "On Site" | "Completed";
type PaymentStatus = "Not Sent" | "Invoice Sent" | "Paid";

type PlumbingJob = {
  id: number;
  column: BoardColumn;
  title: string;
  customer: string;
  phone: string;
  address: string;
  serviceType: string;
  scheduledFor: string;
  tech: string;
  issueStatus: string;
  notes: string;
  partsNeeded: string;
  waterShutoff: string;
  onRoute: boolean;
  needsAttention: boolean;
  attentionNote: string;
  checklist: {
    diagnose: boolean;
    shutoff: boolean;
    repair: boolean;
    test: boolean;
    cleanup: boolean;
    photo: boolean;
  };
  paymentStatus: PaymentStatus;
  timeline: string[];
};

const STORAGE_KEY = "plumbing-service-operational-demo-v1";
const COLUMNS: BoardColumn[] = ["Incoming", "Scheduled", "On Site", "Completed"];

const emptyChecklist = {
  diagnose: false,
  shutoff: false,
  repair: false,
  test: false,
  cleanup: false,
  photo: false,
};

function stamp() {
  return new Date().toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const seedJobs: PlumbingJob[] = [
  {
    id: 1,
    column: "Incoming",
    title: "Water Heater Issue",
    customer: "Maria S.",
    phone: "863-555-0198",
    address: "Taylor Creek area",
    serviceType: "Water heater",
    scheduledFor: "Needs scheduling",
    tech: "Unassigned",
    issueStatus: "No hot water",
    notes: "Customer says water heater stopped working this morning. Needs diagnosis and quote.",
    partsNeeded: "Unknown",
    waterShutoff: "Not needed yet",
    onRoute: false,
    needsAttention: true,
    attentionNote: "Customer needs same-day callback if possible.",
    checklist: emptyChecklist,
    paymentStatus: "Not Sent",
    timeline: ["Request captured — Today, 8:42 AM"],
  },
  {
    id: 2,
    column: "Scheduled",
    title: "Kitchen Sink Leak",
    customer: "Kevin R.",
    phone: "863-555-0144",
    address: "Okeechobee",
    serviceType: "Leak repair",
    scheduledFor: "Today, 11:00 AM",
    tech: "Chris",
    issueStatus: "Active leak under sink",
    notes: "Possible supply line or trap leak. Customer placed towel under cabinet.",
    partsNeeded: "Supply line / trap kit possible",
    waterShutoff: "Customer can shut off cabinet valve",
    onRoute: false,
    needsAttention: false,
    attentionNote: "",
    checklist: emptyChecklist,
    paymentStatus: "Invoice Sent",
    timeline: ["Request captured", "Scheduled for Today, 11:00 AM"],
  },
  {
    id: 3,
    column: "On Site",
    title: "Drain Cleaning",
    customer: "Danielle P.",
    phone: "863-555-0122",
    address: "Treasure Island",
    serviceType: "Drain cleaning",
    scheduledFor: "Today, 1:30 PM",
    tech: "Alex",
    issueStatus: "Slow main drain",
    notes: "Tech on site. Customer reports slow drains in both bathrooms.",
    partsNeeded: "Cable machine / camera if needed",
    waterShutoff: "Not required",
    onRoute: false,
    needsAttention: false,
    attentionNote: "",
    checklist: {
      diagnose: true,
      shutoff: false,
      repair: true,
      test: false,
      cleanup: false,
      photo: false,
    },
    paymentStatus: "Not Sent",
    timeline: ["Request captured", "Tech arrived on site", "Drain line inspection started"],
  },
];

export default function PlumbingServiceDemoBoard() {
  const [jobs, setJobs] = useState<PlumbingJob[]>([]);
  const [selected, setSelected] = useState<PlumbingJob | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setJobs(JSON.parse(stored));
    } else {
      setJobs(seedJobs);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedJobs));
    }
  }, []);

  function save(next: PlumbingJob[]) {
    setJobs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function updateJob(updated: PlumbingJob) {
    const next = jobs.map((job) => (job.id === updated.id ? updated : job));
    save(next);
    setSelected(updated);
  }

  function logAction(label: string, patch?: Partial<PlumbingJob>) {
    if (!selected) return;

    const updated: PlumbingJob = {
      ...selected,
      ...patch,
      timeline: [`${label} — ${stamp()}`, ...selected.timeline],
    };

    updateJob(updated);
  }

  function addDemoJob() {
    const fresh: PlumbingJob = {
      id: Date.now(),
      column: "Incoming",
      title: "New Plumbing Request",
      customer: "Demo Customer",
      phone: "863-555-0100",
      address: "Okeechobee area",
      serviceType: "Plumbing repair",
      scheduledFor: "Needs scheduling",
      tech: "Unassigned",
      issueStatus: "Needs diagnosis",
      notes: "New customer request. Open this card to schedule, assign tech, log service, and complete.",
      partsNeeded: "Unknown",
      waterShutoff: "Unknown",
      onRoute: false,
      needsAttention: false,
      attentionNote: "",
      checklist: emptyChecklist,
      paymentStatus: "Not Sent",
      timeline: [`Request captured — ${stamp()}`],
    };

    save([fresh, ...jobs]);
    setSelected(fresh);
  }

  function resetDemo() {
    save(seedJobs);
    setSelected(null);
  }

  const counts = useMemo(() => {
    return COLUMNS.reduce<Record<BoardColumn, number>>(
      (acc, column) => {
        acc[column] = jobs.filter((job) => job.column === column).length;
        return acc;
      },
      { Incoming: 0, Scheduled: 0, "On Site": 0, Completed: 0 }
    );
  }, [jobs]);

  const needsAttentionCount = jobs.filter((job) => job.needsAttention).length;
  const onRouteCount = jobs.filter((job) => job.onRoute).length;

  function checklistCount(job: PlumbingJob) {
    return Object.values(job.checklist).filter(Boolean).length;
  }

  return (
    <main className="min-h-screen bg-[#071426] px-6 py-8 text-white">
      <section className="mx-auto max-w-[1500px]">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-[#37c9f4] px-4 py-1 text-sm font-black text-[#071426]">
              SAFE PLUMBING SERVICE DEMO
            </div>
            <h1 className="text-4xl font-black md:text-5xl">Plumbing Operations Board</h1>
            <p className="mt-2 max-w-3xl text-slate-300">
              Incoming requests, scheduling, route status, on-site work, parts, invoices, and proof timeline in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={addDemoJob} className="rounded-full bg-[#37c9f4] px-5 py-3 font-black text-[#071426] hover:bg-[#6edcff]">
              + Add Request
            </button>
            <button onClick={resetDemo} className="rounded-full border border-white/30 px-5 py-3 font-bold hover:bg-white/10">
              Reset Demo
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-slate-400">Open Jobs</p>
            <p className="mt-1 text-3xl font-black">{jobs.filter((j) => j.column !== "Completed").length}</p>
          </div>
          <div className="rounded-3xl border border-orange-300/30 bg-orange-300/10 p-4">
            <p className="text-sm font-bold text-orange-100">Needs Attention</p>
            <p className="mt-1 text-3xl font-black">{needsAttentionCount}</p>
          </div>
          <div className="rounded-3xl border border-[#37c9f4]/30 bg-[#37c9f4]/10 p-4">
            <p className="text-sm font-bold text-cyan-100">On Route</p>
            <p className="mt-1 text-3xl font-black">{onRouteCount}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-slate-400">Invoices Paid</p>
            <p className="mt-1 text-3xl font-black">{jobs.filter((j) => j.paymentStatus === "Paid").length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-bold text-slate-400">Completed</p>
            <p className="mt-1 text-3xl font-black">{counts.Completed}</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          {COLUMNS.map((column) => (
            <section key={column} className="min-h-[560px] rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-black">{column}</h2>
                <span className="rounded-full bg-[#37c9f4]/20 px-3 py-1 text-xs font-black text-cyan-100">{counts[column]}</span>
              </div>

              <div className="space-y-3">
                {jobs.filter((job) => job.column === column).map((job) => (
                  <button
                    key={job.id}
                    onClick={() => setSelected(job)}
                    className={[
                      "w-full rounded-2xl bg-white p-4 text-left text-[#071426] shadow-xl transition hover:-translate-y-1 hover:shadow-2xl",
                      job.needsAttention ? "ring-4 ring-orange-300" : "",
                    ].join(" ")}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#37c9f4]/20 px-3 py-1 text-xs font-black text-[#07516a]">{job.serviceType}</span>
                      {job.onRoute && <span className="rounded-full bg-[#071426] px-3 py-1 text-xs font-black text-white">On Route</span>}
                      {job.needsAttention && <span className="rounded-full bg-orange-200 px-3 py-1 text-xs font-black text-orange-950">Needs Attention</span>}
                    </div>

                    <h3 className="mt-3 text-xl font-black">{job.title}</h3>
                    <p className="mt-1 text-sm font-bold text-slate-700">{job.customer}</p>
                    <p className="mt-1 text-xs text-slate-500">{job.scheduledFor}</p>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-xl bg-slate-100 p-2"><p className="font-black">Tech</p><p>{job.tech}</p></div>
                      <div className="rounded-xl bg-slate-100 p-2"><p className="font-black">List</p><p>{checklistCount(job)}/6</p></div>
                      <div className="rounded-xl bg-slate-100 p-2"><p className="font-black">Pay</p><p>{job.paymentStatus}</p></div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">{job.notes}</p>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 p-4">
          <aside className="h-full w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 text-[#071426] shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="rounded-full bg-[#37c9f4]/20 px-3 py-1 text-xs font-black text-[#07516a]">LIVE JOB DETAIL</div>
                <h2 className="mt-3 text-3xl font-black">{selected.title}</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{selected.customer} · {selected.phone}</p>
              </div>

              <button onClick={() => setSelected(null)} className="rounded-full border px-4 py-2 font-black">Close</button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-2">
              <button
                onClick={() => logAction(selected.onRoute ? "Route status cleared" : "Tech marked on route", { onRoute: !selected.onRoute })}
                className={["rounded-2xl px-4 py-3 font-black", selected.onRoute ? "bg-[#071426] text-white" : "bg-[#37c9f4]/20 text-[#07516a]"].join(" ")}
              >
                {selected.onRoute ? "On Route Active" : "Mark On Route"}
              </button>

              <button
                onClick={() => logAction(selected.needsAttention ? "Attention flag cleared" : "Attention flag added", { needsAttention: !selected.needsAttention })}
                className={["rounded-2xl px-4 py-3 font-black", selected.needsAttention ? "bg-orange-300 text-orange-950" : "bg-slate-100 text-[#071426]"].join(" ")}
              >
                {selected.needsAttention ? "Needs Attention Active" : "Flag Needs Attention"}
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-black">Board Column
                <select value={selected.column} onChange={(e) => logAction(`Moved to ${e.target.value}`, { column: e.target.value as BoardColumn })} className="mt-1 w-full rounded-xl border bg-white p-3 font-bold">
                  {COLUMNS.map((column) => <option key={column} value={column}>{column}</option>)}
                </select>
              </label>

              <label className="text-sm font-black">Payment
                <select value={selected.paymentStatus} onChange={(e) => logAction(`Payment updated to ${e.target.value}`, { paymentStatus: e.target.value as PaymentStatus })} className="mt-1 w-full rounded-xl border bg-white p-3 font-bold">
                  <option>Not Sent</option><option>Invoice Sent</option><option>Paid</option>
                </select>
              </label>

              <label className="text-sm font-black">Scheduled For
                <input value={selected.scheduledFor} onChange={(e) => updateJob({ ...selected, scheduledFor: e.target.value })} className="mt-1 w-full rounded-xl border p-3 font-normal" />
              </label>

              <label className="text-sm font-black">Assigned Tech
                <input value={selected.tech} onChange={(e) => updateJob({ ...selected, tech: e.target.value })} className="mt-1 w-full rounded-xl border p-3 font-normal" />
              </label>

              <label className="text-sm font-black">Service Type
                <input value={selected.serviceType} onChange={(e) => updateJob({ ...selected, serviceType: e.target.value })} className="mt-1 w-full rounded-xl border p-3 font-normal" />
              </label>

              <label className="text-sm font-black">Issue Status
                <input value={selected.issueStatus} onChange={(e) => updateJob({ ...selected, issueStatus: e.target.value })} className="mt-1 w-full rounded-xl border p-3 font-normal" />
              </label>

              <label className="text-sm font-black">Parts Needed
                <input value={selected.partsNeeded} onChange={(e) => updateJob({ ...selected, partsNeeded: e.target.value })} className="mt-1 w-full rounded-xl border p-3 font-normal" />
              </label>

              <label className="text-sm font-black">Water Shutoff
                <input value={selected.waterShutoff} onChange={(e) => updateJob({ ...selected, waterShutoff: e.target.value })} className="mt-1 w-full rounded-xl border p-3 font-normal" />
              </label>
            </div>

            {selected.needsAttention && (
              <label className="mt-4 block text-sm font-black">Attention Note
                <input value={selected.attentionNote} onChange={(e) => updateJob({ ...selected, attentionNote: e.target.value })} className="mt-1 w-full rounded-xl border border-orange-300 bg-orange-50 p-3 font-normal" />
              </label>
            )}

            <label className="mt-4 block text-sm font-black">Address / Area
              <input value={selected.address} onChange={(e) => updateJob({ ...selected, address: e.target.value })} className="mt-1 w-full rounded-xl border p-3 font-normal" />
            </label>

            <label className="mt-4 block text-sm font-black">Notes
              <textarea value={selected.notes} onChange={(e) => updateJob({ ...selected, notes: e.target.value })} className="mt-1 min-h-28 w-full rounded-xl border p-3 font-normal" />
            </label>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4">
              <h3 className="font-black">Service Checklist</h3>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {Object.entries(selected.checklist).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 rounded-xl bg-white p-3 text-sm font-bold">
                    <input type="checkbox" checked={value} onChange={(e) => logAction(`${key} ${e.target.checked ? "checked" : "unchecked"}`, { checklist: { ...selected.checklist, [key]: e.target.checked } })} />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <button onClick={() => logAction("ETA text sent to customer")} className="rounded-2xl bg-[#071426] px-4 py-3 font-black text-white">Send ETA</button>
              <button onClick={() => logAction("Technician arrived on site", { column: "On Site", onRoute: false })} className="rounded-2xl bg-[#071426] px-4 py-3 font-black text-white">Mark On Site</button>
              <button onClick={() => logAction("Job completed", { column: "Completed", onRoute: false, needsAttention: false, paymentStatus: selected.paymentStatus === "Not Sent" ? "Invoice Sent" : selected.paymentStatus })} className="rounded-2xl bg-[#37c9f4] px-4 py-3 font-black text-[#071426]">Complete Job</button>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-100 p-4">
              <h3 className="font-black">Proof Timeline</h3>
              <div className="mt-3 space-y-2">
                {selected.timeline.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-xl bg-white p-3 text-sm">{item}</div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
