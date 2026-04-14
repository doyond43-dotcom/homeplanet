import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { resolveStarterBoardConfig } from "../lib/starterBoardConfig";
import AutoRepairInvoicePanel from "../components/AutoRepairInvoicePanel";

type OnboardingPayload = {
  businessName?: string;
  ownerName?: string;
  businessType?: string;
  city?: string;
  primaryGoal?: string;
  boardSlug?: string;
  presenceId?: string;
  presenceKey?: string;
};

type RepairStage = string;

type ProofClip = {
  id: string;
  label: string;
  note: string;
  createdAt: string;
};

type InvoiceTimelineAction = "copied" | "texted" | "emailed" | "shared";

type RepairJob = {
  id: string;
  roNumber: string;
  customer: string;
  vehicle: string;
  concern: string;
  stage: RepairStage;
  eta: string;
  advisor: string;
  notes: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: string;
  proof?: ProofClip[];
};

type DbRepairJob = {
  id: string;
  board_slug: string;
  ro_number: string;
  customer: string;
  vehicle: string;
  concern: string;
  stage: string;
  eta: string;
  advisor: string;
  notes: string;
  phone: string;
  appointment_date: string | null;
  appointment_time: string;
  created_at: string;
  updated_at: string;
};

type StarterBoardRow = {
  board_slug: string;
  business_name: string;
  business_type: string;
  city: string;
  owner_name: string;
  presence_id: string;
  presence_key: string;
  trial_started_at: string;
  trial_ends_at: string;
  starter_plan: string;
  is_active: boolean;
  created_at: string;
  claimed_at?: string | null;
  claimed_by?: string | null;
  claim_email?: string | null;
  claim_name?: string | null;
  claim_status?: string | null;
};

type MessageActionCardProps = {
  title: string;
  subtitle: string;
  message: string;
  phone: string;
  recipientLabel?: string;
  onCopy: (label: string, text: string) => void;
};

type RestaurantIdentityMode = "table" | "name";

type RestaurantTicketDraft = {
  id?: string;
  roNumber?: string;
  customer: string;
  vehicle: string;
  concern: string;
  stage: string;
  eta: string;
  advisor: string;
  notes: string;
};

type PaymentProfile = {
  cashAppCashtag: string;
  zelleValue: string;
};
const DEMO_BOARD_SLUG = "demo-auto-repair";

function createPresenceId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "HP-";
  for (let i = 0; i < 8; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function getPreviewDismissKey(boardSlug: string) {
  return `hp_preview_dismissed_${boardSlug}`;
}

function getLocalClaimKey(boardSlug: string) {
  return `hp_board_claimed_${boardSlug}`;
}
function getBoardViewModeKey(boardSlug: string) {
  return `hp_board_view_mode_${boardSlug}`;
}


function getPaymentProfileStoreKey(boardSlug: string) {
  return `hp_payment_profile_${boardSlug}`;
}

function sanitizeCashAppCashtag(value: string) {
  return (value || "").trim().replace(/^\$/, "").replace(/[^\w]/g, "");
}

function sanitizeMoneyInput(value: string) {
  const cleaned = (value || "").replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("").replace(/\./g, "")}`;
}

function readStoredPaymentProfile(boardSlug: string): PaymentProfile {
  if (!boardSlug) {
    return {
      cashAppCashtag: "",
      zelleValue: "",
    };
  }

  try {
    const raw = window.localStorage.getItem(getPaymentProfileStoreKey(boardSlug));
    if (!raw) {
      return {
        cashAppCashtag: "",
        zelleValue: "",
      };
    }

    const parsed = JSON.parse(raw) as Partial<PaymentProfile>;
    return {
      cashAppCashtag: sanitizeCashAppCashtag(parsed.cashAppCashtag || ""),
      zelleValue: (parsed.zelleValue || "").trim(),
    };
  } catch {
    return {
      cashAppCashtag: "",
      zelleValue: "",
    };
  }
}

function buildCashAppUrl(cashtag: string) {
  const cleanTag = sanitizeCashAppCashtag(cashtag);
  return cleanTag ? `https://cash.app/$${cleanTag}` : "";
}

function buildPaymentQrSrc(value: string) {
  if (!value) return "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    value,
  )}`;
}

function buildZelleQrPayload(args: {
  businessName: string;
  zelleValue: string;
  amount: string;
  memo: string;
}) {
  const lines = [
    args.businessName || "Payment",
    `Zelle to: ${args.zelleValue}`,
  ];

  if (args.amount) {
    lines.push(`Amount: ${args.amount}`);
  }

  if (args.memo) {
    lines.push(`Memo: ${args.memo}`);
  }

  return lines.join("\n");
}

function buildZelleActionHref(value: string) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "";

  if (trimmed.includes("@")) {
    return `mailto:${trimmed}`;
  }

  const digits = trimmed.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

function openExternalLink(href: string) {
  if (!href) return;
  window.open(href, "_blank", "noopener,noreferrer");
}
function toTitleCaseFromSlug(value: string) {
  return (value || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isGenericLiveBoardName(value?: string | null) {
  const lower = (value || "").trim().toLowerCase();
  return (
    !lower ||
    lower === "auto repair live board" ||
    lower === "restaurant live board" ||
    lower === "live board" ||
    lower === "home services live" ||
    lower === "auto repair demo" ||
    lower === "starter live board"
  );
}

function makeBoardTitle(value: string) {
  const trimmed = (value || "").trim();
  if (!trimmed) return "Live Board";
  return /live board$/i.test(trimmed) ? trimmed : `${trimmed} Live Board`;
}


function normalizeBusinessTypeForLiveBoard(rawType: string, slugHint: string) {
  const value = (rawType || "").trim();
  const lower = value.toLowerCase();
  const slug = (slugHint || "").toLowerCase();

  if (
    lower.includes("contractor") ||
    lower.includes("home service") ||
    lower.includes("home-service") ||
    lower.includes("handyman") ||
    lower.includes("plumb") ||
    lower.includes("electric") ||
    lower.includes("hvac") ||
    lower.includes("roof") ||
    lower.includes("landscap") ||
    lower.includes("pressure wash") ||
    lower.includes("cleaning service") ||
    lower.includes("home repair") ||
    lower.includes("home repairs") ||
    slug.includes("contractor") ||
    slug.includes("home-service") ||
    slug.includes("home-service") ||
    slug.includes("home-services") ||
    slug.includes("plumb") ||
    slug.includes("electric") ||
    slug.includes("hvac") ||
    slug.includes("roof") ||
    slug.includes("home-repair") ||
    slug.includes("home-repairs")
  ) {
    return "Home Services";
  }

  if (
    lower.includes("detail") ||
    lower.includes("detailing") ||
    lower.includes("car wash") ||
    slug.includes("detail")
  ) {
    return "Auto Detailing";
  }

  if (!value && slug.includes("restaurant")) {
    return "Restaurant";
  }

  return value || "General";
}

function resolveLiveBoardConfig(args: {
  businessType: string;
  businessName: string;
  primaryGoal: string;
}) {
  const bt = normalizeBusinessTypeForLiveBoard(
    args.businessType || "",
    args.businessName || "",
  ).toLowerCase();

  if (bt.includes("home services")) {
    return {
      key: "home-services-live",
      familyLabel: "Home Services Live",
      boardSubtitle:
        "Built for contractors and field-service teams with scheduling, travel, on-site work, and completion flow.",
      createButtonLabel: "+ Add Service Request",
      flowLabel: "New Request â†’ Scheduled â†’ En Route â†’ On Site â†’ Completed",
      stages: ["New Request", "Scheduled", "En Route", "On Site", "Completed"],
      labels: {
        item: "Property / Job",
        concern: "Requested Service",
        advisor: "Crew / Coordinator",
        eta: "Arrival / Service ETA",
        phone: "Customer Phone",
        appointmentDate: "Service Date",
        appointmentTime: "Arrival Window",
        notes: "Service Notes",
        stage: "Stage",
      },
      actions: {
        updateTitle: "Service update",
        updateSubtitle: "General update to the customer",
        approvalTitle: "Scope approval",
        approvalSubtitle: "Ask customer to approve the next service step",
        appointmentTitle: "Visit confirmation",
        appointmentSubtitle: "Confirm service date and arrival window",
        completionTitle: "Service completed",
        completionSubtitle: "Let the customer know the job is complete",
      },
    };
  }

  if (bt.includes("auto detailing")) {
    return {
      key: "auto-detail-live",
      familyLabel: "Auto Detail Live",
      boardSubtitle:
        "Built for detailing flow with check-in, active service work, final pass, and ready status.",
      createButtonLabel: "+ Add Detail Job",
      flowLabel: "Check-In â†’ Prep â†’ Detailing â†’ Final Check â†’ Ready",
      stages: ["Check-In", "Prep", "Detailing", "Final Check", "Ready"],
      labels: {
        item: "Vehicle / Service",
        concern: "Detail Request",
        advisor: "Detail Lead",
        eta: "Service ETA",
        phone: "Customer Phone",
        appointmentDate: "Service Date",
        appointmentTime: "Arrival Window",
        notes: "Service Notes",
        stage: "Stage",
      },
      actions: {
        updateTitle: "Service update",
        updateSubtitle: "General detailing update to the customer",
        approvalTitle: "Add-on approval",
        approvalSubtitle: "Ask customer to approve any extra detailing step",
        appointmentTitle: "Detail appointment",
        appointmentSubtitle: "Confirm date and arrival window",
        completionTitle: "Detail completed",
        completionSubtitle: "Let the customer know the detail is complete",
      },
    };
  }

  return resolveStarterBoardConfig(args);
}

function getProofStoreKey(boardSlug: string) {
  return `hp_proof_capture_${boardSlug}`;
}

function makeRONumber(index: number) {
  return `RO-${String(1042 + index).padStart(4, "0")}`;
}


function readStoredProofMap(boardSlug: string) {
  if (!boardSlug) return {} as Record<string, ProofClip[]>;

  try {
    const raw = window.localStorage.getItem(getProofStoreKey(boardSlug));
    if (!raw) return {} as Record<string, ProofClip[]>;
    const parsed = JSON.parse(raw) as Record<string, ProofClip[]>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {} as Record<string, ProofClip[]>;
  }
}

function writeStoredProofMap(
  boardSlug: string,
  nextMap: Record<string, ProofClip[]>,
) {
  if (!boardSlug) return;

  try {
    window.localStorage.setItem(getProofStoreKey(boardSlug), JSON.stringify(nextMap));
  } catch {
    // ignore
  }
}

function mergeProofIntoJobs(boardSlug: string, rows: RepairJob[]) {
  const proofMap = readStoredProofMap(boardSlug);

  return rows.map((job) => ({
    ...job,
    proof: proofMap[job.id] || [],
  }));
}


function formatInvoiceTimelineAction(action: InvoiceTimelineAction) {
  switch (action) {
    case "copied":
      return "Invoice Copied";
    case "texted":
      return "Invoice Texted";
    case "emailed":
      return "Invoice Emailed";
    case "shared":
      return "Invoice Shared";
    default:
      return "Invoice Updated";
  }
}

function buildInvoiceTimelineNote(args: {
  amount: string;
  memo: string;
  cashAppCashtag?: string;
  zelleValue?: string;
}) {
  const lines = [
    `Amount: $${args.amount || "0.00"}`,
    `Memo: ${args.memo || "â€”"}`,
  ];

  if (args.cashAppCashtag) {
    lines.push(`Cash App: $${args.cashAppCashtag}`);
  }

  if (args.zelleValue) {
    lines.push(`Zelle: ${args.zelleValue}`);
  }

  return lines.join(" Â· ");
}
function proofStatus(job: RepairJob) {
  const count = job.proof?.length || 0;

  if (count >= 3) {
    return {
      label: "Proof locked",
      tone: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
      dot: "bg-emerald-300",
    };
  }

  if (count >= 1) {
    return {
      label: "Proof started",
      tone: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
      dot: "bg-cyan-300",
    };
  }

  return {
    label: "No proof yet",
    tone: "border-white/10 bg-white/[0.04] text-slate-300",
    dot: "bg-slate-500",
  };
}


function dbToUi(row: DbRepairJob): RepairJob {
  return {
    id: row.id,
    roNumber: row.ro_number,
    customer: row.customer,
    vehicle: row.vehicle,
    concern: row.concern,
    stage: row.stage,
    eta: row.eta,
    advisor: row.advisor,
    notes: row.notes,
    phone: row.phone,
    appointmentDate: row.appointment_date ?? "",
    appointmentTime: row.appointment_time,
    createdAt: row.created_at,
  };
}

function uiPatchToDb(job: RepairJob) {
  return {
    ro_number: job.roNumber,
    customer: job.customer,
    vehicle: job.vehicle,
    concern: job.concern,
    stage: job.stage,
    eta: job.eta,
    advisor: job.advisor,
    notes: job.notes,
    phone: job.phone,
    appointment_date: job.appointmentDate || null,
    appointment_time: job.appointmentTime,
  };
}

function stageTone(stage: string) {
  const normalized = stage.toLowerCase();

  if (
    normalized.includes("intake") ||
    normalized.includes("lead") ||
    normalized.includes("check-in") ||
    normalized.includes("drive-in") ||
    normalized.includes("ticket")
  ) {
    return "border-sky-400/25 bg-sky-400/10 text-sky-200";
  }

  if (
    normalized.includes("diagnos") ||
    normalized.includes("measure") ||
    normalized.includes("site visit") ||
    normalized.includes("grill")
  ) {
    return "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
  }

  if (
    normalized.includes("approval") ||
    normalized.includes("quote") ||
    normalized.includes("findings") ||
    normalized.includes("selection") ||
    normalized.includes("plating")
  ) {
    return "border-amber-400/25 bg-amber-400/10 text-amber-200";
  }

  if (
    normalized.includes("bay") ||
    normalized.includes("repair") ||
    normalized.includes("install") ||
    normalized.includes("balance") ||
    normalized.includes("alignment") ||
    normalized.includes("ordered")
  ) {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (
    normalized.includes("ready") ||
    normalized.includes("done") ||
    normalized.includes("complete")
  ) {
    return "border-indigo-400/25 bg-indigo-400/10 text-indigo-200";
  }

  return "border-white/10 bg-white/5 text-white";
}

function formatAppointment(date: string, time: string) {
  if (!date && !time) return "No appointment set";
  if (date && !time) return date;
  if (!date && time) return time;
  return `${date} at ${time}`;
}

function buildApprovalMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer || "customer"}, this is ${businessName}. Your ${job.vehicle || "job"} is currently in "${job.stage}". We need your approval before moving forward on: ${job.concern || "the recommended next step"}. Reply here to approve or call us with questions.`;
}

function buildReadyMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer || "customer"}, your ${job.vehicle || "job"} at ${businessName} is ready.${job.notes ? ` Notes: ${job.notes}` : ""}`;
}

function buildAppointmentMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer || "customer"}, your appointment with ${businessName} is set for ${formatAppointment(job.appointmentDate, job.appointmentTime)} for ${job.vehicle || "your job"}.`;
}

function buildStatusMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer || "customer"}, here is your update from ${businessName}: ${job.vehicle || "Your job"} is currently in "${job.stage}".${job.concern ? ` Need: ${job.concern}.` : ""}${job.eta ? ` ETA: ${job.eta}.` : ""}`;
}

function sanitizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function openTextMessage(phone: string, text: string) {
  const cleanedPhone = sanitizePhone(phone);
  const encoded = encodeURIComponent(text);
  const href = cleanedPhone
    ? `sms:${cleanedPhone}?body=${encoded}`
    : `sms:?body=${encoded}`;
  window.location.href = href;
}

function formatProofDate(value?: string | null) {
  if (!value) return "â€”";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatTicketNumber(roNumber: string) {
  const match = roNumber.match(/(\d+)/);
  return match ? `Ticket #${match[1]}` : roNumber;
}


function normalizeStageForConfig(
  stage: string,
  configKey: string,
  allowedStages: string[],
) {
  if (!stage) return allowedStages[0] || "";
  if (allowedStages.includes(stage)) return stage;

  const value = stage.toLowerCase();

  if (configKey === "home-services-live") {
    if (
      value.includes("new intake") ||
      value.includes("check-in") ||
      value.includes("drive-in") ||
      value.includes("new ticket") ||
      value.includes("new request")
    ) {
      return "New Request";
    }

    if (
      value.includes("diagnos") ||
      value.includes("approval") ||
      value.includes("quote") ||
      value.includes("findings") ||
      value.includes("site visit") ||
      value.includes("scheduled") ||
      value.includes("measure")
    ) {
      return "Scheduled";
    }

    if (value.includes("en route") || value.includes("on route")) {
      return "En Route";
    }

    if (
      value.includes("in bay") ||
      value.includes("repair") ||
      value.includes("install") ||
      value.includes("service") ||
      value.includes("on site") ||
      value.includes("material ordered")
    ) {
      return "On Site";
    }

    if (
      value.includes("ready") ||
      value.includes("done") ||
      value.includes("complete")
    ) {
      return "Completed";
    }
  }

  if (configKey === "auto-detail-live") {
    if (
      value.includes("new intake") ||
      value.includes("new request") ||
      value.includes("check-in") ||
      value.includes("drive-in")
    ) {
      return "Check-In";
    }

    if (value.includes("prep") || value.includes("scheduled")) {
      return "Prep";
    }

    if (
      value.includes("diagnos") ||
      value.includes("in bay") ||
      value.includes("repair") ||
      value.includes("detail") ||
      value.includes("in service")
    ) {
      return "Detailing";
    }

    if (
      value.includes("waiting approval") ||
      value.includes("final") ||
      value.includes("approval")
    ) {
      return "Final Check";
    }

    if (
      value.includes("ready") ||
      value.includes("done") ||
      value.includes("complete")
    ) {
      return "Ready";
    }
  }

  return allowedStages[0] || stage;
}

function restaurantPrimaryLabel(
  job: RepairJob,
  identityMode: RestaurantIdentityMode,
) {
  if (identityMode === "name") {
    return job.customer?.trim() || "Guest name pending";
  }

  return job.vehicle?.trim() || "Table pending";
}

function restaurantSecondaryLabel(
  job: RepairJob,
  identityMode: RestaurantIdentityMode,
) {
  if (identityMode === "name") {
    return job.vehicle?.trim() || "Table pending";
  }

  return job.customer?.trim() || "Guest name pending";
}

function normalizeRestaurantStage(stage: string) {
  const value = stage.toLowerCase();

  if (
    value.includes("new intake") ||
    value.includes("intake") ||
    value.includes("new ticket") ||
    value.includes("drive-in") ||
    value.includes("check-in")
  ) {
    return "New Ticket";
  }

  if (
    value.includes("diagnosing") ||
    value.includes("diagnostic") ||
    value.includes("in bay") ||
    value.includes("repairing") ||
    value.includes("repair") ||
    value.includes("on grill")
  ) {
    return "On Grill";
  }

  if (
    value.includes("waiting approval") ||
    value.includes("approval") ||
    value.includes("quote") ||
    value.includes("findings") ||
    value.includes("plating")
  ) {
    return "Plating";
  }

  if (value.includes("ready for pickup") || value.includes("ready")) {
    return "Ready";
  }

  if (
    value.includes("done") ||
    value.includes("completed") ||
    value.includes("complete")
  ) {
    return "Completed";
  }

  return "New Ticket";
}

function makeRestaurantDraft(
  stages: string[],
  job?: RepairJob | null,
): RestaurantTicketDraft {
  if (job) {
    return {
      id: job.id,
      roNumber: job.roNumber,
      customer: job.customer,
      vehicle: job.vehicle,
      concern: job.concern,
      stage: normalizeRestaurantStage(job.stage),
      eta: job.eta,
      advisor: job.advisor,
      notes: job.notes,
    };
  }

  return {
    customer: "",
    vehicle: "",
    concern: "",
    stage: stages[0] || "New Ticket",
    eta: "",
    advisor: "",
    notes: "",
  };
}

function buildCampGuardianUpdateMessage(job: RepairJob, businessName: string) {
  const childName = job.vehicle || "your child";
  const zone = job.stage || "current activity";
  const detail = job.concern ? ` Update: ${job.concern}.` : "";
  const timing = job.eta ? ` Next move: ${job.eta}.` : "";
  return `Hi ${job.customer || "guardian"}, this is ${businessName}. ${childName} is currently in "${zone}".${detail}${timing}`;
}

function buildCampGuardianAlertMessage(job: RepairJob, businessName: string) {
  const childName = job.vehicle || "your child";
  const detail = job.concern ? ` Details: ${job.concern}.` : "";
  const note = job.notes ? ` Safety note: ${job.notes}.` : "";
  return `Hi ${job.customer || "guardian"}, ${businessName} is requesting your attention regarding ${childName}.${detail}${note}`;
}

function buildCampGuardianCheckInMessage(job: RepairJob, businessName: string) {
  const childName = job.vehicle || "your child";
  return `Hi ${job.customer || "guardian"}, ${childName} has been checked in with ${businessName} for ${formatAppointment(job.appointmentDate, job.appointmentTime)}.`;
}

function buildCampGuardianCheckoutMessage(job: RepairJob, businessName: string) {
  const childName = job.vehicle || "your child";
  return `Hi ${job.customer || "guardian"}, ${childName} has been checked out from ${businessName}.${job.notes ? ` Notes: ${job.notes}` : ""}`;
}

function buildCampTimeline(job: RepairJob) {
  const timeline = [`${formatProofDate(job.createdAt)} â†’ Presence created`];

  if (job.appointmentDate || job.appointmentTime) {
    timeline.push(
      `${formatAppointment(job.appointmentDate, job.appointmentTime)} â†’ Check-in scheduled`,
    );
  }

  if (job.stage) {
    timeline.push(`${job.stage} â†’ Current zone`);
  }

  if (job.concern) {
    timeline.push(`${job.concern} â†’ Live activity note`);
  }

  if (job.eta) {
    timeline.push(`${job.eta} â†’ Next movement target`);
  }

  return timeline;
}

function isMeaningfulCampValue(value?: string | null) {
  const normalized = (value || "").trim().toLowerCase();
  if (!normalized) return false;

  const blocked = new Set([
    "new customer",
    "child name pending",
    "child pending",
    "guardian pending",
    "guardian name",
    "guardian name pending",
    "guardian",
    "activity pending",
    "movement pending",
    "supervisor pending",
  ]);

  return !blocked.has(normalized);
}

function campChildName(job: RepairJob) {
  return isMeaningfulCampValue(job.vehicle) ? job.vehicle.trim() : "â€”";
}

function campGuardianName(job: RepairJob) {
  return isMeaningfulCampValue(job.customer) ? job.customer.trim() : "â€”";
}

function campActivityLabel(job: RepairJob) {
  return isMeaningfulCampValue(job.concern) ? job.concern.trim() : "â€”";
}

function campStaffLabel(job: RepairJob) {
  return isMeaningfulCampValue(job.advisor) ? job.advisor.trim() : "â€”";
}

function campNextMoveLabel(job: RepairJob) {
  return isMeaningfulCampValue(job.eta) ? job.eta.trim() : "â€”";
}

