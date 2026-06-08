import { ArrowRight, CircleDot, Globe2, Lock, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

const doctrine = [
  {
    title: "No Surveillance",
    text: "HomePlanet is not built to watch people. It is built to help real-world work, support, and communication move clearly.",
  },
  {
    title: "No Data Harvesting",
    text: "No selling attention. No creepy lead traps. No turning local life into a data extraction machine.",
  },
  {
    title: "No Engagement Traps",
    text: "No infinite scroll. No fake urgency. No system designed to keep people stuck instead of helping them act.",
  },
  {
    title: "Truth Chain",
    text: "Need to response to action to outcome to proof. HomePlanet is built around real events and visible follow-through.",
  },
  {
    title: "Community First",
    text: "Built for people, businesses, families, restaurants, workers, helpers, and local communities.",
  },
];

export default function HomePlanetDoctrinePage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <section className="mx-auto max-w-6xl px-5 py-6">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-xl">
          <Link to="/planet/home" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400 text-black">
              <Globe2 size={21} />
            </div>
            <div>
              <p className="text-sm font-black tracking-wide">HomePlanet</p>
              <p className="text-[11px] text-white/50">Doctrine</p>
            </div>
          </Link>

          <Link to="/planet/systems" className="rounded-full bg-white px-4 py-2 text-xs font-black text-black">
            Systems
          </Link>
        </header>

        <div className="py-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-200">
            <ShieldCheck size={14} />
            Built with boundaries.
          </div>

          <h1 className="max-w-5xl text-5xl font-black leading-[0.94] tracking-tight sm:text-6xl lg:text-7xl">
            Cut the noise. Keep the truth.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">
            HomePlanet is not another platform trying to harvest attention. It is a live system layer for real needs,
            real actions, real outcomes, and real communities.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {doctrine.map((item) => (
              <div key={item.title} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <CircleDot className="text-emerald-300" size={22} />
                <h2 className="mt-5 text-2xl font-black">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[2.5rem] border border-emerald-300/20 bg-emerald-300/10 p-8 text-center">
            <Lock className="mx-auto mb-5 text-emerald-300" size={30} />
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              The system should serve the people using it.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-white/68">
              That is the line HomePlanet is built on.
            </p>
            <Link to="/planet/systems" className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black">
              Explore Systems <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
