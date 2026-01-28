import { isAllowedFlowTransition, isAllowedProjectStateTransition } from "@homeplanet/core";
export class HomePlanetError extends Error {
    code;
    details;
    constructor(code, message, details) {
        super(message);
        this.code = code;
        this.details = details;
    }
}
export function assertCanonicalFlow(from, to) {
    if (!isAllowedFlowTransition(from, to)) {
        throw new HomePlanetError("E_FLOW_VIOLATION", `Flow violation: ${from} -> ${to}`, { from, to });
    }
}
export function assertProjectStateTransition(from, to) {
    if (!isAllowedProjectStateTransition(from, to)) {
        throw new HomePlanetError("E_STATE_VIOLATION", `State violation: ${from} -> ${to}`, { from, to });
    }
}
export function assertAuthorityAllowedForStep(authority, step) {
    const allowed = {
        Create: ["Taylor"],
        Save: ["Emily"],
        Recover: ["Emily"],
        Protect: ["Nicholas"],
        Publish: ["Sebastian"]
    };
    const ok = allowed[step].includes(authority);
    if (!ok) {
        throw new HomePlanetError("E_AUTHORITY_VIOLATION", `Authority violation: ${authority} cannot perform ${step}`, { authority, step });
    }
}
export function assertProtectionForPublish(hasProtectionGate) {
    if (!hasProtectionGate) {
        throw new HomePlanetError("E_PROTECTION_REQUIRED", "Publish requires Nicholas protection gate", { required: "Nicholas" });
    }
}
//# sourceMappingURL=index.js.map