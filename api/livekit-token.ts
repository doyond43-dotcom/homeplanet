import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AccessToken } from "livekit-server-sdk";

// CORS: allow localhost dev + production + common Vercel preview URLs
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

  // Allow Vercel preview domains (adjust if you want stricter)
  // Examples: https://homeplanet-abc123.vercel.app
  //           https://homeplanet-git-branchname-doyond43-dotcom.vercel.app
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return origin;

  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // --- CORS preflight + headers ---
  const allowedOrigin = getAllowedOrigin(req);
  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // no credentials needed here, so we do NOT set Allow-Credentials

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // avoid caching tokens
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
