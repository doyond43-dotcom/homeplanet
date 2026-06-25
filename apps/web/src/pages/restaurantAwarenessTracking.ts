export type RestaurantAwarenessEvent = {
  id: string;
  event: string;
  board: string;
  table?: string;
  createdAt: number;
};

const TRACKING_KEY = "hp-restaurant-awareness-tracking";

export function readRestaurantAwarenessEvents(): RestaurantAwarenessEvent[] {
  try {
    return JSON.parse(localStorage.getItem(TRACKING_KEY) || "[]");
  } catch {
    return [];
  }
}

export function trackRestaurantAwareness(event: string, board: string, table?: string) {
  const nextEvent: RestaurantAwarenessEvent = {
    id: crypto.randomUUID(),
    event,
    board,
    table,
    createdAt: Date.now(),
  };

  localStorage.setItem(
    TRACKING_KEY,
    JSON.stringify([nextEvent, ...readRestaurantAwarenessEvents()].slice(0, 200))
  );

  window.dispatchEvent(new Event("restaurant-awareness-tracking-sync"));
}
