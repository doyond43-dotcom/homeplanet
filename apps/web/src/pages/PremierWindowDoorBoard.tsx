import { useMemo, useState } from "react";

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

        <div
          style={{
            display: "flex",
            gap: 10,
            overflowX: "auto",
            paddingBottom: 12,
            marginBottom: 20,
          }}
        >
          {lanes.map((lane) => {
            const count = jobs.filter((job) => job.status === lane).length;

            return (
              <div
                key={lane}
                style={{
                  minWidth: 160,
                  border: "1px solid #252d34",
                  borderRadius: 14,
                  background: "#101419",
                  padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#9ca5ad",
                    marginBottom: 5,
                  }}
                >
                  {lane}
                </div>
                <strong style={{ fontSize: 22 }}>{count}</strong>
              </div>
            );
          })}
        </div>

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







