export type GuardianPublicView = {
  isPublic: boolean;
  displayName: string;
  photoUrl: string | null;
  ageLabel: string | null;
  careTags: string[];
  showGuardianContactButton: boolean;
  showLastSeenContext: boolean;
  publicSafetyMessage: string;
};

export function resolveGuardianPublicView(profile: any): GuardianPublicView {
  if (!profile) {
    return {
      isPublic: false,
      displayName: "Guardian Profile",
      photoUrl: null,
      ageLabel: null,
      careTags: [],
      showGuardianContactButton: false,
      showLastSeenContext: false,
      publicSafetyMessage: "Profile unavailable",
    };
  }

  const firstName = getFirstName(profile);
  const photoUrl = resolvePhoto(profile);
  const ageLabel = resolveAgeRange(profile);
  const careTags = filterSafeCareTags(profile.careTags || []);

  return {
    isPublic: true,
    displayName: firstName || "Child",
    photoUrl,
    ageLabel,
    careTags,
    showGuardianContactButton: true,
    showLastSeenContext: true,
    publicSafetyMessage:
      "This is a public safety view. Protected details remain with the guardian.",
  };
}

/* ---------------- HELPERS ---------------- */

function getFirstName(profile: any): string | null {
  if (profile.firstName) return profile.firstName;

  if (profile.fullName) {
    return profile.fullName.split(" ")[0];
  }

  return null;
}

function resolvePhoto(profile: any): string | null {
  return (
    profile.photoUrl ||
    profile.photo_url ||
    profile.imageUrl ||
    profile.avatarUrl ||
    null
  );
}

function resolveAgeRange(profile: any): string | null {
  const dob = profile.dateOfBirth || profile.dob;

  if (!dob) return null;

  const birth = new Date(dob);
  const now = new Date();

  let age = now.getFullYear() - birth.getFullYear();

  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }

  if (age <= 2) return "Age 0–2";
  if (age <= 5) return "Age 3–5";
  if (age <= 8) return "Age 6–8";
  if (age <= 12) return "Age 9–12";
  if (age <= 17) return "Age 13–17";

  return "Age 18+";
}

const SAFE_TAGS = [
  "nonverbal",
  "autism support needed",
  "sensory support needed",
  "may be overwhelmed",
  "allergy alert",
  "peanut allergy",
  "nut allergy",
  "call guardian",
];

function filterSafeCareTags(tags: string[]): string[] {
  return tags.filter((tag) =>
    SAFE_TAGS.includes(tag.toLowerCase())
  );
}