const fs = require("fs");

const path = "src/pages/OkeechobeeCreateEventPageV2.tsx";
let text = fs.readFileSync(path, "utf8");

// Add Link import
text = text.replace(
  'import { useNavigate } from "react-router-dom";',
  'import { Link, useNavigate } from "react-router-dom";'
);

// Add back link at top of card
if (!text.includes('← Back to Okeechobee Together')) {
  text = text.replace(
    '<section className="okeechobee-create-card" style={styles.card}>',
    `<section className="okeechobee-create-card" style={styles.card}>
        <Link to="/planet/okeechobee" style={styles.backLink}>
          ← Back to Okeechobee Together
        </Link>`
  );

  text = text.replace(
    '<section style={styles.card}>',
    `<section style={styles.card}>
        <Link to="/planet/okeechobee" style={styles.backLink}>
          ← Back to Okeechobee Together
        </Link>`
  );
}

// Add style
if (!text.includes("backLink:")) {
  text = text.replace(
    '  kicker: {',
    `  backLink: {
    display: "inline-flex",
    color: "#39FF14",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 14,
    marginBottom: 22,
  },

  kicker: {`
  );
}

fs.writeFileSync(path, text);
console.log("Added back link to Okeechobee need form.");
