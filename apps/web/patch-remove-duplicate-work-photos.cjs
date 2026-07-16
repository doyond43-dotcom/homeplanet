const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-remove-duplicate-work-photos", raw);

const firstWorkText = '                  WORK / PHOTOS';
const firstWorkLabel = raw.indexOf(firstWorkText);
const secondWorkLabel = raw.indexOf(firstWorkText, firstWorkLabel + 1);

if (firstWorkLabel === -1 || secondWorkLabel === -1) {
  throw new Error("Expected two WORK / PHOTOS blocks, but did not find two.");
}

const firstWorkStart = raw.lastIndexOf('              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">', firstWorkLabel);
const secondWorkStart = raw.lastIndexOf('              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">', secondWorkLabel);

if (firstWorkStart === -1 || secondWorkStart === -1 || secondWorkStart <= firstWorkStart) {
  throw new Error("Could not safely locate duplicate WORK / PHOTOS cards.");
}

raw = raw.slice(0, firstWorkStart) + raw.slice(secondWorkStart);

fs.writeFileSync(path, raw);
