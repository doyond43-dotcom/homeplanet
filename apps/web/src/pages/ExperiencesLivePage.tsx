import { useState } from "react"

type Moment = {
  id: number
  title: string
  guests: string
  note: string
  status: string
}

export default function ExperiencesLivePage() {
  const [moments, setMoments] = useState<Moment[]>([
    {
      id: 1,
      title: "Sunset Airboat Tour",
      guests: "4 guests",
      note: "Birthday group - Photo added",
      status: "Memory Created",
    },
    {
      id: 2,
      title: "Lake Charter",
      guests: "2 guests",
      note: "First time visitors - Guide note saved",
      status: "Experience Active",
    },
  ])

  const [title, setTitle] = useState("Sunset Airboat Tour")
  const [guests, setGuests] = useState("4 guests")
  const [birthday, setBirthday] = useState(true)
  const [anniversary, setAnniversary] = useState(false)
  const [firstTime, setFirstTime] = useState(true)
  const [note, setNote] = useState("Seen 3 alligators and a bald eagle")

  function createMoment() {
    setMoments([
      {
        id: Date.now(),
        title,
        guests,
        status: "Guest Moment Created",
        note: [
          birthday ? "Birthday group" : "",
          anniversary ? "Anniversary" : "",
          firstTime ? "First time visitors" : "",
          note,
        ].filter(Boolean).join(" - "),
      },
      ...moments,
    ])
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <section className="mb-10">
          <div className="mb-4 inline-flex rounded-full border border-fuchsia-400/40 px-4 py-2 text-sm font-semibold text-fuchsia-300">
            Experiences & Events
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Experiences Need More Than Booking Pages.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-2xl">
            A website sells the experience. A Live Page captures what happened and turns it into a memory.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
            <h2 className="text-2xl font-black">Traditional Website</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-400 sm:text-lg">
              <li>Photos</li>
              <li>Pricing</li>
              <li>Schedule</li>
              <li>Booking Info</li>
              <li>Contact</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-zinc-900 p-4 text-sm font-semibold text-zinc-500">
              Mostly informational.
            </div>
          </div>

          <div className="rounded-3xl border border-fuchsia-400/40 bg-fuchsia-500/10 p-6 sm:p-8">
            <h2 className="text-2xl font-black text-fuchsia-300">Live Page</h2>

            <ul className="mt-5 space-y-3 text-base text-zinc-100 sm:text-lg">
              <li>Guest Check-In</li>
              <li>Experience Status</li>
              <li>Guide Notes</li>
              <li>Photos Added</li>
              <li>Memory Pages</li>
              <li>Guest Moments</li>
            </ul>

            <div className="mt-7 rounded-2xl bg-black/30 p-4 text-sm font-semibold text-fuchsia-200">
              Experience awareness in real time.
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-3xl font-black">The Difference</h2>

          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
            A website can sell the trip. A Live Page can preserve the moment.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-6 sm:p-8">
          <h2 className="mb-4 text-3xl font-black">Live Experience Movement</h2>

          <div className="space-y-3">
            {[
              "Guests checked in",
              "Experience started",
              "Guide note added",
              "Photo uploaded",
              "Memory page created",
              "Guest shared moment",
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
            <div className="mb-3 inline-flex rounded-full border border-fuchsia-400/30 px-4 py-2 text-sm font-bold text-fuchsia-300">
              LIVE EXPERIENCE DEMO
            </div>

            <h2 className="text-3xl font-black">
              Create A Guest Moment.
            </h2>

            <p className="mt-3 max-w-3xl text-zinc-300">
              The experience does not end when the booking is paid. It becomes a live memory trail guests can keep, share, and remember.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-amber-300">
                Guest Moment Builder
              </h3>

              <div className="space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
                />

                <input
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
                />

                <button
                  onClick={() => setBirthday(!birthday)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${
                    birthday
                      ? "border-amber-300 bg-amber-300 text-black"
                      : "border-zinc-700 bg-black text-white"
                  }`}
                >
                  Birthday group
                </button>

                <button
                  onClick={() => setAnniversary(!anniversary)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${
                    anniversary
                      ? "border-amber-300 bg-amber-300 text-black"
                      : "border-zinc-700 bg-black text-white"
                  }`}
                >
                  Anniversary
                </button>

                <button
                  onClick={() => setFirstTime(!firstTime)}
                  className={`rounded-2xl border px-4 py-3 text-left font-bold ${
                    firstTime
                      ? "border-amber-300 bg-amber-300 text-black"
                      : "border-zinc-700 bg-black text-white"
                  }`}
                >
                  First time visitors
                </button>

                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Guide note, guest reaction, photo moment..."
                  className="w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3"
                />

                <button
                  onClick={createMoment}
                  className="w-full rounded-2xl bg-amber-300 px-4 py-4 font-black text-black"
                >
                  Create Guest Moment
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-5">
              <h3 className="mb-4 text-xl font-black text-fuchsia-300">
                Live Experience Feed
              </h3>

              <div className="space-y-3">
                {moments.map((moment) => (
                  <div
                    key={moment.id}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4"
                  >
                    <div className="font-black">{moment.title}</div>

                    <div className="mt-2 text-sm text-zinc-400">
                      {moment.guests}
                    </div>

                    <div className="mt-2 text-sm text-fuchsia-300">
                      {moment.status}
                    </div>

                    <div className="mt-3 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm">
                      {moment.note}
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