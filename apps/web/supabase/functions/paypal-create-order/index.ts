import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CreatePayPalOrderRequest = {
  order_id: string;
  customer_access_token: string;
};

type PayPalAccessTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type PayPalLink = {
  href: string;
  rel: string;
  method?: string;
};

type PayPalOrderResponse = {
  id?: string;
  status?: string;
  links?: PayPalLink[];
  name?: string;
  message?: string;
  details?: Array<{
    issue?: string;
    description?: string;
  }>;
};

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getPayPalBaseUrl(environment: string): string {
  return environment === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

function getPayPalErrorMessage(
  response: PayPalOrderResponse,
  fallback: string,
): string {
  const detail = response.details?.[0];

  if (detail?.description) {
    return detail.description;
  }

  if (response.message) {
    return response.message;
  }

  return fallback;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method not allowed." }, 405);
  }

  try {
    const paypalEnvironment =
      Deno.env.get("PAYPAL_ENVIRONMENT")?.trim().toLowerCase() || "sandbox";
    const paypalClientId = Deno.env.get("PAYPAL_CLIENT_ID")?.trim();
    const paypalClientSecret =
      Deno.env.get("PAYPAL_CLIENT_SECRET")?.trim();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error("PayPal credentials are not configured.");
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Supabase server credentials are not configured.");
    }

    if (paypalEnvironment !== "sandbox" && paypalEnvironment !== "live") {
      throw new Error(
        'PAYPAL_ENVIRONMENT must be either "sandbox" or "live".',
      );
    }

    const body = (await req.json()) as Partial<CreatePayPalOrderRequest>;

    const orderId =
      typeof body.order_id === "string" ? body.order_id.trim() : "";
    const customerAccessToken =
      typeof body.customer_access_token === "string"
        ? body.customer_access_token.trim()
        : "";

    if (!orderId || !customerAccessToken) {
      return jsonResponse(
        {
          ok: false,
          error: "Order ID and customer access token are required.",
        },
        400,
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const { data: order, error: orderError } = await supabaseAdmin
      .from("guardian_orders")
      .select(
        "order_id, customer_name, customer_email, setup_total, status, customer_access_token",
      )
      .eq("order_id", orderId)
      .eq("customer_access_token", customerAccessToken)
      .maybeSingle();

    if (orderError) {
      throw new Error(`Could not load the Guardian order: ${orderError.message}`);
    }

    if (!order) {
      return jsonResponse(
        {
          ok: false,
          error: "The Guardian order could not be found or accessed.",
        },
        404,
      );
    }

    const setupTotal = Number(order.setup_total);

    if (!Number.isFinite(setupTotal) || setupTotal <= 0) {
      return jsonResponse(
        {
          ok: false,
          error: "The order does not have a valid setup total.",
        },
        400,
      );
    }

    const paypalBaseUrl = getPayPalBaseUrl(paypalEnvironment);
    const basicAuth = btoa(`${paypalClientId}:${paypalClientSecret}`);

    const tokenResponse = await fetch(
      `${paypalBaseUrl}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: "grant_type=client_credentials",
      },
    );

    const tokenData =
      (await tokenResponse.json()) as PayPalAccessTokenResponse;

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("PayPal access-token error:", tokenData);

      throw new Error(
        tokenData.error_description ||
          tokenData.error ||
          "PayPal authentication failed.",
      );
    }

    const paypalOrderResponse = await fetch(
      `${paypalBaseUrl}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "PayPal-Request-Id": `guardian-${orderId}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: orderId,
              custom_id: orderId,
              description: "HomePlanet Guardian Pet Tag setup",
              amount: {
                currency_code: "USD",
                value: setupTotal.toFixed(2),
              },
            },
          ],
        }),
      },
    );

    const paypalOrder =
      (await paypalOrderResponse.json()) as PayPalOrderResponse;

    if (!paypalOrderResponse.ok || !paypalOrder.id) {
      console.error("PayPal create-order error:", paypalOrder);

      throw new Error(
        getPayPalErrorMessage(
          paypalOrder,
          "PayPal could not create the checkout order.",
        ),
      );
    }

    const approvalUrl =
      paypalOrder.links?.find(
        (link) => link.rel === "payer-action" || link.rel === "approve",
      )?.href || null;

    return jsonResponse({
      ok: true,
      paypal_order_id: paypalOrder.id,
      paypal_status: paypalOrder.status || "CREATED",
      approval_url: approvalUrl,
      homeplanet_order_id: orderId,
      amount: setupTotal.toFixed(2),
      currency: "USD",
      environment: paypalEnvironment,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown PayPal checkout error occurred.";

    console.error("paypal-create-order failed:", error);

    return jsonResponse(
      {
        ok: false,
        error: message,
      },
      500,
    );
  }
});