import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type GuardianStatus = "safe" | "active" | "attention" | "alert";

type HouseholdMember = {
  id: string;
  name: string;
  layer: string;
  location: string;
  detail: string;
  lastSeen: string;
  status: GuardianStatus;
  actionLabel: string;
};

type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
  status: GuardianStatus;
};

const members: HouseholdMember[] = [
  {
    id: "mom",
    name: "Mom",
    layer: "Household Anchor",
    location: "Home",
    detail: "Phone present. Normal movement pattern.",
    lastSeen: "Live now",
    status: "safe",
    actionLabel: "View household state",
  },
  {
    id: "maya",
    name: "Maya",
    layer: "Child Safety Layer",
    location: "School",
    detail: "Checked in. Dismissal window approaching.",
    lastSeen: "2m ago",
    status: "active",
    actionLabel: "View school timeline",
  },
  {
    id: "bella",
    name: "Bella",
    layer: "Pet Guardian Demo",
    location: "Neighborhood scan zone",
    detail: "Tag active. Last scan visible. Owner contact ready.",
    lastSeen: "7m ago",
    status: "safe",
    actionLabel: "Open Bella demo",
  },
  {
    id: "grandpa-joe",
    name: "Grandpa Joe",
    layer: "Elder Safety Layer",
    location: "Living room",
    detail: "No movement pattern change yet, but check-in window nearing.",
    lastSeen: "18m ago",
    status: "attention",
    actionLabel: "Review response flow",
  },
  {
    id: "medical-profile",
    name: "Medical profile",
    layer: "Emergency Identity Layer",
    location: "Ready",
    detail: "Emergency context can speak on behalf of the person when needed.",
    lastSeen: "Prepared",
    status: "active",
    actionLabel: "View emergency layer",
  },
];

const timeline: TimelineEvent[] = [
  {
    id: "evt-1",
    time: "2:08 PM",
    title: "Normal presence confirmed",
    detail: "Household member visible in expected zone with normal pattern.",
    status: "safe",
  },
  {
    id: "evt-2",
    time: "2:17 PM",
    title: "Pattern changed",
    detail: "Movement slowed and expected interaction window was missed.",
    status: "attention",
  },
  {
    id: "evt-3",
    time: "2:21 PM",
    title: "Guardian escalates context",
    detail: "Last location, timeline, identity, and response context surfaced together.",
    status: "active",
  },
  {
    id: "evt-4",
    time: "2:23 PM",
    title: "Emergency assist ready",
    detail: "Guardian can now support contact, return-to-safety, and speak-on-behalf flow.",
    status: "alert",
  },
];

function statusTone(status: GuardianStatus) {
  switch (status) {
    case "safe":
      return {
        pillBg: "rgba(34,197,94,0.14)",
        pillBorder: "rgba(34,197,94,0.28)",
        pillText: "#bbf7d0",
        panelBg: "linear-gradient(180deg, rgba(20,83,45,0.28), rgba(2,6,23,0.72))",
        panelBorder: "rgba(34,197,94,0.22)",
      };
    case "active":
      return {
        pillBg: "rgba(59,130,246,0.14)",
        pillBorder: "rgba(59,130,246,0.28)",
        pillText: "#bfdbfe",
        panelBg: "linear-gradient(180deg, rgba(30,64,175,0.22), rgba(2,6,23,0.72))",
        panelBorder: "rgba(59,130,246,0.22)",
      };
    case "attention":
      return {
        pillBg: "rgba(245,158,11,0.14)",
        pillBorder: "rgba(245,158,11,0.28)",
        pillText: "#fde68a",
        panelBg: "linear-gradient(180deg, rgba(120,53,15,0.22), rgba(2,6,23,0.72))",
        panelBorder: "rgba(245,158,11,0.22)",
      };
    case "alert":
      return {
        pillBg: "rgba(236,72,153,0.14)",
        pillBorder: "rgba(236,72,153,0.28)",
        pillText: "#fbcfe8",
        panelBg: "linear-gradient(180deg, rgba(131,24,67,0.26), rgba(2,6,23,0.72))",
        panelBorder: "rgba(236,72,153,0.22)",
      };
    default:
      return {
        pillBg: "rgba(255,255,255,0.08)",
        pillBorder: "rgba(255,255,255,0.12)",
        pillText: "#e5e7eb",
        panelBg: "rgba(255,255,255,0.03)",
        panelBorder: "rgba(255,255,255,0.10)",
      };
  }
}

