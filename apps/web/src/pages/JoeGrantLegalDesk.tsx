import { useMemo, useState } from "react";
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
  Search,
  StickyNote,
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
  stage: MatterStage;
  nextAction: string;
  due: string;
  priority: "high" | "medium" | "normal";
  contact: string;
  summary: string;
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

const STAGE_ORDER: MatterStage[] = [
  "intake",
  "review",
  "pending-client",
  "filing",
  "court",
  "follow-up",
  "closed",
];

const STAGE_LABELS: Record<MatterStage, string> = {
  intake: "Intake",
  review: "Review",
  "pending-client": "Pending Client",
  filing: "Filing",
  court: "Court",
  "follow-up": "Follow-up",
  closed: "Closed",
};

const MATTERS: Matter[] = [
  {
    id: "MAT-24018",
    client: "Maria Ortega",
    title: "Estate administration / probate intake",
    stage: "review",
    nextAction: "Review death certificate and asset list before callback.",
    due: "Today · 10:30 AM",
    priority: "high",
    contact: "(863) 555-0148",
    summary: "Initial probate matter with family waiting on first document pass.",
  },
  {
    id: "MAT-24022",
    client: "Derrick Lawson",
    title: "Contract dispute response deadline",
    stage: "filing",
    nextAction: "Finalize response packet and confirm exhibits are attached.",
    due: "Today · 2:00 PM",
    priority: "high",
    contact: "(863) 555-0172",
    summary: "Response window is short and filing packet needs final review.",
  },
  {
    id: "MAT-24011",
    client: "Angela Pierce",
    title: "Guardianship follow-up",
    stage: "pending-client",
    nextAction: "Get signed physician form from client and set court prep call.",
    due: "Tomorrow · 9:00 AM",
    priority: "medium",
    contact: "(863) 555-0102",
    summary: "Waiting on client-side paperwork before next court-facing step.",
  },
  {
    id: "MAT-24004",
    client: "Jamal Reed",
    title: "Real estate document review",
    stage: "follow-up",
    nextAction: "Send revision summary and close open title question.",
    due: "Tomorrow · 1:30 PM",
    priority: "normal",
    contact: "(863) 555-0160",
    summary: "Mostly complete, but one clarification still needs to go out.",
  },
  {
    id: "MAT-23998",
    client: "Helen Barker",
    title: "Small business formation cleanup",
    stage: "intake",
    nextAction: "Confirm entity name and gather ownership percentages.",
    due: "Friday · 11:15 AM",
    priority: "normal",
    contact: "(863) 555-0191",
    summary: "New intake with quick setup path once the ownership details arrive.",
  },
  {
    id: "MAT-23977",
    client: "Christopher Neal",
    title: "Hearing prep and witness order",
    stage: "court",
    nextAction: "Run final hearing checklist and print hearing binder.",
    due: "Monday · 8:00 AM",
    priority: "high",
    contact: "(863) 555-0130",
    summary: "Court date is close, and prep list needs to stay visible.",
  },
];

const APPOINTMENTS: Appointment[] = [
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
  {
    id: "APT-4",
    time: "4:15 PM",
    title: "Court prep review",
    matter: "Hearing prep and witness order",
    type: "Internal",
  },
];

