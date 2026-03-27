import { useEffect, useMemo, useState } from "react";
import { getScenarioLine, resolveEscapeScenario } from "../lib/escapeScenarios";

type TimelineEvent = {
  id: string;
  type: string;
  label: string;
  timestamp: string;
};

function createId() {
  return `esc_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function createEvent(type: string, label: string): TimelineEvent {
  return {
    id: createId(),
    type,
    label,
    timestamp: new Date().toISOString(),
  };
}

function formatClock(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function EscapeWatchModePage() {
  const roomName = "Pharaoh's Chamber";
  const teamName = "Team Apex";

  const scenario = useMemo(() => resolveEscapeScenario(roomName), []);

  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [puzzles, setPuzzles] = useState(0);
  const [hints, setHints] = useState(0);
  const [clues, setClues] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60 * 60 * 1000); // 60 min

  const sequence = [
    "session_started",
    "clue_found",
    "hint_requested",
    "puzzle_solved",
    "clue_found",
    "puzzle_solved",
    "timer_warning_15",
    "hint_requested",
    "puzzle_solved",
    "timer_warning_5",
    "puzzle_solved",
    "session_completed",
  ];

  useEffect(() => {
    let step = 0;

    const interval = setInterval(() => {
      if (step >= sequence.length) {
        clearInterval(interval);
        return;
      }

      const type = sequence[step];
      const label = getScenarioLine(roomName, type as any, `${step}`);

      setTimeline((prev) => [createEvent(type, label), ...prev]);

      if (type === "puzzle_solved") setPuzzles((p) => p + 1);
      if (type === "hint_requested") setHints((h) => h + 1);
      if (type === "clue_found") setClues((c) => c + 1);

      step++;
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#061017] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-6">

        {/* HEADER */}
        <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-5 flex justify-between items-start">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-200 mb-2">
              Watch Mode (Demo)
            </div>

            <h1 className="text-3xl font-semibold">{roomName}</h1>

            <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <div className="text-xs uppercase text-cyan-100/60 mb-1">Mission</div>
              <div className="text-sm">{scenario.missionLabel}</div>
              <div className="text-sm text-white/60 mt-2">{scenario.intro}</div>
            </div>

            <div className="flex gap-2 mt-3 text-sm text-white/70">
              <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                Team: {teamName}
              </span>
              <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                Players: 4
              </span>
              <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                Story: {scenario.displayName}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-center">
            <div className="text-xs text-cyan-100/70 uppercase tracking-[0.2em]">
              Time Remaining
            </div>
            <div className="text-4xl mt-1">{formatClock(timeLeft)}</div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4">
          <Card label="Progress" value={puzzles} sub="Puzzles solved" />
          <Card label="Hints" value={hints} sub="Hints requested" />
          <Card label="Discovery" value={clues} sub="Clues found" />
          <Card label="Timeline" value={timeline.length} sub="Events" />
        </div>

        {/* TIMELINE + SALES */}
        <div className="grid xl:grid-cols-[1fr_320px] gap-6">

          {/* TIMELINE */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-4">Live Session Timeline</h2>

            <div className="flex flex-col gap-3 max-h-[70vh] overflow-auto">
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="text-xs uppercase text-cyan-100/60">
                    {event.type.replaceAll("_", " ")}
                  </div>
                  <div className="mt-1 text-sm">{event.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SALES PANEL */}
          <div className="rounded-3xl border border-emerald-400/20 bg-white/5 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-200">
              Experience Upsells
            </div>

            <h3 className="text-xl font-semibold mt-2">
              Turn this session into revenue
            </h3>

            <div className="mt-4 flex flex-col gap-4 text-sm">

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="font-semibold">📸 Story Snapshot</div>
                <div className="text-white/60 mt-1">
                  Best moment captured from the session timeline
                </div>
                <div className="mt-2 text-emerald-300 font-semibold">
                  $14.95
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="font-semibold">🎬 Timeline Story Reel</div>
                <div className="text-white/60 mt-1">
                  Cinematic replay of the entire escape experience
                </div>
                <div className="mt-2 text-emerald-300 font-semibold">
                  $39.95
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="font-semibold">🏆 Premium Experience Pack</div>
                <div className="text-white/60 mt-1">
                  Full story + highlights + shareable content
                </div>
                <div className="mt-2 text-emerald-300 font-semibold">
                  $59.95
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Card({ label, value, sub }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-white/50 uppercase">{label}</div>
      <div className="text-2xl mt-2">{value}</div>
      <div className="text-sm text-white/60 mt-1">{sub}</div>
    </div>
  );
}