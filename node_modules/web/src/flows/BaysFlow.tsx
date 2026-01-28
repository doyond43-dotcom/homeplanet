import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import ResidentHeader from "../components/ResidentHeader";

type JobPhase = "intake" | "diagnose" | "estimate" | "approved" | "in_progress" | "done";

type BayJob = {
  jobId: string;
  customer: string;
  vehicle: string;
  phase: JobPhase;
  lastEventAt: number;
  notes?: string;
};

type Bay = {
  id: string;
  label: string;
  activeJob?: BayJob;
};
function fmt(ts: number) {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return String(ts);
  }
}

const PHASES: JobPhase[] = ["intake", "diagnose", "estimate", "approved", "in_progress", "done"];

function nextPhase(p: JobPhase): JobPhase {
  const i = PHASES.indexOf(p);
  return PHASES[Math.min(i + 1, PHASES.length - 1)];
}

function phaseLabel(p: JobPhase) {
  switch (p) {
    case "in_progress":
      return "IN-PROGRESS";
    default:
      return p.toUpperCase();
  }
}

function emitOverlay(kind: any, label: string, meta?: Record<string, any>) {
  const payload = { ts: Date.now(), kind, label, meta };

  // 1) same-tab listener
  try {
    window.dispatchEvent(new CustomEvent("hp_demo_overlay", { detail: payload }));
  } catch {}

  // 2) cross-tab listener (open /demo in another tab)
  try {
    const bc = new BroadcastChannel("hp_demo_overlay");
    bc.postMessage(payload);
    bc.close();
  } catch {}
}

