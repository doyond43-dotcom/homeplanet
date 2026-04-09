import React, { useEffect, useMemo, useState } from "react";

type ZoneId =
  | "front-gate"
  | "camp-row"
  | "mud-pit"
  | "hill-climb"
  | "back-trail"
  | "vendor-row"
  | "water-crossing";

type CrewMember = {
  id: string;
  name: string;
  role: "you" | "friend" | "family" | "responder";
  zone: ZoneId;
  x: number;
  y: number;
  status: "moving" | "parked" | "checking-in" | "responding";
  lastPingMinutes: number;
  isSharingLocation?: boolean;
};

type FeedItem = {
  id: string;
  kind: "activity" | "safety" | "crew" | "system";
  title: string;
  detail: string;
  zone: ZoneId;
  minutesAgo: number;
};

type ZoneConfig = {
  id: ZoneId;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone: string;
  description: string;
};

const STORAGE_KEY = "hp-planet-bamboo-v1";
const EMERGENCY_LOG_KEY = "hp-planet-bamboo-emergency-log";

const zones: ZoneConfig[] = [
  {
    id: "front-gate",
    label: "Front Gate",
    shortLabel: "Gate",
    x: 4,
    y: 6,
    width: 18,
    height: 16,
    tone: "from-sky-500/18 to-cyan-400/8",
    description: "Entry, parking, and general arrival flow.",
  },
  {
    id: "camp-row",
    label: "Camp Row",
    shortLabel: "Camp",
    x: 24,
    y: 10,
    width: 20,
    height: 20,
    tone: "from-emerald-500/18 to-green-400/8",
    description: "Camp setups, regrouping, and slower movement.",
  },
  {
    id: "mud-pit",
    label: "Mud Pit",
    shortLabel: "Mud Pit",
    x: 48,
    y: 14,
    width: 22,
    height: 22,
    tone: "from-amber-500/18 to-orange-400/8",
    description: "Heavy activity, crowds, and the loudest energy.",
  },
  {
    id: "hill-climb",
    label: "Hill Climb",
    shortLabel: "Hill",
    x: 74,
    y: 10,
    width: 18,
    height: 20,
    tone: "from-rose-500/18 to-red-400/8",
    description: "Higher-risk challenge zone and crowd draw.",
  },
  {
    id: "back-trail",
    label: "Back Trail",
    shortLabel: "Trail",
    x: 17,
    y: 42,
    width: 28,
    height: 26,
    tone: "from-violet-500/18 to-fuchsia-400/8",
    description: "More spread out riding and separation from main flow.",
  },
  {
    id: "vendor-row",
    label: "Vendor Row",
    shortLabel: "Vendors",
    x: 51,
    y: 44,
    width: 18,
    height: 18,
    tone: "from-yellow-500/18 to-amber-400/8",
    description: "Food, merch, and social clustering.",
  },
  {
    id: "water-crossing",
    label: "Water Crossing",
    shortLabel: "Water",
    x: 74,
    y: 42,
    width: 18,
    height: 24,
    tone: "from-blue-500/18 to-sky-400/8",
    description: "Waterline area and tougher terrain movement.",
  },
];

const zoneById = Object.fromEntries(zones.map((zone) => [zone.id, zone])) as Record<
  ZoneId,
  ZoneConfig
>;

const baseCrew: CrewMember[] = [
  {
    id: "you",
    name: "You",
    role: "you",
    zone: "front-gate",
    x: 11,
    y: 14,
    status: "checking-in",
    lastPingMinutes: 0,
  },
  {
    id: "crew-1",
    name: "Ty",
    role: "friend",
    zone: "mud-pit",
    x: 56,
    y: 22,
    status: "moving",
    lastPingMinutes: 3,
  },
  {
    id: "crew-2",
    name: "Jess",
    role: "family",
    zone: "camp-row",
    x: 33,
    y: 18,
    status: "parked",
    lastPingMinutes: 7,
  },
  {
    id: "crew-3",
    name: "Rico",
    role: "friend",
    zone: "back-trail",
    x: 30,
    y: 55,
    status: "moving",
    lastPingMinutes: 2,
  },
  {
    id: "crew-4",
    name: "Mia",
    role: "responder",
    zone: "vendor-row",
    x: 60,
    y: 52,
    status: "parked",
    lastPingMinutes: 5,
  },
];

