import { useMemo, useState } from "react";
import { hpEvent } from "../lib/hpEvent";

type JobStatus = "scheduled" | "in-progress" | "done";

type Job = {
  id: string;
  client: string;
  service: string;
  time: string;
  location: string;
  notes: string;
  status: JobStatus;
  paid: boolean;
};

type JobForm = Omit<Job, "id">;

type BoardTemplate = {
  businessName?: string;
  phone?: string;
  serviceArea?: string;
  payment?: {
    cashApp?: string;
    zelle?: string;
  };
  sampleJobs?: Array<Omit<Job, "id">>;
};

type BoardProps = {
  template?: BoardTemplate;
};

const FALLBACK_BUSINESS_NAME = "Only The Essentials Cleaning LLC";
const FALLBACK_BUSINESS_PHONE = "863-801-3179";
const FALLBACK_SERVICE_AREA = "Okeechobee & surrounding areas";
const FALLBACK_CASH_APP_CASHTAG = "$OnlyTheEssentials";
const FALLBACK_ZELLE_CONTACT = "863-801-3179";

const EMPTY_FORM: JobForm = {
  client: "",
  service: "",
  time: "",
  location: "",
  notes: "",
  status: "scheduled",
  paid: false,
};

const INITIAL_JOBS: Job[] = [
  {
    id: "job-1",
    client: "Mrs. Johnson",
    service: "Residential Cleaning",
    time: "9:00 AM",
    location: "Taylor Creek",
    notes: "Dog inside, friendly. Focus kitchen and floors.",
    status: "scheduled",
    paid: false,
  },
  {
    id: "job-2",
    client: "Lakeview Airbnb",
    service: "Move-In / Move-Out Clean",
    time: "11:30 AM",
    location: "Lakeview Estates",
    notes: "Key under mat. Focus bathrooms, fridge, and floors.",
    status: "scheduled",
    paid: false,
  },
  {
    id: "job-3",
    client: "Martinez Family",
    service: "Deep Clean",
    time: "2:00 PM",
    location: "Okeechobee Blvd",
    notes: "First-time client. Extra attention to baseboards.",
    status: "scheduled",
    paid: false,
  },
  {
    id: "job-4",
    client: "Mr. Daniels",
    service: "Exterior Light Cleaning",
    time: "8:12 AM",
    location: "Riverside Dr",
    notes: "Patio, entryway, and driveway rinse.",
    status: "in-progress",
    paid: false,
  },
  {
    id: "job-5",
    client: "Sarah K.",
    service: "Residential Cleaning",
    time: "7:45 AM",
    location: "Okeechobee",
    notes: "Completed morning clean.",
    status: "done",
    paid: true,
  },
];

const STATUS_TABS: Array<{ key: JobStatus; label: string }> = [
  { key: "scheduled", label: "Scheduled" },
  { key: "in-progress", label: "Active" },
  { key: "done", label: "Done" },
];

function statusClasses(status: JobStatus) {
  if (status === "scheduled") return "border-white/14 bg-white/5";
  if (status === "in-progress") {
    return "border-pink-300/30 bg-pink-400/10 shadow-[0_0_30px_rgba(244,114,182,0.12)]";
  }
  return "border-emerald-300/24 bg-emerald-400/10";
}

function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}

function smsHref(phone: string) {
  return `sms:${phone.replace(/\D/g, "")}`;
}

function makeId() {
  return `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function buildPaymentMemo(job: Job, businessName: string) {
  return `${businessName} - ${job.service} - ${job.client}`;
}

function buildCashAppUrl(job: Job, cashAppCashtag: string, businessName: string) {
  const cashtag = cashAppCashtag.replace("$", "");
  const params = new URLSearchParams();
  params.set("note", buildPaymentMemo(job, businessName));
  return `https://cash.app/$${cashtag}?${params.toString()}`;
}

