import React, { useEffect, useMemo, useState } from "react";

const TAYLOR_CREEK_INTAKE_ROUTE = "/c/taylor-creek";
const TAYLOR_CREEK_STAFF_ROUTE = "/planet/demo/auto-service-sample";
const TAYLOR_CREEK_BOARD_ROUTE = "/live/taylor-creek/board";
const TAYLOR_CREEK_SERVICE_ROUTE = "/planet/demo/auto-service-sample";
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
        text: "This is the real shift: intake, staff visibility, customer-facing live board, and service entry all connected as one working system.",
        items: [
          {
            id: "taylor-creek-intake",
            title: "Taylor Creek Check-In",
            subtitle: "Customer-facing intake that starts the system clean.",
            to: TAYLOR_CREEK_INTAKE_ROUTE,
            tag: "PUBLIC INTAKE",
          },
          {
            id: "taylor-creek-staff",
            title: "Taylor Creek Staff Demo Board",
            subtitle: "Safe sample staff-side board with real stage flow.",
            to: TAYLOR_CREEK_STAFF_ROUTE,
            tag: "HOLY SHIT",
          },
          {
            id: "taylor-creek-board",
            title: "Taylor Creek Live Board",
            subtitle: "Customer/lobby-style live board.",
            to: TAYLOR_CREEK_BOARD_ROUTE,
            tag: "LIVE BOARD",
          },
          {
            id: "taylor-creek-service",
            title: "Taylor Creek Service City",
            subtitle: "Entry into mechanic-side system flow.",
            to: TAYLOR_CREEK_SERVICE_ROUTE,
            tag: "SERVICE FLOW",
          },
        ],
      },

      {
        id: "creator-core",
        label: "CREATOR CORE",
        title: "The creator floor",
        text: "Core creator systems — studio, projects, live selling, execution.",
        items: [
          {
            id: "creator-studio",
            title: "Creator Studio Board",
            subtitle: "Clip, edit, and launch moments.",
            to: "/planet/creator/studio-board",
            tag: "CREATOR CORE",
          },
          {
            id: "projects",
            title: "Creator Projects",
            subtitle: "Organize releases and ideas.",
            to: "/planet/creator/projects",
            tag: "PROJECT FLOW",
          },
          {
            id: "live-product",
            title: "Live Product Selling",
            subtitle: "Urgent, live product flow.",
            to: "/planet/creator/rc-live",
            tag: "HIGH VALUE",
          },
          {
            id: "experience",
            title: "Experience Planet",
            subtitle: "Live experiences and events.",
            to: "/planet/experience",
            tag: "LIVE EXPERIENCE",
          },
        ],
      },

      {
        id: "operational",
        label: "READY DEMOS",
        title: "Operational boards",
        text: "Real working boards showing flow, routing, and visibility.",
        items: [
          {
            id: "restaurant",
            title: "Restaurant Live Board",
            subtitle: "Kitchen flow and visibility.",
            to: "/planet/food/restaurant-rush-live",
            tag: "LIVE BOARD",
          },
          {
            id: "community-sale",
            title: "Community Sale Board",
            subtitle: "Sell and manage pickup.",
            to: "/planet/community/community-sale",
            tag: "COMMUNITY LIVE",
          },
          {
            id: "transportation",
            title: "Dispatch Demo",
            subtitle: "Driver and trip flow.",
            to: "/planet/transportation/dispatch",
            tag: "DISPATCH",
          },
          {
            id: "routecut",
            title: "RouteCut Lawn Flow",
            subtitle: "Routing and live status.",
            to: "/planet/lawn/routecut",
            tag: "LIVE ROUTE",
          },
          {
            id: "northstar",
            title: "Northstar Service Demo",
            subtitle: "Service workflow board.",
            to: NORTHSTAR_DEMO_ROUTE,
            tag: "DEMO",
          },
          {
            id: "camp-guardian",
            title: "Camp Guardian",
            subtitle: "Child presence and safety.",
            to: CAMP_GUARDIAN_DEMO_ROUTE,
            tag: "CAMP SAFETY",
          },
          {
            id: "child-safety",
            title: "Child Safety System",
            subtitle: "Detection + Guardian alerts.",
            to: "/planet/predator-shield",
            tag: "SAFETY",
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
            subtitle: "Bamboo-based demo world.",
            to: "/planet/demo/bamboo",
            tag: "PLANET",
          },
          {
            id: "safari",
            title: "Safari Experience",
            subtitle: "Animal-driven story + presence system.",
            to: "/planet/safari",
            tag: "WORLD",
          },
          {
            id: "safari-live",
            title: "Safari Live Board",
            subtitle: "Live safari event + movement board.",
            to: "/planet/live/safari-demo",
            tag: "LIVE",
          },
        ],
      },
    ],
    [],
  );

  const totalSystems = sections.reduce(
    (count, section) => count + section.items.length,
    0
  );

  return (
    <div style={{ padding: 20, color: "#fff" }}>
      <h1>Creator Systems</h1>
      <p>{totalSystems} systems ready</p>

      {sections.map((section) => (
        <div key={section.id} style={{ marginTop: 30 }}>
          <h2>{section.title}</h2>
          <p>{section.text}</p>

          <div style={{ display: "grid", gap: 10 }}>
            {section.items.map((item) => (
              <div
                key={item.id}
                onClick={() => openRoute(item.to)}
                style={{
                  border: "1px solid #444",
                  padding: 12,
                  cursor: "pointer",
                }}
              >
                <strong>{item.title}</strong>
                <div>{item.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 40, opacity: 0.6 }}>
        HomePlanet © 2026. Creator systems.
      </div>
    </div>
  );
}