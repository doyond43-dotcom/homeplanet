import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buildMySystemModules } from "../lib/homePlanetRegistry";

type StoredSystem = {
  businessName?: string;
  businessType?: string;
  pillar?: string;
  selectedModules?: string[];
};

export default function HomePlanetBuildSequencePage() {
  const navigate = useNavigate();
  const { slug = "" } = useParams();

  const [completedCount, setCompletedCount] = useState(0);
  const [systemReady, setSystemReady] = useState(false);

  const storedSystem = useMemo<StoredSystem>(() => {
    try {
      const raw = localStorage.getItem(`hp-system:${slug}`);

      if (!raw) return {};

      return JSON.parse(raw) as StoredSystem;
    } catch {
      return {};
    }
  }, [slug]);

  const businessName =
    storedSystem.businessName?.trim() || "Your HomePlanet System";

  const businessType =
    storedSystem.businessType?.trim() || "Business";

  const selectedIds = storedSystem.selectedModules ?? [];

  const selectedModules = useMemo(
    () =>
      buildMySystemModules.filter((module) =>
        selectedIds.includes(module.id)
      ),
    [selectedIds]
  );

  useEffect(() => {
    setCompletedCount(0);
    setSystemReady(false);

    if (selectedModules.length === 0) {
      setSystemReady(true);
      return;
    }

    let current = 0;

    const timer = window.setInterval(() => {
      current += 1;
      setCompletedCount(current);

      if (current >= selectedModules.length) {
        window.clearInterval(timer);

        window.setTimeout(() => {
          setSystemReady(true);
        }, 650);
      }
    }, 700);

    return () => window.clearInterval(timer);
  }, [selectedModules.length]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#020504] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="absolute bottom-[-12rem] right-[-10rem] h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      <section className="relative mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
            <LoaderCircle
              size={15}
              className={systemReady ? "" : "animate-spin"}
            />
            HomePlanet Build Sequence
          </div>

          <h1 className="mt-7 text-4xl font-black tracking-[-0.045em] sm:text-6xl">
            {businessName}
          </h1>

          <p className="mt-4 text-base text-white/55 sm:text-lg">
            {systemReady
              ? "Your starting HomePlanet system is ready."
              : "HomePlanet is connecting the pieces you selected."}
          </p>

          <p className="mt-3 text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
            {systemReady ? "System Ready" : "Building Your System..."}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {selectedModules.map((module, index) => {
            const complete = index < completedCount;
            const active =
              !systemReady &&
              index === completedCount &&
              completedCount < selectedModules.length;

            return (
              <div
                key={module.id}
                className={`flex min-h-[76px] items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-all duration-500 ${
                  complete
                    ? "border-emerald-300/45 bg-emerald-300/[0.09]"
                    : active
                      ? "border-emerald-300/30 bg-emerald-300/[0.045]"
                      : "border-white/10 bg-white/[0.025]"
                }`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border ${
                      complete
                        ? "border-emerald-300 bg-emerald-300 text-black"
                        : active
                          ? "border-emerald-300/50 text-emerald-300"
                          : "border-white/10 text-white/20"
                    }`}
                  >
                    {complete ? (
                      <Check size={17} strokeWidth={3} />
                    ) : active ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`font-black ${
                        complete || active
                          ? "text-white"
                          : "text-white/35"
                      }`}
                    >
                      {module.name}
                    </p>

                    <p className="mt-1 line-clamp-1 text-sm text-white/35">
                      {module.description}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 text-xs font-black uppercase tracking-[0.16em] ${
                    complete
                      ? "text-emerald-300"
                      : active
                        ? "text-emerald-300/70"
                        : "text-white/15"
                  }`}
                >
                  {complete
                    ? "Connected"
                    : active
                      ? "Connecting"
                      : "Waiting"}
                </span>
              </div>
            );
          })}
        </div>

        {systemReady && (
          <section className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-emerald-300/30 bg-emerald-300/[0.07] p-6 text-center sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
              System Ready
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {businessName} is ready.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/50">
              {selectedModules.length} connected piece
              {selectedModules.length === 1 ? "" : "s"} built around{" "}
              {businessType}.
            </p>

            <button
              type="button"
              onClick={() => navigate(`/planet/system/${slug}`)}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-6 py-4 text-sm font-black text-black transition hover:bg-emerald-200 sm:w-auto"
            >
              Open My System
              <ArrowRight size={18} />
            </button>
          </section>
        )}
      </section>
    </main>
  );
}