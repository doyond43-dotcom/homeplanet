import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Shield,
  Battery,
  HeartPulse,
  MapPin,
  Bell,
  Phone,
  Bike,
  Activity,
  Copy,
  CheckCircle2,
  UserRound,
  Smartphone,
  AlertTriangle,
  Home,
  School,
  Route,
  Link2,
  MessageSquare,
  Siren,
} from "lucide-react";

import GuardianPanel from "../components/guardian/GuardianPanel";
import { createGuardianSession } from "../lib/guardianService";
import { startGuardianSensors } from "../lib/guardianSensors";

type GuardianMode = "elder" | "child" | "medical";

type TimelineEvent = {
  time: string;
  title: string;
  detail: string;
};

type ActionLog = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

type GuardianProfile = {
  name: string;
  label: string;
  status: string;
  location: string;
  wearerPhone: string;
  contactName: string;
  contactRelation: string;
  contactPhone: string;
  homeBase?: string;
  destination?: string;
  destinationPhone?: string;
  routeState?: string;
};

const DEMO_TIMELINES: Record<GuardianMode, TimelineEvent[]> = {
  elder: [
    {
      time: "2:14 PM",
      title: "Exited front door",
      detail: "Safe-zone exit detected. Monitoring active.",
    },
    {
      time: "2:18 PM",
      title: "Walking north",
      detail: "Movement normal. Heart rate stable.",
    },
    {
      time: "2:22 PM",
      title: "Pause detected",
      detail: "Stopped near park bench for 40 seconds.",
    },
    {
      time: "2:26 PM",
      title: "Movement resumed",
      detail: "Guardian continuity restored.",
    },
  ],
  child: [
    {
      time: "7:42 AM",
      title: "Left home base",
      detail: "SE 29th Court — route to Okeechobee High School active.",
    },
    {
      time: "7:47 AM",
      title: "Bike route detected",
      detail: "Movement normal and route continuity active.",
    },
    {
      time: "7:51 AM",
      title: "Sudden stop event",
      detail: "Guardian impact / stop check triggered.",
    },
    {
      time: "7:52 AM",
      title: "Guardian check initiated",
      detail: "Parent relay ready with location context.",
    },
  ],
  medical: [
    {
      time: "3:14 PM",
      title: "Vehicle motion",
      detail: "Travel pattern normal.",
    },
    {
      time: "3:16 PM",
      title: "Sudden deceleration",
      detail: "Possible collision event detected.",
    },
    {
      time: "3:16 PM",
      title: "Guardian continuity capture",
      detail: "Location and timeline packet created.",
    },
    {
      time: "3:17 PM",
      title: "Responder relay ready",
      detail: "Emergency contact pathway prepared.",
    },
  ],
};

const guardianModuleSession = createGuardianSession({
  residentId: "haley-d",
  wearerName: "Haley D.",
  wearerPhone: "19032466394",
  contactName: "Daniel Doyon",
  contactRelation: "Parent Contact",
  contactPhone: "8635320683",
  mode: "child",
  status: "Route to Okeechobee High School active",
  location: "SE 29th Court — Home",
});

function nowStamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatPhone(phone: string) {
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

export default function GuardianPresenceDesk() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<GuardianMode>("elder");
  const [actionNote, setActionNote] = useState(
    "Guardian standing by. Select an action when needed.",
  );
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [sensorStatus, setSensorStatus] = useState("Sensor watch active.");
  const [impactPromptOpen, setImpactPromptOpen] = useState(false);
  const [impactPromptText, setImpactPromptText] = useState("");
  const [isPaired, setIsPaired] = useState(false);
  const [pairedDeviceName, setPairedDeviceName] = useState("No device paired yet");
  const [pairingCode] = useState(() =>
    Math.random().toString(36).slice(2, 8).toUpperCase(),
  );
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const [panicHoldProgress, setPanicHoldProgress] = useState(0);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number | null>(null);
  const HOLD_DURATION = 1800;

  const timeline = DEMO_TIMELINES[mode];

  const profile = useMemo<GuardianProfile>(() => {
    if (mode === "elder") {
      return {
        name: "Mary Johnson",
        label: "Age 78",
        status: "Monitoring safely",
        location: "Neighborhood watch active",
        wearerPhone: "8635320683",
        contactName: "Chelsea Rule",
        contactRelation: "Family Contact",
        contactPhone: "5614102991",
        routeState: "Monitoring",
      };
    }

    if (mode === "child") {
      return {
        name: "Haley D.",
        label: "School Route",
        status: "Route to Okeechobee High School active",
        location: "On route",
        wearerPhone: "19032466394",
        contactName: "Daniel Doyon",
        contactRelation: "Parent Contact",
        contactPhone: "8635320683",
        homeBase: "SE 29th Court — Home",
        destination: "Okeechobee High School",
        destinationPhone: "8634625025",
        routeState: "On Route",
      };
    }

    return {
      name: "Daniel R.",
      label: "Medical Watch",
      status: "Distress monitoring active",
      location: "Main Street",
      wearerPhone: "8635320683",
      contactName: "Chelsea Rule",
      contactRelation: "Emergency Contact",
      contactPhone: "5614102991",
      routeState: "Monitoring",
    };
  }, [mode]);

  function addLog(title: string, detail: string) {
    setActionLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        time: nowStamp(),
        title,
        detail,
      },
      ...prev.slice(0, 10),
    ]);
  }

  useEffect(() => {
    const ua = navigator.userAgent;
    const inferredDevice =
      /iPhone/i.test(ua)
        ? "iPhone"
        : /iPad/i.test(ua)
          ? "iPad"
          : /Android/i.test(ua)
            ? "Android Phone"
            : "Desktop Browser";

    startGuardianSensors((event, detail) => {
      const label = event.toUpperCase();
      addLog(label, detail);
      setSensorStatus(detail);

      if ((event === "impact" || event === "crash") && isPaired) {
        setImpactPromptOpen(true);
        setImpactPromptText(detail);
        setActionNote("Impact detected. Guardian check opened.");
      }
    });

    setPairedDeviceName(inferredDevice);
  }, [isPaired]);

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, []);

  function handleModeChange(nextMode: GuardianMode) {
    setMode(nextMode);
    const label =
      nextMode === "elder"
        ? "Elder Mode loaded."
        : nextMode === "child"
          ? "Child Mode loaded."
          : "Medical Mode loaded.";
    setActionNote(label);
    addLog("Mode changed", label);
    setImpactPromptOpen(false);
  }

  async function handlePairDevice() {
    const ua = navigator.userAgent;
    const inferredDevice =
      /iPhone/i.test(ua)
        ? "Haley iPhone"
        : /iPad/i.test(ua)
          ? "Haley iPad"
          : /Android/i.test(ua)
            ? "Haley Android Phone"
            : "Desktop Browser";

    setIsPaired(true);
    setPairedDeviceName(inferredDevice);
    setActionNote(`Guardian paired to ${inferredDevice}.`);
    addLog("PAIR DEVICE", `Guardian paired to ${inferredDevice}. Code ${pairingCode}.`);

    try {
      await navigator.clipboard.writeText(pairingCode);
      addLog("PAIR CODE", `Pair code copied: ${pairingCode}`);
    } catch {
      // ignore clipboard failure
    }
  }

  function handleUnpairDevice() {
    setIsPaired(false);
    setImpactPromptOpen(false);
    setActionNote("Guardian device unpaired.");
    addLog("UNPAIR DEVICE", "Wearer device link removed.");
  }

  async function handleCallWearer() {
    const msg =
      mode === "child"
        ? `Opening phone dialer for Haley (${formatPhone(profile.wearerPhone)}).`
        : `Opening phone dialer for ${profile.name}.`;

    setActionNote(msg);
    addLog("Call Wearer", msg);

    try {
      await navigator.clipboard.writeText(profile.wearerPhone);
      addLog(
        "Call Fallback",
        `Wearer number copied: ${formatPhone(profile.wearerPhone)}`,
      );
    } catch {
      // ignore clipboard failure
    }

    window.location.href = `tel:${profile.wearerPhone}`;
  }

  function handleTextContact() {
    const smsBody =
      mode === "child"
        ? `Planet Guardian: Please check on Haley. Route to Okeechobee High School is active. Current state: ${profile.routeState}.`
        : `Planet Guardian: Please check on ${profile.name}. Current location: ${profile.location}.`;

    const msg = `Opening SMS relay to ${profile.contactName}.`;
    setActionNote(msg);
    addLog("Text Contact", msg);

    window.location.href = `sms:${profile.contactPhone}?body=${encodeURIComponent(
      smsBody,
    )}`;
  }

  function handleQuickTextOkay() {
    const smsBody = `Planet Guardian update: Haley tapped I'm OK at ${nowStamp()}.`;
    setActionNote("Opening quick OK relay.");
    addLog("QUICK OK", "I'm OK relay opened.");
    window.location.href = `sms:${profile.contactPhone}?body=${encodeURIComponent(
      smsBody,
    )}`;
  }

  function handleQuickTextHelp() {
    const smsBody = `Planet Guardian alert: Haley tapped Need Help at ${nowStamp()}. Please check immediately.`;
    setActionNote("Opening quick help relay.");
    addLog("QUICK HELP", "Need Help relay opened.");
    window.location.href = `sms:${profile.contactPhone}?body=${encodeURIComponent(
      smsBody,
    )}`;
  }

  async function handleShareLocation() {
    const packet = [
      "Planet Guardian Location Packet",
      `Name: ${profile.name}`,
      `Mode: ${profile.label}`,
      `Status: ${profile.status}`,
      `Location: ${profile.location}`,
      profile.homeBase ? `Home Base: ${profile.homeBase}` : "",
      profile.destination ? `Destination: ${profile.destination}` : "",
      `Wearer: ${formatPhone(profile.wearerPhone)}`,
      `Contact: ${profile.contactName} (${formatPhone(profile.contactPhone)})`,
      isPaired ? `Paired Device: ${pairedDeviceName}` : "Paired Device: Not paired",
      `Time: ${nowStamp()}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Planet Guardian Location Packet",
          text: packet,
        });
        const msg = "Location packet shared.";
        setActionNote(msg);
        addLog("Share Location", msg);
        return;
      }

      await navigator.clipboard.writeText(packet);
      const msg = "Location packet copied to clipboard.";
      setActionNote(msg);
      addLog("Share Location", msg);
    } catch {
      const msg = "Share / clipboard action failed on this device/browser.";
      setActionNote(msg);
      addLog("Share Location", msg);
    }
  }

  function handleReplayTimeline() {
    const msg = "Replaying timeline.";
    setActionNote(msg);
    addLog("Replay Timeline", msg);
    timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleImpactOkay() {
    setImpactPromptOpen(false);
    setActionNote("Guardian check closed. Safe confirmed.");
    addLog("I'M OK", "Wearer confirmed safe after impact check.");
  }

  function handleImpactNeedHelp() {
    setImpactPromptOpen(false);
    setActionNote("Help requested after impact check.");
    addLog("NEED HELP", "Wearer requested help after impact check.");
    handleTextContact();
  }

  function buildPanicState() {
    const panicType =
      mode === "elder" ? "elder" : mode === "child" ? "child" : "medical";

    const locationLabel =
      profile.homeBase ||
      profile.location ||
      profile.destination ||
      "Location updating...";

    return {
      guardianProfile: {
        name: profile.name,
        type: panicType,
        status: profile.status,
        label: profile.label,
        locationLabel,
        notes:
          mode === "child"
            ? `Guardian route watch active. Contact: ${profile.contactName}. Destination: ${profile.destination ?? "Not set"}.`
            : `Guardian protection active. Contact: ${profile.contactName}.`,
        contactName: profile.contactName,
        contactRelation: profile.contactRelation,
        contactPhone: profile.contactPhone,
        wearerPhone: profile.wearerPhone,
        homeBase: profile.homeBase ?? "",
        destination: profile.destination ?? "",
        destinationPhone: profile.destinationPhone ?? "",
        routeState: profile.routeState ?? "",
        pairedDeviceName,
        isPaired,
      },
    };
  }

  function handleOpenPanicMode() {
    setActionNote("Opening Guardian Panic Mode.");
    addLog("PANIC MODE", "Guardian Panic Mode opened from Presence Desk.");
    navigate("/planet/guardian/panic", { state: buildPanicState() });
  }

  function startPanicHold() {
    if (holdTimerRef.current) return;

    holdStartRef.current = Date.now();

    holdTimerRef.current = setInterval(() => {
      if (!holdStartRef.current) return;

      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);

      setPanicHoldProgress(progress);

      if (progress >= 1) {
        if (holdTimerRef.current) {
          clearInterval(holdTimerRef.current);
          holdTimerRef.current = null;
        }
        holdStartRef.current = null;
        setPanicHoldProgress(0);
        handleOpenPanicMode();
      }
    }, 16);
  }

  function cancelPanicHold() {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    holdStartRef.current = null;
    setPanicHoldProgress(0);
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="mx-auto max-w-[1300px] px-6 py-8">
        <header className="mb-6 rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 shadow-[0_0_0_1px_rgba(96,165,250,0.06),0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-300" />
                <h1 className="text-xl font-semibold tracking-wide">Planet Guardian</h1>
              </div>

              <p className="mt-2 text-sm text-blue-200/80">
                Guardian preserves and communicates a person’s situation when they cannot.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onMouseDown={startPanicHold}
                onMouseUp={cancelPanicHold}
                onMouseLeave={cancelPanicHold}
                onTouchStart={startPanicHold}
                onTouchEnd={cancelPanicHold}
                onTouchCancel={cancelPanicHold}
                className="relative inline-flex overflow-hidden items-center justify-center gap-2 rounded-2xl border border-red-400/35 bg-red-500/12 px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-red-200 transition hover:scale-[1.01] hover:bg-red-500/20 select-none"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-red-500/30 transition-[width] duration-75"
                  style={{ width: `${panicHoldProgress * 100}%` }}
                />
                <span className="relative flex items-center gap-2">
                  <Siren className="h-4 w-4" />
                  {panicHoldProgress > 0 ? "Hold to activate..." : "Activate Panic Mode"}
                </span>
              </button>

              <div className="text-center text-[11px] uppercase tracking-[0.22em] text-red-200/55">
                Press and hold
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr_300px]">
          <section className="space-y-3">
            <div className="text-sm uppercase tracking-wider text-blue-200/70">
              Guardian Modes
            </div>

            <ModeButton
              active={mode === "elder"}
              label="Elder Mode"
              icon={Shield}
              onClick={() => handleModeChange("elder")}
            />
            <ModeButton
              active={mode === "child"}
              label="Child Mode"
              icon={Bike}
              onClick={() => handleModeChange("child")}
            />
            <ModeButton
              active={mode === "medical"}
              label="Medical Mode"
              icon={Activity}
              onClick={() => handleModeChange("medical")}
            />
          </section>

          <section className="space-y-4">
            <div className="rounded-2xl border border-blue-400/20 bg-blue-900/20 p-5 shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{profile.name}</h3>
                  <p className="text-sm text-blue-200">{profile.label}</p>
                </div>

                <div
                  className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    isPaired
                      ? "border-emerald-400/35 bg-emerald-900/20 text-emerald-100"
                      : "border-amber-400/35 bg-amber-900/20 text-amber-100"
                  }`}
                >
                  {isPaired ? "Paired" : "Not Paired"}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <Info label="Status" value={profile.status} icon={Shield} />
                <Info label="Location" value={profile.location} icon={MapPin} />
                <Info label="Battery" value="86%" icon={Battery} />
              </div>

              {mode === "child" && (
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <Info label="Home Base" value={profile.homeBase ?? "Home"} icon={Home} />
                  <Info
                    label="Destination"
                    value={profile.destination ?? "School"}
                    icon={School}
                  />
                  <Info
                    label="Current State"
                    value={profile.routeState ?? "On Route"}
                    icon={Route}
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-900/10 p-5 shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-cyan-300" />
                <div className="text-sm uppercase tracking-wider text-cyan-200/80">
                  Guardian Pairing
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <Info
                  label="Pair Status"
                  value={isPaired ? "Wearer device linked" : "Waiting to pair"}
                  icon={Shield}
                />
                <Info label="Device" value={pairedDeviceName} icon={Smartphone} />
                <Info label="Pair Code" value={pairingCode} icon={Copy} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {!isPaired ? (
                  <Action
                    icon={Link2}
                    label="Pair Device"
                    onClick={handlePairDevice}
                    tone="green"
                  />
                ) : (
                  <Action
                    icon={Link2}
                    label="Unpair Device"
                    onClick={handleUnpairDevice}
                    tone="orange"
                  />
                )}

                <Action
                  icon={MessageSquare}
                  label="Quick I'm OK"
                  onClick={handleQuickTextOkay}
                  tone="blue"
                />
                <Action
                  icon={Bell}
                  label="Quick Need Help"
                  onClick={handleQuickTextHelp}
                  tone="purple"
                />
                <Action
                  icon={Phone}
                  label="Call Dad"
                  onClick={handleTextContact}
                  tone="green"
                />
                <Action
                  icon={Copy}
                  label="Copy Pair Code"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(pairingCode);
                      setActionNote("Pair code copied.");
                      addLog("PAIR CODE", `Pair code copied: ${pairingCode}`);
                    } catch {
                      setActionNote("Pair code copy failed.");
                    }
                  }}
                  tone="blue"
                />
              </div>
            </div>

            {impactPromptOpen && (
              <div className="rounded-2xl border border-amber-400/30 bg-amber-900/20 p-5 shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold uppercase tracking-wider text-amber-200/90">
                      Guardian Check
                    </div>
                    <div className="mt-2 text-sm text-amber-50">
                      {impactPromptText || "Possible impact detected. Are you okay?"}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Action
                        icon={CheckCircle2}
                        label="I'm OK"
                        onClick={handleImpactOkay}
                        tone="green"
                      />
                      <Action
                        icon={Bell}
                        label="Need Help"
                        onClick={handleImpactNeedHelp}
                        tone="orange"
                      />
                      <Action
                        icon={MessageSquare}
                        label="Quick I'm OK"
                        onClick={handleQuickTextOkay}
                        tone="blue"
                      />
                      <Action
                        icon={Bell}
                        label="Quick Need Help"
                        onClick={handleQuickTextHelp}
                        tone="purple"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              ref={timelineRef}
              className="rounded-2xl border border-blue-400/20 bg-blue-950/40 p-5 shadow-[0_10px_28px_rgba(0,0,0,0.20)]"
            >
              <div className="mb-3 text-sm uppercase tracking-wider text-blue-200/70">
                Guardian Timeline
              </div>

              <div className="space-y-3">
                {timeline.map((e, i) => (
                  <div
                    key={`${e.time}-${e.title}-${i}`}
                    className="rounded-xl border border-blue-400/10 bg-black/30 p-3"
                  >
                    <div className="text-xs text-blue-300">{e.time}</div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-sm text-gray-300">{e.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-400/20 bg-purple-900/20 p-5 shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-300" />
                <h3 className="text-sm uppercase tracking-wider text-purple-200/80">
                  Guardian Response
                </h3>
              </div>

              <p className="mt-3 text-sm text-purple-100/90">{actionNote}</p>
              <p className="mt-2 text-xs text-purple-200/70">{sensorStatus}</p>

              <div className="mt-4 space-y-3">
                {actionLogs.length === 0 ? (
                  <div className="rounded-xl border border-purple-400/10 bg-black/20 p-3 text-sm text-gray-300">
                    No actions triggered yet.
                  </div>
                ) : (
                  actionLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-purple-400/10 bg-black/20 p-3"
                    >
                      <div className="text-xs text-purple-300">{log.time}</div>
                      <div className="font-medium">{log.title}</div>
                      <div className="text-sm text-gray-300">{log.detail}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="text-sm uppercase tracking-wider text-blue-200/70">
              Guardian Actions
            </div>

            <Action
              icon={Siren}
              label="Activate Panic Mode"
              onClick={handleOpenPanicMode}
              tone="red"
            />
            <Action
              icon={Phone}
              label="Call Wearer"
              onClick={handleCallWearer}
              tone="blue"
            />
            <Action
              icon={Bell}
              label="Text Contact"
              onClick={handleTextContact}
              tone="green"
            />
            <Action
              icon={Copy}
              label="Share Location"
              onClick={handleShareLocation}
              tone="purple"
            />
            <Action
              icon={HeartPulse}
              label="Replay Timeline"
              onClick={handleReplayTimeline}
              tone="orange"
            />

            <div className="rounded-2xl border border-blue-400/20 bg-blue-900/20 p-4 shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
              <div className="text-xs uppercase tracking-wider text-blue-200/70">
                Wearer
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                <UserRound className="h-4 w-4 text-blue-300" />
                <span>{profile.name}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-blue-100/85">
                <Phone className="h-4 w-4 text-blue-300" />
                <span>{formatPhone(profile.wearerPhone)}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-400/20 bg-blue-900/20 p-4 shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
              <div className="text-xs uppercase tracking-wider text-blue-200/70">
                Primary Contact
              </div>
              <div className="mt-2 text-sm font-medium">{profile.contactName}</div>
              <div className="mt-1 text-xs text-blue-200/70">{profile.contactRelation}</div>
              <div className="mt-2 flex items-center gap-2 text-sm text-blue-100/85">
                <Smartphone className="h-4 w-4 text-blue-300" />
                <span>{formatPhone(profile.contactPhone)}</span>
              </div>
            </div>

            {mode === "child" && (
              <div className="rounded-2xl border border-blue-400/20 bg-blue-900/20 p-4 shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
                <div className="text-xs uppercase tracking-wider text-blue-200/70">
                  Destination
                </div>
                <div className="mt-2 text-sm font-medium">{profile.destination}</div>
                <div className="mt-1 text-xs text-blue-200/70">School</div>
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-100/85">
                  <Phone className="h-4 w-4 text-blue-300" />
                  <span>{formatPhone(profile.destinationPhone ?? "")}</span>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-6 rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-950/40 to-purple-950/30 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <div className="mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-200/80">
              Guardian Module Test
            </h2>
            <p className="mt-1 text-sm text-blue-100/70">
              Reusable Guardian panel running inside Planet Guardian the HomePlanet way.
            </p>
          </div>

          <GuardianPanel initialSession={guardianModuleSession} variant="monitor" />
        </div>
      </div>
    </div>
  );
}

function ModeButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition shadow-[0_6px_18px_rgba(0,0,0,0.18)]",
        active
          ? "border-purple-400 bg-purple-900/30 text-white"
          : "border-blue-400/25 bg-black/25 text-white hover:bg-blue-900/20",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-blue-400/10 bg-black/30 p-2">
      <Icon className="h-4 w-4 text-blue-300" />
      <div>
        <div className="text-xs text-blue-200/70">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}

function Action({
  icon: Icon,
  label,
  onClick,
  tone = "blue",
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  tone?: "blue" | "green" | "purple" | "orange" | "red";
}) {
  const toneClasses =
    tone === "green"
      ? "border-emerald-400/35 bg-emerald-900/20 hover:bg-emerald-800/30 text-emerald-50"
      : tone === "purple"
        ? "border-purple-400/35 bg-purple-900/20 hover:bg-purple-800/30 text-purple-50"
        : tone === "orange"
          ? "border-amber-400/35 bg-amber-900/20 hover:bg-amber-800/30 text-amber-50"
          : tone === "red"
            ? "border-red-400/35 bg-red-900/20 hover:bg-red-800/30 text-red-50"
            : "border-blue-400/35 bg-blue-900/20 hover:bg-blue-800/30 text-blue-50";

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 transition shadow-[0_8px_22px_rgba(0,0,0,0.22)] ${toneClasses}`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}