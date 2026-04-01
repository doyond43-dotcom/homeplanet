import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type GuardianStatus = "safe" | "active" | "attention" | "alert";
type GuardianProtectionType = "pet" | "child" | "elder" | "medical" | "mixed";
type GuardianPlan = "solo" | "household";

type GuardianActivationRecord = {
  source?: string;
  plan?: GuardianPlan;
  ownerName?: string;
  householdName?: string;
  phone?: string;
  email?: string;
  protectionType?: GuardianProtectionType;
  notes?: string;
  createdAt?: string;
  presenceId?: string;
  activationStatus?: string;
  submittedAt?: string;
};

type ProtectedMember = {
  id: string;
  type: "child" | "elder" | "pet" | "medical";
  name: string;
  location: string;
  notes: string;
};

type HouseholdMember = {
  id: string;
  name: string;
  layer: string;
  location: string;
  detail: string;
  lastSeen: string;
  status: GuardianStatus;
  actionLabel: string;
  type: "child" | "elder" | "pet" | "medical";
};

type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
  status: GuardianStatus;
};

function statusTone(status: GuardianStatus) {
  switch (status) {
    case "safe":
      return {
        pillBg: "rgba(34,197,94,0.14)",
        pillBorder: "rgba(34,197,94,0.32)",
        pillText: "#bbf7d0",
        panelBg:
          "linear-gradient(180deg, rgba(20,83,45,0.32), rgba(2,6,23,0.78))",
        panelBorder: "rgba(34,197,94,0.26)",
      };
    case "active":
      return {
        pillBg: "rgba(59,130,246,0.14)",
        pillBorder: "rgba(59,130,246,0.32)",
        pillText: "#bfdbfe",
        panelBg:
          "linear-gradient(180deg, rgba(30,64,175,0.26), rgba(2,6,23,0.78))",
        panelBorder: "rgba(59,130,246,0.26)",
      };
    case "attention":
      return {
        pillBg: "rgba(245,158,11,0.14)",
        pillBorder: "rgba(245,158,11,0.32)",
        pillText: "#fde68a",
        panelBg:
          "linear-gradient(180deg, rgba(120,53,15,0.26), rgba(2,6,23,0.78))",
        panelBorder: "rgba(245,158,11,0.26)",
      };
    case "alert":
      return {
        pillBg: "rgba(236,72,153,0.14)",
        pillBorder: "rgba(236,72,153,0.32)",
        pillText: "#fbcfe8",
        panelBg:
          "linear-gradient(180deg, rgba(131,24,67,0.30), rgba(2,6,23,0.78))",
        panelBorder: "rgba(236,72,153,0.26)",
      };
    default:
      return {
        pillBg: "rgba(255,255,255,0.08)",
        pillBorder: "rgba(255,255,255,0.14)",
        pillText: "#e5e7eb",
        panelBg: "rgba(255,255,255,0.04)",
        panelBorder: "rgba(255,255,255,0.12)",
      };
  }
}

function protectionLabel(type: ProtectedMember["type"]) {
  switch (type) {
    case "child":
      return "Child Safety Layer";
    case "elder":
      return "Elder Safety Layer";
    case "pet":
      return "Pet Guardian Layer";
    case "medical":
      return "Medical Identity Layer";
    default:
      return "Protected Layer";
  }
}

function actionLabel(type: ProtectedMember["type"]) {
  switch (type) {
    case "child":
      return "Protected child layer";
    case "elder":
      return "Protected elder layer";
    case "pet":
      return "Protected pet layer";
    case "medical":
      return "Protected medical layer";
    default:
      return "Protected layer";
  }
}

function detailCopy(member: ProtectedMember) {
  const location = member.location?.trim();
  const notes = member.notes?.trim();

  if (location && notes) return `${location} — ${notes}`;
  if (location) return `Primary location: ${location}`;
  if (notes) return notes;
  return "Protected Guardian layer active.";
}

function derivedStatus(type: ProtectedMember["type"], index: number): GuardianStatus {
  if (type === "elder") return "attention";
  if (type === "medical") return "active";
  if (type === "pet") return index === 0 ? "active" : "safe";
  return index === 0 ? "active" : "safe";
}

function countByStatus(members: HouseholdMember[], status: GuardianStatus) {
  return members.filter((member) => member.status === status).length;
}

