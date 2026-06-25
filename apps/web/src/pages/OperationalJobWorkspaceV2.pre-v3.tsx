import React, { useState } from "react";

const jobs: Record<string, any> = {
  "Maria Jenkins": {
    customer: "Maria Jenkins",
    service: "House Wash + Driveway",
    address: "123 Main Street",
    amount: "$250 Due",
    status: "Scheduled"
  },
  "John Smith": {
    customer: "John Smith",
    service: "Fence Cleaning",
    address: "456 Oak Avenue",
    amount: "$180 Due",
    status: "Payment Due"
  },
  "Sarah Johnson": {
    customer: "Sarah Johnson",
    service: "Roof Wash",
    address: "789 Lake Road",
    amount: "$320 Paid",
    status: "Complete"
  }
};

const steps = ["Lead", "Estimate", "Scheduled", "In Progress", "Payment Due", "Complete"];
const nextActions = ["Start Estimate", "Schedule Job", "Start Work", "Finish Work", "Send Payment", "Complete Job"];

export default function OperationalJobWorkspaceV2() {
  

  const params = new URLSearchParams(window.location.search);
  const customerName = params.get("customer") || "Maria Jenkins";
  const job = jobs[customerName] || jobs["Maria Jenkins"];

  const [step, setStep] = useState(
    Math.max(0, steps.indexOf(job.status))
  );

  const [toolTab, setToolTab] = useState("estimate");
  const [depositAmount, setDepositAmount] = useState("");

  const jobTotal = Number(String(job.amount).replace(/[^0-9.]/g, "")) || 0;
  const deposit = Number(depositAmount.replace(/[^0-9.]/g, "")) || 0;
  const balanceDue = Math.max(jobTotal - deposit, 0);

  return (
    <main style={page}>
      <div style={wrap}>
        <button style={back} onClick={() => window.location.href = "/planet/jobs-dashboard-v2"}>? Today’s Jobs</button>

        <section style={hero}>
          <div>
            <p style={kicker}>Home Services Job</p>
            <h1 style={title}>{job.customer}</h1>
            <p style={sub}>{job.service}</p>
            <p style={muted}>{job.address}</p>

            <div style={statusBadge}>
              {steps[step]}
            </div>
          </div>
          <div style={actions}>
            <button style={pill}>Call</button>
            <button style={pill}>Text</button>
            <button style={pill}>Navigate</button>
          </div>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Operational Timeline</h2>

          <div style={timelineItem}>? Lead Submitted</div>
          <div style={timelineItem}>? Estimate Created</div>
          <div style={timelineItem}>? Invoice Sent</div>
          <div style={timelineItem}>? Customer Approved</div>
          <div style={timelineItem}>? Scheduled</div>

          <div style={timelinePending}>? Work Started</div>
          <div style={timelinePending}>? Before Photos Added</div>
          <div style={timelinePending}>? After Photos Added</div>
          <div style={timelinePending}>? Payment Sent</div>
          <div style={timelinePending}>? Paid</div>
          <div style={timelinePending}>? Review Requested</div>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Tools</h2>

          <div style={actions}>
            <button style={toolTab === "customer" ? green : pill} onClick={() => setToolTab("customer")}>Customer</button>

            <button
              style={toolTab === "estimate" ? green : pill}
              onClick={() => setToolTab("estimate")}
            >
              Estimate
            </button>

            <button style={toolTab === "photos" ? green : pill} onClick={() => setToolTab("photos")}>Photos</button>
            <button style={toolTab === "payment" ? green : pill} onClick={() => setToolTab("payment")}>Payment</button>
            <button style={toolTab === "notes" ? green : pill} onClick={() => setToolTab("notes")}>Notes</button>
            <button style={toolTab === "messages" ? green : pill} onClick={() => setToolTab("messages")}>Messages</button>
          </div>
        </section>

        <section style={card}>

          {toolTab === "customer" && (
            <>
              <h2 style={sectionTitle}>Customer</h2>
              <p style={line}>Gate Code: 4821</p>
              <p style={line}>Customer prefers afternoon</p>
              <p style={line}>Watch for dog in backyard</p>
              <p style={line}>Clean front walkway also</p>
            </>
          )}

          {toolTab === "estimate" && (
            <>
              <h2 style={sectionTitle}>Estimate</h2>

              <p style={line}>Base Service</p>
              <p style={price}>$250</p>

              <p style={line}>Modifiers</p>

              <div style={actions}>
                <button style={pill}>Heavy Insect Casings</button>
                <button style={pill}>Spider Web Density</button>
                <button style={pill}>Limited Access</button>
              </div>

              <div style={{ marginTop: 20 }}>
                <button style={green}>
                  Edit Estimate
                </button>
              </div>
            </>
          )}

          {toolTab === "photos" && (
            <>
              <h2 style={sectionTitle}>Photos</h2>
              <div style={grid}>
                <button style={photoBox}>Before Photos<br /><strong>Add Photos</strong></button>
                <button style={photoBox}>After Photos<br /><strong>Add Photos</strong></button>
              </div>
            </>
          )}

          {toolTab === "payment" && (
            <>
              <h2 style={sectionTitle}>Payment</h2>

              <p style={line}>Job Total</p>
              <p style={price}>${jobTotal}</p>

              <p style={line}>Deposit Optional</p>
              <input
                style={input}
                value={depositAmount}
                onChange={(event) => setDepositAmount(event.target.value)}
                placeholder="$0.00"
              />

              <p style={line}>Balance Due</p>
              <p style={price}>${balanceDue}</p>

              <div style={actions}>
                <button style={green}>Send Payment Link</button>
                <button style={pill}>Show QR Code</button>
                <button style={pill}>Mark Paid</button>
              </div>
            </>
          )}

          {toolTab === "messages" && (
            <>
              <h2 style={sectionTitle}>Messages</h2>

              <p style={line}>On My Way</p>
              <p style={line}>Running Late</p>
              <p style={line}>Invoice Sent</p>
              <p style={line}>How Did We Do?</p>
            </>
          )}

          {toolTab === "notes" && (
            <>
              <h2 style={sectionTitle}>Notes</h2>
              <textarea
                style={textarea}
                placeholder="Customer notes, crew notes, reminders..."
              />
            </>
          )}

        </section>
      </div>
    </main>
  );
}

