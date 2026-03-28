import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const REQUEST_ACCESS_URL =
  "https://kcmcssyyopmvqglsddyw.supabase.co";
const REQUEST_ACCESS_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXMiJ9";

const LIVE_PRODUCT_DEMO_ROUTE = "/planet/creator/rc-live";

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

export default function CreatorCity() {
  const nav = useNavigate();
  const readySystemsRef = useRef<HTMLDivElement | null>(null);

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
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const systems = useMemo<SystemExample[]>(
    () => [
      {
        id: "experience",
        title: "Experience Planet",
        subtitle:
          "Escape rooms, classrooms, scavenger hunts, birthdays, and challenge boards in one live system.",
        to: "/planet/experience",
        tag: "NEW SYSTEM",
      },
      {
        id: "live-product",
        title: "Live Product Selling Board",
        subtitle:
          "Turn live video, reserve pressure, and proof-state into one selling board.",
        to: LIVE_PRODUCT_DEMO_ROUTE,
        tag: "HIGH VALUE",
      },
      {
        id: "northstar",
        title: "Northstar Service Demo",
        subtitle: "See a service workflow turned into a live operational board.",
        to: "/planet/vehicles/awnit-demo",
        tag: "DEMO BOARD",
      },
      {
        id: "routecut",
        title: "RouteCut Live Lawn Flow",
        subtitle: "See routing, next-stop flow, and customer-facing live status.",
        to: "/planet/lawn/routecut",
        tag: "LIVE ROUTE",
      },
      {
        id: "restaurant",
        title: "Restaurant Live Board",
        subtitle:
          "See live ticket flow, manager controls, and kitchen visibility.",
        to: "/planet/food/restaurant-rush-live",
        tag: "LIVE BOARD",
      },
      {
        id: "community-sale",
        title: "Community Sale Board",
        subtitle:
          "Photos, prices, sold status, pickup notes, and payment links in one live board.",
        to: "/planet/community/community-sale",
        tag: "COMMUNITY LIVE",
      },
      {
        id: "transportation",
        title: "Transportation Dispatch Demo",
        subtitle:
          "See ride intake, driver assignment, dispatch flow, and trip timeline visibility.",
        to: "/planet/transportation/dispatch",
        tag: "DISPATCH FLOW",
      },
      {
        id: "legal",
        title: "Legal Workspace Demo",
        subtitle: "See evidence, timeline structure, and proof-style organization.",
        to: "/planet/legal/joe-grant",
        tag: "WORKSPACE",
      },
    ],
    [],
  );

  const selectedFilesLabel =
    workflowFiles.length === 0
      ? "No workflow photos selected yet"
      : `${workflowFiles.length} workflow photo${
          workflowFiles.length === 1 ? "" : "s"
        } selected`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const fileNames =
      workflowFiles.length > 0
        ? workflowFiles.map((file) => file.name).join(", ")
        : "No workflow photos selected";

    const intentLabelMap: Record<BuildIntent, string> = {
      "landing-page": "Landing Page",
      "live-board": "Live Board",
      "workflow-tool": "Workflow Tool",
      "intake-flow": "Intake Flow",
      "payment-flow": "Payment Flow",
      "full-system": "Full Business System",
    };

    const message = [
      "Creator City Business Intake",
      "",
      `Business Type: ${businessType || "—"}`,
      `Current Workflow: ${currentWorkflow || "—"}`,
      `Biggest Friction: ${biggestFriction || "—"}`,
      `Customer Questions / Status Chasing: ${customerQuestions || "—"}`,
      `Requested Build: ${intentLabelMap[wantsBuilt]}`,
      `Holy Shit Moment Wanted: ${holyShiftMoment || "—"}`,
      `Workflow Photos Selected: ${fileNames}`,
    ].join("\n");

    try {
      const res = await fetch(REQUEST_ACCESS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: REQUEST_ACCESS_ANON_KEY,
          Authorization: `Bearer ${REQUEST_ACCESS_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: businessName,
          business: businessName,
          type: businessType || intentLabelMap[wantsBuilt],
          city,
          contact,
          message,
        }),
      });

      const text = await res.text();
      console.log("CREATOR CITY SUBMISSION:", res.status, text);

      if (!res.ok) {
        throw new Error(text || "Failed to submit Creator City intake");
      }

      nav("/planet/creator/building", {
        state: { redirectTo: "/planet/vehicles/awnit-demo" },
      });
    } catch (err: any) {
      console.error("CREATOR CITY ERROR:", err?.message || err);
      alert(
        "Creator City submission failed:\n" + (err?.message || "Unknown error"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const scrollToReadySystems = () => {
    readySystemsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const page: React.CSSProperties = {
    minHeight: "100vh",
    padding: isMobile ? 0 : 24,
    color: "#e5e7eb",
    background:
      "radial-gradient(1200px 760px at 6% 10%, rgba(6,182,212,0.12), transparent 52%)," +
      "radial-gradient(980px 720px at 88% 10%, rgba(168,85,247,0.10), transparent 50%)," +
      "radial-gradient(900px 780px at 52% 100%, rgba(37,99,235,0.09), transparent 50%)," +
      "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03), transparent 36%)," +
      "#020617",
  };

  const shell: React.CSSProperties = {
    maxWidth: 1320,
    margin: "0 auto",
    padding: isMobile ? "14px 14px 28px" : 0,
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(2,6,23,0.78)",
    borderRadius: isMobile ? 28 : 24,
    boxShadow:
      "0 24px 80px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.03)",
    overflow: "hidden",
  };

  const hero: React.CSSProperties = {
    ...card,
    padding: isMobile ? 18 : 24,
  };

  const title: React.CSSProperties = {
    fontSize: isMobile ? 42 : 36,
    fontWeight: 900,
    letterSpacing: isMobile ? -1.1 : -1.3,
    lineHeight: isMobile ? 0.95 : 1.02,
    color: "#ffffff",
  };

  const hook: React.CSSProperties = {
    fontSize: isMobile ? 28 : 24,
    fontWeight: 900,
    lineHeight: 1.08,
    letterSpacing: isMobile ? -0.7 : -0.4,
    color: "#ffffff",
    marginTop: 10,
  };

  const subtext: React.CSSProperties = {
    marginTop: 12,
    fontSize: isMobile ? 17 : 15,
    lineHeight: isMobile ? 1.45 : 1.65,
    color: "rgba(226,232,240,0.86)",
    maxWidth: 860,
  };

  const livePill: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "10px 14px" : "7px 12px",
    border: "1px solid rgba(34,197,94,0.35)",
    background: "rgba(34,197,94,0.10)",
    color: "rgba(187,247,208,1)",
    fontWeight: 900,
    fontSize: isMobile ? 13 : 12,
    letterSpacing: 0.6,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 0 18px rgba(74,222,128,0.14)",
    width: "fit-content",
  };

  const pulseDot: React.CSSProperties = {
    width: isMobile ? 12 : 8,
    height: isMobile ? 12 : 8,
    borderRadius: 999,
    background: "rgba(74,222,128,1)",
    boxShadow: "0 0 12px rgba(74,222,128,0.9)",
    flexShrink: 0,
  };

  const ctaRow: React.CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 18,
  };

  const primaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "15px 20px" : "12px 18px",
    border: "1px solid rgba(34,197,94,0.30)",
    background: "rgba(34,197,94,0.16)",
    color: "#dcfce7",
    fontWeight: 900,
    fontSize: isMobile ? 18 : 14,
    cursor: "pointer",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  };

  const secondaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "15px 20px" : "12px 18px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.045)",
    color: "#f8fafc",
    fontWeight: 900,
    fontSize: isMobile ? 18 : 14,
    cursor: "pointer",
  };

  const quickGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: isMobile ? 14 : 12,
    marginTop: 22,
  };

  const quickCard: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.035)",
    borderRadius: 20,
    padding: isMobile ? 18 : 16,
    minHeight: isMobile ? 118 : 108,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
  };

  const quickTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 22 : 15,
    color: "#ffffff",
    lineHeight: 1.05,
    marginBottom: 8,
  };

  const quickText: React.CSSProperties = {
    fontSize: isMobile ? 16 : 13,
    lineHeight: isMobile ? 1.4 : 1.55,
    color: "rgba(226,232,240,0.8)",
  };

  const sectionCard: React.CSSProperties = {
    ...card,
    marginTop: 18,
    padding: isMobile ? 18 : 20,
    background: "rgba(2,6,23,0.82)",
  };

  const sectionTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 28 : 22,
    lineHeight: 1.05,
    color: "#ffffff",
    letterSpacing: isMobile ? -0.7 : -0.3,
    marginBottom: 8,
  };

  const sectionSub: React.CSSProperties = {
    fontSize: isMobile ? 16 : 14,
    lineHeight: isMobile ? 1.4 : 1.6,
    color: "rgba(226,232,240,0.8)",
  };

  const intentGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: isMobile ? 14 : 12,
    marginTop: 16,
  };

  const intentCard = (active: boolean): React.CSSProperties => ({
    border: active
      ? "1px solid rgba(34,197,94,0.32)"
      : "1px solid rgba(255,255,255,0.12)",
    background: active
      ? "rgba(34,197,94,0.14)"
      : "rgba(255,255,255,0.035)",
    borderRadius: 20,
    padding: isMobile ? 18 : 14,
    cursor: "pointer",
    minHeight: isMobile ? 108 : 102,
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.02), 0 12px 28px rgba(0,0,0,0.18)",
  });

  const intentTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 20 : 14,
    marginBottom: 6,
    color: "#ffffff",
    lineHeight: 1.06,
  };

  const intentText: React.CSSProperties = {
    fontSize: isMobile ? 15 : 12,
    lineHeight: isMobile ? 1.38 : 1.5,
    color: "rgba(226,232,240,0.8)",
  };

  const intakeGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? 16 : 14,
    marginTop: 18,
  };

  const inputGroup: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const label: React.CSSProperties = {
    fontSize: isMobile ? 16 : 12,
    fontWeight: 900,
    letterSpacing: 0.3,
    color: "rgba(186,230,253,0.94)",
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    borderRadius: isMobile ? 18 : 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    padding: isMobile ? "16px 16px" : "13px 14px",
    fontSize: isMobile ? 16 : 14,
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const textareaWide: React.CSSProperties = {
    ...inputBase,
    minHeight: isMobile ? 110 : 112,
    resize: "vertical",
  };

  const fileWrap: React.CSSProperties = {
    border: "1px dashed rgba(56,189,248,0.35)",
    background: "rgba(8,47,73,0.22)",
    borderRadius: 20,
    padding: isMobile ? 16 : 16,
    marginTop: 16,
  };

  const submitWrap: React.CSSProperties = {
    display: "flex",
    alignItems: isMobile ? "stretch" : "center",
    justifyContent: "space-between",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? 16 : 14,
    marginTop: 18,
  };

  const submitBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "15px 22px" : "12px 18px",
    border: "1px solid rgba(34,197,94,0.45)",
    background: "rgba(34,197,94,0.12)",
    color: "rgba(187,247,208,1)",
    fontWeight: 900,
    fontSize: isMobile ? 19 : 14,
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(74,222,128,0.08)",
    width: isMobile ? "100%" : "auto",
  };

  const helperText: React.CSSProperties = {
    fontSize: isMobile ? 15 : 12,
    lineHeight: isMobile ? 1.4 : 1.6,
    color: "rgba(148,163,184,0.88)",
    maxWidth: 680,
  };

  const successPanel: React.CSSProperties = {
    marginTop: 18,
    border: "1px solid rgba(34,197,94,0.34)",
    background: "rgba(34,197,94,0.10)",
    borderRadius: 16,
    padding: 16,
    color: "rgba(220,252,231,1)",
    boxShadow: "0 0 22px rgba(74,222,128,0.06)",
  };

  const examplesLabel: React.CSSProperties = {
    marginTop: isMobile ? 28 : 24,
    fontWeight: 900,
    fontSize: isMobile ? 24 : 15,
    letterSpacing: isMobile ? -0.4 : 0.2,
    color: "#f8fafc",
    lineHeight: 1.06,
  };

  const featuredDemoCard: React.CSSProperties = {
    ...card,
    marginTop: 16,
    padding: isMobile ? 18 : 18,
    border: "1px solid rgba(250,204,21,0.30)",
    background:
      "linear-gradient(180deg, rgba(250,204,21,0.10), rgba(2,6,23,0.80) 30%, rgba(2,6,23,0.88) 100%)",
    cursor: "pointer",
  };

  const featuredDemoTop: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: isMobile ? 14 : 18,
    flexDirection: isMobile ? "column" : "row",
  };

  const featuredDemoTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 28 : 22,
    color: "#ffffff",
    lineHeight: 1.04,
    letterSpacing: isMobile ? -0.6 : -0.3,
  };

  const featuredDemoSubline: React.CSSProperties = {
    marginTop: 8,
    fontSize: isMobile ? 17 : 15,
    lineHeight: isMobile ? 1.42 : 1.6,
    color: "rgba(226,232,240,0.9)",
    maxWidth: 760,
  };

  const featuredDemoSupport: React.CSSProperties = {
    marginTop: 10,
    fontSize: isMobile ? 15 : 13,
    lineHeight: isMobile ? 1.42 : 1.55,
    color: "rgba(186,230,253,0.84)",
    maxWidth: 760,
  };

  const featuredDemoAction: React.CSSProperties = {
    ...primaryBtn,
    padding: isMobile ? "14px 18px" : "10px 14px",
    fontSize: isMobile ? 17 : 13,
    whiteSpace: "nowrap",
  };

  const featuredDemoBadgeRow: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 12,
  };

  const featuredDemoBadge: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "9px 14px" : "6px 10px",
    fontSize: isMobile ? 14 : 11,
    fontWeight: 900,
    border: "1px solid rgba(250,204,21,0.38)",
    color: "rgba(254,240,138,1)",
    background: "rgba(250,204,21,0.10)",
    letterSpacing: 0.4,
  };

  const featuredDemoSecondaryBadge: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "9px 14px" : "6px 10px",
    fontSize: isMobile ? 14 : 11,
    fontWeight: 900,
    border: "1px solid rgba(34,197,94,0.30)",
    color: "rgba(187,247,208,1)",
    background: "rgba(34,197,94,0.08)",
    letterSpacing: 0.4,
  };

  const featuredValueGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginTop: 16,
  };

  const featuredValueCard: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: isMobile ? 14 : 12,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
  };

  const examplesGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: isMobile ? 14 : 12,
    marginTop: 16,
  };

  const exampleCard: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.035)",
    borderRadius: 20,
    padding: isMobile ? 18 : "14px 16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? 12 : 8,
    boxShadow:
      "0 14px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)",
  };

  const tagStyle: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "9px 14px" : "6px 10px",
    fontSize: isMobile ? 14 : 11,
    fontWeight: 900,
    border: "1px solid rgba(250,204,21,0.40)",
    color: "rgba(254,240,138,1)",
    background: "rgba(250,204,21,0.10)",
    width: "fit-content",
  };

  const exampleTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 24 : 15,
    color: "#ffffff",
    lineHeight: 1.06,
  };

  const exampleSub: React.CSSProperties = {
    fontSize: isMobile ? 17 : 12,
    color: "rgba(226,232,240,0.76)",
    lineHeight: isMobile ? 1.42 : 1.5,
  };

  const footerWrap: React.CSSProperties = {
    marginTop: isMobile ? 32 : 30,
    paddingTop: isMobile ? 22 : 18,
    borderTop: "1px solid rgba(148,163,184,0.16)",
    textAlign: "center",
  };

  const footerPrimary: React.CSSProperties = {
    fontSize: isMobile ? 18 : 13,
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
    fontSize: isMobile ? 16 : 12,
    color: "rgba(148,163,184,0.72)",
    lineHeight: 1.45,
  };

  const footerPlanetMark: React.CSSProperties = {
    position: "relative",
    width: isMobile ? 22 : 16,
    height: isMobile ? 22 : 16,
    display: "inline-block",
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 35% 35%, #7dd3fc 0%, #38bdf8 45%, #1d4ed8 100%)",
    boxShadow: "0 0 10px rgba(56,189,248,0.45)",
    flexShrink: 0,
  };

  const footerPlanetRing: React.CSSProperties = {
    position: "absolute",
    left: isMobile ? -4 : -3,
    top: isMobile ? 8 : 6,
    width: isMobile ? 30 : 22,
    height: isMobile ? 9 : 7,
    border: "1.5px solid rgba(186,230,253,0.92)",
    borderRadius: "50%",
    transform: "rotate(-18deg)",
    opacity: 0.95,
    boxShadow: "0 0 6px rgba(125,211,252,0.25)",
    pointerEvents: "none",
  };

  const intentCards = [
    {
      id: "landing-page" as BuildIntent,
      title: "Landing Page",
      text: "Your front door. Clear offer. Intake ready.",
    },
    {
      id: "live-board" as BuildIntent,
      title: "Live Board",
      text: "Jobs. Status. Activity. All visible.",
    },
    {
      id: "workflow-tool" as BuildIntent,
      title: "Workflow Tool",
      text: "Built around how you already work.",
    },
    {
      id: "intake-flow" as BuildIntent,
      title: "Intake Flow",
      text: "Calls, texts, walk-ins into one system.",
    },
    {
      id: "payment-flow" as BuildIntent,
      title: "Payment Flow",
      text: "Job to payment to proof.",
    },
    {
      id: "full-system" as BuildIntent,
      title: "Full Business System",
      text: "Everything. One page. No switching.",
    },
  ];

  return (
    <div style={page}>
      <div style={shell}>
        <div style={hero}>
          <div style={livePill}>
            <span style={pulseDot} />
            BUILD MY BUSINESS SYSTEM
          </div>

          <div style={title}>Creator City</div>

          <div style={hook}>
            Your business is not complicated.
            <br />
            Your tools are.
          </div>

          <div style={subtext}>
            Start fast. Open a live example. Use a ready system. Or send your
            workflow and let HomePlanet remove the steps.
          </div>

          <div style={ctaRow}>
            <button style={primaryBtn} onClick={() => nav("/planet/start")}>
              Start My Board
            </button>

            <button
              style={secondaryBtn}
              onClick={() => nav(LIVE_PRODUCT_DEMO_ROUTE)}
            >
              See Live Example
            </button>

            <button style={secondaryBtn} onClick={scrollToReadySystems}>
              Use Ready System
            </button>

            <button
              style={secondaryBtn}
              onClick={() => nav("/planet/experience")}
            >
              Experience Planet
            </button>
          </div>

          <div style={quickGrid}>
            <div style={quickCard}>
              <div style={quickTitle}>Start your system</div>
              <div style={quickText}>
                Go straight into the board flow and build from intake forward.
              </div>
            </div>

            <div style={quickCard}>
              <div style={quickTitle}>See it working live</div>
              <div style={quickText}>
                Skip the explanation. Open a system that already shows the value.
              </div>
            </div>

            <div style={quickCard}>
              <div style={quickTitle}>Use a ready path</div>
              <div style={quickText}>
                Pick a live system that already fits what you are trying to do.
              </div>
            </div>
          </div>
        </div>

        <div style={sectionCard}>
          <div style={sectionTitle}>Tell us what you need built</div>
          <div style={sectionSub}>
            Fast intake. Direct wording. No extra story.
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

          {submitted ? (
            <div style={successPanel}>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>
                Creator City intake received ⚡
              </div>
              <div style={{ lineHeight: 1.7 }}>
                Your workflow request was sent into HomePlanet. It is now saved
                as a live intake path.
              </div>

              <div style={ctaRow}>
                <button
                  style={primaryBtn}
                  onClick={() => nav("/planet/pricing")}
                >
                  View Pricing
                </button>
                <button
                  style={secondaryBtn}
                  onClick={() => nav("/planet/start")}
                >
                  Open Start Flow
                </button>
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
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Taylor Creek Auto Repair"
                    required
                  />
                </div>

                <div style={inputGroup}>
                  <label style={label}>Business type</label>
                  <input
                    style={inputBase}
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="Auto Repair, Home Services, Cleaning..."
                    required
                  />
                </div>

                <div style={inputGroup}>
                  <label style={label}>City</label>
                  <input
                    style={inputBase}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Okeechobee"
                    required
                  />
                </div>

                <div style={inputGroup}>
                  <label style={label}>Email or preferred contact</label>
                  <input
                    style={inputBase}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="you@business.com"
                    required
                  />
                </div>

                <div style={{ ...inputGroup, gridColumn: "1 / -1" }}>
                  <label style={label}>How do you run jobs right now?</label>
                  <textarea
                    style={textareaWide}
                    value={currentWorkflow}
                    onChange={(e) => setCurrentWorkflow(e.target.value)}
                    placeholder="Paper tickets, texts, whiteboard, spreadsheets, another app..."
                    required
                  />
                </div>

                <div style={{ ...inputGroup, gridColumn: "1 / -1" }}>
                  <label style={label}>What wastes the most time?</label>
                  <textarea
                    style={textareaWide}
                    value={biggestFriction}
                    onChange={(e) => setBiggestFriction(e.target.value)}
                    placeholder="Calls for updates, lost notes, unclear stages, scheduling chaos, intake confusion..."
                    required
                  />
                </div>

                <div style={{ ...inputGroup, gridColumn: "1 / -1" }}>
                  <label style={label}>
                    What do customers keep asking about?
                  </label>
                  <textarea
                    style={textareaWide}
                    value={customerQuestions}
                    onChange={(e) => setCustomerQuestions(e.target.value)}
                    placeholder="Where am I in line? Is it ready? Did you get my request?"
                  />
                </div>

                <div style={{ ...inputGroup, gridColumn: "1 / -1" }}>
                  <label style={label}>
                    What would make you say “holy shit, this solves it”?
                  </label>
                  <textarea
                    style={textareaWide}
                    value={holyShiftMoment}
                    onChange={(e) => setHolyShiftMoment(e.target.value)}
                    placeholder="One board for status, team, customer updates, payment, and proof..."
                  />
                </div>
              </div>

              <div style={fileWrap}>
                <div style={label}>Upload photos of your workflow</div>
                <div
                  style={{
                    ...sectionSub,
                    marginTop: 8,
                    fontSize: isMobile ? 15 : 13,
                  }}
                >
                  Show the current mess. We use it to remove steps.
                </div>

                <div style={{ marginTop: 12 }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setWorkflowFiles(Array.from(e.target.files || []))
                    }
                    style={{ fontSize: isMobile ? 16 : 14 }}
                  />
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontSize: isMobile ? 15 : 12,
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
                  {submitting
                    ? "Sending business intake..."
                    : "Send business intake"}
                </button>

                <div style={helperText}>
                  One direct intake. Then we shape the right board, landing page,
                  workflow tool, payment path, or full business system.
                </div>
              </div>
            </form>
          )}
        </div>

        <div ref={readySystemsRef} style={examplesLabel}>
          Featured live system
        </div>

        <div
          style={featuredDemoCard}
          onClick={() => nav(LIVE_PRODUCT_DEMO_ROUTE)}
        >
          <div style={featuredDemoTop}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={featuredDemoBadgeRow}>
                <div style={featuredDemoBadge}>HIGH VALUE SYSTEM</div>
                <div style={featuredDemoSecondaryBadge}>LIVE SELLING</div>
              </div>

              <div style={featuredDemoTitle}>Live Product Selling Board</div>

              <div style={featuredDemoSubline}>
                Turn a live seller into a real-time buying event.
              </div>

              <div style={featuredDemoSupport}>
                Live video, buyer movement, reserve pressure, and proof-state in
                one board. This is not a flat product page. It is a revenue
                engine with visible momentum.
              </div>
            </div>

            <button
              type="button"
              style={featuredDemoAction}
              onClick={(e) => {
                e.stopPropagation();
                nav(LIVE_PRODUCT_DEMO_ROUTE);
              }}
            >
              View live selling demo
            </button>
          </div>

          <div style={featuredValueGrid}>
            <div style={featuredValueCard}>
              <div
                style={{
                  fontSize: isMobile ? 16 : 12,
                  fontWeight: 900,
                  color: "rgba(254,240,138,1)",
                  marginBottom: 6,
                  letterSpacing: 0.3,
                }}
              >
                LIVE VIDEO
              </div>
              <div
                style={{
                  fontSize: isMobile ? 18 : 14,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.08,
                  marginBottom: 6,
                }}
              >
                The seller becomes the event
              </div>
              <div
                style={{
                  fontSize: isMobile ? 15 : 12,
                  color: "rgba(226,232,240,0.76)",
                  lineHeight: 1.5,
                }}
              >
                The product is shown live instead of being buried in a dead listing.
              </div>
            </div>

            <div style={featuredValueCard}>
              <div
                style={{
                  fontSize: isMobile ? 16 : 12,
                  fontWeight: 900,
                  color: "rgba(187,247,208,1)",
                  marginBottom: 6,
                  letterSpacing: 0.3,
                }}
              >
                BUYER PRESSURE
              </div>
              <div
                style={{
                  fontSize: isMobile ? 18 : 14,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.08,
                  marginBottom: 6,
                }}
              >
                Reserve momentum stays visible
              </div>
              <div
                style={{
                  fontSize: isMobile ? 15 : 12,
                  color: "rgba(226,232,240,0.76)",
                  lineHeight: 1.5,
                }}
              >
                Watching count, low stock, and sold movement create urgency without fake gimmicks.
              </div>
            </div>

            <div style={featuredValueCard}>
              <div
                style={{
                  fontSize: isMobile ? 16 : 12,
                  fontWeight: 900,
                  color: "rgba(186,230,253,1)",
                  marginBottom: 6,
                  letterSpacing: 0.3,
                }}
              >
                PROOF STATE
              </div>
              <div
                style={{
                  fontSize: isMobile ? 18 : 14,
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1.08,
                  marginBottom: 6,
                }}
              >
                Current vs previous stays clear
              </div>
              <div
                style={{
                  fontSize: isMobile ? 15 : 12,
                  color: "rgba(226,232,240,0.76)",
                  lineHeight: 1.5,
                }}
              >
                The board can show what is current, what changed, and what happened live.
              </div>
            </div>
          </div>
        </div>

        <div style={examplesLabel}>Use a ready system</div>

        <div style={examplesGrid}>
          {systems.map((s) => (
            <div key={s.id} style={exampleCard} onClick={() => nav(s.to)}>
              <div style={tagStyle}>{s.tag}</div>
              <div style={exampleTitle}>{s.title}</div>
              <div style={exampleSub}>{s.subtitle}</div>
            </div>
          ))}
        </div>

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
  );
}