import type { VercelRequest, VercelResponse } from "@vercel/node";
import { AccessToken } from "livekit-server-sdk";

/**
 * Normalize origins like:
 *  - "https://www.homeplanet.city/" -> "https://www.homeplanet.city"
 *  - "HTTP://LOCALHOST:5173" -> "http://localhost:5173"
 */
function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, "").toLowerCase();
}

function isAllowedOrigin(originRaw: string): boolean {
  const origin = normalizeOrigin(originRaw);

  // Allow localhost / 127.0.0.1 on any port (dev)
  if (/^http:\/\/localhost:\d+$/i.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1:\d+$/i.test(origin)) return true;

  // Allow production domains
  if (origin === "https://homeplanet.city") return true;
  if (origin === "https://www.homeplanet.city") return true;

  // Allow Vercel previews: https://something.vercel.app
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;

  return false;
}

function getAllowedOrigin(req: VercelRequest): string | null {
  const originRaw = String(req.headers.origin || "").trim();
  if (!originRaw) return null;
  if (!isAllowedOrigin(originRaw)) return null;
  // Return the original origin (but trimmed) so the browser sees an exact match
  return originRaw.trim().replace(/\/$/, "");
}

function q1(v: unknown): string {
  // Vercel can give string | string[] | undefined
  if (Array.isArray(v)) return String(v[0] ?? "");
  return String(v ?? "");
}

function jsonBody(req: VercelRequest): any {
  // @vercel/node parses JSON body when sent correctly
  // but this keeps us safe if it's undefined.
  return (req as any).body ?? {};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // --- CORS ---
  const allowedOrigin = getAllowedOrigin(req);
  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400"); // 24h preflight cache

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

    // Support both querystring AND JSON body
    const body = jsonBody(req);

    const room = (q1(req.query.room) || String(body.room || "")).trim();
    const identityRaw = (q1(req.query.identity) || String(body.identity || "")).trim();
    const nameRaw = (q1(req.query.name) || String(body.name || "")).trim();
    const role = (q1(req.query.role) || String(body.role || "")).trim(); // "host" | "viewer" | ""

    if (!room) return res.status(400).json({ error: "Missing room" });

    const identity =
      identityRaw ||
      `user_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;

    const name = nameRaw || identity;

    const isHost = role === "host";

    const at = new AccessToken(apiKey, apiSecret, { identity, name });
    at.addGrant({
      room,
      roomJoin: true,
      canPublish: isHost,
      canSubscribe: true,
      canPublishData: isHost,
    });

    const token = await at.toJwt();

    return res.status(200).json({ token, url: livekitUrl });
  } catch (err: any) {
    return res.status(500).json({
      error: "Token generation failed",
      detail: String(err?.message || err),
    });
  }
}

