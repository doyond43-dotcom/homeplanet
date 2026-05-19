import { useMemo } from "react";
import { useParams } from "react-router-dom";

type Job = {
  id?: string;
  customer?: string;
  name?: string;
  service?: string;
  address?: string;
  phone?: string;
  stage?: string;
  status?: string;
  notes?: string;
  timeline?: string[];
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

function readJobs(boardSlug: string): Job[] {
  try {
    const raw = localStorage.getItem(jobsKey(boardSlug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function OperationalStaffBoard() {
  const { boardSlug = "zands-light-xand" } = useParams();
  const businessName = titleFromSlug(boardSlug);
  const jobs = useMemo(() => readJobs(boardSlug), [boardSlug]);

  const activeJob =
    jobs[0] || {
      customer: "Maria Jenkins",
      service: "House wash + driveway cleaning",
      address: "Okeechobee, FL",
      phone: "863-555-0184",
      stage: "In Progress",
      notes: "Live staff monitor waiting for field updates.",
      timeline: ["Customer request submitted", "Staff board opened"],
    };

  return (
    <main style={page}>
      <button
        type="button"
        onClick={() => window.location.assign("/planet/zands-light-xand")}
        style={backButton}
      >
        ← Back to Liveboard
      </button>

      <section style={{ maxWidth: 1320, margin: "0 auto" }}>
        <header style={hero}>
          <div>
            <div style={pill}>OFFICE STAFF MONITOR</div>
            <h1 style={title}>{businessName}</h1>
            <p style={subtitle}>
              Watch crew progress, customer requests, proof updates, payments, and job movement from one clean staff view.
            </p>
          </div>
        </header>

        <section style={grid}>
          <div style={panel}>
            <div style={sectionTitle}>LIVE CREW UPDATES</div>

            <div style={jobCard}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 24 }}>
                    {activeJob.customer || activeJob.name || "New Customer"}
                  </h2>
                  <div style={muted}>{activeJob.service || "Service request"}</div>
                </div>

                <div style={statusPill}>{activeJob.stage || activeJob.status || "New Request"}</div>
              </div>

              <div style={infoGrid}>
                <Info label="Phone" value={activeJob.phone || "Not added"} />
                <Info label="Address" value={activeJob.address || "Not added"} />
                <Info label="Current Status" value={activeJob.stage || activeJob.status || "Not started"} />
              </div>

              <p style={notes}>{activeJob.notes || "No notes added yet."}</p>
            </div>
          </div>

          <aside style={panel}>
            <div style={sectionTitleGreen}>STAFF WATCH PANEL</div>

            <div style={watchBox}>
              <div style={smallLabel}>LIVE FIELD STATUS</div>
              <div style={{ marginTop: 8, fontSize: 28, fontWeight: 950 }}>
                {activeJob.stage || activeJob.status || "Not started"}
              </div>
            </div>

            <div style={timelineBox}>
              <div style={smallLabel}>FIELD TIMELINE</div>

              {(activeJob.timeline?.length ? activeJob.timeline : ["Customer request submitted"]).map((item, index) => (
                <div key={`${item}-${index}`} style={timelineRow}>
                  <span style={{ color: "#22d3ee" }}>●</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoBox}>
      <div style={smallLabel}>{label}</div>
      <div style={{ marginTop: 6, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 16% 10%, rgba(56,189,248,0.16), transparent 34%), radial-gradient(circle at 84% 14%, rgba(16,185,129,0.13), transparent 32%), #020817",
  color: "white",
  padding: 24,
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const backButton: React.CSSProperties = {
  position: "fixed",
  top: 18,
  left: 18,
  zIndex: 9999,
  borderRadius: 999,
  border: "1px solid rgba(56,189,248,0.35)",
  background: "rgba(15,23,42,0.88)",
  color: "white",
  padding: "11px 18px",
  fontWeight: 950,
  cursor: "pointer",
  boxShadow: "0 0 26px rgba(56,189,248,0.18)",
};

const hero: React.CSSProperties = {
  borderRadius: 30,
  border: "1px solid rgba(56,189,248,0.18)",
  background: "linear-gradient(145deg, rgba(8,47,73,0.35), rgba(2,6,23,0.72))",
  padding: "34px 38px",
  boxShadow: "0 26px 90px rgba(0,0,0,0.35)",
  marginBottom: 22,
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  borderRadius: 999,
  border: "1px solid rgba(56,189,248,0.30)",
  background: "rgba(14,165,233,0.13)",
  color: "#bae6fd",
  padding: "8px 14px",
  fontSize: 12,
  fontWeight: 950,
  letterSpacing: 1.4,
};

const title: React.CSSProperties = {
  margin: "18px 0 8px",
  fontSize: 48,
  lineHeight: 1,
  fontWeight: 500,
  letterSpacing: -1.5,
};

const subtitle: React.CSSProperties = {
  margin: 0,
  color: "rgba(186,230,253,0.72)",
  fontSize: 18,
  fontWeight: 700,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 430px",
  gap: 22,
  alignItems: "start",
};

const panel: React.CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(56,189,248,0.18)",
  background: "linear-gradient(160deg, rgba(8,47,73,0.30), rgba(2,6,23,0.74))",
  padding: 24,
  boxShadow: "0 24px 80px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const sectionTitle: React.CSSProperties = {
  color: "#bae6fd",
  fontSize: 15,
  fontWeight: 950,
  letterSpacing: 1.2,
  marginBottom: 16,
};

const sectionTitleGreen: React.CSSProperties = {
  ...sectionTitle,
  color: "#86efac",
};

const jobCard: React.CSSProperties = {
  borderRadius: 24,
  border: "1px solid rgba(34,211,238,0.25)",
  background: "linear-gradient(145deg, rgba(34,211,238,0.14), rgba(2,6,23,0.60))",
  padding: 22,
};

const muted: React.CSSProperties = {
  marginTop: 8,
  color: "rgba(226,232,240,0.68)",
  fontSize: 16,
};

const statusPill: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(34,197,94,0.35)",
  background: "rgba(16,185,129,0.14)",
  color: "#86efac",
  padding: "9px 14px",
  fontWeight: 950,
};

const infoGrid: React.CSSProperties = {
  marginTop: 18,
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 12,
};

const infoBox: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.12)",
  background: "rgba(15,23,42,0.52)",
  padding: 14,
};

const smallLabel: React.CSSProperties = {
  color: "rgba(186,230,253,0.62)",
  fontSize: 12,
  fontWeight: 950,
  letterSpacing: 1.2,
};

const notes: React.CSSProperties = {
  margin: "18px 0 0",
  color: "rgba(226,232,240,0.78)",
  lineHeight: 1.6,
};

const watchBox: React.CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(34,197,94,0.20)",
  background: "rgba(16,185,129,0.10)",
  padding: 18,
};

const timelineBox: React.CSSProperties = {
  marginTop: 18,
  borderRadius: 22,
  border: "1px solid rgba(148,163,184,0.10)",
  background: "rgba(2,6,23,0.48)",
  padding: 18,
};

const timelineRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  marginTop: 12,
  color: "rgba(226,232,240,0.78)",
  fontWeight: 700,
};
