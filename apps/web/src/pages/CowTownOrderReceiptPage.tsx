import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  cowTownPlans,
  formatCowTownMoney,
} from "../config/cowTownPricing";
import { supabase } from "../lib/supabase";
import "./CowTownOrderReceiptPage.css";

const CASH_APP_CASHTAG = "$homeplanetsystems";
const ZELLE_CONTACT = "dannyscandys@gmail.com";

function buildCashAppUrl(amount: number, memo: string) {
  const cashtag = CASH_APP_CASHTAG.replace("$", "");
  const params = new URLSearchParams();

  params.set("amount", amount.toFixed(2));
  params.set("note", memo);

  return `https://cash.app/${cashtag}?${params.toString()}`;
}

type CowTownReceipt = {
  order_id: string;
  order_number: string;
  status: string;
  plan_id: string;
  active_animal_limit: number | null;
  monthly_plan_amount: number | null;
  full_tag_quantity: number;
  sticker_quantity: number;
  batch_method: string;
  starting_number: string | null;
  ending_number: string | null;
  merchandise_total: number;
  shipping_amount: number;
  one_time_total: number;
  shipping_city: string;
  shipping_state: string;
  shipping_carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  estimated_delivery: string | null;
  created_at: string;
  ranch: {
    id: string;
    name: string;
    contact_name: string;
    email: string;
  };
  batch: {
    id: string;
    batch_number: string;
    status: string;
    expected_assignment_count: number;
  };
};

const orderStatusLabels: Record<string, string> = {
  pending_payment: "Order received",
  payment_processing: "Payment processing",
  payment_submitted: "Payment submitted",
  payment_verified: "Payment verified",
  batch_setup: "Batch setup",
  in_production: "In production",
  qr_verification: "QR verification",
  activated: "Tags activated",
  ready_to_ship: "Ready to ship",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  problem_detected: "Needs attention",
};

const batchStatusLabels: Record<string, string> = {
  draft: "Batch created",
  awaiting_animal_numbers: "Waiting for animal numbers",
  ready_for_production: "Ready for production",
  in_production: "In production",
  ready_for_verification: "Ready for QR verification",
  qr_verified: "QR codes verified",
  activated: "Assignments activated",
  ready_to_ship: "Ready to ship",
  shipped: "Shipped",
  completed: "Completed",
  problem_detected: "Needs attention",
};

function labelStatus(
  status: string,
  labels: Record<string, string>,
) {
  return (
    labels[status] ??
    status
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(" ")
  );
}

