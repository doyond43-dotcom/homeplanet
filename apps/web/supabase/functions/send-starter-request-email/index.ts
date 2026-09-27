import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  escapeEmailHtml,
  HomePlanetEmailError,
  requiredEmailRecipient,
  sendHomePlanetEmail,
} from "../_shared/homeplanet-email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type StarterRequestPayload = {
  businessName?: string;
  customerName?: string;
  phone?: string;
  service?: string;
  address?: string;
  message?: string;
  livePageSlug?: string;
  boardUrl?: string;
};

function clean(value: unknown) {
  return String(value || "").trim();
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const adminEmail = requiredEmailRecipient(
      "CREATOR_CITY_ADMIN_EMAIL"
    );

    const body = (await req.json()) as StarterRequestPayload;

    const businessName = clean(body.businessName);
    const customerName = clean(body.customerName);
    const phone = clean(body.phone);
    const service = clean(body.service);
    const address = clean(body.address);
    const message = clean(body.message);
    const livePageSlug = clean(body.livePageSlug);
    const boardUrl = clean(body.boardUrl);

    if (!customerName || customerName.length < 2) {
      throw new HomePlanetEmailError(
        "A valid customer name is required.",
        { httpStatus: 400 }
      );
    }

    if (!phone) {
      throw new HomePlanetEmailError(
        "A phone number is required.",
        { httpStatus: 400 }
      );
    }

    const result = await sendHomePlanetEmail({
      recipient: adminEmail,
      project: "starter-live-page-request",
      subject: `New Request - ${businessName || "HomePlanet Live Page"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
          <h2 style="margin:0 0 18px;">New Live Page Request</h2>

          <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;margin-bottom:18px;">
            <div style="margin-bottom:8px;"><strong>Business:</strong> ${escapeEmailHtml(businessName || "Not provided")}</div>
            <div style="margin-bottom:8px;"><strong>Customer:</strong> ${escapeEmailHtml(customerName)}</div>
            <div style="margin-bottom:8px;"><strong>Phone:</strong> ${escapeEmailHtml(phone)}</div>
            <div style="margin-bottom:8px;"><strong>Service:</strong> ${escapeEmailHtml(service || "Not provided")}</div>
            <div><strong>Address:</strong> ${escapeEmailHtml(address || "Not provided")}</div>
          </div>

          <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;">
            <strong>Message:</strong>
            <div style="margin-top:10px;white-space:pre-wrap;line-height:1.6;">
              ${escapeEmailHtml(message || "No message added.")}
            </div>
          </div>

          ${
            boardUrl
              ? `
                <p style="margin-top:22px;">
                  <a href="${escapeEmailHtml(boardUrl)}">
                    Open Live Board
                  </a>
                </p>
              `
              : ""
          }

          ${
            livePageSlug
              ? `
                <p style="margin-top:12px;color:#666;font-size:13px;">
                  Live Page: ${escapeEmailHtml(livePageSlug)}
                </p>
              `
              : ""
          }
        </div>
      `,
    });

    return json({
      ok: true,
      accepted: result.accepted,
      provider: result.provider,
      messageId: result.messageId,
    });
  } catch (error) {
    const known = error instanceof HomePlanetEmailError;

    console.error("Starter request email failed", {
      provider: known ? error.provider : "resend",
      providerCode: known ? error.providerCode || null : null,
    });

    return json(
      {
        ok: false,
        accepted: false,
        error: known
          ? error.message
          : "Email notification failed.",
        ...(known
          ? {
              provider: error.provider,
              providerCode: error.providerCode || null,
            }
          : {}),
      },
      known ? error.httpStatus : 500
    );
  }
});