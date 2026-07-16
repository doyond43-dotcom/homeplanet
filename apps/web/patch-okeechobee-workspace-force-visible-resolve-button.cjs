const fs = require("fs");

const path = "src/pages/OkeechobeeProjectWorkspace.tsx";
let text = fs.readFileSync(path, "utf8");

if (!text.includes("Mark Project Resolved")) {
  const target = `              <h2 style={{ color: "#39FF14", marginTop: 0 }}>
                Project Overview
              </h2>`;

  const insert = `              <h2 style={{ color: "#39FF14", marginTop: 0 }}>
                Project Overview
              </h2>

              {project?.status === "Resolved" ? (
                <div
                  style={{
                    display: "inline-flex",
                    width: "fit-content",
                    marginBottom: 16,
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: "1px solid rgba(250, 204, 21, 0.45)",
                    background: "rgba(250, 204, 21, 0.10)",
                    color: "#fde68a",
                    fontWeight: 900,
                  }}
                >
                  Project Resolved
                </div>
              ) : (
                <button
                  onClick={resolveProject}
                  disabled={isResolvingProject}
                  style={{
                    width: "fit-content",
                    marginBottom: 16,
                    padding: "11px 16px",
                    borderRadius: 999,
                    border: "1px solid rgba(57, 255, 20, 0.55)",
                    background: "rgba(57, 255, 20, 0.12)",
                    color: "#39FF14",
                    fontWeight: 900,
                    cursor: isResolvingProject ? "not-allowed" : "pointer",
                    boxShadow: "0 0 18px rgba(57, 255, 20, 0.10)",
                  }}
                >
                  {isResolvingProject ? "Resolving..." : "Mark Project Resolved"}
                </button>
              )}`;

  if (!text.includes(target)) {
    throw new Error("Project Overview heading target not found.");
  }

  text = text.replace(target, insert);
}

fs.writeFileSync(path, text);
console.log("Visible resolve button inserted under Project Overview.");
