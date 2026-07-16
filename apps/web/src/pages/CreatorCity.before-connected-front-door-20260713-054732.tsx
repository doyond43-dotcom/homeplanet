import React from "react";

const systems = [
  {
    name: "Only The Essentials",
    type: "Cleaning",
    customer: "Request Cleaning",
    business: "Estimate Waiting",
    href: "/onlytheessentials",
    accent: "green",
  },
  {
    name: "Florida Cooling",
    type: "HVAC Service",
    customer: "AC Not Cooling",
    business: "Technician En Route",
    href: "/planet/florida-cooling",
    accent: "blue",
  },
  {
    name: "Slap-A-Bug",
    type: "Pest Control",
    customer: "Upload Pest Photos",
    business: "Estimate Ready",
    href: "/planet/slap-a-bug",
    accent: "electric",
  },
];

export default function CreatorCity() {
  const go = (href: string) => {
    if (href.startsWith("#")) {
      document
        .querySelector(href)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    window.location.href = href;
  };

  return (
    <main className="cc-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #020504;
        }

        button {
          font: inherit;
        }

        .cc-page {
          min-height: 100vh;
          overflow: hidden;
          color: #f5fff8;
          background:
            radial-gradient(
              circle at 50% 8%,
              rgba(54, 255, 122, 0.11),
              transparent 29rem
            ),
            radial-gradient(
              circle at 8% 52%,
              rgba(31, 117, 255, 0.055),
              transparent 32rem
            ),
            radial-gradient(
              circle at 92% 74%,
              rgba(44, 255, 125, 0.05),
              transparent 30rem
            ),
            #020504;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .cc-shell {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .cc-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 82px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .cc-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .cc-brand-mark {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #4cff87;
          box-shadow:
            0 0 0 6px rgba(76, 255, 135, 0.08),
            0 0 24px rgba(76, 255, 135, 0.72);
        }

        .cc-brand small {
          color: rgba(232, 255, 240, 0.52);
          font-size: 12px;
          font-weight: 700;
          margin-left: 6px;
        }

        .cc-top-button,
        .cc-primary,
        .cc-secondary,
        .cc-system-link {
          border: 0;
          cursor: pointer;
          text-decoration: none;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .cc-top-button {
          min-height: 42px;
          padding: 0 17px;
          border-radius: 12px;
          color: #041108;
          background: #4cff87;
          font-size: 13px;
          font-weight: 900;
        }

        .cc-top-button:hover,
        .cc-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px rgba(49, 255, 117, 0.2);
        }

        .cc-hero {
          padding: 92px 0 70px;
          text-align: center;
        }

        .cc-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 24px;
          color: #6cff9a;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .cc-kicker::before {
          content: "";
          width: 26px;
          height: 1px;
          background: #59ff90;
          box-shadow: 0 0 12px rgba(89, 255, 144, 0.8);
        }

        .cc-hero h1 {
          max-width: 900px;
          margin: 0 auto;
          font-size: clamp(52px, 7.8vw, 102px);
          line-height: 0.94;
          letter-spacing: -0.065em;
          font-weight: 950;
        }

        .cc-hero h1 span {
          color: #59ff90;
          text-shadow: 0 0 34px rgba(54, 255, 119, 0.16);
        }

        .cc-hero-copy {
          max-width: 690px;
          margin: 30px auto 0;
          color: rgba(235, 248, 239, 0.68);
          font-size: clamp(18px, 2.2vw, 23px);
          line-height: 1.55;
        }

        .cc-hero-copy strong {
          color: #ffffff;
        }

        .cc-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 34px;
        }

        .cc-primary,
        .cc-secondary {
          min-height: 52px;
          padding: 0 23px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 900;
        }

        .cc-primary {
          color: #031008;
          background: #4cff87;
        }

        .cc-secondary {
          color: #effff4;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.035);
        }

        .cc-secondary:hover {
          transform: translateY(-2px);
          border-color: rgba(92, 255, 148, 0.4);
          background: rgba(92, 255, 148, 0.07);
        }

        .cc-picture-section {
          position: relative;
          padding: 18px 0 110px;
        }

        .cc-section-intro {
          max-width: 690px;
          margin: 0 auto 38px;
          text-align: center;
        }

        .cc-section-intro h2 {
          margin: 0;
          font-size: clamp(34px, 5vw, 62px);
          line-height: 1;
          letter-spacing: -0.05em;
        }

        .cc-section-intro p {
          margin: 17px auto 0;
          color: rgba(231, 245, 235, 0.62);
          font-size: 17px;
          line-height: 1.6;
        }

        .cc-picture {
          display: grid;
          grid-template-columns: 1fr 70px 1fr 70px 1.15fr;
          align-items: stretch;
          gap: 0;
          padding: 28px;
          border: 1px solid rgba(112, 255, 159, 0.18);
          border-radius: 30px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.012)
            ),
            rgba(5, 10, 8, 0.88);
          box-shadow:
            0 24px 90px rgba(0, 0, 0, 0.38),
            inset 0 1px rgba(255, 255, 255, 0.045);
        }

        .cc-stage {
          min-width: 0;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.085);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.025);
        }

        .cc-stage-number {
          color: #5cff93;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .cc-stage h3 {
          margin: 12px 0 6px;
          font-size: 20px;
          letter-spacing: -0.025em;
        }

        .cc-stage > p {
          min-height: 48px;
          margin: 0 0 22px;
          color: rgba(229, 243, 234, 0.57);
          font-size: 14px;
          line-height: 1.55;
        }

        .cc-customer-page {
          padding: 19px;
          border-radius: 17px;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(75, 255, 137, 0.1),
              transparent 70%
            ),
            #07100b;
          border: 1px solid rgba(84, 255, 143, 0.17);
        }

        .cc-mini-brand {
          color: #7bff9f;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .cc-customer-page strong {
          display: block;
          margin-top: 11px;
          font-size: 17px;
          line-height: 1.25;
        }

        .cc-customer-page p {
          margin: 7px 0 16px;
          color: rgba(229, 243, 234, 0.55);
          font-size: 12px;
          line-height: 1.45;
        }

        .cc-mini-button {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          border-radius: 11px;
          color: #041108;
          background: #4cff87;
          font-size: 12px;
          font-weight: 950;
        }

        .cc-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(92, 255, 148, 0.72);
          font-size: 30px;
          text-shadow: 0 0 18px rgba(92, 255, 148, 0.42);
        }

        .cc-job-card {
          padding: 18px;
          border: 1px solid rgba(83, 190, 255, 0.2);
          border-radius: 17px;
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(55, 178, 255, 0.11),
              transparent 58%
            ),
            #071011;
        }

        .cc-job-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .cc-job-name {
          font-size: 16px;
          font-weight: 900;
        }

        .cc-job-card p {
          margin: 5px 0 0;
          color: rgba(224, 240, 239, 0.55);
          font-size: 12px;
        }

        .cc-new {
          height: fit-content;
          padding: 5px 8px;
          border-radius: 999px;
          color: #9be3ff;
          background: rgba(67, 179, 255, 0.11);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .cc-job-details {
          display: grid;
          gap: 8px;
          margin: 18px 0;
        }

        .cc-job-line {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: rgba(225, 239, 235, 0.5);
          font-size: 11px;
        }

        .cc-job-line strong {
          color: #f3fff7;
          font-weight: 800;
        }

        .cc-open {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          border-radius: 11px;
          color: #e9fff1;
          border: 1px solid rgba(86, 255, 144, 0.25);
          background: rgba(86, 255, 144, 0.08);
          font-size: 12px;
          font-weight: 950;
        }

        .cc-workspace {
          overflow: hidden;
          border: 1px solid rgba(86, 255, 144, 0.24);
          border-radius: 17px;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(61, 255, 127, 0.11),
              transparent 52%
            ),
            #07100b;
        }

        .cc-workspace-head {
          padding: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .cc-workspace-head small {
          display: block;
          color: #72ff9c;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .cc-workspace-head strong {
          display: block;
          margin-top: 7px;
          font-size: 17px;
        }

        .cc-next {
          margin-top: 15px;
          padding: 13px;
          border: 1px solid rgba(84, 255, 142, 0.22);
          border-radius: 12px;
          background: rgba(84, 255, 142, 0.075);
          box-shadow: 0 0 25px rgba(48, 255, 115, 0.055);
        }

        .cc-next span {
          display: block;
          color: rgba(227, 245, 233, 0.48);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .cc-next b {
          display: block;
          margin-top: 4px;
          color: #72ff9c;
          font-size: 15px;
        }

        .cc-tools {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding: 15px;
        }

        .cc-tool {
          padding: 10px 6px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 10px;
          color: rgba(239, 250, 242, 0.7);
          background: rgba(255, 255, 255, 0.022);
          font-size: 10px;
          font-weight: 800;
          text-align: center;
        }

        .cc-picture-caption {
          max-width: 780px;
          margin: 28px auto 0;
          text-align: center;
          color: rgba(235, 247, 238, 0.66);
          font-size: clamp(18px, 2vw, 22px);
          line-height: 1.55;
        }

        .cc-picture-caption strong {
          color: #ffffff;
        }

        .cc-systems {
          padding: 105px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.065);
        }

        .cc-systems-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 34px;
        }

        .cc-systems-head h2 {
          max-width: 640px;
          margin: 0;
          font-size: clamp(38px, 5vw, 66px);
          line-height: 0.98;
          letter-spacing: -0.05em;
        }

        .cc-systems-head p {
          max-width: 360px;
          margin: 0;
          color: rgba(230, 244, 235, 0.56);
          font-size: 15px;
          line-height: 1.6;
        }

        .cc-system-list {
          display: grid;
          gap: 14px;
        }

        .cc-system {
          position: relative;
          display: grid;
          grid-template-columns: 1.15fr 1fr 1fr auto;
          align-items: center;
          gap: 26px;
          overflow: hidden;
          min-height: 118px;
          padding: 25px 27px;
          border: 1px solid rgba(255, 255, 255, 0.085);
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.025);
        }

        .cc-system::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 3px;
          background: #55ff8e;
          box-shadow: 0 0 20px rgba(85, 255, 142, 0.6);
        }

        .cc-system.blue::before {
          background: #54c7ff;
          box-shadow: 0 0 20px rgba(84, 199, 255, 0.62);
        }

        .cc-system.electric::before {
          background: #5f8dff;
          box-shadow: 0 0 20px rgba(95, 141, 255, 0.62);
        }

        .cc-system-name strong {
          display: block;
          font-size: 20px;
          letter-spacing: -0.025em;
        }

        .cc-system-name span,
        .cc-system-side span {
          display: block;
          margin-top: 5px;
          color: rgba(230, 243, 234, 0.48);
          font-size: 12px;
        }

        .cc-system-side small {
          display: block;
          color: rgba(109, 255, 159, 0.72);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .cc-system-side strong {
          display: block;
          margin-top: 6px;
          font-size: 14px;
        }

        .cc-system-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 43px;
          padding: 0 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #effff4;
          background: rgba(255, 255, 255, 0.03);
          font-size: 12px;
          font-weight: 900;
        }

        .cc-system-link:hover {
          transform: translateY(-2px);
          border-color: rgba(88, 255, 146, 0.38);
          background: rgba(88, 255, 146, 0.07);
        }

        .cc-final {
          padding: 120px 0;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.065);
          background:
            radial-gradient(
              circle at 50% 100%,
              rgba(53, 255, 120, 0.12),
              transparent 34rem
            );
        }

        .cc-final h2 {
          max-width: 900px;
          margin: 0 auto;
          font-size: clamp(44px, 6.5vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .cc-final h2 span {
          color: #5cff92;
        }

        .cc-final p {
          max-width: 620px;
          margin: 23px auto 0;
          color: rgba(229, 244, 234, 0.6);
          font-size: 18px;
          line-height: 1.6;
        }

        .cc-footer {
          padding: 28px 0 38px;
          color: rgba(225, 239, 229, 0.36);
          font-size: 12px;
          text-align: center;
        }

        @media (max-width: 980px) {
          .cc-picture {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .cc-arrow {
            min-height: 38px;
            transform: rotate(90deg);
          }

          .cc-stage > p {
            min-height: 0;
          }

          .cc-system {
            grid-template-columns: 1fr 1fr;
          }

          .cc-system-link {
            width: fit-content;
          }
        }

        @media (max-width: 700px) {
          .cc-shell {
            width: min(100% - 24px, 1180px);
          }

          .cc-topbar {
            min-height: 68px;
          }

          .cc-brand small {
            display: none;
          }

          .cc-top-button {
            min-height: 38px;
            padding: 0 13px;
            font-size: 11px;
          }

          .cc-hero {
            padding: 70px 0 54px;
          }

          .cc-hero h1 {
            font-size: clamp(48px, 15vw, 74px);
          }

          .cc-hero-copy {
            font-size: 17px;
          }

          .cc-actions {
            flex-direction: column;
          }

          .cc-primary,
          .cc-secondary {
            width: 100%;
          }

          .cc-picture-section {
            padding-bottom: 82px;
          }

          .cc-picture {
            padding: 14px;
            border-radius: 23px;
          }

          .cc-stage {
            padding: 19px;
          }

          .cc-systems {
            padding: 82px 0;
          }

          .cc-systems-head {
            display: block;
          }

          .cc-systems-head p {
            margin-top: 17px;
          }

          .cc-system {
            grid-template-columns: 1fr;
            gap: 18px;
            padding: 22px;
          }

          .cc-final {
            padding: 88px 0;
          }

          .cc-final h2 {
            font-size: clamp(43px, 13vw, 65px);
          }
        }
      `}</style>

      <div className="cc-shell">
        <header className="cc-topbar">
          <div className="cc-brand">
            <span className="cc-brand-mark" />
            Creator City
            <small>by HomePlanet</small>
          </div>

          <button className="cc-top-button" onClick={() => go("#build")}>
            Build My System
          </button>
        </header>

        <section className="cc-hero">
          <div className="cc-kicker">A different kind of business page</div>

          <h1>
            Your website should <span>start the work.</span>
          </h1>

          <p className="cc-hero-copy">
            A public page for the customer.
            <br />
            <strong>A working space for the business.</strong>
          </p>

          <div className="cc-actions">
            <button className="cc-primary" onClick={() => go("#build")}>
              Build My System
            </button>

            <button className="cc-secondary" onClick={() => go("#picture")}>
              See The Difference
            </button>
          </div>
        </section>

        <section className="cc-picture-section" id="picture">
          <div className="cc-section-intro">
            <h2>One request. One connected job.</h2>
            <p>
              The customer asks for help. The business sees the job. Everything
              needed to finish it stays together.
            </p>
          </div>

          <div className="cc-picture">
            <article className="cc-stage">
              <div className="cc-stage-number">01 · Customer Page</div>
              <h3>The customer reaches out.</h3>
              <p>
                They choose what they need and send the information that matters.
              </p>

              <div className="cc-customer-page">
                <div className="cc-mini-brand">
                  Only The Essentials Cleaning
                </div>

                <strong>Need help getting your home back in order?</strong>

                <p>
                  Tell Kaitlin what you need and choose the best time to reach
                  you.
                </p>

                <div className="cc-mini-button">Request Cleaning</div>
              </div>
            </article>

            <div className="cc-arrow" aria-hidden="true">
              →
            </div>

            <article className="cc-stage">
              <div className="cc-stage-number">02 · New Job Card</div>
              <h3>The business sees the job.</h3>
              <p>
                It does not disappear into an email inbox. It becomes visible work.
              </p>

              <div className="cc-job-card">
                <div className="cc-job-top">
                  <div>
                    <div className="cc-job-name">Sarah Mitchell</div>
                    <p>House Cleaning</p>
                  </div>

                  <div className="cc-new">New</div>
                </div>

                <div className="cc-job-details">
                  <div className="cc-job-line">
                    Service <strong>Standard Cleaning</strong>
                  </div>

                  <div className="cc-job-line">
                    Preferred time <strong>Friday Morning</strong>
                  </div>

                  <div className="cc-job-line">
                    Photos <strong>3 attached</strong>
                  </div>
                </div>

                <div className="cc-open">Open Workspace</div>
              </div>
            </article>

            <div className="cc-arrow" aria-hidden="true">
              →
            </div>

            <article className="cc-stage">
              <div className="cc-stage-number">03 · Active Workspace</div>
              <h3>This is where the work happens.</h3>
              <p>
                The next action and every tool for the job stay with the customer.
              </p>

              <div className="cc-workspace">
                <div className="cc-workspace-head">
                  <small>Sarah Mitchell</small>
                  <strong>House Cleaning Workspace</strong>

                  <div className="cc-next">
                    <span>Next Action</span>
                    <b>Send Estimate</b>
                  </div>
                </div>

                <div className="cc-tools">
                  <div className="cc-tool">Estimate</div>
                  <div className="cc-tool">Agreement</div>
                  <div className="cc-tool">Schedule</div>
                  <div className="cc-tool">Photos</div>
                  <div className="cc-tool">Payment</div>
                  <div className="cc-tool">Proof</div>
                </div>
              </div>
            </article>
          </div>

          <p className="cc-picture-caption">
            Most websites send an email and stop.
            <br />
            <strong>HomePlanet opens the actual work.</strong>
          </p>
        </section>
      </div>

      <section className="cc-systems">
        <div className="cc-shell">
          <div className="cc-systems-head">
            <h2>Real businesses. Different work. Same idea.</h2>

            <p>
              Each business has a public entrance for customers and a working
              system underneath.
            </p>
          </div>

          <div className="cc-system-list">
            {systems.map((system) => (
              <article
                className={`cc-system ${system.accent}`}
                key={system.name}
              >
                <div className="cc-system-name">
                  <strong>{system.name}</strong>
                  <span>{system.type}</span>
                </div>

                <div className="cc-system-side">
                  <small>Customer Side</small>
                  <strong>{system.customer}</strong>
                  <span>The public page starts the request.</span>
                </div>

                <div className="cc-system-side">
                  <small>Business Side</small>
                  <strong>{system.business}</strong>
                  <span>The next action is already visible.</span>
                </div>

                <button
                  className="cc-system-link"
                  onClick={() => go(system.href)}
                >
                  Open Live Page
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cc-final" id="build">
        <div className="cc-shell">
          <h2>
            Build the page customers see.
            <br />
            <span>Run the work from underneath.</span>
          </h2>

          <p>
            Start with the front door. Grow the system around the real way your
            business already works.
          </p>

          <div className="cc-actions">
            <button
              className="cc-primary"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/homeplanet.city/",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              Build My System
            </button>
          </div>
        </div>
      </section>

      <footer className="cc-footer">
        Creator City · Powered by HomePlanet
      </footer>
    </main>
  );
}
