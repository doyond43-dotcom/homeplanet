import { ArrowRight, HeartPulse } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const phases = [
  "PRESENCE DETECTED",
  "CUSTOMER FLOW READY",
  "LIVE OPERATIONS ENABLED",
  "PAYMENT SUPPORT CONNECTED",
  "PROOF TIMELINE ACTIVE",
  "SYSTEM LIVE",
];

const systemMessages = [
  "Synchronizing intake...",
  "Preparing workflow...",
  "Connecting payment layer...",
  "Activating proof timeline...",
  "Loading operational surface...",
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
  const [messageIndex, setMessageIndex] = useState(0);
  const [systemLiveFlash, setSystemLiveFlash] = useState(false);
  const [claimEmail, setClaimEmail] = useState("");
  const [accessLinkSent, setAccessLinkSent] = useState(false);
  const [claimError, setClaimError] = useState("");

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
            setSystemLiveFlash(true);

            window.setTimeout(() => {
              setFinished(true);
            }, 650);
          }, 650);

          return current;
        }

        return current + 1;
      });
    }, 850);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMessageIndex((current) => {
        if (current >= systemMessages.length - 1) {
          return 0;
        }

        return current + 1;
      });
    }, 900);

    return () => window.clearInterval(interval);
  }, []);

  async function sendAccessLink() {
    const email = claimEmail.trim();

    if (!email) return;

    setClaimError("");

    const presenceId = `hp-${boardSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    window.localStorage.setItem(
      `hp-claim:${boardSlug}`,
      JSON.stringify({
        boardSlug,
        systemName,
        presenceId,
        email,
        claimedAt: new Date().toISOString(),
      })
    );

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/planet/live/${boardSlug}`,
      },
    });

    if (error) {
      console.error("[claim-access-link] failed:", error);
      setClaimError("Access link could not be sent yet. Try again in a moment.");
      return;
    }

    setAccessLinkSent(true);
  }

  return (
    <main
      className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-10 text-white transition-all duration-700 ${
        systemLiveFlash ? "brightness-125" : ""
      }`}
    >
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

          <div className="mx-auto mt-5 flex max-w-xl flex-col items-center">
            <p className="text-lg leading-8 text-white/55">
              HomePlanet is preparing your live operational system.
            </p>

            <div className="mt-4 h-6 text-sm font-black uppercase tracking-[0.22em] text-emerald-300/75">
              {systemMessages[messageIndex]}
            </div>
          </div>
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
                } ${
                  systemLiveFlash && phase === "SYSTEM LIVE"
                    ? "scale-[1.015] border-emerald-200/70 bg-emerald-300/[0.14] shadow-[0_0_70px_rgba(16,185,129,0.32)]"
                    : ""
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

                {systemLiveFlash && phase === "SYSTEM LIVE" ? (
                  <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_center,rgba(110,231,183,0.18),transparent_55%)]" />
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
          <div className="mt-12 w-full rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.08] p-6 text-center shadow-[0_0_60px_rgba(16,185,129,0.16)]">
            <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300">
              System Ready
            </div>

            <div className="mt-3 text-3xl font-black sm:text-4xl">
              Claim & Protect Your System
            </div>

            <p className="mx-auto mt-4 max-w-xl text-sm font-bold leading-6 text-white/50">
              HomePlanet assigned this live system to your presence. Send yourself a secure access link so you can manage it later.
            </p>

            <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                value={claimEmail}
                onChange={(event) => setClaimEmail(event.target.value)}
                placeholder="Email address"
                className="h-14 flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white outline-none placeholder:text-white/30"
              />

              <button
                onClick={sendAccessLink}
                className="h-14 rounded-2xl bg-emerald-300 px-6 text-sm font-black text-black transition hover:bg-emerald-200"
              >
                Send Access Link
              </button>
            </div>

            {claimError ? (
              <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm font-bold text-red-200">
                {claimError}
              </div>
            ) : null}

            {claimError ? (
              <div className="mt-5 rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm font-bold text-red-200">
                {claimError}
              </div>
            ) : null}

            {accessLinkSent ? (
              <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-black/30 p-4 text-sm font-bold text-emerald-200">
                Access link sent. Check your email to claim this system.
                <button
                  onClick={() => navigate(`/planet/live/${boardSlug}`)}
                  className="mt-4 block w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-black"
                >
                  Open Live System
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}



