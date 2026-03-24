// PATCHED FOR MOBILE — DO NOT REMOVE ANY LOGIC

import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ComparisonSection from "../components/pricing/ComparisonSection";
import WhyDifferentSection from "../components/pricing/WhyDifferentSection";
import RequestAccessSection from "../components/pricing/RequestAccessSection";

type TierSlug = "start" | "grow" | "pro-system";

type TierConfig = {
  slug: TierSlug;
  name: string;
  price: string;
  sub: string;
  highlight: string;
  features: string[];
  cta: string;
  detailTitle: string;
  detailSubtitle: string;
  whoItsFor: string;
  promise: string;
  requestHeading: string;
  requestSubheading: string;
  accent: string;
};

const tiers: TierConfig[] = [
  {
    slug: "start",
    name: "Start",
    price: "$0",
    sub: "or $9.97/mo",
    highlight: "No risk entry",
    features: [
      "Live Board",
      "Customer Intake",
      "Basic Timeline",
      "Presence ID",
      "Share Plan Enabled",
    ],
    cta: "View Start Plan",
    detailTitle: "Start Plan",
    detailSubtitle:
      "Get into HomePlanet without friction and see your system come to life.",
    whoItsFor:
      "Best for businesses that want a live board, intake path, and presence-first starting point without committing to a full operational build yet.",
    promise:
      "This is your clean entry point. Enough to start running live, proving the concept, and getting your first real workflow into the system.",
    requestHeading: "Start Free",
    requestSubheading:
      "This path goes straight into your setup flow so you can get to the holy-shit moment fast.",
    accent: "text-green-400",
  },
  {
    slug: "grow",
    name: "Grow",
    price: "$49",
    sub: "/month",
    highlight: "Most Popular",
    features: [
      "Everything in Start",
      "Payments + Invoices",
      "Job Tracking",
      "Staff Board",
      "Customer Messaging",
    ],
    cta: "View Grow Plan",
    detailTitle: "Grow Plan",
    detailSubtitle:
      "Operate daily with stronger workflow control, customer visibility, and team movement.",
    whoItsFor:
      "Best for businesses that are past the idea stage and need HomePlanet to help run jobs, track movement, and improve daily operations.",
    promise:
      "This is where the system starts becoming part of the real business day — not just a landing page, but an actual operating layer.",
    requestHeading: "Request Grow Access",
    requestSubheading:
      "You are requesting access from the Grow plan path, so the conversation starts with the right context instead of a blind form.",
    accent: "text-cyan-400",
  },
  {
    slug: "pro-system",
    name: "Pro System",
    price: "$197",
    sub: "/month",
    highlight: "Full Business System",
    features: [
      "Everything in Grow",
      "Automation Flows",
      "AI Suggestions",
      "Priority Support",
      "Advanced Analytics",
    ],
    cta: "View Pro System",
    detailTitle: "Pro System",
    detailSubtitle:
      "A full business operating system built around how your company actually works.",
    whoItsFor:
      "Best for businesses that want HomePlanet built into the heart of intake, staff movement, customer trust, workflow logic, and automation.",
    promise:
      "This is the serious version — the full system path for businesses that want something custom, operational, and hard to compete with.",
    requestHeading: "Request Pro System",
    requestSubheading:
      "You are requesting access from the Pro System path, so the submission already starts with higher-value business intent.",
    accent: "text-violet-400",
  },
];

export default function PricingPage() {
  const [members, setMembers] = useState(1);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedPlan = searchParams.get("plan") as TierSlug | null;

  const selectedTier = useMemo(
    () => tiers.find((tier) => tier.slug === selectedPlan) ?? null,
    [selectedPlan],
  );

  function calculatePrice(count: number) {
    if (count >= 10) return 0;
    if (count >= 6) return 0.97;
    if (count >= 3) return 1.97;
    if (count >= 2) return 2.97;
    return 9.97;
  }

  function openPlan(slug: TierSlug) {
    setSearchParams({ plan: slug });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closePlan() {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startSelectedPlan() {
    if (!selectedTier) return;

    navigate("/planet/start", {
      state: {
        selectedPlan: selectedTier.slug,
        selectedPlanName: selectedTier.name,
      },
    });
  }

  const dynamicPrice = calculatePrice(members);

  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* TOP NAV */}
        <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
          <button onClick={() => navigate("/planet/start")} className="btn">Start</button>
          <button onClick={() => navigate("/planet/creator/projects")} className="btn">Projects</button>
          <button onClick={() => navigate("/planet/creator/studio")} className="btn">Studio</button>
        </div>

        {!selectedTier ? (
          <>
            {/* HERO */}
            <div className="mb-10 text-center px-2">
              <h1 className="mb-3 text-2xl font-bold leading-tight sm:text-3xl md:text-5xl">
                Run Your Business Without the Chaos
              </h1>
              <p className="text-sm text-gray-400 sm:text-base">
                Start simple. Grow into a full system. Pay less when you connect.
              </p>
            </div>

            {/* SHARE PLAN */}
            <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center">
              <h2 className="mb-2 text-xl font-semibold sm:text-2xl">
                ⚡ Share Plan Pricing
              </h2>

              <input
                type="range"
                min="1"
                max="10"
                value={members}
                onChange={(e) => setMembers(Number(e.target.value))}
                className="w-full"
              />

              <div className="mt-4 text-2xl font-bold text-green-400 sm:text-3xl">
                ${dynamicPrice.toFixed(2)} / month
              </div>
            </div>

            {/* CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {tiers.map((tier) => (
                <div key={tier.slug} className="card">
                  <h3 className="text-lg font-semibold">{tier.name}</h3>
                  <p className="text-green-400 text-sm">{tier.highlight}</p>

                  <div className="text-2xl font-bold mt-2">{tier.price}</div>
                  <div className="text-gray-400 text-sm">{tier.sub}</div>

                  <ul className="mt-4 text-sm space-y-1">
                    {tier.features.map((f) => (
                      <li key={f}>✔ {f}</li>
                    ))}
                  </ul>

                  <button onClick={() => openPlan(tier.slug)} className="cta">
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>

            <ComparisonSection />
            <WhyDifferentSection />
          </>
        ) : (
          <div className="card">
            <button onClick={closePlan} className="btn mb-4">
              ← Back
            </button>

            <h1 className="text-2xl font-bold md:text-4xl">
              {selectedTier.detailTitle}
            </h1>

            <p className="mt-3 text-sm text-gray-400 md:text-base">
              {selectedTier.detailSubtitle}
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <div>{selectedTier.whoItsFor}</div>
              <div>{selectedTier.promise}</div>
            </div>

            {selectedTier.slug === "start" ? (
              <button onClick={startSelectedPlan} className="cta mt-6">
                Continue
              </button>
            ) : (
              <RequestAccessSection />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* SIMPLE REUSABLE STYLES */
const btn = "rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm hover:bg-zinc-800";
const card = "rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 flex flex-col gap-2";
const cta = "mt-4 rounded-lg bg-green-500 py-2 font-semibold text-black hover:bg-green-400";