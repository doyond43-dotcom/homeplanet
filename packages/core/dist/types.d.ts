export type HumanId = string;
export type ProjectId = string;
export type Authority = "Hayley" | "Taylor" | "Sebastian" | "Emily" | "Nicholas";
export type ProjectState = "Draft" | "Private" | "Shared" | "Published" | "Paid" | "Archived";
export type FlowStep = "Create" | "Save" | "Recover" | "Protect" | "Publish";
export declare function isAllowedFlowTransition(from: FlowStep, to: FlowStep): boolean;
export declare function isAllowedProjectStateTransition(from: ProjectState, to: ProjectState): boolean;
//# sourceMappingURL=types.d.ts.map