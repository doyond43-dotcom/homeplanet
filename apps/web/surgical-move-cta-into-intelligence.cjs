const fs = require("fs");

const file = "src/pages/HomeServicesLiveDemoFlow.tsx";
let text = fs.readFileSync(file, "utf8");

fs.copyFileSync(file, `${file}.before-surgical-cta-move-into-intelligence`);

// 1) Grab the existing CTA block
const ctaNeedle = "Show Me What Mine Could Look Like";
const ctaIndex = text.indexOf(ctaNeedle);
if (ctaIndex === -1) throw new Error("CTA not found.");

const ctaStart = text.lastIndexOf("<section", ctaIndex);
const ctaEnd = text.indexOf("</section>", ctaIndex) + "</section>".length;
if (ctaStart === -1 || ctaEnd === -1) throw new Error("Could not isolate CTA section.");

let ctaBlock = text.slice(ctaStart, ctaEnd);

// 2) Remove it from the wrong spot
text = text.slice(0, ctaStart) + text.slice(ctaEnd);

// 3) Compact the CTA so it belongs under the intelligence cards
ctaBlock = ctaBlock
  .replace(/margin: "[^"]*"/, 'margin: "28px 0 0"')
  .replace(/maxWidth: 1180,/, 'maxWidth: "100%",')
  .replace(/padding: "[^"]*"/, 'padding: "24px 22px"')
  .replace(/fontSize: "clamp\([^"]+\)"/, 'fontSize: "clamp(24px, 4vw, 38px)"');

// 4) Find the specific lower intelligence button
const intelligenceStart = text.indexOf("Every click starts telling the business what to do next.");
if (intelligenceStart === -1) throw new Error("Business Intelligence section not found.");

const boardButton = text.indexOf("Open Live Business Board", intelligenceStart);
if (boardButton === -1) throw new Error("Open Live Business Board button not found.");

// This exact closing pattern is the end of the Live Suggestions box/grid
const afterButton = text.indexOf("</a>", boardButton);
if (afterButton === -1) throw new Error("Could not find close of Open Live Business Board link.");

const gridClosePattern = "</a>\n              </div>\n            </div>";
const gridClose = text.indexOf(gridClosePattern, afterButton);
if (gridClose === -1) throw new Error("Could not find intelligence grid close after board button.");

const insertAt = gridClose + gridClosePattern.length;

// 5) Insert CTA right under the two intelligence boxes, inside that section
text = text.slice(0, insertAt) + "\n" + ctaBlock + "\n" + text.slice(insertAt);

fs.writeFileSync(file, text);
console.log("CTA moved under Business Intelligence cards.");