function campStatusTone(stage: string) {
  const normalized = stage.toLowerCase();

  if (normalized.includes("checked out")) {
    return {
      dot: "bg-indigo-300",
      pill: "border-indigo-400/25 bg-indigo-400/10 text-indigo-100",
      label: "Checked Out",
    };
  }

  if (normalized.includes("with staff") || normalized.includes("break")) {
    return {
      dot: "bg-amber-300",
      pill: "border-amber-400/25 bg-amber-400/10 text-amber-100",
      label: "Needs Attention",
    };
  }

  return {
    dot: "bg-emerald-300",
    pill: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
    label: "Safe / Active",
  };
}

export default function AutoRepairLiveBoard() {
  const location = useLocation();
  const { boardSlug } = useParams<{ boardSlug: string }>();

  const payload = useMemo<OnboardingPayload>(() => {
  const statePayload =
    ((location.state as { onboardingPayload?: OnboardingPayload } | null)
      ?.onboardingPayload ?? null) as OnboardingPayload | null;

  if (statePayload) {
    return statePayload;
  }

  try {
    const raw = window.localStorage.getItem("hp_onboarding_payload");
    if (!raw) return {} as OnboardingPayload;
    return JSON.parse(raw) as OnboardingPayload;
  } catch {
    return {} as OnboardingPayload;
  }
}, [location.state]);

  const isExplicitDemoRoute = location.pathname === "/planet/demo/auto-service";
  const liveBoardSlug =
    boardSlug ||
    payload.boardSlug ||
    (isExplicitDemoRoute ? DEMO_BOARD_SLUG : "");

  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [stageMenuOpen, setStageMenuOpen] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [boardMeta, setBoardMeta] = useState<StarterBoardRow | null>(null);
  const [managerPanelOpen, setManagerPanelOpen] = useState(false);
  const [restaurantIdentityMode, setRestaurantIdentityMode] =
    useState<RestaurantIdentityMode>("table");
  const [ticketEditorOpen, setTicketEditorOpen] = useState(false);
  const [ticketEditorSaving, setTicketEditorSaving] = useState(false);
  const [ticketEditorDraft, setTicketEditorDraft] =
    useState<RestaurantTicketDraft | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimPanelDismissed, setClaimPanelDismissed] = useState(false);
  const [localClaimed, setLocalClaimed] = useState(false);
  const [boardViewMode, setBoardViewMode] = useState<"reveal" | "work">(
    "reveal",
  );
  const [boardMetaLoaded, setBoardMetaLoaded] = useState(false);
  const [proofCaptureRunningJobId, setProofCaptureRunningJobId] = useState<string | null>(null);
  const [proofNoteDraft, setProofNoteDraft] = useState("");
  const [paymentAmountDraft, setPaymentAmountDraft] = useState("");
  const [paymentMemoDraft, setPaymentMemoDraft] = useState("");
  const [invoicePanelKey, setInvoicePanelKey] = useState(0);

  const stageMenuRef = useRef<HTMLDivElement | null>(null);
  const saveTimerRef = useRef<number | null>(null);

  const slugHint = (liveBoardSlug || "").toLowerCase();
  const slugForcesRestaurant =
    slugHint.includes("restaurant") ||
    slugHint.includes("kitchen") ||
    slugHint.includes("diner") ||
    slugHint.includes("peggie");

  const payloadMatchesBoard =
    !liveBoardSlug ||
    !payload.boardSlug ||
    payload.boardSlug === liveBoardSlug;

  const scopedPayload = payloadMatchesBoard ? payload : ({} as OnboardingPayload);

  const normalizedPayloadType = normalizeBusinessTypeForLiveBoard(
    `${scopedPayload.businessType?.trim() || ""} ${scopedPayload.businessName?.trim() || ""}`,
    slugHint,
  );

  const normalizedBoardType = normalizeBusinessTypeForLiveBoard(
    `${boardMeta?.business_type?.trim() || ""} ${boardMeta?.business_name?.trim() || ""}`,
    slugHint,
  );

  const businessType =
    normalizedBoardType ||
    normalizedPayloadType ||
    (slugForcesRestaurant ? "Restaurant" : "General");

  const inferredBusinessName = slugHint ? toTitleCaseFromSlug(slugHint) : "";

  const rawBoardName =
    boardMeta?.business_name?.trim() ||
    scopedPayload.businessName?.trim() ||
    "";

  const businessName =
    rawBoardName && !isGenericLiveBoardName(rawBoardName)
      ? rawBoardName
      : inferredBusinessName ||
        rawBoardName ||
        (slugForcesRestaurant ? "Restaurant" : "Live Board");

  const boardTitle = makeBoardTitle(businessName);

  const city = boardMeta?.city || scopedPayload.city?.trim() || "Your City";

  const stageConfigReady =
    Boolean(boardMeta?.business_type?.trim()) ||
    Boolean(payload.businessType?.trim()) ||
    isExplicitDemoRoute ||
    slugForcesRestaurant ||
    !liveBoardSlug ||
    boardMetaLoaded;

  const primaryGoal = scopedPayload.primaryGoal?.trim() || "";

  const config = useMemo(
    () =>
      resolveLiveBoardConfig({
        businessType,
        businessName,
        primaryGoal,
      }),
    [businessType, businessName, primaryGoal],
  );

  const isRestaurant = config.key === "restaurant-rush";
  const isCamp = config.key === "camp-guardian";
  const isClaimed =
  localClaimed ||
  (boardMeta?.claim_status ?? "preview") === "claimed" ||
  (() => {
    try {
      return window.localStorage.getItem(getLocalClaimKey(liveBoardSlug)) === "true";
    } catch {
      return false;
    }
  })();
  const showClaimOverlay =
  !isRestaurant && !loading && !isClaimed && !claimPanelDismissed;

const presenceId =
  boardMeta?.presence_id ||
  scopedPayload.presenceId ||
  "HP-LOCKING";

const boardSlugDisplay =
  liveBoardSlug || scopedPayload.boardSlug || " ";

