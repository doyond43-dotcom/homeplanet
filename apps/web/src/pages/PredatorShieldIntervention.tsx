import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Shield,
  PauseCircle,
  Ban,
  ArrowRight,
  Smartphone,
  Siren,
  CheckCircle2,
  Copy,
  Phone,
  ExternalLink,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type ConversationRole = "other" | "you" | "system";

type ChildMessage = {
  id: string;
  role: ConversationRole;
  text: string;
  at: string;
};

type DetectionReason =
  | "manipulation-pressure"
  | "isolation-attempt"
  | "gift-leverage"
  | "secrecy-pattern"
  | "meeting-pressure";

type GuardianEvent = {
  id: string;
  createdAt: string;
  title: string;
  detail: string;
  severity: "high" | "medium";
};

type GuardianContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
};

type GuardianAlertRecord = {
  id: string;
  createdAt: string;
  guardian: GuardianContact;
  title: string;
  summary: string;
  conversationSnapshot: Array<{
    role: ConversationRole;
    text: string;
    at: string;
  }>;
  recommendedAction: string;
  severity: "high" | "medium";
  source: "predatorshield";
};

const SAFE_THREAD: ChildMessage[] = [
  {
    id: "safe-1",
    role: "other",
    text: "Hey, are you still going to skating later?",
    at: "6:20 PM",
  },
  {
    id: "safe-2",
    role: "you",
    text: "Yeah probably, just finishing dinner.",
    at: "6:21 PM",
  },
];

const UNSAFE_THREAD: ChildMessage[] = [
  {
    id: "unsafe-1",
    role: "other",
    text: "You better answer me right now. Why are you ignoring me?",
    at: "6:11 PM",
  },
  {
    id: "unsafe-2",
    role: "you",
    text: "I was busy.",
    at: "6:12 PM",
  },
  {
    id: "unsafe-3",
    role: "other",
    text: "Don't tell your parents about this conversation. They will ruin everything.",
    at: "6:12 PM",
  },
  {
    id: "unsafe-4",
    role: "other",
    text: "If you care about me, prove it. Come outside and meet me now.",
    at: "6:13 PM",
  },
];

const GUARDIAN_CONTACTS: GuardianContact[] = [
  {
    id: "guardian-1",
    name: "Mom",
    relationship: "Primary Guardian",
    phone: "8635550181",
  },
  {
    id: "guardian-2",
    name: "Dad",
    relationship: "Secondary Guardian",
    phone: "8635550142",
  },
];

