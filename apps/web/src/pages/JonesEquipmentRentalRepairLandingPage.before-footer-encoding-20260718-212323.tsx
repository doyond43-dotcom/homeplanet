import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  MessageCircle,
  Phone,
  Truck,
  Wrench,
} from "lucide-react";
import JmeGuidedRequestDrawer, {
  type JmeRequestFlow,
} from "../components/JmeGuidedRequestDrawer";

const phoneDigits = "6156021524";
const formattedPhone = "615-602-1524";

export default function JonesEquipmentRentalRepairLandingPage() {
  const [activeFlow, setActiveFlow] =
    useState<JmeRequestFlow | null>(null);
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
      <style>{`
        /* JME_RUGGED_YARD_VISUAL_PASS
           Jones keeps its existing structure and HomePlanet workflow.
           This layer changes the material, color, weight, and atmosphere. */

        .jme-page,
        .jme-shell {
          --jme-yard-black: #090a0a;
          --jme-yard-charcoal: #121414;
          --jme-yard-steel: #292d2e;
          --jme-yard-steel-light: #555b5d;
          --jme-yard-dust: #b6aa92;
          --jme-yard-cream: #f0eadc;
          --jme-yard-yellow: #e2ad18;
          --jme-yard-yellow-dark: #9b6d00;
          --jme-yard-blue: #167db6;
          --jme-yard-blue-dark: #0d527a;

          background:
            linear-gradient(
              180deg,
              #090a0a 0%,
              #101212 42%,
              #171818 100%
            );
          color: var(--jme-yard-cream);
        }

        .jme-page::before,
        .jme-shell::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.22;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent 0,
              transparent 3px,
              rgba(255, 255, 255, 0.018) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0,
              transparent 8px,
              rgba(0, 0, 0, 0.04) 9px
            );
        }

        .jme-page > *,
        .jme-shell > * {
          position: relative;
          z-index: 1;
        }

        .jme-header {
          border-bottom:
            3px solid var(--jme-yard-yellow);
          background:
            linear-gradient(
              180deg,
              rgba(10, 11, 11, 0.98),
              rgba(13, 15, 15, 0.96)
            );
          box-shadow:
            0 8px 28px rgba(0, 0, 0, 0.42);
        }

        .jme-header::after {
          content: "";
          position: absolute;
          right: 0;
          bottom: -3px;
          width: min(34vw, 420px);
          height: 3px;
          background: var(--jme-yard-blue);
        }

        .jme-brand-name,
        .jme-eyebrow,
        .jme-section-kicker {
          color: var(--jme-yard-yellow);
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .jme-hero {
          background:
            radial-gradient(
              circle at 12% 20%,
              rgba(226, 173, 24, 0.1),
              transparent 24rem
            ),
            linear-gradient(
              145deg,
              #0b0c0c 0%,
              #131515 58%,
              #090a0a 100%
            );
        }

        .jme-hero-title {
          max-width: 960px;
          color: var(--jme-yard-cream);
          text-shadow:
            0 3px 0 rgba(0, 0, 0, 0.8),
            0 12px 30px rgba(0, 0, 0, 0.48);
        }

        .jme-hero-title span {
          color: var(--jme-yard-yellow);
        }

        .jme-hero-copy,
        .jme-section-copy,
        .jme-door p,
        .jme-footer p {
          color: #c9c3b7;
        }

        .jme-hero-actions a,
        .jme-call-button,
        .jme-text-button {
          min-height: 58px;
          border-radius: 3px;
          border-width: 2px;
          text-transform: uppercase;
          letter-spacing: 0.055em;
          box-shadow:
            0 5px 0 rgba(0, 0, 0, 0.72);
        }

        .jme-hero-actions a:first-child,
        .jme-call-button {
          border-color: var(--jme-yard-yellow);
          background:
            linear-gradient(
              180deg,
              #efbd2c,
              var(--jme-yard-yellow)
            );
          color: #111;
        }

        .jme-hero-actions a:first-child:hover,
        .jme-call-button:hover {
          background: #f4c744;
          transform: translateY(-1px);
        }

        .jme-hero-actions a:last-child,
        .jme-text-button {
          border-color: #6b7477;
          background:
            linear-gradient(
              180deg,
              #242829,
              #171a1a
            );
          color: var(--jme-yard-cream);
        }

        .jme-hero-actions a:last-child:hover,
        .jme-text-button:hover {
          border-color: var(--jme-yard-blue);
          background: #20282b;
        }

        .jme-hero-image-wrap,
        .jme-hero-media,
        .jme-hero-image-shell {
          overflow: hidden;
          border-radius: 2px;
          border:
            3px solid #353a3b;
          border-bottom:
            7px solid var(--jme-yard-yellow-dark);
          background: #090a0a;
          box-shadow:
            0 18px 38px rgba(0, 0, 0, 0.5);
        }

        .jme-hero-image-wrap img,
        .jme-hero-media img,
        .jme-hero-image-shell img {
          filter:
            contrast(1.07)
            saturate(0.92)
            brightness(0.93);
        }

        .jme-choice-section,
        .jme-services-section,
        .jme-door-section {
          background:
            linear-gradient(
              180deg,
              #151717 0%,
              #101212 100%
            );
          border-top:
            1px solid #343839;
        }

        .jme-section-title {
          color: var(--jme-yard-cream);
          text-transform: none;
          text-shadow:
            0 2px 0 #000;
        }

        .jme-door-grid {
          gap: 18px;
        }

        .jme-door {
          position: relative;
          isolation: isolate;
          min-height: 330px;
          overflow: hidden;
          justify-content: flex-end;
          border-radius: 2px;
          border:
            3px solid #3b4041;
          border-bottom:
            8px solid var(--jme-yard-yellow-dark);
          background: #101212;
          box-shadow:
            0 16px 30px rgba(0, 0, 0, 0.46);
          transform: none;
        }

        .jme-door::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          background-position: center;
          background-size: cover;
          filter:
            contrast(1.08)
            saturate(0.88)
            brightness(0.82);
          transition:
            transform 220ms ease,
            filter 220ms ease;
        }

        .jme-door:first-child::before {
          background-image:
            url("/images/jme-rental-blue-tractor.jpg");
        }

        .jme-door:last-child::before {
          background-image:
            url("/images/jme-field-repair-loader.jpg");
        }

        .jme-door::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(
              180deg,
              rgba(4, 5, 5, 0.1) 0%,
              rgba(4, 5, 5, 0.38) 35%,
              rgba(4, 5, 5, 0.96) 100%
            );
        }

        .jme-door:hover {
          border-color: var(--jme-yard-yellow);
          border-bottom-color: var(--jme-yard-yellow);
          transform: translateY(-2px);
          box-shadow:
            0 21px 38px rgba(0, 0, 0, 0.56);
        }

        .jme-door:hover::before {
          transform: scale(1.025);
          filter:
            contrast(1.1)
            saturate(0.98)
            brightness(0.88);
        }

        .jme-door-icon,
        .jme-door-number {
          border-radius: 2px;
          border:
            2px solid var(--jme-yard-yellow);
          background:
            rgba(11, 12, 12, 0.92);
          color: var(--jme-yard-yellow);
          box-shadow:
            3px 3px 0 rgba(0, 0, 0, 0.75);
        }

        .jme-door h3 {
          margin-top: auto;
          color: #fff8e8;
          font-size:
            clamp(2rem, 4vw, 3.4rem);
          line-height: 0.96;
          letter-spacing: -0.045em;
          text-transform: uppercase;
          text-shadow:
            0 3px 0 #000,
            0 8px 24px rgba(0, 0, 0, 0.74);
        }

        .jme-door p {
          max-width: 36rem;
          color: #ded6c7;
          font-size: 1rem;
          line-height: 1.55;
          text-shadow:
            0 2px 5px rgba(0, 0, 0, 0.9);
        }

        .jme-door-action,
        .jme-door-cta {
          width: fit-content;
          min-height: 49px;
          padding: 12px 17px;
          border-radius: 2px;
          border:
            2px solid var(--jme-yard-yellow);
          background:
            var(--jme-yard-yellow);
          color: #111;
          font-weight: 950;
          letter-spacing: 0.055em;
          text-transform: uppercase;
          box-shadow:
            4px 4px 0 rgba(0, 0, 0, 0.72);
        }

        .jme-feature-grid,
        .jme-info-grid,
        .jme-proof-grid {
          gap: 10px;
        }

        .jme-feature-card,
        .jme-info-card,
        .jme-proof-card {
          border-radius: 1px;
          border:
            1px solid #4a4f50;
          border-left:
            5px solid var(--jme-yard-yellow-dark);
          background:
            linear-gradient(
              135deg,
              #202323,
              #141616
            );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .jme-feature-card svg,
        .jme-info-card svg,
        .jme-proof-card svg {
          color: var(--jme-yard-yellow);
        }

        .jme-feature-card h3,
        .jme-info-card h3,
        .jme-proof-card h3 {
          color: #f1eadc;
          text-transform: uppercase;
          letter-spacing: 0.035em;
        }

        .jme-feature-card p,
        .jme-info-card p,
        .jme-proof-card p {
          color: #aaa69d;
        }

        .jme-gallery,
        .jme-photo-grid,
        .jme-work-grid {
          gap: 8px;
        }

        .jme-gallery img,
        .jme-photo-grid img,
        .jme-work-grid img {
          border-radius: 1px;
          border:
            2px solid #3e4344;
          filter:
            contrast(1.06)
            saturate(0.88)
            brightness(0.91);
        }

        .jme-contact,
        .jme-final-cta,
        .jme-contact-panel {
          position: relative;
          overflow: hidden;
          border-radius: 2px;
          border:
            3px solid #383d3e;
          border-bottom:
            8px solid var(--jme-yard-yellow);
          background:
            linear-gradient(
              100deg,
              rgba(7, 8, 8, 0.96),
              rgba(13, 15, 15, 0.82)
            ),
            url("/images/jme-diagnostics.jpg")
              center / cover no-repeat;
          box-shadow:
            0 16px 32px rgba(0, 0, 0, 0.48);
        }

        .jme-contact::before,
        .jme-final-cta::before,
        .jme-contact-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              rgba(6, 7, 7, 0.96) 0%,
              rgba(6, 7, 7, 0.88) 52%,
              rgba(6, 7, 7, 0.38) 100%
            );
        }

        .jme-contact > *,
        .jme-final-cta > *,
        .jme-contact-panel > * {
          position: relative;
          z-index: 1;
        }

        .jme-footer {
          border-top:
            3px solid var(--jme-yard-yellow-dark);
          background: #080909;
          color: #aaa398;
        }

        .jme-footer a {
          color: var(--jme-yard-yellow);
        }

        @media (max-width: 760px) {
          .jme-door {
            min-height: 390px;
          }

          .jme-door h3 {
            font-size:
              clamp(2rem, 11vw, 3.2rem);
          }

          .jme-hero-actions a,
          .jme-call-button,
          .jme-text-button {
            border-radius: 2px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .jme-door,
          .jme-door::before {
            transition: none;
          }
        }
      `}</style>
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
              <button
                className="jme-door"
                type="button"
                onClick={() => setActiveFlow("rental")}
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
              </button>

              <button
                className="jme-door"
                type="button"
                onClick={() => setActiveFlow("repair")}
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
              </button>
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

        <JmeGuidedRequestDrawer
          flow={activeFlow}
          onClose={() => setActiveFlow(null)}
        />
        <footer className="jme-footer">
          <div className="jme-shell jme-footer-inner">
            <span>
              Jones Equipment Rental &amp; Repair Ã‚Â· {formattedPhone}
            </span>
            <span className="jme-built-by">Built by HomePlanet</span>
          </div>
        </footer>
      </div>
    </main>
  );
}


