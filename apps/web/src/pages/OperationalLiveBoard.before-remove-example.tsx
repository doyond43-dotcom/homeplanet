import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

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

const visualStages = [
  {
    key: "active",
    title: "IN MOTION",
    short: "Active",
    color: "#38bdf8",
    desc: "New, scheduled, or work already moving.",
  },
  {
    key: "proof",
    title: "PROOF",
    short: "Proof",
    color: "#22d3ee",
    desc: "Before / after photos and job evidence.",
  },
  {
    key: "payment",
    title: "PAYMENT",
    short: "Payment",
    color: "#a78bfa",
    desc: "Invoice, QR, approval, or payment due.",
  },
  {
    key: "complete",
    title: "COMPLETE",
    short: "Complete",
    color: "#4ade80",
    desc: "Finished, paid, and timestamped.",
  },
] as const;

type VisualStageKey = (typeof visualStages)[number]["key"];

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
  if (typeof window === "undefined") return [makeSampleJob(fallbackStage)];

  try {
    const raw = window.localStorage.getItem(jobsKey(boardSlug));

    if (raw) {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed) && parsed.length) {
        return parsed;
      }
    }

    const exampleRaw = window.localStorage.getItem(
      `hp-example-workflow:${boardSlug}`
    );

    if (exampleRaw) {
      const example = JSON.parse(exampleRaw);

      return [
        {
          id: example.id || "job-1",
          customer: example.customerName || "Example Workflow",
          phone: "",
          email: "",
          address: "",
          service: example.title || "Example workflow",
          notes:
            example.note ||
            "This starter workflow shows how HomePlanet tracks work from request to proof, payment, and completion.",
          paymentUrl: "",
          stage: example.stageLabel || fallbackStage,
          paymentStatus: "invoice-ready",
          beforePhotos: ["Example intake"],
          afterPhotos: [],
          timeline: [
            example.label || "Example Workflow",
            "Starter workflow created",
            "Ready to replace with real work",
          ],
        },
      ];
    }
  } catch {}

  return [makeSampleJob(fallbackStage)];
}

