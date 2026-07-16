import React from "react";

const businesses = [
  {
    name: "Only The Essentials",
    type: "Cleaning system",
    status: "LIVE",
    action: "Agreement waiting",
    detail: "Estimate ready · Schedule next",
    href: "/onlytheessentials",
  },
  {
    name: "Florida Cooling",
    type: "HVAC service system",
    status: "ACTIVE",
    action: "Technician en route",
    detail: "Service call open · Payment pending",
    href: "/planet/florida-cooling",
  },
  {
    name: "Slap-A-Bug",
    type: "Pest control system",
    status: "NEW",
    action: "Customer photos attached",
    detail: "Next action: estimate",
    href: "/planet/slap-a-bug",
  },
];

const directions = [
  {
    n: "01",
    label: "START SIMPLE",
    title: "Launch a clean public entrance.",
    text: "A professional live page, clear customer actions, and a branded HomePlanet address.",
    url: "homeplanet.city/onlytheessentials",
  },
  {
    n: "02",
    label: "GROW YOUR WORKFLOW",
    title: "Turn incoming interest into organized work.",
    text: "Quotes, scheduling, photos, payment, proof, messages, and history stay connected.",
  },
  {
    n: "03",
    label: "BUILD SOMETHING CUSTOM",
    title: "Build around how you already work.",
    text: "Not another template. The system adapts to the real way your business operates.",
  },
];

const running = [
  {
    name: "Only The Essentials Cleaning",
    flow: ["Request", "Estimate", "Agreement", "Schedule", "Payment"],
    href: "/onlytheessentials",
  },
  {
    name: "Florida Cooling",
    flow: ["Service Call", "Dispatch", "Work", "Payment", "Complete"],
    href: "/planet/florida-cooling",
  },
  {
    name: "Slap-A-Bug",
    flow: ["Issue", "Request", "Active Job", "Proof", "Follow-up"],
    href: "/planet/slap-a-bug",
  },
  {
    name: "V&Z Professional Lawncare",
    flow: ["Condition", "Estimate", "Route", "Work Proof", "Follow-up"],
  },
];

