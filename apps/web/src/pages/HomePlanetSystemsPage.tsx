import { ArrowRight, Building2, Globe2, Layers3, Network, Store, Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const systems = [
  {
    icon: Building2,
    title: "Business Systems",
    text: "Live operational flows for service businesses, crews, jobs, customers, proof, and payments.",
    href: "/planet/business-systems",
  },
  {
    icon: Utensils,
    title: "Restaurant Intelligence",
    text: "Table requests, staff awareness, kitchen flow, and owner visibility connected in real time.",
    href: "/planet/restaurant-intelligence",
  },
  {
    icon: Network,
    title: "Community Network",
    text: "Local needs, offers, volunteers, events, outcomes, and truth chains connected to real life.",
    href: "/planet/community-network",
  },
  {
    icon: Store,
    title: "HomePlanet Pages",
    text: "Premium local presence pages that help people understand who you are and what to do next.",
    href: "/planet/homeplanet-pages",
  },
];

export default function HomePlanetSystemsPage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <section className="mx-auto max-w-7xl px-5 py-6">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.035] px-4 py-3 backdrop-blur-xl">
          <Link to="/planet/home" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-400 text-black">
              <Globe2 size={21} />
            </div>
            <div>
              <p className="text-sm font-black tracking-wide">HomePlanet</p>
              <p className="text-[11px] text-white/50">Systems</p>
            </div>
          </Link>

          <Link to="/planet/doctrine" className="rounded-full bg-white px-4 py-2 text-xs font-black text-black">
            Doctrine
          </Link>
        </header>

        <div className="py-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-200">
            <Layers3 size={14} />
            Four pillars. One ecosystem.
          </div>

          <h1 className="max-w-5xl text-5xl font-black leading-[0.94] tracking-tight sm:text-6xl lg:text-7xl">
            Choose the world you want to bring to life.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">
            HomePlanet is built around real-world systems: businesses, restaurants, communities, and local presence.
            Each system starts with understanding, then moves into activation.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {systems.map((system) => {
              const Icon = system.icon;
              return (
                <Link
                  key={system.title}
                  to={system.href}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/[0.06]"
                >
                  <Icon className="text-emerald-300" size={28} />
                  <h2 className="mt-6 text-xl font-black">{system.title}</h2>
                  <p className="mt-3 min-h-[120px] text-sm leading-6 text-white/58">{system.text}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-emerald-300">
                    Open system <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
