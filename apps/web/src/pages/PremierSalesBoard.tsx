import { useMemo, useState } from "react";

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
          maxWidth: 1180,
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
            {[
              ["Office", "/planet/premier-window-door/board"],
              ["Field Ops", "/planet/premier-window-door/field"],
              ["Installer", "/planet/premier-window-door/tech"],
            ].map(([label, href]) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  window.open(href, "_blank", "noopener,noreferrer")
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
                {label}
              </button>
            ))}

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






