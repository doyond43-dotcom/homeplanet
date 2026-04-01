import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import GuardianVisibilityCard, {
  type GuardianVisibilitySettings,
} from "../components/guardian/GuardianVisibilityCard";

type ChildRecord = {
  id: string;
  customer: string;
  vehicle: string;
  concern: string;
  stage: string;
  advisor: string;
  eta: string;
  notes: string;
  created_at: string;
};

type GuardianProfileType = "child" | "elder" | "pet" | "medical";

type GuardianChildRow = {
  id: string;
  name: string | null;
  type: string | null;
  safe_zone: string | null;
  contact: string | null;
  owner_name: string | null;
  household_name: string | null;
  notes: string | null;
  subtitle: string | null;
  status: string | null;
  created_at: string | null;
  visibility_settings: Partial<GuardianVisibilitySettings> | null;
};

type GuardianChildRecord = {
  id: string;
  ownerName: string;
  householdName: string;
  contactInfo: string;
  childName: string;
  safeZone: string;
  notes: string;
  createdAt: string;
  subtitle: string;
  status: string;
  visibilitySettings: GuardianVisibilitySettings;
};

type ProtectedMember = {
  id: string;
  type: GuardianProfileType;
  name: string;
  location?: string;
  notes?: string;
  createdAt?: string;
  status?: string;
  visibilitySettings?: Partial<GuardianVisibilitySettings>;
};

const DEFAULT_VISIBILITY_SETTINGS: GuardianVisibilitySettings = {
  nameMode: "first-name",
  alias: "",
  showPhoto: true,
  safeTags: ["call guardian"],
  showContactButton: true,
  zoneVisibility: "general",
  activityVisibility: "show",
  staffVisibility: "hidden",
  timelineVisibility: "latest-only",
  notesVisibility: "hidden",
};

function formatTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normalizeVisibilitySettings(
  raw?: Partial<GuardianVisibilitySettings> | null,
): GuardianVisibilitySettings {
  return {
    ...DEFAULT_VISIBILITY_SETTINGS,
    ...raw,
    safeTags: Array.isArray(raw?.safeTags) && raw.safeTags.length > 0
      ? raw.safeTags.filter((tag): tag is string => typeof tag === "string")
      : DEFAULT_VISIBILITY_SETTINGS.safeTags,
    zoneVisibility:
      raw?.zoneVisibility === "exact" || raw?.zoneVisibility === "hidden"
        ? raw.zoneVisibility
        : "general",
    activityVisibility: raw?.activityVisibility === "hidden" ? "hidden" : "show",
    staffVisibility: raw?.staffVisibility === "show" ? "show" : "hidden",
    timelineVisibility:
      raw?.timelineVisibility === "full" || raw?.timelineVisibility === "hidden"
        ? raw.timelineVisibility
        : "latest-only",
    notesVisibility: raw?.notesVisibility === "show" ? "show" : "hidden",
  };
}

function getFirstName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "Protected Child";
  return trimmed.split(/\s+/)[0] || "Protected Child";
}

function resolvePublicName(
  childName: string,
  settings: GuardianVisibilitySettings,
) {
  if (settings.nameMode === "hidden") return "Protected Child";
  if (settings.nameMode === "alias") {
    return settings.alias.trim() || getFirstName(childName);
  }
  return getFirstName(childName);
}

function resolvePublicZone(
  safeZone: string,
  settings: GuardianVisibilitySettings,
) {
  if (settings.zoneVisibility === "hidden") return "Zone hidden";
  if (settings.zoneVisibility === "general") return "In expected area";
  return safeZone.trim() || "Expected area";
}

function resolvePublicActivity(
  subtitle: string,
  settings: GuardianVisibilitySettings,
) {
  if (settings.activityVisibility === "hidden") return "Status protected";
  return subtitle.trim() || "Safe and active";
}

function resolvePublicStaff(
  staffValue: string,
  settings: GuardianVisibilitySettings,
) {
  if (settings.staffVisibility === "hidden") return "Staff hidden";
  return staffValue.trim() || "Staff supervised";
}

function resolvePublicNotes(
  notes: string,
  settings: GuardianVisibilitySettings,
) {
  if (settings.notesVisibility === "hidden") return "";
  return notes.trim() || "Safe notes available";
}

