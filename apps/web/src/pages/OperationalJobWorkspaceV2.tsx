import React from "react";

export default function OperationalJobWorkspaceV2() {
  return (
    <main style={page}>
      <div style={container}>
        <button style={backButton}>? Today's Jobs</button>

        <section style={headerCard}>
          <div>
            <h1 style={title}>Maria Jenkins</h1>
            <p style={service}>House Wash + Driveway</p>
            <p style={address}>?? 123 Main Street</p>
          </div>

          <div style={quickActions}>
            <button style={pill}>?? Call</button>
            <button style={pill}>?? Text</button>
            <button style={pill}>?? Navigate</button>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Status</h2>
          <button style={statusButton}>IN MOTION</button>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Photos</h2>
          <div style={twoGrid}>
            <button style={box}>Before Photos<br /><strong>Add Photos ?</strong></button>
            <button style={box}>After Photos<br /><strong>Add Photos ?</strong></button>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Payment</h2>
          <p style={balance}>Balance Due: $250</p>
          <div style={quickActions}>
            <button style={greenButton}>Send Payment Link</button>
            <button style={pill}>Mark Paid</button>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Notes</h2>
          <div style={twoGrid}>
            <div style={box}>Customer Notes<br /><span style={muted}>Gate code, preferred time, special requests.</span></div>
            <div style={box}>Crew Notes<br /><span style={muted}>What to remember before leaving.</span></div>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Activity</h2>
          <p style={muted}>Job Created ? Photos Added ? Payment Sent ? Job Completed</p>
        </section>
      </div>
    </main>
  );
}

const page: React.CSSProperties = { minHeight: "100vh", background: "#07111a", color: "#fff", padding: 24 };
const container: React.CSSProperties = { maxWidth: 900, margin: "0 auto" };
const backButton: React.CSSProperties = { marginBottom: 18, border: 0, background: "transparent", color: "#4ade80", fontWeight: 800, cursor: "pointer" };
const headerCard: React.CSSProperties = { background: "#111827", border: "1px solid rgba(255,255,255,.08)", borderRadius: 24, padding: 22, display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" };
const title: React.CSSProperties = { margin: 0, fontSize: 38 };
const service: React.CSSProperties = { fontSize: 20, margin: "10px 0 6px" };
const address: React.CSSProperties = { color: "#94a3b8", margin: 0 };
const quickActions: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" };
const pill: React.CSSProperties = { borderRadius: 999, border: "1px solid rgba(255,255,255,.12)", background: "#1f2937", color: "#fff", padding: "11px 14px", cursor: "pointer", fontWeight: 700 };
const section: React.CSSProperties = { marginTop: 18, background: "#111827", border: "1px solid rgba(255,255,255,.08)", borderRadius: 24, padding: 22 };
const sectionTitle: React.CSSProperties = { margin: "0 0 14px", fontSize: 24 };
const statusButton: React.CSSProperties = { width: "100%", border: 0, borderRadius: 16, background: "#4ade80", color: "#07111a", padding: 16, fontWeight: 900, fontSize: 18 };
const twoGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 };
const box: React.CSSProperties = { textAlign: "left", borderRadius: 18, border: "1px solid rgba(255,255,255,.1)", background: "#1f2937", color: "#fff", padding: 18, minHeight: 92 };
const balance: React.CSSProperties = { fontSize: 22, fontWeight: 800 };
const greenButton: React.CSSProperties = { border: 0, borderRadius: 999, background: "#4ade80", color: "#07111a", padding: "12px 16px", fontWeight: 900, cursor: "pointer" };
const muted: React.CSSProperties = { color: "#94a3b8" };
