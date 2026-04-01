import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import QRCode from "qrcode";

type GuardianProfileType = "child" | "elder" | "pet" | "medical";

type CreatedGuardianProfile = {
  id: string;
  type: GuardianProfileType;
  name: string;
  subtitle: string;
  createdAt: string;
};

const PROFILE_META: Record<
  GuardianProfileType,
  {
    eyebrow: string;
    label: string;
    chip: string;
    description: string;
    safeZoneLabel: string;
    safeZonePlaceholder: string;
    defaultNamePlaceholder: string;
  }
> = {
  child: {
    eyebrow: "CHILD SAFETY LAYER",
    label: "Child Guardian",
    chip: "School-safe",
    description:
      "Create the first child safety layer with pickup clarity, contact context, and safe-zone readiness.",
    safeZoneLabel: "Primary location",
    safeZonePlaceholder: "Home, school, or usual area",
    defaultNamePlaceholder: "Haley",
  },
  elder: {
    eyebrow: "ELDER SAFETY LAYER",
    label: "Elder Guardian",
    chip: "Response-ready",
    description:
      "Create an elder safety layer with presence awareness, check-in context, and response support.",
    safeZoneLabel: "Primary place / anchor location",
    safeZonePlaceholder: "Living room",
    defaultNamePlaceholder: "Grandpa Joe",
  },
  pet: {
    eyebrow: "PET GUARDIAN LAYER",
    label: "Pet Guardian",
    chip: "Tag-ready",
    description:
      "Create a pet rescue layer with QR visibility, scan-to-contact readiness, and home-base context.",
    safeZoneLabel: "Home base / rescue anchor",
    safeZonePlaceholder: "Home base",
    defaultNamePlaceholder: "Bella",
  },
  medical: {
    eyebrow: "MEDICAL IDENTITY LAYER",
    label: "Medical Guardian",
    chip: "Emergency-ready",
    description:
      "Create a medical protection layer with identity context and emergency contact readiness.",
    safeZoneLabel: "Primary care location",
    safeZonePlaceholder: "Primary hospital",
    defaultNamePlaceholder: "Medical profile",
  },
};

