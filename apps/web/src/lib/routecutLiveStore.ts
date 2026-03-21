import { useSyncExternalStore } from "react";

export type RouteCutStatus =
  | "new"
  | "scheduled"
  | "en-route"
  | "on-site"
  | "complete";

export type RouteCutEventType =
  | "created"
  | "status-change"
  | "note"
  | "customer-contact"
  | "payment"
  | "completion";

export type RouteCutPaymentMethod = "zelle" | "cashapp" | "venmo" | "card";

export type RouteCutPayment = {
  status: "unpaid" | "paid";
  amountDue: number;
  amountPaid: number;
  method?: RouteCutPaymentMethod;
  paidAt?: string;
};

export type RouteCutEvent = {
  id: string;
  type: RouteCutEventType;
  title: string;
  detail: string;
  createdAt: string;
};

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
  events: RouteCutEvent[];
  payment: RouteCutPayment;
};

type RouteCutState = {
  stops: RouteCutStop[];
  selectedId: string | null;
  updatedAt: string;
};

export const ROUTE_OWNER_PAYMENT = {
  ownerName: "Johnny",
  zelle: "863-555-0101",
  cashApp: "$johnnyslawn",
  paymentNodeUrl: "/planet/payments/node",
};

const STATUS_ORDER: RouteCutStatus[] = [
  "new",
  "scheduled",
  "en-route",
  "on-site",
  "complete",
];

const NEXT_SELECTION_PRIORITY: RouteCutStatus[] = [
  "on-site",
  "en-route",
  "scheduled",
  "new",
];

const STATUS_LABELS: Record<RouteCutStatus, string> = {
  new: "New",
  scheduled: "Scheduled",
  "en-route": "En Route",
  "on-site": "On Site",
  complete: "Complete",
};

const STATUS_ACTION_LABELS: Record<RouteCutStatus, string> = {
  new: "Confirm Job",
  scheduled: "Mark En Route",
  "en-route": "Mark On Site",
  "on-site": "Mark Complete",
  complete: "Completed",
};

function nowIso() {
  return new Date().toISOString();
}

function displayTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function createEvent(input: {
  type: RouteCutEventType;
  title: string;
  detail: string;
}): RouteCutEvent {
  return {
    id: `rce-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: input.type,
    title: input.title,
    detail: input.detail,
    createdAt: nowIso(),
  };
}

function serviceAmount(service: string) {
  const match = service.match(/\$?\d+(?:\.\d{1,2})?/);
  if (!match) return 80;
  return Number(match[0].replace("$", ""));
}

function paymentMethodLabel(method?: RouteCutPaymentMethod) {
  switch (method) {
    case "zelle":
      return "Zelle";
    case "cashapp":
      return "Cash App";
    case "venmo":
      return "Venmo";
    case "card":
      return "Card";
    default:
      return "Payment";
  }
}

function statusChangeDetail(status: RouteCutStatus, customer: string) {
  switch (status) {
    case "new":
      return `${customer} entered the route queue.`;
    case "scheduled":
      return `Crew confirmed this stop and locked in the route window.`;
    case "en-route":
      return `Crew is now driving toward this property.`;
    case "on-site":
      return `Crew has arrived and work is now active on site.`;
    case "complete":
      return `Service finished and the stop was closed out.`;
    default:
      return `Route status updated.`;
  }
}

function statusCorrectionDetail(status: RouteCutStatus, customer: string) {
  switch (status) {
    case "new":
      return `Operator moved ${customer} back to New.`;
    case "scheduled":
      return `Operator moved ${customer} back to Scheduled.`;
    case "en-route":
      return `Operator moved ${customer} back to En Route.`;
    case "on-site":
      return `Operator moved ${customer} back to On Site.`;
    case "complete":
      return `Operator moved ${customer} back to Complete.`;
    default:
      return `Operator corrected the stop status.`;
  }
}

function buildPayment(
  amountDue: number,
  overrides?: Partial<RouteCutPayment>
): RouteCutPayment {
  return {
    status: "unpaid",
    amountDue,
    amountPaid: 0,
    ...overrides,
  };
}

function findNextSelectableStopId(stops: RouteCutStop[], excludeId?: string | null) {
  for (const status of NEXT_SELECTION_PRIORITY) {
    const match = stops.find(
      (stop) => stop.status === status && stop.id !== excludeId
    );
    if (match) return match.id;
  }

  const fallback =
    stops.find((stop) => stop.status !== "complete" && stop.id !== excludeId) ??
    stops.find((stop) => stop.id !== excludeId) ??
    null;

  return fallback?.id ?? null;
}

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
    createdAt: nowIso(),
    payment: buildPayment(80),
    events: [
      createEvent({
        type: "created",
        title: "Stop created",
        detail: "Route stop was created and added to the live route.",
      }),
    ],
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
    createdAt: nowIso(),
    payment: buildPayment(80),
    events: [
      createEvent({
        type: "created",
        title: "Stop created",
        detail: "Route stop was created and added to the live route.",
      }),
      createEvent({
        type: "status-change",
        title: "Job confirmed",
        detail: "Crew confirmed this stop and locked in the route window.",
      }),
    ],
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
    createdAt: nowIso(),
    payment: buildPayment(80),
    events: [
      createEvent({
        type: "created",
        title: "Stop created",
        detail: "Route stop was created and added to the live route.",
      }),
      createEvent({
        type: "status-change",
        title: "Job confirmed",
        detail: "Crew confirmed this stop and locked in the route window.",
      }),
      createEvent({
        type: "status-change",
        title: "Crew en route",
        detail: "Crew is now driving toward this property.",
      }),
    ],
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
    createdAt: nowIso(),
    payment: buildPayment(80),
    events: [
      createEvent({
        type: "created",
        title: "Stop created",
        detail: "Route stop was created and added to the live route.",
      }),
      createEvent({
        type: "status-change",
        title: "Job confirmed",
        detail: "Crew confirmed this stop and locked in the route window.",
      }),
      createEvent({
        type: "status-change",
        title: "Crew en route",
        detail: "Crew is now driving toward this property.",
      }),
      createEvent({
        type: "status-change",
        title: "Crew on site",
        detail: "Crew has arrived and work is now active on site.",
      }),
    ],
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
    createdAt: nowIso(),
    payment: buildPayment(80, {
      status: "paid",
      amountPaid: 80,
      method: "zelle",
      paidAt: nowIso(),
    }),
    events: [
      createEvent({
        type: "created",
        title: "Stop created",
        detail: "Route stop was created and added to the live route.",
      }),
      createEvent({
        type: "status-change",
        title: "Job confirmed",
        detail: "Crew confirmed this stop and locked in the route window.",
      }),
      createEvent({
        type: "status-change",
        title: "Crew en route",
        detail: "Crew is now driving toward this property.",
      }),
      createEvent({
        type: "status-change",
        title: "Crew on site",
        detail: "Crew has arrived and work is now active on site.",
      }),
      createEvent({
        type: "completion",
        title: "Job completed",
        detail: "Service finished and the stop was closed out.",
      }),
      createEvent({
        type: "payment",
        title: "Payment received",
        detail: "Customer paid $80 via Zelle.",
      }),
    ],
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

export function nextActionLabel(status: RouteCutStatus): string {
  return STATUS_ACTION_LABELS[status];
}

export function nextStatus(status: RouteCutStatus): RouteCutStatus {
  const currentIndex = STATUS_ORDER.indexOf(status);

  if (currentIndex === -1) return "new";
  if (currentIndex >= STATUS_ORDER.length - 1) return "complete";

  return STATUS_ORDER[currentIndex + 1];
}

export function previousStatus(status: RouteCutStatus): RouteCutStatus {
  const currentIndex = STATUS_ORDER.indexOf(status);

  if (currentIndex <= 0) return "new";
  return STATUS_ORDER[currentIndex - 1];
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
  const updatedStops = state.stops.map((stop) => {
    if (stop.id !== id) return stop;

    const isComplete = next === "complete";

    return {
      ...stop,
      status: next,
      openingWindow: isComplete ? "Completed" : stop.openingWindow,
      events: [
        ...stop.events,
        createEvent({
          type: isComplete ? "completion" : "status-change",
          title:
            next === "scheduled"
              ? "Job confirmed"
              : next === "en-route"
              ? "Crew en route"
              : next === "on-site"
              ? "Crew on site"
              : next === "complete"
              ? "Job completed"
              : "Status updated",
          detail: statusChangeDetail(next, stop.customer),
        }),
      ],
    };
  });

  const selectedId = next === "complete" ? findNextSelectableStopId(updatedStops, id) : id;

  state = {
    ...state,
    stops: updatedStops,
    selectedId,
  };

  emitChange();
}

export function advanceStop(id: string) {
  const stop = getStopById(id);
  if (!stop || stop.status === "complete") return;
  moveStop(id, nextStatus(stop.status));
}

export function stepBackStop(id: string) {
  const stop = getStopById(id);
  if (!stop || stop.status === "new") return;

  const previous = previousStatus(stop.status);

  const updatedStops = state.stops.map((item) => {
    if (item.id !== id) return item;

    return {
      ...item,
      status: previous,
      openingWindow: previous === "complete" ? "Completed" : item.openingWindow,
      events: [
        ...item.events,
        createEvent({
          type: "status-change",
          title: "Status corrected",
          detail: statusCorrectionDetail(previous, item.customer),
        }),
      ],
    };
  });

  state = {
    ...state,
    stops: updatedStops,
    selectedId: id,
  };

  emitChange();
}

export function markStopPaid(id: string, method: RouteCutPaymentMethod) {
  const updatedStops = state.stops.map((stop) => {
    if (stop.id !== id) return stop;

    return {
      ...stop,
      payment: {
        ...stop.payment,
        status: "paid",
        amountPaid: stop.payment.amountDue,
        method,
        paidAt: nowIso(),
      },
      events: [
        ...stop.events,
        createEvent({
          type: "payment",
          title: "Payment received",
          detail: `Customer paid $${stop.payment.amountDue} via ${paymentMethodLabel(
            method
          )}.`,
        }),
      ],
    };
  });

  state = {
    ...state,
    stops: updatedStops,
    selectedId: id,
  };

  emitChange();
}

export function addStopNote(id: string, note: string) {
  const cleanNote = note.trim();
  if (!cleanNote) return;

  const updatedStops = state.stops.map((stop) =>
    stop.id === id
      ? {
          ...stop,
          notes: stop.notes ? `${stop.notes}\n${cleanNote}` : cleanNote,
          events: [
            ...stop.events,
            createEvent({
              type: "note",
              title: "Operator note added",
              detail: cleanNote,
            }),
          ],
        }
      : stop
  );

  state = {
    ...state,
    stops: updatedStops,
    selectedId: id,
  };

  emitChange();
}

export function buildCustomerPaymentMessage(stop: RouteCutStop) {
  const lines = [
    `Hi ${stop.customer} — your RouteCut service is ready for payment.`,
    "",
    `Total: $${stop.payment.amountDue}`,
    "",
    `Pay via Zelle:`,
    ROUTE_OWNER_PAYMENT.zelle,
  ];

  if (ROUTE_OWNER_PAYMENT.cashApp?.trim()) {
    lines.push("", "Or Cash App:", ROUTE_OWNER_PAYMENT.cashApp);
  }

  lines.push("", "Thank you!");

  return lines.join("\n");
}

export function logCustomerContact(id: string, method: "text" | "call") {
  const updatedStops = state.stops.map((stop) =>
    stop.id === id
      ? {
          ...stop,
          events: [
            ...stop.events,
            createEvent({
              type: "customer-contact",
              title: method === "text" ? "Customer texted" : "Customer called",
              detail:
                method === "text"
                  ? `Operator opened text flow for ${stop.phone}.`
                  : `Operator opened call flow for ${stop.phone}.`,
            }),
          ],
        }
      : stop
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
  const createdAt = nowIso();
  const service = input.service?.trim() || "Walk-On Service";
  const amountDue = serviceAmount(service);

  const newStop: RouteCutStop = {
    id: `rc-${Date.now()}`,
    customer: input.customer.trim(),
    address: input.address?.trim() || "Address not provided",
    phone: input.phone?.trim() || "No phone provided",
    notes: input.notes?.trim() || "",
    service,
    status: "new",
    openingWindow: input.openingWindow?.trim() || "Next available opening",
    createdAt,
    payment: buildPayment(amountDue),
    events: [
      {
        id: `rce-${Date.now()}-created`,
        type: "created",
        title: "Walk-on stop created",
        detail: "Customer claimed an opening from the public route page.",
        createdAt,
      },
    ],
  };

  state = {
    ...state,
    stops: [newStop, ...state.stops],
    selectedId: newStop.id,
  };

  emitChange();
  return newStop.id;
}

export function getLatestEvent(stop: RouteCutStop | null | undefined) {
  if (!stop || stop.events.length === 0) return null;
  return stop.events[stop.events.length - 1] ?? null;
}

export function formatEventTime(value: string) {
  return displayTime(value);
}