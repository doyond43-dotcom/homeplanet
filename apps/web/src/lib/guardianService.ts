export type GuardianMode = "elder" | "child" | "medical";
export type GuardianVariant = "compact" | "monitor";

export type GuardianEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

export type GuardianSession = {
  residentId: string;
  wearerName: string;
  wearerPhone: string;
  contactName: string;
  contactRelation: string;
  contactPhone: string;
  mode: GuardianMode;
  status: string;
  location: string;
  isActive: boolean;
  startedAt: string | null;
  events: GuardianEvent[];
};

function nowStamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function makeEvent(title: string, detail: string): GuardianEvent {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time: nowStamp(),
    title,
    detail,
  };
}

export function createGuardianSession(input: {
  residentId: string;
  wearerName: string;
  wearerPhone: string;
  contactName: string;
  contactRelation: string;
  contactPhone: string;
  mode: GuardianMode;
  status?: string;
  location?: string;
}): GuardianSession {
  return {
    residentId: input.residentId,
    wearerName: input.wearerName,
    wearerPhone: input.wearerPhone,
    contactName: input.contactName,
    contactRelation: input.contactRelation,
    contactPhone: input.contactPhone,
    mode: input.mode,
    status: input.status ?? "Standing by",
    location: input.location ?? "Unknown location",
    isActive: false,
    startedAt: null,
    events: [],
  };
}

export function startGuardianSession(
  session: GuardianSession,
  sessionLabel: string,
): GuardianSession {
  return {
    ...session,
    isActive: true,
    startedAt: nowStamp(),
    status: sessionLabel,
    events: [
      makeEvent("Guardian session started", sessionLabel),
      ...session.events,
    ],
  };
}

export function endGuardianSession(session: GuardianSession): GuardianSession {
  return {
    ...session,
    isActive: false,
    status: "Session ended",
    events: [
      makeEvent("Guardian session ended", "Guardian monitoring session closed."),
      ...session.events,
    ],
  };
}

export function confirmGuardianSafe(session: GuardianSession): GuardianSession {
  return {
    ...session,
    status: "Confirmed safe",
    events: [
      makeEvent("I'm okay", `${session.wearerName} confirmed safe.`),
      ...session.events,
    ],
  };
}

export function requestGuardianHelp(session: GuardianSession): GuardianSession {
  return {
    ...session,
    status: "Help requested",
    events: [
      makeEvent("Need help", `${session.wearerName} requested help.`),
      ...session.events,
    ],
  };
}

export function updateGuardianLocation(
  session: GuardianSession,
  location: string,
): GuardianSession {
  return {
    ...session,
    location,
    events: [
      makeEvent("Location updated", location),
      ...session.events,
    ],
  };
}

export function logGuardianEvent(
  session: GuardianSession,
  title: string,
  detail: string,
): GuardianSession {
  return {
    ...session,
    events: [makeEvent(title, detail), ...session.events],
  };
}

export function buildGuardianSharePacket(session: GuardianSession): string {
  return [
    "Planet Guardian",
    `Wearer: ${session.wearerName}`,
    `Mode: ${session.mode}`,
    `Status: ${session.status}`,
    `Location: ${session.location}`,
    `Contact: ${session.contactName} (${session.contactPhone})`,
    `Time: ${nowStamp()}`,
  ].join("\n");
}