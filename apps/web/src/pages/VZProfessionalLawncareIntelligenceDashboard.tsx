import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Check,
  ChevronDown,
  Copy,
  Leaf,
  LoaderCircle,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const VZ_LIVE_PAGE =
  "https://www.homeplanet.city/planet/vz-professional-lawncare";

const BUSINESS_SLUG = "vz-professional-lawncare";

type VZRequest = {
  id: string;
  business_slug: string;
  customer_name: string;
  phone: string | null;
  email: string | null;
  service_needed: string;
  property_location: string | null;
  property_type: string | null;
  yard_condition: string | null;
  access_notes: string | null;
  preferred_timing: string | null;
  customer_notes: string | null;
  estimate_amount: number | null;
  estimate_notes: string | null;
  estimate_sent_at: string | null;
  scheduled_for: string | null;
  scheduling_notes: string | null;
  request_status: string;
  created_at: string;
  updated_at: string;
};

type VZTruthEvent = {
  id: string;
  request_id: string;
  business_slug: string;
  event_type: string;
  event_label: string;
  event_detail: string | null;
  event_meta: Record<string, unknown>;
  created_at: string;
};

type VZPhoto = {
  id: string;
  request_id: string;
  business_slug: string;
  photo_type: "before" | "after";
  storage_path: string;
  public_url: string | null;
  created_at: string;
  signed_url?: string;
};

const MAX_JOB_PHOTO_EDGE = 1920;
const JOB_PHOTO_QUALITY = 0.78;

async function compressJobPhoto(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const longestEdge = Math.max(bitmap.width, bitmap.height);
    const scale =
      longestEdge > MAX_JOB_PHOTO_EDGE
        ? MAX_JOB_PHOTO_EDGE / longestEdge
        : 1;

    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const compressedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", JOB_PHOTO_QUALITY);
    });

    if (!compressedBlob) return file;

    const baseName =
      file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-") ||
      "job-photo";

    return new File(
      [compressedBlob],
      `${baseName}-${Date.now()}.jpg`,
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      },
    );
  } catch (error) {
    console.warn(
      "V&Z photo compression was unavailable. Uploading the original file.",
      error,
    );

    return file;
  }
}

const quickReplies = [
  {
    label: "Someone needs lawn service",
    reply: `V&Z Professional Lawncare can help with lawn and exterior property care.

You can see the services and request an estimate here:

${VZ_LIVE_PAGE}`,
  },
  {
    label: "V&Z was tagged",
    reply: `Thank you for tagging V&Z Professional Lawncare.

Eric can review the property and service details through the V&Z Live Page:

${VZ_LIVE_PAGE}`,
  },
  {
    label: "Send the Live Page",
    reply: `Here is the V&Z Professional Lawncare Live Page. You can view the services and send Eric the property details:

${VZ_LIVE_PAGE}`,
  },
  {
    label: "Request an estimate",
    reply: `Absolutely. Send Eric the property details and the service you need through the V&Z Live Page:

${VZ_LIVE_PAGE}`,
  },
  {
    label: "Messenger reply",
    reply: `Hi! Thanks for reaching out to V&Z Professional Lawncare. Here is the page where you can view the services and send Eric your estimate request:

${VZ_LIVE_PAGE}`,
  },
  {
    label: "Text reply",
    reply: `Hi! This is Eric with V&Z Professional Lawncare. You can send me the property and service details here:

${VZ_LIVE_PAGE}`,
  },
];

