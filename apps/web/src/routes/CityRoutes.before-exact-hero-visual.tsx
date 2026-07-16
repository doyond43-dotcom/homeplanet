import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import CreatorCity from "../pages/CreatorCity";
import SafetyCityLanding from "../pages/SafetyCityLanding";
import FamilyCityLanding from "../pages/FamilyCityLanding";
import CommerceCityLanding from "../pages/CommerceCityLanding";

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
    padding: "clamp(92px, 12vw, 150px) 0 74px",
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
    maxWidth: 980,
    margin: 0,
    fontSize: "clamp(64px, 9vw, 122px)",
    lineHeight: 0.88,
    letterSpacing: "-0.078em",
    color: "#f8fff9",
    fontWeight: 950,
    textShadow: "0 0 46px rgba(65,255,126,0.055)",
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
    padding: "clamp(92px, 12vw, 150px) 0 74px",
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
    maxWidth: 980,
    margin: 0,
    fontSize: "clamp(64px, 9vw, 122px)",
    lineHeight: 0.88,
    letterSpacing: "-0.078em",
    color: "#f8fff9",
    fontWeight: 950,
    textShadow: "0 0 46px rgba(65,255,126,0.055)",
  };

  const sub: CSSProperties = {
    marginTop: 25,
    color: "rgba(230,244,234,0.60)",
    lineHeight: 1.62,
    fontSize: "clamp(17px, 2vw, 21px)",
    maxWidth: 760,
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

  const doctrineFoundation: CSSProperties = {
    marginBottom: 24,
    borderRadius: 32,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "radial-gradient(circle at 50% 0%, rgba(72,255,136,0.075), transparent 55%), linear-gradient(145deg, rgba(255,255,255,0.028), rgba(255,255,255,0.012))",
    padding: "clamp(24px, 4vw, 38px)",
    boxShadow:
      "0 26px 80px rgba(0,0,0,0.34), inset 0 1px rgba(255,255,255,0.035)",
  };

  const doctrineFoundationHeader: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 430px)",
    alignItems: "end",
    gap: 28,
    marginBottom: 28,
  };

  const doctrineGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 12,
  };

  const doctrineFoundationCard: CSSProperties = {
    minHeight: 190,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.075)",
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.032), rgba(255,255,255,0.012))",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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

  return (
    <main style={shell}>
      <div style={wrap}>
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
                  textShadow: "0 0 42px rgba(65,255,126,0.15)",
                }}
              >
                Atlas
              </span>
            </h1>

            <p
              style={{
                margin: "32px 0 0",
                maxWidth: 850,
                fontSize: "clamp(25px, 3.4vw, 43px)",
                lineHeight: 1.08,
                letterSpacing: "-0.045em",
                color: "#effff4",
                fontWeight: 850,
              }}
            >
              One core system connecting business, care, community,
              creation, and real-world action.
            </p>

            <p style={sub}>
              HomePlanet gives every live system a clear place to begin,
              while keeping trust, protection, privacy, proof, care, and
              presence underneath everything.
            </p>

            <div style={actions}>
              <a href="#directions" style={primary}>
                Choose Your Direction
              </a>

              <Link to="/city/creator" style={secondary}>
                Open Creator City
              </Link>
            </div>
          </div>
        </section>
        <section
          id="directions"
          style={{
            padding: "24px 0 108px",
          }}
        >
          <div
            style={{
              maxWidth: 760,
              marginBottom: 42,
            }}
          >
            <div
              style={{
                color: "#62ff97",
                fontSize: 11,
                fontWeight: 950,
                letterSpacing: "0.17em",
                textTransform: "uppercase",
              }}
            >
              Choose your direction
            </div>

            <h2
              style={{
                margin: "14px 0 0",
                fontSize: "clamp(42px, 6vw, 76px)",
                lineHeight: 0.94,
                letterSpacing: "-0.067em",
              }}
            >
              Start with what you are trying to move forward.
            </h2>
          </div>

          <div
            className="hp-direction-lanes"
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {[
              {
                number: "01",
                title: "Run a Business",
                text:
                  "Connect the public page to requests, estimates, scheduling, payment, proof, and the real work underneath.",
                detail:
                  "Public entrance → customer request → active workspace → outcome",
                to: "/city/creator",
                action: "Enter Creator City",
              },
              {
                number: "02",
                title: "Care for People & Pets",
                text:
                  "Keep families, caregivers, pet owners, trusted updates, protection, and awareness connected.",
                detail:
                  "Care request → trusted people → updates → history",
                to: "/city/family",
                action: "Open Guardian City",
              },
              {
                number: "03",
                title: "Bring People Together",
                text:
                  "Turn community needs, offers, events, volunteers, and opportunities into organized action.",
                detail:
                  "Need signal → conversation → coordination → proof",
                to: "/planet/okeechobee",
                action: "Open Community",
              },
            ].map((direction) => (
              <Link
                key={direction.title}
                to={direction.to}
                className="hp-direction-lane"
                style={{
                  minHeight: 190,
                  display: "grid",
                  gridTemplateColumns: "90px minmax(0, 1fr) minmax(260px, 0.72fr)",
                  gap: 28,
                  alignItems: "center",
                  padding: "28px 30px",
                  borderRadius: 26,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background:
                    "radial-gradient(circle at 8% 50%, rgba(74,255,137,0.08), transparent 28%), linear-gradient(100deg, rgba(255,255,255,0.038), rgba(255,255,255,0.012))",
                  color: "#f4fff7",
                  textDecoration: "none",
                  boxShadow:
                    "0 22px 65px rgba(0,0,0,0.28), inset 0 1px rgba(255,255,255,0.035)",
                }}
              >
                <div
                  style={{
                    color: "#62ff97",
                    fontSize: 12,
                    fontWeight: 950,
                    letterSpacing: "0.16em",
                  }}
                >
                  {direction.number}
                </div>

                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "clamp(31px, 4vw, 49px)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.058em",
                    }}
                  >
                    {direction.title}
                  </h3>

                  <p
                    style={{
                      maxWidth: 610,
                      margin: "16px 0 0",
                      color: "rgba(228,243,233,0.56)",
                      fontSize: 16,
                      lineHeight: 1.55,
                    }}
                  >
                    {direction.text}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      color: "rgba(226,242,231,0.38)",
                      fontSize: 12,
                      lineHeight: 1.55,
                    }}
                  >
                    {direction.detail}
                  </div>

                  <div
                    style={{
                      marginTop: 17,
                      color: "#65ff99",
                      fontSize: 14,
                      fontWeight: 950,
                    }}
                  >
                    {direction.action} →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section
          style={{
            padding: "42px 0 112px",
          }}
        >
          <div
            style={{
              maxWidth: 760,
              marginBottom: 42,
            }}
          >
            <div
              style={{
                color: "#62ff97",
                fontSize: 11,
                fontWeight: 950,
                letterSpacing: "0.17em",
                textTransform: "uppercase",
              }}
            >
              Live on HomePlanet
            </div>

            <h2
              style={{
                margin: "14px 0 0",
                fontSize: "clamp(42px, 6vw, 76px)",
                lineHeight: 0.94,
                letterSpacing: "-0.067em",
              }}
            >
              Show what is real. Add the rest when it is ready.
            </h2>

            <p
              style={{
                maxWidth: 650,
                margin: "22px 0 0",
                color: "rgba(228,243,233,0.55)",
                fontSize: 17,
                lineHeight: 1.58,
              }}
            >
              These systems are already being shaped around real businesses,
              real customers, and real work.
            </p>
          </div>

          <div
            className="hp-live-system-list"
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {[
              {
                label: "Business system builder",
                title: "Creator City",
                text:
                  "Build the public entrance and the working system underneath it.",
                path:
                  "Direction → public page → workflow → payment → proof",
                to: "/city/creator",
                action: "Open Creator City",
              },
              {
                label: "Cleaning service system",
                title: "Only The Essentials",
                text:
                  "Customers request cleaning while estimates, scheduling, photos, approval, and payment stay connected.",
                path:
                  "Cleaning request → estimate → agreement → schedule → completion",
                to: "/onlytheessentials",
                action: "View the live page",
              },
              {
                label: "HVAC service system",
                title: "Florida Cooling",
                text:
                  "A clear public service entrance connected to requests, technician movement, updates, and proof.",
                path:
                  "AC problem → service request → dispatch → customer clarity",
                to: "/planet/florida-cooling",
                action: "View Florida Cooling",
              },
              {
                label: "Pest control system",
                title: "Slap-A-Bug",
                text:
                  "Customers identify the problem, send details, and move into a real service workflow.",
                path:
                  "Pest problem → photos → estimate → treatment → proof",
                to: "/planet/slap-a-bug",
                action: "View Slap-A-Bug",
              },
            ].map((system) => (
              <Link
                key={system.title}
                to={system.to}
                className="hp-live-system-row"
                style={{
                  minHeight: 176,
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(220px, 0.72fr) minmax(0, 1.15fr) minmax(250px, 0.82fr)",
                  gap: 30,
                  alignItems: "center",
                  padding: "27px 30px",
                  borderRadius: 26,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background:
                    "radial-gradient(circle at 7% 50%, rgba(73,255,137,0.075), transparent 27%), linear-gradient(100deg, rgba(255,255,255,0.035), rgba(255,255,255,0.011))",
                  color: "#f4fff7",
                  textDecoration: "none",
                  boxShadow:
                    "0 22px 65px rgba(0,0,0,0.27), inset 0 1px rgba(255,255,255,0.035)",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "rgba(225,241,230,0.4)",
                      fontSize: 11,
                      fontWeight: 850,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {system.label}
                  </div>

                  <h3
                    style={{
                      margin: "10px 0 0",
                      fontSize: "clamp(29px, 4vw, 45px)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.055em",
                    }}
                  >
                    {system.title}
                  </h3>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "rgba(228,243,233,0.56)",
                    fontSize: 15,
                    lineHeight: 1.56,
                  }}
                >
                  {system.text}
                </p>

                <div>
                  <div
                    style={{
                      color: "rgba(226,242,231,0.36)",
                      fontSize: 12,
                      lineHeight: 1.55,
                    }}
                  >
                    {system.path}
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      color: "#65ff99",
                      fontSize: 14,
                      fontWeight: 950,
                    }}
                  >
                    {system.action} →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: "0 0 118px",
          }}
        >
          <div
            style={{
              padding: "clamp(34px, 6vw, 68px)",
              borderRadius: 30,
              border: "1px solid rgba(91,255,147,0.14)",
              background:
                "radial-gradient(circle at 50% 0%, rgba(70,255,134,0.1), transparent 65%), linear-gradient(145deg, rgba(255,255,255,0.034), rgba(255,255,255,0.011))",
              textAlign: "center",
              boxShadow: "0 28px 90px rgba(0,0,0,0.34)",
            }}
          >
            <div
              style={{
                color: "#62ff97",
                fontSize: 11,
                fontWeight: 950,
                letterSpacing: "0.17em",
                textTransform: "uppercase",
              }}
            >
              Build from what is real
            </div>

            <h2
              style={{
                maxWidth: 820,
                margin: "15px auto 0",
                fontSize: "clamp(45px, 7vw, 84px)",
                lineHeight: 0.92,
                letterSpacing: "-0.07em",
              }}
            >
              Start with the need. Build the system around it.
            </h2>

            <p
              style={{
                maxWidth: 650,
                margin: "23px auto 0",
                color: "rgba(228,243,233,0.55)",
                fontSize: 17,
                lineHeight: 1.58,
              }}
            >
              HomePlanet does not force every business, family, or community
              into the same template.
            </p>

            <Link
              to="/city/creator"
              style={{
                minHeight: 50,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 30,
                padding: "0 21px",
                borderRadius: 14,
                background: "#54ff8d",
                color: "#031008",
                fontWeight: 950,
                textDecoration: "none",
                boxShadow: "0 16px 38px rgba(48,255,115,0.16)",
              }}
            >
              Build With HomePlanet
            </Link>
          </div>
        </section>
      </div>

      <style>{`
        .hp-direction-lane {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .hp-direction-lane:hover {
          transform: translateY(-4px);
          border-color: rgba(92, 255, 148, 0.28) !important;
          background:
            radial-gradient(
              circle at 8% 50%,
              rgba(74, 255, 137, 0.12),
              transparent 30%
            ),
            linear-gradient(
              100deg,
              rgba(255,255,255,0.048),
              rgba(255,255,255,0.014)
            ) !important;
        }

        .hp-live-system-row {
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .hp-live-system-row:hover {
          transform: translateY(-4px);
          border-color: rgba(92,255,148,0.28) !important;
        }

        @media (max-width: 900px) {
          .hp-atlas-hero {
            grid-template-columns: 1fr !important;
          }

          .hp-atlas-preview {
            min-height: 0 !important;
            margin-top: 8px;
          }

          .hp-atlas-preview-grid {
            grid-template-columns: 1fr !important;
          }
          .hp-live-system-row {
            grid-template-columns: 1fr 1fr !important;
          }

          .hp-live-system-row > div:last-child {
            grid-column: 2;
          }
        }

        @media (max-width: 680px) {
          .hp-live-system-row {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
            padding: 24px !important;
          }

          .hp-live-system-row > div:last-child {
            grid-column: auto;
          }
        }

        @media (max-width: 860px) {
          .hp-direction-lane {
            grid-template-columns: 52px minmax(0, 1fr) !important;
          }

          .hp-direction-lane > div:last-child {
            grid-column: 2;
          }
        }

        @media (max-width: 620px) {
          .hp-direction-lane {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
            padding: 24px !important;
          }

          .hp-direction-lane > div:last-child {
            grid-column: auto;
          }
        }

        @media (max-width: 980px) {
          .hp-doctrine-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .hp-doctrine-foundation-header {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 900px) {
          .hp-atlas-hero {
            grid-template-columns: 1fr !important;
          }

          .hp-atlas-preview {
            min-height: 0 !important;
            margin-top: 8px;
          }

          .hp-atlas-preview-grid {
            grid-template-columns: 1fr !important;
          }
          .hp-atlas-hero {
            padding: 82px 0 64px !important;
          }

          .hp-atlas-nav-links {
            display: none !important;
          }

          .hp-atlas-footer-panel {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 620px) {
          .hp-doctrine-grid {
            grid-template-columns: 1fr !important;
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
    marginTop: 25,
    color: "rgba(230,244,234,0.60)",
    lineHeight: 1.62,
    fontSize: "clamp(17px, 2vw, 21px)",
    maxWidth: 760,
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