const page: React.CSSProperties = { minHeight: "100vh", background: "radial-gradient(circle at top left, rgba(34,197,94,.16), transparent 32%), #07111a", color: "#fff", padding: 24 };
const wrap: React.CSSProperties = { maxWidth: 1100, margin: "0 auto" };
const back: React.CSSProperties = { border: 0, background: "transparent", color: "#4ade80", fontWeight: 900, marginBottom: 18, cursor: "pointer" };
const hero: React.CSSProperties = { background: "linear-gradient(135deg,#4ade80,#22c55e)", border: "0", borderRadius: 30, padding: 30, display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" };
const kicker: React.CSSProperties = { color: "#4ade80", textTransform: "uppercase", letterSpacing: ".14em", fontWeight: 900, margin: 0 };
const title: React.CSSProperties = { fontSize: 54, margin: "10px 0 6px", lineHeight: 1, color: "#07111a" };
const sub: React.CSSProperties = { fontSize: 24, margin: 0, color: "#07111a" };
const muted: React.CSSProperties = { color: "rgba(7,17,26,.8)" };
const actions: React.CSSProperties = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" };
const pill: React.CSSProperties = { borderRadius: 999, border: "1px solid rgba(255,255,255,.14)", background: "#1f2937", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" };
const card: React.CSSProperties = { marginTop: 18, background: "rgba(17,24,39,.95)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 26, padding: 24 };
const sectionTitle: React.CSSProperties = { margin: "0 0 16px", fontSize: 26 };
const currentStage: React.CSSProperties = { borderRadius: 22, background: "#1f2937", padding: 22, marginBottom: 14 };
const stageLabel: React.CSSProperties = { color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".12em", fontWeight: 900, fontSize: 12 };
const stageName: React.CSSProperties = { fontSize: 56, fontWeight: 900, marginTop: 8, color: "#4ade80", letterSpacing: ".04em" };
const nextButton: React.CSSProperties = { width: "100%", border: 0, borderRadius: 18, background: "#07111a", color: "#4ade80", padding: 24, fontWeight: 900, fontSize: 24, cursor: "pointer" };
const completeButton: React.CSSProperties = { width: "100%", border: 0, borderRadius: 18, background: "#22c55e", color: "#4ade80", padding: 18, fontWeight: 900, fontSize: 18 };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 };
const line: React.CSSProperties = { color: "#dbeafe", margin: "10px 0" };
const price: React.CSSProperties = { fontSize: 32, fontWeight: 900, margin: "0 0 16px" };
const green: React.CSSProperties = { border: 0, borderRadius: 999, background: "#4ade80", color: "#07111a", padding: "12px 16px", fontWeight: 900, cursor: "pointer", marginRight: 10 };
const photoBox: React.CSSProperties = { textAlign: "left", borderRadius: 20, border: "1px solid rgba(255,255,255,.12)", background: "#1f2937", color: "#fff", padding: 22, minHeight: 110 };
const textarea: React.CSSProperties = { width: "100%", minHeight: 130, borderRadius: 18, border: "1px solid rgba(255,255,255,.12)", background: "#1f2937", color: "#fff", padding: 18, fontSize: 16 };








const input: React.CSSProperties = { width: "100%", maxWidth: 260, borderRadius: 14, border: "1px solid rgba(255,255,255,.12)", background: "#1f2937", color: "#fff", padding: "14px 16px", fontSize: 18, fontWeight: 800, marginBottom: 16 };





const statusGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
  gap: 12,
  marginTop: 20,
};







const statusBadge: React.CSSProperties = {
  display: "inline-block",
  marginTop: 10,
  padding: "6px 12px",
  borderRadius: 999,
  background: "#07111a",
  color: "#4ade80",
  fontWeight: 800,
};



const timelineItem: React.CSSProperties = {
  padding: "10px 0",
  borderBottom: "1px solid rgba(255,255,255,.08)",
  color: "#4ade80",
  fontWeight: 700,
};

const timelinePending: React.CSSProperties = {
  padding: "10px 0",
  borderBottom: "1px solid rgba(255,255,255,.08)",
  color: "#94a3b8",
};





