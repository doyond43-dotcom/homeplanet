import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type BusinessCategory =
  | "auto-repair"
  | "home-services"
  | "restaurant"
  | "lawn"
  | "legal"
  | "other";

type FormState = {
  ownerName: string;
  businessName: string;
  businessType: string;
  city: string;
  phone: string;
  teamSize: string;
  primaryGoal: string;
  category: BusinessCategory;
};

const TOTAL_STEPS = 7;

const defaultForm: FormState = {
  ownerName: "",
  businessName: "",
  businessType: "",
  city: "",
  phone: "",
  teamSize: "",
  primaryGoal: "",
  category: "auto-repair",
};

function getDemoRoute(category: BusinessCategory) {
  switch (category) {
    case "auto-repair":
      return "/planet/demo/auto-service";
    case "home-services":
      return "/planet/demo/home-services";
    case "restaurant":
      return "/planet/demo/restaurant";
    case "lawn":
      return "/planet/demo/lawn-route";
    case "legal":
      return "/planet/demo/legal-workspace";
    default:
      return "/planet/start/preview";
  }
}

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(defaultForm);

  const progress = useMemo(() => {
    return Math.round((step / TOTAL_STEPS) * 100);
  }, [step]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function next() {
    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  }

  function back() {
    setStep((current) => Math.max(1, current - 1));
  }

  function generatePreviewBoard() {
    const payload = {
      ownerName: form.ownerName,
      businessName: form.businessName,
      businessType: form.businessType || form.category,
      city: form.city,
      primaryGoal: form.primaryGoal,
      demoRoute: getDemoRoute(form.category),
    };

    try {
      localStorage.setItem("hp_onboarding_payload", JSON.stringify(payload));
    } catch {
      // ignore
    }

    navigate("/planet/start/building", {
      state: payload,
    });
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
        <div className="grid w-full gap-6 md:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-slate-950 p-6 shadow-[0_0_80px_rgba(34,211,238,0.12)] md:p-8">
            <div className="inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              HomePlanet Start
            </div>

            <h1 className="mt-5 text-3xl font-semibold md:text-5xl">
              Build your live business preview
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-300">
              This onboarding should end in a reveal, not a dead end. We gather
              just enough structure, then we generate the right board for the
              right business type.
            </p>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Progress
                </div>
                <div className="text-sm font-semibold text-cyan-100">
                  Step {step} of {TOTAL_STEPS}
                </div>
              </div>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-sm text-slate-400">{progress}% complete</div>
            </div>

            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                Onboarding
              </div>
              <div className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-cyan-50">
                Build animation
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-50">
                Reveal board
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#081122] p-6 md:p-8">
            {step === 1 && (
              <StepShell
                title="Who’s setting this up?"
                description="Start with the owner so the preview feels personal."
              >
                <Label label="Owner name">
                  <input
                    value={form.ownerName}
                    onChange={(e) => update("ownerName", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="Danny Doyon"
                  />
                </Label>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell
                title="What’s the business name?"
                description="This becomes the identity of the preview board."
              >
                <Label label="Business name">
                  <input
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="Taylor Creek Auto Repair"
                  />
                </Label>
              </StepShell>
            )}

            {step === 3 && (
              <StepShell
                title="Choose the business type"
                description="This controls which live demo gets revealed."
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <CategoryCard
                    active={form.category === "auto-repair"}
                    title="Auto Repair"
                    subtitle="Repair orders, bay status, approvals"
                    onClick={() => {
                      update("category", "auto-repair");
                      update("businessType", "Auto Repair");
                    }}
                  />
                  <CategoryCard
                    active={form.category === "home-services"}
                    title="Home Services"
                    subtitle="Projects, scheduling, invoices"
                    onClick={() => {
                      update("category", "home-services");
                      update("businessType", "Home Services");
                    }}
                  />
                  <CategoryCard
                    active={form.category === "restaurant"}
                    title="Restaurant"
                    subtitle="Kitchen flow and live ops"
                    onClick={() => {
                      update("category", "restaurant");
                      update("businessType", "Restaurant");
                    }}
                  />
                  <CategoryCard
                    active={form.category === "lawn"}
                    title="Lawn / Route"
                    subtitle="Stops, route flow, field updates"
                    onClick={() => {
                      update("category", "lawn");
                      update("businessType", "Lawn Service");
                    }}
                  />
                  <CategoryCard
                    active={form.category === "legal"}
                    title="Legal"
                    subtitle="Case desk and intake visibility"
                    onClick={() => {
                      update("category", "legal");
                      update("businessType", "Legal");
                    }}
                  />
                  <CategoryCard
                    active={form.category === "other"}
                    title="Other"
                    subtitle="Fallback starter preview"
                    onClick={() => {
                      update("category", "other");
                      update("businessType", "Other Business");
                    }}
                  />
                </div>
              </StepShell>
            )}

            {step === 4 && (
              <StepShell
                title="Where is the business located?"
                description="Lets the preview feel geographically anchored."
              >
                <Label label="City">
                  <input
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="Okeechobee, Florida"
                  />
                </Label>
              </StepShell>
            )}

            {step === 5 && (
              <StepShell
                title="Best contact number"
                description="Useful for live intake and customer-facing moments."
              >
                <Label label="Phone">
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="863-555-1212"
                  />
                </Label>
              </StepShell>
            )}

            {step === 6 && (
              <StepShell
                title="How big is the team?"
                description="Helps frame the operational feel of the board."
              >
                <Label label="Team size">
                  <input
                    value={form.teamSize}
                    onChange={(e) => update("teamSize", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="3 technicians + front desk"
                  />
                </Label>
              </StepShell>
            )}

            {step === 7 && (
              <StepShell
                title="What should this system improve first?"
                description="Final step before the reveal."
              >
                <Label label="Primary goal">
                  <textarea
                    value={form.primaryGoal}
                    onChange={(e) => update("primaryGoal", e.target.value)}
                    className="min-h-[130px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="Reduce friction, show status live, and make the business feel structured."
                  />
                </Label>

                <div className="mt-5 rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                    Reveal route
                  </div>
                  <div className="mt-2 text-sm text-cyan-50">
                    {getDemoRoute(form.category)}
                  </div>
                </div>
              </StepShell>
            )}

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={back}
                disabled={step === 1}
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={next}
                  className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={generatePreviewBoard}
                  className="rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  Generate My Preview Board
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
        Current step
      </div>
      <h2 className="mt-3 text-2xl font-semibold md:text-3xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
        {description}
      </p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Label({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-3 text-sm font-medium text-slate-300">{label}</div>
      {children}
    </label>
  );
}

function CategoryCard({
  title,
  subtitle,
  active,
  onClick,
}: {
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[24px] border p-4 text-left transition ${
        active
          ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
      }`}
    >
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</div>
    </button>
  );
}