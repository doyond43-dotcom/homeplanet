import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CleaningRequestPayload = {
  name?: string;
  phone?: string;
  address?: string;
  preferredTime?: string;
  serviceType?: string;
  bedrooms?: string;
  bathrooms?: string;
  pets?: string;
  condition?: string;
  notes?: string;
};

function clean(value: unknown) {
  return String(value || "").trim();
}

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
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const fromEmail =
      Deno.env.get("ORDER_FROM_EMAIL") || "onboarding@resend.dev";

    const adminEmail =
      Deno.env.get("ONLY_THE_ESSENTIALS_ADMIN_EMAIL") ||
      "Kaitlinlee863@gmail.com";

    const body = (await req.json()) as CleaningRequestPayload;

    const name = clean(body.name);
    const phone = clean(body.phone);
    const address = clean(body.address);
    const preferredTime = clean(body.preferredTime);
    const serviceType = clean(body.serviceType);
    const bedrooms = clean(body.bedrooms);
    const bathrooms = clean(body.bathrooms);
    const pets = clean(body.pets);
    const condition = clean(body.condition);
    const notes = clean(body.notes);

    if (!name || name.length < 2) {
      throw new Error("A valid name is required.");
    }

    await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `New Only The Essentials Request - ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
          <h2 style="margin:0 0 18px;">New Cleaning Request</h2>

          <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;margin-bottom:18px;">
            <div style="margin-bottom:8px;"><strong>Name:</strong> ${escapeHtml(name)}</div>
            <div style="margin-bottom:8px;"><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</div>
            <div style="margin-bottom:8px;"><strong>Address:</strong> ${escapeHtml(address || "Not provided")}</div>
            <div style="margin-bottom:8px;"><strong>Preferred:</strong> ${escapeHtml(preferredTime || "Not provided")}</div>
            <div style="margin-bottom:8px;"><strong>Service:</strong> ${escapeHtml(serviceType || "Not provided")}</div>
            <div style="margin-bottom:8px;"><strong>Bedrooms:</strong> ${escapeHtml(bedrooms || "Not provided")}</div>
            <div style="margin-bottom:8px;"><strong>Bathrooms:</strong> ${escapeHtml(bathrooms || "Not provided")}</div>
            <div style="margin-bottom:8px;"><strong>Pets:</strong> ${escapeHtml(pets || "Not provided")}</div>
            <div><strong>Condition:</strong> ${escapeHtml(condition || "Not provided")}</div>
          </div>

          <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;">
            <strong>Notes:</strong>
            <div style="margin-top:10px;white-space:pre-wrap;line-height:1.6;">
              ${escapeHtml(notes || "No extra notes added.")}
            </div>
          </div>

          <p style="margin-top:22px;">
            <a href="https://www.homeplanet.city/planet/only-the-essentials/intelligence">
              Open Only The Essentials Intelligence Board
            </a>
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";

    console.error("Only The Essentials request email failed:", message);

    return new Response(
      JSON.stringify({ ok: false, error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
