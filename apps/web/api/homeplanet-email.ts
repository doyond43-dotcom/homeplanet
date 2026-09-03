import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  escapeEmailHtml,
  HomePlanetEmailError,
  requiredEmailRecipient,
  sendHomePlanetEmail,
} from "../server/lib/homeplanet-email.js";

type SavedRecord = Record<string, unknown>;

function safeDiagnosticText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/https?:\/\/\S+/gi, "[redacted URL]")
    .replace(/\bBearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/\b(?:re|sbp|sb_secret)_[A-Za-z0-9_-]+\b/g, "[redacted token]")
    .replace(/\b[^\s@]+@[^\s@]+\.[^\s@]+\b/g, "[redacted email]")
    .slice(0, maxLength);
}

function serverConfiguration() {
  const supabaseUrl = String(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ""
  ).trim();
  const serviceRoleKey = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  ).trim();
  if (!supabaseUrl || !serviceRoleKey) {
    throw new HomePlanetEmailError(
      "Email record service is not configured.",
      { httpStatus: 503 }
    );
  }
  return { supabaseUrl, serviceRoleKey };
}

async function loadSavedRecord(
  table: string,
  column: string,
  value: string,
  select: string,
  project: string,
  lookupType: string
) {
  const { supabaseUrl, serviceRoleKey } = serverConfiguration();
  let parsedSupabaseUrl: URL;
  try {
    parsedSupabaseUrl = new URL(supabaseUrl);
    if (parsedSupabaseUrl.protocol !== "https:") {
      throw new Error("Supabase URL must use HTTPS.");
    }
  } catch {
    console.error("HomePlanet email Supabase URL is invalid", {
      project,
      lookupType,
    });
    throw new HomePlanetEmailError(
      "Supabase record service URL is invalid.",
      { httpStatus: 503 }
    );
  }
  const query = new URLSearchParams({
    select,
    [column]: `eq.${value}`,
    limit: "1",
  });
  const lookupUrl = new URL(`/rest/v1/${table}`, parsedSupabaseUrl);
  lookupUrl.search = query.toString();
  let response: Response;
  try {
    response = await fetch(lookupUrl, {
      headers: {
        apikey: serviceRoleKey,
        Accept: "application/json",
        "User-Agent": "HomePlanet-Vercel-Email/1.0",
      },
    });
  } catch (error) {
    const thrown = error instanceof Error ? error : null;
    console.error("HomePlanet email Supabase fetch threw", {
      project,
      lookupType,
      supabaseHostname: parsedSupabaseUrl.hostname,
      exceptionName: safeDiagnosticText(thrown?.name || typeof error, 120),
      exceptionMessage: safeDiagnosticText(thrown?.message || error, 500),
      stackPreview: thrown?.stack
        ? safeDiagnosticText(
            thrown.stack.split("\n").slice(0, 6).join("\n"),
            1200
          )
        : null,
    });
    throw error;
  }
  if (!response.ok) {
    console.error("HomePlanet email saved record lookup failed", {
      table,
      status: response.status,
    });
    throw new HomePlanetEmailError("Saved record could not be loaded.", {
      httpStatus: 500,
    });
  }
  const body = await response.json().catch(() => []);
  const record = Array.isArray(body) ? body[0] : null;
  if (!record || typeof record !== "object") {
    throw new HomePlanetEmailError("Saved record was not found.", {
      httpStatus: 404,
    });
  }
  return record as SavedRecord;
}

function shown(value: unknown) {
  const text = String(value || "").trim();
  return escapeEmailHtml(text || "Not provided");
}

function quoteDetail(notes: unknown, label: string) {
  const prefix = `${label}:`;
  const line = String(notes || "")
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() : "";
}

