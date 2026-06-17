import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import CreatorCity from "../pages/CreatorCity";
import SafetyCityLanding from "../pages/SafetyCityLanding";
import FamilyCityLanding from "../pages/FamilyCityLanding";
import CommerceCityLanding from "../pages/CommerceCityLanding";

type Planet = {
  title: string;
  to: string;
  status: "LIVE" | "NEXT" | "FOUNDATION";
  description: string;
};

const planets: Planet[] = [
  {
    title: "Guardian Planet",
    to: "/city/family",
    status: "LIVE",
    description: "People, pets, family care, Predator Shield, and trusted awareness.",
  },
  {
    title: "Service Planet",
    to: "/service/taylor-creek",
    status: "LIVE",
    description: "Requests, estimates, dispatch, proof, payment, and customer clarity.",
  },
  {
    title: "Commerce Planet",
    to: "/city/commerce",
    status: "LIVE",
    description: "Orders, appointments, product flow, payments, and customer updates.",
  },
  {
    title: "Creator Planet",
    to: "/city/creator",
    status: "LIVE",
    description: "Ideas become pages, boards, QR flows, previews, and live systems.",
  },
  {
    title: "Experience Planet",
    to: "/planet/live-pages/experiences",
    status: "NEXT",
    description: "Escape rooms, fishing trips, events, QR moments, and guest memories.",
  },
  {
    title: "Education Planet",
    to: "/city/education",
    status: "FOUNDATION",
    description: "Real projects, student progress, parent awareness, and proof of learning.",
  },
  {
    title: "Health Planet",
    to: "/city/health",
    status: "FOUNDATION",
    description: "Care coordination, reminders, family updates, and trusted timelines.",
  },
  {
    title: "Legal Planet",
    to: "/city/legal",
    status: "FOUNDATION",
    description: "Client intake, case status, documents, proof, and communication flow.",
  },
];

const doctrines = [
  {
    title: "We do not sell your data",
    text: "Your family, business, pets, customers, memories, and movement are not the product.",
  },
  {
    title: "Anti-surveillance by design",
    text: "Awareness without exploitation. Coordination without harvesting people.",
  },
  {
    title: "Predator Shield",
    text: "Protection belongs in the foundation: children, families, neighborhoods, prevention, and trusted reporting.",
  },
  {
    title: "The beginning of self",
    text: "Before the system, there is the person: identity, trust, proof, care, and presence.",
  },
];

const philosophy = [
  {
    title: "Presence over surveillance",
    text: "HomePlanet is designed to show what matters without turning people into data points.",
  },
  {
    title: "Coordination over chaos",
    text: "Every system exists to reduce confusion between families, staff, customers, guests, and communities.",
  },
  {
    title: "Protection by design",
    text: "Safety, privacy, and trusted awareness belong in the foundation, not bolted on later.",
  },
];

