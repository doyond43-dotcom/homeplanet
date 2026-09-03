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
          "seller_listing_id,order_method,order_destination,payment_provider,payment_destination,checkout_enabled,fulfillment,pickup_note"
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
        paymentProvider: publicSeller.payment_provider || "",
        paymentDestination: publicSeller.payment_destination || "",
        checkoutEnabled: Boolean(publicSeller.checkout_enabled),
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
        "seller_listing_id,seller_name,seller_email,manage_token_hash,order_method,order_destination,payment_provider,payment_destination,checkout_enabled,fulfillment,pickup_note"
      )
      .eq("seller_listing_id", slug)
      .maybeSingle();

  if (accessError || !access) {
    return res.status(403).json({
      ok: false,
      error: "Seller access could not be verified.",
    });
  }

  console.log("[seller-manage-token]", {
    slug,
    length: token.length,
    first4: token.slice(0, 4),
    last4: token.slice(-4),
  });

  const incomingHash = hashToken(token);
  const storedHash = String(access.manage_token_hash || "");

  if (!hashesMatch(incomingHash, storedHash)) {
    return res.status(403).json({
      ok: false,
      error: "This seller update link is invalid.",
    });
  }

  if (action === "load") {
    const { data: sellerProfile, error: sellerProfileError } =
      await supabase
        .from("okeechobee_meat_market_sellers")
        .select("hero_image")
        .eq("slug", slug)
        .maybeSingle();

    if (sellerProfileError) {
      return res.status(500).json({
        ok: false,
        error: "Could not load seller storefront photo.",
      });
    }

    const { data: products, error: productError } =
      await supabase
        .from("okeechobee_meat_market_products")
        .select(
          "id,name,category,price,package,checkout_price,market_marker,quantity_available,pickup_timing,fulfillment,availability,status,sort_order,description,image_url,external_order_url,featured"
        )
        .eq("seller_listing_id", slug)
        .order("sort_order", { ascending: true });

    if (productError) {
      return res.status(500).json({
        ok: false,
        error: "Could not load seller products.",
      });
    }

    const { data: sellerEvents, error: sellerEventsError } =
      await supabase
        .from("okeechobee_meat_market_events")
        .select(
          "event_type,session_id,seller_slug,product_name,created_at"
        )
        .eq("seller_slug", slug)
        .order("created_at", { ascending: true });

    if (sellerEventsError) {
      return res.status(500).json({
        ok: false,
        error: "Could not load seller activity.",
      });
    }

    const cleanSellerEvents = (() => {
      const lastSeen = new Map<string, number>();

      return (sellerEvents || []).filter((event: any) => {
        if (
          event.event_type !== "market_view" &&
          event.event_type !== "seller_view"
        ) {
          return true;
        }

        const key = [
          event.session_id || "anonymous",
          event.event_type,
          event.seller_slug || "market",
        ].join("|");

        const timestamp = new Date(event.created_at).getTime();
        const previous = lastSeen.get(key) || 0;

        lastSeen.set(key, timestamp);

        return timestamp - previous >= 2000;
      });
    })();

    const sevenDayCutoff =
      Date.now() - 7 * 24 * 60 * 60 * 1000;

    function summarizeSellerActivity(events: any[]) {
      const storefrontViews = events.filter(
        (event: any) => event.event_type === "seller_view"
      ).length;

      const productClicks = events.filter(
        (event: any) =>
          event.event_type === "product_order_click"
      ).length;

      const buyerHandoffs = events.filter(
        (event: any) =>
          event.event_type === "seller_link_click"
      ).length;

      const productCounts = new Map<string, number>();

      events
        .filter(
          (event: any) =>
            event.event_type === "product_order_click"
        )
        .forEach((event: any) => {
          const name = String(event.product_name || "").trim();

          if (!name) return;

          productCounts.set(
            name,
            (productCounts.get(name) || 0) + 1
          );
        });

      const topProducts = Array.from(productCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, clicks]) => ({
          name,
          clicks,
        }));

      return {
        storefrontViews,
        productClicks,
        buyerHandoffs,
        topProducts,
      };
    }

    const analytics = {
      sevenDays: summarizeSellerActivity(
        cleanSellerEvents.filter(
          (event: any) =>
            new Date(event.created_at).getTime() >=
            sevenDayCutoff
        )
      ),
      allTime: summarizeSellerActivity(cleanSellerEvents),
    };
    return res.status(200).json({
      ok: true,
      seller: {
        slug,
        name: access.seller_name,
        email: access.seller_email || "",
        heroImage: sellerProfile?.hero_image || "",
        orderMethod: access.order_method || "Website",
        orderDestination: access.order_destination || "",
        paymentProvider: access.payment_provider || "",
        paymentDestination: access.payment_destination || "",
        checkoutEnabled: Boolean(access.checkout_enabled),
        fulfillment: access.fulfillment || "Pickup",
        pickupNote: access.pickup_note || "",
      },
      analytics,
      products: products || [],
    });
  }

  if (action === "save") {
    const heroImage = clean(req.body?.heroImage, 1500000);

    const orderMethod = clean(req.body?.orderMethod, 80) || "Website";
    const orderDestination = clean(req.body?.orderDestination, 1000);
    const paymentProvider = clean(req.body?.paymentProvider, 80);
    const paymentDestination = clean(req.body?.paymentDestination, 2000);
    const checkoutEnabled = Boolean(req.body?.checkoutEnabled);
    const fulfillment = clean(req.body?.fulfillment, 80) || "Pickup";
    const pickupNote = clean(req.body?.pickupNote, 500);

    const incomingProducts = Array.isArray(req.body?.products)
      ? req.body.products
      : [];

    const products = incomingProducts
      .map((product: any, index: number) => ({
        id: clean(product?.id, 100) || null,
        seller_listing_id: slug,
        seller_name: access.seller_name,
        name: clean(product?.name, 200),
        category: clean(product?.category, 100) || null,
        price: clean(product?.price, 160) || null,
        package: clean(product?.package, 200) || null,
        checkout_price:
          product?.checkoutPrice === "" ||
          product?.checkoutPrice == null
            ? null
            : Number(product.checkoutPrice),
        market_marker:
          clean(product?.marketMarker, 100) || null,
        quantity_available:
          clean(product?.quantityAvailable, 160) || null,
        pickup_timing:
          clean(product?.pickupTiming, 200) || null,
        fulfillment,
        availability:
          clean(product?.availability, 80) ||
          "Available now",
        description:
          clean(product?.description, 2000) || null,
        image_url:
          clean(product?.imageUrl, 1500000) || null,
        external_order_url:
          clean(product?.externalOrderUrl, 2000) ||
          null,
        featured: Boolean(product?.featured),
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

    const { error: sellerProfileUpdateError } =
      await supabase
        .from("okeechobee_meat_market_sellers")
        .update({
          hero_image: heroImage || null,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", slug);

    if (sellerProfileUpdateError) {
      return res.status(500).json({
        ok: false,
        error: "Could not save storefront photo.",
      });
    }

    const { error: accessUpdateError } =
      await supabase
        .from("okeechobee_meat_market_seller_access")
        .update({
          order_method: orderMethod,
          order_destination: orderDestination || null,
          payment_provider: paymentProvider || null,
          payment_destination: paymentDestination || null,
          checkout_enabled: checkoutEnabled,
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

    const { data: existingProducts, error: existingError } =
      await supabase
        .from("okeechobee_meat_market_products")
        .select("id")
        .eq("seller_listing_id", slug);

    if (existingError) {
      return res.status(500).json({
        ok: false,
        error: "Could not load existing products.",
      });
    }

    const existingIds = new Set(
      (existingProducts || []).map((product: any) =>
        String(product.id)
      )
    );

    const incomingExistingIds = new Set(
      products
        .map((product: any) => String(product.id || ""))
        .filter((id: string) => existingIds.has(id))
    );

    for (const product of products) {
      const productId = String(product.id || "");
      const payload = {
        seller_listing_id: product.seller_listing_id,
        seller_name: product.seller_name,
        name: product.name,
        category: product.category,
        price: product.price,
        package: product.package,
        checkout_price: product.checkout_price,
        market_marker: product.market_marker,
        quantity_available: product.quantity_available,
        pickup_timing: product.pickup_timing,
        fulfillment: product.fulfillment,
        availability: product.availability,
        description: product.description,
        image_url: product.image_url,
        external_order_url: product.external_order_url,
        featured: product.featured,
        status: product.status,
        sort_order: product.sort_order,
      };

      if (productId && existingIds.has(productId)) {
        const { error: updateError } =
          await supabase
            .from("okeechobee_meat_market_products")
            .update(payload)
            .eq("id", productId)
            .eq("seller_listing_id", slug);

        if (updateError) {
          return res.status(500).json({
            ok: false,
            error: `Could not update ${product.name}.`,
          });
        }
      } else {
        const { error: insertError } =
          await supabase
            .from("okeechobee_meat_market_products")
            .insert(payload);

        if (insertError) {
          return res.status(500).json({
            ok: false,
            error: `Could not add ${product.name}.`,
          });
        }
      }
    }

    // Do not delete products just because they are missing from a save payload.
    // Product deletion must be an explicit seller action.

    const { data: savedProducts, error: savedProductsError } =
      await supabase
        .from("okeechobee_meat_market_products")
        .select(
          "id,name,category,price,package,checkout_price,market_marker,quantity_available,pickup_timing,fulfillment,availability,status,sort_order,description,image_url,external_order_url,featured"
        )
        .eq("seller_listing_id", slug)
        .order("sort_order", { ascending: true });

    if (savedProductsError) {
      return res.status(500).json({
        ok: false,
        error: "Products saved, but could not reload them.",
      });
    }
    return res.status(200).json({
      ok: true,
      message: "Your seller page has been updated.",
      products: savedProducts || [],
    });
  }

  return res.status(400).json({
    ok: false,
    error: "Unknown seller action.",
  });
}


