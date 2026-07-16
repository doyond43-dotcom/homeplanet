const fs = require("fs");

const path = "src/pages/OkeechobeeTogetherPage.tsx";
let text = fs.readFileSync(path, "utf8");

const completedMetaRegex =
  /<div style=\{styles\.metaRow\}>\s*<span style=\{styles\.metaItem\}>Need Met<\/span>\s*<span style=\{styles\.metaItem\}>\{helperCount\(event\)\} Neighbors Helped<\/span>\s*<span style=\{styles\.metaItem\}>Community Success<\/span>\s*<\/div>/;

const completedMetaReplacement = `<div style={styles.metaRow}>
                      <span style={styles.metaItem}>Need Met</span>
                      <span style={styles.completedBadge}>COMPLETED</span>
                      <span style={styles.metaItem}>{helperCount(event)} Neighbors Helped</span>
                      <span style={styles.metaItem}>Community Success</span>
                    </div>`;

if (!text.includes("styles.completedBadge")) {
  if (!completedMetaRegex.test(text)) {
    throw new Error("Could not find completed project meta row.");
  }

  text = text.replace(completedMetaRegex, completedMetaReplacement);
}

const completedActionRegex =
  /<div style=\{styles\.cardActionRow\}>\s*<span>Outcome recorded<\/span>\s*<strong>View Outcome &gt;<\/strong>\s*<\/div>/;

const completedActionReplacement = `<div style={styles.completedActionRow}>
                      <span>Outcome recorded</span>
                      <strong>View Outcome &gt;</strong>
                    </div>`;

if (!text.includes("styles.completedActionRow")) {
  if (!completedActionRegex.test(text)) {
    throw new Error("Could not find completed action row.");
  }

  text = text.replace(completedActionRegex, completedActionReplacement);
}

const metaItemBlock = `  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },`;

const completedStyles = `  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  completedBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding: "4px 12px",
    border: "1px solid rgba(255,193,7,0.55)",
    background: "rgba(255,193,7,0.12)",
    color: "#ffd24a",
    fontSize: 12,
    fontWeight: 1000,
    letterSpacing: 1.4,
    boxShadow: "0 0 18px rgba(255,193,7,0.28)",
  },

  completedActionRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
    paddingTop: 14,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    color: "#ffc107",
    fontSize: 14,
    fontWeight: 900,
  },`;

if (!text.includes("completedBadge:")) {
  if (!text.includes(metaItemBlock)) {
    throw new Error("Could not find metaItem style block.");
  }

  text = text.replace(metaItemBlock, completedStyles);
}

fs.writeFileSync(path, text);
console.log("Completed project gold badge added.");
