import React, { useMemo, useRef, useState } from "react";

type MatterStage = "Intake" | "Review" | "Strategy" | "Scheduled" | "Done";
type NoteTone = "amber" | "cyan" | "emerald";
type AlertTone = "info" | "success" | "warning";

type MatterCard = {
  id: string;
  title: string;
  stage: MatterStage;
  client: string;
  summary: string;
  nextStep: string;
  owner: string;
  when: string;
};

type StickyNote = {
  id: string;
  text: string;
  tone: NoteTone;
  pinned?: boolean;
};

type Appointment = {
  id: string;
  title: string;
  when: string;
  type: "Call" | "Beam" | "Review";
  status: "Scheduled" | "Ready" | "Pending";
};

type AlertItem = {
  id: string;
  title: string;
  body: string;
  tone: AlertTone;
};

const matterSeed: MatterCard[] = [
  {
    id: "m-1",
    title: "IP Attorney Referral Follow-up",
    stage: "Strategy",
    client: "Dan Doyon",
    summary: "Coordinate referral details and organize concept stack before handoff.",
    nextStep: "Finalize referral packet and beam summary card",
    owner: "Joe Grant",
    when: "Today • 2:30 PM",
  },
  {
    id: "m-2",
    title: "Case Review Notes",
    stage: "Review",
    client: "Shared matter",
    summary: "Cross-check facts, preserve chronology, and keep attorney-facing summary tight.",
    nextStep: "Review note cluster and tag priority items",
    owner: "Joe Grant",
    when: "Today • 4:00 PM",
  },
  {
    id: "m-3",
    title: "Client Scheduling Window",
    stage: "Scheduled",
    client: "Dan Doyon",
    summary: "Reserve a clean slot for a strategy call and supporting document review.",
    nextStep: "Send meeting confirmation",
    owner: "Joe Grant",
    when: "Tomorrow • 10:15 AM",
  },
];

const noteSeed: StickyNote[] = [
  { id: "n-1", text: "Ask IP attorney whether provisional scope should be split by layer.", tone: "amber", pinned: true },
  { id: "n-2", text: "Keep referral summary simple — no overload on first handoff.", tone: "cyan" },
  { id: "n-3", text: "Beam card should show next call time + core issue + latest note.", tone: "emerald" },
];

