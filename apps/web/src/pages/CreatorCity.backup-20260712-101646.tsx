import React, { useEffect, useMemo, useRef, useState } from "react";

const LIVE_PRODUCT_DEMO_ROUTE = "/planet/creator/rc-live";
const LIVE_CAMP_GUARDIAN_ROUTE = "/planet/demo/camp-aquaflow";
const PAYMENT_NODE_ROUTE = "/planet/payments/node";
const PAYMENT_DESK_DEMO_ROUTE = "/planet/payments/no-screenshot";
const MEAL_BUSINESS_ROUTE = "/planet/lifestyle/meal-start";
const CREATOR_SYSTEMS_ROUTE = "/planet/creator/systems";
const CREATOR_STUDIO_ROUTE = "/planet/creator/studio";

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

type StarterBoardConfig = {
  key: string;
  familyLabel: string;
  boardSubtitle: string;
  labels: {
    item: string;
    concern: string;
  };
  stages: string[];
};

type TrajectoryStep = {
  id: string;
  title: string;
  status: "complete" | "active" | "armed" | "idle";
  text: string;
};

type FeedItem = {
  label: string;
  value: string;
  active: boolean;
};

type BuildSequenceItem = {
  title: string;
  text: string;
  complete: boolean;
};

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
}): StarterBoardConfig {
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
  const [warmMode, setWarmMode] = useState(false);
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

  const openRoute = (to: string) => {
    window.location.href = to;
  };

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
        tag: "SELL LIVE",
      },
      {
        id: "northstar",
        title: "Northstar Service Demo",
        subtitle: "Service workflow turned into a live board.",
        to: "/planet/demo/home-services",
        tag: "SERVICE LIVE",
      },
      {
        id: "child-safety",
        title: "Child Safety System",
        subtitle: "Unsafe conversation detection, intervention, and Guardian alert layer.",
        to: "/planet/predator-shield",
        tag: "DETECTION LIVE",
      },
      {
        id: "routecut",
        title: "RouteCut Live Lawn Flow",
        subtitle: "Routing, next-stop flow, and live status.",
        to: "/planet/demo/lawn-route",
        tag: "ROUTE LIVE",
      },
      {
        id: "restaurant",
        title: "Restaurant Live Board",
        subtitle: "Kitchen flow, ticket stages, and manager visibility.",
        to: "/planet/demo/restaurant",
        tag: "LIVE SYSTEM",
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
        to: "/planet/demo/community-sale",
        tag: "COMMUNITY LIVE",
      },
      {
        id: "transportation",
        title: "Transportation Dispatch Demo",
        subtitle: "Driver assignment, dispatch flow, and trip visibility.",
        to: "/planet/demo/transportation",
        tag: "ACTIVE FLOW",
      },
      {
        id: "legal",
        title: "Legal Workspace Demo",
        subtitle: "Timeline, evidence, and proof-style organization.",
        to: "/planet/legal/alex-carter",
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

  const trajectorySteps: TrajectoryStep[] = [
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

  const missionFeed: FeedItem[] = [
    { label: "Presence lock", value: businessName ? "READY" : "WAITING", active: !!businessName },
    { label: "Board family", value: configPreview.familyLabel || "STARTER", active: true },
    { label: "Primary route", value: "/planet/creator/building", active: true },
    { label: "Reserve route", value: PAYMENT_NODE_ROUTE, active: reserveReady },
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

  const buildSequence: BuildSequenceItem[] = [
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

  const scrollToCreatorSystems = () => openRoute(CREATOR_SYSTEMS_ROUTE);

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

      window.location.href = `/planet/live/${boardSlug}`;
    }, 900);
  };

  const resetIntake = () => {
    setReserveReady(false);
    intakeFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background: warmMode
      ? "radial-gradient(900px 600px at 10% 10%, rgba(255,180,80,0.18), transparent 55%)," +
        "radial-gradient(800px 500px at 85% 5%, rgba(255,120,60,0.12), transparent 50%)," +
        "radial-gradient(1000px 700px at 50% 100%, rgba(255,200,120,0.10), transparent 60%)," +
        "linear-gradient(180deg, #0b0b0d 0%, #121018 55%, #0b0b0d 100%)"
      : "radial-gradient(900px 600px at 10% 10%, rgba(56,189,248,0.18), transparent 55%)," +
        "radial-gradient(800px 500px at 85% 5%, rgba(59,130,246,0.14), transparent 50%)," +
        "radial-gradient(1000px 700px at 50% 100%, rgba(34,197,94,0.10), transparent 60%)," +
        "linear-gradient(180deg, #020617 0%, #020617 60%, #01040d 100%)",
    color: "#fff",
    padding: isCompact ? 14 : 22,
    transition: "background 0.6s ease",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };

  const shell: React.CSSProperties = {
    maxWidth: 1180,
    margin: "0 auto",
  };

  const frame: React.CSSProperties = {
    borderRadius: isCompact ? 22 : 28,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(7,11,19,0.90)",
    boxShadow: "0 24px 90px rgba(0,0,0,0.45)",
    overflow: "hidden",
  };

  const topBar: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: isCompact ? "12px" : "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    flexWrap: "wrap",
  };

  const windowDot = (color: string): React.CSSProperties => ({
    width: 9,
    height: 9,
    borderRadius: 999,
    background: color,
    boxShadow: `0 0 10px ${color}`,
  });

  const pill = (tone: "blue" | "green" | "gold" = "blue"): React.CSSProperties => {
    const background =
      tone === "green" ? "#70f2a3" : tone === "gold" ? "#f8d36b" : "#67e8f9";

    return {
      display: "inline-flex",
      alignItems: "center",
      width: "fit-content",
      borderRadius: 999,
      padding: "5px 8px",
      background,
      color: "#001018",
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: 0.4,
      lineHeight: 1,
      textRendering: "geometricPrecision",
      whiteSpace: "nowrap",
    };
  };

  const ghostPill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.84)",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.4,
    lineHeight: 1,
    whiteSpace: "nowrap",
  };

  const cockpitGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isCompact ? "1fr" : "220px minmax(0, 1fr) 250px",
    gap: 14,
    padding: isCompact ? 12 : 16,
    alignItems: "start",
  };

  const panel: React.CSSProperties = {
    borderRadius: 18,
    border: warmMode
      ? "1px solid rgba(255,180,80,0.18)"
      : "1px solid rgba(255,255,255,0.10)",
    background: warmMode
      ? "linear-gradient(135deg, rgba(255,200,140,0.055), rgba(255,255,255,0.020))"
      : "linear-gradient(135deg, rgba(255,255,255,0.065), rgba(255,255,255,0.025))",
    boxShadow: warmMode
      ? "0 25px 60px rgba(0,0,0,0.45), 0 0 35px rgba(255,160,80,0.08), inset 0 1px 0 rgba(255,255,255,0.04)"
      : "0 18px 50px rgba(0,0,0,0.28)",
    overflow: "hidden",
    transition: "all 0.35s ease",
  };

  const panelHeader: React.CSSProperties = {
    padding: 14,
    borderBottom: "1px solid rgba(255,255,255,0.09)",
  };

  const panelBody: React.CSSProperties = {
    padding: 14,
  };

  const kicker: React.CSSProperties = {
    color: "#67e8f9",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  };

  const panelTitle: React.CSSProperties = {
    marginTop: 6,
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: -0.35,
    color: "#fff",
    lineHeight: 1.08,
  };

  const muted: React.CSSProperties = {
    marginTop: 6,
    color: "rgba(255,255,255,0.64)",
    fontSize: 13,
    lineHeight: 1.45,
  };

  const card: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.035)",
    padding: 14,
  };

  const buttonBase: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.045)",
    color: "#fff",
    borderRadius: 999,
    padding: isCompact ? "13px 15px" : "11px 14px",
    fontSize: isCompact ? 15 : 13,
    fontWeight: 900,
    cursor: "pointer",
  };

  const primaryButton: React.CSSProperties = {
    ...buttonBase,
    border: "1px solid rgba(112,242,163,0.45)",
    background: "#70f2a3",
    color: "#001018",
    boxShadow: warmMode
      ? "0 0 22px rgba(74,222,128,0.25)"
      : "0 0 10px rgba(34,197,94,0.08)",
    transition: "box-shadow 0.35s ease",
  };

  const sideButton: React.CSSProperties = {
    width: "100%",
    textAlign: "left",
    borderRadius: 14,
    padding: "12px 13px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.035)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: isMobile ? 36 : 48,
    lineHeight: 0.95,
    letterSpacing: -1.6,
    fontWeight: 950,
    color: "#fff",
  };

  const routeText: React.CSSProperties = {
    marginTop: 10,
    color: "rgba(255,255,255,0.24)",
    fontSize: 10,
    wordBreak: "break-word",
  };

  const fieldLabel: React.CSSProperties = {
    color: "rgba(186,230,253,0.94)",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.2,
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.13)",
    background: "rgba(255,255,255,0.045)",
    color: "#fff",
    padding: isCompact ? "13px 13px" : "12px 13px",
    fontSize: isCompact ? 16 : 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const textareaBase: React.CSSProperties = {
    ...inputBase,
    minHeight: 104,
    resize: "vertical",
  };

  const liveDot: React.CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: "#67e8f9",
    boxShadow: "0 0 12px rgba(103,232,249,0.8)",
    flex: "0 0 auto",
  };

  const cityLight = (tone: "live" | "ready" | "armed" | "idle" | "alert" = "live"): React.CSSProperties => {
    const colors = {
      live: { bg: "#67e8f9", glow: "rgba(103,232,249,0.80)" },
      ready: { bg: "#70f2a3", glow: "rgba(112,242,163,0.72)" },
      armed: { bg: "#f8d36b", glow: "rgba(248,211,107,0.68)" },
      idle: { bg: "rgba(255,255,255,0.35)", glow: "rgba(255,255,255,0.16)" },
      alert: { bg: "#fb7185", glow: "rgba(251,113,133,0.72)" },
    }[tone];

    return {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: colors.bg,
      boxShadow: `0 0 12px ${colors.glow}`,
      flex: "0 0 auto",
    };
  };

  const stepTone = (status: TrajectoryStep["status"]): React.CSSProperties => ({
    ...card,
    border:
      status === "active"
        ? "1px solid rgba(103,232,249,0.36)"
        : status === "armed"
          ? "1px solid rgba(248,211,107,0.34)"
          : status === "complete"
            ? "1px solid rgba(112,242,163,0.34)"
            : "1px solid rgba(255,255,255,0.10)",
  });

  const intentCard = (active: boolean): React.CSSProperties => ({
    ...card,
    cursor: "pointer",
    border: active ? "1px solid rgba(112,242,163,0.40)" : "1px solid rgba(255,255,255,0.10)",
    background: active ? "rgba(112,242,163,0.12)" : "rgba(255,255,255,0.035)",
  });

  return (
    <div style={page}>
      <style>
        {`
          @keyframes hpLivePulse {
            0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(103,232,249,.55); }
            70% { transform: scale(1.18); opacity: .82; box-shadow: 0 0 0 7px rgba(103,232,249,0); }
            100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(103,232,249,0); }
          }
        `}
      </style>

      <div style={shell}>
        <div style={frame}>
          <div style={topBar}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={windowDot("#fb7185")} />
              <span style={windowDot("#f8d36b")} />
              <span style={windowDot("#70f2a3")} />
              <span style={pill("green")}>CREATOR CITY</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setWarmMode((v) => !v)}
                style={{
                  ...ghostPill,
                  cursor: "pointer",
                  background: warmMode
                    ? "linear-gradient(180deg, rgba(255,180,80,0.25), rgba(255,120,60,0.12))"
                    : "linear-gradient(180deg, rgba(56,189,248,0.18), rgba(59,130,246,0.10))",
                  border: warmMode
                    ? "1px solid rgba(255,180,80,0.45)"
                    : "1px solid rgba(56,189,248,0.40)",
                  color: warmMode ? "#fde68a" : "#bae6fd",
                  boxShadow: warmMode
                    ? "0 0 14px rgba(255,160,80,0.45)"
                    : "0 0 14px rgba(56,189,248,0.45)",
                }}
              >
                {warmMode ? "WARM MODE ON" : "COOL MODE ON"}
              </button>
              {!isMobile ? <span style={pill("blue")}>LIVE BOARD GENERATOR</span> : null}
              {!isMobile ? <span style={ghostPill}>PRIMARY ROUTE /planet/creator/building</span> : null}
              {!isMobile ? <span style={pill("green")}>{reserveReady ? "RESERVE READY" : "FREE TRIAL"}</span> : null}
            </div>
          </div>

          <div style={cockpitGrid}>
            {!isCompact ? (
              <aside style={{ display: "grid", gap: 14 }}>
                <div style={panel}>
                  <div style={panelHeader}>
                    <div style={kicker}>Launch path</div>
                    <div style={panelTitle}>Business launch path</div>
                    <div style={muted}>Intake to launch.</div>
                  </div>

                  <div style={{ ...panelBody, display: "grid", gap: 10 }}>
                    {trajectorySteps.map((step) => (
                      <div key={step.id} style={stepTone(step.status)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 999,
                              background:
                                step.status === "complete"
                                  ? "#70f2a3"
                                  : step.status === "active"
                                    ? "#67e8f9"
                                    : step.status === "armed"
                                      ? "#f8d36b"
                                      : "rgba(255,255,255,0.35)",
                            }}
                          />
                          <strong style={{ flex: 1, fontSize: 13 }}>{step.title}</strong>
                          <span style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.5)" }}>
                            {step.status.toUpperCase()}
                          </span>
                        </div>
                        <div style={muted}>{step.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={panel}>
                  <div style={panelHeader}>
                    <div style={kicker}>Board family</div>
                    <div style={panelTitle}>{configPreview.familyLabel}</div>
                    <div style={muted}>{configPreview.boardSubtitle}</div>
                  </div>
                </div>
              </aside>
            ) : null}

            <main style={{ display: "grid", gap: 14 }}>
              <section style={panel}>
                <div style={{ ...panelBody, padding: isCompact ? 16 : 18 }}>
                  <span style={pill("green")}>BUILD MY BUSINESS SYSTEM</span>

                  <h1 style={{ ...title, marginTop: 12 }}>Creator City</h1>

                  <div
                    style={{
                      marginTop: 10,
                      maxWidth: 760,
                      fontSize: isMobile ? 22 : 27,
                      lineHeight: 1.05,
                      fontWeight: 950,
                      letterSpacing: -0.65,
                    }}
                  >
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

                  <div style={{ ...muted, fontSize: 15 }}>
                    {isMealBusinessMode
                      ? "Intake, weekly planning, customer preferences, food guardrails, and live decision control all in one place."
                      : "Build your workflow into a live board."}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 9,
                      marginTop: 18,
                    }}
                  >
                    <button style={primaryButton} onClick={scrollToIntakeForm}>
                      Start My Free Demo
                    </button>
                    <button style={buttonBase} onClick={previewMealBusinessMode}>
                      Meal Business System
                    </button>
                    <button style={buttonBase} onClick={scrollToCreatorSystems}>
                      Open Creator Systems
                    </button>
                    <button style={buttonBase} onClick={() => openRoute(LIVE_CAMP_GUARDIAN_ROUTE)}>
                      Camp Guardian
                    </button>
                    <button style={buttonBase} onClick={() => openRoute("/planet/experience")}>
                      Experience Planet
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
                      gap: 10,
                      marginTop: 18,
                    }}
                  >
                    {[
                      ["Live demo", "Intake", "Your intake builds the board."],
                      ["Board type", resolvedBusinessLabel, "Matched into a starter board family."],
                      [
                        "Next step",
                        reserveReady ? "Reserve" : previewStages[0] || "Waiting",
                        reserveReady ? "Trust-first build hold is ready." : "The board predicts the first stages.",
                      ],
                    ].map(([labelText, value, detail]) => (
                      <div key={labelText} style={card}>
                        <div style={kicker}>{labelText}</div>
                        <div style={{ marginTop: 7, fontSize: 17, fontWeight: 900 }}>{value}</div>
                        <div style={muted}>{detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section style={panel}>
                <div style={panelBody}>
                  <div style={kicker}>Creator paths</div>
                  <div style={{ ...panelTitle, fontSize: isMobile ? 24 : 28 }}>
                    Pick the creator path you actually need.
                  </div>
                  <div style={muted}>
                    Creator City should orient fast. Choose your lane, then go deeper into the
                    real system that fits how you create.
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, minmax(0, 1fr))",
                      gap: 10,
                      marginTop: 16,
                    }}
                  >
                    {[
                      {
                        tag: "MOMENT LAB",
                        title: "Creator Studio",
                        text: "Ideas, clips, edits, drops, and creator momentum.",
                        action: "Open Creator Studio",
                        to: CREATOR_STUDIO_ROUTE,
                      },
                      {
                        tag: "SELL LIVE",
                        title: "Live Selling",
                        text: "For creators who actually sell while live.",
                        action: "Open Live Selling",
                        to: LIVE_PRODUCT_DEMO_ROUTE,
                      },
                      {
                        tag: "LIVE SYSTEM",
                        title: "Creator Systems",
                        text: "Open every live creator system and demo board in one place.",
                        action: "Open Creator Systems",
                        to: CREATOR_SYSTEMS_ROUTE,
                      },
                      {
                        tag: "BUILD PATH",
                        title: "Build Your System",
                        text: "Start a custom creator setup from intake.",
                        action: "Start My Free Demo",
                        to: "",
                      },
                    ].map((item) => (
                      <div key={item.title} style={card}>
                        <span style={pill("blue")}>{item.tag}</span>
                        <div style={{ marginTop: 12, fontSize: 16, fontWeight: 950, lineHeight: 1.08 }}>
                          {item.title}
                        </div>
                        <div style={{ ...muted, minHeight: isMobile ? "auto" : 58 }}>{item.text}</div>
                        <button
                          type="button"
                          style={{
                            ...buttonBase,
                            width: "100%",
                            marginTop: 10,
                            borderRadius: 14,
                          }}
                          onClick={() => (item.to ? openRoute(item.to) : scrollToIntakeForm())}
                        >
                          {item.action}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {!isCompact ? (
                <section style={panel}>
                  <div style={panelHeader}>
                    <div style={kicker}>System truth</div>
                    <div style={panelTitle}>Mission feed</div>
                    <div style={muted}>Live intake signals.</div>
                  </div>

                  <div
                    style={{
                      ...panelBody,
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 10,
                    }}
                  >
                    {missionFeed.map((item) => (
                      <div key={item.label} style={card}>
                        <div style={kicker}>{item.label}</div>
                        <div
                          style={{
                            marginTop: 8,
                            color: item.active ? "#fff" : "rgba(255,255,255,0.48)",
                            fontSize: 13,
                            fontWeight: 900,
                            wordBreak: "break-word",
                          }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <section ref={intakeFormRef} style={panel}>
                <div style={panelHeader}>
                  <div style={kicker}>Mission intake</div>
                  <div style={panelTitle}>Start your free live demo</div>
                  <div style={muted}>
                    {reserveReady
                      ? "Your intake is in. Reserve the build slot to move forward."
                      : "Fill this out. We’ll turn it into a live board."}
                  </div>
                </div>

                <div style={panelBody}>
                  <div
                    style={{
                      color: reserveReady ? "#70f2a3" : "rgba(187,247,208,0.96)",
                      fontSize: 13,
                      fontWeight: 900,
                      marginBottom: 14,
                    }}
                  >
                    {reserveReady ? "Your intake created the reserve step." : "This intake creates the demo."}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, minmax(0, 1fr))",
                      gap: 10,
                    }}
                  >
                    {intentCards.map((item) => (
                      <div
                        key={item.id}
                        style={intentCard(wantsBuilt === item.id)}
                        onClick={() => setWantsBuilt(item.id)}
                      >
                        <div style={{ fontSize: 14, fontWeight: 950 }}>{item.title}</div>
                        <div style={muted}>{item.text}</div>
                      </div>
                    ))}
                  </div>

                  {reserveReady ? (
                    <div
                      style={{
                        ...card,
                        marginTop: 16,
                        border: "1px solid rgba(112,242,163,0.40)",
                        background:
                          "linear-gradient(180deg, rgba(112,242,163,0.12), rgba(255,255,255,0.035))",
                      }}
                    >
                      <div style={{ fontSize: 19, fontWeight: 950 }}>Reserve Your Build</div>
                      <div style={{ ...muted, color: "rgba(220,252,231,0.92)" }}>
                        Your intake is locked in. The next step is simple: reserve the build
                        so the flow moves cleanly into payment and live assembly.
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
                          gap: 10,
                          marginTop: 14,
                        }}
                      >
                        {reserveHighlights.map((item) => (
                          <div key={item.label} style={card}>
                            <div style={kicker}>{item.label}</div>
                            <div style={{ ...muted, color: "#fff", fontWeight: 800 }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                        <button type="button" style={primaryButton} onClick={() => openRoute(reservePaymentRoute)}>
                          Reserve Your Build
                        </button>
                        <button type="button" style={buttonBase} onClick={resetIntake}>
                          Edit Intake
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: isCompact ? "1fr" : "1fr 1fr",
                          gap: 13,
                          marginTop: 16,
                        }}
                      >
                        {[
                          ["Business name", businessName, setBusinessName, "Taylor Creek Contractors"],
                          ["Business type", businessType, setBusinessType, "Home Services"],
                          ["City", city, setCity, "Okeechobee"],
                          ["Email or preferred contact", contact, setContact, "you@business.com"],
                        ].map(([labelText, value, setter, placeholder]) => (
                          <label key={labelText as string} style={{ display: "grid", gap: 8 }}>
                            <span style={fieldLabel}>{labelText as string}</span>
                            <input
                              style={inputBase}
                              value={value as string}
                              placeholder={placeholder as string}
                              onChange={(e) =>
                                (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)
                              }
                            />
                          </label>
                        ))}

                        {[
                          [
                            "How do you run jobs right now?",
                            currentWorkflow,
                            setCurrentWorkflow,
                            "Calls, texts, paper tickets, whiteboards, spreadsheets, or whatever you're doing now.",
                          ],
                          [
                            "What wastes the most time?",
                            biggestFriction,
                            setBiggestFriction,
                            "What keeps breaking the flow, creating delays, or causing confusion?",
                          ],
                          [
                            "What do customers keep asking about?",
                            customerQuestions,
                            setCustomerQuestions,
                            "What do they call, text, or ask about over and over?",
                          ],
                          [
                            "What would make you say “holy shit, this solves it”?",
                            holyShiftMoment,
                            setHolyShiftMoment,
                            "What would make the system instantly feel worth it?",
                          ],
                        ].map(([labelText, value, setter, placeholder]) => (
                          <label
                            key={labelText as string}
                            style={{ display: "grid", gap: 8, gridColumn: "1 / -1" }}
                          >
                            <span style={fieldLabel}>{labelText as string}</span>
                            <textarea
                              style={textareaBase}
                              value={value as string}
                              placeholder={placeholder as string}
                              onChange={(e) =>
                                (setter as React.Dispatch<React.SetStateAction<string>>)(e.target.value)
                              }
                            />
                          </label>
                        ))}
                      </div>

                      <div
                        style={{
                          marginTop: 14,
                          borderRadius: 16,
                          border: "1px dashed rgba(103,232,249,0.35)",
                          background: "rgba(8,47,73,0.18)",
                          padding: 14,
                        }}
                      >
                        <div style={fieldLabel}>Upload workflow photos</div>
                        <div style={muted}>Show your current setup.</div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => setWorkflowFiles(Array.from(e.target.files || []))}
                          style={{ marginTop: 12, width: "100%", fontSize: isCompact ? 16 : 14 }}
                        />
                        <div style={{ ...muted, color: "rgba(186,230,253,0.9)" }}>
                          {selectedFilesLabel}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: isCompact ? "stretch" : "center",
                          justifyContent: "space-between",
                          gap: 14,
                          flexDirection: isCompact ? "column" : "row",
                          marginTop: 16,
                        }}
                      >
                        <button
                          type="submit"
                          style={{
                            ...primaryButton,
                            opacity: submitting ? 0.72 : 1,
                            cursor: submitting ? "progress" : "pointer",
                          }}
                          disabled={submitting}
                        >
                          {submitting ? "Preparing your reserve step..." : "Build My Free Demo"}
                        </button>

                        <div style={{ ...muted, maxWidth: 520 }}>
                          Your intake becomes a trust-first reserve step before live build.
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </section>
            </main>

            {!isCompact ? (
              <aside style={{ display: "grid", gap: 14 }}>
                <div style={panel}>
                  <div style={panelHeader}>
                    <div style={kicker}>Actions</div>
                    <div style={panelTitle}>Launch controls</div>
                    <div style={muted}>Next actions only.</div>
                  </div>

                  <div style={{ ...panelBody, display: "grid", gap: 10 }}>
                    <button style={sideButton} onClick={scrollToIntakeForm}>
                      {reserveReady ? "Go to reserve step" : "Start my free demo"}
                    </button>
                    <button style={sideButton} onClick={previewMealBusinessMode}>
                      Preview meal business mode
                    </button>
                    <button style={sideButton} onClick={() => openRoute(MEAL_BUSINESS_ROUTE)}>
                      Open meal launch flow
                    </button>
                    {reserveReady ? (
                      <button style={sideButton} onClick={() => openRoute(reservePaymentRoute)}>
                        Open payment node
                      </button>
                    ) : null}
                    <button style={sideButton} onClick={() => openRoute(LIVE_CAMP_GUARDIAN_ROUTE)}>
                      Open Camp Guardian
                    </button>
                    <button style={sideButton} onClick={scrollToCreatorSystems}>
                      Open creator systems
                    </button>
                    <button style={sideButton} onClick={() => openRoute("/planet/experience")}>
                      Open Experience Planet
                    </button>
                    <button style={sideButton} onClick={() => openRoute(LIVE_PRODUCT_DEMO_ROUTE)}>
                      Open product selling board
                    </button>
                  </div>
                </div>

                <div style={panel}>
                  <div style={panelHeader}>
                    <div style={kicker}>Build feed</div>
                    <div style={panelTitle}>Board assembly preview</div>
                    <div style={muted}>Live board build signals.</div>
                  </div>

                  <div style={{ ...panelBody, display: "grid", gap: 10 }}>
                    {buildSequence.map((item) => (
                      <div key={item.title} style={card}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              ...cityLight(item.complete ? "ready" : "live"),
                              animation:
                                warmMode && !item.complete
                                  ? "hpLivePulse 1.6s ease-out infinite"
                                  : "none",
                            }}
                          />
                          <strong style={{ fontSize: 13 }}>{item.title}</strong>
                        </div>
                        <div style={muted}>{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={panel}>
                  <div style={panelHeader}>
                    <div style={kicker}>Stage preview</div>
                    <div style={panelTitle}>{configPreview.familyLabel}</div>
                    <div style={muted}>Early stage map.</div>
                  </div>

                  <div style={{ ...panelBody, display: "grid", gap: 10 }}>
                    {(reserveReady ? ["Reserve Your Build", ...previewStages.slice(0, 3)] : previewStages).map(
                      (stage, index) => (
                        <div key={`${stage}-${index}`} style={card}>
                          <span style={pill("blue")}>STAGE {index + 1}</span>
                          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 950 }}>
                            {stage}
                          </div>
                          <div style={muted}>
                            {index === 0 && reserveReady
                              ? "Trust-first hold before live build."
                              : "Part of the live board workflow."}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </aside>
            ) : null}
          </div>

          <div style={{ padding: isCompact ? "0 12px 24px" : "0 16px 28px" }}>
            <section style={panel}>
              <div style={panelHeader}>
                <div style={kicker}>Creator systems</div>
                <div style={panelTitle}>Ready systems now live on their own page</div>
                <div style={muted}>
                  Creator City stays locked on intake and build. Use the systems page when you want the full live demo lineup.
                </div>
              </div>

              <div style={panelBody}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isCompact ? "1fr" : "minmax(0, 1fr) auto",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <div style={card}>
                    <span style={pill("blue")}>SEPARATE DEMO PAGE</span>
                    <div style={{ marginTop: 10, fontSize: 16, fontWeight: 950 }}>
                      /planet/creator/systems
                    </div>
                    <div style={muted}>
                      Open Creator Studio, live selling, Experience Planet, and the full HomePlanet demo board library without cluttering the intake flow.
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <button type="button" style={primaryButton} onClick={scrollToCreatorSystems}>
                      Open Creator Systems
                    </button>
                    <button type="button" style={buttonBase} onClick={() => openRoute(CREATOR_STUDIO_ROUTE)}>
                      Open Creator Studio
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 22, fontSize: 20, fontWeight: 950 }}>
                  Featured proof inside Creator City
                </div>

                <div
                  style={{
                    ...card,
                    marginTop: 12,
                    cursor: "pointer",
                    border: "1px solid rgba(112,242,163,0.28)",
                    background:
                      "linear-gradient(180deg, rgba(112,242,163,0.10), rgba(255,255,255,0.035))",
                  }}
                  onClick={() => openRoute(PAYMENT_DESK_DEMO_ROUTE)}
                >
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={pill("green")}>LIVE PAYMENT DESK</span>
                    <span style={pill("blue")}>NO SCREENSHOT PAYMENTS</span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isCompact ? "1fr" : "minmax(0, 1fr) auto",
                      gap: 14,
                      marginTop: 14,
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 950 }}>No Screenshot Payments</div>
                      <div style={{ ...muted, fontSize: 15 }}>
                        Customer pays. System confirms. Work keeps moving. This is the clean proof page for showing how HomePlanet handles payment truth without screenshots, text chasing, or manual verification.
                      </div>
                    </div>

                    <button
                      type="button"
                      style={primaryButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        openRoute(PAYMENT_DESK_DEMO_ROUTE);
                      }}
                    >
                      Open live demo
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isCompact ? "1fr" : "repeat(3, minmax(0, 1fr))",
                      gap: 10,
                      marginTop: 14,
                    }}
                  >
                    {[
                      ["Problem", "“Did you send it?” should not be a workflow."],
                      ["What it proves", "Payment becomes visible truth the second it happens."],
                      ["Best use", "Send as a direct standalone proof page or open from Creator City."],
                    ].map(([labelText, value]) => (
                      <div key={labelText} style={card}>
                        <div style={kicker}>{labelText}</div>
                        <div style={{ ...muted, color: "#fff", fontWeight: 800 }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: 22, fontSize: 20, fontWeight: 950 }}>
                  More live system examples
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(2, minmax(0, 1fr))",
                    gap: 10,
                    marginTop: 12,
                  }}
                >
                  {systems
                    .filter((item) => item.id !== "payments")
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        style={{
                          ...card,
                          textAlign: "left",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                        onClick={() => openRoute(item.to)}
                      >
                        <span style={pill("blue")}>{item.tag}</span>
                        <div style={{ marginTop: 12, fontSize: 16, fontWeight: 950 }}>
                          {item.title}
                        </div>
                        <div style={muted}>{item.subtitle}</div>
                        <div style={routeText}>{item.to}</div>
                      </button>
                    ))}
                </div>
              </div>
            </section>

            <div
              style={{
                marginTop: 30,
                paddingTop: 22,
                borderTop: "1px solid rgba(255,255,255,0.10)",
                display: "grid",
                justifyItems: "center",
                gap: 10,
              }}
            >
              <a
                href="https://instagram.com/homeplanetlive"
                target="_blank"
                rel="noreferrer"
                style={{
                  ...buttonBase,
                  textDecoration: "none",
                  borderRadius: 14,
                }}
              >
                Talk to a human
              </a>

              <p
                style={{
                  margin: 0,
                  maxWidth: 460,
                  textAlign: "center",
                  color: "rgba(255,255,255,0.42)",
                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                No accounts. No spam. No data traps. Just build and run your system.
              </p>

              <div
                style={{
                  marginTop: 10,
                  color: "rgba(255,255,255,0.46)",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                HomePlanet © 2026. All rights reserved.
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,0.42)",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                Your business is not complicated. Your tools are.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



