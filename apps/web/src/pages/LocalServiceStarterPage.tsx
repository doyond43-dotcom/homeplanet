export default function LocalServiceStarterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-green-950 to-black text-white">
      <section className="mx-auto flex max-w-md flex-col items-center px-6 py-16 text-center">
        <div className="mb-6 text-center">
          <div className="inline-flex flex-col items-center rounded-3xl border border-green-400/30 bg-gradient-to-br from-zinc-950 via-black to-green-950 px-8 py-5 shadow-2xl shadow-green-500/20">
            <div className="text-4xl font-black tracking-tight text-white">
              APEX
            </div>
            <div className="-mt-1 rounded-full bg-red-600 px-4 py-1 text-xs font-black uppercase tracking-[0.25em] text-white">
              Home Services
            </div>
          </div>
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
          Premium Local Service Page
        </p>

        <h1 className="text-5xl font-black leading-none">
          LOOK LOCAL.
          <br />
          BOOK FAST.
        </h1>

        <p className="mt-5 text-base leading-relaxed text-zinc-300">
          A premium mobile-first page that makes your business look sharp, trusted, and easy to contact.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <a
            href="tel:+15555555555"
            className="rounded-2xl bg-red-600 px-5 py-4 text-lg font-bold text-white"
          >
            Call Now
          </a>

          <a
            href="sms:+15555555555?&body=Hey%2C%20I%20would%20like%20more%20information%20about%20your%20services."
            className="rounded-2xl bg-green-500 px-5 py-4 text-lg font-bold text-black"
          >
            Request Info
          </a>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-zinc-300">
          <div className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-2">
            Fast Loading
          </div>

          <div className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-2">
            Mobile First
          </div>
        </div>

        <div className="mt-12 grid w-full gap-3 text-left">
          {[
            "More Calls",
            "Easier Booking",
            "Looks Professional",
            "Mobile Friendly",
            "Built To Convert",
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
            Stop Looking Behind
          </p>

          <p className="mt-3 text-sm leading-relaxed text-zinc-200">
            Most local businesses do not need a giant website to compete. They need a page that looks premium, loads fast, and makes it easy for customers to call, text, or request service.
          </p>
        </div>

        
        <div className="mt-10 w-full rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-300">
            REAL LOCAL FEEDBACK
          </p>

          <p className="mt-3 text-base leading-relaxed text-zinc-100">
            “Way easier than my old website. Customers actually started calling and texting directly instead of getting confused.”
          </p>

          <p className="mt-4 text-sm font-semibold text-zinc-400">
            — Local service business owner
          </p>
        </div>
        <div className="mt-14 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            Example Contact
          </p>

          <a
            href="tel:+15555555555"
            className="mt-3 block text-4xl font-black text-green-400"
          >
            (555) 555-5555
          </a>
        </div>
        <a
          href="https://homeplanet.city"
          target="_blank"
          rel="noreferrer"
          className="mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 transition hover:text-zinc-300"
        >
          Built by HomePlanet
        </a>
      </section>
    </main>
  )
}



