import { isAllowedProjectStateTransition } from "@homeplanet/core";
const states = ["Draft", "Private", "Shared", "Published", "Paid", "Archived"];
function allowedFrom(from) {
    return states.filter((to) => isAllowedProjectStateTransition(from, to));
}
console.log("Allowed transitions:");
for (const s of states) {
    console.log(`- ${s} ->`, allowedFrom(s));
}
//# sourceMappingURL=state-map.js.map