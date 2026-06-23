import React, { useState } from "react";

type ToolTab = "estimate" | "photos" | "payment" | "messages" | "customer" | "notes";

type Job = {
  customer: string;
  service: string;
  address: string;
  amount: string;
  status: string;
};

const jobs: Record<string, Job> = {
  "Maria Jenkins": {
    customer: "Maria Jenkins",
    service: "House Wash + Driveway",
    address: "Okeechobee, Florida",
    amount: "$250 Due",
    status: "Scheduled",
  },
};

const steps = ["Lead", "Estimate", "Scheduled", "In Progress", "Payment Due", "Complete"];

const tools: { id: ToolTab; label: string }[] = [
  { id: "estimate", label: "Estimate" },
  { id: "photos", label: "Photos" },
  { id: "payment", label: "Payment" },
  { id: "messages", label: "Messages" },
  { id: "customer", label: "Customer" },
  { id: "notes", label: "Notes" },
];

export default function OperationalJobWorkspaceV3() {
  const params = new URLSearchParams(window.location.search);
  const customerName = params.get("customer") || "Maria Jenkins";
  const job = jobs[customerName] || jobs["Maria Jenkins"];

  const [toolTab, setToolTab] = useState<ToolTab>("estimate");
  const [paidDemo, setPaidDemo] = useState(false);
  const [liveAction, setLiveAction] = useState<null | {
    title: string;
    body: string;
    kind?: "call" | "text" | "route" | "qr" | "payment";
  }>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [timelineOpen, setTimelineOpen] = useState(false);

  const currentStep = steps.includes(job.status) ? job.status : "Scheduled";
  const savedEstimate = (() => {
    const urlTotal = Number(params.get("total") || 0);
    const urlLabor = Number(params.get("labor") || 0);

    const urlModifiers = {
      heavyInsectCasings: params.get("heavyInsectCasings") || "",
      spiderWebDensity: params.get("spiderWebDensity") || "",
      limitedAccess: params.get("limitedAccess") || "",
    };

    if (
      urlTotal > 0 ||
      urlLabor > 0 ||
      urlModifiers.heavyInsectCasings ||
      urlModifiers.spiderWebDensity ||
      urlModifiers.limitedAccess
    ) {
      return {
        estimatedTotal: urlTotal,
        addedLabor: urlLabor,
        modifiers: {
          heavyInsectCasings: urlModifiers.heavyInsectCasings || "None",
          spiderWebDensity: urlModifiers.spiderWebDensity || "None",
          limitedAccess: urlModifiers.limitedAccess || "None",
        },
      };
    }

    try {
      return JSON.parse(
        window.localStorage.getItem("homeServicesEstimate") || "null"
      ) as null | {
        estimatedTotal?: number;
        addedLabor?: number;
        modifiers?: {
          heavyInsectCasings?: string;
          spiderWebDensity?: string;
          limitedAccess?: string;
        };
      };
    } catch {
      return null;
    }
  })();
const estimateModifiers = savedEstimate?.modifiers || {
    heavyInsectCasings: "None",
    spiderWebDensity: "None",
    limitedAccess: "None",
  };

  const savedEstimateTotal = Number(savedEstimate?.estimatedTotal || 0);
  const jobTotal =
    savedEstimateTotal ||
    Number(String(job.amount).replace(/[^0-9.]/g, "")) ||
    0;
  const addedLabor = Number(savedEstimate?.addedLabor || 0);
  const deposit = Number(depositAmount.replace(/[^0-9.]/g, "")) || 0;
  const balanceDue = Math.max(jobTotal - deposit, 0);

  return (
    <main style={page}>
      <div style={wrap}>
        <button
          style={back}
          onClick={() => {
            window.location.href = "/planet/jobs-dashboard-v2";
          }}
        >
          ← Today&apos;s Jobs
        </button>

        <section style={hero}>
          <div>
            <p style={kicker}>Home Services Job</p>
            <h1 style={title}>{job.customer}</h1>
            <p style={sub}>{job.service}</p>
            <p style={muted}>{job.address}</p>
            <div style={statusBadge}>{currentStep}</div>
          </div>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Actions</h2>
          <div style={actionGrid}>
            <button
              style={actionCard}
              onClick={() => {
                window.location.href = "tel:8635320683";
                setLiveAction({
                  kind: "call",
                  title: "Call opened",
                  body: "Calling Maria Jenkins at 863-532-0683. This contact action stays attached to the live job.",
                });
              }}
            >
              CALL
            </button>

            <button
              style={actionCard}
              onClick={() => {
                setToolTab("messages");
                window.location.href = "sms:8635320683";
                setLiveAction({
                  kind: "text",
                  title: "Text opened",
                  body: "Texting Maria Jenkins at 863-532-0683. Message templates stay ready inside this job board.",
                });
              }}
            >
              TEXT
            </button>

            <button
              style={actionCard}
              onClick={() => {
                window.open(
                  "https://www.google.com/maps/search/?api=1&query=Okeechobee%20County%20Courthouse%20Okeechobee%20FL",
                  "_blank",
                  "noopener,noreferrer"
                );
                setLiveAction({
                  kind: "route",
                  title: "Google Maps opened",
                  body: "Route opened to Okeechobee County Courthouse. Demo ETA: 14 minutes.",
                });
              }}
            >
              NAVIGATE
            </button>
          </div>
        </section>

        {liveAction && (
          <section
            style={{
              ...card,
              border: "1px solid rgba(249,115,22,.42)",
              background:
                "linear-gradient(135deg, rgba(249,115,22,.14), rgba(17,17,17,.98))",
            }}
          >
            <div style={sectionHeader}>
              <div>
                <p style={label}>Live Action</p>
                <h2 style={sectionTitle}>{liveAction.title}</h2>
              </div>
              <button style={secondaryButton} onClick={() => setLiveAction(null)}>
                Close
              </button>
            </div>

            <p style={muted}>{liveAction.body}</p>

            {liveAction.kind === "route" && (
              <div style={{ ...summaryBlock, marginTop: 16 }}>
                <p style={label}>Route Preview</p>
                <p style={price}>14 min</p>
                <p style={smallMeta}>123 Main Street • Okeechobee, FL</p>
              </div>
            )}

            {liveAction.kind === "qr" && (
              <div style={{ marginTop: 18, display: "grid", placeItems: "center", gap: 12 }}>
                <div
                  style={{
                    background: "#fff",
                    padding: 14,
                    borderRadius: 22,
                    boxShadow: "0 22px 60px rgba(0,0,0,.55)",
                  }}
                >
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https%3A%2F%2Fhomeplanet.local%2Fpay%2Fridgeline-maria-jenkins-350"
                    alt="Ridgeline demo payment QR code"
                    style={{ display: "block", width: 220, height: 220 }}
                  />
                </div>
                <strong>Maria Jenkins • ${paidDemo ? 0 : balanceDue} due</strong>
              </div>
            )}

            {liveAction.kind === "payment" && (
              <div style={{ ...summaryBlock, marginTop: 16 }}>
                <p style={label}>Balance Due</p>
                <p style={price}>${paidDemo ? 0 : balanceDue}</p>
                <p style={smallMeta}>
                  {paidDemo ? "Payment marked paid." : "Payment action is ready."}
                </p>
              </div>
            )}
          </section>
        )}

        <section style={card}>
          <h2 style={sectionTitle}>Tools</h2>
          <div style={toolGrid}>
            {tools.map((tool) => (
              <button
                key={tool.id}
                style={toolTab === tool.id ? activeToolButton : toolButton}
                onClick={() => setToolTab(tool.id)}
              >
                {tool.label}
              </button>
            ))}
          </div>
        </section>

        <section style={workbenchCard}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Workbench</h2>
            <div style={workbenchLabel}>
              {tools.find((tool) => tool.id === toolTab)?.label}
            </div>
          </div>

          {toolTab === "estimate" && (
            <>
              <h3 style={workbenchTitle}>Estimate</h3>

              <div style={summaryBlock}>
                <p style={label}>Estimated Total</p>
                <p style={price}>${jobTotal}</p>
                {addedLabor > 0 && (
                  <p style={smallMeta}>Added labor: {addedLabor} min</p>
                )}
              </div>

              <p style={label}>Modifiers</p>

              <div style={modifierGrid}>
                <button style={modifierButton}>
                  Heavy Insect Casings: {estimateModifiers.heavyInsectCasings}
                </button>
                <button style={modifierButton}>
                  Spider Web Density: {estimateModifiers.spiderWebDensity}
                </button>
                <button style={modifierButton}>
                  Limited Access: {estimateModifiers.limitedAccess}
                </button>
              </div>

              <div style={{ marginTop: 20 }}>
                <button
                  style={primaryButton}
                  onClick={() => {
                    const editParams = new URLSearchParams({
                      customer: job.customer,
                      heavyInsectCasings:
                        estimateModifiers.heavyInsectCasings || "None",
                      spiderWebDensity:
                        estimateModifiers.spiderWebDensity || "None",
                      limitedAccess: estimateModifiers.limitedAccess || "None",
                    });

                    window.location.href =
                      "/planet/home-services/estimate?" +
                      editParams.toString();
                  }}
                >
                  Edit Estimate
                </button>
              </div>
            </>
          )}

          {toolTab === "photos" && (
            <>
              <h3 style={workbenchTitle}>Photos</h3>

              <div style={grid}>
                <button style={photoBox}>
                  <span style={photoLabel}>Before Photos</span>
                  <strong style={photoAction}>Add Photos</strong>
                </button>

                <button style={photoBox}>
                  <span style={photoLabel}>After Photos</span>
                  <strong style={photoAction}>Add Photos</strong>
                </button>
              </div>
            </>
          )}

          {toolTab === "payment" && (
            <>
              <h3 style={workbenchTitle}>Payment</h3>

              <div style={paymentGrid}>
                <div style={summaryBlock}>
                  <p style={label}>Job Total</p>
                  <p style={price}>${jobTotal}</p>
                  {addedLabor > 0 && (
                    <p style={smallMeta}>Added labor: {addedLabor} min</p>
                  )}
                </div>

                <div style={summaryBlock}>
                  <p style={label}>Balance Due</p>
                  <p style={price}>${paidDemo ? 0 : balanceDue}</p>
                </div>
              </div>

              <p style={label}>Deposit Optional</p>

              <input
                style={input}
                value={depositAmount}
                onChange={(event) => setDepositAmount(event.target.value)}
                placeholder="$0.00"
              />

              <div style={workbenchActions}>
                <button
                  style={primaryButton}
                  onClick={() =>
                    setLiveAction({
                      kind: "payment",
                      title: "Payment link sent",
                      body: "Maria Jenkins received the payment link. The action stays attached to this job.",
                    })
                  }
                >
                  Send Payment Link
                </button>

                <button
                  style={secondaryButton}
                  onClick={() =>
                    setLiveAction({
                      kind: "qr",
                      title: "Payment QR generated",
                      body: "A real-looking payment QR is ready for Maria Jenkins. The demo payment link stays inside this job.",
                    })
                  }
                >
                  Show QR Code
                </button>

                <button
                  style={secondaryButton}
                  onClick={() => {
                    setPaidDemo(true);
                    setLiveAction({
                      kind: "payment",
                      title: "Payment marked paid",
                      body: "Balance updated to $0 and attached to Maria Jenkins' job timeline.",
                    });
                  }}
                >
                  Mark Paid
                </button>
              </div>
            </>
          )}

          {toolTab === "messages" && (
            <>
              <h3 style={workbenchTitle}>Messages</h3>

              <div style={messageGrid}>
                <button
                  style={messageButton}
                  onClick={() =>
                    setLiveAction({
                      kind: "text",
                      title: "Message sent: On My Way",
                      body: "Maria Jenkins receives an on-my-way update. It is tied to the live job.",
                    })
                  }
                >
                  On My Way
                </button>

                <button
                  style={messageButton}
                  onClick={() =>
                    setLiveAction({
                      kind: "text",
                      title: "Message sent: Running Late",
                      body: "Running-late update sent and logged to the job.",
                    })
                  }
                >
                  Running Late
                </button>

                <button
                  style={messageButton}
                  onClick={() =>
                    setLiveAction({
                      kind: "text",
                      title: "Message sent: Invoice Sent",
                      body: "Invoice message sent and attached to the payment step.",
                    })
                  }
                >
                  Invoice Sent
                </button>

                <button
                  style={messageButton}
                  onClick={() =>
                    setLiveAction({
                      kind: "text",
                      title: "Message sent: How Did We Do?",
                      body: "Review follow-up is ready after completion.",
                    })
                  }
                >
                  How Did We Do?
                </button>
              </div>
            </>
          )}

          {toolTab === "customer" && (
            <>
              <h3 style={workbenchTitle}>Customer Details</h3>

              <div style={infoGrid}>
                <div style={infoCard}>
                  <p style={label}>Gate Code</p>
                  <p style={value}>4821</p>
                </div>

                <div style={infoCard}>
                  <p style={label}>Preferred Time</p>
                  <p style={value}>Afternoon</p>
                </div>

                <div style={infoCard}>
                  <p style={label}>Property Warning</p>
                  <p style={value}>Watch for dog in backyard</p>
                </div>

                <div style={infoCard}>
                  <p style={label}>Special Request</p>
                  <p style={value}>Clean front walkway also</p>
                </div>
              </div>
            </>
          )}

          {toolTab === "notes" && (
            <>
              <h3 style={workbenchTitle}>Notes</h3>
              <textarea
                style={textarea}
                placeholder="Customer notes, crew notes, reminders..."
              />
            </>
          )}
        </section>

        <section style={card}>
          <div style={timelineHeader}>
            <div>
              <h2 style={sectionTitle}>Operational Timeline</h2>
              <p style={timelineSummary}>5 Complete • 6 Remaining</p>
            </div>

            <button
              style={timelineToggle}
              onClick={() => setTimelineOpen((open) => !open)}
            >
              {timelineOpen ? "Hide Timeline" : "View Timeline"}
            </button>
          </div>

          {timelineOpen && (
            <>
              <div style={timelineItem}>✓ Lead Submitted</div>
              <div style={timelineItem}>✓ Estimate Created</div>
              <div style={timelineItem}>✓ Invoice Sent</div>
              <div style={timelineItem}>✓ Customer Approved</div>
              <div style={timelineItem}>✓ Scheduled</div>

              <div style={timelinePending}>○ Work Started</div>
              <div style={timelinePending}>○ Before Photos Added</div>
              <div style={timelinePending}>○ After Photos Added</div>
              <div style={timelinePending}>○ Payment Sent</div>
              <div style={timelinePending}>○ Paid</div>
              <div style={timelinePending}>○ Review Requested</div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  color: "#fff",
  backgroundColor: "#050505",
  backgroundImage:
    "radial-gradient(circle at 18% 0%, rgba(249,115,22,.28), transparent 34%), linear-gradient(180deg, rgba(0,0,0,.46), #050505 64%), url('/images/a_dramatic_cinematic_ultra_realistic_sunset_scen_1.png')",
  backgroundSize: "cover",
  backgroundPosition: "center top",
  backgroundAttachment: "fixed",
  padding: 18,
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const wrap: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
};

const back: React.CSSProperties = {
  border: 0,
  background: "transparent",
  color: "#f97316",
  fontWeight: 900,
  marginBottom: 18,
  cursor: "pointer",
  fontSize: 16,
};

const hero: React.CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(17,24,39,.98), rgba(7,17,26,.98))",
  border: "1px solid rgba(255,255,255,.1)",
  borderRadius: 30,
  padding: 30,
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  flexWrap: "wrap",
  boxShadow: "0 24px 70px rgba(0,0,0,.28)",
};

const kicker: React.CSSProperties = {
  color: "#f97316",
  textTransform: "uppercase",
  letterSpacing: ".14em",
  fontWeight: 900,
  margin: 0,
};

const title: React.CSSProperties = {
  fontSize: "clamp(42px, 9vw, 64px)",
  margin: "10px 0 6px",
  lineHeight: 0.95,
  color: "#fff",
};

const sub: React.CSSProperties = {
  fontSize: "clamp(22px, 5vw, 30px)",
  margin: 0,
  color: "#f97316",
  fontWeight: 900,
};

const muted: React.CSSProperties = {
  color: "#cbd5e1",
  fontSize: 18,
  fontWeight: 800,
  marginBottom: 0,
};

const card: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,.14)",
  background:
    "linear-gradient(145deg, rgba(18,18,20,.88), rgba(5,5,5,.84))",
  borderRadius: 28,
  padding: 18,
  boxShadow: "0 24px 70px rgba(0,0,0,.48)",
  backdropFilter: "blur(18px)",
};

