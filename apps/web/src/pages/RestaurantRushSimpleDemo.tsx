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

const laneMeta = [
  { id: "new", label: "New Tickets", short: "NEW", accent: "border-cyan-400/40", pill: "text-cyan-200 border-cyan-400/30 bg-cyan-500/10" },
  { id: "cook", label: "Cooking", short: "COOK", accent: "border-amber-400/40", pill: "text-amber-200 border-amber-400/30 bg-amber-500/10" },
  { id: "ready", label: "Ready", short: "READY", accent: "border-emerald-400/40", pill: "text-emerald-200 border-emerald-400/30 bg-emerald-500/10" },
  { id: "done", label: "Completed", short: "DONE", accent: "border-zinc-400/35", pill: "text-zinc-200 border-white/10 bg-white/5" },
] as const;

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
      createdAt: now - 70000,
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
      createdAt: now - 120000,
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
      createdAt: now - 260000,
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
      createdAt: now - 320000,
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
      createdAt: now - 420000,
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
      createdAt: now - 480000,
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
      createdAt: now - 600000,
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
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  function moveTicket(id: string, lane: LaneId) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, lane } : t)));
  }

  function nudgeNext(id: string) {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket || ticket.lane === "done") return;
    moveTicket(id, nextLane(ticket.lane));
  }

  function nudgePrev(id: string) {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket || ticket.lane === "new") return;
    moveTicket(id, prevLane(ticket.lane));
  }

  const grouped = useMemo(() => {
    const map: Record<LaneId, Ticket[]> = { new: [], cook: [], ready: [], done: [] };
    tickets.forEach((t) => map[t.lane].push(t));
    return map;
  }, [tickets]);

  const active = tickets.filter((t) => t.lane !== "done").length;

  return (
    <div className="min-h-screen bg-[#07111b] text-white">
      <div className="mx-auto max-w-7xl px-4 py-4">

        {/* HEADER */}
        <header className="rounded-3xl border border-white/10 bg-white/5 p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-3">

            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-cyan-200">
                Restaurant Rush Demo
              </div>

              <h1 className="mt-2 text-3xl md:text-4xl font-bold">
                Mom's Kitchen Flow Board
              </h1>

              <p className="text-white/70 mt-2 max-w-2xl">
                Big, simple, readable. New tickets, cooking, ready, completed. Clear flow for cooks, servers, and owners.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm">
                + Add Ticket
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
                Clear Completed
              </button>
              <button className="rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-sm">
                Reset Board
              </button>
            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <Metric label="Active Tickets" value={active} />
            <Metric label="Rush Orders" value={2} />
            <Metric label="Ready Now" value={grouped.ready.length} />
            <Metric label="Completed" value={grouped.done.length} />
          </div>
        </header>

        {/* LANES */}
        <div className="flex xl:grid xl:grid-cols-4 gap-3 overflow-x-auto pb-2">
          {laneMeta.map((lane) => (
            <section key={lane.id} className="min-w-[280px] xl:min-w-0 rounded-3xl border border-white/10 bg-white/5 p-3">

              <div className="flex justify-between mb-3">
                <div>
                  <div className="text-xs text-white/50 uppercase">{lane.label}</div>
                  <div className="text-2xl font-bold">{grouped[lane.id].length}</div>
                </div>

                <div className={`rounded-full border px-3 py-1 text-xs ${lane.pill}`}>
                  {lane.short}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {grouped[lane.id].map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    now={now}
                    onNext={() => nudgeNext(ticket.id)}
                    onBack={() => nudgePrev(ticket.id)}
                  />
                ))}
              </div>

            </section>
          ))}
        </div>

      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
      <div className="text-xs text-white/50 uppercase">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

function TicketCard({
  ticket,
  now,
  onNext,
  onBack,
}: {
  ticket: Ticket;
  now: number;
  onNext: () => void;
  onBack: () => void;
}) {
  const elapsed = formatElapsed(now - ticket.createdAt);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1623] p-3">

      <div className="flex justify-between mb-2">
        <div className="font-bold">#{ticket.orderNo}</div>
        <div className="text-sm text-white/70">{elapsed}</div>
      </div>

      <div className="text-sm text-white/80 mb-2">
        T{ticket.table} • {ticket.guestName}
      </div>

      <div className="space-y-1 text-sm">
        {ticket.items.map((item, i) => (
          <div key={i} className="border border-white/10 rounded-lg px-2 py-1">
            {item}
          </div>
        ))}
      </div>

      {ticket.mods && (
        <div className="mt-2 flex flex-wrap gap-1">
          {ticket.mods.map((m, i) => (
            <span key={i} className="text-xs border border-amber-400/30 bg-amber-500/10 px-2 py-1 rounded-full">
              {m}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mt-3">
        <button onClick={onBack} className="border border-white/10 rounded-lg py-2 text-sm">
          Back
        </button>
        <button onClick={onNext} className="border border-cyan-400/30 bg-cyan-500/10 rounded-lg py-2 text-sm">
          Next
        </button>
      </div>

    </div>
  );
}