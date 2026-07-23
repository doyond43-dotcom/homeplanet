import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  CreditCard,
  DollarSign,
  House,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
  X,
} from "lucide-react";

type HomeServiceRequest = {
  service: string;
  jobType: string;
  timing: string;
  propertyArea: string;
  name: string;
  phone: string;
  notes: string;
  createdAt?: string;
  status?: string;
  estimate?: string;
  appointment?: string;
  paymentStatus?: string;
  proofStatus?: string;
};

type DetailPanel =
  | "details"
  | "communication"
  | "notes"
  | "history"
  | null;

const storageKey = "hp-demo-home-services-requests";

const sampleRequests: HomeServiceRequest[] = [
  {
    name: "Sarah Miller",
    phone: "863-555-0124",
    service: "Pressure Cleaning",
    jobType: "Driveway / Walkway",
    timing: "This week",
    propertyArea: "Driveway / walkway",
    notes:
      "Driveway and front walkway have dark buildup. Would like an estimate this week.",
    status: "Needs Estimate",
    createdAt: "2026-07-19T13:30:00.000Z",
  },
  {
    name: "Michael Torres",
    phone: "863-555-0168",
    service: "Handyman / Repairs",
    jobType: "Exterior Repair",
    timing: "Flexible",
    propertyArea: "Front yard / front exterior",
    notes:
      "Loose exterior trim near the front entry and one small gate repair.",
    status: "Review",
    createdAt: "2026-07-19T12:15:00.000Z",
  },
  {
    name: "Angela Brooks",
    phone: "863-555-0196",
    service: "Lawn & Yard Care",
    jobType: "Overgrown Property",
    timing: "As soon as possible",
    propertyArea: "Whole property",
    notes:
      "Grass is tall around the back and side yard. Need mowing, trimming, and cleanup.",
    status: "Scheduled",
    appointment: "Tuesday · 9:00 AM",
    createdAt: "2026-07-18T17:45:00.000Z",
  },
];

function cleanPhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

function statusClasses(status = "New Request") {
  const lower = status.toLowerCase();

  if (
    lower.includes("completed") ||
    lower === "paid" ||
    lower.includes("proof")
  ) {
    return "border-[#80df00]/45 bg-[#80df00]/10 text-[#c9ff83]";
  }

  if (
    lower.includes("payment") ||
    lower.includes("estimate") ||
    lower.includes("approval")
  ) {
    return "border-amber-300/35 bg-amber-300/10 text-amber-100";
  }

  if (
    lower.includes("scheduled") ||
    lower.includes("work")
  ) {
    return "border-sky-300/35 bg-sky-300/10 text-sky-100";
  }

  return "border-white/16 bg-white/[0.045] text-white/72";
}

function nextActionFor(status = "New Request") {
  switch (status) {
    case "New Request":
      return {
        eyebrow: "New Request",
        title: "Review what the customer needs.",
        action: "Start Review",
      };

    case "Review":
      return {
        eyebrow: "Review",
        title: "Decide the price and prepare the estimate.",
        action: "Create Estimate",
      };

    case "Needs Estimate":
      return {
        eyebrow: "Needs Estimate",
        title: "Create the estimate and send it to the customer.",
        action: "Create Estimate",
      };

    case "Estimate Sent":
      return {
        eyebrow: "Waiting On Customer",
        title: "The estimate is out. Record approval when they say yes.",
        action: "Mark Customer Approved",
      };

    case "Approved":
      return {
        eyebrow: "Approved",
        title: "Set the service date and confirm the visit.",
        action: "Schedule Visit",
      };

    case "Scheduled":
      return {
        eyebrow: "Scheduled",
        title: "When the crew arrives, start the job.",
        action: "Start Work",
      };

    case "Work In Progress":
      return {
        eyebrow: "Work In Progress",
        title: "Document the job and finish the work.",
        action: "Complete Work",
      };

    case "Payment Due":
      return {
        eyebrow: "Payment Due",
        title: "Collect payment for the completed work.",
        action: "Collect Payment",
      };

    case "Paid":
      return {
        eyebrow: "Paid",
        title: "Attach completion proof before closing the loop.",
        action: "Add Proof",
      };

    case "Proof Added":
      return {
        eyebrow: "Proof Added",
        title: "Follow up with the customer and ask for a review.",
        action: "Follow Up",
      };

    case "Follow-Up":
      return {
        eyebrow: "Follow-Up",
        title: "Everything is connected. Finish the job.",
        action: "Complete Job",
      };

    case "Completed":
      return {
        eyebrow: "Completed",
        title: "This job is complete and its history stays connected.",
        action: "Job Complete",
      };

    default:
      return {
        eyebrow: "Next Action",
        title: "Review this request and move it forward.",
        action: "Continue",
      };
  }
}

