import { useMemo, useState } from "react";
import HomePlanetFooter from "../components/HomePlanetFooter";
import {
  ROUTE_OWNER_PAYMENT,
  buildCustomerPaymentMessage,
  getStopById,
  useRouteCutStore,
} from "../lib/routecutLiveStore";

type PaymentRail = "cashapp" | "zelle";

type RailConfig = {
  id: PaymentRail;
  label: string;
  qrSrc: string;
  accountName: string;
  handle: string;
  helper: string;
  payUrl: string | null;
};

const PET_TAG_PAYMENT = {
  ownerName: "Daniel Doyon",
  cashApp: "$homeplanetsystems",
  zelle: "dannyscandys@gmail.com",
  cashAppQr: "/payment/cashapp-qr.png",
  zelleQr: "/payment/zelle-qr.png",
};

function OwnerNav({ stopId }: { stopId: string | null }) {
  const operatorUrl = "/planet/routecut/operator";
  const liveUrl = stopId ? `/planet/routecut/live?stopId=${stopId}` : "/planet/routecut/live";
  const paymentUrl = stopId
    ? `${ROUTE_OWNER_PAYMENT.paymentNodeUrl}?stopId=${stopId}`
    : ROUTE_OWNER_PAYMENT.paymentNodeUrl;

  const buttonClass =
    "rounded-xl border border-cyan-400/30 px-4 py-2 text-sm transition hover:bg-cyan-400/10";

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-cyan-400/20 bg-[#0B1220]/70 px-4 py-3">
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

export default function HomePlanetPaymentNode() {
  const [activeRail, setActiveRail] = useState<PaymentRail>("cashapp");
  const [paidMarked, setPaidMarked] = useState(false);
  const { stops, selectedId } = useRouteCutStore();

  const params = new URLSearchParams(window.location.search);
  const stopIdFromQuery = params.get("stopId");
  const rawRedirectTo = params.get("redirectTo");
  const redirectTo =
    rawRedirectTo && rawRedirectTo.startsWith("/") ? rawRedirectTo : null;

  const stop =
    getStopById(stopIdFromQuery) ??
    stops.find((item) => item.id === selectedId) ??
    stops[0] ??
    null;

  const rail = useMemo<RailConfig>(() => {
    if (activeRail === "cashapp") {
      return {
        id: "cashapp",
        label: "Cash App",
        qrSrc: PET_TAG_PAYMENT.cashAppQr,
        accountName: PET_TAG_PAYMENT.ownerName,
        handle: PET_TAG_PAYMENT.cashApp,
        helper: "Scan with Cash App to send instantly.",
        payUrl: PET_TAG_PAYMENT.cashApp
          ? `https://cash.app/${PET_TAG_PAYMENT.cashApp.replace("$", "")}`
          : null,
      };
    }

    return {
      id: "zelle",
      label: "Zelle",
      qrSrc: PET_TAG_PAYMENT.zelleQr,
      accountName: PET_TAG_PAYMENT.ownerName,
      handle: PET_TAG_PAYMENT.zelle,
      helper: "Scan with Zelle to send instantly.",
      payUrl: null,
    };
  }, [activeRail]);

  const handleMarkPaid = () => {
    setPaidMarked(true);

    if (redirectTo) {
      window.alert(
        "Payment marked on this screen. Next step is wiring this directly into the live order status, proof timeline, and fulfillment board. Continuing to your live board now."
      );
      window.location.assign(redirectTo);
      return;
    }

    window.alert(
      "Payment marked on this screen. Next step is wiring this directly into the pet tag order status, proof timeline, and fulfillment board."
    );
  };

  const handleOpenRail = () => {
    if (!rail.payUrl) {
      window.alert("This payment rail does not have a direct link yet.");
      return;
    }

    window.open(rail.payUrl, "_blank", "noopener,noreferrer");
  };

  const handleTextPayment = async () => {
    const message = stop
      ? buildCustomerPaymentMessage(stop)
      : `HomePlanet Payment Node: your pet tag order is ready for payment. Pay with ${rail.label} using ${rail.handle}.`;

    const phone = stop?.phone ?? "8635320683";

    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // ignore clipboard failure
    }

    window.location.href = `sms:${phone}?&body=${encodeURIComponent(message)}`;
  };

  const handleContinueToLiveBoard = () => {
    if (!redirectTo) {
      window.alert("No live board destination was attached to this payment flow yet.");
      return;
    }

    window.location.assign(redirectTo);
  };

  const paymentSummary = stop
    ? {
        customer: stop.customer,
        service: stop.service,
        amountDue: stop.payment.amountDue,
        status: stop.payment.status,
      }
    : {
        customer: "Pet Tag Order",
        service: "Guardian Pet Tag",
        amountDue: 25,
        status: "unpaid" as const,
      };

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <OwnerNav stopId={stop?.id ?? null} />

        <div className="relative overflow-hidden rounded-[30px] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(74,222,128,0.10),transparent_22%),linear-gradient(180deg,#071120_0%,#081424_100%)] shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(56,189,248,0.05)_24%,transparent_42%,rgba(74,222,128,0.04)_62%,transparent_100%)]" />

          <div className="relative border-b border-cyan-400/15 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-300/70">
                  Payment Node
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Pay instantly
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
                  Choose your payment rail and scan to send. Once paid, the
                  order can reflect payment immediately.
                </p>
                {redirectTo ? (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1.5 text-xs font-medium text-green-200 shadow-[0_0_18px_rgba(74,222,128,0.10)]">
                    Live board ready after payment
                  </div>
                ) : null}
              </div>

              <div className="inline-flex items-center gap-2 self-start rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1.5 text-xs font-medium text-green-200 shadow-[0_0_18px_rgba(74,222,128,0.10)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400/45" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                </span>
                Live Payment Ready
              </div>
            </div>
          </div>

          <div className="relative grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[0.98fr_1.02fr] lg:gap-8 lg:py-8">
            <section className="rounded-[24px] border border-cyan-400/15 bg-[#081221]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6">
              <div className="mb-5 inline-flex rounded-full border border-cyan-400/20 bg-[#07101d] p-1">
                <button
                  type="button"
                  onClick={() => setActiveRail("cashapp")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeRail === "cashapp"
                      ? "bg-cyan-400/15 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.18)]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Cash App
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRail("zelle")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeRail === "zelle"
                      ? "bg-cyan-400/15 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.18)]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Zelle
                </button>
              </div>

              <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-cyan-400/15 bg-[#091524] p-4">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/60">
                      Payment rail
                    </div>
                    <div className="mt-2 text-xl font-semibold text-white">
                      {rail.label}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-white/60">
                      {rail.helper}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/15 bg-[#091524] p-4">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/60">
                      Account name
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      {rail.accountName}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-green-200/80">
                      Scan target
                    </div>
                    <div className="mt-2 break-all text-base font-semibold text-white">
                      {rail.handle || "Not configured"}
                    </div>
                  </div>

                  {paymentSummary && (
                    <div className="rounded-2xl border border-cyan-400/15 bg-[#091524] p-4">
                      <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/60">
                        Current order
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">
                        {paymentSummary.customer}
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        {paymentSummary.service}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-white/55">
                          Status: {paymentSummary.status === "paid" ? "Paid" : "Unpaid"}
                        </span>
                        <span className="font-medium text-white">
                          ${paymentSummary.amountDue}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-cyan-400/15 bg-[#091524] p-4">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/60">
                      HomePlanet flow
                    </div>
                    <div className="mt-2 text-sm leading-7 text-white/65">
                      Customer chooses the rail, scans, pays, and the payment
                      event can attach to the pet tag order, fulfillment board,
                      proof timeline, or invoice record.
                    </div>
                  </div>

                  {rail.payUrl && (
                    <div className="rounded-2xl border border-cyan-400/15 bg-[#091524] p-4">
                      <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/60">
                        Direct payment link
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenRail}
                        className="mt-3 w-full rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-cyan-400/15"
                      >
                        Open {rail.label}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mx-auto flex w-full max-w-[400px] flex-col items-center rounded-[28px] border border-cyan-400/15 bg-[#081120] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                  <div className="mb-3 text-[11px] uppercase tracking-[0.28em] text-cyan-300/60">
                    Scan to pay
                  </div>

                  <div className="w-full rounded-[24px] border border-white/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    <div className="mb-4 text-center">
                      <div className="text-lg font-semibold text-black">
                        {PET_TAG_PAYMENT.ownerName}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {rail.handle || "Configure payment handle"}
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <img
                        src={rail.qrSrc}
                        alt={`${rail.label} QR code for ${rail.accountName}`}
                        className="block h-auto w-full max-w-[280px] rounded-[20px] object-contain"
                      />
                    </div>

                    <div className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      Verified Payment Target
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <div className="text-sm font-medium text-white/70">
                      {rail.label}
                    </div>
                    <div className="mt-1 text-base font-semibold text-white">
                      {PET_TAG_PAYMENT.ownerName}
                    </div>
                    <div className="mt-1 text-sm text-cyan-200/80">
                      {rail.handle || "Not configured"}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="flex flex-col gap-5">
              <div className="rounded-[24px] border border-cyan-400/15 bg-[#081221]/80 p-5">
                <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/60">
                  Why this feels different
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-cyan-400/15 bg-[#091524] p-4 text-sm leading-6 text-white/70">
                    One clean payment surface instead of random screenshots or
                    app confusion.
                  </div>

                  <div className="rounded-2xl border border-cyan-400/15 bg-[#091524] p-4 text-sm leading-6 text-white/70">
                    The customer chooses the rail, scans, pays, and stays
                    inside the HomePlanet proof flow.
                  </div>

                  <div className="rounded-2xl border border-cyan-400/15 bg-[#091524] p-4 text-sm leading-6 text-white/70">
                    This same node can be reused on invoice pages, pet tag
                    pages, service completion pages, and live boards.
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-cyan-400/15 bg-[#081221]/80 p-5">
                <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/60">
                  Payment actions
                </div>

                <div className="mt-4 grid gap-3">
                  <button
                    type="button"
                    onClick={handleTextPayment}
                    className="rounded-2xl bg-green-400 px-4 py-3 font-semibold text-black transition hover:bg-green-300"
                  >
                    Text Payment
                  </button>

                  <button
                    type="button"
                    onClick={handleMarkPaid}
                    className="rounded-2xl border border-cyan-400/20 bg-[#091524] px-4 py-3 font-medium text-white transition hover:bg-cyan-400/10"
                  >
                    I Paid
                  </button>

                  {redirectTo ? (
                    <button
                      type="button"
                      onClick={handleContinueToLiveBoard}
                      className="rounded-2xl border border-green-400/25 bg-green-400/10 px-4 py-3 font-medium text-green-100 transition hover:bg-green-400/15"
                    >
                      Continue to Live Board
                    </button>
                  ) : null}

                  {rail.payUrl ? (
                    <button
                      type="button"
                      onClick={handleOpenRail}
                      className="rounded-2xl border border-cyan-400/20 bg-[#091524] px-4 py-3 font-medium text-white transition hover:bg-cyan-400/10"
                    >
                      Open {rail.label}
                    </button>
                  ) : null}
                </div>

                {paidMarked && (
                  <div className="mt-4 rounded-2xl border border-green-400/25 bg-green-400/10 p-4 text-sm leading-6 text-green-100">
                    Payment marked on this device. Next step is wiring this
                    into the real pet tag order status, fulfillment board, and
                    proof timeline.
                  </div>
                )}
              </div>

              <div className="rounded-[24px] border border-cyan-400/15 bg-[#081221]/80 p-5 text-sm leading-7 text-white/60">
                <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/60">
                  Footer line
                </div>
                <div className="mt-3">
                  Fast scan • clean proof • live payment flow
                </div>
              </div>
            </aside>
          </div>

          <div className="relative border-t border-cyan-400/15 px-6 py-6 sm:px-8">
            <HomePlanetFooter />
          </div>
        </div>
      </div>
    </div>
  );
}