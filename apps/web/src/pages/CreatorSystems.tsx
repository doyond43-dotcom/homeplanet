import { useEffect, useMemo, useState } from "react";

const TAYLOR_CREEK_INTAKE_ROUTE = "/c/taylor-creek";
const TAYLOR_CREEK_STAFF_ROUTE = "/planet/demo/auto-service-sample";
const TAYLOR_CREEK_BOARD_ROUTE = "/planet/live/taylor-creek";
const TAYLOR_CREEK_SERVICE_ROUTE = "/planet/demo/auto-service-sample";

const COMMUNITY_SALE_ROUTE = "/planet/live/community-sale-demo";
const NORTHSTAR_DEMO_ROUTE = "/planet/live/northstar-service-demo";
const CAMP_GUARDIAN_DEMO_ROUTE = "/planet/demo/camp-aquaflow";
const SAFARI_LIVE_ROUTE = "/planet/live/safari-demo";

type SystemCard = {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  tag: string;
  liveState?: string;
  isLive?: boolean;
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
        text: "Intake, staff visibility, customer-facing live board, and service entry connected as one working system.",
        items: [
          {
            id: "taylor-creek-intake",
            title: "Taylor Creek Check-In",
            subtitle: "Customer-facing intake that starts the system clean.",
            to: TAYLOR_CREEK_INTAKE_ROUTE,
            tag: "PUBLIC INTAKE",
            liveState: "Receiving entries",
            isLive: true,
          },
          {
            id: "taylor-creek-staff",
            title: "Taylor Creek Staff Demo Board",
            subtitle: "Safe sample staff-side board with real stage flow.",
            to: TAYLOR_CREEK_STAFF_ROUTE,
            tag: "STAFF FLOW",
            liveState: "Active board",
            isLive: true,
          },
          {
            id: "taylor-creek-board",
            title: "Taylor Creek Live Board",
            subtitle: "Customer/lobby-style live board.",
            to: TAYLOR_CREEK_BOARD_ROUTE,
            tag: "LIVE SYSTEM",
            liveState: "Live now",
            isLive: true,
          },
          {
            id: "taylor-creek-service",
            title: "Taylor Creek Service City",
            subtitle: "Entry into mechanic-side system flow.",
            to: TAYLOR_CREEK_SERVICE_ROUTE,
            tag: "SERVICE FLOW",
            liveState: "Ready",
            isLive: true,
          },
        ],
      },
      {
        id: "creator-core",
        label: "CREATOR CORE",
        title: "The creator floor",
        text: "Core creator systems: studio, projects, live selling, and execution.",
        items: [
          {
            id: "creator-studio",
            title: "Creator Studio",
            subtitle: "Clip, edit, and launch moments.",
            to: "/planet/creator/studio",
            tag: "MOMENT LAB",
            liveState: "Build ready",
            isLive: true,
          },
          {
            id: "projects",
            title: "Creator Projects",
            subtitle: "Organize releases and ideas.",
            to: "/planet/creator",
            tag: "PROJECT FLOW",
            liveState: "Open",
            isLive: true,
          },
          {
            id: "live-product",
            title: "Live Product Selling",
            subtitle: "Urgent, live product flow.",
            to: "/planet/creator/rc-live",
            tag: "SELL LIVE",
            liveState: "Active demo",
            isLive: true,
          },
          {
            id: "experience",
            title: "Experience Planet",
            subtitle: "Live experiences and events.",
            to: "/planet/experience",
            tag: "EXPERIENCE",
            liveState: "Ready",
            isLive: true,
          },
        ],
      },
      {
        id: "operational",
        label: "READY DEMOS",
        title: "Operational boards",
        text: "Working boards showing flow, routing, and visibility.",
        items: [
          {
            id: "restaurant",
            title: "Restaurant Live Board",
            subtitle: "Kitchen flow and visibility.",
            to: "/planet/food/restaurant-rush-live",
            tag: "LIVE SYSTEM",
            liveState: "Orders flowing",
            isLive: true,
          },
          {
            id: "community-sale",
            title: "Community Sale Board",
            subtitle: "Sell and manage pickup.",
            to: COMMUNITY_SALE_ROUTE,
            tag: "COMMUNITY LIVE",
            liveState: "Pickup board active",
            isLive: true,
          },
          {
            id: "transportation",
            title: "Dispatch Demo",
            subtitle: "Driver and trip flow.",
            to: "/planet/transportation/dispatch",
            tag: "ACTIVE FLOW",
            liveState: "Dispatch ready",
            isLive: true,
          },
          {
            id: "routecut",
            title: "RouteCut Lawn Flow",
            subtitle: "Routing and live status.",
            to: "/planet/lawn/routecut",
            tag: "ROUTE LIVE",
            liveState: "Routes ready",
            isLive: true,
          },
          {
            id: "northstar",
            title: "Northstar Service Demo",
            subtitle: "Service workflow board.",
            to: NORTHSTAR_DEMO_ROUTE,
            tag: "SERVICE LIVE",
            liveState: "Workflow active",
            isLive: true,
          },
          {
            id: "camp-guardian",
            title: "Camp Guardian",
            subtitle: "Child presence and safety.",
            to: CAMP_GUARDIAN_DEMO_ROUTE,
            tag: "GUARDIAN LIVE",
            liveState: "Safety layer ready",
            isLive: true,
          },
          {
            id: "child-safety",
            title: "Child Safety System",
            subtitle: "Detection and Guardian alerts.",
            to: "/planet/predator-shield",
            tag: "DETECTION LIVE",
            liveState: "Monitoring demo",
            isLive: true,
          },
        ],
      },
      {
        id: "special-worlds",
        label: "SPECIAL WORLDS",
        title: "Standalone worlds",
        text: "Distinct systems that feel like their own universe.",
        items: [
          {
            id: "bamboo",
            title: "Planet Bamboo",
            subtitle: "Bamboo-based presence world.",
            to: "/planet/demo/bamboo",
            tag: "PRESENCE MAP",
            liveState: "World ready",
            isLive: true,
          },
          {
            id: "safari",
            title: "Safari Experience",
            subtitle: "Animal-driven story and presence system.",
            to: "/planet/safari",
            tag: "STORY WORLD",
            liveState: "Experience ready",
            isLive: true,
          },
          {
            id: "safari-live",
            title: "Safari Live Board",
            subtitle: "Live safari event and movement board.",
            to: SAFARI_LIVE_ROUTE,
            tag: "LIVE SYSTEM",
            liveState: "Movement board active",
            isLive: true,
          },
        ],
      },
    ],
    []
  );

  const totalSystems = sections.reduce(
    (count, section) => count + section.items.length,
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 34%), #050505",
        color: "#fff",
        padding: isCompact ? 18 : 28,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <style>
        {`
          @keyframes hpLivePulse {
            0% {
              transform: scale(1);
              opacity: 1;
              box-shadow: 0 0 0 0 rgba(103, 232, 249, 0.55);
            }
            70% {
              transform: scale(1.18);
              opacity: 0.82;
              box-shadow: 0 0 0 7px rgba(103, 232, 249, 0);
            }
            100% {
              transform: scale(1);
              opacity: 1;
              box-shadow: 0 0 0 0 rgba(103, 232, 249, 0);
            }
          }
        `}
      </style>

      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "inline-flex",
              padding: "5px 9px",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 999,
              fontSize: 11,
              letterSpacing: 0.8,
              opacity: 0.82,
              marginBottom: 10,
            }}
          >
            CREATOR SYSTEMS
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? 28 : 38,
              lineHeight: 1,
              letterSpacing: -1.2,
            }}
          >
            Real systems. Live truth. No fake states.
          </h1>

          <p
            style={{
              marginTop: 10,
              maxWidth: 700,
              color: "rgba(255,255,255,0.72)",
              fontSize: isMobile ? 14 : 15,
              lineHeight: 1.45,
            }}
          >
            {totalSystems} systems wired into Creator City. Each card opens a
            working board, demo, intake, or system page.
          </p>
        </div>

        <div style={{ display: "grid", gap: 22 }}>
          {sections.map((section) => (
            <section key={section.id}>
              <div style={{ marginBottom: 10 }}>
                <div
                  style={{
                    color: "#67e8f9",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 1.1,
                    marginBottom: 5,
                  }}
                >
                  {section.label}
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: isMobile ? 20 : 24,
                    letterSpacing: -0.45,
                  }}
                >
                  {section.title}
                </h2>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "rgba(255,255,255,0.66)",
                    fontSize: 13,
                    lineHeight: 1.4,
                  }}
                >
                  {section.text}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isCompact
                    ? "1fr"
                    : "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                }}
              >
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openRoute(item.to)}
                    style={{
                      textAlign: "left",
                      border: "1px solid rgba(255,255,255,0.14)",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025))",
                      color: "#fff",
                      borderRadius: 16,
                      padding: 14,
                      cursor: "pointer",
                      boxShadow: "0 14px 38px rgba(0,0,0,0.24)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <strong
                          style={{
                            display: "block",
                            fontSize: 15,
                            marginBottom: 5,
                          }}
                        >
                          {item.title}
                        </strong>

                        <div
                          style={{
                            color: "rgba(255,255,255,0.68)",
                            fontSize: 13,
                            lineHeight: 1.35,
                          }}
                        >
                          {item.subtitle}
                        </div>

                        {item.liveState ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 7,
                              marginTop: 9,
                              color: "rgba(255,255,255,0.72)",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: 0.15,
                            }}
                          >
                            {item.isLive ? (
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: 999,
                                  background: "#67e8f9",
                                  animation:
                                    "hpLivePulse 1.8s ease-out infinite",
                                  flex: "0 0 auto",
                                }}
                              />
                            ) : null}
                            <span>{item.liveState}</span>
                          </div>
                        ) : null}
                      </div>

                      <span
                        style={{
                          whiteSpace: "nowrap",
                          fontSize: 11,
                          fontWeight: 900,
                          letterSpacing: 0.4,
                          color: "#001018",
                          background: "#67e8f9",
                          borderRadius: 999,
                          padding: "5px 8px",
                          textRendering: "geometricPrecision",
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        color: "rgba(255,255,255,0.22)",
                        fontSize: 10,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.to}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div
          style={{
            marginTop: 38,
            paddingTop: 14,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.46)",
            fontSize: 11,
          }}
        >
          HomePlanet © 2026. Creator systems.
        </div>
      </div>
    </div>
  );
}