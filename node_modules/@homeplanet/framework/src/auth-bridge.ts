import type { Authority } from "@homeplanet/core";
import type { AuthLevel } from "@homeplanet/auth";

/**
 * Auth → Authority bridge (v1)
 * Converts auth level into the set of authorities that may act.
 * (Enforcement comes later; this is the canonical mapping.)
 */
export function authoritiesForAuthLevel(level: AuthLevel): Authority[] {
  switch (level) {
    case "System":
      return ["Hayley", "Taylor", "Emily", "Sebastian", "Nicholas"];

    case "Guardian":
      return ["Nicholas"];

    case "VerifiedHuman":
      return ["Sebastian", "Emily"];

    case "Human":
      return ["Emily"];

    case "Guest":
    default:
      return [];
  }
}

export function assertAuthorityAllowedByAuthLevel(level: AuthLevel, authority: Authority) {
  const allowed = authoritiesForAuthLevel(level);
  if (!allowed.includes(authority)) {
    throw new Error(`AuthLevel ${level} does not permit authority ${authority}`);
  }
}
