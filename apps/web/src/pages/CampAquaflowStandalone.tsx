import { useMemo, useState } from "react";

type CampStage =
  | "Checked In"
  | "Water Course"
  | "Break / Hydration"
  | "Lunch Zone"
  | "Activity Zone"
  | "With Staff"
  | "Checked Out";

type TimelineEntry = {
  id: string;
  time: string;
  label: string;
};

type ChildCard = {
  id: string;
  childName: string;
  guardianName: string;
  activity: string;
  stage: CampStage;
  nextMove: string;
  staff: string;
  guardianPhone: string;
  checkInDate: string;
  checkInTime: string;
  notes: string;
  createdAt: string;
  timeline: TimelineEntry[];
};

const STAGES: CampStage[] = [
  "Checked In",
  "Water Course",
  "Break / Hydration",
  "Lunch Zone",
  "Activity Zone",
  "With Staff",
  "Checked Out",
];

const STAGE_DEFAULTS: Record<
  CampStage,
  { activity: string; nextMove: string }
> = {
  "Checked In": {
    activity: "Arrival processed",
    nextMove: "Move to assigned zone",
  },
  "Water Course": {
    activity: "Water play / swim rotation",
    nextMove: "Hydration break in 10 min",
  },
  "Break / Hydration": {
    activity: "Hydration and shade reset",
    nextMove: "Return to activity zone",
  },
  "Lunch Zone": {
    activity: "Lunch and seated supervision",
    nextMove: "Move back to activity zone",
  },
  "Activity Zone": {
    activity: "Camp activity rotation",
    nextMove: "Next scheduled movement pending",
  },
  "With Staff": {
    activity: "Staff-assisted movement",
    nextMove: "Return to assigned group",
  },
  "Checked Out": {
    activity: "Pickup complete",
    nextMove: "Released to guardian",
  },
};

function makeTimeline(entries: string[], baseDate: string): TimelineEntry[] {
  return entries.map((label, index) => ({
    id: `${baseDate}-${index}-${label}`,
    time: index === 0 ? `${baseDate}, 08:00 AM` : "",
    label,
  }));
}

const DEMO_CHILDREN: ChildCard[] = [
  {
    id: "camp-001",
    childName: "Bella R.",
    guardianName: "Heather Rossi",
    activity: "Swim group A",
    stage: "Water Course",
    nextMove: "Break in 10 min",
    staff: "Coach Mia",
    guardianPhone: "863-555-1201",
    checkInDate: "2026-04-18",
    checkInTime: "08:05",
    notes: "Confident swimmer. Sunscreen reapplied at 10:00.",
    createdAt: "2026-04-18T08:05:00",
    timeline: [
      { id: "bella-1", time: "2026-04-18, 08:05 AM", label: "Presence created" },
      { id: "bella-2", time: "", label: "Check-in scheduled" },
      { id: "bella-3", time: "", label: "Water Course → Current zone" },
      { id: "bella-4", time: "", label: "Swim group A → Live activity note" },
      { id: "bella-5", time: "", label: "Break in 10 min → Next movement target" },
    ],
  },
  {
    id: "camp-002",
    childName: "Jaxon T.",
    guardianName: "Danielle T.",
    activity: "Hydration and shade reset",
    stage: "Break / Hydration",
    nextMove: "Back to activity zone at 11:30",
    staff: "Counselor Rae",
    guardianPhone: "863-555-1202",
    checkInDate: "2026-04-18",
    checkInTime: "08:12",
    notes: "Took a cool-down break after water play.",
    createdAt: "2026-04-18T08:12:00",
    timeline: [
      { id: "jaxon-1", time: "2026-04-18, 08:12 AM", label: "Presence created" },
      { id: "jaxon-2", time: "", label: "Check-in scheduled" },
      { id: "jaxon-3", time: "", label: "Break / Hydration → Current zone" },
      { id: "jaxon-4", time: "", label: "Hydration and shade reset → Live activity note" },
      { id: "jaxon-5", time: "", label: "Back to activity zone at 11:30 → Next movement target" },
    ],
  },
  {
    id: "camp-003",
    childName: "Noah C.",
    guardianName: "Melissa C.",
    activity: "Arts tent",
    stage: "Activity Zone",
    nextMove: "Lunch zone at 12:00",
    staff: "Coach Elena",
    guardianPhone: "863-555-1203",
    checkInDate: "2026-04-18",
    checkInTime: "08:01",
    notes: "Doing well. Participating with group.",
    createdAt: "2026-04-18T08:01:00",
    timeline: [
      { id: "noah-1", time: "2026-04-18, 08:01 AM", label: "Presence created" },
      { id: "noah-2", time: "", label: "Check-in scheduled" },
      { id: "noah-3", time: "", label: "Activity Zone → Current zone" },
      { id: "noah-4", time: "", label: "Arts tent → Live activity note" },
      { id: "noah-5", time: "", label: "Lunch zone at 12:00 → Next movement target" },
    ],
  },
  {
    id: "camp-004",
    childName: "Ava M.",
    guardianName: "Chris M.",
    activity: "Pickup complete",
    stage: "Checked Out",
    nextMove: "Released to guardian",
    staff: "Coach Mia",
    guardianPhone: "863-555-1204",
    checkInDate: "2026-04-18",
    checkInTime: "08:03",
    notes: "Checked out at front gate.",
    createdAt: "2026-04-18T08:03:00",
    timeline: [
      { id: "ava-1", time: "2026-04-18, 08:03 AM", label: "Presence created" },
      { id: "ava-2", time: "", label: "Check-in scheduled" },
      { id: "ava-3", time: "", label: "Checked Out → Current zone" },
      { id: "ava-4", time: "", label: "Pickup complete → Live activity note" },
      { id: "ava-5", time: "", label: "Released to guardian → Next movement target" },
    ],
  },
];

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatCheckIn(date: string, time: string) {
  if (!date && !time) return "No check-in time set";
  if (date && time) return `${date} · ${time}`;
  return date || time;
}

