import React from "react";

type DirectionCard = {
  eyebrow: string;
  title: string;
  text: string;
  action: string;
  href: string;
  featured?: boolean;
};

type BusinessExample = {
  name: string;
  type: string;
  statement: string;
  flow: string[];
  href?: string;
  status?: string;
};

const directions: DirectionCard[] = [
  {
    eyebrow: "START SIMPLE",
    title: "Launch a professional live page.",
    text: "A clean public entrance, clear customer actions, and a branded HomePlanet address built around what your business actually does.",
    action: "Start With A Live Page",
    href: "#build",
  },
  {
    eyebrow: "GROW YOUR WORKFLOW",
    title: "Turn interest into organized work.",
    text: "Quotes, scheduling, photos, payment, proof, messages, and customer history connected in one working flow.",
    action: "See How It Works",
    href: "#difference",
    featured: true,
  },
  {
    eyebrow: "BUILD SOMETHING CUSTOM",
    title: "Build around how you already work.",
    text: "Not another template. Not another app forcing your business into somebody else's process.",
    action: "Build My System",
    href: "#build",
  },
];

const businesses: BusinessExample[] = [
  {
    name: "Only The Essentials Cleaning",
    type: "CLEANING SYSTEM",
    statement: "Cleaning requests become organized jobs.",
    flow: ["Quote", "Agreement", "Schedule", "Photos", "Payment", "Proof"],
    href: "/onlytheessentials",
    status: "LIVE",
  },
  {
    name: "Florida Cooling",
    type: "HVAC SYSTEM",
    statement: "Service calls become active workspaces.",
    flow: ["Issue", "Dispatch", "Service", "Payment", "Completion"],
    href: "/planet/florida-cooling",
    status: "LIVE SYSTEM",
  },
  {
    name: "V&Z Professional Lawncare",
    type: "LAWNCARE SYSTEM",
    statement: "Yard requests become scheduled service.",
    flow: ["Condition", "Estimate", "Route", "Work Proof", "Follow-up"],
    status: "BUILDING",
  },
  {
    name: "Slap-A-Bug",
    type: "PEST CONTROL SYSTEM",
    statement: "Pest requests move directly into action.",
    flow: ["Problem", "Request", "Active Job", "Proof", "Follow-up"],
    href: "/planet/slap-a-bug",
    status: "LIVE",
  },
];

const traditionalAfter = [
  "Random texts",
  "Camera-roll photos",
  "Paper notes",
  "Separate payment apps",
  "Forgotten follow-ups",
];

