import {
  createHmac,
  createHash,
} from "node:crypto";

export const RECONNECT_RECOVERY_SECONDS = 60;

export function deriveGuestReconnectReplacement(
  currentSecret: unknown,
  recoveryKey: string
) {
  if (
    typeof currentSecret !== "string" ||
    !/^[0-9a-f]{64}$/.test(currentSecret)
  ) {
    throw new Error("Invalid reconnect credential");
  }

  if (
    typeof recoveryKey !== "string" ||
    Buffer.byteLength(recoveryKey, "utf8") < 32
  ) {
    throw new Error("Reconnect recovery unavailable");
  }

  // Domain-separated HMAC derivation.
  // The server key must never reach browser code.
  const replacementSecret = createHmac(
    "sha256",
    recoveryKey
  )
    .update("homeplanet-live-studio-reconnect-v1:")
    .update(currentSecret)
    .digest("hex");

  const currentHash = createHash("sha256")
    .update(currentSecret)
    .digest("hex");

  const replacementHash = createHash("sha256")
    .update(replacementSecret)
    .digest("hex");

  return {
    currentHash,
    replacementSecret,
    replacementHash,
  };
}
