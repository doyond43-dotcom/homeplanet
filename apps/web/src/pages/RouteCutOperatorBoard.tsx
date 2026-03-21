import { useMemo, useState } from "react";
import {
  addStopNote,
  addWalkOnStop,
  advanceStop,
  formatEventTime,
  logCustomerContact,
  nextActionLabel,
  orderedStatuses,
  setSelectedStop,
  statusLabel,
  stepBackStop,
  useRouteCutStore,
} from "../lib/routecutLiveStore";

export default function RouteCutOperatorBoard() {
  const { stops, selectedId, updatedAt } = useRouteCutStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedStop =
    stops.find((stop) => stop.id === selectedId) ?? stops[0] ?? null;

  const grouped = useMemo(() => {
    return orderedStatuses().map((status) => ({
      status,
      label: statusLabel(status),
      items: stops.filter((stop) => stop.status === status),
    }));
  }, [stops]);

  const routeStats = useMemo(() => {
    const completedStops = stops.filter((stop) => stop.status === "complete");
    const openStops = stops.filter((stop) => stop.status !== "complete");
    const activeStop =
      stops.find((stop) => stop.status === "on-site") ??
      stops.find((stop) => stop.status === "en-route") ??
      stops.find((stop) => stop.status === "scheduled") ??
      stops.find((stop) => stop.status === "new") ??
      null;

    const parseAmount = (service: string) => {
      const match = service.match(/\$?\d+(?:\.\d{1,2})?/);
      if (!match) return 80;
      return Number(match[0].replace("$", ""));
    };

    const completedRevenue = completedStops.reduce(
      (sum, stop) => sum + parseAmount(stop.service),
      0
    );

    const projectedRevenue = stops.reduce(
      (sum, stop) => sum + parseAmount(stop.service),
      0
    );

    const averageStopValue =
      stops.length > 0 ? Math.round(projectedRevenue / stops.length) : 0;

    const unpaidJobs = completedStops.length > 0 ? 1 : 0;
    const maintenanceDue =
      completedStops.length >= 4
        ? "Blade sharpening recommended"
        : "No maintenance due right now";
    const alertItems = [
      openStops.length > 3 ? "Route still has multiple open stops." : null,
      unpaidJobs > 0 ? "At least one completed stop may still need payment." : null,
      completedStops.length >= 4 ? "Crew is due for a blade check soon." : null,
    ].filter(Boolean) as string[];

    return {
      completedToday: completedStops.length,
      openNow: openStops.length,
      activeStop,
      projectedRevenue,
      completedRevenue,
      averageStopValue,
      unpaidJobs,
      maintenanceDue,
      alertItems,
    };
  }, [stops]);

  const handleAddWalkOnStop = () => {
    const customer = window.prompt("Customer name?");
    if (!customer?.trim()) return;

    const address = window.prompt("Address?") ?? "";
    const phone = window.prompt("Phone number?") ?? "";
    const notes = window.prompt("Notes?") ?? "";
    const service = window.prompt("Service?") ?? "";
    const openingWindow = window.prompt("Opening window?") ?? "";

    addWalkOnStop({
      customer,
      address,
      phone,
      notes,
      service,
      openingWindow,
    });
  };

  const handleTextCustomer = async () => {
    if (!selectedStop) return;

    logCustomerContact(selectedStop.id, "text");

    const message = `Hi ${selectedStop.customer}, you're on the RouteCut live route. Current status: ${statusLabel(
      selectedStop.status
    )}.`;

    try {
      await navigator.clipboard.writeText(`${selectedStop.phone}\n\n${message}`);
      window.alert(
        `Customer contact copied.\n\n${selectedStop.phone}\n\nMessage:\n${message}`
      );
    } catch {
      window.alert(`Text ${selectedStop.phone}\n\n${message}`);
    }
  };

  const handleCallCustomer = () => {
    if (!selectedStop) return;
    logCustomerContact(selectedStop.id, "call");
    window.location.href = `tel:${selectedStop.phone}`;
  };

  const handleAdvance = () => {
    if (!selectedStop || selectedStop.status === "complete") return;
    advanceStop(selectedStop.id);
  };

  const handleStepBack = () => {
    if (!selectedStop || selectedStop.status === "new") return;
    stepBackStop(selectedStop.id);
  };

  const handleAddNote = () => {
    if (!selectedStop) return;

    const note = window.prompt("Add operator note:");
    if (!note?.trim()) return;

    addStopNote(selectedStop.id, note);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-5 py-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-cyan-400/20 bg-[#0B1220]/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-300/70">
              RouteCut Operator Board
            </div>
            <div className="text-lg font-semibold">
              Run the whole route from one screen.
            </div>
            <div className="mt-1 text-sm text-white/45">
              Last route sync: {updatedAt}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen((value) => !value)}
              className="rounded-xl border border-cyan-400/30 px-4 py-2 transition hover:bg-cyan-400/10"
            >
              {drawerOpen ? "Close Drawer" : "Open Drawer"}
            </button>

            <button
              type="button"
              onClick={handleAddWalkOnStop}
              className="rounded-xl bg-green-500 px-4 py-2 font-medium text-black transition hover:bg-green-400"
            >
              Add Walk-On Stop
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {grouped.map((group) => (
            <div
              key={group.status}
              className="rounded-2xl border border-cyan-400/20 bg-[#0B1220]/80 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-cyan-300/70">
                  {group.label}
                </div>
                <div className="rounded-full border border-cyan-400/20 px-2 py-0.5 text-[10px] text-white/50">
                  {group.items.length}
                </div>
              </div>

              <div className="space-y-3">
                {group.items.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-cyan-400/10 bg-[#0D1728]/30 p-3 text-xs text-white/30">
                    No stops in this stage.
                  </div>
                ) : (
                  group.items.map((stop) => (
                    <button
                      key={stop.id}
                      type="button"
                      onClick={() => setSelectedStop(stop.id)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        selectedStop?.id === stop.id
                          ? "border-green-400/40 bg-green-400/10"
                          : "border-cyan-400/20 bg-[#0D1728]/60 hover:bg-[#101d33]"
                      }`}
                    >
                      <div className="font-medium">{stop.customer}</div>
                      <div className="mt-1 text-xs text-white/60">{stop.address}</div>
                      <div className="mt-2 text-xs text-white/40">{stop.service}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={`grid gap-6 ${drawerOpen ? "xl:grid-cols-[1fr_360px]" : ""}`}>
          <div className="space-y-6">
            {selectedStop && (
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="space-y-5 rounded-2xl border border-cyan-400/20 bg-[#0B1220]/80 p-6">
                  <div>
                    <div className="text-2xl font-semibold">{selectedStop.customer}</div>
                    <div className="mt-2 text-white/60">{selectedStop.address}</div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                        Status
                      </div>
                      <div className="mt-2 text-lg font-medium">
                        {statusLabel(selectedStop.status)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                        Window
                      </div>
                      <div className="mt-2 text-lg font-medium">
                        {selectedStop.openingWindow}
                      </div>
                    </div>

                    <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                        Service
                      </div>
                      <div className="mt-2 text-lg font-medium">
                        {selectedStop.service}
                      </div>
                    </div>

                    <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
                      <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                        Phone
                      </div>
                      <div className="mt-2 text-lg font-medium">{selectedStop.phone}</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                      Notes
                    </div>
                    <div className="mt-2 whitespace-pre-line text-white/70">
                      {selectedStop.notes || "No notes yet."}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleAdvance}
                      disabled={selectedStop.status === "complete"}
                      className="rounded-xl bg-green-500 px-4 py-2 font-medium text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {nextActionLabel(selectedStop.status)}
                    </button>

                    <button
                      type="button"
                      onClick={handleStepBack}
                      disabled={selectedStop.status === "new"}
                      className="rounded-xl border border-cyan-400/30 px-4 py-2 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Step Back
                    </button>

                    <button
                      type="button"
                      onClick={handleTextCustomer}
                      className="rounded-xl border border-cyan-400/30 px-4 py-2 transition hover:bg-cyan-400/10"
                    >
                      Text Customer
                    </button>

                    <button
                      type="button"
                      onClick={handleCallCustomer}
                      className="rounded-xl border border-cyan-400/30 px-4 py-2 transition hover:bg-cyan-400/10"
                    >
                      Call Customer
                    </button>

                    <button
                      type="button"
                      onClick={handleAddNote}
                      className="rounded-xl border border-cyan-400/30 px-4 py-2 transition hover:bg-cyan-400/10"
                    >
                      Add Note
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `/planet/routecut/live?stopId=${selectedStop.id}`,
                          "_blank"
                        )
                      }
                      className="rounded-xl border border-cyan-400/30 px-4 py-2 transition hover:bg-cyan-400/10"
                    >
                      Open Live View
                    </button>
                  </div>
                </section>

                <section className="space-y-4 rounded-2xl border border-cyan-400/20 bg-[#0B1220]/80 p-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-cyan-300/70">
                      Route event log
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      Everything that happened to this stop.
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[...selectedStop.events].reverse().map((event) => (
                      <div
                        key={event.id}
                        className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs text-white/40">
                            {formatEventTime(event.createdAt)}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-white/60">{event.detail}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          {drawerOpen && (
            <aside className="space-y-4 rounded-2xl border border-cyan-400/20 bg-[#0B1220]/80 p-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-cyan-300/70">
                  Node Drawer
                </div>
                <div className="mt-2 text-xl font-semibold">
                  Route intelligence
                </div>
                <div className="mt-1 text-sm text-white/45">
                  Add-on insights without cluttering the board.
                </div>
              </div>

              <section className="space-y-3 rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                  Overview
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-cyan-400/15 bg-[#09111f] p-3">
                    <div className="text-xs text-white/45">Completed today</div>
                    <div className="mt-1 text-xl font-semibold">
                      {routeStats.completedToday}
                    </div>
                  </div>

                  <div className="rounded-lg border border-cyan-400/15 bg-[#09111f] p-3">
                    <div className="text-xs text-white/45">Open now</div>
                    <div className="mt-1 text-xl font-semibold">
                      {routeStats.openNow}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-cyan-400/15 bg-[#09111f] p-3">
                  <div className="text-xs text-white/45">Current active stop</div>
                  <div className="mt-1 font-medium">
                    {routeStats.activeStop?.customer ?? "No active stop"}
                  </div>
                  <div className="mt-1 text-xs text-white/40">
                    Route sync: {updatedAt}
                  </div>
                </div>
              </section>

              <section className="space-y-3 rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                  Money
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-cyan-400/15 bg-[#09111f] p-3">
                    <div className="text-xs text-white/45">Today revenue</div>
                    <div className="mt-1 text-xl font-semibold">
                      ${routeStats.completedRevenue}
                    </div>
                  </div>

                  <div className="rounded-lg border border-cyan-400/15 bg-[#09111f] p-3">
                    <div className="text-xs text-white/45">Avg stop value</div>
                    <div className="mt-1 text-xl font-semibold">
                      ${routeStats.averageStopValue}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-cyan-400/15 bg-[#09111f] p-3">
                  <div className="text-xs text-white/45">Projected route total</div>
                  <div className="mt-1 font-medium">
                    ${routeStats.projectedRevenue}
                  </div>
                  <div className="mt-1 text-xs text-white/40">
                    Unpaid completed jobs: {routeStats.unpaidJobs}
                  </div>
                </div>
              </section>

              <section className="space-y-3 rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                  Maintenance
                </div>

                <div className="rounded-lg border border-cyan-400/15 bg-[#09111f] p-3">
                  <div className="font-medium">{routeStats.maintenanceDue}</div>
                  <div className="mt-1 text-xs text-white/45">
                    Simple reminder shell for blades, mower service, and route upkeep.
                  </div>
                </div>
              </section>

              <section className="space-y-3 rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                  Alerts
                </div>

                <div className="space-y-2">
                  {routeStats.alertItems.length === 0 ? (
                    <div className="rounded-lg border border-cyan-400/15 bg-[#09111f] p-3 text-sm text-white/55">
                      No active alerts right now.
                    </div>
                  ) : (
                    routeStats.alertItems.map((alert) => (
                      <div
                        key={alert}
                        className="rounded-lg border border-cyan-400/15 bg-[#09111f] p-3 text-sm text-white/70"
                      >
                        {alert}
                      </div>
                    ))
                  )}
                </div>
              </section>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}