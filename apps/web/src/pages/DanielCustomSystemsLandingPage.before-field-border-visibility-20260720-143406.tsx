import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ClipboardList,
  FileCheck2,
  GitBranch,
  Layers3,
  MessageCircle,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react";

type SystemRequest = {
  problem: string;
  businessName: string;
  whatYouDo: string;
  currentFlow: string;
  breakdowns: string[];
  existingLink: string;
  name: string;
  phone: string;
  email: string;
  contactPreference: string;
  notes: string;
  createdAt: string;
  status: string;
};

type ProblemOption = {
  name: string;
  summary: string;
  detail: string;
  canConnect: string[];
};

const problemOptions: ProblemOption[] = [
  {
    name: "Customer Requests",
    summary:
      "Calls, texts, Facebook messages, referrals, and inquiries are getting scattered.",
    detail:
      "Give every customer a clearer front door, ask only the questions that matter, and turn the request into organized work instead of another loose message.",
    canConnect: [
      "Where the customer came from",
      "What they actually need",
      "Photos, details, and contact information",
      "Who needs to follow up",
      "What happens next",
    ],
  },
  {
    name: "Jobs & Work Tracking",
    summary:
      "It is hard to see what is active, waiting, completed, or supposed to happen next.",
    detail:
      "Turn each real customer or job into a working record with a clear state, history, proof, and next action.",
    canConnect: [
      "New work",
      "Active jobs",
      "Waiting on customer",
      "Next actions",
      "Completion and history",
    ],
  },
  {
    name: "Customer Updates",
    summary:
      "Customers keep asking what is happening, what changed, or what they need to do.",
    detail:
      "Give customers a simple view of progress without scattering the relationship across texts, Messenger, calls, and email.",
    canConnect: [
      "Progress updates",
      "Photos and screenshots",
      "Review requests",
      "Looks Good approvals",
      "Change requests",
    ],
  },
  {
    name: "Quotes & Approvals",
    summary:
      "Pricing, decisions, changes, and approvals take too much back-and-forth.",
    detail:
      "Keep the quote, customer decision, requested changes, approval, and next action connected to the same work.",
    canConnect: [
      "Estimate or quote",
      "Customer approval",
      "Requested changes",
      "Scope history",
      "Approved next step",
    ],
  },
  {
    name: "Scheduling & Follow-Up",
    summary:
      "Appointments, reminders, callbacks, and next steps are easy to lose.",
    detail:
      "Make the next action visible so a real customer does not disappear just because the conversation moved to another app.",
    canConnect: [
      "Scheduling",
      "Reminders",
      "Waiting states",
      "Follow-up ownership",
      "Completion",
    ],
  },
  {
    name: "Something Custom",
    summary:
      "Your process does not fit neatly inside an off-the-shelf tool.",
    detail:
      "Start with how the operation actually works today. Then build the public entrance and working system around the real human flow instead of forcing the business into generic software.",
    canConnect: [
      "Your real workflow",
      "Custom customer entrances",
      "Operator workspaces",
      "Approvals and communication",
      "Proof and outcomes",
    ],
  },
];

const breakdownOptions = [
  "Information gets lost",
  "Too many messages",
  "Hard to track active work",
  "Customers do not know what happens next",
  "Approvals take too much back-and-forth",
  "Follow-up gets forgotten",
  "Payments or completion become disconnected",
  "Something else",
];

const buildExamples = [
  {
    name: "Jones Equipment Rental & Repair",
    flow: "Rental or Repair → Request → Review → Schedule → Work → Payment",
    note:
      "A public front door can separate rental and repair needs before the request ever reaches the operator.",
  },
  {
    name: "Only The Essentials Cleaning",
    flow: "Request → Quote → Approval → Schedule → Work → Complete",
    note:
      "Customers answer the relevant cleaning questions first, then the work can move forward as one connected relationship.",
  },
  {
    name: "Okeechobee Together",
    flow: "Need → People → Work → Proof → Outcome",
    note:
      "Community needs, helpers, projects, updates, and proof can stay connected instead of disappearing into separate posts and messages.",
  },
];

