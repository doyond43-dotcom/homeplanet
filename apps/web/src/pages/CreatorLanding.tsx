import React from "react";

export default function CreatorLanding() {
  const open = (to: string) => {
    window.location.href = to;
  };

  const page: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(1100px 760px at 20% 0%, rgba(56,189,248,0.14), transparent 55%)," +
      "radial-gradient(1000px 720px at 100% 0%, rgba(168,85,247,0.12), transparent 52%)," +
      "linear-gradient(180deg, #020617 0%, #020617 100%)",
    color: "#e5e7eb",
    fontFamily: "Inter, system-ui, sans-serif",
    padding: 14,
  };

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 820,
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    padding: "26px 20px 22px",
    boxShadow:
      "0 30px 100px rgba(0,0,0,0.58), inset 0 1px 0 rgba(255,255,255,0.04)",
  };

  const title: React.CSSProperties = {
    fontSize: "clamp(2.4rem, 7.5vw, 4rem)",
    fontWeight: 900,
    color: "#ffffff",
    letterSpacing: -1.6,
    lineHeight: 0.95,
  };

  const subtitle: React.CSSProperties = {
    marginTop: 14,
    fontSize: "clamp(1.3rem, 3.6vw, 1.9rem)",
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.08,
  };

  const text: React.CSSProperties = {
    marginTop: 12,
    fontSize: "clamp(1.05rem, 2.8vw, 1.1rem)",
    color: "rgba(226,232,240,0.86)",
    lineHeight: 1.6,
  };

  const flowRow: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  };

  const pill: React.CSSProperties = {
    borderRadius: 999,
    padding: "8px 13px",
    fontSize: 12,
    fontWeight: 900,
    border: "1px solid rgba(56,189,248,0.30)",
    background: "rgba(56,189,248,0.08)",
    color: "#bae6fd",
  };

  const buttonGrid: React.CSSProperties = {
    display: "grid",
    gap: 10,
    marginTop: 26,
  };

  const primaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: "17px 18px",
    fontWeight: 900,
    fontSize: 18,
    border: "1px solid rgba(34,197,94,0.38)",
    background: "rgba(34,197,94,0.14)",
    color: "#dcfce7",
    cursor: "pointer",
  };

  const secondaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: "16px 18px",
    fontWeight: 900,
    fontSize: 17,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    cursor: "pointer",
  };

  const footer: React.CSSProperties = {
    marginTop: 22,
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 1.55,
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={title}>Creator City</div>

        <div style={subtitle}>Run your creator world from one place.</div>

        <div style={text}>
          Streams, clips, edits, drops, requests, and live selling â€” organized
          without the chaos.
        </div>

        <div style={flowRow}>
          <div style={pill}>Live</div>
          <div style={pill}>Clip</div>
          <div style={pill}>Edit</div>
          <div style={pill}>Drop</div>
        </div>

        <div style={buttonGrid}>
  <button
    type="button"
    style={primaryBtn}
    onClick={() => open("/planet/creator")}
  >
    Launch Creator City
  </button>

  <button
    type="button"
    style={secondaryBtn}
    onClick={() => open("/planet/creator/studio-board")}
  >
    Open Creator Studio
  </button>

  <button
    type="button"
    style={secondaryBtn}
    onClick={() => open("/planet/creator/systems")}
  >
    Open Live Systems
  </button>

  <button
    type="button"
    style={secondaryBtn}
    onClick={() => open("/planet/guardian-pet")}
  >
    View Guardian Demo
  </button>

  <button
    type="button"
    style={secondaryBtn}
    onClick={() => open("/planet/creator/projects")}
  >
    Open Projects
  </button>
</div>

<div style={footer}>
          Made for streamers, editors, gamers, stylists, live sellers, and
          creator-first businesses.
        </div>
      </div>
    </div>
  );
}


