const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-node-hourly-hotfix", raw);

if (!raw.includes("function moneyFromHours(")) {
  const helper = `function moneyFromHours(rate: string, hours: string) {
  const rateNumber = Number.parseFloat(rate || "0");
  const hoursNumber = Number.parseFloat(hours || "0");

  if (!Number.isFinite(rateNumber) || !Number.isFinite(hoursNumber)) {
    return "$0";
  }

  return \`$\${Math.round(rateNumber * hoursNumber)}\`;
}

`;

  raw = raw.replace("function buildEstimateText", helper + "function buildEstimateText");
}

const start = raw.indexOf("function buildEstimateText(");
const end = raw.indexOf("\n\nfunction buildAgreementText(", start);

if (start === -1 || end === -1) {
  throw new Error("Could not find buildEstimateText block.");
}

const hourlyEstimate = `function buildEstimateText(signal: Signal, hourlyRate = "40", estimatedLowHours = "4", estimatedHighHours = "6") {
  const lowTotal = moneyFromHours(hourlyRate, estimatedLowHours);
  const highTotal = moneyFromHours(hourlyRate, estimatedHighHours);

  return \`Hi \${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

I reviewed your cleaning request:

Service: \${signal.service}
Home: \${signal.home}
Condition: \${signal.condition}
Pets: \${signal.pets}
Preferred time: \${signal.preferred}

My rate is $\${hourlyRate}/hr.
Estimated time: \${estimatedLowHours}-\${estimatedHighHours} hours
Estimated total: \${lowTotal}-\${highTotal}

I can help with this. I’ll confirm the final time based on the home details, condition, and any photos/notes you sent.\`;
}`;

raw = raw.slice(0, start) + hourlyEstimate + raw.slice(end);

fs.writeFileSync(path, raw);