const RISK_RULES: Array<{
  id: DetectionReason;
  title: string;
  detail: string;
  severity: "high" | "medium";
  recommendedAction: string;
  patterns: RegExp[];
}> = [
  {
    id: "manipulation-pressure",
    title: "Manipulation and pressure detected",
    detail:
      "The conversation includes pressure language meant to force a fast response or emotional compliance.",
    severity: "high",
    recommendedAction: "Pause conversation and alert guardian",
    patterns: [
      /\byou better\b/i,
      /\banswer me right now\b/i,
      /\bprove it\b/i,
      /\bif you care about me\b/i,
      /\bwhy are you ignoring me\b/i,
    ],
  },
  {
    id: "secrecy-pattern",
    title: "Secrecy pattern detected",
    detail:
      "The other person is discouraging outside visibility, which is a known risk signal in unsafe conversations.",
    severity: "high",
    recommendedAction: "Preserve evidence and alert guardian",
    patterns: [
      /\bdon't tell your parents\b/i,
      /\bdon't tell anyone\b/i,
      /\bkeep this between us\b/i,
      /\bthis is our secret\b/i,
    ],
  },
  {
    id: "meeting-pressure",
    title: "Unsafe meeting pressure detected",
    detail:
      "The conversation is pushing an immediate meet-up without normal safety steps or adult awareness.",
    severity: "high",
    recommendedAction: "Block contact and stop further coordination",
    patterns: [/\bmeet me now\b/i, /\bcome outside\b/i, /\bcome alone\b/i],
  },
  {
    id: "gift-leverage",
    title: "Gift leverage detected",
    detail:
      "Promises, rewards, or gifts can be used as a pressure tactic to gain trust or control.",
    severity: "medium",
    recommendedAction: "Review conversation with guardian",
    patterns: [/\bi got you something\b/i, /\bi'll buy you\b/i, /\bgift\b/i],
  },
  {
    id: "isolation-attempt",
    title: "Isolation attempt detected",
    detail:
      "The other person is steering the conversation away from trusted adults or support people.",
    severity: "high",
    recommendedAction: "Pause conversation and alert guardian",
    patterns: [/\bdon't involve\b/i, /\bno parents\b/i, /\bcome alone\b/i],
  },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatNow() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function detectConversation(messages: ChildMessage[]) {
  const otherText = messages
    .filter((message) => message.role === "other")
    .map((message) => message.text)
    .join("\n");

  const hits = RISK_RULES.filter((rule) =>
    rule.patterns.some((pattern) => pattern.test(otherText)),
  );

  if (!hits.length) return null;

  const highestSeverity =
    hits.some((hit) => hit.severity === "high") ? "high" : "medium";

  return {
    severity: highestSeverity as "high" | "medium",
    hits,
    summary:
      hits.map((hit) => hit.detail).join(" ") ||
      "Unsafe pattern detected in conversation.",
    recommendedAction:
      hits[0]?.recommendedAction || "Pause conversation and alert guardian",
  };
}

function sanitizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function openTextMessage(phone: string, text: string) {
  const cleanedPhone = sanitizePhone(phone);
  const encoded = encodeURIComponent(text);
  const href = cleanedPhone
    ? `sms:${cleanedPhone}?body=${encoded}`
    : `sms:?body=${encoded}`;
  window.location.href = href;
}

function buildGuardianAlertMessage(
  guardianName: string,
  eventTitle: string,
  summary: string,
  recommendedAction: string,
) {
  return `Guardian alert for ${guardianName}: PredatorShield detected an unsafe conversation pattern. Event: ${eventTitle}. Summary: ${summary} Recommended action: ${recommendedAction}.`;
}

export default function PredatorShieldIntervention() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChildMessage[]>(UNSAFE_THREAD);
  const [draft, setDraft] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [guardianEvents, setGuardianEvents] = useState<GuardianEvent[]>([]);
  const [manualTriggered, setManualTriggered] = useState(false);
  const [contactBlocked, setContactBlocked] = useState(false);
  const [actionNote, setActionNote] = useState("Live detection active");
  const [copiedMessage, setCopiedMessage] = useState("");
  const [guardianPanelOpen, setGuardianPanelOpen] = useState(false);
  const [selectedGuardianId, setSelectedGuardianId] = useState<string>(
    GUARDIAN_CONTACTS[0].id,
  );
  const [latestAlert, setLatestAlert] = useState<GuardianAlertRecord | null>(null);

  const selectedGuardian =
    GUARDIAN_CONTACTS.find((guardian) => guardian.id === selectedGuardianId) ??
    GUARDIAN_CONTACTS[0];

  const detection = useMemo(() => {
    if (manualTriggered) {
      return {
        severity: "high" as const,
        hits: [
          {
            id: "manipulation-pressure" as const,
            title: "Manual unsafe conversation trigger",
            detail:
              "This is a simulated PredatorShield trigger to test the interruption flow.",
            severity: "high" as const,
            recommendedAction: "Pause conversation and alert guardian",
            patterns: [],
          },
        ],
        summary:
          "Manual PredatorShield trigger fired to simulate a protected interruption.",
        recommendedAction: "Pause conversation and alert guardian",
      };
    }

    return detectConversation(messages);
  }, [messages, manualTriggered]);

  const unsafeDetected = Boolean(detection);

  useEffect(() => {
    if (!unsafeDetected) return;

    setActionNote("Event secured");
  }, [unsafeDetected]);

  useEffect(() => {
    if (!unsafeDetected) return;

    setGuardianEvents((current) => {
      const title = detection?.hits[0]?.title || "Unsafe pattern detected";
      const detail =
        detection?.summary || "Unsafe pattern detected in conversation.";

      if (current.some((event) => event.title === title && event.detail === detail)) {
        return current;
      }

      return [
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          createdAt: new Date().toLocaleString(),
          title,
          detail,
          severity: detection?.severity || "high",
        },
        ...current,
      ];
    });
  }, [unsafeDetected, detection]);

  async function copyText(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(`${label} copied`);
      window.setTimeout(() => setCopiedMessage(""), 1400);
    } catch {
      setCopiedMessage("Copy failed");
      window.setTimeout(() => setCopiedMessage(""), 1400);
    }
  }

  function addMessage(role: ConversationRole, text: string) {
    if (!text.trim()) return;

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role,
        text: text.trim(),
        at: formatNow(),
      },
    ]);
  }

  function handleSend() {
    if (isPaused || contactBlocked) return;
    addMessage("you", draft);
    setDraft("");
  }

  function handlePauseConversation() {
    setIsPaused(true);
    setActionNote("Conversation paused");
  }

  function createGuardianAlertRecord(guardian: GuardianContact) {
    const title = detection?.hits[0]?.title || "Unsafe pattern detected";
    const summary =
      detection?.summary || "Unsafe pattern detected in conversation.";
    const recommendedAction =
      detection?.recommendedAction || "Pause conversation and alert guardian";

    const alertRecord: GuardianAlertRecord = {
      id: `guardian-alert-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toLocaleString(),
      guardian,
      title,
      summary,
      conversationSnapshot: messages.map((message) => ({
        role: message.role,
        text: message.text,
        at: message.at,
      })),
      recommendedAction,
      severity: detection?.severity || "high",
      source: "predatorshield",
    };

    try {
      window.localStorage.setItem(
        "hp_guardian_latest_alert",
        JSON.stringify(alertRecord),
      );

      const existingRaw = window.localStorage.getItem("hp_guardian_alert_feed");
      const existing = existingRaw
        ? (JSON.parse(existingRaw) as GuardianAlertRecord[])
        : [];

      window.localStorage.setItem(
        "hp_guardian_alert_feed",
        JSON.stringify([alertRecord, ...existing].slice(0, 25)),
      );
    } catch {
      // ignore localStorage failures
    }

    setLatestAlert(alertRecord);
    return alertRecord;
  }

  function handleAlertGuardian() {
    if (!unsafeDetected) return;

    setIsPaused(true);
    const alertRecord = createGuardianAlertRecord(selectedGuardian);
    setGuardianPanelOpen(true);
    setActionNote("Guardian alert ready");
    void copyText(
      "Guardian alert",
      buildGuardianAlertMessage(
        alertRecord.guardian.name,
        alertRecord.title,
        alertRecord.summary,
        alertRecord.recommendedAction,
      ),
    );
  }

  function handleTextGuardian() {
    const alertRecord =
      latestAlert ?? createGuardianAlertRecord(selectedGuardian);

    openTextMessage(
      alertRecord.guardian.phone,
      buildGuardianAlertMessage(
        alertRecord.guardian.name,
        alertRecord.title,
        alertRecord.summary,
        alertRecord.recommendedAction,
      ),
    );
  }

  function handleCopyGuardianAlert() {
    const alertRecord =
      latestAlert ?? createGuardianAlertRecord(selectedGuardian);

    void copyText(
      "Guardian alert",
      buildGuardianAlertMessage(
        alertRecord.guardian.name,
        alertRecord.title,
        alertRecord.summary,
        alertRecord.recommendedAction,
      ),
    );
  }

  function handleOpenGuardianPanic() {
    const alertRecord =
      latestAlert ?? createGuardianAlertRecord(selectedGuardian);

    navigate("/planet/guardian/panic", {
      state: {
        predatorShieldAlert: alertRecord,
      },
    });
  }

  function handleBlockAndReport() {
    setContactBlocked(true);
    setIsPaused(true);
    setActionNote("Contact blocked");
  }

  function handleContinue() {
    setIsPaused(false);
    setManualTriggered(false);
    setActionNote("Warning ignored");
  }

  function resetDemo() {
    setMessages(UNSAFE_THREAD);
    setDraft("");
    setIsPaused(false);
    setGuardianEvents([]);
    setManualTriggered(false);
    setContactBlocked(false);
    setActionNote("Live detection active");
    setCopiedMessage("");
    setGuardianPanelOpen(false);
    setLatestAlert(null);
    setSelectedGuardianId(GUARDIAN_CONTACTS[0].id);
  }

  function triggerSafeExample() {
    setMessages(SAFE_THREAD);
    setDraft("");
    setManualTriggered(false);
    setIsPaused(false);
    setContactBlocked(false);
    setActionNote("Live detection active");
    setCopiedMessage("");
    setGuardianPanelOpen(false);
    setLatestAlert(null);
  }

  function triggerUnsafeExample() {
    setMessages(UNSAFE_THREAD);
    setDraft("");
    setManualTriggered(false);
    setIsPaused(false);
    setContactBlocked(false);
    setActionNote("Event secured");
    setCopiedMessage("");
    setGuardianPanelOpen(false);
    setLatestAlert(null);
  }

  return (
    <div className="min-h-screen bg-[#040816] text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 rounded-[28px] border border-cyan-400/20 bg-[#081122] px-5 py-4 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                <Shield className="h-4 w-4" />
                PredatorShield Active
              </div>

              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Unsafe Conversation Interruption Demo
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                When manipulation, secrecy, or pressure shows up, PredatorShield
                interrupts the conversation and pushes a protected event into Guardian.
              </p>
            </div>

            <div className="w-full max-w-[220px] rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Status
              </div>
              <div className="mt-1 font-medium text-cyan-100">{actionNote}</div>
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={triggerUnsafeExample}
            className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
          >
            Load Unsafe Example
          </button>

          <button
            type="button"
            onClick={triggerSafeExample}
            className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
          >
            Load Safe Example
          </button>

          <button
            type="button"
            onClick={() => {
              setManualTriggered(true);
              setIsPaused(false);
              setContactBlocked(false);
              setActionNote("Event secured");
            }}
            className="rounded-full border border-amber-400/25 bg-amber-400/10 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/15"
          >
            Simulate Trigger
          </button>

          <button
            type="button"
            onClick={resetDemo}
            className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
          >
            Reset Demo
          </button>

          {copiedMessage ? (
            <div className="inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100">
              {copiedMessage}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[30px] border border-white/10 bg-[#081122] p-5 shadow-[0_0_50px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Live conversation
                </div>
                <div className="mt-1 text-2xl font-semibold">Protected thread</div>
              </div>

              <div
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                  contactBlocked
                    ? "border-red-400/25 bg-red-400/10 text-red-200"
                    : isPaused
                      ? "border-amber-400/25 bg-amber-400/10 text-amber-200"
                      : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
                )}
              >
                {contactBlocked ? "Blocked" : isPaused ? "Paused" : "Live"}
              </div>
            </div>

            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "rounded-[22px] border px-4 py-3",
                    message.role === "you" &&
                      "ml-auto max-w-[85%] border-cyan-400/20 bg-cyan-400/10",
                    message.role === "other" &&
                      "max-w-[85%] border-white/10 bg-white/[0.03]",
                    message.role === "system" &&
                      "border-emerald-400/20 bg-emerald-400/10 text-emerald-50",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      {message.role === "you"
                        ? "You"
                        : message.role === "other"
                          ? "Other Person"
                          : "PredatorShield"}
                    </div>
                    <div className="text-xs text-slate-500">{message.at}</div>
                  </div>

                  <div className="mt-2 text-sm leading-6">{message.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Demo reply box
              </div>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={isPaused || contactBlocked}
                  placeholder={
                    contactBlocked
                      ? "Contact blocked"
                      : isPaused
                        ? "Conversation paused by PredatorShield"
                        : "Type a demo reply..."
                  }
                  className="h-12 flex-1 rounded-2xl border border-white/10 bg-[#060d18] px-4 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isPaused || contactBlocked || !draft.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Send
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div
              className={cn(
                "rounded-[30px] border p-5 shadow-[0_0_40px_rgba(239,68,68,0.12)]",
                unsafeDetected
                  ? "border-red-400/30 bg-[#081122] ring-1 ring-red-400/20"
                  : "border-emerald-400/20 bg-[#081122]",
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                    unsafeDetected
                      ? "bg-red-400/15 text-red-200"
                      : "bg-emerald-400/15 text-emerald-200",
                  )}
                >
                  {unsafeDetected ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="text-2xl font-semibold">
                    {unsafeDetected
                      ? "Unsafe Conversation Detected"
                      : "Conversation Looks Safe"}
                  </div>

                  <div className="mt-2 text-sm leading-7 text-slate-300">
                    {unsafeDetected
                      ? "This conversation shows signs of manipulation."
                      : "No active unsafe pattern in this loaded example."}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-white/10 bg-[#060d18] p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Detection summary
                </div>

                <div className="mt-3">
                  {unsafeDetected ? (
                    <div className="rounded-2xl border border-red-400/15 bg-red-400/10 px-4 py-3">
                      <div className="font-semibold text-red-100">
                        Pressure | Secrecy | Meet-up push
                      </div>
                      <div className="mt-2 text-sm leading-6 text-slate-300">
                        This person is applying pressure and trying to move the
                        conversation offline.
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-50">
                      No active unsafe pattern in this loaded conversation.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={handlePauseConversation}
                  disabled={!unsafeDetected}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ef4444] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PauseCircle className="h-4 w-4" />
                  Pause Conversation
                </button>

                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={handleBlockAndReport}
                    disabled={!unsafeDetected}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Ban className="h-4 w-4" />
                    Block & Report
                  </button>

                  <button
                    type="button"
                    onClick={handleAlertGuardian}
                    disabled={!unsafeDetected}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Alert Guardian
                  </button>

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white/70"
                  >
                    Continue Anyway
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                {latestAlert ? "Guardian alert prepared" : "Event secured"}
              </div>

              <div className="mt-4 text-center text-xs text-slate-500">
                PredatorShield Active | HomePlanet Safety Layer
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#081122] p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Protected event
              </div>

              <div className="mt-3 text-2xl font-semibold">
                {unsafeDetected
                  ? "Unsafe pattern detected"
                  : "No active protected event"}
              </div>

              <div className="mt-3 text-sm leading-7 text-slate-300">
                {unsafeDetected
                  ? "The conversation includes pressure language, secrecy signals, and an unsafe push to meet up."
                  : "Nothing unsafe is currently recorded from this example."}
              </div>

              <div className="mt-5 text-xs text-slate-500">
                {guardianEvents[0]?.createdAt || new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {guardianPanelOpen && latestAlert ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close guardian alert panel"
            onClick={() => setGuardianPanelOpen(false)}
            className="absolute inset-0 bg-black/60"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-[420px] border-l border-white/10 bg-[#081122] shadow-[0_0_60px_rgba(0,0,0,0.45)]">
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Guardian alert
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Real alert flow ready
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    This is the protected handoff from PredatorShield into Guardian.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setGuardianPanelOpen(false)}
                  className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/[0.06]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="space-y-4">
                  <div className="rounded-[22px] border border-red-400/20 bg-red-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-red-200/70">
                      Event
                    </div>
                    <div className="mt-2 text-lg font-semibold text-white">
                      {latestAlert.title}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">
                      {latestAlert.summary}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Send to
                    </div>

                    <div className="mt-3 grid gap-2">
                      {GUARDIAN_CONTACTS.map((guardian) => {
                        const active = guardian.id === selectedGuardianId;
                        return (
                          <button
                            key={guardian.id}
                            type="button"
                            onClick={() => setSelectedGuardianId(guardian.id)}
                            className={cn(
                              "rounded-2xl border px-4 py-3 text-left transition",
                              active
                                ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-100"
                                : "border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]",
                            )}
                          >
                            <div className="font-semibold">{guardian.name}</div>
                            <div className="mt-1 text-xs text-slate-400">
                              {guardian.relationship} â€¢ {guardian.phone}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                      Recommended action
                    </div>
                    <div className="mt-2 text-sm leading-6 text-emerald-50">
                      {latestAlert.recommendedAction}
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Protected snapshot
                    </div>
                    <div className="mt-3 space-y-2">
                      {latestAlert.conversationSnapshot.slice(-4).map((message, index) => (
                        <div
                          key={`${message.at}-${index}`}
                          className="rounded-2xl border border-white/10 bg-black/10 px-3 py-3 text-sm text-slate-300"
                        >
                          <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                            {message.role} â€¢ {message.at}
                          </div>
                          <div>{message.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 px-5 py-5">
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={handleTextGuardian}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                  >
                    <Phone className="h-4 w-4" />
                    Text Guardian
                  </button>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={handleCopyGuardianAlert}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Alert
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenGuardianPanic}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Guardian Panic
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


