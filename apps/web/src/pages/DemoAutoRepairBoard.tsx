import { useMemo, useRef, useState } from "react";

type RepairStage =
  | "New Intake"
  | "Diagnosing"
  | "Waiting Approval"
  | "In Bay"
  | "Ready for Pickup";

type ProofClip = {
  id: string;
  label: string;
  note: string;
  createdAt: string;
};

type RepairJob = {
  id: string;
  roNumber: string;
  customer: string;
  vehicle: string;
  concern: string;
  stage: RepairStage;
  eta: string;
  advisor: string;
  notes: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: string;
  proof: ProofClip[];
};

type MessageActionCardProps = {
  title: string;
  subtitle: string;
  message: string;
  phone: string;
  onCopy: (label: string, text: string) => void;
};

const STAGES: RepairStage[] = [
  "New Intake",
  "Diagnosing",
  "Waiting Approval",
  "In Bay",
  "Ready for Pickup",
];

const SAMPLE_JOBS: RepairJob[] = [
  {
    id: "demo-1",
    roNumber: "RO-1042",
    customer: "Maria Lopez",
    vehicle: "2018 Honda Accord",
    concern: "AC blowing warm and weak at idle",
    stage: "New Intake",
    eta: "Today 1:30 PM",
    advisor: "Jake",
    notes:
      "Customer says issue gets worse in traffic. Wants quick answer before approving major work.",
    phone: "863-555-0181",
    appointmentDate: "2026-04-10",
    appointmentTime: "13:30",
    createdAt: "2026-04-10T09:12:00.000Z",
    proof: [],
  },
  {
    id: "demo-2",
    roNumber: "RO-1043",
    customer: "James Carter",
    vehicle: "2015 Ford F-150",
    concern: "Brake vibration at highway speed",
    stage: "Diagnosing",
    eta: "Today 2:15 PM",
    advisor: "Tina",
    notes:
      "Road test confirmed front-end shake under braking. Measuring rotors and checking pad wear now.",
    phone: "863-555-0147",
    appointmentDate: "2026-04-10",
    appointmentTime: "14:15",
    createdAt: "2026-04-10T09:34:00.000Z",
    proof: [
      {
        id: "proof-2a",
        label: "Hidden issue found",
        note: "Front rotors showing heat spots and uneven wear.",
        createdAt: "2026-04-10T10:05:00.000Z",
      },
    ],
  },
  {
    id: "demo-3",
    roNumber: "RO-1044",
    customer: "Ashley Nguyen",
    vehicle: "2020 Toyota Camry",
    concern: "Oil leak inspection",
    stage: "Waiting Approval",
    eta: "Waiting on customer reply",
    advisor: "Chris",
    notes:
      "Valve cover seep confirmed. Estimate prepared. Waiting on approval before gasket replacement.",
    phone: "863-555-0199",
    appointmentDate: "2026-04-10",
    appointmentTime: "11:45",
    createdAt: "2026-04-10T08:52:00.000Z",
    proof: [
      {
        id: "proof-3a",
        label: "Hidden issue found",
        note: "Oil residue visible along upper gasket edge.",
        createdAt: "2026-04-10T09:40:00.000Z",
      },
      {
        id: "proof-3b",
        label: "Work in progress",
        note: "Cleaned area and traced source to confirm leak path.",
        createdAt: "2026-04-10T09:51:00.000Z",
      },
    ],
  },
  {
    id: "demo-4",
    roNumber: "RO-1045",
    customer: "Robert Diaz",
    vehicle: "2017 Chevy Malibu",
    concern: "Starter issue / intermittent no-crank",
    stage: "In Bay",
    eta: "Finishing by 4:00 PM",
    advisor: "Megan",
    notes:
      "Voltage tested. Starter replacement underway. Customer approved repair after phone update.",
    phone: "863-555-0124",
    appointmentDate: "2026-04-10",
    appointmentTime: "10:15",
    createdAt: "2026-04-10T08:18:00.000Z",
    proof: [
      {
        id: "proof-4a",
        label: "Safety concern",
        note: "Starter draw was inconsistent and vehicle failed restart test twice.",
        createdAt: "2026-04-10T09:02:00.000Z",
      },
      {
        id: "proof-4b",
        label: "Work in progress",
        note: "Old starter removed. Mounting points and connections cleaned.",
        createdAt: "2026-04-10T10:34:00.000Z",
      },
    ],
  },
  {
    id: "demo-5",
    roNumber: "RO-1046",
    customer: "Danielle Brooks",
    vehicle: "2019 Nissan Rogue",
    concern: "Check engine light / sensor replacement",
    stage: "Ready for Pickup",
    eta: "Ready now",
    advisor: "Luis",
    notes:
      "Sensor replaced and code cleared. Final road test complete. Vehicle ready for customer pickup.",
    phone: "863-555-0168",
    appointmentDate: "2026-04-10",
    appointmentTime: "09:00",
    createdAt: "2026-04-10T07:55:00.000Z",
    proof: [
      {
        id: "proof-5a",
        label: "Hidden issue found",
        note: "Sensor data was dropping out under load.",
        createdAt: "2026-04-10T08:24:00.000Z",
      },
      {
        id: "proof-5b",
        label: "Completed work",
        note: "Replacement installed and system verified on final scan.",
        createdAt: "2026-04-10T10:11:00.000Z",
      },
      {
        id: "proof-5c",
        label: "Completed work",
        note: "Road test complete with no returning fault.",
        createdAt: "2026-04-10T10:26:00.000Z",
      },
    ],
  },
];

