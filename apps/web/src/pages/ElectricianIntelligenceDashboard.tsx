import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Copy,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Zap,
  X,
} from "lucide-react";

const QUICK_REPLIES = [
  {
    title: "Someone looking for an electrician",
    text: `Hi! Okee Dokie Electric would be happy to help. You can see our electrical services and request an estimate here:

👇👇👇

https://www.homeplanet.city/planet/demo/electrician`,
  },
  {
    title: "Someone tagged the business",
    text: `Thank you for tagging Okee Dokie Electric! Here is our page with electrical services and the estimate request form:

👇👇👇

https://www.homeplanet.city/planet/demo/electrician`,
  },
  {
    title: "Send my Live Page",
    text: `Here is the Okee Dokie Electric Live Page. You can view our services and request an electrical estimate here:

👇👇👇

https://www.homeplanet.city/planet/demo/electrician`,
  },
  {
    title: "Request an estimate",
    text: `Absolutely! Tell Okee Dokie Electric what is happening and request your estimate right here:

👇👇👇

https://www.homeplanet.city/planet/demo/electrician`,
  },
  {
    title: "Urgent safety reply",
    text: `Please turn off power to the affected area if it is safe to do so. Do not touch exposed wiring or a sparking outlet. Send your location and a photo if possible so the electrician can review the situation.`,
  },
];

type ElectricianRequest = {
  id: string;
  customer_name: string | null;
  service_type: string | null;
  urgency: string | null;
  problem_details: string | null;
  status: string | null;
  created_at: string;
};
type LiveSuggestion = {
  title: string;
  detail: string;
};

function buildLiveSuggestions(
  requests: ElectricianRequest[]
): LiveSuggestion[] {
  const newest = requests[0];

  if (!newest) {
    return [
      {
        title: "Watch for the first request",
        detail:
          "New electrical requests will generate service-specific next moves here.",
      },
      {
        title: "Keep the Live Page ready",
        detail:
          "Make sure the public request doorway remains easy to share by text and Facebook.",
      },
    ];
  }

  const service = newest.service_type?.toLowerCase() ?? "";
  const urgency = newest.urgency?.toLowerCase() ?? "";
  const customer = newest.customer_name || "the customer";

  const suggestions: LiveSuggestion[] = [];

  if (
    urgency.includes("emergency") ||
    urgency.includes("immediate") ||
    urgency.includes("as soon as possible")
  ) {
    suggestions.push({
      title: "Contact the customer first",
      detail: `${customer} marked this request as urgent. Confirm whether there is heat, smoke, sparking, exposed wiring, or loss of power before discussing the estimate.`,
    });
  }

  if (service.includes("panel")) {
    suggestions.push(
      {
        title: "Request panel and service photos",
        detail:
          "Ask for clear photos of the full panel, breaker labels, main breaker, meter area, and any equipment being added.",
      },
      {
        title: "Confirm electrical capacity",
        detail:
          "Review the existing service size, available breaker space, major appliances, and the reason for the panel upgrade.",
      },
      {
        title: "Check permit and utility requirements",
        detail:
          "Panel replacements may require a permit, inspection, power disconnect, or coordination with the utility company.",
      }
    );
  } else if (service.includes("ev charger")) {
    suggestions.push(
      {
        title: "Request charger-location photos",
        detail:
          "Ask for photos of the electrical panel, garage parking location, and the proposed wire path.",
      },
      {
        title: "Confirm charger specifications",
        detail:
          "Get the charger model, required amperage, vehicle type, and preferred mounting location before estimating.",
      },
      {
        title: "Review panel capacity",
        detail:
          "Confirm whether the existing service can support the new charging circuit or needs additional work.",
      }
    );
  } else if (
    service.includes("troubleshooting") ||
    service.includes("outlets") ||
    service.includes("switches")
  ) {
    suggestions.push(
      {
        title: "Clarify the exact symptoms",
        detail:
          "Ask when the problem started, which circuits are affected, and whether any breaker, outlet, switch, smell, heat, or sound is involved.",
      },
      {
        title: "Request focused photos",
        detail:
          "Ask for photos of the affected device, electrical panel, breaker position, and surrounding area.",
      },
      {
        title: "Plan a diagnostic visit",
        detail:
          "Avoid promising a repair price until the source of the electrical problem has been tested.",
      }
    );
  } else if (service.includes("lighting")) {
    suggestions.push(
      {
        title: "Confirm fixture and location",
        detail:
          "Ask whether the customer already has the fixture and request photos of the installation area.",
      },
      {
        title: "Check access and existing wiring",
        detail:
          "Confirm ceiling height, attic access, switch location, and whether wiring already exists.",
      }
    );
  } else {
    suggestions.push(
      {
        title: "Request useful project photos",
        detail:
          "Ask for clear photos of the panel, work area, and any existing electrical equipment involved.",
      },
      {
        title: "Clarify the desired outcome",
        detail:
          "Confirm what the customer wants completed and whether this is a repair, replacement, or new installation.",
      }
    );
  }

  suggestions.push({
    title: "Follow up with an estimate or visit",
    detail: `Review ${customer}'s information, request anything missing, and confirm the next step while the request is still fresh.`,
  });

  return suggestions.slice(0, 4);
}

