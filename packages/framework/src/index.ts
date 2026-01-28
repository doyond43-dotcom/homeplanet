import type { Authority, FlowStep, HumanId, ProjectId, ProjectState } from "@homeplanet/core";
import {
  assertAuthorityAllowedForStep,
  assertCanonicalFlow,
  assertProjectStateTransition,
  assertProtectionForPublish
} from "@homeplanet/enforcement";

export type ProjectSessionStatus = {
  humanId: HumanId;
  projectId: ProjectId;
  flowStep: FlowStep;
  projectState: ProjectState;
  protectionGate: boolean;
};

export function createProjectSession(humanId: HumanId, projectId: ProjectId) {
  let status: ProjectSessionStatus = {
    humanId,
    projectId,
    flowStep: "Create",
    projectState: "Draft",
    protectionGate: false
  };

  function transitionFlow(nextStep: FlowStep, authority: Authority) {
    assertAuthorityAllowedForStep(authority, nextStep);
    assertCanonicalFlow(status.flowStep, nextStep);

    if (nextStep === "Publish") {
      assertProtectionForPublish(status.protectionGate);
    }

    status = { ...status, flowStep: nextStep };
    return status;
  }

  function transitionProjectState(nextState: ProjectState, authority: Authority) {
    // OPTION 2 (balanced): allow normal transitions, but irreversible ones require Nicholas
    const irreversible: ProjectState[] = ["Published", "Paid", "Archived"];
    if (irreversible.includes(nextState) && authority !== "Nicholas") {
      throw new Error(
        `Protection required: only Nicholas may transition into ${nextState} (attempted ${authority})`
      );
    }

    assertProjectStateTransition(status.projectState, nextState);
    status = { ...status, projectState: nextState };
    return status;
  }

  function setProtectionGate(authority: Authority) {
    if (authority !== "Nicholas") throw new Error("Only Nicholas may set protection gate.");
    status = { ...status, protectionGate: true };
    return status;
  }

  function getStatus() {
    return status;
  }

  return { transitionFlow, transitionProjectState, setProtectionGate, getStatus };
}

export * from "./auth-bridge.js";
