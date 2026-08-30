import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const SELLER_TYPE = "Live Meat Market Seller";
const QUESTION_BOARD = "okeechobee-live-meat-market";

type ViewMode = "sellers" | "buyers";
type FilterMode = "all" | "pending" | "live" | "paused" | "archived";

function sellerName(listing: any) {
  return (
    String(listing.title || "")
      .replace(/^Live Meat Market Seller:\s*/i, "")
      .trim() || "Local Seller"
  );
}

function descriptionLine(description: string, label: string) {
  const lines = String(description || "").split(/\r?\n/);
  const prefix = `${label}:`;

  const line = lines.find((item) =>
    item.trim().toLowerCase().startsWith(prefix.toLowerCase())
  );

  if (!line) return "";

  return line.slice(line.indexOf(":") + 1).trim();
}

function statusKey(status: string): FilterMode {
  const value = String(status || "").toLowerCase();

  if (value === "pending review") return "pending";
  if (value === "active") return "live";
  if (value === "paused") return "paused";
  if (value === "archived") return "archived";

  return "all";
}

function isVerifiedSeller(listing: any) {
  return (
    descriptionLine(listing?.description, "Verification")
      .toLowerCase() === "verified local seller"
  );
}

function visibleListingDescription(listing: any) {
  return String(listing?.description || "")
    .split(/\r?\n/)
    .filter(
      (line) =>
        !line.trim().toLowerCase().startsWith("verification:")
    )
    .join("\n");
}

const MARKET_MATCH_TERMS: Record<string, string[]> = {
  Beef: [
    "beef",
    "steak",
    "steaks",
    "ribeye",
    "sirloin",
    "filet",
    "roast",
    "ground beef",
    "hamburger",
    "quarter beef",
    "half beef",
    "whole beef",
    "beef share",
    "beef shares",
  ],
  Chicken: [
    "chicken",
    "whole chicken",
    "whole chickens",
    "chicken breast",
    "chicken breasts",
    "thigh",
    "thighs",
    "wing",
    "wings",
    "poultry",
  ],
  Pork: [
    "pork",
    "bacon",
    "sausage",
    "ham",
    "pork chop",
    "pork chops",
  ],
  Eggs: [
    "egg",
    "eggs",
    "dozen",
  ],
  Dairy: [
    "dairy",
    "milk",
    "raw milk",
    "kefir",
    "cream",
    "cheese",
  ],
  Honey: [
    "honey",
  ],
};

function matchingCategories(text: string) {
  const value = String(text || "").toLowerCase();

  return Object.entries(MARKET_MATCH_TERMS)
    .filter(([, terms]) =>
      terms.some((term) => value.includes(term))
    )
    .map(([category]) => category);
}

