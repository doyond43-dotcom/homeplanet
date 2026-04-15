import React, { useEffect, useMemo, useRef, useState } from "react";

const LIVE_PRODUCT_DEMO_ROUTE = "/planet/creator/rc-live";
const LIVE_CAMP_GUARDIAN_ROUTE = "/planet/live/camp-aquaflow-5593";
const PAYMENT_NODE_ROUTE = "/planet/payments/node";
const PAYMENT_DESK_DEMO_ROUTE = "/planet/payments/no-screenshot";
const MEAL_BUSINESS_ROUTE = "/planet/lifestyle/meal-start";

type SystemExample = {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  tag: string;
};

type BuildIntent =
  | "landing-page"
  | "live-board"
  | "workflow-tool"
  | "intake-flow"
  | "payment-flow"
  | "full-system";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/["'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function fakeResolveStarterBoardConfig(args: {
  businessType: string;
  businessName: string;
  primaryGoal: string;
}) {
  const bt = args.businessType.toLowerCase();

  if (bt.includes("restaurant") || bt.includes("food") || bt.includes("kitchen")) {
    return {
      key: "restaurant-rush",
      familyLabel: "Restaurant Rush",
      boardSubtitle: "Live ticket flow, manager controls, and kitchen visibility.",
      labels: { item: "Ticket", concern: "Order" },
      stages: ["New Ticket", "On Grill", "Plating", "Ready", "Completed"],
    };
  }

  if (
    bt.includes("meal") ||
    bt.includes("prep") ||
    bt.includes("delivery") ||
    bt.includes("weekly food") ||
    bt.includes("ready prep")
  ) {
    return {
      key: "meal-business-system",
      familyLabel: "Meal Business System",
      boardSubtitle:
        "Customer preferences, food guardrails, weekly planning, and live board adjustments.",
      labels: { item: "Week", concern: "Meal Preference" },
      stages: [
        "Preference Intake",
        "Build Week",
        "Optimize",
        "Customer Ready",
        "Live Adjustments",
      ],
    };
  }

  if (bt.includes("lawn") || bt.includes("landscape") || bt.includes("route")) {
    return {
      key: "routecut-live",
      familyLabel: "RouteCut Live",
      boardSubtitle: "Routing, next-stop flow, and customer-facing live status.",
      labels: { item: "Stop", concern: "Route" },
      stages: ["Queued", "Assigned", "En Route", "On Site", "Completed"],
    };
  }

  if (bt.includes("camp") || bt.includes("guardian") || bt.includes("child")) {
    return {
      key: "guardian-live",
      familyLabel: "Guardian Live",
      boardSubtitle: "Presence, protection, visibility, and guardian-safe status.",
      labels: { item: "Profile", concern: "Status" },
      stages: ["Checked In", "With Staff", "Activity Zone", "Hydration", "Checked Out"],
    };
  }

  if (
    bt.includes("contractor") ||
    bt.includes("contractors") ||
    bt.includes("home service") ||
    bt.includes("home services") ||
    bt.includes("handyman") ||
    bt.includes("construction") ||
    bt.includes("remodel") ||
    bt.includes("renovation") ||
    bt.includes("repair")
  ) {
    return {
      key: "home-services-live",
      familyLabel: "Home Services Live",
      boardSubtitle: "Scheduling, field movement, on-site work, and completion proof.",
      labels: { item: "Job", concern: "Service Request" },
      stages: ["New Request", "Scheduled", "En Route", "On Site", "Completed"],
    };
  }

  if (bt.includes("detail") || bt.includes("detailing") || bt.includes("car wash")) {
    return {
      key: "auto-detail-live",
      familyLabel: "Auto Detail Live",
      boardSubtitle: "Check-in, active detail work, final quality pass, and ready status.",
      labels: { item: "Vehicle", concern: "Detail Request" },
      stages: ["Check-In", "Prep", "Detailing", "Final Check", "Ready"],
    };
  }

  return {
    key: "starter-live-board",
    familyLabel: "Starter Live Board",
    boardSubtitle: "Operational workflow, live stages, and customer visibility.",
    labels: { item: "Job", concern: "Concern" },
    stages: ["New Intake", "Diagnosing", "In Progress", "Ready", "Completed"],
  };
}

