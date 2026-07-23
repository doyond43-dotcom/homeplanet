const fs = require("fs");

const path = "src/pages/OkeechobeeEventPage.tsx";
let text = fs.readFileSync(path, "utf8");

// Fix helper count so "offered to help" does not count as a confirmed helper.
text = text.replace(
`  const helperCount = (event.timeline || []).filter((item: any) =>
    String(item.label || "").toLowerCase().includes("help") ||
    String(item.label || "").toLowerCase().includes("joined")
  ).length;`,
`  const helperCount = (event.timeline || []).filter((item: any) =>
    String(item.label || "").toLowerCase().includes(" joined as ")
  ).length;`
);

// Add a safe formatter for Looking For values so objects don't render as [object Object].
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
        JSON.stringify(item)
      );
    }

    return String(item || "");
  }

  async function markResolved() {`
  );
}

// Fix the most common broken Looking For render pattern.
text = text.replace(
`{event.looking_for?.join(" - ")}`,
`{(event.looking_for || []).map(formatLookingForItem).join(" - ")}`
);

text = text.replace(
`{event.lookingFor?.join(" - ")}`,
`{(event.lookingFor || []).map(formatLookingForItem).join(" - ")}`
);

text = text.replace(
`{event.needs?.join(" - ")}`,
`{(event.needs || []).map(formatLookingForItem).join(" - ")}`
);

fs.writeFileSync(path, text);
console.log("Public event page helper count and Looking For display fixed.");
