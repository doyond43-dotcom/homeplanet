import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  CreditCard,
  DollarSign,
  House,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
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

const workflowStages = [
  "New Request",
  "Review",
  "Needs Estimate",
  "Estimate Sent",
  "Approved",
  "Scheduled",
  "Work In Progress",
  "Payment Due",
  "Paid",
  "Proof Added",
  "Follow-Up",
  "Completed",
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
    lower.includes("work in progress")
  ) {
    return "border-sky-300/35 bg-sky-300/10 text-sky-100";
  }

  return "border-white/16 bg-white/[0.045] text-white/72";
}

function nextActionFor(status = "New Request") {
  switch (status) {
    case "New Request":
      return "Review the request and confirm what the customer needs.";
    case "Review":
      return "Prepare an estimate or ask for any missing details.";
    case "Needs Estimate":
      return "Create the estimate and send it to the customer.";
    case "Estimate Sent":
      return "Wait for approval or follow up with the customer.";
    case "Approved":
      return "Set the service date and confirm the schedule.";
    case "Scheduled":
      return "Prepare for the visit and capture before-work proof.";
    case "Work In Progress":
      return "Finish the work and move the job toward payment.";
    case "Payment Due":
      return "Collect or confirm payment.";
    case "Paid":
      return "Add completion proof and close the job properly.";
    case "Proof Added":
      return "Send follow-up and request a review.";
    case "Follow-Up":
      return "Confirm the customer is satisfied and complete the job.";
    case "Completed":
      return "Job complete. History stays attached to the request.";
    default:
      return "Review the request and choose the next action.";
  }
}

