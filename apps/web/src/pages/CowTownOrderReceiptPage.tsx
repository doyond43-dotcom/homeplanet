import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  cowTownPlans,
  formatCowTownMoney,
} from "../config/cowTownPricing";
import { supabase } from "../lib/supabase";
import "./CowTownOrderReceiptPage.css";

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
  const [receipt, setReceipt] =
    useState<CowTownReceipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

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
          <div>
            <p>Next step</p>
            <h2>Secure payment is being connected next.</h2>
            <span>
              Your order and batch are safely recorded. Nothing
              has been charged yet. The payment action will live
              directly on this receipt page.
            </span>
          </div>

          <button type="button" onClick={loadReceipt}>
            Refresh Order Status
          </button>
        </section>
      </section>
    </main>
  );
}