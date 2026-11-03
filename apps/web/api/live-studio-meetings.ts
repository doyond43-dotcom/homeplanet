import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  verifyStudioHost,
  StudioAuthError,
} from "../server/lib/live-studio-auth";
import {
  createLiveStudioMeeting,
  listLiveStudioHostMeetings,
  MeetingRequestError,
} from "../server/lib/live-studio-meeting-service";

import {
  isLiveStudioProductionOriginAllowed,
} from "../server/lib/live-studio-origin";
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST" && req.method !== "GET") {
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

  if (req.method === "GET") {
    try {
      const result = await listLiveStudioHostMeetings({
        verifiedUserId: verifiedUser.id,
        supabaseUrl,
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error instanceof MeetingRequestError ? error.status : 503).json({
        error: error instanceof MeetingRequestError ? error.message : "Meeting list unavailable",
      });
    }
  }

  // Keep meeting creation disabled until security testing.
  if (process.env.LIVE_STUDIO_MEETING_CREATION_ENABLED !== "true") {
    return res.status(503).json({
      error: "Private meeting creation is not enabled yet",
    });
  }

  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      error: "Invalid request body",
    });
  }

  try {
    const meeting = await createLiveStudioMeeting({
      verifiedUserId: verifiedUser.id,
      title: body.title,
      businessId: body.businessId,
      supabaseUrl,
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    });

    return res.status(201).json(meeting);
  } catch (error) {
    if (error instanceof MeetingRequestError) {
      return res.status(error.status).json({
        error: error.message,
      });
    }

    return res.status(503).json({
      error: "Meeting service unavailable",
    });
  }
}
