import { useMemo, useRef, useState, type ReactNode } from "react";

type JobStage = "IN PROGRESS" | "PROOF ADDED" | "PAYMENT" | "COMPLETE";

type Job = {
  id: string;
  stage: JobStage;
  initials: string;
  name: string;
  service: string;
  phone: string;
  address: string;
  time: string;
  status: string;
  color: string;
  notes: string;
  paymentUrl: string;
  invoiceUrl: string;
  invoiceAmount: string;
  invoiceNote: string;
  beforePhotos: string[];
  afterPhotos: string[];
  archived?: boolean;
  timeline: string[];
};

const stageMeta: { title: JobStage; countLabel: string; color: string }[] = [
  { title: "IN PROGRESS", countLabel: "2", color: "#38bdf8" },
  { title: "PROOF ADDED", countLabel: "1", color: "#22d3ee" },
  { title: "PAYMENT", countLabel: "1", color: "#a78bfa" },
  { title: "COMPLETE", countLabel: "3", color: "#4ade80" },
];

const starterJobs: Job[] = [
  {
    id: "job-maria",
    stage: "IN PROGRESS",
    initials: "MJ",
    name: "Maria Jenkins",
    service: "House wash + driveway",
    phone: "8635550184",
    address: "Okeechobee, FL",
    time: "12:42 PM",
    status: "In Progress",
    color: "#38bdf8",
    notes: "Customer sent photos. Driveway has mildew near garage. Wants earliest available appointment.",
    paymentUrl: "https://cash.app/$xander",
    invoiceUrl: "",
    invoiceAmount: "125.00",
    invoiceNote: "House wash + driveway cleaning",
    beforePhotos: [],
    afterPhotos: [],
    timeline: ["Work started", "Before photo added", "Work in progress", "Customer notified"],
  },
  {
    id: "job-kevin",
    stage: "PROOF ADDED",
    initials: "KS",
    name: "Kevin Smith",
    service: "Gutter clean out",
    phone: "8635550191",
    address: "Taylor Creek, FL",
    time: "12:42 PM",
    status: "Proof Added",
    color: "#22d3ee",
    notes: "Before photos attached. Waiting for customer review.",
    paymentUrl: "",
    invoiceUrl: "",
    invoiceAmount: "125.00",
    invoiceNote: "House wash + driveway cleaning",
    beforePhotos: [],
    afterPhotos: [],
    timeline: ["Request received", "Photos added", "Proof attached"],
  },
  {
    id: "job-alex",
    stage: "PAYMENT",
    initials: "AB",
    name: "Alex Brown",
    service: "Roof soft wash",
    phone: "8635550198",
    address: "Okeechobee, FL",
    time: "12:42 PM",
    status: "Payment",
    color: "#a78bfa",
    notes: "Invoice ready. Waiting for payment confirmation.",
    paymentUrl: "",
    invoiceUrl: "",
    invoiceAmount: "125.00",
    invoiceNote: "House wash + driveway cleaning",
    beforePhotos: [],
    afterPhotos: [],
    timeline: ["Work complete", "Invoice ready", "Payment pending"],
  },
  {
    id: "job-lisa",
    stage: "COMPLETE",
    initials: "LH",
    name: "Lisa Harris",
    service: "Patio + deck cleaning",
    phone: "8635550122",
    address: "Okeechobee, FL",
    time: "12:42 PM",
    status: "Complete",
    color: "#4ade80",
    notes: "Job completed and marked paid.",
    paymentUrl: "",
    invoiceUrl: "",
    invoiceAmount: "125.00",
    invoiceNote: "House wash + driveway cleaning",
    beforePhotos: [],
    afterPhotos: [],
    timeline: ["Work finished", "Payment received", "Completed"],
  },
];