function sellerStorefrontHref(listing: any) {
  const name = sellerName(listing);

  if (name.toLowerCase() === "farm folks llc") {
    return "/planet/okeechobee/meat-market/seller/farm-folks";
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `/planet/okeechobee/meat-market/seller/${slug}`;
}

function contactHref(contact: string) {
  const value = String(contact || "").trim();

  if (!value) return "#";
  if (value.includes("@")) return `mailto:${value}`;

  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

function buyerStatusLabel(status: string) {
  if (status === "seller_found") return "Seller Found";
  if (status === "buyer_contacted") return "Buyer Contacted";
  if (status === "complete") return "Complete";
  return "Buyer Waiting";
}

function buyerRequestTitle(message: string) {
  const value = String(message || "").trim();

  const match = value.match(/Looking for:\s*(.+?)(?:\r?\n|Pickup \/ Delivery:|$)/i);

  if (match?.[1]?.trim()) {
    return match[1].trim();
  }

  return value || "Local food request";
}

export default function OkeechobeeMeatMarketCommandCenter() {
  const [listings, setListings] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const [view, setView] = useState<ViewMode>("sellers");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");

  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);

  const [editingListing, setEditingListing] = useState(false);

  const [editFields, setEditFields] = useState({
    businessName: "",
    contactName: "",
    contact: "",
    email: "",
    selling: "",
    pricePackage: "",
    fulfillment: "",
    location: "",
    sellerLink: "",
    notes: "",
  });

  async function loadMarket() {
    setLoading(true);
    setNotice("");

    const listingResult = await supabase
      .from("okeechobee_events")
      .select("*")
      .eq("type", SELLER_TYPE)
      .order("created_at", { ascending: false });

    if (listingResult.error) {
      console.error(listingResult.error);
      setNotice("Could not load Meat Market listings.");
    }

    let secureQuestions: any[] = [];

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Admin session not available.");
      }

      const response = await fetch("/api/okeechobee-command-center", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.error || "Could not load Meat Market buyer requests."
        );
      }

      secureQuestions = Array.isArray(result.meatMarketBuyers)
        ? result.meatMarketBuyers
        : [];
    } catch (error) {
      console.error("Secure Meat Market buyer load failed:", error);

      setNotice((current) =>
        current
          ? `${current} Could not load Meat Market buyer requests.`
          : "Could not load Meat Market buyer requests."
      );
    }

    setListings(listingResult.data || []);
    setQuestions(secureQuestions);
    setLoading(false);
  }

  useEffect(() => {
    loadMarket();
  }, []);

  const counts = useMemo(() => {
    return {
      pending: listings.filter((item) => statusKey(item.status) === "pending").length,
      live: listings.filter((item) => statusKey(item.status) === "live").length,
      paused: listings.filter((item) => statusKey(item.status) === "paused").length,
      archived: listings.filter((item) => statusKey(item.status) === "archived").length,
      verified: listings.filter((item) => isVerifiedSeller(item)).length,
    };
  }, [listings]);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesFilter =
        filter === "all" || statusKey(listing.status) === filter;

      if (!matchesFilter) return false;
      if (!query) return true;

      const haystack = [
        sellerName(listing),
        listing.location,
        listing.contact,
        listing.description,
        listing.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [listings, filter, search]);

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return questions;

    return questions.filter((question) => {
      const haystack = [
        question.name,
        question.contact,
        question.business_name,
        question.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [questions, search]);

  const selectedQuestionMatches = useMemo(() => {
    if (!selectedQuestion) return [];

    const requestedCategories = matchingCategories(
      String(selectedQuestion.message || "")
    );

    if (requestedCategories.length === 0) return [];

    return listings
      .filter(
        (listing) =>
          statusKey(listing.status) === "live" &&
          isVerifiedSeller(listing)
      )
      .map((listing) => {
        const sellerText = [
          descriptionLine(listing.description, "Selling"),
          listing.description,
        ]
          .filter(Boolean)
          .join(" ");

        const sellerCategories = matchingCategories(sellerText);

        const matches = requestedCategories.filter((category) =>
          sellerCategories.includes(category)
        );

        return {
          listing,
          matches,
          fulfillment:
            descriptionLine(
              listing.description,
              "Pickup / Delivery"
            ) || "Contact seller",
        };
      })
      .filter((match) => match.matches.length > 0);
  }, [selectedQuestion, listings]);

  async function updateBuyerWorkflow(
    question: any,
    status: string,
    matchedSeller?: any
  ) {
    if (!question?.id) return;

    setWorkingId(question.id);
    setNotice("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Admin session not available.");
      }

      const response = await fetch("/api/okeechobee-command-center", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buyerRequestId: question.id,
          status,
          matchedSellerListingId:
            matchedSeller?.id ||
            matchedSeller?.slug ||
            question.matched_seller_listing_id ||
            "",
          matchedSellerName:
            matchedSeller
              ? sellerName(matchedSeller)
              : question.matched_seller_name || "",
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.error || "Could not update buyer request."
        );
      }

      const workflow = result.buyerWorkflow || {};

      const updated = {
        ...question,
        workflow_status: workflow.status || status,
        matched_seller_listing_id:
          workflow.matched_seller_listing_id || null,
        matched_seller_name:
          workflow.matched_seller_name || null,
        workflow_notes:
          workflow.notes || null,
        workflow_updated_at:
          workflow.updated_at || new Date().toISOString(),
      };

      setQuestions((current) =>
        current.map((item) =>
          item.id === question.id ? updated : item
        )
      );

      setSelectedQuestion(updated);

      setNotice(
        `"${question.name || "Buyer"}" is now ${buyerStatusLabel(
          updated.workflow_status
        )}.`
      );
    } catch (error) {
      console.error("Buyer workflow update failed:", error);
      setNotice("Could not update the buyer request.");
    } finally {
      setWorkingId(null);
    }
  }

  async function changeListingStatus(listing: any, status: string) {
    setWorkingId(listing.id);
    setNotice("");

    const { error } = await supabase
      .from("okeechobee_events")
      .update({ status })
      .eq("id", listing.id)
      .eq("type", SELLER_TYPE);

    if (error) {
      console.error(error);
      setNotice("Could not update the listing.");
      setWorkingId(null);
      return;
    }

    const updated = { ...listing, status };

    setListings((current) =>
      current.map((item) =>
        item.id === listing.id ? updated : item
      )
    );

    setSelectedListing((current: any) =>
      current?.id === listing.id ? updated : current
    );

    const label =
      status === "Active"
        ? "live"
        : status === "Paused"
          ? "paused / sold out"
          : status === "Archived"
            ? "archived"
            : "pending review";

    setNotice(`"${sellerName(listing)}" is now ${label}.`);
    setWorkingId(null);
  }

  async function markListingVerified(listing: any) {
    setWorkingId(listing.id);
    setNotice("");

    const currentDescription = String(listing.description || "");
    const lines = currentDescription
      .split(/\r?\n/)
      .filter(
        (line) =>
          !line.trim().toLowerCase().startsWith("verification:")
      );

    const description = [
      ...lines,
      "Verification: Verified Local Seller",
    ].join("\n");

    const { error } = await supabase
      .from("okeechobee_events")
      .update({ description })
      .eq("id", listing.id)
      .eq("type", SELLER_TYPE);

    if (error) {
      console.error(error);
      setNotice("Could not verify the seller.");
      setWorkingId(null);
      return;
    }

    const updated = { ...listing, description };

    setListings((current) =>
      current.map((item) =>
        item.id === listing.id ? updated : item
      )
    );

    setSelectedListing((current: any) =>
      current?.id === listing.id ? updated : current
    );

    setNotice(`"${sellerName(listing)}" is now a Verified Local Seller.`);
    setWorkingId(null);
  }

  function startEditingListing(listing: any) {
    const description = String(listing.description || "");

    setEditFields({
      businessName:
        descriptionLine(description, "Ranch / Business") ||
        sellerName(listing),
      contactName:
        descriptionLine(description, "Contact Name") ||
        "Not provided",
      contact:
        descriptionLine(description, "Best Contact") ||
        String(listing.contact || ""),
      email:
        descriptionLine(description, "Email"),
      selling:
        descriptionLine(description, "Selling"),
      pricePackage:
        descriptionLine(description, "Price / Package"),
      fulfillment:
        descriptionLine(description, "Pickup / Delivery"),
      location:
        descriptionLine(description, "Location") ||
        String(listing.location || "Okeechobee"),
      sellerLink:
        descriptionLine(
          description,
          "Website / Facebook / Order Link"
        ),
      notes:
        descriptionLine(description, "Notes"),
    });

    setEditingListing(true);
  }

  async function saveListingChanges() {
    if (!selectedListing) return;

    const businessName =
      editFields.businessName.trim() || "Local Seller";

    const contactName =
      editFields.contactName.trim() || "Not provided";

    const contact =
      editFields.contact.trim() || "Not provided";

    const email =
      editFields.email.trim() || "Not provided";

    const selling =
      editFields.selling.trim() || "Local products available";

    const pricePackage =
      editFields.pricePackage.trim() || "Contact for pricing";

    const fulfillment =
      editFields.fulfillment.trim() || "Contact seller";

    const location =
      editFields.location.trim() || "Okeechobee";

    const sellerLink =
      editFields.sellerLink.trim() || "Not provided";

    const notes =
      editFields.notes.trim() || "None";

    const description = [
      `Ranch / Business: ${businessName}`,
      `Contact Name: ${contactName}`,
      `Best Contact: ${contact}`,
      `Email: ${email}`,
      `Selling: ${selling}`,
      `Price / Package: ${pricePackage}`,
      `Pickup / Delivery: ${fulfillment}`,
      `Location: ${location}`,
      `Website / Facebook / Order Link: ${sellerLink}`,
      `Notes: ${notes}`,
      ...(isVerifiedSeller(selectedListing)
        ? ["Verification: Verified Local Seller"]
        : []),
    ].join("\n");

    const title = `Live Meat Market Seller: ${businessName}`;

    setWorkingId(selectedListing.id);
    setNotice("");

    const { error } = await supabase
      .from("okeechobee_events")
      .update({
        title,
        description,
        location,
        contact,
      })
      .eq("id", selectedListing.id)
      .eq("type", SELLER_TYPE);

    if (error) {
      console.error(error);
      setNotice("Could not save the listing changes.");
      setWorkingId(null);
      return;
    }

    const updated = {
      ...selectedListing,
      title,
      description,
      location,
      contact,
    };

    setListings((current) =>
      current.map((item) =>
        item.id === selectedListing.id ? updated : item
      )
    );

    setSelectedListing(updated);
    setEditingListing(false);
    setWorkingId(null);

    setNotice(`"${businessName}" listing changes saved.`);
  }

  function closeDrawer() {
    setSelectedListing(null);
    setSelectedQuestion(null);
    setEditingListing(false);
  }

  return (
    <main style={page}>
      <div style={shell}>
        <header style={header}>
          <div>
            <Link to="/planet/okeechobee/command" style={backLink}>
              Okeechobee Operations Center
            </Link>

            <div style={eyebrow}>Okeechobee Live Meat Market</div>
            <h1 style={pageTitle}>Market Command Center</h1>

            <p style={subtitle}>
              Run seller listings and buyer demand without turning the market
              into one giant feed.
            </p>
          </div>

          <a
            href="/planet/okeechobee/meat-market"
            target="_blank"
            rel="noreferrer"
            style={marketButton}
          >
            Open Public Market
          </a>
        </header>

        {notice ? <div style={noticeStyle}>{notice}</div> : null}

        <section style={stats}>
          <div style={stat}><span>Buyer Requests</span><strong>{questions.length}</strong></div>
          <div style={stat}><span>Pending</span><strong>{counts.pending}</strong></div>
          <div style={stat}><span>Live</span><strong>{counts.live}</strong></div>
          <div style={stat}><span>Verified</span><strong>{counts.verified}</strong></div>
          <div style={stat}><span>Paused / Sold Out</span><strong>{counts.paused}</strong></div>
          <div style={stat}><span>Total Listings</span><strong>{listings.length}</strong></div>
        </section>

        <section style={toolbar}>
          <div style={viewTabs}>
            <button
              type="button"
              style={view === "sellers" ? activeTab : tab}
              onClick={() => setView("sellers")}
            >
              Seller Listings <span style={tabCount}>{listings.length}</span>
            </button>

            <button
              type="button"
              style={view === "buyers" ? activeTab : tab}
              onClick={() => setView("buyers")}
            >
              Buyer Requests <span style={tabCount}>{questions.length}</span>
            </button>
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              view === "sellers"
                ? "Search seller, product, phone, location..."
                : "Search buyer request..."
            }
            style={searchInput}
          />
        </section>

        {view === "sellers" ? (
          <>
            <div style={filters}>
              {(
                [
                  ["all", "All", listings.length],
                  ["pending", "Pending", counts.pending],
                  ["live", "Live", counts.live],
                  ["paused", "Sold Out", counts.paused],
                  ["archived", "Archived", counts.archived],
                ] as [FilterMode, string, number][]
              ).map(([key, label, total]) => (
                <button
                  key={key}
                  type="button"
                  style={filter === key ? activeFilter : filterButton}
                  onClick={() => setFilter(key)}
                >
                  {label} {total}
                </button>
              ))}
            </div>

            <section style={listPanel}>
              <div style={listHeader}>
                <div>
                  <div style={eyebrow}>Seller Inventory</div>
                  <h2 style={sectionTitle}>Listings</h2>
                </div>
                <div style={resultCount}>{filteredListings.length} shown</div>
              </div>

              {loading ? (
                <div style={empty}>Loading listings...</div>
              ) : filteredListings.length === 0 ? (
                <div style={empty}>No listings match this view.</div>
              ) : (
                <div style={rows}>
                  {filteredListings.map((listing) => {
                    const selling =
                      descriptionLine(listing.description, "Selling") ||
                      "Product not specified";

                    const price =
                      descriptionLine(listing.description, "Price / Package") ||
                      "Price not listed";

                    return (
                      <button
                        type="button"
                        key={listing.id}
                        style={row}
                        onClick={() => setSelectedListing(listing)}
                      >
                        <div style={rowMain}>
                          <strong style={rowTitle}>{sellerName(listing)}</strong>
                          <span style={rowProduct}>{selling}</span>
                        </div>

                        <div style={rowMeta}>
                          <span>{listing.location || "Okeechobee area"}</span>
                          <span>{price}</span>
                        </div>

                        <div style={rowRight}>
                          {isVerifiedSeller(listing) ? (
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 800,
                                color: "#17653a",
                              }}
                            >
                              ✓ VERIFIED
                            </span>
                          ) : null}

                          <span style={statusBadge}>
                            {listing.status || "Pending Review"}
                          </span>
                          <span style={openText}>Open</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        ) : (
          <section style={listPanel}>
            <div style={listHeader}>
              <div>
                <div style={eyebrow}>Buyer Demand</div>
                <h2 style={sectionTitle}>Buyer Requests</h2>
              </div>
              <div style={resultCount}>{filteredQuestions.length} shown</div>
            </div>

            {loading ? (
              <div style={empty}>Loading buyer requests...</div>
            ) : filteredQuestions.length === 0 ? (
              <div style={empty}>No buyer requests yet.</div>
            ) : (
              <div style={rows}>
                {filteredQuestions.map((question) => (
                  <button
                    type="button"
                    key={question.id}
                    style={row}
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <div style={rowMain}>
                      <strong
                        style={{
                          ...rowTitle,
                          textTransform: "uppercase",
                        }}
                      >
                        {buyerRequestTitle(question.message)}
                      </strong>

                      <span style={rowProduct}>
                        {question.name || "Local Buyer"}
                      </span>
                    </div>

                    <div style={rowMeta}>
                      <span>{question.contact || "No contact provided"}</span>
                    </div>

                    <div style={rowRight}>
                      <span style={buyerBadge}>Buyer</span>
                      <span style={openText}>
                        {buyerStatusLabel(
                          question.workflow_status || "buyer_waiting"
                        )}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {selectedListing ? (
        <div style={overlay} onClick={closeDrawer}>
          <aside style={drawer} onClick={(event) => event.stopPropagation()}>
            <div style={drawerHeader}>
              <div>
                <div style={eyebrow}>Seller Listing</div>
                <h2 style={drawerTitle}>{sellerName(selectedListing)}</h2>
              </div>

              <button type="button" style={closeButton} onClick={closeDrawer}>
                Close
              </button>
            </div>

            <div style={drawerStatus}>
              {selectedListing.status || "Pending Review"}
            </div>

            {editingListing ? (
              <div
                style={{
                  display: "grid",
                  gap: "14px",
                  marginTop: "18px",
                }}
              >
                <label style={{ display: "grid", gap: "6px" }}>
                  <strong>Business Name</strong>
                  <input
                    value={editFields.businessName}
                    onChange={(event) =>
                      setEditFields((current) => ({
                        ...current,
                        businessName: event.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid #d7d7d7",
                      font: "inherit",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "6px" }}>
                  <strong>Contact Name</strong>
                  <input
                    value={editFields.contactName}
                    onChange={(event) =>
                      setEditFields((current) => ({
                        ...current,
                        contactName: event.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid #d7d7d7",
                      font: "inherit",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "6px" }}>
                  <strong>Best Contact</strong>
                  <input
                    value={editFields.contact}
                    onChange={(event) =>
                      setEditFields((current) => ({
                        ...current,
                        contact: event.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid #d7d7d7",
                      font: "inherit",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "6px" }}>
                  <strong>Email</strong>
                  <input
                    type="email"
                    value={editFields.email}
                    onChange={(event) =>
                      setEditFields((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid #d7d7d7",
                      font: "inherit",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "6px" }}>
                  <strong>What They Sell</strong>
                  <textarea
                    value={editFields.selling}
                    onChange={(event) =>
                      setEditFields((current) => ({
                        ...current,
                        selling: event.target.value,
                      }))
                    }
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid #d7d7d7",
                      font: "inherit",
                      resize: "vertical",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "6px" }}>
                  <strong>Price / Package / Deposit</strong>
                  <input
                    value={editFields.pricePackage}
                    onChange={(event) =>
                      setEditFields((current) => ({
                        ...current,
                        pricePackage: event.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid #d7d7d7",
                      font: "inherit",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "6px" }}>
                  <strong>Pickup / Delivery</strong>
                  <input
                    value={editFields.fulfillment}
                    onChange={(event) =>
                      setEditFields((current) => ({
                        ...current,
                        fulfillment: event.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid #d7d7d7",
                      font: "inherit",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "6px" }}>
                  <strong>Location</strong>
                  <input
                    value={editFields.location}
                    onChange={(event) =>
                      setEditFields((current) => ({
                        ...current,
                        location: event.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid #d7d7d7",
                      font: "inherit",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "6px" }}>
                  <strong>Website / Facebook / Order Link</strong>
                  <input
                    value={editFields.sellerLink}
                    onChange={(event) =>
                      setEditFields((current) => ({
                        ...current,
                        sellerLink: event.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid #d7d7d7",
                      font: "inherit",
                    }}
                  />
                </label>

                <label style={{ display: "grid", gap: "6px" }}>
                  <strong>Notes / Availability</strong>
                  <textarea
                    value={editFields.notes}
                    onChange={(event) =>
                      setEditFields((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: "1px solid #d7d7d7",
                      font: "inherit",
                      resize: "vertical",
                    }}
                  />
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "4px",
                  }}
                >
                  <button
                    type="button"
                    style={primaryButton}
                    disabled={workingId === selectedListing.id}
                    onClick={saveListingChanges}
                  >
                    {workingId === selectedListing.id
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    style={secondaryButton}
                    disabled={workingId === selectedListing.id}
                    onClick={() => setEditingListing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={detailBlock}>
                  <strong>Location</strong>
                  <span>{selectedListing.location || "Okeechobee area"}</span>
                </div>

                <div style={detailBlock}>
                  <strong>Best Contact</strong>
                  <span>{selectedListing.contact || "Not provided"}</span>
                </div>

                <div style={detailBlock}>
                  <strong>Listing Details</strong>
                  <div style={preWrap}>
                    {visibleListingDescription(selectedListing) ||
                      "No listing details provided."}
                  </div>
                </div>
              </>
            )}

            {!editingListing ? (
              <div
                style={{
                  marginTop: "22px",
                  padding: "16px",
                  border: "1px solid #ded8c8",
                  borderRadius: "14px",
                  background: "#faf8f1",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    color: "#6b665a",
                    marginBottom: "8px",
                  }}
                >
                  Seller Verification
                </div>

                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: 800,
                    color: isVerifiedSeller(selectedListing)
                      ? "#17653a"
                      : "#25241f",
                  }}
                >
                  {isVerifiedSeller(selectedListing)
                    ? "✓ Verified Local Seller"
                    : "Not Verified"}
                </div>

                {!isVerifiedSeller(selectedListing) ? (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gap: "5px",
                        marginTop: "12px",
                        fontSize: "13px",
                        color: "#625f55",
                      }}
                    >
                      <span>□ Contact confirmed</span>
                      <span>□ Local seller / ranch confirmed</span>
                      <span>□ Business or seller presence checked</span>
                      <span>□ Products / source reasonably confirmed</span>
                    </div>

                    <button
                      type="button"
                      style={{
                        ...primaryButton,
                        marginTop: "14px",
                      }}
                      disabled={workingId === selectedListing.id}
                      onClick={() =>
                        markListingVerified(selectedListing)
                      }
                    >
                      {workingId === selectedListing.id
                        ? "Verifying..."
                        : "Mark Verified Local Seller"}
                    </button>
                  </>
                ) : null}
              </div>
            ) : null}

            <div style={drawerActions}>
              {!editingListing &&
              statusKey(selectedListing.status) !== "archived" ? (
                <button
                  type="button"
                  style={secondaryButton}
                  disabled={workingId === selectedListing.id}
                  onClick={() => startEditingListing(selectedListing)}
                >
                  Edit Listing
                </button>
              ) : null}

              {!editingListing &&
              statusKey(selectedListing.status) !== "live" &&
              isVerifiedSeller(selectedListing) ? (
                <button
                  type="button"
                  style={primaryButton}
                  disabled={workingId === selectedListing.id}
                  onClick={() => changeListingStatus(selectedListing, "Active")}
                >
                  {workingId === selectedListing.id ? "Updating..." : "Make Live"}
                </button>
              ) : null}

              {!editingListing &&
              statusKey(selectedListing.status) !== "live" &&
              !isVerifiedSeller(selectedListing) ? (
                <div
                  style={{
                    width: "100%",
                    padding: "11px 13px",
                    borderRadius: "12px",
                    background: "#f3eee1",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#6b5f43",
                  }}
                >
                  Verify this seller before making the listing live.
                </div>
              ) : null}

              {!editingListing && statusKey(selectedListing.status) === "live" ? (
                <button
                  type="button"
                  style={secondaryButton}
                  disabled={workingId === selectedListing.id}
                  onClick={() => changeListingStatus(selectedListing, "Paused")}
                >
                  {workingId === selectedListing.id
                    ? "Updating..."
                    : "Pause / Sold Out"}
                </button>
              ) : null}

              {!editingListing && statusKey(selectedListing.status) !== "archived" ? (
                <button
                  type="button"
                  style={archiveButton}
                  disabled={workingId === selectedListing.id}
                  onClick={() => changeListingStatus(selectedListing, "Archived")}
                >
                  Archive
                </button>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}

      {selectedQuestion ? (
        <div style={overlay} onClick={closeDrawer}>
          <aside style={drawer} onClick={(event) => event.stopPropagation()}>
            <div style={drawerHeader}>
              <div>
                <div style={eyebrow}>Buyer Demand</div>
                <h2
                  style={{
                    ...drawerTitle,
                    textTransform: "uppercase",
                  }}
                >
                  {buyerRequestTitle(selectedQuestion.message)}
                </h2>

                <div
                  style={{
                    marginTop: "5px",
                    color: "#c7cec9",
                    fontSize: "14px",
                    fontWeight: 800,
                  }}
                >
                  {selectedQuestion.name || "Local Buyer"}
                </div>
              </div>

              <button type="button" style={closeButton} onClick={closeDrawer}>
                Close
              </button>
            </div>

            <div style={detailBlock}>
              <strong>Contact</strong>
              <span>{selectedQuestion.contact || "Not provided"}</span>
            </div>

            <div style={detailBlock}>
              <strong>What They Need</strong>
              <div style={preWrap}>
                {selectedQuestion.message || "No request provided."}
              </div>
            </div>

            <div
              style={{
                marginTop: "18px",
                padding: "16px",
                borderRadius: "14px",
                background: "#171d19",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <div style={eyebrow}>Current Status</div>

              <strong
                style={{
                  display: "block",
                  marginTop: "5px",
                  fontSize: "20px",
                  color:
                    selectedQuestion.workflow_status === "complete"
                      ? "#82d49d"
                      : "#fff",
                }}
              >
                {buyerStatusLabel(
                  selectedQuestion.workflow_status || "buyer_waiting"
                )}
              </strong>

              {selectedQuestion.matched_seller_name ? (
                <span
                  style={{
                    display: "block",
                    marginTop: "7px",
                    color: "#d9b76f",
                    fontSize: "13px",
                    fontWeight: 800,
                  }}
                >
                  Confirmed seller: {selectedQuestion.matched_seller_name}
                </span>
              ) : (
                <span
                  style={{
                    display: "block",
                    marginTop: "7px",
                    color: "#9fa9a2",
                    fontSize: "13px",
                  }}
                >
                  No confirmed seller yet.
                </span>
              )}
            </div>

            <div
              style={{
                marginTop: "22px",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid rgba(217,183,111,.28)",
                background: "#101713",
              }}
            >
              <div style={eyebrow}>Possible Local Supply</div>

              <h3
                style={{
                  margin: "5px 0 4px",
                  fontSize: "19px",
                }}
              >
                Possible Seller Matches
              </h3>

              <p
                style={{
                  margin: "0 0 14px",
                  color: "#9fa9a2",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                These sellers may carry what the buyer needs based on their
                listings. Confirm availability with the seller before marking
                the request matched.
              </p>

              {selectedQuestionMatches.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {selectedQuestionMatches.map(
                    ({ listing, matches, fulfillment }) => (
                      <div
                        key={listing.id}
                        style={{
                          padding: "14px",
                          borderRadius: "12px",
                          background: "#171d19",
                          border: "1px solid rgba(255,255,255,.08)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "12px",
                            flexWrap: "wrap",
                          }}
                        >
                          <div>
                            <strong
                              style={{
                                display: "block",
                                fontSize: "16px",
                                color: "#fff",
                              }}
                            >
                              {sellerName(listing)}
                            </strong>

                            <span
                              style={{
                                display: "block",
                                marginTop: "4px",
                                color: "#d9b76f",
                                fontSize: "13px",
                                fontWeight: 800,
                              }}
                            >
                              {matches.join(" + ")} match
                            </span>

                            <span
                              style={{
                                display: "block",
                                marginTop: "5px",
                                color: "#9fa9a2",
                                fontSize: "12px",
                              }}
                            >
                              {fulfillment}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <a
                              href={sellerStorefrontHref(listing)}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                minHeight: "38px",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "8px 12px",
                                borderRadius: "9px",
                                background: "#d9b76f",
                                color: "#142018",
                                textDecoration: "none",
                                fontSize: "12px",
                                fontWeight: 900,
                              }}
                            >
                              View Seller
                            </a>

                            <button
                              type="button"
                              disabled={workingId === selectedQuestion.id}
                              onClick={() =>
                                updateBuyerWorkflow(
                                  selectedQuestion,
                                  "seller_found",
                                  listing
                                )
                              }
                              style={{
                                minHeight: "38px",
                                padding: "8px 12px",
                                borderRadius: "9px",
                                border: "1px solid rgba(217,183,111,.45)",
                                background: "transparent",
                                color: "#d9b76f",
                                fontSize: "12px",
                                fontWeight: 900,
                                cursor: "pointer",
                              }}
                            >
                              {workingId === selectedQuestion.id
                                ? "Saving..."
                                : "Confirm Seller Match"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div
                  style={{
                    padding: "13px",
                    borderRadius: "11px",
                    background: "#171d19",
                    color: "#9fa9a2",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  No possible local seller found yet. This is active buyer
                  demand we can use to recruit the right local seller.
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "9px",
                marginTop: "18px",
              }}
            >
              {[
                ["buyer_waiting", "Buyer Waiting"],
                ["seller_found", "Seller Found"],
                ["buyer_contacted", "Buyer Contacted"],
                ["complete", "Complete"],
              ].map(([status, label]) => {
                const active =
                  (selectedQuestion.workflow_status || "buyer_waiting") ===
                  status;

                return (
                  <button
                    key={status}
                    type="button"
                    disabled={workingId === selectedQuestion.id}
                    onClick={() =>
                      updateBuyerWorkflow(selectedQuestion, status)
                    }
                    style={{
                      minHeight: "44px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: active
                        ? "1px solid #d9b76f"
                        : "1px solid rgba(255,255,255,.10)",
                      background: active ? "#d9b76f" : "#171d19",
                      color: active ? "#142018" : "#fff",
                      fontSize: "12px",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {workingId === selectedQuestion.id
                      ? "Saving..."
                      : label}
                  </button>
                );
              })}
            </div>

            {selectedQuestion.contact ? (
              <a
                href={contactHref(selectedQuestion.contact)}
                style={{
                  ...primaryLink,
                  marginTop: "12px",
                }}
              >
                Contact Buyer
              </a>
            ) : null}
          </aside>
        </div>
      ) : null}
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#050706",
  color: "#fff",
  padding: "28px 16px 80px",
};

const shell: React.CSSProperties = {
  width: "min(1180px, 100%)",
  margin: "0 auto",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  gap: 20,
  padding: 24,
  borderRadius: 22,
  background: "#101311",
  border: "1px solid rgba(255,255,255,.08)",
};

const backLink: React.CSSProperties = {
  display: "inline-flex",
  marginBottom: 16,
  color: "#9ea8a1",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 800,
};

const eyebrow: React.CSSProperties = {
  color: "#d9b76f",
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: ".12em",
  textTransform: "uppercase",
};

const pageTitle: React.CSSProperties = {
  margin: "5px 0 6px",
  fontSize: "clamp(28px, 5vw, 42px)",
};

const subtitle: React.CSSProperties = {
  maxWidth: 650,
  margin: 0,
  color: "#9fa9a2",
  lineHeight: 1.6,
};

const marketButton: React.CSSProperties = {
  display: "inline-flex",
  minHeight: 44,
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 16px",
  borderRadius: 11,
  background: "#d9b76f",
  color: "#142018",
  textDecoration: "none",
  fontWeight: 900,
};

const stats: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
  marginTop: 16,
};

const stat: React.CSSProperties = {
  display: "grid",
  gap: 7,
  padding: 15,
  borderRadius: 14,
  background: "#101713",
  border: "1px solid rgba(255,255,255,.07)",
  color: "#9fa9a2",
};

const toolbar: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 14,
  marginTop: 26,
};

const viewTabs: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const tab: React.CSSProperties = {
  display: "inline-flex",
  gap: 8,
  alignItems: "center",
  minHeight: 42,
  padding: "8px 14px",
  borderRadius: 11,
  border: "1px solid rgba(255,255,255,.08)",
  background: "#101311",
  color: "#aeb8b1",
  fontWeight: 800,
  cursor: "pointer",
};

const activeTab: React.CSSProperties = {
  ...tab,
  background: "#d9b76f",
  color: "#142018",
};

const tabCount: React.CSSProperties = {
  minWidth: 21,
  height: 21,
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  background: "rgba(0,0,0,.15)",
  fontSize: 11,
};

const searchInput: React.CSSProperties = {
  width: "min(390px, 100%)",
  minHeight: 44,
  borderRadius: 11,
  border: "1px solid rgba(255,255,255,.1)",
  background: "#101311",
  color: "#fff",
  padding: "0 14px",
  outline: "none",
};

const filters: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 16,
};

const filterButton: React.CSSProperties = {
  minHeight: 36,
  padding: "7px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.08)",
  background: "#101311",
  color: "#9fa9a2",
  fontWeight: 800,
  cursor: "pointer",
};

const activeFilter: React.CSSProperties = {
  ...filterButton,
  background: "#26362d",
  color: "#fff",
  border: "1px solid rgba(217,183,111,.35)",
};

const listPanel: React.CSSProperties = {
  marginTop: 18,
  padding: 20,
  borderRadius: 20,
  background: "#0d110f",
  border: "1px solid rgba(255,255,255,.07)",
};

const listHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 15,
  marginBottom: 14,
};

const sectionTitle: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 22,
};

const resultCount: React.CSSProperties = {
  color: "#9fa9a2",
  fontSize: 13,
};

const rows: React.CSSProperties = {
  display: "grid",
  gap: 8,
};

const row: React.CSSProperties = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "minmax(220px, 1.5fr) minmax(180px, 1fr) auto",
  gap: 16,
  alignItems: "center",
  padding: 15,
  borderRadius: 13,
  border: "1px solid rgba(255,255,255,.07)",
  background: "#151b17",
  textAlign: "left",
  color: "#fff",
  cursor: "pointer",
};

const rowMain: React.CSSProperties = {
  display: "grid",
  gap: 5,
  minWidth: 0,
};

const rowTitle: React.CSSProperties = {
  fontSize: 15,
};

const rowProduct: React.CSSProperties = {
  color: "#c7cec9",
  fontSize: 13,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rowMeta: React.CSSProperties = {
  display: "grid",
  gap: 4,
  color: "#9fa9a2",
  fontSize: 12,
};

const rowRight: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const statusBadge: React.CSSProperties = {
  padding: "5px 8px",
  borderRadius: 999,
  background: "rgba(217,183,111,.12)",
  color: "#e9cd95",
  fontSize: 10,
  fontWeight: 900,
  textTransform: "uppercase",
};

const buyerBadge: React.CSSProperties = {
  ...statusBadge,
  background: "rgba(105,170,255,.12)",
  color: "#a9ceff",
};

const openText: React.CSSProperties = {
  color: "#d9b76f",
  fontSize: 12,
  fontWeight: 900,
};

const empty: React.CSSProperties = {
  padding: 18,
  borderRadius: 13,
  border: "1px dashed rgba(255,255,255,.12)",
  color: "#9fa9a2",
};

const noticeStyle: React.CSSProperties = {
  width: "min(1180px, 100%)",
  margin: "14px auto 0",
  padding: 13,
  borderRadius: 11,
  background: "#233126",
  color: "#dce8df",
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  background: "rgba(0,0,0,.72)",
  display: "flex",
  justifyContent: "flex-end",
};

const drawer: React.CSSProperties = {
  width: "min(540px, 100%)",
  height: "100%",
  overflowY: "auto",
  padding: 24,
  background: "#101713",
  borderLeft: "1px solid rgba(217,183,111,.25)",
  boxShadow: "-20px 0 60px rgba(0,0,0,.35)",
};

const drawerHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 15,
};

const drawerTitle: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: 28,
};

const closeButton: React.CSSProperties = {
  minHeight: 38,
  padding: "7px 11px",
  borderRadius: 9,
  border: "1px solid rgba(255,255,255,.1)",
  background: "#1b211d",
  color: "#fff",
  cursor: "pointer",
};

const drawerStatus: React.CSSProperties = {
  display: "inline-flex",
  marginTop: 18,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(217,183,111,.12)",
  color: "#e9cd95",
  fontSize: 11,
  fontWeight: 900,
  textTransform: "uppercase",
};

const detailBlock: React.CSSProperties = {
  display: "grid",
  gap: 7,
  marginTop: 22,
  color: "#d8ded9",
};

const preWrap: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  lineHeight: 1.65,
  color: "#c7cec9",
};

const drawerActions: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 9,
  marginTop: 28,
};

const primaryButton: React.CSSProperties = {
  minHeight: 43,
  padding: "9px 14px",
  border: 0,
  borderRadius: 10,
  background: "#d9b76f",
  color: "#142018",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  ...primaryButton,
  background: "#26362d",
  color: "#fff",
};

const archiveButton: React.CSSProperties = {
  ...primaryButton,
  background: "#311c1c",
  color: "#ffc1c1",
};

const primaryLink: React.CSSProperties = {
  display: "inline-flex",
  minHeight: 43,
  marginTop: 25,
  padding: "9px 14px",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
  background: "#d9b76f",
  color: "#142018",
  textDecoration: "none",
  fontWeight: 900,
};


