import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import QRCode from "qrcode";

type GuardianProfileType = "child" | "elder" | "pet" | "medical";

type GuardianProfile = {
  id: string;
  type: GuardianProfileType;
  name: string;
  status: "active" | "pending";
  subtitle: string;
  createdAt: string;
};

const PROFILE_TYPE_META: Record<
  GuardianProfileType,
  {
    label: string;
    eyebrow: string;
    description: string;
    chip: string;
  }
> = {
  child: {
    label: "Child Guardian",
    eyebrow: "CHILD SAFETY LAYER",
    description:
      "Create a live child safety layer with pickup clarity, contact context, and safe-zone readiness.",
    chip: "School-safe",
  },
  elder: {
    label: "Elder Guardian",
    eyebrow: "ELDER SAFETY LAYER",
    description:
      "Add an elder profile for presence awareness, last-seen context, and response support when something feels off.",
    chip: "Response-ready",
  },
  pet: {
    label: "Pet Guardian",
    eyebrow: "PET GUARDIAN LAYER",
    description:
      "Set up a pet rescue layer with scan-to-contact, tag visibility, and instant owner context.",
    chip: "Tag-ready",
  },
  medical: {
    label: "Medical Guardian",
    eyebrow: "MEDICAL IDENTITY LAYER",
    description:
      "Prepare an emergency context layer with essential contact and identity details available when needed.",
    chip: "Emergency-ready",
  },
};