function buildMessage(
  type:
    | "followup"
    | "estimate"
    | "approval"
    | "schedule"
    | "payment"
    | "review",
  request: HomeServiceRequest,
) {
  const firstName = request.name?.split(" ")[0] || "there";
  const service = request.service || "home service";
  const jobType = request.jobType || "the work you requested";

  if (type === "estimate") {
    return `Hi ${firstName}, this is Okee Dokie Home Services. I reviewed your ${service} request for ${jobType}. I’m putting the estimate together now and will send the next step shortly.`;
  }

  if (type === "approval") {
    return `Hi ${firstName}, your estimate for ${jobType} is ready. Once you approve it, we can move directly into scheduling.`;
  }

  if (type === "schedule") {
    return `Hi ${firstName}, your ${service} request is approved. What day and time works best so we can get the work scheduled?`;
  }

  if (type === "payment") {
    return `Hi ${firstName}, the work for ${jobType} is complete and ready for payment. I can send the payment option now or confirm payment on-site.`;
  }

  if (type === "review") {
    return `Hi ${firstName}, just checking back after your ${service} work. If everything looks good, a quick review would mean a lot. Thank you for choosing Okee Dokie Home Services.`;
  }

  return `Hi ${firstName}, this is Okee Dokie Home Services. I received your request for ${jobType} and I’m reviewing the details now. I’ll keep everything moving from here.`;
}

