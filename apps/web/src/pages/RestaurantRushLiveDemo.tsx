import React, { useEffect, useMemo, useRef, useState } from "react";

type LaneId = "new" | "cook" | "ready" | "done";
type AlertTone = "info" | "success" | "warning" | "rush";

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

type AlertItem = {
  id: string;
  title: string;
  body: string;
  tone: AlertTone;
  createdAt: number;
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

function sampleTicket(orderNo: number): Omit<Ticket, "id" | "orderNo" | "lane" | "createdAt"> {
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

  return pool[orderNo % pool.length];
}

function alertToneClass(tone: AlertTone) {
  switch (tone) {
    case "success":
      return "border-emerald-400/30 bg-emerald-500/12 text-emerald-100";
    case "warning":
      return "border-amber-400/30 bg-amber-500/12 text-amber-100";
    case "rush":
      return "border-rose-400/35 bg-rose-500/14 text-rose-100";
    default:
      return "border-cyan-400/30 bg-cyan-500/12 text-cyan-100";
  }
}

export default function RestaurantRushLiveDemo() {
  const [now, setNow] = useState(Date.now());
  const [tickets, setTickets] = useState<Ticket[]>(() => seedTickets(Date.now()));
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "seed-1",
      title: "Server Alert",
      body: "Table 31 ready for pickup • Ava",
      tone: "success",
      createdAt: Date.now() - 4000,
    },
    {
      id: "seed-2",
      title: "Owner Alert",
      body: "Hash browns getting low • prep more now",
      tone: "warning",
      createdAt: Date.now() - 7000,
    },
  ]);

  const nextOrderRef = useRef(308);
  const autoAlertIndexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setAlerts((prev) => prev.filter((a) => Date.now() - a.createdAt < 12000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  useEffect(() => {
    const scripted: Array<Omit<AlertItem, "id" | "createdAt">> = [
      {
        title: "Bus Alert",
        body: "Table 7 completed • bus table",
        tone: "info",
      },
      {
        title: "Owner Alert",
        body: "Onions getting low • prep more now",
        tone: "warning",
      },
      {
        title: "Owner Alert",
        body: "Salisbury steak low • 3 portions left",
        tone: "warning",
      },
      {
        title: "Owner Alert",
        body: "Flour bin down to 20% • refill before dinner",
        tone: "warning",
      },
      {
        title: "Rush Alert",
        body: "Rush mode building • multiple rush tickets active",
        tone: "rush",
      },
      {
        title: "Owner Alert",
        body: "Potatoes getting low • hash browns running short",
        tone: "warning",
      },
    ];

    const timer = setInterval(() => {
      const next = scripted[autoAlertIndexRef.current % scripted.length];
      autoAlertIndexRef.current += 1;
      pushAlert(next.title, next.body, next.tone);
    }, 9000);

    return () => clearInterval(timer);
  }, []);

  function pushAlert(title: string, body: string, tone: AlertTone) {
    setAlerts((prev) => [
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title,
        body,
        tone,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }

  function moveTicket(id: string, lane: LaneId) {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, lane } : t)));
  }

  function nudgeNext(id: string) {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket || ticket.lane === "done") return;

    const targetLane = nextLane(ticket.lane);
    moveTicket(id, targetLane);

    if (targetLane === "cook") {
      pushAlert(
        ticket.priority === "rush" ? "Rush Alert" : "Kitchen Started",
        `Order #${ticket.orderNo} started • Table ${ticket.table}`,
        ticket.priority === "rush" ? "rush" : "info"
      );
    }

    if (targetLane === "ready") {
      pushAlert(
        "Server Alert",
        `Table ${ticket.table} ready for pickup • ${ticket.server ?? "Server"}`,
        "success"
      );
    }

    if (targetLane === "done") {
      pushAlert(
        "Bus Alert",
        `Table ${ticket.table} completed • bus table`,
        "info"
      );
    }
  }

  function nudgePrev(id: string) {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket || ticket.lane === "new") return;

    const targetLane = prevLane(ticket.lane);
    moveTicket(id, targetLane);

    pushAlert(
      "Status Update",
      `Order #${ticket.orderNo} moved back to ${laneLabel(targetLane)}`,
      "info"
    );
  }

  function addTicket() {
    const orderNo = nextOrderRef.current++;
    const pick = sampleTicket(orderNo);

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

    pushAlert(
      pick.priority === "rush" ? "Rush Alert" : "New Ticket",
      `Table ${pick.table} added • Order #${orderNo}`,
      pick.priority === "rush" ? "rush" : "info"
    );
  }

  function clearCompleted() {
    const doneCount = tickets.filter((t) => t.lane === "done").length;
    setTickets((prev) => prev.filter((t) => t.lane !== "done"));
    if (doneCount > 0) {
      pushAlert("Board Update", `Cleared ${doneCount} completed ticket${doneCount > 1 ? "s" : ""}`, "info");
    }
  }

  function resetBoard() {
    nextOrderRef.current = 308;
    setTickets(seedTickets(Date.now()));
    setAlerts([]);
    pushAlert("Board Reset", "Mom's Kitchen live rush demo reset", "info");
  }

  const grouped = useMemo(() => {
    const map: Record<LaneId, Ticket[]> = { new: [], cook: [], ready: [], done: [] };
    tickets.forEach((t) => map[t.lane].push(t));
    return map;
  }, [tickets]);

  const active = tickets.filter((t) => t.lane !== "done").length;
  const rushCount = tickets.filter((t) => t.priority === "rush" && t.lane !== "done").length;

  return (
    <div className="min-h-screen bg-[#07111b] text-white">
      <div className="mx-auto max-w-7xl px-4 py-4">
        {/* HEADER */}
        <header className="rounded-3xl border border-white/10 bg-white/5 p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-3">
            <div>
              <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-wider text-cyan-200">
                Restaurant Rush Live Demo
              </div>

              <h1 className="mt-2 text-3xl md:text-4xl font-bold">
                Mom&apos;s Kitchen Flow Board
              </h1>

              <p className="text-white/70 mt-2 max-w-2xl">
                Big, simple, readable. New tickets, cooking, ready, completed. Clear flow for cooks, servers, and owners.
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={addTicket}
                className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-sm"
              >
                + Add Ticket
              </button>
              <button
                onClick={clearCompleted}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
              >
                Clear Completed
              </button>
              <button
                onClick={resetBoard}
                className="rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-2 text-sm"
              >
                Reset Board
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <Metric label="Active Tickets" value={active} />
            <Metric label="Rush Orders" value={rushCount} />
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

        {/* NOTIFICATIONS */}
        <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,360px)] flex-col gap-2">
          {alerts.slice(0, 4).map((alert) => (
            <div
              key={alert.id}
              className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl shadow-black/30 ${alertToneClass(alert.tone)}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">
                {alert.title}
              </div>
              <div className="mt-1 text-sm font-semibold">{alert.body}</div>
            </div>
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