export default function BaysFlow() {
  const [bays, setBays] = useState<Bay[]>([
    { id: "bay_1", label: "Bay 1" },
    { id: "bay_2", label: "Bay 2" },
    { id: "bay_3", label: "Bay 3" },
    { id: "bay_4", label: "Bay 4" },
  ]);

  const [selectedBayId, setSelectedBayId] = useState("bay_1");
  const [pulse, setPulse] = useState(0);

  const pulseTimer = useRef<number | null>(null);

  const selectedBay = useMemo(
    () => bays.find((b) => b.id === selectedBayId) ?? bays[0],
    [bays, selectedBayId]
  );

  const job = selectedBay?.activeJob;

  useEffect(() => {
    return () => {
      if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    };
  }, []);

  function firePulse() {
    setPulse((p) => p + 1);
    if (pulseTimer.current) window.clearTimeout(pulseTimer.current);
    pulseTimer.current = window.setTimeout(() => setPulse((p) => p + 1), 350);
  }

  function startJob(bayId: string) {
    const now = Date.now();
    const jobId = `JOB-${Math.floor(1000 + Math.random() * 9000)}`;

    setBays((prev) =>
      prev.map((b) =>
        b.id !== bayId
          ? b
          : {
              ...b,
              activeJob: {
                jobId,
                customer: "New Customer",
                vehicle: "Vehicle",
                phase: "intake",
                lastEventAt: now,
                notes: "",
              },
            }
      )
    );

    emitOverlay("bay_job_started", `Bay ${bayId.split("_")[1]} — Job started (${jobId})`, { bayId, jobId });
    firePulse();
  }

  function advancePhase(bayId: string) {
    const now = Date.now();

    setBays((prev) =>
      prev.map((b) => {
        if (b.id !== bayId) return b;
        if (!b.activeJob) return b;

        const next = nextPhase(b.activeJob.phase);
        const updated: BayJob = { ...b.activeJob, phase: next, lastEventAt: now };

        emitOverlay("bay_phase_change", `Bay ${bayId.split("_")[1]} — Phase → ${phaseLabel(next)}`, {
          bayId,
          jobId: b.activeJob.jobId,
          phase: next,
        });

        return { ...b, activeJob: updated };
      })
    );

    firePulse();
  }

  function snapshot(bayId: string) {
    const now = Date.now();
    const b = bays.find((x) => x.id === bayId);
    if (!b?.activeJob) return;

    emitOverlay("bay_snapshot", `Bay ${bayId.split("_")[1]} — Snapshot captured`, {
      bayId,
      jobId: b.activeJob.jobId,
      ts: now,
    });

    setBays((prev) =>
      prev.map((x) =>
        x.id === bayId && x.activeJob ? { ...x, activeJob: { ...x.activeJob, lastEventAt: now } } : x
      )
    );

    firePulse();
  }

  function clip(bayId: string) {
    const now = Date.now();
    const b = bays.find((x) => x.id === bayId);
    if (!b?.activeJob) return;

    emitOverlay("bay_clip", `Bay ${bayId.split("_")[1]} — Clip captured (10s)`, {
      bayId,
      jobId: b.activeJob.jobId,
      seconds: 10,
      ts: now,
    });

    setBays((prev) =>
      prev.map((x) =>
        x.id === bayId && x.activeJob ? { ...x, activeJob: { ...x.activeJob, lastEventAt: now } } : x
      )
    );

    firePulse();
  }

  function updateJobField(field: "customer" | "vehicle" | "notes", value: string) {
    setBays((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBayId) return b;
        if (!b.activeJob) return b;
        return { ...b, activeJob: { ...b.activeJob, [field]: value } };
      })
    );
  }

  function openDemo() {
    window.open("/demo", "_blank", "noopener,noreferrer");
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px", color: "#fff" }}>
      <ResidentHeader title="Bays" subtitle="Bays Board + BayCam hook points. Emits Creator Demo overlays live." backTo="/" links={[{ label: "Home", to: "/" }, { label: "Payments", to: "/payments" }, { label: "Demo", to: "/demo" }]} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, letterSpacing: 0.2 }}>Bays</h2>
          <div style={{ opacity: 0.7, marginTop: 6, fontSize: 13 }}>
            Bays Board + BayCam hook points. <span style={{ opacity: 0.85 }}>Emits Creator Demo overlays live.</span>
          </div>
        </div>

        <button type="button" style={btnPrimary} onClick={openDemo} title="Open /demo in a new tab">
          Open /demo
        </button>
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "320px 1fr", gap: 14 }}>
        {/* Left: bays list */}
        <div style={card}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>Bays</div>

          <div style={{ display: "grid", gap: 10 }}>
            {bays.map((b) => {
              const active = b.id === selectedBayId;
              const occupied = !!b.activeJob;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBayId(b.id)}
                  style={{
                    ...bayRow,
                    ...(active ? bayRowActive : null),
                    ...(occupied ? bayRowOccupied : null),
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ ...dot, background: occupied ? "rgba(120,255,170,0.95)" : "rgba(255,255,255,0.18)" }} />
                    <div style={{ fontWeight: 700 }}>{b.label}</div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, opacity: occupied ? 0.9 : 0.6, fontFamily: mono }}>
                      {occupied ? phaseLabel(b.activeJob!.phase) : "empty"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 14, fontSize: 12, opacity: 0.6 }}>
            Tip: Open <span style={{ fontFamily: mono }}>/demo</span> in another tab. Click actions here. Watch overlays appear.
          </div>
        </div>

        {/* Right: selected bay control */}
        <div style={cardWide}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 900 }}>{selectedBay.label}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {job ? (
                  <>
                    <span style={{ fontFamily: mono }}>{job.jobId}</span> • last event{" "}
                    <span style={{ fontFamily: mono }}>{fmt(job.lastEventAt)}</span>
                  </>
                ) : (
                  "No job in this bay yet."
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ ...pulseDot, opacity: pulse % 2 === 0 ? 0.15 : 0.85 }} />
              <span style={{ fontSize: 11, opacity: 0.65, fontFamily: mono }}>LIVE</span>
            </div>
          </div>

          {/* Phase rail */}
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PHASES.map((p) => {
              const current = job?.phase === p;
              const done = job ? PHASES.indexOf(p) < PHASES.indexOf(job.phase) : false;
              const future = job ? PHASES.indexOf(p) > PHASES.indexOf(job.phase) : true;

              return (
                <div
                  key={p}
                  style={{
                    ...phasePill,
                    ...(current ? phaseCurrent : null),
                    ...(done ? phaseDone : null),
                    ...(job ? null : phaseDisabled),
                    ...(future && job ? phaseFuture : null),
                  }}
                  title={p}
                >
      <ResidentHeader title="Bays" subtitle="Bays Board + BayCam hook points. Emits Creator Demo overlays live." backTo="/" links={[{ label: "Home", to: "/" }, { label: "Payments", to: "/payments" }, { label: "Demo", to: "/demo" }]} />
                  {phaseLabel(p)}
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {!job ? (
              <button type="button" style={btn} onClick={() => startJob(selectedBayId)}>
                Start job
              </button>
            ) : (
              <>
                <button type="button" style={btn} onClick={() => advancePhase(selectedBayId)}>
                  Advance phase
                </button>
                <button type="button" style={btnGhost} onClick={() => snapshot(selectedBayId)}>
                  Snapshot
                </button>
                <button type="button" style={btnGhost} onClick={() => clip(selectedBayId)}>
                  Clip (10s)
                </button>
              </>
            )}
          </div>

          {/* Job card */}
          {job && (
            <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Customer">
                  <input value={job.customer} onChange={(e) => updateJobField("customer", e.target.value)} style={input} />
                </Field>
                <Field label="Vehicle">
                  <input value={job.vehicle} onChange={(e) => updateJobField("vehicle", e.target.value)} style={input} />
                </Field>
              </div>

              <Field label="Notes (internal)">
                <input value={job.notes ?? ""} onChange={(e) => updateJobField("notes", e.target.value)} style={input} />
              </Field>

              <div style={{ fontSize: 12, opacity: 0.65 }}>
                BayCam hook points are ready: phase change, snapshot, and clip emit telemetry overlays immediately.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <ResidentHeader title="Bays" subtitle="Bays Board + BayCam hook points. Emits Creator Demo overlays live." backTo="/" links={[{ label: "Home", to: "/" }, { label: "Payments", to: "/payments" }, { label: "Demo", to: "/demo" }]} />
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      {children}
    </div>
  );
}

/* styles */
const mono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const card: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.35)",
  padding: 14,
  boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset, 0 18px 50px rgba(0,0,0,0.45)",
};

const cardWide: CSSProperties = {
  ...card,
  minHeight: 320,
};

const btnPrimary: CSSProperties = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.22)",
  background: "rgba(255,255,255,0.10)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const bayRow: CSSProperties = {
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.03)",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const bayRowActive: CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.18)",
};

