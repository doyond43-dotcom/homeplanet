import { Link } from "react-router-dom";

type Status =
  | "Live"
  | "Structured"
  | "Concept Locked"
  | "Prototype"
  | "Pending Doctrine"
  | "Experimental";

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    Live: "bg-emerald-500/15 border-emerald-400 text-emerald-300",
    Structured: "bg-yellow-500/15 border-yellow-400 text-yellow-300",
    "Concept Locked": "bg-sky-500/15 border-sky-400 text-sky-300",
    Prototype: "bg-purple-500/15 border-purple-400 text-purple-300",
    "Pending Doctrine": "bg-orange-500/15 border-orange-400 text-orange-300",
    Experimental: "bg-red-500/15 border-red-400 text-red-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${map[status]}`}
    >
      {status}
    </span>
  );
}

function PlanetCard({
  name,
  mission,
  status,
}: {
  name: string;
  mission: string;
  status: Status;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">{name}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="mt-3 text-sm text-slate-400">{mission}</p>
    </div>
  );
}

export default function PlanetsRegistry() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            HomePlanet System Registry
          </h1>
          <p className="mt-3 text-slate-400 max-w-2xl">
            Structured planetary architecture. Core engines, live cities,
            and locked category systems.
          </p>
        </div>

        {/* Core Planets */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Core Planets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <PlanetCard
              name="Invention Planet"
              mission="Capture origin, preserve structure, prepare for licensing."
              status="Structured"
            />
            
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">
                  MLS — Parenting Signal Infrastructure
                </h3>
                <StatusBadge status="Structured" />
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Origin Concept: Chelsea Rule • Captured: October 2025 (approx.)
              </p>
              <Link
                to="/mls"
                className="inline-block mt-4 text-sm text-sky-400 hover:underline"
              >
                View Concept →
              </Link>
            </div><PlanetCard
              name="Civic / Proof Infrastructure"
              mission="Convert real-world submissions into timestamped, dispute-resistant records."
              status="Live"
            />
            <PlanetCard
              name="Physical Goods Provenance"
              mission="Track physical products from retail to regulator."
              status="Concept Locked"
            />
            <PlanetCard
              name="Workforce Presence Theater"
              mission="Live operational visibility for workplaces."
              status="Concept Locked"
            />
            <PlanetCard
              name="Education Planet"
              mission="Presence-first classrooms and verifiable submissions."
              status="Concept Locked"
            />
            <PlanetCard
              name="Safety / PredatorShield"
              mission="Structured protection and evidence preservation."
              status="Pending Doctrine"
            />
          </div>
        </section>

        {/* Active Cities */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Active City Nodes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Taylor Creek Auto Repair
                </h3>
                <StatusBadge status="Live" />
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Gold Tier Local Service Provenance pilot node.
              </p>
              <Link
                to="/taylor-creek"
                className="inline-block mt-4 text-sm text-sky-400 hover:underline"
              >
                View City →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

