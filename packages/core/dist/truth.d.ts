import type { FlowStep, ProjectState, Authority } from "./types.js";
export type CoreTruth = {
    generatedAt: string;
    authority: Authority[];
    flowSteps: FlowStep[];
    projectStates: ProjectState[];
    flowTransitions: Array<{
        from: FlowStep;
        to: FlowStep;
        allowed: boolean;
    }>;
    projectStateTransitions: Array<{
        from: ProjectState;
        to: ProjectState;
        allowed: boolean;
    }>;
};
export declare function getCoreTruth(): CoreTruth;
//# sourceMappingURL=truth.d.ts.map