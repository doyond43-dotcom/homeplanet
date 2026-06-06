import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AccessToken } from "livekit-server-sdk";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const room = String(req.query.room || "creator-live").trim();
    const role = String(req.query.role || "viewer").trim();
    const identityFromQuery = String(req.query.identity || "").trim();

    const livekitUrl = process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY || process.env.VITE_LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET || process.env.VITE_LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return res.status(501).json({
        error: "LiveKit not configured",
        need: ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"],
        got: {
          LIVEKIT_URL: !!livekitUrl,
          LIVEKIT_API_KEY: !!apiKey,
          LIVEKIT_API_SECRET: !!apiSecret,
        },
      });
    }

    const identity =
      identityFromQuery ||
      (role === "host"
        ? `host-${Math.random().toString(16).slice(2)}`
        : `viewer-${Math.random().toString(16).slice(2)}`);

    const name = role === "host" ? "Host" : "Viewer";

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name,
    });

    at.addGrant({
      roomJoin: true,
      room,
      canPublish: role === "host",
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return res.status(200).json({
      token,
      url: livekitUrl,
      room,
    });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
