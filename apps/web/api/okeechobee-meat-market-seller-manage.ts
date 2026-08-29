import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function clean(value: unknown, max = 500) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
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
  if (req.method !== "POST" && req.method !== "GET") {
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
      error: "Seller update service is not configured.",
    });
  }

  const slug = clean(
    req.method === "GET" ? req.query?.slug : req.body?.slug,
    180
  );

  const token =
    req.method === "POST"
      ? clean(req.body?.token, 500)
      : "";

  const action =
    req.method === "POST"
      ? clean(req.body?.action, 80) || "load"
      : "public";

  if (!validSlug(slug)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid seller.",
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

  if (req.method === "GET") {
    const { data: publicSeller, error: publicError } =
      await supabase
        .from("okeechobee_meat_market_seller_access")
        .select(
          "seller_listing_id,order_method,order_destination,fulfillment,pickup_note"
        )
        .eq("seller_listing_id", slug)
        .maybeSingle();

    if (publicError || !publicSeller) {
      return res.status(200).json({
        ok: true,
        seller: null,
      });
    }

    return res.status(200).json({
      ok: true,
      seller: {
        orderMethod: publicSeller.order_method || "",
        orderDestination: publicSeller.order_destination || "",
        fulfillment: publicSeller.fulfillment || "",
        pickupNote: publicSeller.pickup_note || "",
      },
    });
  }

  if (!token) {
    return res.status(400).json({
      ok: false,
      error: "This seller update link is incomplete.",
    });
  }

  const { data: access, error: accessError } =
    await supabase
      .from("okeechobee_meat_market_seller_access")
      .select(
        "seller_listing_id,seller_name,seller_email,manage_token_hash,order_method,order_destination,fulfillment,pickup_note"
      )
      .eq("seller_listing_id", slug)
      .maybeSingle();

  if (accessError || !access) {
    return res.status(403).json({
      ok: false,
      error: "Seller access could not be verified.",
    });
  }

  const incomingHash = hashToken(token);
  const storedHash = String(access.manage_token_hash || "");

  if (!hashesMatch(incomingHash, storedHash)) {
    return res.status(403).json({
      ok: false,
      error: "This seller update link is invalid.",
    });
  }

  if (action === "load") {
    const { data: products, error: productError } =
      await supabase
        .from("okeechobee_meat_market_products")
        .select(
          "id,name,price,package,fulfillment,availability,status,sort_order"
        )
        .eq("seller_listing_id", slug)
        .order("sort_order", { ascending: true });

    if (productError) {
      return res.status(500).json({
        ok: false,
        error: "Could not load seller products.",
      });
    }

    return res.status(200).json({
      ok: true,
      seller: {
        slug,
        name: access.seller_name,
        email: access.seller_email || "",
        orderMethod: access.order_method || "Website",
        orderDestination: access.order_destination || "",
        fulfillment: access.fulfillment || "Pickup",
        pickupNote: access.pickup_note || "",
      },
      products: products || [],
    });
  }

  if (action === "save") {
    const orderMethod = clean(req.body?.orderMethod, 80) || "Website";
    const orderDestination = clean(req.body?.orderDestination, 1000);
    const fulfillment = clean(req.body?.fulfillment, 80) || "Pickup";
    const pickupNote = clean(req.body?.pickupNote, 500);

    const incomingProducts = Array.isArray(req.body?.products)
      ? req.body.products
      : [];

    const products = incomingProducts
      .map((product: any, index: number) => ({
        seller_listing_id: slug,
        seller_name: access.seller_name,
        name: clean(product?.name, 200),
        price: clean(product?.price, 160) || null,
        package: clean(product?.package, 200) || null,
        fulfillment,
        availability:
          clean(product?.availability, 80) || "Available now",
        status: "Active",
        sort_order: index + 1,
      }))
      .filter((product: any) => product.name);

    if (!products.length) {
      return res.status(400).json({
        ok: false,
        error: "Please keep at least one product on your page.",
      });
    }

    const { error: accessUpdateError } =
      await supabase
        .from("okeechobee_meat_market_seller_access")
        .update({
          order_method: orderMethod,
          order_destination: orderDestination || null,
          fulfillment,
          pickup_note: pickupNote || null,
          updated_at: new Date().toISOString(),
        })
        .eq("seller_listing_id", slug);

    if (accessUpdateError) {
      return res.status(500).json({
        ok: false,
        error: "Could not save seller details.",
      });
    }

    const { error: deleteError } =
      await supabase
        .from("okeechobee_meat_market_products")
        .delete()
        .eq("seller_listing_id", slug);

    if (deleteError) {
      return res.status(500).json({
        ok: false,
        error: "Could not update products.",
      });
    }

    const { error: insertError } =
      await supabase
        .from("okeechobee_meat_market_products")
        .insert(products);

    if (insertError) {
      return res.status(500).json({
        ok: false,
        error: "Could not save products.",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Your seller page has been updated.",
    });
  }

  return res.status(400).json({
    ok: false,
    error: "Unknown seller action.",
  });
}

