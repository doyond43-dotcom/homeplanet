import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type PestRequest = {
  service?: string;
  location?: string;
  severity?: string;
  name?: string;
  phone?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
};

const storageKey = "hp-slap-a-bug-requests";

const demoRequests: PestRequest[] = [
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
    name: "Amanda Love",
    phone: "863-555-0184",
    service: "Roaches",
    location: "Kitchen",
    severity: "Infestation / urgent",
    notes: "Needs quick follow-up. Seeing activity mostly at night.",
    status: "Needs Review",
    createdAt: new Date().toISOString()
  },
  {
    name: "Corner Store",
    phone: "863-555-0112",
    service: "Rodents",
    location: "Storage / feed room",
    severity: "Moderate activity",
    notes: "Commercial property. Possible recurring service opportunity.",
    status: "Scheduled",
    createdAt: new Date().toISOString()
  }
];

function getRequests() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return saved.length ? saved : demoRequests;
  } catch {
    return demoRequests;
  }
}

function statusTone(status?: string) {
  if (status === "New Request") return "text-[#67e68c]";
  if (status === "Needs Review") return "text-red-200";
  if (status === "Scheduled") return "text-blue-200";
  if (status === "Complete") return "text-white/70";
  return "text-white/70";
}

function nextMove(request: PestRequest) {
  const service = (request.service || "").toLowerCase();
  const severity = (request.severity || "").toLowerCase();
  const notes = (request.notes || "").toLowerCase();

  if (severity.includes("urgent") || severity.includes("infestation") || notes.includes("urgent")) {
    return "Call or text fast before this lead cools off.";
  }

  if (service.includes("mosquito")) {
    return "Confirm yard areas, trees, bushes, and fogging window.";
  }

  if (service.includes("rodent")) {
    return "Ask about sheds, feed rooms, garages, and entry signs.";
  }

  if (service.includes("roach")) {
    return "Ask where activity is heaviest and schedule quickly.";
  }

  return "Review request and follow up with customer.";
}

function signalLabel(request: PestRequest) {
  const service = request.service || "Pest Issue";
  const severity = request.severity || "Needs Review";
  return `${service} · ${severity}`;
}

function firstName(name?: string) {
  return (name || "there").split(" ")[0];
}

function buildMessage(type: string, request: PestRequest) {
  const name = firstName(request.name);
  const service = request.service || "pest issue";
  const location = request.location || "the area you mentioned";

  if (type === "review") {
    return `Hey ${name}, this is Brad with Slap-A-Bug Pest Control. I got your request about ${service} around ${location}. I’m reviewing it now and wanted to follow up with you.`;
  }

  if (type === "photos") {
    return `Hey ${name}, this is Brad with Slap-A-Bug Pest Control. I got your request about ${service}. If you can, send over a couple photos of where you’re seeing the activity so I can get a better look before we schedule.`;
  }

  if (type === "schedule") {
    return `Hey ${name}, this is Brad with Slap-A-Bug Pest Control. I can help with the ${service} issue. What day/time works best for me to come take care of it?`;
  }

  if (type === "mosquito") {
    return `Hey ${name}, this is Brad with Slap-A-Bug Pest Control. For mosquito fogging, I’ll want to treat around the trees, bushes, shaded areas, and spots where they hide. What day/time works best for you?`;
  }

  if (type === "complete") {
    return `Hey ${name}, this is Brad with Slap-A-Bug Pest Control. I wanted to check back after the service and make sure everything is looking good. If you were happy with the work, I’d really appreciate a quick review.`;
  }

  return `Hey ${name}, this is Brad with Slap-A-Bug Pest Control. I got your request and wanted to follow up with you.`;
}

