import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import BeautySalonLiveBoard from "./BeautySalonLiveBoard";
import OperationalLiveBoard from "./OperationalLiveBoard";
import CampAquaflowStandalone from "./CampAquaflowStandalone";
import AutoRepairLiveBoard from "./AutoRepairLiveBoard";
import { getLiveBoardTemplate } from "../config/liveBoardTemplates";
import TemplateLiveBoard from "./TemplateLiveBoard";

type LiveBoardLocationState = {
  businessType?: string;
  businessName?: string;
  boardSlug?: string;
  primaryGoal?: string;
};

type StarterBoardRow = {
  board_slug: string;
  business_name: string | null;
  business_type: string | null;
  city: string | null;
  owner_name: string | null;
  phone: string | null;
  presence_id: string | null;
  presence_key: string | null;
  starter_plan: string | null;
  is_active: boolean | null;
  claim_status: string | null;
  created_at?: string | null;
};

type CreatorSystemPayload = {
  boardSlug?: string;
  presenceId?: string;
  businessName?: string;
  createdAt?: string;
  systemFlags?: {
    publicPage?: boolean;
    liveBoard?: boolean;
    staffBoard?: boolean;
    lobbyBoard?: boolean;
    momentPage?: boolean;
  };
};

type LiveJobStage = string;

type PaymentStatus = "none" | "invoice-ready" | "paid";

type PaymentTab = "payment" | "customer";

type LiveJob = {
  id: string;
  customer: string;
  title: string;
  note: string;
  stage: LiveJobStage;
  createdAt: string;
  updatedAt: string;
  paymentStatus?: PaymentStatus;
  invoiceAmount?: string;
  invoiceMemo?: string;
  invoiceId?: string;
  invoiceCreatedAt?: string;
  paidAt?: string;
};

const FALLBACK_LIVE_JOB_STAGES: LiveJobStage[] = ["New Intake", "In Progress", "Needs Attention", "Complete"];

const CASH_APP_HANDLE = "$YourRealCashtag";
const ZELLE_CONTACT = "your@email.com";

function normalize(value?: string | null) {
  return (value || "").toLowerCase().trim();
}

function looksLikeCamp(input: {
  businessType?: string | null;
  businessName?: string | null;
  boardSlug?: string | null;
  primaryGoal?: string | null;
}) {
  const haystack = [input.businessType, input.businessName, input.boardSlug, input.primaryGoal]
    .map(normalize)
    .join(" ");

  return (
    haystack.includes("camp") ||
    haystack.includes("summer camp") ||
    haystack.includes("kids camp") ||
    haystack.includes("daycare") ||
    haystack.includes("child") ||
    haystack.includes("children") ||
    haystack.includes("youth")
  );
}

