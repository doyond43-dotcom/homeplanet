export type StudioUser = {
  id: string;
  email: string;
};

export class StudioAuthError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "StudioAuthError";
  }
}

export async function verifyStudioHost(
  authorization: string | undefined,
  supabaseUrl: string,
  anonKey: string,
  allowedEmails: string
): Promise<StudioUser> {
  if (!authorization?.startsWith("Bearer ")) {
    throw new StudioAuthError("Authentication required", 401);
  }

  if (!supabaseUrl || !anonKey || !allowedEmails.trim()) {
    throw new StudioAuthError("Live Studio authorization not configured", 503);
  }

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`,
    {
      headers: {
        Authorization: authorization,
        apikey: anonKey,
      },
      signal: AbortSignal.timeout(8000),
    }
  );

  if (!response.ok) {
    throw new StudioAuthError("Invalid session", 401);
  }

  const user = await response.json();
  const email = String(user?.email || "").trim().toLowerCase();
  const id = String(user?.id || "").trim();

  const approved = allowedEmails
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!id || !email || !approved.includes(email)) {
    throw new StudioAuthError("Live Studio host access denied", 403);
  }

  return { id, email };
}
