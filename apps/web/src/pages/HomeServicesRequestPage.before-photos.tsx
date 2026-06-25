import React from "react";

export default function HomeServicesRequestPage() {
  return (
    <main style={page}>
      <div style={container}>
        <h1 style={title}>Need Help Around The Property?</h1>

        <p style={subtitle}>
          Request an estimate for exterior cleaning, roof washing,
          driveway cleaning, window cleaning, and more.
        </p>

        <section style={section}>
          <h2 style={heading}>Select Service</h2>

          <div style={grid}>
            <button style={card}>House Wash</button>
            <button style={card}>Roof Cleaning</button>
            <button style={card}>Driveway Cleaning</button>
            <button style={card}>Window Cleaning</button>
            <button style={card}>Soft Wash</button>
            <button style={card}>Other</button>
          </div>
        </section>

        <section style={section}>
          <h2 style={heading}>Property Information</h2>

          <input style={input} placeholder="Name" />
          <input style={input} placeholder="Phone Number" />
          <input style={input} placeholder="Property Address" />
        </section>

        <section style={section}>
          <h2 style={heading}>Tell Us About The Job</h2>

          <textarea
            style={textarea}
            placeholder="Describe what needs attention..."
          />
        </section>

        <section style={section}>
          <button style={submitButton}>
            Request Estimate
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

const title: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 900,
  marginBottom: 12,
};

const subtitle: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: 18,
  marginBottom: 30,
};

const section: React.CSSProperties = {
  marginBottom: 24,
};

const heading: React.CSSProperties = {
  marginBottom: 12,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
};

const card: React.CSSProperties = {
  padding: 20,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,.1)",
  background: "#111827",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 14,
  marginBottom: 12,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.1)",
  background: "#111827",
  color: "#fff",
};

const textarea: React.CSSProperties = {
  width: "100%",
  minHeight: 140,
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.1)",
  background: "#111827",
  color: "#fff",
};

const submitButton: React.CSSProperties = {
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
