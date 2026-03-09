import { useEffect, useMemo, useState } from "react";

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

const stages = ["NEW", "ON GRILL", "PLATING", "READY", "COMPLETED"] as const;

function formatAge(createdAt: number, now: number) {
  const minutes = Math.max(0, Math.floor((now - createdAt) / 60000));
  return `${minutes}m`;
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
  }

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