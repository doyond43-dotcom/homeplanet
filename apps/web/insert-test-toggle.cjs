const fs = require("fs");

const path = "src/pages/HomePlanetMarketAwarenessFunnelV1.tsx";
let s = fs.readFileSync(path, "utf8");

if (s.includes("Show Test Leads")) {
  console.log("Toggle already exists. No change needed.");
  process.exit(0);
}

const marker = "          {visibleLeadSubmissions.length === 0 ? (";

const toggle = `          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <div style={{ color: "#8fa59a", fontSize: 13, fontWeight: 850 }}>
              Showing {visibleLeadSubmissions.length} clean lead{visibleLeadSubmissions.length === 1 ? "" : "s"}
              {!showTestLeads && leadSubmissions.length !== visibleLeadSubmissions.length
                ? \` · \${leadSubmissions.length - visibleLeadSubmissions.length} test hidden\`
                : ""}
            </div>

            <button
              type="button"
              onClick={() => setShowTestLeads((value) => !value)}
              style={{
                border: "1px solid rgba(148,163,184,0.35)",
                background: showTestLeads ? "rgba(251,191,36,0.14)" : "rgba(15,23,42,0.72)",
                color: showTestLeads ? "#fde68a" : "#cbd5e1",
                borderRadius: 999,
                padding: "10px 14px",
                fontWeight: 950,
                cursor: "pointer",
              }}
            >
              {showTestLeads ? "Hide Test Leads" : "Show Test Leads"}
            </button>
          </div>

`;

if (!s.includes(marker)) {
  console.error("Could not find visibleLeadSubmissions empty-state marker.");
  process.exit(1);
}

s = s.replace(marker, toggle + marker);

fs.writeFileSync(path, s);
console.log("Inserted Show Test Leads toggle.");