export default function DemoHomeServicesBoardPage() {
  const [requests, setRequests] =
    useState<HomeServiceRequest[]>(sampleRequests);

  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [detailPanel, setDetailPanel] = useState<DetailPanel>(null);

  const [messageDraft, setMessageDraft] = useState("");
  const [estimate, setEstimate] = useState("");
  const [appointment, setAppointment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Not requested");
  const [proofStatus, setProofStatus] = useState("Not added");
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(storageKey) || "[]",
    ) as HomeServiceRequest[];

    if (saved.length > 0) {
      setRequests([...saved, ...sampleRequests]);
    }
  }, []);

  const active =
    activeIndex !== null
      ? requests[activeIndex] || null
      : null;

  useEffect(() => {
    if (!active) return;

    setMessageDraft(buildMessage("followup", active));
    setEstimate(active.estimate || "");
    setAppointment(active.appointment || "");
    setPaymentStatus(active.paymentStatus || "Not requested");
    setProofStatus(active.proofStatus || "Not added");
    setInternalNotes(active.notes || "");
    setActiveTool(null);
    setDetailPanel(null);
  }, [activeIndex]);

  const stats = useMemo(() => {
    return {
      total: requests.length,

      estimate: requests.filter((request) =>
        `${request.status}`.toLowerCase().includes("estimate"),
      ).length,

      scheduled: requests.filter((request) =>
        `${request.status}`.toLowerCase().includes("scheduled"),
      ).length,

      payment: requests.filter((request) =>
        `${request.status}`.toLowerCase().includes("payment"),
      ).length,
    };
  }, [requests]);

  function updateActive(
    changes: Partial<HomeServiceRequest>,
  ) {
    if (activeIndex === null) return;

    setRequests((current) =>
      current.map((request, index) =>
        index === activeIndex
          ? {
              ...request,
              ...changes,
            }
          : request,
      ),
    );
  }

  function updateStatus(status: string) {
    updateActive({ status });
    setActiveTool(null);
  }

  function toggleDetail(panel: DetailPanel) {
    setDetailPanel((current) =>
      current === panel ? null : panel,
    );
  }

  function chooseMessage(
    type:
      | "followup"
      | "estimate"
      | "approval"
      | "schedule"
      | "payment"
      | "review",
  ) {
    if (!active) return;
    setMessageDraft(buildMessage(type, active));
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(messageDraft);
    } catch {
      // Clipboard may be unavailable in some demo environments.
    }
  }

  function handlePrimaryAction() {
    if (!active) return;

    switch (active.status || "New Request") {
      case "New Request":
        updateStatus("Review");
        break;

      case "Review":
      case "Needs Estimate":
        setActiveTool("estimate");
        break;

      case "Estimate Sent":
        updateStatus("Approved");
        break;

      case "Approved":
        setActiveTool("schedule");
        break;

      case "Scheduled":
        updateStatus("Work In Progress");
        break;

      case "Work In Progress":
        setActiveTool("work");
        break;

      case "Payment Due":
        setActiveTool("payment");
        break;

      case "Paid":
        setActiveTool("proof");
        break;

      case "Proof Added":
        setActiveTool("followup");
        break;

      case "Follow-Up":
        updateStatus("Completed");
        break;

      default:
        break;
    }
  }

  function saveEstimate() {
    updateActive({
      estimate,
      status: "Estimate Sent",
    });

    chooseMessage("approval");
    setActiveTool(null);
  }

  function saveSchedule() {
    updateActive({
      appointment,
      status: "Scheduled",
    });

    chooseMessage("schedule");
    setActiveTool(null);
  }

  function completeWork() {
    updateActive({
      status: "Payment Due",
      paymentStatus: "Payment due",
    });

    setPaymentStatus("Payment due");
    chooseMessage("payment");
    setActiveTool(null);
  }

  function markPaid() {
    setPaymentStatus("Paid");

    updateActive({
      paymentStatus: "Paid",
      status: "Paid",
    });

    setActiveTool(null);
  }

  function addProof() {
    setProofStatus("Before + after proof added");

    updateActive({
      proofStatus: "Before + after proof added",
      status: "Proof Added",
    });

    setActiveTool(null);
  }

  function startFollowUp() {
    updateStatus("Follow-Up");
    chooseMessage("review");
  }

  if (!active) {
    return (
      <main className="min-h-screen bg-[#020706] px-4 py-5 text-white sm:px-6 lg:px-8">
        <section className="mx-auto max-w-[1280px]">
          <p className="text-sm text-white/60">
            No active request selected.
          </p>
        </section>
      </main>
    );
  }

  const nextAction = nextActionFor(active.status);

  const showProofStage = [
    "Work In Progress",
    "Payment Due",
    "Paid",
    "Proof Added",
    "Follow-Up",
    "Completed",
  ].includes(active.status || "");

  return (
    <main className="min-h-screen bg-[#020706] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(126,224,0,0.045),transparent_32%)]" />

      <section className="relative mx-auto max-w-[1380px]">
        {/* HEADER / LIGHT INTELLIGENCE */}
        <header className="rounded-[2rem] border border-[#80df00]/25 bg-[linear-gradient(135deg,rgba(5,13,8,0.98),rgba(0,5,3,0.98))] p-5 shadow-[0_0_60px_rgba(126,224,0,0.05)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#80df00]/45 bg-[#80df00]/10">
                  <House
                    className="h-5 w-5 text-[#80df00]"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#80df00]">
                    Okee Dokie Home Services
                  </p>

                  <p className="mt-1 text-xs font-bold text-white/45">
                    HomePlanet Demo System
                  </p>
                </div>
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                The working side.
              </h1>

              <p className="mt-3 max-w-[720px] text-sm leading-6 text-white/58">
                See what needs attention, open one customer, and handle the
                next step. The rest stays out of the way until it matters.
              </p>
            </div>

            <a
              href="/planet/demo/home-services"
              className="flex min-h-[48px] w-fit items-center justify-center gap-2 rounded-2xl border border-[#80df00]/35 bg-[#80df00]/[0.06] px-5 text-sm font-black transition hover:border-[#80df00]/70 hover:bg-[#80df00]/10"
            >
              View Public Live Page
              <ChevronRight
                className="h-4 w-4 text-[#80df00]"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Active Requests",
                value: stats.total,
                icon: ClipboardList,
              },
              {
                label: "Needs Estimate",
                value: stats.estimate,
                icon: DollarSign,
              },
              {
                label: "Scheduled",
                value: stats.scheduled,
                icon: CalendarDays,
              },
              {
                label: "Payment Due",
                value: stats.payment,
                icon: CreditCard,
              },
            ].map(({ label, value, icon: Icon }) => (
              <article
                key={label}
                className="rounded-[1.35rem] border border-white/10 bg-black/35 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                    {label}
                  </p>

                  <Icon
                    className="h-4 w-4 text-[#80df00]"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-2 text-3xl font-black">
                  {value}
                </p>
              </article>
            ))}
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.76fr_1.44fr]">
          {/* AWARENESS */}
          <aside className="rounded-[2rem] border border-white/10 bg-black/35 p-4 sm:p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#80df00]">
              Awareness
            </p>

            <h2 className="mt-2 text-2xl font-black">
              What needs attention?
            </h2>

            <div className="mt-5 grid gap-3">
              {requests.map((request, index) => {
                const selected = activeIndex === index;

                return (
                  <button
                    key={`${request.name}-${request.createdAt}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`rounded-[1.5rem] border p-4 text-left transition ${
                      selected
                        ? "border-[#80df00]/65 bg-[#80df00]/[0.065]"
                        : "border-white/10 bg-white/[0.025] hover:border-[#80df00]/35 hover:bg-[#80df00]/[0.035]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-black">
                          {request.name || "New Customer"}
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#80df00]">
                          {request.service}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${statusClasses(
                          request.status,
                        )}`}
                      >
                        {request.status || "New"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-white/64">
                      {request.jobType}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#80df00]">
                      Open Work Drawer
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ACTIVE WORK DRAWER */}
          <section className="overflow-hidden rounded-[2rem] border border-[#80df00]/35 bg-[#07100b] shadow-[0_0_65px_rgba(126,224,0,0.055)]">
            <div className="border-b border-[#80df00]/18 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#80df00]">
                    Active Work Drawer
                  </p>

                  <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
                    {active.name}
                  </h2>

                  <p className="mt-2 font-bold text-white/74">
                    {active.service} · {active.jobType}
                  </p>

                  <p className="mt-1 text-sm text-white/44">
                    {active.propertyArea} · {active.timing}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  aria-label="Close active work drawer"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-black/30 text-white/50 transition hover:border-[#80df00]/45 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] ${statusClasses(
                    active.status,
                  )}`}
                >
                  {active.status || "New Request"}
                </span>

                <a
                  href={`tel:${cleanPhone(active.phone || "")}`}
                  className="flex min-h-[38px] items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 text-xs font-black"
                >
                  <Phone className="h-4 w-4 text-[#80df00]" />
                  Call
                </a>

                <a
                  href={`sms:${cleanPhone(active.phone || "")}`}
                  className="flex min-h-[38px] items-center gap-2 rounded-full border border-white/12 bg-black/30 px-4 text-xs font-black"
                >
                  <MessageCircle className="h-4 w-4 text-[#80df00]" />
                  Text
                </a>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              {/* ONE NEXT ACTION */}
              <article className="rounded-[1.75rem] border border-[#80df00]/35 bg-[#80df00]/[0.055] p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#80df00]">
                  {nextAction.eyebrow}
                </p>

                <h3 className="mt-3 max-w-[650px] text-3xl font-black leading-tight tracking-[-0.04em]">
                  {nextAction.title}
                </h3>

                {active.status !== "Completed" && (
                  <button
                    type="button"
                    onClick={handlePrimaryAction}
                    className="mt-6 min-h-[58px] w-full rounded-2xl bg-[#80df00] px-6 text-base font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19] sm:w-fit"
                  >
                    {nextAction.action}
                  </button>
                )}

                {active.status === "Completed" && (
                  <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#80df00]/30 bg-black/25 px-4 py-4">
                    <Check className="h-5 w-5 text-[#80df00]" />
                    <span className="font-bold text-white/78">
                      Job complete. Nothing else needs attention.
                    </span>
                  </div>
                )}
              </article>

              {/* CONTEXTUAL TOOL */}
              {activeTool === "estimate" && (
                <article className="mt-5 rounded-[1.75rem] border border-white/12 bg-black/35 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                        Estimate
                      </p>

                      <h3 className="mt-2 text-2xl font-black">
                        What should this job cost?
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTool(null)}
                      className="rounded-xl border border-white/10 p-2 text-white/50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <input
                    value={estimate}
                    onChange={(event) => setEstimate(event.target.value)}
                    placeholder="Example: $225"
                    className="mt-5 min-h-[56px] w-full rounded-2xl border border-white/14 bg-[#020706] px-4 text-white outline-none focus:border-[#80df00]/65"
                  />

                  <button
                    type="button"
                    onClick={saveEstimate}
                    className="mt-3 w-full rounded-2xl bg-[#80df00] px-4 py-4 font-black text-black"
                  >
                    Send Estimate
                  </button>
                </article>
              )}

              {activeTool === "schedule" && (
                <article className="mt-5 rounded-[1.75rem] border border-white/12 bg-black/35 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                    Schedule
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    When should the work happen?
                  </h3>

                  <input
                    value={appointment}
                    onChange={(event) =>
                      setAppointment(event.target.value)
                    }
                    placeholder="Example: Tuesday · 9:00 AM"
                    className="mt-5 min-h-[56px] w-full rounded-2xl border border-white/14 bg-[#020706] px-4 text-white outline-none focus:border-[#80df00]/65"
                  />

                  <button
                    type="button"
                    onClick={saveSchedule}
                    className="mt-3 w-full rounded-2xl bg-[#80df00] px-4 py-4 font-black text-black"
                  >
                    Confirm Schedule
                  </button>
                </article>
              )}

              {activeTool === "work" && (
                <article className="mt-5 rounded-[1.75rem] border border-white/12 bg-black/35 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                    Work
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    Finish the job and move it forward.
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/56">
                    Before proof can be captured now. After proof appears with
                    the completed job history.
                  </p>

                  <button
                    type="button"
                    onClick={completeWork}
                    className="mt-5 w-full rounded-2xl bg-[#80df00] px-4 py-4 font-black text-black"
                  >
                    Work Completed
                  </button>
                </article>
              )}

              {activeTool === "payment" && (
                <article className="mt-5 rounded-[1.75rem] border border-white/12 bg-black/35 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                    Payment
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    Collect payment.
                  </h3>

                  <p className="mt-3 text-sm text-white/56">
                    Status: {paymentStatus}
                  </p>

                  <button
                    type="button"
                    onClick={markPaid}
                    className="mt-5 w-full rounded-2xl bg-[#80df00] px-4 py-4 font-black text-black"
                  >
                    Payment Received
                  </button>
                </article>
              )}

              {activeTool === "proof" && (
                <article className="mt-5 rounded-[1.75rem] border border-white/12 bg-black/35 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                    Job Proof
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    Attach the finished result.
                  </h3>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="overflow-hidden rounded-[1.4rem] border border-white/10">
                      <img
                        src="/images/okee-dokie-home-services-hero.png"
                        alt="Demo before service proof"
                        className="aspect-[4/3] w-full object-cover object-[18%_center]"
                      />

                      <div className="bg-black/40 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#80df00]">
                          Before
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          Arrival condition
                        </p>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.4rem] border border-white/10">
                      <img
                        src="/images/okee-dokie-home-services-hero.png"
                        alt="Demo after service proof"
                        className="aspect-[4/3] w-full object-cover object-[82%_center]"
                      />

                      <div className="bg-black/40 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#80df00]">
                          After
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          Finished result
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addProof}
                    className="mt-5 w-full rounded-2xl bg-[#80df00] px-4 py-4 font-black text-black"
                  >
                    Save Completion Proof
                  </button>
                </article>
              )}

              {activeTool === "followup" && (
                <article className="mt-5 rounded-[1.75rem] border border-white/12 bg-black/35 p-5">
                  <div className="flex items-center gap-3">
                    <Star className="h-6 w-6 text-[#80df00]" />

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                        Follow-Up
                      </p>

                      <h3 className="mt-1 text-2xl font-black">
                        Close the loop.
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={startFollowUp}
                    className="mt-5 w-full rounded-2xl bg-[#80df00] px-4 py-4 font-black text-black"
                  >
                    Prepare Customer Follow-Up
                  </button>
                </article>
              )}

              {/* PROOF SUMMARY ONLY WHEN RELEVANT */}
              {showProofStage && (
                <article className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Camera className="h-5 w-5 text-[#80df00]" />

                      <div>
                        <p className="text-sm font-black">
                          Job Proof
                        </p>

                        <p className="mt-1 text-xs text-white/46">
                          {proofStatus}
                        </p>
                      </div>
                    </div>

                    {["Paid", "Proof Added", "Follow-Up", "Completed"].includes(
                      active.status || "",
                    ) && (
                      <span className="rounded-full border border-[#80df00]/30 bg-[#80df00]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#c9ff83]">
                        Available
                      </span>
                    )}
                  </div>
                </article>
              )}

              {/* COLLAPSED SUPPORTING INFO */}
              <div className="mt-6 space-y-2">
                {[
                  {
                    id: "details" as DetailPanel,
                    label: "Customer Details",
                    icon: ClipboardList,
                  },
                  {
                    id: "communication" as DetailPanel,
                    label: "Communication",
                    icon: MessageCircle,
                  },
                  {
                    id: "notes" as DetailPanel,
                    label: "Job Notes",
                    icon: Wrench,
                  },
                  {
                    id: "history" as DetailPanel,
                    label: "Job History",
                    icon: ShieldCheck,
                  },
                ].map(({ id, label, icon: Icon }) => {
                  const open = detailPanel === id;

                  return (
                    <div
                      key={label}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-black/25"
                    >
                      <button
                        type="button"
                        onClick={() => toggleDetail(id)}
                        className="flex min-h-[56px] w-full items-center justify-between gap-4 px-4 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-[#80df00]" />

                          <span className="font-black">
                            {label}
                          </span>
                        </div>

                        {open ? (
                          <ChevronUp className="h-5 w-5 text-white/45" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-white/45" />
                        )}
                      </button>

                      {open && id === "details" && (
                        <div className="border-t border-white/10 p-4">
                          <dl className="grid gap-4 sm:grid-cols-2">
                            {[
                              ["Service", active.service],
                              ["Job Type", active.jobType],
                              ["Timing", active.timing],
                              ["Property Area", active.propertyArea],
                              ["Phone", active.phone],
                            ].map(([labelName, value]) => (
                              <div key={labelName}>
                                <dt className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
                                  {labelName}
                                </dt>

                                <dd className="mt-1 font-bold text-white/78">
                                  {value || "Not provided"}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}

                      {open && id === "communication" && (
                        <div className="border-t border-white/10 p-4">
                          <div className="flex flex-wrap gap-2">
                            {[
                              ["Follow Up", "followup"],
                              ["Estimate", "estimate"],
                              ["Approval", "approval"],
                              ["Schedule", "schedule"],
                              ["Payment", "payment"],
                              ["Review", "review"],
                            ].map(([labelName, type]) => (
                              <button
                                key={labelName}
                                type="button"
                                onClick={() =>
                                  chooseMessage(
                                    type as
                                      | "followup"
                                      | "estimate"
                                      | "approval"
                                      | "schedule"
                                      | "payment"
                                      | "review",
                                  )
                                }
                                className="rounded-xl border border-white/12 bg-black/30 px-3 py-2 text-xs font-black"
                              >
                                {labelName}
                              </button>
                            ))}
                          </div>

                          <textarea
                            value={messageDraft}
                            onChange={(event) =>
                              setMessageDraft(event.target.value)
                            }
                            className="mt-4 min-h-[120px] w-full rounded-2xl border border-white/12 bg-[#020706] p-4 text-sm leading-6 text-white outline-none focus:border-[#80df00]/65"
                          />

                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <button
                              type="button"
                              onClick={copyMessage}
                              className="rounded-2xl border border-[#80df00]/30 bg-[#80df00]/[0.06] px-4 py-3 text-sm font-black"
                            >
                              Copy Message
                            </button>

                            <a
                              href={`sms:${cleanPhone(
                                active.phone || "",
                              )}?&body=${encodeURIComponent(messageDraft)}`}
                              className="flex items-center justify-center rounded-2xl bg-[#80df00] px-4 py-3 text-sm font-black text-black"
                            >
                              Open Text
                            </a>
                          </div>
                        </div>
                      )}

                      {open && id === "notes" && (
                        <div className="border-t border-white/10 p-4">
                          <textarea
                            value={internalNotes}
                            onChange={(event) =>
                              setInternalNotes(event.target.value)
                            }
                            className="min-h-[130px] w-full rounded-2xl border border-white/12 bg-[#020706] p-4 text-sm leading-6 text-white outline-none focus:border-[#80df00]/65"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              updateActive({
                                notes: internalNotes,
                              })
                            }
                            className="mt-3 w-full rounded-2xl border border-[#80df00]/30 bg-[#80df00]/[0.06] px-4 py-3 font-black"
                          >
                            Save Notes
                          </button>
                        </div>
                      )}

                      {open && id === "history" && (
                        <div className="border-t border-white/10 p-4">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-white/50">
                            {[
                              "Request",
                              "Review",
                              "Estimate",
                              "Approval",
                              "Schedule",
                              "Work",
                              "Payment",
                              "Proof",
                              "Follow-Up",
                              "Completed",
                            ].map((step, index, array) => (
                              <div
                                key={step}
                                className="flex items-center gap-2"
                              >
                                <span>{step}</span>

                                {index < array.length - 1 && (
                                  <ChevronRight className="h-3.5 w-3.5 text-[#80df00]" />
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#80df00]/20 bg-[#80df00]/[0.04] p-4">
                            <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#80df00]" />

                            <p className="text-sm leading-6 text-white/58">
                              The customer, decisions, work, payment, proof,
                              and outcome stay connected without making the
                              operator stare at all of it at once.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
