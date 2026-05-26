import { Link } from "react-router-dom";
import {
  Building2,
  ShoppingBasket,
  Network,
  Truck,
  FileText,
  Palette,
  Users,
  ArrowRight,
  Activity,
} from "lucide-react";

const ecosystemCards = [
  {
    title: "Ecosystem Overview",
    description:
      "Circulation-first ecosystem architecture and infrastructure.",
    href: "/planet/circulation",
    icon: Network,
    tone: "from-emerald-500/10 to-sky-500/5",
  },
  {
    title: "GreenBasket",
    description:
      "Shared infrastructure layer across GreenBasket, warehouse, commons, WingIt, delivery, and residents.",
    href: "/planet/ecosystem-infrastructure",
    icon: ShoppingBasket,
    tone: "from-lime-500/10 to-emerald-500/5",
  },
  {
    title: "Participation Living",
    description:
      "Workforce participation infrastructure and circulation living.",
    href: "/planet/participation-living",
    icon: Building2,
    tone: "from-fuchsia-500/10 to-purple-500/5",
  },
  {
    title: "Operations Hub",
    description:
      "Operational coordination, logistics, predictive movement, and ecosystem flow.",
    href: "/planet/hub",
    icon: Truck,
    tone: "from-cyan-500/10 to-emerald-500/5",
  },
];

const documents = [
  {
    title: "Ecosystem Infrastructure Overview",
    href: "/planet/ecosystem-infrastructure",
  },
  {
    title: "Hub Identity System",
    href: "/planet/hub-identity",
  },
  {
    title: "Predictive Parking Intelligence",
    href: "/planet/predictive-parking-intelligence",
  },
  {
    title: "GreenBasket Identity System",
    href: "/planet/greenbasket-brand-palette",
  },
  {
    title: "WingIt Restaurant Intelligence",
    href: "/planet/restaurant-awareness-intelligence",
  },
  {
    title: "Live Circulation Heartbeat",
    href: "/planet/live-circulation-heartbeat",
  },
  {
    title: "Participation Living Architecture",
    href: "/planet/participation-living",
  },
  {
    title: "Transportation & Circulation Systems",
    href: "/planet/circulation",
  },
];

const notes = [
  "Focus Friday presentation on circulation and operational harmony.",
  "Keep systems simple and visually understandable.",
  "Do not overbuild operational business details yet.",
  "GreenBasket community-responsive inventory is a major differentiator.",
  "Live operational intelligence is now the ecosystem foundation.",
  "Predictive parking and restaurant arrival awareness belong inside the Hub and circulation layer.",
];

export default function EcosystemCoordinationBoard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute left-[8%] top-[10%] h-[320px] w-[320px] rounded-full bg-emerald-500 blur-[140px]" />
        <div className="absolute right-[10%] top-[22%] h-[300px] w-[300px] rounded-full bg-orange-500 blur-[140px]" />
        <div className="absolute bottom-[10%] left-[30%] h-[360px] w-[360px] rounded-full bg-sky-500 blur-[160px]" />
      </div>

      <div className="absolute inset-0 opacity-[0.05]">
        <svg className="h-full w-full" viewBox="0 0 1600 1200" fill="none">
          <path
            d="M120 260 C 420 320, 640 420, 860 520"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10 14"
          />
          <path
            d="M860 520 C 1080 430, 1280 340, 1480 220"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10 14"
          />
          <path
            d="M860 520 C 1120 620, 1300 760, 1480 940"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10 14"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/88 p-6 backdrop-blur-sm md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_38%)]" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.75)]" />
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                Ecosystem Coordination
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Connected Ecosystem Infrastructure
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
              Centralized ecosystem coordination, circulation infrastructure,
              operational architecture, live movement systems, branding
              direction, predictive parking intelligence, and project alignment.
            </p>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/88 p-6 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.08),transparent_42%)]" />

          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-3">
              <Network className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-semibold">Live Ecosystem</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {ecosystemCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Link
                    key={card.title}
                    to={card.href}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black/55 p-5 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-zinc-900/95`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${card.tone} opacity-80 transition group-hover:opacity-100`}
                    />

                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-xl bg-emerald-400/10 p-3 ring-1 ring-emerald-400/10">
                          <Icon className="h-5 w-5 text-emerald-400" />
                        </div>

                        <ArrowRight className="h-4 w-4 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-white" />
                      </div>

                      <h3 className="text-lg font-medium">{card.title}</h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {card.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-zinc-950/88 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <Palette className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-semibold">
                Branding & Visual Direction
              </h2>
            </div>

            <div className="grid gap-3">
              <Link
                to="/planet/greenbasket-brand-palette"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-emerald-400/35 bg-emerald-950/25 p-4 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/70 hover:bg-emerald-900/35"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
                    GreenBasket
                  </p>

                  <h3 className="mt-2 text-base font-semibold text-white">
                    Identity System
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-300">
                    Fresh market infrastructure, commons participation,
                    warehouse coordination, and circulation identity.
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-emerald-300 transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/planet/restaurant-awareness-intelligence"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-orange-400/35 bg-orange-950/25 p-4 transition duration-300 hover:-translate-y-1 hover:border-orange-300/70 hover:bg-orange-900/35"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
                    WingIt
                  </p>

                  <h3 className="mt-2 text-base font-semibold text-white">
                    Restaurant Intelligence
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-300">
                    Food hall energy, pickup rhythm, arrival awareness, social
                    circulation, and operational restaurant infrastructure.
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-orange-300 transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/planet/predictive-parking-intelligence"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-cyan-400/35 bg-cyan-950/25 p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/70 hover:bg-cyan-900/35"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
                    Arrival Awareness
                  </p>

                  <h3 className="mt-2 text-base font-semibold text-white">
                    Predictive Parking Intelligence
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-300">
                    Parking pressure, sign overload reduction, best likely
                    spaces, arrival guidance, and Hub-connected movement.
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-cyan-300 transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/planet/live-circulation-heartbeat"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-sky-400/35 bg-sky-950/25 p-4 transition duration-300 hover:-translate-y-1 hover:border-sky-300/70 hover:bg-sky-900/35"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-300">
                    Live Operations
                  </p>

                  <h3 className="mt-2 text-base font-semibold text-white">
                    Circulation Heartbeat
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-zinc-300">
                    Live movement pressure, parking awareness, circulation
                    rhythm, and ecosystem heartbeat intelligence.
                  </p>
                </div>

                <Activity className="h-4 w-4 shrink-0 text-sky-300 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-zinc-950/88 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3">
              <FileText className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-semibold">Documents</h2>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <Link
                  key={doc.title}
                  to={doc.href}
                  className="block rounded-2xl border border-white/10 bg-black/55 p-4 text-sm text-zinc-300 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-zinc-900/95"
                >
                  {doc.title}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-white/10 bg-zinc-950/88 p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <Users className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-semibold">Meeting Notes</h2>
          </div>

          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-white/10 bg-black/55 p-4 text-sm leading-6 text-zinc-300"
              >
                {note}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
















