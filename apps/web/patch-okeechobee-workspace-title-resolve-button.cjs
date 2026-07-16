const fs = require("fs");

const path = "src/pages/OkeechobeeProjectWorkspace.tsx";
let text = fs.readFileSync(path, "utf8");

const marker = "TITLE_LEVEL_RESOLVE_BUTTON_LOCKED";

if (!text.includes(marker)) {
  const lines = text.split(/\r?\n/);

  const titleLineIndex = lines.findIndex((line) =>
    line.includes("Project:") && line.includes("project.title")
  );

  if (titleLineIndex === -1) {
    throw new Error("Project title line not found.");
  }

  const block = [
    "",
    "          {/* TITLE_LEVEL_RESOLVE_BUTTON_LOCKED */}",
    "          {project?.status === \"Resolved\" ? (",
    "            <div",
    "              style={{",
    "                display: \"inline-flex\",",
    "                width: \"fit-content\",",
    "                margin: \"12px 0 18px\",",
    "                padding: \"11px 16px\",",
    "                borderRadius: 999,",
    "                border: \"1px solid rgba(250, 204, 21, 0.5)\",",
    "                background: \"rgba(250, 204, 21, 0.12)\",",
    "                color: \"#fde68a\",",
    "                fontWeight: 900,",
    "              }}",
    "            >",
    "              Project Resolved",
    "            </div>",
    "          ) : (",
    "            <button",
    "              onClick={resolveProject}",
    "              disabled={isResolvingProject}",
    "              style={{",
    "                display: \"inline-flex\",",
    "                width: \"fit-content\",",
    "                margin: \"12px 0 18px\",",
    "                padding: \"11px 16px\",",
    "                borderRadius: 999,",
    "                border: \"1px solid rgba(57, 255, 20, 0.7)\",",
    "                background: \"rgba(57, 255, 20, 0.16)\",",
    "                color: \"#39FF14\",",
    "                fontWeight: 900,",
    "                cursor: isResolvingProject ? \"not-allowed\" : \"pointer\",",
    "                boxShadow: \"0 0 24px rgba(57, 255, 20, 0.18)\",",
    "              }}",
    "            >",
    "              {isResolvingProject ? \"Resolving...\" : \"Mark Project Resolved\"}",
    "            </button>",
    "          )}",
  ];

  lines.splice(titleLineIndex + 1, 0, ...block);
  text = lines.join("\n");
}

fs.writeFileSync(path, text);
console.log("Resolve button inserted directly under project title.");
