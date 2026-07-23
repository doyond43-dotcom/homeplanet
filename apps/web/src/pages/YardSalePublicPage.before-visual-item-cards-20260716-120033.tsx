import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import { supabase } from "../lib/supabase";

type FeaturedItem = {
  name?: string;
  price?: string;
};

type YardSaleRow = {
  id: string;
  slug: string;
  sale_name: string;
  area: string;
  sale_date: string;
  start_time: string;
  description: string;
  contact: string;
  featured_items: FeaturedItem[] | null;
  main_photo_url: string | null;
  status: string;
};

type PublishLocationState = {
  justPublished?: boolean;
  publishedName?: string;
};

export default function YardSalePublicPage() {
  const { slug } = useParams();
  const location = useLocation();

  const publishState =
    (location.state as PublishLocationState | null) || null;

  const [sale, setSale] = useState<YardSaleRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<FeaturedItem | null>(null);

  const [successOpen, setSuccessOpen] = useState(
    Boolean(publishState?.justPublished),
  );

  useEffect(() => {
    let alive = true;

    async function loadSale() {
      const normalizedSlug = (slug || "").trim().toLowerCase();

      if (!normalizedSlug) {
        setLoading(false);
        setErrorMessage("This yard sale link is incomplete.");
        return;
      }

      const result = await supabase
        .from("yard_sales")
        .select(
          "id,slug,sale_name,area,sale_date,start_time,description,contact,featured_items,main_photo_url,status",
        )
        .eq("slug", normalizedSlug)
        .eq("status", "published")
        .maybeSingle();

      if (!alive) return;

      if (result.error) {
        setErrorMessage(result.error.message);
        setLoading(false);
        return;
      }

      if (!result.data) {
        setErrorMessage("This yard sale page could not be found.");
        setLoading(false);
        return;
      }

      setSale(result.data as YardSaleRow);
      setLoading(false);
    }

    loadSale();

    return () => {
      alive = false;
    };
  }, [slug]);

  const formattedDate = useMemo(() => {
    if (!sale?.sale_date) return "";

    const parsed = new Date(`${sale.sale_date}T12:00:00`);

    return parsed.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [sale?.sale_date]);

  const formattedTime = useMemo(() => {
    if (!sale?.start_time) return "";

    const [hours, minutes] = sale.start_time.split(":").map(Number);
    const parsed = new Date();

    parsed.setHours(hours || 0, minutes || 0, 0, 0);

    return parsed.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }, [sale?.start_time]);

  const featuredItems = Array.isArray(sale?.featured_items)
    ? sale.featured_items.filter((item) => item?.name?.trim())
    : [];

  const copySaleLink = async () => {
    const shareUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      window.alert("Yard sale link copied.");
    } catch {
      window.prompt("Copy this yard sale link:", shareUrl);
    }
  };

  const shareSale = async () => {
    const shareUrl = window.location.href;

    const shareTitle =
      sale?.sale_name ||
      publishState?.publishedName ||
      "Yard Sale";

    const shareText = sale
      ? `${sale.sale_name} in ${sale.area}`
      : "Check out this yard sale.";

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });

        return;
      }

      await copySaleLink();
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      await copySaleLink();
    }
  };

  const contactSeller = async (itemName?: string) => {
    if (!sale?.contact) return;

    const itemLine = itemName
      ? `\n\nI am interested in: ${itemName}`
      : "";

    try {
      await navigator.clipboard.writeText(
        `${sale.contact}${itemLine}`,
      );

      window.alert(
        itemName
          ? `Seller contact and item name copied:\n\n${sale.contact}`
          : `Seller contact copied:\n\n${sale.contact}`,
      );
    } catch {
      window.alert(sale.contact);
    }
  };

  if (loading) {
    return (
      <main className="ys-state">
        <strong>Opening yard sale...</strong>
        <style>{stateStyles}</style>
      </main>
    );
  }

  if (!sale || errorMessage) {
    return (
      <main className="ys-state">
        <span>HomePlanet Yard Sales</span>
        <h1>We could not open this sale.</h1>
        <p>{errorMessage}</p>

        <Link to="/yard-sale/start">
          Create a yard sale page
        </Link>

        <style>{stateStyles}</style>
      </main>
    );
  }

  return (
    <main className="ys-public-page">
      <header className="ys-public-header">
        <Link to="/" className="ys-public-brand">
          HomePlanet
        </Link>

        <button type="button" onClick={shareSale}>
          Share This Sale
        </button>
      </header>

      <section className="ys-public-hero">
        <div
          className="ys-public-hero-photo"
          style={{
            backgroundImage: `
              linear-gradient(
                180deg,
                rgba(2, 6, 4, 0.02),
                rgba(2, 6, 4, 0.76)
              ),
              url("${
                sale.main_photo_url ||
                "/images/homeplanet-live-yard-sale.webp"
              }")
            `,
          }}
        >
          <div className="ys-public-hero-copy">
            <span>Upcoming yard sale</span>
            <h1>{sale.sale_name}</h1>
          </div>
        </div>

        <div className="ys-public-hero-details">
          <span className="ys-public-live-pill">
            Live yard sale page
          </span>

          <h2>{sale.sale_name}</h2>

          <div className="ys-public-facts">
            <div>
              <span>Date</span>
              <strong>{formattedDate}</strong>
            </div>

            <div>
              <span>Starts</span>
              <strong>{formattedTime}</strong>
            </div>

            <div>
              <span>Area</span>
              <strong>{sale.area}</strong>
            </div>
          </div>

          {sale.description && (
            <p>{sale.description}</p>
          )}

          <div className="ys-public-hero-actions">
            <button
              type="button"
              className="ys-public-contact"
              onClick={() => contactSeller()}
            >
              Contact Seller
            </button>

            <button
              type="button"
              className="ys-public-share"
              onClick={shareSale}
            >
              Share Sale
            </button>
          </div>

          <small>{sale.contact}</small>
        </div>
      </section>

      <section className="ys-public-items-section">
        <div className="ys-public-section-heading">
          <span>Featured items</span>
          <h2>A few things available at this sale.</h2>
          <p>
            Tap any item to see more and ask the seller about it.
          </p>
        </div>

        <div className="ys-public-items-grid">
          {featuredItems.map((item, index) => (
            <button
              type="button"
              className="ys-public-item-card"
              key={`${item.name}-${index}`}
              onClick={() => setSelectedItem(item)}
            >
              <div className="ys-public-item-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="ys-public-item-content">
                <strong>{item.name}</strong>
                <span>{item.price || "Ask seller"}</span>
              </div>

              <div className="ys-public-item-action">
                View Item
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="ys-public-sale-actions">
        <div>
          <span>Help someone find this sale</span>
          <strong>Know somebody who would stop for this?</strong>
        </div>

        <div className="ys-public-sale-buttons">
          <button type="button" onClick={shareSale}>
            Share This Sale
          </button>

          <button type="button" onClick={copySaleLink}>
            Copy Link
          </button>
        </div>
      </section>

      <section className="ys-public-referral">
        <div>
          <span>Built with HomePlanet</span>
          <strong>Hosting a yard sale of your own?</strong>
          <p>
            Build your page, feature your best items, and share
            one clean link everywhere.
          </p>
        </div>

        <Link to="/yard-sale/start">
          Create My Yard Sale Page
        </Link>
      </section>

      <div className="ys-public-powered">
        Powered by HomePlanet
      </div>

      {selectedItem && (
        <div
          className="ys-item-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedItem(null);
            }
          }}
        >
          <section
            className="ys-item-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ys-item-title"
          >
            <button
              type="button"
              className="ys-item-close"
              onClick={() => setSelectedItem(null)}
              aria-label="Close item"
            >
              ×
            </button>

            <span>Featured yard sale item</span>

            <h2 id="ys-item-title">
              {selectedItem.name}
            </h2>

            <strong className="ys-item-price">
              {selectedItem.price || "Ask seller"}
            </strong>

            <div className="ys-item-sale-context">
              <span>Available at</span>
              <strong>{sale.sale_name}</strong>
              <p>
                {formattedDate} at {formattedTime}
                <br />
                {sale.area}
              </p>
            </div>

            <button
              type="button"
              className="ys-item-contact"
              onClick={() =>
                contactSeller(selectedItem.name)
              }
            >
              Ask Seller About This Item
            </button>

            <button
              type="button"
              className="ys-item-share"
              onClick={shareSale}
            >
              Share This Sale
            </button>
          </section>
        </div>
      )}

      {successOpen && (
        <div
          className="ys-success-backdrop"
          role="presentation"
        >
          <section
            className="ys-success-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ys-success-title"
          >
            <span>Your page is live</span>

            <h2 id="ys-success-title">
              {sale.sale_name} now has its own page.
            </h2>

            <p>
              Your permanent yard sale link is ready to share
              on Facebook, text messages, signs, and
              neighborhood groups.
            </p>

            <div className="ys-success-link">
              {window.location.href}
            </div>

            <div className="ys-success-actions">
              <button
                type="button"
                className="ys-success-primary"
                onClick={shareSale}
              >
                Share My Yard Sale
              </button>

              <button
                type="button"
                onClick={copySaleLink}
              >
                Copy Link
              </button>

              <button
                type="button"
                onClick={() => setSuccessOpen(false)}
              >
                View My Live Page
              </button>
            </div>
          </section>
        </div>
      )}

      <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #020604;
        }

        button,
        a {
          font: inherit;
        }

        .ys-public-page {
          min-height: 100vh;
          padding: 0 24px 52px;
          background:
            radial-gradient(
              circle at 78% 0%,
              rgba(89, 255, 145, 0.075),
              transparent 28%
            ),
            #020604;
          color: #f3fff6;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .ys-public-header {
          width: min(1180px, 100%);
          min-height: 76px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .ys-public-brand {
          color: #59ff91;
          font-size: 20px;
          font-weight: 950;
          letter-spacing: -0.04em;
          text-decoration: none;
        }

        .ys-public-header button {
          min-height: 40px;
          padding: 0 15px;
          border: 1px solid rgba(89, 255, 145, 0.2);
          border-radius: 999px;
          background: rgba(89, 255, 145, 0.035);
          color: rgba(242, 255, 246, 0.8);
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .ys-public-hero {
          width: min(1180px, 100%);
          margin: 10px auto 0;
          display: grid;
          grid-template-columns:
            minmax(0, 1.3fr)
            minmax(360px, 0.7fr);
          overflow: hidden;
          border: 1px solid rgba(89, 255, 145, 0.15);
          border-radius: 30px;
          background: #07100b;
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.45);
        }

        .ys-public-hero-photo {
          min-height: 650px;
          display: flex;
          align-items: flex-end;
          padding: 38px;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .ys-public-hero-copy span,
        .ys-public-live-pill,
        .ys-public-section-heading > span,
        .ys-public-sale-actions span,
        .ys-public-referral span,
        .ys-item-drawer > span,
        .ys-success-card > span {
          color: #59ff91;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ys-public-hero-copy h1 {
          max-width: 760px;
          margin: 11px 0 0;
          font-size: clamp(44px, 6vw, 78px);
          line-height: 0.92;
          letter-spacing: -0.065em;
        }

        .ys-public-hero-details {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 38px;
        }

        .ys-public-hero-details h2 {
          margin: 18px 0 0;
          font-size: clamp(36px, 4vw, 55px);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .ys-public-facts {
          display: grid;
          gap: 9px;
          margin-top: 25px;
        }

        .ys-public-facts div {
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.025);
        }

        .ys-public-facts span,
        .ys-public-facts strong {
          display: block;
        }

        .ys-public-facts span {
          color: rgba(239, 252, 243, 0.42);
          font-size: 9px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .ys-public-facts strong {
          margin-top: 7px;
          font-size: 13px;
          line-height: 1.4;
        }

        .ys-public-hero-details > p {
          margin: 23px 0 0;
          color: rgba(239, 252, 243, 0.68);
          font-size: 14px;
          line-height: 1.7;
        }

        .ys-public-hero-actions {
          display: grid;
          grid-template-columns: 1.35fr 0.65fr;
          gap: 10px;
          margin-top: 25px;
        }

        .ys-public-hero-actions button {
          min-height: 54px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
        }

        .ys-public-contact {
          border: 0;
          background: #59ff91;
          color: #031008;
        }

        .ys-public-share {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(242, 255, 246, 0.78);
        }

        .ys-public-hero-details > small {
          margin-top: 10px;
          color: rgba(239, 252, 243, 0.36);
          font-size: 9px;
          text-align: center;
        }

        .ys-public-items-section {
          width: min(1180px, 100%);
          margin: 78px auto 0;
        }

        .ys-public-section-heading h2 {
          max-width: 760px;
          margin: 12px 0 0;
          font-size: clamp(40px, 5.5vw, 68px);
          line-height: 0.94;
          letter-spacing: -0.06em;
        }

        .ys-public-section-heading p {
          margin: 15px 0 0;
          color: rgba(239, 252, 243, 0.5);
          font-size: 13px;
        }

        .ys-public-items-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 30px;
        }

        .ys-public-item-card {
          min-height: 150px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 20px;
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.025);
          color: #f3fff6;
          text-align: left;
          cursor: pointer;
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            background 160ms ease;
        }

        .ys-public-item-card:hover {
          transform: translateY(-2px);
          border-color: rgba(89, 255, 145, 0.26);
          background: rgba(89, 255, 145, 0.045);
        }

        .ys-public-item-number {
          color: #59ff91;
          font-size: 11px;
          font-weight: 950;
        }

        .ys-public-item-content strong,
        .ys-public-item-content span {
          display: block;
        }

        .ys-public-item-content strong {
          font-size: 19px;
          line-height: 1.25;
        }

        .ys-public-item-content span {
          margin-top: 10px;
          color: #59ff91;
          font-size: 14px;
          font-weight: 900;
        }

        .ys-public-item-action {
          padding: 10px 12px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 11px;
          color: rgba(239, 252, 243, 0.62);
          font-size: 10px;
          font-weight: 900;
        }

        .ys-public-sale-actions,
        .ys-public-referral {
          width: min(1180px, 100%);
          margin: 70px auto 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          padding: 27px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.022);
        }

        .ys-public-sale-actions strong,
        .ys-public-referral strong {
          display: block;
          margin-top: 8px;
          font-size: clamp(20px, 3vw, 31px);
          letter-spacing: -0.04em;
        }

        .ys-public-sale-buttons {
          display: flex;
          gap: 10px;
        }

        .ys-public-sale-buttons button,
        .ys-public-referral a {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border-radius: 13px;
          font-size: 11px;
          font-weight: 950;
          cursor: pointer;
          text-decoration: none;
        }

        .ys-public-sale-buttons button {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(242, 255, 246, 0.78);
        }

        .ys-public-referral {
          margin-top: 16px;
          border-color: rgba(89, 255, 145, 0.13);
          background: rgba(89, 255, 145, 0.035);
        }

        .ys-public-referral p {
          max-width: 680px;
          margin: 8px 0 0;
          color: rgba(239, 252, 243, 0.48);
          font-size: 12px;
          line-height: 1.55;
        }

        .ys-public-referral a {
          flex: 0 0 auto;
          background: #59ff91;
          color: #031008;
        }

        .ys-public-powered {
          width: min(1180px, 100%);
          margin: 12px auto 0;
          color: rgba(239, 252, 243, 0.23);
          font-size: 8px;
          text-align: right;
        }

        .ys-item-backdrop,
        .ys-success-backdrop {
          position: fixed;
          z-index: 1500;
          inset: 0;
          display: grid;
          padding: 22px;
          background: rgba(0, 4, 2, 0.86);
          backdrop-filter: blur(16px);
        }

        .ys-item-backdrop {
          place-items: end;
        }

        .ys-item-drawer {
          position: relative;
          width: min(520px, 100%);
          max-height: calc(100vh - 44px);
          overflow-y: auto;
          padding: 30px;
          border: 1px solid rgba(89, 255, 145, 0.18);
          border-radius: 27px;
          background:
            radial-gradient(
              circle at 86% 0%,
              rgba(89, 255, 145, 0.1),
              transparent 30%
            ),
            #07100b;
          box-shadow: 0 40px 130px rgba(0, 0, 0, 0.6);
        }

        .ys-item-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.03);
          color: rgba(242, 255, 246, 0.7);
          font-size: 24px;
          cursor: pointer;
        }

        .ys-item-drawer h2 {
          max-width: 420px;
          margin: 15px 0 0;
          font-size: clamp(36px, 7vw, 58px);
          line-height: 0.94;
          letter-spacing: -0.06em;
        }

        .ys-item-price {
          display: block;
          margin-top: 16px;
          color: #59ff91;
          font-size: 25px;
        }

        .ys-item-sale-context {
          margin-top: 27px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.025);
        }

        .ys-item-sale-context span,
        .ys-item-sale-context strong {
          display: block;
        }

        .ys-item-sale-context span {
          color: rgba(239, 252, 243, 0.4);
          font-size: 9px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .ys-item-sale-context strong {
          margin-top: 7px;
          font-size: 16px;
        }

        .ys-item-sale-context p {
          margin: 10px 0 0;
          color: rgba(239, 252, 243, 0.58);
          font-size: 12px;
          line-height: 1.6;
        }

        .ys-item-contact,
        .ys-item-share {
          width: 100%;
          min-height: 52px;
          margin-top: 18px;
          border-radius: 14px;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
        }

        .ys-item-contact {
          border: 0;
          background: #59ff91;
          color: #031008;
        }

        .ys-item-share {
          margin-top: 9px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(242, 255, 246, 0.75);
        }

        .ys-success-backdrop {
          place-items: center;
          overflow-y: auto;
        }

        .ys-success-card {
          width: min(620px, 100%);
          padding: 34px;
          border: 1px solid rgba(89, 255, 145, 0.2);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 85% 0%,
              rgba(89, 255, 145, 0.12),
              transparent 30%
            ),
            #07100b;
          box-shadow: 0 45px 140px rgba(0, 0, 0, 0.62);
        }

        .ys-success-card h2 {
          margin: 12px 0 0;
          font-size: clamp(38px, 7vw, 64px);
          line-height: 0.92;
          letter-spacing: -0.065em;
        }

        .ys-success-card > p {
          max-width: 520px;
          margin: 18px 0 0;
          color: rgba(239, 252, 243, 0.62);
          font-size: 13px;
          line-height: 1.65;
        }

        .ys-success-link {
          margin-top: 20px;
          padding: 14px;
          overflow-wrap: anywhere;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
          color: rgba(239, 252, 243, 0.52);
          font-size: 10px;
          line-height: 1.5;
        }

        .ys-success-actions {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr 1fr;
          gap: 9px;
          margin-top: 20px;
        }

        .ys-success-actions button {
          min-height: 50px;
          padding: 0 14px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.03);
          color: rgba(242, 255, 246, 0.78);
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .ys-success-actions .ys-success-primary {
          border: 0;
          background: #59ff91;
          color: #031008;
        }

        @media (max-width: 900px) {
          .ys-public-hero {
            grid-template-columns: 1fr;
          }

          .ys-public-hero-photo {
            min-height: 520px;
          }

          .ys-public-items-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 620px) {
          .ys-public-page {
            padding: 0 14px 40px;
          }

          .ys-public-header {
            min-height: 66px;
          }

          .ys-public-hero {
            margin-top: 5px;
            border-radius: 23px;
          }

          .ys-public-hero-photo {
            min-height: 420px;
            padding: 24px;
          }

          .ys-public-hero-details {
            padding: 24px;
          }

          .ys-public-hero-actions {
            grid-template-columns: 1fr;
          }

          .ys-public-items-section {
            margin-top: 55px;
          }

          .ys-public-item-card {
            grid-template-columns: auto 1fr;
          }

          .ys-public-item-action {
            grid-column: 2;
            justify-self: start;
          }

          .ys-public-sale-actions,
          .ys-public-referral {
            align-items: stretch;
            flex-direction: column;
          }

          .ys-public-sale-buttons {
            display: grid;
          }

          .ys-public-sale-buttons button,
          .ys-public-referral a {
            width: 100%;
          }

          .ys-public-powered {
            text-align: center;
          }

          .ys-item-backdrop {
            place-items: end center;
            padding: 12px;
          }

          .ys-item-drawer {
            width: 100%;
            padding: 25px;
            border-radius: 23px;
          }

          .ys-success-card {
            padding: 25px;
            border-radius: 22px;
          }

          .ys-success-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

const stateStyles = `
  :root {
    color-scheme: dark;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #020604;
  }

  .ys-state {
    min-height: 100vh;
    display: grid;
    place-content: center;
    justify-items: start;
    padding: 28px;
    background: #020604;
    color: #f3fff6;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  .ys-state > span {
    color: #59ff91;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .ys-state h1 {
    max-width: 700px;
    margin: 12px 0;
    font-size: clamp(40px, 7vw, 76px);
    line-height: 0.92;
    letter-spacing: -0.06em;
  }

  .ys-state p {
    max-width: 600px;
    margin: 0 0 24px;
    color: rgba(240, 255, 245, 0.58);
  }

  .ys-state a {
    padding: 13px 17px;
    border-radius: 13px;
    background: #59ff91;
    color: #031008;
    font-size: 12px;
    font-weight: 950;
    text-decoration: none;
  }
`;