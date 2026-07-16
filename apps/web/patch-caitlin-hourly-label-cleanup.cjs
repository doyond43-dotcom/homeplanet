const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-hourly-label-cleanup", raw);

// Make money output safer so dollar signs always show.
raw = raw.replace(
/return `\$\$\{Math\.round\(rateNumber \* hoursNumber\)\}`;/,
'return "$" + Math.round(rateNumber * hoursNumber);'
);

raw = raw.replace(
/return `\$\{Math\.round\(rateNumber \* hoursNumber\)\}`;/,
'return "$" + Math.round(rateNumber * hoursNumber);'
);

// Cleaner estimate label.
raw = raw.replaceAll("Rate / Est. Hours", "Hourly Rate / Estimated Hours");

// Clearer payment label.
raw = raw.replaceAll("Actual Hours</span>", "Actual Hours Worked</span>");

// Make estimate helper language clearer.
raw = raw.replaceAll("Estimated time:", "Estimated hours:");
raw = raw.replaceAll("Actual time:", "Actual hours worked:");

fs.writeFileSync(path, raw);
