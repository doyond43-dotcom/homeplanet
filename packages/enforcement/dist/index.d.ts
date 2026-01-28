import type { Authority, FlowStep, ProjectState } from "@homeplanet/core";
export type HomePlanetErrorCode = "E_FLOW_VIOLATION" | "E_AUTHORITY_VIOLATION" | "E_STATE_VIOLATION" | "E_PROTECTION_REQUIRED";
export declare class HomePlanetError extends Error {
    code: HomePlanetErrorCode;
    details?: Record<string, unknown>;
    constructor(code: HomePlanetErrorCode, message: string, details?: Record<string, unknown>);
}
export declare function assertCanonicalFlow(from: FlowStep, to: FlowStep): void;
export declare function assertProjectStateTransition(from: ProjectState, to: ProjectState): void;
export declare function assertAuthorityAllowedForStep(authority: Authority, step: FlowStep): void;
export declare function assertProtectionForPublish(hasProtectionGate: boolean): void;
//# sourceMappingURL=index.d.ts.map