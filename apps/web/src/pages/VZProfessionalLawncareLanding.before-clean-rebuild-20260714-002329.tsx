import React from "react";

const services = [
  {
    title: "Mowing",
    description: "Clean, consistent mowing that keeps the whole property looking maintained.",
    icon: "mower",
  },
  {
    title: "Edging",
    description: "Sharp borders along driveways, sidewalks, beds, and property lines.",
    icon: "edge",
  },
  {
    title: "Trimming",
    description: "Detailed trimming around fences, trees, landscaping, and tight spaces.",
    icon: "trim",
  },
  {
    title: "Mulch Installation",
    description: "Fresh mulch installation for cleaner beds and stronger curb appeal.",
    icon: "mulch",
  },
  {
    title: "Gutter Cleaning",
    description: "Leaves and buildup removed so water can drain properly.",
    icon: "gutter",
  },
  {
    title: "Window Cleaning",
    description: "Exterior window cleaning for a brighter, cleaner-looking property.",
    icon: "window",
  },
  {
    title: "Roof Cleaning",
    description: "Exterior roof cleaning that improves the appearance of your home.",
    icon: "roof",
  },
  {
    title: "Additional Services",
    description: "Ask about other exterior property services available through V&Z.",
    icon: "more",
  },
];

function ServiceIcon({ type }: { type: string }) {
  if (type === "mower") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="14" cy="37" r="5" />
        <circle cx="34" cy="37" r="5" />
        <path d="M10 31h26l-4-13H18l-3 7h-5" />
        <path d="M30 18l7-9" />
        <path d="M36 9h6" />
      </svg>
    );
  }

  if (type === "edge") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 38h30" />
        <path d="M24 8v30" />
        <path d="M18 14h12" />
        <path d="M14 38c0-8 4-13 10-17" />
      </svg>
    );
  }

  if (type === "trim") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="14" cy="15" r="6" />
        <circle cx="14" cy="33" r="6" />
        <path d="M19 19l20 20" />
        <path d="M19 29L39 9" />
      </svg>
    );
  }

  if (type === "mulch") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 34c7-12 23-12 30 0" />
        <path d="M12 34h24" />
        <path d="M17 27c1-7 5-12 12-16-1 8-5 13-12 16Z" />
        <path d="M24 26c5-4 10-5 15-2-4 5-9 6-15 2Z" />
      </svg>
    );
  }

  if (type === "gutter") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M7 14h34" />
        <path d="M10 14v9c0 6 4 10 10 10h8c6 0 10-4 10-10v-9" />
        <path d="M37 30v10" />
        <path d="M33 40h8" />
      </svg>
    );
  }

  if (type === "window") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="9" y="7" width="30" height="34" rx="2" />
        <path d="M24 7v34" />
        <path d="M9 24h30" />
      </svg>
    );
  }

  if (type === "roof") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M6 25L24 9l18 16" />
        <path d="M11 23v17h26V23" />
        <path d="M19 40V29h10v11" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="12" cy="24" r="3" />
      <circle cx="24" cy="24" r="3" />
      <circle cx="36" cy="24" r="3" />
    </svg>
  );
}

