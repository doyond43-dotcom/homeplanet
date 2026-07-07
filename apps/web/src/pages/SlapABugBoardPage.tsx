import React, { useEffect, useMemo, useState } from "react";

type PestRequest = {
  service: string;
  location: string;
  severity: string;
  name: string;
  phone: string;
  notes: string;
  status?: string;
  createdAt?: string;
};

const storageKey = "hp-slap-a-bug-requests";

const sampleRequests: PestRequest[] = [
  {
    name: "Daniel Doyon",
    phone: "863-555-0137",
    service: "Mosquitoes",
    location: "Trees / bushes / yard",
    severity: "Moderate activity",
    notes: "Mosquito fogging around trees, bushes, and hiding areas.",
    status: "New Request",
    createdAt: new Date().toISOString()
  },
  {
    name: "Maria Lopez",
    phone: "863-555-0144",
    service: "Roaches",
    location: "Kitchen",
    severity: "Heavy activity",
    notes: "Seeing activity at night around the sink and cabinets.",
    status: "Needs Follow-Up",
    createdAt: new Date().toISOString()
  },
  {
    name: "Tommy Carter",
    phone: "863-555-0188",
    service: "Ants",
    location: "Porch / entry points",
    severity: "Light activity",
    notes: "Trail near front porch and door frame.",
    status: "Review",
    createdAt: new Date().toISOString()
  }
];

function cleanPhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

function statusColor(status: string) {
  if (status.toLowerCase().includes("urgent") || status.toLowerCase().includes("heavy")) {
    return "border-[#e92929]/45 bg-[#e92929]/10 text-red-200";
  }

  if (status.toLowerCase().includes("scheduled") || status.toLowerCase().includes("complete")) {
    return "border-[#28c765]/45 bg-[#28c765]/10 text-green-200";
  }

  return "border-[#1d79d6]/45 bg-[#1d79d6]/10 text-blue-200";
}

function buildMessage(type: string, request: PestRequest) {
  const firstName = request.name?.split(" ")[0] || "there";
  const service = request.service || "the pest issue";
  const location = request.location || "the area you mentioned";

  if (type === "photos") {
    return `Hey ${firstName}, this is Brad with Slap-A-Bug Pest Control. I got your request about ${service}. If you can, send me a quick photo or two of where you're seeing the activity around ${location}. That helps me know what I'm walking into before I come out.`;
  }

  if (type === "schedule") {
    return `Hey ${firstName}, this is Brad with Slap-A-Bug Pest Control. I reviewed your request about ${service} around ${location}. What day and time works best for me to come take a look?`;
  }

  if (type === "mosquito") {
    return `Hey ${firstName}, this is Brad with Slap-A-Bug Pest Control. For mosquito activity, I usually look at shaded areas, trees, bushes, fence lines, standing water areas, and places they hide during the day. I can help you get a plan together for that.`;
  }

  if (type === "payment") {
    return `Hey ${firstName}, this is Brad with Slap-A-Bug Pest Control. The service is ready for payment. I can send the payment option over now or collect on-site, whichever works best.`;
  }

  if (type === "review") {
    return `Hey ${firstName}, this is Brad with Slap-A-Bug Pest Control. Just checking back after the service. If everything looks good, a quick review on Google or Facebook would really help. I appreciate it.`;
  }

  return `Hey ${firstName}, this is Brad with Slap-A-Bug Pest Control. I got your request about ${service} around ${location}. I'm reviewing it now and wanted to follow up with you.`;
}

