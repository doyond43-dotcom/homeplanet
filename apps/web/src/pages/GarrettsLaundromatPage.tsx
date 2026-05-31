import { useNavigate } from "react-router-dom";

export default function GarrettsLaundromatPage() {
  const navigate = useNavigate();

  const items = [
    "Laundry Infrastructure",
    "Pickup & Delivery",
    "Restaurant Linen Support",
    "Workforce Services",
    "Community Convenience",
    "Daily Operations",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 md:px-6">
        <button
          onClick={() => navigate("/planet/atlas")}
          className="mb-6 text-left text-sm text-zinc-400 transition hover:text-white"
        >
          ← Back to Atlas
        </button>

        <div className="flex-1 rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-cyan-400">
            Service Infrastructure Anchor
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Garrett&apos;s Laundromat
          </h1>

          <p className="mt-4 max-w-4xl text-lg text-zinc-400">
            More than a laundromat. A service infrastructure anchor supporting
            residents, workforce housing, restaurants, linens, towels, pickup
            routes, and daily ecosystem operations.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-black/40 p-6"
              >
                <div className="text-lg font-medium text-white">{item}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/planet/garretts-laundromat-visual")}
            className="mt-10 rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
          >
            View Concept Image
          </button>
<div className="mt-10 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
            <p className="text-xl leading-8 text-cyan-100">
              Quietly supporting the entire ecosystem behind the scenes, every
              single day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

