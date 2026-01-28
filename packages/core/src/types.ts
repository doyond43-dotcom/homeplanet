
export type HumanId = string;
export type ProjectId = string;

export type Authority = "Hayley" | "Taylor" | "Sebastian" | "Emily" | "Nicholas";

export type ProjectState =
  | "Draft"
  | "Private"
  | "Shared"
  | "Published"
  | "Paid"
  | "Archived";

export type FlowStep = "Create" | "Save" | "Recover" | "Protect" | "Publish";

export function isAllowedFlowTransition(from: FlowStep, to: FlowStep): boolean {
  const order: FlowStep[] = ["Create", "Save", "Recover", "Protect", "Publish"];
  const fi = order.indexOf(from);
  const ti = order.indexOf(to);
  return ti === fi + 1;
}

export function isAllowedProjectStateTransition(from: ProjectState, to: ProjectState): boolean {
  const order: ProjectState[] = ["Draft", "Private", "Shared", "Published", "Paid", "Archived"];
  const fi = order.indexOf(from);
  const ti = order.indexOf(to);
  return ti === fi + 1;
}
