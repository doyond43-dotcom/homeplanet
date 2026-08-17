import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import {
  escapeEmailHtml,
  sendHomePlanetEmail,
} from "./_lib/homeplanet-email.js";

function cleanString(value: unknown, maxLength = 5000) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
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
        error: "Okeechobee approval service is not configured.",
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

    const slug = cleanString(req.body?.slug, 180);
    const publicTitle = cleanString(
      req.body?.publicTitle,
      220
    );
    const publicDescription = cleanString(
      req.body?.publicDescription,
      8000
    );

    if (!validSlug(slug)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid project reference.",
      });
    }

    if (!publicTitle || !publicDescription) {
      return res.status(400).json({
        ok: false,
        error: "Project title and description are required.",
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

    const { data: event, error: eventLoadError } =
      await supabase
        .from("okeechobee_events")
        .select("slug,title,status")
        .eq("slug", slug)
        .single();

    if (eventLoadError || !event) {
      return res.status(404).json({
        ok: false,
        error: "Project not found.",
      });
    }

    const { data: owner, error: ownerLoadError } =
      await supabase
        .from("okeechobee_project_owners")
        .select(
          "project_slug,resident_name,resident_email,resident_phone"
        )
        .eq("project_slug", slug)
        .maybeSingle();

    if (ownerLoadError) {
      console.error(
        "Okeechobee owner lookup failed:",
        ownerLoadError.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not check resident ownership.",
      });
    }

    /*
      Legacy requests may not have an ownership record.
      Preserve normal activation for those projects.
    */
    if (!owner) {
      const { error: legacyUpdateError } = await supabase
        .from("okeechobee_events")
        .update({
          public_title: publicTitle,
          public_description: publicDescription,
          status: "Active",
        })
        .eq("slug", slug);

      if (legacyUpdateError) {
        return res.status(500).json({
          ok: false,
          error: "Could not activate the project.",
        });
      }

      return res.status(200).json({
        ok: true,
        slug,
        status: "Active",
        legacy: true,
        ownerEmailSent: false,
      });
    }

    const residentEmail = String(
      owner.resident_email || ""
    ).trim();

    if (!residentEmail) {
      return res.status(400).json({
        ok: false,
        error:
          "This resident ownership record does not have an email address.",
      });
    }

    /*
      Fresh token is generated only when Daniel approves.
      Raw token is sent to the resident but never stored.
    */
    const rawToken = randomBytes(32).toString("base64url");
    const manageTokenHash = hashToken(rawToken);

    const { error: tokenUpdateError } = await supabase
      .from("okeechobee_project_owners")
      .update({
        manage_token_hash: manageTokenHash,
        updated_at: new Date().toISOString(),
      })
      .eq("project_slug", slug);

    if (tokenUpdateError) {
      console.error(
        "Okeechobee token update failed:",
        tokenUpdateError.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not create the resident management link.",
      });
    }

    const publicUrl =
      `https://okeechobeetogether.org/planet/okeechobee/event/${slug}`;

    /*
      Token is placed in the URL fragment.
      Browser fragments are not sent in the initial HTTP request.
    */
    const manageUrl =
      `https://okeechobeetogether.org/planet/okeechobee/manage/${slug}#${rawToken}`;

    await sendHomePlanetEmail({
      recipient: residentEmail,
      project: "okeechobee-project-approved",
      idempotencyKey: `okeechobee-project-approved-${slug}`,
      subject: `Your Okeechobee Together project is approved - ${publicTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
          <h2 style="margin:0 0 10px;">
            Your project has been approved
          </h2>

          <p style="line-height:1.6;">
            Hi ${escapeEmailHtml(String(owner.resident_name || "there"))},
          </p>

          <p style="line-height:1.6;">
            Your Okeechobee Together request is ready.
            You now have a public project page for the community
            and a private link for managing your project.
          </p>

          <div style="margin:22px 0;padding:18px;border:1px solid #ddd;border-radius:12px;">
            <strong>${escapeEmailHtml(publicTitle)}</strong>
          </div>

          <p style="margin:22px 0;">
            <a href="${publicUrl}" style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">
              View Public Project
            </a>
          </p>

          <p style="margin:22px 0;">
            <a href="${manageUrl}" style="display:inline-block;padding:12px 18px;background:#245b2a;color:#fff;text-decoration:none;border-radius:8px;">
              Manage My Project
            </a>
          </p>

          <p style="line-height:1.6;color:#666;">
            Keep the Manage My Project link private.
            It gives access to your project coordination page.
          </p>
        </div>
      `,
    });

    const { error: activateError } = await supabase
      .from("okeechobee_events")
      .update({
        public_title: publicTitle,
        public_description: publicDescription,
        status: "Active",
      })
      .eq("slug", slug);

    if (activateError) {
      console.error(
        "Okeechobee activation failed:",
        activateError.message
      );

      return res.status(500).json({
        ok: false,
        error:
          "Resident email was sent, but the project could not be activated.",
      });
    }

    const now = new Date().toISOString();

    const { error: timestampError } = await supabase
      .from("okeechobee_project_owners")
      .update({
        approval_email_sent_at: now,
        last_notification_at: now,
        updated_at: now,
      })
      .eq("project_slug", slug);

    if (timestampError) {
      console.error(
        "Okeechobee approval timestamp failed:",
        timestampError.message
      );
    }

    return res.status(200).json({
      ok: true,
      slug,
      status: "Active",
      legacy: false,
      ownerEmailSent: true,
    });
  } catch (error) {
    console.error(
      "Okeechobee approval API failed:",
      error instanceof Error
        ? error.message
        : "Unknown error"
    );

    return res.status(500).json({
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Project approval failed.",
    });
  }
}
