import {
  ClipboardList,
  House,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export default function DemoHomeServicesLandingPage() {
  function scrollToNextSection() {
    document
      .getElementById("home-services-next")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020706] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(126,224,0,0.055),transparent_34%)]" />

      <div className="relative mx-auto w-full max-w-[1120px] px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pt-8">
        {/* BRAND / HEADER */}
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <a
            href="/planet/demo/home-services"
            aria-label="Okee Dokie Home Services home"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#80df00]/55 bg-[#80df00]/10 shadow-[0_0_26px_rgba(126,224,0,0.10)]">
              <House
                className="h-6 w-6 text-[#80df00]"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <div className="truncate text-lg font-black tracking-[-0.025em] sm:text-xl">
                OKEE DOKIE
              </div>
              <div className="truncate text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00] sm:text-xs">
                Home Services
              </div>
            </div>
          </a>

          <a
            href="tel:+18635550147"
            className="flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl border border-[#80df00]/40 bg-[#80df00]/10 px-4 text-sm font-black transition hover:border-[#80df00]/80 hover:bg-[#80df00]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80df00]"
          >
            <Phone className="h-4 w-4 text-[#80df00]" aria-hidden="true" />
            <span className="hidden sm:inline">Call</span>
          </a>
        </header>

        {/* HERO */}
        <section className="pt-12 text-center sm:pt-16 lg:pt-20">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#80df00]">
            Local Home Service Demo
          </p>

          <h1 className="mx-auto mt-5 max-w-[900px] text-[clamp(3.25rem,10vw,6.9rem)] font-black leading-[0.88] tracking-[-0.065em]">
            One place for
            <span className="mt-2 block text-[#80df00]">
              the work your home needs.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-[680px] text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            Yard care, exterior cleaning, repairs, maintenance, and everyday
            property services without the runaround.
          </p>

          <div className="mx-auto mt-8 grid max-w-[680px] gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={scrollToNextSection}
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl bg-[#80df00] px-6 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19] hover:shadow-[0_0_36px_rgba(126,224,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b7ff59] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020706]"
            >
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
              Tell Us What You Need
            </button>

            <a
              href="tel:+18635550147"
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl border border-[#80df00]/35 bg-black/70 px-6 font-black text-white transition hover:-translate-y-0.5 hover:border-[#80df00]/75 hover:bg-[#80df00]/10 hover:shadow-[0_0_30px_rgba(126,224,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80df00]"
            >
              <Phone className="h-5 w-5 text-[#80df00]" aria-hidden="true" />
              Call Okee Dokie
            </a>
          </div>

          <div className="mx-auto mt-5 flex max-w-[860px] flex-wrap justify-center gap-2">
            {[
              {
                label: "Local Home Service",
                icon: House,
              },
              {
                label: "Simple Requests",
                icon: ClipboardList,
              },
              {
                label: "Clear Follow-Up",
                icon: ShieldCheck,
              },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex min-h-[42px] items-center gap-2 rounded-full border border-white/16 bg-white/[0.025] px-4 text-[10px] font-black uppercase tracking-[0.13em] text-white/78"
              >
                <Icon className="h-4 w-4 text-[#80df00]" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>

          {/* HERO IMAGE */}
          <div className="relative mx-auto mt-10 max-w-[1040px] overflow-hidden rounded-[2rem] border border-[#80df00]/25 bg-[#06100a] shadow-[0_24px_90px_rgba(0,0,0,0.55),0_0_50px_rgba(126,224,0,0.06)] sm:mt-12">
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,transparent_62%,rgba(2,7,6,0.82)_100%)]" />

            <img
              src="/images/home-services-operational-hero.png"
              alt="Home service professional working at a residential property"
              width="1600"
              height="900"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[16/10] w-full object-cover object-center sm:aspect-[16/9]"
            />

            <div className="absolute bottom-0 left-0 right-0 z-20 p-5 text-left sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#80df00]/35 bg-black/70 px-4 py-2 backdrop-blur-sm">
                <Wrench className="h-4 w-4 text-[#80df00]" aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/88">
                  One request. A clear next step.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/*
          PHASE 2 START MARKER.
          We deliberately stop here until the live hero is visually inspected.
        */}
        <div
          id="home-services-next"
          className="h-8"
          aria-hidden="true"
        />
      </div>
    </main>
  );
}
