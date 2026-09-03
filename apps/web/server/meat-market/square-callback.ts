import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createCipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const SQUARE_VERSION = "2026-08-19";

function clean(value: unknown, max = 2000) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function encryptionKey() {
  const encoded = String(
    process.env.MEAT_MARKET_PAYMENT_ENCRYPTION_KEY || ""
  ).trim();

  if (!encoded) {
    throw new Error("Payment encryption key is missing.");
  }

  const key = Buffer.from(encoded, "base64");

  if (key.length !== 32) {
    throw new Error("Payment encryption key is invalid.");
  }

  return key;
}

function encryptSecret(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(
    "aes-256-gcm",
    encryptionKey(),
    iv
  );

  const ciphertext = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64"),
    authTag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(".");
}

function sendHtml(
  res: VercelResponse,
  status: number,
  title: string,
  message: string
) {
  res.status(status);
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  return res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      background: #0b0b0b;
      color: #ffffff;
      font-family: Arial, sans-serif;
      display: grid;
      min-height: 100vh;
      place-items: center;
      padding: 24px;
      box-sizing: border-box;
    }
    main {
      width: min(520px, 100%);
      background: #171717;
      border: 1px solid #333;
      border-radius: 20px;
      padding: 28px;
      box-sizing: border-box;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 30px;
    }
    p {
      margin: 0;
      color: #d0d0d0;
      line-height: 1.55;
      font-size: 17px;
    }
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    <p>${message}</p>
  </main>
</body>
</html>`);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed.",
    });
  }

  const code = clean(req.query?.code, 500);
  const state = clean(req.query?.state, 500);
  const squareError = clean(req.query?.error, 300);
  const squareErrorDescription = clean(
    req.query?.error_description,
    1000
  );

  if (squareError) {
    return sendHtml(
      res,
      400,
      "Square was not connected",
      squareErrorDescription ||
        "Square authorization was cancelled or declined. You can close this tab and try again."
    );
  }

  if (!code || !state) {
    return sendHtml(
      res,
      400,
      "Square connection failed",
      "The Square authorization response was incomplete. Close this tab and try Connect Square again."
    );
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

  const squareApplicationSecret = String(
    process.env.SQUARE_APPLICATION_SECRET || ""
  ).trim();

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    !squareApplicationId ||
    !squareApplicationSecret ||
    !process.env.MEAT_MARKET_PAYMENT_ENCRYPTION_KEY
  ) {
    return sendHtml(
      res,
      503,
      "Square connection unavailable",
      "HomePlanet payment connection is not fully configured yet."
    );
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

  const stateHash = hashValue(state);
  const claimedAt = new Date().toISOString();

  const { data: oauthState, error: stateError } =
    await supabase
      .from("okeechobee_meat_market_payment_oauth_states")
      .update({
        used_at: claimedAt,
      })
      .eq("state_hash", stateHash)
      .eq("provider", "square")
      .is("used_at", null)
      .gt("expires_at", claimedAt)
      .select("seller_listing_id")
      .maybeSingle();

  if (stateError || !oauthState?.seller_listing_id) {
    return sendHtml(
      res,
      400,
      "Square connection expired",
      "This Square connection link is invalid, expired, or has already been used. Close this tab and start again from your seller page."
    );
  }

  const sellerSlug = String(
    oauthState.seller_listing_id
  ).trim();

  const redirectUri =
    "https://www.homeplanet.city/api/okeechobee-meat-market?route=square-callback";

  try {
    const tokenResponse = await fetch(
      "https://connect.squareupsandbox.com/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Square-Version": SQUARE_VERSION,
        },
        body: JSON.stringify({
          client_id: squareApplicationId,
          client_secret: squareApplicationSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      }
    );

    const tokenResult = await tokenResponse
      .json()
      .catch(() => null);

    const accessToken = clean(
      tokenResult?.access_token,
      2000
    );

    const refreshToken = clean(
      tokenResult?.refresh_token,
      2000
    );

    const merchantId = clean(
      tokenResult?.merchant_id,
      300
    );

    if (
      !tokenResponse.ok ||
      !accessToken ||
      !refreshToken ||
      !merchantId
    ) {
      throw new Error(
        "Square did not return a complete seller authorization."
      );
    }

    const locationsResponse = await fetch(
      "https://connect.squareupsandbox.com/v2/locations",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Square-Version": SQUARE_VERSION,
        },
      }
    );

    const locationsResult = await locationsResponse
      .json()
      .catch(() => null);

    if (!locationsResponse.ok) {
      throw new Error(
        "Could not load the seller's Square locations."
      );
    }

    const locations = Array.isArray(
      locationsResult?.locations
    )
      ? locationsResult.locations
      : [];

    const preferredLocation =
      locations.find(
        (location: any) =>
          String(location?.status || "").toUpperCase() ===
            "ACTIVE" &&
          String(location?.type || "").toUpperCase() !==
            "MOBILE"
      ) ||
      locations.find(
        (location: any) =>
          String(location?.status || "").toUpperCase() ===
          "ACTIVE"
      ) ||
      locations[0];

    const locationId = clean(
      preferredLocation?.id,
      300
    );

    if (!locationId) {
      throw new Error(
        "No usable Square location was found for this seller."
      );
    }

    const scopes = [
      "MERCHANT_PROFILE_READ",
      "LOCATIONS_READ",
      "ORDERS_READ",
      "ORDERS_WRITE",
      "PAYMENTS_READ",
      "PAYMENTS_WRITE",
    ];

    const now = new Date().toISOString();

    const { error: connectionError } = await supabase
      .from(
        "okeechobee_meat_market_payment_connections"
      )
      .upsert(
        {
          seller_listing_id: sellerSlug,
          provider: "square",
          provider_merchant_id: merchantId,
          provider_location_id: locationId,
          access_token_ciphertext:
            encryptSecret(accessToken),
          refresh_token_ciphertext:
            encryptSecret(refreshToken),
          encryption_version: "aes-256-gcm-v1",
          token_expires_at:
            clean(tokenResult?.expires_at, 100) || null,
          refresh_token_expires_at:
            clean(
              tokenResult?.refresh_token_expires_at,
              100
            ) || null,
          scopes,
          status: "connected",
          connected_at: now,
          refreshed_at: now,
          last_error: null,
          updated_at: now,
        },
        {
          onConflict: "seller_listing_id,provider",
        }
      );

    if (connectionError) {
      throw new Error(
        "Could not save the Square connection."
      );
    }

    const { error: sellerUpdateError } =
      await supabase
        .from(
          "okeechobee_meat_market_seller_access"
        )
        .update({
          payment_provider: "Square",
          payment_destination: "",
        })
        .eq("seller_listing_id", sellerSlug);

    if (sellerUpdateError) {
      throw new Error(
        "Square connected, but seller payment settings could not be updated."
      );
    }

    return sendHtml(
      res,
      200,
      "Square connected",
      "Your Square account is connected to HomePlanet. Your seller page is still open in the other tab. You can close this tab."
    );
  } catch (error) {
    console.error("Square OAuth callback failed:", error);

    return sendHtml(
      res,
      500,
      "Square connection failed",
      "HomePlanet could not finish connecting Square. Close this tab and try Connect Square again."
    );
  }
}

