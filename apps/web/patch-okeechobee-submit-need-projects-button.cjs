const fs = require("fs");

const path = "src/pages/OkeechobeeTogetherPage.tsx";
let text = fs.readFileSync(path, "utf8");

const target = `              <div>
                <h2
                  style={{
                    fontSize: 28,
                    margin: 0,
                    paddingLeft: 12,
                    borderLeft: "4px solid #7CFF6B",
                  }}
                >
                  Active Projects
                </h2>
              </div>
            </div>`;

const replacement = `              <div>
                <h2
                  style={{
                    fontSize: 28,
                    margin: 0,
                    paddingLeft: 12,
                    borderLeft: "4px solid #7CFF6B",
                  }}
                >
                  Active Projects
                </h2>
              </div>

              <Link
                to="/planet/okeechobee/create-v2"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: "#39FF14",
                  color: "#050505",
                  fontWeight: 900,
                  textDecoration: "none",
                  boxShadow: "0 0 22px rgba(57, 255, 20, 0.18)",
                  whiteSpace: "nowrap",
                }}
              >
                Submit A Need
              </Link>
            </div>`;

if (!text.includes(target)) {
  throw new Error("Active Projects header block not found. Stop and inspect the file.");
}

text = text.replace(target, replacement);

fs.writeFileSync(path, text);
console.log("Added Submit A Need button to Active Projects section.");
