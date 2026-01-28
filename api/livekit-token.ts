import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AccessToken } from "livekit-server-sdk";

// --------------------------------------------------
// CORS helper
// --------------------------------------------------
function getAllowedOrigin(req: VercelRequest): string | null {
  const origin = String(req.headers.origin || "").trim();
  if (!origin) return null;

  const exactAllow = new Set<string>([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://www.homeplanet.city",
    "https://homeplanet.city",
  ]);

  if (exactAllow.has(origin)) return origin;

  // Allow Vercel previews
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return origin;

  return null;
}

// --------------------------------------------------
// Handler
// --------------------------------------------------
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const allowedOrigin = getAllowedOrigin(req);

  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  res.setHeader("Cache-Control", "no-store");

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

    // --------------------------------------------------
    // Accept params from query OR body
    // --------------------------------------------------
    const q = req.method === "POST" ? req.body || {} : req.query;

    const room = String(q.room || "").trim();

    if (!room) {
      return res.status(400).json({ error: "Missing room" });
    }

    const identity =
      String(q.identity || "").trim() ||
      `user_${Math.random().toString(36).slice(2)}`;

    const name = String(q.name || "").trim() || identity;

    const role = String(q.role || "").trim();

    // --------------------------------------------------
    // FORCE publish rights for creators
    // --------------------------------------------------
    const isHost = role !== "viewer";

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name,
    });

    at.addGrant({
      room,
      roomJoin: true,

      // 🔥 FORCE mic/cam publishing
      canPublish: true,
      canPublishData: true,

      canSubscribe: true,
    });

    const token = await at.toJwt();

    return res.status(200).json({
      token,
      url: livekitUrl,
      debug: {
        room,
        identity,
        name,
        role,
        forcedHost: true,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      error: "Token generation failed",
      detail: String(err?.message || err),
    });
  }
}

