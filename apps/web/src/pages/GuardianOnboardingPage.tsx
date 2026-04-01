import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type GuardianProfileType = "child" | "elder" | "pet" | "medical";

type ProtectedMember = {
  id: string;
  type: GuardianProfileType;
  name: string;
  location: string;
  notes: string;
};

const MEMBER_META: Record<
  GuardianProfileType,
  {
    eyebrow: string;
    label: string;
    chip: string;
    description: string;
    locationLabel: string;
    locationPlaceholder: string;
    defaultNamePlaceholder: string;
  }
> = {
  child: {
    eyebrow: "CHILD SAFETY LAYER",
    label: "Child Guardian",
    chip: "Protected",
    description:
      "Add a child into the protected Guardian layer with real identity, contact context, and location awareness.",
    locationLabel: "Primary location",
    locationPlaceholder: "Home, school, or usual area",
    defaultNamePlaceholder: "Haley",
  },
  elder: {
    eyebrow: "ELDER SAFETY LAYER",
    label: "Elder Guardian",
    chip: "Protected",
    description:
      "Add an elder into the protected Guardian layer with presence context, response clarity, and support readiness.",
    locationLabel: "Primary location",
    locationPlaceholder: "Home or usual area",
    defaultNamePlaceholder: "Grandpa Joe",
  },
  pet: {
    eyebrow: "PET GUARDIAN LAYER",
    label: "Pet Guardian",
    chip: "Protected",
    description:
      "Add a pet into the protected Guardian layer with home-base context, scan readiness, and rescue visibility.",
    locationLabel: "Home base",
    locationPlaceholder: "Home base or usual area",
    defaultNamePlaceholder: "Bella",
  },
  medical: {
    eyebrow: "MEDICAL IDENTITY LAYER",
    label: "Medical Guardian",
    chip: "Protected",
    description:
      "Add a medical layer with identity context, emergency contact readiness, and protection visibility.",
    locationLabel: "Primary location",
    locationPlaceholder: "Home, hospital, or usual area",
    defaultNamePlaceholder: "Medical profile",
  },
};

