import React from "react";

export default function HomeServicesLeadWorkspace() {
  const lead = JSON.parse(
    localStorage.getItem("homeServicesLead") || "{}"
  );

  return (
    <main style={page}>
      <div style={container}>
        <p style={kicker}>NEW REQUEST</p>

        <h1 style={title}>{lead.customerName || "No Customer"}</h1>

        <p style={service}>{lead.service || "No Service Selected"}</p>
        <p style={muted}>{lead.address || "No Address"}</p>

        <section style={card}>
          <h2 style={heading}>Customer Request</h2>

          <p style={request}>
            {lead.description || "No description provided."}
          </p>
        </section>

        <section style={card}>
          <h2 style={heading}>Property Photos</h2>

          <div style={photoBox}>
            {lead.photoCount || 0} Photos Attached
          </div>
        </section>

        <section style={actions}>
          <button style={secondaryButton}>
            View Photos
          </button>

          <button
            style={primaryButton}
            onClick={() =>
              (window.location.href =
                "/planet/home-services/estimate")
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
  marginBottom: 12,
};

const title: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 900,
  marginBottom: 12,
};

const service: React.CSSProperties = {
  fontSize: 24,
  marginBottom: 8,
};

const muted: React.CSSProperties = {
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
  marginBottom: 12,
};

const request: React.CSSProperties = {
  lineHeight: 1.6,
};

const photoBox: React.CSSProperties = {
  borderRadius: 18,
  border: "1px dashed rgba(255,255,255,.2)",
  padding: 40,
  textAlign: "center",
  color: "#94a3b8",
};

const actions: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const primaryButton: React.CSSProperties = {
  padding: 18,
  borderRadius: 18,
  border: 0,
  background: "#4ade80",
  color: "#07111a",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  padding: 18,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,.1)",
  background: "#111827",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};



