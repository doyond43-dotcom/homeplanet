import { useMemo, useState } from "react";

type TechJob = {
  id: string;
  customer: string;
  address: string;
  arrival: string;
  scope: string;
  status: string;
  crew: string;
  customerTruth: string;
  approvedScope: string;
  promisedIncluded: string[];
  notIncluded: string[];
  measurements: { name: string; location: string; measurement: string }[];
  requiredPhotos: string[];
  supplier: string;
  manufacturerPo: string;
  materialStatus: string;
};

const jobs: TechJob[] = [
  {
    id: "PW-1048",
    customer: "Michael & Sarah Carter",
    address: "1842 Palm Ridge Dr, Wellington",
    arrival: "8:00 AM",
    scope: "8 impact windows + rear French door",
    status: "Scheduled",
    crew: "Crew 2",
    customerTruth:
      "Rear door may require additional stucco work depending on opening condition. Preserve existing blinds. Customer prefers arrival before 9 AM.",
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
    measurements: [
      { name: "Window 01", location: "Master Bedroom", measurement: '36 1/4" x 62 1/2"' },
      { name: "Window 02", location: "Living Room", measurement: '48" x 60"' },
      { name: "Door 01", location: "Rear French Door", measurement: '72" x 80"' },
    ],
    requiredPhotos: [
      "Before condition",
      "Fasteners / screws",
      "Concrete / block opening",
      "Stucco condition",
      "Product label",
      "Installed unit",
      "Exterior overview",
    ],
    supplier: "ES Windows",
    manufacturerPo: "48592",
    materialStatus: "Expected Sept 14",
  },
  {
    id: "PW-1037",
    customer: "Robert Ellis",
    address: "Palm Beach Gardens",
    arrival: "1:00 PM",
    scope: "4 windows + front entry door",
    status: "Inspection",
    crew: "Crew 2",
    customerTruth:
      "Replace 4 windows and front entry door. Customer requested protection around interior flooring and wants all removed materials hauled away.",
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
    measurements: [
      { name: "Window 01", location: "Front Bedroom", measurement: '35 3/4" x 61"' },
      { name: "Window 02", location: "Rear Bedroom", measurement: '36" x 60 1/2"' },
      { name: "Door 01", location: "Front Entry", measurement: '36" x 80"' },
    ],
    requiredPhotos: [
      "Fasteners / screws",
      "Installed window",
      "Installed entry door",
      "Product labels",
      "Exterior overview",
    ],
    supplier: "ES Windows",
    manufacturerPo: "48177",
    materialStatus: "Received",
  },
];

function Section({
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
        border: "1px solid #27333b",
        borderRadius: 16,
        background: "#10151a",
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <strong>{title}</strong>
        <span style={{ color: "#8fa9bc", fontSize: 18 }}>
          {open ? "−" : "+"}
        </span>
      </button>

      {open ? (
        <div style={{ padding: "0 16px 16px" }}>{children}</div>
      ) : null}
    </section>
  );
}

