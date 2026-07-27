import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type GuardianStatus =
  | "pending_payment"
  | "payment_submitted"
  | "payment_verified"
  | "tag_preparation"
  | "tag_activated"
  | "ready_to_ship"
  | "shipped"
  | "delivered";

type PetProfile = {
  name?: string;
  type?: string;
  breed?: string;
  age?: string;
  color?: string;
  notes?: string;
  publicId?: string;
  ownerToken?: string;
};

type CustomerOrder = {
  order_id: string;
  customer_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  setup_total: number | string | null;
  monthly_total: number | string | null;
  pets: PetProfile[] | null;
  status: GuardianStatus;
  created_at: string;
  payment_submitted_at: string | null;
  payment_verified_at: string | null;
  tag_preparation_at: string | null;
  tag_activated_at: string | null;
  ready_to_ship_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  shipping_carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  estimated_delivery_date: string | null;
};

type HomePlanetCheckout = {
  id: string;
  checkout_reference: string;
  product_type: string;
  product_order_id: string;
  customer_name: string;
  currency: string;
  subtotal_amount: number | string | null;
  discount_amount: number | string | null;
  tax_amount: number | string | null;
  total_amount: number | string | null;
  status: string;
  selected_payment_method: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

type CustomerActivity = {
  event_type: string;
  title: string;
  detail: string | null;
  created_at: string;
};

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

const stages: Array<{
  status: GuardianStatus;
  label: string;
  timestamp:
    | "created_at"
    | "payment_submitted_at"
    | "payment_verified_at"
    | "tag_preparation_at"
    | "tag_activated_at"
    | "ready_to_ship_at"
    | "shipped_at"
    | "delivered_at";
}> = [
  {
    status: "pending_payment",
    label: "Order Received",
    timestamp: "created_at",
  },
  {
    status: "payment_submitted",
    label: "Payment Submitted",
    timestamp: "payment_submitted_at",
  },
  {
    status: "payment_verified",
    label: "Payment Verified",
    timestamp: "payment_verified_at",
  },
  {
    status: "tag_preparation",
    label: "Tag Preparation",
    timestamp: "tag_preparation_at",
  },
  {
    status: "tag_activated",
    label: "Tag Activated",
    timestamp: "tag_activated_at",
  },
  {
    status: "ready_to_ship",
    label: "Ready to Ship",
    timestamp: "ready_to_ship_at",
  },
  {
    status: "shipped",
    label: "Shipped",
    timestamp: "shipped_at",
  },
  {
    status: "delivered",
    label: "Delivered",
    timestamp: "delivered_at",
  },
];

function normalizeCheckout(value: unknown): HomePlanetCheckout | null {
  if (Array.isArray(value)) {
    return (value[0] as HomePlanetCheckout | undefined) ?? null;
  }

  if (value && typeof value === "object") {
    return value as HomePlanetCheckout;
  }

  return null;
}

function normalizeOrder(value: unknown): CustomerOrder | null {
  if (Array.isArray(value)) {
    return (value[0] as CustomerOrder | undefined) ?? null;
  }

  if (value && typeof value === "object") {
    return value as CustomerOrder;
  }

  return null;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDeliveryDate(value: string | null) {
  if (!value) return "Not available";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatPaymentMethod(value: string | null | undefined) {
  if (!value) return "Not selected";

  if (value === "cash_app") return "Cash App";
  if (value === "zelle") return "Zelle";
  if (value === "cash") return "Cash";

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCheckoutStatus(value: string | null | undefined) {
  if (!value) return "Checkout unavailable";

  const labels: Record<string, string> = {
    pending_payment: "Waiting for Payment",
    payment_submitted: "Payment Submitted",
    payment_verified: "Payment Verified",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    labels[value] ||
    value
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

function formatMoney(value: number | string | null) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number.isFinite(amount) ? amount : 0);
}

export default function GuardianPetOrderStatus() {
  const { accessToken } = useParams();

    const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [checkout, setCheckout] =
    useState<HomePlanetCheckout | null>(null);
  const [activity, setActivity] = useState<CustomerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadOrder = useCallback(async () => {
    if (!accessToken) {
      setErrorMessage("This order link is incomplete.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
            const [
        orderResponse,
        guardianActivityResponse,
        checkoutResponse,
        checkoutActivityResponse,
      ] = await Promise.all([
        supabase.rpc("get_guardian_customer_order", {
          requested_access_token: accessToken,
        }),
        supabase.rpc("get_guardian_customer_activity", {
          requested_access_token: accessToken,
        }),
        supabase.rpc("get_homeplanet_checkout", {
          requested_access_token: accessToken,
        }),
        supabase.rpc("get_homeplanet_checkout_activity", {
          requested_access_token: accessToken,
        }),
      ]);

      if (orderResponse.error) {
        throw new Error(orderResponse.error.message);
      }

      if (guardianActivityResponse.error) {
        throw new Error(guardianActivityResponse.error.message);
      }

      if (checkoutResponse.error) {
        throw new Error(checkoutResponse.error.message);
      }

      if (checkoutActivityResponse.error) {
        throw new Error(checkoutActivityResponse.error.message);
      }

      const loadedOrder = normalizeOrder(orderResponse.data);
      const loadedCheckout = normalizeCheckout(checkoutResponse.data);

      if (!loadedOrder) {
        throw new Error("This Pet Tag order could not be found.");
      }

      const guardianActivity = Array.isArray(
        guardianActivityResponse.data,
      )
        ? (guardianActivityResponse.data as CustomerActivity[])
        : [];

      const checkoutActivity = Array.isArray(
        checkoutActivityResponse.data,
      )
        ? (checkoutActivityResponse.data as CustomerActivity[])
        : [];

      const mergedActivity = [
        ...guardianActivity,
        ...checkoutActivity,
      ].sort((left, right) => {
        return (
          new Date(left.created_at).getTime() -
          new Date(right.created_at).getTime()
        );
      });

      setOrder(loadedOrder);
      setCheckout(loadedCheckout);
      setActivity(mergedActivity);
    } catch (error) {
            setOrder(null);
      setCheckout(null);
      setActivity([]);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load this Pet Tag order.",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const pet =
    order && Array.isArray(order.pets)
      ? order.pets[0] ?? null
      : null;

  const currentStageIndex = useMemo(() => {
    if (!order) return 0;

    const index = stages.findIndex(
      (stage) => stage.status === order.status,
    );

    return index < 0 ? 0 : index;
  }, [order]);

  const guardianActivationIndex = stages.findIndex(
    (stage) => stage.status === "tag_activated",
  );

  const guardianIsLive =
    currentStageIndex >= guardianActivationIndex;

  const hasGuardianLinks = Boolean(
    pet?.publicId && pet?.ownerToken,
  );

  const guardianCard = (() => {
    if (!order) return null;

    const petName = pet?.name || "Your pet";

    switch (order.status) {
      case "ready_to_ship":
        return {
          eyebrow: "Guardian Protection Active",
          title: "Your Guardian Is Ready",
          description: `${petName}'s permanent Guardian profile is active, and the physical Pet Tag is ready for shipment.`,
          footer:
            "Your Guardian already exists. The physical tag is the final connection between your pet and this live protection page.",
        };

      case "shipped":
        return {
          eyebrow: "Guardian Live \u2022 Tag On The Way",
          title: "Your Guardian Is Already Working",
          description: `${petName}'s permanent Guardian profile is active while the physical Pet Tag travels to you.`,
          footer:
            "When the tag arrives, attach it to your pet's collar to complete the connection.",
        };

      case "delivered":
        return {
          eyebrow: "Guardian Fully Connected",
          title: "Your Guardian System Is Ready",
          description: `${petName}'s permanent Guardian profile is active, and the physical Pet Tag has been delivered.`,
          footer:
            "Attach the tag to your pet's collar so anyone who finds them can immediately reach this live protection page.",
        };

      case "tag_activated":
      default:
        return {
          eyebrow: "Guardian Protection Active",
          title: "Your Guardian Is Live",
          description: `${petName}'s permanent Guardian profile is now active. You can review the public page and manage important pet information before the physical tag arrives.`,
          footer:
            "Your Guardian already exists. The physical tag is the final connection between your pet and this live protection page.",
        };
    }
  })();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07101c] px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          Loading your Pet Tag order...
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#07101c] px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-red-300/20 bg-red-300/[0.07] p-8 text-center">
          <h1 className="text-2xl font-bold">Order unavailable</h1>

          <p className="mt-3 text-sm text-white/60">
            {errorMessage || "This Pet Tag order could not be loaded."}
          </p>

          <Link
            to="/planet/guardian-pet"
            className="mt-6 inline-flex rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-[#07111f]"
          >
            Guardian Pet Tag
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07101c] px-4 py-6 text-white">
      <div className="mx-auto max-w-2xl">
        <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/70">
                Guardian Pet Tag
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                {pet?.name || "Your Pet Tag"} Order
              </h1>

              <p className="mt-2 text-sm text-white/45">
                {order.order_id}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadOrder()}
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-bold"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.09] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-cyan-100/60">
              Current Status
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-100">
              {statusLabels[order.status]}
            </p>
          </div>
        </header>

        {guardianIsLive && hasGuardianLinks && guardianCard ? (
          <section className="mt-5 overflow-hidden rounded-3xl border border-emerald-300/25 bg-emerald-300/[0.08] p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-100/70">
              {guardianCard.eyebrow}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-emerald-50">
              {guardianCard.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/65">
              {guardianCard.description}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href={`/planet/guardian-pet/pet/${pet?.publicId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-bold text-[#07111f]"
              >
                Preview Guardian Page
                <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href={`/planet/guardian-pet/manage/${pet?.ownerToken}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white"
              >
                Open Owner Dashboard
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-4 text-xs leading-5 text-white/45">
              {guardianCard.footer}
            </p>
          </section>
        ) : null}
                {checkout ? (
          <section className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/[0.07] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.17em] text-cyan-100/60">
                  HomePlanet Checkout
                </p>

                <h2 className="mt-2 text-lg font-bold">
                  {formatCheckoutStatus(checkout.status)}
                </h2>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-right">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                  Checkout Reference
                </p>
                <p className="mt-1 text-xs font-bold text-cyan-100">
                  {checkout.checkout_reference}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/40">Checkout total</p>
                <p className="mt-1 text-lg font-bold">
                  {formatMoney(checkout.total_amount)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/40">Payment method</p>
                <p className="mt-1 text-sm font-bold">
                  {formatPaymentMethod(
                    checkout.selected_payment_method,
                  )}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-white/40">
              Payment and verification activity is recorded in the
              HomePlanet Checkout Truth Chain below.
            </p>
          </section>
        ) : null}

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-lg font-bold">Your Order Journey</h2>

          <p className="mt-2 text-sm leading-6 text-white/50">
            Follow your Pet Tag from the moment your order is received
            through activation, shipping, and delivery.
          </p>

          <div className="mt-5 space-y-4">
            {stages.map((stage, index) => {
              const completed = index < currentStageIndex;
              const current = index === currentStageIndex;
              const timestamp = order[stage.timestamp];

              return (
                <div key={stage.status} className="flex gap-3">
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                      completed
                        ? "border-emerald-300 bg-emerald-300 text-[#07111f]"
                        : current
                          ? "border-cyan-300 bg-cyan-300/10"
                          : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : current ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    ) : null}
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        completed || current
                          ? "text-white"
                          : "text-white/30"
                      }`}
                    >
                      {stage.label}
                    </p>

                    {timestamp ? (
                      <p className="mt-1 text-xs text-white/35">
                        {formatDateTime(timestamp)}
                      </p>
                    ) : current ? (
                      <p className="mt-1 text-xs font-semibold text-cyan-200">
                        Current step
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {order.status === "shipped" ||
        order.status === "delivered" ? (
          <section className="mt-5 rounded-3xl border border-blue-300/20 bg-blue-300/[0.07] p-5">
            <h2 className="text-lg font-bold">Shipping</h2>

            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-white/45">Carrier: </span>
                <span className="font-semibold">
                  {order.shipping_carrier || "Not available"}
                </span>
              </p>

              <p>
                <span className="text-white/45">
                  Tracking number:{" "}
                </span>
                <span className="font-semibold">
                  {order.tracking_number || "Not available"}
                </span>
              </p>

              <p>
                <span className="text-white/45">
                  Estimated delivery:{" "}
                </span>
                <span className="font-semibold">
                  {formatDeliveryDate(
                    order.estimated_delivery_date,
                  )}
                </span>
              </p>
            </div>

            {order.tracking_url ? (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-300 px-5 text-sm font-bold text-[#07111f]"
              >
                Track Package
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </section>
        ) : null}

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-lg font-bold">Order Details</h2>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/40">Setup</p>
              <p className="mt-1 text-lg font-bold">
                {formatMoney(order.setup_total)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/40">Monthly</p>
              <p className="mt-1 text-lg font-bold">
                {formatMoney(order.monthly_total)}/mo
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/40">
              Shipping address
            </p>

            <p className="mt-1 text-sm font-semibold leading-6">
              {order.shipping_address}
              <br />
              {order.shipping_city}, {order.shipping_state}{" "}
              {order.shipping_zip}
            </p>
          </div>

          {pet ? (
            <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] p-4">
              <p className="text-lg font-bold">
                {pet.name || "Pet"}
              </p>

              <p className="mt-1 text-sm leading-6 text-white/55">
                {[pet.type, pet.breed, pet.age, pet.color]
                  .filter(Boolean)
                  .join(" • ")}
              </p>

              {pet.notes ? (
                <p className="mt-3 text-sm leading-6 text-white/45">
                  {pet.notes}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>

        {activity.length > 0 ? (
          <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-cyan-200/60">
              Permanent Order Record
            </p>

            <h2 className="mt-2 text-lg font-bold">
              Your Order Truth Chain
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              Every recorded order, payment, activation, fulfillment,
              and shipping update appears here with the time it happened.
            </p>

            <div className="mt-5 space-y-4">
              {activity.map((event, index) => (
                <div
                  key={`${event.event_type}-${event.created_at}-${index}`}
                  className="flex gap-3"
                >
                  <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300" />

                  <div>
                    <p className="text-sm font-bold">
                      {event.title}
                    </p>

                    {event.detail ? (
                      <p className="mt-1 text-sm leading-6 text-white/50">
                        {event.detail}
                      </p>
                    ) : null}

                    <p className="mt-1 text-xs text-white/30">
                      {formatDateTime(event.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}