export default function CowTownOrderReceiptPage() {
  const { accessToken } = useParams();
  const [searchParams] = useSearchParams();
  const paypalCaptureStarted = useRef(false);
  const [receipt, setReceipt] =
    useState<CowTownReceipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isStartingPayPal, setIsStartingPayPal] = useState(false);
  const [isCapturingPayPal, setIsCapturingPayPal] = useState(false);
  const [manualPaymentOpen, setManualPaymentOpen] = useState(false);
  const [manualPaymentSubmitted, setManualPaymentSubmitted] =
    useState(false);

  const loadReceipt = useCallback(async () => {
    if (!accessToken) {
      setLoadError("This Cow Town receipt link is incomplete.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError("");

    const { data, error } = await supabase.rpc(
      "get_cow_town_order_receipt",
      {
        requested_access_token: accessToken,
      },
    );

    if (error) {
      setLoadError(error.message);
      setIsLoading(false);
      return;
    }

    if (!data) {
      setLoadError(
        "We could not find a Cow Town order for this private receipt link.",
      );
      setIsLoading(false);
      return;
    }

    setReceipt(data as CowTownReceipt);
    setIsLoading(false);
  }, [accessToken]);

  useEffect(() => {
    void loadReceipt();
  }, [loadReceipt]);

  useEffect(() => {
    const paypalFlow = searchParams.get("paypal");
    const paypalOrderId = searchParams.get("token");

    if (!paypalFlow || !accessToken) return;

    const cleanPayPalQuery = () => {
      const cleanUrl = new URL(window.location.href);

      cleanUrl.searchParams.delete("paypal");
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("PayerID");

      window.history.replaceState(
        {},
        document.title,
        `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`,
      );
    };

    if (paypalFlow === "cancel") {
      setPaymentError(
        "PayPal checkout was canceled. Your Cow Town order is still saved.",
      );
      cleanPayPalQuery();
      return;
    }

    const storedCheckoutRaw = window.localStorage.getItem(
      "cow-town-paypal-checkout",
    );

    let storedCheckout: {
      orderId?: string;
      customerAccessToken?: string;
    } | null = null;

    try {
      storedCheckout = storedCheckoutRaw
        ? JSON.parse(storedCheckoutRaw)
        : null;
    } catch {
      storedCheckout = null;
    }

    const storedOrderId = storedCheckout?.orderId?.trim() || "";
    const storedAccessToken =
      storedCheckout?.customerAccessToken?.trim() || "";

    if (
      paypalFlow !== "return" ||
      !paypalOrderId ||
      !storedOrderId ||
      !storedAccessToken ||
      paypalCaptureStarted.current
    ) {
      return;
    }

    paypalCaptureStarted.current = true;
    setPaymentError("");
    setIsCapturingPayPal(true);

    void (async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "paypal-capture-order",
          {
            body: {
              order_id: storedOrderId,
              customer_access_token: storedAccessToken,
              paypal_order_id: paypalOrderId,
            },
          },
        );

        if (error) throw error;

        if (!data?.ok) {
          throw new Error(
            data?.error || "PayPal payment could not be verified.",
          );
        }

        window.localStorage.removeItem(
          "cow-town-paypal-checkout",
        );

        cleanPayPalQuery();
        await loadReceipt();
      } catch (error) {
        paypalCaptureStarted.current = false;

        setPaymentError(
          error instanceof Error && error.message
            ? error.message
            : "Your PayPal approval was received, but HomePlanet could not verify the payment. Your Cow Town order is still saved.",
        );
      } finally {
        setIsCapturingPayPal(false);
      }
    })();
  }, [accessToken, loadReceipt, searchParams]);

  async function ensureCheckout() {
    if (!receipt || !accessToken) {
      throw new Error("This Cow Town receipt is incomplete.");
    }

    const { error } = await supabase.rpc(
      "create_cow_town_homeplanet_checkout",
      {
        requested_order_number: receipt.order_number,
        requested_access_token: accessToken,
      },
    );

    if (error) throw error;
  }

  async function startPayPalCheckout() {
    if (!receipt || !accessToken || isStartingPayPal) return;

    setPaymentError("");
    setIsStartingPayPal(true);

    try {
      await ensureCheckout();

      const returnUrl = new URL(window.location.href);
      returnUrl.searchParams.set("paypal", "return");
      returnUrl.searchParams.delete("token");
      returnUrl.searchParams.delete("PayerID");

      const cancelUrl = new URL(window.location.href);
      cancelUrl.searchParams.set("paypal", "cancel");
      cancelUrl.searchParams.delete("token");
      cancelUrl.searchParams.delete("PayerID");

      window.localStorage.setItem(
        "cow-town-paypal-checkout",
        JSON.stringify({
          orderId: receipt.order_number,
          customerAccessToken: accessToken,
        }),
      );

      const { data, error } = await supabase.functions.invoke(
        "paypal-create-order",
        {
          body: {
            order_id: receipt.order_number,
            customer_access_token: accessToken,
            return_url: returnUrl.toString(),
            cancel_url: cancelUrl.toString(),
          },
        },
      );

      if (error) throw error;

      if (!data?.ok || !data?.approval_url) {
        throw new Error(
          data?.error || "PayPal did not return a checkout link.",
        );
      }

      window.location.assign(data.approval_url);
    } catch (error) {
      setPaymentError(
        error instanceof Error && error.message
          ? error.message
          : "Your Cow Town order is saved, but PayPal checkout could not be started.",
      );

      setIsStartingPayPal(false);
    }
  }

  async function submitManualPayment(
    method: "cash_app" | "zelle",
  ) {
    if (!accessToken) return;

    setPaymentError("");

    try {
      await ensureCheckout();

      const { error } = await supabase.rpc(
        "submit_homeplanet_manual_payment",
        {
          requested_access_token: accessToken,
          requested_payment_method: method,
        },
      );

      if (error) throw error;

      setManualPaymentSubmitted(true);
      await loadReceipt();
    } catch (error) {
      setPaymentError(
        error instanceof Error && error.message
          ? error.message
          : "Your order is saved, but the manual payment submission could not be recorded.",
      );
    }
  }

  if (isLoading) {
    return (
      <main className="ct-receipt-page">
        <section className="ct-receipt-shell">
          <p className="ct-receipt-kicker">Cow Town Tags</p>
          <h1>Opening your ranch order...</h1>
          <p>
            We are loading the secure order and first batch record.
          </p>
        </section>
      </main>
    );
  }

  if (loadError || !receipt) {
    return (
      <main className="ct-receipt-page">
        <section className="ct-receipt-shell">
          <p className="ct-receipt-kicker">Cow Town Tags</p>
          <h1>We could not open this receipt.</h1>
          <p>{loadError}</p>

          <div className="ct-receipt-actions">
            <button type="button" onClick={loadReceipt}>
              Try Again
            </button>

            <Link to="/planet/cow-town-tags">
              Back to Cow Town Tags
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const selectedPlan = cowTownPlans.find(
    (plan) => plan.id === receipt.plan_id,
  );

  const orderStatus = labelStatus(
    receipt.status,
    orderStatusLabels,
  );

  const batchStatus = labelStatus(
    receipt.batch.status,
    batchStatusLabels,
  );

  const batchDescription =
    receipt.batch_method === "sequence" &&
    receipt.starting_number &&
    receipt.ending_number
      ? `${receipt.starting_number} through ${receipt.ending_number}`
      : receipt.batch_method === "enter-now"
        ? "Animal numbers submitted with order"
        : "Animal numbers will be submitted later";

  return (
    <main className="ct-receipt-page">
      <section className="ct-receipt-shell">
        <Link
          className="ct-receipt-back"
          to="/planet/cow-town-tags"
        >
          ← Back to Cow Town Tags
        </Link>

        <header className="ct-receipt-hero">
          <div>
            <p className="ct-receipt-kicker">
              Living Cow Town order
            </p>
            <h1>Your first ranch batch is created.</h1>
            <p>
              Keep this private link. This page will show payment,
              production, activation, shipping, and delivery
              progress as the order moves forward.
            </p>
          </div>

          <div className="ct-receipt-status">
            <span>Current order status</span>
            <strong>{orderStatus}</strong>
            <small>Order {receipt.order_number}</small>
          </div>
        </header>

        <section className="ct-receipt-progress">
          <article className="is-current">
            <span>1</span>
            <div>
              <strong>Order received</strong>
              <small>
                Ranch and first batch records created
              </small>
            </div>
          </article>

          <article>
            <span>2</span>
            <div>
              <strong>Payment</strong>
              <small>Secure payment connects next</small>
            </div>
          </article>

          <article>
            <span>3</span>
            <div>
              <strong>Production</strong>
              <small>Tags prepared and QR codes verified</small>
            </div>
          </article>

          <article>
            <span>4</span>
            <div>
              <strong>Shipping</strong>
              <small>Tracking appears here after shipment</small>
            </div>
          </article>
        </section>

        <section className="ct-receipt-grid">
          <article>
            <span>Ranch</span>
            <strong>{receipt.ranch.name}</strong>
            <small>{receipt.ranch.contact_name}</small>
            <b>{receipt.ranch.email}</b>
          </article>

          <article>
            <span>Ranch plan</span>
            <strong>
              {selectedPlan?.name ?? receipt.plan_id}
            </strong>
            <small>
              {receipt.active_animal_limit === null
                ? "Enterprise capacity"
                : `Up to ${receipt.active_animal_limit.toLocaleString()} active animals`}
            </small>
            <b>
              {receipt.monthly_plan_amount === null
                ? "Custom monthly plan"
                : `${formatCowTownMoney(receipt.monthly_plan_amount)}/month`}
            </b>
          </article>

          <article>
            <span>First batch</span>
            <strong>
              {receipt.batch.expected_assignment_count} assignments
            </strong>
            <small>{batchDescription}</small>
            <b>{batchStatus}</b>
          </article>

          <article>
            <span>Products</span>
            <strong>
              {receipt.full_tag_quantity} full tags
            </strong>
            <small>
              {receipt.sticker_quantity} sticker upgrades
            </small>
            <b>
              Batch {receipt.batch.batch_number}
            </b>
          </article>

          <article>
            <span>Shipping destination</span>
            <strong>
              {receipt.shipping_city},{" "}
              {receipt.shipping_state}
            </strong>
            <small>
              Tracking will appear after shipment
            </small>
            <b>
              {receipt.tracking_number ??
                "Not shipped yet"}
            </b>
          </article>

          <article>
            <span>Order created</span>
            <strong>
              {new Date(receipt.created_at).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                },
              )}
            </strong>
            <small>Private living receipt</small>
            <b>{receipt.order_number}</b>
          </article>
        </section>

        <section className="ct-receipt-totals">
          <div>
            <span>Physical products</span>
            <strong>
              {formatCowTownMoney(receipt.merchandise_total)}
            </strong>
          </div>

          <div>
            <span>Shipping</span>
            <strong>
              {receipt.shipping_amount === 0
                ? "Included"
                : formatCowTownMoney(
                    receipt.shipping_amount,
                  )}
            </strong>
          </div>

          <div className="is-emphasized">
            <span>One-time order</span>
            <strong>
              {formatCowTownMoney(receipt.one_time_total)}
            </strong>
          </div>

          <div className="is-emphasized">
            <span>Monthly ranch plan</span>
            <strong>
              {receipt.monthly_plan_amount === null
                ? "Custom"
                : formatCowTownMoney(
                    receipt.monthly_plan_amount,
                  )}
            </strong>
          </div>
        </section>

        <section className="ct-receipt-payment">
          <div className="ct-payment-main">
            <p>
              {receipt.status === "payment_verified"
                ? "Payment complete"
                : "Next step"}
            </p>

            <h2>
              {receipt.status === "payment_verified"
                ? "Your payment is verified."
                : isCapturingPayPal
                  ? "Verifying your PayPal payment..."
                  : "Pay securely with PayPal."}
            </h2>

            <span>
              {receipt.status === "payment_verified"
                ? "Your first Cow Town batch can now move into production, QR verification, activation, and shipping."
                : "Your order and ranch batch are safely saved. PayPal will return you here automatically after approval."}
            </span>

            {paymentError ? (
              <div className="ct-payment-error" role="alert">
                {paymentError}
              </div>
            ) : null}

            {manualPaymentSubmitted ? (
              <div className="ct-payment-success">
                Manual payment marked as submitted. Verification
                is still required before production begins.
              </div>
            ) : null}
          </div>

          <div className="ct-payment-actions">
            {receipt.status === "payment_verified" ||
            receipt.status === "batch_setup" ||
            receipt.status === "in_production" ||
            receipt.status === "qr_verification" ||
            receipt.status === "activated" ||
            receipt.status === "ready_to_ship" ||
            receipt.status === "shipped" ||
            receipt.status === "delivered" ||
            receipt.status === "completed" ? (
              <button type="button" onClick={loadReceipt}>
                Refresh Order Status
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="ct-paypal-button"
                  onClick={() => void startPayPalCheckout()}
                  disabled={
                    isStartingPayPal || isCapturingPayPal
                  }
                >
                  {isCapturingPayPal
                    ? "Verifying PayPal..."
                    : isStartingPayPal
                      ? "Opening PayPal..."
                      : `Pay ${formatCowTownMoney(receipt.one_time_total)} with PayPal`}
                </button>

                <small className="ct-paypal-note">
                  PayPal is the primary secure checkout.
                </small>

                <button
                  type="button"
                  className="ct-manual-toggle"
                  onClick={() =>
                    setManualPaymentOpen((current) => !current)
                  }
                  aria-expanded={manualPaymentOpen}
                >
                  <span>
                    <strong>Other payment options</strong>
                    <small>Cash App or Zelle</small>
                  </span>

                  <b>{manualPaymentOpen ? "?" : "+"}</b>
                </button>

                {manualPaymentOpen ? (
                  <div className="ct-manual-options">
                    <article>
                      <strong>Cash App</strong>
                      <span>{CASH_APP_CASHTAG}</span>

                      <a
                        href={buildCashAppUrl(
                          receipt.one_time_total,
                          `${receipt.order_number} ? Cow Town Tags`,
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Cash App
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          void submitManualPayment("cash_app")
                        }
                      >
                        I Sent the Cash App Payment
                      </button>
                    </article>

                    <article>
                      <strong>Zelle</strong>
                      <span>{ZELLE_CONTACT}</span>
                      <small>
                        Memo: {receipt.order_number} ? Cow Town Tags
                      </small>

                      <button
                        type="button"
                        onClick={() =>
                          void navigator.clipboard.writeText(
                            `Send ${formatCowTownMoney(receipt.one_time_total)} to ${ZELLE_CONTACT} | Memo: ${receipt.order_number} ? Cow Town Tags`,
                          )
                        }
                      >
                        Copy Zelle Details
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void submitManualPayment("zelle")
                        }
                      >
                        I Sent the Zelle Payment
                      </button>
                    </article>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}