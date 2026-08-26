import { useMemo, useState } from "react";

type MarketItem = {
  id: number;
  category: string;
  title: string;
  price: string;
  amount: string;
  seller: string;
  location: string;
  fulfillment: string;
  badge?: string;
};

const categories = [
  "Everything",
  "Ground Beef",
  "Steaks",
  "Roasts",
  "Bulk Beef",
  "Half / Quarter / Whole",
];

const previewItems: MarketItem[] = [
  {
    id: 1,
    category: "Ground Beef",
    title: "Ground Beef",
    price: "$6.50 / lb",
    amount: "20 lbs available",
    seller: "Example Local Ranch",
    location: "Okeechobee, FL",
    fulfillment: "Pickup \u2022 Local delivery",
    badge: "PREVIEW LISTING",
  },
  {
    id: 2,
    category: "Steaks",
    title: "Ribeye Box",
    price: "$85",
    amount: "Limited boxes",
    seller: "Example Local Seller",
    location: "Okeechobee, FL",
    fulfillment: "Weekend pickup",
    badge: "PREVIEW LISTING",
  },
  {
    id: 3,
    category: "Half / Quarter / Whole",
    title: "Quarter Beef",
    price: "Taking deposits",
    amount: "Processing date coming up",
    seller: "Example Local Ranch",
    location: "Okeechobee County",
    fulfillment: "Local pickup",
    badge: "PREVIEW LISTING",
  },
];

