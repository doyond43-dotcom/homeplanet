export default function OkieDokieSoftwashPage() {
  const services = [
    "House Washing",
    "Driveways",
    "Patios",
    "Walkways",
    "Pool Decks",
    "Outdoor Cleaning",
  ];

  return (
    <main className="min-h-screen bg-[#071019] text-white">
      <section className="relative overflow-hidden border-b border-emerald-400/20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('/images/lake-showcase-drone-sunset.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-[#071019]/85 to-[#071019]" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24">
          <div className="inline-flex w-fit rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-1 text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
            LOCAL EXTERIOR CLEANING
          </div>

          <div className="max-w-3xl">
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Okie Dokie Softwash
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/75 md:text-xl">
              Gentle exterior cleaning for local homes.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
              House washing, driveways, patios, walkways, and outdoor cleaning with simple scheduling and friendly local service.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="tel:8635320683"
              className="rounded-full bg-emerald-300 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.02]"
            >
              Call Daniel
            </a>

            <a
              href="sms:8635320683"
              className="rounded-full border border-white/15 bg-white/[0.05] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/[0.08]"
            >
              Text Daniel
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100/45">
            SERVICES
          </div>

          <h2 className="mt-2 text-4xl font-black tracking-tight">
            Simple exterior cleaning.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
            No complicated booking systems. No confusing apps. Just simple local service.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service}
              className="rounded-[28px] border border-white/10 bg-[#0c1824] p-6"
            >
              <div className="text-2xl font-black">{service}</div>

              <div className="mt-3 text-sm leading-7 text-white/60">
                Friendly scheduling and gentle exterior cleaning for local homes around Okeechobee.
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[34px] border border-emerald-400/15 bg-emerald-400/10 p-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100/50">
            LOCAL NEIGHBOR SERVICE
          </div>

          <h2 className="mt-3 text-4xl font-black tracking-tight">
            Easy scheduling. Simple communication.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            Call or text anytime to ask questions, check availability, or schedule a cleaning.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="tel:8635320683"
              className="rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019]"
            >
              Call Now
            </a>

            <a
              href="sms:8635320683"
              className="rounded-full border border-white/15 bg-white/[0.05] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"
            >
              Send Text
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100/50">
            QUICK QUESTION
          </div>

          <h2 className="mt-3 text-4xl font-black tracking-tight">
            Have a question first?
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
            Send a quick message and we'll get back to you. Local Okeechobee service. Simple communication. No complicated apps.
          </p>

          <div className="mt-8 grid gap-4">
            <input
              type="text"
              placeholder="Your name"
              className="rounded-2xl border border-white/10 bg-[#071019] px-5 py-4 text-white outline-none transition focus:border-emerald-300/40"
            />

            <input
              type="text"
              placeholder="Phone number"
              className="rounded-2xl border border-white/10 bg-[#071019] px-5 py-4 text-white outline-none transition focus:border-emerald-300/40"
            />

            <textarea
              placeholder="How can we help?"
              rows={5}
              className="rounded-2xl border border-white/10 bg-[#071019] px-5 py-4 text-white outline-none transition focus:border-emerald-300/40"
            />

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="rounded-full bg-emerald-300 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.02]"
              >
                Send Message
              </button>

              <a
                href="tel:8635320683"
                className="rounded-full border border-white/15 bg-white/[0.04] px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"
              >
                Call Daniel
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}



