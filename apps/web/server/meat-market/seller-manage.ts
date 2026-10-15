import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import {
  escapeEmailHtml,
  requiredEmailRecipient,
  sendHomePlanetEmail,
} from "../lib/homeplanet-email.js";

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
      inquiries: [],
      products: products || [],
    });
  }

  if (action === "update-inquiry-status") {
    return res.status(403).json({
      ok: false,
      error: "Customer tracking requires a HomePlanet business workspace.",
    });
  }

  if (action === "express-interest") {
    const interest = clean(req.body?.interest, 100);
    const contact = clean(req.body?.contact, 200);
    const notes = clean(req.body?.notes, 1000);

    const allowedInterests = [
      "Complete Business System",
      "Custom Storefront",
      "Customer Management",
      "Marketing and Follow-Ups",
    ];

    if (!allowedInterests.includes(interest) || !contact) {
      return res.status(400).json({
        ok: false,
        error: "Please choose a service and provide contact details.",
      });
    }

    const businessName = String(access.seller_name || slug);

    const message = [
      "HomePlanet Upgrade Interest",
      "Listing ID: " + slug,
      "Business: " + businessName,
      "Seller Email: " + (access.seller_email || ""),
      "Interested In: " + interest,
      "Notes: " + (notes || "None"),
    ].join("\n");

    // Save first. Notification failure must never erase this lead.
    const { data: savedLead, error: leadError } = await supabase
      .from("homeplanet_leads")
      .insert({
        board_slug: "okeechobee-live-meat-market",
        selected_operation: "HomePlanet Upgrade Interest",
        name: businessName,
        contact,
        message,
      })
      .select("id")
      .single();

    if (leadError || !savedLead?.id) {
      console.error(
        "Upgrade interest save failed:",
        leadError?.message || "Missing saved lead ID"
      );

      return res.status(500).json({
        ok: false,
        error: "Could not record your interest. Please try again.",
      });
    }

    const leadId = String(savedLead.id);
    let notificationAccepted = false;

    try {
      const safeBusiness = escapeEmailHtml(businessName);
      const safeContact = escapeEmailHtml(contact);
      const safeInterest = escapeEmailHtml(interest);
      const safeNotes = escapeEmailHtml(notes || "None");
      const safeSlug = escapeEmailHtml(slug);
      const safeLeadId = escapeEmailHtml(leadId);

      const delivery = await sendHomePlanetEmail({
        recipient: requiredEmailRecipient(
          "HOMEPLANET_ADMIN_EMAIL"
        ),
        project: "homeplanet-upgrade-interest",
        idempotencyKey: "homeplanet-upgrade-interest-" + leadId,
        subject:
          "HomePlanet Upgrade Interest - " + businessName,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:24px;color:#18251c;">
            <h2>New HomePlanet Business Opportunity</h2>
            <p>A Live Meat Market seller wants to grow with HomePlanet.</p>

            <div style="padding:20px;border:1px solid #ddd;border-radius:12px;">
              <p><strong>Business:</strong> ${safeBusiness}</p>
              <p><strong>Seller Listing:</strong> ${safeSlug}</p>
              <p><strong>Contact:</strong> ${safeContact}</p>
              <p><strong>Interested In:</strong> ${safeInterest}</p>

              <p><strong>Additional Notes:</strong></p>
              <p style="white-space:pre-wrap;">${safeNotes}</p>
            </div>

            <p><strong>Next Action:</strong> Contact the seller about their HomePlanet business system.</p>

            <p style="font-size:12px;color:#666;">
              Saved HomePlanet Lead: ${safeLeadId}
            </p>
          </div>
        `,
        text: [
          "NEW HOMEPLANET BUSINESS OPPORTUNITY",
          "",
          "Business: " + businessName,
          "Seller Listing: " + slug,
          "Contact: " + contact,
          "Interested In: " + interest,
          "",
          "Additional Notes:",
          notes || "None",
          "",
          "Next Action: Contact the seller.",
          "Saved Lead ID: " + leadId,
        ].join("\n"),
      });

      notificationAccepted = delivery.accepted === true;

    } catch (emailError) {
      // The interest is already safely saved in Supabase.
      // Do not return a failed lead submission just because email failed.
      console.error("HomePlanet upgrade notification failed", {
        leadId,
        errorType:
          emailError instanceof Error
            ? emailError.name
            : "UnknownError",
      });
    }

    // GROWTH_BOARD_UPGRADE_INTEGRATION_V2
    // Recover missing follow-ups without duplicating existing records.
    // Original lead saving and email delivery remain independent.
    let growthLinked = false;

    try {
      const ownerId = "edca8e9f-ccf5-4aaf-bf01-fbd26adeaab1";
      const relationshipSource = "Live Meat Market: " + slug;

      const { data: existingOpportunity, error: lookupError } =
        await supabase
          .from("hp_growth_opportunities")
          .select("id, person_id")
          .eq("source_lead_id", leadId)
          .maybeSingle();

      if (lookupError) throw lookupError;

      let opportunityId = existingOpportunity?.id;
      let personId = existingOpportunity?.person_id;

      if (!opportunityId) {
        const { data: existingPeople, error: personLookupError } =
          await supabase
            .from("hp_growth_people")
            .select("id")
            .eq("owner_id", ownerId)
            .eq("source", relationshipSource)
            .limit(1);

        if (personLookupError) throw personLookupError;

        personId = existingPeople?.[0]?.id;

        if (!personId) {
          const contactIsEmail = contact.includes("@");

          const { data: newPerson, error: personError } =
            await supabase
              .from("hp_growth_people")
              .insert({
                owner_id: ownerId,
                name: businessName,
                lane: "Business Development",
                source: relationshipSource,
                status: "active",
                notes: "Seller interested in growing with HomePlanet.",
                email: contactIsEmail ? contact : null,
                phone: contactIsEmail ? null : contact,
              })
              .select("id")
              .single();

          if (personError) throw personError;
          personId = newPerson.id;
        }

        const { data: opportunity, error: opportunityError } =
          await supabase
            .from("hp_growth_opportunities")
            .insert({
              owner_id: ownerId,
              person_id: personId,
              source_lead_id: leadId,
              title: interest + " - " + businessName,
              description: [
                "Source: Okeechobee Live Meat Market",
                "Seller listing: " + slug,
                "Contact: " + contact,
                "Interest: " + interest,
                "Notes: " + (notes || "None"),
                "Original lead: " + leadId,
              ].join("\n"),
              status: "exploring",
            })
            .select("id")
            .single();

        if (opportunityError) {
          if (opportunityError.code !== "23505") throw opportunityError;

          const { data: recovered, error: recoveryError } =
            await supabase
              .from("hp_growth_opportunities")
              .select("id, person_id")
              .eq("source_lead_id", leadId)
              .single();

          if (recoveryError) throw recoveryError;
          opportunityId = recovered.id;
          personId = recovered.person_id;
        } else {
          opportunityId = opportunity.id;
        }
      }

      if (!personId || !opportunityId) {
        throw new Error("Growth relationship or opportunity missing.");
      }

      const { data: existingActions, error: actionLookupError } =
        await supabase
          .from("hp_growth_actions")
          .select("id")
          .eq("opportunity_id", opportunityId)
          .limit(1);

      if (actionLookupError) throw actionLookupError;

      if (!existingActions?.length) {
        const { error: actionError } =
          await supabase
            .from("hp_growth_actions")
            .insert({
              owner_id: ownerId,
              person_id: personId,
              opportunity_id: opportunityId,
              title: "Contact " + businessName + " about " + interest,
              status: "open",
            });

        if (actionError) throw actionError;
      }

      const { data: existingHistory, error: historyLookupError } =
        await supabase
          .from("hp_growth_interactions")
          .select("id")
          .eq("person_id", personId)
          .ilike("summary", "%Saved lead: " + leadId + "%")
          .limit(1);

      if (historyLookupError) throw historyLookupError;

      if (!existingHistory?.length) {
        const { error: historyError } =
          await supabase
            .from("hp_growth_interactions")
            .insert({
              owner_id: ownerId,
              person_id: personId,
              kind: "message",
              source_type: "document",
              summary:
                "Seller submitted HomePlanet upgrade interest. " +
                "Service: " + interest +
                ". Saved lead: " + leadId +
                ". Notes: " + (notes || "None"),
            });

        if (historyError) throw historyError;
      }

      growthLinked = true;
    } catch (growthError) {
      console.error("HomePlanet Growth Board integration failed", {
        leadId,
        error:
          growthError instanceof Error
            ? growthError.message
            : "Unknown error",
      });
    }

    return res.status(200).json({
      ok: true,
      leadId,
      notificationAccepted,
      growthLinked,
      message: "Your interest has been recorded.",
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


