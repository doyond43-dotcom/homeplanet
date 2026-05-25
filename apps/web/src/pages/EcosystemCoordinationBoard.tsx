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
} from "lucide-react";

const ecosystemCards = [
  {
    title: "Ecosystem Overview",
    description: "Circulation-first ecosystem architecture and infrastructure.",
    href: "/planet/circulation",
    icon: Network,
  },
  {
    title: "GreenBasket",
    description: "Shared infrastructure layer across GreenBasket, warehouse, coffee, WingIt, delivery, and residents.",
    href: "/planet/ecosystem/infrastructure",
    icon: ShoppingBasket,
  },
  {
    title: "Participation Living",
    description: "Workforce participation infrastructure and circulation living.",
    href: "/planet/participation-living",
    icon: Building2,
  },
  {
    title: "Operations Hub",
    description: "Operational coordination, logistics, and ecosystem flow.",
    href: "/planet/hub",
    icon: Truck,
  },
];

const documents = [
  {
    title: "Ecosystem Infrastructure Overview",
    href: "/planet/ecosystem-infrastructure",
  },
  {
    title: "GreenBasket Brand Direction",
    href: "/planet/greenbasket",
  },
  {
    title: "Participation Living Architecture",
    href: "/planet/ecosystem",
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
];

export default function EcosystemCoordinationBoard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              Ecosystem Coordination
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Connected Ecosystem Infrastructure
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
            Centralized ecosystem coordination, circulation infrastructure,
            operational architecture, branding direction, and project alignment.
          </p>
        </div>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
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
                  className="group rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-emerald-400/40 hover:bg-zinc-900"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-xl bg-emerald-400/10 p-3">
                      <Icon className="h-5 w-5 text-emerald-400" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-zinc-500 transition group-hover:text-white" />
                  </div>

                  <h3 className="text-lg font-medium">{card.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {card.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="mb-6 flex items-center gap-3">
              <Palette className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-semibold">
                Branding & Visual Direction
              </h2>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                GreenBasket Brand Direction
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                Ecosystem Visual Language
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                Participation Living Concepts
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="mb-6 flex items-center gap-3">
              <FileText className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-semibold">Documents</h2>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <a
                  key={doc.title}
                  href={doc.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300 transition hover:border-emerald-400/40 hover:bg-zinc-900"
                >
                  {doc.title}
                </a>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center gap-3">
            <Users className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-semibold">Meeting Notes</h2>
          </div>

          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6 text-zinc-300"
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









