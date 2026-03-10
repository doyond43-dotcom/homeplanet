import { useEffect, useMemo, useRef, useState } from "react";

type TicketStage = 0 | 1 | 2 | 3 | 4;
type StationKey = "grill" | "fryer" | "drinks" | "prep" | "toast";

type StationStatus = "waiting" | "in_progress" | "done";

type StationTask = {
  station: StationKey;
  label: string;
  durationSec: number;
  startedAt?: number;
  completedAt?: number;
};

type Ticket = {
  id: number;
  text: string;
  stage: TicketStage;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  expectedMinMinutes: number;
  expectedMaxMinutes: number;
  autoCompletedAt?: number;
  stationTasks: StationTask[];
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

type StationTemplate = {
  station: StationKey;
  label: string;
  durationSec: number;
};

type OrderTemplate = {
  text: string;
  expectedMinMinutes: number;
  expectedMaxMinutes: number;
  stationTasks: StationTemplate[];
};

const stages = ["NEW", "ON GRILL", "PLATING", "READY", "COMPLETED"] as const;

const STATION_LABELS: Record<StationKey, string> = {
  grill: "Grill",
  fryer: "Fryer",
  drinks: "Drinks",
  prep: "Prep",
  toast: "Toast",
};

const SAMPLE_ORDERS: OrderTemplate[] = [
  {
    text: "Table 7\nWestern Omelette • Coffee",
    expectedMinMinutes: 5,
    expectedMaxMinutes: 7,
    stationTasks: [
      { station: "grill", label: "Western Omelette", durationSec: 210 },
      { station: "drinks", label: "Coffee", durationSec: 35 },
    ],
  },
  {
    text: "Table 9\nBiscuits & Gravy • Tea",
    expectedMinMinutes: 4,
    expectedMaxMinutes: 6,
    stationTasks: [
      { station: "prep", label: "Biscuits & Gravy", durationSec: 180 },
      { station: "drinks", label: "Tea", durationSec: 25 },
    ],
  },
  {
    text: "Takeout #21\nBreakfast Burrito • Coffee",
    expectedMinMinutes: 3,
    expectedMaxMinutes: 5,
    stationTasks: [
      { station: "grill", label: "Breakfast Burrito", durationSec: 170 },
      { station: "drinks", label: "Coffee", durationSec: 30 },
    ],
  },
  {
    text: "Table 3\nPancakes • Bacon",
    expectedMinMinutes: 4,
    expectedMaxMinutes: 6,
    stationTasks: [
      { station: "grill", label: "Pancakes • Bacon", durationSec: 220 },
    ],
  },
  {
    text: "Takeout #22\nBurger • Fries",
    expectedMinMinutes: 7,
    expectedMaxMinutes: 9,
    stationTasks: [
      { station: "grill", label: "Burger", durationSec: 240 },
      { station: "fryer", label: "Fries", durationSec: 120 },
    ],
  },
  {
    text: "Table 6\nFrench Toast • Sausage",
    expectedMinMinutes: 5,
    expectedMaxMinutes: 7,
    stationTasks: [
      { station: "grill", label: "French Toast • Sausage", durationSec: 230 },
    ],
  },
  {
    text: "Table 10\n2 Eggs • Ham • Wheat Toast",
    expectedMinMinutes: 4,
    expectedMaxMinutes: 6,
    stationTasks: [
      { station: "grill", label: "2 Eggs • Ham", durationSec: 170 },
      { station: "toast", label: "Wheat Toast", durationSec: 45 },
    ],
  },
  {
    text: "Takeout #24\nClub Sandwich • Fries",
    expectedMinMinutes: 6,
    expectedMaxMinutes: 8,
    stationTasks: [
      { station: "prep", label: "Club Sandwich", durationSec: 180 },
      { station: "fryer", label: "Fries", durationSec: 110 },
    ],
  },
  {
    text: "Table 11\nPatty Melt • Onion Rings",
    expectedMinMinutes: 7,
    expectedMaxMinutes: 9,
    stationTasks: [
      { station: "grill", label: "Patty Melt", durationSec: 250 },
      { station: "fryer", label: "Onion Rings", durationSec: 140 },
    ],
  },
  {
    text: "Takeout #25\n2 Egg Breakfast • Bacon",
    expectedMinMinutes: 4,
    expectedMaxMinutes: 6,
    stationTasks: [
      { station: "grill", label: "2 Egg Breakfast • Bacon", durationSec: 185 },
    ],
  },
  {
    text: "Table 12\nBLT • Fries",
    expectedMinMinutes: 5,
    expectedMaxMinutes: 7,
    stationTasks: [
      { station: "prep", label: "BLT", durationSec: 150 },
      { station: "fryer", label: "Fries", durationSec: 100 },
    ],
  },
  {
    text: "Takeout #26\nGrilled Cheese • Tomato Soup",
    expectedMinMinutes: 5,
    expectedMaxMinutes: 7,
    stationTasks: [
      { station: "grill", label: "Grilled Cheese", durationSec: 140 },
      { station: "prep", label: "Tomato Soup", durationSec: 120 },
    ],
  },
  {
    text: "Table 14\nCoffee",
    expectedMinMinutes: 1,
    expectedMaxMinutes: 1,
    stationTasks: [{ station: "drinks", label: "Coffee", durationSec: 20 }],
  },
  {
    text: "Table 15\nCoffee • Breakfast Burrito",
    expectedMinMinutes: 3,
    expectedMaxMinutes: 5,
    stationTasks: [
      { station: "drinks", label: "Coffee", durationSec: 25 },
      { station: "grill", label: "Breakfast Burrito", durationSec: 170 },
    ],
  },
  {
    text: "Table 16\n2 Eggs • Bacon • Toast\nPancakes • Sausage",
    expectedMinMinutes: 7,
    expectedMaxMinutes: 10,
    stationTasks: [
      { station: "grill", label: "2 Eggs • Bacon", durationSec: 180 },
      { station: "toast", label: "Toast", durationSec: 45 },
      { station: "grill", label: "Pancakes • Sausage", durationSec: 220 },
    ],
  },
  {
    text: "Table 18\nSteak & Eggs\nBiscuits & Gravy\nPancakes\nCoffee x3",
    expectedMinMinutes: 10,
    expectedMaxMinutes: 14,
    stationTasks: [
      { station: "grill", label: "Steak & Eggs", durationSec: 340 },
      { station: "prep", label: "Biscuits & Gravy", durationSec: 180 },
      { station: "grill", label: "Pancakes", durationSec: 180 },
      { station: "drinks", label: "Coffee x3", durationSec: 45 },
    ],
  },
  {
    text: "Table 19\n2 Eggs • Sausage • Rye Toast\n2 Eggs • Bacon • Grits\nSteak & Eggs\nFrench Toast",
    expectedMinMinutes: 12,
    expectedMaxMinutes: 16,
    stationTasks: [
      { station: "grill", label: "2 Eggs • Sausage", durationSec: 180 },
      { station: "toast", label: "Rye Toast", durationSec: 50 },
      { station: "grill", label: "2 Eggs • Bacon • Grits", durationSec: 230 },
      { station: "grill", label: "Steak & Eggs", durationSec: 320 },
      { station: "grill", label: "French Toast", durationSec: 190 },
    ],
  },
  {
    text: "Table 20\nSide Fries",
    expectedMinMinutes: 2,
    expectedMaxMinutes: 3,
    stationTasks: [{ station: "fryer", label: "Side Fries", durationSec: 75 }],
  },
  {
    text: "Table 21\nWhite Toast",
    expectedMinMinutes: 1,
    expectedMaxMinutes: 2,
    stationTasks: [{ station: "toast", label: "White Toast", durationSec: 35 }],
  },
];

function extractTicketLabel(text: string) {
  return text.split("\n")[0] || "Order";
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatClockTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatElapsedMs(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function cloneStationTasks(tasks: StationTemplate[]): StationTask[] {
  return tasks.map((task) => ({ ...task }));
}

function getStationStatus(task: StationTask, now: number): StationStatus {
  if (task.completedAt) return "done";
  if (task.startedAt) {
    const elapsed = (now - task.startedAt) / 1000;
    if (elapsed >= task.durationSec) return "done";
    return "in_progress";
  }
  return "waiting";
}

function getStationSummary(ticket: Ticket, now: number) {
  const statuses = ticket.stationTasks.map((task) => getStationStatus(task, now));
  const doneCount = statuses.filter((s) => s === "done").length;
  const inProgressCount = statuses.filter((s) => s === "in_progress").length;
  const total = ticket.stationTasks.length;

  return {
    doneCount,
    inProgressCount,
    total,
    allDone: doneCount === total && total > 0,
  };
}

export default function MomsKitchenDemo() {
  const initialNow = Date.now();

  const [now, setNow] = useState(initialNow);

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      text: "Table 4\n2 Eggs • Bacon • Toast",
      stage: 0,
      createdAt: initialNow - 2 * 60 * 1000,
      updatedAt: initialNow - 2 * 60 * 1000,
      expectedMinMinutes: 4,
      expectedMaxMinutes: 6,
      stationTasks: cloneStationTasks([
        { station: "grill", label: "2 Eggs • Bacon", durationSec: 180 },
        { station: "toast", label: "Toast", durationSec: 45 },
      ]),
    },
    {
      id: 2,
      text: "Takeout #14\nPatty Melt • Fries",
      stage: 0,
      createdAt: initialNow - 1 * 60 * 1000,
      updatedAt: initialNow - 1 * 60 * 1000,
      expectedMinMinutes: 7,
      expectedMaxMinutes: 9,
      stationTasks: cloneStationTasks([
        { station: "grill", label: "Patty Melt", durationSec: 250 },
        { station: "fryer", label: "Fries", durationSec: 120 },
      ]),
    },
    {
      id: 3,
      text: "Table 2\nPancakes • Sausage",
      stage: 1,
      createdAt: initialNow - 5 * 60 * 1000,
      updatedAt: initialNow - 4 * 60 * 1000,
      startedAt: initialNow - 4.5 * 60 * 1000,
      expectedMinMinutes: 4,
      expectedMaxMinutes: 6,
      stationTasks: cloneStationTasks([
        { station: "grill", label: "Pancakes • Sausage", durationSec: 220 },
      ]).map((task) => ({
        ...task,
        startedAt: initialNow - 4.5 * 60 * 1000,
        completedAt:
          initialNow - (initialNow - 4.5 * 60 * 1000) >= task.durationSec * 1000
            ? initialNow - 4.5 * 60 * 1000 + task.durationSec * 1000
            : undefined,
      })),
    },
    {
      id: 4,
      text: "Table 8\nClub Sandwich • Fries",
      stage: 2,
      createdAt: initialNow - 7 * 60 * 1000,
      updatedAt: initialNow - 90 * 1000,
      startedAt: initialNow - 6.5 * 60 * 1000,
      expectedMinMinutes: 6,
      expectedMaxMinutes: 8,
      stationTasks: [
        {
          station: "prep",
          label: "Club Sandwich",
          durationSec: 180,
          startedAt: initialNow - 6.5 * 60 * 1000,
          completedAt: initialNow - 3.5 * 60 * 1000,
        },
        {
          station: "fryer",
          label: "Fries",
          durationSec: 110,
          startedAt: initialNow - 6.2 * 60 * 1000,
          completedAt: initialNow - 4.3 * 60 * 1000,
        },
      ],
    },
    {
      id: 5,
      text: "Table 5\nPatty Melt • Onion Rings",
      stage: 3,
      createdAt: initialNow - 9 * 60 * 1000,
      updatedAt: initialNow - 40 * 1000,
      startedAt: initialNow - 8.5 * 60 * 1000,
      expectedMinMinutes: 7,
      expectedMaxMinutes: 9,
      stationTasks: [
        {
          station: "grill",
          label: "Patty Melt",
          durationSec: 250,
          startedAt: initialNow - 8.5 * 60 * 1000,
          completedAt: initialNow - 4.3 * 60 * 1000,
        },
        {
          station: "fryer",
          label: "Onion Rings",
          durationSec: 140,
          startedAt: initialNow - 8.1 * 60 * 1000,
          completedAt: initialNow - 5.8 * 60 * 1000,
        },
      ],
    },
    {
      id: 6,
      text: "Table 1\nBiscuits & Gravy",
      stage: 4,
      createdAt: initialNow - 12 * 60 * 1000,
      updatedAt: initialNow - 20 * 1000,
      startedAt: initialNow - 11.5 * 60 * 1000,
      expectedMinMinutes: 4,
      expectedMaxMinutes: 6,
      autoCompletedAt: initialNow - 20 * 1000,
      stationTasks: [
        {
          station: "prep",
          label: "Biscuits & Gravy",
          durationSec: 180,
          startedAt: initialNow - 11.5 * 60 * 1000,
          completedAt: initialNow - 8.5 * 60 * 1000,
        },
      ],
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
      oscillator.frequency.setValueAtTime(980, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        720,
        ctx.currentTime + 0.22
      );

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.28);
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
    }, 3600);
  }

  function maybeFireStageAlert(ticketText: string, toStage: TicketStage) {
    const ticketLabel = extractTicketLabel(ticketText);

    if (toStage === 2) {
      pushAlert("SERVER ALERT", `${ticketLabel} moved to PLATING`);
    }

    if (toStage === 3) {
      pushAlert("SERVER ALERT", `${ticketLabel} ready for pickup`);
    }
  }

  function addOrder(showAlert = true) {
    const order = pickRandom(SAMPLE_ORDERS);
    const timestamp = Date.now();

    setTickets((prev) => [
      ...prev,
      {
        id: timestamp + Math.floor(Math.random() * 1000),
        text: order.text,
        stage: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
        expectedMinMinutes: order.expectedMinMinutes,
        expectedMaxMinutes: order.expectedMaxMinutes,
        stationTasks: cloneStationTasks(order.stationTasks),
      },
    ]);

    if (showAlert) {
      pushAlert("NEW ORDER", `${extractTicketLabel(order.text)} entered`);
    }
  }

  function advanceTicketById(id: number, isAuto = false) {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== id) return ticket;
        if (ticket.stage >= 4) return ticket;

        const fromStage = ticket.stage;
        const toStage = (ticket.stage + 1) as TicketStage;
        const timestamp = Date.now();

        if (!isAuto) {
          setLastMove({
            ticketId: id,
            fromStage,
            toStage,
          });
        }

        maybeFireStageAlert(ticket.text, toStage);

        return {
          ...ticket,
          stage: toStage,
          updatedAt: timestamp,
          startedAt:
            toStage >= 1 ? ticket.startedAt ?? timestamp : ticket.startedAt,
          autoCompletedAt: toStage === 4 ? timestamp : undefined,
        };
      })
    );
  }

  function moveTicket(id: number) {
    advanceTicketById(id, false);
  }

  function undoLastMove() {
    if (!lastMove) return;

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === lastMove.ticketId
          ? {
              ...ticket,
              stage: lastMove.fromStage,
              updatedAt: Date.now(),
              autoCompletedAt: undefined,
              startedAt:
                lastMove.fromStage === 0 ? undefined : ticket.startedAt,
            }
          : ticket
      )
    );

    setLastMove(null);
  }

  useEffect(() => {
    if (!autopilot) return;

    const createInterval = window.setInterval(() => {
      const active = tickets.filter((t) => t.stage !== 4).length;
      if (active < 12) {
        addOrder(true);
      }
    }, 15000);

    return () => window.clearInterval(createInterval);
  }, [autopilot, tickets]);

  useEffect(() => {
    if (!autopilot) return;

    const stationInterval = window.setInterval(() => {
      setTickets((prev) =>
        prev.map((ticket) => {
          if (ticket.stage === 4) return ticket;

          let changed = false;
          const updatedTasks = ticket.stationTasks.map((task) => {
            if (task.completedAt) return task;

            if (!task.startedAt && ticket.stage >= 1) {
              changed = true;
              return {
                ...task,
                startedAt: Date.now(),
              };
            }

            if (task.startedAt && !task.completedAt) {
              const elapsedSec = (Date.now() - task.startedAt) / 1000;
              if (elapsedSec >= task.durationSec) {
                changed = true;
                return {
                  ...task,
                  completedAt: task.startedAt + task.durationSec * 1000,
                };
              }
            }

            return task;
          });

          return changed
            ? {
                ...ticket,
                stationTasks: updatedTasks,
              }
            : ticket;
        })
      );
    }, 1000);

    return () => window.clearInterval(stationInterval);
  }, [autopilot]);

  useEffect(() => {
    if (!autopilot) return;

    const progressInterval = window.setInterval(() => {
      setTickets((prev) => {
        const eligible = prev.filter((t) => t.stage < 4);
        if (eligible.length === 0) return prev;

        const stagePriority = [3, 2, 1, 0] as TicketStage[];
        let chosen: Ticket | undefined;

        for (const stage of stagePriority) {
          const stageTickets = eligible.filter((t) => t.stage === stage);
          if (stageTickets.length > 0) {
            chosen = pickRandom(stageTickets);
            break;
          }
        }

        if (!chosen) return prev;

        const summary = getStationSummary(chosen, Date.now());
        const timestamp = Date.now();

        let nextStage = chosen.stage;

        if (chosen.stage === 0) {
          nextStage = 1;
        } else if (chosen.stage === 1) {
          nextStage = summary.allDone ? 2 : 1;
        } else if (chosen.stage === 2) {
          nextStage = 3;
        } else if (chosen.stage === 3) {
          nextStage = 4;
        }

        if (nextStage === chosen.stage) {
          return prev;
        }

        maybeFireStageAlert(chosen.text, nextStage);

        return prev.map((ticket) =>
          ticket.id === chosen!.id
            ? {
                ...ticket,
                stage: nextStage,
                updatedAt: timestamp,
                startedAt:
                  nextStage >= 1 ? ticket.startedAt ?? timestamp : ticket.startedAt,
                autoCompletedAt: nextStage === 4 ? timestamp : undefined,
              }
            : ticket
        );
      });
    }, 8000);

    return () => window.clearInterval(progressInterval);
  }, [autopilot]);

  useEffect(() => {
    if (!autopilot) return;

    const cleanupInterval = window.setInterval(() => {
      const cutoff = Date.now() - 60000;

      setTickets((prev) =>
        prev.filter(
          (ticket) =>
            ticket.stage !== 4 ||
            !ticket.autoCompletedAt ||
            ticket.autoCompletedAt > cutoff
        )
      );
    }, 5000);

    return () => window.clearInterval(cleanupInterval);
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
          width: 320,
          pointerEvents: "none",
        }}
      >
        {alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              background: "rgba(23, 27, 35, 0.97)",
              border: "1px solid rgba(124, 58, 237, 0.5)",
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
            onClick={() => addOrder(true)}
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
            Station-Aware Autopilot {autopilot ? "ON" : "OFF"}
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
              .map((t) => {
                const elapsedMs = now - t.createdAt;
                const elapsedMinutes = elapsedMs / 60000;
                const isLate = elapsedMinutes > t.expectedMaxMinutes;
                const stationSummary = getStationSummary(t, now);

                return (
                  <div
                    key={t.id}
                    onClick={() => moveTicket(t.id)}
                    style={{
                      background: isLate ? "rgba(127, 29, 29, 0.32)" : "#2a2f38",
                      padding: 12,
                      borderRadius: 8,
                      marginBottom: 10,
                      cursor: t.stage === 4 ? "default" : "pointer",
                      whiteSpace: "pre-line",
                      lineHeight: 1.45,
                      border: isLate
                        ? "1px solid rgba(248, 113, 113, 0.45)"
                        : "1px solid rgba(255,255,255,0.05)",
                    }}
                    title={
                      t.stage === 4
                        ? "Completed ticket"
                        : "Click to move to next stage"
                    }
                  >
                    <div style={{ marginBottom: 8 }}>{t.text}</div>

                    <div
                      style={{
                        fontSize: "12px",
                        opacity: 0.86,
                        display: "grid",
                        gap: 4,
                      }}
                    >
                      <span>Received: {formatClockTime(t.createdAt)}</span>
                      <span>
                        Started: {t.startedAt ? formatClockTime(t.startedAt) : "—"}
                      </span>
                      <span>
                        Expected: {t.expectedMinMinutes}–{t.expectedMaxMinutes} min
                      </span>
                      <span>Elapsed: {formatElapsedMs(elapsedMs)}</span>
                      {isLate && (
                        <span style={{ color: "#fca5a5", fontWeight: 700 }}>
                          Running Late
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        padding: "8px 10px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.03)",
                        fontSize: 12,
                        display: "grid",
                        gap: 5,
                      }}
                    >
                      <div style={{ fontWeight: 700, opacity: 0.9 }}>
                        Stations ({stationSummary.doneCount}/{stationSummary.total})
                      </div>

                      {t.stationTasks.map((task, index) => {
                        const status = getStationStatus(task, now);

                        return (
                          <div
                            key={`${task.station}-${task.label}-${index}`}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 8,
                              opacity: status === "done" ? 0.9 : 1,
                            }}
                          >
                            <span>
                              {STATION_LABELS[task.station]}: {task.label}
                            </span>
                            <span
                              style={{
                                color:
                                  status === "done"
                                    ? "#86efac"
                                    : status === "in_progress"
                                    ? "#93c5fd"
                                    : "#cbd5e1",
                                fontWeight: 600,
                              }}
                            >
                              {status === "done"
                                ? "Done"
                                : status === "in_progress"
                                ? "Working"
                                : "Waiting"}
                            </span>
                          </div>
                        );
                      })}

                      {t.stage === 2 && !stationSummary.allDone && (
                        <div style={{ color: "#fcd34d", fontWeight: 600 }}>
                          Window waiting on stations
                        </div>
                      )}

                      {t.stage >= 2 && stationSummary.allDone && (
                        <div style={{ color: "#86efac", fontWeight: 600 }}>
                          All stations complete
                        </div>
                      )}
                    </div>

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
                      <span>⏱ Live</span>
                      {t.stage < 4 && <span>Next →</span>}
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}
