const fs = require("fs");

const path = "src/pages/OkeechobeeProjectWorkspace.tsx";
let text = fs.readFileSync(path, "utf8");

const marker = "VISIBLE_RESOLVE_BUTTON_DIRECT_RENDER";

if (!text.includes(marker)) {
  const lines = text.split(/\r?\n/);

  const overviewIndex = lines.findIndex((line) => line.includes("Project Overview"));

  if (overviewIndex === -1) {
    throw new Error("Project Overview text not found.");
  }

  let insertAfterIndex = -1;

  for (let i = overviewIndex; i < Math.min(overviewIndex + 10, lines.length); i++) {
    if (lines[i].includes("</h2>")) {
      insertAfterIndex = i;
      break;
    }
  }

  if (insertAfterIndex === -1) {
    throw new Error("Project Overview closing h2 not found.");
  }

  const block = [
    "",
    "              {/* VISIBLE_RESOLVE_BUTTON_DIRECT_RENDER */}",
    "              {project?.status === \"Resolved\" ? (",
    "                <div",
    "                  style={{",
    "                    display: \"inline-flex\",",
    "                    width: \"fit-content\",",
    "                    marginTop: 8,",
    "                    marginBottom: 16,",
    "                    padding: \"10px 14px\",",
    "                    borderRadius: 999,",
    "                    border: \"1px solid rgba(250, 204, 21, 0.5)\",",
    "                    background: \"rgba(250, 204, 21, 0.12)\",",
    "                    color: \"#fde68a\",",
    "                    fontWeight: 900,",
    "                  }}",
    "                >",
    "                  Project Resolved",
    "                </div>",
    "              ) : (",
    "                <button",
    "                  onClick={resolveProject}",
    "                  disabled={isResolvingProject}",
    "                  style={{",
    "                    display: \"inline-flex\",",
    "                    width: \"fit-content\",",
    "                    marginTop: 8,",
    "                    marginBottom: 16,",
    "                    padding: \"11px 16px\",",
    "                    borderRadius: 999,",
    "                    border: \"1px solid rgba(57, 255, 20, 0.65)\",",
    "                    background: \"rgba(57, 255, 20, 0.14)\",",
    "                    color: \"#39FF14\",",
    "                    fontWeight: 900,",
    "                    cursor: isResolvingProject ? \"not-allowed\" : \"pointer\",",
    "                    boxShadow: \"0 0 22px rgba(57, 255, 20, 0.16)\",",
    "                  }}",
    "                >",
    "                  {isResolvingProject ? \"Resolving...\" : \"Mark Project Resolved\"}",
    "                </button>",
    "              )}",
  ];

  lines.splice(insertAfterIndex + 1, 0, ...block);
  text = lines.join("\n");
}

fs.writeFileSync(path, text);
console.log("Direct visible resolve control inserted after Project Overview heading.");
