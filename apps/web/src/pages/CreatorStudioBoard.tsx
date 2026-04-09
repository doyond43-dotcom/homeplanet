import React, { useMemo, useState } from "react";

type CreatorCardEnergy = "live" | "edit" | "ready" | "collab" | "idea";

type CreatorCard = {
  id: string;
  title: string;
  detail: string;
  type: string;
  status: string;
  tag?: string;
  energy?: CreatorCardEnergy;
};

type CreatorLane = {
  id: string;
  title: string;
  subtitle: string;
  cards: CreatorCard[];
};

type ClipMomentDraft = {
  title: string;
  detail: string;
  timestamp: string;
};

type ActivityLogItem = {
  id: string;
  text: string;
};

function energyStyles(energy?: CreatorCardEnergy) {
  switch (energy) {
    case "live":
      return {
        border: "1px solid rgba(244,63,94,0.28)",
        background: "rgba(244,63,94,0.10)",
        color: "#fecdd3",
      };
    case "edit":
      return {
        border: "1px solid rgba(56,189,248,0.28)",
        background: "rgba(56,189,248,0.10)",
        color: "#bae6fd",
      };
    case "ready":
      return {
        border: "1px solid rgba(34,197,94,0.28)",
        background: "rgba(34,197,94,0.10)",
        color: "#bbf7d0",
      };
    case "collab":
      return {
        border: "1px solid rgba(168,85,247,0.28)",
        background: "rgba(168,85,247,0.10)",
        color: "#e9d5ff",
      };
    case "idea":
    default:
      return {
        border: "1px solid rgba(250,204,21,0.26)",
        background: "rgba(250,204,21,0.10)",
        color: "#fde68a",
      };
  }
}

function createInitialLanes(): CreatorLane[] {
  return [
    {
      id: "idea-bank",
      title: "Idea Bank",
      subtitle: "Hooks, concepts, stream plans, and sparks.",
      cards: [
        {
          id: "idea-1",
          title: "Late-night ranked comeback reaction",
          detail: "Turn the best comeback moment into a short and a stream opener.",
          type: "Content Idea",
          status: "Unbuilt",
          tag: "Tonight",
          energy: "idea",
        },
        {
          id: "idea-2",
          title: "Prom color transformation recap",
          detail: "Before/after reel concept with fast cuts and one clean voice line.",
          type: "Reel Idea",
          status: "Outline",
          tag: "Salon",
          energy: "idea",
        },
      ],
    },
    {
      id: "live-now",
      title: "Live Now",
      subtitle: "What is active right now on stream or on camera.",
      cards: [
        {
          id: "live-1",
          title: "Creator session: night stream",
          detail: "Phone on tripod live. Desktop board open. Watching for clip moments.",
          type: "Live Session",
          status: "Active",
          tag: "LIVE",
          energy: "live",
        },
      ],
    },
    {
      id: "clip-moments",
      title: "Clip Moments",
      subtitle: "Marked moments pulled from stream or recording.",
      cards: [
        {
          id: "clip-1",
          title: "Round 3 reaction clip",
          detail: "Save the exact reaction moment. Strong candidate for a short.",
          type: "Clip",
          status: "Captured",
          tag: "Highlight",
          energy: "edit",
        },
        {
          id: "clip-2",
          title: "Viewer asked for part 2",
          detail: "Good follow-up angle. Could become next stream hook.",
          type: "Audience Moment",
          status: "Marked",
          tag: "Follow-up",
          energy: "edit",
        },
      ],
    },
    {
      id: "in-edit",
      title: "In Edit",
      subtitle: "Posts, clips, and videos currently being worked on.",
      cards: [
        {
          id: "edit-1",
          title: "Short-form edit in progress",
          detail: "Trim intro, tighten caption, add one stronger opening line.",
          type: "Edit",
          status: "Working",
          tag: "Priority",
          energy: "edit",
        },
      ],
    },
    {
      id: "ready-to-drop",
      title: "Ready to Drop",
      subtitle: "Finished content ready to publish or post.",
      cards: [
        {
          id: "drop-1",
          title: "Weekend event promo post",
          detail: "Caption approved. Visual approved. Ready to push tonight.",
          type: "Post",
          status: "Ready",
          tag: "Queued",
          energy: "ready",
        },
      ],
    },
    {
      id: "collabs-requests",
      title: "Collabs / Requests",
      subtitle: "Commissions, brand asks, custom requests, invites.",
      cards: [
        {
          id: "collab-1",
          title: "Custom logo request from viewer",
          detail: "Potential paid request. Needs response and timeline.",
          type: "Commission",
          status: "Open",
          tag: "Money",
          energy: "collab",
        },
        {
          id: "collab-2",
          title: "Possible creator collab stream",
          detail: "Gaming crossover idea for later this week.",
          type: "Collab",
          status: "Review",
          tag: "Invite",
          energy: "collab",
        },
      ],
    },
  ];
}

