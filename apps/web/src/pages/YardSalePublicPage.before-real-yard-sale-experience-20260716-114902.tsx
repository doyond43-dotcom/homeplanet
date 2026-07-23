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

  const contactSeller = async () => {
    if (!sale?.contact) return;

    try {
      await navigator.clipboard.writeText(sale.contact);
      window.alert(
        `Seller contact copied:\n\n${sale.contact}`,
      );
    } catch {
      window.alert(sale.contact);
    }
  };

  if (loading) {
    return (
      <main className="ys-live-state">
        <strong>Opening yard sale...</strong>

        <style>{stateStyles}</style>
      </main>
    );
  }

  if (!sale || errorMessage) {
    return (
      <main className="ys-live-state">
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
    <main className="ys-live-page">
      <header className="ys-live-header">
        <Link to="/" className="ys-live-brand">
          HomePlanet
        </Link>

        <button type="button" onClick={shareSale}>
          Share Sale
        </button>
      </header>

      <section className="ys-live-shell">
        <div
          className="ys-live-photo"
          style={{
            backgroundImage: `
              linear-gradient(
                180deg,
                rgba(1, 5, 3, 0.02),
                rgba(1, 5, 3, 0.78)
              ),
              url("${
                sale.main_photo_url ||
                "/images/homeplanet-live-yard-sale.webp"
              }")
            `,
          }}
        >
          <div className="ys-live-photo-copy">
            <span>Upcoming yard sale</span>
            <h1>{sale.sale_name}</h1>
          </div>
        </div>

        <div className="ys-live-content">
          <div className="ys-live-status">
            <span>Upcoming sale</span>
            <b>Live yard sale page</b>
          </div>

          <h2>{sale.sale_name}</h2>

          <div className="ys-live-facts">
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
            <p className="ys-live-description">
              {sale.description}
            </p>
          )}

          {featuredItems.length > 0 && (
            <div className="ys-live-items">
              <span className="ys-live-items-label">
                Featured items
              </span>

              {featuredItems.map((item, index) => (
                <div
                  className="ys-live-item"
                  key={`${item.name}-${index}`}
                >
                  <strong>{item.name}</strong>
                  <b>{item.price || "Ask seller"}</b>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="ys-live-contact"
            onClick={contactSeller}
          >
            Contact Seller
          </button>

          <small>{sale.contact}</small>
        </div>
      </section>

      <section className="ys-live-share">
        <div>
          <span>Help someone find this sale</span>
          <strong>Know somebody who would stop for this?</strong>
        </div>

        <button type="button" onClick={shareSale}>
          Share This Sale
        </button>
      </section>

      <section className="ys-live-referral">
        <div>
          <strong>Want a yard sale page like this?</strong>
          <p>
            Add your details, see the page while you build it,
            and share one clean link everywhere.
          </p>
        </div>

        <Link to="/yard-sale/start">
          Create My Yard Sale Page
        </Link>
      </section>

      <div className="ys-live-powered">
        Powered by HomePlanet
      </div>

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

        .ys-live-page {
          min-height: 100vh;
          padding: 0 22px 46px;
          background:
            radial-gradient(
              circle at 80% 0%,
              rgba(89, 255, 145, 0.07),
              transparent 26%
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

        .ys-live-header {
          width: min(930px, 100%);
          min-height: 68px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
        }

        .ys-live-brand {
          color: #59ff91;
          font-size: 17px;
          font-weight: 950;
          letter-spacing: -0.04em;
          text-decoration: none;
        }

        .ys-live-header button {
          padding: 9px 14px;
          border: 1px solid rgba(89, 255, 145, 0.2);
          border-radius: 999px;
          background: rgba(89, 255, 145, 0.035);
          color: rgba(242, 255, 246, 0.78);
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
        }

        .ys-live-shell {
          width: min(930px, 100%);
          margin: 6px auto 0;
          overflow: hidden;
          display: grid;
          grid-template-columns:
            minmax(0, 1.08fr)
            minmax(310px, 0.92fr);
          border: 1px solid rgba(89, 255, 145, 0.15);
          border-radius: 27px;
          background: #07100b;
          box-shadow:
            0 34px 100px rgba(0, 0, 0, 0.42),
            inset 0 1px rgba(255, 255, 255, 0.025);
        }

        .ys-live-photo {
          min-height: 620px;
          display: flex;
          align-items: flex-end;
          padding: 30px;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .ys-live-photo-copy span,
        .ys-live-status span,
        .ys-live-items-label,
        .ys-live-share span {
          color: #59ff91;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .ys-live-photo-copy h1 {
          margin: 9px 0 0;
          font-size: clamp(39px, 5.7vw, 68px);
          line-height: 0.92;
          letter-spacing: -0.065em;
        }

        .ys-live-content {
          display: flex;
          flex-direction: column;
          padding: 28px;
        }

        .ys-live-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .ys-live-status b {
          color: #59ff91;
          font-size: 9px;
          text-transform: uppercase;
        }

        .ys-live-content h2 {
          margin: 16px 0 0;
          font-size: clamp(30px, 3.6vw, 44px);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .ys-live-facts {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 7px;
          margin-top: 20px;
        }

        .ys-live-facts div {
          min-height: 72px;
          padding: 11px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.022);
        }

        .ys-live-facts span,
        .ys-live-facts strong {
          display: block;
        }

        .ys-live-facts span {
          color: rgba(239, 252, 243, 0.4);
          font-size: 8px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .ys-live-facts strong {
          margin-top: 6px;
          font-size: 10px;
          line-height: 1.35;
        }

        .ys-live-description {
          margin: 18px 0 0;
          color: rgba(239, 252, 243, 0.64);
          font-size: 12px;
          line-height: 1.65;
        }

        .ys-live-items {
          display: grid;
          gap: 7px;
          margin-top: 18px;
        }

        .ys-live-items-label {
          margin-bottom: 1px;
        }

        .ys-live-item {
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.02);
        }

        .ys-live-item strong {
          font-size: 10px;
        }

        .ys-live-item b {
          flex: 0 0 auto;
          color: #59ff91;
          font-size: 10px;
        }

        .ys-live-contact {
          width: 100%;
          min-height: 50px;
          margin-top: auto;
          padding: 0 18px;
          border: 0;
          border-radius: 13px;
          background: #59ff91;
          color: #031008;
          font-size: 12px;
          font-weight: 950;
          cursor: pointer;
        }

        .ys-live-content > small {
          display: block;
          margin-top: 9px;
          color: rgba(239, 252, 243, 0.34);
          font-size: 8px;
          text-align: center;
        }

        .ys-live-share,
        .ys-live-referral {
          width: min(930px, 100%);
          margin: 14px auto 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 18px 20px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.018);
        }

        .ys-live-share strong,
        .ys-live-referral strong {
          display: block;
          margin-top: 5px;
          font-size: 14px;
        }

        .ys-live-share button {
          flex: 0 0 auto;
          min-height: 42px;
          padding: 0 15px;
          border: 1px solid rgba(89, 255, 145, 0.18);
          border-radius: 11px;
          background: rgba(89, 255, 145, 0.045);
          color: rgba(241, 255, 245, 0.82);
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .ys-live-referral {
          border-color: rgba(89, 255, 145, 0.11);
          background: rgba(89, 255, 145, 0.025);
        }

        .ys-live-referral p {
          max-width: 590px;
          margin: 5px 0 0;
          color: rgba(239, 252, 243, 0.42);
          font-size: 10px;
          line-height: 1.5;
        }

        .ys-live-referral a {
          flex: 0 0 auto;
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 15px;
          border-radius: 11px;
          background: #59ff91;
          color: #031008;
          font-size: 10px;
          font-weight: 950;
          text-decoration: none;
        }

        .ys-live-powered {
          width: min(930px, 100%);
          margin: 10px auto 0;
          color: rgba(239, 252, 243, 0.22);
          font-size: 8px;
          text-align: right;
        }

        .ys-success-backdrop {
          position: fixed;
          z-index: 1500;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 20px;
          overflow-y: auto;
          background: rgba(0, 4, 2, 0.87);
          backdrop-filter: blur(18px);
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
          box-shadow:
            0 45px 140px rgba(0, 0, 0, 0.62),
            inset 0 1px rgba(255, 255, 255, 0.04);
        }

        .ys-success-card > span {
          color: #59ff91;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
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

        @media (max-width: 780px) {
          .ys-live-shell {
            grid-template-columns: 1fr;
          }

          .ys-live-photo {
            min-height: 470px;
          }

          .ys-live-contact {
            margin-top: 22px;
          }
        }

        @media (max-width: 560px) {
          .ys-live-page {
            padding: 0 13px 35px;
          }

          .ys-live-header {
            min-height: 62px;
          }

          .ys-live-shell {
            margin-top: 4px;
            border-radius: 21px;
          }

          .ys-live-photo {
            min-height: 400px;
            padding: 22px;
          }

          .ys-live-content {
            padding: 22px;
          }

          .ys-live-facts {
            grid-template-columns: 1fr;
          }

          .ys-live-share,
          .ys-live-referral {
            align-items: stretch;
            flex-direction: column;
          }

          .ys-live-share button,
          .ys-live-referral a {
            width: 100%;
          }

          .ys-live-powered {
            text-align: center;
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

  .ys-live-state {
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

  .ys-live-state > span {
    color: #59ff91;
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .ys-live-state h1 {
    max-width: 700px;
    margin: 12px 0;
    font-size: clamp(40px, 7vw, 76px);
    line-height: 0.92;
    letter-spacing: -0.06em;
  }

  .ys-live-state p {
    max-width: 600px;
    margin: 0 0 24px;
    color: rgba(240, 255, 245, 0.58);
  }

  .ys-live-state a {
    padding: 13px 17px;
    border-radius: 13px;
    background: #59ff91;
    color: #031008;
    font-size: 12px;
    font-weight: 950;
    text-decoration: none;
  }
`;