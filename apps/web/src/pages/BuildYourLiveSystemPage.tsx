import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ClipboardList,
  Globe2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { buildMySystemModules } from "../lib/homePlanetRegistry";

export default function BuildYourLiveSystemPage() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [reviewing, setReviewing] = useState(false);

  const [selectedModules, setSelectedModules] = useState<string[]>([
    "live-page",
    "requests",
    "customers",
  ]);

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "business-system";

  const toggleModule = (moduleId: string) => {
    setSelectedModules((current) =>
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId]
    );
  };

  const selectedModuleRecords = buildMySystemModules.filter((module) =>
    selectedModules.includes(module.id)
  );

  const groupedModules = selectedModuleRecords.reduce<
    Record<string, typeof selectedModuleRecords>
  >((groups, module) => {
    const category = module.category;

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(module);
    return groups;
  }, {});

  const categoryLabels: Record<string, string> = {
    "front-door": "Front Door",
    "customer-flow": "Customer Flow",
    operations: "Operations",
    money: "Money",
    communication: "Communication",
    proof: "Proof",
    intelligence: "Intelligence",
    physical: "Physical Connection",
    automation: "Automation",
  };

  const handleBuild = () => {
    const name = businessName.trim() || "Business System";
    const type = businessType.trim() || "Business";
    const slug = slugify(name);

    localStorage.setItem(
      `hp-system:${slug}`,
      JSON.stringify({
        businessName: name,
        businessType: type,
        pillar: "business",
        selectedModules,
      })
    );

    localStorage.removeItem(`hp-operational-board:${slug}:jobs`);
    navigate(`/planet/system/${slug}/building`);
  };

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
              <p className="text-[11px] text-white/50">Build My System</p>
            </div>
          </Link>

          <Link
            to="/planet/home"
            className="rounded-full bg-white px-4 py-2 text-xs font-black text-black"
          >
            Home
          </Link>
        </header>

        {!reviewing ? (
          <div className="py-14 sm:py-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-200">
              <Sparkles size={14} />
              Build My System
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-tight sm:text-6xl lg:text-7xl">
              Choose what your business needs.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/68">
              Start with your business, then pick the pieces you want HomePlanet
              to connect around the work you already do.
            </p>

            <div className="mt-10 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
              <div className="space-y-5">
                <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <Building2 className="text-emerald-300" size={24} />
                    <h2 className="text-2xl font-black">Start Here</h2>
                  </div>

                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/45">
                    Business Name
                  </label>

                  <input
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none focus:border-emerald-300/50"
                    placeholder="Example: ABC Pressure Cleaning"
                  />

                  <label className="mt-5 block text-xs font-black uppercase tracking-[0.2em] text-white/45">
                    What do you do?
                  </label>

                  <input
                    value={businessType}
                    onChange={(event) => setBusinessType(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-white outline-none focus:border-emerald-300/50"
                    placeholder="Pressure washing, HVAC, painting, landscaping..."
                  />
                </section>

                <section className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/[0.055] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                        Your System
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        {selectedModules.length} piece
                        {selectedModules.length === 1 ? "" : "s"} selected
                      </h2>
                    </div>

                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-300 text-black">
                      <Check size={20} strokeWidth={3} />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedModuleRecords.length > 0 ? (
                      selectedModuleRecords.map((module) => (
                        <span
                          key={module.id}
                          className="rounded-full border border-emerald-300/20 bg-black/25 px-3 py-2 text-xs font-black text-emerald-100"
                        >
                          {module.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-white/45">
                        Pick at least one system piece to continue.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setReviewing(true)}
                    disabled={selectedModules.length === 0}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Review My System
                    <ArrowRight size={18} />
                  </button>

                  <p className="mt-4 text-sm leading-6 text-white/45">
                    Nothing is locked yet. Review everything before HomePlanet
                    creates the starting system.
                  </p>
                </section>
              </div>

              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <div className="mb-2 flex items-center gap-3">
                  <ClipboardList className="text-emerald-300" size={24} />
                  <h2 className="text-2xl font-black">Pick Your Pieces</h2>
                </div>

                <p className="mb-6 text-sm leading-6 text-white/50">
                  Tap the pieces you want included. You do not have to choose
                  everything.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {buildMySystemModules.map((item) => {
                    const selected = selectedModules.includes(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleModule(item.id)}
                        aria-pressed={selected}
                        className={`group rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-emerald-300/50 bg-emerald-300/[0.08] shadow-lg shadow-emerald-950/20"
                            : "border-white/10 bg-black/30 hover:border-white/20 hover:bg-white/[0.045]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition ${
                                selected
                                  ? "border-emerald-300 bg-emerald-300 text-black"
                                  : "border-white/15 bg-white/[0.03] text-transparent"
                              }`}
                            >
                              <Check size={14} strokeWidth={3} />
                            </div>

                            <h3 className="font-black text-white">
                              {item.name}
                            </h3>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${
                              item.status === "live"
                                ? "bg-emerald-300/10 text-emerald-300"
                                : item.status === "testing"
                                  ? "bg-yellow-300/10 text-yellow-200"
                                  : "bg-white/10 text-white/40"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-white/50">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="py-14 sm:py-16">
            <button
              type="button"
              onClick={() => setReviewing(false)}
              className="flex w-fit items-center gap-2 text-sm font-black text-white/55 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to My System
            </button>

            <div className="mt-8 flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-200">
              <Check size={14} />
              System Review
            </div>

            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.94] tracking-tight sm:text-6xl lg:text-7xl">
              This is your system.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
              Take one last look at the business and the pieces you chose.
              Nothing gets changed until you build it.
            </p>

            <div className="mt-10 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
              <div className="space-y-5">
                <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                    Business
                  </p>

                  <h2 className="mt-3 text-3xl font-black">
                    {businessName.trim() || "Business System"}
                  </h2>

                  <p className="mt-2 text-base text-white/55">
                    {businessType.trim() || "Business"}
                  </p>
                </section>

                <section className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/[0.055] p-6">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                    Ready To Build
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    {selectedModules.length} connected piece
                    {selectedModules.length === 1 ? "" : "s"}
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-white/50">
                    HomePlanet will save this starting structure and open the
                    system workspace.
                  </p>

                  <button
                    type="button"
                    onClick={handleBuild}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-4 text-sm font-black text-black shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-300"
                  >
                    Build This System
                    <ArrowRight size={18} />
                  </button>
                </section>
              </div>

              <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                      Selected Pieces
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Your HomePlanet System
                    </h2>
                  </div>

                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-300 text-black">
                    <Check size={20} strokeWidth={3} />
                  </div>
                </div>

                <div className="mt-7 space-y-6">
                  {Object.entries(groupedModules).map(([category, modules]) => (
                    <div key={category}>
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                        {categoryLabels[category] || category}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {modules.map((module) => (
                          <div
                            key={module.id}
                            className="rounded-2xl border border-white/10 bg-black/30 p-4"
                          >
                            <div className="flex items-center gap-2">
                              <div className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-300 text-black">
                                <Check size={14} strokeWidth={3} />
                              </div>

                              <h3 className="font-black">
                                {module.name}
                              </h3>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-white/45">
                              {module.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}