// src/pages/JoeGrantLegalDesk.tsx
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
  FileText,
  FolderOpen,
  Mic,
  Paperclip,
  Phone,
  Plus,
  Printer,
  Save,
  Search,
  StickyNote,
  Tag,
  Trash2,
  Upload,
  User,
} from "lucide-react";

type MatterStage =
  | "intake"
  | "review"
  | "pending-client"
  | "filing"
  | "court"
  | "follow-up"
  | "closed";

type MatterPriority = "high" | "medium" | "normal";

type Matter = {
  id: string;
  client: string;
  title: string;
  due: string;
  stage: MatterStage;
  priority: MatterPriority;
  summary: string;
  contact: string;
  nextAction: string;
};

type Appointment = {
  id: string;
  time: string;
  title: string;
  matter: string;
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
  matterId: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  timestampedAt: string | null;
  attachments: AttachmentItem[];
};

const STAGE_LABELS: Record<MatterStage, string> = {
  intake: "Intake",
  review: "Review",
  "pending-client": "Pending Client",
  filing: "Filing",
  court: "Court",
  "follow-up": "Follow-up",
  closed: "Closed",
};

const INITIAL_MATTERS: Matter[] = [
  {
    id: "MAT-24018",
    client: "Maria Ortega",
    title: "Estate administration / probate intake",
    due: "Today · 10:30 AM",
    stage: "review",
    priority: "high",
    summary: "Initial probate matter with family waiting on first document pass.",
    contact: "(863) 555-0148",
    nextAction: "Review death certificate and asset list before callback.",
  },
  {
    id: "MAT-24022",
    client: "Derrick Lawson",
    title: "Contract dispute response deadline",
    due: "Today · 2:00 PM",
    stage: "filing",
    priority: "high",
    summary: "Response window is short and filing packet needs final review.",
    contact: "(863) 555-0172",
    nextAction: "Finalize response packet and confirm exhibits are attached.",
  },
  {
    id: "MAT-24011",
    client: "Angela Pierce",
    title: "Guardianship follow-up",
    due: "Tomorrow · 9:00 AM",
    stage: "pending-client",
    priority: "medium",
    summary: "Waiting on client-side paperwork before next court-facing step.",
    contact: "(863) 555-0102",
    nextAction: "Get signed physician form from client and set court prep call.",
  },
  {
    id: "MAT-24004",
    client: "Jamal Reed",
    title: "Real estate document review",
    due: "Tomorrow · 1:30 PM",
    stage: "follow-up",
    priority: "normal",
    summary: "Mostly complete, but one clarification still needs to go out.",
    contact: "(863) 555-0160",
    nextAction: "Send revision summary and close open title question.",
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-1",
    time: "9:00 AM",
    title: "Client intake call",
    matter: "Estate administration / probate intake",
    type: "Phone",
  },
  {
    id: "APT-2",
    time: "11:30 AM",
    title: "Document review block",
    matter: "Contract dispute response deadline",
    type: "Office",
  },
  {
    id: "APT-3",
    time: "2:30 PM",
    title: "Follow-up with opposing counsel",
    matter: "Real estate document review",
    type: "Call",
  },
];

const INITIAL_STICKIES: Sticky[] = [
  {
    id: "ST-1",
    title: "Clerk call",
    text: "Call clerk before lunch to confirm hearing time was entered correctly.",
  },
  {
    id: "ST-2",
    title: "Client checklist",
    text: "Probate matter needs one clean checklist the client can actually follow.",
  },
  {
    id: "ST-3",
    title: "Friday block",
    text: "Keep Friday afternoon open for overflow drafting.",
  },
];

