import React, { useEffect, useMemo, useRef, useState } from "react";

type LaneId = "new" | "cook" | "ready" | "done";

type Ticket = {
  id: string;
  orderNo: number;
  table: string;
  guestName: string;
  items: string[];
  mods?: string[];
  lane: LaneId;
  createdAt: number;
  priority?: "normal" | "rush";
  server?: string;
};

const laneMeta: Array<{
  id: LaneId;
  label: string;
  short: string;
  accent: string;
  pill: string;
}> = [
  {
    id: "new",
    label: "New Tickets",
    short: "NEW",
    accent: "border-cyan-400/40",
    pill: "text-cyan-200 border-cyan-400/30 bg-cyan-500/10",
  },
  {
    id: "cook",
    label: "Cooking",
    short: "COOK",
    accent: "border-amber-400/40",
    pill: "text-amber-200 border-amber-400/30 bg-amber-500/10",
  },
  {
    id: "ready",
    label: "Ready",
    short: "READY",
    accent: "border-emerald-400/40",
    pill: "text-emerald-200 border-emerald-400/30 bg-emerald-500/10",
  },
  {
    id: "done",
    label: "Completed",
    short: "DONE",
    accent: "border-zinc-400/35",
    pill: "text-zinc-200 border-white/10 bg-white/5",
  },
];

