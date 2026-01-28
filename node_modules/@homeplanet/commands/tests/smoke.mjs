import { commandTransitionProjectState } from "../dist/index.js";

if (typeof commandTransitionProjectState !== "function") {
  throw new Error("commandTransitionProjectState is not a function");
}

console.log("OK: commands exports load and commandTransitionProjectState is a function");
