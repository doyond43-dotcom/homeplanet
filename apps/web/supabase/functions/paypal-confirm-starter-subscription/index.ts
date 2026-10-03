import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import {
  escapeEmailHtml,
  sendHomePlanetEmail,
} from "../_shared/homeplanet-email.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ConfirmRequest = {
  live_page_slug: string;
  admin_access_token: string;
  paypal_subscription_id?: string;
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getPayPalBaseUrl(environment: string) {
  return environment === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
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
    const paypalClientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET")?.trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error("PayPal credentials are not configured.");
    }

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error("Supabase server credentials are not configured.");
    }

    if (!["sandbox", "live"].includes(paypalEnvironment)) {
      throw new Error('PAYPAL_ENVIRONMENT must be either "sandbox" or "live".');
    }

    const body = (await req.json()) as Partial<ConfirmRequest>;

    const livePageSlug =
      typeof body.live_page_slug === "string"
        ? body.live_page_slug.trim()
        : "";

    const adminAccessToken =
      typeof body.admin_access_token === "string"
        ? body.admin_access_token.trim()
        : "";

    const requestedPayPalSubscriptionId =
      typeof body.paypal_subscription_id === "string"
        ? body.paypal_subscription_id.trim()
        : "";

    if (!livePageSlug || !adminAccessToken) {
      return jsonResponse(
        {
          ok: false,
          error: "Live Page slug and owner access are required.",
        },
        400
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
      }
    );

    const {
      data: ownerSettings,
      error: ownerError,
    } = await supabaseAdmin
      .from("starter_notification_settings")
      .select("live_page_slug,notification_email,admin_access_token")
      .eq("live_page_slug", livePageSlug)
      .eq("admin_access_token", adminAccessToken)
      .maybeSingle();

    if (ownerError) {
      throw new Error(
        `Could not verify system ownership: ${ownerError.message}`
      );
    }

    if (!ownerSettings) {
      return jsonResponse(
        {
          ok: false,
          error: "Owner access could not be verified.",
        },
        403
      );
    }

    const { data: row, error: rowError } = await supabaseAdmin
      .from("starter_system_subscriptions")
      .select(
        "live_page_slug,status,paypal_environment,paypal_subscription_id,paypal_status,trial_started_at,trial_ends_at,activation_email_sent_at,activation_email_message_id"
      )
      .eq("live_page_slug", livePageSlug)
      .maybeSingle();

    if (rowError) {
      throw new Error(
        `Could not load HomePlanet subscription: ${rowError.message}`
      );
    }

    if (!row?.paypal_subscription_id) {
      return jsonResponse(
        {
          ok: false,
          error: "No PayPal subscription is recorded for this system.",
        },
        404
      );
    }

    if (
      requestedPayPalSubscriptionId &&
      requestedPayPalSubscriptionId !== row.paypal_subscription_id
    ) {
      return jsonResponse(
        {
          ok: false,
          error: "PayPal subscription ID does not match this system.",
        },
        409
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
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData?.access_token) {
      throw new Error(
        tokenData?.error_description ||
          tokenData?.error ||
          "PayPal authentication failed."
      );
    }

    const detailsResponse = await fetch(
      `${paypalBaseUrl}/v1/billing/subscriptions/${encodeURIComponent(
        row.paypal_subscription_id
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${String(tokenData.access_token)}`,
          Accept: "application/json",
        },
      }
    );

    const details = await detailsResponse.json();

    if (!detailsResponse.ok) {
      throw new Error(
        details?.message ||
          "Could not verify PayPal subscription status."
      );
    }

    const paypalStatus = String(details?.status || "").toUpperCase();

    let homePlanetStatus = "approval_pending";

    if (
      paypalStatus === "ACTIVE" ||
      paypalStatus === "APPROVED"
    ) {
      homePlanetStatus = "active";
    } else if (paypalStatus === "SUSPENDED") {
      homePlanetStatus = "suspended";
    } else if (paypalStatus === "CANCELLED") {
      homePlanetStatus = "cancelled";
    } else if (paypalStatus === "EXPIRED") {
      homePlanetStatus = "expired";
    }

    let trialStartedAt = row.trial_started_at;
    let trialEndsAt = row.trial_ends_at;

    if (
      homePlanetStatus === "active" &&
      (!trialStartedAt || !trialEndsAt)
    ) {
      const start = details?.start_time
        ? new Date(details.start_time)
        : new Date();

      const end = new Date(start.getTime());
      end.setUTCDate(end.getUTCDate() + 30);

      trialStartedAt = start.toISOString();
      trialEndsAt = end.toISOString();
    }

    const billingCycleExecutions =
      Array.isArray(details?.billing_info?.cycle_executions)
        ? details.billing_info.cycle_executions
        : [];

    const regularCycle = billingCycleExecutions.find(
      (cycle: Record<string, unknown>) =>
        String(cycle?.tenure_type || "").toUpperCase() === "REGULAR"
    );

    const nextBillingTime =
      details?.billing_info?.next_billing_time || null;

    const { error: updateError } = await supabaseAdmin
      .from("starter_system_subscriptions")
      .update({
        status: homePlanetStatus,
        paypal_status: paypalStatus || row.paypal_status,
        trial_started_at: trialStartedAt,
        trial_ends_at: trialEndsAt,
        current_period_end: nextBillingTime,
        updated_at: new Date().toISOString(),
      })
      .eq("live_page_slug", livePageSlug);

    if (updateError) {
      throw new Error(
        `PayPal status was verified, but HomePlanet could not save it: ${updateError.message}`
      );
    }

    if (
      homePlanetStatus === "active" &&
      !row.activation_email_sent_at &&
      ownerSettings?.notification_email
    ) {
      try {
        const { data: livePageRecord } = await supabaseAdmin
          .from("starter_live_pages")
          .select("page_data")
          .eq("slug", livePageSlug)
          .maybeSingle();

        const pageData =
          livePageRecord?.page_data &&
          typeof livePageRecord.page_data === "object"
            ? livePageRecord.page_data as Record<string, unknown>
            : {};

        const businessName =
          String(
            pageData.businessName ||
              pageData.business_name ||
              pageData.name ||
              livePageSlug
                .split("-")
                .filter(Boolean)
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" ")
          ).trim() || "Your business";

        const livePageUrl =
          `https://www.homeplanet.city/planet/starter/${encodeURIComponent(livePageSlug)}`;

        const systemUrl =
          `https://www.homeplanet.city/planet/system/${encodeURIComponent(livePageSlug)}?access=${encodeURIComponent(adminAccessToken)}`;

        const editUrl =
          `https://www.homeplanet.city/planet/creator/starter?system=${encodeURIComponent(livePageSlug)}&access=${encodeURIComponent(adminAccessToken)}`;

        const emailResult = await sendHomePlanetEmail({
          recipient: String(ownerSettings.notification_email).trim(),
          project: "starter-system-activation",
          subject: `${businessName} is active — Your HomePlanet System`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:28px;">
              <div style="font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#16a34a;margin-bottom:10px;">
                HomePlanet
              </div>

              <h1 style="font-size:28px;line-height:1.2;margin:0 0 14px;">
                ${escapeEmailHtml(businessName)} is active.
              </h1>

              <p style="font-size:16px;line-height:1.6;color:#444;margin:0 0 24px;">
                Your 30-day free trial is active. Your Live Page, HomePlanet System, Work Drawer, and owner tools are ready.
              </p>

              <div style="padding:18px;border:1px solid #ddd;border-radius:14px;margin-bottom:24px;">
                <div style="font-weight:800;margin-bottom:8px;">Trial details</div>
                <div style="line-height:1.7;color:#444;">
                  $0 today<br />
                  30-day free trial<br />
                  $29.99/month after the trial<br />
                  Cancel anytime
                </div>
              </div>

              <div style="margin-bottom:20px;">
                <div style="font-weight:800;margin-bottom:6px;">Your Live Page</div>
                <a href="${escapeEmailHtml(livePageUrl)}" style="color:#166534;word-break:break-all;">
                  ${escapeEmailHtml(livePageUrl)}
                </a>
              </div>

              <div style="margin-bottom:20px;">
                <div style="font-weight:800;margin-bottom:6px;">Your HomePlanet System</div>
                <a href="${escapeEmailHtml(systemUrl)}" style="color:#166534;word-break:break-all;">
                  ${escapeEmailHtml(systemUrl)}
                </a>
              </div>

              <div style="margin-bottom:24px;">
                <div style="font-weight:800;margin-bottom:6px;">Edit Your Page</div>
                <a href="${escapeEmailHtml(editUrl)}" style="color:#166534;word-break:break-all;">
                  ${escapeEmailHtml(editUrl)}
                </a>
              </div>

              <p style="font-size:13px;line-height:1.6;color:#777;">
                Keep this email private. These owner links provide secure access to your HomePlanet system.
              </p>
            </div>
          `,
          text: [
            "HomePlanet",
            "",
            `${businessName} is active.`,
            "",
            "Your 30-day free trial is active. Your Live Page, HomePlanet System, Work Drawer, and owner tools are ready.",
            "",
            "Trial details",
            "$0 today",
            "30-day free trial",
            "$29.99/month after the trial",
            "Cancel anytime",
            "",
            "Your Live Page",
            livePageUrl,
            "",
            "Your HomePlanet System",
            systemUrl,
            "",
            "Edit Your Page",
            editUrl,
            "",
            "Keep this email private. These owner links provide secure access to your HomePlanet system.",
          ].join("\n"),
        });

        await supabaseAdmin
          .from("starter_system_subscriptions")
          .update({
            activation_email_sent_at: new Date().toISOString(),
            activation_email_message_id: emailResult.messageId,
            updated_at: new Date().toISOString(),
          })
          .eq("live_page_slug", livePageSlug)
          .is("activation_email_sent_at", null);
      } catch (emailError) {
        console.error(
          "Starter activation email failed:",
          emailError
        );
      }
    }

    return jsonResponse({
      ok: true,
      live_page_slug: livePageSlug,
      status: homePlanetStatus,
      paypal_status: paypalStatus,
      paypal_subscription_id: row.paypal_subscription_id,
      trial_started_at: trialStartedAt,
      trial_ends_at: trialEndsAt,
      next_billing_time: nextBillingTime,
      regular_cycle: regularCycle || null,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown PayPal subscription confirmation error occurred.";

    console.error(
      "paypal-confirm-starter-subscription failed:",
      error
    );

    return jsonResponse(
      {
        ok: false,
        error: message,
      },
      500
    );
  }
});
