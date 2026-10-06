import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type FieldJob = {
  id: string;
  customer: string;
  address: string;
  crew: string;
  phase: string;
  materialEta: string;
  permit: string;
  scheduled: string;
  nextAction: string;
  customerTruth: string;
  measurements: { name: string; location: string; measurement: string }[];
  manufacturerPo: string;
  requiredPhotos: string[];
  permitProof: string[];
  approvedScope: string;
  promisedIncluded: string[];
  notIncluded: string[];
  approvedChanges: string[];
  signedAgreement: string;
  lastConfirmed: string;
  workType?: "Project" | "Service Call";
  serviceIssue?: string;
  serviceAppointment?: string;
  status:
    | "Today"
    | "Ready to Schedule"
    | "Waiting on Material"
    | "In Progress"
    | "Problems"
    | "Upcoming"
    | "Service Calls";
};

const jobs: FieldJob[] = [
  {
    id: "PW-1048",
    customer: "Michael & Sarah Carter",
    address: "1842 Palm Ridge Dr, Wellington",
    crew: "Crew 2",
    phase: "Scheduled",
    materialEta: "Sept 14",
    permit: "Approved",
    scheduled: "Aug 28",
    nextAction: "Confirm material arrival",
    customerTruth:
      "Rear French door may require additional stucco work depending on opening condition. Preserve existing blinds. Customer prefers arrival before 9 AM.",
    measurements: [
      { name: "Window 01", location: "Master Bedroom", measurement: '36 1/4" x 62 1/2"' },
      { name: "Window 02", location: "Living Room", measurement: '48" x 60"' },
      { name: "Door 01", location: "Rear French Door", measurement: '72" x 80"' },
    ],
    manufacturerPo: "ES Windows PO 48592",
    requiredPhotos: [
      "Before condition",
      "Fasteners / screws",
      "Concrete / block opening",
      "Stucco condition",
      "Product label",
      "Installed unit",
      "Exterior overview",
    ],
    permitProof: [
      "Fastener pattern",
      "Opening condition",
      "Product label",
      "Installed unit",
      "Exterior overview",
    ],
    approvedScope: "8 impact windows + rear French door",
    promisedIncluded: [
      "Remove and dispose of existing units",
      "White frames",
      "Preserve existing blinds where possible",
    ],
    notIncluded: [
      "Interior painting",
      "Hidden structural repair unless approved",
    ],
    approvedChanges: [
      "Possible additional stucco work if opening condition requires it",
    ],
    signedAgreement: "Proposal PW-1048",
    lastConfirmed: "Customer scope confirmed before scheduling",
    status: "Upcoming",
  },
  {
    id: "PW-1037",
    customer: "Robert Ellis",
    address: "Palm Beach Gardens",
    crew: "Crew 2",
    phase: "Inspection",
    materialEta: "Received",
    permit: "In-progress inspection",
    scheduled: "Today",
    nextAction: "Upload inspection photos",
    customerTruth:
      "Replace 4 windows and front entry door. Customer requested protection around interior flooring and wants all removed materials hauled away.",
    measurements: [
      { name: "Window 01", location: "Front Bedroom", measurement: '35 3/4" x 61"' },
      { name: "Window 02", location: "Rear Bedroom", measurement: '36" x 60 1/2"' },
      { name: "Door 01", location: "Front Entry", measurement: '36" x 80"' },
    ],
    manufacturerPo: "ES Windows PO 48177",
    requiredPhotos: [
      "Fasteners / screws",
      "Installed window",
      "Installed entry door",
      "Product labels",
      "Exterior overview",
    ],
    permitProof: [
      "Fastener photos still required",
      "Product label photos still required",
      "Exterior installation overview required",
    ],
    approvedScope: "4 windows + front entry door",
    promisedIncluded: [
      "Protect interior flooring",
      "Remove and haul away old materials",
      "Standard installation cleanup",
    ],
    notIncluded: [
      "Interior painting",
      "Repairs outside approved installation scope",
    ],
    approvedChanges: [],
    signedAgreement: "Proposal PW-1037",
    lastConfirmed: "Installation expectations confirmed before crew arrival",
    status: "Today",
  },
  {
    id: "PW-1042",
    customer: "Harbor Point Builders",
    address: "Jupiter Island - New Construction",
    crew: "Not assigned",
    phase: "Waiting",
    materialEta: "Oct 3",
    permit: "Builder handling permit",
    scheduled: "Pending material",
    nextAction: "Monitor manufacturer ETA",
    customerTruth:
      "New-construction package for builder. Installation must follow approved plans and builder sequencing. Coordinate access with superintendent before mobilizing crew.",
    measurements: [
      { name: "Opening A1", location: "First Floor", measurement: '72" x 60"' },
      { name: "Opening A2", location: "First Floor", measurement: '48" x 72"' },
      { name: "Door D1", location: "Rear Elevation", measurement: '72" x 96"' },
    ],
    manufacturerPo: "ES Windows PO 48904",
    requiredPhotos: [
      "Opening condition",
      "Delivered material",
      "Product labels",
      "Fasteners",
      "Completed elevations",
    ],
    permitProof: [
      "Builder controls permit",
      "Installation proof still required for company records",
    ],
    approvedScope: "Commercial window + door package per approved plans",
    promisedIncluded: [
      "Install according to approved builder plans",
      "Coordinate access with superintendent",
      "Provide company installation proof",
    ],
    notIncluded: [
      "Builder-controlled permit administration",
      "Work outside approved plan set",
    ],
    approvedChanges: [],
    signedAgreement: "Builder Proposal PW-1042",
    lastConfirmed: "Builder sequencing and access requirements confirmed",
    status: "Waiting on Material",
  },
  {
    id: "PW-1051",
    customer: "Angela Morris",
    address: "West Palm Beach",
    crew: "Crew 1",
    phase: "Installation",
    materialEta: "Received",
    permit: "Approved",
    scheduled: "Today",
    nextAction: "Check crew progress",
    customerTruth:
      "Impact-window installation in progress. Customer approved removal and disposal. Protect kitchen counters and keep rear entry accessible during work.",
    measurements: [
      { name: "Window 01", location: "Kitchen", measurement: '47 1/2" x 59 3/4"' },
      { name: "Window 02", location: "Living Room", measurement: '60" x 60"' },
    ],
    manufacturerPo: "ES Windows PO 48761",
    requiredPhotos: [
      "Before condition",
      "Fasteners",
      "Installed units",
      "Stucco condition",
      "After photos",
    ],
    permitProof: [
      "Fastener photos",
      "Installed-unit photos",
      "Exterior overview",
    ],
    approvedScope: "Impact window installation",
    promisedIncluded: [
      "Removal and disposal",
      "Protect kitchen counters",
      "Keep rear entry accessible during work",
    ],
    notIncluded: [
      "Interior painting",
      "Unapproved structural repairs",
    ],
    approvedChanges: [],
    signedAgreement: "Proposal PW-1051",
    lastConfirmed: "Customer access expectations confirmed before installation",
    status: "In Progress",
  },
  {
    id: "SV-021",
    customer: "Linda Ramirez",
    address: "Royal Palm Beach",
    crew: "Gio",
    phase: "Service Call",
    materialEta: "Not needed yet",
    permit: "Not required",
    scheduled: "Today - 3:30 PM",
    nextAction: "Diagnose leaking sliding door",
    customerTruth:
      "Customer reports water entering near the bottom track during heavy rain. Original installation was completed by Premier. Customer asked that Gio call before arrival.",
    measurements: [
      {
        name: "Door 01",
        location: "Rear Patio Slider",
        measurement: '72" x 80"',
      },
    ],
    manufacturerPo: "Original job record PW-0986",
    requiredPhotos: [
      "Existing condition",
      "Track / sill",
      "Exterior seal",
      "Drainage / weep area",
      "Completed repair",
    ],
    permitProof: [],
    approvedScope: "Diagnose rear sliding-door water intrusion",
    promisedIncluded: [
      "Inspect door, track, seal and drainage",
      "Document findings",
      "Complete minor adjustment or sealing if appropriate",
    ],
    notIncluded: [
      "Major structural repair without approval",
      "Replacement product unless separately approved",
    ],
    approvedChanges: [],
    signedAgreement: "Service appointment SV-021",
    lastConfirmed: "Customer confirmed service visit for today",
    workType: "Service Call",
    serviceIssue:
      "Water entering near bottom track of rear sliding door during heavy rain.",
    serviceAppointment: "Today - 3:30 PM",
    status: "Service Calls",
  },
];

const lanes = [
  "Today",
  "Ready to Schedule",
  "Waiting on Material",
  "In Progress",
  "Problems",
  "Punch-Out / Needs Attention",
  "Service Calls",
  "Upcoming",
] as const;

