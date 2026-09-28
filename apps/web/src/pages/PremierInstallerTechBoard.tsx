import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

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
      "Bucking / buck inspection",
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
      "Bucking / buck inspection",
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
          {open ? "-" : "+"}
        </span>
      </button>

      {open ? (
        <div style={{ padding: "0 16px 16px" }}>{children}</div>
      ) : null}
    </section>
  );
}

function InstallerBeamCard({ jobId }: { jobId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [recipient, setRecipient] =
    useState<string>("Gino Marquez");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);

  const loadMessages = async () => {
    const accessToken =
      new URLSearchParams(window.location.search).get("access");

    if (!accessToken) {
      setError("Premier staff access is missing.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: loadError } = await supabase.rpc(
      "get_premier_beam_messages",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
      }
    );

    if (loadError) {
      console.error("Installer Beam load failed:", loadError);
      setError("Could not load Beam messages.");
      setMessages([]);
    } else {
      setMessages(data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    void loadMessages();
  }, [jobId]);

  const sendMessage = async () => {
    const message = body.trim();

    if (!message || sending) return;

    const accessToken =
      new URLSearchParams(window.location.search).get("access");

    if (!accessToken) {
      setError("Premier staff access is missing.");
      return;
    }

    setSending(true);
    setError("");

    const { error: sendError } = await supabase.rpc(
      "send_premier_beam_message",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
        p_sender_role: "Installer/Tech",
        p_recipient_role: recipient,
        p_body: message,
      }
    );

    if (sendError) {
      console.error("Installer Beam send failed:", sendError);
      setError("Could not send Beam message.");
      setSending(false);
      return;
    }

    setBody("");
    await loadMessages();
    setSending(false);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice typing is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setError("");
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      setError("Could not hear that. Please try again.");
    };

    recognition.onresult = (event: any) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim() ?? "";

      if (!transcript) return;

      setBody((current) =>
        current
          ? `${current}${current.endsWith(" ") ? "" : " "}${transcript}`
          : transcript
      );
    };

    recognition.start();
  };

  const quickActions = [
    "Material needed: ",
    "Need office call: ",
    "Job issue: ",
    "Running behind: ",
    "Ready for inspection: ",
  ];

  return (
    <div
      style={{
        border: "1px solid #78aa88",
        borderRadius: 14,
        background:
          "linear-gradient(135deg, #173225 0%, #101b16 100%)",
        boxShadow:
          "0 0 0 1px rgba(139,184,154,0.08), 0 8px 24px rgba(0,0,0,0.18)",
        marginTop: 12,
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div>
          <div style={{ color: "#d9e5ee", fontSize: 12, fontWeight: 900 }}>
            Beam Quick Message
          </div>
          <div style={{ color: "#7f94a3", fontSize: 10, marginTop: 2 }}>
            Fast job communication
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadMessages()}
          disabled={loading}
          style={{
            border: "1px solid #31495a",
            borderRadius: 8,
            background: "#101820",
            color: "#a9bac6",
            padding: "6px 9px",
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div
        style={{
          maxHeight: 170,
          overflowY: "auto",
          display: "grid",
          gap: 6,
          marginBottom: 9,
          border: "1px solid #294a36",
          borderRadius: 10,
          background: "#0d1711",
          padding: 8,
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: "#78858e", fontSize: 11 }}>
            No Beam messages yet.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                border: "1px solid #273944",
                borderRadius: 8,
                background: "#0d141a",
                padding: 8,
              }}
            >
              <div style={{ color: "#8fa9bc", fontSize: 9, marginBottom: 4 }}>
                {message.sender_label} → {message.recipient_role}
              </div>

              <div style={{ color: "#d9e5ee", fontSize: 11 }}>
                {message.body}
              </div>
            </div>
          ))
        )}
      </div>

      <select
        value={recipient}
        onChange={(event) => setRecipient(event.target.value)}
        style={{
          width: "100%",
          minHeight: 40,
          border: "1px solid #31495a",
          borderRadius: 9,
          background: "#101820",
          color: "#d9e5ee",
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
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 8,
        }}
      >
        {quickActions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => setBody(action)}
            style={{
              border: "1px solid #31495a",
              borderRadius: 999,
              background: "#101820",
              color: "#b8c8d3",
              padding: "6px 8px",
              fontSize: 9,
              fontWeight: 800,
            }}
          >
            {action.replace(": ", "")}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 46px",
          gap: 8,
          alignItems: "stretch",
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
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #31495a",
            borderRadius: 9,
            background: "#0d141a",
            color: "#d9e5ee",
            padding: 9,
            fontSize: 11,
            resize: "vertical",
          }}
        />

        <button
          type="button"
          onClick={startVoiceInput}
          disabled={listening}
          title="Talk message"
          aria-label="Talk message"
          style={{
            border: listening
              ? "1px solid #d98778"
              : "1px solid #31495a",
            borderRadius: 9,
            background: listening ? "#7a2d24" : "#2f6842",
            boxShadow: listening
              ? "0 0 0 2px rgba(217,135,120,0.18), 0 0 18px rgba(217,135,120,0.22)"
              : "none",
            color: "#d9e5ee",
            fontSize: 20,
            cursor: listening ? "wait" : "pointer",
          }}
        >
          🎤
        </button>
      </div>

      {error ? (
        <div style={{ color: "#d8b267", fontSize: 10, marginTop: 6 }}>
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void sendMessage()}
        disabled={sending || !body.trim()}
        style={{
          width: "100%",
          minHeight: 40,
          marginTop: 8,
          border: "1px solid #8fbea0",
          borderRadius: 9,
          background: "#2f6842",
          color: "#d9e5ee",
          fontWeight: 900,
          opacity: sending || !body.trim() ? 0.6 : 1,
        }}
      >
        {sending ? "Sending..." : `Send to ${recipient}`}
      </button>
    </div>
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

  const [liveInstallerJobs, setLiveInstallerJobs] = useState<any[]>([]);
  const [liveInstallerJobsLoading, setLiveInstallerJobsLoading] =
    useState(false);

  const [installerProofPhotos, setInstallerProofPhotos] = useState<
    Record<string, any[]>
  >({});

  const [uploadingInstallerProofJobId, setUploadingInstallerProofJobId] =
    useState<string | null>(null);

  const [buckingDrafts, setBuckingDrafts] = useState<
    Record<
      string,
      {
        buckingNotes: string;
        measurementNotes: string;
        materialIssueNotes: string;
        needsAttention: boolean;
        saved: boolean;
      }
    >
  >({});

  const [savingBuckingJobId, setSavingBuckingJobId] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadInstallerJobs = async () => {
      const accessToken =
        new URLSearchParams(window.location.search).get("access");

      if (!accessToken) {
        if (active) {
          setLiveInstallerJobs([]);
          setLiveInstallerJobsLoading(false);
        }
        return;
      }

      setLiveInstallerJobsLoading(true);

      const { data, error } = await supabase.rpc(
        "get_premier_installer_jobs",
        {
          p_access_token: accessToken,
        }
      );

      if (!active) return;

      if (error) {
        console.error("Premier installer jobs failed:", error);
        setLiveInstallerJobs([]);
      } else {
        const jobsData = data ?? [];
        setLiveInstallerJobs(jobsData);

        const proofEntries = await Promise.all(
          jobsData.map(async (job: any) => {
            const { data: proofData, error: proofError } =
              await supabase.functions.invoke(
                "premier-installer-proof-photo",
                {
                  body: {
                    action: "list",
                    accessToken,
                    jobId: job.id,
                  },
                }
              );

            if (proofError) {
              console.error(
                `Premier installer proof load failed for ${job.id}:`,
                proofError
              );

              return [job.id, []] as const;
            }

            return [job.id, proofData?.photos ?? []] as const;
          })
        );

        if (active) {
          const proofMap = Object.fromEntries(proofEntries);

          setInstallerProofPhotos(proofMap);

          const nextBuckingDrafts: Record<
            string,
            {
              buckingNotes: string;
              measurementNotes: string;
              materialIssueNotes: string;
              needsAttention: boolean;
              saved: boolean;
            }
          > = {};

          for (const job of jobsData) {
            const buckingPhoto = (proofMap[job.id] ?? []).find(
              (photo: any) =>
                photo.proof_type === "Bucking / buck inspection"
            );

            if (buckingPhoto) {
              nextBuckingDrafts[job.id] = {
                buckingNotes: buckingPhoto.bucking_notes ?? "",
                measurementNotes: buckingPhoto.measurement_notes ?? "",
                materialIssueNotes:
                  buckingPhoto.material_issue_notes ?? "",
                needsAttention: Boolean(buckingPhoto.needs_attention),
                saved: Boolean(
                  buckingPhoto.bucking_notes ||
                    buckingPhoto.measurement_notes ||
                    buckingPhoto.material_issue_notes ||
                    buckingPhoto.needs_attention
                ),
              };
            }
          }

          setBuckingDrafts(nextBuckingDrafts);
        }
      }

      setLiveInstallerJobsLoading(false);
    };

    void loadInstallerJobs();

    return () => {
      active = false;
    };
  }, []);

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

          </div>
        </header>

        <section
          style={{
            border: "1px solid #31495a",
            borderRadius: 16,
            background: "#10151a",
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
                Live Installer Jobs
              </strong>
            </div>

            <span
              style={{
                fontSize: 12,
                fontWeight: 900,
                color: "#d9e5ee",
              }}
            >
              {liveInstallerJobs.length}
            </span>
          </div>

          {liveInstallerJobsLoading ? (
            <div style={{ color: "#8fa0ad", fontSize: 12 }}>
              Loading installer jobs...
            </div>
          ) : liveInstallerJobs.length === 0 ? (
            <div style={{ color: "#78858e", fontSize: 12 }}>
              No jobs currently ready for Installer Tech.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 9 }}>
              {liveInstallerJobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    border: "1px solid #557c64",
                    borderRadius: 13,
                    background: "#111820",
                    padding: 12,
                  }}
                >
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
                        color: "#b7dec4",
                        fontSize: 10,
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      {job.current_stage === "installation_in_progress" ? "Installation In Progress" : "Installation Ready"}
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
                      <strong>Crew:</strong>{" "}
                      {job.crew || "Not assigned"}
                    </div>

                    <div>
                      <strong>Install:</strong>{" "}
                      {job.scheduled_for
                        ? new Date(job.scheduled_for).toLocaleString()
                        : "Not scheduled"}
                    </div>

                    <div>
                      <strong>Material:</strong>{" "}
                      {job.material_status || "Unknown"}
                    </div>

                    <div>
                      <strong>Permit:</strong>{" "}
                      {job.permit_status || "Unknown"}
                    </div>
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
                      "Installer to begin installation and upload required proof."}
                  </div>


                  <InstallerBeamCard jobId={job.id} />
                  <div
                    style={{
                      borderTop: "1px solid #26323a",
                      marginTop: 10,
                      paddingTop: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        color: "#8fa9bc",
                        textTransform: "uppercase",
                        marginBottom: 7,
                      }}
                    >
                      Required Proof
                    </div>

                    {installerProofPhotos[job.id]?.some(
                      (photo) =>
                        photo.proof_type === "Bucking / buck inspection"
                    ) ? (
                      <div
                        style={{
                          border: "1px solid #557c64",
                          borderRadius: 10,
                          background: "#16232d",
                          padding: "10px 12px",
                        }}
                      >
                        <div
                          style={{
                            minHeight: 28,
                            color: "#b7dec4",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 900,
                            fontSize: 12,
                          }}
                        >
                          Bucking / buck inspection proof saved
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const photo = installerProofPhotos[job.id]?.find(
                              (item) =>
                                item.proof_type ===
                                "Bucking / buck inspection"
                            );

                            if (!photo?.url) {
                              window.alert("Saved proof photo is unavailable.");
                              return;
                            }

                            window.open(photo.url, "_blank", "noopener,noreferrer");
                          }}
                          style={{
                            width: "100%",
                            minHeight: 40,
                            marginTop: 8,
                            borderRadius: 9,
                            border: "1px solid #557c64",
                            background: "#111820",
                            color: "#d9e5ee",
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          View Photo
                        </button>
                        <div
                          style={{
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: "1px solid #334753",
                            display: "grid",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 900,
                              color: "#8fa9bc",
                              textTransform: "uppercase",
                            }}
                          >
                            Bucking Record
                          </div>

                          <textarea
                            value={buckingDrafts[job.id]?.buckingNotes ?? ""}
                            onChange={(event) => {
                              const current = buckingDrafts[job.id];

                              setBuckingDrafts((drafts) => ({
                                ...drafts,
                                [job.id]: {
                                  buckingNotes: event.target.value,
                                  measurementNotes:
                                    current?.measurementNotes ?? "",
                                  materialIssueNotes:
                                    current?.materialIssueNotes ?? "",
                                  needsAttention:
                                    current?.needsAttention ?? false,
                                  saved: false,
                                },
                              }));
                            }}
                            placeholder="Bucking / buck inspection notes"
                            rows={3}
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              borderRadius: 9,
                              border: "1px solid #405565",
                              background: "#111820",
                              color: "#d9e5ee",
                              padding: "10px 11px",
                              fontSize: 12,
                              resize: "vertical",
                            }}
                          />

                          <textarea
                            value={
                              buckingDrafts[job.id]?.measurementNotes ?? ""
                            }
                            onChange={(event) => {
                              const current = buckingDrafts[job.id];

                              setBuckingDrafts((drafts) => ({
                                ...drafts,
                                [job.id]: {
                                  buckingNotes: current?.buckingNotes ?? "",
                                  measurementNotes: event.target.value,
                                  materialIssueNotes:
                                    current?.materialIssueNotes ?? "",
                                  needsAttention:
                                    current?.needsAttention ?? false,
                                  saved: false,
                                },
                              }));
                            }}
                            placeholder="Measurement notes"
                            rows={3}
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              borderRadius: 9,
                              border: "1px solid #405565",
                              background: "#111820",
                              color: "#d9e5ee",
                              padding: "10px 11px",
                              fontSize: 12,
                              resize: "vertical",
                            }}
                          />

                          <textarea
                            value={
                              buckingDrafts[job.id]?.materialIssueNotes ?? ""
                            }
                            onChange={(event) => {
                              const current = buckingDrafts[job.id];

                              setBuckingDrafts((drafts) => ({
                                ...drafts,
                                [job.id]: {
                                  buckingNotes: current?.buckingNotes ?? "",
                                  measurementNotes:
                                    current?.measurementNotes ?? "",
                                  materialIssueNotes: event.target.value,
                                  needsAttention:
                                    current?.needsAttention ?? false,
                                  saved: false,
                                },
                              }));
                            }}
                            placeholder="Material issue notes"
                            rows={3}
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              borderRadius: 9,
                              border: "1px solid #405565",
                              background: "#111820",
                              color: "#d9e5ee",
                              padding: "10px 11px",
                              fontSize: 12,
                              resize: "vertical",
                            }}
                          />

                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              minHeight: 38,
                              color: "#d9e5ee",
                              fontSize: 12,
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={
                                buckingDrafts[job.id]?.needsAttention ?? false
                              }
                              onChange={(event) => {
                                const current = buckingDrafts[job.id];

                                setBuckingDrafts((drafts) => ({
                                  ...drafts,
                                  [job.id]: {
                                    buckingNotes:
                                      current?.buckingNotes ?? "",
                                    measurementNotes:
                                      current?.measurementNotes ?? "",
                                    materialIssueNotes:
                                      current?.materialIssueNotes ?? "",
                                    needsAttention: event.target.checked,
                                    saved: false,
                                  },
                                }));
                              }}
                            />
                            Needs attention
                          </label>

                          <button
                            type="button"
                            disabled={savingBuckingJobId === job.id}
                            onClick={async () => {
                              const accessToken =
                                new URLSearchParams(
                                  window.location.search
                                ).get("access");

                              if (!accessToken) return;

                              const draft = buckingDrafts[job.id] ?? {
                                buckingNotes: "",
                                measurementNotes: "",
                                materialIssueNotes: "",
                                needsAttention: false,
                                saved: false,
                              };

                              setSavingBuckingJobId(job.id);

                              try {
                                const { data, error } = await supabase.rpc(
                                  "save_premier_installer_bucking_details",
                                  {
                                    p_access_token: accessToken,
                                    p_job_id: job.id,
                                    p_bucking_notes: draft.buckingNotes,
                                    p_measurement_notes:
                                      draft.measurementNotes,
                                    p_material_issue_notes:
                                      draft.materialIssueNotes,
                                    p_needs_attention:
                                      draft.needsAttention,
                                  }
                                );

                                if (error) {
                                  console.error(
                                    "Save Bucking details failed:",
                                    error
                                  );
                                  window.alert(
                                    "Could not save Bucking details."
                                  );
                                  return;
                                }

                                if (data === true) {
                                  setBuckingDrafts((drafts) => ({
                                    ...drafts,
                                    [job.id]: {
                                      ...draft,
                                      saved: true,
                                    },
                                  }));
                                }
                              } finally {
                                setSavingBuckingJobId(null);
                              }
                            }}
                            style={{
                              width: "100%",
                              minHeight: 42,
                              borderRadius: 9,
                              border: "1px solid #557c64",
                              background: "#16232d",
                              color: "#d9e5ee",
                              fontWeight: 900,
                              cursor:
                                savingBuckingJobId === job.id
                                  ? "wait"
                                  : "pointer",
                              opacity:
                                savingBuckingJobId === job.id ? 0.7 : 1,
                            }}
                          >
                            {savingBuckingJobId === job.id
                              ? "Saving Bucking Record..."
                              : buckingDrafts[job.id]?.saved
                                ? "Bucking Record Saved"
                                : "Save Bucking Record"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        style={{
                          minHeight: 46,
                          border: "1px solid #8a6b32",
                          borderRadius: 10,
                          background: "#1b1a16",
                          color: "#e6c77b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px 12px",
                          fontWeight: 900,
                          fontSize: 12,
                          cursor:
                            uploadingInstallerProofJobId === job.id
                              ? "wait"
                              : "pointer",
                        }}
                      >
                        {uploadingInstallerProofJobId === job.id
                          ? "Uploading Bucking Proof..."
                          : "○ Bucking / buck inspection · Take / Upload Photo"}

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          capture="environment"
                          hidden
                          disabled={uploadingInstallerProofJobId === job.id}
                          onChange={async (event) => {
                            const file = event.target.files?.[0] ?? null;
                            event.currentTarget.value = "";

                            if (!file) return;

                            const accessToken =
                              new URLSearchParams(
                                window.location.search
                              ).get("access");

                            if (!accessToken) {
                              window.alert("Premier installer access is missing.");
                              return;
                            }

                            if (
                              !["image/jpeg", "image/png", "image/webp"].includes(
                                file.type
                              )
                            ) {
                              window.alert("Please use a JPG, PNG, or WEBP photo.");
                              return;
                            }

                            setUploadingInstallerProofJobId(job.id);

                            try {
                              const proofType = "Bucking / buck inspection";

                              const { data: uploadAccess, error: accessError } =
                                await supabase.functions.invoke(
                                  "premier-installer-proof-photo",
                                  {
                                    body: {
                                      action: "create-upload",
                                      accessToken,
                                      jobId: job.id,
                                      proofType,
                                      fileName: file.name || "bucking-proof.jpg",
                                      mimeType: file.type || "image/jpeg",
                                    },
                                  }
                                );

                              if (
                                accessError ||
                                !uploadAccess?.path ||
                                !uploadAccess?.token
                              ) {
                                throw new Error(
                                  accessError?.message ||
                                    "Could not prepare bucking proof upload."
                                );
                              }

                              const { error: uploadError } =
                                await supabase.storage
                                  .from("premier-installer-proof-photos")
                                  .uploadToSignedUrl(
                                    uploadAccess.path,
                                    uploadAccess.token,
                                    file,
                                    {
                                      contentType: file.type || "image/jpeg",
                                    }
                                  );

                              if (uploadError) throw uploadError;

                              const { data: finalizeData, error: finalizeError } =
                                await supabase.functions.invoke(
                                  "premier-installer-proof-photo",
                                  {
                                    body: {
                                      action: "finalize",
                                      accessToken,
                                      jobId: job.id,
                                      proofType,
                                      path: uploadAccess.path,
                                      fileName: file.name || "bucking-proof.jpg",
                                      mimeType: file.type || "image/jpeg",
                                    },
                                  }
                                );

                              if (finalizeError || !finalizeData?.photo) {
                                throw new Error(
                                  finalizeError?.message ||
                                    "Could not save bucking proof."
                                );
                              }

                              setInstallerProofPhotos((current) => ({
                                ...current,
                                [job.id]: [
                                  ...(current[job.id] ?? []),
                                  finalizeData.photo,
                                ],
                              }));
                            } catch (error) {
                              console.error(
                                "Premier bucking proof upload failed:",
                                error
                              );

                              window.alert(
                                error instanceof Error
                                  ? error.message
                                  : "Could not upload bucking proof."
                              );
                            } finally {
                              setUploadingInstallerProofJobId(null);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {job.current_stage === "installation_ready" ? (
                    <button
                      type="button"
                      onClick={async () => {
                        const accessToken =
                          new URLSearchParams(window.location.search).get("access");

                        if (!accessToken) return;

                        const { data, error } = await supabase.rpc(
                          "start_premier_installation",
                          {
                            p_access_token: accessToken,
                            p_job_id: job.id,
                          }
                        );

                        if (error) {
                          console.error("Start Installation failed:", error);
                          return;
                        }

                        if (data === true) {
                          setLiveInstallerJobs((current) =>
                            current.map((item) =>
                              item.id === job.id
                                ? {
                                    ...item,
                                    current_stage: "installation_in_progress",
                                    next_action:
                                      "Installer to complete installation and upload required proof.",
                                  }
                                : item
                            )
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
                      Start Installation
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        const confirmed = window.confirm(
                          "Finish this installation? Make sure all required proof, photos, notes, and missing or damaged items have been handled before marking the job complete."
                        );

                        if (!confirmed) return;

                        const accessToken =
                          new URLSearchParams(window.location.search).get("access");

                        if (!accessToken) return;

                        const { data, error } = await supabase.rpc(
                          "complete_premier_installation",
                          {
                            p_access_token: accessToken,
                            p_job_id: job.id,
                          }
                        );

                        if (error) {
                          console.error("Complete Installation failed:", error);
                          window.alert(
                            error.message ||
                              "Installation could not be finished. Check required proof and Bucking details."
                          );
                          return;
                        }

                        if (data === true) {
                          setLiveInstallerJobs((current) =>
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
                      Finish Installation
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>


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





