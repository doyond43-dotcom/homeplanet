import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Product = {
  id: number | string;
  name: string;
  price: string;
  package: string;
  fulfillment: string;
  availability: string;
};

const SELLER = "Farm Folks LLC";

function listingDetail(description: string, label: string) {
  const lines = String(description || "").split(/\r?\n/);
  const prefix = `${label}:`.toLowerCase();

  const match = lines.find((line) =>
    line.trim().toLowerCase().startsWith(prefix)
  );

  return match
    ? match.slice(match.indexOf(":") + 1).trim()
    : "";
}

function productImage(name: string) {
  const value = String(name || "").toLowerCase();

  if (value.includes("kefir")) {
    return "/images/farm-folks-kefir.jpg";
  }

  if (
    value.includes("raw milk") ||
    value.includes("raw dairy") ||
    value.includes("milk")
  ) {
    return "/images/farm-folks-raw-milk.jpg";
  }

  if (value.includes("egg")) {
    return "/images/farm-folks-eggs.jpg";
  }

  if (
    value.includes("steak") ||
    value.includes("ribeye") ||
    value.includes("sirloin") ||
    value.includes("filet")
  ) {
    return "/images/farm-folks-steaks.jpg";
  }

  if (value.includes("ancestral")) {
    return "/images/farm-folks-ancestral-blend.jpg";
  }

  if (
    value.includes("ground beef") ||
    value.includes("hamburger")
  ) {
    return "/images/farm-folks-ground-beef.jpg";
  }

  return "/images/farm-folks-beef-cuts.jpg";
}

