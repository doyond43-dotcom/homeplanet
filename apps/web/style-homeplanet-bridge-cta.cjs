const fs = require("fs");

const file = "src/pages/HomeServicesLiveDemoFlow.tsx";
let text = fs.readFileSync(file, "utf8");

fs.copyFileSync(file, `${file}.before-homeplanet-bridge-cta-style`);

const needle = "Show Me What Mine Could Look Like";
const idx = text.indexOf(needle);
if (idx === -1) throw new Error("CTA button not found.");

const start = text.lastIndexOf("<section", idx);
const end = text.indexOf("</section>", idx) + "</section>".length;
if (start === -1 || end === -1) throw new Error("Could not isolate CTA section.");

let block = text.slice(start, end);

// Make the CTA span/center under the intelligence area
if (!block.includes('gridColumn: "1 / -1"')) {
  block = block.replace(
    /style=\{\{\s*/,
    `style={{
          gridColumn: "1 / -1",
          width: "min(100%, 980px)",
          justifySelf: "center",
          `
  );
}

// Card: dark glass, HomePlanet green edge/glow, slightly larger
block = block
  .replace(/margin: "[^"]*"/, 'margin: "36px auto 0"')
  .replace(/maxWidth: ("100%"|1180|900),?/, 'maxWidth: 980,')
  .replace(/padding: "[^"]*"/, 'padding: "34px 28px"')
  .replace(
    /border: "1px solid rgba\([^)]+\)"/,
    'border: "1px solid rgba(57,255,136,0.34)"'
  )
  .replace(
    /background:\s*"[^"]*"/,
    'background: "linear-gradient(135deg, rgba(57,255,136,0.10), rgba(246,184,74,0.10), rgba(0,0,0,0.88))"'
  )
  .replace(
    /boxShadow: "[^"]*"/,
    'boxShadow: "0 30px 100px rgba(0,0,0,0.55), 0 0 70px rgba(57,255,136,0.14)"'
  )
  .replace(
    /color: "#ffb56b"/,
    'color: "#39ff88"'
  )
  .replace(
    /fontSize: "clamp\([^"]+\)"/,
    'fontSize: "clamp(28px, 4vw, 46px)"'
  )
  .replace(
    /margin: "14px auto 22px"/,
    'margin: "16px auto 26px"'
  )
  .replace(
    /margin: "16px auto 24px"/,
    'margin: "16px auto 26px"'
  );

// Button: gold action button, bigger and more clickable
block = block
  .replace(/minHeight: \d+/, 'minHeight: 62')
  .replace(/padding: "0 \d+px"/, 'padding: "0 36px"')
  .replace(/background: "#ff7a18"/, 'background: "#f6b84a"')
  .replace(/color: "#120805"/, 'color: "#160d03"')
  .replace(/fontSize: \d+/, 'fontSize: 16')
  .replace(
    /boxShadow: "0 18px 45px rgba\([^)]+\)"/,
    'boxShadow: "0 18px 48px rgba(246,184,74,0.32)"'
  );

text = text.slice(0, start) + block + text.slice(end);

fs.writeFileSync(file, text);
console.log("Styled CTA as centered HomePlanet bridge card with gold button.");