const bayRowOccupied: CSSProperties = {
  boxShadow: "0 0 0 1px rgba(120,255,170,0.06) inset, 0 0 34px rgba(120,255,170,0.05)",
};

const dot: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 999,
  boxShadow: "0 0 16px rgba(255,255,255,0.08)",
};

const pulseDot: CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: 999,
  background: "rgba(120,255,170,0.95)",
  boxShadow: "0 0 18px rgba(120,255,170,0.20)",
  transition: "opacity 220ms ease",
};

const btn: CSSProperties = {
  padding: "9px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.12)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const btnGhost: CSSProperties = {
  ...btn,
  background: "transparent",
  opacity: 0.92,
};

const phasePill: CSSProperties = {
  padding: "7px 10px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  fontSize: 11,
  fontFamily: mono,
  letterSpacing: 0.35,
  opacity: 0.75,
};

const phaseCurrent: CSSProperties = {
  opacity: 1,
  background: "rgba(120,255,170,0.10)",
  border: "1px solid rgba(120,255,170,0.35)",
  boxShadow: "0 0 24px rgba(120,255,170,0.08)",
};

const phaseDone: CSSProperties = {
  opacity: 0.85,
  background: "rgba(255,255,255,0.06)",
};

const phaseFuture: CSSProperties = {
  opacity: 0.55,
};

const phaseDisabled: CSSProperties = {
  opacity: 0.35,
};

const input: CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  padding: "8px 10px",
};




