const fs = require("fs");

const path = "src/pages/OkeechobeeProjectWorkspace.tsx";
let text = fs.readFileSync(path, "utf8");

const startMarker = "              {/* VISIBLE_RESOLVE_BUTTON_DIRECT_RENDER */}";
const endMarker = `              <p>
                Live project workspace for volunteers, materials,
                assignments, and community coordination.
              </p>`;

const start = text.indexOf(startMarker);
const end = text.indexOf(endMarker, start);

if (start !== -1 && end !== -1) {
  text = text.slice(0, start) + text.slice(end);
  console.log("Removed lower Project Overview resolve button.");
} else {
  console.log("Lower resolve button block not found. No change made.");
}

fs.writeFileSync(path, text);
