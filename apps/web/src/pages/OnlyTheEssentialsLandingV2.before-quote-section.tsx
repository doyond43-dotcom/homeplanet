import {
  CalendarCheck,
  Heart,
  Home,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function OnlyTheEssentialsCustomerLanding() {
  const phone = "8638013179";

  const services = [
    {
      icon: Home,
      title: "Standard Cleaning",
      text: "Keep your home fresh, clean, and comfortable.",
    },
    {
      icon: Sparkles,
      title: "Deep Cleaning",
      text: "A deeper clean for areas that need extra attention.",
    },
    {
      icon: ShieldCheck,
      title: "Move-In / Move-Out",
      text: "Fresh starts for homes, rentals, and transitions.",
    },
    {
      icon: CalendarCheck,
      title: "Weekly / Biweekly",
      text: "Simple recurring cleaning that fits your schedule.",
    },
    {
      icon: Home,
      title: "Vacation Reset",
      text: "Reset help for guest stays, rentals, and busy weeks.",
    },
    {
      icon: Heart,
      title: "Simple Home Help",
      text: "Extra help to make life feel a little easier.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#07080d] text-white">
      <section className="relative border-b border-pink-300/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(236,72,153,0.22),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,0.18),transparent_32%),linear-gradient(135deg,#080914_0%,#120813_55%,#05060a_100%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-300/30 bg-pink-300/10 text-pink-200">
                <Heart size={22} />
              </div>
              <div>
                <p className="text-lg font-black leading-none">Only The Essentials</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.35em] text-pink-200">
                  Cleaning
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-pink-400 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-black shadow-lg shadow-pink-500/25"
              >
                <Phone size={15} />
                Call Kaitlin
              </a>
              <a
                href={`sms:${phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-pink-300/30 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                <MessageCircle size={15} />
                Text Kaitlin
              </a>
            </div>
          </header>

          <div className="grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-24">
            <div>
              <p className="font-serif text-2xl italic text-pink-200">
                Local. Reliable. Friendly.
              </p>

              <h1 className="mt-6 max-w-3xl text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
                Only The <span className="text-pink-400">Essentials</span>
                <span className="block font-serif italic text-white">Cleaning ♡</span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-200">
                Simple, high-quality cleaning for your home. Less stress, more time
                for what matters.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-400 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-black shadow-lg shadow-pink-500/25"
                >
                  <Phone size={16} />
                  Call Kaitlin
                </a>
                <a
                  href={`sms:${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-300/30 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
                >
                  <MessageCircle size={16} />
                  Text Kaitlin
                </a>
                <a
                  href="/planet/only-the-essentials/request?type=book"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
                >
                  <CalendarCheck size={16} />
                  Request Cleaning
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-6 text-xs font-bold text-zinc-300">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={15} className="text-pink-300" />
                  Trusted local service
                </span>
                <span className="inline-flex items-center gap-2">
                  <Heart size={15} className="text-pink-300" />
                  Friendly communication
                </span>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="rounded-[2.25rem] border border-pink-300/20 bg-white/5 p-5 shadow-2xl shadow-pink-950/40">
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black">
                  <img
                    src="/images/kaitlin-cleaning-profile.jpg"
                    alt="Only The Essentials Cleaning"
                    className="h-[520px] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-pink-300">
            Services
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Cleaning made simple. ♡
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 text-center shadow-xl shadow-black/20"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-300/25 bg-pink-400/15 text-pink-200">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-black leading-tight">{service.title}</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-300">{service.text}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-14 grid gap-8 rounded-[2rem] border border-pink-300/20 bg-pink-950/25 p-8 sm:p-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <h2 className="font-serif text-5xl italic leading-tight text-pink-200">
            Let’s make life a little easier. ♡
          </h2>

          <div>
            <p className="text-base leading-7 text-zinc-200">
              Call, text, or send a request. Kaitlin is here to help with simple
              scheduling and friendly communication.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-400 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-black"
              >
                <Phone size={16} />
                Call Kaitlin
              </a>
              <a
                href={`sms:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-300/30 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                <MessageCircle size={16} />
                Text Kaitlin
              </a>
              <a
                href="/planet/only-the-essentials/request?type=book"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/20 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                <CalendarCheck size={16} />
                Request Cleaning
              </a>
            </div>
          </div>
        </div>

        <footer className="py-12 text-center">
  <p className="font-serif text-3xl italic text-pink-200">
    Only The Essentials Cleaning ♡
  </p>
  <p className="mt-3 text-sm font-semibold text-zinc-300">
    Okeechobee, Florida
  </p>
  <p className="mt-6 text-xs text-zinc-500">
    © 2026 Only The Essentials Cleaning
  </p>
  <p className="mt-2 text-[11px] text-zinc-600">
    Made with HomePlanet
  </p>
</footer>
      </section>
    </main>
  );
}

