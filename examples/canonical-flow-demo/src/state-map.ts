import { isAllowedProjectStateTransition } from "@homeplanet/core";

const states = ["Draft","Private","Shared","Published","Paid","Archived"] as const;

function allowedFrom(from: (typeof states)[number]) {
  return states.filter((to) => isAllowedProjectStateTransition(from as any, to as any));
}

console.log("Allowed transitions:");
for (const s of states) {
  console.log(`- ${s} ->`, allowedFrom(s));
}
