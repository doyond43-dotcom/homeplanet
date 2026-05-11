import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

type OperationalJob = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  notes: string;
  stage: string;
  paymentStatus: "not-ready" | "invoice-ready" | "paid";
  beforePhotos: string[];
  afterPhotos: string[];
  timeline: string[];
  crewStatus?: string;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function jobsKey(boardSlug: string) {
  return `hp-operational-board:${boardSlug}:jobs`;
}

function readJobs(boardSlug: string): OperationalJob[] {
  try {
    const raw = localStorage.getItem(jobsKey(boardSlug));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function OperationalStaffBoard() {
  const params = useParams();
  const boardSlug = params.boardSlug || params.slug || "business";
  const businessName = titleFromSlug(boardSlug);

  const [jobs, setJobs] = useState<OperationalJob[]>(() => readJobs(boardSlug));
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id ?? null);

  const selected = useMemo(
    () => jobs.find((job) => job.id === selectedId) || jobs[0] || null,
    [jobs, selectedId]
  );

  useEffect(() => {
    const refresh = () => setJobs(readJobs(boardSlug));
    refresh();

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    const timer = window.setInterval(refresh, 1200);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.clearInterval(timer);
    };
  }, [boardSlug]);

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background:
      "#050505",
    color: "white",
    padding: 18,
  };

  const card: React.CSSProperties = {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.035)",
    boxShadow: "0 22px 70px rgba(0,0,0,0.32)",
    padding: 16,
  };

  return (
    <main style={page}>
      <section style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 14 }}>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 950, color: "#bae6fd", letterSpacing: 1.2 }}>
            OFFICE STAFF MONITOR
          </div>
          <h1 style={{ margin: "8px 0 4px", fontSize: 38 }}>{businessName}</h1>
          <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 800 }}>
            Watch crew progress, field updates, proof timeline, and job movement.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 430px", gap: 14, alignItems: "start" }}>
          <section style={{ ...card, display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 950, fontSize: 18 }}>Live Crew Updates</div>

            {jobs.length ? (
              jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedId(job.id)}
                  style={{
                    textAlign: "left",
                    borderRadius: 20,
                    border:
                      selected?.id === job.id
                        ? "1px solid rgba(255,255,255,0.18)"
                        : "1px solid rgba(255,255,255,0.10)",
                    background:
                      selected?.id === job.id ? "rgba(34,211,238,0.12)" : "rgba(0,0,0,0.22)",
                    color: "white",
                    padding: 14,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 950 }}>{job.customer}</div>
                  <div style={{ marginTop: 5, color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
                    {job.service}
                  </div>
                  <div style={{ marginTop: 8, color: "#bae6fd", fontSize: 12, fontWeight: 950 }}>
                    Office Status: {job.stage}
                  </div>
                  <div style={{ color: "#000", fontSize: 12, fontWeight: 950 }}>
                    Crew Status: {job.crewStatus || "Not started"}
                  </div>
                </button>
              ))
            ) : (
              <div style={{ color: "rgba(255,255,255,0.55)" }}>No jobs yet.</div>
            )}
          </section>

          <aside style={{ ...card, position: "sticky", top: 16 }}>
            {selected ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 950, color: "#86efac", letterSpacing: 1.1 }}>
                  STAFF WATCH PANEL
                </div>
                <h2 style={{ margin: "8px 0 4px" }}>{selected.customer}</h2>
                <div style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  {selected.address || "No address listed"}
                  <br />
                  {selected.phone || "No phone listed"}
                </div>

                <div style={{ marginTop: 14, borderRadius: 16, border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.10)", padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 950, color: "rgba(167,243,208,0.8)" }}>
                    LIVE FIELD STATUS
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 950, color: "#000" }}>
                    {selected.crewStatus || "Not started"}
                  </div>
                </div>

                <div style={{ marginTop: 12, borderRadius: 16, background: "rgba(0,0,0,0.25)", padding: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 950, color: "rgba(255,255,255,0.45)" }}>
                    FIELD TIMELINE
                  </div>
                  <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                    {selected.timeline.map((item, index) => (
                      <div key={`${item}-${index}`} style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.55)" }}>Select a job.</div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}


