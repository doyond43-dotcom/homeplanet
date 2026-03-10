import React, { useEffect, useMemo, useRef, useState } from "react";

type LaneId = "new" | "prep" | "cook" | "plate" | "ready" | "done";
type StationId = "expo" | "grill" | "eggs" | "toast" | "fryer";
type StationState = "idle" | "hold" | "rush" | "done";

type StationLine = {
  id: StationId;
  label: string;
  state: StationState;
};

type Ticket = {
  id: string;
  orderNo: number;
  table: string;
  guestName: string;
  items: string[];
  lane: LaneId;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  priority?: "normal" | "rush";
  notes?: string;
  server?: string;
  ticketMinutesOffset?: number;
  stationLines: StationLine[];
};

type NotificationItem = {
  id: string;
  text: string;
  ts: number;
};

const laneMeta: Array<{
  id: LaneId;
  label: string;
  accent: string;
  chip: string;
}> = [
  { id: "new", label: "Live Intake", accent: "border-cyan-400/40", chip: "text-cyan-200" },
  { id: "prep", label: "Prep", accent: "border-sky-400/35", chip: "text-sky-200" },
  { id: "cook", label: "Cooking", accent: "border-amber-400/35", chip: "text-amber-200" },
  { id: "plate", label: "Plating", accent: "border-fuchsia-400/35", chip: "text-fuchsia-200" },
  { id: "ready", label: "Ready", accent: "border-emerald-400/35", chip: "text-emerald-200" },
  { id: "done", label: "Completed", accent: "border-zinc-500/35", chip: "text-zinc-200" },
];

const laneOrder: LaneId[] = ["new", "prep", "cook", "plate", "ready", "done"];

function laneLabel(id: LaneId) {
  return laneMeta.find((l) => l.id === id)?.label ?? id;
}

