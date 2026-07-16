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

function HomePlanetFrontDoorIndex() {
  const shell: CSSProperties = {
    minHeight: "100vh",
    color: "#f5fff8",
    background:
      "radial-gradient(circle at 50% 8%, rgba(67,255,132,0.13), transparent 30rem), radial-gradient(circle at 8% 78%, rgba(40,118,255,0.06), transparent 28rem), #020504",
    padding: "24px 18px 72px",
  };

  const wrap: CSSProperties = {
    width: "min(1120px, 100%)",
    margin: "0 auto",
  };

  const nav: CSSProperties = {
    minHeight: 78,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    padding: "0 4px",
    marginBottom: 0,
  };

  const brand: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 11,
    color: "#f5fff8",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 950,
    letterSpacing: "-0.025em",
  };

  const logo: CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 999,
    objectFit: "cover",
    boxShadow:
      "0 0 0 5px rgba(84,255,141,0.045), 0 0 22px rgba(84,255,141,0.16)",
  };

  const atlasLink: CSSProperties = {
    color: "rgba(231,246,236,0.56)",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 850,
  };

  const hero: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.88fr) minmax(430px, 1.12fr)",
    gap: 52,
    alignItems: "center",
    padding: "92px 0 86px",
    marginBottom: 0,
  };

  const eyebrow: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: "#69ff99",
    fontSize: 10,
    fontWeight: 950,
    letterSpacing: "0.17em",
    textTransform: "uppercase",
    marginBottom: 24,
  };

  const h1: CSSProperties = {
    maxWidth: 620,
    margin: 0,
    fontSize: "clamp(62px, 7.6vw, 108px)",
    lineHeight: 0.88,
    letterSpacing: "-0.078em",
    color: "#f8fff9",
    fontWeight: 950,
    textShadow: "0 0 42px rgba(65,255,126,0.06)",
  };

  const intro: CSSProperties = {
    maxWidth: 650,
    margin: "28px auto 0",
    color: "rgba(229,245,234,0.6)",
    fontSize: "clamp(17px, 2vw, 21px)",
    lineHeight: 1.55,
  };

  const directionGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  };

  const directions = [
    {
      number: "01",
      title: "Run a Business",
      description:
        "Build the public page customers see and run the real work underneath.",
      detail: "Requests · Estimates · Scheduling · Payment · Proof",
      to: "/city/creator",
    },
    {
      number: "02",
      title: "Care for People & Pets",
      description:
        "Keep care, trust, updates, protection, and the people involved connected.",
      detail: "Family · Pet Care · Elder Care · Trusted Awareness",
      to: "/city/family",
    },
    {
      number: "03",
      title: "Bring People Together",
      description:
        "Turn local needs, offers, events, and community action into organized movement.",
      detail: "Community · Events · Local Help · Opportunities",
      to: "/planet/okeechobee",
    },
  ];

  return (
    <main style={shell}>
      <div style={wrap}>
        <nav style={nav}>
          <Link to="/city" style={brand}>
            <img
              src="/images/HomePlanet-Official-Logo-V1.png"
              alt="HomePlanet"
              style={logo}
            />
            <span>HomePlanet</span>
          </Link>

          <Link to="/city/atlas" style={atlasLink}>
            Open Atlas →
          </Link>
        </nav>

        <section style={hero}>
          <div style={eyebrow}>Start where you are</div>

          <h1 style={h1}>What are you trying to do?</h1>

          <p style={intro}>
            Choose the direction that fits. HomePlanet connects the public
            entrance to the real work, care, or coordination happening
            underneath.
          </p>
        </section>

        <section style={directionGrid} className="hp-front-door-grid">
          {directions.map((direction) => (
            <Link
              key={direction.title}
              to={direction.to}
              className="hp-front-door-card"
              style={{
                minHeight: 330,
                padding: 28,
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 26,
                color: "#f5fff8",
                textDecoration: "none",
                background:
                  "radial-gradient(circle at 50% 0%, rgba(71,255,136,0.075), transparent 70%), linear-gradient(145deg, rgba(255,255,255,0.038), rgba(255,255,255,0.012))",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow:
                  "0 24px 70px rgba(0,0,0,0.28), inset 0 1px rgba(255,255,255,0.035)",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#69ff99",
                    fontSize: 10,
                    fontWeight: 950,
                    letterSpacing: "0.14em",
                  }}
                >
                  {direction.number}
                </div>

                <h2
                  style={{
                    margin: "22px 0 0",
                    fontSize: "clamp(31px, 4vw, 45px)",
                    lineHeight: 0.98,
                    letterSpacing: "-0.055em",
                  }}
                >
                  {direction.title}
                </h2>

                <p
                  style={{
                    margin: "18px 0 0",
                    color: "rgba(230,244,234,0.55)",
                    fontSize: 16,
                    lineHeight: 1.55,
                  }}
                >
                  {direction.description}
                </p>
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(228,244,234,0.4)",
                    fontSize: 12,
                    lineHeight: 1.5,
                  }}
                >
                  {direction.detail}
                </div>

                <div
                  style={{
                    marginTop: 18,
                    color: "#70ff9d",
                    fontSize: 14,
                    fontWeight: 950,
                  }}
                >
                  Enter this direction →
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>

      <style>{`
        .hp-front-door-card {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .hp-front-door-card:hover {
          transform: translateY(-5px);
          border-color: rgba(91, 255, 147, 0.28) !important;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(71, 255, 136, 0.11),
              transparent 70%
            ),
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.05),
              rgba(255, 255, 255, 0.016)
            ) !important;
        }

        @media (max-width: 850px) {
          .hp-front-door-grid {
            grid-template-columns: 1fr !important;
          }

          .hp-front-door-card {
            min-height: 270px !important;
          }
        }
      `}</style>
    </main>
  );
}
function AtlasIndex() {
  const shell: CSSProperties = {
    minHeight: "100vh",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 50% 4%, rgba(66,255,130,0.14), transparent 32rem), radial-gradient(circle at 8% 58%, rgba(43,124,255,0.055), transparent 30rem), radial-gradient(circle at 92% 84%, rgba(66,255,130,0.05), transparent 28rem), #020504",
    color: "#f5fff8",
    padding: "0 18px 78px",
  };

  const wrap: CSSProperties = {
    width: "min(1120px, 100%)",
    margin: "0 auto",
  };

  const nav: CSSProperties = {
    minHeight: 78,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    padding: "0 4px",
    marginBottom: 0,
  };

  const brand: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 11,
    color: "#f5fff8",
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 950,
    letterSpacing: "-0.025em",
  };

  const logo: CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 999,
    objectFit: "cover",
    boxShadow:
      "0 0 0 5px rgba(84,255,141,0.045), 0 0 22px rgba(84,255,141,0.16)",
  };

  const navLinks: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 22,
    fontSize: 11,
    color: "rgba(231,246,236,0.48)",
    fontWeight: 900,
    letterSpacing: "0.025em",
  };

  const buildBtn: CSSProperties = {
    minHeight: 41,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#54ff8d",
    color: "#031008",
    borderRadius: 12,
    padding: "0 17px",
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 950,
    boxShadow: "0 12px 30px rgba(48,255,115,0.13)",
  };

  const hero: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.88fr) minmax(430px, 1.12fr)",
    gap: 52,
    alignItems: "center",
    padding: "92px 0 86px",
    marginBottom: 0,
  };

  const eyebrow: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: "#69ff99",
    fontSize: 10,
    fontWeight: 950,
    letterSpacing: "0.17em",
    textTransform: "uppercase",
    marginBottom: 24,
  };

  const h1: CSSProperties = {
    maxWidth: 620,
    margin: 0,
    fontSize: "clamp(62px, 7.6vw, 108px)",
    lineHeight: 0.88,
    letterSpacing: "-0.078em",
    color: "#f8fff9",
    fontWeight: 950,
    textShadow: "0 0 42px rgba(65,255,126,0.06)",
  };

  const sub: CSSProperties = {
    marginTop: 22,
    color: "rgba(230,244,234,0.58)",
    lineHeight: 1.62,
    fontSize: 17,
    maxWidth: 610,
  };

  const actions: CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 31,
  };

  const primary: CSSProperties = {
    minHeight: 50,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    padding: "0 20px",
    background: "#54ff8d",
    color: "#031008",
    fontWeight: 950,
    textDecoration: "none",
    boxShadow:
      "0 0 0 1px rgba(102,255,155,0.12), 0 16px 36px rgba(48,255,115,0.16)",
  };

  const secondary: CSSProperties = {
    minHeight: 50,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    padding: "0 20px",
    background: "rgba(255,255,255,0.03)",
    color: "#f2fff6",
    border: "1px solid rgba(255,255,255,0.13)",
    fontWeight: 950,
    textDecoration: "none",
  };

  const hub: CSSProperties = {
    position: "relative",
    minHeight: 560,
    borderRadius: 34,
    border: "1px solid rgba(91,255,147,0.16)",
    background:
      "radial-gradient(circle at 50% 48%, rgba(62,255,128,0.15), transparent 31%), linear-gradient(145deg, rgba(255,255,255,0.028), rgba(3,8,5,0.96))",
    overflow: "hidden",
    boxShadow:
      "0 34px 110px rgba(0,0,0,0.5), inset 0 1px rgba(255,255,255,0.045)",
    padding: 24,
  };

  const core: CSSProperties = {
    position: "absolute",
    inset: "50% auto auto 50%",
    transform: "translate(-50%, -50%)",
    width: 250,
    height: 250,
    borderRadius: 999,
    border: "1px solid rgba(84,255,141,0.32)",
    background:
      "radial-gradient(circle, rgba(67,255,132,0.16), rgba(3,11,6,0.96) 67%)",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: 28,
    boxShadow:
      "0 0 0 18px rgba(84,255,141,0.018), 0 0 85px rgba(52,255,119,0.13)",
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
      width: 210,
      minHeight: 142,
      border: "1px solid rgba(255,255,255,0.085)",
      borderRadius: 20,
      background:
        "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015)), rgba(3,8,5,0.84)",
      padding: 16,
      color: "#effff4",
      boxShadow:
        "0 18px 45px rgba(0,0,0,0.28), inset 0 1px rgba(255,255,255,0.035)",
      ...positions[i],
    };
  };

  const orbitLine: CSSProperties = {
    position: "absolute",
    inset: "76px",
    borderRadius: 999,
    border: "1px solid rgba(84,255,141,0.065)",
    boxShadow:
      "0 0 55px rgba(65,255,126,0.025), inset 0 0 55px rgba(65,255,126,0.02)",
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
            <div style={eyebrow}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "#54ff8d",
                  boxShadow: "0 0 18px rgba(84,255,141,0.8)",
                }}
              />
              The Atlas starts at the core
            </div>

            <h1 style={h1}>
              HomePlanet
              <br />
              <span
                style={{
                  color: "#59ff91",
                  textShadow: "0 0 38px rgba(65,255,126,0.16)",
                }}
              >
                Atlas
              </span>
            </h1>
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
            gap: 44px !important;
            padding: 76px 0 72px !important;
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
  const sub: CSSProperties = {
    marginTop: 22,
    color: "rgba(230,244,234,0.58)",
    lineHeight: 1.62,
    fontSize: 17,
    maxWidth: 610,
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
      <Route index element={<AtlasIndex />} />
      <Route path="atlas" element={<Navigate to="/city" replace />} />

      <Route path="creator" element={<CreatorCity />} />
      <Route path="service" element={<Navigate to="/service/taylor-creek" replace />} />
      <Route path="safety" element={<SafetyCityLanding />} />
      <Route path="family" element={<FamilyCityLanding />} />
      <Route path="commerce" element={<CommerceCityLanding />} />

      <Route path="*" element={<CityPlaceholder />} />
    </Routes>
  );
}



