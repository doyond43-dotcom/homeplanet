const fs = require("fs");

const path = "src/pages/OkeechobeeTogetherPage.tsx";
let text = fs.readFileSync(path, "utf8");

const previewBlock = `  function previewText(text: string) {
    const clean = String(text || "").replace(/\\s+/g, " ").trim();
    if (clean.length <= 155) return clean;
    return clean.slice(0, 155).trim() + "...";
  }
`;

const helperBlock = `  function previewText(text: string) {
    const clean = String(text || "").replace(/\\s+/g, " ").trim();
    if (clean.length <= 155) return clean;
    return clean.slice(0, 155).trim() + "...";
  }

  function projectAgeLabel(event: any) {
    const rawDate =
      event.created_at || event.createdAt || event.updated_at || event.updatedAt;

    if (!rawDate) return "Recently posted";

    const created = new Date(rawDate);
    if (Number.isNaN(created.getTime())) return "Recently posted";

    const diffMs = new Date().getTime() - created.getTime();
    const daysOpen = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    if (daysOpen <= 1) return "Posted today";
    if (daysOpen <= 3) return "New this week";
    if (daysOpen <= 6) return "This week";
    if (daysOpen <= 13) return "1 week open";
    if (daysOpen <= 20) return "2 weeks open";
    return "3+ weeks open";
  }

  function isNewProject(event: any) {
    const rawDate =
      event.created_at || event.createdAt || event.updated_at || event.updatedAt;

    if (!rawDate) return false;

    const created = new Date(rawDate);
    if (Number.isNaN(created.getTime())) return false;

    const diffMs = new Date().getTime() - created.getTime();
    const daysOpen = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    return daysOpen <= 3;
  }
`;

if (!text.includes("function projectAgeLabel")) {
  if (!text.includes(previewBlock)) {
    throw new Error("Could not find exact previewText block.");
  }

  text = text.replace(previewBlock, helperBlock);
}

const activeMetaRegex =
  /<div style=\{styles\.metaRow\}>\s*<span style=\{styles\.metaItem\}>Local Need<\/span>\s*<span style=\{styles\.metaItem\}>\{helperCount\(event\)\} Helpers Joined<\/span>\s*<span style=\{styles\.metaItem\}>Community Responding<\/span>\s*<\/div>/;

const activeMetaReplacement = `<div style={styles.metaRow}>
                      <span style={styles.metaItem}>Local Need</span>
                      {isNewProject(event) ? (
                        <span style={styles.newBadge}>NEW</span>
                      ) : null}
                      <span style={styles.urgencyItem}>
                        {projectAgeLabel(event)}
                      </span>
                      <span style={styles.metaItem}>{helperCount(event)} Helpers Joined</span>
                      <span style={styles.metaItem}>Community Responding</span>
                    </div>`;

if (!text.includes("styles.urgencyItem")) {
  if (!activeMetaRegex.test(text)) {
    throw new Error("Could not find active project meta row.");
  }

  text = text.replace(activeMetaRegex, activeMetaReplacement);
}

const metaItemBlock = `  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },`;

const badgeStyleBlock = `  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  newBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding: "3px 8px",
    background: "#39ff14",
    color: "#031000",
    fontSize: 11,
    fontWeight: 1000,
    letterSpacing: 0.8,
    boxShadow: "0 0 14px rgba(57,255,20,0.35)",
  },

  urgencyItem: {
    display: "inline-flex",
    alignItems: "center",
    color: "#39ff14",
    fontSize: 13,
    fontWeight: 900,
  },`;

if (!text.includes("newBadge:")) {
  if (!text.includes(metaItemBlock)) {
    throw new Error("Could not find exact metaItem style block.");
  }

  text = text.replace(metaItemBlock, badgeStyleBlock);
}

fs.writeFileSync(path, text);
console.log("Urgency badges added.");
