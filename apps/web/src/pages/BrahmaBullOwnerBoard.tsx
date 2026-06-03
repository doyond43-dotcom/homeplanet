import { useEffect, useMemo, useState } from "react";

type TableStatus =
  | "Available"
  | "Active"
  | "Waiting Food"
  | "Ready To Pay";

type TableState = {
  table: string;
  status: TableStatus;
};

type KitchenTicket = {
  id: string;
  table: string;
  item: string;
  notes: string;
  stage: "New" | "Cooking" | "Ready" | "Delivered";
  time: string;
  flags: string[];
  urgency: "normal" | "watch" | "critical";
  editedAt?: number;
};

const TABLES_KEY = "hp-brahma-bull-tables";
const KITCHEN_KEY = "hp-brahma-bull-kitchen";

function readTables(): TableState[] {
  try {
    return JSON.parse(localStorage.getItem(TABLES_KEY) || "[]");
  } catch {
    return [];
  }
}

function readKitchenTickets(): KitchenTicket[] {
  try {
    return JSON.parse(localStorage.getItem(KITCHEN_KEY) || "[]");
  } catch {
    return [];
  }
}

function statusClass(status: TableStatus) {
  if (status === "Available") {
    return "border-white/10 bg-black/40 text-neutral-400";
  }

  if (status === "Active") {
    return "border-emerald-300/50 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "Waiting Food") {
    return "border-sky-300/50 bg-sky-300/10 text-sky-100";
  }

  return "border-amber-300/50 bg-amber-300/10 text-amber-100";
}

export default function BrahmaBullOwnerBoard() {
  const [tables, setTables] = useState<TableState[]>([]);
  const [tickets, setTickets] = useState<KitchenTicket[]>([]);

  useEffect(() => {
    const sync = () => {
      setTables(readTables());
      setTickets(readKitchenTickets());
    };

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("brahma-bull-tables-sync", sync);
    window.addEventListener("brahma-bull-kitchen-sync", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("brahma-bull-tables-sync", sync);
      window.removeEventListener("brahma-bull-kitchen-sync", sync);
    };
  }, []);

  const activeTables = useMemo(
    () => tables.filter((table) => table.status !== "Available"),
    [tables]
  );

  const newCount = tickets.filter(
    (ticket) => ticket.stage === "New"
  ).length;

  const cookingCount = tickets.filter(
    (ticket) => ticket.stage === "Cooking"
  ).length;

  const readyCount = tickets.filter(
    (ticket) => ticket.stage === "Ready"
  ).length;

  const needsAttention = [
    ...tables.filter((table) => table.status === "Ready To Pay"),
    ...tickets.filter(
      (ticket) =>
        ticket.urgency === "critical" ||
        ticket.flags.includes("ALLERGY")
    ),
  ];

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-5 text-white">
      <section className="mx-auto max-w-5xl space-y-5">
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
            Owner Live Board
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Brahma Bull Awareness
          </h1>

          <p className="mt-2 text-neutral-400">
            What is happening right now?
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-sky-300/30 bg-sky-300/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em]">
              New Tickets
            </p>

            <p className="mt-3 text-5xl font-black">
              {newCount}
            </p>
          </div>

          <div className="rounded-3xl border border-amber-300/30 bg-amber-300/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em]">
              Cooking
            </p>

            <p className="mt-3 text-5xl font-black">
              {cookingCount}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-300/30 bg-emerald-400/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em]">
              Ready
            </p>

            <p className="mt-3 text-5xl font-black">
              {readyCount}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <h2 className="text-2xl font-black">
            Tables
          </h2>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {tables.map((table) => (
              <div
                key={table.table}
                className={`rounded-2xl border p-4 ${statusClass(
                  table.status
                )}`}
              >
                <p className="text-3xl font-black">
                  {table.table}
                </p>

                <p className="mt-2 text-sm font-bold">
                  {table.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <h2 className="text-2xl font-black">
            Kitchen Tickets
          </h2>

          <div className="mt-4 space-y-3">
            {tickets.length === 0 ? (
              <div className="rounded-2xl border border-white/10 p-4 text-neutral-500">
                No tickets.
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-black">
                        Table {ticket.table}
                      </p>

                      <p className="text-sm text-neutral-300">
                        {ticket.item}
                      </p>
                    </div>

                    <span className="rounded-full bg-neutral-800 px-3 py-2 text-xs font-black">
                      {ticket.stage}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-neutral-400">
                    {ticket.notes}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-5">
          <h2 className="text-2xl font-black">
            Needs Attention
          </h2>

          <div className="mt-4 space-y-3">
            {needsAttention.length === 0 ? (
              <div className="rounded-2xl border border-white/10 p-4 text-neutral-500">
                Nothing needs attention.
              </div>
            ) : (
              needsAttention.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-red-400/20 bg-black/30 p-4"
                >
                  {"table" in item
                    ? `Table ${item.table} ready for payment`
                    : `ALLERGY - Table ${item.table}`}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">
            Active Tables: {activeTables.length}
          </p>
        </div>
      </section>
    </main>
  );
}