function getStoredGuardianChild(childId?: string): GuardianChildRecord | null {
  if (!childId) return null;

  try {
    const rawMembers = localStorage.getItem("guardianProtectedMembers");
    const ownerName = localStorage.getItem("guardianOwnerName") || "";
    const householdName = localStorage.getItem("guardianHouseholdName") || "";
    const contactInfo = localStorage.getItem("guardianContactInfo") || "";

    if (!rawMembers) return null;

    const parsed = JSON.parse(rawMembers) as ProtectedMember[];
    if (!Array.isArray(parsed)) return null;

    const match = parsed.find(
      (member) => member?.id === childId && member.type === "child",
    );

    if (!match) return null;

    return {
      id: match.id,
      ownerName,
      householdName,
      contactInfo,
      childName: match.name || "Child",
      safeZone: match.location || "",
      notes: match.notes || "",
      createdAt: match.createdAt || new Date().toISOString(),
      subtitle: match.location
        ? `Primary location: ${match.location}`
        : "Guardian child profile is active and ready to share.",
      status: match.status || "active",
      visibilitySettings: normalizeVisibilitySettings(match.visibilitySettings),
    };
  } catch {
    return null;
  }
}

function mapGuardianRowToRecord(row: GuardianChildRow): GuardianChildRecord {
  return {
    id: row.id,
    ownerName: row.owner_name || "",
    householdName: row.household_name || "",
    contactInfo: row.contact || "",
    childName: row.name || "Child",
    safeZone: row.safe_zone || "",
    notes: row.notes || "",
    createdAt: row.created_at || new Date().toISOString(),
    subtitle:
      row.subtitle ||
      (row.safe_zone
        ? `Primary location: ${row.safe_zone}`
        : row.contact
          ? `Primary contact: ${row.contact}`
          : "Guardian child profile is active and ready to share."),
    status: row.status || "active",
    visibilitySettings: normalizeVisibilitySettings(row.visibility_settings),
  };
}

