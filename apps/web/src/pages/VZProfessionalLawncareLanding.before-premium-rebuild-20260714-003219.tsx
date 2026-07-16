import React from "react";

const services = [
  {
    title: "Mowing",
    text: "Consistent lawn maintenance that keeps your property clean and cared for.",
  },
  {
    title: "Edging and Trimming",
    text: "Clean lines around driveways, sidewalks, beds, fences, and landscaping.",
  },
  {
    title: "Mulch Installation",
    text: "Fresh mulch installation that improves curb appeal and finishes the property.",
  },
  {
    title: "Gutter Cleaning",
    text: "Leaves and debris removed so your gutters can drain properly.",
  },
  {
    title: "Window Cleaning",
    text: "Exterior window cleaning for a brighter, cleaner-looking home or business.",
  },
  {
    title: "Roof and Exterior Cleaning",
    text: "Roof cleaning and additional exterior services based on your property needs.",
  },
];

export default function VZProfessionalLawncareLanding() {
  const scrollToServices = () => {
    document.getElementById("vz-services")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <style>{`
        :root {
          --vz-black: #050705;
          --vz-panel: #0d120e;
          --vz-panel-light: #131a14;
          --vz-green: #087f23;
          --vz-deep-green: #044d16;
          --vz-lime: #a6df22;
          --vz-yellow: #ffd21a;
          --vz-white: #f5f7f3;
          --vz-muted: #aab3a8;
          --vz-line: rgba(166, 223, 34, 0.22);
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
            radial-gradient(circle at 88% 4%, rgba(8, 127, 35, 0.22), transparent 33rem),
            radial-gradient(circle at 4% 28%, rgba(255, 210, 26, 0.07), transparent 24rem),
            var(--vz-black);
          font-family: Inter, Arial, Helvetica, sans-serif;
        }

        .vz-shell {
          width: min(1120px, calc(100% - 36px));
          margin: 0 auto;
        }

        .vz-header {
          display: flex;
          min-height: 78px;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .vz-logo {
          display: flex;
          align-items: center;
          gap: 13px;
          color: white;
          text-decoration: none;
        }

        .vz-logo-mark {
          font-size: 2.1rem;
          font-weight: 950;
          line-height: 1;
          letter-spacing: -0.1em;
        }

        .vz-logo-mark span {
          margin: 0 0.08em;
          color: var(--vz-lime);
          font-size: 0.62em;
        }

        .vz-logo-copy {
          display: grid;
          line-height: 1.05;
          text-transform: uppercase;
        }

        .vz-logo-copy strong {
          font-size: 0.78rem;
          letter-spacing: 0.14em;
        }

        .vz-logo-copy small {
          margin-top: 5px;
          color: var(--vz-lime);
          font-size: 0.68rem;
          font-weight: 850;
          letter-spacing: 0.15em;
        }

        .vz-header-actions {
          display: flex;
          gap: 10px;
        }

        .vz-button {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          padding: 0 21px;
          border: 1px solid transparent;
          border-radius: 11px;
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
          box-shadow: 0 12px 28px rgba(255, 210, 26, 0.16);
        }

        .vz-button-secondary {
          color: white;
          border-color: rgba(166, 223, 34, 0.45);
          background: rgba(7, 16, 8, 0.72);
        }

        .vz-button-secondary:hover {
          border-color: var(--vz-lime);
          background: rgba(166, 223, 34, 0.07);
        }

        .vz-hero {
          padding: 72px 0 88px;
        }

        .vz-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(310px, 0.92fr);
          align-items: center;
          gap: clamp(48px, 7vw, 92px);
        }

        .vz-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 19px;
          color: var(--vz-lime);
          font-size: 0.76rem;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .vz-eyebrow::before {
          width: 31px;
          height: 3px;
          content: "";
          border-radius: 999px;
          background: var(--vz-yellow);
        }

        .vz-hero h1 {
          max-width: 720px;
          margin: 0;
          font-size: clamp(3.6rem, 8vw, 6.8rem);
          font-weight: 950;
          line-height: 0.94;
          letter-spacing: -0.065em;
        }

        .vz-hero h1 span {
          display: block;
          color: var(--vz-lime);
        }

        .vz-hero-copy {
          max-width: 650px;
          margin: 27px 0 0;
          color: #c3cbc0;
          font-size: clamp(1rem, 2vw, 1.14rem);
          line-height: 1.72;
        }

        .vz-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 33px;
        }

        .vz-proof {
          display: flex;
          flex-wrap: wrap;
          gap: 14px 25px;
          margin-top: 30px;
          color: #d6dcd3;
          font-size: 0.86rem;
          font-weight: 750;
        }

        .vz-proof span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .vz-proof span::before {
          display: grid;
          width: 20px;
          height: 20px;
          content: "✓";
          place-items: center;
          border-radius: 50%;
          color: var(--vz-lime);
          background: rgba(166, 223, 34, 0.1);
          font-size: 0.7rem;
        }

        .vz-brand-panel {
          position: relative;
          overflow: hidden;
          min-height: 420px;
          padding: clamp(29px, 5vw, 48px);
          border: 1px solid rgba(166, 223, 34, 0.3);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(8, 103, 29, 0.93), rgba(3, 48, 14, 0.97) 48%, rgba(5, 9, 6, 0.99));
          box-shadow:
            0 34px 78px rgba(0, 0, 0, 0.34),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .vz-brand-panel::before {
          position: absolute;
          top: -105px;
          right: -105px;
          width: 290px;
          height: 290px;
          content: "";
          border: 52px solid rgba(166, 223, 34, 0.09);
          border-radius: 50%;
        }

        .vz-brand-panel::after {
          position: absolute;
          right: -12%;
          bottom: 27px;
          left: -12%;
          height: 45px;
          content: "";
          border-top: 6px solid var(--vz-yellow);
          border-radius: 50%;
          transform: rotate(-4deg);
        }

        .vz-panel-content {
          position: relative;
          z-index: 1;
          display: flex;
          min-height: 322px;
          flex-direction: column;
        }

        .vz-panel-logo {
          font-size: clamp(4.4rem, 9vw, 7rem);
          font-weight: 950;
          line-height: 0.85;
          letter-spacing: -0.1em;
        }

        .vz-panel-logo span {
          margin: 0 0.06em;
          color: var(--vz-lime);
          font-size: 0.52em;
        }

        .vz-panel-name {
          margin-top: 20px;
          font-size: clamp(1.55rem, 3.6vw, 2.45rem);
          font-weight: 900;
          line-height: 1.03;
          letter-spacing: -0.025em;
          text-transform: uppercase;
        }

        .vz-panel-name strong {
          display: block;
          margin-top: 4px;
          color: var(--vz-yellow);
        }

        .vz-panel-services {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px 17px;
          margin-top: 29px;
          color: #ecf1e9;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .vz-panel-services span::before {
          margin-right: 7px;
          color: var(--vz-yellow);
          content: "✓";
        }

        .vz-panel-phone {
          margin-top: auto;
          padding-top: 33px;
          font-size: clamp(1.7rem, 4vw, 2.55rem);
          font-weight: 950;
          letter-spacing: -0.035em;
        }

        .vz-accent-line {
          height: 9px;
          background: linear-gradient(
            90deg,
            var(--vz-yellow),
            var(--vz-lime) 53%,
            var(--vz-green)
          );
        }

        .vz-section {
          padding: 82px 0;
        }

        .vz-section-muted {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          background: linear-gradient(
            180deg,
            rgba(10, 15, 11, 0.82),
            rgba(5, 8, 6, 0.96)
          );
        }

        .vz-section-head {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(260px, 420px);
          align-items: end;
          gap: 40px;
          margin-bottom: 35px;
        }

        .vz-kicker {
          margin-bottom: 10px;
          color: var(--vz-lime);
          font-size: 0.73rem;
          font-weight: 850;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .vz-section h2,
        .vz-callout h2 {
          margin: 0;
          font-size: clamp(2.35rem, 5vw, 4.15rem);
          font-weight: 930;
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .vz-section-head p {
          margin: 0;
          color: var(--vz-muted);
          line-height: 1.65;
        }

        .vz-services {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .vz-service-card {
          min-height: 205px;
          padding: 25px;
          border: 1px solid rgba(166, 223, 34, 0.15);
          border-radius: 20px;
          background: linear-gradient(
            145deg,
            rgba(17, 24, 18, 0.96),
            rgba(8, 12, 9, 0.98)
          );
          transition:
            transform 150ms ease,
            border-color 150ms ease;
        }

        .vz-service-card:hover {
          transform: translateY(-3px);
          border-color: rgba(166, 223, 34, 0.45);
        }

        .vz-service-number {
          color: var(--vz-yellow);
          font-size: 0.79rem;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .vz-service-card h3 {
          margin: 31px 0 10px;
          font-size: 1.16rem;
          letter-spacing: -0.015em;
        }

        .vz-service-card p {
          margin: 0;
          color: var(--vz-muted);
          font-size: 0.92rem;
          line-height: 1.62;
        }

        .vz-simple-trust {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          align-items: center;
          gap: 68px;
        }

        .vz-simple-trust h2 span {
          color: var(--vz-lime);
        }

        .vz-simple-trust-copy p {
          max-width: 500px;
          margin: 21px 0 0;
          color: var(--vz-muted);
          line-height: 1.72;
        }

        .vz-trust-points {
          display: grid;
          gap: 1px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.07);
        }

        .vz-trust-point {
          display: grid;
          grid-template-columns: 43px 1fr;
          gap: 17px;
          padding: 23px;
          background: var(--vz-panel);
        }

        .vz-trust-point strong {
          color: var(--vz-yellow);
          font-size: 0.84rem;
        }

        .vz-trust-point h3 {
          margin: 0 0 5px;
          font-size: 1rem;
        }

        .vz-trust-point p {
          margin: 0;
          color: var(--vz-muted);
          font-size: 0.88rem;
          line-height: 1.55;
        }

        .vz-callout-wrap {
          padding: 0 0 84px;
        }

        .vz-callout {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 35px;
          padding: clamp(31px, 5vw, 50px);
          border: 1px solid rgba(166, 223, 34, 0.36);
          border-radius: 26px;
          background:
            radial-gradient(circle at 85% 10%, rgba(166, 223, 34, 0.11), transparent 18rem),
            linear-gradient(135deg, rgba(6, 78, 23, 0.95), rgba(4, 18, 8, 0.99) 58%);
        }

        .vz-callout::after {
          position: absolute;
          right: -90px;
          bottom: -78px;
          width: 280px;
          height: 150px;
          content: "";
          border-top: 7px solid var(--vz-yellow);
          border-radius: 50%;
          transform: rotate(-10deg);
        }

        .vz-callout p {
          max-width: 630px;
          margin: 15px 0 0;
          color: #ccd4c9;
          line-height: 1.68;
        }

        .vz-callout-actions {
          position: relative;
          z-index: 1;
          display: grid;
          min-width: 210px;
          gap: 10px;
        }

        .vz-footer {
          padding: 28px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          color: #929d90;
          font-size: 0.84rem;
        }

        .vz-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
        }

        .vz-footer strong {
          color: var(--vz-white);
        }

        @media (max-width: 900px) {
          .vz-hero-grid,
          .vz-simple-trust {
            grid-template-columns: 1fr;
          }

          .vz-services {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .vz-section-head {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .vz-callout {
            grid-template-columns: 1fr;
          }

          .vz-callout-actions {
            width: 100%;
          }
        }

        @media (max-width: 620px) {
          .vz-shell {
            width: min(100% - 24px, 1120px);
          }

          .vz-header {
            min-height: 68px;
          }

          .vz-logo-copy {
            display: none;
          }

          .vz-header-actions .vz-button-secondary {
            display: none;
          }

          .vz-header-actions .vz-button {
            min-height: 43px;
            padding: 0 14px;
            font-size: 0.8rem;
          }

          .vz-hero {
            padding: 43px 0 58px;
          }

          .vz-hero h1 {
            font-size: clamp(3.3rem, 17vw, 4.9rem);
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

          .vz-proof {
            display: grid;
            gap: 11px;
          }

          .vz-brand-panel {
            min-height: 380px;
            padding: 27px 23px;
            border-radius: 23px;
          }

          .vz-panel-services {
            grid-template-columns: 1fr;
            gap: 7px;
          }

          .vz-panel-services span:nth-child(n + 5) {
            display: none;
          }

          .vz-section {
            padding: 64px 0;
          }

          .vz-services {
            grid-template-columns: 1fr;
          }

          .vz-service-card {
            min-height: 180px;
          }

          .vz-service-card h3 {
            margin-top: 24px;
          }

          .vz-callout-wrap {
            padding-bottom: 65px;
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

            <div className="vz-logo-copy">
              <strong>Professional</strong>
              <small>Lawncare LLC</small>
            </div>
          </a>

          <div className="vz-header-actions">
            <a className="vz-button vz-button-secondary" href="sms:8635328123">
              Text Eric
            </a>

            <button
              className="vz-button vz-button-primary"
              type="button"
              onClick={scrollToServices}
            >
              View Services
            </button>
          </div>
        </header>

        <section className="vz-hero">
          <div className="vz-shell vz-hero-grid">
            <div>
              <div className="vz-eyebrow">V&amp;Z Professional Lawncare LLC</div>

              <h1>
                Clean work.
                <span>Strong curb appeal.</span>
              </h1>

              <p className="vz-hero-copy">
                Professional mowing, edging, trimming, mulch installation,
                gutter cleaning, window cleaning, roof cleaning, and additional
                exterior property services.
              </p>

              <div className="vz-hero-actions">
                <a
                  className="vz-button vz-button-primary"
                  href="tel:8635328123"
                >
                  Call (863) 532-8123
                </a>

                <a
                  className="vz-button vz-button-secondary"
                  href="sms:8635328123"
                >
                  Text Eric
                </a>

                <button
                  className="vz-button vz-button-secondary"
                  type="button"
                  onClick={scrollToServices}
                >
                  See Services
                </button>
              </div>

              <div className="vz-proof">
                <span>Free estimates</span>
                <span>Local service</span>
                <span>Simple communication</span>
              </div>
            </div>

            <div className="vz-brand-panel">
              <div className="vz-panel-content">
                <div className="vz-panel-logo">
                  V<span>&amp;</span>Z
                </div>

                <div className="vz-panel-name">
                  Professional
                  <strong>Lawncare LLC</strong>
                </div>

                <div className="vz-panel-services">
                  <span>Mowing</span>
                  <span>Gutter Cleaning</span>
                  <span>Edging</span>
                  <span>Window Cleaning</span>
                  <span>Trimming</span>
                  <span>Roof Cleaning</span>
                  <span>Mulch Install</span>
                  <span>More Services</span>
                </div>

                <div className="vz-panel-phone">(863) 532-8123</div>
              </div>
            </div>
          </div>
        </section>

        <div className="vz-accent-line" />

        <section className="vz-section vz-section-muted" id="vz-services">
          <div className="vz-shell">
            <div className="vz-section-head">
              <div>
                <div className="vz-kicker">Services</div>
                <h2>Property care without the runaround.</h2>
              </div>

              <p>
                Start with the service you need. The quote request flow will
                handle property details, yard condition, access, photos, and
                preferred scheduling.
              </p>
            </div>

            <div className="vz-services">
              {services.map((service, index) => (
                <article className="vz-service-card" key={service.title}>
                  <div className="vz-service-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="vz-section">
          <div className="vz-shell vz-simple-trust">
            <div className="vz-simple-trust-copy">
              <div className="vz-kicker">How V&amp;Z works</div>

              <h2>
                Straightforward from
                <span> quote to completion.</span>
              </h2>

              <p>
                The complete V&amp;Z live system will connect the estimate,
                customer approval, scheduling, work photos, payment, proof, and
                follow-up without turning the experience into a complicated CRM.
              </p>
            </div>

            <div className="vz-trust-points">
              <article className="vz-trust-point">
                <strong>01</strong>
                <div>
                  <h3>Request the work</h3>
                  <p>Choose services and share property details and photos.</p>
                </div>
              </article>

              <article className="vz-trust-point">
                <strong>02</strong>
                <div>
                  <h3>Review the estimate</h3>
                  <p>See the work and price clearly before approving the job.</p>
                </div>
              </article>

              <article className="vz-trust-point">
                <strong>03</strong>
                <div>
                  <h3>Schedule and complete</h3>
                  <p>Stay connected through scheduling, work, and completion.</p>
                </div>
              </article>

              <article className="vz-trust-point">
                <strong>04</strong>
                <div>
                  <h3>Payment and proof</h3>
                  <p>Keep work photos, payment, and follow-up connected.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="vz-callout-wrap">
          <div className="vz-shell">
            <div className="vz-callout">
              <div>
                <div className="vz-kicker">Ready for a quote?</div>

                <h2>Tell Eric what the property needs.</h2>

                <p>
                  Call or text V&amp;Z now. The complete request flow with
                  property details, photos, yard condition, and scheduling comes
                  next.
                </p>
              </div>

              <div className="vz-callout-actions">
                <a
                  className="vz-button vz-button-primary"
                  href="tel:8635328123"
                >
                  Call for a Quote
                </a>

                <a
                  className="vz-button vz-button-secondary"
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
              Professional lawn care and exterior services.
            </div>

            <div>(863) 532-8123</div>
          </div>
        </footer>
      </main>
    </>
  );
}