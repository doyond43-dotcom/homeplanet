import { useMemo, useState } from "react";

type RestaurantRequest = {
  id: string;
  table: string;
  type: string;
  status: "open" | "acknowledged" | "completed";
  createdAt: number;
};

type TicketStage = "New" | "Cooking" | "Ready" | "Delivered";

type Ticket = {
  id: string;
  table: string;
  item: string;
  notes: string;
  stage: TicketStage;
  time: string;
  flags: string[];
  urgency: "normal" | "watch" | "critical";
};

type MenuItem = {
  id: string;
  name: string;
  price: string;
  description: string;
  flags: string[];
  urgency: "normal" | "watch" | "critical";
};

const REQUEST_KEY = "hp-brahma-bull-requests";
const KITCHEN_KEY = "hp-brahma-bull-kitchen";

const menuItems: MenuItem[] = [
  {
    id: "burger",
    name: "Brahma Burger",
    price: "$14",
    description: "Double smash burger, cheddar, house sauce, fries included.",
    flags: ["NO TOMATO", "NO MAYO"],
    urgency: "watch",
  },
  {
    id: "wings",
    name: "Wings + Fries",
    price: "$13",
    description: "Crispy wings, fries, ranch or blue cheese.",
    flags: ["EXTRA RANCH"],
    urgency: "normal",
  },
  {
    id: "tenders",
    name: "Chicken Tenders",
    price: "$12",
    description: "Hand-breaded tenders with honey mustard.",
    flags: ["ALLERGY", "HONEY MUSTARD"],
    urgency: "critical",
  },
];

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
    const saved = localStorage.getItem(KITCHEN_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function writeTickets(tickets: Ticket[]) {
  localStorage.setItem(KITCHEN_KEY, JSON.stringify(tickets));
  window.dispatchEvent(new Event("brahma-bull-kitchen-sync"));
}

function flagClass(flag: string) {
  if (flag.includes("ALLERGY")) return "bg-red-500 text-white";
  if (flag.includes("NO")) return "bg-amber-400 text-black";
  return "bg-emerald-400 text-black";
}

export default function BrahmaBullFrontDoor() {
  const [table, setTable] = useState("14");
  const [requests, setRequests] = useState<RestaurantRequest[]>(() => readRequests());
  const [sent, setSent] = useState("");

  function createRequest(type: string) {
    const next: RestaurantRequest = {
      id: crypto.randomUUID(),
      table,
      type,
      status: "open",
      createdAt: Date.now(),
    };

    const updated = [next, ...readRequests()];
    writeRequests(updated);
    setRequests(updated);
    setSent(`${type} sent from Table ${table}`);
  }

  function sendToKitchen(item: MenuItem) {
    const next: Ticket = {
      id: crypto.randomUUID(),
      table,
      item: item.name,
      notes: item.flags.length ? item.flags.join(", ").toLowerCase() : "Standard order",
      stage: "New",
      time: "00:01",
      flags: item.flags,
      urgency: item.urgency,
    };

    const updated = [next, ...readTickets()];
    writeTickets(updated);
    setSent(`${item.name} sent to kitchen from Table ${table}`);
  }

  const openCount = useMemo(
    () => requests.filter((item) => item.status !== "completed").length,
    [requests]
  );

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-6 text-white">
      <section className="mx-auto max-w-md space-y-5">
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            HomePlanet Live Restaurant
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight">Brahma Bull</h1>

          <p className="mt-2 text-sm text-neutral-300">
            Table requests, menu ordering, kitchen flow, and crew updates in one live system.
          </p>

          <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-sm font-semibold text-emerald-200">Table QR Mode</p>

            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-neutral-400">Table</span>

              <input
                value={table}
                onChange={(event) => setTable(event.target.value)}
                className="w-24 rounded-xl border border-white/10 bg-black px-3 py-2 text-center text-lg font-bold text-white outline-none"
              />

              <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-black">
                {openCount} open
              </span>
            </div>
          </div>

          {sent && (
            <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm font-bold text-emerald-200">
              {sent}
            </div>
          )}
        </div>

        <div className="grid gap-3">
          <button onClick={() => createRequest("Request Server")} className="rounded-2xl bg-white px-5 py-4 text-left text-lg font-black text-black">
            Request Server
          </button>

          <button onClick={() => createRequest("Request Refill")} className="rounded-2xl bg-emerald-400 px-5 py-4 text-left text-lg font-black text-black">
            Request Refill
          </button>

          <button onClick={() => createRequest("Request Check")} className="rounded-2xl bg-amber-400 px-5 py-4 text-left text-lg font-black text-black">
            Request Check
          </button>

          <button onClick={() => createRequest("Need To-Go Box")} className="rounded-2xl border border-white/10 bg-neutral-900 px-5 py-4 text-left text-lg font-black text-white">
            Need To-Go Box
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
                Live Menu
              </p>
              <h2 className="mt-2 text-2xl font-black">Order From Table {table}</h2>
            </div>

            <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-black text-neutral-200">
              Demo
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {menuItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-black">{item.name}</p>
                    <p className="mt-1 text-sm text-neutral-400">{item.description}</p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-black">
                    {item.price}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.flags.map((flag) => (
                    <span key={flag} className={`rounded-full px-3 py-1 text-xs font-black ${flagClass(flag)}`}>
                      {flag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => sendToKitchen(item)}
                  className="mt-4 w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-black"
                >
                  Send To Kitchen
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <h2 className="text-lg font-black">Tonight at Brahma Bull</h2>

          <div className="mt-4 grid gap-3">
            {["Wing Night", "Cold Drinks", "Game Day Specials", "Live Local Energy"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="font-bold">{item}</p>
                <p className="text-sm text-neutral-400">Live updates can appear here instantly.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
