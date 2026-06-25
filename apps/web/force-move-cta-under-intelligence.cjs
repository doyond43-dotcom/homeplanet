const fs = require("fs");

const file = "src/pages/HomeServicesLiveDemoFlow.tsx";
let text = fs.readFileSync(file, "utf8");

fs.copyFileSync(file, `${file}.before-force-cta-under-intelligence`);

const ctaNeedle = "Show Me What Mine Could Look Like";
const ctaIndex = text.indexOf(ctaNeedle);
if (ctaIndex === -1) throw new Error("Could not find CTA block.");

const ctaStart = text.lastIndexOf("<section", ctaIndex);
const ctaEnd = text.indexOf("</section>", ctaIndex) + "</section>".length;
if (ctaStart === -1 || ctaEnd === -1) throw new Error("Could not isolate CTA section.");

let ctaBlock = text.slice(ctaStart, ctaEnd);

// remove CTA from current wrong spot
text = text.slice(0, ctaStart) + text.slice(ctaEnd);

// compact it so it belongs inside the intelligence area
ctaBlock = ctaBlock
  .replace(/margin: "[^"]*"/, 'margin: "28px 0 0"')
  .replace(/maxWidth: 1180,/, 'maxWidth: "100%",')
  .replace(/padding: "[^"]*"/, 'padding: "24px 22px"')
  .replace(/fontSize: "clamp\([^"]+\)"/, 'fontSize: "clamp(24px, 4vw, 38px)"');

// find the BUSINESS INTELLIGENCE section, then the OPEN LIVE BUSINESS BOARD button inside it
const intelligenceIndex = text.indexOf("EVERY CLICK STARTS TELLING THE BUSINESS");
if (intelligenceIndex === -1) throw new Error("Could not find Business Intelligence headline.");

const boardButtonIndex = text.indexOf("OPEN LIVE BUSINESS BOARD", intelligenceIndex);
if (boardButtonIndex === -1) throw new Error("Could not find intelligence Open Live Business Board button.");

// insert after the enclosing Link/a/button close
const candidates = [
  text.indexOf("</Link>", boardButtonIndex),
  text.indexOf("</a>", boardButtonIndex),
  text.indexOf("</button>", boardButtonIndex),
].filter((n) => n !== -1).sort((a, b) => a - b);

if (!candidates.length) throw new Error("Could not find close tag after intelligence board button.");

const closeIndex = candidates[0];
const closeTag =
  text.slice(closeIndex, closeIndex + 7).startsWith("</Link>")
    ? "</Link>"
    : text.slice(closeIndex, closeIndex + 4).startsWith("</a>")
      ? "</a>"
      : "</button>";

const insertAt = closeIndex + closeTag.length;

text = text.slice(0, insertAt) + "\n" + ctaBlock + "\n" + text.slice(insertAt);

fs.writeFileSync(file, text);
console.log("CTA moved under Business Intelligence button.");
