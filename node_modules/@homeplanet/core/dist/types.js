export function isAllowedFlowTransition(from, to) {
    const order = ["Create", "Save", "Recover", "Protect", "Publish"];
    const fi = order.indexOf(from);
    const ti = order.indexOf(to);
    return ti === fi + 1;
}
export function isAllowedProjectStateTransition(from, to) {
    const order = ["Draft", "Private", "Shared", "Published", "Paid", "Archived"];
    const fi = order.indexOf(from);
    const ti = order.indexOf(to);
    return ti === fi + 1;
}
//# sourceMappingURL=types.js.map