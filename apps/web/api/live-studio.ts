import type { VercelRequest, VercelResponse } from "@vercel/node";
import endMeeting from "../server/live-studio-endpoints/live-studio-end-meeting.js";
import guestAccess from "../server/live-studio-endpoints/live-studio-guest-access.js";
import guestReconnect from "../server/live-studio-endpoints/live-studio-guest-reconnect.js";
import invitations from "../server/live-studio-endpoints/live-studio-invitations.js";
import meetings from "../server/live-studio-endpoints/live-studio-meetings.js";
import privateHostToken from "../server/live-studio-endpoints/live-studio-private-host-token.js";
import startMeeting from "../server/live-studio-endpoints/live-studio-start-meeting.js";
import livekitToken from "../server/live-studio-endpoints/livekit-token.js";

const handlers: Record<string, (req: VercelRequest, res: VercelResponse) => Promise<unknown>> = {
  "live-studio-end-meeting": endMeeting,
  "live-studio-guest-access": guestAccess,
  "live-studio-guest-reconnect": guestReconnect,
  "live-studio-invitations": invitations,
  "live-studio-meetings": meetings,
  "live-studio-private-host-token": privateHostToken,
  "live-studio-start-meeting": startMeeting,
  "livekit-token": livekitToken,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  const route = req.query.route;
  if (typeof route !== "string" || !Object.prototype.hasOwnProperty.call(handlers, route)) {
    return res.status(404).json({ error: "Unknown Live Studio endpoint" });
  }
  return handlers[route](req, res);
}