function buildMessage(
  type: "followup" | "estimate" | "approval" | "schedule" | "payment" | "review",
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

  const [activeIndex, setActiveIndex] = useState(0);

  const [messageDraft, setMessageDraft] = useState("");

  const [estimate, setEstimate] = useState("");

  const [appointment, setAppointment] = useState("");

  const [paymentStatus, setPaymentStatus] =
    useState("Not requested");

  const [proofStatus, setProofStatus] =
    useState("Not added");

  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem(storageKey) || "[]",
    ) as HomeServiceRequest[];

    if (saved.length > 0) {
      setRequests([...saved, ...sampleRequests]);
    }
  }, []);

  const active = requests[activeIndex] || requests[0];

  useEffect(() => {
    if (!active) return;

    setMessageDraft(buildMessage("followup", active));
    setEstimate(active.estimate || "");
    setAppointment(active.appointment || "");
    setPaymentStatus(active.paymentStatus || "Not requested");
    setProofStatus(active.proofStatus || "Not added");
    setInternalNotes(active.notes || "");
  }, [activeIndex, active]);

  const stats = useMemo(() => {
    return {
      total: requests.length,

      estimate: requests.filter((request) =>
        `${request.status}`
          .toLowerCase()
          .includes("estimate"),
      ).length,

      scheduled: requests.filter((request) =>
        `${request.status}`
          .toLowerCase()
          .includes("scheduled"),
      ).length,

      payment: requests.filter((request) =>
        `${request.status}`
          .toLowerCase()
          .includes("payment"),
      ).length,
    };
  }, [requests]);

  function updateActive(
    changes: Partial<HomeServiceRequest>,
  ) {
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
    setMessageDraft(buildMessage(type, active));
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(messageDraft);
    } catch {
      // Clipboard may be unavailable in some demo environments.
    }
  }

  function saveEstimate() {
    updateActive({
      estimate,
      status: "Estimate Sent",
    });

    chooseMessage("approval");
  }

  function saveSchedule() {
    updateActive({
      appointment,
      status: "Scheduled",
    });

    chooseMessage("schedule");
  }

  function markWorkStarted() {
    updateStatus("Work In Progress");
  }

  function markWorkComplete() {
    updateStatus("Payment Due");
    setPaymentStatus("Payment due");
    chooseMessage("payment");
  }

  function markPaid() {
    setPaymentStatus("Paid");

    updateActive({
      paymentStatus: "Paid",
      status: "Paid",
    });
  }

  function addProof() {
    setProofStatus("Before + after proof added");

    updateActive({
      proofStatus: "Before + after proof added",
      status: "Proof Added",
    });
  }

  function completeFollowUp() {
    updateStatus("Completed");
    chooseMessage("review");
  }

  return (
    <main className="min-h-screen bg-[#020706] px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(126,224,0,0.045),transparent_32%)]" />

      <section className="relative mx-auto max-w-[1380px]">
        {/* BOARD HEADER */}
        <header className="rounded-[2rem] border border-[#80df00]/25 bg-[linear-gradient(135deg,rgba(5,13,8,0.98),rgba(0,5,3,0.98))] p-5 shadow-[0_0_60px_rgba(126,224,0,0.05)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#80df00]/45 bg-[#80df00]/10">
                  <House
                    className="h-6 w-6 text-[#80df00]"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#80df00]">
                    Okee Dokie Home Services
                  </p>

                  <p className="mt-1 text-sm font-bold text-white/48">
                    HomePlanet Demo System
                  </p>
                </div>
              </div>

              <h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl">
                The working side.
              </h1>

              <p className="mt-4 max-w-[760px] text-base leading-7 text-white/62">
                Customer requests from the public Live Page become active work.
                Review the request, move the next action forward, schedule the
                job, collect payment, attach proof, and close the loop.
              </p>
            </div>

            <a
              href="/planet/demo/home-services"
              className="flex min-h-[50px] w-fit items-center justify-center gap-2 rounded-2xl border border-[#80df00]/35 bg-[#80df00]/[0.06] px-5 text-sm font-black transition hover:border-[#80df00]/70 hover:bg-[#80df00]/10"
            >
              View Public Live Page
              <ChevronRight
                className="h-4 w-4 text-[#80df00]"
                aria-hidden="true"
              />
            </a>
          </div>

          {/* INTELLIGENCE SNAPSHOT */}
          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
                className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/42">
                    {label}
                  </p>

                  <Icon
                    className="h-5 w-5 text-[#80df00]"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-3 text-4xl font-black tracking-[-0.04em]">
                  {value}
                </p>
              </article>
            ))}
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.78fr_1.45fr]">
          {/* AWARENESS CARDS */}
          <aside className="rounded-[2rem] border border-white/10 bg-black/35 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#80df00]">
                  Awareness
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Requests needing attention
                </h2>
              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-xs font-black text-white/56">
                {requests.length}
              </span>
            </div>

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
                        ? "border-[#80df00]/65 bg-[#80df00]/[0.065] shadow-[0_0_30px_rgba(126,224,0,0.06)]"
                        : "border-white/10 bg-white/[0.025] hover:-translate-y-0.5 hover:border-[#80df00]/35 hover:bg-[#80df00]/[0.035]"
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
                        {request.status || "New Request"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-white/62">
                      {request.jobType}
                    </p>

                    <p className="mt-1 text-xs text-white/38">
                      {request.propertyArea || "Property area not provided"}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#80df00]">
                      Open Workspace
                      <ChevronRight
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ACTIVE WORKSPACE */}
          <section className="overflow-hidden rounded-[2rem] border border-[#80df00]/32 bg-[#07100b] shadow-[0_0_65px_rgba(126,224,0,0.055)]">
            {/* WORKSPACE HEADER */}
            <div className="border-b border-[#80df00]/20 bg-[radial-gradient(circle_at_top_left,rgba(126,224,0,0.08),transparent_34%),rgba(0,0,0,0.28)] p-5 sm:p-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#80df00]">
                    Active Workspace
                  </p>

                  <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
                    {active.name || "New Customer"}
                  </h2>

                  <p className="mt-2 text-base font-bold text-white/76">
                    {active.service} · {active.jobType}
                  </p>

                  <p className="mt-1 text-sm text-white/48">
                    {active.propertyArea || "Property area needed"} ·{" "}
                    {active.timing || "Timing needed"}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] ${statusClasses(
                    active.status,
                  )}`}
                >
                  {active.status || "New Request"}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a
                  href={`tel:${cleanPhone(active.phone || "")}`}
                  className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-[#80df00] px-5 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19]"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Call
                </a>

                <a
                  href={`sms:${cleanPhone(
                    active.phone || "",
                  )}?&body=${encodeURIComponent(messageDraft)}`}
                  className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-[#80df00]/40 bg-[#80df00]/[0.07] px-5 font-black transition hover:border-[#80df00]/75 hover:bg-[#80df00]/12"
                >
                  <MessageCircle
                    className="h-5 w-5 text-[#80df00]"
                    aria-hidden="true"
                  />
                  Text Draft
                </a>

                <button
                  type="button"
                  onClick={() => updateStatus("Review")}
                  className="min-h-[54px] rounded-2xl border border-white/14 bg-black/40 px-5 font-black transition hover:border-[#80df00]/50 hover:bg-[#80df00]/[0.055]"
                >
                  Start Review
                </button>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:p-7">
              {/* NEXT ACTION */}
              <article className="rounded-[1.75rem] border border-[#80df00]/30 bg-[#80df00]/[0.045] p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#80df00]">
                  Next Action
                </p>

                <h3 className="mt-3 text-2xl font-black tracking-[-0.03em]">
                  {nextActionFor(active.status)}
                </h3>

                <div className="mt-5 flex flex-wrap gap-2">
                  {workflowStages.map((stage) => {
                    const activeStage =
                      (active.status || "New Request") === stage;

                    return (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => updateStatus(stage)}
                        className={`rounded-full border px-3 py-2 text-[9px] font-black uppercase tracking-[0.11em] transition ${
                          activeStage
                            ? "border-[#80df00] bg-[#80df00] text-black"
                            : "border-white/12 bg-black/30 text-white/48 hover:border-[#80df00]/40 hover:text-white"
                        }`}
                      >
                        {stage}
                      </button>
                    );
                  })}
                </div>
              </article>

              {/* REQUEST CONTEXT */}
              <div className="grid gap-4 xl:grid-cols-2">
                <article className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#80df00]">
                    Customer Request
                  </p>

                  <dl className="mt-5 space-y-4">
                    {[
                      ["Service", active.service],
                      ["Job Type", active.jobType],
                      ["Timing", active.timing || "Not provided"],
                      [
                        "Property Area",
                        active.propertyArea || "Not provided",
                      ],
                      ["Phone", active.phone || "Not provided"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="border-b border-white/8 pb-3 last:border-0 last:pb-0"
                      >
                        <dt className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                          {label}
                        </dt>

                        <dd className="mt-1 font-bold text-white/82">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </article>

                <article className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#80df00]">
                    Job Notes
                  </p>

                  <textarea
                    value={internalNotes}
                    onChange={(event) =>
                      setInternalNotes(event.target.value)
                    }
                    className="mt-4 min-h-[215px] w-full resize-y rounded-2xl border border-white/12 bg-[#020706] p-4 text-sm leading-6 text-white outline-none transition focus:border-[#80df00]/65"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      updateActive({
                        notes: internalNotes,
                      })
                    }
                    className="mt-3 w-full rounded-2xl border border-[#80df00]/30 bg-[#80df00]/[0.06] px-4 py-3 text-sm font-black transition hover:border-[#80df00]/65 hover:bg-[#80df00]/10"
                  >
                    Save Notes
                  </button>
                </article>
              </div>

              {/* MESSAGE WORKSPACE */}
              <article className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5 sm:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#80df00]">
                      Customer Communication
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Ready-to-send message
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      ["Follow Up", "followup"],
                      ["Estimate", "estimate"],
                      ["Approval", "approval"],
                      ["Schedule", "schedule"],
                      ["Payment", "payment"],
                      ["Review", "review"],
                    ].map(([label, type]) => (
                      <button
                        key={label}
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
                        className="rounded-xl border border-white/12 bg-black/30 px-3 py-2 text-xs font-black transition hover:border-[#80df00]/45 hover:bg-[#80df00]/[0.05]"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={messageDraft}
                  onChange={(event) =>
                    setMessageDraft(event.target.value)
                  }
                  className="mt-4 min-h-[135px] w-full rounded-2xl border border-white/12 bg-[#020706] p-4 text-sm leading-6 text-white outline-none transition focus:border-[#80df00]/65"
                />

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={copyMessage}
                    className="min-h-[48px] rounded-2xl border border-[#80df00]/30 bg-[#80df00]/[0.06] px-4 text-sm font-black"
                  >
                    Copy Message
                  </button>

                  <a
                    href={`sms:${cleanPhone(
                      active.phone || "",
                    )}?&body=${encodeURIComponent(messageDraft)}`}
                    className="flex min-h-[48px] items-center justify-center rounded-2xl bg-[#80df00] px-4 text-sm font-black text-black"
                  >
                    Open Text
                  </a>
                </div>
              </article>

              {/* ESTIMATE + APPROVAL */}
              <div className="grid gap-4 xl:grid-cols-2">
                <article className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
                  <div className="flex items-center gap-3">
                    <DollarSign
                      className="h-6 w-6 text-[#80df00]"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                        Estimate
                      </p>

                      <h3 className="mt-1 text-xl font-black">
                        Price and approval
                      </h3>
                    </div>
                  </div>

                  <input
                    value={estimate}
                    onChange={(event) =>
                      setEstimate(event.target.value)
                    }
                    placeholder="Example: $225"
                    className="mt-5 min-h-[54px] w-full rounded-2xl border border-white/14 bg-[#020706] px-4 text-white outline-none focus:border-[#80df00]/65"
                  />

                  <div className="mt-3 grid gap-2">
                    <button
                      type="button"
                      onClick={saveEstimate}
                      className="rounded-2xl bg-[#80df00] px-4 py-3 font-black text-black"
                    >
                      Save + Mark Estimate Sent
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus("Approved")
                      }
                      className="rounded-2xl border border-[#80df00]/35 bg-[#80df00]/[0.06] px-4 py-3 font-black"
                    >
                      Customer Approved
                    </button>
                  </div>
                </article>

                {/* SCHEDULE */}
                <article className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      className="h-6 w-6 text-[#80df00]"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                        Schedule
                      </p>

                      <h3 className="mt-1 text-xl font-black">
                        Set the visit
                      </h3>
                    </div>
                  </div>

                  <input
                    value={appointment}
                    onChange={(event) =>
                      setAppointment(event.target.value)
                    }
                    placeholder="Example: Tuesday · 9:00 AM"
                    className="mt-5 min-h-[54px] w-full rounded-2xl border border-white/14 bg-[#020706] px-4 text-white outline-none focus:border-[#80df00]/65"
                  />

                  <button
                    type="button"
                    onClick={saveSchedule}
                    className="mt-3 w-full rounded-2xl bg-[#80df00] px-4 py-3 font-black text-black"
                  >
                    Confirm Schedule
                  </button>
                </article>
              </div>

              {/* WORK + PAYMENT */}
              <div className="grid gap-4 xl:grid-cols-2">
                <article className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
                  <div className="flex items-center gap-3">
                    <Wrench
                      className="h-6 w-6 text-[#80df00]"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                        Work
                      </p>

                      <h3 className="mt-1 text-xl font-black">
                        Move the job forward
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2">
                    <button
                      type="button"
                      onClick={markWorkStarted}
                      className="rounded-2xl border border-[#80df00]/35 bg-[#80df00]/[0.06] px-4 py-3 font-black"
                    >
                      Start Work
                    </button>

                    <button
                      type="button"
                      onClick={markWorkComplete}
                      className="rounded-2xl bg-[#80df00] px-4 py-3 font-black text-black"
                    >
                      Work Completed
                    </button>
                  </div>
                </article>

                <article className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
                  <div className="flex items-center gap-3">
                    <CreditCard
                      className="h-6 w-6 text-[#80df00]"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                        Payment
                      </p>

                      <h3 className="mt-1 text-xl font-black">
                        {paymentStatus}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentStatus(
                          "Payment request ready",
                        );

                        updateStatus("Payment Due");

                        chooseMessage("payment");
                      }}
                      className="rounded-2xl border border-[#80df00]/35 bg-[#80df00]/[0.06] px-4 py-3 font-black"
                    >
                      Prepare Payment Request
                    </button>

                    <button
                      type="button"
                      onClick={markPaid}
                      className="rounded-2xl bg-[#80df00] px-4 py-3 font-black text-black"
                    >
                      Payment Received
                    </button>
                  </div>
                </article>
              </div>

              {/* PROOF + FOLLOW-UP */}
              <div className="grid gap-4 xl:grid-cols-2">
                <article className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck
                      className="h-6 w-6 text-[#80df00]"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                        Proof
                      </p>

                      <h3 className="mt-1 text-xl font-black">
                        {proofStatus}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/56">
                    In a live business system this is where before photos,
                    after photos, completion notes, and customer confirmation
                    stay attached to the job.
                  </p>

                  <button
                    type="button"
                    onClick={addProof}
                    className="mt-5 w-full rounded-2xl bg-[#80df00] px-4 py-3 font-black text-black"
                  >
                    Add Completion Proof
                  </button>
                </article>

                <article className="rounded-[1.75rem] border border-white/10 bg-black/35 p-5">
                  <div className="flex items-center gap-3">
                    <Star
                      className="h-6 w-6 text-[#80df00]"
                      aria-hidden="true"
                    />

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                        Follow-Up
                      </p>

                      <h3 className="mt-1 text-xl font-black">
                        Close the loop
                      </h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateStatus("Follow-Up");
                        chooseMessage("review");
                      }}
                      className="rounded-2xl border border-[#80df00]/35 bg-[#80df00]/[0.06] px-4 py-3 font-black"
                    >
                      Prepare Review Request
                    </button>

                    <button
                      type="button"
                      onClick={completeFollowUp}
                      className="rounded-2xl bg-[#80df00] px-4 py-3 font-black text-black"
                    >
                      Complete Job
                    </button>
                  </div>
                </article>
              </div>

              {/* TRUTH CHAIN */}
              <article className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#80df00]">
                  Connected History
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-black text-white/54">
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
                        <ChevronRight
                          className="h-3.5 w-3.5 text-[#80df00]"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#80df00]/20 bg-[#80df00]/[0.04] p-4">
                  <Check
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#80df00]"
                    aria-hidden="true"
                  />

                  <p className="text-sm leading-6 text-white/62">
                    The request never loses its connection to the customer,
                    the decisions, the work, the money, or the final proof.
                    That connected history is the system.
                  </p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
