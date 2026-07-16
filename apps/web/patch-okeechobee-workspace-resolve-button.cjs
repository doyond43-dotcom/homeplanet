const fs = require("fs");

const path = "src/pages/OkeechobeeProjectWorkspace.tsx";
let text = fs.readFileSync(path, "utf8");

// Add resolving state
if (!text.includes("const [isResolvingProject, setIsResolvingProject]")) {
  text = text.replace(
    `  const [savingNeed, setSavingNeed] = useState(false);`,
    `  const [savingNeed, setSavingNeed] = useState(false);
  const [isResolvingProject, setIsResolvingProject] = useState(false);`
  );
}

// Add resolve function before return
if (!text.includes("async function resolveProject()")) {
  text = text.replace(
    `  return (`,
    `  async function resolveProject() {
    if (!project?.slug) return;

    const confirmed = window.confirm("Mark this project as resolved and move it to Completed Projects?");
    if (!confirmed) return;

    setIsResolvingProject(true);

    const nextTimeline = [
      ...(Array.isArray(project.timeline) ? project.timeline : []),
      {
        label: "Project resolved",
        time: new Date().toISOString(),
      },
    ];

    const { error } = await supabase
      .from("okeechobee_events")
      .update({
        status: "Resolved",
        timeline: nextTimeline,
      })
      .eq("slug", project.slug);

    setIsResolvingProject(false);

    if (error) {
      console.error(error);
      alert("Unable to resolve project.");
      return;
    }

    setProject({
      ...project,
      status: "Resolved",
      timeline: nextTimeline,
    });

    alert("Project marked as resolved.");
  }

  return (`
  );
}

// Add resolve button under Project Overview intro
if (!text.includes("Mark Project Resolved")) {
  text = text.replace(
    `              <p>
                Live project workspace for volunteers, materials,
                assignments, and community coordination.
              </p>`,
    `              <p>
                Live project workspace for volunteers, materials,
                assignments, and community coordination.
              </p>

              {project?.status === "Resolved" ? (
                <div
                  style={{
                    display: "inline-flex",
                    width: "fit-content",
                    marginTop: 10,
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
                    marginTop: 10,
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
              )}`
  );
}

fs.writeFileSync(path, text);
console.log("Resolve button added to Okeechobee project workspace.");
