import React, { useState } from "react";

type DemoStep = "customer" | "request" | "workspace";

const liveSystems = [
  {
    name: "Only The Essentials",
    side: "Customer asks for a cleaning",
    next: "Estimate waiting",
    href: "/onlytheessentials",
  },
  {
    name: "Florida Cooling",
    side: "Customer reports AC not cooling",
    next: "Technician en route",
    href: "/planet/florida-cooling",
  },
  {
    name: "Slap-A-Bug",
    side: "Customer uploads pest photos",
    next: "Next action: estimate",
    href: "/planet/slap-a-bug",
  },
];

export default function CreatorCity() {
  const [step, setStep] = useState<DemoStep>("customer");

  const go = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.href = href;
  };

  const [demoRunning, setDemoRunning] = useState(false);

  const runDemo = () => {
    if (demoRunning) return;

    setDemoRunning(true);
    setStep("customer");

    window.setTimeout(() => {
      setStep("request");
    }, 900);

    window.setTimeout(() => {
      setStep("workspace");
    }, 1900);

    window.setTimeout(() => {
      setDemoRunning(false);
    }, 2500);
  };

  const nextDemo = () => {
    setStep((current) =>
      current === "customer" ? "request" : current === "request" ? "workspace" : "customer",
    );
  };

  return (
    <main className="cc-page">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #020403; }
        button, a { font: inherit; }

        .cc-page {
          min-height: 100vh;
          color: #f5fff8;
          background:
            radial-gradient(circle at 50% -10%, rgba(72,255,136,.14), transparent 30rem),
            linear-gradient(180deg, #020403 0%, #050806 55%, #020403 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .cc-shell {
          width: min(1120px, calc(100% - 28px));
          margin: 0 auto;
        }

        .cc-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 72px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .cc-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
          font-size: 12px;
        }

        .cc-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #65ff98;
          box-shadow: 0 0 22px rgba(101,255,152,.9);
        }

        .cc-primary, .cc-secondary {
          min-height: 48px;
          border-radius: 14px;
          padding: 0 18px;
          border: 0;
          cursor: pointer;
          font-weight: 950;
        }

        .cc-primary {
          background: #65ff98;
          color: #001809;
          box-shadow: 0 12px 34px rgba(75,255,137,.18);
        }

        .cc-secondary {
          background: rgba(255,255,255,.045);
          color: #f5fff8;
          border: 1px solid rgba(255,255,255,.14);
        }

        .cc-hero {
          min-height: calc(100vh - 72px);
          display: grid;
          align-content: center;
          padding: 76px 0 88px;
          text-align: center;
        }

        .cc-kicker {
          color: #8dffb4;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .15em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .cc-hero h1 {
          margin: 0 auto;
          max-width: 920px;
          font-size: clamp(52px, 8vw, 96px);
          line-height: .94;
          letter-spacing: -.065em;
          font-weight: 980;
        }

        .cc-hero h1 span {
          color: #65ff98;
          text-shadow: 0 0 34px rgba(101,255,152,.18);
        }

        .cc-sub {
          margin: 24px auto 0;
          max-width: 640px;
          color: rgba(245,255,248,.68);
          font-size: clamp(18px, 2vw, 23px);
          line-height: 1.45;
          font-weight: 650;
        }

        .cc-sub strong { color: #f5fff8; }

        .cc-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .cc-demo-wrap {
          margin-top: 54px;
        }

        .cc-demo-label {
          color: rgba(245,255,248,.44);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .cc-demo {
          width: min(760px, 100%);
          margin: 0 auto;
          border-radius: 24px;
          border: 1px solid rgba(101,255,152,.25);
          background:
            radial-gradient(circle at 50% 0%, rgba(101,255,152,.10), transparent 20rem),
            rgba(255,255,255,.025);
          box-shadow: 0 30px 80px rgba(0,0,0,.4);
          overflow: hidden;
          text-align: left;
        }

        .cc-demo-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 15px 18px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .cc-demo-title {
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .cc-demo-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #8dffb4;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .1em;
        }

        .cc-demo-status::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #65ff98;
          box-shadow: 0 0 12px rgba(101,255,152,.85);
        }

        .cc-demo-body {
          padding: 24px;
        }

        .cc-public-card,
        .cc-request-card,
        .cc-workspace {
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.035);
        }

        .cc-public-card {
          padding: 24px;
          text-align: center;
        }

        .cc-public-card h3,
        .cc-request-card h3,
        .cc-workspace h3 {
          margin: 0;
          font-size: 24px;
          letter-spacing: -.03em;
        }

        .cc-public-card p,
        .cc-request-card p {
          margin: 10px 0 0;
          color: rgba(245,255,248,.58);
          line-height: 1.5;
        }

        .cc-public-card button {
          margin-top: 22px;
          width: 100%;
        }

        .cc-request-card {
          padding: 18px;
        }

        .cc-request-meta {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 12px;
          align-items: center;
        }

        .cc-request-name {
          font-weight: 950;
          font-size: 18px;
        }

        .cc-badge {
          border-radius: 999px;
          padding: 7px 10px;
          background: rgba(101,255,152,.12);
          color: #8dffb4;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .cc-request-details {
          display: grid;
          gap: 8px;
          margin-top: 16px;
        }

        .cc-line {
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 0 13px;
          border-radius: 12px;
          background: rgba(255,255,255,.035);
          color: rgba(245,255,248,.62);
          font-size: 13px;
          font-weight: 800;
        }

        .cc-line strong { color: #f5fff8; }

        .cc-request-card button {
          margin-top: 16px;
          width: 100%;
        }

        .cc-workspace {
          overflow: hidden;
        }

        .cc-workspace-head {
          padding: 18px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .cc-next {
          margin-top: 16px;
          padding: 16px;
          border-radius: 14px;
          background: rgba(101,255,152,.10);
          border: 1px solid rgba(101,255,152,.22);
        }

        .cc-next small {
          color: #8dffb4;
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .cc-next strong {
          display: block;
          margin-top: 6px;
          font-size: 20px;
        }

        .cc-tools {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 9px;
          padding: 18px;
        }

        .cc-tool {
          min-height: 66px;
          display: grid;
          place-items: center;
          padding: 10px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(255,255,255,.03);
          font-size: 12px;
          font-weight: 900;
          color: rgba(245,255,248,.7);
          text-align: center;
        }

        .cc-demo-note {
          margin-top: 14px;
          color: rgba(245,255,248,.42);
          font-size: 12px;
          text-align: center;
        }

        .cc-section {
          padding: 96px 0;
          border-top: 1px solid rgba(255,255,255,.07);
        }

        .cc-section-head {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 40px;
        }

        .cc-section h2 {
          margin: 0;
          font-size: clamp(38px, 5vw, 66px);
          line-height: .98;
          letter-spacing: -.05em;
        }

        .cc-section-copy {
          max-width: 650px;
          margin: 18px auto 0;
          color: rgba(245,255,248,.58);
          font-size: 18px;
          line-height: 1.5;
        }

        .cc-system-list {
          display: grid;
          gap: 14px;
          max-width: 900px;
          margin: 0 auto;
        }

        .cc-system {
          display: grid;
          grid-template-columns: minmax(220px,.8fr) minmax(280px,1.2fr) auto;
          gap: 22px;
          align-items: center;
          padding: 22px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(255,255,255,.025);
        }

        .cc-system-name {
          font-size: 20px;
          font-weight: 950;
          letter-spacing: -.02em;
        }

        .cc-system-side {
          color: rgba(245,255,248,.56);
          font-size: 14px;
          line-height: 1.45;
        }

        .cc-system-next {
          display: block;
          margin-top: 5px;
          color: #f5fff8;
          font-weight: 900;
        }

        .cc-rule {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 18px;
          align-items: center;
          max-width: 860px;
          margin: 0 auto;
        }

        .cc-rule-card {
          padding: 28px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.028);
          min-height: 220px;
        }

        .cc-rule-card.active {
          border-color: rgba(101,255,152,.28);
          background: rgba(101,255,152,.045);
        }

        .cc-rule-card small {
          color: rgba(245,255,248,.42);
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .cc-rule-card.active small { color: #8dffb4; }

        .cc-rule-card h3 {
          margin: 14px 0 0;
          font-size: 28px;
          letter-spacing: -.035em;
        }

        .cc-rule-card p {
          margin: 14px 0 0;
          color: rgba(245,255,248,.56);
          line-height: 1.5;
        }

        .cc-arrow {
          color: #65ff98;
          font-size: 30px;
          font-weight: 950;
        }

        .cc-final {
          text-align: center;
          padding-bottom: 120px;
        }

        .cc-final .cc-actions {
          margin-top: 28px;
        }

        .cc-footer {
          padding: 28px 0 34px;
          border-top: 1px solid rgba(255,255,255,.07);
          text-align: center;
          color: rgba(245,255,248,.34);
          font-size: 12px;
        }

        @media (max-width: 780px) {
          .cc-system {
            grid-template-columns: 1fr;
          }

          .cc-system button {
            width: 100%;
          }

          .cc-rule {
            grid-template-columns: 1fr;
          }

          .cc-arrow {
            transform: rotate(90deg);
            text-align: center;
          }
        }

        @media (max-width: 560px) {
          .cc-shell { width: min(100% - 20px, 1120px); }

          .cc-nav {
            min-height: 66px;
          }

          .cc-brand {
            font-size: 10px;
          }

          .cc-nav .cc-primary {
            min-height: 40px;
            padding: 0 12px;
            font-size: 12px;
          }

          .cc-hero {
            min-height: auto;
            padding: 58px 0 76px;
          }

          .cc-hero h1 {
            font-size: clamp(48px, 15vw, 68px);
          }

          .cc-sub {
            font-size: 18px;
          }

          .cc-actions {
            display: grid;
          }

          .cc-actions button {
            width: 100%;
          }

          .cc-demo-body {
            padding: 14px;
          }

          .cc-tools {
            grid-template-columns: repeat(2, minmax(0,1fr));
            padding: 14px;
          }

          .cc-section {
            padding: 78px 0;
          }
        }
      /* Creator City demo motion + atmosphere */
      .cc-page {
        background:
          radial-gradient(
            circle at 50% 11%,
            rgba(67, 255, 132, 0.09),
            transparent 25rem
          ),
          radial-gradient(
            circle at 14% 48%,
            rgba(25, 118, 67, 0.07),
            transparent 34rem
          ),
          radial-gradient(
            circle at 86% 72%,
            rgba(43, 146, 255, 0.045),
            transparent 30rem
          ),
          #030706 !important;
      }

      .cc-demo-launch {
        min-width: 236px;
        position: relative;
        overflow: hidden;
        transition:
          transform 180ms ease,
          box-shadow 180ms ease,
          opacity 180ms ease;
      }

      .cc-demo-launch::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          105deg,
          transparent 25%,
          rgba(255, 255, 255, 0.34) 50%,
          transparent 75%
        );
        transform: translateX(-150%);
        transition: transform 600ms ease;
      }

      .cc-demo-launch:hover::after {
        transform: translateX(150%);
      }

      .cc-demo-launch:hover {
        transform: translateY(-2px);
        box-shadow:
          0 0 0 1px rgba(101, 255, 159, 0.28),
          0 14px 35px rgba(40, 255, 111, 0.2);
      }

      .cc-demo-launch:disabled {
        cursor: wait;
        opacity: 0.88;
      }

      .cc-demo-wrap {
        position: relative;
        transition:
          transform 320ms ease,
          filter 320ms ease;
      }

      .cc-demo-wrap::before {
        content: "";
        position: absolute;
        inset: -45px -75px;
        z-index: -1;
        pointer-events: none;
        border-radius: 999px;
        background: radial-gradient(
          circle,
          rgba(45, 255, 115, 0.12),
          transparent 68%
        );
        opacity: 0.52;
        transition:
          opacity 350ms ease,
          transform 350ms ease;
      }

      .cc-step-request::before {
        opacity: 0.76;
        transform: scale(1.035);
      }

      .cc-step-workspace::before {
        opacity: 1;
        transform: scale(1.08);
      }

      .cc-demo {
        transition:
          border-color 320ms ease,
          box-shadow 320ms ease,
          background 320ms ease;
      }

      .cc-step-customer .cc-demo {
        border-color: rgba(91, 255, 151, 0.2);
        background:
          radial-gradient(
            circle at 50% 12%,
            rgba(44, 255, 119, 0.06),
            transparent 58%
          ),
          rgba(8, 14, 11, 0.92);
      }

      .cc-step-request .cc-demo {
        border-color: rgba(93, 205, 255, 0.32);
        box-shadow:
          0 0 0 1px rgba(93, 205, 255, 0.08),
          0 22px 70px rgba(14, 101, 143, 0.13);
        background:
          radial-gradient(
            circle at 50% 12%,
            rgba(42, 178, 255, 0.08),
            transparent 60%
          ),
          rgba(7, 14, 14, 0.94);
      }

      .cc-step-workspace .cc-demo {
        border-color: rgba(93, 255, 153, 0.38);
        box-shadow:
          0 0 0 1px rgba(93, 255, 153, 0.08),
          0 25px 85px rgba(32, 214, 93, 0.15);
        background:
          radial-gradient(
            circle at 50% 18%,
            rgba(46, 255, 119, 0.105),
            transparent 62%
          ),
          rgba(7, 14, 10, 0.95);
      }

      .cc-public-card,
      .cc-request-card,
      .cc-workspace {
        animation: ccStateReveal 420ms cubic-bezier(.2, .8, .2, 1);
      }

      .cc-step-workspace .cc-next {
        animation: ccNextActionGlow 1.6s ease-in-out 1;
      }

      @keyframes ccStateReveal {
        from {
          opacity: 0;
          transform: translateY(14px) scale(0.985);
          filter: blur(3px);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
      }

      @keyframes ccNextActionGlow {
        0% {
          box-shadow: 0 0 0 rgba(62, 255, 127, 0);
        }

        45% {
          box-shadow:
            0 0 0 1px rgba(92, 255, 149, 0.35),
            0 0 32px rgba(53, 255, 121, 0.21);
        }

        100% {
          box-shadow: 0 0 0 rgba(62, 255, 127, 0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .cc-public-card,
        .cc-request-card,
        .cc-workspace,
        .cc-step-workspace .cc-next {
          animation: none;
        }

        .cc-demo-launch::after {
          display: none;
        }
      }
      `}</style>

      <div className="cc-shell">
        <nav className="cc-nav">
          <div className="cc-brand">
            <span className="cc-dot" />
            <span>Creator City</span>
            <span style={{ color: "rgba(245,255,248,.34)" }}>by HomePlanet</span>
          </div>

          <button className="cc-primary" onClick={() => go("#build")}>
            Build My System
          </button>
        </nav>

        <section className="cc-hero">
          <div className="cc-kicker">A public page for the customer. A working space for the business.</div>

          <h1>
            Your website should <span>start the work.</span>
          </h1>

          <p className="cc-sub">
            Most websites collect a form and send an email.
            <br />
            <strong>HomePlanet turns the request into the actual job.</strong>
          </p>

          <div className="cc-actions">
            <button
              className="cc-primary cc-demo-launch"
              onClick={runDemo}
              disabled={demoRunning}
            >
              {demoRunning
                ? "Turning The Request Into Work..."
                : "Watch The Request Become Work"}
            </button>
            <button className="cc-secondary" onClick={() => go("#build")}>
              Build My System
            </button>
          </div>

          <div className={`cc-demo-wrap cc-step-${step}`} id="demo">
            <div className="cc-demo-label">Tap through the difference</div>

            <div className="cc-demo">
              <div className="cc-demo-top">
                <div className="cc-demo-title">
                  {step === "customer"
                    ? "Customer Page"
                    : step === "request"
                      ? "Business Awareness"
                      : "Active Workspace"}
                </div>
                <div className="cc-demo-status">
                  {step === "customer" ? "PUBLIC" : step === "request" ? "NEW REQUEST" : "WORK ACTIVE"}
                </div>
              </div>

              <div className="cc-demo-body">
                {step === "customer" ? (
                  <div className="cc-public-card">
                    <div className="cc-kicker" style={{ marginBottom: 10 }}>
                      Only The Essentials Cleaning
                    </div>
                    <h3>Need help getting your home back in order?</h3>
                    <p>Tell Kaitlin what you need and choose the best time to reach you.</p>
                    <button className="cc-primary" onClick={nextDemo}>
                      Request Cleaning
                    </button>
                  </div>
                ) : null}

                {step === "request" ? (
                  <div className="cc-request-card">
                    <div className="cc-request-meta">
                      <div>
                        <div className="cc-request-name">Sarah Mitchell</div>
                        <p>House Cleaning Â· New Request</p>
                      </div>
                      <div className="cc-badge">New</div>
                    </div>

                    <div className="cc-request-details">
                      <div className="cc-line">
                        Service <strong>Standard Cleaning</strong>
                      </div>
                      <div className="cc-line">
                        Preferred time <strong>Friday Morning</strong>
                      </div>
                      <div className="cc-line">
                        Photos <strong>3 attached</strong>
                      </div>
                    </div>

                    <button className="cc-primary" onClick={nextDemo}>
                      Open Workspace
                    </button>
                  </div>
                ) : null}

                {step === "workspace" ? (
                  <div className="cc-workspace">
                    <div className="cc-workspace-head">
                      <div className="cc-kicker" style={{ marginBottom: 9 }}>
                        Sarah Mitchell
                      </div>
                      <h3>House Cleaning Workspace</h3>

                      <div className="cc-next">
                        <small>Next Action</small>
                        <strong>Send Estimate</strong>
                      </div>
                    </div>

                    <div className="cc-tools">
                      {["Estimate", "Agreement", "Schedule", "Photos", "Payment", "Proof", "Messages", "Timeline"].map(
                        (tool) => (
                          <div className="cc-tool" key={tool}>
                            {tool}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="cc-demo-note">
              {step === "workspace"
                ? "That request did not disappear into an email. It became the work."
                : "Tap the green button to keep going."}
            </div>
          </div>
        </section>

        <section className="cc-section">
          <div className="cc-section-head">
            <div className="cc-kicker">THE WHOLE IDEA</div>
            <h2>The form is not the finish line.</h2>
            <p className="cc-section-copy">
              It is where the work begins.
            </p>
          </div>

          <div className="cc-rule">
            <article className="cc-rule-card">
              <small>Traditional website</small>
              <h3>Form submitted.</h3>
              <p>The owner gets an email and goes back to texts, notes, photos, and separate apps.</p>
            </article>

            <div className="cc-arrow">â†’</div>

            <article className="cc-rule-card active">
              <small>HomePlanet</small>
              <h3>Work opened.</h3>
              <p>The request becomes an active workspace with the next action already waiting.</p>
            </article>
          </div>
        </section>

        <section className="cc-section">
          <div className="cc-section-head">
            <div className="cc-kicker">REAL SYSTEMS</div>
            <h2>See what that looks like in real businesses.</h2>
          </div>

          <div className="cc-system-list">
            {liveSystems.map((system) => (
              <article className="cc-system" key={system.name}>
                <div className="cc-system-name">{system.name}</div>
                <div className="cc-system-side">
                  {system.side}
                  <span className="cc-system-next">{system.next}</span>
                </div>
                <button className="cc-secondary" onClick={() => go(system.href)}>
                  Open Live Page
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="cc-section cc-final" id="build">
          <div className="cc-section-head">
            <div className="cc-kicker">BUILD AROUND THE WAY YOU WORK</div>
            <h2>Build the page customers see. Build the system you work from.</h2>
            <p className="cc-section-copy">
              Start with a clean live page. Grow into quotes, scheduling, photos, payment, proof, and everything needed to finish the job.
            </p>

            <div className="cc-actions">
              <button className="cc-primary" onClick={() => go("https://instagram.com/homeplanetlive")}>
                Build My System
              </button>
              <button className="cc-secondary" onClick={() => go("https://instagram.com/homeplanetlive")}>
                Let's Talk
              </button>
            </div>
          </div>
        </section>

        <footer className="cc-footer">
          Creator City Â· Powered by HomePlanet
        </footer>
      </div>
    </main>
  );
}