const homePlanetFlow = [
  "Request",
  "Estimate",
  "Agreement",
  "Schedule",
  "Work Photos",
  "Payment",
  "Proof",
  "Review",
  "Timeline",
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
    <main className="creator-city">
      <style>{`
        :root {
          color-scheme: dark;
        }

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

        button,
        a {
          font: inherit;
        }

        .creator-city {
          min-height: 100vh;
          overflow: hidden;
          color: #f4fff8;
          background:
            radial-gradient(circle at 50% -8%, rgba(73, 255, 141, 0.16), transparent 31rem),
            radial-gradient(circle at 8% 28%, rgba(39, 190, 99, 0.08), transparent 24rem),
            linear-gradient(180deg, #020504 0%, #050907 45%, #020504 100%);
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
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .cc-nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          min-height: 78px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .cc-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .cc-mark {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #65ff9a;
          box-shadow:
            0 0 0 7px rgba(101, 255, 154, 0.08),
            0 0 24px rgba(101, 255, 154, 0.85);
        }

        .cc-nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cc-link-button,
        .cc-primary,
        .cc-secondary {
          border: 0;
          cursor: pointer;
          text-decoration: none;
        }

        .cc-link-button {
          padding: 12px 14px;
          color: rgba(244, 255, 248, 0.74);
          background: transparent;
          font-size: 13px;
          font-weight: 850;
        }

        .cc-primary,
        .cc-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          border-radius: 14px;
          padding: 0 19px;
          font-weight: 950;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            box-shadow 180ms ease,
            background 180ms ease;
        }

        .cc-primary {
          color: #001808;
          background: #65ff9a;
          box-shadow: 0 12px 34px rgba(59, 255, 127, 0.2);
        }

        .cc-secondary {
          color: #f4fff8;
          border: 1px solid rgba(255, 255, 255, 0.16);
          background: rgba(255, 255, 255, 0.045);
        }

        .cc-primary:hover,
        .cc-secondary:hover {
          transform: translateY(-2px);
        }

        .cc-secondary:hover {
          border-color: rgba(101, 255, 154, 0.45);
          background: rgba(101, 255, 154, 0.07);
        }

        .cc-hero {
          position: relative;
          display: grid;
          align-content: center;
          min-height: calc(100vh - 78px);
          padding: 86px 0 70px;
        }

        .cc-hero::after {
          content: "";
          position: absolute;
          right: -170px;
          bottom: 20px;
          width: 530px;
          height: 530px;
          border-radius: 50%;
          border: 1px solid rgba(101, 255, 154, 0.08);
          box-shadow:
            0 0 0 70px rgba(101, 255, 154, 0.018),
            0 0 0 140px rgba(101, 255, 154, 0.012);
          pointer-events: none;
        }

        .cc-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          width: fit-content;
          margin-bottom: 22px;
          color: #91ffb5;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .cc-kicker::before {
          content: "";
          width: 28px;
          height: 1px;
          background: #65ff9a;
          box-shadow: 0 0 12px #65ff9a;
        }

        .cc-hero h1 {
          max-width: 900px;
          margin: 0;
          font-size: clamp(52px, 8.2vw, 102px);
          line-height: 0.92;
          letter-spacing: -0.067em;
          font-weight: 980;
        }

        .cc-hero h1 span {
          color: #65ff9a;
          text-shadow: 0 0 38px rgba(101, 255, 154, 0.18);
        }

        .cc-hero-copy {
          max-width: 680px;
          margin: 28px 0 0;
          color: rgba(244, 255, 248, 0.7);
          font-size: clamp(18px, 2vw, 24px);
          line-height: 1.45;
          font-weight: 650;
        }

        .cc-hero-copy strong {
          color: #f4fff8;
        }

        .cc-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .cc-live-strip {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 14px;
          width: fit-content;
          max-width: 100%;
          margin-top: 48px;
          padding: 12px 14px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.035);
          color: rgba(244, 255, 248, 0.64);
          font-size: 12px;
          font-weight: 800;
          backdrop-filter: blur(12px);
        }

        .cc-live-dot {
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          border-radius: 999px;
          background: #65ff9a;
          box-shadow: 0 0 15px rgba(101, 255, 154, 0.95);
        }

        .cc-live-names {
          color: #f4fff8;
        }

        .cc-flow-rail {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 8px;
          max-width: 860px;
          margin-top: 24px;
        }

        .cc-flow-step {
          position: relative;
          min-height: 76px;
          padding: 14px;
          border-top: 1px solid rgba(101, 255, 154, 0.34);
          background: linear-gradient(180deg, rgba(101, 255, 154, 0.06), transparent);
          color: rgba(244, 255, 248, 0.58);
          font-size: 12px;
          font-weight: 850;
        }

        .cc-flow-step strong {
          display: block;
          margin-top: 6px;
          color: #f4fff8;
          font-size: 14px;
        }

        .cc-section {
          position: relative;
          padding: 110px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.065);
        }

        .cc-section-head {
          max-width: 820px;
          margin-bottom: 45px;
        }

        .cc-eyebrow {
          margin-bottom: 13px;
          color: #91ffb5;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .cc-section h2 {
          margin: 0;
          font-size: clamp(38px, 5vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.052em;
          font-weight: 970;
        }

        .cc-section-intro {
          max-width: 680px;
          margin: 20px 0 0;
          color: rgba(244, 255, 248, 0.64);
          font-size: 18px;
          line-height: 1.55;
        }

        .cc-system-chain {
          display: flex;
          align-items: stretch;
          gap: 8px;
          overflow-x: auto;
          padding: 6px 0 12px;
          scrollbar-width: thin;
        }

        .cc-chain-step {
          min-width: 132px;
          padding: 17px 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.035);
        }

        .cc-chain-number {
          color: #65ff9a;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .cc-chain-label {
          margin-top: 7px;
          color: #f4fff8;
          font-size: 14px;
          font-weight: 900;
        }

        .cc-chain-arrow {
          display: grid;
          place-items: center;
          min-width: 18px;
          color: rgba(101, 255, 154, 0.45);
          font-size: 20px;
        }

        .cc-direction-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .cc-direction-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 360px;
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 22px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.018));
          overflow: hidden;
        }

        .cc-direction-card.featured {
          border-color: rgba(101, 255, 154, 0.36);
          background:
            radial-gradient(circle at 80% 10%, rgba(101, 255, 154, 0.14), transparent 15rem),
            linear-gradient(180deg, rgba(101, 255, 154, 0.075), rgba(255, 255, 255, 0.018));
        }

        .cc-direction-index {
          position: absolute;
          top: 16px;
          right: 20px;
          color: rgba(255, 255, 255, 0.065);
          font-size: 70px;
          line-height: 1;
          font-weight: 980;
        }

        .cc-direction-card h3 {
          position: relative;
          max-width: 330px;
          margin: 18px 0 0;
          font-size: 28px;
          line-height: 1.02;
          letter-spacing: -0.035em;
        }

        .cc-direction-card p {
          position: relative;
          margin: 18px 0 26px;
          color: rgba(244, 255, 248, 0.62);
          line-height: 1.55;
        }

        .cc-direction-card button {
          width: 100%;
          margin-top: auto;
        }

        .cc-compare {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .cc-compare-card {
          min-height: 475px;
          padding: 32px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.026);
        }

        .cc-compare-card.homeplanet {
          border-color: rgba(101, 255, 154, 0.34);
          background:
            radial-gradient(circle at 85% 0%, rgba(101, 255, 154, 0.14), transparent 21rem),
            rgba(101, 255, 154, 0.035);
        }

        .cc-compare-label {
          color: rgba(244, 255, 248, 0.5);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .cc-compare-card.homeplanet .cc-compare-label {
          color: #91ffb5;
        }

        .cc-compare-card h3 {
          margin: 17px 0 0;
          font-size: 34px;
          letter-spacing: -0.04em;
        }

        .cc-compare-card > p {
          color: rgba(244, 255, 248, 0.62);
          font-size: 17px;
          line-height: 1.55;
        }

        .cc-compare-list {
          display: grid;
          gap: 9px;
          margin-top: 28px;
        }

        .cc-compare-item {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 48px;
          padding: 0 14px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(244, 255, 248, 0.76);
          font-weight: 800;
        }

        .cc-compare-item::before {
          content: "";
          width: 7px;
          height: 7px;
          flex: 0 0 auto;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.22);
        }

        .homeplanet .cc-compare-item::before {
          background: #65ff9a;
          box-shadow: 0 0 10px rgba(101, 255, 154, 0.7);
        }

        .cc-statement {
          margin-top: 50px;
          padding: 48px 0 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }

        .cc-statement p {
          margin: 0;
          color: rgba(244, 255, 248, 0.48);
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .cc-statement strong {
          display: block;
          margin-top: 8px;
          color: #f4fff8;
          font-size: clamp(38px, 6vw, 74px);
          line-height: 0.96;
          letter-spacing: -0.055em;
        }

        .cc-business-list {
          display: grid;
          gap: 12px;
        }

        .cc-business {
          display: grid;
          grid-template-columns: minmax(230px, 0.9fr) minmax(260px, 1.1fr) auto;
          gap: 24px;
          align-items: center;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.028);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .cc-business:hover {
          transform: translateY(-2px);
          border-color: rgba(101, 255, 154, 0.32);
          background: rgba(101, 255, 154, 0.04);
        }

        .cc-business-type {
          color: #91ffb5;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
        }

        .cc-business h3 {
          margin: 7px 0 0;
          font-size: 22px;
          letter-spacing: -0.025em;
        }

        .cc-business-statement {
          margin: 0 0 11px;
          color: #f4fff8;
          font-size: 16px;
          font-weight: 850;
        }

        .cc-business-flow {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .cc-business-flow span {
          padding: 7px 9px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 999px;
          color: rgba(244, 255, 248, 0.58);
          font-size: 10px;
          font-weight: 850;
        }

        .cc-business-action {
          min-width: 132px;
        }

        .cc-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 10px;
          color: rgba(244, 255, 248, 0.56);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .cc-status::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #65ff9a;
          box-shadow: 0 0 10px rgba(101, 255, 154, 0.8);
        }

        .cc-principles {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .cc-principle {
          min-height: 220px;
          padding: 28px;
          border-top: 1px solid rgba(101, 255, 154, 0.35);
          background: linear-gradient(180deg, rgba(101, 255, 154, 0.055), transparent);
        }

        .cc-principle h3 {
          margin: 0;
          font-size: 24px;
          line-height: 1.08;
          letter-spacing: -0.03em;
        }

        .cc-principle p {
          margin: 16px 0 0;
          color: rgba(244, 255, 248, 0.58);
          line-height: 1.55;
        }

        .cc-final {
          padding: 120px 0;
          text-align: center;
        }

        .cc-final-inner {
          max-width: 820px;
          margin: 0 auto;
        }

        .cc-final h2 {
          font-size: clamp(44px, 7vw, 84px);
        }

        .cc-final .cc-section-intro {
          margin-left: auto;
          margin-right: auto;
        }

        .cc-final-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .cc-url-line {
          margin-top: 28px;
          color: rgba(244, 255, 248, 0.4);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.03em;
        }

        .cc-footer {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 27px 0 36px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          color: rgba(244, 255, 248, 0.38);
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .cc-nav {
            min-height: 70px;
          }

          .cc-link-button {
            display: none;
          }

          .cc-hero {
            min-height: auto;
            padding: 78px 0 76px;
          }

          .cc-hero::after {
            width: 320px;
            height: 320px;
            right: -180px;
          }

          .cc-flow-rail {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .cc-flow-step {
            min-height: auto;
            border-top: 0;
            border-left: 1px solid rgba(101, 255, 154, 0.34);
          }

          .cc-direction-grid,
          .cc-principles {
            grid-template-columns: 1fr;
          }

          .cc-direction-card {
            min-height: 300px;
          }

          .cc-compare {
            grid-template-columns: 1fr;
          }

          .cc-business {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .cc-business-action {
            width: 100%;
          }
        }

        @media (max-width: 560px) {
          .cc-shell {
            width: min(100% - 22px, 1180px);
          }

          .cc-brand {
            font-size: 11px;
          }

          .cc-nav .cc-primary {
            min-height: 42px;
            padding: 0 13px;
            border-radius: 12px;
            font-size: 12px;
          }

          .cc-hero {
            padding-top: 58px;
          }

          .cc-hero h1 {
            font-size: clamp(48px, 15vw, 66px);
          }

          .cc-hero-copy {
            font-size: 18px;
          }

          .cc-hero-actions {
            display: grid;
          }

          .cc-hero-actions button,
          .cc-final-actions button {
            width: 100%;
          }

          .cc-live-strip {
            align-items: flex-start;
            font-size: 11px;
          }

          .cc-live-names {
            display: block;
            margin-top: 4px;
          }

          .cc-section {
            padding: 82px 0;
          }

          .cc-direction-card,
          .cc-compare-card,
          .cc-business {
            padding: 22px;
          }

          .cc-system-chain {
            margin-right: -11px;
          }

          .cc-footer {
            display: grid;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>

      <div className="cc-shell">
        <nav className="cc-nav">
          <div className="cc-brand">
            <span className="cc-mark" />
            <span>Creator City</span>
            <span style={{ color: "rgba(244,255,248,.36)" }}>by HomePlanet</span>
          </div>

          <div className="cc-nav-actions">
            <button className="cc-link-button" onClick={() => go("#running")}>
              See It Running
            </button>
            <button className="cc-primary" onClick={() => go("#build")}>
              Build My System
            </button>
          </div>
        </nav>

        <section className="cc-hero">
          <div className="cc-kicker">A new kind of business infrastructure</div>

          <h1>
            Build something that actually <span>runs your business.</span>
          </h1>

          <p className="cc-hero-copy">
            <strong>A professional live page on the outside.</strong>
            <br />
            A working system underneath.
          </p>

          <div className="cc-hero-actions">
            <button className="cc-primary" onClick={() => go("#build")}>
              Build My System
            </button>
            <button className="cc-secondary" onClick={() => go("#difference")}>
              See How It Works
            </button>
          </div>

          <div className="cc-live-strip">
            <span className="cc-live-dot" />
            <span>
              Now running on HomePlanet
              <span className="cc-live-names">
                {" "}Only The Essentials · Florida Cooling · Slap-A-Bug · V&Z Lawncare
              </span>
            </span>
          </div>

          <div className="cc-flow-rail" aria-label="HomePlanet workflow">
            {[
              ["01", "Request received"],
              ["02", "Estimate"],
              ["03", "Scheduled"],
              ["04", "Payment"],
              ["05", "Complete"],
            ].map(([number, label]) => (
              <div className="cc-flow-step" key={label}>
                {number}
                <strong>{label}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="cc-section" id="difference">
          <div className="cc-section-head">
            <div className="cc-eyebrow">THE DIFFERENCE</div>
            <h2>The website is only the front door.</h2>
            <p className="cc-section-intro">
              Most websites stop after somebody reads the page or fills out a form.
              HomePlanet begins there.
            </p>
          </div>

          <div className="cc-system-chain">
            {homePlanetFlow.map((step, index) => (
              <React.Fragment key={step}>
                <div className="cc-chain-step">
                  <div className="cc-chain-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="cc-chain-label">{step}</div>
                </div>
                {index < homePlanetFlow.length - 1 ? (
                  <div className="cc-chain-arrow">→</div>
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="cc-section" id="direction">
          <div className="cc-section-head">
            <div className="cc-eyebrow">CHOOSE YOUR DIRECTION</div>
            <h2>Start where you are. Build what comes next.</h2>
          </div>

          <div className="cc-direction-grid">
            {directions.map((item, index) => (
              <article
                className={`cc-direction-card${item.featured ? " featured" : ""}`}
                key={item.eyebrow}
              >
                <div className="cc-direction-index">0{index + 1}</div>
                <div className="cc-eyebrow">{item.eyebrow}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <button
                  className={item.featured ? "cc-primary" : "cc-secondary"}
                  onClick={() => go(item.href)}
                >
                  {item.action}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="cc-section">
          <div className="cc-section-head">
            <div className="cc-eyebrow">TRADITIONAL WEBSITE VS. HOMEPLANET</div>
            <h2>What happens after the customer clicks?</h2>
          </div>

          <div className="cc-compare">
            <article className="cc-compare-card">
              <div className="cc-compare-label">Traditional Website</div>
              <h3>The customer visits.</h3>
              <p>
                They read. Maybe they fill out a form. Then the business owner goes
                right back to disconnected tools.
              </p>

              <div className="cc-compare-list">
                {traditionalAfter.map((item) => (
                  <div className="cc-compare-item" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <article className="cc-compare-card homeplanet">
              <div className="cc-compare-label">HomePlanet</div>
              <h3>The customer submits a request.</h3>
              <p>
                The work begins. Every next action stays connected from first contact
                through completion.
              </p>

              <div className="cc-compare-list">
                {homePlanetFlow.slice(1).map((item) => (
                  <div className="cc-compare-item" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="cc-statement">
            <p>The website is not the product.</p>
            <strong>The operating system underneath is.</strong>
          </div>
        </section>

        <section className="cc-section" id="running">
          <div className="cc-section-head">
            <div className="cc-eyebrow">SEE IT RUNNING</div>
            <h2>Real businesses. Living systems.</h2>
            <p className="cc-section-intro">
              These are not generic portfolio cards. Each business has its own public
              entrance and a working flow underneath.
            </p>
          </div>

          <div className="cc-business-list">
            {businesses.map((business) => (
              <article className="cc-business" key={business.name}>
                <div>
                  <div className="cc-business-type">{business.type}</div>
                  <h3>{business.name}</h3>
                </div>

                <div>
                  <p className="cc-business-statement">{business.statement}</p>
                  <div className="cc-business-flow">
                    {business.flow.map((step) => (
                      <span key={step}>{step}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="cc-status">{business.status}</div>
                  <button
                    className={business.href ? "cc-secondary cc-business-action" : "cc-secondary cc-business-action"}
                    disabled={!business.href}
                    onClick={() => business.href && go(business.href)}
                    style={!business.href ? { opacity: 0.48, cursor: "default" } : undefined}
                  >
                    {business.href ? "Open Live Page" : "Coming Soon"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cc-section">
          <div className="cc-section-head">
            <div className="cc-eyebrow">BUILT AROUND REAL WORK</div>
            <h2>One public entrance. One connected truth.</h2>
          </div>

          <div className="cc-principles">
            <article className="cc-principle">
              <h3>The customer sees what they need.</h3>
              <p>A clean, focused public page with clear next actions.</p>
            </article>

            <article className="cc-principle">
              <h3>The operator sees what happens next.</h3>
              <p>An active workspace instead of scattered information and guesswork.</p>
            </article>

            <article className="cc-principle">
              <h3>The business keeps the truth.</h3>
              <p>Requests, actions, payment, proof, and history stay connected.</p>
            </article>
          </div>
        </section>

        <section className="cc-section cc-final" id="build">
          <div className="cc-final-inner">
            <div className="cc-eyebrow">START WITH WHAT YOU NEED NOW</div>
            <h2>Build the front door. Grow the system behind it.</h2>
            <p className="cc-section-intro">
              A clean live page can be the beginning. Your HomePlanet system can grow
              as your business grows.
            </p>

            <div className="cc-final-actions">
              <button
                className="cc-primary"
                onClick={() => go("https://instagram.com/homeplanetlive")}
              >
                Build My System
              </button>
              <button
                className="cc-secondary"
                onClick={() => go("https://instagram.com/homeplanetlive")}
              >
                Let&apos;s Talk
              </button>
            </div>

            <div className="cc-url-line">
              homeplanet.city/yourbusiness · A clean public address powered by HomePlanet
            </div>
          </div>
        </section>

        <footer className="cc-footer">
          <span>Creator City · Powered by HomePlanet</span>
          <span>Build something that actually runs your business.</span>
        </footer>
      </div>
    </main>
  );
}
