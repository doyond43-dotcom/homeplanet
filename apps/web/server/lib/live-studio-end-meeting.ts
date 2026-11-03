import { createClient } from "@supabase/supabase-js";
import { RoomServiceClient } from "livekit-server-sdk";

const uuid = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
export class EndMeetingError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}

export async function endLiveStudioMeeting(input: {
  verifiedUserId: string;
  meetingId: unknown;
  supabaseUrl: string;
  serviceKey: string;
  livekitUrl: string;
  livekitApiKey: string;
  livekitApiSecret: string;
}) {
  if (typeof input.meetingId !== "string" || !uuid.test(input.meetingId)) {
    throw new EndMeetingError("Invalid meeting ID", 400);
  }
  if (!uuid.test(input.verifiedUserId)) {
    throw new EndMeetingError("Not authorized", 403);
  }
  if (!input.supabaseUrl || !input.serviceKey || !input.livekitUrl ||
      !input.livekitApiKey || !input.livekitApiSecret) {
    throw new EndMeetingError("Meeting service unavailable", 503);
  }
  const client = createClient(input.supabaseUrl, input.serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.rpc("live_studio_end_host_meeting", {
    p_actor_user_id: input.verifiedUserId,
    p_meeting_id: input.meetingId,
  });
  if (error) throw new EndMeetingError("Unable to end meeting", 503);
  const record = Array.isArray(data) ? data[0] : null;
  if (typeof record?.meeting_room !== "string") {
    throw new EndMeetingError("Meeting not found or already ended", 409);
  }

  // End the persisted meeting first. LiveKit cleanup is separate infrastructure.
  // A failure here is reported explicitly, never mistaken for a still-live meeting.
  try {
    const rooms = new RoomServiceClient(input.livekitUrl.replace(/^wss:/, "https:").replace(/^ws:/, "http:"), input.livekitApiKey, input.livekitApiSecret);
    await rooms.deleteRoom(record.meeting_room);
    return { meetingId: input.meetingId, status: "ended", cleanupPending: false };
  } catch (error) {
    console.error("[Live Studio] Room cleanup failed:", {
      message: error instanceof Error ? error.message : "Unknown error",
      code: typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : "unknown",
    });
    return { meetingId: input.meetingId, status: "ended", cleanupPending: true };
  }
}
