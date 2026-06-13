import React, { useState } from "react";

type Project = {
  id: number;
  status: string;
  title: string;
  progress: string;
  crew: string;
  note: string;
  tasks: string[];
  materials: string[];
  requests: string[];
  timeline: string[];
};

const starterProjects: Project[] = [
  {
    id: 1,
    status: "ON TRACK",
    title: "Palm Beach Waterfront Remodel",
    progress: "75%",
    crew: "Mike - Tony - Carlos",
    note: "Last update: 18 minutes ago",
    tasks: ["Drywall complete", "Paint complete", "Cabinets install", "Final cleanup"],
    materials: ["Cabinet hardware", "Trim pieces", "Paint touch-up"],
    requests: ["Walkthrough requested", "Flooring question"],
    timeline: ["8:04 AM Crew arrived", "9:12 AM Drywall complete", "10:37 AM Cabinets delivered", "12:48 PM Customer approved layout", "3:22 PM Progress photos uploaded"],
  },
  {
    id: 2,
    status: "WAITING ON MATERIALS",
    title: "Oceanfront Condo Renovation",
    progress: "42%",
    crew: "Chris - David",
    note: "Cabinet delivery pending",
    tasks: ["Demo complete", "Electrical rough-in", "Cabinets install", "Tile prep"],
    materials: ["Cabinets", "Backsplash tile", "Under-cabinet lighting"],
    requests: ["Customer asked for cabinet update"],
    timeline: ["7:52 AM Crew checked in", "10:18 AM Electrical marked", "1:05 PM Cabinet delivery delayed"],
  },
  {
    id: 3,
    status: "NEEDS ATTENTION",
    title: "Rental Property #12",
    progress: "61%",
    crew: "Crew Bravo",
    note: "Customer waiting on update",
    tasks: ["Patch walls", "Replace fixtures", "Final paint", "Owner walkthrough"],
    materials: ["Bathroom fixtures", "Door hardware", "Primer"],
    requests: ["Owner wants photo update", "Tenant move-in date question"],
    timeline: ["8:30 AM Issue found in bathroom", "11:40 AM Photos requested", "2:15 PM Waiting on fixture approval"],
  },
];

export default function IceConstructionCommandPage() {
  const [projects, setProjects] = useState<Project[]>(starterProjects);
  const [activeProjectId, setActiveProjectId] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCrew, setNewCrew] = useState("");
  const [newNote, setNewNote] = useState("");

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  function addProject() {
    if (!newTitle.trim()) return;

    const nextProject: Project = {
      id: Date.now(),
      status: "NEW PROJECT",
      title: newTitle.trim(),
      progress: "0%",
      crew: newCrew.trim() || "Unassigned",
      note: newNote.trim() || "Project created just now",
      tasks: ["Site walkthrough", "Confirm scope", "Assign crew", "Start project"],
      materials: ["Material list pending"],
      requests: ["No customer requests yet"],
      timeline: ["Just now Project created"],
    };

    setProjects([nextProject, ...projects]);
    setActiveProjectId(nextProject.id);
    setNewTitle("");
    setNewCrew("");
    setNewNote("");
    setAddOpen(false);
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>HOMEPLANET FIELD SYSTEM</p>
        <h1 style={styles.title}>Ice Construction Command</h1>
        <p style={styles.subtitle}>
          Know what's happening on every project - crews, materials, customers,
          budgets, photos, and updates in one live place.
        </p>

        <div style={styles.stats}>
          <div style={styles.stat}><b>{projects.length}</b><span> Active Projects</span></div>
          <div style={styles.stat}><b>4</b><span> Crews Working</span></div>
          <div style={styles.stat}><b>3</b><span> Deliveries Pending</span></div>
          <div style={styles.stat}><b>2</b><span> Customer Requests</span></div>
        </div>

        <button style={styles.addButton} onClick={() => setAddOpen(true)}>
          Add Project
        </button>
      </section>

      <section style={styles.grid}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            active={project.id === activeProjectId}
            onOpen={() => setActiveProjectId(project.id)}
          />
        ))}
      </section>

      <section style={styles.panel}>
        <h2>{activeProject.title}</h2>
        <p style={styles.muted}>{activeProject.progress} complete - {activeProject.crew} - {activeProject.note}</p>

        <div style={styles.columns}>
          <Box title="Today's Tasks" items={activeProject.tasks} />
          <Box title="Materials Needed" items={activeProject.materials} />
          <Box title="Customer Requests" items={activeProject.requests} />
        </div>
      </section>

      <section style={styles.panel}>
        <h2>Job Site QR Actions</h2>
        <p style={styles.muted}>Scan from the job site. No training. No confusion.</p>

        <div style={styles.actions}>
          <button style={styles.button}>Upload Photo</button>
          <button style={styles.button}>Material Delivered</button>
          <button style={styles.button}>Report Issue</button>
          <button style={styles.button}>Complete Task</button>
          <button style={styles.button}>Leave Note</button>
        </div>
      </section>

      <section style={styles.panel}>
        <h2>Live Project Timeline</h2>
        <div style={styles.timeline}>
          {activeProject.timeline.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section style={styles.footer}>
        <h2 style={styles.footerTitle}>Know something we don't?</h2>
        <p style={styles.footerText}>A better tool.</p>
        <p style={styles.footerText}>A better process.</p>
        <p style={styles.footerText}>A better idea.</p>
        <p style={styles.footerListening}>We're listening.</p>
        <p style={styles.footerSubtext}>The next great idea could come from anywhere.</p>

        <button style={styles.primary} onClick={() => setShareOpen(true)}>
          Share It
        </button>
      </section>

      {addOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button style={styles.close} onClick={() => setAddOpen(false)}>X</button>
            <p style={styles.kicker}>NEW PROJECT</p>
            <h2 style={styles.modalTitle}>Add a project</h2>
            <input style={styles.input} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Project name" />
            <input style={styles.input} value={newCrew} onChange={(e) => setNewCrew(e.target.value)} placeholder="Assigned crew" />
            <textarea style={styles.textarea} value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Current note or status..." />
            <button style={styles.primary} onClick={addProject}>Create Project</button>
          </div>
        </div>
      )}

      {shareOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button style={styles.close} onClick={() => setShareOpen(false)}>X</button>
            <p style={styles.kicker}>DROP IT HERE</p>
            <h2 style={styles.modalTitle}>Know something we don't?</h2>
            <p style={styles.muted}>Share a tool, shortcut, product, custom build, process, or idea that could make the work easier.</p>
            <input style={styles.input} placeholder="Your name or company" />
            <input style={styles.input} placeholder="Link, product, tool, or custom build" />
            <textarea style={styles.textarea} placeholder="Tell us what it is and why it matters..." />
            <button style={styles.primary} onClick={() => setShareOpen(false)}>Send Idea</button>
          </div>
        </div>
      )}
    </main>
  );
}

