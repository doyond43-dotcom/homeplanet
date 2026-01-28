import type { Authority } from "@homeplanet/core";
import type { AuthLevel } from "@homeplanet/auth";
/**
 * Auth → Authority bridge (v1)
 * Converts auth level into the set of authorities that may act.
 * (Enforcement comes later; this is the canonical mapping.)
 */
export declare function authoritiesForAuthLevel(level: AuthLevel): Authority[];
export declare function assertAuthorityAllowedByAuthLevel(level: AuthLevel, authority: Authority): void;
//# sourceMappingURL=auth-bridge.d.ts.map