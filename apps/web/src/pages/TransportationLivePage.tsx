import { useState } from "react"

type Ride = {
  id: number
  rider: string
  pickup: string
  dropoff: string
  note: string
  status: string
}

export default function TransportationLivePage() {
  const [rides, setRides] = useState<Ride[]>([
    {
      id: 1,
      rider: "Pickup Request",
      pickup: "Downtown",
      dropoff: "Airport",
      note: "2 bags",
      status: "Driver assigned",
    },
    {
      id: 2,
      rider: "Return Ride",
      pickup: "Hotel",
      dropoff: "Restaurant",
      note: "Call when outside",
      status: "On route",
    },
  ])

  const [activeRide, setActiveRide] = useState("Airport Ride")
  const [pickup, setPickup] = useState("Downtown")
  const [dropoff, setDropoff] = useState("Airport")
  const [note, setNote] = useState("")
  const [wheelchair, setWheelchair] = useState(false)
  const [bags, setBags] = useState(true)

  const rideTypes = ["Airport Ride", "Local Pickup", "Medical Ride", "Event Shuttle"]

  function openRideCard(ride: string) {
    setActiveRide(ride)
    setPickup("Downtown")
    setDropoff("Airport")
    setNote("")
    setWheelchair(false)
    setBags(true)
  }

  function sendRide() {
    if (!activeRide) return

    setRides([
      {
        id: Date.now(),
        rider: activeRide,
        pickup,
        dropoff,
        note: [
          wheelchair ? "Wheelchair access" : "",
          bags ? "Has bags" : "No bags",
          note,
        ].filter(Boolean).join(" • "),
        status: "New request",
      },
      ...rides,
    ])
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <section className="mb-10">
          <div className="mb-4 inline-flex rounded-full border border-sky-400/40 px-4 py-2 text-sm font-semibold text-sky-300">
            Transportation
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Transportation Needs More Than A Website.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-2xl">
            A website tells people you offer rides. A Live Page shows what is moving.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <h2 className="text-2xl font-black">Traditional Website</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-400 sm:text-lg">
              <li>Phone Number</li>
              <li>Rates</li>
              <li>Service Area</li>
              <li>Photos</li>
              <li>Contact</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-zinc-900 p-4 text-sm font-semibold text-zinc-500">
              Mostly informational.
            </div>
          </div>

          <div className="rounded-3xl border border-sky-400/40 bg-sky-500/10 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-sky-300">Live Page</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-100 sm:text-lg">
              <li>Ride Requests</li>
              <li>Driver Status</li>
              <li>Pickup Awareness</li>
              <li>Route Movement</li>
              <li>Payment Status</li>
              <li>Passenger Notes</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-black/30 p-4 text-sm font-semibold text-sky-200">
              Operational awareness in real time.
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-3xl font-black">The Difference</h2>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
            A website helps riders find the service. A Live Page helps the ride actually move.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-sky-400/30 bg-sky-500/10 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Live Transportation Movement</h2>
              <p className="mt-2 text-zinc-300">
                This is what a Live Page can show while rides are actually moving.
              </p>
            </div>

            <div className="rounded-full border border-sky-400/40 px-4 py-2 text-sm font-bold text-sky-300">
              LIVE
            </div>
          </div>

          <div className="space-y-3">
            {[
              "New airport pickup requested",
              "Driver assigned to Downtown pickup",
              "Passenger added 2 bags",
              "Route started",
              "Payment ready",
              "Dropoff completed",
            ].map((event) => (
              <div key={event} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-100">
                {event}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <div className="mb-6">
            <div className="mb-3 inline-flex rounded-full border border-sky-400/30 px-4 py-2 text-sm font-bold text-sky-300">
              LIVE SAMPLE RIDE
            </div>

            <h2 className="text-3xl font-black">Build A Ride Request.</h2>

            <p className="mt-3 max-w-3xl text-zinc-300">
              The request is not just a contact form. It becomes a live ride card with pickup, dropoff, passenger needs, and route status.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
              <h3 className="mb-4 text-xl font-black">Ride Type</h3>

              <div className="space-y-3">
                {rideTypes.map((ride) => (
                  <button
                    key={ride}
                    onClick={() => openRideCard(ride)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:border-sky-400/40 hover:bg-sky-500/10"
                  >
                    <div className="font-black">{ride}</div>
                    <div className="mt-1 text-sm text-zinc-500">Build ride card</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-amber-300">Ride Card</h3>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-sm font-bold text-amber-300">Selected Ride</div>
                  <div className="mt-1 text-2xl font-black">{activeRide}</div>
                </div>

                <input
                  value={pickup}
                  onChange={(event) => setPickup(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-amber-300"
                />

                <input
                  value={dropoff}
                  onChange={(event) => setDropoff(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-amber-300"
                />

                <button
                  onClick={() => setWheelchair(!wheelchair)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${wheelchair ? "border-amber-300 bg-amber-300 text-black" : "border-zinc-700 bg-black text-white"}`}
                >
                  Wheelchair access
                </button>

                <button
                  onClick={() => setBags(!bags)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${bags ? "border-amber-300 bg-amber-300 text-black" : "border-zinc-700 bg-black text-white"}`}
                >
                  Has bags
                </button>

                <input
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Passenger note: call when outside, child seat..."
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-amber-300"
                />

                <button
                  onClick={sendRide}
                  className="w-full rounded-2xl bg-amber-300 px-4 py-4 font-black text-black transition hover:bg-amber-200"
                >
                  Send Ride Request
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-sky-400/30 bg-sky-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-sky-300">Live Ride Board</h3>

              <div className="space-y-3">
                {rides.map((ride) => (
                  <div key={ride.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-black">{ride.rider}</div>
                        <div className="text-sm text-zinc-400">{ride.pickup} ? {ride.dropoff}</div>
                      </div>

                      <div className="rounded-full border border-sky-400/40 px-3 py-1 text-xs font-black text-sky-300">
                        {ride.status}
                      </div>
                    </div>

                    {ride.note ? (
                      <div className="mt-3 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-200">
                        {ride.note}
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
