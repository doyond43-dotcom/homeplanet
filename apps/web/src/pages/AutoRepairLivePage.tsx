import { useState } from "react"

type Repair = {
  id: number
  vehicle: string
  status: string
  note: string
  approval: string
}

export default function AutoRepairLivePage() {
  const [repairs, setRepairs] = useState<Repair[]>([
    {
      id: 1,
      vehicle: "2018 Ford F-150",
      status: "Waiting Approval",
      note: "Front brakes worn",
      approval: "$420 estimate",
    },
    {
      id: 2,
      vehicle: "Toyota Camry",
      status: "Parts Ordered",
      note: "Water pump replacement",
      approval: "Approved",
    },
  ])

  const [vehicle, setVehicle] = useState("2018 Ford F-150")
  const [estimate, setEstimate] = useState("$420")
  const [customerApproved, setCustomerApproved] = useState(false)
  const [partsNeeded, setPartsNeeded] = useState(true)
  const [note, setNote] = useState("")

  function sendRepairCard() {
    setRepairs([
      {
        id: Date.now(),
        vehicle,
        status: customerApproved ? "Approved" : "Waiting Approval",
        approval: estimate,
        note: [
          partsNeeded ? "Parts needed" : "Parts in stock",
          note,
        ].filter(Boolean).join(" • "),
      },
      ...repairs,
    ])
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">

        <section className="mb-10">
          <div className="mb-4 inline-flex rounded-full border border-orange-400/40 px-4 py-2 text-sm font-semibold text-orange-300">
            Auto Repair
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Repair Shops Need More Than Websites.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-2xl">
            A website tells customers what you do. A Live Page shows what is happening to their vehicle.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <h2 className="text-2xl font-black">Traditional Website</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-400 sm:text-lg">
              <li>Services</li>
              <li>Hours</li>
              <li>Phone Number</li>
              <li>Reviews</li>
              <li>Location</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-zinc-900 p-4 text-sm font-semibold text-zinc-500">
              Mostly informational.
            </div>
          </div>

          <div className="rounded-3xl border border-orange-400/40 bg-orange-500/10 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-orange-300">Live Page</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-100 sm:text-lg">
              <li>Repair Status</li>
              <li>Customer Approvals</li>
              <li>Parts Tracking</li>
              <li>Payment Status</li>
              <li>Photo Proof</li>
              <li>Vehicle Timeline</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-black/30 p-4 text-sm font-semibold text-orange-200">
              Operational awareness in real time.
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-3xl font-black">The Difference</h2>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
            A website gets the customer in the door. A Live Page keeps them informed during the repair.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-orange-400/30 bg-orange-500/10 p-6 sm:p-8">
          <h2 className="text-3xl font-black mb-4">Live Repair Movement</h2>

          <div className="space-y-3">
            {[
              "Vehicle checked in",
              "Brake issue discovered",
              "Estimate sent",
              "Customer approved repair",
              "Parts ordered",
              "Repair completed",
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
            <div className="mb-3 inline-flex rounded-full border border-orange-400/30 px-4 py-2 text-sm font-bold text-orange-300">
              LIVE SAMPLE REPAIR
            </div>

            <h2 className="text-3xl font-black">
              Build A Repair Approval Card.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">

            <div className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-amber-300">
                Repair Card
              </h3>

              <div className="space-y-4">
                <input
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
                />

                <input
                  value={estimate}
                  onChange={(e) => setEstimate(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
                />

                <button
                  onClick={() => setCustomerApproved(!customerApproved)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${
                    customerApproved
                      ? "border-amber-300 bg-amber-300 text-black"
                      : "border-zinc-700 bg-black text-white"
                  }`}
                >
                  Customer Approved
                </button>

                <button
                  onClick={() => setPartsNeeded(!partsNeeded)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${
                    partsNeeded
                      ? "border-amber-300 bg-amber-300 text-black"
                      : "border-zinc-700 bg-black text-white"
                  }`}
                >
                  Parts Needed
                </button>

                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Brake pads, rotor wear, customer requested photos..."
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
                />

                <button
                  onClick={sendRepairCard}
                  className="w-full rounded-2xl bg-amber-300 px-4 py-4 font-black text-black"
                >
                  Send Approval Card
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-orange-400/30 bg-orange-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-orange-300">
                Live Repair Board
              </h3>

              <div className="space-y-3">
                {repairs.map((repair) => (
                  <div
                    key={repair.id}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4"
                  >
                    <div className="font-black">{repair.vehicle}</div>

                    <div className="mt-2 text-sm text-zinc-400">
                      {repair.status}
                    </div>

                    <div className="mt-2 text-sm text-orange-300">
                      {repair.approval}
                    </div>

                    <div className="mt-3 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm">
                      {repair.note}
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
