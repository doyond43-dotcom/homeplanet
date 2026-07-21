/**
 * Daniel / Custom Systems
 *
 * One Build Record is the source of truth.
 *
 * Every surface must read from and write back to the same record:
 *
 * Customer request
 *   -> Build Record
 *   -> Build Board
 *   -> Active Drawer
 *   -> Customer Review / Update View
 *   -> same Build Record updates
 *   -> launch
 *   -> final review / testimonial
 *   -> ongoing customer
 *
 * IMPORTANT:
 * The board lanes below are awareness views derived from the Build Record.
 * They are NOT separate workflow states and must never become a second
 * source of truth.
 */

export const CUSTOM_SYSTEMS_BUILD_STATUSES = [
  "New Lead",
  "Understanding Problem",
  "Building",
  "Ready For Review",
  "Waiting On Customer",
  "Change Requested",
  "Ready To Launch",
  "Live",
  "Ongoing",
] as const;

export type CustomSystemsBuildStatus =
  (typeof CUSTOM_SYSTEMS_BUILD_STATUSES)[number];

export const CUSTOM_SYSTEMS_AWARENESS_LANES = [
  "Needs My Action",
  "Waiting On Customer",
  "Ready For Review",
  "Ready To Launch",
] as const;

export type CustomSystemsAwarenessLane =
  (typeof CUSTOM_SYSTEMS_AWARENESS_LANES)[number];

export type CustomSystemsReviewDecision =
  | "pending"
  | "looks-good"
  | "change-requested";

export type CustomSystemsTimelineEventType =
  | "request-received"
  | "problem-understanding"
  | "build-progress"
  | "proof-added"
  | "review-requested"
  | "customer-approved"
  | "change-requested"
  | "change-completed"
  | "launch-ready"
  | "launched"
  | "testimonial"
  | "communication"
  | "note"
  | "status-change";

export type CustomSystemsCommunicationChannel =
  | "text"
  | "messenger"
  | "email"
  | "phone"
  | "in-person"
  | "homeplanet";

export type CustomSystemsCommunicationDirection =
  | "incoming"
  | "outgoing"
  | "internal";

export interface CustomSystemsProofItem {
  id: string;
  label: string;
  description?: string;
  url?: string;
  createdAt: string;
}

export interface CustomSystemsCommunicationEntry {
  id: string;
  createdAt: string;
  channel: CustomSystemsCommunicationChannel;
  direction: CustomSystemsCommunicationDirection;
  summary: string;

  /**
   * Text, Messenger, email, etc. are notification / communication channels.
   * HomePlanet remains the permanent history.
   */
  permanentHistory: true;
}

export interface CustomSystemsTimelineEvent {
  id: string;
  createdAt: string;
  type: CustomSystemsTimelineEventType;
  title: string;
  detail?: string;
  actor?: "Daniel" | "Customer" | "HomePlanet";
}

export interface CustomSystemsCustomerReview {
  requestedAt?: string;

  /**
   * The exact item, milestone, screen, flow, wording, or behavior
   * Daniel currently needs the customer to review.
   */
  reviewRequest: string;

  /**
   * Customer-facing explanation of what changed since the last review.
   */
  whatChanged: string;

  decision: CustomSystemsReviewDecision;

  decidedAt?: string;

  /**
   * Used only when decision === "change-requested".
   * The customer's words remain attached to this Build Record.
   */
  requestedChange?: string;
}

export interface CustomSystemsBuildRecord {
  id: string;

  createdAt: string;
  updatedAt: string;

  customer: {
    name: string;
    businessName?: string;
    phone?: string;
    email?: string;
  };

  /**
   * Customer's original words / problem.
   * Preserve the original signal instead of replacing it with internal jargon.
   */
  originalRequest: string;

  /**
   * Daniel's current understanding of the real problem being solved.
   */
  whatWeAreSolving: string;

  /**
   * Where the customer started before the custom system work.
   */
  startingPoint: {
    summary: string;
    proof: CustomSystemsProofItem[];
  };

  /**
   * This is the single canonical workflow status.
   */
  status: CustomSystemsBuildStatus;

  currentMilestone: string;

  /**
   * Short awareness text used by the board.
   */
  nextAction: string;

  /**
   * Current version / state of the system being built.
   */
  currentBuild: {
    summary: string;
    url?: string;
    versionLabel?: string;
  };

  progressProof: CustomSystemsProofItem[];

