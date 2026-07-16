import React from "react";

const lawnServices = [
  "Mowing",
  "Edging",
  "Trimming",
  "Mulch Installation",
];

const exteriorServices = [
  "Gutter Cleaning",
  "Window Cleaning",
  "Roof Cleaning",
  "Additional Property Services",
];

const trustPoints = [
  {
    title: "Professional work",
    text: "Clean, careful property service with attention to the details people notice.",
  },
  {
    title: "Reliable service",
    text: "Straightforward communication and dependable follow-through from start to finish.",
  },
  {
    title: "Detail driven",
    text: "Sharp edges, clean finishes, and work that improves the whole property.",
  },
  {
    title: "Locally owned",
    text: "Personal service from a local business that takes pride in every job.",
  },
];

export default function VZProfessionalLawncareLanding() {
  return (
    <>
      <style>{`
        :root {
          --vz-black: #050706;
          --vz-black-soft: #0b0f0c;
          --vz-panel: #101611;
          --vz-green: #087d2a;
          --vz-green-deep: #03531b;
          --vz-lime: #a7df21;
          --vz-yellow: #ffd128;
          --vz-white: #f7f8f4;
          --vz-muted: #b7c0b6;
          --vz-line: rgba(255, 255, 255, 0.09);
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

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        .vz-page {
          min-height: 100vh;
          overflow-x: hidden;
          color: var(--vz-white);
          background:
            radial-gradient(circle at 83% 4%, rgba(10, 128, 43, 0.18), transparent 27rem),
            var(--vz-black);
          font-family: Inter, Arial, Helvetica, sans-serif;
        }

        .vz-shell {
          width: min(1160px, calc(100% - 40px));
          margin: 0 auto;
        }

        .vz-header {
          position: relative;
          z-index: 20;
          display: flex;
          min-height: 82px;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
        }

        .vz-logo {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          color: var(--vz-white);
          text-decoration: none;
        }

        .vz-logo-mark {
          display: flex;
          align-items: center;
          font-size: 2.25rem;
          font-weight: 950;
          line-height: 1;
          letter-spacing: -0.11em;
        }

        .vz-logo-mark span {
          margin: 0 0.1em;
          color: var(--vz-lime);
          font-size: 0.58em;
        }

        .vz-logo-text {
          display: grid;
          gap: 4px;
          line-height: 1;
          text-transform: uppercase;
        }

        .vz-logo-text strong {
          font-size: 0.78rem;
          letter-spacing: 0.16em;
        }

        .vz-logo-text small {
          color: var(--vz-lime);
          font-size: 0.67rem;
          font-weight: 850;
          letter-spacing: 0.18em;
        }

        .vz-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .vz-nav-link {
          color: #d7ddd4;
          font-size: 0.86rem;
          font-weight: 750;
          text-decoration: none;
          transition: color 150ms ease;
        }

        .vz-nav-link:hover {
          color: var(--vz-lime);
        }

        .vz-button {
          display: inline-flex;
          min-height: 50px;
          align-items: center;
          justify-content: center;
          padding: 0 22px;
          border: 1px solid transparent;
          border-radius: 12px;
          color: inherit;
          font: inherit;
          font-size: 0.9rem;
          font-weight: 850;
          text-decoration: none;
          cursor: pointer;
          transition:
            transform 150ms ease,
            border-color 150ms ease,
            background 150ms ease,
            box-shadow 150ms ease;
        }

        .vz-button:hover {
          transform: translateY(-2px);
        }

        .vz-button-primary {
          color: #111400;
          background: var(--vz-yellow);
          box-shadow: 0 15px 34px rgba(255, 209, 40, 0.17);
        }

        .vz-button-dark {
          border-color: rgba(255, 255, 255, 0.17);
          background: rgba(255, 255, 255, 0.035);
        }

        .vz-button-dark:hover {
          border-color: rgba(167, 223, 33, 0.55);
          background: rgba(167, 223, 33, 0.07);
        }

        .vz-hero {
          position: relative;
          padding: 72px 0 92px;
        }

        .vz-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(390px, 0.85fr);
          align-items: center;
          gap: clamp(50px, 7vw, 96px);
        }

        .vz-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 22px;
          color: var(--vz-lime);
          font-size: 0.73rem;
          font-weight: 900;
          letter-spacing: 0.19em;
          text-transform: uppercase;
        }

        .vz-eyebrow::before {
          width: 35px;
          height: 3px;
          content: "";
          border-radius: 999px;
          background: var(--vz-yellow);
        }

        .vz-hero h1 {
          max-width: 700px;
          margin: 0;
          font-size: clamp(3.35rem, 7vw, 5.9rem);
          font-weight: 900;
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .vz-hero h1 span {
          display: block;
          color: var(--vz-lime);
        }

        .vz-hero-copy {
          max-width: 635px;
          margin: 26px 0 0;
          color: #c5cdc2;
          font-size: clamp(1rem, 1.8vw, 1.12rem);
          line-height: 1.72;
        }

        .vz-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .vz-hero-note {
          display: flex;
          flex-wrap: wrap;
          gap: 11px 22px;
          margin-top: 27px;
          color: #d8ded5;
          font-size: 0.84rem;
          font-weight: 750;
        }

        .vz-hero-note span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .vz-hero-note span::before {
          width: 7px;
          height: 7px;
          content: "";
          border-radius: 50%;
          background: var(--vz-yellow);
          box-shadow: 0 0 0 4px rgba(255, 209, 40, 0.08);
        }

        .vz-sign {
          position: relative;
          overflow: hidden;
          min-height: 470px;
          border: 1px solid rgba(167, 223, 33, 0.28);
          border-radius: 30px;
          background:
            radial-gradient(circle at 82% 12%, rgba(167, 223, 33, 0.16), transparent 14rem),
            linear-gradient(145deg, #0c8a31 0%, #076f27 42%, #034518 100%);
          box-shadow:
            0 36px 90px rgba(0, 0, 0, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .vz-sign-glow {
          position: absolute;
          top: -80px;
          right: -60px;
          width: 260px;
          height: 260px;
          border: 48px solid rgba(255, 255, 255, 0.055);
          border-radius: 50%;
        }

        .vz-sign-content {
          position: relative;
          z-index: 4;
          display: flex;
          min-height: 470px;
          flex-direction: column;
          padding: 48px 45px;
        }

        .vz-sign-logo {
          display: flex;
          align-items: center;
          font-size: clamp(5.4rem, 10vw, 8rem);
          font-weight: 950;
          line-height: 0.82;
          letter-spacing: -0.12em;
        }

        .vz-sign-logo span {
          margin: 0 0.08em;
          color: var(--vz-lime);
          font-size: 0.48em;
        }

        .vz-sign-name {
          margin-top: 24px;
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.025em;
          text-transform: uppercase;
        }

        .vz-sign-name strong {
          display: block;
          margin-top: 5px;
          color: var(--vz-yellow);
        }

        .vz-sign-tagline {
          max-width: 260px;
          margin-top: 21px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.82rem;
          font-weight: 850;
          line-height: 1.65;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .vz-sign-phone {
          position: relative;
          z-index: 5;
          margin-top: auto;
          padding-top: 75px;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .vz-sign-black-sweep {
          position: absolute;
          z-index: 1;
          right: -12%;
          bottom: -125px;
          left: -18%;
          height: 275px;
          border-radius: 50% 50% 0 0;
          background: #050706;
          transform: rotate(-6deg);
        }

        .vz-sign-yellow-sweep {
          position: absolute;
          z-index: 2;
          right: -12%;
          bottom: 99px;
          left: -15%;
          height: 16px;
          border-radius: 50%;
          background: var(--vz-yellow);
          transform: rotate(-6deg);
        }

        .vz-sign-lime-sweep {
          position: absolute;
          z-index: 3;
          right: -12%;
          bottom: 86px;
          left: -15%;
          height: 5px;
          border-radius: 50%;
          background: var(--vz-lime);
          transform: rotate(-6deg);
        }

        .vz-divider {
          height: 8px;
          background: linear-gradient(
            90deg,
            var(--vz-yellow),
            var(--vz-lime) 48%,
            var(--vz-green)
          );
        }

        .vz-section {
          padding: 88px 0;
        }

        .vz-section-dark {
          border-top: 1px solid rgba(255, 255, 255, 0.045);
          background:
            linear-gradient(180deg, rgba(14, 20, 15, 0.96), rgba(6, 9, 7, 0.98));
        }

        .vz-section-heading {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 430px);
          align-items: end;
          gap: 46px;
          margin-bottom: 42px;
        }

        .vz-kicker {
          margin-bottom: 11px;
          color: var(--vz-lime);
          font-size: 0.73rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .vz-section h2,
        .vz-contact h2 {
          margin: 0;
          font-size: clamp(2.45rem, 5vw, 4.15rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.052em;
        }

        .vz-section-heading p {
          margin: 0;
          color: var(--vz-muted);
          line-height: 1.7;
        }

        .vz-service-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 25px;
          background: var(--vz-panel);
        }

        .vz-service-group {
          position: relative;
          padding: clamp(30px, 5vw, 50px);
        }

        .vz-service-group + .vz-service-group {
          border-left: 1px solid rgba(255, 255, 255, 0.09);
        }

        .vz-service-group:first-child::before {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 4px;
          content: "";
          background: var(--vz-lime);
        }

        .vz-service-group:last-child::before {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 4px;
          content: "";
          background: var(--vz-yellow);
        }

        .vz-service-group h3 {
          margin: 0 0 28px;
          font-size: clamp(1.45rem, 3vw, 2rem);
          letter-spacing: -0.03em;
        }

        .vz-service-list {
          display: grid;
          gap: 0;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .vz-service-list li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 55px;
          gap: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          color: #e4e9e1;
          font-size: 0.98rem;
          font-weight: 720;
        }

        .vz-service-list li:last-child {
          border-bottom: 0;
        }

        .vz-service-list li::after {
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          content: "";
          border-radius: 50%;
          background: var(--vz-yellow);
        }

        .vz-service-group:first-child .vz-service-list li::after {
          background: var(--vz-lime);
        }

        .vz-trust-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .vz-trust-card {
          min-height: 215px;
          padding: 28px 25px;
          border: 1px solid rgba(255, 255, 255, 0.085);
          border-radius: 19px;
          background:
            linear-gradient(145deg, rgba(18, 25, 19, 0.96), rgba(9, 13, 10, 0.98));
        }

        .vz-trust-line {
          width: 37px;
          height: 4px;
          margin-bottom: 37px;
          border-radius: 999px;
          background: var(--vz-yellow);
        }

        .vz-trust-card:nth-child(even) .vz-trust-line {
          background: var(--vz-lime);
        }

        .vz-trust-card h3 {
          margin: 0 0 11px;
          font-size: 1.08rem;
        }

        .vz-trust-card p {
          margin: 0;
          color: var(--vz-muted);
          font-size: 0.9rem;
          line-height: 1.65;
        }

        .vz-contact-wrap {
          padding: 0 0 92px;
        }

        .vz-contact {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 42px;
          padding: clamp(38px, 6vw, 65px);
          border: 1px solid rgba(167, 223, 33, 0.3);
          border-radius: 28px;
          background:
            radial-gradient(circle at 90% 8%, rgba(167, 223, 33, 0.12), transparent 18rem),
            linear-gradient(140deg, #087d2a, #03531b 47%, #07110a 100%);
        }

        .vz-contact::after {
          position: absolute;
          right: -110px;
          bottom: -93px;
          width: 390px;
          height: 185px;
          content: "";
          border-top: 8px solid var(--vz-yellow);
          border-radius: 50%;
          transform: rotate(-9deg);
        }

        .vz-contact-copy {
          position: relative;
          z-index: 2;
        }

        .vz-contact p {
          max-width: 620px;
          margin: 18px 0 0;
          color: rgba(255, 255, 255, 0.81);
          line-height: 1.7;
        }

        .vz-contact-actions {
          position: relative;
          z-index: 3;
          display: grid;
          min-width: 220px;
          gap: 11px;
        }

        .vz-footer {
          padding: 30px 0;
          border-top: 1px solid var(--vz-line);
          color: #99a397;
          font-size: 0.83rem;
        }

        .vz-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .vz-footer strong {
          color: var(--vz-white);
        }

        .vz-footer a {
          color: var(--vz-lime);
          text-decoration: none;
        }

        @media (max-width: 960px) {
          .vz-nav-link {
            display: none;
          }

          .vz-hero-grid {
            grid-template-columns: 1fr;
          }

          .vz-sign {
            width: min(100%, 560px);
          }

          .vz-trust-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .vz-shell {
            width: min(100% - 26px, 1160px);
          }

          .vz-header {
            min-height: 70px;
          }

          .vz-logo-text {
            display: none;
          }

          .vz-nav {
            gap: 9px;
          }

          .vz-nav .vz-button-dark {
            display: none;
          }

          .vz-nav .vz-button-primary {
            min-height: 43px;
            padding: 0 14px;
            font-size: 0.8rem;
          }

          .vz-hero {
            padding: 48px 0 64px;
          }

          .vz-hero h1 {
            font-size: clamp(3.15rem, 15vw, 4.4rem);
          }

          .vz-hero-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .vz-hero-actions .vz-button-primary {
            grid-column: 1 / -1;
          }

          .vz-button {
            width: 100%;
            min-height: 52px;
            padding: 0 15px;
          }

          .vz-sign {
            min-height: 410px;
            border-radius: 24px;
          }

          .vz-sign-content {
            min-height: 410px;
            padding: 34px 27px;
          }

          .vz-sign-logo {
            font-size: clamp(5rem, 23vw, 6.5rem);
          }

          .vz-sign-phone {
            padding-top: 64px;
          }

          .vz-section {
            padding: 68px 0;
          }

          .vz-section-heading {
            grid-template-columns: 1fr;
            align-items: start;
            gap: 22px;
          }

          .vz-service-layout {
            grid-template-columns: 1fr;
          }

          .vz-service-group + .vz-service-group {
            border-top: 1px solid rgba(255, 255, 255, 0.09);
            border-left: 0;
          }

          .vz-trust-grid {
            grid-template-columns: 1fr;
          }

          .vz-trust-card {
            min-height: 0;
          }

          .vz-contact-wrap {
            padding-bottom: 68px;
          }

          .vz-contact {
            grid-template-columns: 1fr;
            padding: 34px 26px;
          }

          .vz-contact-actions {
            width: 100%;
          }

          .vz-footer-row {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <main className="vz-page">
        <header className="vz-shell vz-header">
          <a className="vz-logo" href="/vz" aria-label="V and Z Professional Lawncare">
            <div className="vz-logo-mark">
              V<span>&amp;</span>Z
            </div>

            <div className="vz-logo-text">
              <strong>Professional</strong>
              <small>Lawncare LLC</small>
            </div>
          </a>

          <nav className="vz-nav" aria-label="Main navigation">
            <a className="vz-nav-link" href="#services">
              Services
            </a>

            <a className="vz-nav-link" href="#why-vz">
              Why V&amp;Z
            </a>

            <a className="vz-button vz-button-dark" href="tel:8635328123">
              Call Eric
            </a>

            <a className="vz-button vz-button-primary" href="#estimate">
              Get Free Estimate
            </a>
          </nav>
        </header>

        <section className="vz-hero">
          <div className="vz-shell vz-hero-grid">
            <div className="vz-hero-copy-wrap">
              <div className="vz-eyebrow">Professional property care</div>

              <h1>
                Clean lawns.
                <span>Stronger curb appeal.</span>
              </h1>

              <p className="vz-hero-copy">
                Professional lawn maintenance and exterior cleaning with
                dependable service, clean finishes, and attention to the details
                that make your property stand out.
              </p>

              <div className="vz-hero-actions">
                <a className="vz-button vz-button-primary" href="#estimate">
                  Get Free Estimate
                </a>

                <a className="vz-button vz-button-dark" href="tel:8635328123">
                  Call Eric
                </a>

                <a className="vz-button vz-button-dark" href="sms:8635328123">
                  Text Eric
                </a>
              </div>

              <div className="vz-hero-note">
                <span>Free estimates</span>
                <span>Local service</span>
                <span>Clear communication</span>
              </div>
            </div>

            <div className="vz-sign" aria-label="V and Z brand panel">
              <div className="vz-sign-glow" />

              <div className="vz-sign-content">
                <div className="vz-sign-logo">
                  V<span>&amp;</span>Z
                </div>

                <div className="vz-sign-name">
                  Professional
                  <strong>Lawncare LLC</strong>
                </div>

                <div className="vz-sign-tagline">
                  Professional · Reliable · Detail Driven
                </div>

                <div className="vz-sign-phone">(863) 532-8123</div>
              </div>

              <div className="vz-sign-yellow-sweep" />
              <div className="vz-sign-lime-sweep" />
              <div className="vz-sign-black-sweep" />
            </div>
          </div>
        </section>

        <div className="vz-divider" />

        <section className="vz-section vz-section-dark" id="services">
          <div className="vz-shell">
            <div className="vz-section-heading">
              <div>
                <div className="vz-kicker">Services</div>
                <h2>Complete care for the outside of your property.</h2>
              </div>

              <p>
                From routine lawn maintenance to exterior cleaning, V&amp;Z
                helps keep homes and businesses looking clean, sharp, and cared
                for.
              </p>
            </div>

            <div className="vz-service-layout">
              <article className="vz-service-group">
                <h3>Lawn Care</h3>

                <ul className="vz-service-list">
                  {lawnServices.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </article>

              <article className="vz-service-group">
                <h3>Exterior Cleaning</h3>

                <ul className="vz-service-list">
                  {exteriorServices.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="vz-section" id="why-vz">
          <div className="vz-shell">
            <div className="vz-section-heading">
              <div>
                <div className="vz-kicker">Why V&amp;Z</div>
                <h2>Professional service without the runaround.</h2>
              </div>

              <p>
                Simple communication, dependable work, and a finished property
                you can feel good about.
              </p>
            </div>

            <div className="vz-trust-grid">
              {trustPoints.map((point) => (
                <article className="vz-trust-card" key={point.title}>
                  <div className="vz-trust-line" />
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="vz-contact-wrap" id="estimate">
          <div className="vz-shell">
            <div className="vz-contact">
              <div className="vz-contact-copy">
                <div className="vz-kicker">Free estimate</div>
                <h2>Tell Eric what your property needs.</h2>

                <p>
                  Call or text V&amp;Z to discuss the service, property
                  condition, location, and the best time to take a look.
                </p>
              </div>

              <div className="vz-contact-actions">
                <a className="vz-button vz-button-primary" href="tel:8635328123">
                  Call (863) 532-8123
                </a>

                <a className="vz-button vz-button-dark" href="sms:8635328123">
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
              Lawn care and exterior property services.
            </div>

            <div>
              <a href="tel:8635328123">(863) 532-8123</a>
              <br />
              Built with HomePlanet
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}