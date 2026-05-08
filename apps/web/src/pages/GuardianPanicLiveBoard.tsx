import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type PanicSignal = {
  id: string;
  label: string;
  distance: string;
  type: "car" | "business" | "house" | "sound";
};

type PanicTimelineEvent = {
  id: string;
  type: "trigger" | "presence" | "location" | "signal" | "message" | "status";
  title: string;
  detail: string;
  createdAt: string;
};

type PanicIncident = {
  incidentId: string;
  status: "active" | "responding" | "resolved";
  profile: {
    name: string;
    type: "child" | "elder" | "pet" | "medical" | "mixed";
    label?: string;
    status?: string;
    contactName?: string;
    contactRelation?: string;
    contactPhone?: string;
    wearerPhone?: string;
    homeBase?: string;
    destination?: string;
    destinationPhone?: string;
    routeState?: string;
    pairedDeviceName?: string;
    isPaired?: boolean;
  };
  startedAt: string;
  startedAtLabel?: string;
  locationLabel: string;
  notes?: string;
  nearbySignals: PanicSignal[];
  timeline: PanicTimelineEvent[];
};

function formatDateTime(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatElapsed(startedAt?: string) {
  if (!startedAt) return "00:00";

  const start = new Date(startedAt).getTime();
  if (Number.isNaN(start)) return "00:00";

  const diffSeconds = Math.max(0, Math.floor((Date.now() - start) / 1000));
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatPhone(phone?: string) {
  if (!phone) return "—";

  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    const ten = digits.slice(1);
    return `+1 (${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function statusCopy(status: PanicIncident["status"]) {
  if (status === "responding") {
    return {
      label: "Responding",
      tone: "border-sky-400/30 bg-sky-500/10 text-sky-100",
    };
  }

  if (status === "resolved") {
    return {
      label: "Resolved",
      tone: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
    };
  }

  return {
    label: "Active",
    tone: "border-red-400/30 bg-red-500/10 text-red-100",
  };
}

function eventTone(type: PanicTimelineEvent["type"]) {
  switch (type) {
    case "trigger":
      return "border-red-400/25 bg-red-500/10 text-red-100";
    case "presence":
      return "border-cyan-400/25 bg-cyan-500/10 text-cyan-100";
    case "location":
      return "border-amber-400/25 bg-amber-500/10 text-amber-100";
    case "signal":
      return "border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-100";
    case "message":
      return "border-indigo-400/25 bg-indigo-500/10 text-indigo-100";
    case "status":
      return "border-emerald-400/25 bg-emerald-500/10 text-emerald-100";
    default:
      return "border-white/15 bg-white/10 text-white";
  }
}

function stageIsActive(
  current: PanicIncident["status"],
  stage: "created" | "active" | "responding" | "resolved",
) {
  if (stage === "created") return true;
  if (stage === "active") return current === "active" || current === "responding" || current === "resolved";
  if (stage === "responding") return current === "responding" || current === "resolved";
  return current === "resolved";
}

const FALLBACK_INCIDENT: PanicIncident = {
  incidentId: "panic-demo",
  status: "active",
  profile: {
    name: "Haley",
    type: "child",
    label: "School Route",
    status: "Route active",
    contactName: "Daniel Doyon",
    contactRelation: "Parent Contact",
    contactPhone: "8635320683",
    wearerPhone: "19032466394",
    homeBase: "SE 29th Court — Home",
    destination: "Okeechobee High School",
    destinationPhone: "8634625025",
    routeState: "On Route",
    pairedDeviceName: "Desktop Browser",
    isPaired: false,
  },
  startedAt: new Date().toISOString(),
  startedAtLabel: new Date().toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }),
  locationLabel: "Okeechobee, FL",
  notes: "Guardian emergency response incident.",
  nearbySignals: [
    { id: "fallback-1", label: "Car alarm", distance: "Approx 120 ft", type: "car" },
    { id: "fallback-2", label: "Loud sound spike", distance: "Approx nearby", type: "sound" },
  ],
  timeline: [
    {
      id: "fallback-evt-1",
      type: "trigger",
      title: "Panic triggered",
      detail: "Guardian Panic Mode manually activated.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "fallback-evt-2",
      type: "presence",
      title: "Presence locked",
      detail: "Origin event captured and timestamped.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "fallback-evt-3",
      type: "signal",
      title: "Car alarm detected",
      detail: "Approx 120 ft",
      createdAt: new Date().toISOString(),
    },
  ],
};

export default function GuardianPanicLiveBoard() {
  const navigate = useNavigate();
  const { incidentId } = useParams<{ incidentId: string }>();

  const [incident, setIncident] = useState<PanicIncident | null>(null);
  const [elapsed, setElapsed] = useState("00:00");
  const [messageText, setMessageText] = useState("");
  const [alarmActive, setAlarmActive] = useState(false);

  useEffect(() => {
    const key = incidentId ? `guardian-panic:${incidentId}` : "";
    const saved = key ? localStorage.getItem(key) : null;

    if (!saved) {
      setIncident(FALLBACK_INCIDENT);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as PanicIncident;
      setIncident(parsed);
    } catch (error) {
      console.error("Unable to parse Guardian Panic incident.", error);
      setIncident(FALLBACK_INCIDENT);
    }
  }, [incidentId]);

  useEffect(() => {
    if (!incident?.startedAt) return;

    setElapsed(formatElapsed(incident.startedAt));

    const interval = window.setInterval(() => {
      setElapsed(formatElapsed(incident.startedAt));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [incident?.startedAt]);

  const statusMeta = useMemo(
    () => statusCopy(incident?.status ?? "active"),
    [incident?.status],
  );

  function persistIncident(next: PanicIncident) {
    setIncident(next);

    if (incidentId) {
      localStorage.setItem(`guardian-panic:${incidentId}`, JSON.stringify(next));
    }
  }

  function appendTimelineEvent(event: PanicTimelineEvent) {
    if (!incident) return;

    const next: PanicIncident = {
      ...incident,
      timeline: [event, ...incident.timeline],
    };

    persistIncident(next);
  }

  function updateStatus(nextStatus: PanicIncident["status"]) {
    if (!incident) return;

    const updated: PanicIncident = {
      ...incident,
      status: nextStatus,
    };

    const event: PanicTimelineEvent = {
      id: `evt-status-${Date.now()}`,
      type: "status",
      title:
        nextStatus === "responding"
          ? "Responders moving"
          : nextStatus === "resolved"
            ? "Incident resolved"
            : "Incident active",
      detail:
        nextStatus === "responding"
          ? "Guardian incident marked as responding."
          : nextStatus === "resolved"
            ? "Guardian incident marked as resolved."
            : "Guardian incident returned to active state.",
      createdAt: new Date().toISOString(),
    };

    updated.timeline = [event, ...updated.timeline];
    persistIncident(updated);
  }

  function handleSendUpdate() {
    if (!incident || !messageText.trim()) return;

    appendTimelineEvent({
      id: `evt-message-${Date.now()}`,
      type: "message",
      title: "Update sent",
      detail: messageText.trim(),
      createdAt: new Date().toISOString(),
    });

    setMessageText("");
  }

  function handleSoundAlarm() {
    const nextAlarmState = !alarmActive;
    setAlarmActive(nextAlarmState);

    appendTimelineEvent({
      id: `evt-alarm-${Date.now()}`,
      type: "signal",
      title: nextAlarmState ? "Alarm sounded" : "Alarm silenced",
      detail: nextAlarmState
        ? "Local incident alarm was activated."
        : "Local incident alarm was turned off.",
      createdAt: new Date().toISOString(),
    });
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 text-sm text-white/70">
            Loading Guardian Panic incident...
          </div>
        </div>
      </div>
    );
  }

  const sourceCards = [
    {
      label: "Origin source",
      value: "Guardian Presence Desk",
    },
    {
      label: "Profile label",
      value: incident.profile.label || "Guardian protected profile",
    },
    {
      label: "Device state",
      value: incident.profile.isPaired
        ? `Paired • ${incident.profile.pairedDeviceName || "Linked device"}`
        : "Not paired",
    },
    {
      label: "Route / state",
      value: incident.profile.routeState || incident.profile.status || "Monitoring",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[30px] border border-red-500/25 bg-white/[0.03] shadow-[0_0_50px_rgba(255,60,60,0.12)]">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,70,70,0.18),rgba(5,8,22,0.96)_58%)] px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-red-100">
                  Guardian Panic Live Board
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {incident.profile.name}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
                    Live panic incident timeline with nearby signal context and response state.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Status</div>
                  <div
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusMeta.tone}`}
                  >
                    {statusMeta.label}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Elapsed</div>
                  <div className="mt-2 text-lg font-semibold text-white">{elapsed}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Started</div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {incident.startedAtLabel || formatDateTime(incident.startedAt)}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Location</div>
                  <div className="mt-2 text-sm font-medium text-white">{incident.locationLabel}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-4">
                {[
                  {
                    key: "created",
                    title: "Incident Created",
                    active: stageIsActive(incident.status, "created"),
                    description: "Origin captured and presence locked.",
                  },
                  {
                    key: "active",
                    title: "Active / Searching",
                    active: stageIsActive(incident.status, "active"),
                    description: "Incident is live and updating.",
                  },
                  {
                    key: "responding",
                    title: "Responding",
                    active: stageIsActive(incident.status, "responding"),
                    description: "Guardian responders are moving.",
                  },
                  {
                    key: "resolved",
                    title: "Resolved",
                    active: stageIsActive(incident.status, "resolved"),
                    description: "Incident has been closed out.",
                  },
                ].map((stage) => (
                  <div
                    key={stage.key}
                    className={`rounded-[24px] border p-4 transition ${
                      stage.active
                        ? "border-red-400/30 bg-red-500/10 shadow-[0_0_30px_rgba(255,70,70,0.12)]"
                        : "border-white/10 bg-black/20"
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Stage</div>
                    <div className="mt-2 text-sm font-semibold text-white">{stage.title}</div>
                    <p className="mt-2 text-sm leading-6 text-white/62">{stage.description}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.025] p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Truth Layer timeline</h2>
                    <p className="mt-1 text-sm text-white/60">
                      Every panic event is anchored to a visible timestamp.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus("active")}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 transition hover:border-white/20 hover:bg-black/30"
                    >
                      Mark active
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus("responding")}
                      className="rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-100 transition hover:scale-[1.01]"
                    >
                      Mark responding
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus("resolved")}
                      className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100 transition hover:scale-[1.01]"
                    >
                      Mark resolved
                    </button>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {incident.timeline.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-[22px] border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <div
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${eventTone(
                              event.type,
                            )}`}
                          >
                            {event.type}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                            <p className="mt-1 text-sm leading-6 text-white/68">{event.detail}</p>
                          </div>
                        </div>

                        <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                          {formatDateTime(event.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-[26px] border border-cyan-400/20 bg-cyan-900/10 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Guardian Source</h2>
                    <p className="mt-1 text-sm text-white/60">
                      Verified source context carried from the originating Guardian profile.
                    </p>
                  </div>
                  <div className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                    Truth source
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {sourceCards.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[22px] border border-white/10 bg-black/20 p-4"
                    >
                      <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                        {item.label}
                      </div>
                      <div className="mt-2 text-sm font-medium text-white">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[22px] border border-white/10 bg-black/20 p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                    Contact relay
                  </div>
                  <div className="mt-2 space-y-2 text-sm text-white/78">
                    <div>
                      <span className="text-white/45">Primary contact:</span>{" "}
                      <span className="font-medium text-white">
                        {incident.profile.contactName || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/45">Relation:</span>{" "}
                      <span className="font-medium text-white">
                        {incident.profile.contactRelation || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/45">Contact phone:</span>{" "}
                      <span className="font-medium text-white">
                        {formatPhone(incident.profile.contactPhone)}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/45">Wearer phone:</span>{" "}
                      <span className="font-medium text-white">
                        {formatPhone(incident.profile.wearerPhone)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.025] p-5">
                <h2 className="text-lg font-semibold">Protected profile card</h2>

                <div className="mt-4 space-y-3 rounded-[22px] border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.22em] text-white/45">Name</span>
                    <span className="text-sm font-medium text-white">{incident.profile.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.22em] text-white/45">Type</span>
                    <span className="text-sm font-medium capitalize text-white">
                      {incident.profile.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.22em] text-white/45">Incident ID</span>
                    <span className="text-sm font-medium text-white">{incident.incidentId}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-[22px] border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/45">Notes</div>
                  <div className="mt-2 whitespace-pre-line text-sm leading-6 text-white/72">
                    {incident.notes?.trim() || "No additional incident notes recorded yet."}
                  </div>
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Nearby signal layer</h2>
                    <p className="mt-1 text-sm text-white/60">
                      This is the first visible version of your nearby alarm awareness idea.
                    </p>
                  </div>
                  <div className="rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-fuchsia-100">
                    Active Response
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {incident.nearbySignals.length > 0 ? (
                    incident.nearbySignals.map((signal) => (
                      <div
                        key={signal.id}
                        className="rounded-[22px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-4"
                      >
                        <div className="text-sm font-semibold text-white">{signal.label}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.22em] text-white/50">
                          {signal.distance}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 text-sm text-white/65">
                      No nearby signals recorded yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.025] p-5">
                <h2 className="text-lg font-semibold">Action rail</h2>

                <div className="mt-4 grid gap-3">
                  <button
                    type="button"
                    onClick={handleSoundAlarm}
                    className={`rounded-[20px] border px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                      alarmActive
                        ? "border-red-300/25 bg-red-500/85 text-white"
                        : "border-red-400/25 bg-red-500/10 text-red-100 hover:bg-red-500/20"
                    }`}
                  >
                    {alarmActive ? "Silence local alarm" : "Sound local alarm"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      appendTimelineEvent({
                        id: `evt-location-${Date.now()}`,
                        type: "location",
                        title: "Location ping updated",
                        detail: incident.locationLabel,
                        createdAt: new Date().toISOString(),
                      })
                    }
                    className="rounded-[20px] border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-100 transition hover:bg-amber-500/20"
                  >
                    Add location ping
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/planet/guardian/panic")}
                    className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/75 transition hover:border-white/20 hover:bg-black/30"
                  >
                    Start new panic
                  </button>
                </div>

                <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-white/45">Send update</div>

                  <textarea
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    rows={4}
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400/35 focus:bg-black/40"
                    placeholder="Parent notified. Searching east side. Nearby business alarm active."
                  />

                  <button
                    type="button"
                    onClick={handleSendUpdate}
                    className="mt-3 w-full rounded-[18px] border border-indigo-400/25 bg-indigo-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-100 transition hover:bg-indigo-500/20"
                  >
                    Add message event
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
