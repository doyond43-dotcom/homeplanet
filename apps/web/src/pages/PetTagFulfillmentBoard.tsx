import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import GuardianInPersonOrderDrawer from "./GuardianInPersonOrderDrawer";

type GuardianStatus =
  | "pending_payment"
  | "payment_submitted"
  | "payment_verified"
  | "tag_preparation"
  | "tag_activated"
  | "ready_to_ship"
  | "shipped"
  | "delivered";

type GuardianPet = {
  name?: string;
  type?: string;
  breed?: string;
  age?: string;
  color?: string;
  notes?: string;
};

type GuardianOrder = {
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  payment_method: string | null;
  payment_amount: number | string | null;
  payment_memo: string | null;
  pet_count: number | null;
  setup_total: number | string | null;
  monthly_total: number | string | null;
  pets: GuardianPet[] | null;
  status: GuardianStatus;
  created_at: string;
  payment_submitted_at: string | null;
  payment_verified_at: string | null;
  tag_preparation_at: string | null;
  tag_activated_at: string | null;
  ready_to_ship_at: string | null;
  shipping_carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  estimated_delivery_date: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  fulfillment_updated_at: string | null;
};

type GuardianActivity = {
  id?: string;
  event_type: string;
  title: string;
  detail: string | null;
  created_at: string;
};

type ShippingDraft = {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
};

type OrderView = "active" | "completed";
type StageFilter = "all" | GuardianStatus;

const statusLabels: Record<GuardianStatus, string> = {
  pending_payment: "Waiting for Payment",
  payment_submitted: "Payment Verification",
  payment_verified: "Payment Verified",
  tag_preparation: "Tag Preparation",
  tag_activated: "Tag Activated",
  ready_to_ship: "Ready to Ship",
  shipped: "Shipped",
  delivered: "Delivered",
};

const statusPillStyles: Record<GuardianStatus, string> = {
  pending_payment:
    "border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-100",
  payment_submitted:
    "border-amber-300/25 bg-amber-300/[0.1] text-amber-100",
  payment_verified:
    "border-sky-300/25 bg-sky-300/[0.1] text-sky-100",
  tag_preparation:
    "border-violet-300/25 bg-violet-300/[0.1] text-violet-100",
  tag_activated:
    "border-fuchsia-300/25 bg-fuchsia-300/[0.1] text-fuchsia-100",
  ready_to_ship:
    "border-orange-300/25 bg-orange-300/[0.1] text-orange-100",
  shipped:
    "border-blue-300/25 bg-blue-300/[0.1] text-blue-100",
  delivered:
    "border-emerald-300/25 bg-emerald-300/[0.1] text-emerald-100",
};

const nextStage: Partial<Record<GuardianStatus, GuardianStatus>> = {
  payment_submitted: "payment_verified",
  payment_verified: "tag_preparation",
  tag_preparation: "tag_activated",
  tag_activated: "ready_to_ship",
  shipped: "delivered",
};

const actionLabels: Partial<Record<GuardianStatus, string>> = {
  payment_submitted: "Verify Payment",
  payment_verified: "Start Tag Preparation",
  tag_preparation: "Confirm Tag Activation",
  tag_activated: "Mark Ready to Ship",
  shipped: "Mark Delivered",
};