export default function ZandsLightXandBoard() {
  const [jobs, setJobs] = useState<Job[]>(starterJobs);
  const [selectedJobId, setSelectedJobId] = useState("job-maria");
  const [hoveredJobId, setHoveredJobId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) || jobs[0],
    [jobs, selectedJobId]
  );

  function updateJob(jobId: string, updates: Partial<Job>) {
    setJobs((current) =>
      current.map((job) => (job.id === jobId ? { ...job, ...updates } : job))
    );
  }

  function archiveSelectedJob() {
    const confirmed = window.confirm("Archive this job and keep its proof history?");
    if (!confirmed) return;

    setJobs((current) => {
      const next = current.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              archived: true,
              timeline: ["Job archived with proof history", ...job.timeline],
            }
          : job
      );

      const nextActive = next.find((job) => !job.archived);

      if (nextActive) {
        setSelectedJobId(nextActive.id);
      }

      return next;
    });
  }

  function addProofPhoto(type: "before" | "after", fileName: string) {
    if (type === "before") {
      updateJob(selectedJob.id, {
        beforePhotos: [...selectedJob.beforePhotos, fileName],
        timeline: [`Before photo added: ${fileName}`, ...selectedJob.timeline],
      });
      return;
    }

    updateJob(selectedJob.id, {
      afterPhotos: [...selectedJob.afterPhotos, fileName],
      timeline: [`After photo added: ${fileName}`, ...selectedJob.timeline],
    });
  }

  function moveSelectedJob(stage: JobStage) {
    const meta = stageMeta.find((item) => item.title === stage);
    updateJob(selectedJob.id, {
      stage,
      status: titleCase(stage),
      color: meta?.color || selectedJob.color,
      timeline: [`Moved to ${titleCase(stage)}`, ...selectedJob.timeline],
    });
  }

  return (
    <main style={page}>
      <section style={{ maxWidth: 1720, margin: "0 auto" }}>
        <Header onQrPayment={() => {
          setPaymentOpen(true);
          window.setTimeout(() => {
            document.getElementById("payment-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 50);
        }} />

        <section style={layout}>
          <div style={boardSurface}>
            {stageMeta.map((stage) => {
              const stageJobs = jobs.filter((job) => job.stage === stage.title && !job.archived);

              return (
                <div key={stage.title} style={stageColumn}>
                  <div style={stageHeader}>
                    <div style={{ fontSize: 14, fontWeight: 950, letterSpacing: 1 }}>
                      <span style={{ color: stage.color, marginRight: 10 }}>●</span>
                      {stage.title}
                    </div>
                    <div style={stageCount}>{stageJobs.length}</div>
                  </div>

                  <div style={{ display: "grid", gap: 12 }}>
                    {stageJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        active={selectedJob.id === job.id}
                        hovered={hoveredJobId === job.id}
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setDetailsOpen(false);
                          setPaymentOpen(false);
                        }}
                        onMouseEnter={() => setHoveredJobId(job.id)}
                        onMouseLeave={() => setHoveredJobId(null)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <aside style={activePanel}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <PanelTitle>ACTIVE JOB</PanelTitle>
              <div style={statusPill}>{selectedJob.status}</div>
            </div>

            <h2 style={{ fontSize: 34, margin: "26px 0 6px" }}>{selectedJob.name}</h2>
            <div style={{ color: "rgba(186,230,253,0.78)", fontSize: 18, fontWeight: 800 }}>
              {selectedJob.service}
            </div>

            <div style={actionGrid}>
              <ActionButton label="Call" top="CALL" onClick={() => (window.location.href = `tel:${selectedJob.phone}`)} />
              <ActionButton label="Message" top="MSG" onClick={() => (window.location.href = `sms:${selectedJob.phone}`)} />
              <ActionButton label="Navigate" top="GO" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedJob.address)}`, "_blank")} />
              <ActionButton label="PAY" top="PAY" onClick={() => setPaymentOpen((open) => !open)} />
            </div>

            {paymentOpen ? (
              <div id="payment-panel" style={detailsBox}>
                <PanelTitle>PAYMENT QR</PanelTitle>

                <input
                  style={field}
                  value={selectedJob.paymentUrl}
                  placeholder="Cash App / Venmo / Zelle / payment link"
                  onChange={(event) => updateJob(selectedJob.id, { paymentUrl: event.target.value })}
                />

                <div style={{ borderRadius: 18, background: "white", padding: 14, textAlign: "center" }}>
                  <img
                    alt="Payment QR"
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=${encodeURIComponent(selectedJob.invoiceUrl || selectedJob.invoiceUrl || selectedJob.paymentUrl || window.location.href)}`}
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

                <input style={field} value={selectedJob.name} onChange={(event) => updateJob(selectedJob.id, { name: event.target.value })} />
                <input style={field} value={selectedJob.service} onChange={(event) => updateJob(selectedJob.id, { service: event.target.value })} />
                <input style={field} value={selectedJob.phone} onChange={(event) => updateJob(selectedJob.id, { phone: event.target.value })} />
                <input style={field} value={selectedJob.address} onChange={(event) => updateJob(selectedJob.id, { address: event.target.value })} />
                <textarea style={{ ...field, minHeight: 92, resize: "vertical" }} value={selectedJob.notes} onChange={(event) => updateJob(selectedJob.id, { notes: event.target.value })} />
              </div>
            ) : null}

            
            <div style={detailsBox}>
              <PanelTitle>INVOICE</PanelTitle>

              <input
                style={field}
                value={selectedJob.invoiceAmount}
                placeholder="Invoice amount"
                onChange={(event) =>
                  updateJob(selectedJob.id, {
                    invoiceAmount: event.target.value,
                  })
                }
              />

              <textarea
                style={{ ...field, minHeight: 70, resize: "vertical" }}
                value={selectedJob.invoiceNote}
                placeholder="Invoice note / work completed"
                onChange={(event) =>
                  updateJob(selectedJob.id, {
                    invoiceNote: event.target.value,
                  })
                }
              />

              <button
                onClick={() => {
                  const invoiceLink = `${window.location.origin}/planet/invoice/zands-light-xand/${selectedJob.id}`;
                  const customerPhone = selectedJob.phone || "8635550184";
                  const message = `Hi ${selectedJob.name}, here is your invoice for ${selectedJob.service}. Amount: ${selectedJob.invoiceAmount}. Pay here: ${invoiceLink}`;

                  updateJob(selectedJob.id, {
                    invoiceUrl: invoiceLink,
                    timeline: ["Invoice sent to customer", ...selectedJob.timeline],
                  });

                  setPaymentOpen(true);
                  window.location.href = `sms:${customerPhone}?&body=${encodeURIComponent(message)}`;
                }}
                style={detailsButton}
              >
                Send Invoice
              </button>

              <div
                style={{
                  marginTop: 12,
                  borderRadius: 16,
                  border: "1px solid rgba(56,189,248,0.14)",
                  background: "rgba(15,23,42,0.55)",
                  padding: 12,
                  color: "rgba(226,232,240,0.82)",
                  fontSize: 12,
                  lineHeight: 1.55,
                }}
              >
                <div style={{ fontWeight: 950, color: "#67e8f9" }}>Ready to text invoice</div>
                <div>To: {selectedJob.phone || "863-555-0184"}</div>
                <div>Amount: ${selectedJob.invoiceAmount}</div>
                <div style={{ wordBreak: "break-all" }}>
                  Link: {selectedJob.invoiceUrl || "Invoice link creates when sent"}
                </div>
              </div>
            </div>

            <div style={detailsBox}>
              <PanelTitle>PHOTO PROOF</PanelTitle>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button style={detailsButton} onClick={() => beforeInputRef.current?.click()}>
                  Add Before
                </button>

                <button style={detailsButton} onClick={() => afterInputRef.current?.click()}>
                  Add After
                </button>
              </div>

              <input
                ref={beforeInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) addProofPhoto("before", file.name);
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
                  if (file) addProofPhoto("after", file.name);
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
                {stageMeta.map((stage, index) => (
                  <button
                    key={stage.title}
                    onClick={() => moveSelectedJob(stage.title)}
                    style={{
                      ...stageDot,
                      left: `${index * 33}%`,
                      background: selectedJob.stage === stage.title ? stage.color : "rgba(15,23,42,0.95)",
                      boxShadow: selectedJob.stage === stage.title ? `0 0 18px ${stage.color}` : "none",
                    }}
                    title={stage.title}
                  />
                ))}
                <div style={{ ...stageProgress, width: selectedJob.stage === "IN PROGRESS" ? "0%" : selectedJob.stage === "PROOF ADDED" ? "33%" : selectedJob.stage === "PAYMENT" ? "66%" : "100%" }} />
              </div>

              <div style={stageLabels}>
                {stageMeta.map((stage) => (
                  <button
                    key={stage.title}
                    onClick={() => moveSelectedJob(stage.title)}
                    style={{
                      ...stageLabelButton,
                      color: selectedJob.stage === stage.title ? stage.color : "rgba(186,230,253,0.58)",
                    }}
                  >
                    {shortStage(stage.title)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 36 }}>
              <PanelTitle>TRUTH TRAIL</PanelTitle>
              {selectedJob.timeline.slice(0, 4).map((item, index) => (
                <div key={`${item}-${index}`} style={timelineRow}>
                  <div>
                    <span style={{ color: selectedJob.color, marginRight: 12 }}>●</span>
                    {item}
                  </div>
                  <div style={{ color: "rgba(186,230,253,0.62)" }}>12:{42 + index * 3} PM</div>
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
          </aside>
        </section>

        <footer style={statsBar}>
          <Stat title="TODAY'S FLOW" value={`${jobs.length} Jobs`} />
          <Stat title="COMPLETED" value={`${jobs.filter((job) => job.stage === "COMPLETE").length}`} />
          <Stat title="PAYMENTS" value={`${jobs.filter((job) => job.stage === "PAYMENT").length} Pending`} />
          <Stat title="PROOFS" value={`${jobs.filter((job) => job.stage === "PROOF ADDED").length} New`} />
        </footer>
      </section>
    </main>
  );
}

function Header({ onQrPayment }: { onQrPayment: () => void }) {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "center", marginBottom: 34 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={orb}>*</div>
        <div>
          <div style={{ color: "rgba(186,230,253,0.72)", fontSize: 18 }}>
            Welcome, <strong style={{ color: "white" }}>Xander</strong> <span style={{ color: "#22c55e" }}>-</span>
          </div>
          <h1 style={{ margin: "6px 0", fontSize: 54, lineHeight: 0.95, letterSpacing: -2.2, fontWeight: 500 }}>
            Liveboard
          </h1>
          <div style={{ color: "rgba(186,230,253,0.78)", fontSize: 19 }}>
            Jobs in motion. Proof. Payments. Completion.
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <TopButton primary onClick={() => window.open("/planet/request/zands-light-xand", "_blank")}>+ New Request</TopButton>
        <TopButton onClick={() => window.open("/planet/staff/zands-light-xand", "_blank")}>Staff Board</TopButton>
        <TopButton onClick={() => window.open("/planet/request/zands-light-xand", "_blank")}>Customer Front Door</TopButton>
        <TopButton onClick={onQrPayment}>QR Payment</TopButton>
      </nav>
    </header>
  );
}

function JobCard({ job, active, hovered, onClick, onMouseEnter, onMouseLeave }: { job: Job; active: boolean; hovered: boolean; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        textAlign: "left",
        borderRadius: 18,
        border: active ? `1px solid ${job.color}` : `1px solid ${job.color}55`,
        background: `linear-gradient(145deg, ${job.color}22, rgba(2,6,23,0.56))`,
        padding: 18,
        minHeight: 126,
        color: "white",
        cursor: "pointer",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: active || hovered ? `0 0 34px ${job.color}22` : "none",
        transition: "transform 160ms ease, box-shadow 160ms ease, border 160ms ease",
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 999, background: `${job.color}22`, color: job.color, display: "grid", placeItems: "center", fontWeight: 950 }}>
          {job.initials}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 950 }}>{job.name}</div>
          <div style={{ marginTop: 6, color: "rgba(226,232,240,0.74)" }}>{job.service}</div>
        </div>
      </div>

      <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ color: "rgba(186,230,253,0.58)" }}>{job.time}</div>
        <div style={{ borderRadius: 999, background: `${job.color}22`, color: job.color, padding: "8px 12px", fontWeight: 900, fontSize: 12 }}>
          {job.status}
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
    <button onClick={onClick} style={{ border: 0, borderRight: "1px solid rgba(148,163,184,0.10)", background: "transparent", color: "white", padding: "16px 8px", cursor: "pointer", fontWeight: 800 }}>
      <div style={{ color: "#67e8f9", fontSize: 15, marginBottom: 6 }}>{top}</div>
      {label}
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

function titleCase(stage: JobStage) {
  return stage
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function shortStage(stage: JobStage) {
  if (stage === "IN PROGRESS") return "In Progress";
  if (stage === "PROOF ADDED") return "Proof";
  if (stage === "PAYMENT") return "Payment";
  return "Complete";
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 18% 14%, rgba(56,189,248,0.18), transparent 34%), radial-gradient(circle at 82% 18%, rgba(16,185,129,0.14), transparent 32%), #020817",
  color: "white",
  padding: 24,
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const layout: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 500px",
  gap: 28,
  alignItems: "start",
};

const boardSurface: React.CSSProperties = {
  minHeight: 690,
  borderRadius: 28,
  border: "1px solid rgba(56,189,248,0.26)",
  background: "linear-gradient(180deg, rgba(8,47,73,0.24), rgba(2,6,23,0.66))",
  boxShadow: "0 30px 100px rgba(0,0,0,0.35), inset 0 0 90px rgba(56,189,248,0.06)",
  padding: 22,
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
  gap: 18,
  overflow: "hidden",
};

const stageColumn: React.CSSProperties = {
  borderRight: "1px solid rgba(148,163,184,0.14)",
  paddingRight: 18,
};

const stageHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 22,
};

