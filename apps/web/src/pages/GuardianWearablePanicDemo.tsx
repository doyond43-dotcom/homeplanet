import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type PanicProfileType = "child" | "elder" | "pet" | "medical" | "mixed";

type NearbySignal = {
  id: string;
  label: string;
  distance: string;
  type: "car" | "business" | "house" | "sound";
};

type GuardianPanicState = {
  guardianProfile?: {
    name?: string;
    type?: PanicProfileType;
    status?: string;
    label?: string;
    locationLabel?: string;
    notes?: string;
    contactName?: string;
    contactRelation?: string;
    contactPhone?: string;
    wearerPhone?: string;
    homeBase?: string;
    destination?: string;
    destinationPhone?: string;
    routeState?: string;
    pairedDeviceName?: string;
    isPaired?: boolean;
  };
};

const DEMO_SIGNALS: NearbySignal[] = [
  { id: "sig-1", label: "Car alarm", distance: "Approx 120 ft", type: "car" },
  { id: "sig-2", label: "Business alarm", distance: "Approx 300 ft", type: "business" },
  { id: "sig-3", label: "House alarm", distance: "Approx 450 ft", type: "house" },
  { id: "sig-4", label: "Loud sound spike", distance: "Approx nearby", type: "sound" },
];

function buildIncidentId() {
  return `panic-${Date.now()}`;
}