function FieldBeamComposer({ job }: { job: any }) {
  const [recipient, setRecipient] = useState<string>("Angel");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  const startVoiceInput = () => {
    if (listening) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech-to-text is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || "";
      if (!transcript) return;

      setBody((current) =>
        current.trim() ? `${current.trim()} ${transcript}` : transcript
      );
    };

    recognition.onerror = () => {
      setError("Could not capture voice message.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const sendBeam = async () => {
    if (sending) return;

    const message = body.trim();
    if (!message || !job?.id) return;

    const accessToken =
      getPremierFieldAccessToken();

    if (!accessToken) {
      setError("Premier staff access token missing.");
      return;
    }

    setSending(true);
    setError("");

    const { error: sendError } = await supabase.rpc(
      "send_premier_beam_message",
      {
        p_access_token: accessToken,
        p_job_id: job.id,
        p_sender_role: "Field Ops",
        p_recipient_role: recipient,
        p_body: message,
      }
    );

    if (sendError) {
      console.error("Field Ops Beam send failed:", sendError);
      setError(sendError.message || "Could not send Beam message.");
      setSending(false);
      return;
    }

    setBody("");
    setSending(false);
  };

  return (
    <div
      style={{
        border: "1px solid #78aa88",
        borderRadius: 12,
        background: "linear-gradient(135deg, #173225 0%, #101b16 100%)",
        padding: 10,
        marginBottom: 10,
        boxShadow:
          "0 0 0 1px rgba(139,184,154,0.08), 0 8px 24px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          color: "#9fd3ae",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 3,
        }}
      >
        Beam Quick Message
      </div>

      <div
        style={{
          color: "#d9e5ee",
          fontSize: 10,
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        Fast job communication
      </div>

      <select
        value={recipient}
        onChange={(event) => setRecipient(event.target.value)}
        style={{
          width: "100%",
          minHeight: 38,
          border: "1px solid #477057",
          borderRadius: 9,
          background: "#0d1711",
          color: "#e5eee8",
          padding: "0 9px",
          fontSize: 11,
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        <option value="Darcy">Darcy</option>
        <option value="Karolina">Karolina</option>
        <option value="Gio Richardson">Gio Richardson</option>
        <option value="Gino Marquez">Gino Marquez</option>
        <option value="Dennis Dillon">Dennis Dillon</option>
        <option value="RJ">RJ</option>
        <option value="Angel">Angel</option>
        <option value="Jose">Jose</option>
        <option value="Obelio">Obelio</option>
        <option value="Joseph">Joseph</option>
      </select>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 46px",
          gap: 8,
        }}
      >
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={
            listening
              ? "Listening..."
              : "Type or tap the mic and talk..."
          }
          rows={2}
          style={{
            width: "100%",
            minHeight: 52,
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
          onClick={startVoiceInput}
          disabled={listening}
          title={listening ? "Listening..." : "Talk message"}
          style={{
            border: listening
              ? "1px solid #d98778"
              : "1px solid #8fbea0",
            borderRadius: 9,
            background: listening ? "#7a2d24" : "#2f6842",
            color: "#ffffff",
            fontSize: 20,
            cursor: listening ? "wait" : "pointer",
            boxShadow: listening
              ? "0 0 0 2px rgba(217,135,120,0.18), 0 0 18px rgba(217,135,120,0.22)"
              : "none",
          }}
        >
          Mic
        </button>
      </div>

      {error ? (
        <div
          style={{
            color: "#d8b267",
            fontSize: 10,
            marginTop: 7,
          }}
        >
          {error}
        </div>
      ) : null}

      <button
        type="button"
        disabled={sending || !body.trim()}
        onClick={() => void sendBeam()}
        style={{
          width: "100%",
          minHeight: 38,
          marginTop: 8,
          border: "1px solid #8fbea0",
          borderRadius: 9,
          background: "#2f6842",
          color: "#ffffff",
          fontWeight: 900,
          cursor: sending || !body.trim() ? "not-allowed" : "pointer",
          opacity: sending || !body.trim() ? 0.55 : 1,
        }}
      >
        {sending ? "Sending..." : `Send to ${recipient}`}
      </button>
    </div>
  );
}

function getPremierFieldAccessToken() {
  try {
    const stored = window.sessionStorage.getItem("premier_staff_session");
    const session = stored ? JSON.parse(stored) : null;

    if (
      session?.expiresAt &&
      Date.now() >= new Date(session.expiresAt).getTime()
    ) {
      window.sessionStorage.removeItem("premier_staff_session");
      window.location.replace("/planet/premier-window-door/staff");
      return null;
    }

    const queryToken =
      new URLSearchParams(window.location.search).get("access");

    if (queryToken && session?.accessToken === queryToken) {
      return queryToken;
    }

    if (session?.accessToken) {
      return session.accessToken;
    }

    if (queryToken) {
      return queryToken;
    }

    return null;
  } catch (error) {
    console.error("Premier field session read failed:", error);
    return null;
  }
}
export default function PremierFieldOperationsBoard() {
  const [activeJobId, setActiveJobId] = useState("PW-1037");
  const [selectedFieldJobId, setSelectedFieldJobId] = useState<string | null>(null);
  const [staffGreeting, setStaffGreeting] = useState<{ headline: string; detail: string } | null>(null);
  const [fieldBeamMessages, setFieldBeamMessages] = useState<any[]>([]);
  const [fieldBeamLoading, setFieldBeamLoading] = useState(false);
  const [fieldBeamError, setFieldBeamError] = useState("");
  const [fieldBeamReplyOpenId, setFieldBeamReplyOpenId] = useState<string | null>(null);
  const [fieldBeamReplyBody, setFieldBeamReplyBody] = useState("");
  const [fieldBeamReplySending, setFieldBeamReplySending] = useState(false);
  const [fieldBeamReplyListening, setFieldBeamReplyListening] = useState(false);
  const [fieldBeamReplyError, setFieldBeamReplyError] = useState("");
  const [crewChanges, setCrewChanges] = useState<Record<string, string>>({});
  const [scheduleChanges, setScheduleChanges] = useState<Record<string, string>>({});
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false);
  const [scheduleDraftDate, setScheduleDraftDate] = useState("");
  const [scheduleDraftTime, setScheduleDraftTime] = useState("");
  const [updates, setUpdates] = useState<
    { jobId: string; time: string; text: string }[]
  >([]);

  const [liveFinalMeasurements, setLiveFinalMeasurements] = useState<any[]>([]);
  const [liveFinalMeasurementsLoading, setLiveFinalMeasurementsLoading] =
    useState(false);

  const [activeFinalMeasureJobId, setActiveFinalMeasureJobId] =
    useState<string | null>(null);
  const [finalMeasureOpenings, setFinalMeasureOpenings] = useState<any[]>([]);
  const [finalMeasureOpeningsLoading, setFinalMeasureOpeningsLoading] =
    useState(false);
  const [finalOpeningType, setFinalOpeningType] = useState("Window");
  const [finalOpeningLocation, setFinalOpeningLocation] = useState("");
  const [finalOpeningWidth, setFinalOpeningWidth] = useState("");
  const [finalOpeningHeight, setFinalOpeningHeight] = useState("");
  const [finalOpeningNotes, setFinalOpeningNotes] = useState("");
  const [savingFinalOpening, setSavingFinalOpening] = useState(false);

  const [liveInstallations, setLiveInstallations] = useState<any[]>([]);
  const [liveInstallationsLoading, setLiveInstallationsLoading] =
    useState(false);
  const [crewDrafts, setCrewDrafts] = useState<Record<string, string>>({});
  const [crewSavingJobId, setCrewSavingJobId] = useState<string | null>(null);
  const [crewSaveErrors, setCrewSaveErrors] = useState<Record<string, string>>({});

  const [fieldJobDocuments, setFieldJobDocuments] =
    useState<Record<string, any[]>>({});
  const [fieldJobDocumentsLoading, setFieldJobDocumentsLoading] =
    useState<Record<string, boolean>>({});
  const [fieldJobDocumentsErrors, setFieldJobDocumentsErrors] =
    useState<Record<string, string>>({});
  const [fieldJobFileOpenId, setFieldJobFileOpenId] =
    useState<string | null>(null);

  const [liveInspections, setLiveInspections] = useState<any[]>([]);
  const [liveInspectionsLoading, setLiveInspectionsLoading] =
    useState(false);

  const [inspectionPunchItems, setInspectionPunchItems] =
    useState<Record<string, any[]>>({});
  const [inspectionPunchDrafts, setInspectionPunchDrafts] =
    useState<Record<string, string>>({});
  const [inspectionPunchSaving, setInspectionPunchSaving] =
    useState<Record<string, boolean>>({});
  const [inspectionPunchErrors, setInspectionPunchErrors] =
    useState<Record<string, string>>({});

  const [punchOuts, setPunchOuts] = useState<
    {
      id: string;
      jobId: string;
      opening: string;
      type: string;
      issue: string;
      reportedBy: string;
      reportedAt: string;
      owner: string | null;
      status: "Reported" | "Owned" | "Resolved";
    }[]
  >([
    {
      id: "PO-1048-1",
      jobId: "PW-1048",
      opening: "General / Unknown",
      type: "Damage / Scratch",
      issue: "Remove scratches before final walkthrough.",
      reportedBy: "Installer",
      reportedAt: "Aug 26 - 5:16 PM",
      owner: null,
      status: "Reported",
    },
  ]);

  const [quickAccess, setQuickAccess] = useState<
    | "Customer Notes"
    | "Measurements"
    | "Manufacturer PO"
    | "Required Photos"
    | "Permit Proof"
    | null
  >(null);

  const loadFieldJobDocuments = async (jobId: string) => {
    const accessToken =
      getPremierFieldAccessToken();

    if (!accessToken) {
      setFieldJobDocuments((current) => ({ ...current, [jobId]: [] }));
      setFieldJobDocumentsErrors((current) => ({
        ...current,
        [jobId]: "Premier staff access is missing.",
      }));
      return;
    }

    setFieldJobDocumentsLoading((current) => ({
      ...current,
      [jobId]: true,
    }));
    setFieldJobDocumentsErrors((current) => ({
      ...current,
      [jobId]: "",
    }));

    try {
      const { data, error } = await supabase.functions.invoke(
        "premier-job-document",
        {
          body: {
            action: "list",
            accessToken,
            jobId,
          },
        }
      );

      if (error || data?.error) {
        throw new Error(
          data?.error || error?.message || "Could not load job documents."
        );
      }

      setFieldJobDocuments((current) => ({
        ...current,
        [jobId]: data?.documents ?? [],
      }));
    } catch (error) {
      console.error("Premier Field Ops job document list failed:", error);

      setFieldJobDocuments((current) => ({ ...current, [jobId]: [] }));
      setFieldJobDocumentsErrors((current) => ({
        ...current,
        [jobId]:
          error instanceof Error
            ? error.message
            : "Could not load job documents.",
      }));
    } finally {
      setFieldJobDocumentsLoading((current) => ({
        ...current,
        [jobId]: false,
      }));
    }
  };

  const loadFinalMeasureOpenings = async (jobId: string) => {
    const accessToken = getPremierFieldAccessToken();

    if (!accessToken) {
      window.alert("Premier field access is missing.");
      return;
    }

    setFinalMeasureOpeningsLoading(true);

    const { data, error } = await supabase.rpc(
      "get_premier_final_measurement_openings",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
      }
    );

    if (error) {
      console.error("Premier final measurement openings failed:", error);
      window.alert("Could not load final measurements.");
      setFinalMeasureOpenings([]);
    } else {
      setFinalMeasureOpenings(data ?? []);
    }

    setFinalMeasureOpeningsLoading(false);
  };

  const saveFinalMeasureOpening = async (jobId: string) => {
    if (
      !finalOpeningType ||
      !finalOpeningLocation.trim() ||
      !finalOpeningWidth.trim() ||
      !finalOpeningHeight.trim()
    ) {
      window.alert("Enter type, location, width, and height.");
      return;
    }

    const accessToken = getPremierFieldAccessToken();

    if (!accessToken) {
      window.alert("Premier field access is missing.");
      return;
    }

    const nextOpeningNumber =
      finalMeasureOpenings.reduce(
        (highest, opening) =>
          Math.max(highest, Number(opening.opening_number) || 0),
        0
      ) + 1;

    setSavingFinalOpening(true);

    const { error } = await supabase.rpc(
      "save_premier_final_measurement_opening",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
        p_opening_id: null,
        p_opening_number: nextOpeningNumber,
        p_opening_type: finalOpeningType,
        p_location: finalOpeningLocation.trim(),
        p_width_text: finalOpeningWidth.trim(),
        p_height_text: finalOpeningHeight.trim(),
        p_notes: finalOpeningNotes.trim(),
      }
    );

    if (error) {
      console.error("Premier final measurement opening save failed:", error);
      window.alert("Could not save this final measurement opening.");
      setSavingFinalOpening(false);
      return;
    }

    setFinalOpeningWidth("");
    setFinalOpeningHeight("");
    setFinalOpeningNotes("");

    await loadFinalMeasureOpenings(jobId);
    setSavingFinalOpening(false);
  };

  useEffect(() => {
    let active = true;

    const loadFinalMeasurements = async () => {
      const accessToken =
        getPremierFieldAccessToken();

      if (!accessToken) {
        if (active) {
          setLiveFinalMeasurements([]);
          setLiveFinalMeasurementsLoading(false);
        }
        return;
      }

      setLiveFinalMeasurementsLoading(true);

      const { data, error } = await supabase.rpc(
        "get_premier_final_measurement_assignments",
        {
          p_access_token: accessToken,
          p_destination: "field",
        }
      );

      if (!active) return;

      if (error) {
        console.error(
          "Premier field final measurement assignments failed:",
          error
        );
        setLiveFinalMeasurements([]);
      } else {
        setLiveFinalMeasurements(data ?? []);
      }

      setLiveFinalMeasurementsLoading(false);
    };

    void loadFinalMeasurements();

    const selectedFieldJob =
    liveFinalMeasurements.find((job) => job.id === selectedFieldJobId) ??
    liveInstallations.find((job) => job.id === selectedFieldJobId) ??
    liveInspections.find((job) => job.id === selectedFieldJobId) ??
    null;

  const selectedFieldStage =
    liveFinalMeasurements.some((job) => job.id === selectedFieldJobId)
      ? "Final Measurement"
      : liveInstallations.some((job) => job.id === selectedFieldJobId)
        ? liveInstallations.find((job) => job.id === selectedFieldJobId)?.current_stage ===
          "installation_complete"
          ? "Installation Complete"
          : "Scheduled Installation"
        : liveInspections.some((job) => job.id === selectedFieldJobId)
          ? "Inspection"
          : "";
  return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadInstallations = async () => {
      const accessToken =
        getPremierFieldAccessToken();

      if (!accessToken) {
        if (active) {
          setLiveInstallations([]);
          setLiveInstallationsLoading(false);
        }
        return;
      }

      setLiveInstallationsLoading(true);

      const { data, error } = await supabase.rpc(
        "get_premier_field_installations",
        {
          p_access_token: accessToken,
        }
      );

      if (!active) return;

      if (error) {
        console.error("Premier field installations failed:", error);
        setLiveInstallations([]);
      } else {
        setLiveInstallations(data ?? []);
      }

      setLiveInstallationsLoading(false);
    };

    void loadInstallations();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadInspections = async () => {
      const accessToken =
        getPremierFieldAccessToken();

      if (!accessToken) {
        if (active) {
          setLiveInspections([]);
          setLiveInspectionsLoading(false);
        }
        return;
      }

      setLiveInspectionsLoading(true);

      const { data, error } = await supabase.rpc(
        "get_premier_field_inspections",
        {
          p_access_token: accessToken,
        }
      );

      if (!active) return;

      if (error) {
        console.error("Premier field inspections failed:", error);
        setLiveInspections([]);
      } else {
        setLiveInspections(data ?? []);
      }

      setLiveInspectionsLoading(false);
    };

    void loadInspections();

    return () => {
      active = false;
    };
  }, []);

  const loadInspectionPunchItems = async (jobId: string) => {
    const accessToken = getPremierFieldAccessToken();

    if (!accessToken) return;

    setInspectionPunchErrors((current) => ({
      ...current,
      [jobId]: "",
    }));

    const { data, error } = await supabase.rpc(
      "get_premier_punch_items",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
      }
    );

    if (error) {
      console.error("Premier punch items failed:", error);
      setInspectionPunchErrors((current) => ({
        ...current,
        [jobId]: "Could not load finish items.",
      }));
      return;
    }

    setInspectionPunchItems((current) => ({
      ...current,
      [jobId]: data ?? [],
    }));
  };

  const saveInspectionPunchItem = async (job: any) => {
    const issue = (inspectionPunchDrafts[job.id] || "").trim();

    if (!issue) {
      setInspectionPunchErrors((current) => ({
        ...current,
        [job.id]: "Enter what needs attention.",
      }));
      return;
    }

    const accessToken = getPremierFieldAccessToken();

    if (!accessToken) return;

    setInspectionPunchSaving((current) => ({
      ...current,
      [job.id]: true,
    }));

    setInspectionPunchErrors((current) => ({
      ...current,
      [job.id]: "",
    }));

    const { data, error } = await supabase.rpc(
      "create_premier_punch_item",
      {
        p_access_token: accessToken,
        p_job_id: job.id,
        p_opening: "General / Unknown",
        p_item_type: "Final Inspection",
        p_issue: issue,
        p_owner: null,
      }
    );

    if (error || !data) {
      console.error("Create Premier punch item failed:", error);
      setInspectionPunchErrors((current) => ({
        ...current,
        [job.id]: "Could not save finish item.",
      }));
      setInspectionPunchSaving((current) => ({
        ...current,
        [job.id]: false,
      }));
      return;
    }

    setInspectionPunchDrafts((current) => ({
      ...current,
      [job.id]: "",
    }));

    await loadInspectionPunchItems(job.id);

    setInspectionPunchSaving((current) => ({
      ...current,
      [job.id]: false,
    }));
  };

  const activeJob = useMemo(
    () => jobs.find((job) => job.id === activeJobId) ?? jobs[0],
    [activeJobId]
  );

  const effectiveCrew = crewChanges[activeJob.id] ?? activeJob.crew;
  const effectiveSchedule = scheduleChanges[activeJob.id] ?? activeJob.scheduled;

  const activePunchOuts = punchOuts.filter(
    (item) => item.jobId === activeJob.id && item.status !== "Resolved"
  );

  const hasOpenPunchOut = activePunchOuts.length > 0;

  const addUpdate = (text: string) => {
    setUpdates((current) => [
      {
        jobId: activeJob.id,
        time: new Date().toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        text,
      },
      ...current,
    ]);
  };

  useEffect(() => {
    try {
      const rawSession = window.sessionStorage.getItem("premier_staff_session");
      if (!rawSession) return;

      const session = JSON.parse(rawSession);
      const displayName = String(session?.displayName || "").trim();
      if (!displayName) return;

      const firstName = displayName.split(" ")[0];
      const hour = new Date().getHours();
      const period =
        hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

      setStaffGreeting({
        headline: `Good ${period}, ${firstName}.`,
        detail: "Here's what still needs your attention today.",
      });
    } catch (error) {
      console.error("Premier staff greeting failed:", error);
    }
  }, []);

  const loadFieldBeamInbox = async () => {
    const accessToken =
      getPremierFieldAccessToken();

    if (!accessToken) {
      setFieldBeamMessages([]);
      return;
    }

    setFieldBeamLoading(true);
    setFieldBeamError("");

    const { data, error } = await supabase.rpc(
      "get_premier_beam_inbox",
      {
        p_access_token: accessToken,
      }
    );

    if (error) {
      console.error("Premier Field Ops Beam inbox failed:", error);
      setFieldBeamMessages([]);
      setFieldBeamError("Could not load Beam.");
    } else {
      setFieldBeamMessages(data ?? []);
    }

    setFieldBeamLoading(false);
  };

  const markFieldBeamRead = async (messageId: string) => {
    const accessToken =
      getPremierFieldAccessToken();

    if (!accessToken) return;

    const { data, error } = await supabase.rpc(
      "mark_my_premier_beam_read",
      {
        p_access_token: accessToken,
        p_message_id: messageId,
      }
    );

    if (error || data !== true) {
      console.error("Field Ops Beam mark read failed:", error);
      return;
    }

    setFieldBeamMessages((current) =>
      current.filter((message) => message.id !== messageId)
    );
  };

  const startFieldBeamReplyVoiceInput = () => {
    if (fieldBeamReplyListening) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFieldBeamReplyError(
        "Speech-to-text is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setFieldBeamReplyListening(true);
      setFieldBeamReplyError("");
    };

    recognition.onresult = (event: any) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim() || "";

      if (!transcript) return;

      setFieldBeamReplyBody((current) =>
        current.trim()
          ? `${current.trim()} ${transcript}`
          : transcript
      );
    };

    recognition.onerror = (event: any) => {
      console.error("Field Ops Beam speech recognition failed:", event);
      setFieldBeamReplyError("Could not capture voice message.");
    };

    recognition.onend = () => {
      setFieldBeamReplyListening(false);
    };

    recognition.start();
  };

  const sendFieldBeamReply = async (message: any) => {
    if (fieldBeamReplySending) return;

    const body = fieldBeamReplyBody.trim();
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
      setFieldBeamReplyError(
        "This Beam does not contain a replyable staff identity."
      );
      return;
    }

    const accessToken =
      getPremierFieldAccessToken();

    if (!accessToken) {
      setFieldBeamReplyError("Premier staff access token missing.");
      return;
    }

    setFieldBeamReplySending(true);
    setFieldBeamReplyError("");

    const { error } = await supabase.rpc(
      "send_premier_beam_message",
      {
        p_access_token: accessToken,
        p_job_id: message.job_id,
        p_sender_role: "Field Ops",
        p_recipient_role: recipient,
        p_body: body,
      }
    );

    if (error) {
      console.error("Field Ops Beam reply failed:", error);
      setFieldBeamReplyError(
        error.message || "Could not send Beam reply."
      );
      setFieldBeamReplySending(false);
      return;
    }

    setFieldBeamReplyBody("");
    setFieldBeamReplyOpenId(null);
    setFieldBeamReplySending(false);
  };

  useEffect(() => {
    void loadFieldBeamInbox();
  }, []);

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
          maxWidth: 980,
          margin: "0 auto",
          padding: "20px 14px 56px",
        }}
      >
        <header style={{ marginBottom: 16 }}>
          <div
            style={{
              color: "#9db7ca",
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              marginBottom: 7,
            }}
          >
            Premier Window & Door
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(26px, 4vw, 38px)",
              lineHeight: 1,
            }}
          >
            Field Operations
          </h1>

          {staffGreeting ? (
            <div
              style={{
                marginTop: 14,
                borderLeft: "3px solid #9db7ca",
                padding: "9px 12px",
                background: "rgba(157, 183, 202, 0.06)",
                borderRadius: "0 10px 10px 0",
                maxWidth: 760,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900 }}>
                {staffGreeting.headline}
              </div>
              <div
                style={{
                  marginTop: 3,
                  color: "#c0c7cd",
                  fontSize: 14,
                }}
              >
                {staffGreeting.detail}
              </div>
            </div>
          ) : null}

          <p
            style={{
              color: "#a8b0b7",
              margin: "10px 0 0",
              maxWidth: 760,
              fontSize: 14,
            }}
          >
            What is ready, where the crews are, what is delayed, and what needs to happen next.
          </p>
        </header>

        <section
          style={{
            marginBottom: 12,
          }}
        >
          <div
            style={{
              color: "#9db7ca",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 7,
            }}
          >
            Field Status
          </div>

          <div
            className="field-status-strip"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            <div
              style={{
                border: "1px solid #4c4330",
                borderRadius: 11,
                background: "#121518",
                padding: "9px 11px",
              }}
            >
              <div
                style={{
                  color: "#d4b569",
                  fontSize: 9,
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Final Measurements
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  marginTop: 3,
                }}
              >
                {liveFinalMeasurements.length}
              </div>
            </div>

            <div
              style={{
                border: "1px solid #345140",
                borderRadius: 11,
                background: "#101713",
                padding: "9px 11px",
              }}
            >
              <div
                style={{
                  color: "#8fc59f",
                  fontSize: 9,
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Scheduled Installs
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  marginTop: 3,
                }}
              >
                {liveInstallations.filter((job) => job.current_stage === "scheduled").length}
              </div>
            </div>

            <div
              style={{
                border: "1px solid #4b4652",
                borderRadius: 11,
                background: "#151318",
                padding: "9px 11px",
              }}
            >
              <div
                style={{
                  color: "#b6a9c4",
                  fontSize: 9,
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Scheduled Inspections
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  marginTop: 3,
                }}
              >
                {liveInspections.length}
              </div>
            </div>
          </div>
        </section>
        {fieldBeamMessages.some((message) => !message.read_at) ? (
          <section
            style={{
              border: "1px solid #78aa88",
              borderRadius: 16,
              background:
                "linear-gradient(135deg, #173225 0%, #101b16 100%)",
              padding: 12,
              marginBottom: 14,
              boxShadow:
                "0 0 0 1px rgba(139,184,154,0.08), 0 8px 24px rgba(0,0,0,0.18)",
            }}
          >
            {(() => {
              const message =
                fieldBeamMessages.find((item) => !item.read_at) ?? null;

              if (!message) return null;

              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#9fd3ae",
                          fontSize: 10,
                          fontWeight: 900,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        Beam {"\u2022"} New Message
                      </div>

                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: 14,
                          fontWeight: 900,
                          marginTop: 4,
                        }}
                      >
                        {message.first_name} {message.last_name}
                      </div>

                      <div
                        style={{
                          color: "#91a59a",
                          fontSize: 10,
                          marginTop: 2,
                        }}
                      >
                        {message.project_address}
                      </div>
                    </div>

                    <div
                      style={{
                        color: "#9fd3ae",
                        fontSize: 10,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                      }}
                    >
                      For you
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#8fb49b",
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    From {message.sender_label}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      border: "1px solid #294a36",
                      borderRadius: 10,
                      background: "#0d1711",
                      padding: 10,
                      color: "#e5eee8",
                      fontSize: 12,
                      lineHeight: 1.45,
                    }}
                  >
                    {message.body}
                  </div>

                  {fieldBeamReplyOpenId === message.id ? (
                    <div
                      style={{
                        marginTop: 10,
                        border: "1px solid #31533c",
                        borderRadius: 10,
                        background: "#101a13",
                        padding: 10,
                      }}
                    >
                      <div
                        style={{
                          color: "#9fd3ae",
                          fontSize: 9,
                          fontWeight: 900,
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                          marginBottom: 7,
                        }}
                      >
                        Reply to {message.sender_label}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1fr) 46px",
                          gap: 8,
                        }}
                      >
                        <textarea
                          value={fieldBeamReplyBody}
                          onChange={(event) =>
                            setFieldBeamReplyBody(event.target.value)
                          }
                          placeholder={
                            fieldBeamReplyListening
                              ? "Listening..."
                              : "Type or tap the mic and talk..."
                          }
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
                          onClick={startFieldBeamReplyVoiceInput}
                          disabled={fieldBeamReplyListening}
                          title={
                            fieldBeamReplyListening
                              ? "Listening..."
                              : "Talk message"
                          }
                          aria-label={
                            fieldBeamReplyListening
                              ? "Listening..."
                              : "Talk message"
                          }
                          style={{
                            minHeight: 54,
                            border: fieldBeamReplyListening
                              ? "1px solid #d98778"
                              : "1px solid #8fbea0",
                            borderRadius: 9,
                            background: fieldBeamReplyListening
                              ? "#7a2d24"
                              : "#2f6842",
                            color: "#ffffff",
                            fontSize: 20,
                            cursor: fieldBeamReplyListening
                              ? "wait"
                              : "pointer",
                            boxShadow: fieldBeamReplyListening
                              ? "0 0 0 2px rgba(217,135,120,0.18), 0 0 18px rgba(217,135,120,0.22)"
                              : "none",
                            transition: "all 160ms ease",
                          }}
                        >
                          Mic
                        </button>
                      </div>

                      {fieldBeamReplyError ? (
                        <div
                          style={{
                            color: "#d8b267",
                            fontSize: 10,
                            marginTop: 7,
                          }}
                        >
                          {fieldBeamReplyError}
                        </div>
                      ) : null}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          gap: 8,
                          marginTop: 8,
                        }}
                      >
                        <button
                          type="button"
                          disabled={
                            fieldBeamReplySending ||
                            !fieldBeamReplyBody.trim()
                          }
                          onClick={() => void sendFieldBeamReply(message)}
                          style={{
                            minHeight: 38,
                            border: "1px solid #8fbea0",
                            borderRadius: 9,
                            background: "#2f6842",
                            color: "#ffffff",
                            fontWeight: 900,
                            cursor:
                              fieldBeamReplySending ||
                              !fieldBeamReplyBody.trim()
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              fieldBeamReplySending ||
                              !fieldBeamReplyBody.trim()
                                ? 0.55
                                : 1,
                          }}
                        >
                          {fieldBeamReplySending
                            ? "Sending..."
                            : `Send to ${message.sender_label}`}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setFieldBeamReplyOpenId(null);
                            setFieldBeamReplyBody("");
                            setFieldBeamReplyError("");
                          }}
                          style={{
                            minHeight: 38,
                            border: "1px solid #477057",
                            borderRadius: 9,
                            background: "#102018",
                            color: "#cce8d4",
                            padding: "0 12px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      alignItems: "center",
                      marginTop: 9,
                    }}
                  >
                    <div
                      style={{
                        color: "#71887a",
                        fontSize: 9,
                      }}
                    >
                      {new Date(message.created_at).toLocaleString()}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const nextOpen =
                            fieldBeamReplyOpenId === message.id
                              ? null
                              : message.id;

                          setFieldBeamReplyOpenId(nextOpen);
                          setFieldBeamReplyBody("");
                          setFieldBeamReplyError("");
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
                          cursor: "pointer",
                        }}
                      >
                        {fieldBeamReplyOpenId === message.id
                          ? "Close Reply"
                          : "Reply"}
                      </button>

                      <button
                        type="button"
                        onClick={() => void markFieldBeamRead(message.id)}
                        style={{
                          minHeight: 34,
                          border: "1px solid #78aa88",
                          borderRadius: 9,
                          background: "#2f6842",
                          color: "#ffffff",
                          padding: "0 12px",
                          fontSize: 10,
                          fontWeight: 900,
                          cursor: "pointer",
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
        ) : fieldBeamLoading ? (
          <div
            style={{
              color: "#71887a",
              fontSize: 10,
              marginBottom: 10,
            }}
          >
            Loading Beam...
          </div>
        ) : fieldBeamError ? (
          <div
            style={{
              color: "#d8b267",
              fontSize: 10,
              marginBottom: 10,
            }}
          >
            {fieldBeamError}
          </div>
        ) : null}


        <style>{`
          .field-ops-workspace {
            display: grid;
            grid-template-columns: minmax(230px, 285px) minmax(0, 1fr);
            gap: 12px;
            align-items: start;
          }

          .field-job-rail {
            max-height: calc(100vh - 210px);
            overflow-y: auto;
            scrollbar-width: thin;
          }

          @media (max-width: 760px) {
            .field-status-strip {
              grid-template-columns: 1fr !important;
            }

            .field-ops-workspace {
              grid-template-columns: 1fr;
            }

            .field-job-rail {
              max-height: 320px;
            }
          }
        `}</style>

        <div className="field-ops-workspace">
          <aside
            style={{
              border: "1px solid #29343c",
              borderRadius: 14,
              background: "#0d1217",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "11px 12px",
                borderBottom: "1px solid #26323a",
              }}
            >
              <div
                style={{
                  color: "#9db7ca",
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {selectedFieldJobId ? "Field Job Workspace" : "Field Job"}s
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  marginTop: 2,
                }}
              >
                Active Work
              </div>
            </div>

            <div
              className="field-job-rail"
              style={{
                display: "grid",
                gap: 8,
                padding: 8,
              }}
            >
              {liveFinalMeasurements.map((job) => (
                <button
                  key={`rail-final-${job.id}`}
                  type="button"
                  onClick={() => setSelectedFieldJobId(job.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border:
                      selectedFieldJobId === job.id
                        ? "1px solid #d4b569"
                        : "1px solid #4c4330",
                    borderLeft: "4px solid #d4b569",
                    borderRadius: 10,
                    background:
                      selectedFieldJobId === job.id
                        ? "#211e16"
                        : "#121518",
                    color: "#f5f7f5",
                    padding: 17,
                    cursor: "pointer",
                    minHeight: 118,
                  }}
                >
                  <div
                    style={{
                      color: "#d4b569",
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Final Measurement
                  </div>

                  <strong style={{ fontSize: 16, lineHeight: 1.2 }}>
                    {job.first_name} {job.last_name}
                  </strong>

                  <div
                    style={{
                      color: "#87949e",
                      fontSize: 12,
                      marginTop: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {job.project_address}
                  </div>
                </button>
              ))}

              {liveInstallations.map((job) => (
                <button
                  key={`rail-install-${job.id}`}
                  type="button"
                  onClick={() => setSelectedFieldJobId(job.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border:
                      selectedFieldJobId === job.id
                        ? "1px solid #8fc59f"
                        : "1px solid #345140",
                    borderLeft: "4px solid #78aa88",
                    borderRadius: 10,
                    background:
                      selectedFieldJobId === job.id
                        ? "#17231b"
                        : "#101713",
                    color: "#f5f7f5",
                    padding: 17,
                    cursor: "pointer",
                    minHeight: 118,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        color: "#8fc59f",
                        fontSize: 10,
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      {job.current_stage === "installation_complete"
                        ? "Installation Complete"
                        : job.current_stage === "installation_ready"
                          ? "Installation Ready"
                          : "Scheduled Install"}
                    </div>

                    <span
                      style={{
                        color: "#9fd3ae",
                        fontSize: 10,
                        fontWeight: 900,
                      }}
                    >
                      {job.current_stage === "installation_complete"
                        ? "INSPECTION PREP"
                        : job.current_stage === "installation_ready"
                          ? "WITH INSTALLER"
                          : "SCHEDULED"}
                    </span>
                  </div>

                  <strong
                    style={{
                      display: "block",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {job.first_name} {job.last_name}
                  </strong>

                  <div
                    style={{
                      color: "#87949e",
                      fontSize: 12,
                      marginTop: 4,
                      lineHeight: 1.35,
                    }}
                  >
                    {job.project_address}
                  </div>

                  <div
                    style={{
                      color: "#aeb9c1",
                      fontSize: 10,
                      marginTop: 6,
                      lineHeight: 1.4,
                    }}
                  >
                    <div>{job.crew || "Crew not assigned"}</div>

                    <div>
                      {job.scheduled_for
                        ? new Date(job.scheduled_for).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Install date not set"}
                    </div>
                  </div>
                </button>
              ))}

              {liveInspections.map((job) => (
                <button
                  key={`rail-inspection-${job.id}`}
                  type="button"
                  onClick={() => setSelectedFieldJobId(job.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border:
                      selectedFieldJobId === job.id
                        ? "1px solid #b6a9c4"
                        : "1px solid #4b4652",
                    borderLeft: "4px solid #9f8fb0",
                    borderRadius: 10,
                    background:
                      selectedFieldJobId === job.id
                        ? "#201b24"
                        : "#151318",
                    color: "#f5f7f5",
                    padding: 17,
                    cursor: "pointer",
                    minHeight: 118,
                  }}
                >
                  <div
                    style={{
                      color: "#b6a9c4",
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Inspection
                  </div>

                  <strong style={{ fontSize: 16, lineHeight: 1.2 }}>
                    {job.first_name} {job.last_name}
                  </strong>

                  <div
                    style={{
                      color: "#87949e",
                      fontSize: 12,
                      marginTop: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {job.project_address}
                  </div>
                </button>
              ))}

              {liveFinalMeasurements.length === 0 &&
              liveInstallations.length === 0 &&
              liveInspections.length === 0 ? (
                <div
                  style={{
                    color: "#69757e",
                    fontSize: 12,
                    padding: 17,
                  }}
                >
                  No active field jobs.
                </div>
              ) : null}
            </div>
          </aside>



          <div style={{ minWidth: 0 }}>
            {!selectedFieldJobId ? (
              <div
                style={{
                  minHeight: 250,
                  border: "1px dashed #31404a",
                  borderRadius: 14,
                  background: "#0d1217",
                  display: "grid",
                  placeItems: "center",
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#dbe2e7",
                      fontSize: 16,
                      fontWeight: 900,
                    }}
                  >
                    Select a field job
                  </div>

                  <div
                    style={{
                      color: "#798792",
                      fontSize: 11,
                      marginTop: 5,
                    }}
                  >
                    Choose a card from the left to open the workspace.
                  </div>
                </div>
              </div>
            ) : null}
        <section
          style={{
            display: selectedFieldJobId ? "block" : "none",
            border: "1px solid #31495a",
            borderRadius: 16,
            background: "#0f151b",
            padding: 14,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: "1px solid #26323a",
            }}
          >
            <div>
              <div
                style={{
                  color: "#9db7ca",
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Field Workspace
              </div>

              <div
                style={{
                  color: "#f5f7f5",
                  fontSize: 16,
                  fontWeight: 900,
                  marginTop: 2,
                }}
              >
                {selectedFieldJobId ? "Field Job Workspace" : "Field Job"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFieldJobId(null)}
              style={{
                minHeight: 36,
                border: "1px solid #46545e",
                borderRadius: 9,
                background: "#151c22",
                color: "#d9e5ee",
                padding: "0 12px",
                fontSize: 11,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Close Job
            </button>
          </div>
          <div
            style={{
              display: liveFinalMeasurements.some((job) => job.id === selectedFieldJobId) ? "flex" : "none",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  color: "#9db7ca",
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Live Relay
              </div>

              <strong style={{ fontSize: 16 }}>
                Final Measurements
              </strong>
            </div>

            <span
              style={{
                minWidth: 28,
                height: 28,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: "#16232d",
                border: "1px solid #31495a",
                color: "#d9e5ee",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              {liveFinalMeasurements.length}
            </span>
          </div>

          {!liveFinalMeasurements.some((job) => job.id === selectedFieldJobId) ? null : liveFinalMeasurementsLoading ? (
            <div
              style={{
                color: "#8fa0ad",
                fontSize: 12,
                padding: "8px 0",
              }}
            >
              Loading final measurements...
            </div>
          ) : liveFinalMeasurements.length === 0 ? (
            <div
              style={{
                color: "#78858e",
                fontSize: 12,
                padding: "8px 0",
              }}
            >
              No final measurements assigned to Field Operations right now.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 9 }}>
              {liveFinalMeasurements.filter((job) => job.id === selectedFieldJobId).map((job) => (
                <div
                  key={job.id}
                  style={{
                    border: "1px solid #31495a",
                    borderRadius: 13,
                    background: "#111820",
                    padding: 12,
                  }}
                >
                    <FieldBeamComposer job={job} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 6,
                    }}
                  >
                    <strong>
                      {job.first_name} {job.last_name}
                    </strong>

                    <span
                      style={{
                        color: "#d8b267",
                        fontSize: 10,
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      Final Measurement
                    </span>
                  </div>

                  <div
                    style={{
                      color: "#9ca8b2",
                      fontSize: 12,
                      marginBottom: 8,
                    }}
                  >
                    {job.project_address}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: 1.5,
                      color: "#d7dde2",
                    }}
                  >
                    <div>
                      <strong>Assigned To:</strong> {job.assigned_to}
                    </div>

                    <div>
                      <strong>Scheduled:</strong>{" "}
                      {job.scheduled_for
                        ? new Date(job.scheduled_for).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Not scheduled"}
                    </div>

                    {job.note ? (
                      <div>
                        <strong>Note:</strong> {job.note}
                      </div>
                    ) : null}
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #26323a",
                      marginTop: 9,
                      paddingTop: 9,
                      color: "#d9e5ee",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "#8fa9bc" }}>Next:</span>{" "}
                    {job.next_action ||
                      "Complete final detailed measurement."}
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      if (activeFinalMeasureJobId === job.id) {
                        setActiveFinalMeasureJobId(null);
                        return;
                      }

                      setActiveFinalMeasureJobId(job.id);
                      setFinalOpeningLocation("");
                      setFinalOpeningWidth("");
                      setFinalOpeningHeight("");
                      setFinalOpeningNotes("");
                      await loadFinalMeasureOpenings(job.id);
                    }}
                    style={{
                      width: "100%",
                      minHeight: 46,
                      marginTop: 10,
                      borderRadius: 10,
                      border: "1px solid #58788e",
                      background: "#1a2a36",
                      color: "#ffffff",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {activeFinalMeasureJobId === job.id
                      ? "Close Final Measurement"
                      : "Open Final Measurement"}
                  </button>

                  {activeFinalMeasureJobId === job.id ? (
                    <div
                      style={{
                        marginTop: 10,
                        padding: 12,
                        border: "1px solid #31495a",
                        borderRadius: 12,
                        background: "#0d1318",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 900,
                          color: "#9db7ca",
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          marginBottom: 8,
                        }}
                      >
                        Final Detailed Measurements
                      </div>

                      {finalMeasureOpeningsLoading ? (
                        <div style={{ color: "#8fa0ad", fontSize: 12 }}>
                          Loading saved openings...
                        </div>
                      ) : finalMeasureOpenings.length > 0 ? (
                        <div style={{ display: "grid", gap: 7, marginBottom: 12 }}>
                          {finalMeasureOpenings.map((opening) => (
                            <div
                              key={opening.id}
                              style={{
                                border: "1px solid #26323a",
                                borderRadius: 9,
                                padding: 9,
                                background: "#111820",
                              }}
                            >
                              <strong style={{ fontSize: 12 }}>
                                Opening {opening.opening_number} {"\u00b7"}{" "}
                                {opening.opening_type}
                              </strong>

                              <div
                                style={{
                                  color: "#9ca8b2",
                                  fontSize: 11,
                                  marginTop: 3,
                                }}
                              >
                                {opening.location}
                              </div>

                              <div
                                style={{
                                  color: "#d9e5ee",
                                  fontSize: 13,
                                  fontWeight: 800,
                                  marginTop: 4,
                                }}
                              >
                                {opening.width_text} {"\u00d7"} {opening.height_text}
                              </div>

                              {opening.notes ? (
                                <div
                                  style={{
                                    color: "#8fa0ad",
                                    fontSize: 11,
                                    marginTop: 4,
                                  }}
                                >
                                  {opening.notes}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            color: "#8fa0ad",
                            fontSize: 11,
                            marginBottom: 10,
                          }}
                        >
                          No final openings saved yet.
                        </div>
                      )}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 8,
                        }}
                      >
                        <select
                          value={finalOpeningType}
                          onChange={(event) => setFinalOpeningType(event.target.value)}
                          style={{
                            minHeight: 42,
                            borderRadius: 9,
                            border: "1px solid #31495a",
                            background: "#101820",
                            color: "#d9e5ee",
                            padding: "0 9px",
                          }}
                        >
                          <option>Window</option>
                          <option>Door</option>
                          <option>Sliding Door</option>
                          <option>Other</option>
                        </select>

                        <input
                          value={finalOpeningLocation}
                          onChange={(event) =>
                            setFinalOpeningLocation(event.target.value)
                          }
                          placeholder="Location"
                          style={{
                            minHeight: 42,
                            borderRadius: 9,
                            border: "1px solid #31495a",
                            background: "#101820",
                            color: "#d9e5ee",
                            padding: "0 9px",
                          }}
                        />

                        <input
                          value={finalOpeningWidth}
                          onChange={(event) => setFinalOpeningWidth(event.target.value)}
                          placeholder="Width"
                          style={{
                            minHeight: 42,
                            borderRadius: 9,
                            border: "1px solid #31495a",
                            background: "#101820",
                            color: "#d9e5ee",
                            padding: "0 9px",
                          }}
                        />

                        <input
                          value={finalOpeningHeight}
                          onChange={(event) => setFinalOpeningHeight(event.target.value)}
                          placeholder="Height"
                          style={{
                            minHeight: 42,
                            borderRadius: 9,
                            border: "1px solid #31495a",
                            background: "#101820",
                            color: "#d9e5ee",
                            padding: "0 9px",
                          }}
                        />
                      </div>

                      <textarea
                        value={finalOpeningNotes}
                        onChange={(event) => setFinalOpeningNotes(event.target.value)}
                        placeholder="Notes"
                        rows={3}
                        style={{
                          width: "100%",
                          marginTop: 8,
                          borderRadius: 9,
                          border: "1px solid #31495a",
                          background: "#101820",
                          color: "#d9e5ee",
                          padding: 9,
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />

                      <button
                        type="button"
                        disabled={savingFinalOpening}
                        onClick={() => void saveFinalMeasureOpening(job.id)}
                        style={{
                          width: "100%",
                          minHeight: 46,
                          marginTop: 8,
                          borderRadius: 10,
                          border: "1px solid #6f91a7",
                          background: "#213543",
                          color: "#ffffff",
                          fontWeight: 900,
                          cursor: savingFinalOpening ? "wait" : "pointer",
                        }}
                      >
                        {savingFinalOpening
                          ? "Saving..."
                          : `Save Opening ${
                              finalMeasureOpenings.reduce(
                                (highest, opening) =>
                                  Math.max(
                                    highest,
                                    Number(opening.opening_number) || 0
                                  ),
                                0
                              ) + 1
                            }`}
                      </button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={async () => {
                      const accessToken = new URLSearchParams(
                        window.location.search
                      ).get("access");

                      if (!accessToken) {
                        window.alert("Premier field access is missing.");
                        return;
                      }

                      if (
                        activeFinalMeasureJobId !== job.id ||
                        finalMeasureOpenings.length === 0
                      ) {
                        window.alert(
                          "Save at least one final measurement opening before completing this step."
                        );
                        return;
                      }

                      const { data, error } = await supabase.rpc(
                        "save_premier_final_measurement",
                        {
                          p_access_token: accessToken,
                          p_job_id: job.id,
                          p_status: "complete",
                          p_scheduled_for: job.scheduled_for || null,
                          p_assigned_to: job.assigned_to || null,
                          p_completed_at: new Date().toISOString(),
                          p_note: job.note || "Final detailed measurement completed.",
                        }
                      );

                      if (error || data !== true) {
                        console.error(
                          "Premier field final measurement completion failed:",
                          error
                        );
                        window.alert(
                          "Could not complete the final measurement. Please try again."
                        );
                        return;
                      }

                      setLiveFinalMeasurements((current) =>
                        current.filter((item) => item.id !== job.id)
                      );
                    }}
                    style={{
                      width: "100%",
                      minHeight: 46,
                      marginTop: 10,
                      borderRadius: 10,
                      border: "1px solid #557c64",
                      background: "#16232d",
                      color: "#d9e5ee",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Complete Final Measurement
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              display: liveInstallations.some((job) => job.id === selectedFieldJobId)
                ? "block"
                : "none",
              borderTop: "1px solid #26323a",
              marginTop: 14,
              paddingTop: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <strong style={{ fontSize: 16 }}>
                {liveInstallations.find((job) => job.id === selectedFieldJobId)?.current_stage ===
                "installation_complete"
                  ? "Installation Complete"
                  : liveInstallations.find((job) => job.id === selectedFieldJobId)?.current_stage ===
                      "installation_ready"
                    ? "Installation Ready"
                    : "Scheduled Installation"}
              </strong>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#d9e5ee" }}>
                {liveInstallations.some((job) => job.id === selectedFieldJobId) ? 1 : 0}
              </span>
            </div>

            {liveInstallationsLoading ? (
              <div style={{ color: "#8fa0ad", fontSize: 12 }}>Loading scheduled installations...</div>
            ) : !liveInstallations.some((job) => job.id === selectedFieldJobId) ? (
              <div style={{ color: "#78858e", fontSize: 12 }}>No scheduled installations right now.</div>
            ) : (
              <div style={{ display: "grid", gap: 9 }}>
                {liveInstallations.filter((job) => job.id === selectedFieldJobId).map((job) => (
                  <div key={job.id} style={{ border: "1px solid #557c64", borderRadius: 13, background: "#111820", padding: 12 }}>
                    <FieldBeamComposer job={job} />

                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                      <strong>{job.first_name} {job.last_name}</strong>
                      <span
                        style={{
                          color: "#b7dec4",
                          fontSize: 10,
                          fontWeight: 900,
                          textTransform: "uppercase",
                        }}
                      >
                        {job.current_stage === "installation_complete"
                          ? "Inspection Prep"
                          : job.current_stage === "installation_ready"
                            ? "Installation Ready"
                            : "Scheduled"}
                      </span>
                    </div>
                    <div style={{ color: "#9ca8b2", fontSize: 12, marginBottom: 8 }}>{job.project_address}</div>
                    <div style={{ display: "grid", gap: 4, fontSize: 12, color: "#d7dde2" }}>
                      <div style={{ display: "grid", gap: 6 }}>
                        <strong>Crew:</strong>
                        <select
                          value={crewDrafts[job.id] ?? job.crew ?? ""}
                          disabled={crewSavingJobId === job.id}
                          onChange={async (event) => {
                            const nextCrew = event.target.value;
                            if (!nextCrew || nextCrew === job.crew) return;

                            const previousCrew = job.crew || "";
                            const accessToken =
                              getPremierFieldAccessToken();

                            setCrewDrafts((current) => ({
                              ...current,
                              [job.id]: nextCrew,
                            }));

                            setCrewSaveErrors((current) => ({
                              ...current,
                              [job.id]: "",
                            }));

                            if (!accessToken) {
                              setCrewDrafts((current) => ({
                                ...current,
                                [job.id]: previousCrew,
                              }));
                              setCrewSaveErrors((current) => ({
                                ...current,
                                [job.id]: "Premier staff access is missing.",
                              }));
                              return;
                            }

                            setCrewSavingJobId(job.id);

                            const { data, error } = await supabase.rpc(
                              "reassign_premier_install_crew",
                              {
                                p_access_token: accessToken,
                                p_job_id: job.id,
                                p_crew: nextCrew,
                              }
                            );

                            if (error || data !== true) {
                              console.error("Premier field crew reassignment failed:", error);

                              setCrewDrafts((current) => ({
                                ...current,
                                [job.id]: previousCrew,
                              }));

                              setCrewSaveErrors((current) => ({
                                ...current,
                                [job.id]: "Could not reassign crew.",
                              }));

                              setCrewSavingJobId(null);
                              return;
                            }

                            setLiveInstallations((current) =>
                              current.map((item) =>
                                item.id === job.id
                                  ? { ...item, crew: nextCrew }
                                  : item
                              )
                            );

                            setCrewDrafts((current) => {
                              const next = { ...current };
                              delete next[job.id];
                              return next;
                            });

                            setCrewSavingJobId(null);
                          }}
                          style={{
                            width: "100%",
                            minHeight: 42,
                            border: "1px solid #31495a",
                            borderRadius: 9,
                            background: "#0c1116",
                            color: "#f3f6f8",
                            padding: "0 10px",
                            fontWeight: 700,
                          }}
                        >
                          <option value="">Choose crew</option>
                          <option value="RJ">RJ</option>
                          <option value={"Exquisite Windows & Doors \u2014 Angel"}>{"Exquisite Windows & Doors \u2014 Angel"}</option>
                          <option value={"Riveras Impact Windows and Doors \u2014 Jose"}>{"Riveras Impact Windows and Doors \u2014 Jose"}</option>
                          <option value={"OGR Windows and Doors \u2014 Obelio"}>{"OGR Windows and Doors \u2014 Obelio"}</option>
                          <option value={"Elite Impact Solutions \u2014 Joseph"}>{"Elite Impact Solutions \u2014 Joseph"}</option>
                        </select>

                        {crewSavingJobId === job.id ? (
                          <span style={{ color: "#8fa9bc", fontSize: 11 }}>
                            Saving crew assignment...
                          </span>
                        ) : crewSaveErrors[job.id] ? (
                          <span style={{ color: "#d8a0a0", fontSize: 11 }}>
                            {crewSaveErrors[job.id]}
                          </span>
                        ) : null}
                      </div>
                      <div><strong>Install:</strong> {job.scheduled_for ? new Date(job.scheduled_for).toLocaleString() : "Not scheduled"}</div>
                      <div><strong>Material:</strong> {job.material_status || "Unknown"}</div>
                      <div><strong>Permit:</strong> {job.permit_status || "Unknown"}</div>
                    </div>
                    <div style={{ borderTop: "1px solid #26323a", marginTop: 9, paddingTop: 9, fontSize: 12, color: "#d9e5ee" }}>
                      <span style={{ color: "#8fa9bc" }}>Next:</span>{" "}
                      {job.next_action || "Field Operations to prepare crew for installation."}
                    </div>

                    <div
                      style={{
                        border: "1px solid #31495a",
                        borderRadius: 12,
                        background: "#0d1318",
                        padding: 12,
                        marginTop: 12,
                      }}
                    >
                      <div
                        style={{
                          color: "#f3f6f8",
                          fontSize: 13,
                          fontWeight: 900,
                          marginBottom: 4,
                        }}
                      >
                        Job File
                      </div>

                      <div
                        style={{
                          color: "#8fa9bc",
                          fontSize: 11,
                          lineHeight: 1.45,
                          marginBottom: 10,
                        }}
                      >
                        Office paperwork for this sold job.
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          if (fieldJobFileOpenId === job.id) {
                            setFieldJobFileOpenId(null);
                            return;
                          }

                          setFieldJobFileOpenId(job.id);
                          await loadFieldJobDocuments(job.id);
                        }}
                        style={{
                          width: "100%",
                          minHeight: 42,
                          borderRadius: 9,
                          border: "1px solid #58788e",
                          background: "#1a2a36",
                          color: "#ffffff",
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        {fieldJobFileOpenId === job.id
                          ? "Close Job File"
                          : "Open Job File"}
                      </button>

                      {fieldJobFileOpenId === job.id ? (
                        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                          {fieldJobDocumentsLoading[job.id] ? (
                            <div style={{ color: "#8fa9bc", fontSize: 11 }}>
                              Loading job documents...
                            </div>
                          ) : fieldJobDocumentsErrors[job.id] ? (
                            <div style={{ color: "#d8a0a0", fontSize: 11 }}>
                              {fieldJobDocumentsErrors[job.id]}
                            </div>
                          ) : (fieldJobDocuments[job.id] ?? []).length === 0 ? (
                            <div style={{ color: "#8fa9bc", fontSize: 11 }}>
                              No job documents have been added yet.
                            </div>
                          ) : (
                            (fieldJobDocuments[job.id] ?? []).map((document) => (
                              <div
                                key={document.id}
                                style={{
                                  border: "1px solid #26323a",
                                  borderRadius: 9,
                                  background: "#111820",
                                  padding: 10,
                                }}
                              >
                                <div
                                  style={{
                                    color: "#f3f6f8",
                                    fontSize: 12,
                                    fontWeight: 900,
                                  }}
                                >
                                  {document.document_type || "Document"}
                                </div>

                                <div
                                  style={{
                                    color: "#9ca8b2",
                                    fontSize: 11,
                                    marginTop: 3,
                                    overflowWrap: "anywhere",
                                  }}
                                >
                                  {document.file_name || "Attached file"}
                                </div>

                                {document.note ? (
                                  <div
                                    style={{
                                      color: "#8fa9bc",
                                      fontSize: 11,
                                      marginTop: 4,
                                    }}
                                  >
                                    {document.note}
                                  </div>
                                ) : null}

                                {document.url ? (
                                  <a
                                    href={document.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      minHeight: 36,
                                      marginTop: 8,
                                      padding: "0 14px",
                                      borderRadius: 8,
                                      border: "1px solid #557c64",
                                      color: "#b7dec4",
                                      fontSize: 11,
                                      fontWeight: 900,
                                      textDecoration: "none",
                                    }}
                                  >
                                    Open
                                  </a>
                                ) : (
                                  <div
                                    style={{
                                      color: "#8fa9bc",
                                      fontSize: 11,
                                      marginTop: 6,
                                    }}
                                  >
                                    File link unavailable.
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      ) : null}
                    </div>

                    {job.current_stage === "installation_ready" ? (
                      <div
                        style={{
                          border: "1px solid #557c64",
                          borderRadius: 12,
                          background: "#111c18",
                          padding: 12,
                          marginTop: 12,
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            color: "#b7dec4",
                            fontSize: 11,
                            fontWeight: 900,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                            marginBottom: 8,
                          }}
                        >
                          {job.current_stage === "installation_complete"
                            ? "Inspection Prep"
                            : "Field Monitoring"}
                        </div>

                        <div
                          style={{
                            color: "#f3f6f8",
                            fontSize: 13,
                            fontWeight: 800,
                            marginBottom: 8,
                          }}
                        >
                          {job.current_stage === "installation_complete"
                            ? "Installation is complete."
                            : "Installer has this job."}
                        </div>

                        <div
                          style={{
                            color: "#d7dde2",
                            fontSize: 12,
                            lineHeight: 1.5,
                          }}
                        >
                          {job.current_stage === "installation_complete" ? (
                            <>
                              Installer work is complete. Review proof, job notes,
                              and the job file, then prepare the required inspection
                              and final walkthrough.
                            </>
                          ) : (
                            <>
                              Monitor installer photos, notes, material issues,
                              Needs Attention items, and field progress here.
                              Keep the job file and Beam available while work moves forward.
                            </>
                          )}
                        </div>
                      </div>
                    ) : null}

                    <div
                      style={{
                        display: job.current_stage === "scheduled" ? "block" : "none",
                        border: "1px solid #557c64",
                        borderRadius: 12,
                        background: "#111c18",
                        padding: 12,
                        marginTop: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          color: "#b7dec4",
                          fontSize: 11,
                          fontWeight: 900,
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        Your Assignment
                      </div>

                      <div
                        style={{
                          color: "#f3f6f8",
                          fontSize: 13,
                          fontWeight: 800,
                          marginBottom: 10,
                        }}
                      >
                        Prepare this sold job for the installer.
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: 10,
                          color: "#d7dde2",
                          fontSize: 12,
                          lineHeight: 1.5,
                        }}
                      >
                        <div>
                          <strong style={{ color: "#f3f6f8" }}>
                            Before sending:
                          </strong>{" "}
                          Confirm the installer, install date, material status,
                          permit status, and that the job information is ready.
                        </div>

                        <div>
                          <strong style={{ color: "#f3f6f8" }}>
                            Then:
                          </strong>{" "}
                          Mark the job Installation Ready to send it to the installer.
                        </div>

                        <div>
                          <strong style={{ color: "#f3f6f8" }}>
                            After handoff:
                          </strong>{" "}
                          Installer photos, notes, material issues, and anything
                          needing attention stay connected to this job for Field
                          Operations to review.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        const accessToken =
                          getPremierFieldAccessToken();

                        if (!accessToken) return;

                        const { data, error } = await supabase.rpc(
                          "relay_premier_installation_ready",
                          {
                            p_access_token: accessToken,
                            p_job_id: job.id,
                          }
                        );

                        if (error) {
                          console.error("Installation Ready relay failed:", error);
                          return;
                        }

                        if (data === true) {
                          setLiveInstallations((current) =>
                            current.map((item) =>
                              item.id === job.id
                                ? {
                                    ...item,
                                    current_stage: "installation_ready",
                                    next_action:
                                      "Installer to begin installation and upload required proof.",
                                  }
                                : item
                            )
                          );
                        }
                      }}
                      style={{
                        display: job.current_stage === "scheduled" ? "block" : "none",
                        width: "100%",
                        minHeight: 46,
                        marginTop: 10,
                        borderRadius: 10,
                        border: "1px solid #557c64",
                        background: "#16232d",
                        color: "#d9e5ee",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Mark Installation Ready
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: liveInspections.some((job) => job.id === selectedFieldJobId)
                ? "block"
                : "none",
              borderTop: "1px solid #26323a",
              marginTop: 14,
              paddingTop: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <strong style={{ fontSize: 16 }}>Scheduled Inspections</strong>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: "#d9e5ee",
                }}
              >
                {liveInspections.length}
              </span>
            </div>

            {liveInspectionsLoading ? (
              <div style={{ color: "#8fa0ad", fontSize: 12 }}>
                Loading scheduled inspections...
              </div>
            ) : liveInspections.length === 0 ? (
              <div style={{ color: "#78858e", fontSize: 12 }}>
                No scheduled inspections right now.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 9 }}>
                {liveInspections.filter((job) => job.id === selectedFieldJobId).map((job) => (
                  <div
                    key={job.id}
                    style={{
                      border: "1px solid #80682f",
                      borderRadius: 13,
                      background: "#111820",
                      padding: 12,
                    }}
                  >
                    <FieldBeamComposer job={job} />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <strong>
                        {job.first_name} {job.last_name}
                      </strong>

                      <span
                        style={{
                          color: "#e1c477",
                          fontSize: 10,
                          fontWeight: 900,
                          textTransform: "uppercase",
                        }}
                      >
                        {job.inspection_status || "Scheduled"}
                      </span>
                    </div>

                    <div
                      style={{
                        color: "#9ca8b2",
                        fontSize: 12,
                        marginBottom: 8,
                      }}
                    >
                      {job.project_address}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: 4,
                        fontSize: 12,
                        color: "#d7dde2",
                      }}
                    >
                      <div>
                        <strong>Type:</strong>{" "}
                        {job.inspection_type || "Inspection"}
                      </div>
                      <div>
                        <strong>Assigned:</strong>{" "}
                        {job.inspection_assigned_to || "Not assigned"}
                      </div>
                      <div>
                        <strong>Final Inspection:</strong>{" "}
                        {job.inspection_scheduled_date
                          ? `${new Date(
                              `${job.inspection_scheduled_date}T12:00:00`
                            ).toLocaleDateString()} — ${
                              job.inspection_window || "Time TBD"
                            }`
                          : job.inspection_scheduled_for
                            ? new Date(
                                job.inspection_scheduled_for
                              ).toLocaleString()
                            : "Not scheduled"}
                      </div>
                    </div>

                    <div
                      style={{
                        borderTop: "1px solid #26323a",
                        marginTop: 9,
                        paddingTop: 9,
                        fontSize: 12,
                        color: "#d9e5ee",
                      }}
                    >
                      <span style={{ color: "#8fa9bc" }}>Next:</span>{" "}
                      {job.next_action ||
                        "Field Operations to complete inspection."}
                    </div>
                    <div
                      style={{
                        border: "1px solid #3f5564",
                        borderRadius: 12,
                        background: "#0d1318",
                        padding: 12,
                        marginTop: 12,
                      }}
                    >
                      <div
                        style={{
                          color: "#f3f6f8",
                          fontSize: 12,
                          fontWeight: 900,
                          marginBottom: 6,
                        }}
                      >
                        What needs attention?
                      </div>

                      <textarea
                        value={inspectionPunchDrafts[job.id] || ""}
                        onFocus={() => {
                          if (!inspectionPunchItems[job.id]) {
                            void loadInspectionPunchItems(job.id);
                          }
                        }}
                        onChange={(event) =>
                          setInspectionPunchDrafts((current) => ({
                            ...current,
                            [job.id]: event.target.value,
                          }))
                        }
                        placeholder="Example: Rear bedroom window needs interior caulking finished."
                        style={{
                          width: "100%",
                          minHeight: 86,
                          resize: "vertical",
                          border: "1px solid #31495a",
                          borderRadius: 9,
                          background: "#0a0f13",
                          color: "#f3f6f8",
                          padding: 10,
                          fontSize: 12,
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                        }}
                      />

                      <button
                        type="button"
                        disabled={inspectionPunchSaving[job.id] === true}
                        onClick={() => void saveInspectionPunchItem(job)}
                        style={{
                          width: "100%",
                          minHeight: 42,
                          marginTop: 8,
                          borderRadius: 9,
                          border: "1px solid #557c64",
                          background: "#173225",
                          color: "#eaf5ee",
                          fontWeight: 900,
                          cursor:
                            inspectionPunchSaving[job.id] === true
                              ? "wait"
                              : "pointer",
                          opacity:
                            inspectionPunchSaving[job.id] === true ? 0.7 : 1,
                        }}
                      >
                        {inspectionPunchSaving[job.id] === true
                          ? "Saving..."
                          : "Add Finish Item"}
                      </button>

                      {inspectionPunchErrors[job.id] ? (
                        <div
                          style={{
                            color: "#e6a7a7",
                            fontSize: 11,
                            marginTop: 7,
                          }}
                        >
                          {inspectionPunchErrors[job.id]}
                        </div>
                      ) : null}

                      {(inspectionPunchItems[job.id] || []).length > 0 ? (
                        <div
                          style={{
                            display: "grid",
                            gap: 7,
                            marginTop: 10,
                          }}
                        >
                          {(inspectionPunchItems[job.id] || []).map(
                            (item: any) => (
                              <div
                                key={item.id}
                                style={{
                                  border: "1px solid #263846",
                                  borderRadius: 9,
                                  background: "#101820",
                                  padding: 9,
                                }}
                              >
                                <div
                                  style={{
                                    color: "#f3f6f8",
                                    fontSize: 12,
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {item.issue}
                                </div>

                                <div
                                  style={{
                                    color: "#8fa0ad",
                                    fontSize: 10,
                                    marginTop: 4,
                                  }}
                                >
                                  {item.status || "Reported"}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        const accessToken =
                          getPremierFieldAccessToken();

                        if (!accessToken) return;

                        const { data, error } = await supabase.rpc(
                          "complete_premier_inspection",
                          {
                            p_access_token: accessToken,
                            p_job_id: job.id,
                          }
                        );

                        if (error) {
                          console.error("Complete Inspection failed:", error);
                          return;
                        }

                        if (data === true) {
                          setLiveInspections((current) =>
                            current.filter((item) => item.id !== job.id)
                          );
                        }
                      }}
                      style={{
                        width: "100%",
                        minHeight: 46,
                        marginTop: 10,
                        borderRadius: 10,
                        border: "1px solid #557c64",
                        background: "#16232d",
                        color: "#d9e5ee",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Complete Inspection
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .field-layout {
            grid-template-columns: 1fr !important;
          }

          .field-summary-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 620px) {
          .field-action-grid,
          .field-main-grid,
          .field-quick-grid,
          .agreement-grid {
            grid-template-columns: 1fr !important;
          }

          .field-summary-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}





