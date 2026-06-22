import React from "react";

const flowSteps = ["Click", "Message", "Details", "Captured", "Next Move"];

const sections = [
  {
    number: "01",
    eyebrow: "Step one",
    title: "Catch the request.",
    text:
      "This is the moment attention turns into something real. The business needs to capture the source, customer, message, photos, and timing before anything gets scattered.",
    image: "/images/homeplanet-lead-reached-out.png",
    alt: "HomePlanet lead reached out visual",
    bullets: [
      "The customer already raised their hand.",
      "Now the details need one clean place to land.",
    ],
  },
  {
    number: "02",
    eyebrow: "Step two",
    title: "Stop the leak.",
    text:
      "Most businesses do not lose the lead at the click. They lose it when photos, notes, timing, and follow-up get buried across texts, DMs, screenshots, and memory.",
    image: "/images/homeplanet-lead-slipping.png",
    alt: "HomePlanet lead slipping visual",
    bullets: [
      "This is the danger zone after attention comes in.",
      "The lead needs a next step before it goes cold.",
    ],
  },
  {
    number: "03",
    eyebrow: "Step three",
    title: "Give it a path.",
    text:
      "HomePlanet turns the same request into an organized lead with context, status, owner guidance, and a clear next move.",
    image: "/images/homeplanet-lead-organized.png",
    alt: "HomePlanet organized lead visual",
    bullets: [
      "The owner knows what happened.",
      "The lead now has somewhere to go next.",
    ],
  },
];

