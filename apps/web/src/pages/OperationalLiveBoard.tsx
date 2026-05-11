import { useMemo, useRef, useState } from "react";

type OperationalStage = {
  id?: string;
  label: string;
  description?: string;
};

type OperationalSystem = {
  label?: string;
  stages?: OperationalStage[];
  customerFrontDoor?: boolean;
  liveBoard?: boolean;
  staffBoard?: boolean;
  requestFlow?: boolean;
  jobDrawer?: boolean;
  messages?: boolean;
  scheduling?: boolean;
  photoProof?: boolean;
  paymentQr?: boolean;
  proofTimeline?: boolean;
};

type OperationalJob = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  notes: string;
  stage: string;
  paymentStatus: "not-ready" | "invoice-ready" | "paid";
  beforePhotos: string[];
  afterPhotos: string[];
  timeline: string[];
};

type Props = {
  boardSlug: string;
  payload: any;
};

const fallbackStages: OperationalStage[] = [
  { id: "new-request", label: "New Request", description: "Customer request received." },
  { id: "quote-review", label: "Quote Review", description: "Photos, address, and service details being reviewed." },
  { id: "waiting-approval", label: "Waiting Approval", description: "Estimate sent and waiting on customer approval." },
  { id: "scheduled", label: "Scheduled", description: "Job date and time confirmed." },
  { id: "in-progress", label: "In Progress", description: "Work is active." },
  { id: "photo-proof", label: "Photo Proof", description: "Before and after proof attached." },
  { id: "payment-due", label: "Payment Due", description: "Payment QR or invoice ready." },
  { id: "complete", label: "Complete", description: "Job finished, paid, and timestamped." },
];

