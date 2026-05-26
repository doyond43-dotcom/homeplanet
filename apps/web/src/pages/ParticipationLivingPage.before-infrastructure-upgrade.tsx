import { useNavigate } from "react-router-dom";

export default function ParticipationLivingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          &larr; Back
        </button>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Participation Living Infrastructure
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Coordinated Workforce Living
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
            Participation Living is designed around circulation, proximity,
            affordability, transportation coordination, and workforce support
            infrastructure.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-cyan-300">
              Workforce Towers
            </div>

            <div className="mt-4 text-4xl font-bold">
              148
            </div>

            <p className="mt-3 text-sm leading-6 text-cyan-100/70">
              Compact workforce-focused participation housing integrated into
              ecosystem circulation.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-emerald-300">
              Shuttle Coordination
            </div>

            <div className="mt-4 text-4xl font-bold">
              12
            </div>

            <p className="mt-3 text-sm leading-6 text-emerald-100/70">
              Workforce shuttle routes coordinated around operational timing
              and circulation flow.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
            <div className="text-xs uppercase tracking-[0.25em] text-amber-300">
              Daily Participation
            </div>

            <div className="mt-4 text-4xl font-bold">
              Active
            </div>

            <p className="mt-3 text-sm leading-6 text-amber-100/70">
              Participation infrastructure focused on reducing transportation
              friction and operational instability.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-2xl font-semibold">
              Why Participation Living Matters
            </h2>

            <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-400">
              <p>
                Most workforce systems today are disconnected from the places
                employees work, move, eat, and participate in daily.
              </p>

              <p>
                Participation Living reduces friction by creating closer
                ecosystem coordination between workforce housing,
                transportation, logistics, and operational infrastructure.
              </p>

              <p>
                The result is lower transportation stress, stronger circulation,
                reduced operational instability, and more affordable ecosystem
                participation.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-2xl font-semibold">
              Integrated Infrastructure
            </h2>

            <div className="mt-6 space-y-3">
              {[
                "Shuttle Coordination",
                "Laundry & Maintenance",
                "Food Hall & Dining",
                "GreenBasket Circulation",
                "Workforce Support Systems",
                "Hub Coordination",
                "Participation Services",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}

