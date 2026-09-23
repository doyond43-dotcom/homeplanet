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

const jobs: Job[] = [
  {
    id: "PW-1048",
    customer: "Michael & Sarah Carter",
    address: "1842 Palm Ridge Dr, Wellington",
    scope: "8 impact windows + rear French door",
    salesperson: "Gio",
    status: "Ready to Schedule",
    nextAction: "Assign crew after material arrival confirmation",
    materialEta: "Sept 14",
    permitStatus: "Approved",
    crew: "Not assigned",
    scheduledDate: "Not scheduled",
  },
  {
    id: "PW-1042",
    customer: "Harbor Point Builders",
    address: "Jupiter Island - New Construction",
    scope: "Commercial window + door package",
    salesperson: "Gino",
    status: "Waiting on Material",
    nextAction: "Monitor manufacturer ETA",
    materialEta: "Oct 3",
    permitStatus: "Builder handling permit",
    crew: "Not assigned",
    scheduledDate: "Pending material",
  },
  {
    id: "PW-1037",
    customer: "Robert Ellis",
    address: "Palm Beach Gardens",
    scope: "4 windows + front entry door",
    salesperson: "Dennis",
    status: "Inspection",
    nextAction: "Upload in-progress inspection photos",
    materialEta: "Received",
    permitStatus: "In-progress inspection",
    crew: "Crew 2",
    scheduledDate: "Installed Aug 24",
  },
];

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
          {open ? "−" : "+"}
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

