import { useMemo, useRef, useState } from "react";
import {
  Clipboard,
  MessageSquare,
  Phone,
} from "lucide-react";

type CoolingStage = "NEW REQUEST" | "NEEDS FOLLOW-UP" | "ESTIMATE" | "SCHEDULED" | "PAYMENT" | "PROOF" | "REVIEW" | "COMPLETE";

type CoolingRequest = {
  id: string;
  customer: string;
  phone: string;
  issue: string;
  detail: string;
  status: CoolingStage;
  note: string;
  urgency: "Urgent" | "Soon" | "Estimate" | "Routine";
  schedule: string;
  paymentStatus: string;
  proofStatus: string;
  internalNotes: string;
};

const startingRequests: CoolingRequest[] = [
  {
    id: "fc-1",
    customer: "Maria Lopez",
    phone: "+18635550101",
    issue: "AC Not Cooling",
    detail: "House is hot / warm air / system running",
    status: "NEW REQUEST",
    note: "System is running but blowing warm air. Customer says house is getting hot.",
    urgency: "Urgent",
    schedule: "Example: Today 3 PM",
    paymentStatus: "Not sent",
    proofStatus: "Not added",
    internalNotes: "Ask if outside unit is running, thermostat is set to cool, and filter was recently changed.",
  },
  {
    id: "fc-2",
    customer: "Treasure Island Home",
    phone: "+18635550102",
    issue: "Water Leak / Drain Line",
    detail: "Water around air handler",
    status: "NEEDS FOLLOW-UP",
    note: "Water near air handler. Customer can send photos of the unit and drain area.",
    urgency: "Soon",
    schedule: "Example: Tomorrow morning",
    paymentStatus: "Not sent",
    proofStatus: "Not added",
    internalNotes: "Ask for photos of drain pan, air handler, and where water is collecting.",
  },
  {
    id: "fc-3",
    customer: "Lakeview Office",
    phone: "+18635550103",
    issue: "Commercial HVAC",
    detail: "Office cooling uneven / service quote",
    status: "REVIEW",
    note: "Front office is not cooling evenly. Wants service window this week.",
    urgency: "Estimate",
    schedule: "Example: Thursday 10 AM",
    paymentStatus: "Not sent",
    proofStatus: "Not added",
    internalNotes: "Commercial quote. Confirm access time, unit location, and whether business is open during service.",
  },
];

const replyActions = ["Follow Up", "Ask Photos", "Estimate", "Payment", "Review"];

function makeReply(request: CoolingRequest, action: string) {
  if (action === "Ask Photos") {
    return `Hey ${request.customer}, this is Florida Cooling. I got your request about ${request.issue}. Can you send a quick photo or short video of the thermostat, air handler, or outside unit so we can see what is going on before we come out?`;
  }

  if (action === "Estimate") {
    return `Hey ${request.customer}, this is Florida Cooling. I reviewed your request about ${request.issue}. The next step is to confirm what the system is doing so we can give you the right estimate instead of guessing.`;
  }

  if (action === "Payment") {
    return `Hey ${request.customer}, this is Florida Cooling. Your service is ready for payment. Once payment is confirmed, we will mark the job complete and keep the proof attached.`;
  }

  if (action === "Review") {
    return `Hey ${request.customer}, this is Florida Cooling. Thank you for trusting us with your AC service. If everything looks good, would you mind leaving us a quick review?`;
  }

  return `Hey ${request.customer}, this is Florida Cooling. I got your request about ${request.issue}. I am reviewing it now and wanted to follow up with you.`;
}

