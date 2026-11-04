import { createHash, randomUUID } from "node:crypto";
import { AccessToken } from "livekit-server-sdk";
import {
  claimGuestSession,
} from "./live-studio-guest-session-service.js";
import {
  createLiveStudioGuestToken,
} from "./live-studio-guest-token.js";

type GuestEntryInput = {
  invitationToken: unknown;
  supabaseUrl: string;
  serviceKey: string;
  livekitUrl: string;
  livekitApiKey: string;
  livekitApiSecret: string;
};

export class GuestEntryError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "GuestEntryError";
  }
}

export async function enterLiveStudioGuest(
  input: GuestEntryInput
) {
  if (
    typeof input.invitationToken !== "string" ||
    !/^[0-9a-f]{64}$/.test(input.invitationToken)
  ) {
    throw new GuestEntryError("Invalid invitation", 403);
  }

  if (
    !input.supabaseUrl ||
    !input.serviceKey ||
    !input.livekitUrl ||
    !input.livekitApiKey ||
    !input.livekitApiSecret
  ) {
    throw new GuestEntryError(
      "Guest entry service unavailable",
      503
    );
  }

  // Check LiveKit signing before claiming the invitation.
  const probe = new AccessToken(
    input.livekitApiKey,
    input.livekitApiSecret,
    {
      identity: "probe-" + randomUUID(),
      ttl: "1m",
    }
  );

  probe.addGrant({
    roomJoin: true,
    room: "hp-signing-precheck",
    canPublish: false,
    canSubscribe: false,
    canPublishData: false,
  });

  try {
    await probe.toJwt();
  } catch {
    throw new GuestEntryError(
      "LiveKit token service unavailable",
      503
    );
  }

  const invitationHash = createHash("sha256")
    .update(input.invitationToken)
    .digest("hex");

  const session = await claimGuestSession(
    {
      supabaseUrl: input.supabaseUrl,
      serviceKey: input.serviceKey,
    },
    invitationHash
  );

  const token = await createLiveStudioGuestToken({
    sessionId: session.session_id,
    meetingRoom: session.meeting_room,
    guestRole: session.guest_role,
    livekitApiKey: input.livekitApiKey,
    livekitApiSecret: input.livekitApiSecret,
  });

  // Internal server result.
  // API handlers must deliver reconnectSecret using
  // a secure HttpOnly cookie, never a JSON response.
  return {
    token,
    url: input.livekitUrl,
    room: session.meeting_room,
    guestRole: session.guest_role,
    sessionExpiresAt: session.session_expires_at,
    reconnectSecret: session.reconnectSecret,
  };
}
