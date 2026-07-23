import { useEffect } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  MessageCircle,
  Phone,
  Truck,
  Wrench,
} from "lucide-react";

const phoneDigits = "6156021524";
const formattedPhone = "615-602-1524";

export default function JonesEquipmentRentalRepairLandingPage() {
  useEffect(() => {
    const canonicalUrl =
      "https://www.homeplanet.city/planet/jones-equipment-rental-repair";
    const title =
      "Jones Equipment Rental & Repair | Equipment Rentals and Repair";
    const description =
      "Request equipment rentals or start an equipment repair request with Jones Equipment Rental & Repair. Call or text JME at 615-602-1524.";
    const imageUrl =
      "https://www.homeplanet.city/images/jme-hero-service-truck-loader.jpg";

    const previousTitle = document.title;
    document.title = title;

    const previousValues = new Map<Element, Map<string, string | null>>();
    const createdElements: Element[] = [];

    function rememberAttribute(element: Element, attribute: string) {
      if (!previousValues.has(element)) {
        previousValues.set(element, new Map());
      }

      const elementValues = previousValues.get(element);

      if (elementValues && !elementValues.has(attribute)) {
        elementValues.set(attribute, element.getAttribute(attribute));
      }
    }

    function setMeta(
      selector: string,
      attributes: Record<string, string>,
    ) {
      let element = document.querySelector(selector) as HTMLMetaElement | null;

      if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
        createdElements.push(element);
      }

      for (const [name, value] of Object.entries(attributes)) {
        rememberAttribute(element, name);
        element.setAttribute(name, value);
      }
    }

    setMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });

    setMeta('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });

    setMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });

    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });

    setMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });

    setMeta('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });

    setMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content:
        "JME service truck beside heavy equipment during field service work",
    });

    setMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });

    setMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });

    setMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });

    setMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: imageUrl,
    });

    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
      createdElements.push(canonical);
    }

    rememberAttribute(canonical, "href");
    canonical.setAttribute("href", canonicalUrl);

    document.head
      .querySelectorAll('script[data-jme-schema="true"]')
      .forEach((element) => element.remove());

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.jmeSchema = "true";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${canonicalUrl}#business`,
      name: "Jones Equipment Rental & Repair",
      alternateName: "JME",
      url: canonicalUrl,
      telephone: "+1-615-602-1524",
      image: imageUrl,
      logo:
        "https://www.homeplanet.city/images/jme-logo-primary.jpg",
      description:
        "Equipment rentals and equipment repair with direct customer requests by phone, text, or the JME live page.",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-615-602-1524",
        contactType: "customer service",
        availableLanguage: "English",
      },
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Equipment Rental Requests",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Equipment Repair Requests",
          },
        },
      ],
    });

    document.head.appendChild(schema);
    createdElements.push(schema);

    return () => {
      document.title = previousTitle;

      createdElements.forEach((element) => element.remove());

      previousValues.forEach((attributes, element) => {
        attributes.forEach((previousValue, attribute) => {
          if (previousValue === null) {
            element.removeAttribute(attribute);
          } else {
            element.setAttribute(attribute, previousValue);
          }
        });
      });
    };
  }, []);

  function scrollToDoors() {
    document.getElementById("jme-customer-doors")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="min-h-screen bg-[#07090d] text-white">
      <style>{`
        .jme-page {
          --jme-blue: #138fe8;
          --jme-blue-light: #5bbcff;
          --jme-panel: #11161e;
          --jme-panel-soft: #161d27;
          --jme-border: rgba(148, 163, 184, 0.24);
          background:
            radial-gradient(circle at top right, rgba(19, 143, 232, 0.15), transparent 32rem),
            linear-gradient(180deg, #080b10 0%, #07090d 48%, #0b0f15 100%);
        }

        .jme-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .jme-header {
          position: relative;
          z-index: 10;
          border-bottom: 1px solid rgba(148, 163, 184, 0.18);
          background: rgba(7, 9, 13, 0.92);
          backdrop-filter: blur(14px);
        }

        .jme-header-inner {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .jme-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .jme-brand-logo {
          width: 70px;
          height: 54px;
          object-fit: cover;
          object-position: center;
          border-radius: 10px;
          border: 1px solid rgba(91, 188, 255, 0.38);
          background: #000;
        }

        .jme-brand-name {
          margin: 0;
          font-size: clamp(0.96rem, 2.2vw, 1.12rem);
          line-height: 1.15;
          font-weight: 800;
          letter-spacing: 0.01em;
        }

        .jme-brand-subtitle {
          margin: 4px 0 0;
          color: #94a3b8;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .jme-header-actions {
          display: flex;
          gap: 10px;
        }

        .jme-header-button {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0 17px;
          border-radius: 12px;
          border: 1px solid rgba(91, 188, 255, 0.38);
          color: white;
          text-decoration: none;
          font-weight: 800;
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            background 160ms ease;
        }

        .jme-header-button:hover {
          transform: translateY(-1px);
          border-color: rgba(91, 188, 255, 0.85);
        }

        .jme-header-button-primary {
          background: var(--jme-blue);
          border-color: var(--jme-blue);
          color: #03111d;
        }

        .jme-hero {
          padding: 68px 0 34px;
        }

        .jme-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 20px;
          color: var(--jme-blue-light);
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .jme-hero-title {
          max-width: 960px;
          margin: 0;
          font-size: clamp(3rem, 8.5vw, 6.8rem);
          line-height: 0.91;
          font-weight: 950;
          letter-spacing: -0.065em;
        }

        .jme-hero-title span {
          display: block;
          color: var(--jme-blue-light);
        }

        .jme-hero-copy {
          max-width: 760px;
          margin: 26px 0 0;
          color: #cbd5e1;
          font-size: clamp(1.06rem, 2vw, 1.34rem);
          line-height: 1.65;
        }

        .jme-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .jme-primary-action,
        .jme-secondary-action {
          min-height: 58px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 22px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 900;
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            background 160ms ease;
        }

        .jme-primary-action {
          border: 1px solid var(--jme-blue);
          background: var(--jme-blue);
          color: #03111d;
        }

        .jme-secondary-action {
          border: 1px solid rgba(148, 163, 184, 0.34);
          background: rgba(255, 255, 255, 0.025);
          color: white;
        }

        .jme-primary-action:hover,
        .jme-secondary-action:hover {
          transform: translateY(-2px);
          border-color: var(--jme-blue-light);
        }

        .jme-hero-image-wrap {
          margin-top: 42px;
          overflow: hidden;
          border-radius: 22px;
          border: 1px solid rgba(91, 188, 255, 0.28);
          background: #0c1118;
        }

        .jme-hero-image {
          display: block;
          width: 100%;
          height: clamp(310px, 58vw, 650px);
          object-fit: cover;
          object-position: center;
        }

        .jme-image-caption {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 18px;
          color: #cbd5e1;
          font-size: 0.92rem;
          font-weight: 700;
        }

        .jme-proof-line {
          color: var(--jme-blue-light);
        }

        .jme-doors-section {
          scroll-margin-top: 24px;
          padding: 66px 0 74px;
        }

        .jme-section-heading {
          max-width: 760px;
          margin-bottom: 28px;
        }

        .jme-section-heading h2 {
          margin: 0;
          font-size: clamp(2.15rem, 5vw, 4rem);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .jme-section-heading p {
          margin: 16px 0 0;
          color: #aeb9c8;
          font-size: 1.08rem;
          line-height: 1.65;
        }

        .jme-door-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .jme-door {
          min-height: 390px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px;
          border-radius: 20px;
          border: 1px solid var(--jme-border);
          background:
            linear-gradient(145deg, rgba(19, 143, 232, 0.09), transparent 55%),
            var(--jme-panel);
          text-decoration: none;
          color: white;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .jme-door:hover {
          transform: translateY(-4px);
          border-color: rgba(91, 188, 255, 0.7);
          background:
            linear-gradient(145deg, rgba(19, 143, 232, 0.16), transparent 58%),
            var(--jme-panel-soft);
        }

        .jme-door-icon {
          width: 62px;
          height: 62px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: rgba(19, 143, 232, 0.13);
          border: 1px solid rgba(91, 188, 255, 0.35);
          color: var(--jme-blue-light);
        }

        .jme-door-label {
          margin-top: 42px;
          color: var(--jme-blue-light);
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .jme-door h3 {
          margin: 12px 0 0;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.02;
          letter-spacing: -0.045em;
        }

        .jme-door p {
          max-width: 470px;
          margin: 18px 0 0;
          color: #afbac9;
          font-size: 1rem;
          line-height: 1.65;
        }

        .jme-door-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 34px;
          padding-top: 22px;
          border-top: 1px solid rgba(148, 163, 184, 0.16);
          color: white;
          font-weight: 900;
        }

        .jme-capability-strip {
          padding-bottom: 72px;
        }

        .jme-capability-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-top: 1px solid rgba(148, 163, 184, 0.18);
          border-bottom: 1px solid rgba(148, 163, 184, 0.18);
        }

        .jme-capability {
          min-height: 145px;
          padding: 26px 24px;
          border-right: 1px solid rgba(148, 163, 184, 0.18);
        }

        .jme-capability:last-child {
          border-right: 0;
        }

        .jme-capability strong {
          display: block;
          font-size: 1.05rem;
        }

        .jme-capability span {
          display: block;
          margin-top: 9px;
          color: #94a3b8;
          line-height: 1.55;
        }

        .jme-bottom-callout {
          padding: 0 0 78px;
        }

        .jme-bottom-callout-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          padding: 28px;
          border-radius: 20px;
          border: 1px solid rgba(91, 188, 255, 0.28);
          background: rgba(19, 143, 232, 0.07);
        }

        .jme-bottom-callout h2 {
          margin: 0;
          font-size: clamp(1.7rem, 4vw, 2.8rem);
          letter-spacing: -0.04em;
        }

        .jme-bottom-callout p {
          margin: 10px 0 0;
          color: #aeb9c8;
        }

        .jme-footer {
          border-top: 1px solid rgba(148, 163, 184, 0.15);
          padding: 25px 0 34px;
          color: #8793a4;
          font-size: 0.88rem;
        }

        .jme-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .jme-built-by {
          color: #b8c3d2;
          font-weight: 800;
        }

        @media (max-width: 760px) {
          .jme-shell {
            width: min(100% - 24px, 1180px);
          }

          .jme-header-inner {
            min-height: 76px;
          }

          .jme-brand-logo {
            width: 58px;
            height: 46px;
          }

          .jme-brand-subtitle {
            display: none;
          }

          .jme-header-button {
            min-width: 48px;
            padding: 0 13px;
          }

          .jme-header-button span {
            display: none;
          }

          .jme-hero {
            padding-top: 46px;
          }

          .jme-hero-title {
            font-size: clamp(3.05rem, 16.2vw, 5.4rem);
          }

          .jme-hero-copy {
            font-size: 1.02rem;
          }

          .jme-hero-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .jme-primary-action,
          .jme-secondary-action {
            min-width: 0;
            padding: 0 12px;
          }

          .jme-hero-image-wrap {
            margin-top: 30px;
            border-radius: 16px;
          }

          .jme-hero-image {
            height: 390px;
            object-position: 58% center;
          }

          .jme-image-caption {
            align-items: flex-start;
            flex-direction: column;
          }

          .jme-doors-section {
            padding: 54px 0 58px;
          }

          .jme-door-grid {
            grid-template-columns: 1fr;
          }

          .jme-door {
            min-height: 360px;
            padding: 24px;
          }

          .jme-door-label {
            margin-top: 34px;
          }

          .jme-capability-grid {
            grid-template-columns: 1fr;
          }

          .jme-capability {
            border-right: 0;
            border-bottom: 1px solid rgba(148, 163, 184, 0.18);
          }

          .jme-capability:last-child {
            border-bottom: 0;
          }

          .jme-bottom-callout-inner {
            align-items: stretch;
            flex-direction: column;
          }

          .jme-bottom-callout-inner .jme-primary-action {
            width: 100%;
          }

          .jme-footer-inner {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 390px) {
          .jme-brand-name {
            max-width: 155px;
          }

          .jme-hero-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="jme-page">
        <header className="jme-header">
          <div className="jme-shell jme-header-inner">
            <div className="jme-brand">
              <img
                className="jme-brand-logo"
                src="/images/jme-logo-primary.jpg"
                alt="JME Equipment Rental and Repair logo"
                width={2048}
                height={1009}
              />

              <div>
                <p className="jme-brand-name">
                  Jones Equipment Rental &amp; Repair
                </p>
                <p className="jme-brand-subtitle">JME Equipment</p>
              </div>
            </div>

            <div className="jme-header-actions">
              <a
                className="jme-header-button"
                href={`tel:${phoneDigits}`}
                aria-label={`Call JME at ${formattedPhone}`}
              >
                <Phone size={19} aria-hidden="true" />
                <span>Call</span>
              </a>

              <a
                className="jme-header-button jme-header-button-primary"
                href={`sms:${phoneDigits}`}
                aria-label={`Text JME at ${formattedPhone}`}
              >
                <MessageCircle size={19} aria-hidden="true" />
                <span>Text</span>
              </a>
            </div>
          </div>
        </header>

        <section className="jme-hero">
          <div className="jme-shell">
            <div className="jme-eyebrow">
              <Check size={17} aria-hidden="true" />
              Equipment rental and repair
            </div>

            <h1 className="jme-hero-title">
              Rent it. Repair it.
              <span>Keep the work moving.</span>
            </h1>

            <p className="jme-hero-copy">
              Start with what you need. Request equipment for the job or tell
              JME what equipment needs service. Your request stays connected
              from the first conversation through scheduling, approval, work,
              payment, and completion.
            </p>

            <div className="jme-hero-actions">
              <button
                className="jme-primary-action"
                type="button"
                onClick={scrollToDoors}
              >
                Choose what you need
                <ArrowRight size={20} aria-hidden="true" />
              </button>

              <a
                className="jme-secondary-action"
                href={`sms:${phoneDigits}`}
              >
                <MessageCircle size={20} aria-hidden="true" />
                Text JME
              </a>
            </div>

            <div className="jme-hero-image-wrap">
              <img
                className="jme-hero-image"
                src="/images/jme-hero-service-truck-loader.jpg"
                alt="JME service truck beside heavy equipment in the field"
                width={958}
                height={540}
                fetchPriority="high"
              />

              <div className="jme-image-caption">
                <span>Real equipment. Real field work. Direct communication.</span>
                <span className="jme-proof-line">{formattedPhone}</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="jme-doors-section"
          id="jme-customer-doors"
        >
          <div className="jme-shell">
            <div className="jme-section-heading">
              <h2>What do you need today?</h2>
              <p>
                Choose the path that matches the job. We are building each
                request around the real JME rental and repair process.
              </p>
            </div>

            <div className="jme-door-grid">
              <a
                className="jme-door"
                href={`sms:${phoneDigits}?body=${encodeURIComponent(
                  "Hi, I would like to ask about renting equipment.",
                )}`}
              >
                <div>
                  <span className="jme-door-icon">
                    <Truck size={30} aria-hidden="true" />
                  </span>

                  <div className="jme-door-label">Rental entrance</div>

                  <h3>I need equipment.</h3>

                  <p>
                    Tell JME what kind of work you are doing and the dates you
                    need equipment. Confirmed inventory and rental details will
                    be added as Jones provides them.
                  </p>
                </div>

                <div className="jme-door-action">
                  <span>Start a rental request</span>
                  <ArrowRight size={22} aria-hidden="true" />
                </div>
              </a>

              <a
                className="jme-door"
                href={`sms:${phoneDigits}?body=${encodeURIComponent(
                  "Hi, I have equipment that needs repair.",
                )}`}
              >
                <div>
                  <span className="jme-door-icon">
                    <Wrench size={30} aria-hidden="true" />
                  </span>

                  <div className="jme-door-label">Repair entrance</div>

                  <h3>My equipment needs repair.</h3>

                  <p>
                    Identify the machine, describe the problem, and begin the
                    conversation with JME. The guided repair intake will be
                    expanded around the real shop and field-service workflow.
                  </p>
                </div>

                <div className="jme-door-action">
                  <span>Start a repair request</span>
                  <ArrowRight size={22} aria-hidden="true" />
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="jme-capability-strip">
          <div className="jme-shell">
            <div className="jme-capability-grid">
              <div className="jme-capability">
                <strong>Guided requests</strong>
                <span>
                  Customers begin with the equipment, dates, job, or machine
                  problem instead of a giant blank form.
                </span>
              </div>

              <div className="jme-capability">
                <strong>Direct call and text</strong>
                <span>
                  Customers can reach JME directly at {formattedPhone} while
                  the connected request system is being built.
                </span>
              </div>

              <div className="jme-capability">
                <strong>One connected outcome</strong>
                <span>
                  Equipment, schedules, approvals, money, work, and final proof
                  stay attached to the original request.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="jme-bottom-callout">
          <div className="jme-shell">
            <div className="jme-bottom-callout-inner">
              <div>
                <h2>Need equipment or need yours running again?</h2>
                <p>
                  Call or text Jones Equipment Rental &amp; Repair directly.
                </p>
              </div>

              <a
                className="jme-primary-action"
                href={`tel:${phoneDigits}`}
              >
                <Phone size={20} aria-hidden="true" />
                Call {formattedPhone}
              </a>
            </div>
          </div>
        </section>

        <footer className="jme-footer">
          <div className="jme-shell jme-footer-inner">
            <span>
              Jones Equipment Rental &amp; Repair · {formattedPhone}
            </span>
            <span className="jme-built-by">Built by HomePlanet</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

