import { useEffect, useMemo, useState } from "react";

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
  completed?: boolean;
};

type TableGroup = {
  table: string;
  tickets: Ticket[];
  stage: TicketStage;
  hasAllergy: boolean;
  hasUpdate: boolean;
};

const STORAGE_KEY = "hp-brahma-bull-kitchen";
const NOTIFICATION_KEY = "hp-brahma-bull-notifications";

type BrahmaNotification = {
  id: string;
  table: string;
  message: string;
  createdAt: number;
  dismissed?: boolean;
};

function readNotifications(): BrahmaNotification[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATION_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeNotification(notification: BrahmaNotification) {
  localStorage.setItem(
    NOTIFICATION_KEY,
    JSON.stringify([notification, ...readNotifications()].slice(0, 20))
  );
  window.dispatchEvent(new Event("brahma-bull-notification-sync"));
}
const starterTickets: Ticket[] = [];

function readTickets(): Ticket[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return starterTickets;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return starterTickets;

    return parsed.map((ticket: Partial<Ticket>) => ({
      id: ticket.id || crypto.randomUUID(),
      table: ticket.table || "0",
      item: ticket.item || "Kitchen Ticket",
      notes: ticket.notes || "",
      stage: (ticket.stage || "New") as TicketStage,
      time: ticket.time || "00:00",
      flags: ticket.flags || [],
      urgency: ticket.urgency || "normal",
      editedAt: ticket.editedAt,
      completed: Boolean(ticket.completed),
    }));
  } catch {
    return starterTickets;
  }
}

