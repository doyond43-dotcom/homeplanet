import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ComparisonSection from "../components/pricing/ComparisonSection";
import WhyDifferentSection from "../components/pricing/WhyDifferentSection";
import RequestAccessSection from "../components/pricing/RequestAccessSection";

const tiers = [
  {
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
    cta: "Start Free",
    action: "start",
  },
  {
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
    cta: "Upgrade to Grow",
    action: "request",
  },
  {
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
    cta: "Go Pro",
    action: "request",
  },
] as const;

export default function PricingPage() {
  const [members, setMembers] = useState(1);
  const navigate = useNavigate();

  function calculatePrice(count: number) {
    if (count >= 10) return 0;
    if (count >= 6) return 0.97;
    if (count >= 3) return 1.97;
    if (count >= 2) return 2.97;
    return 9.97;
  }

  function scrollToRequestAccess() {
    const el = document.getElementById("request-access");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.hash = "request-access";
  }

  function handleTierClick(action: "start" | "request") {
    if (action === "start") {
      navigate("/planet/start");
      return;
    }

    scrollToRequestAccess();
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

        {/* HERO */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Run Your Business Without the Chaos
          </h1>
          <p className="text-lg text-gray-400">
            Start simple. Grow into a full system. Pay less when you connect.
          </p>
        </div>

        {/* SHARE PLAN */}
        <div className="mb-12 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <h2 className="mb-2 text-2xl font-semibold">⚡ Share Plan Pricing</h2>

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

        {/* TIERS */}
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <h3 className="mb-2 text-xl font-semibold">{tier.name}</h3>

              <p className="mb-4 text-sm text-green-400">{tier.highlight}</p>

              <div className="mb-1 text-3xl font-bold">{tier.price}</div>
              <div className="mb-4 text-gray-400">{tier.sub}</div>

              <ul className="mb-6 flex-1 space-y-2 text-sm text-gray-300">
                {tier.features.map((f) => (
                  <li key={f}>✔ {f}</li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleTierClick(tier.action)}
                className="rounded-lg bg-green-500 py-2 font-semibold text-black hover:bg-green-400"
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* COMPARISON */}
        <ComparisonSection />

        {/* WHY DIFFERENT */}
        <WhyDifferentSection />

        {/* ACTIVATION */}
        <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <h2 className="mb-2 text-2xl font-semibold">🚀 System Activation</h2>

          <p className="mb-4 text-gray-400">
            When you&apos;re ready, we build your entire business system for you.
          </p>

          <div className="mb-2 text-3xl font-bold text-blue-400">
            $997 – $2,500 one-time
          </div>

          <p className="text-sm text-gray-500">
            Includes full setup, workflows, branding, and automation.
          </p>
        </div>

        {/* REQUEST ACCESS */}
        <div id="request-access">
          <RequestAccessSection />
        </div>
      </div>
    </div>
  );
}