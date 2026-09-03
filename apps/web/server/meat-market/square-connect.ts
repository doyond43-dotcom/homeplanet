import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function clean(value: unknown, max = 500) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function hashesMatch(a: string, b: string) {
  try {
    const left = Buffer.from(a, "hex");
    const right = Buffer.from(b, "hex");

    if (left.length !== right.length) return false;

    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed.",
    });
  }

  const supabaseUrl = String(
    process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      ""
  ).trim();

  const serviceRoleKey = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  ).trim();

  const squareApplicationId = String(
    process.env.SQUARE_APPLICATION_ID || ""
  ).trim();

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    !squareApplicationId
  ) {
    return res.status(503).json({
      ok: false,
      error: "Square connection service is not configured.",
    });
  }

  const slug = clean(req.body?.slug, 180);
  const token = clean(req.body?.token, 500);

  if (!validSlug(slug) || !token) {
    return res.status(400).json({
      ok: false,
      error: "Seller connection link is incomplete.",
    });
  }

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  const { data: access, error: accessError } =
    await supabase
      .from("okeechobee_meat_market_seller_access")
      .select("seller_listing_id,manage_token_hash")
      .eq("seller_listing_id", slug)
      .maybeSingle();

  if (accessError || !access) {
    return res.status(403).json({
      ok: false,
      error: "Seller access could not be verified.",
    });
  }

  const incomingHash = hashToken(token);
  const storedHash = String(access.manage_token_hash || "");

  if (!hashesMatch(incomingHash, storedHash)) {
    return res.status(403).json({
      ok: false,
      error: "This seller update link is invalid.",
    });
  }

  const rawState = randomBytes(32).toString("hex");
  const stateHash = hashToken(rawState);

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  ).toISOString();

  const { error: stateError } = await supabase
    .from("okeechobee_meat_market_payment_oauth_states")
    .insert({
      state_hash: stateHash,
      seller_listing_id: slug,
      provider: "square",
      expires_at: expiresAt,
    });

  if (stateError) {
    return res.status(500).json({
      ok: false,
      error: "Could not start Square connection.",
    });
  }

  const redirectUri =
    "https://www.homeplanet.city/api/okeechobee-meat-market?route=square-callback";

  const scopes = [
    "MERCHANT_PROFILE_READ",
    "LOCATIONS_READ",
    "ORDERS_READ",
    "ORDERS_WRITE",
    "PAYMENTS_READ",
    "PAYMENTS_WRITE",
  ];

  const params = new URLSearchParams({
    client_id: squareApplicationId,
    scope: scopes.join(" "),
    state: rawState,
    redirect_uri: redirectUri,
  });

  const authorizationUrl =
    `https://connect.squareupsandbox.com/oauth2/authorize?${params.toString()}`;

  return res.status(200).json({
    ok: true,
    authorizationUrl,
  });
}




