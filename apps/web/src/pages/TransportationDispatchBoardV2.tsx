// src/pages/TransportationDispatchBoardV2.tsx
import { useMemo, useState } from "react";

type DispatchStage =
  | "New Request"
  | "Awaiting Assignment"
  | "Driver En Route"
  | "Passenger Onboard"
  | "Completed";

type FleetStatus = "Available" | "Assigned" | "En Route" | "Off Duty";

type RideEventKind = "request" | "assignment" | "arrival" | "pickup" | "dropoff" | "payment" | "note";

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
    safeToast("Copy failed.");
  }
}

function stageTone(stage: DispatchStage) {
  switch (stage) {
    case "New Request":
      return "border-l-[#53c6ff]";
    case "Awaiting Assignment":
      return "border-l-[#d4ab54]";
    case "Driver En Route":
      return "border-l-[#8a79ff]";
    case "Passenger Onboard":
      return "border-l-[#ffb84d]";
    case "Completed":
      return "border-l-[#7cf7d4]";
    default:
      return "border-l-[#53c6ff]";
  }
}

function fleetTone(status: FleetStatus) {
  switch (status) {
    case "Available":
      return "border-[#4fd7a8]/45 bg-[#10241f] text-[#dffff3]";
    case "Assigned":
      return "border-[#d4ab54]/45 bg-[#241d10] text-[#fff2cf]";
    case "En Route":
      return "border-[#8a79ff]/45 bg-[#171328] text-[#efeaff]";
    case "Off Duty":
      return "border-white/10 bg-white/5 text-slate-200";
    default:
      return "border-white/10 bg-white/5 text-slate-200";
  }
}

