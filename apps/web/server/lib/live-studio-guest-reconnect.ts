import { randomUUID } from "node:crypto";
import { AccessToken } from "livekit-server-sdk";

import {
  rotateGuestSession,
} from "./live-studio-guest-session-service.js";

import {
  createLiveStudioGuestToken,
} from "./live-studio-guest-token.js";

type ReconnectInput = {
  reconnectSecret: unknown;
  supabaseUrl: string;
  serviceKey: string;
  recoveryKey: string;
  livekitUrl: string;
  livekitApiKey: string;
  livekitApiSecret: string;
};

export async function reconnectLiveStudioGuest(
  input: ReconnectInput
) {
  if (
    !input.supabaseUrl ||
    !input.serviceKey ||
    !input.livekitUrl ||
    !input.livekitApiKey ||
    !input.livekitApiSecret
  ) {
    throw new Error("Guest reconnect configuration unavailable");
  }

  // Verify LiveKit signing before rotating the credential.
  // This temporary token is never returned to the guest.
  try {
    const probe = new AccessToken(
      input.livekitApiKey,
      input.livekitApiSecret,
      {
        identity: "reconnect-probe-" + randomUUID(),
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
    throw new Error("LiveKit reconnect signing unavailable");
  }

  // Rotate the credential atomically in Supabase.
  // The previous credential becomes unusable.
  const session = await rotateGuestSession(
    {
      supabaseUrl: input.supabaseUrl,
      serviceKey: input.serviceKey,
    },
    input.reconnectSecret,
    input.recoveryKey
  );

  // The same guest session keeps the same LiveKit identity.
  const token = await createLiveStudioGuestToken({
    sessionId: session.session_id,
    meetingRoom: session.meeting_room,
    guestRole: session.guest_role,
    livekitApiKey: input.livekitApiKey,
    livekitApiSecret: input.livekitApiSecret,
  });

  // This is an INTERNAL server result.
  // API handlers must put reconnectSecret in an
  // HttpOnly cookie, never in their JSON response.
  return {
    token,
    url: input.livekitUrl,
    room: session.meeting_room,
    guestRole: session.guest_role,
    sessionExpiresAt: session.session_expires_at,
    reconnectSecret: session.reconnectSecret,
  };
}
