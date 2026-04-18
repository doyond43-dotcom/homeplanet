import React, { useEffect, useMemo, useState } from "react";

const TAYLOR_CREEK_INTAKE_ROUTE = "/c/taylor-creek";
const TAYLOR_CREEK_STAFF_ROUTE = "/planet/demo/auto-service-sample";
const TAYLOR_CREEK_BOARD_ROUTE = "/live/taylor-creek/board";
const TAYLOR_CREEK_SERVICE_ROUTE = "/service/taylor-creek";
const NORTHSTAR_DEMO_ROUTE = "/planet/vehicles/awnit-demo";
const CAMP_GUARDIAN_DEMO_ROUTE = "/planet/demo/camp-aquaflow";

type SystemCard = {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  tag: string;
};

type SystemSection = {
  id: string;
  label: string;
  title: string;
  text: string;
  items: SystemCard[];
};

export default function CreatorSystems() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 920);
      setIsTablet(width > 920 && width <= 1180);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isCompact = isMobile || isTablet;

  const openRoute = (to: string) => {
    window.location.href = to;
  };

  const sections = useMemo<SystemSection[]>(
    () => [
      {
        id: "creation-moment",
        label: "CREATION MOMENT",
        title: "The Taylor Creek system cluster",
        text: "This is the real shift: intake, staff visibility, customer-facing live board, and service entry all connected as one working system. This is the strongest proof of what Creator City can become.",
        items: [
          {
            id: "taylor-creek-intake",
            title: "Taylor Creek Check-In",
            subtitle:
              "Customer-facing intake that captures the request immediately and starts the system clean.",
            to: TAYLOR_CREEK_INTAKE_ROUTE,
            tag: "PUBLIC INTAKE",
          },
          {
            id: "taylor-creek-staff",
            title: "Taylor Creek Staff Demo Board",
            subtitle:
              "Safe sample version of the staff-side board with fake jobs, real stage flow, and no real customer data.",
            to: TAYLOR_CREEK_STAFF_ROUTE,
            tag: "HOLY SHIT",
          },
          {
            id: "taylor-creek-board",
            title: "Taylor Creek Live Board",
            subtitle:
              "Customer/lobby-style live board that exposes the flow without dropping people into the staff layer.",
            to: TAYLOR_CREEK_BOARD_ROUTE,
            tag: "LIVE BOARD",
          },
          {
            id: "taylor-creek-service",
            title: "Taylor Creek Service City",
            subtitle:
              "Business entry path tying the intake, tools, and mechanic-side world together.",
            to: TAYLOR_CREEK_SERVICE_ROUTE,
            tag: "SERVICE FLOW",
          },
        ],
      },
      {
        id: "creator-core",
        label: "CREATOR CORE",
        title: "The creator floor",
        text: "These are the boards and spaces that feel most native to Creator City â€” studio flow, projects, live selling, and creator-first execution.",
        items: [
          {
            id: "creator-studio",
            title: "Creator Studio Board",
            subtitle:
              "Clip moments, edits, ready-to-drop content, and creator workflow.",
            to: "/planet/creator/studio-board",
            tag: "CREATOR CORE",
          },
          {
            id: "projects",
            title: "Creator Projects",
            subtitle:
              "Organize releases, work, ideas, drafts, and creator progress.",
            to: "/planet/creator/projects",
            tag: "PROJECT FLOW",
          },
          {
            id: "live-product",
            title: "Live Product Selling Board",
            subtitle:
              "Live selling with pressure, urgency, and creator-first product flow.",
            to: "/planet/creator/rc-live",
            tag: "HIGH VALUE",
          },
          {
            id: "experience",
            title: "Experience Planet",
            subtitle:
              "Live experiences, challenges, classes, and event-style creator flows.",
            to: "/planet/experience",
            tag: "LIVE EXPERIENCE",
          },
        ],
      },
      {
        id: "operational",
        label: "READY DEMOS",
        title: "Operational demo boards",
        text: "These are working HomePlanet-style boards that show how live visibility, stages, routing, dispatch, and customer movement can run in one system.",
        items: [
          {
            id: "restaurant",
            title: "Restaurant Live Board",
            subtitle: "Kitchen flow, ticket stages, and manager visibility.",
            to: "/planet/food/restaurant-rush-live",
            tag: "LIVE BOARD",
          },
          {
            id: "community-sale",
            title: "Community Sale Board",
            subtitle: "Sell, track, price, and manage pickup in one board.",
            to: "/planet/community/community-sale",
            tag: "COMMUNITY LIVE",
          },
          {
            id: "transportation",
            title: "Transportation Dispatch Demo",
            subtitle: "Driver assignment, dispatch flow, and trip visibility.",
            to: "/planet/transportation/dispatch",
            tag: "DISPATCH FLOW",
          },
          {
            id: "routecut",
            title: "RouteCut Live Lawn Flow",
            subtitle: "Routing, next-stop flow, and live status.",
            to: "/planet/lawn/routecut",
            tag: "LIVE ROUTE",
          },
          {
            id: "northstar",
            title: "Northstar Service Demo",
            subtitle: "Service workflow turned into a live board.",
            to: NORTHSTAR_DEMO_ROUTE,
            tag: "DEMO BOARD",
          },
          {
            id: "camp-guardian",
            title: "Camp Guardian System",
            subtitle: "Live child presence, zone movement, guardian messaging, and camp safety visibility.",
            to: CAMP_GUARDIAN_DEMO_ROUTE,
            tag: "CAMP SAFETY",
          },
          {
            id: "child-safety",
            title: "Child Safety System",
            subtitle: "Unsafe conversation detection, intervention, and Guardian alert layer.",
            to: "/planet/predator-shield",
            tag: "SAFETY LAYER",
          },
          {
            id: "legal",
            title: "Legal Workspace Demo",
            subtitle: "Timeline, evidence, and proof-style organization.",
            to: "/planet/legal/joe-grant",
            tag: "WORKSPACE",
          },
        ],
      },
      {
        id: "adjacent",
        label: "ADJACENT SYSTEMS",
        title: "Creator-adjacent systems",
        text: "These connect to creator logic through scheduling, customer flow, operations, fulfillment, or live service movement â€” close enough to belong without crowding the main build page.",
        items: [
          {
            id: "meal-business",
            title: "Meal Business System",
            subtitle:
              "Weekly planning, customer preferences, and live decision control.",
            to: "/planet/lifestyle/meal-start",
            tag: "MEAL SYSTEM",
          },
        ],
      },
      {
        id: "special-worlds",
        label: "SPECIAL WORLDS",
        title: "Standalone demo worlds",
        text: "These are more distinct or themed paths. They can still live here, but they sit a little outside the core creator floor.",
        items: [
          {
            id: "bamboo",
            title: "Planet Bamboo",
            subtitle: "Dedicated bamboo creator/business demo path.",
            to: "/planet/bamboo",
            tag: "PLANET BAMBOO",
          },
        ],
      },
    ],
    [],
  );

  const totalSystems = sections.reduce(
    (count, section) => count + section.items.length,
    0,
  );

  const page: React.CSSProperties = {
    minHeight: "100vh",
    color: "#e5e7eb",
    background:
      "radial-gradient(1200px 760px at 8% 10%, rgba(6,182,212,0.12), transparent 52%)," +
      "radial-gradient(980px 720px at 88% 8%, rgba(59,130,246,0.10), transparent 48%)," +
      "radial-gradient(1200px 980px at 50% 100%, rgba(245,158,11,0.08), transparent 54%)," +
      "linear-gradient(180deg, #06070c 0%, #08111f 52%, #05070c 100%)",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    padding: isMobile ? 10 : isTablet ? 12 : 22,
  };

  const shell: React.CSSProperties = {
    maxWidth: 1450,
    margin: "0 auto",
  };

  const frame: React.CSSProperties = {
    borderRadius: isCompact ? 22 : 28,
    border: "1px solid rgba(148,163,184,0.14)",
    background:
      "linear-gradient(180deg, rgba(8,15,30,0.92), rgba(2,6,23,0.96) 18%, rgba(2,6,23,0.98) 100%)",
    boxShadow:
      "0 30px 120px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.02)",
    overflow: "hidden",
  };

  const topBar: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: isCompact ? "stretch" : "center",
    flexDirection: isCompact ? "column" : "row",
    gap: 10,
    padding: isCompact ? "12px 12px 10px" : "14px 18px 12px",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
  };

  const topBarLeft: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  };

  const windowDot = (color: string): React.CSSProperties => ({
    width: 10,
    height: 10,
    borderRadius: 999,
    background: color,
    boxShadow: `0 0 10px ${color}`,
  });

  const badgeBlue: React.CSSProperties = {
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(56,189,248,0.30)",
    background: "rgba(56,189,248,0.10)",
    color: "#bae6fd",
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: 0.5,
    lineHeight: 1.1,
  };

  const badgePink: React.CSSProperties = {
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(244,114,182,0.28)",
    background: "rgba(244,114,182,0.08)",
    color: "#fbcfe8",
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: 0.5,
    lineHeight: 1.1,
  };

  const hero: React.CSSProperties = {
    padding: isMobile ? 14 : isTablet ? 16 : 18,
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    background:
      "radial-gradient(820px 280px at 10% 0%, rgba(244,114,182,0.08), transparent 42%)," +
      "radial-gradient(760px 300px at 100% 0%, rgba(56,189,248,0.08), transparent 40%)," +
      "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))",
  };

  const breadcrumbRow: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  };

  const title: React.CSSProperties = {
    marginTop: 12,
    fontSize: isMobile ? 34 : isTablet ? 42 : 48,
    fontWeight: 900,
    letterSpacing: isMobile ? -1.1 : -1.6,
    lineHeight: 0.95,
    color: "#ffffff",
    maxWidth: 840,
  };

  const subtitle: React.CSSProperties = {
    marginTop: 10,
    fontSize: isMobile ? 21 : isTablet ? 24 : 28,
    fontWeight: 900,
    lineHeight: 1.04,
    color: "#ffffff",
    maxWidth: 980,
  };

  const text: React.CSSProperties = {
    marginTop: 12,
    fontSize: isCompact ? 15 : 15,
    lineHeight: 1.62,
    color: "rgba(226,232,240,0.84)",
    maxWidth: 880,
  };

  const heroStats: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : isTablet
        ? "repeat(3, minmax(0, 1fr))"
        : "repeat(3, minmax(0, 220px))",
    gap: 10,
    marginTop: 18,
  };

  const statCard: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.035)",
    padding: isMobile ? 12 : 13,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
  };

  const statLabel: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(125,211,252,0.92)",
  };

  const statValue: React.CSSProperties = {
    marginTop: 8,
    fontSize: isMobile ? 19 : 20,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.08,
  };

  const statText: React.CSSProperties = {
    marginTop: 6,
    fontSize: isCompact ? 13 : 12,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.74)",
  };

  const ctaRow: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : isTablet
        ? "1fr 1fr"
        : "repeat(3, max-content)",
    gap: 10,
    marginTop: 18,
    alignItems: "stretch",
  };

  const primaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: isCompact ? "15px 18px" : "12px 16px",
    border: "1px solid rgba(34,197,94,0.34)",
    background: "rgba(34,197,94,0.14)",
    color: "#dcfce7",
    fontWeight: 900,
    fontSize: isCompact ? 16 : 14,
    cursor: "pointer",
    width: isCompact ? "100%" : "auto",
  };

  const secondaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: isCompact ? "15px 18px" : "12px 16px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.045)",
    color: "#f8fafc",
    fontWeight: 900,
    fontSize: isCompact ? 16 : 14,
    cursor: "pointer",
    width: isCompact ? "100%" : "auto",
  };

  const body: React.CSSProperties = {
    padding: isMobile ? 12 : isTablet ? 14 : 16,
  };

  const sectionCard: React.CSSProperties = {
    borderRadius: isCompact ? 18 : 20,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.022)",
    boxShadow:
      "0 14px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.02)",
    overflow: "hidden",
  };

  const sectionSpacing = (isFirst: boolean): React.CSSProperties => ({
    marginTop: isFirst ? 0 : 14,
  });

  const sectionHeader: React.CSSProperties = {
    padding: isMobile ? 14 : 16,
    borderBottom: "1px solid rgba(148,163,184,0.10)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.022), rgba(255,255,255,0.008))",
  };

  const sectionEyebrow: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(250,204,21,0.28)",
    background: "rgba(250,204,21,0.08)",
    color: "rgba(254,240,138,1)",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.8,
    lineHeight: 1.1,
  };

  const sectionTitle: React.CSSProperties = {
    marginTop: 12,
    fontSize: isMobile ? 24 : isTablet ? 26 : 28,
    fontWeight: 900,
    lineHeight: 1.02,
    letterSpacing: isMobile ? -0.6 : -0.8,
    color: "#ffffff",
    maxWidth: 860,
  };

  const sectionText: React.CSSProperties = {
    marginTop: 10,
    fontSize: isCompact ? 14 : 14,
    lineHeight: 1.62,
    color: "rgba(226,232,240,0.80)",
    maxWidth: 900,
  };

  const sectionBody: React.CSSProperties = {
    padding: isMobile ? 12 : 14,
  };

  const grid = (count: number): React.CSSProperties => ({
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : isTablet
        ? "1fr 1fr"
        : count === 1
          ? "minmax(0, 1fr)"
          : count === 4
            ? "repeat(2, minmax(0, 1fr))"
            : "repeat(2, minmax(0, 1fr))",
    gap: 10,
  });

  const card: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "radial-gradient(500px 140px at 0% 0%, rgba(56,189,248,0.03), transparent 42%), rgba(255,255,255,0.03)",
    borderRadius: 18,
    padding: isMobile ? 16 : "15px 16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    boxShadow:
      "0 14px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)",
    transition:
      "transform 120ms ease, border-color 120ms ease, background 120ms ease",
    minHeight: isMobile ? "unset" : 136,
  };

  const creationCard: React.CSSProperties = {
    ...card,
    border: "1px solid rgba(56,189,248,0.18)",
    background:
      "radial-gradient(680px 220px at 0% 0%, rgba(56,189,248,0.07), transparent 42%)," +
      "radial-gradient(520px 180px at 100% 0%, rgba(244,114,182,0.06), transparent 38%)," +
      "rgba(255,255,255,0.04)",
  };

  const tag: React.CSSProperties = {
    borderRadius: 999,
    padding: "7px 11px",
    fontSize: 11,
    fontWeight: 900,
    border: "1px solid rgba(250,204,21,0.40)",
    color: "rgba(254,240,138,1)",
    background: "rgba(250,204,21,0.10)",
    width: "fit-content",
    lineHeight: 1.1,
  };

  const cardTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 22 : isTablet ? 19 : 18,
    color: "#ffffff",
    lineHeight: 1.08,
    letterSpacing: isMobile ? -0.4 : -0.2,
  };

  const cardSub: React.CSSProperties = {
    fontSize: isMobile ? 14 : 13,
    color: "rgba(226,232,240,0.78)",
    lineHeight: 1.58,
  };

  const footer: React.CSSProperties = {
    marginTop: 14,
    padding: isMobile ? "18px 12px 10px" : "18px 4px 10px",
    borderTop: "1px solid rgba(148,163,184,0.16)",
    textAlign: "center",
    fontSize: isCompact ? 13 : 12,
    color: "rgba(148,163,184,0.72)",
  };

  return (
    <div style={page}>
      <div style={shell}>
        <div style={frame}>
          <div style={topBar}>
            <div style={topBarLeft}>
              <span style={windowDot("#fb7185")} />
              <span style={windowDot("#fbbf24")} />
              <span style={windowDot("#4ade80")} />
              <div style={badgeBlue}>CREATOR SYSTEMS</div>
            </div>

            <div style={topBarLeft}>
              <div style={badgeBlue}>ROUTE /planet/creator/systems</div>
            </div>
          </div>

          <div style={hero}>
            <div style={breadcrumbRow}>
              <div style={badgePink}>FROM CREATOR CITY</div>
              <div style={badgeBlue}>LIVE FLOOR</div>
            </div>

            <div style={title}>Creator Systems</div>

            <div style={subtitle}>
              The live systems floor inside Creator City.
            </div>

            <div style={text}>
              Every live demo, ready board, and working creator-adjacent system
              lives here in one operational floor. Creator City stays focused on
              the build path. This page carries the live side of the world.
            </div>

            <div style={heroStats}>
              <div style={statCard}>
                <div style={statLabel}>Total systems</div>
                <div style={statValue}>{totalSystems} ready paths</div>
                <div style={statText}>
                  Live demos, working boards, and creator-adjacent systems.
                </div>
              </div>

              <div style={statCard}>
                <div style={statLabel}>Primary purpose</div>
                <div style={statValue}>Browse live structure</div>
                <div style={statText}>
                  This is where someone can feel the systems without burying the
                  main creator intake flow.
                </div>
              </div>

              <div style={statCard}>
                <div style={statLabel}>Page role</div>
                <div style={statValue}>Separate, but aligned</div>
                <div style={statText}>
                  It belongs to Creator City, but it no longer drags the build
                  page into a giant demo graveyard.
                </div>
              </div>
            </div>

            <div style={ctaRow}>
              <button
                type="button"
                style={primaryBtn}
                onClick={() => openRoute("/planet/creator")}
              >
                Back to Build Flow
              </button>

              <button
                type="button"
                style={secondaryBtn}
                onClick={() => openRoute("/planet/creator/studio-board")}
              >
                Open Creator Studio
              </button>

              <button
                type="button"
                style={secondaryBtn}
                onClick={() => openRoute("/planet/creator/start")}
              >
                Open Creator Landing
              </button>
            </div>
          </div>

          <div style={body}>
            {sections.map((section, index) => (
              <div key={section.id} style={sectionSpacing(index === 0)}>
                <div style={sectionCard}>
                  <div style={sectionHeader}>
                    <div style={sectionEyebrow}>{section.label}</div>
                    <div style={sectionTitle}>{section.title}</div>
                    <div style={sectionText}>{section.text}</div>
                  </div>

                  <div style={sectionBody}>
                    <div style={grid(section.items.length)}>
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          style={
                            section.id === "creation-moment"
                              ? creationCard
                              : card
                          }
                          onClick={() => openRoute(item.to)}
                          onMouseEnter={(e) => {
                            if (isCompact) return;
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.borderColor =
                              section.id === "creation-moment"
                                ? "rgba(56,189,248,0.28)"
                                : "rgba(56,189,248,0.22)";
                            e.currentTarget.style.background =
                              section.id === "creation-moment"
                                ? "radial-gradient(680px 220px at 0% 0%, rgba(56,189,248,0.10), transparent 42%), radial-gradient(520px 180px at 100% 0%, rgba(244,114,182,0.08), transparent 38%), rgba(255,255,255,0.05)"
                                : "radial-gradient(500px 140px at 0% 0%, rgba(56,189,248,0.05), transparent 42%), rgba(255,255,255,0.04)";
                          }}
                          onMouseLeave={(e) => {
                            if (isCompact) return;
                            e.currentTarget.style.transform = "translateY(0px)";
                            e.currentTarget.style.borderColor =
                              section.id === "creation-moment"
                                ? "rgba(56,189,248,0.18)"
                                : "rgba(255,255,255,0.12)";
                            e.currentTarget.style.background =
                              section.id === "creation-moment"
                                ? "radial-gradient(680px 220px at 0% 0%, rgba(56,189,248,0.07), transparent 42%), radial-gradient(520px 180px at 100% 0%, rgba(244,114,182,0.06), transparent 38%), rgba(255,255,255,0.04)"
                                : "radial-gradient(500px 140px at 0% 0%, rgba(56,189,248,0.03), transparent 42%), rgba(255,255,255,0.03)";
                          }}
                        >
                          <div style={tag}>{item.tag}</div>
                          <div style={cardTitle}>{item.title}</div>
                          <div style={cardSub}>{item.subtitle}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={footer}>
              HomePlanet Â© 2026. Creator demos, systems, and live board paths.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
