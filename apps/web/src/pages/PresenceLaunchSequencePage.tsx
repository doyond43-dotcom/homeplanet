import { ArrowRight, HeartPulse } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const phases = [
  "PRESENCE DETECTED",
  "CUSTOMER FLOW READY",
  "LIVE OPERATIONS ENABLED",
  "PAYMENT SUPPORT CONNECTED",
  "PROOF TIMELINE ACTIVE",
  "SYSTEM LIVE",
];

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function PresenceLaunchSequencePage() {
  const navigate = useNavigate();
  const { boardSlug = "homeplanet-live" } = useParams();

  const [activeIndex, setActiveIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const systemName = useMemo(() => {
    try {
      const raw = window.localStorage.getItem(`hp-system:${boardSlug}`);

      if (!raw) {
        return titleFromSlug(boardSlug);
      }

      const parsed = JSON.parse(raw);

      return parsed.businessName || titleFromSlug(boardSlug);
    } catch {
      return titleFromSlug(boardSlug);
    }
  }, [boardSlug]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= phases.length - 1) {
          window.clearInterval(interval);

          window.setTimeout(() => {
            setFinished(true);
          }, 850);

          return current;
        }

        return current + 1;
      });
    }, 850);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!finished) return;

    const timeout = window.setTimeout(() => {
      navigate(`/planet/live/${boardSlug}`);
    }, 1700);

    return () => window.clearTimeout(timeout);
  }, [finished, navigate, boardSlug]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-10 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/10" />

        <div className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border border-emerald-300/10" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_45%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.92))]" />
      </div>

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] shadow-[0_0_120px_rgba(16,185,129,0.25)]">
          <div className="absolute inset-0 animate-ping rounded-full border border-emerald-300/20" />

          <div className="absolute inset-4 animate-pulse rounded-full border border-emerald-300/10" />

          <HeartPulse
            size={52}
            className="text-emerald-300 drop-shadow-[0_0_20px_rgba(110,231,183,0.6)]"
          />
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-emerald-200">
            HomePlanet Presence Sequence
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
            {systemName}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/55">
            HomePlanet is preparing your live operational system.
          </p>
        </div>

        <div className="mt-14 flex w-full flex-col gap-4">
          {phases.map((phase, index) => {
            const active = index <= activeIndex;
            const current = index === activeIndex;

            return (
              <div
                key={phase}
                className={`relative overflow-hidden rounded-2xl border px-5 py-5 transition-all duration-700 ${
                  active
                    ? "border-emerald-300/30 bg-emerald-300/[0.08] shadow-[0_0_35px_rgba(16,185,129,0.15)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-[4px] transition-all duration-700 ${
                    active ? "bg-emerald-300" : "bg-transparent"
                  }`}
                />

                {current ? (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(16,185,129,0.16),transparent_45%)]" />
                ) : null}

                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-3 w-3 rounded-full transition-all duration-700 ${
                        active
                          ? "bg-emerald-300 shadow-[0_0_20px_rgba(110,231,183,0.8)]"
                          : "bg-white/15"
                      }`}
                    />

                    <div
                      className={`text-sm font-black uppercase tracking-[0.18em] transition-all duration-700 sm:text-base ${
                        active ? "text-white" : "text-white/35"
                      }`}
                    >
                      {phase}
                    </div>
                  </div>

                  {active ? (
                    <ArrowRight
                      size={18}
                      className="text-emerald-300"
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {finished ? (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300">
              System Ready
            </div>

            <div className="mt-3 text-3xl font-black sm:text-4xl">
              Entering Live Board
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}