import { useEffect, useState } from "react";

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
  editedAt?: number;
};

const STORAGE_KEY = "hp-brahma-bull-kitchen";

const starterTickets: Ticket[] = [
  { id: "k1", table: "8", item: "Wings + Fries", notes: "Extra ranch", stage: "New", time: "01:12", flags: ["EXTRA RANCH"], urgency: "normal" },
  { id: "k2", table: "12", item: "Brahma Burger", notes: "No tomato, no mayo", stage: "Cooking", time: "07:44", flags: ["NO TOMATO", "NO MAYO"], urgency: "watch" },
  { id: "k3", table: "4", item: "Chicken Tenders", notes: "Honey mustard, allergy alert", stage: "Ready", time: "10:21", flags: ["ALLERGY", "HONEY MUSTARD"], urgency: "critical" },
];

const stages: TicketStage[] = ["New", "Cooking", "Ready", "Delivered"];
const quickFlags = ["NO MAYO", "NO TOMATO", "NO ONION", "EXTRA RANCH", "ALLERGY"];

function readTickets(): Ticket[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return starterTickets;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return starterTickets;

    return parsed.map((ticket: Partial<Ticket>) => {
      const starter = starterTickets.find((item) => item.id === ticket.id);

      return {
        id: ticket.id || starter?.id || crypto.randomUUID(),
        table: ticket.table || starter?.table || "0",
        item: ticket.item || starter?.item || "Kitchen Ticket",
        notes: ticket.notes || starter?.notes || "",
        stage: (ticket.stage || starter?.stage || "New") as TicketStage,
        time: ticket.time || starter?.time || "00:00",
        flags: ticket.flags || starter?.flags || [],
        urgency: ticket.urgency || starter?.urgency || "normal",
        editedAt: ticket.editedAt,
      };
    });
  } catch {
    return starterTickets;
  }
}

function writeTickets(tickets: Ticket[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  window.dispatchEvent(new Event("brahma-bull-kitchen-sync"));
}

function urgencyClass(ticket: Ticket) {
  if (ticket.urgency === "critical") return "border-red-400/60 bg-red-500/10";
  if (ticket.editedAt) return "border-amber-300/70 bg-amber-400/10";
  if (ticket.urgency === "watch") return "border-amber-400/50 bg-amber-400/10";
  return "border-white/10 bg-black/40";
}

function flagClass(flag: string) {
  if (flag.includes("ALLERGY")) return "animate-pulse bg-red-500 text-white";
  if (flag.includes("NO")) return "bg-amber-400 text-black";
  return "bg-emerald-400 text-black";
}

function formatEditedAt(editedAt?: number) {
  if (!editedAt) return "";

  const seconds = Math.max(1, Math.floor((Date.now() - editedAt) / 1000));
  if (seconds < 60) return `Updated ${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  return `Updated ${minutes}m ago`;
}

export default function BrahmaBullKitchenBoard() {
  const [tickets, setTickets] = useState<Ticket[]>(() => readTickets());
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    writeTickets(tickets);
  }, []);

  function saveTickets(updated: Ticket[]) {
    setTickets(updated);
    writeTickets(updated);
  }

  function moveTicket(id: string, stage: TicketStage) {
    const updated = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, stage } : ticket
    );

    saveTickets(updated);
  }

  function toggleFlag(id: string, flag: string) {
    const updated = tickets.map((ticket) => {
      if (ticket.id !== id) return ticket;

      const hasFlag = ticket.flags.includes(flag);
      const nextFlags = hasFlag
        ? ticket.flags.filter((item) => item !== flag)
        : [...ticket.flags, flag];

      const nextUrgency = nextFlags.includes("ALLERGY")
        ? "critical"
        : nextFlags.some((item) => item.includes("NO"))
          ? "watch"
          : ticket.urgency === "critical"
            ? "normal"
            : ticket.urgency;

      return {
        ...ticket,
        flags: nextFlags,
        notes: nextFlags.length ? nextFlags.join(", ").toLowerCase() : "Standard order",
        urgency: nextUrgency,
        editedAt: Date.now(),
      };
    });

    saveTickets(updated);
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-5 text-white">
      <section className="mx-auto max-w-6xl space-y-5">
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            Brahma Bull Kitchen
          </p>

          <h1 className="mt-2 text-3xl font-black">Kitchen Flow Board</h1>

          <p className="mt-2 text-sm text-neutral-400">
            Live kitchen movement with modifier flags, allergy alerts, ticket corrections, and order priority signals.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {stages.map((stage) => (
            <div key={stage} className="rounded-3xl border border-white/10 bg-neutral-900 p-4">
              <h2 className="text-xl font-black">{stage}</h2>

              <div className="mt-4 space-y-3">
                {tickets.filter((ticket) => ticket.stage === stage).map((ticket) => (
                  <div key={ticket.id} className={`rounded-2xl border p-4 ${urgencyClass(ticket)}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-2xl font-black">Table {ticket.table}</p>
                        <p className="text-base font-bold text-neutral-200">{ticket.item}</p>
                        <p className="mt-1 text-sm text-neutral-400">{ticket.notes}</p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black">
                        {ticket.time}
                      </span>
                    </div>

                    {ticket.editedAt && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="animate-pulse rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-black">
                          UPDATED
                        </span>
                        <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-black text-white">
                          {formatEditedAt(ticket.editedAt)}
                        </span>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {ticket.flags.map((flag) => (
                        <span key={flag} className={`rounded-full px-3 py-1 text-xs font-black ${flagClass(flag)}`}>
                          {flag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => setEditingId(editingId === ticket.id ? null : ticket.id)}
                      className="mt-4 w-full rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-xs font-black text-white"
                    >
                      {editingId === ticket.id ? "Close Edit" : "Edit Ticket"}
                    </button>

                    {editingId === ticket.id && (
                      <div className="mt-3 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-3">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">
                          Server Correction
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {quickFlags.map((flag) => {
                            const active = ticket.flags.includes(flag);

                            return (
                              <button
                                key={flag}
                                onClick={() => toggleFlag(ticket.id, flag)}
                                className={`rounded-full px-3 py-2 text-xs font-black ${
                                  active ? flagClass(flag) : "bg-neutral-800 text-neutral-300"
                                }`}
                              >
                                {active ? "? " : "+ "}
                                {flag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {stages.filter((nextStage) => nextStage !== stage).map((nextStage) => (
                        <button
                          key={nextStage}
                          onClick={() => moveTicket(ticket.id, nextStage)}
                          className={`rounded-xl border px-3 py-2 text-xs font-black transition ${
  ticket.stage === nextStage
    ? "border-emerald-400 bg-emerald-400 text-black"
    : "border-white/10 bg-neutral-700 text-white hover:bg-neutral-600"
}`}
                        >
                          {nextStage}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {tickets.filter((ticket) => ticket.stage === stage).length === 0 && (
                  <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-neutral-500">
                    Nothing here.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

