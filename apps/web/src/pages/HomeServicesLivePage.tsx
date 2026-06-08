import { useNavigate } from "react-router-dom";

export default function HomeServicesLivePage() {
  const navigate = useNavigate();

return ( <main className="min-h-screen bg-black px-6 py-10 text-white"> <section className="mx-auto max-w-7xl">

    <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-400">
      Home Services Live System
    </p>

    <h1 className="mt-4 text-5xl font-black leading-[0.95] md:text-7xl">
      A Website Knows Information.
      <br />
      A Live Page Knows What's Happening.
    </h1>

    <p className="mt-6 max-w-3xl text-lg text-zinc-300">
      The difference isn't the website.
      The difference is awareness.
    </p>

    <div className="mt-10 grid gap-6 lg:grid-cols-2">

      <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-300">
          Traditional Website
        </p>

        <div className="mt-6 space-y-6">

          <div>
            <p className="font-bold">
              Customer asks: Where's my technician?
            </p>

            <div className="mt-2 rounded-2xl border border-red-400/20 bg-black/30 p-4">
              <p className="text-red-300">
                Customer calls office
              </p>
              <p className="text-red-300">
                Office calls technician
              </p>
              <p className="text-red-300">
                Waiting for response
              </p>
            </div>
          </div>

          <div>
            <p className="font-bold">
              Customer asks: Did you finish the work?
            </p>

            <div className="mt-2 rounded-2xl border border-red-400/20 bg-black/30 p-4">
              <p className="text-red-300">
                Customer calls office
              </p>
              <p className="text-red-300">
                Office checks with crew
              </p>
              <p className="text-red-300">
                Waiting for update
              </p>
            </div>
          </div>

          <div>
            <p className="font-bold">
              Customer asks: Did my payment go through?
            </p>

            <div className="mt-2 rounded-2xl border border-red-400/20 bg-black/30 p-4">
              <p className="text-red-300">
                Customer searches email
              </p>
              <p className="text-red-300">
                Office checks records
              </p>
              <p className="text-red-300">
                Waiting for confirmation
              </p>
            </div>
          </div>

          <div>
            <p className="font-bold">
              Customer asks: Are you coming today?
            </p>

            <div className="mt-2 rounded-2xl border border-red-400/20 bg-black/30 p-4">
              <p className="text-red-300">
                Customer sends text
              </p>
              <p className="text-red-300">
                Waiting for response
              </p>
              <p className="text-red-300">
                Calls again later
              </p>
            </div>
          </div>

        </div>
      </div>

      <div className="rounded-3xl border border-green-400/20 bg-green-500/10 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-300">
          Live Page
        </p>

        <div className="mt-6 space-y-6">

          <div>
            <p className="font-bold">
              Customer asks: Where's my technician?
            </p>

            <div className="mt-2 rounded-2xl border border-green-400/20 bg-black/30 p-4">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Assigned Technician
              </p>

              <p className="mt-1 text-xl font-black text-white">
                Mike Reynolds
              </p>

              <div className="mt-4 space-y-2">

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">
                    Status
                  </span>

                  <span className="font-bold text-green-400">
                    On Route
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">
                    ETA
                  </span>

                  <span className="font-bold text-white">
                    18 Minutes
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">
                    GPS Tracking
                  </span>

                  <span className="font-bold text-green-300">
                    Live
                  </span>
                </div>

              </div>

              <div className="mt-4 rounded-xl border border-green-400/10 bg-green-500/5 p-3">
                <p className="text-sm text-green-300">
                  Customer already sees all of this without calling.
                </p>
              </div>

            </div>
          </div>

          <div>
            <p className="font-bold">
              Customer asks: Did you finish the work?
            </p>

            <div className="mt-2 rounded-2xl border border-green-400/20 bg-black/30 p-4">
              <p className="text-green-300">
                Before photos attached
              </p>
              <p className="text-green-300">
                After photos attached
              </p>
              <p className="text-green-300">
                Work marked complete
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                Customer already sees it.
              </p>
            </div>
          </div>

          <div>
            <p className="font-bold">
              Customer asks: Did my payment go through?
            </p>

            <div className="mt-2 rounded-2xl border border-green-400/20 bg-black/30 p-4">
              <p className="text-green-300">
                Payment received
              </p>
              <p className="text-green-300">
                Receipt attached
              </p>
              <p className="text-green-300">
                Timestamp attached
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                Customer already sees it.
              </p>
            </div>
          </div>

          <div>
            <p className="font-bold">
              Customer asks: Are you coming today?
            </p>

            <div className="mt-2 rounded-2xl border border-green-400/20 bg-black/30 p-4">
              <p className="text-green-300">
                Scheduled today
              </p>
              <p className="text-green-300">
                Crew assigned
              </p>
              <p className="text-green-300">
                Live status visible
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                Customer already sees it.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>

    <div className="mt-8 rounded-3xl border border-green-400/20 bg-zinc-950 p-6">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-300">
        The Real Difference
      </p>

      <p className="mt-4 text-xl font-black leading-tight md:text-3xl">
        A website answers questions after someone asks.
      </p>

      <p className="mt-2 text-xl font-black leading-tight text-green-300 md:text-3xl">
        A Live Page removes the need to ask.
      </p>
        </div>

    <div className="mt-8 rounded-3xl border border-green-400/20 bg-green-500/5 p-8 text-center">
      <p className="mx-auto max-w-2xl text-zinc-300">
        Ready to connect customers, crews, proof, payments, and scheduling into one live operational system?
      </p>

      <button
        onClick={() => navigate("/planet/build-your-live-system")}
        className="mt-6 rounded-2xl bg-green-400 px-8 py-4 text-lg font-black text-black transition hover:bg-green-300"
      >
        Activate Home Services System
      </button>
    </div>

  </section>
</main>

)
}















