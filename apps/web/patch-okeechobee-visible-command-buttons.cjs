const fs = require("fs");

const path = "src/pages/OkeechobeeCommandCenter.tsx";
let text = fs.readFileSync(path, "utf8");

const oldHeroEnd = `          <div style={{
            color: "#999",
            marginTop: 8,
          }}>
            Active projects, volunteers, needs, and community response.
          </div>
        </div>`;

const newHeroEnd = `          <div style={{
            color: "#999",
            marginTop: 8,
          }}>
            Active projects, volunteers, needs, and community response.
          </div>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 20,
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
                background: "#050505",
                color: "#fff",
                border: "1px solid #333",
              }}
            >
              Public Projects Page
            </Link>
          </div>
        </div>`;

if (!text.includes("Submit New Need")) {
  if (!text.includes(oldHeroEnd)) {
    throw new Error("Visible hero block not found. Stop and paste lines 145-185.");
  }

  text = text.replace(oldHeroEnd, newHeroEnd);
}

text = text.replaceAll("View Project", "Open Project Workspace");

fs.writeFileSync(path, text);
console.log("Visible command center buttons added. Project buttons renamed.");
