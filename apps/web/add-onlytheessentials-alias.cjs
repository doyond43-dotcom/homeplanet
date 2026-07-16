const fs = require("fs");

const candidates = [
  "./src/App.tsx",
  "./src/planet/PlanetRoutes.tsx",
];

const oldPath = "/planet/only-the-essentials/v2";
const newPath = "/onlytheessentials";

let changed = false;

for (const file of candidates) {
  if (!fs.existsSync(file)) continue;

  let raw = fs.readFileSync(file, "utf8");

  if (!raw.includes(oldPath)) continue;

  console.log(`Found live route in: ${file}`);

  if (raw.includes(newPath)) {
    console.log(`Alias already exists in: ${file}`);
    changed = true;
    break;
  }

  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "");

  fs.copyFileSync(file, `${file}.before-onlytheessentials-alias-${stamp}`);

  const selfClosingRoute = new RegExp(
    `<Route([\\s\\S]*?)path=["']${oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']([\\s\\S]*?)/>`
  );

  const match = raw.match(selfClosingRoute);

  if (!match) {
    console.error(`Found the path in ${file}, but could not identify the full <Route /> block.`);
    console.error("Route context:");
    const index = raw.indexOf(oldPath);
    console.error(raw.slice(Math.max(0, index - 300), index + 500));
    process.exit(1);
  }

  const originalRoute = match[0];
  const aliasRoute = originalRoute.replace(oldPath, newPath);

  raw = raw.replace(originalRoute, `${originalRoute}\n${aliasRoute}`);

  fs.writeFileSync(file, raw, "utf8");

  console.log(`Added ${newPath} to ${file}`);
  changed = true;
  break;
}

if (!changed) {
  console.error(`Could not find ${oldPath} in App.tsx or PlanetRoutes.tsx.`);
  process.exit(1);
}
