import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Sparkles,
  Wrench,
} from "lucide-react";

type StepCardProps = {
  title: string;
  body: string;
  icon?: React.ReactNode;
};

function StepCard({ title, body, icon }: StepCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
          {icon ?? <CheckCircle2 className="h-5 w-5" />}
        </div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-slate-300">{body}</p>
    </div>
  );
}

function formatLabel(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseList(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function StarterBoardPreview() {
  const { search } = useLocation();
  const nav = useNavigate();
  const params = new URLSearchParams(search);

  const businessName =
    params.get("businessName") ||
    params.get("name") ||
    params.get("business") ||
    "Your Business";

  const businessType =
    params.get("businessType") ||
    params.get("type") ||
    "Service Business";

  const city = params.get("city") || "";
  const ownerName = params.get("ownerName") || params.get("owner") || "";
  const phone = params.get("phone") || "";
  const email = params.get("email") || "";

  const biggestFriction =
    params.get("biggestFriction") ||
    params.get("friction") ||
    "Customers fall through the cracks and work gets harder to track.";

  const workflowStage =
    params.get("workflowStage") ||
    params.get("stage") ||
    "Lead intake to completed job";

  const buildIntent =
    params.get("buildIntent") ||
    params.get("build") ||
    "full-system";

  const goals = parseList(params.get("goals") || params.get("goal"));
  const painPoints = parseList(
    params.get("painPoints") || params.get("painPoint")
  );
  const requestedFeatures = parseList(
    params.get("features") || params.get("requestedFeatures")
  );

  const previewHighlights = [
    `${businessName} gets a dedicated starter workflow board`,
    `Intake flows into a cleaner ${workflowStage.toLowerCase()} process`,
    `Your biggest friction point becomes visible and fixable`,
    `This becomes the “holy shit” preview instead of looping back to intake`,
  ];

  const defaultGoals =
    goals.length > 0
      ? goals
      : [
          "Get organized faster",
          "Reduce customer friction",
          "Make the workflow easier to run",
        ];

  const defaultPainPoints =
    painPoints.length > 0
      ? painPoints
      : [
          "Leads get messy",
          "Status updates are hard to track",
          "Customers do not see the flow clearly",
        ];

  const defaultFeatures =
    requestedFeatures.length > 0
      ? requestedFeatures
      : [
          "Live intake board",
          "Job tracking flow",
          "Cleaner customer handoff",
        ];

  return (
    <div className="min-h-screen bg-[#06111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.14),transparent_25%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-cyan-400/20 bg-white/5 shadow-[0_20px_90px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="grid gap-8 p-6 md:grid-cols-[1.25fr_0.85fr] md:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Starter Preview Board
              </div>

              <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
                {businessName}
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  generated preview
                </span>
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                This is the first visible “holy shit” moment after onboarding.
                Instead of bouncing back into intake, the user lands on a starter
                board preview that reflects the business, the friction, and the
                workflow direction they just entered.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <span className="mr-2 font-semibold text-white">
                    Business:
                  </span>
                  {businessName}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <span className="mr-2 font-semibold text-white">Type:</span>
                  {formatLabel(businessType)}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <span className="mr-2 font-semibold text-white">Intent:</span>
                  {formatLabel(buildIntent)}
                </div>
                {city ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    <span className="mr-2 font-semibold text-white">City:</span>
                    {city}
                  </div>
                ) : null}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <StepCard
                  title="Biggest friction detected"
                  body={biggestFriction}
                  icon={<Wrench className="h-5 w-5" />}
                />
                <StepCard
                  title="Workflow direction"
                  body={workflowStage}
                  icon={<ClipboardList className="h-5 w-5" />}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-cyan-400/20 bg-slate-950/60 p-5 shadow-inner shadow-cyan-500/5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Starter board identity
                  </div>
                  <div className="text-xs text-slate-400">
                    What the onboarding just built
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Owner
                  </div>
                  <div className="mt-1 text-sm text-white">
                    {ownerName || "Not provided yet"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Contact
                  </div>
                  <div className="mt-1 text-sm text-white">
                    {phone || email
                      ? [phone, email].filter(Boolean).join(" • ")
                      : "Not provided yet"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Preview highlights
                  </div>
                  <div className="mt-3 space-y-2">
                    {previewHighlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 text-sm text-slate-200"
                      >
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/planet/creator"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Back to intake
                </Link>

                <button
                  type="button"
                  onClick={() => nav(`/planet/creator/build${search}`)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  Continue build
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Goals
            </div>
            <div className="space-y-3">
              {defaultGoals.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Pain points
            </div>
            <div className="space-y-3">
              {defaultPainPoints.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Requested features
            </div>
            <div className="space-y-3">
              {defaultFeatures.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-cyan-400/15 bg-gradient-to-r from-cyan-400/10 via-sky-400/10 to-indigo-400/10 p-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Why this fixes the loop
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Onboarding now ends in a visible result
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200">
                The user just answered seven steps about their business and
                friction. They should not land back on an intake form. They
                should land on a generated preview state that feels like the
                system started building something for them immediately.
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-slate-950/45 p-5">
              <div className="text-sm font-semibold text-white">
                Current flow
              </div>
              <div className="mt-3 space-y-2 text-sm text-slate-300">
                <div>1. Onboarding</div>
                <div>2. Starter preview</div>
                <div>3. Creator build</div>
                <div>4. Live system preview, not print assets</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}