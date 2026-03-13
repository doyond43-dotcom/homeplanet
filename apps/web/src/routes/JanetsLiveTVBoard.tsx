import React, { useEffect, useMemo, useState } from "react";

type Pulse = "green" | "yellow" | "red";
type ZoneKey = "intake" | "estimating" | "scheduling" | "installation" | "completed";

type TimelineEvent = {
  id: string;
  time: string;
  label: string;
  spark?: boolean;
};

type StickyNote = {
  id: string;
  text: string;
  level: "question" | "attention" | "resolved";
};

type PresenceAnchor = {
  name: string;
  status: string;
};

type MomentCapture = {
  label: string;
  thumb?: string;
};

type Job = {
  id: string;
  customer: string;
  project: string;
  zone: ZoneKey;
  pulse: Pulse;
  latestEvent: string;
  timeline: TimelineEvent[];
  stickyNotes?: StickyNote[];
  presence?: PresenceAnchor;
  moment?: MomentCapture;
  trail: string[];
  spark?: boolean;
};

const zoneOrder: ZoneKey[] = ["intake", "estimating", "scheduling", "installation", "completed"];

const zoneMeta: Record<
  ZoneKey,
  { title: string; accent: string; border: string; glow: string }
> = {
  intake: {
    title: "Intake",
    accent: "from-cyan-500/20 to-sky-500/5",
    border: "border-cyan-400/30",
    glow: "shadow-cyan-500/10",
  },
  estimating: {
    title: "Estimating",
    accent: "from-fuchsia-500/20 to-violet-500/5",
    border: "border-fuchsia-400/30",
    glow: "shadow-fuchsia-500/10",
  },
  scheduling: {
    title: "Scheduling",
    accent: "from-amber-500/20 to-orange-500/5",
    border: "border-amber-400/30",
    glow: "shadow-amber-500/10",
  },
  installation: {
    title: "Installation",
    accent: "from-emerald-500/20 to-lime-500/5",
    border: "border-emerald-400/30",
    glow: "shadow-emerald-500/10",
  },
  completed: {
    title: "Completed",
    accent: "from-slate-400/20 to-slate-500/5",
    border: "border-slate-300/20",
    glow: "shadow-slate-500/10",
  },
};

