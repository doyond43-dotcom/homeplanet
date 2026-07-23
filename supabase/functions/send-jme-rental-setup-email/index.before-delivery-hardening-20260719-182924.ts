import { Resend } from "npm:resend";

const resend = new Resend(
  Deno.env.get("RESEND_API_KEY"),
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":
    "POST, OPTIONS",
};

type Payload = {
  equipment_status: Record<string, string>;
  equipment_labels: Record<string, string>;
  rental_periods: string[];
  rental_period_notes: string | null;
  pickup_delivery: string[];
  delivery_pricing_method: string | null;
  delivery_notes: string | null;
  deposit_requirement: string | null;
  agreement_required: string | null;
  bobcat_attachments: string[];
  attachment_notes: string | null;
  additional_notes: string | null;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function prettyValue(value: string | null | undefined) {
  if (!value) return "Not answered";

  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function listHtml(values: string[]) {
  if (!values?.length) {
    return "<em>None selected</em>";
  }

  return `
    <ul style="margin:8px 0 0;padding-left:20px;">
      ${values
        .map(
          (value) =>
            `<li>${escapeHtml(value)}</li>`,
        )
        .join("")}
    </ul>
  `;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed",
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    const body =
      (await req.json()) as Payload;

    const fromEmail =
      Deno.env.get("ORDER_FROM_EMAIL") ||
      "onboarding@resend.dev";

    const adminEmail =
      Deno.env.get("JME_SETUP_ADMIN_EMAIL") ||
      "homeplanetlive@gmail.com";

    const equipmentRows =
      Object.entries(
        body.equipment_status || {},
      )
        .map(([id, status]) => {
          const label =
            body.equipment_labels?.[id] || id;

          return `
            <tr>
              <td style="padding:9px 10px;border-bottom:1px solid #ddd;">
                ${escapeHtml(label)}
              </td>
              <td style="padding:9px 10px;border-bottom:1px solid #ddd;font-weight:700;">
                ${escapeHtml(
                  prettyValue(status),
                )}
              </td>
            </tr>
          `;
        })
        .join("");

    await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject:
        "JME Rental Setup Submitted",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:760px;margin:0 auto;padding:24px;color:#181818;">
          <h1 style="margin:0 0 8px;">
            JME Rental Setup Submitted
          </h1>

          <p style="margin:0 0 24px;color:#666;">
            Jones Equipment Rental & Repair
          </p>

          <h2>Equipment Status</h2>

          <table style="width:100%;border-collapse:collapse;border:1px solid #ddd;margin-bottom:26px;">
            <tbody>
              ${equipmentRows}
            </tbody>
          </table>

          <h2>Rental Periods</h2>
          ${listHtml(
            body.rental_periods || [],
          )}

          <p>
            <strong>Pricing notes:</strong><br />
            ${escapeHtml(
              body.rental_period_notes ||
                "No notes",
            )}
          </p>

          <h2>Pickup / Delivery</h2>
          ${listHtml(
            body.pickup_delivery || [],
          )}

          <p>
            <strong>Delivery pricing:</strong><br />
            ${escapeHtml(
              prettyValue(
                body.delivery_pricing_method,
              ),
            )}
          </p>

          <p>
            <strong>Delivery notes:</strong><br />
            ${escapeHtml(
              body.delivery_notes ||
                "No notes",
            )}
          </p>

          <h2>Deposit / Agreement</h2>

          <p>
            <strong>Deposit:</strong>
            ${escapeHtml(
              prettyValue(
                body.deposit_requirement,
              ),
            )}
          </p>

          <p>
            <strong>Rental agreement:</strong>
            ${escapeHtml(
              prettyValue(
                body.agreement_required,
              ),
            )}
          </p>

          <h2>Bobcat Attachments</h2>
          ${listHtml(
            body.bobcat_attachments || [],
          )}

          <p>
            <strong>Attachment notes:</strong><br />
            ${escapeHtml(
              body.attachment_notes ||
                "No notes",
            )}
          </p>

          <h2>Additional Equipment / Notes</h2>

          <p>
            ${escapeHtml(
              body.additional_notes ||
                "Nothing additional submitted",
            )}
          </p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error(
      "JME rental setup email failed",
      error,
    );

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Email delivery failed",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});