function makePresenceId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PG-${stamp}-${random}`;
}

function makeProfileId(type: GuardianProfileType) {
  return `${type}-${Date.now()}`;
}

function makeProfileSubtitle(
  type: GuardianProfileType,
  safeZone: string,
  contact: string,
) {
  if (type === "child") {
    return safeZone
      ? `Safe zone: ${safeZone}`
      : contact
        ? `Primary contact: ${contact}`
        : "Pickup clarity and safe-zone readiness";
  }

  if (type === "elder") {
    return safeZone
      ? `Primary place: ${safeZone}`
      : contact
        ? `Primary contact: ${contact}`
        : "Presence awareness and response support";
  }

  if (type === "pet") {
    return safeZone
      ? `Home base: ${safeZone}`
      : contact
        ? `Owner contact: ${contact}`
        : "Scan-to-contact rescue layer";
  }

  return contact
    ? `Emergency contact: ${contact}`
    : "Identity and emergency context ready";
}

function makePublicRoute(type: GuardianProfileType, profileId: string) {
  if (type === "pet") return `/planet/guardian-pet/pet/${profileId}`;
  if (type === "child") return `/planet/guardian/public/${profileId}`;
  if (type === "elder") return `/planet/guardian/presence?profile=${profileId}&type=elder`;
  return `/planet/guardian/presence?profile=${profileId}&type=medical`;
}

function buildAbsoluteGuardianLink(path: string) {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }

  return path;
}

export default function GuardianOnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedType, setSelectedType] = useState<GuardianProfileType>("child");
  const [ownerName, setOwnerName] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [profileName, setProfileName] = useState("");
  const [safeZone, setSafeZone] = useState("");
  const [notes, setNotes] = useState("");

  const [presenceId, setPresenceId] = useState("");
  const [createdProfile, setCreatedProfile] = useState<CreatedGuardianProfile | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const plan = searchParams.get("plan") || "household";
  const meta = PROFILE_META[selectedType];

  const publicRoute = createdProfile ? makePublicRoute(createdProfile.type, createdProfile.id) : "";
  const publicLink = createdProfile ? buildAbsoluteGuardianLink(publicRoute) : "";

  useEffect(() => {
    const storedPresenceId = localStorage.getItem("guardianPresenceId");
    const nextPresenceId = storedPresenceId || makePresenceId();

    setPresenceId(nextPresenceId);

    if (!storedPresenceId) {
      localStorage.setItem("guardianPresenceId", nextPresenceId);
    }

    const storedOwnerName = localStorage.getItem("guardianOwnerName") || "";
    const storedHouseholdName = localStorage.getItem("guardianHouseholdName") || "";
    const storedContactInfo = localStorage.getItem("guardianContactInfo") || "";

    setOwnerName(storedOwnerName);
    setHouseholdName(storedHouseholdName);
    setContactInfo(storedContactInfo);

    const protectionType = searchParams.get("protectionType");
    if (
      protectionType === "child" ||
      protectionType === "elder" ||
      protectionType === "pet" ||
      protectionType === "medical"
    ) {
      setSelectedType(protectionType);
    }
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    async function buildQr() {
      if (!publicLink) {
        setQrDataUrl("");
        return;
      }

      try {
        const dataUrl = await QRCode.toDataURL(publicLink, {
          width: 220,
          margin: 1,
          errorCorrectionLevel: "M",
        });

        if (!cancelled) {
          setQrDataUrl(dataUrl);
        }
      } catch {
        if (!cancelled) {
          setQrDataUrl("");
        }
      }
    }

    buildQr();

    return () => {
      cancelled = true;
    };
  }, [publicLink]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const readyForCreate =
    ownerName.trim().length > 0 &&
    contactInfo.trim().length > 0 &&
    profileName.trim().length > 0;

  const planLabel = useMemo(() => {
    return plan === "solo" ? "Solo Guardian" : "Household Guardian";
  }, [plan]);

  function handleCreateLayer() {
    if (!readyForCreate) return;

    const nextProfile: CreatedGuardianProfile = {
      id: makeProfileId(selectedType),
      type: selectedType,
      name: profileName.trim(),
      subtitle: makeProfileSubtitle(selectedType, safeZone.trim(), contactInfo.trim()),
      createdAt: new Date().toISOString(),
    };

    const existingProfilesRaw = localStorage.getItem("guardianActivationProfiles");
    let existingProfiles: CreatedGuardianProfile[] = [];

    if (existingProfilesRaw) {
      try {
        const parsed = JSON.parse(existingProfilesRaw) as CreatedGuardianProfile[];
        existingProfiles = Array.isArray(parsed) ? parsed : [];
      } catch {
        existingProfiles = [];
      }
    }

    const updatedProfiles = [nextProfile, ...existingProfiles];

    localStorage.setItem("guardianActivationProfiles", JSON.stringify(updatedProfiles));
    localStorage.setItem("guardianOwnerName", ownerName.trim());
    localStorage.setItem("guardianHouseholdName", householdName.trim());
    localStorage.setItem("guardianContactInfo", contactInfo.trim());

    setCreatedProfile(nextProfile);
  }

  async function handleCopyLink() {
    if (!publicLink) return;

    try {
      await navigator.clipboard.writeText(publicLink);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function handleOpenPublicLink() {
    if (!publicRoute) return;
    navigate(publicRoute);
  }

  function handleEnterGuardianDashboard() {
    localStorage.setItem("guardianOwnerName", ownerName.trim());
    localStorage.setItem("guardianHouseholdName", householdName.trim());
    localStorage.setItem("guardianContactInfo", contactInfo.trim());

    const params = new URLSearchParams({
      plan,
      protectionType: selectedType,
      ownerName: ownerName.trim(),
      householdName: householdName.trim(),
      phone: contactInfo.trim(),
    });

    navigate(`/planet/guardian/activate?${params.toString()}`);
  }

  return (
    <div className="min-h-screen bg-[#020611] text-white">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <div className="rounded-[30px] border border-emerald-500/18 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_rgba(2,6,17,0.96)_38%)] p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.05),0_22px_70px_rgba(0,0,0,0.5)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                  Guardian onboarding
                </span>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                  First live layer
                </span>
              </div>

              <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                Add the first person who matters.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                This is the real Guardian start. Do not dump the user into a dashboard cold. Let them
                create the first safety layer, see the share moment, and then enter the live system.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Plan
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">{planLabel}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    Guardian system ready to build from.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Presence ID
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {presenceId || "Preparing..."}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Presence-first origin locked.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Next move
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">Create first layer</div>
                  <div className="mt-1 text-xs text-slate-400">
                    Add a child, elder, pet, or medical layer now.
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-black/25 p-5">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                Why this page exists
              </div>
              <div className="mt-3 text-xl font-semibold text-white">
                Guardian should feel real before dashboard.
              </div>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-emerald-500/18 bg-emerald-500/10 p-4">
                  The first protected profile is the emotional anchor of the product.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  After creation, Guardian shows the QR / share moment so the system feels alive.
                </div>
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                  Then the user enters the live dashboard with real context already carried forward.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#06101f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:p-6">
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
              Set up who matters
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-white">Create the first Guardian layer</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
              This should be the first real act inside Guardian. Calm. Clear. Structured.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {(Object.keys(PROFILE_META) as GuardianProfileType[]).map((type) => {
                const item = PROFILE_META[type];
                const active = selectedType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`rounded-[22px] border p-4 text-left transition ${
                      active
                        ? "border-emerald-400/35 bg-emerald-500/12 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                        {item.eyebrow}
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-medium text-slate-300">
                        {item.chip}
                      </span>
                    </div>

                    <div className="mt-3 text-lg font-semibold text-white">{item.label}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">{item.description}</div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                {meta.eyebrow}
              </div>
              <div className="mt-2 text-xl font-semibold text-white">{meta.label}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{meta.description}</div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Owner name
                  </div>
                  <input
                    value={ownerName}
                    onChange={(event) => setOwnerName(event.target.value)}
                    placeholder="Daniel Doyon"
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Household name
                  </div>
                  <input
                    value={householdName}
                    onChange={(event) => setHouseholdName(event.target.value)}
                    placeholder="Doyon Household"
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Primary contact
                  </div>
                  <input
                    value={contactInfo}
                    onChange={(event) => setContactInfo(event.target.value)}
                    placeholder="Phone or email"
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Name to protect
                  </div>
                  <input
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    placeholder={meta.defaultNamePlaceholder}
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    {meta.safeZoneLabel}
                  </div>
                  <input
                    value={safeZone}
                    onChange={(event) => setSafeZone(event.target.value)}
                    placeholder={meta.safeZonePlaceholder}
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Notes
                  </div>
                  <input
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Optional setup notes"
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCreateLayer}
                  disabled={!readyForCreate}
                  className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Create {meta.label}
                </button>

                <button
                  type="button"
                  onClick={handleEnterGuardianDashboard}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Continue to activation
                </button>
              </div>

              {!readyForCreate ? (
                <div className="mt-3 text-xs text-slate-400">
                  Enter owner name, primary contact, and a name to protect to build the first layer.
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#06101f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:p-6">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                Onboarding summary
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">First layer handoff</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                This should feel like the beginning of a real Guardian system, not a dead-end form.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                    Household
                  </div>
                  <div className="mt-1 text-base font-semibold text-white">
                    {householdName.trim() || "Household pending name"}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    Owner: {ownerName.trim() || "Not set yet"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                    Primary contact
                  </div>
                  <div className="mt-1 text-base font-semibold text-white">
                    {contactInfo.trim() || "No contact entered yet"}
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-100">
                    What happens next
                  </div>
                  <div className="mt-1 text-base font-semibold text-white">
                    QR / share moment first
                  </div>
                  <div className="mt-1 text-sm text-cyan-50/80">
                    Build the first protected profile, see the clean public share moment, then enter
                    the activation handoff before the live Guardian dashboard.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-emerald-500/15 bg-[#06101f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-emerald-200">
                    Public demo share
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {createdProfile
                      ? `${createdProfile.name} is ready to share`
                      : "Waiting for first profile"}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    This is the holy-shit moment. One clean profile. One clean link. One clean QR.
                  </p>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Demo-safe
                </div>
              </div>

              {createdProfile ? (
                <div className="mt-5 grid gap-5 xl:grid-cols-[180px_minmax(0,1fr)]">
                  <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <div className="mb-3 text-[10px] uppercase tracking-[0.22em] text-slate-400">
                      Scan preview
                    </div>

                    <div className="mx-auto flex h-[140px] w-[140px] items-center justify-center rounded-[18px] border border-white/10 bg-white p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="Guardian QR code"
                          className="h-[124px] w-[124px] rounded-[10px]"
                        />
                      ) : (
                        <div className="flex h-[124px] w-[124px] items-center justify-center rounded-[10px] bg-slate-100 text-[11px] text-slate-500">
                          Building QR...
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-center text-xs text-slate-400">Scannable QR</div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                        Public demo profile
                      </div>
                      <div className="mt-1 text-lg font-semibold text-white">
                        {createdProfile.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-300">
                        {PROFILE_META[createdProfile.type].label} • {createdProfile.subtitle}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-100">
                        Public share link
                      </div>
                      <div className="mt-2 break-all rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white">
                        {publicLink}
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                        >
                          {copied ? "Copied" : "Copy link"}
                        </button>

                        <button
                          type="button"
                          onClick={handleOpenPublicLink}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                        >
                          Open link
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleEnterGuardianDashboard}
                      className="w-full rounded-2xl border border-cyan-400/25 bg-cyan-500/12 px-5 py-4 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/18"
                    >
                      Continue to activation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
                  Create the first Guardian layer to unlock the QR, share link, and clean entry into
                  the activation handoff.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

