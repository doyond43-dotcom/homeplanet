export type HomePlanetSmsRequest = {
  recipientPhone: string;
  messageBody: string;
  project: string;
  secureLink?: string;
};

export type HomePlanetSmsResult = {
  accepted: true;
  sid: string | null;
  status: string;
  project: string;
};

export class HomePlanetSmsError extends Error {
  readonly httpStatus: number;
  readonly providerStatus?: number;
  readonly providerCode?: string | number;

  constructor(
    message: string,
    options: {
      httpStatus?: number;
      providerStatus?: number;
      providerCode?: string | number;
    } = {}
  ) {
    super(message);
    this.name = "HomePlanetSmsError";
    this.httpStatus = options.httpStatus || 500;
    this.providerStatus = options.providerStatus;
    this.providerCode = options.providerCode;
  }
}

function normalizePhone(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  return trimmed;
}

function parseTwilioResponse(raw: string) {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function sendHomePlanetSms(
  request: HomePlanetSmsRequest
): Promise<HomePlanetSmsResult> {
  const accountSid = String(process.env.TWILIO_ACCOUNT_SID || "").trim();
  const authToken = String(process.env.TWILIO_AUTH_TOKEN || "").trim();
  const fromNumber = String(process.env.TWILIO_FROM_NUMBER || "").trim();

  if (!accountSid || !authToken || !fromNumber) {
    throw new HomePlanetSmsError("SMS service is not configured.", {
      httpStatus: 503,
    });
  }

  const recipientPhone = normalizePhone(request.recipientPhone);
  const messageBody = request.messageBody.trim();
  const project = request.project.trim();
  const secureLink = String(request.secureLink || "").trim();

  if (!recipientPhone || !messageBody || !project) {
    throw new HomePlanetSmsError(
      "Recipient phone, message body, and project are required.",
      { httpStatus: 400 }
    );
  }

  if (!/^[a-z0-9][a-z0-9._-]{1,79}$/i.test(project)) {
    throw new HomePlanetSmsError("Project identifier is invalid.", {
      httpStatus: 400,
    });
  }

  if (secureLink) {
    try {
      const parsedLink = new URL(secureLink);
      if (parsedLink.protocol !== "https:") throw new Error("HTTPS required");
    } catch {
      throw new HomePlanetSmsError("Secure link is invalid.", {
        httpStatus: 400,
      });
    }
  }

  const finalMessage =
    secureLink && !messageBody.includes(secureLink)
      ? `${messageBody}\n\n${secureLink}`
      : messageBody;

  const params = new URLSearchParams();
  params.append("To", recipientPhone);
  params.append("From", fromNumber);
  params.append("Body", finalMessage);

  const twilioResponse = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  const raw = await twilioResponse.text();
  const result = parseTwilioResponse(raw);

  if (!twilioResponse.ok) {
    const providerCode = result?.code as string | number | undefined;

    console.error("HomePlanet SMS provider rejected message", {
      project,
      providerStatus: twilioResponse.status,
      providerCode: providerCode || null,
    });

    throw new HomePlanetSmsError(
      String(result?.message || "SMS provider rejected the message."),
      {
        httpStatus: 502,
        providerStatus: twilioResponse.status,
        providerCode,
      }
    );
  }

  return {
    accepted: true,
    sid: typeof result?.sid === "string" ? result.sid : null,
    status: typeof result?.status === "string" ? result.status : "accepted",
    project,
  };
}
