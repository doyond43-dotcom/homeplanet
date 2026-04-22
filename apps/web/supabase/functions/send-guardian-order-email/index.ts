import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type PetProfile = {
  name: string;
  type: string;
  breed: string;
  age: string;
  color: string;
  notes: string;
};

type OrderEmailPayload = {
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  payment_method: "cashapp" | "zelle";
  payment_amount: number | string;
  payment_memo: string;
  pet_count: number;
  setup_total: number | string;
  monthly_total: number | string;
  pets: PetProfile[];
};

function asMoney(value: number | string) {
  const n = Number(value);
  if (Number.isFinite(n)) return `$${n.toFixed(2)}`;
  return `$${value}`;
}

function petHtml(pet: PetProfile, index: number) {
  return `
    <div style="margin-bottom:16px;padding:12px;border:1px solid #d9d9d9;border-radius:10px;">
      <div style="font-weight:700;margin-bottom:6px;">Pet ${index + 1}: ${pet.name || "Unnamed"}</div>
      <div>${pet.type || "-"} • ${pet.breed || "-"} • ${pet.age || "-"} • ${pet.color || "-"}</div>
      ${pet.notes ? `<div style="margin-top:8px;color:#555;">Notes: ${pet.notes}</div>` : ""}
    </div>
  `;
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
    const fromEmail = Deno.env.get("ORDER_FROM_EMAIL") || "onboarding@resend.dev";
    const adminEmail = Deno.env.get("ORDER_ADMIN_EMAIL") || "dannyscandys@gmail.com";

    const body = (await req.json()) as OrderEmailPayload;

    const shippingLine = `${body.shipping_address}, ${body.shipping_city}, ${body.shipping_state} ${body.shipping_zip}`;
    const petsMarkup = (body.pets || []).map((pet, index) => petHtml(pet, index)).join("");

    const adminSubject = `New Guardian Order - ${body.customer_name} - ${body.order_id}`;
    const customerSubject = `Guardian Order Received - ${body.order_id}`;

    await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: adminSubject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
          <h2 style="margin:0 0 16px;">New Guardian Pet Tag Order</h2>

          <div style="margin-bottom:18px;padding:14px;border:1px solid #d9d9d9;border-radius:12px;">
            <div><strong>Order ID:</strong> ${body.order_id}</div>
            <div><strong>Customer:</strong> ${body.customer_name}</div>
            <div><strong>Email:</strong> ${body.customer_email}</div>
            <div><strong>Phone:</strong> ${body.customer_phone || "-"}</div>
            <div><strong>Shipping:</strong> ${shippingLine}</div>
          </div>

          <div style="margin-bottom:18px;padding:14px;border:1px solid #d9d9d9;border-radius:12px;">
            <div><strong>Payment Method:</strong> ${body.payment_method}</div>
            <div><strong>Payment Amount:</strong> ${asMoney(body.payment_amount)}</div>
            <div><strong>Payment Memo:</strong> ${body.payment_memo}</div>
            <div><strong>Setup Total:</strong> ${asMoney(body.setup_total)}</div>
            <div><strong>Monthly Total:</strong> ${asMoney(body.monthly_total)}/month</div>
            <div><strong>Pet Count:</strong> ${body.pet_count}</div>
          </div>

          <h3 style="margin:24px 0 12px;">Pet Profiles</h3>
          ${petsMarkup || "<div>No pet profiles provided.</div>"}
        </div>
      `,
    });

    await resend.emails.send({
      from: fromEmail,
      to: [body.customer_email],
      subject: customerSubject,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
          <h2 style="margin:0 0 16px;">Your Guardian order is in</h2>

          <div style="margin-bottom:18px;padding:14px;border:1px solid #d9d9d9;border-radius:12px;">
            <div><strong>Order ID:</strong> ${body.order_id}</div>
            <div><strong>Name:</strong> ${body.customer_name}</div>
            <div><strong>Payment Method:</strong> ${body.payment_method}</div>
            <div><strong>Setup Total:</strong> ${asMoney(body.setup_total)}</div>
            <div><strong>Monthly Total:</strong> ${asMoney(body.monthly_total)}/month</div>
          </div>

          <p>We received your Guardian pet tag order and your pet profile information.</p>
          <p>Next step: we review the order, process the tag, and reach out if anything is needed.</p>
          <p>You can reply to this email if you need to update anything.</p>

          <h3 style="margin:24px 0 12px;">Pet Profiles</h3>
          ${petsMarkup || "<div>No pet profiles provided.</div>"}
        </div>
      `,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
