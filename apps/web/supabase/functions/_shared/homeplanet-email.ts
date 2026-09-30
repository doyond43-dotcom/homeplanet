export type HomePlanetEmailRequest = {
  recipient: string;
  subject: string;
  html: string;
  text?: string;
  project: string;
};

export type HomePlanetEmailResult = {
  accepted: true;
  messageId: string;
  provider: "resend";
  project: string;
};

export class HomePlanetEmailError extends Error {
  readonly httpStatus: number;
  readonly provider = "resend" as const;
  readonly providerCode?: string | number;

  constructor(
    message: string,
    options: { httpStatus?: number; providerCode?: string | number } = {}
  ) {
    super(message);
    this.name = "HomePlanetEmailError";
    this.httpStatus = options.httpStatus || 500;
    this.providerCode = options.providerCode;
  }
}

function requiredEnvironment(name: string) {
  const value = String(Deno.env.get(name) || "").trim();
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

function safeExceptionText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/\bBearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/\b(?:re|sbp|sb_secret)_[A-Za-z0-9_-]+\b/g, "[redacted token]")
    .replace(/\b[^\s@]+@[^\s@]+\.[^\s@]+\b/g, "[redacted email]")
    .slice(0, maxLength);
}

function responseObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
}

function parseResponseBody(value: string) {
  if (!value.trim()) return {};
  try {
    return responseObject(JSON.parse(value));
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

  if (!recipient || !subject || !request.html.trim() || !project) {
    throw new HomePlanetEmailError(
      "Recipient, subject, content, and project are required.",
      { httpStatus: 400 }
    );
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "HomePlanet-Edge-Email/1.0",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject,
        html: request.html,
        ...(request.text ? { text: request.text } : {}),
      }),
    });
  } catch (exception) {
    const thrown = exception instanceof Error ? exception : null;
    const stackPreview = thrown?.stack
      ? safeExceptionText(thrown.stack.split("\n").slice(0, 6).join("\n"), 1200)
      : null;
    console.error("HomePlanet email transport threw", {
      project,
      provider: "resend",
      exceptionName: safeExceptionText(thrown?.name || typeof exception, 120),
      exceptionMessage: safeExceptionText(thrown?.message || exception, 500),
      stackPreview,
    });
    throw exception;
  }

  let responseText = "";
  try {
    responseText = await response.text();
  } catch (exception) {
    const thrown = exception instanceof Error ? exception : null;
    console.error("HomePlanet email response could not be read", {
      project,
      provider: "resend",
      providerHttpStatus: response.status,
      exceptionName: safeExceptionText(thrown?.name || typeof exception, 120),
      exceptionMessage: safeExceptionText(thrown?.message || exception, 500),
    });
    throw exception;
  }

  const providerBody = parseResponseBody(responseText);

  if (!response.ok) {
    const providerCode = safeExceptionText(
      providerBody.name || providerBody.code || response.status,
      120
    );
    const providerMessage = safeExceptionText(
      providerBody.message || "Resend rejected the request.",
      500
    );
    console.error("HomePlanet email provider rejected message", {
      project,
      provider: "resend",
      providerHttpStatus: response.status,
      providerCode,
      providerMessage,
    });
    throw new HomePlanetEmailError(
      `Email provider rejected the notification (HTTP ${response.status}, ${providerCode}): ${providerMessage}`,
      { httpStatus: 502, providerCode }
    );
  }

  const messageId = String(providerBody.id || "").trim();
  if (!messageId) {
    throw new HomePlanetEmailError(
      "Email provider did not return a message ID.",
      { httpStatus: 502 }
    );
  }

  return { accepted: true, messageId, provider: "resend", project };
}