export default function BrightSideFlowDemo() {
  return (
    <main className="bsPage">
      <style>{`
        .bsPage {
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(circle at 10% -10%, rgba(93,255,147,.20), transparent 34%),
            radial-gradient(circle at 92% 28%, rgba(34,197,94,.12), transparent 32%),
            #030604;
          color: #f4fff7;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .bsShell {
          width: min(1080px, calc(100% - 28px));
          margin: 0 auto;
          padding: 30px 0 58px;
        }

        .bsHero {
          padding: 18px 0 18px;
        }

        .bsKicker {
          color: #5dff93;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .bsTitle {
          margin: 0;
          font-size: clamp(48px, 12vw, 104px);
          line-height: .88;
          letter-spacing: -.08em;
          font-weight: 1000;
        }

        .bsTitle span {
          color: #5dff93;
        }

        .bsSubtitle {
          max-width: 760px;
          margin: 18px 0 0;
          color: rgba(244,255,247,.78);
          font-size: clamp(18px, 3.4vw, 26px);
          line-height: 1.28;
          font-weight: 780;
        }

        .bsStepBar {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          margin-top: 22px;
        }

        .bsStep {
          border: 1px solid rgba(93,255,147,.20);
          background: rgba(93,255,147,.07);
          border-radius: 999px;
          padding: 10px 9px;
          color: rgba(244,255,247,.88);
          font-size: 12px;
          font-weight: 950;
          text-align: center;
          white-space: nowrap;
        }

        .bsIntro {
          margin-top: 22px;
          border: 1px solid rgba(93,255,147,.20);
          border-radius: 28px;
          padding: 22px;
          background: linear-gradient(145deg, rgba(13,22,17,.92), rgba(4,8,6,.98));
          box-shadow: 0 24px 70px rgba(0,0,0,.42);
        }

        .bsIntro h2 {
          margin: 0;
          font-size: clamp(28px, 6vw, 46px);
          line-height: 1;
          letter-spacing: -.055em;
          font-weight: 1000;
        }

        .bsIntro p {
          margin: 12px 0 0;
          color: rgba(244,255,247,.72);
          font-size: 17px;
          line-height: 1.45;
          font-weight: 760;
        }

        .bsSection {
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(320px, 460px);
          gap: 24px;
          align-items: center;
          margin-top: 22px;
          border: 1px solid rgba(93,255,147,.20);
          border-radius: 32px;
          padding: 24px;
          background: linear-gradient(145deg, rgba(11,18,14,.96), rgba(4,8,6,.99));
          box-shadow: 0 30px 88px rgba(0,0,0,.46);
        }

        .bsSection:nth-of-type(odd) {
          grid-template-columns: minmax(320px, 460px) minmax(0, .9fr);
        }

        .bsSection:nth-of-type(odd) .bsCopy {
          order: 2;
        }

        .bsSection:nth-of-type(odd) .bsVisual {
          order: 1;
        }

        .bsEyebrow {
          color: #5dff93;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .15em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .bsSectionNumber {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: rgba(93,255,147,.12);
          border: 1px solid rgba(93,255,147,.28);
          color: #5dff93;
          font-size: 14px;
          font-weight: 1000;
          margin-bottom: 14px;
        }

        .bsSectionTitle {
          margin: 0;
          font-size: clamp(34px, 6vw, 62px);
          line-height: .94;
          letter-spacing: -.07em;
          font-weight: 1000;
        }

        .bsSectionText {
          margin: 15px 0 0;
          color: rgba(244,255,247,.75);
          font-size: 18px;
          line-height: 1.45;
          font-weight: 760;
        }

        .bsBullets {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }

        .bsBullet {
          border: 1px solid rgba(255,255,255,.08);
          border-left: 5px solid #5dff93;
          background: rgba(255,255,255,.045);
          border-radius: 16px;
          padding: 13px 14px;
          color: rgba(244,255,247,.86);
          font-size: 14px;
          line-height: 1.35;
          font-weight: 850;
        }

        .bsVisual {
          justify-self: center;
          width: min(100%, 430px);
          border: 1px solid rgba(93,255,147,.20);
          border-radius: 26px;
          overflow: hidden;
          background: rgba(0,0,0,.34);
          box-shadow: 0 22px 60px rgba(0,0,0,.44);
        }

        .bsVisual img {
          display: block;
          width: 100%;
          height: auto;
        }

        .bsDifference {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 22px;
        }

        .bsCompare {
          border: 1px solid rgba(93,255,147,.18);
          border-radius: 24px;
          padding: 18px;
          background: rgba(255,255,255,.045);
        }

        .bsCompare h3 {
          margin: 0;
          font-size: 23px;
          letter-spacing: -.035em;
        }

        .bsCompare p {
          margin: 10px 0 0;
          color: rgba(244,255,247,.72);
          font-size: 15px;
          line-height: 1.42;
          font-weight: 760;
        }

        .bsCta {
          margin-top: 24px;
          border: 1px solid rgba(93,255,147,.22);
          border-radius: 34px;
          padding: 28px;
          text-align: center;
          background:
            radial-gradient(circle at 50% 0%, rgba(93,255,147,.16), transparent 48%),
            linear-gradient(145deg, rgba(12,20,15,.98), rgba(4,8,6,.99));
          box-shadow: 0 30px 90px rgba(0,0,0,.52);
        }

        .bsCta h2 {
          margin: 0;
          font-size: clamp(34px, 8vw, 68px);
          line-height: .92;
          letter-spacing: -.075em;
          font-weight: 1000;
        }

        .bsCta p {
          max-width: 720px;
          margin: 16px auto 0;
          color: rgba(244,255,247,.76);
          font-size: 18px;
          line-height: 1.45;
          font-weight: 760;
        }

        .bsButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 22px;
          border-radius: 999px;
          padding: 16px 24px;
          background: #5dff93;
          color: #041006;
          text-decoration: none;
          font-size: 17px;
          font-weight: 1000;
          box-shadow: 0 18px 46px rgba(93,255,147,.20);
        }

        @media (max-width: 760px) {
          .bsShell {
            width: min(100% - 24px, 560px);
            padding-top: 22px;
          }

          .bsTitle {
            font-size: clamp(44px, 14vw, 66px);
          }

          .bsSubtitle {
            font-size: 18px;
          }

          .bsStepBar {
            grid-template-columns: 1fr;
            gap: 7px;
          }

          .bsStep {
            text-align: left;
            padding: 11px 14px;
          }

          .bsIntro {
            padding: 18px;
            border-radius: 24px;
          }

          .bsSection,
          .bsSection:nth-of-type(odd) {
            grid-template-columns: 1fr;
            padding: 16px;
            border-radius: 26px;
            gap: 16px;
          }

          .bsSection .bsVisual,
          .bsSection:nth-of-type(odd) .bsVisual {
            order: 1;
          }

          .bsSection .bsCopy,
          .bsSection:nth-of-type(odd) .bsCopy {
            order: 2;
          }

          .bsSectionNumber {
            width: 34px;
            height: 34px;
            font-size: 12px;
            margin-bottom: 10px;
          }

          .bsEyebrow {
            font-size: 10px;
            margin-bottom: 8px;
          }

          .bsSectionTitle {
            font-size: clamp(30px, 10vw, 44px);
            line-height: .95;
          }

          .bsSectionText {
            font-size: 15px;
            line-height: 1.42;
          }

          .bsBullets {
            gap: 8px;
            margin-top: 14px;
          }

          .bsBullet {
            font-size: 13px;
            padding: 11px 12px;
            border-radius: 14px;
          }

          .bsVisual {
            width: min(100%, 320px);
          }

          .bsDifference {
            grid-template-columns: 1fr;
          }

          .bsCta {
            padding: 22px 16px;
            border-radius: 28px;
          }

          .bsButton {
            width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>

      <div className="bsShell">
        <section className="bsHero">
          <div className="bsKicker">BrightSide Flow Demo</div>
          <h1 className="bsTitle">
            They clicked.
            <br />
            <span>Now what?</span>
          </h1>
          <p className="bsSubtitle">
            A customer message is not just a message. It is the start of a workflow — or the place where the lead gets lost.
          </p>

          <div className="bsStepBar">
            {flowSteps.map((step, index) => (
              <div key={step} className="bsStep">
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </section>

        <section className="bsIntro">
          <h2>This demo shows what should happen after attention comes in.</h2>
          <p>
            Social media, ads, referrals, and websites can create the first click. HomePlanet shows what should happen after that click becomes a real customer request.
          </p>
        </section>

        {sections.map((section) => (
          <section key={section.title} className="bsSection">
            <div className="bsCopy">
              <div className="bsSectionNumber">{section.number}</div>
              <div className="bsEyebrow">{section.eyebrow}</div>
              <h2 className="bsSectionTitle">{section.title}</h2>
              <p className="bsSectionText">{section.text}</p>

              <div className="bsBullets">
                {section.bullets.map((bullet) => (
                  <div key={bullet} className="bsBullet">
                    {bullet}
                  </div>
                ))}
              </div>
            </div>

            <div className="bsVisual">
              <img src={section.image} alt={section.alt} />
            </div>
          </section>
        ))}

        <section className="bsDifference">
          <div className="bsCompare">
            <h3>Without HomePlanet</h3>
            <p>
              The lead lives in comments, DMs, texts, screenshots, memory, and scattered follow-up.
            </p>
          </div>

          <div className="bsCompare">
            <h3>With HomePlanet</h3>
            <p>
              The same lead becomes a clear card with source, details, status, next step, and reply direction.
            </p>
          </div>
        </section>

        <section className="bsCta">
          <h2>This is what HomePlanet is built to do.</h2>
          <p>
            Not just bring in attention — but help organize what happens after the customer reaches out.
          </p>

          <a className="bsButton" href="/planet/build-your-live-system">
            Build Your Live System
          </a>
        </section>
      </div>
    </main>
  );
}


