import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type PlanetCard = {
  id: string;
  title: string;
  subtitle: string;
  to: string;
};

export default function CreatorCity() {
  const nav = useNavigate();

  const planets = useMemo<PlanetCard[]>(
    () => [
      { id: "creator", title: "Creator", subtitle: "/planet/creator • Studio + Build", to: "/planet/creator" },
      { id: "career", title: "Career", subtitle: "/planet/career • Timeline + Proof", to: "/planet/career" },
      { id: "vehicles", title: "Vehicles", subtitle: "/planet/vehicles • Intake + Service", to: "/planet/vehicles" },
      { id: "education", title: "Education", subtitle: "/planet/education • Presence + Submissions", to: "/planet/education" },
      { id: "safety", title: "Safety & Identity", subtitle: "/planet/safety • Shield + Events", to: "/planet/safety" },
      { id: "payments", title: "Payments", subtitle: "/planet/payments • Pre-Auth + Caps", to: "/planet/payments" },
    ],
    []
  );

  const page: React.CSSProperties = {
    minHeight: "100vh",
    padding: 24,
    color: "#e5e7eb",
    background:
      "radial-gradient(900px 600px at 22% 12%, rgba(34,197,94,0.05), transparent 60%)," +
      "radial-gradient(900px 600px at 78% 14%, rgba(56,189,248,0.05), transparent 62%)," +
      "#020617",
  };

  const shell: React.CSSProperties = {
    maxWidth: 1280,
    margin: "0 auto",
  };

  const headerRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  };

  const titleBlock: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const title: React.CSSProperties = {
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: -0.4,
  };

  const subtitle: React.CSSProperties = {
    fontSize: 14,
    opacity: 0.85,
  };

  const pills: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  };

  const pillBase: React.CSSProperties = {
    borderRadius: 999,
    padding: "8px 14px",
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(2,6,23,0.55)",
    color: "#e5e7eb",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
  };

  const pillPrimary: React.CSSProperties = {
    ...pillBase,
    border: "1px solid rgba(34,197,94,0.45)",
    color: "rgba(187,247,208,1)",
  };

  const topGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginTop: 12,
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.55)",
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.00) 25%)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  };

  const cardTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 15,
    marginBottom: 8,
  };

  const cardText: React.CSSProperties = {
    fontSize: 13,
    opacity: 0.9,
    lineHeight: 1.5,
  };

  const buttonRow: React.CSSProperties = {
    display: "flex",
    gap: 10,
    marginTop: 14,
  };

  const btnBase: React.CSSProperties = {
    ...pillBase,
    padding: "9px 14px",
  };

  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    border: "1px solid rgba(34,197,94,0.45)",
    color: "rgba(187,247,208,1)",
  };

  const sectionLabel: React.CSSProperties = {
    marginTop: 26,
    fontWeight: 900,
    fontSize: 13,
    letterSpacing: 0.3,
    opacity: 0.9,
  };

  const planetGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    marginTop: 14,
  };

  const planetCard: React.CSSProperties = {
    ...card,
    cursor: "pointer",
    minHeight: 100,
  };

  const planetTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 15,
    marginBottom: 6,
  };

  const planetSub: React.CSSProperties = {
    fontSize: 12,
    opacity: 0.78,
  };

  const goCreatePlanet = () => nav("/creator/build");
  const goProjects = () => nav("/creator/projects");
  const goStudio = () => nav("/creator/studio");
  const goBuild = () => nav("/creator/build");

  return (
    <div style={page}>
      <div style={shell}>
        <div style={headerRow}>
          <div style={titleBlock}>
            <div style={title}>Creator City</div>
            <div style={subtitle}>
              This is the launchpad. Pick a planet, jump into Studio/Projects/Build, or create the next one.
            </div>
          </div>

          <div style={pills}>
            <button style={pillPrimary} onClick={goCreatePlanet}>+ Create Planet</button>
            <button style={pillBase} onClick={goProjects}>Projects</button>
            <button style={pillBase} onClick={goStudio}>Studio</button>
            <button style={pillBase} onClick={goBuild}>Build</button>
          </div>
        </div>

        <div style={topGrid}>
          <div style={card}>
            <div style={cardTitle}>Planet Creation Flow</div>
            <div style={cardText}>
              The “Create Planet” button routes into the Creator build flow. This keeps /city/creator clean and stable.
            </div>
            <div style={buttonRow}>
              <button style={btnPrimary} onClick={goBuild}>Start Build</button>
              <button style={btnBase} onClick={goProjects}>Open Projects</button>
            </div>
          </div>

          <div style={card}>
            <div style={cardTitle}>Notes</div>
            <div style={cardText}>
              Clean launchpad. Action buttons above. Planet entry below.
              We’ll add counters and badges later once system wiring is complete.
            </div>
          </div>
        </div>

        <div style={sectionLabel}>Planets</div>

        <div style={planetGrid}>
          {planets.map((p) => (
            <div key={p.id} style={planetCard} onClick={() => nav(p.to)}>
              <div style={planetTitle}>{p.title}</div>
              <div style={planetSub}>{p.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}