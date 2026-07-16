const fs = require("fs");

const path = "src/pages/OkeechobeeTogetherPage.tsx";
let text = fs.readFileSync(path, "utf8");

if (!text.includes("function projectAgeLabel")) {
  const insertAfter = /function previewText[\s\S]*?\n}\r?\n/;

  const helpers = `
function projectAgeLabel(event: any) {
  const rawDate = event.created_at || event.createdAt || event.updated_at || event.updatedAt;

  if (!rawDate) return "Recently posted";

  const created = new Date(rawDate);
  if (Number.isNaN(created.getTime())) return "Recently posted";

  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const daysOpen = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  if (daysOpen <= 3) return "Posted today";
  if (daysOpen <= 6) return "This week";
  if (daysOpen <= 13) return "1 week open";
  if (daysOpen <= 20) return "2 weeks open";
  return "3+ weeks open";
}

function isNewProject(event: any) {
  const rawDate = event.created_at || event.createdAt || event.updated_at || event.updatedAt;

  if (!rawDate) return false;

  const created = new Date(rawDate);
  if (Number.isNaN(created.getTime())) return false;

  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const daysOpen = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  return daysOpen <= 3;
}
`;

  if (!insertAfter.test(text)) {
    throw new Error("Could not find previewText function to insert age helpers.");
  }

  text = text.replace(insertAfter, (match) => match + helpers);
}

const oldBlock = `<div style={styles.metaRow}>
                      <span style={styles.metaItem}>Local Need</span>
                      <span style={styles.metaItem}>{helperCount(event)} Helpers Joined</span>
                      <span style={styles.metaItem}>Community Responding</span>
                    </div>`;

const newBlock = `<div style={styles.metaRow}>
                      <span style={styles.metaItem}>Local Need</span>
                      {isNewProject(event) && (
                        <span style={styles.newBadge}>NEW</span>
                      )}
                      <span style={styles.urgencyItem}>{projectAgeLabel(event)}</span>
                      <span style={styles.metaItem}>{helperCount(event)} Helpers Joined</span>
                      <span style={styles.metaItem}>Community Responding</span>
                    </div>`;

if (!text.includes(newBlock)) {
  if (!text.includes(oldBlock)) {
    throw new Error("Could not find active project meta row block.");
  }

  text = text.replace(oldBlock, newBlock);
}

if (!text.includes("newBadge:")) {
  const marker = `metaItem: {
    fontSize: 12,
    fontWeight: 800,
    color: "#bdbdbd",
  },`;

  const replacement = `metaItem: {
    fontSize: 12,
    fontWeight: 800,
    color: "#bdbdbd",
  },

  newBadge: {
    fontSize: 11,
    fontWeight: 1000,
    letterSpacing: 0.8,
    color: "#061400",
    background: "#39ff14",
    borderRadius: 999,
    padding: "4px 8px",
    boxShadow: "0 0 14px rgba(57,255,20,0.35)",
  },

  urgencyItem: {
    fontSize: 12,
    fontWeight: 900,
    color: "#39ff14",
  },`;

  if (!text.includes(marker)) {
    throw new Error("Could not find metaItem style block.");
  }

  text = text.replace(marker, replacement);
}

fs.writeFileSync(path, text);
console.log("Added NEW badge and open-age labels to active project cards.");
