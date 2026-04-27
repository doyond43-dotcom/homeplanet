import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StaffBoardPage() {
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
  const presenceId = system?.presenceId || "";

  return (
    <div style={{ minHeight: "100vh", background: "#07111f", color: "white", padding: 18 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ borderRadius: 22, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.045)", padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 950, textTransform: "uppercase", color: "rgba(255,255,255,0.68)" }}>
            Staff Board
          </div>
          <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.02 }}>
            Team view for {boardSlug}
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.76)", lineHeight: 1.55 }}>
            Internal staff coordination tied to the same HomePlanet origin.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <Tag label={`Board: ${boardSlug}`} />
            {presenceId ? <Tag label={`Presence: ${presenceId}`} /> : null}
            <Tag label="Connected system" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 18 }}>
          <Panel title="Work Queue" body="Jobs, requests, appointments, or active tasks can appear here." />
          <Panel title="Team Notes" body="Staff-only coordination without exposing internal details to customers." />
          <Panel title="Live Board Link" body={`/planet/live/${boardSlug}`} />
          <Panel title="Lobby Board Link" body={`/planet/lobby/${boardSlug}`} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <button style={buttonPrimary} onClick={() => nav(`/planet/live/${boardSlug}`)}>Open Live Board</button>
          <button style={button} onClick={() => nav(`/planet/lobby/${boardSlug}`)}>Open Lobby Board</button>
          <button style={button} onClick={() => nav(`/planet/creator/${boardSlug}/moment`)}>Creator Moment</button>
        </div>
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return <div style={{ borderRadius: 999, padding: "8px 12px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", fontSize: 12, fontWeight: 900 }}>{label}</div>;
}

function Panel({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ borderRadius: 20, border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.045)", padding: 16 }}>
      <div style={{ fontWeight: 950 }}>{title}</div>
      <div style={{ marginTop: 8, color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.45, wordBreak: "break-word" }}>{body}</div>
    </div>
  );
}

const button: React.CSSProperties = {
  height: 42,
  padding: "0 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: 12,
};

const buttonPrimary: React.CSSProperties = {
  ...button,
  border: "1px solid rgba(0,255,150,0.35)",
  background: "rgba(0,255,150,0.10)",
  color: "rgba(220,255,245,0.95)",
};
