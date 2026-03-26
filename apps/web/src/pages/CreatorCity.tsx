import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const REQUEST_ACCESS_URL =
  "https://kcmcssyyopmvqglsddyw.supabase.co";
const REQUEST_ACCESS_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXMiJ9";

/**
 * Set this to your actual live-selling demo route if needed.
 * I kept it isolated to one constant so the CreatorCity page stays clean.
 */
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
          "See live ticket flow, ticket editing, manager controls, and kitchen visibility.",
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

      setSubmitted(true);
    } catch (err: any) {
      console.error("CREATOR CITY ERROR:", err?.message || err);
      alert(
        "Creator City submission failed:\n" + (err?.message || "Unknown error"),
      );
    } finally {
      setSubmitting(false);
    }
  }

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

  const hero: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.18)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 28%, rgba(2,6,23,0.42) 100%)",
    borderRadius: isMobile ? 28 : 24,
    padding: isMobile ? 18 : 24,
    boxShadow: "0 24px 80px rgba(0,0,0,0.42)",
    overflow: "hidden",
  };

  const heroTop: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: isMobile ? 14 : 20,
    flexWrap: "wrap",
  };

  const titleWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? 14 : 10,
    maxWidth: 980,
    width: "100%",
  };

  const titleRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  };

  const title: React.CSSProperties = {
    fontSize: isMobile ? 56 : 36,
    fontWeight: 900,
    letterSpacing: -1.4,
    lineHeight: isMobile ? 0.92 : 1.05,
    color: "#ffffff",
    textShadow: "0 1px 0 rgba(255,255,255,0.04)",
    maxWidth: "100%",
  };

  const livePill: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "10px 16px" : "7px 12px",
    border: "1px solid rgba(34,197,94,0.35)",
    background: "rgba(34,197,94,0.10)",
    color: "rgba(187,247,208,1)",
    fontWeight: 900,
    fontSize: isMobile ? 14 : 12,
    letterSpacing: isMobile ? 0.8 : 0.5,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    boxShadow: "0 0 18px rgba(74,222,128,0.14)",
    width: isMobile ? "fit-content" : "auto",
  };

  const pulseDot: React.CSSProperties = {
    width: isMobile ? 14 : 8,
    height: isMobile ? 14 : 8,
    borderRadius: 999,
    background: "rgba(74,222,128,1)",
    boxShadow: "0 0 12px rgba(74,222,128,0.9)",
    flexShrink: 0,
  };

  const subtitle: React.CSSProperties = {
    fontSize: isMobile ? 19 : 16,
    lineHeight: isMobile ? 1.45 : 1.7,
    color: "rgba(226,232,240,0.92)",
    maxWidth: 980,
  };

  const desktopSubHead: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 900,
    lineHeight: 1.08,
    letterSpacing: -0.6,
    color: "rgba(186,230,253,0.98)",
    marginTop: 2,
  };

  const mobileHeroTitle: React.CSSProperties = {
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 0.95,
    letterSpacing: -1.1,
    color: "#ffffff",
    marginTop: 2,
  };

  const mobileHeroSubline: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: -0.4,
    color: "rgba(186,230,253,0.98)",
    marginTop: -2,
  };

  const doctrinePanel: React.CSSProperties = {
    marginTop: isMobile ? 8 : 6,
    maxWidth: 980,
    border: "1px solid rgba(56,189,248,0.18)",
    background: "rgba(8,47,73,0.24)",
    borderRadius: 16,
    padding: isMobile ? "16px 16px" : "14px 16px",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  };

  const doctrineTitle: React.CSSProperties = {
    fontSize: isMobile ? 11 : 12,
    fontWeight: 900,
    letterSpacing: isMobile ? 0.9 : 0.6,
    color: "rgba(186,230,253,0.96)",
    marginBottom: 8,
  };

  const doctrineText: React.CSSProperties = {
    fontSize: isMobile ? 18 : 13,
    lineHeight: isMobile ? 1.48 : 1.6,
    color: "rgba(226,232,240,0.92)",
  };

  const buttonRow: React.CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: isMobile ? "flex-start" : "flex-end",
    width: isMobile ? "100%" : "auto",
    marginTop: isMobile ? 2 : 0,
  };

  const btnBase: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "14px 22px" : "10px 16px",
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(2,6,23,0.55)",
    color: "#e5e7eb",
    fontWeight: 800,
    fontSize: isMobile ? 18 : 13,
    cursor: "pointer",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
    minWidth: isMobile ? 0 : undefined,
  };

  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    border: "1px solid rgba(34,197,94,0.45)",
    color: "rgba(187,247,208,1)",
    boxShadow: "0 0 18px rgba(74,222,128,0.08)",
  };

  const mobilePrimaryCta: React.CSSProperties = {
    ...btnPrimary,
    width: "100%",
    justifyContent: "center",
    display: "inline-flex",
    alignItems: "center",
    padding: "16px 22px",
    fontSize: 22,
    letterSpacing: -0.3,
  };

  const topGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1.15fr 0.85fr",
    gap: isMobile ? 18 : 16,
    marginTop: isMobile ? 18 : 18,
  };

  const sectionCard: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.56)",
    borderRadius: isMobile ? 26 : 20,
    padding: isMobile ? 18 : 20,
    boxShadow:
      "0 18px 42px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const sectionTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 30 : 18,
    lineHeight: isMobile ? 1.02 : 1.1,
    marginBottom: isMobile ? 12 : 8,
    color: "#ffffff",
    textShadow: "0 1px 0 rgba(255,255,255,0.04)",
    letterSpacing: isMobile ? -0.7 : 0,
  };

  const sectionText: React.CSSProperties = {
    fontSize: isMobile ? 17 : 14,
    lineHeight: isMobile ? 1.42 : 1.7,
    color: "rgba(226,232,240,0.88)",
  };

  const impactPanel: React.CSSProperties = {
    marginTop: isMobile ? 14 : 16,
    border: "1px solid rgba(34,197,94,0.22)",
    background: "rgba(20,83,45,0.16)",
    borderRadius: isMobile ? 20 : 18,
    padding: isMobile ? 16 : 16,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const impactHeadline: React.CSSProperties = {
    fontSize: isMobile ? 22 : 16,
    fontWeight: 900,
    lineHeight: 1.08,
    color: "#ffffff",
    marginBottom: 6,
    letterSpacing: isMobile ? -0.4 : 0,
  };

  const impactText: React.CSSProperties = {
    fontSize: isMobile ? 16 : 13,
    lineHeight: isMobile ? 1.4 : 1.65,
    color: "rgba(220,252,231,0.92)",
  };

  const miniCompareGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? 12 : 12,
    marginTop: isMobile ? 16 : 16,
  };

  const compareCard = (kind: "before" | "after"): React.CSSProperties => ({
    border:
      kind === "before"
        ? "1px solid rgba(148,163,184,0.18)"
        : "1px solid rgba(34,197,94,0.24)",
    background:
      kind === "before"
        ? "rgba(255,255,255,0.02)"
        : "rgba(34,197,94,0.08)",
    borderRadius: 18,
    padding: isMobile ? 16 : 16,
  });

  const compareTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 20 : 14,
    marginBottom: isMobile ? 8 : 8,
    color: "#ffffff",
    lineHeight: 1.05,
  };

  const compareList: React.CSSProperties = {
    margin: 0,
    paddingLeft: isMobile ? 20 : 18,
    color: "rgba(226,232,240,0.86)",
    fontSize: isMobile ? 16 : 13,
    lineHeight: isMobile ? 1.45 : 1.7,
  };

  const intentGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: isMobile ? 14 : 12,
    marginTop: isMobile ? 16 : 16,
  };

  const intentCard = (active: boolean): React.CSSProperties => ({
    border: active
      ? "1px solid rgba(34,197,94,0.42)"
      : "1px solid rgba(148,163,184,0.18)",
    background: active ? "rgba(34,197,94,0.10)" : "rgba(255,255,255,0.02)",
    borderRadius: 20,
    padding: isMobile ? 18 : 14,
    cursor: "pointer",
    minHeight: isMobile ? 112 : 108,
    boxShadow: active
      ? "0 0 24px rgba(74,222,128,0.08)"
      : "0 0 18px rgba(34,211,238,0.03)",
  });

  const intentTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 22 : 14,
    marginBottom: isMobile ? 8 : 6,
    color: "#ffffff",
    lineHeight: 1.05,
    letterSpacing: isMobile ? -0.4 : 0,
  };

  const intentText: React.CSSProperties = {
    fontSize: isMobile ? 16 : 12,
    lineHeight: isMobile ? 1.35 : 1.5,
    color: "rgba(226,232,240,0.82)",
  };

  const intakeGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: isMobile ? 16 : 14,
    marginTop: isMobile ? 18 : 18,
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    borderRadius: isMobile ? 18 : 14,
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.64)",
    color: "#e5e7eb",
    padding: isMobile ? "16px 16px" : "13px 14px",
    fontSize: isMobile ? 17 : 14,
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
  };

  const inputGroup: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? 8 : 8,
  };

  const label: React.CSSProperties = {
    fontSize: isMobile ? 17 : 12,
    fontWeight: 900,
    letterSpacing: isMobile ? 0.2 : 0.4,
    color: "rgba(186,230,253,0.94)",
  };

  const textareaWide: React.CSSProperties = {
    ...inputBase,
    minHeight: isMobile ? 110 : 112,
    resize: "vertical",
  };

  const fileWrap: React.CSSProperties = {
    border: "1px dashed rgba(56,189,248,0.30)",
    background: "rgba(8,47,73,0.18)",
    borderRadius: 20,
    padding: isMobile ? 16 : 16,
    marginTop: isMobile ? 16 : 14,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const fileMeta: React.CSSProperties = {
    marginTop: 10,
    fontSize: isMobile ? 16 : 12,
    color: "rgba(186,230,253,0.9)",
  };

  const submitWrap: React.CSSProperties = {
    display: "flex",
    alignItems: isMobile ? "stretch" : "center",
    justifyContent: "space-between",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? 16 : 14,
    marginTop: isMobile ? 20 : 18,
    flexWrap: "wrap",
  };

  const submitBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "15px 22px" : "12px 18px",
    border: "1px solid rgba(34,197,94,0.45)",
    background: "rgba(34,197,94,0.12)",
    color: "rgba(187,247,208,1)",
    fontWeight: 900,
    fontSize: isMobile ? 20 : 14,
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(74,222,128,0.08)",
    width: isMobile ? "100%" : "auto",
  };

  const helperText: React.CSSProperties = {
    fontSize: isMobile ? 16 : 12,
    lineHeight: isMobile ? 1.45 : 1.6,
    color: "rgba(148,163,184,0.88)",
    maxWidth: 680,
  };

  const successPanel: React.CSSProperties = {
    marginTop: 18,
    border: "1px solid rgba(34,197,94,0.32)",
    background: "rgba(34,197,94,0.08)",
    borderRadius: 16,
    padding: 16,
    color: "rgba(220,252,231,1)",
    boxShadow: "0 0 22px rgba(74,222,128,0.06)",
  };

  const examplesLabel: React.CSSProperties = {
    marginTop: isMobile ? 34 : 26,
    fontWeight: 900,
    fontSize: isMobile ? 24 : 13,
    letterSpacing: isMobile ? -0.4 : 0.4,
    opacity: 0.98,
    color: "#f8fafc",
    lineHeight: 1.05,
  };

  const featuredDemoCard: React.CSSProperties = {
    marginTop: isMobile ? 18 : 16,
    border: "1px solid rgba(250,204,21,0.26)",
    background:
      "linear-gradient(180deg, rgba(250,204,21,0.08), rgba(2,6,23,0.66) 22%, rgba(2,6,23,0.74) 100%)",
    borderRadius: isMobile ? 24 : 22,
    padding: isMobile ? 18 : 18,
    cursor: "pointer",
    boxShadow:
      "0 18px 40px rgba(0,0,0,0.28), 0 0 28px rgba(250,204,21,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
    overflow: "hidden",
  };

  const featuredDemoTop: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: isMobile ? 14 : 18,
    flexDirection: isMobile ? "column" : "row",
  };

  const featuredDemoTextWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? 10 : 8,
    minWidth: 0,
    flex: 1,
  };

  const featuredDemoBadgeRow: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
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

  const featuredDemoTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 30 : 22,
    color: "#ffffff",
    lineHeight: isMobile ? 1.02 : 1.06,
    letterSpacing: isMobile ? -0.7 : -0.35,
  };

  const featuredDemoSubline: React.CSSProperties = {
    fontSize: isMobile ? 18 : 15,
    lineHeight: isMobile ? 1.42 : 1.65,
    color: "rgba(226,232,240,0.90)",
    maxWidth: 760,
  };

  const featuredDemoSupport: React.CSSProperties = {
    fontSize: isMobile ? 16 : 13,
    lineHeight: isMobile ? 1.42 : 1.55,
    color: "rgba(186,230,253,0.84)",
    maxWidth: 760,
  };

  const featuredDemoAction: React.CSSProperties = {
    ...btnPrimary,
    padding: isMobile ? "14px 18px" : "10px 14px",
    fontSize: isMobile ? 17 : 13,
    whiteSpace: "nowrap",
  };

  const featuredDemoGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
    gap: isMobile ? 16 : 16,
    marginTop: isMobile ? 16 : 16,
  };

  const featuredPreviewShell: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: isMobile ? 20 : 18,
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.74), rgba(2,6,23,0.84))",
    padding: isMobile ? 14 : 14,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const featuredPreviewTop: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 10,
  };

  const featuredPreviewVideo: React.CSSProperties = {
    minHeight: isMobile ? 170 : 188,
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.16)",
    background:
      "radial-gradient(circle at 40% 28%, rgba(56,189,248,0.16), transparent 32%), linear-gradient(180deg, rgba(30,41,59,0.96), rgba(15,23,42,0.92))",
    padding: 12,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const featuredPreviewPillRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  };

  const previewTinyPill = (kind: "live" | "neutral" | "warn"): React.CSSProperties => ({
    borderRadius: 999,
    padding: "5px 8px",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 0.3,
    border:
      kind === "live"
        ? "1px solid rgba(34,197,94,0.28)"
        : kind === "warn"
          ? "1px solid rgba(250,204,21,0.30)"
          : "1px solid rgba(148,163,184,0.18)",
    color:
      kind === "live"
        ? "rgba(187,247,208,1)"
        : kind === "warn"
          ? "rgba(254,240,138,1)"
          : "rgba(226,232,240,0.88)",
    background:
      kind === "live"
        ? "rgba(34,197,94,0.08)"
        : kind === "warn"
          ? "rgba(250,204,21,0.08)"
          : "rgba(255,255,255,0.03)",
  });

  const featuredPreviewCenter: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 8,
    flex: 1,
    textAlign: "center",
  };

  const playCircle: React.CSSProperties = {
    width: isMobile ? 50 : 56,
    height: isMobile ? 50 : 56,
    borderRadius: "50%",
    border: "1px solid rgba(148,163,184,0.20)",
    background: "rgba(2,6,23,0.46)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: isMobile ? 20 : 22,
    boxShadow: "0 0 18px rgba(56,189,248,0.08)",
  };

  const featuredPreviewBottomGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 8,
    marginTop: 10,
  };

  const previewMiniBox: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(255,255,255,0.03)",
    padding: "8px 9px",
  };

  const featuredPreviewSide: React.CSSProperties = {
    minHeight: isMobile ? 170 : 188,
    borderRadius: 16,
    border: "1px solid rgba(250,204,21,0.18)",
    background:
      "linear-gradient(180deg, rgba(250,204,21,0.06), rgba(15,23,42,0.92) 34%, rgba(2,6,23,0.92))",
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const featuredPreviewPriceRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "flex-start",
  };

  const featuredPreviewStatRow: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 8,
  };

  const featuredValueGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: isMobile ? 10 : 10,
  };

  const featuredValueCard: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(255,255,255,0.03)",
    padding: isMobile ? 14 : 12,
  };

  const examplesGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: isMobile ? 16 : 12,
    marginTop: isMobile ? 18 : 14,
  };

  const exampleCard: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.20)",
    background: "rgba(2,6,23,0.52)",
    borderRadius: 20,
    padding: isMobile ? 22 : "14px 16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: isMobile ? 14 : 8,
    width: "100%",
    maxWidth: "100%",
    boxShadow:
      "0 0 18px rgba(34,211,238,0.03), inset 0 1px 0 rgba(255,255,255,0.02)",
  };

  const exampleTextWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    minWidth: 0,
    width: "100%",
  };

  const exampleTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 25 : 15,
    whiteSpace: "normal",
    overflow: "visible",
    textOverflow: "clip",
    color: "#ffffff",
    lineHeight: 1.08,
    letterSpacing: isMobile ? -0.5 : 0,
  };

  const exampleSub: React.CSSProperties = {
    fontSize: isMobile ? 18 : 12,
    color: "rgba(226,232,240,0.76)",
    lineHeight: isMobile ? 1.45 : 1.5,
  };

  const tagStyle: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "10px 16px" : "6px 10px",
    fontSize: isMobile ? 16 : 11,
    fontWeight: 900,
    border: "1px solid rgba(250,204,21,0.40)",
    color: "rgba(254,240,138,1)",
    background: "rgba(250,204,21,0.10)",
    flexShrink: 0,
    alignSelf: "flex-start",
    marginTop: isMobile ? 0 : 2,
  };

  const footerWrap: React.CSSProperties = {
    marginTop: isMobile ? 34 : 34,
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
      text: "Calls, texts, walk-ins → one system.",
    },
    {
      id: "payment-flow" as BuildIntent,
      title: "Payment Flow",
      text: "Job → payment → proof.",
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
          <div style={heroTop}>
            <div style={titleWrap}>
              <div style={titleRow}>
                <div style={title}>Creator City</div>
                <div style={livePill}>
                  <span style={pulseDot} />
                  BUILD MY BUSINESS SYSTEM
                </div>
              </div>

              {isMobile ? (
                <>
                  <div style={mobileHeroTitle}>
                    Your business is not complicated.
                    <br />
                    Your tools are.
                  </div>

                  <div style={mobileHeroSubline}>
                    You shouldn&apos;t need 5 apps
                    <br />
                    and 10 clicks to do one job.
                  </div>

                  <button
                    style={mobilePrimaryCta}
                    onClick={() => nav("/planet/start")}
                  >
                    Start My Board
                  </button>

                  <div style={subtitle}>
                    HomePlanet turns your real workflow into one live page.
                    Show us how your business actually works, where the friction
                    is, and what should happen in one click instead of ten.
                  </div>
                </>
              ) : (
                <>
                  <div style={desktopSubHead}>
                    Your business is not complicated. Your tools are.
                  </div>
                  <div style={subtitle}>
                    You shouldn&apos;t need 5 apps and 10 clicks just to do one
                    job. HomePlanet turns your real workflow into one live page
                    so jobs, status, customer updates, payment, and proof live
                    together instead of across tabs, texts, and scattered tools.
                  </div>
                </>
              )}

              <div style={doctrinePanel}>
                <div style={doctrineTitle}>
                  PRESENCE-FIRST • ONE PAGE • REMOVE STEPS
                </div>
                <div style={doctrineText}>
                  If it takes more than one click, your system is broken.
                  HomePlanet is built to remove wasted motion, not add more
                  layers. Your business should not require five different apps,
                  repeated entry, hidden tabs, and constant status chasing just
                  to move one job forward.
                </div>
              </div>
            </div>

            {!isMobile && (
              <div style={buttonRow}>
                <button style={btnPrimary} onClick={() => nav("/planet/start")}>
                  Start My Board
                </button>
                <button style={btnBase} onClick={() => nav("/planet/pricing")}>
                  Pricing
                </button>
                <button
                  style={btnBase}
                  onClick={() => nav("/planet/creator/projects")}
                >
                  Projects
                </button>
                <button
                  style={btnBase}
                  onClick={() => nav("/planet/creator/studio")}
                >
                  Studio
                </button>
              </div>
            )}

            {isMobile && (
              <div style={{ ...buttonRow, marginTop: 14 }}>
                <button style={btnBase} onClick={() => nav("/planet/pricing")}>
                  Pricing
                </button>
                <button
                  style={btnBase}
                  onClick={() => nav("/planet/creator/projects")}
                >
                  Projects
                </button>
                <button
                  style={btnBase}
                  onClick={() => nav("/planet/creator/studio")}
                >
                  Studio
                </button>
              </div>
            )}
          </div>

          <div style={topGrid}>
            <div style={sectionCard}>
              <div style={sectionTitle}>This is the holy-shit moment</div>
              <div style={sectionText}>
                Not because it looks cool.
                <br />
                Because it makes you realize how much time you&apos;ve been
                wasting.
                <br />
                <br />
                Open board. Tap once. Done.
              </div>

              <div style={impactPanel}>
                <div style={impactHeadline}>
                  We don&apos;t add features.
                  <br />
                  We remove steps.
                </div>
                <div style={impactText}>
                  Show us your workflow.
                  <br />
                  We turn it into one page.
                </div>
              </div>

              <div style={intentGrid}>
                {intentCards.map((card) => (
                  <div
                    key={card.id}
                    style={intentCard(wantsBuilt === card.id)}
                    onClick={() => setWantsBuilt(card.id)}
                  >
                    <div style={intentTitle}>{card.title}</div>
                    <div style={intentText}>{card.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={sectionCard}>
              <div style={sectionTitle}>What businesses feel immediately</div>
              <div style={sectionText}>
                You are not broken. Your workflow is. If your team has to jump
                between apps, repeat steps, re-enter the same info, or chase
                status across calls and texts, that friction is costing you time
                every single day.
              </div>

              <div style={miniCompareGrid}>
                <div style={compareCard("before")}>
                  <div style={compareTitle}>Before</div>
                  <ul style={compareList}>
                    <li>Calls for updates</li>
                    <li>Texts everywhere</li>
                    <li>Paper + side notes</li>
                    <li>&quot;Where is it?&quot;</li>
                    <li>&quot;Did we send it?&quot;</li>
                  </ul>
                </div>

                <div style={compareCard("after")}>
                  <div style={compareTitle}>After — one page</div>
                  <ul style={compareList}>
                    <li>Jobs visible</li>
                    <li>Status visible</li>
                    <li>Customer sees it</li>
                    <li>Team sees it</li>
                    <li>Payment + proof attached</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...sectionCard, marginTop: isMobile ? 20 : 18 }}>
          <div style={sectionTitle}>Describe your business workflow</div>
          <div style={sectionText}>
            Show us how your business actually works.
            <br />
            We&apos;ll remove the steps.
          </div>

          {submitted ? (
            <div style={successPanel}>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>
                Creator City intake received ⚡
              </div>
              <div style={{ lineHeight: 1.7 }}>
                Your business workflow request was sent into HomePlanet. We
                saved it, emailed it, and kicked back an auto-reply. This is
                now a live intake path.
              </div>

              <div style={buttonRow}>
                <button
                  style={btnPrimary}
                  onClick={() => nav("/planet/pricing")}
                >
                  View Pricing
                </button>
                <button style={btnBase} onClick={() => nav("/planet/start")}>
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
                    placeholder="Paper tickets, texts, whiteboard, memory, spreadsheets, another app..."
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
                    What do customers keep asking, texting, or calling about?
                  </label>
                  <textarea
                    style={textareaWide}
                    value={customerQuestions}
                    onChange={(e) => setCustomerQuestions(e.target.value)}
                    placeholder="Where am I in line? Is the job ready? Did you receive my request? When are you coming out?"
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
                    placeholder="One tap to update the customer, one board for the team, one place for status, notes, payment, and proof..."
                  />
                </div>
              </div>

              <div style={fileWrap}>
                <div style={label}>Upload photos of your workflow</div>
                <div
                  style={{
                    ...sectionText,
                    marginTop: 8,
                    fontSize: isMobile ? 16 : 13,
                  }}
                >
                  Upload anything that shows how you work today.
                  <br />
                  We use it to remove steps.
                </div>

                <div style={{ marginTop: 12 }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setWorkflowFiles(Array.from(e.target.files || []))
                    }
                    style={{ fontSize: isMobile ? 17 : 14 }}
                  />
                </div>

                <div style={fileMeta}>{selectedFilesLabel}</div>
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
                  This sends your workflow description into HomePlanet through
                  the same live intake system you already built. We use it to
                  shape the right one-page landing page, board, tool, intake
                  path, payment flow, or full business system.
                </div>
              </div>
            </form>
          )}
        </div>

        <div style={examplesLabel}>See what&apos;s possible right now</div>

        <div
          style={featuredDemoCard}
          onClick={() => nav(LIVE_PRODUCT_DEMO_ROUTE)}
        >
          <div style={featuredDemoTop}>
            <div style={featuredDemoTextWrap}>
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

          <div style={featuredDemoGrid}>
            <div style={featuredPreviewShell}>
              <div style={featuredPreviewTop}>
                <div style={featuredPreviewVideo}>
                  <div style={featuredPreviewPillRow}>
                    <div style={previewTinyPill("live")}>LIVE</div>
                    <div style={previewTinyPill("neutral")}>83 watching</div>
                  </div>

                  <div style={featuredPreviewCenter}>
                    <div style={playCircle}>▶</div>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: isMobile ? 18 : 15,
                        color: "#ffffff",
                        lineHeight: 1.08,
                      }}
                    >
                      Seller live demo in motion
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? 14 : 12,
                        color: "rgba(226,232,240,0.74)",
                        lineHeight: 1.45,
                        maxWidth: 260,
                      }}
                    >
                      Show the product live while buyer activity builds on the
                      same page.
                    </div>
                  </div>

                  <div style={featuredPreviewBottomGrid}>
                    <div style={previewMiniBox}>
                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(148,163,184,0.88)",
                          marginBottom: 4,
                          fontWeight: 900,
                        }}
                      >
                        LIVE ANGLE
                      </div>
                      <div style={{ fontSize: 11, color: "#e5e7eb" }}>
                        Product demo
                      </div>
                    </div>
                    <div style={previewMiniBox}>
                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(148,163,184,0.88)",
                          marginBottom: 4,
                          fontWeight: 900,
                        }}
                      >
                        BUILDER NOTE
                      </div>
                      <div style={{ fontSize: 11, color: "#e5e7eb" }}>
                        Showing current setup
                      </div>
                    </div>
                    <div style={previewMiniBox}>
                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(148,163,184,0.88)",
                          marginBottom: 4,
                          fontWeight: 900,
                        }}
                      >
                        SALE STATE
                      </div>
                      <div style={{ fontSize: 11, color: "#e5e7eb" }}>
                        Buy or reserve live
                      </div>
                    </div>
                  </div>
                </div>

                <div style={featuredPreviewSide}>
                  <div style={featuredPreviewPillRow}>
                    <div style={previewTinyPill("neutral")}>FEATURED MODEL</div>
                    <div style={previewTinyPill("warn")}>HOT ITEM</div>
                  </div>

                  <div style={featuredPreviewPriceRow}>
                    <div>
                      <div
                        style={{
                          fontSize: isMobile ? 20 : 18,
                          fontWeight: 900,
                          color: "#ffffff",
                          lineHeight: 1.06,
                        }}
                      >
                        Custom Seller Item
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          color: "rgba(226,232,240,0.74)",
                          lineHeight: 1.45,
                        }}
                      >
                        Generic wrapper for live commerce demos inside Creator
                        City.
                      </div>
                    </div>

                    <div style={previewTinyPill("warn")}>LOW STOCK</div>
                  </div>

                  <div
                    style={{
                      fontSize: isMobile ? 28 : 24,
                      fontWeight: 900,
                      color: "#ffffff",
                      lineHeight: 1.02,
                    }}
                  >
                    $1,495
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(226,232,240,0.82)",
                      lineHeight: 1.5,
                    }}
                  >
                    Tight stock, live video, fast reserve path, and visible buyer
                    pressure.
                  </div>

                  <div style={featuredPreviewStatRow}>
                    <div style={previewMiniBox}>
                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(148,163,184,0.88)",
                          marginBottom: 4,
                          fontWeight: 900,
                        }}
                      >
                        STOCK
                      </div>
                      <div style={{ fontSize: 12, color: "#ffffff" }}>2</div>
                    </div>
                    <div style={previewMiniBox}>
                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(148,163,184,0.88)",
                          marginBottom: 4,
                          fontWeight: 900,
                        }}
                      >
                        WATCHING
                      </div>
                      <div style={{ fontSize: 12, color: "#ffffff" }}>34</div>
                    </div>
                    <div style={previewMiniBox}>
                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(148,163,184,0.88)",
                          marginBottom: 4,
                          fontWeight: 900,
                        }}
                      >
                        SOLD TODAY
                      </div>
                      <div style={{ fontSize: 12, color: "#ffffff" }}>5</div>
                    </div>
                  </div>
                </div>
              </div>
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
                  The product is shown live instead of being buried in a dead
                  listing.
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
                  Watching count, low stock, and sold movement create urgency
                  without fake gimmicks.
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
                  The board can show what is current, what changed, and what
                  happened live.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={examplesGrid}>
          {systems.map((s) => (
            <div key={s.id} style={exampleCard} onClick={() => nav(s.to)}>
              <div style={tagStyle}>{s.tag}</div>

              <div style={exampleTextWrap}>
                <div style={exampleTitle}>{s.title}</div>
                <div style={exampleSub}>{s.subtitle}</div>
              </div>
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