export default function CreatorCity() {
  const openRoute = (to: string) => {
    window.location.href = to;
  };

  const [warmMode, setWarmMode] = useState(true);
  const readySystemsRef = useRef<HTMLDivElement | null>(null);
  const intakeFormRef = useRef<HTMLDivElement | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [currentWorkflow, setCurrentWorkflow] = useState("");
  const [biggestFriction, setBiggestFriction] = useState("");
  const [customerQuestions, setCustomerQuestions] = useState("");
  const [wantsBuilt, setWantsBuilt] = useState<BuildIntent>("full-system");
  const [holyShiftMoment, setHolyShiftMoment] = useState("");
  const [workflowFiles, setWorkflowFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [reserveReady, setReserveReady] = useState(false);
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

  const systems = useMemo<SystemExample[]>(
    () => [
      {
        id: "payments",
        title: "No Screenshot Payments",
        subtitle: "Customer pays. System confirms. Work keeps moving.",
        to: PAYMENT_DESK_DEMO_ROUTE,
        tag: "PAYMENT DESK",
      },
      {
        id: "live-product",
        title: "Live Product Selling Board",
        subtitle: "Live selling with proof and reserve pressure.",
        to: LIVE_PRODUCT_DEMO_ROUTE,
        tag: "HIGH VALUE",
      },
      {
        id: "northstar",
        title: "Northstar Service Demo",
        subtitle: "Service workflow turned into a live board.",
        to: "/planet/vehicles/awnit-demo",
        tag: "DEMO BOARD",
      },
      {
        id: "experience",
        title: "Experience Planet",
        subtitle: "Live experiences, games, classes, and challenge boards.",
        to: "/planet/experience",
        tag: "NEW SYSTEM",
      },
      {
        id: "routecut",
        title: "RouteCut Live Lawn Flow",
        subtitle: "Routing, next-stop flow, and live status.",
        to: "/planet/lawn/routecut",
        tag: "LIVE ROUTE",
      },
      {
        id: "restaurant",
        title: "Restaurant Live Board",
        subtitle: "Kitchen flow, ticket stages, and manager visibility.",
        to: "/planet/live/peggies-diner",
        tag: "LIVE BOARD",
      },
      {
        id: "color-me-crazy",
        title: "Beauty Live Board",
        subtitle: "Booking, chair flow, and payment in one clean beauty system.",
        to: "/planet/beauty/color-me-crazy/home?board=color-me-crazy-demo",
        tag: "BEAUTY LIVE",
      },
      {
        id: "meal-business",
        title: "Meal Business System",
        subtitle: "Weekly planning, customer preferences, and live food decision control.",
        to: MEAL_BUSINESS_ROUTE,
        tag: "MEAL SYSTEM",
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
        id: "legal",
        title: "Legal Workspace Demo",
        subtitle: "Timeline, evidence, and proof-style organization.",
        to: "/planet/legal/joe-grant",
        tag: "WORKSPACE",
      },
    ],
    [],
  );

  const selectedFilesLabel =
    workflowFiles.length === 0
      ? "No workflow photos selected"
      : `${workflowFiles.length} workflow photo${workflowFiles.length === 1 ? "" : "s"} selected`;

  const intentLabelMap: Record<BuildIntent, string> = {
    "landing-page": "Landing Page",
    "live-board": "Live Board",
    "workflow-tool": "Workflow Tool",
    "intake-flow": "Intake Flow",
    "payment-flow": "Payment Flow",
    "full-system": "Full Business System",
  };

  const resolvedBusinessLabel =
    businessType.trim() || intentLabelMap[wantsBuilt] || "Full Business System";

  const configPreview = useMemo(
    () =>
      fakeResolveStarterBoardConfig({
        businessType: resolvedBusinessLabel,
        businessName,
        primaryGoal: holyShiftMoment,
      }),
    [resolvedBusinessLabel, businessName, holyShiftMoment],
  );

  const isMealBusinessMode = /meal|prep|delivery|weekly food/i.test(resolvedBusinessLabel);
  const previewStages = configPreview.stages.slice(0, 4);
  const liveBoardRoute = `/planet/live/${slugify(businessName) || "starter-board"}`;
  const reservePaymentRoute = `${PAYMENT_NODE_ROUTE}?redirectTo=${encodeURIComponent(liveBoardRoute)}`;

  const trajectorySteps = [
    { id: "intake", title: "Intake", status: "complete", text: "Ready" },
    {
      id: "config",
      title: "Config",
      status: businessName || businessType || city || contact ? "active" : "idle",
      text: "Profile and board type",
    },
    {
      id: "build",
      title: "Build",
      status: currentWorkflow || biggestFriction ? "armed" : "idle",
      text: "Workflow and friction",
    },
    {
      id: "launch",
      title: "Launch",
      status: reserveReady
        ? "active"
        : holyShiftMoment || workflowFiles.length > 0
          ? "armed"
          : "idle",
      text: reserveReady ? "Reserve step ready" : "Board path ready",
    },
  ];

  const missionFeed = [
    { label: "Presence lock", value: businessName ? "READY" : "WAITING", active: !!businessName },
    { label: "Board family", value: configPreview.familyLabel || "STARTER", active: true },
    { label: "Primary route", value: "/planet/creator/building", active: true },
    {
      label: "Reserve route",
      value: PAYMENT_NODE_ROUTE,
      active: reserveReady,
    },
    {
      label: "Live redirect",
      value: businessName
        ? `/planet/live/${slugify(businessName) || "starter-board"}-*`
        : "/planet/live/<boardSlug>",
      active: !!businessName,
    },
    {
      label: "Truth intake",
      value:
        currentWorkflow || biggestFriction || customerQuestions ? "CAPTURING" : "PENDING",
      active: !!(currentWorkflow || biggestFriction || customerQuestions),
    },
  ];

  const buildSequence = [
    {
      title: "Presence ID",
      text: businessName
        ? `HP-${slugify(businessName).replace(/-/g, "").toUpperCase().slice(0, 8) || "BOARD"}-DEMO`
        : "Waiting for business name",
      complete: !!businessName,
    },
    {
      title: "Board family",
      text: configPreview.familyLabel,
      complete: !!resolvedBusinessLabel,
    },
    {
      title: "Live stages",
      text: previewStages.length > 0 ? previewStages.join(" → ") : "Awaiting business type",
      complete: previewStages.length > 0,
    },
    {
      title: "Trust step",
      text: reserveReady
        ? "Reserve step is ready. Payment holds the build slot before live assembly."
        : "Reserve step appears right after intake.",
      complete: reserveReady,
    },
    {
      title: "Workflow",
      text: currentWorkflow || holyShiftMoment || "Waiting for workflow input",
      complete: !!(currentWorkflow || holyShiftMoment),
    },
  ];

  const reserveHighlights = [
    {
      label: "What happens now",
      value: "Your intake is locked in and your build slot is ready to reserve.",
    },
    {
      label: "Why reserve",
      value: "This keeps the flow clean: intake first, then trust, then reserve, then live build.",
    },
    {
      label: "Payment route",
      value: PAYMENT_NODE_ROUTE,
    },
  ];

  const scrollToReadySystems = () => {
    openRoute("/planet/creator/systems");
  };

  const scrollToIntakeForm = () => {
    intakeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const previewMealBusinessMode = () => {
    setBusinessName("Ready Prep Weekly");
    setBusinessType("Meal Business System");
    setCity("Your City");
    setContact("");
    setCurrentWorkflow(
      "Customer preferences, avoid-food guardrails, weekly board generation, and live adjustments.",
    );
    setBiggestFriction(
      "Too many repeated questions, food preferences, and weekly decision overload.",
    );
    setCustomerQuestions("What can I eat, what should be avoided, and what does my week look like?");
    setHolyShiftMoment(
      "Customers stop filling out dead forms. Their preferences become a live weekly system instantly.",
    );
    setWantsBuilt("full-system");
    setReserveReady(false);
    intakeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setReserveReady(false);

    setTimeout(() => {
      setSubmitting(false);

      const boardSlug = slugify(businessName || "starter-board");

      const initialJob = {
        id: `job-${Date.now()}`,
        customer: businessName || "New Customer",
        service: businessType || "Custom Order",
        stage: "Deposit Needed",
        createdAt: new Date().toISOString(),

        payment: {
          status: "deposit-requested",
          depositRequired: true,
          depositAmount: 25,
          totalAmount: 100,
          paidAmount: 0,
          remainingAmount: 100,
          method: null,
          paidAt: null,
        },
      };

      localStorage.setItem(
        "hp_starter_payload",
        JSON.stringify({
          boardSlug,
          businessName,
          businessType,
          city,
          contact,
          currentWorkflow,
          biggestFriction,
          customerQuestions,
          holyShiftMoment,
          initialJob,
        }),
      );

      window.location.href = `/planet/creator/building?boardSlug=${boardSlug}&businessName=${encodeURIComponent(
        businessName,
      )}&businessType=${encodeURIComponent(businessType)}&city=${encodeURIComponent(
        city,
      )}&primaryGoal=${encodeURIComponent(holyShiftMoment)}`;
    }, 1200);
  };

  const resetIntake = () => {
    setReserveReady(false);
    intakeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const page: React.CSSProperties = {
    minHeight: "100vh",
    padding: isMobile ? 0 : 22,
    color: "#e5e7eb",
    background: warmMode
      ? "radial-gradient(1200px 760px at 8% 10%, rgba(6,182,212,0.12), transparent 52%)," +
        "radial-gradient(980px 720px at 88% 8%, rgba(59,130,246,0.10), transparent 48%)," +
        "radial-gradient(1200px 980px at 50% 100%, rgba(245,158,11,0.08), transparent 54%)," +
        "linear-gradient(180deg, #06070c 0%, #08111f 52%, #05070c 100%)"
      : "radial-gradient(1200px 760px at 8% 10%, rgba(6,182,212,0.14), transparent 52%)," +
        "radial-gradient(980px 720px at 88% 8%, rgba(59,130,246,0.12), transparent 48%)," +
        "radial-gradient(1200px 980px at 50% 100%, rgba(34,197,94,0.08), transparent 54%)," +
        "linear-gradient(180deg, #01040d 0%, #020617 52%, #01040d 100%)",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  };

  const shell: React.CSSProperties = {
    maxWidth: 1450,
    margin: "0 auto",
    padding: isMobile ? "10px 10px 22px" : isTablet ? "12px 12px 24px" : 0,
  };

  const frame: React.CSSProperties = {
    borderRadius: isCompact ? 22 : 28,
    border: warmMode
      ? "1px solid rgba(245,158,11,0.10)"
      : "1px solid rgba(148,163,184,0.14)",
    background: warmMode
      ? "linear-gradient(180deg, rgba(14,18,30,0.95), rgba(8,12,24,0.97) 18%, rgba(7,10,20,0.99) 100%)"
      : "linear-gradient(180deg, rgba(8,15,30,0.92), rgba(2,6,23,0.96) 18%, rgba(2,6,23,0.98) 100%)",
    boxShadow: warmMode
      ? "0 30px 120px rgba(0,0,0,0.52), 0 0 40px rgba(245,158,11,0.06), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.02)"
      : "0 30px 120px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.02)",
    overflow: "hidden",
  };

  const topBar: React.CSSProperties = {
    display: "flex",
    alignItems: isCompact ? "stretch" : "center",
    justifyContent: "space-between",
    gap: 10,
    padding: isCompact ? "12px 12px 10px" : "14px 18px 12px",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
    flexWrap: "wrap",
    flexDirection: isCompact ? "column" : "row",
  };

  const topBarLeft: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  };

  const topBarMobileRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    width: "100%",
  };

  const windowDot = (color: string): React.CSSProperties => ({
    width: 10,
    height: 10,
    borderRadius: 999,
    background: color,
    boxShadow: `0 0 10px ${color}`,
  });

  const topBadge: React.CSSProperties = {
    borderRadius: 999,
    padding: isCompact ? "7px 11px" : "6px 10px",
    border: "1px solid rgba(34,197,94,0.30)",
    background: "rgba(34,197,94,0.12)",
    color: "#bbf7d0",
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: 0.5,
    lineHeight: 1.1,
  };

  const topBadgeBlue: React.CSSProperties = {
    borderRadius: 999,
    padding: isCompact ? "7px 11px" : "6px 10px",
    border: "1px solid rgba(56,189,248,0.30)",
    background: "rgba(56,189,248,0.10)",
    color: "#bae6fd",
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: 0.5,
    lineHeight: 1.1,
  };

  const topBarPrimaryBadge: React.CSSProperties = {
    ...topBadgeBlue,
    maxWidth: isCompact ? "100%" : "unset",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: isCompact ? "nowrap" : "normal",
  };

  const cockpitGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isCompact ? "1fr" : "280px minmax(0, 1fr) 330px",
    gap: isCompact ? 10 : 14,
    padding: isCompact ? 10 : 16,
    alignItems: "start",
  };

  const panel: React.CSSProperties = {
    borderRadius: isCompact ? 18 : 22,
    border: warmMode
      ? "1px solid rgba(245,158,11,0.10)"
      : "1px solid rgba(148,163,184,0.14)",
    background: warmMode
      ? "linear-gradient(180deg, rgba(255,255,255,0.040), rgba(255,255,255,0.018))"
      : "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))",
    boxShadow: warmMode
      ? "0 20px 50px rgba(0,0,0,0.34), 0 0 24px rgba(245,158,11,0.04), inset 0 1px 0 rgba(255,255,255,0.03)"
      : "0 20px 50px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.03)",
    overflow: "hidden",
  };

  const panelHeader: React.CSSProperties = {
    padding: isCompact ? "12px 12px 10px" : "14px 14px 12px",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    background: "linear-gradient(180deg, rgba(56,189,248,0.08), rgba(255,255,255,0.01))",
  };

  const panelKicker: React.CSSProperties = {
    fontSize: isCompact ? 10 : 11,
    fontWeight: 900,
    letterSpacing: 1,
    color: "rgba(125,211,252,0.95)",
    textTransform: "uppercase",
  };

  const panelTitle: React.CSSProperties = {
    marginTop: 6,
    fontSize: isCompact ? 18 : 18,
    fontWeight: 900,
    lineHeight: 1.04,
    color: "#ffffff",
    letterSpacing: -0.3,
  };

  const panelSub: React.CSSProperties = {
    marginTop: 8,
    fontSize: isCompact ? 13 : 13,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.78)",
  };

  const panelBody: React.CSSProperties = { padding: isCompact ? 12 : 14 };

  const heroCore: React.CSSProperties = {
    ...panel,
    minHeight: isCompact ? "auto" : 320,
    position: "relative",
    overflow: "hidden",
    background: warmMode
      ? "radial-gradient(700px 420px at 20% 0%, rgba(56,189,248,0.10), transparent 55%)," +
        "radial-gradient(620px 420px at 100% 10%, rgba(245,158,11,0.10), transparent 48%)," +
        "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))"
      : "radial-gradient(700px 420px at 20% 0%, rgba(56,189,248,0.12), transparent 55%)," +
        "radial-gradient(620px 420px at 100% 10%, rgba(34,197,94,0.10), transparent 48%)," +
        "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
  };

  const heroPadding: React.CSSProperties = {
    padding: isCompact ? 14 : 18,
  };

  const title: React.CSSProperties = {
    fontSize: isMobile ? 32 : isTablet ? 40 : 48,
    fontWeight: 900,
    letterSpacing: isMobile ? -1.1 : -1.6,
    lineHeight: isMobile ? 0.96 : 0.94,
    color: "#ffffff",
    maxWidth: 760,
    marginTop: isCompact ? 10 : 0,
  };

  const hook: React.CSSProperties = {
    marginTop: 10,
    fontSize: isMobile ? 21 : isTablet ? 24 : 26,
    fontWeight: 900,
    lineHeight: 1.04,
    letterSpacing: isMobile ? -0.45 : -0.6,
    color: "#ffffff",
    maxWidth: 820,
  };

  const subtext: React.CSSProperties = {
    marginTop: 12,
    fontSize: isCompact ? 15 : 15,
    lineHeight: 1.58,
    color: "rgba(226,232,240,0.86)",
    maxWidth: 760,
  };

  const ctaRow: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : isTablet
        ? "1fr 1fr"
        : "repeat(4, max-content)",
    gap: 10,
    marginTop: 18,
    alignItems: "stretch",
  };

  const primaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: isCompact ? "14px 16px" : "12px 16px",
    border: "1px solid rgba(34,197,94,0.34)",
    background: "rgba(34,197,94,0.14)",
    color: "#dcfce7",
    fontWeight: 900,
    fontSize: isCompact ? 16 : 14,
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(34,197,94,0.10), inset 0 1px 0 rgba(255,255,255,0.04)",
    width: isCompact ? "100%" : "auto",
  };

  const secondaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: isCompact ? "14px 16px" : "12px 16px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.045)",
    color: "#f8fafc",
    fontWeight: 900,
    fontSize: isCompact ? 16 : 14,
    cursor: "pointer",
    width: isCompact ? "100%" : "auto",
  };

  const statusGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginTop: 18,
  };

  const statusCard: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.035)",
    padding: 12,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
  };

  const statusLabel: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(125,211,252,0.92)",
  };

  const statusValue: React.CSSProperties = {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.08,
  };

  const statusText: React.CSSProperties = {
    marginTop: 6,
    fontSize: isCompact ? 13 : 12,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.76)",
  };

  const creatorPathsCard: React.CSSProperties = {
    ...panel,
    marginTop: 10,
    border: warmMode
      ? "1px solid rgba(244,114,182,0.16)"
      : "1px solid rgba(56,189,248,0.16)",
    background: warmMode
      ? "radial-gradient(780px 260px at 0% 0%, rgba(244,114,182,0.07), transparent 42%), radial-gradient(560px 220px at 100% 0%, rgba(56,189,248,0.06), transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))"
      : "radial-gradient(780px 260px at 0% 0%, rgba(56,189,248,0.07), transparent 42%), radial-gradient(560px 220px at 100% 0%, rgba(34,197,94,0.06), transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
  };

  const creatorPathsWrap: React.CSSProperties = {
    padding: isCompact ? 14 : 16,
  };

  const creatorPathsHeader: React.CSSProperties = {
    maxWidth: 760,
  };

  const creatorPathsEyebrow: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(244,114,182,0.24)",
    background: "rgba(244,114,182,0.08)",
    color: "#fbcfe8",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.8,
  };

  const creatorPathsTitle: React.CSSProperties = {
    marginTop: 12,
    fontSize: isMobile ? 24 : isTablet ? 26 : 28,
    fontWeight: 900,
    lineHeight: 1.02,
    letterSpacing: isMobile ? -0.6 : -0.8,
    color: "#ffffff",
    maxWidth: 720,
  };

  const creatorPathsText: React.CSSProperties = {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(226,232,240,0.82)",
    maxWidth: 760,
  };

  const creatorPathsGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : isTablet
        ? "1fr 1fr"
        : "repeat(4, minmax(0, 1fr))",
    gap: 10,
    marginTop: 16,
  };

  const creatorPathCard: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.035)",
    padding: 14,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const creatorPathTag: React.CSSProperties = {
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 0.7,
    width: "fit-content",
    textTransform: "uppercase",
  };

  const creatorPathTitle: React.CSSProperties = {
    fontSize: isCompact ? 18 : 16,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.08,
  };

  const creatorPathText: React.CSSProperties = {
    fontSize: isCompact ? 13 : 12,
    lineHeight: 1.55,
    color: "rgba(226,232,240,0.74)",
    flex: 1,
  };

  const creatorPathBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: "11px 14px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
    width: "100%",
  };

  const trajectoryList: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const trajectoryItem = (status: string): React.CSSProperties => ({
    borderRadius: 16,
    border:
      status === "active"
        ? "1px solid rgba(56,189,248,0.34)"
        : status === "armed"
          ? "1px solid rgba(250,204,21,0.30)"
          : status === "complete"
            ? "1px solid rgba(34,197,94,0.30)"
            : "1px solid rgba(255,255,255,0.10)",
    background:
      status === "active"
        ? "rgba(56,189,248,0.10)"
        : status === "armed"
          ? "rgba(250,204,21,0.08)"
          : status === "complete"
            ? "rgba(34,197,94,0.10)"
            : "rgba(255,255,255,0.03)",
    padding: 12,
  });

  const trajectoryTop: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  };

  const trajectoryDot = (status: string): React.CSSProperties => ({
    width: 12,
    height: 12,
    borderRadius: 999,
    background:
      status === "active"
        ? "rgba(56,189,248,1)"
        : status === "armed"
          ? "rgba(250,204,21,1)"
          : status === "complete"
            ? "rgba(34,197,94,1)"
            : "rgba(148,163,184,0.8)",
    boxShadow:
      status === "active"
        ? "0 0 14px rgba(56,189,248,0.9)"
        : status === "armed"
          ? "0 0 12px rgba(250,204,21,0.7)"
          : status === "complete"
            ? "0 0 12px rgba(34,197,94,0.75)"
            : "none",
    flexShrink: 0,
  });

  const trajectoryTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isCompact ? 15 : 14,
    color: "#ffffff",
  };

  const trajectoryStatus: React.CSSProperties = {
    marginLeft: "auto",
    fontSize: isCompact ? 10 : 11,
    fontWeight: 900,
    letterSpacing: 0.7,
    color: "rgba(226,232,240,0.72)",
  };

  const trajectoryText: React.CSSProperties = {
    marginTop: 8,
    fontSize: isCompact ? 13 : 12,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.76)",
  };

  const missionFeedList: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isTablet ? "repeat(2, minmax(0, 1fr))" : "repeat(2, minmax(0, 1fr))",
    gap: 10,
  };

  const missionFeedItem: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 12,
    minWidth: 0,
  };

  const feedLabel: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(148,163,184,0.92)",
  };

  const feedValue = (active: boolean): React.CSSProperties => ({
    marginTop: 8,
    fontSize: 14,
    fontWeight: 900,
    lineHeight: 1.15,
    color: active ? "#ffffff" : "rgba(226,232,240,0.54)",
    wordBreak: "break-word",
  });

  const sectionCard: React.CSSProperties = { ...panel, marginTop: 10 };
  const sectionBody: React.CSSProperties = { padding: isCompact ? 12 : 16 };

  const formLead: React.CSSProperties = {
    marginTop: 10,
    fontSize: isCompact ? 14 : 13,
    lineHeight: 1.55,
    color: "rgba(187,247,208,0.96)",
    fontWeight: 800,
  };

  const intentGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(3, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginTop: 14,
  };

  const intentCard = (active: boolean): React.CSSProperties => ({
    border: active ? "1px solid rgba(34,197,94,0.32)" : "1px solid rgba(255,255,255,0.12)",
    background: active ? "rgba(34,197,94,0.14)" : "rgba(255,255,255,0.035)",
    borderRadius: 16,
    padding: 14,
    cursor: "pointer",
    minHeight: isCompact ? 88 : 96,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02), 0 10px 28px rgba(0,0,0,0.18)",
  });

  const intentTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isCompact ? 15 : 14,
    marginBottom: 6,
    color: "#ffffff",
    lineHeight: 1.06,
  };

  const intentText: React.CSSProperties = {
    fontSize: isCompact ? 12 : 12,
    lineHeight: 1.45,
    color: "rgba(226,232,240,0.8)",
  };

  const intakeGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr",
    gap: isCompact ? 12 : 14,
    marginTop: 16,
  };

  const inputGroup: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 8 };

  const label: React.CSSProperties = {
    fontSize: isCompact ? 14 : 12,
    fontWeight: 900,
    letterSpacing: 0.3,
    color: "rgba(186,230,253,0.94)",
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    padding: isCompact ? "14px 14px" : "13px 14px",
    fontSize: isCompact ? 16 : 14,
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const textareaWide: React.CSSProperties = {
    ...inputBase,
    minHeight: isCompact ? 104 : 112,
    resize: "vertical",
  };

  const fileWrap: React.CSSProperties = {
    border: "1px dashed rgba(56,189,248,0.35)",
    background: "rgba(8,47,73,0.22)",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
  };

  const submitWrap: React.CSSProperties = {
    display: "flex",
    alignItems: isCompact ? "stretch" : "center",
    justifyContent: "space-between",
    flexDirection: isCompact ? "column" : "row",
    gap: 14,
    marginTop: 16,
  };

  const submitBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: isCompact ? "14px 18px" : "12px 18px",
    border: "1px solid rgba(34,197,94,0.45)",
    background: "rgba(34,197,94,0.12)",
    color: "rgba(187,247,208,1)",
    fontWeight: 900,
    fontSize: isCompact ? 17 : 14,
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(74,222,128,0.08)",
    width: isCompact ? "100%" : "auto",
  };

  const helperText: React.CSSProperties = {
    fontSize: isCompact ? 13 : 12,
    lineHeight: 1.6,
    color: "rgba(148,163,184,0.88)",
    maxWidth: 680,
  };

  const reservePanel: React.CSSProperties = {
    marginTop: 18,
    border: "1px solid rgba(34,197,94,0.34)",
    background:
      "linear-gradient(180deg, rgba(34,197,94,0.12), rgba(8,15,30,0.86) 36%, rgba(2,6,23,0.92) 100%)",
    borderRadius: 16,
    padding: 16,
    color: "rgba(220,252,231,1)",
    boxShadow: "0 0 22px rgba(74,222,128,0.06)",
  };

  const reserveGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isCompact ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginTop: 14,
  };

  const reserveCard: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: 12,
  };

  const reserveCardLabel: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(187,247,208,0.92)",
  };

  const reserveCardValue: React.CSSProperties = {
    marginTop: 8,
    fontSize: isCompact ? 14 : 13,
    lineHeight: 1.55,
    color: "#ffffff",
    fontWeight: 800,
    wordBreak: "break-word",
  };

  const reserveCtaRow: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isCompact ? "1fr" : "max-content max-content",
    gap: 10,
    marginTop: 16,
    alignItems: "stretch",
  };

  const buildSequenceWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const buildSequenceItem: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 12,
  };

  const buildSequenceTop: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 };

  const buildSequenceDot = (complete: boolean): React.CSSProperties => ({
    width: 10,
    height: 10,
    borderRadius: 999,
    background: complete ? "rgba(34,197,94,1)" : "rgba(56,189,248,1)",
    boxShadow: complete ? "0 0 12px rgba(34,197,94,0.8)" : "0 0 12px rgba(56,189,248,0.7)",
    flexShrink: 0,
  });

  const buildSequenceTitle: React.CSSProperties = {
    fontSize: isCompact ? 14 : 13,
    fontWeight: 900,
    color: "#ffffff",
  };

  const buildSequenceText: React.CSSProperties = {
    marginTop: 8,
    fontSize: isCompact ? 13 : 12,
    lineHeight: 1.52,
    color: "rgba(226,232,240,0.78)",
    wordBreak: "break-word",
  };

  const sideActionGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
  };

  const sideActionBtn: React.CSSProperties = {
    width: "100%",
    textAlign: "left",
    borderRadius: 14,
    padding: isCompact ? "13px 13px" : "12px 13px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    fontWeight: 900,
    fontSize: isCompact ? 15 : 13,
    cursor: "pointer",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
  };

  const stageGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr", gap: 10 };

  const stageCard: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 12,
  };

  const stageTag: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "5px 9px",
    border: "1px solid rgba(56,189,248,0.30)",
    background: "rgba(56,189,248,0.08)",
    color: "rgba(186,230,253,1)",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.6,
  };

  const stageName: React.CSSProperties = {
    marginTop: 8,
    fontSize: isCompact ? 16 : 14,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.08,
  };

  const stageText: React.CSSProperties = {
    marginTop: 6,
    fontSize: isCompact ? 13 : 12,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.74)",
  };

  const examplesLabel: React.CSSProperties = {
    marginTop: isCompact ? 18 : 22,
    fontWeight: 900,
    fontSize: isMobile ? 22 : isTablet ? 24 : 18,
    letterSpacing: isMobile ? -0.3 : -0.2,
    color: "#f8fafc",
    lineHeight: 1.06,
  };

  const featuredDemoCard: React.CSSProperties = {
    ...panel,
    marginTop: 12,
    border: "1px solid rgba(34,197,94,0.30)",
    background:
      "linear-gradient(180deg, rgba(34,197,94,0.10), rgba(2,6,23,0.80) 30%, rgba(2,6,23,0.88) 100%)",
    cursor: "pointer",
  };

  const featuredDemoInner: React.CSSProperties = { padding: isCompact ? 14 : 18 };

  const featuredDemoTop: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: isCompact ? 14 : 18,
    flexDirection: isCompact ? "column" : "row",
  };

  const featuredDemoTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isCompact ? 24 : 22,
    color: "#ffffff",
    lineHeight: 1.04,
    letterSpacing: isCompact ? -0.5 : -0.3,
  };

  const featuredDemoSubline: React.CSSProperties = {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 1.42,
    color: "rgba(226,232,240,0.9)",
    maxWidth: 760,
  };

  const featuredDemoAction: React.CSSProperties = {
    ...primaryBtn,
    padding: isCompact ? "13px 16px" : "10px 14px",
    fontSize: isCompact ? 16 : 13,
    whiteSpace: "nowrap",
  };

  const featuredDemoBadgeRow: React.CSSProperties = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 12,
  };

  const featuredDemoBadge: React.CSSProperties = {
    borderRadius: 999,
    padding: isCompact ? "8px 12px" : "6px 10px",
    fontSize: 11,
    fontWeight: 900,
    border: "1px solid rgba(34,197,94,0.38)",
    color: "rgba(187,247,208,1)",
    background: "rgba(34,197,94,0.10)",
    letterSpacing: 0.4,
  };

  const featuredDemoSecondaryBadge: React.CSSProperties = {
    borderRadius: 999,
    padding: isCompact ? "8px 12px" : "6px 10px",
    fontSize: 11,
    fontWeight: 900,
    border: "1px solid rgba(56,189,248,0.34)",
    color: "rgba(186,230,253,1)",
    background: "rgba(56,189,248,0.08)",
    letterSpacing: 0.4,
  };

  const featuredValueGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isCompact ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginTop: 14,
  };

  const featuredValueCard: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: 12,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
  };

  const examplesGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "1fr"
      : isTablet
        ? "1fr 1fr"
        : "repeat(2, minmax(0, 1fr))",
    gap: 10,
    marginTop: 12,
  };

  const exampleCard: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.035)",
    borderRadius: 18,
    padding: isCompact ? 15 : "14px 16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: isCompact ? 10 : 8,
    boxShadow: "0 14px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)",
  };

  const tagStyle: React.CSSProperties = {
    borderRadius: 999,
    padding: isCompact ? "8px 12px" : "6px 10px",
    fontSize: 11,
    fontWeight: 900,
    border: "1px solid rgba(250,204,21,0.40)",
    color: "rgba(254,240,138,1)",
    background: "rgba(250,204,21,0.10)",
    width: "fit-content",
  };

  const exampleTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isCompact ? 19 : 15,
    color: "#ffffff",
    lineHeight: 1.06,
  };

  const exampleSub: React.CSSProperties = {
    fontSize: isCompact ? 14 : 12,
    color: "rgba(226,232,240,0.76)",
    lineHeight: 1.5,
  };

  const footerWrap: React.CSSProperties = {
    marginTop: 24,
    paddingTop: 18,
    borderTop: "1px solid rgba(148,163,184,0.16)",
    textAlign: "center",
  };

  const footerPrimary: React.CSSProperties = {
    fontSize: isCompact ? 14 : 13,
    color: "#94a3b8",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
    lineHeight: 1.35,
  };

  const footerSecondary: React.CSSProperties = {
    marginTop: 8,
    fontSize: isCompact ? 13 : 12,
    color: "rgba(148,163,184,0.72)",
    lineHeight: 1.45,
  };

  const footerPlanetMark: React.CSSProperties = {
    position: "relative",
    width: isCompact ? 18 : 16,
    height: isCompact ? 18 : 16,
    display: "inline-block",
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 35% 35%, #7dd3fc 0%, #38bdf8 45%, #1d4ed8 100%)",
    boxShadow: "0 0 10px rgba(56,189,248,0.45)",
    flexShrink: 0,
  };

  const footerPlanetRing: React.CSSProperties = {
    position: "absolute",
    left: -3,
    top: 6,
    width: isCompact ? 25 : 22,
    height: isCompact ? 8 : 7,
    border: "1.5px solid rgba(186,230,253,0.92)",
    borderRadius: "50%",
    transform: "rotate(-18deg)",
    opacity: 0.95,
    boxShadow: "0 0 6px rgba(125,211,252,0.25)",
    pointerEvents: "none",
  };

  const mobilePreviewPanel: React.CSSProperties = {
    ...panel,
    marginTop: 10,
  };

  const intentCards = [
    { id: "landing-page" as BuildIntent, title: "Landing Page", text: "Clear front door" },
    { id: "live-board" as BuildIntent, title: "Live Board", text: "Jobs and status live" },
    {
      id: "workflow-tool" as BuildIntent,
      title: "Workflow Tool",
      text: "Built around your process",
    },
    { id: "intake-flow" as BuildIntent, title: "Intake Flow", text: "Calls, texts, walk-ins" },
    { id: "payment-flow" as BuildIntent, title: "Payment Flow", text: "Job to payment" },
    {
      id: "full-system" as BuildIntent,
      title: "Full Business System",
      text: "Everything in one place",
    },
  ];

  const compactReadySystemsSection = (
    <div style={sectionCard}>
      <div style={panelHeader}>
        <div style={panelKicker}>Creator systems</div>
        <div style={panelTitle}>Live systems moved into their own page</div>
        <div style={panelSub}>
          Creator City stays focused on the intake and build path. Open the full systems library separately.
        </div>
      </div>

      <div style={sectionBody}>
        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          <div style={stageCard}>
            <div style={stageTag}>SEPARATE PAGE</div>
            <div style={stageName}>CreatorSystems</div>
            <div style={stageText}>
              Studio boards, live selling, and every ready demo system now live at /planet/creator/systems.
            </div>
          </div>

          <button type="button" style={primaryBtn} onClick={scrollToReadySystems}>
            Open Creator Systems
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={page}>
      <div style={shell}>
        <div style={frame}>
          <div style={topBar}>
            <div style={topBarMobileRow}>
              <span style={windowDot("#fb7185")} />
              <span style={windowDot("#fbbf24")} />
              <span style={windowDot("#4ade80")} />
              <div style={topBadge}>CREATOR CITY</div>
            </div>

            <div style={topBarLeft}>
              <button
                type="button"
                onClick={() => setWarmMode((v) => !v)}
                style={{
                  ...topBadgeBlue,
                  cursor: "pointer",
                  background: warmMode ? "rgba(245,158,11,0.10)" : "rgba(56,189,248,0.10)",
                  border: warmMode
                    ? "1px solid rgba(245,158,11,0.28)"
                    : "1px solid rgba(56,189,248,0.30)",
                  color: warmMode ? "#fde68a" : "#bae6fd",
                }}
              >
                {warmMode ? "WARM MODE ON" : "COOL MODE ON"}
              </button>

              {!isCompact && <div style={topBadgeBlue}>LIVE BOARD GENERATOR</div>}
              <div style={topBarPrimaryBadge}>PRIMARY ROUTE /planet/creator/building</div>
              {!isCompact && (
                <div style={topBadge}>{reserveReady ? "RESERVE READY" : "FREE TRIAL"}</div>
              )}
            </div>
          </div>

          <div style={cockpitGrid}>
            {!isCompact && (
              <div style={panel}>
                <div style={panelHeader}>
                  <div style={panelKicker}>Launch path</div>
                  <div style={panelTitle}>Business launch path</div>
                  <div style={panelSub}>Intake to launch.</div>
                </div>

                <div style={panelBody}>
                  <div style={trajectoryList}>
                    {trajectorySteps.map((step) => (
                      <div key={step.id} style={trajectoryItem(step.status)}>
                        <div style={trajectoryTop}>
                          <span style={trajectoryDot(step.status)} />
                          <div style={trajectoryTitle}>{step.title}</div>
                          <div style={trajectoryStatus}>{step.status.toUpperCase()}</div>
                        </div>
                        <div style={trajectoryText}>{step.text}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 14 }}>
                    <div
                      style={{
                        borderRadius: 18,
                        border: "1px solid rgba(255,255,255,0.10)",
                        background: "rgba(255,255,255,0.03)",
                        padding: 12,
                      }}
                    >
                      <div style={panelKicker}>Board family</div>
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 15,
                          fontWeight: 900,
                          color: "#ffffff",
                          lineHeight: 1.08,
                        }}
                      >
                        {configPreview.familyLabel}
                      </div>
                      <div style={panelSub}>{configPreview.boardSubtitle}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div style={heroCore}>
                <div style={heroPadding}>
                  {!isCompact && (
                    <button
                      type="button"
                      style={{ ...topBadge, cursor: "pointer" }}
                      onClick={scrollToIntakeForm}
                    >
                      BUILD MY BUSINESS SYSTEM
                    </button>
                  )}

                  <div style={title}>Creator City</div>

                  <div style={hook}>
                    {isMealBusinessMode ? (
                      <>
                        Launch your meal business
                        <br />
                        as a live system.
                      </>
                    ) : (
                      <>
                        Your business is not complicated.
                        <br />
                        Your tools are.
                      </>
                    )}
                  </div>

                  <div style={subtext}>
                    {isMealBusinessMode
                      ? "Intake, weekly planning, customer preferences, food guardrails, and live decision control all in one place."
                      : "Build your workflow into a live board."}
                  </div>

                  <div style={ctaRow}>
                    <button style={primaryBtn} onClick={scrollToIntakeForm}>
                      Start My Free Demo
                    </button>

                    <button style={secondaryBtn} onClick={previewMealBusinessMode}>
                      Meal Business System
                    </button>

                    <button style={secondaryBtn} onClick={scrollToReadySystems}>
                      Open Creator Systems
                    </button>

                    {!isCompact && (
                      <button
                        style={secondaryBtn}
                        onClick={() => openRoute(LIVE_CAMP_GUARDIAN_ROUTE)}
                      >
                        Camp Guardian
                      </button>
                    )}

                    {!isCompact && (
                      <button
                        style={secondaryBtn}
                        onClick={() => openRoute("/planet/experience")}
                      >
                        Experience Planet
                      </button>
                    )}
                  </div>

                  <div style={statusGrid}>
                    <div style={statusCard}>
                      <div style={statusLabel}>Live demo</div>
                      <div style={statusValue}>Intake</div>
                      <div style={statusText}>Your intake builds the board.</div>
                    </div>

                    <div style={statusCard}>
                      <div style={statusLabel}>Board type</div>
                      <div style={statusValue}>{resolvedBusinessLabel}</div>
                      <div style={statusText}>Matched into a starter board family.</div>
                    </div>

                    <div style={statusCard}>
                      <div style={statusLabel}>Next step</div>
                      <div style={statusValue}>
                        {reserveReady ? "Reserve" : previewStages.length > 0 ? previewStages[0] : "Waiting"}
                      </div>
                      <div style={statusText}>
                        {reserveReady
                          ? "Trust-first build hold is ready."
                          : "The board predicts the first stages."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={creatorPathsCard}>
                <div style={creatorPathsWrap}>
                  <div style={creatorPathsHeader}>
                    <div style={creatorPathsEyebrow}>CREATOR PATHS</div>

                    <div style={creatorPathsTitle}>
                      Pick the creator path you actually need.
                    </div>

                    <div style={creatorPathsText}>
                      Creator City should orient fast. Not dump a fake cockpit on the homepage.
                      Choose your lane, then go deeper into the real system that fits how you create.
                    </div>
                  </div>

                  <div style={creatorPathsGrid}>
                    <div style={creatorPathCard}>
                      <div style={creatorPathTag}>Creator Studio</div>
                      <div style={creatorPathTitle}>
                        Ideas, clips, edits, drops, and creator momentum.
                      </div>
                      <div style={creatorPathText}>
                        The real creator board. Built for streamers, editors, gamers,
                        stylists, and live personalities.
                      </div>
                      <button
                        type="button"
                        style={creatorPathBtn}
                        onClick={() => openRoute("/planet/creator/studio-board")}
                      >
                        Open Creator Studio
                      </button>
                    </div>

                    <div style={creatorPathCard}>
                      <div style={creatorPathTag}>Live Selling</div>
                      <div style={creatorPathTitle}>
                        For creators who actually sell while live.
                      </div>
                      <div style={creatorPathText}>
                        Use the selling board only when the creator flow is truly commerce-first.
                      </div>
                      <button
                        type="button"
                        style={creatorPathBtn}
                        onClick={() => openRoute(LIVE_PRODUCT_DEMO_ROUTE)}
                      >
                        Open Live Selling
                      </button>
                    </div>

                    <div style={creatorPathCard}>
                      <div style={creatorPathTag}>Creator Systems</div>
                      <div style={creatorPathTitle}>
                        Open every live creator system and demo board in one place.
                      </div>
                      <div style={creatorPathText}>
                        Use the systems page when you want the full HomePlanet demo lineup without burying it inside intake.
                      </div>
                      <button
                        type="button"
                        style={creatorPathBtn}
                        onClick={() => openRoute("/planet/creator/systems")}
                      >
                        Open Creator Systems
                      </button>
                    </div>

                    <div style={creatorPathCard}>
                      <div style={creatorPathTag}>Build Your System</div>
                      <div style={creatorPathTitle}>
                        Start a custom creator setup from intake.
                      </div>
                      <div style={creatorPathText}>
                        Use intake when your workflow needs a custom HomePlanet system.
                      </div>
                      <button
                        type="button"
                        style={creatorPathBtn}
                        onClick={scrollToIntakeForm}
                      >
                        Start My Free Demo
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {isCompact && compactReadySystemsSection}

              {isCompact && (
                <div style={mobilePreviewPanel}>
                  <div style={panelHeader}>
                    <div style={panelKicker}>Live preview</div>
                    <div style={panelTitle}>{configPreview.familyLabel}</div>
                    <div style={panelSub}>Fast board preview.</div>
                  </div>

                  <div style={panelBody}>
                    <div style={{ display: "grid", gap: 10 }}>
                      <div style={stageCard}>
                        <div style={stageTag}>{reserveReady ? "RESERVE STEP" : "FIRST STAGE"}</div>
                        <div style={stageName}>
                          {reserveReady ? "Reserve Your Build" : previewStages[0] || "Waiting"}
                        </div>
                        <div style={stageText}>
                          {reserveReady
                            ? "Intake is complete. Reserve your build slot to move into the live build path."
                            : configPreview.boardSubtitle}
                        </div>
                      </div>

                      <div style={stageCard}>
                        <div style={stageTag}>{reserveReady ? "PAYMENT ROUTE" : "LIVE REDIRECT"}</div>
                        <div style={stageName}>
                          {reserveReady
                            ? PAYMENT_NODE_ROUTE
                            : businessName
                              ? `/planet/live/${slugify(businessName) || "starter-board"}-*`
                              : "/planet/live/<boardSlug>"}
                        </div>
                        <div style={stageText}>
                          {reserveReady
                            ? "Trust comes first. Reserve before live build."
                            : "Your intake creates the board path."}
                        </div>
                      </div>

                      {isTablet && (
                        <div style={stageCard}>
                          <div style={stageTag}>MISSION FEED</div>
                          <div style={stageName}>Compact system truth</div>
                          <div style={{ ...stageText, marginTop: 8 }}>
                            {missionFeed.slice(0, 4).map((item) => (
                              <div key={item.label} style={{ marginBottom: 8 }}>
                                <strong style={{ color: "#ffffff" }}>{item.label}:</strong>{" "}
                                {item.value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!isCompact && (
                <div style={sectionCard}>
                  <div style={panelHeader}>
                    <div style={panelKicker}>System truth</div>
                    <div style={panelTitle}>Mission feed</div>
                    <div style={panelSub}>Live intake signals.</div>
                  </div>

                  <div style={sectionBody}>
                    <div style={missionFeedList}>
                      {missionFeed.map((item) => (
                        <div key={item.label} style={missionFeedItem}>
                          <div style={feedLabel}>{item.label}</div>
                          <div style={feedValue(item.active)}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={intakeFormRef} style={sectionCard}>
                <div style={panelHeader}>
                  <div style={panelKicker}>Mission intake</div>
                  <div style={panelTitle}>Start your free live demo</div>
                  <div style={panelSub}>
                    {reserveReady
                      ? "Your intake is in. Reserve the build slot to move forward."
                      : "Fill this out. We’ll turn it into a live board."}
                  </div>
                </div>

                <div style={sectionBody}>
                  <div style={formLead}>
                    {reserveReady
                      ? "Your intake created the reserve step."
                      : "This intake creates the demo."}
                  </div>

                  <div style={intentGrid}>
                    {intentCards.map((cardItem) => (
                      <div
                        key={cardItem.id}
                        style={intentCard(wantsBuilt === cardItem.id)}
                        onClick={() => setWantsBuilt(cardItem.id)}
                      >
                        <div style={intentTitle}>{cardItem.title}</div>
                        <div style={intentText}>{cardItem.text}</div>
                      </div>
                    ))}
                  </div>

                  {reserveReady ? (
                    <div style={reservePanel}>
                      <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>
                        Reserve Your Build ⚡
                      </div>

                      <div style={{ lineHeight: 1.7, color: "rgba(220,252,231,0.96)" }}>
                        Your intake is locked in. The next step is simple: reserve the build
                        so the flow moves cleanly into payment and live assembly.
                      </div>

                      <div style={reserveGrid}>
                        {reserveHighlights.map((item) => (
                          <div key={item.label} style={reserveCard}>
                            <div style={reserveCardLabel}>{item.label}</div>
                            <div style={reserveCardValue}>{item.value}</div>
                          </div>
                        ))}
                      </div>

                      <div style={reserveCtaRow}>
                        <button
                          type="button"
                          style={submitBtn}
                          onClick={() => openRoute(reservePaymentRoute)}
                        >
                          Reserve Your Build
                        </button>

                        <button
                          type="button"
                          style={secondaryBtn}
                          onClick={resetIntake}
                        >
                          Edit Intake
                        </button>
                      </div>

                      <div style={{ ...helperText, marginTop: 12, maxWidth: "100%" }}>
                        Trust-first flow. No weird friction. Intake first, reserve second,
                        live build next.
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div style={intakeGrid}>
                        <div style={inputGroup}>
                          <label style={label}>Business name</label>
                          <input
                            style={inputBase}
                            value={businessName}
                            placeholder="Taylor Creek Contractors"
                            onChange={(e) => setBusinessName(e.target.value)}
                          />
                        </div>

                        <div style={inputGroup}>
                          <label style={label}>Business type</label>
                          <input
                            style={inputBase}
                            value={businessType}
                            placeholder="Home Services"
                            onChange={(e) => setBusinessType(e.target.value)}
                          />
                        </div>

                        <div style={inputGroup}>
                          <label style={label}>City</label>
                          <input
                            style={inputBase}
                            value={city}
                            placeholder="Okeechobee"
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>

                        <div style={inputGroup}>
                          <label style={label}>Email or preferred contact</label>
                          <input
                            style={inputBase}
                            value={contact}
                            placeholder="you@business.com"
                            onChange={(e) => setContact(e.target.value)}
                          />
                        </div>

                        <div style={{ ...inputGroup, gridColumn: "1 / -1" }}>
                          <label style={label}>How do you run jobs right now?</label>
                          <textarea
                            style={textareaWide}
                            value={currentWorkflow}
                            placeholder="Calls, texts, paper tickets, whiteboards, spreadsheets, or whatever you're doing now."
                            onChange={(e) => setCurrentWorkflow(e.target.value)}
                          />
                        </div>

                        <div style={{ ...inputGroup, gridColumn: "1 / -1" }}>
                          <label style={label}>What wastes the most time?</label>
                          <textarea
                            style={textareaWide}
                            value={biggestFriction}
                            placeholder="What keeps breaking the flow, creating delays, or causing confusion?"
                            onChange={(e) => setBiggestFriction(e.target.value)}
                          />
                        </div>

                        <div style={{ ...inputGroup, gridColumn: "1 / -1" }}>
                          <label style={label}>What do customers keep asking about?</label>
                          <textarea
                            style={textareaWide}
                            value={customerQuestions}
                            placeholder="What do they call, text, or ask about over and over?"
                            onChange={(e) => setCustomerQuestions(e.target.value)}
                          />
                        </div>

                        <div style={{ ...inputGroup, gridColumn: "1 / -1" }}>
                          <label style={label}>
                            What would make you say “holy shit, this solves it”?
                          </label>
                          <textarea
                            style={textareaWide}
                            value={holyShiftMoment}
                            placeholder="What would make the system instantly feel worth it?"
                            onChange={(e) => setHolyShiftMoment(e.target.value)}
                          />
                        </div>
                      </div>

                      <div style={fileWrap}>
                        <div style={label}>Upload workflow photos</div>
                        <div style={{ ...panelSub, marginTop: 8 }}>Show your current setup.</div>
                        <div style={{ marginTop: 12 }}>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setWorkflowFiles(Array.from(e.target.files || []))}
                            style={{ fontSize: isCompact ? 16 : 14, width: "100%" }}
                          />
                        </div>
                        <div
                          style={{
                            marginTop: 10,
                            fontSize: isCompact ? 14 : 12,
                            color: "rgba(186,230,253,0.9)",
                          }}
                        >
                          {selectedFilesLabel}
                        </div>
                      </div>

                      <div style={submitWrap}>
                        <button
                          type="submit"
                          style={{
                            ...submitBtn,
                            opacity: submitting ? 0.7 : 1,
                            cursor: submitting ? "progress" : "pointer",
                          }}
                          disabled={submitting}
                        >
                          {submitting ? "Preparing your reserve step..." : "Build My Free Demo"}
                        </button>

                        <div style={helperText}>
                          Your intake becomes a trust-first reserve step before live build.
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {!isCompact && (
              <div style={{ display: "grid", gap: 14 }}>
                <div style={panel}>
                  <div style={panelHeader}>
                    <div style={panelKicker}>Actions</div>
                    <div style={panelTitle}>Launch controls</div>
                    <div style={panelSub}>Next actions only.</div>
                  </div>

                  <div style={panelBody}>
                    <div style={sideActionGrid}>
                      <button style={sideActionBtn} onClick={scrollToIntakeForm}>
                        {reserveReady ? "Go to reserve step" : "Start my free demo"}
                      </button>

                      <button style={sideActionBtn} onClick={previewMealBusinessMode}>
                        Preview meal business mode
                      </button>

                      <button style={sideActionBtn} onClick={() => openRoute(MEAL_BUSINESS_ROUTE)}>
                        Open meal launch flow
                      </button>

                      {reserveReady && (
                        <button
                          style={sideActionBtn}
                          onClick={() => openRoute(reservePaymentRoute)}
                        >
                          Open payment node
                        </button>
                      )}

                      <button
                        style={sideActionBtn}
                        onClick={() => openRoute(LIVE_CAMP_GUARDIAN_ROUTE)}
                      >
                        Open Camp Guardian
                      </button>

                      <button style={sideActionBtn} onClick={scrollToReadySystems}>
                        Open creator systems
                      </button>

                      <button
                        style={sideActionBtn}
                        onClick={() => openRoute("/planet/experience")}
                      >
                        Open Experience Planet
                      </button>

                      <button
                        style={sideActionBtn}
                        onClick={() => openRoute(LIVE_PRODUCT_DEMO_ROUTE)}
                      >
                        Open product selling board
                      </button>
                    </div>
                  </div>
                </div>

                <div style={panel}>
                  <div style={panelHeader}>
                    <div style={panelKicker}>Build feed</div>
                    <div style={panelTitle}>Board assembly preview</div>
                    <div style={panelSub}>Live board build signals.</div>
                  </div>

                  <div style={panelBody}>
                    <div style={buildSequenceWrap}>
                      {buildSequence.map((item) => (
                        <div key={item.title} style={buildSequenceItem}>
                          <div style={buildSequenceTop}>
                            <span style={buildSequenceDot(item.complete)} />
                            <div style={buildSequenceTitle}>{item.title}</div>
                          </div>
                          <div style={buildSequenceText}>{item.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={panel}>
                  <div style={panelHeader}>
                    <div style={panelKicker}>Stage preview</div>
                    <div style={panelTitle}>{configPreview.familyLabel}</div>
                    <div style={panelSub}>Early stage map.</div>
                  </div>

                  <div style={panelBody}>
                    <div style={stageGrid}>
                      {(reserveReady
                        ? ["Reserve Your Build", ...previewStages.slice(0, 3)]
                        : previewStages
                      ).map((stage, index) => (
                        <div key={`${stage}-${index}`} style={stageCard}>
                          <div style={stageTag}>STAGE {index + 1}</div>
                          <div style={stageName}>{stage}</div>
                          <div style={stageText}>
                            {index === 0 && reserveReady
                              ? "Trust-first hold before live build."
                              : "Part of the live board workflow."}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: isCompact ? "0 10px 20px" : "0 16px 28px" }}>
            {!isCompact ? (
              <div ref={readySystemsRef} style={panel}>
                <div style={panelHeader}>
                  <div style={panelKicker}>Creator systems</div>
                  <div style={panelTitle}>Ready systems now live on their own page</div>
                  <div style={panelSub}>
                    Creator City stays locked on intake and build. Use the systems page when you want the full live demo lineup.
                  </div>
                </div>

                <div style={panelBody}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isTablet ? "1fr" : "minmax(0, 1fr) auto",
                      gap: 14,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "grid", gap: 10 }}>
                      <div style={stageCard}>
                        <div style={stageTag}>SEPARATE DEMO PAGE</div>
                        <div style={stageName}>/planet/creator/systems</div>
                        <div style={stageText}>
                          Open Creator Studio, live selling, Experience Planet, and the full HomePlanet demo board library without cluttering the intake flow.
                        </div>
                      </div>

                      <div style={helperText}>
                        This keeps mobile and tablet cleaner, tighter, and easier to understand.
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 10 }}>
                      <button type="button" style={primaryBtn} onClick={scrollToReadySystems}>
                        Open Creator Systems
                      </button>
                      <button
                        type="button"
                        style={secondaryBtn}
                        onClick={() => openRoute("/planet/creator/studio-board")}
                      >
                        Open Creator Studio
                      </button>
                    </div>
                  </div>

                  <div style={examplesLabel}>Featured proof inside Creator City</div>

                  <div
                    style={featuredDemoCard}
                    onClick={() => openRoute(PAYMENT_DESK_DEMO_ROUTE)}
                  >
                    <div style={featuredDemoInner}>
                      <div style={featuredDemoBadgeRow}>
                        <div style={featuredDemoBadge}>LIVE PAYMENT DESK</div>
                        <div style={featuredDemoSecondaryBadge}>NO SCREENSHOT PAYMENTS</div>
                      </div>

                      <div style={featuredDemoTop}>
                        <div>
                          <div style={featuredDemoTitle}>No Screenshot Payments</div>
                          <div style={featuredDemoSubline}>
                            Customer pays. System confirms. Work keeps moving. This is the clean
                            proof page for showing how HomePlanet handles payment truth without
                            screenshots, text chasing, or manual verification.
                          </div>
                        </div>

                        <button
                          type="button"
                          style={featuredDemoAction}
                          onClick={(e) => {
                            e.stopPropagation();
                            openRoute(PAYMENT_DESK_DEMO_ROUTE);
                          }}
                        >
                          Open live demo
                        </button>
                      </div>

                      <div style={featuredValueGrid}>
                        <div style={featuredValueCard}>
                          <div style={feedLabel}>Problem</div>
                          <div style={feedValue(true)}>
                            “Did you send it?” should not be a workflow.
                          </div>
                        </div>

                        <div style={featuredValueCard}>
                          <div style={feedLabel}>What it proves</div>
                          <div style={feedValue(true)}>
                            Payment becomes visible truth the second it happens.
                          </div>
                        </div>

                        <div style={featuredValueCard}>
                          <div style={feedLabel}>Best use</div>
                          <div style={feedValue(true)}>
                            Send as a direct standalone proof page or open from Creator City.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={examplesLabel}>More live system examples</div>

                  <div style={examplesGrid}>
                    {systems
                      .filter((item) => item.id !== "payments")
                      .map((item) => (
                        <div
                          key={item.id}
                          style={exampleCard}
                          onClick={() => openRoute(item.to)}
                        >
                          <div style={tagStyle}>{item.tag}</div>
                          <div style={exampleTitle}>{item.title}</div>
                          <div style={exampleSub}>{item.subtitle}</div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            ) : null}

            {/* Talk to a human */}
            <div className="mt-10 border-t border-neutral-800 pt-6 flex flex-col items-center gap-3">
              <a
                href="https://instagram.com/homeplanetlive"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-black/50 px-5 py-3 text-sm font-semibold text-white hover:border-neutral-500"
              >
                Talk to a human
              </a>

              <p className="text-xs text-neutral-600 text-center max-w-sm">
                No accounts. No spam. No data traps. Just build and run your system.
              </p>
            </div>

            {/* Footer */}
            <div style={footerWrap}>
              <div style={footerPrimary}>
                <span style={footerPlanetMark}>
                  <span style={footerPlanetRing} />
                </span>
                HomePlanet © 2026. All rights reserved.
              </div>
              <div style={footerSecondary}>
                Your business is not complicated. Your tools are.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