export default function ElectricianIntelligenceDashboard() {
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [requests, setRequests] = useState<ElectricianRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<ElectricianRequest | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      setRequestsLoading(true);
      setRequestsError("");

      const { data, error } = await supabase.rpc(
        "get_okee_dokie_electric_demo_requests"
      );

      if (!active) {
        return;
      }

      if (error) {
        console.error("Could not load electrician requests:", error);
        setRequestsError("The live electrical requests could not be loaded.");
        setRequests([]);
      } else {
        setRequests((data ?? []) as ElectricianRequest[]);
      }

      setRequestsLoading(false);
    }

    void loadRequests();

    return () => {
      active = false;
    };
  }, []);

  const urgentCount = useMemo(
    () =>
      requests.filter((request) => {
        const urgency = request.urgency?.toLowerCase() ?? "";

        return (
          urgency.includes("emergency") ||
          urgency.includes("immediate") ||
          urgency.includes("as soon as possible")
        );
      }).length,
    [requests]
  );

  const estimateCount = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.status === "new" ||
          request.status === "pending" ||
          request.status === null
      ).length,
    [requests]
  );

  const followUpCount = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.status === "contacted" ||
          request.status === "follow-up"
      ).length,
    [requests]
  );

  const liveSuggestions = useMemo(
    () => buildLiveSuggestions(requests),
    [requests]
  );

  async function copyReply(title: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(title);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      window.alert("Could not copy the reply automatically.");
    }
  }

  return (
    <main className="min-h-screen bg-[#05070a] px-4 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-blue-400">
            Customer Intelligence
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Okee Dokie Electric
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
            Active electrical signals, urgent safety needs, estimates, and next moves.
          </p>
        </header>

        <section className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0f15]">
          <button
            type="button"
            onClick={() => setRepliesOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
          >
            <div>
              <p className="text-base font-black">Business Quick Replies</p>
              <p className="mt-1 text-xs text-white/50">
                Ready-to-copy replies for Facebook, Messenger, and text.
              </p>
            </div>

            <span className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-2 text-blue-300">
              {repliesOpen ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
            </span>
          </button>

          {repliesOpen && (
            <div className="space-y-3 border-t border-white/10 p-4">
              {QUICK_REPLIES.map((reply) => (
                <article
                  key={reply.title}
                  className="rounded-xl border border-white/10 bg-black/30 p-4"
                >
                  <h2 className="text-sm font-black">{reply.title}</h2>

                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/65">
                    {reply.text}
                  </p>

                  <button
                    type="button"
                    onClick={() => copyReply(reply.title, reply.text)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-blue-200"
                  >
                    <Copy size={15} />
                    {copied === reply.title ? "Copied" : "Copy Reply"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
              [requests.length.toString(), "Active Signals"],
              [urgentCount.toString(), "Urgent"],
              [estimateCount.toString(), "Need Estimate"],
              [followUpCount.toString(), "Follow-Up"],
            ].map(([value, label]) => (
            <article
              key={label}
              className="rounded-2xl border border-white/10 bg-[#0b0f15] p-4"
            >
              <p className="text-3xl font-black text-blue-400">{value}</p>
              <p className="mt-1 text-xs font-bold text-white/50">{label}</p>
            </article>
          ))}
        </section>

        <section className="mb-5 rounded-2xl border border-white/10 bg-[#0b0f15] p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-2 text-blue-300">
              <MessageCircle size={18} />
            </span>

            <div>
              <h2 className="font-black">Active Customer Signals</h2>
              <p className="text-xs text-white/50">
                Real electrical needs requiring attention.
              </p>
            </div>
          </div>

          <div className="space-y-3">
              {requestsLoading && (
                <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-white/55">
                  Loading live electrical requests...
                </div>
              )}

              {!requestsLoading && requestsError && (
                <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
                  {requestsError}
                </div>
              )}

              {!requestsLoading &&
                !requestsError &&
                requests.length === 0 && (
                  <div className="rounded-xl border border-white/10 bg-black/30 p-5">
                    <h3 className="font-black">No active requests yet</h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      New electrical requests will appear here automatically.
                    </p>
                  </div>
                )}

              {requests.map((request) => {
                const submittedAt = new Date(request.created_at);

                return (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => setSelectedRequest(request)}
                    className="group w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-blue-400/45 hover:bg-blue-500/[0.07] hover:shadow-xl hover:shadow-blue-950/20 active:translate-y-0"
                  >
                    <div className="flex gap-3">
                      <span className="mt-0.5 rounded-lg border border-blue-400/20 bg-blue-500/10 p-2 text-blue-400 transition group-hover:border-blue-400/40 group-hover:bg-blue-500/15">
                        <Zap size={19} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-black">
                              {request.customer_name || "Electrical customer"}
                            </h3>

                            <p className="mt-1 text-xs font-bold text-blue-300">
                              {request.service_type ||
                                "Electrical service request"}
                            </p>
                          </div>

                          <span className="rounded-full border border-blue-400/25 bg-blue-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-300">
                            {request.urgency || "Timing not provided"}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 whitespace-pre-line text-sm leading-6 text-white/60">
                          {request.problem_details ||
                            "The customer submitted an electrical service request."}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                          <span className="text-xs font-bold text-white/45">
                            Submitted{" "}
                            {Number.isNaN(submittedAt.getTime())
                              ? "recently"
                              : submittedAt.toLocaleString()}
                          </span>

                          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-blue-300">
                            Open Request
                            <span className="text-base transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0b0f15] p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-2 text-blue-300">
              <Sparkles size={18} />
            </span>

            <div>
              <h2 className="font-black">Live Suggestions</h2>
              <p className="text-xs text-white/50">
                What the business should do next.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {liveSuggestions.map((suggestion, index) => (
              <article
                key={suggestion.title}
                className="flex gap-3 rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-xs font-black text-blue-300">
                  {index + 1}
                </span>

                <div>
                  <h3 className="text-sm font-black">{suggestion.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/55">
                    {suggestion.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <button
            type="button"
            onClick={() =>
              window.location.assign(
                "/planet/demo/electrician/truth-chain"
              )
            }
            className="flex w-full items-center justify-between rounded-2xl border border-blue-400/30 bg-blue-500/10 px-5 py-4 text-left transition hover:border-blue-400/60 hover:bg-blue-500/15"
          >
            <div>
              <div className="flex items-center gap-2 font-black">
                <ClipboardList size={19} className="text-blue-300" />
                Open Live Truth Chain
              </div>
              <p className="mt-1 text-sm text-white/45">
                Move the request from received through the completed outcome.
              </p>
            </div>

            <span className="text-xl text-blue-300">→</span>
          </button>
        </section>

        {selectedRequest && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          >
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Active Request Drawer"
              onClick={(event) => event.stopPropagation()}
              className="h-full w-full overflow-y-auto border-l border-blue-400/25 bg-[#070b11] shadow-2xl shadow-black sm:max-w-xl"
            >
              <div className="sticky top-0 z-10 border-b border-white/10 bg-[#070b11]/95 px-5 py-4 backdrop-blur">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-blue-300">
                      Active Request
                    </div>

                    <h2 className="mt-1 text-xl font-black">
                      {selectedRequest.customer_name ||
                        "Electrical customer"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:border-blue-400/35 hover:bg-blue-500/10 hover:text-white"
                    aria-label="Close active request"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <section className="rounded-2xl border border-blue-400/25 bg-blue-500/[0.07] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.1em] text-white/35">
                        Service requested
                      </div>

                      <h3 className="mt-2 text-xl font-black text-blue-200">
                        {selectedRequest.service_type ||
                          "Electrical service request"}
                      </h3>
                    </div>

                    <span className="rounded-full border border-orange-400/25 bg-orange-500/10 px-3 py-1.5 text-xs font-black text-orange-200">
                      {selectedRequest.urgency || "Timing not provided"}
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs font-black uppercase tracking-[0.1em] text-white/35">
                      Customer details
                    </div>

                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/70">
                      {selectedRequest.problem_details ||
                        "No additional request details were provided."}
                    </p>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-white/35">
                    Private customer contact details are hidden in this public
                    demonstration.
                  </p>
                </section>

                <section className="rounded-2xl border border-white/10 bg-[#0b0f15] p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-xl border border-blue-400/30 bg-blue-500/10 p-2 text-blue-300">
                      <Sparkles size={18} />
                    </span>

                    <div>
                      <h3 className="font-black">What to do next</h3>
                      <p className="text-xs text-white/45">
                        Live guidance based on this request.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {buildLiveSuggestions([selectedRequest]).map(
                      (suggestion, index) => (
                        <div
                          key={suggestion.title}
                          className="flex gap-3 rounded-xl border border-white/10 bg-black/30 p-4"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-xs font-black text-blue-300">
                            {index + 1}
                          </span>

                          <div>
                            <div className="text-sm font-black">
                              {suggestion.title}
                            </div>

                            <p className="mt-1 text-sm leading-6 text-white/55">
                              {suggestion.detail}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </section>

                <button
                  type="button"
                  onClick={() =>
                    window.location.assign(
                      "/planet/demo/electrician/truth-chain"
                    )
                  }
                  className="flex w-full items-center justify-between rounded-2xl border border-blue-400/40 bg-blue-500/15 px-5 py-4 text-left transition hover:border-blue-300 hover:bg-blue-500/20"
                >
                  <div>
                    <div className="flex items-center gap-2 font-black">
                      <ClipboardList
                        size={19}
                        className="text-blue-300"
                      />
                      Open Live Truth Chain
                    </div>

                    <p className="mt-1 text-sm text-white/45">
                      Move this request through the customer outcome.
                    </p>
                  </div>

                  <span className="text-xl text-blue-300">→</span>
                </button>
              </div>
            </aside>
          </div>
        )}
        <footer className="py-8 text-center text-xs font-bold text-white/30">
          HomePlanet Live Board Demo
        </footer>
      </div>
    </main>
  );
}





