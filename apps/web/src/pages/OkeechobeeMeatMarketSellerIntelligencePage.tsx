import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type ProductActivity = {
  name: string;
  clicks: number;
};

type Summary = {
  storefrontViews: number;
  productClicks: number;
  buyerHandoffs: number;
  topProducts: ProductActivity[];
};

type Analytics = {
  sevenDays: Summary;
  allTime: Summary;
};

export default function OkeechobeeMeatMarketSellerIntelligencePage() {
  const { slug } = useParams();

  const [token] = useState(() =>
    window.location.hash.replace(/^#/, "").trim()
  );

  const [sellerName, setSellerName] = useState("");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [period, setPeriod] =
    useState<"sevenDays" | "allTime">("sevenDays");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug || !token) {
      setError("Open Intelligence from your private seller dashboard.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(
          "/api/okeechobee-meat-market?route=seller-manage",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "load",
              slug,
              token
            }),
            signal: controller.signal
          }
        );

        const result = await response.json();

        if (!response.ok || result.ok !== true) {
          throw new Error(
            result.error || "Could not load Seller Intelligence."
          );
        }

        if (!result.analytics) {
          throw new Error("Seller analytics are unavailable.");
        }

        setSellerName(result.seller?.name || "");
        setAnalytics(result.analytics);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load Seller Intelligence."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [slug, token]);

  const active = analytics?.[period];

  const panel: React.CSSProperties = {
    background: "#26372d",
    border: "1px solid #465b49",
    borderRadius: 16,
    padding: 20
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#101a13",
      color: "#f7f4e8",
      padding: "28px 16px 70px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Link
          to={
            "/planet/okeechobee/meat-market/seller/setup/" +
            slug + "#" + token
          }
          style={{
            color: "#d8b75f",
            textDecoration: "none",
            fontWeight: 700
          }}
        >
← Back to Seller Dashboard
        </Link>

        <header style={{ margin: "32px 0" }}>
          <p style={{
            color: "#d8b75f",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 2
          }}>
            OKEECHOBEE LIVE MARKET
          </p>

          <h1 style={{ fontSize: 34, marginBottom: 8 }}>
            Seller Intelligence
          </h1>

          <p style={{ color: "#bcc9bd" }}>
            {sellerName || "Your Business"} — Storefront performance
          </p>
        </header>

        {loading && <p>Loading Seller Intelligence...</p>}

        {error && (
          <p role="alert" style={{ color: "#ffb4a8" }}>
            {error}
          </p>
        )}

        {active && (
          <>
            <div style={{
              display: "flex",
              gap: 8,
              marginBottom: 22
            }}>
              {([
                ["sevenDays", "Last 7 Days"],
                ["allTime", "All Time"]
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={period === key}
                  onClick={() => setPeriod(key)}
                  style={{
                    border: "1px solid #75806a",
                    borderRadius: 9,
                    padding: "11px 16px",
                    background:
                      period === key ? "#d8b75f" : "#26372d",
                    color: period === key ? "#17231b" : "#fff",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 12,
              marginBottom: 20
            }}>
              {[
                ["Storefront Views", active.storefrontViews],
                ["Product Clicks", active.productClicks],
                ["Buyer Handoffs", active.buyerHandoffs]
              ].map(([label, value]) => (
                <div key={label} style={panel}>
                  <div style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: "#d8b75f"
                  }}>
                    {value}
                  </div>
                  <p style={{ marginBottom: 0 }}>{label}</p>
                </div>
              ))}
            </div>

            <section style={panel}>
              <h2 style={{ marginTop: 0 }}>
                Products Getting Attention
              </h2>
              <p style={{ color: "#bcc9bd" }}>
                Product clicks during the selected period.
              </p>

              {active.topProducts.length === 0 ? (
                <p style={{ color: "#bcc9bd" }}>
                  No product clicks recorded yet.
                </p>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {active.topProducts.map((product, index) => (
                    <div
                      key={product.name + "-" + index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 12px",
                        borderRadius: 10,
                        background: "#34473a"
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>
                        {index + 1}. {product.name}
                      </span>
                      <strong style={{
                        color: "#d8b75f",
                        whiteSpace: "nowrap"
                      }}>
                        {product.clicks}
                        {product.clicks === 1 ? " click" : " clicks"}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <p style={{
              color: "#aebcaf",
              fontSize: 13,
              lineHeight: 1.6,
              marginTop: 22
            }}>
              Storefront views, product clicks, and buyer handoffs
              are activity signals. They do not necessarily
              represent unique buyers or completed sales.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
