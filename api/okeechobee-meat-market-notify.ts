import type { VercelRequest, VercelResponse } from "@vercel/node";

function getAllowedOrigin(req: VercelRequest): string | null {
  const origin = String(req.headers.origin || "").trim();
  if (!origin) return null;

  const exactAllow = new Set<string>([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://www.homeplanet.city",
    "https://homeplanet.city",
  ]);

  if (exactAllow.has(origin)) return origin;

  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
    return origin;
  }

  return null;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const allowedOrigin = getAllowedOrigin(req);

  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.MARKET_NOTIFY_EMAIL;
    const fromEmail =
      process.env.MARKET_FROM_EMAIL || "onboarding@resend.dev";

    if (!apiKey || !notifyEmail) {
      return res.status(500).json({
        error: "Missing email configuration",
        missing: {
          RESEND_API_KEY: !apiKey,
          MARKET_NOTIFY_EMAIL: !notifyEmail,
        },
      });
    }

    const body = req.body || {};

    const businessName = String(body.businessName || "").trim();
    const contactName = String(body.contactName || "").trim();
    const contact = String(body.contact || "").trim();
    const products = String(body.products || "").trim();
    const price = String(body.price || "").trim();
    const fulfillment = String(body.fulfillment || "").trim();
    const location = String(body.location || "").trim();
    const link = String(body.link || "").trim();
    const notes = String(body.notes || "").trim();

    if (!businessName || !contactName || !contact || !products) {
      return res.status(400).json({
        error: "Missing required seller information",
      });
    }

    const text = [
      "New Okeechobee Live Meat Market submission",
      "",
      `Ranch / Business: ${businessName}`,
      `Contact Name: ${contactName}`,
      `Best Contact: ${contact}`,
      `Selling: ${products}`,
      `Price / Package: ${price || "Not provided"}`,
      `Pickup / Delivery: ${fulfillment || "Not provided"}`,
      `Location: ${location || "Okeechobee"}`,
      `Website / Facebook / Order Link: ${link || "Not provided"}`,
      `Notes: ${notes || "None"}`,
      "",
      "Status: Pending Review",
    ].join("\n");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Okeechobee Live Meat Market <${fromEmail}>`,
        to: [notifyEmail],
        subject: `New Meat Market Seller: ${businessName}`,
        text,
      }),
    });

    const result = await emailResponse.json().catch(() => null);

    if (!emailResponse.ok) {
      console.error("Resend error:", result);

      return res.status(502).json({
        error: "Email provider rejected the notification",
        detail: result,
      });
    }

    return res.status(200).json({
      ok: true,
      id: result?.id || null,
    });
  } catch (error: any) {
    console.error("Market notification error:", error);

    return res.status(500).json({
      error: "Notification failed",
      detail: String(error?.message || error),
    });
  }
}
