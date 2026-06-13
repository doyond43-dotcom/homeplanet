import React from "react";

export default function IceConstructionCommandPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>HOMEPLANET FIELD SYSTEM</p>
        <h1 style={styles.title}>Ice Construction Command</h1>
        <p style={styles.subtitle}>
          Know what’s happening on every project — crews, materials, customers,
          budgets, photos, and updates in one live place.
        </p>

        <div style={styles.stats}>
          <div style={styles.stat}><b>17</b><span>Active Projects</span></div>
          <div style={styles.stat}><b>4</b><span>Crews Working</span></div>
          <div style={styles.stat}><b>3</b><span>Deliveries Pending</span></div>
          <div style={styles.stat}><b>2</b><span>Customer Requests</span></div>
        </div>
      </section>

      <section style={styles.grid}>
        <ProjectCard
          status="?? On Track"
          title="Palm Beach Waterfront Remodel"
          progress="75%"
          crew="Mike • Tony • Carlos"
          note="Last update: 18 minutes ago"
        />
        <ProjectCard
          status="?? Waiting On Materials"
          title="Oceanfront Condo Renovation"
          progress="42%"
          crew="Chris • David"
          note="Cabinet delivery pending"
        />
        <ProjectCard
          status="?? Needs Attention"
          title="Rental Property #12"
          progress="61%"
          crew="Crew Bravo"
          note="Customer waiting on update"
        />
      </section>

      <section style={styles.panel}>
        <h2>Palm Beach Waterfront Remodel</h2>
        <p style={styles.muted}>75% complete • Crew on site • Customer updated today</p>

        <div style={styles.columns}>
          <Box title="Today’s Tasks" items={["? Drywall complete", "? Paint complete", "? Cabinets install", "? Final cleanup"]} />
          <Box title="Materials Needed" items={["? Cabinet hardware", "? Trim pieces", "? Paint touch-up"]} />
          <Box title="Customer Requests" items={["?? Walkthrough requested", "?? Flooring question"]} />
        </div>
      </section>

      <section style={styles.panel}>
        <h2>Job Site QR Actions</h2>
        <p style={styles.muted}>Scan from the job site. No training. No confusion.</p>

        <div style={styles.actions}>
          <button style={styles.button}>?? Upload Photo</button>
          <button style={styles.button}>?? Material Delivered</button>
          <button style={styles.button}>? Report Issue</button>
          <button style={styles.button}>? Complete Task</button>
          <button style={styles.button}>?? Leave Note</button>
        </div>
      </section>

      <section style={styles.panel}>
        <h2>Live Project Timeline</h2>
        <div style={styles.timeline}>
          <p><b>8:04 AM</b> Crew arrived</p>
          <p><b>9:12 AM</b> Drywall complete</p>
          <p><b>10:37 AM</b> Cabinets delivered</p>
          <p><b>12:48 PM</b> Customer approved layout</p>
          <p><b>3:22 PM</b> Progress photos uploaded</p>
        </div>
      </section>
    </main>
  );
}

function ProjectCard({ status, title, progress, crew, note }: any) {
  return (
    <article style={styles.card}>
      <p style={styles.status}>{status}</p>
      <h3>{title}</h3>
      <p style={styles.progress}>{progress} Complete</p>
      <p style={styles.muted}>Crew: {crew}</p>
      <p style={styles.note}>{note}</p>
      <button style={styles.primary}>Open Project</button>
    </article>
  );
}

function Box({ title, items }: any) {
  return (
    <div style={styles.box}>
      <h3>{title}</h3>
      {items.map((item: string) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0b0d0f",
    color: "#fff",
    padding: "28px",
    fontFamily: "Inter, system-ui, Arial, sans-serif",
  },
  hero: {
    maxWidth: 1100,
    margin: "0 auto 28px",
    padding: "36px",
    borderRadius: 28,
    background: "linear-gradient(135deg, #111820, #0b0d0f)",
    border: "1px solid #24303a",
  },
  kicker: { color: "#f97316", letterSpacing: 2, fontWeight: 800 },
  title: { fontSize: 52, lineHeight: 1, margin: "10px 0" },
  subtitle: { color: "#c8d0d8", fontSize: 18, maxWidth: 760 },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
    marginTop: 28,
  },
  stat: {
    background: "#10161c",
    border: "1px solid #24303a",
    borderRadius: 18,
    padding: 18,
  },
  grid: {
    maxWidth: 1100,
    margin: "0 auto 28px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
  },
  card: {
    background: "#111820",
    border: "1px solid #24303a",
    borderRadius: 24,
    padding: 22,
  },
  status: { color: "#d6e2ea", fontWeight: 800 },
  progress: { color: "#39ff14", fontWeight: 900 },
  muted: { color: "#aab5bd" },
  note: { color: "#fbbf24" },
  primary: {
    width: "100%",
    marginTop: 14,
    padding: "13px 16px",
    borderRadius: 999,
    border: "none",
    background: "#39ff14",
    color: "#071007",
    fontWeight: 900,
    cursor: "pointer",
  },
  panel: {
    maxWidth: 1100,
    margin: "0 auto 28px",
    background: "#111820",
    border: "1px solid #24303a",
    borderRadius: 24,
    padding: 24,
  },
  columns: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 18,
  },
  box: {
    background: "#0b0d0f",
    border: "1px solid #24303a",
    borderRadius: 18,
    padding: 18,
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  button: {
    padding: "16px",
    borderRadius: 18,
    border: "1px solid #2f3b46",
    background: "#0b0d0f",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  timeline: {
    borderLeft: "3px solid #39ff14",
    paddingLeft: 18,
    color: "#dce5ea",
  },
};