async function sendMarshall(caseReference: string) {
  const savedCase = await loadSavedRecord(
    "marshall_cases",
    "case_number",
    caseReference,
    "case_number,case_type,client_first_name,client_last_name,client_phone,client_email,incident_date,incident_location,incident_details,injured,treatment,preferred_contact,best_contact_time",
    "marshall-case-review",
    "Marshall case"
  );
  const customerName = [savedCase.client_first_name, savedCase.client_last_name]
    .filter(Boolean)
    .join(" ");
  const result = await sendHomePlanetEmail({
    recipient: requiredEmailRecipient("MARSHALL_ADMIN_EMAIL"),
    project: "marshall-case-review",
    idempotencyKey: `marshall-case-review-${caseReference}`,
    subject: `New Marshall Case Review - ${savedCase.case_number}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
        <h2 style="margin:0 0 18px;">New Case Review</h2>
        <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;margin-bottom:18px;">
          <div style="margin-bottom:8px;"><strong>Customer:</strong> ${shown(customerName)}</div>
          <div style="margin-bottom:8px;"><strong>Phone:</strong> ${shown(savedCase.client_phone)}</div>
          <div style="margin-bottom:8px;"><strong>Email:</strong> ${shown(savedCase.client_email)}</div>
          <div style="margin-bottom:8px;"><strong>Case Type:</strong> ${shown(savedCase.case_type)}</div>
          <div><strong>Case Reference:</strong> ${shown(savedCase.case_number)}</div>
        </div>
        <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;margin-bottom:18px;">
          <div style="margin-bottom:8px;"><strong>Incident Date:</strong> ${shown(savedCase.incident_date)}</div>
          <div style="margin-bottom:8px;"><strong>Incident Location:</strong> ${shown(savedCase.incident_location)}</div>
          <div style="margin-bottom:8px;"><strong>Injured:</strong> ${shown(savedCase.injured)}</div>
          <div style="margin-bottom:8px;"><strong>Treatment:</strong> ${shown(savedCase.treatment)}</div>
          <strong>Incident / Request Details:</strong>
          <div style="margin-top:10px;white-space:pre-wrap;line-height:1.6;">${shown(savedCase.incident_details)}</div>
        </div>
        <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;">
          <div style="margin-bottom:8px;"><strong>Preferred Contact:</strong> ${shown(savedCase.preferred_contact)}</div>
          <div><strong>Best Contact Time:</strong> ${shown(savedCase.best_contact_time)}</div>
        </div>
        <p style="margin-top:22px;"><a href="https://www.homeplanet.city/planet/marshall-rosenbach/board">Open Marshall Live Board</a></p>
      </div>
    `,
  });
  return { ...result, recordReference: String(savedCase.case_number) };
}

