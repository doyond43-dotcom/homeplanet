const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-review-helper-hotfix", raw);

if (!raw.includes("function buildReviewText(")) {
  const helper = `function buildReviewText(signal: Signal) {
  return \`Hi \${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

Thank you again for choosing me for your cleaning.

If everything looked good, I would really appreciate a quick review when you have a minute.

Your feedback helps other local families know they can trust Only The Essentials Cleaning.

Thank you.\`;
}

`;

  const insertBefore = raw.indexOf("function buildProofPostText(");

  if (insertBefore !== -1) {
    raw = raw.slice(0, insertBefore) + helper + raw.slice(insertBefore);
  } else {
    const fallback = raw.indexOf("function buildPaymentText(");
    if (fallback === -1) throw new Error("Could not find a safe place to insert buildReviewText.");
    raw = raw.slice(0, fallback) + helper + raw.slice(fallback);
  }
}

fs.writeFileSync(path, raw);