const stageOptions: Array<{
  value: StageFilter;
  label: string;
}> = [
  { value: "all", label: "All Stages" },
  { value: "pending_payment", label: "Waiting for Payment" },
  { value: "payment_submitted", label: "Payment Verification" },
  { value: "payment_verified", label: "Payment Verified" },
  { value: "tag_preparation", label: "Tag Preparation" },
  { value: "tag_activated", label: "Tag Activated" },
  { value: "ready_to_ship", label: "Ready to Ship" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

function getFirstPet(order: GuardianOrder) {
  return Array.isArray(order.pets) ? order.pets[0] ?? null : null;
}

function getPetName(order: GuardianOrder) {
  return getFirstPet(order)?.name?.trim() || "Pet Tag Order";
}

function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    : "$0.00";
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not set";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function normalizeRpcOrder(data: unknown): GuardianOrder | null {
  if (Array.isArray(data)) {
    return (data[0] as GuardianOrder | undefined) ?? null;
  }

  return data && typeof data === "object"
    ? (data as GuardianOrder)
    : null;
}

function shippingDraftFor(order: GuardianOrder): ShippingDraft {
  return {
    carrier: order.shipping_carrier ?? "",
    trackingNumber: order.tracking_number ?? "",
    trackingUrl: order.tracking_url ?? "",
    estimatedDelivery: order.estimated_delivery_date ?? "",
  };
}

function orderAge(createdAt: string) {
  const created = new Date(createdAt).getTime();

  if (!Number.isFinite(created)) return "";

  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - created) / 60000),
  );

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes}m ago`;
  }

  const hours = Math.floor(elapsedMinutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getDateGroup(createdAt: string) {
  const created = new Date(createdAt);
  const now = new Date();

  if (Number.isNaN(created.getTime())) {
    return "Older";
  }

  const today = startOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);

  if (created >= today) return "Today";
  if (created >= yesterday) return "Yesterday";
  if (created >= weekStart) return "This Week";

  return "Older";
}

function matchesSearch(order: GuardianOrder, query: string) {
  if (!query) return true;

  const firstPet = getFirstPet(order);

  const haystack = [
    order.order_id,
    order.customer_name,
    order.customer_email,
    order.customer_phone,
    order.shipping_city,
    order.shipping_state,
    order.tracking_number,
    firstPet?.name,
    firstPet?.type,
    firstPet?.breed,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export default function PetTagFulfillmentBoard() {
  const [inPersonOrderOpen, setInPersonOrderOpen] =
    useState(false);
  const [orders, setOrders] = useState<GuardianOrder[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<GuardianOrder | null>(null);
  const [activity, setActivity] = useState<GuardianActivity[]>([]);

  const [shippingDraft, setShippingDraft] = useState<ShippingDraft>({
    carrier: "",
    trackingNumber: "",
    trackingUrl: "",
    estimatedDelivery: "",
  });

  const [view, setView] = useState<OrderView>("active");
  const [stageFilter, setStageFilter] =
    useState<StageFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionStatus, setCorrectionStatus] =
    useState<GuardianStatus>("pending_payment");
  const [correctionReason, setCorrectionReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [boardError, setBoardError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [drawerError, setDrawerError] = useState("");
  const [lastLoadedAt, setLastLoadedAt] = useState<Date | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setBoardError("");

    try {
      const { data, error } = await supabase.rpc(
        "get_guardian_fulfillment_orders",
      );

      if (error) throw new Error(error.message);

      const nextOrders = Array.isArray(data)
        ? (data as GuardianOrder[])
        : [];

      setOrders(nextOrders);
      setLastLoadedAt(new Date());

      setSelectedOrder((current) => {
        if (!current) return null;

        return (
          nextOrders.find(
            (order) => order.order_id === current.order_id,
          ) ?? current
        );
      });
    } catch (error) {
      setBoardError(
        error instanceof Error
          ? error.message
          : "Unable to load Guardian orders.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadActivity = useCallback(async (orderId: string) => {
    setActivityLoading(true);
    setDrawerError("");

    try {
      const { data, error } = await supabase.rpc(
        "get_guardian_operator_activity",
        {
          requested_order_id: orderId,
        },
      );

      if (error) throw new Error(error.message);

      setActivity(
        Array.isArray(data) ? (data as GuardianActivity[]) : [],
      );
    } catch (error) {
      setDrawerError(
        error instanceof Error
          ? error.message
          : "Unable to load order activity.",
      );
    } finally {
      setActivityLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!selectedOrder) {
      setActivity([]);
      return;
    }

    setShippingDraft(shippingDraftFor(selectedOrder));
    void loadActivity(selectedOrder.order_id);
  }, [loadActivity, selectedOrder?.order_id]);

  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "delivered"),
    [orders],
  );

  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === "delivered"),
    [orders],
  );

  const visibleOrders = useMemo(() => {
    const source =
      view === "active" ? activeOrders : completedOrders;

    return source
      .filter((order) =>
        stageFilter === "all"
          ? true
          : order.status === stageFilter,
      )
      .filter((order) =>
        matchesSearch(order, searchQuery.trim()),
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      );
  }, [
    activeOrders,
    completedOrders,
    searchQuery,
    stageFilter,
    view,
  ]);

  const groupedOrders = useMemo(() => {
    const groups = [
      "Today",
      "Yesterday",
      "This Week",
      "Older",
    ];

    return groups
      .map((label) => ({
        label,
        orders: visibleOrders.filter(
          (order) => getDateGroup(order.created_at) === label,
        ),
      }))
      .filter((group) => group.orders.length > 0);
  }, [visibleOrders]);

  const needsAction = useMemo(
    () =>
      activeOrders.filter((order) =>
        [
          "payment_submitted",
          "payment_verified",
          "tag_preparation",
          "tag_activated",
          "ready_to_ship",
        ].includes(order.status),
      ).length,
    [activeOrders],
  );

  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  const finishAction = (
    updated: GuardianOrder,
    message: string,
  ) => {
    setOrders((current) =>
      current.map((order) =>
        order.order_id === updated.order_id ? updated : order,
      ),
    );

    setSelectedOrder(null);
    setActivity([]);
    setDrawerError("");
    showSuccess(message);
  };

  const openOrder = (order: GuardianOrder) => {
    setDrawerError("");
    setCorrectionOpen(false);
    setCorrectionStatus(order.status);
    setCorrectionReason("");
    setSelectedOrder(order);
    setShippingDraft(shippingDraftFor(order));
  };

  const closeDrawer = () => {
    if (saving) return;

    setSelectedOrder(null);
    setDrawerError("");
    setCorrectionOpen(false);
    setCorrectionReason("");
    setActivity([]);
  };

  const replaceOrder = (updated: GuardianOrder) => {
    setOrders((current) =>
      current.map((order) =>
        order.order_id === updated.order_id ? updated : order,
      ),
    );

    setSelectedOrder(updated);
    setCorrectionStatus(updated.status);
    setShippingDraft(shippingDraftFor(updated));
  };

  const advanceOrder = async () => {
    if (!selectedOrder) return;

    const requestedNextStatus = nextStage[selectedOrder.status];

    if (!requestedNextStatus) return;

    setSaving(true);
    setDrawerError("");

    try {
      const { data, error } = await supabase.rpc(
        "advance_guardian_fulfillment",
        {
          requested_order_id: selectedOrder.order_id,
          requested_next_status: requestedNextStatus,
        },
      );

      if (error) throw new Error(error.message);

      const updated = normalizeRpcOrder(data);

      if (!updated) {
        throw new Error(
          "Supabase did not return the updated order.",
        );
      }

      await loadOrders();

      finishAction(
        updated,
        `${getPetName(updated)} is now ${statusLabels[updated.status]}.`,
      );
    } catch (error) {
      setDrawerError(
        error instanceof Error
          ? error.message
          : "Unable to update this order.",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveShippingAndMarkShipped = async () => {
    if (!selectedOrder) return;

    if (!shippingDraft.carrier.trim()) {
      setDrawerError("Enter the shipping carrier.");
      return;
    }

    if (!shippingDraft.trackingNumber.trim()) {
      setDrawerError("Enter the tracking number.");
      return;
    }

    setSaving(true);
    setDrawerError("");

    try {
      const { data: shippingData, error: shippingError } =
        await supabase.rpc("save_guardian_shipping_details", {
          requested_order_id: selectedOrder.order_id,
          requested_carrier: shippingDraft.carrier.trim(),
          requested_tracking_number:
            shippingDraft.trackingNumber.trim(),
          requested_tracking_url:
            shippingDraft.trackingUrl.trim() || null,
          requested_estimated_delivery:
            shippingDraft.estimatedDelivery || null,
        });

      if (shippingError) {
        throw new Error(shippingError.message);
      }

      const shippingOrder = normalizeRpcOrder(shippingData);

      if (!shippingOrder) {
        throw new Error(
          "Shipping details were not returned by Supabase.",
        );
      }

      const { data: shippedData, error: shippedError } =
        await supabase.rpc("advance_guardian_fulfillment", {
          requested_order_id: shippingOrder.order_id,
          requested_next_status: "shipped",
        });

      if (shippedError) {
        throw new Error(shippedError.message);
      }

      const shippedOrder = normalizeRpcOrder(shippedData);

      if (!shippedOrder) {
        throw new Error(
          "The shipped order was not returned by Supabase.",
        );
      }

      await loadOrders();

      finishAction(
        shippedOrder,
        `${getPetName(shippedOrder)} was marked Shipped.`,
      );
    } catch (error) {
      setDrawerError(
        error instanceof Error
          ? error.message
          : "Unable to save shipping details.",
      );
    } finally {
      setSaving(false);
    }
  };

  const correctOrderStage = async () => {
    if (!selectedOrder) return;

    if (correctionStatus === selectedOrder.status) {
      setDrawerError("Choose a different order stage.");
      return;
    }

    setSaving(true);
    setDrawerError("");

    try {
      const { data, error } = await supabase.rpc(
        "set_guardian_fulfillment_stage",
        {
          requested_order_id: selectedOrder.order_id,
          requested_status: correctionStatus,
          requested_reason: correctionReason.trim() || null,
        },
      );

      if (error) throw new Error(error.message);

      const updated = normalizeRpcOrder(data);

      if (!updated) {
        throw new Error(
          "Supabase did not return the corrected order.",
        );
      }

      setCorrectionOpen(false);
      setCorrectionReason("");

      await loadOrders();

      finishAction(
        updated,
        `${getPetName(updated)} was moved to ${statusLabels[updated.status]}.`,
      );
    } catch (error) {
      setDrawerError(
        error instanceof Error
          ? error.message
          : "Unable to correct this order stage.",
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedPet = selectedOrder
    ? getFirstPet(selectedOrder)
    : null;

  const selectedAction = selectedOrder
    ? actionLabels[selectedOrder.status]
    : null;

  return (
    <div className="min-h-screen bg-[#07101c] text-white">
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/[0.09] bg-gradient-to-r from-cyan-400/[0.13] via-blue-400/[0.09] to-violet-400/[0.13] p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200/70">
                Guardian Pet Tag
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Pet Tag Orders
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                Open an order, complete the next action, and the
                order status updates automatically.
              </p>
            </div>

            <div className="grid gap-3 sm:flex">
              <button
                type="button"
                onClick={() => setInPersonOrderOpen(true)}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-[#07111f] transition hover:bg-cyan-200"
              >
                Create In-Person Order
              </button>

              <button
                type="button"
                onClick={() => void loadOrders()}
                disabled={loading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.12] bg-white/[0.055] px-5 py-3 text-sm font-bold transition hover:bg-white/[0.09] disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                Refresh Orders
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-[#07111f]/60 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-white/40">
                Active Orders
              </div>
              <div className="mt-2 text-3xl font-bold">
                {activeOrders.length}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-300/18 bg-amber-300/[0.055] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-amber-100/55">
                Need Action
              </div>
              <div className="mt-2 text-3xl font-bold text-amber-100">
                {needsAction}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-300/18 bg-emerald-300/[0.055] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-emerald-100/55">
                Completed
              </div>
              <div className="mt-2 text-3xl font-bold text-emerald-100">
                {completedOrders.length}
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-white/35">
            {lastLoadedAt
              ? `Last refreshed ${formatDateTime(
                  lastLoadedAt.toISOString(),
                )}`
              : "Orders have not been loaded yet."}
          </p>
        </header>

        {boardError ? (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-4 text-sm text-red-100"
          >
            {boardError}
          </div>
        ) : null}

        {successMessage ? (
          <div
            role="status"
            className="mt-5 rounded-2xl border border-emerald-300/25 bg-emerald-300/[0.1] px-5 py-4 text-sm font-bold text-emerald-100"
          >
            {successMessage}
          </div>
        ) : null}

        <section className="mt-5 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search pet, customer, order ID, email, phone, or tracking"
                className="min-h-12 w-full rounded-2xl border border-white/[0.1] bg-[#07111f] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/28 focus:border-cyan-300/45"
              />
            </label>

            <select
              value={stageFilter}
              onChange={(event) =>
                setStageFilter(
                  event.target.value as StageFilter,
                )
              }
              className="min-h-12 rounded-2xl border border-white/[0.1] bg-[#07111f] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-cyan-300/45"
            >
              {stageOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 rounded-2xl border border-white/[0.1] bg-[#07111f] p-1">
              <button
                type="button"
                onClick={() => {
                  setView("active");
                  if (stageFilter === "delivered") {
                    setStageFilter("all");
                  }
                }}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  view === "active"
                    ? "bg-cyan-300 text-[#07111f]"
                    : "text-white/55 hover:text-white"
                }`}
              >
                Active
              </button>

              <button
                type="button"
                onClick={() => {
                  setView("completed");
                  setStageFilter("all");
                }}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  view === "completed"
                    ? "bg-emerald-300 text-[#07111f]"
                    : "text-white/55 hover:text-white"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </section>

        <div className="mt-5 space-y-7">
          {loading ? (
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 text-center text-sm text-white/40">
              Loading orders...
            </div>
          ) : groupedOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/[0.1] p-10 text-center">
              <div className="text-lg font-bold">
                No orders found
              </div>
              <div className="mt-2 text-sm text-white/40">
                Try changing the search or stage filter.
              </div>
            </div>
          ) : (
            groupedOrders.map((group) => (
              <section key={group.label}>
                <div className="mb-3 flex items-center justify-between gap-4 px-1">
                  <h2 className="text-lg font-bold">
                    {group.label}
                  </h2>

                  <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/55">
                    {group.orders.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {group.orders.map((order) => (
                    <button
                      key={order.order_id}
                      type="button"
                      onClick={() => openOrder(order)}
                      className="w-full rounded-3xl border border-white/[0.09] bg-white/[0.035] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.06] sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-bold">
                              {getPetName(order)}
                            </h3>

                            <span
                              className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${statusPillStyles[order.status]}`}
                            >
                              {statusLabels[order.status]}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/55">
                            <span className="font-semibold text-white/75">
                              {order.customer_name}
                            </span>
                            <span>{order.order_id}</span>
                            <span>
                              {order.shipping_city},{" "}
                              {order.shipping_state}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-5 sm:text-right">
                          <div>
                            <div className="text-sm font-semibold text-white/65">
                              {orderAge(order.created_at)}
                            </div>
                            <div className="mt-1 text-xs text-white/32">
                              {formatDateTime(order.created_at)}
                            </div>
                          </div>

                          <span className="text-sm font-bold text-cyan-200">
                            Open Order
                          </span>
                        </div>
                      </div>

                      {order.status === "shipped" &&
                      order.tracking_number ? (
                        <div className="mt-4 border-t border-white/[0.07] pt-3 text-xs text-white/45">
                          {order.shipping_carrier || "Carrier"}{" "}
                          tracking:{" "}
                          <span className="font-semibold text-white/70">
                            {order.tracking_number}
                          </span>
                        </div>
                      ) : null}
                    </button>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>

      <GuardianInPersonOrderDrawer
        open={inPersonOrderOpen}
        onClose={() => setInPersonOrderOpen(false)}
        onCreated={async () => {
          await loadOrders();
        }}
      />

      {selectedOrder ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-label="Close order"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="guardian-order-title"
            className="absolute inset-y-0 right-0 w-full max-w-2xl overflow-y-auto border-l border-white/[0.1] bg-[#09131f] shadow-2xl"
          >
            <div className="sticky top-0 z-10 border-b border-white/[0.08] bg-[#09131f]/95 px-5 py-4 backdrop-blur-xl sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${statusPillStyles[selectedOrder.status]}`}
                  >
                    {statusLabels[selectedOrder.status]}
                  </span>

                  <h2
                    id="guardian-order-title"
                    className="mt-3 text-2xl font-bold"
                  >
                    {getPetName(selectedOrder)}
                  </h2>

                  <p className="mt-1 text-sm text-white/45">
                    {selectedOrder.order_id}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  disabled={saving}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.04]"
                  aria-label="Close order"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-5 px-5 py-6 sm:px-7">
              {drawerError ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-400/25 bg-red-400/[0.08] p-4 text-sm text-red-100"
                >
                  {drawerError}
                </div>
              ) : null}

              <section className="rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.07] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100/60">
                  Next Action
                </p>

                {selectedOrder.status === "ready_to_ship" ? (
                  <>
                    <h3 className="mt-2 text-xl font-bold">
                      Add Shipping Details
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      Enter the carrier and tracking information below.
                      Saving will move this order directly to Shipped.
                    </p>
                  </>
                ) : selectedAction ? (
                  <>
                    <h3 className="mt-2 text-xl font-bold">
                      {selectedAction}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      Complete this action to move the order forward and
                      update the customer-facing status.
                    </p>

                    <button
                      type="button"
                      onClick={() => void advanceOrder()}
                      disabled={saving}
                      className="mt-5 min-h-14 w-full rounded-2xl bg-cyan-300 px-6 py-4 text-base font-bold text-[#07111f] transition hover:bg-cyan-200 disabled:opacity-50"
                    >
                      {saving ? "Updating Order..." : selectedAction}
                    </button>
                  </>
                ) : selectedOrder.status === "pending_payment" ? (
                  <>
                    <h3 className="mt-2 text-xl font-bold">
                      Waiting for Customer Payment
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      No operator action is required until the customer
                      submits payment.
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-emerald-100">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-bold">
                      Fulfillment complete.
                    </span>
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Customer
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <div className="text-white/40">Name</div>
                    <div className="mt-1 font-semibold">
                      {selectedOrder.customer_name}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/40">Email</div>
                    <a
                      href={`mailto:${selectedOrder.customer_email}`}
                      className="mt-1 inline-block font-semibold text-cyan-200"
                    >
                      {selectedOrder.customer_email}
                    </a>
                  </div>

                  {selectedOrder.customer_phone ? (
                    <div>
                      <div className="text-white/40">Phone</div>
                      <a
                        href={`tel:${selectedOrder.customer_phone}`}
                        className="mt-1 inline-block font-semibold text-cyan-200"
                      >
                        {selectedOrder.customer_phone}
                      </a>
                    </div>
                  ) : null}

                  <div>
                    <div className="text-white/40">
                      Shipping address
                    </div>
                    <div className="mt-1 font-semibold leading-6">
                      {selectedOrder.shipping_address}
                      <br />
                      {selectedOrder.shipping_city},{" "}
                      {selectedOrder.shipping_state}{" "}
                      {selectedOrder.shipping_zip}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Pet Tag Order
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-4">
                    <div className="text-xs text-white/40">
                      Setup
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {money(selectedOrder.setup_total)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-4">
                    <div className="text-xs text-white/40">
                      Monthly
                    </div>
                    <div className="mt-1 text-lg font-bold">
                      {money(selectedOrder.monthly_total)}/mo
                    </div>
                  </div>
                </div>

                {selectedPet ? (
                  <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.05] p-4">
                    <div className="text-lg font-bold">
                      {selectedPet.name || "Pet"}
                    </div>

                    <div className="mt-1 text-sm leading-6 text-white/60">
                      {[
                        selectedPet.type,
                        selectedPet.breed,
                        selectedPet.age,
                        selectedPet.color,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>

                    {selectedPet.notes ? (
                      <div className="mt-3 text-sm leading-6 text-white/50">
                        {selectedPet.notes}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>

              {selectedOrder.status === "ready_to_ship" ? (
                <section className="rounded-3xl border border-orange-300/18 bg-orange-300/[0.055] p-5">
                  <h3 className="text-lg font-bold">
                    Ship This Order
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Enter the shipping details. Saving will move
                    the order directly to Shipped.
                  </p>

                  <div className="mt-5 space-y-4">
                    <label className="block">
                      <span className="text-xs font-semibold text-white/55">
                        Carrier
                      </span>
                      <input
                        type="text"
                        value={shippingDraft.carrier}
                        onChange={(event) =>
                          setShippingDraft((current) => ({
                            ...current,
                            carrier: event.target.value,
                          }))
                        }
                        placeholder="USPS, UPS, or FedEx"
                        className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.1] bg-[#07111f] px-4 py-3 text-sm outline-none focus:border-cyan-300/45"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-semibold text-white/55">
                        Tracking number
                      </span>
                      <input
                        type="text"
                        value={shippingDraft.trackingNumber}
                        onChange={(event) =>
                          setShippingDraft((current) => ({
                            ...current,
                            trackingNumber: event.target.value,
                          }))
                        }
                        placeholder="Enter tracking number"
                        className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.1] bg-[#07111f] px-4 py-3 text-sm outline-none focus:border-cyan-300/45"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-semibold text-white/55">
                        Tracking link, optional
                      </span>
                      <input
                        type="url"
                        value={shippingDraft.trackingUrl}
                        onChange={(event) =>
                          setShippingDraft((current) => ({
                            ...current,
                            trackingUrl: event.target.value,
                          }))
                        }
                        placeholder="https://..."
                        className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.1] bg-[#07111f] px-4 py-3 text-sm outline-none focus:border-cyan-300/45"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-semibold text-white/55">
                        Estimated delivery, optional
                      </span>
                      <input
                        type="date"
                        value={shippingDraft.estimatedDelivery}
                        onChange={(event) =>
                          setShippingDraft((current) => ({
                            ...current,
                            estimatedDelivery: event.target.value,
                          }))
                        }
                        className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.1] bg-[#07111f] px-4 py-3 text-sm outline-none focus:border-cyan-300/45"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        void saveShippingAndMarkShipped()
                      }
                      disabled={saving}
                      className="min-h-14 w-full rounded-2xl bg-orange-300 px-6 py-4 text-base font-bold text-[#07111f] transition hover:bg-orange-200 disabled:opacity-50"
                    >
                      {saving
                        ? "Saving and Moving to Shipped..."
                        : "Save Shipping Details and Mark Shipped"}
                    </button>
                  </div>
                </section>
              ) : null}

              {selectedOrder.shipping_carrier ||
              selectedOrder.tracking_number ? (
                <section className="rounded-3xl border border-blue-300/18 bg-blue-300/[0.05] p-5">
                  <h3 className="text-lg font-bold">
                    Shipping
                  </h3>

                  <div className="mt-4 space-y-2 text-sm">
                    <div>
                      <span className="text-white/40">
                        Carrier:
                      </span>{" "}
                      <span className="font-semibold">
                        {selectedOrder.shipping_carrier ||
                          "Not set"}
                      </span>
                    </div>

                    <div>
                      <span className="text-white/40">
                        Tracking:
                      </span>{" "}
                      <span className="font-semibold">
                        {selectedOrder.tracking_number ||
                          "Not set"}
                      </span>
                    </div>

                    <div>
                      <span className="text-white/40">
                        Estimated delivery:
                      </span>{" "}
                      <span className="font-semibold">
                        {formatDate(
                          selectedOrder.estimated_delivery_date,
                        )}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.tracking_url ? (
                    <a
                      href={selectedOrder.tracking_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-300/20 bg-blue-300/[0.08] px-4 py-2.5 text-xs font-bold text-blue-100"
                    >
                      Open Tracking
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </section>
              ) : null}

              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                  Activity
                </h3>

                <div className="mt-5 space-y-4">
                  {activityLoading ? (
                    <div className="text-sm text-white/40">
                      Loading activity...
                    </div>
                  ) : activity.length === 0 ? (
                    <div className="text-sm text-white/40">
                      No activity recorded yet.
                    </div>
                  ) : (
                    activity.map((event, index) => (
                      <div
                        key={
                          event.id ??
                          `${event.event_type}-${index}`
                        }
                        className="flex gap-3"
                      >
                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300" />

                        <div>
                          <div className="text-sm font-bold">
                            {event.title}
                          </div>

                          {event.detail ? (
                            <div className="mt-1 text-sm leading-6 text-white/52">
                              {event.detail}
                            </div>
                          ) : null}

                          <div className="mt-1 text-xs text-white/30">
                            {formatDateTime(event.created_at)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5">
                <button
                  type="button"
                  onClick={() => {
                    setCorrectionOpen((current) => !current);
                    setCorrectionStatus(selectedOrder.status);
                    setCorrectionReason("");
                    setDrawerError("");
                  }}
                  className="text-sm font-bold text-white/65 transition hover:text-white"
                >
                  {correctionOpen
                    ? "Cancel Stage Correction"
                    : "Correct Order Stage"}
                </button>

                {correctionOpen ? (
                  <div className="mt-5 space-y-4 border-t border-white/[0.07] pt-5">
                    <p className="text-sm leading-6 text-white/50">
                      Use this only to correct a mistake or handle an
                      exception. The change will be recorded in activity
                      history.
                    </p>

                    <label className="block">
                      <span className="text-xs font-semibold text-white/55">
                        Correct stage
                      </span>

                      <select
                        value={correctionStatus}
                        onChange={(event) =>
                          setCorrectionStatus(
                            event.target.value as GuardianStatus,
                          )
                        }
                        className="mt-2 min-h-12 w-full rounded-2xl border border-white/[0.1] bg-[#07111f] px-4 py-3 text-sm font-semibold text-white outline-none focus:border-cyan-300/45"
                      >
                        {stageOptions
                          .filter(
                            (
                              option,
                            ): option is {
                              value: GuardianStatus;
                              label: string;
                            } => option.value !== "all",
                          )
                          .map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-xs font-semibold text-white/55">
                        Reason, optional
                      </span>

                      <textarea
                        value={correctionReason}
                        onChange={(event) =>
                          setCorrectionReason(event.target.value)
                        }
                        placeholder="Example: Payment was marked verified by mistake."
                        rows={3}
                        className="mt-2 w-full resize-none rounded-2xl border border-white/[0.1] bg-[#07111f] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-300/45"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => void correctOrderStage()}
                      disabled={
                        saving ||
                        correctionStatus === selectedOrder.status
                      }
                      className="min-h-12 w-full rounded-2xl border border-amber-300/25 bg-amber-300/[0.1] px-5 py-3 text-sm font-bold text-amber-100 transition hover:bg-amber-300/[0.16] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {saving
                        ? "Correcting Stage..."
                        : "Confirm Stage Correction"}
                    </button>
                  </div>
                ) : null}
              </section>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