const stageCount: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 999,
  background: "rgba(15,23,42,0.72)",
  display: "grid",
  placeItems: "center",
  color: "rgba(226,232,240,0.82)",
  fontWeight: 900,
};

const activePanel: React.CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(56,189,248,0.32)",
  background: "linear-gradient(160deg, rgba(8,47,73,0.55), rgba(2,6,23,0.82))",
  boxShadow: "0 0 70px rgba(56,189,248,0.13), inset 0 1px 0 rgba(255,255,255,0.08)",
  padding: 28,
};

const statusPill: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(56,189,248,0.35)",
  background: "rgba(14,165,233,0.14)",
  color: "#22d3ee",
  padding: "9px 15px",
  fontWeight: 950,
};

const actionGrid: React.CSSProperties = {
  marginTop: 26,
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  borderRadius: 18,
  overflow: "hidden",
  background: "rgba(15,23,42,0.58)",
};

const detailsBox: React.CSSProperties = {
  marginTop: 18,
  borderRadius: 18,
  border: "1px solid rgba(56,189,248,0.16)",
  background: "rgba(15,23,42,0.42)",
  padding: 14,
  display: "grid",
  gap: 10,
};

const field: React.CSSProperties = {
  borderRadius: 12,
  border: "1px solid rgba(148,163,184,0.20)",
  background: "rgba(2,6,23,0.58)",
  color: "white",
  padding: "12px 14px",
  fontWeight: 800,
  outline: "none",
};

