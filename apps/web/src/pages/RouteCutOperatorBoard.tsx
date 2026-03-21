import { useMemo } from "react";
import {
  addWalkOnStop,
  moveStop,
  nextStatus,
  orderedStatuses,
  setSelectedStop,
  statusLabel,
  useRouteCutStore,
} from "../lib/routecutLiveStore";

export default function RouteCutOperatorBoard() {
  const { stops, selectedId } = useRouteCutStore();

  const selectedStop =
    stops.find((stop) => stop.id === selectedId) ?? stops[0] ?? null;

  const grouped = useMemo(() => {
    return orderedStatuses().map((status) => ({
      status,
      label: statusLabel(status),
      items: stops.filter((stop) => stop.status === status),
    }));
  }, [stops]);

  const handleAddWalkOnStop = () => {
    const customer = window.prompt("Customer name?");
    if (!customer) return;

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

    try {
      await navigator.clipboard.writeText(selectedStop.phone);
      window.alert(`Customer number copied:\n${selectedStop.phone}`);
    } catch {
      window.alert(`Customer number:\n${selectedStop.phone}`);
    }
  };

  const handleAdvance = () => {
    if (!selectedStop) return;
    moveStop(selectedStop.id, nextStatus(selectedStop.status));
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
          </div>

          <button
            onClick={handleAddWalkOnStop}
            className="rounded-xl bg-green-500 px-4 py-2 font-medium text-black hover:bg-green-400"
          >
            Add Walk-On Stop
          </button>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {grouped.map((group) => (
            <div
              key={group.status}
              className="rounded-2xl border border-cyan-400/20 bg-[#0B1220]/80 p-4"
            >
              <div className="mb-3 text-xs uppercase tracking-widest text-cyan-300/70">
                {group.label}
              </div>

              <div className="space-y-3">
                {group.items.map((stop) => (
                  <div
                    key={stop.id}
                    onClick={() => setSelectedStop(stop.id)}
                    className={`cursor-pointer rounded-xl border p-3 transition ${
                      selectedStop?.id === stop.id
                        ? "border-green-400/40 bg-green-400/10"
                        : "border-cyan-400/20 bg-[#0D1728]/60"
                    }`}
                  >
                    <div className="font-medium">{stop.customer}</div>
                    <div className="text-xs text-white/60">{stop.address}</div>
                    <div className="mt-1 text-xs text-white/40">
                      {stop.service}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedStop && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-cyan-400/20 bg-[#0B1220]/80 p-6">
              <div className="text-xl font-semibold">{selectedStop.customer}</div>
              <div className="text-white/60">{selectedStop.address}</div>

              <div className="text-sm text-white/50">
                Status: {statusLabel(selectedStop.status)}
              </div>

              <div className="text-sm text-white/50">
                Service: {selectedStop.service}
              </div>

              <div className="text-sm text-white/50">
                Window: {selectedStop.openingWindow}
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={handleAdvance}
                  className="rounded-xl bg-green-500 px-4 py-2 font-medium text-black hover:bg-green-400"
                >
                  Next Step
                </button>

                <button
                  onClick={handleTextCustomer}
                  className="rounded-xl border border-cyan-400/30 px-4 py-2"
                >
                  Text Customer
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `/planet/routecut/live?stopId=${selectedStop.id}`,
                      "_blank"
                    )
                  }
                  className="rounded-xl border border-cyan-400/30 px-4 py-2"
                >
                  Open Live View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}