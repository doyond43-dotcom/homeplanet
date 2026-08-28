import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed.",
    });
  }

  try {
    const authorization = String(req.headers.authorization || "");

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        error: "Authentication required.",
      });
    }

    const supabaseUrl = String(
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      ""
    ).trim();

    const anonKey = String(
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      ""
    ).trim();

    const serviceRoleKey = String(
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    ).trim();

    const adminEmail = String(
      process.env.OKEECHOBEE_TOGETHER_ADMIN_EMAIL || ""
    )
      .trim()
      .toLowerCase();

    if (
      !supabaseUrl ||
      !anonKey ||
      !serviceRoleKey ||
      !adminEmail
    ) {
      return res.status(503).json({
        ok: false,
        error: "Okeechobee Command Center is not configured.",
      });
    }

    const userResponse = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        headers: {
          Authorization: authorization,
          apikey: anonKey,
        },
      }
    );

    if (!userResponse.ok) {
      return res.status(401).json({
        ok: false,
        error: "Invalid session.",
      });
    }

    const user = await userResponse.json();

    const signedInEmail = String(user?.email || "")
      .trim()
      .toLowerCase();

    if (!signedInEmail || signedInEmail !== adminEmail) {
      return res.status(403).json({
        ok: false,
        error: "Okeechobee administrator access required.",
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

    if (req.method === "POST") {
      const helperId = String(req.body?.helperId || "").trim();
      const status = String(req.body?.status || "").trim();

      const allowedStatuses = new Set([
        "new",
        "contacted",
        "confirmed",
        "scheduled",
        "completed",
        "couldnt_help",
      ]);

      if (!helperId || !allowedStatuses.has(status)) {
        return res.status(400).json({
          ok: false,
          error: "A valid helper and status are required.",
        });
      }

      const { data: helper, error: helperUpdateError } =
        await supabase
          .from("okeechobee_project_helpers")
          .update({ status })
          .eq("id", helperId)
          .select(
            "id,event_slug,name,phone,email,help_type,notes,created_at,status"
          )
          .maybeSingle();

      if (helperUpdateError) {
        console.error(
          "Command Center helper status update failed:",
          helperUpdateError.message
        );

        return res.status(500).json({
          ok: false,
          error: "Could not update helper status.",
        });
      }

      if (!helper) {
        return res.status(404).json({
          ok: false,
          error: "Helper was not found.",
        });
      }

      return res.status(200).json({
        ok: true,
        helper,
      });
    }

    const [
      eventsResult,
      ownersResult,
      helpersResult,
      meatMarketBuyerResult,
    ] = await Promise.all([
      supabase
        .from("okeechobee_events")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("okeechobee_project_owners")
        .select(
          "project_slug,resident_name,resident_email,resident_phone,private_notes,approval_email_sent_at,last_notification_at"
        ),

      supabase
        .from("okeechobee_project_helpers")
        .select("event_slug,id,name,phone,email,help_type,notes,created_at,status"),

      supabase
        .from("homeplanet_leads")
        .select(
          "id,name,contact,message,business_name,board_slug,selected_operation,created_at"
        )
        .eq("board_slug", "okeechobee-live-meat-market")
        .eq(
          "selected_operation",
          "Okeechobee Live Meat Market Buyer Request"
        )
        .order("created_at", { ascending: false }),
    ]);

    if (eventsResult.error) {
      console.error(
        "Command Center event load failed:",
        eventsResult.error.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not load projects.",
      });
    }

    if (ownersResult.error) {
      console.error(
        "Command Center owner load failed:",
        ownersResult.error.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not load resident information.",
      });
    }

    if (helpersResult.error) {
      console.error(
        "Command Center helper load failed:",
        helpersResult.error.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not load helper information.",
      });
    }

    if (meatMarketBuyerResult.error) {
      console.error(
        "Command Center Meat Market buyer load failed:",
        meatMarketBuyerResult.error.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not load Meat Market buyer requests.",
      });
    }

    const ownersBySlug = new Map(
      (ownersResult.data || []).map((owner: any) => [
        owner.project_slug,
        owner,
      ])
    );

    const helperCountBySlug = new Map<string, number>();
    const helpersBySlug = new Map<string, any[]>();

    for (const helper of helpersResult.data || []) {
      const slug = String((helper as any).event_slug || "");
      if (!slug) continue;

      helperCountBySlug.set(
        slug,
        (helperCountBySlug.get(slug) || 0) + 1
      );

      const existingHelpers = helpersBySlug.get(slug) || [];
      existingHelpers.push(helper);
      helpersBySlug.set(slug, existingHelpers);
    }

    const events = (eventsResult.data || []).map((event: any) => {
      const owner = ownersBySlug.get(event.slug) as any;

      return {
        ...event,

        resident_name:
          owner?.resident_name || null,

        resident_email:
          owner?.resident_email || null,

        resident_phone:
          owner?.resident_phone || null,

        private_notes:
          owner?.private_notes || null,

        approval_email_sent_at:
          owner?.approval_email_sent_at || null,

        last_notification_at:
          owner?.last_notification_at || null,

        helper_count:
          helperCountBySlug.get(event.slug) || 0,

        helpers:
          helpersBySlug.get(event.slug) || [],
      };
    });

    return res.status(200).json({
      ok: true,
      events,
      meatMarketBuyers: meatMarketBuyerResult.data || [],
    });
  } catch (error) {
    console.error("Command Center API error:", error);

    return res.status(500).json({
      ok: false,
      error: "Could not load the Command Center.",
    });
  }
}