async function sendOkeechobeeTogether(slug: string) {
  const savedRequest = await loadSavedRecord(
    "okeechobee_events",
    "slug",
    slug,
    "slug,type,title,description,location,contact,status",
    "okeechobee-together-request",
    "Okeechobee Together request"
  );

  if (savedRequest.type !== "Need" || savedRequest.status !== "Pending Review") {
    throw new HomePlanetEmailError(
      "Saved request is not eligible for this notification.",
      { httpStatus: 400 }
    );
  }

  const savedOwner = await loadSavedRecord(
    "okeechobee_project_owners",
    "project_slug",
    slug,
    "project_slug,resident_name,resident_email,resident_phone,private_notes",
    "okeechobee-together-request",
    "Okeechobee Together project owner"
  );

  const result = await sendHomePlanetEmail({
    recipient: requiredEmailRecipient("OKEECHOBEE_TOGETHER_ADMIN_EMAIL"),
    project: "okeechobee-together-request",
    idempotencyKey: `okeechobee-together-request-${slug}`,
    subject: `NEW Okeechobee Together Request - ${String(savedRequest.title || "Resident Request").trim()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
        <h2 style="margin:0 0 8px;">New Okeechobee Together Request</h2>
        <p style="margin:0 0 20px;color:#666;">A resident request is waiting for review.</p>

        <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;margin-bottom:18px;">
          <div style="margin-bottom:8px;"><strong>Title:</strong> ${shown(savedRequest.title)}</div>
          <div style="margin-bottom:8px;"><strong>Location:</strong> ${shown(savedRequest.location)}</div>
          <div style="margin-bottom:8px;"><strong>Resident:</strong> ${shown(savedOwner.resident_name)}</div>
          <div style="margin-bottom:8px;"><strong>Email:</strong> ${shown(savedOwner.resident_email)}</div>
          <div style="margin-bottom:8px;"><strong>Phone:</strong> ${shown(savedOwner.resident_phone)}</div>
          <div style="margin-bottom:8px;"><strong>Private notes:</strong> ${shown(savedOwner.private_notes)}</div>
          <div><strong>Status:</strong> ${shown(savedRequest.status)}</div>
        </div>

        <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;">
          <strong>Request Details:</strong>
          <div style="margin-top:10px;white-space:pre-wrap;line-height:1.6;">${shown(savedRequest.description)}</div>
        </div>

        <p style="margin-top:22px;">
          <a href="https://okeechobeetogether.org/planet/okeechobee/command">
            Open Okeechobee Together Command Center
          </a>
        </p>
      </div>
    `,
  });

  return {
    ...result,
    recordReference: String(savedRequest.slug),
  };
}
async function sendOnlyTheEssentials(requestId: string) {
  const savedRequest = await loadSavedRecord(
    "cleaning_requests",
    "id",
    requestId,
    "id,business_slug,request_type,customer_name,customer_phone,customer_address,preferred_time,notes",
    "only-the-essentials-request",
    "Only The Essentials request"
  );
  if (
    savedRequest.business_slug !== "only-the-essentials" ||
    savedRequest.request_type !== "quote"
  ) {
    throw new HomePlanetEmailError("Saved request is not eligible for this notification.", {
      httpStatus: 400,
    });
  }
  const notes = String(savedRequest.notes || "");
  const result = await sendHomePlanetEmail({
    recipient: requiredEmailRecipient("ONLY_THE_ESSENTIALS_ADMIN_EMAIL"),
    project: "only-the-essentials-request",
    idempotencyKey: `only-the-essentials-request-${requestId}`,
    subject: `New Only The Essentials Request - ${String(savedRequest.customer_name || "").trim()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
        <h2 style="margin:0 0 18px;">New Cleaning Request</h2>
        <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;margin-bottom:18px;">
          <div style="margin-bottom:8px;"><strong>Name:</strong> ${shown(savedRequest.customer_name)}</div>
          <div style="margin-bottom:8px;"><strong>Phone:</strong> ${shown(savedRequest.customer_phone)}</div>
          <div style="margin-bottom:8px;"><strong>Address:</strong> ${shown(savedRequest.customer_address)}</div>
          <div style="margin-bottom:8px;"><strong>Preferred:</strong> ${shown(savedRequest.preferred_time)}</div>
          <div style="margin-bottom:8px;"><strong>Service:</strong> ${shown(quoteDetail(notes, "Service Type"))}</div>
          <div style="margin-bottom:8px;"><strong>Bedrooms:</strong> ${shown(quoteDetail(notes, "Bedrooms"))}</div>
          <div style="margin-bottom:8px;"><strong>Bathrooms:</strong> ${shown(quoteDetail(notes, "Bathrooms"))}</div>
          <div style="margin-bottom:8px;"><strong>Pets:</strong> ${shown(quoteDetail(notes, "Pets"))}</div>
          <div><strong>Condition:</strong> ${shown(quoteDetail(notes, "Condition"))}</div>
        </div>
        <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;">
          <strong>Notes:</strong>
          <div style="margin-top:10px;white-space:pre-wrap;line-height:1.6;">${shown(notes || "No extra notes added.")}</div>
        </div>
        <p style="margin-top:20px;color:#666;">Sent from the HomePlanet Only The Essentials live page.</p>
      </div>
    `,
  });
  return { ...result, recordReference: String(savedRequest.id) };
}

