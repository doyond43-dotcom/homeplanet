import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CowTownInquiryPayload = {
  inquiry_id?: string | null;
  name: string;
  contact: string;
  ranch_or_business?: string | null;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const fromEmail =
      Deno.env.get("ORDER_FROM_EMAIL") || "onboarding@resend.dev";

    const adminEmail =
      Deno.env.get("COW_TOWN_ADMIN_EMAIL") ||
      "homeplanetlive@gmail.com";

    const body = (await req.json()) as CowTownInquiryPayload;

    const name = body.name?.trim();
    const contact = body.contact?.trim();
    const ranchOrBusiness = body.ranch_or_business?.trim() || "";
    const message = body.message?.trim();

    if (!name || name.length < 2) {
      throw new Error("A valid name is required.");
    }

    if (!contact || contact.length < 5) {
      throw new Error("A valid phone number or email is required.");
    }

    if (!message || message.length < 5) {
      throw new Error("A message is required.");
    }

    await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `New Cow Town Tags Inquiry - ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
          <h2 style="margin:0 0 18px;">
            New Cow Town Tags Inquiry
          </h2>

          <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;margin-bottom:18px;">
            ${
              body.inquiry_id
                ? `<div style="margin-bottom:8px;"><strong>Inquiry ID:</strong> ${escapeHtml(body.inquiry_id)}</div>`
                : ""
            }

            <div style="margin-bottom:8px;">
              <strong>Name:</strong> ${escapeHtml(name)}
            </div>

            <div style="margin-bottom:8px;">
              <strong>Phone or email:</strong> ${escapeHtml(contact)}
            </div>

            <div>
              <strong>Ranch or business:</strong>
              ${ranchOrBusiness ? escapeHtml(ranchOrBusiness) : "Not provided"}
            </div>
          </div>

          <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;">
            <strong>Message:</strong>

            <div style="margin-top:10px;white-space:pre-wrap;line-height:1.6;">
              ${escapeHtml(message)}
            </div>
          </div>

          <p style="margin-top:22px;color:#666;">
            Submitted through the Cow Town Tags contact drawer.
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";

    console.error("Cow Town inquiry email failed:", message);

    return new Response(
      JSON.stringify({
        ok: false,
        error: message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
