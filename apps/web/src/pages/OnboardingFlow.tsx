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

const categoryOptions: Array<{
  value: BusinessCategory;
  label: string;
  hint: string;
}> = [
  {
    value: "auto-repair",
    label: "Auto Repair",
    hint: "Repair shop, service center, diagnostics",
  },
  {
    value: "home-services",
    label: "Home Services",
    hint: "Screening, awnings, installs, field work",
  },
  {
    value: "restaurant",
    label: "Restaurant",
    hint: "Kitchen flow, tickets, front-of-house",
  },
  {
    value: "lawn",
    label: "Lawn",
    hint: "Routes, crews, service stops",
  },
  {
    value: "legal",
    label: "Legal",
    hint: "Case flow, evidence, client work",
  },
  {
    value: "other",
    label: "Other",
    hint: "Use your own wording and direction",
  },
];

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
      ownerName: form.ownerName.trim(),
      businessName: form.businessName.trim(),
      businessType: form.businessType.trim() || form.category,
      city: form.city.trim(),
      phone: form.phone.trim(),
      teamSize: form.teamSize.trim(),
      primaryGoal: form.primaryGoal.trim(),
      category: form.category,
      demoRoute: getDemoRoute(form.category),
    };

    try {
      localStorage.setItem("hp_onboarding_payload", JSON.stringify(payload));
    } catch {}

    const params = new URLSearchParams({
      ownerName: payload.ownerName,
      businessName: payload.businessName,
      businessType: payload.businessType,
      city: payload.city,
      phone: payload.phone,
      teamSize: payload.teamSize,
      primaryGoal: payload.primaryGoal,
      category: payload.category,
      buildIntent: "live-board",
      next: "/planet/start/preview",
    });

    navigate(`/planet/start/building?${params.toString()}`, {
      state: payload,
    });
  }

  function handleContinue() {
    if (step === TOTAL_STEPS) {
      generatePreviewBoard();
      return;
    }
    next();
  }

  const continueLabel = step === TOTAL_STEPS ? "Generate Preview Board" : "Continue";

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
              This onboarding should end in a reveal, not a dead end.
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
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-2 text-sm text-slate-400">{progress}% complete</div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#081122] p-6 md:p-8">
            {step === 1 && (
              <StepShell
                title="Who’s setting this up?"
                description="Start with the owner so the preview feels personal."
              >
                <FieldHint>Owner name</FieldHint>
                <input
                  value={form.ownerName}
                  onChange={(e) => update("ownerName", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </StepShell>
            )}

            {step === 2 && (
              <StepShell
                title="Business name"
                description="Name the business exactly how you want it to appear."
              >
                <FieldHint>Business name</FieldHint>
                <input
                  value={form.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                  placeholder="Your business name"
                />
              </StepShell>
            )}

            {step === 3 && (
              <StepShell
                title="Business type"
                description="Pick the closest fit, then tighten the wording below if needed."
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  {categoryOptions.map((option) => {
                    const active = form.category === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => update("category", option.value)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          active
                            ? "border-cyan-400/40 bg-cyan-400/10"
                            : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <div className="text-sm font-semibold text-white">{option.label}</div>
                        <div className="mt-1 text-xs leading-5 text-slate-400">
                          {option.hint}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <FieldHint>Business type wording</FieldHint>
                  <input
                    value={form.businessType}
                    onChange={(e) => update("businessType", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                    placeholder="Auto repair shop, screening company, restaurant, etc."
                  />
                </div>
              </StepShell>
            )}

            {step === 4 && (
              <StepShell
                title="City"
                description="Tell HomePlanet where this business lives."
              >
                <FieldHint>City</FieldHint>
                <input
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                  placeholder="Your city"
                />
              </StepShell>
            )}

            {step === 5 && (
              <StepShell
                title="Phone"
                description="A working number helps shape the live contact flow."
              >
                <FieldHint>Phone</FieldHint>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                  placeholder="Your phone number"
                  autoComplete="tel"
                />
              </StepShell>
            )}

            {step === 6 && (
              <StepShell
                title="Team size"
                description="How many people are part of the day-to-day workflow?"
              >
                <FieldHint>Team size</FieldHint>
                <input
                  value={form.teamSize}
                  onChange={(e) => update("teamSize", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                  placeholder="1, 4, 12, etc."
                />
              </StepShell>
            )}

            {step === 7 && (
              <StepShell
                title="Primary goal"
                description="What should this system improve first?"
              >
                <FieldHint>Primary goal</FieldHint>
                <textarea
                  value={form.primaryGoal}
                  onChange={(e) => update("primaryGoal", e.target.value)}
                  className="min-h-[130px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                  placeholder="Example: Create a live customer intake and job tracking system that keeps the whole business visible in real time."
                />
              </StepShell>
            )}

            <div className="mt-8 flex justify-between gap-4">
              <button
                type="button"
                onClick={back}
                disabled={step === 1}
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
              >
                {continueLabel}
              </button>
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
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
      {children}
    </div>
  );
}