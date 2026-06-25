import React, { useEffect, useState } from "react";
import { hpEvent } from "../lib/hpEvent";

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
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<Project[]>(starterProjects);
  const [activeProjectId, setActiveProjectId] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newCrew, setNewCrew] = useState("");
  const [newNote, setNewNote] = useState("");
  const [fieldText, setFieldText] = useState("");

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 700);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const pageStyle = isMobile ? { ...styles.page, ...styles.pageMobile } : styles.page;
  const heroStyle = isMobile ? { ...styles.hero, ...styles.heroMobile } : styles.hero;
  const titleStyle = isMobile ? { ...styles.title, ...styles.titleMobile } : styles.title;
  const subtitleStyle = isMobile ? { ...styles.subtitle, ...styles.subtitleMobile } : styles.subtitle;
  const footerTitleStyle = isMobile ? { ...styles.footerTitle, ...styles.footerTitleMobile } : styles.footerTitle;

  function now() {
    return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  function updateActiveProject(updater: (project: Project) => Project) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId ? updater(project) : project
      )
    );
  }

  function addTimeline(message: string) {
    updateActiveProject((project) => ({
      ...project,
      timeline: [`${now()} ${message}`, ...project.timeline],
      note: message,
    }));
  }

  function completeTask() {
    const task = activeProject.tasks[0];
    if (!task) {
      addTimeline("No open tasks to complete");
      return;
    }

    updateActiveProject((project) => ({
      ...project,
      tasks: project.tasks.slice(1),
      timeline: [`${now()} Task completed: ${task}`, ...project.timeline],
      note: `Task completed: ${task}`,
      progress: project.progress === "0%" ? "10%" : project.progress,
    }));
  }

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
      timeline: [`${now()} Project created`],
    };

    setProjects([nextProject, ...projects]);
    setActiveProjectId(nextProject.id);
    setNewTitle("");
    setNewCrew("");
    setNewNote("");
    setAddOpen(false);
  }

  function submitFieldEntry(type: "note" | "issue") {
    if (!fieldText.trim()) return;

    if (type === "note") {
      addTimeline(`Note added: ${fieldText.trim()}`);
      setNoteOpen(false);
    } else {
      updateActiveProject((project) => ({
        ...project,
        status: "NEEDS ATTENTION",
        note: `Issue reported: ${fieldText.trim()}`,
        requests: [`Issue reported: ${fieldText.trim()}`, ...project.requests],
        timeline: [`${now()} Issue reported: ${fieldText.trim()}`, ...project.timeline],
      }));
      setIssueOpen(false);
    }

    setFieldText("");
  }

  return (
    <main style={pageStyle}>
      <section style={heroStyle}>
        <p style={styles.kicker}>HOMEPLANET FIELD SYSTEM</p>
        <h1 style={titleStyle}>Ice Construction Command</h1>
        <p style={subtitleStyle}>
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
          <Box title="Today's Tasks" items={activeProject.tasks.length ? activeProject.tasks : ["All tasks complete"]} />
          <Box title="Materials Needed" items={activeProject.materials} />
          <Box title="Customer Requests" items={activeProject.requests} />
        </div>
      </section>

      <section style={styles.panel}>
        <h2>Job Site QR Actions</h2>
        <p style={styles.muted}>Scan from the job site. No training. No confusion.</p>

        <div style={styles.actions}>
          <button style={styles.button} onClick={() => addTimeline("Progress photo uploaded")}>Upload Photo</button>
          <button style={styles.button} onClick={() => addTimeline("Material delivered")}>Material Delivered</button>
          <button style={styles.button} onClick={() => { setFieldText(""); setIssueOpen(true); }}>Report Issue</button>
          <button style={styles.button} onClick={completeTask}>Complete Task</button>
          <button style={styles.button} onClick={() => { setFieldText(""); setNoteOpen(true); }}>Leave Note</button>
        </div>
      </section>

      <section style={styles.panel}>
        <h2>Live Project Timeline</h2>
        <div style={styles.timeline}>
          {activeProject.timeline.map((item, index) => (
            <p key={`${item}-${index}`}>{item}</p>
          ))}
        </div>
      </section>

      <section style={styles.footer}>
        <h2 style={footerTitleStyle}>Project operations stay connected.</h2>
        <p style={styles.footerSubtext}>
          Return to the public ICE Construction experience.
        </p>

        <button
          style={styles.primary}
          onClick={() => {
            hpEvent({ event: "ice_click_back_to_landing", board: "ice-construction-command", meta: { path: window.location.pathname } });
            window.location.href = "/planet/ice-construction";
          }}
        >
          Back to ICE Construction Page
        </button>
      </section>

      {addOpen && (
        <Modal title="Add a project" kicker="NEW PROJECT" onClose={() => setAddOpen(false)}>
          <input style={styles.input} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Project name" />
          <input style={styles.input} value={newCrew} onChange={(e) => setNewCrew(e.target.value)} placeholder="Assigned crew" />
          <textarea style={styles.textarea} value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Current note or status..." />
          <button style={styles.primary} onClick={addProject}>Create Project</button>
        </Modal>
      )}

      {noteOpen && (
        <Modal title="Leave a note" kicker="FIELD NOTE" onClose={() => setNoteOpen(false)}>
          <textarea style={styles.textarea} value={fieldText} onChange={(e) => setFieldText(e.target.value)} placeholder="Example: Customer requested white cabinets..." />
          <button style={styles.primary} onClick={() => submitFieldEntry("note")}>Add Note</button>
        </Modal>
      )}

      {issueOpen && (
        <Modal title="Report an issue" kicker="NEEDS ATTENTION" onClose={() => setIssueOpen(false)}>
          <textarea style={styles.textarea} value={fieldText} onChange={(e) => setFieldText(e.target.value)} placeholder="Example: Missing trim pieces, water damage found, delivery delayed..." />
          <button style={styles.primary} onClick={() => submitFieldEntry("issue")}>Report Issue</button>
        </Modal>
      )}

      {shareOpen && (
        <Modal title="Know something we don't?" kicker="DROP IT HERE" onClose={() => setShareOpen(false)}>
          <p style={styles.muted}>Share a tool, shortcut, product, custom build, process, or idea that could make the work easier.</p>
          <input style={styles.input} placeholder="Your name or company" />
          <input style={styles.input} placeholder="Link, product, tool, or custom build" />
          <textarea style={styles.textarea} placeholder="Tell us what it is and why it matters..." />
          <button style={styles.primary} onClick={() => setShareOpen(false)}>Send Idea</button>
        </Modal>
      )}
    </main>
  );
}