function formatElapsed(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

function nextLane(lane: LaneId): LaneId {
  switch (lane) {
    case "new":
      return "prep";
    case "prep":
      return "cook";
    case "cook":
      return "plate";
    case "plate":
      return "ready";
    case "ready":
      return "done";
    default:
      return "done";
  }
}

function prevLane(lane: LaneId): LaneId {
  switch (lane) {
    case "done":
      return "ready";
    case "ready":
      return "plate";
    case "plate":
      return "cook";
    case "cook":
      return "prep";
    case "prep":
      return "new";
    default:
      return "new";
  }
}

function stationStateClasses(state: StationState) {
  switch (state) {
    case "hold":
      return "border-amber-400/45 bg-amber-500/10 text-amber-200";
    case "rush":
      return "border-rose-400/45 bg-rose-500/10 text-rose-200";
    case "done":
      return "border-emerald-400/45 bg-emerald-500/10 text-emerald-200";
    default:
      return "border-white/10 bg-white/5 text-white/65";
  }
}

function priorityClasses(priority?: "normal" | "rush") {
  return priority === "rush"
    ? "border-rose-400/50 bg-rose-500/12 text-rose-100"
    : "border-cyan-400/25 bg-cyan-500/10 text-cyan-100";
}

function createStationLines(): StationLine[] {
  return [
    { id: "expo", label: "Expo", state: "idle" },
    { id: "grill", label: "Grill", state: "idle" },
    { id: "eggs", label: "Eggs", state: "idle" },
    { id: "toast", label: "Toast", state: "idle" },
    { id: "fryer", label: "Fryer", state: "idle" },
  ];
}

function seedTickets(now: number): Ticket[] {
  return [
    {
      id: "t-201",
      orderNo: 201,
      table: "Bar 3",
      guestName: "Miller",
      items: ["Cheeseburger", "Fries", "Sweet Tea"],
      lane: "new",
      createdAt: now - 45_000,
      ticketMinutesOffset: 1,
      priority: "normal",
      server: "Jess",
      notes: "No onion",
      stationLines: createStationLines(),
    },
    {
      id: "t-202",
      orderNo: 202,
      table: "12",
      guestName: "Daniels",
      items: ["2 Egg Breakfast", "Bacon", "Toast", "Hash Browns"],
      lane: "prep",
      createdAt: now - 2 * 60_000 - 10_000,
      startedAt: now - 90_000,
      ticketMinutesOffset: 3,
      priority: "normal",
      server: "Ava",
      notes: "Eggs over medium",
      stationLines: createStationLines().map((s) =>
        s.id === "toast" ? { ...s, state: "hold" } : s
      ),
    },
    {
      id: "t-203",
      orderNo: 203,
      table: "19",
      guestName: "Perez",
      items: ["Club Sandwich", "Fries", "Ranch"],
      lane: "cook",
      createdAt: now - 3 * 60_000 - 20_000,
      startedAt: now - 2 * 60_000,
      ticketMinutesOffset: 4,
      priority: "rush",
      server: "Mia",
      notes: "Split plate",
      stationLines: createStationLines().map((s) =>
        s.id === "fryer" ? { ...s, state: "rush" } : s
      ),
    },
    {
      id: "t-204",
      orderNo: 204,
      table: "24",
      guestName: "Harper",
      items: ["French Toast", "Sausage", "Coffee"],
      lane: "cook",
      createdAt: now - 4 * 60_000 - 30_000,
      startedAt: now - 3 * 60_000,
      ticketMinutesOffset: 5,
      priority: "normal",
      server: "Tori",
      notes: "Light syrup",
      stationLines: createStationLines().map((s) =>
        s.id === "eggs" ? { ...s, state: "done" } : s
      ),
    },
    {
      id: "t-205",
      orderNo: 205,
      table: "8",
      guestName: "Bennett",
      items: ["BLT", "Chips", "Diet Coke"],
      lane: "plate",
      createdAt: now - 5 * 60_000 - 20_000,
      startedAt: now - 4 * 60_000,
      ticketMinutesOffset: 6,
      priority: "normal",
      server: "Jess",
      stationLines: createStationLines().map((s) =>
        s.id === "toast" || s.id === "grill" ? { ...s, state: "done" } : s
      ),
    },
    {
      id: "t-206",
      orderNo: 206,
      table: "31",
      guestName: "Lopez",
      items: ["Chicken Tenders", "Fries", "Mac & Cheese"],
      lane: "ready",
      createdAt: now - 6 * 60_000 - 15_000,
      startedAt: now - 5 * 60_000,
      ticketMinutesOffset: 7,
      priority: "rush",
      server: "Ava",
      notes: "Kids meal",
      stationLines: createStationLines().map((s) => ({ ...s, state: "done" })),
    },
    {
      id: "t-207",
      orderNo: 207,
      table: "14",
      guestName: "Knight",
      items: ["Patty Melt", "Onion Rings"],
      lane: "done",
      createdAt: now - 8 * 60_000,
      startedAt: now - 7 * 60_000,
      completedAt: now - 75_000,
      ticketMinutesOffset: 9,
      priority: "normal",
      server: "Mia",
      stationLines: createStationLines().map((s) => ({ ...s, state: "done" })),
    },
  ];
}

export default function RestaurantRushManualDemo() {
  const [now, setNow] = useState(Date.now());
  const [tickets, setTickets] = useState<Ticket[]>(() => seedTickets(Date.now()));
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const nextOrderRef = useRef(208);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function pushNotification(text: string) {
    const item: NotificationItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      ts: Date.now(),
    };
    setNotifications((prev) => [item, ...prev].slice(0, 5));
    window.setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== item.id));
    }, 3500);
  }

  function moveTicket(ticketId: string, targetLane: LaneId) {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        return {
          ...ticket,
          lane: targetLane,
          startedAt: ticket.startedAt ?? (targetLane !== "new" ? Date.now() : ticket.startedAt),
          completedAt:
            targetLane === "done"
              ? Date.now()
              : ticket.lane === "done"
                ? undefined
                : ticket.completedAt,
        };
      })
    );

    const moved = tickets.find((t) => t.id === ticketId);
    if (moved) {
      pushNotification(`Order #${moved.orderNo} moved to ${laneLabel(targetLane)}`);
    }
  }

  function nudgeNext(ticketId: string) {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket || ticket.lane === "done") return;
    moveTicket(ticketId, nextLane(ticket.lane));
  }

  function nudgePrev(ticketId: string) {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket || ticket.lane === "new") return;
    moveTicket(ticketId, prevLane(ticket.lane));
  }

  function updateStation(ticketId: string, stationId: StationId, state: StationState) {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        return {
          ...ticket,
          stationLines: ticket.stationLines.map((line) =>
            line.id === stationId ? { ...line, state } : line
          ),
        };
      })
    );

    const ticket = tickets.find((t) => t.id === ticketId);
    const stationLabel = ticket?.stationLines.find((s) => s.id === stationId)?.label ?? stationId;
    if (ticket) {
      const actionLabel =
        state === "hold" ? "Hold" :
        state === "rush" ? "Rush" :
        state === "done" ? "Complete" :
        "Release";
      pushNotification(`${actionLabel}: ${stationLabel} on order #${ticket.orderNo}`);
    }
  }

  function markReady(ticketId: string) {
    moveTicket(ticketId, "ready");
  }

  function markDone(ticketId: string) {
    moveTicket(ticketId, "done");
  }

  function addTicket() {
    const orderNo = nextOrderRef.current++;
    const newTicket: Ticket = {
      id: `t-${orderNo}`,
      orderNo,
      table: String(Math.floor(Math.random() * 30) + 1),
      guestName: ["Taylor", "Rivera", "Brooks", "Allen", "Scott", "Moore"][
        Math.floor(Math.random() * 6)
      ],
      items: [
        ["Western Omelet", "Toast", "Hash Browns"],
        ["Bacon Cheeseburger", "Fries"],
        ["French Dip", "Chips"],
        ["Pancake Stack", "Sausage", "Coffee"],
      ][Math.floor(Math.random() * 4)],
      lane: "new",
      createdAt: Date.now(),
      ticketMinutesOffset: 0,
      priority: Math.random() > 0.72 ? "rush" : "normal",
      server: ["Ava", "Jess", "Mia", "Tori"][Math.floor(Math.random() * 4)],
      notes: Math.random() > 0.65 ? "Guest mod on ticket" : undefined,
      stationLines: createStationLines(),
    };
    setTickets((prev) => [newTicket, ...prev]);
    pushNotification(`New order #${orderNo} added to Live Intake`);
  }

  function clearCompleted() {
    const completedCount = tickets.filter((t) => t.lane === "done").length;
    setTickets((prev) => prev.filter((t) => t.lane !== "done"));
    pushNotification(`Cleared ${completedCount} completed ticket${completedCount === 1 ? "" : "s"}`);
  }

  function resetBoard() {
    nextOrderRef.current = 208;
    setTickets(seedTickets(Date.now()));
    pushNotification("Rush demo board reset");
  }

  const grouped = useMemo(() => {
    const map: Record<LaneId, Ticket[]> = {
      new: [],
      prep: [],
      cook: [],
      plate: [],
      ready: [],
      done: [],
    };

    tickets.forEach((ticket) => map[ticket.lane].push(ticket));

    Object.values(map).forEach((list) => {
      list.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority === "rush" ? -1 : 1;
        }
        return a.createdAt - b.createdAt;
      });
    });

    return map;
  }, [tickets]);

  return (
    <div className="min-h-screen bg-[#07111b] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.12),_transparent_28%)]" />

        <div className="relative mx-auto max-w-[1540px] px-3 py-3 md:px-4 md:py-4">
          <header className="mb-3 rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Restaurant Rush Manual Demo
                </div>

                <h1 className="text-[30px] font-semibold tracking-tight text-white">
                  Pogie’s-Style Kitchen Flow Board
                </h1>

                <p className="mt-1 text-sm text-white/65">
                  Controlled demo mode. Manual movement, station-aware flow, expo controls, readable under rush.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={addTicket}
                  className="rounded-2xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/20"
                >
                  + Add Ticket
                </button>
                <button
                  onClick={clearCompleted}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10"
                >
                  Clear Completed
                </button>
                <button
                  onClick={resetBoard}
                  className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-100 transition hover:bg-fuchsia-500/15"
                >
                  Reset Board
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-6">
              {laneOrder.map((lane) => (
                <div
                  key={lane}
                  className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3"
                >
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                    {laneLabel(lane)}
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    {grouped[lane].length}
                  </div>
                </div>
              ))}
            </div>
          </header>

          <div className="pointer-events-none fixed right-4 top-4 z-50 hidden w-[300px] flex-col gap-2 xl:flex">
            {notifications.map((note) => (
              <div
                key={note.id}
                className="rounded-2xl border border-white/10 bg-[#0f1b29]/90 px-4 py-3 shadow-2xl backdrop-blur"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/80">
                  Live Update
                </div>
                <div className="mt-1 text-sm text-white/90">{note.text}</div>
              </div>
            ))}
          </div>

          <main className="pb-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
              {laneMeta.map((lane) => (
                <section
                  key={lane.id}
                  className={`rounded-[28px] border ${lane.accent} bg-white/[0.04] p-3 shadow-xl shadow-black/20 backdrop-blur`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                        {lane.label}
                      </div>
                      <div className="mt-1 text-xl font-semibold text-white">
                        {grouped[lane.id].length} ticket{grouped[lane.id].length === 1 ? "" : "s"}
                      </div>
                    </div>
                    <div className={`rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-medium ${lane.chip}`}>
                      {lane.id.toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {grouped[lane.id].map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        now={now}
                        onBack={() => nudgePrev(ticket.id)}
                        onAdvance={() => nudgeNext(ticket.id)}
                        onMove={moveTicket}
                        onStationChange={updateStation}
                        onMarkReady={() => markReady(ticket.id)}
                        onMarkDone={() => markDone(ticket.id)}
                      />
                    ))}

                    {grouped[lane.id].length === 0 && (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-3 py-8 text-center text-sm text-white/35">
                        No tickets in {lane.label}
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function TicketCard({
  ticket,
  now,
  onBack,
  onAdvance,
  onMove,
  onStationChange,
  onMarkReady,
  onMarkDone,
}: {
  ticket: Ticket;
  now: number;
  onBack: () => void;
  onAdvance: () => void;
  onMove: (ticketId: string, lane: LaneId) => void;
  onStationChange: (ticketId: string, stationId: StationId, state: StationState) => void;
  onMarkReady: () => void;
  onMarkDone: () => void;
}) {
  const elapsed = formatElapsed(now - ticket.createdAt);
  const laneIndex = laneOrder.indexOf(ticket.lane);

  return (
    <article className="rounded-[24px] border border-white/10 bg-[#0c1623] p-3 shadow-xl shadow-black/20">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-[15px] font-semibold text-white">#{ticket.orderNo}</div>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${priorityClasses(
                ticket.priority
              )}`}
            >
              {ticket.priority === "rush" ? "Rush" : "Standard"}
            </span>
          </div>
          <div className="mt-1 truncate text-sm text-white/70">
            Table {ticket.table} • {ticket.guestName}
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
            Ticket Time
          </div>
          <div className="mt-1 text-[15px] font-semibold text-white">{elapsed}</div>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {ticket.items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/80"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 text-[11px] text-white/60">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <span className="text-white/35">Server:</span>{" "}
          <span className="text-white/85">{ticket.server ?? "—"}</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <span className="text-white/35">Status:</span>{" "}
          <span className="text-white/85">{laneLabel(ticket.lane)}</span>
        </div>
      </div>

      {ticket.notes && (
        <div className="mb-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">
          Note: {ticket.notes}
        </div>
      )}

      <div className="mb-3">
        <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
          Station Sequencing
        </div>

        <div className="space-y-2">
          {ticket.stationLines.map((line) => (
            <div
              key={line.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-2.5"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-white/90">{line.label}</div>
                <div
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${stationStateClasses(
                    line.state
                  )}`}
                >
                  {line.state}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => onStationChange(ticket.id, line.id, "hold")}
                  className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-2 py-1.5 text-[10px] font-medium text-amber-100 transition hover:bg-amber-500/15"
                >
                  Hold
                </button>
                <button
                  onClick={() => onStationChange(ticket.id, line.id, "idle")}
                  className="rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] font-medium text-white/80 transition hover:bg-white/10"
                >
                  Release
                </button>
                <button
                  onClick={() => onStationChange(ticket.id, line.id, "rush")}
                  className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-2 py-1.5 text-[10px] font-medium text-rose-100 transition hover:bg-rose-500/15"
                >
                  Rush
                </button>
                <button
                  onClick={() => onStationChange(ticket.id, line.id, "done")}
                  className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-2 py-1.5 text-[10px] font-medium text-emerald-100 transition hover:bg-emerald-500/15"
                >
                  Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3 rounded-2xl border border-white/10 bg-black/20 p-2.5">
        <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
          Quick Move
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={onBack}
            disabled={laneIndex === 0}
            className="rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-[11px] font-medium text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            onClick={onAdvance}
            disabled={laneIndex === laneOrder.length - 1}
            className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-2 py-2 text-[11px] font-medium text-cyan-100 transition hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Advance →
          </button>
          <button
            onClick={() => onMove(ticket.id, "cook")}
            className="rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-2 py-2 text-[11px] font-medium text-fuchsia-100 transition hover:bg-fuchsia-500/15"
          >
            Send to Cook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={onMarkReady}
          className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-500/15"
        >
          Mark Ready
        </button>
        <button
          onClick={onMarkDone}
          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/85 transition hover:bg-white/10"
        >
          Complete Ticket
        </button>
      </div>
    </article>
  );
}