export default function CreatorCity() {
  const go = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.href = href;
  };

  return (
    <main className="cc-page">
      <style>{`
        :root { color-scheme: dark; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #020503; }
        button { font: inherit; }

        .cc-page {
          min-height: 100vh;
          color: #f4fff7;
          overflow: hidden;
          background:
            radial-gradient(circle at 72% 10%, rgba(76,255,139,.12), transparent 24rem),
            radial-gradient(circle at 8% 38%, rgba(76,255,139,.055), transparent 26rem),
            linear-gradient(180deg, #020503 0%, #050806 48%, #020503 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .shell { width: min(1180px, calc(100% - 30px)); margin: 0 auto; }
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 74px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .brand-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #58ff91;
          box-shadow: 0 0 0 6px rgba(88,255,145,.08), 0 0 22px rgba(88,255,145,.8);
        }

        .nav-actions { display: flex; gap: 10px; align-items: center; }
        .link, .primary, .secondary {
          border: 0;
          cursor: pointer;
          font-weight: 950;
          transition: transform .18s ease, border-color .18s ease, background .18s ease;
        }

        .link { color: rgba(244,255,247,.62); background: transparent; padding: 12px 8px; }
        .primary, .secondary {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 14px;
        }

        .primary {
          color: #001608;
          background: #58ff91;
          box-shadow: 0 12px 34px rgba(88,255,145,.18);
        }

        .secondary {
          color: #f4fff7;
          border: 1px solid rgba(255,255,255,.15);
          background: rgba(255,255,255,.04);
        }

        .primary:hover, .secondary:hover { transform: translateY(-2px); }
        .secondary:hover { border-color: rgba(88,255,145,.4); background: rgba(88,255,145,.06); }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(360px, .95fr);
          gap: 54px;
          align-items: center;
          min-height: calc(100vh - 74px);
          padding: 70px 0 80px;
        }

        .kicker, .eyebrow {
          color: #8affad;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .kicker {
          display: inline-flex;
          gap: 10px;
          align-items: center;
        }

        .kicker::before {
          content: "";
          width: 28px;
          height: 1px;
          background: #58ff91;
          box-shadow: 0 0 10px #58ff91;
        }

        h1 {
          max-width: 760px;
          margin: 20px 0 0;
          font-size: clamp(54px, 7.7vw, 96px);
          line-height: .92;
          letter-spacing: -.066em;
          font-weight: 980;
        }

        h1 span { color: #58ff91; text-shadow: 0 0 35px rgba(88,255,145,.16); }

        .hero-copy {
          max-width: 620px;
          margin: 26px 0 0;
          color: rgba(244,255,247,.66);
          font-size: 21px;
          line-height: 1.45;
          font-weight: 650;
        }

        .hero-copy strong { color: #f4fff7; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

        .city-stack {
          position: relative;
          display: grid;
          gap: 12px;
          padding: 20px;
        }

        .city-stack::before {
          content: "";
          position: absolute;
          inset: 10% -10% -8% 12%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(88,255,145,.14), rgba(88,255,145,.02) 45%, transparent 70%);
          filter: blur(8px);
          pointer-events: none;
        }

        .signal-card {
          position: relative;
          padding: 20px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.025));
          box-shadow: 0 24px 60px rgba(0,0,0,.26);
          backdrop-filter: blur(16px);
        }

        .signal-card:nth-child(2) { margin-left: 36px; }
        .signal-card:nth-child(3) { margin-left: 72px; }

        .signal-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
        }

        .signal-name { font-size: 17px; font-weight: 950; }
        .signal-type { margin-top: 5px; color: rgba(244,255,247,.45); font-size: 11px; font-weight: 800; }
        .status {
          display: inline-flex;
          gap: 7px;
          align-items: center;
          color: #8affad;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .1em;
        }

        .status::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #58ff91;
          box-shadow: 0 0 12px rgba(88,255,145,.8);
        }

        .signal-action {
          margin-top: 18px;
          font-size: 19px;
          font-weight: 950;
          letter-spacing: -.02em;
        }

        .signal-detail {
          margin-top: 7px;
          color: rgba(244,255,247,.56);
          font-size: 12px;
          font-weight: 750;
        }

        .section {
          padding: 100px 0;
          border-top: 1px solid rgba(255,255,255,.065);
        }

        .section-head { max-width: 800px; margin-bottom: 42px; }
        .section h2 {
          margin: 12px 0 0;
          font-size: clamp(40px, 5vw, 68px);
          line-height: .98;
          letter-spacing: -.055em;
          font-weight: 975;
        }

        .intro {
          max-width: 660px;
          margin: 18px 0 0;
          color: rgba(244,255,247,.6);
          font-size: 18px;
          line-height: 1.55;
        }

        .three-stage {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 14px;
        }

        .stage {
          min-height: 320px;
          padding: 28px;
          border-top: 1px solid rgba(88,255,145,.4);
          background: linear-gradient(180deg, rgba(88,255,145,.065), transparent);
        }

        .stage-num { color: rgba(88,255,145,.5); font-size: 12px; font-weight: 950; }
        .stage h3 { margin: 16px 0 0; font-size: 29px; line-height: 1.05; letter-spacing: -.035em; }
        .stage p { margin: 15px 0 0; color: rgba(244,255,247,.58); line-height: 1.5; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
        .chip {
          padding: 8px 10px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 999px;
          color: rgba(244,255,247,.68);
          background: rgba(255,255,255,.025);
          font-size: 11px;
          font-weight: 850;
        }

        .running-list { display: grid; gap: 12px; }
        .running-row {
          display: grid;
          grid-template-columns: minmax(240px,.8fr) minmax(0,1.2fr) auto;
          gap: 24px;
          align-items: center;
          padding: 24px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 18px;
          background: rgba(255,255,255,.025);
        }

        .running-row h3 { margin: 0; font-size: 22px; letter-spacing: -.025em; }
        .flow { display: flex; flex-wrap: wrap; gap: 7px; }
        .flow span {
          padding: 7px 9px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.09);
          color: rgba(244,255,247,.56);
          font-size: 10px;
          font-weight: 850;
        }

        .direction-path { display: grid; gap: 0; }
        .direction {
          display: grid;
          grid-template-columns: 110px minmax(0,1fr);
          gap: 26px;
          padding: 34px 0;
          border-top: 1px solid rgba(255,255,255,.08);
        }

        .direction:last-child { border-bottom: 1px solid rgba(255,255,255,.08); }
        .direction-num {
          color: rgba(88,255,145,.24);
          font-size: 68px;
          line-height: .9;
          font-weight: 980;
        }

        .direction h3 { margin: 8px 0 0; font-size: 31px; letter-spacing: -.035em; }
        .direction p { max-width: 720px; margin: 13px 0 0; color: rgba(244,255,247,.58); line-height: 1.55; }
        .direction-url {
          display: inline-block;
          margin-top: 16px;
          color: #8affad;
          font-size: 13px;
          font-weight: 900;
        }

        .compare {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 28px;
          align-items: center;
        }

        .broken {
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 10px;
        }

        .broken span {
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 14px;
          color: rgba(244,255,247,.5);
          background: rgba(255,255,255,.025);
          text-align: center;
          font-weight: 850;
        }

        .connected {
          padding: 28px;
          border: 1px solid rgba(88,255,145,.3);
          border-radius: 20px;
          background: radial-gradient(circle at 90% 0%, rgba(88,255,145,.12), transparent 18rem), rgba(88,255,145,.03);
        }

        .connected h3 { margin: 0; font-size: 30px; letter-spacing: -.04em; }
        .connected-flow { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
        .connected-flow span {
          position: relative;
          padding: 10px 12px;
          border-radius: 999px;
          background: rgba(88,255,145,.09);
          color: #dffff0;
          font-size: 11px;
          font-weight: 900;
        }

        .statement {
          margin-top: 48px;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,.08);
          text-align: center;
        }

        .statement p {
          margin: 0;
          color: rgba(244,255,247,.36);
          font-size: clamp(26px,3vw,40px);
          font-weight: 900;
          letter-spacing: -.035em;
        }

        .statement strong {
          display: block;
          margin-top: 8px;
          font-size: clamp(38px,5vw,68px);
          line-height: .98;
          letter-spacing: -.05em;
        }

        .final { padding: 110px 0; text-align: center; }
        .final-inner { max-width: 820px; margin: 0 auto; }
        .final .intro { margin-left: auto; margin-right: auto; }
        .final-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 30px; }
        .footer {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          padding: 28px 0 36px;
          border-top: 1px solid rgba(255,255,255,.07);
          color: rgba(244,255,247,.34);
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; gap: 50px; min-height: auto; padding: 64px 0 76px; }
          .city-stack { padding: 0; }
          .signal-card:nth-child(2), .signal-card:nth-child(3) { margin-left: 0; }
          .three-stage { grid-template-columns: 1fr; }
          .running-row { grid-template-columns: 1fr; }
          .compare { grid-template-columns: 1fr; }
        }

        @media (max-width: 560px) {
          .shell { width: min(100% - 22px, 1180px); }
          .link { display: none; }
          .nav .primary { min-height: 42px; padding: 0 13px; font-size: 12px; }
          .hero-actions, .final-actions { display: grid; }
          .hero-actions button, .final-actions button { width: 100%; }
          .section { padding: 80px 0; }
          .direction { grid-template-columns: 1fr; gap: 10px; }
          .direction-num { font-size: 50px; }
          .broken { grid-template-columns: 1fr; }
          .footer { display: grid; justify-content: center; text-align: center; }
        }
      `}</style>

      <div className="shell">
        <nav className="nav">
          <div className="brand">
            <span className="brand-dot" />
            <span>Creator City</span>
            <span style={{ color: "rgba(244,255,247,.34)" }}>by HomePlanet</span>
          </div>
          <div className="nav-actions">
            <button className="link" onClick={() => go("#running")}>See It Running</button>
            <button className="primary" onClick={() => go("#build")}>Build My System</button>
          </div>
        </nav>

        <section className="hero">
          <div>
            <div className="kicker">A new kind of business infrastructure</div>
            <h1>Build something that actually <span>runs your business.</span></h1>
            <p className="hero-copy">
              <strong>A professional live page on the outside.</strong><br />
              A working system underneath.
            </p>
            <div className="hero-actions">
              <button className="primary" onClick={() => go("#build")}>Build My System</button>
              <button className="secondary" onClick={() => go("#how")}>See How It Works</button>
            </div>
          </div>

          <div className="city-stack" aria-label="Live HomePlanet activity">
            {businesses.map((business) => (
              <article className="signal-card" key={business.name}>
                <div className="signal-top">
                  <div>
                    <div className="signal-name">{business.name}</div>
                    <div className="signal-type">{business.type}</div>
                  </div>
                  <div className="status">{business.status}</div>
                </div>
                <div className="signal-action">{business.action}</div>
                <div className="signal-detail">{business.detail}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="how">
          <div className="section-head">
            <div className="eyebrow">ONE REQUEST COMES IN</div>
            <h2>Then the work starts moving.</h2>
            <p className="intro">
              HomePlanet connects the customer-facing page to the real work underneath.
            </p>
          </div>

          <div className="three-stage">
            <article className="stage">
              <div className="stage-num">01</div>
              <h3>The customer reaches out.</h3>
              <p>The page captures what matters without making the customer fight through a giant form.</p>
              <div className="chips">
                {["Request", "Photos", "Problem", "Contact"].map((item) => <span className="chip" key={item}>{item}</span>)}
              </div>
            </article>

            <article className="stage">
              <div className="stage-num">02</div>
              <h3>HomePlanet organizes the work.</h3>
              <p>The request becomes an active workspace with the next action already waiting.</p>
              <div className="chips">
                {["Estimate", "Agreement", "Schedule", "Messages"].map((item) => <span className="chip" key={item}>{item}</span>)}
              </div>
            </article>

            <article className="stage">
              <div className="stage-num">03</div>
              <h3>The business moves forward.</h3>
              <p>Payment, proof, follow-up, and history stay attached to the job instead of getting lost.</p>
              <div className="chips">
                {["Payment", "Proof", "Review", "Timeline"].map((item) => <span className="chip" key={item}>{item}</span>)}
              </div>
            </article>
          </div>
        </section>

        <section className="section" id="running">
          <div className="section-head">
            <div className="eyebrow">SEE HOMEPLANET RUNNING</div>
            <h2>Real businesses. Active systems.</h2>
            <p className="intro">Each one has its own public entrance and a working system underneath.</p>
          </div>

          <div className="running-list">
            {running.map((item) => (
              <article className="running-row" key={item.name}>
                <h3>{item.name}</h3>
                <div className="flow">
                  {item.flow.map((step) => <span key={step}>{step}</span>)}
                </div>
                <button
                  className="secondary"
                  disabled={!item.href}
                  onClick={() => item.href && go(item.href)}
                  style={!item.href ? { opacity: .42, cursor: "default" } : undefined}
                >
                  {item.href ? "Open Live Page" : "Building"}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div className="eyebrow">CHOOSE YOUR DIRECTION</div>
            <h2>Start simple. Grow from there.</h2>
          </div>

          <div className="direction-path">
            {directions.map((item) => (
              <article className="direction" key={item.n}>
                <div className="direction-num">{item.n}</div>
                <div>
                  <div className="eyebrow">{item.label}</div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {item.url ? <div className="direction-url">{item.url}</div> : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div className="eyebrow">TRADITIONAL WEBSITE VS. HOMEPLANET</div>
            <h2>One breaks apart. One stays connected.</h2>
          </div>

          <div className="compare">
            <div className="broken">
              {["Form submitted", "Random texts", "Camera roll", "Paper notes", "Payment apps", "Memory"].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="connected">
              <h3>HomePlanet keeps the whole job together.</h3>
              <div className="connected-flow">
                {["Request", "Estimate", "Agreement", "Schedule", "Work", "Payment", "Proof"].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="statement">
            <p>The website is not the product.</p>
            <strong>The operating system underneath is.</strong>
          </div>
        </section>

        <section className="section final" id="build">
          <div className="final-inner">
            <div className="eyebrow">START WITH WHAT YOU NEED NOW</div>
            <h2>Build the front door. Grow the system behind it.</h2>
            <p className="intro">A clean live page can be the beginning. The system can grow as the business grows.</p>
            <div className="final-actions">
              <button className="primary" onClick={() => go("https://instagram.com/homeplanetlive")}>Build My System</button>
              <button className="secondary" onClick={() => go("https://instagram.com/homeplanetlive")}>Let&apos;s Talk</button>
            </div>
          </div>
        </section>

        <footer className="footer">
          <span>Creator City · Powered by HomePlanet</span>
          <span>Build something that actually runs your business.</span>
        </footer>
      </div>
    </main>
  );
}
