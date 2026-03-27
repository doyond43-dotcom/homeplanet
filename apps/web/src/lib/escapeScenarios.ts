export type EscapeScenarioEventType =
  | "session_started"
  | "hint_requested"
  | "puzzle_solved"
  | "clue_found"
  | "timer_warning_15"
  | "timer_warning_5"
  | "timer_paused"
  | "timer_resumed"
  | "session_completed"
  | "session_failed"
  | "note_added";

export type EscapeScenario = {
  id: string;
  match: string[];
  displayName: string;
  missionLabel: string;
  intro: string;
  events: {
    session_started: string[];
    hint_requested: string[];
    puzzle_solved: string[];
    clue_found: string[];
    timer_warning_15: string[];
    timer_warning_5: string[];
    timer_paused: string[];
    timer_resumed: string[];
    session_completed: string[];
    session_failed: string[];
    note_added: string[];
  };
};

const scenarios: EscapeScenario[] = [
  {
    id: "pharaoh",
    match: ["pharaoh", "tomb", "pyramid", "curse", "egypt"],
    displayName: "Pharaoh's Curse",
    missionLabel: "Escape the tomb before the curse seals it forever.",
    intro:
      "You have entered a forbidden tomb. Ancient mechanisms are waking, and every move pulls you deeper into the Pharaoh’s curse.",
    events: {
      session_started: [
        "The tomb doors grind shut behind your team. The curse has begun.",
      ],
      hint_requested: [
        "A whisper moves through the chamber: 'Read the stars, not the stone.'",
        "Torchlight flickers over hidden symbols. The tomb is trying to tell you something.",
      ],
      puzzle_solved: [
        "A stone seal breaks open. Something ancient has been released.",
        "The chamber groans as a hidden mechanism clicks into place.",
      ],
      clue_found: [
        "A buried relic emerges from the dust. It still hums with power.",
        "You uncover a forgotten marking etched deep into the wall.",
      ],
      timer_warning_15: [
        "The air grows thinner. You have 15 minutes before the tomb fully seals.",
      ],
      timer_warning_5: [
        "The tomb is collapsing. Five minutes remain before total burial.",
      ],
      timer_paused: [
        "Time freezes for a breath. Even the curse seems to wait.",
      ],
      timer_resumed: [
        "The chamber shudders back to life. The curse continues.",
      ],
      session_completed: [
        "The final seal breaks. Your team escapes as the tomb collapses behind you.",
      ],
      session_failed: [
        "The tomb seals forever. Your story becomes part of the legend below.",
      ],
      note_added: [
        "The archive records a new field note from inside the chamber.",
      ],
    },
  },
  {
    id: "space",
    match: ["space", "station", "galaxy", "alien", "orbit", "ship"],
    displayName: "Deep Space Breach",
    missionLabel: "Restore the station before total systems failure.",
    intro:
      "An emergency breach has thrown the station into lockdown. Life support is unstable, and the crew has one chance to regain control.",
    events: {
      session_started: [
        "Red lights flare across the station. Lockdown sequence engaged.",
      ],
      hint_requested: [
        "A damaged console flickers with a partial systems clue.",
        "Mission control pushes through a broken transmission with guidance.",
      ],
      puzzle_solved: [
        "A subsystem powers back online. The station stabilizes for now.",
        "A sealed access panel unlocks with a loud metallic hiss.",
      ],
      clue_found: [
        "You recover a critical data fragment from the failing network.",
        "A hidden engineering note reveals the next step to survival.",
      ],
      timer_warning_15: [
        "Warning: structural integrity dropping. 15 minutes to failure.",
      ],
      timer_warning_5: [
        "Critical alert: reactor collapse imminent in 5 minutes.",
      ],
      timer_paused: [
        "All systems hold in suspended emergency mode.",
      ],
      timer_resumed: [
        "Power surges again. The station begins failing in real time.",
      ],
      session_completed: [
        "Core systems reboot. The station survives because your team held the line.",
      ],
      session_failed: [
        "The final alarms sound. The station goes dark.",
      ],
      note_added: [
        "A new operator note is logged into mission archive.",
      ],
    },
  },
  {
    id: "heist",
    match: ["heist", "vault", "bank", "diamond", "museum", "thief"],
    displayName: "Midnight Heist",
    missionLabel: "Crack the vault before security closes in.",
    intro:
      "The target is close, but every move increases the pressure. Security is tightening, and the window to escape is shrinking fast.",
    events: {
      session_started: [
        "The clock starts. Security has no idea your team is already inside.",
      ],
      hint_requested: [
        "A stolen blueprint reveals a risky way forward.",
        "An insider tip comes through just in time.",
      ],
      puzzle_solved: [
        "One more lock gives way. The vault is getting closer.",
        "A security layer drops. The path forward opens.",
      ],
      clue_found: [
        "You uncover a hidden code embedded in the system.",
        "A concealed switch reveals part of the vault sequence.",
      ],
      timer_warning_15: [
        "Security sweep incoming. 15 minutes until the building locks down.",
      ],
      timer_warning_5: [
        "Final sweep underway. 5 minutes before total lockdown.",
      ],
      timer_paused: [
        "Everything holds for a moment. One wrong move changes everything.",
      ],
      timer_resumed: [
        "Security systems reactivate. The heist is live again.",
      ],
      session_completed: [
        "The vault opens. Your team slips away before security ever understands what happened.",
      ],
      session_failed: [
        "Steel shutters slam down. The heist ends here.",
      ],
      note_added: [
        "A new crew note is added to the operation log.",
      ],
    },
  },
  {
    id: "generic",
    match: [],
    displayName: "Live Escape Mission",
    missionLabel: "Complete the room before time runs out.",
    intro:
      "Your team has entered a live mission with the clock already moving. Every clue matters, every decision changes the path forward.",
    events: {
      session_started: [
        "The mission is live. The room has begun reacting to your team.",
      ],
      hint_requested: [
        "A subtle clue surfaces from the world around you.",
      ],
      puzzle_solved: [
        "A major lock point has shifted. The mission advances.",
      ],
      clue_found: [
        "A hidden clue changes what your team knows.",
      ],
      timer_warning_15: [
        "Pressure is rising. 15 minutes remain.",
      ],
      timer_warning_5: [
        "Critical pressure point reached. 5 minutes remain.",
      ],
      timer_paused: [
        "The world holds still for a moment.",
      ],
      timer_resumed: [
        "The mission resumes. The world moves again.",
      ],
      session_completed: [
        "Your team breaks through and completes the mission in time.",
      ],
      session_failed: [
        "Time expires. The mission closes before the final breakthrough.",
      ],
      note_added: [
        "A new note is added to the mission log.",
      ],
    },
  },
];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function resolveEscapeScenario(roomName: string): EscapeScenario {
  const normalized = roomName.trim().toLowerCase();

  for (const scenario of scenarios) {
    if (scenario.id === "generic") continue;
    if (scenario.match.some((term) => normalized.includes(term))) {
      return scenario;
    }
  }

  return scenarios.find((scenario) => scenario.id === "generic") as EscapeScenario;
}

export function getScenarioLine(
  roomName: string,
  eventType: EscapeScenarioEventType,
  seed?: string
) {
  const scenario = resolveEscapeScenario(roomName);
  const lines = scenario.events[eventType];

  if (!lines.length) return "";

  const source = `${roomName}|${eventType}|${seed ?? ""}`;
  const index = hashString(source) % lines.length;
  return lines[index];
}