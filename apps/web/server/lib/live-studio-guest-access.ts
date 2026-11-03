import { createHash, randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { AccessToken } from "livekit-server-sdk";

export class GuestAccessError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "GuestAccessError";
  }
}

type GuestAccessInput = {
  invitationToken: unknown;
  supabaseUrl: string;
  serviceKey: string;
  livekitUrl: string;
  livekitApiKey: string;
  livekitApiSecret: string;
};

export async function redeemLiveStudioGuestAccess(
  input: GuestAccessInput
) {
  if (
    typeof input.invitationToken !== "string" ||
    !/^[0-9a-f]{64}$/.test(input.invitationToken)
  ) {
    throw new GuestAccessError("Invalid invitation", 403);
  }

  if (
    !input.supabaseUrl ||
    !input.serviceKey ||
    !input.livekitUrl ||
    !input.livekitApiKey ||
    !input.livekitApiSecret
  ) {
    throw new GuestAccessError(
      "Guest access service unavailable",
      503
    );
  }

  // Verify LiveKit can sign a token before consuming an invitation.
  // This probe token is never returned or used to join a room.
  try {
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

    await probe.toJwt();
  } catch {
    throw new GuestAccessError(
      "LiveKit token service unavailable",
      503
    );
  }

  const tokenHash = createHash("sha256")
    .update(input.invitationToken)
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

  // Database redemption must atomically enforce:
  // expiration, revocation, meeting status, and use limits.
  const { data, error } = await supabase.rpc(
    "live_studio_redeem_invitation",
    {
      p_token_hash: tokenHash,
    }
  );

  if (error) {
    if (
      error.message.includes("Invalid invitation") ||
      error.message.includes("Invitation unavailable")
    ) {
      throw new GuestAccessError(
        "Invitation unavailable",
        403
      );
    }

    throw new GuestAccessError(
      "Guest access service unavailable",
      503
    );
  }

  const result = Array.isArray(data) ? data[0] : null;

  if (
    !result ||
    typeof result.meeting_room !== "string" ||
    !/^hp-[0-9a-f-]{36}$/.test(result.meeting_room) ||
    (result.guest_role !== "viewer" &&
      result.guest_role !== "participant")
  ) {
    throw new GuestAccessError(
      "Invalid meeting authorization",
      503
    );
  }

  const canPublish = result.guest_role === "participant";

  const accessToken = new AccessToken(
    input.livekitApiKey,
    input.livekitApiSecret,
    {
      identity: "guest-" + randomUUID(),
      name: canPublish ? "Participant" : "Viewer",
      ttl: "5m",
    }
  );

  accessToken.addGrant({
    roomJoin: true,
    room: result.meeting_room,
    canPublish,
    canSubscribe: true,
    canPublishData: canPublish,
  });

  const jwt = await accessToken.toJwt();

  return {
    token: jwt,
    url: input.livekitUrl,
    room: result.meeting_room,
    guestRole: result.guest_role,
  };
}
