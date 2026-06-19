import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function OkeechobeeProjectWorkspace() {
  const { slug } = useParams();

  const [project, setProject] = useState<any>(null);
  const [helpers, setHelpers] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [savingTask, setSavingTask] = useState(false);
  const [showNeedForm, setShowNeedForm] = useState(false);
  const [needText, setNeedText] = useState("");
  const [savingNeed, setSavingNeed] = useState(false);

  useEffect(() => {
    loadProject();
  }, [slug]);

  async function loadProject() {
    if (!slug) return;

    const { data, error } = await supabase
      .from("okeechobee_events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setProject(data);

    const { data: helperData } = await supabase
      .from("okeechobee_project_helpers")
      .select("*")
      .eq("event_slug", data.slug)
      .order("created_at", { ascending: true });

    console.log("PROJECT SLUG:", data.slug);
    console.log("HELPERS FOUND:", helperData);
    setHelpers(helperData || []);

    const { data: materialData } = await supabase
      .from("okeechobee_project_materials")
      .select("*")
      .eq("project_slug", data.slug)
      .order("created_at", { ascending: true });



    setMaterials(materialData || []);

    const { data: taskData } = await supabase
      .from("okeechobee_project_tasks")
      .select("*")
      .eq("project_slug", data.slug)
      .order("created_at", { ascending: true });

    console.log("TASKS FOUND:", taskData);
    setTasks(taskData || []);
  }

  async function addNeed() {
    if (!project || !needText.trim()) return;

    setSavingNeed(true);

    const updatedNeeds = [
      ...(project.project_needs || []),
      {
        id: Date.now(),
        title: needText.trim(),
        status: "open",
      },
    ];

    const { error } = await supabase
      .from("okeechobee_events")
      .update({
        project_needs: updatedNeeds,
      })
      .eq("slug", project.slug);

    if (error) {
      console.error(error);
      alert("Unable to save need.");
      setSavingNeed(false);
      return;
    }

    setProject({
      ...project,
      project_needs: updatedNeeds,
    });

    setNeedText("");
    setShowNeedForm(false);
    setSavingNeed(false);
  }

  async function addTask() {
    if (!project || !taskText.trim()) return;

    setSavingTask(true);

    const { error } = await supabase
      .from("okeechobee_project_tasks")
      .insert([
        {
          project_slug: project.slug,
          title: taskText.trim(),
          status: "open",
        },
      ]);

    if (error) {
      console.error(error);
      alert("Unable to save task.");
      setSavingTask(false);
      return;
    }

    await loadProject();

    setTaskText("");
    setShowTaskForm(false);
    setSavingTask(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: 24,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              color: "#39FF14",
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Okeechobee Together
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 36,
            }}
          >
            Project Workspace
          </h1>

          <p
            style={{
              color: "#999",
              marginTop: 8,
            }}
          >
            Project: {project?.title || slug}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 18,
              padding: 20,
            }}
          >
            <div
              style={{
                background: "#0f1a0f",
                border: "1px solid #39FF14",
                borderRadius: 18,
                padding: 20,
                marginBottom: 16,
              }}
            >
              <h2 style={{ color: "#39FF14", marginTop: 0 }}>
                Project Overview
              </h2>

              <p>
                Live project workspace for volunteers, materials,
                assignments, and community coordination.
              </p>

              <hr style={{ borderColor: "#222" }} />

              <p><strong>Volunteers</strong></p>
              <p>{helpers.length}</p>

              <p><strong>Materials Requested</strong></p>
              <p>{materials.length}</p>
            </div>

            <h2>Needs Board</h2>
            {project?.project_needs?.map((need: any) => (
              <p key={need.id}>
                {need.status === "complete" ? "?" : "?"} {need.title}
              </p>
            ))}
            <button
              onClick={() => setShowNeedForm(true)}
              style={{
                marginTop: 12,
                padding: "10px 16px",
                borderRadius: 999,
                border: "none",
                background: "#39FF14",
                color: "#050505",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Add Need
            </button>

            {showNeedForm && (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  border: "1px solid #333",
                  borderRadius: 12,
                  background: "#0a0a0a",
                }}
              >
                <textarea
                  value={needText}
                  onChange={(e) => setNeedText(e.target.value)}
                  placeholder="Enter a need..."
                  style={{
                    width: "100%",
                    minHeight: 100,
                    padding: 12,
                    borderRadius: 8,
                    background: "#111",
                    color: "white",
                    border: "1px solid #333",
                  }}
                />

                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <button
                    onClick={addNeed}
                    disabled={savingNeed}
                  >
                    {savingNeed ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setShowNeedForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

          </div>
          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 18,
              padding: 20,
            }}
          >
            <h2>Volunteer Assignments ({helpers.length})</h2>

            {helpers.map((helper: any) => (
              <div
                key={helper.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #222",
                }}
              >
                <p><strong>{helper.name}</strong></p>
                <p>{helper.help_type}</p>
                <p>{helper.phone}</p>
                {helper.email && <p>{helper.email}</p>}
                {helper.notes && (
                  <p style={{ color: "#999" }}>{helper.notes}</p>
                )}

              </div>
            ))}
          </div>

          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 18,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <h2>Tasks ({tasks.length})</h2>

            <button
              onClick={() => setShowTaskForm(true)}
              style={{
                marginBottom: 12,
              }}
            >
              + Add Task
            </button>
            {showTaskForm && (
              <div style={{ marginBottom: 16 }}>
                <textarea
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="Enter a task..."
                  style={{
                    width: "100%",
                    minHeight: 80,
                    padding: 12,
                    borderRadius: 8,
                    background: "#111",
                    color: "white",
                    border: "1px solid #333",
                  }}
                />

                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <button
                    onClick={addTask}
                    disabled={savingTask}
                  >
                    {savingTask ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setShowTaskForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {tasks.length === 0 ? (
              <p>No tasks yet.</p>
            ) : (
              tasks.map((task: any) => (
                <p key={task.id}>
                  - {task.title}
                </p>
              ))
            )}
          </div>


          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 18,
              padding: 20,
            }}
          >
            <h2>Materials Needed</h2>

            {materials.map((material: any) => (
              <p key={material.id}>
                ? {material.title}
                {material.assigned_to ? ` - ${material.assigned_to}` : ""}
              </p>
            ))}
          </div>

          <div
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: 18,
              padding: 20,
            }}
          >
            <h2>Project Timeline</h2>

            <p>Volunteer Joined</p>
            <p>Need Added</p>
            <p>Material Requested</p>
            <p>Assignment Created</p>
          </div>
        </div>
      </div>
    </main>
  );
}































