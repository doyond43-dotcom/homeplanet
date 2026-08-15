import {
  HomePlanetSmsError,
  sendHomePlanetSms,
} from "./_lib/homeplanet-sms.js";

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
    "https://www.homeplanet.city/planet/only-the-essentials/intelligence",
  ].join("\n");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const toNumber = process.env.KAITLIN_NOTIFY_NUMBER || "+18638013179";
  const body = (req.body || {}) as NotifyBody;

  try {
    const result = await sendHomePlanetSms({
      recipientPhone: toNumber,
      messageBody: buildMessage(body),
      project: "only-the-essentials-cleaning-request",
    });

    return res.status(200).json({
      ok: true,
      accepted: result.accepted,
      sid: result.sid,
      status: result.status,
    });
  } catch (error) {
    if (error instanceof HomePlanetSmsError && error.httpStatus === 503) {
      console.warn("Kaitlin SMS skipped: Twilio env vars are missing.");
      return res.status(200).json({
        ok: false,
        skipped: true,
        reason: "SMS not configured yet",
      });
    }

    console.error("Kaitlin SMS failed", {
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
      error: "SMS failed",
      ...(error instanceof HomePlanetSmsError
        ? {
            providerStatus: error.providerStatus || null,
            providerCode: error.providerCode || null,
          }
        : {}),
    });
  }
}
