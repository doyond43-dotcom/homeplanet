// src/pages/RestaurantRushDemo.tsx
import { useEffect, useMemo, useRef, useState } from "react";

type TicketStage = 0 | 1 | 2 | 3 | 4;
type StationKey = "grill" | "fryer" | "drinks" | "prep" | "toast";
type StationStatus = "waiting" | "in_progress" | "held" | "done";

type StationTask = {
  station: StationKey;
  label: string;
  durationSec: number;
  startedAt?: number;
  completedAt?: number;
  isHeld?: boolean;
  holdStartedAt?: number;
  pausedMs?: number;
  rushBoost?: boolean;
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
  assignedServer: string;
  highlightNew?: boolean;
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

type IntakeEvent = {
  id: number;
  text: string;
  assignedServer: string;
  createdAt: number;
  stationSummary: string;
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

const SERVER_NAMES = ["Angela", "Kiana", "Darla", "Maria", "Jess", "Tina"];

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
  return tasks.map((task) => ({
    ...task,
    pausedMs: 0,
    rushBoost: false,
    isHeld: false,
  }));
}

function getEffectiveDurationSec(task: StationTask) {
  return task.rushBoost ? Math.max(8, Math.floor(task.durationSec * 0.6)) : task.durationSec;
}

function getTaskElapsedMs(task: StationTask, now: number) {
  if (!task.startedAt) return 0;

  const pausedMs = task.pausedMs ?? 0;
  const currentHoldMs =
    task.isHeld && task.holdStartedAt ? Math.max(0, now - task.holdStartedAt) : 0;

  return Math.max(0, now - task.startedAt - pausedMs - currentHoldMs);
}

function getStationStatus(task: StationTask, now: number): StationStatus {
  if (task.completedAt) return "done";
  if (task.isHeld) return "held";
  if (task.startedAt) {
    const elapsed = getTaskElapsedMs(task, now) / 1000;
    if (elapsed >= getEffectiveDurationSec(task)) return "done";
    return "in_progress";
  }
  return "waiting";
}

function getStationSummary(ticket: Ticket, now: number) {
  const statuses = ticket.stationTasks.map((task) => getStationStatus(task, now));
  const doneCount = statuses.filter((s) => s === "done").length;
  const inProgressCount = statuses.filter((s) => s === "in_progress").length;
  const heldCount = statuses.filter((s) => s === "held").length;
  const total = ticket.stationTasks.length;

  return {
    doneCount,
    inProgressCount,
    heldCount,
    total,
    allDone: doneCount === total && total > 0,
  };
}

function makeIntakeSummary(tasks: StationTask[]) {
  const unique = Array.from(new Set(tasks.map((t) => STATION_LABELS[t.station])));
  return unique.join(" • ");
}

function buildSeededTicket(
  baseId: number,
  template: OrderTemplate,
  assignedServer: string,
  stage: TicketStage,
  minutesAgo: number,
  startedMinutesAgo?: number,
  doneStationIndexes: number[] = []
): Ticket {
  const createdAt = Date.now() - minutesAgo * 60_000;
  const startedAt =
    startedMinutesAgo !== undefined
      ? Date.now() - startedMinutesAgo * 60_000
      : undefined;

  const stationTasks = cloneStationTasks(template.stationTasks).map((task, index) => {
    if (!startedAt || stage === 0) return task;

    const defaultStartedAt = startedAt;
    const completedAt = doneStationIndexes.includes(index)
      ? defaultStartedAt + getEffectiveDurationSec(task) * 1000
      : undefined;

    return {
      ...task,
      startedAt: defaultStartedAt,
      completedAt,
    };
  });

  return {
    id: baseId,
    text: template.text,
    stage,
    createdAt,
    updatedAt: createdAt,
    startedAt,
    expectedMinMinutes: template.expectedMinMinutes,
    expectedMaxMinutes: template.expectedMaxMinutes,
    assignedServer,
    autoCompletedAt: stage === 4 ? createdAt + 45_000 : undefined,
    stationTasks,
    highlightNew: stage === 0,
  };
}

export default function RestaurantRushDemo() {
  const initialNow = Date.now();

  const [now, setNow] = useState(initialNow);
  const [intakeFeed, setIntakeFeed] = useState<IntakeEvent[]>([
    {
      id: 9001,
      text: "Table 14\nCoffee",
      assignedServer: "Angela",
      createdAt: initialNow - 45_000,
      stationSummary: "Drinks",
    },
    {
      id: 9002,
      text: "Table 20\nSide Fries",
      assignedServer: "Kiana",
      createdAt: initialNow - 90_000,
      stationSummary: "Fryer",
    },
    {
      id: 9003,
      text: "Table 16\n2 Eggs • Bacon • Toast\nPancakes • Sausage",
      assignedServer: "Darla",
      createdAt: initialNow - 140_000,
      stationSummary: "Grill • Toast",
    },
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
    buildSeededTicket(1, SAMPLE_ORDERS[6], "Angela", 0, 2),
    buildSeededTicket(2, SAMPLE_ORDERS[4], "Kiana", 0, 1),
    buildSeededTicket(3, SAMPLE_ORDERS[3], "Maria", 1, 5, 4),
    buildSeededTicket(4, SAMPLE_ORDERS[7], "Darla", 1, 4, 3.5, [1]),
    buildSeededTicket(5, SAMPLE_ORDERS[13], "Jess", 1, 1.4, 1),
    buildSeededTicket(6, SAMPLE_ORDERS[10], "Tina", 2, 7, 6, [0, 1]),
    buildSeededTicket(7, SAMPLE_ORDERS[8], "Angela", 3, 9, 8, [0, 1]),
    buildSeededTicket(8, SAMPLE_ORDERS[1], "Maria", 4, 11, 10, [0, 1]),
  ]);

  const [lastMove, setLastMove] = useState<MoveSnapshot | null>(null);
  const [autopilot, setAutopilot] = useState(true);
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 1,
      title: "SERVER ALERT",
      message: "Angela • Table 14 ready for pickup",
    },
    {
      id: 2,
      title: "SERVER ALERT",
      message: "Darla • Table 12 plating",
    },
  ]);
  const [soundOn, setSoundOn] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!tickets.some((t) => t.highlightNew)) return;

    const timeout = window.setTimeout(() => {
      setTickets((prev) => prev.map((t) => ({ ...t, highlightNew: false })));
    }, 2400);

    return () => window.clearTimeout(timeout);
  }, [tickets]);

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
      gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch {
      // ignore audio issues in demo mode
    }
  }

  function pushAlert(title: string, message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);

    setAlerts((prev) => [...prev.slice(-3), { id, title, message }]);
    playChime();

    window.setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 4600);
  }

  function maybeFireStageAlert(ticket: Ticket, toStage: TicketStage) {
    const ticketLabel = extractTicketLabel(ticket.text);

    if (toStage === 2) {
      pushAlert(
        "SERVER ALERT",
        `${ticket.assignedServer} • ${ticketLabel} plating`
      );
    }

    if (toStage === 3) {
      pushAlert(
        "SERVER ALERT",
        `${ticket.assignedServer} • ${ticketLabel} ready for pickup`
      );
    }
  }

  function addOrder(showTopAlert = true) {
    const order = pickRandom(SAMPLE_ORDERS);
    const timestamp = Date.now();
    const assignedServer = pickRandom(SERVER_NAMES);
    const id = timestamp + Math.floor(Math.random() * 1000);
    const stationTasks = cloneStationTasks(order.stationTasks);

    setTickets((prev) => [
      ...prev,
      {
        id,
        text: order.text,
        stage: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
        expectedMinMinutes: order.expectedMinMinutes,
        expectedMaxMinutes: order.expectedMaxMinutes,
        stationTasks,
        assignedServer,
        highlightNew: true,
      },
    ]);

    setIntakeFeed((prev) =>
      [
        {
          id,
          text: order.text,
          assignedServer,
          createdAt: timestamp,
          stationSummary: makeIntakeSummary(stationTasks),
        },
        ...prev,
      ].slice(0, 7)
    );

    if (showTopAlert) {
      pushAlert(
        "INTAKE",
        `${assignedServer} • ${extractTicketLabel(order.text)} entered`
      );
    }
  }

  function setTaskHold(
    ticketId: number,
    taskIndex: number,
    shouldHold: boolean
  ) {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;

        const updatedTasks = ticket.stationTasks.map((task, index) => {
          if (index !== taskIndex || task.completedAt) return task;

          if (shouldHold) {
            if (task.isHeld) return task;
            return {
              ...task,
              isHeld: true,
              holdStartedAt: Date.now(),
            };
          }

          if (!task.isHeld) return task;

          return {
            ...task,
            isHeld: false,
            pausedMs:
              (task.pausedMs ?? 0) +
              (task.holdStartedAt ? Date.now() - task.holdStartedAt : 0),
            holdStartedAt: undefined,
          };
        });

        return {
          ...ticket,
          stationTasks: updatedTasks,
        };
      })
    );

    const ticket = tickets.find((t) => t.id === ticketId);
    const task = ticket?.stationTasks[taskIndex];
    if (ticket && task) {
      pushAlert(
        "EXPO CONTROL",
        `${shouldHold ? "Hold" : "Release"} • ${extractTicketLabel(
          ticket.text
        )} • ${STATION_LABELS[task.station]}`
      );
    }
  }

  function toggleTaskRush(ticketId: number, taskIndex: number) {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;

        const updatedTasks = ticket.stationTasks.map((task, index) => {
          if (index !== taskIndex || task.completedAt) return task;
          return {
            ...task,
            rushBoost: !task.rushBoost,
          };
        });

        return {
          ...ticket,
          stationTasks: updatedTasks,
        };
      })
    );

    const ticket = tickets.find((t) => t.id === ticketId);
    const task = ticket?.stationTasks[taskIndex];
    if (ticket && task) {
      pushAlert(
        "EXPO CONTROL",
        `Rush • ${extractTicketLabel(ticket.text)} • ${STATION_LABELS[task.station]}`
      );
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

        maybeFireStageAlert(ticket, toStage);

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
      if (active < 13) {
        addOrder(true);
      }
    }, 11000);

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

            if (!task.startedAt && ticket.stage >= 1 && !task.isHeld) {
              changed = true;
              return {
                ...task,
                startedAt: Date.now(),
              };
            }

            if (task.startedAt && !task.completedAt) {
              if (task.isHeld) return task;

              const elapsedSec = getTaskElapsedMs(task, Date.now()) / 1000;
              if (elapsedSec >= getEffectiveDurationSec(task)) {
                changed = true;
                return {
                  ...task,
                  completedAt: Date.now(),
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

        maybeFireStageAlert(chosen, nextStage);

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
    }, 7000);

    return () => window.clearInterval(progressInterval);
  }, [autopilot]);

  useEffect(() => {
    if (!autopilot) return;

    const cleanupInterval = window.setInterval(() => {
      const cutoff = Date.now() - 75000;

      setTickets((prev) =>
        prev.filter(
          (ticket) =>
            ticket.stage !== 4 ||
            !ticket.autoCompletedAt ||
            ticket.autoCompletedAt > cutoff
        )
      );
    }, 6000);

    return () => window.clearInterval(cleanupInterval);
  }, [autopilot]);

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "white",
        padding: "20px",
        background:
          "radial-gradient(circle at top left, rgba(124,58,237,0.12), transparent 28%), radial-gradient(circle at top right, rgba(59,130,246,0.10), transparent 24%), linear-gradient(180deg, #0b0f16 0%, #0f1116 55%, #0b0d12 100%)",
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
          width: 340,
          pointerEvents: "none",
        }}
      >
        {alerts.map((alert) => (
          <div
            key={alert.id}
            style={{
              background: "rgba(23, 27, 35, 0.98)",
              border: "1px solid rgba(124, 58, 237, 0.55)",
              borderRadius: 12,
              padding: "12px 14px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              backdropFilter: "blur(6px)",
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
          <h1 style={{ margin: 0 }}>🍽️ Restaurant Rush Demo</h1>
          <div style={{ opacity: 0.8, marginTop: "6px", fontSize: "14px" }}>
            {activeCount} Active • Avg {avgMinutes}m • Busy Period
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
          gridTemplateColumns: "240px 1fr 1fr 1fr 1fr 0.82fr",
          gap: 14,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "rgba(22, 27, 36, 0.88)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: 12,
            minHeight: 640,
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              marginBottom: 6,
            }}
          >
            LIVE INTAKE
          </div>
          <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 12 }}>
            Orders landing before the floor picks them up
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {intakeFeed.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "rgba(124, 58, 237, 0.10)",
                  border: "1px solid rgba(124, 58, 237, 0.30)",
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: 4 }}>
                  {extractTicketLabel(item.text)}
                </div>
                <div style={{ opacity: 0.88, marginBottom: 8, whiteSpace: "pre-line" }}>
                  {item.text.split("\n").slice(1).join("\n")}
                </div>
                <div style={{ fontSize: 12, display: "grid", gap: 4, opacity: 0.82 }}>
                  <span>Server: {item.assignedServer}</span>
                  <span>Received: {formatClockTime(item.createdAt)}</span>
                  <span>Stations: {item.stationSummary}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {stages.map((stage, stageIndex) => {
          const isCompleted = stage === "COMPLETED";

          return (
            <div
              key={stage}
              style={{
                background: "rgba(27, 31, 39, 0.88)",
                padding: 10,
                borderRadius: 10,
                minHeight: 640,
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(6px)",
                opacity: isCompleted ? 0.94 : 1,
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
                        background: isLate
                          ? "rgba(127, 29, 29, 0.32)"
                          : t.stage === 0 && t.highlightNew
                          ? "rgba(124, 58, 237, 0.16)"
                          : "#2a2f38",
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 10,
                        cursor: t.stage === 4 ? "default" : "pointer",
                        whiteSpace: "pre-line",
                        lineHeight: 1.45,
                        border: isLate
                          ? "1px solid rgba(248, 113, 113, 0.45)"
                          : t.stage === 0 && t.highlightNew
                          ? "1px solid rgba(124, 58, 237, 0.50)"
                          : "1px solid rgba(255,255,255,0.05)",
                        boxShadow:
                          t.stage === 0 && t.highlightNew
                            ? "0 0 0 1px rgba(124,58,237,0.18), 0 0 22px rgba(124,58,237,0.18)"
                            : "none",
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
                        <span>Server: {t.assignedServer}</span>
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
                          gap: 6,
                        }}
                      >
                        <div style={{ fontWeight: 700, opacity: 0.9 }}>
                          Stations ({stationSummary.doneCount}/{stationSummary.total})
                          {stationSummary.heldCount > 0 && (
                            <span style={{ color: "#fcd34d", marginLeft: 8 }}>
                              • {stationSummary.heldCount} holding
                            </span>
                          )}
                        </div>

                        {t.stationTasks.map((task, index) => {
                          const status = getStationStatus(task, now);

                          return (
                            <div
                              key={`${task.station}-${task.label}-${index}`}
                              style={{
                                display: "grid",
                                gap: 6,
                                padding: "6px 8px",
                                borderRadius: 8,
                                background:
                                  status === "held"
                                    ? "rgba(245, 158, 11, 0.10)"
                                    : "rgba(255,255,255,0.02)",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  gap: 8,
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
                                        : status === "held"
                                        ? "#fcd34d"
                                        : "#cbd5e1",
                                    fontWeight: 600,
                                  }}
                                >
                                  {status === "done"
                                    ? "Done"
                                    : status === "in_progress"
                                    ? "Working"
                                    : status === "held"
                                    ? "Holding"
                                    : "Waiting"}
                                  {task.rushBoost && status !== "done" ? " • Rush" : ""}
                                </span>
                              </div>

                              {status !== "done" && (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: 6,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {!task.isHeld ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTaskHold(t.id, index, true);
                                      }}
                                      style={{
                                        padding: "4px 8px",
                                        borderRadius: 6,
                                        border: "1px solid rgba(245, 158, 11, 0.35)",
                                        background: "rgba(245, 158, 11, 0.12)",
                                        color: "#fcd34d",
                                        cursor: "pointer",
                                        fontSize: 11,
                                        fontWeight: 700,
                                      }}
                                    >
                                      Hold
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setTaskHold(t.id, index, false);
                                      }}
                                      style={{
                                        padding: "4px 8px",
                                        borderRadius: 6,
                                        border: "1px solid rgba(34, 197, 94, 0.35)",
                                        background: "rgba(34, 197, 94, 0.12)",
                                        color: "#86efac",
                                        cursor: "pointer",
                                        fontSize: 11,
                                        fontWeight: 700,
                                      }}
                                    >
                                      Release
                                    </button>
                                  )}

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTaskRush(t.id, index);
                                    }}
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: 6,
                                      border: task.rushBoost
                                        ? "1px solid rgba(236, 72, 153, 0.45)"
                                        : "1px solid rgba(59, 130, 246, 0.30)",
                                      background: task.rushBoost
                                        ? "rgba(236, 72, 153, 0.14)"
                                        : "rgba(59, 130, 246, 0.10)",
                                      color: task.rushBoost ? "#f9a8d4" : "#93c5fd",
                                      cursor: "pointer",
                                      fontSize: 11,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {task.rushBoost ? "Rush ON" : "Rush"}
                                  </button>
                                </div>
                              )}
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
          );
        })}
      </div>
    </div>
  );
}