import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const REQUEST_ACCESS_URL =
  "https://kcmcssyyopmvqglsddyw.supabase.co";
const REQUEST_ACCESS_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbWNzc3l5b3BtdnFnbHNkZHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NjUwODUsImV4cCI6MjA4NDQ0MTA4NX0.OWjhyCAzhVkMfMrBL96FLjdUUlU51B8N3mKuBvqntt4";

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

  const systems = useMemo<SystemExample[]>(
    () => [
      {
        id: "awnit",
        title: "AWNIT Demo Service Board",
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
        title: "Restaurant Rush Live",
        subtitle: "See rush flow, kitchen movement, and workflow visibility.",
        to: "/planet/food/restaurant-rush-live",
        tag: "KITCHEN FLOW",
      },
      {
        id: "legal",
        title: "Legal Workspace Demo",
        subtitle: "See evidence, timeline structure, and proof-style organization.",
        to: "/planet/legal/joe-grant",
        tag: "WORKSPACE",
      },
    ],
    []
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
      alert("Creator City submission failed:\n" + (err?.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  }

  const page: React.CSSProperties = {
    minHeight: "100vh",
    padding: 24,
    color: "#e5e7eb",
    background:
      "radial-gradient(1000px 700px at 15% 10%, rgba(34,197,94,0.08), transparent 58%)," +
      "radial-gradient(1000px 700px at 85% 12%, rgba(56,189,248,0.08), transparent 58%)," +
      "radial-gradient(900px 800px at 50% 100%, rgba(168,85,247,0.06), transparent 52%)," +
      "#020617",
  };

  const shell: React.CSSProperties = {
    maxWidth: 1320,
    margin: "0 auto",
  };

  const hero: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.18)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 28%, rgba(2,6,23,0.42) 100%)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
  };

  const heroTop: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 20,
    flexWrap: "wrap",
  };

  const titleWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: 920,
  };

  const titleRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  };

  const title: React.CSSProperties = {
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: -0.5,
    lineHeight: 1.05,
  };

  const livePill: React.CSSProperties = {
    borderRadius: 999,
    padding: "7px 12px",
    border: "1px solid rgba(34,197,94,0.35)",
    background: "rgba(34,197,94,0.10)",
    color: "rgba(187,247,208,1)",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 0.5,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const pulseDot: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "rgba(74,222,128,1)",
    boxShadow: "0 0 10px rgba(74,222,128,0.8)",
  };

  const subtitle: React.CSSProperties = {
    fontSize: 16,
    lineHeight: 1.7,
    color: "rgba(226,232,240,0.92)",
    maxWidth: 960,
  };

  const doctrinePanel: React.CSSProperties = {
    marginTop: 6,
    maxWidth: 920,
    border: "1px solid rgba(56,189,248,0.18)",
    background: "rgba(8,47,73,0.24)",
    borderRadius: 16,
    padding: "14px 16px",
  };

  const doctrineTitle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    color: "rgba(186,230,253,0.96)",
    marginBottom: 6,
  };

  const doctrineText: React.CSSProperties = {
    fontSize: 13,
    lineHeight: 1.6,
    color: "rgba(226,232,240,0.92)",
  };

  const buttonRow: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  };

  const btnBase: React.CSSProperties = {
    borderRadius: 999,
    padding: "10px 16px",
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(2,6,23,0.55)",
    color: "#e5e7eb",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
  };

  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    border: "1px solid rgba(34,197,94,0.45)",
    color: "rgba(187,247,208,1)",
  };

  const topGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 16,
    marginTop: 18,
  };

  const sectionCard: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(2,6,23,0.56)",
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 14px 36px rgba(0,0,0,0.28)",
  };

  const sectionTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 18,
    marginBottom: 8,
  };

  const sectionText: React.CSSProperties = {
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(226,232,240,0.88)",
  };

  const intentGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 16,
  };

  const intentCard = (active: boolean): React.CSSProperties => ({
    border: active
      ? "1px solid rgba(34,197,94,0.42)"
      : "1px solid rgba(148,163,184,0.18)",
    background: active ? "rgba(34,197,94,0.10)" : "rgba(255,255,255,0.02)",
    borderRadius: 16,
    padding: 14,
    cursor: "pointer",
    minHeight: 108,
  });

  const intentTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 14,
    marginBottom: 6,
  };

  const intentText: React.CSSProperties = {
    fontSize: 12,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.82)",
  };

  const intakeGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginTop: 18,
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.64)",
    color: "#e5e7eb",
    padding: "13px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const inputGroup: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.4,
    color: "rgba(186,230,253,0.94)",
  };

  const textareaWide: React.CSSProperties = {
    ...inputBase,
    minHeight: 112,
    resize: "vertical",
  };

  const fileWrap: React.CSSProperties = {
    border: "1px dashed rgba(56,189,248,0.30)",
    background: "rgba(8,47,73,0.18)",
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
  };

  const fileMeta: React.CSSProperties = {
    marginTop: 10,
    fontSize: 12,
    color: "rgba(186,230,253,0.9)",
  };

  const submitWrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginTop: 18,
    flexWrap: "wrap",
  };

  const submitBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: "12px 18px",
    border: "1px solid rgba(34,197,94,0.45)",
    background: "rgba(34,197,94,0.12)",
    color: "rgba(187,247,208,1)",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
  };

  const helperText: React.CSSProperties = {
    fontSize: 12,
    lineHeight: 1.6,
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
  };

  const examplesLabel: React.CSSProperties = {
    marginTop: 26,
    fontWeight: 900,
    fontSize: 13,
    letterSpacing: 0.4,
    opacity: 0.9,
  };

  const examplesGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginTop: 14,
  };

  const exampleCard: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.20)",
    background: "rgba(2,6,23,0.52)",
    borderRadius: 16,
    padding: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  };

  const exampleTextWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minWidth: 0,
  };

  const exampleTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: 15,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const exampleSub: React.CSSProperties = {
    fontSize: 12,
    color: "rgba(226,232,240,0.76)",
    lineHeight: 1.5,
  };

  const tagStyle: React.CSSProperties = {
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 11,
    fontWeight: 900,
    border: "1px solid rgba(250,204,21,0.40)",
    color: "rgba(254,240,138,1)",
    background: "rgba(250,204,21,0.10)",
    flexShrink: 0,
  };

  const footerWrap: React.CSSProperties = {
    marginTop: 34,
    paddingTop: 18,
    borderTop: "1px solid rgba(148,163,184,0.16)",
    textAlign: "center",
  };

  const footerPrimary: React.CSSProperties = {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  };

  const footerSecondary: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(148,163,184,0.72)",
  };

  const footerPlanetMark: React.CSSProperties = {
    position: "relative",
    width: 16,
    height: 16,
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
    width: 22,
    height: 7,
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
      text: "A live front door for your business with clear offer, trust, and intake.",
    },
    {
      id: "live-board" as BuildIntent,
      title: "Live Board",
      text: "A customer-facing or team-facing board that shows jobs, stages, and activity.",
    },
    {
      id: "workflow-tool" as BuildIntent,
      title: "Workflow Tool",
      text: "A custom tool built around how your business already operates in real life.",
    },
    {
      id: "intake-flow" as BuildIntent,
      title: "Intake Flow",
      text: "Turn walk-ins, calls, texts, and paper tickets into one clean intake system.",
    },
    {
      id: "payment-flow" as BuildIntent,
      title: "Payment Flow",
      text: "Build a cleaner intake-to-payment path with clear proof and customer trust.",
    },
    {
      id: "full-system" as BuildIntent,
      title: "Full Business System",
      text: "Landing page, board, workflow, intake, visibility, and customer communication.",
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

              <div style={subtitle}>
                Don&apos;t build a website. Show us how your business actually
                works — what you use now, what slows you down, what customers
                keep calling about, and what kind of system you wish existed.
                HomePlanet turns that real-world workflow into a live system.
              </div>

              <div style={doctrinePanel}>
                <div style={doctrineTitle}>PRESENCE-FIRST • NOT SURVEILLANCE</div>
                <div style={doctrineText}>
                  Your data stays yours. HomePlanet is built to understand your
                  workflow, not exploit it. We do not expose your contact info
                  publicly, and we do not treat your business like ad inventory.
                  This intake exists to turn your real operation into a better
                  system.
                </div>
              </div>
            </div>

            <div style={buttonRow}>
              <button style={btnPrimary} onClick={() => nav("/planet/start")}>
                Start My Board
              </button>
              <button style={btnBase} onClick={() => nav("/planet/pricing")}>
                Pricing
              </button>
              <button style={btnBase} onClick={() => nav("/planet/creator/projects")}>
                Projects
              </button>
              <button style={btnBase} onClick={() => nav("/planet/creator/studio")}>
                Studio
              </button>
            </div>
          </div>

          <div style={topGrid}>
            <div style={sectionCard}>
              <div style={sectionTitle}>This is the holy-shit moment</div>
              <div style={sectionText}>
                The goal here is not to ask a business owner to pick from a
                template. The goal is to let them explain how they work now,
                where the friction is, what they wish customers could see, and
                what kind of system would make them say, “that&apos;s mine.” This
                is where a landing page, live board, workflow tool, or full
                operational system begins.
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
              <div style={sectionTitle}>What businesses can tell us here</div>
              <div style={sectionText}>
                “We still run on paper.” “Customers keep calling for updates.”
                “I need people to see where their job stands.” “I want the same
                board you showed me, but for my shop.” “I want to build my own
                tool from scratch.” Creator City is where those sentences get
                turned into structure.
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...sectionCard, marginTop: 18 }}>
          <div style={sectionTitle}>Describe your business workflow</div>
          <div style={sectionText}>
            Tell us what kind of business you run, how you organize now, what
            keeps falling through the cracks, and what kind of system you want
            us to bring to life.
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
                <button style={btnPrimary} onClick={() => nav("/planet/pricing")}>
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
                    placeholder="Auto Repair, Lawn, Awnings, Cleaning..."
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
                  <label style={label}>How do you organize jobs right now?</label>
                  <textarea
                    style={textareaWide}
                    value={currentWorkflow}
                    onChange={(e) => setCurrentWorkflow(e.target.value)}
                    placeholder="Paper tickets, texts, whiteboard, memory, spreadsheets, another app..."
                    required
                  />
                </div>

                <div style={{ ...inputGroup, gridColumn: "1 / -1" }}>
                  <label style={label}>What slows you down the most?</label>
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
                    placeholder="A live board, a customer-facing tracker, instant intake receipts, a route view, proof timeline..."
                  />
                </div>
              </div>

              <div style={fileWrap}>
                <div style={label}>Upload photos of your workflow</div>
                <div style={{ ...sectionText, marginTop: 8, fontSize: 13 }}>
                  Upload photos of whiteboards, paper tickets, intake forms,
                  screenshots, invoices, or anything that helps us understand
                  how your business really works.
                </div>

                <div style={{ marginTop: 12 }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setWorkflowFiles(Array.from(e.target.files || []))
                    }
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
                  {submitting ? "Sending business intake..." : "Send business intake"}
                </button>

                <div style={helperText}>
                  This sends your workflow description into HomePlanet through
                  the same live intake system you already built. We save it,
                  notify it, and use it to shape the right landing page, board,
                  tool, or full business system.
                </div>
              </div>
            </form>
          )}
        </div>

        <div style={examplesLabel}>See what&apos;s possible right now</div>

        <div style={examplesGrid}>
          {systems.map((s) => (
            <div key={s.id} style={exampleCard} onClick={() => nav(s.to)}>
              <div style={exampleTextWrap}>
                <div style={exampleTitle}>{s.title}</div>
                <div style={exampleSub}>{s.subtitle}</div>
              </div>
              <div style={tagStyle}>{s.tag}</div>
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
            Don&apos;t build a website. Show us how your business really works.
          </div>
        </div>
      </div>
    </div>
  );
}
