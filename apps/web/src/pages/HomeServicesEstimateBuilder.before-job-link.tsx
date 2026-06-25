import React from "react";

const modifiers = [
  "Heavy Insect Casings",
  "Spider Web Density",
  "Limited Access",
];

const levels = ["None", "Light", "Moderate", "Heavy"];

export default function HomeServicesEstimateBuilder() {
  return (
    <main style={page}>
      <div style={container}>
        <p style={kicker}>ESTIMATE BUILDER</p>
        <h1 style={title}>Maria Jenkins</h1>
        <p style={subtitle}>House Wash · 123 Main Street</p>

        <section style={card}>
          <h2 style={heading}>Base Service</h2>
          <div style={row}>
            <span>House Wash</span>
            <strong>$250</strong>
          </div>
        </section>

        <section style={card}>
          <h2 style={heading}>Estimate Modifiers</h2>

          {modifiers.map((modifier) => (
            <div key={modifier} style={modifierBlock}>
              <strong>{modifier}</strong>

              <div style={levelGrid}>
                {levels.map((level) => (
                  <button key={level} style={levelButton}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section style={summaryCard}>
          <div>
            <p style={muted}>Estimated Total</p>
            <h2 style={total}>$250</h2>
          </div>

          <div>
            <p style={muted}>Added Labor</p>
            <h2 style={total}>0 min</h2>
          </div>
        </section>

        <button style={primaryButton}>
          Convert To Job
        </button>
      </div>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#07111a",
  color: "#fff",
  padding: 24,
};

const container: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
};

const kicker: React.CSSProperties = {
  color: "#4ade80",
  fontWeight: 900,
  letterSpacing: ".12em",
};

const title: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 900,
  marginBottom: 8,
};

const subtitle: React.CSSProperties = {
  color: "#94a3b8",
  marginBottom: 24,
};

const card: React.CSSProperties = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 20,
  padding: 24,
  marginBottom: 20,
};

const heading: React.CSSProperties = {
  marginBottom: 16,
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 20,
};

const modifierBlock: React.CSSProperties = {
  marginBottom: 22,
};

const levelGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 10,
  marginTop: 12,
};

const levelButton: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,.1)",
  background: "#1f2937",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const summaryCard: React.CSSProperties = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 20,
  padding: 24,
  marginBottom: 20,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
};

const muted: React.CSSProperties = {
  color: "#94a3b8",
  margin: 0,
};

const total: React.CSSProperties = {
  fontSize: 36,
  margin: "8px 0 0",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: 18,
  borderRadius: 18,
  border: 0,
  background: "#4ade80",
  color: "#07111a",
  fontWeight: 900,
  fontSize: 18,
  cursor: "pointer",
};