function buildQrImageUrl(data: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(data)}`;
}

function buildTemplateJobs(template?: BoardTemplate): Job[] {
  if (!template?.sampleJobs?.length) return INITIAL_JOBS;

  return template.sampleJobs.map((job, index) => ({
    id: `template-job-${index + 1}`,
    client: job.client,
    service: job.service,
    time: job.time,
    location: job.location,
    notes: job.notes,
    status: job.status,
    paid: job.paid,
  }));
}

export default function OnlyTheEssentialsBoard({ template }: BoardProps) {
  const businessName = template?.businessName || FALLBACK_BUSINESS_NAME;
  const businessPhone = template?.phone || FALLBACK_BUSINESS_PHONE;
  const serviceArea = template?.serviceArea || FALLBACK_SERVICE_AREA;
  const cashAppCashtag = template?.payment?.cashApp || FALLBACK_CASH_APP_CASHTAG;
  const zelleContact = template?.payment?.zelle || FALLBACK_ZELLE_CONTACT;

  const [jobs, setJobs] = useState<Job[]>(() => buildTemplateJobs(template));
  const [activeTab, setActiveTab] = useState<JobStatus>("scheduled");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobForm>(EMPTY_FORM);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const selectedJob = selectedJobId
    ? jobs.find((job) => job.id === selectedJobId) ?? null
    : null;

  const counts = useMemo(() => {
    return {
      scheduled: jobs.filter((job) => job.status === "scheduled").length,
      inProgress: jobs.filter((job) => job.status === "in-progress").length,
      done: jobs.filter((job) => job.status === "done").length,
      unpaid: jobs.filter((job) => !job.paid).length,
    };
  }, [jobs]);

  function jobsByStatus(status: JobStatus) {
    return jobs.filter((job) => job.status === status);
  }

  function updateForm(field: keyof JobForm, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openAddForm(status: JobStatus = "scheduled") {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, status });
    setShowForm(true);
  }

  function openEditForm(job: Job) {
    setEditingId(job.id);
    setForm({
      client: job.client,
      service: job.service,
      time: job.time,
      location: job.location,
      notes: job.notes,
      status: job.status,
      paid: job.paid,
    });
    setShowForm(true);
  }

  function closeForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  function saveJob() {
    if (!form.client.trim() || !form.service.trim()) {
      alert("Add at least a client name and service.");
      return;
    }

    if (editingId) {
      setJobs((current) =>
        current.map((job) =>
          job.id === editingId
            ? {
                ...job,
                client: form.client.trim(),
                service: form.service.trim(),
                time: form.time.trim(),
                location: form.location.trim(),
                notes: form.notes.trim(),
                status: form.status,
                paid: form.paid,
              }
            : job,
        ),
      );
    } else {
      setJobs((current) => [
        {
          id: makeId(),
          client: form.client.trim(),
          service: form.service.trim(),
          time: form.time.trim(),
          location: form.location.trim(),
          notes: form.notes.trim(),
          status: form.status,
          paid: form.paid,
        },
        ...current,
      ]);
      setActiveTab(form.status);
    }

    closeForm();
  }

  function updateJobStatus(jobId: string, status: JobStatus) {
    setJobs((current) =>
      current.map((job) => (job.id === jobId ? { ...job, status } : job)),
    );
  }

  function togglePaid(jobId: string) {
    setJobs((current) =>
      current.map((job) =>
        job.id === jobId ? { ...job, paid: !job.paid } : job,
      ),
    );
  }

  function deleteJob(jobId: string) {
    const confirmed = window.confirm("Delete this job from the board?");
    if (!confirmed) return;

    setJobs((current) => current.filter((job) => job.id !== jobId));
    if (selectedJobId === jobId) setSelectedJobId(null);
  }

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      alert("Copied.");
    } catch {
      alert("Could not copy.");
    }
  }

  function renderJob(job: Job) {
    return (
      <div
        key={job.id}
        onClick={() => setSelectedJobId(job.id)}
        className={`cursor-pointer rounded-[24px] border p-4 transition hover:scale-[1.01] ${statusClasses(job.status)}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-white">{job.client}</div>
            <div className="mt-1 text-sm font-semibold text-pink-100">{job.service}</div>
          </div>

          <div className="rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
            {job.paid ? "Paid" : "Not paid"}
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm text-white/70">
          <div><span className="text-white/45">Time:</span> {job.time || "Not set"}</div>
          <div><span className="text-white/45">Area:</span> {job.location || "Not set"}</div>
          <div><span className="text-white/45">Notes:</span> {job.notes || "No notes yet."}</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedJobId(job.id); }} className="rounded-xl border border-pink-300/25 bg-pink-400/10 px-3 py-2 text-xs font-semibold text-pink-100">
            Open
          </button>

          {job.status === "scheduled" ? (
            <button type="button" onClick={(e) => { e.stopPropagation(); updateJobStatus(job.id, "in-progress"); }} className="rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-black">
              Start Job
            </button>
          ) : null}

          {job.status === "in-progress" ? (
            <button type="button" onClick={(e) => { e.stopPropagation(); updateJobStatus(job.id, "done"); }} className="rounded-xl border border-emerald-300/25 bg-emerald-400/15 px-3 py-2 text-xs font-semibold text-emerald-100">
              Mark Done
            </button>
          ) : null}

          <button type="button" onClick={(e) => { e.stopPropagation(); togglePaid(job.id); }} className="rounded-xl border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-100">
            {job.paid ? "Mark Unpaid" : "Mark Paid"}
          </button>

          <button type="button" onClick={(e) => { e.stopPropagation(); openEditForm(job); }} className="rounded-xl border border-white/15 bg-white/8 px-3 py-2 text-xs font-semibold text-white/85">
            Edit
          </button>

          <button type="button" onClick={(e) => { e.stopPropagation(); deleteJob(job.id); }} className="rounded-xl border border-rose-300/25 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-100">
            Delete
          </button>
        </div>
      </div>
    );
  }

  function renderColumn(status: JobStatus, title: string, subtitle: string, count: number) {
    return (
      <section className="rounded-[30px] border border-white/12 bg-white/5 p-4">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-black">{title}</h2>
            <p className="text-sm text-white/55">{subtitle}</p>
          </div>
          <span className="rounded-full bg-pink-400/12 px-3 py-1 text-xs font-semibold text-pink-100">
            {count}
          </span>
        </div>

        <div className="space-y-4">
          {jobsByStatus(status).map(renderJob)}
          {jobsByStatus(status).length === 0 ? (
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-5 text-sm text-white/50">
              No jobs here yet.
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_8%,rgba(244,114,182,0.16),transparent_28%),radial-gradient(circle_at_88%_12%,rgba(250,204,21,0.10),transparent_26%),#050509] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
<header className="rounded-[32px] border border-pink-200/18 bg-[linear-gradient(135deg,rgba(244,114,182,0.13),rgba(255,255,255,0.045)_42%,rgba(250,204,21,0.06))] p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-pink-300/30 bg-pink-400/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-pink-100">
                Live Cleaning Board
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
                {businessName}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
                Detail-oriented, reliable, professional. A simple daily board for residential cleaning,
                deep cleans, move-out cleans, exterior light cleaning, and pool cleaning services.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                

                <a
                  href="/planet/only-the-essentials"
                  className="rounded-2xl border border-white/15 bg-white/90 px-5 py-3 text-sm font-bold text-black shadow-sm hover:bg-white/95"
                >
                  Open Customer Page
                </a>

                <a
                  href="/planet/demo/only-the-essentials/messages"
                  className="rounded-2xl border border-pink-300/40 bg-pink-500/20 px-5 py-3 text-sm font-bold text-pink-50 shadow-sm hover:bg-pink-500/30"
                >
                  Customer Requests
                </a>

                <a
                  href="/planet/demo/events?board=only-the-essentials"
                  className="rounded-2xl border border-cyan-300/35 bg-cyan-500/12 px-5 py-3 text-sm font-bold text-cyan-50 shadow-sm hover:bg-cyan-500/18"
                >
                  Live Reporting
                </a>
                <span className="rounded-full border border-white/12 bg-black/25 px-3 py-1 text-white/78">
                  Serving {serviceArea}
                </span>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:min-w-[520px]">
              <div className="rounded-2xl border border-white/12 bg-black/25 p-4">
                <div className="text-2xl font-black">{jobs.length}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-white/50">Jobs today</div>
              </div>
              <div className="rounded-2xl border border-pink-300/18 bg-pink-400/10 p-4">
                <div className="text-2xl font-black">{counts.scheduled}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-white/50">Scheduled</div>
              </div>
              <div className="rounded-2xl border border-amber-300/18 bg-amber-300/10 p-4">
                <div className="text-2xl font-black">{counts.inProgress}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-white/50">Active</div>
              </div>
              <div className="rounded-2xl border border-emerald-300/18 bg-emerald-400/10 p-4">
                <div className="text-2xl font-black">{counts.done}</div>
                <div className="text-xs uppercase tracking-[0.16em] text-white/50">Done</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              openAddForm("scheduled");
              hpEvent({ event: "job_form_opened", board: "only-the-essentials" });
            }}
            className="mt-5 w-full rounded-2xl bg-white/90 px-4 py-3 text-sm font-bold text-black sm:w-auto"
          >
            + Add New Job
          </button>
        </header>

        <div className="sticky top-0 z-20 mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/70 p-2 backdrop-blur-md lg:hidden">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-xl px-3 py-3 text-xs font-bold ${
                activeTab === tab.key
                  ? "bg-pink-400/18 text-pink-100"
                  : "text-white/55"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="mt-5 lg:hidden">
          {activeTab === "scheduled"
            ? renderColumn("scheduled", "Scheduled", "Booked and waiting.", counts.scheduled)
            : null}
          {activeTab === "in-progress"
            ? renderColumn("in-progress", "In Progress", "Currently being handled.", counts.inProgress)
            : null}
          {activeTab === "done"
            ? renderColumn("done", "Done", "Finished and ready.", counts.done)
            : null}
        </section>

        <section className="mt-5 hidden gap-5 lg:grid lg:grid-cols-3">
          {renderColumn("scheduled", "Scheduled", "Booked and waiting.", counts.scheduled)}
          {renderColumn("in-progress", "In Progress", "Currently being handled.", counts.inProgress)}
          {renderColumn("done", "Done", "Finished and ready.", counts.done)}
        </section>

        {selectedJob ? (
          <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm">
            <div className="ml-auto flex h-full max-w-xl flex-col overflow-hidden rounded-[30px] border border-pink-300/20 bg-[#10080d] shadow-2xl">
<div className="border-b border-white/10 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.22em] text-pink-200">
                      Job Command Drawer
                    </div>
                    <h2 className="mt-1 text-3xl font-black">{selectedJob.client}</h2>
                    <p className="mt-1 text-sm font-semibold text-pink-100">{selectedJob.service}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedJobId(null)}
                    className="rounded-xl border border-white/15 px-3 py-2 text-sm text-white/80"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/45">Time</div>
                    <div className="mt-1 font-bold">{selectedJob.time || "Not set"}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/45">Area</div>
                    <div className="mt-1 font-bold">{selectedJob.location || "Not set"}</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-pink-300/20 bg-pink-400/10 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-pink-200">
                    Needs Attention
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-white/82">
                    <div>⏰ Upcoming job time: {selectedJob.time || "time not set"}</div>
                    <div>📩 Reschedule note: watch for client text updates before heading out.</div>
                    <div>🧼 Supply note: check Windex / towels before the next house.</div>
                    <div>🧴 Route note: exterior or pool jobs may need extra chlorine or cleaner.</div>
                    <div>📊 Weekly note: {counts.done} completed jobs on this board so far.</div>
                    <div>Laundry opportunity: towels / linens could be sent to Taylor Creek Laundry.
                    {/* HOMEPLANET: LAUNDRY CONNECTION � future: trigger nearby laundry pickup driver notification based on job status/location */}</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                    Job Notes
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {selectedJob.notes || "No notes yet."}
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">
                    Payment Layer
                  </div>
                  <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/75">
                    Memo: <span className="font-bold text-white">{buildPaymentMemo(selectedJob, businessName)}</span>
                    <br />
                    Cash App: <span className="font-bold text-white">{cashAppCashtag}</span>
                    <br />
                    Zelle: <span className="font-bold text-white">{zelleContact}</span>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <img
                      src={buildQrImageUrl(buildCashAppUrl(selectedJob, cashAppCashtag, businessName))}
                      alt="Payment QR"
                      className="h-36 w-36 rounded-2xl border border-white/10 bg-white/90 p-2"
                    />
                    <div className="flex flex-1 flex-col gap-2">
                      <a
                        href={buildCashAppUrl(selectedJob, cashAppCashtag, businessName)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl bg-cyan-300 px-4 py-3 text-center text-sm font-bold text-black"
                      >
                        Open Cash App
                      </a>
                      <button
                        type="button"
                        onClick={() => copyText(buildPaymentMemo(selectedJob, businessName))}
                        className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/85"
                      >
                        Copy Memo
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePaid(selectedJob.id)}
                        className="rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-100"
                      >
                        {selectedJob.paid ? "Mark Unpaid" : "Mark Paid"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <a href={telHref(businessPhone)} className="rounded-xl border border-pink-300/25 bg-pink-400/10 px-4 py-3 text-center text-sm font-bold text-pink-100">
                    Call
                  </a>
                  <a href={smsHref(businessPhone)} className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-4 py-3 text-center text-sm font-bold text-cyan-100">
                    Text
                  </a>
                  <button type="button" onClick={() => openEditForm(selectedJob)} className="rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white/85">
                    Edit Job
                  </button>
                  <button type="button" onClick={() => deleteJob(selectedJob.id)} className="rounded-xl border border-rose-300/25 bg-rose-400/10 px-4 py-3 text-sm font-bold text-rose-100">
                    Delete Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {showForm ? (
          <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm">
            <div className="mx-auto max-w-2xl rounded-[28px] border border-pink-300/20 bg-[#10080d] p-5 shadow-2xl">
<div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-pink-200">
                    {editingId ? "Edit Job" : "Add New Job"}
                  </div>
                  <h2 className="mt-1 text-2xl font-black">
                    {editingId ? "Update cleaning job" : "Create cleaning job"}
                  </h2>
                </div>
                <button type="button" onClick={closeForm} className="rounded-xl border border-white/15 px-3 py-2 text-sm text-white/80">
                  Close
                </button>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <input value={form.client} onChange={(e) => updateForm("client", e.target.value)} placeholder="Client name" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none" />
                <input value={form.service} onChange={(e) => updateForm("service", e.target.value)} placeholder="Service type" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none" />
                <input value={form.time} onChange={(e) => updateForm("time", e.target.value)} placeholder="Time" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none" />
                <input value={form.location} onChange={(e) => updateForm("location", e.target.value)} placeholder="Area / location" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none" />

                <select value={form.status} onChange={(e) => updateForm("status", e.target.value as JobStatus)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none">
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <select value={form.paid ? "paid" : "unpaid"} onChange={(e) => updateForm("paid", e.target.value === "paid")} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none">
                  <option value="unpaid">Not paid</option>
                  <option value="paid">Paid</option>
                </select>

                <textarea value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} placeholder="Notes" className="min-h-[110px] rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none sm:col-span-2" />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={saveJob} className="rounded-xl bg-white/90 px-5 py-3 text-sm font-bold text-black">
                  Save Job
                </button>
                <button type="button" onClick={closeForm} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold text-white/80">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

