function saveJobs(boardSlug: string, jobs: OperationalJob[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(jobsKey(boardSlug), JSON.stringify(jobs));
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

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "HP";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function bucketForJob(job: OperationalJob): VisualStageKey {
  const value = `${job.stage} ${job.paymentStatus}`.toLowerCase();

  if (value.includes("complete") || value.includes("paid")) return "complete";
  if (value.includes("payment") || value.includes("invoice") || value.includes("approval") || value.includes("due")) return "payment";
  if (value.includes("proof") || value.includes("photo") || job.beforePhotos.length || job.afterPhotos.length) return "proof";

  return "active";
}

function statusColor(job: OperationalJob) {
  return visualStages.find((stage) => stage.key === bucketForJob(job))?.color || "#38bdf8";
}

function moveToVisualStage(job: OperationalJob, key: VisualStageKey, stages: OperationalStage[]) {
  const labels = stages.map((stage) => stage.label);
  const lowerLabels = labels.map((label) => label.toLowerCase());

  function firstMatch(words: string[], fallback: string) {
    const foundIndex = lowerLabels.findIndex((label) => words.some((word) => label.includes(word)));
    return foundIndex >= 0 ? labels[foundIndex] : fallback;
  }

  if (key === "complete") return firstMatch(["complete", "paid", "finished"], labels[labels.length - 1] || "Complete");
  if (key === "payment") return firstMatch(["payment", "invoice", "approval", "due"], job.stage || "Payment Due");
  if (key === "proof") return firstMatch(["proof", "photo"], job.stage || "Photo Proof");
  return firstMatch(["progress", "scheduled", "active", "new", "request"], labels[0] || "New Request");
}

export default function OperationalLiveBoard({ boardSlug, payload }: Props) {
  const businessName = boardSlug === "xanders-job-board" ? "Xander Live Board" : payload?.businessName || titleFromSlug(boardSlug) || "HomePlanet Business";
  const customerFrontDoorUrl = typeof window !== "undefined" ? `${window.location.origin}/planet/request/${boardSlug}` : `/planet/request/${boardSlug}`;
  const operationalSystem: OperationalSystem | undefined = payload?.operationalSystem;
  const stages = operationalSystem?.stages?.length ? operationalSystem.stages : fallbackStages;

  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);

  const [showQrPanel, setShowQrPanel] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showActivationRail, setShowActivationRail] = useState(true);
  const [paymentDrafts, setPaymentDrafts] = useState<Record<string, string>>({});
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<OperationalJob[]>(() => readSavedJobs(boardSlug, stages[0]?.label || "New Request"));
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    const saved = readSavedJobs(boardSlug, stages[0]?.label || "New Request");
    return saved[0]?.id || "job-1";
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 900);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) || jobs[0] || null, [jobs, selectedJobId]);

  const groupedJobs = useMemo(() => {
    return visualStages.reduce<Record<VisualStageKey, OperationalJob[]>>(
      (acc, stage) => {
        acc[stage.key] = jobs.filter((job) => bucketForJob(job) === stage.key);
        return acc;
      },
      { active: [], proof: [], payment: [], complete: [] }
    );
  }, [jobs]);

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
              timeline: timelineNote ? [timelineNote, ...job.timeline] : job.timeline,
            }
          : job
      )
    );
  }

  function updateJobField(jobId: string, fieldName: keyof OperationalJob, value: string) {
    updateJob(jobId, { [fieldName]: value } as Partial<OperationalJob>);
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
    setDetailsOpen(true);
  }

  function moveJob(jobId: string, stage: string) {
    const job = jobs.find((item) => item.id === jobId);
    if (job?.stage === stage) return;
    updateJob(jobId, { stage }, `Moved to ${stage}`);
  }

  function moveSelectedJobToVisualStage(key: VisualStageKey) {
    if (!selectedJob) return;

    const nextStage = moveToVisualStage(selectedJob, key, stages);
    const nextPaymentStatus =
      key === "complete"
        ? "paid"
        : key === "payment"
          ? "invoice-ready"
          : selectedJob.paymentStatus;

    updateJob(selectedJob.id, { stage: nextStage, paymentStatus: nextPaymentStatus }, `Moved to ${visualStages.find((stage) => stage.key === key)?.short || nextStage}`);
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
              beforePhotos: [...job.beforePhotos, fileName || `Before photo ${job.beforePhotos.length + 1}`],
              timeline: [`Before photo uploaded: ${fileName}`, ...job.timeline],
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
              afterPhotos: [...job.afterPhotos, fileName || `After photo ${job.afterPhotos.length + 1}`],
              timeline: [`After photo uploaded: ${fileName}`, ...job.timeline],
            }
          : job
      )
    );
  }

  function savePaymentUrl(jobId: string) {
    const draft = paymentDrafts[jobId];
    if (typeof draft !== "string") return;

    updateJob(jobId, { paymentUrl: draft }, "Payment link updated");
  }

  function archiveSelectedJob() {
    if (!selectedJob) return;
    const confirmed = window.confirm("Archive this job from the live board?");
    if (!confirmed) return;

    const nextJobs = jobs.filter((job) => job.id !== selectedJob.id);
    setAndSaveJobs(() => nextJobs);
    setSelectedJobId(nextJobs[0]?.id || null);
  }

  function sendInvoiceText() {
    if (!selectedJob) return;

    const amount = selectedJob.paymentUrl || "your payment link";
    const phone = selectedJob.phone || "";
    const message = `Hi ${selectedJob.customer}, your ${selectedJob.service} invoice is ready. Payment: ${amount}`;

    updateJob(selectedJob.id, { paymentStatus: "invoice-ready" }, "Invoice message prepared");
    if (phone) window.location.href = `sms:${phone}?&body=${encodeURIComponent(message)}`;
  }

  return (
    <main style={page}>
      <section style={{ maxWidth: 1720, margin: "0 auto" }}>
        <header style={header}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={orb}>HP</div>
            <div>
              <div style={{ color: "rgba(186,230,253,0.72)", fontSize: 18 }}>
                Welcome, <strong style={{ color: "white" }}>{businessName}</strong>
              </div>
              <h1 style={{ margin: "6px 0", fontSize: 54, lineHeight: 0.95, letterSpacing: -2.2, fontWeight: 650 }}>
                Liveboard
              </h1>
              <div style={{ color: "rgba(186,230,253,0.78)", fontSize: 19 }}>
                Jobs in motion. Proof. Payments. Completion.
              </div>
            </div>
          </div>

          <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <TopButton primary onClick={addNewRequest}>+ New Request</TopButton>
            <TopButton onClick={() => window.open(`/planet/staff/${boardSlug}`, "_blank")}>Staff Board</TopButton>
            <TopButton onClick={() => window.open(customerFrontDoorUrl, "_blank")}>Customer Front Door</TopButton>
            <TopButton onClick={() => setShowQrPanel((open) => !open)}>QR Payment</TopButton>
          </nav>
        </header>

        {!showActivationRail && (
          <button
            onClick={() => setShowActivationRail(true)}
            style={collapsedActivationButton}
          >
            Reveal Free Trial
          </button>
        )}

        {showActivationRail ? (
          <div
            style={{
              marginBottom: 22,
              borderRadius: 24,
              border: "1px solid rgba(16,185,129,0.24)",
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(15,23,42,0.92))",
              padding: "18px 22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
              boxShadow: "0 0 50px rgba(16,185,129,0.10)",
            }}
          >
            <div>
              <div
                style={{
                  color: "#86efac",
                  fontSize: 12,
                  fontWeight: 950,
                  letterSpacing: 1.4,
                }}
              >
                LIVE SYSTEM READY
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 24,
                  fontWeight: 950,
                  letterSpacing: -1,
                }}
              >
                Your business board is already operational.
              </div>

              <div
                style={{
                  marginTop: 4,
                  color: "rgba(255,255,255,0.68)",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                Explore the workflow, proof system, QR payments, and live operations before activating your free trial.
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => window.location.href = `/planet/activate/${boardSlug}`}
                style={{
                  border: 0,
                  borderRadius: 18,
                  background:
                    "linear-gradient(135deg, #34d399 0%, #22c55e 100%)",
                  color: "#052e1b",
                  fontWeight: 950,
                  padding: "16px 22px",
                  cursor: "pointer",
                  boxShadow: "0 0 40px rgba(52,211,153,0.24)",
                }}
              >
                Activate Free Trial ?
              </button>

              <button
                onClick={() => setShowActivationRail(false)}
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(15,23,42,0.66)",
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 900,
                  padding: "16px 18px",
                  cursor: "pointer",
                }}
              >
                Hide
              </button>
            </div>
          </div>
        ) : null}

        <section style={isMobile ? mobileLayout : layout}>
          <div style={isMobile ? mobileBoardSurface : boardSurface}>
            {visualStages.map((stage, index) => {
              const stageJobs = groupedJobs[stage.key];

              return (
                <div key={stage.key} style={{ ...stageColumn, borderRight: index === visualStages.length - 1 ? "0" : stageColumn.borderRight }}>
                  <div style={stageHeader}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 950, letterSpacing: 1 }}>
                        <span style={{ color: stage.color, marginRight: 10 }}>●</span>
                        {stage.title}
                      </div>
                      <div style={{ marginTop: 5, fontSize: 12, lineHeight: 1.35, color: "rgba(186,230,253,0.58)" }}>
                        {stage.desc}
                      </div>
                    </div>
                    <div style={stageCount}>{stageJobs.length}</div>
                  </div>

                  <div style={{ display: "grid", gap: 12 }}>
                    {stageJobs.length ? (
                      stageJobs.map((job) => {
                        const color = statusColor(job);
                        const isSelected = selectedJob?.id === job.id;

                        return (
                          <JobCard
                            key={job.id}
                            job={job}
                            active={isSelected}
                            hovered={hoveredJobId === job.id}
                            color={color}
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setDetailsOpen(false);
                              setShowQrPanel(false);
                            }}
                            onMouseEnter={() => setHoveredJobId(job.id)}
                            onMouseLeave={() => setHoveredJobId(null)}
                          />
                        );
                      })
                    ) : (
                      <div style={emptyCard}>No jobs here yet.</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <aside style={isMobile ? mobileActivePanel : activePanel}>
            {selectedJob ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <PanelTitle>ACTIVE JOB</PanelTitle>
                  <div style={{ ...statusPill, color: statusColor(selectedJob), borderColor: `${statusColor(selectedJob)}55`, background: `${statusColor(selectedJob)}18` }}>
                    {selectedJob.stage}
                  </div>
                </div>

                <h2 style={{ fontSize: 34, margin: "26px 0 6px", letterSpacing: -1 }}>{selectedJob.customer || "Unnamed customer"}</h2>
                <div style={{ color: "rgba(186,230,253,0.78)", fontSize: 18, fontWeight: 800 }}>
                  {selectedJob.service || "Service not added"}
                </div>

                <div style={actionGrid}>
                  <ActionButton label="Call" top="CALL" onClick={() => selectedJob.phone && (window.location.href = `tel:${selectedJob.phone}`)} />
                  <ActionButton label="Message" top="MSG" onClick={() => selectedJob.phone && (window.location.href = `sms:${selectedJob.phone}`)} />
                  <ActionButton label="Navigate" top="GO" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedJob.address || businessName)}`, "_blank")} />
                  <ActionButton label="PAY" top="PAY" onClick={() => setShowQrPanel((open) => !open)} />
                </div>

                {showQrPanel ? (
                  <div id="payment-panel" style={detailsBox}>
                    <PanelTitle>PAYMENT QR</PanelTitle>
                    <input
                      style={field}
                      value={paymentDrafts[selectedJob.id] ?? selectedJob.paymentUrl ?? ""}
                      placeholder="Cash App / Venmo / Zelle / payment link"
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

                    <div style={{ borderRadius: 18, background: "white", padding: 14, textAlign: "center" }}>
                      <img
                        alt="Payment QR"
                        src={qrSrc((paymentDrafts[selectedJob.id] ?? selectedJob.paymentUrl) || window.location.href, 190)}
                        style={{ width: 190, height: 190 }}
                      />
                      <div style={{ marginTop: 8, color: "#0f172a", fontSize: 12, fontWeight: 950 }}>
                        Scan to pay
                      </div>
                    </div>
                  </div>
                ) : null}

                {detailsOpen ? (
                  <div style={detailsBox}>
                    <PanelTitle>JOB DETAILS</PanelTitle>
                    <input style={field} value={selectedJob.customer} onChange={(event) => updateJobField(selectedJob.id, "customer", event.target.value)} />
                    <input style={field} value={selectedJob.service} onChange={(event) => updateJobField(selectedJob.id, "service", event.target.value)} />
                    <input style={field} value={selectedJob.phone} onChange={(event) => updateJobField(selectedJob.id, "phone", event.target.value)} />
                    <input style={field} value={selectedJob.email} onChange={(event) => updateJobField(selectedJob.id, "email", event.target.value)} />
                    <input style={field} value={selectedJob.address} onChange={(event) => updateJobField(selectedJob.id, "address", event.target.value)} />
                    <textarea style={{ ...field, minHeight: 92, resize: "vertical" }} value={selectedJob.notes} onChange={(event) => updateJobField(selectedJob.id, "notes", event.target.value)} />
                  </div>
                ) : null}

                <div style={detailsBox}>
                  <PanelTitle>INVOICE</PanelTitle>
                  <input
                    style={field}
                    value={paymentDrafts[selectedJob.id] ?? selectedJob.paymentUrl ?? ""}
                    placeholder="Payment link / invoice link"
                    onChange={(event) =>
                      setPaymentDrafts((current) => ({
                        ...current,
                        [selectedJob.id]: event.target.value,
                      }))
                    }
                    onBlur={() => savePaymentUrl(selectedJob.id)}
                  />

                  <button onClick={sendInvoiceText} style={detailsButton}>
                    Send Invoice Text
                  </button>

                  <div style={infoBox}>
                    <div style={{ fontWeight: 950, color: "#67e8f9" }}>Ready to send</div>
                    <div>To: {selectedJob.phone || "No phone added"}</div>
                    <div style={{ wordBreak: "break-all" }}>Link: {paymentDrafts[selectedJob.id] || selectedJob.paymentUrl || "Add payment link above"}</div>
                  </div>
                </div>

                <div style={detailsBox}>
                  <PanelTitle>PHOTO PROOF</PanelTitle>

                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 34px 1fr", gap: 10, alignItems: "stretch" }}>
                    <ProofButton
                      title="BEFORE"
                      count={selectedJob.beforePhotos.length}
                      onClick={() => beforeInputRef.current?.click()}
                    />
                    <div style={proofArrow}>→</div>
                    <ProofButton
                      title="AFTER"
                      count={selectedJob.afterPhotos.length}
                      onClick={() => afterInputRef.current?.click()}
                    />
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

                  <div style={{ marginTop: 10, color: "rgba(186,230,253,0.72)", fontWeight: 800 }}>
                    Before: {selectedJob.beforePhotos.length} / After: {selectedJob.afterPhotos.length}
                  </div>
                </div>

                <div style={{ marginTop: 28 }}>
                  <PanelTitle>STAGE</PanelTitle>
                  <div style={stageRail}>
                    {visualStages.map((stage, index) => {
                      const isActive = bucketForJob(selectedJob) === stage.key;

                      return (
                        <button
                          key={stage.key}
                          onClick={() => moveSelectedJobToVisualStage(stage.key)}
                          style={{
                            ...stageDot,
                            left: `${index * 33}%`,
                            background: isActive ? stage.color : "rgba(15,23,42,0.95)",
                            boxShadow: isActive ? `0 0 18px ${stage.color}` : "none",
                          }}
                          title={stage.title}
                        />
                      );
                    })}
                    <div style={{ ...stageProgress, width: bucketForJob(selectedJob) === "active" ? "0%" : bucketForJob(selectedJob) === "proof" ? "33%" : bucketForJob(selectedJob) === "payment" ? "66%" : "100%" }} />
                  </div>

                  <div style={stageLabels}>
                    {visualStages.map((stage) => (
                      <button
                        key={stage.key}
                        onClick={() => moveSelectedJobToVisualStage(stage.key)}
                        style={{
                          ...stageLabelButton,
                          color: bucketForJob(selectedJob) === stage.key ? stage.color : "rgba(186,230,253,0.58)",
                        }}
                      >
                        {stage.short}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 36 }}>
                  <PanelTitle>TRUTH TRAIL</PanelTitle>
                  {selectedJob.timeline.slice(0, 5).map((item, index) => (
                    <div key={`${item}-${index}`} style={timelineRow}>
                      <div>
                        <span style={{ color: statusColor(selectedJob), marginRight: 12 }}>●</span>
                        {item}
                      </div>
                      <div style={{ color: "rgba(186,230,253,0.62)" }}>Now</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={archiveSelectedJob}
                  style={{
                    ...detailsButton,
                    marginTop: 22,
                    border: "1px solid rgba(248,113,113,0.30)",
                    background: "rgba(127,29,29,0.28)",
                  }}
                >
                  Archive Job
                </button>

                <button onClick={() => setDetailsOpen((open) => !open)} style={detailsButton}>
                  {detailsOpen ? "Hide Job Details" : "View Full Job Details >"}
                </button>
              </>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.58)", fontWeight: 800 }}>
                No active job selected. Create a new request to start the board.
              </div>
            )}
          </aside>
        </section>

        <footer style={statsBar}>
          <Stat title="TODAY'S FLOW" value={`${jobs.length} Jobs`} />
          <Stat title="COMPLETED" value={`${groupedJobs.complete.length}`} />
          <Stat title="PAYMENTS" value={`${groupedJobs.payment.length} Pending`} />
          <Stat title="PROOFS" value={`${groupedJobs.proof.length} New`} />
        </footer>
      </section>
    </main>
  );
}

function JobCard({
  job,
  active,
  hovered,
  color,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  job: OperationalJob;
  active: boolean;
  hovered: boolean;
  color: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        textAlign: "left",
        borderRadius: 18,
        border: active ? `1px solid ${color}` : `1px solid ${color}55`,
        background: `linear-gradient(145deg, ${color}22, rgba(2,6,23,0.56))`,
        padding: 18,
        minHeight: 126,
        color: "white",
        cursor: "pointer",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: active || hovered ? `0 0 34px ${color}22` : "none",
        transition: "transform 160ms ease, box-shadow 160ms ease, border 160ms ease",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 999, background: `${color}22`, color, display: "grid", placeItems: "center", fontWeight: 950 }}>
          {initialsFor(job.customer)}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 950 }}>{job.customer || "Unnamed customer"}</div>
          <div style={{ marginTop: 6, color: "rgba(226,232,240,0.74)" }}>{job.service || "Service not added"}</div>
        </div>
      </div>

      <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ color: "rgba(186,230,253,0.58)" }}>
          {job.beforePhotos.length + job.afterPhotos.length} proof
        </div>
        <div style={{ borderRadius: 999, background: `${color}22`, color, padding: "8px 12px", fontWeight: 900, fontSize: 12 }}>
          {job.paymentStatus === "paid" ? "Paid" : job.stage}
        </div>
      </div>
    </button>
  );
}

function TopButton({ children, onClick, primary = false }: { children: ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 999,
        border: primary ? "1px solid rgba(34,197,94,0.55)" : "1px solid rgba(148,163,184,0.24)",
        background: primary ? "rgba(16,185,129,0.16)" : "rgba(15,23,42,0.58)",
        color: primary ? "#86efac" : "white",
        padding: "15px 24px",
        fontWeight: 900,
        cursor: "pointer",
        boxShadow: primary ? "0 0 28px rgba(16,185,129,0.12)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function ActionButton({ label, top, onClick }: { label: string; top: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={actionButton}>
      <div style={{ color: "#67e8f9", fontSize: 15, marginBottom: 6 }}>{top}</div>
      {label}
    </button>
  );
}

function ProofButton({ title, count, onClick }: { title: string; count: number; onClick: () => void }) {
  return (
    <button onClick={onClick} style={proofButton}>
      <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: "0.1em", color: "#a7f3d0" }}>{title}</div>
      <div style={{ marginTop: 12, fontSize: 23 }}>📷</div>
      <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.78)" }}>Upload photo</div>
      <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.48)" }}>{count} uploaded</div>
    </button>
  );
}

function PanelTitle({ children }: { children: ReactNode }) {
  return <div style={{ color: "rgba(186,230,253,0.76)", fontSize: 13, fontWeight: 950, letterSpacing: 1.8 }}>{children}</div>;
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div style={{ color: "rgba(186,230,253,0.65)", fontSize: 13, fontWeight: 950, letterSpacing: 1.4 }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 28 }}>{value}</div>
    </div>
  );
}

const page: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 18% 14%, rgba(56,189,248,0.22), transparent 34%), radial-gradient(circle at 82% 18%, rgba(16,185,129,0.18), transparent 32%), radial-gradient(circle at 50% 100%, rgba(168,85,247,0.08), transparent 34%), #020817",
  color: "white",
  padding: 24,
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const header: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  alignItems: "center",
  marginBottom: 34,
  flexWrap: "wrap",
};

const orb: CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.42), rgba(34,211,238,0.16), rgba(15,23,42,0.9))",
  border: "1px solid rgba(125,211,252,0.38)",
  color: "#a7f3d0",
  fontWeight: 950,
  boxShadow: "0 0 36px rgba(34,211,238,0.16)",
};

const layout: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 500px",
  gap: 28,
  alignItems: "start",
};

const boardSurface: CSSProperties = {
  minHeight: 690,
  borderRadius: 28,
  border: "1px solid rgba(56,189,248,0.26)",
  background: "linear-gradient(180deg, rgba(8,47,73,0.24), rgba(2,6,23,0.66))",
  boxShadow: "0 30px 100px rgba(0,0,0,0.35), inset 0 0 90px rgba(56,189,248,0.06)",
  padding: 22,
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
  gap: 18,
  overflow: "auto",
};

const stageColumn: CSSProperties = {
  borderRight: "1px solid rgba(148,163,184,0.14)",
  paddingRight: 18,
};

const stageHeader: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  marginBottom: 22,
};

const stageCount: CSSProperties = {
  minWidth: 28,
  height: 28,
  borderRadius: 999,
  background: "rgba(15,23,42,0.72)",
  display: "grid",
  placeItems: "center",
  color: "rgba(226,232,240,0.82)",
  fontWeight: 900,
};

const emptyCard: CSSProperties = {
  borderRadius: 18,
  border: "1px dashed rgba(148,163,184,0.18)",
  background: "rgba(15,23,42,0.32)",
  padding: 16,
  color: "rgba(186,230,253,0.52)",
  fontSize: 13,
  fontWeight: 800,
};

const activePanel: CSSProperties = {
  borderRadius: 30,
  border: "1px solid rgba(56,189,248,0.24)",
  background: "linear-gradient(180deg, rgba(8,47,73,0.34), rgba(2,6,23,0.82))",
  boxShadow: "0 30px 100px rgba(0,0,0,0.38), inset 0 0 80px rgba(34,211,238,0.05)",
  padding: 24,
  position: "sticky",
  top: 24,
  maxHeight: "calc(100vh - 48px)",
  overflow: "auto",
};

const statusPill: CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(34,211,238,0.34)",
  background: "rgba(34,211,238,0.10)",
  color: "#67e8f9",
  padding: "8px 12px",
  fontWeight: 950,
  fontSize: 12,
};

const actionGrid: CSSProperties = {
  marginTop: 28,
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  borderRadius: 18,
  overflow: "hidden",
  border: "1px solid rgba(148,163,184,0.14)",
  background: "rgba(15,23,42,0.46)",
};

const actionButton: CSSProperties = {
  border: 0,
  borderRight: "1px solid rgba(148,163,184,0.10)",
  background: "transparent",
  color: "white",
  padding: "16px 8px",
  cursor: "pointer",
  fontWeight: 800,
};

const detailsBox: CSSProperties = {
  marginTop: 24,
  borderRadius: 22,
  border: "1px solid rgba(56,189,248,0.16)",
  background: "linear-gradient(180deg, rgba(15,23,42,0.58), rgba(2,6,23,0.48))",
  padding: 16,
  display: "grid",
  gap: 12,
};

const field: CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.18)",
  background: "rgba(15,23,42,0.72)",
  color: "white",
  padding: "13px 14px",
  fontSize: 13,
  fontWeight: 800,
  boxSizing: "border-box",
  outline: "none",
};

const detailsButton: CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(56,189,248,0.20)",
  background: "rgba(15,23,42,0.66)",
  color: "white",
  padding: "13px 14px",
  fontWeight: 900,
  cursor: "pointer",
};

const infoBox: CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(56,189,248,0.14)",
  background: "rgba(15,23,42,0.55)",
  padding: 12,
  color: "rgba(226,232,240,0.82)",
  fontSize: 12,
  lineHeight: 1.55,
};

const proofButton: CSSProperties = {
  minHeight: 116,
  borderRadius: 18,
  border: "1px dashed rgba(125,211,252,0.36)",
  background: "rgba(0,0,0,0.24)",
  color: "white",
  padding: 12,
  cursor: "pointer",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
};

const proofArrow: CSSProperties = {
  height: 34,
  width: 34,
  alignSelf: "center",
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  background: "rgba(16,185,129,0.16)",
  border: "1px solid rgba(52,211,153,0.32)",
  color: "#6ee7b7",
  boxShadow: "0 0 24px rgba(16,185,129,0.18)",
  fontWeight: 950,
};

const stageRail: CSSProperties = {
  position: "relative",
  height: 32,
  marginTop: 18,
  borderTop: "2px solid rgba(148,163,184,0.20)",
};

const stageProgress: CSSProperties = {
  position: "absolute",
  top: -2,
  left: 0,
  height: 2,
  background: "linear-gradient(90deg, #38bdf8, #22d3ee, #a78bfa, #4ade80)",
};

const stageDot: CSSProperties = {
  position: "absolute",
  top: -11,
  width: 22,
  height: 22,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.20)",
  cursor: "pointer",
};

const stageLabels: CSSProperties = {
  marginTop: 10,
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 8,
};

const stageLabelButton: CSSProperties = {
  border: 0,
  background: "transparent",
  fontWeight: 900,
  fontSize: 12,
  cursor: "pointer",
};

const timelineRow: CSSProperties = {
  marginTop: 12,
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  color: "rgba(226,232,240,0.78)",
  fontSize: 13,
  lineHeight: 1.45,
};

const statsBar: CSSProperties = {
  marginTop: 26,
  borderRadius: 28,
  border: "1px solid rgba(56,189,248,0.16)",
  background: "rgba(15,23,42,0.46)",
  padding: 20,
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 18,
};

































const mobileLayout: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 18,
  alignItems: "start",
};

const collapsedActivationButton: CSSProperties = {
  position: "fixed",
  right: 16,
  bottom: 16,
  zIndex: 50,
  borderRadius: 999,
  border: "1px solid rgba(74, 222, 128, 0.35)",
  background: "linear-gradient(135deg, rgba(34,197,94,0.95), rgba(16,185,129,0.92))",
  color: "#04130c",
  fontWeight: 800,
  fontSize: 13,
  padding: "12px 18px",
  boxShadow: "0 18px 45px rgba(16,185,129,0.35)",
  cursor: "pointer",
};

const mobileBoardSurface: CSSProperties = {
  ...boardSurface,
  minHeight: 0,
  display: "grid",
  gridAutoFlow: "column",
  gridAutoColumns: "82vw",
  gridTemplateColumns: "none",
  gap: 14,
  overflowX: "auto",
  overflowY: "hidden",
  padding: 16,
  scrollSnapType: "x mandatory",
  WebkitOverflowScrolling: "touch",
};

const mobileActivePanel: CSSProperties = {
  ...activePanel,
  position: "relative",
  top: 0,
  maxHeight: "none",
  padding: 18,
};