function toDateTimeLocalValue(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (number: number) => String(number).padStart(2, "0");

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

function formatScheduledTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatEventTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function humanizeStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function VZProfessionalLawncareIntelligenceDashboard() {
  const [copiedLabel, setCopiedLabel] = useState("");
  const [requests, setRequests] = useState<VZRequest[]>([]);
  const [truthEvents, setTruthEvents] = useState<VZTruthEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<VZRequest | null>(null);
  const [updatingRequest, setUpdatingRequest] = useState(false);
  const [estimateAmount, setEstimateAmount] = useState("");
  const [estimateNotes, setEstimateNotes] = useState("");
  const [savingEstimate, setSavingEstimate] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const [savingApproval, setSavingApproval] = useState(false);
  const [approvalError, setApprovalError] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [schedulingNotes, setSchedulingNotes] = useState("");
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [schedulingError, setSchedulingError] = useState("");
  const [startingJob, setStartingJob] = useState(false);
  const [workError, setWorkError] = useState("");
  const [photos, setPhotos] = useState<VZPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [uploadingBeforePhotos, setUploadingBeforePhotos] = useState(false);
  const [uploadingAfterPhotos, setUploadingAfterPhotos] = useState(false);
  const [completingWork, setCompletingWork] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [completionError, setCompletionError] = useState("");
  const [openDrawerSection, setOpenDrawerSection] = useState("");
  const [archivingRequest, setArchivingRequest] = useState(false);
  const [deletingRequest, setDeletingRequest] = useState(false);
  const [recordActionError, setRecordActionError] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [restoringRequest, setRestoringRequest] = useState(false);
  const [closeoutAction, setCloseoutAction] = useState("");
  const [closeoutError, setCloseoutError] = useState("");

  useEffect(() => {
    if (!selectedRequest) {
      setEstimateAmount("");
      setEstimateNotes("");
      setEstimateError("");
      return;
    }

    setEstimateAmount(
      selectedRequest.estimate_amount === null ||
        selectedRequest.estimate_amount === undefined
        ? ""
        : String(selectedRequest.estimate_amount),
    );

    setEstimateNotes(selectedRequest.estimate_notes || "");
    setEstimateError("");
    setApprovalError("");
    setScheduledFor(toDateTimeLocalValue(selectedRequest.scheduled_for));
    setSchedulingNotes(selectedRequest.scheduling_notes || "");
    setSchedulingError("");
    setWorkError("");
    setPhotoError("");
    setCompletionError("");
    switch (selectedRequest.request_status) {
      case "new":
      case "reviewing":
        setOpenDrawerSection("estimate");
        break;
      case "estimate_sent":
        setOpenDrawerSection("approval");
        break;
      case "approved":
        setOpenDrawerSection("scheduling");
        break;
      case "scheduled":
      case "in_progress":
        setOpenDrawerSection("active");
        break;
      case "completed":
        setOpenDrawerSection("");
        break;
      default:
        setOpenDrawerSection("");
    }
  }, [selectedRequest?.id, selectedRequest?.request_status]);

  useEffect(() => {
    if (!selectedRequest?.id) {
      setPhotos([]);
      setLoadingPhotos(false);
      return;
    }

    let alive = true;

    async function loadCustomerPhotos() {
      setLoadingPhotos(true);
      setPhotoError("");

      const { data, error } = await supabase
        .from("vz_lawncare_request_photos")
        .select("*")
        .eq("request_id", selectedRequest.id)
        .eq("business_slug", BUSINESS_SLUG)
        .order("created_at", { ascending: false });

      if (!alive) return;

      if (error) {
        console.error("Could not load V&Z customer photos:", error);
        setPhotos([]);
        setPhotoError(error.message);
        setLoadingPhotos(false);
        return;
      }

      const savedPhotos = (data ?? []) as VZPhoto[];

      const photosWithSignedUrls = await Promise.all(
        savedPhotos.map(async (photo) => {
          const { data: signedData, error: signedError } =
            await supabase.storage
              .from("vz-lawncare-job-photos")
              .createSignedUrl(photo.storage_path, 3600);

          if (signedError) {
            console.error(
              "Could not create signed V&Z photo URL:",
              signedError,
            );

            return photo;
          }

          return {
            ...photo,
            signed_url: signedData.signedUrl,
          };
        }),
      );

      if (!alive) return;

      setPhotos(photosWithSignedUrls);
      setLoadingPhotos(false);
    }

    void loadCustomerPhotos();

    return () => {
      alive = false;
    };
  }, [selectedRequest?.id]);

  async function copyReply(label: string, reply: string) {
    try {
      await navigator.clipboard.writeText(reply);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(""), 1600);
    } catch (error) {
      console.error("Could not copy V&Z quick reply:", error);
    }
  }

  async function loadBoard(showRefreshState = false) {
    if (showRefreshState) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setErrorMessage("");

    const { data: requestData, error: requestError } = await supabase
      .from("vz_lawncare_requests")
      .select("*")
      .eq("business_slug", BUSINESS_SLUG)
      .order("created_at", { ascending: false })
      .limit(50);

    if (requestError) {
      console.error("Could not load V&Z requests:", requestError);
      setErrorMessage(requestError.message);
      setRequests([]);
      setTruthEvents([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const liveRequests = (requestData ?? []) as VZRequest[];

    const { data: truthData, error: truthError } = await supabase
      .from("vz_lawncare_truth_events")
      .select("*")
      .eq("business_slug", BUSINESS_SLUG)
      .order("created_at", { ascending: false })
      .limit(300);

    if (truthError) {
      console.error("Could not load V&Z Truth Chain:", truthError);
      setErrorMessage(truthError.message);
      setRequests(liveRequests);
      setTruthEvents([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    let liveTruthEvents = (truthData ?? []) as VZTruthEvent[];

    const requestIdsWithReceivedEvent = new Set(
      liveTruthEvents
        .filter((event) => event.event_type === "request_received")
        .map((event) => event.request_id),
    );

    const missingReceivedEvents = liveRequests
      .filter((request) => !requestIdsWithReceivedEvent.has(request.id))
      .map((request) => ({
        request_id: request.id,
        business_slug: BUSINESS_SLUG,
        event_type: "request_received",
        event_label: "Request received",
        event_detail: `${request.customer_name} requested ${request.service_needed}.`,
        event_meta: {
          source: "vz_lawncare_requests",
          request_status: request.request_status,
        },
      }));

    if (missingReceivedEvents.length) {
      const { error: insertError } = await supabase
        .from("vz_lawncare_truth_events")
        .insert(missingReceivedEvents);

      if (insertError) {
        console.error(
          "Could not create V&Z request received events:",
          insertError,
        );
      } else {
        const { data: refreshedTruthData, error: refreshedTruthError } =
          await supabase
            .from("vz_lawncare_truth_events")
            .select("*")
            .eq("business_slug", BUSINESS_SLUG)
            .order("created_at", { ascending: false })
            .limit(300);

        if (!refreshedTruthError) {
          liveTruthEvents = (refreshedTruthData ?? []) as VZTruthEvent[];
        }
      }
    }

    setRequests(liveRequests);
    setTruthEvents(liveTruthEvents);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => {
    void loadBoard();
  }, []);

  const activeRequests = useMemo(
    () =>
      requests.filter(
        (request) =>
          request.request_status !== "closed" &&
          request.request_status !== "archived",
      ),
    [requests],
  );

  const archivedRequests = useMemo(
    () =>
      requests.filter(
        (request) => request.request_status === "archived",
      ),
    [requests],
  );

  const visibleRequests = showArchived
    ? archivedRequests
    : activeRequests;

  const metrics = useMemo(
    () => [
      {
        label: "Active Signals",
        value: activeRequests.length,
      },
      {
        label: "Estimates Sent",
        value: truthEvents.filter(
          (event) => event.event_type === "estimate_sent",
        ).length,
      },
      {
        label: "Jobs Scheduled",
        value: truthEvents.filter(
          (event) => event.event_type === "job_scheduled",
        ).length,
      },
      {
        label: "Outcomes Closed",
        value: truthEvents.filter(
          (event) => event.event_type === "outcome_closed",
        ).length,
      },
    ],
    [activeRequests.length, truthEvents],
  );

  const recentTruthEvents = useMemo(
    () => truthEvents.slice(0, 12),
    [truthEvents],
  );

  function requestName(requestId: string) {
    return (
      requests.find((request) => request.id === requestId)?.customer_name ||
      "V&Z customer"
    );
  }

  function nextMoveForStatus(status: string) {
    switch (status) {
      case "new":
        return "Review the property details and prepare the customer estimate.";
      case "reviewing":
        return "Prepare and send the customer estimate.";
      case "estimate_sent":
        return "Confirm customer approval and schedule the work.";
      case "approved":
        return "Choose the service date and schedule the job.";
      case "scheduled":
        return "Complete the work and keep the proof with this customer.";
      case "in_progress":
        return "Finish the work and record the completed outcome.";
      case "completed":
        return "Confirm payment, send proof, and close the outcome.";
      default:
        return "Review the customer record and choose the next action.";
    }
  }

  function phoneHref(value: string | null) {
    const digits = String(value || "").replace(/\D/g, "");

    if (!digits) return "";

    return digits.length === 10 ? `+1${digits}` : `+${digits}`;
  }

  function formatPhone(value: string | null) {
    const digits = String(value || "").replace(/\D/g, "").slice(-10);

    if (digits.length !== 10) {
      return value || "No phone provided";
    }

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  async function markRequestReviewing() {
    if (!selectedRequest || updatingRequest) return;

    setUpdatingRequest(true);

    const { error } = await supabase
      .from("vz_lawncare_requests")
      .update({
        request_status: "reviewing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedRequest.id)
      .eq("business_slug", BUSINESS_SLUG);

    if (error) {
      console.error("Could not mark V&Z request reviewing:", error);
      setErrorMessage(error.message);
      setUpdatingRequest(false);
      return;
    }

    const updatedRequest = {
      ...selectedRequest,
      request_status: "reviewing",
      updated_at: new Date().toISOString(),
    };

    setRequests((current) =>
      current.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request,
      ),
    );

    setSelectedRequest(updatedRequest);
    setUpdatingRequest(false);
  }

  async function recordCloseoutStep(
    eventType: string,
    eventLabel: string,
    eventDetail: string,
  ) {
    if (!selectedRequest || closeoutAction) return false;

    setCloseoutError("");
    setCloseoutAction(eventType);

    const recordedAt = new Date().toISOString();

    const { data: savedEvent, error } = await supabase
      .from("vz_lawncare_truth_events")
      .upsert(
        {
          request_id: selectedRequest.id,
          business_slug: BUSINESS_SLUG,
          event_type: eventType,
          event_label: eventLabel,
          event_detail: eventDetail,
          event_meta: {
            recorded_at: recordedAt,
          },
          created_at: recordedAt,
        },
        {
          onConflict: "request_id,event_type",
        },
      )
      .select("*")
      .single();

    if (error) {
      console.error(`Could not record V&Z ${eventType} event:`, error);
      setCloseoutError(error.message);
      setCloseoutAction("");
      return false;
    }

    if (savedEvent) {
      setTruthEvents((current) => [
        savedEvent as VZTruthEvent,
        ...current.filter(
          (event) =>
            !(
              event.request_id === selectedRequest.id &&
              event.event_type === eventType
            ),
        ),
      ]);
    }

    setCloseoutAction("");
    return true;
  }

  async function sendPaymentRequest() {
    if (!selectedRequest) return;

    const amount =
      selectedRequest.estimate_amount !== null &&
      selectedRequest.estimate_amount !== undefined
        ? `$${Number(selectedRequest.estimate_amount).toFixed(2)}`
        : "the completed lawn service";

    const saved = await recordCloseoutStep(
      "payment_sent",
      "Payment request sent",
      `A payment request was prepared for ${selectedRequest.customer_name}.`,
    );

    if (!saved) return;

    const message = encodeURIComponent(
      `Hi ${selectedRequest.customer_name}, your V&Z Professional Lawncare service is complete. The amount due is ${amount}. Thank you for choosing V&Z Professional Lawncare.`,
    );

    window.location.href =
      `sms:${selectedRequest.phone ?? ""}?body=${message}`;
  }

  async function markPaymentReceived() {
    if (!selectedRequest) return;

    await recordCloseoutStep(
      "payment_received",
      "Payment received",
      `Payment was marked received for ${selectedRequest.customer_name}.`,
    );
  }

  async function sendCompletionProof() {
    if (!selectedRequest) return;

    const saved = await recordCloseoutStep(
      "proof_sent",
      "Completion proof sent",
      `The completed-work proof was sent to ${selectedRequest.customer_name}.`,
    );

    if (!saved) return;

    const message = encodeURIComponent(
      `Hi ${selectedRequest.customer_name}, your V&Z Professional Lawncare service is complete. We documented the property before and after the work. Thank you for trusting us with your property.`,
    );

    window.location.href =
      `sms:${selectedRequest.phone ?? ""}?body=${message}`;
  }

  async function requestCustomerReview() {
    if (!selectedRequest) return;

    const saved = await recordCloseoutStep(
      "review_requested",
      "Review requested",
      `A review was requested from ${selectedRequest.customer_name}.`,
    );

    if (!saved) return;

    const message = encodeURIComponent(
      `Hi ${selectedRequest.customer_name}, thank you for choosing V&Z Professional Lawncare. We would really appreciate a quick review about your experience with us.`,
    );

    window.location.href =
      `sms:${selectedRequest.phone ?? ""}?body=${message}`;
  }

  async function closeCustomerOutcome() {
    if (!selectedRequest) return;

    const confirmed = window.confirm(
      `Close ${selectedRequest.customer_name}'s completed outcome?

The record will remain visible until you archive it.`,
    );

    if (!confirmed) return;

    await recordCloseoutStep(
      "outcome_closed",
      "Outcome closed",
      `${selectedRequest.customer_name}'s completed customer outcome was closed.`,
    );
  }

  async function restoreArchivedRecord() {
    if (!selectedRequest || restoringRequest) return;

    const confirmed = window.confirm(
      `Restore ${selectedRequest.customer_name}'s archived record to the working list?`,
    );

    if (!confirmed) return;

    setRecordActionError("");
    setRestoringRequest(true);

    const restoredAt = new Date().toISOString();

    const { error } = await supabase
      .from("vz_lawncare_requests")
      .update({
        request_status: "completed",
        updated_at: restoredAt,
      })
      .eq("id", selectedRequest.id)
      .eq("business_slug", BUSINESS_SLUG);

    if (error) {
      console.error("Could not restore V&Z customer record:", error);
      setRecordActionError(error.message);
      setRestoringRequest(false);
      return;
    }

    const restoredRequest: VZRequest = {
      ...selectedRequest,
      request_status: "completed",
      updated_at: restoredAt,
    };

    setRequests((current) =>
      current.map((request) =>
        request.id === restoredRequest.id
          ? restoredRequest
          : request,
      ),
    );

    setSelectedRequest(null);
    setShowArchived(false);
    setRestoringRequest(false);
  }

  async function archiveCustomerRecord() {
    if (!selectedRequest || archivingRequest) return;

    const confirmed = window.confirm(
      `Archive ${selectedRequest.customer_name}'s customer record? It will disappear from the working list but remain safely stored.`,
    );

    if (!confirmed) return;

    setRecordActionError("");
    setArchivingRequest(true);

    const archivedAt = new Date().toISOString();

    const { error } = await supabase
      .from("vz_lawncare_requests")
      .update({
        request_status: "archived",
        updated_at: archivedAt,
      })
      .eq("id", selectedRequest.id)
      .eq("business_slug", BUSINESS_SLUG);

    if (error) {
      console.error("Could not archive V&Z customer record:", error);
      setRecordActionError(error.message);
      setArchivingRequest(false);
      return;
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === selectedRequest.id
          ? {
              ...request,
              request_status: "archived",
              updated_at: archivedAt,
            }
          : request,
      ),
    );

    setSelectedRequest(null);
    setArchivingRequest(false);
  }

  async function deleteCustomerMistake() {
    if (!selectedRequest || deletingRequest) return;

    const confirmed = window.confirm(
      `Permanently delete ${selectedRequest.customer_name}'s record?\n\nUse this only for a duplicate or mistake. The customer record, Truth Chain, and saved photos will be removed.`,
    );

    if (!confirmed) return;

    setRecordActionError("");
    setDeletingRequest(true);

    const { data: photoRows, error: photoLoadError } = await supabase
      .from("vz_lawncare_request_photos")
      .select("storage_path")
      .eq("request_id", selectedRequest.id)
      .eq("business_slug", BUSINESS_SLUG);

    if (photoLoadError) {
      console.error(
        "Could not load V&Z photo paths before deletion:",
        photoLoadError,
      );

      setRecordActionError(photoLoadError.message);
      setDeletingRequest(false);
      return;
    }

    const storagePaths = (photoRows ?? [])
      .map((photo) => photo.storage_path)
      .filter(Boolean);

    if (storagePaths.length) {
      const { error: storageError } = await supabase.storage
        .from("vz-lawncare-job-photos")
        .remove(storagePaths);

      if (storageError) {
        console.error(
          "Could not delete V&Z private photo files:",
          storageError,
        );

        setRecordActionError(
          "The private photo files could not be removed, so the customer record was not deleted.",
        );

        setDeletingRequest(false);
        return;
      }
    }

    const { error: deleteError } = await supabase
      .from("vz_lawncare_requests")
      .delete()
      .eq("id", selectedRequest.id)
      .eq("business_slug", BUSINESS_SLUG);

    if (deleteError) {
      console.error("Could not delete V&Z customer record:", deleteError);
      setRecordActionError(deleteError.message);
      setDeletingRequest(false);
      return;
    }

    setRequests((current) =>
      current.filter((request) => request.id !== selectedRequest.id),
    );

    setTruthEvents((current) =>
      current.filter((event) => event.request_id !== selectedRequest.id),
    );

    setPhotos([]);
    setSelectedRequest(null);
    setDeletingRequest(false);
  }

  async function startJob() {
    if (!selectedRequest || startingJob) return;

    setWorkError("");
    setStartingJob(true);

    const startedAt = new Date().toISOString();

    const { error: requestError } = await supabase
      .from("vz_lawncare_requests")
      .update({
        request_status: "in_progress",
        updated_at: startedAt,
      })
      .eq("id", selectedRequest.id)
      .eq("business_slug", BUSINESS_SLUG);

    if (requestError) {
      console.error("Could not start V&Z job:", requestError);
      setWorkError(requestError.message);
      setStartingJob(false);
      return;
    }

    const { data: workEvent, error: truthError } = await supabase
      .from("vz_lawncare_truth_events")
      .upsert(
        {
          request_id: selectedRequest.id,
          business_slug: BUSINESS_SLUG,
          event_type: "work_started",
          event_label: "Work started",
          event_detail: `${selectedRequest.customer_name}'s ${selectedRequest.service_needed} job was started.`,
          event_meta: {
            started_at: startedAt,
          },
          created_at: startedAt,
        },
        {
          onConflict: "request_id,event_type",
        },
      )
      .select("*")
      .single();

    if (truthError) {
      console.error("Could not record V&Z work-started event:", truthError);
      setWorkError(
        "The job was started, but the Truth Chain event could not be recorded.",
      );
      setStartingJob(false);
      return;
    }

    const updatedRequest: VZRequest = {
      ...selectedRequest,
      request_status: "in_progress",
      updated_at: startedAt,
    };

    setRequests((current) =>
      current.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request,
      ),
    );

    setSelectedRequest(updatedRequest);

    if (workEvent) {
      setTruthEvents((current) => [
        workEvent as VZTruthEvent,
        ...current.filter(
          (event) =>
            !(
              event.request_id === selectedRequest.id &&
              event.event_type === "work_started"
            ),
        ),
      ]);
    }

    setStartingJob(false);
  }

  async function uploadBeforePhotos(files: FileList | null) {
    if (
      !selectedRequest ||
      !files ||
      files.length === 0 ||
      uploadingBeforePhotos
    ) {
      return;
    }

    if (selectedRequest.request_status !== "in_progress") {
      setPhotoError("Start the job before adding before photos.");
      return;
    }

    setPhotoError("");
    setUploadingBeforePhotos(true);

    try {
      const savedPhotos: VZPhoto[] = [];

      for (const file of Array.from(files)) {
        const uploadFile = await compressJobPhoto(file);
        const safeName = uploadFile.name
          .toLowerCase()
          .replace(/[^a-z0-9._-]+/g, "-");

        const storagePath = [
          selectedRequest.id,
          "before",
          `${Date.now()}-${crypto.randomUUID()}-${safeName}`,
        ].join("/");

        const { error: uploadError } = await supabase.storage
          .from("vz-lawncare-job-photos")
          .upload(storagePath, uploadFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || undefined,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: insertedPhoto, error: insertError } = await supabase
          .from("vz_lawncare_request_photos")
          .insert({
            request_id: selectedRequest.id,
            business_slug: BUSINESS_SLUG,
            photo_type: "before",
            storage_path: storagePath,
            public_url: null,
          })
          .select("*")
          .single();

        if (insertError) {
          await supabase.storage
            .from("vz-lawncare-job-photos")
            .remove([storagePath]);

          throw insertError;
        }

        const { data: signedData, error: signedError } =
          await supabase.storage
            .from("vz-lawncare-job-photos")
            .createSignedUrl(storagePath, 3600);

        if (signedError) {
          console.error(
            "Could not create signed URL for uploaded V&Z photo:",
            signedError,
          );
        }

        savedPhotos.push({
          ...(insertedPhoto as VZPhoto),
          signed_url: signedData?.signedUrl,
        });
      }

      setPhotos((current) => [...savedPhotos, ...current]);

      const totalBeforePhotos =
        photos.filter((photo) => photo.photo_type === "before").length +
        savedPhotos.length;

      const recordedAt = new Date().toISOString();

      const { data: photoEvent, error: truthError } = await supabase
        .from("vz_lawncare_truth_events")
        .upsert(
          {
            request_id: selectedRequest.id,
            business_slug: BUSINESS_SLUG,
            event_type: "before_photo_added",
            event_label: "Before photos added",
            event_detail: `${totalBeforePhotos} before photo${
              totalBeforePhotos === 1 ? "" : "s"
            } saved with this customer job.`,
            event_meta: {
              photo_type: "before",
              photo_count: totalBeforePhotos,
            },
            created_at: recordedAt,
          },
          {
            onConflict: "request_id,event_type",
          },
        )
        .select("*")
        .single();

      if (truthError) {
        console.error(
          "Could not record V&Z before-photo event:",
          truthError,
        );

        setPhotoError(
          "The photos were saved, but the Truth Chain event could not be recorded.",
        );
      } else if (photoEvent) {
        setTruthEvents((current) => [
          photoEvent as VZTruthEvent,
          ...current.filter(
            (event) =>
              !(
                event.request_id === selectedRequest.id &&
                event.event_type === "before_photo_added"
              ),
          ),
        ]);
      }
    } catch (error) {
      console.error("V&Z before-photo upload failed:", error);

      setPhotoError(
        error instanceof Error
          ? error.message
          : "The before photos could not be uploaded.",
      );
    } finally {
      setUploadingBeforePhotos(false);
    }
  }

  async function uploadAfterPhotos(files: FileList | null) {
    if (
      !selectedRequest ||
      !files ||
      files.length === 0 ||
      uploadingAfterPhotos
    ) {
      return;
    }

    if (selectedRequest.request_status !== "in_progress") {
      setPhotoError("The job must be in progress before adding after photos.");
      return;
    }

    setPhotoError("");
    setUploadingAfterPhotos(true);

    try {
      const savedPhotos: VZPhoto[] = [];

      for (const file of Array.from(files)) {
        const uploadFile = await compressJobPhoto(file);
        const safeName = uploadFile.name
          .toLowerCase()
          .replace(/[^a-z0-9._-]+/g, "-");

        const storagePath = [
          selectedRequest.id,
          "after",
          `${Date.now()}-${crypto.randomUUID()}-${safeName}`,
        ].join("/");

        const { error: uploadError } = await supabase.storage
          .from("vz-lawncare-job-photos")
          .upload(storagePath, uploadFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || undefined,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: insertedPhoto, error: insertError } = await supabase
          .from("vz_lawncare_request_photos")
          .insert({
            request_id: selectedRequest.id,
            business_slug: BUSINESS_SLUG,
            photo_type: "after",
            storage_path: storagePath,
            public_url: null,
          })
          .select("*")
          .single();

        if (insertError) {
          await supabase.storage
            .from("vz-lawncare-job-photos")
            .remove([storagePath]);

          throw insertError;
        }

        const { data: signedData, error: signedError } =
          await supabase.storage
            .from("vz-lawncare-job-photos")
            .createSignedUrl(storagePath, 3600);

        if (signedError) {
          console.error(
            "Could not create signed URL for uploaded V&Z after photo:",
            signedError,
          );
        }

        savedPhotos.push({
          ...(insertedPhoto as VZPhoto),
          signed_url: signedData?.signedUrl,
        });
      }

      setPhotos((current) => [...savedPhotos, ...current]);

      const totalAfterPhotos =
        photos.filter((photo) => photo.photo_type === "after").length +
        savedPhotos.length;

      const recordedAt = new Date().toISOString();

      const { data: photoEvent, error: truthError } = await supabase
        .from("vz_lawncare_truth_events")
        .upsert(
          {
            request_id: selectedRequest.id,
            business_slug: BUSINESS_SLUG,
            event_type: "after_photo_added",
            event_label: "After photos added",
            event_detail: `${totalAfterPhotos} after photo${
              totalAfterPhotos === 1 ? "" : "s"
            } saved with this customer job.`,
            event_meta: {
              photo_type: "after",
              photo_count: totalAfterPhotos,
            },
            created_at: recordedAt,
          },
          {
            onConflict: "request_id,event_type",
          },
        )
        .select("*")
        .single();

      if (truthError) {
        console.error(
          "Could not record V&Z after-photo event:",
          truthError,
        );

        setPhotoError(
          "The photos were saved, but the Truth Chain event could not be recorded.",
        );
      } else if (photoEvent) {
        setTruthEvents((current) => [
          photoEvent as VZTruthEvent,
          ...current.filter(
            (event) =>
              !(
                event.request_id === selectedRequest.id &&
                event.event_type === "after_photo_added"
              ),
          ),
        ]);
      }
    } catch (error) {
      console.error("V&Z after-photo upload failed:", error);

      setPhotoError(
        error instanceof Error
          ? error.message
          : "The after photos could not be uploaded.",
      );
    } finally {
      setUploadingAfterPhotos(false);
    }
  }

  async function completeWork() {
    if (!selectedRequest || completingWork) return;

    const afterPhotoCount = photos.filter(
      (photo) => photo.photo_type === "after",
    ).length;

    if (afterPhotoCount === 0) {
      setCompletionError(
        "Add at least one after photo before completing the work.",
      );
      return;
    }

    setCompletionError("");
    setCompletingWork(true);

    const completedAt = new Date().toISOString();

    const { error: requestError } = await supabase
      .from("vz_lawncare_requests")
      .update({
        request_status: "completed",
        updated_at: completedAt,
      })
      .eq("id", selectedRequest.id)
      .eq("business_slug", BUSINESS_SLUG);

    if (requestError) {
      console.error("Could not complete V&Z work:", requestError);
      setCompletionError(requestError.message);
      setCompletingWork(false);
      return;
    }

    const { data: completedEvent, error: truthError } = await supabase
      .from("vz_lawncare_truth_events")
      .upsert(
        {
          request_id: selectedRequest.id,
          business_slug: BUSINESS_SLUG,
          event_type: "work_completed",
          event_label: "Work completed",
          event_detail: `${selectedRequest.customer_name}'s ${selectedRequest.service_needed} job was completed.`,
          event_meta: {
            completed_at: completedAt,
            before_photo_count: photos.filter(
              (photo) => photo.photo_type === "before",
            ).length,
            after_photo_count: afterPhotoCount,
          },
          created_at: completedAt,
        },
        {
          onConflict: "request_id,event_type",
        },
      )
      .select("*")
      .single();

    if (truthError) {
      console.error(
        "Could not record V&Z work-completed event:",
        truthError,
      );

      setCompletionError(
        "The work was completed, but the Truth Chain event could not be recorded.",
      );

      setCompletingWork(false);
      return;
    }

    const updatedRequest: VZRequest = {
      ...selectedRequest,
      request_status: "completed",
      updated_at: completedAt,
    };

    setRequests((current) =>
      current.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request,
      ),
    );

    setSelectedRequest(updatedRequest);

    if (completedEvent) {
      setTruthEvents((current) => [
        completedEvent as VZTruthEvent,
        ...current.filter(
          (event) =>
            !(
              event.request_id === selectedRequest.id &&
              event.event_type === "work_completed"
            ),
        ),
      ]);
    }

    setOpenDrawerSection("");
    setCompletingWork(false);
  }

  async function saveJobSchedule() {
    if (!selectedRequest || savingSchedule) return;

    if (!scheduledFor) {
      setSchedulingError("Choose the service date and time.");
      return;
    }

    const scheduledDate = new Date(scheduledFor);

    if (Number.isNaN(scheduledDate.getTime())) {
      setSchedulingError("Choose a valid service date and time.");
      return;
    }

    setSchedulingError("");
    setSavingSchedule(true);

    const scheduledAt = scheduledDate.toISOString();
    const recordedAt = new Date().toISOString();
    const cleanNotes = schedulingNotes.trim();
    const formattedSchedule = formatScheduledTime(scheduledAt);

    const { error: requestError } = await supabase
      .from("vz_lawncare_requests")
      .update({
        scheduled_for: scheduledAt,
        scheduling_notes: cleanNotes || null,
        request_status: "scheduled",
        updated_at: recordedAt,
      })
      .eq("id", selectedRequest.id)
      .eq("business_slug", BUSINESS_SLUG);

    if (requestError) {
      console.error("Could not schedule V&Z job:", requestError);
      setSchedulingError(requestError.message);
      setSavingSchedule(false);
      return;
    }

    const { data: scheduleEvent, error: truthError } = await supabase
      .from("vz_lawncare_truth_events")
      .upsert(
        {
          request_id: selectedRequest.id,
          business_slug: BUSINESS_SLUG,
          event_type: "job_scheduled",
          event_label: "Job scheduled",
          event_detail: `${selectedRequest.customer_name}'s ${selectedRequest.service_needed} job was scheduled for ${formattedSchedule}.`,
          event_meta: {
            scheduled_for: scheduledAt,
            scheduling_notes: cleanNotes || null,
          },
          created_at: recordedAt,
        },
        {
          onConflict: "request_id,event_type",
        },
      )
      .select("*")
      .single();

    if (truthError) {
      console.error("Could not record V&Z schedule event:", truthError);
      setSchedulingError(
        "The job was scheduled, but the Truth Chain event could not be recorded.",
      );
      setSavingSchedule(false);
      return;
    }

    const updatedRequest: VZRequest = {
      ...selectedRequest,
      scheduled_for: scheduledAt,
      scheduling_notes: cleanNotes || null,
      request_status: "scheduled",
      updated_at: recordedAt,
    };

    setRequests((current) =>
      current.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request,
      ),
    );

    setSelectedRequest(updatedRequest);

    if (scheduleEvent) {
      setTruthEvents((current) => [
        scheduleEvent as VZTruthEvent,
        ...current.filter(
          (event) =>
            !(
              event.request_id === selectedRequest.id &&
              event.event_type === "job_scheduled"
            ),
        ),
      ]);
    }

    setSavingSchedule(false);
  }

  async function markCustomerApproved() {
    if (!selectedRequest || savingApproval) return;

    setApprovalError("");
    setSavingApproval(true);

    const approvedAt = new Date().toISOString();

    const { error: requestError } = await supabase
      .from("vz_lawncare_requests")
      .update({
        request_status: "approved",
        updated_at: approvedAt,
      })
      .eq("id", selectedRequest.id)
      .eq("business_slug", BUSINESS_SLUG);

    if (requestError) {
      console.error("Could not approve V&Z estimate:", requestError);
      setApprovalError(requestError.message);
      setSavingApproval(false);
      return;
    }

    const estimateAmount =
      selectedRequest.estimate_amount === null
        ? null
        : Number(selectedRequest.estimate_amount);

    const formattedAmount =
      estimateAmount === null
        ? null
        : estimateAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          });

    const { data: approvalEvent, error: truthError } = await supabase
      .from("vz_lawncare_truth_events")
      .upsert(
        {
          request_id: selectedRequest.id,
          business_slug: BUSINESS_SLUG,
          event_type: "customer_approved",
          event_label: "Customer approved",
          event_detail: formattedAmount
            ? `${selectedRequest.customer_name} approved the ${formattedAmount} estimate.`
            : `${selectedRequest.customer_name} approved the estimate.`,
          event_meta: {
            estimate_amount: estimateAmount,
            approval_recorded_by: "business",
          },
          created_at: approvedAt,
        },
        {
          onConflict: "request_id,event_type",
        },
      )
      .select("*")
      .single();

    if (truthError) {
      console.error("Could not record V&Z approval event:", truthError);
      setApprovalError(
        "The request was approved, but the Truth Chain event could not be recorded.",
      );
      setSavingApproval(false);
      return;
    }

    const updatedRequest: VZRequest = {
      ...selectedRequest,
      request_status: "approved",
      updated_at: approvedAt,
    };

    setRequests((current) =>
      current.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request,
      ),
    );

    setSelectedRequest(updatedRequest);

    if (approvalEvent) {
      setTruthEvents((current) => [
        approvalEvent as VZTruthEvent,
        ...current.filter(
          (event) =>
            !(
              event.request_id === selectedRequest.id &&
              event.event_type === "customer_approved"
            ),
        ),
      ]);
    }

    setSavingApproval(false);
  }

  async function saveAndSendEstimate() {
    if (!selectedRequest || savingEstimate) return;

    const numericAmount = Number(estimateAmount);

    if (
      !estimateAmount.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount < 0
    ) {
      setEstimateError("Enter a valid estimate amount.");
      return;
    }

    setEstimateError("");
    setSavingEstimate(true);

    const sentAt = new Date().toISOString();
    const cleanNotes = estimateNotes.trim();

    const { error: requestError } = await supabase
      .from("vz_lawncare_requests")
      .update({
        estimate_amount: numericAmount,
        estimate_notes: cleanNotes || null,
        estimate_sent_at: sentAt,
        request_status: "estimate_sent",
        updated_at: sentAt,
      })
      .eq("id", selectedRequest.id)
      .eq("business_slug", BUSINESS_SLUG);

    if (requestError) {
      console.error("Could not save V&Z estimate:", requestError);
      setEstimateError(requestError.message);
      setSavingEstimate(false);
      return;
    }

    const formattedAmount = numericAmount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    const { data: truthEvent, error: truthError } = await supabase
      .from("vz_lawncare_truth_events")
      .upsert(
        {
          request_id: selectedRequest.id,
          business_slug: BUSINESS_SLUG,
          event_type: "estimate_sent",
          event_label: "Estimate sent",
          event_detail: `${formattedAmount} estimate sent to ${selectedRequest.customer_name}.`,
          event_meta: {
            estimate_amount: numericAmount,
            estimate_notes: cleanNotes || null,
            delivery_method: "text",
          },
          created_at: sentAt,
        },
        {
          onConflict: "request_id,event_type",
        },
      )
      .select("*")
      .single();

    if (truthError) {
      console.error("Could not record V&Z estimate event:", truthError);
      setEstimateError(
        "The estimate was saved, but the Truth Chain event could not be recorded.",
      );
      setSavingEstimate(false);
      return;
    }

    const updatedRequest: VZRequest = {
      ...selectedRequest,
      estimate_amount: numericAmount,
      estimate_notes: cleanNotes || null,
      estimate_sent_at: sentAt,
      request_status: "estimate_sent",
      updated_at: sentAt,
    };

    setRequests((current) =>
      current.map((request) =>
        request.id === updatedRequest.id ? updatedRequest : request,
      ),
    );

    setSelectedRequest(updatedRequest);

    if (truthEvent) {
      setTruthEvents((current) => [
        truthEvent as VZTruthEvent,
        ...current.filter(
          (event) =>
            !(
              event.request_id === selectedRequest.id &&
              event.event_type === "estimate_sent"
            ),
        ),
      ]);
    }

    const customerMessage = [
      `Hi ${selectedRequest.customer_name}, this is Eric with V&Z Professional Lawncare.`,
      "",
      `Your estimate for ${selectedRequest.service_needed} is ${formattedAmount}.`,
      cleanNotes ? `Estimate details: ${cleanNotes}` : "",
      "",
      "Let me know if you would like to approve the estimate and schedule the work.",
    ]
      .filter(Boolean)
      .join("\n");

    setSavingEstimate(false);

    const customerNumber = phoneHref(selectedRequest.phone);

    if (customerNumber) {
      window.location.href = `sms:${customerNumber}?body=${encodeURIComponent(
        customerMessage,
      )}`;
    }
  }

  return (
    <main className="min-h-screen bg-black px-3 py-4 text-white sm:px-6 sm:py-7">
      <section className="mx-auto w-full max-w-6xl">
        <header className="overflow-hidden rounded-[1.8rem] border border-[#7CFC00]/20 bg-gradient-to-br from-[#102313] via-[#080b08] to-black p-5 shadow-2xl shadow-black/50 sm:rounded-[2rem] sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[#7CFC00]">
                <Leaf size={17} />
                <p className="text-xs font-black uppercase tracking-[0.28em]">
                  V&Z Professional Lawncare
                </p>
              </div>

              <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl">
                Customer Intelligence
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/55 sm:text-base">
                Real customer requests, estimates, scheduled work, proof, payment,
                and outcomes will stay connected here.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto">
              <button
                type="button"
                disabled
                title="Live Activity will be connected after the customer workflow."
                className="inline-flex min-h-[54px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-[#7CFC00]/20 bg-[#7CFC00]/10 px-6 text-center text-sm font-black uppercase tracking-[0.16em] text-[#B9FF79] opacity-60 sm:w-auto"
              >
                <Activity size={18} />
                Open Live Activity
              </button>

              <button
                type="button"
                onClick={() => void loadBoard(true)}
                disabled={refreshing}
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 text-xs font-black uppercase tracking-[0.14em] text-white/55 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">
              Could not load V&Z customer intelligence: {errorMessage}
            </div>
          ) : null}

          <details className="group mt-5 rounded-[1.4rem] border border-white/10 bg-white/[0.035]">
            <summary className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7CFC00]">
                  Business Quick Replies
                </p>

                <p className="mt-1 text-sm font-semibold text-white/50">
                  Ready-to-copy replies for Facebook, Messenger, and text.
                </p>
              </div>

              <span className="shrink-0 text-2xl font-light text-white/40 transition group-open:rotate-45">
                +
              </span>
            </summary>

            <div className="border-t border-white/10 p-3 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {quickReplies.map((item) => {
                  const copied = copiedLabel === item.label;

                  return (
                    <article
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-black/45 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-white">{item.label}</p>
                          <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-6 text-white/45">
                            {item.reply}
                          </p>
                        </div>

                        <MessageCircle
                          size={17}
                          className="mt-1 shrink-0 text-[#7CFC00]"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => void copyReply(item.label, item.reply)}
                        className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#7CFC00]/25 bg-[#7CFC00]/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#C8FF98]"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copied" : "Copy Reply"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          </details>

          <details className="group mt-4 rounded-[1.4rem] border border-white/10 bg-white/[0.035]">
            <summary className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 sm:px-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#7CFC00]">
                  Truth Chain
                </p>
                <p className="mt-1 text-sm font-semibold text-white/50">
                  Real recorded milestones from request to completed outcome.
                </p>
              </div>

              <span className="shrink-0 text-2xl font-light text-white/40 transition group-open:rotate-45">
                +
              </span>
            </summary>

            <div className="border-t border-white/10 p-4 sm:p-5">
              {recentTruthEvents.length ? (
                <div className="space-y-3">
                  {recentTruthEvents.map((event) => (
                    <div
                      key={event.id}
                      className="grid grid-cols-[38px_1fr] gap-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#7CFC00]/25 bg-[#7CFC00]/10 text-[10px] font-black text-[#C8FF98]">
                        <Check size={15} />
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-black text-white">
                              {event.event_label}
                            </p>
                            <p className="mt-1 text-xs font-bold text-[#7CFC00]/70">
                              {requestName(event.request_id)}
                            </p>
                          </div>

                          <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/30">
                            {formatEventTime(event.created_at)}
                          </span>
                        </div>

                        {event.event_detail ? (
                          <p className="mt-2 text-sm leading-6 text-white/45">
                            {event.event_detail}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#7CFC00]/20 bg-black/30 px-5 py-7 text-center">
                  <p className="text-base font-black text-white">
                    No truth signals recorded yet
                  </p>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
                    The first real V&Z customer request will begin the Truth
                    Chain. No demo events will appear here.
                  </p>
                </div>
              )}
            </div>
          </details>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-black/35 p-4"
              >
                <div className="text-3xl font-black text-[#7CFC00]">
                  {metric.value}
                </div>

                <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </header>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0b100b] p-2">
          <button
            type="button"
            onClick={() => setShowArchived(false)}
            className={`min-h-[42px] flex-1 rounded-lg px-3 text-xs font-black uppercase tracking-[0.13em] transition ${
              !showArchived
                ? "bg-[#7CFC00] text-black"
                : "text-white/45 hover:bg-white/[0.05]"
            }`}
          >
            Working List
          </button>

          <button
            type="button"
            onClick={() => setShowArchived(true)}
            className={`min-h-[42px] flex-1 rounded-lg px-3 text-xs font-black uppercase tracking-[0.13em] transition ${
              showArchived
                ? "bg-[#7CFC00] text-black"
                : "text-white/45 hover:bg-white/[0.05]"
            }`}
          >
            Archived ({archivedRequests.length})
          </button>
        </div>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.8rem] border border-white/10 bg-[#090b09] p-4 sm:p-6">
            <div className="flex items-center gap-2 text-[#7CFC00]">
              <Send size={17} />
              <p className="text-xs font-black uppercase tracking-[0.28em]">
                Active Customer Signals
              </p>
            </div>

            <div className="mt-5">{loading ? (
                <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/35">
                  <div className="text-center">
                    <LoaderCircle
                      className="mx-auto animate-spin text-[#7CFC00]"
                      size={25}
                    />
                    <p className="mt-3 text-sm font-bold text-white/45">
                      Loading real requests
                    </p>
                  </div>
                </div>
              ) : visibleRequests.length ? (
                <div className="space-y-3">
                  {visibleRequests.map((request) => (
                    <article
                      key={request.id}
                      className="rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-[#7CFC00]/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="truncate text-xl font-black text-white">
                            {request.customer_name}
                          </h2>

                          <p className="mt-1 font-black text-[#7CFC00]">
                            {request.service_needed}
                          </p>

                          <p className="mt-1 text-sm text-white/45">
                            {request.property_location ||
                              "Property location not provided"}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full border border-[#7CFC00]/20 bg-[#7CFC00]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] text-[#C8FF98]">
                          {humanizeStatus(request.request_status)}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-2 text-sm text-white/55 sm:grid-cols-2">
                        <p>
                          Property:{" "}
                          <span className="font-bold text-white/75">
                            {request.property_type || "Not provided"}
                          </span>
                        </p>

                        <p>
                          Timing:{" "}
                          <span className="font-bold text-white/75">
                            {request.preferred_timing || "Flexible"}
                          </span>
                        </p>

                        <p>
                          Condition:{" "}
                          <span className="font-bold text-white/75">
                            {request.yard_condition || "Not provided"}
                          </span>
                        </p>

                        <p>
                          Received:{" "}
                          <span className="font-bold text-white/75">
                            {formatEventTime(request.created_at)}
                          </span>
                        </p>
                      </div>

                      <div className="mt-4 rounded-xl border border-[#7CFC00]/15 bg-[#7CFC00]/[0.06] px-3 py-3 text-sm font-bold text-[#D8FFB5]">
                        Next move: {nextMoveForStatus(request.request_status)}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedRequest(request)}
                        className="mt-3 inline-flex min-h-[46px] w-full items-center justify-center rounded-xl border border-[#7CFC00]/25 bg-[#7CFC00]/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#C8FF98] transition hover:bg-[#7CFC00]/15"
                      >
                        Open Customer
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/35 px-5 py-7 text-center">
                  <p className="text-lg font-black">No active requests yet</p>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
                    Real estimate requests from the V&Z Live Page will appear
                    here. Selecting one will open Eric's customer work drawer.
                  </p>
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-[1.8rem] border border-white/10 bg-[#0b100b] p-5">
            <div className="flex items-center gap-2 text-[#7CFC00]">
              <Sparkles size={17} />
              <p className="text-xs font-black uppercase tracking-[0.28em]">
                Live Suggestions
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
                <h2 className="font-black">
                  Property photos improve estimates.
                </h2>
                <p className="mt-1 text-sm leading-6 text-white/45">
                  Ask for clear lawn, access, and problem-area photos before
                  confirming larger work.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
                <h2 className="font-black">
                  Separate route work from one-time jobs.
                </h2>
                <p className="mt-1 text-sm leading-6 text-white/45">
                  Recurring mowing opportunities should be identified before the
                  estimate is closed.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
                <h2 className="font-black">
                  Keep the proof with the customer.
                </h2>
                <p className="mt-1 text-sm leading-6 text-white/45">
                  Before and after photos will stay connected to the same request
                  and Truth Chain.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </section>

      {selectedRequest ? (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/75 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close customer drawer"
            onClick={() => setSelectedRequest(null)}
            className="absolute inset-0 cursor-default"
          />

          <aside className="relative z-10 h-full w-full max-w-xl overflow-y-auto border-l border-[#7CFC00]/20 bg-[#080b08] shadow-2xl shadow-black">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#080b08] px-5 py-5">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7CFC00]">
                  Customer Work Drawer
                </p>

                <h2 className="mt-2 truncate text-3xl font-black tracking-[-0.035em] text-white">
                  {selectedRequest.customer_name}
                </h2>

                <p className="mt-1 font-black text-[#7CFC00]">
                  {selectedRequest.service_needed}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5 pb-12">
              <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
                    Request Status
                  </p>

                  <span className="rounded-full border border-[#7CFC00]/20 bg-[#7CFC00]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] text-[#C8FF98]">
                    {humanizeStatus(selectedRequest.request_status)}
                  </span>
                </div>

                {selectedRequest.request_status === "new" ? (
                  <button
                    type="button"
                    onClick={() => void markRequestReviewing()}
                    disabled={updatingRequest}
                    className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#7CFC00] px-4 text-xs font-black uppercase tracking-[0.15em] text-black disabled:cursor-wait disabled:opacity-60"
                  >
                    {updatingRequest ? "Updating..." : "Mark As Reviewing"}
                  </button>
                ) : null}
              </section>

              <section className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${phoneHref(selectedRequest.phone)}`}
                  className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-[#7CFC00] px-4 text-sm font-black uppercase tracking-[0.12em] text-black"
                >
                  <Phone size={18} />
                  Call
                </a>

                <a
                  href={`sms:${phoneHref(selectedRequest.phone)}`}
                  className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl border border-[#7CFC00]/30 bg-[#7CFC00]/10 px-4 text-sm font-black uppercase tracking-[0.12em] text-[#C8FF98]"
                >
                  <MessageCircle size={18} />
                  Text
                </a>
              </section>

              <details
                open={openDrawerSection === "contact"}
                className="group rounded-2xl border border-white/10 bg-white/[0.035]"
              >
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenDrawerSection((current) =>
                      current === "contact" ? "" : "contact",
                    );
                  }}
                  className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7CFC00]">
                      Customer Contact
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="max-w-[150px] truncate text-xs font-black text-white/50">
                      {formatPhone(selectedRequest.phone)}
                    </span>
                    <ChevronDown
                      size={17}
                      className={`text-white/35 transition-transform ${
                        openDrawerSection === "contact" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </summary>

                <div className="px-3 pb-3">
              <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="sr-only">
                  Customer Contact
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-white/35">Phone</p>
                    <p className="mt-1 font-bold text-white">
                      {formatPhone(selectedRequest.phone)}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35">Email</p>
                    <p className="mt-1 break-all font-bold text-white">
                      {selectedRequest.email || "No email provided"}
                    </p>
                  </div>
                </div>
              </section>
                </div>
              </details>

              <details
                open={openDrawerSection === "property"}
                className="group rounded-2xl border border-white/10 bg-white/[0.035]"
              >
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenDrawerSection((current) =>
                      current === "property" ? "" : "property",
                    );
                  }}
                  className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7CFC00]">
                      Property Request
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="max-w-[150px] truncate text-xs font-black text-white/50">
                      {selectedRequest.property_location || "View details"}
                    </span>
                    <ChevronDown
                      size={17}
                      className={`text-white/35 transition-transform ${
                        openDrawerSection === "property" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </summary>

                <div className="px-3 pb-3">
              <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <p className="sr-only">
                  Property Request
                </p>

                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-white/35">Property location</p>
                    <p className="mt-1 font-bold leading-6 text-white">
                      {selectedRequest.property_location ||
                        "No property location provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35">Property type</p>
                    <p className="mt-1 font-bold text-white">
                      {selectedRequest.property_type || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35">Yard condition</p>
                    <p className="mt-1 font-bold text-white">
                      {selectedRequest.yard_condition || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35">Preferred timing</p>
                    <p className="mt-1 font-bold text-white">
                      {selectedRequest.preferred_timing || "Flexible"}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35">Customer details</p>
                    <p className="mt-1 whitespace-pre-wrap font-bold leading-6 text-white">
                      {selectedRequest.customer_notes ||
                        "No additional details provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-white/35">Access notes</p>
                    <p className="mt-1 whitespace-pre-wrap font-bold leading-6 text-white">
                      {selectedRequest.access_notes ||
                        "No access notes provided"}
                    </p>
                  </div>
                </div>
              </section>
                </div>
              </details>

              <details
                open={openDrawerSection === "estimate"}
                className="group rounded-2xl border border-white/10 bg-white/[0.035]"
              >
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenDrawerSection((current) =>
                      current === "estimate" ? "" : "estimate",
                    );
                  }}
                  className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7CFC00]">
                      Customer Estimate
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="max-w-[150px] truncate text-xs font-black text-white/50">
                      {selectedRequest.estimate_amount !== null
                        ? `$${Number(selectedRequest.estimate_amount).toFixed(2)}`
                        : "Not sent"}
                    </span>
                    <ChevronDown
                      size={17}
                      className={`text-white/35 transition-transform ${
                        openDrawerSection === "estimate" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </summary>

                <div className="px-3 pb-3">
              <section className="rounded-2xl border border-[#7CFC00]/20 bg-[#7CFC00]/[0.05] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="sr-only">
                      Customer Estimate
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/45">
                      Save the estimate to this customer and open a ready-to-send
                      text message.
                    </p>
                  </div>

                  {selectedRequest.estimate_sent_at ? (
                    <span className="shrink-0 rounded-full border border-[#7CFC00]/20 bg-[#7CFC00]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#C8FF98]">
                      Sent
                    </span>
                  ) : null}
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                    Estimate amount
                  </span>

                  <div className="flex min-h-[54px] items-center rounded-xl border border-white/10 bg-black/50 px-4 focus-within:border-[#7CFC00]/50">
                    <span className="mr-2 font-black text-[#7CFC00]">$</span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={estimateAmount}
                      onChange={(event) => setEstimateAmount(event.target.value)}
                      placeholder="0.00"
                      className="min-w-0 flex-1 bg-transparent text-lg font-black text-white outline-none placeholder:text-white/20"
                    />
                  </div>
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                    Estimate notes
                  </span>

                  <textarea
                    rows={4}
                    value={estimateNotes}
                    onChange={(event) => setEstimateNotes(event.target.value)}
                    placeholder="Describe what is included, recurring service details, cleanup, materials, or anything the customer should know."
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-bold leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#7CFC00]/50"
                  />
                </label>

                {estimateError ? (
                  <div className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-100">
                    {estimateError}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => void saveAndSendEstimate()}
                  disabled={savingEstimate}
                  className="mt-4 inline-flex min-h-[54px] w-full items-center justify-center rounded-xl bg-[#7CFC00] px-4 text-xs font-black uppercase tracking-[0.15em] text-black disabled:cursor-wait disabled:opacity-60"
                >
                  {savingEstimate
                    ? "Saving Estimate..."
                    : selectedRequest.estimate_sent_at
                      ? "Update And Resend Estimate"
                      : "Save And Send Estimate"}
                </button>

                {selectedRequest.estimate_sent_at ? (
                  <p className="mt-3 text-center text-xs font-bold text-white/35">
                    Last sent {formatEventTime(selectedRequest.estimate_sent_at)}
                  </p>
                ) : null}
              </section>
                </div>
              </details>

              <details
                open={openDrawerSection === "approval"}
                className="group rounded-2xl border border-white/10 bg-white/[0.035]"
              >
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenDrawerSection((current) =>
                      current === "approval" ? "" : "approval",
                    );
                  }}
                  className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7CFC00]">
                      Customer Approval
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-black text-white/50">
                      {truthEvents.some(
                        (event) =>
                          event.request_id === selectedRequest.id &&
                          event.event_type === "customer_approved",
                      )
                        ? "Approved"
                        : "Needs approval"}
                    </span>
                    <ChevronDown
                      size={17}
                      className={`text-white/35 transition-transform ${
                        openDrawerSection === "approval" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </summary>

                <div className="px-3 pb-3">
              <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="sr-only">
                      Customer Approval
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/45">
                      Record approval after the customer confirms they want to
                      move forward with the estimate.
                    </p>
                  </div>

                  {selectedRequest.request_status === "approved" ? (
                    <span className="shrink-0 rounded-full border border-[#7CFC00]/20 bg-[#7CFC00]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#C8FF98]">
                      Approved
                    </span>
                  ) : null}
                </div>

                {approvalError ? (
                  <div className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-100">
                    {approvalError}
                  </div>
                ) : null}

                {selectedRequest.request_status === "estimate_sent" ? (
                  <button
                    type="button"
                    onClick={() => void markCustomerApproved()}
                    disabled={savingApproval}
                    className="mt-4 inline-flex min-h-[54px] w-full items-center justify-center rounded-xl bg-[#7CFC00] px-4 text-xs font-black uppercase tracking-[0.15em] text-black disabled:cursor-wait disabled:opacity-60"
                  >
                    {savingApproval
                      ? "Recording Approval..."
                      : "Mark Customer Approved"}
                  </button>
                ) : selectedRequest.request_status === "approved" ? (
                  <div className="mt-4 rounded-xl border border-[#7CFC00]/20 bg-[#7CFC00]/[0.07] px-4 py-4 text-sm font-bold leading-6 text-[#D8FFB5]">
                    Customer approval is recorded. The next step is scheduling
                    the work.
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-sm font-bold leading-6 text-white/40">
                    Send the estimate before recording customer approval.
                  </div>
                )}
              </section>
                </div>
              </details>

              <details
                open={openDrawerSection === "scheduling"}
                className="group rounded-2xl border border-white/10 bg-white/[0.035]"
              >
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenDrawerSection((current) =>
                      current === "scheduling" ? "" : "scheduling",
                    );
                  }}
                  className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7CFC00]">
                      Job Scheduling
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="max-w-[150px] truncate text-xs font-black text-white/50">
                      {selectedRequest.scheduled_for
                        ? formatScheduledTime(selectedRequest.scheduled_for)
                        : "Not scheduled"}
                    </span>
                    <ChevronDown
                      size={17}
                      className={`text-white/35 transition-transform ${
                        openDrawerSection === "scheduling" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </summary>

                <div className="px-3 pb-3">
              <section className="rounded-2xl border border-[#7CFC00]/20 bg-[#7CFC00]/[0.05] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="sr-only">
                      Job Scheduling
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/45">
                      Choose the service date and keep the scheduling details
                      attached to this customer.
                    </p>
                  </div>

                  {selectedRequest.scheduled_for ? (
                    <span className="shrink-0 rounded-full border border-[#7CFC00]/20 bg-[#7CFC00]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#C8FF98]">
                      Scheduled
                    </span>
                  ) : null}
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                    Service date and time
                  </span>

                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(event) => setScheduledFor(event.target.value)}
                    className="min-h-[54px] w-full rounded-xl border border-white/10 bg-black/50 px-4 text-sm font-black text-white outline-none focus:border-[#7CFC00]/50"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/45">
                    Scheduling notes
                  </span>

                  <textarea
                    rows={4}
                    value={schedulingNotes}
                    onChange={(event) => setSchedulingNotes(event.target.value)}
                    placeholder="Gate instructions, arrival window, equipment, customer requests, or anything Eric should remember."
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm font-bold leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#7CFC00]/50"
                  />
                </label>

                {schedulingError ? (
                  <div className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-100">
                    {schedulingError}
                  </div>
                ) : null}

                {selectedRequest.request_status === "approved" ||
                selectedRequest.request_status === "scheduled" ? (
                  <button
                    type="button"
                    onClick={() => void saveJobSchedule()}
                    disabled={savingSchedule}
                    className="mt-4 inline-flex min-h-[54px] w-full items-center justify-center rounded-xl bg-[#7CFC00] px-4 text-xs font-black uppercase tracking-[0.15em] text-black disabled:cursor-wait disabled:opacity-60"
                  >
                    {savingSchedule
                      ? "Saving Schedule..."
                      : selectedRequest.scheduled_for
                        ? "Update Schedule"
                        : "Save Schedule"}
                  </button>
                ) : (
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-sm font-bold leading-6 text-white/40">
                    Record customer approval before scheduling the work.
                  </div>
                )}

                {selectedRequest.scheduled_for ? (
                  <div className="mt-4 rounded-xl border border-[#7CFC00]/20 bg-black/35 px-4 py-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/35">
                      Scheduled service
                    </p>

                    <p className="mt-2 font-black leading-6 text-[#D8FFB5]">
                      {formatScheduledTime(selectedRequest.scheduled_for)}
                    </p>
                  </div>
                ) : null}
              </section>
                </div>
              </details>

              <details
                open={openDrawerSection === "active"}
                className="group rounded-2xl border border-white/10 bg-white/[0.035]"
              >
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenDrawerSection((current) =>
                      current === "active" ? "" : "active",
                    );
                  }}
                  className="flex min-h-[62px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7CFC00]">
                      Active Work
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-black text-[#C8FF98]">
                      {humanizeStatus(selectedRequest.request_status)}
                    </span>
                    <ChevronDown
                      size={17}
                      className={`text-white/35 transition-transform ${
                        openDrawerSection === "active" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </summary>

                <div className="px-3 pb-3">
              <section className="rounded-2xl border border-[#7CFC00]/20 bg-[#7CFC00]/[0.05] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="sr-only">
                      Active Work
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/45">
                      {selectedRequest.request_status === "completed"
                        ? "Review the completed work and the saved before-and-after proof."
                        : "Start the job and keep the property condition documented before the work begins."}
                    </p>
                  </div>

                  {selectedRequest.request_status === "in_progress" ? (
                    <span className="shrink-0 rounded-full border border-[#7CFC00]/20 bg-[#7CFC00]/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#C8FF98]">
                      In Progress
                    </span>
                  ) : null}
                </div>

                {workError ? (
                  <div className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-100">
                    {workError}
                  </div>
                ) : null}

                {selectedRequest.request_status === "scheduled" ? (
                  <button
                    type="button"
                    onClick={() => void startJob()}
                    disabled={startingJob}
                    className="mt-4 inline-flex min-h-[54px] w-full items-center justify-center rounded-xl bg-[#7CFC00] px-4 text-xs font-black uppercase tracking-[0.15em] text-black disabled:cursor-wait disabled:opacity-60"
                  >
                    {startingJob ? "Starting Job..." : "Start Job"}
                  </button>
                ) : selectedRequest.request_status === "in_progress" ? (
                  <div className="mt-4 rounded-xl border border-[#7CFC00]/20 bg-black/35 px-4 py-4 text-sm font-bold leading-6 text-[#D8FFB5]">
                    The job is active. Add the before photos before completing
                    the work.
                  </div>
                ) : selectedRequest.request_status === "completed" ? (
                  <div className="mt-4 rounded-xl border border-[#7CFC00]/20 bg-[#7CFC00]/[0.07] px-4 py-4 text-sm font-bold leading-6 text-[#D8FFB5]">
                    Work is complete. The before photos, after photos, and
                    completed outcome are saved with this customer.
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-sm font-bold leading-6 text-white/40">
                    Schedule the job before starting the work.
                  </div>
                )}

                <div className="mt-5 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/65">
                        Before Photos
                      </p>

                      <p className="mt-1 text-sm leading-6 text-white/40">
                        Document the property before mowing, trimming, cleanup,
                        or other work begins.
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/50">
                      {
                        photos.filter(
                          (photo) => photo.photo_type === "before",
                        ).length
                      }{" "}
                      Saved
                    </span>
                  </div>

                  {selectedRequest.request_status === "in_progress" ? (
                    <>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <label
                        className={`flex min-h-[54px] items-center justify-center rounded-xl px-4 text-center text-xs font-black uppercase tracking-[0.15em] transition ${
                          selectedRequest.request_status === "in_progress" &&
                          !uploadingBeforePhotos
                            ? "cursor-pointer bg-[#7CFC00] text-black"
                            : "cursor-not-allowed bg-white/[0.05] text-white/25"
                        }`}
                      >
                        {uploadingBeforePhotos
                          ? "Uploading Photo..."
                          : "Take Job Photo"}
  
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          disabled={
                            selectedRequest.request_status !== "in_progress" ||
                            uploadingBeforePhotos
                          }
                          onChange={(event) => {
                            void uploadBeforePhotos(event.target.files);
                            event.currentTarget.value = "";
                          }}
                          className="sr-only"
                        />
                      </label>
  
                      <label
                        className={`flex min-h-[54px] items-center justify-center rounded-xl border px-4 text-center text-xs font-black uppercase tracking-[0.15em] transition ${
                          selectedRequest.request_status === "in_progress" &&
                          !uploadingBeforePhotos
                            ? "cursor-pointer border-[#7CFC00]/30 bg-[#7CFC00]/10 text-[#C8FF98]"
                            : "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/25"
                        }`}
                      >
                        Choose Existing Photos
  
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                          disabled={
                            selectedRequest.request_status !== "in_progress" ||
                            uploadingBeforePhotos
                          }
                          onChange={(event) => {
                            void uploadBeforePhotos(event.target.files);
                            event.currentTarget.value = "";
                          }}
                          className="sr-only"
                        />
                      </label>
                    </div>
  
                    <p className="mt-2 text-xs font-bold leading-5 text-white/35">
                      Direct camera upload. Photos are compressed before being
                      stored with this job.
                    </p>
                    </>
                  ) : selectedRequest.request_status === "completed" ||
                    selectedRequest.request_status === "archived" ? null : (
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-sm font-bold leading-6 text-white/40">
                      Schedule and start the job to unlock the camera and photo
                      uploads.
                    </div>
                  )}

                  {photoError ? (
                    <div className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-100">
                      {photoError}
                    </div>
                  ) : null}

                  {loadingPhotos ? (
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-5 text-center text-sm font-bold text-white/40">
                      Loading customer photos...
                    </div>
                  ) : photos.filter(
                      (photo) => photo.photo_type === "before",
                    ).length ? (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {photos
                        .filter((photo) => photo.photo_type === "before")
                        .map((photo) => (
                          <div
                            key={photo.id}
                            className="overflow-hidden rounded-xl border border-white/10 bg-black/40"
                          >
                            {photo.signed_url ? (
                              <img
                                src={photo.signed_url}
                                alt="Property before work"
                                className="aspect-square w-full object-cover"
                              />
                            ) : (
                              <div className="flex aspect-square items-center justify-center px-3 text-center text-xs font-bold text-white/35">
                                Private photo saved
                              </div>
                            )}

                            <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/35">
                              Before photo
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/25 px-4 py-5 text-center text-sm font-bold text-white/35">
                      No before photos saved yet.
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/65">
                        After Photos
                      </p>

                      <p className="mt-1 text-sm leading-6 text-white/40">
                        Record the finished property before closing the work.
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/50">
                      {
                        photos.filter(
                          (photo) => photo.photo_type === "after",
                        ).length
                      }{" "}
                      Saved
                    </span>
                  </div>

                  {selectedRequest.request_status === "in_progress" ? (
                    <>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <label
                        className={`flex min-h-[54px] items-center justify-center rounded-xl px-4 text-center text-xs font-black uppercase tracking-[0.15em] transition ${
                          selectedRequest.request_status === "in_progress" &&
                          !uploadingAfterPhotos
                            ? "cursor-pointer bg-[#7CFC00] text-black"
                            : "cursor-not-allowed bg-white/[0.05] text-white/25"
                        }`}
                      >
                        {uploadingAfterPhotos
                          ? "Uploading Photo..."
                          : "Take Job Photo"}
  
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          disabled={
                            selectedRequest.request_status !== "in_progress" ||
                            uploadingAfterPhotos
                          }
                          onChange={(event) => {
                            void uploadAfterPhotos(event.target.files);
                            event.currentTarget.value = "";
                          }}
                          className="sr-only"
                        />
                      </label>
  
                      <label
                        className={`flex min-h-[54px] items-center justify-center rounded-xl border px-4 text-center text-xs font-black uppercase tracking-[0.15em] transition ${
                          selectedRequest.request_status === "in_progress" &&
                          !uploadingAfterPhotos
                            ? "cursor-pointer border-[#7CFC00]/30 bg-[#7CFC00]/10 text-[#C8FF98]"
                            : "cursor-not-allowed border-white/10 bg-white/[0.03] text-white/25"
                        }`}
                      >
                        Choose Existing Photos
  
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                          disabled={
                            selectedRequest.request_status !== "in_progress" ||
                            uploadingAfterPhotos
                          }
                          onChange={(event) => {
                            void uploadAfterPhotos(event.target.files);
                            event.currentTarget.value = "";
                          }}
                          className="sr-only"
                        />
                      </label>
                    </div>
  
                    <p className="mt-2 text-xs font-bold leading-5 text-white/35">
                      Direct camera upload. Photos are compressed before being
                      stored with this job.
                    </p>
                    </>
                  ) : selectedRequest.request_status === "completed" ||
                    selectedRequest.request_status === "archived" ? null : (
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-sm font-bold leading-6 text-white/40">
                      Schedule and start the job to unlock the camera and photo
                      uploads.
                    </div>
                  )}

                  {photos.filter(
                    (photo) => photo.photo_type === "after",
                  ).length ? (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {photos
                        .filter((photo) => photo.photo_type === "after")
                        .map((photo) => (
                          <div
                            key={photo.id}
                            className="overflow-hidden rounded-xl border border-white/10 bg-black/40"
                          >
                            {photo.signed_url ? (
                              <img
                                src={photo.signed_url}
                                alt="Property after work"
                                className="aspect-square w-full object-cover"
                              />
                            ) : (
                              <div className="flex aspect-square items-center justify-center px-3 text-center text-xs font-bold text-white/35">
                                Private photo saved
                              </div>
                            )}

                            <p className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/35">
                              After photo
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/25 px-4 py-5 text-center text-sm font-bold text-white/35">
                      No after photos saved yet.
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/65">
                    Complete Work
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    Close the active job after the finished property has been
                    documented.
                  </p>

                  {completionError ? (
                    <div className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-100">
                      {completionError}
                    </div>
                  ) : null}

                  {selectedRequest.request_status === "in_progress" ? (
                    <button
                      type="button"
                      onClick={() => void completeWork()}
                      disabled={completingWork}
                      className="mt-4 inline-flex min-h-[54px] w-full items-center justify-center rounded-xl bg-[#7CFC00] px-4 text-xs font-black uppercase tracking-[0.15em] text-black disabled:cursor-wait disabled:opacity-60"
                    >
                      {completingWork
                        ? "Completing Work..."
                        : "Complete Work"}
                    </button>
                  ) : selectedRequest.request_status === "completed" ? (
                    <div className="mt-4 rounded-xl border border-[#7CFC00]/20 bg-[#7CFC00]/[0.07] px-4 py-4 text-sm font-bold leading-6 text-[#D8FFB5]">
                      Work completed. The before photos, after photos, and
                      completed outcome are saved with this customer.
                    </div>
                  ) : null}
                </div>
              </section>
                </div>
              </details>              <details className="group rounded-2xl border border-white/10 bg-white/[0.025]">
                <summary className="flex min-h-[68px] cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
                      Customer Closeout
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {truthEvents.some(
                        (event) =>
                          event.request_id === selectedRequest.id &&
                          event.event_type === "outcome_closed",
                      )
                        ? "Closed"
                        : selectedRequest.request_status === "completed"
                          ? "Ready"
                          : "Complete the work first"}
                    </p>
                  </div>

                  <ChevronDown className="h-5 w-5 shrink-0 text-white/35 transition-transform group-open:rotate-180" />
                </summary>

                <div className="border-t border-white/10 px-4 pb-4 pt-4">
                  <p className="text-sm leading-6 text-white/40">
                    Finish payment, customer proof, review follow-up, and the
                    final outcome.
                  </p>

                  {closeoutError ? (
                    <div className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-100">
                      {closeoutError}
                    </div>
                  ) : null}

                  <div className="mt-4 grid gap-3">
                    <button
                      type="button"
                      onClick={() => void sendPaymentRequest()}
                      disabled={
                        selectedRequest.request_status !== "completed" ||
                        Boolean(closeoutAction) ||
                        truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "payment_sent",
                        )
                      }
                      className="inline-flex min-h-[52px] items-center justify-between rounded-xl border border-white/12 bg-white/[0.04] px-4 text-left text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>Text Payment Request</span>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#A8FF60]">
                        {truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "payment_sent",
                        )
                          ? "Sent"
                          : closeoutAction === "payment_sent"
                            ? "Saving..."
                            : "Next"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => void markPaymentReceived()}
                      disabled={
                        Boolean(closeoutAction) ||
                        !truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "payment_sent",
                        ) ||
                        truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "payment_received",
                        )
                      }
                      className="inline-flex min-h-[52px] items-center justify-between rounded-xl border border-white/12 bg-white/[0.04] px-4 text-left text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>Mark Payment Received</span>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#A8FF60]">
                        {truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "payment_received",
                        )
                          ? "Received"
                          : closeoutAction === "payment_received"
                            ? "Saving..."
                            : "Next"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => void sendCompletionProof()}
                      disabled={
                        Boolean(closeoutAction) ||
                        !truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "payment_received",
                        ) ||
                        truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "proof_sent",
                        )
                      }
                      className="inline-flex min-h-[52px] items-center justify-between rounded-xl border border-white/12 bg-white/[0.04] px-4 text-left text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>Text Completion Proof</span>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#A8FF60]">
                        {truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "proof_sent",
                        )
                          ? "Sent"
                          : closeoutAction === "proof_sent"
                            ? "Saving..."
                            : "Next"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => void requestCustomerReview()}
                      disabled={
                        Boolean(closeoutAction) ||
                        !truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "proof_sent",
                        ) ||
                        truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "review_requested",
                        )
                      }
                      className="inline-flex min-h-[52px] items-center justify-between rounded-xl border border-white/12 bg-white/[0.04] px-4 text-left text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>Request Customer Review</span>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#A8FF60]">
                        {truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "review_requested",
                        )
                          ? "Requested"
                          : closeoutAction === "review_requested"
                            ? "Saving..."
                            : "Next"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => void closeCustomerOutcome()}
                      disabled={
                        Boolean(closeoutAction) ||
                        !truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "review_requested",
                        ) ||
                        truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "outcome_closed",
                        )
                      }
                      className="inline-flex min-h-[54px] items-center justify-between rounded-xl border border-[#7CFC00]/25 bg-[#7CFC00]/10 px-4 text-left text-sm font-black text-[#D8FFB5] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>Close Customer Outcome</span>
                      <span className="text-xs uppercase tracking-[0.12em] text-[#A8FF60]">
                        {truthEvents.some(
                          (event) =>
                            event.request_id === selectedRequest.id &&
                            event.event_type === "outcome_closed",
                        )
                          ? "Closed"
                          : closeoutAction === "outcome_closed"
                            ? "Closing..."
                            : "Finish"}
                      </span>
                    </button>
                  </div>

                  {truthEvents.some(
                    (event) =>
                      event.request_id === selectedRequest.id &&
                      event.event_type === "outcome_closed",
                  ) ? (
                    <div className="mt-4 rounded-xl border border-[#7CFC00]/20 bg-[#7CFC00]/[0.07] px-4 py-4 text-sm font-bold leading-6 text-[#D8FFB5]">
                      Customer outcome closed. Archive the record whenever it is
                      no longer needed in the working list.
                    </div>
                  ) : null}
                </div>
              </details>

              <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
                  Record Actions
                </p>

                <p className="mt-2 text-sm leading-6 text-white/35">
                  Archive finished records or permanently remove a duplicate or
                  mistake.
                </p>

                {recordActionError ? (
                  <div className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-bold leading-6 text-red-100">
                    {recordActionError}
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selectedRequest.request_status === "archived" ? (
                    <button
                      type="button"
                      onClick={() => void restoreArchivedRecord()}
                      disabled={restoringRequest || deletingRequest}
                      className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-[#7CFC00]/25 bg-[#7CFC00]/10 px-4 text-xs font-black uppercase tracking-[0.13em] text-[#D8FFB5] disabled:cursor-wait disabled:opacity-50"
                    >
                      {restoringRequest
                        ? "Restoring..."
                        : "Restore to Working List"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void archiveCustomerRecord()}
                      disabled={archivingRequest || deletingRequest}
                      className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 text-xs font-black uppercase tracking-[0.13em] text-white/70 disabled:cursor-wait disabled:opacity-50"
                    >
                      {archivingRequest
                        ? "Archiving..."
                        : "Archive Customer Record"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => void deleteCustomerMistake()}
                    disabled={archivingRequest || deletingRequest}
                    className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-red-400/25 bg-red-500/10 px-4 text-xs font-black uppercase tracking-[0.13em] text-red-200 disabled:cursor-wait disabled:opacity-50"
                  >
                    {deletingRequest
                      ? "Deleting..."
                      : "Delete Mistake"}
                  </button>
                </div>
              </section>

            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
