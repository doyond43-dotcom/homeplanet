import { useMemo, useRef, useState } from "react";
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
} from "lucide-react";

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
  contact: string;
  wearerPhone: string;
  contactPhone: string;
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
      title: "School route started",
      detail: "Guardian recognized expected route.",
    },
    {
      time: "7:47 AM",
      title: "Bike movement detected",
      detail: "Normal speed and route pattern.",
    },
    {
      time: "7:51 AM",
      title: "Sudden fall event",
      detail: "Impact pattern detected from bike crash.",
    },
    {
      time: "7:52 AM",
      title: "Guardian check initiated",
      detail: "Parent relay ready with location.",
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

function nowStamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function GuardianPresenceDesk() {
  const [mode, setMode] = useState<GuardianMode>("elder");
  const [actionNote, setActionNote] = useState(
    "Guardian standing by. Select an action when needed.",
  );
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const timeline = DEMO_TIMELINES[mode];

  const profile = useMemo<GuardianProfile>(() => {
    if (mode === "elder") {
      return {
        name: "Mary Johnson",
        label: "Age 78",
        status: "Monitoring safely",
        location: "Pine Street Neighborhood",
        contact: "Family Contact",
        wearerPhone: "8635550101",
        contactPhone: "8635550102",
      };
    }

    if (mode === "child") {
      return {
        name: "Haley D.",
        label: "School Route",
        status: "Route protection active",
        location: "Oak Avenue Corridor",
        contact: "Parent Contact",
        wearerPhone: "8635550201",
        contactPhone: "8635550202",
      };
    }

    return {
      name: "Daniel R.",
      label: "Medical Watch",
      status: "Distress monitoring active",
      location: "Main Street",
      contact: "Responder Contact",
      wearerPhone: "8635550301",
      contactPhone: "8635550302",
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
      ...prev.slice(0, 5),
    ]);
  }

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
  }

  function handleCallWearer() {
    const msg =
      mode === "elder"
        ? "Opening phone dialer for wearer check-in."
        : mode === "child"
          ? "Opening phone dialer for child device check."
          : "Opening phone dialer after medical event.";
    setActionNote(msg);
    addLog("Call Wearer", msg);
    window.location.href = `tel:${profile.wearerPhone}`;
  }

  function handleNotifyContact() {
    const smsBody =
      mode === "elder"
        ? `Planet Guardian: Please check on ${profile.name}. Current location: ${profile.location}.`
        : mode === "child"
          ? `Planet Guardian: Please check on ${profile.name}. Route event detected near ${profile.location}.`
          : `Planet Guardian: Please review medical event for ${profile.name}. Current location: ${profile.location}.`;

    const msg =
      mode === "elder"
        ? "Opening SMS relay to family contact."
        : mode === "child"
          ? "Opening SMS relay to parent contact."
          : "Opening SMS relay to responder / emergency contact.";
    setActionNote(msg);
    addLog("Notify Contact", msg);
    window.location.href = `sms:${profile.contactPhone}?body=${encodeURIComponent(smsBody)}`;
  }

  async function handleShareLocation() {
    const packet = [
      "Planet Guardian Location Packet",
      `Name: ${profile.name}`,
      `Mode: ${profile.label}`,
      `Status: ${profile.status}`,
      `Location: ${profile.location}`,
      `Time: ${nowStamp()}`,
    ].join("\n");

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
    const msg =
      mode === "elder"
        ? "Replaying elder continuity timeline."
        : mode === "child"
          ? "Replaying school route / bike event timeline."
          : "Replaying medical continuity timeline.";
    setActionNote(msg);
    addLog("Replay Timeline", msg);
    timelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="mx-auto max-w-[1300px] px-6 py-8">
        <header className="mb-6 rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-300" />
            <h1 className="text-xl font-semibold tracking-wide">Planet Guardian</h1>
          </div>

          <p className="mt-2 text-sm text-blue-200/80">
            Guardian preserves and communicates a person’s situation when they cannot.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr_300px]">
          <section className="space-y-3">
            <h2 className="text-sm uppercase tracking-wider text-blue-200/70">
              Guardian Modes
            </h2>

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
            <div className="rounded-2xl border border-blue-400/20 bg-blue-900/20 p-5">
              <h3 className="text-lg font-semibold">{profile.name}</h3>
              <p className="text-sm text-blue-200">{profile.label}</p>

              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <Info label="Status" value={profile.status} icon={Shield} />
                <Info label="Location" value={profile.location} icon={MapPin} />
                <Info label="Battery" value="86%" icon={Battery} />
              </div>
            </div>

            <div
              ref={timelineRef}
              className="rounded-2xl border border-blue-400/20 bg-blue-950/40 p-5"
            >
              <h3 className="mb-3 text-sm uppercase tracking-wider text-blue-200/70">
                Guardian Timeline
              </h3>

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

            <div className="rounded-2xl border border-purple-400/20 bg-purple-900/20 p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-300" />
                <h3 className="text-sm uppercase tracking-wider text-purple-200/80">
                  Guardian Response
                </h3>
              </div>

              <p className="mt-3 text-sm text-purple-100/90">{actionNote}</p>

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
            <h2 className="text-sm uppercase tracking-wider text-blue-200/70">
              Guardian Actions
            </h2>

            <Action icon={Phone} label="Call Wearer" onClick={handleCallWearer} />
            <Action icon={Bell} label="Notify Contact" onClick={handleNotifyContact} />
            <Action icon={Copy} label="Share Location" onClick={handleShareLocation} />
            <Action icon={HeartPulse} label="Replay Timeline" onClick={handleReplayTimeline} />

            <div className="rounded-2xl border border-blue-400/20 bg-blue-900/20 p-4">
              <div className="text-xs uppercase tracking-wider text-blue-200/70">
                Active Contact
              </div>
              <div className="mt-2 text-sm font-medium">{profile.contact}</div>
            </div>
          </section>
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
      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
        active
          ? "border-purple-400 bg-purple-900/30"
          : "border-blue-400/20 bg-black/30 hover:bg-blue-900/20"
      }`}
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
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-blue-400/20 bg-blue-900/20 px-4 py-3 hover:bg-blue-800/30"
    >
      <Icon className="h-4 w-4 text-blue-300" />
      <span>{label}</span>
    </button>
  );
}