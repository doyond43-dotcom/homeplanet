import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

function listingDetail(description: string, label: string) {
  const lines = String(description || "").split(/\r?\n/);
  const prefix = `${label}:`.toLowerCase();

  const match = lines.find((line) =>
    line.trim().toLowerCase().startsWith(prefix)
  );

  return match
    ? match.slice(match.indexOf(":") + 1).trim()
    : "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return res.status(500).json({ error: "Public Meat Market listings are unavailable." });
  }

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("okeechobee_events")
      .select("id,title,description,location")
      .eq("type", "Live Meat Market Seller")
      .eq("status", "Active")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(502).json({ error: "Could not load public Meat Market listings." });
    }

    const listings = (data || []).map((listing) => ({
      id: listing.id,
      businessName:
        String(listing.title || "")
          .replace(/^Live Meat Market Seller:\s*/i, "")
          .trim() || "Local Seller",
      location: listing.location,
      selling: listingDetail(listing.description, "Selling"),
      pricePackage: listingDetail(listing.description, "Price / Package"),
      pickupDelivery: listingDetail(listing.description, "Pickup / Delivery"),
      listingPhoto: listingDetail(listing.description, "Listing Photo"),
    }));
    return res.status(200).json({ listings });
  } catch {
    return res.status(500).json({ error: "Public Meat Market listings are unavailable." });
  }
}
