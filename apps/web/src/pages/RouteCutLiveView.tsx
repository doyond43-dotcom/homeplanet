import { useMemo } from "react";
import {
  ROUTE_OWNER_PAYMENT,
  buildPaymentSmsHref,
  formatEventTime,
  getLatestEvent,
  getStopById,
  orderedStatuses,
  statusLabel,
  useRouteCutStore,
} from "../lib/routecutLiveStore";

function OwnerNav({ stopId }: { stopId: string | null }) {
  const operatorUrl = "/planet/routecut/operator";
  const liveUrl = stopId ? `/planet/routecut/live?stopId=${stopId}` : "/planet/routecut/live";
  const paymentUrl = stopId
    ? `${ROUTE_OWNER_PAYMENT.paymentNodeUrl}?stopId=${stopId}`
    : ROUTE_OWNER_PAYMENT.paymentNodeUrl;

  const buttonClass =
    "rounded-xl border border-cyan-400/30 px-4 py-2 text-sm transition hover:bg-cyan-400/10";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-400/20 bg-[#0B1220]/70 px-4 py-3">
      <span className="text-xs uppercase tracking-[0.25em] text-cyan-300/60">
        Owner Nav
      </span>

      <button
        type="button"
        onClick={() => window.location.assign(operatorUrl)}
        className={buttonClass}
      >
        Operator
      </button>

      <button
        type="button"
        onClick={() => window.location.assign(liveUrl)}
        className={buttonClass}
      >
        Live View
      </button>

      <button
        type="button"
        onClick={() => window.location.assign(paymentUrl)}
        className={buttonClass}
      >
        Payment Node
      </button>
    </div>
  );
}

export default function RouteCutLiveView() {
  const { stops, selectedId, updatedAt } = useRouteCutStore();

  const params = new URLSearchParams(window.location.search);
  const stopIdFromQuery = params.get("stopId");

  const stop =
    getStopById(stopIdFromQuery) ??
    stops.find((item) => item.id === selectedId) ??
    stops[0] ??
    null;

  const allStatuses = orderedStatuses();
  const latestEvent = getLatestEvent(stop);

  const progress = useMemo(() => {
    if (!stop) return [];

    return allStatuses.map((status) => {
      const currentIndex = allStatuses.indexOf(stop.status);
      const index = allStatuses.indexOf(status);

      return {
        status,
        label: statusLabel(status),
        complete: index < currentIndex,
        active: index === currentIndex,
        upcoming: index > currentIndex,
      };
    });
  }, [allStatuses, stop]);

  const statusMessage = useMemo(() => {
    if (!stop) return "";

    switch (stop.status) {
      case "new":
        return "Your stop was received and is now in the live route queue.";
      case "scheduled":
        return "Your stop has been confirmed and locked into the route.";
      case "en-route":
        return "The crew is on the way to your property now.";
      case "on-site":
        return "The crew has arrived and your service is actively underway.";
      case "complete":
        return "Your route stop has been completed and closed out.";
      default:
        return "";
    }
  }, [stop]);

  if (!stop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070B14] px-5 text-white">
        <div className="text-center">
          <div className="text-xl font-semibold">No live stop found.</div>
          <div className="mt-2 text-white/50">
            Open this page from the operator board.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      <div className="mx-auto max-w-5xl space-y-6 px-5 py-6">
        <OwnerNav stopId={stop.id} />

        <header className="flex flex-col gap-4 rounded-2xl border border-cyan-400/20 bg-[#0B1220]/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-300/70">
              RouteCut Live View
            </div>
            <div className="text-lg font-semibold">Your stop is in motion.</div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-cyan-300/30 px-3 py-1 text-xs">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Live customer status
          </div>
        </header>

        <section className="space-y-6 rounded-3xl border border-cyan-400/20 bg-[#0B1220]/80 p-6">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-cyan-300/70">
              Current stop
            </div>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              {stop.customer} — {stop.address}
            </h1>
            <p className="max-w-2xl leading-7 text-white/65">{statusMessage}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/60 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                Window
              </div>
              <div className="mt-2 text-lg font-medium">{stop.openingWindow}</div>
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/60 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                Status
              </div>
              <div className="mt-2 text-lg font-medium">
                {statusLabel(stop.status)}
              </div>
            </div>

            <div className="rounded-xl border border-green-400/20 bg-green-400/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-green-300/70">
                Service
              </div>
              <div className="mt-2 text-lg font-medium">{stop.service}</div>
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/60 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                Payment
              </div>
              <div className="mt-2 text-lg font-medium">
                {stop.payment.status === "paid" ? "Paid" : "Unpaid"}
              </div>
            </div>
          </div>

          {stop.status === "complete" && stop.payment.status !== "paid" ? (
            <div className="rounded-2xl border border-cyan-400/20 bg-[#0D1728]/60 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                Payment ready
              </div>
              <div className="mt-2 text-white/70">
                This stop is complete and payment is still open.
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    window.location.assign(
                      `${ROUTE_OWNER_PAYMENT.paymentNodeUrl}?stopId=${stop.id}`
                    )
                  }
                  className="rounded-xl bg-green-500 px-4 py-2 font-medium text-black transition hover:bg-green-400"
                >
                  Open Payment Node
                </button>

                <button
                  type="button"
                  onClick={() => {
                    window.location.href = buildPaymentSmsHref(stop);
                  }}
                  className="rounded-xl border border-cyan-400/30 px-4 py-2 transition hover:bg-cyan-400/10"
                >
                  Text Payment
                </button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-6 rounded-3xl border border-cyan-400/20 bg-[#0B1220]/80 p-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-300/70">
              Route progress
            </div>
            <h2 className="mt-2 text-2xl font-semibold">
              Watch your stop move live.
            </h2>
            <p className="mt-2 text-sm text-white/45">Last updated: {updatedAt}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {progress.map((step) => (
              <div
                key={step.status}
                className={`rounded-xl border p-4 transition ${
                  step.active
                    ? "border-green-400/40 bg-green-400/10 shadow-[0_0_20px_rgba(74,222,128,0.15)]"
                    : step.complete
                    ? "border-cyan-400/20 bg-[#0D1728]/70"
                    : "border-cyan-400/15 bg-[#0D1728]/40"
                }`}
              >
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                  {step.label}
                </div>
                <div className="mt-3 text-sm text-white/75">
                  {step.active
                    ? "This is where your stop is right now."
                    : step.complete
                    ? "Already completed in the route flow."
                    : "Still ahead in the route sequence."}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-cyan-400/20 bg-[#0B1220]/80 p-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-300/70">
              Latest route event
            </div>
            <div className="mt-2 text-2xl font-semibold">
              {latestEvent?.title ?? "Waiting for route activity"}
            </div>
            <div className="mt-2 text-white/60">
              {latestEvent?.detail ?? "Updates will appear here as the crew moves."}
            </div>
            {latestEvent && (
              <div className="mt-2 text-sm text-white/40">
                Logged at {formatEventTime(latestEvent.createdAt)}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-cyan-400/20 bg-[#0B1220]/80 p-6">
          <div className="text-xs uppercase tracking-widest text-cyan-300/70">
            What happens when we arrive
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/60 p-4">
              Confirm yard
            </div>
            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/60 p-4">
              Cut + edge + blower finish
            </div>
            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/60 p-4">
              Mark complete and close the stop
            </div>
          </div>
        </section>

        <footer className="rounded-xl border border-cyan-400/20 bg-[#0B1220]/60 p-4 text-center text-sm text-white/50">
          HomePlanet Node • RouteCut Lawn
          <br />
          © 2026 HomePlanet
        </footer>
      </div>
    </div>
  );
}