import { useMemo } from "react";
import {
  CUSTOM_SYSTEMS_AWARENESS_LANES,
  type CustomSystemsBuildRecord,
  type CustomSystemsAwarenessLane,
  toCustomSystemsBuildCardView,
} from "../lib/customSystemsBuildRecord";

const BUILD_RECORDS: CustomSystemsBuildRecord[] = [
  {
    id: "build-smith-property-care",
    createdAt: "2026-07-19T09:15:00-04:00",
    updatedAt: "2026-07-20T10:40:00-04:00",
    customer: {
      name: "James Smith",
      businessName: "Smith's Property Care",
    },
    originalRequest:
      "I need a better way to keep the jobs, estimates, customer updates, and subcontracted work organized.",
    whatWeAreSolving:
      "Create one connected operating flow so incoming work, decisions, job progress, customer communication, and handoffs stay attached to the same job history.",
    startingPoint: {
      summary:
        "Work is coordinated across conversations, calls, memory, and separate follow-ups.",
      proof: [],
    },
    status: "Understanding Problem",
    currentMilestone: "Map the real job flow",
    nextAction:
      "Confirm where estimates, approvals, subcontractors, and customer updates currently break apart.",
    currentBuild: {
      summary:
        "Workflow architecture is being mapped from the customer's real operating process.",
      versionLabel: "Discovery",
    },
    progressProof: [],
    customerReview: {
      reviewRequest: "",
      whatChanged: "",
      decision: "pending",
    },
    communicationHistory: [
      {
        id: "comm-smith-1",
        createdAt: "2026-07-19T09:15:00-04:00",
        channel: "messenger",
        direction: "incoming",
        summary:
          "Customer described needing a cleaner way to organize jobs, estimates, and follow-through.",
        permanentHistory: true,
      },
    ],
    timeline: [
      {
        id: "timeline-smith-1",
        createdAt: "2026-07-19T09:15:00-04:00",
        type: "request-received",
        title: "Original need captured",
        actor: "Customer",
      },
      {
        id: "timeline-smith-2",
        createdAt: "2026-07-20T10:40:00-04:00",
        type: "problem-understanding",
        title: "Operating problem being mapped",
        actor: "Daniel",
      },
    ],
    launch: {},
    ongoing: {
      active: false,
    },
  },
  {
    id: "build-demo-home-services",
    createdAt: "2026-07-18T13:20:00-04:00",
    updatedAt: "2026-07-20T12:10:00-04:00",
    customer: {
      name: "Demo Customer",
      businessName: "Home Services System",
    },
    originalRequest:
      "Show me a system that can take a customer from the first request all the way through the actual job without losing the details.",
    whatWeAreSolving:
      "Prove the connected HomePlanet operating flow from request through active work, proof, payment, and follow-up.",
    startingPoint: {
      summary:
        "A traditional website would collect a lead but leave the actual work disconnected afterward.",
      proof: [],
    },
    status: "Waiting On Customer",
    currentMilestone: "Customer workflow review",
    nextAction:
      "Wait for customer feedback on the guided request and active-work flow.",
    currentBuild: {
      summary:
        "Live customer doorway and connected home-services operating flow are ready for feedback.",
      url: "/planet/demo/home-services",
      versionLabel: "Review build",
    },
    progressProof: [],
    customerReview: {
      requestedAt: "2026-07-20T12:10:00-04:00",
      reviewRequest:
        "Review the request flow and how the job continues after submission.",
      whatChanged:
        "The request now stays connected to the work instead of ending as a disconnected form submission.",
      decision: "pending",
    },
    communicationHistory: [],
    timeline: [
      {
        id: "timeline-home-services-1",
        createdAt: "2026-07-18T13:20:00-04:00",
        type: "request-received",
        title: "System direction captured",
        actor: "Customer",
      },
      {
        id: "timeline-home-services-2",
        createdAt: "2026-07-20T12:10:00-04:00",
        type: "review-requested",
        title: "Customer review requested",
        actor: "Daniel",
      },
    ],
    launch: {},
    ongoing: {
      active: false,
    },
  },
  {
    id: "build-echols-water",
    createdAt: "2026-07-18T08:30:00-04:00",
    updatedAt: "2026-07-20T13:35:00-04:00",
    customer: {
      name: "Echols",
      businessName: "Echols Plumbing & Air Conditioning",
    },
    originalRequest:
      "Customers need an easier way to understand the water testing options and know what to do next.",
    whatWeAreSolving:
      "Turn a confusing service decision into a guided customer path with clear next actions.",
    startingPoint: {
      summary:
        "Customers had to understand service choices without a guided digital decision path.",
      proof: [],
    },
    status: "Ready For Review",
    currentMilestone: "Review live water-testing experience",
    nextAction:
      "Open the current build, verify the customer-facing flow, and send the review update.",
    currentBuild: {
      summary:
        "The branded water-testing customer experience is built and ready for focused review.",
      url: "/planet/echols-water-testing",
      versionLabel: "Review candidate",
    },
    progressProof: [],
    customerReview: {
      reviewRequest:
        "Review the service choices, customer guidance, and next-step clarity.",
      whatChanged:
        "The service is now presented as a guided decision rather than a generic page.",
      decision: "pending",
    },
    communicationHistory: [],
    timeline: [
      {
        id: "timeline-echols-1",
        createdAt: "2026-07-18T08:30:00-04:00",
        type: "request-received",
        title: "Water-testing direction captured",
        actor: "Customer",
      },
      {
        id: "timeline-echols-2",
        createdAt: "2026-07-20T13:35:00-04:00",
        type: "build-progress",
        title: "Current build ready for Daniel's review",
        actor: "Daniel",
      },
    ],
    launch: {},
    ongoing: {
      active: false,
    },
  },
  {
    id: "build-custom-systems",
    createdAt: "2026-07-20T09:00:00-04:00",
    updatedAt: "2026-07-20T16:05:00-04:00",
    customer: {
      name: "Daniel Doyon",
      businessName: "HomePlanet Custom Systems",
    },
    originalRequest:
      "The customer needs to be able to see where we started, what changed, what I need reviewed, and either say Looks Good or request a change without losing the history.",
    whatWeAreSolving:
      "Build one permanent Build Record connecting Daniel's operator workflow and the customer's review loop from first request through launch and ongoing work.",
    startingPoint: {
      summary:
        "The public Live Page existed, but the operator board and customer review architecture underneath it had not yet been built.",
      proof: [],
    },
    status: "Ready To Launch",
    currentMilestone: "Architecture gate passed",
    nextAction:
      "Complete operator board, Active Drawer, and customer review view before activating the full workflow.",
    currentBuild: {
      summary:
        "Canonical one-Build-Record domain model is locked and the operator awareness board is being added.",
      url: "/planet/custom-systems",
      versionLabel: "Architecture foundation",
    },
    progressProof: [],
    customerReview: {
      reviewRequest:
        "Confirm the locked architecture before persistence and live customer actions are connected.",
      whatChanged:
        "Board lanes are now derived from one canonical Build Record rather than stored as competing workflow states.",
      decision: "looks-good",
      decidedAt: "2026-07-20T16:05:00-04:00",
    },
    communicationHistory: [],
    timeline: [
      {
        id: "timeline-custom-1",
        createdAt: "2026-07-20T09:00:00-04:00",
        type: "problem-understanding",
        title: "One Build Record architecture locked",
        actor: "Daniel",
      },
      {
        id: "timeline-custom-2",
        createdAt: "2026-07-20T16:05:00-04:00",
        type: "launch-ready",
        title: "Architecture foundation ready for the operator layer",
        actor: "HomePlanet",
      },
    ],
    launch: {},
    ongoing: {
      active: false,
    },
  },
];

