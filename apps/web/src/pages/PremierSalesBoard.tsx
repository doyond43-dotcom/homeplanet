import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

type SalesStage =
  | "My Leads"
  | "Rough Measure"
  | "Proposal Sent"
  | "Approved / Final Measure"
  | "Ready to Order"
  | "Ordered / Handed Off";

type SalesJob = {
  id: string;
  customer: string;
  address: string;
  project: string;
  salesperson: string;
  stage: SalesStage;
  nextAction: string;
  roughMeasure: string;
  proposal: string;
  approval: string;
  finalMeasure: string;
  deposit: string;
  salesOrder: string;
  bossReview: string;
  beamCards: {
    id: string;
    opening: string;
    location: string;
    type: string;
    width: string;
    height: string;
    status: "Final" | "Needs Final Measure";
    notes: string;
  }[];
};

const stages: SalesStage[] = [
  "My Leads",
  "Rough Measure",
  "Proposal Sent",
  "Approved / Final Measure",
  "Ready to Order",
  "Ordered / Handed Off",
];

const jobs: SalesJob[] = [
  {
    id: "PW-1054",
    customer: "James & Maria Thompson",
    address: "Wellington",
    project: "Impact windows throughout home",
    salesperson: "Gino",
    stage: "Rough Measure",
    nextAction: "Complete rough measurements for pricing",
    roughMeasure: "Scheduled for tomorrow · 10:00 AM",
    proposal: "Not created yet",
    approval: "Waiting",
    finalMeasure: "Not started",
    deposit: "Not collected",
    salesOrder: "Not created",
    bossReview: "Not ready",
    beamCards: [
      {
        id: "BC-1054-1",
        opening: "Window 01",
        location: "Living Room",
        type: "Impact Window",
        width: '48"',
        height: '60"',
        status: "Needs Final Measure",
        notes: "Rough measurement only.",
      },
    ],
  },
  {
    id: "PW-1051",
    customer: "David Collins",
    address: "Palm Beach Gardens",
    project: "Front entry door + 6 impact windows",
    salesperson: "Dennis",
    stage: "Proposal Sent",
    nextAction: "Follow up on proposal",
    roughMeasure: "Completed",
    proposal: "$38,450 · Sent Aug 25",
    approval: "Waiting on customer",
    finalMeasure: "Not started",
    deposit: "Not collected",
    salesOrder: "Not created",
    bossReview: "Not ready",
    beamCards: [
      {
        id: "BC-1051-1",
        opening: "Door 01",
        location: "Front Entry",
        type: "Entry Door",
        width: '36"',
        height: '80"',
        status: "Needs Final Measure",
        notes: "Confirm frame condition at final measure.",
      },
      {
        id: "BC-1051-2",
        opening: "Window 01",
        location: "Front Bedroom",
        type: "Impact Window",
        width: '36"',
        height: '62"',
        status: "Needs Final Measure",
        notes: "",
      },
    ],
  },
  {
    id: "PW-1049",
    customer: "Susan Miller",
    address: "Jupiter",
    project: "12 impact windows + rear slider",
    salesperson: "Gino",
    stage: "Approved / Final Measure",
    nextAction: "Complete final measurement and collect deposit",
    roughMeasure: "Completed",
    proposal: "$61,800 · Approved",
    approval: "Customer approved",
    finalMeasure: "Scheduled Aug 28",
    deposit: "Due at final measure",
    salesOrder: "Pending final measurements",
    bossReview: "Not ready",
    beamCards: [
      {
        id: "BC-1049-1",
        opening: "Window 01",
        location: "Master Bedroom",
        type: "Impact Window",
        width: '36 1/4"',
        height: '62 1/2"',
        status: "Final",
        notes: "Final measurement confirmed.",
      },
      {
        id: "BC-1049-2",
        opening: "Window 02",
        location: "Living Room",
        type: "Impact Window",
        width: '48"',
        height: '60"',
        status: "Final",
        notes: "",
      },
      {
        id: "BC-1049-3",
        opening: "Door 01",
        location: "Rear Slider",
        type: "Sliding Door",
        width: '72"',
        height: '80"',
        status: "Needs Final Measure",
        notes: "Recheck sill height before order.",
      },
    ],
  },
  {
    id: "PW-1046",
    customer: "Palm Ridge Builders",
    address: "West Palm Beach · New Construction",
    project: "Full window + door package",
    salesperson: "Gino",
    stage: "Ready to Order",
    nextAction: "Submit sales order for boss review",
    roughMeasure: "Plans / takeoff complete",
    proposal: "$126,400 · Approved",
    approval: "Builder approved",
    finalMeasure: "Final opening schedule complete",
    deposit: "Received",
    salesOrder: "SO-1046 · Ready",
    bossReview: "Needs review",
    beamCards: [
      {
        id: "BC-1046-1",
        opening: "Window 01",
        location: "Front Elevation",
        type: "Impact Window",
        width: '60"',
        height: '72"',
        status: "Final",
        notes: "From approved opening schedule.",
      },
      {
        id: "BC-1046-2",
        opening: "Door 01",
        location: "Rear Patio",
        type: "Sliding Door",
        width: '120"',
        height: '96"',
        status: "Final",
        notes: "Large unit. Coordinate delivery handling.",
      },
    ],
  },
];

