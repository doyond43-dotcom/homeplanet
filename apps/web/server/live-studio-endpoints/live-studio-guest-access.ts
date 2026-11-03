import type { VercelRequest, VercelResponse } from "@vercel/node";

import {
  enterLiveStudioGuest,
  GuestEntryError,
} from "../lib/live-studio-guest-entry.js";

import {
  createGuestSessionCookie,
} from "../lib/live-studio-guest-cookie.js";

import {
  checkLiveStudioGuestRateLimit,
  GuestRateLimitError,
} from "../lib/live-studio-guest-rate-limit.js";

import {
  isLiveStudioProductionOriginAllowed,
} from "../lib/live-studio-origin.js";
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  if (
    !isLiveStudioProductionOriginAllowed(
      req.headers.origin,
      req.headers.host
    )
  ) {
    return res.status(403).json({
      error: "Request origin rejected",
    });
  }
  // Guest access remains OFF until security testing is complete.
  if (process.env.LIVE_STUDIO_GUEST_ACCESS_ENABLED !== "true") {
    return res.status(503).json({
      error: "Private guest access is not enabled yet",
    });
  }

  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      error: "Invalid request body",
    });
  }

  try {
    await checkLiveStudioGuestRateLimit({
      forwardedFor: req.headers["x-vercel-forwarded-for"],
      remoteAddress: req.socket?.remoteAddress,
      isVercel: process.env.VERCEL === "1",
      rateSecret: process.env.LIVE_STUDIO_GUEST_RATE_SECRET || "",
      supabaseUrl:
        process.env.SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL ||
        "",
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    });

    const result = await enterLiveStudioGuest({
      invitationToken: body.invitationToken,
      supabaseUrl:
        process.env.SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL ||
        "",
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      livekitUrl:
        process.env.LIVEKIT_URL ||
        process.env.VITE_LIVEKIT_URL ||
        "",
      livekitApiKey:
        process.env.LIVEKIT_API_KEY ||
        process.env.VITE_LIVEKIT_API_KEY ||
        "",
      livekitApiSecret: process.env.LIVEKIT_API_SECRET || "",
    });

    res.setHeader(
      "Set-Cookie",
      createGuestSessionCookie(result.reconnectSecret, true)
    );

    return res.status(200).json({
      token: result.token,
      url: result.url,
      room: result.room,
      guestRole: result.guestRole,
      sessionExpiresAt: result.sessionExpiresAt,
    });
  } catch (error) {
    if (error instanceof GuestRateLimitError) {
      return res.status(error.status).json({
        error: error.message,
      });
    }

    if (error instanceof GuestEntryError) {
      return res.status(error.status).json({
        error: error.message,
      });
    }

    return res.status(503).json({
      error: "Guest access service unavailable",
    });
  }
}
