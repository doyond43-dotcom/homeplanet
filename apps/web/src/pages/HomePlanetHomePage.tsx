import { ArrowRight, Building2, Camera, CheckCircle2, Globe2, Lock, MousePointerClick, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";

const examples = [
  {
    title: "Only The Essentials Cleaning",
    text: "A real customer page, request flow, and live business board for cleaning jobs.",
    href: "/planet/only-the-essentials",
  },
  {
    title: "Airboat Tour Experience",
    text: "A premium outdoor experience page with booking, memories, and customer flow direction.",
    href: "/planet/swamp-life",
  },
  {
    title: "Restaurant Operations Demo",
    text: "Live restaurant operations, table flow, kitchen coordination, and customer awareness.",
    href: "/planet/brahma-bull",
  },
  {
    title: "Creator Studio",
    text: "Launch your own live business system with intake, payments, QR flows, updates, and connected pages.",
    href: "/planet/creator/studio",
  },
];

const principles = [
  {
    icon: MousePointerClick,
    title: "Less clicks",
    text: "One clear action instead of six confusing steps.",
  },
  {
    icon: ShieldCheck,
    title: "No data games",
    text: "No creepy lead traps. No fake engagement. No harvesting people.",
  },
  {
    icon: Globe2,
    title: "Live pages",
    text: "Pages that move, update, collect proof, and help real work happen.",
  },
  {
    icon: Users,
    title: "Community owned",
    text: "Built for local people, local businesses, and real connection.",
  },
];

export default function HomePlanetHomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-15%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-emerald-500/12 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[20%] h-[45rem] w-[45rem] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_45%)]" />
      </div>
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6">
        <header className="flex items-center justify-between rounded-3xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-emerald-400 text-neutral-950">
              <Globe2 size={20} />
            </div>
            <div>
              <p className="text-sm font-black tracking-wide">HomePlanet</p>
              <p className="text-[11px] text-white/50">Live systems for real life</p>
            </div>
          </Link>

          <Link
            to="/planet/creator/studio"
            className="rounded-full bg-white px-4 py-2 text-xs font-black text-neutral-950 shadow-lg shadow-white/10"
          >
            Start
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-bold text-emerald-200">
              <Sparkles size={14} />
              The internet should feel alive again.
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Live pages for businesses, creators, and communities.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              HomePlanet replaces dead websites, scattered links, and bloated software with simple live systems people can actually use.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#examples"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-neutral-950 shadow-xl shadow-emerald-500/20"
              >
                Explore the Planet
                <ArrowRight size={18} />
              </a>

              <a
                href="#philosophy"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-6 py-4 text-sm font-black text-white"
              >
                See what your business could become
              </a>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-white/65 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <CheckCircle2 className="mb-3 text-emerald-300" size={20} />
                No app needed
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <Lock className="mb-3 text-emerald-300" size={20} />
                No data harvesting
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                <Building2 className="mb-3 text-emerald-300" size={20} />
                Built for real work
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-300/10 bg-white/[0.05] p-4 shadow-[0_0_80px_rgba(16,185,129,0.12)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_35%)]" />

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-neutral-950/90 p-5">
              <img
                src="/images/homeplanet-connected-flow-bg.png"
                alt="HomePlanet connected flow"
                className="absolute inset-0 h-full w-full object-cover object-[65%_55%] opacity-55 scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/80" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%)]" />

              <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">Live Planet</p>
                    <h2 className="mt-1 text-2xl font-black">Today’s connected flow</h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-neutral-950">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-neutral-950" />
                    LIVE
                  </div>
                </div>

                <div className="space-y-3">
                  {["Customer scans", "Request comes in", "Crew updates live", "Payment gets collected", "Proof stays attached"].map((item, index) => (
                    <div key={item} className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/35 p-4 backdrop-blur-sm transition duration-300 hover:border-emerald-300/30 hover:bg-black/45">
                      <div className="absolute left-0 top-0 h-full w-[3px] bg-emerald-400/40 opacity-0 transition duration-300 group-hover:opacity-100" />
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-sm font-black text-neutral-950">
                        {index + 1}
                      </div>
                      <p className="font-bold">{item}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-5 rounded-2xl border border-emerald-300/10 bg-black/40 p-4 text-sm leading-6 text-emerald-100 backdrop-blur-sm">
                  One link can become a customer page, booking flow, payment point, proof trail, memory page, and live business board.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="philosophy" className="relative z-10 mx-auto max-w-6xl px-5 py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">The philosophy</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Simple enough for customers. Strong enough to run the business.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {principles.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border border-white/[0.08] bg-white/[0.05] p-5">
                <Icon className="text-emerald-300" size={24} />
                <h3 className="mt-5 text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="examples" className="relative z-10 mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Real examples</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Built pages people can click, use, and understand.
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {examples.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="group rounded-3xl border border-white/[0.08] bg-white/[0.05] p-6 transition hover:border-emerald-300/40 hover:bg-white/[0.07]"
            >
              <div className="mb-8 flex items-center justify-between">
                <Camera className="text-emerald-300" size={24} />
                <ArrowRight className="text-white/40 transition group-hover:translate-x-1 group-hover:text-emerald-300" size={22} />
              </div>
              <h3 className="text-2xl font-black">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{item.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.04] p-8 text-center shadow-[0_0_80px_rgba(16,185,129,0.10)] backdrop-blur-xl sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_45%)]" />
          <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Your website should not just sit there.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
            It should help people book, pay, ask questions, see updates, follow the work, and stay connected to the business.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/planet/creator/studio"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-neutral-950"
            >
              Build from here
              <ArrowRight size={18} />
            </Link>
            <a
              href="#examples"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-4 text-sm font-black text-white"
            >
              Explore the Planet
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}











