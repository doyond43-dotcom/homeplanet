import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  Copy,
  LoaderCircle,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type ElectricianRequest = {
  id: string;
  customer_name: string | null;
  service_type: string | null;
  urgency: string | null;
  problem_details: string | null;
  status: string | null;
  created_at: string;
};

type TruthStage = {
  key: string;
  label: string;
  description: string;
  actionLabel: string;
  quickReply: (request: ElectricianRequest) => string;
};

const TRUTH_STAGES: TruthStage[] = [
  {
    key: "received",
    label: "Request received",
    description: "Review the new customer request and understand what they need.",
    actionLabel: "Mark Request Reviewed",
    quickReply: (request) =>
      `Hi ${request.customer_name || "there"}, we received your electrical request for ${
        request.service_type || "electrical service"
      }. We are reviewing the information now and will follow up with the next step.`,
  },
  {
    key: "contacted",
    label: "Contact the customer",
    description: "Call or message the customer and confirm the important details.",
    actionLabel: "Mark Customer Contacted",
    quickReply: (request) =>
      `Hi ${request.customer_name || "there"}, we are following up about your ${
        request.service_type || "electrical"
      } request. Is now a good time to confirm a few details?`,
  },
  {
    key: "photos-requested",
    label: "Request project photos",
    description: "Ask for the photos needed to understand the work clearly.",
    actionLabel: "Mark Photos Requested",
    quickReply: (request) =>
      `Please send clear photos of the electrical panel, breaker labels, meter area, and the work area for your ${
        request.service_type || "electrical request"
      }. These will help us determine the correct next step.`,
  },
  {
    key: "estimate-sent",
    label: "Prepare and send the estimate",
    description: "Define the work, expected cost, and next steps for the customer.",
    actionLabel: "Mark Estimate Sent",
    quickReply: () =>
      "Your electrical estimate is ready. Please review the scope and expected cost, then let us know whether you would like to approve the work or discuss any questions.",
  },
  {
    key: "approved",
    label: "Customer approved",
    description: "Confirm the customer approved the work and is ready to proceed.",
    actionLabel: "Mark Work Approved",
    quickReply: () =>
      "Thank you for approving the electrical work. We are ready to coordinate the schedule and confirm anything needed before the appointment.",
  },
  {
    key: "completed",
    label: "Work completed",
    description: "Confirm the approved electrical work was finished.",
    actionLabel: "Mark Work Completed",
    quickReply: () =>
      "The approved electrical work has been completed. We will provide the final details and payment information.",
  },
  {
    key: "closed",
    label: "Payment received and outcome closed",
    description: "Confirm payment and close the completed customer outcome.",
    actionLabel: "Close This Outcome",
    quickReply: () =>
      "Payment has been received and your electrical project is now complete. Thank you for choosing Okee Dokie Electric.",
  },
];
function storageKey(requestId: string) {
  return `okee-dokie-electric-truth-chain-${requestId}`;
}

