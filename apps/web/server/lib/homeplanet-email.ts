export type HomePlanetEmailRequest = {
  recipient: string;
  subject: string;
  html: string;
  text?: string;
  project: string;
  idempotencyKey: string;
};

export type HomePlanetEmailResult = {
  accepted: true;
  messageId: string;
  provider: "resend";
  providerStatus: number;
  project: string;
};

export class HomePlanetEmailError extends Error {
  readonly httpStatus: number;
  readonly provider = "resend" as const;
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
    this.name = "HomePlanetEmailError";
    this.httpStatus = options.httpStatus || 500;
    this.providerStatus = options.providerStatus;
    this.providerCode = options.providerCode;
  }
}

function requiredEnvironment(name: string) {
  const value = String(process.env[name] || "").trim();
  if (!value) {
    throw new HomePlanetEmailError(
      `Email service configuration is missing ${name}.`,
      { httpStatus: 503 }
    );
  }
  return value;
}

export function requiredEmailRecipient(name: string) {
  const recipient = requiredEnvironment(name);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    throw new HomePlanetEmailError(
      `Email recipient configuration is invalid for ${name}.`,
      { httpStatus: 503 }
    );
  }
  return recipient;
}

export function escapeEmailHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeProviderText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/\bBearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/\b(?:re|sbp|sb_secret)_[A-Za-z0-9_-]+\b/g, "[redacted token]")
    .replace(/\b[^\s@]+@[^\s@]+\.[^\s@]+\b/g, "[redacted email]")
    .slice(0, maxLength);
}

function parseProviderBody(raw: string): Record<string, unknown> {
  if (!raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? parsed as Record<string, unknown>
      : {};
  } catch {
    return {};
  }
}

export async function sendHomePlanetEmail(
  request: HomePlanetEmailRequest
): Promise<HomePlanetEmailResult> {
  const apiKey = requiredEnvironment("RESEND_API_KEY");
  const from = requiredEnvironment("HOMEPLANET_EMAIL_FROM");
  const recipient = request.recipient.trim();
  const subject = request.subject.trim();
  const project = request.project.trim();
  const idempotencyKey = request.idempotencyKey.trim();

  if (!recipient || !subject || !request.html.trim() || !project || !idempotencyKey) {
    throw new HomePlanetEmailError(
      "Recipient, subject, content, project, and idempotency key are required.",
      { httpStatus: 400 }
    );
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        "User-Agent": "HomePlanet-Vercel-Email/1.0",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject,
        html: request.html,
        ...(request.text ? { text: request.text } : {}),
      }),
    });
  } catch (error) {
    const thrown = error instanceof Error ? error : null;
    console.error("HomePlanet email transport failed", {
      project,
      provider: "resend",
      exceptionName: safeProviderText(thrown?.name || typeof error, 120),
      exceptionMessage: safeProviderText(thrown?.message || error, 500),
    });
    throw new HomePlanetEmailError("Email provider could not be reached.", {
      httpStatus: 502,
    });
  }

  const raw = await response.text().catch(() => "");
  const providerBody = parseProviderBody(raw);

  if (!response.ok) {
    const providerCode = safeProviderText(
      providerBody.name || providerBody.code || response.status,
      120
    );
    const providerMessage = safeProviderText(
      providerBody.message || "Resend rejected the request.",
      500
    );
    console.error("HomePlanet email provider rejected message", {
      project,
      provider: "resend",
      providerStatus: response.status,
      providerCode,
      providerMessage,
    });
    throw new HomePlanetEmailError(providerMessage, {
      httpStatus: 502,
      providerStatus: response.status,
      providerCode,
    });
  }

  const messageId = String(providerBody.id || "").trim();
  if (!messageId) {
    throw new HomePlanetEmailError(
      "Email provider did not return a message ID.",
      { httpStatus: 502, providerStatus: response.status }
    );
  }

  return {
    accepted: true,
    messageId,
    provider: "resend",
    providerStatus: response.status,
    project,
  };
}
