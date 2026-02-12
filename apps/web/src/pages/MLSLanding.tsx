export default function MLSLanding() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px 22px",
        background:
          "radial-gradient(900px 480px at 50% 0%, rgba(130,160,255,0.18), rgba(0,0,0,0) 60%), #070707",
        color: "rgba(255,255,255,0.92)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 800, letterSpacing: 0.6 }}>
          HOMEPLANET / MLS
        </div>

        <h1 style={{ margin: "14px 0 6px", fontSize: 44, fontWeight: 950 }}>MLS</h1>

        <div style={{ opacity: 0.75, fontSize: 16 }}>
          Parenting Signal Infrastructure — isolated route (cannot break core)
        </div>

        <div
          style={{
            marginTop: 28,
            padding: 18,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          This is the clean MLS landing shell. Next: drop Chelsea content + cards + proof language.
        </div>
      </div>
    </div>
  );
}
