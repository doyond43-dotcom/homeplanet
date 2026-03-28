// src/pages/DanFieldNotebookDesk.tsx
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
} from "react";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  FileText,
  FolderOpen,
  Mic,
  Paperclip,
  Phone,
  Plus,
  Printer,
  Save,
  Search,
  Send,
  StickyNote,
  Tag,
  Trash2,
  Upload,
  User,
} from "lucide-react";

type ProjectStage =
  | "new-lead"
  | "quoted"
  | "scheduled"
  | "in-progress"
  | "waiting"
  | "follow-up"
  | "complete";

type ProjectPriority = "high" | "medium" | "normal";
type DocStatus = "ready" | "waiting" | "sent";
type AttachmentKind = "photo" | "file";
type BeamTarget = "Self" | "Customer" | "Team" | "Attorney";

type Project = {
  id: string;
  customer: string;
  project: string;
  due: string;
  stage: ProjectStage;
  priority: ProjectPriority;
  summary: string;
  contact: string;
  nextAction: string;
  location: string;
};

type Appointment = {
  id: string;
  time: string;
  title: string;
  project: string;
  type: string;
};

type Sticky = {
  id: string;
  title: string;
  text: string;
};

type DocItem = {
  id: string;
  label: string;
  detail: string;
  status: DocStatus;
};

type AttachmentItem = {
  id: string;
  name: string;
  kind: AttachmentKind;
  type: string;
};

type SavedNote = {
  id: string;
  projectId: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  timestampedAt: string | null;
  attachments: AttachmentItem[];
};

const STAGE_LABELS: Record<ProjectStage, string> = {
  "new-lead": "New Lead",
  quoted: "Quoted",
  scheduled: "Scheduled",
  "in-progress": "In Progress",
  waiting: "Waiting",
  "follow-up": "Follow-up",
  complete: "Complete",
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: "PROJ-24018",
    customer: "AWNIT",
    project: "Live board polish / field presentation prep",
    due: "Today · 11:00 AM",
    stage: "in-progress",
    priority: "high",
    summary:
      "Tighten live board flow, check tablet feel, and prep a cleaner field-ready walkthrough.",
    contact: "(863) 555-0148",
    nextAction: "Confirm final talking points and capture one clean demo note.",
    location: "Okeechobee, FL",
  },
  {
    id: "PROJ-24022",
    customer: "Taylor Creek Auto Repair",
    project: "Intake board / customer flow follow-up",
    due: "Today · 2:30 PM",
    stage: "follow-up",
    priority: "high",
    summary:
      "Need to review intake flow, note friction points, and prep next round of field observations.",
    contact: "(863) 555-0172",
    nextAction: "Capture what the owner and staff still need most on-site.",
    location: "Okeechobee, FL",
  },
  {
    id: "PROJ-24011",
    customer: "Janet's Interiors",
    project: "One-page lander / live operation demo",
    due: "Tomorrow · 9:15 AM",
    stage: "quoted",
    priority: "medium",
    summary:
      "Presentation-ready customer page with live links and cleaner business-facing structure.",
    contact: "(863) 555-0102",
    nextAction: "Refine message and package the right links for customer review.",
    location: "Florida",
  },
  {
    id: "PROJ-24004",
    customer: "New Field Lead",
    project: "Discovery visit / needs capture",
    due: "Tomorrow · 4:00 PM",
    stage: "new-lead",
    priority: "normal",
    summary:
      "Fresh lead that needs notes, quick observations, and a clean next step before it gets lost.",
    contact: "(863) 555-0160",
    nextAction: "Capture site notes, photo proof, and a simple follow-up summary.",
    location: "Okeechobee, FL",
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-1",
    time: "9:00 AM",
    title: "AWNIT field check-in",
    project: "Live board polish / field presentation prep",
    type: "On Site",
  },
  {
    id: "APT-2",
    time: "12:30 PM",
    title: "Taylor Creek follow-up",
    project: "Intake board / customer flow follow-up",
    type: "Call",
  },
  {
    id: "APT-3",
    time: "4:15 PM",
    title: "New lead notes review",
    project: "Discovery visit / needs capture",
    type: "Internal",
  },
];

const INITIAL_STICKIES: Sticky[] = [
  {
    id: "ST-1",
    title: "Field reminder",
    text: "Take one clean timestamped photo before leaving the site.",
  },
  {
    id: "ST-2",
    title: "Customer follow-up",
    text: "Keep the explanation simple and show only the strongest live link first.",
  },
  {
    id: "ST-3",
    title: "Truck thought",
    text: "If something clicks in the field, write it now before it disappears.",
  },
];

