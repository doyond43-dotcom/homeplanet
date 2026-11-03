import type {
  VercelRequest,
  VercelResponse,
} from "@vercel/node";

import { getActiveInvitationRoom } from "../server/lib/live-studio-invitation-room";
import {
  reconnectLiveStudioGuest,
} from "../server/lib/live-studio-guest-reconnect";

import {
  createGuestSessionCookie,
  readGuestSessionCookie,
} from "../server/lib/live-studio-guest-cookie";

import {
  checkLiveStudioGuestRateLimit,
  GuestRateLimitError,
} from "../server/lib/live-studio-guest-rate-limit";

import {
  GuestSessionError,
} from "../server/lib/live-studio-guest-session-service";

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

  // Keep reconnect disabled with the rest of guest access.
  if (process.env.LIVE_STUDIO_GUEST_ACCESS_ENABLED !== "true") {
    return res.status(503).json({
      error: "Private guest access is not enabled yet",
    });
  }

  // Require an actual same-origin browser request.
  const origin = req.headers.origin;
  const host = req.headers.host;

  if (
    typeof origin !== "string" ||
    typeof host !== "string"
  ) {
    return res.status(403).json({
      error: "Request origin rejected",
    });
  }

  try {
    const parsed = new URL(origin);

    if (
      parsed.protocol !== "https:" ||
      parsed.host !== host ||
      parsed.username ||
      parsed.password
    ) {
      return res.status(403).json({
        error: "Request origin rejected",
      });
    }
  } catch {
    return res.status(403).json({
      error: "Request origin rejected",
    });
  }

  const isProduction = true;

  const reconnectSecret = readGuestSessionCookie(
    req.headers.cookie,
    isProduction
  );

  if (!reconnectSecret) {
    return res.status(403).json({
      error: "Guest reconnect session unavailable",
    });
  }

  const expectedRoom = await getActiveInvitationRoom({
    invitationToken: req.body?.invitationToken,
    supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "",
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  });
  if (!expectedRoom) return res.status(403).json({ error: "Invitation no longer authorizes this meeting" });

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
      serviceKey:
        process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    });

    const result = await reconnectLiveStudioGuest({
      reconnectSecret,
      recoveryKey:
        process.env.LIVE_STUDIO_RECONNECT_RECOVERY_KEY || "",
      supabaseUrl:
        process.env.SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL ||
        "",
      serviceKey:
        process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      livekitUrl:
        process.env.LIVEKIT_URL ||
        process.env.VITE_LIVEKIT_URL ||
        "",
      livekitApiKey:
        process.env.LIVEKIT_API_KEY ||
        process.env.VITE_LIVEKIT_API_KEY ||
        "",
      livekitApiSecret:
        process.env.LIVEKIT_API_SECRET || "",
    });

    if (result.room !== expectedRoom) {
      return res.status(403).json({ error: "Reconnect session belongs to a different meeting" });
    }

    res.setHeader(
      "Set-Cookie",
      createGuestSessionCookie(
        result.reconnectSecret,
        isProduction
      )
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

    if (error instanceof GuestSessionError) {
      return res.status(error.status).json({
        error: error.message,
      });
    }

    return res.status(503).json({
      error: "Guest reconnect service unavailable",
    });
  }
}