export default function SlapABugBoardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [messageDraft, setMessageDraft] = useState("");

  const requests = useMemo<PestRequest[]>(() => getRequests(), [refreshKey]);
  const active = activeIndex === null ? null : requests[activeIndex];

  const activeSignals = requests.length;
  const urgentJobs = requests.filter((r) =>
    `${r.severity || ""} ${r.notes || ""}`.toLowerCase().includes("urgent") ||
    `${r.severity || ""}`.toLowerCase().includes("infestation")
  ).length;
  const mosquitoJobs = requests.filter((r) => `${r.service || ""}`.toLowerCase().includes("mosquito")).length;
  const recurringFits = requests.filter((r) => {
    const value = `${r.service || ""} ${r.location || ""} ${r.notes || ""}`.toLowerCase();
    return value.includes("mosquito") || value.includes("roach") || value.includes("commercial") || value.includes("store");
  }).length;

  function openWorkspace(index: number) {
    setActiveIndex(index);
    setMessageDraft(buildMessage("review", requests[index]));
  }

  function updateStatus(nextStatus: string) {
    if (activeIndex === null) return;

    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

    if (saved.length) {
      saved[activeIndex] = {
        ...saved[activeIndex],
        status: nextStatus
      };

      localStorage.setItem(storageKey, JSON.stringify(saved));
      setRefreshKey((key) => key + 1);
      return;
    }

    demoRequests[activeIndex] = {
      ...demoRequests[activeIndex],
      status: nextStatus
    };

    setRefreshKey((key) => key + 1);
  }

  function chooseAction(status: string, messageType: string) {
    if (!active) return;
    updateStatus(status);
    setMessageDraft(buildMessage(messageType, active));
  }

  async function copyMessage() {
    if (!messageDraft) return;
    await navigator.clipboard.writeText(messageDraft);
  }

  function deleteRequest(index: number) {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

    if (saved.length) {
      saved.splice(index, 1);
      localStorage.setItem(storageKey, JSON.stringify(saved));
      setRefreshKey((key) => key + 1);
      setActiveIndex(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#030706] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/planet/slap-a-bug" className="text-sm font-black text-[#66dc3b]">
          ← Public Page
        </Link>

        <section className="mt-5 rounded-[2rem] border border-[#e92929]/20 bg-[linear-gradient(135deg,rgba(60,4,10,0.72),rgba(0,0,0,0.78))] p-6 shadow-[0_0_80px_rgba(233,41,41,0.08)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-red-300">
            Customer Intelligence
          </p>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
                Slap-A-Bug
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
                Signals, follow-ups, pest severity, service opportunities, and next moves for Brad’s pest control requests.
              </p>
            </div>

            <div className="rounded-2xl border border-[#28c765]/25 bg-[#28c765]/10 px-4 py-3 text-sm font-black text-[#66dc3b]">
              {requests.length} Active Requests
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [activeSignals, "Active Signals"],
              [urgentJobs, "Urgent / Infestation"],
              [mosquitoJobs, "Mosquito Jobs"],
              [recurringFits, "Recurring Fits"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-4xl font-black text-[#66dc3b]">{value}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.24em] text-white/50">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-red-300">
              Active Customer Signals
            </p>

            <div className="mt-5 grid gap-4">
              {requests.map((request, index) => (
                <article
                  key={`${request.name}-${request.createdAt}-${index}`}
                  className="rounded-3xl border border-white/10 bg-black/55 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <button
                      onClick={() => openWorkspace(index)}
                      className="flex-1 text-left"
                    >
                      <h2 className="text-2xl font-black">{request.name || "New Customer"}</h2>
                      <p className={`mt-2 text-sm font-black ${statusTone(request.status)}`}>
                        {signalLabel(request)}
                      </p>
                    </button>

                    <button
                      onClick={() => deleteRequest(index)}
                      className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-black text-red-200"
                    >
                      🗑
                    </button>
                  </div>

                  <button
                    onClick={() => openWorkspace(index)}
                    className="mt-5 grid w-full gap-3 text-left text-sm text-white/72 sm:grid-cols-2"
                  >
                    <p>{request.location || "Location not added"}</p>
                    <p>{request.phone || "No phone added"}</p>
                    <p>{request.status || "New Request"}</p>
                    <p>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "New"}</p>
                  </button>

                  <button
                    onClick={() => openWorkspace(index)}
                    className="mt-5 w-full rounded-2xl bg-[#240811] px-4 py-4 text-left text-sm font-black text-white"
                  >
                    Next move: {nextMove(request)}
                  </button>

                  <button
                    onClick={() => openWorkspace(index)}
                    className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-[#8fc8ff]"
                  >
                    Open Active Workspace →
                  </button>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#e92929]/24 bg-[linear-gradient(135deg,rgba(55,0,10,0.7),rgba(0,0,0,0.82))] p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-red-300">
              Live Suggestions
            </p>

            <div className="mt-5 grid gap-4">
              {[
                ["Mosquito jobs need area notes.", "Ask about trees, bushes, standing water, shade lines, and yard activity before confirming fogging."],
                ["Urgent pest language should jump first.", "If the customer says infestation, urgent, everywhere, or heavy activity, follow up fast."],
                ["Rodent calls need hidden-space questions.", "Ask about sheds, barns, feed rooms, garages, storage spaces, and entry points."],
                ["Completed jobs should become proof.", "After service, mark complete, capture proof, and ask for a review."]
              ].map(([title, body]) => (
                <div key={title} className="rounded-3xl bg-black/70 p-5">
                  <h3 className="text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">{body}</p>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </div>

      {active && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close drawer overlay"
            onClick={() => setActiveIndex(null)}
            className="absolute inset-0 bg-black/72 backdrop-blur-sm"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-3xl flex-col border-l border-white/10 bg-[#050b08] shadow-[-30px_0_80px_rgba(0,0,0,0.55)]">
            <div className="border-b border-white/10 bg-black/40 px-5 py-4 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#8fc8ff]">
                    Active Workspace
                  </p>
                  <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                    {active.name || "New Customer"}
                  </h2>
                  <p className="mt-2 text-sm text-white/58">
                    {active.service || "Not Sure"} · {active.location || "Location not added"}
                  </p>
                </div>

                <button
                  onClick={() => setActiveIndex(null)}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-black text-white/70"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <a
                  href={`tel:${active.phone || ""}`}
                  className="rounded-2xl bg-[#e92929] px-5 py-3 text-center font-black text-white"
                >
                  Call
                </a>

                <a
                  href={`sms:${active.phone || ""}?&body=${encodeURIComponent(messageDraft)}`}
                  className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-center font-black text-white"
                >
                  Text Draft
                </a>

                <button
                  onClick={() => chooseAction("Scheduled", "schedule")}
                  className="rounded-2xl bg-[#28c765] px-5 py-3 text-center font-black text-black"
                >
                  Schedule
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-7">
              <section className="rounded-3xl border border-[#28c765]/25 bg-[#28c765]/10 p-4">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#66dc3b]">
                  Next Move
                </p>
                <h3 className="mt-2 text-xl font-black sm:text-2xl">
                  {nextMove(active)}
                </h3>
              </section>

              <section className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-white/42">
                      Message Actions
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      {active.status || "New Request"}
                    </h3>
                  </div>

                  <p className="max-w-sm text-sm leading-6 text-white/54">
                    Tap an action and HomePlanet forms the customer message.
                  </p>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => chooseAction("Needs Review", "review")}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left font-black text-white hover:border-[#8fc8ff]/45"
                  >
                    Follow Up
                    <span className="mt-1 block text-xs font-normal leading-5 text-white/55">
                      First response to the customer.
                    </span>
                  </button>

                  <button
                    onClick={() => chooseAction("Needs Review", "photos")}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left font-black text-white hover:border-[#8fc8ff]/45"
                  >
                    Ask For Photos
                    <span className="mt-1 block text-xs font-normal leading-5 text-white/55">
                      Ask for photos before quoting.
                    </span>
                  </button>

                  <button
                    onClick={() => chooseAction("Scheduled", active.service?.toLowerCase().includes("mosquito") ? "mosquito" : "schedule")}
                    className="rounded-2xl bg-[#28c765] px-4 py-4 text-left font-black text-black"
                  >
                    Schedule Service
                    <span className="mt-1 block text-xs font-normal leading-5 text-black/70">
                      Forms the scheduling message.
                    </span>
                  </button>

                  <button
                    onClick={() => chooseAction("Complete", "complete")}
                    className="rounded-2xl border border-[#e92929]/35 bg-[#e92929]/10 px-4 py-4 text-left font-black text-white hover:border-[#e92929]/60"
                  >
                    Complete / Review
                    <span className="mt-1 block text-xs font-normal leading-5 text-white/55">
                      Follow-up and review message.
                    </span>
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-white/42">
                    Message To Customer
                  </p>

                  <textarea
                    value={messageDraft}
                    onChange={(e) => setMessageDraft(e.target.value)}
                    className="mt-3 min-h-28 w-full rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-sm leading-6 text-white outline-none"
                  />

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <button
                      onClick={copyMessage}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white"
                    >
                      Copy Message
                    </button>

                    <a
                      href={`sms:${active.phone || ""}?&body=${encodeURIComponent(messageDraft)}`}
                      className="rounded-2xl bg-[#28c765] px-4 py-3 text-center text-sm font-black text-black"
                    >
                      Open Text
                    </a>
                  </div>
                </div>
              </section>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {[
                  ["Customer Info", `${active.name || "No name"} · ${active.phone || "No phone"}`],
                  ["Pest Details", `${active.service || "Not Sure"} · ${active.location || "Location not added"} · ${active.severity || "Severity not added"}`],
                  ["Photos", "Photo upload / before photos placeholder for bugs, entry points, nests, rodent signs, trees, bushes, and mosquito zones."],
                  ["Service Plan", "Fogging, perimeter treatment, interior issue, nest removal, rodent check, or recurring service option."],
                  ["Schedule", "Set service date, arrival window, or follow-up reminder."],
                  ["Payment", "Send payment link, mark cash, collect on-site, or close as paid."],
                  ["Proof / Follow-Up", "After service: add proof, mark completed, and ask for review."],
                  ["Timeline", "New Request → Review → Message → Schedule → Service → Payment → Proof → Follow-Up"]
                ].map(([title, body]) => (
                  <section key={title} className="rounded-3xl border border-white/10 bg-black/25 p-5">
                    <h3 className="text-lg font-black">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/62">{body}</p>
                  </section>
                ))}
              </div>

              <section className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-5">
                <h3 className="text-lg font-black">Notes</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  {active.notes || "No notes yet."}
                </p>
              </section>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