function makePresenceId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PG-${stamp}-${random}`;
}

function makeProfileSubtitle(type: GuardianProfileType, safeZone: string, contact: string) {
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

function makeProfileRoute(type: GuardianProfileType, profileId: string) {
  if (type === "child") {
    return `/planet/guardian/public/${profileId}`;
  }

  if (type === "pet") {
    return `/planet/guardian-pet/pet/${profileId}`;
  }

  if (type === "elder") {
    return `/planet/guardian/presence?profile=${profileId}&type=elder`;
  }

  return `/planet/guardian/presence?profile=${profileId}&type=medical`;
}

function buildAbsoluteGuardianLink(path: string) {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }

  return path;
}

export default function GuardianActivationPage() {
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<GuardianProfileType>("child");
  const [ownerName, setOwnerName] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [profileName, setProfileName] = useState("");
  const [safeZone, setSafeZone] = useState("");
  const [notes, setNotes] = useState("");
  const [presenceId, setPresenceId] = useState("");
  const [activatedAt, setActivatedAt] = useState("");
  const [profiles, setProfiles] = useState<GuardianProfile[]>([]);
  const [activationComplete, setActivationComplete] = useState(false);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    const storedPresenceId = localStorage.getItem("guardianPresenceId");
    const storedActivatedAt = localStorage.getItem("guardianActivatedAt");
    const storedProfiles = localStorage.getItem("guardianActivationProfiles");
    const storedOwnerName = localStorage.getItem("guardianOwnerName");
    const storedHouseholdName = localStorage.getItem("guardianHouseholdName");
    const storedContactInfo = localStorage.getItem("guardianContactInfo");

    const nextPresenceId = storedPresenceId || makePresenceId();
    const nextActivatedAt = storedActivatedAt || new Date().toISOString();

    setPresenceId(nextPresenceId);
    setActivatedAt(nextActivatedAt);

    if (!storedPresenceId) {
      localStorage.setItem("guardianPresenceId", nextPresenceId);
    }

    if (!storedActivatedAt) {
      localStorage.setItem("guardianActivatedAt", nextActivatedAt);
    }

    if (storedProfiles) {
      try {
        const parsed = JSON.parse(storedProfiles) as GuardianProfile[];
        const safeProfiles = Array.isArray(parsed) ? parsed : [];
        setProfiles(safeProfiles);
        setActivationComplete(safeProfiles.length > 0);
      } catch {
        setProfiles([]);
        setActivationComplete(false);
      }
    } else {
      setProfiles([]);
      setActivationComplete(false);
    }

    if (storedOwnerName) setOwnerName(storedOwnerName);
    if (storedHouseholdName) setHouseholdName(storedHouseholdName);
    if (storedContactInfo) setContactInfo(storedContactInfo);

    setHasLoadedStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    localStorage.setItem("guardianOwnerName", ownerName);
  }, [ownerName, hasLoadedStorage]);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    localStorage.setItem("guardianHouseholdName", householdName);
  }, [householdName, hasLoadedStorage]);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    localStorage.setItem("guardianContactInfo", contactInfo);
  }, [contactInfo, hasLoadedStorage]);

  useEffect(() => {
    if (!hasLoadedStorage) return;
    localStorage.setItem("guardianActivationProfiles", JSON.stringify(profiles));
  }, [profiles, hasLoadedStorage]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const selectedMeta = PROFILE_TYPE_META[selectedType];

  const counts = useMemo(() => {
    return {
      child: profiles.filter((profile) => profile.type === "child").length,
      elder: profiles.filter((profile) => profile.type === "elder").length,
      pet: profiles.filter((profile) => profile.type === "pet").length,
      medical: profiles.filter((profile) => profile.type === "medical").length,
    };
  }, [profiles]);

  const readyForSubmit =
    ownerName.trim().length > 0 &&
    contactInfo.trim().length > 0 &&
    profileName.trim().length > 0;

  const latestProfile = profiles[0] || null;
  const latestProfileRoute = latestProfile
    ? makeProfileRoute(latestProfile.type, latestProfile.id)
    : "";
  const latestProfileLink = latestProfile
    ? buildAbsoluteGuardianLink(latestProfileRoute)
    : "";

  useEffect(() => {
    let cancelled = false;

    async function buildQr() {
      if (!latestProfileLink) {
        setQrDataUrl("");
        return;
      }

      try {
        const dataUrl = await QRCode.toDataURL(latestProfileLink, {
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
  }, [latestProfileLink]);

  async function handleCopyLink() {
    if (!latestProfileLink) return;

    try {
      await navigator.clipboard.writeText(latestProfileLink);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function handleOpenGeneratedLink() {
    if (!latestProfileRoute) return;
    navigate(latestProfileRoute);
  }

  async function handleAddProfile() {
    if (!readyForSubmit) return;

    const nextProfile: GuardianProfile = {
      id: `${selectedType}-${Date.now()}`,
      type: selectedType,
      name: profileName.trim(),
      status: "active",
      subtitle: makeProfileSubtitle(selectedType, safeZone.trim(), contactInfo.trim()),
      createdAt: new Date().toISOString(),
    };

    const updatedProfiles = [nextProfile, ...profiles];

    setProfiles(updatedProfiles);
    setActivationComplete(true);

    if (hasLoadedStorage) {
      localStorage.setItem("guardianActivationProfiles", JSON.stringify(updatedProfiles));
    }

    if (selectedType === "child") {
      try {
        const { error } = await supabase.from("guardian_children").upsert(
          {
            id: nextProfile.id,
            name: nextProfile.name,
            type: nextProfile.type,
            safe_zone: safeZone.trim(),
            contact: contactInfo.trim(),
            owner_name: ownerName.trim(),
            household_name: householdName.trim(),
            notes: notes.trim(),
            subtitle: nextProfile.subtitle,
            status: nextProfile.status,
            created_at: nextProfile.createdAt,
            is_demo: true,
          },
          {
            onConflict: "id",
          },
        );

        if (error) {
          console.warn("Guardian child save failed:", error.message);
        }
      } catch (error) {
        console.warn("Guardian child save failed:", error);
      }
    }

    setProfileName("");
    setSafeZone("");
    setNotes("");
  }

  function handleContinueToHousehold() {
    navigate("/planet/guardian-household");
  }

  function handleOpenGuardianHome() {
    navigate("/planet/guardian");
  }

  function handleOpenBellaDemo() {
    navigate("/planet/guardian-pet/pet/bella-demo");
  }

  return (
    <div className="min-h-screen bg-[#020611] text-white">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <div className="rounded-[28px] border border-emerald-500/20 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_rgba(2,6,17,0.96)_42%)] p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.05),0_18px_60px_rgba(0,0,0,0.45)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                  Guardian Activated
                </span>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                  Presence First
                </span>
              </div>

              <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                Your Guardian system is live. Now set up who matters.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                This is the activation bridge. The moment payment completes, Guardian should feel
                real instantly: presence created, household ready, and next action clear.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {(
                  [
                    { key: "child", label: "Child Guardian", value: counts.child },
                    { key: "elder", label: "Elder Guardian", value: counts.elder },
                    { key: "pet", label: "Pet Guardian", value: counts.pet },
                    { key: "medical", label: "Medical Guardian", value: counts.medical },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      Active profiles created during this activation.
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-black/25 p-5">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                Activation status
              </div>
              <div className="mt-3 text-xl font-semibold text-white">System ready</div>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-emerald-200">
                    Presence ID
                  </div>
                  <div className="mt-1 font-medium text-white">{presenceId || "Preparing..."}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                    Activated at
                  </div>
                  <div className="mt-1 font-medium text-white">
                    {activatedAt
                      ? new Date(activatedAt).toLocaleString()
                      : "Creating activation timestamp..."}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                    Next move
                  </div>
                  <div className="mt-1 text-white">
                    Add the first person, pet, or medical profile to complete the live handoff.
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleContinueToHousehold}
                  className="rounded-2xl border border-emerald-400/25 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Open household board
                </button>
                <button
                  type="button"
                  onClick={handleOpenGuardianHome}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  View Guardian home
                </button>
              </div>
            </div>
          </div>
        </div>

        {activationComplete ? (
          <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-50 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
            <div className="text-[10px] uppercase tracking-[0.24em] text-emerald-200">
              Activation confirmed
            </div>
            <div className="mt-2 text-lg font-semibold text-white">
              Guardian is now active with at least one live profile.
            </div>
            <div className="mt-1 text-sm text-emerald-100/90">
              Next step after this page: generate the shareable link / QR experience. That is the
              second build step right after this.
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#06101f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                  Set up who matters
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Create the first Guardian layer
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                  Keep this fast. No friction. The buyer should feel the system responding the
                  second they land here.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {(Object.keys(PROFILE_TYPE_META) as GuardianProfileType[]).map((type) => {
                const meta = PROFILE_TYPE_META[type];
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
                        {meta.eyebrow}
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] font-medium text-slate-300">
                        {meta.chip}
                      </span>
                    </div>
                    <div className="mt-3 text-lg font-semibold text-white">{meta.label}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">
                      {meta.description}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                {selectedMeta.eyebrow}
              </div>
              <div className="mt-2 text-xl font-semibold text-white">{selectedMeta.label}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{selectedMeta.description}</div>

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
                    placeholder={
                      selectedType === "child"
                        ? "Lucas"
                        : selectedType === "elder"
                          ? "Grandpa Joe"
                          : selectedType === "pet"
                            ? "Bella"
                            : "Medical profile"
                    }
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Safe zone / anchor location
                  </div>
                  <input
                    value={safeZone}
                    onChange={(event) => setSafeZone(event.target.value)}
                    placeholder={
                      selectedType === "child"
                        ? "School dismissal zone"
                        : selectedType === "elder"
                          ? "Living room"
                          : selectedType === "pet"
                            ? "Home base"
                            : "Primary hospital"
                    }
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
                  onClick={handleAddProfile}
                  disabled={!readyForSubmit}
                  className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add {selectedMeta.label}
                </button>

                <button
                  type="button"
                  onClick={handleContinueToHousehold}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Continue to household board
                </button>
              </div>

              {!readyForSubmit ? (
                <div className="mt-3 text-xs text-slate-400">
                  Enter owner name, primary contact, and a name to protect to activate the first
                  layer.
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#06101f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:p-6">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                Activation summary
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Live handoff status</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                This is what the buyer should feel right after purchase: not waiting, not guessing,
                already moving.
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
                    Next build step
                  </div>
                  <div className="mt-1 text-base font-semibold text-white">
                    Public demo share panel
                  </div>
                  <div className="mt-1 text-sm text-cyan-50/80">
                    Once a profile is added, Guardian generates a public-facing demo link and QR
                    that feels intentional, clear, and ready to scan.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#06101f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    Profiles created
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Guardian roster</h2>
                </div>

                <button
                  type="button"
                  onClick={handleOpenBellaDemo}
                  className="rounded-2xl border border-emerald-400/25 bg-emerald-500/12 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Open Bella demo
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {profiles.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
                    No profiles added yet. Add the first child, elder, pet, or medical profile to
                    complete the activation handoff.
                  </div>
                ) : (
                  profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                            {PROFILE_TYPE_META[profile.type].eyebrow}
                          </div>
                          <div className="mt-1 text-lg font-semibold text-white">
                            {profile.name}
                          </div>
                          <div className="mt-1 text-sm text-slate-300">{profile.subtitle}</div>
                        </div>

                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                          {profile.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-emerald-500/15 bg-[#06101f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-emerald-200">
                    Public demo share
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {latestProfile
                      ? `${latestProfile.name} is ready to share`
                      : "Waiting for first profile"}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    This creates the public-facing Guardian demo moment: one clean link, one clean
                    QR, and a scan experience that feels ready instead of internal.
                  </p>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Demo-safe
                </div>
              </div>

              {latestProfile ? (
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
                        {latestProfile.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-300">
                        {PROFILE_TYPE_META[latestProfile.type].label} • {latestProfile.subtitle}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-100">
                        Public share link
                      </div>
                      <div className="mt-2 break-all rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white">
                        {latestProfileLink}
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
                          onClick={handleOpenGeneratedLink}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                        >
                          Open link
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                        Why this matters
                      </div>
                      <div className="mt-2 text-sm leading-7 text-slate-300">
                        The person scanning should feel like they opened a clean Guardian page on
                        purpose. No internal-tool confusion. No awkward handoff. Just a clear,
                        public-facing demo moment.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
                  Add the first Guardian profile to generate the public demo share link and QR
                  panel.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}