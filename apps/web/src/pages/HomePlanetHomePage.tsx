import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  CircleDot,
  Globe2,
  HeartHandshake,
  Lock,
  MousePointerClick,
  PawPrint,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const systems = [
  {
    image: "/images/home-services-operational-hero.png",
    title: "Live Business Systems",
    text: "Customer requests, scheduling, dispatch, payments, proof, and completion all connected in one operational flow.",
    href: "/planet/build-your-live-system",
  },
  {
    image: "/images/food-truck-operational-hero.png",
    title: "Restaurant Intelligence",
    text: "Tables, kitchen activity, customer requests, crew awareness, and live operational visibility.",
    href: "/planet/brahma-bull",
  },
  {
    image: "/images/bella-demo.jpg",
    title: "Guardian Pet Recovery",
    text: "Pet recovery, family protection, emergency access, and connected awareness systems.",
    href: "/planet/guardian/home",
  },
  {
    image: "/images/HomePlanet-CommunityPulse-MobileView-v1.png",
    title: "Community Layer",
    text: "Local needs, local offers, volunteer opportunities, events, and real community circulation.",
    href: "/city",
  },
  {
    image: "/images/appointments-operational-hero.png",
    title: "Creator Systems",
    text: "Launch pages, intake flows, customer journeys, and operational systems built from an idea.",
    href: "/planet/creator/studio",
  },
  {
    image: "/images/operations-hub-command-center-cover.png",
    title: "Operations Hub",
    text: "The command center connecting businesses, communities, services, and awareness into one ecosystem.",
    href: "/planet/home",
  },
];
const doctrine = [
  ["No Surveillance", "HomePlanet is not built to watch people."],
  ["No Data Harvesting", "No selling attention. No creepy lead traps."],
  ["No Engagement Traps", "No infinite scroll. No fake urgency."],
  ["Truth Chain", "Need to response to action to outcome to proof."],
  ["Community First", "Built for people, businesses, families, and local life."],
];

export default function HomePlanetHomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050607] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-20%] top-[-20%] h-[42rem] w-[42rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-[-15%] top-[5%] h-[38rem] w-[38rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-25%] left-[25%] h-[44rem] w-[44rem] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-xl">
          <Link to="/planet/home" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400 text-black">
              <Globe2 size={21} />
            </div>
            <div>
              <p className="text-sm font-black tracking-wide">HomePlanet</p>
              <p className="text-[11px] text-white/50">Live systems for real life</p>
            </div>
          </Link>

          <div className="hidden items-center gap-6 text-xs font-bold text-white/55 sm:flex">
            <a href="#systems" className="hover:text-white">Systems</a>
            <a href="#doctrine" className="hover:text-white">Doctrine</a>
            <Link to="/city" className="hover:text-white">Cities</Link>
          </div>

          <Link to="/planet/build-your-live-system" className="rounded-full bg-white px-4 py-2 text-xs font-black text-black">
            Build
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_.95fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-200">
              <Sparkles size={14} />
              The internet should feel alive again.
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-tight sm:text-6xl lg:text-7xl">
              Live systems for businesses, communities, and real life.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              HomePlanet replaces dead websites, scattered links, bloated software, and surveillance-based platforms with simple live systems people can actually use.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#systems" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black shadow-xl shadow-emerald-500/20">
                Explore Systems <ArrowRight size={18} />
              </a>
              <Link to="/city" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.05] px-6 py-4 text-sm font-black text-white">
                Enter the Cities
              </Link>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-white/65 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <CheckCircle2 className="mb-3 text-emerald-300" size={20} />
                No app needed
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <Lock className="mb-3 text-emerald-300" size={20} />
                No data harvesting
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <MousePointerClick className="mb-3 text-emerald-300" size={20} />
                One clear action
              </div>
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-black shadow-[0_0_90px_rgba(16,185,129,0.16)]">
            <img
              src="/images/homeplanet-hydra-hero.png"
              alt="HomePlanet live system interface"
              className="absolute inset-0 h-full w-full object-cover object-[70%_50%] opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
          </div>
        </div>
      </section>

      <section id="doctrine" className="relative z-10 mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-3 md:grid-cols-5">
          {doctrine.map(([title, text]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <CircleDot className="mb-4 text-emerald-300" size={18} />
              <h3 className="font-black">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="systems" className="relative z-10 mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">One platform. Different systems.</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Choose the system that matches the real-world job.</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {systems.map((item) => {
            return (
              <Link key={item.title} to={item.href} className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/[0.06]">
                <div className="mb-5 overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/58">{item.text}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-emerald-300">
                  Open system <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Truth Chain</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Cut the noise. Keep the truth.</h2>
              <p className="mt-5 text-lg leading-8 text-white/62">
                HomePlanet does not need endless content. It needs real events connected to real outcomes.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-5">
              {["Need", "Response", "Action", "Outcome", "Proof"].map((step, index) => (
                <div key={step} className="rounded-3xl border border-white/10 bg-black/35 p-4 text-center">
                  <p className="text-xs font-black text-emerald-300">0{index + 1}</p>
                  <p className="mt-2 font-black">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2.5rem] border border-emerald-300/20 bg-emerald-300/10 p-8 text-center sm:p-12">
          <Camera className="mx-auto mb-5 text-emerald-300" size={34} />
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Your website should not just sit there.</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-white/68">
            It should help people request service, make payments, follow progress, receive updates, and stay connected.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/planet/build-your-live-system" className="rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black">
              Build Your System
            </Link>
            <Link to="/city" className="rounded-2xl border border-white/12 bg-white/[0.06] px-6 py-4 text-sm font-black text-white">
              Explore HomePlanet
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}