export default function OkeechobeeLiveMeatMarketPage() {
  const [activeCategory, setActiveCategory] = useState("Everything");

  const visibleItems = useMemo(() => {
    if (activeCategory === "Everything") return previewItems;
    return previewItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="meat-market-page">
      <style>{`
        :root {
          color-scheme: light;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        .meat-market-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(184, 137, 65, 0.13), transparent 28rem),
            #f7f2e8;
          color: #17231b;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .market-shell {
          width: min(100% - 28px, 1120px);
          margin: 0 auto;
        }

        .market-topbar {
          padding: 18px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid rgba(23, 35, 27, 0.12);
        }

        .market-brand {
          font-size: 15px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sell-link {
          border: 1px solid #193c2b;
          color: #193c2b;
          padding: 10px 14px;
          border-radius: 999px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 850;
        }

        .hero {
          padding: 54px 0 34px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 11px;
          border-radius: 999px;
          background: #e6dcc7;
          color: #4e402a;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 760px;
          margin: 18px 0 10px;
          font-size: clamp(42px, 8vw, 78px);
          line-height: 0.94;
          letter-spacing: -0.055em;
          font-weight: 950;
        }

        .hero-sub {
          max-width: 650px;
          margin: 0;
          color: #566158;
          font-size: clamp(17px, 3vw, 21px);
          line-height: 1.5;
          font-weight: 650;
        }

        .field-line {
          margin-top: 26px;
          padding-left: 16px;
          border-left: 4px solid #b88941;
          font-size: 15px;
          line-height: 1.5;
          font-weight: 850;
        }

        .section {
          padding: 24px 0 34px;
        }

        .section-head {
          margin-bottom: 18px;
        }

        .section-head h2 {
          margin: 0;
          font-size: clamp(26px, 5vw, 38px);
          letter-spacing: -0.035em;
        }

        .section-head p {
          margin: 7px 0 0;
          color: #667068;
          line-height: 1.5;
          font-weight: 600;
        }

        .category-row {
          display: flex;
          gap: 9px;
          overflow-x: auto;
          padding: 4px 0 10px;
          scrollbar-width: none;
        }

        .category-row::-webkit-scrollbar {
          display: none;
        }

        .category-button {
          flex: 0 0 auto;
          border: 1px solid rgba(25, 60, 43, 0.18);
          background: rgba(255,255,255,0.72);
          color: #21362a;
          padding: 13px 17px;
          min-height: 44px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
        }

        .category-button.active {
          background: #193c2b;
          color: white;
          border-color: #193c2b;
        }

        .market-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .market-card {
          min-width: 0;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(23,35,27,0.1);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 18px 50px rgba(48, 39, 24, 0.07);
        }

        .card-top {
          min-height: 150px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            linear-gradient(145deg, rgba(25,60,43,0.97), rgba(44,79,57,0.92));
          color: white;
        }

        .card-badge {
          width: fit-content;
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.13);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
        }

        .card-title {
          margin-top: 20px;
          font-size: 26px;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .card-body {
          padding: 19px;
        }

        .price {
          font-size: 28px;
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .amount {
          margin-top: 3px;
          color: #657068;
          font-size: 14px;
          font-weight: 700;
        }

        .seller {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(23,35,27,0.1);
        }

        .seller-name {
          font-size: 15px;
          font-weight: 950;
        }

        .seller-meta,
        .fulfillment {
          margin-top: 4px;
          color: #69726c;
          font-size: 13px;
          font-weight: 650;
        }

        .order-button {
          display: block;
          width: 100%;
          margin-top: 17px;
          padding: 13px 15px;
          border-radius: 14px;
          border: 0;
          background: #193c2b;
          color: white;
          text-align: center;
          text-decoration: none;
          font-size: 14px;
          font-weight: 900;
        }

        .empty-state {
          grid-column: 1 / -1;
          padding: 30px;
          border-radius: 22px;
          background: rgba(255,255,255,0.7);
          border: 1px dashed rgba(23,35,27,0.18);
          text-align: center;
          color: #657068;
          font-weight: 750;
        }

        .request-box {
          margin-top: 16px;
          border-radius: 28px;
          background: #1b3528;
          color: white;
          padding: clamp(24px, 5vw, 42px);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
        }

        .request-box h3 {
          margin: 0;
          font-size: clamp(28px, 5vw, 42px);
          letter-spacing: -0.04em;
          font-weight: 900;
        }

        .request-box p {
          margin: 8px 0 0;
          max-width: 600px;
          color: rgba(255,255,255,0.72);
          line-height: 1.5;
          font-weight: 600;
        }

        .request-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          padding: 0 20px;
          border-radius: 15px;
          background: #e8d7b5;
          color: #1b3528;
          text-decoration: none;
          font-weight: 950;
          white-space: nowrap;
        }

        .market-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .simple-panel {
          padding: 24px;
          border-radius: 24px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(23,35,27,0.14);
          box-shadow: 0 10px 28px rgba(48,39,24,0.045);
        }

        .simple-panel h3 {
          margin: 0;
          font-size: 25px;
          line-height: 1.15;
          letter-spacing: -0.03em;
          font-weight: 900;
        }

        .simple-panel p {
          margin: 8px 0 17px;
          color: #657068;
          line-height: 1.5;
          font-weight: 600;
        }

        .text-link {
          color: #193c2b;
          font-weight: 900;
          text-decoration: none;
        }

        .market-footer {
          padding: 30px 0 40px;
          border-top: 1px solid rgba(23,35,27,0.12);
          text-align: center;
          color: #59645c;
          font-size: 14px;
          font-weight: 800;
        }

        @media (max-width: 820px) {
          .market-grid {
            grid-template-columns: 1fr;
          }

          .market-columns {
            grid-template-columns: 1fr;
          }

          .request-box {
            grid-template-columns: 1fr;
          }

          .request-button {
            width: 100%;
          }

          .hero {
            padding-top: 40px;
          }

          .market-topbar {
            padding-top: 14px;
          }
        }
      `}</style>

      <div className="market-shell">
        <header className="market-topbar">
          <div className="market-brand">Okeechobee Together</div>
          <a className="sell-link" href="/planet/okeechobee/meat-market/sell">
            Sell Local Meat
          </a>
        </header>

        <section className="hero">
          <div className="eyebrow">Okeechobee County &bull; Local Food</div>

          <h1>
            Okeechobee
            <br />
            Live Meat Market
          </h1>

          <p className="hero-sub">
            Local ranchers. Local beef. Local pickup &amp; delivery.
          </p>

          <div className="field-line">
            The livestock market moves the cattle.
            <br />
            The Live Meat Market moves the beef.
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>What are you looking for?</h2>
            <p>See what local ranchers, butchers, and meat sellers have available.</p>
          </div>

          <div className="category-row">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-button ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Available Now</h2>
            <p>
              This first version is showing preview listings while we bring local sellers into the market.
            </p>
          </div>

          <div className="market-grid">
            {visibleItems.length ? (
              visibleItems.map((item) => (
                <article className="market-card" key={item.id}>
                  <div className="card-top">
                    <div className="card-badge">{item.badge}</div>
                    <div className="card-title">{item.title}</div>
                  </div>

                  <div className="card-body">
                    <div className="price">{item.price}</div>
                    <div className="amount">{item.amount}</div>

                    <div className="seller">
                      <div className="seller-name">{item.seller}</div>
                      <div className="seller-meta">{item.location}</div>
                      <div className="fulfillment">{item.fulfillment}</div>
                    </div>

                    <a className="order-button" href="#request">
                      View / Order
                    </a>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">
                Nothing posted in this category yet. Tell local sellers what you are looking for below.
              </div>
            )}
          </div>
        </section>

        <section className="section" id="request">
          <div className="request-box">
            <div>
              <h3>Looking for something specific?</h3>
              <p>
                Tell local ranchers and meat sellers what you need, how much you need, and when you need it.
              </p>
            </div>

            <a className="request-button" href="/planet/okeechobee/reach-out">
              Tell Us What You Need
            </a>
          </div>
        </section>

        <section className="section">
          <div className="market-columns">
            <div className="simple-panel">
              <h3>Local Ranchers &amp; Meat Shops</h3>
              <p>
                Find the people raising, cutting, packaging, and selling meat right here in our community.
              </p>
              <a className="text-link" href="/planet/okeechobee/meat-market/sell">
                Join the local market &rarr;</a>
            </div>

            <div className="simple-panel">
              <h3>Butchers &amp; Processors</h3>
              <p>
                Local processing, custom cuts, availability, and direct connections in one simple place.
              </p>
              <a className="text-link" href="/planet/okeechobee/meat-market/sell">
                Add your business &rarr;</a>
            </div>
          </div>
        </section>

        <section className="section" id="sell">
          <div className="request-box">
            <div>
              <h3>Raise it, process it, or sell it locally?</h3>
              <p>
                Ranchers, butchers, processors, and local meat shops can be part of the Okeechobee Live Meat Market.
              </p>
            </div>

            <a className="request-button" href="/planet/okeechobee/meat-market/sell">
              Get Listed
            </a>
          </div>
        </section>

        <section style={{ padding: "6px 0 30px" }}>
          <div className="market-shell">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
                padding: "20px 22px",
                borderRadius: "22px",
                background: "rgba(255,255,255,0.78)",
                border: "1px solid rgba(23,35,27,0.12)"
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "19px",
                    fontWeight: 900,
                    color: "#17231b"
                  }}
                >
                  Have a question?
                </div>

                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "14px",
                    fontWeight: 650,
                    color: "#667068"
                  }}
                >
                  Ask about local beef, pickup, delivery, sellers, or getting listed.
                </div>
              </div>

              <a
                className="request-button"
                href="/planet/okeechobee/reach-out"
                style={{ minHeight: "46px", padding: "0 20px" }}
              >
                Ask a Question
              </a>
            </div>
          </div>
        </section>

        <footer className="market-footer">
          <div
            className="market-shell"
            style={{
              display: "grid",
              gap: "18px",
              textAlign: "left"
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 950,
                  color: "#17231b",
                  letterSpacing: "-0.03em"
                }}
              >
                Okeechobee Live Meat Market
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#667068"
                }}
              >
                Local ranchers. Local beef. Local connections.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "18px",
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <a className="text-link" href="#market">
                Browse Market
              </a>

              <a
                className="text-link"
                href="/planet/okeechobee/meat-market/sell"
              >
                Sell Local Meat
              </a>

              <a
                className="text-link"
                href="/planet/okeechobee/reach-out"
              >
                Ask a Question
              </a>

              <a
                className="text-link"
                href="/planet/okeechobee"
              >
                Okeechobee Together
              </a>
            </div>

            <div
              style={{
                paddingTop: "16px",
                borderTop: "1px solid rgba(23,35,27,0.10)",
                fontSize: "13px",
                fontWeight: 750,
                color: "#788078"
              }}
            >
              Built to help local food stay local.
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}