const STICKIES: Sticky[] = [
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

const DOCS: DocItem[] = [
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
  {
    id: "DOC-4",
    label: "Hearing binder print packet",
    detail: "Ready for print once witness order is locked.",
    status: "ready",
  },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
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
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(MATTERS[0]?.id ?? "");
  const [stageFilter, setStageFilter] = useState<"all" | MatterStage>("all");
  const [activeStickyId, setActiveStickyId] = useState<string>(STICKIES[0]?.id ?? "");
  const [quickNote, setQuickNote] = useState(
    "Client called from vehicle. Need one clean follow-up note and timestamp."
  );

  const filteredMatters = useMemo(() => {
    const q = query.trim().toLowerCase();

    return MATTERS.filter((matter) => {
      const stageMatch = stageFilter === "all" || matter.stage === stageFilter;
      const textMatch =
        q.length === 0
          ? true
          : [
              matter.id,
              matter.client,
              matter.title,
              matter.nextAction,
              matter.summary,
              matter.contact,
            ]
              .join(" ")
              .toLowerCase()
              .includes(q);

      return stageMatch && textMatch;
    });
  }, [query, stageFilter]);

  const selectedMatter =
    filteredMatters.find((matter) => matter.id === selectedId) ??
    filteredMatters[0] ??
    MATTERS[0];

  const activeSticky =
    STICKIES.find((note) => note.id === activeStickyId) ?? STICKIES[0];

  const selectedStageIndex = selectedMatter
    ? STAGE_ORDER.indexOf(selectedMatter.stage)
    : -1;

  return (
    <div className="min-h-screen bg-[#d9d4cb] text-[#1f2a37]">
      <div className="mx-auto w-full max-w-[1240px] px-3 py-4 sm:px-4 lg:px-5 lg:py-5">
        <header className="mb-4 rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] px-3 py-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:px-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-full border border-[#c8d2e2] bg-[#eef3fb] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#48607f]">
                    Joe Grant Legal Desk
                  </div>
                  <div className="rounded-full border border-[#d2ccc2] bg-[#f5f2ec] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#706657]">
                    Daily Planner
                  </div>
                </div>

                <h1 className="mt-2 text-[22px] font-semibold tracking-tight text-[#243040]">
                  Fast access to matters, notes, schedule, and proof.
                </h1>
                <p className="mt-1 max-w-3xl text-sm text-[#626c79]">
                  Built for quick pull-ups, clean notes, and real daily movement on laptop, tablet, or in the car.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 xl:max-w-[680px]">
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

                  <button
                    type="button"
                    className="rounded-2xl border border-[#c7d1e1] bg-[#eef3fb] px-4 py-3 text-sm font-semibold text-[#48607f]"
                  >
                    Today’s Desk
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                  <button
                    type="button"
                    onClick={() => setStageFilter("all")}
                    className={cx(
                      "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                      stageFilter === "all"
                        ? "border-[#c6d3ea] bg-[#edf3fb] text-[#48607f]"
                        : "border-[#d5d8de] bg-[#f7f8fa] text-[#667181]",
                    )}
                  >
                    All Matters
                  </button>

                  {STAGE_ORDER.map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => setStageFilter(stage)}
                      className={cx(
                        "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        stageFilter === stage
                          ? "border-[#c6d3ea] bg-[#edf3fb] text-[#48607f]"
                          : "border-[#d5d8de] bg-[#f7f8fa] text-[#667181]",
                      )}
                    >
                      {STAGE_LABELS[stage]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-[18px] border border-[#c7d1e1] bg-[#eef3fb] px-4 py-3 text-sm font-semibold text-[#48607f]"
              >
                <Mic className="h-4 w-4" />
                Voice Note
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-[18px] border border-[#d8caad] bg-[#faf5e9] px-4 py-3 text-sm font-semibold text-[#806a43]"
              >
                <Camera className="h-4 w-4" />
                Add Photo
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-[18px] border border-[#c9d9cf] bg-[#edf7f0] px-4 py-3 text-sm font-semibold text-[#466a53]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Timestamp Note
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-[18px] border border-[#d5d8de] bg-[#f7f8fa] px-4 py-3 text-sm font-semibold text-[#647080]"
              >
                <Paperclip className="h-4 w-4" />
                Attach Document
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.04fr_0.96fr]">
          <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#243040]">Active Matter</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  Pull up the right file fast and keep the next move visible.
                </p>
              </div>

              <div className="rounded-full border border-[#d3d6dd] bg-[#f7f8fa] px-2.5 py-1 text-[11px] font-semibold text-[#61707f]">
                {filteredMatters.length} visible
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-[0.94fr_1.06fr]">
              <div className="rounded-[22px] border border-[#d7d1c7] bg-[#f3f0ea] p-2.5">
                <div className="space-y-2.5">
                  {filteredMatters.map((matter) => {
                    const active = selectedMatter?.id === matter.id;

                    return (
                      <button
                        key={matter.id}
                        type="button"
                        onClick={() => setSelectedId(matter.id)}
                        className={cx(
                          "w-full rounded-[20px] border px-3 py-3 text-left transition",
                          active
                            ? "border-[#c6d3ea] bg-[#eef3fb] shadow-[0_6px_18px_rgba(72,96,127,0.08)]"
                            : "border-[#d9dce1] bg-[#fafafa] hover:bg-white",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={stageBadge(matter.stage)}>
                                {STAGE_LABELS[matter.stage]}
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

                            <div className="mt-2 text-[16px] font-semibold text-[#243040]">
                              {matter.client}
                            </div>
                            <div className="mt-1 line-clamp-1 text-sm text-[#65707d]">
                              {matter.title}
                            </div>
                          </div>

                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#8b95a2]" />
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-[12px] text-[#6b7684]">
                          <Clock3 className="h-3.5 w-3.5" />
                          <span>{matter.due}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#d7d1c7] bg-[#f7f4ef] p-4">
                {selectedMatter ? (
                  <div className="space-y-3">
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

                    <div className="grid gap-3 sm:grid-cols-2">
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

                    <div className="rounded-[18px] border border-[#c6d3ea] bg-[#eef3fb] p-4">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#48607f]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Next Action
                      </div>
                      <p className="mt-2 text-[16px] leading-7 text-[#243040]">
                        {selectedMatter.nextAction}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <div className="grid gap-4">
            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:p-4">
              <div className="mb-3">
                <h2 className="text-[15px] font-semibold text-[#243040]">Matter Stage</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  Keep the matter flow readable without making it feel technical.
                </p>
              </div>

              <div className="rounded-[22px] border border-[#d7d1c7] bg-[#f7f4ef] p-3.5">
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  {STAGE_ORDER.map((stage, index) => {
                    const done = index < selectedStageIndex;
                    const current = index === selectedStageIndex;

                    return (
                      <div
                        key={stage}
                        className={cx(
                          "flex items-center justify-between rounded-[18px] border px-3.5 py-3",
                          current && "border-[#c6d3ea] bg-[#eef3fb]",
                          done && "border-[#c9d9cf] bg-[#edf7f0]",
                          !current && !done && "border-[#d9dce1] bg-[#fcfcfd]",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cx(
                              "flex h-8 w-8 items-center justify-center rounded-full border text-[12px] font-semibold",
                              current && "border-[#b9c8de] bg-white text-[#48607f]",
                              done && "border-[#bfd1c5] bg-white text-[#466a53]",
                              !current && !done && "border-[#d4d8de] bg-white text-[#738091]",
                            )}
                          >
                            {index + 1}
                          </div>

                          <div>
                            <div className="text-sm font-semibold text-[#243040]">
                              {STAGE_LABELS[stage]}
                            </div>
                            <div className="text-[11px] uppercase tracking-[0.16em] text-[#7a8593]">
                              {current ? "Current" : done ? "Complete" : "Upcoming"}
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 text-[#9aa3ae]" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:p-4">
              <div className="mb-3">
                <h2 className="text-[15px] font-semibold text-[#243040]">Schedule / Appointments</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  The day should support the work, not crowd it.
                </p>
              </div>

              <div className="space-y-2.5">
                {APPOINTMENTS.map((item) => (
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

                      <div className="rounded-full border border-[#d3d6dd] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#65717f]">
                        {item.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[0.94fr_1.06fr]">
          <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:p-4">
            <div className="mb-3">
              <h2 className="text-[15px] font-semibold text-[#243040]">Quick Note / Timestamp</h2>
              <p className="mt-1 text-xs text-[#6a7380]">
                Make a note fast, attach proof, and keep moving.
              </p>
            </div>

            <div className="rounded-[22px] border border-[#d7d1c7] bg-[#f7f4ef] p-3.5">
              <textarea
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                rows={6}
                className="w-full rounded-[18px] border border-[#d5d8de] bg-[#fcfcfd] p-4 text-[15px] leading-7 text-[#243040] outline-none placeholder:text-[#99a2ae]"
                placeholder="Type or dictate a quick note..."
              />

              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-[18px] border border-[#c7d1e1] bg-[#eef3fb] px-4 py-3 text-sm font-semibold text-[#48607f]"
                >
                  <Mic className="h-4 w-4" />
                  Dictate
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-[18px] border border-[#d8caad] bg-[#faf5e9] px-4 py-3 text-sm font-semibold text-[#806a43]"
                >
                  <Camera className="h-4 w-4" />
                  Photo
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-[18px] border border-[#d5d8de] bg-[#f7f8fa] px-4 py-3 text-sm font-semibold text-[#647080]"
                >
                  <Paperclip className="h-4 w-4" />
                  Attach
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-[18px] border border-[#c9d9cf] bg-[#edf7f0] px-4 py-3 text-sm font-semibold text-[#466a53]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Timestamp
                </button>
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:p-4">
              <div className="mb-3">
                <h2 className="text-[15px] font-semibold text-[#243040]">Sticky Notes</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  Tap one, view it, and update it fast.
                </p>
              </div>

              <div className="space-y-2.5">
                {STICKIES.map((note) => {
                  const active = activeSticky?.id === note.id;
                  return (
                    <button
                      key={note.id}
                      type="button"
                      onClick={() => setActiveStickyId(note.id)}
                      className={cx(
                        "w-full rounded-[20px] border px-3.5 py-3.5 text-left transition",
                        active
                          ? "border-[#d8caad] bg-[#faf5e9]"
                          : "border-[#d9dce1] bg-[#f7f8fa]",
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-[#9d814b]" />
                        <div>
                          <div className="text-sm font-semibold text-[#5f5034]">
                            {note.title}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-[#6b5b3d]">
                            {note.text}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 rounded-[20px] border border-[#d8caad] bg-[#faf5e9] p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#806a43]">
                  Selected Note
                </div>
                <p className="mt-2 text-sm leading-6 text-[#5f5034]">
                  {activeSticky?.text}
                </p>
              </div>
            </section>

            <section className="rounded-[24px] border border-[#d0cac0] bg-[#ebe7e0] p-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)] sm:p-4">
              <div className="mb-3">
                <h2 className="text-[15px] font-semibold text-[#243040]">Documents / Follow-up</h2>
                <p className="mt-1 text-xs text-[#6a7380]">
                  Keep supporting files and follow-up clear.
                </p>
              </div>

              <div className="space-y-2.5">
                {DOCS.map((item) => (
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

                      <div
                        className={cx(
                          "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                          docStatusClasses(item.status),
                        )}
                      >
                        {item.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-[20px] border border-[#d0cac0] bg-[#ebe7e0] px-3.5 py-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#75808e]">
              Quick Focus
            </div>
            <p className="mt-2 text-sm text-[#5f6b79]">
              Pull up the right matter fast and move the next action.
            </p>
          </div>

          <div className="rounded-[20px] border border-[#d0cac0] bg-[#ebe7e0] px-3.5 py-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#75808e]">
              Desk Logic
            </div>
            <p className="mt-2 text-sm text-[#5f6b79]">
              Bigger targets, cleaner stacking, less fake dashboard noise.
            </p>
          </div>

          <div className="rounded-[20px] border border-[#d0cac0] bg-[#ebe7e0] px-3.5 py-3 shadow-[0_12px_30px_rgba(74,63,50,0.08)]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#75808e]">
              Follow-through
            </div>
            <p className="mt-2 text-sm text-[#5f6b79]">
              Notes, proof, photos, and documents stay attached to the work.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}