function formatStartedAt(date: Date) {
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildGuardianNotes(profile?: GuardianPanicState["guardianProfile"]) {
  if (!profile) return "";

  const lines = [
    profile.notes || "",
    profile.status ? `Guardian status: ${profile.status}` : "",
    profile.contactName
      ? `Primary contact: ${profile.contactName}${profile.contactRelation ? ` (${profile.contactRelation})` : ""}`
      : "",
    profile.contactPhone ? `Contact phone: ${profile.contactPhone}` : "",
    profile.wearerPhone ? `Wearer phone: ${profile.wearerPhone}` : "",
    profile.homeBase ? `Home base: ${profile.homeBase}` : "",
    profile.destination ? `Destination: ${profile.destination}` : "",
    profile.destinationPhone ? `Destination phone: ${profile.destinationPhone}` : "",
    profile.routeState ? `Route state: ${profile.routeState}` : "",
    profile.isPaired ? `Paired device: ${profile.pairedDeviceName || "Linked"}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return lines;
}

export default function GuardianWearablePanicDemo() {
  const navigate = useNavigate();
  const location = useLocation();

  const navState = (location.state as GuardianPanicState | null) ?? null;
  const guardianProfile = navState?.guardianProfile;

  const [profileName, setProfileName] = useState("Haley");
  const [profileType, setProfileType] = useState<PanicProfileType>("child");
  const [locationLabel, setLocationLabel] = useState("Okeechobee, FL");
  const [notes, setNotes] = useState("");
  const [selectedSignals, setSelectedSignals] = useState<string[]>(["sig-1", "sig-4"]);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (!guardianProfile) return;

    if (guardianProfile.name?.trim()) {
      setProfileName(guardianProfile.name.trim());
    }

    if (guardianProfile.type) {
      setProfileType(guardianProfile.type);
    }

    if (guardianProfile.locationLabel?.trim()) {
      setLocationLabel(guardianProfile.locationLabel.trim());
    }

    const builtNotes = buildGuardianNotes(guardianProfile);
    if (builtNotes.trim()) {
      setNotes(builtNotes);
    }
  }, [guardianProfile]);

  const startedPreview = useMemo(() => formatStartedAt(new Date()), []);
  const chosenSignals = useMemo(
    () => DEMO_SIGNALS.filter((signal) => selectedSignals.includes(signal.id)),
    [selectedSignals],
  );

  function toggleSignal(id: string) {
    setSelectedSignals((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  function handleActivatePanic() {
    setActivating(true);

    const incidentId = buildIncidentId();
    const startedAt = new Date();
    const startedAtIso = startedAt.toISOString();

    const payload = {
      incidentId,
      status: "active",
      profile: {
        name: profileName.trim() || "Guardian Protected Profile",
        type: profileType,
        label: guardianProfile?.label || "",
        status: guardianProfile?.status || "",
        contactName: guardianProfile?.contactName || "",
        contactRelation: guardianProfile?.contactRelation || "",
        contactPhone: guardianProfile?.contactPhone || "",
        wearerPhone: guardianProfile?.wearerPhone || "",
        homeBase: guardianProfile?.homeBase || "",
        destination: guardianProfile?.destination || "",
        destinationPhone: guardianProfile?.destinationPhone || "",
        routeState: guardianProfile?.routeState || "",
        pairedDeviceName: guardianProfile?.pairedDeviceName || "",
        isPaired: guardianProfile?.isPaired || false,
      },
      startedAt: startedAtIso,
      startedAtLabel: formatStartedAt(startedAt),
      locationLabel: locationLabel.trim() || "Location updating...",
      notes: notes.trim(),
      nearbySignals: chosenSignals,
      timeline: [
        {
          id: `evt-${Date.now()}-1`,
          type: "trigger",
          title: "Panic triggered",
          detail: "Guardian Panic Mode manually activated.",
          createdAt: startedAtIso,
        },
        {
          id: `evt-${Date.now()}-2`,
          type: "presence",
          title: "Presence locked",
          detail: "Origin event captured and timestamped.",
          createdAt: startedAtIso,
        },
        {
          id: `evt-${Date.now()}-3`,
          type: "location",
          title: "Initial location captured",
          detail: locationLabel.trim() || "Location updating...",
          createdAt: startedAtIso,
        },
        ...(guardianProfile?.contactName
          ? [
              {
                id: `evt-${Date.now()}-4`,
                type: "message",
                title: "Guardian contact linked",
                detail: `${guardianProfile.contactName}${guardianProfile.contactRelation ? ` (${guardianProfile.contactRelation})` : ""}`,
                createdAt: startedAtIso,
              },
            ]
          : []),
        ...chosenSignals.map((signal, index) => ({
          id: `evt-${Date.now()}-sig-${index}`,
          type: "signal",
          title: `${signal.label} detected`,
          detail: signal.distance,
          createdAt: startedAtIso,
        })),
      ],
    };

    try {
      localStorage.setItem(`guardian-panic:${incidentId}`, JSON.stringify(payload));
      navigate(`/planet/guardian/panic/${incidentId}`);
    } catch (error) {
      console.error("Unable to create Guardian Panic incident.", error);
      setActivating(false);
    }
  }

  const guardianContextCards = useMemo(() => {
    if (!guardianProfile) return [];

    return [
      {
        label: "Guardian status",
        value: guardianProfile.status || "Active",
      },
      {
        label: "Primary contact",
        value: guardianProfile.contactName || "Not available",
      },
      {
        label: "Route / state",
        value: guardianProfile.routeState || guardianProfile.label || "Monitoring",
      },
      {
        label: "Device link",
        value: guardianProfile.isPaired
          ? guardianProfile.pairedDeviceName || "Paired"
          : "Not paired",
      },
    ];
  }, [guardianProfile]);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-red-500/30 bg-white/[0.03] shadow-[0_0_40px_rgba(255,60,60,0.12)]">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-red-200">
                  Guardian Panic Mode
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Panic activation console
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
                    Capture the origin moment, lock presence instantly, and route into a live incident board.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Status</div>
                  <div className="mt-2 text-sm font-medium text-red-200">Ready to activate</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Mode</div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {guardianProfile ? "Guardian linked" : "Manual trigger"}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Started preview</div>
                  <div className="mt-2 text-sm font-medium text-white">{startedPreview}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-5">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
                <h2 className="text-lg font-semibold">Protected profile</h2>
                <p className="mt-1 text-sm text-white/60">
                  {guardianProfile
                    ? "Live Guardian profile data has been carried into Panic Mode."
                    : "Start with the essential details so nearby responders and family members immediately understand the situation."}
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                      Name
                    </span>
                    <input
                      value={profileName}
                      onChange={(event) => setProfileName(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400/40 focus:bg-black/40"
                      placeholder="Haley"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                      Protection type
                    </span>
                    <select
                      value={profileType}
                      onChange={(event) => setProfileType(event.target.value as PanicProfileType)}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400/40 focus:bg-black/40"
                    >
                      <option value="child">Child</option>
                      <option value="elder">Elder</option>
                      <option value="pet">Pet</option>
                      <option value="medical">Medical</option>
                      <option value="mixed">Mixed</option>
                    </select>
                  </label>

                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                      Initial location
                    </span>
                    <input
                      value={locationLabel}
                      onChange={(event) => setLocationLabel(event.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400/40 focus:bg-black/40"
                      placeholder="Okeechobee, FL"
                    />
                  </label>

                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/45">
                      Incident notes
                    </span>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      rows={6}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400/40 focus:bg-black/40"
                      placeholder="Describe what happened or what responders should know."
                    />
                  </label>
                </div>
              </div>

              {guardianProfile && guardianContextCards.length > 0 && (
                <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-900/10 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">Guardian-linked context</h2>
                      <p className="mt-1 text-sm text-white/60">
                        This incident is preloaded from the live Guardian profile.
                      </p>
                    </div>
                    <div className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                      Live carry-through
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {guardianContextCards.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                      >
                        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                          {item.label}
                        </div>
                        <div className="mt-2 text-sm font-medium text-white">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Nearby signal layer</h2>
                    <p className="mt-1 text-sm text-white/60">
                      Nearby safety signals help provide immediate context during an active Guardian incident.
                    </p>
                  </div>
                  <div className="rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200">
                    Your idea locked in
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {DEMO_SIGNALS.map((signal) => {
                    const active = selectedSignals.includes(signal.id);

                    return (
                      <button
                        key={signal.id}
                        type="button"
                        onClick={() => toggleSignal(signal.id)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                          active
                            ? "border-red-400/35 bg-red-500/10 shadow-[0_0_25px_rgba(255,80,80,0.12)]"
                            : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium text-white">{signal.label}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/45">
                            {signal.distance}
                          </div>
                        </div>
                        <div
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                            active ? "bg-red-400/20 text-red-100" : "bg-white/10 text-white/60"
                          }`}
                        >
                          {active ? "Included" : "Add"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <aside className="space-y-5">
              <div className="rounded-[24px] border border-red-500/30 bg-[radial-gradient(circle_at_top,rgba(255,80,80,0.18),rgba(5,8,22,0.95)_60%)] p-5 shadow-[0_0_40px_rgba(255,60,60,0.14)]">
                <div className="inline-flex items-center rounded-full border border-red-300/25 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-100">
                  Ready state preview
                </div>

                <div className="mt-4 space-y-3">
                  <h2 className="text-2xl font-semibold tracking-tight">Panic can take over instantly</h2>
                  <p className="text-sm leading-6 text-white/72">
                    On activation, Guardian locks the origin moment, builds the incident timeline, and routes into a live board.
                  </p>
                </div>

                <div className="mt-5 space-y-3 rounded-[22px] border border-white/10 bg-black/25 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.22em] text-white/45">Protected name</span>
                    <span className="text-sm font-medium text-white">{profileName || "Guardian profile"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.22em] text-white/45">Type</span>
                    <span className="text-sm font-medium capitalize text-white">{profileType}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs uppercase tracking-[0.22em] text-white/45">Signals selected</span>
                    <span className="text-sm font-medium text-white">{chosenSignals.length}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="text-xs uppercase tracking-[0.22em] text-white/45">Location preview</div>
                    <div className="mt-2 text-sm font-medium text-white">
                      {locationLabel || "Location updating..."}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleActivatePanic}
                  disabled={activating}
                  className="mt-5 w-full rounded-[22px] border border-red-300/25 bg-red-500/90 px-5 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:scale-[1.01] hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {activating ? "Activating panic..." : "Activate panic mode"}
                </button>

                <p className="mt-3 text-center text-xs text-white/45">
                  This incident remains active locally so nearby updates and responder context stay immediately available.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-white/70">
                  What this page does
                </h3>

                <div className="mt-4 space-y-3">
                  {[
                    "Captures the panic origin moment",
                    "Builds an instant incident payload",
                    "Carries nearby signal context forward",
                    "Routes to a live incident board",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/78"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

