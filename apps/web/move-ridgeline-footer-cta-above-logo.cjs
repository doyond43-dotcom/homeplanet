const fs = require("fs");

const file = "src/pages/HomeServicesLiveDemoFlow.tsx";
let text = fs.readFileSync(file, "utf8");

fs.copyFileSync(file, `${file}.before-move-footer-cta-above-logo`);

const ctaNeedle = "Show Me What Mine Could Look Like";
const ctaIndex = text.indexOf(ctaNeedle);
if (ctaIndex === -1) throw new Error("Could not find footer CTA.");

const ctaStart = text.lastIndexOf("<section", ctaIndex);
const ctaEnd = text.indexOf("</section>", ctaIndex) + "</section>".length;
if (ctaStart === -1 || ctaEnd === -1) throw new Error("Could not isolate footer CTA section.");

const ctaBlock = text.slice(ctaStart, ctaEnd);
text = text.slice(0, ctaStart) + text.slice(ctaEnd);

const footerNeedle = "Powered by HomePlanet Live Systems";
const footerIndex = text.indexOf(footerNeedle);
if (footerIndex === -1) throw new Error("Could not find Ridgeline footer logo block.");

let insertAt = text.lastIndexOf("<section", footerIndex);
if (insertAt === -1) insertAt = text.lastIndexOf("<footer", footerIndex);
if (insertAt === -1) throw new Error("Could not find footer block start.");

const compactCta = ctaBlock
  .replace('margin: "70px auto 40px"', 'margin: "34px auto 42px"')
  .replace('padding: "34px 24px"', 'padding: "28px 22px"')
  .replace('fontSize: "clamp(28px, 5vw, 52px)"', 'fontSize: "clamp(26px, 4vw, 42px)"')
  .replace('margin: "16px auto 24px"', 'margin: "14px auto 22px"');

text = text.slice(0, insertAt) + compactCta + "\n\n" + text.slice(insertAt);

fs.writeFileSync(file, text);
console.log("Moved HomePlanet CTA above Ridgeline footer logo.");
