import { useEffect, useMemo, useRef, useState } from "react";
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
  wearerPhone: "8635320683",
  contactName: "Chelsea Rule",
  contactRelation: "Parent Contact",
  contactPhone: "5614102991",
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
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export default function GuardianPresenceDesk() {
  const [mode, setMode] = useState<GuardianMode>("elder");
  const [actionNote, setActionNote] = useState(
    "Guardian standing by. Select an action when needed.",
  );
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [sensorStatus, setSensorStatus] = useState("Sensor watch active.");
  const [impactPromptOpen, setImpactPromptOpen] = useState(false);
  const [impactPromptText, setImpactPromptText] = useState("");
  const timelineRef = useRef<HTMLDivElement | null>(null);

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
        wearerPhone: "8635320683",
        contactName: "Chelsea Rule",
        contactRelation: "Parent Contact",
        contactPhone: "5614102991",
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
      ...prev.slice(0, 8),
    ]);
  }

  useEffect(() => {
    startGuardianSensors((event, detail) => {
      const label = event.toUpperCase();
      addLog(label, detail);
      setSensorStatus(detail);

      if (event === "impact" || event === "crash") {
        setImpactPromptOpen(true);
        setImpactPromptText(detail);
        setActionNote("Impact detected. Guardian check opened.");
      }
    });
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

  async function handleCallWearer() {
    const msg =
      mode === "child"
        ? `Opening phone dialer for Dad line (${formatPhone(profile.wearerPhone)}).`
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

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="mx-auto max-w-[1300px] px-6 py-8">
        <header className="mb-6 rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 shadow-[0_0_0_1px_rgba(96,165,250,0.06),0_12px_40px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-300" />
            <h1 className="text-xl font-semibold tracking-wide">Planet Guardian</h1>
          </div>

          <p className="mt-2 text-sm text-blue-200/80">
            Guardian preserves and communicates a person’s situation when they cannot.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr_300px]">
          {/* LEFT */}
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

          {/* CENTER */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-blue-400/20 bg-blue-900/20 p-5 shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
              <h3 className="text-lg font-semibold">{profile.name}</h3>
              <p className="text-sm text-blue-200">{profile.label}</p>

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

          {/* RIGHT */}
          <section className="space-y-3">
            <div className="text-sm uppercase tracking-wider text-blue-200/70">
              Guardian Actions
            </div>

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

        {/* REUSABLE MODULE */}
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
  tone?: "blue" | "green" | "purple" | "orange";
}) {
  const toneClasses =
    tone === "green"
      ? "border-emerald-400/35 bg-emerald-900/20 hover:bg-emerald-800/30 text-emerald-50"
      : tone === "purple"
        ? "border-purple-400/35 bg-purple-900/20 hover:bg-purple-800/30 text-purple-50"
        : tone === "orange"
          ? "border-amber-400/35 bg-amber-900/20 hover:bg-amber-800/30 text-amber-50"
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