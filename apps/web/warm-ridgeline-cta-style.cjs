const fs = require("fs");

const file = "src/pages/HomeServicesLiveDemoFlow.tsx";
let text = fs.readFileSync(file, "utf8");

fs.copyFileSync(file, `${file}.before-warm-ridgeline-cta-style`);

const needle = "Show Me What Mine Could Look Like";
const idx = text.indexOf(needle);
if (idx === -1) throw new Error("CTA not found.");

const start = text.lastIndexOf("<section", idx);
const end = text.indexOf("</section>", idx) + "</section>".length;
if (start === -1 || end === -1) throw new Error("Could not isolate CTA section.");

let block = text.slice(start, end);

block = block
  // Card: warm truck/Ridgeline colors, not green box
  .replace(
    /border: "1px solid rgba\([^)]+\)"/,
    'border: "1px solid rgba(255,122,24,0.34)"'
  )
  .replace(
    /background: "linear-gradient\([^"]+\)"/,
    'background: "linear-gradient(135deg, rgba(255,122,24,0.16), rgba(110,54,16,0.18), rgba(0,0,0,0.90))"'
  )
  .replace(
    /boxShadow: "[^"]*"/,
    'boxShadow: "0 30px 100px rgba(0,0,0,0.58), 0 0 70px rgba(255,122,24,0.16)"'
  )

  // Keep HomePlanet as a small green signature only
  .replace(
    /color: "#39ff88"/,
    'color: "#39ff88"'
  )

  // Button: amber/gold-orange, not yellow-green
  .replace(
    /background: "#f6b84a"/,
    'background: "linear-gradient(135deg, #ffb347, #ff7a18)"'
  )
  .replace(
    /boxShadow: "0 18px 48px rgba\(246,184,74,0\.32\)"/,
    'boxShadow: "0 18px 48px rgba(255,122,24,0.34)"'
  );

text = text.slice(0, start) + block + text.slice(end);

fs.writeFileSync(file, text);
console.log("CTA warmed back into Ridgeline truck colors with HomePlanet green signature.");