function makePresenceId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PG-${stamp}-${random}`;
}

function makeMemberId(type: GuardianProfileType) {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function buildPlanLabel(plan: string | null) {
  return plan === "solo" ? "Solo Guardian" : "Household Guardian";
}

function buildMemberSubtitle(member: ProtectedMember) {
  const location = member.location.trim();
  if (member.type === "pet") {
    return location ? `Home base: ${location}` : "Protected pet layer";
  }
  return location ? `Primary location: ${location}` : "Protected Guardian layer";
}

export default function GuardianOnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedType, setSelectedType] = useState<GuardianProfileType>("child");
  const [ownerName, setOwnerName] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [profileName, setProfileName] = useState("");
  const [primaryLocation, setPrimaryLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [presenceId, setPresenceId] = useState("");
  const [members, setMembers] = useState<ProtectedMember[]>([]);
  const [actionNote, setActionNote] = useState("Build the protected layer, then continue to activation.");

  const plan = searchParams.get("plan") || "household";
  const meta = MEMBER_META[selectedType];

  useEffect(() => {
    const storedPresenceId = localStorage.getItem("guardianPresenceId");
    const nextPresenceId = storedPresenceId || makePresenceId();
    setPresenceId(nextPresenceId);

    if (!storedPresenceId) {
      localStorage.setItem("guardianPresenceId", nextPresenceId);
    }

    setOwnerName(localStorage.getItem("guardianOwnerName") || "");
    setHouseholdName(localStorage.getItem("guardianHouseholdName") || "");
    setContactInfo(localStorage.getItem("guardianContactInfo") || "");

    const existingMembersRaw = localStorage.getItem("guardianProtectedMembers");
    if (existingMembersRaw) {
      try {
        const parsed = JSON.parse(existingMembersRaw) as ProtectedMember[];
        if (Array.isArray(parsed)) {
          setMembers(parsed);
        }
      } catch {
        setMembers([]);
      }
    }

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

  const planLabel = useMemo(() => buildPlanLabel(plan), [plan]);

  const readyToAdd =
    ownerName.trim().length > 0 &&
    contactInfo.trim().length > 0 &&
    profileName.trim().length > 0;

  const canContinue = ownerName.trim().length > 0 && contactInfo.trim().length > 0 && members.length > 0;

  function persistGuardianRoot() {
    localStorage.setItem("guardianOwnerName", ownerName.trim());
    localStorage.setItem("guardianHouseholdName", householdName.trim());
    localStorage.setItem("guardianContactInfo", contactInfo.trim());
  }

  function persistMembers(nextMembers: ProtectedMember[]) {
    localStorage.setItem("guardianProtectedMembers", JSON.stringify(nextMembers));
    localStorage.setItem("guardianActivationProfiles", JSON.stringify(nextMembers));
  }

  function resetMemberFields(nextType?: GuardianProfileType) {
    setProfileName("");
    setPrimaryLocation("");
    setNotes("");
    if (nextType) {
      setSelectedType(nextType);
    }
  }

  function handleAddMember() {
    if (!readyToAdd) {
      setActionNote("Enter guardian name, contact, and member name first.");
      return;
    }

    const nextMember: ProtectedMember = {
      id: makeMemberId(selectedType),
      type: selectedType,
      name: profileName.trim(),
      location: primaryLocation.trim(),
      notes: notes.trim(),
    };

    const nextMembers = [nextMember, ...members];
    setMembers(nextMembers);
    persistGuardianRoot();
    persistMembers(nextMembers);

    setActionNote(`${MEMBER_META[selectedType].label} added to the protected layer.`);
    resetMemberFields("child");
  }

  function handleRemoveMember(memberId: string) {
    const nextMembers = members.filter((member) => member.id !== memberId);
    setMembers(nextMembers);
    persistMembers(nextMembers);
    setActionNote(nextMembers.length ? "Protected layer updated." : "No protected members added yet.");
  }

  function handleContinueToActivation() {
    if (!canContinue) {
      setActionNote("Add at least one protected member before activation.");
      return;
    }

    persistGuardianRoot();
    persistMembers(members);

    const firstMember = members[0];
    const params = new URLSearchParams();
    params.set("plan", plan);
    params.set("protectionType", firstMember.type);
    params.set("ownerName", ownerName.trim());
    params.set("householdName", householdName.trim());
    params.set("phone", contactInfo.trim());

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
                  Guardian protected intake
                </span>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
                  Presence first
                </span>
              </div>

              <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                Build the protected Guardian layer.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                This is the real start of Guardian. The guardian enters their household, adds who matters,
                and then continues into activation with the protected layer already captured.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Plan</div>
                  <div className="mt-2 text-lg font-semibold text-white">{planLabel}</div>
                  <div className="mt-1 text-xs text-slate-400">Guardian system being prepared.</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Presence ID</div>
                  <div className="mt-2 text-lg font-semibold text-white">{presenceId || "Preparing..."}</div>
                  <div className="mt-1 text-xs text-slate-400">Presence-first origin locked.</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Protected members</div>
                  <div className="mt-2 text-lg font-semibold text-white">{members.length}</div>
                  <div className="mt-1 text-xs text-slate-400">Children, pets, elders, or medical layers.</div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md rounded-[24px] border border-white/10 bg-black/25 p-5">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Trust layer</div>
              <div className="mt-3 text-xl font-semibold text-white">Starts protected. Ends protected.</div>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-emerald-500/18 bg-emerald-500/10 p-4">
                  The first page should already feel like a real Guardian system.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  Add the people and animals who matter before activation.
                </div>
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                  Activation should confirm what was captured, not start from scratch.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#06101f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:p-6">
            <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Protected intake</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">Create the real Guardian layer</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
              Keep this simple. Guardian info first. Then add the child, pet, elder, or medical layer.
              Then continue to activation.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {(Object.keys(MEMBER_META) as GuardianProfileType[]).map((type) => {
                const item = MEMBER_META[type];
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
                      <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{item.eyebrow}</div>
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
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">{meta.eyebrow}</div>
              <div className="mt-2 text-xl font-semibold text-white">{meta.label}</div>
              <div className="mt-2 text-sm leading-7 text-slate-300">{meta.description}</div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Guardian name</div>
                  <input
                    value={ownerName}
                    onChange={(event) => setOwnerName(event.target.value)}
                    placeholder="Daniel Doyon"
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Household name</div>
                  <input
                    value={householdName}
                    onChange={(event) => setHouseholdName(event.target.value)}
                    placeholder="Doyon Household"
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Primary contact</div>
                  <input
                    value={contactInfo}
                    onChange={(event) => setContactInfo(event.target.value)}
                    placeholder="Phone or email"
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Name to protect</div>
                  <input
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    placeholder={meta.defaultNamePlaceholder}
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{meta.locationLabel}</div>
                  <input
                    value={primaryLocation}
                    onChange={(event) => setPrimaryLocation(event.target.value)}
                    placeholder={meta.locationPlaceholder}
                    className="w-full rounded-2xl border border-white/10 bg-[#071221] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/35"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Notes</div>
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
                  onClick={handleAddMember}
                  disabled={!readyToAdd}
                  className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add protected member
                </button>

                <button
                  type="button"
                  onClick={handleContinueToActivation}
                  disabled={!canContinue}
                  className="rounded-2xl border border-cyan-400/25 bg-cyan-500/12 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/18 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to activation
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-400">{actionNote}</div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#06101f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:p-6">
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Protected roster</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Who is already inside Guardian</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Add everyone who matters here first. Keep the setup simple and visible before activation.
              </p>

              <div className="mt-5 space-y-3">
                {members.length ? (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                            {MEMBER_META[member.type].label}
                          </div>
                          <div className="mt-1 text-base font-semibold text-white">{member.name}</div>
                          <div className="mt-1 text-sm text-slate-300">{buildMemberSubtitle(member)}</div>
                          {member.notes ? (
                            <div className="mt-1 text-xs text-slate-400">{member.notes}</div>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-slate-400">
                    No protected members added yet. Add the child, pet, elder, or medical layer here
                    before activation.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-emerald-500/15 bg-[#06101f]/90 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] md:p-6">
              <div className="text-[10px] uppercase tracking-[0.24em] text-emerald-200">Activation handoff</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">What happens next</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Once the protected roster looks right, continue into activation. Guardian will lock the
                presence, confirm the layer, and hand you into the protected dashboard.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Guardian</div>
                  <div className="mt-1 text-base font-semibold text-white">
                    {ownerName.trim() || "Guardian name pending"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Household</div>
                  <div className="mt-1 text-base font-semibold text-white">
                    {householdName.trim() || "Household pending"}
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-100">Next move</div>
                  <div className="mt-1 text-base font-semibold text-white">Activation with real structure</div>
                  <div className="mt-1 text-sm text-cyan-50/80">
                    {members.length
                      ? `${members.length} protected ${members.length === 1 ? "member is" : "members are"} ready to carry into activation.`
                      : "Add at least one protected member before activation."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