function formatTimestampLabel(timestamp: string) {
  if (!timestamp) return "Marked";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Marked";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getLaneForCard(lanes: CreatorLane[], cardId: string) {
  return lanes.find((lane) => lane.cards.some((card) => card.id === cardId));
}

export default function CreatorStudioBoard() {
  const [lanes, setLanes] = useState<CreatorLane[]>(() => createInitialLanes());
  const [selectedCardId, setSelectedCardId] = useState<string>("live-1");
  const [clipModalOpen, setClipModalOpen] = useState(false);
  const [clipDraft, setClipDraft] = useState<ClipMomentDraft>({
    title: "",
    detail: "",
    timestamp: "",
  });
  const [clipError, setClipError] = useState("");
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([
    { id: "log-1", text: "Board loaded. Creator workflow ready." },
  ]);

  const allCards = useMemo(() => lanes.flatMap((lane) => lane.cards), [lanes]);

  const selectedCard = useMemo(() => {
    return allCards.find((card) => card.id === selectedCardId) ?? allCards[0];
  }, [allCards, selectedCardId]);

  const selectedLane = useMemo(() => {
    return getLaneForCard(lanes, selectedCardId);
  }, [lanes, selectedCardId]);

  const clipMomentCount = useMemo(() => {
    const lane = lanes.find((item) => item.id === "clip-moments");
    return lane?.cards.length ?? 0;
  }, [lanes]);

  const requestCount = useMemo(() => {
    const lane = lanes.find((item) => item.id === "collabs-requests");
    return lane?.cards.length ?? 0;
  }, [lanes]);

  const addLog = (text: string) => {
    setActivityLog((prev) => [
      { id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text },
      ...prev,
    ]);
  };

  const openClipModal = () => {
    const now = new Date();
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setClipDraft({
      title: "",
      detail: "",
      timestamp: localIso,
    });
    setClipError("");
    setClipModalOpen(true);
  };

  const closeClipModal = () => {
    setClipModalOpen(false);
    setClipError("");
  };

  const saveClipMoment = () => {
    const title = clipDraft.title.trim();
    const detail = clipDraft.detail.trim();
    const timestamp = clipDraft.timestamp.trim();

    if (!title) {
      setClipError("Give the clip moment a title.");
      return;
    }

    if (!detail) {
      setClipError("Add a quick note so future-you knows why it matters.");
      return;
    }

    const newCard: CreatorCard = {
      id: `clip-${Date.now()}`,
      title,
      detail,
      type: "Clip Moment",
      status: "Marked",
      tag: formatTimestampLabel(timestamp),
      energy: "edit",
    };

    setLanes((prev) =>
      prev.map((lane) =>
        lane.id === "clip-moments"
          ? {
              ...lane,
              cards: [newCard, ...lane.cards],
            }
          : lane,
      ),
    );

    setSelectedCardId(newCard.id);
    setClipModalOpen(false);
    setClipError("");
    addLog(`Clip moment saved: "${newCard.title}" → Clip Moments`);
  };

  const moveSelectedCardToLane = (
    targetLaneId: "in-edit" | "ready-to-drop",
    updates: Partial<CreatorCard>,
    movementLabel: string,
  ) => {
    if (!selectedCard || !selectedLane || selectedLane.id === targetLaneId) return;

    const movingCard: CreatorCard = {
      ...selectedCard,
      ...updates,
    };

    setLanes((prev) =>
      prev.map((lane) => {
        if (lane.id === selectedLane.id) {
          return {
            ...lane,
            cards: lane.cards.filter((card) => card.id !== selectedCard.id),
          };
        }

        if (lane.id === targetLaneId) {
          return {
            ...lane,
            cards: [movingCard, ...lane.cards],
          };
        }

        return lane;
      }),
    );

    setSelectedCardId(movingCard.id);
    addLog(`${movementLabel}: "${movingCard.title}"`);
  };

  const moveSelectedToEdit = () => {
    moveSelectedCardToLane(
      "in-edit",
      {
        status: "Working",
        type: selectedCard.type === "Clip Moment" ? "Edit Candidate" : selectedCard.type,
        tag: "In Edit",
        energy: "edit",
      },
      "Moved to In Edit",
    );
  };

  const moveSelectedToReady = () => {
    moveSelectedCardToLane(
      "ready-to-drop",
      {
        status: "Ready",
        type: selectedCard.type === "Edit" ? "Post" : selectedCard.type,
        tag: "Ready",
        energy: "ready",
      },
      "Moved to Ready to Drop",
    );
  };

  const moveReadyBackToEdit = () => {
    moveSelectedCardToLane(
      "in-edit",
      {
        status: "Working",
        tag: "Back in Edit",
        energy: "edit",
      },
      "Moved back to In Edit",
    );
  };

  const canMoveToEdit =
    !!selectedCard &&
    !!selectedLane &&
    (selectedLane.id === "clip-moments" || selectedLane.id === "ready-to-drop");

  const canMoveToReady =
    !!selectedCard && !!selectedLane && selectedLane.id === "in-edit";

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(1200px 720px at 0% 0%, rgba(244,114,182,0.08), transparent 45%)," +
      "radial-gradient(1000px 760px at 100% 0%, rgba(56,189,248,0.08), transparent 42%)," +
      "radial-gradient(1200px 980px at 50% 100%, rgba(34,197,94,0.06), transparent 46%)," +
      "linear-gradient(180deg, #030712 0%, #06101c 52%, #030712 100%)",
    color: "#e5e7eb",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    padding: 20,
  };

  const shell: React.CSSProperties = {
    maxWidth: 1560,
    margin: "0 auto",
  };

  const frame: React.CSSProperties = {
    borderRadius: 28,
    border: "1px solid rgba(148,163,184,0.14)",
    background:
      "linear-gradient(180deg, rgba(8,15,30,0.92), rgba(2,6,23,0.96) 18%, rgba(2,6,23,0.98) 100%)",
    boxShadow:
      "0 30px 120px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.02)",
    overflow: "hidden",
  };

  const topBar: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "14px 18px 12px",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
    flexWrap: "wrap",
  };

  const topBarLeft: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  };

  const windowDot = (color: string): React.CSSProperties => ({
    width: 10,
    height: 10,
    borderRadius: 999,
    background: color,
    boxShadow: `0 0 10px ${color}`,
  });

  const badge = (tone?: "pink" | "green" | "blue"): React.CSSProperties => {
    if (tone === "pink") {
      return {
        borderRadius: 999,
        padding: "6px 10px",
        border: "1px solid rgba(244,114,182,0.28)",
        background: "rgba(244,114,182,0.10)",
        color: "#fbcfe8",
        fontWeight: 900,
        fontSize: 11,
        letterSpacing: 0.5,
      };
    }

    if (tone === "green") {
      return {
        borderRadius: 999,
        padding: "6px 10px",
        border: "1px solid rgba(34,197,94,0.28)",
        background: "rgba(34,197,94,0.10)",
        color: "#bbf7d0",
        fontWeight: 900,
        fontSize: 11,
        letterSpacing: 0.5,
      };
    }

    return {
      borderRadius: 999,
      padding: "6px 10px",
      border: "1px solid rgba(56,189,248,0.28)",
      background: "rgba(56,189,248,0.10)",
      color: "#bae6fd",
      fontWeight: 900,
      fontSize: 11,
      letterSpacing: 0.5,
    };
  };

  const hero: React.CSSProperties = {
    padding: 18,
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    background:
      "radial-gradient(820px 320px at 12% 0%, rgba(244,114,182,0.08), transparent 50%), radial-gradient(760px 320px at 100% 0%, rgba(56,189,248,0.08), transparent 46%)",
  };

  const heroGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
    gap: 16,
    alignItems: "stretch",
  };

  const panel: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(148,163,184,0.14)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
    boxShadow: "0 20px 50px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.03)",
    overflow: "hidden",
  };

  const heroTitle: React.CSSProperties = {
    fontSize: 42,
    fontWeight: 900,
    letterSpacing: -1.4,
    lineHeight: 0.94,
    color: "#ffffff",
    maxWidth: 720,
    marginTop: 12,
  };

  const heroHook: React.CSSProperties = {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 900,
    lineHeight: 1.02,
    color: "#ffffff",
    maxWidth: 760,
  };

  const heroText: React.CSSProperties = {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 1.6,
    color: "rgba(226,232,240,0.82)",
    maxWidth: 760,
  };

  const heroActions: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  };

  const primaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: "12px 16px",
    border: "1px solid rgba(34,197,94,0.34)",
    background: "rgba(34,197,94,0.14)",
    color: "#dcfce7",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(34,197,94,0.10), inset 0 1px 0 rgba(255,255,255,0.04)",
  };

  const secondaryBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: "12px 16px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.045)",
    color: "#f8fafc",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
  };

  const pulseGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  };

  const pulseCard: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.035)",
    padding: 12,
  };

  const pulseLabel: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(148,163,184,0.92)",
  };

  const pulseValue: React.CSSProperties = {
    marginTop: 8,
    fontSize: 20,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.06,
  };

  const pulseText: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.72)",
  };

  const contentGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 320px",
    gap: 16,
    padding: 16,
    alignItems: "start",
  };

  const boardScroller: React.CSSProperties = {
    overflowX: "auto",
    paddingBottom: 6,
  };

  const lanesRow: React.CSSProperties = {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "290px",
    gap: 12,
    alignItems: "start",
  };

  const lane: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    minHeight: 560,
    overflow: "hidden",
  };

  const laneHeader: React.CSSProperties = {
    padding: 14,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
  };

  const laneTitle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.08,
  };

  const laneSubtitle: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.68)",
  };

  const laneBody: React.CSSProperties = {
    padding: 12,
    display: "grid",
    gap: 10,
  };

  const cardBase = (active: boolean): React.CSSProperties => ({
    borderRadius: 16,
    border: active
      ? "1px solid rgba(56,189,248,0.30)"
      : "1px solid rgba(255,255,255,0.08)",
    background: active ? "rgba(56,189,248,0.08)" : "rgba(255,255,255,0.035)",
    padding: 12,
    cursor: "pointer",
    boxShadow: active
      ? "0 0 0 1px rgba(56,189,248,0.10) inset"
      : "inset 0 1px 0 rgba(255,255,255,0.02)",
  });

  const cardTop: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  };

  const cardTitle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.15,
  };

  const cardType: React.CSSProperties = {
    marginTop: 8,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "rgba(148,163,184,0.88)",
    fontWeight: 900,
  };

  const cardDetail: React.CSSProperties = {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 1.55,
    color: "rgba(226,232,240,0.74)",
  };

  const cardBottom: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  };

  const cardStatus: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    color: "rgba(226,232,240,0.76)",
  };

  const sidebar: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    overflow: "hidden",
    position: "sticky",
    top: 16,
  };

  const sidebarHeader: React.CSSProperties = {
    padding: 14,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "linear-gradient(180deg, rgba(56,189,248,0.06), rgba(255,255,255,0.01))",
  };

  const sidebarBody: React.CSSProperties = {
    padding: 14,
    display: "grid",
    gap: 12,
  };

  const sideBlock: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    padding: 12,
  };

  const sideLabel: React.CSSProperties = {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "rgba(148,163,184,0.88)",
    fontWeight: 900,
  };

  const sideValue: React.CSSProperties = {
    marginTop: 8,
    fontSize: 15,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.15,
  };

  const sideText: React.CSSProperties = {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 1.55,
    color: "rgba(226,232,240,0.74)",
  };

  const actionGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
  };

  const actionBtn: React.CSSProperties = {
    borderRadius: 12,
    padding: "10px 10px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    fontWeight: 800,
    fontSize: 12,
    textAlign: "center",
    cursor: "pointer",
  };

  const actionBtnDisabled: React.CSSProperties = {
    ...actionBtn,
    opacity: 0.42,
    cursor: "not-allowed",
  };

  const activityList: React.CSSProperties = {
    display: "grid",
    gap: 8,
    marginTop: 10,
  };

  const activityItem: React.CSSProperties = {
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    padding: "10px 10px",
    fontSize: 12,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.76)",
  };

  const modalOverlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.72)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 999,
  };

  const modalCard: React.CSSProperties = {
    width: "100%",
    maxWidth: 560,
    borderRadius: 24,
    border: "1px solid rgba(148,163,184,0.16)",
    background:
      "linear-gradient(180deg, rgba(8,15,30,0.98), rgba(2,6,23,0.98) 40%, rgba(2,6,23,0.99) 100%)",
    boxShadow:
      "0 30px 120px rgba(0,0,0,0.52), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(255,255,255,0.02)",
    overflow: "hidden",
  };

  const modalHeader: React.CSSProperties = {
    padding: "16px 18px 14px",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    background:
      "radial-gradient(640px 180px at 0% 0%, rgba(244,114,182,0.08), transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
  };

  const modalBody: React.CSSProperties = {
    padding: 18,
    display: "grid",
    gap: 14,
  };

  const fieldWrap: React.CSSProperties = {
    display: "grid",
    gap: 8,
  };

  const fieldLabel: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.3,
    color: "rgba(186,230,253,0.94)",
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    padding: "13px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  const textareaBase: React.CSSProperties = {
    ...inputBase,
    minHeight: 110,
    resize: "vertical",
  };

  const modalFooter: React.CSSProperties = {
    padding: "0 18px 18px",
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  };

  const errorText: React.CSSProperties = {
    fontSize: 12,
    color: "#fda4af",
    fontWeight: 700,
  };

  return (
    <div style={page}>
      <div style={shell}>
        <div style={frame}>
          <div style={topBar}>
            <div style={topBarLeft}>
              <span style={windowDot("#fb7185")} />
              <span style={windowDot("#fbbf24")} />
              <span style={windowDot("#4ade80")} />
              <div style={badge("pink")}>CREATOR STUDIO</div>
              <div style={badge()}>PLACEHOLDER BOARD</div>
              <div style={badge("green")}>FRONT-END FIRST</div>
            </div>

            <div style={topBarLeft}>
              <div style={badge()}>ROUTE /planet/creator/studio-board</div>
            </div>
          </div>

          <div style={hero}>
            <div style={heroGrid}>
              <div style={panel}>
                <div style={{ padding: 18 }}>
                  <div style={badge("pink")}>CREATOR CITY • REAL CREATOR SYSTEM</div>

                  <div style={heroTitle}>Creator Studio Board</div>

                  <div style={heroHook}>
                    A creator operating system, not a recycled selling board.
                  </div>

                  <div style={heroText}>
                    This is the placeholder structure for the real creator backend page.
                    Ideas, live sessions, clip moments, edits, drops, requests, and collabs
                    all live in one creator-native workflow.
                  </div>

                  <div style={heroActions}>
                    <button type="button" style={primaryBtn}>
                      Start Creator Session
                    </button>
                    <button type="button" style={secondaryBtn} onClick={openClipModal}>
                      Mark Clip Moment
                    </button>
                  </div>
                </div>
              </div>

              <div style={panel}>
                <div style={{ padding: 18 }}>
                  <div style={pulseGrid}>
                    <div style={pulseCard}>
                      <div style={pulseLabel}>Mode</div>
                      <div style={pulseValue}>Live + Edit</div>
                      <div style={pulseText}>Phone active. Desktop board open.</div>
                    </div>

                    <div style={pulseCard}>
                      <div style={pulseLabel}>Session</div>
                      <div style={pulseValue}>Night Stream</div>
                      <div style={pulseText}>Current creator focus is loaded.</div>
                    </div>

                    <div style={pulseCard}>
                      <div style={pulseLabel}>Clip moments</div>
                      <div style={pulseValue}>{String(clipMomentCount).padStart(2, "0")}</div>
                      <div style={pulseText}>Captured and waiting for edit pass.</div>
                    </div>

                    <div style={pulseCard}>
                      <div style={pulseLabel}>Requests</div>
                      <div style={pulseValue}>{String(requestCount).padStart(2, "0")}</div>
                      <div style={pulseText}>Commissions and collab invites open.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={contentGrid}>
            <div style={boardScroller}>
              <div style={lanesRow}>
                {lanes.map((laneItem) => (
                  <div key={laneItem.id} style={lane}>
                    <div style={laneHeader}>
                      <div style={laneTitle}>{laneItem.title}</div>
                      <div style={laneSubtitle}>{laneItem.subtitle}</div>
                    </div>

                    <div style={laneBody}>
                      {laneItem.cards.map((card) => {
                        const tone = energyStyles(card.energy);
                        const active = selectedCard.id === card.id;

                        return (
                          <div
                            key={card.id}
                            style={cardBase(active)}
                            onClick={() => setSelectedCardId(card.id)}
                          >
                            <div style={cardTop}>
                              <div style={{ minWidth: 0 }}>
                                <div style={cardTitle}>{card.title}</div>
                                <div style={cardType}>{card.type}</div>
                              </div>

                              {card.tag ? (
                                <div
                                  style={{
                                    ...tone,
                                    borderRadius: 999,
                                    padding: "5px 8px",
                                    fontSize: 10,
                                    fontWeight: 900,
                                    letterSpacing: 0.5,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {card.tag}
                                </div>
                              ) : null}
                            </div>

                            <div style={cardDetail}>{card.detail}</div>

                            <div style={cardBottom}>
                              <div style={cardStatus}>{card.status}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={sidebar}>
              <div style={sidebarHeader}>
                <div style={badge()}>SELECTED CARD</div>
              </div>

              <div style={sidebarBody}>
                <div style={sideBlock}>
                  <div style={sideLabel}>Title</div>
                  <div style={sideValue}>{selectedCard.title}</div>
                  <div style={sideText}>{selectedCard.detail}</div>
                </div>

                <div style={sideBlock}>
                  <div style={sideLabel}>Current status</div>
                  <div style={sideValue}>{selectedCard.status}</div>
                  <div style={sideText}>
                    {selectedLane ? `Current lane: ${selectedLane.title}` : "Waiting for lane context."}
                  </div>
                </div>

                <div style={sideBlock}>
                  <div style={sideLabel}>Quick actions</div>
                  <div style={{ ...sideText, marginTop: 8 }}>
                    Real creator workflow movement starts here.
                  </div>

                  <div style={{ marginTop: 12 }} />

                  <div style={actionGrid}>
                    <button type="button" style={actionBtn} onClick={openClipModal}>
                      Mark Clip
                    </button>

                    <button
                      type="button"
                      style={canMoveToEdit ? actionBtn : actionBtnDisabled}
                      onClick={canMoveToEdit ? moveSelectedToEdit : undefined}
                    >
                      Move to Edit
                    </button>

                    <button
                      type="button"
                      style={canMoveToReady ? actionBtn : actionBtnDisabled}
                      onClick={canMoveToReady ? moveSelectedToReady : undefined}
                    >
                      Ready to Drop
                    </button>

                    <button
                      type="button"
                      style={
                        selectedLane?.id === "ready-to-drop" ? actionBtn : actionBtnDisabled
                      }
                      onClick={selectedLane?.id === "ready-to-drop" ? moveReadyBackToEdit : undefined}
                    >
                      Back to Edit
                    </button>
                  </div>
                </div>

                <div style={sideBlock}>
                  <div style={sideLabel}>Movement log</div>
                  <div style={activityList}>
                    {activityLog.slice(0, 5).map((item) => (
                      <div key={item.id} style={activityItem}>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={sideBlock}>
                  <div style={sideLabel}>Why this board exists</div>
                  <div style={sideText}>
                    Creator City needs its own native system. Not storefront-first.
                    Not commerce-first. This board is about creation, capture, editing,
                    posting, and creator momentum.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {clipModalOpen && (
        <div style={modalOverlay} onClick={closeClipModal}>
          <div style={modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeader}>
              <div style={badge("pink")}>MARK CLIP MOMENT</div>
              <div style={{ ...heroHook, fontSize: 24, marginTop: 10 }}>
                Save a creator moment right now.
              </div>
              <div style={{ ...heroText, marginTop: 10, fontSize: 14 }}>
                Keep it simple. Give the moment a name, drop in why it matters,
                and save it straight into Clip Moments.
              </div>
            </div>

            <div style={modalBody}>
              <div style={fieldWrap}>
                <label style={fieldLabel}>Clip title</label>
                <input
                  style={inputBase}
                  value={clipDraft.title}
                  placeholder="Ranked comeback reaction"
                  onChange={(e) =>
                    setClipDraft((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div style={fieldWrap}>
                <label style={fieldLabel}>Quick note</label>
                <textarea
                  style={textareaBase}
                  value={clipDraft.detail}
                  placeholder="What happened here and why should future-you care?"
                  onChange={(e) =>
                    setClipDraft((prev) => ({
                      ...prev,
                      detail: e.target.value,
                    }))
                  }
                />
              </div>

              <div style={fieldWrap}>
                <label style={fieldLabel}>Timestamp</label>
                <input
                  type="datetime-local"
                  style={inputBase}
                  value={clipDraft.timestamp}
                  onChange={(e) =>
                    setClipDraft((prev) => ({
                      ...prev,
                      timestamp: e.target.value,
                    }))
                  }
                />
              </div>

              {clipError ? <div style={errorText}>{clipError}</div> : null}
            </div>

            <div style={modalFooter}>
              <button type="button" style={secondaryBtn} onClick={closeClipModal}>
                Cancel
              </button>

              <button type="button" style={primaryBtn} onClick={saveClipMoment}>
                Save to Clip Moments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}