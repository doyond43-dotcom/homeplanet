import { useEffect, useMemo, useState } from "react";

type RestaurantRequest = {
  id: string;
  table: string;
  type: string;
  status: "open" | "acknowledged" | "completed";
  createdAt: number;
};

type Ticket = {
  id: string;
  table: string;
  item: string;
  notes: string;
  stage: string;
  time: string;
  flags?: string[];
  urgency?: "normal" | "watch" | "critical";
};

type TableState = {
  table: string;
  server: string;
  state: string;
  tone: string;
  health: "healthy" | "watch" | "stalled" | "ready";
  timer: string;
  mealsServed: string[];
  turns: number;
  signal: string;
  light: string;
};

const REQUEST_KEY = "hp-brahma-bull-requests";
const KITCHEN_KEY = "hp-brahma-bull-kitchen";

function readRequests(): RestaurantRequest[] {
  try {
    return JSON.parse(localStorage.getItem(REQUEST_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeRequests(requests: RestaurantRequest[]) {
  localStorage.setItem(REQUEST_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event("brahma-bull-sync"));
}

function readTickets(): Ticket[] {
  try {
    return JSON.parse(localStorage.getItem(KITCHEN_KEY) || "[]");
  } catch {
    return [];
  }
}

function flagClass(flag: string) {
  if (flag.includes("ALLERGY")) {
    return "animate-pulse bg-red-500 text-white";
  }

  if (flag.includes("NO")) {
    return "bg-amber-400 text-black";
  }

  return "bg-emerald-400 text-black";
}

function ticketBorder(urgency?: Ticket["urgency"]) {
  if (urgency === "critical") {
    return "border-red-400/60 bg-red-500/10";
  }

  if (urgency === "watch") {
    return "border-amber-400/50 bg-amber-400/10";
  }

  return "border-white/10 bg-black/40";
}

function healthClass(health: TableState["health"]) {
  if (health === "stalled") {
    return "bg-red-500 text-white";
  }

  if (health === "watch") {
    return "bg-amber-400 text-black";
  }

  if (health === "ready") {
    return "bg-sky-300 text-black";
  }

  return "bg-emerald-400 text-black";
}

const attention = [
  {
    title: "Roll Silverware",
    note: "Dining room backup risk",
  },
  {
    title: "Ranch Low",
    note: "Prep more before rush",
  },
  {
    title: "Bathroom Check",
    note: "Next check due now",
  },
  {
    title: "Ice Running Low",
    note: "Bar needs refill soon",
  },
];

const tableStates: TableState[] = [
  {
    table: "8",
    server: "Ashley",
    state: "Food Cooking",
    tone: "bg-amber-400 text-black",
    health: "watch",
    timer: "Waiting on food 8m",
    mealsServed: ["Wings + Fries", "Burger"],
    turns: 3,
    signal: "Ranch likely low. Check napkins.",
    light: "Occupied",
  },
  {
    table: "12",
    server: "Marcus",
    state: "Drinks Delivered",
    tone: "bg-emerald-400 text-black",
    health: "healthy",
    timer: "Seated 18m",
    mealsServed: ["Chicken Tenders", "Wings", "Fries"],
    turns: 5,
    signal: "High turnover. Check ketchup + silverware.",
    light: "Seated",
  },
  {
    table: "14",
    server: "Ashley",
    state: "Check Requested",
    tone: "bg-white text-black",
    health: "stalled",
    timer: "Check requested 6m ago",
    mealsServed: ["Brahma Burger", "Onion Rings"],
    turns: 2,
    signal: "Closeout soon. Prep table reset.",
    light: "Closing",
  },
  {
    table: "4",
    server: "Tina",
    state: "Ready To Seat",
    tone: "bg-sky-300 text-black",
    health: "ready",
    timer: "Open 3m",
    mealsServed: ["Recently cleared"],
    turns: 4,
    signal: "Open table. Host can seat next party.",
    light: "Lit",
  },
];

export default function BrahmaBullLiveBoard() {
  const [requests, setRequests] = useState<RestaurantRequest[]>(() =>
    readRequests()
  );

  const [tickets, setTickets] = useState<Ticket[]>(() =>
    readTickets()
  );

  useEffect(() => {
    function syncRequests() {
      setRequests(readRequests());
    }

    function syncKitchen() {
      setTickets(readTickets());
    }

    window.addEventListener("storage", syncRequests);
    window.addEventListener("storage", syncKitchen);

    window.addEventListener("brahma-bull-sync", syncRequests);
    window.addEventListener("brahma-bull-kitchen-sync", syncKitchen);

    return () => {
      window.removeEventListener("storage", syncRequests);
      window.removeEventListener("storage", syncKitchen);

      window.removeEventListener("brahma-bull-sync", syncRequests);
      window.removeEventListener("brahma-bull-kitchen-sync", syncKitchen);
    };
  }, []);

  function updateRequest(
    id: string,
    status: RestaurantRequest["status"]
  ) {
    const updated = readRequests().map((item) =>
      item.id === id ? { ...item, status } : item
    );

    writeRequests(updated);
    setRequests(updated);
  }

  const openRequests = useMemo(
    () => requests.filter((item) => item.status !== "completed"),
    [requests]
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-5 text-white">
      <section className="mx-auto max-w-7xl space-y-5">
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Brahma Bull Live Board
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Restaurant Mission Control
          </h1>

          <p className="mt-2 text-sm text-neutral-400">
            Customer requests, kitchen flow, table timers, modifier alerts, prep signals, and seating awareness.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Active Tables", "18"],
            ["Kitchen Tickets", String(tickets.length)],
            ["Open Requests", String(openRequests.length)],
            ["Ready Tables", "1"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-neutral-900 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                {label}
              </p>

              <p className="mt-2 text-3xl font-black">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-4">
            <h2 className="text-xl font-black">
              Customer Requests
            </h2>

            <div className="mt-4 space-y-3">
              {openRequests.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-neutral-400">
                  No open requests.
                </p>
              ) : (
                openRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-black">
                          Table {request.table}
                        </p>

                        <p className="text-sm text-neutral-300">
                          {request.type}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black">
                        {request.status}
                      </span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          updateRequest(request.id, "acknowledged")
                        }
                        className="rounded-xl bg-white px-3 py-2 text-xs font-black text-black"
                      >
                        Acknowledge
                      </button>

                      <button
                        onClick={() =>
                          updateRequest(request.id, "completed")
                        }
                        className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-black"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-4">
            <h2 className="text-xl font-black">
              Kitchen Flow
            </h2>

            <div className="mt-4 space-y-3">
              {tickets.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-neutral-400">
                  No kitchen tickets loaded yet.
                </p>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`rounded-2xl border p-4 ${ticketBorder(ticket.urgency)}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-black">
                          Table {ticket.table}
                        </p>

                        <p className="text-sm text-neutral-300">
                          {ticket.item}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {ticket.notes}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-black">
                        {ticket.stage}
                      </span>
                    </div>

                    {ticket.flags && ticket.flags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ticket.flags.map((flag) => (
                          <span
                            key={flag}
                            className={`rounded-full px-3 py-1 text-xs font-black ${flagClass(flag)}`}
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-3 text-sm text-neutral-500">
                      Timer {ticket.time}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-4">
            <h2 className="text-xl font-black">
              Table Awareness
            </h2>

            <div className="mt-4 space-y-3">
              {tableStates.map((table) => (
                <div
                  key={table.table}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-black">
                        Table {table.table}
                      </p>

                      <p className="text-sm text-neutral-400">
                        Server: {table.server}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${table.tone}`}
                    >
                      {table.state}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${healthClass(table.health)}`}
                    >
                      {table.health.toUpperCase()}
                    </span>

                    <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-black text-white">
                      {table.timer}
                    </span>
                  </div>

                  <div className="mt-3 rounded-2xl border border-white/10 bg-neutral-950/80 p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                      Table Signal
                    </p>

                    <p className="mt-1 text-sm text-neutral-200">
                      {table.signal}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-neutral-800 p-3">
                      <p className="text-neutral-500">
                        Turns
                      </p>

                      <p className="mt-1 font-black text-white">
                        {table.turns} recent
                      </p>
                    </div>

                    <div className="rounded-xl bg-neutral-800 p-3">
                      <p className="text-neutral-500">
                        Table Light
                      </p>

                      <p className="mt-1 font-black text-white">
                        {table.light}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-neutral-500">
                    Served: {table.mealsServed.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-4">
            <h2 className="text-xl font-black">
              Needs Attention
            </h2>

            <div className="mt-4 space-y-3">
              {attention.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <p className="text-lg font-black">
                    {item.title}
                  </p>

                  <p className="mt-1 text-sm text-neutral-400">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