function HomePlanetGuardianFooter() {
  return (
    <div
      style={{
        marginTop: 26,
        paddingTop: 18,
        borderTop: "1px solid rgba(148,163,184,0.16)",
        textAlign: "center",
        color: "rgba(226,232,240,0.72)",
        fontSize: 12,
        letterSpacing: 0.2,
      }}
    >
      Planet Guardian — one live safety system for anyone who matters.
    </div>
  );
}

export default function GuardianHomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [ownerName, setOwnerName] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [presenceId, setPresenceId] = useState("");
  const [activation, setActivation] = useState<GuardianActivationRecord | null>(null);
  const [protectedMembers, setProtectedMembers] = useState<ProtectedMember[]>([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    setOwnerName(localStorage.getItem("guardianOwnerName") || "");
    setHouseholdName(localStorage.getItem("guardianHouseholdName") || "");
    setContactInfo(localStorage.getItem("guardianContactInfo") || "");
    setPresenceId(localStorage.getItem("guardianPresenceId") || "");

    try {
      const rawActivation = localStorage.getItem("hp_guardian_activation_record");
      if (rawActivation) {
        const parsed = JSON.parse(rawActivation) as GuardianActivationRecord;
        setActivation(parsed);
      }
    } catch {
      setActivation(null);
    }

    try {
      const rawMembers = localStorage.getItem("guardianProtectedMembers");
      if (rawMembers) {
        const parsed = JSON.parse(rawMembers) as ProtectedMember[];
        if (Array.isArray(parsed)) {
          setProtectedMembers(parsed);
          if (parsed[0]?.id) {
            setSelectedId(parsed[0].id);
          }
          return;
        }
      }
    } catch {
      // ignore
    }

    setProtectedMembers([]);
  }, [location.key]);

  const members = useMemo<HouseholdMember[]>(() => {
    return protectedMembers.map((member, index) => ({
      id: member.id,
      name: member.name,
      layer: protectionLabel(member.type),
      location: member.location?.trim() || "Protected zone",
      detail: detailCopy(member),
      lastSeen: index === 0 ? "Live now" : "Protected",
      status: derivedStatus(member.type, index),
      actionLabel: actionLabel(member.type),
      type: member.type,
    }));
  }, [protectedMembers]);

  useEffect(() => {
    if (!members.length) {
      setSelectedId("");
      return;
    }

    if (!selectedId || !members.some((member) => member.id === selectedId)) {
      setSelectedId(members[0].id);
    }
  }, [members, selectedId]);

  const selected = useMemo(() => {
    return members.find((member) => member.id === selectedId) ?? members[0];
  }, [members, selectedId]);

  const selectedTone = statusTone(selected?.status ?? "safe");

  const timeline = useMemo<TimelineEvent[]>(() => {
    const baseTime = new Date();
    const formatTime = (offsetMinutes: number) =>
      new Date(baseTime.getTime() - offsetMinutes * 60 * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

    return [
      {
        id: "evt-1",
        time: formatTime(12),
        title: "Guardian intake captured",
        detail: `${ownerName || "Guardian"} completed the protected intake layer.`,
        status: "safe",
      },
      {
        id: "evt-2",
        time: formatTime(8),
        title: "Presence locked",
        detail: presenceId
          ? `Presence ID ${presenceId} was created and attached to this Guardian system.`
          : "Presence-first origin was created for this Guardian system.",
        status: "active",
      },
      {
        id: "evt-3",
        time: formatTime(5),
        title: "Protected roster built",
        detail: protectedMembers.length
          ? `${protectedMembers.length} protected ${protectedMembers.length === 1 ? "member was" : "members were"} added before dashboard entry.`
          : "Protected roster is still empty.",
        status: protectedMembers.length ? "active" : "attention",
      },
      {
        id: "evt-4",
        time: formatTime(1),
        title: "Protected dashboard opened",
        detail: "Guardian is now inside the live protected dashboard.",
        status: "safe",
      },
    ];
  }, [ownerName, presenceId, protectedMembers.length]);

  const shell: React.CSSProperties = {
    minHeight: "100vh",
    color: "#f8fafc",
    background:
      "radial-gradient(1200px 700px at 15% 10%, rgba(0,180,255,0.12), transparent 48%), radial-gradient(1000px 680px at 88% 12%, rgba(16,185,129,0.08), transparent 40%), radial-gradient(900px 700px at 50% 100%, rgba(29,78,216,0.10), transparent 44%), #020817",
    padding: "28px 18px 40px",
  };

  const wrap: React.CSSProperties = {
    maxWidth: 1180,
    margin: "0 auto",
  };

  const hero: React.CSSProperties = {
    borderRadius: 28,
    border: "1px solid rgba(34,211,238,0.18)",
    background: "linear-gradient(180deg, rgba(2,6,23,0.88), rgba(2,6,23,0.70))",
    boxShadow: "0 24px 90px rgba(0,0,0,0.44)",
    padding: 18,
    display: "grid",
    gridTemplateColumns: "1.4fr 0.9fr",
    gap: 18,
  };

  const card: React.CSSProperties = {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2,6,23,0.70)",
    boxShadow:
      "0 18px 60px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.02)",
    padding: 18,
  };

  const pill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(34,197,94,0.22)",
    background: "rgba(34,197,94,0.12)",
    color: "#dcfce7",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const statGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 14,
    marginTop: 18,
  };

  const statCard: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.035)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
    padding: 14,
  };

  const sectionTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 28,
    fontWeight: 950,
    lineHeight: 1.05,
    color: "#ffffff",
  };

  const sectionSub: React.CSSProperties = {
    marginTop: 10,
    color: "rgba(226,232,240,0.84)",
    fontSize: 13,
    lineHeight: 1.6,
    maxWidth: 700,
  };

  const actionBtn: React.CSSProperties = {
    height: 42,
    padding: "0 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.045)",
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const primaryBtn: React.CSSProperties = {
    ...actionBtn,
    border: "1px solid rgba(34,197,94,0.30)",
    background: "rgba(34,197,94,0.14)",
    color: "#dcfce7",
  };

  const boardGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.88fr",
    gap: 18,
    marginTop: 18,
  };

  const memberGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginTop: 14,
  };

  const drawer: React.CSSProperties = {
    ...card,
    minHeight: 520,
    background: selectedTone.panelBg,
    border: `1px solid ${selectedTone.panelBorder}`,
  };

  const tonePill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 74,
    height: 30,
    padding: "0 12px",
    borderRadius: 999,
    border: `1px solid ${selectedTone.pillBorder}`,
    background: selectedTone.pillBg,
    color: selectedTone.pillText,
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.35,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const scenarioGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 0.95fr",
    gap: 18,
    marginTop: 18,
  };

  return (
    <div style={shell}>
      <div style={wrap}>
        <div style={hero}>
          <div>
            <div style={pill}>Planet Guardian • Protected Home</div>
            <h1 style={{ ...sectionTitle, marginTop: 14 }}>
              This is your protected
              <br />
              Guardian dashboard.
            </h1>
            <div style={sectionSub}>
              Guardian intake was captured. Presence was locked. The protected roster is now visible
              inside one calm live board for the people and animals who matter.
            </div>

            <div
              style={{
                marginTop: 18,
                borderRadius: 18,
                border: "1px solid rgba(34,211,238,0.18)",
                background: "rgba(8,47,73,0.20)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                padding: 14,
                color: "rgba(226,232,240,0.90)",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  color: "#a5f3fc",
                  marginBottom: 6,
                }}
              >
                Presence-first • Protected roster • Live awareness
              </div>
              Guardian should start protected, activate protected, and end protected. This page is
              the live home of the real roster captured during intake.
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
              <button
                type="button"
                style={primaryBtn}
                onClick={() => navigate("/planet/guardian")}
              >
                Back to Guardian
              </button>
              <button
                type="button"
                style={actionBtn}
                onClick={() => navigate("/planet/guardian/onboarding?plan=household")}
              >
                Edit protected intake
              </button>
            </div>
          </div>

          <div style={card}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "rgba(148,163,184,0.82)",
              }}
            >
              Protected system
            </div>

            <div style={{ marginTop: 12, fontSize: 19, fontWeight: 900 }}>
              {householdName || ownerName || "Guardian household"}
            </div>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gap: 10,
                color: "rgba(226,232,240,0.84)",
                fontSize: 13,
              }}
            >
              <div>Guardian: {ownerName || "-"}</div>
              <div>Contact: {contactInfo || "-"}</div>
              <div>Protected members: {protectedMembers.length}</div>
              <div>Board: /planet/guardian/home</div>
            </div>

            <div
              style={{
                marginTop: 18,
                borderRadius: 16,
                border: "1px solid rgba(34,197,94,0.18)",
                background: "rgba(34,197,94,0.10)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                padding: 12,
                color: "#dcfce7",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              This board now reflects the protected roster captured during signup.
            </div>
          </div>
        </div>

        <div
          style={{
            ...card,
            marginTop: 18,
            border: "1px solid rgba(34,197,94,0.24)",
            background:
              "linear-gradient(180deg, rgba(20,83,45,0.20), rgba(2,6,23,0.72))",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 0.9,
              textTransform: "uppercase",
              color: "#a7f3d0",
            }}
          >
            Presence activation
          </div>

          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div>
              {presenceId ? (
                <>
                  <div style={smallLabel}>Presence ID</div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 22,
                      fontWeight: 950,
                      color: "#ffffff",
                      letterSpacing: 0.6,
                    }}
                  >
                    {presenceId}
                  </div>
                </>
              ) : (
                <div style={{ color: "rgba(226,232,240,0.75)", fontSize: 13 }}>
                  Presence ID will appear here once locked.
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 12,
              }}
            >
              <InfoBox label="Owner" value={ownerName || activation?.ownerName || "-"} />
              <InfoBox label="Household" value={householdName || activation?.householdName || "-"} />
              <InfoBox label="Members" value={String(protectedMembers.length)} />
              <InfoBox label="Plan" value={activation?.plan || "household"} />
            </div>
          </div>
        </div>

        <div style={{ ...card, marginTop: 18 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: "#a7f3d0",
            }}
          >
            Household active
          </div>
          <h2 style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 950 }}>
            One board for everyone who matters
          </h2>
          <div style={{ ...sectionSub, marginTop: 8, maxWidth: "none" }}>
            This board now uses the actual protected roster captured during intake instead of demo
            filler. The right side should feel owned, not fake.
          </div>

          <div style={statGrid}>
            <div style={statCard}>
              <div style={smallLabel}>Household</div>
              <div style={bigValue}>{householdName || "Active"}</div>
            </div>
            <div style={statCard}>
              <div style={smallLabel}>Safe</div>
              <div style={bigValue}>{countByStatus(members, "safe")}</div>
            </div>
            <div style={statCard}>
              <div style={smallLabel}>Active</div>
              <div style={bigValue}>{countByStatus(members, "active")}</div>
            </div>
            <div style={statCard}>
              <div style={smallLabel}>Attention</div>
              <div style={bigValue}>{countByStatus(members, "attention") + countByStatus(members, "alert")}</div>
            </div>
          </div>
        </div>

        <div style={boardGrid}>
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={smallCaps}>Live protected roster</div>
                <div style={{ marginTop: 6, fontSize: 28, fontWeight: 950 }}>
                  Household active
                </div>
              </div>
              <div style={pill}>Protected home • live awareness</div>
            </div>

            {members.length ? (
              <div style={memberGrid}>
                {members.map((member) => {
                  const tone = statusTone(member.status);
                  const active = selectedId === member.id;

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedId(member.id)}
                      style={{
                        textAlign: "left",
                        borderRadius: 20,
                        border: `1px solid ${active ? tone.panelBorder : "rgba(255,255,255,0.10)"}`,
                        background: active ? tone.panelBg : "rgba(255,255,255,0.035)",
                        boxShadow: active
                          ? "0 12px 34px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.02)"
                          : "inset 0 1px 0 rgba(255,255,255,0.02)",
                        padding: 14,
                        cursor: "pointer",
                        color: "#f8fafc",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 900,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                            color: "rgba(148,163,184,0.80)",
                          }}
                        >
                          {member.layer}
                        </div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 70,
                            height: 28,
                            padding: "0 10px",
                            borderRadius: 999,
                            border: `1px solid ${tone.pillBorder}`,
                            background: tone.pillBg,
                            color: tone.pillText,
                            fontSize: 10,
                            fontWeight: 900,
                            textTransform: "capitalize",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                          }}
                        >
                          {member.status}
                        </div>
                      </div>

                      <div style={{ marginTop: 10, fontSize: 24, fontWeight: 900 }}>
                        {member.name}
                      </div>
                      <div style={{ marginTop: 8, fontSize: 13, color: "rgba(226,232,240,0.94)" }}>
                        <strong>{member.location}</strong> — {member.detail}
                      </div>

                      <div
                        style={{
                          marginTop: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ fontSize: 11, color: "rgba(148,163,184,0.86)", fontWeight: 800 }}>
                          Last seen: {member.lastSeen}
                        </div>
                        <div style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 900 }}>
                          {member.actionLabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  marginTop: 14,
                  borderRadius: 18,
                  border: "1px dashed rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.03)",
                  padding: 16,
                  color: "rgba(226,232,240,0.78)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                No protected members are stored yet. Go back to Guardian intake, add the child, pet,
                elder, or medical layer, then return here.
              </div>
            )}
          </div>

          <div style={drawer}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={smallCaps}>Working drawer</div>
                <div style={{ marginTop: 6, fontSize: 32, fontWeight: 950 }}>
                  {selected?.name || "Protected member"}
                </div>
              </div>
              <div style={tonePill}>{selected?.status ?? "safe"}</div>
            </div>

            <div style={{ marginTop: 14, fontSize: 13, color: "rgba(226,232,240,0.86)", lineHeight: 1.65 }}>
              {selected
                ? `${selected.layer} shows what is current, what changed, and what context needs to be surfaced next. Guardian is meant to remove guessing, not create it.`
                : "Select a protected member to view the working drawer."}
            </div>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <InfoBox label="Current zone" value={selected?.location ?? "-"} />
              <InfoBox label="Last seen" value={selected?.lastSeen ?? "-"} />
              <InfoBox label="Context" value={selected?.layer ?? "-"} />
              <InfoBox label="State" value={selected?.status ?? "-"} />
            </div>

            <div
              style={{
                marginTop: 18,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.035)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                padding: 14,
              }}
            >
              <div style={smallCaps}>Current read</div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "rgba(248,250,252,0.95)",
                }}
              >
                {selected?.detail || "Protected member details appear here."}
              </div>
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                style={primaryBtn}
                onClick={() => navigate("/planet/guardian/onboarding?plan=household")}
              >
                Edit protected roster
              </button>

              <button
                type="button"
                style={actionBtn}
                onClick={() => navigate("/planet/guardian")}
              >
                Back to Guardian
              </button>
            </div>
          </div>
        </div>

        <div style={scenarioGrid}>
          <div style={card}>
            <div style={smallCaps}>Protected system summary</div>
            <h3 style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 950 }}>
              Starts protected. Ends protected.
            </h3>
            <div style={{ ...sectionSub, marginTop: 10, maxWidth: "none" }}>
              The Guardian should feel real from intake through activation through dashboard entry.
              This page is the protected result of the information you just entered.
            </div>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <ScenarioBox title={`Guardian: ${ownerName || "-"}`} />
              <ScenarioBox title={`Household: ${householdName || "-"}`} />
              <ScenarioBox title={`Contact: ${contactInfo || "-"}`} />
              <ScenarioBox title={`Protected members: ${protectedMembers.length}`} />
              <ScenarioBox title={`Presence ID: ${presenceId || "-"}`} />
              <ScenarioBox title="Truth layer active" />
            </div>

            <div style={{ marginTop: 16, color: "#dcfce7", fontWeight: 900 }}>This is Guardian.</div>
          </div>

          <div style={card}>
            <div style={smallCaps}>Response timeline layer</div>
            <h3 style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 950 }}>
              Context before panic
            </h3>
            <div style={{ ...sectionSub, marginTop: 10, maxWidth: "none" }}>
              Guardian should know what was captured, what is current now, and what needs attention next.
            </div>

            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              {timeline.map((event) => {
                const tone = statusTone(event.status);
                return (
                  <div
                    key={event.id}
                    style={{
                      borderRadius: 18,
                      border: `1px solid ${tone.panelBorder}`,
                      background: tone.panelBg,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                      padding: 14,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(226,232,240,0.78)" }}>
                        {event.time}
                      </div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 84,
                          height: 28,
                          padding: "0 10px",
                          borderRadius: 999,
                          border: `1px solid ${tone.pillBorder}`,
                          background: tone.pillBg,
                          color: tone.pillText,
                          fontSize: 10,
                          fontWeight: 900,
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                        }}
                      >
                        {event.status}
                      </div>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 20, fontWeight: 900 }}>
                      {event.title}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        color: "rgba(226,232,240,0.86)",
                        lineHeight: 1.6,
                      }}
                    >
                      {event.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <HomePlanetGuardianFooter />
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.04)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        padding: 12,
      }}
    >
      <div style={smallLabel}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 16, fontWeight: 900, color: "#ffffff" }}>
        {value}
      </div>
    </div>
  );
}

function ScenarioBox({ title }: { title: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.035)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
        padding: 12,
        minHeight: 62,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(248,250,252,0.95)" }}>
        {title}
      </div>
    </div>
  );
}

const smallCaps: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: 1.1,
  textTransform: "uppercase",
  color: "rgba(148,163,184,0.84)",
};

const smallLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 0.9,
  textTransform: "uppercase",
  color: "rgba(148,163,184,0.78)",
};

const bigValue: React.CSSProperties = {
  marginTop: 8,
  fontSize: 28,
  fontWeight: 950,
  color: "#ffffff",
};
