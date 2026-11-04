import { createClient } from "@supabase/supabase-js";
import { AccessToken } from "livekit-server-sdk";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class PrivateHostError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "PrivateHostError";
  }
}

type PrivateHostInput = {
  verifiedUserId: string;
  meetingId: unknown;
  supabaseUrl: string;
  serviceKey: string;
  livekitUrl: string;
  livekitApiKey: string;
  livekitApiSecret: string;
};

export async function createPrivateHostToken(
  input: PrivateHostInput
) {
  if (
    !UUID_PATTERN.test(input.verifiedUserId) ||
    typeof input.meetingId !== "string" ||
    !UUID_PATTERN.test(input.meetingId)
  ) {
    throw new PrivateHostError("Invalid meeting authorization", 403);
  }

  if (
    !input.supabaseUrl ||
    !input.serviceKey ||
    !input.livekitUrl ||
    !input.livekitApiKey ||
    !input.livekitApiSecret
  ) {
    throw new PrivateHostError("Private host service unavailable", 503);
  }

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

  // Authorize the host through the existing server-only RPC.
  const { data, error } = await supabase.rpc(
    "live_studio_authorize_private_host",
    {
      p_actor_user_id: input.verifiedUserId,
      p_meeting_id: input.meetingId,
    }
  );

  if (error) {
    throw new PrivateHostError(
      "Meeting authorization unavailable",
      503
    );
  }

  const room = Array.isArray(data)
    ? data[0]?.meeting_room
    : null;

  if (
    typeof room !== "string" ||
    !/^hp-[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(room)
  ) {
    throw new PrivateHostError(
      "Meeting access denied",
      403
    );
  }

  const token = new AccessToken(
    input.livekitApiKey,
    input.livekitApiSecret,
    {
      identity: `hp-host-${input.verifiedUserId}`,
      ttl: "15m",
    }
  );

  token.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  return {
    token: await token.toJwt(),
    url: input.livekitUrl,
    room: room,
  };
}
