import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Sparkles, Wrench } from "lucide-react";

function formatLabel(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function StarterBuildTransition() {
  const navigate = useNavigate();
  const { search } = useLocation();

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const businessName =
    params.get("businessName") ||
    params.get("business") ||
    "Your Business";

  const businessType =
    params.get("businessType") ||
    params.get("service") ||
    "Service Business";

  const buildIntent =
    params.get("buildIntent") ||
    params.get("build") ||
    "full-system";

  const nextPath = params.get("next") || "/planet/start/preview";

  const forwardParams = useMemo(() => {
    const next = new URLSearchParams(params);
    next.delete("next");
    return next.toString();
  }, [params]);

  const phases = useMemo(() => {
    const type = businessType.toLowerCase();
    const intent = buildIntent.toLowerCase();

    const lines = [
      `Anchoring ${businessName}`,
      `Mapping ${formatLabel(businessType)} workflow`,
      `Detecting customer friction`,
      `Structuring visible job stages`,
      `Preparing ${formatLabel(buildIntent)} reveal`,
    ];

    if (type.includes("auto") || type.includes("repair") || type.includes("shop")) {
      lines[1] = "Mapping intake, service, and handoff flow";
      lines[3] = "Structuring live vehicle job stages";
    }

    if (intent.includes("intake")) {
      lines[4] = "Preparing intake-first reveal";
    }

    if (intent.includes("live-board")) {
      lines[4] = "Preparing live board reveal";
    }

    return lines;
  }, [businessName, businessType, buildIntent]);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(72);

  useEffect(() => {
    const phaseTimer = window.setInterval(() => {
      setPhaseIndex((current) => {
        if (current >= phases.length - 1) return current;
        return current + 1;
      });
    }, 650);

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) return 100;
        return Math.min(100, current + 3);
      });
    }, 90);

    const finishTimer = window.setTimeout(() => {
      const target = forwardParams ? `${nextPath}?${forwardParams}` : nextPath;
      navigate(target, { replace: true });
    }, 3200);

    return () => {
      window.clearInterval(phaseTimer);
      window.clearInterval(progressTimer);
      window.clearTimeout(finishTimer);
    };
  }, [navigate, nextPath, forwardParams, phases.length]);

  return (
    <div className="min-h-screen bg-[#06111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.14),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full overflow-hidden rounded-[34px] border border-cyan-400/20 bg-white/5 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.5)] backdrop-blur md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            <Sparkles className="h-4 w-4" />
            HomePlanet Build Sequence
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
              Building {businessName}
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                into a living system
              </span>
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              HomePlanet is structuring your workflow, mapping friction, and preparing
              the first visible reveal.
            </p>
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-950/45 p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Build progress
              </div>
              <div className="text-sm font-semibold text-white">{progress}%</div>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-6 grid gap-3">
              {phases.map((phase, idx) => {
                const done = idx < phaseIndex;
                const active = idx === phaseIndex;

                return (
                  <div
                    key={phase}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                      active
                        ? "border-cyan-400/30 bg-cyan-400/10 text-white"
                        : done
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                        : "border-white/10 bg-white/5 text-slate-400"
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10">
                      {done ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                      ) : (
                        <Wrench className={`h-5 w-5 ${active ? "text-cyan-300" : "text-slate-500"}`} />
                      )}
                    </div>

                    <div className="text-sm font-medium">{phase}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Business</div>
              <div className="mt-1 text-sm font-semibold text-white">{businessName}</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Type</div>
              <div className="mt-1 text-sm font-semibold text-white">
                {formatLabel(businessType)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Intent</div>
              <div className="mt-1 text-sm font-semibold text-white">
                {formatLabel(buildIntent)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}