const workbenchCard: React.CSSProperties = {
  border: "1px solid rgba(249,115,22,.30)",
  background:
    "linear-gradient(145deg, rgba(12,12,14,.96), rgba(0,0,0,.92))",
  borderRadius: 32,
  padding: 18,
  boxShadow: "0 34px 90px rgba(0,0,0,.60), 0 0 45px rgba(249,115,22,.10)",
  backdropFilter: "blur(20px)",
};

const sectionHeader: React.CSSProperties = {
  marginBottom: 18,
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 16px",
  fontSize: 26,
  fontWeight: 900,
};

const actionGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 14,
};

const actionCard: React.CSSProperties = {
  border: "1px solid rgba(249,115,22,.62)",
  background:
    "linear-gradient(145deg, rgba(249,115,22,.22), rgba(0,0,0,.90))",
  color: "#fff",
  borderRadius: 22,
  padding: "18px 14px",
  fontSize: 15,
  fontWeight: 950,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  cursor: "pointer",
  boxShadow: "0 18px 42px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,.12)",
};

const toolGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const toolButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,.13)",
  background: "rgba(0,0,0,.62)",
  color: "rgba(255,255,255,.74)",
  borderRadius: 18,
  padding: "13px 12px",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const activeToolButton: React.CSSProperties = {
  ...toolButton,
  border: "1px solid rgba(249,115,22,.76)",
  background:
    "linear-gradient(135deg, rgba(249,115,22,.34), rgba(0,0,0,.92))",
  color: "#fff",
  boxShadow: "0 0 30px rgba(249,115,22,.18)",
};