  customerReview: CustomSystemsCustomerReview;

  communicationHistory: CustomSystemsCommunicationEntry[];

  /**
   * Permanent chronological truth chain.
   */
  timeline: CustomSystemsTimelineEvent[];

  launch: {
    launchedAt?: string;
    liveUrl?: string;
    finalReviewCompletedAt?: string;
    testimonial?: string;
  };

  ongoing: {
    active: boolean;
    notes?: string;
  };
}

/**
 * Board lane is DERIVED from the canonical Build Record.
 *
 * Never persist this as a competing workflow status.
 */
export function getCustomSystemsAwarenessLane(
  record: CustomSystemsBuildRecord,
): CustomSystemsAwarenessLane | null {
  switch (record.status) {
    case "New Lead":
      return null;

    case "Understanding Problem":
    case "Building":
    case "Change Requested":
      return "Needs My Action";

    case "Waiting On Customer":
      return "Waiting On Customer";

    case "Ready For Review":
      return "Ready For Review";

    case "Ready To Launch":
      return "Ready To Launch";

    case "Live":
    case "Ongoing":
      return null;

    default: {
      const exhaustiveCheck: never = record.status;
      return exhaustiveCheck;
    }
  }
}

/**
 * The board only needs awareness-level information.
 *
 * Opening the build moves the operator into the Active Drawer,
 * where the actual work happens.
 */
export interface CustomSystemsBuildCardView {
  id: string;
  customerLabel: string;
  status: CustomSystemsBuildStatus;
  currentMilestone: string;
  lastActivity: string;
  nextAction: string;
  awarenessLane: CustomSystemsAwarenessLane | null;
}

export function toCustomSystemsBuildCardView(
  record: CustomSystemsBuildRecord,
): CustomSystemsBuildCardView {
  const latestTimelineEvent =
    record.timeline.length > 0
      ? [...record.timeline].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        )[0]
      : null;

  return {
    id: record.id,
    customerLabel:
      record.customer.businessName?.trim() ||
      record.customer.name.trim() ||
      "Unnamed customer",
    status: record.status,
    currentMilestone: record.currentMilestone,
    lastActivity: latestTimelineEvent?.createdAt ?? record.updatedAt,
    nextAction: record.nextAction,
    awarenessLane: getCustomSystemsAwarenessLane(record),
  };
}

/**
 * Customer approval writes back into the SAME Build Record.
 *
 * This helper returns an updated immutable record so the eventual persistence
 * layer can save one canonical object instead of coordinating separate records.
 */
export function applyCustomerLooksGood(
  record: CustomSystemsBuildRecord,
  decidedAt: string,
): CustomSystemsBuildRecord {
  return {
    ...record,
    updatedAt: decidedAt,
    status: "Ready To Launch",
    nextAction: "Complete launch checks and prepare the build to go live.",
    customerReview: {
      ...record.customerReview,
      decision: "looks-good",
      decidedAt,
      requestedChange: undefined,
    },
    timeline: [
      ...record.timeline,
      {
        id: `customer-approved-${decidedAt}`,
        createdAt: decidedAt,
        type: "customer-approved",
        title: "Customer said Looks Good",
        actor: "Customer",
      },
      {
        id: `status-ready-to-launch-${decidedAt}`,
        createdAt: decidedAt,
        type: "status-change",
        title: "Build moved to Ready To Launch",
        actor: "HomePlanet",
      },
    ],
  };
}

/**
 * Customer change requests also write back into the SAME Build Record.
 */
export function applyCustomerChangeRequest(
  record: CustomSystemsBuildRecord,
  requestedChange: string,
  decidedAt: string,
): CustomSystemsBuildRecord {
  return {
    ...record,
    updatedAt: decidedAt,
    status: "Change Requested",
    nextAction: "Review the requested change and continue the build.",
    customerReview: {
      ...record.customerReview,
      decision: "change-requested",
      decidedAt,
      requestedChange,
    },
    timeline: [
      ...record.timeline,
      {
        id: `change-requested-${decidedAt}`,
        createdAt: decidedAt,
        type: "change-requested",
        title: "Customer requested a change",
        detail: requestedChange,
        actor: "Customer",
      },
      {
        id: `status-change-requested-${decidedAt}`,
        createdAt: decidedAt,
        type: "status-change",
        title: "Build moved to Change Requested",
        actor: "HomePlanet",
      },
    ],
  };
}
