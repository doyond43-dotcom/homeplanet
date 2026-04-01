import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { GuardianVisibilitySettings } from "../components/guardian/GuardianVisibilityCard";

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
  status: string;
  visibilitySettings: GuardianVisibilitySettings;
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

const SAFE_TAG_ALLOWLIST = new Set([
  "call guardian",
  "nonverbal",
  "sensory support needed",
  "allergy alert",
  "may be overwhelmed",
  "autism support needed",
]);

const STRICT_FALLBACK_VISIBILITY_SETTINGS: GuardianVisibilitySettings = {
  nameMode: "hidden",
  alias: "",
  showPhoto: false,
  safeTags: ["call guardian"],
  showContactButton: false,
};

function normalizeSafeTags(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;

  const clean = value
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => SAFE_TAG_ALLOWLIST.has(tag));

  return clean.length > 0 ? Array.from(new Set(clean)) : fallback;
}

function normalizeVisibilitySettings(
  raw?: Partial<GuardianVisibilitySettings> | null,
): GuardianVisibilitySettings {
  if (!raw || typeof raw !== "object") {
    return STRICT_FALLBACK_VISIBILITY_SETTINGS;
  }

  return {
    nameMode:
      raw.nameMode === "first-name" ||
      raw.nameMode === "alias" ||
      raw.nameMode === "hidden"
        ? raw.nameMode
        : STRICT_FALLBACK_VISIBILITY_SETTINGS.nameMode,
    alias: typeof raw.alias === "string" ? raw.alias.trim() : "",
    showPhoto:
      typeof raw.showPhoto === "boolean"
        ? raw.showPhoto
        : STRICT_FALLBACK_VISIBILITY_SETTINGS.showPhoto,
    safeTags: normalizeSafeTags(
      raw.safeTags,
      STRICT_FALLBACK_VISIBILITY_SETTINGS.safeTags,
    ),
    showContactButton:
      typeof raw.showContactButton === "boolean"
        ? raw.showContactButton
        : STRICT_FALLBACK_VISIBILITY_SETTINGS.showContactButton,
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
      visibilitySettings: STRICT_FALLBACK_VISIBILITY_SETTINGS,
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

function getFirstName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "Child";
  return trimmed.split(/\s+/)[0] || "Child";
}

function resolveDisplayName(
  childName: string,
  visibility: GuardianVisibilitySettings,
): string {
  if (visibility.nameMode === "hidden") return "Child";

  if (visibility.nameMode === "alias") {
    const alias = visibility.alias.trim();
    return alias || "Child";
  }

  const first = getFirstName(childName);
  return first || "Child";
}

function buildContactHref(contactInfo: string): string {
  const trimmed = contactInfo.trim();

  if (!trimmed) return "#";

  if (trimmed.includes("@")) {
    return `mailto:${trimmed}`;
  }

  const digits = trimmed.replace(/[^\d+]/g, "");
  if (digits) {
    return `tel:${digits}`;
  }

  return "#";
}

export default function GuardianPublicProfilePage() {
  const { profileId } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<GuardianChildRecord | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!profileId) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data: guardianRow, error: guardianError } = await supabase
        .from("guardian_children")
        .select("*")
        .eq("id", profileId)
        .maybeSingle();

      if (!guardianError && guardianRow) {
        setProfile(mapGuardianRowToRecord(guardianRow as GuardianChildRow));
        setLoading(false);
        return;
      }

      const localGuardianChild = getStoredGuardianChild(profileId);

      if (localGuardianChild) {
        setProfile(localGuardianChild);
        setLoading(false);
        return;
      }

      setProfile(null);
      setLoading(false);
    }

    loadProfile();
  }, [profileId]);

  const visibility = useMemo(() => {
    if (!profile) return STRICT_FALLBACK_VISIBILITY_SETTINGS;
    return normalizeVisibilitySettings(profile.visibilitySettings);
  }, [profile]);

  const displayName = useMemo(() => {
    if (!profile) return "Child";
    return resolveDisplayName(profile.childName, visibility);
  }, [profile, visibility]);

  const contactHref = useMemo(() => {
    if (!profile) return "#";
    if (!visibility.showContactButton) return "#";
    return buildContactHref(profile.contactInfo);
  }, [profile, visibility.showContactButton]);

  if (loading) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>Loading Guardian Profile…</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>Guardian profile not found.</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {visibility.showPhoto ? <div style={styles.photoPlaceholder} /> : null}

        <h1 style={styles.name}>{displayName}</h1>

        <div style={styles.status}>Needs Guardian Contact</div>

        {profile.safeZone ? (
          <div style={styles.metaBlock}>
            <div style={styles.metaLine}>Safe zone: {profile.safeZone}</div>
            {profile.status ? (
              <div style={styles.metaLine}>Status: {profile.status}</div>
            ) : null}
          </div>
        ) : profile.status ? (
          <div style={styles.metaBlock}>
            <div style={styles.metaLine}>Status: {profile.status}</div>
          </div>
        ) : null}

        {visibility.safeTags.length > 0 ? (
          <div style={styles.tags}>
            {visibility.safeTags.map((tag, i) => (
              <div key={`${tag}-${i}`} style={styles.tag}>
                {tag}
              </div>
            ))}
          </div>
        ) : null}

        {visibility.showContactButton ? (
          <a
            href={contactHref}
            style={{
              ...styles.button,
              ...(contactHref === "#" ? styles.buttonDisabled : {}),
            }}
            aria-disabled={contactHref === "#"}
            onClick={(event) => {
              if (contactHref === "#") {
                event.preventDefault();
              }
            }}
          >
            Contact Guardian
          </a>
        ) : (
          <div style={styles.hiddenButton}>Contact hidden</div>
        )}

        <div style={styles.footer}>
          This is a public safety view. Protected details remain with the guardian.
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#050816",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  center: {
    minHeight: "100vh",
    background: "#050816",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "#0b1328",
    padding: 24,
    borderRadius: 22,
    maxWidth: 420,
    width: "100%",
    textAlign: "center",
    boxShadow: "0 0 28px rgba(0, 255, 200, 0.08)",
    border: "1px solid rgba(34, 211, 238, 0.08)",
  },
  photoPlaceholder: {
    width: 86,
    height: 86,
    borderRadius: "50%",
    margin: "0 auto 16px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  name: {
    color: "#ffffff",
    marginBottom: 8,
    fontSize: 36,
    fontWeight: 600,
    lineHeight: 1.1,
  },
  status: {
    color: "#22c55e",
    fontWeight: 600,
    marginBottom: 16,
    fontSize: 16,
  },
  metaBlock: {
    marginBottom: 16,
  },
  metaLine: {
    color: "#cbd5e1",
    fontSize: 13,
    lineHeight: 1.6,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginBottom: 18,
  },
  tag: {
    background: "#243045",
    padding: "7px 12px",
    borderRadius: 999,
    color: "#e5e7eb",
    fontSize: 12,
  },
  button: {
    width: "100%",
    padding: 14,
    background: "#14b8d4",
    border: "none",
    borderRadius: 12,
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 18,
    display: "block",
    textDecoration: "none",
    boxSizing: "border-box",
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  hiddenButton: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    color: "#94a3b8",
    fontWeight: 700,
    marginBottom: 18,
    display: "block",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  footer: {
    fontSize: 12,
    color: "#7c8799",
    lineHeight: 1.6,
  },
};