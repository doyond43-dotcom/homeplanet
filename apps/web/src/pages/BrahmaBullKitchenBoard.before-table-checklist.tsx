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
};

type TableGroup = {
  table: string;
  tickets: Ticket[];
  stage: TicketStage;
  hasAllergy: boolean;
  hasUpdate: boolean;
};

const STORAGE_KEY = "hp-brahma-bull-kitchen";

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
  if (flag.includes("ALLERGY")) return "animate-pulse bg-red-500 text-white";
  if (flag.includes("NO")) return "bg-amber-400 text-black";
  return "bg-emerald-400 text-black";
}

function tableClass(group: TableGroup) {
  if (group.hasAllergy) {
    return "border-red-400/80 bg-red-500/10 shadow-[0_0_30px_rgba(248,113,113,0.12)]";
  }

  if (group.hasUpdate) {
    return "border-amber-300/70 bg-amber-400/10";
  }

  if (group.stage === "Ready") {
    return "border-emerald-400/50 bg-emerald-400/10";
  }

  if (group.stage === "Cooking") {
    return "border-white/10 bg-neutral-900";
  }

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

  return Array.from(groups.entries()).map(([table, groupTickets]) => ({
    table,
    tickets: groupTickets,
    stage,
    hasAllergy: groupTickets.some((ticket) => ticket.flags.includes("ALLERGY") || ticket.urgency === "critical"),
    hasUpdate: groupTickets.some((ticket) => Boolean(ticket.editedAt)),
  }));
}

function TableGroupCard({
  group,
  primaryLabel,
  primaryAction,
  secondaryLabel,
  secondaryAction,
}: {
  group: TableGroup;
  primaryLabel: string;
  primaryAction: () => void;
  secondaryLabel?: string;
  secondaryAction?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article className={`rounded-3xl border p-5 ${tableClass(group)}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">
            Table
          </p>

          <h3 className="mt-1 text-5xl font-black leading-none">
            {group.table}
          </h3>

          <p className="mt-3 text-xl font-black">
            {group.tickets.length} items
          </p>
        </div>

        <div className="rounded-2xl bg-white px-4 py-3 text-center text-black">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            Items
          </p>
          <p className="text-2xl font-black">{group.tickets.length}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {group.hasAllergy && (
          <span className="rounded-full bg-red-500 px-4 py-2 text-xs font-black text-white">
            ⚠ ALLERGY
          </span>
        )}

        {group.hasUpdate && (
          <span className="rounded-full bg-amber-300 px-4 py-2 text-xs font-black text-black">
            UPDATED
          </span>
        )}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-5 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm font-black text-white"
      >
        {isOpen ? "Hide Table Details" : "Open Table Details"}
      </button>

      {isOpen && (
        <div className="mt-5 space-y-3">
          {group.tickets.map((ticket) => (
            <div key={ticket.id} className="rounded-2xl border border-white/10 bg-black/35 p-4">
              <p className="text-xl font-black">{ticket.item}</p>

              <p className="mt-1 text-sm font-bold text-neutral-300">
                {ticket.notes || "Standard order"}
              </p>

              {ticket.flags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ticket.flags.map((flag) => (
                    <span key={flag} className={`rounded-full px-3 py-1 text-xs font-black ${flagClass(flag)}`}>
                      {flag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          onClick={primaryAction}
          className="rounded-2xl bg-emerald-400 px-4 py-4 text-sm font-black text-black"
        >
          {primaryLabel}
        </button>

        {secondaryLabel && secondaryAction && (
          <button
            onClick={secondaryAction}
            className="rounded-2xl border border-white/10 bg-neutral-800 px-4 py-4 text-sm font-black text-white"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
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
  const cookingTickets = tickets.filter((ticket) => ticket.stage === "Cooking");
  const readyTickets = tickets.filter((ticket) => ticket.stage === "Ready");
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
    saveTickets(
      tickets.map((ticket) =>
        ticket.table === table && ticket.stage === fromStage
          ? { ...ticket, stage: toStage }
          : ticket
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
                Kitchen works by table groups, not scattered individual tickets.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-2xl bg-black/50 p-4 text-center">
                <p className="text-xs font-black text-neutral-400">WAITING</p>
                <p className="text-3xl font-black text-amber-300">{waitingTickets.length}</p>
              </div>

              <div className="rounded-2xl bg-black/50 p-4 text-center">
                <p className="text-xs font-black text-neutral-400">COOKING</p>
                <p className="text-3xl font-black text-white">{cookingTickets.length}</p>
              </div>

              <div className="rounded-2xl bg-black/50 p-4 text-center">
                <p className="text-xs font-black text-neutral-400">READY</p>
                <p className="text-3xl font-black text-emerald-300">{readyTickets.length}</p>
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
                primaryLabel="START TABLE"
                primaryAction={() => moveTable(group.table, "New", "Cooking")}
                secondaryLabel="MARK TABLE READY"
                secondaryAction={() => moveTable(group.table, "New", "Ready")}
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
                  primaryLabel="READY FOR PICKUP"
                  primaryAction={() => moveTable(group.table, "Cooking", "Ready")}
                  secondaryLabel="RETURN TO WAITING"
                  secondaryAction={() => moveTable(group.table, "Cooking", "New")}
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
                  primaryLabel="PICKED UP"
                  primaryAction={() => moveTable(group.table, "Ready", "Delivered")}
                  secondaryLabel="SEND BACK"
                  secondaryAction={() => moveTable(group.table, "Ready", "Cooking")}
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