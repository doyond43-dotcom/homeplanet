import { useState } from "react"

type Update = {
  id: number
  status: string
  area: string
  note: string
}

export default function PlanetGuardianLivePage() {
  const [status, setStatus] = useState("Safe")
  const [area, setArea] = useState("Home area")
  const [trustedCircle, setTrustedCircle] = useState(true)
  const [publicContact, setPublicContact] = useState(true)
  const [note, setNote] = useState("Friendly. Do not chase. Contact guardian first.")

  const [updates, setUpdates] = useState<Update[]>([
    {
      id: 1,
      status: "Safe",
      area: "Home area",
      note: "Guardian profile active",
    },
    {
      id: 2,
      status: "Seen",
      area: "Near park entrance",
      note: "Public sighting submitted without exposing private contact info",
    },
  ])

  function addGuardianUpdate() {
    setUpdates([
      {
        id: Date.now(),
        status,
        area,
        note: [
          trustedCircle ? "Trusted circle notified" : "",
          publicContact ? "Public-safe contact on" : "Private contact hidden",
          note,
        ].filter(Boolean).join(" • "),
      },
      ...updates,
    ])
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <section className="mb-10">
          <div className="mb-4 inline-flex rounded-full border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-300">
            Planet Guardian
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Safety Needs More Than A Profile Page.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-2xl">
            A profile tells people who someone is. A Guardian Live Page shows safety status, trusted contact, sightings, and what changed.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <h2 className="text-2xl font-black">Traditional Profile Page</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-400 sm:text-lg">
              <li>Name</li>
              <li>Photo</li>
              <li>Basic Info</li>
              <li>Owner Contact</li>
              <li>Static Notes</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-zinc-900 p-4 text-sm font-semibold text-zinc-500">
              Mostly informational.
            </div>
          </div>

          <div className="rounded-3xl border border-cyan-400/40 bg-cyan-500/10 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-cyan-300">Planet Guardian Live Page</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-100 sm:text-lg">
              <li>Safety Status</li>
              <li>Trusted Circle</li>
              <li>Public-Safe Contact</li>
              <li>Last Seen Area</li>
              <li>Sightings Timeline</li>
              <li>Emergency Notes</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-black/30 p-4 text-sm font-semibold text-cyan-200">
              Protected safety awareness in real time.
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-3xl font-black">The Difference</h2>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
            A profile can identify. A Guardian Live Page can protect, update, and guide the response.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-cyan-400/30 bg-cyan-500/10 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Live Guardian Movement</h2>
              <p className="mt-2 text-zinc-300">
                This is what Guardian can show when safety status changes.
              </p>
            </div>

            <div className="rounded-full border border-cyan-400/40 px-4 py-2 text-sm font-bold text-cyan-300">
              LIVE
            </div>
          </div>

          <div className="space-y-3">
            {[
              "Guardian profile scanned",
              "Public-safe contact opened",
              "Trusted circle notified",
              "Last seen area updated",
              "Sighting submitted",
              "Status changed to safe",
            ].map((event) => (
              <div key={event} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-100">
                {event}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <div className="mb-6">
            <div className="mb-3 inline-flex rounded-full border border-cyan-400/30 px-4 py-2 text-sm font-bold text-cyan-300">
              LIVE GUARDIAN DEMO
            </div>

            <h2 className="text-3xl font-black">Update A Guardian Safety Page.</h2>

            <p className="mt-3 max-w-3xl text-zinc-300">
              Planet Guardian is not just a public page. It is a protected safety layer for pets, people, vehicles, and emergency moments.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-amber-300">
                Guardian Control
              </h3>

              <div className="space-y-4">
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-amber-300"
                >
                  <option>Safe</option>
                  <option>Missing</option>
                  <option>Seen</option>
                  <option>Needs Help</option>
                  <option>Found</option>
                </select>

                <input
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  placeholder="Last seen area"
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-amber-300"
                />

                <button
                  onClick={() => setTrustedCircle(!trustedCircle)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${trustedCircle ? "border-amber-300 bg-amber-300 text-black" : "border-zinc-700 bg-black text-white"}`}
                >
                  Trusted circle notified
                </button>

                <button
                  onClick={() => setPublicContact(!publicContact)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${publicContact ? "border-amber-300 bg-amber-300 text-black" : "border-zinc-700 bg-black text-white"}`}
                >
                  Public-safe contact on
                </button>

                <input
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Safety note: do not chase, needs medication, call guardian..."
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-amber-300"
                />

                <button
                  onClick={addGuardianUpdate}
                  className="w-full rounded-2xl bg-amber-300 px-4 py-4 font-black text-black transition hover:bg-amber-200"
                >
                  Update Guardian Page
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-400/30 bg-cyan-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-cyan-300">
                Live Guardian Timeline
              </h3>

              <div className="space-y-3">
                {updates.map((update) => (
                  <div key={update.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-black">{update.status}</div>
                        <div className="text-sm text-zinc-400">{update.area}</div>
                      </div>

                      <div className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-black text-cyan-300">
                        UPDATED
                      </div>
                    </div>

                    {update.note ? (
                      <div className="mt-3 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-200">
                        {update.note}
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
