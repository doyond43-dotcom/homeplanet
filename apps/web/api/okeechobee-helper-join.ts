import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createHash,
  timingSafeEqual,
} from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function clean(value: unknown, max = 500) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
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

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({
      ok: false,
      error: "Helper project service is not configured.",
    });
  }

  const slug = clean(req.body?.slug, 180);
  const token = clean(req.body?.token, 500);

  if (!slug || !token) {
    return res.status(400).json({
      ok: false,
      error: "Invalid helper invitation.",
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

  const incomingHash = hashToken(token);

  const { data: matches, error: matchError } = await supabase
    .from("okeechobee_helper_matches")
    .select(
      "id,helper_id,project_slug,join_token_hash,joined_at"
    )
    .eq("project_slug", slug);

  if (matchError || !matches) {
    return res.status(403).json({
      ok: false,
      error: "Helper invitation could not be verified.",
    });
  }

  const match = matches.find((candidate: any) =>
    hashesMatch(
      incomingHash,
      String(candidate.join_token_hash || "")
    )
  );

  if (!match) {
    return res.status(403).json({
      ok: false,
      error: "This helper invitation is invalid.",
    });
  }

  const { data: helper, error: helperError } = await supabase
    .from("okeechobee_helpers")
    .select("id,name,email,phone,categories,availability")
    .eq("id", match.helper_id)
    .single();

  if (helperError || !helper) {
    return res.status(404).json({
      ok: false,
      error: "Helper profile was not found.",
    });
  }

  if (!match.joined_at) {
    const { data: existing } = await supabase
      .from("okeechobee_project_helpers")
      .select("id")
      .eq("event_slug", slug)
      .eq("email", helper.email)
      .maybeSingle();

    if (!existing) {
      const { error: insertError } = await supabase
        .from("okeechobee_project_helpers")
        .insert({
          event_slug: slug,
          name: helper.name,
          phone: helper.phone,
          email: helper.email,
          help_type:
            Array.isArray(helper.categories) &&
            helper.categories.length > 0
              ? helper.categories.join(", ")
              : "General Volunteer",
          notes: helper.availability
            ? `Availability: ${helper.availability}`
            : null,
        });

      if (insertError) {
        return res.status(500).json({
          ok: false,
          error: "Could not join the project.",
        });
      }
    }

    const now = new Date().toISOString();

    await supabase
      .from("okeechobee_helper_matches")
      .update({
        joined_at: now,
      })
      .eq("id", match.id);

    const { data: event } = await supabase
      .from("okeechobee_events")
      .select("timeline")
      .eq("slug", slug)
      .single();

    const timeline = Array.isArray(event?.timeline)
      ? event.timeline
      : [];

    await supabase
      .from("okeechobee_events")
      .update({
        timeline: [
          ...timeline,
          {
            label: `${helper.name} joined as a matched helper`,
            time: now,
          },
        ],
      })
      .eq("slug", slug);
  }

  return res.status(200).json({
    ok: true,
    helperName: helper.name,
    projectSlug: slug,
  });
}
