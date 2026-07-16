const fs = require("fs");

const path = "src/pages/OkeechobeeProjectWorkspace.tsx";
let text = fs.readFileSync(path, "utf8");

const marker = "HEADER_RESOLVE_CONTROL_LOCKED";

const target = `          <p
            style={{
              color: "#999",
              marginTop: 8,
            }}
          >
            Project: {project?.title || slug}
          </p>`;

const insert = `          <p
            style={{
              color: "#999",
              marginTop: 8,
            }}
          >
            Project: {project?.title || slug}
          </p>

          {/* HEADER_RESOLVE_CONTROL_LOCKED */}
          {project?.status === "Resolved" ? (
            <div
              style={{
                display: "inline-flex",
                width: "fit-content",
                marginTop: 14,
                padding: "11px 16px",
                borderRadius: 999,
                border: "1px solid rgba(250, 204, 21, 0.5)",
                background: "rgba(250, 204, 21, 0.12)",
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
                display: "inline-flex",
                width: "fit-content",
                marginTop: 14,
                padding: "11px 16px",
                borderRadius: 999,
                border: "1px solid rgba(57, 255, 20, 0.75)",
                background: "rgba(57, 255, 20, 0.18)",
                color: "#39FF14",
                fontWeight: 900,
                cursor: isResolvingProject ? "not-allowed" : "pointer",
                boxShadow: "0 0 26px rgba(57, 255, 20, 0.2)",
              }}
            >
              {isResolvingProject ? "Resolving..." : "Mark Project Resolved"}
            </button>
          )}`;

if (!text.includes(marker)) {
  if (!text.includes(target)) {
    throw new Error("Exact header project title block not found.");
  }

  text = text.replace(target, insert);
}

fs.writeFileSync(path, text);
console.log("Header resolve control inserted directly under project title.");
