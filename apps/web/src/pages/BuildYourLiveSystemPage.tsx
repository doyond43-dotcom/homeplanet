// HOMEPLANET_RECOMMENDATIONS_ALWAYS_VISIBLE_V1
﻿// HOMEPLANET_RECOMMENDATION_COLOR_V1
// BUILD_A_BEAR_SELECTION_FIX_V1
// BUILD_A_BEAR_RECOMMENDATIONS_V1
// BUILD_A_BEAR_FLOW_V2
// HOMEPLANET_LIGHT_COLOR_CLEANUP_V1
// LIGHT_BUILD_A_BEAR_V1
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
  const [businessCategory, setBusinessCategory] = useState("");
  const [showAllModules, setShowAllModules] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const [selectedModules, setSelectedModules] = useState<string[]>([]);

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

  const recommendedModuleIds: Record<string, string[]> = {
    "Home Services": ["estimates", "scheduling", "photos-files"],
    "Restaurant / Food": ["orders", "payments", "scheduling"],
    "Retail / Store": ["orders", "inventory", "payments"],
    "Farm / Agriculture": ["orders", "inventory", "delivery"],
    "Professional Services": ["scheduling", "forms", "messages"],
    "Something Else": ["forms", "scheduling", "payments"],
  };

  const recommendedModules = buildMySystemModules.filter((module) =>
    (recommendedModuleIds[businessCategory] ?? []).includes(module.id)
  );

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
        businessCategory,
        pillar: "business",
        workspaceVersion: "build-a-bear-v1",
        selectedModules,
      })
    );

    navigate(`/planet/system/${slug}/building`);
  };

  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#193C2B]">
      <section className="mx-auto max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between rounded-3xl border border-[#DCE5DA] bg-white px-6 py-4 shadow-sm">
          <Link to="/planet/home" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#193C2B] text-white">
              <Globe2 size={21} />
            </div>

            <div>
              <p className="text-sm font-black tracking-wide">HomePlanet</p>
              <p className="text-[11px] text-[#64776B]">Build My System</p>
            </div>
          </Link>

          <Link
            to="/planet/home"
            className="rounded-full bg-[#193C2B] px-6 py-3 text-base font-bold text-white"
          >
            Home
          </Link>
        </header>

        {!reviewing ? (
          <div className="py-10 sm:py-14">
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Let's build your HomePlanet.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#526658]">
              Tell us what kind of business you have. HomePlanet will recommend
              a simple starting system, and you can customize it anytime.
            </p>

            <div className="mt-10 grid gap-5 grid-cols-1">
              <div className="space-y-5">
                <section className="rounded-[2rem] border border-[#DCE5DA] bg-white p-6 shadow-sm sm:p-9">
                  <div className="mb-5 flex items-center gap-3">
                    <Building2 className="text-[#267344]" size={24} />
                    <h2 className="text-2xl font-black">Your Business</h2>
                  </div>

                  <p className="mb-3 text-sm font-bold text-[#526658]">
                    What kind of business do you have?
                  </p>

                  <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      "Home Services",
                      "Restaurant / Food",
                      "Retail / Store",
                      "Farm / Agriculture",
                      "Professional Services",
                      "Something Else",
                    ].map((category) => (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={businessCategory === category}
                        onClick={() => {
                          setBusinessCategory(category);
                          setSelectedModules(["live-page", "requests", "customers"]);
                        }}
                        className={`min-h-[88px] rounded-2xl border px-5 py-5 text-left text-lg font-bold transition ${
                          businessCategory === category
                            ? "border-[#193C2B] bg-[#E4F0E6] text-[#193C2B] shadow-sm"
                            : "border-[#DCE5DA] bg-white text-[#193C2B] hover:border-[#6C9678] hover:bg-[#F4FAF5]"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <label className="block text-sm font-bold text-[#526658]">
                    Business Name
                  </label>

                  <input
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#CDDBCF] bg-white px-5 py-5 text-lg text-[#193C2B] outline-none focus:border-[#193C2B]"
                    placeholder="Example: ABC Pressure Cleaning"
                  />

                  <label className="mt-5 block text-sm font-bold text-[#526658]">
                    What do you do?
                  </label>

                  <input
                    value={businessType}
                    onChange={(event) => setBusinessType(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#CDDBCF] bg-white px-5 py-5 text-lg text-[#193C2B] outline-none focus:border-[#193C2B]"
                    placeholder="Pressure washing, HVAC, painting, landscaping..."
                  />
                </section>

                <section className="rounded-[2rem] border border-[#C9DDCE] bg-[#EFF7EF] p-6 sm:p-9">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#267344]">
                        Your System
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        {businessCategory
                          ? `Recommended for ${businessCategory}`
                          : "Your starting system"}
                      </h2>
                      <p className="mt-2 text-sm text-[#526658]">
                        {businessCategory
                          ? `${selectedModules.length} starting tool${selectedModules.length === 1 ? "" : "s"} selected`
                          : "Choose your business type above to see where to start."}
                      </p>
                    </div>

                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#193C2B] text-white">
                      <Check size={20} strokeWidth={3} />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {businessCategory && selectedModuleRecords.length > 0 ? (
                      selectedModuleRecords.map((module) => (
                        <span
                          key={module.id}
                          className="rounded-full border border-[#BBDFCA] bg-white px-4 py-2 text-sm font-bold text-[#193C2B]"
                        >
                          {module.name}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-[#64776B]">
                        {businessCategory
                          ? "Select at least one tool to continue."
                          : "Your recommended tools will appear here after you choose a business."}
                      </p>
                    )}
                  </div>

                </section>
              </div>

              <section className="rounded-[2rem] border border-[#DCE5DA] bg-white p-6 shadow-sm sm:p-9">
                <div className="mb-2 flex items-center gap-3">
                  <ClipboardList className="text-[#267344]" size={24} />
                  <h2 className="text-2xl font-black">Make It Yours</h2>
                </div>

                <p className="mb-6 text-sm leading-6 text-[#64776B]">
                  Tap the pieces you want included. You do not have to choose
                  everything.
                </p>

                <button
                  type="button"
                  onClick={() => setShowAllModules((current) => !current)}
                  className="mb-5 w-full rounded-xl border border-[#B7DCC5] bg-[#E8F5EB] px-4 py-3 text-left text-sm font-black text-[#193C2B]"
                >
                  {showAllModules ? "Hide Extra Tools" : "Customize My System +"}
                </button>

                  <div className="rounded-2xl border border-[#DCE5DA] bg-white p-5">
                    <p className="text-lg font-black">
                      {businessCategory
                        ? `Recommended for ${businessCategory}`
                        : "Choose your business type to see recommendations"}
                    </p>

                    {businessCategory ? (
                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {recommendedModules.map((module) => (
                          <div
                            key={module.id}
                            className="rounded-2xl border border-[#DCE5DA] bg-white p-4"
                          >
                            <p className="font-black">{module.name}</p>
                            <p className="mt-2 text-sm leading-6 text-[#64776B]">
                              {module.description}
                            </p>
                            <p className="mt-3 text-xs font-bold text-[#267344]">
                              {selectedModules.includes(module.id)
                                ? "Selected for later setup"
                                : "Optional addition - setup required"}
                            </p>
                            {!selectedModules.includes(module.id) ? (
                              <button
                                type="button"
                                onClick={() => toggleModule(module.id)}
                                className="mt-3 rounded-xl border border-[#B7DCC5] bg-[#E8F5EB] px-4 py-2 text-sm font-bold text-[#193C2B]"
                              >
                                Add to My Plan
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => toggleModule(module.id)}
                                className="mt-3 rounded-xl border border-[#DCE5DA] bg-white px-4 py-2 text-sm font-bold text-[#526658]"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-[#64776B]">
                        Select a business category above and HomePlanet will
                        suggest additional tools that may help your business.
                      </p>
                    )}
                  </div>
                {showAllModules && (
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
                            ? "border-[#34D399] bg-[#ECFDF5] shadow-sm"
                            : "border-[#DCE5DA] bg-white hover:border-[#34D399] hover:bg-[#F4FBF6]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition ${
                                selected
                                  ? "border-emerald-300 bg-[#193C2B] text-white"
                                  : "border-[#BACBC0] bg-white text-transparent"
                              }`}
                            >
                              <Check size={14} strokeWidth={3} />
                            </div>

                            <h3 className="font-black text-[#193C2B]">
                              {item.name}
                            </h3>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${
                              item.status === "live"
                                ? "bg-[#193C2B]/10 text-[#267344]"
                                : item.status === "testing"
                                  ? "bg-yellow-300/10 text-yellow-200"
                                  : "bg-white/10 text-[#64776B]"
                            }`}
                          >
                            {item.status === "live" ? "Setup Required" : item.status === "testing" ? "In Development" : "Availability Pending"}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-[#64776B]">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
                )}
              </section>
              <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewing(true)}
                    disabled={!businessCategory || selectedModules.length === 0}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#193C2B] px-6 py-5 text-lg font-bold text-white shadow-xl shadow-emerald-500/20 transition hover:bg-[#193C2B] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Review My System
                    <ArrowRight size={18} />
                  </button>

                  <p className="mt-4 text-sm leading-6 text-[#64776B]">
                    Nothing is locked yet. Review everything before HomePlanet
                    creates the starting system.
                  </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 sm:py-14">
            <button
              type="button"
              onClick={() => setReviewing(false)}
              className="flex w-fit items-center gap-2 text-sm font-black text-[#64776B] transition hover:text-[#193C2B]"
            >
              <ArrowLeft size={16} />
              Back to My System
            </button>

            <div className="mt-8 flex w-fit items-center gap-2 rounded-full border border-[#B7DCC5] bg-[#E8F5EB] px-3 py-2 text-xs font-black text-[#193C2B]">
              <Check size={14} />
              System Review
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              This is your system.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#526658]">
              Take one last look at the business and the pieces you chose.
              Nothing gets changed until you build it.
            </p>

            <div className="mt-10 grid gap-5 grid-cols-1">
              <div className="space-y-5">
                <section className="rounded-[2rem] border border-[#DCE5DA] bg-white p-6 shadow-sm sm:p-9">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#64776B]">
                    Business
                  </p>

                  <h2 className="mt-3 text-3xl font-black">
                    {businessName.trim() || "Business System"}
                  </h2>

                  <p className="mt-2 text-base text-[#64776B]">
                    {businessType.trim() || "Business"}
                  </p>
                </section>

                
              </div>

              <section className="rounded-[2rem] border border-[#DCE5DA] bg-white p-6 shadow-sm sm:p-9">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#64776B]">
                      Selected Pieces
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Your HomePlanet System
                    </h2>
                  </div>

                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#193C2B] text-white">
                    <Check size={20} strokeWidth={3} />
                  </div>
                </div>

                <div className="mt-7 space-y-6">
                  {Object.entries(groupedModules).map(([category, modules]) => (
                    <div key={category}>
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#267344]">
                        {categoryLabels[category] || category}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {modules.map((module) => (
                          <div
                            key={module.id}
                            className="rounded-2xl border border-[#DCE5DA] bg-white p-5"
                          >
                            <div className="flex items-center gap-2">
                              <div className="grid h-6 w-6 place-items-center rounded-lg bg-[#193C2B] text-white">
                                <Check size={14} strokeWidth={3} />
                              </div>

                              <h3 className="font-black">
                                {module.name}
                              </h3>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-[#64776B]">
                              {module.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-[#C9DDCE] bg-[#EFF7EF] p-6 sm:p-9">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#267344]">
                    Ready To Create
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    {selectedModules.length} tool{selectedModules.length === 1 ? "" : "s"} selected
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-[#64776B]">
                    HomePlanet will save this starting structure and open the
                    system workspace.
                  </p>

                  <button
                    type="button"
                    onClick={handleBuild}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#193C2B] px-6 py-5 text-lg font-bold text-white shadow-xl shadow-emerald-500/20 transition hover:bg-[#193C2B]"
                  >
                    Create My HomePlanet
                    <ArrowRight size={18} />
                  </button>
                </section>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