async function sendHomePlanetContact(requestId: string) {
  const savedLead = await loadSavedRecord(
    "homeplanet_leads",
    "id",
    requestId,
    "id,name,contact,message,selected_operation,business_name,board_slug,created_at",
    "homeplanet-contact",
    "HomePlanet contact question"
  );

  const isMeatMarket =
    savedLead.board_slug === "okeechobee-live-meat-market";

  const isHomePlanetContact =
    savedLead.board_slug === "homeplanet-contact";

  const isOkeeDokeySoftwash =
    savedLead.board_slug === "okee-dokey-softwash" &&
    savedLead.selected_operation === "Okee Dokey Softwash Estimate";

  if (!isHomePlanetContact && !isMeatMarket && !isOkeeDokeySoftwash) {
    throw new HomePlanetEmailError(
      "Saved lead is not eligible for this notification.",
      { httpStatus: 400 }
    );
  }

  const result = await sendHomePlanetEmail({
    recipient: requiredEmailRecipient(
      isMeatMarket ? "MARKET_NOTIFY_EMAIL" : "HOMEPLANET_ADMIN_EMAIL"
    ),
    project: isMeatMarket
      ? "okeechobee-meat-market-contact"
      : isOkeeDokeySoftwash
        ? "okee-dokey-softwash-estimate"
        : "homeplanet-contact",
    idempotencyKey: `${
      isMeatMarket
        ? "okeechobee-meat-market-contact"
        : isOkeeDokeySoftwash
          ? "okee-dokey-softwash-estimate"
          : "homeplanet-contact"
    }-${requestId}`,
    subject: isMeatMarket
      ? `New Live Meat Market ${String(savedLead.selected_operation || "").includes("Buyer Request") ? "Buyer Request" : "Question"} - ${String(savedLead.name || "Local Visitor").trim()}`
      : isOkeeDokeySoftwash
        ? `New Okee Dokey Softwash Estimate - ${String(savedLead.name || "Local Customer").trim()}`
        : `New HomePlanet Question - ${String(savedLead.name || "Website Visitor").trim()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;">
        <h2 style="margin:0 0 8px;">${isOkeeDokeySoftwash ? "New Okee Dokey Softwash Estimate" : isMeatMarket ? "New Live Meat Market Message" : "New HomePlanet Question"}</h2>

        <p style="margin:0 0 20px;color:#666;">
          ${isOkeeDokeySoftwash ? "A customer requested an exterior cleaning estimate." : isMeatMarket ? "Someone contacted the Okeechobee Live Meat Market." : "Someone used the HomePlanet contact page."}
        </p>

        <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;margin-bottom:18px;">
          <div style="margin-bottom:8px;">
            <strong>Name:</strong> ${shown(savedLead.name)}
          </div>

          <div style="margin-bottom:8px;">
            <strong>Email / Phone:</strong> ${shown(savedLead.contact)}
          </div>

          <div style="margin-bottom:8px;">
            <strong>Business / Organization:</strong> ${shown(savedLead.business_name)}
          </div>

          <div>
            <strong>Submitted:</strong> ${shown(savedLead.created_at)}
          </div>
        </div>

        <div style="padding:16px;border:1px solid #d9d9d9;border-radius:12px;">
          <strong>${isOkeeDokeySoftwash ? "Estimate Details:" : "Question:"}</strong>

          <div style="margin-top:10px;white-space:pre-wrap;line-height:1.6;">
            ${shown(savedLead.message)}
          </div>
        </div>

        <p style="margin-top:20px;color:#666;">
          Saved in HomePlanet as ${shown(savedLead.id)}.
        </p>
      </div>
    `,
    text: [
      isOkeeDokeySoftwash ? "New Okee Dokey Softwash Estimate" : isMeatMarket ? "New Live Meat Market Message" : "New HomePlanet Question",
      "",
      `Name: ${String(savedLead.name || "Not provided")}`,
      `Email / Phone: ${String(savedLead.contact || "Not provided")}`,
      `Business / Organization: ${String(savedLead.business_name || "Not provided")}`,
      "",
      isOkeeDokeySoftwash ? "Estimate Details:" : "Question:",
      String(savedLead.message || "Not provided"),
      "",
      `Lead ID: ${requestId}`,
    ].join("\n"),
  });

  return {
    ...result,
    recordReference: requestId,
  };
}

