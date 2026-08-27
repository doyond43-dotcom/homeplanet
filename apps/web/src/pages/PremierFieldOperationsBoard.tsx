import { useMemo, useState } from "react";

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
    scheduled: "Today · 3:30 PM",
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
    serviceAppointment: "Today · 3:30 PM",
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

export default function PremierFieldOperationsBoard() {
  const [activeJobId, setActiveJobId] = useState("PW-1037");
  const [crewChanges, setCrewChanges] = useState<Record<string, string>>({});
  const [scheduleChanges, setScheduleChanges] = useState<Record<string, string>>({});
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false);
  const [scheduleDraftDate, setScheduleDraftDate] = useState("");
  const [scheduleDraftTime, setScheduleDraftTime] = useState("");
  const [updates, setUpdates] = useState<
    { jobId: string; time: string; text: string }[]
  >([]);

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
      reportedAt: "Aug 26 · 5:16 PM",
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
          maxWidth: 1450,
          margin: "0 auto",
          padding: "26px 16px 70px",
        }}
      >
        <header style={{ marginBottom: 22 }}>
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
              fontSize: "clamp(30px, 5vw, 48px)",
              lineHeight: 1,
            }}
          >
            Field Operations
          </h1>

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

        <div
          style={{
            display: "flex",
            gap: 9,
            overflowX: "auto",
            paddingBottom: 10,
            marginBottom: 16,
          }}
        >
          {lanes.map((lane) => {
            const count =
              lane === "Punch-Out / Needs Attention"
                ? punchOuts.filter((item) => item.status !== "Resolved").length
                : jobs.filter((job) => job.status === lane).length;

            return (
              <div
                key={lane}
                style={{
                  minWidth: 150,
                  border: "1px solid #26323a",
                  borderRadius: 13,
                  background: "#101419",
                  padding: "11px 13px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#969fa6",
                    marginBottom: 4,
                  }}
                >
                  {lane}
                </div>
                <strong style={{ fontSize: 21 }}>{count}</strong>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 420px) minmax(0, 1fr)",
            gap: 16,
            alignItems: "start",
          }}
          className="field-layout"
        >
          <div style={{ display: "grid", gap: 10 }}>
            {jobs.map((job) => {
              const crew = crewChanges[job.id] ?? job.crew;
              const schedule = scheduleChanges[job.id] ?? job.scheduled;
              const openPunchOutCount = punchOuts.filter(
                (item) => item.jobId === job.id && item.status !== "Resolved"
              ).length;

              return (
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
                        : "1px solid #252f36",
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
                      {openPunchOutCount > 0 ? "Needs Attention" : job.status}
                    </span>
                  </div>

                  <div
                    style={{
                      color: "#9fa8af",
                      fontSize: 12,
                      marginBottom: 10,
                    }}
                  >
                    {job.address}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 7,
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <strong>Crew:</strong> {crew}
                    </div>
                    <div>
                      <strong>Phase:</strong> {job.phase}
                    </div>
                    <div>
                      <strong>ETA:</strong> {job.materialEta}
                    </div>
                    <div>
                      <strong>Schedule:</strong> {schedule}
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #29323a",
                      marginTop: 11,
                      paddingTop: 10,
                      color: "#d7dde2",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "#8fa9bc" }}>Next:</span>{" "}
                    {openPunchOutCount > 0
                      ? `Clear ${openPunchOutCount} punch-out item${
                          openPunchOutCount === 1 ? "" : "s"
                        }`
                      : job.nextAction}
                  </div>
                </button>
              );
            })}
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
                marginBottom: 16,
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
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {activeJob.phase}
              </span>
            </div>

            {hasOpenPunchOut ? (
              <section
                style={{
                  border: "1px solid #5b432b",
                  background: "#1d160f",
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
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
                        color: "#d7b37c",
                        fontSize: 11,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Punch-Out · Needs Attention
                    </div>

                    <div
                      style={{
                        color: "#a99d90",
                        fontSize: 11,
                        marginTop: 3,
                      }}
                    >
                      {activePunchOuts.length} unresolved item
                      {activePunchOuts.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  <span
                    style={{
                      border: "1px solid #684c30",
                      borderRadius: 999,
                      padding: "5px 8px",
                      color: "#e6c99f",
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    STAYS OPEN
                  </span>
                </div>

                <div style={{ display: "grid", gap: 8 }}>
                  {activePunchOuts.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        border: "1px solid #443528",
                        borderRadius: 11,
                        background: "#15110d",
                        padding: 11,
                      }}
                    >
                      <strong style={{ fontSize: 13 }}>
                        {item.opening} · {item.type}
                      </strong>

                      <div
                        style={{
                          marginTop: 5,
                          color: "#e2ddd7",
                          fontSize: 13,
                        }}
                      >
                        {item.issue}
                      </div>

                      <div
                        style={{
                          marginTop: 6,
                          color: "#968b80",
                          fontSize: 10,
                        }}
                      >
                        Reported by {item.reportedBy} · {item.reportedAt}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        <div
                          style={{
                            color: item.owner ? "#9fb9cb" : "#d7b37c",
                            fontSize: 11,
                            fontWeight: 900,
                          }}
                        >
                          {item.owner
                            ? `Owned by ${item.owner} · Still unresolved`
                            : "Needs ownership"}
                        </div>

                        {!item.owner ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPunchOuts((current) =>
                                current.map((punchOut) =>
                                  punchOut.id === item.id
                                    ? {
                                        ...punchOut,
                                        owner: "Gio",
                                        status: "Owned",
                                      }
                                    : punchOut
                                )
                              );

                              addUpdate(
                                `Gio took ownership of punch-out: ${item.type} · ${item.opening}.`
                              );
                            }}
                            style={{
                              border: "1px solid #536c58",
                              borderRadius: 9,
                              background: "#1a2a36",
                              color: "#fff",
                              padding: "8px 10px",
                              fontSize: 11,
                              fontWeight: 900,
                              cursor: "pointer",
                            }}
                          >
                            Take Ownership
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
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
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: 8,
                marginBottom: 12,
              }}
              className="field-summary-grid"
            >
              {[
                ["Crew", effectiveCrew],
                ["Material ETA", activeJob.materialEta],
                ["Permit", activeJob.permit],
                ["Schedule", effectiveSchedule],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    border: "1px solid #28323a",
                    borderRadius: 12,
                    padding: 11,
                    background: "#101419",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#929ba2",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <strong style={{ fontSize: 12 }}>{value}</strong>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 8,
                marginBottom: 12,
              }}
              className="field-action-grid"
            >
              <button
                type="button"
                onClick={() => {
                  const crew = window.prompt(
                    "Assign crew: Crew 1, Crew 2, Crew 3, or Not assigned",
                    effectiveCrew
                  );

                  if (!crew?.trim()) return;

                  setCrewChanges((current) => ({
                    ...current,
                    [activeJob.id]: crew.trim(),
                  }));

                  addUpdate(`Crew changed to ${crew.trim()}.`);
                }}
                style={{
                  minHeight: 44,
                  border: "1px solid #344958",
                  borderRadius: 11,
                  background: "#111820",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Assign Crew
              </button>

              <button
                type="button"
                onClick={() => {
                  setScheduleDraftDate("");
                  setScheduleDraftTime("");
                  setScheduleDrawerOpen((open) => !open);
                }}
                style={{
                  minHeight: 44,
                  border: "1px solid #344958",
                  borderRadius: 11,
                  background: "#111820",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Schedule
              </button>

              <button
                type="button"
                onClick={() => {
                  window.open(
                    "/planet/premier-window-door/board",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                style={{
                  minHeight: 44,
                  border: "1px solid #344958",
                  borderRadius: 11,
                  background: "#111820",
                  color: "#fff",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Open Full Job
              </button>
            </div>

            
            {scheduleDrawerOpen ? (
  
            <section
                style={{
                  border: "1px solid #344958",
                  borderRadius: 14,
                  background: "#10161b",
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 17 }}>Schedule Job</strong>

                    <div
                      style={{
                        color: "#d6dde2",
                        fontSize: 13,
                        fontWeight: 700,
                        marginTop: 5,
                      }}
                    >
                      {activeJob.customer} · {effectiveCrew}
                    </div>

                    <div
                      style={{
                        color: "#89969f",
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      Currently scheduled:{" "}
                      <strong style={{ color: "#cbd5dc" }}>
                        {effectiveSchedule}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setScheduleDrawerOpen(false)}
                    style={{
                      border: "1px solid #2e3b44",
                      borderRadius: 8,
                      background: "#151b20",
                      color: "#aab5bd",
                      minWidth: 34,
                      minHeight: 34,
                      cursor: "pointer",
                      fontWeight: 900,
                    }}
                    aria-label="Close schedule"
                  >
                    ×
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 10,
                  }}
                  className="schedule-drawer-grid"
                >
                  <label
                    style={{
                      display: "grid",
                      gap: 6,
                      color: "#9baab4",
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    Date

                    <input
                      type="text"
                      value={scheduleDraftDate}
                      onChange={(event) => {
                        const digits = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 8);

                        let formatted = digits;

                        if (digits.length > 4) {
                          formatted = `${digits.slice(0, 2)}/${digits.slice(
                            2,
                            4
                          )}/${digits.slice(4)}`;
                        } else if (digits.length > 2) {
                          formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
                        }

                        setScheduleDraftDate(formatted);
                      }}
                      placeholder=""
                      style={{
                        width: "100%",
                        minHeight: 44,
                        boxSizing: "border-box",
                        border: "1px solid #344650",
                        borderRadius: 10,
                        background: "#0c1116",
                        color: "#fff",
                        padding: "0 12px",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                    <div
                      style={{
                        color: "#78858e",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      Type 08282026 → 08/28/2026
                    </div>
                  </label>

                  <label
                    style={{
                      display: "grid",
                      gap: 6,
                      color: "#9baab4",
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    Time

                    <input
                      type="text"
                      value={scheduleDraftTime}
                      onChange={(event) => {
                        const raw = event.target.value
                          .toUpperCase()
                          .replace(/\s/g, "");

                        const meridiem = raw.includes("P")
                          ? "PM"
                          : raw.includes("A")
                            ? "AM"
                            : "";

                        const digits = raw.replace(/\D/g, "").slice(0, 4);

                        let formatted = digits;

                        if (digits.length === 3) {
                          formatted = `${digits.slice(0, 1)}:${digits.slice(1)}`;
                        } else if (digits.length === 4) {
                          formatted = `${digits.slice(0, 2)}:${digits.slice(2)}`;
                        }

                        if (meridiem && digits.length >= 3) {
                          formatted = `${formatted} ${meridiem}`;
                        }

                        setScheduleDraftTime(formatted);
                      }}
                      placeholder=""
                      style={{
                        width: "100%",
                        minHeight: 44,
                        boxSizing: "border-box",
                        border: "1px solid #344650",
                        borderRadius: 10,
                        background: "#0c1116",
                        color: "#fff",
                        padding: "0 12px",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                    <div
                      style={{
                        color: "#78858e",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      Type 900a → 9:00 AM
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const date = scheduleDraftDate.trim();
                    const time = scheduleDraftTime.trim();

                    if (!date) return;

                    const isAlreadyScheduled =
                      effectiveSchedule !== "Pending material" &&
                      effectiveSchedule !== "Not scheduled";

                    const nextSchedule = time
                      ? `${date} · ${time}`
                      : date;

                    setScheduleChanges((current) => ({
                      ...current,
                      [activeJob.id]: nextSchedule,
                    }));

                    addUpdate(
                      isAlreadyScheduled
                        ? `Schedule moved to ${nextSchedule}.`
                        : `Job scheduled for ${nextSchedule}.`
                    );

                    setScheduleDrawerOpen(false);
                  }}
                  style={{
                    width: "100%",
                    minHeight: 44,
                    marginTop: 12,
                    border: "1px solid #405c6d",
                    borderRadius: 10,
                    background: "#1a2a36",
                    color: "#fff",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Save Schedule
                </button>

                {effectiveSchedule !== "Pending material" &&
                effectiveSchedule !== "Not scheduled" ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#84919a",
                      fontSize: 11,
                      marginTop: 8,
                    }}
                  >
                    Saving a new date will reschedule the current job.
                  </div>
                ) : null}
              </section>
            ) : null}
            {activeJob.workType === "Service Call" ? (
              <section
                style={{
                  border: "1px solid #3b5260",
                  borderRadius: 15,
                  background: "#11191f",
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 17 }}>Service Call</strong>

                    <div
                      style={{
                        color: "#8f9da7",
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      {activeJob.serviceAppointment}
                    </div>
                  </div>

                  <span
                    style={{
                      border: "1px solid #405c6d",
                      borderRadius: 999,
                      background: "#1a2a36",
                      color: "#dce7ee",
                      padding: "5px 9px",
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    GIO SERVICE
                  </span>
                </div>

                <div
                  style={{
                    border: "1px solid #283740",
                    borderRadius: 11,
                    background: "#0d1318",
                    padding: 12,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      color: "#91a2ad",
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      marginBottom: 5,
                    }}
                  >
                    Customer Reported
                  </div>

                  <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                    {activeJob.serviceIssue}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 8,
                  }}
                  className="service-action-grid"
                >
                  <button
                    type="button"
                    onClick={() => {
                      const finding = window.prompt("What did you find?");

                      if (!finding?.trim()) return;

                      addUpdate(`Service finding: ${finding.trim()}`);
                    }}
                    style={{
                      minHeight: 44,
                      border: "1px solid #405c6d",
                      borderRadius: 10,
                      background: "#182630",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    What I Found
                  </button>

                  <label
                    style={{
                      minHeight: 44,
                      border: "1px solid #405c6d",
                      borderRadius: 10,
                      background: "#182630",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Add Photo

                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (!file) return;

                        addUpdate(`Service photo added: ${file.name}.`);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const work = window.prompt(
                        "What work did you perform?"
                      );

                      if (!work?.trim()) return;

                      addUpdate(`Service work performed: ${work.trim()}`);
                    }}
                    style={{
                      minHeight: 44,
                      border: "1px solid #405c6d",
                      borderRadius: 10,
                      background: "#182630",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Work Performed
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const parts = window.prompt(
                        "Parts or material needed? Leave blank if none."
                      );

                      if (parts === null) return;

                      addUpdate(
                        parts.trim()
                          ? `Parts needed: ${parts.trim()}`
                          : "No additional parts needed."
                      );
                    }}
                    style={{
                      minHeight: 44,
                      border: "1px solid #405c6d",
                      borderRadius: 10,
                      background: "#182630",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Parts Needed
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const followUp = window.prompt(
                        "What follow-up is needed?"
                      );

                      if (!followUp?.trim()) return;

                      addUpdate(`Service follow-up: ${followUp.trim()}`);
                    }}
                    style={{
                      minHeight: 44,
                      border: "1px solid #5a4e36",
                      borderRadius: 10,
                      background: "#241f16",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Follow-up
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Complete this service call?"
                      );

                      if (!confirmed) return;

                      addUpdate("Service call completed.");
                    }}
                    style={{
                      minHeight: 44,
                      border: "1px solid #486578",
                      borderRadius: 10,
                      background: "#1a2a36",
                      color: "#fff",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Complete Service
                  </button>
                </div>
              </section>
            ) : null}


            {activeJob.workType === "Service Call" ? (
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <details
                  style={{
                    border: "1px solid #293740",
                    borderRadius: 12,
                    background: "#10161b",
                    padding: 12,
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 850,
                      color: "#f1f4f6",
                    }}
                  >
                    Agreement / Job Truth
                  </summary>

                  <div
                    style={{
                      marginTop: 12,
                      display: "grid",
                      gap: 10,
                      fontSize: 13,
                      lineHeight: 1.5,
                      color: "#d4dbe0",
                    }}
                  >
                    <div>
                      <strong>Approved:</strong> {activeJob.approvedScope}
                    </div>

                    <div>
                      <strong>Customer:</strong> {activeJob.customerTruth}
                    </div>

                    <div>
                      <strong>Agreement:</strong> {activeJob.signedAgreement}
                    </div>
                  </div>
                </details>

                <details
                  style={{
                    border: "1px solid #293740",
                    borderRadius: 12,
                    background: "#10161b",
                    padding: 12,
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 850,
                      color: "#f1f4f6",
                    }}
                  >
                    Measurements / Product Info
                  </summary>

                  <div
                    style={{
                      marginTop: 12,
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    {activeJob.measurements.map((item) => (
                      <div
                        key={`${item.name}-${item.location}`}
                        style={{
                          border: "1px solid #26323a",
                          borderRadius: 9,
                          padding: 10,
                          fontSize: 13,
                        }}
                      >
                        <strong>{item.name}</strong>

                        <div
                          style={{
                            color: "#aeb8bf",
                            marginTop: 3,
                          }}
                        >
                          {item.location} · {item.measurement}
                        </div>
                      </div>
                    ))}

                    <div
                      style={{
                        color: "#9ba6ad",
                        fontSize: 12,
                      }}
                    >
                      {activeJob.manufacturerPo}
                    </div>
                  </div>
                </details>

                <details
                  style={{
                    border: "1px solid #293740",
                    borderRadius: 12,
                    background: "#10161b",
                    padding: 12,
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 850,
                      color: "#f1f4f6",
                    }}
                  >
                    History
                  </summary>

                  <div
                    style={{
                      marginTop: 12,
                      display: "grid",
                      gap: 9,
                    }}
                  >
                    {updates
                      .filter((item) => item.jobId === activeJob.id)
                      .map((item, index) => (
                        <div
                          key={`${item.time}-${index}`}
                          style={{
                            borderLeft: "2px solid #6f93aa",
                            paddingLeft: 9,
                          }}
                        >
                          <div
                            style={{
                              color: "#8fa9bc",
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            {item.time}
                          </div>

                          <div
                            style={{
                              color: "#dce2e6",
                              fontSize: 13,
                              marginTop: 2,
                            }}
                          >
                            {item.text}
                          </div>
                        </div>
                      ))}

                    {updates.filter(
                      (item) => item.jobId === activeJob.id
                    ).length === 0 ? (
                      <div
                        style={{
                          color: "#7f8c95",
                          fontSize: 12,
                        }}
                      >
                        No service activity recorded yet.
                      </div>
                    ) : null}
                  </div>
                </details>
              </div>
            ) : null}
<section
              style={{
                display:
                  activeJob.workType === "Service Call" ? "none" : "block",
                border: "1px solid #31434d",
                borderRadius: 15,
                background: "#11181e",
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <strong>Agreement Truth</strong>

                <span
                  style={{
                    color: "#8fa9bc",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  Same truth for office + field
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 10,
                }}
                className="agreement-grid"
              >
                <div
                  style={{
                    border: "1px solid #29353e",
                    borderRadius: 11,
                    padding: 11,
                  }}
                >
                  <div
                    style={{
                      color: "#91a2ad",
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      marginBottom: 5,
                    }}
                  >
                    Approved Scope
                  </div>

                  <strong style={{ fontSize: 13 }}>
                    {activeJob.approvedScope}
                  </strong>
                </div>

                <div
                  style={{
                    border: "1px solid #29353e",
                    borderRadius: 11,
                    padding: 11,
                  }}
                >
                  <div
                    style={{
                      color: "#91a2ad",
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      marginBottom: 5,
                    }}
                  >
                    Signed Agreement
                  </div>

                  <strong style={{ fontSize: 13 }}>
                    {activeJob.signedAgreement}
                  </strong>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginTop: 10,
                }}
                className="agreement-grid"
              >
                <div>
                  <div
                    style={{
                      color: "#9fb9cb",
                      fontSize: 11,
                      fontWeight: 900,
                      marginBottom: 6,
                    }}
                  >
                    Promised / Included
                  </div>

                  <div style={{ display: "grid", gap: 4, fontSize: 13 }}>
                    {activeJob.promisedIncluded.map((item) => (
                      <div key={item}>✓ {item}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      color: "#d9b982",
                      fontSize: 11,
                      fontWeight: 900,
                      marginBottom: 6,
                    }}
                  >
                    Not Included
                  </div>

                  <div style={{ display: "grid", gap: 4, fontSize: 13 }}>
                    {activeJob.notIncluded.map((item) => (
                      <div key={item}>— {item}</div>
                    ))}
                  </div>
                </div>
              </div>

              {activeJob.approvedChanges.length > 0 ? (
                <div
                  style={{
                    borderTop: "1px solid #29353e",
                    marginTop: 11,
                    paddingTop: 10,
                  }}
                >
                  <div
                    style={{
                      color: "#8fa9bc",
                      fontSize: 11,
                      fontWeight: 900,
                      marginBottom: 6,
                    }}
                  >
                    Approved Changes
                  </div>

                  <div style={{ display: "grid", gap: 4, fontSize: 13 }}>
                    {activeJob.approvedChanges.map((item) => (
                      <div key={item}>✓ {item}</div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div
                style={{
                  borderTop: "1px solid #29353e",
                  marginTop: 11,
                  paddingTop: 10,
                  color: "#aeb8bf",
                  fontSize: 12,
                }}
              >
                <strong style={{ color: "#dfe5e9" }}>Last confirmed:</strong>{" "}
                {activeJob.lastConfirmed}
              </div>
            </section>

            <div
              style={{
                display:
                  activeJob.workType === "Service Call" ? "none" : "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                marginBottom: 12,
              }}
              className="field-main-grid"
            >
              <section
                style={{
                  border: "1px solid #27333b",
                  borderRadius: 15,
                  background: "#10151a",
                  padding: 14,
                }}
              >
                <strong>Customer / Job Truth</strong>

                <div
                  style={{
                    marginTop: 10,
                    color: "#d3d9de",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {activeJob.customerTruth}
                </div>
              </section>

              <section
                style={{
                  border: "1px solid #27333b",
                  borderRadius: 15,
                  background: "#10151a",
                  padding: 14,
                }}
              >
                <strong>Current Field Position</strong>

                <div
                  style={{
                    marginTop: 10,
                    display: "grid",
                    gap: 7,
                    fontSize: 13,
                  }}
                >
                  <div>
                    <strong>Phase:</strong> {activeJob.phase}
                  </div>
                  <div>
                    <strong>Crew:</strong> {effectiveCrew}
                  </div>
                  <div>
                    <strong>Material:</strong> {activeJob.materialEta}
                  </div>
                  <div>
                    <strong>Permit:</strong> {activeJob.permit}
                  </div>
                </div>
              </section>
            </div>

            <section
              style={{
                display:
                  activeJob.workType === "Service Call" ? "none" : "block",
                border: "1px solid #27333b",
                borderRadius: 15,
                background: "#10151a",
                padding: 14,
                marginBottom: 12,
              }}
            >
              <strong>Field Updates</strong>

              <div style={{ display: "grid", gap: 9, marginTop: 10 }}>
                {updates
                  .filter((item) => item.jobId === activeJob.id)
                  .map((item, index) => (
                    <div
                      key={`${item.time}-${index}`}
                      style={{
                        borderLeft: "2px solid #6f93aa",
                        paddingLeft: 10,
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
                          marginTop: 3,
                          color: "#f0f4f7",
                          fontSize: 13,
                        }}
                      >
                        {item.text}
                      </div>
                    </div>
                  ))}

                <button
                  type="button"
                  onClick={() => {
                    const text = window.prompt(
                      "Add update for the office and crew"
                    );

                    if (!text?.trim()) return;
                    addUpdate(text.trim());
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
                  Add Update
                </button>
              </div>
            </section>

            <section
              style={{
                display:
                  activeJob.workType === "Service Call" ? "none" : "block",
                border: "1px solid #27333b",
                borderRadius: 15,
                background: "#10151a",
                padding: 14,
              }}
            >
              <strong>Quick Access</strong>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 8,
                  marginTop: 10,
                }}
                className="field-quick-grid"
              >
                {[
                  "Customer Notes",
                  "Measurements",
                  "Manufacturer PO",
                  "Required Photos",
                  "Permit Proof",
                  "Installer Board",
                ].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      if (label === "Installer Board") {
                        window.open(
                          "/planet/premier-window-door/tech",
                          "_blank",
                          "noopener,noreferrer"
                        );
                        return;
                      }

                      setQuickAccess(
                        label as
                          | "Customer Notes"
                          | "Measurements"
                          | "Manufacturer PO"
                          | "Required Photos"
                          | "Permit Proof"
                      );
                    }}
                    style={{
                      minHeight: 42,
                      border: "1px solid #303d46",
                      borderRadius: 10,
                      background: "#0d1115",
                      color: "#d8dee3",
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: 8,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {quickAccess ? (
                <div
                  style={{
                    marginTop: 10,
                    border: "1px solid #31434d",
                    borderRadius: 13,
                    background: "#0b1015",
                    padding: 13,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <strong>{quickAccess}</strong>

                    <button
                      type="button"
                      onClick={() => setQuickAccess(null)}
                      style={{
                        border: 0,
                        background: "transparent",
                        color: "#9fb0ba",
                        cursor: "pointer",
                        fontSize: 18,
                      }}
                    >
                      ×
                    </button>
                  </div>

                  {quickAccess === "Customer Notes" ? (
                    <div
                      style={{
                        color: "#d6dde2",
                        fontSize: 13,
                        lineHeight: 1.6,
                      }}
                    >
                      {activeJob.customerTruth}
                    </div>
                  ) : null}

                  {quickAccess === "Measurements" ? (
                    <div style={{ display: "grid", gap: 8 }}>
                      {activeJob.measurements.map((item) => (
                        <div
                          key={item.name}
                          style={{
                            border: "1px solid #29343d",
                            borderRadius: 10,
                            padding: 10,
                          }}
                        >
                          <strong>{item.name}</strong>
                          <div
                            style={{
                              color: "#9ea7ae",
                              fontSize: 11,
                              marginTop: 3,
                            }}
                          >
                            {item.location}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 13 }}>
                            {item.measurement}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {quickAccess === "Manufacturer PO" ? (
                    <div
                      style={{
                        color: "#d6dde2",
                        fontSize: 13,
                        lineHeight: 1.7,
                      }}
                    >
                      <div>
                        <strong>{activeJob.manufacturerPo}</strong>
                      </div>
                      <div>Material ETA: {activeJob.materialEta}</div>
                      <div style={{ color: "#93adc0", marginTop: 6 }}>
                        Manufacturer document will open here when the real PO is connected.
                      </div>
                    </div>
                  ) : null}

                  {quickAccess === "Required Photos" ? (
                    <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
                      {activeJob.requiredPhotos.map((item) => (
                        <div key={item}>○ {item}</div>
                      ))}
                    </div>
                  ) : null}

                  {quickAccess === "Permit Proof" ? (
                    <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
                      {activeJob.permitProof.map((item) => (
                        <div key={item}>○ {item}</div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
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
















