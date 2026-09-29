import { FormEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Search,
  Store,
} from "lucide-react";

type MarketLocation = {
  city: string;
  state: string;
  zipHints: string[];
  href: string;
  status: "live" | "building";
};

const markets: MarketLocation[] = [
  {
    city: "Okeechobee",
    state: "FL",
    zipHints: ["34972", "34974"],
    href: "/planet/okeechobee/meat-market",
    status: "live",
  },
];

const categories = [
  "Meat",
  "Produce",
  "Eggs",
  "Dairy",
  "Honey",
  "Farm Goods",
];

export default function HomePlanetLiveMarketPage() {
  const [locationQuery, setLocationQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  const liveMarkets = useMemo(
    () => markets.filter((market) => market.status === "live"),
    []
  );

  function findMarket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = locationQuery.trim().toLowerCase();

    if (!query) {
      setSearchMessage("Enter a city or ZIP code.");
      return;
    }

    const match = markets.find((market) => {
      const city = market.city.toLowerCase();
      const state = market.state.toLowerCase();

      return (
        query === city ||
        query === `${city}, ${state}` ||
        query === `${city} ${state}` ||
        query.includes(city) ||
        market.zipHints.some((zip) => query.includes(zip))
      );
    });

    if (match) {
      window.location.href = match.href;
      return;
    }

    setSearchMessage(
      `We do not have a live market in "${locationQuery.trim()}" yet. Your search helps show us where HomePlanet Live Market should grow next.`
    );
  }

  return (
    <main className="live-market-page">
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

        .live-market-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top right, rgba(184, 137, 65, 0.15), transparent 32rem),
            #f7f2e8;
          color: #17231b;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .live-market-shell {
          width: min(100% - 28px, 1120px);
          margin: 0 auto;
        }

        .live-market-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(23, 35, 27, 0.12);
        }

        .live-market-brand {
          color: #17231b;
          text-decoration: none;
          font-size: 15px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .live-market-seller-link {
          padding: 10px 14px;
          border: 1px solid #193c2b;
          border-radius: 999px;
          color: #193c2b;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
        }

        .live-market-hero {
          padding: clamp(58px, 9vw, 110px) 0 52px;
        }

        .live-market-eyebrow {
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

        .live-market-hero h1 {
          max-width: 900px;
          margin: 20px 0 14px;
          font-size: clamp(52px, 10vw, 96px);
          line-height: 0.92;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .live-market-sub {
          max-width: 700px;
          margin: 0;
          color: #58645c;
          font-size: clamp(18px, 3vw, 23px);
          line-height: 1.5;
          font-weight: 650;
        }

        .location-box {
          max-width: 760px;
          margin-top: 34px;
          padding: 10px;
          border: 2px solid #193c2b;
          border-radius: 20px;
          background: rgba(255,255,255,0.82);
          box-shadow: 0 14px 34px rgba(48,39,24,0.08);
        }

        .location-form {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 9px;
        }

        .location-input-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 54px;
          padding: 0 14px;
          border-radius: 14px;
          background: white;
          border: 1px solid rgba(23,35,27,0.12);
        }

        .location-input-wrap svg {
          width: 20px;
          height: 20px;
          color: #8a6a38;
          flex: 0 0 auto;
        }

        .location-input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #17231b;
          font: inherit;
          font-size: 16px;
          font-weight: 750;
        }

        .location-button {
          min-height: 54px;
          padding: 0 22px;
          border: 0;
          border-radius: 14px;
          background: #193c2b;
          color: white;
          font-size: 14px;
          font-weight: 950;
          cursor: pointer;
        }

        .search-message {
          margin: 10px 4px 2px;
          color: #667068;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 700;
        }

        .category-strip {
          display: flex;
          gap: 9px;
          overflow-x: auto;
          padding: 4px 0 10px;
          scrollbar-width: none;
        }

        .category-strip::-webkit-scrollbar {
          display: none;
        }

        .category-pill {
          flex: 0 0 auto;
          padding: 11px 15px;
          border-radius: 999px;
          background: rgba(255,255,255,0.76);
          border: 1px solid rgba(25,60,43,0.14);
          color: #253d31;
          font-size: 13px;
          font-weight: 850;
        }

        .market-section {
          padding: 36px 0 64px;
        }

        .market-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 18px;
        }

        .market-section-head h2 {
          margin: 0;
          font-size: clamp(30px, 5vw, 44px);
          letter-spacing: -0.045em;
        }

        .market-section-head p {
          max-width: 520px;
          margin: 0;
          color: #657068;
          line-height: 1.5;
          font-weight: 650;
        }

        .market-location-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .market-location-card {
          display: block;
          min-height: 230px;
          padding: 26px;
          border-radius: 26px;
          background: #193c2b;
          color: white;
          text-decoration: none;
          box-shadow: 0 18px 48px rgba(25,60,43,0.14);
        }

        .market-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .market-live-badge {
          padding: 7px 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .market-card-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: rgba(255,255,255,0.10);
        }

        .market-card-title {
          margin-top: 48px;
          font-size: clamp(34px, 5vw, 48px);
          line-height: 0.95;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .market-card-copy {
          margin-top: 10px;
          color: rgba(255,255,255,0.72);
          font-size: 14px;
          line-height: 1.5;
          font-weight: 700;
        }

        .market-card-action {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 26px;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .growth-card {
          min-height: 230px;
          padding: 26px;
          border-radius: 26px;
          background: #eadcc1;
          border: 1px dashed rgba(76,56,28,0.28);
          color: #17231b;
        }

        .growth-card h3 {
          margin: 0;
          font-size: clamp(30px, 5vw, 42px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .growth-card p {
          margin: 16px 0 0;
          max-width: 470px;
          color: #5f594d;
          font-size: 15px;
          line-height: 1.55;
          font-weight: 700;
        }

        .live-market-footer {
          padding: 30px 0 40px;
          border-top: 1px solid rgba(23,35,27,0.12);
          color: #59645c;
          text-align: center;
          font-size: 13px;
          font-weight: 800;
        }

        @media (max-width: 760px) {
          .location-form {
            grid-template-columns: 1fr;
          }

          .location-button {
            width: 100%;
          }

          .market-section-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .market-location-grid {
            grid-template-columns: 1fr;
          }

          .live-market-topbar {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="live-market-shell">
        <header className="live-market-topbar">
          <a className="live-market-brand" href="/">
            HomePlanet
          </a>

          <a
            className="live-market-seller-link"
            href="/planet/okeechobee/meat-market/sell"
          >
            Sell Local Food
          </a>
        </header>

        <section className="live-market-hero">
          <div className="live-market-eyebrow">
            <MapPin size={15} />
            Local markets by location
          </div>

          <h1>
            HomePlanet
            <br />
            Live Market
          </h1>

          <p className="live-market-sub">
            Find local food, local sellers, and what is available near you right now.
          </p>

          <form className="location-box" onSubmit={findMarket}>
            <div className="location-form">
              <label className="location-input-wrap">
                <Search aria-hidden="true" />
                <input
                  className="location-input"
                  type="text"
                  value={locationQuery}
                  onChange={(event) => {
                    setLocationQuery(event.target.value);
                    setSearchMessage("");
                  }}
                  placeholder="Enter city or ZIP code"
                  aria-label="City or ZIP code"
                />
              </label>

              <button className="location-button" type="submit">
                Find My Market
              </button>
            </div>

            {searchMessage ? (
              <div className="search-message">{searchMessage}</div>
            ) : null}
          </form>
        </section>

        <div className="category-strip" aria-label="Live Market categories">
          {categories.map((category) => (
            <div className="category-pill" key={category}>
              {category}
            </div>
          ))}
        </div>

        <section className="market-section">
          <div className="market-section-head">
            <h2>Live Markets</h2>
            <p>
              Each location has its own sellers, products, availability, pickup,
              and delivery options.
            </p>
          </div>

          <div className="market-location-grid">
            {liveMarkets.map((market) => (
              <a
                className="market-location-card"
                href={market.href}
                key={`${market.city}-${market.state}`}
              >
                <div className="market-card-top">
                  <div className="market-live-badge">Live Now</div>

                  <div className="market-card-icon">
                    <Store size={22} />
                  </div>
                </div>

                <div className="market-card-title">
                  {market.city}, {market.state}
                </div>

                <div className="market-card-copy">
                  Shop local sellers and see what is available in the area.
                </div>

                <div className="market-card-action">
                  Open Market
                  <ArrowRight size={16} />
                </div>
              </a>
            ))}

            <div className="growth-card">
              <h3>Where should we open next?</h3>
              <p>
                Search your city above. We can use real shopper interest to help
                decide where HomePlanet Live Market expands next instead of
                guessing.
              </p>
            </div>
          </div>
        </section>

        <footer className="live-market-footer">
          HomePlanet Live Market
        </footer>
      </div>
    </main>
  );
}