function CityIndex() {
  const shell: CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% 14%, rgba(16,185,129,0.10), transparent 30%), radial-gradient(circle at 8% 82%, rgba(16,185,129,0.06), transparent 26%), linear-gradient(180deg, #050505 0%, #080808 52%, #050505 100%)",
    color: "#f8fafc",
    padding: "24px 18px 64px",
  };

  const wrap: CSSProperties = {
    width: "min(1120px, 100%)",
    margin: "0 auto",
  };

  const nav: CSSProperties = {
    height: 54,
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 999,
    background: "rgba(10,10,10,0.86)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 14px",
    marginBottom: 54,
    boxShadow: "0 18px 70px rgba(0,0,0,0.34)",
  };

  const brand: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#fff",
    textDecoration: "none",
    fontWeight: 950,
  };

  const logo: CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: 999,
    objectFit: "cover",
  };

  const navLinks: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 18,
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 800,
  };

  const buildBtn: CSSProperties = {
    background: "#f8fafc",
    color: "#020617",
    borderRadius: 999,
    padding: "8px 13px",
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 950,
  };

  const hero: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.92fr) minmax(340px, 1.08fr)",
    gap: 36,
    alignItems: "center",
    marginBottom: 54,
  };

  const eyebrow: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid rgba(52,211,153,0.28)",
    background: "rgba(6,78,59,0.16)",
    color: "#a7f3d0",
    borderRadius: 999,
    padding: "7px 11px",
    fontSize: 12,
    fontWeight: 950,
    marginBottom: 18,
  };

  const h1: CSSProperties = {
    margin: 0,
    fontSize: "clamp(48px, 7vw, 86px)",
    lineHeight: 0.91,
    letterSpacing: "-0.078em",
    color: "#f8fafc",
  };

  const sub: CSSProperties = {
    marginTop: 18,
    color: "#cbd5e1",
    lineHeight: 1.56,
    fontSize: 17,
    maxWidth: 630,
  };

  const actions: CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 24,
  };

  const primary: CSSProperties = {
    borderRadius: 999,
    padding: "13px 17px",
    background: "#34d399",
    color: "#022c22",
    fontWeight: 950,
    textDecoration: "none",
    boxShadow: "0 0 28px rgba(52,211,153,0.18)",
  };

  const secondary: CSSProperties = {
    borderRadius: 999,
    padding: "13px 17px",
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    border: "1px solid rgba(255,255,255,0.14)",
    fontWeight: 950,
    textDecoration: "none",
  };

  const hub: CSSProperties = {
    position: "relative",
    minHeight: 500,
    borderRadius: 34,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "radial-gradient(circle at 50% 50%, rgba(52,211,153,0.14), transparent 30%), linear-gradient(145deg, rgba(15,23,42,0.64), rgba(5,5,5,0.96))",
    overflow: "hidden",
    boxShadow: "0 30px 100px rgba(0,0,0,0.52)",
    padding: 22,
  };

  const core: CSSProperties = {
    position: "absolute",
    inset: "50% auto auto 50%",
    transform: "translate(-50%, -50%)",
    width: 245,
    height: 245,
    borderRadius: 999,
    border: "1px solid rgba(52,211,153,0.36)",
    background:
      "radial-gradient(circle, rgba(52,211,153,0.16), rgba(2,6,23,0.9) 62%)",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: 24,
    boxShadow: "0 0 80px rgba(52,211,153,0.16)",
  };

  const doctrineCard = (i: number): CSSProperties => {
    const positions: CSSProperties[] = [
      { top: 26, left: 26 },
      { top: 26, right: 26 },
      { bottom: 26, left: 26 },
      { bottom: 26, right: 26 },
    ];

    return {
      position: "absolute",
      width: 205,
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: 22,
      background: "rgba(5,5,5,0.64)",
      padding: 14,
      color: "#e5e7eb",
      ...positions[i],
    };
  };

  const orbitLine: CSSProperties = {
    position: "absolute",
    inset: "74px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.055)",
  };

  const philosophyPanel: CSSProperties = {
    borderRadius: 36,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(135deg, rgba(14,14,14,0.96), rgba(6,6,6,0.96)), radial-gradient(circle at 80% 20%, rgba(52,211,153,0.10), transparent 30%)",
    padding: "clamp(24px, 5vw, 46px)",
    boxShadow: "0 28px 90px rgba(0,0,0,0.42)",
    marginBottom: 18,
  };

  const h2: CSSProperties = {
    margin: 0,
    fontSize: "clamp(36px, 5vw, 64px)",
    lineHeight: 0.96,
    letterSpacing: "-0.07em",
    maxWidth: 780,
  };

  const philosophyGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))",
    gap: 14,
    marginTop: 28,
  };

  const philosophyCard: CSSProperties = {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.035)",
    padding: 18,
    minHeight: 160,
  };

  const atlasMap: CSSProperties = {
    marginTop: 18,
    borderRadius: 30,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(12,12,12,0.82)",
    padding: 22,
  };

  const planetGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
    marginTop: 16,
  };

  const statusBadge = (status: Planet["status"]): CSSProperties => ({
    borderRadius: 999,
    padding: "5px 7px",
    fontSize: 9,
    fontWeight: 950,
    letterSpacing: "0.08em",
    border:
      status === "LIVE"
        ? "1px solid rgba(52,211,153,0.34)"
        : "1px solid rgba(148,163,184,0.18)",
    color: status === "LIVE" ? "#bbf7d0" : "#cbd5e1",
    background: status === "LIVE" ? "rgba(52,211,153,0.10)" : "rgba(15,23,42,0.6)",
  });

  const planetCard: CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(5,5,5,0.52)",
    padding: 13,
    color: "#e5e7eb",
    textDecoration: "none",
    display: "block",
  };

  const footerPanel: CSSProperties = {
    marginTop: 18,
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "linear-gradient(135deg, rgba(17,17,17,0.92), rgba(5,5,5,0.94))",
    padding: 24,
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 18,
    alignItems: "center",
  };

  return (
    <main style={shell}>
      <div style={wrap}>
        <nav style={nav}>
          <Link to="/" style={brand}>
            <img src="/images/HomePlanet-Official-Logo-V1.png" alt="HomePlanet" style={logo} />
            <span>HomePlanet</span>
          </Link>

          <div style={navLinks} className="hp-atlas-nav-links">
            <span>Doctrine</span>
            <span>Atlas</span>
            <span>Live Systems</span>
          </div>

          <Link to="/planet/build-your-live-system" style={buildBtn}>
            Build
          </Link>
        </nav>

        <section style={hero} className="hp-atlas-hero">
          <div>
            <div style={eyebrow}>The Atlas starts at the core.</div>
            <h1 style={h1}>HomePlanet Atlas</h1>
            <p style={sub}>
              A privacy-first living system built around self, family, business, care,
              protection, and real-world coordination.
            </p>
            <p style={sub}>
              This is not a pile of links. It is the hub. The doctrine stays in the center.
              Every planet connects back to trust, protection, useful awareness, and the beginning of self.
            </p>

            <div style={actions}>
              <a href="#philosophy" style={primary}>Read the Philosophy</a>
              <Link to="/city/family" style={secondary}>Open Guardian Planet</Link>
            </div>
          </div>

          <div style={hub}>
            <div style={orbitLine} />
            <div style={core}>
              <div>
                <div style={{ color: "#34d399", fontSize: 12, fontWeight: 950, letterSpacing: "0.14em" }}>
                  CORE HUB
                </div>
                <div style={{ marginTop: 10, fontSize: 29, fontWeight: 950, lineHeight: 1 }}>
                  Doctrine First
                </div>
                <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 13, lineHeight: 1.45 }}>
                  Trust, protection, privacy, proof, care, and presence.
                </div>
              </div>
            </div>

            {doctrines.map((d, i) => (
              <div key={d.title} style={doctrineCard(i)}>
                <div style={{ color: "#34d399", fontWeight: 950, fontSize: 11, letterSpacing: "0.12em" }}>
                  0{i + 1}
                </div>
                <div style={{ marginTop: 8, fontWeight: 950, lineHeight: 1.15 }}>{d.title}</div>
                <div style={{ marginTop: 7, color: "#94a3b8", fontSize: 12, lineHeight: 1.35 }}>
                  {d.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="philosophy" style={philosophyPanel}>
          <div style={{ color: "#34d399", fontSize: 12, fontWeight: 950, letterSpacing: "0.16em" }}>
            HOMEPLANET PHILOSOPHY
          </div>

          <h2 style={{ ...h2, marginTop: 12 }}>
            Technology should protect the real world, not consume it.
          </h2>

          <p style={{ color: "#94a3b8", lineHeight: 1.55, maxWidth: 760, fontSize: 17, marginTop: 18 }}>
            HomePlanet is built for people who are tired of digital chaos. No endless feeds.
            No data harvesting. No fake engagement traps. Just simple live systems that help families,
            businesses, creators, guests, and communities know what matters and what happens next.
          </p>

          <div style={philosophyGrid}>
            {philosophy.map((p, i) => (
              <article key={p.title} style={philosophyCard}>
                <div style={{ color: "#34d399", fontSize: 12, fontWeight: 950, letterSpacing: "0.14em" }}>
                  0{i + 1}
                </div>
                <h3 style={{ margin: "12px 0 0", fontSize: 26, lineHeight: 1.05, letterSpacing: "-0.045em" }}>
                  {p.title}
                </h3>
                <p style={{ color: "#94a3b8", lineHeight: 1.48, marginBottom: 0 }}>
                  {p.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section style={atlasMap}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", alignItems: "end" }}>
            <div>
              <div style={{ color: "#34d399", fontSize: 12, fontWeight: 950, letterSpacing: "0.16em" }}>
                ATLAS MAP
              </div>
              <h2 style={{ margin: "8px 0 0", fontSize: 34, letterSpacing: "-0.055em" }}>
                Choose a planet when you need the tool.
              </h2>
            </div>

            <p style={{ color: "#94a3b8", lineHeight: 1.45, maxWidth: 430, margin: 0 }}>
              The map stays secondary. The philosophy leads. The planets sit underneath the hood until someone is ready to enter one.
            </p>
          </div>

          <div style={planetGrid}>
            {planets.map((p) => (
              <Link to={p.to} key={p.title} style={planetCard}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ fontWeight: 950, color: "#f8fafc" }}>{p.title}</div>
                  <span style={statusBadge(p.status)}>{p.status}</span>
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.35, marginTop: 7 }}>
                  {p.description}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={footerPanel} className="hp-atlas-footer-panel">
          <div>
            <div style={{ color: "#34d399", fontSize: 12, fontWeight: 950, letterSpacing: "0.16em" }}>
              THE POINT
            </div>
            <div style={{ marginTop: 8, fontSize: 30, fontWeight: 950, letterSpacing: "-0.05em" }}>
              One core. Many systems. No chaos.
            </div>
            <p style={{ color: "#94a3b8", lineHeight: 1.5, marginBottom: 0 }}>
              HomePlanet should feel like an operating room, not a junk drawer. The Atlas gives every system
              a place without forcing everything onto one screen.
            </p>
          </div>

          <Link to="/planet/build-your-live-system" style={primary}>
            Build Your Live System
          </Link>
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hp-atlas-hero {
            grid-template-columns: 1fr !important;
          }

          .hp-atlas-nav-links {
            display: none !important;
          }

          .hp-atlas-footer-panel {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          .hp-atlas-hero > div:nth-child(2) {
            min-height: 560px !important;
          }
        }
      `}</style>
    </main>
  );
}

function CityPlaceholder() {
  const loc = useLocation();
  const seg = (loc.pathname.split("/city/")[1] || "").split("/")[0].trim();
  const city = seg || "city";

  const shell: CSSProperties = { padding: 24, maxWidth: 1100, margin: "0 auto", color: "#e5e7eb" };
  const h2: CSSProperties = { fontSize: 26, fontWeight: 900, margin: 0 };
  const sub: CSSProperties = { color: "#94a3b8", marginTop: 10, lineHeight: 1.4 };

  const row: CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 };

  const btn: CSSProperties = {
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(15,23,42,0.55)",
    color: "#e5e7eb",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const panel: CSSProperties = {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(2,6,23,0.35)",
  };

  return (
    <div style={shell}>
      <div style={panel}>
        <div style={h2}>{city.charAt(0).toUpperCase() + city.slice(1)} Planet</div>
        <div style={sub}>
          This planet route exists, but the full live system page has not been wired yet.
          <br />
          You are not lost. This is part of the Atlas foundation.
        </div>

        <div style={row}>
          <Link to="/city" style={btn}>
            Back to Atlas
          </Link>
          <Link to="/service/taylor-creek" style={btn}>
            Open Service Planet
          </Link>
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: "#94a3b8" }}>
          When we wire this planet, this placeholder will be replaced automatically.
        </div>
      </div>
    </div>
  );
}

export default function CityRoutes() {
  return (
    <Routes>
      <Route index element={<CityIndex />} />

      <Route path="creator" element={<CreatorCity />} />
      <Route path="service" element={<Navigate to="/service/taylor-creek" replace />} />
      <Route path="safety" element={<SafetyCityLanding />} />
      <Route path="family" element={<FamilyCityLanding />} />
      <Route path="commerce" element={<CommerceCityLanding />} />

      <Route path="*" element={<CityPlaceholder />} />
    </Routes>
  );
}
