import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  LoaderCircle,
  QrCode,
  Receipt,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Wallet,
  Zap,
} from "lucide-react";

type PaymentStatus =
  | "awaiting-payment"
  | "payment-sent"
  | "payment-confirmed"
  | "processing"
  | "ready";

type TimelineKind = "customer" | "system" | "staff";
type ScenarioId = "custom-order" | "salon" | "auto" | "food";

type PaymentEvent = {
  id: string;
  title: string;
  detail: string;
  kind: TimelineKind;
  timeLabel: string;
};

type PaymentOrder = {
  id: string;
  customer: string;
  amount: number;
  service: string;
  paymentMethod: "Zelle" | "Tap to Pay" | "Card" | "QR";
  status: PaymentStatus;
  createdAtLabel: string;
};

type ScenarioConfig = {
  id: ScenarioId;
  label: string;
  customer: string;
  service: string;
  amount: string;
  paymentMethod: "Zelle" | "Tap to Pay" | "Card" | "QR";
  customerViewLabel: string;
  businessViewLabel: string;
  boardTitle: string;
  boardSubcopy: string;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const statusMeta: Record<
  PaymentStatus,
  {
    label: string;
    short: string;
    tone: string;
    dot: string;
    border: string;
    bg: string;
    text: string;
  }
> = {
  "awaiting-payment": {
    label: "Awaiting payment",
    short: "Awaiting",
    tone: "Waiting",
    dot: "bg-amber-400",
    border: "border-amber-500/25",
    bg: "bg-amber-500/10",
    text: "text-amber-200",
  },
  "payment-sent": {
    label: "Payment sent",
    short: "Sent",
    tone: "Customer action",
    dot: "bg-sky-400",
    border: "border-sky-500/25",
    bg: "bg-sky-500/10",
    text: "text-sky-200",
  },
  "payment-confirmed": {
    label: "Payment confirmed",
    short: "Confirmed",
    tone: "Verified",
    dot: "bg-emerald-400",
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/10",
    text: "text-emerald-200",
  },
  processing: {
    label: "Processing order",
    short: "Processing",
    tone: "In progress",
    dot: "bg-violet-400",
    border: "border-violet-500/25",
    bg: "bg-violet-500/10",
    text: "text-violet-200",
  },
  ready: {
    label: "Ready for pickup",
    short: "Ready",
    tone: "Completed",
    dot: "bg-teal-400",
    border: "border-teal-500/25",
    bg: "bg-teal-500/10",
    text: "text-teal-200",
  },
};

const scenarios: ScenarioConfig[] = [
  {
    id: "custom-order",
    label: "Custom order",
    customer: "Matthew M.",
    service: "Logo deposit",
    amount: "75",
    paymentMethod: "Zelle",
    customerViewLabel: "Deposit received",
    businessViewLabel: "Artwork released to production",
    boardTitle: "Live payment desk",
    boardSubcopy: "Send payment. Match it. Move the work forward.",
  },
  {
    id: "salon",
    label: "Salon",
    customer: "Jessica R.",
    service: "Color appointment deposit",
    amount: "45",
    paymentMethod: "Tap to Pay",
    customerViewLabel: "Appointment deposit received",
    businessViewLabel: "Appointment locked in",
    boardTitle: "Salon payment desk",
    boardSubcopy: "Deposits should lock in the chair instantly.",
  },
  {
    id: "auto",
    label: "Auto",
    customer: "Marcus T.",
    service: "Brake parts deposit",
    amount: "185",
    paymentMethod: "Zelle",
    customerViewLabel: "Parts deposit received",
    businessViewLabel: "Repair order released to shop",
    boardTitle: "Service payment desk",
    boardSubcopy: "Payment should release the job, not start a text thread.",
  },
  {
    id: "food",
    label: "Food",
    customer: "Hayley D.",
    service: "Family meal order",
    amount: "62",
    paymentMethod: "QR",
    customerViewLabel: "Order paid",
    businessViewLabel: "Kitchen ticket released",
    boardTitle: "Food payment desk",
    boardSubcopy: "Customer pays. Kitchen sees it. Order keeps moving.",
  },
];

const seededOrders: PaymentOrder[] = [
  {
    id: "ord-1001",
    customer: "Jessica R.",
    amount: 78,
    service: "Color refresh",
    paymentMethod: "Card",
    status: "ready",
    createdAtLabel: "12 min ago",
  },
  {
    id: "ord-1002",
    customer: "Marcus T.",
    amount: 45,
    service: "Quick trim",
    paymentMethod: "Tap to Pay",
    status: "processing",
    createdAtLabel: "4 min ago",
  },
  {
    id: "ord-1003",
    customer: "Hayley D.",
    amount: 120,
    service: "Deposit",
    paymentMethod: "Zelle",
    status: "payment-confirmed",
    createdAtLabel: "1 min ago",
  },
];

const startingTimeline: PaymentEvent[] = [
  {
    id: "evt-1",
    title: "System ready",
    detail: "Incoming payments can match to the board instantly without screenshots.",
    kind: "system",
    timeLabel: "Now",
  },
  {
    id: "evt-2",
    title: "Marcus T. moved into processing",
    detail: "Tap payment already matched and released the live order.",
    kind: "staff",
    timeLabel: "1 min ago",
  },
  {
    id: "evt-3",
    title: "Hayley D. payment confirmed",
    detail: "Zelle payment matched and verified instantly.",
    kind: "system",
    timeLabel: "1 min ago",
  },
];

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function statusIndex(status: PaymentStatus) {
  return [
    "awaiting-payment",
    "payment-sent",
    "payment-confirmed",
    "processing",
    "ready",
  ].indexOf(status);
}

function prettyNow() {
  const date = new Date();
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SectionCard({
  title,
  subcopy,
  right,
  children,
  className = "",
}: {
  title: string;
  subcopy?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(16,24,44,0.94),rgba(10,16,30,0.96))] shadow-[0_24px_80px_rgba(0,0,0,0.42)]",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-[17px] font-semibold text-white sm:text-[19px]">{title}</h2>
          {subcopy ? <p className="mt-1 text-sm text-slate-400">{subcopy}</p> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function NoScreenshotPaymentsDemo() {
  const [orders, setOrders] = useState<PaymentOrder[]>(seededOrders);
  const [timeline, setTimeline] = useState<PaymentEvent[]>(startingTimeline);
  const [scenarioId, setScenarioId] = useState<ScenarioId>("custom-order");
  const [customerName, setCustomerName] = useState("Matthew M.");
  const [serviceName, setServiceName] = useState("Logo deposit");
  const [amount, setAmount] = useState("75");
  const [copied, setCopied] = useState(false);
  const [processingFlow, setProcessingFlow] = useState(false);
  const timeoutRefs = useRef<number[]>([]);

  const activeScenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0],
    [scenarioId]
  );

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (processingFlow) return;
    setCustomerName(activeScenario.customer);
    setServiceName(activeScenario.service);
    setAmount(activeScenario.amount);
  }, [activeScenario, processingFlow]);

  const totals = useMemo(() => {
    const confirmedLike = orders.filter((o) =>
      ["payment-confirmed", "processing", "ready"].includes(o.status)
    );
    const gross = confirmedLike.reduce((sum, item) => sum + item.amount, 0);
    const readyCount = orders.filter((o) => o.status === "ready").length;
    const liveCount = orders.filter((o) => o.status !== "ready").length;

    return {
      gross,
      readyCount,
      liveCount,
      totalOrders: orders.length,
    };
  }, [orders]);

  const currentDemoOrder = useMemo(
    () => orders.find((o) => o.id === "ord-live-demo"),
    [orders]
  );

  const currentDemoStatus = currentDemoOrder?.status ?? "awaiting-payment";
  const progressValue = ((statusIndex(currentDemoStatus) + 1) / 5) * 100;

  const activityStrip = useMemo(() => {
    return timeline.slice(0, 3).map((event) => ({
      id: event.id,
      text: `${event.timeLabel} — ${event.title}`,
    }));
  }, [timeline]);

  const lastMatchedOrder = useMemo(() => {
    return orders.find((item) => item.id === "ord-live-demo") ?? orders[0];
  }, [orders]);

  function addTimelineEvent(event: Omit<PaymentEvent, "id" | "timeLabel">) {
    setTimeline((prev) => [
      {
        id: makeId("evt"),
        timeLabel: prettyNow(),
        ...event,
      },
      ...prev,
    ]);
  }

  function copyZelleHandle() {
    navigator.clipboard?.writeText("payments@homeplanet.city");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function resetDemo() {
    timeoutRefs.current.forEach((id) => window.clearTimeout(id));
    timeoutRefs.current = [];
    setProcessingFlow(false);

    setOrders((prev) => prev.filter((item) => item.id !== "ord-live-demo"));

    addTimelineEvent({
      title: "Demo reset",
      detail: "Live payment flow cleared and ready to run again.",
      kind: "system",
    });
  }

  function runPaymentDemo() {
    if (processingFlow) return;

    const parsedAmount = Number(amount);
    const safeAmount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 75;
    const safeCustomer = customerName.trim() || "Walk-in Customer";
    const safeService = serviceName.trim() || "Live order";

    setProcessingFlow(true);

    const liveOrder: PaymentOrder = {
      id: "ord-live-demo",
      customer: safeCustomer,
      amount: safeAmount,
      service: safeService,
      paymentMethod: activeScenario.paymentMethod,
      status: "payment-sent",
      createdAtLabel: "Just now",
    };

    setOrders((prev) => [liveOrder, ...prev.filter((item) => item.id !== "ord-live-demo")]);

    addTimelineEvent({
      title: `${safeCustomer} sent payment`,
      detail: `${currency.format(safeAmount)} received for ${safeService}.`,
      kind: "customer",
    });

    const confirmationTimeout = window.setTimeout(() => {
      setOrders((prev) =>
        prev.map((item) =>
          item.id === "ord-live-demo" ? { ...item, status: "payment-confirmed" } : item
        )
      );

      addTimelineEvent({
        title: "Payment matched",
        detail: "Incoming payment verified automatically. No screenshot check needed.",
        kind: "system",
      });
    }, 1200);

    const processingTimeout = window.setTimeout(() => {
      setOrders((prev) =>
        prev.map((item) =>
          item.id === "ord-live-demo" ? { ...item, status: "processing" } : item
        )
      );

      addTimelineEvent({
        title: activeScenario.businessViewLabel,
        detail: `${safeService} moved forward the second payment was confirmed.`,
        kind: "staff",
      });
    }, 2600);

    const readyTimeout = window.setTimeout(() => {
      setOrders((prev) =>
        prev.map((item) =>
          item.id === "ord-live-demo" ? { ...item, status: "ready" } : item
        )
      );

      addTimelineEvent({
        title: "Customer notified",
        detail: `${safeCustomer} can now see the job is ready without texting the shop.`,
        kind: "staff",
      });

      setProcessingFlow(false);
    }, 4300);

    timeoutRefs.current.push(confirmationTimeout, processingTimeout, readyTimeout);
  }

  return (
    <div className="min-h-screen bg-[#040b16] text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[540px] w-[780px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.14),rgba(251,191,36,0.04),transparent_68%)] blur-3xl" />
        <div className="absolute right-[-120px] top-[200px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.08),rgba(34,211,238,0.01),transparent_70%)] blur-3xl" />
        <div className="absolute left-[-120px] bottom-[160px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.09),rgba(20,184,166,0.02),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Pill className="border-amber-400/25 bg-amber-500/10 text-amber-200">
            <Zap className="h-3.5 w-3.5" />
            Live payment desk
          </Pill>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            No screenshots.
            <span className="block bg-[linear-gradient(90deg,#fde68a,#fbbf24,#f59e0b)] bg-clip-text text-transparent">
              The system already knows.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Customer pays. System confirms. Work keeps moving.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Pill className="border-emerald-500/20 bg-emerald-500/10 text-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              No manual verification
            </Pill>
            <Pill className="border-sky-500/20 bg-sky-500/10 text-sky-200">
              <Receipt className="h-3.5 w-3.5" />
              No screenshot proof
            </Pill>
            <Pill className="border-violet-500/20 bg-violet-500/10 text-violet-200">
              <LoaderCircle className="h-3.5 w-3.5" />
              Order releases automatically
            </Pill>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <Clock3 className="h-4 w-4 text-sky-300" />
              Live activity
            </div>

            <div className="flex flex-1 flex-wrap gap-2 lg:justify-end">
              {activityStrip.map((item) => (
                <div
                  key={item.id}
                  className="rounded-full border border-white/10 bg-[#071120] px-3 py-1.5 text-xs text-slate-300"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Business scenario</div>
              <div className="mt-1 text-sm text-slate-400">
                Switch the use case and make the board feel real.
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {scenarios.map((scenario) => {
                const active = scenario.id === scenarioId;

                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => setScenarioId(scenario.id)}
                    className={[
                      "rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition",
                      active
                        ? "border-amber-300/35 bg-[linear-gradient(180deg,rgba(251,191,36,0.18),rgba(251,191,36,0.08))] text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.12)]"
                        : "border-white/10 bg-[#071120] text-slate-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white",
                    ].join(" ")}
                  >
                    {scenario.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-200">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Gross tracked</div>
                <div className="mt-1 text-2xl font-semibold text-white">
                  {currency.format(totals.gross)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-2.5 text-sky-200">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Live orders</div>
                <div className="mt-1 text-2xl font-semibold text-white">{totals.liveCount}</div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-200">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Ready</div>
                <div className="mt-1 text-2xl font-semibold text-white">{totals.readyCount}</div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-2.5 text-violet-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Truth state</div>
                <div className="mt-1 text-2xl font-semibold text-white">Live</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.06fr_1.24fr]">
          <SectionCard
            title={activeScenario.boardTitle}
            subcopy={activeScenario.boardSubcopy}
            right={
              <Pill className="border-white/10 bg-white/[0.05] text-slate-300">
                <Sparkles className="h-3.5 w-3.5" />
                Operational demo
              </Pill>
            }
          >
            <div className="grid gap-4">
              <div className="rounded-[24px] border border-amber-500/20 bg-[linear-gradient(180deg,rgba(251,191,36,0.10),rgba(251,191,36,0.03))] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Payment intake</div>
                    <div className="mt-1 text-sm text-slate-300">payments@homeplanet.city</div>
                  </div>

                  <button
                    type="button"
                    onClick={copyZelleHandle}
                    className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-500/15"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied" : "Copy handle"}
                  </button>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Method</div>
                    <div className="mt-2 flex items-center gap-2 text-white">
                      <Banknote className="h-4 w-4 text-emerald-300" />
                      {activeScenario.paymentMethod}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Verification</div>
                    <div className="mt-2 flex items-center gap-2 text-white">
                      <ShieldCheck className="h-4 w-4 text-amber-300" />
                      Automatic truth match
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Release action</div>
                    <div className="mt-2 flex items-center gap-2 text-white">
                      <ArrowRight className="h-4 w-4 text-sky-300" />
                      Work moves instantly
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Customer</span>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#071120] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/35"
                    placeholder="Matthew M."
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-slate-300">Service</span>
                  <input
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#071120] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/35"
                    placeholder="Logo deposit"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Amount</span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                    className="w-full rounded-2xl border border-white/10 bg-[#071120] py-3 pl-8 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400/35"
                    placeholder="75"
                  />
                </div>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={runPaymentDemo}
                  disabled={processingFlow}
                  className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-amber-400/25 bg-[linear-gradient(180deg,#fbbf24,#d58d0f)] px-4 py-3 text-sm font-semibold text-[#1d1300] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Zap className="h-4 w-4" />
                  {processingFlow ? "Running live flow..." : "Send payment"}
                </button>

                <button
                  type="button"
                  onClick={resetDemo}
                  className="inline-flex items-center justify-center gap-2 rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                >
                  <TimerReset className="h-4 w-4" />
                  Reset demo
                </button>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-[24px] border border-white/8 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Customer view</div>
                  <div className="mt-3 text-base font-semibold text-white">
                    {activeScenario.customerViewLabel}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    Customer sees clear payment state immediately.
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/8 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Business view</div>
                  <div className="mt-3 text-base font-semibold text-white">
                    {activeScenario.businessViewLabel}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    Staff sees verified payment and can move the job forward.
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white">Live payment state</div>
                    <div className="mt-1 text-sm text-slate-400">
                      What the customer sees is what the business sees.
                    </div>
                  </div>
                  <div
                    className={[
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                      statusMeta[currentDemoStatus].border,
                      statusMeta[currentDemoStatus].bg,
                      statusMeta[currentDemoStatus].text,
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-2.5 w-2.5 rounded-full",
                        statusMeta[currentDemoStatus].dot,
                      ].join(" ")}
                    />
                    {statusMeta[currentDemoStatus].label}
                  </div>
                </div>

                <div className="mt-4 h-2 rounded-full bg-white/8">
                  <div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,#fde68a,#fbbf24,#14b8a6)] transition-all duration-500"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-5 gap-2 text-center text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  <div className={statusIndex(currentDemoStatus) >= 0 ? "text-amber-200" : ""}>
                    Waiting
                  </div>
                  <div className={statusIndex(currentDemoStatus) >= 1 ? "text-sky-200" : ""}>
                    Sent
                  </div>
                  <div className={statusIndex(currentDemoStatus) >= 2 ? "text-emerald-200" : ""}>
                    Confirmed
                  </div>
                  <div className={statusIndex(currentDemoStatus) >= 3 ? "text-violet-200" : ""}>
                    Processing
                  </div>
                  <div className={statusIndex(currentDemoStatus) >= 4 ? "text-teal-200" : ""}>
                    Ready
                  </div>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.012))] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Last matched payment
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-white">
                        {lastMatchedOrder?.customer ?? "No active payment"}
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        {lastMatchedOrder?.service ?? "Waiting for incoming payment"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-semibold text-white">
                        {lastMatchedOrder ? currency.format(lastMatchedOrder.amount) : "$0.00"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {lastMatchedOrder?.createdAtLabel ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.012))] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Intake methods
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200">
                      Zelle
                    </div>
                    <div className="rounded-full border border-sky-500/15 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-200">
                      Tap to Pay
                    </div>
                    <div className="rounded-full border border-violet-500/15 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200">
                      QR Checkout
                    </div>
                    <div className="rounded-full border border-amber-500/15 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200">
                      Card Invoice
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-slate-400">
                    Real businesses don’t use one perfect payment path. The board should still know.
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-6">
            <SectionCard
              title="Live order board"
              subcopy="Payment event becomes visible operational state immediately."
              right={
                <Pill className="border-emerald-500/20 bg-emerald-500/10 text-emerald-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Shared truth
                </Pill>
              }
            >
              <div className="grid gap-3">
                {orders.map((order) => {
                  const meta = statusMeta[order.status];

                  return (
                    <div
                      key={order.id}
                      className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-base font-semibold text-white">{order.customer}</div>
                            <div className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                              {order.paymentMethod}
                            </div>
                          </div>
                          <div className="mt-1 text-sm text-slate-400">{order.service}</div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-white">
                              {currency.format(order.amount)}
                            </div>
                            <div className="text-xs text-slate-500">{order.createdAtLabel}</div>
                          </div>

                          <div
                            className={[
                              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
                              meta.border,
                              meta.bg,
                              meta.text,
                            ].join(" ")}
                          >
                            <span className={["h-2.5 w-2.5 rounded-full", meta.dot].join(" ")} />
                            {meta.short}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard
              title="Truth timeline"
              subcopy="The event itself is the receipt."
              right={
                <Pill className="border-sky-500/20 bg-sky-500/10 text-sky-200">
                  <Receipt className="h-3.5 w-3.5" />
                  Live log
                </Pill>
              }
            >
              <div className="space-y-3">
                {timeline.map((event) => {
                  const tone =
                    event.kind === "system"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                      : event.kind === "staff"
                      ? "border-violet-500/20 bg-violet-500/10 text-violet-200"
                      : "border-sky-500/20 bg-sky-500/10 text-sky-200";

                  return (
                    <div
                      key={event.id}
                      className="rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.012))] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white">{event.title}</div>
                          <div className="mt-1 text-sm leading-6 text-slate-400">{event.detail}</div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone}`}
                          >
                            {event.kind}
                          </div>
                          <div className="mt-2 text-xs text-slate-500">{event.timeLabel}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <SectionCard title="Old way vs HomePlanet" subcopy="Show the friction. Then show the release.">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-rose-500/15 bg-rose-500/[0.04] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-rose-200">Old way</div>
                <div className="mt-3 space-y-3 text-sm text-slate-300">
                  <div className="rounded-2xl border border-white/8 bg-black/20 px-3 py-2">
                    “Did you send it yet?”
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-black/20 px-3 py-2">
                    “Can you screenshot it?”
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-black/20 px-3 py-2">
                    Order waits for manual confirmation
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-emerald-500/15 bg-emerald-500/[0.04] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-200">
                  HomePlanet way
                </div>
                <div className="mt-3 space-y-3 text-sm text-slate-300">
                  <div className="rounded-2xl border border-white/8 bg-black/20 px-3 py-2">
                    Payment event is logged
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-black/20 px-3 py-2">
                    System verifies shared truth
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-black/20 px-3 py-2">
                    Board updates and work continues
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="One-line pitch" subcopy="Use this as the killer line.">
            <div className="rounded-[26px] border border-amber-400/20 bg-[linear-gradient(180deg,rgba(251,191,36,0.09),rgba(251,191,36,0.03))] p-5">
              <div className="text-xl font-semibold leading-8 text-white">
                Zelle shouldn’t create a second job for the business.
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Customer pays. System confirms. Order processes automatically.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-slate-300">
                HomePlanet payments layer
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
          Payment becomes visible truth the second it happens.
        </div>
      </div>
    </div>
  );
}