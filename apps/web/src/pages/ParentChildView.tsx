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

type GuardianProfile = {
  id: string;
  type: GuardianProfileType;
  name: string;
  status: "active" | "pending";
  subtitle: string;
  createdAt: string;
};

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

const DEFAULT_VISIBILITY_SETTINGS: GuardianVisibilitySettings = {
  nameMode: "first-name",
  alias: "",
  showPhoto: true,
  safeTags: ["call guardian"],
  showContactButton: true,
};

function formatTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function normalizeVisibilitySettings(
  raw?: Partial<GuardianVisibilitySettings> | null,
): GuardianVisibilitySettings {
  return {
    nameMode:
      raw?.nameMode === "alias" || raw?.nameMode === "hidden"
        ? raw.nameMode
        : "first-name",
    alias: typeof raw?.alias === "string" ? raw.alias : "",
    showPhoto:
      typeof raw?.showPhoto === "boolean"
        ? raw.showPhoto
        : DEFAULT_VISIBILITY_SETTINGS.showPhoto,
    safeTags: Array.isArray(raw?.safeTags)
      ? raw.safeTags.filter((tag): tag is string => typeof tag === "string")
      : DEFAULT_VISIBILITY_SETTINGS.safeTags,
    showContactButton:
      typeof raw?.showContactButton === "boolean"
        ? raw.showContactButton
        : DEFAULT_VISIBILITY_SETTINGS.showContactButton,
  };
}

function getStoredGuardianChild(childId?: string): GuardianChildRecord | null {
  if (!childId) return null;

  try {
    const rawProfiles = localStorage.getItem("guardianActivationProfiles");
    const ownerName = localStorage.getItem("guardianOwnerName") || "";
    const householdName = localStorage.getItem("guardianHouseholdName") || "";
    const contactInfo = localStorage.getItem("guardianContactInfo") || "";

    if (!rawProfiles) return null;

    const parsed = JSON.parse(rawProfiles) as GuardianProfile[];
    if (!Array.isArray(parsed)) return null;

    const match = parsed.find(
      (profile) => profile.id === childId && profile.type === "child",
    );

    if (!match) return null;

    const safeZoneMatch = match.subtitle.match(/^Safe zone:\s*(.*)$/i);
    const contactMatch = match.subtitle.match(/^Primary contact:\s*(.*)$/i);

    return {
      id: match.id,
      ownerName,
      householdName,
      contactInfo: contactMatch?.[1] || contactInfo,
      childName: match.name,
      safeZone: safeZoneMatch?.[1] || "",
      notes: "",
      createdAt: match.createdAt,
      subtitle: match.subtitle,
      status: match.status,
      visibilitySettings: DEFAULT_VISIBILITY_SETTINGS,
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
        ? `Safe zone: ${row.safe_zone}`
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

    loadChild();
  }, [childId]);

  const guardianTimeline = useMemo(() => {
    if (!guardianChild) return [];

    return [
      `${formatTime(guardianChild.createdAt)} → Guardian profile created`,
      guardianChild.safeZone
        ? `${guardianChild.safeZone} → Safe zone recorded`
        : "Safe zone pending",
      guardianChild.contactInfo
        ? `${guardianChild.contactInfo} → Primary contact ready`
        : "Primary contact pending",
      "Live Guardian link → Ready to share",
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
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-8 md:py-10">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Guardian protected view
            </span>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
              Live child presence
            </span>
          </div>

          <div className="mb-8">
            <div className="text-xs uppercase tracking-widest text-cyan-400">
              Protected Guardian view
            </div>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-white md:text-5xl">
              {guardianChild.childName || "Child"}
            </h1>
            <div className="mt-3 text-lg text-slate-300">
              Guardian: {guardianChild.ownerName || "—"}
            </div>
            {guardianChild.householdName ? (
              <div className="mt-1 text-lg text-slate-400">
                Household: {guardianChild.householdName}
              </div>
            ) : null}
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
              This is the protected Guardian side. Use it to control what the public Guardian page
              is allowed to show.
            </p>
          </div>

          <div className="mb-6 rounded-[28px] border border-cyan-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-6">
              <div>
                <div className="text-sm text-slate-400">Current Activity</div>
                <div className="mt-2 text-3xl font-semibold text-white">Safe & active</div>

                <div className="mt-4 text-sm text-slate-300">
                  Zone: {guardianChild.safeZone || "Not set"}
                </div>

                <div className="mt-2 text-sm text-slate-300">
                  Contact: {guardianChild.contactInfo || "—"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-semibold text-emerald-400">● Safe & Active</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <GuardianVisibilityCard
              childName={guardianChild.childName}
              contactInfo={guardianChild.contactInfo}
              initialSettings={visibilitySettings}
              onSave={handleSaveVisibility}
            />
          </div>

          <div className="mb-6 rounded-[28px] border border-cyan-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <div className="mb-4 text-xl font-semibold text-white">Activity Timeline</div>

            <div className="space-y-3">
              {guardianTimeline.map((line, i) => (
                <div
                  key={i}
                  className="border-l border-cyan-500/30 pl-4 text-base text-white/85"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-500/20 bg-[#0b1a24] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
            <div className="mb-3 text-xl font-semibold text-white">Guardian Notes</div>
            <div className="text-lg text-emerald-300">
              {guardianChild.notes ||
                guardianChild.subtitle ||
                "Guardian child profile is active and ready to share."}
            </div>
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
              <div className="text-xl font-semibold text-emerald-400">● Safe & Active</div>
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