type NotifyBody = {
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

function buildMessage(body: NotifyBody) {
  return [
    "New Only The Essentials quote request",
    "",
    `Name: ${clean(body.name)}`,
    `Phone: ${clean(body.phone)}`,
    `Address: ${clean(body.address)}`,
    `Preferred: ${clean(body.preferredTime)}`,
    "",
    `Service: ${clean(body.serviceType)}`,
    `Bedrooms: ${clean(body.bedrooms)}`,
    `Bathrooms: ${clean(body.bathrooms)}`,
    `Pets: ${clean(body.pets)}`,
    `Condition: ${clean(body.condition)}`,
    "",
    `Notes: ${clean(body.notes) || "No extra notes added."}`,
    "",
    "Open HomePlanet dashboard:",
    "https://www.homeplanet.city/planet/only-the-essentials/intelligence"
  ].join("\n");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  const toNumber = process.env.KAITLIN_NOTIFY_NUMBER || "+18638013179";

  if (!accountSid || !authToken || !fromNumber) {
    console.warn("Kaitlin SMS skipped: Twilio env vars are missing.");
    return res.status(200).json({
      ok: false,
      skipped: true,
      reason: "SMS not configured yet",
    });
  }

  const body = (req.body || {}) as NotifyBody;
  const message = buildMessage(body);

  const params = new URLSearchParams();
  params.append("To", toNumber);
  params.append("From", fromNumber);
  params.append("Body", message);

  const twilioResponse = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  const result = await twilioResponse.json();

  if (!twilioResponse.ok) {
    console.error("Kaitlin SMS failed:", result);
    return res.status(500).json({ ok: false, error: "SMS failed", details: result });
  }

  return res.status(200).json({ ok: true, sid: result.sid });
}
