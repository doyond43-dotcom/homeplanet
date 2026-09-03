import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  HomePlanetSmsError,
  sendHomePlanetSms,
} from "../server/lib/homeplanet-sms.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "authorization, content-type"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  try {
    const authorization = String(req.headers.authorization || "");

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        error: "Authentication required.",
      });
    }

    const supabaseUrl =
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const anonKey =
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return res.status(500).json({
        ok: false,
        error: "Supabase server configuration missing.",
      });
    }

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: authorization,
        apikey: anonKey,
      },
    });

    if (!userResponse.ok) {
      return res.status(401).json({
        ok: false,
        error: "Invalid session.",
      });
    }

    const to = String(req.body?.to || "").trim();
    const message = String(req.body?.message || "").trim();
    const secureLink = String(req.body?.secureLink || "").trim();

    if (!to || !message) {
      return res.status(400).json({
        ok: false,
        error: "Phone number and message are required.",
      });
    }

    const result = await sendHomePlanetSms({
      recipientPhone: to,
      messageBody: message,
      project: "marshall-document-request",
      secureLink,
    });

    return res.status(200).json({
      ok: true,
      accepted: result.accepted,
      sid: result.sid,
      status: result.status,
    });
  } catch (error) {
    console.error("Marshall SMS API failed", {
      providerStatus:
        error instanceof HomePlanetSmsError
          ? error.providerStatus || null
          : null,
      providerCode:
        error instanceof HomePlanetSmsError
          ? error.providerCode || null
          : null,
    });

    return res.status(
      error instanceof HomePlanetSmsError ? error.httpStatus : 500
    ).json({
      ok: false,
      accepted: false,
      error:
        error instanceof Error ? error.message : "SMS could not be sent.",
      ...(error instanceof HomePlanetSmsError
        ? {
            providerStatus: error.providerStatus || null,
            providerCode: error.providerCode || null,
          }
        : {}),
    });
  }
}
