import { useMemo, useState } from "react";

type OrderStatus = "new" | "making" | "ready" | "done";

type PizzaOrder = {
  id: string;
  name: string;
  type: "Pickup" | "Walk-in" | "Delivery";
  items: string[];
  note?: string;
  time: string;
  status: OrderStatus;
  paid: boolean;
};

const STARTING_ORDERS: PizzaOrder[] = [
  {
    id: "101",
    name: "Mike",
    type: "Pickup",
    items: ["Large Pepperoni", "Garlic Knots"],
    note: "Called in. Wants it well done.",
    time: "6:12 PM",
    status: "new",
    paid: false,
  },
  {
    id: "102",
    name: "Sarah",
    type: "Walk-in",
    items: ["2 Cheese Slices", "Coke"],
    time: "6:15 PM",
    status: "making",
    paid: true,
  },
  {
    id: "103",
    name: "John",
    type: "Pickup",
    items: ["XL Meat Lovers", "Greek Salad"],
    note: "Customer waiting outside.",
    time: "6:18 PM",
    status: "making",
    paid: false,
  },
  {
    id: "104",
    name: "Lisa",
    type: "Delivery",
    items: ["Medium White Pizza", "Wings"],
    note: "Delivery driver needs ETA.",
    time: "6:21 PM",
    status: "ready",
    paid: true,
  },
  {
    id: "105",
    name: "Walk-in",
    type: "Walk-in",
    items: ["Large Cheese", "2 Liter Pepsi"],
    time: "6:25 PM",
    status: "new",
    paid: false,
  },
];

const columns: Array<{
  key: OrderStatus;
  title: string;
  subtitle: string;
}> = [
  { key: "new", title: "New Orders", subtitle: "Just came in" },
  { key: "making", title: "In Progress", subtitle: "Kitchen is working" },
  { key: "ready", title: "Ready", subtitle: "Needs pickup / handoff" },
  { key: "done", title: "Completed", subtitle: "Closed out" },
];

export default function JoeysPizzaLiveBoard() {
  const [orders, setOrders] = useState<PizzaOrder[]>(STARTING_ORDERS);

  const totals = useMemo(() => {
    const active = orders.filter((order) => order.status !== "done").length;
    const ready = orders.filter((order) => order.status === "ready").length;
    const unpaid = orders.filter((order) => !order.paid).length;

    return { active, ready, unpaid };
  }, [orders]);

  function moveOrder(id: string, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order))
    );
  }

  function togglePaid(id: string) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, paid: !order.paid } : order
      )
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#130b06] via-[#080604] to-black px-4 py-6 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-300/80">
                HomePlanet Live Order Board
              </p>

              <h1 className="mt-3 text-4xl font-black leading-none md:text-6xl">
                Joey&apos;s Pizzeria
                <span className="block text-orange-300">Live Order Board</span>
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-white/70">
                No guessing. No lost tickets. Every order visible from the second it comes in
                until it is handed off.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:min-w-[420px]">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-widest text-white/45">Active</p>
                <p className="mt-2 text-3xl font-black text-orange-300">{totals.active}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-widest text-white/45">Ready</p>
                <p className="mt-2 text-3xl font-black text-emerald-300">{totals.ready}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-widest text-white/45">Unpaid</p>
                <p className="mt-2 text-3xl font-black text-red-300">{totals.unpaid}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {columns.map((column) => {
            const columnOrders = orders.filter((order) => order.status === column.key);

            return (
              <section
                key={column.key}
                className="min-h-[520px] rounded-[2rem] border border-white/10 bg-white/[0.035] p-4"
              >
                <div className="mb-4 border-b border-white/10 pb-3">
                  <h2 className="text-2xl font-black">{column.title}</h2>
                  <p className="text-sm text-white/50">{column.subtitle}</p>
                </div>

                <div className="space-y-3">
                  {columnOrders.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-5 text-center text-sm text-white/45">
                      Nothing here right now.
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-white/10 bg-black/35 p-4 shadow-xl"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-orange-300/80">
                              #{order.id} • {order.type}
                            </p>
                            <h3 className="mt-1 text-xl font-black">{order.name}</h3>
                            <p className="mt-1 text-xs text-white/45">{order.time}</p>
                          </div>

                          <button
                            onClick={() => togglePaid(order.id)}
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              order.paid
                                ? "bg-emerald-400/15 text-emerald-200 border border-emerald-300/25"
                                : "bg-red-400/15 text-red-200 border border-red-300/25"
                            }`}
                          >
                            {order.paid ? "Paid" : "Unpaid"}
                          </button>
                        </div>

                        <div className="mt-4 space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item}
                              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold"
                            >
                              {item}
                            </div>
                          ))}
                        </div>

                        {order.note && (
                          <p className="mt-3 rounded-xl border border-orange-300/20 bg-orange-400/10 p-3 text-sm text-orange-100">
                            {order.note}
                          </p>
                        )}

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {column.key !== "new" && (
                            <button
                              onClick={() => moveOrder(order.id, "new")}
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70"
                            >
                              New
                            </button>
                          )}

                          {column.key !== "making" && (
                            <button
                              onClick={() => moveOrder(order.id, "making")}
                              className="rounded-xl border border-orange-300/20 bg-orange-400/10 px-3 py-2 text-xs font-bold text-orange-100"
                            >
                              Making
                            </button>
                          )}

                          {column.key !== "ready" && (
                            <button
                              onClick={() => moveOrder(order.id, "ready")}
                              className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-100"
                            >
                              Ready
                            </button>
                          )}

                          {column.key !== "done" && (
                            <button
                              onClick={() => moveOrder(order.id, "done")}
                              className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white"
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-6 rounded-[2rem] border border-orange-300/20 bg-orange-400/10 p-5 text-center">
          <h2 className="text-2xl font-black">This is the same night, just organized.</h2>
          <p className="mx-auto mt-2 max-w-2xl text-white/65">
            Staff can see what came in, what is being made, what is ready, and what still needs payment
            without digging through paper tickets or asking three people what happened.
          </p>
        </div>
      </section>
    </main>
  );
}