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

type QuickAction = {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
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
  const [selectedCardId, setSelectedCardId] = useState<string>("clip-1");
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

  const moveCardToLane = (
    cardId: string,
    targetLaneId: string,
    updates: Partial<CreatorCard>,
    movementLabel: string,
  ) => {
    const sourceLane = getLaneForCard(lanes, cardId);
    const sourceCard = allCards.find((card) => card.id === cardId);

    if (!sourceLane || !sourceCard || sourceLane.id === targetLaneId) return;

    const movedCard: CreatorCard = {
      ...sourceCard,
      ...updates,
    };

    setLanes((prev) =>
      prev.map((lane) => {
        if (lane.id === sourceLane.id) {
          return {
            ...lane,
            cards: lane.cards.filter((card) => card.id !== cardId),
          };
        }

        if (lane.id === targetLaneId) {
          return {
            ...lane,
            cards: [movedCard, ...lane.cards],
          };
        }

        return lane;
      }),
    );

    setSelectedCardId(movedCard.id);
    addLog(`${movementLabel}: "${movedCard.title}"`);
  };

  const moveSelectedToClipMoments = () => {
    if (!selectedCard) return;
    moveCardToLane(
      selectedCard.id,
      "clip-moments",
      {
        status: "Marked",
        tag: "Clip Plan",
        energy: "edit",
      },
      "Moved to Clip Moments",
    );
  };

  const moveSelectedToEdit = () => {
    if (!selectedCard) return;
    moveCardToLane(
      selectedCard.id,
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
    if (!selectedCard) return;
    moveCardToLane(
      selectedCard.id,
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
    if (!selectedCard) return;
    moveCardToLane(
      selectedCard.id,
      "in-edit",
      {
        status: "Working",
        tag: "Back in Edit",
        energy: "edit",
      },
      "Moved back to In Edit",
    );
  };

  const moveSelectedToIdeaBank = () => {
    if (!selectedCard) return;
    moveCardToLane(
      selectedCard.id,
      "clip-moments",
      {
        status: "Reframed",
        tag: "Reworked",
        energy: "edit",
      },
      "Reworked back into Clip Moments",
    );
  };

  const quickActions = useMemo<QuickAction[]>(() => {
    if (!selectedCard || !selectedLane) return [];

    switch (selectedLane.id) {
      case "clip-moments":
        return [
          {
            id: "clip-mark",
            label: "Mark Clip",
            onClick: openClipModal,
          },
          {
            id: "clip-to-edit",
            label: "Move to Edit",
            onClick: moveSelectedToEdit,
          },
        ];

      case "in-edit":
        return [
          {
            id: "edit-to-ready",
            label: "Ready to Drop",
            onClick: moveSelectedToReady,
          },
          {
            id: "edit-to-clip",
            label: "Back to Clip Moments",
            onClick: moveSelectedToClipMoments,
          },
        ];

      case "ready-to-drop":
        return [
          {
            id: "ready-to-edit",
            label: "Back to Edit",
            onClick: moveReadyBackToEdit,
          },
        ];

      case "collabs-requests":
        return [
          {
            id: "collab-to-idea",
            label: "Move to Idea Bank",
            onClick: moveSelectedToIdeaBank,
          },
        ];

      default:
        return [];
    }
  }, [selectedCard, selectedLane]);

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

  const orientationGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
    gap: 16,
    padding: 16,
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    alignItems: "start",
  };

  const orientationPanel: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    overflow: "hidden",
  };

  const orientationHeader: React.CSSProperties = {
    padding: 14,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "linear-gradient(180deg, rgba(56,189,248,0.06), rgba(255,255,255,0.01))",
  };

  const orientationBody: React.CSSProperties = {
    padding: 14,
    display: "grid",
    gap: 12,
  };

  const startStepGrid: React.CSSProperties = {
    display: "grid",
    gap: 10,
  };

  const startStep: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    padding: 12,
  };

  const startStepTop: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  };

  const startStepNumber: React.CSSProperties = {
    width: 22,
    height: 22,
    borderRadius: 999,
    background: "rgba(56,189,248,0.12)",
    border: "1px solid rgba(56,189,248,0.24)",
    color: "#bae6fd",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 900,
    flexShrink: 0,
  };

  const startStepTitle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.12,
  };

  const startStepText: React.CSSProperties = {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 1.55,
    color: "rgba(226,232,240,0.76)",
  };

  const helperChipRow: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  };

  const helperChip: React.CSSProperties = {
    borderRadius: 999,
    padding: "6px 10px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    fontWeight: 800,
    fontSize: 11,
  };

  const laneMeaningGrid: React.CSSProperties = {
    display: "grid",
    gap: 10,
  };

  const laneMeaningCard: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    padding: 12,
  };

  const laneMeaningTitle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 900,
    color: "#ffffff",
    lineHeight: 1.1,
  };

  const laneMeaningText: React.CSSProperties = {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.74)",
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

  const actionHelperBox: React.CSSProperties = {
    marginTop: 10,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    padding: 10,
    fontSize: 12,
    lineHeight: 1.5,
    color: "rgba(226,232,240,0.74)",
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

  const selectedLaneHelpText =
    selectedLane?.id === "clip-moments"
      ? "This lane holds saved moments worth turning into real content."
      : selectedLane?.id === "in-edit"
        ? "This lane is where content is actively being worked on."
        : selectedLane?.id === "ready-to-drop"
          ? "This lane means the content is finished and ready to publish."
          : selectedLane?.id === "collabs-requests"
            ? "This lane holds paid asks, invites, and creator opportunities."
            : "Select a card to see what it means.";

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
                    This board helps creators move from live moments to saved clips,
                    then into edits, then into ready-to-post content without losing track.
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
                      <div style={pulseText}>Saved content moments waiting for edit flow.</div>
                    </div>

                    <div style={pulseCard}>
                      <div style={pulseLabel}>Requests</div>
                      <div style={pulseValue}>{String(requestCount).padStart(2, "0")}</div>
                      <div style={pulseText}>Paid asks, collabs, and open opportunities.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={orientationGrid}>
            <div style={orientationPanel}>
              <div style={orientationHeader}>
                <div style={badge()}>START HERE</div>
              </div>

              <div style={orientationBody}>
                <div style={startStepGrid}>
                  <div style={startStep}>
                    <div style={startStepTop}>
                      <div style={startStepNumber}>1</div>
                      <div style={startStepTitle}>Mark a clip moment</div>
                    </div>
                    <div style={startStepText}>
                      Use <strong>Mark Clip Moment</strong> whenever something happens during a stream,
                      recording, or creator session that is worth saving.
                    </div>
                  </div>

                  <div style={startStep}>
                    <div style={startStepTop}>
                      <div style={startStepNumber}>2</div>
                      <div style={startStepTitle}>Move it into edit</div>
                    </div>
                    <div style={startStepText}>
                      When a saved moment deserves real work, select it and use
                      <strong> Move to Edit</strong> so it becomes active work.
                    </div>
                  </div>

                  <div style={startStep}>
                    <div style={startStepTop}>
                      <div style={startStepNumber}>3</div>
                      <div style={startStepTitle}>Mark it ready to drop</div>
                    </div>
                    <div style={startStepText}>
                      Once the content is finished, move it into
                      <strong> Ready to Drop</strong> so you know it is publish-ready.
                    </div>
                  </div>
                </div>

                <div>
                  <div style={sideLabel}>Sample creator flow</div>
                  <div style={{ ...sideText, marginTop: 8 }}>
                    Go live → notice a strong moment → save it → edit it → post it.
                  </div>
                </div>

                <div style={helperChipRow}>
                  <div style={helperChip}>Live moment</div>
                  <div style={helperChip}>Saved clip</div>
                  <div style={helperChip}>Edit pass</div>
                  <div style={helperChip}>Ready to publish</div>
                </div>
              </div>
            </div>

            <div style={orientationPanel}>
              <div style={orientationHeader}>
                <div style={badge()}>WHAT THE LANES MEAN</div>
              </div>

              <div style={orientationBody}>
                <div style={laneMeaningGrid}>
                  <div style={laneMeaningCard}>
                    <div style={laneMeaningTitle}>Clip Moments</div>
                    <div style={laneMeaningText}>
                      Saved moments worth keeping. These are candidate clips and creator highlights.
                    </div>
                  </div>

                  <div style={laneMeaningCard}>
                    <div style={laneMeaningTitle}>In Edit</div>
                    <div style={laneMeaningText}>
                      Content currently being worked on. This is the active production lane.
                    </div>
                  </div>

                  <div style={laneMeaningCard}>
                    <div style={laneMeaningTitle}>Ready to Drop</div>
                    <div style={laneMeaningText}>
                      Finished content that is ready to publish, post, or release.
                    </div>
                  </div>

                  <div style={laneMeaningCard}>
                    <div style={laneMeaningTitle}>Collabs / Requests</div>
                    <div style={laneMeaningText}>
                      Paid asks, commissions, invitations, and creator opportunities.
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
                  <div style={actionHelperBox}>{selectedLaneHelpText}</div>
                </div>

                <div style={sideBlock}>
                  <div style={sideLabel}>Quick actions</div>
                  <div style={{ ...sideText, marginTop: 8 }}>
                    These are the controls for the selected card. Use them to move work through the creator flow.
                  </div>

                  <div style={{ marginTop: 12 }} />

                  <div style={actionGrid}>
                    {quickActions.length > 0 ? (
                      quickActions.map((action) => (
                        <button
                          key={action.id}
                          type="button"
                          style={actionBtn}
                          onClick={action.onClick}
                          disabled={action.disabled}
                        >
                          {action.label}
                        </button>
                      ))
                    ) : (
                      <div style={{ ...sideText, marginTop: 0 }}>
                        No actions available for this lane yet.
                      </div>
                    )}
                  </div>

                  <div style={actionHelperBox}>
                    {selectedLane?.id === "clip-moments" &&
                      "Use Mark Clip to save another moment, or Move to Edit when this one deserves real work."}
                    {selectedLane?.id === "in-edit" &&
                      "Use Ready to Drop when the content is finished, or send it back if it still needs shaping."}
                    {selectedLane?.id === "ready-to-drop" &&
                      "Use Back to Edit if it needs another pass before publishing."}
                    {selectedLane?.id === "collabs-requests" &&
                      "Use Move to Idea Bank when an incoming request becomes a real content direction."}
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
                    Creator City needs its own native system. Not storefront-first. Not commerce-first.
                    This board is about creation, capture, editing, posting, and creator momentum.
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