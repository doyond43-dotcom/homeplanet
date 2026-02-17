import React, { useEffect, useMemo, useState } from "react";

type DemoAtom = {
  id: string;
  type: "moving_beacon";
  label: string;
  street: string;
  direction: "toward" | "away";
  etaSeconds: number;
  confidence: number; // 0..1
};

function getDemoFlag(): boolean {
  try {
    const p = new URLSearchParams(window.location.search);
    return p.get("demo") === "truck";
  } catch {
    return false;
  }
}

export default function AtmosphereDemoStrip() {
  const [atom, setAtom] = useState<DemoAtom | null>(null);
  const [open, setOpen] = useState(false);

  // Trigger: ?demo=truck
  useEffect(() => {
    if (!getDemoFlag()) return;

    // Create a “passing truck” that lasts ~70 seconds
    setAtom({
      id: "demo-truck-1",
      type: "moving_beacon",
      label: "Ice Cream Truck",
      street: "Maple St",
      direction: "toward",
      etaSeconds: 45,
      confidence: 0.72,
    });

    setOpen(false);
  }, []);

  // Countdown + fade out
  useEffect(() => {
    if (!atom) return;

    const timer = setInterval(() => {
      setAtom((prev) => {
        if (!prev) return null;
        const nextEta = prev.etaSeconds - 1;
        if (nextEta <= -25) return null; // dissolve after it “passes”
        return { ...prev, etaSeconds: nextEta, confidence: Math.max(0.35, prev.confidence - 0.003) };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [atom?.id]);

  const display = useMemo(() => {
    if (!atom) return null;

    const eta = atom.etaSeconds;
    const etaText =
      eta > 0 ? `~${eta}s` :
      eta === 0 ? "arriving" :
      eta > -10 ? "passing now" :
      "just passed";

    const arrow =
      atom.direction === "toward" ? "→ toward you" : "← away from you";

    const badge =
      atom.confidence >= 0.85 ? "Anchored" :
      atom.confidence >= 0.70 ? "Real" :
      atom.confidence >= 0.50 ? "Emerging" :
      "Ghost";

    return { etaText, arrow, badge };
  }, [atom]);

  if (!atom || !display) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50">
      {/* Strip */}
      <div className="mx-auto max-w-6xl px-4 pt-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/75 backdrop-blur px-4 py-3 text-left shadow"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-300 animate-pulse" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-100 truncate">
                  Passing Nearby
                  <span className="ml-2 text-xs font-medium text-slate-300">
                    {atom.label}
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate">
                  {atom.street} → {display.etaText}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-flex items-center rounded-full border border-slate-700 bg-slate-950/50 px-2.5 py-1 text-[11px] text-slate-200">
                {display.badge}
              </span>
              <span className="text-slate-400 text-sm">{open ? "▴" : "▾"}</span>
            </div>
          </div>
        </button>

        {/* Expand panel */}
        {open && (
          <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-950/75 backdrop-blur p-4 shadow">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-100">
                  {atom.label}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Moving along {atom.street} • {display.arrow}
                </div>
                <div className="mt-2 text-sm text-slate-200">
                  ETA: <span className="font-semibold">{display.etaText}</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  Demo mode: add <span className="font-mono">?demo=truck</span> to any URL to replay
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 transition"
                  onClick={() => alert("WATCH (demo): short intercept prediction would start here.")}
                >
                  Watch
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-900 transition"
                  onClick={() => alert("SIGNAL (demo): a soft ping like 'someone waiting ahead' would send here.")}
                >
                  Signal
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-800 bg-transparent px-4 py-2 text-sm font-semibold text-slate-300 hover:text-slate-100 transition"
                  onClick={() => { setOpen(false); }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spacer so your top bar isn't covered */}
      <div className="h-20" />
    </div>
  );
}