const INITIAL_DOCS: DocItem[] = [
  {
    id: "DOC-1",
    label: "Proposal notes",
    detail: "Ready to refine before the next customer conversation.",
    status: "ready",
  },
  {
    id: "DOC-2",
    label: "Field photo batch",
    detail: "Waiting on final attach and timestamp review.",
    status: "waiting",
  },
  {
    id: "DOC-3",
    label: "Follow-up message draft",
    detail: "Sent to yourself for refinement.",
    status: "sent",
  },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatNow(date = new Date()) {
  return date.toLocaleString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatLiveDate(date: Date) {
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatLiveTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function makeProject(): Project {
  return {
    id: `PROJ-${Date.now()}`,
    customer: "New Customer",
    project: "New project",
    due: "No due date",
    stage: "new-lead",
    priority: "normal",
    summary: "Add project summary.",
    contact: "(000) 000-0000",
    nextAction: "Add next action.",
    location: "Add location",
  };
}

function makeAppointment(): Appointment {
  return {
    id: `APT-${Date.now()}`,
    time: "New",
    title: "New appointment",
    project: "Attach to project",
    type: "Call",
  };
}

function makeSticky(): Sticky {
  return {
    id: `ST-${Date.now()}`,
    title: "New sticky",
    text: "Tap to edit.",
  };
}

function makeDoc(): DocItem {
  return {
    id: `DOC-${Date.now()}`,
    label: "New document",
    detail: "Add details.",
    status: "waiting",
  };
}

function stageBadge(stage: ProjectStage) {
  const base =
    "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]";
  switch (stage) {
    case "new-lead":
      return `${base} border-[#d5d8de] bg-[#f6f7f9] text-[#647080]`;
    case "quoted":
      return `${base} border-[#d7c8aa] bg-[#faf5e8] text-[#7a6640]`;
    case "scheduled":
      return `${base} border-[#c6d3ea] bg-[#edf3fb] text-[#48607f]`;
    case "in-progress":
      return `${base} border-[#c9d9cf] bg-[#edf7f0] text-[#4c6d58]`;
    case "waiting":
      return `${base} border-[#d3cae6] bg-[#f3effa] text-[#675487]`;
    case "follow-up":
      return `${base} border-[#dfc6ca] bg-[#fbf0f2] text-[#7e4f57]`;
    case "complete":
      return `${base} border-[#c7d9cd] bg-[#edf7f0] text-[#466a53]`;
    default:
      return `${base} border-[#d5d8de] bg-[#f6f7f9] text-[#647080]`;
  }
}

function priorityClasses(priority: ProjectPriority) {
  if (priority === "high") return "border-[#d7b6b8] bg-[#fbefef] text-[#8d4e56]";
  if (priority === "medium") return "border-[#d8caad] bg-[#faf5e9] text-[#806a43]";
  return "border-[#d5d8de] bg-[#f6f7f9] text-[#647080]";
}

function docStatusClasses(status: DocStatus) {
  if (status === "ready") return "border-[#c7d9cd] bg-[#edf7f0] text-[#466a53]";
  if (status === "waiting") return "border-[#d8caad] bg-[#faf5e9] text-[#806a43]";
  return "border-[#c6d3ea] bg-[#edf3fb] text-[#48607f]";
}

function beamTargetClasses(target: BeamTarget) {
  if (target === "Attorney") return "border-[#d3cae6] bg-[#f3effa] text-[#675487]";
  if (target === "Customer") return "border-[#c6d3ea] bg-[#edf3fb] text-[#48607f]";
  if (target === "Team") return "border-[#c7d9cd] bg-[#edf7f0] text-[#466a53]";
  return "border-[#d5d8de] bg-[#f7f8fa] text-[#647080]";
}

function textInputClass() {
  return "w-full rounded-xl border border-[#d6d9de] bg-white px-3 py-2 text-sm text-[#243040] outline-none";
}

function areaInputClass() {
  return "w-full rounded-xl border border-[#d6d9de] bg-white px-3 py-2 text-sm text-[#243040] outline-none resize-y";
}

function buildBeamTitle(target: BeamTarget, project: Project | null) {
  if (!project) return "Field update";
  if (target === "Attorney") return `${project.customer} proof summary`;
  if (target === "Customer") return `${project.customer} follow-up`;
  if (target === "Team") return `${project.customer} team update`;
  return `${project.customer} field timestamp`;
}

function buildBeamMessage(target: BeamTarget, project: Project | null, noteText: string) {
  const clippedNote = noteText.trim() || "No note captured yet.";
  if (!project) return clippedNote;

  if (target === "Attorney") {
    return [
      `Timestamped field summary for ${project.customer}.`,
      `Project: ${project.project}`,
      `Current next action: ${project.nextAction}`,
      "",
      clippedNote,
    ].join("\n");
  }

  if (target === "Customer") {
    return [
      `Hi ${project.customer},`,
      `Quick follow-up from the field on ${project.project}.`,
      `Next step: ${project.nextAction}`,
      "",
      clippedNote,
    ].join("\n");
  }

  if (target === "Team") {
    return [
      `Team update for ${project.customer}.`,
      `Project: ${project.project}`,
      `Status: ${STAGE_LABELS[project.stage]}`,
      `Next action: ${project.nextAction}`,
      "",
      clippedNote,
    ].join("\n");
  }

  return [
    `Timestamp note for self.`,
    `Customer: ${project.customer}`,
    `Project: ${project.project}`,
    `Status: ${STAGE_LABELS[project.stage]}`,
    "",
    clippedNote,
  ].join("\n");
}

export default function DanFieldNotebookDesk() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [stickies, setStickies] = useState<Sticky[]>(INITIAL_STICKIES);
  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);

  const [query, setQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    INITIAL_PROJECTS[0]?.id ?? "",
  );
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const [draftTitle, setDraftTitle] = useState("Field notebook entry");
  const [noteText, setNoteText] = useState(
    "Field note: capture what happened, what the customer said, what needs to happen next, and timestamp it before it gets lost.",
  );
  const [createdAt] = useState(formatNow());
  const [updatedAt, setUpdatedAt] = useState(formatNow());
  const [timestampedAt, setTimestampedAt] = useState<string | null>(null);
  const [liveNow, setLiveNow] = useState(new Date());
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);

  const [beamOpen, setBeamOpen] = useState(false);
  const [beamTarget, setBeamTarget] = useState<BeamTarget>("Self");
  const [beamTitle, setBeamTitle] = useState(
    buildBeamTitle("Self", INITIAL_PROJECTS[0] ?? null),
  );
  const [beamMessage, setBeamMessage] = useState(
    buildBeamMessage("Self", INITIAL_PROJECTS[0] ?? null, noteText),
  );
  const [beamCopied, setBeamCopied] = useState(false);

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((project) =>
      [
        project.id,
        project.customer,
        project.project,
        project.summary,
        project.contact,
        project.nextAction,
        project.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [projects, query]);

  const selectedProject =
    filteredProjects.find((p) => p.id === selectedProjectId) ??
    projects.find((p) => p.id === selectedProjectId) ??
    filteredProjects[0] ??
    projects[0] ??
    null;

  const notesForSelectedProject = useMemo(() => {
    if (!selectedProject) return [];
    return savedNotes.filter((note) => note.projectId === selectedProject.id);
  }, [savedNotes, selectedProject]);

  const beamPreview = useMemo(() => {
    const lines: string[] = [];
    lines.push(`To: ${beamTarget}`);
    lines.push(`Title: ${beamTitle}`);
    if (selectedProject) {
      lines.push(`Project: ${selectedProject.customer} — ${selectedProject.project}`);
      lines.push(`Status: ${STAGE_LABELS[selectedProject.stage]}`);
    }
    lines.push(`Updated: ${updatedAt}`);
    lines.push(`Timestamped: ${timestampedAt ?? "Not yet"}`);
    lines.push("");
    lines.push(beamMessage.trim() || "(blank)");
    return lines.join("\n");
  }, [beamTarget, beamTitle, selectedProject, updatedAt, timestampedAt, beamMessage]);

  useEffect(() => {
    setBeamTitle(buildBeamTitle(beamTarget, selectedProject));
    setBeamMessage((prev) => {
      const current = prev.trim();
      const auto = buildBeamMessage(beamTarget, selectedProject, noteText);
      if (!current || current.includes("Timestamp note for self.") || current.includes("Timestamped field summary for") || current.includes("Team update for") || current.includes("Quick follow-up from the field")) {
        return auto;
      }
      return prev;
    });
  }, [beamTarget, selectedProject, noteText]);

  function handleSelectProject(id: string) {
    setSelectedProjectId(id);
  }

  function toggleProjectExpanded(id: string) {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  }

  function updateProject(id: string, patch: Partial<Project>) {
    setProjects((prev) =>
      prev.map((project) => (project.id === id ? { ...project, ...patch } : project)),
    );
  }

  function addProject() {
    const newProject = makeProject();
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
  }

  function removeProject(id: string) {
    const remaining = projects.filter((project) => project.id !== id);
    setProjects(remaining);
    setSavedNotes((prev) => prev.filter((note) => note.projectId !== id));

    if (selectedProjectId === id) {
      setSelectedProjectId(remaining[0]?.id ?? "");
    }

    if (expandedProjectId === id) {
      setExpandedProjectId(null);
    }
  }

  function updateAppointment(id: string, patch: Partial<Appointment>) {
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function addAppointment() {
    setAppointments((prev) => [makeAppointment(), ...prev]);
  }

  function removeAppointment(id: string) {
    setAppointments((prev) => prev.filter((item) => item.id !== id));
  }

  function updateSticky(id: string, patch: Partial<Sticky>) {
    setStickies((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function addSticky() {
    setStickies((prev) => [makeSticky(), ...prev]);
  }

  function removeSticky(id: string) {
    setStickies((prev) => prev.filter((item) => item.id !== id));
  }

  function updateDoc(id: string, patch: Partial<DocItem>) {
    setDocs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function addDocument() {
    setDocs((prev) => [makeDoc(), ...prev]);
  }

  function removeDoc(id: string) {
    setDocs((prev) => prev.filter((item) => item.id !== id));
  }

  function handleDraftTitleChange(value: string) {
    setDraftTitle(value);
    setUpdatedAt(formatNow());
  }

  function handleNoteChange(value: string) {
    setNoteText(value);
    setUpdatedAt(formatNow());
  }

  function clearNote() {
    setDraftTitle("Field notebook entry");
    setNoteText("");
    setAttachments([]);
    setUpdatedAt(formatNow());
    setTimestampedAt(null);
  }

  function stampDraft() {
    const now = formatNow();
    setUpdatedAt(now);
    setTimestampedAt(now);
  }

  function addVoicePlaceholder() {
    const voiceLine = `\n[Field voice note marker · ${formatNow()}]`;
    setNoteText((prev) => `${prev}${voiceLine}`);
    setUpdatedAt(formatNow());
  }

  function handleFileSelection(
    event: ChangeEvent<HTMLInputElement>,
    kind: AttachmentKind,
  ) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const newAttachments: AttachmentItem[] = files.map((file) => ({
      id: `${kind}-${Date.now()}-${file.name}`,
      name: file.name,
      kind,
      type: file.type,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    setUpdatedAt(formatNow());
    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
    setUpdatedAt(formatNow());
  }

  function saveDraftNote() {
    if (!selectedProject) return;

    const now = formatNow();
    const cleanTitle = draftTitle.trim() || "Untitled field note";
    const cleanText = noteText.trim();

    const note: SavedNote = {
      id: `NOTE-${Date.now()}`,
      projectId: selectedProject.id,
      title: cleanTitle,
      text: cleanText || "(blank note)",
      createdAt: now,
      updatedAt: now,
      timestampedAt,
      attachments: [...attachments],
    };

    setSavedNotes((prev) => [note, ...prev]);
    setUpdatedAt(now);
  }

  function updateSavedNote(id: string, patch: Partial<SavedNote>) {
    setSavedNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...patch, updatedAt: formatNow() } : note,
      ),
    );
  }

  function removeSavedNote(id: string) {
    setSavedNotes((prev) => prev.filter((note) => note.id !== id));
  }

  function timestampSavedNote(id: string) {
    const now = formatNow();
    setSavedNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, timestampedAt: now, updatedAt: now } : note,
      ),
    );
  }

  function buildExportText(title: string, text: string, projectName: string) {
    return [
      `Title: ${title}`,
      `Project: ${projectName}`,
      `Created: ${createdAt}`,
      `Updated: ${updatedAt}`,
      `Timestamped: ${timestampedAt ?? "Not yet"}`,
      "",
      text,
    ].join("\n");
  }

  function exportDraft() {
    const projectName = selectedProject
      ? `${selectedProject.customer} — ${selectedProject.project}`
      : "Unassigned project";

    const content = buildExportText(draftTitle, noteText, projectName);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(draftTitle || "field-notebook-note")}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportSavedNote(note: SavedNote) {
    const project = projects.find((p) => p.id === note.projectId);
    const projectName = project
      ? `${project.customer} — ${project.project}`
      : "Unassigned project";

    const content = [
      `Title: ${note.title}`,
      `Project: ${projectName}`,
      `Created: ${note.createdAt}`,
      `Updated: ${note.updatedAt}`,
      `Timestamped: ${note.timestampedAt ?? "Not yet"}`,
      "",
      note.text,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(note.title || "saved-field-note")}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function copyBeamCard() {
    try {
      await navigator.clipboard.writeText(beamPreview);
      setBeamCopied(true);
      window.setTimeout(() => setBeamCopied(false), 1800);
    } catch {
      window.alert("Copy failed on this device/browser.");
    }
  }

  function generateBeamCard() {
    setBeamTitle(buildBeamTitle(beamTarget, selectedProject));
    setBeamMessage(buildBeamMessage(beamTarget, selectedProject, noteText));
  }

  function clearBeamCard() {
    setBeamTarget("Self");
    setBeamTitle(buildBeamTitle("Self", selectedProject));
    setBeamMessage(buildBeamMessage("Self", selectedProject, noteText));
  }

  function printContent(title: string, text: string, metaLines: string[]) {
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;

    const escapedTitle = escapeHtml(title);
    const escapedText = escapeHtml(text).replace(/\n/g, "<br/>");
    const escapedMeta = metaLines
      .map((line) => `<div style="margin-bottom:6px;">${escapeHtml(line)}</div>`)
      .join("");

    w.document.write(`
      <html>
        <head>
          <title>${escapedTitle}</title>
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 32px;
              color: #1f2a37;
              line-height: 1.6;
            }
            h1 {
              margin: 0 0 16px 0;
              font-size: 24px;
            }
            .meta {
              margin-bottom: 20px;
              padding: 14px;
              border: 1px solid #d5d8de;
              border-radius: 12px;
              background: #f7f8fa;
            }
            .content {
              white-space: normal;
              border: 1px solid #d5d8de;
              border-radius: 12px;
              padding: 18px;
            }
          </style>
        </head>
        <body>
          <h1>${escapedTitle}</h1>
          <div class="meta">${escapedMeta}</div>
          <div class="content">${escapedText}</div>
        </body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
  }

  function printDraft() {
    const projectName = selectedProject
      ? `${selectedProject.customer} — ${selectedProject.project}`
      : "Unassigned project";

    printContent(draftTitle || "Field notebook entry", noteText || "(blank note)", [
      `Project: ${projectName}`,
      `Created: ${createdAt}`,
      `Updated: ${updatedAt}`,
      `Timestamped: ${timestampedAt ?? "Not yet"}`,
    ]);
  }

  function printSavedNote(note: SavedNote) {
    const project = projects.find((p) => p.id === note.projectId);
    const projectName = project
      ? `${project.customer} — ${project.project}`
      : "Unassigned project";

    printContent(note.title, note.text, [
      `Project: ${projectName}`,
      `Created: ${note.createdAt}`,
      `Updated: ${note.updatedAt}`,
      `Timestamped: ${note.timestampedAt ?? "Not yet"}`,
    ]);
  }

  return (
    <div className="min-h-screen bg-[#d9d4cb] text-[#1f2a37]">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelection(e, "photo")}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelection(e, "file")}
      />

      <div className="mx-auto w-full max-w-[1400px] px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
        <header className="mb-4 rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] px-3 py-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:px-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-[#c8d2e2] bg-[#eef3fb] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#48607f]">
                  Dan Field Notebook Desk
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#b9ddc0] bg-[#edf9f0] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f7d46] shadow-[0_0_0_1px_rgba(47,125,70,0.06),0_0_18px_rgba(82,201,109,0.18)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#52c96d] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2f9e44]" />
                  </span>
                  Live Field Pad
                </div>
              </div>

              <h1 className="mt-2 text-[22px] font-semibold tracking-tight text-[#243040]">
                Fast access to customers, projects, notes, appointments, and proof.
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-[#626c79]">
                Built for the truck, the field, the customer site, and the in-between moments where the next move needs to get captured now.
              </p>
            </div>

            <div className="flex w-full max-w-[720px] flex-col gap-2">
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#d3d6dd] bg-[#f7f8fa] px-3 py-3 text-sm text-[#586474]">
                  <Search className="h-4 w-4 text-[#7a8593]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search customer, project, note, or ID"
                    className="w-full bg-transparent outline-none placeholder:text-[#99a2ae]"
                  />
                </label>

                <div className="flex min-w-[240px] items-center justify-between rounded-2xl border border-[#c7d1e1] bg-[#eef3fb] px-4 py-3 text-[#48607f]">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-80">
                      Today
                    </div>
                    <div className="truncate text-sm font-semibold">{formatLiveDate(liveNow)}</div>
                  </div>
                  <div className="ml-3 text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-80">
                      Live Time
                    </div>
                    <div className="text-sm font-semibold">{formatLiveTime(liveNow)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
          <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#243040]">Customers / Projects</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  Open the right customer fast without losing the day.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-1 rounded-full border border-[#c6d3ea] bg-[#edf3fb] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#48607f]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Project
                </button>

                <div className="rounded-full border border-[#d3d6dd] bg-[#f7f8fa] px-2.5 py-1 text-[11px] font-semibold text-[#61707f]">
                  {filteredProjects.length}
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredProjects.map((project) => {
                const active = selectedProject?.id === project.id;
                const expanded = expandedProjectId === project.id;

                return (
                  <div
                    key={project.id}
                    className={cx(
                      "rounded-[20px] border px-3 py-3 transition",
                      active
                        ? "border-[#c6d3ea] bg-[#eef3fb] shadow-[0_6px_18px_rgba(72,96,127,0.08)]"
                        : "border-[#d9dce1] bg-[#fafafa]",
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={stageBadge(project.stage)}>
                          {STAGE_LABELS[project.stage]}
                        </span>
                        <span
                          className={cx(
                            "rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize",
                            priorityClasses(project.priority),
                          )}
                        >
                          {project.priority}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeProject(project.id)}
                        className="rounded-full border border-[#e1c7ca] bg-[#fbefef] p-1.5 text-[#8d4e56]"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectProject(project.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="min-w-0">
                          <div className="text-[16px] font-semibold text-[#243040]">
                            {project.customer}
                          </div>
                          <div className="mt-1 line-clamp-1 text-sm text-[#65707d]">
                            {project.project}
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-[12px] text-[#6b7684]">
                            <Clock3 className="h-3.5 w-3.5" />
                            <span>{project.due}</span>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleProjectExpanded(project.id)}
                        className="mt-1 shrink-0"
                        title={expanded ? "Collapse" : "Expand"}
                      >
                        <ChevronRight
                          className={cx(
                            "h-4 w-4 text-[#8b95a2] transition-transform",
                            expanded && "rotate-90",
                          )}
                        />
                      </button>
                    </div>

                    {expanded && (
                      <div className="mt-3 space-y-2 border-t border-[#d9dce1] pt-3">
                        <input
                          className={textInputClass()}
                          value={project.customer}
                          onChange={(e) => updateProject(project.id, { customer: e.target.value })}
                          placeholder="Customer"
                        />
                        <input
                          className={textInputClass()}
                          value={project.project}
                          onChange={(e) => updateProject(project.id, { project: e.target.value })}
                          placeholder="Project"
                        />
                        <input
                          className={textInputClass()}
                          value={project.due}
                          onChange={(e) => updateProject(project.id, { due: e.target.value })}
                          placeholder="Due"
                        />
                        <select
                          className={textInputClass()}
                          value={project.stage}
                          onChange={(e) =>
                            updateProject(project.id, {
                              stage: e.target.value as ProjectStage,
                            })
                          }
                        >
                          {Object.entries(STAGE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <select
                          className={textInputClass()}
                          value={project.priority}
                          onChange={(e) =>
                            updateProject(project.id, {
                              priority: e.target.value as ProjectPriority,
                            })
                          }
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="normal">Normal</option>
                        </select>
                        <input
                          className={textInputClass()}
                          value={project.contact}
                          onChange={(e) => updateProject(project.id, { contact: e.target.value })}
                          placeholder="Contact"
                        />
                        <input
                          className={textInputClass()}
                          value={project.location}
                          onChange={(e) => updateProject(project.id, { location: e.target.value })}
                          placeholder="Location"
                        />
                        <textarea
                          className={areaInputClass()}
                          rows={3}
                          value={project.summary}
                          onChange={(e) => updateProject(project.id, { summary: e.target.value })}
                          placeholder="Summary"
                        />
                        <textarea
                          className={areaInputClass()}
                          rows={3}
                          value={project.nextAction}
                          onChange={(e) => updateProject(project.id, { nextAction: e.target.value })}
                          placeholder="Next action"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredProjects.length === 0 && (
                <EmptyCard text="No projects match this search." />
              )}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#243040]">Field Notebook</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  Capture what happened, what was said, what changed, and what comes next.
                </p>
              </div>

              <button
                type="button"
                onClick={clearNote}
                className="inline-flex items-center gap-1 rounded-full border border-[#e1c7ca] bg-[#fbefef] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8d4e56]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Draft
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_92px]">
              <div className="rounded-[22px] border border-[#d7d1c7] bg-[#f7f4ef] p-4">
                {selectedProject ? (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={stageBadge(selectedProject.stage)}>
                            {STAGE_LABELS[selectedProject.stage]}
                          </span>
                          <span className="rounded-full border border-[#d3d6dd] bg-[#f6f7f9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#65717f]">
                            {selectedProject.id}
                          </span>
                        </div>

                        <h3 className="mt-3 text-[30px] font-semibold tracking-tight text-[#243040]">
                          {selectedProject.customer}
                        </h3>
                        <p className="mt-1 text-[15px] text-[#5e6977]">{selectedProject.project}</p>
                      </div>

                      <div className="rounded-[18px] border border-[#d8caad] bg-[#faf5e9] px-4 py-3 text-right">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#806a43]">
                          Due
                        </div>
                        <div className="mt-1 text-sm font-semibold text-[#5f5034]">
                          {selectedProject.due}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[18px] border border-[#d9dce1] bg-[#fcfcfd] p-3.5">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#778392]">
                          <User className="h-3.5 w-3.5" />
                          Customer / Contact
                        </div>
                        <div className="mt-2 text-[15px] font-medium text-[#243040]">
                          {selectedProject.customer}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-[#63707f]">
                          <Phone className="h-3.5 w-3.5" />
                          {selectedProject.contact}
                        </div>
                      </div>

                      <div className="rounded-[18px] border border-[#d9dce1] bg-[#fcfcfd] p-3.5">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#778392]">
                          <FileText className="h-3.5 w-3.5" />
                          Project Summary
                        </div>
                        <div className="mt-2 text-sm leading-6 text-[#566270]">
                          {selectedProject.summary}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[18px] border border-[#d9dce1] bg-[#fcfcfd] p-3.5">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#778392]">
                          Location
                        </div>
                        <div className="mt-2 text-sm text-[#243040]">
                          {selectedProject.location}
                        </div>
                      </div>

                      <div className="rounded-[18px] border border-[#c6d3ea] bg-[#eef3fb] p-3.5">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#48607f]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Next Action
                        </div>
                        <div className="mt-2 text-sm leading-6 text-[#243040]">
                          {selectedProject.nextAction}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyCard text="No project selected." />
                )}

                <div className="mt-4 rounded-[20px] border border-[#d9dce1] bg-[#fcfcfd]">
                  <div className="border-b border-[#e6e8eb] px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#d5d8de] bg-[#f7f8fa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#65717f]">
                        <Tag className="h-3.5 w-3.5" />
                        {selectedProject ? selectedProject.customer : "Untitled Note"}
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 md:grid-cols-3">
                      <TimestampChip label="Created" value={createdAt} />
                      <TimestampChip label="Updated" value={updatedAt} />
                      <TimestampChip label="Timestamped" value={timestampedAt ?? "Not yet"} />
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <input
                      className={textInputClass()}
                      value={draftTitle}
                      onChange={(e) => handleDraftTitleChange(e.target.value)}
                      placeholder="Draft title"
                    />

                    <textarea
                      value={noteText}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      rows={12}
                      className="min-h-[320px] w-full resize-y rounded-[18px] border border-[#d5d8de] bg-white p-4 text-[16px] leading-8 text-[#243040] outline-none placeholder:text-[#99a2ae]"
                      placeholder="Type the live field note here..."
                    />

                    <div className="rounded-[18px] border border-[#d9dce1] bg-[#f7f8fa] p-3">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#778392]">
                        <Upload className="h-3.5 w-3.5" />
                        Attachments
                      </div>

                      {attachments.length === 0 ? (
                        <div className="text-sm text-[#6a7380]">No attachments yet.</div>
                      ) : (
                        <div className="space-y-2">
                          {attachments.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-3 rounded-xl border border-[#d9dce1] bg-white px-3 py-2"
                            >
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-[#243040]">
                                  {item.name}
                                </div>
                                <div className="text-xs uppercase text-[#6a7380]">
                                  {item.kind}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttachment(item.id)}
                                className="rounded-full border border-[#e1c7ca] bg-[#fbefef] p-1.5 text-[#8d4e56]"
                                title="Remove attachment"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[20px] border border-[#d9dce1] bg-[#fcfcfd] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#243040]">Saved Field Notes</h3>
                      <p className="mt-1 text-xs text-[#6a7380]">
                        Notes saved to the selected customer/project.
                      </p>
                    </div>
                    <div className="rounded-full border border-[#d3d6dd] bg-[#f7f8fa] px-2.5 py-1 text-[11px] font-semibold text-[#61707f]">
                      {notesForSelectedProject.length}
                    </div>
                  </div>

                  {notesForSelectedProject.length === 0 ? (
                    <EmptyCard text="No saved notes for this project yet." />
                  ) : (
                    <div className="space-y-3">
                      {notesForSelectedProject.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-[18px] border border-[#d9dce1] bg-[#f7f8fa] p-3"
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <input
                              className={textInputClass()}
                              value={note.title}
                              onChange={(e) =>
                                updateSavedNote(note.id, { title: e.target.value })
                              }
                              placeholder="Saved note title"
                            />
                            <button
                              type="button"
                              onClick={() => removeSavedNote(note.id)}
                              className="rounded-full border border-[#e1c7ca] bg-[#fbefef] p-2 text-[#8d4e56]"
                              title="Delete saved note"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <textarea
                            className={areaInputClass()}
                            rows={6}
                            value={note.text}
                            onChange={(e) =>
                              updateSavedNote(note.id, { text: e.target.value })
                            }
                            placeholder="Saved note text"
                          />

                          <div className="mt-3 grid gap-2 md:grid-cols-3">
                            <TimestampChip label="Created" value={note.createdAt} />
                            <TimestampChip label="Updated" value={note.updatedAt} />
                            <TimestampChip
                              label="Timestamped"
                              value={note.timestampedAt ?? "Not yet"}
                            />
                          </div>

                          {note.attachments.length > 0 && (
                            <div className="mt-3 rounded-[16px] border border-[#d9dce1] bg-white p-3">
                              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#778392]">
                                Saved Attachments
                              </div>
                              <div className="space-y-2">
                                {note.attachments.map((file) => (
                                  <div
                                    key={file.id}
                                    className="rounded-xl border border-[#d9dce1] bg-[#f7f8fa] px-3 py-2 text-sm text-[#243040]"
                                  >
                                    {file.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            <SmallActionButton
                              label="Timestamp"
                              icon={CheckCircle2}
                              onClick={() => timestampSavedNote(note.id)}
                            />
                            <SmallActionButton
                              label="Export"
                              icon={Upload}
                              onClick={() => exportSavedNote(note)}
                            />
                            <SmallActionButton
                              label="Print"
                              icon={Printer}
                              onClick={() => printSavedNote(note)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1">
                <ToolButton icon={Mic} label="Voice" onClick={addVoicePlaceholder} />
                <ToolButton
                  icon={Camera}
                  label="Photo"
                  onClick={() => photoInputRef.current?.click()}
                />
                <ToolButton
                  icon={Paperclip}
                  label="Attach"
                  onClick={() => fileInputRef.current?.click()}
                />
                <ToolButton icon={CheckCircle2} label="Timestamp" onClick={stampDraft} />
                <ToolButton icon={Save} label="Save" onClick={saveDraftNote} />
                <ToolButton icon={Upload} label="Export" onClick={exportDraft} />
                <ToolButton icon={Printer} label="Print" onClick={printDraft} />
                <ToolButton icon={Trash2} label="Delete" onClick={clearNote} danger />
              </div>
            </div>
          </section>

          <div className="grid gap-4">
            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#243040]">Appointments</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    Keep the day tight and editable.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addAppointment}
                  className="inline-flex items-center gap-1 rounded-full border border-[#c6d3ea] bg-[#edf3fb] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#48607f]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Appointment
                </button>
              </div>

              <div className="space-y-2.5">
                {appointments.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] border border-[#d9dce1] bg-[#f7f8fa] p-3.5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-[12px] text-[#697583]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Appointment
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAppointment(item.id)}
                        className="rounded-full border border-[#e1c7ca] bg-[#fbefef] p-1.5 text-[#8d4e56]"
                        title="Delete appointment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        className={textInputClass()}
                        value={item.time}
                        onChange={(e) => updateAppointment(item.id, { time: e.target.value })}
                        placeholder="Time"
                      />
                      <input
                        className={textInputClass()}
                        value={item.title}
                        onChange={(e) => updateAppointment(item.id, { title: e.target.value })}
                        placeholder="Title"
                      />
                      <input
                        className={textInputClass()}
                        value={item.project}
                        onChange={(e) => updateAppointment(item.id, { project: e.target.value })}
                        placeholder="Project"
                      />
                      <input
                        className={textInputClass()}
                        value={item.type}
                        onChange={(e) => updateAppointment(item.id, { type: e.target.value })}
                        placeholder="Type"
                      />
                    </div>
                  </div>
                ))}

                {appointments.length === 0 && <EmptyCard text="No appointments left." />}
              </div>
            </section>

            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#243040]">Beam Card</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    Send note, update, or proof summary without making the page loud.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setBeamOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#d5d8de] bg-[#f7f8fa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5d6978]"
                >
                  {beamOpen ? "Collapse" : "Open"}
                  <ChevronRight
                    className={cx("h-3.5 w-3.5 transition-transform", beamOpen && "rotate-90")}
                  />
                </button>
              </div>

              {!beamOpen ? (
                <div className="rounded-[20px] border border-[#d9dce1] bg-[#f7f8fa] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[#243040]">Beam Card</div>
                      <div className="mt-1 text-xs text-[#6a7380]">
                        Compact send block for self, customer, team, or attorney.
                      </div>
                    </div>
                    <div
                      className={cx(
                        "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                        beamTargetClasses(beamTarget),
                      )}
                    >
                      Ready
                    </div>
                  </div>

                  <div className="mt-3 rounded-[16px] border border-[#d9dce1] bg-white px-3 py-3">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#778392]">
                      Quick Route
                    </div>
                    <div className="mt-1 text-sm font-medium text-[#243040]">{beamTarget}</div>
                    <div className="mt-2 text-xs text-[#6a7380] line-clamp-2">
                      {beamTitle}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-[20px] border border-[#d9dce1] bg-[#f7f8fa] p-3">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#778392]">
                      Send To
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["Self", "Customer", "Team", "Attorney"] as BeamTarget[]).map((target) => (
                        <button
                          key={target}
                          type="button"
                          onClick={() => setBeamTarget(target)}
                          className={cx(
                            "rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
                            beamTarget === target
                              ? beamTargetClasses(target)
                              : "border-[#d5d8de] bg-white text-[#5d6978]",
                          )}
                        >
                          {target}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-[#d9dce1] bg-[#f7f8fa] p-3">
                    <div className="space-y-2">
                      <input
                        className={textInputClass()}
                        value={beamTitle}
                        onChange={(e) => setBeamTitle(e.target.value)}
                        placeholder="Beam title"
                      />
                      <textarea
                        className={areaInputClass()}
                        rows={5}
                        value={beamMessage}
                        onChange={(e) => setBeamMessage(e.target.value)}
                        placeholder="Beam message"
                      />
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-[#d9dce1] bg-white p-3">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#778392]">
                      Preview
                    </div>
                    <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-[#334155]">
                      {beamPreview}
                    </pre>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <SmallActionButton
                      label="Generate"
                      icon={Send}
                      onClick={generateBeamCard}
                    />
                    <SmallActionButton
                      label={beamCopied ? "Copied" : "Copy"}
                      icon={Copy}
                      onClick={copyBeamCard}
                    />
                    <SmallActionButton
                      label="Clear"
                      icon={Trash2}
                      onClick={clearBeamCard}
                    />
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#243040]">Sticky Notes</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    Catch the field thoughts before they disappear.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSticky}
                  className="inline-flex items-center gap-1 rounded-full border border-[#d8caad] bg-[#faf5e9] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#806a43]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Sticky
                </button>
              </div>

              <div className="space-y-2.5">
                {stickies.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-[20px] border border-[#d8caad] bg-[#faf5e9] p-3.5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#5f5034]">
                        <StickyNote className="h-4 w-4 shrink-0 text-[#9d814b]" />
                        Sticky Note
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSticky(note.id)}
                        className="rounded-full border border-[#e7d8bc] bg-[#fff8ea] p-1.5 text-[#8a6f3f]"
                        title="Delete sticky note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        className={textInputClass()}
                        value={note.title}
                        onChange={(e) => updateSticky(note.id, { title: e.target.value })}
                        placeholder="Sticky title"
                      />
                      <textarea
                        className={areaInputClass()}
                        rows={4}
                        value={note.text}
                        onChange={(e) => updateSticky(note.id, { text: e.target.value })}
                        placeholder="Sticky text"
                      />
                    </div>
                  </div>
                ))}

                {stickies.length === 0 && <EmptyCard text="No sticky notes left." />}
              </div>
            </section>

            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#243040]">Documents / Follow-up</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    Keep support items moving without clutter.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addDocument}
                  className="inline-flex items-center gap-1 rounded-full border border-[#c7d9cd] bg-[#edf7f0] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#466a53]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Document
                </button>
              </div>

              <div className="space-y-2.5">
                {docs.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] border border-[#d9dce1] bg-[#f7f8fa] p-3.5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-[15px] font-semibold text-[#243040]">
                        <FolderOpen className="h-4 w-4 text-[#778392]" />
                        Document
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDoc(item.id)}
                        className="rounded-full border border-[#e1c7ca] bg-[#fbefef] p-1.5 text-[#8d4e56]"
                        title="Delete document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        className={textInputClass()}
                        value={item.label}
                        onChange={(e) => updateDoc(item.id, { label: e.target.value })}
                        placeholder="Document title"
                      />
                      <textarea
                        className={areaInputClass()}
                        rows={3}
                        value={item.detail}
                        onChange={(e) => updateDoc(item.id, { detail: e.target.value })}
                        placeholder="Document detail"
                      />
                      <select
                        className={textInputClass()}
                        value={item.status}
                        onChange={(e) =>
                          updateDoc(item.id, { status: e.target.value as DocStatus })
                        }
                      >
                        <option value="ready">Ready</option>
                        <option value="waiting">Waiting</option>
                        <option value="sent">Sent</option>
                      </select>

                      <div
                        className={cx(
                          "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                          docStatusClasses(item.status),
                        )}
                      >
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))}

                {docs.length === 0 && <EmptyCard text="No document items left." />}
              </div>
            </section>
          </div>
        </div>

        <HomePlanetFooter />
      </div>
    </div>
  );
}

function ToolButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "flex min-h-[72px] flex-col items-center justify-center gap-2 rounded-[18px] border px-3 py-3 text-center shadow-[0_4px_10px_rgba(74,63,50,0.04)] transition hover:opacity-95",
        danger
          ? "border-[#e1c7ca] bg-[#fbefef] text-[#8d4e56]"
          : "border-[#d5d8de] bg-[#f7f8fa] text-[#5d6978]",
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
        {label}
      </span>
    </button>
  );
}

function SmallActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-[#d5d8de] bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5d6978]"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function TimestampChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[#d5d8de] bg-[#f7f8fa] px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#778392]">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-[#243040]">{value}</div>
    </div>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-[20px] border border-[#d9dce1] bg-[#fafafa] px-4 py-6 text-center text-sm text-[#6a7380]">
      {text}
    </div>
  );
}

function HomePlanetFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-6 border-t border-[#b8b1a7] pt-6 pb-6 text-center">
      <div className="flex items-center justify-center gap-2 text-[13px] font-semibold text-[#5f6f82]">
        <span className="text-[16px]">🪐</span>
        <span>HomePlanet © {year}. All rights reserved.</span>
      </div>

      <div className="mt-2 text-[12px] text-[#7b8693]">
        Presence-first systems and workflows protected.
      </div>
    </footer>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}