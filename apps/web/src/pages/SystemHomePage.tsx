import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SystemHomePage() {
  const nav = useNavigate();
  const { slug = "" } = useParams<{ slug: string }>();

  const system = useMemo(() => {
    try {
      const raw = localStorage.getItem(`hp-system:${slug}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [slug]);

  const businessName = system?.businessName || slug || "HomePlanet System";
  const boardSlug = system?.boardSlug || slug;
  const presenceId = system?.presenceId || "";

  const card: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.045)",
    padding: 18,
    color: "white",
    boxShadow: "0 18px 55px rgba(0,0,0,0.28)",
  };

  const button: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(0,255,150,0.25)",
    background: "rgba(0,255,150,0.10)",
    color: "rgba(220,255,245,0.96)",
    borderRadius: 16,
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 950,
    textAlign: "left",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07111f", padding: 18 }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 950, textTransform: "uppercase", color: "rgba(220,255,245,0.72)" }}>
            HomePlanet System Ready
          </div>

          <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.02 }}>
            {businessName}
          </h1>

          <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", lineHeight: 1.55 }}>
            One business system created. Everything below is connected to the same board slug and Presence ID.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
            <Tag label={`Board: ${boardSlug}`} />
            {presenceId ? <Tag label={`Presence: ${presenceId}`} /> : null}
          </div>
        </div>

        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <button style={button} onClick={() => nav(`/planet/live/${boardSlug}`)}>
            Open Live Board
            <div style={{ marginTop: 4, fontSize: 12, opacity: 0.72 }}>Run the work and customer-facing job flow.</div>
          </button>

          <button style={button} onClick={() => nav(`/planet/staff/${boardSlug}`)}>
            Open Staff Board
            <div style={{ marginTop: 4, fontSize: 12, opacity: 0.72 }}>Internal team coordination view.</div>
          </button>

          <button style={button} onClick={() => nav(`/planet/lobby/${boardSlug}`)}>
            Open Lobby Board
            <div style={{ marginTop: 4, fontSize: 12, opacity: 0.72 }}>Public room display for customers.</div>
          </button>

          <button style={button} onClick={() => nav(`/planet/creator/${boardSlug}/moment`)}>
            Open Creator Moment
            <div style={{ marginTop: 4, fontSize: 12, opacity: 0.72 }}>The launch/proof moment tied to this system.</div>
          </button>

          <button style={{ ...button, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)" }} onClick={() => nav("/planet/creator/studio")}>
            Back to Creator Studio
            <div style={{ marginTop: 4, fontSize: 12, opacity: 0.72 }}>Create or review another business system.</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <div style={{
      borderRadius: 999,
      padding: "8px 12px",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "rgba(255,255,255,0.06)",
      fontSize: 12,
      fontWeight: 900,
      color: "rgba(255,255,255,0.88)",
    }}>
      {label}
    </div>
  );
}