function stageTone(stage: string) {
  const normalized = stage.toLowerCase();

  if (normalized.includes("intake")) {
    return "border-sky-400/25 bg-sky-400/10 text-sky-200";
  }

  if (normalized.includes("diagnos")) {
    return "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
  }

  if (normalized.includes("approval")) {
    return "border-amber-400/25 bg-amber-400/10 text-amber-200";
  }

  if (normalized.includes("bay")) {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (normalized.includes("ready")) {
    return "border-indigo-400/25 bg-indigo-400/10 text-indigo-200";
  }

  return "border-white/10 bg-white/5 text-white";
}

function proofStatus(job: RepairJob) {
  const count = job.proof?.length || 0;

  if (count >= 3) {
    return {
      label: "Proof locked",
      tone: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
      dot: "bg-emerald-300",
    };
  }

  if (count >= 1) {
    return {
      label: "Proof started",
      tone: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
      dot: "bg-cyan-300",
    };
  }

  return {
    label: "No proof yet",
    tone: "border-white/10 bg-white/[0.04] text-slate-300",
    dot: "bg-slate-500",
  };
}

function formatAppointment(date: string, time: string) {
  if (!date && !time) return "No appointment set";
  if (date && !time) return date;
  if (!date && time) return time;
  return `${date} at ${time}`;
}

function sanitizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function openTextMessage(phone: string, text: string) {
  const cleanedPhone = sanitizePhone(phone);
  const encoded = encodeURIComponent(text);
  const href = cleanedPhone
    ? `sms:${cleanedPhone}?body=${encoded}`
    : `sms:?body=${encoded}`;
  window.location.href = href;
}

function formatProofDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function buildApprovalMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer}, this is ${businessName}. Your ${job.vehicle} is currently in "${job.stage}". We found: ${job.concern}. Reply here if you want us to move forward with the next step.`;
}

function buildReadyMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer}, your ${job.vehicle} at ${businessName} is ready for pickup.${job.notes ? ` Notes: ${job.notes}` : ""}`;
}

function buildAppointmentMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer}, your appointment with ${businessName} is set for ${formatAppointment(job.appointmentDate, job.appointmentTime)} for ${job.vehicle}.`;
}

function buildStatusMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer}, here is your update from ${businessName}: ${job.vehicle} is currently in "${job.stage}".${job.concern ? ` Need: ${job.concern}.` : ""}${job.eta ? ` ETA: ${job.eta}.` : ""}`;
}

