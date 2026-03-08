// src/pages/TransportationDemoBoard.tsx
import { useMemo, useState } from "react";

type RideStage =
  | "New Request"
  | "Driver Assigned"
  | "Driver En Route"
  | "Passenger Picked Up"
  | "Trip Complete"
  | "Archived";

type TripRecordKind = "gps" | "receipt" | "signature" | "note" | "dashcam" | "payment" | "other";

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
    safeToast("Copy failed.");
  }
}

function safeDateLabel(isoLike: any) {
  try {
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "—";
  }
}

function safeTimeLabel(isoLike: any) {
  try {
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function stageTone(stage: RideStage) {
  switch (stage) {
    case "New Request":
      return {
        lane: "border-l-[#53c6ff]",
        pill: "border-[#53c6ff]/40 bg-[#53c6ff]/12 text-[#d9f5ff]",
      };
    case "Driver Assigned":
      return {
        lane: "border-l-[#d4ab54]",
        pill: "border-[#d4ab54]/40 bg-[#d4ab54]/12 text-[#fff2cf]",
      };
    case "Driver En Route":
      return {
        lane: "border-l-[#8a79ff]",
        pill: "border-[#8a79ff]/40 bg-[#8a79ff]/12 text-[#e8e1ff]",
      };
    case "Passenger Picked Up":
      return {
        lane: "border-l-[#ffb84d]",
        pill: "border-[#ffb84d]/40 bg-[#ffb84d]/12 text-[#fff1d7]",
      };
    case "Trip Complete":
      return {
        lane: "border-l-[#7cf7d4]",
        pill: "border-[#7cf7d4]/40 bg-[#7cf7d4]/12 text-[#defff7]",
      };
    case "Archived":
      return {
        lane: "border-l-[#6c7488]",
        pill: "border-white/10 bg-white/5 text-slate-200",
      };
    default:
      return {
        lane: "border-l-[#d4ab54]",
        pill: "border-[#d4ab54]/40 bg-[#d4ab54]/12 text-[#fff2cf]",
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
    `HomePlanet — Ride Dispatch & Trip Timeline`,
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
    .map((t, idx) => `${idx + 1}. ${t.time || "—"} — ${t.title}${t.summary ? ` — ${t.summary}` : ""}`)
    .join("\n");

  const records = ride.records
    .slice()
    .sort((a, b) => a.addedAt.localeCompare(b.addedAt))
    .map((r, idx) => `${idx + 1}. ${r.name} — ${r.kind} — ${r.source}`)
    .join("\n");

  const drivers = ride.drivers
    .map((d, idx) => `${idx + 1}. ${d.name} — ${d.vehicle} — ${d.plate} — ${d.status}`)
    .join("\n");

  const issues = ride.issues
    .map((i, idx) => `${idx + 1}. ${i.text}`)
    .join("\n");

  return [
    `HOMEPLANET — TRIP SUMMARY`,
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
    `TRIP RECORDS`,
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
  const [selectedRideId, setSelectedRideId] = useState<string | null>(() => seedRides()[0]?.id || null);
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
    updateRideOptimistic(ride.id, { meta: { ...(ride.meta || {}), [key]: value } });
  }

  function setStage(rideId: string, stage: RideStage) {
    updateRideOptimistic(rideId, { stage });
  }

  function setNotes(ride: RideRequest, value: string) {
    updateRideOptimistic(ride.id, { notes: value });
  }

  function addRecord(ride: RideRequest, name: string, kind: TripRecordKind, source: string) {
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
    updateRideOptimistic(ride.id, { records: ride.records.filter((x) => x.id !== id) });
  }

  function addTimelineEvent(
    ride: RideRequest,
    payload: { time: string; title: string; summary: string; source: string; kind: TripRecordKind }
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
    updateRideOptimistic(ride.id, { timeline: ride.timeline.filter((x) => x.id !== id) });
  }

  function addDriver(ride: RideRequest, name: string, vehicle: string, plate: string, status: string) {
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
    updateRideOptimistic(ride.id, { drivers: ride.drivers.filter((x) => x.id !== id) });
  }

  function addIssue(ride: RideRequest, text: string) {
    const t = (text || "").trim();
    if (!t) return;

    const next: RideIssue = { id: makeId(), text: t };
    updateRideOptimistic(ride.id, { issues: [next, ...ride.issues] });
  }

  function removeIssue(ride: RideRequest, id: string) {
    updateRideOptimistic(ride.id, { issues: ride.issues.filter((x) => x.id !== id) });
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,rgba(34,126,255,.20),transparent_26%),radial-gradient(circle_at_82%_0%,rgba(224,188,96,.10),transparent_24%),radial-gradient(circle_at_top,rgba(19,35,66,1)_0%,rgba(8,18,35,1)_42%,rgba(4,10,22,1)_100%)] text-[#f4efe1]">
      <div className="mx-auto max-w-7xl p-3 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-white">
              HomePlanet — Ride Dispatch &amp; Trip Timeline
            </div>
            <div className="text-sm text-[#d7c8a6]">
              HomePlanet Core Board • ride intake • dispatch flow • trip timeline • summary preview
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-sm font-semibold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
              onClick={() => setShowPanels((v) => !v)}
            >
              {showPanels ? "Hide Lanes" : "Show Lanes"}
            </button>

            <button
              type="button"
              className="rounded-xl border border-[#80652e] bg-[linear-gradient(180deg,rgba(49,39,18,.96),rgba(29,22,11,.96))] px-3 py-2 text-sm font-semibold text-[#fff2cf] hover:border-[#d9bc74] hover:bg-[#3a2c14]"
              onClick={addRide}
            >
              + Add Ride
            </button>

            <button
              type="button"
              className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-4 py-2 text-sm font-extrabold text-[#151b25] hover:brightness-110"
              onClick={() => selectedRide && copyToClipboard(buildTripSummary(selectedRide))}
              disabled={!selectedRide}
            >
              Generate Trip Summary
            </button>
          </div>
        </div>

        {showPanels ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {stages.map((s, stageIdx) => {
              const tone = stageTone(s);
              const list = ridesByStage.get(s) || [];

              return (
                <div
                  key={reactKey("stage-lane", s, stageIdx)}
                  className={cn("rounded-2xl border border-[#2b3850] bg-[#0d1628]", tone.lane, "border-l-4")}
                >
                  <div className="flex items-center justify-between border-b border-[#243149] p-3">
                    <div className="text-sm font-extrabold text-[#fff7df]">{s}</div>
                    <div className={cn("rounded-full border px-2 py-0.5 text-xs font-bold", tone.pill)}>
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
                          "w-full rounded-xl border px-3 py-2 text-left transition",
                          selectedRideId === r.id
                            ? "border-[#e0bc60] bg-[#1b2740] ring-1 ring-[#e0bc60]/30"
                            : "border-[#33425a] bg-[#162136] hover:border-[#53c6ff]/40 hover:bg-[#1a2740]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-[#fdf7e7]">
                              {r.passengerName || "Unnamed Ride"}
                            </div>
                            <div className="mt-0.5 truncate text-xs text-[#d7c8a6]">
                              {r.pickupLocation || "-"}
                            </div>
                            <div className="mt-1 text-[11px] text-[#9fb5d3]">
                              {r.tripNumber || "-"} • {r.rideTime || "-"}
                            </div>
                          </div>

                          {selectedRideId === r.id ? (
                            <div className="rounded-full border border-[#e0bc60]/60 bg-[#3a2b10] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#fff2cf]">
                              Active
                            </div>
                          ) : null}
                        </div>
                      </button>
                    ))}
                    {list.length === 0 ? <div className="px-3 py-2 text-xs text-[#7688a5]">No rides</div> : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl border border-[#2c3b56] bg-[linear-gradient(180deg,rgba(10,19,36,.96),rgba(6,13,27,.96))]">
          <div className="flex flex-col gap-2 border-b border-[#223148] p-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-extrabold text-white">Ride Drawer</div>
              <div className="text-xs text-[#c8b997]">Open a ride to review dispatch, timeline, records, and trip summary</div>
            </div>

            {selectedRide ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-sm font-bold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                  onClick={() => copyToClipboard(buildRideText(selectedRide))}
                >
                  Copy Ride Text
                </button>
              </div>
            ) : null}
          </div>

          {!selectedRide ? (
            <div className="p-4 text-sm text-[#c6baa1]">Select a ride to open the drawer.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                <div className="text-sm font-extrabold text-[#fff3d2]">Ride</div>

                <div className="mt-2 space-y-2 text-sm">
                  <div>
                    <div className="text-xs font-bold text-[#d2be92]">Passenger</div>
                    <input
                      className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                      value={selectedRide.passengerName}
                      onChange={(e) => updateRideOptimistic(selectedRide.id, { passengerName: e.target.value })}
                    />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#d2be92]">Summary</div>
                    <textarea
                      className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                      value={selectedRide.summary}
                      onChange={(e) => updateRideOptimistic(selectedRide.id, { summary: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Trip #</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.tripNumber || ""}
                        onChange={(e) => updateRideOptimistic(selectedRide.id, { tripNumber: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Passengers</div>
                      <input
                        type="number"
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.passengerCount}
                        onChange={(e) =>
                          updateRideOptimistic(selectedRide.id, { passengerCount: Number(e.target.value || 0) })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#d2be92]">Pickup</div>
                    <input
                      className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                      value={selectedRide.pickupLocation}
                      onChange={(e) => updateRideOptimistic(selectedRide.id, { pickupLocation: e.target.value })}
                    />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#d2be92]">Dropoff</div>
                    <input
                      className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                      value={selectedRide.dropoffLocation}
                      onChange={(e) => updateRideOptimistic(selectedRide.id, { dropoffLocation: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Ride Date</div>
                      <input
                        type="date"
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.rideDate}
                        onChange={(e) => updateRideOptimistic(selectedRide.id, { rideDate: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Ride Time</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.rideTime}
                        onChange={(e) => updateRideOptimistic(selectedRide.id, { rideTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Assigned Driver</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.assignedDriver || ""}
                        onChange={(e) => updateRideOptimistic(selectedRide.id, { assignedDriver: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Vehicle</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.vehicle || ""}
                        onChange={(e) => updateRideOptimistic(selectedRide.id, { vehicle: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#d2be92]">Source Anchor</div>
                    <input
                      className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                      value={selectedRide.sourceAnchor || ""}
                      onChange={(e) => updateRideOptimistic(selectedRide.id, { sourceAnchor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-[#354b67] bg-[linear-gradient(180deg,rgba(13,21,36,.96),rgba(10,16,29,.96))] p-3">
                  <div className="text-xs font-bold text-[#e7cf95]">Current Stage</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stages.map((s, idx) => (
                      <button
                        key={reactKey("stage-pill", selectedRide.id, s, idx)}
                        type="button"
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-extrabold transition",
                          coerceStage(selectedRide.stage) === s
                            ? "border-[#e0bc60]/70 bg-[linear-gradient(180deg,rgba(63,48,20,.98),rgba(39,29,12,.98))] text-[#fff2cf]"
                            : "border-[#41536f] bg-[#1b263a] text-[#cdd9ee] hover:border-[#53c6ff]/50 hover:bg-[#23314b]"
                        )}
                        onClick={() => setStage(selectedRide.id, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-[#354b67] bg-[linear-gradient(180deg,rgba(13,21,36,.96),rgba(10,16,29,.96))] p-3">
                  <div className="text-xs font-bold text-[#e7cf95]">Ride Snapshot</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-2">
                      <div className="text-xs text-[#d2be92]">Records</div>
                      <div className="text-lg font-extrabold text-white">{rideCounts(selectedRide).records}</div>
                    </div>
                    <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-2">
                      <div className="text-xs text-[#d2be92]">Timeline</div>
                      <div className="text-lg font-extrabold text-white">{rideCounts(selectedRide).timeline}</div>
                    </div>
                    <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-2">
                      <div className="text-xs text-[#d2be92]">Drivers</div>
                      <div className="text-lg font-extrabold text-white">{rideCounts(selectedRide).drivers}</div>
                    </div>
                    <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-2">
                      <div className="text-xs text-[#d2be92]">Issues</div>
                      <div className="text-lg font-extrabold text-white">{rideCounts(selectedRide).issues}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-[#354b67] bg-[linear-gradient(180deg,rgba(13,21,36,.96),rgba(10,16,29,.96))] p-3">
                  <div className="text-xs font-bold text-[#e7cf95]">Active Ride Summary</div>

                  <div className="mt-2 space-y-2 text-sm text-[#d9d3c4]">
                    <div>
                      <span className="text-[#9fb5d3]">Passenger:</span> {selectedRide.passengerName || "-"}
                    </div>
                    <div>
                      <span className="text-[#9fb5d3]">Pickup:</span> {selectedRide.pickupLocation || "-"}
                    </div>
                    <div>
                      <span className="text-[#9fb5d3]">Dropoff:</span> {selectedRide.dropoffLocation || "-"}
                    </div>
                    <div>
                      <span className="text-[#9fb5d3]">Driver:</span> {selectedRide.assignedDriver || "-"}
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-[#3a4b67] bg-[#18253a] p-3">
                    <div className="text-xs font-bold text-[#d2be92]">Latest Timeline Event</div>
                    <div className="mt-2 text-sm font-bold text-[#fdf7e7]">
                      {latestTimelineEvent?.title || "No events yet"}
                    </div>
                    <div className="mt-1 text-xs text-[#9fb5d3]">
                      {latestTimelineEvent?.time || ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                  <div className="text-sm font-extrabold text-[#fff3d2]">Trip Records</div>

                  <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Name</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={(selectedRide.meta?.newRecordName || "").toString()}
                        onChange={(e) => setMetaValue(selectedRide, "newRecordName", e.target.value)}
                        placeholder="gps_log_001"
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Source</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={(selectedRide.meta?.newRecordSource || "").toString()}
                        onChange={(e) => setMetaValue(selectedRide, "newRecordSource", e.target.value)}
                        placeholder="GPS / dispatcher / payment / driver"
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Kind</div>
                      <select
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={(selectedRide.meta?.newRecordKind || "note").toString()}
                        onChange={(e) => setMetaValue(selectedRide, "newRecordKind", e.target.value)}
                      >
                        {["gps", "receipt", "signature", "note", "dashcam", "payment", "other"].map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-2">
                    <button
                      type="button"
                      className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                      onClick={() => {
                        addRecord(
                          selectedRide,
                          (selectedRide.meta?.newRecordName || "").toString(),
                          ((selectedRide.meta?.newRecordKind || "note").toString() as TripRecordKind),
                          (selectedRide.meta?.newRecordSource || "").toString()
                        );

                        setMetaValue(selectedRide, "newRecordName", "");
                        setMetaValue(selectedRide, "newRecordSource", "");
                      }}
                    >
                      Add Trip Record
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {selectedRide.records.length === 0 ? (
                      <div className="rounded-xl border border-[#3a4b67] bg-[#121b2d] p-3 text-sm text-[#c6baa1]">
                        No trip records yet.
                      </div>
                    ) : null}

                    {selectedRide.records.map((r, idx) => (
                      <div
                        key={reactKey("record-item", selectedRide.id, r.id, r.name, idx)}
                        className="flex items-start justify-between gap-2 rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(15,23,37,.98),rgba(11,18,30,.98))] p-3"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-[#f5f0e0]">
                            {r.name} <span className="text-[#9fb5d3]">({r.kind})</span>
                          </div>
                          <div className="mt-1 text-xs text-[#d2be92]">
                            {r.source} • {safeDateLabel(r.addedAt)} {safeTimeLabel(r.addedAt)}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                          onClick={() => removeRecord(selectedRide, r.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                  <div className="text-sm font-extrabold text-[#fff3d2]">Trip Timeline</div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Time</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={(selectedRide.meta?.newTimelineTime || "").toString()}
                        onChange={(e) => setMetaValue(selectedRide, "newTimelineTime", e.target.value)}
                        placeholder="7:50 PM"
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Event Title</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={(selectedRide.meta?.newTimelineTitle || "").toString()}
                        onChange={(e) => setMetaValue(selectedRide, "newTimelineTitle", e.target.value)}
                        placeholder="Driver arrived"
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Source</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={(selectedRide.meta?.newTimelineSource || "").toString()}
                        onChange={(e) => setMetaValue(selectedRide, "newTimelineSource", e.target.value)}
                        placeholder="dispatcher / GPS / driver"
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Kind</div>
                      <select
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={(selectedRide.meta?.newTimelineKind || "note").toString()}
                        onChange={(e) => setMetaValue(selectedRide, "newTimelineKind", e.target.value)}
                      >
                        {["gps", "receipt", "signature", "note", "dashcam", "payment", "other"].map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Summary</div>
                      <textarea
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={(selectedRide.meta?.newTimelineSummary || "").toString()}
                        onChange={(e) => setMetaValue(selectedRide, "newTimelineSummary", e.target.value)}
                        placeholder="Short trip event summary"
                        rows={4}
                      />
                    </div>

                    <div>
                      <button
                        type="button"
                        className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                        onClick={() => {
                          addTimelineEvent(selectedRide, {
                            time: (selectedRide.meta?.newTimelineTime || "").toString(),
                            title: (selectedRide.meta?.newTimelineTitle || "").toString(),
                            summary: (selectedRide.meta?.newTimelineSummary || "").toString(),
                            source: (selectedRide.meta?.newTimelineSource || "").toString(),
                            kind: ((selectedRide.meta?.newTimelineKind || "note").toString() as TripRecordKind),
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
                      <div className="rounded-xl border border-[#3a4b67] bg-[#121b2d] p-3 text-sm text-[#c6baa1]">
                        No timeline events yet.
                      </div>
                    ) : null}

                    {selectedRide.timeline
                      .slice()
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((t, idx) => (
                        <div
                          key={reactKey("timeline-item", selectedRide.id, t.id, t.time, idx)}
                          className="rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(15,23,37,.98),rgba(11,18,30,.98))] p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-[#ffd98c]">{t.time || "—"}</div>
                              <div className="mt-1 text-sm font-extrabold text-[#fdf7e7]">{t.title}</div>
                              <div className="mt-1 text-xs text-[#d2be92]">
                                {t.source} • {t.kind}
                              </div>
                              {t.summary ? <div className="mt-2 text-sm text-[#d9d3c4]">{t.summary}</div> : null}
                            </div>

                            <button
                              type="button"
                              className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                              onClick={() => removeTimelineEvent(selectedRide, t.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                  <div className="text-sm font-extrabold text-[#fff3d2]">Driver Assignment</div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <input
                      className="rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                      value={(selectedRide.meta?.newDriverName || "").toString()}
                      onChange={(e) => setMetaValue(selectedRide, "newDriverName", e.target.value)}
                      placeholder="Driver name"
                    />
                    <input
                      className="rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                      value={(selectedRide.meta?.newDriverVehicle || "").toString()}
                      onChange={(e) => setMetaValue(selectedRide, "newDriverVehicle", e.target.value)}
                      placeholder="Vehicle"
                    />
                    <input
                      className="rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                      value={(selectedRide.meta?.newDriverPlate || "").toString()}
                      onChange={(e) => setMetaValue(selectedRide, "newDriverPlate", e.target.value)}
                      placeholder="Plate"
                    />
                    <input
                      className="rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                      value={(selectedRide.meta?.newDriverStatus || "").toString()}
                      onChange={(e) => setMetaValue(selectedRide, "newDriverStatus", e.target.value)}
                      placeholder="Status"
                    />
                    <button
                      type="button"
                      className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
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
                        className="flex items-center justify-between gap-2 rounded-xl border border-[#3a4b67] bg-[#18253a] p-2"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-[#f5f0e0]">{d.name}</div>
                          <div className="text-xs text-[#d2be92]">
                            {d.vehicle} • {d.plate}
                          </div>
                          <div className="text-[11px] text-[#9fb5d3]">{d.status}</div>
                        </div>
                        <button
                          type="button"
                          className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-1.5 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                          onClick={() => removeDriver(selectedRide, d.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                  <div className="text-sm font-extrabold text-[#fff3d2]">Ride Issues</div>

                  <div className="mt-2">
                    <textarea
                      className="w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                      value={(selectedRide.meta?.newIssueText || "").toString()}
                      onChange={(e) => setMetaValue(selectedRide, "newIssueText", e.target.value)}
                      placeholder="Enter ride issue"
                      rows={3}
                    />
                    <button
                      type="button"
                      className="mt-2 rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                      onClick={() => {
                        addIssue(selectedRide, (selectedRide.meta?.newIssueText || "").toString());
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
                        className="flex items-start justify-between gap-2 rounded-xl border border-[#3a4b67] bg-[#18253a] p-2"
                      >
                        <div className="text-sm text-[#f5f0e0]">{i.text}</div>
                        <button
                          type="button"
                          className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-1.5 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                          onClick={() => removeIssue(selectedRide, i.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                  <div className="text-sm font-extrabold text-[#fff3d2]">Dispatcher Notes</div>

                  <textarea
                    className="mt-3 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none placeholder:text-[#7f93ad] focus:border-[#53c6ff]"
                    value={selectedRide.notes}
                    onChange={(e) => setNotes(selectedRide, e.target.value)}
                    placeholder="Dispatcher / operator notes"
                    rows={8}
                  />
                </div>

                <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold text-[#fff3d2]">Trip Summary Preview</div>
                    <button
                      type="button"
                      className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                      onClick={() => setTripSummaryOpen((v) => !v)}
                    >
                      {tripSummaryOpen ? "Hide" : "Show"}
                    </button>
                  </div>

                  {tripSummaryOpen ? (
                    <>
                      <textarea
                        className="mt-3 w-full rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(8,15,28,.98),rgba(5,10,20,.98))] px-3 py-2 text-xs text-[#f5f0e0] outline-none"
                        value={buildTripSummary(selectedRide)}
                        readOnly
                        rows={16}
                      />

                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                          onClick={() => copyToClipboard(buildTripSummary(selectedRide))}
                        >
                          Copy Trip Summary
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}