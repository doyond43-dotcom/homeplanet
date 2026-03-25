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
    } catch {}

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
                <Label label="Owner name">
                  <input
                    value={form.ownerName}
                    onChange={(e) => update("ownerName", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </Label>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell title="Business name" description="">
                <Label label="Business name">
                  <input
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                    placeholder="Your business name"
                  />
                </Label>
              </StepShell>
            )}

            {step === 4 && (
              <StepShell title="City" description="">
                <Label label="City">
                  <input
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                    placeholder="Your city"
                  />
                </Label>
              </StepShell>
            )}

            {step === 5 && (
              <StepShell title="Phone" description="">
                <Label label="Phone">
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                    placeholder="Your phone number"
                  />
                </Label>
              </StepShell>
            )}

            {step === 6 && (
              <StepShell title="Team size" description="">
                <Label label="Team size">
                  <input
                    value={form.teamSize}
                    onChange={(e) => update("teamSize", e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                    placeholder="Your team size"
                  />
                </Label>
              </StepShell>
            )}

            {step === 7 && (
              <StepShell title="Primary goal" description="">
                <Label label="Primary goal">
                  <textarea
                    value={form.primaryGoal}
                    onChange={(e) => update("primaryGoal", e.target.value)}
                    className="min-h-[130px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none"
                    placeholder="What do you want this system to improve?"
                  />
                </Label>
              </StepShell>
            )}

            <div className="mt-8 flex justify-between">
              <button onClick={back}>Back</button>
              <button onClick={next}>Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepShell({ title, description, children }: any) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}

function Label({ label, children }: any) {
  return (
    <label>
      <div>{label}</div>
      {children}
    </label>
  );
}