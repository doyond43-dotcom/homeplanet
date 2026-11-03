import type { VercelRequest, VercelResponse } from "@vercel/node";

import {
  verifyStudioHost,
  StudioAuthError,
} from "../server/lib/live-studio-auth.js";

import {
  createLiveStudioInvitation,
  InvitationRequestError,
} from "../server/lib/live-studio-invitation-service.js";

import {
  isLiveStudioProductionOriginAllowed,
} from "../server/lib/live-studio-origin.js";
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
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
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "";

  let verifiedUser;

  try {
    verifiedUser = await verifyStudioHost(
      String(req.headers.authorization || ""),
      supabaseUrl,
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

  // Invitation creation stays OFF until security testing.
  if (
    process.env.LIVE_STUDIO_INVITATION_CREATION_ENABLED !== "true"
  ) {
    return res.status(503).json({
      error: "Private invitations are not enabled yet",
    });
  }

  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      error: "Invalid request body",
    });
  }

  try {
    const invitation = await createLiveStudioInvitation({
      verifiedUserId: verifiedUser.id,
      meetingId: body.meetingId,
      guestRole: body.guestRole,
      invitedEmail: body.invitedEmail,
      expiresMinutes: body.expiresMinutes,
      maxUses: body.maxUses,
      supabaseUrl,
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    });

    return res.status(201).json(invitation);
  } catch (error) {
    if (error instanceof InvitationRequestError) {
      return res.status(error.status).json({
        error: error.message,
      });
    }

    return res.status(503).json({
      error: "Invitation service unavailable",
    });
  }
}
