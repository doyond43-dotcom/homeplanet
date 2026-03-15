import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
} from "react";
import {
  AlarmClock,
  AlertTriangle,
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
  Play,
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
  | "idea"
  | "assigned"
  | "in-progress"
  | "studying"
  | "waiting"
  | "submitted"
  | "complete";

type ProjectPriority = "high" | "medium" | "normal";

type SchoolProject = {
  id: string;
  subject: string;
  title: string;
  due: string;
  stage: ProjectStage;
  priority: ProjectPriority;
  summary: string;
  teacher: string;
  nextStep: string;
};

type StudyTask = {
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

type DocStatus = "ready" | "waiting" | "sent";

type DocItem = {
  id: string;
  label: string;
  detail: string;
  status: DocStatus;
};

type AttachmentKind = "photo" | "file";

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

type TimelineEvent = {
  id: string;
  projectId: string;
  time: string;
  label: string;
};

const STAGE_LABELS: Record<ProjectStage, string> = {
  idea: "Idea",
  assigned: "Assigned",
  "in-progress": "In Progress",
  studying: "Studying",
  waiting: "Waiting",
  submitted: "Submitted",
  complete: "Complete",
};

const INITIAL_PROJECTS: SchoolProject[] = [
  {
    id: "LEE-101",
    subject: "Science",
    title: "Science fair project",
    due: "Friday · 2:00 PM",
    stage: "in-progress",
    priority: "high",
    summary: "Experiment notes, progress photos, and final write-up all stay together here.",
    teacher: "Mrs. Thompson",
    nextStep: "Finish experiment notes and attach one clean progress photo.",
  },
  {
    id: "LEE-102",
    subject: "Math",
    title: "Practice packet + review",
    due: "Tomorrow · 9:00 AM",
    stage: "studying",
    priority: "medium",
    summary: "Keep formulas, tricky problems, and study notes in one place.",
    teacher: "Mr. Carter",
    nextStep: "Finish final 5 problems and review missed steps.",
  },
  {
    id: "LEE-103",
    subject: "English",
    title: "Essay outline",
    due: "Monday · 10:00 AM",
    stage: "assigned",
    priority: "normal",
    summary: "Outline ideas, draft notes, and revision reminders.",
    teacher: "Ms. Green",
    nextStep: "Write the opening paragraph and save one clean draft note.",
  },
];

const INITIAL_TASKS: StudyTask[] = [
  {
    id: "TASK-1",
    time: "4:00 PM",
    title: "Science work block",
    project: "Science fair project",
    type: "Homework",
  },
  {
    id: "TASK-2",
    time: "5:00 PM",
    title: "Math review timer",
    project: "Practice packet + review",
    type: "Study",
  },
  {
    id: "TASK-3",
    time: "6:15 PM",
    title: "Essay outline pass",
    project: "Essay outline",
    type: "Writing",
  },
];

const INITIAL_STICKIES: Sticky[] = [
  {
    id: "ST-1",
    title: "Study reminder",
    text: "Do the hardest thing first while your brain is fresh.",
  },
  {
    id: "ST-2",
    title: "Teacher note",
    text: "Keep one clean note ready in case you need to send an update.",
  },
  {
    id: "ST-3",
    title: "Focus tip",
    text: "Use the timer and finish one small section at a time.",
  },
];

const INITIAL_DOCS: DocItem[] = [
  {
    id: "DOC-1",
    label: "Science draft notes",
    detail: "Ready to review before final write-up.",
    status: "ready",
  },
  {
    id: "DOC-2",
    label: "Math formula sheet",
    detail: "Waiting for final check.",
    status: "waiting",
  },
  {
    id: "DOC-3",
    label: "Teacher update draft",
    detail: "Sent to yourself for cleanup.",
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

function formatTimer(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function makeProject(): SchoolProject {
  return {
    id: `LEE-${Date.now()}`,
    subject: "Subject",
    title: "New project",
    due: "No due date",
    stage: "idea",
    priority: "normal",
    summary: "Add project summary.",
    teacher: "Teacher",
    nextStep: "Add next step.",
  };
}

function makeTask(): StudyTask {
  return {
    id: `TASK-${Date.now()}`,
    time: "New",
    title: "New task",
    project: "Attach to project",
    type: "Study",
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
    case "idea":
      return `${base} border-[#ddd8f0] bg-[#f5f2fd] text-[#6d5ea8]`;
    case "assigned":
      return `${base} border-[#d7c8aa] bg-[#faf5e8] text-[#7a6640]`;
    case "in-progress":
      return `${base} border-[#c6d3ea] bg-[#edf3fb] text-[#48607f]`;
    case "studying":
      return `${base} border-[#d5d9f4] bg-[#eef1fd] text-[#5666a6]`;
    case "waiting":
      return `${base} border-[#d5d8de] bg-[#f6f7f9] text-[#647080]`;
    case "submitted":
      return `${base} border-[#c7d9cd] bg-[#edf7f0] text-[#466a53]`;
    case "complete":
      return `${base} border-[#d0e0d4] bg-[#eff8f2] text-[#42654d]`;
    default:
      return `${base} border-[#d5d8de] bg-[#f6f7f9] text-[#647080]`;
  }
}

function priorityClasses(priority: ProjectPriority) {
  if (priority === "high") {
    return "border-[#d7b6b8] bg-[#fbefef] text-[#8d4e56]";
  }
  if (priority === "medium") {
    return "border-[#d8caad] bg-[#faf5e9] text-[#806a43]";
  }
  return "border-[#d5d8de] bg-[#f6f7f9] text-[#647080]";
}

function docStatusClasses(status: DocStatus) {
  if (status === "ready") {
    return "border-[#c7d9cd] bg-[#edf7f0] text-[#466a53]";
  }
  if (status === "waiting") {
    return "border-[#d8caad] bg-[#faf5e9] text-[#806a43]";
  }
  return "border-[#c6d3ea] bg-[#edf3fb] text-[#48607f]";
}

function textInputClass() {
  return "w-full rounded-xl border border-[#d6d9de] bg-white px-3 py-2 text-sm text-[#243040] outline-none";
}

function areaInputClass() {
  return "w-full rounded-xl border border-[#d6d9de] bg-white px-3 py-2 text-sm text-[#243040] outline-none resize-y";
}

export default function LeeStudentNotebookDesk() {
  const [projects, setProjects] = useState<SchoolProject[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_TASKS);
  const [stickies, setStickies] = useState<Sticky[]>(INITIAL_STICKIES);
  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  const [query, setQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(INITIAL_PROJECTS[0]?.id ?? "");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const [draftTitle, setDraftTitle] = useState("Lee notebook entry");
  const [noteText, setNoteText] = useState(
    "Start here: write down the project, the next step, and one clean thing to finish before stopping.",
  );
  const [createdAt] = useState(formatNow());
  const [updatedAt, setUpdatedAt] = useState(formatNow());
  const [timestampedAt, setTimestampedAt] = useState<string | null>(null);
  const [liveNow, setLiveNow] = useState(new Date());
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [parentPing, setParentPing] = useState("Dad: Keep it simple and finish one thing at a time.");
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  const [emergencyMessage, setEmergencyMessage] = useState(
    "Dad, I need help. Please check in with me as soon as you can.",
  );
  const [emergencyLastSentAt, setEmergencyLastSentAt] = useState<string | null>(null);
  const [emergencyStatus, setEmergencyStatus] = useState<"idle" | "copied" | "shared">("idle");

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((project) =>
      [
        project.id,
        project.subject,
        project.title,
        project.summary,
        project.teacher,
        project.nextStep,
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

  const timelineForSelectedProject = useMemo(() => {
    if (!selectedProject) return [];
    return timeline.filter((entry) => entry.projectId === selectedProject.id);
  }, [timeline, selectedProject]);

  function addTimeline(label: string, projectId?: string) {
    const id = projectId ?? selectedProject?.id;
    if (!id) return;
    setTimeline((prev) => [
      {
        id: `TL-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        projectId: id,
        time: formatNow(),
        label,
      },
      ...prev,
    ]);
  }

  function handleSelectProject(id: string) {
    setSelectedProjectId(id);
  }

  function toggleProjectExpanded(id: string) {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  }

  function updateProject(id: string, patch: Partial<SchoolProject>) {
    setProjects((prev) =>
      prev.map((project) => (project.id === id ? { ...project, ...patch } : project)),
    );
  }

  function addProject() {
    const newProject = makeProject();
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    addTimeline("Project created.", newProject.id);
  }

  function removeProject(id: string) {
    const remaining = projects.filter((project) => project.id !== id);
    setProjects(remaining);
    setSavedNotes((prev) => prev.filter((note) => note.projectId !== id));
    setTimeline((prev) => prev.filter((entry) => entry.projectId !== id));

    if (selectedProjectId === id) {
      setSelectedProjectId(remaining[0]?.id ?? "");
    }
    if (expandedProjectId === id) {
      setExpandedProjectId(null);
    }
  }

  function updateTask(id: string, patch: Partial<StudyTask>) {
    setTasks((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addTask() {
    setTasks((prev) => [makeTask(), ...prev]);
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  }

  function updateSticky(id: string, patch: Partial<Sticky>) {
    setStickies((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addSticky() {
    setStickies((prev) => [makeSticky(), ...prev]);
  }

  function removeSticky(id: string) {
    setStickies((prev) => prev.filter((item) => item.id !== id));
  }

  function updateDoc(id: string, patch: Partial<DocItem>) {
    setDocs((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
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
    setDraftTitle("Lee notebook entry");
    setNoteText("");
    setAttachments([]);
    setUpdatedAt(formatNow());
    setTimestampedAt(null);
  }

  function stampDraft() {
    const now = formatNow();
    setUpdatedAt(now);
    setTimestampedAt(now);
    addTimeline("Notebook entry timestamped.");
  }

  function addVoicePlaceholder() {
    const voiceLine = `\n[Voice note marker · ${formatNow()}]`;
    setNoteText((prev) => `${prev}${voiceLine}`);
    setUpdatedAt(formatNow());
    addTimeline("Voice note marker added.");
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>, kind: AttachmentKind) {
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
    addTimeline(kind === "photo" ? "Photo attached." : "File attached.");
    event.target.value = "";
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
    setUpdatedAt(formatNow());
  }

  function saveDraftNote() {
    if (!selectedProject) return;

    const now = formatNow();
    const cleanTitle = draftTitle.trim() || "Untitled note";
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
    addTimeline(`Saved note: ${cleanTitle}`);
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
    const note = savedNotes.find((item) => item.id === id);
    setSavedNotes((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, timestampedAt: now, updatedAt: now } : entry,
      ),
    );
    if (note) addTimeline(`Saved note timestamped: ${note.title}`);
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
      ? `${selectedProject.subject} — ${selectedProject.title}`
      : "Unassigned project";

    const content = buildExportText(draftTitle, noteText, projectName);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(draftTitle || "lee-notebook-note")}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
            h1 { margin: 0 0 16px 0; font-size: 24px; }
            .meta {
              margin-bottom: 20px;
              padding: 14px;
              border: 1px solid #d5d8de;
              border-radius: 12px;
              background: #f7f8fa;
            }
            .content {
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
      ? `${selectedProject.subject} — ${selectedProject.title}`
      : "Unassigned project";

    printContent(draftTitle || "Lee notebook entry", noteText || "(blank note)", [
      `Project: ${projectName}`,
      `Created: ${createdAt}`,
      `Updated: ${updatedAt}`,
      `Timestamped: ${timestampedAt ?? "Not yet"}`,
    ]);
  }

  function startTimer() {
    if (timerSeconds === 0) setTimerSeconds(25 * 60);
    setTimerRunning(true);
    addTimeline("Focus timer started.");
  }

  function pauseTimer() {
    setTimerRunning(false);
    addTimeline("Focus timer paused.");
  }

  function resetTimer() {
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
  }

  function buildEmergencyPacket() {
    const projectLine = selectedProject
      ? `${selectedProject.subject} — ${selectedProject.title}`
      : "No project selected";

    const url =
      typeof window !== "undefined" ? window.location.href : "Lee Desk";

    return [
      "LEE DESK EMERGENCY ALERT",
      `Time: ${formatNow()}`,
      `Student: Lee`,
      `Project: ${projectLine}`,
      `Message: ${emergencyMessage.trim() || "Dad, I need help."}`,
      `Page: ${url}`,
    ].join("\n");
  }

  async function copyEmergencyAlert() {
    const packet = buildEmergencyPacket();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(packet);
      }
      const now = formatNow();
      setEmergencyLastSentAt(now);
      setEmergencyStatus("copied");
      addTimeline("Dad Help alert copied.");
    } catch {
      const now = formatNow();
      setEmergencyLastSentAt(now);
      setEmergencyStatus("copied");
      addTimeline("Dad Help alert prepared.");
    }
  }

  async function sendEmergencyAlert() {
    const packet = buildEmergencyPacket();
    const now = formatNow();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(packet);
      }

      if (navigator.share) {
        await navigator.share({
          title: "Lee Desk Emergency Alert",
          text: packet,
        });
        setEmergencyStatus("shared");
      } else {
        setEmergencyStatus("copied");
      }
    } catch {
      setEmergencyStatus("copied");
    }

    setEmergencyLastSentAt(now);
    addTimeline("Dad Help alert triggered.");
  }

  function clearEmergencyState() {
    setEmergencyLastSentAt(null);
    setEmergencyStatus("idle");
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
                <div className="rounded-full border border-[#d9d2ef] bg-[#f5f2fd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6d5ea8]">
                  Lee Student Notebook Desk
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#d7cff3] bg-[#f7f4fe] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6f63a6] shadow-[0_0_0_1px_rgba(111,99,166,0.05),0_0_18px_rgba(164,137,255,0.16)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9d87ff] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#7d6ae0]" />
                  </span>
                  Live Student Pad
                </div>
              </div>

              <h1 className="mt-2 text-[22px] font-semibold tracking-tight text-[#243040]">
                Fast access to school projects, notes, timer, and progress.
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-[#626c79]">
                One place for projects, study focus, teacher prep, and a clean record of progress.
              </p>
            </div>

            <div className="flex w-full max-w-[760px] flex-col gap-2">
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#d3d6dd] bg-[#f7f8fa] px-3 py-3 text-sm text-[#586474]">
                  <Search className="h-4 w-4 text-[#7a8593]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search subject, project, note, or teacher"
                    className="w-full bg-transparent outline-none placeholder:text-[#99a2ae]"
                  />
                </label>

                <div className="flex min-w-[260px] items-center justify-between rounded-2xl border border-[#d9d2ef] bg-[#f5f2fd] px-4 py-3 text-[#6d5ea8]">
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

              <div className="rounded-2xl border border-[#d9d2ef] bg-[#f7f4fe] px-4 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7b70ac]">
                  Parent Ping
                </div>
                <input
                  className="mt-2 w-full bg-transparent text-sm text-[#4f466d] outline-none"
                  value={parentPing}
                  onChange={(e) => setParentPing(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
          {/* LEFT RAIL */}
          <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#243040]">Active Projects</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  Open the right school project fast.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addProject}
                  className="inline-flex items-center gap-1 rounded-full border border-[#d9d2ef] bg-[#f5f2fd] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6d5ea8]"
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
                        ? "border-[#d9d2ef] bg-[#f5f2fd] shadow-[0_6px_18px_rgba(109,94,168,0.08)]"
                        : "border-[#d9dce1] bg-[#fafafa]",
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={stageBadge(project.stage)}>{STAGE_LABELS[project.stage]}</span>
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
                            {project.subject}
                          </div>
                          <div className="mt-1 line-clamp-1 text-sm text-[#65707d]">
                            {project.title}
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
                          value={project.subject}
                          onChange={(e) =>
                            updateProject(project.id, { subject: e.target.value })
                          }
                          placeholder="Subject"
                        />
                        <input
                          className={textInputClass()}
                          value={project.title}
                          onChange={(e) =>
                            updateProject(project.id, { title: e.target.value })
                          }
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
                          value={project.teacher}
                          onChange={(e) =>
                            updateProject(project.id, { teacher: e.target.value })
                          }
                          placeholder="Teacher"
                        />
                        <textarea
                          className={areaInputClass()}
                          rows={3}
                          value={project.summary}
                          onChange={(e) =>
                            updateProject(project.id, { summary: e.target.value })
                          }
                          placeholder="Summary"
                        />
                        <textarea
                          className={areaInputClass()}
                          rows={3}
                          value={project.nextStep}
                          onChange={(e) =>
                            updateProject(project.id, { nextStep: e.target.value })
                          }
                          placeholder="Next step"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* CENTER */}
          <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#243040]">Live Notebook</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  Write, study, save progress, and keep your work clean.
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
                          <span className="rounded-full border border-[#d9d2ef] bg-[#f5f2fd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6d5ea8]">
                            {selectedProject.id}
                          </span>
                        </div>

                        <h3 className="mt-3 text-[30px] font-semibold tracking-tight text-[#243040]">
                          {selectedProject.subject}
                        </h3>
                        <p className="mt-1 text-[15px] text-[#5e6977]">{selectedProject.title}</p>
                      </div>

                      <div className="rounded-[18px] border border-[#d9d2ef] bg-[#f5f2fd] px-4 py-3 text-right">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6d5ea8]">
                          Due
                        </div>
                        <div className="mt-1 text-sm font-semibold text-[#56498d]">
                          {selectedProject.due}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[18px] border border-[#d9dce1] bg-[#fcfcfd] p-3.5">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#778392]">
                          <User className="h-3.5 w-3.5" />
                          Teacher
                        </div>
                        <div className="mt-2 text-[15px] font-medium text-[#243040]">
                          {selectedProject.teacher}
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

                    <div className="mt-3 rounded-[18px] border border-[#d9d2ef] bg-[#f5f2fd] p-4">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6d5ea8]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Next Step
                      </div>
                      <p className="mt-2 text-[16px] leading-7 text-[#243040]">
                        {selectedProject.nextStep}
                      </p>
                    </div>
                  </>
                ) : (
                  <EmptyCard text="No project selected." />
                )}

                <div className="mt-4 rounded-[20px] border border-[#d9dce1] bg-[#fcfcfd]">
                  <div className="border-b border-[#e6e8eb] px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#d9d2ef] bg-[#f5f2fd] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6d5ea8]">
                        <Tag className="h-3.5 w-3.5" />
                        {selectedProject ? selectedProject.subject : "Untitled Note"}
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
                      placeholder="Type the live student note here..."
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
                                <div className="text-xs text-[#6a7380] uppercase">
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
                      <h3 className="text-[15px] font-semibold text-[#243040]">Growth Timeline</h3>
                      <p className="mt-1 text-xs text-[#6a7380]">
                        Small moments turn into visible progress.
                      </p>
                    </div>
                    <div className="rounded-full border border-[#d3d6dd] bg-[#f7f8fa] px-2.5 py-1 text-[11px] font-semibold text-[#61707f]">
                      {timelineForSelectedProject.length}
                    </div>
                  </div>

                  {timelineForSelectedProject.length === 0 ? (
                    <EmptyCard text="No timeline moments yet." />
                  ) : (
                    <div className="space-y-2">
                      {timelineForSelectedProject.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-[16px] border border-[#d9dce1] bg-[#f7f8fa] px-3 py-3"
                        >
                          <div className="text-[12px] font-semibold text-[#6d5ea8]">{entry.time}</div>
                          <div className="mt-1 text-sm text-[#243040]">{entry.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-[20px] border border-[#d9dce1] bg-[#fcfcfd] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-[15px] font-semibold text-[#243040]">Saved Notes</h3>
                      <p className="mt-1 text-xs text-[#6a7380]">
                        Notes saved to the selected school project.
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

                          <div className="mt-3 flex flex-wrap gap-2">
                            <SmallActionButton
                              label="Timestamp"
                              icon={CheckCircle2}
                              onClick={() => timestampSavedNote(note.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION RAIL */}
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
                <ToolButton
                  icon={AlertTriangle}
                  label="Dad Help"
                  onClick={sendEmergencyAlert}
                  danger
                />
              </div>
            </div>
          </section>

          {/* RIGHT RAIL */}
          <div className="grid gap-4">
            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#243040]">Dad Help / Emergency</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    One tap prepares a real emergency alert with project context and time.
                  </p>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#e6c9cc] bg-[#fcf2f3] p-4">
                <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8d4e56]">
                  <AlertTriangle className="h-4 w-4" />
                  Emergency Packet
                </div>

                <textarea
                  className="mt-3 min-h-[110px] w-full rounded-[16px] border border-[#e5d2d5] bg-white p-3 text-sm text-[#243040] outline-none resize-y"
                  value={emergencyMessage}
                  onChange={(e) => setEmergencyMessage(e.target.value)}
                  placeholder="Dad, I need help. Please check in with me."
                />

                <div className="mt-3 rounded-[16px] border border-[#ead9db] bg-white px-3 py-3 text-sm text-[#5f4a4f]">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8d4e56]">
                    Current project context
                  </div>
                  <div className="mt-2">
                    {selectedProject
                      ? `${selectedProject.subject} — ${selectedProject.title}`
                      : "No project selected"}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <SmallActionButton icon={Send} label="Send Alert" onClick={sendEmergencyAlert} />
                  <SmallActionButton icon={Copy} label="Copy Alert" onClick={copyEmergencyAlert} />
                  <SmallActionButton icon={Trash2} label="Clear Status" onClick={clearEmergencyState} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={cx(
                      "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      emergencyStatus === "shared"
                        ? "border-[#c7d9cd] bg-[#edf7f0] text-[#466a53]"
                        : emergencyStatus === "copied"
                          ? "border-[#d9d2ef] bg-[#f5f2fd] text-[#6d5ea8]"
                          : "border-[#d5d8de] bg-[#f6f7f9] text-[#647080]",
                    )}
                  >
                    {emergencyStatus === "shared"
                      ? "Shared"
                      : emergencyStatus === "copied"
                        ? "Copied"
                        : "Ready"}
                  </span>

                  {emergencyLastSentAt && (
                    <div className="text-xs text-[#6a7380]">
                      Last alert: {emergencyLastSentAt}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#243040]">Study Timer</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    Use short focus blocks and keep moving.
                  </p>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#d9d2ef] bg-[#f5f2fd] p-4 text-center">
                <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#6d5ea8]">
                  Focus Session
                </div>
                <div className="mt-3 text-5xl font-semibold tracking-tight text-[#243040]">
                  {formatTimer(timerSeconds)}
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <SmallActionButton icon={Play} label="Start" onClick={startTimer} />
                  <SmallActionButton icon={AlarmClock} label="Pause" onClick={pauseTimer} />
                  <SmallActionButton icon={Clock3} label="Reset" onClick={resetTimer} />
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#243040]">Tasks / Blocks</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    Keep homework and study blocks visible.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addTask}
                  className="inline-flex items-center gap-1 rounded-full border border-[#d9d2ef] bg-[#f5f2fd] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6d5ea8]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Task
                </button>
              </div>

              <div className="space-y-2.5">
                {tasks.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[20px] border border-[#d9dce1] bg-[#f7f8fa] p-3.5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-[12px] text-[#697583]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Task
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTask(item.id)}
                        className="rounded-full border border-[#e1c7ca] bg-[#fbefef] p-1.5 text-[#8d4e56]"
                        title="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        className={textInputClass()}
                        value={item.time}
                        onChange={(e) => updateTask(item.id, { time: e.target.value })}
                        placeholder="Time"
                      />
                      <input
                        className={textInputClass()}
                        value={item.title}
                        onChange={(e) => updateTask(item.id, { title: e.target.value })}
                        placeholder="Title"
                      />
                      <input
                        className={textInputClass()}
                        value={item.project}
                        onChange={(e) => updateTask(item.id, { project: e.target.value })}
                        placeholder="Project"
                      />
                      <input
                        className={textInputClass()}
                        value={item.type}
                        onChange={(e) => updateTask(item.id, { type: e.target.value })}
                        placeholder="Type"
                      />
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && <EmptyCard text="No tasks left." />}
              </div>
            </section>

            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#243040]">Sticky Notes</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    Small reminders that keep school simple.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addSticky}
                  className="inline-flex items-center gap-1 rounded-full border border-[#d9d2ef] bg-[#f5f2fd] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6d5ea8]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Sticky
                </button>
              </div>

              <div className="space-y-2.5">
                {stickies.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-[20px] border border-[#ddd8f0] bg-[#f7f4fe] p-3.5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#6d5ea8]">
                        <StickyNote className="h-4 w-4 shrink-0 text-[#7d6ae0]" />
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
                  <h2 className="text-[15px] font-semibold text-[#243040]">Documents / Teacher Prep</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    Keep support items organized and ready.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addDocument}
                  className="inline-flex items-center gap-1 rounded-full border border-[#d9d2ef] bg-[#f5f2fd] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6d5ea8]"
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