import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export async function getActiveInvitationRoom(input: {
  invitationToken: unknown;
  supabaseUrl: string;
  serviceKey: string;
}): Promise<string | null> {
  if (typeof input.invitationToken !== "string" || !/^[0-9a-f]{64}$/.test(input.invitationToken)) return null;
  if (!input.supabaseUrl || !input.serviceKey) return null;
  const client = createClient(input.supabaseUrl, input.serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const invitationHash = createHash("sha256").update(input.invitationToken).digest("hex");
  const { data, error } = await client.rpc("live_studio_room_for_invitation", {
    p_invitation_hash: invitationHash,
  });
  if (error) return null;
  const record = Array.isArray(data) ? data[0] : null;
  return typeof record?.meeting_room === "string" ? record.meeting_room : null;
}
