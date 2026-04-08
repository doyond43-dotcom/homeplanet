import { Link } from "react-router-dom";

export default function BeautySalonLandingPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[34px] border border-neutral-800 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%),linear-gradient(180deg,#171717_0%,#080808_100%)] p-8 lg:p-12">
            <div className="inline-flex rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-300">
              Color Me Crazy
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Hair. Color. Confidence.
            </h1>

            <p className="mt-5 max-w-xl text-base text-neutral-300 sm:text-lg">
              Book your appointment in seconds and send it straight to the live salon board.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/planet/beauty/color-me-crazy/book"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black"
              >
                Book Appointment
              </Link>

              <Link
                to="/planet/beauty/color-me-crazy"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 px-5 py-3 text-sm font-semibold text-white"
              >
                View Live Board
              </Link>
            </div>
          </section>

          <section className="rounded-[34px] border border-neutral-800 bg-neutral-950 p-6 lg:p-8">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-neutral-800 bg-black/50 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Fast booking</div>
                <div className="mt-2 text-lg font-semibold">No calls. No back and forth.</div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-black/50 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Live intake</div>
                <div className="mt-2 text-lg font-semibold">Appointments land on the board instantly.</div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-black/50 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Simple flow</div>
                <div className="mt-2 text-lg font-semibold">Landing page → booking → live board.</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}