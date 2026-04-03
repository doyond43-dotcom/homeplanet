import { useState } from "react";

type OrderStage =
  | "new"
  | "confirmed"
  | "in-production"
  | "packaging"
  | "shipped"
  | "delivered";

type Order = {
  id: string;
  petName: string;
  owner: string;
  city: string;
  state: string;
  stage: OrderStage;
  createdAt: string;
};

const stageLabels: Record<OrderStage, string> = {
  new: "New Order",
  confirmed: "Confirmed",
  "in-production": "In Production",
  packaging: "Packaging",
  shipped: "Shipped",
  delivered: "Delivered",
};

const stageColors: Record<OrderStage, string> = {
  new: "bg-gray-500/20 border-gray-400",
  confirmed: "bg-blue-500/20 border-blue-400",
  "in-production": "bg-purple-500/20 border-purple-400",
  packaging: "bg-yellow-500/20 border-yellow-400",
  shipped: "bg-green-500/20 border-green-400",
  delivered: "bg-emerald-500/20 border-emerald-400",
};

export default function PetTagFulfillmentBoard() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      petName: "Splinter",
      owner: "Dan",
      city: "Okeechobee",
      state: "FL",
      stage: "confirmed",
      createdAt: "4:30 AM",
    },
    {
      id: "ORD-002",
      petName: "Bella",
      owner: "Sarah",
      city: "Tampa",
      state: "FL",
      stage: "in-production",
      createdAt: "3:50 AM",
    },
  ]);

  function advanceStage(orderId: string) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;

        const flow: OrderStage[] = [
          "new",
          "confirmed",
          "in-production",
          "packaging",
          "shipped",
          "delivered",
        ];

        const next = flow[flow.indexOf(o.stage) + 1];
        if (!next) return o;

        return { ...o, stage: next };
      })
    );
  }

  const grouped = Object.keys(stageLabels).map((stageKey) => {
    const stage = stageKey as OrderStage;
    return {
      stage,
      orders: orders.filter((o) => o.stage === stage),
    };
  });

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="rounded-xl p-5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-white/10">
          <h1 className="text-2xl font-semibold">Pet Tag Fulfillment Board</h1>
          <p className="text-white/60 text-sm">
            Live production and shipping pipeline — every order tracked in real time.
          </p>
        </div>

        {/* BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {grouped.map(({ stage, orders }) => (
            <div
              key={stage}
              className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-3"
            >
              <div className="text-sm font-semibold text-white/70">
                {stageLabels[stage]}
              </div>

              {orders.length === 0 && (
                <div className="text-xs text-white/30">No orders</div>
              )}

              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`rounded-lg border p-3 text-sm space-y-2 ${stageColors[stage]}`}
                >
                  <div className="font-semibold">{order.petName}</div>

                  <div className="text-xs text-white/70">
                    {order.owner} • {order.city}, {order.state}
                  </div>

                  <div className="text-xs text-white/50">
                    Created {order.createdAt}
                  </div>

                  {stage !== "delivered" && (
                    <button
                      onClick={() => advanceStage(order.id)}
                      className="mt-2 w-full text-xs py-1 rounded bg-white/10 hover:bg-white/20 transition"
                    >
                      Advance →
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}