import { useEffect, useMemo, useRef, useState } from "react";

type TicketStage = 0 | 1 | 2 | 3 | 4;

type Ticket = {
  id: number;
  text: string;
  stage: TicketStage;
  createdAt: number;
};

type MoveSnapshot = {
  ticketId: number;
  fromStage: TicketStage;
  toStage: TicketStage;
};

type AlertItem = {
  id: number;
  title: string;
  message: string;
};

const stages = ["NEW", "ON GRILL", "PLATING", "READY", "COMPLETED"] as const;

function formatAge(createdAt: number, now: number) {
  const minutes = Math.max(0, Math.floor((now - createdAt) / 60000));
  return `${minutes}m`;
}

function extractTicketLabel(text: string) {
  return text.split("\n")[0] || "Order";
}

export default function MomsKitchenDemo() {
  const [now, setNow] = useState(Date.now());

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      text: "Table 4\n2 Eggs • Bacon • Toast",
      stage: 0,
      createdAt: Date.now() - 2 * 60 * 1000,
    },
    {
      id: 2,
      text: "Takeout #14\nPatty Melt • Fries",
      stage: 0,
      createdAt: Date.now() - 1 * 60 * 1000,
    },
    {
      id: 3,
      text: "Table 2\nPancakes • Sausage",
      stage: 1,
      createdAt: Date.now() - 5 * 60 * 1000,
    },
    {
      id: 4,
      text: "Table 8\nClub Sandwich • Fries",
      stage: 2,
      createdAt: Date.now() - 7 * 60 * 1000,
    },
    {
      id: 5,
      text: "Table 5\nPatty Melt • Onion Rings",
      stage: 3,
      createdAt: Date.now() - 9 * 60 * 1000,
    },
    {
      id: 6,
      text: "Table 1\nBiscuits & Gravy",
      stage: 4,
      createdAt: Date.now() - 12 * 60 * 1000,
    },
  ]);

  const [lastMove, setLastMove] = useState<MoveSnapshot | null>(null);
  const [autopilot, setAutopilot] = useState(true);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [soundOn, setSoundOn] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const activeCount = useMemo(
    () => tickets.filter((t) => t.stage !== 4).length,
    [tickets]
  );

  const avgMinutes = useMemo(() => {
    const activeTickets = tickets.filter((t) => t.stage !== 4);
    if (activeTickets.length === 0) return 0;

    const totalMinutes = activeTickets.reduce((sum, ticket) => {
      return sum + Math.floor((now - ticket.createdAt) / 60000);
    }, 0);

    return Math.round(totalMinutes / activeTickets.length);
  }, [tickets, now]);

  function playChime() {
    if (!soundOn || typeof window === "undefined") return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioCtx) return;

      const ctx = audioContextRef.current ?? new AudioCtx();
      audioContextRef.current = ctx;

      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        660,
        ctx.currentTime + 0.18
      );

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.22);
    } catch {
      // ignore audio issues in demo mode
    }
  }

  function pushAlert(title: string, message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);

    setAlerts((prev) => [...prev, { id, title, message }]);
    playChime();

    window.setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 3200);
  }

  function maybeFireStageAlert(ticketText: string, toStage: TicketStage) {
    const ticketLabel = extractTicketLabel(ticketText);

    if (toStage === 2) {
      pushAlert("SERVER ALERT", `${ticketLabel} plating`);
    }

    if (toStage === 3) {
      pushAlert("SERVER ALERT", `${ticketLabel} ready for pickup`);
    }
  }

  function moveTicket(id: number) {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== id) return ticket;
        if (ticket.stage >= 4) return ticket;

        const fromStage = ticket.stage;
        const toStage = (ticket.stage + 1) as TicketStage;

        setLastMove({
          ticketId: id,
          fromStage,
          toStage,
        });

        maybeFireStageAlert(ticket.text, toStage);

        return {
          ...ticket,
          stage: toStage,
        };
      })
    );
  }

  function undoLastMove() {
    if (!lastMove) return;

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === lastMove.ticketId
          ? { ...ticket, stage: lastMove.fromStage }
          : ticket
      )
    );

    setLastMove(null);
  }

  function addOrder() {
    const newId = Date.now();

    const sampleOrders = [
      "Table 7\nWestern Omelette • Coffee",
      "Table 9\nBiscuits & Gravy • Tea",
      "Takeout #21\nBreakfast Burrito • Coffee",
      "Table 3\nPancakes • Bacon",
      "Takeout #22\nBurger • Fries",
      "Table 6\nFrench Toast • Sausage",
      "Table 10\n2 Eggs • Ham • Wheat Toast",
      "Takeout #24\nClub Sandwich • Fries",
    ];

    const order =
      sampleOrders[Math.floor(Math.random() * sampleOrders.length)];

    setTickets((prev) => [
      ...prev,
      {
        id: newId,
        text: order,
        stage: 0,
        createdAt: Date.now(),
      },
    ]);

    pushAlert("NEW ORDER", `${extractTicketLabel(order)} entered`);
  }

  useEffect(() => {
    if (!autopilot) return;

    const interval = window.setInterval(() => {
      addOrder();
    }, 10000);

    return () => window.clearInterval(interval);
  }, [autopilot]);

  return (
    <div
      style={{
        background: "#0f1116",
        minHeight: "100vh",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: 300,
          pointerEvents: "none",
        }}
      >
        {alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              background: "rgba(23, 27, 35, 0.96)",
              border: "1px solid rgba(124, 58, 237, 0.45)",
              borderRadius: 12,
              padding: "12px 14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#c084fc",
                marginBottom: 4,
              }}
            >
              {alert.title}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.35 }}>{alert.message}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>🍽️ Restaurant Operations Demo</h1>
          <div style={{ opacity: 0.8, marginTop: "6px", fontSize: "14px" }}>
            {activeCount} Active • Avg {avgMinutes}m • Demo Mode
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={addOrder}
            style={{
              padding: "10px 16px",
              background: "#7c3aed",
              border: "none",
              borderRadius: 8,
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Demo Order
          </button>

          <button
            onClick={undoLastMove}
            disabled={!lastMove}
            style={{
              padding: "10px 16px",
              background: lastMove ? "#334155" : "#1f2937",
              border: "none",
              borderRadius: 8,
              color: lastMove ? "white" : "#94a3b8",
              cursor: lastMove ? "pointer" : "not-allowed",
              fontWeight: 600,
            }}
          >
            Undo Last Move
          </button>

          <button
            onClick={() => setAutopilot((prev) => !prev)}
            style={{
              padding: "10px 16px",
              background: autopilot ? "#166534" : "#334155",
              border: "none",
              borderRadius: 8,
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Autopilot {autopilot ? "ON" : "OFF"}
          </button>

          <button
            onClick={() => setSoundOn((prev) => !prev)}
            style={{
              padding: "10px 16px",
              background: soundOn ? "#0f766e" : "#334155",
              border: "none",
              borderRadius: 8,
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Chime {soundOn ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 15,
        }}
      >
        {stages.map((stage, stageIndex) => (
          <div
            key={stage}
            style={{
              background: "#1b1f27",
              padding: 10,
              borderRadius: 10,
              minHeight: 420,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginTop: 4,
                marginBottom: 14,
                fontSize: "18px",
                letterSpacing: "0.02em",
              }}
            >
              {stage}
            </h2>

            {tickets
              .filter((t) => t.stage === stageIndex)
              .map((t) => (
                <div
                  key={t.id}
                  onClick={() => moveTicket(t.id)}
                  style={{
                    background: "#2a2f38",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 10,
                    cursor: t.stage === 4 ? "default" : "pointer",
                    whiteSpace: "pre-line",
                    lineHeight: 1.45,
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                  title={
                    t.stage === 4
                      ? "Completed ticket"
                      : "Click to move to next stage"
                  }
                >
                  <div>{t.text}</div>

                  <div
                    style={{
                      marginTop: 10,
                      fontSize: "13px",
                      opacity: 0.8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>⏱ {formatAge(t.createdAt, now)}</span>
                    {t.stage < 4 && <span>Next →</span>}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}