function laneLabel(id: LaneId) {
  return laneMeta.find((lane) => lane.id === id)?.label ?? id;
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function nextLane(lane: LaneId): LaneId {
  switch (lane) {
    case "new":
      return "cook";
    case "cook":
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
      return "cook";
    case "cook":
      return "new";
    default:
      return "new";
  }
}

function priorityClasses(priority?: "normal" | "rush") {
  return priority === "rush"
    ? "border-rose-400/45 bg-rose-500/12 text-rose-100"
    : "border-cyan-400/25 bg-cyan-500/10 text-cyan-100";
}

function seedTickets(now: number): Ticket[] {
  return [
    {
      id: "t-301",
      orderNo: 301,
      table: "Bar 3",
      guestName: "Miller",
      items: ["Cheeseburger", "Fries", "Sweet Tea"],
      mods: ["No onion"],
      lane: "new",
      createdAt: now - 70_000,
      priority: "normal",
      server: "Jess",
    },
    {
      id: "t-302",
      orderNo: 302,
      table: "12",
      guestName: "Daniels",
      items: ["2 Egg Breakfast", "Bacon", "Toast", "Hash Browns"],
      mods: ["Eggs over medium", "Bacon crispy", "Toast wheat"],
      lane: "new",
      createdAt: now - 2 * 60_000 - 10_000,
      priority: "normal",
      server: "Ava",
    },
    {
      id: "t-303",
      orderNo: 303,
      table: "19",
      guestName: "Perez",
      items: ["Club Sandwich", "Fries", "Ranch"],
      mods: ["Split plate", "Extra ranch"],
      lane: "cook",
      createdAt: now - 4 * 60_000 - 20_000,
      priority: "rush",
      server: "Mia",
    },
    {
      id: "t-304",
      orderNo: 304,
      table: "24",
      guestName: "Harper",
      items: ["French Toast", "Sausage", "Coffee"],
      mods: ["Light syrup", "Coffee now"],
      lane: "cook",
      createdAt: now - 5 * 60_000 - 15_000,
      priority: "normal",
      server: "Tori",
    },
    {
      id: "t-305",
      orderNo: 305,
      table: "8",
      guestName: "Bennett",
      items: ["BLT", "Chips", "Diet Coke"],
      mods: ["Cut in half"],
      lane: "ready",
      createdAt: now - 7 * 60_000,
      priority: "normal",
      server: "Jess",
    },
    {
      id: "t-306",
      orderNo: 306,
      table: "31",
      guestName: "Lopez",
      items: ["Steak & Eggs", "Bacon", "Toast"],
      mods: ["Steak rare", "Bacon extra crispy", "Toast whole grain"],
      lane: "ready",
      createdAt: now - 8 * 60_000 - 10_000,
      priority: "rush",
      server: "Ava",
    },
    {
      id: "t-307",
      orderNo: 307,
      table: "14",
      guestName: "Knight",
      items: ["Patty Melt", "Onion Rings"],
      mods: ["No pickle"],
      lane: "done",
      createdAt: now - 11 * 60_000,
      priority: "normal",
      server: "Mia",
    },
  ];
}

export default function RestaurantRushSimpleDemo() {
  const [now, setNow] = useState(Date.now());
  const [tickets, setTickets] = useState<Ticket[]>(() => seedTickets(Date.now()));
  const nextOrderRef = useRef(308);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function moveTicket(ticketId: string, targetLane: LaneId) {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, lane: targetLane } : ticket
      )
    );
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

  function addTicket() {
    const orderNo = nextOrderRef.current++;

    const pool: Array<Omit<Ticket, "id" | "orderNo" | "lane" | "createdAt">> = [
      {
        table: "7",
        guestName: "Taylor",
        items: ["Western Omelet", "Toast", "Hash Browns"],
        mods: ["No onions", "Add cheddar", "Toast rye"],
        priority: "normal",
        server: "Ava",
      },
      {
        table: "22",
        guestName: "Rivera",
        items: ["Pancake Combo", "Sausage", "Fruit Cup"],
        mods: ["Eggs scrambled soft"],
        priority: "normal",
        server: "Jess",
      },
      {
        table: "16",
        guestName: "Brooks",
        items: ["Steak & Eggs", "Toast"],
        mods: ["Steak medium rare", "Eggs sunny side up", "Toast white"],
        priority: "rush",
        server: "Mia",
      },
      {
        table: "5",
        guestName: "Allen",
        items: ["Bacon Cheeseburger", "Fries"],
        mods: ["No pickle", "Fries extra crispy"],
        priority: "normal",
        server: "Tori",
      },
      {
        table: "28",
        guestName: "Scott",
        items: ["2 Egg Breakfast", "Bacon", "Grits"],
        mods: ["Eggs over easy", "Bacon extra crispy"],
        priority: "rush",
        server: "Ava",
      },
    ];

    const pick = pool[Math.floor(Math.random() * pool.length)];

    setTickets((prev) => [
      {
        id: `t-${orderNo}`,
        orderNo,
        lane: "new",
        createdAt: Date.now(),
        ...pick,
      },
      ...prev,
    ]);
  }

  function clearCompleted() {
    setTickets((prev) => prev.filter((ticket) => ticket.lane !== "done"));
  }

  function resetBoard() {
    nextOrderRef.current = 308;
    setTickets(seedTickets(Date.now()));
  }

  const grouped = useMemo(() => {
    const map: Record<LaneId, Ticket[]> = {
      new: [],
      cook: [],
      ready: [],
      done: [],
    };

    tickets.forEach((ticket) => {
      map[ticket.lane].push(ticket);
    });

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

  const activeTickets = tickets.filter((ticket) => ticket.lane !== "done").length;
  const rushTickets = tickets.filter((ticket) => ticket.priority === "rush" && ticket.lane !== "done").length;

  return (
    <div className="min-h-screen bg-[#07111b] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.12),_transparent_28%)]" />

        <div className="relative mx-auto max-w-[1800px] px-4 py-4 md:px-5 md:py-5">
          <header className="mb-4 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Restaurant Rush Simple Demo
                </div>

                <h1 className="text-[34px] font-semibold tracking-tight text-white md:text-[40px]">
                  Pogie’s Kitchen Flow Board
                </h1>

                <p className="mt-2 max-w-4xl text-base text-white/70 md:text-lg">
                  Big, simple, readable. New tickets, cooking, ready, completed. Clear flow for cooks, servers, and owners.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={addTicket}
                  className="min-h-[60px] rounded-2xl border border-cyan-400/40 bg-cyan-500/15 px-5 py-3 text-lg font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                >
                  + Add Ticket
                </button>

                <button
                  onClick={clearCompleted}
                  className="min-h-[60px] rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-lg font-semibold text-white/90 transition hover:bg-white/10"
                >
                  Clear Completed
                </button>

                <button
                  onClick={resetBoard}
                  className="min-h-[60px] rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-5 py-3 text-lg font-semibold text-fuchsia-100 transition hover:bg-fuchsia-500/15"
                >
                  Reset Board
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Active Tickets</div>
                <div className="mt-1 text-4xl font-semibold text-white">{activeTickets}</div>
              </div>

              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-rose-200/70">Rush Orders</div>
                <div className="mt-1 text-4xl font-semibold text-rose-100">{rushTickets}</div>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-200/70">Ready Now</div>
                <div className="mt-1 text-4xl font-semibold text-emerald-100">{grouped.ready.length}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Completed</div>
                <div className="mt-1 text-4xl font-semibold text-white">{grouped.done.length}</div>
              </div>
            </div>
          </header>

          <main>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
              {laneMeta.map((lane) => (
                <section
                  key={lane.id}
                  className={`rounded-[28px] border ${lane.accent} bg-white/[0.06] p-4 shadow-xl shadow-black/20 backdrop-blur`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                        {lane.label}
                      </div>
                      <div className="mt-1 text-3xl font-semibold text-white">
                        {grouped[lane.id].length}
                      </div>
                    </div>

                    <div className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.2em] ${lane.pill}`}>
                      {lane.short}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {grouped[lane.id].map((ticket) => (
                      <SimpleTicketCard
                        key={ticket.id}
                        ticket={ticket}
                        now={now}
                        onBack={() => nudgePrev(ticket.id)}
                        onNext={() => nudgeNext(ticket.id)}
                      />
                    ))}

                    {grouped[lane.id].length === 0 && (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 px-4 py-10 text-center text-lg text-white/35">
                        No tickets
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

function SimpleTicketCard({
  ticket,
  now,
  onBack,
  onNext,
}: {
  ticket: Ticket;
  now: number;
  onBack: () => void;
  onNext: () => void;
}) {
  const elapsed = formatElapsed(now - ticket.createdAt);
  const mods = ticket.mods ?? [];
  const isFirstLane = ticket.lane === "new";
  const isLastLane = ticket.lane === "done";

  let primaryLabel = "Start Cooking";
  if (ticket.lane === "cook") primaryLabel = "Mark Ready";
  if (ticket.lane === "ready") primaryLabel = "Complete";
  if (ticket.lane === "done") primaryLabel = "Completed";

  return (
    <article className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4 shadow-xl shadow-black/20">
      <div className="mb-4 rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-3xl font-bold tracking-tight text-white">#{ticket.orderNo}</div>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${priorityClasses(
                  ticket.priority
                )}`}
              >
                {ticket.priority === "rush" ? "Rush" : "Standard"}
              </span>
            </div>

            <div className="mt-2 text-xl font-medium text-white/85">
              T{ticket.table} • {ticket.guestName}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Time</div>
            <div className="mt-1 text-3xl font-semibold text-white">{elapsed}</div>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-[20px] border border-cyan-400/12 bg-[#0a1320] px-4 py-3">
        <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-white/45">Order</div>
        <div className="space-y-2">
          {ticket.items.map((item, index) => (
            <div
              key={`${ticket.id}-item-${index}`}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-xl font-semibold text-white"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {mods.length > 0 && (
        <div className="mb-4 rounded-[20px] border border-amber-400/20 bg-amber-500/10 px-4 py-3">
          <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-amber-100/70">
            Basic Mods
          </div>
          <div className="space-y-2">
            {mods.map((mod, index) => (
              <div
                key={`${ticket.id}-mod-${index}`}
                className="rounded-xl border border-amber-300/15 bg-black/10 px-3 py-3 text-lg font-semibold text-amber-50"
              >
                {mod}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-lg text-white/85">
          <span className="text-white/45">Server:</span> {ticket.server ?? "—"}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-lg text-white/85">
          <span className="text-white/45">Status:</span> {laneLabel(ticket.lane)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onBack}
          disabled={isFirstLane}
          className="min-h-[68px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-lg font-semibold text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={isLastLane}
          className="min-h-[68px] rounded-2xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-3 text-lg font-semibold text-cyan-100 transition hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {primaryLabel}
        </button>
      </div>
    </article>
  );
}