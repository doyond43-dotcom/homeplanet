import { useSyncExternalStore } from "react";

export type RouteCutStatus =
  | "new"
  | "scheduled"
  | "en-route"
  | "on-site"
  | "complete";

export type RouteCutStop = {
  id: string;
  customer: string;
  address: string;
  phone: string;
  notes: string;
  service: string;
  status: RouteCutStatus;
  openingWindow: string;
  createdAt: string;
};

type RouteCutState = {
  stops: RouteCutStop[];
  selectedId: string | null;
  updatedAt: string;
};

const STATUS_ORDER: RouteCutStatus[] = [
  "new",
  "scheduled",
  "en-route",
  "on-site",
  "complete",
];

const STATUS_LABELS: Record<RouteCutStatus, string> = {
  new: "New",
  scheduled: "Scheduled",
  "en-route": "En Route",
  "on-site": "On Site",
  complete: "Complete",
};

const initialStops: RouteCutStop[] = [
  {
    id: "rc-1001",
    customer: "Taylor Family",
    address: "1220 SW 3rd Ave, Okeechobee, FL",
    phone: "863-555-0101",
    notes: "Front yard cleanup and mow.",
    service: "Mow + Edge",
    status: "new",
    openingWindow: "9:00 AM – 10:00 AM",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rc-1002",
    customer: "Johnson Property",
    address: "4487 SE 28th St, Okeechobee, FL",
    phone: "863-555-0102",
    notes: "Gate code needed before arrival.",
    service: "Mow + Hedge Trim",
    status: "scheduled",
    openingWindow: "10:00 AM – 11:30 AM",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rc-1003",
    customer: "Lakeview Rental",
    address: "901 Lakeview Dr, Okeechobee, FL",
    phone: "863-555-0103",
    notes: "Tenant requested text on arrival.",
    service: "Mow + Blow",
    status: "en-route",
    openingWindow: "11:30 AM – 12:30 PM",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rc-1004",
    customer: "Miller Residence",
    address: "77 Palm Ct, Okeechobee, FL",
    phone: "863-555-0104",
    notes: "Back gate unlocked.",
    service: "Full Lawn Service",
    status: "on-site",
    openingWindow: "1:00 PM – 2:00 PM",
    createdAt: new Date().toISOString(),
  },
  {
    id: "rc-1005",
    customer: "Cypress Corner",
    address: "16 Cypress Loop, Okeechobee, FL",
    phone: "863-555-0105",
    notes: "Weekly recurring stop.",
    service: "Mow + Edge",
    status: "complete",
    openingWindow: "Completed",
    createdAt: new Date().toISOString(),
  },
];

let state: RouteCutState = {
  stops: initialStops,
  selectedId: initialStops[0]?.id ?? null,
  updatedAt: new Date().toLocaleTimeString(),
};

const listeners = new Set<() => void>();

function emitChange() {
  state = {
    ...state,
    updatedAt: new Date().toLocaleTimeString(),
  };

  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): RouteCutState {
  return state;
}

export function useRouteCutStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function orderedStatuses(): RouteCutStatus[] {
  return [...STATUS_ORDER];
}

export function statusLabel(status: RouteCutStatus): string {
  return STATUS_LABELS[status];
}

export function nextStatus(status: RouteCutStatus): RouteCutStatus {
  const currentIndex = STATUS_ORDER.indexOf(status);

  if (currentIndex === -1) return "new";
  if (currentIndex >= STATUS_ORDER.length - 1) return "complete";

  return STATUS_ORDER[currentIndex + 1];
}

export function getStopById(id: string | null | undefined): RouteCutStop | null {
  if (!id) return null;
  return state.stops.find((stop) => stop.id === id) ?? null;
}

export function setSelectedStop(id: string | null) {
  state = {
    ...state,
    selectedId: id,
  };
  emitChange();
}

export function moveStop(id: string, next: RouteCutStatus) {
  const updatedStops = state.stops.map((stop) =>
    stop.id === id ? { ...stop, status: next } : stop
  );

  state = {
    ...state,
    stops: updatedStops,
    selectedId: id,
  };

  emitChange();
}

export function addWalkOnStop(input: {
  customer: string;
  address?: string;
  phone?: string;
  notes?: string;
  service?: string;
  openingWindow?: string;
}) {
  const newStop: RouteCutStop = {
    id: `rc-${Date.now()}`,
    customer: input.customer.trim(),
    address: input.address?.trim() || "Address not provided",
    phone: input.phone?.trim() || "No phone provided",
    notes: input.notes?.trim() || "",
    service: input.service?.trim() || "Walk-On Service",
    status: "new",
    openingWindow: input.openingWindow?.trim() || "Next available opening",
    createdAt: new Date().toISOString(),
  };

  state = {
    ...state,
    stops: [newStop, ...state.stops],
    selectedId: newStop.id,
  };

  emitChange();
}