export default function PremierWindowDoorBoard() {
  const [liveLeads, setLiveLeads] = useState<any[]>([]);
  const [liveLeadsLoading, setLiveLeadsLoading] = useState(true);
  const liveLeadsScrollRef = useRef<HTMLDivElement | null>(null);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [officeWorkLeadId, setOfficeWorkLeadId] = useState<string | null>(null);
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

  const [officeApprovedSetupLoading, setOfficeApprovedSetupLoading] =
    useState(false);
  const [officeApprovedSetupError, setOfficeApprovedSetupError] =
    useState("");
  const [officeDepositSaving, setOfficeDepositSaving] = useState(false);
  const [officeDepositSaved, setOfficeDepositSaved] = useState(false);
  const [officeDepositDraft, setOfficeDepositDraft] = useState({
    status: "pending",
    amount: "",
    method: "",
    receivedDate: "",
    note: "",
  });
  const [officeInspectionSaving, setOfficeInspectionSaving] = useState(false);
  const [officeInspectionError, setOfficeInspectionError] = useState("");
  const [officeInspectionDraft, setOfficeInspectionDraft] = useState({
    type: "Final Inspection",
    scheduledFor: "",
    assignedTo: "Gio",
  });

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

  const previewOfficeLeads = [...liveLeads, ...sampleOfficeLeads];

  const officeWorkLead =
    previewOfficeLeads.find((lead) => lead.id === officeWorkLeadId) ?? null;
  const [assigningLeadId, setAssigningLeadId] = useState<string | null>(null);
  const [savingAssignmentId, setSavingAssignmentId] = useState<string | null>(null);
  const [savingLeadDecisionId, setSavingLeadDecisionId] = useState<string | null>(null);
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
      new URLSearchParams(window.location.search).get("access");

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
      new URLSearchParams(window.location.search).get("access");

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
      new URLSearchParams(window.location.search).get("access");

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

    if (error || !data?.[0]) {
      console.error("Premier production setup load failed:", error);
      setOfficeProductionError("Could not load production setup.");
      setOfficeProductionLoading(false);
      return;
    }

    const row = data[0];

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
      new URLSearchParams(window.location.search).get("access");

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
      officeProductionDraft.materialStatus === "Received" &&
      ["Approved", "Not required"].includes(
        officeProductionDraft.permitStatus
      )
        ? "Office to schedule installation and assign crew."
        : officeProductionDraft.materialStatus === "Received"
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
    setOfficeProductionSaved(true);
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
      new URLSearchParams(window.location.search).get("access");

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

  const startOfficeProductionSetup = async (lead: any) => {
    setOfficeApprovedSetupError("");

    if (lead?._sample) {
      window.alert(
        "Sample production handoff preview only. No live data was changed."
      );
      return;
    }

    const accessToken =
      new URLSearchParams(window.location.search).get("access");

    if (!accessToken) {
      setOfficeApprovedSetupError("Premier staff access is missing.");
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

    if (!officeInspectionDraft.scheduledFor) {
      setOfficeInspectionError("Choose the inspection date and time.");
      return;
    }

    if (!officeInspectionDraft.assignedTo) {
      setOfficeInspectionError("Choose who is assigned.");
      return;
    }

    const accessToken =
      new URLSearchParams(window.location.search).get("access");

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
        p_inspection_type: officeInspectionDraft.type,
        p_scheduled_for: new Date(
          officeInspectionDraft.scheduledFor
        ).toISOString(),
        p_assigned_to: officeInspectionDraft.assignedTo,
      }
    );

    if (error || data !== true) {
      console.error("Premier inspection scheduling failed:", error);
      setOfficeInspectionError("Could not schedule inspection.");
      setOfficeInspectionSaving(false);
      return;
    }

    setLiveLeads((current) =>
      current.filter((item) => item.id !== lead.id)
    );

    setOfficeInspectionDraft({
      type: "Final Inspection",
      scheduledFor: "",
      assignedTo: "Gio",
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
        "Sample final measurement saved for preview only. No live data was changed."
      );
      setOfficeFinalMeasureSaved(true);
      return;
    }

    const accessToken =
      new URLSearchParams(window.location.search).get("access");

    if (!accessToken) {
      setOfficeApprovedSetupError("Premier staff access is missing.");
      return;
    }

    setOfficeFinalMeasureSaving(true);

    const scheduledFor =
      officeFinalMeasureDraft.status !== "not_scheduled" &&
      officeFinalMeasureDraft.scheduledFor
        ? new Date(officeFinalMeasureDraft.scheduledFor).toISOString()
        : null;

    const completedAt =
      officeFinalMeasureDraft.status === "complete" &&
      officeFinalMeasureDraft.completedDate
        ? new Date(
            `${officeFinalMeasureDraft.completedDate}T12:00:00`
          ).toISOString()
        : null;

    const { data, error } = await supabase.rpc(
      "save_premier_final_measurement",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
        p_status: officeFinalMeasureDraft.status,
        p_scheduled_for: scheduledFor,
        p_assigned_to: officeFinalMeasureDraft.assignedTo || null,
        p_completed_at: completedAt,
        p_note: officeFinalMeasureDraft.note || null,
      }
    );

    if (error || data !== true) {
      console.error("Premier final measurement save failed:", error);
      setOfficeApprovedSetupError(
        "Could not save the final measurement."
      );
      setOfficeFinalMeasureSaving(false);
      return;
    }

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
      new URLSearchParams(window.location.search).get("access");

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

  const assignLead = async (leadId: string, salesperson: string) => {
    const accessToken = new URLSearchParams(window.location.search).get("access");

    if (!accessToken) {
      window.alert("Premier staff access is missing.");
      return;
    }

    setSavingAssignmentId(leadId);

    const { data, error } = await supabase.rpc("assign_premier_lead", {
      p_access_token: accessToken,
      p_job_id: leadId,
      p_salesperson: salesperson,
    });

    if (error || data !== true) {
      console.error("Premier lead assignment failed:", error);
      window.alert("Could not assign this lead. Please try again.");
      setSavingAssignmentId(null);
      return;
    }

    setLiveLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              assigned_salesperson: salesperson,
              next_action: `${salesperson} to contact customer and schedule measurement.`,
            }
          : lead
      )
    );

    setAssigningLeadId(null);
    setSavingAssignmentId(null);
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
    const accessToken = new URLSearchParams(window.location.search).get("access");

    if (!accessToken) {
      window.alert("Premier staff access is missing.");
      return;
    }

    const draft = leadDrafts[lead.id] ?? {};

    const contactStatus =
      lead.source === "office_call"
        ? "contacted"
        : draft.contactStatus ?? lead.contact_status ?? "not_contacted";

    const measurementAppointment =
      draft.measurementAppointment ??
      (lead.measurement_appointment
        ? new Date(lead.measurement_appointment).toISOString().slice(0, 16)
        : "");

    const latestSalesNote =
      draft.latestSalesNote ?? lead.latest_sales_note ?? "";

    const salesperson =
      draft.salesperson ?? lead.assigned_salesperson ?? "";

    const nextStage =
      draft.nextStage ?? lead.current_stage ?? "new_lead";

    const person = salesperson || "Salesperson";

    let nextAction =
      `${person} to contact customer and schedule measurement.`;

    if (nextStage === "sales_follow_up") {
      nextAction = `${person} to follow up with customer.`;
    }

    if (nextStage === "measurement") {
      nextAction = measurementAppointment
        ? `${person} measurement scheduled for ${new Date(
            measurementAppointment
          ).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}.`
        : `${person} to schedule measurement.`;
    }

    if (nextStage === "proposal") {
      nextAction = `${person} to prepare or send proposal.`;
    }

    if (nextStage === "paused") {
      nextAction = "Lead paused. Follow up when ready.";
    }

    if (nextStage === "active_job") {
      nextAction = "Approved. Move into active job workflow.";
    }

    setSavingLeadDecisionId(lead.id);

    if (salesperson && salesperson !== lead.assigned_salesperson) {
      const { data: assignmentSaved, error: assignmentError } =
        await supabase.rpc("assign_premier_lead", {
          p_access_token: accessToken,
          p_job_id: lead.id,
          p_salesperson: salesperson,
        });

      if (assignmentError || assignmentSaved !== true) {
        console.error("Premier salesperson save failed:", assignmentError);
        window.alert("Could not save salesperson. Please try again.");
        setSavingLeadDecisionId(null);
        return;
      }
    }

    const { data, error } = await supabase.rpc(
      "save_premier_lead_decision",
      {
        p_access_token: accessToken,
        p_job_id: lead.id,
        p_contact_status: contactStatus,
        p_measurement_appointment: measurementAppointment
          ? new Date(measurementAppointment).toISOString()
          : null,
        p_latest_sales_note: latestSalesNote,
        p_next_action: nextAction,
        p_next_stage: nextStage,
      }
    );

    if (error || data !== true) {
      console.error("Premier lead decision save failed:", error);
      window.alert("Could not save the lead update. Please try again.");
      setSavingLeadDecisionId(null);
      return;
    }

    if (nextStage === "new_lead") {
      setLiveLeads((current) =>
        current.map((item) =>
          item.id === lead.id
            ? {
                ...item,
                assigned_salesperson: salesperson || null,
                contact_status: contactStatus,
                measurement_appointment: measurementAppointment
                  ? new Date(measurementAppointment).toISOString()
                  : null,
                latest_sales_note: latestSalesNote,
                next_action: nextAction,
                current_stage: nextStage,
              }
            : item
        )
      );
    } else {
      setLiveLeads((current) =>
        current.filter((item) => item.id !== lead.id)
      );
      setOpenLeadId(null);
    }

    setLeadDrafts((current) => {
      const next = { ...current };
      delete next[lead.id];
      return next;
    });

    setSavingLeadDecisionId(null);
  };
  const relayRevisedProposalToSales = async (lead: any) => {
    const accessToken = new URLSearchParams(window.location.search).get("access");

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
    const accessToken = new URLSearchParams(window.location.search).get("access");

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
  useEffect(() => {
    let active = true;

    const loadLiveLeads = async () => {
      setLiveLeadsLoading(true);

      const accessToken = new URLSearchParams(window.location.search).get("access");

      if (!accessToken) {
        console.warn("Premier staff access token missing.");
        setLiveLeads([]);
        setLiveLeadsLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("get_premier_office_inbox", {
        p_access_token: accessToken,
      });

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

    return () => {
      active = false;
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
            Live Board
          </h1>

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

        <section style={{ marginBottom: 22 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
              gap: 10,
            }}
          >
            {lanes.map((lane) => {
              const count = jobs.filter((job) => job.status === lane).length;

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
                    ‹
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
                    ›
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {liveLeadsLoading ? (
            <div style={{ color: "#9ca8b2", fontSize: 14 }}>
              Loading Office inbox...
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
              Office inbox is clear right now.
            </div>
          ) : (
            <div
              ref={liveLeadsScrollRef}
              style={{
                display: "flex",
                gap: 10,
                overflowX: "auto",
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                paddingBottom: 4,
                scrollbarWidth: "none",
              }}
            >
              {previewOfficeLeads.map((lead) => (
                <div
                  key={lead.id}
                  style={{
                    flex: "0 0 min(390px, 82vw)",
                    scrollSnapAlign: "start",
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
                      {lead.current_stage === "proposal_revision"                         ? "Needs Revision"                         : lead.current_stage === "proposal_approved"                         ? "Approved"                         : lead.current_stage === "proposal"                         ? "Measurements Complete"                         : lead.current_stage === "production_setup"                         ? "Production Setup"                         : lead.current_stage === "installation_complete"                         ? "Installation Complete"                         : lead.current_stage === "inspection_complete"                         ? "Inspection Complete"                         : "New Lead"}
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
                    Next:{" "}                     {lead.current_stage === "proposal_revision"                       ? "Review requested changes and update proposal"                       : lead.current_stage === "proposal_approved"                       ? (lead.next_action || "Collect deposit and schedule final measurement")                       : lead.current_stage === "proposal"                       ? "Prepare Proposal"                       : lead.next_action ||                         "Assign salesperson and contact customer."}
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

                        {lead.source !== "office_call" ? (                        <div>
                          <div
                            style={{
                              color: "#9ca8b2",
                              fontSize: 11,
                              fontWeight: 700,
                              marginBottom: 6,
                            }}
                          >
                            Contact Status
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                              gap: 6,
                            }}
                          >
                            {[
                              ["not_contacted", "Not Contacted"],
                              ["attempted", "Attempted"],
                              ["contacted", "Contacted"],
                            ].map(([value, label]) => {
                              const selected =
                                (leadDrafts[lead.id]?.contactStatus ??
                                  lead.contact_status ??
                                  "not_contacted") === value;

                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() =>
                                    setLeadDraftField(
                                      lead.id,
                                      "contactStatus",
                                      value
                                    )
                                  }
                                  style={{
                                    minHeight: 42,
                                    border: selected
                                      ? "1px solid #8fa9bc"
                                      : "1px solid #31495a",
                                    borderRadius: 9,
                                    background: selected
                                      ? "#20323f"
                                      : "#0c1116",
                                    color: selected
                                      ? "#f3f6f8"
                                      : "#9ca8b2",
                                    padding: "7px 5px",
                                    fontSize: 11,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                  }}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        ) : null}
                        <label>
                          <div
                            style={{
                              color: "#9ca8b2",
                              fontSize: 11,
                              fontWeight: 700,
                              marginBottom: 6,
                            }}
                          >
                            Measurement Appointment
                          </div>

                          <input
                            type="datetime-local"
                            value={
                              leadDrafts[lead.id]?.measurementAppointment ??
                              (lead.measurement_appointment
                                ? new Date(lead.measurement_appointment)
                                    .toISOString()
                                    .slice(0, 16)
                                : "")
                            }
                            onChange={(event) =>
                              setLeadDraftField(
                                lead.id,
                                "measurementAppointment",
                                event.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minHeight: 42,
                              boxSizing: "border-box",
                              border: "1px solid #31495a",
                              borderRadius: 9,
                              background: "#0c1116",
                              color: "#f3f6f8",
                              padding: "0 10px",
                              fontSize: 13,
                            }}
                          />
                        </label>

                        <label>
                          <div
                            style={{
                              color: "#9ca8b2",
                              fontSize: 11,
                              fontWeight: 700,
                              marginBottom: 6,
                            }}
                          >
                            Sales Note / Latest Update
                          </div>

                          <textarea
                            rows={3}
                            value={
                              leadDrafts[lead.id]?.latestSalesNote ??
                              lead.latest_sales_note ??
                              ""
                            }
                            onChange={(event) =>
                              setLeadDraftField(
                                lead.id,
                                "latestSalesNote",
                                event.target.value
                              )
                            }
                            placeholder="What happened on the call or follow-up?"
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              border: "1px solid #31495a",
                              borderRadius: 9,
                              background: "#0c1116",
                              color: "#f3f6f8",
                              padding: 10,
                              fontSize: 13,
                              fontFamily: "inherit",
                              resize: "vertical",
                            }}
                          />
                        </label>


                        <label>
                          <div
                            style={{
                              color: "#9ca8b2",
                              fontSize: 11,
                              fontWeight: 700,
                              marginBottom: 6,
                            }}
                          >
                            Move To
                          </div>

                          <select
                            value={
                              leadDrafts[lead.id]?.nextStage ??
                              lead.current_stage ??
                              "new_lead"
                            }
                            onChange={(event) =>
                              setLeadDraftField(
                                lead.id,
                                "nextStage",
                                event.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              minHeight: 42,
                              border: "1px solid #31495a",
                              borderRadius: 9,
                              background: "#0c1116",
                              color: "#f3f6f8",
                              padding: "0 10px",
                              fontSize: 13,
                            }}
                          >
                            <option value="new_lead">Keep in New Leads</option>
                            <option value="sales_follow_up">Sales Follow-Up</option>
                            <option value="measurement">Measurement</option>
                            <option value="proposal">Proposal</option>
                            <option value="paused">Paused</option>
                            <option value="active_job">Active Job</option>
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
                            : "Save Lead Update"}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {assigningLeadId === lead.id ? (
                    <div
                      style={{
                        display: "flex",
                        gap: 7,
                        flexWrap: "wrap",
                        marginTop: 12,
                      }}
                    >
                      {["Dennis Dillon", "Gio Richardson", "Gino Marquez"].map((salesperson) => (
                        <button
                          key={salesperson}
                          type="button"
                          disabled={savingAssignmentId === lead.id}
                          onClick={() => assignLead(lead.id, salesperson)}
                          style={{
                            border: "1px solid #486578",
                            borderRadius: 9,
                            background: "#16232d",
                            color: "#f3f6f8",
                            padding: "8px 12px",
                            fontSize: 12,
                            fontWeight: 800,
                            cursor:
                              savingAssignmentId === lead.id
                                ? "wait"
                                : "pointer",
                          }}
                        >
                          {savingAssignmentId === lead.id
                            ? "Saving..."
                            : salesperson}
                        </button>
                      ))}
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
                        if (                           lead.current_stage === "proposal" ||                           lead.current_stage === "proposal_revision" ||                           lead.current_stage === "proposal_approved" ||                           lead.current_stage === "production_setup" ||                           lead.current_stage === "installation_complete" ||                           lead.current_stage === "inspection_complete"                         ) {
                          setOfficeWorkLeadId((current) =>
                            current === lead.id ? null : lead.id
                          );
                          setOfficeWorkView(null);
                          setOpenLeadId(null);
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
                      {lead.current_stage === "proposal" ||                       lead.current_stage === "proposal_revision" ||                       lead.current_stage === "proposal_approved" ||                       lead.current_stage === "production_setup" ||                       lead.current_stage === "installation_complete" ||                       lead.current_stage === "inspection_complete"
                        ? officeWorkLeadId === lead.id
                          ? "Close Work"
                          : "Open Work"
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
                {officeWorkLead.current_stage === "proposal_revision"                   ? "NEEDS REVISION"                   : officeWorkLead.current_stage === "proposal_approved"                   ? "APPROVED"                   : officeWorkLead.current_stage === "production_setup"                   ? "PRODUCTION SETUP"                   : officeWorkLead.current_stage === "installation_complete"                   ? "INSTALLATION COMPLETE"                   : officeWorkLead.current_stage === "inspection_complete"                   ? "INSPECTION COMPLETE"                   : "MEASUREMENTS COMPLETE"}
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
              <strong>Next:</strong>{" "}               {officeWorkLead.current_stage === "proposal_revision"                 ? `Review requested changes, revise the proposal, and return it to ${                     officeWorkLead.assigned_salesperson || "Sales"                   }.`                 : officeWorkLead.current_stage === "proposal_approved"                 ? (officeWorkLead.next_action || "Collect deposit and schedule the final detailed measurement.")                 : officeWorkLead.current_stage === "production_setup"                 ? (officeWorkLead.next_action || "Office to start ordering/materials and permit setup.")                 : officeWorkLead.current_stage === "installation_complete"                 ? (officeWorkLead.next_action || "Office to schedule required inspection and final walkthrough.")                 : officeWorkLead.current_stage === "inspection_complete"                 ? (officeWorkLead.next_action || "Office to complete final walkthrough and close out the job.")                 : `Prepare proposal and return it to ${                     officeWorkLead.assigned_salesperson || "Sales"                   }.`}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 8,
              }}
            >
              {(officeWorkLead.current_stage === "proposal_revision"                 ? [                     ["Review Revision Request", "revision_request"],                     ["Proposal Workspace", "proposal"],                     ["Return to Sales", "relay"],                   ]                 : officeWorkLead.current_stage === "proposal_approved"                 ? [                     ["Approval Details", "approval_details"],                     ["Deposit", "deposit"],                     ["Final Measurement", "final_measurement"],                     ["Continue Job Setup", "continue_job"],                   ]                 : officeWorkLead.current_stage === "production_setup"                 ? [                     ["Production Setup", "production_setup"],                   ]                 : officeWorkLead.current_stage === "installation_complete"                 ? [["Schedule Inspection / Final Walkthrough", "inspection_schedule"]]                 : officeWorkLead.current_stage === "inspection_complete"                 ? [["Final Walkthrough / Closeout", "final_closeout"]]                 : [                     ["Review Measurements", "measurements"],                     ["Photos / Proof", "photos"],                     ["Proposal Workspace", "proposal"],                     ["Send Back to Sales", "relay"],                   ]               ).map(([label, view]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setOfficeWorkView(view as any);

                    if (view === "measurements" || view === "photos") {
                      void loadOfficeMeasurementReview(officeWorkLead);
                    }

                    if (
                      view === "deposit" ||
                      view === "final_measurement" ||
                      view === "continue_job"
                    ) {
                      void loadOfficeApprovedSetup(officeWorkLead);
                    }

                    if (view === "production_setup") {
                      void loadOfficeProductionSetup(officeWorkLead);
                    }
                  }}
                  style={{
                    minHeight: 46,
                    width: "100%",
                    border:
                      officeWorkView === view
                        ? "1px solid #6f91a7"
                        : "1px solid #31495a",
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
                  {label}
                </button>
              ))}
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
                                {opening.opening_type || "Opening"} ·{" "}
                                {opening.location || "Location not entered"}
                              </strong>

                              <span
                                style={{
                                  color: "#98a7b1",
                                  fontSize: 10,
                                }}
                              >
                                {opening.width_text || "—"} ×{" "}
                                {opening.height_text || "—"}
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
                                  Opening {opening.opening_number} ·{" "}
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
                        color: "#9db7ca",
                        fontSize: 9,
                        fontWeight: 900,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Deposit
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 10,
                      }}
                    >
                      Collect Customer Deposit
                    </strong>

                    {officeApprovedSetupLoading ? (
                      <div
                        style={{
                          color: "#9ca8b2",
                          fontSize: 11,
                          padding: "8px 0",
                        }}
                      >
                        Loading deposit details...
                      </div>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: 9,
                          }}
                        >
                          <label
                            style={{
                              display: "grid",
                              gap: 5,
                              color: "#9ca8b2",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            Status
                            <select
                              value={officeDepositDraft.status}
                              onChange={(event) => {
                                setOfficeDepositSaved(false);
                                setOfficeDepositDraft((current) => ({
                                  ...current,
                                  status: event.target.value,
                                }));
                              }}
                              style={{
                                minHeight: 42,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d141a",
                                color: "#ffffff",
                                padding: "0 10px",
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="received">Received</option>
                            </select>
                          </label>

                          <label
                            style={{
                              display: "grid",
                              gap: 5,
                              color: "#9ca8b2",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            Amount
                            <input
                              value={officeDepositDraft.amount}
                              onChange={(event) => {
                                setOfficeDepositSaved(false);
                                setOfficeDepositDraft((current) => ({
                                  ...current,
                                  amount: event.target.value,
                                }));
                              }}
                              placeholder="$0.00"
                              style={{
                                minHeight: 42,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d141a",
                                color: "#ffffff",
                                padding: "0 10px",
                              }}
                            />
                          </label>

                          <label
                            style={{
                              display: "grid",
                              gap: 5,
                              color: "#9ca8b2",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            Method
                            <select
                              value={officeDepositDraft.method}
                              onChange={(event) => {
                                setOfficeDepositSaved(false);
                                setOfficeDepositDraft((current) => ({
                                  ...current,
                                  method: event.target.value,
                                }));
                              }}
                              style={{
                                minHeight: 42,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d141a",
                                color: "#ffffff",
                                padding: "0 10px",
                              }}
                            >
                              <option value="">Select method</option>
                              <option value="Card">Card</option>
                              <option value="Check">Check</option>
                              <option value="Cash">Cash</option>
                              <option value="ACH">ACH / Bank</option>
                              <option value="Other">Other</option>
                            </select>
                          </label>

                          <label
                            style={{
                              display: "grid",
                              gap: 5,
                              color: "#9ca8b2",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            Received Date
                            <input
                              type="date"
                              disabled={
                                officeDepositDraft.status !== "received"
                              }
                              value={officeDepositDraft.receivedDate}
                              onChange={(event) => {
                                setOfficeDepositSaved(false);
                                setOfficeDepositDraft((current) => ({
                                  ...current,
                                  receivedDate: event.target.value,
                                }));
                              }}
                              style={{
                                minHeight: 42,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d141a",
                                color: "#ffffff",
                                padding: "0 10px",
                                opacity:
                                  officeDepositDraft.status === "received"
                                    ? 1
                                    : 0.55,
                              }}
                            />
                          </label>
                        </div>

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
                          Note
                          <textarea
                            value={officeDepositDraft.note}
                            onChange={(event) => {
                              setOfficeDepositSaved(false);
                              setOfficeDepositDraft((current) => ({
                                ...current,
                                note: event.target.value,
                              }));
                            }}
                            placeholder="Optional payment note..."
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

                        {officeDepositSaved ? (
                          <div
                            style={{
                              color: "#92c6a4",
                              fontSize: 10,
                              fontWeight: 900,
                              marginTop: 8,
                            }}
                          >
                            Deposit saved.
                          </div>
                        ) : null}

                        <button
                          type="button"
                          disabled={officeDepositSaving || officeDepositSaved}
                          onClick={() =>
                            void saveOfficeDeposit(officeWorkLead)
                          }
                          style={{
                            width: "100%",
                            minHeight: 44,
                            marginTop: 10,
                            border: "1px solid #557c64",
                            borderRadius: 9,
                            background: "#14271c",
                            color: "#b7dec4",
                            fontWeight: 900,
                            cursor: officeDepositSaving
                              ? "wait"
                              : "pointer",
                            opacity: officeDepositSaving || officeDepositSaved ? 0.72 : 1,
                          }}
                        >
                          {officeDepositSaving                             ? "Saving..."                             : officeDepositSaved                             ? "Deposit Saved ✓"                             : "Save Deposit"}
                        </button>
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
                        marginBottom: 10,
                      }}
                    >
                      Schedule Final Detailed Measure
                    </strong>

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
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: 9,
                          }}
                        >
                          <label
                            style={{
                              display: "grid",
                              gap: 5,
                              color: "#9ca8b2",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            Status
                            <select
                              value={officeFinalMeasureDraft.status}
                              onChange={(event) => {
                                setOfficeFinalMeasureSaved(false);
                                setOfficeFinalMeasureDraft((current) => ({
                                  ...current,
                                  status: event.target.value,
                                }));
                              }}
                              style={{
                                minHeight: 42,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d141a",
                                color: "#ffffff",
                                padding: "0 10px",
                              }}
                            >
                              <option value="not_scheduled">
                                Not Scheduled
                              </option>
                              <option value="scheduled">Scheduled</option>
                              <option value="complete">Complete</option>
                            </select>
                          </label>

                          <label
                            style={{
                              display: "grid",
                              gap: 5,
                              color: "#9ca8b2",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            Scheduled Date / Time
                            <input
                              type="datetime-local"
                              disabled={
                                officeFinalMeasureDraft.status ===
                                "not_scheduled"
                              }
                              value={officeFinalMeasureDraft.scheduledFor}
                              onChange={(event) => {
                                setOfficeFinalMeasureSaved(false);
                                setOfficeFinalMeasureDraft((current) => ({
                                  ...current,
                                  scheduledFor: event.target.value,
                                }));
                              }}
                              style={{
                                minHeight: 42,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d141a",
                                color: "#ffffff",
                                padding: "0 10px",
                                opacity:
                                  officeFinalMeasureDraft.status ===
                                  "not_scheduled"
                                    ? 0.55
                                    : 1,
                              }}
                            />
                          </label>

                          <label
                            style={{
                              display: "grid",
                              gap: 5,
                              color: "#9ca8b2",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            Assigned To
                            <select
                              value={officeFinalMeasureDraft.assignedTo}
                              onChange={(event) => {
                                setOfficeFinalMeasureSaved(false);
                                setOfficeFinalMeasureDraft((current) => ({
                                  ...current,
                                  assignedTo: event.target.value,
                                }));
                              }}
                              style={{
                                minHeight: 42,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d141a",
                                color: "#ffffff",
                                padding: "0 10px",
                              }}
                            >
                              <option value="">Choose staff member</option>
                              <option value="Gino">Gino</option>
                              <option value="Dennis">Dennis</option>
                              <option value="Gio">Gio</option>
                            </select>
                          </label>

                          <label
                            style={{
                              display: "grid",
                              gap: 5,
                              color: "#9ca8b2",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            Completed Date
                            <input
                              type="date"
                              disabled={
                                officeFinalMeasureDraft.status !==
                                "complete"
                              }
                              value={officeFinalMeasureDraft.completedDate}
                              onChange={(event) => {
                                setOfficeFinalMeasureSaved(false);
                                setOfficeFinalMeasureDraft((current) => ({
                                  ...current,
                                  completedDate: event.target.value,
                                }));
                              }}
                              style={{
                                minHeight: 42,
                                border: "1px solid #405c6d",
                                borderRadius: 9,
                                background: "#0d141a",
                                color: "#ffffff",
                                padding: "0 10px",
                                opacity:
                                  officeFinalMeasureDraft.status ===
                                  "complete"
                                    ? 1
                                    : 0.55,
                              }}
                            />
                          </label>
                        </div>

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
                          Note
                          <textarea
                            value={officeFinalMeasureDraft.note}
                            onChange={(event) => {
                              setOfficeFinalMeasureSaved(false);
                              setOfficeFinalMeasureDraft((current) => ({
                                ...current,
                                note: event.target.value,
                              }));
                            }}
                            placeholder="Optional final-measure note..."
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

                        <div
                          style={{
                            color: "#748694",
                            fontSize: 10,
                            lineHeight: 1.4,
                            marginTop: 8,
                          }}
                        >
                          The original rough measurements stay preserved.
                          Final detailed measurements remain a separate record.
                        </div>

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
                            Final measurement saved.
                          </div>
                        ) : null}

                        <button
                          type="button"
                          disabled={
                            officeFinalMeasureSaving ||
                            officeFinalMeasureSaved
                          }
                          onClick={() =>
                            void saveOfficeFinalMeasurement(
                              officeWorkLead
                            )
                          }
                          style={{
                            width: "100%",
                            minHeight: 44,
                            marginTop: 10,
                            border: "1px solid #557c64",
                            borderRadius: 9,
                            background: "#14271c",
                            color: "#b7dec4",
                            fontWeight: 900,
                            cursor:
                              officeFinalMeasureSaving ||
                              officeFinalMeasureSaved
                                ? "default"
                                : "pointer",
                            opacity:
                              officeFinalMeasureSaving ||
                              officeFinalMeasureSaved
                                ? 0.72
                                : 1,
                          }}
                        >
                          {officeFinalMeasureSaving
                            ? "Saving..."
                            : officeFinalMeasureSaved
                            ? "Final Measurement Saved ✓"
                            : "Save Final Measurement"}
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
                                ? "Received ✓"
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
                                ? "Complete ✓"
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
                              disabled={officeProductionStarting}
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
                      Final Walkthrough / Closeout
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 10,
                      }}
                    >
                      Ready to Close Job
                    </strong>

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
                        <strong>Inspection:</strong> Complete
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
                        Status: Ready to close
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        const accessToken =
                          new URLSearchParams(window.location.search).get("access");

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
                            current.filter((item) => item.id !== officeWorkLead.id)
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
                      Complete Job
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
                      Inspection / Final Walkthrough
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 10,
                      }}
                    >
                      Office Inspection Scheduling
                    </strong>

                    <div style={{ display: "grid", gap: 10 }}>
                      <label style={{ display: "grid", gap: 5 }}>
                        <span style={{ color: "#9ca8b2", fontSize: 10 }}>
                          Inspection Type
                        </span>
                        <select
                          value={officeInspectionDraft.type}
                          onChange={(event) =>
                            setOfficeInspectionDraft((current) => ({
                              ...current,
                              type: event.target.value,
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
                          <option>In-Progress Inspection</option>
                          <option>Final Inspection</option>
                        </select>
                      </label>

                      <label style={{ display: "grid", gap: 5 }}>
                        <span style={{ color: "#9ca8b2", fontSize: 10 }}>
                          Date / Time
                        </span>
                        <input
                          type="datetime-local"
                          value={officeInspectionDraft.scheduledFor}
                          onChange={(event) =>
                            setOfficeInspectionDraft((current) => ({
                              ...current,
                              scheduledFor: event.target.value,
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
                          Assigned To
                        </span>
                        <select
                          value={officeInspectionDraft.assignedTo}
                          onChange={(event) =>
                            setOfficeInspectionDraft((current) => ({
                              ...current,
                              assignedTo: event.target.value,
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
                          <option>Gio</option>
                          <option>Crew 1</option>
                          <option>Crew 2</option>
                          <option>Crew 3</option>
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

                {officeWorkView === "production_setup" ? (
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
                      Production Setup
                    </div>

                    <strong
                      style={{
                        display: "block",
                        fontSize: 14,
                        marginBottom: 10,
                      }}
                    >
                      Office Production Setup
                    </strong>

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
                            Materials / Order Status
                          </span>

                          <select
                            value={officeProductionDraft.materialStatus}
                            onChange={(event) => {
                              setOfficeProductionSaved(false);
                              setOfficeProductionDraft((current) => ({
                                ...current,
                                materialStatus: event.target.value,
                              }));
                            }}
                            style={{
                              width: "100%",
                              minHeight: 44,
                              border: "1px solid #31495a",
                              borderRadius: 9,
                              background: "#0c1116",
                              color: "#f3f6f8",
                              padding: "0 10px",
                            }}
                          >
                            <option value="Not ordered">Not ordered</option>
                            <option value="Ordered">Ordered</option>
                            <option value="In production">In production</option>
                            <option value="Received">Received</option>
                          </select>
                        </label>

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
                            Permit Status
                          </span>

                          <select
                            value={officeProductionDraft.permitStatus}
                            onChange={(event) => {
                              setOfficeProductionSaved(false);
                              setOfficeProductionDraft((current) => ({
                                ...current,
                                permitStatus: event.target.value,
                              }));
                            }}
                            style={{
                              width: "100%",
                              minHeight: 44,
                              border: "1px solid #31495a",
                              borderRadius: 9,
                              background: "#0c1116",
                              color: "#f3f6f8",
                              padding: "0 10px",
                            }}
                          >
                            <option value="Not started">Not started</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Approved">Approved</option>
                            <option value="Not required">Not required</option>
                          </select>
                        </label>

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
                            ? "Production Setup Saved ✓"
                            : "Save Production Setup"}
                        </button>

                        {officeProductionDraft.materialStatus === "Received" &&
                        ["Approved", "Not required"].includes(
                          officeProductionDraft.permitStatus
                        ) ? (
                          <div
                            style={{
                              marginTop: 14,
                              paddingTop: 14,
                              borderTop: "1px solid #26313a",
                            }}
                          >
                            <div
                              style={{
                                color: "#9db7ca",
                                fontSize: 10,
                                fontWeight: 900,
                                letterSpacing: 0.8,
                                textTransform: "uppercase",
                                marginBottom: 10,
                              }}
                            >
                              Installation Scheduling
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
                                Crew
                              </span>

                              <select
                                value={officeInstallDraft.crew}
                                onChange={(event) => {
                                  setOfficeInstallSaved(false);
                                  setOfficeInstallDraft((current) => ({
                                    ...current,
                                    crew: event.target.value,
                                  }));
                                }}
                                style={{
                                  width: "100%",
                                  minHeight: 44,
                                  border: "1px solid #31495a",
                                  borderRadius: 9,
                                  background: "#0c1116",
                                  color: "#f3f6f8",
                                  padding: "0 10px",
                                }}
                              >
                                <option value="">Choose crew</option>
                                <option value="RJ">RJ</option>
                                <option value="Exquisite Windows & Doors — Angel">Exquisite Windows & Doors — Angel</option>
                                <option value="Riveras Impact Windows and Doors — Jose">Riveras Impact Windows and Doors — Jose</option>
                                <option value="OGR Windows and Doors — Obelio">OGR Windows and Doors — Obelio</option>
                                <option value="Elite Impact Solutions — Joseph">Elite Impact Solutions — Joseph</option>
                              </select>
                            </label>

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
                                Install Date / Time
                              </span>

                              <input
                                type="datetime-local"
                                value={officeInstallDraft.scheduledFor}
                                onChange={(event) => {
                                  setOfficeInstallSaved(false);
                                  setOfficeInstallDraft((current) => ({
                                    ...current,
                                    scheduledFor: event.target.value,
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

                            {officeInstallError ? (
                              <div
                                style={{
                                  color: "#d8b267",
                                  fontSize: 10,
                                  marginBottom: 8,
                                }}
                              >
                                {officeInstallError}
                              </div>
                            ) : null}

                            <button
                              type="button"
                              disabled={officeInstallSaving || officeInstallSaved}
                              onClick={() =>
                                void saveOfficeInstallSchedule(officeWorkLead)
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
                                  officeInstallSaving || officeInstallSaved
                                    ? "default"
                                    : "pointer",
                                opacity:
                                  officeInstallSaving || officeInstallSaved
                                    ? 0.72
                                    : 1,
                              }}
                            >
                              {officeInstallSaving
                                ? "Saving..."
                                : officeInstallSaved
                                ? "Installation Scheduled ✓"
                                : "Save Schedule"}
                            </button>
                          </div>
                        ) : null}
                      </>
                    )}
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

            <button
              type="button"
              onClick={() => {
                setOfficeWorkLeadId(null);
                setOfficeWorkView(null);
              }}
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
                    <div>✓ Owner signature</div>
                    <div>✓ Contractor signature</div>
                    <div>✓ Application</div>
                    <div>✓ Product approvals</div>
                    <div>✓ Permit approved</div>
                    <div>○ In-progress inspection</div>
                    <div>○ Final inspection</div>
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



