function ProjectCard({ project, active, onOpen }: any) {
  return (
    <article style={{ ...styles.card, ...(active ? styles.activeCard : {}) }}>
      <p style={styles.status}>{project.status}</p>
      <h3>{project.title}</h3>
      <p style={styles.progress}>{project.progress} Complete</p>
      <p style={styles.muted}>Crew: {project.crew}</p>
      <p style={styles.note}>{project.note}</p>
      <button style={styles.primary} onClick={onOpen}>Open Project</button>
    </article>
  );
}

function Box({ title, items }: any) {
  return (
    <div style={styles.box}>
      <h3>{title}</h3>
      {items.map((item: string) => <p key={item}>{item}</p>)}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0b0d0f", color: "#fff", padding: "28px", fontFamily: "Inter, system-ui, Arial, sans-serif" },
  hero: { maxWidth: 1100, margin: "0 auto 28px", padding: "36px", borderRadius: 28, background: "linear-gradient(135deg, #111820, #0b0d0f)", border: "1px solid #24303a" },
  kicker: { color: "#f97316", letterSpacing: 2, fontWeight: 900, fontSize: 13 },
  title: { fontSize: 52, lineHeight: 1, margin: "10px 0" },
  subtitle: { color: "#c8d0d8", fontSize: 18, maxWidth: 760 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginTop: 28 },
  stat: { background: "#10161c", border: "1px solid #24303a", borderRadius: 18, padding: 18 },
  addButton: { marginTop: 24, padding: "14px 22px", borderRadius: 999, border: "1px solid #39ff14", background: "transparent", color: "#39ff14", fontWeight: 900, cursor: "pointer" },
  grid: { maxWidth: 1100, margin: "0 auto 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 },
  card: { background: "#111820", border: "1px solid #24303a", borderRadius: 24, padding: 22 },
  activeCard: { border: "1px solid #39ff14", boxShadow: "0 0 22px rgba(57,255,20,0.12)" },
  status: { color: "#f97316", fontWeight: 900, fontSize: 13, letterSpacing: 1 },
  progress: { color: "#39ff14", fontWeight: 900 },
  muted: { color: "#aab5bd" },
  note: { color: "#fbbf24" },
  primary: { width: "100%", marginTop: 14, padding: "13px 16px", borderRadius: 999, border: "none", background: "#39ff14", color: "#071007", fontWeight: 900, cursor: "pointer" },
  panel: { maxWidth: 1100, margin: "0 auto 28px", background: "#111820", border: "1px solid #24303a", borderRadius: 24, padding: 24 },
  columns: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 18 },
  box: { background: "#0b0d0f", border: "1px solid #24303a", borderRadius: 18, padding: 18 },
  actions: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginTop: 18 },
  button: { padding: "16px", borderRadius: 18, border: "1px solid #2f3b46", background: "#0b0d0f", color: "#fff", fontWeight: 800, cursor: "pointer" },
  timeline: { borderLeft: "3px solid #39ff14", paddingLeft: 18, color: "#dce5ea" },
  footer: { maxWidth: 1100, margin: "60px auto 0", padding: "48px 24px", textAlign: "center", borderTop: "1px solid #24303a" },
  footerTitle: { fontSize: 36, fontWeight: 900, marginBottom: 24 },
  footerText: { fontSize: 22, color: "#dce5ea", margin: "8px 0" },
  footerListening: { marginTop: 24, fontSize: 18, color: "#39ff14", fontWeight: 800 },
  footerSubtext: { marginTop: 12, marginBottom: 24, color: "#aab5bd", fontSize: 16 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 999 },
  modal: { position: "relative", width: "100%", maxWidth: 560, background: "#111820", border: "1px solid #2f3b46", borderRadius: 28, padding: 28, boxShadow: "0 24px 80px rgba(0,0,0,0.55)" },
  modalTitle: { fontSize: 34, margin: "8px 0 10px" },
  close: { position: "absolute", top: 18, right: 18, width: 38, height: 38, borderRadius: 999, border: "1px solid #2f3b46", background: "#0b0d0f", color: "#fff", fontWeight: 900, cursor: "pointer" },
  input: { width: "100%", boxSizing: "border-box", marginTop: 14, padding: "14px 16px", borderRadius: 14, border: "1px solid #2f3b46", background: "#0b0d0f", color: "#fff", fontSize: 15 },
  textarea: { width: "100%", boxSizing: "border-box", minHeight: 120, marginTop: 14, padding: "14px 16px", borderRadius: 14, border: "1px solid #2f3b46", background: "#0b0d0f", color: "#fff", fontSize: 15 },
};
