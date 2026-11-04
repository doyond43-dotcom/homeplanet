import { createClient } from "@supabase/supabase-js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export class StartMeetingError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
  }
}
export async function recordPrivateHostStart(input: { verifiedUserId: string; meetingId: unknown; supabaseUrl: string; serviceKey: string }) {
  if (!UUID.test(input.verifiedUserId) || typeof input.meetingId !== "string" || !UUID.test(input.meetingId)) {
    throw new StartMeetingError("Invalid meeting ID", 400);
  }
  if (!input.supabaseUrl || !input.serviceKey) throw new StartMeetingError("Start-time service unavailable", 503);
  const client = createClient(input.supabaseUrl, input.serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.rpc("live_studio_mark_host_started", { p_actor_user_id: input.verifiedUserId, p_meeting_id: input.meetingId });
  if (error) throw new StartMeetingError("Start-time service unavailable", 503);
  const row = Array.isArray(data) ? data[0] : null;
  if (!row?.meeting_started_at) throw new StartMeetingError("Meeting unavailable", 403);
  return { startedAt: row.meeting_started_at };
}