const initialJobs: Job[] = [
  {
    id: "job-1",
    customer: "Johnson Residence",
    project: "Kitchen Window Treatments",
    zone: "intake",
    pulse: "green",
    latestEvent: "9:02 AM  Measurement Request Received",
    timeline: [
      { id: "j1-e1", time: "9:02 AM", label: "Measurement Request Received" },
      { id: "j1-e2", time: "9:18 AM", label: "Measurement Scheduled" },
    ],
    stickyNotes: [
      { id: "j1-s1", text: "Need fabric confirmation from supplier", level: "attention" },
    ],
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
    spark: true,
  },
  {
    id: "job-5",
    customer: "Carter Residence",
    project: "Front Room Roman Shades",
    zone: "intake",
    pulse: "green",
    latestEvent: "9:14 AM  New Measurement Request",
    timeline: [{ id: "j5-e1", time: "9:14 AM", label: "New Measurement Request" }],
    stickyNotes: [{ id: "j5-s1", text: "Customer prefers Saturday visit", level: "question" }],
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
  },
  {
    id: "job-6",
    customer: "Ellis Residence",
    project: "Dining Room Drapery",
    zone: "intake",
    pulse: "yellow",
    latestEvent: "9:27 AM  Intake Submitted",
    timeline: [
      { id: "j6-e1", time: "9:27 AM", label: "Intake Submitted" },
      { id: "j6-e2", time: "9:31 AM", label: "Review Pending" },
    ],
    stickyNotes: [{ id: "j6-s1", text: "Need window count confirmation", level: "attention" }],
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
  },

  {
    id: "job-2",
    customer: "Miller Residence",
    project: "Patio Awning",
    zone: "estimating",
    pulse: "yellow",
    latestEvent: "10:42 AM  Estimate Sent",
    timeline: [
      { id: "j2-e1", time: "Yesterday", label: "Measurement Completed" },
      { id: "j2-e2", time: "10:42 AM", label: "Estimate Sent" },
    ],
    stickyNotes: [
      { id: "j2-s1", text: "Customer requested motorized option", level: "question" },
    ],
    presence: { name: "Sarah", status: "Estimating" },
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
  },
  {
    id: "job-7",
    customer: "Brooks Residence",
    project: "Sunroom Shades",
    zone: "estimating",
    pulse: "green",
    latestEvent: "10:18 AM  Quote Drafted",
    timeline: [
      { id: "j7-e1", time: "8:55 AM", label: "Measurement Completed" },
      { id: "j7-e2", time: "10:18 AM", label: "Quote Drafted" },
    ],
    presence: { name: "Janet", status: "Reviewing Quote" },
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
  },
  {
    id: "job-8",
    customer: "Stone Residence",
    project: "Motorized Blackout Shades",
    zone: "estimating",
    pulse: "red",
    latestEvent: "Yesterday 4:26 PM  Estimate Awaiting Send",
    timeline: [
      { id: "j8-e1", time: "Yesterday 2:11 PM", label: "Measurement Completed" },
      { id: "j8-e2", time: "Yesterday 4:26 PM", label: "Estimate Awaiting Send" },
    ],
    stickyNotes: [{ id: "j8-s1", text: "Need final motor upgrade price", level: "attention" }],
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
  },

  {
    id: "job-3",
    customer: "Baker Residence",
    project: "Living Room Drapes",
    zone: "scheduling",
    pulse: "red",
    latestEvent: "12:05 PM  Customer Approved",
    timeline: [
      { id: "j3-e1", time: "11:55 AM", label: "Estimate Sent" },
      { id: "j3-e2", time: "12:05 PM", label: "Customer Approved" },
    ],
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
  },
  {
    id: "job-9",
    customer: "Harper Residence",
    project: "Office Roller Shades",
    zone: "scheduling",
    pulse: "green",
    latestEvent: "11:22 AM  Install Date Confirmed",
    timeline: [
      { id: "j9-e1", time: "10:46 AM", label: "Customer Approved" },
      { id: "j9-e2", time: "11:22 AM", label: "Install Date Confirmed" },
    ],
    stickyNotes: [
      { id: "j9-s1", text: "Installer requested ladder access note", level: "resolved" },
    ],
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
  },

  {
    id: "job-4",
    customer: "Rodriguez Residence",
    project: "Patio Shades",
    zone: "installation",
    pulse: "green",
    latestEvent: "1:12 PM  Installer Mike On Site",
    timeline: [
      { id: "j4-e1", time: "8:41 AM", label: "Install Scheduled" },
      { id: "j4-e2", time: "1:12 PM", label: "Installer Mike On Site" },
      { id: "j4-e3", time: "1:48 PM", label: "Fabric Installed", spark: true },
    ],
    presence: { name: "Mike", status: "On Site" },
    moment: {
      label: "Fabric Installed",
      thumb:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
    },
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
    spark: true,
  },
  {
    id: "job-10",
    customer: "Dawson Residence",
    project: "Master Bedroom Curtains",
    zone: "installation",
    pulse: "yellow",
    latestEvent: "12:34 PM  Crew En Route",
    timeline: [
      { id: "j10-e1", time: "9:05 AM", label: "Install Scheduled" },
      { id: "j10-e2", time: "12:34 PM", label: "Crew En Route" },
    ],
    presence: { name: "Luis", status: "En Route" },
    stickyNotes: [{ id: "j10-s1", text: "Customer asked for call on arrival", level: "question" }],
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
  },

  {
    id: "job-11",
    customer: "Wilson Residence",
    project: "Guest Room Shades",
    zone: "completed",
    pulse: "green",
    latestEvent: "11:08 AM  Install Completed",
    timeline: [
      { id: "j11-e1", time: "8:20 AM", label: "Installer On Site" },
      { id: "j11-e2", time: "10:36 AM", label: "Final Fit Confirmed" },
      { id: "j11-e3", time: "11:08 AM", label: "Install Completed" },
    ],
    presence: { name: "Mike", status: "Completed" },
    moment: {
      label: "Finished Install",
      thumb:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
    },
    trail: ["Request", "Measure", "Estimate", "Approval", "Install", "Complete"],
  },
];

