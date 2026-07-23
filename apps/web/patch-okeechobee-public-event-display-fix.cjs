const fs = require("fs");

const path = "src/pages/OkeechobeeEventPage.tsx";
let text = fs.readFileSync(path, "utf8");

// Helper count: only count confirmed "joined as" timeline records.
// This keeps Brock visible in the timeline but does not count him as a confirmed helper.
text = text.replace(
/const helperCount = \(event\.timeline \|\| \[\]\)\.filter\(\(item: any\) =>[\s\S]*?\)\.length;/,
`const helperCount = (event.timeline || []).filter((item: any) =>
    String(item.label || "").toLowerCase().includes(" joined as ")
  ).length;`
);

// Add safe display formatter for Looking For objects.
if (!text.includes("function formatLookingForItem")) {
  text = text.replace(
`  async function markResolved() {`,
`  function formatLookingForItem(item: any) {
    if (typeof item === "string") return item;

    if (item && typeof item === "object") {
      return (
        item.title ||
        item.label ||
        item.name ||
        item.text ||
        item.value ||
        item.need ||
        item.type ||
        item.description ||
        ""
      );
    }

    return String(item || "");
  }

  async function markResolved() {`
  );
}

// Replace object joins so Looking For does not print [object Object].
text = text.replaceAll(
`{event.looking_for?.join(" - ")}`,
`{(event.looking_for || []).map(formatLookingForItem).filter(Boolean).join(" - ")}`
);

text = text.replaceAll(
`{event.lookingFor?.join(" - ")}`,
`{(event.lookingFor || []).map(formatLookingForItem).filter(Boolean).join(" - ")}`
);

text = text.replaceAll(
`{event.needs?.join(" - ")}`,
`{(event.needs || []).map(formatLookingForItem).filter(Boolean).join(" - ")}`
);

text = text.replaceAll(
`{event.looking_for.join(" - ")}`,
`{(event.looking_for || []).map(formatLookingForItem).filter(Boolean).join(" - ")}`
);

text = text.replaceAll(
`{event.lookingFor.join(" - ")}`,
`{(event.lookingFor || []).map(formatLookingForItem).filter(Boolean).join(" - ")}`
);

text = text.replaceAll(
`{event.needs.join(" - ")}`,
`{(event.needs || []).map(formatLookingForItem).filter(Boolean).join(" - ")}`
);

fs.writeFileSync(path, text);
console.log("Fixed public event page helper count and Looking For display.");
