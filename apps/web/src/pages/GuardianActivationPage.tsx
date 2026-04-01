import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function makePresenceId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PG-${stamp}-${random}`;
}

function buildDisplayPlan(plan: string | null) {
  if (plan === "solo") return "Solo Guardian";
  if (plan === "household") return "Household Guardian";
  return "Guardian System";
}

export default function GuardianActivationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [presenceId, setPresenceId] = useState("");
  const [activatedAt, setActivatedAt] = useState("");
  const [isReady, setIsReady] = useState(false);

  const plan = searchParams.get("plan");
  const ownerName = searchParams.get("ownerName") || localStorage.getItem("guardianOwnerName") || "";
  const householdName =
    searchParams.get("householdName") || localStorage.getItem("guardianHouseholdName") || "";
  const phone = searchParams.get("phone") || localStorage.getItem("guardianContactInfo") || "";
  const email = searchParams.get("email") || "";
  const protectionType = searchParams.get("protectionType") || "";

  const planLabel = useMemo(() => buildDisplayPlan(plan), [plan]);

  useEffect(() => {
    const storedPresenceId = localStorage.getItem("guardianPresenceId");
    const storedActivatedAt = localStorage.getItem("guardianActivatedAt");

    const nextPresenceId = storedPresenceId || makePresenceId();
    const nextActivatedAt = storedActivatedAt || new Date().toISOString();

    setPresenceId(nextPresenceId);
    setActivatedAt(nextActivatedAt);

    if (!storedPresenceId) {
      localStorage.setItem("guardianPresenceId", nextPresenceId);
    }

    if (!storedActivatedAt) {
      localStorage.setItem("guardianActivatedAt", nextActivatedAt);
    }

    if (ownerName) localStorage.setItem("guardianOwnerName", ownerName);
    if (householdName) localStorage.setItem("guardianHouseholdName", householdName);
    if (phone) localStorage.setItem("guardianContactInfo", phone);

    const timer = window.setTimeout(() => {
      setIsReady(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [ownerName, householdName, phone]);

  function handleEnterGuardian() {
    navigate("/planet/guardian-household", {
      state: {
        fromActivation: true,
        guardianProfile: {
          name: householdName || ownerName || "Guardian Protected Profile",
          type:
            protectionType === "elder"
              ? "elder"
              : protectionType === "medical"
                ? "medical"
                : "child",
        },
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#020611] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] items-center justify-center px-4 py-6 md:px-6 lg:px-8">
        <div className="w-full overflow-hidden rounded-[30px] border border-emerald-500/18 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_rgba(2,6,17,0.96)_38%)] shadow-[0_0_0_1px_rgba(16,185,129,0.05),0_22px_70px_rgba(0,0,0,0.5)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                  Guardian activated
                </span>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                  Presence first
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                Your Guardian system is live.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Payment is done. Presence is created. Guardian is ready. This page should only
                confirm activation and hand the user directly into the live dashboard.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    System
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">{planLabel}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    Activated and ready to enter.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Presence ID
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {presenceId || "Preparing..."}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Guardian truth anchor created.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Activated at
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {activatedAt ? new Date(activatedAt).toLocaleString() : "Creating timestamp..."}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Activation moment locked.
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-cyan-500/20 bg-cyan-500/10 p-5">
                <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-100">
                  Next move
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  Enter the live Guardian dashboard
                </div>
                <div className="mt-2 text-sm leading-7 text-cyan-50/85">
                  Do not make the user build from scratch here. Drop them into the real Guardian
                  home so the system feels alive immediately.
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="rounded-[26px] border border-white/10 bg-black/25 p-5">
                <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  Activation handoff
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-emerald-500/18 bg-emerald-500/10 p-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-200">
                      Status
                    </div>
                    <div className="mt-1 text-base font-semibold text-white">
                      {isReady ? "System ready" : "Preparing Guardian..."}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                      Owner
                    </div>
                    <div className="mt-1 text-base font-semibold text-white">
                      {ownerName || "Not provided"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                      Household
                    </div>
                    <div className="mt-1 text-base font-semibold text-white">
                      {householdName || "Guardian household"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                      Contact
                    </div>
                    <div className="mt-1 text-base font-semibold text-white">
                      {phone || email || "Not provided"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                      Protection type
                    </div>
                    <div className="mt-1 text-base font-semibold text-white">
                      {protectionType || "Mixed / household"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleEnterGuardian}
                  className="mt-5 w-full rounded-2xl border border-cyan-400/25 bg-cyan-500/12 px-5 py-4 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/18"
                >
                  Enter Guardian dashboard
                </button>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-6 text-slate-400">
                  This page is now only a handoff. The real Guardian experience begins inside the
                  live dashboard.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
