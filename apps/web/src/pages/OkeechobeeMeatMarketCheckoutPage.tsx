import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type CheckoutProduct = {
  id: string;
  seller_listing_id: string;
  seller_name: string;
  name: string;
  price: string;
  package: string;
  checkout_price: number | string | null;
  fulfillment: string;
  availability: string;
  description: string;
  image_url: string;
  quantity_available: string;
};

function parseMoney(value: string) {
  const match = String(value || "").match(/(\d+(?:\.\d{1,2})?)/);
  return match ? Number(match[1]) : NaN;
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function fulfillmentChoices(value: string) {
  const clean = String(value || "").toLowerCase();
  const choices: string[] = [];

  if (clean.includes("pickup")) choices.push("Pickup");
  if (clean.includes("delivery")) choices.push("Delivery");

  return choices.length ? choices : ["Pickup"];
}

export default function OkeechobeeMeatMarketCheckoutPage() {
  const [searchParams] = useSearchParams();

  const sellerSlug = String(
    searchParams.get("seller") || ""
  ).trim();

  const productId = String(
    searchParams.get("product") || ""
  ).trim();

  const [product, setProduct] =
    useState<CheckoutProduct | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [fulfillment, setFulfillment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentProvider, setPaymentProvider] = useState("");
  const [paymentDestination, setPaymentDestination] = useState("");
  const [checkoutEnabled, setCheckoutEnabled] = useState(false);

  useEffect(() => {
    async function loadCheckout() {
      if (!sellerSlug || !productId) {
        setError("This checkout link is incomplete.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data, error: productError } = await supabase
          .from("okeechobee_meat_market_products")
          .select(
            "id,seller_listing_id,seller_name,name,price,package,checkout_price,fulfillment,availability,description,image_url,quantity_available,status"
          )
          .eq("id", productId)
          .eq("seller_listing_id", sellerSlug)
          .eq("status", "Active")
          .maybeSingle();

        if (productError) {
          throw productError;
        }

        if (!data) {
          throw new Error(
            "This product is not available for checkout."
          );
        }

        if (
          String(data.availability || "")
            .trim()
            .toLowerCase() !== "available now"
        ) {
          throw new Error(
            "This product is not currently available."
          );
        }

        const nextProduct = data as CheckoutProduct;

        setProduct(nextProduct);

        const sellerResponse = await fetch(
          `/api/okeechobee-meat-market?route=seller-manage&slug=${encodeURIComponent(
            sellerSlug
          )}`
        );

        const sellerResult = await sellerResponse
          .json()
          .catch(() => null);

        if (
          !sellerResponse.ok ||
          sellerResult?.ok !== true ||
          !sellerResult?.seller
        ) {
          throw new Error(
            "Seller checkout settings could not be loaded."
          );
        }

        const checkoutSeller = sellerResult.seller;

        if (!checkoutSeller.checkoutEnabled) {
          throw new Error(
            "This seller is not currently accepting checkout orders."
          );
        }

        setCheckoutEnabled(true);
        setPaymentProvider(
          String(checkoutSeller.paymentProvider || "").trim()
        );
        setPaymentDestination(
          String(checkoutSeller.paymentDestination || "").trim()
        );

        const choices = fulfillmentChoices(
          nextProduct.fulfillment
        );

        setFulfillment(choices[0]);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load checkout."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCheckout();
  }, [productId, sellerSlug]);

  const unitPrice = useMemo(() => {
    const value = Number(product?.checkout_price);

    return Number.isFinite(value) && value > 0
      ? value
      : NaN;
  }, [product?.checkout_price]);

  const total = Number.isFinite(unitPrice)
    ? unitPrice * quantity
    : NaN;

  const choices = fulfillmentChoices(
    product?.fulfillment || ""
  );

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>Loading checkout...</div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <div style={styles.marketLabel}>
            OKEECHOBEE LIVE MEAT MARKET
          </div>

          <h1 style={styles.title}>Checkout unavailable</h1>

          <p style={styles.muted}>
            {error || "This product could not be loaded."}
          </p>

          <Link
            to={`/planet/okeechobee/meat-market/seller/${sellerSlug}`}
            style={styles.backButton}
          >
            Back to seller
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.checkout}>
        <div style={styles.marketLabel}>
          OKEECHOBEE LIVE MEAT MARKET
        </div>

        <div style={styles.sellerName}>
          {product.seller_name}
        </div>

        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={styles.image}
          />
        ) : null}

        <section style={styles.card}>
          <h1 style={styles.title}>{product.name}</h1>

          {product.description ? (
            <p style={styles.muted}>
              {product.description}
            </p>
          ) : null}

          <div style={styles.details}>
            <div>
              <span style={styles.detailLabel}>Package</span>
              <strong>
                {product.package || "Seller package"}
              </strong>
            </div>

            <div>
              <span style={styles.detailLabel}>Price</span>
              <strong>{product.price}</strong>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Quantity</h2>

          <div style={styles.quantityRow}>
            <button
              type="button"
              onClick={() =>
                setQuantity((current) =>
                  Math.max(1, current - 1)
                )
              }
              style={styles.quantityButton}
            >
              -
            </button>

            <div style={styles.quantityValue}>
              {quantity}
            </div>

            <button
              type="button"
              onClick={() =>
                setQuantity((current) =>
                  Math.min(99, current + 1)
                )
              }
              style={styles.quantityButton}
            >
              +
            </button>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            How do you want it?
          </h2>

          <div style={styles.choiceRow}>
            {choices.map((choice) => (
              <button
                key={choice}
                type="button"
                onClick={() => setFulfillment(choice)}
                style={
                  fulfillment === choice
                    ? styles.choiceActive
                    : styles.choice
                }
              >
                {choice}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.totalCard}>
          <div>
            <div style={styles.totalLabel}>Total</div>
            <div style={styles.totalSub}>
              {quantity} x {product.package || product.name}
            </div>
          </div>

          <div style={styles.totalValue}>
            {Number.isFinite(total)
              ? money(total)
              : product.price}
          </div>
        </section>

        {paymentMessage ? (
          <div style={styles.notice}>{paymentMessage}</div>
        ) : null}

        {!Number.isFinite(unitPrice) ? (
          <div style={styles.notice}>
            This product does not have an exact checkout price yet.
            Please return to the seller page for ordering options.
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              setPaymentMessage(
                "Your order is ready. Seller-owned payment connection comes next."
              )
            }
            style={styles.payButton}
          >
            Continue to Payment
          </button>
        )}

        <Link
          to={`/planet/okeechobee/meat-market/seller/${sellerSlug}`}
          style={styles.cancelLink}
        >
          Back to {product.seller_name}
        </Link>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #07110b 0%, #0d1911 100%)",
    color: "#fff",
    padding: "24px 16px 60px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  checkout: {
    width: "100%",
    maxWidth: 620,
    margin: "0 auto",
  },

  marketLabel: {
    color: "#d7b96d",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.4,
    marginBottom: 8,
  },

  sellerName: {
    fontSize: 15,
    fontWeight: 800,
    color: "rgba(255,255,255,.72)",
    marginBottom: 18,
  },

  image: {
    width: "100%",
    maxHeight: 330,
    objectFit: "cover",
    borderRadius: 24,
    marginBottom: 16,
    border: "1px solid rgba(255,255,255,.08)",
  },

  card: {
    background: "rgba(255,255,255,.055)",
    border: "1px solid rgba(255,255,255,.09)",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
    boxShadow: "0 14px 38px rgba(0,0,0,.18)",
  },

  title: {
    fontSize: "clamp(28px, 8vw, 42px)",
    lineHeight: 1,
    margin: "0 0 12px",
    fontWeight: 950,
  },

  sectionTitle: {
    fontSize: 19,
    margin: "0 0 16px",
    fontWeight: 900,
  },

  muted: {
    color: "rgba(255,255,255,.68)",
    lineHeight: 1.55,
    margin: 0,
  },

  details: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 20,
  },

  detailLabel: {
    display: "block",
    color: "rgba(255,255,255,.48)",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 5,
  },

  quantityRow: {
    display: "grid",
    gridTemplateColumns: "64px 1fr 64px",
    gap: 10,
    alignItems: "center",
  },

  quantityButton: {
    height: 58,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(255,255,255,.07)",
    color: "#fff",
    fontSize: 28,
    fontWeight: 900,
    cursor: "pointer",
  },

  quantityValue: {
    height: 58,
    borderRadius: 16,
    background: "#fff",
    color: "#0a130d",
    display: "grid",
    placeItems: "center",
    fontSize: 24,
    fontWeight: 950,
  },

  choiceRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },

  choice: {
    flex: "1 1 130px",
    minHeight: 52,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(255,255,255,.05)",
    color: "#fff",
    fontWeight: 850,
    cursor: "pointer",
  },

  choiceActive: {
    flex: "1 1 130px",
    minHeight: 52,
    borderRadius: 16,
    border: "1px solid #d7b96d",
    background: "#d7b96d",
    color: "#122016",
    fontWeight: 950,
    cursor: "pointer",
  },

  totalCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    background: "#fff",
    color: "#0a130d",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },

  totalLabel: {
    fontSize: 13,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    opacity: 0.55,
  },

  totalSub: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.65,
  },

  totalValue: {
    fontSize: 30,
    fontWeight: 950,
    whiteSpace: "nowrap",
  },

  payButton: {
    width: "100%",
    minHeight: 62,
    border: 0,
    borderRadius: 18,
    background: "#d7b96d",
    color: "#112016",
    fontSize: 18,
    fontWeight: 950,
    cursor: "pointer",
    marginTop: 2,
  },

  notice: {
    background: "rgba(215,185,109,.11)",
    border: "1px solid rgba(215,185,109,.35)",
    color: "#f4dfaa",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    lineHeight: 1.45,
  },

  cancelLink: {
    display: "block",
    textAlign: "center",
    color: "rgba(255,255,255,.65)",
    marginTop: 18,
    textDecoration: "none",
    fontWeight: 750,
  },

  backButton: {
    display: "inline-block",
    marginTop: 20,
    color: "#112016",
    background: "#d7b96d",
    padding: "13px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 900,
  },
};
