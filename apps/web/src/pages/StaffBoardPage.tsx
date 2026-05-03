import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";

type LiveJobStage = "New Intake" | "In Progress" | "Needs Attention" | "Complete";

type LiveJob = {
  id: string;
  customer: string;
  title: string;
  note: string;
  stage: LiveJobStage;
  createdAt: string;
  updatedAt: string;
};

const LIVE_JOB_STAGES: LiveJobStage[] = ["New Intake", "In Progress", "Needs Attention", "Complete"];

function readJobs(boardSlug: string): LiveJob[] {
  if (!boardSlug) return [];

  try {
    const raw = localStorage.getItem(`hp-live-board:${boardSlug}:jobs`);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((job) => {
      return (
        job &&
        typeof job === "object" &&
        typeof job.id === "string" &&
        typeof job.customer === "string" &&
        typeof job.title === "string" &&
        typeof job.note === "string" &&
        LIVE_JOB_STAGES.includes(job.stage)
      );
    });
  } catch {
    return [];
  }
}

export default function StaffBoardPage() {
  const nav = useNavigate();
  const { slug = "" } = useParams<{ slug: string }>();

  const system = useMemo(() => {
    try {
      const raw = localStorage.getItem(`hp-system:${slug}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [slug]);

  const boardSlug = system?.boardSlug || slug;
  const presenceId = system?.presenceId || "";

  const [jobs, setJobs] = useState<LiveJob[]>(() => readJobs(boardSlug));

  useEffect(() => {
    setJobs(readJobs(boardSlug));

    const refresh = () => setJobs(readJobs(boardSlug));
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [boardSlug]);

  const activeJobs = jobs.filter((job) => job.stage !== "Complete");
  const completedJobs = jobs.filter((job) => job.stage === "Complete");

  return (
    <div style={{ minHeight: "100vh", background: "#07111f", color: "white", padding: 18 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={hero}>
          <div style={eyebrow}>Staff Board</div>
          <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.02 }}>
            Team view for {boardSlug}
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.76)", lineHeight: 1.55 }}>
            Internal work queue tied to the same live board.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <Tag label={`Board: ${boardSlug}`} />
            {presenceId ? <Tag label={`Presence: ${presenceId}`} /> : null}
            <Tag label={`${jobs.length} live ${jobs.length === 1 ? "job" : "jobs"}`} />
          </div>
        </div>

        <div style={queueWrap}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={eyebrow}>Work Queue</div>
              <div style={{ marginTop: 6, color: "rgba(255,255,255,0.68)", fontSize: 13, fontWeight: 800 }}>
                These are the same jobs from the Live Board.
              </div>
            </div>

            <button type="button" style={buttonPrimary} onClick={() => nav(`/planet/live/${boardSlug}`)}>
              Add / Move Jobs
            </button>
          </div>

          <div style={stageGrid}>
            {LIVE_JOB_STAGES.map((stage) => {
              const stageJobs = jobs.filter((job) => job.stage === stage);

              return (
                <div key={stage} style={stageCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <strong>{stage}</strong>
                    <Tag label={String(stageJobs.length)} />
                  </div>

                  {stageJobs.length === 0 ? (
                    <div style={emptyBox}>No jobs here yet.</div>
                  ) : (
                    stageJobs.map((job) => (
                      <div key={job.id} style={jobCard}>
                        <div style={{ color: "#bae6fd", fontSize: 12, fontWeight: 950 }}>{job.customer}</div>
                        <div style={{ marginTop: 5, fontSize: 15, fontWeight: 950 }}>{job.title}</div>
                        {job.note ? <div style={jobNote}>{job.note}</div> : null}
                        <div style={jobTime}>Added {new Date(job.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={summaryGrid}>
          <Panel title="Active Work" body={`${activeJobs.length} open ${activeJobs.length === 1 ? "item" : "items"}`} />
          <Panel title="Completed" body={`${completedJobs.length} completed ${completedJobs.length === 1 ? "item" : "items"}`} />
          <Panel title="Live Board Link" body={`/planet/live/${boardSlug}`} />
          <Panel title="Lobby Board Link" body={`/planet/lobby/${boardSlug}`} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <button type="button" style={buttonPrimary} onClick={() => nav(`/planet/live/${boardSlug}`)}>
            Open Live Board
          </button>
          <button type="button" style={button} onClick={() => nav(`/planet/lobby/${boardSlug}`)}>
            Open Lobby Board
          </button>
          <button type="button" style={button} onClick={() => nav(`/planet/creator/${boardSlug}/moment`)}>
            Creator Moment
          </button>
        </div>
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return <div style={tag}>{label}</div>;
}

function Panel({ title, body }: { title: string; body: string }) {
  return (
    <div style={panel}>
      <div style={{ fontWeight: 950 }}>{title}</div>
      <div style={{ marginTop: 8, color: "rgba(255,255,255,0.72)", fontSize: 13, lineHeight: 1.45, wordBreak: "break-word" }}>
        {body}
      </div>
    </div>
  );
}

const eyebrow: CSSProperties = {
  fontSize: 12,
  fontWeight: 950,
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.68)",
  letterSpacing: 0.8,
};

const hero: CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.045)",
  padding: 18,
};

const queueWrap: CSSProperties = {
  marginTop: 18,
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.045)",
  padding: 18,
};

const stageGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
  marginTop: 16,
};

const stageCard: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.22)",
  padding: 14,
  minHeight: 180,
};

const jobCard: CSSProperties = {
  marginTop: 10,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.11)",
  background: "rgba(255,255,255,0.055)",
  padding: 12,
};

const jobNote: CSSProperties = {
  marginTop: 7,
  color: "rgba(255,255,255,0.68)",
  fontSize: 12,
  lineHeight: 1.45,
};

const jobTime: CSSProperties = {
  marginTop: 8,
  color: "rgba(255,255,255,0.38)",
  fontSize: 11,
  fontWeight: 800,
};

const emptyBox: CSSProperties = {
  marginTop: 12,
  borderRadius: 14,
  border: "1px dashed rgba(255,255,255,0.12)",
  padding: 12,
  color: "rgba(255,255,255,0.55)",
  fontSize: 13,
};

const summaryGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
  marginTop: 18,
};

const panel: CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.045)",
  padding: 16,
};

const tag: CSSProperties = {
  borderRadius: 999,
  padding: "8px 12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  fontSize: 12,
  fontWeight: 900,
};

const button: CSSProperties = {
  height: 42,
  padding: "0 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
  fontWeight: 900,
  fontSize: 12,
};

const buttonPrimary: CSSProperties = {
  ...button,
  border: "1px solid rgba(0,255,150,0.35)",
  background: "rgba(0,255,150,0.10)",
  color: "rgba(220,255,245,0.95)",
};