export default function DemoAutoRepairBoard() {
  const [jobs, setJobs] = useState<RepairJob[]>(SAMPLE_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    SAMPLE_JOBS[0]?.id ?? null,
  );
  const [stageMenuOpen, setStageMenuOpen] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [statusNote, setStatusNote] = useState("Demo board loaded");
  const [boardViewMode, setBoardViewMode] = useState<"reveal" | "work">(
    "reveal",
  );
  const [proofCaptureRunningJobId, setProofCaptureRunningJobId] = useState<
    string | null
  >(null);
  const [proofNoteDraft, setProofNoteDraft] = useState("");

  const stageMenuRef = useRef<HTMLDivElement | null>(null);

  const businessName = "Northstar Auto Demo";
  const boardTitle = "Northstar Auto Demo Live Board";
  const city = "Okeechobee Demo Node";
  const presenceId = "HP-DEMOAUTO";
  const boardSlugDisplay = "demo-auto-service-sample";
  const stages = STAGES;

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId],
  );

  const grouped = useMemo(
    () =>
      stages.map((stage) => ({
        stage,
        jobs: jobs.filter((job) => job.stage === stage),
      })),
    [jobs],
  );

  const totals = useMemo(() => {
    return {
      total: jobs.length,
      inProgress: jobs.filter(
        (job) =>
          job.stage !== "New Intake" && job.stage !== "Ready for Pickup",
      ).length,
      ready: jobs.filter((job) => job.stage === "Ready for Pickup").length,
      newIntake: jobs.filter((job) => job.stage === "New Intake").length,
    };
  }, [jobs]);

  function updateLocalSelectedJob<K extends keyof RepairJob>(
    key: K,
    value: RepairJob[K],
  ) {
    if (!selectedJob) return;

    const updatedJobs = jobs.map((job) =>
      job.id === selectedJob.id ? { ...job, [key]: value } : job,
    );

    setJobs(updatedJobs);
    setStatusNote("Demo card updated");
  }

  function addProofClip(label: string, defaultNote = "") {
    if (!selectedJob) return;

    const note = (proofNoteDraft || defaultNote).trim();

    const updatedJobs = jobs.map((job) =>
      job.id === selectedJob.id
        ? {
            ...job,
            proof: [
              {
                id:
                  typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                label,
                note,
                createdAt: new Date().toISOString(),
              },
              ...job.proof,
            ],
          }
        : job,
    );

    setJobs(updatedJobs);
    setProofNoteDraft("");
    setStatusNote("Demo proof captured");
  }

  function clearProofForSelected() {
    if (!selectedJob) return;

    const updatedJobs = jobs.map((job) =>
      job.id === selectedJob.id ? { ...job, proof: [] } : job,
    );

    setJobs(updatedJobs);
    setProofCaptureRunningJobId((current) =>
      current === selectedJob.id ? null : current,
    );
    setStatusNote("Demo proof cleared");
  }

  function startProofCapture() {
    if (!selectedJob) return;
    setProofCaptureRunningJobId(selectedJob.id);
    setStatusNote("Demo capture started");
  }

  function stopProofCapture() {
    if (!selectedJob) return;
    const activeJobId = proofCaptureRunningJobId;
    setProofCaptureRunningJobId(null);

    if (activeJobId === selectedJob.id) {
      addProofClip("Capture stopped", "Demo capture session closed");
    }
  }

  function handleAddJob() {
    const newIndex = jobs.length + 1042;
    const newJob: RepairJob = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      roNumber: `RO-${String(newIndex).padStart(4, "0")}`,
      customer: "Sample Customer",
      vehicle: "2021 Toyota Corolla",
      concern: "Customer concern pending",
      stage: "New Intake",
      eta: "Waiting on advisor",
      advisor: "Front Counter",
      notes: "Demo card. Update details in the drawer.",
      phone: "863-555-0100",
      appointmentDate: "2026-04-10",
      appointmentTime: "15:00",
      createdAt: new Date().toISOString(),
      proof: [],
    };

    const nextJobs = [newJob, ...jobs];
    setJobs(nextJobs);
    setSelectedJobId(newJob.id);
    setStageMenuOpen(false);
    setStatusNote("Demo card created");
  }

  function handleDeleteSelected() {
    if (!selectedJob) return;
    const next = jobs.filter((job) => job.id !== selectedJob.id);
    setJobs(next);
    setSelectedJobId(next[0]?.id ?? null);
    setStageMenuOpen(false);
    setStatusNote("Demo card deleted");
  }

  function handleReload() {
    setJobs(SAMPLE_JOBS);
    setSelectedJobId(SAMPLE_JOBS[0]?.id ?? null);
    setStageMenuOpen(false);
    setProofNoteDraft("");
    setProofCaptureRunningJobId(null);
    setStatusNote("Demo jobs reset");
  }

  async function copyMessage(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(`${label} copied`);
      window.setTimeout(() => setCopiedMessage(""), 1600);
    } catch {
      setCopiedMessage("Copy failed");
      window.setTimeout(() => setCopiedMessage(""), 1600);
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4 rounded-xl border border-cyan-400/20 bg-[#061226] px-4 py-3 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
          <div className="flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-cyan-200">
              <span className="opacity-60">Presence ID:</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 font-mono text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.10)]">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {presenceId}
              </span>
              <button
                type="button"
                onClick={() => void copyMessage("Presence ID", presenceId)}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-100"
              >
                Copy ID
              </button>
              <span className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Demo Safe
              </span>

              <span className="opacity-30">|</span>

              <span className="opacity-60">Slug:</span>
              <span className="font-mono text-cyan-300">{boardSlugDisplay}</span>

              <span className="opacity-30">|</span>

              <span className="opacity-60">Status:</span>
              <span className="font-semibold text-emerald-300">Demo Active</span>
            </div>

            <div className="text-right text-[11px] uppercase tracking-[0.18em] text-white/40">
              Sample data only · safe public demo
            </div>
          </div>
        </div>

        {boardViewMode === "reveal" ? (
          <>
            <div className="mb-6 overflow-hidden rounded-[30px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
              <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-8">
                <div>
                  <div className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                    Auto Repair Demo
                  </div>

                  <h1 className="mt-4 text-3xl font-semibold md:text-5xl">
                    {boardTitle}
                  </h1>

                  <p className="mt-3 max-w-3xl text-base text-slate-300 md:text-lg">
                    Demo-safe version of the live staff board with fake customers,
                    fake vehicles, and real stage flow.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleAddJob}
                      className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                    >
                      + Add Demo Job
                    </button>

                    <button
                      type="button"
                      onClick={handleReload}
                      className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                    >
                      Reset Demo Jobs
                    </button>

                    <button
                      type="button"
                      onClick={() => setBoardViewMode("work")}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                    >
                      Switch to Work Mode
                    </button>
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Demo status
                      </div>
                      <div className="mt-3 text-2xl font-semibold">
                        Board Ready
                      </div>
                    </div>

                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                      {boardViewMode === "reveal" ? "Reveal" : "Work"}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <div>City: {city}</div>
                    <div>
                      Flow: New Intake → Diagnosing → Waiting Approval → In Bay →
                      Ready for Pickup
                    </div>
                    <div>Mode: Demo / Auto Repair</div>
                    <div>Live link: /planet/demo/auto-service-sample</div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50">
                    {statusNote}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 overflow-hidden rounded-[26px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/8 via-slate-900 to-slate-950 shadow-[0_0_50px_rgba(34,211,238,0.10)]">
              <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                      Auto Repair Demo
                    </div>
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-slate-200">
                      {city}
                    </div>
                    <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
                      Demo
                    </div>
                  </div>

                  <h1 className="mt-3 truncate text-2xl font-semibold text-white md:text-3xl">
                    {boardTitle}
                  </h1>

                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-300">
                    <span>
                      New Intake → Diagnosing → Waiting Approval → In Bay → Ready
                      for Pickup
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="truncate">Presence ID {presenceId}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleAddJob}
                    className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                  >
                    + Add Demo Job
                  </button>

                  <button
                    type="button"
                    onClick={handleReload}
                    className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                  >
                    Reset Demo Jobs
                  </button>

                  <button
                    type="button"
                    onClick={() => setBoardViewMode("reveal")}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                  >
                    Reveal View
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard label="Jobs" value={totals.total} />
          <StatCard label="In Progress" value={totals.inProgress} />
          <StatCard label="Ready / Pickup" value={totals.ready} />
          <StatCard label="New Intake" value={totals.newIntake} accent />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[30px] border border-white/10 bg-[#081122] p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Active Flow</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Demo-safe jobs only. Click any card to open the working drawer.
                </p>
              </div>

              <div className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                Demo Staff Board
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {grouped.map((column) => (
                <div
                  key={column.stage}
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold">{column.stage}</h3>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {column.jobs.length}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {column.jobs.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500">
                        Nothing here yet.
                      </div>
                    ) : (
                      column.jobs.map((job) => {
                        const selected = selectedJobId === job.id;

                        return (
                          <button
                            key={job.id}
                            type="button"
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setStageMenuOpen(false);
                            }}
                            className={`w-full rounded-[18px] border p-3 text-left transition ${
                              selected
                                ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_26px_rgba(34,211,238,0.10)]"
                                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                  {job.roNumber}
                                </div>
                                <div className="mt-1 truncate text-base font-semibold text-white">
                                  {job.customer}
                                </div>
                              </div>

                              <div
                                className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${stageTone(
                                  job.stage,
                                )}`}
                              >
                                {job.stage}
                              </div>
                            </div>

                            <div className="mt-2 truncate text-sm font-medium text-slate-200">
                              {job.vehicle}
                            </div>

                            <div className="mt-1 line-clamp-1 text-sm text-slate-400">
                              {job.concern}
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                              <span className="truncate">{job.advisor}</span>
                              <span className="shrink-0">{job.eta}</span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              {job.proof?.length ? (
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/12 px-2.5 py-1 text-[10px] font-semibold text-emerald-100">
                                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                  <span>VERIFIED ({job.proof.length})</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-2.5 py-1 text-[10px] font-semibold text-red-100">
                                  <span className="h-2 w-2 rounded-full bg-red-300" />
                                  <span>NO PROOF</span>
                                </div>
                              )}

                              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                {job.proof?.length || 0} proof
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#081122] p-5">
            {selectedJob ? (
              <>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Work Item
                    </div>
                    <div className="mt-2 text-2xl font-semibold">
                      {selectedJob.roNumber}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      Working drawer
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${proofStatus(selectedJob).dot}`}
                      />
                      <span>{proofStatus(selectedJob).label}</span>
                      <span className="text-violet-200/70">
                        {selectedJob.proof?.length || 0} logged
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJobId(null);
                      setStageMenuOpen(false);
                    }}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-4">
                  <Field label="Customer Name">
                    <input
                      value={selectedJob.customer}
                      onChange={(e) =>
                        updateLocalSelectedJob("customer", e.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                      placeholder="Customer name"
                    />
                  </Field>

                  <Field label="Vehicle / Job">
                    <input
                      value={selectedJob.vehicle}
                      onChange={(e) =>
                        updateLocalSelectedJob("vehicle", e.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                      placeholder="Vehicle"
                    />
                  </Field>

                  <Field label="Concern">
                    <input
                      value={selectedJob.concern}
                      onChange={(e) =>
                        updateLocalSelectedJob("concern", e.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                      placeholder="Concern"
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Stage">
                      <div className="relative" ref={stageMenuRef}>
                        <button
                          type="button"
                          onClick={() => setStageMenuOpen((open) => !open)}
                          className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left outline-none transition hover:border-cyan-400/30"
                        >
                          <span>{selectedJob.stage}</span>
                          <span className="text-slate-400">▾</span>
                        </button>

                        {stageMenuOpen ? (
                          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-2xl border border-white/10 bg-[#0b1730] p-2 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                            {stages.map((stage) => {
                              const active = stage === selectedJob.stage;

                              return (
                                <button
                                  key={stage}
                                  type="button"
                                  onClick={() => {
                                    updateLocalSelectedJob("stage", stage);
                                    setStageMenuOpen(false);
                                  }}
                                  className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition last:mb-0 ${
                                    active
                                      ? "bg-cyan-400/12 text-cyan-100"
                                      : "text-slate-200 hover:bg-white/[0.05]"
                                  }`}
                                >
                                  <span>{stage}</span>
                                  {active ? (
                                    <span className="text-cyan-300">✓</span>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    </Field>

                    <Field label="ETA">
                      <input
                        value={selectedJob.eta}
                        onChange={(e) =>
                          updateLocalSelectedJob("eta", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder="ETA"
                      />
                    </Field>
                  </div>

                  <Field label="Advisor">
                    <input
                      value={selectedJob.advisor}
                      onChange={(e) =>
                        updateLocalSelectedJob("advisor", e.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                      placeholder="Advisor"
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Phone">
                      <input
                        value={selectedJob.phone}
                        onChange={(e) =>
                          updateLocalSelectedJob("phone", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder="863-555-1212"
                      />
                    </Field>

                    <Field label="Appointment Date">
                      <input
                        type="date"
                        value={selectedJob.appointmentDate}
                        onChange={(e) =>
                          updateLocalSelectedJob(
                            "appointmentDate",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                      />
                    </Field>
                  </div>

                  <Field label="Appointment Time">
                    <input
                      type="time"
                      value={selectedJob.appointmentTime}
                      onChange={(e) =>
                        updateLocalSelectedJob(
                          "appointmentTime",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    />
                  </Field>

                  <Field label="Notes">
                    <textarea
                      value={selectedJob.notes}
                      onChange={(e) =>
                        updateLocalSelectedJob("notes", e.target.value)
                      }
                      className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                      placeholder="Notes"
                    />
                  </Field>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Appointment summary
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">
                      {formatAppointment(
                        selectedJob.appointmentDate,
                        selectedJob.appointmentTime,
                      )}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.22em] text-violet-200/70">
                          Proof capture
                        </div>
                        <div className="mt-2 text-sm leading-6 text-violet-50">
                          Demo-safe proof flow. Capture the hidden issue, the work
                          in progress, and the finished result.
                        </div>
                      </div>

                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${proofStatus(
                          selectedJob,
                        ).tone}`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${proofStatus(selectedJob).dot}`}
                        />
                        <span>{proofStatus(selectedJob).label}</span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <button
                        type="button"
                        onClick={startProofCapture}
                        disabled={proofCaptureRunningJobId === selectedJob.id}
                        className="rounded-full border border-violet-300/30 bg-violet-300/15 px-4 py-3 text-sm font-semibold text-violet-50 transition hover:bg-violet-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {proofCaptureRunningJobId === selectedJob.id
                          ? "Capture Running"
                          : "Start Capture"}
                      </button>

                      <button
                        type="button"
                        onClick={stopProofCapture}
                        disabled={proofCaptureRunningJobId !== selectedJob.id}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Stop Capture
                      </button>
                    </div>

                    <div className="mt-4">
                      <label className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        Proof note
                      </label>
                      <textarea
                        value={proofNoteDraft}
                        onChange={(e) => setProofNoteDraft(e.target.value)}
                        className="mt-2 min-h-[88px] w-full rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-3 text-sm outline-none transition focus:border-violet-300/40"
                        placeholder="What did you find, remove, expose, or complete?"
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          addProofClip(
                            "Hidden issue found",
                            "Customer could not see this without teardown or access.",
                          )
                        }
                        className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-400/15"
                      >
                        Hidden Issue
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          addProofClip(
                            "Safety concern",
                            "Immediate attention recommended before continuing.",
                          )
                        }
                        className="rounded-full border border-red-400/25 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-400/15"
                      >
                        Safety
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          addProofClip(
                            "Work in progress",
                            "Active labor, teardown, cleaning, or install in progress.",
                          )
                        }
                        className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                      >
                        In Progress
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          addProofClip(
                            "Completed work",
                            "Finished result verified and ready to show.",
                          )
                        }
                        className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/15"
                      >
                        Completed
                      </button>
                    </div>

                    <div className="mt-4 rounded-[22px] border border-white/10 bg-[#070d1a] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                          Proof timeline
                        </div>

                        <button
                          type="button"
                          onClick={clearProofForSelected}
                          disabled={!selectedJob.proof?.length}
                          className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Clear
                        </button>
                      </div>

                      <div className="mt-3 space-y-2">
                        {selectedJob.proof?.length ? (
                          selectedJob.proof.map((clip) => (
                            <div
                              key={clip.id}
                              className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-semibold text-white">
                                    {clip.label}
                                  </div>
                                  <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                    {formatProofDate(clip.createdAt)}
                                  </div>
                                </div>

                                <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold text-violet-100">
                                  Proof
                                </div>
                              </div>

                              <div className="mt-2 text-sm leading-6 text-slate-300">
                                {clip.note || "No extra note added yet."}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500">
                            No proof moments captured yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                          Quick customer messages
                        </div>
                        <div className="mt-2 text-sm leading-6 text-cyan-50">
                          Text the customer directly or copy the message first.
                        </div>
                      </div>

                      {copiedMessage ? (
                        <div className="rounded-full border border-cyan-400/20 px-3 py-1 text-xs text-cyan-100">
                          {copiedMessage}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-3">
                      <MessageActionCard
                        title="Status update"
                        subtitle="General update to the customer"
                        message={buildStatusMessage(selectedJob, businessName)}
                        phone={selectedJob.phone}
                        onCopy={copyMessage}
                      />

                      <MessageActionCard
                        title="Approval request"
                        subtitle="Ask customer to approve the next step"
                        message={buildApprovalMessage(selectedJob, businessName)}
                        phone={selectedJob.phone}
                        onCopy={copyMessage}
                      />

                      <MessageActionCard
                        title="Appointment confirmation"
                        subtitle="Confirm date and time with the customer"
                        message={buildAppointmentMessage(
                          selectedJob,
                          businessName,
                        )}
                        phone={selectedJob.phone}
                        onCopy={copyMessage}
                      />

                      <MessageActionCard
                        title="Completion message"
                        subtitle="Let the customer know the job is complete"
                        message={buildReadyMessage(selectedJob, businessName)}
                        phone={selectedJob.phone}
                        onCopy={copyMessage}
                      />
                    </div>

                    {!selectedJob.phone ? (
                      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                        Add a customer phone number to enable text buttons.
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                      Demo mode
                    </div>
                    <div className="mt-2 text-sm leading-6 text-emerald-50">
                      This board does not touch Supabase. Everything here is safe
                      sample data only.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    className="w-full rounded-full border border-red-400/25 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
                  >
                    Delete Demo Item
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[520px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Working drawer
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold">
                    Select a card
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
                    Click any card on the left to open the details drawer, edit it,
                    and watch the board update live.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageActionCard({
  title,
  subtitle,
  message,
  phone,
  onCopy,
}: MessageActionCardProps) {
  const hasPhone = Boolean(phone.trim());

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-slate-400">{subtitle}</div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!hasPhone}
          onClick={() => openTextMessage(phone, message)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            hasPhone
              ? "bg-cyan-400 text-slate-950 hover:scale-[1.01]"
              : "cursor-not-allowed bg-white/10 text-slate-500"
          }`}
        >
          Text customer
        </button>

        <button
          type="button"
          onClick={() => onCopy(title, message)}
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
        >
          Copy message
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 ${
        accent
          ? "border-cyan-400/25 bg-cyan-400/10"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div
        className={`text-xs uppercase tracking-[0.22em] ${
          accent ? "text-cyan-200/70" : "text-slate-500"
        }`}
      >
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-3 text-sm font-medium text-slate-300">{label}</div>
      {children}
    </label>
  );
}