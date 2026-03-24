// src/pages/TransportationDemoBoard.tsx
import { useMemo, useState } from "react";

type RideStage =
  | "New Request"
  | "Driver Assigned"
  | "Driver En Route"
  | "Passenger Picked Up"
  | "Trip Complete"
  | "Archived";

type TripRecordKind =
  | "gps"
  | "receipt"
  | "signature"
  | "note"
  | "dashcam"
  | "payment"
  | "other";

type TripTimelineEvent = {
  id: string;
  time: string;
  title: string;
  summary: string;
  source: string;
  kind: TripRecordKind;
  createdAt: string;
};

type TripRecord = {
  id: string;
  name: string;
  kind: TripRecordKind;
  source: string;
  addedAt: string;
};

type DriverItem = {
  id: string;
  name: string;
  vehicle: string;
  plate: string;
  status: string;
};

type RideIssue = {
  id: string;
  text: string;
};

type RideRequest = {
  id: string;
  passengerName: string;
  summary: string;
  stage: RideStage;
  tripNumber?: string;
  pickupLocation: string;
  dropoffLocation: string;
  rideDate: string;
  rideTime: string;
  passengerCount: number;
  assignedDriver?: string;
  vehicle?: string;
  phone?: string;
  updatedAt: string;
  sourceAnchor?: string;
  timeline: TripTimelineEvent[];
  records: TripRecord[];
  drivers: DriverItem[];
  issues: RideIssue[];
  notes: string;
  meta?: Record<string, any>;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function makeId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function safeToast(msg: string) {
  try {
    alert(msg);
  } catch {
    /* noop */
  }
}

function reactKey(...parts: Array<any>) {
  return parts
    .map((p) => (p === undefined || p === null || p === "" ? "_" : String(p)))
    .join("__");
}

async function copyToClipboard(text: string) {
  const val = (text || "").trim();
  if (!val) {
    safeToast("Nothing to copy.");
    return;
  }

  try {
    await navigator.clipboard.writeText(val);
    safeToast("Copied.");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = val;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      safeToast("Copied.");
    } catch {
      safeToast("Copy failed.");
    } finally {
      document.body.removeChild(ta);
    }
  }
}

