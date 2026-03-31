import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

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
};

function formatTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
      (profile) => profile.id === childId && profile.type === "child"
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
    };
  } catch {
    return null;
  }
}

export default function ParentChildView() {
  const { childId } = useParams();

  const [guardianChild, setGuardianChild] = useState<GuardianChildRecord | null>(null);
  const [child, setChild] = useState<ChildRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChild() {
      if (!childId) {
        setLoading(false);
        return;
      }

      const localGuardianChild = getStoredGuardianChild(childId);

      if (localGuardianChild) {
        setGuardianChild(localGuardianChild);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        Loading child data...
      </div>
    );
  }

  if (guardianChild) {
    return (
      <div className="min-h-screen bg-[#050816] text-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="text-xs text-cyan-400 uppercase tracking-widest">
              LIVE CHILD PRESENCE
            </div>
            <h1 className="text-3xl font-semibold mt-2">
              {guardianChild.childName || "Child"}
            </h1>
            <div className="text-sm text-slate-400 mt-1">
              Guardian: {guardianChild.ownerName || "—"}
            </div>
            {guardianChild.householdName ? (
              <div className="text-sm text-slate-500 mt-1">
                Household: {guardianChild.householdName}
              </div>
            ) : null}
          </div>

          <div className="bg-[#0b1a24] border border-cyan-500/20 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center gap-6">
              <div>
                <div className="text-sm text-slate-400">Current Activity</div>
                <div className="text-xl font-medium mt-1">
                  Safe & active
                </div>

                <div className="text-sm text-slate-400 mt-2">
                  Zone: {guardianChild.safeZone || "Not set"}
                </div>

                <div className="text-sm text-slate-400 mt-1">
                  Contact: {guardianChild.contactInfo || "—"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-green-400 text-sm">
                  ● Safe & Active
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1a24] border border-cyan-500/20 rounded-xl p-5 mb-6">
            <div className="text-sm text-slate-400 mb-3">
              Activity Timeline
            </div>

            <div className="space-y-2">
              {guardianTimeline.map((line, i) => (
                <div
                  key={i}
                  className="text-sm text-white/80 border-l border-cyan-500/30 pl-3"
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0b1a24] border border-emerald-500/20 rounded-xl p-5">
            <div className="text-sm text-slate-400 mb-2">
              Guardian Notes
            </div>
            <div className="text-emerald-300 text-sm">
              {guardianChild.subtitle || "Guardian child profile is active and ready to share."}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
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
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="text-xs text-cyan-400 uppercase tracking-widest">
            LIVE CHILD PRESENCE
          </div>
          <h1 className="text-3xl font-semibold mt-2">
            {child.vehicle || "Child"}
          </h1>
          <div className="text-sm text-slate-400 mt-1">
            Guardian: {child.customer || "—"}
          </div>
        </div>

        <div className="bg-[#0b1a24] border border-cyan-500/20 rounded-xl p-5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-slate-400">Current Activity</div>
              <div className="text-xl font-medium mt-1">
                {child.concern || "—"}
              </div>

              <div className="text-sm text-slate-400 mt-2">
                Zone: {child.stage || "—"}
              </div>

              <div className="text-sm text-slate-400 mt-1">
                Staff: {child.advisor || "—"}
              </div>
            </div>

            <div className="text-right">
              <div className="text-green-400 text-sm">
                ● Safe & Active
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0b1a24] border border-cyan-500/20 rounded-xl p-5 mb-6">
          <div className="text-sm text-slate-400 mb-3">
            Activity Timeline
          </div>

          <div className="space-y-2">
            {timeline.map((line, i) => (
              <div
                key={i}
                className="text-sm text-white/80 border-l border-cyan-500/30 pl-3"
              >
                {line}
              </div>
            ))}
          </div>
        </div>

        {child.notes && (
          <div className="bg-[#0b1a24] border border-emerald-500/20 rounded-xl p-5">
            <div className="text-sm text-slate-400 mb-2">
              Notes
            </div>
            <div className="text-emerald-300 text-sm">
              {child.notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}