import { useState } from "react"

type Order = {
  id: number
  item: string
  table: string
  note: string
}

export default function RestaurantLivePage() {
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, item: "Classic Burger", table: "Table 4", note: "Hold fries" },
    { id: 2, item: "Chicken Sandwich", table: "Table 7", note: "Extra sauce" },
  ])

  const [activeItem, setActiveItem] = useState("")
  const [table, setTable] = useState("Table 5")
  const [note, setNote] = useState("")
  const [noTomato, setNoTomato] = useState(false)
  const [toastedBun, setToastedBun] = useState(true)
  const [fries, setFries] = useState(true)

  const menuItems = ["Classic Burger", "Chicken Sandwich", "Wings Basket", "Caesar Salad"]

  function openOrderCard(item: string) {
    setActiveItem(item)
    setTable("Table 5")
    setNote("")
    setNoTomato(false)
    setToastedBun(true)
    setFries(true)
  }

  function sendOrder() {
    if (!activeItem) return

    setOrders([
      {
        id: Date.now(),
        item: activeItem,
        table,
        note: [
          noTomato ? "No tomato" : "",
          toastedBun ? "Toasted bun" : "",
          fries ? "Add fries" : "No fries",
          note,
        ].filter(Boolean).join(" • "),
      },
      ...orders,
    ])

    setActiveItem("")
    setNote("")
    setNoTomato(false)
    setToastedBun(true)
    setFries(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <section className="mb-10">
          <div className="mb-4 inline-flex rounded-full border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-300">
            Food & Restaurants
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Restaurants Need More Than Websites.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-2xl">
            A website tells people where you are. A Live Page shows what is happening.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <h2 className="text-2xl font-black">Traditional Website</h2>
            <ul className="mt-5 space-y-3 text-base text-zinc-400 sm:text-lg">
              <li>Menu</li>
              <li>Hours</li>
              <li>Photos</li>
              <li>Location</li>
              <li>Contact</li>
            </ul>
            <div className="mt-7 rounded-2xl bg-zinc-900 p-4 text-sm font-semibold text-zinc-500">
              Mostly informational.
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-emerald-300">Live Page</h2>
            <ul className="mt-5 space-y-3 text-base text-zinc-100 sm:text-lg">
              <li>Table Awareness</li>
              <li>Kitchen Flow</li>
              <li>Order Status</li>
              <li>Staff Awareness</li>
              <li>Payments</li>
              <li>Guest Experience</li>
            </ul>
            <div className="mt-7 rounded-2xl bg-black/30 p-4 text-sm font-semibold text-emerald-200">
              Operational awareness in real time.
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-3xl font-black">The Difference</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
            A website helps customers find your restaurant. A Live Page helps the restaurant operate.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Live Restaurant Movement</h2>
              <p className="mt-2 text-zinc-300">
                This is what a Live Page can show while the restaurant is actually moving.
              </p>
            </div>

            <div className="rounded-full border border-emerald-400/40 px-4 py-2 text-sm font-bold text-emerald-300">
              LIVE
            </div>
          </div>

          <div className="space-y-3">
            {[
              "Table 7 seated",
              "Kitchen ticket #42 started",
              "Server requested sauce refill",
              "Payment received from Table 4",
              "Guest moment uploaded",
              "Table 2 ready for cleanup",
            ].map((event) => (
              <div key={event} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-100">
                {event}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <div className="mb-6">
            <div className="mb-3 inline-flex rounded-full border border-emerald-400/30 px-4 py-2 text-sm font-bold text-emerald-300">
              LIVE SAMPLE MENU
            </div>

            <h2 className="text-3xl font-black">Tap A Menu Item. Build The Order.</h2>

            <p className="mt-3 max-w-3xl text-zinc-300">
              The menu does not just sit there. It opens an order card, carries table details, kitchen notes, and sends live work into the operation.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
              <h3 className="mb-4 text-xl font-black">Menu</h3>

              <div className="space-y-3">
                {menuItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => openOrderCard(item)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:border-emerald-400/40 hover:bg-emerald-500/10"
                  >
                    <div className="font-black">{item}</div>
                    <div className="mt-1 text-sm text-zinc-500">Open order card</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-amber-300">Order Card</h3>

              {activeItem ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="text-sm font-bold text-amber-300">Selected Item</div>
                    <div className="mt-1 text-2xl font-black">{activeItem}</div>
                  </div>

                  <select
                    value={table}
                    onChange={(event) => setTable(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-amber-300"
                  >
                    <option>Table 1</option>
                    <option>Table 2</option>
                    <option>Table 3</option>
                    <option>Table 4</option>
                    <option>Table 5</option>
                    <option>Table 6</option>
                    <option>Table 7</option>
                    <option>Table 8</option>
                  </select>

                  <div className="grid gap-3">
                    <button
                      onClick={() => setNoTomato(!noTomato)}
                      className={`rounded-2xl border px-4 py-3 text-left font-bold ${noTomato ? "border-amber-300 bg-amber-300 text-black" : "border-zinc-700 bg-black text-white"}`}
                    >
                      No tomato
                    </button>

                    <button
                      onClick={() => setToastedBun(!toastedBun)}
                      className={`rounded-2xl border px-4 py-3 text-left font-bold ${toastedBun ? "border-amber-300 bg-amber-300 text-black" : "border-zinc-700 bg-black text-white"}`}
                    >
                      Toasted bun
                    </button>

                    <button
                      onClick={() => setFries(!fries)}
                      className={`rounded-2xl border px-4 py-3 text-left font-bold ${fries ? "border-amber-300 bg-amber-300 text-black" : "border-zinc-700 bg-black text-white"}`}
                    >
                      Add fries
                    </button>
                  </div>

                  <input
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Extra note: sauce on side, cut in half..."
                    className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-amber-300"
                  />

                  <button
                    onClick={sendOrder}
                    className="w-full rounded-2xl bg-amber-300 px-4 py-4 font-black text-black transition hover:bg-amber-200"
                  >
                    Send To Live Orders
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-amber-400/30 bg-black/30 p-6 text-zinc-400">
                  Tap a menu item to open its live order card.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-emerald-300">Live Orders</h3>

              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-black">{order.item}</div>
                        <div className="text-sm text-zinc-400">{order.table}</div>
                      </div>

                      <div className="rounded-full border border-emerald-400/40 px-3 py-1 text-xs font-black text-emerald-300">
                        SENT
                      </div>
                    </div>

                    {order.note ? (
                      <div className="mt-3 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-200">
                        {order.note}
                      </div>
                    ) : null}
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

