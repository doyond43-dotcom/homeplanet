import type { Authority, FlowStep, ProjectState } from "@homeplanet/core";
import { isAllowedFlowTransition, isAllowedProjectStateTransition } from "@homeplanet/core";

export type HomePlanetErrorCode =
  | "E_FLOW_VIOLATION"
  | "E_AUTHORITY_VIOLATION"
  | "E_STATE_VIOLATION"
  | "E_PROTECTION_REQUIRED";

export class HomePlanetError extends Error {
  code: HomePlanetErrorCode;
  details?: Record<string, unknown>;

  constructor(code: HomePlanetErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export function assertCanonicalFlow(from: FlowStep, to: FlowStep) {
  if (!isAllowedFlowTransition(from, to)) {
    throw new HomePlanetError("E_FLOW_VIOLATION", `Flow violation: ${from} -> ${to}`, { from, to });
  }
}

export function assertProjectStateTransition(from: ProjectState, to: ProjectState) {
  if (!isAllowedProjectStateTransition(from, to)) {
    throw new HomePlanetError("E_STATE_VIOLATION", `State violation: ${from} -> ${to}`, { from, to });
  }
}

export function assertAuthorityAllowedForStep(authority: Authority, step: FlowStep) {
  const allowed: Record<FlowStep, Authority[]> = {
    Create: ["Taylor"],
    Save: ["Emily"],
    Recover: ["Emily"],
    Protect: ["Nicholas"],
    Publish: ["Sebastian"]
  };

  const ok = allowed[step].includes(authority);
  if (!ok) {
    throw new HomePlanetError(
      "E_AUTHORITY_VIOLATION",
      `Authority violation: ${authority} cannot perform ${step}`,
      { authority, step }
    );
  }
}

export function assertProtectionForPublish(hasProtectionGate: boolean) {
  if (!hasProtectionGate) {
    throw new HomePlanetError(
      "E_PROTECTION_REQUIRED",
      "Publish requires Nicholas protection gate",
      { required: "Nicholas" }
    );
  }
}




