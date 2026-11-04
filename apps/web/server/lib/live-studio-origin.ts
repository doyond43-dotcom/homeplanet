export function isLiveStudioProductionOriginAllowed(
  origin: unknown,
  host: unknown
): boolean {
  if (
    typeof origin !== "string" ||
    typeof host !== "string" ||
    !host ||
    host.includes(",")
  ) {
    return false;
  }

  try {
    const parsed = new URL(origin);

    return (
      parsed.protocol === "https:" &&
      parsed.host === host &&
      !parsed.username &&
      !parsed.password &&
      parsed.pathname === "/" &&
      parsed.search === "" &&
      parsed.hash === ""
    );
  } catch {
    return false;
  }
}