export default function ParentChildView() {
  const { childId } = useParams();

  const [guardianChild, setGuardianChild] = useState<GuardianChildRecord | null>(null);
  const [child, setChild] = useState<ChildRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibilitySettings, setVisibilitySettings] =
    useState<GuardianVisibilitySettings>(DEFAULT_VISIBILITY_SETTINGS);

  useEffect(() => {
    async function loadChild() {
      if (!childId) {
        setLoading(false);
        return;
      }

      const { data: guardianRow, error: guardianError } = await supabase
        .from("guardian_children")
        .select("*")
        .eq("id", childId)
        .maybeSingle();

      if (!guardianError && guardianRow) {
        const mapped = mapGuardianRowToRecord(guardianRow as GuardianChildRow);
        setGuardianChild(mapped);
        setVisibilitySettings(mapped.visibilitySettings);
        setLoading(false);
        return;
      }

      const localGuardianChild = getStoredGuardianChild(childId);

      if (localGuardianChild) {
        setGuardianChild(localGuardianChild);
        setVisibilitySettings(localGuardianChild.visibilitySettings);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("auto_repair_jobs")
        .select("*")
        .eq("id", childId)
        .single();

      if (!error && data) {
        setChild(data);
      }

      setLoading(false);
    }

    void loadChild();
  }, [childId]);

  const guardianTimeline = useMemo(() => {
    if (!guardianChild) return [];

    return [
      `${formatTime(guardianChild.createdAt)} → Guardian profile created`,
      guardianChild.safeZone
        ? `${guardianChild.safeZone} → Current zone`
        : "Zone protected",
      guardianChild.contactInfo
        ? "Guardian contact available"
        : "Guardian contact pending",
      "Live Guardian page → Public-safe view ready",
    ];
  }, [guardianChild]);

  async function handleSaveVisibility(settings: GuardianVisibilitySettings) {
    if (!guardianChild) return;

    setVisibilitySettings(settings);

    const { error } = await supabase
      .from("guardian_children")
      .update({
        visibility_settings: settings,
      })
      .eq("id", guardianChild.id);

    if (error) {
      console.warn("Guardian visibility save failed:", error.message);
      return;
    }

    setGuardianChild((prev) =>
      prev
        ? {
            ...prev,
            visibilitySettings: settings,
          }
        : prev,
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Loading Guardian page...
      </div>
    );
  }

  if (guardianChild) {
    const publicName = resolvePublicName(
      guardianChild.childName,
      visibilitySettings,
    );
    const publicZone = resolvePublicZone(
      guardianChild.safeZone,
      visibilitySettings,
    );
    const publicActivity = resolvePublicActivity(
      guardianChild.subtitle,
      visibilitySettings,
    );
    const publicStaff = resolvePublicStaff("", visibilitySettings);
    const publicNotes = resolvePublicNotes(
      guardianChild.notes,
      visibilitySettings,
    );

    const publicTimeline =
      visibilitySettings.timelineVisibility === "hidden"
        ? []
        : visibilitySettings.timelineVisibility === "latest-only"
          ? guardianTimeline.slice(0, 1)
          : guardianTimeline;

    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-8 md:py-10">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Public Guardian page
            </span>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
              Safety-filtered view
            </span>
          </div>

          <div className="mb-8">
            <div className="text-xs uppercase tracking-widest text-cyan-400">
              Live child presence
            </div>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-white md:text-5xl">
              {publicName}
            </h1>
            <div className="mt-3 text-lg text-slate-300">
              Public-safe Guardian page
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              This page only shows what the guardian allowed from the protected side.
            </p>
          </div>

          <div className="mb-6 rounded-[28px] border border-cyan-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm text-slate-400">Current Activity</div>
                <div className="mt-2 text-3xl font-semibold text-white">
                  {publicActivity}
                </div>

                <div className="mt-4 text-sm text-slate-300">
                  Zone: {publicZone}
                </div>

                <div className="mt-2 text-sm text-slate-300">
                  Supervision: {publicStaff}
                </div>
              </div>

              <div className="flex flex-col items-end">
                {visibilitySettings.showPhoto ? (
                  <div className="mb-4 h-20 w-20 rounded-full border border-white/10 bg-white/[0.06]" />
                ) : null}

                <div className="text-xl font-semibold text-emerald-400">
                  • Safe & Active
                </div>
              </div>
            </div>
          </div>

          {visibilitySettings.safeTags.length > 0 ? (
            <div className="mb-6 rounded-[28px] border border-cyan-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="mb-4 text-xl font-semibold text-white">Public Safety Tags</div>

              <div className="flex flex-wrap gap-3">
                {visibilitySettings.safeTags.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {publicTimeline.length > 0 ? (
            <div className="mb-6 rounded-[28px] border border-cyan-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="mb-4 text-xl font-semibold text-white">Activity Timeline</div>

              <div className="space-y-3">
                {publicTimeline.map((line, i) => (
                  <div
                    key={i}
                    className="border-l border-cyan-500/30 pl-4 text-base text-white/85"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {visibilitySettings.notesVisibility === "show" && publicNotes ? (
            <div className="mb-6 rounded-[28px] border border-emerald-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="mb-3 text-xl font-semibold text-white">Safe Notes</div>
              <div className="text-lg text-emerald-300">{publicNotes}</div>
            </div>
          ) : null}

          {visibilitySettings.showContactButton ? (
            <div className="rounded-[28px] border border-cyan-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
              <div className="mb-3 text-xl font-semibold text-white">
                Guardian Contact
              </div>
              <div className="text-sm leading-7 text-slate-300">
                {guardianChild.contactInfo?.trim()
                  ? "Guardian contact is available for safe follow-up."
                  : "Guardian contact is enabled, but no contact value is set yet."}
              </div>

              <div className="mt-4 rounded-2xl bg-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white">
                Contact Guardian
              </div>
            </div>
          ) : null}

          <div className="mt-6">
            <GuardianVisibilityCard
              childName={guardianChild.childName}
              contactInfo={guardianChild.contactInfo}
              initialSettings={visibilitySettings}
              onSave={handleSaveVisibility}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        Child not found
      </div>
    );
  }

  const timeline = [
    `${formatTime(child.created_at)} → Checked in`,
    child.stage ? `${child.stage} → Current zone` : null,
    child.concern ? `${child.concern} → Activity` : null,
    child.eta ? `${child.eta} → Next move` : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-3xl px-6 py-8 md:px-8 md:py-10">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
            Legacy fallback
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
            Live child presence
          </span>
        </div>

        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-cyan-400">
            Live child presence
          </div>
          <h1 className="mt-2 text-4xl font-semibold leading-tight text-white md:text-5xl">
            {child.vehicle || "Child"}
          </h1>
          <div className="mt-3 text-lg text-slate-300">Guardian: {child.customer || "—"}</div>
        </div>

        <div className="mb-6 rounded-[28px] border border-cyan-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="text-sm text-slate-400">Current Activity</div>
              <div className="mt-2 text-3xl font-semibold text-white">
                {child.concern || "—"}
              </div>

              <div className="mt-4 text-sm text-slate-300">Zone: {child.stage || "—"}</div>

              <div className="mt-2 text-sm text-slate-300">Staff: {child.advisor || "—"}</div>
            </div>

            <div className="text-right">
              <div className="text-xl font-semibold text-emerald-400">• Safe & Active</div>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-[28px] border border-cyan-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-4 text-xl font-semibold text-white">Activity Timeline</div>

          <div className="space-y-3">
            {timeline.map((line, i) => (
              <div
                key={i}
                className="border-l border-cyan-500/30 pl-4 text-base text-white/85"
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        {child.notes && (
          <div className="rounded-[28px] border border-emerald-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <div className="mb-3 text-xl font-semibold text-white">Notes</div>
            <div className="text-lg text-emerald-300">{child.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}