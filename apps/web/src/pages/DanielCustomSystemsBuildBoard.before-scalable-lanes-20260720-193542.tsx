import { useEffect, useMemo, useState } from "react";
import {
  CUSTOM_SYSTEMS_AWARENESS_LANES,
  CUSTOM_SYSTEMS_BUILD_STATUSES,
  type CustomSystemsBuildRecord,
  type CustomSystemsAwarenessLane,
  toCustomSystemsBuildCardView,
} from "../lib/customSystemsBuildRecord";
import { supabase } from "../lib/supabase";

const INITIAL_BUILD_RECORDS: CustomSystemsBuildRecord[] = [
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

type CustomSystemsBuildRecordRow = {
  id: string;
  record: CustomSystemsBuildRecord;
  updated_at: string;
};

const CUSTOM_SYSTEMS_BUILD_TABLE = "custom_systems_build_records";
function BuildActionWorkspace({
  record,
  onSave,
  onCompleteAndClose,
}: {
  record: CustomSystemsBuildRecord;
  onSave: (updatedRecord: CustomSystemsBuildRecord) => void;
  onCompleteAndClose: (updatedRecord: CustomSystemsBuildRecord) => void;
}) {
  const [status, setStatus] = useState(record.status);
  const [currentMilestone, setCurrentMilestone] = useState(
    record.currentMilestone,
  );
  const [nextAction, setNextAction] = useState(record.nextAction);
  const [progressNote, setProgressNote] = useState("");

  function buildUpdatedRecord(): CustomSystemsBuildRecord {
    const now = new Date().toISOString();
    const trimmedNote = progressNote.trim();

    return {
      ...record,
      updatedAt: now,
      status,
      currentMilestone: currentMilestone.trim() || record.currentMilestone,
      nextAction: nextAction.trim() || record.nextAction,
      timeline: trimmedNote
        ? [
            ...record.timeline,
            {
              id: `progress-${Date.now()}`,
              createdAt: now,
              type: "build-progress",
              title: "Build progress updated",
              detail: trimmedNote,
              actor: "Daniel",
            },
          ]
        : record.timeline,
    };
  }

  function handleSave() {
    const updated = buildUpdatedRecord();
    onSave(updated);
    setProgressNote("");
  }

  function handleCompleteAndClose() {
    const updated = buildUpdatedRecord();
    onCompleteAndClose(updated);
  }

  return (
    <section className="rounded-[24px] border border-[#7ee000]/28 bg-[#7ee000]/[0.07] p-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.17em] text-[#9ae93c]">
          Action Workspace
        </p>

        <p className="mt-2 text-sm leading-6 text-white/58">
          Work this Build Record here. Saving updates the same record the board
          and timeline use.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">
            Status
          </span>

          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as CustomSystemsBuildRecord["status"],
              )
            }
            className="mt-2 min-h-12 w-full rounded-2xl border border-white/12 bg-[#0b110d] px-4 py-3 text-sm font-bold text-white outline-none transition focus:border-[#7ee000]/65 focus:ring-2 focus:ring-[#7ee000]/20"
          >
            {CUSTOM_SYSTEMS_BUILD_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">
            Current Milestone
          </span>

          <input
            value={currentMilestone}
            onChange={(event) => setCurrentMilestone(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-2xl border border-white/12 bg-[#0b110d] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-[#7ee000]/65 focus:ring-2 focus:ring-[#7ee000]/20"
          />
        </label>

        <label className="block">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">
            Next Action
          </span>

          <textarea
            value={nextAction}
            onChange={(event) => setNextAction(event.target.value)}
            rows={3}
            className="mt-2 w-full resize-y rounded-2xl border border-white/12 bg-[#0b110d] px-4 py-3 text-sm font-semibold leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#7ee000]/65 focus:ring-2 focus:ring-[#7ee000]/20"
          />
        </label>

        <label className="block">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-white/45">
            Progress Note
          </span>

          <textarea
            value={progressNote}
            onChange={(event) => setProgressNote(event.target.value)}
            rows={3}
            placeholder="What did you just do, decide, fix, or learn?"
            className="mt-2 w-full resize-y rounded-2xl border border-white/12 bg-[#0b110d] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#7ee000]/65 focus:ring-2 focus:ring-[#7ee000]/20"
          />

          <span className="mt-2 block text-xs leading-5 text-white/35">
            A progress note becomes part of this Build Record's permanent timeline.
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleSave}
            className="min-h-12 rounded-2xl border border-white/14 bg-white/[0.055] px-4 py-3 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee000]"
          >
            Save Progress
          </button>

          <button
            type="button"
            onClick={handleCompleteAndClose}
            className="min-h-12 rounded-2xl border border-[#7ee000]/40 bg-[#7ee000]/14 px-4 py-3 text-sm font-black text-[#c5ff82] transition hover:border-[#7ee000]/75 hover:bg-[#7ee000]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee000]"
          >
            Complete Action & Close
          </button>
        </div>
      </div>
    </section>
  );
}
type RequestPileSort = "oldest" | "newest";

function formatRequestAge(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}
export default function DanielCustomSystemsBuildBoard() {
  const [buildRecords, setBuildRecords] = useState<CustomSystemsBuildRecord[]>([]);
  const [activeBuildId, setActiveBuildId] = useState<string | null>(null);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState("");
  const [requestPileSort, setRequestPileSort] =
    useState<RequestPileSort>("oldest");

  const activeBuild =
    buildRecords.find((record) => record.id === activeBuildId) ?? null;

  useEffect(() => {
    let cancelled = false;

    async function loadBuildRecords() {
      setRecordsLoading(true);
      setRecordsError("");

      const { data, error } = await supabase
        .from(CUSTOM_SYSTEMS_BUILD_TABLE)
        .select("id, record, updated_at")
        .order("updated_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        setRecordsError(error.message);
        setRecordsLoading(false);
        return;
      }

      const rows = (data ?? []) as CustomSystemsBuildRecordRow[];

      if (rows.length > 0) {
        setBuildRecords(rows.map((row) => row.record));
        setRecordsLoading(false);
        return;
      }

      const seedRows = INITIAL_BUILD_RECORDS.map((record) => ({
        id: record.id,
        record,
        updated_at: record.updatedAt,
      }));

      const { error: seedError } = await supabase
        .from(CUSTOM_SYSTEMS_BUILD_TABLE)
        .upsert(seedRows, { onConflict: "id" });

      if (cancelled) return;

      if (seedError) {
        setRecordsError(seedError.message);
        setRecordsLoading(false);
        return;
      }

      setBuildRecords(INITIAL_BUILD_RECORDS);
      setRecordsLoading(false);
    }

    void loadBuildRecords();

    return () => {
      cancelled = true;
    };
  }, []);

  async function persistBuildRecord(updatedRecord: CustomSystemsBuildRecord) {
    const { error } = await supabase
      .from(CUSTOM_SYSTEMS_BUILD_TABLE)
      .upsert(
        {
          id: updatedRecord.id,
          record: updatedRecord,
          updated_at: updatedRecord.updatedAt,
        },
        { onConflict: "id" },
      );

    if (error) {
      throw error;
    }
  }

  async function pullRequestIntoWork(record: CustomSystemsBuildRecord) {
    const now = new Date().toISOString();

    const updatedRecord: CustomSystemsBuildRecord = {
      ...record,
      status: "Understanding Problem",
      updatedAt: now,
      currentMilestone:
        record.currentMilestone || "Understand the real operating problem",
      nextAction:
        record.nextAction ||
        "Review the request and map what is actually breaking.",
      timeline: [
        ...record.timeline,
        {
          id: `pulled-${Date.now()}`,
          createdAt: now,
          type: "request-pulled-into-work",
          title: "Request pulled into active work",
          actor: "Daniel",
        },
      ],
    };

    await updateBuildRecord(updatedRecord);
  }
  async function updateBuildRecord(updatedRecord: CustomSystemsBuildRecord) {
    setRecordsError("");

    try {
      await persistBuildRecord(updatedRecord);

      setBuildRecords((current) =>
        current.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save Build Record.";

      setRecordsError(message);
    }
  }

  async function completeBuildAction(updatedRecord: CustomSystemsBuildRecord) {
    setRecordsError("");

    try {
      await persistBuildRecord(updatedRecord);

      setBuildRecords((current) =>
        current.map((record) =>
          record.id === updatedRecord.id ? updatedRecord : record,
        ),
      );

      setActiveBuildId(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save Build Record.";

      setRecordsError(message);
    }
  }

  const newRequests = useMemo(() => {
    const requests = buildRecords
      .filter((record) => record.status === "New Lead")
      .slice();

    requests.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();

      return requestPileSort === "oldest"
        ? aTime - bTime
        : bTime - aTime;
    });

    return requests;
  }, [buildRecords, requestPileSort]);
  const cardsByLane = useMemo(() => {
    const result = new Map<
      CustomSystemsAwarenessLane,
      ReturnType<typeof toCustomSystemsBuildCardView>[]
    >();

    for (const lane of CUSTOM_SYSTEMS_AWARENESS_LANES) {
      result.set(lane, []);
    }

    for (const record of buildRecords) {
      const card = toCustomSystemsBuildCardView(record);

      if (!card.awarenessLane) {
        continue;
      }

      result.get(card.awarenessLane)?.push(card);
    }

    return result;
  }, [buildRecords]);

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
                Live Board
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

        {recordsLoading && (
          <div className="mb-5 rounded-[22px] border border-white/10 bg-white/[0.035] px-5 py-4 text-sm font-semibold text-white/60">
            Loading Build Records...
          </div>
        )}

        {recordsError && (
          <div className="mb-5 rounded-[22px] border border-red-400/25 bg-red-400/[0.08] px-5 py-4 text-sm font-semibold text-red-100">
            Build Record error: {recordsError}
          </div>
        )}

        {!recordsLoading && (
          <>
            <section
              aria-labelledby="custom-systems-new-requests-title"
              className="mb-7 rounded-[26px] border border-white/10 bg-[#0c120f]/92 p-4 shadow-[0_22px_60px_rgba(0,0,0,0.24)] sm:p-5"
            >
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ae93c]">
                    Incoming Pile
                  </p>

                  <div className="mt-1 flex items-center gap-3">
                    <h2
                      id="custom-systems-new-requests-title"
                      className="text-xl font-black text-white"
                    >
                      New Requests
                    </h2>

                    <span className="inline-flex min-w-9 items-center justify-center rounded-full border border-[#7ee000]/30 bg-[#7ee000]/10 px-3 py-1 text-xs font-black text-[#b8ff68]">
                      {newRequests.length}
                    </span>
                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">
                    Everything new lands here first. Pull what you want into active
                    work when you are ready.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.13em] text-white/35">
                    Order
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setRequestPileSort((current) =>
                        current === "oldest" ? "newest" : "oldest",
                      )
                    }
                    className="min-h-10 rounded-xl border border-white/12 bg-white/[0.045] px-4 py-2 text-xs font-black text-white/75 transition hover:border-[#7ee000]/45 hover:text-white"
                  >
                    {requestPileSort === "oldest"
                      ? "Oldest First"
                      : "Newest First"}
                  </button>
                </div>
              </div>

              {newRequests.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-white/10 px-5 py-8 text-center">
                  <p className="text-sm font-bold text-white/45">
                    No new requests waiting in the pile.
                  </p>

                  <p className="mt-2 text-xs leading-5 text-white/30">
                    New customer requests will land here before they become active work.
                  </p>
                </div>
              ) : (
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                  {newRequests.map((record) => (
                    <article
                      key={record.id}
                      className="w-[310px] shrink-0 snap-start rounded-[22px] border border-white/10 bg-white/[0.035] p-4 sm:w-[350px]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/40">
                            Customer / Business
                          </p>

                          <h3 className="mt-1 break-words text-lg font-black leading-tight text-white">
                            {record.customer.businessName || record.customer.name}
                          </h3>
                        </div>

                        <span className="shrink-0 rounded-full border border-[#7ee000]/22 bg-[#7ee000]/8 px-2.5 py-1 text-[11px] font-black text-[#b8ff68]">
                          New
                        </span>
                      </div>

                      <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/68">
                        {record.originalRequest}
                      </p>

                      <div className="mt-4 border-t border-white/8 pt-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.13em] text-white/35">
                          Came In
                        </p>

                        <p className="mt-1 text-sm font-bold text-white/65">
                          {formatRequestAge(record.createdAt)}
                        </p>
                      </div>

                      <div className="mt-5 grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setActiveBuildId(record.id)}
                          className="min-h-11 rounded-xl border border-white/12 bg-white/[0.045] px-3 py-2 text-xs font-black text-white transition hover:border-white/28"
                        >
                          Open Request
                        </button>

                        <button
                          type="button"
                          onClick={() => void pullRequestIntoWork(record)}
                          className="min-h-11 rounded-xl border border-[#7ee000]/35 bg-[#7ee000]/10 px-3 py-2 text-xs font-black text-[#b8ff68] transition hover:border-[#7ee000]/70 hover:bg-[#7ee000]/15"
                        >
                          Pull Into Work
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
                  Active Work
                </p>
                <h2 className="mt-1 text-xl font-black text-white">
                  Builds In Motion
                </h2>
              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-white/55">
                {
                  buildRecords.filter((record) => record.status !== "New Lead")
                    .length
                }
              </span>
            </div>

            <section
              aria-label="Custom Systems active build awareness lanes"
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
                          onClick={() => setActiveBuildId(card.id)}
                          className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#7ee000]/35 bg-[#7ee000]/10 px-4 py-3 text-sm font-black text-[#b8ff68] transition hover:border-[#7ee000]/70 hover:bg-[#7ee000]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee000]"
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
          </>
        )}

        <footer className="mt-6 rounded-[22px] border border-white/8 bg-white/[0.025] px-5 py-4 text-sm leading-6 text-white/46">
          Live Board = awareness and pull-based work. New requests wait in the pile
          until Daniel chooses what to pull into active work. The Build Record remains
          the source of truth.
        </footer>
      </div>

      {activeBuild ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close Active Drawer"
            onClick={() => setActiveBuildId(null)}
            className="absolute inset-0 bg-black/72 backdrop-blur-sm"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="custom-systems-active-drawer-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-[760px] flex-col border-l border-white/10 bg-[#090e0b] shadow-[-30px_0_90px_rgba(0,0,0,0.55)]"
          >
            <header className="shrink-0 border-b border-white/10 bg-[#0d140f] px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9ae93c]">
                    Active Drawer
                  </p>

                  <h2
                    id="custom-systems-active-drawer-title"
                    className="mt-2 break-words text-2xl font-black tracking-[-0.03em] text-white sm:text-3xl"
                  >
                    {activeBuild.customer.businessName?.trim() ||
                      activeBuild.customer.name}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/68">
                      {activeBuild.status}
                    </span>

                    <span className="rounded-full border border-[#7ee000]/25 bg-[#7ee000]/[0.07] px-3 py-1 text-xs font-bold text-[#b8ff68]">
                      {activeBuild.currentMilestone}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveBuildId(null)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.045] text-xl font-black text-white/75 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee000]"
                  aria-label="Close Active Drawer"
                >
                  ×
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-7">
              <div className="space-y-4">

                <section className="rounded-[24px] border border-[#7ee000]/22 bg-[#7ee000]/[0.055] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-[#9ae93c]">
                    What We Are Solving
                  </p>
                  <p className="mt-3 text-base font-semibold leading-7 text-white/88">
                    {activeBuild.whatWeAreSolving}
                  </p>
                </section>

                <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-white/45">
                    Customer's Original Words / Problem
                  </p>
                  <blockquote className="mt-3 border-l-2 border-[#7ee000]/45 pl-4 text-base leading-7 text-white/78">
                    {activeBuild.originalRequest}
                  </blockquote>
                </section>

                <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-white/45">
                    Where We Started / Before Proof
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/72">
                    {activeBuild.startingPoint.summary}
                  </p>

                  {activeBuild.startingPoint.proof.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {activeBuild.startingPoint.proof.map((proof) => (
                        <div
                          key={proof.id}
                          className="rounded-2xl border border-white/8 bg-black/15 p-3"
                        >
                          <p className="text-sm font-bold text-white/85">
                            {proof.label}
                          </p>
                          {proof.description ? (
                            <p className="mt-1 text-sm leading-5 text-white/55">
                              {proof.description}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-white/38">
                      No before-proof items attached yet.
                    </p>
                  )}
                </section>

                <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.17em] text-white/45">
                        Current Build
                      </p>
                      <p className="mt-3 text-base font-bold leading-6 text-white/88">
                        {activeBuild.currentBuild.summary}
                      </p>

                      {activeBuild.currentBuild.versionLabel ? (
                        <p className="mt-2 text-sm text-white/45">
                          {activeBuild.currentBuild.versionLabel}
                        </p>
                      ) : null}
                    </div>

                    {activeBuild.currentBuild.url ? (
                      <a
                        href={activeBuild.currentBuild.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl border border-[#7ee000]/30 bg-[#7ee000]/10 px-4 py-2 text-sm font-black text-[#b8ff68] transition hover:border-[#7ee000]/65 hover:bg-[#7ee000]/15"
                      >
                        Open Current Build
                      </a>
                    ) : null}
                  </div>
                </section>

                <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-white/45">
                    Progress & Proof
                  </p>

                  {activeBuild.progressProof.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {activeBuild.progressProof.map((proof) => (
                        <div
                          key={proof.id}
                          className="rounded-2xl border border-white/8 bg-black/15 p-3"
                        >
                          <p className="text-sm font-bold text-white/85">
                            {proof.label}
                          </p>

                          {proof.description ? (
                            <p className="mt-1 text-sm leading-5 text-white/55">
                              {proof.description}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-white/38">
                      No progress-proof items attached yet.
                    </p>
                  )}
                </section>

                <section className="rounded-[24px] border border-sky-300/18 bg-sky-300/[0.045] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-sky-200">
                    Customer Review
                  </p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/38">
                        What Daniel Needs Reviewed
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/76">
                        {activeBuild.customerReview.reviewRequest ||
                          "No customer review request has been prepared yet."}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/38">
                        What Changed
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/76">
                        {activeBuild.customerReview.whatChanged ||
                          "No review update has been written yet."}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/38">
                        Review State
                      </p>
                      <p className="mt-1 text-sm font-bold text-white/82">
                        {activeBuild.customerReview.decision === "looks-good"
                          ? "Looks Good"
                          : activeBuild.customerReview.decision ===
                              "change-requested"
                            ? "Change Requested"
                            : "Pending"}
                      </p>
                    </div>

                    {activeBuild.customerReview.requestedChange ? (
                      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4">
                        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-amber-100">
                          Requested Change
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/78">
                          {activeBuild.customerReview.requestedChange}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </section>

                <section className="rounded-[24px] border border-[#7ee000]/22 bg-[#7ee000]/[0.055] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-[#9ae93c]">
                    Next Action
                  </p>
                  <p className="mt-3 text-base font-black leading-7 text-white">
                    {activeBuild.nextAction}
                  </p>
                </section>

                <BuildActionWorkspace
                  key={`${activeBuild.id}-${activeBuild.updatedAt}`}
                  record={activeBuild}
                  onSave={updateBuildRecord}
                  onCompleteAndClose={completeBuildAction}
                />

                <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-white/45">
                    Communication History
                  </p>

                  {activeBuild.communicationHistory.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {[...activeBuild.communicationHistory]
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        )
                        .map((entry) => (
                          <div
                            key={entry.id}
                            className="rounded-2xl border border-white/8 bg-black/15 p-4"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/55">
                                {entry.channel}
                              </span>

                              <span className="text-xs text-white/38">
                                {formatActivity(entry.createdAt)}
                              </span>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-white/72">
                              {entry.summary}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-white/38">
                      No communication history recorded yet.
                    </p>
                  )}

                  <p className="mt-4 text-xs leading-5 text-white/32">
                    Text, Messenger, email, phone, and in-person conversations
                    are channels. HomePlanet keeps the permanent history.
                  </p>
                </section>

                <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-white/45">
                    Full Timeline
                  </p>

                  {activeBuild.timeline.length > 0 ? (
                    <div className="mt-5 space-y-0">
                      {[...activeBuild.timeline]
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime(),
                        )
                        .map((event, index, events) => (
                          <div
                            key={event.id}
                            className="relative flex gap-4 pb-5 last:pb-0"
                          >
                            <div className="relative flex w-4 shrink-0 justify-center">
                              <span className="relative z-10 mt-1 h-3 w-3 rounded-full border-2 border-[#7ee000]/65 bg-[#0b110d]" />

                              {index < events.length - 1 ? (
                                <span className="absolute bottom-[-4px] top-3 w-px bg-white/10" />
                              ) : null}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <p className="text-sm font-black text-white/88">
                                  {event.title}
                                </p>

                                <span className="text-xs text-white/35">
                                  {formatActivity(event.createdAt)}
                                </span>
                              </div>

                              {event.detail ? (
                                <p className="mt-1 text-sm leading-6 text-white/58">
                                  {event.detail}
                                </p>
                              ) : null}

                              {event.actor ? (
                                <p className="mt-1 text-xs font-bold text-white/32">
                                  {event.actor}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-white/38">
                      No timeline events recorded yet.
                    </p>
                  )}
                </section>

              </div>
            </div>

            <footer className="shrink-0 border-t border-white/10 bg-[#0d140f] px-5 py-4 sm:px-7">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs leading-5 text-white/38">
                  One Build Record · permanent history
                </p>

                <button
                  type="button"
                  onClick={() => setActiveBuildId(null)}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.05] px-5 py-2 text-sm font-black text-white transition hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ee000]"
                >
                  Close Build
                </button>
              </div>
            </footer>
          </aside>
        </div>
      ) : null}
    </main>
  );
}