function writeTickets(tickets: Ticket[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  window.dispatchEvent(new Event("brahma-bull-kitchen-sync"));
}

function flagClass(flag: string) {
  if (flag.includes("ALLERGY")) return "bg-red-500 text-white";
  if (flag.includes("NO")) return "bg-amber-400 text-black";
  return "bg-emerald-400 text-black";
}

function tableClass(group: TableGroup) {
  if (group.hasAllergy) return "border-red-400/80 bg-red-500/10";
  if (group.hasUpdate) return "border-amber-300/70 bg-amber-400/10";
  if (group.stage === "Ready") return "border-emerald-400/50 bg-emerald-400/10";
  if (group.stage === "Cooking") return "border-white/10 bg-neutral-900";
  return "border-amber-300/40 bg-amber-300/10";
}

function demandFromTickets(tickets: Ticket[]) {
  const active = tickets.filter((ticket) => ticket.stage !== "Delivered");
  const text = active.map((ticket) => ticket.item.toLowerCase()).join(" ");

  return [
    { label: "Burgers", count: (text.match(/burger/g) || []).length },
    { label: "Fries", count: (text.match(/fries/g) || []).length },
    { label: "Wings", count: (text.match(/wings/g) || []).length },
    { label: "Tenders", count: (text.match(/tenders/g) || []).length },
  ];
}

function groupTicketsByTable(tickets: Ticket[], stage: TicketStage): TableGroup[] {
  const filtered = tickets.filter((ticket) => ticket.stage === stage);
  const groups = new Map<string, Ticket[]>();

  filtered.forEach((ticket) => {
    const current = groups.get(ticket.table) || [];
    groups.set(ticket.table, [...current, ticket]);
  });

  return Array.from(groups.entries()).map(([table, groupTickets]) => {
    const sortedTickets = [...groupTickets].sort((a, b) => {
      const aAllergy = a.flags.includes("ALLERGY") || a.urgency === "critical";
      const bAllergy = b.flags.includes("ALLERGY") || b.urgency === "critical";
      if (aAllergy && !bAllergy) return -1;
      if (!aAllergy && bAllergy) return 1;
      return 0;
    });

    return {
      table,
      tickets: sortedTickets,
      stage,
      hasAllergy: groupTickets.some((ticket) => ticket.flags.includes("ALLERGY") || ticket.urgency === "critical"),
      hasUpdate: groupTickets.some((ticket) => Boolean(ticket.editedAt)),
    };
  });
}

function cleanItemName(item: string) {
  return item.replace(/^Seat\s+\d+:\s*/i, "");
}

function readyMessageForTable(table: string, tickets: Ticket[]) {
  const items = tickets
    .filter((ticket) => ticket.table === table)
    .map((ticket) => cleanItemName(ticket.item))
    .join(" + ");

  return `Table ${table} - ${items || "Food"} Ready`;
}

function TableGroupCard({
  group,
  onMoveTable,
  onToggleComplete,
}: {
  group: TableGroup;
  onMoveTable: (table: string, fromStage: TicketStage, toStage: TicketStage) => void;
  onToggleComplete: (ticketId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const completedCount = group.tickets.filter((ticket) => ticket.completed).length;
  const remainingCount = group.tickets.length - completedCount;
  const specialCount = group.tickets.filter((ticket) => ticket.flags.length > 0).length;
  const tableTime = group.tickets[0]?.time || "00:00";

  return (
    <article className={`rounded-3xl border p-5 ${tableClass(group)}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">
              TABLE {group.table}
            </p>

            <h3 className="mt-2 text-6xl font-black leading-none">{tableTime}</h3>

            <div className="mt-4 space-y-1">
              <p className="text-2xl font-black">{group.tickets.length} Items</p>
              <p className="text-lg font-bold text-emerald-300">{completedCount} Complete</p>
              <p className="text-lg font-bold text-amber-300">{remainingCount} Remaining</p>
              {specialCount > 0 && (
                <p className="text-lg font-bold text-red-400">{specialCount} Special</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {group.hasAllergy && (
              <span className="rounded-full bg-red-500 px-4 py-2 text-xs font-black text-white text-center">
                ALLERGY
              </span>
            )}

            {group.hasUpdate && (
              <span className="rounded-full bg-amber-300 px-4 py-2 text-xs font-black text-black text-center">
                UPDATED
              </span>
            )}

            <span className="rounded-full bg-black/40 px-4 py-2 text-xs font-black text-white text-center">
              {isOpen ? "CLOSE" : "OPEN"}
            </span>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400">
                TABLE {group.table}
              </p>
              <h4 className="text-2xl font-black">Progress {completedCount} / {group.tickets.length}</h4>
            </div>

            <p className="text-xl font-black">{tableTime}</p>
          </div>

          <div className="space-y-2">
            {group.tickets.map((ticket, index) => {
              const allergy = ticket.flags.includes("ALLERGY") || ticket.urgency === "critical";

              return (
                <button
                  key={ticket.id}
                  onClick={() => onToggleComplete(ticket.id)}
                  className={`w-full rounded-2xl border p-3 text-left ${
                    allergy ? "border-red-400/70 bg-red-500/10" : "border-white/10 bg-black/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className={`text-lg font-black ${ticket.completed ? "text-neutral-500 line-through" : "text-white"}`}>
                        Seat {index + 1} {cleanItemName(ticket.item)}
                      </p>

                      {ticket.notes && ticket.notes !== "Standard order" && (
                        <p className="mt-1 text-sm font-bold text-neutral-300">{ticket.notes}</p>
                      )}

                      {ticket.flags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {ticket.flags.map((flag) => (
                            <span key={flag} className={`rounded-full px-2 py-1 text-[10px] font-black ${flagClass(flag)}`}>
                              {flag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onMoveTable(group.table, group.stage, "Ready")}
            className="mt-5 w-full rounded-2xl bg-emerald-400 px-4 py-5 text-sm font-black text-black"
          >
            READY FOR PICKUP
          </button>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => onMoveTable(group.table, group.stage, group.stage === "New" ? "Cooking" : group.stage === "Cooking" ? "Ready" : "Delivered")}
          className="mt-5 w-full rounded-2xl bg-emerald-400 px-4 py-4 text-sm font-black text-black"
        >
          {group.stage === "New" ? "START TABLE" : group.stage === "Cooking" ? "READY FOR PICKUP" : "PICKED UP"}
        </button>
      )}
    </article>
  );
}

export default function BrahmaBullKitchenBoard() {
  const [tickets, setTickets] = useState<Ticket[]>(() => readTickets());

  useEffect(() => {
    function syncKitchenTickets() {
      setTickets(readTickets());
    }

    window.addEventListener("storage", syncKitchenTickets);
    window.addEventListener("brahma-bull-kitchen-sync", syncKitchenTickets);

    return () => {
      window.removeEventListener("storage", syncKitchenTickets);
      window.removeEventListener("brahma-bull-kitchen-sync", syncKitchenTickets);
    };
  }, []);

  const waitingTickets = tickets.filter((ticket) => ticket.stage === "New");
  const deliveredTickets = tickets.filter((ticket) => ticket.stage === "Delivered");

  const waitingTables = groupTicketsByTable(tickets, "New");
  const cookingTables = groupTicketsByTable(tickets, "Cooking");
  const readyTables = groupTicketsByTable(tickets, "Ready");

  const demand = useMemo(() => demandFromTickets(tickets), [tickets]);

  function saveTickets(updated: Ticket[]) {
    setTickets(updated);
    writeTickets(updated);
  }

  function moveTable(table: string, fromStage: TicketStage, toStage: TicketStage) {
    if (toStage === "Ready") {
      writeNotification({
        id: crypto.randomUUID(),
        table,
        message: readyMessageForTable(
          table,
          tickets.filter((ticket) => ticket.table === table && ticket.stage === fromStage)
        ),
        createdAt: Date.now(),
      });
    }

    saveTickets(
      tickets.map((ticket) =>
        ticket.table === table && ticket.stage === fromStage
          ? { ...ticket, stage: toStage, completed: toStage === "Delivered" ? true : ticket.completed }
          : ticket
      )
    );
  }

  function toggleComplete(ticketId: string) {
    saveTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, completed: !ticket.completed } : ticket
      )
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-5 text-white">
      <section className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
                Brahma Bull Kitchen
              </p>

              <h1 className="mt-2 text-4xl font-black">Kitchen Awareness Board</h1>

              <p className="mt-2 max-w-2xl text-sm text-neutral-400">
                Table ? Items ? Checkmarks ? Ready.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-2xl bg-black/50 p-4 text-center">
                <p className="text-xs font-black text-neutral-400">WAITING</p>
                <p className="text-3xl font-black text-amber-300">{waitingTables.length}</p>
              </div>

              <div className="rounded-2xl bg-black/50 p-4 text-center">
                <p className="text-xs font-black text-neutral-400">COOKING</p>
                <p className="text-3xl font-black text-white">{cookingTables.length}</p>
              </div>

              <div className="rounded-2xl bg-black/50 p-4 text-center">
                <p className="text-xs font-black text-neutral-400">READY</p>
                <p className="text-3xl font-black text-emerald-300">{readyTables.length}</p>
              </div>

              <div className="rounded-2xl bg-black/50 p-4 text-center">
                <p className="text-xs font-black text-neutral-400">DONE</p>
                <p className="text-3xl font-black text-neutral-500">{deliveredTickets.length}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">
            Current Demand
          </p>

          <h2 className="mt-1 text-2xl font-black">What the kitchen is making right now</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {demand.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                  {item.label}
                </p>
                <p className="mt-2 text-4xl font-black">{item.count}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-200">
                Waiting Tables
              </p>
              <h2 className="text-3xl font-black">Start these tables first</h2>
            </div>

            <p className="text-sm font-bold text-amber-100">
              {waitingTables.length} tables waiting / {waitingTickets.length} items.
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {waitingTables.map((group) => (
              <TableGroupCard
                key={group.table}
                group={group}
                onMoveTable={moveTable}
                onToggleComplete={toggleComplete}
              />
            ))}

            {waitingTables.length === 0 && (
              <p className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-neutral-400">
                No waiting tables.
              </p>
            )}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">
              Cooking
            </p>
            <h2 className="mt-1 text-3xl font-black">Tables on the line</h2>

            <div className="mt-5 space-y-4">
              {cookingTables.map((group) => (
                <TableGroupCard
                  key={group.table}
                  group={group}
                  onMoveTable={moveTable}
                  onToggleComplete={toggleComplete}
                />
              ))}

              {cookingTables.length === 0 && (
                <p className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-neutral-400">
                  No tables cooking.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-200">
              Ready For Pickup
            </p>
            <h2 className="mt-1 text-3xl font-black">Runner tables</h2>

            <div className="mt-5 space-y-4">
              {readyTables.map((group) => (
                <TableGroupCard
                  key={group.table}
                  group={group}
                  onMoveTable={moveTable}
                  onToggleComplete={toggleComplete}
                />
              ))}

              {readyTables.length === 0 && (
                <p className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-neutral-400">
                  Nothing ready yet.
                </p>
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}






