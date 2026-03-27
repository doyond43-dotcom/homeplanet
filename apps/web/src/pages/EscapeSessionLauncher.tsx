import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type EscapeTimelineEvent = {
  id: string;
  type:
    | "session_started"
    | "hint_requested"
    | "puzzle_solved"
    | "clue_found"
    | "timer_paused"
    | "timer_resumed"
    | "session_completed"
    | "session_failed"
    | "note_added";
  label: string;
  timestamp: string;
};

export type EscapeSession = {
  id: string;
  roomName: string;
  teamName: string;
  teamSize: number;
  timeLimitMinutes: number;
  status: "active" | "paused" | "completed" | "failed";
  startedAt: string;
  pausedAt: string | null;
  pausedTotalMs: number;
  completedAt: string | null;
  puzzleCountSolved: number;
  hintsUsed: number;
  cluesFound: number;
  notes: string[];
  timeline: EscapeTimelineEvent[];
};

const STORAGE_KEY = "hp_escape_sessions";

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

export default function EscapeSessionLauncher() {
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState("Pharaoh's Chamber");
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("4");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState("60");

  const isValid = useMemo(() => {
    const teamSizeNumber = Number(teamSize);
    const timeLimitNumber = Number(timeLimitMinutes);

    return (
      roomName.trim().length > 0 &&
      teamName.trim().length > 0 &&
      Number.isFinite(teamSizeNumber) &&
      teamSizeNumber > 0 &&
      Number.isFinite(timeLimitNumber) &&
      timeLimitNumber > 0
    );
  }, [roomName, teamName, teamSize, timeLimitMinutes]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    const sessionId = createId();

    const session: EscapeSession = {
      id: sessionId,
      roomName: roomName.trim(),
      teamName: teamName.trim(),
      teamSize: Number(teamSize),
      timeLimitMinutes: Number(timeLimitMinutes),
      status: "active",
      startedAt: new Date().toISOString(),
      pausedAt: null,
      pausedTotalMs: 0,
      completedAt: null,
      puzzleCountSolved: 0,
      hintsUsed: 0,
      cluesFound: 0,
      notes: [],
      timeline: [
        createTimelineEvent(
          "session_started",
          `Session started for ${teamName.trim()} in ${roomName.trim()}`
        ),
      ],
    };

    const existing = safeReadSessions();
    existing[sessionId] = session;
    writeSessions(existing);

    navigate(`/planet/experience/session/${sessionId}`);
  }

  return (
    <div className="min-h-screen bg-[#061017] text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-6 shadow-[0_0_40px_rgba(0,255,255,0.06)]">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
              Escape Room Live Session
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Start Escape Session
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
              Simple Phase 1 launch flow. Set the room, team, size, and timer.
              Session is stored locally for now and opens directly into the live board.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-white/80">Room name</span>
              <input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                placeholder="Enter room name"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-white/80">Team name</span>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                placeholder="Enter team name"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-white/80">Team size</span>
              <input
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                type="number"
                min={1}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                placeholder="4"
              />
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-white/80">Time limit (minutes)</span>
              <input
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(e.target.value)}
                type="number"
                min={1}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                placeholder="60"
              />
            </label>

            <div className="sm:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-white/45">
                Stored in localStorage under <span className="font-mono">hp_escape_sessions</span>
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className="rounded-2xl border border-cyan-400/30 bg-cyan-400/15 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Start Escape Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}