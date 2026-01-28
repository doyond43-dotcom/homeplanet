import type { FlowStep, ProjectState, Authority } from "./types.js";
import {
  isAllowedFlowTransition,
  isAllowedProjectStateTransition,
} from "./types.js";

export type CoreTruth = {
  generatedAt: string;
  authority: Authority[];
  flowSteps: FlowStep[];
  projectStates: ProjectState[];
  flowTransitions: Array<{ from: FlowStep; to: FlowStep; allowed: boolean }>;
  projectStateTransitions: Array<{ from: ProjectState; to: ProjectState; allowed: boolean }>;
};

export function getCoreTruth(): CoreTruth {
  const authority: Authority[] = ["Hayley", "Taylor", "Sebastian", "Emily", "Nicholas"];

  const flowSteps: FlowStep[] = ["Create", "Save", "Recover", "Protect", "Publish"];
  const projectStates: ProjectState[] = ["Draft", "Private", "Shared", "Published", "Paid", "Archived"];

  const flowTransitions: CoreTruth["flowTransitions"] = [];
  for (const from of flowSteps) {
    for (const to of flowSteps) {
      flowTransitions.push({ from, to, allowed: isAllowedFlowTransition(from, to) });
    }
  }

  const projectStateTransitions: CoreTruth["projectStateTransitions"] = [];
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