function stageTone(stage: CampStage) {
  switch (stage) {
    case "Checked Out":
      return {
        pill: "border-indigo-400/25 bg-indigo-400/10 text-indigo-100",
        dot: "bg-indigo-300",
        label: "Checked Out",
      };
    case "With Staff":
    case "Break / Hydration":
      return {
        pill: "border-amber-400/25 bg-amber-400/10 text-amber-100",
        dot: "bg-amber-300",
        label: "Attention Layer",
      };
    default:
      return {
        pill: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
        dot: "bg-emerald-300",
        label: "Safe / Active",
      };
  }
}

function stageQuickNote(stage: CampStage) {
  switch (stage) {
    case "Checked In":
      return "Checked in and ready for camp flow.";
    case "Water Course":
      return "Now in water course rotation.";
    case "Break / Hydration":
      return "Moved to hydration break and shade.";
    case "Lunch Zone":
      return "Moved into lunch zone for supervised meal time.";
    case "Activity Zone":
      return "Now participating in activity zone.";
    case "With Staff":
      return "Currently with staff for supervised movement.";
    case "Checked Out":
      return "Checked out and released to guardian.";
  }
}

function buildGuardianUpdateMessage(card: ChildCard) {
  return `Hi ${card.guardianName}, this is Camp Aquaflow. ${card.childName} is currently in "${card.stage}". Activity: ${card.activity}. Next move: ${card.nextMove}.`;
}

function buildGuardianAlertMessage(card: ChildCard) {
  return `Hi ${card.guardianName}, Camp Aquaflow needs your attention regarding ${card.childName}. Current note: ${card.notes || "Please check in with staff."}`;
}

function buildGuardianCheckInMessage(card: ChildCard) {
  return `Hi ${card.guardianName}, ${card.childName} has been checked in to Camp Aquaflow for ${formatCheckIn(card.checkInDate, card.checkInTime)}.`;
}

function buildGuardianCheckoutMessage(card: ChildCard) {
  return `Hi ${card.guardianName}, ${card.childName} has been checked out from Camp Aquaflow. ${card.notes || "See you next time."}`;
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 ${
        accent
          ? "border-cyan-400/25 bg-cyan-400/10"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div
        className={`text-xs uppercase tracking-[0.22em] ${
          accent ? "text-cyan-200/70" : "text-slate-500"
        }`}
      >
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="block">
      <div className="mb-3 text-sm font-medium text-slate-300">{label}</div>
      <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white">
        {value || "—"}
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-3 text-sm font-medium text-slate-300">{label}</div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-cyan-400/[0.04]"
      />
    </label>
  );
}

function EditableTextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-3 text-sm font-medium text-slate-300">{label}</div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-cyan-400/[0.04]"
      />
    </label>
  );
}

function MessageActionCard({
  title,
  subtitle,
  message,
}: {
  title: string;
  subtitle: string;
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-slate-400">{subtitle}</div>
      <div className="mt-3 rounded-2xl border border-white/10 bg-[#070d1a] px-4 py-3 text-sm leading-6 text-slate-200">
        {message}
      </div>
    </div>
  );
}

function formatNowStamp() {
  return new Date().toLocaleString();
}

