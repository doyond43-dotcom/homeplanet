import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type MarketItem = {
  id: number | string;
  category: string;
  title: string;
  price: string;
  amount: string;
  seller: string;
  location: string;
  fulfillment: string;
  badge?: string;
  phone?: string;
  orderHref?: string;
  sellerHref?: string;
  sellerImage?: string;
};

const categories = [
  "Everything",
  "Beef",
  "Pork",
  "Chicken",
  "Eggs",
  "More",
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

function marketCategory(selling: string) {
  const value = selling.toLowerCase();

  if (
    value.includes("processor") ||
    value.includes("processing") ||
    value.includes("butcher") ||
    value.includes("cut and wrap") ||
    value.includes("custom cuts")
  ) {
    return "Processors";
  }

  if (
    value.includes("raw milk") ||
    value.includes("raw dairy") ||
    value.includes("kefir") ||
    value.includes("cream") ||
    value.includes("butter")
  ) {
    return "Raw Dairy";
  }

  if (value.includes("honey")) {
    return "Honey";
  }

  if (value.includes("egg")) {
    return "Eggs";
  }

  if (
    value.includes("chicken") ||
    value.includes("poultry")
  ) {
    return "Chicken";
  }

  if (
    value.includes("pork") ||
    value.includes("hog") ||
    value.includes("sausage") ||
    value.includes("bacon")
  ) {
    return "Pork";
  }

  if (
    value.includes("beef share") ||
    value.includes("quarter beef") ||
    value.includes("half beef") ||
    value.includes("whole beef")
  ) {
    return "Beef Shares";
  }

  if (
    value.includes("ribeye") ||
    value.includes("steak") ||
    value.includes("sirloin") ||
    value.includes("filet")
  ) {
    return "Steaks";
  }

  if (value.includes("roast")) {
    return "Roasts";
  }

  if (
    value.includes("ground beef") ||
    value.includes("hamburger")
  ) {
    return "Ground Beef";
  }

  if (value.includes("beef")) {
    return "Beef";
  }

  return "Everything";
}


function sellerImage(seller: string) {
  const value = String(seller || "").trim().toLowerCase();

  if (value.includes("farm folks")) {
    return "/images/farm-folks-beef-patties.jpg";
  }

  return "";
}

function usablePhone(value: string) {
  const clean = String(value || "").trim();

  if (!clean || clean.includes("@")) return "";

  const digits = clean.replace(/\D/g, "");

  return digits.length >= 7 ? clean : "";
}

function phoneHref(value: string, mode: "call" | "text") {
  const digits = String(value || "").replace(/[^\d+]/g, "");

  return mode === "text"
    ? `sms:${digits}`
    : `tel:${digits}`;
}

function sellerStorefrontHref(seller: string) {
  const normalizedSeller = String(seller || "").trim().toLowerCase();

  if (normalizedSeller === "farm folks llc") {
    return "/planet/okeechobee/meat-market/seller/farm-folks";
  }

  const slug = normalizedSeller
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `/planet/okeechobee/meat-market/seller/${slug}`;
}

function usableOrderHref(value: string) {
  const clean = String(value || "").trim();

  if (!clean || clean.toLowerCase() === "not provided") {
    return "";
  }

  if (/^https?:\/\//i.test(clean)) {
    return clean;
  }

  if (clean.includes(".") && !clean.includes(" ")) {
    return `https://${clean}`;
  }

  return "";
}
export default function OkeechobeeLiveMeatMarketPage() {
  const [activeCategory, setActiveCategory] = useState("Everything");
  const [liveItems, setLiveItems] = useState<MarketItem[]>([]);
  const [marketLoading, setMarketLoading] = useState(true);

  useEffect(() => {
    async function loadLiveMarket() {
      const [
        { data: sellerData, error: sellerError },
        { data: productData, error: productError },
      ] = await Promise.all([
        supabase
          .from("okeechobee_events")
          .select("id,title,description,location,contact,status,created_at")
          .eq("type", "Live Meat Market Seller")
          .eq("status", "Active")
          .order("created_at", { ascending: false }),

        supabase
          .from("okeechobee_meat_market_products")
          .select(
            "id,seller_listing_id,seller_name,name,price,package,fulfillment,availability,status,sort_order"
          )
          .eq("status", "Active")
          .order("sort_order", { ascending: true }),
      ]);

      if (sellerError) {
        console.error(
          "Could not load live Meat Market sellers:",
          sellerError
        );
        setLiveItems([]);
        setMarketLoading(false);
        return;
      }

      if (productError) {
        console.error(
          "Could not load Meat Market products:",
          productError
        );
      }

      const products = productError ? [] : productData || [];

      const mapped: MarketItem[] = (sellerData || []).flatMap(
        (listing: any) => {
          const selling =
            listingDetail(listing.description, "Selling") ||
            "Local food available";

          const sellerPrice =
            listingDetail(listing.description, "Price / Package") ||
            "Contact seller";

          const sellerFulfillment =
            listingDetail(listing.description, "Pickup / Delivery") ||
            "Contact seller for pickup or delivery";

          const submittedLink =
            listingDetail(
              listing.description,
              "Website / Facebook / Order Link"
            );

          const submittedPhoto =
            listingDetail(
              listing.description,
              "Listing Photo"
            );

          const seller =
            String(listing.title || "")
              .replace(/^Live Meat Market Seller:\s*/i, "")
              .trim() || "Local Seller";

          const sellerProducts = products.filter(
            (product: any) =>
              String(product.seller_name || "")
                .trim()
                .toLowerCase() === seller.toLowerCase()
          );

          if (sellerProducts.length > 0) {
            return sellerProducts.map((product: any) => {
              const productName =
                String(product.name || "").trim() ||
                "Local food available";

              const productPrice =
                String(product.price || "").trim() ||
                "Contact seller";

              const productFulfillment =
                String(product.fulfillment || "").trim() ||
                sellerFulfillment;

              const productAmount =
                String(product.package || "").trim() ||
                String(product.availability || "").trim() ||
                "Available now";

              return {
                id: product.id,
                category: marketCategory(productName),
                title: productName,
                price: productPrice,
                amount: productAmount,
                seller,
                location: listing.location || "Okeechobee area",
                fulfillment: productFulfillment,
                badge: "AVAILABLE NOW",
                phone: usablePhone(String(listing.contact || "")),
                orderHref: `/planet/okeechobee/meat-market/contact?${new URLSearchParams(
                  {
                    mode: "order",
                    listingId: String(listing.id),
                    seller,
                    product: productName,
                    price: productPrice,
                    fulfillment: productFulfillment,
                  }
                ).toString()}`,
                sellerHref: sellerStorefrontHref(seller),
                sellerImage: usableOrderHref(submittedPhoto),
              };
            });
          }

          return [
            {
              id: listing.id,
              category: marketCategory(selling),
              title: selling,
              price: sellerPrice,
              amount: "Available now",
              seller,
              location: listing.location || "Okeechobee area",
              fulfillment: sellerFulfillment,
              badge: "AVAILABLE NOW",
              phone: usablePhone(String(listing.contact || "")),
              orderHref: `/planet/okeechobee/meat-market/contact?${new URLSearchParams(
                {
                  mode: "order",
                  listingId: String(listing.id),
                  seller,
                  product: selling,
                  price: sellerPrice,
                  fulfillment: sellerFulfillment,
                }
              ).toString()}`,
              sellerHref: sellerStorefrontHref(seller),
              sellerImage: usableOrderHref(submittedPhoto),
            },
          ];
        }
      );

      setLiveItems(mapped);
      setMarketLoading(false);
    }

    loadLiveMarket();
  }, []);

  const marketItems = liveItems;

  const visibleItems = useMemo(() => {
    if (activeCategory === "Everything") return marketItems;

    if (activeCategory === "Beef") {
      return marketItems.filter((item) =>
        [
          "Beef",
          "Ground Beef",
          "Steaks",
          "Roasts",
          "Beef Shares",
        ].includes(item.category)
      );
    }

    if (activeCategory === "More") {
      return marketItems.filter((item) =>
        [
          "Raw Dairy",
          "Honey",
          "Processors",
        ].includes(item.category)
      );
    }

    return marketItems.filter(
      (item) => item.category === activeCategory
    );
  }, [activeCategory, marketItems]);

  const visibleSellers = useMemo(() => {
    const groups = new Map<string, SellerGroup>();

    visibleItems.forEach((item) => {
      const key = item.seller.trim().toLowerCase();

      const existing = groups.get(key);

      if (existing) {
        existing.items.push(item);
        return;
      }

      groups.set(key, {
        seller: item.seller,
        location: item.location,
        fulfillment: item.fulfillment,
        phone: item.phone,
        sellerHref: item.sellerHref,
        image: item.sellerImage || sellerImage(item.seller),
        items: [item],
      });
    });

    return Array.from(groups.values());
  }, [visibleItems]);

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
          color: #17231b;
          text-decoration: none;
          white-space: nowrap;
        }

        .market-nav {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 18px;
          margin-left: auto;
        }

        .market-nav-link {
          color: #526057;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
        }

        .market-nav-link:hover {
          color: #193c2b;
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


        .market-doorways {
          padding: 22px 0 8px;
        }

        .doorway-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .doorway {
          display: flex;
          min-height: 150px;
          padding: 24px;
          border-radius: 24px;
          text-decoration: none;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 140ms ease, box-shadow 140ms ease;
        }

        .doorway:hover {
          transform: translateY(-2px);
        }

        .doorway-buy {
          background: #193c2b;
          color: #ffffff;
          box-shadow: 0 16px 38px rgba(25,60,43,0.16);
        }

        .doorway-sell {
          background: #eadcc1;
          color: #17231b;
          border: 1px solid rgba(85,64,34,0.10);
          box-shadow: 0 16px 38px rgba(73,55,28,0.08);
        }

        .doorway-label {
          font-size: clamp(24px, 4vw, 34px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .doorway-copy {
          margin-top: 14px;
          font-size: 14px;
          line-height: 1.45;
          font-weight: 700;
          opacity: 0.78;
        }

        .doorway-action {
          margin-top: 22px;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.06em;
          text-transform: uppercase;
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


        .seller-market-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .seller-market-card {
          min-width: 0;
          overflow: hidden;
          border-radius: 26px;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(23,35,27,0.11);
          box-shadow: 0 18px 50px rgba(48,39,24,0.07);
        }

        .seller-market-image {
          width: 100%;
          height: 245px;
          display: block;
          object-fit: cover;
        }

        .seller-market-image-fallback {
          height: 190px;
          padding: 26px;
          display: flex;
          align-items: flex-end;
          background:
            radial-gradient(circle at top right, rgba(232,215,181,0.16), transparent 18rem),
            #193c2b;
          color: white;
        }

        .seller-market-image-fallback span {
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 950;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .seller-market-body {
          padding: 22px;
        }

        .seller-market-name {
          margin: 0;
          font-size: clamp(27px, 4vw, 36px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.045em;
        }

        .seller-market-meta {
          margin-top: 9px;
          color: #657068;
          font-size: 14px;
          line-height: 1.45;
          font-weight: 700;
        }

        .seller-products-label {
          margin-top: 22px;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #8a6a38;
        }

        .seller-product-preview {
          margin-top: 9px;
          display: grid;
          gap: 0;
          border-top: 1px solid rgba(23,35,27,0.09);
        }

        .seller-product-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(23,35,27,0.09);
        }

        .seller-product-title {
          min-width: 0;
          font-size: 14px;
          line-height: 1.35;
          font-weight: 850;
        }

        .seller-product-price {
          flex: 0 0 auto;
          color: #526057;
          font-size: 13px;
          font-weight: 800;
          text-align: right;
        }

        .seller-more {
          margin-top: 10px;
          color: #657068;
          font-size: 13px;
          font-weight: 800;
        }

        .seller-market-action {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 50px;
          margin-top: 19px;
          padding: 0 18px;
          border-radius: 14px;
          background: #193c2b;
          color: white;
          text-decoration: none;
          text-align: center;
          font-size: 14px;
          font-weight: 950;
        }

        .seller-cta-card {
          min-width: 0;
          min-height: 100%;
          padding: 28px;
          border-radius: 26px;
          background: #eadcc1;
          border: 1px dashed rgba(76, 56, 28, 0.28);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 18px 50px rgba(48,39,24,0.05);
        }

        .seller-cta-kicker {
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #8a6a38;
        }

        .seller-cta-title {
          margin: 14px 0 0;
          font-size: clamp(30px, 5vw, 42px);
          line-height: 0.98;
          letter-spacing: -0.045em;
          font-weight: 950;
          color: #17231b;
        }

        .seller-cta-copy {
          margin-top: 16px;
          color: #5f594d;
          font-size: 15px;
          line-height: 1.55;
          font-weight: 700;
        }

        .seller-cta-products {
          margin-top: 22px;
          color: #17231b;
          font-size: 14px;
          line-height: 1.6;
          font-weight: 850;
        }

        .seller-cta-action {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          margin-top: 28px;
          padding: 0 18px;
          border-radius: 14px;
          background: #193c2b;
          color: white;
          text-decoration: none;
          text-align: center;
          font-size: 14px;
          font-weight: 950;
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
          .seller-market-grid {
            grid-template-columns: 1fr;
          }

          .seller-market-image {
            height: 220px;
          }

          .doorway-grid {
            grid-template-columns: 1fr;
          }

          .doorway {
            min-height: 132px;
          }

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
            flex-wrap: wrap;
          }

          .market-nav {
            order: 3;
            width: 100%;
            justify-content: flex-start;
            gap: 16px;
            overflow-x: auto;
            padding: 4px 0 2px;
            scrollbar-width: none;
          }

          .market-nav::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>

      <div className="market-shell">
        <header className="market-topbar">
          <a className="market-brand" href="/planet/okeechobee">
            Okeechobee Together
          </a>

          <nav className="market-nav" aria-label="Meat Market navigation">
            <a className="market-nav-link" href="#market">
              Market
            </a>

            <a className="market-nav-link" href="#how-it-works">
              How It Works
            </a>
          </nav>

          <a className="sell-link" href="/planet/okeechobee/meat-market/sell">
            Sell What I Have
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
            The livestock market moves cattle.
            <br />
            The Live Meat Market helps local beef reach local tables.
          </div>
        </section>

        <section className="market-doorways" aria-label="Choose what you want to do">
          <div className="doorway-grid">
            <a className="doorway doorway-buy" href="#market">
              <div>
                <div className="doorway-label">Buy Local Meat</div>
                <div className="doorway-copy">
                  See what local ranchers and sellers have available right now.
                </div>
              </div>

              <div className="doorway-action">
                See What&apos;s Available &rarr;
              </div>
            </a>

            <a
              className="doorway doorway-sell"
              href="/planet/okeechobee/meat-market/sell"
            >
              <div>
                <div className="doorway-label">Sell What I Have</div>
                <div className="doorway-copy">
                  Ranchers, farms, processors, butchers, and local meat sellers.
                </div>
              </div>

              <div className="doorway-action">
                Add My Listing &rarr;
              </div>
            </a>
          </div>
        </section>

        <section className="section" id="market">
          <div className="section-head">
            <h2>What&apos;s Available Right Now</h2>
            <p>Choose what you&apos;re looking for and buy directly from a local seller.</p>
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
              {liveItems.length
                ? "Available now from local sellers."
                : marketLoading
                  ? "Checking what local sellers have available..."
                  : "Preview listings are shown until local sellers are live."}
            </p>
          </div>

          <div className="seller-market-grid">
            {visibleSellers.length ? (
              <>
                {visibleSellers.map((seller) => {
                  const preview = seller.items.slice(0, 4);
                  const remaining = seller.items.length - preview.length;

                  return (
                    <article
                      className="seller-market-card"
                      key={seller.seller}
                    >
                    {seller.image ? (
                      <img
                        className="seller-market-image"
                        src={seller.image}
                        alt={`${seller.seller} ranch or farm`}
                      />
                    ) : (
                      <div className="seller-market-image-fallback">
                        <span>{seller.seller}</span>
                      </div>
                    )}

                    <div className="seller-market-body">
                      <h3 className="seller-market-name">
                        {seller.seller}
                      </h3>

                      <div className="seller-market-meta">
                        {seller.location}
                        <br />
                        {seller.fulfillment}
                      </div>

                      <div className="seller-products-label">
                        Available now
                      </div>

                      <div className="seller-product-preview">
                        {preview.map((item) => (
                          <div
                            className="seller-product-row"
                            key={item.id}
                          >
                            <div className="seller-product-title">
                              {item.title}
                            </div>

                            <div className="seller-product-price">
                              {item.price}
                            </div>
                          </div>
                        ))}
                      </div>

                      {remaining > 0 ? (
                        <div className="seller-more">
                          +{remaining} more available
                        </div>
                      ) : null}

                      <a
                        className="seller-market-action"
                        href={
                          seller.sellerHref ||
                          sellerStorefrontHref(seller.seller)
                        }
                      >
                        View Seller
                      </a>
                    </div>
                  </article>
                  );
                })}

                {activeCategory === "Everything" ? (
                  <article className="seller-cta-card">
                    <div>
                      <div className="seller-cta-kicker">
                        Local sellers wanted
                      </div>

                      <h3 className="seller-cta-title">
                        Add Your Farm or Ranch
                      </h3>

                      <div className="seller-cta-copy">
                        Raise it, process it, or sell it locally? Put your available products in front of Okeechobee buyers.
                      </div>

                      <div className="seller-cta-products">
                        Beef • Pork • Chicken • Eggs • Bulk meat • Processors • Butchers
                      </div>
                    </div>

                    <a
                      className="seller-cta-action"
                      href="/planet/okeechobee/meat-market/sell"
                    >
                      Add What I Have
                    </a>
                  </article>
                ) : null}
              </>
            ) : (
              <div className="empty-state">
                Nothing posted in this category yet. Tell local sellers what you are looking for below.
              </div>
            )}
          </div>
        </section>

        <section className="section" id="how-it-works">
          <div className="section-head">
            <h2>How it works</h2>
            <p>Keep it simple. Local sellers post what they have. Local buyers find it.</p>
          </div>

          <div className="market-columns">
            <div className="simple-panel">
              <h3>1. Add what you have</h3>
              <p>
                Ranchers and local sellers send what they have available, the price, and pickup or delivery details.
              </p>
            </div>

            <div className="simple-panel">
              <h3>2. We review it</h3>
              <p>
                We check the listing before it goes live so the market stays clean and useful.
              </p>
            </div>
          </div>

          <div className="simple-panel" style={{ marginTop: "16px" }}>
            <h3>3. Local buyers find you</h3>
            <p>
              Buyers see what is available and connect directly with the ranch or seller.
            </p>
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

            <a className="request-button" href="/planet/okeechobee/meat-market/contact?mode=buy">Find Local Food</a>
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
                Add What I Have &rarr;</a>
            </div>

            <div className="simple-panel" id="processors">
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
              Add What I Have
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
                href="/planet/okeechobee/meat-market/contact?mode=question"
                style={{ minHeight: "46px", padding: "0 20px" }}
              >
                Ask About the Market
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
                href="/planet/okeechobee/meat-market/contact?mode=question"
              >
                Ask About the Market
              </a>

              <a
                className="text-link"
                href="/planet/okeechobee"
              >
                Okeechobee Together
              </a>

              <a className="text-link" href="/privacy">
                Privacy Policy
              </a>

              <a className="text-link" href="/terms">
                Terms of Use
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

