function safeDateLabel(isoLike: any) {
  try {
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function safeTimeLabel(isoLike: any) {
  try {
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function stageTone(stage: RideStage) {
  switch (stage) {
    case "New Request":
      return {
        lane: "border-l-cyan-400/70",
        pill: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
      };
    case "Driver Assigned":
      return {
        lane: "border-l-amber-300/70",
        pill: "border-amber-300/30 bg-amber-400/10 text-amber-100",
      };
    case "Driver En Route":
      return {
        lane: "border-l-violet-400/70",
        pill: "border-violet-400/30 bg-violet-500/10 text-violet-100",
      };
    case "Passenger Picked Up":
      return {
        lane: "border-l-fuchsia-400/70",
        pill: "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-100",
      };
    case "Trip Complete":
      return {
        lane: "border-l-emerald-400/70",
        pill: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
      };
    case "Archived":
      return {
        lane: "border-l-white/20",
        pill: "border-white/10 bg-white/5 text-white/70",
      };
    default:
      return {
        lane: "border-l-cyan-400/70",
        pill: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
      };
  }
}

function coerceStage(s: any): RideStage {
  const v = (s || "").toString();
  const ok: RideStage[] = [
    "New Request",
    "Driver Assigned",
    "Driver En Route",
    "Passenger Picked Up",
    "Trip Complete",
    "Archived",
  ];
  return ok.includes(v as RideStage) ? (v as RideStage) : "New Request";
}

function buildRideText(ride: RideRequest) {
  return [
    `SUMMIT RIDE DEMO — RIDE TEXT`,
    `Passenger: ${ride.passengerName || "-"}`,
    `Trip #: ${ride.tripNumber || "-"}`,
    `Pickup: ${ride.pickupLocation || "-"}`,
    `Dropoff: ${ride.dropoffLocation || "-"}`,
    `Ride Date: ${ride.rideDate || "-"}`,
    `Ride Time: ${ride.rideTime || "-"}`,
    `Passengers: ${ride.passengerCount || 0}`,
    `Driver: ${ride.assignedDriver || "-"}`,
    `Vehicle: ${ride.vehicle || "-"}`,
    `Phone: ${ride.phone || "-"}`,
    `Stage: ${ride.stage || "-"}`,
    `Source Anchor: ${ride.sourceAnchor || "Presence-first ride intake"}`,
  ].join("\n");
}

function buildTripSummary(ride: RideRequest) {
  const timeline = ride.timeline
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .map(
      (t, idx) =>
        `${idx + 1}. ${t.time || "—"} — ${t.title}${t.summary ? ` — ${t.summary}` : ""}`
    )
    .join("\n");

  const records = ride.records
    .slice()
    .sort((a, b) => a.addedAt.localeCompare(b.addedAt))
    .map((r, idx) => `${idx + 1}. ${r.name} — ${r.kind} — ${r.source}`)
    .join("\n");

  const drivers = ride.drivers
    .map((d, idx) => `${idx + 1}. ${d.name} — ${d.vehicle} — ${d.plate} — ${d.status}`)
    .join("\n");

  const issues = ride.issues.map((i, idx) => `${idx + 1}. ${i.text}`).join("\n");

  return [
    `SUMMIT RIDE DEMO — DISPATCH SUMMARY`,
    ``,
    `Passenger: ${ride.passengerName}`,
    `Trip #: ${ride.tripNumber || "-"}`,
    `Pickup: ${ride.pickupLocation || "-"}`,
    `Dropoff: ${ride.dropoffLocation || "-"}`,
    `Ride Date: ${ride.rideDate || "-"}`,
    `Ride Time: ${ride.rideTime || "-"}`,
    `Passengers: ${ride.passengerCount || 0}`,
    `Driver: ${ride.assignedDriver || "-"}`,
    `Vehicle: ${ride.vehicle || "-"}`,
    `Current Stage: ${ride.stage}`,
    `Source Anchor: ${ride.sourceAnchor || "Presence-first ride intake"}`,
    ``,
    `SUMMARY`,
    ride.summary || "-",
    ``,
    `TIMELINE`,
    timeline || "-",
    ``,
    `OPERATIONAL RECORDS`,
    records || "-",
    ``,
    `DRIVER`,
    drivers || "-",
    ``,
    `ISSUES`,
    issues || "-",
    ``,
    `NOTES`,
    ride.notes?.trim() || "-",
  ].join("\n");
}

function seedRides(): RideRequest[] {
  const now = nowIso();

  return [
    {
      id: "ride_demo_1",
      passengerName: "Emily Rodriguez",
      summary: "Evening private ride from marina to resort with three passengers.",
      stage: "Driver Assigned",
      tripNumber: "HP-RIDE-001",
      pickupLocation: "Fort Pierce Marina",
      dropoffLocation: "Hutchinson Island Resort",
      rideDate: "2026-03-09",
      rideTime: "7:45 PM",
      passengerCount: 3,
      assignedDriver: "Marcus Lee",
      vehicle: "Lincoln Navigator",
      phone: "(772) 555-0184",
      updatedAt: now,
      sourceAnchor: "Presence-first ride intake",
      timeline: [
        {
          id: makeId(),
          time: "7:43 PM",
          title: "Ride requested",
          summary: "Customer ride request entered into dispatch board.",
          source: "Dispatcher intake",
          kind: "note",
          createdAt: now,
        },
        {
          id: makeId(),
          time: "7:44 PM",
          title: "Driver assigned",
          summary: "Marcus Lee assigned to trip.",
          source: "Dispatch assignment",
          kind: "other",
          createdAt: now,
        },
      ],
      records: [
        {
          id: makeId(),
          name: "initial_request_note",
          kind: "note",
          source: "Dispatcher entry",
          addedAt: now,
        },
        {
          id: makeId(),
          name: "payment_hold",
          kind: "payment",
          source: "Payment pre-auth",
          addedAt: now,
        },
      ],
      drivers: [
        {
          id: makeId(),
          name: "Marcus Lee",
          vehicle: "Lincoln Navigator",
          plate: "FL T7832",
          status: "Assigned",
        },
      ],
      issues: [{ id: makeId(), text: "Monitor marina pickup traffic." }],
      notes: "High-touch client ride.\nConfirm driver arrival messaging.\n",
      meta: {
        newRecordName: "",
        newRecordSource: "",
        newRecordKind: "note",
        newTimelineTitle: "",
        newTimelineSummary: "",
        newTimelineTime: "7:50 PM",
        newTimelineSource: "",
        newTimelineKind: "note",
        newDriverName: "",
        newDriverVehicle: "",
        newDriverPlate: "",
        newDriverStatus: "",
        newIssueText: "",
      },
    },
    {
      id: "ride_demo_2",
      passengerName: "John Martinez",
      summary: "Airport pickup with hotel drop-off for two passengers.",
      stage: "New Request",
      tripNumber: "HP-RIDE-002",
      pickupLocation: "Okeechobee Airport",
      dropoffLocation: "Lakeview Hotel",
      rideDate: "2026-03-09",
      rideTime: "4:20 PM",
      passengerCount: 2,
      assignedDriver: "",
      vehicle: "",
      phone: "(863) 555-0190",
      updatedAt: now,
      sourceAnchor: "Web ride request intake",
      timeline: [
        {
          id: makeId(),
          time: "4:12 PM",
          title: "Ride requested",
          summary: "Airport pickup request submitted.",
          source: "Customer ride form",
          kind: "note",
          createdAt: now,
        },
      ],
      records: [
        {
          id: makeId(),
          name: "request_submission",
          kind: "note",
          source: "Customer request",
          addedAt: now,
        },
      ],
      drivers: [],
      issues: [],
      notes: "Need driver assignment.\n",
      meta: {
        newRecordName: "",
        newRecordSource: "",
        newRecordKind: "note",
        newTimelineTitle: "",
        newTimelineSummary: "",
        newTimelineTime: "4:20 PM",
        newTimelineSource: "",
        newTimelineKind: "note",
        newDriverName: "",
        newDriverVehicle: "",
        newDriverPlate: "",
        newDriverStatus: "",
        newIssueText: "",
      },
    },
  ];
}

export default function TransportationDemoBoard() {
  const [rides, setRides] = useState<RideRequest[]>(() => seedRides());
  const [showPanels, setShowPanels] = useState(true);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(
    () => seedRides()[0]?.id || null
  );
  const [tripSummaryOpen, setTripSummaryOpen] = useState(true);

  const stages: RideStage[] = useMemo(
    () => [
      "New Request",
      "Driver Assigned",
      "Driver En Route",
      "Passenger Picked Up",
      "Trip Complete",
      "Archived",
    ],
    []
  );

  const selectedRide = useMemo(
    () => rides.find((r) => r.id === selectedRideId) || null,
    [rides, selectedRideId]
  );

  function updateRideOptimistic(rideId: string, patch: Partial<RideRequest>) {
    setRides((prev) =>
      prev.map((r) => (r.id === rideId ? { ...r, ...patch, updatedAt: nowIso() } : r))
    );
  }

  function setMetaValue(ride: RideRequest, key: string, value: any) {
    updateRideOptimistic(ride.id, {
      meta: { ...(ride.meta || {}), [key]: value },
    });
  }

  function setStage(rideId: string, stage: RideStage) {
    updateRideOptimistic(rideId, { stage });
  }

  function setNotes(ride: RideRequest, value: string) {
    updateRideOptimistic(ride.id, { notes: value });
  }

  function addRecord(
    ride: RideRequest,
    name: string,
    kind: TripRecordKind,
    source: string
  ) {
    const trimmedName = (name || "").trim();
    if (!trimmedName) return;

    const next: TripRecord = {
      id: makeId(),
      name: trimmedName,
      kind,
      source: (source || "Manual entry").trim() || "Manual entry",
      addedAt: nowIso(),
    };

    updateRideOptimistic(ride.id, { records: [next, ...ride.records] });
  }

  function removeRecord(ride: RideRequest, id: string) {
    updateRideOptimistic(ride.id, {
      records: ride.records.filter((x) => x.id !== id),
    });
  }

  function addTimelineEvent(
    ride: RideRequest,
    payload: {
      time: string;
      title: string;
      summary: string;
      source: string;
      kind: TripRecordKind;
    }
  ) {
    const title = (payload.title || "").trim();
    if (!title) return;

    const next: TripTimelineEvent = {
      id: makeId(),
      time: payload.time || "—",
      title,
      summary: (payload.summary || "").trim(),
      source: (payload.source || "Dispatch entry").trim() || "Dispatch entry",
      kind: payload.kind,
      createdAt: nowIso(),
    };

    updateRideOptimistic(ride.id, { timeline: [next, ...ride.timeline] });
  }

  function removeTimelineEvent(ride: RideRequest, id: string) {
    updateRideOptimistic(ride.id, {
      timeline: ride.timeline.filter((x) => x.id !== id),
    });
  }

  function addDriver(
    ride: RideRequest,
    name: string,
    vehicle: string,
    plate: string,
    status: string
  ) {
    const n = (name || "").trim();
    if (!n) return;

    const next: DriverItem = {
      id: makeId(),
      name: n,
      vehicle: (vehicle || "").trim(),
      plate: (plate || "").trim(),
      status: (status || "").trim() || "Assigned",
    };

    updateRideOptimistic(ride.id, { drivers: [next, ...ride.drivers] });
  }

  function removeDriver(ride: RideRequest, id: string) {
    updateRideOptimistic(ride.id, {
      drivers: ride.drivers.filter((x) => x.id !== id),
    });
  }

  function addIssue(ride: RideRequest, text: string) {
    const t = (text || "").trim();
    if (!t) return;

    const next: RideIssue = { id: makeId(), text: t };
    updateRideOptimistic(ride.id, { issues: [next, ...ride.issues] });
  }

  function removeIssue(ride: RideRequest, id: string) {
    updateRideOptimistic(ride.id, {
      issues: ride.issues.filter((x) => x.id !== id),
    });
  }

  function addRide() {
    const id = makeId();
    const next: RideRequest = {
      id,
      passengerName: "New Passenger",
      summary: "New private ride request.",
      stage: "New Request",
      tripNumber: `HP-RIDE-${Math.floor(Math.random() * 900 + 100)}`,
      pickupLocation: "Unassigned Pickup",
      dropoffLocation: "Unassigned Dropoff",
      rideDate: new Date().toISOString().slice(0, 10),
      rideTime: "6:00 PM",
      passengerCount: 1,
      assignedDriver: "",
      vehicle: "",
      phone: "",
      updatedAt: nowIso(),
      sourceAnchor: "Presence-first ride intake",
      timeline: [],
      records: [],
      drivers: [],
      issues: [],
      notes: "",
      meta: {
        newRecordName: "",
        newRecordSource: "",
        newRecordKind: "note",
        newTimelineTitle: "",
        newTimelineSummary: "",
        newTimelineTime: "6:05 PM",
        newTimelineSource: "",
        newTimelineKind: "note",
        newDriverName: "",
        newDriverVehicle: "",
        newDriverPlate: "",
        newDriverStatus: "",
        newIssueText: "",
      },
    };

    setRides((prev) => [next, ...prev]);
    setSelectedRideId(id);
  }

  function rideCounts(ride: RideRequest) {
    return {
      records: ride.records.length,
      timeline: ride.timeline.length,
      drivers: ride.drivers.length,
      issues: ride.issues.length,
    };
  }

  const ridesByStage = useMemo(() => {
    const map = new Map<RideStage, RideRequest[]>();
    for (const s of stages) map.set(s, []);
    for (const r of rides) map.get(coerceStage(r.stage))?.push(r);
    return map;
  }, [rides, stages]);

  const latestTimelineEvent = selectedRide
    ? selectedRide.timeline.slice().sort((a, b) => b.time.localeCompare(a.time))[0]
    : null;

  const activeRideCount = rides.filter((r) =>
    ["Driver Assigned", "Driver En Route", "Passenger Picked Up"].includes(
      coerceStage(r.stage)
    )
  ).length;

  const assignedCount = rides.filter((r) =>
    ["Driver Assigned", "Driver En Route", "Passenger Picked Up", "Trip Complete"].includes(
      coerceStage(r.stage)
    )
  ).length;

  const awaitingPickupCount = rides.filter((r) =>
    ["New Request", "Driver Assigned", "Driver En Route"].includes(coerceStage(r.stage))
  ).length;

  const completedCount = rides.filter(
    (r) => coerceStage(r.stage) === "Trip Complete"
  ).length;

  return (
    <div className="min-h-screen bg-[#07111b] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.08),_transparent_24%)]" />

        <div className="relative mx-auto max-w-[1680px] px-4 py-5 md:px-6 md:py-6">
          <header className="mb-4 rounded-[28px] border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Luxury Ride Demo
                </div>

                <h1 className="text-[32px] font-semibold tracking-tight text-white md:text-[40px]">
                  Summit Ride Demo — Dispatch &amp; Trip Timeline
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/65 md:text-base">
                  Ride intake • dispatch flow • trip timeline • operational records • summary preview
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                  onClick={() => setShowPanels((v) => !v)}
                >
                  {showPanels ? "Hide Lanes" : "Show Lanes"}
                </button>

                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                  onClick={addRide}
                >
                  + Add Ride
                </button>

                <button
                  type="button"
                  className="rounded-2xl border border-cyan-400/30 bg-cyan-500/12 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/18 disabled:opacity-50"
                  onClick={() => selectedRide && copyToClipboard(buildTripSummary(selectedRide))}
                  disabled={!selectedRide}
                >
                  Generate Trip Summary
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              <MetricCard
                label="Active Rides"
                value={String(activeRideCount)}
                helper="Trips in motion"
              />
              <MetricCard
                label="Drivers Assigned"
                value={String(assignedCount)}
                helper="Covered trips"
              />
              <MetricCard
                label="Awaiting Pickup"
                value={String(awaitingPickupCount)}
                helper="Not completed"
              />
              <MetricCard
                label="Completed Trips"
                value={String(completedCount)}
                helper="Finished rides"
              />
            </div>
          </header>

          {showPanels ? (
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {stages.map((s, stageIdx) => {
                const tone = stageTone(s);
                const list = ridesByStage.get(s) || [];

                return (
                  <div
                    key={reactKey("stage-lane", s, stageIdx)}
                    className={cn(
                      "rounded-[24px] border border-white/10 bg-white/[0.05] shadow-xl shadow-black/20 backdrop-blur",
                      tone.lane,
                      "border-l-4"
                    )}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 p-3">
                      <div className="text-sm font-extrabold text-white">{s}</div>
                      <div
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-xs font-bold",
                          tone.pill
                        )}
                      >
                        {list.length}
                      </div>
                    </div>

                    <div className="space-y-2 p-2">
                      {list.map((r, rideIdx) => (
                        <button
                          key={reactKey("ride-card", s, r.id, r.updatedAt, rideIdx)}
                          type="button"
                          onClick={() => setSelectedRideId(r.id)}
                          className={cn(
                            "w-full rounded-[18px] border px-3 py-3 text-left transition",
                            selectedRideId === r.id
                              ? "border-cyan-400/40 bg-cyan-500/10"
                              : "border-white/10 bg-[#111d2e] hover:bg-[#152338]"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-white">
                                {r.passengerName || "Unnamed Ride"}
                              </div>
                              <div className="mt-1 truncate text-xs text-white/65">
                                {r.pickupLocation || "-"}
                              </div>
                              <div className="mt-1 text-[11px] text-white/45">
                                {r.tripNumber || "-"} • {r.rideTime || "-"}
                              </div>
                            </div>

                            {selectedRideId === r.id ? (
                              <div className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-cyan-100">
                                Active
                              </div>
                            ) : null}
                          </div>
                        </button>
                      ))}
                      {list.length === 0 ? (
                        <div className="px-3 py-3 text-xs text-white/35">No rides</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-2 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-extrabold text-white">Dispatch Console</div>
                <div className="text-xs text-white/55">
                  Open a ride to review live dispatch, timeline, records, and trip summary
                </div>
              </div>

              {selectedRide ? (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white/90 transition hover:bg-white/10"
                    onClick={() => copyToClipboard(buildRideText(selectedRide))}
                  >
                    Copy Ride Text
                  </button>
                </div>
              ) : null}
            </div>

            {!selectedRide ? (
              <div className="p-4 text-sm text-white/55">Select a ride to open the drawer.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-[1fr_1fr_1fr]">
                <div className="space-y-4">
                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Current Trip</div>

                    <div className="mt-3 rounded-[20px] border border-white/10 bg-[#111d2e] p-3">
                      <div className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200/80">
                        Current Dispatch
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <InfoCard
                          label="Passenger"
                          value={selectedRide.passengerName || "-"}
                        />
                        <InfoCard
                          label="Status"
                          value={selectedRide.stage || "-"}
                        />
                        <InfoCard
                          label="Driver"
                          value={selectedRide.assignedDriver || "Unassigned"}
                        />
                        <InfoCard
                          label="Vehicle"
                          value={selectedRide.vehicle || "Unassigned"}
                        />
                      </div>
                    </div>

                    <div className="mt-3 space-y-3 text-sm">
                      <FieldLabel label="Passenger">
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          value={selectedRide.passengerName}
                          onChange={(e) =>
                            updateRideOptimistic(selectedRide.id, {
                              passengerName: e.target.value,
                            })
                          }
                        />
                      </FieldLabel>

                      <FieldLabel label="Summary">
                        <textarea
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          value={selectedRide.summary}
                          onChange={(e) =>
                            updateRideOptimistic(selectedRide.id, {
                              summary: e.target.value,
                            })
                          }
                          rows={4}
                        />
                      </FieldLabel>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <FieldLabel label="Trip #">
                          <input
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                            value={selectedRide.tripNumber || ""}
                            onChange={(e) =>
                              updateRideOptimistic(selectedRide.id, {
                                tripNumber: e.target.value,
                              })
                            }
                          />
                        </FieldLabel>

                        <FieldLabel label="Passengers">
                          <input
                            type="number"
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                            value={selectedRide.passengerCount}
                            onChange={(e) =>
                              updateRideOptimistic(selectedRide.id, {
                                passengerCount: Number(e.target.value || 0),
                              })
                            }
                          />
                        </FieldLabel>
                      </div>

                      <FieldLabel label="Pickup">
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          value={selectedRide.pickupLocation}
                          onChange={(e) =>
                            updateRideOptimistic(selectedRide.id, {
                              pickupLocation: e.target.value,
                            })
                          }
                        />
                      </FieldLabel>

                      <FieldLabel label="Dropoff">
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          value={selectedRide.dropoffLocation}
                          onChange={(e) =>
                            updateRideOptimistic(selectedRide.id, {
                              dropoffLocation: e.target.value,
                            })
                          }
                        />
                      </FieldLabel>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <FieldLabel label="Ride Date">
                          <input
                            type="date"
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                            value={selectedRide.rideDate}
                            onChange={(e) =>
                              updateRideOptimistic(selectedRide.id, {
                                rideDate: e.target.value,
                              })
                            }
                          />
                        </FieldLabel>

                        <FieldLabel label="Ride Time">
                          <input
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                            value={selectedRide.rideTime}
                            onChange={(e) =>
                              updateRideOptimistic(selectedRide.id, {
                                rideTime: e.target.value,
                              })
                            }
                          />
                        </FieldLabel>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <FieldLabel label="Assigned Driver">
                          <input
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                            value={selectedRide.assignedDriver || ""}
                            onChange={(e) =>
                              updateRideOptimistic(selectedRide.id, {
                                assignedDriver: e.target.value,
                              })
                            }
                          />
                        </FieldLabel>

                        <FieldLabel label="Vehicle">
                          <input
                            className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                            value={selectedRide.vehicle || ""}
                            onChange={(e) =>
                              updateRideOptimistic(selectedRide.id, {
                                vehicle: e.target.value,
                              })
                            }
                          />
                        </FieldLabel>
                      </div>

                      <FieldLabel label="Source Anchor">
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          value={selectedRide.sourceAnchor || ""}
                          onChange={(e) =>
                            updateRideOptimistic(selectedRide.id, {
                              sourceAnchor: e.target.value,
                            })
                          }
                        />
                      </FieldLabel>
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Current Stage</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {stages.map((s, idx) => (
                        <button
                          key={reactKey("stage-pill", selectedRide.id, s, idx)}
                          type="button"
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs font-extrabold transition",
                            coerceStage(selectedRide.stage) === s
                              ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-100"
                              : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
                          )}
                          onClick={() => setStage(selectedRide.id, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Live Status</div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <CountCard label="Records" value={rideCounts(selectedRide).records} />
                      <CountCard label="Timeline" value={rideCounts(selectedRide).timeline} />
                      <CountCard label="Drivers" value={rideCounts(selectedRide).drivers} />
                      <CountCard label="Issues" value={rideCounts(selectedRide).issues} />
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Current Dispatch</div>

                    <div className="mt-3 space-y-2 text-sm text-white/75">
                      <div>
                        <span className="text-cyan-200/80">Passenger:</span>{" "}
                        {selectedRide.passengerName || "-"}
                      </div>
                      <div>
                        <span className="text-cyan-200/80">Pickup:</span>{" "}
                        {selectedRide.pickupLocation || "-"}
                      </div>
                      <div>
                        <span className="text-cyan-200/80">Dropoff:</span>{" "}
                        {selectedRide.dropoffLocation || "-"}
                      </div>
                      <div>
                        <span className="text-cyan-200/80">Driver:</span>{" "}
                        {selectedRide.assignedDriver || "-"}
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-white/10 bg-[#111d2e] p-3">
                      <div className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200/80">
                        Latest Timeline Event
                      </div>
                      <div className="mt-2 text-sm font-bold text-white">
                        {latestTimelineEvent?.title || "No events yet"}
                      </div>
                      <div className="mt-1 text-xs text-white/45">
                        {latestTimelineEvent?.time || ""}
                      </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-4">
                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Operational Records</div>

                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                      <FieldLabel label="Name">
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                          value={(selectedRide.meta?.newRecordName || "").toString()}
                          onChange={(e) =>
                            setMetaValue(selectedRide, "newRecordName", e.target.value)
                          }
                          placeholder="gps_log_001"
                        />
                      </FieldLabel>

                      <FieldLabel label="Source">
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                          value={(selectedRide.meta?.newRecordSource || "").toString()}
                          onChange={(e) =>
                            setMetaValue(selectedRide, "newRecordSource", e.target.value)
                          }
                          placeholder="GPS / dispatcher / payment / driver"
                        />
                      </FieldLabel>

                      <FieldLabel label="Kind">
                        <select
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                          value={(selectedRide.meta?.newRecordKind || "note").toString()}
                          onChange={(e) =>
                            setMetaValue(selectedRide, "newRecordKind", e.target.value)
                          }
                        >
                          {[
                            "gps",
                            "receipt",
                            "signature",
                            "note",
                            "dashcam",
                            "payment",
                            "other",
                          ].map((k) => (
                            <option key={k} value={k} className="text-black">
                              {k}
                            </option>
                          ))}
                        </select>
                      </FieldLabel>
                    </div>

                    <div className="mt-3">
                      <button
                        type="button"
                        className="rounded-xl border border-cyan-400/30 bg-cyan-500/12 px-3 py-2 text-xs font-extrabold text-cyan-100 transition hover:bg-cyan-500/18"
                        onClick={() => {
                          addRecord(
                            selectedRide,
                            (selectedRide.meta?.newRecordName || "").toString(),
                            (selectedRide.meta?.newRecordKind || "note").toString() as TripRecordKind,
                            (selectedRide.meta?.newRecordSource || "").toString()
                          );

                          setMetaValue(selectedRide, "newRecordName", "");
                          setMetaValue(selectedRide, "newRecordSource", "");
                        }}
                      >
                        Add Record
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {selectedRide.records.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-[#111d2e] p-3 text-sm text-white/55">
                          No trip records yet.
                        </div>
                      ) : null}

                      {selectedRide.records.map((r, idx) => (
                        <div
                          key={reactKey("record-item", selectedRide.id, r.id, r.name, idx)}
                          className="flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-[#111d2e] p-3"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-white">
                              {r.name} <span className="text-cyan-200/80">({r.kind})</span>
                            </div>
                            <div className="mt-1 text-xs text-white/45">
                              {r.source} • {safeDateLabel(r.addedAt)} {safeTimeLabel(r.addedAt)}
                            </div>
                          </div>

                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/85 transition hover:bg-white/10"
                            onClick={() => removeRecord(selectedRide, r.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Trip Timeline</div>

                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <FieldLabel label="Time">
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                          value={(selectedRide.meta?.newTimelineTime || "").toString()}
                          onChange={(e) =>
                            setMetaValue(selectedRide, "newTimelineTime", e.target.value)
                          }
                          placeholder="7:50 PM"
                        />
                      </FieldLabel>

                      <FieldLabel label="Event Title">
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                          value={(selectedRide.meta?.newTimelineTitle || "").toString()}
                          onChange={(e) =>
                            setMetaValue(selectedRide, "newTimelineTitle", e.target.value)
                          }
                          placeholder="Driver arrived"
                        />
                      </FieldLabel>

                      <FieldLabel label="Source">
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                          value={(selectedRide.meta?.newTimelineSource || "").toString()}
                          onChange={(e) =>
                            setMetaValue(selectedRide, "newTimelineSource", e.target.value)
                          }
                          placeholder="dispatcher / GPS / driver"
                        />
                      </FieldLabel>

                      <FieldLabel label="Kind">
                        <select
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                          value={(selectedRide.meta?.newTimelineKind || "note").toString()}
                          onChange={(e) =>
                            setMetaValue(selectedRide, "newTimelineKind", e.target.value)
                          }
                        >
                          {[
                            "gps",
                            "receipt",
                            "signature",
                            "note",
                            "dashcam",
                            "payment",
                            "other",
                          ].map((k) => (
                            <option key={k} value={k} className="text-black">
                              {k}
                            </option>
                          ))}
                        </select>
                      </FieldLabel>

                      <FieldLabel label="Summary">
                        <textarea
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                          value={(selectedRide.meta?.newTimelineSummary || "").toString()}
                          onChange={(e) =>
                            setMetaValue(selectedRide, "newTimelineSummary", e.target.value)
                          }
                          placeholder="Short trip event summary"
                          rows={4}
                        />
                      </FieldLabel>

                      <div>
                        <button
                          type="button"
                          className="rounded-xl border border-cyan-400/30 bg-cyan-500/12 px-3 py-2 text-xs font-extrabold text-cyan-100 transition hover:bg-cyan-500/18"
                          onClick={() => {
                            addTimelineEvent(selectedRide, {
                              time: (selectedRide.meta?.newTimelineTime || "").toString(),
                              title: (selectedRide.meta?.newTimelineTitle || "").toString(),
                              summary: (selectedRide.meta?.newTimelineSummary || "").toString(),
                              source: (selectedRide.meta?.newTimelineSource || "").toString(),
                              kind: (selectedRide.meta?.newTimelineKind || "note").toString() as TripRecordKind,
                            });

                            setMetaValue(selectedRide, "newTimelineTitle", "");
                            setMetaValue(selectedRide, "newTimelineSummary", "");
                            setMetaValue(selectedRide, "newTimelineSource", "");
                          }}
                        >
                          Add Timeline Event
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {selectedRide.timeline.length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-[#111d2e] p-3 text-sm text-white/55">
                          No timeline events yet.
                        </div>
                      ) : null}

                      {selectedRide.timeline
                        .slice()
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((t, idx) => (
                          <div
                            key={reactKey("timeline-item", selectedRide.id, t.id, t.time, idx)}
                            className="rounded-xl border border-white/10 bg-[#111d2e] p-3"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200/80">
                                  {t.time || "—"}
                                </div>
                                <div className="mt-1 text-sm font-extrabold text-white">
                                  {t.title}
                                </div>
                                <div className="mt-1 text-xs text-white/45">
                                  {t.source} • {t.kind}
                                </div>
                                {t.summary ? (
                                  <div className="mt-2 text-sm text-white/70">{t.summary}</div>
                                ) : null}
                              </div>

                              <button
                                type="button"
                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/85 transition hover:bg-white/10"
                                onClick={() => removeTimelineEvent(selectedRide, t.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-4">
                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Driver Assignment</div>

                    <div className="mt-3 grid grid-cols-1 gap-3">
                      <input
                        className="rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                        value={(selectedRide.meta?.newDriverName || "").toString()}
                        onChange={(e) =>
                          setMetaValue(selectedRide, "newDriverName", e.target.value)
                        }
                        placeholder="Driver name"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                        value={(selectedRide.meta?.newDriverVehicle || "").toString()}
                        onChange={(e) =>
                          setMetaValue(selectedRide, "newDriverVehicle", e.target.value)
                        }
                        placeholder="Vehicle"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                        value={(selectedRide.meta?.newDriverPlate || "").toString()}
                        onChange={(e) =>
                          setMetaValue(selectedRide, "newDriverPlate", e.target.value)
                        }
                        placeholder="Plate"
                      />
                      <input
                        className="rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                        value={(selectedRide.meta?.newDriverStatus || "").toString()}
                        onChange={(e) =>
                          setMetaValue(selectedRide, "newDriverStatus", e.target.value)
                        }
                        placeholder="Status"
                      />
                      <button
                        type="button"
                        className="rounded-xl border border-cyan-400/30 bg-cyan-500/12 px-3 py-2 text-xs font-extrabold text-cyan-100 transition hover:bg-cyan-500/18"
                        onClick={() => {
                          addDriver(
                            selectedRide,
                            (selectedRide.meta?.newDriverName || "").toString(),
                            (selectedRide.meta?.newDriverVehicle || "").toString(),
                            (selectedRide.meta?.newDriverPlate || "").toString(),
                            (selectedRide.meta?.newDriverStatus || "").toString()
                          );
                          setMetaValue(selectedRide, "newDriverName", "");
                          setMetaValue(selectedRide, "newDriverVehicle", "");
                          setMetaValue(selectedRide, "newDriverPlate", "");
                          setMetaValue(selectedRide, "newDriverStatus", "");
                        }}
                      >
                        Add Driver
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {selectedRide.drivers.map((d, idx) => (
                        <div
                          key={reactKey("driver-item", selectedRide.id, d.id, d.name, idx)}
                          className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#111d2e] p-3"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-white">{d.name}</div>
                            <div className="text-xs text-white/55">
                              {d.vehicle} • {d.plate}
                            </div>
                            <div className="text-[11px] text-cyan-200/80">{d.status}</div>
                          </div>
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-extrabold text-white/85 transition hover:bg-white/10"
                            onClick={() => removeDriver(selectedRide, d.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Dispatch Issues</div>

                    <div className="mt-3">
                      <textarea
                        className="w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none"
                        value={(selectedRide.meta?.newIssueText || "").toString()}
                        onChange={(e) =>
                          setMetaValue(selectedRide, "newIssueText", e.target.value)
                        }
                        placeholder="Enter ride issue"
                        rows={3}
                      />
                      <button
                        type="button"
                        className="mt-2 rounded-xl border border-cyan-400/30 bg-cyan-500/12 px-3 py-2 text-xs font-extrabold text-cyan-100 transition hover:bg-cyan-500/18"
                        onClick={() => {
                          addIssue(
                            selectedRide,
                            (selectedRide.meta?.newIssueText || "").toString()
                          );
                          setMetaValue(selectedRide, "newIssueText", "");
                        }}
                      >
                        Add Issue
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {selectedRide.issues.map((i, idx) => (
                        <div
                          key={reactKey("issue-item", selectedRide.id, i.id, idx)}
                          className="flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-[#111d2e] p-3"
                        >
                          <div className="text-sm text-white">{i.text}</div>
                          <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-extrabold text-white/85 transition hover:bg-white/10"
                            onClick={() => removeIssue(selectedRide, i.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">Dispatcher Notes</div>

                    <textarea
                      className="mt-3 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
                      value={selectedRide.notes}
                      onChange={(e) => setNotes(selectedRide, e.target.value)}
                      placeholder="Dispatcher / operator notes"
                      rows={8}
                    />
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-extrabold text-white">
                        Dispatch Summary Preview
                      </div>
                      <button
                        type="button"
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/85 transition hover:bg-white/10"
                        onClick={() => setTripSummaryOpen((v) => !v)}
                      >
                        {tripSummaryOpen ? "Hide" : "Show"}
                      </button>
                    </div>

                    {tripSummaryOpen ? (
                      <>
                        <textarea
                          className="mt-3 w-full rounded-xl border border-white/10 bg-[#0b1422] px-3 py-2 text-xs text-white outline-none"
                          value={buildTripSummary(selectedRide)}
                          readOnly
                          rows={16}
                        />

                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded-xl border border-cyan-400/30 bg-cyan-500/12 px-3 py-2 text-xs font-extrabold text-cyan-100 transition hover:bg-cyan-500/18"
                            onClick={() => copyToClipboard(buildTripSummary(selectedRide))}
                          >
                            Copy Dispatch Summary
                          </button>
                        </div>
                      </>
                    ) : null}
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0c1623] p-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-200/80">
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-xs text-white/45">{helper}</div>
    </div>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#162136] p-3">
      <div className="text-xs text-cyan-200/80">{label}</div>
      <div className="mt-1 text-sm font-bold text-white">{value}</div>
    </div>
  );
}

function CountCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111d2e] p-3">
      <div className="text-xs text-cyan-200/80">{label}</div>
      <div className="mt-1 text-lg font-extrabold text-white">{value}</div>
    </div>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs font-bold text-cyan-200/80">{label}</div>
      {children}
    </div>
  );
}