import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { emitDemoOverlay } from "../subsystems/creatorDemo/bus";

/**
 * BaysFlow — Mechanic Resident surface
 * Phase 1: Bays Board + BayCam Hook Points
 * Phase 2: Emit Creator Demo overlays (telemetry-like, cinematic)
 */

type JobPhase = "intake" | "diagnose" | "estimate" | "approved" | "in_progress" | "done";

type Bay = {
  id: string;
  label: string;
  activeJob?: {
    jobId: string;
    customer: string;
    vehicle: string;
    phase: JobPhase;
    lastEventAt: number;
    notes?: string;
  };
};

function makeJobId() {
  return `JOB-${Math.floor(1000 + Math.random() * 9000)}`;
}

function fmt(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts);
  }
}

function nextPhase(p: JobPhase): JobPhase {
  const order: JobPhase[] = ["intake", "diagnose", "estimate", "approved", "in_progress", "done"];
  const i = order.indexOf(p);
  return order[Math.min(i + 1, order.length - 1)];
}

function ensureJob(bay: Bay) {
  if (bay.activeJob) return bay;
  const now = Date.now();
  return {
    ...bay,
    activeJob: {
      jobId: makeJobId(),
      customer: "New Customer",
      vehicle: "Vehicle",
      phase: "intake",
      lastEventAt: now,
      notes: "",
    },
  };
}

export default function BaysFlow() {
  const [bays, setBays] = useState<Bay[]>([
    { id: "bay_1", label: "Bay 1" },
    { id: "bay_2", label: "Bay 2" },
    { id: "bay_3", label: "Bay 3" },
    { id: "bay_4", label: "Bay 4" },
  ]);

  const [selectedBayId, setSelectedBayId] = useState("bay_1");

  const selectedBay = useMemo(() => bays.find((b) => b.id === selectedBayId) ?? bays[0], [bays, selectedBayId]);

  function updateBay(bayId: string, patch: (b: Bay) => Bay) {
    setBays((prev) => prev.map((b) => (b.id === bayId ? patch(b) : b)));
  }

  function setPhase(bayId: string, phase: JobPhase) {
    updateBay(bayId, (b) => {
      const bb = ensureJob(b);
      const now = Date.now();

      emitDemoOverlay({
        kind: "handle_detected",
        label: `Bay update: ${bb.label} → phase = ${phase}`,
        meta: { bayId, jobId: bb.activeJob!.jobId, phase },
      });

      emitDemoOverlay({
        kind: "presence_timestamp",
        label: `Presence Timestamp Recorded — ${bb.label}`,
        meta: { bayId, jobId: bb.activeJob!.jobId },
      });

      return { ...bb, activeJob: { ...bb.activeJob!, phase, lastEventAt: now } };
    });
  }

  function advancePhase(bayId: string) {
    const bay = bays.find((b) => b.id === bayId);
    if (!bay) return;
    const bb = ensureJob(bay);
    setPhase(bayId, nextPhase(bb.activeJob!.phase));
  }

  function captureSnapshot(bayId: string) {
    const bay = bays.find((b) => b.id === bayId);
    if (!bay) return;
    const bb = ensureJob(bay);
    const now = Date.now();

    emitDemoOverlay({
      kind: "export_packet_updated",
      label: `Snapshot captured — ${bb.label} (${bb.activeJob!.jobId})`,
      meta: { bayId, jobId: bb.activeJob!.jobId, kind: "snapshot" },
    });

    updateBay(bayId, (b) => {
      const b2 = ensureJob(b);
      return { ...b2, activeJob: { ...b2.activeJob!, lastEventAt: now } };
    });
  }

  function captureClip(bayId: string) {
    const bay = bays.find((b) => b.id === bayId);
    if (!bay) return;
    const bb = ensureJob(bay);
    const now = Date.now();

    emitDemoOverlay({
      kind: "part_added",
      label: `BayCam clip saved — ${bb.label} (10s)`,
      meta: { bayId, jobId: bb.activeJob!.jobId, seconds: 10 },
    });

    updateBay(bayId, (b) => {
      const b2 = ensureJob(b);
      return { ...b2, activeJob: { ...b2.activeJob!, lastEventAt: now } };
    });
  }

  function startJob(bayId: string) {
    updateBay(bayId, (b) => {
      const bb = ensureJob(b);
      emitDemoOverlay({
        kind: "payment_cap_authorized",
        label: `Job started — ${bb.label} (${bb.activeJob!.jobId})`,
        meta: { bayId, jobId: bb.activeJob!.jobId },
      });
      return bb;
    });
  }

  const job = selectedBay?.activeJob;

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px", color: "#fff" }}>
      <h2 style={{ marginBottom: 6 }}>Bays</h2>
      <p style={{ opacity: 0.65, marginBottom: 14 }}>
        Bays Board + BayCam hook points. Emits Creator Demo overlays when actions happen.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 12 }}>
        <div style={card}>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>Bays</div>

          <div style={{ display: "grid", gap: 8 }}>
            {bays.map((b) => {
              const active = b.id === selectedBayId;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBayId(b.id)}
                  style={{
                    ...bayBtn,
                    background: active ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
                    opacity: active ? 1 : 0.9,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 700 }}>{b.label}</div>
                    <div style={{ fontSize: 12, opacity: 0.75 }}>
                      {b.activeJob ? b.activeJob.phase : "empty"}
                    </div>
                  </div>
                  {b.activeJob && (
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                      {b.activeJob.jobId} • last: {fmt(b.activeJob.lastEventAt)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{selectedBay?.label}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {job ? `${job.jobId} • phase: ${job.phase}` : "No job in this bay yet."}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <a href="/demo" style={{ ...linkBtn, textDecoration: "none" }}>Open /demo</a>
            </div>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={btn} onClick={() => startJob(selectedBayId)}>Start job</button>
            <button style={btn} onClick={() => advancePhase(selectedBayId)}>Advance phase</button>
            <button style={btnGhost} onClick={() => captureSnapshot(selectedBayId)}>Snapshot</button>
            <button style={btnGhost} onClick={() => captureClip(selectedBayId)}>Clip (10s)</button>
          </div>

          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.65 }}>
            Tip: Open <b>/demo</b> in another tab. Click buttons here. Watch overlays appear live.
          </div>
        </div>
      </div>
    </div>
  );
}

/* styles */
const card: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.35)",
  padding: 14,
  color: "#fff",
};

const bayBtn: CSSProperties = {
  width: "100%",
  textAlign: "left",
  padding: "10px 10px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#fff",
  cursor: "pointer",
};

const btn: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  cursor: "pointer",
};

const btnGhost: CSSProperties = {
  ...btn,
  background: "transparent",
  opacity: 0.9,
};

const linkBtn: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "transparent",
  color: "#fff",
  opacity: 0.9,
};
