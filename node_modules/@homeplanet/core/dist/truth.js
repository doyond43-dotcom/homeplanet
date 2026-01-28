import { isAllowedFlowTransition, isAllowedProjectStateTransition, } from "./types.js";
export function getCoreTruth() {
    const authority = ["Hayley", "Taylor", "Sebastian", "Emily", "Nicholas"];
    const flowSteps = ["Create", "Save", "Recover", "Protect", "Publish"];
    const projectStates = ["Draft", "Private", "Shared", "Published", "Paid", "Archived"];
    const flowTransitions = [];
    for (const from of flowSteps) {
        for (const to of flowSteps) {
            flowTransitions.push({ from, to, allowed: isAllowedFlowTransition(from, to) });
        }
    }
    const projectStateTransitions = [];
    for (const from of projectStates) {
        for (const to of projectStates) {
            projectStateTransitions.push({
                from,
                to,
                allowed: isAllowedProjectStateTransition(from, to),
            });
        }
    }
    return {
        generatedAt: new Date().toISOString(),
        authority,
        flowSteps,
        projectStates,
        flowTransitions,
        projectStateTransitions,
    };
}
//# sourceMappingURL=truth.js.map