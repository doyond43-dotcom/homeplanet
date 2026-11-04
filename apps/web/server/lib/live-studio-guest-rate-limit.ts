import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { createClient } from "@supabase/supabase-js";

export class GuestRateLimitError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "GuestRateLimitError";
  }
}

type GuestRateLimitInput = {
  forwardedFor: string | string[] | undefined;
  remoteAddress: string | undefined;
  isVercel: boolean;
  rateSecret: string;
  supabaseUrl: string;
  serviceKey: string;
};

export async function checkLiveStudioGuestRateLimit(
  input: GuestRateLimitInput
): Promise<void> {
  if (
    Buffer.byteLength(input.rateSecret || "", "utf8") < 32 ||
    !input.supabaseUrl ||
    !input.serviceKey
  ) {
    throw new GuestRateLimitError(
      "Guest access temporarily unavailable",
      503
    );
  }

  // Trust the platform-managed address only on Vercel.
  // In local development, use the direct socket address.
  const forwarded =
    typeof input.forwardedFor === "string"
      ? input.forwardedFor
      : "";

  const candidate = input.isVercel
    ? forwarded
    : input.remoteAddress || "";

  const address = candidate.trim();

  // Never accept comma-separated client-supplied IP lists.
  if (
    !address ||
    address.includes(",") ||
    isIP(address) === 0
  ) {
    throw new GuestRateLimitError(
      "Guest access temporarily unavailable",
      503
    );
  }

  // Domain separation prevents hash reuse across systems.
  // Raw IP addresses are never sent to Supabase.
  const sourceHash = createHmac(
    "sha256",
    input.rateSecret
  )
    .update("live-studio-guest:v1:" + address)
    .digest("hex");

  const supabase = createClient(
    input.supabaseUrl,
    input.serviceKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data, error } = await supabase.rpc(
    "live_studio_check_guest_rate_limit",
    {
      p_source_hash: sourceHash,
    }
  );

  if (error || typeof data !== "boolean") {
    throw new GuestRateLimitError(
      "Guest access temporarily unavailable",
      503
    );
  }

  if (!data) {
    throw new GuestRateLimitError(
      "Too many invitation attempts. Please try again later.",
      429
    );
  }
}
