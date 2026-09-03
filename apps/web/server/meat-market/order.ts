import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function clean(value: unknown, max = 500) {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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
      error: "Order service is not configured.",
    });
  }

  const sellerSlug = clean(req.body?.sellerSlug, 180);
  const productId = clean(req.body?.productId, 100);
  const productName = clean(req.body?.productName, 200);

  const buyerName = clean(req.body?.buyerName, 160);
  const buyerContact = clean(req.body?.buyerContact, 240);
  const quantity = clean(req.body?.quantity, 160);
  const buyerNotes = clean(req.body?.buyerNotes, 1000);
  const requestedFulfillment = clean(
    req.body?.fulfillment,
    80
  );

  if (!validSlug(sellerSlug)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid seller.",
    });
  }

  if (
    !productName ||
    !buyerName ||
    !buyerContact ||
    !quantity
  ) {
    return res.status(400).json({
      ok: false,
      error:
        "Seller, product, name, contact, and quantity are required.",
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

  const { data: seller, error: sellerError } =
    await supabase
      .from("okeechobee_meat_market_seller_access")
      .select(
        "seller_listing_id,seller_name,fulfillment,pickup_note"
      )
      .eq("seller_listing_id", sellerSlug)
      .maybeSingle();

  if (sellerError || !seller) {
    return res.status(404).json({
      ok: false,
      error: "Seller could not be found.",
    });
  }

  let productQuery = supabase
    .from("okeechobee_meat_market_products")
    .select(
      "id,seller_listing_id,seller_name,name,price,package,fulfillment,availability,status"
    )
    .eq("seller_listing_id", sellerSlug)
    .eq("status", "Active");

  if (productId) {
    productQuery = productQuery.eq("id", productId);
  } else {
    productQuery = productQuery.eq("name", productName);
  }

  const { data: product, error: productError } =
    await productQuery.maybeSingle();

  if (productError || !product) {
    return res.status(404).json({
      ok: false,
      error:
        "That product is no longer available on this seller page.",
    });
  }

  const buyerEmail = looksLikeEmail(buyerContact)
    ? buyerContact
    : null;

  const buyerPhone = buyerEmail
    ? null
    : buyerContact;

  const fulfillmentMethod =
    requestedFulfillment ||
    product.fulfillment ||
    seller.fulfillment ||
    "Pickup";

  const { data: order, error: orderError } =
    await supabase
      .from("okeechobee_meat_market_orders")
      .insert({
        seller_listing_id: seller.seller_listing_id,
        seller_name: seller.seller_name,
        product_id: product.id,
        product_name: product.name,

        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        buyer_email: buyerEmail,

        quantity,
        buyer_notes: buyerNotes || null,

        status: "new",

        fulfillment_method: fulfillmentMethod,
        pickup_note: seller.pickup_note || null,
      })
      .select("id,order_number,status")
      .single();

  if (orderError || !order) {
    console.error(
      "[okeechobee-meat-market-order] insert failed:",
      orderError
    );

    return res.status(500).json({
      ok: false,
      error:
        "We could not start this order right now. Please try again.",
    });
  }

  return res.status(201).json({
    ok: true,
    order: {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      sellerName: seller.seller_name,
      productName: product.name,
    },
  });
}

