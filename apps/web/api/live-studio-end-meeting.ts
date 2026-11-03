import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyStudioHost, StudioAuthError } from "../server/lib/live-studio-auth";
import { endLiveStudioMeeting, EndMeetingError } from "../server/lib/live-studio-end-meeting";
import { isLiveStudioProductionOriginAllowed } from "../server/lib/live-studio-origin";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isLiveStudioProductionOriginAllowed(req.headers.origin, req.headers.host))
    return res.status(403).json({ error: "Request origin rejected" });
  if (process.env.LIVE_STUDIO_PRIVATE_HOST_JOIN_ENABLED !== "true")
    return res.status(503).json({ error: "Private meetings are not enabled" });
  try {
    const verified = await verifyStudioHost(
      String(req.headers.authorization || ""),
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
      process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "",
      process.env.LIVE_STUDIO_HOST_EMAILS || ""
    );
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
      return res.status(400).json({ error: "Invalid request body" });
    const result = await endLiveStudioMeeting({
      verifiedUserId: verified.id, meetingId: req.body.meetingId,
      supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      livekitUrl: process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL || "",
      livekitApiKey: process.env.LIVEKIT_API_KEY || process.env.VITE_LIVEKIT_API_KEY || "",
      livekitApiSecret: process.env.LIVEKIT_API_SECRET || "",
    });
    return res.status(200).json(result);
  } catch (error) {
    const known = error instanceof StudioAuthError || error instanceof EndMeetingError;
    return res.status(known ? error.status : 503).json({
      error: known ? error.message : "End meeting service unavailable",
    });
  }
}
