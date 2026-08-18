import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function clean(value: unknown, max = 500) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

const allowedCategories = [
  "Yard / Outdoor",
  "Home Repair",
  "AC / Appliance",
  "Moving / Heavy Lifting",
  "Food / Supplies",
  "Transportation",
  "Senior Help",
  "Community / Volunteers",
  "Other",
];

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
      error: "Helper registration is not configured.",
    });
  }

  const name = clean(req.body?.name, 160);
  const email = clean(req.body?.email, 320).toLowerCase();
  const phone = clean(req.body?.phone, 80);
  const area = clean(req.body?.area, 200);
  const availability = clean(req.body?.availability, 1000);

  const submittedCategories = Array.isArray(req.body?.categories)
    ? req.body.categories.map((value: unknown) => clean(value, 100))
    : [];

  const categories = submittedCategories.filter((value: string) =>
    allowedCategories.includes(value)
  );

  if (!name || !email || !phone) {
    return res.status(400).json({
      ok: false,
      error: "Name, email, and phone are required.",
    });
  }

  if (!email.includes("@")) {
    return res.status(400).json({
      ok: false,
      error: "Please enter a valid email address.",
    });
  }

  if (categories.length === 0) {
    return res.status(400).json({
      ok: false,
      error: "Choose at least one type of help.",
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

  const { error } = await supabase
    .from("okeechobee_helpers")
    .upsert(
      {
        name,
        email,
        phone,
        categories,
        area: area || null,
        availability: availability || null,
        active: true,
        notifications_enabled: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "email",
      }
    );

  if (error) {
    console.error("Helper registration failed:", error.message);

    return res.status(500).json({
      ok: false,
      error: "Your helper profile could not be saved.",
    });
  }

  return res.status(200).json({
    ok: true,
  });
}
