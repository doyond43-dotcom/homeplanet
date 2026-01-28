import { createProjectSession } from "@homeplanet/framework";

function pass(msg: string) {
  console.log("PASS:", msg);
}

function blocked(msg: string, err: unknown) {
  const e = err as any;
  console.log("BLOCKED (expected):", msg);
  if (e?.code) console.log("  code:", e.code);
  if (e?.message) console.log("  message:", e.message);
}

function main() {
  const session = createProjectSession("human:dan", "project:demo");

  // Happy path
  session.transitionFlow("Save", "Emily");
  session.transitionFlow("Recover", "Emily");
  session.setProtectionGate("Nicholas");
  session.transitionFlow("Protect", "Nicholas");
  session.transitionFlow("Publish", "Sebastian");

  // State transitions (Nicholas protected)
  session.transitionProjectState("Private", "Nicholas");
  session.transitionProjectState("Shared", "Nicholas");
  session.transitionProjectState("Published", "Nicholas");

  pass("Happy path completed");
  console.log("Final status:", session.getStatus());

  // Violations
  try {
    const s2 = createProjectSession("human:test", "project:bad1");
    s2.transitionFlow("Publish", "Sebastian");
  } catch (e) {
    blocked("Publish before Save/Recover/Protect", e);
  }

  try {
    const s3 = createProjectSession("human:test", "project:bad2");
    s3.transitionFlow("Save", "Emily");
    s3.transitionFlow("Recover", "Emily");
    s3.transitionFlow("Protect", "Taylor");
  } catch (e) {
    blocked("Protect attempted by Taylor", e);
  }

  try {
    const s4 = createProjectSession("human:test", "project:bad3");
    s4.transitionProjectState("Private", "Taylor");
    pass("Note: Private by Taylor currently allowed (we can tighten later)");
    s4.transitionProjectState("Shared", "Taylor");
    s4.transitionProjectState("Published", "Taylor");
  } catch (e) {
    blocked("Project transition into Published without Nicholas", e);
  }
}

main();





