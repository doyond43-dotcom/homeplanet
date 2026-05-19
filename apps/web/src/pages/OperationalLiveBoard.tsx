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
  paymentUrl?: string;
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
    paymentUrl: "",
    stage,
    paymentStatus: "invoice-ready",
    beforePhotos: ["Front driveway before", "South wall mildew"],
    afterPhotos: [],
    timeline: ["Request received", "Photos reviewed", "Estimate ready"],
  };
}

export default function OperationalLiveBoard({ boardSlug, payload }: Props) {
  const businessName = boardSlug === "xanders-job-board" ? "Xander Live Board" : payload?.businessName || titleFromSlug(boardSlug) || "HomePlanet Business";
  const liveBoardUrl = typeof window !== "undefined" ? `${window.location.origin}/planet/live/${boardSlug}` : `/planet/live/${boardSlug}`;
  const customerFrontDoorUrl = typeof window !== "undefined" ? `${window.location.origin}/planet/request/${boardSlug}` : `/planet/request/${boardSlug}`;
  const operationalSystem: OperationalSystem | undefined = payload?.operationalSystem;
  const stages = operationalSystem?.stages?.length ? operationalSystem.stages : fallbackStages;

  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);
  const [showQrPanel, setShowQrPanel] = useState(false);
  const [paymentDrafts, setPaymentDrafts] = useState<Record<string, string>>({});
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

  function startEditing() {
    if (!selectedJob) return;
    setDraftJob({ ...selectedJob });
    setIsEditing(true);
  }

  function saveJobChanges() {
    if (!draftJob) return;

    setAndSaveJobs((current) =>
      current.map((job) =>
        job.id === draftJob.id
          ? {
              ...draftJob,
              timeline: [...draftJob.timeline, "Job details updated"],
            }
          : job
      )
    );

    setSelectedJobId(draftJob.id);
    setIsEditing(false);
    setDraftJob(null);
  }

  function cancelEditing() {
    setDraftJob(null);
    setIsEditing(false);
  }

  function updateDraft(field: keyof OperationalJob, value: string) {
    setDraftJob((current) => (current ? { ...current, [field]: value } : current));
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
      paymentUrl: "",
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

  function setPaymentStatus(jobId: string, paymentStatus: OperationalJob["paymentStatus"]) {
    updateJob(jobId, { paymentStatus }, `Payment status changed to ${paymentStatus}`);
  }

  function addBeforePhoto(jobId: string, fileName = "Before photo") {
    setAndSaveJobs((current) =>
      current.map((job) =>
        job.id === jobId
          ? {
              ...job,
              beforePhotos: [...job.beforePhotos, `Before photo ${job.beforePhotos.length + 1}`],
              timeline: [...job.timeline, `Before photo uploaded: ${fileName}`],
            }
          : job
      )
    );
  }

  function addAfterPhoto(jobId: string, fileName = "After photo") {
    setAndSaveJobs((current) =>
      current.map((job) =>
        job.id === jobId
          ? {
              ...job,
              afterPhotos: [...job.afterPhotos, `After photo ${job.afterPhotos.length + 1}`],
              timeline: [...job.timeline, `After photo uploaded: ${fileName}`],
            }
          : job
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

  const dangerButton: React.CSSProperties = {
    ...button,
    border: "1px solid rgba(248,113,113,0.28)",
    background: "rgba(248,113,113,0.10)",
    color: "#fecaca",
  };

  const field: React.CSSProperties = {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.075)",
    color: "white",
    padding: "10px 11px",
    fontSize: 13,
    fontWeight: 800,
    boxSizing: "border-box",
  };

  const label: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: 1.3,
    color: "rgba(255,255,255,0.42)",
    fontWeight: 950,
    textTransform: "uppercase",
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
                            onClick={() => {
                              setSelectedJobId(job.id);
                            }}
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
                              <span style={{ ...pill, padding: "5px 8px", fontSize: 10 }}>{job.beforePhotos.length + job.afterPhotos.length} Photos</span>
                              <span style={{ ...pill, padding: "5px 8px", fontSize: 10 }}>{job.paymentStatus}</span>
                              <span style={{ ...pill, padding: "5px 8px", fontSize: 10 }}>{job.timeline.length} Updates</span>
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

                    <aside style={{ ...card, padding: 14, position: "sticky", top: 16 }}>
            {selectedJob ? (
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div>
                    <div style={{ ...pill, display: "inline-flex" }}>LIVE JOB CARD</div>
                    <h2 style={{ margin: "10px 0 2px", fontSize: 24 }}>{selectedJob.customer || "Unnamed customer"}</h2>
                    <div style={{ color: "rgba(255,255,255,0.62)", fontWeight: 800 }}>{selectedJob.service || "Service not added"}</div>
                  </div>

                  <div style={{ ...pill, background: "rgba(16,185,129,0.14)", borderColor: "rgba(16,185,129,0.35)" }}>
                    {selectedJob.stage}
                  </div>
                </div>

                <div style={{ borderRadius: 18, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", padding: 12, display: "grid", gap: 9 }}>
                  <div style={label}>Job Details</div>

                  <input
                    style={{ ...field, fontSize: 18, fontWeight: 900 }}
                    value={selectedJob.customer}
                    placeholder="Customer name"
                    onChange={(event) => updateJobField(selectedJob.id, "customer", event.target.value)}
                  />

                  <input
                    style={field}
                    value={selectedJob.service}
                    placeholder="Service / job title"
                    onChange={(event) => updateJobField(selectedJob.id, "service", event.target.value)}
                  />

                  <input
                    style={field}
                    value={selectedJob.phone || ""}
                    placeholder="Phone"
                    onChange={(event) => updateJobField(selectedJob.id, "phone", event.target.value)}
                  />

                  <input
                    style={field}
                    value={selectedJob.email || ""}
                    placeholder="Email"
                    onChange={(event) => updateJobField(selectedJob.id, "email", event.target.value)}
                  />

                  <input
                    style={field}
                    value={selectedJob.address || ""}
                    placeholder="Address"
                    onChange={(event) => updateJobField(selectedJob.id, "address", event.target.value)}
                  />

                  <textarea
                    style={{ ...field, minHeight: 82, resize: "vertical", lineHeight: 1.5 }}
                    value={selectedJob.notes || ""}
                    placeholder="Job notes"
                    onChange={(event) => updateJobField(selectedJob.id, "notes", event.target.value)}
                  />

                  <input
                    style={field}
                    value={paymentDrafts[selectedJob.id] ?? selectedJob.paymentUrl ?? ""}
                    placeholder="Payment link / Cash App / Zelle"
                    onChange={(event) =>
                      setPaymentDrafts((current) => ({
                        ...current,
                        [selectedJob.id]: event.target.value,
                      }))
                    }
                    onBlur={() => savePaymentUrl(selectedJob.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        savePaymentUrl(selectedJob.id);
                        event.currentTarget.blur();
                      }
                    }}
                  />
                </div>

                <div style={{ borderRadius: 18, background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.20)", padding: 12 }}>
                  <div style={label}>Field Actions</div>

                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button style={primaryButton} onClick={() => beforeInputRef.current?.click()}>Add Before</button>
                    <button style={primaryButton} onClick={() => afterInputRef.current?.click()}>Add After</button>
                    <button style={selectedJob.paymentStatus === "paid" ? primaryButton : button} onClick={() => markPaid(selectedJob.id)}>Mark Paid</button>
                    <button style={button} onClick={() => setShowQrPanel((open) => !open)}>{showQrPanel ? "Hide QR" : "Show QR"}</button>
                  </div>

                  <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button style={selectedJob.paymentStatus === "not-ready" ? primaryButton : button} onClick={() => setPaymentStatus(selectedJob.id, "not-ready")}>Not Ready</button>
                    <button style={selectedJob.paymentStatus === "invoice-ready" ? primaryButton : button} onClick={() => setPaymentStatus(selectedJob.id, "invoice-ready")}>Invoice Ready</button>
                    <button style={selectedJob.paymentStatus === "paid" ? primaryButton : button} onClick={() => setPaymentStatus(selectedJob.id, "paid")}>Paid</button>
                  </div>

                  <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.66)" }}>
                    Proof: {selectedJob.beforePhotos.length} before / {selectedJob.afterPhotos.length} after · Payment: <strong>{selectedJob.paymentStatus}</strong>
                  </div>

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

                  {showQrPanel ? (
                    <div style={{ marginTop: 12, borderRadius: 16, background: "white", padding: 12, textAlign: "center" }}>
                      <img
                        alt="Payment QR"
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent((paymentDrafts[selectedJob.id] ?? selectedJob.paymentUrl) || window.location.href)}`}
                        style={{ width: 180, height: 180 }}
                      />
                      <div style={{ marginTop: 8, color: "#111827", fontSize: 12, fontWeight: 900 }}>Scan to pay</div>
                    </div>
                  ) : null}
                </div>

                <div style={{ borderRadius: 18, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", padding: 12 }}>
                  <div style={label}>Job Stage</div>

                  <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
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

                <div style={{ borderRadius: 18, background: "rgba(0,0,0,0.24)", border: "1px solid rgba(255,255,255,0.08)", padding: 12 }}>
                  <div style={label}>Latest Timeline</div>

                  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                    {selectedJob.timeline.slice(-5).reverse().map((item, index) => (
                      <div key={`${item}-${index}`} style={{ fontSize: 12, color: "rgba(255,255,255,0.68)", lineHeight: 1.45 }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.55)" }}>Select a job to open the live job card.</div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
