function pulseClasses(pulse: Pulse) {
  if (pulse === "green") return "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.55)]";
  if (pulse === "yellow") return "bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.45)]";
  return "bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.55)]";
}

function noteClasses(level: StickyNote["level"]) {
  if (level === "question") return "bg-amber-300/20 text-amber-100 border-amber-300/30";
  if (level === "resolved") return "bg-emerald-300/20 text-emerald-100 border-emerald-300/30";
  return "bg-yellow-200/20 text-yellow-50 border-yellow-200/30";
}

function nowString() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function JobCard({
  job,
  onBeamAction,
}: {
  job: Job;
  onBeamAction: (jobId: string) => void;
}) {
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-white backdrop-blur-sm",
        "shadow-2xl transition-all duration-500 hover:-translate-y-0.5 hover:bg-slate-900/75",
        job.spark ? "ring-1 ring-cyan-300/40 animate-[sparkPulse_1.6s_ease-out]" : "",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_32%)]" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold tracking-tight">{job.customer}</div>
            <div className="text-sm text-white/60">{job.project}</div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${pulseClasses(job.pulse)}`} />
            <div className="text-xs uppercase tracking-[0.18em] text-white/50">{job.pulse}</div>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90">
          {job.latestEvent}
        </div>

        {job.stickyNotes && job.stickyNotes.length > 0 && (
          <div className="mt-3 space-y-2">
            {job.stickyNotes.map((note) => (
              <div
                key={note.id}
                className={`rounded-xl border px-3 py-2 text-sm ${noteClasses(note.level)}`}
              >
                🟨 {note.text}
              </div>
            ))}
          </div>
        )}

        {job.presence && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100">
            <span>👤</span>
            <span>
              {job.presence.name} — {job.presence.status}
            </span>
          </div>
        )}

        {job.moment && (
          <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-sm text-white/80">
              <span>📸</span>
              <span>{job.moment.label}</span>
            </div>
            {job.moment.thumb && (
              <div
                className="h-24 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${job.moment.thumb})` }}
              />
            )}
          </div>
        )}

        <div className="mt-4">
          <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-white/45">
            Story Trail
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
            {job.trail.map((step, index) => {
              const activeIndex = Math.max(0, zoneOrder.indexOf(job.zone));
              const lit = index <= activeIndex;
              return (
                <React.Fragment key={`${job.id}-${step}`}>
                  <div
                    className={[
                      "rounded-full border px-2.5 py-1",
                      lit
                        ? "border-cyan-300/30 bg-cyan-300/15 text-cyan-100"
                        : "border-white/10 bg-white/5 text-white/45",
                    ].join(" ")}
                  >
                    {step}
                  </div>
                  {index < job.trail.length - 1 && <span className="text-white/30">→</span>}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={() => onBeamAction(job.id)}
            className="rounded-xl border border-cyan-300/30 bg-cyan-400/15 px-3 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/25"
          >
            Beam Action
          </button>

          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">Now</div>
            <div className="text-sm text-white/75">{nowString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ZoneLane({
  zone,
  jobs,
  onBeamAction,
}: {
  zone: ZoneKey;
  jobs: Job[];
  onBeamAction: (jobId: string) => void;
}) {
  const meta = zoneMeta[zone];

  return (
    <section
      className={[
        "relative rounded-3xl border bg-gradient-to-r p-4 shadow-2xl",
        meta.border,
        meta.glow,
        meta.accent,
      ].join(" ")}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 rounded-full bg-white/70" />
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-white/45">Live Stage</div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">{meta.title}</h2>
          </div>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60">
          {jobs.length} active
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job.id} job={job} onBeamAction={onBeamAction} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-6 text-sm text-white/35">
            No active projects in this zone.
          </div>
        )}
      </div>
    </section>
  );
}

export default function JeanettesLiveTVBoard() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [now, setNow] = useState(nowString());
  const [rippleZone, setRippleZone] = useState<ZoneKey | null>("installation");

  useEffect(() => {
    const timer = setInterval(() => setNow(nowString()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const clearSpark = setTimeout(() => {
      setJobs((prev) => prev.map((job) => ({ ...job, spark: false })));
    }, 1800);
    return () => clearTimeout(clearSpark);
  }, []);

  const grouped = useMemo(() => {
    return zoneOrder.reduce((acc, zone) => {
      acc[zone] = jobs.filter((job) => job.zone === zone);
      return acc;
    }, {} as Record<ZoneKey, Job[]>);
  }, [jobs]);

  function moveToNextZone(zone: ZoneKey): ZoneKey {
    const index = zoneOrder.indexOf(zone);
    return zoneOrder[Math.min(index + 1, zoneOrder.length - 1)];
  }

  function beamAction(jobId: string) {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;

        const nextZone = moveToNextZone(job.zone);
        const nextLabel =
          nextZone === "estimating"
            ? "Measurement Scheduled"
            : nextZone === "scheduling"
              ? "Customer Approved"
              : nextZone === "installation"
                ? "Install Scheduled"
                : "Install Completed";

        const newTime = nowString();

        setRippleZone(nextZone);

        return {
          ...job,
          zone: nextZone,
          pulse: "green",
          latestEvent: `${newTime}  ${nextLabel}`,
          spark: true,
          timeline: [
            ...job.timeline,
            {
              id: `${job.id}-${Date.now()}`,
              time: newTime,
              label: nextLabel,
              spark: true,
            },
          ],
          stickyNotes:
            nextZone === "completed" ? [] : job.stickyNotes?.filter((n) => n.level !== "resolved"),
          presence:
            nextZone === "installation"
              ? { name: "Mike", status: "On Site" }
              : nextZone === "completed"
                ? { name: "Mike", status: "Completed" }
                : job.presence,
          moment:
            nextZone === "completed"
              ? {
                  label: "Install Completed",
                  thumb:
                    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
                }
              : job.moment,
        };
      })
    );

    setTimeout(() => setRippleZone(null), 1200);
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <style>{`
        @keyframes sparkPulse {
          0% { box-shadow: 0 0 0 rgba(125, 211, 252, 0.0); }
          20% { box-shadow: 0 0 40px rgba(125, 211, 252, 0.28); }
          100% { box-shadow: 0 0 0 rgba(125, 211, 252, 0.0); }
        }
        @keyframes rippleFlash {
          0% { opacity: 0; transform: scaleX(0.98); }
          30% { opacity: 1; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(1.02); }
        }
      `}</style>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.12),transparent_25%)]" />

        <div className="relative mx-auto max-w-[1800px] px-6 py-6">
          <div className="mb-6 flex items-end justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
                HomePlanet Live Operations Board
              </div>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                Jeanette&apos;s Interiors
              </h1>
              <div className="mt-2 text-white/60">Live Project Timeline</div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="text-white/45">Active Projects</div>
                <div className="mt-1 text-2xl font-semibold">{jobs.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="text-white/45">On Site</div>
                <div className="mt-1 text-2xl font-semibold">
                  {jobs.filter((j) => j.presence?.status === "On Site").length}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="text-white/45">Needs Attention</div>
                <div className="mt-1 text-2xl font-semibold text-rose-300">
                  {jobs.filter((j) => j.pulse === "red").length}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {zoneOrder.map((zone) => (
              <div key={zone} className="relative">
                {rippleZone === zone && (
                  <div className="pointer-events-none absolute inset-0 z-20 rounded-3xl border border-cyan-300/30 bg-cyan-300/8 animate-[rippleFlash_1.1s_ease-out]" />
                )}
                <ZoneLane zone={zone} jobs={grouped[zone]} onBeamAction={beamAction} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}