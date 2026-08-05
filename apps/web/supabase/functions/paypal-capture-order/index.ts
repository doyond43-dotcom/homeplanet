import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CaptureRequest = {
  order_id: string;
  customer_access_token: string;
  paypal_order_id: string;
};

type CheckoutRow = {
  id: string;
  product_type: string;
  product_order_id: string;
  currency: string;
  total_amount: number | string;
  status: string;
};

type PayPalAccessTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type PayPalCapture = {
  id?: string;
  status?: string;
  amount?: {
    currency_code?: string;
    value?: string;
  };
};

type PayPalCaptureResponse = {
  id?: string;
  status?: string;
  purchase_units?: Array<{
    payments?: {
      captures?: PayPalCapture[];
    };
  }>;
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
  response: PayPalCaptureResponse,
  fallback: string,
): string {
  return (
    response.details?.[0]?.description ||
    response.message ||
    fallback
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        error: "Method not allowed.",
      },
      405,
    );
  }

  try {
    const paypalEnvironment =
      Deno.env.get("PAYPAL_ENVIRONMENT")
        ?.trim()
        .toLowerCase() || "sandbox";

    const paypalClientId =
      Deno.env.get("PAYPAL_CLIENT_ID")?.trim();

    const paypalClientSecret =
      Deno.env.get("PAYPAL_CLIENT_SECRET")?.trim();

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL")?.trim();

    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error(
        "PayPal credentials are not configured.",
      );
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        "Supabase server credentials are not configured.",
      );
    }

    const body =
      (await req.json()) as Partial<CaptureRequest>;

    const orderId =
      typeof body.order_id === "string"
        ? body.order_id.trim()
        : "";

    const customerAccessToken =
      typeof body.customer_access_token === "string"
        ? body.customer_access_token.trim()
        : "";

    const paypalOrderId =
      typeof body.paypal_order_id === "string"
        ? body.paypal_order_id.trim()
        : "";

    if (
      !orderId ||
      !customerAccessToken ||
      !paypalOrderId
    ) {
      return jsonResponse(
        {
          ok: false,
          error:
            "Order ID, access token, and PayPal order ID are required.",
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

    const { data: checkoutData, error: checkoutError } =
      await supabaseAdmin
        .from("homeplanet_checkout_sessions")
        .select(
          [
            "id",
            "product_type",
            "product_order_id",
            "currency",
            "total_amount",
            "status",
          ].join(","),
        )
        .eq("product_order_id", orderId)
        .eq("customer_access_token", customerAccessToken)
        .maybeSingle();

    if (checkoutError) {
      throw new Error(
        `Could not load checkout: ${checkoutError.message}`,
      );
    }

    const checkout = checkoutData as CheckoutRow | null;

    if (!checkout) {
      return jsonResponse(
        {
          ok: false,
          error:
            "The HomePlanet checkout could not be found or accessed.",
        },
        404,
      );
    }

    if (checkout.status === "paid") {
      return jsonResponse({
        ok: true,
        already_verified: true,
        homeplanet_order_id:
          checkout.product_order_id,
        product_type: checkout.product_type,
      });
    }

    const paypalBaseUrl =
      getPayPalBaseUrl(paypalEnvironment);

    const basicAuth = btoa(
      `${paypalClientId}:${paypalClientSecret}`,
    );

    const tokenResponse = await fetch(
      `${paypalBaseUrl}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type":
            "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: "grant_type=client_credentials",
      },
    );

    const tokenData =
      (await tokenResponse.json()) as PayPalAccessTokenResponse;

    if (
      !tokenResponse.ok ||
      !tokenData.access_token
    ) {
      throw new Error(
        tokenData.error_description ||
          tokenData.error ||
          "PayPal authentication failed.",
      );
    }

    const captureResponse = await fetch(
      `${paypalBaseUrl}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          "PayPal-Request-Id":
            `capture-${paypalOrderId}`.slice(
              0,
              108,
            ),
        },
        body: "{}",
      },
    );

    const captureData =
      (await captureResponse.json()) as PayPalCaptureResponse;

    if (!captureResponse.ok) {
      console.error(
        "PayPal capture error:",
        captureData,
      );

      throw new Error(
        getPayPalErrorMessage(
          captureData,
          "PayPal could not capture the payment.",
        ),
      );
    }

    const capture =
      captureData.purchase_units?.[0]
        ?.payments?.captures?.[0];

    if (
      captureData.status !== "COMPLETED" ||
      capture?.status !== "COMPLETED" ||
      !capture.id ||
      !capture.amount?.value ||
      !capture.amount.currency_code
    ) {
      throw new Error(
        "PayPal did not return a completed capture.",
      );
    }

    const capturedAmount =
      Number(capture.amount.value);

    if (!Number.isFinite(capturedAmount)) {
      throw new Error(
        "PayPal returned an invalid captured amount.",
      );
    }

    const { data: completedCheckout, error: completeError } =
      await supabaseAdmin.rpc(
        "complete_homeplanet_paypal_capture",
        {
          requested_access_token:
            customerAccessToken,
          requested_paypal_order_id:
            paypalOrderId,
          requested_paypal_capture_id:
            capture.id,
          requested_captured_amount:
            capturedAmount,
          requested_currency:
            capture.amount.currency_code,
          requested_provider_payload:
            captureData,
        },
      );

    if (completeError) {
      throw new Error(
        `Payment was captured, but HomePlanet could not verify it: ${completeError.message}`,
      );
    }

    return jsonResponse({
      ok: true,
      paypal_order_id: paypalOrderId,
      paypal_capture_id: capture.id,
      paypal_status: capture.status,
      amount: capturedAmount.toFixed(2),
      currency:
        capture.amount.currency_code,
      homeplanet_order_id:
        checkout.product_order_id,
      product_type: checkout.product_type,
      checkout: completedCheckout,
      environment: paypalEnvironment,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown PayPal capture error occurred.";

    console.error(
      "paypal-capture-order failed:",
      error,
    );

    return jsonResponse(
      {
        ok: false,
        error: message,
      },
      500,
    );
  }
});