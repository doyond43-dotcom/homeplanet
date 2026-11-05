import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

type TrinityProduct = {
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

const STORE = "/planet/okeechobee/meat-market/seller/trinity-ranch-beef";
const MARKET = "/planet/okeechobee/meat-market";

function clean(text?: string) {
  return String(text || "").replace(/\s+/g, " ").trim();
}


const TRINITY_COLLECTION_PHOTOS: Record<string, string> = {
  Steaks: "/images/Trinity%20Ranch/trinity-ranch-steaks.png",
  Roasts: "/images/Trinity%20Ranch/rustic_herb_crusted_roast_slices.png",
  "Ground Beef": "/images/Trinity%20Ranch/trinity-ranch-ground-beef.png",
  "Beef Shares": "/images/Trinity%20Ranch/rustic_farmhouse_butcher_s_display.png",
};

function productImage(product?: TrinityProduct) {
  if (!product) return "";
  if (clean(product.image_url)) return clean(product.image_url);

  const name = clean(product.name).toLowerCase();
  if (/share|quarter|half beef|whole beef|bundle|box|sixteenth|eighth/.test(name))
    return TRINITY_COLLECTION_PHOTOS["Beef Shares"];
  if (/ground|hamburger|burger|patty|carnivore blend/.test(name))
    return TRINITY_COLLECTION_PHOTOS["Ground Beef"];
  if (/roast|brisket|chuck|stew/.test(name))
    return TRINITY_COLLECTION_PHOTOS.Roasts;
  if (/steak|ribeye|sirloin|filet|t-bone|strip|wagyu|porterhouse|tomahawk|denver|picanha|flank|skirt|tri-tip/.test(name))
    return TRINITY_COLLECTION_PHOTOS.Steaks;

  return TRINITY_COLLECTION_PHOTOS["Beef Shares"];
}

function categoryImage(label: string) {
  const value = label.toLowerCase();
  if (value.includes("egg")) return "";
  if (value.includes("dairy")) return "";
  if (value.includes("honey") || value.includes("farm goods")) return "";
  return "";
}

export default function TrinityRanchProPreview() {
  const [products, setProducts] = useState<TrinityProduct[]>([]);
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
        .eq("seller_listing_id", "trinity-ranch-beef")
        .eq("status", "Active")
        .order("sort_order", { ascending: true });

      if (!active) return;

      if (result.error) {
        setError("Current Trinity Ranch products could not be loaded right now. You can still view the seller storefront.");
      } else {
        setProducts((result.data || []) as TrinityProduct[]);
      }

      setLoading(false);
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const [selectedCollection, setSelectedCollection] = useState<string>("All");

  function collectionFor(product: TrinityProduct): string {
    const name = clean(product.name).toLowerCase();
    const category = clean(product.category).toLowerCase();
    const value = `${name} ${category}`;
    if (/share|quarter|half beef|whole beef|bundle|box/.test(value)) return "Beef Shares";
    if (/ground|hamburger|burger|patty/.test(value)) return "Ground Beef";
    if (/roast|brisket|chuck|stew/.test(value)) return "Roasts";
    if (/steak|ribeye|sirloin|filet|t-bone|strip|wagyu/.test(value)) return "Steaks";
    return "Other Cuts";
  }

  const collections = useMemo(() => {
    const descriptions: Record<string, string> = {
      Steaks: "Ranch-raised cuts for the grill and special occasions.",
      Roasts: "Slow-cooked favorites and hearty family meals.",
      "Ground Beef": "Everyday beef for burgers, tacos, and home cooking.",
      "Beef Shares": "Explore beef shares and larger family orders.",
      "Other Cuts": "Discover more of the ranch's current offerings.",
    };
    return Object.entries(descriptions).map(([title, description]) => ({
      title,
      description,
      image: TRINITY_COLLECTION_PHOTOS[title] || TRINITY_COLLECTION_PHOTOS['Beef Shares'],
      count: products.filter((product) => collectionFor(product) === title).length,
    })).filter((item) => item.count > 0);
  }, [products]);

  const visibleProducts = useMemo(
    () => selectedCollection === "All"
      ? products.slice(0, 4)
      : products.filter((product) => collectionFor(product) === selectedCollection),
    [products, selectedCollection]
  );

  return (
    <main className="trinity-home">
      <style>{`
        :root { color-scheme: light; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #f4eee2; color: #18291f; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .trinity-home { min-height: 100vh; background: radial-gradient(circle at top right, rgba(176, 138, 67, 0.14), transparent 30rem), linear-gradient(180deg, #f6f1e6 0%, #f2ebde 100%); color: #18291f; }
        .trinity-home * { box-sizing: border-box; }
        .trinity-home a { text-decoration: none; }
        .shell { width: min(100% - 34px, 1240px); margin: 0 auto; }
        .topbar { position: relative; z-index: 3; min-height: 78px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .brand-stack { display: flex; flex-direction: column; gap: 4px; }
        .brand-name { font-family: Georgia, "Times New Roman", serif; font-size: 32px; line-height: 1; font-weight: 700; letter-spacing: -0.05em; color: #193224; }
        .brand-sub { font-size: 10px; line-height: 1; font-weight: 850; letter-spacing: .14em; text-transform: uppercase; color: #9a7340; }
        .nav-link { color: #193224; font-size: 13px; font-weight: 900; }
        .hero { position: relative; min-height: 520px; border-radius: 36px; overflow: hidden; background: linear-gradient(90deg, rgba(255,243,217,.02) 0%, rgba(255,241,209,.07) 43%, rgba(255,241,209,.15) 100%), url('/images/Trinity%20Ranch/Florida%20Ranch%20Sunset%20Pasture.png') 58% 52% / cover no-repeat; box-shadow: 0 32px 90px rgba(40,30,16,.18); }
        .hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(250,239,215,.08), transparent 47%); pointer-events: none; }
        .hero-content { position: absolute; z-index: 1; top: 12%; left: 0; width: 100%; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 18px 10px; color: #102d21; text-align: center; text-shadow: 0 1px 16px rgba(255,240,208,.72); }
        .eyebrow { font-size: 12px; line-height: 1; font-weight: 950; letter-spacing: 0.16em; text-transform: uppercase; color: #e5c98e; }
        .hero h1 { margin: 12px 0 6px; font-family: Georgia, "Times New Roman", serif; font-size: clamp(54px, 6vw, 78px); line-height: .98; letter-spacing: -.055em; font-weight: 700; color: #0a2b1d; white-space: nowrap; }
        .hero p { max-width: 570px; margin: 16px 0 0; color: #102b1c; font-family: Georgia, "Times New Roman", serif; font-size: clamp(18px, 2vw, 27px); line-height: 1.4; font-weight: 700; background: rgba(250,242,224,.55); padding: 8px 16px; border-radius: 12px; text-shadow: none; }
        .hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 22px; }
        .btn, .btn-outline { display: inline-flex; align-items: center; justify-content: center; min-height: 56px; padding: 0 24px; border-radius: 14px; font-size: 14px; font-weight: 950; letter-spacing: 0.01em; }
        .btn { background: linear-gradient(180deg, #e4c37f 0%, #d7ae64 100%); color: #193123; box-shadow: 0 16px 34px rgba(0, 0, 0, 0.16); }
        .btn-outline { background: rgba(255, 255, 255, 0.09); color: #fff; border: 1px solid rgba(255, 255, 255, 0.22); backdrop-filter: blur(5px); }
        .hero-note { display: none; }
        .section { padding: 72px 0; }
        .section-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 32px; align-items: center; }
        .section-copy h2, .collections-head h2, .shop-head h2, .process-head h2, .story-band-copy h2 { margin: 12px 0 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(42px, 5vw, 60px); line-height: 1.02; letter-spacing: -0.05em; font-weight: 700; color: #193224; }
        .section-copy p, .collections-head p, .shop-head p, .process-head p, .story-band-copy p { margin: 14px 0 0; color: #657365; font-size: 17px; line-height: 1.75; font-weight: 550; }
        .story-card { position: relative; overflow: hidden; min-height: 340px; border-radius: 28px; background: url('/images/Trinity%20Ranch/good_beef_real_connections.png') center center / contain no-repeat; background-color: #243527; box-shadow: 0 18px 50px rgba(47, 36, 20, 0.08); }
        .story-card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(13, 22, 16, 0.06), rgba(13, 22, 16, 0.28)); }
        .collections-head, .shop-head, .process-head { max-width: 840px; }
        .collections-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; margin-top: 28px; }
        .collection-card { display: flex; flex-direction: column; overflow: hidden; border-radius: 24px; background: rgba(255,255,255,0.9); border: 1px solid rgba(25,50,37,0.1); box-shadow: 0 14px 34px rgba(43, 33, 18, 0.06); }
        .collection-photo-placeholder { height: 250px; display: flex; align-items: center; justify-content: center; padding: 24px; background: linear-gradient(145deg, #263f30, #47634c); color: #f6e9cd; font-family: Georgia, serif; font-size: 30px; font-weight: 700; text-align: center; }
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
        .story-band img { width: 100%; height: auto; min-height: 0; display: block; object-fit: contain; background: transparent; align-self: center; }
        .story-band-copy { display: flex; flex-direction: column; justify-content: center; padding: clamp(26px, 4vw, 44px); }
        .story-band-copy p { max-width: 500px; }
        .footer { padding: 28px 0 48px; color: #667466; font-size: 13px; font-weight: 700; border-top: 1px solid rgba(24, 50, 37, 0.1); }
        @media (max-width: 1080px) { .collections-grid { grid-template-columns: 1fr 1fr; } .shop-preview, .process-band, .section-grid, .story-band { grid-template-columns: 1fr; } .product-card { grid-template-columns: 1fr; } .product-card img, .product-fallback { min-height: 270px; } }
        @media (max-width: 700px) { .topbar { min-height: 64px; } .brand-name { font-size: 26px; } .hero, .hero-content { min-height: 760px; } .collections-grid { grid-template-columns: 1fr; } .section { padding: 54px 0; } }
        @media (max-width: 700px) {
          .trinity-home .hero-content { top: 16px; right: 16px; width: min(320px, calc(100% - 32px)); padding: 17px; }
          .trinity-home .hero h1 { font-size: 36px; }
          .trinity-home .hero p { font-size: 14px; }
          .trinity-home .hero-actions .btn, .trinity-home .hero-actions .btn-outline { min-height: 44px; padding: 0 14px; font-size: 12px; }
        }
        .trinity-home .tr-hero-nav { display: flex; align-items: center; gap: clamp(15px, 2.4vw, 28px); }
        .trinity-home .tr-nav-shop { background: #163a29; color: white; padding: 12px 20px; border-radius: 999px; font-size: 13px; font-weight: 900; }
        .trinity-home .tr-nav-shop span { margin-left: 6px; }
        .trinity-home .tr-hero-location { color: #a07428; font-size: 12px; font-weight: 950; letter-spacing: .18em; text-transform: uppercase; }
        .trinity-home .hero-actions .btn { background: #153d2b; color: #fff; box-shadow: 0 8px 25px rgba(0,0,0,.13); }
        .trinity-home .hero-actions .btn-outline { border: 1.5px solid #284c35; color: #173827; background: rgba(255,243,219,.65); backdrop-filter: blur(3px); }
        .trinity-home .hero-actions a span { margin-left: 10px; }
        @media (max-width: 960px) {
          .trinity-home .hero-content { left: 39%; width: 59%; top: 10%; }
          .trinity-home .hero h1 { font-size: clamp(43px, 6.5vw, 68px); }
          .trinity-home .hero p { font-size: clamp(17px, 2.3vw, 23px); }
        }
        @media (max-width: 700px) {
          .trinity-home .topbar { flex-wrap: wrap; gap: 10px; padding: 12px 0; }
          .trinity-home .tr-hero-nav { gap: 12px; }
          .trinity-home .tr-hero-nav .nav-link { font-size: 11px; }
          .trinity-home .tr-nav-shop { padding: 10px 13px; font-size: 11px; }
          .trinity-home .hero { min-height: 630px; background-position: 37% center; }
          .trinity-home .hero-content { top: 86px; left: 5%; width: 90%; min-height: 0; padding: 12px 8px; }
          .trinity-home .hero h1 { font-size: clamp(40px, 9vw, 58px); white-space: normal; }
          .trinity-home .hero p { font-size: 17px; }
          .trinity-home .tr-hero-location { font-size: 10px; }
          .trinity-home .hero-actions { margin-top: 15px; gap: 8px; }
          .trinity-home .hero-actions a { min-height: 44px; padding: 0 14px; font-size: 12px; }
        }

        /* TRINITY_BOTTOM_STORY_RESTORE */
        .trinity-home .story-band {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: stretch;
          gap: 0;
          overflow: hidden;
          border-radius: 30px;
          background: #e5e8de;
          box-shadow: 0 16px 42px rgba(41,34,18,.06);
        }
        .trinity-home .story-band img {
          display: block;
          width: 100%;
          height: 430px;
          min-height: 430px;
          object-fit: contain;
          object-position: center;
          border-radius: 0;
          background: #243527;
        }
        .trinity-home .story-band-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(26px,4vw,44px);
          background: transparent;
          border-radius: 0;
        }
        @media (max-width: 1080px) {
          .trinity-home .story-band {
            grid-template-columns: 1fr;
          }
          .trinity-home .story-band img {
            height: auto;
            min-height: 0;
          }
        }

      `}</style>

      <div className="shell">
        <header className="topbar">
          <div className="brand-stack">
            <span className="brand-name">Trinity Ranch</span>
            <span className="brand-sub">Okeechobee, Florida</span>
          </div>
          <nav className="tr-hero-nav" aria-label="Trinity Ranch navigation">
            <a className="nav-link" href="#farm-story">Our Ranch</a>
            <a className="nav-link" href="#ordering-steps">How It Works</a>
            <a className="tr-nav-shop" href="#shop-preview">Shop Now <span aria-hidden="true">&rarr;</span></a>
          </nav>
        </header>

        <section className="hero" aria-label="Trinity Ranch cattle pasture">
          <div className="hero-content">
            <div className="tr-hero-location">Okeechobee, Florida</div>
            <h1>Trinity Ranch</h1>
            <p>Ranch-raised beef. From our pasture to your table.</p>
            <div className="hero-actions">
              <a className="btn" href="#shop-preview">Shop the Ranch <span aria-hidden="true">&rarr;</span></a>
              <a className="btn-outline" href="#farm-story">Meet the Ranch <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
        </section>

        <section className="section" id="farm-story">
          <div className="section-grid">
            <div className="section-copy">
              <div className="eyebrow" style={{ color: "#9a7340" }}>Get to know Trinity Ranch</div>
              <h2>Good beef. Real connections. Trinity Ranch.</h2>
              <p>
                Get to know the ranch behind the beef. Explore cuts, shares, and everyday favorites, and connect with the people raising cattle in Okeechobee.
              </p>
              <p>
                Explore the beef selections and contact Trinity Ranch directly to confirm current availability and delivery or pickup arrangements.
              </p>
            </div>
<div className="story-card" aria-label="Ranch-inspired preview artwork" />
          </div>
        </section>

        <section className="section">
          <div className="collections-head">
            <div className="eyebrow" style={{ color: "#9a7340" }}>Shop by collection</div>
            <h2>Shop Beef From the Ranch</h2>
            <p>
              Browse steaks, roasts, ground beef, and beef shares. Choose a collection to explore the current Trinity Ranch listings.
            </p>
          </div>

          <div className="collections-grid">
            {collections.filter((collection) => collection.title !== 'Other Cuts').map((collection) => (
              <button
                type="button"
                className="collection-card"
                key={collection.title}
                onClick={() => { setSelectedCollection(collection.title); document.getElementById("shop-preview")?.scrollIntoView({ behavior: "smooth" }); }}
                aria-label={`Explore ${collection.title}`}
                style={{ textAlign: "left", padding: 0, font: "inherit", cursor: "pointer" }}
              >
                {collection.image ? <img src={collection.image} alt={collection.title} /> : <div className="collection-photo-placeholder"><span>{collection.title}</span></div>}
                <div className="collection-card-body">
                  <h3>{collection.title}</h3>
                  <p>{collection.description}</p>
                  <div className="collection-meta">
                    {collection.count > 0 ? `${collection.count} current listings` : "Collection preview"}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {collections.some((collection) => collection.title === "Other Cuts") ? (
            <button
              type="button"
              onClick={() => {
                setSelectedCollection("Other Cuts");
                document.getElementById("shop-preview")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ marginTop: 20, padding: "14px 22px", borderRadius: 12, border: "1px solid #b9c5b5", background: "#fff", color: "#214a35", cursor: "pointer", fontWeight: 800 }}
            >
              Explore Other Cuts
            </button>
          ) : null}
        </section>

        <section className="section">
          <div className="process-head" id="ordering-steps">
            <div className="eyebrow" style={{ color: "#9a7340" }}>Ordering made simpler</div>
            <h2>Ranch-raised shopping, made simple.</h2>
            <p>
              Explore current beef selections, review product details, and connect with Trinity Ranch about ordering, pickup, and local delivery.
            </p>
          </div>

          <div className="process-band">
            <article className="process-step">
              <div className="step-number">1</div>
              <h3>Explore what's available</h3>
              <p>Explore Trinity Ranch beef cuts, shares, and current offerings.</p>
            </article>

            <article className="process-step">
              <div className="step-number">2</div>
              <h3>Reserve with confidence</h3>
              <p>Contact Trinity Ranch about current pricing, availability, quantities, and ordering options.</p>
            </article>

            <article className="process-step">
              <div className="step-number">3</div>
              <h3>Arrange fulfillment</h3>
              <p>Confirm payment, pickup, or delivery arrangements directly with the ranch.</p>
            </article>
          </div>
        </section>

        <section className="section" id="shop-preview">
          <div className="shop-head">
            <div className="eyebrow" style={{ color: "#9a7340" }}>Signature picks</div>
            <h2>Explore Trinity Ranch beef.</h2>
            <p>
              Discover beef offerings from Trinity Ranch. Contact the ranch to confirm current availability, pricing, and ordering details.
            </p>
            {selectedCollection !== "All" ? (
              <button type="button" onClick={() => setSelectedCollection("All")} style={{ marginTop: 16, padding: "12px 18px", borderRadius: 12, background: "#214a35", color: "#fff", border: 0, cursor: "pointer", fontWeight: 800 }}>
                Viewing {selectedCollection} Â· Show featured products
              </button>
            ) : null}
          </div>

          {loading ? <div className="notice">Loading current Trinity Ranch products...</div> : null}
          {error ? <div className="notice">{error} <Link to={STORE}>Visit the current Trinity Ranch store.</Link></div> : null}
          {!loading && !error && visibleProducts.length === 0 ? <div className="empty">No active products are available for this preview right now. Please visit the current Trinity Ranch seller page.</div> : null}

          {!loading && !error && visibleProducts.length > 0 ? (
            <div className="shop-preview">
              {visibleProducts.map((product) => {
                const image = productImage(product);
                const details = [clean(product.package), clean(product.quantity_available), clean(product.pickup_timing), clean(product.availability)]
                  .filter(Boolean)
                  .join(" | ");

                return (
                  <article className="product-card" key={product.id}>
                    {image ? <img src={image} alt={product.name} /> : <div className="product-fallback">Product photo coming soon</div>}
                    <div className="product-body">
                      <div className="product-kicker">{clean(product.category) || "Ranch product"}</div>
                      <h3>{product.name}</h3>
                      <div className="product-price">{clean(product.price) || "Ask for pricing"}</div>
                      {details ? <div className="product-detail">{details}</div> : null}
                      {clean(product.description) ? <div className="product-description">{clean(product.description)}</div> : null}
                      <div className="product-action">
                        <Link to={STORE}>Ask Trinity Ranch about this cut</Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          <div className="shop-actions">
            <Link className="btn" to={STORE}>Visit Trinity Ranch store</Link>
            <Link className="btn-outline" to={MARKET} style={{ color: "#193123", borderColor: "rgba(25,49,35,0.18)", background: "rgba(255,255,255,0.56)" }}>Back to Live Market</Link>
          </div>
        </section>

        <section className="section">
          <div className="story-band">
            <img src="/images/Trinity%20Ranch/golden_hour_family_ranch_portrait.png" alt="Ranch-inspired preview artwork" />
            <div className="story-band-copy">
              <div className="eyebrow" style={{ color: "#9a7340" }}>Why this matters</div>
              <h2>Rooted in the ranch. Built around the people.</h2>
              <p>
                Trinity Ranch connects local customers with the ranchers and care behind their beef. Every order is an opportunity to learn where your food comes from.
              </p>
              <p>
                From weeknight ground beef to special-occasion steaks and family shares, explore what is available and connect directly with the ranch.
              </p>
            </div>
          </div>
        </section>

        <footer className="footer">
          Trinity Ranch Beef | Custom storefront concept by HomePlanet | Part of the Okeechobee Live Market
        </footer>
      </div>
    </main>
  );
}