export default function PremierSalesBoard() {
  const [liveSalesLeads, setLiveSalesLeads] = useState<any[]>([]);
  const [liveSalesLoading, setLiveSalesLoading] = useState(true);
  const [selectedLiveLeadId, setSelectedLiveLeadId] = useState<string | null>(
    null
  );
  const [selectedSampleLead, setSelectedSampleLead] = useState<any | null>(null);

  useEffect(() => {
    if (!selectedSampleLead) return;

    const timer = window.setTimeout(() => {
      document
        .getElementById("sample-sales-working-drawer")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [selectedSampleLead?.id]);
  const [editingLiveAppointment, setEditingLiveAppointment] = useState(false);
  const [liveAppointmentDraft, setLiveAppointmentDraft] = useState("");
  const [savingLiveLeadAction, setSavingLiveLeadAction] = useState(false);
  const [liveMeasurementOpen, setLiveMeasurementOpen] = useState(false);
  const [liveOpenings, setLiveOpenings] = useState<any[]>([]);
  const [liveOpeningType, setLiveOpeningType] = useState("Window");
  const [liveOpeningLocation, setLiveOpeningLocation] = useState("Living Room");
  const [liveOpeningWidth, setLiveOpeningWidth] = useState("");
  const [liveOpeningHeight, setLiveOpeningHeight] = useState("");
  const [liveOpeningNotes, setLiveOpeningNotes] = useState("");
  const [savingLiveOpening, setSavingLiveOpening] = useState(false);
  const [liveOpeningFormOpen, setLiveOpeningFormOpen] = useState(false);
  const [uploadingLiveOpeningPhotoId, setUploadingLiveOpeningPhotoId] =
    useState<string | null>(null);
  const [liveOpeningPhotos, setLiveOpeningPhotos] = useState<
    Record<string, any[]>
  >({});
  const [liveSpeechStatus, setLiveSpeechStatus] = useState("");
  const [liveSpeechListening, setLiveSpeechListening] = useState<
    "measurement" | "notes" | null
  >(null);
  const [editingLiveOpeningId, setEditingLiveOpeningId] = useState<string | null>(null);
  const liveNotesRecognitionRef = useRef<any>(null);
  const liveNotesKeepListeningRef = useRef(false);
  const [activeJobId, setActiveJobId] = useState(jobs[0].id);
  const [updates, setUpdates] = useState<
    { jobId: string; time: string; text: string }[]
  >([]);

  const [beamCardAdds, setBeamCardAdds] = useState<
    Record<
      string,
      {
        id: string;
        opening: string;
        location: string;
        type: string;
        width: string;
        height: string;
        status: "Final" | "Needs Final Measure";
        notes: string;
      }[]
    >
  >({});

  const [beamFormOpen, setBeamFormOpen] = useState(false);
  const [beamOpening, setBeamOpening] = useState("");
  const [beamLocation, setBeamLocation] = useState("");
  const [beamType, setBeamType] = useState("Impact Window");
  const [beamWidth, setBeamWidth] = useState("");
  const [beamHeight, setBeamHeight] = useState("");
  const [beamStatus, setBeamStatus] = useState<
    "Final" | "Needs Final Measure"
  >("Needs Final Measure");
  const [beamNotes, setBeamNotes] = useState("");

  const activeJob = useMemo(
    () => jobs.find((job) => job.id === activeJobId) ?? jobs[0],
    [activeJobId]
  );

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

  const activeUpdates = updates.filter(
    (item) => item.jobId === activeJob.id
  );

  const activeBeamCards = [
    ...activeJob.beamCards,
    ...(beamCardAdds[activeJob.id] ?? []),
  ];

  useEffect(() => {
    let active = true;

    const loadLiveSalesPipeline = async () => {
      setLiveSalesLoading(true);

      const accessToken = new URLSearchParams(window.location.search).get(
        "access"
      );

      if (!accessToken) {
        console.warn("Premier sales access token missing.");

        if (active) {
          setLiveSalesLeads([]);
          setLiveSalesLoading(false);
        }

        return;
      }

      const [pipelineResult, finalMeasurementResult] = await Promise.all([
        supabase.rpc("get_premier_sales_pipeline", {
          p_access_token: accessToken,
        }),
        supabase.rpc("get_premier_final_measurement_assignments", {
          p_access_token: accessToken,
          p_destination: "sales",
        }),
      ]);

      if (!active) return;

      if (pipelineResult.error) {
        console.error(
          "Premier live sales pipeline failed:",
          pipelineResult.error
        );
      }

      if (finalMeasurementResult.error) {
        console.error(
          "Premier final measurement sales relay failed:",
          finalMeasurementResult.error
        );
      }

      const normalSalesLeads = pipelineResult.error
        ? []
        : pipelineResult.data ?? [];

      const finalMeasurementLeads = finalMeasurementResult.error
        ? []
        : (finalMeasurementResult.data ?? []).map((job: any) => ({
            ...job,
            assigned_salesperson: job.assigned_to,
            current_stage: "final_measurement",
            measurement_appointment: job.scheduled_for,
            latest_sales_note: job.note,
            _finalMeasurement: true,
          }));

      setLiveSalesLeads([
        ...finalMeasurementLeads,
        ...normalSalesLeads,
      ]);

      setLiveSalesLoading(false);
    };

    loadLiveSalesPipeline();

    return () => {
      active = false;
    };
  }, []);

  const liveSalesStages = [
    { key: "new_lead", label: "My Leads" },
    { key: "sales_follow_up", label: "Sales Follow-Up" },
    { key: "measurement", label: "Measurement" },
    { key: "proposal", label: "Proposal" },
    { key: "paused", label: "Paused" },
  ];

  const selectedLiveLead =
    liveSalesLeads.find((lead) => lead.id === selectedLiveLeadId) ?? null;

  const toLocalDateTimeInputValue = (value?: string | null) => {
    if (!value) return "";

    const date = new Date(value);
    const pad = (number: number) => String(number).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const saveLiveLeadUpdate = async ({
    measurementAppointment,
    latestSalesNote,
    nextAction,
    nextStage = "measurement",
  }: {
    measurementAppointment: string | null;
    latestSalesNote: string;
    nextAction: string;
    nextStage?: string;
  }) => {
    if (!selectedLiveLead) return false;

    const accessToken = new URLSearchParams(window.location.search).get(
      "access"
    );

    if (!accessToken) {
      window.alert("Premier sales access is missing.");
      return false;
    }

    setSavingLiveLeadAction(true);

    const { data, error } = await supabase.rpc(
      "save_premier_lead_decision",
      {
        p_access_token: accessToken,
        p_job_id: selectedLiveLead.id,
        p_contact_status:
          selectedLiveLead.contact_status || "contacted",
        p_measurement_appointment: measurementAppointment,
        p_latest_sales_note: latestSalesNote,
        p_next_action: nextAction,
        p_next_stage: nextStage,
      }
    );

    if (error || data !== true) {
      console.error("Premier live sales update failed:", error);
      window.alert("Could not save the sales update. Please try again.");
      setSavingLiveLeadAction(false);
      return false;
    }

    setLiveSalesLeads((current) =>
      current.map((lead) =>
        lead.id === selectedLiveLead.id
          ? {
              ...lead,
              measurement_appointment: measurementAppointment,
              latest_sales_note: latestSalesNote,
              next_action: nextAction,
              current_stage: nextStage,
            }
          : lead
      )
    );

    setSavingLiveLeadAction(false);
    return true;
  };

  const relayLiveProposalOutcome = async (
    outcome: "approved" | "needs_revision" | "thinking" | "declined"
  ) => {
    if (!selectedLiveLead) return;

    let note = "";

    if (outcome === "needs_revision") {
      const revisionNote = window.prompt(
        "What does the customer want changed?"
      );

      if (revisionNote === null) return;

      note = revisionNote.trim();
    }

    const accessToken = new URLSearchParams(
      window.location.search
    ).get("access");

    if (!accessToken) {
      window.alert("Premier sales access is missing.");
      return;
    }

    setSavingLiveLeadAction(true);

    const { data, error } = await supabase.rpc(
      "relay_premier_proposal_outcome",
      {
        p_access_token: accessToken,
        p_job_id: selectedLiveLead.id,
        p_outcome: outcome,
        p_note: note || null,
      }
    );

    if (error || data !== true) {
      console.error("Premier proposal outcome relay failed:", error);
      window.alert("Could not send the proposal outcome.");
      setSavingLiveLeadAction(false);
      return;
    }

    if (outcome === "thinking") {
      setLiveSalesLeads((current) =>
        current.map((lead) =>
          lead.id === selectedLiveLead.id
            ? {
                ...lead,
                current_stage: "sales_follow_up",
                next_action: `${
                  selectedLiveLead.assigned_salesperson || "Salesperson"
                } to follow up with customer.`,
                latest_sales_note:
                  "Customer is thinking about proposal.",
              }
            : lead
        )
      );
    } else {
      setLiveSalesLeads((current) =>
        current.filter((lead) => lead.id !== selectedLiveLead.id)
      );
    }

    setSelectedLiveLeadId(null);
    setSavingLiveLeadAction(false);
  };
  const completeLiveFinalMeasurement = async () => {
    if (
      !selectedLiveLead ||
      selectedLiveLead.current_stage !== "final_measurement"
    ) {
      return;
    }

    const accessToken = new URLSearchParams(
      window.location.search
    ).get("access");

    if (!accessToken) {
      window.alert("Premier sales access is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Mark this final measurement complete and return it to Office?"
    );

    if (!confirmed) return;

    setSavingLiveLeadAction(true);

    const { data, error } = await supabase.rpc(
      "save_premier_final_measurement",
      {
        p_access_token: accessToken,
        p_job_id: selectedLiveLead.id,
        p_status: "complete",
        p_scheduled_for:
          selectedLiveLead.measurement_appointment || null,
        p_assigned_to:
          selectedLiveLead.assigned_salesperson || null,
        p_completed_at: new Date().toISOString(),
        p_note: "Final detailed measurement completed.",
      }
    );

    if (error || data !== true) {
      console.error(
        "Premier final measurement completion failed:",
        error
      );
      window.alert(
        "Could not complete the final measurement. Please try again."
      );
      setSavingLiveLeadAction(false);
      return;
    }

    setLiveSalesLeads((current) =>
      current.filter((lead) => lead.id !== selectedLiveLead.id)
    );

    setSelectedLiveLeadId(null);
    setSavingLiveLeadAction(false);
  };

  const saveLiveAppointment = async () => {
    if (!selectedLiveLead || !liveAppointmentDraft) return;

    const appointmentIso = new Date(liveAppointmentDraft).toISOString();

    const formatted = new Date(liveAppointmentDraft).toLocaleString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );

    const salesperson =
      selectedLiveLead.assigned_salesperson || "Salesperson";

    const saved = await saveLiveLeadUpdate({
      measurementAppointment: appointmentIso,
      latestSalesNote: `Measurement appointment set for ${formatted}.`,
      nextAction: `${salesperson} measurement scheduled for ${formatted}.`,
    });

    if (saved) {
      setEditingLiveAppointment(false);
      setLiveAppointmentDraft("");
    }
  };

  const startLiveMeasurement = async () => {
    if (!selectedLiveLead) return;

    const saved = await saveLiveLeadUpdate({
      measurementAppointment:
        selectedLiveLead.measurement_appointment || null,
      latestSalesNote: "Measurement started.",
      nextAction:
        "Complete field measurements for each opening and add photos or notes as needed.",
    });

    if (saved) {
      setLiveMeasurementOpen(true);

      window.setTimeout(() => {
        document
          .getElementById("live-field-measurement")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  const completeLiveRoughMeasurement = async () => {
    if (!selectedLiveLead) return;

    if (liveOpenings.length === 0) {
      window.alert("Save at least one opening before completing the rough measurement.");
      return;
    }

    const saved = await saveLiveLeadUpdate({
      measurementAppointment:
        selectedLiveLead.measurement_appointment || null,
      latestSalesNote: "Rough measurement completed.",
      nextAction: "Create and send proposal.",
      nextStage: "proposal",
    });

    if (saved) {
      setLiveMeasurementOpen(false);
    }
  };
  const handleLiveCustomerCall = async () => {
    if (!selectedLiveLead?.phone) return;

    const phone = String(selectedLiveLead.phone).replace(/[^\d+]/g, "");
    const mobileDevice =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (mobileDevice) {
      window.location.href = `tel:${phone}`;
      return;
    }

    try {
      await navigator.clipboard.writeText(phone);
      window.alert(`Phone number copied: ${selectedLiveLead.phone}`);
    } catch {
      window.prompt("Copy customer phone number:", selectedLiveLead.phone);
    }
  };
  const getPremierAccessToken = () =>
    new URLSearchParams(window.location.search).get("access");

  const loadLiveMeasurementOpenings = async (jobId: string) => {
    const accessToken = getPremierAccessToken();

    if (!accessToken) {
      setLiveOpenings([]);
      return;
    }

    const { data, error } = await supabase.rpc(
      "get_premier_measurement_openings",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
      }
    );

    if (error) {
      console.error("Premier measurement openings failed:", error);
      return;
    }

    const openings = data ?? [];
    setLiveOpenings(openings);
    setLiveOpeningFormOpen(openings.length === 0);
    await loadLiveOpeningPhotos(openings);
  };

  useEffect(() => {
    if (!selectedLiveLead?.id) {
      setLiveOpenings([]);
      setLiveMeasurementOpen(false);
      return;
    }

    loadLiveMeasurementOpenings(selectedLiveLead.id);

    if (
      String(selectedLiveLead.next_action || "").includes(
        "Complete field measurements"
      )
    ) {
      setLiveMeasurementOpen(true);
    }
  }, [selectedLiveLeadId]);

  const nextLiveOpeningNumber =
    liveOpenings.reduce(
      (highest, opening) =>
        Math.max(highest, Number(opening.opening_number) || 0),
      0
    ) + 1;

  const resetLiveOpeningForm = () => {
    setEditingLiveOpeningId(null);
    setLiveOpeningWidth("");
    setLiveOpeningHeight("");
    setLiveOpeningNotes("");
  };

  const loadLiveOpeningPhotos = async (openings: any[]) => {
    const accessToken = getPremierAccessToken();

    if (!accessToken || !selectedLiveLead?.id) {
      setLiveOpeningPhotos({});
      return;
    }

    const entries = await Promise.all(
      openings.map(async (opening) => {
        const { data, error } = await supabase.functions.invoke(
          "premier-opening-photo",
          {
            body: {
              action: "list",
              accessToken,
              jobId: selectedLiveLead.id,
              openingId: opening.id,
            },
          }
        );

        if (error) {
          console.error(
            `Premier photo list failed for opening ${opening.opening_number}:`,
            error
          );

          return [opening.id, []] as const;
        }

        return [opening.id, data?.photos ?? []] as const;
      })
    );

    setLiveOpeningPhotos(Object.fromEntries(entries));
  };

  const uploadLiveOpeningPhoto = async (
    opening: any,
    file: File | null
  ) => {
    if (!file || !selectedLiveLead) return;

    const accessToken = getPremierAccessToken();

    if (!accessToken) {
      window.alert("Premier sales access is missing.");
      return;
    }

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      window.alert("Please use a JPG, PNG, or WEBP photo.");
      return;
    }

    setUploadingLiveOpeningPhotoId(opening.id);

    try {
      const { data: uploadAccess, error: accessError } =
        await supabase.functions.invoke(
          "premier-opening-photo",
          {
            body: {
              action: "create-upload",
              accessToken,
              jobId: selectedLiveLead.id,
              openingId: opening.id,
              fileName: file.name || "opening-photo.jpg",
              mimeType: file.type || "image/jpeg",
            },
          }
        );

      if (accessError || !uploadAccess?.path || !uploadAccess?.token) {
        throw new Error(
          accessError?.message || "Could not prepare photo upload."
        );
      }

      const { error: uploadError } = await supabase.storage
        .from("premier-opening-photos")
        .uploadToSignedUrl(
          uploadAccess.path,
          uploadAccess.token,
          file,
          {
            contentType: file.type || "image/jpeg",
          }
        );

      if (uploadError) {
        throw uploadError;
      }

      const { error: finalizeError } =
        await supabase.functions.invoke(
          "premier-opening-photo",
          {
            body: {
              action: "finalize",
              accessToken,
              jobId: selectedLiveLead.id,
              openingId: opening.id,
              path: uploadAccess.path,
              fileName: file.name || "opening-photo.jpg",
              mimeType: file.type || "image/jpeg",
            },
          }
        );

      if (finalizeError) {
        throw finalizeError;
      }

      await loadLiveMeasurementOpenings(selectedLiveLead.id);

      const { data: photoData, error: photoError } =
        await supabase.functions.invoke(
          "premier-opening-photo",
          {
            body: {
              action: "list",
              accessToken,
              jobId: selectedLiveLead.id,
              openingId: opening.id,
            },
          }
        );

      if (!photoError) {
        setLiveOpeningPhotos((current) => ({
          ...current,
          [opening.id]: photoData?.photos ?? [],
        }));
      }
    } catch (error) {
      console.error("Premier opening photo upload failed:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not upload this photo."
      );
    } finally {
      setUploadingLiveOpeningPhotoId(null);
    }
  };
  const editLiveOpening = (opening: any) => {
    setEditingLiveOpeningId(opening.id);
    setLiveOpeningFormOpen(true);
    setLiveOpeningType(opening.opening_type || "Window");
    setLiveOpeningLocation(opening.location || "Living Room");
    setLiveOpeningWidth(opening.width_text || "");
    setLiveOpeningHeight(opening.height_text || "");
    setLiveOpeningNotes(opening.notes || "");

    window.setTimeout(() => {
      document
        .getElementById("live-opening-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const saveLiveOpening = async () => {
    if (!selectedLiveLead) return;

    if (
      !liveOpeningType ||
      !liveOpeningLocation ||
      !liveOpeningWidth.trim() ||
      !liveOpeningHeight.trim()
    ) {
      window.alert(
        "Choose the type and location, then enter width and height."
      );
      return;
    }

    const accessToken = getPremierAccessToken();

    if (!accessToken) {
      window.alert("Premier sales access is missing.");
      return;
    }

    const editingOpening = editingLiveOpeningId
      ? liveOpenings.find((opening) => opening.id === editingLiveOpeningId)
      : null;

    setSavingLiveOpening(true);

    const { error } = await supabase.rpc(
      "save_premier_measurement_opening",
      {
        p_access_token: accessToken,
        p_job_id: selectedLiveLead.id,
        p_opening_id: editingLiveOpeningId,
        p_opening_number:
          editingOpening?.opening_number ?? nextLiveOpeningNumber,
        p_opening_type: liveOpeningType,
        p_location: liveOpeningLocation,
        p_width_text: liveOpeningWidth.trim(),
        p_height_text: liveOpeningHeight.trim(),
        p_notes: liveOpeningNotes.trim(),
      }
    );

    if (error) {
      console.error("Premier opening save failed:", error);
      window.alert("Could not save this opening. Please try again.");
      setSavingLiveOpening(false);
      return;
    }

    await loadLiveMeasurementOpenings(selectedLiveLead.id);

    resetLiveOpeningForm();
    setLiveOpeningFormOpen(false);
    setSavingLiveOpening(false);
  };
  const startLiveSpeech = (
    mode: "measurement" | "notes"
  ) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      window.alert(
        "Voice input is not supported in this browser."
      );
      return;
    }

    if (mode === "notes") {
      if (liveSpeechListening === "notes") {
        liveNotesKeepListeningRef.current = false;
        liveNotesRecognitionRef.current?.stop();
        liveNotesRecognitionRef.current = null;
        setLiveSpeechListening(null);
        return;
      }

      liveNotesKeepListeningRef.current = true;

      const startNotesRecognition = () => {
        if (!liveNotesKeepListeningRef.current) return;

        const recognition = new SpeechRecognition();

        liveNotesRecognitionRef.current = recognition;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.continuous = true;

        recognition.onstart = () => {
          setLiveSpeechListening("notes");
        };

        recognition.onresult = (event: any) => {
          let transcript = "";

          for (
            let index = event.resultIndex;
            index < event.results.length;
            index += 1
          ) {
            if (event.results[index].isFinal) {
              transcript +=
                String(event.results[index][0]?.transcript || "").trim() +
                " ";
            }
          }

          transcript = transcript.trim();

          if (!transcript) return;

          setLiveOpeningNotes((current) =>
            current.trim()
              ? `${current.trim()} ${transcript}`
              : transcript
          );
        };

        recognition.onerror = (event: any) => {
          if (
            event?.error === "not-allowed" ||
            event?.error === "service-not-allowed"
          ) {
            liveNotesKeepListeningRef.current = false;
            setLiveSpeechListening(null);
          }
        };

        recognition.onend = () => {
          liveNotesRecognitionRef.current = null;

          if (liveNotesKeepListeningRef.current) {
            window.setTimeout(() => {
              startNotesRecognition();
            }, 150);
          } else {
            setLiveSpeechListening(null);
          }
        };

        try {
          recognition.start();
        } catch {
          setLiveSpeechListening(null);
        }
      };

      startNotesRecognition();
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    setLiveSpeechListening("measurement");
    setLiveSpeechStatus("");

    recognition.onresult = (event: any) => {
      const transcript = String(
        event.results?.[0]?.[0]?.transcript || ""
      ).trim();

      if (!transcript) return;

      const cleaned = transcript
        .toLowerCase()
        .replace(/inches?/g, "")
        .replace(/"/g, "")
        .trim();

      const pair = cleaned.match(
        /(\d+(?:\.\d+)?(?:\s+\d+\/\d+)?)\s*(?:by|buy|x|×|times)\s*(\d+(?:\.\d+)?(?:\s+\d+\/\d+)?)/i
      );

      if (pair) {
        setLiveOpeningWidth(pair[1].trim());
        setLiveOpeningHeight(pair[2].trim());
        setLiveSpeechStatus(
          `Width ${pair[1].trim()} · Height ${pair[2].trim()}`
        );
        return;
      }

      const single = cleaned.match(
        /(\d+(?:\.\d+)?(?:\s+\d+\/\d+)?)/i
      );

      if (single) {
        if (!liveOpeningWidth.trim()) {
          setLiveOpeningWidth(single[1].trim());
        } else {
          setLiveOpeningHeight(single[1].trim());
        }
      }
    };

    recognition.onend = () => {
      setLiveSpeechListening(null);
    };

    recognition.start();
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #111820 0%, #0b0f13 45%, #07090c 100%)",
        color: "#f5f7f5",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "16px 10px 60px",
        }}
      >
        <header style={{ marginBottom: 20 }}>
          <div
            style={{
              color: "#9db7ca",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 1.3,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Premier Window & Door
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 5vw, 48px)",
              lineHeight: 1,
            }}
          >
            Sales Board
          </h1>

          <p
            style={{
              color: "#a8b0a9",
              margin: "10px 0 0",
              maxWidth: 760,
              fontSize: 14,
            }}
          >
            From the first measurement to the final order handoff.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 12,
              alignItems: "center",
            }}
          >

            <span
              style={{
                border: "1px solid #405c6d",
                borderRadius: 999,
                background: "#1a2a36",
                color: "#e0e9ef",
                padding: "7px 11px",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              Sales
            </span>


          </div>
        </header>

        <section
          style={{
            border: "1px solid #31495a",
            borderRadius: 18,
            background: "#0d1318",
            padding: 11,
            marginBottom: 18,
          }}
        >
          {(() => {
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);

            const showSamples =
              new URLSearchParams(window.location.search).get("samples") === "1";

            const sampleAppointment = (
              daysFromNow: number,
              hour: number,
              minute = 0
            ) => {
              const date = new Date();
              date.setDate(date.getDate() + daysFromNow);
              date.setHours(hour, minute, 0, 0);
              return date.toISOString();
            };

            const sampleSalesLeads = showSamples
              ? [
                  {
                    id: "sample-needs-proposal",
                    _sample: true,
                    first_name: "Amanda",
                    last_name: "Rodriguez",
                    project_address: "Palm Beach Gardens",
                    assigned_salesperson: "Gino",
                    current_stage: "proposal_ready",
                    measurement_appointment: null,
                    next_action: "Present revised proposal to customer.",
                  },
                  {
                    id: "sample-needs-measurement",
                    _sample: true,
                    first_name: "Robert",
                    last_name: "Miller",
                    project_address: "Wellington",
                    assigned_salesperson: "Gino",
                    current_stage: "measurement",
                    measurement_appointment: sampleAppointment(0, 13, 0),
                    next_action: "Complete rough measurement today.",
                  },
                  {
                    id: "sample-needs-lead",
                    _sample: true,
                    first_name: "Carlos",
                    last_name: "Martinez",
                    project_address: "Royal Palm Beach",
                    assigned_salesperson: "Gino",
                    current_stage: "new_lead",
                    measurement_appointment: null,
                    next_action: "Call customer and schedule first appointment.",
                  },
                  {
                    id: "sample-needs-proposal-two",
                    _sample: true,
                    first_name: "Susan",
                    last_name: "Miller",
                    project_address: "Boca Raton",
                    assigned_salesperson: "Gino",
                    current_stage: "proposal_ready",
                    measurement_appointment: null,
                    next_action: "Present proposal and confirm customer decision.",
                  },
                  {
                    id: "sample-needs-measurement-two",
                    _sample: true,
                    first_name: "James",
                    last_name: "Thompson",
                    project_address: "Delray Beach",
                    assigned_salesperson: "Gino",
                    current_stage: "measurement",
                    measurement_appointment: sampleAppointment(0, 15, 30),
                    next_action: "Complete rough measurement this afternoon.",
                  },
                  {
                    id: "sample-needs-lead-two",
                    _sample: true,
                    first_name: "Maria",
                    last_name: "Lopez",
                    project_address: "Boynton Beach",
                    assigned_salesperson: "Gino",
                    current_stage: "new_lead",
                    measurement_appointment: null,
                    next_action: "Call customer and set first appointment.",
                  },
                  {
                    id: "sample-needs-proposal-three",
                    _sample: true,
                    first_name: "Kevin",
                    last_name: "Brown",
                    project_address: "Palm City",
                    assigned_salesperson: "Gino",
                    current_stage: "proposal_ready",
                    measurement_appointment: null,
                    next_action: "Review proposal changes with customer.",
                  },
                  {
                    id: "sample-waiting-thinking",
                    _sample: true,
                    first_name: "Melissa",
                    last_name: "Johnson",
                    project_address: "Jupiter",
                    assigned_salesperson: "Gino",
                    current_stage: "sales_follow_up",
                    measurement_appointment: null,
                    next_action: "Follow up with customer Friday.",
                  },
                  {
                    id: "sample-waiting-office",
                    _sample: true,
                    first_name: "David",
                    last_name: "Anderson",
                    project_address: "West Palm Beach",
                    assigned_salesperson: "Gino",
                    current_stage: "paused",
                    measurement_appointment: null,
                    next_action: "Waiting on Office for pricing revision.",
                  },
                  {
                    id: "sample-upcoming-one",
                    _sample: true,
                    first_name: "Jennifer",
                    last_name: "Clark",
                    project_address: "Lake Worth",
                    assigned_salesperson: "Gino",
                    current_stage: "measurement",
                    measurement_appointment: sampleAppointment(1, 10, 0),
                    next_action: "Upcoming rough measurement.",
                  },
                  {
                    id: "sample-upcoming-two",
                    _sample: true,
                    first_name: "Michael",
                    last_name: "Thompson",
                    project_address: "Palm Beach Gardens",
                    assigned_salesperson: "Gino",
                    current_stage: "measurement",
                    measurement_appointment: sampleAppointment(2, 14, 30),
                    next_action: "Upcoming rough measurement.",
                  },
                ]
              : [];

            const visibleSampleSalesLeads = sampleSalesLeads.filter(
              (sampleLead) =>
                !liveSalesLeads.some(
                  (liveLead) =>
                    liveLead.first_name === sampleLead.first_name &&
                    liveLead.last_name === sampleLead.last_name
                )
            );

            const previewSalesLeads = [
              ...liveSalesLeads,
              ...visibleSampleSalesLeads,
            ];

            const getLane = (lead: any) => {
              if (
                lead.current_stage === "proposal_ready" ||
                lead.current_stage === "new_lead"
              ) {
                return "need";
              }

              if (
                lead.current_stage === "sales_follow_up" ||
                lead.current_stage === "paused"
              ) {
                return "waiting";
              }

              if (lead.current_stage === "measurement") {
                if (!lead.measurement_appointment) return "need";

                return new Date(lead.measurement_appointment) <= endOfToday
                  ? "need"
                  : "upcoming";
              }

              if (lead.current_stage === "final_measurement") {
                if (!lead.measurement_appointment) return "need";

                return new Date(lead.measurement_appointment) <= endOfToday
                  ? "need"
                  : "upcoming";
              }

              return "need";
            };

            const needMe = previewSalesLeads.filter(
              (lead) => getLane(lead) === "need"
            );

            const waiting = previewSalesLeads.filter(
              (lead) => getLane(lead) === "waiting"
            );

            const upcoming = previewSalesLeads.filter(
              (lead) => getLane(lead) === "upcoming"
            );

            const getStageLabel = (lead: any) => {
              if (lead.current_stage === "proposal_ready") {
                return "PROPOSAL READY";
              }

              if (lead.current_stage === "new_lead") {
                return "NEW LEAD";
              }

              if (lead.current_stage === "final_measurement") {
                return "FINAL MEASUREMENT";
              }

              if (lead.current_stage === "measurement") {
                return "MEASUREMENT";
              }

              if (lead.current_stage === "sales_follow_up") {
                return "FOLLOW UP";
              }

              if (lead.current_stage === "paused") {
                return "PAUSED";
              }

              return lead.current_stage
                ?.replaceAll("_", " ")
                .toUpperCase();
            };

            const renderLeadCard = (lead: any) => {
              const appointment = lead.measurement_appointment
                ? new Date(lead.measurement_appointment).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  )
                : null;

              const proposalReady =
                lead.current_stage === "proposal_ready";

              return (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => {
                    if (lead._sample) {
                      setSelectedLiveLeadId(null);
                      setSelectedSampleLead((current: any | null) =>
                        current?.id === lead.id ? null : lead
                      );
                      return;
                    }

                    setSelectedSampleLead(null);
                    setSelectedLiveLeadId((current) =>
                      current === lead.id ? null : lead.id
                    );
                  }}
                  style={{
                    flex: "0 0 min(285px, 86vw)",
                    textAlign: "left",
                    border: proposalReady
                      ? "1px solid #b58b3a"
                      : selectedLiveLeadId === lead.id
                      ? "1px solid #9db7ca"
                      : "1px solid #31495a",
                    borderRadius: 13,
                    background:
                      selectedLiveLeadId === lead.id
                        ? "#16232d"
                        : "#111820",
                    padding: 12,
                    color: "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <strong style={{ fontSize: 14 }}>
                      {lead.first_name} {lead.last_name}
                    </strong>

                    <span
                      style={{
                        color: proposalReady
                          ? "#e0bd72"
                          : "#9db7ca",
                        fontSize: 9,
                        fontWeight: 900,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {getStageLabel(lead)}
                    </span>
                  </div>

                  <div
                    style={{
                      color: "#8e9ca5",
                      fontSize: 11,
                      marginTop: 5,
                    }}
                  >
                    {lead.project_address}
                  </div>

                  {appointment ? (
                    <div
                      style={{
                        color: "#b8c4cc",
                        fontSize: 11,
                        marginTop: 7,
                      }}
                    >
                      {appointment}
                    </div>
                  ) : null}

                  <div
                    style={{
                      marginTop: 9,
                      paddingTop: 8,
                      borderTop: "1px solid #263846",
                      color: "#d9e5ee",
                      fontSize: 11,
                      lineHeight: 1.45,
                    }}
                  >
                    <span style={{ color: "#7f8d96" }}>
                      Next:{" "}
                    </span>

                    {lead.next_action || "Review customer."}
                  </div>
                </button>
              );
            };

            const renderLane = (
              title: string,
              subtitle: string,
              leads: any[],
              signal: string
            ) => {
              const visibleCount =
                title === "NEEDS ME"
                  ? 2
                  : title === "WAITING"
                  ? 1
                  : 2;

              const visibleLeads = leads.slice(0, visibleCount);
              const hiddenLeads = leads.slice(visibleCount);

              const moreLabel =
                title === "NEEDS ME"
                  ? `+${hiddenLeads.length} more needing attention`
                  : title === "WAITING"
                  ? `+${hiddenLeads.length} more waiting`
                  : `See ${hiddenLeads.length} more upcoming`;

              return (
                <div style={{ marginTop: 15 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          fontSize: 12,
                          letterSpacing: 0.7,
                        }}
                      >
                        {title}
                      </strong>

                      <div
                        style={{
                          color: "#7f8d96",
                          fontSize: 10,
                          marginTop: 2,
                        }}
                      >
                        {subtitle}
                      </div>
                    </div>

                    <span
                      style={{
                        minWidth: 28,
                        height: 28,
                        borderRadius: 999,
                        border: `1px solid ${signal}`,
                        display: "grid",
                        placeItems: "center",
                        color: "#d9e5ee",
                        fontSize: 11,
                        fontWeight: 900,
                      }}
                    >
                      {leads.length}
                    </span>
                  </div>

                  {leads.length === 0 ? (
                    <div
                      style={{
                        border: "1px dashed #263846",
                        borderRadius: 10,
                        padding: "9px 11px",
                        color: "#68757e",
                        fontSize: 11,
                      }}
                    >
                      Clear
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          overflowX: "auto",
                          paddingBottom: 4,
                        }}
                      >
                        {visibleLeads.map(renderLeadCard)}
                      </div>

                      {hiddenLeads.length > 0 ? (
                        <details
                          style={{
                            marginTop: 7,
                          }}
                        >
                          <summary
                            style={{
                              minHeight: 40,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1px solid #263846",
                              borderRadius: 10,
                              background: "#101820",
                              color: "#9db7ca",
                              fontSize: 11,
                              fontWeight: 900,
                              cursor: "pointer",
                              listStyle: "none",
                              padding: "0 12px",
                            }}
                          >
                            {moreLabel}
                          </summary>

                          <div
                            style={{
                              marginTop: 7,
                              display: "grid",
                              gap: 5,
                              maxWidth: 430,
                              maxHeight: 210,
                              overflowY: "auto",
                              overscrollBehavior: "contain",
                              WebkitOverflowScrolling: "touch",
                              border: "1px solid #263846",
                              borderRadius: 10,
                              background: "#0b1217",
                              padding: 6,
                            }}
                          >
                            {hiddenLeads.map((lead) => (
                              <div
                                key={lead.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                  if (lead._sample) {
                                    setSelectedLiveLeadId(null);
                                    setSelectedSampleLead(lead);
                                    return;
                                  }

                                  setSelectedSampleLead(null);
                                  setSelectedLiveLeadId(lead.id);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key !== "Enter" && event.key !== " ") return;
                                  event.preventDefault();

                                  if (lead._sample) {
                                    setSelectedLiveLeadId(null);
                                    setSelectedSampleLead(lead);
                                    return;
                                  }

                                  setSelectedSampleLead(null);
                                  setSelectedLiveLeadId(lead.id);
                                }}
                                style={{
                                  border: "1px solid #263846",
                                  borderRadius: 9,
                                  background: "#0f171d",
                                  padding: "8px 10px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 10,
                                  }}
                                >
                                  <strong
                                    style={{
                                      color: "#f3f6f8",
                                      fontSize: 12,
                                    }}
                                  >
                                    {lead.first_name} {lead.last_name}
                                  </strong>

                                  <span
                                    style={{
                                      color:
                                        lead.current_stage === "proposal_ready"
                                          ? "#d0a34a"
                                          : "#8fa9bc",
                                      fontSize: 9,
                                      fontWeight: 900,
                                      letterSpacing: 0.5,
                                      textTransform: "uppercase",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {getStageLabel(lead)}
                                  </span>
                                </div>

                                <div
                                  style={{
                                    color: "#7f8d96",
                                    fontSize: 10,
                                    marginTop: 2,
                                  }}
                                >
                                  {lead.project_address || "No location yet"}
                                </div>

                                {lead.next_action ? (
                                  <div
                                    style={{
                                      borderTop: "1px solid #22313b",
                                      marginTop: 6,
                                      paddingTop: 6,
                                      color: "#aab8c1",
                                      fontSize: 10,
                                      lineHeight: 1.35,
                                    }}
                                  >
                                    Next: {lead.next_action}
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </details>
                      ) : null}
                    </>
                  )}
                </div>
              );
            };

            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#9db7ca",
                        fontSize: 10,
                        fontWeight: 900,
                        letterSpacing: 1.1,
                        textTransform: "uppercase",
                        marginBottom: 3,
                      }}
                    >
                      Live Sales
                    </div>

                    <strong style={{ fontSize: 18 }}>
                      My Work
                    </strong>

                    <div
                      style={{
                        color: "#87949d",
                        fontSize: 12,
                        marginTop: 3,
                      }}
                    >
                      Who needs me, what am I waiting on, and what's next.
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 7,
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        border: "1px solid #486578",
                        borderRadius: 999,
                        padding: "6px 9px",
                        color: "#d9e5ee",
                        fontSize: 10,
                        fontWeight: 900,
                      }}
                    >
                      {needMe.length} Need Me
                    </span>

                    <span
                      style={{
                        border: "1px solid #4b5359",
                        borderRadius: 999,
                        padding: "6px 9px",
                        color: "#aeb8bf",
                        fontSize: 10,
                        fontWeight: 900,
                      }}
                    >
                      {waiting.length} Waiting
                    </span>

                    <span
                      style={{
                        border: "1px solid #31495a",
                        borderRadius: 999,
                        padding: "6px 9px",
                        color: "#9db7ca",
                        fontSize: 10,
                        fontWeight: 900,
                      }}
                    >
                      {upcoming.length} Upcoming
                    </span>
                  </div>
                </div>

                {liveSalesLoading ? (
                  <div
                    style={{
                      color: "#8e9ca5",
                      fontSize: 12,
                      padding: "14px 2px",
                    }}
                  >
                    Loading my work...
                  </div>
                ) : (
                  <>
                    {renderLane(
                      "NEEDS ME",
                      "Action is waiting on Sales",
                      needMe,
                      "#58788e"
                    )}

                    {renderLane(
                      "WAITING",
                      "Already touched; waiting on someone else",
                      waiting,
                      "#4b5359"
                    )}

                    {renderLane(
                      "UPCOMING",
                      "Scheduled work coming next",
                      upcoming,
                      "#31495a"
                    )}
                  </>
                )}
              </>
            );
          })()}
        </section>

        {selectedSampleLead ? (
          <section
            id="sample-sales-working-drawer"
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
              boxShadow: "0 0 0 100vmax rgba(0,0,0,0.62), 0 24px 80px rgba(0,0,0,0.72)",
              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <div>
                <div
                  style={{
                    color: "#8fa9bc",
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Sample Working Drawer
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                    lineHeight: 1.15,
                  }}
                >
                  {selectedSampleLead.first_name}{" "}
                  {selectedSampleLead.last_name}
                </h2>

                <div
                  style={{
                    color: "#8796a0",
                    fontSize: 11,
                    marginTop: 5,
                  }}
                >
                  {selectedSampleLead.project_address}
                </div>
              </div>

              <span
                style={{
                  border:
                    selectedSampleLead.current_stage === "proposal_ready"
                      ? "1px solid #b58b3a"
                      : "1px solid #31495a",
                  borderRadius: 999,
                  padding: "5px 8px",
                  color:
                    selectedSampleLead.current_stage === "proposal_ready"
                      ? "#d0a34a"
                      : "#9db7ca",
                  fontSize: 9,
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                }}
              >
                {selectedSampleLead.current_stage === "proposal_ready"
                  ? "PROPOSAL READY"
                  : selectedSampleLead.current_stage === "new_lead"
                  ? "NEW LEAD"
                  : selectedSampleLead.current_stage === "sales_follow_up"
                  ? "FOLLOW UP"
                  : selectedSampleLead.current_stage === "paused"
                  ? "WAITING"
                  : "MEASUREMENT"}
              </span>
            </div>

            {selectedSampleLead.next_action ? (
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
                <strong>Next:</strong> {selectedSampleLead.next_action}
              </div>
            ) : null}

            {selectedSampleLead.measurement_appointment ? (
              <div
                style={{
                  color: "#9db7ca",
                  fontSize: 11,
                  marginBottom: 10,
                }}
              >
                Appointment:{" "}
                {new Date(
                  selectedSampleLead.measurement_appointment
                ).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
            ) : null}

            {selectedSampleLead.current_stage === "proposal_ready" ? (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 8,
                  }}
                >
                  {[
                    ["Open Proposal", "open"],
                    ["Send Proposal", "send"],
                    ["Show / Print", "show"],
                    ["Customer Outcome", "outcome"],
                  ].map(([label, view]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setSelectedSampleLead((current: any) => ({
                          ...current,
                          _sampleProposalView: view,
                          _demoMessage: null,
                        }))
                      }
                      style={{
                        minHeight: 44,
                        border: "1px solid #405c6d",
                        borderRadius: 10,
                        background:
                          selectedSampleLead._sampleProposalView === view
                            ? "#1a2a36"
                            : "#16232d",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {selectedSampleLead._sampleProposalView ? (
                  <div
                    style={{
                      marginTop: 10,
                      border: "1px solid #31495a",
                      borderRadius: 14,
                      background: "#101820",
                      padding: 11,
                    }}
                  >
                    {selectedSampleLead._sampleProposalView === "open" ? (
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
                            marginBottom: 9,
                          }}
                        >
                          Premier Proposal
                        </strong>

                        <div
                          style={{
                            border: "1px solid #3d4650",
                            borderRadius: 10,
                            background: "#0d1318",
                            padding: 10,
                            display: "grid",
                            gap: 8,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                color: "#7f8d96",
                                fontSize: 8,
                                fontWeight: 900,
                                textTransform: "uppercase",
                                marginBottom: 3,
                              }}
                            >
                              Customer
                            </div>

                            <strong style={{ fontSize: 11 }}>
                              {selectedSampleLead.first_name}{" "}
                              {selectedSampleLead.last_name}
                            </strong>
                          </div>

                          <div
                            style={{
                              borderTop: "1px solid #263846",
                              paddingTop: 8,
                            }}
                          >
                            <div
                              style={{
                                color: "#7f8d96",
                                fontSize: 8,
                                fontWeight: 900,
                                textTransform: "uppercase",
                                marginBottom: 3,
                              }}
                            >
                              Project
                            </div>

                            <strong style={{ fontSize: 11 }}>
                              Rough measurements and job information ready
                            </strong>
                          </div>
                        </div>

                        <div
                          style={{
                            color: "#9ca8b2",
                            fontSize: 9,
                            lineHeight: 1.45,
                            marginTop: 8,
                          }}
                        >
                          Premier's actual proposal layout will be connected here
                          after their standard proposal sheet is provided.
                        </div>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleProposalView === "send" ? (
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
                          Deliver Proposal
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 9,
                          }}
                        >
                          Send to Customer
                        </strong>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: 7,
                          }}
                        >
                          {["Email", "Text Link"].map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() =>
                                setSelectedSampleLead((current: any) => ({
                                  ...current,
                                  _demoMessage:
                                    `Sample proposal would be prepared for ${method}. Nothing was sent.`,
                                }))
                              }
                              style={{
                                minHeight: 40,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d1318",
                                color: "#d9e5ee",
                                fontWeight: 800,
                                fontSize: 10,
                                cursor: "pointer",
                              }}
                            >
                              {method}
                            </button>
                          ))}
                        </div>

                        <div
                          style={{
                            color: "#7f8d96",
                            fontSize: 9,
                            lineHeight: 1.4,
                            marginTop: 8,
                          }}
                        >
                          Delivery stays sample-only until Premier's real proposal
                          format is connected.
                        </div>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleProposalView === "show" ? (
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
                          Present Proposal
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 9,
                          }}
                        >
                          In Person or Print
                        </strong>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: 7,
                          }}
                        >
                          {["Show Full Screen", "Print Proposal"].map((action) => (
                            <button
                              key={action}
                              type="button"
                              onClick={() =>
                                setSelectedSampleLead((current: any) => ({
                                  ...current,
                                  _demoMessage:
                                    `${action} preview opened in sample mode.`,
                                }))
                              }
                              style={{
                                minHeight: 40,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d1318",
                                color: "#d9e5ee",
                                fontWeight: 800,
                                fontSize: 10,
                                cursor: "pointer",
                              }}
                            >
                              {action}
                            </button>
                          ))}
                        </div>

                        <div
                          style={{
                            color: "#7f8d96",
                            fontSize: 9,
                            lineHeight: 1.4,
                            marginTop: 8,
                          }}
                        >
                          The real printable presentation will use Premier's own
                          proposal sheet once supplied.
                        </div>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleProposalView === "outcome" ? (
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
                          Customer Outcome
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 9,
                          }}
                        >
                          What did the customer decide?
                        </strong>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: 7,
                          }}
                        >
                          {[
                            ["Approved", "approved"],
                            ["Needs Revision", "revision"],
                            ["Thinking", "thinking"],
                            ["Declined", "declined"],
                          ].map(([label, outcome]) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() =>
                                setSelectedSampleLead((current: any) => ({
                                  ...current,
                                  _sampleProposalOutcome: outcome,
                                  _demoMessage: null,
                                }))
                              }
                              style={{
                                minHeight: 40,
                                border:
                                  selectedSampleLead._sampleProposalOutcome ===
                                  outcome
                                    ? "1px solid #8fa9bc"
                                    : "1px solid #405c6d",
                                borderRadius: 9,
                                background:
                                  selectedSampleLead._sampleProposalOutcome ===
                                  outcome
                                    ? "#1a2a36"
                                    : "#0d1318",
                                color: "#d9e5ee",
                                fontWeight: 800,
                                fontSize: 10,
                                cursor: "pointer",
                              }}
                            >
                              {label}
                            </button>
                          ))}
                        </div>

                        {selectedSampleLead._sampleProposalOutcome ? (
                          <div
                            style={{
                              marginTop: 9,
                              border: "1px solid #35434d",
                              borderRadius: 9,
                              background: "#0d1318",
                              padding: 9,
                              color: "#c4d0d8",
                              fontSize: 10,
                              lineHeight: 1.45,
                            }}
                          >
                            {selectedSampleLead._sampleProposalOutcome ===
                            "approved" ? (
                              <>
                                <strong style={{ color: "#92c6a4" }}>
                                  Approved
                                </strong>
                                <div style={{ marginTop: 3 }}>
                                  This would relay the job to Office for the next
                                  approved-job steps, including deposit/final
                                  measurement coordination.
                                </div>
                              </>
                            ) : null}

                            {selectedSampleLead._sampleProposalOutcome ===
                            "revision" ? (
                              <>
                                <strong style={{ color: "#d8b267" }}>
                                  Needs Revision
                                </strong>
                                <div style={{ marginTop: 3 }}>
                                  This would relay the requested changes back to
                                  Office, then return the revised proposal to the
                                  salesperson.
                                </div>
                              </>
                            ) : null}

                            {selectedSampleLead._sampleProposalOutcome ===
                            "thinking" ? (
                              <>
                                <strong style={{ color: "#9db7ca" }}>
                                  Thinking
                                </strong>
                                <div style={{ marginTop: 3 }}>
                                  This stays with Sales and moves into Follow Up
                                  with a new next-touch date.
                                </div>
                              </>
                            ) : null}

                            {selectedSampleLead._sampleProposalOutcome ===
                            "declined" ? (
                              <>
                                <strong style={{ color: "#d59a9a" }}>
                                  Declined
                                </strong>
                                <div style={{ marginTop: 3 }}>
                                  This leaves the active Sales path and can be
                                  archived with the customer decision recorded.
                                </div>
                              </>
                            ) : null}
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {selectedSampleLead.current_stage === "measurement" ? (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 8,
                  }}
                >
                  {[
                    ["Open Measurements", "openings"],
                    ["Add Opening", "add"],
                    ["Photos", "photos"],
                    ["Complete Measure", "complete"],
                  ].map(([label, view]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setSelectedSampleLead((current: any) => ({
                          ...current,
                          _sampleMeasurementView: view,
                          _demoMessage: null,
                        }))
                      }
                      style={{
                        minHeight: 44,
                        border: "1px solid #405c6d",
                        borderRadius: 10,
                        background:
                          selectedSampleLead._sampleMeasurementView === view
                            ? "#1a2a36"
                            : "#16232d",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {selectedSampleLead._sampleMeasurementView ? (
                  <div
                    style={{
                      marginTop: 10,
                      border: "1px solid #31495a",
                      borderRadius: 14,
                      background: "#101820",
                      padding: 11,
                    }}
                  >
                    {selectedSampleLead._sampleMeasurementView === "openings" ? (
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
                              }}
                            >
                              Rough Measurement
                            </div>

                            <strong
                              style={{
                                display: "block",
                                marginTop: 3,
                                fontSize: 14,
                              }}
                            >
                              Openings
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
                            3 SAVED
                          </span>
                        </div>

                        {[
                          {
                            number: "01",
                            type: "Window",
                            location: "Living Room",
                            size: '44" × 72 1/2"',
                            proof: "Photo attached",
                          },
                          {
                            number: "02",
                            type: "Window",
                            location: "Dining Room",
                            size: '43" × 72"',
                            proof: "Photo attached",
                          },
                          {
                            number: "03",
                            type: "Sliding Door",
                            location: "Rear Patio",
                            size: '72" × 80"',
                            proof: "Needs photo",
                          },
                        ].map((opening) => (
                          <div
                            key={opening.number}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "34px minmax(0, 1fr) auto",
                              gap: 9,
                              alignItems: "center",
                              borderTop: "1px solid #263846",
                              padding: "9px 0",
                            }}
                          >
                            <strong
                              style={{
                                color: "#9db7ca",
                                fontSize: 11,
                              }}
                            >
                              {opening.number}
                            </strong>

                            <div>
                              <strong
                                style={{
                                  display: "block",
                                  fontSize: 11,
                                }}
                              >
                                {opening.type} · {opening.location}
                              </strong>

                              <span
                                style={{
                                  color: "#98a7b1",
                                  fontSize: 10,
                                }}
                              >
                                {opening.size}
                              </span>
                            </div>

                            <span
                              style={{
                                color:
                                  opening.proof === "Needs photo"
                                    ? "#d8b267"
                                    : "#92c6a4",
                                fontSize: 9,
                                fontWeight: 800,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {opening.proof}
                            </span>
                          </div>
                        ))}
                      </>
                    ) : null}

                    {selectedSampleLead._sampleMeasurementView === "add" ? (
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
                          New Opening
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 10,
                          }}
                        >
                          Add Window or Door
                        </strong>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: 7,
                          }}
                        >
                          {[
                            ["Type", "Window"],
                            ["Location", "Bedroom"],
                            ["Width", '36"'],
                            ["Height", '60"'],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              style={{
                                border: "1px solid #2d414f",
                                borderRadius: 9,
                                padding: "8px 9px",
                                background: "#0d1318",
                              }}
                            >
                              <div
                                style={{
                                  color: "#7f8d96",
                                  fontSize: 8,
                                  textTransform: "uppercase",
                                  marginBottom: 3,
                                }}
                              >
                                {label}
                              </div>

                              <strong style={{ fontSize: 11 }}>{value}</strong>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSampleLead((current: any) => ({
                              ...current,
                              _sampleMeasurementView: "openings",
                              _demoMessage:
                                "Sample opening saved. No live data was changed.",
                            }))
                          }
                          style={{
                            width: "100%",
                            minHeight: 42,
                            marginTop: 8,
                            border: "1px solid #58788e",
                            borderRadius: 9,
                            background: "#1a2a36",
                            color: "#ffffff",
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          Save Sample Opening
                        </button>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleMeasurementView === "photos" ? (
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
                            marginBottom: 9,
                          }}
                        >
                          Opening Photos
                        </strong>

                        {[
                          ["Opening 01 · Living Room", "1 photo"],
                          ["Opening 02 · Dining Room", "1 photo"],
                          ["Opening 03 · Rear Patio", "Add photo"],
                        ].map(([opening, status]) => (
                          <div
                            key={opening}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 10,
                              borderTop: "1px solid #263846",
                              padding: "9px 0",
                              fontSize: 10,
                            }}
                          >
                            <strong>{opening}</strong>
                            <span
                              style={{
                                color:
                                  status === "Add photo"
                                    ? "#d8b267"
                                    : "#92c6a4",
                                fontWeight: 800,
                              }}
                            >
                              {status}
                            </span>
                          </div>
                        ))}

                        <div
                          style={{
                            color: "#7f8d96",
                            fontSize: 9,
                            marginTop: 5,
                          }}
                        >
                          Sample preview only. No photos are uploaded.
                        </div>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleMeasurementView ===
                    "complete" ? (
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
                          Measurement Review
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 8,
                          }}
                        >
                          Ready to send to Office?
                        </strong>

                        <div
                          style={{
                            display: "grid",
                            gap: 5,
                            color: "#c4d0d8",
                            fontSize: 10,
                            marginBottom: 10,
                          }}
                        >
                          <span>✓ 3 openings recorded</span>
                          <span>✓ Dimensions saved</span>
                          <span>✓ Notes attached</span>
                          <span style={{ color: "#d8b267" }}>
                            • 1 opening still needs a photo
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSampleLead((current: any) => ({
                              ...current,
                              _demoMessage:
                                "Sample rough measurement would relay to Office for proposal preparation.",
                            }))
                          }
                          style={{
                            width: "100%",
                            minHeight: 42,
                            border: "1px solid #557c64",
                            borderRadius: 9,
                            background: "#14271c",
                            color: "#b7dec4",
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          Complete & Send to Office
                        </button>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {selectedSampleLead.current_stage === "new_lead" ? (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 8,
                  }}
                >
                  {[
                    ["Call", "call"],
                    ["Text", "text"],
                    ["Schedule Measure", "schedule"],
                    ["Add Note", "note"],
                  ].map(([label, view]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setSelectedSampleLead((current: any) => ({
                          ...current,
                          _sampleLeadView: view,
                          _demoMessage: null,
                        }))
                      }
                      style={{
                        minHeight: 44,
                        border: "1px solid #405c6d",
                        borderRadius: 10,
                        background:
                          selectedSampleLead._sampleLeadView === view
                            ? "#1a2a36"
                            : "#16232d",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {selectedSampleLead._sampleLeadView ? (
                  <div
                    style={{
                      marginTop: 10,
                      border: "1px solid #31495a",
                      borderRadius: 14,
                      background: "#101820",
                      padding: 11,
                    }}
                  >
                    {selectedSampleLead._sampleLeadView === "call" ? (
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
                          Contact Customer
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 10,
                          }}
                        >
                          Call Result
                        </strong>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: 7,
                          }}
                        >
                          {[
                            "Contacted",
                            "No Answer",
                            "Left Voicemail",
                            "Call Back Later",
                          ].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() =>
                                setSelectedSampleLead((current: any) => ({
                                  ...current,
                                  _demoMessage:
                                    `${status} recorded in sample mode.`,
                                }))
                              }
                              style={{
                                minHeight: 40,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d1318",
                                color: "#d9e5ee",
                                fontWeight: 800,
                                fontSize: 10,
                                cursor: "pointer",
                              }}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleLeadView === "text" ? (
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
                          Customer Message
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 8,
                          }}
                        >
                          Text Carlos
                        </strong>

                        <textarea
                          rows={3}
                          defaultValue="Hi Carlos, this is Gino with Premier Window & Door. I’m reaching out to schedule a time to take a look at your project."
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            resize: "vertical",
                            border: "1px solid #31495a",
                            borderRadius: 9,
                            background: "#0d1318",
                            color: "#ffffff",
                            padding: 9,
                            fontSize: 11,
                            lineHeight: 1.4,
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSampleLead((current: any) => ({
                              ...current,
                              _demoMessage:
                                "Sample text prepared. No message was sent.",
                            }))
                          }
                          style={{
                            width: "100%",
                            minHeight: 42,
                            marginTop: 8,
                            border: "1px solid #58788e",
                            borderRadius: 9,
                            background: "#1a2a36",
                            color: "#ffffff",
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          Send Sample Text
                        </button>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleLeadView === "schedule" ? (
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
                          Rough Measure
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 9,
                          }}
                        >
                          Schedule Appointment
                        </strong>

                        <input
                          type="datetime-local"
                          defaultValue=""
                          style={{
                            width: "100%",
                            minHeight: 42,
                            boxSizing: "border-box",
                            border: "1px solid #31495a",
                            borderRadius: 9,
                            background: "#0d1318",
                            color: "#ffffff",
                            padding: "0 9px",
                            fontSize: 11,
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSampleLead((current: any) => ({
                              ...current,
                              _demoMessage:
                                "Sample measurement appointment saved. No live data was changed.",
                            }))
                          }
                          style={{
                            width: "100%",
                            minHeight: 42,
                            marginTop: 8,
                            border: "1px solid #58788e",
                            borderRadius: 9,
                            background: "#1a2a36",
                            color: "#ffffff",
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          Save Appointment
                        </button>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleLeadView === "note" ? (
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
                          Sales Note
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 8,
                          }}
                        >
                          Add Quick Note
                        </strong>

                        <textarea
                          rows={3}
                          placeholder="What did the customer say? Anything Sales or Office should know?"
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            resize: "vertical",
                            border: "1px solid #31495a",
                            borderRadius: 9,
                            background: "#0d1318",
                            color: "#ffffff",
                            padding: 9,
                            fontSize: 11,
                            lineHeight: 1.4,
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSampleLead((current: any) => ({
                              ...current,
                              _demoMessage:
                                "Sample sales note saved. No live data was changed.",
                            }))
                          }
                          style={{
                            width: "100%",
                            minHeight: 42,
                            marginTop: 8,
                            border: "1px solid #58788e",
                            borderRadius: 9,
                            background: "#1a2a36",
                            color: "#ffffff",
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          Save Sample Note
                        </button>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {(selectedSampleLead.current_stage === "sales_follow_up" ||
              selectedSampleLead.current_stage === "paused") ? (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 8,
                  }}
                >
                  {[
                    ["Call", "call"],
                    ["Text", "text"],
                    ["Add Follow Up", "followup"],
                    [selectedSampleLead.current_stage === "paused" ? "Check Office Status" : "Send To Office", "office"],
                  ].map(([label, view]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setSelectedSampleLead((current: any) => ({
                          ...current,
                          _sampleFollowUpView: view,
                          _demoMessage: null,
                        }))
                      }
                      style={{
                        minHeight: 44,
                        border: "1px solid #405c6d",
                        borderRadius: 10,
                        background:
                          selectedSampleLead._sampleFollowUpView === view
                            ? "#1a2a36"
                            : "#16232d",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {selectedSampleLead._sampleFollowUpView ? (
                  <div
                    style={{
                      marginTop: 10,
                      border: "1px solid #31495a",
                      borderRadius: 14,
                      background: "#101820",
                      padding: 11,
                    }}
                  >
                    {selectedSampleLead._sampleFollowUpView === "call" ? (
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
                          Follow Up Contact
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 10,
                          }}
                        >
                          Call Result
                        </strong>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(140px, 1fr))",
                            gap: 7,
                          }}
                        >
                          {[
                            "Contacted",
                            "No Answer",
                            "Left Voicemail",
                            "Call Back Later",
                          ].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() =>
                                setSelectedSampleLead((current: any) => ({
                                  ...current,
                                  _demoMessage:
                                    `${status} recorded in sample mode.`,
                                }))
                              }
                              style={{
                                minHeight: 40,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d1318",
                                color: "#d9e5ee",
                                fontWeight: 800,
                                fontSize: 10,
                                cursor: "pointer",
                              }}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleFollowUpView === "text" ? (
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
                          Customer Message
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 8,
                          }}
                        >
                          Follow Up Text
                        </strong>

                        <textarea
                          rows={3}
                          defaultValue={`Hi ${selectedSampleLead.first_name}, this is Gino with Premier Window & Door. I wanted to follow up and see if you had any questions or if there is anything else you need from me.`}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            resize: "vertical",
                            border: "1px solid #31495a",
                            borderRadius: 9,
                            background: "#0d1318",
                            color: "#ffffff",
                            padding: 9,
                            fontSize: 11,
                            lineHeight: 1.4,
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSampleLead((current: any) => ({
                              ...current,
                              _demoMessage:
                                "Sample follow-up text prepared. No message was sent.",
                            }))
                          }
                          style={{
                            width: "100%",
                            minHeight: 42,
                            marginTop: 8,
                            border: "1px solid #58788e",
                            borderRadius: 9,
                            background: "#1a2a36",
                            color: "#ffffff",
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          Send Sample Text
                        </button>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleFollowUpView === "followup" ? (
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
                          Next Follow Up
                        </div>

                        <strong
                          style={{
                            display: "block",
                            fontSize: 14,
                            marginBottom: 9,
                          }}
                        >
                          Schedule Next Touch
                        </strong>

                        <input
                          type="datetime-local"
                          style={{
                            width: "100%",
                            minHeight: 42,
                            boxSizing: "border-box",
                            border: "1px solid #31495a",
                            borderRadius: 9,
                            background: "#0d1318",
                            color: "#ffffff",
                            padding: "0 9px",
                            fontSize: 11,
                          }}
                        />

                        <textarea
                          rows={2}
                          placeholder="What should Sales remember next time?"
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            resize: "vertical",
                            border: "1px solid #31495a",
                            borderRadius: 9,
                            background: "#0d1318",
                            color: "#ffffff",
                            padding: 9,
                            fontSize: 11,
                            lineHeight: 1.4,
                            marginTop: 7,
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSampleLead((current: any) => ({
                              ...current,
                              _demoMessage:
                                "Sample follow-up scheduled. No live data was changed.",
                            }))
                          }
                          style={{
                            width: "100%",
                            minHeight: 42,
                            marginTop: 8,
                            border: "1px solid #58788e",
                            borderRadius: 9,
                            background: "#1a2a36",
                            color: "#ffffff",
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          Save Follow Up
                        </button>
                      </>
                    ) : null}

                    {selectedSampleLead._sampleFollowUpView === "office" ? (
                      selectedSampleLead.current_stage === "paused" ? (
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
                            Office Status
                          </div>

                          <strong
                            style={{
                              display: "block",
                              fontSize: 14,
                              marginBottom: 9,
                            }}
                          >
                            Waiting on Office
                          </strong>

                          <div
                            style={{
                              border: "1px solid #3d4650",
                              borderRadius: 10,
                              background: "#0d1318",
                              padding: 10,
                              display: "grid",
                              gap: 8,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  color: "#7f8d96",
                                  fontSize: 8,
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                  marginBottom: 3,
                                }}
                              >
                                Waiting For
                              </div>

                              <strong
                                style={{
                                  color: "#d9e5ee",
                                  fontSize: 11,
                                }}
                              >
                                Pricing revision from Office
                              </strong>
                            </div>

                            <div
                              style={{
                                borderTop: "1px solid #263846",
                                paddingTop: 8,
                              }}
                            >
                              <div
                                style={{
                                  color: "#7f8d96",
                                  fontSize: 8,
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                  marginBottom: 3,
                                }}
                              >
                                Sales Status
                              </div>

                              <strong
                                style={{
                                  color: "#d8b267",
                                  fontSize: 11,
                                }}
                              >
                                Nothing needed from Sales right now
                              </strong>
                            </div>
                          </div>

                          <div
                            style={{
                              color: "#8f9ba4",
                              fontSize: 9,
                              lineHeight: 1.45,
                              marginTop: 8,
                            }}
                          >
                            When Office finishes the revision, this customer can
                            return to Sales with the next action.
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedSampleLead((current: any) => ({
                                ...current,
                                _demoMessage:
                                  "Sample Office status checked. Still waiting on pricing revision.",
                              }))
                            }
                            style={{
                              width: "100%",
                              minHeight: 42,
                              marginTop: 8,
                              border: "1px solid #58788e",
                              borderRadius: 9,
                              background: "#1a2a36",
                              color: "#ffffff",
                              fontWeight: 900,
                              cursor: "pointer",
                            }}
                          >
                            Refresh Office Status
                          </button>
                        </>
                      ) : (
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
                            Relay To Office
                          </div>

                          <strong
                            style={{
                              display: "block",
                              fontSize: 14,
                              marginBottom: 8,
                            }}
                          >
                            What does Office need?
                          </strong>

                          <textarea
                            rows={3}
                            placeholder="Pricing change, revised scope, customer request, paperwork, or anything Office needs to handle..."
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              resize: "vertical",
                              border: "1px solid #4d4330",
                              borderRadius: 9,
                              background: "#0d1318",
                              color: "#ffffff",
                              padding: 9,
                              fontSize: 11,
                              lineHeight: 1.4,
                            }}
                          />

                          <div
                            style={{
                              color: "#8f9ba4",
                              fontSize: 9,
                              lineHeight: 1.4,
                              marginTop: 7,
                            }}
                          >
                            This would leave Sales waiting and create a handoff
                            for Office.
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedSampleLead((current: any) => ({
                                ...current,
                                _demoMessage:
                                  "Sample handoff would relay this customer to the Office board.",
                              }))
                            }
                            style={{
                              width: "100%",
                              minHeight: 42,
                              marginTop: 8,
                              border: "1px solid #80682f",
                              borderRadius: 9,
                              background: "#211c11",
                              color: "#e1c477",
                              fontWeight: 900,
                              cursor: "pointer",
                            }}
                          >
                            Send to Office
                          </button>
                        </>
                      )
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {selectedSampleLead._demoMessage ? (
              <div
                style={{
                  marginTop: 10,
                  border: "1px solid #31495a",
                  borderRadius: 9,
                  background: "#111820",
                  padding: "8px 10px",
                  color: "#9db7ca",
                  fontSize: 10,
                }}
              >
                {selectedSampleLead._demoMessage}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setSelectedSampleLead(null)}
              style={{
                width: "100%",
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
        {selectedLiveLead ? (
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
              boxShadow: "0 0 0 100vmax rgba(0,0,0,0.62), 0 24px 80px rgba(0,0,0,0.72)",
              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 14,
                alignItems: "flex-start",
                marginBottom: 14,
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
                    marginBottom: 5,
                  }}
                >
                  {selectedLiveLead.current_stage === "proposal_ready"
                    ? "Proposal Ready"
                    : selectedLiveLead.current_stage === "final_measurement"
                    ? "Final Measurement"
                    : "Live Lead"}
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 28,
                    lineHeight: 1.05,
                  }}
                >
                  {selectedLiveLead.first_name} {selectedLiveLead.last_name}
                </h2>

                <div
                  style={{
                    color: "#a5aeb5",
                    fontSize: 13,
                    marginTop: 5,
                  }}
                >
                  {selectedLiveLead.project_address}
                </div>
              </div>

              <span
                style={{
                  border: "1px solid #31495a",
                  background: "#16232d",
                  borderRadius: 999,
                  padding: "6px 10px",
                  color: "#d9e5ee",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {selectedLiveLead.current_stage === "proposal_ready"
                  ? "PROPOSAL READY"
                  : selectedLiveLead.current_stage === "final_measurement"
                  ? "FINAL MEASUREMENT"
                  : liveSalesStages.find(
                      (stage) => stage.key === selectedLiveLead.current_stage
                    )?.label ?? selectedLiveLead.current_stage}
              </span>
            </div>

            <div
              style={{
                border: "1px solid #2d3d47",
                background: "#14202a",
                borderRadius: 14,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#8fa9bc",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 5,
                }}
              >
                Next Action
              </div>

              <strong>
                {selectedLiveLead.next_action || "No next action set."}
              </strong>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <button
                type="button"
                onClick={handleLiveCustomerCall}
                disabled={!selectedLiveLead.phone}
                style={{
                  minHeight: 44,
                  border: "1px solid #405c6d",
                  borderRadius: 10,
                  background: "#16232d",
                  color: "#f5f7f8",
                  fontWeight: 900,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: selectedLiveLead.phone ? "pointer" : "not-allowed",
                }}
              >
                Call Customer
              </button>

              <button
                type="button"
                onClick={() => {
                  const destination = encodeURIComponent(
                    selectedLiveLead.project_address || ""
                  );

                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${destination}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                style={{
                  minHeight: 44,
                  border: "1px solid #405c6d",
                  borderRadius: 10,
                  background: "#16232d",
                  color: "#f5f7f8",
                  fontWeight: 900,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Directions
              </button>

              {selectedLiveLead.current_stage === "measurement" ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setLiveAppointmentDraft(
                        toLocalDateTimeInputValue(
                          selectedLiveLead.measurement_appointment
                        )
                      );
                      setEditingLiveAppointment((current) => !current);
                    }}
                    style={{
                      minHeight: 44,
                      border: "1px solid #31495a",
                      borderRadius: 10,
                      background: "#101820",
                      color: "#d9e5ee",
                      fontWeight: 900,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Appointment
                  </button>

                  <button
                    type="button"
                    disabled={savingLiveLeadAction}
                    onClick={startLiveMeasurement}
                    style={{
                      minHeight: 44,
                      border: "1px solid #58788e",
                      borderRadius: 10,
                      background: "#1a2a36",
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: 13,
                      cursor: savingLiveLeadAction ? "wait" : "pointer",
                    }}
                  >
                    {savingLiveLeadAction
                      ? "Opening..."
                      : liveMeasurementOpen
                      ? "Measurements Open"
                      : "Open Measurements"}
                  </button>
                </>
              ) : null}
            </div>

            {selectedLiveLead.current_stage === "proposal_ready" ? (
              <div
                style={{
                  border: "1px solid #2d3d47",
                  borderRadius: 13,
                  background: "#101419",
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    color: "#9ca8b2",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Customer Response
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    disabled={savingLiveLeadAction}
                    onClick={() =>
                      relayLiveProposalOutcome("approved")
                    }
                    style={{
                      minHeight: 44,
                      border: "1px solid #3d7459",
                      borderRadius: 10,
                      background: "#13251c",
                      color: "#b9e2c9",
                      fontWeight: 900,
                      cursor: savingLiveLeadAction ? "wait" : "pointer",
                    }}
                  >
                    Approved
                  </button>

                  <button
                    type="button"
                    disabled={savingLiveLeadAction}
                    onClick={() =>
                      relayLiveProposalOutcome("needs_revision")
                    }
                    style={{
                      minHeight: 44,
                      border: "1px solid #b58b3a",
                      borderRadius: 10,
                      background: "#111820",
                      color: "#e0bd72",
                      fontWeight: 900,
                      cursor: savingLiveLeadAction ? "wait" : "pointer",
                    }}
                  >
                    Needs Revision
                  </button>

                  <button
                    type="button"
                    disabled={savingLiveLeadAction}
                    onClick={() =>
                      relayLiveProposalOutcome("thinking")
                    }
                    style={{
                      minHeight: 44,
                      border: "1px solid #486578",
                      borderRadius: 10,
                      background: "#16232d",
                      color: "#d9e5ee",
                      fontWeight: 900,
                      cursor: savingLiveLeadAction ? "wait" : "pointer",
                    }}
                  >
                    Thinking
                  </button>

                  <button
                    type="button"
                    disabled={savingLiveLeadAction}
                    onClick={() =>
                      relayLiveProposalOutcome("declined")
                    }
                    style={{
                      minHeight: 44,
                      border: "1px solid #7e4444",
                      borderRadius: 10,
                      background: "#241515",
                      color: "#e7b3b3",
                      fontWeight: 900,
                      cursor: savingLiveLeadAction ? "wait" : "pointer",
                    }}
                  >
                    Declined
                  </button>
                </div>
              </div>
            ) : null}
            {editingLiveAppointment ? (
              <div
                style={{
                  border: "1px solid #31495a",
                  borderRadius: 13,
                  background: "#10151a",
                  padding: 12,
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
                  Measurement Appointment
                </div>

                <input
                  type="datetime-local"
                  value={liveAppointmentDraft}
                  onChange={(event) =>
                    setLiveAppointmentDraft(event.target.value)
                  }
                  style={{
                    width: "100%",
                    minHeight: 44,
                    boxSizing: "border-box",
                    border: "1px solid #31495a",
                    borderRadius: 10,
                    background: "#0c1116",
                    color: "#f3f6f8",
                    padding: "0 10px",
                    fontSize: 13,
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    marginTop: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLiveAppointment(false);
                      setLiveAppointmentDraft("");
                    }}
                    style={{
                      minHeight: 42,
                      border: "1px solid #31495a",
                      borderRadius: 10,
                      background: "#101820",
                      color: "#d9e5ee",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      !liveAppointmentDraft || savingLiveLeadAction
                    }
                    onClick={saveLiveAppointment}
                    style={{
                      minHeight: 42,
                      border: "1px solid #58788e",
                      borderRadius: 10,
                      background: "#1a2a36",
                      color: "#ffffff",
                      fontWeight: 900,
                      cursor:
                        !liveAppointmentDraft || savingLiveLeadAction
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {savingLiveLeadAction
                      ? "Saving..."
                      : "Save Appointment"}
                  </button>
                </div>
              </div>
            ) : null}

            <div
              style={{
                border: "1px solid #27333b",
                borderRadius: 12,
                background: "#101419",
                padding: "10px 11px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  color: "#929ba2",
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: 0.7,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Customer Details
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 7,
                }}
              >
                {[
                  [
                    "Salesperson",
                    selectedLiveLead.assigned_salesperson || "Not assigned",
                  ],
                  [
                    selectedLiveLead.current_stage === "final_measurement"                       ? "Scheduled"                       : "Appointment",
                    selectedLiveLead.measurement_appointment
                      ? new Date(
                          selectedLiveLead.measurement_appointment
                        ).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "Not scheduled",
                  ],
                  ["Phone", selectedLiveLead.phone || "Not provided"],
                  ["Email", selectedLiveLead.email || "Not provided"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "92px minmax(0, 1fr)",
                      gap: 8,
                      alignItems: "start",
                    }}
                  >
                    <span
                      style={{
                        color: "#7f8d96",
                        fontSize: 10,
                      }}
                    >
                      {label}
                    </span>

                    <strong
                      style={{
                        color: "#d9e5ee",
                        fontSize: 11,
                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
            {liveMeasurementOpen ? (
              <div
                id="live-field-measurement"
                style={{
                  border: "1px solid #58788e",
                  borderRadius: 16,
                  background: "#111b22",
                  padding: 14,
                  marginBottom: 12,
                  scrollMarginTop: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 14,
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
                        marginBottom: 5,
                      }}
                    >
                      On Site
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: 22,
                      }}
                    >
                      Field Measurement
                    </h3>

                    <div
                      style={{
                        color: "#9ca8b2",
                        fontSize: 12,
                        lineHeight: 1.5,
                        marginTop: 5,
                      }}
                    >
                      Save each window or door as its own opening.
                    </div>
                  </div>

                  <span
                    style={{
                      border: "1px solid #456476",
                      borderRadius: 999,
                      padding: "5px 8px",
                      color: "#d9e5ee",
                      fontSize: 10,
                      fontWeight: 900,
                      whiteSpace: "nowrap",
                    }}
                  >
                    In Progress
                  </span>
                </div>

                {liveOpenings.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    {liveOpenings.map((opening) => (
                      <div
                        key={opening.id}
                        style={{
                          border: "1px solid #31495a",
                          borderRadius: 12,
                          background: "#0d1318",
                          padding: 11,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 10,
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: 13 }}>
                              Opening {opening.opening_number} ·{" "}
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
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <strong
                              style={{
                                color: "#d9e5ee",
                                fontSize: 13,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {opening.width_text} × {opening.height_text}
                            </strong>

                            <button
                              type="button"
                              onClick={() => editLiveOpening(opening)}
                              style={{
                                border: "1px solid #405c6d",
                                borderRadius: 8,
                                background: "#16232d",
                                color: "#d9e5ee",
                                padding: "5px 9px",
                                marginLeft: 4,
                                fontSize: 10,
                                fontWeight: 900,
                                cursor: "pointer",
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </div>

                        {opening.notes ? (
                          <div
                            style={{
                              borderTop: "1px solid #263846",
                              marginTop: 9,
                              paddingTop: 8,
                              color: "#aab5bd",
                              fontSize: 11,
                              lineHeight: 1.45,
                            }}
                          >
                            {opening.notes}
                          </div>
                        ) : null}

                        {(liveOpeningPhotos[opening.id] ?? []).length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 7,
                              marginTop: 10,
                            }}
                          >
                            {(liveOpeningPhotos[opening.id] ?? []).map(
                              (photo: any, photoIndex: number) => (
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
                                    border: "1px solid #31495a",
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
                              )
                            )}
                          </div>
                        ) : null}

                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 36,
                            marginTop: 9,
                            border: "1px solid #405c6d",
                            borderRadius: 9,
                            background: "#111b22",
                            color: "#d9e5ee",
                            fontSize: 11,
                            fontWeight: 900,
                            cursor:
                              uploadingLiveOpeningPhotoId === opening.id
                                ? "wait"
                                : "pointer",
                          }}
                        >
                          {uploadingLiveOpeningPhotoId === opening.id
                            ? "Uploading..."
                            : "📷 Add Photo"}

                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            capture="environment"
                            disabled={
                              uploadingLiveOpeningPhotoId === opening.id
                            }
                            onChange={(event) => {
                              const file =
                                event.target.files?.[0] ?? null;

                              void uploadLiveOpeningPhoto(
                                opening,
                                file
                              );

                              event.currentTarget.value = "";
                            }}
                            style={{ display: "none" }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div
                  id="live-opening-form"
                  style={{
                    display:
                      liveOpeningFormOpen || editingLiveOpeningId
                        ? "block"
                        : "none",
                    border: "1px solid #31495a",
                    borderRadius: 14,
                    background: "#0c1116",
                    padding: 13,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <strong style={{ fontSize: 15 }}>
                      {editingLiveOpeningId
                        ? `Editing Opening ${
                            liveOpenings.find(
                              (opening) =>
                                opening.id === editingLiveOpeningId
                            )?.opening_number ?? ""
                          }`
                        : `Opening ${nextLiveOpeningNumber}`}
                    </strong>

                    <span
                      style={{
                        color: "#d9e5ee",
                        fontSize: 10,
                        fontWeight: 900,
                        border: "1px solid #405c6d",
                        borderRadius: 999,
                        background: "#16232d",
                        padding: "5px 8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {editingLiveOpeningId ? "EDITING" : "NEW OPENING"}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap: 8,
                    }}
                  >
                    <label
                      style={{
                        display: "grid",
                        gap: 5,
                        fontSize: 10,
                        color: "#929ba2",
                      }}
                    >
                      TYPE
                      <select
                        value={liveOpeningType}
                        onChange={(event) =>
                          setLiveOpeningType(event.target.value)
                        }
                        style={{
                          minHeight: 44,
                          border: "1px solid #31495a",
                          borderRadius: 10,
                          background: "#111820",
                          color: "#f5f7f8",
                          padding: "0 9px",
                        }}
                      >
                        <option>Window</option>
                        <option>Sliding Glass Door</option>
                        <option>French Door</option>
                        <option>Entry Door</option>
                        <option>Single Door</option>
                        <option>Double Door</option>
                        <option>Other</option>
                      </select>
                    </label>

                    <label
                      style={{
                        display: "grid",
                        gap: 5,
                        fontSize: 10,
                        color: "#929ba2",
                      }}
                    >
                      LOCATION
                      <select
                        value={liveOpeningLocation}
                        onChange={(event) =>
                          setLiveOpeningLocation(event.target.value)
                        }
                        style={{
                          minHeight: 44,
                          border: "1px solid #31495a",
                          borderRadius: 10,
                          background: "#111820",
                          color: "#f5f7f8",
                          padding: "0 9px",
                        }}
                      >
                        <option>Living Room</option>
                        <option>Kitchen</option>
                        <option>Dining Room</option>
                        <option>Bedroom</option>
                        <option>Master Bedroom</option>
                        <option>Bathroom</option>
                        <option>Master Bath</option>
                        <option>Office</option>
                        <option>Garage</option>
                        <option>Patio</option>
                        <option>Other</option>
                      </select>
                    </label>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap: 8,
                      marginTop: 8,
                    }}
                  >
                    <label
                      style={{
                        display: "grid",
                        gap: 5,
                        fontSize: 10,
                        color: "#929ba2",
                      }}
                    >
                      WIDTH
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Width"
                        value={liveOpeningWidth}
                        onChange={(event) =>
                          setLiveOpeningWidth(event.target.value)
                        }
                        style={{
                          width: "100%",
                          minHeight: 44,
                          boxSizing: "border-box",
                          border: "1px solid #31495a",
                          borderRadius: 10,
                          background: "#111820",
                          color: "#ffffff",
                          padding: "0 10px",
                          fontSize: 16,
                          fontWeight: 800,
                        }}
                      />
                    </label>

                    <label
                      style={{
                        display: "grid",
                        gap: 5,
                        fontSize: 10,
                        color: "#929ba2",
                      }}
                    >
                      HEIGHT
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Height"
                        value={liveOpeningHeight}
                        onChange={(event) =>
                          setLiveOpeningHeight(event.target.value)
                        }
                        style={{
                          width: "100%",
                          minHeight: 44,
                          boxSizing: "border-box",
                          border: "1px solid #31495a",
                          borderRadius: 10,
                          background: "#111820",
                          color: "#ffffff",
                          padding: "0 10px",
                          fontSize: 16,
                          fontWeight: 800,
                        }}
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      startLiveSpeech("measurement")
                    }
                    style={{
                      width: "100%",
                      minHeight: 44,
                      marginTop: 8,
                      border:
                        liveSpeechListening === "measurement"
                          ? "1px solid #6ea87a"
                          : "1px solid #58788e",
                      borderRadius: 10,
                      background:
                        liveSpeechListening === "measurement"
                          ? "#245c31"
                          : "#16232d",
                      color: "#ffffff",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {liveSpeechListening === "measurement"
                      ? "🎤 Listening..."
                      : "🎤 Speak Measurement"}
                  </button>

                  {liveSpeechStatus ? (
                    <div
                      style={{
                        marginTop: 7,
                        color: "#9db7ca",
                        fontSize: 11,
                        lineHeight: 1.4,
                      }}
                    >
                      {liveSpeechStatus}
                    </div>
                  ) : null}

                  <label
                    style={{
                      display: "grid",
                      gap: 5,
                      marginTop: 10,
                      fontSize: 10,
                      color: "#929ba2",
                    }}
                  >
                    NOTES
                    <textarea
                      rows={4}
                      placeholder="Frame condition, trim, access, customer request, special details..."
                      value={liveOpeningNotes}
                      onChange={(event) =>
                        setLiveOpeningNotes(event.target.value)
                      }
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        resize: "vertical",
                        border: "1px solid #31495a",
                        borderRadius: 10,
                        background: "#111820",
                        color: "#ffffff",
                        padding: 10,
                        fontFamily: "inherit",
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => startLiveSpeech("notes")}
                    style={{
                      width: "100%",
                      minHeight: 42,
                      marginTop: 7,
                      border:
                        liveSpeechListening === "notes"
                          ? "1px solid #6ea87a"
                          : "1px solid #31495a",
                      borderRadius: 10,
                      background:
                        liveSpeechListening === "notes"
                          ? "#245c31"
                          : "#101820",
                      color: "#ffffff",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {liveSpeechListening === "notes"
                      ? "🎤 Listening... Tap to Stop"
                      : "🎤 Speak Notes"}
                  </button>

                  <button
                    type="button"
                    disabled={savingLiveOpening}
                    onClick={saveLiveOpening}
                    style={{
                      width: "100%",
                      minHeight: 48,
                      marginTop: 12,
                      border: "1px solid #6f91a7",
                      borderRadius: 11,
                      background: "#213543",
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: 14,
                      cursor: savingLiveOpening
                        ? "wait"
                        : "pointer",
                    }}
                  >
                    {savingLiveOpening
                      ? "Saving..."
                      : editingLiveOpeningId
                      ? "Save Changes"
                      : `Save Opening ${nextLiveOpeningNumber}`}
                  </button>

                  {editingLiveOpeningId ? (
                    <button
                      type="button"
                      onClick={resetLiveOpeningForm}
                      style={{
                        width: "100%",
                        minHeight: 40,
                        marginTop: 7,
                        border: "1px solid #31495a",
                        borderRadius: 10,
                        background: "#101820",
                        color: "#d9e5ee",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Cancel Edit
                    </button>
                  ) : null}

                  <div
                    style={{
                      marginTop: 8,
                      color: "#7f8d96",
                      fontSize: 10,
                      lineHeight: 1.4,
                      textAlign: "center",
                    }}
                  >
                    After saving, the type and location stay selected so
                    multiple openings in the same room are faster to enter.
                  </div>
                </div>

                {liveOpenings.length > 0 && !liveOpeningFormOpen && !editingLiveOpeningId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLiveOpeningId(null);
                      setLiveOpeningFormOpen(true);
                      setLiveOpeningWidth("");
                      setLiveOpeningHeight("");
                      setLiveOpeningNotes("");

                      document
                        .getElementById("live-field-measurement")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    style={{
                      width: "100%",
                      minHeight: 42,
                      marginTop: 10,
                      border: "1px solid #31495a",
                      borderRadius: 10,
                      background: "#101820",
                      color: "#d9e5ee",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    + Add Another Opening
                  </button>
                ) : null}
                {selectedLiveLead.current_stage === "measurement" &&
                liveOpenings.length > 0 &&
                !liveOpeningFormOpen &&
                !editingLiveOpeningId ? (
                  <button
                    type="button"
                    disabled={savingLiveLeadAction}
                    onClick={completeLiveRoughMeasurement}
                    style={{
                      width: "100%",
                      minHeight: 48,
                      marginTop: 12,
                      border: "1px solid #6f91a7",
                      borderRadius: 11,
                      background: "#213543",
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: 14,
                      cursor: savingLiveLeadAction ? "wait" : "pointer",
                    }}
                  >
                    {savingLiveLeadAction
                      ? "Saving..."
                      : "Finish Measurement & Move to Proposal"}
                  </button>
                ) : null}


              </div>
            ) : null}
            <div
              style={{
                border: "1px solid #27333b",
                borderRadius: 12,
                background: "#101419",
                padding: "10px 11px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  color: "#929ba2",
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: 0.7,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Sales Notes
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 9,
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#7f8d96",
                      fontSize: 9,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      marginBottom: 3,
                    }}
                  >
                    Customer Request
                  </div>

                  <div
                    style={{
                      color: "#d9e5ee",
                      fontSize: 11,
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedLiveLead.intake_notes ||
                      "No intake notes provided."}
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #22313b",
                    paddingTop: 8,
                  }}
                >
                  <div
                    style={{
                      color: "#7f8d96",
                      fontSize: 9,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      marginBottom: 3,
                    }}
                  >
                    Latest Sales Update
                  </div>

                  <div
                    style={{
                      color: "#d9e5ee",
                      fontSize: 11,
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedLiveLead.latest_sales_note ||
                      "No sales update added yet."}
                  </div>
                </div>
              </div>
            </div>

            {selectedLiveLead.current_stage === "final_measurement" ? (
              <button
                type="button"
                disabled={savingLiveLeadAction}
                onClick={completeLiveFinalMeasurement}
                style={{
                  width: "100%",
                  minHeight: 48,
                  marginTop: 12,
                  border: "1px solid #557c64",
                  borderRadius: 10,
                  background: "#14271c",
                  color: "#b7dec4",
                  fontWeight: 900,
                  fontSize: 14,
                  cursor: savingLiveLeadAction ? "wait" : "pointer",
                }}
              >
                {savingLiveLeadAction
                  ? "Completing..."
                  : "Complete Final Measurement"}
              </button>
            ) : null}

                        <button
              type="button"
              onClick={() => setSelectedLiveLeadId(null)}
              style={{
                width: "100%",
                marginTop: 12,
                minHeight: 42,
                border: "1px solid #31495a",
                borderRadius: 10,
                background: "#101820",
                color: "#d9e5ee",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Close Lead
            </button>
          </section>
        ) : null}

        <div
          style={{
            display: "none",
            color: "#77828a",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 1,
            textTransform: "uppercase",
            margin: "4px 0 9px",
          }}
        >
          Prototype Workflow Examples
        </div>
        <div
          style={{
            display: "none",
            gap: 9,
            overflowX: "auto",
            paddingBottom: 10,
            marginBottom: 16,
          }}
        >
          {stages.map((stage) => {
            const count = jobs.filter((job) => job.stage === stage).length;

            return (
              <div
                key={stage}
                style={{
                  minWidth: 155,
                  border: "1px solid #263028",
                  borderRadius: 13,
                  background: "#101419",
                  padding: "11px 13px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#969f97",
                    marginBottom: 4,
                  }}
                >
                  {stage}
                </div>

                <strong style={{ fontSize: 21 }}>{count}</strong>
              </div>
            );
          })}
        </div>

        <div
          className="sales-layout"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 390px) minmax(0, 1fr)",
            display: "none",
            gap: 16,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 10 }}>
            {jobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => setActiveJobId(job.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border:
                    activeJobId === job.id
                      ? "1px solid #87a9c0"
                      : "1px solid #252d27",
                  borderRadius: 16,
                  background:
                    activeJobId === job.id ? "#111820" : "#101419",
                  color: "#fff",
                  padding: 15,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 7,
                  }}
                >
                  <strong>{job.customer}</strong>

                  <span
                    style={{
                      fontSize: 11,
                      color: "#a9bfce",
                      fontWeight: 800,
                    }}
                  >
                    {job.stage}
                  </span>
                </div>

                <div
                  style={{
                    color: "#9fa8af",
                    fontSize: 12,
                    marginBottom: 9,
                  }}
                >
                  {job.address}
                </div>

                <div style={{ fontSize: 13 }}>{job.project}</div>

                <div
                  style={{
                    borderTop: "1px solid #29312b",
                    marginTop: 11,
                    paddingTop: 10,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "#8fa9bc" }}>Next:</span>{" "}
                  {job.nextAction}
                </div>
              </button>
            ))}
          </div>

          <div
            style={{
              border: "1px solid #28343d",
              borderRadius: 20,
              background: "#0d1115",
              padding: 17,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 14,
                alignItems: "flex-start",
                marginBottom: 15,
              }}
            >
              <div>
                <div
                  style={{
                    color: "#8fa9bc",
                    fontSize: 11,
                    fontWeight: 900,
                    marginBottom: 5,
                  }}
                >
                  {activeJob.id}
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: 28,
                    lineHeight: 1.05,
                  }}
                >
                  {activeJob.customer}
                </h2>

                <div
                  style={{
                    color: "#a5aeb5",
                    fontSize: 13,
                    marginTop: 5,
                  }}
                >
                  {activeJob.address}
                </div>
              </div>

              <span
                style={{
                  border: "1px solid #31495a",
                  background: "#16232d",
                  borderRadius: 999,
                  padding: "6px 10px",
                  color: "#d9e5ee",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {activeJob.stage}
              </span>
            </div>

            <div
              style={{
                border: "1px solid #2d3d47",
                background: "#14202a",
                borderRadius: 14,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#8fa9bc",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 5,
                }}
              >
                Next Action
              </div>

              <strong>{activeJob.nextAction}</strong>
            </div>

            <div
              className="sales-summary-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 12,
              }}
            >
              {[
                ["Salesperson", activeJob.salesperson],
                ["Project", activeJob.project],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    border: "1px solid #28323a",
                    borderRadius: 12,
                    padding: 12,
                    background: "#101419",
                  }}
                >
                  <div
                    style={{
                      color: "#929ba2",
                      fontSize: 10,
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <strong style={{ fontSize: 13 }}>{value}</strong>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <details
                open
                style={{
                  border: "1px solid #27333b",
                  borderRadius: 13,
                  background: "#10151a",
                  overflow: "hidden",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    padding: 14,
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  Final Measurement / Beam Cards
                </summary>

                <div
                  style={{
                    padding: "0 14px 14px",
                    display: "grid",
                    gap: 9,
                  }}
                >
                  <div
                    style={{
                      color: "#9ca5ad",
                      fontSize: 12,
                    }}
                  >
                    {activeJob.finalMeasure}
                  </div>

                  {activeBeamCards.map((card) => (
                    <div
                      key={card.id}
                      style={{
                        border: "1px solid #2d3a43",
                        borderRadius: 11,
                        padding: 11,
                        background: "#0d1115",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 10,
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: 13 }}>
                            {card.opening} · {card.location}
                          </strong>

                          <div
                            style={{
                              color: "#9ea7ae",
                              fontSize: 11,
                              marginTop: 3,
                            }}
                          >
                            {card.type}
                          </div>
                        </div>

                        <span
                          style={{
                            border:
                              card.status === "Final"
                                ? "1px solid #456476"
                                : "1px solid #665233",
                            borderRadius: 999,
                            padding: "4px 7px",
                            color:
                              card.status === "Final"
                                ? "#b8cfde"
                                : "#dfc28e",
                            fontSize: 9,
                            fontWeight: 900,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {card.status}
                        </span>
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 15,
                          fontWeight: 900,
                        }}
                      >
                        {card.width} × {card.height}
                      </div>

                      {card.notes ? (
                        <div
                          style={{
                            marginTop: 6,
                            color: "#a8b0a9",
                            fontSize: 11,
                          }}
                        >
                          {card.notes}
                        </div>
                      ) : null}
                    </div>
                  ))}

                  {!beamFormOpen ? (
                    <button
                      type="button"
                      onClick={() => setBeamFormOpen(true)}
                      style={{
                        minHeight: 40,
                        border: "1px solid #3f5664",
                        borderRadius: 10,
                        background: "#111820",
                        color: "#fff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      + Add Opening
                    </button>
                  ) : (
                    <div
                      style={{
                        border: "1px solid #33434d",
                        borderRadius: 11,
                        padding: 11,
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      <input
                        value={beamOpening}
                        onChange={(event) => setBeamOpening(event.target.value)}
                        placeholder="Opening number — e.g. Window 03"
                      />

                      <input
                        value={beamLocation}
                        onChange={(event) => setBeamLocation(event.target.value)}
                        placeholder="Location — e.g. Master Bedroom"
                      />

                      <select
                        value={beamType}
                        onChange={(event) => setBeamType(event.target.value)}
                      >
                        <option>Impact Window</option>
                        <option>Entry Door</option>
                        <option>French Door</option>
                        <option>Sliding Door</option>
                        <option>Other</option>
                      </select>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                        }}
                        className="sales-beam-size-grid"
                      >
                        <label
                          style={{
                            display: "grid",
                            gap: 5,
                            color: "#aab3ba",
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          Width
                          <input
                            value={beamWidth}
                            onChange={(event) => setBeamWidth(event.target.value)}
                            placeholder='e.g. 36 1/4"'
                          />
                        </label>

                        <label
                          style={{
                            display: "grid",
                            gap: 5,
                            color: "#aab3ba",
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          Height
                          <input
                            value={beamHeight}
                            onChange={(event) => setBeamHeight(event.target.value)}
                            placeholder='e.g. 62 1/2"'
                          />
                        </label>
                      </div>

                      <select
                        value={beamStatus}
                        onChange={(event) =>
                          setBeamStatus(
                            event.target.value as
                              | "Final"
                              | "Needs Final Measure"
                          )
                        }
                      >
                        <option>Needs Final Measure</option>
                        <option>Final</option>
                      </select>

                      <textarea
                        value={beamNotes}
                        onChange={(event) => setBeamNotes(event.target.value)}
                        placeholder="Notes"
                        rows={2}
                      />

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                        }}
                        className="sales-beam-action-grid"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setBeamFormOpen(false);
                            setBeamOpening("");
                            setBeamLocation("");
                            setBeamWidth("");
                            setBeamHeight("");
                            setBeamNotes("");
                          }}
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          disabled={
                            !beamOpening.trim() ||
                            !beamLocation.trim() ||
                            !beamWidth.trim() ||
                            !beamHeight.trim()
                          }
                          onClick={() => {
                            if (
                              !beamOpening.trim() ||
                              !beamLocation.trim() ||
                              !beamWidth.trim() ||
                              !beamHeight.trim()
                            ) {
                              return;
                            }

                            setBeamCardAdds((current) => ({
                              ...current,
                              [activeJob.id]: [
                                ...(current[activeJob.id] ?? []),
                                {
                                  id: `${activeJob.id}-${Date.now()}`,
                                  opening: beamOpening.trim(),
                                  location: beamLocation.trim(),
                                  type: beamType,
                                  width: beamWidth.trim(),
                                  height: beamHeight.trim(),
                                  status: beamStatus,
                                  notes: beamNotes.trim(),
                                },
                              ],
                            }));

                            addUpdate(
                              `Beam Card added: ${beamOpening.trim()} · ${beamLocation.trim()} · ${beamWidth.trim()} x ${beamHeight.trim()}.`
                            );

                            setBeamFormOpen(false);
                            setBeamOpening("");
                            setBeamLocation("");
                            setBeamWidth("");
                            setBeamHeight("");
                            setBeamNotes("");
                          }}
                          style={{
                            background: "#1a2a36",
                            color: "#fff",
                            fontWeight: 900,
                          }}
                        >
                          Save Opening
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </details>
              {[
                ["Rough Measure", activeJob.roughMeasure],
                ["Proposal / Quote", activeJob.proposal],
                ["Customer Approval", activeJob.approval],

                ["Deposit", activeJob.deposit],
                ["Sales Order", activeJob.salesOrder],
                ["Boss Review", activeJob.bossReview],
              ].map(([label, value]) => (
                <details
                  key={label}
                  style={{
                    border: "1px solid #27333b",
                    borderRadius: 13,
                    background: "#10151a",
                    overflow: "hidden",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      padding: 14,
                      fontWeight: 800,
                      fontSize: 13,
                    }}
                  >
                    {label}
                  </summary>

                  <div
                    style={{
                      padding: "0 14px 14px",
                      color: "#d4dad5",
                      fontSize: 13,
                      lineHeight: 1.5,
                    }}
                  >
                    {value}
                  </div>
                </details>
              ))}
            </div>

            {activeJob.stage === "Ready to Order" ? (
              <div style={{ marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() =>
                    addUpdate("Sales job submitted for boss order review.")
                  }
                  style={{
                    width: "100%",
                    minHeight: 44,
                    border: "1px solid #486578",
                    borderRadius: 10,
                    background: "#1a2a36",
                    color: "#fff",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Submit for Boss Review
                </button>
              </div>
            ) : null}

            {activeJob.stage === "Ordered / Handed Off" ? (
              <div style={{ marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() =>
                    addUpdate("Sales handoff sent to Field Operations.")
                  }
                  style={{
                    width: "100%",
                    minHeight: 44,
                    border: "1px solid #536f82",
                    borderRadius: 10,
                    background: "#1c2c38",
                    color: "#fff",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Hand Off to Field Ops
                </button>
              </div>
            ) : null}

            {activeUpdates.length > 0 ? (
              <details
                style={{
                  marginTop: 10,
                  border: "1px solid #27333b",
                  borderRadius: 13,
                  background: "#10151a",
                  overflow: "hidden",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    padding: 14,
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  Sales Activity
                </summary>

                <div
                  style={{
                    padding: "0 14px 14px",
                    display: "grid",
                    gap: 8,
                  }}
                >
                  {activeUpdates.map((item, index) => (
                    <div
                      key={`${item.time}-${index}`}
                      style={{
                        borderLeft: "2px solid #6f93aa",
                        paddingLeft: 9,
                      }}
                    >
                      <div
                        style={{
                          color: "#9fb9cb",
                          fontSize: 10,
                          fontWeight: 800,
                        }}
                      >
                        {item.time}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        input,
        select,
        textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #34434d;
          border-radius: 9px;
          background: #0b0f13;
          color: #f5f7f5;
          padding: 10px;
          font: inherit;
        }

        button:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        @media (max-width: 760px) {
          .sales-layout {
            grid-template-columns: 1fr !important;
          }

          .sales-summary-grid,
          .sales-action-grid,
          .sales-beam-size-grid,
          .sales-beam-action-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
