async function sendOkeechobeeMeatMarketOrder(requestId: string) {
  const savedLead = await loadSavedRecord(
    "homeplanet_leads",
    "id",
    requestId,
    "id,name,contact,message,selected_operation,business_name,board_slug,created_at",
    "okeechobee-meat-market-order",
    "Okeechobee Live Meat Market order"
  );

  if (
    savedLead.board_slug !== "okeechobee-live-meat-market" ||
    savedLead.selected_operation !== "Okeechobee Live Meat Market Order"
  ) {
    throw new HomePlanetEmailError(
      "Saved order is not eligible for seller delivery.",
      { httpStatus: 400 }
    );
  }

  const orderMessage = String(savedLead.message || "");

  const listingId = quoteDetail(orderMessage, "Listing ID");
  const item = quoteDetail(orderMessage, "Item");
  const price = quoteDetail(orderMessage, "Price shown");
  const quantity = quoteDetail(orderMessage, "Quantity / Amount");
  const fulfillment = quoteDetail(orderMessage, "Pickup / Delivery");

  if (!listingId || listingId === "Not provided") {
    throw new HomePlanetEmailError(
      "Seller listing could not be identified.",
      { httpStatus: 400 }
    );
  }

  const savedListing = await loadSavedRecord(
    "okeechobee_events",
    "id",
    listingId,
    "id,type,title,description,location,contact,status",
    "okeechobee-meat-market-order",
    "Okeechobee Live Meat Market seller"
  );

  if (
    savedListing.type !== "Live Meat Market Seller" ||
    savedListing.status !== "Active"
  ) {
    throw new HomePlanetEmailError(
      "Seller listing is not currently active.",
      { httpStatus: 400 }
    );
  }

  const description = String(savedListing.description || "");

  const descriptionEmail = quoteDetail(description, "Email").trim();
  const legacyContact = String(savedListing.contact || "").trim();

  const sellerEmail =
    descriptionEmail && descriptionEmail.toLowerCase() !== "not provided"
      ? descriptionEmail
      : legacyContact.includes("@")
        ? legacyContact
        : "";

  if (
    !sellerEmail ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sellerEmail)
  ) {
    throw new HomePlanetEmailError(
      "Seller email is missing or invalid.",
      { httpStatus: 400 }
    );
  }

  const sellerName =
    String(savedListing.title || "")
      .replace(/^Live Meat Market Seller:\s*/i, "")
      .trim() ||
    String(savedLead.business_name || "").trim() ||
    "Local Seller";

  const buyerName =
    String(savedLead.name || "").trim() || "Local Buyer";

  const buyerPhone =
    String(savedLead.contact || "").trim() || "Not provided";

  const result = await sendHomePlanetEmail({
    recipient: sellerEmail,
    project: "okeechobee-meat-market-order",
    idempotencyKey: `okeechobee-meat-market-order-${requestId}`,
    subject: `New Live Meat Market Order - ${item || "Market Order"}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;color:#17231b;">
        <h2 style="margin:0 0 8px;">New Live Meat Market Order</h2>

        <p style="margin:0 0 20px;color:#666;">
          A buyer placed an order through the Okeechobee Live Meat Market.
        </p>

        <div style="padding:18px;border:1px solid #d9d9d9;border-radius:12px;margin-bottom:18px;">
          <div style="margin-bottom:10px;"><strong>Seller:</strong> ${shown(sellerName)}</div>
          <div style="margin-bottom:10px;"><strong>Item:</strong> ${shown(item)}</div>
          <div style="margin-bottom:10px;"><strong>Price shown:</strong> ${shown(price)}</div>
          <div style="margin-bottom:10px;"><strong>Quantity / Amount:</strong> ${shown(quantity)}</div>
          <div><strong>Pickup / Delivery:</strong> ${shown(fulfillment)}</div>
        </div>

        <div style="padding:18px;border:1px solid #d9d9d9;border-radius:12px;">
          <div style="margin-bottom:10px;"><strong>Buyer:</strong> ${shown(buyerName)}</div>
          <div><strong>Phone:</strong> ${shown(buyerPhone)}</div>
        </div>

        <p style="margin-top:20px;color:#666;">
          Please contact the buyer directly to confirm availability and pickup or delivery details.
        </p>
      </div>
    `,
    text: [
      "New Okeechobee Live Meat Market Order",
      "",
      `Seller: ${sellerName}`,
      `Item: ${item || "Not provided"}`,
      `Price shown: ${price || "Not provided"}`,
      `Quantity / Amount: ${quantity || "Not provided"}`,
      `Pickup / Delivery: ${fulfillment || "Not provided"}`,
      "",
      `Buyer: ${buyerName}`,
      `Phone: ${buyerPhone}`,
      "",
      `Order ID: ${requestId}`,
    ].join("\n"),
  });

  return {
    ...result,
    recordReference: requestId,
  };
}
async function sendOkeechobeeMeatMarket(slug: string) {
  const savedListing = await loadSavedRecord(
    "okeechobee_events",
    "slug",
    slug,
    "slug,type,title,description,location,contact,status",
    "okeechobee-meat-market-seller",
    "Okeechobee Live Meat Market seller"
  );

  if (
    savedListing.type !== "Live Meat Market Seller" ||
    savedListing.status !== "Pending Review"
  ) {
    throw new HomePlanetEmailError(
      "Saved Meat Market listing is not eligible for this notification.",
      { httpStatus: 400 }
    );
  }

  const sellerName = String(savedListing.title || "")
    .replace(/^Live Meat Market Seller:\s*/i, "")
    .trim();

  const descriptionLines = String(savedListing.description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  function detail(label: string) {
    const prefix = `${label}:`;
    const line = descriptionLines.find((item) =>
      item.toLowerCase().startsWith(prefix.toLowerCase())
    );

    return line ? line.slice(prefix.length).trim() : "";
  }

  const contactName = detail("Contact Name");
  const bestContact = detail("Best Contact") || String(savedListing.contact || "");
  const selling = detail("Selling");
  const pricePackage = detail("Price / Package");
  const fulfillment = detail("Pickup / Delivery");
  const location = detail("Location") || String(savedListing.location || "");
  const sellerLink = detail("Website / Facebook / Order Link");
  const notes = detail("Notes");

  const result = await sendHomePlanetEmail({
    recipient: requiredEmailRecipient("MARKET_NOTIFY_EMAIL"),
    project: "okeechobee-meat-market-seller",
    idempotencyKey: `okeechobee-meat-market-seller-${slug}`,
    subject: `New Live Meat Market Seller - ${sellerName || "Seller Submission"}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;color:#17231b;">
        <h2 style="margin:0 0 8px;">New Okeechobee Live Meat Market Seller</h2>

        <p style="margin:0 0 20px;color:#666;">
          A local seller submitted information and is waiting for review.
        </p>

        <div style="padding:18px;border:1px solid #d9d9d9;border-radius:12px;">
          <div style="margin-bottom:10px;"><strong>Ranch / Business:</strong> ${shown(sellerName)}</div>
          <div style="margin-bottom:10px;"><strong>Contact Name:</strong> ${shown(contactName)}</div>
          <div style="margin-bottom:10px;"><strong>Best Contact:</strong> ${shown(bestContact)}</div>
          <div style="margin-bottom:10px;"><strong>Selling:</strong> ${shown(selling)}</div>
          <div style="margin-bottom:10px;"><strong>Price / Package:</strong> ${shown(pricePackage)}</div>
          <div style="margin-bottom:10px;"><strong>Pickup / Delivery:</strong> ${shown(fulfillment)}</div>
          <div style="margin-bottom:10px;"><strong>Location:</strong> ${shown(location)}</div>
          <div style="margin-bottom:10px;"><strong>Website / Facebook / Order Link:</strong> ${shown(sellerLink || "Not provided")}</div>
          <div style="margin-bottom:10px;"><strong>Notes:</strong> ${shown(notes || "None")}</div>
          <div><strong>Status:</strong> ${shown(savedListing.status)}</div>
        </div>
      </div>
    `,
    text: [
      "New Okeechobee Live Meat Market Seller",
      "",
      `Ranch / Business: ${sellerName}`,
      `Contact Name: ${contactName}`,
      `Best Contact: ${bestContact}`,
      `Selling: ${selling}`,
      `Price / Package: ${pricePackage}`,
      `Pickup / Delivery: ${fulfillment}`,
      `Location: ${location}`,
      `Website / Facebook / Order Link: ${sellerLink || "Not provided"}`,
      `Notes: ${notes || "None"}`,
      `Status: ${String(savedListing.status || "")}`,
      "",
      `Listing slug: ${slug}`,
    ].join("\n"),
  });

  return {
    ...result,
    recordReference: slug,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const project = String(body.project || "").trim();
    const allowedKeys = project === "marshall-case-review"
      ? ["project", "caseReference"]
      : project === "okeechobee-together-request" ||
          project === "okeechobee-meat-market-seller"
        ? ["project", "slug"]
        : ["project", "requestId"];
    if (Object.keys(body).some((key) => !allowedKeys.includes(key))) {
      return res.status(400).json({ ok: false, error: "Unexpected request fields." });
    }

    let result;
    if (project === "marshall-case-review") {
      const caseReference = String(body.caseReference || "").trim();
      if (!/^MR-\d{4}-[A-F0-9]{8}$/.test(caseReference)) {
        return res.status(400).json({ ok: false, error: "Invalid case reference." });
      }
      result = await sendMarshall(caseReference);
    } else if (project === "only-the-essentials-request") {
      const requestId = String(body.requestId || "").trim();
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
        return res.status(400).json({ ok: false, error: "Invalid request ID." });
      }
      result = await sendOnlyTheEssentials(requestId);
    } else if (project === "okeechobee-together-request") {
      const slug = String(body.slug || "").trim();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return res.status(400).json({ ok: false, error: "Invalid Okeechobee request slug." });
      }
      result = await sendOkeechobeeTogether(slug);
    } else if (project === "okeechobee-meat-market-seller") {
      const slug = String(body.slug || "").trim();

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return res.status(400).json({
          ok: false,
          error: "Invalid Meat Market seller slug.",
        });
      }

      result = await sendOkeechobeeMeatMarket(slug);
    } else if (project === "okeechobee-meat-market-order") {
      const requestId = String(body.requestId || "").trim();

      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          requestId
        )
      ) {
        return res.status(400).json({
          ok: false,
          error: "Invalid Meat Market order ID.",
        });
      }

      result = await sendOkeechobeeMeatMarketOrder(requestId);
    } else if (project === "homeplanet-contact") {
      const requestId = String(body.requestId || "").trim();

      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          requestId
        )
      ) {
        return res.status(400).json({
          ok: false,
          error: "Invalid HomePlanet contact request ID.",
        });
      }

      result = await sendHomePlanetContact(requestId);
    } else {
      return res.status(400).json({ ok: false, error: "Unknown email project." });
    }

    return res.status(200).json({
      ok: true,
      accepted: result.accepted,
      provider: result.provider,
      providerStatus: result.providerStatus,
      messageId: result.messageId,
      recordReference: result.recordReference,
    });
  } catch (error) {
    const known = error instanceof HomePlanetEmailError;
    console.error("HomePlanet email API failed", {
      provider: known ? error.provider : "resend",
      providerStatus: known ? error.providerStatus || null : null,
      providerCode: known ? error.providerCode || null : null,
    });
    return res.status(known ? error.httpStatus : 500).json({
      ok: false,
      accepted: false,
      error: known ? error.message : "Email notification failed.",
      ...(known ? {
        provider: error.provider,
        providerStatus: error.providerStatus || null,
        providerCode: error.providerCode || null,
      } : {}),
    });
  }
}


