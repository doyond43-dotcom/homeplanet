import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

export default function YardSalePublicPage() {
  const { slug } = useParams();
  const [sale, setSale] = useState<YardSaleRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

  const copyContact = async () => {
    if (!sale?.contact) return;

    try {
      await navigator.clipboard.writeText(sale.contact);
      window.alert("Contact information copied.");
    } catch {
      window.alert(sale.contact);
    }
  };

  if (loading) {
    return (
      <main className="ysp-state">
        <strong>Loading yard sale...</strong>
      </main>
    );
  }

  if (!sale || errorMessage) {
    return (
      <main className="ysp-state">
        <span>HomePlanet Yard Sales</span>
        <h1>We could not open this sale.</h1>
        <p>{errorMessage}</p>
        <Link to="/yard-sale/start">Create a yard sale page</Link>
      </main>
    );
  }

  return (
    <main className="ysp-page">
      <header className="ysp-header">
        <Link to="/" className="ysp-brand">
          HomePlanet
        </Link>

        <Link to="/yard-sale/start" className="ysp-create">
          Create Your Own
        </Link>
      </header>

      <section className="ysp-hero">
        <div
          className="ysp-photo"
          style={{
            backgroundImage: `
              linear-gradient(180deg, transparent, rgba(2, 6, 4, 0.78)),
              url("${sale.main_photo_url || "/images/homeplanet-live-yard-sale.webp"}")
            `,
          }}
        >
          <div>
            <span>Upcoming yard sale</span>
            <h1>{sale.sale_name}</h1>
          </div>
        </div>

        <div className="ysp-details">
          <span className="ysp-live-pill">Live yard sale page</span>

          <h2>{sale.sale_name}</h2>

          <div className="ysp-facts">
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
            <p className="ysp-description">{sale.description}</p>
          )}

          <button type="button" onClick={copyContact}>
            Contact Seller
          </button>

          <small>{sale.contact}</small>
        </div>
      </section>

      {featuredItems.length > 0 && (
        <section className="ysp-items-section">
          <div className="ysp-section-heading">
            <span>Featured finds</span>
            <h2>A few things waiting for you.</h2>
          </div>

          <div className="ysp-items">
            {featuredItems.map((item, index) => (
              <article key={`${item.name}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
                <b>{item.price || "Ask seller"}</b>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="ysp-footer">
        <div>
          <strong>Have something to sell?</strong>
          <p>Create one clean page and share it everywhere.</p>
        </div>

        <Link to="/yard-sale/start">Start Your Yard Sale Page</Link>
      </footer>

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

        .ysp-page,
        .ysp-state {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 78% 0%,
              rgba(89, 255, 145, 0.08),
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

        .ysp-page {
          padding: 0 28px 50px;
        }

        .ysp-header {
          width: min(1180px, 100%);
          min-height: 76px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .ysp-brand {
          color: #59ff91;
          font-size: 20px;
          font-weight: 950;
          letter-spacing: -0.04em;
          text-decoration: none;
        }

        .ysp-create {
          padding: 11px 15px;
          border: 1px solid rgba(89, 255, 145, 0.2);
          border-radius: 999px;
          color: rgba(240, 255, 245, 0.78);
          font-size: 12px;
          font-weight: 850;
          text-decoration: none;
        }

        .ysp-hero {
          width: min(1180px, 100%);
          margin: 18px auto 0;
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(340px, 0.75fr);
          overflow: hidden;
          border: 1px solid rgba(89, 255, 145, 0.14);
          border-radius: 30px;
          background: #07100b;
          box-shadow: 0 35px 100px rgba(0, 0, 0, 0.42);
        }

        .ysp-photo {
          position: relative;
          min-height: 580px;
          display: flex;
          align-items: flex-end;
          padding: 38px;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .ysp-photo span,
        .ysp-live-pill,
        .ysp-section-heading span {
          color: #59ff91;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ysp-photo h1 {
          max-width: 760px;
          margin: 10px 0 0;
          font-size: clamp(42px, 6vw, 78px);
          line-height: 0.92;
          letter-spacing: -0.065em;
        }

        .ysp-details {
          padding: 38px;
          align-self: center;
        }

        .ysp-details h2 {
          margin: 17px 0 0;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .ysp-facts {
          display: grid;
          gap: 9px;
          margin-top: 25px;
        }

        .ysp-facts div {
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.025);
        }

        .ysp-facts span,
        .ysp-facts strong {
          display: block;
        }

        .ysp-facts span {
          color: rgba(235, 250, 239, 0.42);
          font-size: 9px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .ysp-facts strong {
          margin-top: 6px;
          font-size: 13px;
        }

        .ysp-description {
          margin: 22px 0 0;
          color: rgba(238, 252, 242, 0.68);
          font-size: 14px;
          line-height: 1.7;
        }

        .ysp-details button {
          width: 100%;
          min-height: 54px;
          margin-top: 24px;
          border: 0;
          border-radius: 15px;
          background: #59ff91;
          color: #031008;
          font-weight: 950;
          cursor: pointer;
        }

        .ysp-details small {
          display: block;
          margin-top: 10px;
          color: rgba(238, 252, 242, 0.4);
          font-size: 10px;
          text-align: center;
        }

        .ysp-items-section {
          width: min(1180px, 100%);
          margin: 70px auto 0;
        }

        .ysp-section-heading h2 {
          max-width: 680px;
          margin: 12px 0 0;
          font-size: clamp(36px, 5vw, 62px);
          line-height: 0.95;
          letter-spacing: -0.055em;
        }

        .ysp-items {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .ysp-items article {
          min-height: 170px;
          display: flex;
          flex-direction: column;
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.025);
        }

        .ysp-items article > span {
          color: #59ff91;
          font-size: 10px;
          font-weight: 950;
        }

        .ysp-items article strong {
          margin-top: 28px;
          font-size: 17px;
          line-height: 1.25;
        }

        .ysp-items article b {
          margin-top: auto;
          padding-top: 18px;
          color: rgba(240, 255, 245, 0.55);
          font-size: 13px;
        }

        .ysp-footer {
          width: min(1180px, 100%);
          margin: 75px auto 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 22px;
          padding: 26px;
          border: 1px solid rgba(89, 255, 145, 0.12);
          border-radius: 22px;
          background: rgba(89, 255, 145, 0.035);
        }

        .ysp-footer strong {
          font-size: 18px;
        }

        .ysp-footer p {
          margin: 6px 0 0;
          color: rgba(240, 255, 245, 0.48);
          font-size: 12px;
        }

        .ysp-footer a,
        .ysp-state a {
          padding: 13px 17px;
          border-radius: 13px;
          background: #59ff91;
          color: #031008;
          font-size: 12px;
          font-weight: 950;
          text-decoration: none;
        }

        .ysp-state {
          display: grid;
          place-content: center;
          justify-items: start;
          padding: 28px;
        }

        .ysp-state > span {
          color: #59ff91;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ysp-state h1 {
          max-width: 700px;
          margin: 12px 0;
          font-size: clamp(40px, 7vw, 76px);
          line-height: 0.92;
          letter-spacing: -0.06em;
        }

        .ysp-state p {
          max-width: 600px;
          margin: 0 0 24px;
          color: rgba(240, 255, 245, 0.58);
        }

        @media (max-width: 900px) {
          .ysp-hero {
            grid-template-columns: 1fr;
          }

          .ysp-photo {
            min-height: 460px;
          }

          .ysp-items {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .ysp-page {
            padding: 0 15px 40px;
          }

          .ysp-header {
            min-height: 66px;
          }

          .ysp-hero {
            margin-top: 8px;
            border-radius: 23px;
          }

          .ysp-photo {
            min-height: 380px;
            padding: 24px;
          }

          .ysp-details {
            padding: 24px;
          }

          .ysp-items {
            grid-template-columns: 1fr;
          }

          .ysp-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .ysp-footer a {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}