export default function DanielCustomSystemsLandingPage() {
  const [selectedProblem, setSelectedProblem] = useState("Customer Requests");
  const [requestOpen, setRequestOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [requestForm, setRequestForm] = useState({
    businessName: "",
    whatYouDo: "",
    currentFlow: "",
    breakdowns: [] as string[],
    existingLink: "",
    name: "",
    phone: "",
    email: "",
    contactPreference: "",
    notes: "",
  });

  const activeProblem = useMemo(() => {
    return (
      problemOptions.find((problem) => problem.name === selectedProblem) ||
      problemOptions[0]
    );
  }, [selectedProblem]);

  function chooseProblem(problem: string) {
    setSelectedProblem(problem);
    setSubmitted(false);
  }

  function scrollToProblems() {
    document
      .getElementById("custom-systems-start")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToHowItWorks() {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openRequest() {
    setRequestOpen(true);
    setSubmitted(false);

    window.setTimeout(() => {
      document
        .getElementById("custom-system-request")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function updateField(
    field: Exclude<keyof typeof requestForm, "breakdowns">,
    value: string,
  ) {
    setRequestForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleBreakdown(value: string) {
    setRequestForm((current) => ({
      ...current,
      breakdowns: current.breakdowns.includes(value)
        ? current.breakdowns.filter((item) => item !== value)
        : [...current.breakdowns, value],
    }));
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const request: SystemRequest = {
      problem: selectedProblem,
      ...requestForm,
      createdAt: new Date().toISOString(),
      status: "New Lead",
    };

    const storageKey = "hp-daniel-custom-system-requests";
    const existing = JSON.parse(
      localStorage.getItem(storageKey) || "[]",
    ) as SystemRequest[];

    localStorage.setItem(
      storageKey,
      JSON.stringify([request, ...existing]),
    );

    setSubmitted(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020706] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(126,224,0,0.055),transparent_34%)]" />

      <div className="relative mx-auto w-full max-w-[1120px] px-5 pb-20 pt-6 sm:px-8 lg:px-10 lg:pt-8">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-4 border-b border-[rgba(128,223,0,0.12)] pb-5">
          <a
            href="/planet/custom-systems"
            aria-label="Daniel Custom Systems home"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#80df00]/55 bg-[#80df00]/10 shadow-[0_0_26px_rgba(126,224,0,0.10)]">
              <Workflow
                className="h-6 w-6 text-[#80df00]"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <div className="truncate text-lg font-black tracking-[-0.025em] sm:text-xl">
                DANIEL
              </div>
              <div className="truncate text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00] sm:text-xs">
                Custom Systems
              </div>
            </div>
          </a>

          <button
            type="button"
            onClick={scrollToProblems}
            className="flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl border border-[#80df00]/40 bg-[#80df00]/10 px-4 text-sm font-black transition hover:border-[#80df00]/80 hover:bg-[#80df00]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80df00]"
          >
            <Sparkles
              className="h-4 w-4 text-[#80df00]"
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Start Here</span>
          </button>
        </header>

        {/* HERO */}
        <section className="pt-12 text-center sm:pt-16 lg:pt-20">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#80df00]">
            Custom Systems Built On HomePlanet
          </p>

          <h1 className="mx-auto mt-5 max-w-[980px] text-[clamp(3.15rem,9.6vw,6.7rem)] font-black leading-[0.9] tracking-[-0.065em]">
            A system built around
            <span className="mt-2 block text-[#80df00]">
              how you actually work.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-[760px] text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            Customer requests, jobs, approvals, scheduling, payments, updates,
            and follow-up should not become six disconnected conversations.
            Show me where the process gets messy, and we can build the flow
            around the way your business really works.
          </p>

          <div className="mx-auto mt-8 grid max-w-[720px] gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={scrollToProblems}
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl bg-[#80df00] px-6 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19] hover:shadow-[0_0_36px_rgba(126,224,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b7ff59] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020706]"
            >
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
              Show Me What You Need
            </button>

            <button
              type="button"
              onClick={scrollToHowItWorks}
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl border border-[#80df00]/35 bg-black/70 px-6 font-black text-white transition hover:-translate-y-0.5 hover:border-[#80df00]/75 hover:bg-[#80df00]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80df00]"
            >
              <GitBranch
                className="h-5 w-5 text-[#80df00]"
                aria-hidden="true"
              />
              See How It Works
            </button>
          </div>

          <div className="mx-auto mt-5 flex max-w-[900px] flex-wrap justify-center gap-2">
            {[
              {
                label: "Built Around Your Workflow",
                icon: Workflow,
              },
              {
                label: "Real Working Systems",
                icon: Layers3,
              },
              {
                label: "Clear Customer Follow-Up",
                icon: MessageCircle,
              },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex min-h-[42px] items-center gap-2 rounded-full border border-white/16 bg-white/[0.025] px-4 text-[10px] font-black uppercase tracking-[0.13em] text-white/78"
              >
                <Icon
                  className="h-4 w-4 text-[#80df00]"
                  aria-hidden="true"
                />
                {label}
              </div>
            ))}
          </div>

          {/* VISUAL SYSTEM PREVIEW */}
          <div className="relative mx-auto mt-10 max-w-[1040px] overflow-hidden rounded-[2rem] border border-[#80df00]/25 bg-[radial-gradient(circle_at_50%_0%,rgba(126,224,0,0.09),transparent_42%),#06100a] p-5 text-left shadow-[0_24px_90px_rgba(0,0,0,0.55),0_0_50px_rgba(126,224,0,0.06)] sm:mt-12 sm:p-7">
            <div className="grid gap-4 lg:grid-cols-[0.8fr_auto_1.2fr] lg:items-center">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">
                  Real Starting Point
                </p>

                <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.035em]">
                  “Everything is coming through calls, texts, Facebook, and
                  memory.”
                </p>

                <p className="mt-4 text-sm leading-6 text-white/56">
                  Start with the actual problem, not a software feature list.
                </p>
              </div>

              <div className="hidden text-center text-[#80df00] lg:block">
                <ArrowRight className="h-7 w-7" aria-hidden="true" />
              </div>

              <div className="rounded-[1.5rem] border border-[#80df00]/25 bg-[#80df00]/[0.045] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                      Connected Working System
                    </p>

                    <h2 className="mt-2 text-2xl font-black tracking-[-0.035em]">
                      One request. One history. One next action.
                    </h2>
                  </div>

                  <div className="rounded-full border border-[#80df00]/30 bg-[#80df00]/10 px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-[#80df00]">
                    Live
                  </div>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {[
                    "Request",
                    "Active Work",
                    "Customer Review",
                    "Approval",
                    "Payment",
                    "Proof",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/10 bg-black/30 px-3 py-4 text-xs font-black text-white/76"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM DOORWAY */}
        <section id="custom-systems-start" className="pt-16 sm:pt-20">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#80df00]">
              Start With The Problem
            </p>

            <h2 className="mx-auto mt-4 max-w-[760px] text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              What are you trying to fix?
            </h2>

            <p className="mx-auto mt-4 max-w-[680px] text-base leading-7 text-white/60">
              You do not need to know what software you need. Choose the
              closest problem and start with what is happening today.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {problemOptions.map((problem) => {
              const active = selectedProblem === problem.name;

              return (
                <button
                  key={problem.name}
                  type="button"
                  onClick={() => chooseProblem(problem.name)}
                  className={`rounded-[1.5rem] border p-6 text-left transition ${
                    active
                      ? "border-[#80df00]/65 bg-[#80df00]/[0.07] shadow-[0_0_36px_rgba(126,224,0,0.08)]"
                      : "border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-[#80df00]/45 hover:bg-[#80df00]/[0.045]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                        Business Problem
                      </div>

                      <h3 className="mt-3 text-2xl font-black tracking-[-0.03em]">
                        {problem.name}
                      </h3>
                    </div>

                    <div
                      className={`mt-1 h-3.5 w-3.5 rounded-full border ${
                        active
                          ? "border-[#80df00] bg-[#80df00]"
                          : "border-white/25"
                      }`}
                    />
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/66">
                    {problem.summary}
                  </p>

                  <span className="mt-5 inline-block text-[11px] font-black uppercase tracking-[0.16em] text-white/42">
                    {active ? "Selected" : "Tap to select"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SELECTED PROBLEM */}
          <div className="mt-6 rounded-[2rem] border border-[#80df00]/25 bg-[linear-gradient(135deg,rgba(6,14,10,0.96),rgba(1,5,4,0.96))] p-6 shadow-[0_0_40px_rgba(126,224,0,0.04)] sm:p-8">
            <div className="grid gap-7 lg:grid-cols-[1fr_0.95fr]">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#80df00]">
                  Selected Problem
                </p>

                <h3 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  {activeProblem.name}
                </h3>

                <p className="mt-4 max-w-[680px] text-base leading-7 text-white/68">
                  {activeProblem.detail}
                </p>

                <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
                  <p className="text-lg font-black text-white">
                    Ready to start your system request?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/58">
                    Answer a few guided questions about how your business works today,
                    where things get scattered, and what you want to improve.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openRequest}
                  className="mt-4 flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-[#80df00] px-6 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19] hover:shadow-[0_0_32px_rgba(126,224,0,0.22)] sm:w-fit"
                >
                  <ClipboardList className="h-5 w-5" aria-hidden="true" />
                  Start My System Request
                </button>

                <p className="mt-3 text-sm leading-6 text-white/42">
                  Your guided request opens below and becomes the starting point for the build.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                  What This Could Connect
                </p>

                <div className="mt-4 space-y-3">
                  {activeProblem.canConnect.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#80df00] text-black">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </div>

                      <p className="text-sm font-bold text-white/74">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GUIDED REQUEST */}
        {requestOpen && (
          <section id="custom-system-request" className="pt-16 sm:pt-20">
            <div className="overflow-hidden rounded-[2rem] border border-[#80df00]/30 bg-[linear-gradient(135deg,rgba(6,14,9,0.98),rgba(0,5,3,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-4 border-b border-[#80df00]/20 bg-[#80df00]/[0.035] px-5 py-4 sm:px-7">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#80df00]">
                    System Request
                  </p>

                  <p className="mt-1 text-sm font-bold text-white/72">
                    Starting with: {selectedProblem}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setRequestOpen(false)}
                  className="min-h-[44px] rounded-xl border border-white/14 bg-black/35 px-4 text-xs font-black uppercase tracking-[0.12em] text-white/68 transition hover:border-[#80df00]/45 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="grid lg:grid-cols-[0.76fr_1.24fr]">
                <div className="border-b border-[rgba(128,223,0,0.12)] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:border-[rgba(128,223,0,0.12)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#80df00]">
                    Tell Me What Is Happening
                  </p>

                  <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl">
                    Start with the real workflow.
                  </h2>

                  <p className="mt-5 text-base leading-7 text-white/66">
                    You do not need to design the system first. Show me what
                    happens now, where it breaks down, and what you are trying
                    to make easier.
                  </p>

                  <div className="mt-7 rounded-[1.5rem] border border-[#80df00]/25 bg-[#80df00]/[0.045] p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                      Starting Problem
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      {selectedProblem}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      "Show me how it works today",
                      "Tell me where it gets messy",
                      "Share anything useful",
                      "Your request becomes the starting record",
                    ].map((step, index) => (
                      <div
                        key={step}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#80df00] text-sm font-black text-black">
                          {index + 1}
                        </div>

                        <span className="text-sm font-bold text-white/78">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={submitRequest} className="p-6 sm:p-8">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                        Business Or Project
                      </span>

                      <input
                        value={requestForm.businessName}
                        onChange={(event) =>
                          updateField("businessName", event.target.value)
                        }
                        placeholder="Business or project name"
                        required
                        className="min-h-[56px] w-full rounded-2xl border border-[rgba(128,223,0,0.18)] bg-black/50 hover:border-[rgba(128,223,0,0.34)] focus:border-[rgba(128,223,0,0.58)] px-4 text-white outline-none placeholder:text-white/32 focus:border-[#80df00]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                        What Do You Do?
                      </span>

                      <input
                        value={requestForm.whatYouDo}
                        onChange={(event) =>
                          updateField("whatYouDo", event.target.value)
                        }
                        placeholder="What does the business do?"
                        required
                        className="min-h-[56px] w-full rounded-2xl border border-[rgba(128,223,0,0.18)] bg-black/50 hover:border-[rgba(128,223,0,0.34)] focus:border-[rgba(128,223,0,0.58)] px-4 text-white outline-none placeholder:text-white/32 focus:border-[#80df00]"
                      />
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                      Walk Me Through What Happens Today
                    </span>

                    <textarea
                      value={requestForm.currentFlow}
                      onChange={(event) =>
                        updateField("currentFlow", event.target.value)
                      }
                      required
                      placeholder="Example: Customer messages me → I ask questions → I give a price → we schedule → I do the work → I collect payment."
                      className="min-h-[150px] w-full resize-y rounded-2xl border border-[rgba(128,223,0,0.18)] bg-black/50 hover:border-[rgba(128,223,0,0.34)] focus:border-[rgba(128,223,0,0.58)] px-4 py-4 text-white outline-none placeholder:text-white/32 focus:border-[#80df00]"
                    />
                  </label>

                  <fieldset className="mt-5">
                    <legend className="text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                      Where Does It Get Messy?
                    </legend>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {breakdownOptions.map((option) => {
                        const active =
                          requestForm.breakdowns.includes(option);

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleBreakdown(option)}
                            className={`min-h-[54px] rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                              active
                                ? "border-[#80df00]/70 bg-[#80df00]/10 text-white"
                                : "border-[rgba(128,223,0,0.16)] bg-black/35 text-white/72 hover:border-[rgba(128,223,0,0.34)] hover:bg-[rgba(128,223,0,0.025)]"
                            }`}
                          >
                            <span className="flex items-center justify-between gap-3">
                              {option}

                              {active && (
                                <Check
                                  className="h-4 w-4 text-[#80df00]"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <label className="mt-4 block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                      Existing Website, Facebook Page, Or Useful Link
                    </span>

                    <input
                      value={requestForm.existingLink}
                      onChange={(event) =>
                        updateField("existingLink", event.target.value)
                      }
                      placeholder="Optional link"
                      inputMode="url"
                      className="min-h-[56px] w-full rounded-2xl border border-[rgba(128,223,0,0.18)] bg-black/50 hover:border-[rgba(128,223,0,0.34)] focus:border-[rgba(128,223,0,0.58)] px-4 text-white outline-none placeholder:text-white/32 focus:border-[#80df00]"
                    />
                  </label>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                        Your Name
                      </span>

                      <input
                        value={requestForm.name}
                        onChange={(event) =>
                          updateField("name", event.target.value)
                        }
                        required
                        autoComplete="name"
                        placeholder="Name"
                        className="min-h-[56px] w-full rounded-2xl border border-[rgba(128,223,0,0.18)] bg-black/50 hover:border-[rgba(128,223,0,0.34)] focus:border-[rgba(128,223,0,0.58)] px-4 text-white outline-none placeholder:text-white/32 focus:border-[#80df00]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                        Phone
                      </span>

                      <input
                        value={requestForm.phone}
                        onChange={(event) =>
                          updateField("phone", event.target.value)
                        }
                        required
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="Phone"
                        className="min-h-[56px] w-full rounded-2xl border border-[rgba(128,223,0,0.18)] bg-black/50 hover:border-[rgba(128,223,0,0.34)] focus:border-[rgba(128,223,0,0.58)] px-4 text-white outline-none placeholder:text-white/32 focus:border-[#80df00]"
                      />
                    </label>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                        Email Optional
                      </span>

                      <input
                        value={requestForm.email}
                        onChange={(event) =>
                          updateField("email", event.target.value)
                        }
                        type="email"
                        autoComplete="email"
                        placeholder="Email"
                        className="min-h-[56px] w-full rounded-2xl border border-[rgba(128,223,0,0.18)] bg-black/50 hover:border-[rgba(128,223,0,0.34)] focus:border-[rgba(128,223,0,0.58)] px-4 text-white outline-none placeholder:text-white/32 focus:border-[#80df00]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                        Best Way To Reach You
                      </span>

                      <select
                        value={requestForm.contactPreference}
                        onChange={(event) =>
                          updateField(
                            "contactPreference",
                            event.target.value,
                          )
                        }
                        required
                        className="min-h-[56px] w-full cursor-pointer rounded-2xl border border-[rgba(128,223,0,0.18)] bg-black/50 hover:border-[rgba(128,223,0,0.34)] focus:border-[rgba(128,223,0,0.58)] px-4 text-white outline-none focus:border-[#80df00]"
                      >
                        <option value="">Choose one</option>
                        <option>Text</option>
                        <option>Call</option>
                        <option>Email</option>
                        <option>Messenger</option>
                      </select>
                    </label>
                  </div>

                  <label className="mt-3 block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                      Anything Else Daniel Should Know?
                    </span>

                    <textarea
                      value={requestForm.notes}
                      onChange={(event) =>
                        updateField("notes", event.target.value)
                      }
                      placeholder="Anything important about the problem, customers, staff, current process, or what you want to improve."
                      className="min-h-[120px] w-full resize-y rounded-2xl border border-[rgba(128,223,0,0.18)] bg-black/50 hover:border-[rgba(128,223,0,0.34)] focus:border-[rgba(128,223,0,0.58)] px-4 py-4 text-white outline-none placeholder:text-white/32 focus:border-[#80df00]"
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-5 min-h-[62px] w-full rounded-2xl bg-[#80df00] px-6 text-lg font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19] hover:shadow-[0_0_36px_rgba(126,224,0,0.24)]"
                  >
                    Send My System Request
                  </button>

                  {submitted && (
                    <div
                      role="status"
                      className="mt-4 rounded-2xl border border-[#80df00]/40 bg-[#80df00]/10 p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#80df00] text-black">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </div>

                        <div>
                          <p className="font-black text-[#b7ff59]">
                            Your starting request is organized.
                          </p>

                          <p className="mt-1 text-sm leading-6 text-white/68">
                            The problem, current workflow, breakdown points,
                            business information, and contact details are now
                            grouped into one starting record.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 text-xs text-white/38">
                    <ShieldCheck
                      className="h-4 w-4 text-[#80df00]"
                      aria-hidden="true"
                    />
                    Prototype request data currently stays in this browser.
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="pt-16 sm:pt-20">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#80df00]">
              How A Build Moves
            </p>

            <h2 className="mx-auto mt-4 max-w-[760px] text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl">
              The front door is only
              <span className="mt-1 block text-[#80df00]">
                the beginning.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[720px] text-base leading-7 text-white/62">
              The public page collects the signal. Underneath, the same
              customer and problem can stay connected through the build,
              progress, review, approval, launch, and ongoing relationship.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Search,
                title: "1. Understand The Problem",
                copy:
                  "Start with what happens today and where the real process breaks down.",
              },
              {
                icon: GitBranch,
                title: "2. Map The Workflow",
                copy:
                  "Connect the people, decisions, information, and next actions that already exist.",
              },
              {
                icon: Wrench,
                title: "3. Build The Working Version",
                copy:
                  "Create the public entrance and the working system underneath it.",
              },
              {
                icon: MonitorSmartphone,
                title: "4. Show Progress",
                copy:
                  "Screenshots, working previews, changes, and current state stay visible.",
              },
              {
                icon: FileCheck2,
                title: "5. Review & Approve",
                copy:
                  "The customer can say Looks Good or Request A Change without losing the history.",
              },
              {
                icon: Sparkles,
                title: "6. Launch & Keep Improving",
                copy:
                  "The system goes live, then future improvements stay attached to the same relationship.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.028] p-5"
              >
                <Icon className="h-7 w-7 text-[#80df00]" aria-hidden="true" />

                <h3 className="mt-4 text-xl font-black">{title}</h3>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* REAL BUILDS */}
        <section className="pt-16 sm:pt-20">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#80df00]">
              Real Build Patterns
            </p>

            <h2 className="mx-auto mt-4 max-w-[760px] text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Different operations. Same connected DNA.
            </h2>

            <p className="mx-auto mt-4 max-w-[690px] text-base leading-7 text-white/60">
              The system changes around the operation. The underlying pattern
              stays human: signal, action, proof, next step, outcome.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {buildExamples.map((build) => (
              <article
                key={build.name}
                className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.012))] p-6"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                  Working Example
                </p>

                <h3 className="mt-3 min-h-[58px] text-2xl font-black tracking-[-0.035em]">
                  {build.name}
                </h3>

                <div className="mt-5 rounded-2xl border border-[#80df00]/20 bg-[#80df00]/[0.045] p-4 text-sm font-black leading-6 text-[#c7ff85]">
                  {build.flow}
                </div>

                <p className="mt-4 text-sm leading-6 text-white/58">
                  {build.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="pt-16 sm:pt-20">
          <div className="rounded-[2rem] border border-[#80df00]/25 bg-[radial-gradient(circle_at_50%_0%,rgba(126,224,0,0.10),transparent_50%),#06100a] p-7 text-center sm:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#80df00]">
              Start With What Is Real
            </p>

            <h2 className="mx-auto mt-4 max-w-[760px] text-4xl font-black leading-[0.96] tracking-[-0.05em] sm:text-5xl">
              Show me the process before we talk about the software.
            </h2>

            <p className="mx-auto mt-5 max-w-[670px] text-base leading-7 text-white/62">
              Tell me what customers do, what you do next, where things get
              scattered, and what you wish worked better.
            </p>

            <button
              type="button"
              onClick={() => {
                scrollToProblems();
              }}
              className="mt-7 inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl bg-[#80df00] px-7 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19]"
            >
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
              Show Me What You Need
            </button>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-white/34">
              Daniel / Custom Systems · Powered by HomePlanet
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}




