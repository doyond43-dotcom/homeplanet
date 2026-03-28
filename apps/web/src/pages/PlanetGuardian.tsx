import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type GuardianCategory = "pets" | "children" | "elderly" | "medical";

type PresenceStatus = "safe" | "active" | "attention" | "alert";

type HouseholdMember = {
  id: string;
  name: string;
  role: string;
  category: GuardianCategory;
  status: PresenceStatus;
  location: string;
  detail: string;
  lastSeen: string;
  actionLabel: string;
};

type GuardianUseCase = {
  id: string;
  title: string;
  label: string;
  description: string;
  bullets: string[];
};

type DemoCard = {
  id: string;
  label: string;
  title: string;
  description: string;
  cta: string;
  to?: string;
  featured?: boolean;
};

type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
  tone: PresenceStatus;
};

export default function PlanetGuardian() {
  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<GuardianCategory>("pets");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const householdMembers = useMemo<HouseholdMember[]>(
    () => [
      {
        id: "mom",
        name: "Mom",
        role: "Household anchor",
        category: "children",
        status: "safe",
        location: "Home",
        detail: "Phone present. Normal movement pattern.",
        lastSeen: "Live now",
        actionLabel: "View household state",
      },
      {
        id: "child",
        name: "Maya",
        role: "Child safety layer",
        category: "children",
        status: "active",
        location: "School",
        detail: "Checked in. Dismissal window approaching.",
        lastSeen: "2m ago",
        actionLabel: "View school timeline",
      },
      {
        id: "bella",
        name: "Bella",
        role: "Pet Guardian demo",
        category: "pets",
        status: "safe",
        location: "Neighbor scan zone",
        detail: "Tag active. Last scan visible. Owner contact ready.",
        lastSeen: "7m ago",
        actionLabel: "Open Bella demo",
      },
      {
        id: "grandpa",
        name: "Grandpa Joe",
        role: "Elder safety layer",
        category: "elderly",
        status: "attention",
        location: "Living room",
        detail: "No movement pattern change yet, but check-in window nearing.",
        lastSeen: "18m ago",
        actionLabel: "Review response flow",
      },
      {
        id: "medical",
        name: "Medical profile",
        role: "Emergency identity layer",
        category: "medical",
        status: "active",
        location: "Ready",
        detail: "Emergency context can speak on behalf of the person when needed.",
        lastSeen: "Prepared",
        actionLabel: "View emergency layer",
      },
    ],
    [],
  );

  const categoryCards = useMemo<GuardianUseCase[]>(
    () => [
      {
        id: "pets",
        label: "PETS",
        title: "Pet Guardian",
        description:
          "A live rescue layer for pets with instant scan-to-contact, care history, and neighborhood visibility.",
        bullets: [
          "QR tag → instant contact",
          "Bella public demo flow",
          "Finder report + rescue radar",
        ],
      },
      {
        id: "children",
        label: "CHILDREN",
        title: "Child Guardian",
        description:
          "A live awareness layer for safe zones, movement windows, pickup clarity, and family reassurance.",
        bullets: [
          "Safe-zone awareness",
          "Last movement visibility",
          "Household-active panel",
        ],
      },
      {
        id: "elderly",
        label: "ELDERLY",
        title: "Elder Guardian",
        description:
          "A presence-based safety layer for inactivity, disorientation risk, and fast response when something feels off.",
        bullets: [
          "Inactivity detection",
          "Response timeline replay",
          "Return-to-safety context",
        ],
      },
      {
        id: "medical",
        label: "MEDICAL",
        title: "Medical Guardian",
        description:
          "Emergency context that can identify the person, provide essential information, and speak when they cannot.",
        bullets: [
          "Identity + context ready",
          "Emergency response assist",
          "Speak-on-behalf support",
        ],
      },
    ],
    [],
  );

  const selectedUseCase =
    categoryCards.find((item) => item.id === selectedCategory) ??
    categoryCards[0];

  const demoCards = useMemo<DemoCard[]>(
    () => [
      {
        id: "household",
        label: "LIVE SYSTEM VIEW",
        title: "Household Active",
        description:
          "See the full Guardian idea the right way: everyone who matters inside one calm, readable awareness panel.",
        cta: "View household concept",
        to: "/planet/guardian-household",
        featured: true,
      },
      {
        id: "bella",
        label: "PET DEMO",
        title: "Bella Pet Tag Demo",
        description:
          "Public-facing pet rescue flow with scan-to-contact, finder actions, and care timeline visibility.",
        cta: "Open Bella demo",
        to: "/planet/guardian-pet",
      },
      {
        id: "response",
        label: "EMERGENCY FLOW",
        title: "Response Timeline Layer",
        description:
          "See how Guardian should handle last-seen context, presence trail, and response-ready truth.",
        cta: "View response concept",
      },
    ],
    [],
  );

  const responseTimeline = useMemo<TimelineEvent[]>(
    () => [
      {
        id: "t1",
        time: "2:08 PM",
        title: "Normal presence confirmed",
        detail: "Household member visible in expected zone with normal pattern.",
        tone: "safe",
      },
      {
        id: "t2",
        time: "2:17 PM",
        title: "Pattern changed",
        detail: "Movement slowed / expected interaction window was missed.",
        tone: "attention",
      },
      {
        id: "t3",
        time: "2:21 PM",
        title: "Guardian escalates context",
        detail: "Last location, timeline, identity, and response context are surfaced together.",
        tone: "active",
      },
      {
        id: "t4",
        time: "2:23 PM",
        title: "Emergency assist ready",
        detail: "Guardian can now support contact, return-to-safety, and speak-on-behalf flow.",
        tone: "alert",
      },
    ],
    [],
  );

  const page: React.CSSProperties = {
    minHeight: "100vh",
    color: "#e5e7eb",
    background:
      "radial-gradient(1100px 720px at 6% 4%, rgba(34,197,94,0.08), transparent 45%)," +
      "radial-gradient(920px 720px at 100% 2%, rgba(56,189,248,0.10), transparent 42%)," +
      "radial-gradient(1000px 820px at 50% 100%, rgba(59,130,246,0.10), transparent 48%)," +
      "#04070c",
    padding: isMobile ? "14px 14px 28px" : "24px",
  };

  const shell: React.CSSProperties = {
    maxWidth: 1320,
    margin: "0 auto",
  };

  const hero: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: isMobile ? 28 : 24,
    padding: isMobile ? 18 : 24,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015) 26%, rgba(2,6,23,0.56) 100%)",
    boxShadow:
      "0 24px 80px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)",
    overflow: "hidden",
  };

  const heroTop: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: isMobile ? 14 : 18,
    flexWrap: "wrap",
  };

  const titleWrap: React.CSSProperties = {
    maxWidth: 960,
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? 10 : 8,
  };

  const titleRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  };

  const title: React.CSSProperties = {
    fontSize: isMobile ? 46 : 36,
    fontWeight: 900,
    letterSpacing: -1.2,
    lineHeight: isMobile ? 0.95 : 1.02,
    color: "#ffffff",
  };

  const livePill: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "9px 14px" : "7px 11px",
    border: "1px solid rgba(34,197,94,0.28)",
    background: "rgba(34,197,94,0.10)",
    color: "rgba(187,247,208,1)",
    fontWeight: 900,
    fontSize: isMobile ? 13 : 11,
    letterSpacing: 0.4,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const pulseDot: React.CSSProperties = {
    width: isMobile ? 11 : 8,
    height: isMobile ? 11 : 8,
    borderRadius: 999,
    background: "rgba(74,222,128,1)",
    boxShadow: "0 0 14px rgba(74,222,128,0.82)",
    flexShrink: 0,
  };

  const heroLead: React.CSSProperties = {
    fontSize: isMobile ? 28 : 24,
    fontWeight: 900,
    lineHeight: isMobile ? 1.03 : 1.08,
    color: "#ffffff",
    letterSpacing: isMobile ? -0.6 : -0.4,
    maxWidth: 760,
  };

  const heroSubline: React.CSSProperties = {
    fontSize: isMobile ? 18 : 15,
    lineHeight: isMobile ? 1.42 : 1.65,
    color: "rgba(226,232,240,0.9)",
    maxWidth: 920,
  };

  const doctrinePanel: React.CSSProperties = {
    marginTop: isMobile ? 8 : 10,
    border: "1px solid rgba(56,189,248,0.16)",
    background: "rgba(8,47,73,0.22)",
    borderRadius: 18,
    padding: isMobile ? "15px 15px" : "14px 16px",
  };

  const doctrineTitle: React.CSSProperties = {
    fontSize: isMobile ? 11 : 11,
    fontWeight: 900,
    letterSpacing: 0.7,
    color: "rgba(186,230,253,0.98)",
    marginBottom: 7,
  };

  const doctrineText: React.CSSProperties = {
    fontSize: isMobile ? 16 : 13,
    lineHeight: isMobile ? 1.42 : 1.62,
    color: "rgba(226,232,240,0.9)",
  };

  const heroActions: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  };

  const buttonBase: React.CSSProperties = {
    borderRadius: 999,
    padding: isMobile ? "13px 18px" : "10px 14px",
    fontSize: isMobile ? 16 : 13,
    fontWeight: 900,
    cursor: "pointer",
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.52)",
    color: "#e5e7eb",
  };

  const buttonPrimary: React.CSSProperties = {
    ...buttonBase,
    border: "1px solid rgba(34,197,94,0.34)",
    background: "rgba(34,197,94,0.11)",
    color: "rgba(187,247,208,1)",
    boxShadow: "0 0 18px rgba(74,222,128,0.08)",
  };

  const gridTop: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1.16fr 0.84fr",
    gap: isMobile ? 18 : 16,
    marginTop: isMobile ? 18 : 18,
  };

  const sectionCard: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: isMobile ? 26 : 22,
    padding: isMobile ? 18 : 20,
    background: "rgba(2,6,23,0.56)",
    boxShadow:
      "0 18px 44px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const sectionTitle: React.CSSProperties = {
    fontWeight: 900,
    fontSize: isMobile ? 28 : 18,
    lineHeight: isMobile ? 1.03 : 1.08,
    marginBottom: 8,
    color: "#ffffff",
    letterSpacing: isMobile ? -0.5 : 0,
  };

  const sectionText: React.CSSProperties = {
    fontSize: isMobile ? 16 : 13,
    lineHeight: isMobile ? 1.42 : 1.65,
    color: "rgba(226,232,240,0.86)",
  };

  const boardShell: React.CSSProperties = {
    marginTop: 16,
    border: "1px solid rgba(34,197,94,0.20)",
    borderRadius: 22,
    padding: isMobile ? 14 : 14,
    background:
      "linear-gradient(180deg, rgba(34,197,94,0.06), rgba(2,6,23,0.14) 28%, rgba(2,6,23,0.5) 100%)",
  };

  const boardTop: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 12,
  };

  const boardTopLeft: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const boardLabel: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.7,
    color: "rgba(187,247,208,1)",
  };

  const boardHeadline: React.CSSProperties = {
    fontSize: isMobile ? 22 : 18,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.06,
  };

  const boardStats: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
    gap: 8,
    width: isMobile ? "100%" : 360,
  };

  const statPill: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(255,255,255,0.03)",
    padding: "10px 10px",
  };

  const memberGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
    gap: 10,
  };

  const useCaseGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))",
    gap: 10,
    marginTop: 16,
  };

  const stripGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 0.95fr",
    gap: isMobile ? 18 : 16,
    marginTop: isMobile ? 18 : 18,
  };

  const demoGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: 12,
    marginTop: 16,
  };

  const valueGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
    gap: 12,
    marginTop: 16,
  };

  const bottomGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1.04fr 0.96fr",
    gap: isMobile ? 18 : 16,
    marginTop: isMobile ? 18 : 18,
  };

  function toneStyles(tone: PresenceStatus): React.CSSProperties {
    if (tone === "safe") {
      return {
        border: "1px solid rgba(34,197,94,0.24)",
        background: "rgba(34,197,94,0.08)",
      };
    }
    if (tone === "active") {
      return {
        border: "1px solid rgba(56,189,248,0.22)",
        background: "rgba(56,189,248,0.08)",
      };
    }
    if (tone === "attention") {
      return {
        border: "1px solid rgba(250,204,21,0.24)",
        background: "rgba(250,204,21,0.08)",
      };
    }
    return {
      border: "1px solid rgba(244,63,94,0.24)",
      background: "rgba(244,63,94,0.08)",
    };
  }

  function statusLabel(status: PresenceStatus) {
    if (status === "safe") return "Safe";
    if (status === "active") return "Active";
    if (status === "attention") return "Needs attention";
    return "Alert ready";
  }

  return (
    <div style={page}>
      <div style={shell}>
        <div style={hero}>
          <div style={heroTop}>
            <div style={titleWrap}>
              <div style={titleRow}>
                <div style={title}>Planet Guardian</div>
                <div style={livePill}>
                  <span style={pulseDot} />
                  HOUSEHOLD ACTIVE
                </div>
              </div>

              <div style={heroLead}>
                Know where everyone is.
                <br />
                Know what’s happening.
                <br />
                In real time.
              </div>

              <div style={heroSubline}>
                Family. Kids. Pets. Elderly. Medical.
                <br />
                One live safety system built as a presence layer for anyone who matters.
              </div>

              <div style={doctrinePanel}>
                <div style={doctrineTitle}>
                  PRESENCE-FIRST • LIVE AWARENESS • RESPONSE-READY
                </div>
                <div style={doctrineText}>
                  Planet Guardian is not a pet tag, not a child tracker, and not just a medical alert.
                  It is one calm awareness system that keeps the people and animals who matter inside a
                  single readable truth layer.
                </div>
              </div>
            </div>

            <div style={heroActions}>
              <button
                type="button"
                style={buttonPrimary}
                onClick={() => nav("/planet/guardian-pet")}
              >
                Open Bella demo
              </button>
              <button
                type="button"
                style={buttonBase}
                onClick={() => window.scrollTo({ top: 720, behavior: "smooth" })}
              >
                View Guardian structure
              </button>
            </div>
          </div>

          <div style={gridTop}>
            <div style={sectionCard}>
              <div style={sectionTitle}>Household Active</div>
              <div style={sectionText}>
                This is the anchor idea. Not separate products fighting each other. One live household
                view that shows who is safe, who is active, who needs attention, and what happened last.
              </div>

              <div style={boardShell}>
                <div style={boardTop}>
                  <div style={boardTopLeft}>
                    <div style={boardLabel}>LIVE SAFETY PANEL</div>
                    <div style={boardHeadline}>One board for everyone who matters</div>
                  </div>

                  <div style={boardStats}>
                    <div style={statPill}>
                      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 900 }}>
                        HOUSEHOLD
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 900, fontSize: 16, color: "#fff" }}>
                        Active
                      </div>
                    </div>
                    <div style={statPill}>
                      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 900 }}>
                        SAFE
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 900, fontSize: 16, color: "#fff" }}>
                        2
                      </div>
                    </div>
                    <div style={statPill}>
                      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 900 }}>
                        ACTIVE
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 900, fontSize: 16, color: "#fff" }}>
                        2
                      </div>
                    </div>
                    <div style={statPill}>
                      <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 900 }}>
                        ATTENTION
                      </div>
                      <div style={{ marginTop: 4, fontWeight: 900, fontSize: 16, color: "#fff" }}>
                        1
                      </div>
                    </div>
                  </div>
                </div>

                <div style={memberGrid}>
                  {householdMembers.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        ...toneStyles(member.status),
                        borderRadius: 18,
                        padding: isMobile ? 14 : 14,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              color: "rgba(148,163,184,0.9)",
                              fontWeight: 900,
                              letterSpacing: 0.4,
                              marginBottom: 4,
                            }}
                          >
                            {member.role.toUpperCase()}
                          </div>
                          <div
                            style={{
                              fontSize: isMobile ? 20 : 16,
                              fontWeight: 900,
                              color: "#fff",
                              lineHeight: 1.06,
                            }}
                          >
                            {member.name}
                          </div>
                        </div>

                        <div
                          style={{
                            borderRadius: 999,
                            padding: "6px 10px",
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: 0.4,
                            color: "#fff",
                            background: "rgba(2,6,23,0.34)",
                            border: "1px solid rgba(255,255,255,0.12)",
                          }}
                        >
                          {statusLabel(member.status)}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 10,
                          fontSize: isMobile ? 16 : 13,
                          color: "rgba(226,232,240,0.86)",
                          lineHeight: isMobile ? 1.38 : 1.58,
                        }}
                      >
                        <strong style={{ color: "#fff" }}>{member.location}</strong> — {member.detail}
                      </div>

                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            color: "rgba(148,163,184,0.92)",
                            fontWeight: 900,
                            letterSpacing: 0.3,
                          }}
                        >
                          LAST SEEN: {member.lastSeen}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (member.id === "bella") {
                              nav("/planet/guardian-pet");
                              return;
                            }
                            if (member.id === "mom" || member.id === "child") {
                              nav("/planet/guardian-household");
                              return;
                            }
                            window.scrollTo({ top: 1240, behavior: "smooth" });
                          }}
                          style={{
                            borderRadius: 999,
                            padding: "8px 12px",
                            fontSize: 12,
                            fontWeight: 900,
                            cursor: "pointer",
                            border: "1px solid rgba(255,255,255,0.14)",
                            background: "rgba(2,6,23,0.46)",
                            color: "#e5e7eb",
                          }}
                        >
                          {member.actionLabel}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={sectionCard}>
              <div style={sectionTitle}>What makes Guardian different</div>
              <div style={sectionText}>
                Guardian is not built around “tracking.” It is built around calm awareness, context,
                and fast response when something matters.
              </div>

              <div style={valueGrid}>
                <div
                  style={{
                    borderRadius: 18,
                    padding: 16,
                    border: "1px solid rgba(148,163,184,0.16)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: "rgba(187,247,208,1)",
                      marginBottom: 6,
                      letterSpacing: 0.5,
                    }}
                  >
                    NOT TRACKING
                  </div>
                  <div style={{ fontWeight: 900, color: "#fff", fontSize: 16, lineHeight: 1.08 }}>
                    A live awareness layer
                  </div>
                  <div style={{ marginTop: 8, ...sectionText }}>
                    See household state, last movement, response windows, and current truth in one place.
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 18,
                    padding: 16,
                    border: "1px solid rgba(148,163,184,0.16)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: "rgba(186,230,253,1)",
                      marginBottom: 6,
                      letterSpacing: 0.5,
                    }}
                  >
                    NOT SEPARATE APPS
                  </div>
                  <div style={{ fontWeight: 900, color: "#fff", fontSize: 16, lineHeight: 1.08 }}>
                    One panel for everyone
                  </div>
                  <div style={{ marginTop: 8, ...sectionText }}>
                    Pets, kids, elderly, and medical all belong inside one Guardian system.
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 18,
                    padding: 16,
                    border: "1px solid rgba(148,163,184,0.16)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: "rgba(254,240,138,1)",
                      marginBottom: 6,
                      letterSpacing: 0.5,
                    }}
                  >
                    NOT JUST ALERTS
                  </div>
                  <div style={{ fontWeight: 900, color: "#fff", fontSize: 16, lineHeight: 1.08 }}>
                    Response-ready context
                  </div>
                  <div style={{ marginTop: 8, ...sectionText }}>
                    Guardian should know what happened before the emergency, not just after it.
                  </div>
                </div>

                <div
                  style={{
                    borderRadius: 18,
                    padding: 16,
                    border: "1px solid rgba(148,163,184,0.16)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      color: "rgba(251,191,36,1)",
                      marginBottom: 6,
                      letterSpacing: 0.5,
                    }}
                  >
                    HOMEPLANET TRUTH LAYER
                  </div>
                  <div style={{ fontWeight: 900, color: "#fff", fontSize: 16, lineHeight: 1.08 }}>
                    Presence-first proof
                  </div>
                  <div style={{ marginTop: 8, ...sectionText }}>
                    What is current, what changed, and what happened last should always be visible.
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 16,
                  borderRadius: 18,
                  padding: 16,
                  border: "1px solid rgba(34,197,94,0.18)",
                  background: "rgba(20,83,45,0.14)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: "rgba(187,247,208,1)",
                    marginBottom: 6,
                    letterSpacing: 0.5,
                  }}
                >
                  HOUSEHOLD ACTIVE
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 20 : 16,
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1.08,
                  }}
                >
                  One calm board removes guessing.
                </div>
                <div style={{ marginTop: 8, ...sectionText }}>
                  If a child is late, if a pet is found, if an elder stops moving, or if emergency context is
                  needed, you should not have to jump between tools and memories.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={stripGrid}>
          <div style={sectionCard}>
            <div style={sectionTitle}>Guardian applies to everyone who matters</div>
            <div style={sectionText}>
              This is the neutral structure we talked about. Not a pet page here, an elder page there,
              and a child idea somewhere else. One system. Four live layers.
            </div>

            <div style={useCaseGrid}>
              {categoryCards.map((item) => {
                const active = selectedCategory === (item.id as GuardianCategory);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedCategory(item.id as GuardianCategory)}
                    style={{
                      textAlign: "left",
                      borderRadius: 18,
                      padding: isMobile ? 15 : 14,
                      cursor: "pointer",
                      border: active
                        ? "1px solid rgba(34,197,94,0.32)"
                        : "1px solid rgba(148,163,184,0.16)",
                      background: active ? "rgba(34,197,94,0.10)" : "rgba(255,255,255,0.03)",
                      boxShadow: active
                        ? "0 0 20px rgba(74,222,128,0.08)"
                        : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        letterSpacing: 0.5,
                        color: active ? "rgba(187,247,208,1)" : "rgba(148,163,184,0.9)",
                        marginBottom: 6,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? 20 : 16,
                        fontWeight: 900,
                        color: "#fff",
                        lineHeight: 1.08,
                        marginBottom: 8,
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? 15 : 12,
                        lineHeight: isMobile ? 1.4 : 1.55,
                        color: "rgba(226,232,240,0.82)",
                      }}
                    >
                      {item.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={sectionCard}>
            <div style={sectionTitle}>{selectedUseCase.title}</div>
            <div style={sectionText}>{selectedUseCase.description}</div>

            <div
              style={{
                marginTop: 14,
                display: "grid",
                gap: 10,
              }}
            >
              {selectedUseCase.bullets.map((bullet) => (
                <div
                  key={bullet}
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(148,163,184,0.16)",
                    background: "rgba(255,255,255,0.03)",
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 999,
                      background: "rgba(74,222,128,1)",
                      boxShadow: "0 0 10px rgba(74,222,128,0.8)",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      fontSize: isMobile ? 15 : 13,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    {bullet}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 16,
                borderRadius: 18,
                padding: 16,
                border: "1px solid rgba(56,189,248,0.16)",
                background: "rgba(8,47,73,0.20)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  color: "rgba(186,230,253,0.96)",
                  marginBottom: 6,
                }}
              >
                WHY THIS MATTERS
              </div>
              <div style={{ ...sectionText, color: "rgba(226,232,240,0.9)" }}>
                Guardian should not feel like four separate products. It should feel like one family safety
                layer that adapts to the person or animal inside it.
              </div>
            </div>
          </div>
        </div>

        <div style={sectionCard}>
          <div style={sectionTitle}>Demo entry points</div>
          <div style={sectionText}>
            The page should make the paths obvious: pet rescue flow, household awareness panel, and
            emergency-ready response timeline.
          </div>

          <div style={demoGrid}>
            {demoCards.map((card) => {
              const featured = !!card.featured;

              return (
                <div
                  key={card.id}
                  style={{
                    borderRadius: 20,
                    border: featured
                      ? "1px solid rgba(34,197,94,0.24)"
                      : "1px solid rgba(148,163,184,0.16)",
                    background: featured
                      ? "linear-gradient(180deg, rgba(20,83,45,0.18), rgba(255,255,255,0.03))"
                      : "rgba(255,255,255,0.03)",
                    padding: isMobile ? 16 : 16,
                    boxShadow: featured
                      ? "0 0 26px rgba(74,222,128,0.08), inset 0 1px 0 rgba(255,255,255,0.03)"
                      : "inset 0 1px 0 rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 900,
                      letterSpacing: 0.5,
                      color: featured ? "rgba(187,247,208,1)" : "rgba(254,240,138,1)",
                      marginBottom: 6,
                    }}
                  >
                    {card.label}
                  </div>

                  <div
                    style={{
                      fontSize: isMobile ? 22 : 18,
                      fontWeight: 900,
                      color: "#fff",
                      lineHeight: 1.08,
                    }}
                  >
                    {card.title}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: isMobile ? 15 : 13,
                      lineHeight: isMobile ? 1.4 : 1.58,
                      color: "rgba(226,232,240,0.84)",
                    }}
                  >
                    {card.description}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (card.id === "household") {
                        nav("/planet/guardian-household");
                        return;
                      }

                      if (card.to) {
                        nav(card.to);
                        return;
                      }

                      window.scrollTo({
                        top: card.id === "response" ? 1780 : 760,
                        behavior: "smooth",
                      });
                    }}
                    style={{
                      marginTop: 14,
                      borderRadius: 999,
                      padding: featured ? "11px 16px" : "10px 14px",
                      fontSize: 13,
                      fontWeight: 900,
                      cursor: "pointer",
                      border: featured
                        ? "1px solid rgba(34,197,94,0.34)"
                        : "1px solid rgba(34,197,94,0.28)",
                      background: featured
                        ? "rgba(34,197,94,0.14)"
                        : "rgba(34,197,94,0.10)",
                      color: "rgba(187,247,208,1)",
                      boxShadow: featured ? "0 0 18px rgba(74,222,128,0.08)" : "none",
                    }}
                  >
                    {card.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div style={bottomGrid}>
          <div style={sectionCard}>
            <div style={sectionTitle}>Real-world moment</div>
            <div style={sectionText}>
              This is where Guardian stops being “features” and starts feeling necessary.
            </div>

            <div
              style={{
                marginTop: 16,
                borderRadius: 22,
                border: "1px solid rgba(148,163,184,0.16)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(2,6,23,0.38))",
                padding: isMobile ? 18 : 18,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  color: "rgba(251,191,36,1)",
                  marginBottom: 8,
                }}
              >
                REAL-WORLD SCENARIO
              </div>

              <div
                style={{
                  fontSize: isMobile ? 24 : 20,
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.08,
                  marginBottom: 12,
                }}
              >
                A child doesn’t come home.
              </div>

              <div style={{ ...sectionText, marginBottom: 14 }}>
                You don’t call five people. You don’t guess. You don’t panic.
                <br />
                You open one board — and everything is already there.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  { title: "Last location", value: "School dismissal zone" },
                  { title: "Last movement", value: "" },
                  { title: "Last interaction", value: "Seen by front office at 2:11 PM" },
                  { title: "Who saw them", value: "" },
                  { title: "Safe-zone status", value: "" },
                  { title: "Response path", value: "" },
                ].map((item) => (
                  <div
                    key={item.title}
                    style={{
                      borderRadius: 16,
                      border: "1px solid rgba(148,163,184,0.16)",
                      background: "rgba(255,255,255,0.03)",
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        letterSpacing: 0.4,
                        color: "rgba(148,163,184,0.9)",
                        marginBottom: 5,
                      }}
                    >
                      {item.title.toUpperCase()}
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? 15 : 13,
                        fontWeight: 800,
                        color: "#fff",
                        minHeight: 18,
                      }}
                    >
                      {item.value || item.title}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 14,
                  ...sectionText,
                  color: "rgba(187,247,208,1)",
                  fontWeight: 800,
                }}
              >
                That’s Guardian.
              </div>
            </div>
          </div>

          <div style={sectionCard}>
            <div style={sectionTitle}>Response timeline layer</div>
            <div style={sectionText}>
              Guardian should know what happened before the emergency, what is current now, and what
              response context is needed next.
            </div>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gap: 10,
              }}
            >
              {responseTimeline.map((event) => (
                <div
                  key={event.id}
                  style={{
                    ...toneStyles(event.tone),
                    borderRadius: 18,
                    padding: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "rgba(148,163,184,0.9)",
                          fontWeight: 900,
                          letterSpacing: 0.4,
                          marginBottom: 4,
                        }}
                      >
                        {event.time}
                      </div>
                      <div
                        style={{
                          fontSize: isMobile ? 18 : 15,
                          fontWeight: 900,
                          color: "#fff",
                          lineHeight: 1.08,
                        }}
                      >
                        {event.title}
                      </div>
                    </div>

                    <div
                      style={{
                        borderRadius: 999,
                        padding: "6px 10px",
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: 0.4,
                        background: "rgba(2,6,23,0.32)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#fff",
                      }}
                    >
                      {statusLabel(event.tone)}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: isMobile ? 15 : 13,
                      lineHeight: isMobile ? 1.4 : 1.55,
                      color: "rgba(226,232,240,0.86)",
                    }}
                  >
                    {event.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: isMobile ? 22 : 24,
            border: "1px solid rgba(148,163,184,0.16)",
            borderRadius: isMobile ? 26 : 22,
            padding: isMobile ? 18 : 22,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(2,6,23,0.6))",
          }}
        >
          <div style={sectionTitle}>Start Guardian</div>
          <div style={sectionText}>
            One system. One board. Everyone who matters.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr",
              gap: 14,
              marginTop: 16,
            }}
          >
            <div
              style={{
                borderRadius: 20,
                padding: isMobile ? 16 : 18,
                border: "1px solid rgba(148,163,184,0.18)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 900, color: "#94a3b8" }}>
                SOLO
              </div>

              <div
                style={{
                  fontSize: isMobile ? 24 : 20,
                  fontWeight: 900,
                  color: "#fff",
                  marginTop: 4,
                }}
              >
                $19.95/mo
              </div>

              <div style={{ ...sectionText, marginTop: 8 }}>
                One person, pet, or dependent. Simple Guardian layer.
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                {[
                  "Live presence awareness",
                  "Timeline + last-seen",
                  "Emergency context ready",
                ].map((item) => (
                  <div key={item} style={{ fontSize: 13, color: "#e5e7eb" }}>
                    • {item}
                  </div>
                ))}
              </div>

              <button
                style={{
                  marginTop: 14,
                  width: "100%",
                  borderRadius: 999,
                  padding: "12px",
                  fontWeight: 900,
                  border: "1px solid rgba(34,197,94,0.28)",
                  background: "rgba(34,197,94,0.1)",
                  color: "#bbf7d0",
                  cursor: "pointer",
                }}
                onClick={() => nav("/planet/guardian/start?plan=solo")}
              >
                Start Solo
              </button>
            </div>

            <div
              style={{
                borderRadius: 22,
                padding: isMobile ? 18 : 20,
                border: "1px solid rgba(34,197,94,0.32)",
                background:
                  "linear-gradient(180deg, rgba(34,197,94,0.14), rgba(2,6,23,0.5))",
                boxShadow: "0 0 30px rgba(74,222,128,0.12)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: "#bbf7d0",
                }}
              >
                MOST USED
              </div>

              <div
                style={{
                  fontSize: isMobile ? 28 : 24,
                  fontWeight: 900,
                  color: "#fff",
                  marginTop: 4,
                }}
              >
                $39.95/mo
              </div>

              <div style={{ ...sectionText, marginTop: 8 }}>
                Full household Guardian. Kids, pets, elderly — all in one board.
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                {[
                  "Unlimited household members",
                  "Live household panel",
                  "Cross-category awareness (pets + kids + elderly)",
                  "Full response timeline system",
                ].map((item) => (
                  <div key={item} style={{ fontSize: 13, color: "#e5e7eb" }}>
                    • {item}
                  </div>
                ))}
              </div>

              <button
                style={{
                  marginTop: 16,
                  width: "100%",
                  borderRadius: 999,
                  padding: "14px",
                  fontWeight: 900,
                  border: "1px solid rgba(34,197,94,0.4)",
                  background: "rgba(34,197,94,0.18)",
                  color: "#bbf7d0",
                  cursor: "pointer",
                  fontSize: 15,
                }}
                onClick={() => nav("/planet/guardian/start?plan=household")}
              >
                Start Household
              </button>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              textAlign: "center",
              fontSize: 12,
              color: "#94a3b8",
              fontWeight: 700,
            }}
          >
            No setup friction • Start instantly • Expand anytime
          </div>
        </div>

        <div
          style={{
            marginTop: isMobile ? 22 : 22,
            borderTop: "1px solid rgba(148,163,184,0.16)",
            paddingTop: 18,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: isMobile ? 16 : 13,
              fontWeight: 800,
              color: "#94a3b8",
            }}
          >
            Planet Guardian — one live safety system for anyone who matters.
          </div>
        </div>
      </div>
    </div>
  );
}