function countByStatus(status: GuardianStatus) {
  return members.filter((member) => member.status === status).length;
}

function HomePlanetGuardianFooter() {
  return (
    <div
      style={{
        marginTop: 26,
        paddingTop: 18,
        borderTop: "1px solid rgba(148,163,184,0.14)",
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

export default function GuardianHouseholdBoard() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string>(members[0]?.id ?? "mom");

  const selected = useMemo(() => {
    return members.find((member) => member.id === selectedId) ?? members[0];
  }, [selectedId]);

  const selectedTone = statusTone(selected?.status ?? "safe");

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
    border: "1px solid rgba(34,211,238,0.16)",
    background: "linear-gradient(180deg, rgba(2,6,23,0.84), rgba(2,6,23,0.66))",
    boxShadow: "0 24px 90px rgba(0,0,0,0.42)",
    padding: 18,
    display: "grid",
    gridTemplateColumns: "1.4fr 0.9fr",
    gap: 18,
  };

  const card: React.CSSProperties = {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(2,6,23,0.62)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
    padding: 18,
  };

  const pill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid rgba(34,197,94,0.18)",
    background: "rgba(34,197,94,0.10)",
    color: "#dcfce7",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  };

  const statGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 14,
    marginTop: 18,
  };

  const statCard: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
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
    color: "rgba(226,232,240,0.82)",
    fontSize: 13,
    lineHeight: 1.6,
    maxWidth: 700,
  };

  const actionBtn: React.CSSProperties = {
    height: 42,
    padding: "0 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  };

  const primaryBtn: React.CSSProperties = {
    ...actionBtn,
    border: "1px solid rgba(34,197,94,0.28)",
    background: "rgba(34,197,94,0.12)",
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
  };

  const entryGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
    marginTop: 18,
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
            <div style={pill}>Planet Guardian • Household Active</div>
            <h1 style={{ ...sectionTitle, marginTop: 14 }}>
              Know where everyone is.
              <br />
              Know what’s happening.
              <br />
              In real time.
            </h1>
            <div style={sectionSub}>
              Family. Kids. Pets. Elderly. Medical. One live safety system built as a
              presence layer for anyone who matters.
            </div>

            <div
              style={{
                marginTop: 18,
                borderRadius: 18,
                border: "1px solid rgba(34,211,238,0.16)",
                background: "rgba(8,47,73,0.18)",
                padding: 14,
                color: "rgba(226,232,240,0.88)",
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
                Presence-first • Live awareness • Response-ready
              </div>
              Planet Guardian is not a pet tag, not a child tracker, and not just a
              medical alert. It is one calm awareness system that keeps the people and
              animals who matter inside a single readable truth layer.
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
              <button
                type="button"
                style={primaryBtn}
                onClick={() => navigate("/planet/guardian-pet/pet/bella-demo")}
              >
                Open Bella demo
              </button>
              <button
                type="button"
                style={actionBtn}
                onClick={() => navigate("/planet/guardian")}
              >
                View Guardian structure
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
                color: "rgba(148,163,184,0.8)",
              }}
            >
              Demo status
            </div>
            <div style={{ marginTop: 12, fontSize: 19, fontWeight: 900 }}>Household board live</div>

            <div style={{ marginTop: 16, display: "grid", gap: 10, color: "rgba(226,232,240,0.82)", fontSize: 13 }}>
              <div>City: Miami</div>
              <div>Mode: guardian-household</div>
              <div>Flow: Live awareness → Context → Response</div>
              <div>Board: /planet/guardian-household</div>
            </div>

            <div
              style={{
                marginTop: 18,
                borderRadius: 16,
                border: "1px solid rgba(34,211,238,0.16)",
                background: "rgba(34,211,238,0.08)",
                padding: 12,
                color: "#cffafe",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              This is the calm household view — one board for everyone who matters.
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
          <h2 style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 950 }}>One board for everyone who matters</h2>
          <div style={{ ...sectionSub, marginTop: 8, maxWidth: "none" }}>
            This is the anchor idea. Not separate products fighting each other. One live
            household view that shows who is safe, who is active, who needs attention,
            and what happened last.
          </div>

          <div style={statGrid}>
            <div style={statCard}>
              <div style={smallLabel}>Household</div>
              <div style={bigValue}>Active</div>
            </div>
            <div style={statCard}>
              <div style={smallLabel}>Safe</div>
              <div style={bigValue}>{countByStatus("safe")}</div>
            </div>
            <div style={statCard}>
              <div style={smallLabel}>Active</div>
              <div style={bigValue}>{countByStatus("active")}</div>
            </div>
            <div style={statCard}>
              <div style={smallLabel}>Attention</div>
              <div style={bigValue}>{countByStatus("attention") + countByStatus("alert")}</div>
            </div>
          </div>
        </div>

        <div style={boardGrid}>
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={smallCaps}>Live safety panel</div>
                <div style={{ marginTop: 6, fontSize: 28, fontWeight: 950 }}>
                  Household active
                </div>
              </div>
              <div style={pill}>One board • live awareness</div>
            </div>

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
                      border: `1px solid ${active ? tone.panelBorder : "rgba(255,255,255,0.08)"}`,
                      background: active ? tone.panelBg : "rgba(255,255,255,0.03)",
                      padding: 14,
                      cursor: "pointer",
                      color: "#f8fafc",
                      boxShadow: active ? "0 12px 34px rgba(0,0,0,0.26)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase", color: "rgba(148,163,184,0.78)" }}>
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
                        }}
                      >
                        {member.status}
                      </div>
                    </div>

                    <div style={{ marginTop: 10, fontSize: 24, fontWeight: 900 }}>{member.name}</div>
                    <div style={{ marginTop: 8, fontSize: 13, color: "rgba(226,232,240,0.92)" }}>
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
                      <div style={{ fontSize: 11, color: "rgba(148,163,184,0.84)", fontWeight: 800 }}>
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
          </div>

          <div style={drawer}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={smallCaps}>Working drawer</div>
                <div style={{ marginTop: 6, fontSize: 32, fontWeight: 950 }}>
                  {selected?.name}
                </div>
              </div>
              <div style={tonePill}>{selected?.status ?? "safe"}</div>
            </div>

            <div style={{ marginTop: 14, fontSize: 13, color: "rgba(226,232,240,0.84)", lineHeight: 1.65 }}>
              {selected?.layer} shows what is current, what changed, and what context needs
              to be surfaced next. Guardian is not meant to create panic. It is meant to
              remove guessing.
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
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                padding: 14,
              }}
            >
              <div style={smallCaps}>Current read</div>
              <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.7, color: "rgba(248,250,252,0.94)" }}>
                {selected?.detail}
              </div>
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                style={primaryBtn}
                onClick={() => {
                  if (selected?.id === "bella") {
                    navigate("/planet/guardian-pet/pet/bella-demo");
                    return;
                  }
                  if (selected?.id === "medical-profile") {
                    navigate("/planet/guardian");
                    return;
                  }
                }}
              >
                {selected?.actionLabel ?? "Open layer"}
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

        <div style={entryGrid}>
          <EntryCard
            eyebrow="Household"
            title="Live household panel"
            body="See the full Guardian idea the right way: everyone who matters inside one calm, readable awareness panel."
            cta="You are here"
            onClick={() => navigate("/planet/guardian-household")}
            active
          />
          <EntryCard
            eyebrow="Pet demo"
            title="Bella Pet Tag Demo"
            body="Public-facing pet rescue flow with scan-to-contact, finder actions, and care timeline visibility."
            cta="Open Bella demo"
            onClick={() => navigate("/planet/guardian-pet/pet/bella-demo")}
          />
          <EntryCard
            eyebrow="Response flow"
            title="Response timeline layer"
            body="See how Guardian should surface last-seen context, presence trail, and response-ready truth."
            cta="Back to Guardian structure"
            onClick={() => navigate("/planet/guardian")}
          />
        </div>

        <div style={scenarioGrid}>
          <div style={card}>
            <div style={smallCaps}>Real-world scenario</div>
            <h3 style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 950 }}>
              A child doesn’t come home.
            </h3>
            <div style={{ ...sectionSub, marginTop: 10, maxWidth: "none" }}>
              You don’t call five people. You don’t guess. You open one board.
            </div>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <ScenarioBox title="Last location" />
              <ScenarioBox title="Last movement" />
              <ScenarioBox title="Last interaction" />
              <ScenarioBox title="Who saw them" />
              <ScenarioBox title="Safe-zone status" />
              <ScenarioBox title="Response path" />
            </div>

            <div style={{ marginTop: 16, color: "#dcfce7", fontWeight: 900 }}>That’s Guardian.</div>
          </div>

          <div style={card}>
            <div style={smallCaps}>Response timeline layer</div>
            <h3 style={{ margin: "8px 0 0", fontSize: 28, fontWeight: 950 }}>
              Context before panic
            </h3>
            <div style={{ ...sectionSub, marginTop: 10, maxWidth: "none" }}>
              Guardian should know what happened before the emergency, what is current
              now, and what responders need next.
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
                      padding: 14,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(226,232,240,0.76)" }}>
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
                        }}
                      >
                        {event.status}
                      </div>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 20, fontWeight: 900 }}>{event.title}</div>
                    <div style={{ marginTop: 6, fontSize: 13, color: "rgba(226,232,240,0.84)", lineHeight: 1.6 }}>
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

