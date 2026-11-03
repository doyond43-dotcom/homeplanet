const PRODUCTION_COOKIE = "__Host-hp-live-guest";
const DEVELOPMENT_COOKIE = "hp-live-guest-dev";

export function createGuestSessionCookie(
  secret: string,
  isProduction: boolean
): string {
  if (!/^[0-9a-f]{64}$/.test(secret)) {
    throw new Error("Invalid guest cookie credential");
  }

  const attributes = [
    (isProduction ? PRODUCTION_COOKIE : DEVELOPMENT_COOKIE) + "=" + secret,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=7200",
  ];

  if (isProduction) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

export function clearGuestSessionCookie(
  isProduction: boolean
): string {
  const attributes = [
    (isProduction ? PRODUCTION_COOKIE : DEVELOPMENT_COOKIE) + "=",
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];

  if (isProduction) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

export function readGuestSessionCookie(
  cookieHeader: unknown,
  isProduction: boolean
): string | null {
  if (typeof cookieHeader !== "string") {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");

    if (separator === -1) continue;

    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();

    if (name === (isProduction ? PRODUCTION_COOKIE : DEVELOPMENT_COOKIE)) {
      return /^[0-9a-f]{64}$/.test(value)
        ? value
        : null;
    }
  }

  return null;
}
