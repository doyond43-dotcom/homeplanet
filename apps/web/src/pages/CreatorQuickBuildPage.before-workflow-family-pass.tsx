import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const businessTypes = [
  {
    label: "Cleaning",
    slug: "cleaning",
    stages: ["New Request", "Quote Review", "Scheduled", "In Progress", "Photo Proof", "Payment Due", "Complete"],
  },
  {
    label: "Pressure Washing",
    slug: "pressure-washing",
    stages: ["New Request", "Photo Review", "Estimate Sent", "Scheduled", "In Progress", "Proof Uploaded", "Payment Due", "Complete"],
  },
  {
    label: "Painting",
    slug: "painting",
    stages: ["New Lead", "Estimate", "Approved", "Scheduled", "Prep Work", "Painting", "Final Walkthrough", "Payment Due", "Complete"],
  },
  {
    label: "Lawn / Outdoor",
    slug: "lawn-outdoor",
    stages: ["New Request", "Route Review", "Scheduled", "On Site", "Work Complete", "Payment Due", "Complete"],
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CreatorQuickBuildPage() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [selectedType, setSelectedType] = useState(businessTypes[0]);

  const boardSlug = useMemo(() => slugify(businessName || selectedType.label), [businessName, selectedType]);

  function buildBoard() {
    const slug = boardSlug || `homeplanet-board-${Date.now()}`;

    const payload = {
      boardSlug: slug,
      businessName: businessName || selectedType.label,
      createdAt: new Date().toISOString(),
      operationalSystem: {
        label: selectedType.label,
        liveBoard: true,
        staffBoard: true,
        lobbyBoard: true,
        requestFlow: true,
        photoProof: true,
        paymentQr: true,
        proofTimeline: true,
        stages: selectedType.stages.map((stage) => ({
          id: slugify(stage),
          label: stage,
          description: `HomePlanet predicted this step for ${selectedType.label}.`,
        })),
      },
    };

    window.localStorage.setItem(`hp-system:${slug}`, JSON.stringify(payload));
    navigate(`/planet/live/${slug}`);
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_80px_rgba(16,185,129,0.08)]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
            <Sparkles size={14} />
            Quick Build
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            Build your live business system in seconds.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
            Pick your business type. HomePlanet predicts the workflow, customer intake, proof flow, and live board structure.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_.85fr]">
          <section className="rounded-[2rem] border border-emerald-300/10 bg-emerald-300/[0.04] p-6">
            <label className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
              Business name
            </label>
            <input
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Example: Kevin's Painting Service"
              className="mt-3 h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-lg font-bold text-white outline-none"
            />

            <div className="mt-6">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                Pick your business type
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {businessTypes.map((type) => {
                  const active = selectedType.slug === type.slug;

                  return (
                    <button
                      key={type.slug}
                      onClick={() => setSelectedType(type)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-emerald-300/50 bg-emerald-300/15"
                          : "border-white/10 bg-white/[0.04] hover:border-emerald-300/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-lg font-black">{type.label}</div>
                        {active ? <CheckCircle2 className="text-emerald-300" size={20} /> : null}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/55">
                        Creates a live workflow with {type.stages.length} predicted stages.
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={buildBoard}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-5 text-sm font-black text-neutral-950 shadow-xl shadow-emerald-500/20"
            >
              Build My Live Board
              <ArrowRight size={18} />
            </button>
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              Predicted system
            </div>

            <h2 className="mt-3 text-3xl font-black">
              {businessName || selectedType.label}
            </h2>

            <div className="mt-2 break-all text-sm font-bold text-white/45">
              /planet/live/{boardSlug || selectedType.slug}
            </div>

            <div className="mt-6 grid gap-3">
              {selectedType.stages.map((stage, index) => (
                <div key={stage} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                    Step {index + 1}
                  </div>
                  <div className="mt-1 text-lg font-black">{stage}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}