function formatActivity(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function statusTone(lane: CustomSystemsAwarenessLane) {
  switch (lane) {
    case "Needs My Action":
      return "border-[#7ee000]/35 bg-[#7ee000]/[0.07] text-[#b8ff68]";
    case "Waiting On Customer":
      return "border-amber-300/25 bg-amber-300/[0.07] text-amber-100";
    case "Ready For Review":
      return "border-sky-300/25 bg-sky-300/[0.07] text-sky-100";
    case "Ready To Launch":
      return "border-violet-300/25 bg-violet-300/[0.07] text-violet-100";
  }
}

export default function DanielCustomSystemsBuildBoard() {
  const cardsByLane = useMemo(() => {
    const result = new Map<
      CustomSystemsAwarenessLane,
      ReturnType<typeof toCustomSystemsBuildCardView>[]
    >();

    for (const lane of CUSTOM_SYSTEMS_AWARENESS_LANES) {
      result.set(lane, []);
    }

    for (const record of BUILD_RECORDS) {
      const card = toCustomSystemsBuildCardView(record);

      if (!card.awarenessLane) {
        continue;
      }

      result.get(card.awarenessLane)?.push(card);
    }

    return result;
  }, []);

  return (
    <main className="min-h-screen bg-[#070b09] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(126,224,0,0.07),transparent_34%)]" />

      <div className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-7 rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9ae93c]">
                HomePlanet · Daniel / Custom Systems
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                Build Board
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62 sm:text-base">
                Awareness first. See what needs attention, open one Build Record,
                do the work in the Active Drawer, complete the action, then close it.
              </p>
            </div>

            <a
              href="/planet/custom-systems"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.045] px-5 py-3 text-sm font-black text-white transition hover:border-[#7ee000]/55 hover:bg-[#7ee000]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee000]"
            >
              View Live Page
            </a>
          </div>
        </header>

        <section
          aria-label="Custom Systems build awareness lanes"
          className="grid gap-5 xl:grid-cols-4"
        >
          {CUSTOM_SYSTEMS_AWARENESS_LANES.map((lane) => {
            const cards = cardsByLane.get(lane) ?? [];

            return (
              <section
                key={lane}
                className="min-w-0 rounded-[26px] border border-white/10 bg-[#0c120f]/92 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.24)]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-white/48">
                      Awareness
                    </p>
                    <h2 className="mt-1 text-lg font-black text-white">
                      {lane}
                    </h2>
                  </div>

                  <span
                    className={`inline-flex min-w-9 items-center justify-center rounded-full border px-3 py-1 text-xs font-black ${statusTone(
                      lane,
                    )}`}
                  >
                    {cards.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {cards.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/38">
                      Nothing here right now.
                    </div>
                  ) : (
                    cards.map((card) => (
                      <article
                        key={card.id}
                        className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/42">
                              Customer / Business
                            </p>

                            <h3 className="mt-1 break-words text-lg font-black leading-tight text-white">
                              {card.customerLabel}
                            </h3>
                          </div>

                          <span className="shrink-0 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] font-bold text-white/65">
                            {card.status}
                          </span>
                        </div>

                        <dl className="mt-5 space-y-4">
                          <div>
                            <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-white/38">
                              Current Milestone
                            </dt>
                            <dd className="mt-1 text-sm font-bold leading-5 text-white/88">
                              {card.currentMilestone}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-white/38">
                              Last Activity
                            </dt>
                            <dd className="mt-1 text-sm text-white/66">
                              {formatActivity(card.lastActivity)}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-white/38">
                              Next Action
                            </dt>
                            <dd className="mt-1 text-sm leading-5 text-white/72">
                              {card.nextAction}
                            </dd>
                          </div>
                        </dl>

                        <button
                          type="button"
                          disabled
                          title="Active Drawer is added in the next controlled patch."
                          className="mt-5 flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-2xl border border-[#7ee000]/25 bg-[#7ee000]/[0.07] px-4 py-3 text-sm font-black text-[#b8ff68]/55"
                        >
                          Open Build
                        </button>
                      </article>
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </section>

        <footer className="mt-6 rounded-[22px] border border-white/8 bg-white/[0.025] px-5 py-4 text-sm leading-6 text-white/46">
          Board = awareness only. The Build Record remains the source of truth.
          Work begins only after a build is opened into the Active Drawer.
        </footer>
      </div>
    </main>
  );
}