const INITIAL_DOCS: DocItem[] = [
  {
    id: "DOC-1",
    label: "Probate intake checklist",
    detail: "Ready to send after first callback.",
    status: "ready",
  },
  {
    id: "DOC-2",
    label: "Contract response exhibits",
    detail: "Waiting on final attachment confirmation.",
    status: "waiting",
  },
  {
    id: "DOC-3",
    label: "Guardianship physician form",
    detail: "Sent to client, not yet returned.",
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

function makeMatter(): Matter {
  return {
    id: `MAT-${Date.now()}`,
    client: "New Client",
    title: "New matter",
    due: "No due date",
    stage: "intake",
    priority: "normal",
    summary: "Add matter summary.",
    contact: "(000) 000-0000",
    nextAction: "Add next action.",
  };
}

function makeAppointment(): Appointment {
  return {
    id: `APT-${Date.now()}`,
    time: "New",
    title: "New appointment",
    matter: "Attach to matter",
    type: "Office",
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

function stageBadge(stage: MatterStage) {
  const base =
    "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]";
  switch (stage) {
    case "intake":
      return `${base} border-[#d3d6dd] bg-[#f5f6f8] text-[#5f6b7a]`;
    case "review":
      return `${base} border-[#c6d3ea] bg-[#edf3fb] text-[#48607f]`;
    case "pending-client":
      return `${base} border-[#d7c8aa] bg-[#faf5e8] text-[#7a6640]`;
    case "filing":
      return `${base} border-[#d3cae6] bg-[#f3effa] text-[#675487]`;
    case "court":
      return `${base} border-[#dfc6ca] bg-[#fbf0f2] text-[#7e4f57]`;
    case "follow-up":
      return `${base} border-[#c9d9cf] bg-[#edf7f0] text-[#4c6d58]`;
    case "closed":
      return `${base} border-[#d5d8de] bg-[#f5f6f8] text-[#697382]`;
    default:
      return `${base} border-[#d5d8de] bg-[#f5f6f8] text-[#697382]`;
  }
}

function priorityClasses(priority: MatterPriority) {
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

export default function JoeGrantLegalDesk() {
  const [matters, setMatters] = useState<Matter[]>(INITIAL_MATTERS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [stickies, setStickies] = useState<Sticky[]>(INITIAL_STICKIES);
  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);

  const [query, setQuery] = useState("");
  const [selectedMatterId, setSelectedMatterId] = useState<string>(INITIAL_MATTERS[0]?.id ?? "");
  const [expandedMatterId, setExpandedMatterId] = useState<string | null>(null);

  const [draftTitle, setDraftTitle] = useState("Live notebook entry");
  const [noteText, setNoteText] = useState(
    "Client called from vehicle. Need one clean follow-up note and timestamp.",
  );
  const [createdAt] = useState(formatNow());
  const [updatedAt, setUpdatedAt] = useState(formatNow());
  const [timestampedAt, setTimestampedAt] = useState<string | null>(null);
  const [liveNow, setLiveNow] = useState(new Date());
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredMatters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return matters;
    return matters.filter((matter) =>
      [
        matter.id,
        matter.client,
        matter.title,
        matter.summary,
        matter.contact,
        matter.nextAction,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [matters, query]);

  const selectedMatter =
    filteredMatters.find((m) => m.id === selectedMatterId) ??
    matters.find((m) => m.id === selectedMatterId) ??
    filteredMatters[0] ??
    matters[0] ??
    null;

  const notesForSelectedMatter = useMemo(() => {
    if (!selectedMatter) return [];
    return savedNotes.filter((note) => note.matterId === selectedMatter.id);
  }, [savedNotes, selectedMatter]);

  function handleSelectMatter(id: string) {
    setSelectedMatterId(id);
  }

  function toggleMatterExpanded(id: string) {
    setExpandedMatterId((prev) => (prev === id ? null : id));
  }

  function updateMatter(id: string, patch: Partial<Matter>) {
    setMatters((prev) =>
      prev.map((matter) => (matter.id === id ? { ...matter, ...patch } : matter)),
    );
  }

  function addMatter() {
    const newMatter = makeMatter();
    setMatters((prev) => [newMatter, ...prev]);
    setSelectedMatterId(newMatter.id);
  }

  function removeMatter(id: string) {
    const remaining = matters.filter((matter) => matter.id !== id);
    setMatters(remaining);
    setSavedNotes((prev) => prev.filter((note) => note.matterId !== id));

    if (selectedMatterId === id) {
      setSelectedMatterId(remaining[0]?.id ?? "");
    }

    if (expandedMatterId === id) {
      setExpandedMatterId(null);
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
    setDraftTitle("Live notebook entry");
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
    const voiceLine = `\n[Voice note marker · ${formatNow()}]`;
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
    if (!selectedMatter) return;

    const now = formatNow();
    const cleanTitle = draftTitle.trim() || "Untitled note";
    const cleanText = noteText.trim();

    const note: SavedNote = {
      id: `NOTE-${Date.now()}`,
      matterId: selectedMatter.id,
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

  function buildExportText(title: string, text: string, matterName: string) {
    return [
      `Title: ${title}`,
      `Matter: ${matterName}`,
      `Created: ${createdAt}`,
      `Updated: ${updatedAt}`,
      `Timestamped: ${timestampedAt ?? "Not yet"}`,
      "",
      text,
    ].join("\n");
  }

  function exportDraft() {
    const matterName = selectedMatter
      ? `${selectedMatter.client} — ${selectedMatter.title}`
      : "Unassigned matter";

    const content = buildExportText(draftTitle, noteText, matterName);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(draftTitle || "live-notebook-note")}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportSavedNote(note: SavedNote) {
    const matter = matters.find((m) => m.id === note.matterId);
    const matterName = matter ? `${matter.client} — ${matter.title}` : "Unassigned matter";
    const content = [
      `Title: ${note.title}`,
      `Matter: ${matterName}`,
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
    link.download = `${slugify(note.title || "saved-note")}.txt`;
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
    const matterName = selectedMatter
      ? `${selectedMatter.client} — ${selectedMatter.title}`
      : "Unassigned matter";

    printContent(draftTitle || "Live notebook entry", noteText || "(blank note)", [
      `Matter: ${matterName}`,
      `Created: ${createdAt}`,
      `Updated: ${updatedAt}`,
      `Timestamped: ${timestampedAt ?? "Not yet"}`,
    ]);
  }

  function printSavedNote(note: SavedNote) {
    const matter = matters.find((m) => m.id === note.matterId);
    const matterName = matter ? `${matter.client} — ${matter.title}` : "Unassigned matter";

    printContent(note.title, note.text, [
      `Matter: ${matterName}`,
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
                  Joe Grant Legal Notebook Desk
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#b9ddc0] bg-[#edf9f0] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#2f7d46] shadow-[0_0_0_1px_rgba(47,125,70,0.06),0_0_18px_rgba(82,201,109,0.18)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#52c96d] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#2f9e44]" />
                  </span>
                  Live Notebook
                </div>
              </div>

              <h1 className="mt-2 text-[22px] font-semibold tracking-tight text-[#243040]">
                Fast access to matters, notes, schedule, and proof.
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-[#626c79]">
                Built for quick pull-ups, quick typing, timestamps, and clean removal when the day moves on.
              </p>
            </div>

            <div className="flex w-full max-w-[720px] flex-col gap-2">
              <div className="flex w-full flex-col gap-2 sm:flex-row">
                <label className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#d3d6dd] bg-[#f7f8fa] px-3 py-3 text-sm text-[#586474]">
                  <Search className="h-4 w-4 text-[#7a8593]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search matter, client, note, or ID"
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
          {/* LEFT RAIL */}
          <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#243040]">Active Matters</h2>
                <p className="mt-1 text-xs text-[#6a7380]">Open the right client fast.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addMatter}
                  className="inline-flex items-center gap-1 rounded-full border border-[#c6d3ea] bg-[#edf3fb] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#48607f]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Matter
                </button>

                <div className="rounded-full border border-[#d3d6dd] bg-[#f7f8fa] px-2.5 py-1 text-[11px] font-semibold text-[#61707f]">
                  {filteredMatters.length}
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredMatters.map((matter) => {
                const active = selectedMatter?.id === matter.id;
                const expanded = expandedMatterId === matter.id;

                return (
                  <div
                    key={matter.id}
                    className={cx(
                      "rounded-[20px] border px-3 py-3 transition",
                      active
                        ? "border-[#c6d3ea] bg-[#eef3fb] shadow-[0_6px_18px_rgba(72,96,127,0.08)]"
                        : "border-[#d9dce1] bg-[#fafafa]",
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={stageBadge(matter.stage)}>{STAGE_LABELS[matter.stage]}</span>
                        <span
                          className={cx(
                            "rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize",
                            priorityClasses(matter.priority),
                          )}
                        >
                          {matter.priority}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeMatter(matter.id)}
                        className="rounded-full border border-[#e1c7ca] bg-[#fbefef] p-1.5 text-[#8d4e56]"
                        title="Delete matter"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectMatter(matter.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="min-w-0">
                          <div className="text-[16px] font-semibold text-[#243040]">{matter.client}</div>
                          <div className="mt-1 line-clamp-1 text-sm text-[#65707d]">{matter.title}</div>
                          <div className="mt-3 flex items-center gap-2 text-[12px] text-[#6b7684]">
                            <Clock3 className="h-3.5 w-3.5" />
                            <span>{matter.due}</span>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleMatterExpanded(matter.id)}
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
                          value={matter.client}
                          onChange={(e) => updateMatter(matter.id, { client: e.target.value })}
                          placeholder="Client"
                        />
                        <input
                          className={textInputClass()}
                          value={matter.title}
                          onChange={(e) => updateMatter(matter.id, { title: e.target.value })}
                          placeholder="Matter title"
                        />
                        <input
                          className={textInputClass()}
                          value={matter.due}
                          onChange={(e) => updateMatter(matter.id, { due: e.target.value })}
                          placeholder="Due"
                        />
                        <select
                          className={textInputClass()}
                          value={matter.stage}
                          onChange={(e) =>
                            updateMatter(matter.id, { stage: e.target.value as MatterStage })
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
                          value={matter.priority}
                          onChange={(e) =>
                            updateMatter(matter.id, {
                              priority: e.target.value as MatterPriority,
                            })
                          }
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="normal">Normal</option>
                        </select>
                        <input
                          className={textInputClass()}
                          value={matter.contact}
                          onChange={(e) => updateMatter(matter.id, { contact: e.target.value })}
                          placeholder="Contact"
                        />
                        <textarea
                          className={areaInputClass()}
                          rows={3}
                          value={matter.summary}
                          onChange={(e) => updateMatter(matter.id, { summary: e.target.value })}
                          placeholder="Summary"
                        />
                        <textarea
                          className={areaInputClass()}
                          rows={3}
                          value={matter.nextAction}
                          onChange={(e) => updateMatter(matter.id, { nextAction: e.target.value })}
                          placeholder="Next action"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredMatters.length === 0 && (
                <EmptyCard text="No matters match this search." />
              )}
            </div>
          </section>

          {/* CENTER NOTEBOOK */}
          <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#243040]">Legal Notebook</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  Write once, timestamp it, attach proof, save it, export it, and print it.
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
                {selectedMatter ? (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={stageBadge(selectedMatter.stage)}>
                            {STAGE_LABELS[selectedMatter.stage]}
                          </span>
                          <span className="rounded-full border border-[#d3d6dd] bg-[#f6f7f9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#65717f]">
                            {selectedMatter.id}
                          </span>
                        </div>

                        <h3 className="mt-3 text-[30px] font-semibold tracking-tight text-[#243040]">
                          {selectedMatter.client}
                        </h3>
                        <p className="mt-1 text-[15px] text-[#5e6977]">{selectedMatter.title}</p>
                      </div>

                      <div className="rounded-[18px] border border-[#d8caad] bg-[#faf5e9] px-4 py-3 text-right">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#806a43]">
                          Due
                        </div>
                        <div className="mt-1 text-sm font-semibold text-[#5f5034]">
                          {selectedMatter.due}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[18px] border border-[#d9dce1] bg-[#fcfcfd] p-3.5">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#778392]">
                          <User className="h-3.5 w-3.5" />
                          Client
                        </div>
                        <div className="mt-2 text-[15px] font-medium text-[#243040]">
                          {selectedMatter.client}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-[#63707f]">
                          <Phone className="h-3.5 w-3.5" />
                          {selectedMatter.contact}
                        </div>
                      </div>

                      <div className="rounded-[18px] border border-[#d9dce1] bg-[#fcfcfd] p-3.5">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#778392]">
                          <FileText className="h-3.5 w-3.5" />
                          Matter Summary
                        </div>
                        <div className="mt-2 text-sm leading-6 text-[#566270]">
                          {selectedMatter.summary}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-[18px] border border-[#c6d3ea] bg-[#eef3fb] p-4">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#48607f]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Next Action
                      </div>
                      <p className="mt-2 text-[16px] leading-7 text-[#243040]">
                        {selectedMatter.nextAction}
                      </p>
                    </div>
                  </>
                ) : (
                  <EmptyCard text="No matter selected." />
                )}

                <div className="mt-4 rounded-[20px] border border-[#d9dce1] bg-[#fcfcfd]">
                  <div className="border-b border-[#e6e8eb] px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#d5d8de] bg-[#f7f8fa] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#65717f]">
                        <Tag className="h-3.5 w-3.5" />
                        {selectedMatter ? selectedMatter.client : "Untitled Note"}
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
                      placeholder="Type or dictate the live legal note here..."
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
                      <h3 className="text-[15px] font-semibold text-[#243040]">Saved Notes</h3>
                      <p className="mt-1 text-xs text-[#6a7380]">
                        Notes saved to the selected matter.
                      </p>
                    </div>
                    <div className="rounded-full border border-[#d3d6dd] bg-[#f7f8fa] px-2.5 py-1 text-[11px] font-semibold text-[#61707f]">
                      {notesForSelectedMatter.length}
                    </div>
                  </div>

                  {notesForSelectedMatter.length === 0 ? (
                    <EmptyCard text="No saved notes for this matter yet." />
                  ) : (
                    <div className="space-y-3">
                      {notesForSelectedMatter.map((note) => (
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
                <ToolButton icon={Trash2} label="Delete" onClick={clearNote} danger />
              </div>
            </div>
          </section>

          {/* RIGHT RAIL */}
          <div className="grid gap-4">
            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#243040]">Schedule / Appointments</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    Create, edit, and remove what is done.
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
                        value={item.matter}
                        onChange={(e) => updateAppointment(item.id, { matter: e.target.value })}
                        placeholder="Matter"
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
                  <h2 className="text-[15px] font-semibold text-[#243040]">Sticky Notes</h2>
                  <p className="mt-1 text-xs text-[#6a7380]">
                    Create, edit, and remove live reminders.
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
                    Create, edit, status, and remove support items.
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