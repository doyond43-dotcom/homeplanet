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
  Eye,
  Lock,
  Users,
  Radio,
  Clock3,
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
  const [publicPreviewEnabled, setPublicPreviewEnabled] = useState(true);
  const [contactButtonEnabled, setContactButtonEnabled] = useState(true);
  const [timelinePreviewEnabled, setTimelinePreviewEnabled] = useState(false);
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

  const householdMembers = useMemo(
    () => [
      {
        id: "haley",
        name: "Haley D.",
        label: "Child",
        status: mode === "child" ? "Active" : "Standby",
        selected: mode === "child",
      },
      {
        id: "mary",
        name: "Mary Johnson",
        label: "Elder",
        status: mode === "elder" ? "Active" : "Standby",
        selected: mode === "elder",
      },
      {
        id: "daniel",
        name: "Daniel R.",
        label: "Medical",
        status: mode === "medical" ? "Active" : "Standby",
        selected: mode === "medical",
      },
    ],
    [mode],
  );

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
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto max-w-[1480px] px-4 py-4 md:px-6 md:py-6">
        <div className="overflow-hidden rounded-[28px] border border-cyan-400/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_30%),linear-gradient(180deg,rgba(8,15,28,0.98),rgba(4,10,20,1))] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <header className="border-b border-white/10 px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                    <Shield className="h-3.5 w-3.5" />
                    Planet Guardian
                  </span>
                  <span className="inline-flex items-center rounded-full border border-purple-400/25 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-100">
                    Protected Command
                  </span>
                  <span className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
                    {isPaired ? "Wearer Linked" : "Waiting to Pair"}
                  </span>
                </div>

                <div className="mt-4">
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    Guardian Presence Desk
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm text-cyan-100/75 md:text-[15px]">
                    Live protection, location continuity, impact awareness, and contact control
                    in one calm command surface.
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto">
                <button
                  onMouseDown={startPanicHold}
                  onMouseUp={cancelPanicHold}
                  onMouseLeave={cancelPanicHold}
                  onTouchStart={startPanicHold}
                  onTouchEnd={cancelPanicHold}
                  onTouchCancel={cancelPanicHold}
                  className="relative inline-flex overflow-hidden items-center justify-center gap-2 rounded-2xl border border-red-400/35 bg-red-500/12 px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-red-100 transition hover:scale-[1.01] hover:bg-red-500/20 select-none"
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

          <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[280px_minmax(0,1fr)_320px] md:p-6">
            <aside className="space-y-4">
              <CockpitCard
                kicker="Household"
                title="Protected members"
                sub="Switch the active protection lens."
              >
                <div className="space-y-2">
                  {householdMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() =>
                        handleModeChange(
                          member.id === "haley"
                            ? "child"
                            : member.id === "mary"
                              ? "elder"
                              : "medical",
                        )
                      }
                      className={[
                        "w-full rounded-2xl border px-4 py-3 text-left transition",
                        member.selected
                          ? "border-cyan-400/35 bg-cyan-500/10 shadow-[0_10px_28px_rgba(0,0,0,0.20)]"
                          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-white">{member.name}</div>
                          <div className="text-xs uppercase tracking-[0.18em] text-cyan-100/55">
                            {member.label}
                          </div>
                        </div>
                        <div
                          className={[
                            "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                            member.selected
                              ? "border border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
                              : "border border-white/10 bg-white/[0.04] text-white/65",
                          ].join(" ")}
                        >
                          {member.status}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CockpitCard>

              <CockpitCard
                kicker="Guardian modes"
                title="Protection mode"
                sub="Pick the watch pattern."
              >
                <div className="space-y-2">
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
                </div>
              </CockpitCard>

              <CockpitCard
                kicker="Live state"
                title="Protection snapshot"
                sub="What Guardian sees right now."
              >
                <div className="grid gap-3">
                  <MiniStat
                    icon={Radio}
                    label="Sensor state"
                    value={sensorStatus}
                  />
                  <MiniStat
                    icon={MapPin}
                    label="Location"
                    value={profile.location}
                  />
                  <MiniStat
                    icon={Clock3}
                    label="Route state"
                    value={profile.routeState ?? "Monitoring"}
                  />
                </div>
              </CockpitCard>
            </aside>

            <main className="space-y-4">
              <CockpitCard
                kicker="Selected profile"
                title={profile.name}
                sub={profile.label}
              >
                <div className="grid gap-4">
                  <div className="rounded-[22px] border border-cyan-400/20 bg-cyan-500/[0.05] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-white">{profile.name}</div>
                        <div className="mt-1 text-sm text-cyan-100/70">{profile.label}</div>
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

                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                      <Info label="Status" value={profile.status} icon={Shield} />
                      <Info label="Location" value={profile.location} icon={MapPin} />
                      <Info label="Battery" value="86%" icon={Battery} />
                    </div>

                    {mode === "child" && (
                      <div className="mt-3 grid gap-3 md:grid-cols-3">
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

                  <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <CockpitInner
                      kicker="Pairing"
                      title="Wearer device link"
                      sub="Device continuity and quick relay tools."
                    >
                      <div className="grid gap-3 md:grid-cols-3">
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
                          label="Text Contact"
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
                    </CockpitInner>

                    <CockpitInner
                      kicker="Response"
                      title="Guardian response"
                      sub="Action notes and live status."
                    >
                      <div className="rounded-2xl border border-purple-400/20 bg-purple-500/[0.05] p-4">
                        <div className="text-sm text-purple-100/90">{actionNote}</div>
                        <div className="mt-2 text-xs text-purple-200/65">{sensorStatus}</div>
                      </div>

                      {impactPromptOpen && (
                        <div className="mt-3 rounded-2xl border border-amber-400/30 bg-amber-500/[0.08] p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
                            <div className="flex-1">
                              <div className="text-xs font-semibold uppercase tracking-[0.20em] text-amber-200/90">
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
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CockpitInner>
                  </div>
                </div>
              </CockpitCard>

              <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                <CockpitCard
                  kicker="Timeline truth"
                  title="Guardian timeline"
                  sub="Continuity, movement, and event truth."
                >
                  <div ref={timelineRef} className="space-y-3">
                    {timeline.map((e, i) => (
                      <div
                        key={`${e.time}-${e.title}-${i}`}
                        className="rounded-2xl border border-white/10 bg-black/25 p-4"
                      >
                        <div className="text-xs uppercase tracking-[0.18em] text-cyan-300/75">
                          {e.time}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-white">{e.title}</div>
                        <div className="mt-1 text-sm text-slate-300">{e.detail}</div>
                      </div>
                    ))}
                  </div>
                </CockpitCard>

                <CockpitCard
                  kicker="Action log"
                  title="Recent Guardian actions"
                  sub="Operator actions and relays."
                >
                  <div className="space-y-3">
                    {actionLogs.length === 0 ? (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                        No actions triggered yet.
                      </div>
                    ) : (
                      actionLogs.map((log) => (
                        <div
                          key={log.id}
                          className="rounded-2xl border border-white/10 bg-black/20 p-4"
                        >
                          <div className="text-xs uppercase tracking-[0.18em] text-purple-300/75">
                            {log.time}
                          </div>
                          <div className="mt-1 text-sm font-semibold text-white">{log.title}</div>
                          <div className="mt-1 text-sm text-slate-300">{log.detail}</div>
                        </div>
                      ))
                    )}
                  </div>
                </CockpitCard>
              </div>

              <CockpitCard
                kicker="Guardian module"
                title="Reusable Guardian panel"
                sub="Core Guardian module running inside Planet Guardian."
              >
                <GuardianPanel initialSession={guardianModuleSession} variant="monitor" />
              </CockpitCard>
            </main>

            <aside className="space-y-4">
              <CockpitCard
                kicker="Actions"
                title="Guardian actions"
                sub="Fast actions that matter."
              >
                <div className="space-y-2">
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
                </div>
              </CockpitCard>

              <CockpitCard
                kicker="Visibility"
                title="Public / protected controls"
                sub="Control what the outside layer can see."
              >
                <div className="space-y-3">
                  <ToggleRow
                    icon={Eye}
                    label="Public preview"
                    value={publicPreviewEnabled}
                    onClick={() => setPublicPreviewEnabled((v) => !v)}
                  />
                  <ToggleRow
                    icon={Phone}
                    label="Contact button"
                    value={contactButtonEnabled}
                    onClick={() => setContactButtonEnabled((v) => !v)}
                  />
                  <ToggleRow
                    icon={Clock3}
                    label="Timeline preview"
                    value={timelinePreviewEnabled}
                    onClick={() => setTimelinePreviewEnabled((v) => !v)}
                  />

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-200/70">
                      <Lock className="h-4 w-4 text-cyan-300" />
                      Public preview
                    </div>
                    <div className="mt-3 text-sm text-white">
                      {publicPreviewEnabled ? profile.name : "Protected Member"}
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      {publicPreviewEnabled ? profile.status : "Guardian protected"}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {contactButtonEnabled && (
                        <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                          Contact Enabled
                        </span>
                      )}
                      <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                        {timelinePreviewEnabled ? "Timeline Visible" : "Timeline Hidden"}
                      </span>
                    </div>
                  </div>
                </div>
              </CockpitCard>

              <CockpitCard
                kicker="Contacts"
                title="Guardian contacts"
                sub="Fast reference and relay context."
              >
                <div className="space-y-3">
                  <ContactCard
                    title="Wearer"
                    name={profile.name}
                    subtitle={profile.label}
                    phone={formatPhone(profile.wearerPhone)}
                    icon={UserRound}
                  />

                  <ContactCard
                    title="Primary Contact"
                    name={profile.contactName}
                    subtitle={profile.contactRelation}
                    phone={formatPhone(profile.contactPhone)}
                    icon={Smartphone}
                  />

                  {mode === "child" && (
                    <ContactCard
                      title="Destination"
                      name={profile.destination ?? "School"}
                      subtitle="School"
                      phone={formatPhone(profile.destinationPhone ?? "")}
                      icon={School}
                    />
                  )}
                </div>
              </CockpitCard>

              <CockpitCard
                kicker="Guardian control"
                title="Core surfaces"
                sub="Jump into linked Guardian surfaces."
              >
                <div className="space-y-2">
                  <Action
                    icon={Shield}
                    label="Open Planet Guardian"
                    onClick={() => navigate("/planet/guardian")}
                    tone="blue"
                  />
                  <Action
                    icon={Users}
                    label="Manage Protected Profile"
                    onClick={() => navigate("/planet/guardian/child/child-1775005350413")}
                    tone="green"
                  />
                  <Action
                    icon={Link2}
                    label="Open Panic Console"
                    onClick={() => navigate("/planet/guardian/panic")}
                    tone="purple"
                  />
                </div>
              </CockpitCard>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function CockpitCard({
  kicker,
  title,
  sub,
  children,
}: {
  kicker: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] shadow-[0_12px_30px_rgba(0,0,0,0.20)]">
      <div className="border-b border-white/10 bg-white/[0.02] px-4 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
          {kicker}
        </div>
        <div className="mt-1 text-lg font-semibold text-white">{title}</div>
        {sub ? <div className="mt-1 text-sm text-slate-300">{sub}</div> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function CockpitInner({
  kicker,
  title,
  sub,
  children,
}: {
  kicker: string;
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.025] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
        {kicker}
      </div>
      <div className="mt-1 text-base font-semibold text-white">{title}</div>
      {sub ? <div className="mt-1 text-sm text-slate-300">{sub}</div> : null}
      <div className="mt-4">{children}</div>
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
        "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition shadow-[0_6px_18px_rgba(0,0,0,0.18)]",
        active
          ? "border-cyan-400/35 bg-cyan-500/10 text-white"
          : "border-white/10 bg-black/20 text-white hover:bg-white/[0.05]",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 text-cyan-300" />
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
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 p-3">
      <Icon className="h-4 w-4 text-cyan-300" />
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-[0.16em] text-cyan-200/60">{label}</div>
        <div className="text-sm text-white">{value}</div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-cyan-200/65">
        <Icon className="h-4 w-4 text-cyan-300" />
        {label}
      </div>
      <div className="mt-2 text-sm text-white">{value}</div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left transition hover:bg-white/[0.05]"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-cyan-300" />
        <span className="text-sm text-white">{label}</span>
      </div>

      <div
        className={[
          "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
          value
            ? "border border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
            : "border border-white/10 bg-white/[0.04] text-white/65",
        ].join(" ")}
      >
        {value ? "On" : "Off"}
      </div>
    </button>
  );
}

function ContactCard({
  title,
  name,
  subtitle,
  phone,
  icon: Icon,
}: {
  title: string;
  name: string;
  subtitle: string;
  phone: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-cyan-200/65">{title}</div>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-white">
        <Icon className="h-4 w-4 text-cyan-300" />
        <span>{name}</span>
      </div>
      <div className="mt-1 text-xs text-slate-400">{subtitle}</div>
      <div className="mt-2 flex items-center gap-2 text-sm text-cyan-50/85">
        <Phone className="h-4 w-4 text-cyan-300" />
        <span>{phone}</span>
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