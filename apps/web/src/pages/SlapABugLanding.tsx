export default function SlapABugLanding() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-green-950 to-black text-white">
      <section className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
        <img
          src="/images/slap-a-bug-logo.png"
          alt="Slap-A-Bug Pest Control"
          className="mb-6 w-full max-w-[260px] object-contain"
        />

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
          Okeechobee Pest Control
        </p>

        <h1 className="text-5xl font-black leading-none">
          GOT BUGS?
          <br />
          SLAP ’EM.
        </h1>

        <p className="mt-5 text-base leading-relaxed text-zinc-300">
          Local pest control for homes, sheds, barns, RVs, mobile homes &
          businesses around Okeechobee.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <a
            href="tel:8633683628"
            className="rounded-2xl bg-red-600 px-5 py-4 text-lg font-bold text-white"
          >
            Call Now
          </a>

          <a
            href="sms:+18633683628?&body=Hey%20Slap-A-Bug%2C%20I%20would%20like%20to%20request%20a%20free%20estimate%20for%20pest%20control."
            className="rounded-2xl bg-green-500 px-5 py-4 text-lg font-bold text-black"
          >
            Request Free Estimate
          </a>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-zinc-300">
          <div className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-2">
            Local & Family Owned
          </div>

          <div className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-2">
            Free Estimates
          </div>

        </div>

        <div className="mt-12 grid w-full gap-3 text-left">
          {[
            "Ant Control",
            "Roach Control",
            "Rodent Control",
            "Spider Treatments",
            "Lawn & Perimeter",
          ].map((service) => (
            <div
              key={service}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-4"
            >
              <p className="text-lg font-semibold">{service}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-red-400/40 bg-red-500/15 p-5 text-left">
          <p className="text-sm font-semibold uppercase tracking-wider text-red-300">
            Rodent Awareness
          </p>

          <p className="mt-3 text-sm leading-relaxed text-zinc-200">
            With all the recent talk about rodents and hantavirus, now’s a good
            time to protect garages, sheds, barns, feed rooms, and storage
            spaces before a small problem becomes a bigger one.
          </p>
        </div>

        <div className="mt-14 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            Call or Text Today
          </p>

          <a
            href="tel:8633683628"
            className="mt-3 block text-4xl font-black text-green-400"
          >
            (863) 368-3628
          </a>
        </div>
      </section>
    </main>
  )
}





