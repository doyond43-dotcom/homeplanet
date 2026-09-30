import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type StarterSubscriptionRequest = {
  live_page_slug: string;
  admin_access_token: string;
  return_url: string;
  cancel_url: string;
};

type PayPalLink = {
  href: string;
  rel: string;
  method?: string;
};

type PayPalProductResponse = {
  id?: string;
  name?: string;
  message?: string;
  details?: Array<{
    issue?: string;
    description?: string;
  }>;
};

type PayPalPlanResponse = {
  id?: string;
  product_id?: string;
  status?: string;
  message?: string;
  details?: Array<{
    issue?: string;
    description?: string;
  }>;
};

type PayPalSubscriptionResponse = {
  id?: string;
  status?: string;
  plan_id?: string;
  links?: PayPalLink[];
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
  response: {
    message?: string;
    details?: Array<{
      issue?: string;
      description?: string;
    }>;
  },
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

    if (
      paypalEnvironment !== "sandbox" &&
      paypalEnvironment !== "live"
    ) {
      throw new Error(
        'PAYPAL_ENVIRONMENT must be either "sandbox" or "live".',
      );
    }

    const body =
      (await req.json()) as Partial<StarterSubscriptionRequest>;

    const livePageSlug =
      typeof body.live_page_slug === "string"
        ? body.live_page_slug.trim()
        : "";

    const adminAccessToken =
      typeof body.admin_access_token === "string"
        ? body.admin_access_token.trim()
        : "";

    const returnUrl =
      typeof body.return_url === "string"
        ? body.return_url.trim()
        : "";

    const cancelUrl =
      typeof body.cancel_url === "string"
        ? body.cancel_url.trim()
        : "";

    if (
      !livePageSlug ||
      !adminAccessToken ||
      !returnUrl ||
      !cancelUrl
    ) {
      return jsonResponse(
        {
          ok: false,
          error:
            "Live Page slug, owner access, return URL, and cancel URL are required.",
        },
        400,
      );
    }

    let parsedReturnUrl: URL;
    let parsedCancelUrl: URL;

    try {
      parsedReturnUrl = new URL(returnUrl);
      parsedCancelUrl = new URL(cancelUrl);
    } catch {
      return jsonResponse(
        {
          ok: false,
          error: "PayPal return or cancel URL is invalid.",
        },
        400,
      );
    }

    const allowedHosts = new Set([
      "homeplanet.city",
      "www.homeplanet.city",
      "localhost",
      "127.0.0.1",
    ]);

    if (
      !allowedHosts.has(parsedReturnUrl.hostname) ||
      !allowedHosts.has(parsedCancelUrl.hostname) ||
      !["http:", "https:"].includes(parsedReturnUrl.protocol) ||
      !["http:", "https:"].includes(parsedCancelUrl.protocol)
    ) {
      return jsonResponse(
        {
          ok: false,
          error: "PayPal return or cancel URL is not allowed.",
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

    // Verify this browser actually owns this Starter system.
    const {
      data: ownerSettings,
      error: ownerError,
    } = await supabaseAdmin
      .from("starter_notification_settings")
      .select("live_page_slug")
      .eq("live_page_slug", livePageSlug)
      .eq("admin_access_token", adminAccessToken)
      .maybeSingle();

    if (ownerError) {
      throw new Error(
        `Could not verify system ownership: ${ownerError.message}`,
      );
    }

    if (!ownerSettings) {
      return jsonResponse(
        {
          ok: false,
          error: "Owner access could not be verified.",
        },
        403,
      );
    }

    // Create the HomePlanet subscription record if this system
    // does not already have one.
    const {
      data: existingSubscriptionRow,
      error: existingSubscriptionError,
    } = await supabaseAdmin
      .from("starter_system_subscriptions")
      .select(
        [
          "live_page_slug",
          "status",
          "paypal_subscription_id",
          "paypal_plan_id",
          "paypal_product_id",
          "paypal_environment",
        ].join(","),
      )
      .eq("live_page_slug", livePageSlug)
      .maybeSingle();

    if (existingSubscriptionError) {
      throw new Error(
        `Could not load HomePlanet subscription: ${existingSubscriptionError.message}`,
      );
    }


    if (!existingSubscriptionRow) {
      const { error: insertError } = await supabaseAdmin
        .from("starter_system_subscriptions")
        .insert({
          live_page_slug: livePageSlug,
          status: "approval_pending",
          monthly_price: 29.99,
          currency: "USD",
          paypal_environment: paypalEnvironment,
        });

      if (insertError) {
        throw new Error(
          `Could not create HomePlanet subscription record: ${insertError.message}`,
        );
      }
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

    const tokenData = await tokenResponse.json();

    if (
      !tokenResponse.ok ||
      !tokenData?.access_token
    ) {
      throw new Error(
        tokenData?.error_description ||
          tokenData?.error ||
          "PayPal authentication failed.",
      );
    }

    const paypalAccessToken =
      String(tokenData.access_token);

    if (existingSubscriptionRow?.paypal_subscription_id) {
      const existingDetailsResponse = await fetch(
        `${paypalBaseUrl}/v1/billing/subscriptions/${encodeURIComponent(
          existingSubscriptionRow.paypal_subscription_id
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paypalAccessToken}`,
            Accept: "application/json",
          },
        },
      );

      const existingDetails =
        await existingDetailsResponse.json();

      if (existingDetailsResponse.ok) {
        const existingPayPalStatus =
          String(existingDetails?.status || "").toUpperCase();

        if (existingPayPalStatus === "APPROVAL_PENDING") {
          const existingApprovalUrl =
            Array.isArray(existingDetails?.links)
              ? existingDetails.links.find(
                  (link: PayPalLink) =>
                    link?.rel === "approve",
                )?.href || null
              : null;

          if (existingApprovalUrl) {
            return jsonResponse({
              ok: true,
              live_page_slug: livePageSlug,
              paypal_subscription_id:
                existingSubscriptionRow.paypal_subscription_id,
              paypal_status: existingPayPalStatus,
              approval_url: existingApprovalUrl,
              paypal_plan_id:
                existingSubscriptionRow.paypal_plan_id,
              environment: paypalEnvironment,
              trial_days: 30,
              amount_due_today: "0.00",
              recurring_amount: "29.99",
              currency: "USD",
              resumed: true,
            });
          }
        }

        if (
          existingPayPalStatus === "ACTIVE" ||
          existingPayPalStatus === "APPROVED"
        ) {
          return jsonResponse({
            ok: true,
            live_page_slug: livePageSlug,
            paypal_subscription_id:
              existingSubscriptionRow.paypal_subscription_id,
            paypal_status: existingPayPalStatus,
            approval_url: parsedReturnUrl.toString(),
            paypal_plan_id:
              existingSubscriptionRow.paypal_plan_id,
            environment: paypalEnvironment,
            trial_days: 30,
            amount_due_today: "0.00",
            recurring_amount: "29.99",
            currency: "USD",
            already_approved: true,
          });
        }

        if (
          existingPayPalStatus !== "CANCELLED" &&
          existingPayPalStatus !== "EXPIRED"
        ) {
          return jsonResponse(
            {
              ok: false,
              error:
                "This system already has a PayPal subscription that cannot be restarted.",
            },
            409,
          );
        }

        const homePlanetExistingStatus =
          existingPayPalStatus === "EXPIRED"
            ? "expired"
            : "cancelled";

        const { error: resetExistingError } =
          await supabaseAdmin
            .from("starter_system_subscriptions")
            .update({
              status: homePlanetExistingStatus,
              paypal_status: existingPayPalStatus,
              updated_at: new Date().toISOString(),
            })
            .eq("live_page_slug", livePageSlug);

        if (resetExistingError) {
          throw new Error(
            `Could not reset previous PayPal subscription: ${resetExistingError.message}`,
          );
        }
      } else if (
        !["cancelled", "expired"].includes(
          existingSubscriptionRow.status,
        )
      ) {
        throw new Error(
          "HomePlanet could not verify the existing PayPal subscription.",
        );
      }
    }

    // Reuse the HomePlanet Starter plan if one has already
    // been created for this PayPal environment.
    const {
      data: reusablePlans,
      error: reusablePlanError,
    } = await supabaseAdmin
      .from("starter_system_subscriptions")
      .select(
        "paypal_product_id,paypal_plan_id",
      )
      .eq("paypal_environment", paypalEnvironment)
      .not("paypal_plan_id", "is", null)
      .limit(1);

    if (reusablePlanError) {
      throw new Error(
        `Could not check existing PayPal plan: ${reusablePlanError.message}`,
      );
    }

    let paypalProductId =
      reusablePlans?.[0]?.paypal_product_id || "";

    let paypalPlanId =
      reusablePlans?.[0]?.paypal_plan_id || "";

    // First subscription in this environment:
    // create the reusable HomePlanet product + plan.
    if (!paypalPlanId) {
      const productResponse = await fetch(
        `${paypalBaseUrl}/v1/catalogs/products`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${paypalAccessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Prefer: "return=representation",
            "PayPal-Request-Id":
              `hp-starter-product-${paypalEnvironment}`,
          },
          body: JSON.stringify({
            name: "HomePlanet Starter System",
            description:
              "HomePlanet self-built business system and Live Page",
            type: "SERVICE",
            category: "SOFTWARE",
            home_url: "https://www.homeplanet.city",
          }),
        },
      );

      const product =
        (await productResponse.json()) as PayPalProductResponse;

      if (
        !productResponse.ok ||
        !product.id
      ) {
        throw new Error(
          getPayPalErrorMessage(
            product,
            "PayPal could not create the HomePlanet subscription product.",
          ),
        );
      }

      paypalProductId = product.id;

      const planResponse = await fetch(
        `${paypalBaseUrl}/v1/billing/plans`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${paypalAccessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            Prefer: "return=representation",
            "PayPal-Request-Id":
              `hp-starter-plan-${paypalEnvironment}`,
          },
          body: JSON.stringify({
            product_id: paypalProductId,
            name:
              "HomePlanet Starter System - 30 Day Free Trial",
            description:
              "30 days free, then $29.99 USD per month until cancelled.",
            status: "ACTIVE",
            billing_cycles: [
              {
                frequency: {
                  interval_unit: "DAY",
                  interval_count: 30,
                },
                tenure_type: "TRIAL",
                sequence: 1,
                total_cycles: 1,
                pricing_scheme: {
                  fixed_price: {
                    value: "0.00",
                    currency_code: "USD",
                  },
                },
              },
              {
                frequency: {
                  interval_unit: "MONTH",
                  interval_count: 1,
                },
                tenure_type: "REGULAR",
                sequence: 2,
                total_cycles: 0,
                pricing_scheme: {
                  fixed_price: {
                    value: "29.99",
                    currency_code: "USD",
                  },
                },
              },
            ],
            payment_preferences: {
              auto_bill_outstanding: true,
              payment_failure_threshold: 1,
            },
          }),
        },
      );

      const plan =
        (await planResponse.json()) as PayPalPlanResponse;

      if (
        !planResponse.ok ||
        !plan.id
      ) {
        throw new Error(
          getPayPalErrorMessage(
            plan,
            "PayPal could not create the HomePlanet subscription plan.",
          ),
        );
      }

      paypalPlanId = plan.id;
    }

    const subscriptionResponse = await fetch(
      `${paypalBaseUrl}/v1/billing/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${paypalAccessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
          Prefer: "return=representation",
          "PayPal-Request-Id":
            `hp-starter-${livePageSlug}-${crypto.randomUUID()}`
              .replace(/[^a-zA-Z0-9-]/g, "-")
              .slice(0, 108),
        },
        body: JSON.stringify({
          plan_id: paypalPlanId,
          custom_id: livePageSlug,
          application_context: {
            brand_name: "HomePlanet",
            locale: "en-US",
            shipping_preference: "NO_SHIPPING",
            user_action: "SUBSCRIBE_NOW",
            return_url: parsedReturnUrl.toString(),
            cancel_url: parsedCancelUrl.toString(),
          },
        }),
      },
    );

    const paypalSubscription =
      (await subscriptionResponse.json()) as PayPalSubscriptionResponse;

    if (
      !subscriptionResponse.ok ||
      !paypalSubscription.id
    ) {
      throw new Error(
        getPayPalErrorMessage(
          paypalSubscription,
          "PayPal could not create the subscription.",
        ),
      );
    }

    const approvalUrl =
      paypalSubscription.links?.find(
        (link) => link.rel === "approve",
      )?.href || null;

    if (!approvalUrl) {
      throw new Error(
        "PayPal did not return a subscription approval link.",
      );
    }

    const {
      error: saveSubscriptionError,
    } = await supabaseAdmin
      .from("starter_system_subscriptions")
      .update({
        status: "approval_pending",
        paypal_environment: paypalEnvironment,
        paypal_product_id: paypalProductId,
        paypal_plan_id: paypalPlanId,
        paypal_subscription_id:
          paypalSubscription.id,
        paypal_status:
          paypalSubscription.status ||
          "APPROVAL_PENDING",
        updated_at: new Date().toISOString(),
      })
      .eq("live_page_slug", livePageSlug);

    if (saveSubscriptionError) {
      throw new Error(
        `PayPal subscription was created, but HomePlanet could not record it: ${saveSubscriptionError.message}`,
      );
    }

    return jsonResponse({
      ok: true,
      live_page_slug: livePageSlug,
      paypal_subscription_id:
        paypalSubscription.id,
      paypal_status:
        paypalSubscription.status ||
        "APPROVAL_PENDING",
      approval_url: approvalUrl,
      paypal_plan_id: paypalPlanId,
      environment: paypalEnvironment,
      trial_days: 30,
      amount_due_today: "0.00",
      recurring_amount: "29.99",
      currency: "USD",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown PayPal subscription error occurred.";

    console.error(
      "paypal-create-starter-subscription failed:",
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
