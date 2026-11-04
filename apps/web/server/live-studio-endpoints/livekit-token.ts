import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AccessToken } from "livekit-server-sdk";
import { randomUUID } from "node:crypto";
import { verifyStudioHost, StudioAuthError } from "../lib/live-studio-auth.js";
import { issueBroadcastInvite, verifyBroadcastInvite } from "../lib/live-studio-broadcast-invite.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const room = String(req.query.room || "").trim();
  const role = String(req.query.role || "").trim();
  if (room !== "creator-live" || !["host", "viewer", "invite"].includes(role)) {
    return res.status(403).json({ error: "Broadcast access denied" });
  }
  const signingSecret = process.env.LIVE_STUDIO_BROADCAST_INVITE_SECRET || "";
  if (role === "viewer") {
    try {
      if (!verifyBroadcastInvite(req.query.invite, signingSecret)) {
        return res.status(403).json({ error: "A valid private broadcast invitation is required" });
      }
    } catch {
      return res.status(503).json({ error: "Broadcast invitation service unavailable" });
    }
  } else {
    try {
      await verifyStudioHost(
        String(req.headers.authorization || ""),
        process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
        process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "",
        process.env.LIVE_STUDIO_HOST_EMAILS || ""
      );
    } catch (error) {
      if (error instanceof StudioAuthError) return res.status(error.status).json({ error: error.message });
      return res.status(503).json({ error: "Authentication service unavailable" });
    }
  }
  if (role === "invite") {
    try {
      return res.status(200).json({ invite: issueBroadcastInvite(signingSecret), expiresMinutes: 60 });
    } catch {
      return res.status(503).json({ error: "Broadcast invitation service unavailable" });
    }
  }
  const url = process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL || "";
  const apiKey = process.env.LIVEKIT_API_KEY || process.env.VITE_LIVEKIT_API_KEY || "";
  const apiSecret = process.env.LIVEKIT_API_SECRET || "";
  if (!url || !apiKey || !apiSecret) return res.status(503).json({ error: "LiveKit not configured" });
  try {
    const viewer = role === "viewer";
    const at = new AccessToken(apiKey, apiSecret, {
      identity: `${viewer ? "broadcast-viewer" : "broadcast-host"}-${randomUUID()}`,
      name: viewer ? "Viewer" : "Host",
      ttl: "15m",
    });
    at.addGrant({
      roomJoin: true, room: "creator-live", canPublish: !viewer,
      canSubscribe: true, canPublishData: true,
    });
    return res.status(200).json({ token: await at.toJwt(), url, room });
  } catch {
    return res.status(503).json({ error: "Broadcast connection unavailable" });
  }
}
