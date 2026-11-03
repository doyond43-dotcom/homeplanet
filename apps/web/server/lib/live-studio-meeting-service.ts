import { createClient } from "@supabase/supabase-js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class MeetingRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "MeetingRequestError";
  }
}

export async function createLiveStudioMeeting(input: {
  verifiedUserId: string;
  title: unknown;
  businessId: unknown;
  supabaseUrl: string;
  serviceKey: string;
}) {
  if (!UUID_PATTERN.test(input.verifiedUserId)) {
    throw new MeetingRequestError("Invalid verified user", 403);
  }

  if (
    typeof input.title !== "string" ||
    input.title.trim().length < 1 ||
    input.title.trim().length > 200
  ) {
    throw new MeetingRequestError("Invalid meeting title", 400);
  }

  const businessId = input.businessId ?? null;

  if (
    businessId !== null &&
    (typeof businessId !== "string" ||
      !UUID_PATTERN.test(businessId))
  ) {
    throw new MeetingRequestError("Invalid business ID", 400);
  }

  if (!input.supabaseUrl || !input.serviceKey) {
    throw new MeetingRequestError("Meeting service unavailable", 503);
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

  const { data, error } = await supabase.rpc(
    "live_studio_create_meeting",
    {
      p_actor_user_id: input.verifiedUserId,
      p_business_id: businessId,
      p_title: input.title.trim(),
    }
  );

  if (error) {
    if (
      error.message?.includes(
        "Business ownership verification failed"
      )
    ) {
      throw new MeetingRequestError(
        "Business access denied",
        403
      );
    }

    throw new MeetingRequestError(
      "Meeting creation unavailable",
      503
    );
  }

  const meeting = Array.isArray(data) ? data[0] : null;

  if (
    typeof meeting?.meeting_id !== "string" ||
    typeof meeting?.meeting_room !== "string"
  ) {
    throw new MeetingRequestError(
      "Invalid meeting response",
      503
    );
  }

  return {
    meetingId: meeting.meeting_id,
    roomName: meeting.meeting_room,
  };
}

export async function listLiveStudioHostMeetings(input: {
  verifiedUserId: string;
  supabaseUrl: string;
  serviceKey: string;
}) {
  if (!UUID_PATTERN.test(input.verifiedUserId)) {
    throw new MeetingRequestError("Invalid verified user", 403);
  }

  if (!input.supabaseUrl || !input.serviceKey) {
    throw new MeetingRequestError("Meeting service unavailable", 503);
  }

  const client = createClient(input.supabaseUrl, input.serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await client.rpc(
    "live_studio_list_host_meetings",
    { p_actor_user_id: input.verifiedUserId }
  );

  if (error || !Array.isArray(data)) {
    throw new MeetingRequestError("Unable to load meetings", 503);
  }

  // Host-scoped metadata RPC is server-only and uses the same ownership rules
  // as the meeting list. Do not expose the private schema to public clients.
  const { data: details, error: detailsError } = await client.rpc(
    "live_studio_host_meeting_history_metadata",
    { p_actor_user_id: input.verifiedUserId }
  );

  if (detailsError) {
    console.error("[Live Studio] Meeting history metadata unavailable:", detailsError.message);
  }

  const detailsById = new Map<string, {
    scheduledAt: string | null;
    startedAt: string | null;
    endedAt: string | null;
  }>();

  if (Array.isArray(details)) {
    for (const item of details) {
      if (typeof item.meeting_id === "string") {
        detailsById.set(item.meeting_id, {
          scheduledAt: item.meeting_scheduled_at ?? null,
          startedAt: item.meeting_started_at ?? null,
          endedAt: item.meeting_ended_at ?? null,
        });
      }
    }
  }

  return {
    meetings: data.map((item) => ({
      meetingId: item.meeting_id,
      title: item.meeting_title,
      status: item.meeting_status,
      createdAt: item.meeting_created_at,
      scheduledAt: detailsById.get(item.meeting_id)?.scheduledAt ?? null,
      startedAt: detailsById.get(item.meeting_id)?.startedAt ?? null,
      endedAt: detailsById.get(item.meeting_id)?.endedAt ?? null,
    })),
  };
}