export default function CampAquaflowStandalone() {
  const [cards, setCards] = useState<ChildCard[]>(DEMO_CHILDREN);
  const [selectedId, setSelectedId] = useState<string | null>(DEMO_CHILDREN[0]?.id ?? null);

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedId) ?? null,
    [cards, selectedId],
  );

  const grouped = useMemo(
    () =>
      STAGES.map((stage) => ({
        stage,
        cards: cards.filter((card) => card.stage === stage),
      })),
    [cards],
  );

  const totals = useMemo(
    () => ({
      total: cards.length,
      active: cards.filter((card) => card.stage !== "Checked Out").length,
      checkedOut: cards.filter((card) => card.stage === "Checked Out").length,
      checkedIn: cards.filter((card) => card.stage === "Checked In").length,
    }),
    [cards],
  );

  function patchSelected(updater: (card: ChildCard) => ChildCard) {
    if (!selectedId) return;
    setCards((current) =>
      current.map((card) => (card.id === selectedId ? updater(card) : card)),
    );
  }

  function moveSelectedTo(stage: CampStage) {
    patchSelected((card) => {
      const defaults = STAGE_DEFAULTS[stage];
      const timelineEntry: TimelineEntry = {
        id: `${card.id}-${Date.now()}-${stage}`,
        time: formatNowStamp(),
        label: `${stage} → Movement recorded`,
      };

      return {
        ...card,
        stage,
        activity: defaults.activity,
        nextMove: defaults.nextMove,
        notes: stageQuickNote(stage),
        timeline: [timelineEntry, ...card.timeline].slice(0, 8),
      };
    });
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4 rounded-xl border border-cyan-400/20 bg-[#061226] px-4 py-3 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
          <div className="flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-cyan-200">
              <span className="opacity-60">Presence ID:</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 font-mono text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                HP-AQUAFLOW-DEMO
              </span>
              <span className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Presence Locked
              </span>
              <span className="opacity-30">|</span>
              <span className="opacity-60">Slug:</span>
              <span className="font-mono text-cyan-300">camp-aquaflow-demo</span>
              <span className="opacity-30">|</span>
              <span className="opacity-60">Status:</span>
              <span className="font-semibold text-emerald-300">Standalone Demo</span>
            </div>

            <div className="text-right text-[11px] uppercase tracking-[0.18em] text-white/40">
              Presence-first · Timestamp anchored
            </div>
          </div>
        </div>

        <div className="mb-6 overflow-hidden rounded-[30px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
          <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-8">
            <div>
              <div className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                LIVE CHILD PRESENCE
              </div>

              <h1 className="mt-4 text-3xl font-semibold md:text-5xl">Camp Aquaflow Live Board</h1>

              <p className="mt-3 max-w-3xl text-base text-slate-300 md:text-lg">
                Built for camps, youth programs, and child activity environments that need live presence,
                safety visibility, and timestamped movement across the day.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">
                  + Add Child
                </div>
                <div className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white">
                  Standalone Demo Mode
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white">
                  Safe for Creator City
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Demo status</div>
                  <div className="mt-3 text-2xl font-semibold">Board Ready</div>
                </div>

                <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                  Standalone
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div>City: Okeechobee</div>
                <div>Flow: Checked In → Water Course → Break / Hydration → Lunch Zone → Activity Zone → With Staff → Checked Out</div>
                <div>Mode: Camp Guardian</div>
                <div>Config Key: camp-guardian</div>
                <div>Live link: /planet/demo/camp-aquaflow</div>
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50">
                This page is standalone. No Supabase dependency. No slug collision. No shared live board dependency.
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard label="Children" value={totals.total} />
          <StatCard label="Active" value={totals.active} />
          <StatCard label="Checked Out" value={totals.checkedOut} />
          <StatCard label="Checked In" value={totals.checkedIn} accent />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[30px] border border-white/10 bg-[#081122] p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Live Camp Control</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Click any child card, then use the movement controls on the right to push them through the camp day live.
                </p>
              </div>

              <div className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                Camp Guardian System
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {grouped.map((column) => (
                <div key={column.stage} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold">{column.stage}</h3>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {column.cards.length}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {column.cards.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500">
                        No children in this zone yet.
                      </div>
                    ) : (
                      column.cards.map((card) => {
                        const selected = selectedId === card.id;
                        const tone = stageTone(card.stage);

                        return (
                          <div
                            key={card.id}
                            className={`rounded-[18px] border p-3 transition ${
                              selected
                                ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_26px_rgba(34,211,238,0.10)]"
                                : "border-white/10 bg-white/[0.03]"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedId(card.id)}
                              className="w-full text-left"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                    <span>Protected Child Card</span>
                                    <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                                  </div>
                                  <div className="mt-1 truncate text-lg font-semibold text-white">{card.childName}</div>
                                  <div className="mt-1 truncate text-sm text-cyan-100">{card.stage}</div>
                                  <div className="mt-1 truncate text-sm text-slate-400">With {card.staff}</div>
                                </div>

                                <div className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone.pill}`}>
                                  {tone.label}
                                </div>
                              </div>

                              <div className="mt-3 grid gap-2 md:grid-cols-2">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Guardian</div>
                                  <div className="mt-1 line-clamp-1 text-sm text-slate-200">{card.guardianName}</div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Activity</div>
                                  <div className="mt-1 line-clamp-1 text-sm text-slate-200">{card.activity}</div>
                                </div>
                              </div>

                              <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                                <span className="truncate">Next: {card.nextMove}</span>
                                <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-100">
                                  Profile Protected
                                </span>
                              </div>
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#081122] p-5">
            {selectedCard ? (
              <>
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Protected Child Card</div>
                    <div className="mt-2 text-2xl font-semibold">{selectedCard.childName}</div>
                    <div className="mt-1 text-sm text-slate-400">Controlled guardian drawer</div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200">
                      <span className={`h-2.5 w-2.5 rounded-full ${stageTone(selectedCard.stage).dot}`} />
                      <span>{stageTone(selectedCard.stage).label}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Live movement controls</div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {STAGES.map((stage) => {
                      const active = selectedCard.stage === stage;
                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() => moveSelectedTo(stage)}
                          className={`rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition ${
                            active
                              ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-50"
                              : "border-white/10 bg-white/[0.04] text-white hover:border-cyan-400/25 hover:bg-cyan-400/[0.06]"
                          }`}
                        >
                          {stage}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <Field label="Guardian Name" value={selectedCard.guardianName} />
                  <Field label="Child Name" value={selectedCard.childName} />

                  <EditableField
                    label="Activity / Status"
                    value={selectedCard.activity}
                    onChange={(value) =>
                      patchSelected((card) => ({
                        ...card,
                        activity: value,
                      }))
                    }
                    placeholder="Enter activity or status"
                  />

                  <Field label="Current Zone" value={selectedCard.stage} />

                  <EditableField
                    label="Next Move / Timing"
                    value={selectedCard.nextMove}
                    onChange={(value) =>
                      patchSelected((card) => ({
                        ...card,
                        nextMove: value,
                      }))
                    }
                    placeholder="Enter next move"
                  />

                  <EditableField
                    label="Staff / Supervisor"
                    value={selectedCard.staff}
                    onChange={(value) =>
                      patchSelected((card) => ({
                        ...card,
                        staff: value,
                      }))
                    }
                    placeholder="Enter staff name"
                  />

                  <Field label="Guardian Contact" value={selectedCard.guardianPhone} />
                  <Field label="Check-In Date" value={selectedCard.checkInDate} />
                  <Field label="Check-In Time" value={selectedCard.checkInTime} />

                  <EditableTextArea
                    label="Safety Notes"
                    value={selectedCard.notes}
                    onChange={(value) =>
                      patchSelected((card) => ({
                        ...card,
                        notes: value,
                      }))
                    }
                    placeholder="Enter safety note"
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">PredatorShield lock</div>
                      <div className="mt-2 text-sm leading-6 text-emerald-50">
                        Child profile is protected. This drawer is for movement, guardian contact, staffing, and safety notes only.
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Presence timeline</div>
                      <div className="mt-3 space-y-2 text-sm leading-6 text-cyan-50">
                        <div>{formatDateTime(selectedCard.createdAt)} → Presence created</div>
                        <div>{formatCheckIn(selectedCard.checkInDate, selectedCard.checkInTime)} → Check-in scheduled</div>
                        {selectedCard.timeline.map((entry) => (
                          <div key={entry.id}>
                            {entry.time ? `${entry.time} → ` : ""}{entry.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Guardian contact actions</div>
                        <div className="mt-2 text-sm leading-6 text-cyan-50">
                          Standalone demo messages for live guardian communication flow.
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <MessageActionCard
                        title="Movement update"
                        subtitle="Log a child movement or live activity update"
                        message={buildGuardianUpdateMessage(selectedCard)}
                      />
                      <MessageActionCard
                        title="Guardian attention"
                        subtitle="Send a guardian-facing attention or awareness message"
                        message={buildGuardianAlertMessage(selectedCard)}
                      />
                      <MessageActionCard
                        title="Check-in confirmation"
                        subtitle="Confirm arrival or attendance timing"
                        message={buildGuardianCheckInMessage(selectedCard)}
                      />
                      <MessageActionCard
                        title="Checkout confirmation"
                        subtitle="Notify that the child has been checked out"
                        message={buildGuardianCheckoutMessage(selectedCard)}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
