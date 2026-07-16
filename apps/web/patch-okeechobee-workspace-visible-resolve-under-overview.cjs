const fs = require("fs");

const path = "src/pages/OkeechobeeProjectWorkspace.tsx";
let text = fs.readFileSync(path, "utf8");

const target = `              <p>
                Live project workspace for volunteers, materials,
                assignments, and community coordination.
              </p>

              <hr style={{ borderColor: "#222" }} />`;

const insert = `              <p>
                Live project workspace for volunteers, materials,
                assignments, and community coordination.
              </p>

              {project?.status === "Resolved" ? (
                <div
                  style={{
                    display: "inline-flex",
                    width: "fit-content",
                    marginTop: 8,
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
                    marginTop: 8,
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
              )}

              <hr style={{ borderColor: "#222" }} />`;

if (!text.includes(target)) {
  throw new Error("Exact Project Overview paragraph target not found.");
}

if (!text.includes("Mark Project Resolved")) {
  text = text.replace(target, insert);
}

fs.writeFileSync(path, text);
console.log("Visible resolve button inserted under Project Overview paragraph.");