export default function PremierInstallerTechBoard() {
  const [activeJobId, setActiveJobId] = useState("PW-1048");
  const [note, setNote] = useState("");
  const [updates, setUpdates] = useState<
    { time: string; text: string }[]
  >([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionMode, setCompletionMode] = useState<
    "clean" | "issue" | null
  >(null);
  const [punchOutOpening, setPunchOutOpening] = useState("");
  const [punchOutType, setPunchOutType] = useState("Missing Part");
  const [punchOutIssue, setPunchOutIssue] = useState("");
  const [punchOuts, setPunchOuts] = useState<
    {
      id: string;
      jobId: string;
      opening: string;
      type: string;
      issue: string;
      time: string;
      resolved: boolean;
    }[]
  >([]);

  const activeJob = useMemo(
    () => jobs.find((job) => job.id === activeJobId) ?? jobs[0],
    [activeJobId]
  );

  const activePunchOuts = punchOuts.filter(
    (item) => item.jobId === activeJob.id && !item.resolved
  );

  const hasOpenPunchOut = activePunchOuts.length > 0;

  const addUpdate = (text: string) => {
    setUpdates((current) => [
      {
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
          "radial-gradient(circle at top, #111820 0%, #0b0f13 45%, #07090c 100%)",
        color: "#f5f7f5",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "22px 14px 70px",
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
              fontSize: "clamp(28px, 8vw, 42px)",
              lineHeight: 1,
            }}
          >
            Installer Tech Board
          </h1>

          <p
            style={{
              color: "#a8b0a9",
              margin: "9px 0 0",
              fontSize: 14,
            }}
          >
            Today’s jobs, what was promised, what to measure, what proof is needed, and what happens next.
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
            <button
              type="button"
              onClick={() =>
                window.open(
                  "/planet/premier-window-door/board",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              style={{
                border: "1px solid #2e3d46",
                borderRadius: 999,
                background: "#10151a",
                color: "#cfd7dd",
                padding: "7px 11px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Office
            </button>

            <button
              type="button"
              onClick={() =>
                window.open(
                  "/planet/premier-window-door/field",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              style={{
                border: "1px solid #2e3d46",
                borderRadius: 999,
                background: "#10151a",
                color: "#cfd7dd",
                padding: "7px 11px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Field Ops
            </button>

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
              Installer
            </span>

            <span
              style={{
                marginLeft: "auto",
                color: "#77828a",
                fontSize: 10,
                fontWeight: 800,
              }}
            >
              Prototype · Demo Data
            </span>
          </div>
        </header>

        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            marginBottom: 16,
            paddingBottom: 4,
          }}
        >
          {jobs.map((job) => (
            <button
              key={job.id}
              type="button"
              onClick={() => {
                setActiveJobId(job.id);
                setCompleted(false);
                setCompletionOpen(false);
                setCompletionMode(null);
                setPunchOutOpening("");
                setPunchOutIssue("");
              }}
              style={{
                minWidth: 240,
                textAlign: "left",
                border:
                  activeJobId === job.id
                    ? "1px solid #87a9c0"
                    : "1px solid #27333b",
                borderRadius: 15,
                background:
                  activeJobId === job.id ? "#111820" : "#101419",
                color: "#fff",
                padding: 14,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#8fa9bc",
                  fontWeight: 800,
                  marginBottom: 5,
                }}
              >
                {job.arrival}
              </div>

              <strong style={{ fontSize: 16 }}>{job.customer}</strong>

              <div
                style={{
                  marginTop: 5,
                  color: "#9ea7ae",
                  fontSize: 12,
                }}
              >
                {job.address}
              </div>

              <div
                style={{
                  marginTop: 9,
                  fontSize: 13,
                }}
              >
                {job.scope}
              </div>
            </button>
          ))}
        </div>

        <div
          style={{
            border: "1px solid #28343d",
            borderRadius: 20,
            background: "#0d1115",
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "flex-start",
              marginBottom: 14,
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
                  fontSize: 26,
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
              {completed
                ? hasOpenPunchOut
                  ? "Needs Attention"
                  : "Installer Complete"
                : activeJob.status}
            </span>
          </div>

          <div
            style={{
              border: "1px solid #2d3d47",
              borderRadius: 14,
              background: "#14202a",
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
              Today’s Work
            </div>

            <strong>{activeJob.scope}</strong>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
              marginBottom: 12,
            }}
            className="tech-quick-grid"
          >
            <div
              style={{
                border: "1px solid #28323a",
                borderRadius: 12,
                padding: 12,
                background: "#101419",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#929ba2",
                  marginBottom: 4,
                }}
              >
                Arrival
              </div>
              <strong>{activeJob.arrival}</strong>
            </div>

            <div
              style={{
                border: "1px solid #28323a",
                borderRadius: 12,
                padding: 12,
                background: "#101419",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#929ba2",
                  marginBottom: 4,
                }}
              >
                Crew
              </div>
              <strong>{activeJob.crew}</strong>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 9,
              marginBottom: 12,
            }}
            className="tech-action-grid"
          >
            <label
              style={{
                minHeight: 46,
                border: "1px solid #344958",
                borderRadius: 12,
                background: "#111820",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                cursor: "pointer",
                padding: "10px 12px",
              }}
            >
              Upload Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const count = event.target.files?.length ?? 0;
                  if (!count) return;

                  setPhotoCount((current) => current + count);
                  addUpdate(
                    `${count} field photo${count === 1 ? "" : "s"} added.`
                  );
                }}
              />
            </label>

            <button
              type="button"
              onClick={() => {
                const text = window.prompt(
                  "What problem did you find on the job?"
                );

                if (!text?.trim()) return;
                addUpdate(`Problem reported: ${text.trim()}`);
              }}
              style={{
                minHeight: 46,
                border: "1px solid #5b432b",
                borderRadius: 12,
                background: "#21180f",
                color: "#f5f0e8",
                fontWeight: 800,
                cursor: "pointer",
                padding: "10px 12px",
              }}
            >
              Report Problem
            </button>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            <Section title="Agreement Truth" defaultOpen>
              <div style={{ display: "grid", gap: 12 }}>
                <div>
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

                  <strong style={{ fontSize: 14 }}>
                    {activeJob.approvedScope}
                  </strong>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                  className="tech-agreement-grid"
                >
                  <div>
                    <div
                      style={{
                        color: "#9fb9cb",
                        fontSize: 11,
                        fontWeight: 900,
                        marginBottom: 5,
                      }}
                    >
                      Promised / Included
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: 4,
                        fontSize: 13,
                      }}
                    >
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
                        marginBottom: 5,
                      }}
                    >
                      Not Included
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gap: 4,
                        fontSize: 13,
                      }}
                    >
                      {activeJob.notIncluded.map((item) => (
                        <div key={item}>— {item}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #29343d",
                    paddingTop: 10,
                    color: "#cfd6dc",
                    fontSize: 13,
                    lineHeight: 1.55,
                  }}
                >
                  {activeJob.customerTruth}
                </div>
              </div>
            </Section>

            <Section title="Measurements / Beam Cards">
              <div
                style={{
                  display: "grid",
                  gap: 9,
                }}
              >
                {activeJob.measurements.map(({ name, location, measurement }) => (
                  <div
                    key={name}
                    style={{
                      border: "1px solid #29343d",
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <strong>{name}</strong>
                    <div
                      style={{
                        color: "#9fa8af",
                        fontSize: 12,
                        marginTop: 4,
                      }}
                    >
                      {location}
                    </div>
                    <div style={{ marginTop: 7 }}>{measurement}</div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Required Photos" defaultOpen>
              <div
                style={{
                  display: "grid",
                  gap: 7,
                  color: "#d6dce1",
                  fontSize: 14,
                }}
              >
                {activeJob.requiredPhotos.map((item) => (
                  <div key={item}>○ {item}</div>
                ))}

                <div
                  style={{
                    marginTop: 5,
                    color: "#8fa9bc",
                    fontWeight: 800,
                  }}
                >
                  {photoCount} new field photo{photoCount === 1 ? "" : "s"} added
                </div>
              </div>
            </Section>

            <Section title="Materials / PO">
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  fontSize: 14,
                }}
              >
                <div>
                  <strong>Supplier:</strong> {activeJob.supplier}
                </div>
                <div>
                  <strong>PO:</strong> {activeJob.manufacturerPo}
                </div>
                <div>
                  <strong>Material:</strong> {activeJob.materialStatus}
                </div>
                <div
                  style={{
                    color: "#93adc0",
                    fontWeight: 800,
                    marginTop: 3,
                  }}
                >
                  View Manufacturer PO
                </div>
              </div>
            </Section>

            <Section title="Field Notes / Truth Chain">
              <div style={{ display: "grid", gap: 10 }}>
                {updates.map((item, index) => (
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
                        fontSize: 11,
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

                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Add a field note..."
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
                  disabled={!note.trim()}
                  onClick={() => {
                    if (!note.trim()) return;
                    addUpdate(note.trim());
                    setNote("");
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
                  Save Field Note
                </button>
              </div>
            </Section>
          </div>

          <div
            style={{
              marginTop: 14,
              border: "1px solid #33434d",
              borderRadius: 14,
              background: "#10151a",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setCompletionOpen((current) => !current);
                setCompletionMode(null);
              }}
              style={{
                width: "100%",
                minHeight: 52,
                border: 0,
                background: completed ? "#1a2934" : "#1c2c38",
                color: "#fff",
                fontWeight: 900,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              {completed
                ? hasOpenPunchOut
                  ? "Installation Complete · Needs Attention"
                  : "Installation Complete"
                : "Complete Installation"}
            </button>

            {completionOpen ? (
              <div
                style={{
                  padding: 14,
                  borderTop: "1px solid #33434d",
                  display: "grid",
                  gap: 12,
                }}
              >
                <div>
                  <strong style={{ fontSize: 15 }}>
                    Any remaining issues?
                  </strong>

                  <div
                    style={{
                      color: "#9da7ae",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Record anything missing, damaged, unfinished, or needing a
                    return visit before this job moves toward final walkthrough.
                  </div>
                </div>

                <div
                  className="tech-completion-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setCompletionMode("clean");
                      setCompleted(true);
                      addUpdate(
                        "Installation complete. Installer reported no outstanding punch-out items."
                      );
                    }}
                    style={{
                      minHeight: 44,
                      border: "1px solid #486578",
                      borderRadius: 10,
                      background:
                        completionMode === "clean" ? "#243b4a" : "#111820",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    No — Job is clean
                  </button>

                  <button
                    type="button"
                    onClick={() => setCompletionMode("issue")}
                    style={{
                      minHeight: 44,
                      border: "1px solid #60452d",
                      borderRadius: 10,
                      background:
                        completionMode === "issue" ? "#342314" : "#21180f",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Yes — Add Punch-Out Item
                  </button>
                </div>

                {completionMode === "issue" ? (
                  <div
                    style={{
                      display: "grid",
                      gap: 9,
                      paddingTop: 4,
                    }}
                  >
                    <input
                      value={punchOutOpening}
                      onChange={(event) =>
                        setPunchOutOpening(event.target.value)
                      }
                      placeholder="Opening / location — e.g. Window 07"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #34434d",
                        borderRadius: 10,
                        background: "#0b0f13",
                        color: "#fff",
                        padding: 11,
                        font: "inherit",
                      }}
                    />

                    <select
                      value={punchOutType}
                      onChange={(event) =>
                        setPunchOutType(event.target.value)
                      }
                      style={{
                        width: "100%",
                        border: "1px solid #34434d",
                        borderRadius: 10,
                        background: "#0b0f13",
                        color: "#fff",
                        padding: 11,
                        font: "inherit",
                      }}
                    >
                      <option>Missing Part</option>
                      <option>Damage / Scratch</option>
                      <option>Touch-Up</option>
                      <option>Adjustment</option>
                      <option>Return Visit</option>
                      <option>Other</option>
                    </select>

                    <textarea
                      value={punchOutIssue}
                      onChange={(event) =>
                        setPunchOutIssue(event.target.value)
                      }
                      placeholder="What still needs attention?"
                      rows={3}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        resize: "vertical",
                        border: "1px solid #34434d",
                        borderRadius: 10,
                        background: "#0b0f13",
                        color: "#fff",
                        padding: 11,
                        font: "inherit",
                      }}
                    />

                    <button
                      type="button"
                      disabled={!punchOutIssue.trim()}
                      onClick={() => {
                        if (!punchOutIssue.trim()) return;

                        const time = new Date().toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        });

                        setPunchOuts((current) => [
                          {
                            id: `${activeJob.id}-${Date.now()}`,
                            jobId: activeJob.id,
                            opening:
                              punchOutOpening.trim() || "General / Unknown",
                            type: punchOutType,
                            issue: punchOutIssue.trim(),
                            time,
                            resolved: false,
                          },
                          ...current,
                        ]);

                        setCompleted(true);

                        addUpdate(
                          `Punch-out reported · ${punchOutType} · ${
                            punchOutOpening.trim() || "General / Unknown"
                          } · ${punchOutIssue.trim()}`
                        );

                        setPunchOutOpening("");
                        setPunchOutIssue("");
                        setCompletionMode(null);
                      }}
                      style={{
                        minHeight: 44,
                        border: "1px solid #725033",
                        borderRadius: 10,
                        background: "#2b1d12",
                        color: "#fff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Submit Punch-Out
                    </button>
                  </div>
                ) : null}

                {activePunchOuts.length > 0 ? (
                  <div
                    style={{
                      borderTop: "1px solid #313d46",
                      paddingTop: 11,
                      display: "grid",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        color: "#d7b37c",
                        fontSize: 11,
                        fontWeight: 900,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}
                    >
                      Needs Attention
                    </div>

                    {activePunchOuts.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          border: "1px solid #503b28",
                          borderRadius: 10,
                          background: "#1d160f",
                          padding: 10,
                        }}
                      >
                        <strong>
                          {item.opening} · {item.type}
                        </strong>

                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 13,
                            color: "#e4ded6",
                          }}
                        >
                          {item.issue}
                        </div>

                        <div
                          style={{
                            marginTop: 5,
                            fontSize: 10,
                            color: "#9f958a",
                          }}
                        >
                          Reported {item.time} · Recorded by signed-in installer
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 560px) {
          .tech-quick-grid,
          .tech-action-grid,
          .tech-agreement-grid,
          .tech-completion-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}