const isActiveBoard =
  isClaimed || boardMeta?.is_active === true;

  const stages = useMemo(() => [...config.stages], [config.stages]);

  const actionConfig = config.actions || {
    updateTitle: "Status update",
    updateSubtitle: "General update to the customer",
    approvalTitle: "Approval request",
    approvalSubtitle: "Ask customer to approve the next step",
    appointmentTitle: "Appointment confirmation",
    appointmentSubtitle: "Confirm date and time with the customer",
    completionTitle: "Completion message",
    completionSubtitle: "Let the customer know the job is complete",
  };

  const paymentProfile = useMemo(() => {
    const dbCash = (boardMeta as { cashapp_cashtag?: string } | null)?.cashapp_cashtag || "";
    const dbZelle = (boardMeta as { zelle_value?: string } | null)?.zelle_value || "";

    const stored = readStoredPaymentProfile(liveBoardSlug);

    return {
      cashAppCashtag: sanitizeCashAppCashtag(dbCash || stored.cashAppCashtag),
      zelleValue: (dbZelle || stored.zelleValue || "").trim(),
    };
  }, [liveBoardSlug, boardMeta]);

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(
        getPreviewDismissKey(liveBoardSlug),
      );
      setClaimPanelDismissed(dismissed === "true");
    } catch {
      setClaimPanelDismissed(false);
    }

    try {
      const savedMode = window.localStorage.getItem(
        getBoardViewModeKey(liveBoardSlug || "default"),
      );
      setBoardViewMode(savedMode === "work" ? "work" : "reveal");
    } catch {
      setBoardViewMode("reveal");
    }

    setBoardMetaLoaded(false);

    void (async () => {
      const meta = await loadBoardMeta();
      await loadJobs(meta);
    })();
  }, [liveBoardSlug]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!stageMenuRef.current) return;
      if (!stageMenuRef.current.contains(event.target as Node)) {
        setStageMenuOpen(false);
      }
    }

    if (stageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [stageMenuOpen]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        getBoardViewModeKey(liveBoardSlug || "default"),
        boardViewMode,
      );
    } catch {
      // ignore
    }
  }, [boardViewMode, liveBoardSlug]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRestaurant) {
      setSelectedJobId(null);
      setStageMenuOpen(false);
    } else {
      setManagerPanelOpen(false);
      setTicketEditorOpen(false);
      setTicketEditorDraft(null);
    }
  }, [isRestaurant]);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId],
  );

  useEffect(() => {
    setProofNoteDraft("");
  }, [selectedJobId]);

  useEffect(() => {
    if (!selectedJob || isRestaurant || isCamp) return;
    setPaymentAmountDraft("");
    setPaymentMemoDraft(
      [selectedJob.roNumber, selectedJob.customer || selectedJob.vehicle]
        .filter(Boolean)
        .join(" · "),
    );
  }, [selectedJobId, isRestaurant, isCamp, selectedJob]);

  const paymentMemo = paymentMemoDraft.trim();
  const paymentAmount = sanitizeMoneyInput(paymentAmountDraft);
  const cashAppUrl = buildCashAppUrl(paymentProfile.cashAppCashtag);
  const cashAppQrSrc = buildPaymentQrSrc(cashAppUrl);
  const zelleActionHref = buildZelleActionHref(paymentProfile.zelleValue);
  const zelleQrPayload = paymentProfile.zelleValue
    ? buildZelleQrPayload({
        businessName,
        zelleValue: paymentProfile.zelleValue,
        amount: paymentAmount,
        memo: paymentMemo,
      })
    : "";
  const zelleQrSrc = buildPaymentQrSrc(zelleQrPayload);
  const grouped = useMemo(() => {
    if (isRestaurant) {
      return stages.map((stage) => ({
        stage,
        jobs: jobs.filter(
          (job) => normalizeRestaurantStage(job.stage) === stage,
        ),
      }));
    }

    return stages.map((stage) => ({
      stage,
      jobs: jobs.filter((job) => job.stage === stage),
    }));
  }, [isRestaurant, jobs, stages]);

  const totals = useMemo(() => {
    const finalStage = stages[stages.length - 1] || "Ready";

    return {
      total: jobs.length,
      inProgress: jobs.filter((job) => {
        const stage = isRestaurant
          ? normalizeRestaurantStage(job.stage)
          : job.stage;
        return stage !== finalStage && stage !== stages[0];
      }).length,
      ready: jobs.filter((job) => {
        const stage = isRestaurant
          ? normalizeRestaurantStage(job.stage)
          : job.stage;
        return stage === finalStage;
      }).length,
      newIntake: jobs.filter((job) => {
        const stage = isRestaurant
          ? normalizeRestaurantStage(job.stage)
          : job.stage;
        return stage === stages[0];
      }).length,
    };
  }, [isRestaurant, jobs, stages]);

  const restaurantSnapshot = useMemo(() => {
    if (!isRestaurant) return null;

    const readyCount = jobs.filter(
      (job) => normalizeRestaurantStage(job.stage) === "Ready",
    ).length;

    const completedCount = jobs.filter(
      (job) => normalizeRestaurantStage(job.stage) === "Completed",
    ).length;

    const grillCount = jobs.filter(
      (job) => normalizeRestaurantStage(job.stage) === "On Grill",
    ).length;

    const platingCount = jobs.filter(
      (job) => normalizeRestaurantStage(job.stage) === "Plating",
    ).length;

    return {
      readyCount,
      completedCount,
      grillCount,
      platingCount,
      urgentCount: jobs.filter((job) => {
        const stage = normalizeRestaurantStage(job.stage);
        return stage === "On Grill" || stage === "Plating" || stage === "Ready";
      }).length,
    };
  }, [isRestaurant, jobs]);

  function getParentViewPath(job: RepairJob) {
    const childName = (job.vehicle || "").trim().toLowerCase();

    try {
      const rawMembers = window.localStorage.getItem("guardianProtectedMembers");

      if (rawMembers) {
        const parsed = JSON.parse(rawMembers) as Array<{
          id?: string;
          type?: string;
          name?: string;
        }>;

        if (Array.isArray(parsed)) {
          const childMembers = parsed.filter(
            (member) =>
              member &&
              typeof member.id === "string" &&
              member.id.trim().length > 0 &&
              member.type === "child",
          );

          const exactMatch = childMembers.find(
            (member) => (member.name || "").trim().toLowerCase() === childName,
          );

          if (exactMatch?.id) {
            return `/planet/guardian/child/${exactMatch.id}`;
          }

          if (childMembers[0]?.id) {
            return `/planet/guardian/child/${childMembers[0].id}`;
          }
        }
      }
    } catch {
      // ignore and fall back to board job id
    }

    return `/planet/guardian/child/${job.id}`;
  }

  function openParentView(job: RepairJob) {
    window.location.href = `${window.location.origin}${getParentViewPath(job)}`;
  }

  async function copyParentViewLink(job: RepairJob) {
    const origin = window.location.origin;
    const href = `${origin}${getParentViewPath(job)}`;

    try {
      await navigator.clipboard.writeText(href);
      setCopiedMessage("Parent link copied");
      window.setTimeout(() => setCopiedMessage(""), 1600);
    } catch {
      setCopiedMessage("Copy failed");
      window.setTimeout(() => setCopiedMessage(""), 1600);
    }
  }

  async function loadBoardMeta() {
    if (!liveBoardSlug) {
      setBoardMeta(null);
      setBoardMetaLoaded(true);
      return null;
    }

    const { data, error } = await supabase
      .from("starter_boards")
      .select("*")
      .eq("board_slug", liveBoardSlug)
      .maybeSingle();

    if (error || !data) {
      setBoardMeta(null);
      setBoardMetaLoaded(true);
      return null;
    }

    let resolvedMeta = data as StarterBoardRow;

    if (!resolvedMeta.presence_id || !resolvedMeta.presence_key) {
      const fallbackPresenceId =
        resolvedMeta.presence_id ||
        scopedPayload.presenceId ||
        createPresenceId();

      const fallbackPresenceKey =
        resolvedMeta.presence_key ||
        scopedPayload.presenceKey ||
        crypto.randomUUID();

      const { data: repairedData, error: repairError } = await supabase
        .from("starter_boards")
        .update({
          presence_id: fallbackPresenceId,
          presence_key: fallbackPresenceKey,
        })
        .eq("board_slug", liveBoardSlug)
        .select("*")
        .single();

      if (!repairError && repairedData) {
        resolvedMeta = repairedData as StarterBoardRow;
      } else {
        resolvedMeta = {
          ...resolvedMeta,
          presence_id: fallbackPresenceId,
          presence_key: fallbackPresenceKey,
        };
      }
    }

    setBoardMeta(resolvedMeta);
    setBoardMetaLoaded(true);
    return resolvedMeta;
  }

  async function loadJobs(metaOverride?: StarterBoardRow | null) {
    setLoading(true);
    setStatusNote("");

    if (!liveBoardSlug) {
      setJobs([]);
      setSelectedJobId(null);
      setLoading(false);
      setStatusNote("Missing board slug");
      return;
    }

    const { data, error } = await supabase
      .from("auto_repair_jobs")
      .select("*")
      .eq("board_slug", liveBoardSlug)
      .order("created_at", { ascending: true });

    if (error) {
      setStatusNote(`Load failed: ${error.message}`);
      setLoading(false);
      return;
    }

    const effectiveNameSource =
      metaOverride?.business_name?.trim() ||
      boardMeta?.business_name?.trim() ||
      scopedPayload.businessName?.trim() ||
      inferredBusinessName ||
      "";

    const effectiveType = normalizeBusinessTypeForLiveBoard(
      `${metaOverride?.business_type?.trim() || boardMeta?.business_type?.trim() || scopedPayload.businessType?.trim() || ""} ${effectiveNameSource}`,
      slugHint,
    );

    const effectiveConfig = resolveLiveBoardConfig({
      businessType: effectiveType,
      businessName: effectiveNameSource,
      primaryGoal,
    });

    const rawJobs = mergeProofIntoJobs(
      liveBoardSlug,
      (data as DbRepairJob[]).map(dbToUi),
    );

    const nextJobs = rawJobs.map((job) => ({
      ...job,
      stage: normalizeStageForConfig(
        job.stage,
        effectiveConfig.key,
        effectiveConfig.stages,
      ),
    }));

    setJobs(nextJobs);

    const jobsNeedingStageFix = nextJobs.filter(
      (job, index) => job.stage !== rawJobs[index]?.stage,
    );

    if (jobsNeedingStageFix.length) {
      void Promise.all(
        jobsNeedingStageFix.map((job) =>
          supabase
            .from("auto_repair_jobs")
            .update({ stage: job.stage })
            .eq("id", job.id),
        ),
      );
    }

    if (effectiveConfig.key !== "restaurant-rush" && nextJobs.length > 0) {
      setSelectedJobId((current) =>
        current && nextJobs.some((job) => job.id === current)
          ? current
          : nextJobs[0].id,
      );
    } else {
      setSelectedJobId(null);
    }

    setLoading(false);
  }

  async function handleClaimBoard() {
  if (isClaiming) return;

  setIsClaiming(true);
  setStatusNote("Starting 14-day trial...");

  const now = new Date();
  const trialEnds = new Date(now);
  trialEnds.setDate(trialEnds.getDate() + 14);

  const activationPayload = {
    businessName: boardMeta?.business_name || payload.businessName || businessName,
    ownerName: boardMeta?.owner_name || payload.ownerName || "",
    businessType: boardMeta?.business_type || payload.businessType || businessType,
    city: boardMeta?.city || payload.city || city,
    primaryGoal: payload.primaryGoal || "",
    boardSlug: liveBoardSlug,
    presenceId: boardMeta?.presence_id || payload.presenceId || "",
    presenceKey: boardMeta?.presence_key || payload.presenceKey || "",
  };

  try {
    window.localStorage.removeItem(getPreviewDismissKey(liveBoardSlug));
  } catch {
    // ignore
  }

  try {
    window.localStorage.setItem(getLocalClaimKey(liveBoardSlug), "true");
  } catch {
    // ignore
  }

  setLocalClaimed(true);

  try {
    window.localStorage.setItem(
      "hp_onboarding_payload",
      JSON.stringify(activationPayload),
    );
  } catch {
    // ignore
  }

  if (boardMeta) {
    void supabase
      .from("starter_boards")
      .update({
        claim_status: "claimed",
        claimed_at: now.toISOString(),
        is_active: true,
        trial_started_at: now.toISOString(),
        trial_ends_at: trialEnds.toISOString(),
      })
      .eq("board_slug", liveBoardSlug);
  }

  try {
  window.localStorage.setItem(getLocalClaimKey(liveBoardSlug), "true");
} catch {
  // ignore
}

window.location.href = "/planet/start/building";
}

  function updateLocalSelectedJob<K extends keyof RepairJob>(
    key: K,
    value: RepairJob[K],
  ) {
    if (!selectedJob) return;

    const updatedJobs = jobs.map((job) =>
      job.id === selectedJob.id ? { ...job, [key]: value } : job,
    );
    setJobs(updatedJobs);
    scheduleSave(updatedJobs.find((job) => job.id === selectedJob.id) ?? null);
  }

  function scheduleSave(job: RepairJob | null) {
    if (!job) return;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    setSaving(true);
    setStatusNote("Saving...");

    saveTimerRef.current = window.setTimeout(() => {
      void persistJob(job);
    }, 250);
  }

  async function persistJob(job: RepairJob) {
    const { error } = await supabase
      .from("auto_repair_jobs")
      .update(uiPatchToDb(job))
      .eq("id", job.id);

    if (error) {
      setStatusNote(`Save failed: ${error.message}`);
      setSaving(false);
      return;
    }

    setSaving(false);
    setStatusNote("Saved");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  function openRestaurantTicketEditor(job?: RepairJob | null) {
    setTicketEditorDraft(makeRestaurantDraft(stages, job));
    setTicketEditorOpen(true);
  }

  function closeRestaurantTicketEditor() {
    setTicketEditorOpen(false);
    setTicketEditorDraft(null);
    setTicketEditorSaving(false);
  }

  async function saveRestaurantTicket() {
    if (!ticketEditorDraft) return;

    setTicketEditorSaving(true);
    setStatusNote(
      ticketEditorDraft.id ? "Saving ticket..." : "Creating ticket...",
    );

    if (ticketEditorDraft.id) {
      const payloadToSave = {
        customer: ticketEditorDraft.customer,
        vehicle: ticketEditorDraft.vehicle,
        concern: ticketEditorDraft.concern,
        stage: ticketEditorDraft.stage,
        eta: ticketEditorDraft.eta,
        advisor: ticketEditorDraft.advisor,
        notes: ticketEditorDraft.notes,
      };

      const { data, error } = await supabase
        .from("auto_repair_jobs")
        .update(payloadToSave)
        .eq("id", ticketEditorDraft.id)
        .select("*")
        .single();

      if (error) {
        setTicketEditorSaving(false);
        setStatusNote(`Save failed: ${error.message}`);
        return;
      }

      const updatedJob = dbToUi(data as DbRepairJob);
      setJobs((current) =>
        current.map((job) =>
          job.id === updatedJob.id
            ? { ...updatedJob, proof: job.proof || [] }
            : job,
        ),
      );
      setTicketEditorSaving(false);
      setStatusNote("Saved");
      closeRestaurantTicketEditor();
      window.setTimeout(() => setStatusNote(""), 1000);
      return;
    }

    const { data, error } = await supabase
      .from("auto_repair_jobs")
      .insert({
        board_slug: liveBoardSlug,
        ro_number: makeRONumber(jobs.length),
        customer: ticketEditorDraft.customer,
        vehicle: ticketEditorDraft.vehicle,
        concern: ticketEditorDraft.concern,
        stage: ticketEditorDraft.stage || stages[0] || "New Ticket",
        eta: ticketEditorDraft.eta,
        advisor: ticketEditorDraft.advisor,
        notes: ticketEditorDraft.notes,
        phone: "",
        appointment_date: null,
        appointment_time: "",
      })
      .select("*")
      .single();

    if (error) {
      setTicketEditorSaving(false);
      setStatusNote(`Create failed: ${error.message}`);
      return;
    }

    const createdJob = { ...dbToUi(data as DbRepairJob), proof: [] };
    setJobs((current) => [createdJob, ...current]);
    setTicketEditorSaving(false);
    setStatusNote("Created");
    closeRestaurantTicketEditor();
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  async function deleteRestaurantTicket() {
    if (!ticketEditorDraft?.id) return;

    setTicketEditorSaving(true);
    setStatusNote("Deleting ticket...");

    const { error } = await supabase
      .from("auto_repair_jobs")
      .delete()
      .eq("id", ticketEditorDraft.id);

    if (error) {
      setTicketEditorSaving(false);
      setStatusNote(`Delete failed: ${error.message}`);
      return;
    }

    setJobs((current) => current.filter((job) => job.id !== ticketEditorDraft.id));
    setTicketEditorSaving(false);
    setStatusNote("Deleted");
    closeRestaurantTicketEditor();
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  async function handleAddJob() {
    if (!stageConfigReady) {
      setStatusNote("Loading board type before creating the next item...");
      window.setTimeout(() => setStatusNote(""), 1400);
      return;
    }

    if (isRestaurant) {
      openRestaurantTicketEditor();
      return;
    }

    setSaving(true);
    setStatusNote("Creating item...");

    const createdInput = {
      board_slug: liveBoardSlug,
      ro_number: makeRONumber(jobs.length),
      customer: "",
      vehicle: "",
      concern: "",
      stage: config.stages[0] || "New Request",
      eta: "",
      advisor: isCamp
        ? "Check-In Supervisor"
        : config.labels.advisor === "Crew / Operator"
          ? "Crew / Operator"
          : "Front Counter",
      notes: "",
      phone: "",
      appointment_date: null,
      appointment_time: "",
    };

    const { data, error } = await supabase
      .from("auto_repair_jobs")
      .insert(createdInput)
      .select("*")
      .single();

    if (error) {
      setSaving(false);
      setStatusNote(`Create failed: ${error.message}`);
      return;
    }

    const createdJob = { ...dbToUi(data as DbRepairJob), proof: [] };
    setJobs((current) => [createdJob, ...current]);
    setSelectedJobId(createdJob.id);
    setStageMenuOpen(false);
    setSaving(false);
    setStatusNote("Created");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  async function handleDeleteSelected() {
    if (!selectedJob) return;

    setSaving(true);
    setStatusNote("Deleting...");

    const { error } = await supabase
      .from("auto_repair_jobs")
      .delete()
      .eq("id", selectedJob.id);

    if (error) {
      setSaving(false);
      setStatusNote(`Delete failed: ${error.message}`);
      return;
    }

    const proofMap = readStoredProofMap(liveBoardSlug);
    delete proofMap[selectedJob.id];
    writeStoredProofMap(liveBoardSlug, proofMap);

    const next = jobs.filter((job) => job.id !== selectedJob.id);
    setJobs(next);
    setSelectedJobId(next[0]?.id ?? null);
    setStageMenuOpen(false);
    setSaving(false);
    setStatusNote("Deleted");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  async function handleReload() {
    setSaving(true);
    setStatusNote("Reloading live data...");
    setSelectedJobId(null);
    setStageMenuOpen(false);
    setBoardMetaLoaded(false);
    const meta = await loadBoardMeta();
    await loadJobs(meta);
    setSaving(false);
    setStatusNote("Loaded live board data");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  function updateProofForJob(jobId: string, updater: (current: ProofClip[]) => ProofClip[]) {
    const proofMap = readStoredProofMap(liveBoardSlug);
    const currentProof = proofMap[jobId] || [];
    const nextProof = updater(currentProof);

    proofMap[jobId] = nextProof;
    writeStoredProofMap(liveBoardSlug, proofMap);

    setJobs((current) =>
      current.map((job) =>
        job.id === jobId
          ? {
              ...job,
              proof: nextProof,
            }
          : job,
      ),
    );
  }

  function addProofClip(label: string, defaultNote = "") {
    if (!selectedJob) return;

    const note = (proofNoteDraft || defaultNote).trim();

    updateProofForJob(selectedJob.id, (current) => [
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        label,
        note,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);

    setProofNoteDraft("");
    setStatusNote("Proof captured");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  function logInvoiceToTimeline(action: InvoiceTimelineAction, amount: string, memo: string) {
    if (!selectedJob) return;

    updateProofForJob(selectedJob.id, (current) => [
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        label: formatInvoiceTimelineAction(action),
        note: buildInvoiceTimelineNote({
          amount,
          memo,
          cashAppCashtag: paymentProfile.cashAppCashtag,
          zelleValue: paymentProfile.zelleValue,
        }),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);

    setStatusNote(formatInvoiceTimelineAction(action));
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  function startProofCapture() {
    if (!selectedJob) return;
    setProofCaptureRunningJobId(selectedJob.id);
    setStatusNote("Proof capture started");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  function stopProofCapture() {
    if (!selectedJob) return;
    const activeJobId = proofCaptureRunningJobId;
    setProofCaptureRunningJobId(null);

    if (activeJobId === selectedJob.id) {
      addProofClip("Capture stopped", "Proof recording session closed");
    }
  }

  function clearProofForSelected() {
    if (!selectedJob) return;

    updateProofForJob(selectedJob.id, () => []);
    setProofCaptureRunningJobId((current) =>
      current === selectedJob.id ? null : current,
    );
    setStatusNote("Proof cleared");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  async function copyMessage(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(`${label} copied`);
      window.setTimeout(() => setCopiedMessage(""), 1600);
    } catch {
      setCopiedMessage("Copy failed");
      window.setTimeout(() => setCopiedMessage(""), 1600);
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {!isRestaurant && !loading && !isClaimed && claimPanelDismissed ? (
        <div className="fixed bottom-5 right-5 z-[65]">
          <button
            type="button"
            onClick={() => {
              try {
                window.localStorage.removeItem(
                  getPreviewDismissKey(liveBoardSlug),
                );
              } catch {
                // ignore
              }
              setClaimPanelDismissed(false);
            }}
            className="rounded-full border border-cyan-400/25 bg-[#081122] px-5 py-3 text-sm font-semibold text-cyan-100 shadow-[0_0_30px_rgba(0,0,0,0.35)] transition hover:bg-[#0b1730]"
          >
            Start 14-Day Trial
          </button>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-6 py-8">
  <div className="mb-4 rounded-xl border border-cyan-400/20 bg-[#061226] px-4 py-3 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
    <div className="flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-3 text-cyan-200">
        <span className="opacity-60">Presence ID:</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 font-mono text-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.10)]">
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
          {presenceId}
        </span>
        <button
          type="button"
          onClick={() => void copyMessage("Presence ID", presenceId)}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-100"
        >
          Copy ID
        </button>
        <span className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
          Presence Locked
        </span>

        <span className="opacity-30">|</span>

        <span className="opacity-60">Slug:</span>
        <span className="font-mono text-cyan-300">
          {boardSlugDisplay}
        </span>

        <span className="opacity-30">|</span>

        <span className="opacity-60">Status:</span>
        <span className={`font-semibold ${isActiveBoard ? "text-emerald-300" : "text-amber-300"}`}>
          {isActiveBoard ? "Active" : "Preview"}
        </span>
      </div>

      <div className="text-right text-[11px] uppercase tracking-[0.18em] text-white/40">
        Presence-first Â· Timestamp anchored
      </div>
    </div>
  </div>
        {boardViewMode === "reveal" ? (
          <>
            <div className="mb-6 overflow-hidden rounded-[30px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
              <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-8">
                <div>
                  <div className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                    {isCamp ? "LIVE CHILD PRESENCE" : config.familyLabel}
                  </div>

                  <h1 className="mt-4 text-3xl font-semibold md:text-5xl">
                    {boardTitle}
                  </h1>

                  <p className="mt-3 max-w-3xl text-base text-slate-300 md:text-lg">
                    {config.boardSubtitle}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void handleAddJob()}
                      className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                    >
                      {config.createButtonLabel}
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleReload()}
                      className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                    >
                      Reload Live Data
                    </button>

                    <button
                      type="button"
                      onClick={() => setBoardViewMode("work")}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                    >
                      Switch to Work Mode
                    </button>

                    {isRestaurant ? (
                      <>
                        <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-100">
                          Kitchen mode active
                        </div>

                        <button
                          type="button"
                          onClick={() => setManagerPanelOpen(true)}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                        >
                          Manager Panel
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Demo status
                      </div>
                      <div className="mt-3 text-2xl font-semibold">Board Ready</div>
                    </div>

                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                      {boardViewMode === "reveal" ? "Reveal" : "Work"}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <div>City: {city}</div>
                    <div>Flow: {config.flowLabel}</div>
                    <div>Mode: {businessType}</div>
                    <div>Live link: /planet/live/{liveBoardSlug}</div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50">
                    {loading
                      ? "Loading from Supabase..."
                      : saving
                        ? "Saving to Supabase..."
                        : isClaiming
                          ? "Starting 14-day trial..."
                          : statusNote || "Connected to Supabase"}
                  </div>
                </div>
              </div>
            </div>

            {boardMeta ? (
              <div className="mb-6 rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-emerald-200/70">
                      HomePlanet Truth Layer
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold">Origin locked</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-50">
                      This starter board has a timestamped creation record tied to
                      its Presence ID, Presence Key, board slug, and trial start.
                    </p>
                  </div>

                  <div className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100">
                    {isClaimed ? "Claimed and active" : "Presence-first timestamped"}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <ProofCard label="Presence ID" value={boardMeta.presence_id} />
                  <ProofCard label="Board slug" value={boardMeta.board_slug} />
                  <ProofCard
                    label="Created at"
                    value={formatProofDate(boardMeta.created_at)}
                  />
                  <ProofCard
                    label="Trial started"
                    value={formatProofDate(boardMeta.trial_started_at)}
                  />
                  <ProofCard
                    label="Trial ends"
                    value={formatProofDate(boardMeta.trial_ends_at)}
                  />
                </div>
              </div>
            ) : null}

            {boardMeta && isClaimed && !isRestaurant ? (
              <div className="mb-6 rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
                      Trial active
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      Your live board is active
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-cyan-50">
                      Your 14-day trial has started. The next step is adding billing
                      before the trial ends so this board can stay live without interruption.
                    </p>
                  </div>

                  <div className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                    Trial running
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <ProofCard
                    label="Trial started"
                    value={formatProofDate(boardMeta.trial_started_at)}
                  />
                  <ProofCard
                    label="Trial ends"
                    value={formatProofDate(boardMeta.trial_ends_at)}
                  />
                  <ProofCard
                    label="Next billing step"
                    value="Payment method setup next"
                  />
                </div>

                <div className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
                  Billing collection is not wired in this board yet, so this state keeps the next
                  step visible without pretending payment setup already exists.
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="mb-4 overflow-hidden rounded-[26px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/8 via-slate-900 to-slate-950 shadow-[0_0_50px_rgba(34,211,238,0.10)]">
              <div className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                      {config.familyLabel}
                    </div>
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-slate-200">
                      {city}
                    </div>
                    {boardMeta ? (
                      <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
                        {isClaimed ? "Claimed" : "Preview"}
                      </div>
                    ) : null}
                  </div>

                  <h1 className="mt-3 truncate text-2xl font-semibold text-white md:text-3xl">
                    {boardTitle}
                  </h1>

                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-300">
                    <span>{config.flowLabel}</span>
                    {boardMeta?.presence_id ? (
                      <>
                        <span className="text-slate-500">â€¢</span>
                        <span className="truncate">Presence ID {boardMeta.presence_id}</span>
                      </>
                    ) : null}
                    {boardMeta?.trial_ends_at && isClaimed ? (
                      <>
                        <span className="text-slate-500">â€¢</span>
                        <span>Trial ends {formatProofDate(boardMeta.trial_ends_at)}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void handleAddJob()}
                    className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                  >
                    {config.createButtonLabel}
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleReload()}
                    className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                  >
                    Reload Live Data
                  </button>

                  <button
                    type="button"
                    onClick={() => setBoardViewMode("reveal")}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                  >
                    Reveal View
                  </button>
                </div>
              </div>
            </div>

            {(boardMeta || (isClaimed && !isRestaurant)) ? (
              <div className="mb-4 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                {boardMeta ? (
                  <div className="rounded-[22px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.22em] text-emerald-200/70">
                          Truth layer
                        </div>
                        <div className="mt-1 text-sm text-emerald-50">
                          Presence {boardMeta.presence_id} â€¢ {boardMeta.board_slug}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setBoardViewMode("reveal")}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/[0.06]"
                      >
                        View full proof
                      </button>
                    </div>
                  </div>
                ) : (
                  <div />
                )}

                {boardMeta && isClaimed && !isRestaurant ? (
                  <div className="rounded-[22px] border border-cyan-400/20 bg-cyan-400/10 px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
                      Trial status
                    </div>
                    <div className="mt-1 text-sm text-cyan-50">
                      Trial running â€¢ Ends {formatProofDate(boardMeta.trial_ends_at)} â€¢ Billing setup next
                    </div>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            ) : null}
          </>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard
            label={isRestaurant ? "Tickets" : isCamp ? "Children" : "Items"}
            value={totals.total}
          />
          <StatCard label="In Progress" value={totals.inProgress} />
          <StatCard
            label={
              isRestaurant
                ? "Ready / Completed"
                : isCamp
                  ? "Checked Out"
                  : "Completed / Ready"
            }
            value={totals.ready}
          />
          <StatCard
            label={isRestaurant ? "New Tickets" : isCamp ? "Checked In" : "New"}
            value={totals.newIntake}
            accent
          />
        </div>

        <div
          className={`grid gap-6 ${
            isRestaurant ? "xl:grid-cols-1" : "xl:grid-cols-[1.15fr_0.85fr]"
          }`}
        >
          <div className="rounded-[30px] border border-white/10 bg-[#081122] p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {isRestaurant
                    ? "Live Ticket Flow"
                    : isCamp
                      ? "Live Camp Control"
                      : "Active Flow"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {isRestaurant
                    ? "Full-width kitchen mode keeps tickets visible across the whole board."
                    : isCamp
                      ? "Each child card is presence-first and profile-protected. Click a card to open the controlled guardian drawer."
                      : "Click any card to open its working drawer."}
                </p>
              </div>

              <div className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                {config.familyLabel}
              </div>
            </div>

            <div
              className={`grid gap-4 ${
                isRestaurant
                  ? "md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5"
                  : "md:grid-cols-2 2xl:grid-cols-3"
              }`}
            >
              {grouped.map((column) => (
                <div
                  key={column.stage}
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold">{column.stage}</h3>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {column.jobs.length}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {column.jobs.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500">
                        {isRestaurant
                          ? "No tickets here yet."
                          : isCamp
                            ? "No children in this zone yet."
                            : "Nothing here yet."}
                      </div>
                    ) : (
                      column.jobs.map((job) => {
                        const selected = selectedJobId === job.id;

                        if (isRestaurant) {
                          return (
                            <button
                              key={job.id}
                              type="button"
                              onClick={() => openRestaurantTicketEditor(job)}
                              className="w-full rounded-[18px] border border-white/10 bg-white/[0.03] p-3 text-left transition hover:bg-white/[0.05]"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                    {formatTicketNumber(job.roNumber)}
                                  </div>
                                  <div className="mt-1 truncate text-base font-semibold text-white">
                                    {restaurantPrimaryLabel(
                                      job,
                                      restaurantIdentityMode,
                                    )}
                                  </div>
                                  <div className="mt-1 truncate text-sm text-slate-400">
                                    {restaurantSecondaryLabel(
                                      job,
                                      restaurantIdentityMode,
                                    )}
                                  </div>
                                </div>

                                <div
                                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${stageTone(
                                    normalizeRestaurantStage(job.stage),
                                  )}`}
                                >
                                  {normalizeRestaurantStage(job.stage)}
                                </div>
                              </div>

                              <div className="mt-2 line-clamp-1 text-sm text-slate-300">
                                {job.concern || config.labels.concern}
                              </div>

                              <div className="mt-2 line-clamp-1 text-[11px] text-slate-500">
                                {job.notes || "Special instructions pending"}
                              </div>

                              <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                                <span className="truncate">
                                  {job.advisor || config.labels.advisor}
                                </span>
                                <span className="shrink-0">
                                  {job.eta || config.labels.eta}
                                </span>
                              </div>
                            </button>
                          );
                        }

                        if (isCamp) {
                          return (
                            <div
                              key={job.id}
                              className={`rounded-[18px] border p-3 transition ${
                                selected
                                  ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_26px_rgba(34,211,238,0.10)]"
                                  : "border-white/10 bg-white/[0.03]"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedJobId(job.id);
                                  setStageMenuOpen(false);
                                }}
                                className="w-full text-left"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                      <span>Protected Child Card</span>
                                      <span
                                        className={`h-2.5 w-2.5 rounded-full ${campStatusTone(job.stage).dot}`}
                                      />
                                    </div>
                                    <div className="mt-1 truncate text-lg font-semibold text-white">
                                      {campChildName(job)}
                                    </div>
                                    <div className="mt-1 truncate text-sm text-cyan-100">
                                      {job.stage || "Checked In"}
                                    </div>
                                    <div className="mt-1 truncate text-sm text-slate-400">
                                      With {campStaffLabel(job)}
                                    </div>
                                  </div>

                                  <div
                                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${campStatusTone(
                                      job.stage,
                                    ).pill}`}
                                  >
                                    {campStatusTone(job.stage).label}
                                  </div>
                                </div>

                                <div className="mt-3 grid gap-2 md:grid-cols-2">
                                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                      Guardian
                                    </div>
                                    <div className="mt-1 line-clamp-1 text-sm text-slate-200">
                                      {campGuardianName(job)}
                                    </div>
                                  </div>

                                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                      Activity
                                    </div>
                                    <div className="mt-1 line-clamp-1 text-sm text-slate-200">
                                      {campActivityLabel(job)}
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                                  <span className="truncate">
                                    Next: {campNextMoveLabel(job)}
                                  </span>
                                  <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-100">
                                    Profile Protected
                                  </span>
                                </div>
                              </button>

                              <div className="mt-3 grid gap-2">
                                <button
                                  type="button"
                                  onClick={() => openParentView(job)}
                                  className="w-full rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                                >
                                  Open Parent View
                                </button>

                                <button
                                  type="button"
                                  onClick={() => void copyParentViewLink(job)}
                                  className="w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                                >
                                  Copy Parent Link
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <button
                            key={job.id}
                            type="button"
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setStageMenuOpen(false);
                            }}
                            className={`w-full rounded-[18px] border p-3 text-left transition ${
                              selected
                                ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_26px_rgba(34,211,238,0.10)]"
                                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                  {job.roNumber}
                                </div>
                                <div className="mt-1 truncate text-base font-semibold text-white">
                                  {job.customer || "Customer pending"}
                                </div>
                              </div>

                              <div
                                className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${stageTone(
                                  job.stage,
                                )}`}
                              >
                                {job.stage}
                              </div>
                            </div>

                            <div className="mt-2 truncate text-sm font-medium text-slate-200">
                              {job.vehicle || `${config.labels.item} pending`}
                            </div>

                            <div className="mt-1 line-clamp-1 text-sm text-slate-400">
                              {job.concern || `${config.labels.concern} pending`}
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                              <span className="truncate">
                                {job.advisor || `${config.labels.advisor} pending`}
                              </span>
                              <span className="shrink-0">
                                {job.eta || `${config.labels.eta} pending`}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              {job.proof?.length ? (
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/12 px-2.5 py-1 text-[10px] font-semibold text-emerald-100">
                                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                  <span>VERIFIED ({job.proof.length})</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-2.5 py-1 text-[10px] font-semibold text-red-100">
                                  <span className="h-2 w-2 rounded-full bg-red-300" />
                                  <span>NO PROOF</span>
                                </div>
                              )}

                              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                {job.proof?.length || 0} proof
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isRestaurant ? (
              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Manager layer
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">
                      Restaurant mode stays full width during rush. Manager tools
                      stay tucked away in a slide-over panel so the live board
                      keeps maximum space for tickets.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setManagerPanelOpen(true)}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
                  >
                    Open Manager Panel
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {!isRestaurant ? (
            <div className="rounded-[30px] border border-white/10 bg-[#081122] p-5">
              {selectedJob ? (
                <>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        {isCamp ? "Protected Child Card" : "Work Item"}
                      </div>
                      <div className="mt-2 text-2xl font-semibold">
                        {isCamp ? campChildName(selectedJob) : selectedJob.roNumber}
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        {isCamp ? "Controlled guardian drawer" : "Working drawer"}
                      </div>
                      {!isCamp ? (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-100">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${proofStatus(selectedJob).dot}`}
                          />
                          <span>{proofStatus(selectedJob).label}</span>
                          <span className="text-violet-200/70">
                            {selectedJob.proof?.length || 0} logged
                          </span>
                        </div>
                      ) : null}
                      {isCamp ? (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${campStatusTone(selectedJob.stage).dot}`}
                          />
                          <span>{campStatusTone(selectedJob.stage).label}</span>
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobId(null);
                        setStageMenuOpen(false);
                      }}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-4">
                    {isCamp ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => openParentView(selectedJob)}
                          className="w-full rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                        >
                          Open Parent View
                        </button>

                        <button
                          type="button"
                          onClick={() => void copyParentViewLink(selectedJob)}
                          className="w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                        >
                          Copy Parent Link
                        </button>
                      </div>
                    ) : null}

                    <Field label={isCamp ? "Guardian Name" : "Customer Name"}>
                      <input
                        value={
                          isCamp
                            ? campGuardianName(selectedJob) === "â€”"
                              ? ""
                              : selectedJob.customer
                            : selectedJob.customer
                        }
                        onChange={(e) =>
                          updateLocalSelectedJob("customer", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder={isCamp ? "Guardian name" : "Customer name"}
                      />
                    </Field>

                    <Field label={config.labels.item}>
                      <input
                        value={
                          isCamp
                            ? campChildName(selectedJob) === "â€”"
                              ? ""
                              : selectedJob.vehicle
                            : selectedJob.vehicle
                        }
                        onChange={(e) =>
                          updateLocalSelectedJob("vehicle", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder={isCamp ? "Child name" : config.labels.item}
                      />
                    </Field>

                    <Field label={config.labels.concern}>
                      <input
                        value={
                          isCamp
                            ? campActivityLabel(selectedJob) === "â€”"
                              ? ""
                              : selectedJob.concern
                            : selectedJob.concern
                        }
                        onChange={(e) =>
                          updateLocalSelectedJob("concern", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder={isCamp ? "Water play" : config.labels.concern}
                      />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={config.labels.stage}>
                        <div className="relative" ref={stageMenuRef}>
                          <button
                            type="button"
                            onClick={() => setStageMenuOpen((open) => !open)}
                            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left outline-none transition hover:border-cyan-400/30"
                          >
                            <span>{selectedJob.stage}</span>
                            <span className="text-slate-400">â–¾</span>
                          </button>

                          {stageMenuOpen ? (
                            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-2xl border border-white/10 bg-[#0b1730] p-2 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                              {stages.map((stage) => {
                                const active = stage === selectedJob.stage;

                                return (
                                  <button
                                    key={stage}
                                    type="button"
                                    onClick={() => {
                                      updateLocalSelectedJob("stage", stage);
                                      setStageMenuOpen(false);
                                    }}
                                    className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition last:mb-0 ${
                                      active
                                        ? "bg-cyan-400/12 text-cyan-100"
                                        : "text-slate-200 hover:bg-white/[0.05]"
                                    }`}
                                  >
                                    <span>{stage}</span>
                                    {active ? (
                                      <span className="text-cyan-300">âœ“</span>
                                    ) : null}
                                  </button>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      </Field>

                      <Field label={config.labels.eta}>
                        <input
                          value={
                            isCamp
                              ? campNextMoveLabel(selectedJob) === "â€”"
                                ? ""
                                : selectedJob.eta
                              : selectedJob.eta
                          }
                          onChange={(e) =>
                            updateLocalSelectedJob("eta", e.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                          placeholder={isCamp ? "5 min rotation" : config.labels.eta}
                        />
                      </Field>
                    </div>

                    <Field label={config.labels.advisor}>
                      <input
                        value={
                          isCamp
                            ? campStaffLabel(selectedJob) === "â€”"
                              ? ""
                              : selectedJob.advisor
                            : selectedJob.advisor
                        }
                        onChange={(e) =>
                          updateLocalSelectedJob("advisor", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder={
                          isCamp ? "Check-In Supervisor" : config.labels.advisor
                        }
                      />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={config.labels.phone}>
                        <input
                          value={selectedJob.phone}
                          onChange={(e) =>
                            updateLocalSelectedJob("phone", e.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                          placeholder="863-555-1212"
                        />
                      </Field>

                      <Field label={config.labels.appointmentDate}>
                        <input
                          type="date"
                          value={selectedJob.appointmentDate}
                          onChange={(e) =>
                            updateLocalSelectedJob(
                              "appointmentDate",
                              e.target.value,
                            )
                          }
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        />
                      </Field>
                    </div>

                    <Field label={config.labels.appointmentTime}>
                      <input
                        type="time"
                        value={selectedJob.appointmentTime}
                        onChange={(e) =>
                          updateLocalSelectedJob(
                            "appointmentTime",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                      />
                    </Field>

                    <Field label={config.labels.notes}>
                      <textarea
                        value={selectedJob.notes}
                        onChange={(e) =>
                          updateLocalSelectedJob("notes", e.target.value)
                        }
                        className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder={config.labels.notes}
                      />
                    </Field>

                    {isCamp ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
                          <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                            PredatorShield lock
                          </div>
                          <div className="mt-2 text-sm leading-6 text-emerald-50">
                            Child profile is protected. This drawer is for movement, guardian contact, staffing, and safety notes only.
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                          <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                            Presence timeline
                          </div>
                          <div className="mt-3 space-y-2 text-sm leading-6 text-cyan-50">
                            {buildCampTimeline(selectedJob).map((line) => (
                              <div key={line}>{line}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        {isCamp ? "Attendance summary" : "Appointment summary"}
                      </div>
                      <div className="mt-2 text-sm leading-6 text-slate-300">
                        {formatAppointment(
                          selectedJob.appointmentDate,
                          selectedJob.appointmentTime,
                        )}
                      </div>
                    </div>

                    {!isCamp ? (
                      <div className="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="text-xs uppercase tracking-[0.22em] text-violet-200/70">
                              Proof capture
                            </div>
                            <div className="mt-2 text-sm leading-6 text-violet-50">
                              Turn this work item into visible proof. Capture the hidden issue, the work in progress, and the finished result so price and labor make sense without extra explaining.
                            </div>
                            <div className="mt-2 text-[10px] text-violet-100/60">
                              Jobs with proof close faster and get approved instantly.
                            </div>
                          </div>

                          <div
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${proofStatus(
                              selectedJob,
                            ).tone}`}
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${proofStatus(selectedJob).dot}`}
                            />
                            <span>{proofStatus(selectedJob).label}</span>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <button
                            type="button"
                            onClick={startProofCapture}
                            disabled={proofCaptureRunningJobId === selectedJob.id}
                            className="rounded-full border border-violet-300/30 bg-violet-300/15 px-4 py-3 text-sm font-semibold text-violet-50 transition hover:bg-violet-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {proofCaptureRunningJobId === selectedJob.id
                              ? "Capture Running"
                              : "Start Capture"}
                          </button>

                          <button
                            type="button"
                            onClick={stopProofCapture}
                            disabled={proofCaptureRunningJobId !== selectedJob.id}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Stop Capture
                          </button>
                        </div>

                        <div className="mt-4">
                          <label className="text-xs uppercase tracking-[0.22em] text-slate-400">
                            Proof note
                          </label>
                          <textarea
                            value={proofNoteDraft}
                            onChange={(e) => setProofNoteDraft(e.target.value)}
                            className="mt-2 min-h-[88px] w-full rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-3 text-sm outline-none transition focus:border-violet-300/40"
                            placeholder="What did you find, remove, expose, or complete?"
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              addProofClip("Hidden issue found", "Customer could not see this without teardown or access.")
                            }
                            className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-400/15"
                          >
                            Hidden Issue
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              addProofClip("Safety concern", "Immediate attention recommended before continuing.")
                            }
                            className="rounded-full border border-red-400/25 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-400/15"
                          >
                            Safety
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              addProofClip("Work in progress", "Active labor, teardown, cleaning, or install in progress.")
                            }
                            className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                          >
                            In Progress
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              addProofClip("Completed work", "Finished result verified and ready to show.")
                            }
                            className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/15"
                          >
                            Completed
                          </button>
                        </div>

                        <div className="mt-4 rounded-[22px] border border-white/10 bg-[#070d1a] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                              Proof timeline
                            </div>

                            <button
                              type="button"
                              onClick={clearProofForSelected}
                              disabled={!selectedJob.proof?.length}
                              className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Clear
                            </button>
                          </div>

                          <div className="mt-3 space-y-2">
                            {selectedJob.proof?.length ? (
                              selectedJob.proof.map((clip) => (
                                <div
                                  key={clip.id}
                                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <div className="text-sm font-semibold text-white">
                                        {clip.label === "Safety concern" && "âš ï¸ Safety issue documented"}
                                        {clip.label === "Hidden issue found" && "ðŸ” Hidden issue uncovered"}
                                        {clip.label === "Work in progress" && "ðŸ›  Work in progress captured"}
                                        {clip.label === "Completed work" && "âœ… Work completed and verified"}
                                        {clip.label !== "Safety concern" &&
                                          clip.label !== "Hidden issue found" &&
                                          clip.label !== "Work in progress" &&
                                          clip.label !== "Completed work" &&
                                          clip.label}
                                      </div>
                                      <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                        {formatProofDate(clip.createdAt)}
                                      </div>
                                    </div>

                                    <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[10px] font-semibold text-violet-100">
                                      Proof
                                    </div>
                                  </div>

                                  <div className="mt-2 text-sm leading-6 text-slate-300">
                                    {clip.note || "No extra note added yet."}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500">
                                No proof moments captured yet. Start with what the customer cannot see, then log the work that made the result possible.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {!isCamp ? (
                      <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                              Payment
                            </div>
                            <div className="mt-2 text-sm leading-6 text-emerald-50">
                              Let the customer scan or tap and pay fast without Stripe or extra checkout friction.
                            </div>
                          </div>

                          {copiedMessage ? (
                            <div className="rounded-full border border-emerald-400/20 px-3 py-1 text-xs text-emerald-100">
                              {copiedMessage}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <Field label="Payment Amount">
                            <input
                              value={paymentAmountDraft}
                              onChange={(e) =>
                                setPaymentAmountDraft(sanitizeMoneyInput(e.target.value))
                              }
                              className="w-full rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-3 outline-none transition focus:border-emerald-400/40"
                              placeholder="125.00"
                            />
                          </Field>

                          <Field label="Payment Memo">
                            <input
                              value={paymentMemoDraft}
                              onChange={(e) => setPaymentMemoDraft(e.target.value)}
                              className="w-full rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-3 outline-none transition focus:border-emerald-400/40"
                              placeholder="RO-1042 · John"
                            />
                          </Field>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="rounded-[22px] border border-white/10 bg-[#070d1a] p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-white">
                                  Cash App
                                </div>
                                <div className="mt-1 text-xs text-slate-400">
                                  {paymentProfile.cashAppCashtag
                                    ? `$${paymentProfile.cashAppCashtag}`
                                    : "Add cashAppCashtag in local payment profile"}
                                </div>
                              </div>

                              <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                                Scan or tap
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-center rounded-[20px] border border-white/10 bg-white px-4 py-4">
                              {cashAppQrSrc ? (
                                <img
                                  src={cashAppQrSrc}
                                  alt="Cash App payment QR"
                                  className="h-[170px] w-[170px] rounded-xl"
                                />
                              ) : (
                                <div className="flex h-[170px] w-[170px] items-center justify-center rounded-xl border border-dashed border-slate-300/20 bg-slate-950 text-center text-xs text-slate-500">
                                  Cash App handle missing
                                </div>
                              )}
                            </div>

                            <div className="mt-4 grid gap-2">
                              <button
                                type="button"
                                onClick={() => openExternalLink(cashAppUrl)}
                                disabled={!cashAppUrl}
                                className="rounded-full bg-emerald-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Open Cash App
                              </button>

                              <button
                                type="button"
                                onClick={() => void copyMessage("Cash App link", cashAppUrl)}
                                disabled={!cashAppUrl}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Copy Cash App Link
                              </button>
                            </div>
                          </div>

                          <div className="rounded-[22px] border border-white/10 bg-[#070d1a] p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-white">
                                  Zelle
                                </div>
                                <div className="mt-1 break-all text-xs text-slate-400">
                                  {paymentProfile.zelleValue || "Add zelleValue in local payment profile"}
                                </div>
                              </div>

                              <div className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                                Copy fast
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-center rounded-[20px] border border-white/10 bg-white px-4 py-4">
                              {zelleQrSrc ? (
                                <img
                                  src={zelleQrSrc}
                                  alt="Zelle payment QR"
                                  className="h-[170px] w-[170px] rounded-xl"
                                />
                              ) : (
                                <div className="flex h-[170px] w-[170px] items-center justify-center rounded-xl border border-dashed border-slate-300/20 bg-slate-950 text-center text-xs text-slate-500">
                                  Zelle destination missing
                                </div>
                              )}
                            </div>

                            <div className="mt-4 grid gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  paymentProfile.zelleValue
                                    ? void copyMessage("Zelle", paymentProfile.zelleValue)
                                    : undefined
                                }
                                disabled={!paymentProfile.zelleValue}
                                className="rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Copy Zelle
                              </button>

                              <div className="grid gap-2 sm:grid-cols-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    paymentMemo
                                      ? void copyMessage("Payment memo", paymentMemo)
                                      : undefined
                                  }
                                  disabled={!paymentMemo}
                                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Copy Memo
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openExternalLink(zelleActionHref)}
                                  disabled={!zelleActionHref}
                                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  Open Zelle Contact
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {(!paymentProfile.cashAppCashtag || !paymentProfile.zelleValue) ? (
                          <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                            Payment profile is not fully configured yet. Add local payment values for this board to turn on both methods.
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {!isCamp ? (
                      <AutoRepairInvoicePanel
                        businessName={businessName}
                        presenceId={presenceId}
                        boardSlug={boardSlugDisplay}
                        job={{
                          roNumber: selectedJob.roNumber,
                          customer: selectedJob.customer,
                          vehicle: selectedJob.vehicle,
                          concern: selectedJob.concern,
                          notes: selectedJob.notes,
                          phone: selectedJob.phone,
                        }}
                        paymentAmount={paymentAmount}
                        paymentMemo={paymentMemo}
                        paymentProfile={paymentProfile}
                        onCopy={copyMessage}
                      />
                    ) : null}

                    <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                            {isCamp
                              ? "Guardian contact actions"
                              : "Quick customer messages"}
                          </div>
                          <div className="mt-2 text-sm leading-6 text-cyan-50">
                            {isCamp
                              ? "Text the guardian directly or copy the message first."
                              : "Text the customer directly or copy the message first."}
                          </div>
                        </div>

                        {copiedMessage ? (
                          <div className="rounded-full border border-cyan-400/20 px-3 py-1 text-xs text-cyan-100">
                            {copiedMessage}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-3">
                        <MessageActionCard
                          title={actionConfig.updateTitle}
                          subtitle={actionConfig.updateSubtitle}
                          message={
                            isCamp
                              ? buildCampGuardianUpdateMessage(
                                  selectedJob,
                                  businessName,
                                )
                              : buildStatusMessage(selectedJob, businessName)
                          }
                          phone={selectedJob.phone}
                          recipientLabel={isCamp ? "guardian" : "customer"}
                          onCopy={copyMessage}
                        />

                        <MessageActionCard
                          title={actionConfig.approvalTitle}
                          subtitle={actionConfig.approvalSubtitle}
                          message={
                            isCamp
                              ? buildCampGuardianAlertMessage(
                                  selectedJob,
                                  businessName,
                                )
                              : buildApprovalMessage(selectedJob, businessName)
                          }
                          phone={selectedJob.phone}
                          recipientLabel={isCamp ? "guardian" : "customer"}
                          onCopy={copyMessage}
                        />

                        <MessageActionCard
                          title={actionConfig.appointmentTitle}
                          subtitle={actionConfig.appointmentSubtitle}
                          message={
                            isCamp
                              ? buildCampGuardianCheckInMessage(
                                  selectedJob,
                                  businessName,
                                )
                              : buildAppointmentMessage(selectedJob, businessName)
                          }
                          phone={selectedJob.phone}
                          recipientLabel={isCamp ? "guardian" : "customer"}
                          onCopy={copyMessage}
                        />

                        <MessageActionCard
                          title={actionConfig.completionTitle}
                          subtitle={actionConfig.completionSubtitle}
                          message={
                            isCamp
                              ? buildCampGuardianCheckoutMessage(
                                  selectedJob,
                                  businessName,
                                )
                              : buildReadyMessage(selectedJob, businessName)
                          }
                          phone={selectedJob.phone}
                          recipientLabel={isCamp ? "guardian" : "customer"}
                          onCopy={copyMessage}
                        />
                      </div>

                      {!selectedJob.phone ? (
                        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                          {isCamp
                            ? "Add a guardian phone number to enable text buttons."
                            : "Add a customer phone number to enable text buttons."}
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                        Save mode
                      </div>
                      <div className="mt-2 text-sm leading-6 text-emerald-50">
                        {isCamp
                          ? "Child movement, guardian contact info, and safety notes save automatically to Supabase and stay after refresh."
                          : "Changes save automatically to Supabase and stay after refresh."}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleDeleteSelected()}
                      className="w-full rounded-full border border-red-400/25 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
                    >
                      {isCamp ? "Delete Child Card" : "Delete Item"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[520px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Working drawer
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold">
                      {isCamp ? "Select a child card" : "Select a card"}
                    </h3>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
                      {isCamp
                        ? "Click any child card on the left to open the controlled drawer, log movement, and keep guardian-safe presence visible live."
                        : "Click any card on the left to open the details drawer, edit it, and watch the board update live."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {showClaimOverlay ? (
        <div className="pointer-events-none fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-[#020617]/58 backdrop-blur-[2px]" />

          <div className="absolute inset-y-0 right-0 flex w-full justify-end p-3 md:p-5">
            <div className="pointer-events-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden rounded-[30px] border border-cyan-400/20 bg-[#081122] shadow-[0_0_80px_rgba(0,0,0,0.55)]">
              <div className="border-b border-white/10 px-6 py-5">
                <div className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  Preview board
                </div>

                <h2 className="mt-4 text-3xl font-semibold text-white">
                  Start your 14-day free trial
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  This live board is already generated from your Creator City intake.
                  Activate it to claim the dashboard, turn on your trial, and keep
                  your Presence-first board tied to this business.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                    Board ready now
                  </div>
                  <div className="mt-3 space-y-3 text-sm text-cyan-50">
                    <PanelRow label="Business" value={businessName} />
                    <PanelRow label="City" value={city} />
                    <PanelRow label="Flow" value={config.flowLabel} />
                    <PanelRow label="Mode" value={businessType} />
                  </div>
                </div>

                <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    What activation does
                  </div>
                  <div className="mt-3 space-y-3 text-sm text-slate-300">
                    <div>â€¢ Starts your 14-day free trial</div>
                    <div>â€¢ Claims this live board as your working dashboard</div>
                    <div>â€¢ Turns preview status into active status</div>
                    <div>â€¢ Keeps the boardâ€™s Presence ID locked to this system</div>
                  </div>
                </div>

                <div className="mt-4 rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                    HomePlanet truth layer
                  </div>
                  <div className="mt-2 text-sm leading-6 text-emerald-50">
                    You can keep looking around this preview, but activation is what
                    turns this board into your claimed live system.
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 px-6 py-5">
                <button
                  type="button"
                  onClick={() => void handleClaimBoard()}
                  disabled={isClaiming}
                  className="w-full rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isClaiming
                    ? "Starting your trial..."
                    : "Start My 14-Day Free Trial"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      window.localStorage.setItem(
                        getPreviewDismissKey(liveBoardSlug),
                        "true",
                      );
                    } catch {
                      // ignore
                    }
                    setClaimPanelDismissed(true);
                  }}
                  className="mt-3 w-full rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  Keep Preview Open
                </button>

                <div className="mt-3 text-center text-xs text-slate-500">
                  You can dismiss this panel for now. A sticky trial button stays available while the board is still in preview mode.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isRestaurant && managerPanelOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close manager panel backdrop"
            onClick={() => setManagerPanelOpen(false)}
            className="absolute inset-0 bg-black/55"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-[460px] border-l border-white/10 bg-[#081122] shadow-[0_0_60px_rgba(0,0,0,0.45)]">
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Restaurant manager panel
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {businessName}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Manager tools stay off-board so kitchen flow keeps maximum
                    room for live tickets.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setManagerPanelOpen(false)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-5">
                  <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                      Todayâ€™s snapshot
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <MiniStat
                        label="Live tickets"
                        value={String(totals.total)}
                      />
                      <MiniStat
                        label="In progress"
                        value={String(totals.inProgress)}
                      />
                      <MiniStat
                        label="Ready"
                        value={String(restaurantSnapshot?.readyCount ?? 0)}
                      />
                      <MiniStat
                        label="Completed"
                        value={String(restaurantSnapshot?.completedCount ?? 0)}
                      />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Ticket identity mode
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-400">
                      Choose how tickets display on the board right now. Later,
                      this should be asked during restaurant onboarding and saved.
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setRestaurantIdentityMode("table")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          restaurantIdentityMode === "table"
                            ? "bg-cyan-400 text-slate-950"
                            : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        Table numbers
                      </button>

                      <button
                        type="button"
                        onClick={() => setRestaurantIdentityMode("name")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          restaurantIdentityMode === "name"
                            ? "bg-cyan-400 text-slate-950"
                            : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        Customer names
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Live ticket status
                    </div>

                    <div className="mt-4 space-y-3">
                      <PanelRow
                        label="On grill"
                        value={String(restaurantSnapshot?.grillCount ?? 0)}
                      />
                      <PanelRow
                        label="Plating"
                        value={String(restaurantSnapshot?.platingCount ?? 0)}
                      />
                      <PanelRow
                        label="Urgent view"
                        value={String(restaurantSnapshot?.urgentCount ?? 0)}
                      />
                      <PanelRow
                        label="New tickets"
                        value={String(totals.newIntake)}
                      />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-amber-400/20 bg-amber-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-amber-200/70">
                      Notifications
                    </div>
                    <div className="mt-3 space-y-3 text-sm text-amber-50">
                      <NotificationLine
                        title="Ready queue watch"
                        body={`${restaurantSnapshot?.readyCount ?? 0} ticket(s) currently marked ready.`}
                      />
                      <NotificationLine
                        title="Rush awareness"
                        body={`${restaurantSnapshot?.urgentCount ?? 0} ticket(s) in grill, plating, or ready states.`}
                      />
                      <NotificationLine
                        title="Next layer"
                        body="Runner alerts, expo notices, and sound-based rush signals can plug into this panel next."
                      />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                      Inventory watch
                    </div>
                    <div className="mt-2 text-sm leading-6 text-emerald-50">
                      Placeholder for low-stock items, 86 list, prep alerts, and
                      ingredient watch. This belongs here instead of taking board
                      space away from live tickets.
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Manager notes
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-400">
                      Placeholder for shift notes, labor reminders, rush prep,
                      comp tracking, and end-of-day notes.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isRestaurant && ticketEditorOpen && ticketEditorDraft ? (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close ticket editor backdrop"
            onClick={closeRestaurantTicketEditor}
            className="absolute inset-0 bg-black/60"
          />

          <div className="absolute left-1/2 top-1/2 w-[min(760px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white/10 bg-[#081122] shadow-[0_0_60px_rgba(0,0,0,0.45)]">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Restaurant ticket editor
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {ticketEditorDraft.id
                      ? ticketEditorDraft.roNumber
                        ? formatTicketNumber(ticketEditorDraft.roNumber)
                        : "Edit Ticket"
                      : "New Ticket"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Enter the table, guest, items ordered, special instructions,
                    server, and ticket time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeRestaurantTicketEditor}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Table Number">
                  <input
                    value={ticketEditorDraft.vehicle}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, vehicle: e.target.value } : current,
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="Table 12"
                  />
                </Field>

                <Field label={isCamp ? "Guardian Name" : "Customer Name"}>
                  <input
                    value={ticketEditorDraft.customer}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, customer: e.target.value } : current,
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="Robert"
                  />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Server">
                  <input
                    value={ticketEditorDraft.advisor}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, advisor: e.target.value } : current,
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="Mia"
                  />
                </Field>

                <Field label="Ticket Time">
                  <input
                    value={ticketEditorDraft.eta}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, eta: e.target.value } : current,
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="8 min"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Stage">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {stages.map((stage) => {
                      const active = ticketEditorDraft.stage === stage;

                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() =>
                            setTicketEditorDraft((current) =>
                              current ? { ...current, stage } : current,
                            )
                          }
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                            active
                              ? "border-cyan-400/35 bg-cyan-400/10 text-cyan-100"
                              : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.05]"
                          }`}
                        >
                          {stage}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Items Ordered">
                  <textarea
                    value={ticketEditorDraft.concern}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, concern: e.target.value } : current,
                      )
                    }
                    className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="2 eggs over medium, bacon, white toast, plain bagel"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Special Instructions">
                  <textarea
                    value={ticketEditorDraft.notes}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, notes: e.target.value } : current,
                      )
                    }
                    className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="No butter on toast, bacon extra crispy"
                  />
                </Field>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-5">
              <div className="text-sm text-slate-400">
                {ticketEditorDraft.id
                  ? "Update this ticket or delete it."
                  : "Create this ticket and place it directly on the live board."}
              </div>

              <div className="flex flex-wrap gap-3">
                {ticketEditorDraft.id ? (
                  <button
                    type="button"
                    onClick={() => void deleteRestaurantTicket()}
                    disabled={ticketEditorSaving}
                    className="rounded-full border border-red-400/25 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete Ticket
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={closeRestaurantTicketEditor}
                  disabled={ticketEditorSaving}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void saveRestaurantTicket()}
                  disabled={ticketEditorSaving}
                  className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ticketEditorSaving
                    ? "Saving..."
                    : ticketEditorDraft.id
                      ? "Save Ticket"
                      : "Create Ticket"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MessageActionCard({
  title,
  subtitle,
  message,
  phone,
  recipientLabel = "customer",
  onCopy,
}: MessageActionCardProps) {
  const hasPhone = Boolean(phone.trim());

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-slate-400">{subtitle}</div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!hasPhone}
          onClick={() => openTextMessage(phone, message)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            hasPhone
              ? "bg-cyan-400 text-slate-950 hover:scale-[1.01]"
              : "cursor-not-allowed bg-white/10 text-slate-500"
          }`}
        >
          Text {recipientLabel}
        </button>

        <button
          type="button"
          onClick={() => onCopy(title, message)}
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
        >
          Copy message
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 ${
        accent
          ? "border-cyan-400/25 bg-cyan-400/10"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div
        className={`text-xs uppercase tracking-[0.22em] ${
          accent ? "text-cyan-200/70" : "text-slate-500"
        }`}
      >
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
    </div>
  );
}

function ProofCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 break-all text-sm font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-3 text-sm font-medium text-slate-300">{label}</div>
      {children}
    </label>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function PanelRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function NotificationLine({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-300/15 bg-black/10 px-4 py-3">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm leading-6 text-amber-50/90">{body}</div>
    </div>
  );
}









