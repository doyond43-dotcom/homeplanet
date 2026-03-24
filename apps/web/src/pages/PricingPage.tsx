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
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/planet/start")}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Start
          </button>
          <button
            type="button"
            onClick={() => navigate("/planet/creator/projects")}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => navigate("/planet/creator/studio")}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Studio
          </button>
        </div>

        {!selectedTier ? (
          <>
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                Run Your Business Without the Chaos
              </h1>
              <p className="text-lg text-gray-400">
                Start simple. Grow into a full system. Pay less when you
                connect.
              </p>
            </div>

            <div className="mb-12 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
              <h2 className="mb-2 text-2xl font-semibold">
                ⚡ Share Plan Pricing
              </h2>

              <p className="mb-4 text-gray-400">
                The more businesses you connect, the less you pay.
              </p>

              <div className="mb-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={members}
                  onChange={(e) => setMembers(Number(e.target.value))}
                  className="w-full"
                />
                <p className="mt-2 text-sm text-gray-400">
                  {members} connected users
                </p>
              </div>

              <div className="text-3xl font-bold text-green-400">
                ${dynamicPrice.toFixed(2)} / month per user
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Invite others → lower your cost instantly
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {tiers.map((tier) => (
                <div
                  key={tier.slug}
                  className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
                >
                  <h3 className="mb-2 text-xl font-semibold">{tier.name}</h3>

                  <p className="mb-4 text-sm text-green-400">
                    {tier.highlight}
                  </p>

                  <div className="mb-1 text-3xl font-bold">{tier.price}</div>
                  <div className="mb-4 text-gray-400">{tier.sub}</div>

                  <ul className="mb-6 flex-1 space-y-2 text-sm text-gray-300">
                    {tier.features.map((feature) => (
                      <li key={feature}>✔ {feature}</li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => openPlan(tier.slug)}
                    className="rounded-lg bg-green-500 py-2 font-semibold text-black hover:bg-green-400"
                  >
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>

            <ComparisonSection />

            <WhyDifferentSection />

            <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
              <h2 className="mb-2 text-2xl font-semibold">
                🚀 System Activation
              </h2>

              <p className="mb-4 text-gray-400">
                When you&apos;re ready, we build your entire business system for
                you.
              </p>

              <div className="mb-2 text-3xl font-bold text-blue-400">
                $997 – $2,500 one-time
              </div>

              <p className="text-sm text-gray-500">
                Includes full setup, workflows, branding, and automation.
              </p>
            </div>

            <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
              <h2 className="mb-3 text-2xl font-semibold">
                Need a custom path first?
              </h2>
              <p className="mx-auto max-w-3xl text-gray-400">
                Pick a plan above first so the next step has context. Don&apos;t
                drop people into a blind generic form before they know what
                system path they&apos;re choosing.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={closePlan}
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  ← Back to Pricing
                </button>

                <div className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
                  Selected Plan:{" "}
                  <span className={`font-semibold ${selectedTier.accent}`}>
                    {selectedTier.name}
                  </span>
                </div>
              </div>

              <div
                className={`grid gap-8 ${
                  selectedTier.slug === "start"
                    ? "lg:grid-cols-[1.15fr_0.85fr]"
                    : "lg:grid-cols-[1fr_1fr]"
                }`}
              >
                <div>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
                    {selectedTier.highlight}
                  </div>

                  <h1 className="text-4xl font-bold md:text-5xl">
                    {selectedTier.detailTitle}
                  </h1>

                  <p className="mt-4 max-w-3xl text-lg text-zinc-300">
                    {selectedTier.detailSubtitle}
                  </p>

                  <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
                      Who this is for
                    </div>
                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      {selectedTier.whoItsFor}
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
                      What this plan does
                    </div>
                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      {selectedTier.promise}
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
                      Included in {selectedTier.name}
                    </div>

                    <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                      {selectedTier.features.map((feature) => (
                        <li key={feature}>✔ {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {selectedTier.slug === "start" ? (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
                      Start path
                    </div>

                    <div className="mt-4 text-4xl font-bold">
                      {selectedTier.price}
                    </div>
                    <div className="mt-1 text-zinc-400">{selectedTier.sub}</div>

                    <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                      <div className="text-sm font-semibold text-emerald-300">
                        {selectedTier.requestHeading}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-emerald-100/90">
                        {selectedTier.requestSubheading}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={startSelectedPlan}
                      className="mt-6 w-full rounded-lg bg-green-500 py-3 font-semibold text-black hover:bg-green-400"
                    >
                      Continue with Start
                    </button>

                    <div className="mt-4 text-xs leading-6 text-zinc-500">
                      Start goes into onboarding so they can answer questions,
                      build the board, and hit the holy-shit moment fast.
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                    <div className="mb-6">
                      <div className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
                        {selectedTier.requestHeading}
                      </div>

                      <div className="mt-3 text-4xl font-bold">
                        {selectedTier.price}
                      </div>
                      <div className="mt-1 text-zinc-400">
                        {selectedTier.sub}
                      </div>

                      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                        <div className="text-sm font-semibold text-emerald-300">
                          This is now a real plan page, not a blind form jump.
                        </div>
                        <p className="mt-2 text-sm leading-6 text-emerald-100/90">
                          {selectedTier.requestSubheading}
                        </p>
                      </div>

                      <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/30 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                          Plan being requested
                        </div>
                        <div className="mt-2 text-2xl font-bold">
                          {selectedTier.name}
                        </div>
                        <div className="mt-1 text-sm text-zinc-400">
                          The business owner is requesting access from the{" "}
                          <span className={`font-semibold ${selectedTier.accent}`}>
                            {selectedTier.name}
                          </span>{" "}
                          path.
                        </div>
                      </div>
                    </div>

                    <RequestAccessSection />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}