function buildDispatchSummary(ride: DispatchRide, assignedVehicle?: FleetVehicle | null) {
  const events = ride.events
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .map((e, idx) => `${idx + 1}. ${e.time} — ${e.title}${e.detail ? ` — ${e.detail}` : ""}`)
    .join("\n");

  return [
    `HOMEPLANET — FLEET DISPATCH SUMMARY`,
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

export default function TransportationDispatchBoardV2() {
  const [fleet, setFleet] = useState<FleetVehicle[]>(() => seedFleet());
  const [rides, setRides] = useState<DispatchRide[]>(() => seedRides());
  const [selectedRideId, setSelectedRideId] = useState<string>(() => seedRides()[0]?.id || "");
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
    ["Awaiting Assignment", "Driver En Route", "Passenger Onboard"].includes(r.stage)
  ).length;

  const availableVehicles = fleet.filter((v) => v.status === "Available").length;
  const enRouteVehicles = fleet.filter((v) => v.status === "En Route").length;
  const pendingRequests = rides.filter((r) => ["New Request", "Awaiting Assignment"].includes(r.stage)).length;

  function updateRide(patch: Partial<DispatchRide>) {
    if (!selectedRide) return;
    setRides((prev) => prev.map((r) => (r.id === selectedRide.id ? { ...r, ...patch } : r)));
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,rgba(34,126,255,.18),transparent_28%),radial-gradient(circle_at_82%_0%,rgba(224,188,96,.08),transparent_24%),radial-gradient(circle_at_top,rgba(19,35,66,1)_0%,rgba(8,18,35,1)_42%,rgba(4,10,22,1)_100%)] text-[#f4efe1]">
      <div className="mx-auto max-w-7xl p-3 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-white">
              HomePlanet — Fleet Dispatch &amp; Ride Board
            </div>
            <div className="text-sm text-[#d7c8a6]">
              HomePlanet Core Board • fleet status • live dispatch • ride timeline • summary preview
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
              onClick={() => selectedRide && copyToClipboard(buildDispatchSummary(selectedRide, selectedVehicle))}
              disabled={!selectedRide}
            >
              Generate Dispatch Summary
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(18,28,46,.98),rgba(12,20,34,.98))] p-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9fb5d3]">Active Trips</div>
            <div className="mt-2 text-2xl font-extrabold text-white">{activeTrips}</div>
            <div className="mt-1 text-xs text-[#c8b997]">Trips in motion</div>
          </div>

          <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(18,28,46,.98),rgba(12,20,34,.98))] p-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9fb5d3]">Available Fleet</div>
            <div className="mt-2 text-2xl font-extrabold text-white">{availableVehicles}</div>
            <div className="mt-1 text-xs text-[#c8b997]">Vehicles ready for dispatch</div>
          </div>

          <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(18,28,46,.98),rgba(12,20,34,.98))] p-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9fb5d3]">Fleet En Route</div>
            <div className="mt-2 text-2xl font-extrabold text-white">{enRouteVehicles}</div>
            <div className="mt-1 text-xs text-[#c8b997]">Vehicles actively moving</div>
          </div>

          <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(18,28,46,.98),rgba(12,20,34,.98))] p-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#9fb5d3]">Pending Requests</div>
            <div className="mt-2 text-2xl font-extrabold text-white">{pendingRequests}</div>
            <div className="mt-1 text-xs text-[#c8b997]">Rides needing action</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-[#2c3b56] bg-[linear-gradient(180deg,rgba(10,19,36,.96),rgba(6,13,27,.96))] p-3">
            <div className="text-sm font-extrabold text-white">Dispatch Queue</div>
            <div className="mt-1 text-xs text-[#c8b997]">Live ride statuses</div>

            <div className="mt-3 space-y-3">
              {groupedRides.map(({ stage, rides: stageRides }) => (
                <div
                  key={stage}
                  className={cn(
                    "rounded-2xl border border-[#2b3850] bg-[#0d1628] border-l-4 p-2",
                    stageTone(stage)
                  )}
                >
                  <div className="flex items-center justify-between px-1 pb-2">
                    <div className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#fff7df]">
                      {stage}
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-bold text-[#d7c8a6]">
                      {stageRides.length}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {stageRides.length === 0 ? (
                      <div className="rounded-xl border border-[#33425a] bg-[#111a2b] px-3 py-2 text-xs text-[#7688a5]">
                        No rides
                      </div>
                    ) : null}

                    {stageRides.map((ride) => (
                      <button
                        key={ride.id}
                        type="button"
                        onClick={() => setSelectedRideId(ride.id)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-2 text-left transition",
                          selectedRide?.id === ride.id
                            ? "border-[#e0bc60] bg-[#1b2740] ring-1 ring-[#e0bc60]/30"
                            : "border-[#33425a] bg-[#162136] hover:border-[#53c6ff]/40 hover:bg-[#1a2740]"
                        )}
                      >
                        <div className="truncate text-sm font-bold text-[#fdf7e7]">{ride.riderName}</div>
                        <div className="mt-0.5 truncate text-xs text-[#d7c8a6]">{ride.pickup}</div>
                        <div className="mt-1 text-[11px] text-[#9fb5d3]">{ride.rideTime}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#2c3b56] bg-[linear-gradient(180deg,rgba(10,19,36,.96),rgba(6,13,27,.96))] p-3">
            <div className="text-lg font-extrabold text-white">Active Trip Console</div>
            <div className="mt-1 text-xs text-[#c8b997]">Current rider, route, vehicle, and dispatch timeline</div>

            {!selectedRide ? (
              <div className="mt-4 text-sm text-[#c6baa1]">Select a ride to open the console.</div>
            ) : (
              <div className="mt-3 space-y-3">
                <div className="rounded-2xl border border-[#354b67] bg-[linear-gradient(180deg,rgba(16,25,40,.96),rgba(10,16,29,.96))] p-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Rider</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.riderName}
                        onChange={(e) => updateRide({ riderName: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Stage</div>
                      <select
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.stage}
                        onChange={(e) => updateRide({ stage: e.target.value as DispatchStage })}
                      >
                        {["New Request", "Awaiting Assignment", "Driver En Route", "Passenger Onboard", "Completed"].map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Pickup</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.pickup}
                        onChange={(e) => updateRide({ pickup: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Dropoff</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.dropoff}
                        onChange={(e) => updateRide({ dropoff: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Ride Time</div>
                      <input
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.rideTime}
                        onChange={(e) => updateRide({ rideTime: e.target.value })}
                      />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#d2be92]">Passengers</div>
                      <input
                        type="number"
                        className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                        value={selectedRide.passengers}
                        onChange={(e) => updateRide({ passengers: Number(e.target.value || 0) })}
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-3">
                      <div className="text-xs text-[#d2be92]">Assigned Driver</div>
                      <div className="mt-1 text-sm font-bold text-white">{selectedVehicle?.driverName || "Unassigned"}</div>
                    </div>

                    <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-3">
                      <div className="text-xs text-[#d2be92]">Vehicle</div>
                      <div className="mt-1 text-sm font-bold text-white">{selectedVehicle?.vehicleName || "Unassigned"}</div>
                    </div>

                    <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-3">
                      <div className="text-xs text-[#d2be92]">Plate</div>
                      <div className="mt-1 text-sm font-bold text-white">{selectedVehicle?.plate || "-"}</div>
                    </div>

                    <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-3">
                      <div className="text-xs text-[#d2be92]">Fleet Status</div>
                      <div className="mt-1 text-sm font-bold text-white">{selectedVehicle?.status || "-"}</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#354b67] bg-[linear-gradient(180deg,rgba(16,25,40,.96),rgba(10,16,29,.96))] p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold text-[#fff3d2]">Live Ride Timeline</div>
                    <button
                      type="button"
                      className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
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
                          className="rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(15,23,37,.98),rgba(11,18,30,.98))] p-3"
                        >
                          <div className="text-xs font-bold text-[#ffd98c]">{event.time}</div>
                          <div className="mt-1 text-sm font-extrabold text-[#fdf7e7]">{event.title}</div>
                          <div className="mt-1 text-sm text-[#d9d3c4]">{event.detail}</div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#354b67] bg-[linear-gradient(180deg,rgba(16,25,40,.96),rgba(10,16,29,.96))] p-3">
                  <div className="text-sm font-extrabold text-[#fff3d2]">Dispatcher Notes</div>
                  <textarea
                    className="mt-3 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none placeholder:text-[#7f93ad] focus:border-[#53c6ff]"
                    value={selectedRide.notes}
                    onChange={(e) => updateRide({ notes: e.target.value })}
                    placeholder="Dispatcher notes"
                    rows={5}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#2c3b56] bg-[linear-gradient(180deg,rgba(10,19,36,.96),rgba(6,13,27,.96))] p-3">
              <div className="text-lg font-extrabold text-white">Fleet Console</div>
              <div className="mt-1 text-xs text-[#c8b997]">Drivers and vehicles at a glance</div>

              <div className="mt-3 space-y-2">
                {fleet.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={cn("rounded-2xl border p-3", fleetTone(vehicle.status))}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold">{vehicle.driverName}</div>
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
            </div>

            <div className="rounded-2xl border border-[#2c3b56] bg-[linear-gradient(180deg,rgba(10,19,36,.96),rgba(6,13,27,.96))] p-3">
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold text-white">Dispatch Summary Preview</div>
                <button
                  type="button"
                  className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                  onClick={() => setSummaryOpen((v) => !v)}
                >
                  {summaryOpen ? "Hide" : "Show"}
                </button>
              </div>

              {summaryOpen && selectedRide ? (
                <>
                  <textarea
                    className="mt-3 w-full rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(8,15,28,.98),rgba(5,10,20,.98))] px-3 py-2 text-xs text-[#f5f0e0] outline-none"
                    value={buildDispatchSummary(selectedRide, selectedVehicle)}
                    readOnly
                    rows={18}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                      onClick={() => copyToClipboard(buildDispatchSummary(selectedRide, selectedVehicle))}
                    >
                      Copy Dispatch Summary
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}