const appointmentSeed: Appointment[] = [
  { id: "a-1", title: "Referral call prep", when: "Today • 1:45 PM", type: "Review", status: "Ready" },
  { id: "a-2", title: "Strategy call with Dan", when: "Tomorrow • 10:15 AM", type: "Beam", status: "Scheduled" },
  { id: "a-3", title: "Case note review", when: "Tomorrow • 2:00 PM", type: "Call", status: "Pending" },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function stageClasses(stage: MatterStage) {
  switch (stage) {
    case "Intake":
      return "border-cyan-400/25 bg-cyan-500/10 text-cyan-100";
    case "Review":
      return "border-amber-400/25 bg-amber-500/10 text-amber-100";
    case "Strategy":
      return "border-violet-400/25 bg-violet-500/10 text-violet-100";
    case "Scheduled":
      return "border-emerald-400/25 bg-emerald-500/10 text-emerald-100";
    default:
      return "border-white/10 bg-white/5 text-white/75";
  }
}

function noteToneClasses(tone: NoteTone) {
  switch (tone) {
    case "amber":
      return "border-amber-400/35 bg-amber-500/12 text-amber-50";
    case "cyan":
      return "border-cyan-400/35 bg-cyan-500/12 text-cyan-50";
    default:
      return "border-emerald-400/35 bg-emerald-500/12 text-emerald-50";
  }
}

function appointmentClasses(status: Appointment["status"]) {
  switch (status) {
    case "Ready":
      return "border-emerald-400/30 bg-emerald-500/12 text-emerald-100";
    case "Scheduled":
      return "border-cyan-400/30 bg-cyan-500/12 text-cyan-100";
    default:
      return "border-amber-400/30 bg-amber-500/12 text-amber-100";
  }
}

function alertClasses(tone: AlertTone) {
  switch (tone) {
    case "success":
      return "border-emerald-400/30 bg-emerald-500/12 text-emerald-100";
    case "warning":
      return "border-amber-400/30 bg-amber-500/12 text-amber-100";
    default:
      return "border-cyan-400/30 bg-cyan-500/12 text-cyan-100";
  }
}

export default function JoeGrantLegalDesk() {
  const [matters, setMatters] = useState<MatterCard[]>(matterSeed);
  const [notes, setNotes] = useState<StickyNote[]>(noteSeed);
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentSeed);
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "seed-1",
      title: "Beam Ready",
      body: "Strategy call beam card ready for Joe Grant",
      tone: "success",
    },
  ]);

  const nextNoteRef = useRef(4);
  const nextApptRef = useRef(4);

  function pushAlert(title: string, body: string, tone: AlertTone) {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setAlerts((prev) => [{ id, title, body, tone }, ...prev].slice(0, 4));
  }

  function addStickyNote() {
    const samples = [
      { text: "Call IP attorney after lunch and confirm intake format.", tone: "amber" as NoteTone },
      { text: "Keep chronology visible near top of legal pad.", tone: "cyan" as NoteTone },
      { text: "Beam appointment should open with referral summary card.", tone: "emerald" as NoteTone },
    ];

    const pick = samples[(nextNoteRef.current - 4) % samples.length];

    setNotes((prev) => [
      {
        id: `n-${nextNoteRef.current++}`,
        text: pick.text,
        tone: pick.tone,
      },
      ...prev,
    ]);

    pushAlert("Sticky Note Added", "Joe Grant legal pad updated", "info");
  }

  function togglePin(noteId: string) {
    setNotes((prev) =>
      prev
        .map((note) => (note.id === noteId ? { ...note, pinned: !note.pinned } : note))
        .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
    );
  }

  function addAppointment() {
    const samples: Array<Omit<Appointment, "id">> = [
      { title: "Beam case sync", when: "Friday • 11:00 AM", type: "Beam", status: "Scheduled" },
      { title: "Attorney note review", when: "Friday • 1:30 PM", type: "Review", status: "Pending" },
      { title: "Client follow-up call", when: "Friday • 3:15 PM", type: "Call", status: "Scheduled" },
    ];

    const pick = samples[(nextApptRef.current - 4) % samples.length];

    setAppointments((prev) => [
      {
        id: `a-${nextApptRef.current++}`,
        ...pick,
      },
      ...prev,
    ]);

    pushAlert("Appointment Added", `${pick.title} scheduled`, "success");
  }

  function markReady(apptId: string) {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === apptId ? { ...appt, status: "Ready" } : appt))
    );
    const appt = appointments.find((a) => a.id === apptId);
    if (appt) pushAlert("Beam Ready", `${appt.title} is ready to open`, "success");
  }

  function openBeamCard() {
    pushAlert("Beam Card", "Referral summary card opened for Joe Grant", "success");
  }

  function sendBeamLink() {
    pushAlert("Beam Link Sent", "Secure meeting link prepared for strategy call", "info");
  }

  function advanceMatter(matterId: string) {
    const order: MatterStage[] = ["Intake", "Review", "Strategy", "Scheduled", "Done"];

    setMatters((prev) =>
      prev.map((matter) => {
        if (matter.id !== matterId) return matter;
        const currentIndex = order.indexOf(matter.stage);
        const nextStage = order[Math.min(currentIndex + 1, order.length - 1)];
        return { ...matter, stage: nextStage };
      })
    );

    const matter = matters.find((m) => m.id === matterId);
    if (matter) {
      pushAlert("Matter Updated", `${matter.title} moved forward`, "info");
    }
  }

  const activeMatters = matters.filter((m) => m.stage !== "Done").length;
  const todayAppointments = appointments.length;
  const pinnedNotes = notes.filter((n) => n.pinned).length;
  const beamReady = appointments.filter((a) => a.status === "Ready").length;

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))),
    [notes]
  );

  return (
    <div className="min-h-screen bg-[#07111b] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(167,139,250,0.12),_transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200 sm:text-[11px]">
                    Legal Planet Demo
                  </div>

                  <span className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200 sm:text-[11px]">
                    Joe Grant Desk
                  </span>
                </div>

                <h1 className="mt-2 text-[28px] font-extrabold tracking-tight text-white sm:text-[34px] md:text-[38px]">
                  Joe Grant Legal Pad
                </h1>

                <p className="mt-2 max-w-3xl text-sm text-white/70 md:text-base">
                  A clean attorney-facing desk for matters, sticky notes, scheduling, and beam-ready follow-up.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
                <button
                  onClick={addStickyNote}
                  className="min-h-[46px] rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/15"
                >
                  + Sticky Note
                </button>

                <button
                  onClick={addAppointment}
                  className="min-h-[46px] rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/15"
                >
                  + Appointment
                </button>

                <button
                  onClick={openBeamCard}
                  className="min-h-[46px] rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/15 sm:col-span-2 lg:col-span-1 xl:col-span-1"
                >
                  Open Beam Card
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              <MetricCard label="Active Matters" value={activeMatters} />
              <MetricCard label="Appointments" value={todayAppointments} />
              <MetricCard label="Pinned Notes" value={pinnedNotes} />
              <MetricCard label="Beam Ready" value={beamReady} />
            </div>
          </div>

          <main className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
            <section className="rounded-3xl border border-cyan-400/20 bg-white/5 p-3 sm:p-4 xl:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">
                    Matter Desk
                  </div>
                  <div className="mt-1 text-2xl font-bold">Open Matters</div>
                </div>

                <button
                  onClick={sendBeamLink}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/10 sm:text-sm"
                >
                  Send Beam Link
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {matters.map((matter) => (
                  <article key={matter.id} className="rounded-2xl border border-white/10 bg-[#0c1623] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-lg font-bold text-white">{matter.title}</div>
                        <div className="mt-1 text-sm text-white/70">{matter.client}</div>
                      </div>

                      <div className={cn("rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]", stageClasses(matter.stage))}>
                        {matter.stage}
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/85">
                      {matter.summary}
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <span className="text-white/45">Next:</span> {matter.nextStep}
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <span className="text-white/45">Owner:</span> {matter.owner}
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                        <span className="text-white/45">When:</span> {matter.when}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => advanceMatter(matter.id)}
                        className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/15"
                      >
                        Advance
                      </button>
                      <button
                        onClick={openBeamCard}
                        className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/15"
                      >
                        Beam Card
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <div className="rounded-3xl border border-amber-400/20 bg-white/5 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">
                      Sticky Notes
                    </div>
                    <div className="mt-1 text-2xl font-bold">Personal Legal Pad</div>
                  </div>

                  <button
                    onClick={addStickyNote}
                    className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/15 sm:text-sm"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {sortedNotes.map((note) => (
                    <div
                      key={note.id}
                      className={cn("rounded-2xl border p-3", noteToneClasses(note.tone))}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-sm font-semibold leading-6">{note.text}</div>
                        <button
                          onClick={() => togglePin(note.id)}
                          className="shrink-0 rounded-lg border border-white/10 bg-black/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/80"
                        >
                          {note.pinned ? "Pinned" : "Pin"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-400/20 bg-white/5 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-white/45 sm:text-[11px]">
                      Appointments
                    </div>
                    <div className="mt-1 text-2xl font-bold">Schedule + Beam</div>
                  </div>

                  <button
                    onClick={addAppointment}
                    className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-500/15 sm:text-sm"
                  >
                    Schedule
                  </button>
                </div>

                <div className="space-y-2">
                  {appointments.map((appt) => (
                    <div key={appt.id} className="rounded-2xl border border-white/10 bg-[#0c1623] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white">{appt.title}</div>
                          <div className="mt-1 text-sm text-white/70">{appt.when}</div>
                        </div>

                        <div className={cn("rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]", appointmentClasses(appt.status))}>
                          {appt.status}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/85">
                          {appt.type}
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => markReady(appt.id)}
                          className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/15"
                        >
                          Mark Ready
                        </button>
                        <button
                          onClick={openBeamCard}
                          className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/15"
                        >
                          Open Beam
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>

          <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,360px)] flex-col gap-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn("pointer-events-auto rounded-2xl border px-4 py-3 shadow-2xl shadow-black/30", alertClasses(alert.tone))}
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">
                  {alert.title}
                </div>
                <div className="mt-1 text-sm font-semibold">{alert.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
      <div className="text-xs uppercase text-white/50">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}