export default function FloridaCoolingBoardPage() {
  const [requests, setRequests] = useState<CoolingRequest[]>(startingRequests);
  const [activeId, setActiveId] = useState(startingRequests[0].id);
  const [replyAction, setReplyAction] = useState("Follow Up");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const scheduleInputRef = useRef<HTMLInputElement | null>(null);
  const notesInputRef = useRef<HTMLTextAreaElement | null>(null);

  const active = useMemo(
    () => requests.find((request) => request.id === activeId) ?? requests[0],
    [requests, activeId]
  );

  const readyText = useMemo(() => makeReply(active, replyAction), [active, replyAction]);

  const stats = [
    { label: "ACTIVE REQUESTS", value: requests.length.toString() },
    { label: "URGENT COOLING", value: requests.filter((request) => request.urgency === "Urgent").length.toString() },
    { label: "ESTIMATES", value: requests.filter((request) => request.status === "ESTIMATE").length.toString() },
    { label: "FOLLOW-UPS", value: requests.filter((request) => request.status === "NEEDS FOLLOW-UP" || request.status === "NEW REQUEST").length.toString() },
  ];

  function updateActive(updates: Partial<CoolingRequest>) {
    setRequests((current) =>
      current.map((request) =>
        request.id === active.id ? { ...request, ...updates } : request
      )
    );
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(readyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  function openText(action = replyAction) {
    const text = makeReply(active, action);
    window.location.href = `sms:${active.phone}?&body=${encodeURIComponent(text)}`;
  }

  function handleTopSchedule() {
    scheduleInputRef.current?.focus();
    scheduleInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function markScheduled() {
    const nextSchedule = scheduleInputRef.current?.value || active.schedule;
    updateActive({
      schedule: nextSchedule,
      status: "SCHEDULED",
      note: `Service scheduled: ${nextSchedule}`,
    });
  }

  function sendPaymentMessage() {
    setReplyAction("Payment");
    updateActive({
      status: "PAYMENT",
      paymentStatus: "Payment message ready",
    });
    window.setTimeout(() => openText("Payment"), 50);
  }

  function markPaid() {
    updateActive({
      status: "PROOF",
      paymentStatus: "Paid",
      note: "Payment received. Ready for proof / closeout.",
    });
  }

  function markProofAdded() {
    updateActive({
      status: "REVIEW",
      proofStatus: "Proof added",
      note: "Job proof has been added. Ready for review request.",
    });
  }

  function askForReview() {
    setReplyAction("Review");
    updateActive({
      status: "REVIEW",
    });
    window.setTimeout(() => openText("Review"), 50);
  }

  function saveNotes() {
    updateActive({
      internalNotes: notesInputRef.current?.value || active.internalNotes,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  }

  function handleReplyAction(action: string) {
    setReplyAction(action);
    setCopied(false);

    if (action === "Estimate") {
      updateActive({ status: "ESTIMATE" });
    }

    if (action === "Payment") {
      updateActive({ status: "PAYMENT", paymentStatus: "Payment message ready" });
    }

    if (action === "Review") {
      updateActive({ status: "REVIEW" });
    }
  }

  return (
    <div className="min-h-screen bg-[#020807] px-4 py-6 text-white md:px-8 md:py-10">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute left-[-20rem] top-[12rem] h-[36rem] w-[36rem] rounded-full bg-emerald-500/8 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-sky-500/25 bg-[#050d12] p-6 shadow-[0_0_90px_rgba(14,165,233,0.12)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-sky-300">
                FLORIDA COOLING
              </p>

              <h1 className="mt-4 text-5xl font-black leading-none tracking-[-0.055em] md:text-7xl">
                Cooling Board
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200">
                Requests come in from the public page, then Uriel&apos;s team handles follow-up, estimates, scheduling, payment, proof, and review from one active workspace.
              </p>
            </div>

            <a
              href="/planet/florida-cooling"
              className="inline-flex w-fit items-center justify-center rounded-2xl border border-sky-400/35 bg-black/30 px-5 py-3 text-sm font-black transition hover:bg-sky-400/10"
            >
              View Public Page
            </a>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-sky-500/18 bg-black/40 p-5">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-[#020907]/90 p-4 md:p-5">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-rose-300">
              ACTIVE SIGNALS
            </p>

            <div className="space-y-3">
              {requests.map((request) => {
                const selected = request.id === active.id;

                return (
                  <button
                    key={request.id}
                    onClick={() => {
                      setActiveId(request.id);
                      setCopied(false);
                      setSaved(false);
                    }}
                    className={[
                      "w-full rounded-3xl border p-5 text-left transition",
                      selected
                        ? "border-sky-500/65 bg-[#061826] shadow-[0_0_34px_rgba(14,165,233,0.18)]"
                        : "border-white/10 bg-white/[0.035] hover:border-sky-500/35 hover:bg-white/[0.06]",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-black tracking-[-0.03em]">{request.customer}</h2>
                        <p className="mt-1 text-sm text-slate-200">
                          {request.issue} · {request.detail}
                        </p>
                      </div>

                      <span className="rounded-full border border-sky-400/35 bg-sky-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-sky-200">
                        {request.status}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-200">{request.note}</p>

                    <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-green-400">
                      OPEN WORKSPACE
                    </p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="overflow-hidden rounded-[2rem] border border-sky-500/30 bg-[#06111d]">
            <div className="border-b border-sky-500/20 p-5 md:p-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.32em] text-sky-200">
                  ACTIVE WORKSPACE
                </p>

                <span className="rounded-full border border-sky-400/35 bg-sky-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-sky-200">
                  {active.status}
                </span>
              </div>

              <h2 className="text-4xl font-black leading-none tracking-[-0.05em] md:text-6xl">
                {active.customer}
              </h2>

              <p className="mt-3 text-base text-slate-200">
                {active.issue} · {active.detail} · {active.urgency}
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <a
                  href={`tel:${active.phone}`}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-red-500 px-5 py-4 font-black text-white transition hover:bg-red-400"
                >
                  <Phone className="h-5 w-5" />
                  Call
                </a>

                <button
                  onClick={() => openText()}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-sky-500/35 bg-black/30 px-5 py-4 font-black text-white transition hover:bg-sky-400/10"
                >
                  <MessageSquare className="h-5 w-5" />
                  Text Draft
                </button>

                <button
                  onClick={handleTopSchedule}
                  className="inline-flex items-center justify-center rounded-2xl bg-green-500 px-5 py-4 font-black text-black transition hover:bg-green-400"
                >
                  Schedule
                </button>
              </div>
            </div>

            <div className="p-5 md:p-7">
              <div className="rounded-3xl border border-sky-500/25 bg-[#071827] p-5">
                <p className="text-xs font-black uppercase tracking-[0.32em] text-sky-200">
                  NEXT ACTION
                </p>

                <h3 className="mt-3 text-3xl font-black tracking-[-0.035em]">
                  Follow up and move this request forward.
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  Use the buttons below to form the message, update the status, and keep the job moving.
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-5">
                  {replyActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => handleReplyAction(action)}
                      className={[
                        "rounded-2xl border px-4 py-3 text-sm font-black transition",
                        action === replyAction
                          ? "border-sky-300/60 bg-sky-300 text-black"
                          : action === "Payment"
                            ? "border-green-400/35 bg-green-500/12 text-green-200 hover:bg-green-500/18"
                            : "border-white/10 bg-black/25 text-white hover:bg-white/10",
                      ].join(" ")}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-sky-500/20 bg-[#030908] p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.32em] text-sky-200">
                      MESSAGE TO CUSTOMER
                    </p>
                    <h3 className="mt-2 text-3xl font-black tracking-[-0.035em]">
                      Ready-to-send text
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={copyText}
                      className="rounded-2xl border border-sky-500/30 bg-black/30 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] transition hover:bg-sky-400/10"
                    >
                      <Clipboard className="mr-2 inline h-4 w-4" />
                      {copied ? "COPIED" : "COPY"}
                    </button>

                    <button
                      onClick={() => openText()}
                      className="rounded-2xl bg-sky-500 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-sky-400"
                    >
                      OPEN TEXT
                    </button>
                  </div>
                </div>

                <textarea
                  value={readyText}
                  readOnly
                  rows={5}
                  className="w-full rounded-2xl border border-sky-500/20 bg-black/55 p-4 text-sm leading-relaxed text-white outline-none"
                />
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-sky-500/20 bg-[#030908] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.32em] text-sky-200">
                    SCHEDULE
                  </p>
                  <h3 className="mt-2 text-2xl font-black">Set the visit</h3>

                  <input
                    ref={scheduleInputRef}
                    defaultValue={active.schedule}
                    key={`${active.id}-schedule`}
                    className="mt-4 w-full rounded-2xl border border-sky-500/20 bg-[#06111d] px-4 py-4 text-white outline-none"
                  />

                  <button
                    onClick={markScheduled}
                    className="mt-4 w-full rounded-2xl bg-green-500 px-5 py-4 font-black text-black transition hover:bg-green-400"
                  >
                    Mark Scheduled
                  </button>
                </div>

                <div className="rounded-3xl border border-sky-500/20 bg-[#030908] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.32em] text-sky-200">
                    PAYMENT
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{active.paymentStatus}</h3>

                  <button
                    onClick={sendPaymentMessage}
                    className="mt-5 w-full rounded-2xl border border-sky-500/30 bg-[#06111d] px-5 py-4 font-black transition hover:bg-sky-400/10"
                  >
                    Send Payment Message
                  </button>

                  <button
                    onClick={markPaid}
                    className="mt-3 w-full rounded-2xl bg-green-500 px-5 py-4 font-black text-black transition hover:bg-green-400"
                  >
                    Mark Paid
                  </button>
                </div>

                <div className="rounded-3xl border border-sky-500/20 bg-[#030908] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.32em] text-sky-200">
                    PROOF / REVIEW
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{active.proofStatus}</h3>

                  <button
                    onClick={markProofAdded}
                    className="mt-5 w-full rounded-2xl border border-sky-500/30 bg-[#06111d] px-5 py-4 font-black transition hover:bg-sky-400/10"
                  >
                    Mark Proof Added
                  </button>

                  <button
                    onClick={askForReview}
                    className="mt-3 w-full rounded-2xl border border-green-500/35 bg-green-500/12 px-5 py-4 font-black text-green-200 transition hover:bg-green-500/18"
                  >
                    Ask For Review
                  </button>
                </div>

                <div className="rounded-3xl border border-sky-500/20 bg-[#030908] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.32em] text-sky-200">
                    INTERNAL NOTES
                  </p>
                  <h3 className="mt-2 text-2xl font-black">Uriel&apos;s notes</h3>

                  <textarea
                    ref={notesInputRef}
                    defaultValue={active.internalNotes}
                    key={`${active.id}-notes`}
                    rows={5}
                    className="mt-4 w-full rounded-2xl border border-sky-500/20 bg-[#06111d] p-4 text-sm leading-relaxed text-white outline-none"
                  />

                  <button
                    onClick={saveNotes}
                    className="mt-4 w-full rounded-2xl border border-sky-500/30 bg-[#06111d] px-5 py-4 font-black transition hover:bg-sky-400/10"
                  >
                    {saved ? "Saved" : "Save Notes"}
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-black/35 p-5">
                <p className="text-xs font-black uppercase tracking-[0.32em] text-slate-500">
                  TIMELINE
                </p>
                <p className="mt-3 text-sm text-slate-200">
                  New Request → Review → Message → Estimate → Schedule → Service → Payment → Proof → Follow-Up
                </p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
