import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomeServicesLeadBoard() {
  const navigate = useNavigate();

  return (
    <main style={page}>
      <div style={container}>
        <h1 style={title}>New Requests</h1>

        <div style={leadCard}>
          <h2 style={name}>Maria Jenkins</h2>
          <p style={service}>House Wash</p>
          <p style={muted}>123 Main Street</p>
          <p style={muted}>Photos: 3</p>
          <p style={muted}>Requested: 7:42 PM</p>

          <button
            style={button}
            onClick={() => navigate("/planet/home-services/lead")}
          >
            Open Lead
          </button>
        </div>

        <div style={leadCard}>
          <h2 style={name}>John Smith</h2>
          <p style={service}>Roof Cleaning</p>
          <p style={muted}>456 Oak Avenue</p>
          <p style={muted}>Photos: 5</p>
          <p style={muted}>Requested: 8:15 PM</p>

          <button
            style={button}
            onClick={() => navigate("/planet/home-services/lead")}
          >
            Open Lead
          </button>
        </div>

        <div style={leadCard}>
          <h2 style={name}>Sarah Johnson</h2>
          <p style={service}>Driveway Cleaning</p>
          <p style={muted}>789 Lake Road</p>
          <p style={muted}>Photos: 2</p>
          <p style={muted}>Requested: 9:03 PM</p>

          <button
            style={button}
            onClick={() => navigate("/planet/home-services/lead")}
          >
            Open Lead
          </button>
        </div>
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
  marginBottom: 24,
};

const leadCard: React.CSSProperties = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 20,
  padding: 24,
  marginBottom: 16,
};

const name: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  marginBottom: 8,
};

const service: React.CSSProperties = {
  fontSize: 18,
  marginBottom: 8,
};

const muted: React.CSSProperties = {
  color: "#94a3b8",
  marginBottom: 6,
};

const button: React.CSSProperties = {
  marginTop: 16,
  width: "100%",
  padding: 16,
  borderRadius: 16,
  border: 0,
  background: "#4ade80",
  color: "#07111a",
  fontWeight: 900,
  cursor: "pointer",
};


