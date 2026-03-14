// src/pages/JoeGrantLegalDesk.tsx
import { useEffect, useMemo, useState, type ComponentType } from "react";
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

type Matter = {
  id: string;
  client: string;
  title: string;
  due: string;
  stage: MatterStage;
  priority: "high" | "medium" | "normal";
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

type DocItem = {
  id: string;
  label: string;
  detail: string;
  status: "ready" | "waiting" | "sent";
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

const DEFAULT_NEW_MATTER = (): Matter => ({
  id: `MAT-${Date.now()}`,
  client: "New Client",
  title: "New matter",
  due: "No due date",
  stage: "intake",
  priority: "normal",
  summary: "Add matter summary.",
  contact: "(000) 000-0000",
  nextAction: "Add next action.",
});

const DEFAULT_NEW_APPOINTMENT = (): Appointment => ({
  id: `APT-${Date.now()}`,
  time: "New",
  title: "New appointment",
  matter: "Attach to matter",
  type: "Office",
});

const DEFAULT_NEW_STICKY = (): Sticky => ({
  id: `ST-${Date.now()}`,
  title: "New sticky",
  text: "Tap to edit.",
});

const DEFAULT_NEW_DOC = (): DocItem => ({
  id: `DOC-${Date.now()}`,
  label: "New document",
  detail: "Add details.",
  status: "waiting",
});

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatNow() {
  return new Date().toLocaleString([], {
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

function priorityClasses(priority: Matter["priority"]) {
  if (priority === "high") {
    return "border-[#d7b6b8] bg-[#fbefef] text-[#8d4e56]";
  }
  if (priority === "medium") {
    return "border-[#d8caad] bg-[#faf5e9] text-[#806a43]";
  }
  return "border-[#d5d8de] bg-[#f6f7f9] text-[#647080]";
}

function docStatusClasses(status: DocItem["status"]) {
  if (status === "ready") {
    return "border-[#c7d9cd] bg-[#edf7f0] text-[#466a53]";
  }
  if (status === "waiting") {
    return "border-[#d8caad] bg-[#faf5e9] text-[#806a43]";
  }
  return "border-[#c6d3ea] bg-[#edf3fb] text-[#48607f]";
}

export default function JoeGrantLegalDesk() {
  const [matters, setMatters] = useState<Matter[]>(INITIAL_MATTERS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [stickies, setStickies] = useState<Sticky[]>(INITIAL_STICKIES);
  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);

  const [query, setQuery] = useState("");
  const [selectedMatterId, setSelectedMatterId] = useState<string>(INITIAL_MATTERS[0]?.id ?? "");
  const [noteText, setNoteText] = useState(
    "Client called from vehicle. Need one clean follow-up note and timestamp."
  );
  const [createdAt] = useState(formatNow());
  const [updatedAt, setUpdatedAt] = useState(formatNow());
  const [timestampedAt, setTimestampedAt] = useState<string | null>(null);
  const [liveNow, setLiveNow] = useState(new Date());

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

  function handleSelectMatter(id: string) {
    setSelectedMatterId(id);
  }

  function addMatter() {
    const newMatter = DEFAULT_NEW_MATTER();
    setMatters((prev) => [newMatter, ...prev]);
    setSelectedMatterId(newMatter.id);
  }

  function removeMatter(id: string) {
    setMatters((prev) => {
      const remaining = prev.filter((m) => m.id !== id);
      if (selectedMatterId === id) {
        setSelectedMatterId(remaining[0]?.id ?? "");
      }
      return remaining;
    });
  }

  function addAppointment() {
    setAppointments((prev) => [DEFAULT_NEW_APPOINTMENT(), ...prev]);
  }

  function removeAppointment(id: string) {
    setAppointments((prev) => prev.filter((item) => item.id !== id));
  }

  function addSticky() {
    setStickies((prev) => [DEFAULT_NEW_STICKY(), ...prev]);
  }

  function removeSticky(id: string) {
    setStickies((prev) => prev.filter((item) => item.id !== id));
  }

  function addDocument() {
    setDocs((prev) => [DEFAULT_NEW_DOC(), ...prev]);
  }

  function removeDoc(id: string) {
    setDocs((prev) => prev.filter((item) => item.id !== id));
  }

  function handleNoteChange(value: string) {
    setNoteText(value);
    setUpdatedAt(formatNow());
  }

  function clearNote() {
    setNoteText("");
    setUpdatedAt(formatNow());
    setTimestampedAt(null);
  }

  function stampNote() {
    const now = formatNow();
    setUpdatedAt(now);
    setTimestampedAt(now);
  }

  return (
    <div className="min-h-screen bg-[#d9d4cb] text-[#1f2a37]">
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

                <div className="flex min-w-[220px] items-center justify-between rounded-2xl border border-[#c7d1e1] bg-[#eef3fb] px-4 py-3 text-[#48607f]">
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
                <p className="mt-1 text-xs text-[#6a7380]">
                  Open the right client fast.
                </p>
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
                  {filteredMatters.length} visible
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredMatters.map((matter) => {
                const active = selectedMatter?.id === matter.id;
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
                        <span className={stageBadge(matter.stage)}>
                          {matter.stage.replace("-", " ")}
                        </span>
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
                        className="rounded-full border border-[#e1c7ca] bg-[#fbefef] p-1.5 text-[#8d4e56] transition hover:opacity-90"
                        title="Delete matter"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectMatter(matter.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[16px] font-semibold text-[#243040]">{matter.client}</div>
                          <div className="mt-1 line-clamp-1 text-sm text-[#65707d]">{matter.title}</div>
                          <div className="mt-3 flex items-center gap-2 text-[12px] text-[#6b7684]">
                            <Clock3 className="h-3.5 w-3.5" />
                            <span>{matter.due}</span>
                          </div>
                        </div>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#8b95a2]" />
                      </div>
                    </button>
                  </div>
                );
              })}

              {filteredMatters.length === 0 && (
                <div className="rounded-[20px] border border-[#d9dce1] bg-[#fafafa] px-4 py-8 text-center text-sm text-[#6a7380]">
                  No matters match this search.
                </div>
              )}
            </div>
          </section>

          {/* CENTER NOTEBOOK */}
          <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#243040]">Legal Notebook</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  Write once, timestamp it, attach proof, and keep the page clean.
                </p>
              </div>

              <button
                type="button"
                onClick={clearNote}
                className="inline-flex items-center gap-1 rounded-full border border-[#e1c7ca] bg-[#fbefef] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8d4e56]"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Note
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
                            {selectedMatter.stage.replace("-", " ")}
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
                  <div className="rounded-[18px] border border-[#d9dce1] bg-[#fcfcfd] px-4 py-8 text-center text-sm text-[#6a7380]">
                    No matter selected.
                  </div>
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

                  <div className="p-4">
                    <textarea
                      value={noteText}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      rows={12}
                      className="min-h-[320px] w-full resize-y rounded-[18px] border border-[#d5d8de] bg-white p-4 text-[16px] leading-8 text-[#243040] outline-none placeholder:text-[#99a2ae]"
                      placeholder="Type or dictate the live legal note here..."
                    />
                  </div>
                </div>
              </div>

              {/* ACTION RAIL */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1">
                <ToolButton icon={Mic} label="Voice" />
                <ToolButton icon={Camera} label="Photo" />
                <ToolButton icon={Paperclip} label="Attach" />
                <ToolButton icon={CheckCircle2} label="Timestamp" onClick={stampNote} />
                <ToolButton icon={Save} label="Save" />
                <ToolButton icon={Printer} label="Print" />
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
                    Remove what is done and keep the day clean.
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
                    className="rounded-[20px] border border-[#d9dce1] bg-[#f7f8fa] px-3.5 py-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[12px] text-[#697583]">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {item.time}
                        </div>
                        <div className="mt-1 text-[16px] font-semibold text-[#243040]">
                          {item.title}
                        </div>
                        <div className="mt-1 line-clamp-1 text-sm text-[#5f6b79]">
                          {item.matter}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-start gap-2">
                        <div className="rounded-full border border-[#d3d6dd] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#65717f]">
                          {item.type}
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
                    Keep only the reminders that still matter.
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
                    className="rounded-[20px] border border-[#d8caad] bg-[#faf5e9] px-3.5 py-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[#5f5034]">
                          <StickyNote className="h-4 w-4 shrink-0 text-[#9d814b]" />
                          {note.title}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#6b5b3d]">{note.text}</p>
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
                    Remove completed support items when ready.
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
                    className="rounded-[20px] border border-[#d9dce1] bg-[#f7f8fa] px-3.5 py-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[15px] font-semibold text-[#243040]">
                          <FolderOpen className="h-4 w-4 text-[#778392]" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <div className="mt-1 text-sm text-[#5f6b79]">{item.detail}</div>
                      </div>

                      <div className="flex shrink-0 items-start gap-2">
                        <div
                          className={cx(
                            "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                            docStatusClasses(item.status),
                          )}
                        >
                          {item.status}
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