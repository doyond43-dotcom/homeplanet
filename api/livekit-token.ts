import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AccessToken } from "livekit-server-sdk";

/**
 * /api/livekit-token
 * Adds CORS support so localhost dev can call the deployed endpoint.
 */

const ALLOWED_ORIGINS = new Set<string>([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://www.homeplanet.city",
  "https://homeplanet.city",
]);

function applyCors(req: VercelRequest, res: VercelResponse) {
  const origin = String(req.headers.origin || "");

  // Allow known origins + Vercel preview deployments (*.vercel.app)
  const isVercelPreview =
    origin.endsWith(".vercel.app") && origin.startsWith("https://");

  if (ALLOWED_ORIGINS.has(origin) || isVercelPreview) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin"); // important when reflecting origin
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ Always apply CORS headers (even on errors)
  applyCors(req, res);

  // ✅ Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Optional: lock to GET only
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const livekitUrl = process.env.LIVEKIT_URL;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!livekitUrl || !apiKey || !apiSecret) {
      return res.status(500).json({
        error: "Missing LIVEKIT env vars",
        missing: {
          LIVEKIT_URL: !livekitUrl,
          LIVEKIT_API_KEY: !apiKey,
          LIVEKIT_API_SECRET: !apiSecret,
        },
      });
    }

    const room = String(req.query.room || "").trim();
    const identity =
      String(req.query.identity || "").trim() ||
      `user_${Math.random().toString(36).slice(2)}`;
    const name = String(req.query.name || "").trim() || identity;
    const role = String(req.query.role || "").trim(); // "host" | "viewer" | ""

    if (!room) return res.status(400).json({ error: "Missing room" });

    const isHost = role === "host";

    const at = new AccessToken(apiKey, apiSecret, { identity, name });
    at.addGrant({
      room,
      roomJoin: true,
      canPublish: isHost,
      canSubscribe: true,
      canPublishData: isHost,
    });

    // IMPORTANT: in your SDK version, toJwt() is async
    const token = await at.toJwt();

    return res.status(200).json({ token, url: livekitUrl });
  } catch (err: any) {
    return res.status(500).json({
      error: "Token generation failed",
      detail: String(err?.message || err),
    });
  }
}
