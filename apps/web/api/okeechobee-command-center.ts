import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { createHash, randomBytes } from "node:crypto";
import {
  escapeEmailHtml,
  sendHomePlanetEmail,
} from "../server/lib/homeplanet-email.js";
import { sendHomePlanetSms } from "../server/lib/homeplanet-sms.js";

function meatMarketDescriptionLine(description: unknown, label: string) {
  const lines = String(description || "").split(/\r?\n/);
  const prefix = `${label}:`;

  const line = lines.find((item) =>
    item.trim().toLowerCase().startsWith(prefix.toLowerCase())
  );

  if (!line) return "";

  return line.slice(line.indexOf(":") + 1).trim();
}

function meatMarketSellerName(listing: any) {
  return (
    meatMarketDescriptionLine(listing?.description, "Ranch / Business") ||
    String(listing?.title || "")
      .replace(/^Live Meat Market Seller:\s*/i, "")
      .trim() ||
    "Local Seller"
  );
}

function meatMarketSlugify(value: unknown) {
  return (
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "local-seller"
  );
}
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed.",
    });
  }

  try {
    const authorization = String(req.headers.authorization || "");

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        error: "Authentication required.",
      });
    }

    const supabaseUrl = String(
      process.env.SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      ""
    ).trim();

    const anonKey = String(
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      ""
    ).trim();

    const serviceRoleKey = String(
      process.env.SUPABASE_SERVICE_ROLE_KEY || ""
    ).trim();

    const adminEmail = String(
      process.env.OKEECHOBEE_TOGETHER_ADMIN_EMAIL || ""
    )
      .trim()
      .toLowerCase();

    if (
      !supabaseUrl ||
      !anonKey ||
      !serviceRoleKey ||
      !adminEmail
    ) {
      return res.status(503).json({
        ok: false,
        error: "Okeechobee Command Center is not configured.",
      });
    }

    const userResponse = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        headers: {
          Authorization: authorization,
          apikey: anonKey,
        },
      }
    );

    if (!userResponse.ok) {
      return res.status(401).json({
        ok: false,
        error: "Invalid session.",
      });
    }

    const user = await userResponse.json();

    const signedInEmail = String(user?.email || "")
      .trim()
      .toLowerCase();

    if (!signedInEmail || signedInEmail !== adminEmail) {
      return res.status(403).json({
        ok: false,
        error: "Okeechobee administrator access required.",
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

    if (req.method === "POST") {
      const action = String(req.body?.action || "").trim();

      if (action === "approve_meat_market_seller") {
        const eventId = String(req.body?.eventId || "").trim();

        if (!eventId) {
          return res.status(400).json({
            ok: false,
            error: "Seller submission is required.",
          });
        }

        const { data: listing, error: listingError } =
          await supabase
            .from("okeechobee_events")
            .select("*")
            .eq("id", eventId)
            .eq("type", "Live Meat Market Seller")
            .maybeSingle();

        if (listingError || !listing) {
          return res.status(404).json({
            ok: false,
            error: "Seller submission was not found.",
          });
        }

        const verification = meatMarketDescriptionLine(
          listing.description,
          "Verification"
        ).toLowerCase();

        if (verification !== "verified local seller") {
          return res.status(400).json({
            ok: false,
            error: "Verify this seller before approving access.",
          });
        }

        const sellerName = meatMarketSellerName(listing);

        const sellerEmail =
          meatMarketDescriptionLine(
            listing.description,
            "Email"
          ) || null;

        const sellerPhone =
          meatMarketDescriptionLine(
            listing.description,
            "Best Contact"
          ) || null;

        const selling =
          meatMarketDescriptionLine(
            listing.description,
            "Selling"
          ) || "Local products available";

        const pricePackage =
          meatMarketDescriptionLine(
            listing.description,
            "Price / Package"
          ) || "Contact seller";

        const fulfillment =
          meatMarketDescriptionLine(
            listing.description,
            "Pickup / Delivery"
          ) || "Pickup";

        const location =
          meatMarketDescriptionLine(
            listing.description,
            "Location"
          ) ||
          String(listing.location || "").trim() ||
          "Okeechobee";

        const sellerLink =
          meatMarketDescriptionLine(
            listing.description,
            "Website / Facebook / Order Link"
          ) || null;

        const listingPhoto =
          meatMarketDescriptionLine(
            listing.description,
            "Listing Photo"
          ) || null;

        const { data: existingSeller } =
          await supabase
            .from("okeechobee_meat_market_sellers")
            .select("id,slug")
            .eq("source_event_id", listing.id)
            .maybeSingle();

        let sellerSlug =
          existingSeller?.slug ||
          meatMarketSlugify(sellerName);

        if (!existingSeller) {
          const { data: slugOwner } =
            await supabase
              .from("okeechobee_meat_market_sellers")
              .select("id,source_event_id")
              .eq("slug", sellerSlug)
              .maybeSingle();

          if (
            slugOwner &&
            slugOwner.source_event_id !== listing.id
          ) {
            sellerSlug =
              sellerSlug +
              "-" +
              String(listing.id)
                .replace(/-/g, "")
                .slice(0, 6);
          }
        }

        const sellerPayload = {
          slug: sellerSlug,
          seller_name: sellerName,
          source_event_id: listing.id,
          location,
          status: "Active",
          verified: true,
          hero_image: listingPhoto,
          website: sellerLink,
          fulfillment,
          updated_at: new Date().toISOString(),
        };

        if (existingSeller?.id) {
          const { error } =
            await supabase
              .from("okeechobee_meat_market_sellers")
              .update(sellerPayload)
              .eq("id", existingSeller.id);

          if (error) {
            throw error;
          }
        } else {
          const { error } =
            await supabase
              .from("okeechobee_meat_market_sellers")
              .insert(sellerPayload);

          if (error) {
            throw error;
          }
        }

        const { data: existingProducts } =
          await supabase
            .from("okeechobee_meat_market_products")
            .select("id")
            .eq("seller_listing_id", sellerSlug)
            .limit(1);

        if (!existingProducts?.length) {
          const { error: productError } =
            await supabase
              .from("okeechobee_meat_market_products")
              .insert({
                seller_listing_id: sellerSlug,
                seller_name: sellerName,
                name: selling,
                category: "Other",
                price: pricePackage,
                package: "",
                fulfillment,
                availability: "Available now",
                description: "",
                image_url: listingPhoto,
                external_order_url: sellerLink,
                featured: true,
                status: "Active",
                sort_order: 0,
              });

          if (productError) {
            throw productError;
          }
        }

        const privateToken =
          randomBytes(32).toString("base64url");

        const manageTokenHash =
          createHash("sha256")
            .update(privateToken)
            .digest("hex");

        const { data: existingAccess } =
          await supabase
            .from("okeechobee_meat_market_seller_access")
            .select("id")
            .eq("seller_listing_id", sellerSlug)
            .maybeSingle();

        const accessPayload = {
          seller_listing_id: sellerSlug,
          seller_name: sellerName,
          seller_email: sellerEmail,
          manage_token_hash: manageTokenHash,
          manage_token_admin: privateToken,
          order_method: sellerLink ? "Website" : "Contact",
          order_destination: sellerLink,
          fulfillment,
          pickup_note: null,
          updated_at: new Date().toISOString(),
        };

        if (existingAccess?.id) {
          const { error } =
            await supabase
              .from("okeechobee_meat_market_seller_access")
              .update(accessPayload)
              .eq("id", existingAccess.id);

          if (error) {
            throw error;
          }
        } else {
          const { error } =
            await supabase
              .from("okeechobee_meat_market_seller_access")
              .insert(accessPayload);

          if (error) {
            throw error;
          }
        }

        const { error: statusError } =
          await supabase
            .from("okeechobee_events")
            .update({ status: "Active" })
            .eq("id", listing.id)
            .eq("type", "Live Meat Market Seller");

        if (statusError) {
          throw statusError;
        }

        const setupPath =
          `/planet/okeechobee/meat-market/seller/setup/${sellerSlug}`;

        const publicPath =
          `/planet/okeechobee/meat-market/seller/${sellerSlug}`;

        const privateSetupUrl =
          `https://www.homeplanet.city${setupPath}#${privateToken}`;

        const publicSellerUrl =
          `https://www.homeplanet.city${publicPath}`;

        const notifications = {
          email: sellerEmail ? "pending" : "skipped",
          sms: sellerPhone ? "pending" : "skipped",
        };

        if (sellerEmail) {
          try {
            await sendHomePlanetEmail({
              recipient: sellerEmail,
              project: "okeechobee-meat-market-seller-access",
              idempotencyKey:
                `okeechobee-meat-market-seller-access-${eventId}-${manageTokenHash.slice(0, 12)}`,
              subject: `Your ${sellerName} Live Meat Market Page Is Ready`,
              html: `<div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;color:#17231b;"><h2>Your Live Meat Market seller page is ready</h2><p>${escapeEmailHtml(sellerName)} has been approved for the Okeechobee Live Meat Market.</p><p>Use your private seller link to update products, prices, availability, photos, pickup or delivery details, and how buyers should contact you.</p><p><a href="${escapeEmailHtml(privateSetupUrl)}" style="display:inline-block;padding:12px 18px;background:#173f2a;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;">Open My Seller Page</a></p><p><strong>Keep this private link somewhere safe because it controls your seller page.</strong></p><p>Public seller page: <a href="${escapeEmailHtml(publicSellerUrl)}">${escapeEmailHtml(publicSellerUrl)}</a></p><p>Thank you for joining the Okeechobee Live Meat Market!</p></div>`,
            });
            notifications.email = "sent";
          } catch (error) {
            notifications.email = "failed";
            console.error("Meat Market seller approval email failed:", error);
          }
        }

        if (sellerPhone) {
          try {
            await sendHomePlanetSms({
              recipientPhone: sellerPhone,
              project: "okeechobee-meat-market-seller-access",
              messageBody:
                `${sellerName} is approved for the Okeechobee Live Meat Market. Your private seller page is ready. Use this link to update your products, photos, prices and availability.`,
              secureLink: privateSetupUrl,
            });
            notifications.sms = "sent";
          } catch (error) {
            notifications.sms = "failed";
            console.error("Meat Market seller approval SMS failed:", error);
          }
        }

        return res.status(200).json({
          ok: true,
          notifications,
          seller: {
            slug: sellerSlug,
            sellerName,
          },
          privateToken,
          setupPath:
            `/planet/okeechobee/meat-market/seller/setup/${sellerSlug}`,
          publicPath:
            `/planet/okeechobee/meat-market/seller/${sellerSlug}`,
        });
      }

      if (action === "reissue_resident_access") {
        const projectSlug = String(
          req.body?.projectSlug || ""
        ).trim();

        if (!projectSlug) {
          return res.status(400).json({
            ok: false,
            error: "Project is required.",
          });
        }

        const { data: owner, error: ownerError } =
          await supabase
            .from("okeechobee_project_owners")
            .select("project_slug,resident_name")
            .eq("project_slug", projectSlug)
            .maybeSingle();

        if (ownerError) {
          console.error(
            "Resident access owner lookup failed:",
            ownerError.message
          );

          return res.status(500).json({
            ok: false,
            error: "Could not load resident access.",
          });
        }

        if (!owner) {
          return res.status(404).json({
            ok: false,
            error:
              "This project does not have a resident ownership record.",
          });
        }

        const rawToken =
          randomBytes(32).toString("base64url");

        const manageTokenHash =
          createHash("sha256")
            .update(rawToken)
            .digest("hex");

        const { error: tokenUpdateError } =
          await supabase
            .from("okeechobee_project_owners")
            .update({
              manage_token_hash: manageTokenHash,
              updated_at: new Date().toISOString(),
            })
            .eq("project_slug", projectSlug);

        if (tokenUpdateError) {
          console.error(
            "Resident access reissue failed:",
            tokenUpdateError.message
          );

          return res.status(500).json({
            ok: false,
            error: "Could not reissue resident access.",
          });
        }

        return res.status(200).json({
          ok: true,
          residentName: owner.resident_name || "Resident",
          privateToken: rawToken,
          managePath:
            `/planet/okeechobee/manage/${projectSlug}`,
        });
      }
      const buyerRequestId = String(
        req.body?.buyerRequestId || ""
      ).trim();

      if (buyerRequestId) {
        const status = String(req.body?.status || "").trim();

        const allowedBuyerStatuses = new Set([
          "buyer_waiting",
          "seller_found",
          "buyer_contacted",
          "complete",
        ]);

        if (!allowedBuyerStatuses.has(status)) {
          return res.status(400).json({
            ok: false,
            error: "A valid buyer request status is required.",
          });
        }

        const matchedSellerListingId =
          String(req.body?.matchedSellerListingId || "").trim() || null;

        const matchedSellerName =
          String(req.body?.matchedSellerName || "").trim() || null;

        let canonicalMatchedSellerSlug = matchedSellerListingId;

        if (matchedSellerListingId) {
          const uuidPattern =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

          let sourceEventId = uuidPattern.test(matchedSellerListingId)
            ? matchedSellerListingId
            : null;

          if (!sourceEventId) {
            const { data: sourceEvent } = await supabase
              .from("okeechobee_events")
              .select("id")
              .eq("slug", matchedSellerListingId)
              .maybeSingle();

            sourceEventId = sourceEvent?.id || null;
          }

          let canonicalSeller: any = null;

          if (sourceEventId) {
            const { data } = await supabase
              .from("okeechobee_meat_market_sellers")
              .select("slug")
              .eq("source_event_id", sourceEventId)
              .maybeSingle();

            canonicalSeller = data;
          }

          if (!canonicalSeller) {
            const { data } = await supabase
              .from("okeechobee_meat_market_sellers")
              .select("slug")
              .eq("slug", matchedSellerListingId)
              .maybeSingle();

            canonicalSeller = data;
          }

          if (canonicalSeller?.slug) {
            canonicalMatchedSellerSlug = canonicalSeller.slug;
          }
        }

        const { data: buyerWorkflow, error: buyerWorkflowError } =
          await supabase
            .from("okeechobee_meat_market_buyer_workflow")
            .upsert(
              {
                buyer_request_id: buyerRequestId,
                status,
                matched_seller_listing_id: canonicalMatchedSellerSlug,
                matched_seller_name: matchedSellerName,
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: "buyer_request_id",
              }
            )
            .select(
              "buyer_request_id,status,matched_seller_listing_id,matched_seller_name,notes,created_at,updated_at"
            )
            .maybeSingle();

        if (buyerWorkflowError) {
          console.error(
            "Meat Market buyer workflow update failed:",
            buyerWorkflowError.message
          );

          return res.status(500).json({
            ok: false,
            error: "Could not update buyer request.",
          });
        }

        return res.status(200).json({
          ok: true,
          buyerWorkflow,
        });
      }

      const helperId = String(req.body?.helperId || "").trim();
      const status = String(req.body?.status || "").trim();

      const allowedStatuses = new Set([
        "new",
        "contacted",
        "confirmed",
        "scheduled",
        "completed",
        "couldnt_help",
      ]);

      if (!helperId || !allowedStatuses.has(status)) {
        return res.status(400).json({
          ok: false,
          error: "A valid helper and status are required.",
        });
      }

      const { data: helper, error: helperUpdateError } =
        await supabase
          .from("okeechobee_project_helpers")
          .update({ status })
          .eq("id", helperId)
          .select(
            "id,event_slug,helper_id,name,phone,email,help_type,notes,created_at,status"
          )
          .maybeSingle();

      if (helperUpdateError) {
        console.error(
          "Command Center helper status update failed:",
          helperUpdateError.message
        );

        return res.status(500).json({
          ok: false,
          error: "Could not update helper status.",
        });
      }

      if (!helper) {
        return res.status(404).json({
          ok: false,
          error: "Helper was not found.",
        });
      }

      return res.status(200).json({
        ok: true,
        helper,
      });
    }

    const [
      eventsResult,
      ownersResult,
      helpersResult,
      meatMarketBuyerResult,
      meatMarketBuyerWorkflowResult,
    ] = await Promise.all([
      supabase
        .from("okeechobee_events")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("okeechobee_project_owners")
        .select(
          "project_slug,resident_name,resident_email,resident_phone,private_notes,approval_email_sent_at,last_notification_at"
        ),

      supabase
        .from("okeechobee_project_helpers")
        .select("event_slug,id,helper_id,name,phone,email,help_type,notes,created_at,status"),

      supabase
        .from("homeplanet_leads")
        .select(
          "id,name,contact,message,business_name,board_slug,selected_operation,created_at"
        )
        .eq("board_slug", "okeechobee-live-meat-market")
        .eq(
          "selected_operation",
          "Okeechobee Live Meat Market Buyer Request"
        )
        .order("created_at", { ascending: false }),

      supabase
        .from("okeechobee_meat_market_buyer_workflow")
        .select(
          "buyer_request_id,status,matched_seller_listing_id,matched_seller_name,notes,created_at,updated_at"
        ),
    ]);

    if (eventsResult.error) {
      console.error(
        "Command Center event load failed:",
        eventsResult.error.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not load projects.",
      });
    }

    if (ownersResult.error) {
      console.error(
        "Command Center owner load failed:",
        ownersResult.error.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not load resident information.",
      });
    }

    if (helpersResult.error) {
      console.error(
        "Command Center helper load failed:",
        helpersResult.error.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not load helper information.",
      });
    }

    if (meatMarketBuyerResult.error) {
      console.error(
        "Command Center Meat Market buyer load failed:",
        meatMarketBuyerResult.error.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not load Meat Market buyer requests.",
      });
    }

    if (meatMarketBuyerWorkflowResult.error) {
      console.error(
        "Command Center Meat Market buyer workflow load failed:",
        meatMarketBuyerWorkflowResult.error.message
      );

      return res.status(500).json({
        ok: false,
        error: "Could not load Meat Market buyer workflow.",
      });
    }

    const buyerWorkflowByRequestId = new Map(
      (meatMarketBuyerWorkflowResult.data || []).map((workflow: any) => [
        workflow.buyer_request_id,
        workflow,
      ])
    );

    const meatMarketBuyers = (meatMarketBuyerResult.data || []).map(
      (buyer: any) => {
        const workflow = buyerWorkflowByRequestId.get(buyer.id) as any;

        return {
          ...buyer,
          workflow_status: workflow?.status || "buyer_waiting",
          matched_seller_listing_id:
            workflow?.matched_seller_listing_id || null,
          matched_seller_name:
            workflow?.matched_seller_name || null,
          workflow_notes:
            workflow?.notes || null,
          workflow_updated_at:
            workflow?.updated_at || null,
        };
      }
    );

    const ownersBySlug = new Map(
      (ownersResult.data || []).map((owner: any) => [
        owner.project_slug,
        owner,
      ])
    );

    const helperCountBySlug = new Map<string, number>();
    const helpersBySlug = new Map<string, any[]>();
    const completedProjectsByHelperId = new Map<string, Set<string>>();

    for (const helper of helpersResult.data || []) {
      const helperId = String((helper as any).helper_id || "");
      const slug = String((helper as any).event_slug || "");

      if (
        helperId &&
        slug &&
        String((helper as any).status || "") === "completed"
      ) {
        const completedProjects =
          completedProjectsByHelperId.get(helperId) || new Set<string>();

        completedProjects.add(slug);
        completedProjectsByHelperId.set(helperId, completedProjects);
      }
    }

    for (const helper of helpersResult.data || []) {
      const slug = String((helper as any).event_slug || "");
      if (!slug) continue;

      const helperId = String((helper as any).helper_id || "");
      const completedHelpCount = helperId
        ? completedProjectsByHelperId.get(helperId)?.size || 0
        : 0;

      const helperWithRecognition = {
        ...helper,
        completed_help_count: completedHelpCount,
        earned_stripes: completedHelpCount >= 3,
        helps_until_stripes: Math.max(0, 3 - completedHelpCount),
      };

      helperCountBySlug.set(
        slug,
        (helperCountBySlug.get(slug) || 0) + 1
      );

      const existingHelpers = helpersBySlug.get(slug) || [];
      existingHelpers.push(helperWithRecognition);
      helpersBySlug.set(slug, existingHelpers);
    }
    const events = (eventsResult.data || []).map((event: any) => {
      const owner = ownersBySlug.get(event.slug) as any;

      return {
        ...event,

        resident_name:
          owner?.resident_name || null,

        resident_email:
          owner?.resident_email || null,

        resident_phone:
          owner?.resident_phone || null,

        private_notes:
          owner?.private_notes || null,

        approval_email_sent_at:
          owner?.approval_email_sent_at || null,

        last_notification_at:
          owner?.last_notification_at || null,

        helper_count:
          helperCountBySlug.get(event.slug) || 0,

        helpers:
          helpersBySlug.get(event.slug) || [],
      };
    });
    const { data: meatMarketSellerAccess, error: sellerAccessError } =
      await supabase
        .from("okeechobee_meat_market_seller_access")
        .select(
          "seller_listing_id,seller_name,seller_email,manage_token_admin"
        );

    if (sellerAccessError) {
      console.error(
        "Meat Market seller access load failed:",
        sellerAccessError.message
      );
    }

    return res.status(200).json({
      ok: true,
      meatMarketSellerAccess: (meatMarketSellerAccess || []).map((access) => ({
        sellerListingId: access.seller_listing_id,
        sellerName: access.seller_name || "",
        sellerEmail: access.seller_email || "",
        privateToken: access.manage_token_admin || "",
        setupPath: `/planet/okeechobee/meat-market/seller/setup/${access.seller_listing_id}`,
        publicPath: `/planet/okeechobee/meat-market/seller/${access.seller_listing_id}`,
      })),
      events,
      meatMarketBuyers,
    });
  } catch (error) {
    console.error("Command Center API error:", error);

    return res.status(500).json({
      ok: false,
      error: "Could not load the Command Center.",
    });
  }
}
