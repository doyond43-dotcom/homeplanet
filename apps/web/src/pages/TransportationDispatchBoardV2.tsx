// src/pages/TransportationDispatchBoardV2.tsx
import { useMemo, useState } from "react";

type DispatchStage =
  | "New Request"
  | "Awaiting Assignment"
  | "Driver En Route"
  | "Passenger Onboard"
  | "Completed";

type FleetStatus = "Available" | "Assigned" | "En Route" | "Off Duty";

type RideEventKind =
  | "request"
  | "assignment"
  | "arrival"
  | "pickup"
  | "dropoff"
  | "payment"
  | "note";

type RideEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
  kind: RideEventKind;
};

type FleetVehicle = {
  id: string;
  driverName: string;
  vehicleName: string;
  plate: string;
  status: FleetStatus;
};

type DispatchRide = {
  id: string;
  riderName: string;
  stage: DispatchStage;
  pickup: string;
  dropoff: string;
  rideTime: string;
  passengers: number;
  assignedVehicleId?: string;
  notes: string;
  events: RideEvent[];
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function makeId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function safeToast(msg: string) {
  try {
    alert(msg);
  } catch {
    /* noop */
  }
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

function stageTone(stage: DispatchStage) {
  switch (stage) {
    case "New Request":
      return {
        lane: "border-l-cyan-400/70",
        pill: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
      };
    case "Awaiting Assignment":
      return {
        lane: "border-l-amber-300/70",
        pill: "border-amber-300/30 bg-amber-400/10 text-amber-100",
      };
    case "Driver En Route":
      return {
        lane: "border-l-violet-400/70",
        pill: "border-violet-400/30 bg-violet-500/10 text-violet-100",
      };
    case "Passenger Onboard":
      return {
        lane: "border-l-fuchsia-400/70",
        pill: "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-100",
      };
    case "Completed":
      return {
        lane: "border-l-emerald-400/70",
        pill: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
      };
    default:
      return {
        lane: "border-l-cyan-400/70",
        pill: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
      };
  }
}

function fleetTone(status: FleetStatus) {
  switch (status) {
    case "Available":
      return "border-emerald-400/30 bg-emerald-500/10 text-emerald-100";
    case "Assigned":
      return "border-amber-300/30 bg-amber-400/10 text-amber-100";
    case "En Route":
      return "border-violet-400/30 bg-violet-500/10 text-violet-100";
    case "Off Duty":
      return "border-white/10 bg-white/5 text-white/70";
    default:
      return "border-white/10 bg-white/5 text-white/70";
  }
}

function buildDispatchSummary(
  ride: DispatchRide,
  assignedVehicle?: FleetVehicle | null
) {
  const events = ride.events
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .map(
      (e, idx) =>
        `${idx + 1}. ${e.time} — ${e.title}${e.detail ? ` — ${e.detail}` : ""}`
    )
    .join("\n");

  return [
    `SUMMIT RIDE DEMO — DISPATCH SUMMARY`,
    ``,
    `Rider: ${ride.riderName}`,
    `Stage: ${ride.stage}`,
    `Pickup: ${ride.pickup}`,
    `Dropoff: ${ride.dropoff}`,
    `Ride Time: ${ride.rideTime}`,
    `Passengers: ${ride.passengers}`,
    `Driver: ${assignedVehicle?.driverName || "Unassigned"}`,
    `Vehicle: ${assignedVehicle?.vehicleName || "Unassigned"}`,
    `Plate: ${assignedVehicle?.plate || "-"}`,
    ``,
    `TIMELINE`,
    events || "-",
    ``,
    `NOTES`,
    ride.notes?.trim() || "-",
  ].join("\n");
}

function seedFleet(): FleetVehicle[] {
  return [
    {
      id: "fleet_1",
      driverName: "Marcus Lee",
      vehicleName: "Lincoln Navigator",
      plate: "FL T7832",
      status: "Assigned",
    },
    {
      id: "fleet_2",
      driverName: "Sofia Ramos",
      vehicleName: "Cadillac Escalade",
      plate: "FL T1904",
      status: "Available",
    },
    {
      id: "fleet_3",
      driverName: "David Cole",
      vehicleName: "Transit Van",
      plate: "FL T4418",
      status: "En Route",
    },
  ];
}

function seedRides(): DispatchRide[] {
  return [
    {
      id: "ride_v2_1",
      riderName: "Emily Rodriguez",
      stage: "Awaiting Assignment",
      pickup: "Fort Pierce Marina",
      dropoff: "Hutchinson Island Resort",
      rideTime: "7:45 PM",
      passengers: 3,
      assignedVehicleId: "fleet_1",
      notes: "High-touch client ride. Confirm arrival messaging.",
      events: [
        {
          id: makeId(),
          time: "7:43 PM",
          title: "Ride requested",
          detail: "Customer request entered into dispatch.",
          kind: "request",
        },
        {
          id: makeId(),
          time: "7:44 PM",
          title: "Vehicle assigned",
          detail: "Marcus Lee assigned in Lincoln Navigator.",
          kind: "assignment",
        },
      ],
    },
    {
      id: "ride_v2_2",
      riderName: "John Martinez",
      stage: "New Request",
      pickup: "Okeechobee Airport",
      dropoff: "Lakeview Hotel",
      rideTime: "4:20 PM",
      passengers: 2,
      notes: "Airport pickup request waiting for assignment.",
      events: [
        {
          id: makeId(),
          time: "4:12 PM",
          title: "Ride requested",
          detail: "Airport pickup request submitted.",
          kind: "request",
        },
      ],
    },
    {
      id: "ride_v2_3",
      riderName: "Ashley Turner",
      stage: "Driver En Route",
      pickup: "Downtown Okeechobee",
      dropoff: "Treasure Coast Mall",
      rideTime: "5:30 PM",
      passengers: 1,
      assignedVehicleId: "fleet_3",
      notes: "Customer requested text on arrival.",
      events: [
        {
          id: makeId(),
          time: "5:08 PM",
          title: "Ride requested",
          detail: "Direct dispatch request received.",
          kind: "request",
        },
        {
          id: makeId(),
          time: "5:11 PM",
          title: "Driver assigned",
          detail: "David Cole assigned in Transit Van.",
          kind: "assignment",
        },
        {
          id: makeId(),
          time: "5:18 PM",
          title: "Driver en route",
          detail: "Vehicle departed prior location.",
          kind: "arrival",
        },
      ],
    },
  ];
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
    <div className="rounded-xl border border-white/10 bg-[#111d2e] p-3">
      <div className="text-xs text-cyan-200/80">{label}</div>
      <div className="mt-1 text-sm font-bold text-white">{value}</div>
    </div>
  );
}

export default function TransportationDispatchBoardV2() {
  const initialFleet = useMemo(() => seedFleet(), []);
  const initialRides = useMemo(() => seedRides(), []);

  const [fleet] = useState<FleetVehicle[]>(initialFleet);
  const [rides, setRides] = useState<DispatchRide[]>(initialRides);
  const [selectedRideId, setSelectedRideId] = useState<string>(
    initialRides[0]?.id || ""
  );
  const [summaryOpen, setSummaryOpen] = useState(true);

  const selectedRide = useMemo(
    () => rides.find((r) => r.id === selectedRideId) || rides[0] || null,
    [rides, selectedRideId]
  );

  const selectedVehicle = useMemo(
    () => fleet.find((v) => v.id === selectedRide?.assignedVehicleId) || null,
    [fleet, selectedRide]
  );

  const groupedRides = useMemo(() => {
    const stages: DispatchStage[] = [
      "New Request",
      "Awaiting Assignment",
      "Driver En Route",
      "Passenger Onboard",
      "Completed",
    ];

    return stages.map((stage) => ({
      stage,
      rides: rides.filter((r) => r.stage === stage),
    }));
  }, [rides]);

  const activeTrips = rides.filter((r) =>
    ["Awaiting Assignment", "Driver En Route", "Passenger Onboard"].includes(
      r.stage
    )
  ).length;

  const availableVehicles = fleet.filter((v) => v.status === "Available").length;
  const enRouteVehicles = fleet.filter((v) => v.status === "En Route").length;
  const pendingRequests = rides.filter((r) =>
    ["New Request", "Awaiting Assignment"].includes(r.stage)
  ).length;

  function updateRide(patch: Partial<DispatchRide>) {
    if (!selectedRide) return;
    setRides((prev) =>
      prev.map((r) => (r.id === selectedRide.id ? { ...r, ...patch } : r))
    );
  }

  function addEvent() {
    if (!selectedRide) return;

    const next: RideEvent = {
      id: makeId(),
      time: "Now",
      title: "Dispatch note added",
      detail: "Operator added live dispatch update.",
      kind: "note",
    };

    updateRide({ events: [next, ...selectedRide.events] });
  }

  function addRide() {
    const newRide: DispatchRide = {
      id: makeId(),
      riderName: "New Rider",
      stage: "New Request",
      pickup: "Unassigned Pickup",
      dropoff: "Unassigned Dropoff",
      rideTime: "6:00 PM",
      passengers: 1,
      notes: "",
      events: [
        {
          id: makeId(),
          time: "Now",
          title: "Ride requested",
          detail: "New ride entered into dispatch queue.",
          kind: "request",
        },
      ],
    };

    setRides((prev) => [newRide, ...prev]);
    setSelectedRideId(newRide.id);
  }

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
                  Summit Ride Demo — Dispatch Board
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/65 md:text-base">
                  Private ride operations • dispatch flow • fleet visibility •
                  live timeline • rider-ready summary
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
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
                  onClick={() =>
                    selectedRide &&
                    copyToClipboard(
                      buildDispatchSummary(selectedRide, selectedVehicle)
                    )
                  }
                  disabled={!selectedRide}
                >
                  Generate Dispatch Summary
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              <MetricCard
                label="Active Trips"
                value={String(activeTrips)}
                helper="Trips in motion"
              />
              <MetricCard
                label="Available Fleet"
                value={String(availableVehicles)}
                helper="Vehicles ready"
              />
              <MetricCard
                label="Fleet En Route"
                value={String(enRouteVehicles)}
                helper="Vehicles moving"
              />
              <MetricCard
                label="Pending Requests"
                value={String(pendingRequests)}
                helper="Needs action"
              />
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
            <aside className="rounded-[28px] border border-white/10 bg-white/[0.05] p-3 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="px-1">
                <div className="text-sm font-extrabold text-white">
                  Dispatch Queue
                </div>
                <div className="mt-1 text-xs text-white/55">
                  Live ride stages
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {groupedRides.map(({ stage, rides: stageRides }) => {
                  const tone = stageTone(stage);

                  return (
                    <div
                      key={stage}
                      className={cn(
                        "rounded-[22px] border border-white/10 bg-[#0d1628] border-l-4 p-2",
                        tone.lane
                      )}
                    >
                      <div className="flex items-center justify-between px-1 pb-2">
                        <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/80">
                          {stage}
                        </div>
                        <div
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-extrabold",
                            tone.pill
                          )}
                        >
                          {stageRides.length}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {stageRides.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-white/10 bg-black/10 px-3 py-4 text-xs text-white/35">
                            No rides
                          </div>
                        ) : null}

                        {stageRides.map((ride) => {
                          const isSelected = selectedRide?.id === ride.id;

                          return (
                            <button
                              key={ride.id}
                              type="button"
                              onClick={() => setSelectedRideId(ride.id)}
                              className={cn(
                                "w-full rounded-[18px] border p-3 text-left transition",
                                isSelected
                                  ? "border-cyan-400/40 bg-cyan-500/10"
                                  : "border-white/10 bg-[#111d2e] hover:bg-[#152338]"
                              )}
                            >
                              <div className="truncate text-sm font-bold text-white">
                                {ride.riderName}
                              </div>
                              <div className="mt-1 truncate text-xs text-white/65">
                                {ride.pickup}
                              </div>
                              <div className="mt-1 text-[11px] text-white/45">
                                {ride.rideTime}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            <main className="rounded-[28px] border border-white/10 bg-white/[0.05] p-3 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="px-1">
                <div className="text-lg font-extrabold text-white">
                  Active Trip Console
                </div>
                <div className="mt-1 text-xs text-white/55">
                  Current rider, route, vehicle, and dispatch timeline
                </div>
              </div>

              {!selectedRide ? (
                <div className="mt-4 px-1 text-sm text-white/55">
                  Select a ride to open the console.
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <div className="text-xs font-bold text-cyan-200/80">
                          Rider
                        </div>
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none placeholder:text-white/30"
                          value={selectedRide.riderName}
                          onChange={(e) =>
                            updateRide({ riderName: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-cyan-200/80">
                          Stage
                        </div>
                        <select
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          value={selectedRide.stage}
                          onChange={(e) =>
                            updateRide({ stage: e.target.value as DispatchStage })
                          }
                        >
                          {[
                            "New Request",
                            "Awaiting Assignment",
                            "Driver En Route",
                            "Passenger Onboard",
                            "Completed",
                          ].map((s) => (
                            <option key={s} value={s} className="text-black">
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-cyan-200/80">
                          Pickup
                        </div>
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          value={selectedRide.pickup}
                          onChange={(e) => updateRide({ pickup: e.target.value })}
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-cyan-200/80">
                          Dropoff
                        </div>
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          value={selectedRide.dropoff}
                          onChange={(e) => updateRide({ dropoff: e.target.value })}
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-cyan-200/80">
                          Ride Time
                        </div>
                        <input
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          value={selectedRide.rideTime}
                          onChange={(e) => updateRide({ rideTime: e.target.value })}
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-cyan-200/80">
                          Passengers
                        </div>
                        <input
                          type="number"
                          className="mt-1 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-white outline-none"
                          value={selectedRide.passengers}
                          onChange={(e) =>
                            updateRide({
                              passengers: Number(e.target.value || 0),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <InfoCard
                        label="Assigned Driver"
                        value={selectedVehicle?.driverName || "Unassigned"}
                      />
                      <InfoCard
                        label="Vehicle"
                        value={selectedVehicle?.vehicleName || "Unassigned"}
                      />
                      <InfoCard
                        label="Plate"
                        value={selectedVehicle?.plate || "-"}
                      />
                      <InfoCard
                        label="Fleet Status"
                        value={selectedVehicle?.status || "-"}
                      />
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-extrabold text-white">
                        Live Ride Timeline
                      </div>
                      <button
                        type="button"
                        className="rounded-xl border border-cyan-400/30 bg-cyan-500/12 px-3 py-2 text-xs font-extrabold text-cyan-100 transition hover:bg-cyan-500/18"
                        onClick={addEvent}
                      >
                        Add Dispatch Event
                      </button>
                    </div>

                    <div className="mt-3 space-y-2">
                      {selectedRide.events
                        .slice()
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((event) => (
                          <div
                            key={event.id}
                            className="rounded-xl border border-white/10 bg-[#111d2e] p-3"
                          >
                            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-200/80">
                              {event.time}
                            </div>
                            <div className="mt-1 text-sm font-extrabold text-white">
                              {event.title}
                            </div>
                            <div className="mt-1 text-sm text-white/70">
                              {event.detail}
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>

                  <section className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="text-sm font-extrabold text-white">
                      Dispatcher Notes
                    </div>
                    <textarea
                      className="mt-3 w-full rounded-xl border border-white/10 bg-[#111d2e] px-3 py-2 text-sm text-white outline-none placeholder:text-white/30"
                      value={selectedRide.notes}
                      onChange={(e) => updateRide({ notes: e.target.value })}
                      placeholder="Dispatcher notes"
                      rows={5}
                    />
                  </section>
                </div>
              )}
            </main>

            <aside className="space-y-4">
              <section className="rounded-[28px] border border-white/10 bg-white/[0.05] p-3 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="px-1">
                  <div className="text-lg font-extrabold text-white">
                    Fleet Console
                  </div>
                  <div className="mt-1 text-xs text-white/55">
                    Drivers and vehicles at a glance
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {fleet.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className={cn(
                        "rounded-[20px] border p-3",
                        fleetTone(vehicle.status)
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold">
                            {vehicle.driverName}
                          </div>
                          <div className="mt-1 text-xs opacity-90">
                            {vehicle.vehicleName} • {vehicle.plate}
                          </div>
                        </div>
                        <div className="rounded-full border border-white/10 bg-black/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em]">
                          {vehicle.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/10 bg-white/[0.05] p-3 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="flex items-center justify-between gap-3 px-1">
                  <div className="text-lg font-extrabold text-white">
                    Dispatch Summary Preview
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/85 transition hover:bg-white/10"
                    onClick={() => setSummaryOpen((v) => !v)}
                  >
                    {summaryOpen ? "Hide" : "Show"}
                  </button>
                </div>

                {summaryOpen && selectedRide ? (
                  <>
                    <textarea
                      className="mt-3 w-full rounded-xl border border-white/10 bg-[#0b1422] px-3 py-2 text-xs text-white outline-none"
                      value={buildDispatchSummary(selectedRide, selectedVehicle)}
                      readOnly
                      rows={18}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-cyan-400/30 bg-cyan-500/12 px-3 py-2 text-xs font-extrabold text-cyan-100 transition hover:bg-cyan-500/18"
                        onClick={() =>
                          copyToClipboard(
                            buildDispatchSummary(selectedRide, selectedVehicle)
                          )
                        }
                      >
                        Copy Dispatch Summary
                      </button>
                    </div>
                  </>
                ) : null}
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}