import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

/**
 * BaysFlow — Mechanic Resident surface
 * Phase 1: Bays Board + BayCam Hook Points (no real camera yet)
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

type BayCamEvent = {
  id: string;
  ts: number;
  bayId: string;
  jobId: string;
  kind: "phase_change" | "snapshot" | "clip";
  meta: Record<string, any>;
};

function makeId(prefix = "id") {
  const c: any = typeof globalThis !== "undefined" ? (globalThis as any).crypto : undefined;
  return c?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
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

export default function BaysFlow() {
  const [bays, setBays] = useState<Bay[]>([
    { id: "bay_1", label: "Bay 1" },
    { id: "bay_2", label: "Bay 2" },
    { id: "bay_3", label: "Bay 3" },
    { id: "bay_4", label: "Bay 4" },
  ]);

  const [events, setEvents] = useState<BayCamEvent[]>([]);
  const [selectedBayId, setSelectedBayId] = useState("bay_1");

  const selectedBay = useMemo(
    () => bays.find((b) => b.id === selectedBayId) ?? bays[0],
    [bays, selectedBayId]
  );

  function pushEvent(e: Omit<BayCamEvent, "id">) {
    const evt: BayCamEvent = { id: makeId("evt"), ...e };
    setEvents((prev) => [evt, ...prev]);
  }

  function ensureJob(bay: Bay) {
    if (bay.activeJob) return bay;
    const now = Date.now();
    return {
      ...bay,
      activeJob: {
        jobId: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: "New Customer",
        vehicle: "Vehicle",
        phase: "intake",
        lastEventAt: now,
        notes: "",
      },
    };
  }

  function setPhase(bayId: string, phase: JobPhase) {
    setBays((prev) =>
      prev.map((b) => {
        if (b.id !== bayId) return b;
        const bb = ensureJob(b);
        const now = Date.now();

        pushEvent({
          ts: now,
          bayId,
          jobId: bb.activeJob!.jobId,
          kind: "phase_change",
          meta: { phase },
        });

        return { ...bb, activeJob: { ...bb.activeJob!, phase, lastEventAt: now } };
      })
    );
  }

  function captureSnapshot(bayId: string) {
    const bay = bays.find((b) => b.id === bayId);
    if (!bay) return;
    const bb = ensureJob(bay);
    const now = Date.now();

    pushEvent({
      ts: now,
      bayId,
      jobId: bb.activeJob!.jobId,
      kind: "snapshot",
      meta: { note: "placeholder" },
    });

    setBays((prev) =>
      prev.map((b) =>
        b.id === bayId ? { ...bb, activeJob: { ...bb.activeJob!, lastEventAt: now } } : b
      )
    );
  }

  function captureClip(bayId: string) {
    const bay = bays.find((b) => b.id === bayId);
    if (!bay) return;
    const bb = ensureJob(bay);
    const now = Date.now();

    pushEvent({
      ts: now,
      bayId,
      jobId: bb.activeJob!.jobId,
      kind: "clip",
      meta: { seconds: 10 },
    });

    setBays((prev) =>
      prev.map((b) =>
        b.id === bayId ? { ...bb, activeJob: { ...bb.activeJob!, lastEventAt: now } } : b
      )
    );
  }

  return <div style={{ color: "#fff" }}>Bays Board ready.</div>;
}
