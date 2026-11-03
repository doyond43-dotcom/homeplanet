import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// This invite is bearer access for the legacy creator-live broadcast only.
// The signed token intentionally has a short expiration and grants no host rights.
const ROOM = "creator-live";
const TTL_SECONDS = 3600;

function key(secret: string) {
  if (Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("Broadcast invitation signing is not configured");
  }
  return secret;
}

export function issueBroadcastInvite(secret: string): string {
  const expires = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = `${ROOM}.${expires}.${randomBytes(16).toString("hex")}`;
  const mac = createHmac("sha256", key(secret)).update(payload).digest("hex");
  return `${payload}.${mac}`;
}

export function verifyBroadcastInvite(candidate: unknown, secret: string): boolean {
  if (typeof candidate !== "string") return false;
  const match = /^(creator-live)\.(\d{10})\.([0-9a-f]{32})\.([0-9a-f]{64})$/.exec(candidate);
  if (!match) return false;
  const expires = Number(match[2]);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(expires) || expires <= now || expires > now + TTL_SECONDS) return false;
  const payload = `${match[1]}.${match[2]}.${match[3]}`;
  const expected = createHmac("sha256", key(secret)).update(payload).digest();
  const provided = Buffer.from(match[4], "hex");
  return timingSafeEqual(expected, provided);
}
