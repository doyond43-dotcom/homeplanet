import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type FarmProduct = {
  id: string | number;
  name: string | null;
  price: string | number | null;
  package: string | null;
  image_url: string | null;
  category: string | null;
  description: string | null;
  availability: string | null;
  quantity_available: string | number | null;
  pickup_timing: string | null;
};

const HOME = "/planet/okeechobee/meat-market/farm-folks/pro-preview";
const STORE = "/planet/okeechobee/meat-market/seller/farm-folks";

const COLLECTIONS: Record<string, { title: string; image: string }> = {
  beef: { title: "Beef", image: "/images/farm-folks-steaks.jpg" },
  eggs: { title: "Eggs", image: "/images/farm-folks-eggs.jpg" },
  dairy: { title: "Dairy", image: "/images/farm-folks-dairy.jpg" },
  "farm-goods": { title: "Farm Goods", image: "/images/farm-folks-honey.jpg" },
};

function getCategory(value: string | null): string {
  const category = (value || "").trim().toLowerCase();
  if (category === "beef") return "beef";
  if (category === "eggs") return "eggs";
  if (category === "dairy") return "dairy";
  return "farm-goods";
}

export default function FarmFolksCategoryPage() {
  const { category = "beef" } = useParams();
  const selected = COLLECTIONS[category];

  const [products, setProducts] = useState<FarmProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      const result = await supabase
        .from("okeechobee_meat_market_products")
        .select(
          "id,name,price,package,image_url,category,description,availability,quantity_available,pickup_timing"
        )
        .eq("seller_listing_id", "farm-folks")
        .eq("status", "Active")
        .order("sort_order", { ascending: true });

      if (!active) return;

      if (result.error) {
        setError("Products could not be loaded right now.");
        setProducts([]);
      } else {
        setProducts((result.data || []) as FarmProduct[]);
      }

      setLoading(false);
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  if (!selected) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Collection not found</h1>
        <Link to={HOME}>Back to Farm Folks</Link>
      </main>
    );
  }

  const visible = products.filter(
    (product) => getCategory(product.category) === category
  );

  return (
    <main className="farmfolks-category">
      <style>{`
        .farmfolks-category {
          min-height: 100vh;
          background: linear-gradient(180deg, #f6f1e6, #f2ebde);
          color: #193224;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }
        .farmfolks-category * { box-sizing: border-box; }
        .ffc-wrap { max-width: 1280px; margin: auto; padding: 0 28px; }
        .ffc-header {
          min-height: 88px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        .ffc-logo {
          font-family: Georgia, serif;
          font-size: 32px;
          font-weight: 700;
          text-decoration: none;
          color: #193224;
        }
        .ffc-back {
          color: #193224;
          text-decoration: none;
          font-size: 14px;
          font-weight: 750;
        }
        .ffc-intro {
          padding: 42px 0 30px;
          border-top: 1px solid rgba(25,50,36,.12);
        }
        .ffc-label {
          color: #9a7340;
          font-size: 12px;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: .14em;
        }
        .ffc-intro h1 {
          font-family: Georgia, serif;
          font-size: clamp(48px, 6vw, 78px);
          letter-spacing: -.05em;
          line-height: 1;
          margin: 14px 0;
        }
        .ffc-intro p {
          color: #657365;
          font-size: 17px;
          line-height: 1.6;
        }
        .ffc-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
          padding: 22px 0 70px;
        }
        .ffc-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 22px;
          background: #fff;
          border: 1px solid rgba(25,50,36,.09);
          box-shadow: 0 14px 34px rgba(43,33,18,.05);
        }
        .ffc-card img {
          width: 100%;
          height: 240px;
          object-fit: cover;
          display: block;
        }
        .ffc-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 22px;
        }
        .ffc-body h2 {
          margin: 0 0 12px;
          font: 700 27px Georgia, serif;
          color: #193224;
        }
        .ffc-price {
          font-weight: 850;
          color: #9a7340;
        }
        .ffc-detail {
          font-size: 14px;
          color: #667466;
          line-height: 1.65;
          margin: 12px 0;
        }
        .ffc-order {
          display: block;
          text-align: center;
          margin-top: auto;
          padding: 14px 16px;
          background: #193e2b;
          color: white;
          border-radius: 12px;
          font-weight: 800;
          text-decoration: none;
        }
        .ffc-contact-card {
          min-height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(25,62,43,.16);
          background: #e6e8dc;
          color: #193224;
        }
        .ffc-contact-eyebrow {
          color: #9a7340;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .ffc-contact-card h2 {
          margin: 16px 0 12px;
          font-family: Georgia, serif;
          font-size: clamp(27px, 3vw, 35px);
          line-height: 1.12;
        }
        .ffc-contact-card p {
          color: #657365;
          line-height: 1.7;
          font-size: 15px;
        }
        .ffc-request-list {
          display: grid;
          gap: 15px;
          margin: 24px 0;
          padding-top: 22px;
          border-top: 1px solid rgba(25,62,43,.15);
          color: #193224;
          font-size: 14px;
          font-weight: 650;
        }
        .ffc-request-list > div {
          display: flex;
          align-items: center;
          gap: 11px;
        }
        .ffc-request-list span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 23px;
          width: 23px;
          height: 23px;
          border-radius: 50%;
          background: rgba(154,115,64,.13);
          color: #9a7340;
          font-weight: 900;
        }
        .ffc-contact-action {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding: 14px 17px;
          background: #193e2b;
          color: #fff;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 800;
          font-size: 14px;
        }
        .ffc-contact-action:focus-visible {
          outline: 3px solid #cba45e;
          outline-offset: 3px;
        }
        .ffc-spacer { height: 22px; }
        .ffc-message { padding: 30px 0 80px; color: #657365; }
        @media (max-width: 900px) {
          .ffc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 600px) {
          .ffc-grid { grid-template-columns: 1fr; }
          .ffc-wrap { padding: 0 18px; }
          .ffc-logo { font-size: 27px; }
        }
      `}</style>

      <div className="ffc-wrap">
        <header className="ffc-header">
          <Link className="ffc-logo" to={HOME}>Farm Folks</Link>
          <Link className="ffc-back" to={HOME}>Back to Farm Folks &rarr;</Link>
        </header>

        <div className="ffc-intro">
          <div className="ffc-label">Shop Fresh From the Farm</div>
          <h1>{selected.title}</h1>
          <p>Browse available {selected.title.toLowerCase()} products from Farm Folks.</p>
        </div>

        {loading && (
          <p className="ffc-message">Loading farm products...</p>
        )}

        {error && <p className="ffc-message">{error}</p>}

        {!loading && !error && visible.length === 0 && (
          <p className="ffc-message">
            No active {selected.title.toLowerCase()} products are listed right now.
            Check back soon for availability.
          </p>
        )}

        {!loading && !error && visible.length > 0 && (
          <>
            <div className="ffc-label">{visible.length} Current Listings</div>
            <div className="ffc-grid">
              {visible.map((product) => (
                <article className="ffc-card" key={product.id}>
                  <img
                    src={product.image_url || selected.image}
                    alt={product.name || selected.title}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = selected.image;
                    }}
                  />
                  <div className="ffc-body">
                    <h2>{product.name || "Farm Product"}</h2>
                    <div className="ffc-price">
                      {product.price == null || product.price === ""
                        ? "Ask for pricing"
                        : String(product.price)}
                    </div>
                    {product.description && (
                      <p className="ffc-detail">{product.description}</p>
                    )}
                    {(product.package || product.pickup_timing) && (
                      <p className="ffc-detail">
                        {[product.package, product.pickup_timing]
                          .filter(Boolean)
                          .join(" | ")}
                      </p>
                    )}
                    <div className="ffc-spacer" />
                    <Link className="ffc-order" to={STORE}>
                      Order through Farm Folks
                    </Link>
                  </div>
                </article>
              ))}

              {category === "beef" && visible.length % 3 === 2 && (
                <article className="ffc-contact-card">
                  <div className="ffc-contact-eyebrow">Need something else?</div>
                  <h2>Don't see what you're looking for?</h2>
                  <p>
                    Ask Farm Folks about additional cuts, bulk orders,
                    and upcoming availability.
                  </p>

                  <div className="ffc-request-list">
                    <div><span aria-hidden="true">&#10003;</span> Specialty beef cuts</div>
                    <div><span aria-hidden="true">&#10003;</span> Quarter, half &amp; bulk orders</div>
                    <div><span aria-hidden="true">&#10003;</span> Upcoming availability</div>
                  </div>

                  <Link className="ffc-contact-action" to="/planet/okeechobee/meat-market/contact?mode=question&amp;inquiry=farm&amp;seller=Farm%20Folks&amp;product=Beef%20availability%20request&amp;listingId=farm-folks">
                    Contact the Farm <span aria-hidden="true">&rarr;</span>
                  </Link>
                </article>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}