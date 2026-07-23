const fs = require("fs");

const path = "src/pages/OkeechobeeProjectWorkspace.tsx";
let text = fs.readFileSync(path, "utf8");

if (!text.includes("const confirmedTimelineHelpers =")) {
  text = text.replace(
`  return (
    <main`,
`  const confirmedTimelineHelpers = (Array.isArray(project?.timeline) ? project.timeline : [])
    .filter((item: any) =>
      String(item.label || "").toLowerCase().includes(" joined as ")
    )
    .map((item: any, index: number) => {
      const label = String(item.label || "");
      const [name, helpType] = label.split(" joined as ");

      return {
        id: \`confirmed-timeline-helper-\${index}\`,
        name: name || "Volunteer",
        help_type: helpType || "Volunteer",
        phone: null,
        email: null,
        notes: "Confirmed from project timeline.",
        created_at: item.time,
      };
    });

  const displayHelpers =
    helpers && helpers.length > 0 ? helpers : confirmedTimelineHelpers;

  return (
    <main`
  );
}

text = text.replaceAll("helpers.length", "displayHelpers.length");
text = text.replaceAll("helpers.map((helper: any)", "displayHelpers.map((helper: any)");

fs.writeFileSync(path, text);
console.log("Workspace now displays confirmed timeline volunteers when helper rows are empty.");