const stageRail: React.CSSProperties = {
  marginTop: 24,
  height: 4,
  background: "rgba(148,163,184,0.22)",
  position: "relative",
};

const stageProgress: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  height: 4,
  background: "#0ea5e9",
  boxShadow: "0 0 18px rgba(56,189,248,0.9)",
  transition: "width 180ms ease",
};

const stageDot: React.CSSProperties = {
  position: "absolute",
  top: -10,
  width: 22,
  height: 22,
  borderRadius: 999,
  border: "3px solid rgba(56,189,248,0.28)",
  transform: "translateX(-50%)",
  cursor: "pointer",
  zIndex: 2,
};

const stageLabels: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  marginTop: 18,
};

const stageLabelButton: React.CSSProperties = {
  background: "transparent",
  border: 0,
  fontWeight: 900,
  cursor: "pointer",
  textAlign: "center",
};

const timelineRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 18,
  color: "rgba(226,232,240,0.88)",
};

const detailsButton: React.CSSProperties = {
  marginTop: 28,
  width: "100%",
  borderRadius: 18,
  border: "1px solid rgba(56,189,248,0.24)",
  background: "rgba(14,165,233,0.16)",
  color: "white",
  padding: "18px",
  fontSize: 16,
  fontWeight: 950,
  cursor: "pointer",
};

const statsBar: React.CSSProperties = {
  marginTop: 22,
  borderRadius: 26,
  border: "1px solid rgba(56,189,248,0.12)",
  background: "linear-gradient(90deg, rgba(8,47,73,0.26), rgba(2,6,23,0.72))",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 20,
  padding: 26,
};

const orb: React.CSSProperties = {
  width: 92,
  height: 92,
  borderRadius: 999,
  border: "1px solid rgba(56,189,248,0.35)",
  background: "radial-gradient(circle, rgba(56,189,248,0.26), rgba(15,23,42,0.85) 68%)",
  boxShadow: "0 0 45px rgba(56,189,248,0.22), inset 0 0 30px rgba(56,189,248,0.12)",
  display: "grid",
  placeItems: "center",
  fontSize: 42,
  color: "#7dd3fc",
};














