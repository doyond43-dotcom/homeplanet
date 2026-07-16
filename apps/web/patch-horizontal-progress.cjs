const fs = require("fs");

const path = "src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

// Replace the Ride Status heading.
text = text.replace(
  /Ride Status/g,
  "Ride Progress"
);

// Replace the old status section with a compact horizontal progress.
const progressRegex = /<div className="[^"]*">[\s\S]*?Current Status[\s\S]*?<\/div>\s*<\/div>/;

const progressBlock = `
<div className="rounded-3xl border border-white/10 bg-black/40 p-5">

  <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
    Ride Progress
  </p>

  <div className="mt-5 flex justify-between text-[11px] font-bold text-zinc-400">
    <span>Waiting</span>
    <span>En Route</span>
    <span>Picked Up</span>
    <span>Arrived</span>
    <span>Paid</span>
  </div>

  <div className="mt-3 text-center font-mono text-emerald-300">
    ?----?----?----?----?
  </div>

  <p className="mt-4 text-center text-sm font-bold text-white">
    Current: {selectedRide.status}
  </p>

</div>
`;

text = text.replace(progressRegex, progressBlock);

fs.writeFileSync(path, text);

console.log("Horizontal Ride Progress installed.");
