import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type FarmProduct = {
  id: string | number;
  name: string;
  price: string;
  package: string;
  image_url: string;
  availability: string;
  description: string;
  category: string;
  quantity_available?: string;
  pickup_timing?: string;
};

const STORE = "/planet/okeechobee/meat-market/seller/farm-folks";
const MARKET = "/planet/okeechobee/meat-market";

function clean(text?: string) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function productImage(product: FarmProduct) {
  if (clean(product.image_url)) return clean(product.image_url);

  const value = clean(product.name).toLowerCase();

  if (value.includes("honey")) return "/images/farm-folks-honey.jpg";
  if (value.includes("egg")) return "/images/farm-folks-eggs.jpg";
  if (value.includes("milk") || value.includes("dairy") || value.includes("kefir")) return "/images/farm-folks-raw-milk.jpg";
  if (value.includes("steak") || value.includes("ribeye") || value.includes("sirloin") || value.includes("filet")) return "/images/farm-folks-steaks.jpg";
  if (value.includes("ground") || value.includes("hamburger") || value.includes("ancestral") || value.includes("patty")) return "/images/farm-folks-ground-beef.jpg";
  if (value.includes("beef")) return "/images/farm-folks-beef-cuts.jpg";

  return "";
}

function categoryImage(label: string) {
  const value = label.toLowerCase();
  if (value.includes("egg")) return "/images/farm-folks-eggs.jpg";
  if (value.includes("dairy")) return "/images/farm-folks-raw-milk.jpg";
  if (value.includes("honey") || value.includes("farm goods")) return "/images/farm-folks-honey.jpg";
  return "/images/farm-folks-steaks.jpg";
}

