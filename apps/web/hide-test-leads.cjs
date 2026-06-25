const fs = require("fs");

const path = "src/pages/HomePlanetMarketAwarenessFunnelV1.tsx";
let s = fs.readFileSync(path, "utf8");

// Make sure useState is available
if (!s.includes("useState")) {
  console.error("Could not find useState. Stop and inspect imports.");
  process.exit(1);
}

// Add test toggle state after mostSelected
s = s.replace(
  /const mostSelected = \[\.\.\.rows\]\.sort\(\(a, b\) =>\s*Number\(b\[1\]\) - Number\(a\[1\]\)\)\[0\]\?\.\[0\] \|\| "None yet";/,
  `const mostSelected = [...rows].sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || "None yet";

  const [showTestLeads, setShowTestLeads] = useState(false);

  function isTestLead(lead: any) {
    const haystack = [
      lead.name,
      lead.businessName,
      lead.phone,
      lead.email,
      lead.improvement,
      lead.challenge,
      lead.source,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      haystack.includes("test") ||
      haystack.includes("self") ||
      haystack.includes("dd ") ||
      haystack.includes("daniel doyon") ||
      haystack.includes("danny") ||
      haystack.includes("6635320683") ||
      haystack.includes("8635320683")
    );
  }

  const visibleLeadSubmissions = showTestLeads
    ? leadSubmissions
    : leadSubmissions.filter((lead) => !isTestLead(lead));`
);

// Use visible leads for empty state and map
s = s.replace("leadSubmissions.length === 0", "visibleLeadSubmissions.length === 0");
s = s.replace("leadSubmissions.map((lead, index) => (", "visibleLeadSubmissions.map((lead, index) => (");

// Add toggle under intro paragraph
s = s.replace(
  `          <p style={{ color: "#bdd0c6", fontWeight: 750, lineHeight: 1.55, maxWidth: 780 }}>
            They already saw the demo. Now their request becomes a real build direction with one clear next move.
          </p>`,
  `          <p style={{ color: "#bdd0c6", fontWeight: 750, lineHeight: 1.55, maxWidth: 780 }}>
            They already saw the demo. Now their request becomes a real build direction with one clear next move.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
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
          </div>`
);

fs.writeFileSync(path, s);
console.log("Patched HomePlanetMarketAwarenessFunnelV1.tsx to hide test leads by default.");
