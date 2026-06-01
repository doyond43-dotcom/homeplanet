export default function LiveStudio() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        padding: "32px 20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            padding: 24,
            background: "rgba(255,255,255,0.03)",
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            HOMEPLANET
          </div>

          <h1
            style={{
              margin: "12px 0",
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            ?? Live Studio
          </h1>

          <p
            style={{
              opacity: 0.8,
              fontSize: 18,
              marginBottom: 0,
            }}
          >
            Broadcast. Meet. Present. Record.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 24,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <h2>?? Start Session</h2>
            <p>Create a live room and invite people.</p>

            <button
              style={{
                padding: "14px 20px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Start Session
            </button>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 24,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <h2>?? Welcome Videos</h2>
            <p>Record a Meet The Owner message.</p>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 24,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <h2>?? Past Sessions</h2>
            <p>No sessions yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