function looksLikeAuto(input: {
  businessType?: string | null;
  businessName?: string | null;
  boardSlug?: string | null;
  primaryGoal?: string | null;
}) {
  const haystack = [input.businessType, input.businessName, input.boardSlug, input.primaryGoal]
    .map(normalize)
    .join(" ");

  return (
    haystack.includes("auto") ||
    haystack.includes("repair") ||
    haystack.includes("mechanic") ||
    haystack.includes("service shop") ||
    haystack.includes("diagnostic") ||
    haystack.includes("oil change") ||
    haystack.includes("tire") ||
    haystack.includes("alignment")
  );
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function readStarterPayload() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem("hp_starter_payload");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readCreatorSystemPayload(boardSlug?: string | null): CreatorSystemPayload | null {
  if (!boardSlug || typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(`hp-system:${boardSlug}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function liveJobsKey(boardSlug: string) {
  return `hp-live-board:${boardSlug}:jobs`;
}

function readLiveJobs(boardSlug: string): LiveJob[] {
  if (!boardSlug || typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(liveJobsKey(boardSlug));
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => {
      return (
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.customer === "string" &&
        typeof item.title === "string" &&
        typeof item.note === "string" &&
        typeof item.stage === "string"
      );
    });
  } catch {
    return [];
  }
}

function saveLiveJobs(boardSlug: string, jobs: LiveJob[]) {
  if (!boardSlug || typeof window === "undefined") return;

  try {
    window.localStorage.setItem(liveJobsKey(boardSlug), JSON.stringify(jobs));
  } catch (error) {
    console.warn("[live-board] local job save failed:", error);
  }
}

function uid(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function QRCodeImg({ value, size = 132 }: { value: string; size?: number }) {
  const src =
    "https://api.qrserver.com/v1/create-qr-code/?size=" +
    `${size}x${size}` +
    "&data=" +
    encodeURIComponent(value);

  return (
    <img
      src={src}
      width={size}
      height={size}
      style={{ borderRadius: 12, display: "block" }}
      alt="Payment QR code"
    />
  );
}

async function copyText(value: string, fallbackLabel = "Copied.") {
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
    alert(fallbackLabel);
  } catch {
    alert(value);
  }
}

function CreatorSystemLiveBoard({
  boardSlug,
  payload,
}: {
  boardSlug: string;
  payload: CreatorSystemPayload;
}) {
  const businessName = payload.businessName || titleFromSlug(boardSlug) || boardSlug;
  const createdAt = payload.createdAt ? new Date(payload.createdAt).toLocaleString() : "Just now";
  const operationalSystem = (payload as any)?.operationalSystem;
  const LIVE_JOB_STAGES: LiveJobStage[] =
    Array.isArray(operationalSystem?.stages) && operationalSystem.stages.length
      ? operationalSystem.stages.map((stage: any) => String(stage.label || stage.id || "Workflow Step"))
      : FALLBACK_LIVE_JOB_STAGES;

  const [jobs, setJobs] = useState<LiveJob[]>(() => readLiveJobs(boardSlug));
  const [showAddJob, setShowAddJob] = useState(false);
  const [jobCustomer, setJobCustomer] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobNote, setJobNote] = useState("");

  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editCustomer, setEditCustomer] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editStage, setEditStage] = useState<LiveJobStage>("New Intake");

  const [paymentJobId, setPaymentJobId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMemo, setPaymentMemo] = useState("");
  const [paymentTab, setPaymentTab] = useState<PaymentTab>("payment");
  const [customerPhone, setCustomerPhone] = useState("");

  useEffect(() => {
    setJobs(readLiveJobs(boardSlug));
  }, [boardSlug]);

  useEffect(() => {
    saveLiveJobs(boardSlug, jobs);
  }, [boardSlug, jobs]);

  const selectedPaymentJob = jobs.find((job) => job.id === paymentJobId) ?? null;

  const invoiceLink =
    selectedPaymentJob?.invoiceId && typeof window !== "undefined"
      ? `${window.location.origin}/planet/invoice/${selectedPaymentJob.invoiceId}`
      : "";

  const activeAmount = selectedPaymentJob?.invoiceAmount || paymentAmount || "";
  const activeMemo = selectedPaymentJob?.invoiceMemo || paymentMemo || "";
  const paymentQrValue =
    invoiceLink ||
    `HomePlanet Payment\nBusiness: ${businessName}\nCustomer: ${selectedPaymentJob?.customer || ""}\nAmount: ${activeAmount || "not set"}\nMemo: ${activeMemo || "not set"}`;

  const cashAppLink = `https://cash.app/${CASH_APP_HANDLE.replace("$", "")}`;
  const customerMessage = selectedPaymentJob
    ? [
        `Hi ${selectedPaymentJob.customer || "there"}, this is ${businessName}.`,
        `Your job is: ${selectedPaymentJob.title}.`,
        invoiceLink ? `Payment link: ${invoiceLink}` : "Payment link: create invoice first",
        `Amount: ${activeAmount || "not set"}`,
        `Memo: ${activeMemo || `${businessName} - ${selectedPaymentJob.title}`}`,
        `You can pay by Cash App (${CASH_APP_HANDLE}) or Zelle (${ZELLE_CONTACT}).`,
        "Reply here if you have any questions.",
      ].join("\n")
    : "";

  const cleanCustomerPhone = customerPhone.replace(/[^0-9+]/g, "");
  const smsHref =
    cleanCustomerPhone && selectedPaymentJob
      ? `sms:${cleanCustomerPhone}?&body=${encodeURIComponent(customerMessage)}`
      : "";
  const callHref = cleanCustomerPhone ? `tel:${cleanCustomerPhone}` : "";

  function addJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanCustomer = jobCustomer.trim();
    const cleanTitle = jobTitle.trim();
    const cleanNote = jobNote.trim();

    if (!cleanCustomer && !cleanTitle && !cleanNote) return;

    const now = new Date().toISOString();

    const job: LiveJob = {
      id: uid("job"),
      customer: cleanCustomer || "New customer",
      title: cleanTitle || "New job",
      note: cleanNote,
      stage: "New Intake",
      createdAt: now,
      updatedAt: now,
      paymentStatus: "none",
    };

    setJobs((current) => [job, ...current]);
    setJobCustomer("");
    setJobTitle("");
    setJobNote("");
    setShowAddJob(false);
  }

  function startEditJob(job: LiveJob) {
    setEditingJobId(job.id);
    setEditCustomer(job.customer);
    setEditTitle(job.title);
    setEditNote(job.note);
    setEditStage(job.stage);
    setShowAddJob(false);
    closePaymentPanel();
  }

  function cancelEditJob() {
    setEditingJobId(null);
    setEditCustomer("");
    setEditTitle("");
    setEditNote("");
    setEditStage("New Intake");
  }

  function saveEditedJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingJobId) return;

    const cleanCustomer = editCustomer.trim();
    const cleanTitle = editTitle.trim();
    const cleanNote = editNote.trim();

    setJobs((current) =>
      current.map((job) =>
        job.id === editingJobId
          ? {
              ...job,
              customer: cleanCustomer || "New customer",
              title: cleanTitle || "New job",
              note: cleanNote,
              stage: editStage,
              updatedAt: new Date().toISOString(),
            }
          : job,
      ),
    );

    cancelEditJob();
  }

  function moveJob(jobId: string, stage: LiveJobStage) {
    setJobs((current) =>
      current.map((job) =>
        job.id === jobId
          ? {
              ...job,
              stage,
              updatedAt: new Date().toISOString(),
            }
          : job,
      ),
    );
  }

  function deleteJob(jobId: string) {
    if (editingJobId === jobId) cancelEditJob();
    if (paymentJobId === jobId) closePaymentPanel();
    setJobs((current) => current.filter((job) => job.id !== jobId));
  }

  function openPaymentPanel(job: LiveJob) {
    setPaymentJobId(job.id);
    setPaymentAmount(job.invoiceAmount || "");
    setPaymentMemo(job.invoiceMemo || `${businessName} - ${job.title}`);
    setPaymentTab("payment");
    setShowAddJob(false);
    cancelEditJob();
  }

  function closePaymentPanel() {
    setPaymentJobId(null);
    setPaymentAmount("");
    setPaymentMemo("");
    setCustomerPhone("");
    setPaymentTab("payment");
  }

  function createInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedPaymentJob) return;

    const cleanAmount = paymentAmount.trim();
    const cleanMemo = paymentMemo.trim() || `${businessName} - ${selectedPaymentJob.title}`;
    const now = new Date().toISOString();
    const invoiceId = selectedPaymentJob.invoiceId || uid("invoice");

    setJobs((current) =>
      current.map((job) =>
        job.id === selectedPaymentJob.id
          ? {
              ...job,
              paymentStatus: "invoice-ready",
              invoiceAmount: cleanAmount,
              invoiceMemo: cleanMemo,
              invoiceId,
              invoiceCreatedAt: job.invoiceCreatedAt || now,
              updatedAt: now,
            }
          : job,
      ),
    );
  }

  function markSelectedJobPaid() {
    if (!selectedPaymentJob) return;

    const now = new Date().toISOString();

    setJobs((current) =>
      current.map((job) =>
        job.id === selectedPaymentJob.id
          ? {
              ...job,
              paymentStatus: "paid",
              paidAt: now,
              updatedAt: now,
            }
          : job,
      ),
    );
  }

  const wrap: CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(900px 600px at 15% 10%, rgba(56,189,248,0.16), transparent 55%), linear-gradient(180deg, #020617 0%, #030712 100%)",
    color: "white",
    padding: 22,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };

  const shell: CSSProperties = {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gap: 16,
  };

  const card: CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.045)",
    boxShadow: "0 20px 70px rgba(0,0,0,0.38)",
    padding: 18,
  };

  const columnCard: CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.24)",
    padding: 14,
    minHeight: 220,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const jobCard: CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.11)",
    background: "rgba(255,255,255,0.055)",
    padding: 12,
  };

  const selectedJobCard: CSSProperties = {
    ...jobCard,
    border: "1px solid rgba(112,242,163,0.35)",
    background: "rgba(112,242,163,0.08)",
  };

  const pill: CSSProperties = {
    display: "inline-flex",
    width: "fit-content",
    borderRadius: 999,
    border: "1px solid rgba(103,232,249,0.30)",
    background: "rgba(103,232,249,0.10)",
    color: "#bae6fd",
    padding: "7px 11px",
    fontSize: 11,
    fontWeight: 950,
    letterSpacing: 1.3,
    textTransform: "uppercase",
  };

  const paidPill: CSSProperties = {
    ...pill,
    border: "1px solid rgba(112,242,163,0.30)",
    background: "rgba(112,242,163,0.10)",
    color: "#bbf7d0",
    marginTop: 8,
  };

  const invoicePill: CSSProperties = {
    ...pill,
    border: "1px solid rgba(250,204,21,0.30)",
    background: "rgba(250,204,21,0.10)",
    color: "#fde68a",
    marginTop: 8,
  };

  const button: CSSProperties = {
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.07)",
    color: "white",
    borderRadius: 999,
    padding: "11px 14px",
    fontSize: 13,
    fontWeight: 950,
    cursor: "pointer",
  };

  const smallButton: CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    borderRadius: 999,
    padding: "7px 9px",
    fontSize: 11,
    fontWeight: 900,
    cursor: "pointer",
  };

  const primaryButton: CSSProperties = {
    ...button,
    border: "1px solid rgba(112,242,163,0.45)",
    background: "#70f2a3",
    color: "#001018",
  };

  const paymentButton: CSSProperties = {
    ...smallButton,
    border: "1px solid rgba(112,242,163,0.34)",
    color: "#bbf7d0",
  };

  const input: CSSProperties = {
    width: "100%",
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.28)",
    color: "white",
    padding: "0 12px",
    outline: "none",
    boxSizing: "border-box",
    fontWeight: 800,
  };

  const textarea: CSSProperties = {
    ...input,
    height: "auto",
    minHeight: 84,
    padding: 12,
    resize: "vertical",
    fontWeight: 700,
  };

  const paymentBox: CSSProperties = {
    marginTop: 14,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.24)",
    padding: 12,
  };

  const tabButton = (active: boolean): CSSProperties => ({
    ...(active ? primaryButton : button),
    width: "100%",
    justifyContent: "center",
  });

  return (
    <div style={wrap}>
      <div style={shell}>
        <section style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <div>
              <span style={pill}>Creator System Live Board</span>
              <h1 style={{ margin: "14px 0 4px", fontSize: 42, lineHeight: 1, letterSpacing: -1.2 }}>
                {businessName}
              </h1>
              <div style={{ color: "rgba(255,255,255,0.68)", fontWeight: 800 }}>
                Board: {boardSlug}
              </div>
            </div>

            <button
              type="button"
              style={primaryButton}
              onClick={() => {
                setShowAddJob((current) => !current);
                cancelEditJob();
                closePaymentPanel();
              }}
            >
              {showAddJob ? "Close Add Job" : "+ Add Job"}
            </button>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 14,
          }}
        >
          {[
            ["Live board", payload.systemFlags?.liveBoard ? "Ready" : "Created"],
            ["Payment layer", selectedPaymentJob ? "Job selected" : "Ready"],
            ["Lobby board", payload.systemFlags?.lobbyBoard ? "Ready" : "Created"],
            ["Created", createdAt],
          ].map(([label, value]) => (
            <div key={label} style={card}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 950 }}>
                {label.toUpperCase()}
              </div>
              <div style={{ marginTop: 8, fontSize: 18, fontWeight: 950 }}>{value}</div>
            </div>
          ))}
        </section>

        {showAddJob ? (
          <section style={{ ...card, border: "1px solid rgba(112,242,163,0.28)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 950, color: "#bbf7d0", letterSpacing: 1.2 }}>
                  NEW JOB
                </div>
                <div style={{ marginTop: 5, color: "rgba(255,255,255,0.62)", fontSize: 13, fontWeight: 700 }}>
                  Adds directly into the first live workflow step for this board.
                </div>
              </div>
            </div>

            <form onSubmit={addJob} style={{ display: "grid", gap: 10 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 10,
                }}
              >
                <input
                  style={input}
                  value={jobCustomer}
                  onChange={(event) => setJobCustomer(event.target.value)}
                  placeholder="Customer name"
                />
                <input
                  style={input}
                  value={jobTitle}
                  onChange={(event) => setJobTitle(event.target.value)}
                  placeholder="Job title / service"
                />
              </div>

              <textarea
                style={textarea}
                value={jobNote}
                onChange={(event) => setJobNote(event.target.value)}
                placeholder="Notes, address, request, or what needs attention..."
              />

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" style={primaryButton}>
                  Add to Workflow
                </button>
                <button type="button" style={button} onClick={() => setShowAddJob(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {editingJobId ? (
          <section style={{ ...card, border: "1px solid rgba(103,232,249,0.32)" }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 950, color: "#bae6fd", letterSpacing: 1.2 }}>
                EDIT JOB
              </div>
              <div style={{ marginTop: 5, color: "rgba(255,255,255,0.62)", fontSize: 13, fontWeight: 700 }}>
                Update customer, service, notes, or stage.
              </div>
            </div>

            <form onSubmit={saveEditedJob} style={{ display: "grid", gap: 10 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 10,
                }}
              >
                <input
                  style={input}
                  value={editCustomer}
                  onChange={(event) => setEditCustomer(event.target.value)}
                  placeholder="Customer name"
                />
                <input
                  style={input}
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  placeholder="Job title / service"
                />
                <select
                  style={input}
                  value={editStage}
                  onChange={(event) => setEditStage(event.target.value as LiveJobStage)}
                >
                  {LIVE_JOB_STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                style={textarea}
                value={editNote}
                onChange={(event) => setEditNote(event.target.value)}
                placeholder="Notes, address, request, or what needs attention..."
              />

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" style={primaryButton}>
                  Save Job
                </button>
                <button type="button" style={button} onClick={cancelEditJob}>
                  Cancel Edit
                </button>
              </div>
            </form>
          </section>
        ) : null}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: selectedPaymentJob ? "minmax(0, 1.45fr) minmax(320px, 0.78fr)" : "1fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          <section style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 950, color: "#bae6fd", letterSpacing: 1.2 }}>
                  LIVE WORKFLOW SYSTEM
                </div>
                <div style={{ marginTop: 6, color: "rgba(255,255,255,0.62)", fontSize: 13, fontWeight: 700 }}>
                  {jobs.length} active {jobs.length === 1 ? "job" : "jobs"} on this board.
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
                marginTop: 14,
              }}
            >
              {LIVE_JOB_STAGES.map((stage) => {
                const stageJobs = jobs.filter((job) => job.stage === stage);

                return (
                  <div key={stage} style={columnCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                      <div style={{ fontWeight: 950 }}>{stage}</div>
                      <div
                        style={{
                          minWidth: 24,
                          height: 24,
                          borderRadius: 999,
                          border: "1px solid rgba(255,255,255,0.14)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 950,
                          color: "rgba(255,255,255,0.74)",
                        }}
                      >
                        {stageJobs.length}
                      </div>
                    </div>

                    {stageJobs.length === 0 ? (
                      <div
                        style={{
                          marginTop: 4,
                          color: "rgba(255,255,255,0.55)",
                          fontSize: 13,
                          border: "1px dashed rgba(255,255,255,0.12)",
                          borderRadius: 14,
                          padding: 12,
                        }}
                      >
                        No items yet.
                      </div>
                    ) : null}

                    {stageJobs.map((job) => {
                      const isSelected = paymentJobId === job.id;

                      return (
                        <div key={job.id} style={isSelected ? selectedJobCard : jobCard}>
                          <div style={{ fontSize: 12, color: "#bae6fd", fontWeight: 950 }}>{job.customer}</div>
                          <div style={{ marginTop: 5, fontSize: 15, fontWeight: 950 }}>{job.title}</div>

                          {job.paymentStatus === "paid" ? <div style={paidPill}>PAID</div> : null}
                          {job.paymentStatus === "invoice-ready" ? <div style={invoicePill}>INVOICE READY</div> : null}

                          {job.note ? (
                            <div style={{ marginTop: 7, color: "rgba(255,255,255,0.68)", fontSize: 12, lineHeight: 1.45 }}>
                              {job.note}
                            </div>
                          ) : null}

                          <div style={{ marginTop: 8, color: "rgba(255,255,255,0.38)", fontSize: 11, fontWeight: 800 }}>
                            Updated {new Date(job.updatedAt || job.createdAt).toLocaleString()}
                          </div>

                          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
                            <button type="button" style={paymentButton} onClick={() => openPaymentPanel(job)}>
                              Payment
                            </button>

                            <button
                              type="button"
                              style={{
                                ...smallButton,
                                border: "1px solid rgba(103,232,249,0.26)",
                                color: "#bae6fd",
                              }}
                              onClick={() => startEditJob(job)}
                            >
                              Edit
                            </button>

                            {LIVE_JOB_STAGES.filter((nextStage) => nextStage !== job.stage).map((nextStage) => (
                              <button
                                key={nextStage}
                                type="button"
                                style={smallButton}
                                onClick={() => moveJob(job.id, nextStage)}
                              >
                                {nextStage}
                              </button>
                            ))}

                            <button
                              type="button"
                              style={{
                                ...smallButton,
                                border: "1px solid rgba(248,113,113,0.26)",
                                color: "#fecaca",
                              }}
                              onClick={() => deleteJob(job.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </section>

          {selectedPaymentJob ? (
            <aside style={{ ...card, border: "1px solid rgba(112,242,163,0.22)", position: "sticky", top: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 950, color: "#bbf7d0", letterSpacing: 1.2 }}>
                    PAYMENT LAYER
                  </div>
                  <h2 style={{ margin: "8px 0 4px", fontSize: 24, lineHeight: 1 }}>
                    Take payment
                  </h2>
                  <div style={{ color: "rgba(255,255,255,0.62)", fontSize: 13, lineHeight: 1.45 }}>
                    {selectedPaymentJob.customer} - {selectedPaymentJob.title}
                  </div>
                </div>

                <button type="button" style={smallButton} onClick={closePaymentPanel}>
                  Close
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
                <button type="button" style={tabButton(paymentTab === "payment")} onClick={() => setPaymentTab("payment")}>
                  Payment
                </button>
                <button type="button" style={tabButton(paymentTab === "customer")} onClick={() => setPaymentTab("customer")}>
                  Customer
                </button>
              </div>

              {paymentTab === "payment" ? (
                <div>
                  <form onSubmit={createInvoice} style={{ display: "grid", gap: 10, marginTop: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 950, color: "rgba(255,255,255,0.52)", marginBottom: 6 }}>
                        PAYMENT AMOUNT
                      </div>
                      <input
                        style={input}
                        value={paymentAmount}
                        onChange={(event) => setPaymentAmount(event.target.value)}
                        placeholder="125.00"
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: 11, fontWeight: 950, color: "rgba(255,255,255,0.52)", marginBottom: 6 }}>
                        PAYMENT MEMO
                      </div>
                      <input
                        style={input}
                        value={paymentMemo}
                        onChange={(event) => setPaymentMemo(event.target.value)}
                        placeholder={`${businessName} - ${selectedPaymentJob.title}`}
                      />
                    </div>

                    <button type="submit" style={primaryButton}>
                      Create Invoice
                    </button>
                  </form>

                  <div style={paymentBox}>
                    <div style={{ fontSize: 12, fontWeight: 950, color: "#bae6fd" }}>
                      Invoice status
                    </div>
                    <div style={{ marginTop: 8, color: "rgba(255,255,255,0.78)", fontSize: 13, lineHeight: 1.45 }}>
                      Status: <strong>{selectedPaymentJob.paymentStatus || "none"}</strong>
                      <br />
                      Amount: <strong>{selectedPaymentJob.invoiceAmount || "not set"}</strong>
                      <br />
                      Memo: <strong>{selectedPaymentJob.invoiceMemo || "not set"}</strong>
                    </div>

                    {invoiceLink ? (
                      <div style={{ marginTop: 10, color: "rgba(255,255,255,0.50)", fontSize: 11, overflowWrap: "anywhere" }}>
                        {invoiceLink}
                      </div>
                    ) : null}

                    <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                      <button type="button" style={button} onClick={() => copyText(invoiceLink, "Invoice link copied.")} disabled={!invoiceLink}>
                        Copy Invoice Link
                      </button>

                      <button type="button" style={button} onClick={() => copyText(customerMessage, "Customer message copied.")}>
                        Copy Customer Message
                      </button>

                      <button type="button" style={primaryButton} onClick={markSelectedJobPaid}>
                        Mark Paid
                      </button>
                    </div>
                  </div>

                  <div style={paymentBox}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 950 }}>Payment QR</div>
                        <div style={{ marginTop: 4, color: "rgba(255,255,255,0.58)", fontSize: 11 }}>
                          Scan in person or send the invoice link.
                        </div>
                      </div>
                      <div style={{ background: "white", padding: 10, borderRadius: 14 }}>
                        <QRCodeImg value={paymentQrValue} size={116} />
                      </div>
                    </div>
                  </div>

                  <div style={paymentBox}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 950 }}>Cash App</div>
                        <div style={{ marginTop: 4, color: "rgba(255,255,255,0.62)", fontSize: 12 }}>{CASH_APP_HANDLE}</div>
                      </div>
                      <span style={pill}>Tap ready</span>
                    </div>

                    <div style={{ marginTop: 10, color: "rgba(255,255,255,0.78)", fontSize: 12, lineHeight: 1.45 }}>
                      Amount: <strong>{activeAmount || "not set"}</strong>
                      <br />
                      Memo: <strong>{activeMemo || "not set"}</strong>
                    </div>

                    <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                      <button type="button" style={primaryButton} onClick={() => window.open(cashAppLink, "_blank", "noreferrer")}>
                        Open Cash App
                      </button>
                      <button type="button" style={button} onClick={() => copyText(`${CASH_APP_HANDLE}\nAmount: ${activeAmount || "not set"}\nMemo: ${activeMemo || "not set"}`, "Cash App details copied.")}>
                        Copy Cash App Details
                      </button>
                    </div>
                  </div>

                  <div style={paymentBox}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 950 }}>Zelle</div>
                        <div style={{ marginTop: 4, color: "rgba(255,255,255,0.62)", fontSize: 12 }}>{ZELLE_CONTACT}</div>
                      </div>
                      <span style={pill}>Memo ready</span>
                    </div>

                    <div style={{ marginTop: 10, color: "rgba(255,255,255,0.78)", fontSize: 12, lineHeight: 1.45 }}>
                      Send to: <strong>{ZELLE_CONTACT}</strong>
                      <br />
                      Amount: <strong>{activeAmount || "not set"}</strong>
                      <br />
                      Memo: <strong>{activeMemo || "not set"}</strong>
                    </div>

                    <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                      <button type="button" style={button} onClick={() => copyText(activeMemo || "", "Memo copied.")}>
                        Copy Memo
                      </button>
                      <button type="button" style={button} onClick={() => copyText(`Zelle: ${ZELLE_CONTACT}\nAmount: ${activeAmount || "not set"}\nMemo: ${activeMemo || "not set"}`, "Zelle details copied.")}>
                        Copy Zelle Details
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
                  <div style={paymentBox}>
                    <div style={{ fontSize: 12, fontWeight: 950, color: "#bae6fd" }}>
                      Customer contact
                    </div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,0.62)", fontSize: 12, lineHeight: 1.45 }}>
                      Add the customer's phone number here for quick call/text actions. This stays local for this session.
                    </div>

                    <input
                      style={{ ...input, marginTop: 10 }}
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                      placeholder="Customer phone number"
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                      <button
                        type="button"
                        style={button}
                        onClick={() => {
                          if (callHref) window.location.href = callHref;
                        }}
                        disabled={!callHref}
                      >
                        Call Customer
                      </button>
                      <button
                        type="button"
                        style={primaryButton}
                        onClick={() => {
                          if (smsHref) window.location.href = smsHref;
                        }}
                        disabled={!smsHref}
                      >
                        Text Customer
                      </button>
                    </div>
                  </div>

                  <div style={paymentBox}>
                    <div style={{ fontSize: 12, fontWeight: 950, color: "#bae6fd" }}>
                      Ready message
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.10)",
                        background: "rgba(255,255,255,0.045)",
                        padding: 12,
                        color: "rgba(255,255,255,0.76)",
                        fontSize: 12,
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {customerMessage}
                    </div>

                    <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                      <button
                        type="button"
                        style={primaryButton}
                        onClick={() => copyText(customerMessage, "Customer message copied.")}
                      >
                        Copy Customer Message
                      </button>
                      <button
                        type="button"
                        style={button}
                        onClick={() => copyText(invoiceLink, "Invoice link copied.")}
                        disabled={!invoiceLink}
                      >
                        Copy Invoice Link
                      </button>
                    </div>
                  </div>

                  <div style={paymentBox}>
                    <div style={{ fontSize: 12, fontWeight: 950, color: "#bae6fd" }}>
                      Customer-facing summary
                    </div>
                    <div style={{ marginTop: 8, color: "rgba(255,255,255,0.72)", fontSize: 12, lineHeight: 1.55 }}>
                      Customer: <strong>{selectedPaymentJob.customer}</strong>
                      <br />
                      Job: <strong>{selectedPaymentJob.title}</strong>
                      <br />
                      Stage: <strong>{selectedPaymentJob.stage}</strong>
                      <br />
                      Payment: <strong>{selectedPaymentJob.paymentStatus || "none"}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  marginTop: 14,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(0,0,0,0.24)",
                  padding: 12,
                  color: "rgba(255,255,255,0.62)",
                  fontSize: 12,
                  lineHeight: 1.55,
                }}
              >
                Use Payment for invoice/QR. Use Customer for call/text and ready-to-send messages.
              </div>
            </aside>
          ) : null}
        </section>

        <section style={{ ...card, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={primaryButton} onClick={() => (window.location.href = `/planet/system/${boardSlug}`)}>
            Open System Home
          </button>
          <button type="button" style={button} onClick={() => (window.location.href = `/planet/lobby/${boardSlug}`)}>
            Lobby Board
          </button>
          <button type="button" style={button} onClick={() => (window.location.href = "/planet/creator/studio")}>
            Back to Creator Studio
          </button>
        </section>
      </div>
    </div>
  );
}

export default function LiveBoardRouter() {
  const { boardSlug: routeBoardSlug } = useParams();
  const location = useLocation();
  const locationState = (location.state as LiveBoardLocationState | null) ?? {};
  const starterPayload = useMemo(() => readStarterPayload(), []);

  const resolvedBoardSlug = useMemo(() => {
    if (routeBoardSlug?.trim()) return routeBoardSlug.trim();
    if (locationState.boardSlug?.trim()) return locationState.boardSlug.trim();

    const fallbackBoardSlug =
      typeof starterPayload.boardSlug === "string" ? starterPayload.boardSlug.trim() : "";

    return fallbackBoardSlug;
  }, [routeBoardSlug, locationState.boardSlug, starterPayload]);

  const creatorSystemPayload = useMemo(
    () => readCreatorSystemPayload(resolvedBoardSlug),
    [resolvedBoardSlug],
  );

  const [starterBoard, setStarterBoard] = useState<StarterBoardRow | null>(null);
  const [loading, setLoading] = useState(Boolean(resolvedBoardSlug));

  useEffect(() => {
    let isMounted = true;

    async function loadStarterBoard() {
      if (!resolvedBoardSlug) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("starter_boards")
        .select("*")
        .eq("board_slug", resolvedBoardSlug)
        .limit(1)
        .maybeSingle<StarterBoardRow>();

      if (!isMounted) return;

      if (error) {
        console.error("starter_boards lookup failed:", error);
        setStarterBoard(null);
        setLoading(false);
        return;
      }

      setStarterBoard(data ?? null);
      setLoading(false);
    }

    void loadStarterBoard();

    return () => {
      isMounted = false;
    };
  }, [resolvedBoardSlug]);

  const routingInput = useMemo(
    () => ({
      businessType: starterBoard?.business_type ?? locationState.businessType ?? "",
      businessName:
        starterBoard?.business_name ??
        locationState.businessName ??
        (typeof starterPayload.businessName === "string" ? starterPayload.businessName : "") ??
        creatorSystemPayload?.businessName ??
        "",
      boardSlug: resolvedBoardSlug ?? "",
      primaryGoal: locationState.primaryGoal ?? "",
    }),
    [starterBoard, locationState, starterPayload, resolvedBoardSlug, creatorSystemPayload],
  );

  const template = useMemo(() => {
    if (!resolvedBoardSlug) return null;
    return getLiveBoardTemplate(resolvedBoardSlug);
  }, [resolvedBoardSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16">
          <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur">
            <h1 className="text-3xl font-semibold">Loading live board...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (template) {
    return <TemplateLiveBoard template={template} />;
  }

  if (looksLikeCamp(routingInput)) {
    return <CampAquaflowStandalone />;
  }

  if (resolvedBoardSlug === "taylor-creek") {
    return <AutoRepairLiveBoard />;
  }

  if (looksLikeAuto(routingInput)) {
    return <AutoRepairLiveBoard />;
  }

  if (resolvedBoardSlug && creatorSystemPayload?.operationalSystem) {
    return <OperationalLiveBoard boardSlug={resolvedBoardSlug} payload={creatorSystemPayload} />;
  }

  if (resolvedBoardSlug && creatorSystemPayload) {
    return <CreatorSystemLiveBoard boardSlug={resolvedBoardSlug} payload={creatorSystemPayload} />;
  }

  if (resolvedBoardSlug) {
    return (
      <CreatorSystemLiveBoard
        boardSlug={resolvedBoardSlug}
        payload={{
          boardSlug: resolvedBoardSlug,
          businessName: titleFromSlug(resolvedBoardSlug),
          createdAt: new Date().toISOString(),
          systemFlags: {
            liveBoard: true,
            lobbyBoard: true,
            momentPage: true,
          },
        }}
      />
    );
  }

  return <BeautySalonLiveBoard />;
}







