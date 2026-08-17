import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createHash,
  timingSafeEqual,
} from "node:crypto";
import { createClient } from "@supabase/supabase-js";

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
      error: "Resident project service is not configured.",
    });
  }

  const slug = cleanString(req.body?.slug, 180);
  const token = cleanString(req.body?.token, 500);
  const action = cleanString(req.body?.action, 80) || "load";

  if (!validSlug(slug) || !token) {
    return res.status(400).json({
      ok: false,
      error: "Invalid project access link.",
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

  try {
    const { data: owner, error: ownerError } =
      await supabase
        .from("okeechobee_project_owners")
        .select(
          "project_slug,resident_name,manage_token_hash"
        )
        .eq("project_slug", slug)
        .maybeSingle();

    if (ownerError || !owner) {
      return res.status(403).json({
        ok: false,
        error: "Project access could not be verified.",
      });
    }

    const incomingHash = hashToken(token);
    const storedHash = String(owner.manage_token_hash || "");

    if (!hashesMatch(incomingHash, storedHash)) {
      return res.status(403).json({
        ok: false,
        error: "This project management link is invalid.",
      });
    }

    if (action === "add-need") {
      const title = cleanString(req.body?.title, 300);

      if (!title) {
        return res.status(400).json({
          ok: false,
          error: "Please describe what is still needed.",
        });
      }

      const { data: currentEvent, error: currentError } =
        await supabase
          .from("okeechobee_events")
          .select("project_needs")
          .eq("slug", slug)
          .single();

      if (currentError) {
        return res.status(500).json({
          ok: false,
          error: "Could not load project needs.",
        });
      }

      const currentNeeds = Array.isArray(
        currentEvent?.project_needs
      )
        ? currentEvent.project_needs
        : [];

      const nextNeeds = [
        ...currentNeeds,
        {
          id: Date.now(),
          title,
          status: "open",
        },
      ];

      const { error: needError } = await supabase
        .from("okeechobee_events")
        .update({
          project_needs: nextNeeds,
        })
        .eq("slug", slug);

      if (needError) {
        return res.status(500).json({
          ok: false,
          error: "Could not add the project need.",
        });
      }
    }

    if (action === "resolve") {
      const { data: currentEvent, error: currentError } =
        await supabase
          .from("okeechobee_events")
          .select("timeline")
          .eq("slug", slug)
          .single();

      if (currentError) {
        return res.status(500).json({
          ok: false,
          error: "Could not load the project.",
        });
      }

      const timeline = Array.isArray(currentEvent?.timeline)
        ? currentEvent.timeline
        : [];

      const nextTimeline = [
        ...timeline,
        {
          label: "Project resolved by resident",
          time: new Date().toISOString(),
        },
      ];

      const { error: resolveError } = await supabase
        .from("okeechobee_events")
        .update({
          status: "Resolved",
          timeline: nextTimeline,
        })
        .eq("slug", slug);

      if (resolveError) {
        return res.status(500).json({
          ok: false,
          error: "Could not resolve the project.",
        });
      }
    }

    if (
      !["load", "add-need", "resolve"].includes(action)
    ) {
      return res.status(400).json({
        ok: false,
        error: "Unsupported project action.",
      });
    }

    const [
      eventResult,
      helperResult,
      materialResult,
      taskResult,
      availabilityResult,
    ] = await Promise.all([
      supabase
        .from("okeechobee_events")
        .select(
          "slug,title,public_title,description,public_description,location,status,project_needs,timeline"
        )
        .eq("slug", slug)
        .single(),

      supabase
        .from("okeechobee_project_helpers")
        .select(
          "id,name,phone,email,help_type,notes,created_at"
        )
        .eq("event_slug", slug)
        .order("created_at", { ascending: true }),

      supabase
        .from("okeechobee_project_materials")
        .select("*")
        .eq("project_slug", slug)
        .order("created_at", { ascending: true }),

      supabase
        .from("okeechobee_project_tasks")
        .select("*")
        .eq("project_slug", slug)
        .order("created_at", { ascending: true }),

      supabase
        .from("okeechobee_project_availability")
        .select("*")
        .eq("project_slug", slug)
        .order("created_at", { ascending: true }),
    ]);

    if (eventResult.error || !eventResult.data) {
      return res.status(404).json({
        ok: false,
        error: "Project not found.",
      });
    }

    await supabase
      .from("okeechobee_project_owners")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("project_slug", slug);

    return res.status(200).json({
      ok: true,
      residentName: owner.resident_name,
      project: eventResult.data,
      helpers: helperResult.data || [],
      materials: materialResult.data || [],
      tasks: taskResult.data || [],
      availability: availabilityResult.data || [],
    });
  } catch (error) {
    console.error(
      "Okeechobee resident manage API failed:",
      error instanceof Error
        ? error.message
        : "Unknown error"
    );

    return res.status(500).json({
      ok: false,
      error: "Could not load the resident project.",
    });
  }
}
