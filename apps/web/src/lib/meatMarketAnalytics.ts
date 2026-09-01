import { supabase } from "./supabase";

const SESSION_KEY = "homeplanet_meat_market_session";
const INTERNAL_BROWSER_KEY = "homeplanet_meat_market_internal";

export function markMeatMarketBrowserInternal() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(INTERNAL_BROWSER_KEY, "true");
  } catch {
    // Ignore storage failures.
  }
}

function shouldSkipMeatMarketTracking() {
  if (typeof window === "undefined") return true;

  const hostname = window.location.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  ) {
    return true;
  }

  try {
    return (
      window.localStorage.getItem(INTERNAL_BROWSER_KEY) === "true"
    );
  } catch {
    return false;
  }
}

function createSessionId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `mm-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function meatMarketSessionId() {
  if (typeof window === "undefined") return "";

  let sessionId = window.localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = createSessionId();
    window.localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

type MeatMarketEventInput = {
  eventType:
    | "market_view"
    | "seller_view"
    | "product_order_click"
    | "seller_link_click";
  sellerId?: string;
  sellerSlug?: string;
  productId?: string | number;
  productName?: string;
  source?: string;
  destination?: string;
  payload?: Record<string, unknown>;
};

export async function trackMeatMarketEvent(
  input: MeatMarketEventInput
) {
  if (typeof window === "undefined") return;
  if (shouldSkipMeatMarketTracking()) return;

  if (
    input.eventType === "market_view" ||
    input.eventType === "seller_view"
  ) {
    const viewKey = [
      "homeplanet_meat_market_view",
      input.eventType,
      input.sellerSlug || "market",
    ].join(":");

    const lastView = Number(
      window.sessionStorage.getItem(viewKey) || "0"
    );

    const now = Date.now();

    if (now - lastView < 2000) {
      return;
    }

    window.sessionStorage.setItem(viewKey, String(now));
  }

  const { error } = await supabase
    .from("okeechobee_meat_market_events")
    .insert({
      event_type: input.eventType,
      session_id: meatMarketSessionId(),
      seller_id: input.sellerId || null,
      seller_slug: input.sellerSlug || null,
      product_id: input.productId || null,
      product_name: input.productName || null,
      source: input.source || null,
      destination: input.destination || null,
      referrer: document.referrer || null,
      payload: input.payload || {},
      verified: false,
    });

  if (error) {
    console.error("Meat Market analytics event failed:", error);
  }
}
