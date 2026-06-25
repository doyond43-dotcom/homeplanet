const fs = require("fs");

const file = "src/pages/HomeServicesLiveDemoFlow.tsx";
let text = fs.readFileSync(file, "utf8");

fs.copyFileSync(file, `${file}.before-cta-inside-intelligence-section`);

const ctaNeedle = "Show Me What Mine Could Look Like";
const ctaIndex = text.indexOf(ctaNeedle);
if (ctaIndex === -1) throw new Error("Could not find CTA block.");

const ctaStart = text.lastIndexOf("<section", ctaIndex);
const ctaEnd = text.indexOf("</section>", ctaIndex) + "</section>".length;
if (ctaStart === -1 || ctaEnd === -1) throw new Error("Could not isolate CTA section.");

let ctaBlock = text.slice(ctaStart, ctaEnd);
text = text.slice(0, ctaStart) + text.slice(ctaEnd);

// make the CTA feel like part of the intelligence box, not a footer billboard
ctaBlock = ctaBlock
  .replace('margin: "34px auto 42px"', 'margin: "28px 0 0"')
  .replace('margin: "70px auto 40px"', 'margin: "28px 0 0"')
  .replace('maxWidth: 1180,', 'maxWidth: "100%",')
  .replace('padding: "34px 24px"', 'padding: "26px 22px"')
  .replace('padding: "28px 22px"', 'padding: "26px 22px"')
  .replace('fontSize: "clamp(28px, 5vw, 52px)"', 'fontSize: "clamp(25px, 4vw, 40px)"')
  .replace('fontSize: "clamp(26px, 4vw, 42px)"', 'fontSize: "clamp(25px, 4vw, 40px)"');

// place it right below the intelligence action button
const boardButtonNeedle = "OPEN LIVE BUSINESS BOARD";
const boardButtonIndex = text.indexOf(boardButtonNeedle);
if (boardButtonIndex === -1) throw new Error("Could not find Open Live Business Board button.");

const linkCloseA = text.indexOf("</a>", boardButtonIndex);
const linkCloseLink = text.indexOf("</Link>", boardButtonIndex);

let insertAt = -1;
if (linkCloseA !== -1 && (linkCloseLink === -1 || linkCloseA < linkCloseLink)) {
  insertAt = linkCloseA + "</a>".length;
} else if (linkCloseLink !== -1) {
  insertAt = linkCloseLink + "</Link>".length;
}

if (insertAt === -1) throw new Error("Could not find closing tag after Open Live Business Board.");

text = text.slice(0, insertAt) + "\n" + ctaBlock + "\n" + text.slice(insertAt);

fs.writeFileSync(file, text);
console.log("Moved CTA inside intelligence section.");