export default function VZProfessionalLawncareLanding() {
  const scrollToQuote = () => {
    document.getElementById("vz-quote")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <style>{`
        :root {
          --vz-black: #050705;
          --vz-panel: #0c110c;
          --vz-panel-soft: #121912;
          --vz-green: #087f23;
          --vz-green-dark: #035414;
          --vz-lime: #9ae600;
          --vz-lime-soft: #c8ff36;
          --vz-gold: #ffd000;
          --vz-white: #f7f9f5;
          --vz-muted: #aeb8aa;
          --vz-border: rgba(154, 230, 0, 0.22);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--vz-black);
        }

        .vz-page {
          min-height: 100vh;
          overflow-x: hidden;
          color: var(--vz-white);
          background:
            radial-gradient(circle at 82% 7%, rgba(8, 127, 35, 0.28), transparent 30rem),
            radial-gradient(circle at 8% 30%, rgba(255, 208, 0, 0.08), transparent 24rem),
            var(--vz-black);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .vz-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .vz-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 78px;
          gap: 24px;
        }

        .vz-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .vz-mark {
          display: flex;
          align-items: baseline;
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: clamp(2.2rem, 5vw, 3.7rem);
          font-weight: 900;
          line-height: 0.8;
          letter-spacing: -0.08em;
          color: white;
          text-shadow: 0 8px 22px rgba(0, 0, 0, 0.6);
        }

        .vz-mark span {
          color: var(--vz-lime);
          font-size: 0.56em;
          margin: 0 0.08em;
          letter-spacing: -0.04em;
        }

        .vz-brand-copy {
          display: grid;
          line-height: 1;
          text-transform: uppercase;
        }

        .vz-brand-copy strong {
          font-size: 0.86rem;
          letter-spacing: 0.15em;
        }

        .vz-brand-copy small {
          margin-top: 6px;
          color: var(--vz-lime);
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        .vz-top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vz-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 22px;
          border: 1px solid transparent;
          border-radius: 13px;
          font: inherit;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            border-color 160ms ease,
            background 160ms ease;
        }

        .vz-button:hover {
          transform: translateY(-2px);
        }

        .vz-button-gold {
          color: #111500;
          background: linear-gradient(135deg, #ffe54a, var(--vz-gold));
          box-shadow: 0 14px 34px rgba(255, 208, 0, 0.18);
        }

        .vz-button-outline {
          color: white;
          border-color: rgba(154, 230, 0, 0.6);
          background: rgba(4, 12, 5, 0.75);
        }

        .vz-button-outline:hover {
          border-color: var(--vz-lime);
          background: rgba(154, 230, 0, 0.08);
        }

        .vz-hero {
          position: relative;
          isolation: isolate;
          padding: 66px 0 84px;
        }

        .vz-hero::after {
          position: absolute;
          right: -12%;
          bottom: 20px;
          left: 34%;
          z-index: -1;
          height: 230px;
          content: "";
          border-radius: 50%;
          background: radial-gradient(circle, rgba(8, 127, 35, 0.24), transparent 68%);
          filter: blur(22px);
        }

        .vz-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(320px, 0.88fr);
          align-items: center;
          gap: clamp(44px, 7vw, 96px);
        }

        .vz-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 22px;
          color: var(--vz-lime-soft);
          font-size: 0.77rem;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .vz-eyebrow::before {
          width: 34px;
          height: 3px;
          content: "";
          border-radius: 999px;
          background: linear-gradient(90deg, var(--vz-lime), var(--vz-gold));
        }

        .vz-hero h1 {
          max-width: 760px;
          margin: 0;
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: clamp(4.1rem, 9vw, 7.6rem);
          font-weight: 900;
          line-height: 0.86;
          letter-spacing: -0.035em;
          text-transform: uppercase;
        }

        .vz-hero h1 span {
          display: block;
          margin-top: 0.08em;
          color: var(--vz-lime);
          text-shadow: 0 0 38px rgba(154, 230, 0, 0.16);
        }

        .vz-hero-copy {
          max-width: 690px;
          margin-top: 28px;
          color: #c8d0c4;
          font-size: clamp(1rem, 2vw, 1.16rem);
          line-height: 1.75;
        }

        .vz-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .vz-proof-row {
          display: flex;
          flex-wrap: wrap;
          gap: 18px 28px;
          margin-top: 34px;
          color: #d8ded5;
          font-size: 0.9rem;
          font-weight: 800;
        }

        .vz-proof-row span {
          display: inline-flex;
          align-items: center;
          gap: 9px;
        }

        .vz-proof-row span::before {
          display: grid;
          width: 23px;
          height: 23px;
          content: "✓";
          place-items: center;
          border: 1px solid var(--vz-border);
          border-radius: 50%;
          color: var(--vz-lime);
          background: rgba(154, 230, 0, 0.08);
        }

        .vz-identity-card {
          position: relative;
          overflow: hidden;
          min-height: 470px;
          padding: clamp(30px, 5vw, 54px);
          border: 1px solid rgba(154, 230, 0, 0.34);
          border-radius: 34px;
          background:
            linear-gradient(145deg, rgba(10, 79, 24, 0.92), rgba(3, 31, 10, 0.96) 50%, rgba(3, 6, 4, 0.98));
          box-shadow:
            0 40px 90px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.07);
        }

        .vz-identity-card::before {
          position: absolute;
          top: -110px;
          right: -100px;
          width: 340px;
          height: 340px;
          content: "";
          border: 70px solid rgba(154, 230, 0, 0.12);
          border-radius: 50%;
        }

        .vz-identity-card::after {
          position: absolute;
          right: -10%;
          bottom: 32px;
          left: -10%;
          height: 44px;
          content: "";
          border-top: 7px solid var(--vz-gold);
          border-radius: 50%;
          transform: rotate(-5deg);
          opacity: 0.95;
        }

        .vz-card-content {
          position: relative;
          z-index: 1;
          display: flex;
          min-height: 360px;
          flex-direction: column;
        }

        .vz-card-mark {
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: clamp(4.8rem, 10vw, 7.6rem);
          font-weight: 900;
          line-height: 0.78;
          letter-spacing: -0.08em;
          color: white;
        }

        .vz-card-mark span {
          color: var(--vz-lime);
          font-size: 0.48em;
        }

        .vz-card-title {
          max-width: 320px;
          margin-top: 22px;
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          line-height: 0.96;
          letter-spacing: 0.025em;
          text-transform: uppercase;
        }

        .vz-card-title strong {
          display: block;
          margin-top: 6px;
          color: var(--gold);
          color: var(--vz-gold);
        }

        .vz-card-services {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px 18px;
          margin-top: 32px;
          color: #f1f6ef;
          font-size: 0.88rem;
          font-weight: 850;
          text-transform: uppercase;
        }

        .vz-card-services span::before {
          margin-right: 8px;
          color: var(--vz-gold);
          content: "✓";
        }

        .vz-card-contact {
          margin-top: auto;
          padding-top: 38px;
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          letter-spacing: 0.025em;
        }

        .vz-band {
          position: relative;
          height: 17px;
          overflow: hidden;
          background: linear-gradient(90deg, var(--vz-gold), var(--vz-lime) 54%, var(--vz-green));
          clip-path: polygon(0 58%, 35% 20%, 67% 72%, 100% 34%, 100% 100%, 0 100%);
        }

        .vz-section {
          padding: 90px 0;
        }

        .vz-section-dark {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background:
            linear-gradient(180deg, rgba(8, 14, 9, 0.78), rgba(4, 7, 5, 0.94));
        }

        .vz-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 40px;
        }

        .vz-kicker {
          margin-bottom: 11px;
          color: var(--vz-lime);
          font-size: 0.76rem;
          font-weight: 900;
          letter-spacing: 0.19em;
          text-transform: uppercase;
        }

        .vz-section-heading h2,
        .vz-trust-copy h2,
        .vz-quote h2 {
          margin: 0;
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: clamp(2.8rem, 6vw, 5rem);
          line-height: 0.92;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }

        .vz-section-heading p {
          max-width: 460px;
          margin: 0;
          color: var(--vz-muted);
          line-height: 1.65;
        }

        .vz-service-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .vz-service-card {
          position: relative;
          min-height: 255px;
          padding: 26px;
          overflow: hidden;
          border: 1px solid rgba(154, 230, 0, 0.17);
          border-radius: 23px;
          background:
            linear-gradient(150deg, rgba(18, 25, 18, 0.98), rgba(7, 11, 8, 0.98));
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.2);
          transition:
            transform 160ms ease,
            border-color 160ms ease;
        }

        .vz-service-card:hover {
          transform: translateY(-4px);
          border-color: rgba(154, 230, 0, 0.55);
        }

        .vz-service-card::after {
          position: absolute;
          right: -55px;
          bottom: -70px;
          width: 150px;
          height: 150px;
          content: "";
          border: 23px solid rgba(154, 230, 0, 0.05);
          border-radius: 50%;
        }

        .vz-service-icon {
          display: grid;
          width: 56px;
          height: 56px;
          margin-bottom: 28px;
          place-items: center;
          border: 1px solid rgba(154, 230, 0, 0.35);
          border-radius: 16px;
          color: var(--vz-lime);
          background: rgba(154, 230, 0, 0.07);
        }

        .vz-service-icon svg {
          width: 31px;
          height: 31px;
          fill: none;
          stroke: currentColor;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .vz-service-card h3 {
          position: relative;
          z-index: 1;
          margin: 0;
          font-size: 1.18rem;
          text-transform: uppercase;
        }

        .vz-service-card p {
          position: relative;
          z-index: 1;
          margin: 12px 0 0;
          color: var(--vz-muted);
          font-size: 0.93rem;
          line-height: 1.6;
        }

        .vz-trust-layout {
          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          align-items: center;
          gap: 70px;
        }

        .vz-trust-copy p {
          max-width: 520px;
          margin: 24px 0 0;
          color: var(--vz-muted);
          font-size: 1.04rem;
          line-height: 1.75;
        }

        .vz-trust-copy h2 span {
          color: var(--vz-lime);
        }

        .vz-trust-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .vz-trust-card {
          min-height: 170px;
          padding: 25px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          background: rgba(15, 21, 15, 0.85);
        }

        .vz-trust-number {
          color: var(--vz-gold);
          font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: 2.1rem;
        }

        .vz-trust-card h3 {
          margin: 13px 0 8px;
          color: var(--vz-lime-soft);
          text-transform: uppercase;
        }

        .vz-trust-card p {
          margin: 0;
          color: var(--vz-muted);
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .vz-quote-wrap {
          padding: 0 0 90px;
        }

        .vz-quote {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 32px;
          padding: clamp(32px, 5vw, 58px);
          border: 1px solid rgba(154, 230, 0, 0.42);
          border-radius: 30px;
          background:
            radial-gradient(circle at 80% 0%, rgba(154, 230, 0, 0.13), transparent 20rem),
            linear-gradient(135deg, rgba(9, 71, 21, 0.94), rgba(4, 16, 7, 0.98) 55%, #050705);
          box-shadow: 0 34px 80px rgba(0, 0, 0, 0.34);
        }

        .vz-quote::after {
          position: absolute;
          right: -120px;
          bottom: -92px;
          width: 330px;
          height: 180px;
          content: "";
          border-top: 10px solid var(--vz-gold);
          border-radius: 50%;
          transform: rotate(-12deg);
        }

        .vz-quote p {
          max-width: 640px;
          margin: 16px 0 0;
          color: #d3dbd0;
          line-height: 1.7;
        }

        .vz-quote-actions {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 10px;
          min-width: 220px;
        }

        .vz-footer {
          padding: 28px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          color: #94a091;
          font-size: 0.86rem;
        }

        .vz-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }

        .vz-footer strong {
          color: white;
        }

        @media (max-width: 960px) {
          .vz-top-actions .vz-button-outline {
            display: none;
          }

          .vz-hero-grid,
          .vz-trust-layout {
            grid-template-columns: 1fr;
          }

          .vz-identity-card {
            min-height: 420px;
          }

          .vz-service-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .vz-section-heading {
            align-items: start;
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .vz-shell {
            width: min(100% - 24px, 1180px);
          }

          .vz-topbar {
            min-height: 70px;
          }

          .vz-brand-copy {
            display: none;
          }

          .vz-top-actions .vz-button {
            min-height: 44px;
            padding: 0 15px;
            font-size: 0.82rem;
          }

          .vz-hero {
            padding: 44px 0 58px;
          }

          .vz-hero-grid {
            gap: 38px;
          }

          .vz-hero h1 {
            font-size: clamp(3.7rem, 19vw, 5.2rem);
          }

          .vz-hero-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .vz-hero-actions .vz-button-gold {
            grid-column: 1 / -1;
          }

          .vz-button {
            width: 100%;
            min-height: 54px;
            padding: 0 17px;
          }

          .vz-proof-row {
            display: grid;
            gap: 12px;
          }

          .vz-identity-card {
            min-height: 400px;
            padding: 28px 24px;
            border-radius: 25px;
          }

          .vz-card-services {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .vz-card-services span:nth-child(n + 5) {
            display: none;
          }

          .vz-section {
            padding: 68px 0;
          }

          .vz-service-grid,
          .vz-trust-grid {
            grid-template-columns: 1fr;
          }

          .vz-service-card {
            min-height: 215px;
          }

          .vz-quote {
            grid-template-columns: 1fr;
          }

          .vz-quote-actions {
            width: 100%;
          }

          .vz-footer-row {
            align-items: start;
            flex-direction: column;
          }
        }
      `}</style>

      <main className="vz-page">
        <header className="vz-shell vz-topbar">
          <div className="vz-brand">
            <div className="vz-mark">
              V<span>&amp;</span>Z
            </div>

            <div className="vz-brand-copy">
              <strong>Professional</strong>
              <small>Lawncare LLC</small>
            </div>
          </div>

          <div className="vz-top-actions">
            <a className="vz-button vz-button-outline" href="sms:8635328123">
              Text Eric
            </a>

            <button
              type="button"
              className="vz-button vz-button-gold"
              onClick={scrollToQuote}
            >
              Get My Quote
            </button>
          </div>
        </header>

        <section className="vz-hero">
          <div className="vz-shell vz-hero-grid">
            <div>
              <div className="vz-eyebrow">Professional exterior care</div>

              <h1>
                Your property.
                <span>Kept sharp.</span>
              </h1>

              <p className="vz-hero-copy">
                Dependable mowing, edging, trimming, mulch installation,
                gutter cleaning, window cleaning, roof cleaning, and additional
                exterior services from V&amp;Z Professional Lawncare LLC.
              </p>

              <div className="vz-hero-actions">
                <a
                  className="vz-button vz-button-gold"
                  href="tel:8635328123"
                >
                  Call (863) 532-8123
                </a>

                <a
                  className="vz-button vz-button-outline"
                  href="sms:8635328123"
                >
                  Text Eric
                </a>

                <button
                  type="button"
                  className="vz-button vz-button-outline"
                  onClick={scrollToQuote}
                >
                  Request a Quote
                </button>
              </div>

              <div className="vz-proof-row">
                <span>Free estimates</span>
                <span>Local service</span>
                <span>Clear communication</span>
              </div>
            </div>

            <div className="vz-identity-card">
              <div className="vz-card-content">
                <div className="vz-card-mark">
                  V<span>&amp;</span>Z
                </div>

                <div className="vz-card-title">
                  Professional
                  <strong>Lawncare LLC</strong>
                </div>

                <div className="vz-card-services">
                  <span>Mowing</span>
                  <span>Gutter Cleaning</span>
                  <span>Edging</span>
                  <span>Window Cleaning</span>
                  <span>Trimming</span>
                  <span>Roof Cleaning</span>
                  <span>Mulch Install</span>
                  <span>And More</span>
                </div>

                <div className="vz-card-contact">(863) 532-8123</div>
              </div>
            </div>
          </div>
        </section>

        <div className="vz-band" />

        <section className="vz-section vz-section-dark">
          <div className="vz-shell">
            <div className="vz-section-heading">
              <div>
                <div className="vz-kicker">Exterior services</div>
                <h2>One call. A sharper property.</h2>
              </div>

              <p>
                Choose the service you need now. Property details, yard
                condition, photos, and scheduling will be handled through the
                V&amp;Z quote flow.
              </p>
            </div>

            <div className="vz-service-grid">
              {services.map((service) => (
                <article className="vz-service-card" key={service.title}>
                  <div className="vz-service-icon">
                    <ServiceIcon type={service.icon} />
                  </div>

                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="vz-section">
          <div className="vz-shell vz-trust-layout">
            <div className="vz-trust-copy">
              <div className="vz-kicker">The V&amp;Z standard</div>

              <h2>
                Pride in every
                <span> detail.</span>
              </h2>

              <p>
                The experience should feel as professional as the finished
                property: a clear quote, dependable scheduling, job approval,
                work updates, completion photos, payment, and follow-up.
              </p>
            </div>

            <div className="vz-trust-grid">
              <article className="vz-trust-card">
                <div className="vz-trust-number">01</div>
                <h3>Dependable</h3>
                <p>Clear expectations and dependable scheduling from the start.</p>
              </article>

              <article className="vz-trust-card">
                <div className="vz-trust-number">02</div>
                <h3>Detail Driven</h3>
                <p>The finishing work matters just as much as the main service.</p>
              </article>

              <article className="vz-trust-card">
                <div className="vz-trust-number">03</div>
                <h3>Easy to Reach</h3>
                <p>Call or text without fighting through a complicated process.</p>
              </article>

              <article className="vz-trust-card">
                <div className="vz-trust-number">04</div>
                <h3>Built Around Proof</h3>
                <p>Work photos, completion details, payment, and follow-up stay connected.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="vz-quote-wrap" id="vz-quote">
          <div className="vz-shell">
            <div className="vz-quote">
              <div>
                <div className="vz-kicker">Ready when you are</div>

                <h2>Let us take a look.</h2>

                <p>
                  Tell V&amp;Z what the property needs. The full quote request
                  flow will collect service details, current condition, access
                  information, photos, and preferred scheduling.
                </p>
              </div>

              <div className="vz-quote-actions">
                <a
                  className="vz-button vz-button-gold"
                  href="tel:8635328123"
                >
                  Call for a Quote
                </a>

                <a
                  className="vz-button vz-button-outline"
                  href="sms:8635328123"
                >
                  Text Eric
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="vz-footer">
          <div className="vz-shell vz-footer-row">
            <div>
              <strong>V&amp;Z Professional Lawncare LLC</strong>
              <br />
              Mowing, property care, and exterior services.
            </div>

            <div>
              (863) 532-8123
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}