export default function SlapABugBoardPage() {
  const [requests, setRequests] = useState<PestRequest[]>(sampleRequests);
  const [activeIndex, setActiveIndex] = useState(0);
  const [messageDraft, setMessageDraft] = useState("");
  const [appointment, setAppointment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Not sent");
  const [proofStatus, setProofStatus] = useState("Not added");
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]") as PestRequest[];

    if (saved.length > 0) {
      setRequests([...saved, ...sampleRequests]);
    }
  }, []);

  const active = requests[activeIndex] || requests[0];

  useEffect(() => {
    if (active) {
      setMessageDraft(buildMessage("followup", active));
      setInternalNotes(active.notes || "");
    }
  }, [activeIndex]);

  const stats = useMemo(() => {
    const urgent = requests.filter((request) =>
      `${request.severity} ${request.status}`.toLowerCase().includes("urgent") ||
      `${request.severity}`.toLowerCase().includes("heavy")
    ).length;

    const mosquito = requests.filter((request) =>
      `${request.service} ${request.notes}`.toLowerCase().includes("mosquito")
    ).length;

    return {
      active: requests.length,
      urgent,
      mosquito,
      recurring: Math.max(1, requests.filter((request) => request.service !== "Not Sure").length - 1)
    };
  }, [requests]);

  function updateStatus(status: string) {
    setRequests((current) =>
      current.map((request, index) =>
        index === activeIndex ? { ...request, status } : request
      )
    );
  }

  function chooseMessage(type: string, status?: string) {
    if (status) updateStatus(status);
    setMessageDraft(buildMessage(type, active));
  }

  async function copyMessage() {
    await navigator.clipboard.writeText(messageDraft);
  }

  function saveNotes() {
    setRequests((current) =>
      current.map((request, index) =>
        index === activeIndex ? { ...request, notes: internalNotes } : request
      )
    );
  }

  return (
    <main className="min-h-screen bg-[#020706] px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-[#1d79d6]/30 bg-[radial-gradient(circle_at_top_left,rgba(31,111,190,0.16),transparent_36%),linear-gradient(135deg,rgba(0,0,0,0.88),rgba(2,7,6,0.96))] p-5 shadow-[0_0_80px_rgba(31,111,190,0.12)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.36em] text-red-300">
                Slap-A-Bug
              </p>
              <h1 className="mt-3 text-4xl font-black sm:text-6xl">
                Pest Control Board
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/64">
                Requests come in from the public page, then Brad handles follow-up, scheduling,
                payment, proof, and review from one active workspace.
              </p>
            </div>

            <a
              href="/planet/slap-a-bug"
              className="w-fit rounded-2xl border border-[#1d79d6]/45 bg-[#1d79d6]/12 px-5 py-3 text-sm font-black text-blue-100 transition hover:border-[#58a9ff]/75 hover:bg-[#061423]"
            >
              View Public Page
            </a>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Active Requests", stats.active],
              ["Urgent / Heavy", stats.urgent],
              ["Mosquito Jobs", stats.mosquito],
              ["Recurring Fits", stats.recurring]
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-3xl border border-[#1d79d6]/25 bg-black/45 p-5"
              >
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-200/70">
                  {label}
                </p>
                <p className="mt-2 text-4xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.45fr]">
          {/* REQUEST CARDS */}
          <section className="rounded-[2rem] border border-white/10 bg-black/38 p-4 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.34em] text-red-300">
              Active Signals
            </p>

            <div className="mt-4 grid gap-3">
              {requests.map((request, index) => (
                <button
                  key={`${request.name}-${index}`}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[#1d79d6]/65 hover:bg-[#061423] hover:shadow-[0_0_34px_rgba(31,111,190,0.18)] ${
                    activeIndex === index
                      ? "border-[#1d79d6]/70 bg-[#061423] shadow-[0_0_34px_rgba(31,111,190,0.18)]"
                      : "border-white/10 bg-white/[0.035]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-black">{request.name || "New Customer"}</h2>
                      <p className="mt-1 text-sm text-white/62">
                        {request.service || "Not Sure"} · {request.location || "Location needed"}
                      </p>
                    </div>

                    <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${statusColor(request.status || "New Request")}`}>
                      {request.status || "New"}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/58">
                    {request.notes || "No notes yet."}
                  </p>

                  <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#66dc3b]">
                    Open Workspace
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* ACTIVE WORKSPACE */}
          <section className="overflow-hidden rounded-[2rem] border border-[#1d79d6]/45 bg-[#071019] shadow-[0_0_70px_rgba(31,111,190,0.14)]">
            <div className="border-b border-[#1d79d6]/25 bg-[radial-gradient(circle_at_top_left,rgba(233,41,41,0.16),transparent_32%),rgba(0,0,0,0.35)] p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-200">
                    Active Workspace
                  </p>
                  <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                    {active.name || "New Customer"}
                  </h2>
                  <p className="mt-2 text-base text-white/76">
                    {active.service || "Not Sure"} · {active.location || "Location needed"} · {active.severity || "Severity needed"}
                  </p>
                </div>

                <span className={`w-fit rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${statusColor(active.status || "New Request")}`}>
                  {active.status || "New Request"}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a
                  href={`tel:${cleanPhone(active.phone || "")}`}
                  className="rounded-2xl bg-[#e92929] px-5 py-4 text-center text-base font-black text-white shadow-[0_0_35px_rgba(233,41,41,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ff3030]"
                >
                  Call
                </a>

                <a
                  href={`sms:${cleanPhone(active.phone || "")}?&body=${encodeURIComponent(messageDraft)}`}
                  className="rounded-2xl border border-[#1d79d6]/60 bg-[#1d79d6]/22 px-5 py-4 text-center text-base font-black text-white shadow-[0_0_32px_rgba(31,111,190,0.18)] transition hover:-translate-y-0.5 hover:border-[#58a9ff]/80 hover:bg-[#1d79d6]/34"
                >
                  Text Draft
                </a>

                <button
                  onClick={() => chooseMessage("schedule", "Scheduling")}
                  className="rounded-2xl bg-[#28c765] px-5 py-4 text-center text-base font-black text-black transition hover:-translate-y-0.5 hover:bg-[#39df78]"
                >
                  Schedule
                </button>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:p-7">
              {/* NEXT ACTION */}
              <div className="rounded-3xl border border-[#1d79d6]/30 bg-[#061423]/75 p-5">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">
                  Next Action
                </p>
                <h3 className="mt-3 text-2xl font-black">
                  Follow up and move this request forward.
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  Use the buttons below to form the message, update the status, and keep the job moving.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <button
                    onClick={() => chooseMessage("followup", "Follow-Up")}
                    className="rounded-2xl border border-[#1d79d6]/35 bg-black/35 px-4 py-3 text-sm font-black transition hover:border-[#1d79d6]/75 hover:bg-[#061423]"
                  >
                    Follow Up
                  </button>

                  <button
                    onClick={() => chooseMessage("photos", "Need Photos")}
                    className="rounded-2xl border border-[#1d79d6]/35 bg-black/35 px-4 py-3 text-sm font-black transition hover:border-[#1d79d6]/75 hover:bg-[#061423]"
                  >
                    Ask Photos
                  </button>

                  <button
                    onClick={() => chooseMessage("payment", "Payment Due")}
                    className="rounded-2xl border border-[#28c765]/35 bg-[#28c765]/10 px-4 py-3 text-sm font-black text-green-100 transition hover:border-[#28c765]/75"
                  >
                    Payment
                  </button>

                  <button
                    onClick={() => chooseMessage("review", "Completed")}
                    className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm font-black transition hover:border-[#1d79d6]/75 hover:bg-[#061423]"
                  >
                    Review
                  </button>
                </div>
              </div>

              {/* MESSAGE */}
              <div className="rounded-3xl border border-[#1d79d6]/25 bg-black/45 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">
                      Message To Customer
                    </p>
                    <h3 className="mt-2 text-2xl font-black">Ready-to-send text</h3>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={copyMessage}
                      className="rounded-xl border border-[#1d79d6]/45 bg-[#1d79d6]/12 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-blue-100"
                    >
                      Copy
                    </button>

                    <a
                      href={`sms:${cleanPhone(active.phone || "")}?&body=${encodeURIComponent(messageDraft)}`}
                      className="rounded-xl bg-[#1d79d6] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white"
                    >
                      Open Text
                    </a>
                  </div>
                </div>

                <textarea
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  className="mt-4 min-h-36 w-full rounded-2xl border border-[#1d79d6]/25 bg-[#020706] p-4 text-sm leading-6 text-white outline-none transition focus:border-[#1d79d6]/75"
                />
              </div>

              {/* SCHEDULE + PAYMENT */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-[#1d79d6]/25 bg-[#061423]/55 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">
                    Schedule
                  </p>
                  <h3 className="mt-2 text-2xl font-black">Set the visit</h3>

                  <input
                    value={appointment}
                    onChange={(event) => setAppointment(event.target.value)}
                    placeholder="Example: Thursday 10 AM"
                    className="mt-4 w-full rounded-2xl border border-[#1d79d6]/25 bg-black/45 px-4 py-4 text-white outline-none focus:border-[#1d79d6]/75"
                  />

                  <button
                    onClick={() => updateStatus("Scheduled")}
                    className="mt-3 w-full rounded-2xl bg-[#28c765] px-4 py-3 font-black text-black"
                  >
                    Mark Scheduled
                  </button>
                </div>

                <div className="rounded-3xl border border-[#1d79d6]/25 bg-[#061423]/55 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">
                    Payment
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{paymentStatus}</h3>

                  <div className="mt-4 grid gap-2">
                    <button
                      onClick={() => {
                        setPaymentStatus("Payment link ready");
                        chooseMessage("payment", "Payment Due");
                      }}
                      className="rounded-2xl border border-[#1d79d6]/40 bg-[#1d79d6]/12 px-4 py-3 font-black text-blue-100"
                    >
                      Send Payment Message
                    </button>

                    <button
                      onClick={() => {
                        setPaymentStatus("Paid");
                        updateStatus("Paid");
                      }}
                      className="rounded-2xl bg-[#28c765] px-4 py-3 font-black text-black"
                    >
                      Mark Paid
                    </button>
                  </div>
                </div>
              </div>

              {/* PROOF + NOTES */}
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-[#1d79d6]/25 bg-black/45 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">
                    Proof / Review
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{proofStatus}</h3>

                  <div className="mt-4 grid gap-2">
                    <button
                      onClick={() => {
                        setProofStatus("Proof added");
                        updateStatus("Proof Added");
                      }}
                      className="rounded-2xl border border-[#1d79d6]/40 bg-[#1d79d6]/12 px-4 py-3 font-black text-blue-100"
                    >
                      Mark Proof Added
                    </button>

                    <button
                      onClick={() => chooseMessage("review", "Review Requested")}
                      className="rounded-2xl border border-[#28c765]/40 bg-[#28c765]/10 px-4 py-3 font-black text-green-100"
                    >
                      Ask For Review
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#1d79d6]/25 bg-black/45 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">
                    Internal Notes
                  </p>
                  <h3 className="mt-2 text-2xl font-black">Brad’s notes</h3>

                  <textarea
                    value={internalNotes}
                    onChange={(event) => setInternalNotes(event.target.value)}
                    className="mt-4 min-h-32 w-full rounded-2xl border border-[#1d79d6]/25 bg-[#020706] p-4 text-sm leading-6 text-white outline-none transition focus:border-[#1d79d6]/75"
                    placeholder="Add real job notes here..."
                  />

                  <button
                    onClick={saveNotes}
                    className="mt-3 w-full rounded-2xl border border-[#1d79d6]/45 bg-[#1d79d6]/12 px-4 py-3 font-black text-blue-100"
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-white/40">
                  Timeline
                </p>
                <p className="mt-3 text-sm leading-7 text-white/66">
                  New Request → Review → Message → Schedule → Service → Payment → Proof → Follow-Up
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