export default function FarmFolksProPreview() {
  const [products, setProducts] = useState<FarmProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      const result = await supabase
        .from("okeechobee_meat_market_products")
        .select(
          "id,name,price,package,image_url,availability,description,category,quantity_available,pickup_timing"
        )
        .eq("seller_listing_id", "farm-folks")
        .eq("status", "Active")
        .order("sort_order", { ascending: true });

      if (!active) return;

      if (result.error) {
        setError("Current Farm Folks products could not be loaded right now. You can still view the current seller storefront.");
      } else {
        setProducts((result.data || []) as FarmProduct[]);
      }

      setLoading(false);
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(() => products.slice(0, 4), [products]);

  const collectionCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Beef: 0,
      Eggs: 0,
      Dairy: 0,
      "Farm Goods": 0,
    };

    products.forEach((product) => {
      const category = clean(product.category) || "Other";
      if (category === "Beef") counts.Beef += 1;
      else if (category === "Eggs") counts.Eggs += 1;
      else if (category === "Dairy") counts.Dairy += 1;
      else counts["Farm Goods"] += 1;
    });

    return counts;
  }, [products]);

  const collections = [
    {
      title: "Beef",
      description: "Explore beef cuts, family favorites, and larger orders.",
      image: categoryImage("Beef"),
      count: collectionCounts.Beef,
    },
    {
      title: "Eggs",
      description: "See the fresh egg options currently listed.",
      image: categoryImage("Eggs"),
      count: collectionCounts.Eggs,
    },
    {
      title: "Dairy",
      description: "Browse available dairy products.",
      image: categoryImage("Dairy"),
      count: collectionCounts.Dairy,
    },
    {
      title: "Farm Goods",
      description: "Discover honey and other farm favorites.",
      image: categoryImage("Farm Goods"),
      count: collectionCounts["Farm Goods"],
    },
  ];

  return (
    <main className="farmfolks-home">
      <style>{`
        :root { color-scheme: light; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #f4eee2; color: #18291f; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .farmfolks-home { min-height: 100vh; background: radial-gradient(circle at top right, rgba(176, 138, 67, 0.14), transparent 30rem), linear-gradient(180deg, #f6f1e6 0%, #f2ebde 100%); color: #18291f; }
        .farmfolks-home * { box-sizing: border-box; }
        .farmfolks-home a { text-decoration: none; }
        .shell { width: min(100% - 34px, 1240px); margin: 0 auto; }
        .topbar { position: relative; z-index: 3; min-height: 78px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .brand-stack { display: flex; flex-direction: column; gap: 4px; }
        .brand-name { font-family: Georgia, "Times New Roman", serif; font-size: 32px; line-height: 1; font-weight: 700; letter-spacing: -0.05em; color: #193224; }
        .brand-sub { font-size: 10px; line-height: 1; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; color: #9a7340; }
        .nav-link { color: #193224; font-size: 13px; font-weight: 900; }
        .hero { position: relative; min-height: 520px; border-radius: 36px; overflow: hidden; background: linear-gradient(90deg, rgba(255,243,217,.02) 0%, rgba(255,241,209,.07) 43%, rgba(255,241,209,.15) 100%), url('/images/farm-folks-hero-v2.png') 58% 52% / cover no-repeat; box-shadow: 0 32px 90px rgba(40,30,16,.18); }
        .hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(250,239,215,.08), transparent 47%); pointer-events: none; }
        .hero-content { position: absolute; z-index: 1; top: 12%; left: 0; width: 100%; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 18px 10px; color: #102d21; text-align: center; text-shadow: 0 1px 16px rgba(255,240,208,.72); }
        .eyebrow { font-size: 12px; line-height: 1; font-weight: 950; letter-spacing: 0.16em; text-transform: uppercase; color: #e5c98e; }
        .hero h1 { margin: 12px 0 6px; font-family: Georgia, "Times New Roman", serif; font-size: clamp(54px, 6vw, 78px); line-height: .98; letter-spacing: -.055em; font-weight: 700; color: #0a2b1d; white-space: nowrap; }
        .hero p { max-width: 570px; margin: 0; color: #133223; font-family: Georgia, "Times New Roman", serif; font-size: clamp(18px, 2vw, 27px); line-height: 1.4; font-weight: 500; }
        .hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 22px; }
        .btn, .btn-outline { display: inline-flex; align-items: center; justify-content: center; min-height: 56px; padding: 0 24px; border-radius: 14px; font-size: 14px; font-weight: 950; letter-spacing: 0.01em; }
        .btn { background: linear-gradient(180deg, #e4c37f 0%, #d7ae64 100%); color: #193123; box-shadow: 0 16px 34px rgba(0, 0, 0, 0.16); }
        .btn-outline { background: rgba(255, 255, 255, 0.09); color: #fff; border: 1px solid rgba(255, 255, 255, 0.22); backdrop-filter: blur(5px); }
        .hero-note { display: none; }
        .section { padding: 72px 0; }
        .section-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 32px; align-items: center; }
        .section-copy h2, .collections-head h2, .shop-head h2, .process-head h2, .story-band-copy h2 { margin: 12px 0 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(42px, 5vw, 60px); line-height: 1.02; letter-spacing: -0.05em; font-weight: 700; color: #193224; }
        .section-copy p, .collections-head p, .shop-head p, .process-head p, .story-band-copy p { margin: 14px 0 0; color: #657365; font-size: 17px; line-height: 1.75; font-weight: 550; }
        .story-card { position: relative; overflow: hidden; min-height: 340px; border-radius: 28px; background: url('/images/farm-folks-owner.jpg') center center / cover no-repeat; box-shadow: 0 18px 50px rgba(47, 36, 20, 0.08); }
        .story-card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(13, 22, 16, 0.06), rgba(13, 22, 16, 0.28)); }
        .collections-head, .shop-head, .process-head { max-width: 840px; }
        .collections-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; margin-top: 28px; }
        .collection-card { display: flex; flex-direction: column; overflow: hidden; border-radius: 24px; background: rgba(255,255,255,0.9); border: 1px solid rgba(25,50,37,0.1); box-shadow: 0 14px 34px rgba(43, 33, 18, 0.06); }
        .collection-card img { width: 100%; height: 250px; display: block; object-fit: cover; }
        .collection-card-body { padding: 20px; display: flex; flex-direction: column; flex: 1; }
        .collection-card-body h3 { margin: 0; font-size: 28px; line-height: 1.02; letter-spacing: -0.04em; color: #193022; }
        .collection-card-body p { margin: 12px 0 0; color: #667466; font-size: 14px; line-height: 1.65; font-weight: 550; }
        .collection-shop-link {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 0 0;
          margin-top: 12px;
          background: transparent;
          color: #193e2b;
          border: 0;
          border-top: 1px solid rgba(25,62,43,.12);
          border-radius: 0;
          font: inherit;
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
        }
        .collection-shop-link:hover {
          color: #ad7c2f;
        }
        .collection-shop-link:focus-visible {
          outline: 3px solid #cba45e;
          outline-offset: 3px;
        }
        .collection-meta { margin-top: auto; color: #9a7340; font-size: 12px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; }
        .process-band { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; margin-top: 28px; }
        .process-step { padding: 22px; border-radius: 22px; background: linear-gradient(145deg, #173224 0%, #254634 100%); color: #fff; box-shadow: 0 16px 36px rgba(24, 39, 30, 0.12); }
        .step-number { width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; background: #dfbf7b; color: #173123; font-size: 15px; font-weight: 950; }
        .process-step h3 { margin: 14px 0 0; font-size: 24px; line-height: 1.08; letter-spacing: -0.03em; }
        .process-step p { margin: 10px 0 0; color: rgba(255,255,255,0.78); font-size: 14px; line-height: 1.65; font-weight: 550; }
        .shop-preview { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 28px; }
        .product-card { overflow: hidden; display: grid; grid-template-columns: 0.92fr 1.08fr; min-height: 330px; border-radius: 24px; background: rgba(255,255,255,0.92); border: 1px solid rgba(25,50,37,0.1); box-shadow: 0 16px 38px rgba(46, 35, 18, 0.06); }
        .product-card img, .product-fallback { width: 100%; height: 100%; min-height: 330px; display: block; object-fit: cover; background: #e4dcc9; }
        .product-fallback { display: flex; align-items: center; justify-content: center; color: #5d695e; font-size: 14px; font-weight: 850; }
        .product-body { display: flex; flex-direction: column; padding: 24px; }
        .product-kicker { color: #9a7340; font-size: 11px; font-weight: 950; letter-spacing: 0.11em; text-transform: uppercase; }
        .product-body h3 { margin: 12px 0 0; color: #182d21; font-size: 34px; line-height: 1.03; letter-spacing: -0.04em; font-weight: 950; }
        .product-price { margin-top: 12px; color: #234b36; font-size: 30px; line-height: 1; font-weight: 950; }
        .product-detail, .product-description { margin-top: 10px; color: #6a786c; font-size: 14px; line-height: 1.65; font-weight: 600; }
        .product-action { margin-top: auto; padding-top: 20px; }
        .product-action a { display: inline-flex; width: 100%; min-height: 50px; align-items: center; justify-content: center; border-radius: 13px; background: #214a35; color: #fff; font-size: 14px; font-weight: 950; }
        .shop-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 24px; }
        .notice, .empty { margin-top: 24px; padding: 18px 20px; border-radius: 18px; background: #fff7e8; border: 1px solid rgba(160, 123, 61, 0.28); color: #645f4d; font-size: 14px; line-height: 1.6; font-weight: 650; }
        .empty { text-align: center; background: rgba(255,255,255,0.74); border-style: dashed; color: #6a786c; }
        .story-band { overflow: hidden; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 0; border-radius: 30px; background: #e5e8de; box-shadow: 0 16px 42px rgba(41, 34, 18, 0.06); }
        .story-band img { width: 100%; height: 100%; min-height: 430px; display: block; object-fit: cover; }
        .story-band-copy { display: flex; flex-direction: column; justify-content: center; padding: clamp(26px, 4vw, 44px); }
        .story-band-copy p { max-width: 500px; }
        .footer { padding: 28px 0 48px; color: #667466; font-size: 13px; font-weight: 700; border-top: 1px solid rgba(24, 50, 37, 0.1); }
        @media (max-width: 1080px) { .collections-grid { grid-template-columns: 1fr 1fr; } .shop-preview, .process-band, .section-grid, .story-band { grid-template-columns: 1fr; } .product-card { grid-template-columns: 1fr; } .product-card img, .product-fallback { min-height: 270px; } }
        @media (max-width: 700px) { .topbar { min-height: 64px; } .brand-name { font-size: 26px; } .hero, .hero-content { min-height: 760px; } .collections-grid { grid-template-columns: 1fr; } .section { padding: 54px 0; } }
        @media (max-width: 700px) {
          .farmfolks-home .hero-content { top: 16px; right: 16px; width: min(320px, calc(100% - 32px)); padding: 17px; }
          .farmfolks-home .hero h1 { font-size: 36px; }
          .farmfolks-home .hero p { font-size: 14px; }
          .farmfolks-home .hero-actions .btn, .farmfolks-home .hero-actions .btn-outline { min-height: 44px; padding: 0 14px; font-size: 12px; }
        }
        .farmfolks-home .ff-hero-nav { display: flex; align-items: center; gap: clamp(15px, 2.4vw, 28px); }
        .farmfolks-home .ff-nav-shop { background: #163a29; color: white; padding: 12px 20px; border-radius: 999px; font-size: 13px; font-weight: 900; }
        .farmfolks-home .ff-nav-shop span { margin-left: 6px; }
        .farmfolks-home .ff-hero-location { color: #a07428; font-size: 12px; font-weight: 950; letter-spacing: .18em; text-transform: uppercase; }
        .farmfolks-home .hero-actions .btn { background: #153d2b; color: #fff; box-shadow: 0 8px 25px rgba(0,0,0,.13); }
        .farmfolks-home .hero-actions .btn-outline { border: 1.5px solid #284c35; color: #173827; background: rgba(255,243,219,.65); backdrop-filter: blur(3px); }
        .farmfolks-home .hero-actions a span { margin-left: 10px; }
        @media (max-width: 960px) {
          .farmfolks-home .hero-content { left: 39%; width: 59%; top: 10%; }
          .farmfolks-home .hero h1 { font-size: clamp(43px, 6.5vw, 68px); }
          .farmfolks-home .hero p { font-size: clamp(17px, 2.3vw, 23px); }
        }
        @media (max-width: 700px) {
          .farmfolks-home .topbar { flex-wrap: wrap; gap: 10px; padding: 12px 0; }
          .farmfolks-home .ff-hero-nav { gap: 12px; }
          .farmfolks-home .ff-hero-nav .nav-link { font-size: 11px; }
          .farmfolks-home .ff-nav-shop { padding: 10px 13px; font-size: 11px; }
          .farmfolks-home .hero { min-height: 630px; background-position: 37% center; }
          .farmfolks-home .hero-content { top: 26px; left: 5%; width: 90%; min-height: 0; padding: 12px 8px; }
          .farmfolks-home .hero h1 { font-size: clamp(40px, 9vw, 58px); white-space: normal; }
          .farmfolks-home .hero p { font-size: 17px; }
          .farmfolks-home .ff-hero-location { font-size: 10px; }
          .farmfolks-home .hero-actions { margin-top: 15px; gap: 8px; }
          .farmfolks-home .hero-actions a { min-height: 44px; padding: 0 14px; font-size: 12px; }
        }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <div className="brand-stack">
            <span className="brand-name">Farm Folks</span>
            <span className="brand-sub">Okeechobee, Florida</span>
          </div>
          <nav className="ff-hero-nav" aria-label="Farm Folks navigation">
            <a className="nav-link" href="#farm-story">Our Farm</a>
            <a className="nav-link" href="#ordering-steps">How It Works</a>
            <a className="ff-nav-shop" href="#shop-preview">Shop Now <span aria-hidden="true">&rarr;</span></a>
          </nav>
        </header>

        <section className="hero" aria-label="Farm Folks farm">
          <div className="hero-content">
            <div className="ff-hero-location">Okeechobee, Florida</div>
            <h1>Farm Folks</h1>
            <p>Raised with care. From our farm to your table.</p>
            <div className="hero-actions">
              <a className="btn" href="#shop-preview">Shop the Farm <span aria-hidden="true">&rarr;</span></a>
              <a className="btn-outline" href="#farm-story">Meet the Farm <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
        </section>

        <section className="section" id="farm-story">
          <div className="section-grid">
            <div className="section-copy">
              <div className="eyebrow" style={{ color: "#9a7340" }}>A real farm brand experience</div>
              <h2>This should feel like Farm Folks' own landing page.</h2>
              <p>
                The goal is not to dress up a marketplace page. The goal is to give Farm Folks a distinct online presence that feels premium, trustworthy, and clearly different from the standard seller pages inside the Live Meat Market.
              </p>
              <p>
                That means leading with story, atmosphere, and product collections first â€” then guiding buyers into a cleaner shopping flow.
              </p>
            </div>
            <div className="story-card" aria-label="Farm Folks brand image" />
          </div>
        </section>

        <section className="section">
          <div className="collections-head">
            <div className="eyebrow" style={{ color: "#9a7340" }}>Shop by collection</div>
            <h2>Shop Fresh From the Farm</h2>
            <p>
              Explore farm-direct beef, fresh eggs, dairy, and farm favorites. Select a collection to see what Farm Folks has available.
            </p>
          </div>

          <div className="collections-grid">
            {collections.map((collection) => (
              <article className="collection-card" key={collection.title}>
                <img src={collection.image} alt={collection.title} />
                <div className="collection-card-body">
                  <h3>{collection.title}</h3>
                  <p>{collection.description}</p>
                  <div className="collection-meta">
                    {collection.count > 0 ? `${collection.count} current listings` : "Collection preview"}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="process-head" id="ordering-steps">
            <div className="eyebrow" style={{ color: "#9a7340" }}>Ordering made simpler</div>
            <h2>Built around how Farm Folks actually sells.</h2>
            <p>
              This custom landing page is meant to support the real farm workflow: farm-direct ordering, reserve-and-pickup flow, variable-weight products, deposits when needed, and remaining balances at pickup.
            </p>
          </div>

          <div className="process-band">
            <article className="process-step">
              <div className="step-number">1</div>
              <h3>Explore what's available</h3>
              <p>Customers browse a cleaner curated storefront with better product presentation and clearer product details.</p>
            </article>

            <article className="process-step">
              <div className="step-number">2</div>
              <h3>Reserve with confidence</h3>
              <p>For some products, buyers can reserve online, place deposits where appropriate, and confirm pickup arrangements directly with the farm.</p>
            </article>

            <article className="process-step">
              <div className="step-number">3</div>
              <h3>Finish at pickup</h3>
              <p>Variable-weight products can support estimated totals first, then settle the remaining balance at pickup once actual package weight is known.</p>
            </article>
          </div>
        </section>

        <section className="section" id="shop-preview">
          <div className="shop-head">
            <div className="eyebrow" style={{ color: "#9a7340" }}>Signature picks</div>
            <h2>Available from the farm right now.</h2>
            <p>
              These items come from Farm Folks' current live product records, but they are presented here as part of a custom storefront experience rather than a standard marketplace listing.
            </p>
          </div>

          {loading ? <div className="notice">Loading current Farm Folks products...</div> : null}
          {error ? <div className="notice">{error} <Link to={STORE}>Visit the current Farm Folks store.</Link></div> : null}
          {!loading && !error && featured.length === 0 ? <div className="empty">Farm Folks does not have active products listed right now. You can still visit the current seller page while this custom storefront continues to be developed.</div> : null}

          {!loading && !error && featured.length > 0 ? (
            <div className="shop-preview">
              {featured.map((product) => {
                const image = productImage(product);
                const details = [clean(product.package), clean(product.quantity_available), clean(product.pickup_timing), clean(product.availability)]
                  .filter(Boolean)
                  .join(" â€¢ ");

                return (
                  <article className="product-card" key={product.id}>
                    {image ? <img src={image} alt={product.name} /> : <div className="product-fallback">Farm Folks product</div>}
                    <div className="product-body">
                      <div className="product-kicker">{clean(product.category) || "Farm product"}</div>
                      <h3>{product.name}</h3>
                      <div className="product-price">{clean(product.price) || "Ask for pricing"}</div>
                      {details ? <div className="product-detail">{details}</div> : null}
                      {clean(product.description) ? <div className="product-description">{clean(product.description)}</div> : null}
                      <div className="product-action">
                        <Link to={STORE}>Order through Farm Folks</Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          <div className="shop-actions">
            <Link className="btn" to={STORE}>Visit full Farm Folks store</Link>
            <Link className="btn-outline" to={MARKET} style={{ color: "#193123", borderColor: "rgba(25,49,35,0.18)", background: "rgba(255,255,255,0.56)" }}>Back to Live Market</Link>
          </div>
        </section>

        <section className="section">
          <div className="story-band">
            <img src="/images/farm-folks-owner.jpg" alt="Farm Folks owner or farm representative" />
            <div className="story-band-copy">
              <div className="eyebrow" style={{ color: "#9a7340" }}>Why this matters</div>
              <h2>From market listing to real farm operating system.</h2>
              <p>
                The long-term HomePlanet goal is not just a better-looking page. It is a better farm system: clearer product presentation, ordering, pickup coordination, customer history, and an experience Farm Folks can be proud to send customers to directly.
              </p>
              <p>
                This page is the visual shift that helps customers instantly feel the difference.
              </p>
            </div>
          </div>
        </section>

        <footer className="footer">
          Farm Folks LLC â€¢ Custom HomePlanet storefront preview â€¢ Powered by HomePlanet and connected to the Okeechobee Live Meat Market
        </footer>
      </div>
    </main>
  );
}
