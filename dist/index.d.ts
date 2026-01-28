import type { Authority, FlowStep, HumanId, ProjectId, ProjectState } from "@homeplanet/core";
export type ProjectSessionStatus = {
    humanId: HumanId;
    projectId: ProjectId;
    flowStep: FlowStep;
    projectState: ProjectState;
    protectionGate: boolean;
};
export declare function createProjectSession(humanId: HumanId, projectId: ProjectId): {
    transitionFlow: (nextStep: FlowStep, authority: Authority) => ProjectSessionStatus;
    transitionProjectState: (nextState: ProjectState, authority: Authority) => ProjectSessionStatus;
    setProtectionGate: (authority: Authority) => ProjectSessionStatus;
    getStatus: () => ProjectSessionStatus;
};
