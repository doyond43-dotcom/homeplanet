import { createInMemoryAuthPort } from "@homeplanet/auth";
import { commandTransitionFlow, commandTransitionProjectState } from "@homeplanet/commands";

async function main() {
  const auth = createInMemoryAuthPort();

  // Use "planet-system" to get System (allows Taylor + Nicholas)
  const res = await auth.login({ handle: "dan", secret: "planet-system" });
  if (!res.ok) throw new Error("login failed");
  const sessionId = res.session.sessionId;

  console.log("AUTH LEVEL:", res.session.level);

  const projectId = "project:demo";

  console.log("\n1) Flow Save as Emily (should PASS):");
  console.log(await commandTransitionFlow({ auth }, { sessionId, projectId, nextStep: "Save", authority: "Emily" }));

  console.log("\n2) State Private as Taylor (should PASS):");
  console.log(await commandTransitionProjectState({ auth }, { sessionId, projectId, nextState: "Private", authority: "Taylor" }));

  console.log("\n3) State Shared as Taylor (should PASS):");
  console.log(await commandTransitionProjectState({ auth }, { sessionId, projectId, nextState: "Shared", authority: "Taylor" }));

  console.log("\n4) State Published as Taylor (should FAIL — Nicholas required):");
  console.log(await commandTransitionProjectState({ auth }, { sessionId, projectId, nextState: "Published", authority: "Taylor" }));

  console.log("\n5) State Published as Nicholas (should PASS):");
  console.log(await commandTransitionProjectState({ auth }, { sessionId, projectId, nextState: "Published", authority: "Nicholas" }));

  console.log("\n6) State Paid as Nicholas (should PASS):");
  console.log(await commandTransitionProjectState({ auth }, { sessionId, projectId, nextState: "Paid", authority: "Nicholas" }));

  console.log("\n7) State Archived as Nicholas (should PASS):");
  console.log(await commandTransitionProjectState({ auth }, { sessionId, projectId, nextState: "Archived", authority: "Nicholas" }));
}

main().catch((e) => console.error("AUTHZ DEMO FAILED:", e?.message || e));
