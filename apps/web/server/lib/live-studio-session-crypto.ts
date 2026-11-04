import {
  createHash,
  randomBytes,
} from "node:crypto";

// Never expose the raw reconnect secret in logs,
// database records, or public application code.

export function createGuestReconnectCredential() {
  const secret = randomBytes(32).toString("hex");

  const hash = createHash("sha256")
    .update(secret)
    .digest("hex");

  return { secret, hash };
}

export function hashGuestReconnectCredential(
  secret: unknown
): string | null {
  if (
    typeof secret !== "string" ||
    !/^[0-9a-f]{64}$/.test(secret)
  ) {
    return null;
  }

  return createHash("sha256")
    .update(secret)
    .digest("hex");
}
