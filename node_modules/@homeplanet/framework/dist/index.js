import { assertAuthorityAllowedForStep, assertCanonicalFlow, assertProjectStateTransition, assertProtectionForPublish } from "@homeplanet/enforcement";
export function createProjectSession(humanId, projectId) {
    let status = {
        humanId,
        projectId,
        flowStep: "Create",
        projectState: "Draft",
        protectionGate: false
    };
    function transitionFlow(nextStep, authority) {
        assertAuthorityAllowedForStep(authority, nextStep);
        assertCanonicalFlow(status.flowStep, nextStep);
        if (nextStep === "Publish") {
            assertProtectionForPublish(status.protectionGate);
        }
        status = { ...status, flowStep: nextStep };
        return status;
    }
    function transitionProjectState(nextState, authority) {
        // OPTION 2 (balanced): allow normal transitions, but irreversible ones require Nicholas
        const irreversible = ["Published", "Paid", "Archived"];
        if (irreversible.includes(nextState) && authority !== "Nicholas") {
            throw new Error(`Protection required: only Nicholas may transition into ${nextState} (attempted ${authority})`);
        }
        assertProjectStateTransition(status.projectState, nextState);
        status = { ...status, projectState: nextState };
        return status;
    }
    function setProtectionGate(authority) {
        if (authority !== "Nicholas")
            throw new Error("Only Nicholas may set protection gate.");
        status = { ...status, protectionGate: true };
        return status;
    }
    function getStatus() {
        return status;
    }
    return { transitionFlow, transitionProjectState, setProtectionGate, getStatus };
}
export * from "./auth-bridge.js";
//# sourceMappingURL=index.js.map