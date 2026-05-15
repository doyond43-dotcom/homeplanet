export default function OnlyTheEssentialsPublicLanding() {
  const phone = "8638013179";

  const services = [
    "Standard Cleaning",
    "Deep Cleaning",
    "Move-In / Move-Out",
    "Weekly / Biweekly",
    "Vacation Reset",
    "Simple Home Help",
  ];

  return (
    <main className="min-h-screen bg-[#071019] text-white">
      <section className="relative overflow-hidden border-b border-emerald-400/20">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/10 via-[#071019]/80 to-[#071019]" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24">
          <div className="inline-flex w-fit rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-1 text-xs font-black uppercase tracking-[0.24em] text-emerald-100">
            LOCAL CLEANING SERVICE
          </div>

          <div className="max-w-3xl">
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Only The Essentials Cleaning
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/75 md:text-xl">
              Simple, friendly cleaning help for local homes.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
              Standard cleaning, deep cleaning, move-out help, and simple scheduling without complicated apps or confusing steps.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={`tel:${phone}`}
              className="rounded-full bg-emerald-300 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.02]"
            >
              Call Caitlin
            </a>

            <a
              href={`sms:${phone}`}
              className="rounded-full border border-white/15 bg-white/[0.05] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/[0.08]"
            >
              Text Caitlin
            </a>

            <a
              href="/planet/only-the-essentials/request?type=book"
              className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-emerald-100 transition hover:bg-emerald-400/20"
            >
              Request Cleaning
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
            Cleaning made simple.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
            A clean home should feel peaceful, not stressful to schedule.
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
                Friendly scheduling, clear communication, and cleaning help that keeps things easy.
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[34px] border border-emerald-400/15 bg-emerald-400/10 p-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100/50">
            EASY SCHEDULING
          </div>

          <h2 className="mt-3 text-4xl font-black tracking-tight">
            Call, text, or request a cleaning.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70">
            Customers can ask a question, check availability, or request a cleaning in just a few taps.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`tel:${phone}`}
              className="rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019]"
            >
              Call Now
            </a>

            <a
              href={`sms:${phone}`}
              className="rounded-full border border-white/15 bg-white/[0.05] px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"
            >
              Send Text
            </a>

            <a
              href="/planet/only-the-essentials/request?type=question"
              className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-emerald-100"
            >
              Ask A Question
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
