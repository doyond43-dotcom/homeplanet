import { useState } from "react";
import { Link } from "react-router-dom";

const groups = [
  {
    title: "Distribution Systems",
    icon: "💧",
    items: ["Reservoir", "Ground Storage Tank", "Elevated Tank", "Wet Well"],
  },
  {
    title: "Treatment Plants",
    icon: "🏭",
    items: ["Clearwell", "Contact Chamber", "Backwash Tank", "Filtration System"],
  },
  {
    title: "Source Water",
    icon: "🌊",
    items: ["Lake", "Stream", "Dam", "Pond", "Screenhouse"],
  },
];

function assetHref(asset: string) {
  return `/planet/hydra/intake?asset=${encodeURIComponent(asset)}`;
}

function reportHref(asset: string) {
  return `/planet/hydra/report?asset=${encodeURIComponent(asset)}`;
}

function dashboardHref(asset: string) {
  return `/planet/hydra/dashboard?asset=${encodeURIComponent(asset)}`;
}

export default function HydraAssetSelectorPage() {
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const [selectedAsset, setSelectedAsset] = useState(groups[0].items[0]);

  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/planet/hydra"
          className="text-sm font-black text-cyan-300"
        >
          ← Hydra Operations
        </Link>

        <h1 className="mt-6 text-5xl font-black">
          Create Inspection Project
        </h1>

        <p className="mt-3 max-w-2xl text-slate-300">
          Select the asset and continue through inspection, photos,
          findings, recommendations, and reporting.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {groups.map((group) => (
            <button
              key={group.title}
              onClick={() => {
                setSelectedGroup(group);
                setSelectedAsset(group.items[0]);
              }}
              className={`rounded-full px-5 py-3 font-black transition ${
                selectedGroup.title === group.title
                  ? "bg-cyan-300 text-slate-950"
                  : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {group.icon} {group.title}
            </button>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-black text-cyan-200">
            {selectedGroup.title}
          </h2>

          <div className="mt-4 space-y-1">
            {selectedGroup.items.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedAsset(item)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-4 text-left font-black transition ${
                  selectedAsset === item
                    ? "bg-cyan-300/15 text-cyan-100"
                    : "text-white hover:bg-white/5"
                }`}
              >
                <span>{item}</span>

                <span
                  className={
                    selectedAsset === item
                      ? "text-cyan-300"
                      : "text-slate-500"
                  }
                >
                  →
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black">
                {selectedAsset}
              </h2>

              <p className="mt-1 text-slate-400">
                {selectedGroup.title}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={assetHref(selectedAsset)}
                className="rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950"
              >
                Start Inspection
              </Link>

              <Link
                to={reportHref(selectedAsset)}
                className="rounded-full bg-white/10 px-6 py-3 font-black text-cyan-200 transition hover:bg-white/15"
              >
                View Report
              </Link>

              <Link
                to={dashboardHref(selectedAsset)}
                className="rounded-full bg-white/10 px-6 py-3 font-black text-white transition hover:bg-white/15"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

