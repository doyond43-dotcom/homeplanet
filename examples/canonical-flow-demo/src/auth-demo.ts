import { createInMemoryAuthPort } from "@homeplanet/auth";
import { authoritiesForAuthLevel } from "@homeplanet/framework";

async function main() {
  const auth = createInMemoryAuthPort();

  const res = await auth.login({ handle: "dan", secret: "planet" });
  if (!res.ok) throw new Error("login failed");

  console.log("SESSION:", res.session);

  const allowed = authoritiesForAuthLevel(res.session.level);
  console.log("ALLOWED AUTHORITIES:", allowed);
}

main().catch((e) => {
  console.error("AUTH DEMO FAILED:", e?.message || e);
});