const workbenchLabel: React.CSSProperties = {
  display: "inline-block",
  color: "#f97316",
  background: "rgba(249,115,22,.10)",
  border: "1px solid rgba(249,115,22,.28)",
  borderRadius: 999,
  fontWeight: 900,
  fontSize: 14,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  padding: "8px 12px",
};

const workbenchTitle: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: 32,
  lineHeight: 1,
};

const summaryBlock: React.CSSProperties = {
  borderRadius: 22,
  background: "#0d0d0f",
  border: "1px solid rgba(255,255,255,.08)",
  padding: 20,
  marginBottom: 16,
};

const label: React.CSSProperties = {
  color: "#93a4b8",
  textTransform: "uppercase",
  letterSpacing: ".12em",
  fontWeight: 900,
  fontSize: 12,
  margin: "0 0 8px",
};

const value: React.CSSProperties = {
  color: "#fff",
  fontWeight: 900,
  fontSize: 22,
  margin: 0,
};

const price: React.CSSProperties = {
  fontSize: 38,
  fontWeight: 900,
  margin: 0,
  color: "#fff",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 18,
};

const infoGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const infoCard: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,.1)",
  background: "#0d0d0f",
  padding: 18,
};

const modifierGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 12,
};

const modifierButton: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#1b1b1d",
  color: "#fff",
  padding: "16px 14px",
  fontWeight: 900,
  cursor: "pointer",
  textAlign: "left",
};

const primaryButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,.20)",
  background: "linear-gradient(135deg, #ff8a1f, #f97316)",
  color: "#050505",
  borderRadius: 18,
  padding: "15px 18px",
  fontSize: 13,
  fontWeight: 950,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  cursor: "pointer",
  boxShadow: "0 18px 42px rgba(249,115,22,.30)",
};

const secondaryButton: React.CSSProperties = {
  border: "1px solid rgba(249,115,22,.50)",
  background:
    "linear-gradient(145deg, rgba(249,115,22,.12), rgba(0,0,0,.90))",
  color: "#fff7ed",
  borderRadius: 18,
  padding: "15px 18px",
  fontSize: 13,
  fontWeight: 950,
  letterSpacing: ".08em",
  textTransform: "uppercase",
  cursor: "pointer",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.10)",
};

const photoBox: React.CSSProperties = {
  textAlign: "left",
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#0d0d0f",
  color: "#fff",
  padding: 24,
  minHeight: 130,
  cursor: "pointer",
};

const photoLabel: React.CSSProperties = {
  display: "block",
  color: "#fff7ed",
  fontSize: 18,
  fontWeight: 900,
  marginBottom: 12,
};

const photoAction: React.CSSProperties = {
  display: "block",
  color: "#f97316",
  fontSize: 26,
};

const paymentGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const input: React.CSSProperties = {
  width: "100%",
  maxWidth: 280,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#0d0d0f",
  color: "#fff",
  padding: "16px 18px",
  fontSize: 22,
  fontWeight: 900,
  marginBottom: 18,
};

const workbenchActions: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  marginTop: 6,
};

const messageGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 12,
};

const messageButton: React.CSSProperties = {
  minHeight: 74,
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#1b1b1d",
  color: "#fff",
  padding: 18,
  fontSize: 18,
  fontWeight: 900,
  cursor: "pointer",
  textAlign: "left",
};

const textarea: React.CSSProperties = {
  width: "100%",
  minHeight: 150,
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#0d0d0f",
  color: "#fff",
  padding: 18,
  fontSize: 18,
  fontWeight: 700,
};

const statusBadge: React.CSSProperties = {
  display: "inline-block",
  marginTop: 16,
  padding: "9px 15px",
  borderRadius: 999,
  background: "#0d0d0f",
  color: "#f97316",
  fontWeight: 900,
};

const timelineHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-start",
  flexWrap: "wrap",
  marginBottom: 12,
};

const timelineSummary: React.CSSProperties = {
  margin: "-8px 0 0",
  color: "#94a3b8",
  fontWeight: 800,
};

const timelineToggle: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(249,115,22,.32)",
  background: "rgba(249,115,22,.10)",
  color: "#f97316",
  padding: "10px 14px",
  fontWeight: 900,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: ".08em",
  cursor: "pointer",
};

const timelineItem: React.CSSProperties = {
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,.08)",
  color: "#f97316",
  fontWeight: 800,
  fontSize: 17,
};

const timelinePending: React.CSSProperties = {
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,.08)",
  color: "#94a3b8",
  fontWeight: 700,
  fontSize: 17,
};





const smallMeta: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 15,
  fontWeight: 800,
  margin: "8px 0 0",
};









