import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type OnboardingPayload = {
  businessName?: string;
  ownerName?: string;
  businessType?: string;
  city?: string;
  primaryGoal?: string;
  demoRoute?: string;
  boardSlug?: string;
  presenceId?: string;
  presenceKey?: string;
};

const PHASES = [
  "Reading your business type",
  "Structuring your live workflow",
  "Building your preview board",
  "Linking customer-facing flow",
  "Preparing reveal",
];

const PHASE_TIMINGS_MS = [1200, 1200, 1400, 1400, 1800];
const INITIAL_PROGRESS = 78;
const REVEAL_CARD_HOLD_MS = 1900;
const COUNTDOWN_STEP_MS = 850;
const BOARD_HANDOFF_FADE_MS = 550;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 6);
}

function makePresenceId(slug: string) {
  return `HP-${slug.replace(/-/g, "").toUpperCase().slice(0, 10)}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

function makePresenceKey() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

async function ensureStarterBoard(payload: OnboardingPayload) {
  const businessName = payload.businessName?.trim() || "Starter Board";
  const ownerName = payload.ownerName?.trim() || "";
  const businessType = payload.businessType?.trim() || "";
  const city = payload.city?.trim() || "";
  const phone = "";

  const providedSlug = payload.boardSlug?.trim() || "";
  const baseSlug = providedSlug || slugify(businessName) || `starter-${randomSuffix()}`;

  if (providedSlug) {
    const existingBySlug = await supabase
      .from("starter_boards")
      .select("board_slug,presence_id,presence_key")
      .eq("board_slug", providedSlug)
      .maybeSingle();

    if (existingBySlug.data) {
      return {
        boardSlug: existingBySlug.data.board_slug,
        presenceId: existingBySlug.data.presence_id,
        presenceKey: existingBySlug.data.presence_key,
      };
    }
  }

  const existing = await supabase
    .from("starter_boards")
    .select("board_slug,presence_id,presence_key")
    .eq("business_name", businessName)
    .eq("owner_name", ownerName)
    .limit(1)
    .maybeSingle();

  if (existing.data) {
    return {
      boardSlug: existing.data.board_slug,
      presenceId: existing.data.presence_id,
      presenceKey: existing.data.presence_key,
    };
  }

  let inserted = null;

  for (let i = 0; i < 5; i += 1) {
    const trySlug =
      i === 0
        ? baseSlug
        : providedSlug || `${baseSlug}-${randomSuffix()}`;

    const presenceId = makePresenceId(trySlug);
    const presenceKey = makePresenceKey();

    const result = await supabase
      .from("starter_boards")
      .insert({
        board_slug: trySlug,
        business_name: businessName,
        business_type: businessType,
        city,
        owner_name: ownerName,
        phone,
        presence_id: presenceId,
        presence_key: presenceKey,
      })
      .select("board_slug,presence_id,presence_key")
      .single();

    if (!result.error && result.data) {
      inserted = result.data;
      break;
    }
  }

  if (!inserted) {
    throw new Error("Could not create starter board identity.");
  }

  return {
    boardSlug: inserted.board_slug,
    presenceId: inserted.presence_id,
    presenceKey: inserted.presence_key,
  };
}

export default function OnboardingBuildTransition() {
  const navigate = useNavigate();
  const location = useLocation();

  const payload = useMemo<OnboardingPayload>(() => {
    const statePayload = (location.state as OnboardingPayload | null) ?? null;

    if (statePayload) {
      try {
        localStorage.setItem("hp_onboarding_payload", JSON.stringify(statePayload));
      } catch {
        // ignore
      }
      return statePayload;
    }

    try {
      const raw = localStorage.getItem("hp_onboarding_payload");
      if (!raw) return {};
      return JSON.parse(raw) as OnboardingPayload;
    } catch {
      return {};
    }
  }, [location.state]);

  const businessName = payload.businessName?.trim() || "Your Business";
  const ownerName = payload.ownerName?.trim() || "you";

  const totalBuildMs = useMemo(
    () => PHASE_TIMINGS_MS.reduce((sum, duration) => sum + duration, 0),
    [],
  );

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [showReveal, setShowReveal] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [handoffFading, setHandoffFading] = useState(false);
  const [finalPayload, setFinalPayload] = useState<OnboardingPayload>(payload);

  useEffect(() => {
    let alive = true;

    void (async () => {
      try {
        if (
  payload.businessType?.toLowerCase().includes("auto") &&
  (!payload.boardSlug || !payload.presenceId || !payload.presenceKey)
) {
          const identity = await ensureStarterBoard(payload);
          if (!alive) return;

          const nextPayload = { ...payload, ...identity };
          setFinalPayload(nextPayload);

          try {
            localStorage.setItem("hp_onboarding_payload", JSON.stringify(nextPayload));
          } catch {
            // ignore
          }
        }
      } catch {
        // keep moving even if identity creation fails
      }
    })();

    return () => {
      alive = false;
    };
  }, [payload]);

  useEffect(() => {
    const startedAt = window.performance.now();
    let frameId = 0;

    const updateFrame = (now: number) => {
      const elapsed = Math.min(now - startedAt, totalBuildMs);

      let remaining = elapsed;
      let nextPhaseIndex = 0;

      for (let i = 0; i < PHASE_TIMINGS_MS.length; i += 1) {
        if (remaining < PHASE_TIMINGS_MS[i]) {
          nextPhaseIndex = i;
          break;
        }
        remaining -= PHASE_TIMINGS_MS[i];
        nextPhaseIndex = i;
      }

      setPhaseIndex(nextPhaseIndex);

      const ratio = clamp(elapsed / totalBuildMs, 0, 1);
      const eased = 1 - Math.pow(1 - ratio, 1.9);
      const nextProgress = Math.round(
        INITIAL_PROGRESS + (100 - INITIAL_PROGRESS) * eased,
      );
      setProgress(clamp(nextProgress, INITIAL_PROGRESS, 100));

      if (elapsed < totalBuildMs) {
        frameId = window.requestAnimationFrame(updateFrame);
      }
    };

    frameId = window.requestAnimationFrame(updateFrame);

    const revealStartTimer = window.setTimeout(() => {
      setShowReveal(true);
    }, totalBuildMs);

    const countdown3Timer = window.setTimeout(() => {
      setCountdownValue(3);
    }, totalBuildMs + REVEAL_CARD_HOLD_MS);

    const countdown2Timer = window.setTimeout(() => {
      setCountdownValue(2);
    }, totalBuildMs + REVEAL_CARD_HOLD_MS + COUNTDOWN_STEP_MS);

    const countdown1Timer = window.setTimeout(() => {
      setCountdownValue(1);
    }, totalBuildMs + REVEAL_CARD_HOLD_MS + COUNTDOWN_STEP_MS * 2);

    const fadeTimer = window.setTimeout(() => {
      setHandoffFading(true);
    }, totalBuildMs + REVEAL_CARD_HOLD_MS + COUNTDOWN_STEP_MS * 3);

    const navigateTimer = window.setTimeout(() => {
      const targetRoute =
        finalPayload.businessType?.toLowerCase().includes("auto") &&
        finalPayload.boardSlug
          ? `/planet/live/${finalPayload.boardSlug}`
          : "/planet/demo/auto-service";

      navigate(targetRoute, {
        replace: true,
        state: {
          fromOnboarding: true,
          onboardingPayload: finalPayload,
        },
      });
    }, totalBuildMs + REVEAL_CARD_HOLD_MS + COUNTDOWN_STEP_MS * 3 + BOARD_HANDOFF_FADE_MS);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(revealStartTimer);
      window.clearTimeout(countdown3Timer);
      window.clearTimeout(countdown2Timer);
      window.clearTimeout(countdown1Timer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(navigateTimer);
    };
  }, [navigate, totalBuildMs, finalPayload]);

  const isFinalPhase = phaseIndex === PHASES.length - 1;

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#050816] text-white"
      style={{
        opacity: handoffFading ? 0 : 1,
        transform: handoffFading ? "scale(0.992)" : "scale(1)",
        transition: `opacity ${BOARD_HANDOFF_FADE_MS}ms ease, transform ${BOARD_HANDOFF_FADE_MS}ms ease`,
      }}
    >
      {!showReveal ? (
        <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-10">
          <div className="w-full overflow-hidden rounded-[32px] border border-cyan-400/20 bg-white/5 shadow-[0_0_80px_rgba(34,211,238,0.10)] backdrop-blur">
            <div className="border-b border-white/10 px-6 py-5 md:px-8">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
                    HomePlanet Build
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold md:text-4xl">
                    Bringing {businessName} to life
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-300 md:text-base">
                    We’re turning your onboarding into a working live preview for{" "}
                    {ownerName}.
                  </p>
                </div>

                <div className="shrink-0 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                  Step 8 of 8
                </div>
              </div>

              <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400"
                  style={{
                    width: `${progress}%`,
                    transition: "width 180ms linear",
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>{isFinalPhase ? "Locking in your reveal" : "Continuing your setup"}</span>
                <span>{progress}%</span>
              </div>
            </div>

            <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.3fr_0.9fr] md:px-8">
              <div>
                <div className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  Live build in progress
                </div>

                <h2 className="mt-5 text-3xl font-semibold leading-tight">
                  {isFinalPhase
                    ? "Your board is almost ready."
                    : "Your preview board is being assembled right now."}
                </h2>

                <p className="mt-4 max-w-2xl text-base text-slate-300">
                  {isFinalPhase
                    ? "The structure is in place. Mission control is taking a beat to lock in the final reveal."
                    : "The system is converting your answers into a real business-ready preview so the landing feels structured, useful, and immediate."}
                </p>

                <div className="mt-8 space-y-3">
                  {PHASES.map((phase, index) => {
                    const active = index === phaseIndex;
                    const complete = index < phaseIndex;

                    return (
                      <div
                        key={phase}
                        className={`rounded-2xl border px-4 py-4 transition-all duration-300 ${
                          active
                            ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.14)]"
                            : complete
                              ? "border-emerald-400/25 bg-emerald-400/10"
                              : "border-white/10 bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-sm font-medium md:text-base">{phase}</div>
                          <div
                            className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                              active
                                ? "text-cyan-200"
                                : complete
                                  ? "text-emerald-300"
                                  : "text-slate-500"
                            }`}
                          >
                            {complete ? "Done" : active ? "Running" : "Queued"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#071124] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Build summary
                </p>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Business
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      {businessName}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Type
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      {finalPayload.businessType || "General Business"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Live slug
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white break-all">
                      {finalPayload.boardSlug || "creating..."}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                      Presence ID
                    </div>
                    <div className="mt-2 text-sm leading-6 text-cyan-50">
                      {finalPayload.presenceId || "creating..."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-10">
          <div className="w-full max-w-3xl rounded-[36px] border border-cyan-400/20 bg-white/5 px-8 py-14 text-center shadow-[0_0_90px_rgba(34,211,238,0.10)] backdrop-blur">
            <div className="mx-auto mb-4 inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              HomePlanet Mission Control
            </div>

            <div className="mx-auto mb-8 h-24 w-24 rounded-full border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_45px_rgba(34,211,238,0.14)]" />

            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/80">
              System ready
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              {businessName}
            </h1>

            <p className="mt-4 text-lg text-slate-300">
              Your live board has been created
            </p>

            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-[#071124] px-5 py-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Deployment
              </div>

              <div className="mt-3 text-xl font-semibold text-white">
                {countdownValue === null ? "Mission locked" : `Opening in ${countdownValue}`}
              </div>

              <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-cyan-300/70 transition-all duration-700"
                  style={{
                    width:
                      countdownValue === null
                        ? "20%"
                        : countdownValue === 3
                          ? "42%"
                          : countdownValue === 2
                            ? "68%"
                            : "94%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


