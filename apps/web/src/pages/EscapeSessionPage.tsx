import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { EscapeSession } from "./EscapeSessionLauncher";
import { getScenarioLine, resolveEscapeScenario } from "../lib/escapeScenarios";

type EscapeTimelineEvent = EscapeSession["timeline"][number];

const STORAGE_KEY = "hp_escape_sessions";

type PanelMode =
  | null
  | "timeline"
  | "team"
  | "controls"
  | "notes"
  | "stage_overview";

function safeReadSessions(): Record<string, EscapeSession> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, EscapeSession>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function writeSessions(sessions: Record<string, EscapeSession>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function createId() {
  return `esc_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function createTimelineEvent(
  type: EscapeTimelineEvent["type"],
  label: string
): EscapeTimelineEvent {
  return {
    id: createId(),
    type,
    label,
    timestamp: new Date().toISOString(),
  };
}

function formatClock(ms: number) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.floor(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatEventTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

function computeRemainingMs(session: EscapeSession, now: number) {
  const startMs = new Date(session.startedAt).getTime();
  const limitMs = session.timeLimitMinutes * 60 * 1000;

  if (session.status === "paused" && session.pausedAt) {
    const pausedAtMs = new Date(session.pausedAt).getTime();
    return limitMs - (pausedAtMs - startMs - session.pausedTotalMs);
  }

  const endOffset = now - startMs - session.pausedTotalMs;
  return limitMs - endOffset;
}

export default function EscapeSessionPage() {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<EscapeSession | null>(null);
  const [panelMode, setPanelMode] = useState<PanelMode>("timeline");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [noteDraft, setNoteDraft] = useState("");

  const fifteenMinuteWarningSent = useRef(false);
  const fiveMinuteWarningSent = useRef(false);

  useEffect(() => {
    const sessions = safeReadSessions();
    const found = sessions[sessionId] ?? null;
    setSession(found);
  }, [sessionId]);

  useEffect(() => {
    if (!session) return;

    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [session]);

  const remainingMs = useMemo(() => {
    if (!session) return 0;
    return computeRemainingMs(session, nowMs);
  }, [session, nowMs]);

  const scenario = useMemo(() => {
    if (!session) return null;
    return resolveEscapeScenario(session.roomName);
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (session.status !== "active") return;
    if (remainingMs > 0) return;

    const failureLine = getScenarioLine(session.roomName, "session_failed", session.id);

    const updated: EscapeSession = {
      ...session,
      status: "failed",
      completedAt: new Date().toISOString(),
      timeline: [
        createTimelineEvent("session_failed", failureLine),
        ...session.timeline,
      ],
    };

    persistSession(updated);
  }, [remainingMs, session]);

  useEffect(() => {
    if (!session) return;
    if (session.status !== "active") return;

    if (
      remainingMs <= 15 * 60 * 1000 &&
      remainingMs > 5 * 60 * 1000 &&
      !fifteenMinuteWarningSent.current
    ) {
      fifteenMinuteWarningSent.current = true;
      const line = getScenarioLine(session.roomName, "timer_warning_15", session.id);
      pushEvent("note_added", line);
    }

    if (remainingMs <= 5 * 60 * 1000 && !fiveMinuteWarningSent.current) {
      fiveMinuteWarningSent.current = true;
      const line = getScenarioLine(session.roomName, "timer_warning_5", session.id);
      pushEvent("note_added", line);
    }
  }, [remainingMs, session]);

  function persistSession(next: EscapeSession) {
    const sessions = safeReadSessions();
    sessions[next.id] = next;
    writeSessions(sessions);
    setSession(next);
  }

  function pushEvent(
    type: EscapeTimelineEvent["type"],
    label: string,
    updater?: (current: EscapeSession) => EscapeSession
  ) {
    if (!session) return;

    const base = updater ? updater(session) : session;

    const next: EscapeSession = {
      ...base,
      timeline: [createTimelineEvent(type, label), ...base.timeline],
    };

    persistSession(next);
  }

  function handlePauseResume() {
    if (!session) return;

    if (session.status === "active") {
      pushEvent(
        "timer_paused",
        getScenarioLine(session.roomName, "timer_paused", `${session.id}-${session.timeline.length}`),
        (current) => ({
          ...current,
          status: "paused",
          pausedAt: new Date().toISOString(),
        })
      );
      return;
    }

    if (session.status === "paused" && session.pausedAt) {
      const pausedDelta = Date.now() - new Date(session.pausedAt).getTime();

      pushEvent(
        "timer_resumed",
        getScenarioLine(session.roomName, "timer_resumed", `${session.id}-${session.timeline.length}`),
        (current) => ({
          ...current,
          status: "active",
          pausedAt: null,
          pausedTotalMs: current.pausedTotalMs + pausedDelta,
        })
      );
    }
  }

  function handleHint() {
    if (!session || session.status === "completed" || session.status === "failed") return;

    pushEvent(
      "hint_requested",
      getScenarioLine(session.roomName, "hint_requested", `${session.id}-${session.hintsUsed}`),
      (current) => ({
        ...current,
        hintsUsed: current.hintsUsed + 1,
      })
    );
  }

  function handlePuzzleSolved() {
    if (!session || session.status === "completed" || session.status === "failed") return;

    pushEvent(
      "puzzle_solved",
      getScenarioLine(session.roomName, "puzzle_solved", `${session.id}-${session.puzzleCountSolved}`),
      (current) => ({
        ...current,
        puzzleCountSolved: current.puzzleCountSolved + 1,
      })
    );
  }

  function handleClueFound() {
    if (!session || session.status === "completed" || session.status === "failed") return;

    pushEvent(
      "clue_found",
      getScenarioLine(session.roomName, "clue_found", `${session.id}-${session.cluesFound}`),
      (current) => ({
        ...current,
        cluesFound: current.cluesFound + 1,
      })
    );
  }

  function handleComplete() {
    if (!session || session.status === "completed" || session.status === "failed") return;

    pushEvent(
      "session_completed",
      getScenarioLine(session.roomName, "session_completed", session.id),
      (current) => ({
        ...current,
        status: "completed",
        completedAt: new Date().toISOString(),
      })
    );
  }

  function handleAddNote() {
    if (!session) return;
    const trimmed = noteDraft.trim();
    if (!trimmed) return;

    const prefix = getScenarioLine(session.roomName, "note_added", `${session.id}-${trimmed}`);
    const label = `${prefix} ${trimmed}`.trim();

    pushEvent("note_added", label, (current) => ({
      ...current,
      notes: [trimmed, ...current.notes],
    }));

    setNoteDraft("");
  }

  const sessionStateLabel = useMemo(() => {
    if (!session) return "Missing";
    if (session.status === "active") return "Live";
    if (session.status === "paused") return "Paused";
    if (session.status === "completed") return "Completed";
    return "Failed";
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-[#061017] px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-400/20 bg-white/5 p-6">
          <div className="text-sm uppercase tracking-[0.2em] text-red-200/80">
            Session Missing
          </div>
          <h1 className="mt-2 text-2xl font-semibold">Escape session not found</h1>
          <p className="mt-2 text-white/70">
            This session ID does not exist in localStorage yet.
          </p>
          <button
            onClick={() => navigate("/planet/experience/start")}
            className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/15 px-4 py-3 text-sm font-semibold text-cyan-100"
          >
            Back to Start Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061017] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-6">
            <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-5 shadow-[0_0_40px_rgba(0,255,255,0.06)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    {sessionStateLabel} Session
                  </div>

                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {session.roomName}
                  </h1>

                  {scenario ? (
                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-100/65">
                        Mission
                      </div>
                      <div className="mt-1 text-sm font-medium text-white/90">
                        {scenario.missionLabel}
                      </div>
                      <div className="mt-2 text-sm text-white/60">
                        {scenario.intro}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/70">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Team: {session.teamName}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Players: {session.teamSize}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Limit: {session.timeLimitMinutes} min
                    </span>
                    {scenario ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                        Story: {scenario.displayName}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-center">
                  <div className="text-xs uppercase tracking-[0.2em] text-cyan-100/70">
                    Time Remaining
                  </div>
                  <div className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
                    {formatClock(remainingMs)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <button
                onClick={() => setPanelMode("stage_overview")}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Progress</div>
                <div className="mt-2 text-3xl font-semibold">{session.puzzleCountSolved}</div>
                <div className="mt-1 text-sm text-white/65">Puzzles solved</div>
              </button>

              <button
                onClick={() => setPanelMode("controls")}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Hints</div>
                <div className="mt-2 text-3xl font-semibold">{session.hintsUsed}</div>
                <div className="mt-1 text-sm text-white/65">Hints requested</div>
              </button>

              <button
                onClick={() => setPanelMode("team")}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Discovery</div>
                <div className="mt-2 text-3xl font-semibold">{session.cluesFound}</div>
                <div className="mt-1 text-sm text-white/65">Clues found</div>
              </button>

              <button
                onClick={() => setPanelMode("timeline")}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">Timeline</div>
                <div className="mt-2 text-3xl font-semibold">{session.timeline.length}</div>
                <div className="mt-1 text-sm text-white/65">Session events</div>
              </button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Live Actions
                  </div>
                  <h2 className="mt-1 text-xl font-semibold">Session Controls</h2>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <button
                  onClick={handleClueFound}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm font-semibold text-white transition hover:border-cyan-400/30"
                >
                  Mark Clue Found
                </button>

                <button
                  onClick={handleHint}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm font-semibold text-white transition hover:border-cyan-400/30"
                >
                  Request Hint
                </button>

                <button
                  onClick={handlePuzzleSolved}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm font-semibold text-white transition hover:border-cyan-400/30"
                >
                  Solve Puzzle
                </button>

                <button
                  onClick={handlePauseResume}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm font-semibold text-white transition hover:border-cyan-400/30"
                >
                  {session.status === "paused" ? "Resume Timer" : "Pause Timer"}
                </button>

                <button
                  onClick={handleComplete}
                  className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-4 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/15"
                >
                  Complete Session
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="mb-4">
                <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                  Notes
                </div>
                <h2 className="mt-1 text-xl font-semibold">Operator Notes</h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add session note"
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
                <button
                  onClick={handleAddNote}
                  className="rounded-2xl border border-cyan-400/30 bg-cyan-400/15 px-4 py-3 text-sm font-semibold text-cyan-100"
                >
                  Add Note
                </button>
              </div>

              {session.notes.length > 0 ? (
                <div className="mt-4 grid gap-2">
                  {session.notes.map((note, index) => (
                    <div
                      key={`${note}-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/45">
                  No notes yet.
                </div>
              )}
            </div>
          </div>

          <aside className="min-w-0">
            <div className="sticky top-4 rounded-3xl border border-cyan-500/20 bg-white/5 p-5 shadow-[0_0_40px_rgba(0,255,255,0.06)]">
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setPanelMode("timeline")}
                  className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                    panelMode === "timeline"
                      ? "border border-cyan-400/30 bg-cyan-400/15 text-cyan-100"
                      : "border border-white/10 bg-black/20 text-white/60"
                  }`}
                >
                  Timeline
                </button>

                <button
                  onClick={() => setPanelMode("team")}
                  className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                    panelMode === "team"
                      ? "border border-cyan-400/30 bg-cyan-400/15 text-cyan-100"
                      : "border border-white/10 bg-black/20 text-white/60"
                  }`}
                >
                  Team
                </button>

                <button
                  onClick={() => setPanelMode("controls")}
                  className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                    panelMode === "controls"
                      ? "border border-cyan-400/30 bg-cyan-400/15 text-cyan-100"
                      : "border border-white/10 bg-black/20 text-white/60"
                  }`}
                >
                  Controls
                </button>

                <button
                  onClick={() => setPanelMode("notes")}
                  className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                    panelMode === "notes"
                      ? "border border-cyan-400/30 bg-cyan-400/15 text-cyan-100"
                      : "border border-white/10 bg-black/20 text-white/60"
                  }`}
                >
                  Notes
                </button>
              </div>

              {panelMode === "timeline" && (
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Session Timeline
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">Live Events</h3>

                  <div className="mt-4 flex max-h-[70vh] flex-col gap-3 overflow-auto pr-1">
                    {session.timeline.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                      >
                        <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/60">
                          {event.type.replaceAll("_", " ")}
                        </div>
                        <div className="mt-1 text-sm font-medium text-white">
                          {event.label}
                        </div>
                        <div className="mt-2 text-xs text-white/45">
                          {formatEventTime(event.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {panelMode === "team" && (
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Team Snapshot
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">Current Session</h3>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                        Room
                      </div>
                      <div className="mt-2 text-base font-medium">{session.roomName}</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                        Team
                      </div>
                      <div className="mt-2 text-base font-medium">{session.teamName}</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                        Players
                      </div>
                      <div className="mt-2 text-base font-medium">{session.teamSize}</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                        Status
                      </div>
                      <div className="mt-2 text-base font-medium">{sessionStateLabel}</div>
                    </div>

                    {scenario ? (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                          Story World
                        </div>
                        <div className="mt-2 text-base font-medium">{scenario.displayName}</div>
                        <div className="mt-2 text-sm text-white/60">{scenario.missionLabel}</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {panelMode === "controls" && (
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Control Totals
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">Live Counters</h3>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                        Hints Used
                      </div>
                      <div className="mt-2 text-2xl font-semibold">{session.hintsUsed}</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                        Clues Found
                      </div>
                      <div className="mt-2 text-2xl font-semibold">{session.cluesFound}</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-white/45">
                        Puzzles Solved
                      </div>
                      <div className="mt-2 text-2xl font-semibold">{session.puzzleCountSolved}</div>
                    </div>
                  </div>
                </div>
              )}

              {panelMode === "notes" && (
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Notes Feed
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">Operator Notes</h3>

                  <div className="mt-4 flex flex-col gap-3">
                    {session.notes.length > 0 ? (
                      session.notes.map((note, index) => (
                        <div
                          key={`${note}-${index}`}
                          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80"
                        >
                          {note}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-white/45">
                        No notes added yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {panelMode === "stage_overview" && (
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Stage Overview
                  </div>
                  <h3 className="mt-1 text-lg font-semibold">Session Progress</h3>

                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/80">
                      {scenario
                        ? `Story layer is live for ${scenario.displayName}. Staff can now stage the room against the narrative pressure shown in the timeline.`
                        : "Story layer is live. Staff can now stage the room against the narrative pressure shown in the timeline."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}