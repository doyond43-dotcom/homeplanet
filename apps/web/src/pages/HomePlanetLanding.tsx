import * as React from "react";
import { useNavigate } from "react-router-dom";

type PlanetCard = {
  key: string;
  title: string;
  status?: string;
  desc: string;
  cities?: { label: string; to: string; live?: boolean }[];
};

export default function HomePlanetLanding() {
  const nav = useNavigate();
  const [openKey, setOpenKey] = React.useState<string | null>("creator");

  const planets: PlanetCard[] = [
    {
      key: "creator",
      title: "Creator Planet",
      status: "Live",
      desc: "Build, publish, intake, proof, and monetize — receipts by default.",
      cities: [
        { label: "Studio City", to: "/planet/creator/studio", live: true },
        { label: "Build City", to: "/planet/creator/build", live: true },
        { label: "Live City", to: "/planet/creator/live", live: false },
      ],
    },
    {
      key: "vehicles",
      title: "Vehicles Planet",
      status: "Coming online",
      desc: "Intake ? service ? disputes, with receipts + presence.",
      cities: [
        { label: "Intake City", to: "/planet/vehicles/intake", live: false },
        { label: "Service City", to: "/planet/vehicles/service", live: false },
      ],
    },
    {
      key: "education",
      title: "Education Planet",
      status: "Coming online",
      desc: "Presence-first timestamped classrooms with dispute-free submissions.",
      cities: [
        { label: "Classroom City", to: "/planet/education/classroom", live: false },
        { label: "Admin Review City", to: "/planet/education/admin", live: false },
      ],
    },
  ];

  const shell: React.CSSProperties = {
    minHeight: "100vh",
    padding: "40px 22px 60px",
    display: "flex",
    justifyContent: "center",
    background: "radial-gradient(900px 480px at 50% 0%, rgba(130,160,255,0.18), rgba(0,0,0,0) 60%), #070707",
    color: "rgba(255,255,255,0.92)",
  };

  const wrap: React.CSSProperties = {
    width: "min(1100px, 100%)",
  };

  const star: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 22,
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 0 60px rgba(120,140,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)",
  };

  const h1: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 0.3,
    margin: 0,
  };

  const sub: React.CSSProperties = {
    marginTop: 8,
    opacity: 0.78,
    lineHeight: 1.55,
    fontSize: 13.5,
    maxWidth: 860,
  };

  const defsRow: React.CSSProperties = {
    marginTop: 14,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  };

  const pill: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.20)",
    color: "rgba(255,255,255,0.86)",
  };

  const grid: React.CSSProperties = {
    marginTop: 22,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 26,
    background: "rgba(255,255,255,0.02)",
    padding: 16,
    cursor: "pointer",
  };

  const cardTitleRow: React.CSSProperties = {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  };

  const cardTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 14,
    margin: 0,
  };

  const badge: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 900,
    opacity: 0.85,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.25)",
    whiteSpace: "nowrap",
  };

  const cardDesc: React.CSSProperties = {
    marginTop: 8,
    opacity: 0.75,
    fontSize: 12.5,
    lineHeight: 1.5,
  };

  const citiesWrap: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const cityBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)",
    color: "rgba(255,255,255,0.90)",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 12.5,
  };

  const hint: React.CSSProperties = {
    marginTop: 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    opacity: 0.7,
    fontSize: 12,
  };

  const linkBtn: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 12,
  };

  return (
    <div style={shell}>
      <div style={wrap}>
        <div style={star}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h1 style={h1}>HOMEPLANET CORE</h1>
              <div style={sub}>
                Presence-first proof at inception. Receipts for meaningful actions. Orbits are shared systems that wrap every planet.
              </div>
            </div>

            <button
              type="button"
              style={linkBtn}
              onClick={() => nav("/planet/creator/studio")}
              title="Enter Creator Studio"
            >
              Enter Creator Studio ?
            </button>
          </div>

          <div style={defsRow}>
            <div style={pill}>Star = Core doctrine + shared rules</div>
            <div style={pill}>Planets = vertical worlds</div>
            <div style={pill}>Cities = workflows inside planets</div>
            <div style={pill}>Orbits = shared systems around everything</div>
          </div>
        </div>

        <div style={grid}>
          {planets.map((p) => {
            const isOpen = openKey === p.key;
            return (
              <div
                key={p.key}
                style={{
                  ...card,
                  background: isOpen ? "rgba(255,255,255,0.035)" : card.background,
                }}
                onClick={() => setOpenKey(isOpen ? null : p.key)}
              >
                <div style={cardTitleRow}>
                  <div style={cardTitle}>{p.title}</div>
                  <div style={badge}>{p.status ?? "Coming online"}</div>
                </div>

                <div style={cardDesc}>{p.desc}</div>

                {isOpen && p.cities && (
                  <div style={citiesWrap}>
                    {p.cities.map((c) => (
                      <button
                        key={c.label}
                        type="button"
                        style={{
                          ...cityBtn,
                          opacity: c.live ? 1 : 0.55,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (c.live) nav(c.to);
                        }}
                        title={c.live ? "Open" : "Coming online"}
                      >
                        <span>{c.label}</span>
                        <span style={{ opacity: 0.7, fontWeight: 900 }}>
                          {c.live ? "Open ?" : "Coming online"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {!isOpen && (
                  <div style={{ marginTop: 12, opacity: 0.55, fontSize: 12 }}>
                    Click to reveal cities
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={hint}>
          <div>Slow, efficient, planetary. Definitions first. Expand only what you need.</div>
          <button type="button" style={linkBtn} onClick={() => nav("/explorer")} title="Open Explorer">
            Open Explorer ?
          </button>
        </div>

        <style>{`
          @media (max-width: 980px) {
            .hpGridFix { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>

      <script />
    </div>
  );
}