function qrSrc(value: string, size = 180) {
  return "https://api.qrserver.com/v1/create-qr-code/?size=" + size + "x" + size + "&data=" + encodeURIComponent(value);
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function jobsKey(boardSlug: string) {
  return `hp-operational-board:${boardSlug}:jobs`;
}

function readSavedJobs(boardSlug: string, fallbackStage: string): OperationalJob[] {
  try {
    const raw = localStorage.getItem(jobsKey(boardSlug));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}

  return [makeSampleJob(fallbackStage)];
}

function saveJobs(boardSlug: string, jobs: OperationalJob[]) {
  try {
    localStorage.setItem(jobsKey(boardSlug), JSON.stringify(jobs));
  } catch {}
}

function makeSampleJob(stage: string): OperationalJob {
  return {
    id: "job-1",
    customer: "Maria Jenkins",
    phone: "863-555-0184",
    email: "customer@example.com",
    address: "Okeechobee, FL",
    service: "House wash + driveway cleaning",
    notes:
      "Customer sent photos. Driveway has heavy mildew near garage. Wants quote and earliest available appointment.",
    stage,
    paymentStatus: "invoice-ready",
    beforePhotos: ["Front driveway before", "South wall mildew"],
    afterPhotos: [],
    timeline: [
      "Request received",
      "Photos reviewed",
      "Estimate ready",
    ],
  };
}

export default function OperationalLiveBoard({ boardSlug, payload }: Props) {
  const businessName = payload?.businessName || titleFromSlug(boardSlug) || "HomePlanet Business";
  const liveBoardUrl = typeof window !== "undefined" ? `${window.location.origin}/planet/live/${boardSlug}` : `/planet/live/${boardSlug}`;
  const customerFrontDoorUrl = typeof window !== "undefined" ? `${window.location.origin}/planet/request/${boardSlug}` : `/planet/request/${boardSlug}`;
  const operationalSystem: OperationalSystem | undefined = payload?.operationalSystem;
  const stages = operationalSystem?.stages?.length ? operationalSystem.stages : fallbackStages;

  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);
  const [showQrPanel, setShowQrPanel] = useState(false);
  const [jobs, setJobs] = useState<OperationalJob[]>(() => readSavedJobs(boardSlug, stages[0]?.label || "New Request"));
  const [selectedJobId, setSelectedJobId] = useState<string | null>("job-1");

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) || jobs[0] || null, [jobs, selectedJobId]);

  function setAndSaveJobs(updater: (current: OperationalJob[]) => OperationalJob[]) {
    setJobs((current) => {
      const next = updater(current);
      saveJobs(boardSlug, next);
      return next;
    });
  }

  function updateJob(jobId: string, updates: Partial<OperationalJob>, timelineNote?: string) {
    setAndSaveJobs((current) =>
      current.map((job) =>
        job.id === jobId
          ? {
              ...job,
              ...updates,
              timeline: timelineNote ? [...job.timeline, timelineNote] : job.timeline,
            }
          : job
      )
    );
  }

  function addNewRequest() {
    const firstStage = stages[0]?.label || "New Request";
    const created: OperationalJob = {
      id: `job-${Date.now()}`,
      customer: "New Customer",
      phone: "",
      email: "",
      address: "",
      service: "New service request",
      notes: "New request created from the live operational board.",
      stage: firstStage,
      paymentStatus: "not-ready",
      beforePhotos: [],
      afterPhotos: [],
      timeline: ["Request created"],
    };

    setAndSaveJobs((current) => [created, ...current]);
    setSelectedJobId(created.id);
  }

  function moveJob(jobId: string, stage: string) {
    const job = jobs.find((item) => item.id === jobId);
    if (job?.stage === stage) return;
    updateJob(jobId, { stage }, `Moved to ${stage}`);
  }

  function markPaid(jobId: string) {
    updateJob(jobId, { paymentStatus: "paid" }, "Payment marked paid");
  }

  function addBeforePhoto(jobId: string, fileName = "Before photo") {
    updateJob(jobId, {}, `Before photo uploaded: ${fileName}`);
    setAndSaveJobs((current) =>
      current.map((job) =>
        job.id === jobId ? { ...job, beforePhotos: [...job.beforePhotos, `Before photo ${job.beforePhotos.length + 1}`] } : job
      )
    );
  }

  function addAfterPhoto(jobId: string, fileName = "After photo") {
    updateJob(jobId, {}, `After photo uploaded: ${fileName}`);
    setAndSaveJobs((current) =>
      current.map((job) =>
        job.id === jobId ? { ...job, afterPhotos: [...job.afterPhotos, `After photo ${job.afterPhotos.length + 1}`] } : job
      )
    );
  }

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 12% 8%, rgba(56,189,248,0.18), transparent 30%), radial-gradient(circle at 88% 10%, rgba(16,185,129,0.14), transparent 28%), #07111f",
    color: "white",
    padding: 18,
  };

  const card: React.CSSProperties = {
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.055)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.38)",
  };

  const pill: React.CSSProperties = {
    borderRadius: 999,
    border: "1px solid rgba(125,211,252,0.24)",
    background: "rgba(14,165,233,0.12)",
    color: "#e0f2fe",
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 900,
  };

  const button: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  };

  const primaryButton: React.CSSProperties = {
    ...button,
    border: "1px solid rgba(16,185,129,0.35)",
    background: "rgba(16,185,129,0.16)",
    color: "#d1fae5",
  };

  return (
    <main style={page}>
      <section style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ ...card, padding: 22, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <div>
              <div style={{ ...pill, display: "inline-flex" }}>LIVE OPERATIONAL SYSTEM</div>
              <h1 style={{ margin: "12px 0 6px", fontSize: 42, lineHeight: 1, letterSpacing: -1.2 }}>
                {businessName}
              </h1>
              <div style={{ color: "rgba(255,255,255,0.68)", fontWeight: 800 }}>
                Customer intake, live workflow, staff view, proof, payment, and completion tracking.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <button style={primaryButton} onClick={addNewRequest}>+ New Request</button>
              <button style={button} onClick={() => window.open(`/planet/team/${boardSlug}`, "_blank")}>Staff Board</button>
              <button style={button} onClick={() => window.open(customerFrontDoorUrl, "_blank")}>Customer Front Door</button>
              <button style={button} onClick={() => setShowQrPanel((open) => !open)}>QR Payment</button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 420px", gap: 16, alignItems: "start" }}>
          <section style={{ ...card, padding: 16, overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${stages.length}, minmax(230px, 1fr))`, gap: 12 }}>
              {stages.map((stage, index) => {
                const stageJobs = jobs.filter((job) => job.stage === stage.label);

                return (
                  <div
                    key={stage.id || stage.label}
                    style={{
                      borderRadius: 22,
                      border: "1px solid rgba(255,255,255,0.09)",
                      background: "rgba(0,0,0,0.22)",
                      padding: 12,
                      minHeight: 330,
                    }}
                  >
                    <div style={{ fontSize: 10, letterSpacing: 1.4, color: "rgba(167,243,208,0.65)", fontWeight: 950 }}>
                      STEP {index + 1}
                    </div>
                    <div style={{ marginTop: 4, fontWeight: 950, fontSize: 15 }}>{stage.label}</div>
                    <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.4, color: "rgba(255,255,255,0.55)" }}>
                      {stage.description}
                    </div>

                    <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                      {stageJobs.length ? (
                        stageJobs.map((job) => (
                          <button
                            key={job.id}
                            type="button"
                            onClick={() => setSelectedJobId(job.id)}
                            style={{
                              textAlign: "left",
                              borderRadius: 18,
                              border: selectedJobId === job.id ? "1px solid rgba(34,211,238,0.55)" : "1px solid rgba(255,255,255,0.10)",
                              background: selectedJobId === job.id ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.06)",
                              color: "white",
                              padding: 12,
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ fontWeight: 950 }}>{job.customer}</div>
                            <div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{job.service}</div>
                            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                              <span style={{ ...pill, padding: "5px 8px", fontSize: 10 }}>Photos</span>
                              <span style={{ ...pill, padding: "5px 8px", fontSize: 10 }}>Payment</span>
                              <span style={{ ...pill, padding: "5px 8px", fontSize: 10 }}>Proof</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div style={{ borderRadius: 16, border: "1px dashed rgba(255,255,255,0.10)", padding: 14, fontSize: 12, color: "rgba(255,255,255,0.38)" }}>
                          No jobs here yet.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <aside style={{ ...card, padding: 16, position: "sticky", top: 16 }}>
            {selectedJob ? (
              <>
                <div style={{ ...pill, display: "inline-flex" }}>JOB DRAWER</div>
                <h2 style={{ margin: "12px 0 4px", fontSize: 24 }}>{selectedJob.customer}</h2>
                <div style={{ color: "rgba(255,255,255,0.62)", fontWeight: 800 }}>{selectedJob.service}</div>

                <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                  <div style={{ borderRadius: 16, background: "rgba(0,0,0,0.25)", padding: 12 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", fontWeight: 950 }}>CUSTOMER INFO</div>
                    <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.7 }}>
                      Phone: <strong>{selectedJob.phone}</strong>
                      <br />
                      Email: <strong>{selectedJob.email}</strong>
                      <br />
                      Address: <strong>{selectedJob.address}</strong>
                    </div>
                  </div>

                  <div style={{ borderRadius: 16, background: "rgba(0,0,0,0.25)", padding: 12 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", fontWeight: 950 }}>NOTES</div>
                    <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.68)" }}>{selectedJob.notes}</p>
                  </div>

                  <div style={{ borderRadius: 16, background: "rgba(0,0,0,0.25)", padding: 12 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", fontWeight: 950 }}>PHOTO PROOF</div>
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <input
                        ref={beforeInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) addBeforePhoto(selectedJob.id, file.name);
                          event.currentTarget.value = "";
                        }}
                      />
                      <input
                        ref={afterInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) addAfterPhoto(selectedJob.id, file.name);
                          event.currentTarget.value = "";
                        }}
                      />
                      <button style={button} onClick={() => beforeInputRef.current?.click()}>Upload Before</button>
                      <button style={button} onClick={() => afterInputRef.current?.click()}>Upload After</button>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                      Before: {selectedJob.beforePhotos.length} · After: {selectedJob.afterPhotos.length}
                    </div>
                  </div>

                  <div style={{ borderRadius: 16, background: "rgba(0,0,0,0.25)", padding: 12 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", fontWeight: 950 }}>PAYMENT</div>
                    <div style={{ marginTop: 8, fontWeight: 900 }}>{selectedJob.paymentStatus}</div>
                    <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <button style={primaryButton} onClick={() => setShowQrPanel((open) => !open)}>Show QR</button>
                      <button style={button} onClick={() => markPaid(selectedJob.id)}>Mark Paid</button>
                    </div>

                    {showQrPanel ? (
                      <div style={{ marginTop: 12, borderRadius: 16, border: "1px dashed rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", padding: 14, textAlign: "center" }}>
                        <div style={{ margin: "0 auto", width: 150, height: 150, borderRadius: 18, background: "white", display: "grid", placeItems: "center", padding: 10 }}>
                          <img src={qrSrc(customerFrontDoorUrl, 140)} alt="Customer request QR code" width={140} height={140} style={{ display: "block", borderRadius: 10 }} />
                        </div>
                        <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.68)", lineHeight: 1.5 }}>
                          Scan to open this customer front door. Requests submitted here land on the live board.
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div style={{ borderRadius: 16, background: "rgba(0,0,0,0.25)", padding: 12 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", fontWeight: 950 }}>MOVE JOB</div>
                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {stages.map((stage) => (
                          <button
                            key={stage.label}
                            style={selectedJob.stage === stage.label ? primaryButton : button}
                            onClick={() => moveJob(selectedJob.id, stage.label)}
                          >
                            {stage.label}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div style={{ borderRadius: 16, background: "rgba(0,0,0,0.25)", padding: 12 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", fontWeight: 950 }}>PROOF TIMELINE</div>
                    <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                      {selectedJob.timeline.map((item, index) => (
                        <div key={`${item}-${index}`} style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                          • {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.55)" }}>Select a job to open the drawer.</div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}











