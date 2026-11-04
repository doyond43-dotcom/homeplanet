import type { VercelRequest, VercelResponse } from "@vercel/node";

import {
  verifyStudioHost,
  StudioAuthError,
} from "../lib/live-studio-auth.js";

import {
  createPrivateHostToken,
  PrivateHostError,
} from "../lib/live-studio-private-host.js";

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

  // Reuse the existing meeting activation switch.
  if (
    process.env.LIVE_STUDIO_PRIVATE_HOST_JOIN_ENABLED !== "true"
  ) {
    return res.status(503).json({
      error: "Private host access is not enabled yet",
    });
  }

  let verifiedUser;

  try {
    verifiedUser = await verifyStudioHost(
      String(req.headers.authorization || ""),
      process.env.SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL ||
        "",
      process.env.SUPABASE_ANON_KEY ||
        process.env.VITE_SUPABASE_ANON_KEY ||
        "",
      process.env.LIVE_STUDIO_HOST_EMAILS || ""
    );
  } catch (error) {
    if (error instanceof StudioAuthError) {
      return res.status(error.status).json({
        error: error.message,
      });
    }

    return res.status(503).json({
      error: "Authentication service unavailable",
    });
  }

  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return res.status(400).json({
      error: "Invalid request body",
    });
  }

  try {
    const result = await createPrivateHostToken({
      verifiedUserId: verifiedUser.id,
      meetingId: req.body.meetingId,
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

    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof PrivateHostError) {
      return res.status(error.status).json({
        error: error.message,
      });
    }

    return res.status(503).json({
      error: "Private host service unavailable",
    });
  }
}