export default function OkeechobeeMeatMarketFarmFolksPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [listingId, setListingId] = useState<string>("");
  const [location, setLocation] = useState("Okeechobee");
  const [fulfillment, setFulfillment] = useState("Pickup");
  const [sellerLink, setSellerLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorefront() {
      const [
        { data: sellers, error: sellerError },
        { data: productData, error: productError },
      ] = await Promise.all([
        supabase
          .from("okeechobee_events")
          .select("id,title,description,location,status")
          .eq("type", "Live Meat Market Seller")
          .eq("status", "Active"),

        supabase
          .from("okeechobee_meat_market_products")
          .select(
            "id,seller_listing_id,seller_name,name,price,package,fulfillment,availability,status,sort_order"
          )
          .eq("status", "Active")
          .ilike("seller_name", SELLER)
          .order("sort_order", { ascending: true }),
      ]);

      if (sellerError) {
        console.error("Could not load Farm Folks listing:", sellerError);
      }

      if (productError) {
        console.error("Could not load Farm Folks products:", productError);
      }

      const seller = (sellers || []).find((item: any) => {
        const name = String(item.title || "")
          .replace(/^Live Meat Market Seller:\s*/i, "")
          .trim()
          .toLowerCase();

        return name === SELLER.toLowerCase();
      });

      if (seller) {
        setListingId(String(seller.id));

        setLocation(
          String(seller.location || "").trim() || "Okeechobee"
        );

        setFulfillment(
          listingDetail(seller.description, "Pickup / Delivery") ||
            "Contact seller for pickup details"
        );

        const submittedLink = listingDetail(
          seller.description,
          "Website / Facebook / Order Link"
        );

        if (/^https?:\/\//i.test(submittedLink)) {
          setSellerLink(submittedLink);
        } else if (
          submittedLink.includes(".") &&
          !submittedLink.includes(" ")
        ) {
          setSellerLink(`https://${submittedLink}`);
        }
      }

      setProducts(
        (productData || []).map((product: any) => ({
          id: product.id,
          name:
            String(product.name || "").trim() ||
            "Local product",
          price:
            String(product.price || "").trim() ||
            "Contact seller",
          package:
            String(product.package || "").trim(),
          fulfillment:
            String(product.fulfillment || "").trim() ||
            "Pickup",
          availability:
            String(product.availability || "").trim() ||
            "Available now",
        }))
      );

      setLoading(false);
    }

    loadStorefront();
  }, []);

  function orderHref(product: Product) {
    return `/planet/okeechobee/meat-market/contact?${new URLSearchParams({
      mode: "order",
      listingId,
      seller: SELLER,
      product: product.name,
      price: product.price,
      fulfillment: product.fulfillment || fulfillment,
    }).toString()}`;
  }

  return (
    <main className="farm-storefront">
      <style>{
        :root {
          color-scheme: light;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .farm-storefront {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(184,137,65,0.11), transparent 30rem),
            #f7f2e8;
          color: #17231b;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .store-shell {
          width: min(100% - 28px, 1120px);
          margin: 0 auto;
        }

        .store-topbar {
          min-height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-bottom: 1px solid rgba(23,35,27,0.12);
        }

        .back-link,
        .seller-link {
          color: #193c2b;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
        }

        .seller-link {
          padding: 10px 14px;
          border: 1px solid rgba(25,60,43,0.28);
          border-radius: 999px;
        }

        .store-hero {
          padding: 42px 0 24px;
        }

        .hero-image {
          position: relative;
          width: 100%;
          height: clamp(300px, 52vw, 520px);
          overflow: hidden;
          border-radius: 28px;
          background: #193c2b;
          box-shadow: 0 22px 60px rgba(48,39,24,0.11);
        }

        .hero-image img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: auto 0 0;
          padding: clamp(22px, 5vw, 42px);
          background:
            linear-gradient(
              to top,
              rgba(10,26,18,0.88),
              rgba(10,26,18,0.22),
              transparen
            );
          color: white;
        }

        .hero-kicker {
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ead7b2;
        }

        .hero-overlay h1 {
          margin: 10px 0 0;
          font-size: clamp(38px, 7vw, 72px);
          line-height: 0.95;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .hero-meta {
          margin-top: 13px;
          color: rgba(255,255,255,0.82);
          font-size: 15px;
          line-height: 1.5;
          font-weight: 750;
        }

        .intro {
          padding: 18px 0 26px;
          display: grid;
          grid-template-columns: 1.4fr 0.6fr;
          gap: 18px;
          align-items: stretch;
        }

        .intro-main,
        .intro-side {
          padding: 24px;
          border-radius: 22px;
          background: rgba(255,255,255,0.74);
          border: 1px solid rgba(23,35,27,0.11);
        }

        .intro-main h2,
        .products-head h2 {
          margin: 0;
          font-size: clamp(28px, 5vw, 40px);
          letter-spacing: -0.04em;
        }

        .intro-main p {
          margin: 10px 0 0;
          max-width: 720px;
          color: #667068;
          font-size: 15px;
          line-height: 1.55;
          font-weight: 650;
        }

        .intro-label {
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #8a6a38;
        }

        .intro-value {
          margin-top: 8px;
          font-size: 17px;
          line-height: 1.4;
          font-weight: 900;
        }

        .products-section {
          padding: 24px 0 54px;
        }

        .products-head p {
          margin: 8px 0 0;
          color: #667068;
          font-weight: 650;
        }

        .product-grid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .product-card {
          overflow: hidden;
          border-radius: 24px;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(23,35,27,0.11);
          box-shadow: 0 16px 42px rgba(48,39,24,0.07);
        }

        .product-image {
          width: 100%;
          height: 230px;
          display: block;
          object-fit: cover;
          background: #e9dfca;
        }

        .product-body {
          padding: 20px;
        }

        .available {
          display: inline-flex;
          padding: 6px 9px;
          border-radius: 999px;
          background: #edf2ed;
          color: #315640;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .product-name {
          margin: 15px 0 0;
          font-size: 24px;
          line-height: 1.05;
          letter-spacing: -0.035em;
          font-weight: 950;
        }

        .product-price {
          margin-top: 10px;
          font-size: 20px;
          font-weight: 950;
        }

        .product-detail {
          margin-top: 6px;
          min-height: 20px;
          color: #69726c;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 650;
        }

        .order-button {
          display: flex;
          width: 100%;
          min-height: 48px;
          margin-top: 18px;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #193c2b;
          color: white;
          text-decoration: none;
          font-size: 14px;
          font-weight: 950;
        }

        .empty {
          grid-column: 1 / -1;
          padding: 34px;
          border-radius: 22px;
          background: rgba(255,255,255,0.7);
          border: 1px dashed rgba(23,35,27,0.18);
          color: #657068;
          text-align: center;
          font-weight: 750;
        }

        .store-footer {
          padding: 28px 0 40px;
          border-top: 1px solid rgba(23,35,27,0.12);
          color: #667068;
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 820px) {
          .intro {
            grid-template-columns: 1fr;
          }

          .product-grid {
            grid-template-columns: 1fr;
          }

          .hero-image {
            height: 390px;
          }

          .product-image {
            height: 270px;
          }
        }
      `}</style>

      <div className="store-shell">
        <header className="store-topbar">
          <a
            className="back-link"
            href="/planet/okeechobee/meat-market"
          >
            ← Back to Live Meat Marke
          </a>

          {sellerLink ? (
            <a
              className="seller-link"
              href={sellerLink}
              target="_blank"
              rel="noreferrer"
            >
              Seller Website
            </a>
          ) : null}
        </header>

        <section className="store-hero">
          <div className="hero-image">
            <img
              src="/images/farm-folks-hero.jpg"
              alt="Farm Folks LLC ranch"
            />

            <div className="hero-overlay">
              <div className="hero-kicker">
                Okeechobee Live Meat Marke
              </div>

              <h1>Farm Folks LLC</h1>

              <div className="hero-meta">
                {location} • {fulfillment}
              </div>
            </div>
          </div>
        </section>

        <section className="intro">
          <div className="intro-main">
            <h2>From their farm to your table.</h2>
            <p>
              Browse what Farm Folks currently has listed in the Okeechobee
              Live Meat Market. Choose a product below and send your order
              request directly through the market.
            </p>
          </div>

          <div className="intro-side">
            <div className="intro-label">Pickup / Delivery</div>
            <div className="intro-value">{fulfillment}</div>
          </div>
        </section>

        <section className="products-section">
          <div className="products-head">
            <h2>Available Now</h2>
            <p>
              Current products listed by Farm Folks LLC.
            </p>
          </div>

          <div className="product-grid">
            {loading ? (
              <div className="empty">
                Checking what Farm Folks has available...
              </div>
            ) : products.length ? (
              products.map((product) => (
                <article className="product-card" key={product.id}>
                  <img
                    className="product-image"
                    src={productImage(product.name)}
                    alt={product.name}
                  />

                  <div className="product-body">
                    <div className="available">
                      {product.availability || "Available now"}
                    </div>

                    <div className="product-name">
                      {product.name}
                    </div>

                    <div className="product-price">
                      {product.price}
                    </div>

                    <div className="product-detail">
                      {product.package ||
                        product.fulfillment ||
                        fulfillment}
                    </div>

                    <a
                      className="order-button"
                      href={orderHref(product)}
                    >
                      Order This
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty">
                Farm Folks does not have any active products posted right now.
              </div>
            )}
          </div>
        </section>

        <footer className="store-footer">
          Farm Folks LLC • Listed through the Okeechobee Live Meat Marke
        </footer>
      </div>
    </main>
  );
}
