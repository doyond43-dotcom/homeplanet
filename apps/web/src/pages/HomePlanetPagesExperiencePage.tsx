import { ArrowRight, BadgeCheck, Contact, Globe2, Image, MousePointerClick, Sparkles, Store } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  { icon: Store, title: "Identity", text: "Your business, creator brand, organization, or local idea gets a clear public home." },
  { icon: Image, title: "Services", text: "People can quickly understand what you offer without digging through clutter." },
  { icon: BadgeCheck, title: "Trust", text: "Photos, proof, details, and simple positioning make the page feel real and credible." },
  { icon: MousePointerClick, title: "Activation", text: "The page guides visitors toward one clear action instead of leaving them confused." },
  { icon: Contact, title: "Customer Connection", text: "Calls, requests, bookings, messages, and next steps become easier to follow." },
];

export default function HomePlanetPagesExperiencePage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-xl">
          <Link to="/planet/home" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400 text-black"><Globe2 size={21} /></div>
            <div><p className="text-sm font-black tracking-wide">HomePlanet</p><p className="text-[11px] text-white/50">HomePlanet Pages</p></div>
          </Link>
          <Link to="/planet/homeplanet-pages" className="rounded-full bg-white px-4 py-2 text-xs font-black text-black">Build</Link>
        </header>

        <div className="grid items-center gap-10 py-16 lg:grid-cols-[1fr_.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-200">
              <Sparkles size={14} /> See how it works. Build your page. Go live.
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-tight sm:text-6xl lg:text-7xl">Launch a premium local presence.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">HomePlanet Pages help local businesses, creators, organizations, and community ideas look real, clear, premium, and ready for action.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/planet/homeplanet-pages" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black shadow-xl shadow-emerald-500/20">Build My Page <ArrowRight size={18} /></Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-6 py-4 text-sm font-black text-white">See The Flow</a>
            </div>
          </div>

          <div className="relative min-h-[500px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-black shadow-[0_0_90px_rgba(16,185,129,0.16)]">
            <img src="/images/appointments-operational-hero.png" alt="HomePlanet Pages" className="absolute inset-0 h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 p-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">HomePlanet Pages</p>
              <p className="mt-2 max-w-sm text-2xl font-black">Identity to customer action — connected.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">How it works</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">The page comes before the platform.</h2>
          <p className="mt-4 text-lg leading-8 text-white/62">People need to understand who you are, what you do, and what to do next.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => { const Icon = step.icon; return (
            <div key={step.title} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-black text-emerald-300">0{index + 1}</p><Icon className="mt-5 text-emerald-300" size={24} />
              <h3 className="mt-5 text-lg font-black">{step.title}</h3><p className="mt-3 text-sm leading-6 text-white/58">{step.text}</p>
            </div>
          );})}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2.5rem] border border-emerald-300/20 bg-emerald-300/10 p-8 text-center sm:p-12">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Ready to build your page?</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/68">Start with your identity. HomePlanet turns it into a clear local presence people can understand fast.</p>
          <Link to="/planet/homeplanet-pages" className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black">Build My Page <ArrowRight size={18} /></Link>
        </div>
      </section>
    </main>
  );
}


