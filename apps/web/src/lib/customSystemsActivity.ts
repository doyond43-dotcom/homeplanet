import { supabase } from "./supabase";

export type CustomSystemsActivityEventName =
  | "page_view"
  | "start_here_click"
  | "show_need_click"
  | "how_it_works_click"
  | "problem_selected"
  | "request_opened"
  | "request_started"
  | "request_submitted";

type ActivityOptions = {
  label?: string;
  metadata?: Record<string, unknown>;
};

const TABLE = "custom_systems_activity_events";
const PAGE_PATH = "/planet/custom-systems";

const VISITOR_KEY = "hp-custom-systems-visitor-id";
const SESSION_KEY = "hp-custom-systems-session-id";

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getOrCreateVisitorId() {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);

    if (existing) {
      return existing;
    }

    const created = createId("visitor");
    window.localStorage.setItem(VISITOR_KEY, created);
    return created;
  } catch {
    return createId("visitor");
  }
}

function getOrCreateSessionId() {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);

    if (existing) {
      return existing;
    }

    const created = createId("session");
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return createId("session");
  }
}

function detectSource() {
  const params = new URLSearchParams(window.location.search);

  const utmSource = params.get("utm_source");

  if (utmSource) {
    return utmSource.toLowerCase().slice(0, 120);
  }

  if (params.has("fbclid")) {
    return "facebook";
  }

  if (params.has("gclid")) {
    return "google";
  }

  if (!document.referrer) {
    return "direct";
  }

  try {
    const host = new URL(document.referrer).hostname.toLowerCase();

    if (host.includes("facebook.com") || host.includes("fb.com")) {
      return "facebook";
    }

    if (host.includes("google.")) {
      return "google";
    }

    return host.slice(0, 120);
  } catch {
    return "referral";
  }
}

export async function trackCustomSystemsActivity(
  eventName: CustomSystemsActivityEventName,
  options: ActivityOptions = {},
) {
  try {
    const { error } = await supabase
      .from(TABLE)
      .insert({
        event_name: eventName,
        page_path: PAGE_PATH,
        session_id: getOrCreateSessionId(),
        visitor_id: getOrCreateVisitorId(),
        source: detectSource(),
        referrer: document.referrer
          ? document.referrer.slice(0, 1000)
          : null,
        label: options.label?.slice(0, 200) ?? null,
        metadata: {
          host: window.location.host,
          ...options.metadata,
        },
      });

    if (error) {
      console.warn("Custom Systems activity tracking error", error);
    }
  } catch (error) {
    console.warn("Custom Systems activity tracking error", error);
  }
}