export default function ElectricianTruthChain() {
  const [requests, setRequests] = useState<ElectricianRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [currentStage, setCurrentStage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [copiedStage, setCopiedStage] = useState<string | null>(null);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [correctionOpen, setCorrectionOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      setLoading(true);
      setLoadError("");

      const { data, error } = await supabase.rpc(
        "get_okee_dokie_electric_demo_requests"
      );

      if (!active) {
        return;
      }

      if (error) {
        console.error(error);
        setLoadError("The live electrical requests could not be loaded.");
        setRequests([]);
      } else {
        const liveRequests = (data ?? []) as ElectricianRequest[];
        setRequests(liveRequests);

        if (liveRequests.length > 0) {
          setSelectedRequestId(liveRequests[0].id);
        }
      }

      setLoading(false);
    }

    void loadRequests();

    return () => {
      active = false;
    };
  }, []);

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedRequestId) ?? null,
    [requests, selectedRequestId]
  );

  useEffect(() => {
    if (!selectedRequestId) {
      setCurrentStage(0);
      return;
    }

    const savedStage = Number.parseInt(
      window.localStorage.getItem(storageKey(selectedRequestId)) ?? "0",
      10
    );

    const safeStage = Number.isNaN(savedStage)
      ? 0
      : Math.min(Math.max(savedStage, 0), TRUTH_STAGES.length - 1);

    setCurrentStage(safeStage);
    setCompletedOpen(false);
    setUpcomingOpen(false);
    setCorrectionOpen(false);
  }, [selectedRequestId]);

  function saveStage(nextStage: number) {
    if (!selectedRequestId) {
      return;
    }

    const safeStage = Math.min(
      Math.max(nextStage, 0),
      TRUTH_STAGES.length - 1
    );

    setCurrentStage(safeStage);
    window.localStorage.setItem(
      storageKey(selectedRequestId),
      safeStage.toString()
    );
  }

  async function copyReply(stage: TruthStage) {
    if (!selectedRequest) {
      return;
    }

    await navigator.clipboard.writeText(stage.quickReply(selectedRequest));
    setCopiedStage(stage.key);

    window.setTimeout(() => {
      setCopiedStage(null);
    }, 1800);
  }

  const activeStage = TRUTH_STAGES[currentStage];
  const nextStage = TRUTH_STAGES[currentStage + 1] ?? null;
  const completedStages = TRUTH_STAGES.slice(0, currentStage);
  const upcomingStages = TRUTH_STAGES.slice(currentStage + 1);
  const isFinalStage = currentStage === TRUTH_STAGES.length - 1;
  const progress = Math.round(
    ((currentStage + 1) / TRUTH_STAGES.length) * 100
  );

  return (
    <main className="min-h-screen bg-[#05070a] px-4 py-6 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() =>
            window.location.assign("/planet/demo/electrician/intelligence")
          }
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-white/60 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Intelligence Board
        </button>

        <section className="overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-500/15 via-[#0b1119] to-black shadow-2xl shadow-blue-950/30">
          <div className="border-b border-white/10 px-5 py-6 sm:px-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-blue-300">
                  <ShieldCheck size={15} />
                  Live Truth Chain
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Electrical Request Workflow
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
                  Focus on one step at a time. Complete the current action, then
                  move naturally to the next.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-400/20 bg-black/30 px-4 py-3 text-right">
                <div className="text-2xl font-black text-blue-300">
                  Step {currentStage + 1} of {TRUTH_STAGES.length}
                </div>
                <div className="text-xs font-bold uppercase tracking-wide text-white/40">
                  Current progress
                </div>
              </div>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-blue-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="px-5 py-6 sm:px-7">
            {loading && (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 text-white/55">
                <LoaderCircle className="animate-spin" size={20} />
                Loading live electrical request...
              </div>
            )}

            {!loading && loadError && (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-red-100">
                {loadError}
              </div>
            )}

            {!loading && !loadError && requests.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                No electrical requests are available yet.
              </div>
            )}

            {!loading && requests.length > 0 && (
              <>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-white/45">
                  Working request
                </label>

                <select
                  value={selectedRequestId}
                  onChange={(event) =>
                    setSelectedRequestId(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 font-bold text-white outline-none ring-blue-400 transition focus:ring-2"
                >
                  {requests.map((request) => (
                    <option key={request.id} value={request.id}>
                      {request.customer_name || "Electrical customer"} —{" "}
                      {request.service_type || "Electrical request"}
                    </option>
                  ))}
                </select>

                {selectedRequest && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-black">
                          {selectedRequest.customer_name ||
                            "Electrical customer"}
                        </h2>

                        <p className="mt-1 font-bold text-blue-300">
                          {selectedRequest.service_type ||
                            "Electrical service request"}
                        </p>
                      </div>

                      <span className="rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1.5 text-xs font-black text-orange-200">
                        {selectedRequest.urgency || "Timing not provided"}
                      </span>
                    </div>

                    <p className="mt-4 whitespace-pre-line text-sm leading-6 text-white/60">
                      {selectedRequest.problem_details ||
                        "No additional request details were provided."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {selectedRequest && (
          <>
            <section className="mt-5 rounded-3xl border border-blue-400/45 bg-blue-500/10 p-5 shadow-xl shadow-blue-950/20 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-400/40 bg-blue-500/20 text-lg font-black text-blue-200">
                  {currentStage + 1}
                </div>

                <div>
                  <div className="text-xs font-black uppercase tracking-[0.12em] text-blue-300">
                    Current step
                  </div>
                  <h2 className="mt-1 text-2xl font-black">
                    {activeStage.label}
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-base leading-7 text-white/65">
                {activeStage.description}
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/35 p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.1em] text-blue-300">
                  <MessageCircle size={16} />
                  Customer reply
                </div>

                <p className="whitespace-pre-line text-sm leading-6 text-white/70">
                  {activeStage.quickReply(selectedRequest)}
                </p>

                <button
                  type="button"
                  onClick={() => void copyReply(activeStage)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-black transition hover:border-blue-400/30 hover:bg-blue-500/10"
                >
                  {copiedStage === activeStage.key ? (
                    <>
                      <ClipboardCheck size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Reply
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  saveStage(
                    Math.min(currentStage + 1, TRUTH_STAGES.length - 1)
                  )
                }
                disabled={isFinalStage}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-4 text-base font-black transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-emerald-500 disabled:opacity-100"
              >
                {isFinalStage ? (
                  <>
                    <Check size={19} />
                    Outcome Closed
                  </>
                ) : (
                  <>
                    {activeStage.actionLabel}
                    <ChevronRight size={19} />
                  </>
                )}
              </button>

              {currentStage > 0 && (
                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setCorrectionOpen((open) => !open)}
                    className="text-xs font-bold text-white/35 transition hover:text-white/60"
                  >
                    Correct the current stage
                  </button>

                  {correctionOpen && (
                    <button
                      type="button"
                      onClick={() => {
                        saveStage(currentStage - 1);
                        setCorrectionOpen(false);
                      }}
                      className="mx-auto mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/55"
                    >
                      <RotateCcw size={14} />
                      Move Back One Step
                    </button>
                  )}
                </div>
              )}
            </section>

            {nextStage && (
              <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
                <div className="text-xs font-black uppercase tracking-[0.1em] text-white/35">
                  Coming next
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30 text-sm font-black text-white/40">
                    {currentStage + 2}
                  </div>

                  <div>
                    <h3 className="font-black text-white/75">
                      {nextStage.label}
                    </h3>
                    <p className="mt-1 text-sm text-white/40">
                      {nextStage.description}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {completedStages.length > 0 && (
              <section className="mt-4 overflow-hidden rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.035]">
                <button
                  type="button"
                  onClick={() => setCompletedOpen((open) => !open)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <div className="font-black">Completed steps</div>
                    <div className="mt-1 text-xs text-white/40">
                      {completedStages.length} step
                      {completedStages.length === 1 ? "" : "s"} completed
                    </div>
                  </div>

                  {completedOpen ? (
                    <ChevronUp size={19} className="text-emerald-300" />
                  ) : (
                    <ChevronDown size={19} className="text-emerald-300" />
                  )}
                </button>

                {completedOpen && (
                  <div className="border-t border-white/10 px-5 py-3">
                    {completedStages.map((stage) => (
                      <div
                        key={stage.key}
                        className="flex items-center gap-3 border-b border-white/5 py-3 last:border-0"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                          <Check size={15} />
                        </div>

                        <span className="text-sm font-bold text-white/60">
                          {stage.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {upcomingStages.length > 1 && (
              <section className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                <button
                  type="button"
                  onClick={() => setUpcomingOpen((open) => !open)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <div className="font-black text-white/70">
                      View upcoming steps
                    </div>
                    <div className="mt-1 text-xs text-white/35">
                      See the rest of the workflow only when needed
                    </div>
                  </div>

                  {upcomingOpen ? (
                    <ChevronUp size={19} className="text-white/45" />
                  ) : (
                    <ChevronDown size={19} className="text-white/45" />
                  )}
                </button>

                {upcomingOpen && (
                  <div className="border-t border-white/10 px-5 py-3">
                    {upcomingStages.slice(1).map((stage, index) => (
                      <div
                        key={stage.key}
                        className="flex gap-3 border-b border-white/5 py-3 last:border-0"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/25 text-xs font-black text-white/30">
                          {currentStage + index + 3}
                        </div>

                        <div>
                          <div className="text-sm font-bold text-white/50">
                            {stage.label}
                          </div>
                          <div className="mt-1 text-xs leading-5 text-white/30">
                            {stage.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        <footer className="py-7 text-center text-xs font-bold uppercase tracking-[0.12em] text-white/25">
          <div className="inline-flex items-center gap-2">
            <Zap size={14} />
            HomePlanet Live Truth Chain Demo
          </div>
        </footer>
      </div>
    </main>
  );
}

