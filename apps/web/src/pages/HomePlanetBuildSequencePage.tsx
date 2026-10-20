// HOMEPLANET_HONEST_SETUP_V1
import { ArrowRight, Check, CircleDot, Globe2 } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { buildMySystemModules } from "../lib/homePlanetRegistry";

type StoredSystem = {
  businessName?: string;
  businessType?: string;
  businessCategory?: string;
  selectedModules?: string[];
  livePageSlug?: string;
};

export default function HomePlanetBuildSequencePage() {
  const { slug = "" } = useParams();

  const storedSystem = useMemo<StoredSystem>(() => {
    try {
      const raw = localStorage.getItem(`hp-system:${slug}`);
      return raw ? (JSON.parse(raw) as StoredSystem) : {};
    } catch {
      return {};
    }
  }, [slug]);

  const businessName = storedSystem.businessName?.trim() || "Your HomePlanet";
  const businessType = storedSystem.businessType?.trim() || "";
  const selectedIds = storedSystem.selectedModules ?? [];
  const selectedModules = buildMySystemModules.filter((module) =>
    selectedIds.includes(module.id)
  );
  const hasPlan = Boolean(storedSystem.businessName?.trim());
  const hasLivePage = Boolean(storedSystem.livePageSlug?.trim());
  const extraModules = selectedModules.filter((module) => module.id !== "live-page");

  return (
    <main className="min-h-screen bg-[#F7F6F0] text-[#193C2B]">
      <section className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <header className="flex items-center justify-between rounded-3xl border border-[#DCE5DA] bg-white px-5 py-4 shadow-sm">
          <Link to="/planet/home" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#193C2B] text-white">
              <Globe2 size={22} />
            </span>
            <span>
              <span className="block text-lg font-black">HomePlanet</span>
              <span className="block text-sm text-[#64776B]">Build My HomePlanet</span>
            </span>
          </Link>
          <Link to="/planet/build-your-live-system" className="text-sm font-bold text-[#267344]">
            Back to Builder
          </Link>
        </header>

        {!hasPlan ? (
          <section className="mt-10 rounded-[2rem] border border-[#DCE5DA] bg-white p-8">
            <h1 className="text-3xl font-black">No starting plan found.</h1>
            <p className="mt-3 text-lg text-[#526658]">
              Start by choosing your business and the tools you need.
            </p>
            <Link to="/planet/build-your-live-system"
              className="mt-6 inline-flex rounded-2xl bg-[#193C2B] px-6 py-4 font-bold text-white">
              Start My HomePlanet
            </Link>
          </section>
        ) : (
          <>
            <div className="py-10 sm:py-14">
              <p className="text-sm font-bold text-[#267344]">MY HOMEPLANET</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Your starting plan is saved.
              </h1>
              <p className="mt-4 text-lg leading-8 text-[#526658]">
                {businessName}{businessType ? ` - ${businessType}` : ""}
              </p>
              <p className="mt-3 text-base leading-7 text-[#64776B]">
                Your selections are saved in this browser. Let's set up your Live Page
                and connect the tools your business needs.
              </p>
            </div>

            <section className="rounded-[2rem] border border-[#DCE5DA] bg-white p-6 shadow-sm sm:p-9">
              <h2 className="text-2xl font-black">Your next steps</h2>

              <div className="mt-6 space-y-4">
                <div className="flex gap-4 rounded-2xl border border-[#B7DCC5] bg-[#F0F8F0] p-5">
                  <Check className="mt-1 shrink-0 text-[#267344]" size={23} />
                  <div>
                    <h3 className="text-lg font-bold">Business plan saved</h3>
                    <p className="mt-1 text-base text-[#526658]">
                      Your business information and selected tools are saved locally.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#DCE5DA] bg-white p-5">
                  <div className="flex gap-4">
                    <Globe2 className="mt-1 shrink-0 text-[#267344]" size={23} />
                    <div>
                      <h3 className="text-lg font-bold">Live Page</h3>
                      <p className="mt-1 text-base text-[#526658]">
                        {hasLivePage
                          ? "Your plan has a Live Page reference. Open your workspace to manage it."
                          : "Create your customer-facing page to start receiving requests."}
                      </p>
                    </div>
                  </div>
                  {!hasLivePage && (
                    <Link
                      to={`/planet/creator/starter?system=${encodeURIComponent(slug)}`}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#193C2B] px-5 py-4 text-base font-bold text-white sm:w-auto"
                    >
                      Set Up My Live Page <ArrowRight size={18} />
                    </Link>
                  )}
                </div>

                {extraModules.length > 0 && (
                  <div className="rounded-2xl border border-[#DCE5DA] bg-white p-5">
                    <div className="flex gap-4">
                      <CircleDot className="mt-1 shrink-0 text-[#267344]" size={23} />
                      <div>
                        <h3 className="text-lg font-bold">Selected tools for later setup</h3>
                        <p className="mt-1 text-base text-[#526658]">
                          These tools are part of your plan, but selecting them does
                          not activate their full workflows.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {extraModules.map((module) => (
                            <span key={module.id}
                              className="rounded-full border border-[#DCE5DA] bg-[#F7F6F0] px-4 py-2 text-sm font-bold">
                              {module.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to={`/planet/system/${slug}`}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#193C2B] bg-white px-6 py-4 text-lg font-bold text-[#193C2B] sm:w-auto"
              >
                Open My HomePlanet <ArrowRight size={19} />
              </Link>
            </section>
          </>
        )}
      </section>
    </main>
  );
}