function ProjectCard({ project, active, onOpen }: any) {
  return (
    <article style={{ ...styles.card, ...(active ? styles.activeCard : {}) }}>
      <div style={styles.cardContent}>
        <p style={styles.status}>{project.status}</p>
        <h3>{project.title}</h3>
        <p style={styles.progress}>{project.progress} Complete</p>
        <p style={styles.muted}>Crew: {project.crew}</p>
        <p style={styles.note}>{project.note}</p>
      </div>
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

function Modal({ title, kicker, onClose, children }: any) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.close} onClick={onClose}>X</button>
        <p style={styles.kicker}>{kicker}</p>
        <h2 style={styles.modalTitle}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0b0d0f", color: "#fff", padding: "28px", fontFamily: "Inter, system-ui, Arial, sans-serif" },
  pageMobile: { padding: "18px 14px" },
  hero: { maxWidth: 1100, margin: "0 auto 28px", padding: "36px", borderRadius: 28, background: "linear-gradient(135deg, #111820, #0b0d0f)", border: "1px solid #24303a", overflow: "hidden" },
  heroMobile: { padding: "26px 22px", borderRadius: 24 },
  kicker: { color: "#f97316", letterSpacing: 2, fontWeight: 900, fontSize: 13 },
  title: { fontSize: 52, lineHeight: 1, margin: "10px 0", overflowWrap: "break-word" },
  titleMobile: { fontSize: 52, lineHeight: 1.02, letterSpacing: "-1px" },
  subtitle: { color: "#c8d0d8", fontSize: 18, maxWidth: 760 },
  subtitleMobile: { fontSize: 22, lineHeight: 1.45 },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginTop: 28 },
  stat: { background: "#10161c", border: "1px solid #24303a", borderRadius: 18, padding: 18 },
  addButton: { marginTop: 24, padding: "14px 22px", borderRadius: 999, border: "1px solid #39ff14", background: "transparent", color: "#39ff14", fontWeight: 900, cursor: "pointer" },
  grid: { maxWidth: 1100, margin: "0 auto 28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18, alignItems: "stretch" },
  card: { background: "#111820", border: "1px solid #24303a", borderRadius: 24, padding: 22, display: "flex", flexDirection: "column", minHeight: 250 },
  cardContent: { flex: 1 },
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
  footerTitleMobile: { fontSize: 48, lineHeight: 1.12 },
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