function EntryCard({
  eyebrow,
  title,
  body,
  cta,
  onClick,
  active = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: active ? "1px solid rgba(34,197,94,0.22)" : "1px solid rgba(255,255,255,0.08)",
        background: active
          ? "linear-gradient(180deg, rgba(20,83,45,0.18), rgba(2,6,23,0.66))"
          : "rgba(2,6,23,0.62)",
        boxShadow: "0 16px 50px rgba(0,0,0,0.24)",
        padding: 18,
      }}
    >
      <div style={smallCaps}>{eyebrow}</div>
      <div style={{ marginTop: 8, fontSize: 28, fontWeight: 950 }}>{title}</div>
      <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.65, color: "rgba(226,232,240,0.84)" }}>
        {body}
      </div>
      <button
        type="button"
        onClick={onClick}
        style={{
          marginTop: 16,
          height: 40,
          padding: "0 14px",
          borderRadius: 999,
          border: active ? "1px solid rgba(34,197,94,0.28)" : "1px solid rgba(255,255,255,0.12)",
          background: active ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
          color: active ? "#dcfce7" : "#f8fafc",
          fontSize: 12,
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        {cta}
      </button>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        padding: 12,
      }}
    >
      <div style={smallLabel}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 16, fontWeight: 900, color: "#ffffff" }}>{value}</div>
    </div>
  );
}

function ScenarioBox({ title }: { title: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        padding: 12,
        minHeight: 62,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(248,250,252,0.94)" }}>{title}</div>
    </div>
  );
}

const smallCaps: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: 1.1,
  textTransform: "uppercase",
  color: "rgba(148,163,184,0.82)",
};

const smallLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 0.9,
  textTransform: "uppercase",
  color: "rgba(148,163,184,0.76)",
};

const bigValue: React.CSSProperties = {
  marginTop: 8,
  fontSize: 28,
  fontWeight: 950,
  color: "#ffffff",
};