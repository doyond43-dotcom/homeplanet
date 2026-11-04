import { AccessToken } from "livekit-server-sdk";

export class GuestTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuestTokenError";
  }
}

type GuestTokenInput = {
  sessionId: string;
  meetingRoom: string;
  guestRole: "viewer" | "participant";
  livekitApiKey: string;
  livekitApiSecret: string;
};

export async function createLiveStudioGuestToken(
  input: GuestTokenInput
) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      input.sessionId
    ) ||
    !/^hp-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      input.meetingRoom
    ) ||
    !["viewer", "participant"].includes(input.guestRole) ||
    !input.livekitApiKey ||
    !input.livekitApiSecret
  ) {
    throw new GuestTokenError(
      "Invalid guest token authorization"
    );
  }

  const canPublish = input.guestRole === "participant";

  const token = new AccessToken(
    input.livekitApiKey,
    input.livekitApiSecret,
    {
      // Stable identity across reconnects for this session.
      identity: "guest-" + input.sessionId,
      name: canPublish ? "Participant" : "Viewer",
      ttl: "5m",
    }
  );

  token.addGrant({
    roomJoin: true,
    room: input.meetingRoom,
    canPublish,
    canSubscribe: true,
    canPublishData: canPublish,
  });

  return token.toJwt();
}
