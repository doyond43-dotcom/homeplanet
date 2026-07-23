const fs = require("fs");

const path = "src/pages/OkeechobeeCommandCenter.tsx";
let text = fs.readFileSync(path, "utf8");

// Add top command buttons under the hero card if not already there.
if (!text.includes("Submit New Need")) {
  text = text.replace(
`        <h1 style={{ display: "none" }}>
          Okeechobee Together Command Center
        </h1>`,
`        <h1 style={{ display: "none" }}>
          Okeechobee Together Command Center
        </h1>

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}>
          <Link
            to="/planet/okeechobee/create-v2"
            style={styles.button}
          >
            Submit New Need
          </Link>

          <Link
            to="/planet/okeechobee"
            style={{
              ...styles.button,
              background: "#111",
              color: "#fff",
              border: "1px solid #333",
            }}
          >
            Public Projects Page
          </Link>
        </div>`
  );
}

// Rename the per-project workspace button.
text = text.replaceAll(">View Project<", ">Open Project Workspace<");

fs.writeFileSync(path, text);
console.log("Added command center buttons and renamed project workspace links.");
