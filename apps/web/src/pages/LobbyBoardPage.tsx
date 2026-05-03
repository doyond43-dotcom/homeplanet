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

const PUBLIC_STAGE_COPY: Record<LiveJobStage, string> = {
  "New Intake": "Received",
  "In Progress": "In progress",
  "Needs Attention": "Needs attention",
  "Complete": "Complete",
};

function readJobs(boardSlug: string): LiveJob[] {
  try {
    const raw = localStorage.getItem(`hp-live-board:${boardSlug}:jobs`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function LobbyBoardPage() {
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
  const businessName = system?.businessName || boardSlug;

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

  return (
    <div style={page}>
      <div style={shell}>
        <section style={hero}>
          <div style={eyebrow}>Lobby Board</div>
          <h1 style={title}>{businessName}</h1>
          <p style={muted}>
            Public-safe status view. Customers can see progress without internal staff notes.
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <Tag label={`Board: ${boardSlug}`} />
            <Tag label={`${jobs.length} visible ${jobs.length === 1 ? "item" : "items"}`} />
          </div>
        </section>

        <section style={panel}>
          <div style={eyebrow}>Current Status</div>

          <div style={grid}>
            {jobs.length === 0 ? (
              <div style={emptyBox}>No public job status yet.</div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} style={jobCard}>
                  <div style={{ color: "#bae6fd", fontSize: 12, fontWeight: 950 }}>
                    {job.customer}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 18, fontWeight: 950 }}>
                    {job.title}
                  </div>
                  <div style={statusPill}>{PUBLIC_STAGE_COPY[job.stage] || job.stage}</div>
                  <div style={jobTime}>Updated {new Date(job.updatedAt || job.createdAt).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </section>

        <section style={{ ...panel, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={buttonPrimary} onClick={() => nav(`/planet/live/${boardSlug}`)}>
            Open Working Board
          </button>
          <button style={button} onClick={() => nav(`/planet/system/${boardSlug}`)}>
            System Home
          </button>
        </section>
      </div>
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return <div style={tag}>{label}</div>;
}

const page: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(900px 600px at 15% 10%, rgba(56,189,248,0.14), transparent 55%), linear-gradient(180deg, #020617 0%, #030712 100%)",
  color: "white",
  padding: 22,
};

const shell: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  display: "grid",
  gap: 16,
};

const hero: CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.045)",
  padding: 18,
};

const panel: CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.045)",
  padding: 18,
};

const eyebrow: CSSProperties = {
  fontSize: 12,
  fontWeight: 950,
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.68)",
  letterSpacing: 0.8,
};

const title: CSSProperties = {
  margin: "10px 0 8px",
  fontSize: "clamp(2rem, 5vw, 3rem)",
  lineHeight: 1.02,
};

const muted: CSSProperties = {
  margin: 0,
  color: "rgba(255,255,255,0.76)",
  lineHeight: 1.55,
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
  marginTop: 16,
};

const jobCard: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.22)",
  padding: 14,
};

const statusPill: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  marginTop: 10,
  borderRadius: 999,
  border: "1px solid rgba(112,242,163,0.30)",
  background: "rgba(112,242,163,0.10)",
  color: "#bbf7d0",
  padding: "7px 10px",
  fontSize: 12,
  fontWeight: 950,
};

const jobTime: CSSProperties = {
  marginTop: 10,
  color: "rgba(255,255,255,0.42)",
  fontSize: 11,
  fontWeight: 800,
};

const emptyBox: CSSProperties = {
  borderRadius: 18,
  border: "1px dashed rgba(255,255,255,0.14)",
  padding: 16,
  color: "rgba(255,255,255,0.58)",
  fontSize: 13,
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
