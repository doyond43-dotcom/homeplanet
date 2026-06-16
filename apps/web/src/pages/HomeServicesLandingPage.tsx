import React from "react";

export default function HomeServicesLandingPage() {
  return (
    <main style={page}>
      <div style={container}>
        <p style={kicker}>HOME SERVICES</p>

        <h1 style={title}>
          Need Help Around
          <br />
          The Property?
        </h1>

        <p style={subtitle}>
          House washing, roof cleaning, driveway cleaning, window cleaning,
          soft washing, and more.
        </p>

        <div style={grid}>
          <div style={card}>
            <h3>House Washing</h3>
            <p style={cardText}>
              Remove dirt, mildew, algae, and buildup.
            </p>
          </div>

          <div style={card}>
            <h3>Roof Cleaning</h3>
            <p style={cardText}>
              Restore curb appeal and extend roof life.
            </p>
          </div>

          <div style={card}>
            <h3>Driveway Cleaning</h3>
            <p style={cardText}>
              Eliminate stains, dirt, and surface buildup.
            </p>
          </div>
        </div>

        <button
          style={button}
          onClick={() =>
            (window.location.href =
              "/planet/home-services/request")
          }
        >
          Get Free Estimate
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
  maxWidth: 1000,
  margin: "0 auto",
};

const kicker: React.CSSProperties = {
  color: "#4ade80",
  fontWeight: 900,
  letterSpacing: ".15em",
  marginBottom: 12,
};

const title: React.CSSProperties = {
  fontSize: 64,
  fontWeight: 900,
  lineHeight: 1,
  marginBottom: 20,
};

const subtitle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 20,
  marginBottom: 40,
  maxWidth: 700,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: 16,
  marginBottom: 40,
};

const card: React.CSSProperties = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 20,
  padding: 24,
};

const cardText: React.CSSProperties = {
  color: "#94a3b8",
};

const button: React.CSSProperties = {
  width: "100%",
  padding: 22,
  borderRadius: 18,
  border: 0,
  background: "#4ade80",
  color: "#07111a",
  fontWeight: 900,
  fontSize: 20,
  cursor: "pointer",
};
