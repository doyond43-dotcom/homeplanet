import React, { useState } from "react";

export default function HomeServicesLeadWorkspace() {
  const [photosOpen, setPhotosOpen] = useState(false);

  return (
    <main style={page}>
      <div style={container}>
        <p style={kicker}>NEW REQUEST</p>
        <h1 style={title}>Daniel Doyon</h1>
        <p style={service}>Soft Wash</p>
        <p style={muted}>4004 se 29th court</p>

        <section style={card}>
          <p>Customer Request</p>
          <p>Need a price on exterior house cleaning, thanks.</p>
        </section>

        <section style={card}>
          <p>Property Photos</p>
          <div style={photoBox}>
            {photosOpen ? (
              <div style={photoPreview}>
                <div style={photoThumb}>PHOTO</div>
                <p style={muted}>Exterior house photo attached for estimate review.</p>
              </div>
            ) : (
              <span>1 Photos Attached</span>
            )}
          </div>
        </section>

        <section style={actions}>
          <button
            style={secondaryButton}
            onClick={() => setPhotosOpen((open) => !open)}
          >
            {photosOpen ? "Hide Photos" : "View Photos"}
          </button>

          <button
            style={primaryButton}
            onClick={() =>
              (window.location.href = "/planet/home-services/estimate")
            }
          >
            Create Estimate
          </button>
        </section>
      </div>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#07111a",
  color: "#fff",
  padding: "28px",
};

const container: React.CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
};

const kicker: React.CSSProperties = {
  color: "#4ade80",
  fontWeight: 900,
  letterSpacing: ".14em",
};

const title: React.CSSProperties = {
  fontSize: "clamp(48px, 8vw, 72px)",
  margin: "16px 0 18px",
};

const service: React.CSSProperties = {
  fontSize: 26,
  margin: "0 0 12px",
};

const muted: React.CSSProperties = {
  color: "#94a3b8",
};

const card: React.CSSProperties = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,.1)",
  borderRadius: 24,
  padding: 28,
  marginTop: 28,
};

const photoBox: React.CSSProperties = {
  border: "1px dashed rgba(255,255,255,.22)",
  borderRadius: 18,
  minHeight: 110,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#94a3b8",
};

const photoPreview: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 18,
  padding: 16,
};

const photoThumb: React.CSSProperties = {
  width: 130,
  height: 80,
  borderRadius: 14,
  background: "linear-gradient(135deg, rgba(74,222,128,.28), rgba(15,23,42,1))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#4ade80",
  fontWeight: 900,
};

const actions: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 14,
  marginTop: 22,
};

const secondaryButton: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#111827",
  color: "#fff",
  padding: 18,
  fontWeight: 900,
  cursor: "pointer",
};

const primaryButton: React.CSSProperties = {
  borderRadius: 16,
  border: 0,
  background: "#4ade80",
  color: "#07111a",
  padding: 18,
  fontWeight: 900,
  cursor: "pointer",
};
