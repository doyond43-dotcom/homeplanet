import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyStudioHost, StudioAuthError } from "../lib/live-studio-auth.js";
import { recordPrivateHostStart, StartMeetingError } from "../lib/live-studio-start-meeting.js";
import { isLiveStudioProductionOriginAllowed } from "../lib/live-studio-origin.js";
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isLiveStudioProductionOriginAllowed(req.headers.origin, req.headers.host)) return res.status(403).json({ error: "Request origin rejected" });
  if (process.env.LIVE_STUDIO_PRIVATE_HOST_JOIN_ENABLED !== "true") return res.status(503).json({ error: "Start-time service not enabled" });
  try {
    const host = await verifyStudioHost(String(req.headers.authorization || ""),
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
      process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "",
      process.env.LIVE_STUDIO_HOST_EMAILS || "");
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) return res.status(400).json({ error: "Invalid body" });
    const data = await recordPrivateHostStart({ verifiedUserId: host.id, meetingId: req.body.meetingId,
      supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "" });
    return res.status(200).json(data);
  } catch (error) {
    if (error instanceof StudioAuthError || error instanceof StartMeetingError) return res.status(error.status).json({ error: error.message });
    return res.status(503).json({ error: "Start-time service unavailable" });
  }
}
