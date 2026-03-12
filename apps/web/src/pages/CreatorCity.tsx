import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type PlanetCard = {
  id: string;
  title: string;
  subtitle: string;
  to: string;
};

type SystemCard = {
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

  const systems = useMemo<SystemCard[]>(
    () => [
      {
        id: "awnit",
        title: "AWNIT Service Board",
        subtitle: "/planet/vehicles/awnit-demo",
        to: "/planet/vehicles/awnit-demo",
      },
      {
        id: "wilding",
        title: "Wilding Live Board",
        subtitle: "/planet/services/wilding-board",
        to: "/planet/services/wilding-board",
      },
      {
        id: "restaurant",
        title: "Restaurant Rush Live",
        subtitle: "/planet/food/restaurant-rush-live",
        to: "/planet/food/restaurant-rush-live",
      },
      {
        id: "legal",
        title: "Legal Evidence Demo",
        subtitle: "/planet/legal/demo",
        to: "/planet/legal/demo",
      },
      {
        id: "transport",
        title: "Transportation Dispatch Demo",
        subtitle: "/planet/transport/demo",
        to: "/planet/transport/demo",
      },
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
    flexWrap: "wrap",
  };

  const titleBlock: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const titleRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  };

  const title: React.CSSProperties = {
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: -0.4,
  };

  const livePill: React.CSSProperties = {
    borderRadius: 999,
    padding: "6px 12px",
    border: "1px solid rgba(34,197,94,0.35)",
    background: "rgba(34,197,94,0.10)",
    color: "rgba(187,247,208,1)",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 0.5,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const pulseDot: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "rgba(74,222,128,1)",
    boxShadow: "0 0 10px rgba(74,222,128,0.8)",
  };

  const subtitle: React.CSSProperties = {
    fontSize: 14,
    opacity: 0.85,
    lineHeight: 1.5,
    maxWidth: 720,
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
    flexWrap: "wrap",
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

  const systemsGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginTop: 14,
  };

  const systemCard: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.55)",
    borderRadius: 14,
    padding: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
  };

  const systemTextWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  };

  const systemTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const systemSub: React.CSSProperties = {
    fontSize: 12,
    opacity: 0.74,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const liveBadge: React.CSSProperties = {
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 11,
    fontWeight: 900,
    border: "1px solid rgba(34,197,94,0.45)",
    color: "rgba(187,247,208,1)",
    background: "rgba(34,197,94,0.10)",
    flexShrink: 0,
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
            <div style={titleRow}>
              <div style={title}>Creator City</div>
              <div style={livePill}>
                <span style={pulseDot} />
                LIVE SYSTEMS
              </div>
            </div>

            <div style={subtitle}>
              This is the HomePlanet launchpad. Jump into Studio, Projects, Build, or open a live business system already running inside the network.
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
              The “Create Planet” button routes into the Creator build flow. This keeps Creator City clean, stable, and focused as the HomePlanet command center.
            </div>
            <div style={buttonRow}>
              <button style={btnPrimary} onClick={goBuild}>Start Build</button>
              <button style={btnBase} onClick={goProjects}>Open Projects</button>
            </div>
          </div>

          <div style={card}>
            <div style={cardTitle}>System Status</div>
            <div style={cardText}>
              Creator City now acts as the launchpad for active demos and future planet expansion.
              Live systems are listed below first so the network feels operational before everything else is fully wired.
            </div>
          </div>
        </div>

        <div style={sectionLabel}>Live Systems</div>

        <div style={systemsGrid}>
          {systems.map((s) => (
            <div key={s.id} style={systemCard} onClick={() => nav(s.to)}>
              <div style={systemTextWrap}>
                <div style={systemTitle}>{s.title}</div>
                <div style={systemSub}>{s.subtitle}</div>
              </div>
              <div style={liveBadge}>LIVE</div>
            </div>
          ))}
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