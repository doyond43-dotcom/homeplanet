import { useState } from "react"

type Need = {
  id: number
  title: string
  area: string
  note: string
  status: string
}

export default function CommunityLivePage() {
  const [needs, setNeeds] = useState<Need[]>([
    { id: 1, title: "Yard help needed", area: "North side", note: "Tall grass, needs second pass", status: "Open" },
    { id: 2, title: "Scrap pickup", area: "Near driveway", note: "Pile ready by curb", status: "Helper interested" },
  ])

  const [activeNeed, setActiveNeed] = useState("Yard help needed")
  const [area, setArea] = useState("North side")
  const [elderly, setElderly] = useState(true)
  const [tools, setTools] = useState(false)
  const [note, setNote] = useState("")

  const needTypes = ["Yard help needed", "Scrap pickup", "Food dropoff", "Volunteer check-in"]

  function openNeedCard(need: string) {
    setActiveNeed(need)
    setArea("North side")
    setElderly(true)
    setTools(false)
    setNote("")
  }

  function postNeed() {
    if (!activeNeed) return

    setNeeds([
      {
        id: Date.now(),
        title: activeNeed,
        area,
        note: [
          elderly ? "Elderly resident" : "",
          tools ? "Tools needed" : "Tools available",
          note,
        ].filter(Boolean).join(" • "),
        status: "Open",
      },
      ...needs,
    ])
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <section className="mb-10">
          <div className="mb-4 inline-flex rounded-full border border-violet-400/40 px-4 py-2 text-sm font-semibold text-violet-300">
            Community Board
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Communities Need More Than Posts.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-2xl">
            A post tells people something happened. A Live Page shows what needs help, who is responding, and what changed.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <h2 className="text-2xl font-black">Traditional Website Or Post</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-400 sm:text-lg">
              <li>Announcement</li>
              <li>Phone Number</li>
              <li>Comments</li>
              <li>Photos</li>
              <li>Old Updates</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-zinc-900 p-4 text-sm font-semibold text-zinc-500">
              Mostly informational.
            </div>
          </div>

          <div className="rounded-3xl border border-violet-400/40 bg-violet-500/10 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-violet-300">Live Page</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-100 sm:text-lg">
              <li>Needs Board</li>
              <li>Volunteer Response</li>
              <li>Project Status</li>
              <li>Local Workforce</li>
              <li>Support Updates</li>
              <li>Proof Of Help</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-black/30 p-4 text-sm font-semibold text-violet-200">
              Community awareness in real time.
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-3xl font-black">The Difference</h2>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
            A post can get attention. A Live Page can organize the response.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-violet-400/30 bg-violet-500/10 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">Live Community Movement</h2>
              <p className="mt-2 text-zinc-300">
                This is what a Live Page can show while people are actually helping.
              </p>
            </div>

            <div className="rounded-full border border-violet-400/40 px-4 py-2 text-sm font-bold text-violet-300">
              LIVE
            </div>
          </div>

          <div className="space-y-3">
            {[
              "Neighbor posted yard help request",
              "Volunteer offered mower",
              "Scrap pickup marked available",
              "Second grass pass requested",
              "Photo proof added",
              "Need marked helped",
            ].map((event) => (
              <div key={event} className="rounded-2xl border border-white/10 bg-black/30 p-4 text-zinc-100">
                {event}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <div className="mb-6">
            <div className="mb-3 inline-flex rounded-full border border-violet-400/30 px-4 py-2 text-sm font-bold text-violet-300">
              LIVE SAMPLE NEED
            </div>

            <h2 className="text-3xl font-black">Build A Community Need Card.</h2>

            <p className="mt-3 max-w-3xl text-zinc-300">
              Instead of a post disappearing in comments, the need becomes a simple card with location area, helper details, and current status.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
              <h3 className="mb-4 text-xl font-black">Need Type</h3>

              <div className="space-y-3">
                {needTypes.map((need) => (
                  <button
                    key={need}
                    onClick={() => openNeedCard(need)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:border-violet-400/40 hover:bg-violet-500/10"
                  >
                    <div className="font-black">{need}</div>
                    <div className="mt-1 text-sm text-zinc-500">Build need card</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-amber-300">Need Card</h3>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-sm font-bold text-amber-300">Selected Need</div>
                  <div className="mt-1 text-2xl font-black">{activeNeed}</div>
                </div>

                <input
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none focus:border-amber-300"
                />

                <button
                  onClick={() => setElderly(!elderly)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${elderly ? "border-amber-300 bg-amber-300 text-black" : "border-zinc-700 bg-black text-white"}`}
                >
                  Elderly resident
                </button>

                <button
                  onClick={() => setTools(!tools)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${tools ? "border-amber-300 bg-amber-300 text-black" : "border-zinc-700 bg-black text-white"}`}
                >
                  Tools needed
                </button>

                <input
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Need note: second pass, pile by curb, before rain..."
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-amber-300"
                />

                <button
                  onClick={postNeed}
                  className="w-full rounded-2xl bg-amber-300 px-4 py-4 font-black text-black transition hover:bg-amber-200"
                >
                  Post Need To Live Board
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-violet-400/30 bg-violet-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-violet-300">Live Needs Board</h3>

              <div className="space-y-3">
                {needs.map((need) => (
                  <div key={need.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-black">{need.title}</div>
                        <div className="text-sm text-zinc-400">{need.area}</div>
                      </div>

                      <div className="rounded-full border border-violet-400/40 px-3 py-1 text-xs font-black text-violet-300">
                        {need.status}
                      </div>
                    </div>

                    {need.note ? (
                      <div className="mt-3 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-zinc-200">
                        {need.note}
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
