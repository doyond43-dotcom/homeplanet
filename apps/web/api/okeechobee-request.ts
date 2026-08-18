import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function cleanString(value: unknown, maxLength = 5000) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function tokenHash(token: string) {
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
      error: "Request service is not configured.",
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const body =
      req.body && typeof req.body === "object"
        ? req.body
        : {};

    const slug = cleanString(body.slug, 180);
    const title = cleanString(body.title, 180);
    const story = cleanString(body.story, 5000);
    const location = cleanString(body.location, 250);
    const category = cleanString(body.category, 120);
    const urgency = cleanString(body.urgency, 120);
    const whoFor = cleanString(body.whoFor, 160);

    const residentName = cleanString(body.residentName, 180);
    const residentEmail = cleanString(body.residentEmail, 320).toLowerCase();
    const residentPhone = cleanString(body.residentPhone, 80);
    const privateNotes = cleanString(body.privateNotes, 2000);

    const yardCondition = cleanString(body.yardCondition, 160);

    const yardHelpTypesSelected = Array.isArray(body.yardHelpTypesSelected)
      ? body.yardHelpTypesSelected
          .map((item: unknown) => cleanString(item, 120))
          .filter(Boolean)
          .slice(0, 20)
      : [];

    if (!validSlug(slug)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid request reference.",
      });
    }

    if (!title) {
      return res.status(400).json({
        ok: false,
        error: "Please add a short title.",
      });
    }

    if (!story) {
      return res.status(400).json({
        ok: false,
        error: "Please add request details.",
      });
    }

    if (!residentName) {
      return res.status(400).json({
        ok: false,
        error: "Please add your name.",
      });
    }

    if (!residentEmail || !validEmail(residentEmail)) {
      return res.status(400).json({
        ok: false,
        error: "Please add a valid email address.",
      });
    }

    const isYard = category.toLowerCase().includes("yard");

    const guidedDetails = [
      `Category: ${category}`,
      isYard ? `Yard condition: ${yardCondition}` : "",
      isYard && yardHelpTypesSelected.length
        ? `What best describes the need: ${yardHelpTypesSelected.join(", ")}`
        : "",
      `Urgency: ${urgency}`,
      `Who this is for: ${whoFor}`,
      "",
      "Request details:",
      story,
    ]
      .filter(Boolean)
      .join("\n");

    const event = {
      slug,
      type: "Need",
      category,
      title,
      description: guidedDetails,
      location: location || "Okeechobee, FL",

      // Private resident details no longer live in the public event record.
      contact: "",

      status: "Pending Review",
      timeline: [
        {
          label: "Request submitted for review",
          time: new Date().toISOString(),
        },
      ],
    };

    const { error: eventError } = await supabase
      .from("okeechobee_events")
      .insert(event);

    if (eventError) {
      console.error("Okeechobee event insert failed:", eventError.message);

      return res.status(500).json({
        ok: false,
        error: "Unable to save the request.",
      });
    }

    // Generate an initial credential hash.
    // The raw credential is intentionally discarded.
    // A fresh management token will be issued when the project is approved.
    const initialToken = randomBytes(32).toString("base64url");

    const { error: ownerError } = await supabase
      .from("okeechobee_project_owners")
      .insert({
        project_slug: slug,
        resident_name: residentName,
        resident_email: residentEmail,
        resident_phone: residentPhone || null,
        private_notes: privateNotes || null,
        manage_token_hash: tokenHash(initialToken),
      });

    if (ownerError) {
      console.error(
        "Okeechobee owner insert failed:",
        ownerError.message
      );

      // Avoid leaving an orphan public request if private ownership fails.
      await supabase
        .from("okeechobee_events")
        .delete()
        .eq("slug", slug);

      return res.status(500).json({
        ok: false,
        error: "Unable to create project ownership.",
      });
    }

    return res.status(200).json({
      ok: true,
      slug,
      status: "Pending Review",
    });
  } catch (error) {
    console.error(
      "Okeechobee request endpoint failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return res.status(500).json({
      ok: false,
      error: "Unable to submit the request.",
    });
  }
}

