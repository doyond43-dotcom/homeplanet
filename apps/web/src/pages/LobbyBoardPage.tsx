import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function LobbyBoardPage() {
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

  const boardSlug = system?.boardSlug || slug;
  const businessName = system?.businessName || boardSlug;
  const presenceId = system?.presenceId || "";

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "white", padding: 22 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ borderRadius: 28, border: "1px solid rgba(255,255,255,0.10)", background: "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(14,116,144,0.42))", padding: 26 }}>
          <div style={{ fontSize: 13, fontWeight: 950, textTransform: "uppercase", color: "rgba(255,255,255,0.68)" }}>
            Lobby Board
          </div>
          <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(2.4rem, 7vw, 5rem)", lineHeight: .95 }}>
            {businessName}
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.78)", fontSize: 18, lineHeight: 1.45 }}>
            Public room view connected to the live board.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
            <Tag label={`Board: ${boardSlug}`} />
            {presenceId ? <Tag label={`Presence: ${presenceId}`} /> : null}
            <Tag label="Live room view" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 18 }}>
          <BigPanel title="Now Active" body="Live status can show here without exposing staff-only details." />
          <BigPanel title="Next Up" body="Customer-facing next steps, queue status, or room instructions." />
          <BigPanel title="Proof-in-Motion" body="Creator moments can connect the visible work to the live board." />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <button style={buttonPrimary} onClick={() => nav(`/planet/live/${boardSlug}`)}>Open Live Board</button>
          <button style={button} onClick={() => nav(`/planet/staff/${boardSlug}`)}>Staff Board</button>
          <button style={button} onClick={() => nav(`/planet/creator/${boardSlug}/moment`)}>Creator Moment</button>
        </div>
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return <div style={{ borderRadius: 999, padding: "9px 13px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", fontSize: 13, fontWeight: 900 }}>{label}</div>;
}

function BigPanel({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ minHeight: 170, borderRadius: 24, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.045)", padding: 20 }}>
      <div style={{ fontSize: 24, fontWeight: 950 }}>{title}</div>
      <div style={{ marginTop: 10, color: "rgba(255,255,255,0.72)", fontSize: 16, lineHeight: 1.45 }}>{body}</div>
    </div>
  );
}

const button: React.CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
  fontWeight: 950,
  fontSize: 12,
};

const buttonPrimary: React.CSSProperties = {
  ...button,
  border: "1px solid rgba(0,255,150,0.35)",
  background: "rgba(0,255,150,0.10)",
  color: "rgba(220,255,245,0.95)",
};
