import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type JobStatus =
  | "Needs Attention"
  | "Waiting on Material"
  | "Ready to Schedule"
  | "Scheduled"
  | "In Progress"
  | "Inspection"
  | "Payment"
  | "Complete";

type Job = {
  id: string;
  customer: string;
  address: string;
  scope: string;
  salesperson: string;
  status: JobStatus;
  nextAction: string;
  materialEta: string;
  permitStatus: string;
  crew: string;
  scheduledDate: string;
};

const jobs: Job[] = [];

const lanes: JobStatus[] = [
  "Needs Attention",
  "Waiting on Material",
  "Ready to Schedule",
  "Scheduled",
  "In Progress",
  "Inspection",
  "Payment",
  "Complete",
];

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      style={{
        border: "1px solid #26313a",
        background: "#101419",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: "100%",
          border: 0,
          background: "transparent",
          color: "#f5f7f5",
          padding: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <strong style={{ fontSize: 17 }}>{title}</strong>
        <span style={{ color: "#8fa9bc", fontSize: 18, lineHeight: 1 }}>
          {open ? "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢" : "+"}
        </span>
      </button>

      {open ? (
        <div style={{ padding: "0 18px 18px" }}>
          {children}
        </div>
      ) : null}
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        background: "#16232d",
        border: "1px solid #31495a",
        color: "#d9e5ee",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function getPremierOfficeAccessToken() {
  const readStoredToken = (storage: Storage) => {
    try {
      const rawSession = storage.getItem("premier_staff_session");
      if (!rawSession) return null;

      const session = JSON.parse(rawSession);

      if (
        session?.expiresAt &&
        Date.now() >= new Date(session.expiresAt).getTime()
      ) {
        storage.removeItem("premier_staff_session");
        return null;
      }

      const sessionToken = String(session?.accessToken || "").trim();
      return sessionToken || null;
    } catch (error) {
      console.error("Premier staff session read failed:", error);
      return null;
    }
  };

  return (
    readStoredToken(window.sessionStorage) ||
    readStoredToken(window.localStorage) ||
    new URLSearchParams(window.location.search).get("access")
  );
}

function getPremierOfficeGreeting() {
  try {
    const rawSession =
      window.sessionStorage.getItem("premier_staff_session") ||
      window.localStorage.getItem("premier_staff_session");
    if (!rawSession) return "";

    const session = JSON.parse(rawSession);
    const displayName = String(session?.displayName || "").trim();
    if (!displayName) return "";

    const firstName = displayName.split(" ")[0];
    const hour = new Date().getHours();
    const period =
      hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

    return `Good ${period}, ${firstName}.`;
  } catch {
    return "";
  }
}

export default function PremierWindowDoorBoard() {
  const officeGreeting = getPremierOfficeGreeting();
  const [liveLeads, setLiveLeads] = useState<any[]>([]);
  const [liveLeadsLoading, setLiveLeadsLoading] = useState(true);
  const liveLeadsScrollRef = useRef<HTMLDivElement | null>(null);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [officeWorkLeadId, setOfficeWorkLeadId] = useState<string | null>(null);
  const [officeFieldReports, setOfficeFieldReports] = useState<any[]>([]);
  const [officeIssueStatuses, setOfficeIssueStatuses] = useState<Record<string, any>>({});
  const [officeIssueStatusError, setOfficeIssueStatusError] = useState("");
  const [officeIssueNotes, setOfficeIssueNotes] = useState<Record<string, string>>({});
  const [officeIssueSavingId, setOfficeIssueSavingId] = useState<string | null>(null);
  const [officeIssueActionError, setOfficeIssueActionError] = useState<Record<string, string>>({});
  const [officeIssueHistory, setOfficeIssueHistory] = useState<Record<string, any[]>>({});
  const [officeIssueHistoryOpen, setOfficeIssueHistoryOpen] = useState<Record<string, boolean>>({});
  const [officeIssueHistoryLoading, setOfficeIssueHistoryLoading] = useState<string | null>(null);
  const [officeIssueJobIds, setOfficeIssueJobIds] = useState<string[]>([]);
  const [officeIssueScanLoading, setOfficeIssueScanLoading] = useState(true);
  const [officeIssueScanError, setOfficeIssueScanError] = useState(false);
  const [officeProofPhotos, setOfficeProofPhotos] = useState<any[]>([]);
  const [officeProofLoading, setOfficeProofLoading] = useState(false);
  const [officeProofError, setOfficeProofError] = useState("");
  const [officeFieldLoading, setOfficeFieldLoading] = useState(false);
  const [officeFieldError, setOfficeFieldError] = useState("");
  const [officeFieldRefresh, setOfficeFieldRefresh] = useState(0);
  const [officeRjSending, setOfficeRjSending] = useState(false);
  const [officeRjError, setOfficeRjError] = useState("");
  const [officeRjSent, setOfficeRjSent] = useState(false);
  const [officeRjRelease, setOfficeRjRelease] = useState<{
    jobId: string;
    releasedAt: string;
    releasedBy: string;
  } | null>(null);
  const [historyOpenJobId, setHistoryOpenJobId] = useState<string | null>(null);
  const [customerEditOpen, setCustomerEditOpen] = useState(false);
  const [customerEditDraft, setCustomerEditDraft] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    projectAddress: "",
  });
  const [savingCustomerEdit, setSavingCustomerEdit] = useState(false);
  const [workHistoryOpen, setWorkHistoryOpen] = useState(false);
  const [workHistorySearch, setWorkHistorySearch] = useState("");
  const [workHistoryRows, setWorkHistoryRows] = useState<any[]>([]);
  const [workHistoryLoading, setWorkHistoryLoading] = useState(false);
  const [workHistoryError, setWorkHistoryError] = useState("");
  const [restoringJobId, setRestoringJobId] = useState<string | null>(null);
  const [officeBeamMessages, setOfficeBeamMessages] = useState<any[]>([]);
  const [officeBeamLoading, setOfficeBeamLoading] = useState(false);
  const [officeBeamError, setOfficeBeamError] = useState("");
  const [officeBeamBody, setOfficeBeamBody] = useState("");
  const [officeBeamRecipient, setOfficeBeamRecipient] =
    useState<string>("Gio Richardson");
  const [officeBeamSending, setOfficeBeamSending] = useState(false);

  const [officeBeamListening, setOfficeBeamListening] = useState(false);
  const [officePersonalBeamMessages, setOfficePersonalBeamMessages] = useState<any[]>([]);
  const [officePersonalBeamLoading, setOfficePersonalBeamLoading] = useState(false);
  const [officePersonalBeamError, setOfficePersonalBeamError] = useState("");
  const [officePersonalBeamReplyOpenId, setOfficePersonalBeamReplyOpenId] = useState<string | null>(null);
  const [officePersonalBeamReplyBody, setOfficePersonalBeamReplyBody] = useState("");
  const [officePersonalBeamReplySending, setOfficePersonalBeamReplySending] = useState(false);
  const [officePersonalBeamReplyListening, setOfficePersonalBeamReplyListening] = useState(false);
  const [officePersonalBeamReplyError, setOfficePersonalBeamReplyError] = useState("");
  const [officeWorkView, setOfficeWorkView] = useState<
    | "measurements"
    | "photos"
    | "proposal"
    | "relay"
    | "revision_request"
    | "approval_details"
    | "deposit"
    | "final_measurement"
    | "continue_job"
    | "production_setup"
    | "job_documents"
    | "inspection_schedule"
    | "final_closeout"
    | null
  >(null);
  const [officeMeasurementOpenings, setOfficeMeasurementOpenings] =
    useState<any[]>([]);
  const [officeMeasurementPhotos, setOfficeMeasurementPhotos] =
    useState<Record<string, any[]>>({});
  const [officeMeasurementLoading, setOfficeMeasurementLoading] =
    useState(false);
  const [officeMeasurementError, setOfficeMeasurementError] =
    useState("");

  const [officeJobDocuments, setOfficeJobDocuments] = useState<any[]>([]);
  const [officeJobDocumentsLoading, setOfficeJobDocumentsLoading] =
    useState(false);
  const [officeJobDocumentsError, setOfficeJobDocumentsError] =
    useState("");
  const [officeJobDocumentType, setOfficeJobDocumentType] =
    useState("Warranty");
  const [officeJobDocumentAddOpen, setOfficeJobDocumentAddOpen] = useState(false);
  const [officeJobDocumentNote, setOfficeJobDocumentNote] =
    useState("");
  const [officeJobDocumentUploading, setOfficeJobDocumentUploading] =
    useState(false);

  const [officeApprovedSetupLoading, setOfficeApprovedSetupLoading] =
    useState(false);
  const [officeApprovedSetupError, setOfficeApprovedSetupError] =
    useState("");
  const [blueFolderState, setBlueFolderState] = useState<{jobId: string; confirmedAt: string | null; confirmedBy: string | null} | null>(null);
  const [blueFolderLoading, setBlueFolderLoading] = useState(false);
  const [blueFolderSaving, setBlueFolderSaving] = useState(false);
  const [blueFolderError, setBlueFolderError] = useState("");
  const [officeDepositSaving, setOfficeDepositSaving] = useState(false);
  const [officeDepositSaved, setOfficeDepositSaved] = useState(false);
  const [officeDepositDraft, setOfficeDepositDraft] = useState({
    status: "pending",
    amount: "",
    method: "",
    receivedDate: "",
    note: "",
  });
  const [officePaymentDrafts, setOfficePaymentDrafts] = useState<
    Record<
      string,
      {
        status: string;
        amount: string;
        method: string;
        invoiceSentDate: string;
        receivedDate: string;
        note: string;
      }
    >
  >({
    deposit_50: {
      status: "not_sent",
      amount: "",
      method: "",
      invoiceSentDate: "",
      receivedDate: "",
      note: "",
    },
    delivery_40: {
      status: "not_sent",
      amount: "",
      method: "",
      invoiceSentDate: "",
      receivedDate: "",
      note: "",
    },
    final_10: {
      status: "not_sent",
      amount: "",
      method: "",
      invoiceSentDate: "",
      receivedDate: "",
      note: "",
    },
  });

  const [officePaymentsLoading, setOfficePaymentsLoading] = useState(false);
  const [officePaymentsError, setOfficePaymentsError] = useState("");
  const [officePaymentSavingStage, setOfficePaymentSavingStage] =
    useState<string | null>(null);
  const [officePaymentSavedStage, setOfficePaymentSavedStage] =
    useState<string | null>(null);

  const [officeInspectionSaving, setOfficeInspectionSaving] = useState(false);
  const [officeInspectionError, setOfficeInspectionError] = useState("");
  const [officeInspectionDraft, setOfficeInspectionDraft] = useState({
    type: "Final Walkthrough",
    scheduledDate: "",
    window: "Morning Window",
    specificTime: "",
    assignedTo: "RJ",
  });

  const [finalMeasureSchedulingMode, setFinalMeasureSchedulingMode] = useState("coordinate");
  const [finalMeasureWindowDate, setFinalMeasureWindowDate] = useState("");
  const [officeFinalMeasureSaving, setOfficeFinalMeasureSaving] =
    useState(false);
  const [officeFinalMeasureSaved, setOfficeFinalMeasureSaved] =
    useState(false);
  const [officeFinalMeasureDraft, setOfficeFinalMeasureDraft] = useState({
    status: "not_scheduled",
    scheduledFor: "",
    assignedTo: "",
    completedDate: "",
    note: "",
  });


  const showOfficeSamples =
    new URLSearchParams(window.location.search).get("samples") === "1";

  const sampleOfficeLeads = showOfficeSamples
    ? [
        {
          id: "sample-office-measurements-complete",
          _sample: true,
          first_name: "Amanda",
          last_name: "Rodriguez",
          phone: "(561) 555-0148",
          email: "amanda@example.com",
          project_address: "Palm Beach Gardens",
          intake_notes:
            "Impact window project. Rough measurements completed by Sales.",
          assigned_salesperson: "Gino",
          current_stage: "proposal",
          next_action: "Prepare proposal and return it to Gino.",
          latest_sales_note:
            "Rough measurement complete. Ready for Office proposal preparation.",
        },
        {
          id: "sample-office-proposal-revision",
          _sample: true,
          first_name: "David",
          last_name: "Anderson",
          phone: "(561) 555-0172",
          email: "david@example.com",
          project_address: "West Palm Beach",
          intake_notes:
            "Customer wants the proposal revised before moving forward.",
          assigned_salesperson: "Dennis",
          current_stage: "proposal_revision",
          next_action:
            "Review requested changes and update proposal.",
          latest_sales_note:
            "Customer requested proposal revision: Remove rear door and update window package.",
        },
        {
          id: "sample-office-proposal-approved",
          _sample: true,
          first_name: "Jennifer",
          last_name: "Clark",
          phone: "(561) 555-0126",
          email: "jennifer@example.com",
          project_address: "Lake Worth",
          intake_notes:
            "Customer approved proposal and is ready for next steps.",
          assigned_salesperson: "Gino",
          current_stage: "proposal_approved",
          next_action:
            "Collect deposit and schedule final measurement.",
          latest_sales_note:
            "Customer approved proposal.",
        },
      ]
    : [];

  const previewOfficeLeads = liveLeads;

  const officeWorkLead =

    previewOfficeLeads.find((lead) => lead.id === officeWorkLeadId) ?? null;

  useEffect(() => {
    let cancelled = false;

    const scanOfficeIssues = async () => {
      setOfficeIssueScanLoading(true);
      setOfficeIssueScanError(false);

      const accessToken = getPremierOfficeAccessToken();
      const jobsToCheck = liveLeads.filter(
        (job) => job.id && !job._sample
      );

      if (jobsToCheck.length === 0) {
        setOfficeIssueJobIds([]);
        setOfficeIssueScanLoading(false);
        return;
      }

      if (!accessToken) {
        setOfficeIssueScanError(true);
        setOfficeIssueScanLoading(false);
        return;
      }

      const results = await Promise.all(
        jobsToCheck.map(async (job) => {
          try {
            const { data, error } = await supabase.rpc(
              "get_premier_issue_resolution_state",
              {
                p_access_token: accessToken,
                p_job_id: job.id,
              }
            );

            return {
              id: String(job.id),
              hasReports: !error && Array.isArray(data) && data.some((issue: any) => issue.resolution_status !== "resolved"),
              failed: Boolean(error),
            };
          } catch {
            return {
              id: String(job.id),
              hasReports: false,
              failed: true,
            };
          }
        })
      );

      if (cancelled) return;

      setOfficeIssueJobIds(
        results.filter((item) => item.hasReports).map((item) => item.id)
      );
      setOfficeIssueScanError(results.some((item) => item.failed));
      setOfficeIssueScanLoading(false);
    };

    void scanOfficeIssues();

    return () => {
      cancelled = true;
    };
  }, [liveLeads, officeFieldRefresh]);


  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!officeWorkLead?.id || officeWorkLead._sample) {
        setOfficeFieldReports([]);
        setOfficeFieldError("");
        setOfficeFieldLoading(false);
        return;
      }

      const accessToken = getPremierOfficeAccessToken();
      if (!accessToken) {
        setOfficeFieldError("Office session required.");
        setOfficeFieldReports([]);
        return;
      }

      setOfficeFieldLoading(true);
      setOfficeFieldError("");
      const { data, error } = await supabase.rpc(
        "get_premier_installer_issue_reports",
        {
          p_access_token: accessToken,
          p_job_id: officeWorkLead.id,
        }
      );

      if (cancelled) return;
      setOfficeFieldReports(error ? [] : data ?? []);

      if (!error) {
        const { data: statuses, error: statusError } = await supabase.rpc(
          "get_premier_issue_resolution_state",
          {
            p_access_token: accessToken,
            p_job_id: officeWorkLead.id,
          }
        );

        if (cancelled) return;

        if (statusError) {
          setOfficeIssueStatusError("Could not load issue statuses.");
        } else {
          const next: Record<string, any> = {};
          for (const issue of statuses ?? []) {
            next[String(issue.issue_id)] = issue;
          }
          setOfficeIssueStatuses(next);
          setOfficeIssueStatusError("");
        }
      }
      setOfficeFieldError(error ? "Could not load field reports." : "");
      setOfficeFieldLoading(false);
    };

    void load();
    return () => { cancelled = true; };
  }, [officeWorkLead?.id, officeFieldRefresh]);

  useEffect(() => {
    let cancelled = false;

    const loadProof = async () => {
      setOfficeProofPhotos([]);
      setOfficeProofError("");

      if (!officeWorkLead?.id || officeWorkLead._sample) {
        setOfficeProofLoading(false);
        return;
      }

      const accessToken = getPremierOfficeAccessToken();
      if (!accessToken) {
        setOfficeProofError("Office session required.");
        return;
      }

      setOfficeProofLoading(true);

      const { data, error } = await supabase.functions.invoke(
        "premier-installer-proof-photo",
        {
          body: {
            action: "list",
            accessToken,
            jobId: officeWorkLead.id,
          },
        }
      );

      if (cancelled) return;

      setOfficeProofPhotos(error ? [] : data?.photos ?? []);
      setOfficeProofError(error ? "Could not load Bucking photos." : "");
      setOfficeProofLoading(false);
    };

    void loadProof();
    return () => { cancelled = true; };
  }, [officeWorkLead?.id, officeFieldRefresh]);

  const loadOfficeBeam = async (jobId: string) => {
    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken || !jobId) {
      setOfficeBeamMessages([]);
      return;
    }

    setOfficeBeamLoading(true);
    setOfficeBeamError("");

    const { data, error } = await supabase.rpc("get_premier_beam_messages", {
      p_access_token: accessToken,
      p_job_id: jobId,
    });

    if (error) {
      console.error("Premier Office Beam load failed:", error);
      setOfficeBeamMessages([]);
      setOfficeBeamError("Could not load Beam messages.");
      setOfficeBeamLoading(false);
      return;
    }

    const rows = data ?? [];
    setOfficeBeamMessages(rows);
    setOfficeBeamLoading(false);

    const hasUnreadOfficeMessages = rows.some(
      (message: any) =>
        message.recipient_role === "Office" && !message.read_at
    );

    if (hasUnreadOfficeMessages) {
      const { error: readError } = await supabase.rpc(
        "mark_premier_beam_read",
        {
          p_access_token: accessToken,
          p_job_id: jobId,
          p_recipient_role: "Office",
        }
      );

      if (readError) {
        console.error("Premier Office Beam read update failed:", readError);
        return;
      }

      setOfficeBeamMessages((current) =>
        current.map((message) =>
          message.recipient_role === "Office" && !message.read_at
            ? { ...message, read_at: new Date().toISOString() }
            : message
        )
      );
    }
  };

  const loadOfficePersonalBeamInbox = async () => {
    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficePersonalBeamMessages([]);
      return;
    }

    setOfficePersonalBeamLoading(true);
    setOfficePersonalBeamError("");

    const { data, error } = await supabase.rpc("get_premier_beam_inbox", {
      p_access_token: accessToken,
    });

    if (error) {
      console.error("Premier Office personal Beam inbox failed:", error);
      setOfficePersonalBeamMessages([]);
      setOfficePersonalBeamError("Could not load Beam.");
    } else {
      setOfficePersonalBeamMessages(data ?? []);
    }

    setOfficePersonalBeamLoading(false);
  };

  const markOfficePersonalBeamRead = async (messageId: string) => {
    const accessToken = getPremierOfficeAccessToken();
    if (!accessToken) return;

    const { data, error } = await supabase.rpc("mark_my_premier_beam_read", {
      p_access_token: accessToken,
      p_message_id: messageId,
    });

    if (error || data !== true) {
      console.error("Office Beam mark read failed:", error);
      return;
    }

    setOfficePersonalBeamMessages((current) =>
      current.filter((message) => message.id !== messageId)
    );
  };

  const startOfficePersonalBeamReplyVoiceInput = () => {
    if (officePersonalBeamReplyListening) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setOfficePersonalBeamReplyError("Speech-to-text is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setOfficePersonalBeamReplyListening(true);
      setOfficePersonalBeamReplyError("");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || "";
      if (!transcript) return;

      setOfficePersonalBeamReplyBody((current) =>
        current.trim() ? `${current.trim()} ${transcript}` : transcript
      );
    };

    recognition.onerror = () => {
      setOfficePersonalBeamReplyError("Could not capture voice message.");
    };

    recognition.onend = () => {
      setOfficePersonalBeamReplyListening(false);
    };

    recognition.start();
  };

  const sendOfficePersonalBeamReply = async (message: any) => {
    if (officePersonalBeamReplySending) return;

    const body = officePersonalBeamReplyBody.trim();
    if (!body) return;

    const recipient = String(message?.sender_label || "").trim();
    const allowedRecipients = [
      "Darcy",
      "Karolina",
      "Gio Richardson",
      "Gino Marquez",
      "Dennis Dillon",
      "RJ",
      "Angel",
      "Jose",
      "Obelio",
      "Joseph",
    ];

    if (!allowedRecipients.includes(recipient)) {
      setOfficePersonalBeamReplyError("This Beam does not contain a replyable staff identity.");
      return;
    }

    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficePersonalBeamReplyError("Premier staff access token missing.");
      return;
    }

    setOfficePersonalBeamReplySending(true);
    setOfficePersonalBeamReplyError("");

    const { error } = await supabase.rpc("send_premier_beam_message", {
      p_access_token: accessToken,
      p_job_id: message.job_id,
      p_sender_role: "Office",
      p_recipient_role: recipient,
      p_body: body,
    });

    if (error) {
      console.error("Office Beam reply failed:", error);
      setOfficePersonalBeamReplyError(error.message || "Could not send Beam reply.");
      setOfficePersonalBeamReplySending(false);
      return;
    }

    setOfficePersonalBeamReplyBody("");
    setOfficePersonalBeamReplyOpenId(null);
    setOfficePersonalBeamReplySending(false);
  };

  useEffect(() => {
    void loadOfficePersonalBeamInbox();
  }, []);

  const startOfficeBeamVoiceInput = () => {
    if (officeBeamListening) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setOfficeBeamError("Speech-to-text is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setOfficeBeamListening(true);
      setOfficeBeamError("");
    };

    recognition.onresult = (event: any) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim() || "";

      if (!transcript) return;

      setOfficeBeamBody((current) =>
        current.trim() ? `${current.trim()} ${transcript}` : transcript
      );
    };

    recognition.onerror = (event: any) => {
      console.error("Office Beam speech recognition failed:", event);
      setOfficeBeamError("Could not capture voice message.");
    };

    recognition.onend = () => {
      setOfficeBeamListening(false);
    };

    recognition.start();
  };

  const sendOfficeBeamMessage = async () => {
    if (!officeWorkLead || officeBeamSending) return;

    const body = officeBeamBody.trim();

    if (!body) return;

    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeBeamError("Premier staff access token missing.");
      return;
    }

    setOfficeBeamSending(true);
    setOfficeBeamError("");

    const { error } = await supabase.rpc("send_premier_beam_message", {
      p_access_token: accessToken,
      p_job_id: officeWorkLead.id,
      p_sender_role: "Office",
      p_recipient_role: officeBeamRecipient,
      p_body: body,
    });

    if (error) {
      console.error("Premier Office Beam send failed:", error);
      setOfficeBeamError(error.message || "Could not send Beam message.");
      setOfficeBeamSending(false);
      return;
    }

    setOfficeBeamBody("");
    setOfficeBeamSending(false);

    await loadOfficeBeam(officeWorkLead.id);
  };

  useEffect(() => {
    if (!officeWorkLead?.id) {
      setOfficeBeamMessages([]);
      setOfficeBeamBody("");
      setOfficeBeamError("");
      return;
    }

    void loadOfficeBeam(officeWorkLead.id);
  }, [officeWorkLead?.id]);

  const saveCustomerEdit = async (lead: any) => {
    if (!lead || lead._sample || savingCustomerEdit) return;

    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      window.alert("Premier staff access token missing.");
      return;
    }

    setSavingCustomerEdit(true);

    const { data, error } = await supabase.rpc(
      "save_premier_customer_contact",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
        p_first_name: customerEditDraft.firstName,
        p_last_name: customerEditDraft.lastName,
        p_phone: customerEditDraft.phone,
        p_email: customerEditDraft.email,
        p_project_address: customerEditDraft.projectAddress,
      }
    );

    setSavingCustomerEdit(false);

    if (error) {
      console.error("Customer contact save failed:", error);
      window.alert(error.message || "Customer information could not be saved.");
      return;
    }

    if (data !== true) {
      window.alert("Customer information could not be saved.");
      return;
    }

    setLiveLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              first_name: customerEditDraft.firstName.trim(),
              last_name: customerEditDraft.lastName.trim(),
              phone: customerEditDraft.phone.trim(),
              email: customerEditDraft.email.trim() || null,
              project_address: customerEditDraft.projectAddress.trim(),
            }
          : item
      )
    );

    setCustomerEditOpen(false);
  };
  const [savingLeadDecisionId, setSavingLeadDecisionId] = useState<string | null>(null);
  const [archivingJobId, setArchivingJobId] = useState<string | null>(null);
  const [leadDrafts, setLeadDrafts] = useState<Record<string, {
    salesperson?: string;
    contactStatus?: string;
    measurementAppointment?: string;
    latestSalesNote?: string;
    nextStage?: string;
  }>>({});

  const scrollLiveLeads = (direction: "left" | "right") => {
    const container = liveLeadsScrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction === "right" ? 380 : -380,
      behavior: "smooth",
    });
  };


  const toOfficeDateInput = (value: any) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const toOfficeDateTimeInput = (value: any) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}`;
  };

  const [officeProductionStarting, setOfficeProductionStarting] =
    useState(false);
  const [officeProductionLoading, setOfficeProductionLoading] = useState(false);
  const [officeProductionSaving, setOfficeProductionSaving] = useState(false);
  const [officeProductionSaved, setOfficeProductionSaved] = useState(false);
  const [officeProductionConfirmedStatus, setOfficeProductionConfirmedStatus] = useState("Not ordered");
  const [officePermitConfirmedStatus, setOfficePermitConfirmedStatus] = useState("Not started");
  const [officeProductionError, setOfficeProductionError] = useState("");
  const [officeProductionDraft, setOfficeProductionDraft] = useState({
    materialStatus: "Not ordered",
    materialEta: "",
    permitStatus: "Not started",
  });

  const [officeInstallSaving, setOfficeInstallSaving] = useState(false);
  const [officeInstallSaved, setOfficeInstallSaved] = useState(false);
  const [officeInstallError, setOfficeInstallError] = useState("");
  const [officeInstallDraft, setOfficeInstallDraft] = useState({
    crew: "",
    scheduledFor: "",
  });


  const loadOfficeJobDocuments = async (lead: any) => {
    setOfficeJobDocumentsError("");
    setOfficeJobDocumentsLoading(true);

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeJobDocuments([]);
      setOfficeJobDocumentsError("Premier staff access is missing.");
      setOfficeJobDocumentsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "premier-job-document",
        {
          body: {
            action: "list",
            accessToken,
            jobId: lead.id,
          },
        }
      );

      if (error || data?.error) {
        console.error("Premier job document list failed:", error || data?.error);
        setOfficeJobDocuments([]);
        setOfficeJobDocumentsError(
          data?.error || "Could not load job documents."
        );
        setOfficeJobDocumentsLoading(false);
        return;
      }

      setOfficeJobDocuments(data?.documents ?? []);
    } catch (error) {
      console.error("Premier job document list failed:", error);
      setOfficeJobDocuments([]);
      setOfficeJobDocumentsError("Could not load job documents.");
    }

    setOfficeJobDocumentsLoading(false);
  };

  const uploadOfficeJobDocument = async (lead: any, file: File, documentTypeOverride = "") => {
    setOfficeJobDocumentsError("");
    setOfficeJobDocumentUploading(true);

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeJobDocumentsError("Premier staff access is missing.");
      setOfficeJobDocumentUploading(false);
      return;
    }

    try {
      const mimeType =
        file.type || "application/octet-stream";

      const { data: uploadAccess, error: uploadAccessError } =
        await supabase.functions.invoke("premier-job-document", {
          body: {
            action: "create-upload",
            accessToken,
            jobId: lead.id,
            documentType: documentTypeOverride || officeJobDocumentType,
            fileName: file.name,
            mimeType,
          },
        });

      if (uploadAccessError || uploadAccess?.error) {
        throw new Error(
          uploadAccess?.error ||
            uploadAccessError?.message ||
            "Could not prepare document upload."
        );
      }

      const { error: storageError } = await supabase.storage
        .from("premier-job-documents")
        .uploadToSignedUrl(
          uploadAccess.path,
          uploadAccess.token,
          file,
          {
            contentType: mimeType,
          }
        );

      if (storageError) {
        throw storageError;
      }

      const { data: finalized, error: finalizeError } =
        await supabase.functions.invoke("premier-job-document", {
          body: {
            action: "finalize",
            accessToken,
            jobId: lead.id,
            documentType: documentTypeOverride || officeJobDocumentType,
            path: uploadAccess.path,
            fileName: file.name,
            mimeType,
            note: officeJobDocumentNote,
          },
        });

      if (finalizeError || finalized?.error) {
        throw new Error(
          finalized?.error ||
            finalizeError?.message ||
            "Could not save document record."
        );
      }

      setOfficeJobDocumentNote("");
      await loadOfficeJobDocuments(lead);
    } catch (error) {
      console.error("Premier job document upload failed:", error);
      setOfficeJobDocumentsError(
        error instanceof Error
          ? error.message
          : "Could not upload job document."
      );
    }

    setOfficeJobDocumentUploading(false);
  };

  const removeOfficeJobDocument = async (lead: any, document: any) => {
    if (!document?.id) return;

    const confirmed = window.confirm(
      `Remove "${document.file_name || "this invoice"}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setOfficeJobDocumentsError("");
    setOfficeJobDocumentUploading(true);

    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeJobDocumentsError("Premier staff access is missing.");
      setOfficeJobDocumentUploading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "premier-job-document",
        {
          body: {
            action: "remove",
            accessToken,
            jobId: lead.id,
            documentId: document.id,
          },
        }
      );

      if (error || data?.error || data?.removed !== true) {
        throw new Error(
          data?.error ||
            error?.message ||
            "Could not remove invoice."
        );
      }

      await loadOfficeJobDocuments(lead);
    } catch (error) {
      console.error("Premier invoice remove failed:", error);
      setOfficeJobDocumentsError(
        error instanceof Error
          ? error.message
          : "Could not remove invoice."
      );
    }

    setOfficeJobDocumentUploading(false);
  };

  const replaceOfficeJobDocument = async (
    lead: any,
    document: any,
    file: File,
    documentType: string
  ) => {
    if (!document?.id || !file) return;

    const confirmed = window.confirm(
      `Replace "${document.file_name || "this document"}" with "${file.name}"?`
    );

    if (!confirmed) return;

    setOfficeJobDocumentsError("");
    setOfficeJobDocumentUploading(true);

    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeJobDocumentsError("Premier staff access is missing.");
      setOfficeJobDocumentUploading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "premier-job-document",
        {
          body: {
            action: "remove",
            accessToken,
            jobId: lead.id,
            documentId: document.id,
          },
        }
      );

      if (error || data?.error || data?.removed !== true) {
        throw new Error(
          data?.error ||
            error?.message ||
            "Could not remove the previous document."
        );
      }

      await uploadOfficeJobDocument(
        lead,
        file,
        documentType
      );
    } catch (error) {
      console.error("Premier document replace failed:", error);
      setOfficeJobDocumentsError(
        error instanceof Error
          ? error.message
          : "Could not replace this document."
      );
      setOfficeJobDocumentUploading(false);
    }
  };

  const loadOfficeApprovedSetup = async (lead: any) => {
    setOfficeApprovedSetupError("");
    setOfficeDepositSaved(false);
    setOfficeApprovedSetupLoading(true);

    if (lead?._sample) {
      setOfficeDepositDraft({
        status: "pending",
        amount: "",
        method: "",
        receivedDate: "",
        note: "",
      });

      setOfficeFinalMeasureSaved(false);
      setOfficeFinalMeasureDraft({
        status: "not_scheduled",
        scheduledFor: "",
        assignedTo: "",
        completedDate: "",
        note: "",
      });

      setOfficeApprovedSetupLoading(false);
      return;
    }

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeApprovedSetupError("Premier staff access is missing.");
      setOfficeApprovedSetupLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc(
      "get_premier_approved_job_setup",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
      }
    );

    if (error) {
      console.error("Premier approved job setup load failed:", error);
      setOfficeApprovedSetupError("Could not load approved-job details.");
      setOfficeApprovedSetupLoading(false);
      return;
    }

    const setup = Array.isArray(data) ? data[0] : null;

    if (!setup) {
      setOfficeApprovedSetupError(
        "Approved-job setup was not found for this customer."
      );
      setOfficeApprovedSetupLoading(false);
      return;
    }

    setOfficeDepositDraft({
      status: setup.deposit_status || "pending",
      amount: setup.deposit_amount_text || "",
      method: setup.deposit_method || "",
      receivedDate: toOfficeDateInput(setup.deposit_received_at),
      note: setup.deposit_note || "",
    });

    setOfficeFinalMeasureSaved(false);
    setOfficeFinalMeasureDraft({
      status: setup.final_measure_status || "not_scheduled",
      scheduledFor: toOfficeDateTimeInput(
        setup.final_measure_scheduled_for
      ),
      assignedTo: setup.final_measure_assigned_to || "",
      completedDate: toOfficeDateInput(
        setup.final_measure_completed_at
      ),
      note: setup.final_measure_note || "",
    });

    setOfficeApprovedSetupLoading(false);
  };

  const loadOfficePayments = async (lead: any) => {
    setOfficePaymentsError("");
    setOfficePaymentSavedStage(null);
    setOfficePaymentsLoading(true);

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficePaymentsError("Premier staff access is missing.");
      setOfficePaymentsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc(
        "get_premier_job_payments",
        {
          p_access_token: accessToken,
          p_job_id: lead.id,
        }
      );

      if (error) {
        console.error("Premier payment schedule load failed:", error);
        setOfficePaymentsError("Could not load the payment schedule.");
        setOfficePaymentsLoading(false);
        return;
      }

      const nextDrafts: Record<string, any> = {
        deposit_50: {
          status: "not_sent",
          amount: "",
          method: "",
          invoiceSentDate: "",
          receivedDate: "",
          note: "",
        },
        delivery_40: {
          status: "not_sent",
          amount: "",
          method: "",
          invoiceSentDate: "",
          receivedDate: "",
          note: "",
        },
        final_10: {
          status: "not_sent",
          amount: "",
          method: "",
          invoiceSentDate: "",
          receivedDate: "",
          note: "",
        },
      };

      (data ?? []).forEach((payment: any) => {
        nextDrafts[payment.payment_stage] = {
          status: payment.status || "not_sent",
          amount: payment.amount_text || "",
          method: payment.method || "",
          invoiceSentDate: toOfficeDateInput(payment.invoice_sent_at),
          receivedDate: toOfficeDateInput(payment.received_at),
          receivedAt: payment.received_at || "",
          updatedBy: payment.updated_by || "",
          note: payment.note || "",
        };
      });

      setOfficePaymentDrafts(nextDrafts);
    } catch (error) {
      console.error("Premier payment schedule load failed:", error);
      setOfficePaymentsError("Could not load the payment schedule.");
    }

    setOfficePaymentsLoading(false);
  };

  const [officeWalkthrough, setOfficeWalkthrough] = useState<any>(null);
  const [officeWalkthroughAssignee, setOfficeWalkthroughAssignee] =
    useState("RJ");
  const [officeWalkthroughDate, setOfficeWalkthroughDate] =
    useState("");
  const [officeWalkthroughNote, setOfficeWalkthroughNote] =
    useState("");
  const [officeWalkthroughOutcomeNote, setOfficeWalkthroughOutcomeNote] =
    useState("");
  const [officeWalkthroughBusy, setOfficeWalkthroughBusy] =
    useState(false);
  const [officeWalkthroughError, setOfficeWalkthroughError] =
    useState("");

  const loadOfficeWalkthrough = async (jobId: string) => {
    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeWalkthroughError("Office session missing.");
      return;
    }

    const { data, error } = await supabase.rpc(
      "get_premier_customer_walkthrough",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
      }
    );

    if (error) {
      setOfficeWalkthroughError(error.message);
      return;
    }

    const record = data?.[0] || null;
    setOfficeWalkthrough(record);

    if (record) {
      setOfficeWalkthroughAssignee(record.assigned_to || "RJ");
      setOfficeWalkthroughNote(record.office_note || "");
      setOfficeWalkthroughOutcomeNote(record.outcome_note || "");

      if (record.scheduled_at) {
        const scheduled = new Date(record.scheduled_at);
        const local = new Date(
          scheduled.getTime() -
          scheduled.getTimezoneOffset() * 60000
        );
        setOfficeWalkthroughDate(local.toISOString().slice(0, 16));
      }
    }
  };

  useEffect(() => {
    setOfficeWalkthrough(null);
    setOfficeWalkthroughError("");
    setOfficeWalkthroughAssignee("RJ");
    setOfficeWalkthroughDate("");
    setOfficeWalkthroughNote("");
    setOfficeWalkthroughOutcomeNote("");

    if (officeWorkLead?.id) {
      void loadOfficeWalkthrough(officeWorkLead.id);
    }
  }, [officeWorkLead?.id]);
  const scheduleOfficeWalkthrough = async () => {
    if (!officeWorkLead || officeWalkthroughBusy) return;

    if (!officeWalkthroughDate) {
      setOfficeWalkthroughError("Choose a date and time.");
      return;
    }

    const scheduled = new Date(officeWalkthroughDate);

    if (Number.isNaN(scheduled.getTime())) {
      setOfficeWalkthroughError("Invalid date or time.");
      return;
    }

    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeWalkthroughError("Office session missing.");
      return;
    }

    const confirmed = window.confirm(
      `Schedule the final customer walkthrough with ${
        officeWalkthroughAssignee === "RJ" ? "RJ" : "Gino"
      } and send the details through Beam?`
    );

    if (!confirmed) return;

    setOfficeWalkthroughBusy(true);
    setOfficeWalkthroughError("");

    try {
      const { data, error } = await supabase.rpc(
        "schedule_premier_customer_walkthrough",
        {
          p_access_token: accessToken,
          p_job_id: officeWorkLead.id,
          p_assigned_to: officeWalkthroughAssignee,
          p_scheduled_at: scheduled.toISOString(),
          p_note: officeWalkthroughNote,
        }
      );

      if (error) throw error;
      if (data !== true) {
        throw new Error("Walkthrough scheduling was not saved.");
      }

      await loadOfficeWalkthrough(officeWorkLead.id);
      await loadOfficeBeam(officeWorkLead.id);
    } catch (error: any) {
      setOfficeWalkthroughError(
        error?.message || "Could not schedule walkthrough."
      );
    } finally {
      setOfficeWalkthroughBusy(false);
    }
  };

  const recordOfficeWalkthroughOutcome = async (
    status: "approved" | "changes_requested"
  ) => {
    if (!officeWorkLead || officeWalkthroughBusy) return;

    if (
      status === "changes_requested" &&
      officeWalkthroughOutcomeNote.trim().length < 5
    ) {
      setOfficeWalkthroughError(
        "Describe the changes requested by the customer."
      );
      return;
    }

    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeWalkthroughError("Office session missing.");
      return;
    }

    const confirmed = window.confirm(
      status === "approved"
        ? "Did RJ or Gino confirm the customer approved the walkthrough?"
        : "Record customer requested changes? The job will stay open."
    );

    if (!confirmed) return;

    setOfficeWalkthroughBusy(true);
    setOfficeWalkthroughError("");

    try {
      const { data, error } = await supabase.rpc(
        "record_premier_customer_walkthrough_outcome",
        {
          p_access_token: accessToken,
          p_job_id: officeWorkLead.id,
          p_status: status,
          p_note: officeWalkthroughOutcomeNote,
        }
      );

      if (error) throw error;
      if (data !== true) {
        throw new Error("Walkthrough outcome was not saved.");
      }

      await loadOfficeWalkthrough(officeWorkLead.id);
    } catch (error: any) {
      setOfficeWalkthroughError(
        error?.message || "Could not record walkthrough outcome."
      );
    } finally {
      setOfficeWalkthroughBusy(false);
    }
  };
  const saveOfficePayment = async (
    lead: any,
    paymentStage: "deposit_50" | "delivery_40" | "final_10",
    options?: { markReceived?: boolean; markSent?: boolean }
  ) => {
    setOfficePaymentsError("");
    setOfficePaymentSavedStage(null);

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficePaymentsError("Premier staff access is missing.");
      return;
    }

    const draft = officePaymentDrafts[paymentStage];
    if (paymentStage === "final_10") {
      const hasFinalInvoice = officeJobDocuments.some(
        (document) => document.document_type === "Final 10% Invoice"
      );
      if ((options?.markSent || options?.markReceived) && !hasFinalInvoice) {
        setOfficePaymentsError("Attach the final 10% invoice before confirming it was sent or recording payment.");
        return;
      }
      if ((options?.markSent || options?.markReceived) &&
          !["inspection_complete", "completed"].includes(lead.current_stage)) {
        setOfficePaymentsError("Final payment is available after the final walkthrough is approved.");
        return;
      }
      if (options?.markSent && draft.status !== "not_sent") return;
      if (options?.markReceived && draft.status === "received") return;
    }

    const paymentStatus = options?.markReceived ? "received" : options?.markSent ? "sent" : draft.status;

    const invoiceSentAt =
      paymentStatus !== "not_sent" && draft.invoiceSentDate
        ? new Date(`${draft.invoiceSentDate}T12:00:00`).toISOString()
        : null;

    const receivedAt =
      options?.markReceived
        ? new Date().toISOString()
        : paymentStatus === "received" && draft.receivedDate
          ? new Date(`${draft.receivedDate}T12:00:00`).toISOString()
          : null;

    setOfficePaymentSavingStage(paymentStage);

    try {
      const { data, error } = await supabase.rpc(
        "save_premier_job_payment",
        {
          p_access_token: accessToken,
          p_job_id: lead.id,
          p_payment_stage: paymentStage,
          p_status: paymentStatus,
          p_amount_text: draft.amount || null,
          p_method: draft.method || null,
          p_invoice_sent_at: invoiceSentAt,
          p_received_at: receivedAt,
          p_note: draft.note || null,
        }
      );

      if (error || data !== true) {
        console.error("Premier payment save failed:", error);
        setOfficePaymentsError(error?.message || "Could not save this payment.");
        setOfficePaymentSavingStage(null);
        return;
      }

      setOfficePaymentSavedStage(paymentStage);

      // Keep the existing 50% production gate UI synchronized.
      if (paymentStage === "deposit_50") {
        await loadOfficeApprovedSetup(lead);
      }

      await loadOfficePayments(lead);
    } catch (error) {
      console.error("Premier payment save failed:", error);
      setOfficePaymentsError(error?.message || "Could not save this payment.");
    }

    setOfficePaymentSavingStage(null);
  };

  const saveOfficeDeposit = async (lead: any) => {
    setOfficeApprovedSetupError("");
    setOfficeDepositSaved(false);

    if (lead?._sample) {
      window.alert(
        "Sample deposit saved for preview only. No live data was changed."
      );
      setOfficeDepositSaved(true);
      return;
    }

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeApprovedSetupError("Premier staff access is missing.");
      return;
    }

    setOfficeDepositSaving(true);

    const receivedAt =
      officeDepositDraft.status === "received" &&
      officeDepositDraft.receivedDate
        ? new Date(
            `${officeDepositDraft.receivedDate}T12:00:00`
          ).toISOString()
        : null;

    const { data, error } = await supabase.rpc(
      "save_premier_deposit",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
        p_status: officeDepositDraft.status,
        p_amount_text: officeDepositDraft.amount || null,
        p_method: officeDepositDraft.method || null,
        p_received_at: receivedAt,
        p_note: officeDepositDraft.note || null,
      }
    );

    if (error || data !== true) {
      console.error("Premier deposit save failed:", error);
      setOfficeApprovedSetupError("Could not save the deposit.");
      setOfficeDepositSaving(false);
      return;
    }

    setOfficeDepositSaving(false);
    setOfficeDepositSaved(true);
  };

  const loadOfficeProductionSetup = async (lead: any) => {
    setOfficeProductionError("");
    setOfficeProductionSaved(false);

    if (lead?._sample) {
      setOfficeProductionDraft({
        materialStatus: "Not ordered",
        materialEta: "",
        permitStatus: "Not started",
      });
      return;
    }

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeProductionError("Premier staff access is missing.");
      return;
    }

    setOfficeProductionLoading(true);

    const { data, error } = await supabase.rpc(
      "get_premier_production_setup",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
      }
    );

    if (error) {
      console.error("Premier production setup load failed:", error);
      setOfficeProductionError("Could not load production setup.");
      setOfficeProductionLoading(false);
      return;
    }

    if (!data?.[0]) {
      setOfficeProductionDraft({
        materialStatus: "Not ordered",
        materialEta: "",
        permitStatus: "Not started",
      });
      setOfficeProductionLoading(false);
      return;
    }


    const row = data[0];

    setOfficeProductionConfirmedStatus(row.material_status || "Not ordered");
    setOfficePermitConfirmedStatus(row.permit_status || "Not started");
    setOfficeProductionDraft({
      materialStatus: row.material_status || "Not ordered",
      materialEta: row.material_eta || "",
      permitStatus: row.permit_status || "Not started",
    });

    setOfficeProductionLoading(false);
  };

  const saveOfficeProductionSetup = async (lead: any) => {
    setOfficeProductionError("");
    setOfficeProductionSaved(false);

    if (lead?._sample) {
      window.alert(
        "Sample production setup saved for preview only. No live data was changed."
      );
      setOfficeProductionSaved(true);
      return;
    }

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeProductionError("Premier staff access is missing.");
      return;
    }

    setOfficeProductionSaving(true);

    const { data, error } = await supabase.rpc(
      "save_premier_production_setup",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
        p_material_status: officeProductionDraft.materialStatus,
        p_material_eta: officeProductionDraft.materialEta || null,
        p_permit_status: officeProductionDraft.permitStatus,
      }
    );

    if (error || data !== true) {
      console.error("Premier production setup save failed:", error);
      setOfficeProductionError("Could not save production setup.");
      setOfficeProductionSaving(false);
      return;
    }

    const nextAction =
      ["Received", "On Hand", "Not Required"].includes(officeProductionDraft.materialStatus) &&
      ["Approved", "Not required"].includes(
        officeProductionDraft.permitStatus
      )
        ? "RJ to confirm customer appointment and assign installer / crew."
        : ["Received", "On Hand", "Not Required"].includes(officeProductionDraft.materialStatus)
        ? "Office to complete permit setup."
        : ["Approved", "Not required"].includes(
            officeProductionDraft.permitStatus
          )
        ? "Office to monitor material status."
        : "Office to continue ordering/materials and permit setup.";

    setLiveLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              next_action: nextAction,
            }
          : item
      )
    );

    setOfficeProductionSaving(false);
    setOfficeProductionConfirmedStatus(officeProductionDraft.materialStatus);
    setOfficePermitConfirmedStatus(officeProductionDraft.permitStatus);
    setOfficeProductionSaved(true);
  };

  const loadOfficeRjRelease = async (lead: any) => {
    setOfficeRjRelease(null);
    setOfficeRjSent(false);
    setOfficeRjError("");

    const accessToken = getPremierOfficeAccessToken();
    if (!accessToken || lead?._sample) return;

    const { data, error } = await supabase.rpc(
      "get_premier_office_rj_release",
      { p_access_token: accessToken, p_job_id: lead.id }
    );

    if (error) {
      setOfficeRjError("Could not check RJ handoff status.");
      return;
    }

    const row = data?.[0];
    if (row?.released_at) {
      setOfficeRjRelease({
        jobId: lead.id,
        releasedAt: row.released_at,
        releasedBy: row.released_by || "Office",
      });
      setOfficeRjSent(true);
    }
  };

  const sendOfficeJobToRJ = async (lead: any) => {
    setOfficeRjError("");
    setOfficeRjSent(false);

    if (lead?._sample) {
      setOfficeRjError("Sample jobs cannot be sent.");
      return;
    }

    const accessToken = getPremierOfficeAccessToken();
    if (!accessToken) {
      setOfficeRjError("Office access is missing.");
      return;
    }

    setOfficeRjSending(true);

    try {
      const { data, error } = await supabase.rpc(
        "send_premier_job_to_rj",
        { p_access_token: accessToken, p_job_id: lead.id }
      );

      if (error || data !== true) {
        setOfficeRjError(
          error?.message ||
          "Could not send to RJ. Check materials, 40% payment, and permit status."
        );
        return;
      }

      setOfficeRjSent(true);
    } catch (error) {
      console.error("Office to RJ handoff failed:", error);
      setOfficeRjError("Could not send to RJ.");
    } finally {
      setOfficeRjSending(false);
    }
  };

  const saveOfficeInstallSchedule = async (lead: any) => {
    setOfficeInstallError("");
    setOfficeInstallSaved(false);

    if (!officeInstallDraft.crew || !officeInstallDraft.scheduledFor) {
      setOfficeInstallError("Choose a crew and installation date/time.");
      return;
    }

    if (lead?._sample) {
      window.alert(
        "Sample installation schedule saved for preview only. No live data was changed."
      );
      setOfficeInstallSaved(true);
      return;
    }

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeInstallError("Premier staff access is missing.");
      return;
    }

    setOfficeInstallSaving(true);

    const { data, error } = await supabase.rpc(
      "save_premier_install_schedule",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
        p_crew: officeInstallDraft.crew,
        p_scheduled_for: new Date(
          officeInstallDraft.scheduledFor
        ).toISOString(),
      }
    );

    if (error || data !== true) {
      console.error("Premier install schedule save failed:", error);
      setOfficeInstallError("Could not save installation schedule.");
      setOfficeInstallSaving(false);
      return;
    }

    setLiveLeads((current) =>
      current.filter((item) => item.id !== lead.id)
    );

    setOfficeInstallSaving(false);
    setOfficeInstallSaved(true);
    setOfficeWorkLeadId(null);
    setOfficeWorkView(null);
  };

  const loadBlueFolderConfirmation = async (lead: any) => {
    setBlueFolderError("");
    setBlueFolderState(null);
    if (lead?._sample) return;
    const token = getPremierOfficeAccessToken();
    if (!token) { setBlueFolderError("Office staff access is missing."); return; }
    setBlueFolderLoading(true);
    const { data, error } = await supabase.rpc("get_premier_blue_folder_confirmation", {
      p_access_token: token, p_job_id: lead.id,
    });
    if (error) setBlueFolderError("Blue Folder status unavailable. Confirm backend installation before proceeding.");
    else {
      const result = Array.isArray(data) ? data[0] : data;
      setBlueFolderState({jobId: lead.id, confirmedAt: result?.confirmed_at ?? null, confirmedBy: result?.confirmed_by ?? null});
    }
    setBlueFolderLoading(false);
  };

  const confirmBlueFolder = async (lead: any) => {
    setBlueFolderError("");
    if (lead?._sample) return;
    const token = getPremierOfficeAccessToken();
    if (!token) { setBlueFolderError("Office staff access is missing."); return; }
    setBlueFolderSaving(true);
    const { data, error } = await supabase.rpc("confirm_premier_blue_folder", {
      p_access_token: token, p_job_id: lead.id,
    });
    setBlueFolderSaving(false);
    if (error || data !== true) {
      setBlueFolderError("Could not confirm the Blue Folder. Verify the 50% payment is received and all documents are ready.");
      return;
    }
    await loadBlueFolderConfirmation(lead);
  };

  const startOfficeProductionSetup = async (lead: any) => {
    setOfficeApprovedSetupError("");

    if (lead?._sample) {
      window.alert(
        "Sample production handoff preview only. No live data was changed."
      );
      return;
    }

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeApprovedSetupError("Premier staff access is missing.");
      return;
    }

    if (blueFolderLoading || blueFolderState?.jobId !== lead.id || !blueFolderState.confirmedAt) {
      setOfficeApprovedSetupError("Office must confirm the Blue Folder before starting production.");
      return;
    }

    setOfficeProductionStarting(true);

    const { data, error } = await supabase.rpc(
      "start_premier_production_setup",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
      }
    );

    if (error || data !== true) {
      console.error("Premier production setup start failed:", error);
      setOfficeApprovedSetupError(
        "Could not start production setup. Please try again."
      );
      setOfficeProductionStarting(false);
      return;
    }

    setLiveLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              current_stage: "production_setup",
              next_action:
                "Office to start ordering/materials and permit setup.",
              latest_sales_note:
                "Approved job moved into production setup.",
            }
          : item
      )
    );

    setOfficeProductionStarting(false);
    setOfficeWorkLeadId(null);
    setOfficeWorkView(null);
    setOpenLeadId(null);
  };

  const saveOfficeInspectionSchedule = async (lead: any) => {
    setOfficeInspectionError("");

    if (!officeInspectionDraft.scheduledDate) {
      setOfficeInspectionError("Choose the final walkthrough date.");
      return;
    }

    if (!officeInspectionDraft.window) {
      setOfficeInspectionError("Choose the inspection time window.");
      return;
    }

    if (officeInspectionDraft.window === "Specific Time" && !officeInspectionDraft.specificTime) {
      setOfficeInspectionError("Choose the specific appointment time.");
      return;
    }

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeInspectionError("Premier staff access is missing.");
      return;
    }

    setOfficeInspectionSaving(true);

    const { data, error } = await supabase.rpc(
      "save_premier_inspection_schedule",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
        p_inspection_type: "Final Walkthrough",
        p_assigned_to: officeInspectionDraft.assignedTo,
        p_scheduled_for: null,
        p_scheduled_date: officeInspectionDraft.scheduledDate,
        p_inspection_window: officeInspectionDraft.window === "Specific Time"
          ? (() => {
              const [hourText, minuteText] = officeInspectionDraft.specificTime.split(":");
              const hour = Number(hourText);
              return `${hour % 12 || 12}:${minuteText} ${hour >= 12 ? "PM" : "AM"}`;
            })()
          : officeInspectionDraft.window,
      }
    );

    if (error || data !== true) {
      console.error("Premier inspection scheduling failed:", error);
      setOfficeInspectionError("Could not schedule final walkthrough.");
      setOfficeInspectionSaving(false);
      return;
    }

    // Keep scheduled jobs visible in Office Command Center; update the card in place.
    setLiveLeads((current) => current.map((item) => item.id === lead.id ? {
      ...item, current_stage: "inspection_scheduled",
      next_action: `Final walkthrough scheduled with ${officeInspectionDraft.assignedTo}. Await walkthrough outcome.`,
    } : item));

    setOfficeInspectionDraft({
      type: "Final Walkthrough",
      scheduledDate: "",
      window: "Morning Window",
      specificTime: "",
      assignedTo: "RJ",
    });

    setOfficeInspectionSaving(false);
    setOfficeWorkLeadId(null);
    setOfficeWorkView(null);
    setOpenLeadId(null);
  };

  const saveOfficeFinalMeasurement = async (lead: any) => {
    setOfficeApprovedSetupError("");
    setOfficeFinalMeasureSaved(false);

    if (lead?._sample) {
      window.alert(
        "Sample final measurement scheduled for preview only. No live data was changed."
      );
      setOfficeFinalMeasureSaved(true);
      return;
    }

    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeApprovedSetupError("Premier staff access is missing.");
      return;
    }

    const assignedSalesperson = String(
      lead?.assigned_salesperson || ""
    ).trim();

    const selectedAssignee = String(
      officeFinalMeasureDraft.assignedTo || assignedSalesperson
    ).trim();

    const finalMeasureAssignee =
      selectedAssignee === "Gino Marquez" || selectedAssignee === "Gino"
        ? "Gino"
        : selectedAssignee === "Dennis Dillon" || selectedAssignee === "Dennis"
        ? "Dennis"
        : selectedAssignee === "Gio Richardson" || selectedAssignee === "Gio"
        ? "Gio"
        : "";
    if (!finalMeasureAssignee) {
      setOfficeApprovedSetupError(
        "This job needs an assigned salesperson before Final Measurement can be scheduled."
      );
      return;
    }

    if (finalMeasureSchedulingMode !== "coordinate" && finalMeasureSchedulingMode !== "specific" && !finalMeasureWindowDate) {
      setOfficeApprovedSetupError("Choose the requested date for the measurement window.");
      return;
    }
    if (finalMeasureSchedulingMode === "specific" && !officeFinalMeasureDraft.scheduledFor) {
      setOfficeApprovedSetupError("Choose the confirmed date and time.");
      return;
    }
    const parsedScheduledFor = finalMeasureSchedulingMode === "specific"
      ? new Date(officeFinalMeasureDraft.scheduledFor) : null;
    if (parsedScheduledFor && Number.isNaN(parsedScheduledFor.getTime())) {
      setOfficeApprovedSetupError("Enter a valid final measurement date and time.");
      return;
    }
    // Window/coordination requests do NOT invent an appointment timestamp.
    const scheduledFor = parsedScheduledFor ? parsedScheduledFor.toISOString() : null;
    const requestLabel = finalMeasureSchedulingMode === "coordinate"
      ? "Leave scheduling to salesperson — coordinate with customer; appointment not confirmed."
      : finalMeasureSchedulingMode === "morning"
      ? `Requested morning window on ${finalMeasureWindowDate}; exact appointment not confirmed.`
      : finalMeasureSchedulingMode === "afternoon"
      ? `Requested afternoon window on ${finalMeasureWindowDate}; exact appointment not confirmed.`
      : "Specific appointment confirmed by Office.";
    const finalMeasureNote = [requestLabel, officeFinalMeasureDraft.note.trim()].filter(Boolean).join("\n");


    setOfficeFinalMeasureSaving(true);

    const { data, error } = await supabase.rpc(
      "save_premier_final_measurement",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
        p_status: "scheduled",
        p_scheduled_for: scheduledFor,
        p_assigned_to: finalMeasureAssignee,
        p_completed_at: null,
        p_note: finalMeasureNote,
      }
    );

    if (error || data !== true) {
      console.error("Premier final measurement scheduling failed:", error);
      setOfficeApprovedSetupError(
        "Could not schedule the Final Measurement."
      );
      setOfficeFinalMeasureSaving(false);
      return;
    }

    setOfficeFinalMeasureDraft((current) => ({
      ...current,
      status: "scheduled",
      scheduledFor: finalMeasureSchedulingMode === "specific" ? current.scheduledFor : "",
      assignedTo: finalMeasureAssignee,
      completedDate: "",
    }));

    setOfficeFinalMeasureSaving(false);
    setOfficeFinalMeasureSaved(true);
  };

  const loadOfficeMeasurementReview = async (lead: any) => {
    setOfficeMeasurementError("");
    setOfficeMeasurementLoading(true);

    if (lead?._sample) {
      const sampleOpenings = [
        {
          id: "sample-office-opening-1",
          opening_number: 1,
          opening_type: "Window",
          location: "Living Room",
          width_text: "44",
          height_text: "72 1/2",
          notes: "Rough opening. Stucco exterior.",
        },
        {
          id: "sample-office-opening-2",
          opening_number: 2,
          opening_type: "Window",
          location: "Dining Room",
          width_text: "43",
          height_text: "72",
          notes: "Stucco exterior.",
        },
        {
          id: "sample-office-opening-3",
          opening_number: 3,
          opening_type: "Sliding Door",
          location: "Rear Patio",
          width_text: "72",
          height_text: "80",
          notes: "Photo still needed before final review.",
        },
      ];

      setOfficeMeasurementOpenings(sampleOpenings);
      setOfficeMeasurementPhotos({
        "sample-office-opening-1": [
          { path: "sample-1", url: "" },
        ],
        "sample-office-opening-2": [
          { path: "sample-2", url: "" },
        ],
        "sample-office-opening-3": [],
      });
      setOfficeMeasurementLoading(false);
      return;
    }

    const accessToken =
      getPremierOfficeAccessToken();

    if (!accessToken) {
      setOfficeMeasurementOpenings([]);
      setOfficeMeasurementPhotos({});
      setOfficeMeasurementError("Premier staff access is missing.");
      setOfficeMeasurementLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc(
      "get_premier_measurement_openings",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
      }
    );

    if (error) {
      console.error("Premier Office measurement review failed:", error);
      setOfficeMeasurementOpenings([]);
      setOfficeMeasurementPhotos({});
      setOfficeMeasurementError("Could not load saved measurements.");
      setOfficeMeasurementLoading(false);
      return;
    }

    const openings = data ?? [];
    setOfficeMeasurementOpenings(openings);

    const photoEntries = await Promise.all(
      openings.map(async (opening: any) => {
        const { data: photoData, error: photoError } =
          await supabase.functions.invoke("premier-opening-photo", {
            body: {
              action: "list",
              accessToken,
              jobId: lead.id,
              openingId: opening.id,
            },
          });

        if (photoError) {
          console.error(
            `Premier Office photo list failed for opening ${opening.opening_number}:`,
            photoError
          );

          return [opening.id, []] as const;
        }

        return [opening.id, photoData?.photos ?? []] as const;
      })
    );

    setOfficeMeasurementPhotos(Object.fromEntries(photoEntries));
    setOfficeMeasurementLoading(false);
  };

  const setLeadDraftField = (
    leadId: string,
    field: string,
    value: string
  ) => {
    setLeadDrafts((current) => ({
      ...current,
      [leadId]: {
        ...(current[leadId] ?? {}),
        [field]: value,
      },
    }));
  };

  const saveLeadDecision = async (lead: any) => {
    if (!lead || savingLeadDecisionId) return;

    const accessToken = getPremierOfficeAccessToken();
    if (!accessToken) {
      window.alert("Premier staff access is missing.");
      return;
    }

    if (lead.current_stage !== "new_lead") {
      window.alert("Only New Leads can be assigned here.");
      return;
    }

    const salesperson = (
      leadDrafts[lead.id]?.salesperson ??
      lead.assigned_salesperson ??
      ""
    ).trim();

    if (!salesperson) {
      window.alert("Choose a salesperson before sending this lead.");
      return;
    }

    setSavingLeadDecisionId(lead.id);

    const { data, error } = await supabase.rpc("assign_premier_lead", {
      p_access_token: accessToken,
      p_job_id: lead.id,
      p_salesperson: salesperson,
    });

    if (error || data !== true) {
      console.error("Premier salesperson assignment failed:", error);
      window.alert("Could not assign salesperson. Please try again.");
      setSavingLeadDecisionId(null);
      return;
    }

    setLiveLeads((current) =>
      current.map((item) =>
        item.id === lead.id
          ? {
              ...item,
              assigned_salesperson: salesperson,
              next_action: `${salesperson} to contact customer and schedule measurement.`,
              current_stage: "new_lead",
            }
          : item
      )
    );

    setLeadDrafts((current) => {
      const next = { ...current };
      delete next[lead.id];
      return next;
    });

    setOpenLeadId(null);
    setSavingLeadDecisionId(null);
  };
  const relayRevisedProposalToSales = async (lead: any) => {
    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      window.alert("Premier staff access is missing.");
      return;
    }

    setSavingLeadDecisionId(lead.id);

    const { data, error } = await supabase.rpc(
      "relay_premier_revised_proposal_ready",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
      }
    );

    if (error || data !== true) {
      console.error("Premier revised proposal relay failed:", error);
      window.alert("Could not return the revised proposal to Sales.");
      setSavingLeadDecisionId(null);
      return;
    }

    setLiveLeads((current) =>
      current.filter((item) => item.id !== lead.id)
    );

    setOfficeWorkLeadId(null);
    setOfficeWorkView(null);
    setOpenLeadId(null);
    setSavingLeadDecisionId(null);
  };

  const relayProposalToSales = async (lead: any) => {
    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      window.alert("Premier staff access is missing.");
      return;
    }

    setSavingLeadDecisionId(lead.id);

    const { data, error } = await supabase.rpc(
      "relay_premier_proposal_ready",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
      }
    );

    if (error || data !== true) {
      console.error("Premier proposal relay failed:", error);
      window.alert("Could not send the proposal back to Sales.");
      setSavingLeadDecisionId(null);
      return;
    }

    setLiveLeads((current) =>
      current.filter((item) => item.id !== lead.id)
    );

    setOpenLeadId(null);
    setSavingLeadDecisionId(null);
  };
  const loadWorkHistory = async (searchValue = workHistorySearch) => {
    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      setWorkHistoryRows([]);
      setWorkHistoryError("Premier staff access token missing.");
      return;
    }

    setWorkHistoryLoading(true);
    setWorkHistoryError("");

    const { data, error } = await supabase.rpc("get_premier_work_history", {
      p_access_token: accessToken,
      p_search: searchValue.trim() || null,
    });

    if (error) {
      console.error("Premier Work History load failed:", error);
      setWorkHistoryRows([]);
      setWorkHistoryError("Could not load Work History.");
      setWorkHistoryLoading(false);
      return;
    }

    setWorkHistoryRows(data ?? []);
    setWorkHistoryLoading(false);
  };

  const openWorkHistory = async () => {
    setWorkHistoryOpen(true);
    await loadWorkHistory("");
  };

  const restoreArchivedJob = async (job: any) => {
    if (!job || restoringJobId) return;

    const confirmed = window.confirm(
      `Restore ${job.first_name} ${job.last_name} to the active Office board?`
    );

    if (!confirmed) return;

    const accessToken = getPremierOfficeAccessToken();

    if (!accessToken) {
      window.alert("Premier staff access token missing.");
      return;
    }

    setRestoringJobId(job.id);

    const { data, error } = await supabase.rpc("restore_premier_job", {
      p_access_token: accessToken,
      p_job_id: job.id,
    });

    setRestoringJobId(null);

    if (error) {
      console.error("Premier job restore failed:", error);
      window.alert(error.message || "This job could not be restored.");
      return;
    }

    if (data !== true) {
      window.alert("This job could not be restored.");
      return;
    }

    setWorkHistoryRows((current) =>
      current.filter((item) => item.id !== job.id)
    );

    setLiveLeads((current) => {
      if (current.some((item) => item.id === job.id)) return current;

      return [
        {
          ...job,
          is_archived: false,
          archived_at: null,
        },
        ...current,
      ];
    });
  };
  const officeWorkLeadIdRef = useRef(officeWorkLeadId);
  officeWorkLeadIdRef.current = officeWorkLeadId;
  useEffect(() => {
    let active = true;

    const loadLiveLeads = async () => {
      setLiveLeadsLoading(true);

      const accessToken = getPremierOfficeAccessToken();
      console.log("Premier Office access token present:", Boolean(accessToken));

      if (!accessToken) {
        console.warn("Premier staff access token missing.");
        setLiveLeads([]);
        setLiveLeadsLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("get_premier_office_inbox", {
        p_access_token: accessToken,
      });
      console.log("Premier Office RPC result:", { data, error });

      if (!active) return;

      if (error) {
        console.error("Premier live leads load failed:", error);
        setLiveLeads([]);
      } else {
        setLiveLeads(data ?? []);
      }

      setLiveLeadsLoading(false);
    };

    loadLiveLeads();
    // Poll only while the Office work drawer is closed, preserving unsaved form inputs.
    const refreshTimer = window.setInterval(() => {
      if (!document.hidden && !officeWorkLeadIdRef.current) loadLiveLeads();
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, []);
  const [activeJobId, setActiveJobId] = useState<string | null>("PW-1048");

  const [activeAction, setActiveAction] = useState<
    "update" | "photo" | "schedule" | null
  >(null);

  const [updateText, setUpdateText] = useState("");
  const [demoUpdates, setDemoUpdates] = useState<
    { time: string; event: string }[]
  >([]);

  const [photoCategory, setPhotoCategory] = useState("Before");
  const [photoCounts, setPhotoCounts] = useState<Record<string, number>>({
    Before: 6,
    Measurements: 12,
    "Permit / Inspection": 4,
    Installation: 0,
    Problems: 0,
    After: 0,
  });

  const [scheduledCrew, setScheduledCrew] = useState("Not assigned");
  const [scheduledDate, setScheduledDate] = useState("Not scheduled");

  const activeJob = useMemo(
    () => jobs.find((job) => job.id === activeJobId) ?? null,
    [activeJobId]
  );

  const effectiveCrew =
    scheduledCrew === "Not assigned" ? activeJob?.crew ?? "Not assigned" : scheduledCrew;

  const effectiveSchedule =
    scheduledDate === "Not scheduled"
      ? activeJob?.scheduledDate ?? "Not scheduled"
      : scheduledDate;

  const isScheduled =
    effectiveCrew !== "Not assigned" &&
    effectiveSchedule !== "Not scheduled" &&
    effectiveSchedule !== "Pending material";

  const effectiveStatus = isScheduled
    ? "Scheduled"
    : activeJob?.status ?? "Needs Attention";

  const attentionItems = [
    effectiveCrew === "Not assigned" ? "Crew needs assignment." : null,
    activeJob?.materialEta !== "Received"
      ? "Confirm material arrival before installation."
      : null,
  ].filter(Boolean) as string[];

  const effectiveNextAction =
    effectiveCrew === "Not assigned"
      ? "Assign crew"
      : activeJob?.materialEta !== "Received"
      ? "Confirm material arrival"
      : effectiveStatus === "Scheduled"
      ? "Prepare crew for installation"
      : effectiveStatus === "In Progress"
      ? "Complete installation and required proof"
      : effectiveStatus === "Inspection"
      ? "Complete inspection requirements"
      : effectiveStatus === "Payment"
      ? "Collect remaining balance"
      : effectiveStatus === "Complete"
      ? "Job complete"
      : activeJob?.nextAction ?? "Review job";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #111820 0%, #0b0f13 42%, #07090c 100%)",
        color: "#f5f7f5",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          margin: "0 auto",
          padding: "28px 18px 80px",
        }}
      >
        <header style={{ marginBottom: 26 }}>
          <div
            style={{
              color: "#9db7ca",
              fontWeight: 800,
              fontSize: 12,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Premier Window & Door
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 52px)",
              lineHeight: 1,
              margin: 0,
            }}
          >
            Office Command Center
          </h1>

          {officeGreeting ? (
            <div
              style={{
                marginTop: 8,
                color: "#b7dec4",
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              {officeGreeting}
            </div>
          ) : null}

          <p
            style={{
              margin: "10px 0 0",
              color: "#aab2ab",
              maxWidth: 700,
              fontSize: 15,
            }}
          >
            One place for the job, the material, the permit, the crew, the proof,
            and what happens next.
          </p>
        </header>

        {officePersonalBeamMessages.some((message) => !message.read_at) ? (
          <section
            style={{
              border: "1px solid #78aa88",
              borderRadius: 16,
              background: "linear-gradient(135deg, #173225 0%, #101b16 100%)",
              padding: 12,
              marginBottom: 14,
              boxShadow: "0 0 0 1px rgba(139,184,154,0.08), 0 8px 24px rgba(0,0,0,0.18)",
            }}
          >
            {(() => {
              const message =
                officePersonalBeamMessages.find((item) => !item.read_at) ?? null;

              if (!message) return null;

              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div style={{ color: "#9fd3ae", fontSize: 10, fontWeight: 900, letterSpacing: 1, textTransform: "uppercase" }}>
                        Beam | New Message
                      </div>

                      <div style={{ color: "#ffffff", fontSize: 14, fontWeight: 900, marginTop: 4 }}>
                        {message.first_name} {message.last_name}
                      </div>

                      <div style={{ color: "#91a59a", fontSize: 10, marginTop: 2 }}>
                        {message.project_address}
                      </div>
                    </div>

                    <div style={{ color: "#9fd3ae", fontSize: 10, fontWeight: 800 }}>
                      For you
                    </div>
                  </div>

                  <div style={{ marginTop: 8, color: "#8fb49b", fontSize: 10, fontWeight: 800 }}>
                    From {message.sender_label}
                  </div>

                  <div style={{ marginTop: 8, border: "1px solid #294a36", borderRadius: 10, background: "#0d1711", padding: 10, color: "#e5eee8", fontSize: 12, lineHeight: 1.45 }}>
                    {message.body}
                  </div>

                  {officePersonalBeamReplyOpenId === message.id ? (
                    <div style={{ marginTop: 10, border: "1px solid #31533c", borderRadius: 10, background: "#101a13", padding: 10 }}>
                      <div style={{ color: "#9fd3ae", fontSize: 9, fontWeight: 900, marginBottom: 7 }}>
                        Reply to {message.sender_label}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 46px", gap: 8 }}>
                        <textarea
                          value={officePersonalBeamReplyBody}
                          onChange={(event) => setOfficePersonalBeamReplyBody(event.target.value)}
                          placeholder={officePersonalBeamReplyListening ? "Listening..." : "Type or tap the mic and talk..."}
                          rows={2}
                          style={{
                            width: "100%",
                            minHeight: 54,
                            boxSizing: "border-box",
                            resize: "vertical",
                            border: "1px solid #477057",
                            borderRadius: 9,
                            background: "#0d1711",
                            color: "#e5eee8",
                            padding: "9px 10px",
                            fontSize: 12,
                          }}
                        />

                        <button
                          type="button"
                          onClick={startOfficePersonalBeamReplyVoiceInput}
                          disabled={officePersonalBeamReplyListening}
                          style={{
                            border: officePersonalBeamReplyListening
                              ? "1px solid #d98778"
                              : "1px solid #8fbea0",
                            borderRadius: 9,
                            background: officePersonalBeamReplyListening
                              ? "#7a2d24"
                              : "#2f6842",
                            color: "#ffffff",
                            fontSize: 20,
                            cursor: officePersonalBeamReplyListening
                              ? "wait"
                              : "pointer",
                            boxShadow: officePersonalBeamReplyListening
                              ? "0 0 0 2px rgba(217,135,120,0.18), 0 0 18px rgba(217,135,120,0.22)"
                              : "none",
                          }}
                        >
                          ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¤
                        </button>
                      </div>

                      {officePersonalBeamReplyError ? (
                        <div style={{ color: "#d8b267", fontSize: 10, marginTop: 7 }}>
                          {officePersonalBeamReplyError}
                        </div>
                      ) : null}

                      <button
                        type="button"
                        disabled={
                          officePersonalBeamReplySending ||
                          !officePersonalBeamReplyBody.trim()
                        }
                        onClick={() => void sendOfficePersonalBeamReply(message)}
                        style={{
                          width: "100%",
                          minHeight: 38,
                          marginTop: 8,
                          border: "1px solid #8fbea0",
                          borderRadius: 9,
                          background: "#2f6842",
                          color: "#ffffff",
                          fontWeight: 900,
                        }}
                      >
                        {officePersonalBeamReplySending
                          ? "Sending..."
                          : `Send to ${message.sender_label}`}
                      </button>
                    </div>
                  ) : null}

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginTop: 9 }}>
                    <div style={{ color: "#71887a", fontSize: 9 }}>
                      {new Date(message.created_at).toLocaleString()}
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => {
                          const nextOpen =
                            officePersonalBeamReplyOpenId === message.id
                              ? null
                              : message.id;

                          setOfficePersonalBeamReplyOpenId(nextOpen);
                          setOfficePersonalBeamReplyBody("");
                          setOfficePersonalBeamReplyError("");
                        }}
                        style={{
                          minHeight: 34,
                          border: "1px solid #78aa88",
                          borderRadius: 9,
                          background: "#173225",
                          color: "#cce8d4",
                          padding: "0 12px",
                          fontSize: 10,
                          fontWeight: 900,
                        }}
                      >
                        {officePersonalBeamReplyOpenId === message.id
                          ? "Close Reply"
                          : "Reply"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void markOfficePersonalBeamRead(message.id)}
                        style={{
                          minHeight: 34,
                          border: "1px solid #78aa88",
                          borderRadius: 9,
                          background: "#2f6842",
                          color: "#ffffff",
                          padding: "0 12px",
                          fontSize: 10,
                          fontWeight: 900,
                        }}
                      >
                        Mark Read
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </section>
        ) : officePersonalBeamLoading ? (
          <div style={{ color: "#71887a", fontSize: 10, marginBottom: 10 }}>
            Loading Beam...
          </div>
        ) : officePersonalBeamError ? (
          <div style={{ color: "#d8b267", fontSize: 10, marginBottom: 10 }}>
            {officePersonalBeamError}
          </div>
        ) : null}


        <section style={{ marginBottom: 22 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
              gap: 10,
            }}
          >
            {lanes.map((lane) => {
              const count = liveLeads.filter((job) => {
                const stage = String(job.current_stage || "");
                if (lane === "Needs Attention") return stage === "proposal_revision" || officeIssueJobIds.includes(String(job.id));
                if (lane === "Waiting on Material") return stage === "production_setup";
                if (lane === "Ready to Schedule") return stage === "installation_ready";
                if (lane === "Scheduled") return stage === "scheduled" || stage === "installation_scheduled";
                if (lane === "In Progress") return stage === "installation_in_progress" || stage === "installer_finish_back";
                if (lane === "Inspection") return stage === "installation_complete" || stage === "inspection_complete";
                if (lane === "Payment") return stage === "hundred_percent_complete";
                if (lane === "Complete") return stage === "closed" || stage === "completed";
                return false;
              }).length;

              return (
                <div
                  key={lane}
                  style={{
                    minHeight: 74,
                    border: "1px solid #252d34",
                    borderRadius: 14,
                    background: "#101419",
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca5ad",
                      marginBottom: 7,
                      lineHeight: 1.25,
                    }}
                  >
                    {lane}
                  </div>

                  <strong
                    style={{
                      fontSize: 24,
                      lineHeight: 1,
                      color: "#f3f6f8",
                    }}
                  >
                    {count}
                  </strong>
                </div>
              );
            })}
          </div>
        </section>

        <section
          style={{
            marginBottom: 24,
            border: "1px solid #31495a",
            borderRadius: 16,
            background: "#111820",
            padding: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  color: "#8fa9bc",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}
              >
                Live Intake
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    color: "#f3f6f8",
                    fontSize: 22,
                    fontWeight: 800,
                  }}
                >
                  Office Inbox
                </div>

                <div
                  style={{
                    color: "#7f8b95",
                    fontSize: 13,
                  }}
                >
                  Live handoffs waiting on Office
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <a
                href="/planet/premier-window-door/intake"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 40,
                  boxSizing: "border-box",
                  padding: "0 14px",
                  border: "1px solid #557c64",
                  borderRadius: 10,
                  background: "#193c2b",
                  color: "#ffffff",
                  fontSize: 12,
                  fontWeight: 900,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                New Customer Intake
              </a>
              <button
                type="button"
                onClick={() => {
                  if (workHistoryOpen) {
                    setWorkHistoryOpen(false);
                  } else {
                    void openWorkHistory();
                  }
                }}
                style={{
                  minHeight: 40,
                  border: "1px solid #486578",
                  borderRadius: 10,
                  background: workHistoryOpen ? "#1b2c38" : "#101419",
                  color: "#d9e5ee",
                  padding: "0 13px",
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {workHistoryOpen ? "Close History" : "Work History"}
              </button>

              <div
                style={{
                  minWidth: 40,
                  height: 40,
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  background: "#16232d",
                  border: "1px solid #486578",
                  color: "#9db7ca",
                  fontWeight: 900,
                  fontSize: 16,
                }}
              >
                {previewOfficeLeads.length}
              </div>

              {previewOfficeLeads.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => scrollLiveLeads("left")}
                    aria-label="Previous leads"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      border: "1px solid #31495a",
                      background: "#101419",
                      color: "#d9e5ee",
                      fontSize: 21,
                      cursor: "pointer",
                    }}
                  >
                    {"\u2039"}
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollLiveLeads("right")}
                    aria-label="Next leads"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      border: "1px solid #31495a",
                      background: "#101419",
                      color: "#d9e5ee",
                      fontSize: 21,
                      cursor: "pointer",
                    }}
                  >
                    {"\u203A"}</button>
                </>
              ) : null}
            </div>
          </div>

          {workHistoryOpen ? (
            <div
              style={{
                border: "1px solid #31495a",
                borderRadius: 12,
                background: "#0d141a",
                padding: 14,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                <input
                  type="text"
                  value={workHistorySearch}
                  onChange={(event) => setWorkHistorySearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void loadWorkHistory(workHistorySearch);
                    }
                  }}
                  placeholder="Search name, phone, email, or address"
                  style={{
                    flex: "1 1 260px",
                    minHeight: 42,
                    border: "1px solid #31495a",
                    borderRadius: 9,
                    background: "#101820",
                    color: "#f3f6f8",
                    padding: "0 12px",
                  }}
                />

                <button
                  type="button"
                  disabled={workHistoryLoading}
                  onClick={() => void loadWorkHistory(workHistorySearch)}
                  style={{
                    minHeight: 42,
                    border: "1px solid #486578",
                    borderRadius: 9,
                    background: "#16232d",
                    color: "#d9e5ee",
                    padding: "0 14px",
                    fontWeight: 900,
                    cursor: workHistoryLoading ? "wait" : "pointer",
                    opacity: workHistoryLoading ? 0.65 : 1,
                  }}
                >
                  {workHistoryLoading ? "Searching..." : "Search"}
                </button>

                {workHistorySearch ? (
                  <button
                    type="button"
                    onClick={() => {
                      setWorkHistorySearch("");
                      void loadWorkHistory("");
                    }}
                    style={{
                      minHeight: 42,
                      border: "1px solid #31495a",
                      borderRadius: 9,
                      background: "#101419",
                      color: "#aebbc5",
                      padding: "0 12px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Clear
                  </button>
                ) : null}
              </div>

              {workHistoryError ? (
                <div style={{ color: "#e1a3a3", fontSize: 12, marginBottom: 10 }}>
                  {workHistoryError}
                </div>
              ) : null}

              {workHistoryLoading ? (
                <div style={{ color: "#9ca8b2", fontSize: 13 }}>
                  Loading Work History...
                </div>
              ) : workHistoryRows.length === 0 ? (
                <div
                  style={{
                    border: "1px dashed #263945",
                    borderRadius: 10,
                    padding: 14,
                    color: "#7f8b95",
                    fontSize: 13,
                  }}
                >
                  No work history found.
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {workHistoryRows.map((job) => (
                    <div
                      key={job.id}
                      style={{
                        border: "1px solid #263945",
                        borderRadius: 11,
                        background: "#101419",
                        padding: 13,
                      }}
                    >
                      <div style={{ color: "#f3f6f8", fontSize: 15, fontWeight: 900 }}>
                        {job.first_name} {job.last_name}
                      </div>

                      <div style={{ color: "#9ca8b2", fontSize: 12, marginTop: 4 }}>
                        {job.phone || "No phone"}
                        {job.email ? ` | ${job.email}` : ""}
                      </div>

                      <div style={{ color: "#b8c4cc", fontSize: 12, marginTop: 4 }}>
                        {job.project_address || "No project address"}
                      </div>

                      <div
                        style={{
                          color: "#9db7ca",
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          marginTop: 8,
                        }}
                      >
                        {(job.current_stage || "Archived").replaceAll("_", " ")}
                      </div>

                      <div style={{ color: "#667680", fontSize: 10, marginTop: 7 }}>
                        {job.archived_at
                          ? `Archived ${new Date(job.archived_at).toLocaleString()}`
                          : job.current_stage === "completed"
                          ? `Completed ${
                              job.updated_at
                                ? new Date(job.updated_at).toLocaleString()
                                : "date unavailable"
                            }`
                          : job.updated_at ? `Updated ${new Date(job.updated_at).toLocaleString()}` : "Date unavailable"}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const opening = historyOpenJobId !== job.id;
                          setHistoryOpenJobId(opening ? job.id : null);
                          setOfficeWorkLeadId(null);
                          setOfficeWorkView(null);
                          if (opening) void loadOfficeProductionSetup(job);
                        }}
                        style={{
                          width: "100%",
                          minHeight: 40,
                          marginTop: 11,
                          border: "1px solid #8fbea0",
                          borderRadius: 9,
                          background: "#2f6842",
                          color: "#ffffff",
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        {historyOpenJobId === job.id ? "Close Job" : "Open Job"}
                      </button>
                      {historyOpenJobId === job.id ? (
                        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                          <div style={{ fontSize: 12, color: "#b8c4cc" }}>
                            Office production information for this original job.
                            Opening does not restore or reassign it.
                          </div>
                          {officeProductionLoading ? (
                            <div>Loading production information...</div>
                          ) : (
                            <>
                              <label style={{ display: "grid", gap: 5 }}>
                                Materials / Order Status
                                <select
                                  style={{ background: "#16232d", color: "#ffffff", border: "1px solid #58788e", borderRadius: 8, minHeight: 42, padding: "0 10px" }}
                                  value={officeProductionDraft.materialStatus}
                                  disabled={!!job.archived_at || ["completed", "hundred_percent_complete"].includes(job.current_stage)}
                                  onChange={(e) => {
                                    setOfficeProductionSaved(false);
                                    setOfficeProductionDraft((v) => ({ ...v, materialStatus: e.target.value }));
                                  }}
                                >
                                  {['Not ordered', 'Ordered', 'In production', 'Received', 'On Hand', 'Not Required'].map((v) => <option key={v} value={v}>{v === 'In production' ? 'Being Made' : v}</option>)}
                                </select>
                              </label>
                              <label style={{ display: "grid", gap: 5 }}>
                                Material ETA
                                <input
                                  style={{ background: "#16232d", color: "#ffffff", colorScheme: "dark", border: "1px solid #58788e", borderRadius: 8, minHeight: 42, padding: "0 10px" }}
                                  type="date"
                                  value={officeProductionDraft.materialEta}
                                  disabled={!!job.archived_at || ["completed", "hundred_percent_complete"].includes(job.current_stage)}
                                  onChange={(e) => {
                                    setOfficeProductionSaved(false);
                                    setOfficeProductionDraft((v) => ({ ...v, materialEta: e.target.value }));
                                  }}
                                />
                              </label>
                              <label style={{ display: "grid", gap: 5 }}>
                                Permit Status
                                <select
                                  style={{ background: "#16232d", color: "#ffffff", border: "1px solid #58788e", borderRadius: 8, minHeight: 42, padding: "0 10px" }}
                                  value={officeProductionDraft.permitStatus}
                                  disabled={!!job.archived_at || ["completed", "hundred_percent_complete"].includes(job.current_stage)}
                                  onChange={(e) => {
                                    setOfficeProductionSaved(false);
                                    setOfficeProductionDraft((v) => ({ ...v, permitStatus: e.target.value }));
                                  }}
                                >
                                  {['Not started', 'Submitted', 'Approved', 'Not required'].map((v) => <option key={v} value={v}>{v}</option>)}
                                </select>
                              </label>
                              {officeProductionError ? <div style={{ color: "#e1a3a3" }}>{officeProductionError}</div> : null}
                              {officeProductionSaved ? <div style={{ color: "#9fd3ae" }}>Production information saved.</div> : null}
                              {!job.archived_at && !["completed", "hundred_percent_complete"].includes(job.current_stage) ? (
                                <button
                                  type="button"
                                  disabled={officeProductionSaving || officeProductionSaved || officeProductionLoading || !!officeProductionError}
                                  onClick={() => void saveOfficeProductionSetup(job)}
                                  style={{ minHeight: 42, background: "#2f6842", color: "white", borderRadius: 9, fontWeight: 900 }}
                                >
                                  {officeProductionSaving ? "Saving..." : "Save Materials / Permits"}
                                </button>
                              ) : <div style={{ fontSize: 12 }}>Archived or completed job. Production fields are read-only.</div>}
                            </>
                          )}
                        </div>
                      ) : null}
                      {job.archived_at ? (
                      <button
                        type="button"
                        disabled={restoringJobId === job.id}
                        onClick={() => void restoreArchivedJob(job)}
                        style={{
                          width: "100%",
                          minHeight: 40,
                          marginTop: 11,
                  border: "1px solid #8fbea0",
                          borderRadius: 9,
                  background: "#2f6842",
                  color: "#ffffff",
                          fontWeight: 900,
                          cursor: restoringJobId === job.id ? "wait" : "pointer",
                          opacity: restoringJobId === job.id ? 0.65 : 1,
                        }}
                      >
                        {restoringJobId === job.id
                          ? "Restoring..."
                          : "Restore to Active"}
                      </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {liveLeadsLoading ? (
            <div style={{ color: "#9ca8b2", fontSize: 14 }}>
              Loading Office Command Center...
            </div>
          ) : previewOfficeLeads.length === 0 ? (
            <div
              style={{
                border: "1px dashed #263945",
                borderRadius: 12,
                padding: 18,
                color: "#7f8b95",
                fontSize: 14,
              }}
            >
              Office Command Center is clear right now.
            </div>
          ) : (
            <div
              ref={liveLeadsScrollRef}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 10,
                paddingBottom: 4,
              }}
            >
              {previewOfficeLeads.map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    width: "100%",
                    border:                       lead.current_stage === "proposal_revision"                         ? "1px solid #80682f"                         : lead.current_stage === "proposal_approved"                         ? "1px solid #3d7459"                         : lead.current_stage === "proposal"                         ? "1px solid #3d7459"                         : lead.current_stage === "production_setup"                         ? "1px solid #58788e"                         : lead.current_stage === "installation_complete"                         ? "1px solid #3d7459"                         : "1px solid #31495a",
                    borderRadius: 12,
                    background: "#101419",
                    padding: 15,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 14,
                      alignItems: "flex-start",
                      marginBottom: 11,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#f3f6f8",
                          fontSize: 17,
                          fontWeight: 800,
                          marginBottom: 4,
                        }}
                      >
                        {lead.first_name} {lead.last_name}
                      </div>

                      <div
                        style={{
                          color: "#9ca8b2",
                          fontSize: 13,
                        }}
                      >
                        {lead.phone}
                      </div>
                    </div>

                    <div
                      style={{
                        color:                           lead.current_stage === "proposal_revision"                             ? "#e1c477"                             : lead.current_stage === "proposal_approved"                             ? "#9fd8b6"                             : lead.current_stage === "proposal"                             ? "#9fd8b6"                             : lead.current_stage === "production_setup"                             ? "#9db7ca"                             : "#9db7ca",
                        border:                           lead.current_stage === "proposal_revision"                             ? "1px solid #80682f"                             : lead.current_stage === "proposal_approved"                             ? "1px solid #3d7459"                             : lead.current_stage === "proposal"                             ? "1px solid #3d7459"                             : lead.current_stage === "production_setup"                             ? "1px solid #58788e"                             : "1px solid #31495a",
                        borderRadius: 999,
                        padding: "5px 8px",
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {lead.current_stage === "proposal_revision"                         ? "Needs Revision"                         : lead.current_stage === "proposal_approved"                         ? "Approved"                         : lead.current_stage === "proposal"                         ? "Measurements Complete"                         : lead.current_stage === "production_setup"                         ? "Production Setup"                         : lead.current_stage === "installation_in_progress" ? "Installation In Progress" : lead.current_stage === "installer_finish_back" ? "Final Finish Work" : lead.current_stage === "scheduled" ? "Scheduled Installation" : lead.current_stage === "installation_ready" ? "Installation Ready" : lead.current_stage === "installation_complete"                         ? "Installation Complete"                         : lead.current_stage === "inspection_scheduled" ? "Final Walkthrough Scheduled"                         : lead.current_stage === "inspection_complete"                         ? (String(lead.next_action || "").toLowerCase().includes("final walkthrough approved") ? "Final Walkthrough Approved" : "Inspection Complete")                         : lead.current_stage === "hundred_percent_complete"                         ? "100% Complete"                         : lead.current_stage === "completed" ? "Completed" : "New Lead"}
                    </div>
                  </div>

                  <div
                    style={{
                      color: "#b8c4cc",
                      fontSize: 13,
                      marginBottom: lead.intake_notes ? 10 : 0,
                    }}
                  >
                    {lead.project_address}
                  </div>

                  {lead.intake_notes ? (
                    <div
                      style={{
                        color: "#d9e5ee",
                        fontSize: 14,
                        lineHeight: 1.45,
                        marginBottom: 11,
                      }}
                    >
                      {lead.intake_notes}
                    </div>
                  ) : null}

                  <div
                    style={{
                      paddingTop: 10,
                      borderTop: "1px solid #1f2b33",
                      color: "#8fa9bc",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Next:{" "}                     {lead.current_stage === "proposal_revision"                       ? "Review requested changes and update proposal"                       : lead.current_stage === "proposal_approved"                       ? (lead.next_action || "Collect deposit and schedule final measurement")                       : lead.current_stage === "proposal"                       ? "Prepare Proposal"                       : lead.current_stage === "installation_complete" ? "Office to call the customer and schedule the final walkthrough." : lead.next_action ||                         "Assign salesperson and contact customer."}
                  </div>

                  {lead.assigned_salesperson ? (
                    <div
                      style={{
                        marginTop: 8,
                        color: "#d9e5ee",
                        fontSize: 13,
                      }}
                    >
                      Assigned to: <strong>{lead.assigned_salesperson}</strong>
                    </div>
                  ) : null}

                  {lead.current_stage === "proposal" && !lead._sample ? (
                    <button
                      type="button"
                      disabled={savingLeadDecisionId === lead.id}
                      onClick={() => relayProposalToSales(lead)}
                      style={{
                        width: "100%",
                        minHeight: 44,
                        marginTop: 12,
                        border: "1px solid #3d7459",
                        borderRadius: 10,
                        background: "#173124",
                        color: "#d9f4e3",
                        fontWeight: 900,
                        cursor:
                          savingLeadDecisionId === lead.id
                            ? "wait"
                            : "pointer",
                        opacity:
                          savingLeadDecisionId === lead.id
                            ? 0.7
                            : 1,
                      }}
                    >
                      {savingLeadDecisionId === lead.id
                        ? "Sending..."
                        : `Send Proposal to ${
                            lead.assigned_salesperson || "Sales"
                          }`}
                    </button>
                  ) : null}
                  {openLeadId === lead.id ? (
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: "1px solid #31495a",
                      }}
                    >
                      <div
                        style={{
                          color: "#8fa9bc",
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: 4,
                        }}
                      >
                        Lead Decision
                      </div>

                      <div
                        style={{
                          color: "#f3f6f8",
                          fontSize: 17,
                          fontWeight: 800,
                          marginBottom: 14,
                        }}
                      >
                        What happens to this lead next?
                      </div>

                      <div style={{ display: "grid", gap: 13 }}>
                        <label>
                          <div
                            style={{
                              color: "#9ca8b2",
                              fontSize: 11,
                              fontWeight: 700,
                              marginBottom: 6,
                            }}
                          >
                            Assigned Salesperson
                          </div>

                          <select
                            value={
                              leadDrafts[lead.id]?.salesperson ??
                              lead.assigned_salesperson ??
                              ""
                            }
                            onChange={(event) =>
                              setLeadDraftField(
                                lead.id,
                                "salesperson",
                                event.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minHeight: 44,
                              border: "1px solid #31495a",
                              borderRadius: 9,
                              background: "#0c1116",
                              color: "#f3f6f8",
                              padding: "0 10px",
                              fontSize: 13,
                            }}
                          >
                            <option value="">Choose salesperson</option>
                            <option value="Dennis Dillon">Dennis Dillon</option>
                            <option value="Gio Richardson">Gio Richardson</option>
                            <option value="Gino Marquez">Gino Marquez</option>
                          </select>
                        </label>

                        <button
                          type="button"
                          disabled={savingLeadDecisionId === lead.id}
                          onClick={() => saveLeadDecision(lead)}
                          style={{
                            minHeight: 46,
                            border: "1px solid #57788e",
                            borderRadius: 9,
                            background: "#1a2a36",
                            color: "#f3f6f8",
                            fontSize: 13,
                            fontWeight: 900,
                            cursor:
                              savingLeadDecisionId === lead.id
                                ? "wait"
                                : "pointer",
                            opacity:
                              savingLeadDecisionId === lead.id ? 0.7 : 1,
                          }}
                        >
                          {savingLeadDecisionId === lead.id
                            ? "Saving..."
                            : "Save & Send to Sales"}
                        </button>
                        {!lead._sample ? (
                          <button
                            type="button"
                            disabled={archivingJobId === lead.id || savingLeadDecisionId === lead.id}
                            onClick={async () => {
                              if (!window.confirm("Archive this lead? Customer information and history will be preserved.")) return;

                              const accessToken = getPremierOfficeAccessToken();
                              if (!accessToken) {
                                window.alert("Premier staff access is missing.");
                                return;
                              }

                              setArchivingJobId(lead.id);
                              const { data, error } = await supabase.rpc("archive_premier_job", {
                                p_access_token: accessToken,
                                p_job_id: lead.id,
                              });
                              setArchivingJobId(null);

                              if (error || data !== true) {
                                console.error("Archive Premier lead failed:", error);
                                window.alert(error?.message || "Could not archive this lead.");
                                return;
                              }

                              setLiveLeads((current) =>
                                current.filter((item) => item.id !== lead.id)
                              );
                              setOpenLeadId(null);
                            }}
                            style={{
                              width: "100%",
                              minHeight: 44,
                              border: "1px solid #744548",
                              borderRadius: 9,
                              background: "#241416",
                              color: "#e8b6b9",
                              fontSize: 13,
                              fontWeight: 900,
                              cursor: archivingJobId === lead.id ? "wait" : "pointer",
                            }}
                          >
                            {archivingJobId === lead.id ? "Archiving..." : "Archive Lead"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                      marginTop: 12,
                    }}
                  >

                    <button
                      type="button"
                      onClick={() => {
                        if (                           lead.current_stage === "proposal" ||                           lead.current_stage === "proposal_revision" ||                           lead.current_stage === "proposal_approved" ||                           lead.current_stage === "production_setup" ||
                          lead.current_stage === "installation_ready" || lead.current_stage === "installation_in_progress" || lead.current_stage === "installer_finish_back" || lead.current_stage === "scheduled" ||                           lead.current_stage === "installation_complete" ||                           lead.current_stage === "inspection_complete" ||                           lead.current_stage === "hundred_percent_complete" || lead.current_stage === "completed"                         ) {
                          setOfficeBeamRecipient(
                            [
                              "installation_ready",
                              "scheduled",
                              "installation_scheduled",
                              "installation_in_progress",
                              "installer_finish_back",
                              "installation_complete",
                              "inspection_complete",
                              "hundred_percent_complete",
                            ].includes(String(lead.current_stage || ""))
                              ? "RJ"
                              : ["Gio Richardson", "Gino Marquez", "Dennis Dillon"].includes(
                                  String(lead.assigned_salesperson || "")
                                )
                                ? String(lead.assigned_salesperson)
                                : "Gio Richardson"
                          );
                          setOfficeWorkLeadId((current) =>
                            current === lead.id ? null : lead.id
                          );
                          setOfficeWorkView(null);
                          setOpenLeadId(null);
                          if (officeWorkLeadId !== lead.id) {
                            void loadOfficeProductionSetup(lead);
                            void loadOfficePayments(lead);
                            void loadBlueFolderConfirmation(lead);
                            void loadOfficeRjRelease(lead);
                          }
                          return;
                        }

                        setOfficeWorkLeadId(null);
                        setOfficeWorkView(null);
                        setOpenLeadId((current) =>
                          current === lead.id ? null : lead.id
                        );
                      }}
                      style={{
                        minHeight: 40,
                        border: "1px solid #31495a",
                        borderRadius: 9,
                        background: "#101419",
                        color: "#d9e5ee",
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {lead.current_stage === "proposal" ||                       lead.current_stage === "proposal_revision" ||                       lead.current_stage === "proposal_approved" ||                       lead.current_stage === "production_setup" ||
                          lead.current_stage === "installation_ready" || lead.current_stage === "installation_in_progress" || lead.current_stage === "installer_finish_back" || lead.current_stage === "scheduled" ||                       lead.current_stage === "installation_complete" ||                       lead.current_stage === "inspection_complete" ||                       lead.current_stage === "hundred_percent_complete" || lead.current_stage === "completed"
                        ? officeWorkLeadId === lead.id
                          ? "Close Work"
                          : lead.current_stage === "completed" ? "View Completed Job" : "Open Work"
                        : openLeadId === lead.id
                        ? "Close Lead"
                        : "Open Lead"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {officeWorkLead ? (
          <section
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(760px, calc(100% - 28px))",
              maxHeight: "84vh",
              overflowY: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              zIndex: 1000,
              boxSizing: "border-box",
              border: "1px solid #58788e",
              borderRadius: 18,
              background: "#0d1115",
              boxShadow:
                "0 0 0 100vmax rgba(0,0,0,0.62), 0 24px 80px rgba(0,0,0,0.72)",
              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    color: "#8fa9bc",
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: 0.9,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Office Working Drawer
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 24,
                    lineHeight: 1.05,
                  }}
                >
                  {officeWorkLead.first_name} {officeWorkLead.last_name}
                </h2>

                <div
                  style={{
                    color: "#9ca8b2",
                    fontSize: 11,
                    marginTop: 5,
                  }}
                >
                  {officeWorkLead.project_address}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!customerEditOpen) {
                      setCustomerEditDraft({
                        firstName: officeWorkLead.first_name || "",
                        lastName: officeWorkLead.last_name || "",
                        phone: officeWorkLead.phone || "",
                        email: officeWorkLead.email || "",
                        projectAddress: officeWorkLead.project_address || "",
                      });
                    }

                    setCustomerEditOpen((current) => !current);
                  }}
                  style={{
                    marginTop: 8,
                    border: "1px solid #31495a",
                    borderRadius: 8,
                    background: "#101820",
                    color: "#d9e5ee",
                    padding: "6px 9px",
                    fontSize: 10,
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {customerEditOpen ? "Close Customer Edit" : "Edit Customer"}
                </button>

                {customerEditOpen ? (
                  <div
                    style={{
                      marginTop: 10,
                      border: "1px solid #263846",
                      borderRadius: 10,
                      background: "#0b1116",
                      padding: 10,
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: 8,
                      }}
                    >
                      <input
                        value={customerEditDraft.firstName}
                        onChange={(event) =>
                          setCustomerEditDraft((current) => ({
                            ...current,
                            firstName: event.target.value,
                          }))
                        }
                        placeholder="First name"
                        style={{
                          background: "#0f1720",
                          color: "#e8f0f7",
                          border: "1px solid #31495a",
                          borderRadius: 8,
                          padding: "10px 12px",
                        }}
                      />

                      <input
                        value={customerEditDraft.lastName}
                        onChange={(event) =>
                          setCustomerEditDraft((current) => ({
                            ...current,
                            lastName: event.target.value,
                          }))
                        }
                        placeholder="Last name"
                        style={{
                          background: "#0f1720",
                          color: "#e8f0f7",
                          border: "1px solid #31495a",
                          borderRadius: 8,
                          padding: "10px 12px",
                        }}
                      />

                      <input
                        value={customerEditDraft.phone}
                        onChange={(event) =>
                          setCustomerEditDraft((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                        placeholder="Phone"
                        style={{
                          background: "#0f1720",
                          color: "#e8f0f7",
                          border: "1px solid #31495a",
                          borderRadius: 8,
                          padding: "10px 12px",
                        }}
                      />

                      <input
                        value={customerEditDraft.email}
                        onChange={(event) =>
                          setCustomerEditDraft((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        placeholder="Email"
                        style={{
                          background: "#0f1720",
                          color: "#e8f0f7",
                          border: "1px solid #31495a",
                          borderRadius: 8,
                          padding: "10px 12px",
                        }}
                      />
                    </div>

                    <input
                      value={customerEditDraft.projectAddress}
                      onChange={(event) =>
                        setCustomerEditDraft((current) => ({
                          ...current,
                          projectAddress: event.target.value,
                        }))
                      }
                      placeholder="Project address"
                        style={{
                          background: "#0f1720",
                          color: "#e8f0f7",
                          border: "1px solid #31495a",
                          borderRadius: 8,
                          padding: "10px 12px",
                        }}
                    />

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        disabled={savingCustomerEdit || officeWorkLead._sample}
                        onClick={() => void saveCustomerEdit(officeWorkLead)}
                        style={{
                          border: "1px solid #3f7654",
                          borderRadius: 8,
                          background: "#13261a",
                          color: "#c8f0d2",
                          padding: "7px 10px",
                          fontSize: 10,
                          fontWeight: 900,
                          cursor: "pointer",
                          opacity:
                            savingCustomerEdit || officeWorkLead._sample ? 0.6 : 1,
                        }}
                      >
                        {savingCustomerEdit ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomerEditOpen(false)}
                        style={{
                          border: "1px solid #31495a",
                          borderRadius: 8,
                          background: "#101419",
                          color: "#d9e5ee",
                          padding: "7px 10px",
                          fontSize: 10,
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              <span
                style={{
                  border: "1px solid #80682f",
                  borderRadius: 999,
                  padding: "5px 8px",
                  color: "#e1c477",
                  fontSize: 9,
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                }}
              >
                {officeWorkLead.current_stage === "completed" ? "COMPLETED" : officeWorkLead.current_stage === "proposal_revision"                   ? "NEEDS REVISION"                   : officeWorkLead.current_stage === "proposal_approved"                   ? "APPROVED"                   : officeWorkLead.current_stage === "production_setup"                   ? "PRODUCTION SETUP"                   : officeWorkLead.current_stage === "installation_complete"                   ? "INSTALLATION COMPLETE"                   : officeWorkLead.current_stage === "inspection_scheduled" ? "FINAL WALKTHROUGH SCHEDULED"                   : officeWorkLead.current_stage === "inspection_complete"                   ? (String(officeWorkLead.next_action || "").toLowerCase().includes("final walkthrough approved") ? "FINAL WALKTHROUGH APPROVED" : "INSPECTION COMPLETE")                   : officeWorkLead.current_stage === "hundred_percent_complete"                   ? "100% COMPLETE"                   : officeWorkLead.current_stage === "installation_in_progress" ? "INSTALLATION IN PROGRESS" : officeWorkLead.current_stage === "installer_finish_back" ? "FINAL FINISH WORK" : officeWorkLead.current_stage === "scheduled" ? "SCHEDULED INSTALLATION" : officeWorkLead.current_stage === "installation_ready" ? "FIELD OPERATIONS" : "MEASUREMENTS COMPLETE"}
              </span>
            </div>

            <div
              style={{
                border: "1px solid #263846",
                borderRadius: 10,
                background: "#101820",
                padding: "9px 10px",
                marginBottom: 10,
                color: "#c4d0d7",
                fontSize: 11,
                lineHeight: 1.4,
              }}
            >
              <strong>Next:</strong>{" "}               {officeWorkLead.current_stage === "installation_in_progress"
  ? "Installation underway. Review field issues, monitor Bucking proof, and coordinate next steps with RJ."
  : officeWorkLead.current_stage === "installer_finish_back"
  ? "Installer follow-up required. Coordinate remaining work and reported issues with RJ."
  : officeWorkLead.current_stage === "scheduled" || officeWorkLead.current_stage === "installation_scheduled"
  ? "Installation scheduled. Confirm crew readiness and monitor field updates."
  : officeWorkLead.current_stage === "completed" ? (officeWorkLead.next_action || "Job complete. Office may archive when ready.") : officeWorkLead.current_stage === "proposal_revision"                 ? `Review requested changes, revise the proposal, and return it to ${                     officeWorkLead.assigned_salesperson || "Sales"                   }.`                 : officeWorkLead.current_stage === "proposal_approved"                 ? (officeWorkLead.next_action || "Collect deposit and schedule the final detailed measurement.")                 : officeWorkLead.current_stage === "production_setup"                 ? (officeWorkLead.next_action || "Office to start ordering/materials and permit setup.")                 : officeWorkLead.current_stage === "installation_complete"                 ? "Office to call the customer and schedule the final walkthrough with RJ, Gino, or both."
  : officeWorkLead.current_stage === "inspection_scheduled" ? (officeWorkLead.next_action || "Await RJ/Gino final walkthrough outcome.")                 : officeWorkLead.current_stage === "inspection_complete"                 ? (officeWorkLead.next_action || "Office to complete final closeout.")                 : officeWorkLead.current_stage === "hundred_percent_complete"                 ? (officeWorkLead.next_action || "Office to handle final payment and administrative closeout.")                 : officeWorkLead.current_stage === "installation_ready" ? "Office to confirm materials, permits, and job readiness. RJ has received the final measurement package." : `Prepare proposal and return it to ${                     officeWorkLead.assigned_salesperson || "Sales"                   }.`}
            </div>

            {officeWorkLead.current_stage === "proposal_approved" ? (
              <div style={{ marginBottom: 12, border: "1px solid #5b9473", borderRadius: 14, background: "linear-gradient(135deg, #163426 0%, #101d17 100%)", padding: 14 }}>
                <div style={{ color: "#94d7ad", fontSize: 10, fontWeight: 900, letterSpacing: 1, marginBottom: 6 }}>WHAT NEEDS MY ATTENTION</div>
                <div style={{ color: "#ffffff", fontSize: 19, fontWeight: 900, marginBottom: 6 }}>{officePaymentDrafts.deposit_50?.status === "received" ? "Prepare the Blue Folder" : officePaymentDrafts.deposit_50?.status === "sent" ? "Track the 50% Deposit" : "Send the 50% Deposit Invoice"}</div>
                <div style={{ color: "#c5d9ce", fontSize: 12, lineHeight: 1.55 }}>
                  {officePaymentDrafts.deposit_50?.status === "received" ? "Deposit recorded. Prepare the job documents and continue setup." : officePaymentDrafts.deposit_50?.status === "sent" ? "Invoice confirmed sent. Record the deposit only when payment actually arrives; Blue Folder preparation can continue meanwhile." : "Customer approved. Send the deposit invoice first. You can prepare Blue Folder paperwork while waiting for payment."}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 11 }}>
                  {[["Deposit invoice", "50%"], ["Material delivered", "40%"], ["Job complete", "10%"]].map(([label, amount]) => (
                    <span key={label} style={{ border: "1px solid #39664b", background: "#0c1b13", borderRadius: 8, padding: "7px 9px", color: "#dcece2", fontSize: 11 }}>
                      <strong>{amount}</strong> {label}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 8,
              }}
            >
              {(officeWorkLead.current_stage === "proposal_revision"                 ? [                     ["Review Revision Request", "revision_request"],                     ["Proposal Workspace", "proposal"],                     ["Return to Sales", "relay"],                   ]                 : officeWorkLead.current_stage === "proposal_approved"                 ? [                     ["50% Deposit / Payments", "deposit"], ["Prepare Blue Folder", "job_documents"], ["Final Measurement", "final_measurement"], ["Continue Job Setup", "continue_job"],                   ]                 : ["installation_in_progress", "installer_finish_back", "scheduled"].includes(officeWorkLead.current_stage)
                ? [["Materials & Permit Records", "production_setup"], ["40% Payment Record", "deposit"]]
                : ["production_setup", "installation_ready", "installation_scheduled"].includes(officeWorkLead.current_stage)
                ? [["1. Materials & Permits", "production_setup"], ["2. Collect 40% Payment", "deposit"]]                 : officeWorkLead.current_stage === "installation_complete"                 ? [["Schedule Final Walkthrough", "inspection_schedule"]]                 : officeWorkLead.current_stage === "inspection_scheduled" ? [["View Job Documents", "job_documents"]]
                : officeWorkLead.current_stage === "inspection_complete"                 ? [["Payments / Complete Job", "deposit"]]                 : officeWorkLead.current_stage === "completed" ? [["View Payment History", "deposit"], ["View Job Documents", "job_documents"], ["View Final Closeout", "final_closeout"]] : officeWorkLead.current_stage === "hundred_percent_complete"                 ? [                     ["Payment", "deposit"],                     ["Final Closeout", "final_closeout"],                   ]                 : [                     ["Review Measurements", "measurements"],                     ["Photos / Proof", "photos"],                     ["Proposal Workspace", "proposal"],                     ["Send Back to Sales", "relay"],                   ]               ).map(([label, view]) => {
                const isApprovedSetup = officeWorkLead.current_stage === "proposal_approved";
                const depositComplete = isApprovedSetup && officePaymentDrafts.deposit_50?.status === "received";
                const blueFolderComplete = isApprovedSetup && blueFolderState?.jobId === officeWorkLead.id && Boolean(blueFolderState.confirmedAt);
                const isDepositDone = depositComplete && view === "deposit";
                const isBlueFolderDone = blueFolderComplete && view === "job_documents";
                const isBlueFolderNext = depositComplete && !blueFolderComplete && !blueFolderLoading && view === "job_documents";
                const displayLabel = isDepositDone
                  ? "50% Deposit Complete"
                  : isBlueFolderDone
                  ? "Blue Folder Complete"
                  : isBlueFolderNext
                  ? "Prepare Blue Folder"
                  : label;
                return (
                <div key={label}>
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setOfficeWorkView(view as any);
                    if (view === "job_documents") {
                      void loadOfficeJobDocuments(officeWorkLead);
                    }

                    if (view === "measurements" || view === "photos") {
                      void loadOfficeMeasurementReview(officeWorkLead);
                    }

                    if (
                      view === "deposit" ||
                      view === "final_measurement" ||
                      view === "continue_job"
                    ) {
                      void loadOfficeApprovedSetup(officeWorkLead);
                      if (view === "deposit") {
                        void loadOfficePayments(officeWorkLead);
                        void loadOfficeJobDocuments(officeWorkLead);
                        void loadOfficeProductionSetup(officeWorkLead);
                      }
                    }

                    if (view === "continue_job") {
                      void loadBlueFolderConfirmation(officeWorkLead);
                      void loadOfficePayments(officeWorkLead);
                    }

                    if (view === "production_setup") {
                      void loadOfficeProductionSetup(officeWorkLead);
                    }

                    if (view === "final_measurement") {
                      void loadOfficeJobDocuments(officeWorkLead);
                    }
                  }}
                  style={{
                    minHeight: 46,
                    width: "100%",
                    border:
                      officeWorkView === view
                        ? "1px solid #6f91a7"
                        : isDepositDone || isBlueFolderDone ? "1px solid #3d7459" : isBlueFolderNext ? "1px solid #81b998" : officeWorkLead.current_stage === "completed" ? "1px solid #3d7459" : "1px solid #31495a",
                    borderRadius: 10,
                    background:
                      officeWorkView === view
                        ? "#1a2a36"
                        : "#111820",
                    color:
                      officeWorkView === view
                        ? "#ffffff"
                        : "#d9e5ee",
                    fontSize: 13,
                    fontWeight: 900,
                    padding: "10px 12px",
                    cursor: "pointer",
                    boxShadow:
                      officeWorkView === view
                        ? "0 0 0 1px rgba(143,169,188,0.12)"
                        : "none",
                  }}
                >
                                    {view === "deposit" &&
                  officeWorkLead.current_stage === "hundred_percent_complete" &&
                  ["deposit_50", "delivery_40", "final_10"].every(
                    (key) => officePaymentDrafts[key]?.status === "received"
                  ) ? (
                    <span style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      border: "1px solid #3d7459",
                      borderRadius: 9,
                      padding: "10px 12px",
                      textAlign: "left",
                    }}>
                      <span style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}>
                        <span style={{
                          color: "#81c99b",
                          fontSize: 20,
                        }}>
                          ✓
                        </span>
                        <span style={{
                          display: "grid",
                          gap: 3,
                        }}>
                          <strong style={{
                            color: "#d9f0df",
                            fontSize: 13,
                          }}>
                            Payment Complete
                          </strong>
                          <span style={{
                            color: "#a9bdaf",
                            fontSize: 11,
                            fontWeight: 400,
                          }}>
                            View Payment History
                          </span>
                        </span>
                      </span>
                      <span style={{
                        color: "#a9bdaf",
                        fontSize: 20,
                      }}>
                        ›
                      </span>
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <span>{isDepositDone || isBlueFolderDone ? "✓ " : ""}{displayLabel}</span>
                      {(isDepositDone || isBlueFolderDone || isBlueFolderNext) && (
                        <span style={{ color: isBlueFolderNext ? "#a6d9b8" : "#a9bdaf", whiteSpace: "nowrap", fontSize: 12 }}>
                          {isBlueFolderNext ? "Next ›" : "View ›"}
                        </span>
                      )}
                    </span>
                  )}
                  {["production_setup", "installation_ready", "installation_scheduled", "installation_in_progress"].includes(officeWorkLead.current_stage) && view === "production_setup" ? (
                    <span style={{ display: "block", marginTop: 6, fontSize: 11, fontWeight: 400, lineHeight: 1.5 }}>
                      {["Received", "On Hand", "Not Required"].includes(officeProductionDraft.materialStatus)
                        ? "Materials Received"
                        : ["Ordered", "In production"].includes(officeProductionDraft.materialStatus)
                          ? "Materials Ordered"
                          : "Order Materials"}
                      <span style={{ display: "block", marginTop: 4 }}>
                        {["Received", "On Hand", "Not Required"].includes(officeProductionDraft.materialStatus)
                          ? ["scheduled", "installation_scheduled", "installation_in_progress", "installer_finish_back"].includes(officeWorkLead.current_stage)
                          ? "Materials received. Review the material and permit records below."
                          : "Materials ready. Verify the payment terms before sending to RJ."
                          : ["Ordered", "In production"].includes(officeProductionDraft.materialStatus)
                            ? "Waiting for delivery. Mark Received when materials arrive."
                            : "Order materials and mark them Ordered."}
                      </span>
                      <span style={{ display: "block", marginTop: 4 }}>
                        Permit: {officeProductionDraft.permitStatus}
                      </span>
                    </span>
                  ) : null}
                  {["production_setup", "installation_ready", "installation_scheduled", "installation_in_progress"].includes(officeWorkLead.current_stage) && view === "deposit" ? (
                    <span style={{ display: "block", marginTop: 6, fontSize: 11, fontWeight: 400, lineHeight: 1.5 }}>
                      {["scheduled", "installation_scheduled", "installation_in_progress", "installer_finish_back"].includes(officeWorkLead.current_stage)
                        ? "Review the recorded 40% payment status. Installation is already in the field workflow."
                        : "Confirm the required payment for this job before releasing scheduling to RJ."}
                    </span>
                  ) : null}
                </button>
                {view === "production_setup" && officeWorkView === "production_setup" ? (
                  <div style={{
                    padding: 12,
                    border: "1px solid #31495a",
                    borderTop: "none",
                    borderRadius: "0 0 10px 10px",
                    background: "#111820",
                  }}>
                {officeWorkView === "production_setup" ? (
                  <>

                    {officeProductionLoading ? (
                      <div
                        style={{
                          color: "#9ca8b2",
                          fontSize: 11,
                        }}
                      >
                        Loading production setup...
                      </div>
                    ) : (
                      <>
                                                <div style={{ display: "grid", gap: 12, marginBottom: 14 }}>
                          <div style={{ display: "grid", gap: 6 }}>
                            <div style={{ padding: 10, border: "1px solid #557c64", background: "#102219", borderRadius: 10, display: "grid", gap: 8, marginBottom: 12 }}>
                              <strong style={{ fontSize: 12, color: "#d8f1df" }}>Materials already available or not needed?</strong>
                              <span style={{ fontSize: 11, color: "#b8cfbd" }}>Use these only when the office has verified the job's requirements. No order is needed for either choice.</span>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                                {(["On Hand", "Not Required"] as const).map((status) => (
                                  <button key={status} type="button"
                                    onClick={() => { setOfficeProductionSaved(false); setOfficeProductionDraft((current) => ({ ...current, materialStatus: status, materialEta: "" })); }}
                                    style={{ minHeight: 42, borderRadius: 8, border: officeProductionDraft.materialStatus === status ? "2px solid #9cd8af" : "1px solid #557c64", background: officeProductionDraft.materialStatus === status ? "#28583b" : "#16232d", color: "#fff", fontWeight: 800, cursor: "pointer" }}>
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </div>                            <strong style={{ fontSize: 13 }}>Step 1. Materials Ordered</strong>
                            <span style={{ fontSize: 11, color: "#aebbc4" }}>
                              Order the materials. Once ordered, confirm below and enter the expected delivery date.
                            </span>
                            <button
                              type="button"
                              disabled={["Received", "On Hand", "Not Required"].includes(officeProductionDraft.materialStatus)}
                              onClick={() => {
                                setOfficeProductionSaved(false);
                                setOfficeProductionDraft((current) => ({
                                  ...current,
                                  materialStatus: "Ordered",
                                }));
                              }}
                              style={{
                                minHeight: 44,
                                borderRadius: 9,
                                border: "1px solid #557c64",
                                background: ["Ordered", "In production", "Received"].includes(officeProductionConfirmedStatus) ? "#193c2b" : "#16232d",
                                color: "#ffffff",
                                fontWeight: 800,
                                cursor: ["Received", "On Hand", "Not Required"].includes(officeProductionDraft.materialStatus) ? "default" : "pointer",
                              }}
                            >
                              {["Ordered", "In production", "Received"].includes(officeProductionConfirmedStatus)
                                ? "✓ Materials Ordered"
                                : "Mark Materials Ordered"}
                            </button>
                          </div>
                          

                        <label
                          style={{
                            display: "grid",
                            gap: 5,
                            marginBottom: 10,
                          }}
                        >
                          <span
                            style={{
                              color: "#9ca8b2",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            Material ETA
                          </span>

                          <input
                            type="date"
                            value={officeProductionDraft.materialEta}
                            onChange={(event) => {
                              setOfficeProductionSaved(false);
                              setOfficeProductionDraft((current) => ({
                                ...current,
                                materialEta: event.target.value,
                              }));
                            }}
                            style={{
                              width: "100%",
                              minHeight: 44,
                              boxSizing: "border-box",
                              border: "1px solid #31495a",
                              borderRadius: 9,
                              background: "#0c1116",
                              color: "#f3f6f8",
                              padding: "0 10px",
                            }}
                          />
                        </label>
                            <div style={{ display: "grid", gap: 6 }}>
                            <strong style={{ fontSize: 13 }}>Step 2. Materials Received</strong>
                            <span style={{ fontSize: 11, color: "#aebbc4" }}>
                              When the materials arrive, confirm they have been received.
                            </span>
                            <button
                              type="button"
                              disabled={officeProductionDraft.materialStatus === "Not ordered" || ["Received", "On Hand", "Not Required"].includes(officeProductionDraft.materialStatus)}
                              onClick={() => {
                                setOfficeProductionSaved(false);
                                setOfficeProductionDraft((current) => ({
                                  ...current,
                                  materialStatus: "Received",
                                }));
                              }}
                              style={{
                                minHeight: 44,
                                borderRadius: 9,
                                border: "1px solid #557c64",
                                background: officeProductionConfirmedStatus === "Received" ? "#193c2b" : "#16232d",
                                color: "#ffffff",
                                fontWeight: 800,
                                cursor: officeProductionDraft.materialStatus === "Not ordered" || ["Received", "On Hand", "Not Required"].includes(officeProductionDraft.materialStatus) ? "default" : "pointer",
                              }}
                            >
                              {officeProductionConfirmedStatus === "Received"
                                ? "✓ Materials Received"
                                : "Mark Materials Received"}
                            </button>
                          </div>
                        </div>

                                                <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                          <strong style={{ fontSize: 13 }}>Permit Status</strong>
                          <span style={{ fontSize: 11, color: "#aebbc4" }}>
                            Update the permit status. Approval is required before sending to RJ unless no permit is required.
                          </span>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                            {["Not started", "Submitted", "Approved", "Not required"].map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => {
                                  setOfficeProductionSaved(false);
                                  setOfficeProductionDraft((current) => ({
                                    ...current,
                                    permitStatus: status,
                                  }));
                                }}
                                style={{
                                  minHeight: 44,
                                  padding: "8px",
                                  borderRadius: 9,
                                  border: officeProductionDraft.permitStatus === status
                                    ? "1px solid #8fbea0"
                                    : "1px solid #31495a",
                                  background: officeProductionDraft.permitStatus === status
                                    ? "#193c2b"
                                    : "#16232d",
                                  color: "#ffffff",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                {officeProductionDraft.permitStatus === status ? "✓ " : ""}
                                {status === "Not started" ? "Not Started" : status === "Not required" ? "Not Required" : status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {officeProductionError ? (
                          <div
                            style={{
                              color: "#d8b267",
                              fontSize: 10,
                              marginBottom: 8,
                            }}
                          >
                            {officeProductionError}
                          </div>
                        ) : null}

                        <button
                          type="button"
                          disabled={
                            officeProductionSaving ||
                            officeProductionSaved
                          }
                          onClick={() =>
                            void saveOfficeProductionSetup(
                              officeWorkLead
                            )
                          }
                          style={{
                            width: "100%",
                            minHeight: 46,
                            border: "1px solid #557c64",
                            borderRadius: 9,
                            background: "#14271c",
                            color: "#b7dec4",
                            fontWeight: 900,
                            cursor:
                              officeProductionSaving ||
                              officeProductionSaved
                                ? "default"
                                : "pointer",
                            opacity:
                              officeProductionSaving ||
                              officeProductionSaved
                                ? 0.72
                                : 1,
                          }}
                        >
                          {officeProductionSaving
                            ? "Saving..."
                            : officeProductionSaved
                            ? "Materials & Permit Status Saved"
                            : "Save Materials & Permit Status"}
                        </button>

                      </>
                    )}
                  </>
                ) : null}
                  </div>
                ) : null}
                </div>
                );
              })}



              {[
                "production_setup",
                "installation_complete",
                "inspection_complete",
                "hundred_percent_complete",
              ].includes(officeWorkLead.current_stage) ? (
                <button
                  type="button"
                  onClick={() => {
                    setOfficeWorkView("job_documents");
                    void loadOfficeJobDocuments(officeWorkLead);
                  }}
                  style={{
                    minHeight: 46,
                    width: "100%",
                    border:
                      officeWorkView === "job_documents"
                        ? "1px solid #6f91a7"
                        : "1px solid #31495a",
                    borderRadius: 10,
                    background:
                      officeWorkView === "job_documents"
                        ? "#1a2a36"
                        : "#111820",
                    color:
                      officeWorkView === "job_documents"
                        ? "#ffffff"
                        : "#d9e5ee",
                    fontSize: 13,
                    fontWeight: 900,
                    padding: "10px 12px",
                    cursor: "pointer",
                    boxShadow:
                      officeWorkView === "job_documents"
                        ? "0 0 0 1px rgba(143,169,188,0.12)"
                        : "none",
                  }}
                >
                  Documents
                </button>
              ) : null}
            </div>

            {officeWorkView ? (
              <div
                style={{
                  marginTop: 10,
                  border: "1px solid #31495a",
                  borderRadius: 14,
                  background: "#101820",
                  padding: 11,
                }}
              >
                {officeWorkView === "measurements" ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: "#9db7ca",
                            fontSize: 9,
                            fontWeight: 900,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                            marginBottom: 3,
                          }}
                        >
                          Rough Measurement
                        </div>

                        <strong style={{ fontSize: 14 }}>
                          Saved Openings
                        </strong>
                      </div>

                      <span
                        style={{
                          border: "1px solid #456476",
                          borderRadius: 999,
                          padding: "4px 7px",
                          color: "#d9e5ee",
                          fontSize: 9,
                          fontWeight: 900,
                        }}
                      >
                        {officeMeasurementOpenings.length} SAVED
                      </span>
                    </div>

                    {officeMeasurementLoading ? (
                      <div
                        style={{
                          color: "#9ca8b2",
                          fontSize: 11,
                          padding: "8px 0",
                        }}
                      >
                        Loading saved measurements...
                      </div>
                    ) : officeMeasurementError ? (
                      <div
                        style={{
                          color: "#d8b267",
                          fontSize: 11,
                          padding: "8px 0",
                        }}
                      >
                        {officeMeasurementError}
                      </div>
                    ) : officeMeasurementOpenings.length === 0 ? (
                      <div
                        style={{
                          color: "#9ca8b2",
                          fontSize: 11,
                          padding: "8px 0",
                        }}
                      >
                        No saved openings were found for this job.
                      </div>
                    ) : (
                      officeMeasurementOpenings.map((opening: any) => {
                        const photos =
                          officeMeasurementPhotos[opening.id] ?? [];

                        return (
                          <div
                            key={opening.id}
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "34px minmax(0, 1fr) auto",
                              gap: 9,
                              alignItems: "center",
                              borderTop: "1px solid #263846",
                              padding: "10px 0",
                            }}
                          >
                            <strong
                              style={{
                                color: "#9db7ca",
                                fontSize: 11,
                              }}
                            >
                              {String(opening.opening_number || "").padStart(
                                2,
                                "0"
                              )}
                            </strong>

                            <div>
                              <strong
                                style={{
                                  display: "block",
                                  fontSize: 11,
                                }}
                              >
                                {opening.opening_type || "Opening"} ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â·{" "}
                                {opening.location || "Location not entered"}
                              </strong>

                              <span
                                style={{
                                  color: "#98a7b1",
                                  fontSize: 10,
                                }}
                              >
                                {opening.width_text || "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â"} ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â{" "}
                                {opening.height_text || "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â"}
                              </span>

                              {opening.notes ? (
                                <div
                                  style={{
                                    color: "#8f9da7",
                                    fontSize: 9,
                                    marginTop: 3,
                                  }}
                                >
                                  {opening.notes}
                                </div>
                              ) : null}
                            </div>

                            <span
                              style={{
                                color:
                                  photos.length > 0
                                    ? "#92c6a4"
                                    : "#d8b267",
                                fontSize: 9,
                                fontWeight: 900,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {photos.length > 0
                                ? `${photos.length} PHOTO${
                                    photos.length === 1 ? "" : "S"
                                  }`
                                : "NO PHOTO"}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </>
                ) : null}

                {officeWorkView === "photos" ? (
                  <>
                    <div
                      style={{
                        color: "#9db7ca",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Photos & Proof
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 10,
                      }}
                    >
                      Opening Photos
                    </strong>

                    {officeMeasurementLoading ? (
                      <div
                        style={{
                          color: "#9ca8b2",
                          fontSize: 11,
                        }}
                      >
                        Loading field proof...
                      </div>
                    ) : officeMeasurementOpenings.length === 0 ? (
                      <div
                        style={{
                          color: "#9ca8b2",
                          fontSize: 11,
                        }}
                      >
                        No saved openings were found for this job.
                      </div>
                    ) : (
                      officeMeasurementOpenings.map((opening: any) => {
                        const photos =
                          officeMeasurementPhotos[opening.id] ?? [];

                        return (
                          <div
                            key={opening.id}
                            style={{
                              borderTop: "1px solid #263846",
                              padding: "10px 0",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 10,
                                marginBottom: photos.length > 0 ? 8 : 0,
                              }}
                            >
                              <div>
                                <strong
                                  style={{
                                    display: "block",
                                    fontSize: 11,
                                  }}
                                >
                                  Opening {opening.opening_number} ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â·{" "}
                                  {opening.location || "Location not entered"}
                                </strong>

                                <span
                                  style={{
                                    color: "#98a7b1",
                                    fontSize: 9,
                                  }}
                                >
                                  {opening.opening_type || "Opening"}
                                </span>
                              </div>

                              <span
                                style={{
                                  color:
                                    photos.length > 0
                                      ? "#92c6a4"
                                      : "#d8b267",
                                  fontSize: 9,
                                  fontWeight: 900,
                                }}
                              >
                                {photos.length > 0
                                  ? `${photos.length} PHOTO${
                                      photos.length === 1 ? "" : "S"
                                    }`
                                  : "NEEDS PHOTO"}
                              </span>
                            </div>

                            {photos.length > 0 ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 7,
                                }}
                              >
                                {photos.map(
                                  (photo: any, photoIndex: number) =>
                                    photo.url ? (
                                      <a
                                        key={`${opening.id}-${photo.path}-${photoIndex}`}
                                        href={photo.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                          display: "block",
                                          width: 74,
                                          height: 74,
                                          borderRadius: 9,
                                          overflow: "hidden",
                                          border:
                                            "1px solid #31495a",
                                          background: "#111820",
                                        }}
                                      >
                                        <img
                                          src={photo.url}
                                          alt={`Opening ${opening.opening_number} photo ${
                                            photoIndex + 1
                                          }`}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                          }}
                                        />
                                      </a>
                                    ) : (
                                      <div
                                        key={`${opening.id}-sample-${photoIndex}`}
                                        style={{
                                          width: 74,
                                          height: 74,
                                          borderRadius: 9,
                                          border:
                                            "1px dashed #456476",
                                          background: "#111820",
                                          display: "grid",
                                          placeItems: "center",
                                          color: "#8fa9bc",
                                          fontSize: 9,
                                          fontWeight: 900,
                                          textAlign: "center",
                                          padding: 5,
                                          boxSizing: "border-box",
                                        }}
                                      >
                                        SAMPLE PHOTO
                                      </div>
                                    )
                                )}
                              </div>
                            ) : null}
                          </div>
                        );
                      })
                    )}
                  </>
                ) : null}

                {officeWorkView === "revision_request" ? (
                  <>
                    <div
                      style={{
                        color: "#e1c477",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Revision Request
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 8,
                      }}
                    >
                      What the Customer Wants Changed
                    </strong>

                    <div
                      style={{
                        border: "1px solid #3b4650",
                        borderRadius: 10,
                        background: "#0d141a",
                        padding: 10,
                        color: "#d9e5ee",
                        fontSize: 11,
                        lineHeight: 1.45,
                      }}
                    >
                      {officeWorkLead.latest_sales_note ||
                        "Customer requested a proposal revision."}
                    </div>
                  </>
                ) : null}

                {officeWorkView === "proposal" ? (
                  <>
                    <div
                      style={{
                        color: "#d8b267",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Proposal Workspace
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 7,
                      }}
                    >
                      Prepare Premier Proposal
                    </strong>

                    <div
                      style={{
                        color: "#9ca8b2",
                        fontSize: 10,
                        lineHeight: 1.45,
                      }}
                    >
                      This workspace is reserved for Premier's real proposal
                      format. We are leaving the document itself untouched until
                      their standard proposal sheet is provided.
                    </div>
                  </>
                ) : null}

                {officeWorkView === "job_documents" ? (
                  <>
                    <div
                      style={{
                        color: "#9db7ca",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Documents
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 6,
                      }}
                    >
                      Job File
                    </strong>

                    <div
                      style={{
                        color: "#aebbc4",
                        fontSize: 11,
                        lineHeight: 1.5,
                        marginBottom: 12,
                      }}
                    >
                      Keep all paperwork for this job in one place. Office,
                      Field Operations, and the installer are working from the
                      same file.
                    </div>

                                        <div
                      style={{
                        color: "#92c6a4",
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      Job Documents
                    </div>
{officeJobDocumentsLoading ? (
                        <div
                          style={{
                            color: "#9ca8b2",
                            fontSize: 11,
                          }}
                        >
                          Loading job documents...
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: 8 }}>
                          <div style={{ border: "1px solid #395b4b", borderRadius: 10, background: "#102019", padding: 12 }}>
                            <div style={{ fontSize: 12, fontWeight: 900, color: "#ffffff", marginBottom: 4 }}>Other Documents</div>
                            <div style={{ fontSize: 11, color: "#b8cfc0", marginBottom: 10 }}>Supplier paperwork, manufacturer PO, contracts or anything else. Enter what the document is before uploading.</div>
                            <button type="button" onClick={() => { setOfficeJobDocumentType("Other"); setOfficeJobDocumentAddOpen(true); }} style={{ border: "1px solid #557c64", borderRadius: 8, background: "#173225", color: "#ffffff", padding: "9px 12px", fontWeight: 900, cursor: "pointer" }}>+ Add Other Document</button>
                          </div>
                          {[
                            "Quote / Order Sheet",
                            "Floor Plan",
                            "Permit / Inspection",
                          ].map((documentType) => {
                            const document = officeJobDocuments.find(
                              (item) => item.document_type === documentType
                            );

                            return (
                              <div
                                key={documentType}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 12,
                                  border: "1px solid #31495a",
                                  borderRadius: 10,
                                  background: "#0d141a",
                                  padding: "11px 12px",
                                }}
                              >
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div
                                    style={{
                                      color: "#ffffff",
                                      fontSize: 12,
                                      fontWeight: 900,
                                    }}
                                  >
                                    {documentType}
                                  </div>

                                  <div
                                    style={{
                                      color: document ? "#9fb4c2" : "#718796",
                                      fontSize: 10,
                                      marginTop: 3,
                                      overflowWrap: "anywhere",
                                    }}
                                  >
                                    {document
                                      ? document.file_name
                                      : "No document added yet"}
                                  </div>
                                </div>

                                {document?.url ? (
                                  <a
                                    href={document.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      border: "1px solid #557c64",
                                      borderRadius: 8,
                                      background: "#14271c",
                                      color: "#b7dec4",
                                      textDecoration: "none",
                                      fontSize: 11,
                                      fontWeight: 900,
                                      padding: "8px 12px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Open
                                  </a>
                                ) : (
                                  <label
                                    style={{
                                      border: "1px solid #405c6d",
                                      borderRadius: 8,
                                      background: "#101a21",
                                      color: "#ffffff",
                                      fontSize: 11,
                                      fontWeight: 900,
                                      padding: "8px 12px",
                                      cursor: officeJobDocumentUploading
                                        ? "not-allowed"
                                        : "pointer",
                                      whiteSpace: "nowrap",
                                      opacity: officeJobDocumentUploading ? 0.6 : 1,
                                    }}
                                  >
                                    {officeJobDocumentUploading ? "Uploading..." : "Add"}

                                    <input
                                      type="file"
                                      accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
                                      disabled={officeJobDocumentUploading}
                                      style={{ display: "none" }}
                                      onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        if (!file) return;

                                        void uploadOfficeJobDocument(
                                          officeWorkLead,
                                          file,
                                          documentType
                                        );

                                        event.currentTarget.value = "";
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            );
                          })}

                          {officeJobDocuments
                            .filter(
                              (document) =>
                                ![
                                  "Quote / Order Sheet",
                                  "Floor Plan",
                                  "Manufacturer PO",
                                  "Permit / Inspection",
                                ].includes(document.document_type)
                            )
                            .map((document) => (
                              <div
                                key={document.id}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 12,
                                  border: "1px solid #31495a",
                                  borderRadius: 10,
                                  background: "#0d141a",
                                  padding: "11px 12px",
                                }}
                              >
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div
                                    style={{
                                      color: "#ffffff",
                                      fontSize: 12,
                                      fontWeight: 900,
                                    }}
                                  >
                                    {document.document_type || "Other Document"}
                                  </div>
                                  <div
                                    style={{
                                      color: "#9fb4c2",
                                      fontSize: 10,
                                      marginTop: 3,
                                      overflowWrap: "anywhere",
                                    }}
                                  >
                                    {document.file_name}
                                    {document.note ? <div style={{ marginTop: 4, color: "#c3decb", fontSize: 11 }}>Description: {document.note}</div> : null}
                                  </div>
                                </div>

                                {document.url ? (
                                  <a
                                    href={document.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      border: "1px solid #557c64",
                                      borderRadius: 8,
                                      background: "#14271c",
                                      color: "#b7dec4",
                                      textDecoration: "none",
                                      fontSize: 11,
                                      fontWeight: 900,
                                      padding: "8px 12px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Open
                                  </a>
                                ) : (
                                  <span
                                    style={{ color: "#8b99a3", fontSize: 10 }}
                                  >
                                    Link unavailable
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                    <div
                      style={{
                        borderTop: "1px solid #263b49",
                        marginTop: 14,
                        paddingTop: 14,
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOfficeJobDocumentAddOpen((current) => !current)
                        }
                        style={{
                          width: "100%",
                          minHeight: 42,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: "1px solid #405c6d",
                          borderRadius: 9,
                          background: "#101a21",
                          color: "#ffffff",
                          padding: "0 12px",
                          fontSize: 12,
                          fontWeight: 900,
                          cursor: "pointer",
                          marginBottom: officeJobDocumentAddOpen ? 10 : 0,
                        }}
                      >
                        <span>
                          {officeJobDocumentAddOpen ? "Close Add Document" : "+ Add Document"}
                        </span>
                        <span aria-hidden="true">
                          {officeJobDocumentAddOpen ? "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢" : "+"}
                        </span>
                      </button>
<div
                      style={{
                        display: officeJobDocumentAddOpen ? "grid" : "none",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(190px, 1fr))",
                        gap: 10,
                        marginBottom: 10,
                      }}
                    >
                      <label
                        style={{
                          display: "grid",
                          gap: 5,
                          color: "#b9c6ce",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        What are you adding?

                        <select
                          value={officeJobDocumentType}
                          onChange={(event) =>
                            setOfficeJobDocumentType(event.target.value)
                          }
                          disabled={officeJobDocumentUploading}
                          style={{
                            minHeight: 42,
                            border: "1px solid #405c6d",
                            borderRadius: 9,
                            background: "#0d141a",
                            color: "#ffffff",
                            padding: "0 10px",
                          }}
                        >
                          <option>Warranty</option>
                          <option>Change Order</option>
                          <option>Product / Spec Sheet</option>
                          <option>Customer Document</option>
                          <option>Other</option>
                        </select>
                      </label>

                      <label
                        style={{
                          display: "grid",
                          gap: 5,
                          color: "#b9c6ce",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        Choose the PDF, photo, or file

                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
                          disabled={officeJobDocumentUploading}
                          onChange={(event) => {
                            const file = event.target.files?.[0];

                            if (!file) return;
                            if (officeJobDocumentType === "Other" && !officeJobDocumentNote.trim()) {
                              window.alert("Please describe what this Other Document is before uploading.");
                              event.currentTarget.value = "";
                              return;
                            }

                            void uploadOfficeJobDocument(
                              officeWorkLead,
                              file
                            );

                            event.currentTarget.value = "";
                          }}
                          style={{
                            minHeight: 42,
                            border: "1px solid #405c6d",
                            borderRadius: 9,
                            background: "#0d141a",
                            color: "#ffffff",
                            padding: "9px 10px",
                          }}
                        />
                      </label>
                    </div>

                    <label
                      style={{
                        display: officeJobDocumentAddOpen ? "grid" : "none",
                        gap: 5,
                        color: "#b9c6ce",
                        fontSize: 11,
                        fontWeight: 800,
                        marginBottom: 10,
                      }}
                    >
                      {officeJobDocumentType === "Other" ? "Document name / description (required)" : "Optional Note"}

                      <textarea
                        value={officeJobDocumentNote}
                        onChange={(event) =>
                          setOfficeJobDocumentNote(event.target.value)
                        }
                        disabled={officeJobDocumentUploading}
                        placeholder={officeJobDocumentType === "Other" ? "e.g. Manufacturer PO for sliding door, supplier confirmation" : "Optional note about this document..."}
                        rows={2}
                        style={{
                          width: "100%",
                          border: "1px solid #405c6d",
                          borderRadius: 9,
                          background: "#0d141a",
                          color: "#ffffff",
                          padding: 10,
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />
                    </label>

                    {officeJobDocumentUploading ? (
                      <div
                        style={{
                          color: "#b7dec4",
                          fontSize: 11,
                          fontWeight: 800,
                          marginBottom: 10,
                        }}
                      >
                        Uploading document...
                      </div>
                    ) : null}

                    {officeJobDocumentsError ? (
                      <div
                        style={{
                          border: "1px solid #744646",
                          borderRadius: 9,
                          background: "#241516",
                          color: "#f0b7b7",
                          padding: 9,
                          fontSize: 11,
                          marginBottom: 10,
                        }}
                      >
                        {officeJobDocumentsError}
                      </div>
                    ) : null}

                    </div>
                  </>
                ) : null}

                {officeWorkView === "approval_details" ? (
                  <>
                    <div
                      style={{
                        color: "#92c6a4",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Customer Approval
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 8,
                      }}
                    >
                      Proposal Approved
                    </strong>

                    <div
                      style={{
                        color: "#9ca8b2",
                        fontSize: 11,
                        lineHeight: 1.45,
                      }}
                    >
                      {officeWorkLead.latest_sales_note ||
                        "Customer approved the proposal."}
                    </div>
                  </>
                ) : null}

                {officeWorkView === "deposit" ? (
                  <>
                    <div
                      style={{
                        color: "#92c6a4",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Payments
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 15,
                        marginBottom: 5,
                      }}
                    >
                      Premier Payment Schedule
                    </strong>

                    <div
                      style={{
                        color: "#aebbc4",
                        fontSize: 11,
                        lineHeight: 1.5,
                        marginBottom: 12,
                      }}
                    >
                      Office sends and records each invoice. Sales stays connected
                      with the customer throughout the job.
                    </div>

                    {officePaymentsLoading ? (
                      <div
                        style={{
                          color: "#9ca8b2",
                          fontSize: 11,
                          padding: "10px 0",
                        }}
                      >
                        Loading payment schedule...
                      </div>
                    ) : (
                      <>
                        {officePaymentsError ? (
                          <div
                            style={{
                              border: "1px solid #744646",
                              borderRadius: 9,
                              background: "#241516",
                              color: "#f0b7b7",
                              padding: 9,
                              fontSize: 11,
                              marginBottom: 10,
                            }}
                          >
                            {officePaymentsError}
                          </div>
                        ) : null}

                        <div style={{ display: "grid", gap: 12 }}>
                          {[
                            {
                              key: "deposit_50",
                              number: "1",
                              title: "50% Deposit",
                              invoiceType: "50% Deposit Invoice",
                              trigger: "Customer hires Premier",
                              instruction:
                                "Office sends the first invoice. Once the 50% deposit is received, material can be ordered.",
                            },
                            {
                              key: "delivery_40",
                              number: "2",
                              title: "40% Material Delivery",
                              invoiceType: "40% Delivery Invoice",
                              trigger: "Materials ready for installation",
                              instruction:
                                "When required materials are ready for installation, follow the customer's agreed payment terms. Confirm the required payment before releasing the job to RJ.",
                            },
                            {
                              key: "final_10",
                              number: "3",
                              title: "Final 10%",
                              invoiceType: "Final 10% Invoice",
                              trigger: "Job is complete",
                              instruction:
                                "Once the job is complete, Office sends the final 10% invoice for closeout.",
                            },
                          ].map((payment) => {
                            const draft = officePaymentDrafts[payment.key];
                            const isSaving =
                              officePaymentSavingStage === payment.key;
                            const isSaved =
                              officePaymentSavedStage === payment.key;
                            const paymentInvoice = officeJobDocuments.find(
                              (document) =>
                                document.document_type === payment.invoiceType
                            );

                            return (
                              <div
                                key={payment.key}
                                style={{
                                  border:
                                    draft.status === "received"
                                      ? "1px solid #557c64"
                                      : "1px solid #31495a",
                                  borderRadius: 12,
                                  background:
                                    draft.status === "received"
                                      ? "#102018"
                                      : "#0d141a",
                                  padding: 12,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: 10,
                                    flexWrap: "wrap",
                                    marginBottom: 8,
                                  }}
                                >
                                  <div>
                                    <div
                                      style={{
                                        color: "#8fa9bc",
                                        fontSize: 9,
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.7,
                                        marginBottom: 3,
                                      }}
                                    >
                                      Payment {payment.number}
                                    </div>

                                    <strong
                                      style={{
                                        display: "block",
                                        color: "#ffffff",
                                        fontSize: 14,
                                      }}
                                    >
                                      {payment.title}
                                    </strong>
                                  </div>

                                  <span
                                    style={{
                                      border:
                                        draft.status === "received"
                                          ? "1px solid #557c64"
                                          : draft.status === "sent"
                                          ? "1px solid #7b693e"
                                          : "1px solid #40505b",
                                      borderRadius: 999,
                                      padding: "5px 8px",
                                      color:
                                        draft.status === "received"
                                          ? "#b7dec4"
                                          : draft.status === "sent"
                                          ? "#e1c878"
                                          : "#aebbc4",
                                      fontSize: 9,
                                      fontWeight: 900,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {draft.status === "received"
                                      ? "RECEIVED"
                                      : draft.status === "sent"
                                      ? "INVOICE SENT"
                                      : "NOT SENT"}
                                  </span>
                                </div>

                                <div
                                  style={{
                                    color: "#8fa0aa",
                                    fontSize: 10,
                                    lineHeight: 1.45,
                                    marginBottom: 3,
                                  }}
                                >
                                  <strong style={{ color: "#b9c6ce" }}>
                                    Trigger:
                                  </strong>{" "}
                                  {payment.trigger}
                                </div>

                                <div
                                  style={{
                                    color: "#aebbc4",
                                    fontSize: 10,
                                    lineHeight: 1.45,
                                    marginBottom: 10,
                                  }}
                                >
                                  {payment.instruction}
                                <div
                                  style={{
                                    marginTop: 10,
                                    border: paymentInvoice
                                      ? "1px solid #315c43"
                                      : "1px solid #5c4d31",
                                    borderRadius: 9,
                                    background: paymentInvoice
                                      ? "#0d1c14"
                                      : "#1d1910",
                                    padding: 10,
                                  }}
                                >
                                  {paymentInvoice ? (
                                    <>
                                      <div
                                        style={{
                                          color: "#8fb99b",
                                          fontSize: 9,
                                          fontWeight: 900,
                                          letterSpacing: "0.08em",
                                          textTransform: "uppercase",
                                          marginBottom: 4,
                                        }}
                                      >
                                        Invoice Attached
                                      </div>

                                      <div
                                        style={{
                                          color: "#ffffff",
                                          fontSize: 12,
                                          fontWeight: 900,
                                          overflowWrap: "anywhere",
                                        }}
                                      >
                                        {paymentInvoice.file_name}
                                      </div>

                                      {paymentInvoice.url ? (
                                        <a
                                          href={paymentInvoice.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          style={{
                                            display: "inline-flex",
                                            marginTop: 8,
                                            minHeight: 34,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "1px solid #47785a",
                                            borderRadius: 8,
                                            padding: "0 12px",
                                            color: "#c9ead2",
                                            fontSize: 10,
                                            fontWeight: 900,
                                            textDecoration: "none",
                                          }}
                                        >
                                          View Invoice
                                        </a>
                                      ) : null}

                                      <button
                                        type="button"
                                        disabled={officeJobDocumentUploading}
                                        onClick={() =>
                                          void removeOfficeJobDocument(
                                            officeWorkLead,
                                            paymentInvoice
                                          )
                                        }
                                        style={{
                                          display: "inline-flex",
                                          minHeight: 34,
                                          marginTop: 8,
                                          marginLeft: 8,
                                          alignItems: "center",
                                          justifyContent: "center",
                                          border: "1px solid #805050",
                                          borderRadius: 8,
                                          background: "#241516",
                                          color: "#e5a5a5",
                                          padding: "0 12px",
                                          fontSize: 10,
                                          fontWeight: 900,
                                          cursor: officeJobDocumentUploading
                                            ? "wait"
                                            : "pointer",
                                          opacity: officeJobDocumentUploading ? 0.65 : 1,
                                        }}
                                      >
                                        {officeJobDocumentUploading
                                          ? "Working..."
                                          : "Remove Invoice"}
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <div
                                        style={{
                                          color: "#d5b66e",
                                          fontSize: 10,
                                          fontWeight: 900,
                                          marginBottom: 3,
                                        }}
                                      >
                                        No invoice attached yet
                                      </div>

                                      <label
                                        style={{
                                          display: "inline-flex",
                                          marginTop: 8,
                                          minHeight: 36,
                                          alignItems: "center",
                                          justifyContent: "center",
                                          border: "1px solid #d5b66e",
                                          borderRadius: 8,
                                          padding: "0 14px",
                                          color: "#f1d58c",
                                          fontSize: 10,
                                          fontWeight: 900,
                                          cursor: officeJobDocumentUploading
                                            ? "wait"
                                            : "pointer",
                                        }}
                                      >
                                        {officeJobDocumentUploading
                                          ? "Uploading..."
                                          : "Add Invoice"}

                                        <input
                                          type="file"
                                          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
                                          disabled={officeJobDocumentUploading}
                                          style={{ display: "none" }}
                                          onChange={(event) => {
                                            const file = event.target.files?.[0];

                                            if (!file) return;

                                            void uploadOfficeJobDocument(
                                              officeWorkLead,
                                              file,
                                              payment.invoiceType
                                            );

                                            event.currentTarget.value = "";
                                          }}
                                        />
                                      </label>
                                    </>
                                  )}
                                </div>
                                </div>

                                {draft.status === "not_sent" ? (
                                  <div style={{ marginBottom: 12 }}>
                                    <div style={{
                                      color: "#b9c6ce",
                                      fontSize: 11,
                                      marginBottom: 8,
                                    }}>
                                      Send the invoice using Premier's normal
                                      office process, then confirm here.
                                    </div>
                                    <button
                                      type="button"
                                      disabled={isSaving || (payment.key === "final_10" && !paymentInvoice)}
                                      onClick={() => {
                                        if (payment.key === "final_10" && !paymentInvoice) {
                                          setOfficePaymentsError("Attach the final 10% invoice first.");
                                          return;
                                        }
                                        const confirmed = window.confirm(
                                          "Have you already sent this invoice to the customer? This records the confirmation only. It does not send an email."
                                        );
                                        if (!confirmed) return;
                                        void saveOfficePayment(
                                          officeWorkLead,
                                          payment.key,
                                          { markSent: true }
                                        );
                                      }}
                                      style={{
                                        width: "100%",
                                        minHeight: 42,
                                        borderRadius: 9,
                                        border: "1px solid #557c64",
                                        background: "#173225",
                                        color: "#eaf5ee",
                                        fontWeight: 900,
                                        cursor: isSaving ? "wait" : "pointer",
                                      }}
                                    >
                                      {isSaving
                                        ? "Saving..."
                                        : payment.key === "final_10" && !paymentInvoice
                                        ? "Attach Invoice Before Confirming"
                                        : "Confirm Invoice Sent"}
                                    </button>
                                  </div>
                                ) : draft.status === "sent" ? (
                                  <div style={{
                                    padding: 10,
                                    marginBottom: 12,
                                    borderRadius: 9,
                                    border: "1px solid #557c64",
                                    background: "#14271c",
                                    color: "#a5d3b3",
                                    fontSize: 12,
                                    fontWeight: 800,
                                  }}>
                                    Invoice Sent — Confirmed by Office
                                  </div>
                                ) : null}

                                {draft.status === "received" ? (
                                  <div
                                    style={{
                                      border: "1px solid #557c64",
                                      borderRadius: 10,
                                      background: "#14271c",
                                      padding: 11,
                                      marginBottom: 10,
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: "#92c6a4",
                                        fontSize: 10,
                                        fontWeight: 900,
                                        marginBottom: 8,
                                        textTransform: "uppercase",
                                        letterSpacing: 0.7,
                                      }}
                                    >
                                      Payment Receipt
                                    </div>

                                    <div
                                      style={{
                                        display: "grid",
                                        gap: 6,
                                        color: "#d9e5ee",
                                        fontSize: 11,
                                        lineHeight: 1.45,
                                      }}
                                    >
                                      <div>
                                        <strong>Amount:</strong>{" "}
                                        {new Intl.NumberFormat("en-US", {
                                          style: "currency",
                                          currency: "USD",
                                        }).format(
                                          Number(
                                            String(draft.amount || "0").replace(/[^0-9.-]/g, "")
                                          ) || 0
                                        )}
                                      </div>

                                      <div>
                                        <strong>Method:</strong>{" "}
                                        {draft.method || "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â"}
                                      </div>

                                      <div>
                                        <strong>Received:</strong>{" "}
                                        {(draft as any).receivedAt
                                          ? new Intl.DateTimeFormat("en-US", {
                                              dateStyle: "medium",
                                              timeStyle: "short",
                                            }).format(new Date((draft as any).receivedAt))
                                          : "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â"}
                                      </div>

                                      <div>
                                        <strong>Recorded by:</strong>{" "}
                                        {(draft as any).updatedBy || "ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â"}
                                      </div>

                                      {draft.note ? (
                                        <div>
                                          <strong>Note:</strong> {draft.note}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                ) : null}

                                <div
                                  style={{
                                    display: draft.status === "received" ? "none" : "grid",
                                    gridTemplateColumns:
                                      "repeat(auto-fit, minmax(160px, 1fr))",
                                    gap: 8,
                                  }}
                                >


                                  <label
                                    style={{
                                      display: "grid",
                                      gap: 4,
                                      color: "#b9c6ce",
                                      fontSize: 10,
                                      fontWeight: 800,
                                    }}
                                  >
                                    Amount

                                    <div style={{ position: "relative" }}>
                                      <span aria-hidden="true" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#ffffff", fontSize: 14, fontWeight: 800, pointerEvents: "none" }}>$</span>
                                    <input
                                      inputMode="decimal"
                                      aria-label="Payment amount in dollars"
                                      value={String(draft.amount ?? "").replace(/^\$/, "")}
                                      disabled={isSaving || draft.status === "received"}
                                      onChange={(event) => {
                                        setOfficePaymentSavedStage(null);

                                        setOfficePaymentDrafts((current) => ({
                                          ...current,
                                          [payment.key]: {
                                            ...current[payment.key],
                                            amount: event.target.value,
                                          },
                                        }));
                                      }}
                                        onFocus={() => {
                                          if (draft.status === "received") return;

                                          setOfficePaymentDrafts((current) => ({
                                            ...current,
                                            [payment.key]: {
                                              ...current[payment.key],
                                              amount: current[payment.key].amount
                                                .replace(/[$,]/g, ""),
                                            },
                                          }));
                                        }}
                                        onBlur={() => {
                                          if (draft.status === "received") return;

                                          const numericAmount = Number(
                                            String(draft.amount)
                                              .replace(/[^0-9.-]/g, "")
                                          );

                                          if (!Number.isFinite(numericAmount)) return;

                                          const formattedAmount =
                                            new Intl.NumberFormat("en-US", {
                                              style: "currency",
                                              currency: "USD",
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }).format(numericAmount);

                                          setOfficePaymentDrafts((current) => ({
                                            ...current,
                                            [payment.key]: {
                                              ...current[payment.key],
                                              amount: formattedAmount,
                                            },
                                          }));
                                        }}
                                      placeholder="0.00"
                                      style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        minHeight: 40,
                                        border: "1px solid #405c6d",
                                        borderRadius: 8,
                                        background: "#0a1015",
                                        color: "#ffffff",
                                        padding: "0 9px 0 23px",
                                      }}
                                    />
                                    </div>
                                  </label>

                                  <label
                                    style={{
                                      display: "grid",
                                      gap: 4,
                                      color: "#b9c6ce",
                                      fontSize: 10,
                                      fontWeight: 800,
                                    }}
                                  >
                                    Method

                                    <select
                                      value={draft.method}
                                      disabled={isSaving}
                                      onChange={(event) => {
                                        setOfficePaymentSavedStage(null);

                                        setOfficePaymentDrafts((current) => ({
                                          ...current,
                                          [payment.key]: {
                                            ...current[payment.key],
                                            method: event.target.value,
                                          },
                                        }));
                                      }}
                                      style={{
                                        minHeight: 40,
                                        border: "1px solid #405c6d",
                                        borderRadius: 8,
                                        background: "#0a1015",
                                        color: "#ffffff",
                                        padding: "0 9px",
                                      }}
                                    >
                                      <option value="">Select method</option>
                                      <option value="Credit Card">
                                        Credit Card
                                      </option>
                                      <option value="Check">Check</option>
                                      <option value="ACH">ACH</option>
                                      <option value="Cash">Cash</option>
                                      <option value="Other">Other</option>
                                    </select>
                                  </label>


                                </div>

                                <label
                                  style={{
                                    display: draft.status === "received" ? "none" : "grid",
                                    gap: 4,
                                    color: "#b9c6ce",
                                    fontSize: 10,
                                    fontWeight: 800,
                                    marginTop: 8,
                                  }}
                                >
                                  Note

                                  <textarea
                                    value={draft.note}
                                    disabled={isSaving}
                                    onChange={(event) => {
                                      setOfficePaymentSavedStage(null);

                                      setOfficePaymentDrafts((current) => ({
                                        ...current,
                                        [payment.key]: {
                                          ...current[payment.key],
                                          note: event.target.value,
                                        },
                                      }));
                                    }}
                                    placeholder="Optional payment note..."
                                    rows={2}
                                    style={{
                                      width: "100%",
                                      border: "1px solid #405c6d",
                                      borderRadius: 8,
                                      background: "#0a1015",
                                      color: "#ffffff",
                                      padding: 9,
                                      resize: "vertical",
                                      boxSizing: "border-box",
                                    }}
                                  />
                                </label>

                                {isSaved ? (
                                  <div
                                    style={{
                                      color: "#92c6a4",
                                      fontSize: 10,
                                      fontWeight: 900,
                                      marginTop: 8,
                                    }}
                                  >
                                    Payment received
                                  </div>
                                ) : null}

                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() => {
                                    if (payment.key === "final_10" && !paymentInvoice) {
                                      setOfficePaymentsError("Attach the final 10% invoice before recording payment.");
                                      return;
                                    }
                                    if (!draft.amount.trim()) {
                                      setOfficePaymentsError("Enter the payment amount first.");
                                      return;
                                    }

                                    if (!draft.method) {
                                      setOfficePaymentsError("Choose the payment method first.");
                                      return;
                                    }

                                    setOfficePaymentsError("");

                                    void saveOfficePayment(
                                      officeWorkLead,
                                      payment.key as
                                        | "deposit_50"
                                        | "delivery_40"
                                        | "final_10",
                                      { markReceived: true }
                                    );
                                  }}
                                  style={{
                                    display: draft.status === "received" ? "none" : "block",
                                    width: "100%",
                                    minHeight: 42,
                                    marginTop: 9,
                                    border: "1px solid #557c64",
                                    borderRadius: 8,
                                    background: "#14271c",
                                    color: "#b7dec4",
                                    fontWeight: 900,
                                    cursor: isSaving ? "wait" : "pointer",
                                    opacity: isSaving ? 0.7 : 1,
                                  }}
                                >
                                  {isSaving
                                    ? "Recording Payment..."
                                    : draft.status === "received"
                                      ? "Payment Received"
                                      : `Mark ${payment.title} Payment Received`}
                                </button>

                                {payment.key === "delivery_40" &&
                                draft.status === "received" &&
                                ["production_setup", "installation_ready"].includes(officeWorkLead.current_stage) ? (
                                  <div
                                    style={{
                                      marginTop: 14,
                                      padding: 14,
                                      border: "2px solid #8fbea0",
                                      borderRadius: 12,
                                      background: "#14271c",
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: "#a6e0b8",
                                        fontSize: 11,
                                        fontWeight: 900,
                                        letterSpacing: 0.7,
                                        marginBottom: 6,
                                      }}
                                    >
                                      NEXT ACTION
                                    </div>
                                    <strong
                                      style={{
                                        display: "block",
                                        color: "#ffffff",
                                        fontSize: 16,
                                        marginBottom: 8,
                                      }}
                                    >
                                      {officeRjSent || officeRjRelease?.jobId === officeWorkLead.id
  ? "Sent to RJ"
  : officeProductionLoading || officePaymentsLoading
  ? "Checking Job Requirements"
  : !(["Received", "On Hand", "Not Required"].includes(officeProductionConfirmedStatus))
  ? "Waiting for Materials"
  : !["Approved", "Not required"].includes(officePermitConfirmedStatus)
  ? "Waiting for Permit Approval"
  : officePaymentDrafts.delivery_40?.status !== "received"
  ? "Collect 40% Payment"
  : "READY TO SEND TO RJ"}
                                    </strong>
                                    <div
                                      style={{
                                        color: "#c4d6ca",
                                        fontSize: 12,
                                        marginBottom: 12,
                                      }}
                                    >
                                      {officeRjSent || officeRjRelease?.jobId === officeWorkLead.id
  ? "The job has been handed off to RJ."
  : officeProductionLoading || officePaymentsLoading
  ? "Checking saved materials, permit, and payment records."
  : !(["Received", "On Hand", "Not Required"].includes(officeProductionConfirmedStatus))
  ? "Office must save materials as Received, On Hand, or Not Required before sending."
  : !["Approved", "Not required"].includes(officePermitConfirmedStatus)
  ? "Permit approval or Not Required must be saved before sending."
  : officePaymentDrafts.delivery_40?.status !== "received"
  ? "Record the 40% material delivery payment before sending."
  : "Materials ready. Permit cleared. 40% payment recorded. This job is ready for RJ."}
                                    </div>
              {["production_setup", "installation_ready"].includes(officeWorkLead.current_stage) ? (
                <button
                  type="button"
                  disabled={
                    officeRjSending ||
                    officeRjSent ||
                    officeRjRelease?.jobId === officeWorkLead.id ||
                    officeProductionLoading ||
                    officePaymentsLoading ||
                    !(["Received", "On Hand", "Not Required"].includes(officeProductionConfirmedStatus)) ||
                    !["Approved", "Not required"].includes(officePermitConfirmedStatus) ||
                    officePaymentDrafts.delivery_40?.status !== "received"
                  }
                  onClick={() => void sendOfficeJobToRJ(officeWorkLead)}
                  style={{
                    width: "100%",
                    minHeight: 72,
                    padding: 12,
                    border: "2px solid #86c99b",
                    borderRadius: 10,
                    background: officeRjSent || officeRjRelease?.jobId === officeWorkLead.id ? "#204631" : "#287447",
                    color: "#ffffff",
                    boxShadow: "0 4px 16px rgba(36, 127, 74, 0.22)",
                    fontWeight: 800,
                    textAlign: "center",
                    cursor: "pointer",
                    opacity: officeRjSending ? 0.6 : 1,
                  }}
                >
                  <strong style={{ display: "block", fontSize: 13 }}>
                    {officeRjSent || officeRjRelease?.jobId === officeWorkLead.id ? "Sent to RJ ✓" : officeRjSending ? "Sending to RJ..." : "Send Job to RJ →"}
                  </strong>
                  {officeRjRelease?.jobId === officeWorkLead.id ? (
                    <span style={{ display: "block", fontSize: 11, marginTop: 6 }}>
                      Sent by {officeRjRelease.releasedBy} · {new Date(officeRjRelease.releasedAt).toLocaleString()}
                    </span>
                  ) : null}
                </button>
              ) : null}
              {officeRjError ? (
                <div style={{ color: "#e4a7a7", fontSize: 12 }}>{officeRjError}</div>
              ) : null}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>

                        <div
                          style={{
                            marginTop: 12,
                            border: "1px solid #31495a",
                            borderRadius: 10,
                            background: "#101820",
                            padding: 10,
                            color: "#8fa0aa",
                            fontSize: 10,
                            lineHeight: 1.5,
                          }}
                        >
                          {["deposit_50", "delivery_40", "final_10"].every(
                            (key) => officePaymentDrafts[key]?.status === "received"
                          )
                            ? "All scheduled payments received. Complete Job is available below."
                            : "Scheduled payments are still outstanding. Record payments before completing this job."}
                        </div>
                        {officeWorkLead.current_stage === "inspection_complete" &&
                        officeWorkLead.inspection_type === "Final Walkthrough" &&
                        officeWorkLead.inspection_status === "Approved" ? (
                          <button
                            type="button"
                            disabled={officePaymentsLoading || !["deposit_50", "delivery_40", "final_10"].every(
                              (key) => officePaymentDrafts[key]?.status === "received"
                            )}
                            onClick={async () => {
                              if (!window.confirm("Complete this job and keep its payment and work history?")) return;
                              const token = getPremierOfficeAccessToken();
                              if (!token) { window.alert("Office access required."); return; }
                              const { data, error } = await supabase.rpc("complete_premier_job_closeout", {
                                p_access_token: token,
                                p_job_id: officeWorkLead.id,
                              });
                              if (error || data !== true) {
                                window.alert(error?.message || "Unable to complete job. Refresh and verify requirements.");
                                return;
                              }
                              setLiveLeads((current) => current.map((item) => item.id === officeWorkLead.id
                                ? { ...item, current_stage: "completed", status: "completed", next_action: "Job complete. Office may archive when ready." }
                                : item));
                              setOfficeWorkLeadId(null);
                              setOfficeWorkView(null);
                              setOpenLeadId(null);
                            }}
                            style={{ width: "100%", minHeight: 48, marginTop: 12, borderRadius: 10,
                              border: "1px solid #557c64", background: "#244934", color: "#fff",
                              fontSize: 14, fontWeight: 900,
                              cursor: officePaymentsLoading ? "wait" : "pointer" }}
                          >
                            Complete Job
                          </button>
                        ) : null}
                      </>
                    )}
                  </>
                ) : null}

                {officeWorkView === "final_measurement" ? (
                  <>
                    <div
                      style={{
                        color: "#9db7ca",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Final Measurement
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 5,
                      }}
                    >
                      Final Detailed Measurement
                    </strong>

                    <div
                      style={{
                        color: "#9ca8b2",
                        fontSize: 10,
                        lineHeight: 1.5,
                        marginBottom: 10,
                      }}
                    >
                      Schedule the Final Measurement for the salesperson who sold
                      this job. The completed measurement package will be handled
                      from the Sales Board and returned to Office for job setup before RJ release.
                    </div>

                    {officeApprovedSetupLoading ? (
                      <div
                        style={{
                          color: "#9ca8b2",
                          fontSize: 11,
                          padding: "8px 0",
                        }}
                      >
                        Loading final measurement...
                      </div>
                    ) : (
                      <>
                        <div
                          style={{
                            border: "1px solid #405c6d",
                            borderRadius: 10,
                            background: "#0d141a",
                            padding: 11,
                            marginBottom: 10,
                          }}
                        >
                          <div
                            style={{
                              color: "#9db7ca",
                              fontSize: 9,
                              fontWeight: 900,
                              textTransform: "uppercase",
                              letterSpacing: 0.7,
                            }}
                          >
                            Assigned Salesperson
                          </div>

                          <div
                            style={{
                              color: "#ffffff",
                              fontSize: 13,
                              fontWeight: 900,
                              marginTop: 4,
                            }}
                          >
                            {officeWorkLead?.assigned_salesperson || "Not assigned"}
                          </div>
                        </div>

                        <label
                          style={{
                            display: "grid",
                            gap: 5,
                            color: "#9ca8b2",
                            fontSize: 10,
                            fontWeight: 800,
                            marginBottom: 10,
                          }}
                        >
                          Final Measurement Assigned To
                          <select
                            value={
                              officeFinalMeasureDraft.assignedTo ||
                              (officeWorkLead?.assigned_salesperson?.startsWith("Dennis")
                                ? "Dennis"
                                : officeWorkLead?.assigned_salesperson?.startsWith("Gio ")
                                ? "Gio"
                                : officeWorkLead?.assigned_salesperson?.startsWith("Gino")
                                ? "Gino"
                                : "")
                            }
                            onChange={(event) => {
                              setOfficeFinalMeasureSaved(false);
                              setOfficeFinalMeasureDraft((current) => ({
                                ...current,
                                assignedTo: event.target.value,
                              }));
                            }}
                            style={{
                              width: "100%",
                              minHeight: 42,
                              border: "1px solid #405c6d",
                              borderRadius: 9,
                              background: "#0d141a",
                              color: "#ffffff",
                              padding: "0 10px",
                              boxSizing: "border-box",
                            }}
                          >
                            <option value="">Choose salesperson</option>
                            <option value="Dennis">Dennis Dillon</option>
                            <option value="Gio">Gio Richardson</option>
                            <option value="Gino">Gino Marquez</option>
                          </select>
                        </label>
                        <label style={{ display: "grid", gap: 5, color: "#9ca8b2", fontSize: 10, fontWeight: 800, marginBottom: 10 }}>
                          How should Final Measurement be scheduled?
                          <select value={finalMeasureSchedulingMode} onChange={(event) => {
                            setFinalMeasureSchedulingMode(event.target.value);
                            setOfficeFinalMeasureSaved(false);
                          }} style={{ minHeight: 42, background: "#0d141a", color: "#fff", border: "1px solid #405c6d", borderRadius: 9, padding: "0 10px" }}>
                            <option value="coordinate">Leave Scheduling to Salesperson</option>
                            <option value="morning">Morning Window</option>
                            <option value="afternoon">Afternoon Window</option>
                            <option value="specific">Specific Time (confirmed)</option>
                          </select>
                        </label>
                        {(finalMeasureSchedulingMode === "morning" || finalMeasureSchedulingMode === "afternoon") ? (
                          <label style={{ display: "grid", gap: 5, color: "#9ca8b2", fontSize: 10, marginBottom: 10 }}>
                            Requested Date (time to be confirmed by Sales)
                            <input type="date" value={finalMeasureWindowDate} onChange={(event) => { setFinalMeasureWindowDate(event.target.value); setOfficeFinalMeasureSaved(false); }} style={{ minHeight: 42, background: "#0d141a", color: "#fff", border: "1px solid #405c6d", borderRadius: 9, padding: "0 10px" }} />
                          </label>
                        ) : null}
                        {finalMeasureSchedulingMode === "specific" ? (<label
                          style={{
                            display: "grid",
                            gap: 5,
                            color: "#9ca8b2",
                            fontSize: 10,
                            fontWeight: 800,
                          }}
                        >
                          Final Measurement Date / Time
                          <input
                            type="datetime-local"
                            value={officeFinalMeasureDraft.scheduledFor}
                            onChange={(event) => {
                              setOfficeFinalMeasureSaved(false);
                              setOfficeFinalMeasureDraft((current) => ({
                                ...current,
                                status: "scheduled",
                                scheduledFor: event.target.value,
                              }));
                            }}
                            style={{
                              width: "100%",
                              minHeight: 42,
                              border: "1px solid #405c6d",
                              borderRadius: 9,
                              background: "#0d141a",
                              color: "#ffffff",
                              padding: "0 10px",
                              boxSizing: "border-box",
                            }}
                          />
                        </label>) : null}

                        <label
                          style={{
                            display: "grid",
                            gap: 5,
                            marginTop: 9,
                            color: "#9ca8b2",
                            fontSize: 10,
                            fontWeight: 800,
                          }}
                        >
                          Office Note
                          <textarea
                            value={officeFinalMeasureDraft.note}
                            onChange={(event) => {
                              setOfficeFinalMeasureSaved(false);
                              setOfficeFinalMeasureDraft((current) => ({
                                ...current,
                                note: event.target.value,
                              }));
                            }}
                            placeholder="Optional note for the salesperson..."
                            rows={3}
                            style={{
                              width: "100%",
                              border: "1px solid #405c6d",
                              borderRadius: 9,
                              background: "#0d141a",
                              color: "#ffffff",
                              padding: 10,
                              resize: "vertical",
                              boxSizing: "border-box",
                            }}
                          />
                        </label>

                        {officeApprovedSetupError ? (
                          <div
                            style={{
                              color: "#d8b267",
                              fontSize: 10,
                              marginTop: 8,
                            }}
                          >
                            {officeApprovedSetupError}
                          </div>
                        ) : null}

                        {officeFinalMeasureSaved ? (
                          <div
                            style={{
                              color: "#92c6a4",
                              fontSize: 10,
                              fontWeight: 900,
                              marginTop: 8,
                            }}
                          >
                            Final Measurement assignment saved and sent to Sales.
                          </div>
                        ) : null}

                        <button
                          type="button"
                          disabled={
                            officeFinalMeasureSaving ||
                            officeFinalMeasureSaved
                          }
                          onClick={() =>
                            void saveOfficeFinalMeasurement(officeWorkLead)
                          }
                          style={{
                            width: "100%",
                            minHeight: 44,
                            marginTop: 10,
                            border: officeFinalMeasureSaved
                              ? "1px solid #6fa982"
                              : "1px solid #557c64",
                            borderRadius: 10,
                            background: officeFinalMeasureSaved
                              ? "#203f2b"
                              : "#16271d",
                            color: officeFinalMeasureSaved
                              ? "#c9f2d3"
                              : "#dff5e5",
                            fontWeight: 900,
                            cursor:
                              officeFinalMeasureSaving ||
                              officeFinalMeasureSaved
                                ? "default"
                                : "pointer",
                          }}
                        >
                          {officeFinalMeasureSaving
                            ? "Saving..."
                            : officeFinalMeasureSaved
                              ? "SENT TO SALES"
                              : `Send Final Measurement to ${
                                  (officeFinalMeasureDraft.assignedTo === "Gio" ? "Gio Richardson" : officeFinalMeasureDraft.assignedTo === "Gino" ? "Gino Marquez" : officeFinalMeasureDraft.assignedTo === "Dennis" ? "Dennis Dillon" : officeFinalMeasureDraft.assignedTo) || officeWorkLead?.assigned_salesperson || "Salesperson"
                                }`}
                        </button>
                      </>
                    )}
                  </>
                ) : null}

                {officeWorkView === "continue_job" ? (
                  <>
                    <div
                      style={{
                        color: "#92c6a4",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Production Handoff
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 10,
                      }}
                    >
                      Continue Approved Job Setup
                    </strong>
                    <div style={{border:"1px solid #557c64",borderRadius:10,padding:12,marginBottom:14}}>
                      <strong style={{display:"block",color:"#d9e5ee",marginBottom:5}}>Blue Folder confirmation</strong>
                      <div style={{fontSize:12,color:"#b7c9d7",marginBottom:10}}>
                        {blueFolderLoading ? "Checking confirmation..." : blueFolderState?.jobId === officeWorkLead.id && blueFolderState.confirmedAt
                          ? `Confirmed by ${blueFolderState.confirmedBy || "Office"}`
                          : "Office must confirm the job documents after the 50% deposit is received."}
                      </div>
                      {blueFolderState?.jobId === officeWorkLead.id && blueFolderState.confirmedAt ? null : (
                        <button type="button" disabled={blueFolderSaving || blueFolderLoading || blueFolderState?.jobId !== officeWorkLead.id || officePaymentDrafts.deposit_50?.status !== "received"}
                          onClick={() => void confirmBlueFolder(officeWorkLead)}
                          style={{minHeight:40,padding:"8px 12px",border:"1px solid #557c64",borderRadius:8,background:"#14271c",color:"#b7dec4",fontWeight:800}}>
                          {blueFolderSaving ? "Confirming..." : "Confirm Blue Folder Ready"}
                        </button>
                      )}
                      {blueFolderError ? <div style={{color:"#d8b267",marginTop:8,fontSize:12}}>{blueFolderError}</div> : null}
                    </div>

                    {officeApprovedSetupLoading ? (
                      <div
                        style={{
                          color: "#9ca8b2",
                          fontSize: 11,
                          padding: "8px 0",
                        }}
                      >
                        Checking production readiness...
                      </div>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "grid",
                            gap: 8,
                            marginBottom: 10,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 10,
                              border: "1px solid #31495a",
                              borderRadius: 10,
                              background: "#0d141a",
                              padding: "10px 11px",
                            }}
                          >
                            <span
                              style={{
                                color: "#d9e5ee",
                                fontSize: 11,
                                fontWeight: 800,
                              }}
                            >
                              Deposit
                            </span>

                            <strong
                              style={{
                                color:
                                  officeDepositDraft.status === "received"
                                    ? "#92c6a4"
                                    : "#d8b267",
                                fontSize: 11,
                              }}
                            >
                              {officeDepositDraft.status === "received"
                                ? "Received"
                                : "Still Needed"}
                            </strong>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 10,
                              border: "1px solid #31495a",
                              borderRadius: 10,
                              background: "#0d141a",
                              padding: "10px 11px",
                            }}
                          >
                            <span
                              style={{
                                color: "#d9e5ee",
                                fontSize: 11,
                                fontWeight: 800,
                              }}
                            >
                              Final Measurement
                            </span>

                            <strong
                              style={{
                                color:
                                  officeFinalMeasureDraft.status === "complete"
                                    ? "#92c6a4"
                                    : "#d8b267",
                                fontSize: 11,
                              }}
                            >
                              {officeFinalMeasureDraft.status === "complete"
                                ? "Complete ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ"
                                : "Still Needed"}
                            </strong>
                          </div>
                        </div>

                        {officeDepositDraft.status === "received" &&
                        officeFinalMeasureDraft.status === "complete" ? (
                          <>
                            <div
                              style={{
                                border: "1px solid #557c64",
                                borderRadius: 11,
                                background: "#14271c",
                                padding: 11,
                                marginBottom: 10,
                              }}
                            >
                              <div
                                style={{
                                  color: "#92c6a4",
                                  fontSize: 9,
                                  fontWeight: 900,
                                  letterSpacing: 0.8,
                                  textTransform: "uppercase",
                                  marginBottom: 4,
                                }}
                              >
                                Ready for Production
                              </div>

                              <strong
                                style={{
                                  display: "block",
                                  color: "#d9e5ee",
                                  fontSize: 12,
                                }}
                              >
                                Deposit received and final measurement complete.
                              </strong>
                            </div>

                            <div
                              style={{
                                color: "#9ca8b2",
                                fontSize: 11,
                                lineHeight: 1.45,
                              }}
                            >
                              Next: begin ordering, materials, permitting,
                              scheduling, and field setup.
                            </div>

                            <button
                              type="button"
                              disabled={officeProductionStarting || blueFolderLoading || blueFolderState?.jobId !== officeWorkLead.id || !blueFolderState.confirmedAt}
                              onClick={() =>
                                void startOfficeProductionSetup(officeWorkLead)
                              }
                              style={{
                                width: "100%",
                                minHeight: 46,
                                marginTop: 12,
                                border: "1px solid #557c64",
                                borderRadius: 10,
                                background: "#14271c",
                                color: "#b7dec4",
                                fontSize: 13,
                                fontWeight: 900,
                                cursor: officeProductionStarting
                                  ? "wait"
                                  : "pointer",
                                opacity: officeProductionStarting ? 0.72 : 1,
                              }}
                            >
                              {officeProductionStarting
                                ? "Starting Production..."
                                : "Start Production Setup"}
                            </button>
                          </>
                        ) : (
                          <div
                            style={{
                              color: "#d8b267",
                              fontSize: 11,
                              lineHeight: 1.45,
                            }}
                          >
                            Production cannot begin until both the deposit and
                            final measurement are complete.
                          </div>
                        )}

                        {officeApprovedSetupError ? (
                          <div
                            style={{
                              color: "#d8b267",
                              fontSize: 10,
                              marginTop: 8,
                            }}
                          >
                            {officeApprovedSetupError}
                          </div>
                        ) : null}
                      </>
                    )}
                  </>
                ) : null}

                {officeWorkView === "final_closeout" ? (
                  <>
                    {officeWorkLead.current_stage === "inspection_complete" && String(officeWorkLead.next_action || "").toLowerCase().includes("final walkthrough approved") ? (
                      <div style={{ border: "1px solid #557c64", borderRadius: 11, padding: 14, background: "#12241c", color: "#d9e5ee", marginBottom: 18, fontSize: 13 }}>
                        <strong>Final Walkthrough Approved</strong>
                        <div style={{ marginTop: 8 }}>The walkthrough has already been approved. No second walkthrough needs scheduling. Office should review final payment and administrative closeout below.</div>
                      </div>
                    ) : null}
                    <div style={{
                      border: "1px solid #557c64",
                      borderRadius: 11,
                      padding: 14,
                      background: "#12241c",
                      display: officeWorkLead.current_stage === "inspection_complete" && String(officeWorkLead.next_action || "").toLowerCase().includes("final walkthrough approved") ? "none" : "grid",
                      gap: 12,
                      marginBottom: 18,
                    }}>
                      <strong style={{ fontSize: 15 }}>
                        Final Customer Walkthrough
                      </strong>

                      <div style={{
                        color: "#b9c6ce",
                        fontSize: 12,
                      }}>
                        Schedule with RJ or Gino. They reply through
                        Beam. Office records the customer's response.
                      </div>

                      {officeWalkthrough ? (
                        <div style={{
                          border: "1px solid #456a52",
                          borderRadius: 9,
                          padding: 11,
                          display: "grid",
                          gap: 5,
                          fontSize: 12,
                        }}>
                          <strong>
                            {officeWalkthrough.status === "approved"
                              ? "Customer Approved"
                              : officeWalkthrough.status ===
                                  "changes_requested"
                              ? "Customer Requested Changes"
                              : "Walkthrough Scheduled"}
                          </strong>
                          {officeWalkthrough.status === "scheduled" ? (
                            <div style={{
                              color: "#b9c6ce",
                              fontSize: 12,
                            }}>
                              Waiting for {
                                officeWalkthrough.assigned_to === "RJ"
                                  ? "RJ's"
                                  : "Gino's"
                              } Response
                            </div>
                          ) : null}
                          <div>
                            Assigned to: {
                              officeWalkthrough.assigned_to === "RJ"
                                ? "RJ"
                                : "Gino"
                            }
                          </div>
                          <div>
                            {new Date(
                              officeWalkthrough.scheduled_at
                            ).toLocaleString()}
                          </div>
                          {officeWalkthrough.outcome_recorded_by ? (
                            <div>
                              Recorded by {
                                officeWalkthrough.outcome_recorded_by
                              }
                            </div>
                          ) : null}
                          {officeWalkthrough.outcome_note ? (
                            <div>
                              {officeWalkthrough.outcome_note}
                            </div>
                          ) : null}
                        </div>
                      ) : null}

                      {officeWalkthrough?.status !== "approved" ? (
                        <>
                          <label style={{
                            display: "grid",
                            gap: 5,
                            fontSize: 12,
                          }}>
                            Assigned To
                            <select
                              value={officeWalkthroughAssignee}
                              onChange={(event) =>
                                setOfficeWalkthroughAssignee(
                                  event.target.value
                                )
                              }
                              style={{
                                minHeight: 42,
                                borderRadius: 8,
                                padding: 9,
                                background: "#0a1015",
                                color: "#fff",
                              }}
                            >
                              <option value="RJ">RJ</option>
                              <option value="Gino Marquez">Gino</option>
                            </select>
                          </label>

                          <label style={{
                            display: "grid",
                            gap: 5,
                            fontSize: 12,
                          }}>
                            Date and Time
                            <input
                              type="datetime-local"
                              value={officeWalkthroughDate}
                              onChange={(event) =>
                                setOfficeWalkthroughDate(
                                  event.target.value
                                )
                              }
                              style={{
                                minHeight: 42,
                                borderRadius: 8,
                                padding: 9,
                                background: "#0a1015",
                                color: "#fff",
                              }}
                            />
                          </label>

                          <textarea
                            value={officeWalkthroughNote}
                            onChange={(event) =>
                              setOfficeWalkthroughNote(
                                event.target.value
                              )
                            }
                            placeholder="Scheduling note (optional)"
                            style={{
                              minHeight: 65,
                              borderRadius: 8,
                              padding: 9,
                              background: "#0a1015",
                              color: "#fff",
                            }}
                          />

                          <button
                            type="button"
                            disabled={officeWalkthroughBusy}
                            onClick={() =>
                              void scheduleOfficeWalkthrough()
                            }
                            style={{
                              minHeight: 44,
                              borderRadius: 9,
                              background: "#173225",
                              border: "1px solid #557c64",
                              color: "#fff",
                              fontWeight: 900,
                            }}
                          >
                            {officeWalkthroughBusy
                              ? "Saving..."
                              : officeWalkthrough
                              ? "Reschedule Walkthrough"
                              : "Schedule Walkthrough"}
                          </button>
                        </>
                      ) : null}

                      {officeWalkthrough &&
                      officeWalkthrough.status !== "approved" ? (
                        <div style={{
                          display: "grid",
                          gap: 9,
                          borderTop: "1px solid #456a52",
                          paddingTop: 12,
                        }}>
                          <strong style={{ fontSize: 12 }}>
                            Customer Walkthrough Result
                          </strong>
                          <div style={{
                            color: "#b9c6ce",
                            fontSize: 11,
                          }}>
                            After RJ or Gino confirms the outcome
                            through Beam, record it here.
                          </div>
                          <textarea
                            value={officeWalkthroughOutcomeNote}
                            onChange={(event) =>
                              setOfficeWalkthroughOutcomeNote(
                                event.target.value
                              )
                            }
                            placeholder="Outcome note (optional for approval)"
                            style={{
                              minHeight: 65,
                              borderRadius: 8,
                              padding: 9,
                              background: "#0a1015",
                              color: "#fff",
                            }}
                          />
                          <button
                            type="button"
                            disabled={officeWalkthroughBusy}
                            onClick={() =>
                              void recordOfficeWalkthroughOutcome(
                                "approved"
                              )
                            }
                            style={{
                              minHeight: 44,
                              borderRadius: 9,
                              background: "#173225",
                              border: "1px solid #557c64",
                              color: "#fff",
                              fontWeight: 900,
                            }}
                          >
                            Confirm Customer Approved
                          </button>
                          <button
                            type="button"
                            disabled={officeWalkthroughBusy}
                            onClick={() =>
                              void recordOfficeWalkthroughOutcome(
                                "changes_requested"
                              )
                            }
                            style={{
                              minHeight: 42,
                              borderRadius: 9,
                              background: "#282017",
                              border: "1px solid #715441",
                              color: "#fff",
                              fontWeight: 900,
                            }}
                          >
                            Customer Requested Changes
                          </button>
                        </div>
                      ) : null}

                      {officeWalkthroughError ? (
                        <div style={{
                          color: "#f0aaaa",
                          fontSize: 12,
                        }}>
                          {officeWalkthroughError}
                        </div>
                      ) : null}
                    </div>
                    <div
                      style={{
                        color: "#9db7ca",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Final Payment / Administrative Closeout
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 10,
                      }}
                    >
                      {officePaymentDrafts.final_10?.status === "received" ? "Final Payment Received" : "Collect Final 10% to Close Job"}
                    </strong>
                    <div style={{ display: "grid", gap: 8, marginBottom: 12, fontSize: 12, color: "#d9e5ee" }}>
                      <div>50% Deposit: <strong>{officePaymentDrafts.deposit_50?.status === "received" ? "Received" : "Outstanding"}</strong>{officePaymentDrafts.deposit_50?.amount ? ` - ${officePaymentDrafts.deposit_50.amount}` : ""}</div>
                      <div>40% Material Payment: <strong>{officePaymentDrafts.delivery_40?.status === "received" ? "Received" : "Outstanding"}</strong>{officePaymentDrafts.delivery_40?.amount ? ` - ${officePaymentDrafts.delivery_40.amount}` : ""}</div>
                      <div>Final 10%: <strong>{officePaymentDrafts.final_10?.status === "received" ? "Received" : "Outstanding"}</strong>{officePaymentDrafts.final_10?.amount ? ` - ${officePaymentDrafts.final_10.amount}` : ""}</div>
                      <button type="button" onClick={() => { setOfficeWorkView("deposit"); void loadOfficePayments(officeWorkLead); }}
                        style={{ minHeight: 46, borderRadius: 10, border: "1px solid #557c64", background: "#244934", color: "#ffffff", fontWeight: 900, cursor: "pointer" }}>
                        {officePaymentDrafts.final_10?.status === "received" ? "View Payment Records" : "Collect Final 10% / Record Payment"}
                      </button>
                      <div style={{ fontSize: 11, color: "#aebbc4" }}>Use the existing invoice and receipt records. Mark Received only when payment is actually confirmed.</div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: 8,
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          border: "1px solid #263846",
                          borderRadius: 10,
                          background: "#101820",
                          padding: "10px 11px",
                          color: "#d9e5ee",
                          fontSize: 12,
                        }}
                      >
                        <strong>Installation:</strong> 100% Complete
                      </div>

                      <div
                        style={{
                          border: "1px solid #263846",
                          borderRadius: 10,
                          background: "#101820",
                          padding: "10px 11px",
                          color: "#d9e5ee",
                          fontSize: 12,
                        }}
                      >
                        <strong>Customer:</strong>{" "}
                        {officeWorkLead.first_name} {officeWorkLead.last_name}
                      </div>

                      <div
                        style={{
                          border: "1px solid #3d7459",
                          borderRadius: 10,
                          background: "#101820",
                          padding: "10px 11px",
                          color: "#b7dec4",
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        {["deposit_50", "delivery_40", "final_10"].every(
                          (key) => officePaymentDrafts[key]?.status === "received"
                        )
                          ? "All payments received. Ready for administrative closeout."
                          : "Payments are still outstanding. Record the remaining payments before completing closeout."}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={officeWorkLead.current_stage === "completed" || officePaymentsLoading || !["deposit_50", "delivery_40", "final_10"].every((key) => officePaymentDrafts[key]?.status === "received")}
                      onClick={async () => {
                        if (officeWorkLead.current_stage === "completed") return;
                        const accessToken =
                          getPremierOfficeAccessToken();

                        if (!accessToken) return;

                        const confirmed = window.confirm(
                          "Complete this job and move it to completed history?"
                        );

                        if (!confirmed) return;

                        const { data, error } = await supabase.rpc(
                          "complete_premier_job_closeout",
                          {
                            p_access_token: accessToken,
                            p_job_id: officeWorkLead.id,
                          }
                        );

                        if (error) {
                          console.error("Complete Job failed:", error);
                          return;
                        }

                        if (data === true) {
                          setOfficeWorkLeadId(null);
                          setOfficeWorkView(null);
                          setOpenLeadId(null);

                          setLiveLeads((current) =>
                            current.map((item) =>
                              item.id === officeWorkLead.id
                                ? {
                                    ...item,
                                    current_stage: "completed",
                                    status: "completed",
                                    next_action:
                                      "Job complete. Office may archive when ready.",
                                  }
                                : item
                            )
                          );
                        }
                      }}
                      style={{
                        width: "100%",
                        minHeight: 48,
                        borderRadius: 10,
                        border: "1px solid #557c64",
                        background: "#16232d",
                        color: "#ffffff",
                        fontWeight: 900,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {officeWorkLead.current_stage === "completed"
                        ? "Job Completed"
                        : "Complete Job"}
                    </button>
                  </>
                ) : null}

                {officeWorkView === "inspection_schedule" ? (
                  <>
                    <div
                      style={{
                        color: "#9db7ca",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Final Walkthrough
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 10,
                      }}
                    >
                      Office Final Walkthrough Scheduling
                    </strong>

                    <div style={{ display: "grid", gap: 10 }}>

                      <label style={{ display: "grid", gap: 5 }}>
                        <span style={{ color: "#9ca8b2", fontSize: 10 }}>
                          Walkthrough Date
                        </span>
                        <input
                          type="date"
                          value={officeInspectionDraft.scheduledDate}
                          onChange={(event) =>
                            setOfficeInspectionDraft((current) => ({
                              ...current,
                              scheduledDate: event.target.value,
                            }))
                          }
                          style={{
                            minHeight: 44,
                            border: "1px solid #31495a",
                            borderRadius: 9,
                            background: "#0c1116",
                            color: "#f3f6f8",
                            padding: "0 10px",
                          }}
                        />
                      </label>

                      <label style={{ display: "grid", gap: 5 }}>
                        <span style={{ color: "#9ca8b2", fontSize: 10 }}>
                          Time Window
                        </span>
                        <select
                          value={officeInspectionDraft.window}
                          onChange={(event) =>
                            setOfficeInspectionDraft((current) => ({
                              ...current,
                              window: event.target.value,
                            }))
                          }
                          style={{
                            minHeight: 44,
                            border: "1px solid #31495a",
                            borderRadius: 9,
                            background: "#0c1116",
                            color: "#f3f6f8",
                            padding: "0 10px",
                          }}
                        >
                          <option>Morning Window</option>
                          <option>Afternoon Window</option>
                          <option>All Day / Time TBD</option>
                          <option>Specific Time</option>
                        </select>
                        {officeInspectionDraft.window === "Specific Time" ? (
                          <label style={{ display: "grid", gap: 5, marginTop: 8 }}>
                            <span style={{ color: "#9ca8b2", fontSize: 10 }}>Appointment Time</span>
                            <input type="time" required value={officeInspectionDraft.specificTime}
                              onChange={(event) => setOfficeInspectionDraft((current) => ({ ...current, specificTime: event.target.value }))}
                              style={{ minHeight: 44, border: "1px solid #31495a", borderRadius: 9, background: "#0c1116", color: "#f3f6f8", padding: "0 10px" }} />
                          </label>
                        ) : null}
                      </label>

                      <label style={{ display: "grid", gap: 5 }}>
                        <span style={{ color: "#9ca8b2", fontSize: 10 }}>
                          Assigned To
                        </span>
                        <select value={officeInspectionDraft.assignedTo}
                          onChange={(event) => setOfficeInspectionDraft((current) => ({ ...current, assignedTo: event.target.value }))}
                          style={{ minHeight: 44, border: "1px solid #31495a", borderRadius: 9, background: "#0c1116", color: "#f3f6f8", padding: "0 10px", fontWeight: 800 }}>
                          <option value="RJ">RJ</option>
                          <option value="Gino">Gino</option>
                          <option value="RJ + Gino">RJ + Gino</option>
                        </select>
                      </label>

                      <button
                        type="button"
                        disabled={officeInspectionSaving}
                        onClick={() =>
                          void saveOfficeInspectionSchedule(officeWorkLead)
                        }
                        style={{
                          minHeight: 46,
                          border: "1px solid #557c64",
                          borderRadius: 10,
                          background: "#16232d",
                          color: "#d9e5ee",
                          fontWeight: 900,
                          cursor: officeInspectionSaving ? "wait" : "pointer",
                          opacity: officeInspectionSaving ? 0.7 : 1,
                        }}
                      >
                        {officeInspectionSaving ? "Saving..." : "Save & Relay"}
                      </button>

                      {officeInspectionError ? (
                        <div
                          style={{
                            color: "#e6a7a7",
                            fontSize: 11,
                          }}
                        >
                          {officeInspectionError}
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : null}

                {officeWorkView === "relay" ? (
                  <>
                    <div
                      style={{
                        color: "#92c6a4",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      {officeWorkLead.current_stage === "proposal_revision" ? "Revision Handoff" : "Relay to Sales"}
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 7,
                      }}
                    >
                      {officeWorkLead.current_stage === "proposal_revision"                         ? "Return Revised Proposal to "                         : "Return Proposal to "}                       {officeWorkLead.assigned_salesperson || "Sales"}
                    </strong>

                    <div
                      style={{
                        color: "#9ca8b2",
                        fontSize: 10,
                        lineHeight: 1.45,
                        marginBottom: 9,
                      }}
                    >
                      {officeWorkLead.current_stage === "proposal_revision"                         ? `Once the revised proposal is ready, it returns to ${                             officeWorkLead.assigned_salesperson || "Sales"                           } to present back to the customer.`                         : "This is the real handoff. Once sent, the job leaves the Office Inbox and returns to Sales as Proposal Ready."}
                    </div>

                    <button
                      type="button"
                      disabled={!officeWorkLead._sample && savingLeadDecisionId === officeWorkLead.id}
                      onClick={() => { if (officeWorkLead.current_stage === "proposal_revision") { if (officeWorkLead._sample) { window.alert(`Sample revision handoff: revised proposal would return to ${officeWorkLead.assigned_salesperson || "Sales"}. No live data was changed.`); return; } relayRevisedProposalToSales(officeWorkLead); return; } if (officeWorkLead._sample) { window.alert(`Sample handoff: this proposal would return to ${officeWorkLead.assigned_salesperson || "Sales"}. No live data was changed.`); return; } relayProposalToSales(officeWorkLead); }}
                      style={{
                        width: "100%",
                        minHeight: 44,
                        border: "1px solid #557c64",
                        borderRadius: 9,
                        background: "#14271c",
                        color: "#b7dec4",
                        fontWeight: 900,
                        cursor:
                          savingLeadDecisionId === officeWorkLead.id
                            ? "wait"
                            : "pointer",
                        opacity:
                          savingLeadDecisionId === officeWorkLead.id ? 0.7 : 1,
                      }}
                    >
                      {savingLeadDecisionId === officeWorkLead.id                         ? "Sending..."                         : officeWorkLead.current_stage === "proposal_revision"                         ? `Return Revised Proposal to ${officeWorkLead.assigned_salesperson || "Sales"}`                         : `Send Proposal to ${officeWorkLead.assigned_salesperson || "Sales"}`}
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}

            <details
              defaultOpen={["installation_in_progress", "installer_finish_back", "installation_complete", "inspection_complete", "scheduled", "installation_scheduled"].includes(officeWorkLead.current_stage)}
              style={{ marginTop: 14, marginBottom: 10, border: "1px solid #31495a", borderRadius: 12, padding: 10, background: "#101820" }}
            >
              <summary style={{ cursor: "pointer", color: "#d9e5ee", fontWeight: 900, padding: "8px 5px" }}>
                Field Activity, Inspection Proof &amp; Beam Messages
              </summary>
              <div style={{ marginTop: 12 }}>
            <section style={{
              border: "1px solid #456174",
              borderRadius: 12,
              padding: 14,
              marginBottom: 12,
              background: "#101b23",
              color: "#edf4f8",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
              }}>
                <strong>Field Activity &amp; Issues</strong>
                <button
                  type="button"
                  onClick={() => setOfficeFieldRefresh(v => v + 1)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #456174",
                    borderRadius: 8,
                    background: "#182a36",
                    color: "#edf4f8",
                    cursor: "pointer",
                  }}
                >Refresh</button>
              </div>
              <div style={{
                marginTop: 14,
                marginBottom: 14,
                borderTop: "1px solid #31495a",
                paddingTop: 12,
              }}>
                <strong>Bucking Photos & Inspection Records</strong>

                {officeProofLoading ? (
                  <p>Loading Bucking evidence...</p>
                ) : officeProofError ? (
                  <p style={{ color: "#f3b6a9" }}>{officeProofError}</p>
                ) : officeProofPhotos.length === 0 ? (
                  <p style={{ color: "#a4b5c0", fontSize: 12 }}>
                    No installer proof received yet.
                  </p>
                ) : (
                  <div style={{
                    display: "grid",
                    gap: 12,
                    marginTop: 12,
                  }}>
                    {officeProofPhotos.map((photo: any, index: number) => {
                      const imageUrl =
                        photo.signed_url ||
                        photo.signedUrl ||
                        photo.photo_url ||
                        photo.url ||
                        photo.image_url ||
                        "";

                      return (
                        <div key={photo.id || index} style={{
                          border: "1px solid #31495a",
                          borderRadius: 10,
                          padding: 12,
                          background: "#111820",
                          display: "grid",
                          gap: 8,
                        }}>
                          <strong>
  {(() => {
    const type = String(photo.proof_type || "");
    if (!type.startsWith("Repair / ")) {
      return type || "Installation Proof";
    }

    const issueId = type.slice("Repair / ".length);
    const issue = officeFieldReports.find(
      (report: any) => String(report.id) === issueId
    );

    if (!issue) return "Repair Photo";

    const categories = (issue.categories || [])
      .join(" ")
      .toLowerCase();
    const details = String(issue.details || "").toLowerCase();

    if (categories.includes("brake metal")) {
      return "Brake Metal - Repair Photo";
    }

    if (details.includes("window 6") ||
        details.includes("windows 6")) {
      return "Window 6 - Repair Photo";
    }

    return "Reported Damage - Repair Photo";
  })()}
</strong>

                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt="Installer proof"
                              style={{
                                width: "100%",
                                maxHeight: 280,
                                objectFit: "contain",
                                borderRadius: 8,
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: 12, color: "#b7c5cc" }}>
                              Photo record received.
                            </span>
                          )}

                          {photo.bucking_notes ? (
                            <div><strong>Bucking:</strong> {photo.bucking_notes}</div>
                          ) : null}

                          {photo.measurement_notes ? (
                            <div><strong>Measurements:</strong> {photo.measurement_notes}</div>
                          ) : null}

                          {photo.material_issue_notes ? (
                            <div><strong>Materials:</strong> {photo.material_issue_notes}</div>
                          ) : null}

                          {photo.needs_attention ? (
                            <div style={{
                              display: "grid",
                              gap: 5,
                              fontSize: 12,
                            }}>
                              <strong style={{ color: "#f0c77b" }}>
                                Flagged at Original Inspection
                              </strong>
                              <span style={{ color: "#b7c5cc" }}>
                                Historical inspection record. See reported
                                problems below for current repair status.
                              </span>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {officeFieldLoading ? (
                <p>Loading field reports...</p>
              ) : officeFieldError ? (
                <p style={{ color: "#f3b6a9" }}>{officeFieldError}</p>
              ) : officeFieldReports.length === 0 ? (
                <p style={{ color: "#a4b5c0", fontSize: 12 }}>
                  No field issues reported for this job.
                </p>
              ) : (
                <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                  <strong style={{ color: "#f0c77b" }}>
                    {(() => {
                      const openCount = officeFieldReports.filter(
                        (report: any) =>
                          officeIssueStatuses[String(report.id)]?.resolution_status !== "resolved"
                      ).length;

                      return openCount === 0
                        ? "All reported problems resolved"
                        : openCount === 1
                        ? "Needs Attention: 1 problem still needs attention"
                        : `Needs Attention: ${openCount} problems still need attention`;
                    })()}
                  </strong>
                  {officeFieldReports.map((report: any) => (
                    <div key={report.id} style={{
                      border: "1px solid #6d5235",
                      borderRadius: 9,
                      padding: 11,
                      background: "#251e17",
                    }}>
                      <strong>{(report.categories ?? []).join(", ") || "Field Issue"}</strong>
                      <p style={{ margin: "7px 0", whiteSpace: "pre-wrap" }}>
                        {report.details || "No additional notes."}
                      </p>
                      <div style={{ fontSize: 11, color: "#b7c5cc" }}>
                        {String(report.reporter_label || "Field Team").split(":").pop()}
                        {" · "}
                        {report.reported_at
                          ? new Date(report.reported_at).toLocaleString()
                          : "Time unavailable"}
                      </div>

                      <div style={{
                        borderTop: "1px solid #6d5235",
                        marginTop: 12,
                        paddingTop: 12,
                        display: "grid",
                        gap: 9,
                      }}>
                        <strong style={{ color: "#f0c77b", fontSize: 12 }}>
                          Status: {
                            officeIssueStatuses[String(report.id)]?.resolution_status === "resolved"
                              ? "Resolved"
                              : officeIssueStatuses[String(report.id)]?.resolution_status === "under_review"
                              ? "Being Handled"
                              : "Needs Review"
                          }
                        </strong>

                        {officeIssueStatusError ? (
                          <span style={{ color: "#f3b6a9", fontSize: 11 }}>
                            {officeIssueStatusError}
                          </span>
                        ) : null}

                        {officeIssueStatuses[String(report.id)]?.resolution_updated_by ? (
                          <span style={{ color: "#b7c5cc", fontSize: 11 }}>
                            Last updated by {
                              String(officeIssueStatuses[String(report.id)].resolution_updated_by)
                                .split(":").pop()
                            }
                            {" · "}
                            {officeIssueStatuses[String(report.id)].resolution_updated_at
                              ? new Date(
                                  officeIssueStatuses[String(report.id)].resolution_updated_at
                                ).toLocaleString()
                              : ""}
                          </span>
                        ) : null}

                        {officeIssueStatuses[String(report.id)]?.resolution_note ? (
                          <div style={{ color: "#c8d2d8", fontSize: 11 }}>
                            Latest note: {
                              officeIssueStatuses[String(report.id)].resolution_note
                            }
                          </div>
                        ) : null}

                        <div style={{
                          fontSize: 12,
                          color: "#c8d2d8",
                          lineHeight: 1.5,
                        }}>
                          {officeIssueStatuses[String(report.id)]?.resolution_status === "resolved"
                            ? "This problem was marked fixed. The report and its updates are saved. Reopen it if the problem returns."
                            : officeIssueStatuses[String(report.id)]?.resolution_status === "under_review"
                            ? "This problem is still open. Follow up with RJ or the installer. Once the fix is confirmed, describe what was done and click Problem Fixed."
                            : "A problem was reported. Click I've Seen This to acknowledge it. The problem will remain open until the fix is confirmed."}
                        </div>
                        <textarea
                          value={officeIssueNotes[String(report.id)] ?? ""}
                          onChange={(event) =>
                            setOfficeIssueNotes((current) => ({
                              ...current,
                              [String(report.id)]: event.target.value,
                            }))
                          }
                          placeholder="What is happening with this problem? Add a note here..."
                          rows={2}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            border: "1px solid #6d5235",
                            borderRadius: 8,
                            background: "#101820",
                            color: "#edf4f8",
                            padding: 10,
                            fontSize: 12,
                            resize: "vertical",
                          }}
                        />

                        {officeIssueActionError[String(report.id)] ? (
                          <span style={{ color: "#f3b6a9", fontSize: 11 }}>
                            {officeIssueActionError[String(report.id)]}
                          </span>
                        ) : null}

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {(
                            officeIssueStatuses[String(report.id)]?.resolution_status === "resolved"
                              ? [["Reopen Issue", "needs_review"]]
                              : officeIssueStatuses[String(report.id)]?.resolution_status === "under_review"
                              ? [["Problem Fixed", "resolved"]]
                              : [["I've Seen This", "under_review"]]
                          ).map(([label, nextStatus]) => (
                            <button
                              key={nextStatus}
                              type="button"
                              disabled={
                                officeIssueSavingId !== null ||
                                Boolean(officeIssueStatusError)
                              }
                              onClick={async () => {
                                const id = String(report.id);
                                const note = (officeIssueNotes[id] ?? "").trim();

                                if (nextStatus === "resolved" && note.length < 5) {
                                  setOfficeIssueActionError((current) => ({
                                    ...current,
                                    [id]: "Describe what was fixed before closing this problem.",
                                  }));
                                  return;
                                }

                                const token = getPremierOfficeAccessToken();
                                if (!token) {
                                  setOfficeIssueActionError((current) => ({
                                    ...current,
                                    [id]: "Office session required.",
                                  }));
                                  return;
                                }

                                setOfficeIssueSavingId(id);
                                setOfficeIssueActionError((current) => ({
                                  ...current,
                                  [id]: "",
                                }));

                                try {
                                  const { error } = await supabase.rpc(
                                    "update_premier_issue_resolution",
                                    {
                                      p_access_token: token,
                                      p_issue_id: id,
                                      p_new_status: nextStatus,
                                      p_note: note,
                                    }
                                  );

                                  if (error) throw error;

                                  setOfficeIssueNotes((current) => ({
                                    ...current,
                                    [id]: "",
                                  }));
                                  setOfficeIssueHistory((current) => ({
                                    ...current,
                                    [id]: [],
                                  }));
                                  setOfficeIssueHistoryOpen((current) => ({
                                    ...current,
                                    [id]: false,
                                  }));
                                  setOfficeFieldRefresh((current) => current + 1);
                                } catch {
                                  setOfficeIssueActionError((current) => ({
                                    ...current,
                                    [id]: "Could not save the status. Please retry.",
                                  }));
                                } finally {
                                  setOfficeIssueSavingId(null);
                                }
                              }}
                              style={{
                                border: "1px solid #78aa88",
                                borderRadius: 8,
                                padding: "9px 12px",
                                background: "#173225",
                                color: "#e0f0e4",
                                fontWeight: 800,
                                cursor: "pointer",
                              }}
                            >
                              {officeIssueSavingId === String(report.id)
                                ? "Saving..."
                                : label}
                            </button>
                          ))}

                          <button
                            type="button"
                            disabled={officeIssueHistoryLoading === String(report.id)}
                            onClick={async () => {
                              const id = String(report.id);

                              if (officeIssueHistoryOpen[id]) {
                                setOfficeIssueHistoryOpen((current) => ({
                                  ...current,
                                  [id]: false,
                                }));
                                return;
                              }

                              const token = getPremierOfficeAccessToken();
                              if (!token) return;

                              setOfficeIssueHistoryLoading(id);

                              try {
                                const { data, error } = await supabase.rpc(
                                  "get_premier_issue_history",
                                  {
                                    p_access_token: token,
                                    p_issue_id: id,
                                  }
                                );

                                if (error) throw error;

                                setOfficeIssueHistory((current) => ({
                                  ...current,
                                  [id]: data ?? [],
                                }));
                                setOfficeIssueHistoryOpen((current) => ({
                                  ...current,
                                  [id]: true,
                                }));
                              } catch {
                                setOfficeIssueActionError((current) => ({
                                  ...current,
                                  [id]: "Could not load issue history.",
                                }));
                              } finally {
                                setOfficeIssueHistoryLoading(null);
                              }
                            }}
                            style={{
                              border: "1px solid #456174",
                              borderRadius: 8,
                              padding: "9px 12px",
                              background: "#182a36",
                              color: "#edf4f8",
                              cursor: "pointer",
                            }}
                          >
                            {officeIssueHistoryLoading === String(report.id)
                              ? "Loading..."
                              : officeIssueHistoryOpen[String(report.id)]
                              ? "Hide Updates"
                              : "See Updates"}
                          </button>
                        </div>

                        {officeIssueHistoryOpen[String(report.id)] ? (
                          <div style={{ display: "grid", gap: 8 }}>
                            {(officeIssueHistory[String(report.id)] ?? []).length === 0 ? (
                              <span style={{ fontSize: 11, color: "#a4b5c0" }}>
                                No status changes recorded yet.
                              </span>
                            ) : (
                              (officeIssueHistory[String(report.id)] ?? []).map(
                                (entry: any, index: number) => (
                                  <div key={index} style={{
                                    border: "1px solid #31495a",
                                    borderRadius: 8,
                                    padding: 9,
                                    fontSize: 11,
                                  }}>
                                    <strong>
                                      {String(entry.old_status).replaceAll("_", " ")}
                                      {" → "}
                                      {String(entry.new_status).replaceAll("_", " ")}
                                    </strong>
                                    <div>{entry.note || "No note provided."}</div>
                                    <div style={{ color: "#a4b5c0", marginTop: 4 }}>
                                      {String(entry.actor_label || "").split(":").pop()}
                                      {" · "}
                                      {entry.changed_at
                                        ? new Date(entry.changed_at).toLocaleString()
                                        : ""}
                                    </div>
                                  </div>
                                )
                              )
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div
              style={{
                marginBottom: 12,
                  border: "1px solid #78aa88",
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg, #173225 0%, #101b16 100%)",
                  boxShadow:
                    "0 0 0 1px rgba(139,184,154,0.08), 0 8px 24px rgba(0,0,0,0.18)",
                  padding: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#8fa9bc",
                      fontSize: 9,
                      fontWeight: 900,
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    Beam Quick Message
                  </div>

                  <div
                    style={{
                      color: "#d9e5ee",
                      fontSize: 13,
                      fontWeight: 800,
                      marginTop: 3,
                    }}
                  >
                    Fast job communication
                  </div>
                </div>

                <button
                  type="button"
                  disabled={officeBeamLoading}
                  onClick={() => void loadOfficeBeam(officeWorkLead.id)}
                  style={{
                    minHeight: 34,
                    border: "1px solid #31495a",
                    borderRadius: 8,
                    background: "#101820",
                    color: "#aebbc5",
                    padding: "0 10px",
                    fontSize: 10,
                    fontWeight: 800,
                    cursor: officeBeamLoading ? "wait" : "pointer",
                    opacity: officeBeamLoading ? 0.65 : 1,
                  }}
                >
                  {officeBeamLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              <div
                style={{
                  border: "1px solid #294a36",
                  borderRadius: 10,
                  background: "#0d1711",
                  padding: 9,
                  maxHeight: 220,
                  overflowY: "auto",
                  marginBottom: 10,
                }}
              >
                {officeBeamLoading && officeBeamMessages.length === 0 ? (
                  <div style={{ color: "#7f8b95", fontSize: 11 }}>
                    Loading Beam...
                  </div>
                ) : officeBeamMessages.length === 0 ? (
                  <div style={{ color: "#7f8b95", fontSize: 11 }}>
                    No Beam messages yet.
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {officeBeamMessages.map((message) => (
                      <div
                        key={message.id}
                        style={{
                          border:
                            message.recipient_role === "Office" && !message.read_at
                              ? "1px solid #5d7d91"
                              : "1px solid #26343e",
                          borderRadius: 9,
                          background:
                            message.sender_role === "Office"
                              ? "#111d25"
                              : "#101419",
                          padding: "9px 10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                            flexWrap: "wrap",
                            marginBottom: 5,
                          }}
                        >
                          <strong style={{ color: "#d9e5ee", fontSize: 11 }}>
                            {message.sender_label || message.sender_role}
                          </strong>

                          <span style={{ color: "#667680", fontSize: 9 }}>
                            {message.created_at
                              ? new Date(message.created_at).toLocaleString()
                              : ""}
                          </span>
                        </div>

                        <div style={{ color: "#9db7ca", fontSize: 9, marginBottom: 5 }}>
                          {message.sender_role} {" → "} {message.recipient_role}
                        </div>

                        <div
                          style={{
                            color: "#c8d2d8",
                            fontSize: 12,
                            lineHeight: 1.45,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {String(message.body ?? "").trim() === "," ? "" : message.body}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {officeBeamError ? (
                <div
                  style={{
                    color: "#e1a3a3",
                    fontSize: 10,
                    marginBottom: 8,
                  }}
                >
                  {officeBeamError}
                </div>
              ) : null}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(120px, 160px) minmax(0, 1fr) 46px",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <select
                  value={officeBeamRecipient}
                  onChange={(event) =>
                    setOfficeBeamRecipient(
                      event.target.value as
                        | "Gio Richardson"
                        | "Gino Marquez"
                        | "Dennis Dillon"
                        | "RJ"
                        | "Angel"
                    )
                  }
                  style={{
                    minHeight: 40,
                    border: "1px solid #31495a",
                    borderRadius: 9,
                    background: "#101820",
                    color: "#d9e5ee",
                    padding: "0 9px",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  <option value="Gio Richardson">Gio Richardson</option>
                  <option value="Gino Marquez">Gino Marquez</option>
                  <option value="Dennis Dillon">Dennis Dillon</option>
                  <option value="RJ">RJ</option>
                  <option value="Angel">Angel</option>
                </select>

                <textarea
                  value={officeBeamBody}
                  onChange={(event) => setOfficeBeamBody(event.target.value)}
                  placeholder="Send a quick job message..."
                  rows={2}
                  style={{
                    width: "100%",
                    minHeight: 54,
                    resize: "vertical",
                    border: "1px solid #31495a",
                    borderRadius: 9,
                    background: "#101820",
                    color: "#f3f6f8",
                    padding: "9px 10px",
                    fontSize: 12,
                    lineHeight: 1.4,
                    boxSizing: "border-box",
                  }}
                />

                <button
                  type="button"
                  onClick={startOfficeBeamVoiceInput}
                  disabled={officeBeamListening}
                  title={officeBeamListening ? "Listening..." : "Talk message"}
                  aria-label={officeBeamListening ? "Listening..." : "Talk message"}
                  style={{
                    minHeight: 54,
                    border: officeBeamListening
                      ? "1px solid #d98778"
                      : "1px solid #8fbea0",
                    borderRadius: 9,
                    background: officeBeamListening
                      ? "#7a2d24"
                      : "#2f6842",
                    color: "#ffffff",
                    fontSize: 20,
                    cursor: officeBeamListening ? "wait" : "pointer",
                    boxShadow: officeBeamListening
                      ? "0 0 0 2px rgba(217,135,120,0.18), 0 0 18px rgba(217,135,120,0.22)"
                      : "none",
                    transition: "all 160ms ease",
                  }}
                >
                  Mic</button>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                {[
                  "Please review.",
                  "Call Office when available.",
                  "Need an update.",
                  "Issue needs attention.",
                ].map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => setOfficeBeamBody(reply)}
                    style={{
                      minHeight: 30,
                      border: "1px solid #477057",
                      borderRadius: 999,
                      background: "#173225",
                      color: "#cce8d4",
                      padding: "0 9px",
                      fontSize: 9,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={officeBeamSending || !officeBeamBody.trim()}
                onClick={() => void sendOfficeBeamMessage()}
                style={{
                  width: "100%",
                  minHeight: 40,
                  border: "1px solid #557c64",
                  borderRadius: 9,
                  background: "#14271c",
                  color: "#b7dec4",
                  fontWeight: 900,
                  cursor:
                    officeBeamSending || !officeBeamBody.trim()
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    officeBeamSending || !officeBeamBody.trim() ? 0.55 : 1,
                }}
              >
                {officeBeamSending
                  ? "Sending..."
                  : `Send to ${officeBeamRecipient}`}
              </button>
            </div>

              </div>
            </details>

            {!officeWorkLead._sample ? (
              <button
                type="button"
                disabled={archivingJobId === officeWorkLead.id}
                onClick={async () => {
                  const confirmed = window.confirm(
                    "Archive this job? It will leave the active Office board, but the customer record and job history will be preserved."
                  );

                  if (!confirmed) return;

                  const accessToken = new URLSearchParams(
                    window.location.search
                  ).get("access");

                  if (!accessToken) {
                    window.alert("Premier staff access token missing.");
                    return;
                  }

                  setArchivingJobId(officeWorkLead.id);

                  const { data, error } = await supabase.rpc(
                    "archive_premier_job",
                    {
                      p_access_token: accessToken,
                      p_job_id: officeWorkLead.id,
                    }
                  );

                  setArchivingJobId(null);

                  if (error) {
                    console.error("Archive Premier job failed:", error);
                    window.alert(
                      error.message || "This job could not be archived."
                    );
                    return;
                  }

                  if (data !== true) {
                    window.alert("This job could not be archived.");
                    return;
                  }

                  setLiveLeads((current) =>
                    current.filter((item) => item.id !== officeWorkLead.id)
                  );

                  setCustomerEditOpen(false);
                  setOfficeWorkView(null);
                  setOfficeWorkLeadId(null);
                }}
                style={{
                  width: "100%",
                  display: "block",
                  minHeight: 42,
                  marginTop: 10,
                  border: "1px solid #744548",
                  borderRadius: 10,
                  background: "#241416",
                  color: "#e8b6b9",
                  fontWeight: 900,
                  cursor:
                    archivingJobId === officeWorkLead.id
                      ? "wait"
                      : "pointer",
                  opacity:
                    archivingJobId === officeWorkLead.id ? 0.65 : 1,
                }}
              >
                {archivingJobId === officeWorkLead.id
                  ? "Archiving..."
                  : "Archive Job"}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setOfficeWorkLeadId(null);
                setOfficeWorkView(null);
              }}
              style={{
                width: "100%",
                display: "block",
                minHeight: 42,
                marginTop: 10,
                border: "1px solid #31495a",
                borderRadius: 10,
                background: "#101820",
                color: "#d9e5ee",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </section>
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 430px) minmax(0, 1fr)",
            gap: 18,
            alignItems: "start",
          }}
          className="premier-layout"
        >
          <div style={{ display: "grid", gap: 12 }}>
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setActiveJobId(job.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border:
                    activeJobId === job.id
                      ? "1px solid #87a9c0"
                      : "1px solid #242d34",
                  borderRadius: 18,
                  padding: 17,
                  background:
                    activeJobId === job.id ? "#111820" : "#101419",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <strong style={{ fontSize: 17 }}>{job.customer}</strong>
                  <Pill>{job.status}</Pill>
                </div>

                <div
                  style={{
                    color: "#a9b1b8",
                    fontSize: 13,
                    marginBottom: 12,
                  }}
                >
                  {job.address}
                </div>

                <div style={{ fontSize: 14, marginBottom: 12 }}>{job.scope}</div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    color: "#b7c0c7",
                    fontSize: 12,
                  }}
                >
                  <div>
                    <strong style={{ color: "#fff" }}>ETA:</strong>{" "}
                    {job.materialEta}
                  </div>
                  <div>
                    <strong style={{ color: "#fff" }}>Sales:</strong>{" "}
                    {job.salesperson}
                  </div>
                  <div>
                    <strong style={{ color: "#fff" }}>Permit:</strong>{" "}
                    {job.permitStatus}
                  </div>
                  <div>
                    <strong style={{ color: "#fff" }}>Crew:</strong> {job.crew}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #252d34",
                    marginTop: 14,
                    paddingTop: 12,
                    fontSize: 13,
                    color: "#d7dde2",
                  }}
                >
                  <span style={{ color: "#8fa9bc" }}>Next:</span>{" "}
                  {job.nextAction}
                </div>
              </button>
            ))}
          </div>

          {activeJob ? (
            <div
              style={{
                border: "1px solid #27323a",
                borderRadius: 22,
                background: "#0d1115",
                padding: 18,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  alignItems: "flex-start",
                  marginBottom: 18,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#8fa9bc",
                      fontWeight: 800,
                      marginBottom: 6,
                    }}
                  >
                    {activeJob.id}
                  </div>

                  <h2 style={{ margin: 0, fontSize: 28 }}>
                    {activeJob.customer}
                  </h2>

                  <div
                    style={{
                      color: "#a8b0b7",
                      marginTop: 6,
                      fontSize: 14,
                    }}
                  >
                    {activeJob.address}
                  </div>
                </div>

                <Pill>{effectiveStatus}</Pill>
              </div>

              <div
                style={{
                  border: "1px solid #2c3943",
                  background: "#14202a",
                  borderRadius: 16,
                  padding: 15,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "#8fa9bc",
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  Next Action
                </div>
                <strong>{effectiveNextAction}</strong>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 9,
                  marginBottom: 12,
                }}
                className="premier-action-grid"
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveAction((current) =>
                      current === "update" ? null : "update"
                    )
                  }
                  style={{
                    minHeight: 46,
                    border: "1px solid #344958",
                    borderRadius: 13,
                    background: "#111820",
                    color: "#f5f7f5",
                    fontWeight: 800,
                    cursor: "pointer",
                    padding: "10px 12px",
                  }}
                >
                  Add Update
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveAction((current) =>
                      current === "photo" ? null : "photo"
                    )
                  }
                  style={{
                    minHeight: 46,
                    border: "1px solid #344958",
                    borderRadius: 13,
                    background: "#111820",
                    color: "#f5f7f5",
                    fontWeight: 800,
                    cursor: "pointer",
                    padding: "10px 12px",
                  }}
                >
                  Upload Photo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveAction((current) =>
                      current === "schedule" ? null : "schedule"
                    )
                  }
                  style={{
                    minHeight: 46,
                    border: "1px solid #344958",
                    borderRadius: 13,
                    background: "#111820",
                    color: "#f5f7f5",
                    fontWeight: 800,
                    cursor: "pointer",
                    padding: "10px 12px",
                  }}
                >
                  Schedule
                </button>
              </div>

              {activeAction ? (
                <div
                  style={{
                    border: "1px solid #2f3d47",
                    background: "#10161b",
                    borderRadius: 14,
                    padding: 14,
                    marginBottom: 12,
                  }}
                >
                  {activeAction === "update" ? (
                    <div style={{ display: "grid", gap: 10 }}>
                      <strong>Add Job Update</strong>

                      <textarea
                        value={updateText}
                        onChange={(event) => setUpdateText(event.target.value)}
                        placeholder="What happened? What does the team need to know?"
                        rows={3}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          resize: "vertical",
                          border: "1px solid #34434d",
                          borderRadius: 10,
                          background: "#0b0f13",
                          color: "#f5f7f5",
                          padding: 11,
                          font: "inherit",
                        }}
                      />

                      <button
                        type="button"
                        disabled={!updateText.trim()}
                        onClick={() => {
                          if (!updateText.trim()) return;

                          setDemoUpdates((current) => [
                            {
                              time: new Date().toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }),
                              event: updateText.trim(),
                            },
                            ...current,
                          ]);

                          setUpdateText("");
                          setActiveAction(null);
                        }}
                        style={{
                          minHeight: 42,
                          border: "1px solid #486578",
                          borderRadius: 10,
                          background: "#1a2a36",
                          color: "#fff",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        Save Update
                      </button>
                    </div>
                  ) : null}

                  {activeAction === "photo" ? (
                    <div style={{ display: "grid", gap: 10 }}>
                      <strong>Add Photo Proof</strong>

                      <select
                        value={photoCategory}
                        onChange={(event) => setPhotoCategory(event.target.value)}
                        style={{
                          minHeight: 42,
                          border: "1px solid #34434d",
                          borderRadius: 10,
                          background: "#0b0f13",
                          color: "#f5f7f5",
                          padding: "0 10px",
                        }}
                      >
                        <option>Before</option>
                        <option>Measurements</option>
                        <option>Permit / Inspection</option>
                        <option>Installation</option>
                        <option>Problems</option>
                        <option>After</option>
                      </select>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          if (!event.target.files?.length) return;

                          setPhotoCounts((current) => ({
                            ...current,
                            [photoCategory]:
                              (current[photoCategory] ?? 0) +
                              event.target.files!.length,
                          }));

                          setDemoUpdates((current) => [
                            {
                              time: new Date().toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }),
                              event: `${event.target.files!.length} photo ${
                                event.target.files!.length === 1
                                  ? "was"
                                  : "were"
                              } added to ${photoCategory}.`,
                            },
                            ...current,
                          ]);

                          setActiveAction(null);
                        }}
                        style={{
                          color: "#d5dbe0",
                          fontSize: 13,
                        }}
                      />
                    </div>
                  ) : null}

                  {activeAction === "schedule" ? (
                    <div style={{ display: "grid", gap: 10 }}>
                      <strong>Schedule Job</strong>

                      <select
                        value={scheduledCrew}
                        onChange={(event) =>
                          setScheduledCrew(event.target.value)
                        }
                        style={{
                          minHeight: 42,
                          border: "1px solid #34434d",
                          borderRadius: 10,
                          background: "#0b0f13",
                          color: "#f5f7f5",
                          padding: "0 10px",
                        }}
                      >
                        <option>Not assigned</option>
                        <option>Crew 1</option>
                        <option>Crew 2</option>
                        <option>Crew 3</option>
                      </select>

                      <input
                        type="date"
                        onChange={(event) =>
                          setScheduledDate(event.target.value)
                        }
                        style={{
                          minHeight: 42,
                          border: "1px solid #34434d",
                          borderRadius: 10,
                          background: "#0b0f13",
                          color: "#f5f7f5",
                          padding: "0 10px",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setDemoUpdates((current) => [
                            {
                              time: new Date().toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }),
                              event: `Job scheduled with ${scheduledCrew}${
                                scheduledDate
                                  ? ` for ${scheduledDate}`
                                  : ""
                              }.`,
                            },
                            ...current,
                          ]);

                          setActiveAction(null);
                        }}
                        style={{
                          minHeight: 42,
                          border: "1px solid #486578",
                          borderRadius: 10,
                          background: "#1a2a36",
                          color: "#fff",
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        Save Schedule
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {attentionItems.length > 0 ? (
                <div
                  style={{
                    border: "1px solid #4b3d25",
                    background: "#211b11",
                    borderRadius: 14,
                    padding: "12px 14px",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      color: "#d9b982",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      fontWeight: 900,
                      marginBottom: 5,
                    }}
                  >
                    Needs Attention
                  </div>

                  <div
                    style={{
                      color: "#f0e5cf",
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    {attentionItems.map((item, index) => (
                      <div key={index}>{item}</div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 10,
                  marginBottom: 18,
                }}
                className="premier-summary-grid"
              >
                {[
                  ["Material ETA", activeJob.materialEta],
                  ["Permit", activeJob.permitStatus],
                  ["Crew", effectiveCrew],
                  ["Schedule", effectiveSchedule],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      background: "#101419",
                      border: "1px solid #252f36",
                      borderRadius: 14,
                      padding: 13,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "#8f989f",
                        marginBottom: 5,
                      }}
                    >
                      {label}
                    </div>
                    <strong style={{ fontSize: 13 }}>{value}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                <CollapsibleSection title="Job Truth" defaultOpen>
                  <div
                    style={{
                      display: "grid",
                      gap: 12,
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    <div>
                      <strong>Approved scope</strong>
                      <div style={{ color: "#aeb6bc", marginTop: 4 }}>
                        8 impact windows, rear French door, white frames,
                        removal and disposal included.
                      </div>
                    </div>

                    <div>
                      <strong>What the customer was told</strong>
                      <div style={{ color: "#aeb6bc", marginTop: 4 }}>
                        Rear door may require additional stucco work depending
                        on opening condition.
                      </div>
                    </div>

                    <div>
                      <strong>Field expectation</strong>
                      <div style={{ color: "#aeb6bc", marginTop: 4 }}>
                        Preserve existing blinds. Dog on property. Customer
                        prefers arrival before 9 AM.
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Beam Cards">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(210px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {[
                      ["Window 01", '36 1/4" x 62 1/2"', "Master Bedroom"],
                      ["Window 02", '48" x 60"', "Living Room"],
                      ["Door 01", '72" x 80"', "Rear French Door"],
                    ].map(([name, measure, location]) => (
                      <div
                        key={name}
                        style={{
                          border: "1px solid #2a333a",
                          borderRadius: 14,
                          padding: 13,
                          background: "#0d1115",
                        }}
                      >
                        <strong>{name}</strong>
                        <div
                          style={{
                            color: "#9da6ad",
                            fontSize: 12,
                            marginTop: 5,
                          }}
                        >
                          {location}
                        </div>
                        <div style={{ marginTop: 10 }}>{measure}</div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Photos & Proof">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: 8,
                    }}
                  >
                    {[
                      ["Before", `${photoCounts["Before"]} photos`],
                      ["Measurements", `${photoCounts["Measurements"]} photos`],
                      [
                        "Permit / Inspection",
                        `${photoCounts["Permit / Inspection"]} of 6`,
                      ],
                      [
                        "Installation",
                        `${photoCounts["Installation"]} photos`,
                      ],
                      ["Problems", `${photoCounts["Problems"]} photos`],
                      ["After", `${photoCounts["After"]} photos`],
                    ].map(([label, count]) => (
                      <div
                        key={label}
                        style={{
                          border: "1px solid #29323a",
                          borderRadius: 12,
                          padding: 12,
                        }}
                      >
                        <strong style={{ fontSize: 13 }}>{label}</strong>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#9ea6ad",
                            marginTop: 5,
                          }}
                        >
                          {count}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: 14,
                      borderTop: "1px solid #29323a",
                      paddingTop: 14,
                      color: "#cfd5da",
                      fontSize: 13,
                      lineHeight: 1.8,
                    }}
                  >
                    Required inspection proof: fastener photo, concrete/block
                    opening, stucco condition, product label, installed unit,
                    exterior overview.
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Materials">
                  <div
                    style={{
                      display: "grid",
                      gap: 9,
                      fontSize: 14,
                    }}
                  >
                    <div>
                      <strong>Supplier:</strong> ES Windows
                    </div>
                    <div>
                      <strong>PO:</strong> 48592
                    </div>
                    <div>
                      <strong>Ordered:</strong> Aug 1
                    </div>
                    <div>
                      <strong>Estimated Arrival:</strong>{" "}
                      {activeJob.materialEta}
                    </div>
                    <div
                      style={{
                        marginTop: 5,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <Pill>Manufacturer PO</Pill>
                      <Pill>Final Order</Pill>
                      <Pill>Packing List</Pill>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Permits & Inspections">
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      fontSize: 14,
                      color: "#d0d6db",
                    }}
                  >
                    <div>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Owner signature</div>
                    <div>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Contractor signature</div>
                    <div>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Application</div>
                    <div>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Product approvals</div>
                    <div>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œ Permit approved</div>
                    <div>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ In-progress inspection</div>
                    <div>ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ Final inspection</div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Schedule">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap: 9,
                    }}
                  >
                    <div>
                      <strong>Material</strong>
                      <div style={{ color: "#93adc0", marginTop: 4 }}>
                        Ready
                      </div>
                    </div>
                    <div>
                      <strong>Permit</strong>
                      <div style={{ color: "#93adc0", marginTop: 4 }}>
                        Ready
                      </div>
                    </div>
                    <div>
                      <strong>Measurements</strong>
                      <div style={{ color: "#93adc0", marginTop: 4 }}>
                        Complete
                      </div>
                    </div>
                    <div>
                      <strong>Crew</strong>
                      <div
                        style={{
                          color:
                            effectiveCrew === "Not assigned"
                              ? "#d9b982"
                              : "#93adc0",
                          marginTop: 4,
                        }}
                      >
                        {effectiveCrew === "Not assigned"
                          ? "Needs assignment"
                          : effectiveCrew}
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Truth Chain">
                  <div
                    style={{
                      display: "grid",
                      gap: 12,
                      fontSize: 13,
                    }}
                  >
                    {demoUpdates.map((item, index) => (
                      <div
                        key={`demo-${index}-${item.time}`}
                        style={{
                          borderLeft: "2px solid #6f93aa",
                          paddingLeft: 12,
                        }}
                      >
                        <div
                          style={{
                            color: "#9fb9cb",
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          {item.time}
                        </div>

                        <div style={{ marginTop: 3, color: "#f0f4f7" }}>
                          {item.event}
                        </div>
                      </div>
                    ))}

                    {[
                      ["Aug 25 - 8:32 AM", "Gio added customer expectation note."],
                      ["Aug 25 - 10:14 AM", "Customer approved revised scope."],
                      ["Aug 26 - 9:03 AM", "RJ completed Window 04 measurement."],
                      ["Aug 28 - 2:41 PM", "Office uploaded manufacturer PO."],
                      ["Sept 2 - 11:17 AM", "Material ETA changed to Sept 14."],
                    ].map(([time, event]) => (
                      <div
                        key={time}
                        style={{
                          borderLeft: "2px solid #476779",
                          paddingLeft: 12,
                        }}
                      >
                        <div
                          style={{
                            color: "#87a5b9",
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          {time}
                        </div>
                        <div style={{ marginTop: 3, color: "#d4dade" }}>
                          {event}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection title="Money">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: 10,
                    }}
                  >
{[
                      ["Contract", "$28,500"],
                      ["50% Deposit", "$14,250 Paid"],
                      ["40% Delivery", "$11,400 Due"],
                      ["Final 10%", "$2,850"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        style={{
                          border: "1px solid #29323a",
                          borderRadius: 12,
                          padding: 12,
                        }}
                      >
                        <div
                          style={{
                            color: "#969fa6",
                            fontSize: 11,
                            marginBottom: 5,
                          }}
                        >
                          {label}
                        </div>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .premier-layout {
            grid-template-columns: 1fr !important;
          }

          .premier-summary-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .premier-action-grid {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }

        @media (max-width: 520px) {
          .premier-summary-grid {
            grid-template-columns: 1fr !important;
          }

          .premier-action-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}



