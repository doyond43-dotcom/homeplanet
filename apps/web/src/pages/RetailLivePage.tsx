import { useState } from "react"

type Order = {
  id: number
  item: string
  status: string
  note: string
}

export default function RetailLivePage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      item: "Nike Air Max",
      status: "Ready For Pickup",
      note: "Customer notified",
    },
    {
      id: 2,
      item: "Local Gift Basket",
      status: "Packaging",
      note: "Waiting on ribbon stock",
    },
  ])

  const [product, setProduct] = useState("Nike Air Max")
  const [inventoryLow, setInventoryLow] = useState(false)
  const [pickupReady, setPickupReady] = useState(true)
  const [note, setNote] = useState("")

  function createOrderUpdate() {
    setOrders([
      {
        id: Date.now(),
        item: product,
        status: pickupReady ? "Ready For Pickup" : "Processing",
        note: [
          inventoryLow ? "Inventory running low" : "",
          note,
        ].filter(Boolean).join(" • "),
      },
      ...orders,
    ])
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">

        <section className="mb-10">
          <div className="mb-4 inline-flex rounded-full border border-lime-400/40 px-4 py-2 text-sm font-semibold text-lime-300">
            Retail & Local Shops
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Shops Need More Than Online Catalogs.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-2xl">
            A website shows products. A Live Page shows what customers can actually buy, pick up, and receive right now.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <h2 className="text-2xl font-black">Traditional Website</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-400 sm:text-lg">
              <li>Products</li>
              <li>Photos</li>
              <li>Store Hours</li>
              <li>Contact Info</li>
              <li>Location</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-zinc-900 p-4 text-sm font-semibold text-zinc-500">
              Mostly informational.
            </div>
          </div>

          <div className="rounded-3xl border border-lime-400/40 bg-lime-500/10 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-lime-300">Live Page</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-100 sm:text-lg">
              <li>Order Status</li>
              <li>Pickup Readiness</li>
              <li>Inventory Awareness</li>
              <li>Customer Updates</li>
              <li>Fulfillment Status</li>
              <li>Store Activity</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-black/30 p-4 text-sm font-semibold text-lime-200">
              Operational awareness in real time.
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-3xl font-black">The Difference</h2>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
            A website helps customers browse. A Live Page helps customers know what is actually happening.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-lime-400/30 bg-lime-500/10 p-6 sm:p-8">
          <h2 className="mb-4 text-3xl font-black">Live Retail Movement</h2>

          <div className="space-y-3">
            {[
              "Order received",
              "Inventory updated",
              "Customer notified",
              "Item packaged",
              "Ready for pickup",
              "Order completed",
            ].map((event) => (
              <div
                key={event}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                {event}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <div className="mb-6">
            <div className="mb-3 inline-flex rounded-full border border-lime-400/30 px-4 py-2 text-sm font-bold text-lime-300">
              LIVE SHOP DEMO
            </div>

            <h2 className="text-3xl font-black">
              Build A Store Update.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">

            <div className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-amber-300">
                Store Update
              </h3>

              <div className="space-y-4">
                <input
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
                />

                <button
                  onClick={() => setPickupReady(!pickupReady)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${
                    pickupReady
                      ? "border-amber-300 bg-amber-300 text-black"
                      : "border-zinc-700 bg-black text-white"
                  }`}
                >
                  Ready For Pickup
                </button>

                <button
                  onClick={() => setInventoryLow(!inventoryLow)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${
                    inventoryLow
                      ? "border-amber-300 bg-amber-300 text-black"
                      : "border-zinc-700 bg-black text-white"
                  }`}
                >
                  Inventory Running Low
                </button>

                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Customer notified, awaiting shipment, etc..."
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
                />

                <button
                  onClick={createOrderUpdate}
                  className="w-full rounded-2xl bg-amber-300 px-4 py-4 font-black text-black"
                >
                  Send Store Update
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-lime-400/30 bg-lime-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-lime-300">
                Live Shop Board
              </h3>

              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4"
                  >
                    <div className="font-black">{order.item}</div>

                    <div className="mt-2 text-sm text-lime-300">
                      {order.status}
                    </div>

                    <div className="mt-3 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm">
                      {order.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  )
}
