const fs = require("fs");

const path = "src/pages/OkeechobeeProjectWorkspace.tsx";
let text = fs.readFileSync(path, "utf8");

if (!text.includes("RENDER TEST - WORKSPACE FILE IS LIVE")) {
  text = text.replace(
    `<p style={{ color: "#aaa" }}>Project: {project.title}</p>`,
    `<p style={{ color: "#aaa" }}>Project: {project.title}</p>

          <div
            style={{
              margin: "18px 0",
              padding: 18,
              borderRadius: 16,
              border: "2px solid #39FF14",
              background: "rgba(57,255,20,0.15)",
              color: "#39FF14",
              fontWeight: 1000,
              fontSize: 22,
            }}
          >
            RENDER TEST - WORKSPACE FILE IS LIVE
          </div>`
  );
}

fs.writeFileSync(path, text);
console.log("Render test inserted.");
