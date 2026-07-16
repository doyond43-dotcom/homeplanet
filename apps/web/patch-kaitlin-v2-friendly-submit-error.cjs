const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsLandingV2.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-friendly-submit-error", raw);

raw = raw.replace(
`      const message = error instanceof Error ? error.message : JSON.stringify(error);
      setQuoteError(\`Submit error: \${message}\`);`,
`      const message = error instanceof Error ? error.message : JSON.stringify(error);
      console.error("Only The Essentials quote request failed details:", message);
      setQuoteError("Something went wrong sending your request. Please text Kaitlin directly at 863-801-3179.");`
);

fs.writeFileSync(path, raw);
