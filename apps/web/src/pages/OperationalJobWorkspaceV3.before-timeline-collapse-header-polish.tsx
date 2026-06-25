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
    address: "123 Main Street",
    amount: "$250 Due",
    status: "Scheduled",
  },
  "John Smith": {
    customer: "John Smith",
    service: "Fence Cleaning",
    address: "456 Oak Avenue",
    amount: "$180 Due",
    status: "Payment Due",
  },
  "Sarah Johnson": {
    customer: "Sarah Johnson",
    service: "Roof Wash",
    address: "789 Lake Road",
    amount: "$320 Paid",
    status: "Complete",
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
  const [depositAmount, setDepositAmount] = useState("");

  const currentStep = steps.includes(job.status) ? job.status : "Scheduled";
  const jobTotal = Number(String(job.amount).replace(/[^0-9.]/g, "")) || 0;
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
            <button style={actionCard}>CALL</button>
            <button style={actionCard}>TEXT</button>
            <button style={actionCard}>NAVIGATE</button>
          </div>
        </section>

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
                <p style={label}>Base Service</p>
                <p style={price}>$250</p>
              </div>

              <p style={label}>Modifiers</p>

              <div style={modifierGrid}>
                <button style={modifierButton}>Heavy Insect Casings</button>
                <button style={modifierButton}>Spider Web Density</button>
                <button style={modifierButton}>Limited Access</button>
              </div>

              <div style={{ marginTop: 20 }}>
                <button style={primaryButton}>Edit Estimate</button>
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
                </div>

                <div style={summaryBlock}>
                  <p style={label}>Balance Due</p>
                  <p style={price}>${balanceDue}</p>
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
                <button style={primaryButton}>Send Payment Link</button>
                <button style={secondaryButton}>Show QR Code</button>
                <button style={secondaryButton}>Mark Paid</button>
              </div>
            </>
          )}

          {toolTab === "messages" && (
            <>
              <h3 style={workbenchTitle}>Messages</h3>

              <div style={messageGrid}>
                <button style={messageButton}>On My Way</button>
                <button style={messageButton}>Running Late</button>
                <button style={messageButton}>Invoice Sent</button>
                <button style={messageButton}>How Did We Do?</button>
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

            <span style={timelineBadge}>Informational</span>
          </div>

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
        </section>
      </div>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(34,197,94,.16), transparent 32%), #07111a",
  color: "#fff",
  padding: 18,
};

const wrap: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
};

const back: React.CSSProperties = {
  border: 0,
  background: "transparent",
  color: "#4ade80",
  fontWeight: 900,
  marginBottom: 18,
  cursor: "pointer",
  fontSize: 16,
};

const hero: React.CSSProperties = {
  background: "linear-gradient(135deg,#4ade80,#22c55e)",
  borderRadius: 30,
  padding: 30,
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  flexWrap: "wrap",
  boxShadow: "0 24px 70px rgba(0,0,0,.22)",
};

const kicker: React.CSSProperties = {
  color: "#07111a",
  textTransform: "uppercase",
  letterSpacing: ".14em",
  fontWeight: 900,
  margin: 0,
};

const title: React.CSSProperties = {
  fontSize: "clamp(42px, 9vw, 64px)",
  margin: "10px 0 6px",
  lineHeight: 0.95,
  color: "#07111a",
};

const sub: React.CSSProperties = {
  fontSize: "clamp(22px, 5vw, 30px)",
  margin: 0,
  color: "#07111a",
  fontWeight: 900,
};

const muted: React.CSSProperties = {
  color: "rgba(7,17,26,.8)",
  fontSize: 18,
  fontWeight: 800,
  marginBottom: 0,
};

const card: React.CSSProperties = {
  marginTop: 18,
  background: "rgba(17,24,39,.96)",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 26,
  padding: 22,
  boxShadow: "0 18px 55px rgba(0,0,0,.22)",
};

const workbenchCard: React.CSSProperties = {
  ...card,
  border: "1px solid rgba(74,222,128,.26)",
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
  minHeight: 100,
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#07111a",
  color: "#fff",
  padding: "18px 14px",
  fontSize: 22,
  fontWeight: 900,
  letterSpacing: ".05em",
  cursor: "pointer",
};

const toolGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 12,
};

const toolButton: React.CSSProperties = {
  minHeight: 72,
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#1f2937",
  color: "#fff",
  padding: "16px 14px",
  fontSize: 19,
  fontWeight: 900,
  cursor: "pointer",
  textAlign: "left",
};

const activeToolButton: React.CSSProperties = {
  ...toolButton,
  border: "1px solid rgba(74,222,128,.65)",
  background: "#4ade80",
  color: "#07111a",
};

const workbenchLabel: React.CSSProperties = {
  display: "inline-block",
  color: "#4ade80",
  background: "rgba(74,222,128,.09)",
  border: "1px solid rgba(74,222,128,.22)",
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
  background: "#07111a",
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
  background: "#07111a",
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
  background: "#1f2937",
  color: "#fff",
  padding: "16px 14px",
  fontWeight: 900,
  cursor: "pointer",
  textAlign: "left",
};

const primaryButton: React.CSSProperties = {
  border: 0,
  borderRadius: 20,
  background: "#4ade80",
  color: "#07111a",
  padding: "18px 20px",
  fontSize: 18,
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,.14)",
  background: "#1f2937",
  color: "#fff",
  padding: "18px 20px",
  fontSize: 18,
  fontWeight: 900,
  cursor: "pointer",
};

const photoBox: React.CSSProperties = {
  textAlign: "left",
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#07111a",
  color: "#fff",
  padding: 24,
  minHeight: 130,
  cursor: "pointer",
};

const photoLabel: React.CSSProperties = {
  display: "block",
  color: "#dbeafe",
  fontSize: 18,
  fontWeight: 900,
  marginBottom: 12,
};

const photoAction: React.CSSProperties = {
  display: "block",
  color: "#4ade80",
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
  background: "#07111a",
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
  background: "#1f2937",
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
  background: "#07111a",
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
  background: "#07111a",
  color: "#4ade80",
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

const timelineBadge: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.12)",
  color: "#94a3b8",
  padding: "8px 12px",
  fontWeight: 900,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: ".08em",
};

const timelineItem: React.CSSProperties = {
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,.08)",
  color: "#4ade80",
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
