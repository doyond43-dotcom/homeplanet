import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export class InvitationRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "InvitationRequestError";
  }
}

type CreateInvitationInput = {
  verifiedUserId: string;
  meetingId: unknown;
  guestRole: unknown;
  invitedEmail: unknown;
  expiresMinutes: unknown;
  maxUses: unknown;
  supabaseUrl: string;
  serviceKey: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createLiveStudioInvitation(
  input: CreateInvitationInput
) {
  if (!UUID_PATTERN.test(input.verifiedUserId)) {
    throw new InvitationRequestError("Invalid host identity", 401);
  }

  if (
    typeof input.meetingId !== "string" ||
    !UUID_PATTERN.test(input.meetingId)
  ) {
    throw new InvitationRequestError("Invalid meeting ID", 400);
  }

  const role = input.guestRole ?? "participant";

  if (role !== "viewer" && role !== "participant") {
    throw new InvitationRequestError("Invalid guest role", 400);
  }

  const expiresMinutes = input.expiresMinutes ?? 1440;
  const maxUses = input.maxUses ?? 1;

  if (
    typeof expiresMinutes !== "number" ||
    !Number.isInteger(expiresMinutes) ||
    expiresMinutes < 5 ||
    expiresMinutes > 1440
  ) {
    throw new InvitationRequestError(
      "Expiration must be between 5 and 1440 minutes",
      400
    );
  }

  if (
    typeof maxUses !== "number" ||
    !Number.isInteger(maxUses) ||
    maxUses < 1 ||
    maxUses > 10
  ) {
    throw new InvitationRequestError(
      "Usage limit must be between 1 and 10",
      400
    );
  }

  if (
    input.invitedEmail != null &&
    typeof input.invitedEmail !== "string"
  ) {
    throw new InvitationRequestError("Invalid email", 400);
  }

  const invitedEmail =
    typeof input.invitedEmail === "string"
      ? input.invitedEmail.trim().toLowerCase()
      : null;

  if (
    invitedEmail &&
    (
      invitedEmail.length > 320 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitedEmail)
    )
  ) {
    throw new InvitationRequestError("Invalid email", 400);
  }

  if (!input.supabaseUrl || !input.serviceKey) {
    throw new InvitationRequestError(
      "Invitation service is not configured",
      503
    );
  }

  const secret = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256")
    .update(secret)
    .digest("hex");

  const supabase = createClient(
    input.supabaseUrl,
    input.serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data, error } = await supabase.rpc(
    "live_studio_create_invitation",
    {
      p_actor_user_id: input.verifiedUserId,
      p_meeting_id: input.meetingId,
      p_token_hash: tokenHash,
      p_invited_email: invitedEmail || null,
      p_guest_role: role,
      p_expires_minutes: expiresMinutes,
      p_max_uses: maxUses,
    }
  );

  if (error) {
    if (
      error.message.includes("Meeting access denied") ||
      error.message.includes("meeting is closed")
    ) {
      throw new InvitationRequestError(
        "Meeting unavailable or access denied",
        403
      );
    }

    throw new InvitationRequestError(
      "Invitation service unavailable",
      503
    );
  }

  const invitation = Array.isArray(data) ? data[0] : null;

  if (
    !invitation?.invitation_id ||
    !invitation?.invitation_expires_at
  ) {
    throw new InvitationRequestError(
      "Invalid invitation service response",
      503
    );
  }

  return {
    invitationId: invitation.invitation_id,
    invitationToken: secret,
    expiresAt: invitation.invitation_expires_at,
    guestRole: role,
    maxUses,
  };
}