const baseFeed: FeedItem[] = [
  {
    id: "feed-1",
    kind: "activity",
    title: "Mud Pit heating up",
    detail: "More people are clustering in the mud pit right now.",
    zone: "mud-pit",
    minutesAgo: 2,
  },
  {
    id: "feed-2",
    kind: "crew",
    title: "Ty pinged the crew",
    detail: "Pull up near the mud pit edge.",
    zone: "mud-pit",
    minutesAgo: 3,
  },
  {
    id: "feed-3",
    kind: "activity",
    title: "Food line building",
    detail: "Vendor row is getting more active.",
    zone: "vendor-row",
    minutesAgo: 6,
  },
  {
    id: "feed-4",
    kind: "safety",
    title: "Caution near water crossing",
    detail: "Slower movement reported through the wet cut-through.",
    zone: "water-crossing",
    minutesAgo: 8,
  },
  {
    id: "feed-5",
    kind: "system",
    title: "Planet Bamboo live",
    detail: "Awareness layer is active for crews, pings, and responder mode.",
    zone: "front-gate",
    minutesAgo: 12,
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatMinutes(minutes: number) {
  if (minutes <= 0) return "just now";
  if (minutes === 1) return "1 min ago";
  return `${minutes} mins ago`;
}

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function zoneCenter(zone: ZoneConfig) {
  return {
    x: zone.x + zone.width / 2,
    y: zone.y + zone.height / 2,
  };
}

function pulseClassByRole(role: CrewMember["role"]) {
  if (role === "you") return "bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.7)]";
  if (role === "responder") return "bg-rose-300 shadow-[0_0_20px_rgba(251,113,133,0.7)]";
  if (role === "family") return "bg-emerald-300 shadow-[0_0_20px_rgba(74,222,128,0.65)]";
  return "bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.65)]";
}

function ringClassByRole(role: CrewMember["role"]) {
  if (role === "you") return "ring-cyan-300/60";
  if (role === "responder") return "ring-rose-300/60";
  if (role === "family") return "ring-emerald-300/60";
  return "ring-amber-300/60";
}

function badgeClassByKind(kind: FeedItem["kind"]) {
  if (kind === "safety") return "bg-rose-500/15 text-rose-200 ring-rose-400/20";
  if (kind === "crew") return "bg-cyan-500/15 text-cyan-200 ring-cyan-400/20";
  if (kind === "activity") return "bg-amber-500/15 text-amber-200 ring-amber-400/20";
  return "bg-white/10 text-white/75 ring-white/10";
}

function feedLabel(kind: FeedItem["kind"]) {
  if (kind === "safety") return "Safety";
  if (kind === "crew") return "Crew";
  if (kind === "activity") return "Live";
  return "System";
}

export default function PlanetBamboo() {
  const [crewName, setCrewName] = useState("Doyon Crew");
  const [crew, setCrew] = useState<CrewMember[]>(baseCrew);
  const [feed, setFeed] = useState<FeedItem[]>(baseFeed);
  const [selectedZone, setSelectedZone] = useState<ZoneId>("mud-pit");
  const [locationSharingEnabled, setLocationSharingEnabled] = useState(false);
  const [responderModeEnabled, setResponderModeEnabled] = useState(false);
  const [helpActive, setHelpActive] = useState(false);
  const [helpAccepted, setHelpAccepted] = useState(false);
  const [mapPulse, setMapPulse] = useState(0);
  const [liveClock, setLiveClock] = useState(() => new Date());
  const [lastSystemNote, setLastSystemNote] = useState("Planet Bamboo awareness layer active.");
  const [userZone, setUserZone] = useState<ZoneId>("front-gate");
  const [pingFlash, setPingFlash] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        crewName?: string;
        locationSharingEnabled?: boolean;
        responderModeEnabled?: boolean;
        userZone?: ZoneId;
      };
      if (parsed.crewName) setCrewName(parsed.crewName);
      if (typeof parsed.locationSharingEnabled === "boolean") {
        setLocationSharingEnabled(parsed.locationSharingEnabled);
      }
      if (typeof parsed.responderModeEnabled === "boolean") {
        setResponderModeEnabled(parsed.responderModeEnabled);
      }
      if (parsed.userZone && zoneById[parsed.userZone]) {
        setUserZone(parsed.userZone);
        setSelectedZone(parsed.userZone);
        setCrew((current) =>
          current.map((member) =>
            member.id === "you"
              ? {
                  ...member,
                  zone: parsed.userZone!,
                  x: zoneCenter(zoneById[parsed.userZone!]).x,
                  y: zoneCenter(zoneById[parsed.userZone!]).y,
                }
              : member,
          ),
        );
      }
    } catch {
      // ignore broken local state
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        crewName,
        locationSharingEnabled,
        responderModeEnabled,
        userZone,
      }),
    );
  }, [crewName, locationSharingEnabled, responderModeEnabled, userZone]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveClock(new Date());
      setMapPulse((value) => value + 1);
      setCrew((current) =>
        current.map((member) => {
          const zone = zoneById[member.zone];
          const drift = member.id === "you" ? 0.8 : 1.8;
          const nextX = clamp(member.x + (Math.random() * 2 - 1) * drift, zone.x + 2, zone.x + zone.width - 2);
          const nextY = clamp(member.y + (Math.random() * 2 - 1) * drift, zone.y + 2, zone.y + zone.height - 2);
          const nextLastPing = Math.min(member.lastPingMinutes + 1, 45);
          return {
            ...member,
            x: nextX,
            y: nextY,
            lastPingMinutes: member.id === "you" && locationSharingEnabled ? 0 : nextLastPing,
          };
        }),
      );
      setFeed((current) =>
        current.map((item) => ({
          ...item,
          minutesAgo: Math.min(item.minutesAgo + 1, 59),
        })),
      );
    }, 10000);

    return () => window.clearInterval(interval);
  }, [locationSharingEnabled]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const activityTemplates: Array<Omit<FeedItem, "id" | "minutesAgo">> = [
        {
          kind: "activity",
          title: "More movement on back trail",
          detail: "Trail flow is stretching farther out from the main crowd.",
          zone: "back-trail",
        },
        {
          kind: "activity",
          title: "Camp row regrouping",
          detail: "More parked units and social clustering showing up in camp.",
          zone: "camp-row",
        },
        {
          kind: "activity",
          title: "Hill climb drawing a crowd",
          detail: "People are stacking up to watch the hill line.",
          zone: "hill-climb",
        },
        {
          kind: "crew",
          title: "Crew ping dropped",
          detail: "Someone in your crew sent a location check-in.",
          zone: randomFrom(zones).id,
        },
        {
          kind: "system",
          title: "Presence layer updated",
          detail: "Map state refreshed for crews, events, and responder mode.",
          zone: "front-gate",
        },
      ];

      if (helpActive && !helpAccepted) {
        activityTemplates.push({
          kind: "safety",
          title: "Help request still open",
          detail: "Nearby responders are being notified with last known zone and timeline.",
          zone: userZone,
        });
      }

      const next = randomFrom(activityTemplates);
      const newItem: FeedItem = {
        ...next,
        id: `feed-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        minutesAgo: 0,
      };

      setFeed((current) => [newItem, ...current].slice(0, 10));
    }, 18000);

    return () => window.clearInterval(interval);
  }, [helpActive, helpAccepted, userZone]);

  const selectedZoneConfig = zoneById[selectedZone];

  const liveCounts = useMemo(() => {
    const responders = crew.filter((member) => member.role === "responder").length + (responderModeEnabled ? 1 : 0);
    const crewOnline = crew.length;
    const activeZones = new Set(feed.map((item) => item.zone)).size;
    return { responders, crewOnline, activeZones };
  }, [crew, feed, responderModeEnabled]);

  const hotZones = useMemo(() => {
    const counts = new Map<ZoneId, number>();
    feed.forEach((item) => counts.set(item.zone, (counts.get(item.zone) ?? 0) + 1));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([zoneId]) => zoneById[zoneId]);
  }, [feed]);

  function pushFeedItem(item: Omit<FeedItem, "id" | "minutesAgo">) {
    const fullItem: FeedItem = {
      ...item,
      id: `feed-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      minutesAgo: 0,
    };
    setFeed((current) => [fullItem, ...current].slice(0, 10));
    setLastSystemNote(item.title);
  }

  function setYouZone(zoneId: ZoneId) {
    const zone = zoneById[zoneId];
    const center = zoneCenter(zone);

    setUserZone(zoneId);
    setSelectedZone(zoneId);

    setCrew((current) =>
      current.map((member) =>
        member.id === "you"
          ? {
              ...member,
              zone: zoneId,
              x: center.x,
              y: center.y,
              status: "checking-in",
              lastPingMinutes: 0,
            }
          : member,
      ),
    );
  }

  function handlePingHere() {
    const zone = zoneById[userZone];
    const center = zoneCenter(zone);

    setPingFlash(true);
    window.setTimeout(() => setPingFlash(false), 600);

    setCrew((current) =>
      current.map((member) =>
        member.id === "you"
          ? {
              ...member,
              x: center.x,
              y: center.y,
              status: "checking-in",
              lastPingMinutes: 0,
            }
          : member,
      ),
    );

    pushFeedItem({
      kind: "crew",
      title: "You just checked in",
      detail: `Live at ${zone.label}.`,
      zone: userZone,
    });
  }

  function handleShareLocation() {
    if (!("geolocation" in navigator)) {
      pushFeedItem({
        kind: "system",
        title: "Location unavailable",
        detail: "This device does not expose browser geolocation.",
        zone: userZone,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationSharingEnabled(true);
        pushFeedItem({
          kind: "system",
          title: "Live sharing enabled",
          detail: "Your location is now contributing to the presence layer.",
          zone: userZone,
        });
      },
      () => {
        pushFeedItem({
          kind: "system",
          title: "Location permission denied",
          detail: "Manual pings still work even without live location access.",
          zone: userZone,
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 8000 },
    );
  }

  function handleResponderToggle() {
    const next = !responderModeEnabled;
    setResponderModeEnabled(next);

    pushFeedItem({
      kind: "system",
      title: next ? "Responder mode enabled" : "Responder mode disabled",
      detail: next
        ? "You can now be surfaced in nearby help requests."
        : "You are no longer shown as an available responder.",
      zone: userZone,
    });
  }

  function handleHelpNeeded() {
    setHelpActive(true);
    setHelpAccepted(false);

    const responder = crew.find((member) => member.role === "responder") ?? baseCrew.find((member) => member.role === "responder");

    if (responder) {
      setCrew((current) =>
        current.map((member) =>
          member.id === responder.id
            ? {
                ...member,
                zone: userZone,
                x: zoneCenter(zoneById[userZone]).x + 2,
                y: zoneCenter(zoneById[userZone]).y + 2,
                status: "responding",
                lastPingMinutes: 0,
              }
            : member,
        ),
      );
    }

    pushFeedItem({
      kind: "safety",
      title: "Help needed alert sent",
      detail: `Last known zone shared: ${zoneById[userZone].label}. Nearby responders and crew notified.`,
      zone: userZone,
    });

    window.localStorage.setItem(
      EMERGENCY_LOG_KEY,
      JSON.stringify({
        createdAt: new Date().toISOString(),
        zone: userZone,
        timeline: feed.slice(0, 5),
        crew,
        note: "Emergency Presence Relay snapshot captured.",
      }),
    );

    window.setTimeout(() => {
      setHelpAccepted(true);
      pushFeedItem({
        kind: "safety",
        title: "Responder acknowledged",
        detail: `Closest capable responder is moving toward ${zoneById[userZone].label}.`,
        zone: userZone,
      });
    }, 2600);
  }

  function handleJoinCrew() {
    pushFeedItem({
      kind: "crew",
      title: "Crew ready",
      detail: `${crewName} is active on Planet Bamboo.`,
      zone: userZone,
    });
  }

  return (
    <div className="min-h-screen bg-[#06111a] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_24%),linear-gradient(180deg,rgba(10,18,26,0.98),rgba(6,12,18,0.98))] shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/8 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Planet Bamboo
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                    Live map + ping
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    Presence in motion
                  </span>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[44px]">
                  See your people.
                  <br />
                  Feel the environment.
                  <br />
                  Respond faster.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 sm:text-[15px]">
                  HomePlanet turns Plant Bamboo into a live awareness layer. Crews can ping where they are,
                  see active zones, surface nearby response help, and build the timeline that makes motion readable.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[460px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Crew online</div>
                  <div className="mt-2 text-2xl font-semibold">{liveCounts.crewOnline}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Hot zones</div>
                  <div className="mt-2 text-2xl font-semibold">{liveCounts.activeZones}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Responders</div>
                  <div className="mt-2 text-2xl font-semibold">{liveCounts.responders}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Live status</div>
                  <div className="mt-2 text-sm font-semibold text-emerald-200">Awareness active</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[1.35fr_0.8fr]">
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#07131d]">
              <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Live terrain map</div>
                  <div className="mt-1 text-sm text-white/72">
                    Manual pings now. Live location optional. Responder relay ready.
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Local time</div>
                  <div className="mt-1 text-sm font-semibold text-white/85">
                    {liveClock.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <div className="relative h-[560px] overflow-hidden rounded-[24px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.08),transparent_18%),linear-gradient(180deg,#081420,#0b1925)]">
                  <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:36px_36px]" />

                  {pingFlash && (
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute inset-0 animate-ping rounded-[24px] bg-cyan-400/10" />
                    </div>
                  )}

                  <div className="absolute left-0 top-0 h-full w-full">
                    {zones.map((zone) => {
                      const isSelected = selectedZone === zone.id;
                      return (
                        <button
                          key={zone.id}
                          type="button"
                          onClick={() => setSelectedZone(zone.id)}
                          className={`absolute overflow-hidden rounded-[24px] border text-left transition ${
                            isSelected
                              ? "border-white/30 ring-1 ring-cyan-300/40"
                              : "border-white/10 hover:border-white/18"
                          } bg-gradient-to-br ${zone.tone}`}
                          style={{
                            left: `${zone.x}%`,
                            top: `${zone.y}%`,
                            width: `${zone.width}%`,
                            height: `${zone.height}%`,
                          }}
                        >
                          <div className="absolute inset-0 bg-black/18" />
                          <div className="relative z-10 flex h-full flex-col justify-between p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-semibold text-white">{zone.shortLabel}</div>
                              <div className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                                zone
                              </div>
                            </div>
                            <div className="text-[11px] leading-5 text-white/65">{zone.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="absolute inset-0">
                    {crew.map((member) => {
                      const isSelectedMemberZone = member.zone === selectedZone;
                      return (
                        <button
                          key={member.id}
                          type="button"
                          onClick={() => setSelectedZone(member.zone)}
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${member.x}%`, top: `${member.y}%` }}
                        >
                          <div
                            className={`relative flex h-5 w-5 items-center justify-center rounded-full ring-4 ${
                              ringClassByRole(member.role)
                            } ${pulseClassByRole(member.role)} ${
                              isSelectedMemberZone ? "scale-110" : ""
                            } ${member.id === "you" && pingFlash ? "scale-125" : ""} transition-transform duration-200`}
                          >
                            <div
                              className={`absolute inset-[-10px] rounded-full border ${
                                member.role === "responder"
                                  ? "border-rose-300/35"
                                  : member.role === "you"
                                    ? "border-cyan-300/35"
                                    : "border-white/18"
                              } animate-ping`}
                              style={{ animationDuration: `${2.4 + (mapPulse % 3) * 0.2}s` }}
                            />
                          </div>
                          <div className="mt-2 min-w-[88px] rounded-full border border-white/10 bg-[#07131d]/90 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-white/80 backdrop-blur">
                            {member.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                    {hotZones.map((zone) => (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setSelectedZone(zone.id)}
                        className="rounded-full border border-amber-300/18 bg-amber-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-100"
                      >
                        Hot: {zone.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <button
                    type="button"
                    onClick={handlePingHere}
                    className="rounded-2xl border border-cyan-400/22 bg-cyan-500/12 px-4 py-3 text-left transition hover:border-cyan-300/38 hover:bg-cyan-500/16 active:scale-[0.97]"
                  >
                    <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">Action</div>
                    <div className="mt-1 text-base font-semibold text-cyan-100">Ping here</div>
                    <div className="mt-1 text-sm leading-5 text-cyan-50/75">Drop your current position into the crew feed.</div>
                  </button>

                  <button
                    type="button"
                    onClick={handleJoinCrew}
                    className="rounded-2xl border border-emerald-400/22 bg-emerald-500/12 px-4 py-3 text-left transition hover:border-emerald-300/38 hover:bg-emerald-500/16"
                  >
                    <div className="text-[11px] uppercase tracking-[0.22em] text-emerald-200/70">Crew</div>
                    <div className="mt-1 text-base font-semibold text-emerald-100">Join crew</div>
                    <div className="mt-1 text-sm leading-5 text-emerald-50/75">Activate your crew name and start map awareness together.</div>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareLocation}
                    className="rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-left transition hover:border-white/22 hover:bg-white/[0.08]"
                  >
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Location</div>
                    <div className="mt-1 text-base font-semibold text-white">
                      {locationSharingEnabled ? "Live sharing on" : "Share location"}
                    </div>
                    <div className="mt-1 text-sm leading-5 text-white/68">
                      Optional browser location for a stronger presence layer.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={handleHelpNeeded}
                    className="rounded-2xl border border-rose-400/25 bg-rose-500/12 px-4 py-3 text-left transition hover:border-rose-300/42 hover:bg-rose-500/18"
                  >
                    <div className="text-[11px] uppercase tracking-[0.22em] text-rose-200/70">Safety</div>
                    <div className="mt-1 text-base font-semibold text-rose-100">Help needed</div>
                    <div className="mt-1 text-sm leading-5 text-rose-50/75">
                      Capture last-known timeline and notify nearby responders.
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <section className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Crew control</div>
                    <h2 className="mt-1 text-xl font-semibold text-white">{crewName}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleResponderToggle}
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] transition ${
                      responderModeEnabled
                        ? "border-rose-300/28 bg-rose-500/15 text-rose-100"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/18"
                    }`}
                  >
                    {responderModeEnabled ? "Responder on" : "Responder mode"}
                  </button>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-white/40">Crew label</label>
                  <input
                    value={crewName}
                    onChange={(event) => setCrewName(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#08131d] px-4 py-3 text-sm text-white outline-none placeholder:text-white/28 focus:border-cyan-300/30"
                    placeholder="Name your crew"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {zones.map((zone) => {
                    const active = userZone === zone.id;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setYouZone(zone.id)}
                        className={`rounded-2xl border px-3 py-3 text-left transition ${
                          active
                            ? "border-cyan-300/28 bg-cyan-500/12"
                            : "border-white/10 bg-white/5 hover:border-white/18"
                        }`}
                      >
                        <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">Set zone</div>
                        <div className="mt-1 text-sm font-semibold text-white">{zone.shortLabel}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-[#08131d] p-4">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">Last system note</div>
                  <div className="mt-2 text-sm leading-6 text-white/78">{lastSystemNote}</div>
                </div>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Selected zone</div>
                    <h3 className="mt-1 text-xl font-semibold text-white">{selectedZoneConfig.label}</h3>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/60">
                    map focus
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-white/70">{selectedZoneConfig.description}</p>

                <div className="mt-4 space-y-2">
                  {crew
                    .filter((member) => member.zone === selectedZone)
                    .map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#08131d] px-4 py-3"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">{member.name}</div>
                          <div className="mt-1 text-[12px] uppercase tracking-[0.16em] text-white/40">
                            {member.role} • {member.status}
                          </div>
                        </div>
                        <div className="text-right text-sm text-white/65">{formatMinutes(member.lastPingMinutes)}</div>
                      </div>
                    ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">What’s happening now</div>
                    <h3 className="mt-1 text-xl font-semibold text-white">Live activity feed</h3>
                  </div>
                  <div className="rounded-full border border-emerald-300/18 bg-emerald-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                    updating
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {feed.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-[#08131d] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ring-1 ${badgeClassByKind(
                              item.kind,
                            )}`}
                          >
                            {feedLabel(item.kind)}
                          </span>
                          <div className="mt-3 text-sm font-semibold text-white">{item.title}</div>
                          <div className="mt-1 text-sm leading-6 text-white/68">{item.detail}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                            {zoneById[item.zone].shortLabel}
                          </div>
                          <div className="mt-2 text-[12px] text-white/55">{formatMinutes(item.minutesAgo)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(127,29,29,0.22),rgba(10,18,26,0.92))] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-rose-100/55">Emergency relay</div>
                    <h3 className="mt-1 text-xl font-semibold text-white">Presence timeline snapshot</h3>
                  </div>
                  <div
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                      helpActive
                        ? "border-rose-300/24 bg-rose-500/15 text-rose-100"
                        : "border-white/10 bg-white/5 text-white/60"
                    }`}
                  >
                    {helpActive ? "Active" : "Standby"}
                  </div>
                </div>

                <div className="mt-3 text-sm leading-6 text-white/72">
                  If someone cannot communicate, HomePlanet can surface last known zone, recent pings,
                  nearby capable responders, and the short timeline that helps others act faster.
                </div>

                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">Last known zone</div>
                    <div className="mt-2 text-base font-semibold text-white">{zoneById[userZone].label}</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">Timeline state</div>
                    <div className="mt-2 text-sm leading-6 text-white/72">
                      Last ping: {formatMinutes(crew.find((member) => member.id === "you")?.lastPingMinutes ?? 0)}
                      {" · "}
                      Crew label: {crewName}
                      {" · "}
                      Sharing: {locationSharingEnabled ? "enabled" : "manual only"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">Response state</div>
                    <div className="mt-2 text-sm leading-6 text-white/72">
                      {helpActive
                        ? helpAccepted
                          ? "A nearby capable responder has acknowledged the alert and the timeline was captured."
                          : "Help request is live. Nearby crew and responders are being notified now."
                        : "No active help request. Emergency relay is armed as platform infrastructure."}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}