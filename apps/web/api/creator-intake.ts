import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

type IntakePayload = {
  full_name?: string;
  phone?: string;
  email?: string;
  preferred_contact?: string;
  help_request?: string;
  address?: string;
  best_time?: string;
};

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body ?? {};
    const slug = cleanString(body.slug);
    const payload: IntakePayload =
      body.payload && typeof body.payload === "object" ? body.payload : {};

    if (!slug) {
      return res.status(400).json({ error: "Missing slug" });
    }

    const full_name = cleanString(payload.full_name);
    const phone = cleanString(payload.phone);
    const email = cleanString(payload.email);
    const preferred_contact = cleanString(payload.preferred_contact);
    const help_request = cleanString(payload.help_request);
    const address = cleanString(payload.address);
    const best_time = cleanString(payload.best_time);

    const minimalOk = full_name || phone || email || help_request;

    if (!minimalOk) {
      return res.status(400).json({
        error: "Add at least a name, phone, email, or short description.",
      });
    }

    const { data: pageRow, error: pageError } = await supabase
      .from("public_pages")
      .select("project_id, slug, mode")
      .eq("slug", slug)
      .maybeSingle();

    if (pageError) {
      console.error("public_pages lookup error:", pageError);
      return res.status(500).json({ error: "Failed to verify page" });
    }

    if (!pageRow?.project_id) {
      return res.status(404).json({ error: "Public page not found" });
    }

    const insert = {
      project_id: pageRow.project_id,
      page_slug: slug,
      full_name,
      phone,
      email,
      preferred_contact,
      help_request,
      address,
      best_time,
      source: "creator_studio",
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from("public_intake_submissions")
      .insert(insert);

    if (insertError) {
      console.error("public_intake_submissions insert error:", insertError);
      return res.status(500).json({ error: "Insert failed" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("creator-intake handler error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}