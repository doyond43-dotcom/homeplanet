import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function OkeechobeeProjectWorkspace() {
  const { slug } = useParams();

  const [project, setProject] = useState<any>(null);
  const [helpers, setHelpers] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [savingTask, setSavingTask] = useState(false);
  const [showNeedForm, setShowNeedForm] = useState(false);
  const [needText, setNeedText] = useState("");
  const [savingNeed, setSavingNeed] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [availabilityName, setAvailabilityName] = useState("");
  const [availabilityDay, setAvailabilityDay] = useState("Saturday");
  const [availabilityTime, setAvailabilityTime] = useState("Afternoon");
  const [availabilityNotes, setAvailabilityNotes] = useState("");
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [materialText, setMaterialText] = useState("");
  const [materialAssignedTo, setMaterialAssignedTo] = useState("");
  const [savingMaterial, setSavingMaterial] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<number | null>(null);
  const [editMaterialText, setEditMaterialText] = useState("");
  const [editMaterialAssignedTo, setEditMaterialAssignedTo] = useState("");
  const [savingMaterialEdit, setSavingMaterialEdit] = useState(false);

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

  async function addMaterial() {
    if (!project || !materialText.trim()) return;

    setSavingMaterial(true);

    const { error } = await supabase
      .from("okeechobee_project_materials")
      .insert([
        {
          project_slug: project.slug,
          title: materialText.trim(),
          assigned_to: materialAssignedTo.trim() || null,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Unable to save material.");
      setSavingMaterial(false);
      return;
    }

    await loadProject();

    setMaterialText("");
    setMaterialAssignedTo("");
    setShowMaterialForm(false);
    setSavingMaterial(false);
  }
  async function updateMaterial() {
    if (!editingMaterialId || !editMaterialText.trim()) return;

    setSavingMaterialEdit(true);

    const { error } = await supabase
      .from("okeechobee_project_materials")
      .update({
        title: editMaterialText.trim(),
        assigned_to: editMaterialAssignedTo.trim() || null,
      })
      .eq("id", editingMaterialId);

    if (error) {
      console.error(error);
      alert("Unable to update material.");
      setSavingMaterialEdit(false);
      return;
    }

    await loadProject();

    setEditingMaterialId(null);
    setEditMaterialText("");
    setEditMaterialAssignedTo("");
    setSavingMaterialEdit(false);
  }
  async function saveAvailability() {
    if (!project || !availabilityName.trim()) return;

    setSavingAvailability(true);

    const { error } = await supabase
      .from("okeechobee_project_availability")
      .insert([
        {
          project_slug: project.slug,
          volunteer_name: availabilityName.trim(),
          best_day: availabilityDay,
          best_time: availabilityTime,
          notes: availabilityNotes.trim() || null,
        },
      ]);

    if (error) {
      console.error(error);
      alert("Unable to save availability.");
      setSavingAvailability(false);
      return;
    }

    await loadProject();

    setAvailabilityName("");
    setAvailabilityDay("Saturday");
    setAvailabilityTime("Afternoon");
    setAvailabilityNotes("");
    setShowAvailabilityForm(false);
    setSavingAvailability(false);
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
          <div
          style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: 18,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <h2>Availability Check</h2>

          <p style={{ color: "#aaa", marginTop: 0 }}>
            Volunteers can share what day and time works best so everyone can meet in the middle.
          </p>

          <button
            onClick={() => setShowAvailabilityForm(true)}
            style={{
              marginBottom: 12,
              padding: "10px 14px",
              borderRadius: 999,
              border: 0,
              background: "#39FF14",
              color: "#050505",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Add Availability
          </button>

          {showAvailabilityForm && (
            <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
              <input
                value={availabilityName}
                onChange={(e) => setAvailabilityName(e.target.value)}
                placeholder="Volunteer name"
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #333",
                  background: "#181818",
                  color: "white",
                }}
              />

              <select
                value={availabilityDay}
                onChange={(e) => setAvailabilityDay(e.target.value)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #333",
                  background: "#181818",
                  color: "white",
                }}
              >
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
                <option>Flexible</option>
              </select>

              <select
                value={availabilityTime}
                onChange={(e) => setAvailabilityTime(e.target.value)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #333",
                  background: "#181818",
                  color: "white",
                }}
              >
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
                <option>Flexible</option>
              </select>

              <input
                value={availabilityNotes}
                onChange={(e) => setAvailabilityNotes(e.target.value)}
                placeholder="Optional note"
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #333",
                  background: "#181818",
                  color: "white",
                }}
              />

              <button onClick={saveAvailability} disabled={savingAvailability}>
                {savingAvailability ? "Saving..." : "Save Availability"}
              </button>

              <button onClick={() => setShowAvailabilityForm(false)}>
                Cancel
              </button>
            </div>
          )}

          {availability.length === 0 ? (
            <p>No availability added yet.</p>
          ) : (
            availability.map((item: any) => (
              <div
                key={item.id}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #222",
                }}
              >
                <p style={{ margin: 0, fontWeight: 800 }}>
                  {item.volunteer_name} - {item.best_day}, {item.best_time}
                </p>

                {item.notes ? (
                  <p style={{ margin: "6px 0 0", color: "#aaa" }}>{item.notes}</p>
                ) : null}
              </div>
            ))
          )}
        </div>
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

            <button
              onClick={() => setShowMaterialForm(true)}
              style={{
                marginBottom: 12,
              }}
            >
              + Add Material
            </button>

            {showMaterialForm && (
              <div
                style={{
                  marginBottom: 16,
                  display: "grid",
                  gap: 10,
                }}
              >
                <input
                  value={materialText}
                  onChange={(e) => setMaterialText(e.target.value)}
                  placeholder="Enter a material..."
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "#181818",
                    color: "white",
                    fontSize: 15,
                    outline: "none",
                  }}
                />

                <input
                  value={materialAssignedTo}
                  onChange={(e) => setMaterialAssignedTo(e.target.value)}
                  placeholder="Who is bringing it?"
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: "1px solid #333",
                    background: "#181818",
                    color: "white",
                    fontSize: 15,
                    outline: "none",
                  }}
                />

                <button
                  onClick={addMaterial}
                  disabled={savingMaterial}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: 0,
                    background: "#39FF14",
                    color: "#050505",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {savingMaterial ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => setShowMaterialForm(false)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 999,
                    border: "1px solid #333",
                    background: "#181818",
                    color: "white",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}

            {materials.length === 0 ? (
              <p>No materials yet.</p>
            ) : (
              materials.map((material: any) => (
                <div
                  key={material.id}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #222",
                  }}
                >
                  {editingMaterialId === material.id ? (
                    <div style={{ display: "grid", gap: 10 }}>
                      <input
                        value={editMaterialText}
                        onChange={(e) => setEditMaterialText(e.target.value)}
                        placeholder="Material"
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          border: "1px solid #333",
                          background: "#181818",
                          color: "white",
                        }}
                      />

                      <input
                        value={editMaterialAssignedTo}
                        onChange={(e) => setEditMaterialAssignedTo(e.target.value)}
                        placeholder="Who is bringing it?"
                        style={{
                          padding: 12,
                          borderRadius: 10,
                          border: "1px solid #333",
                          background: "#181818",
                          color: "white",
                        }}
                      />

                      <button onClick={updateMaterial} disabled={savingMaterialEdit}>
                        {savingMaterialEdit ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        onClick={() => {
                          setEditingMaterialId(null);
                          setEditMaterialText("");
                          setEditMaterialAssignedTo("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p style={{ margin: 0 }}>
                        - {material.title}
                        {material.assigned_to ? ` - ${material.assigned_to}` : ""}
                      </p>

                      <button
                        onClick={() => {
                          setEditingMaterialId(material.id);
                          setEditMaterialText(material.title || "");
                          setEditMaterialAssignedTo(material.assigned_to || "");
                        }}
                        style={{
                          marginTop: 8,
                          padding: "6px 10px",
                          borderRadius: 999,
                          border: "1px solid #333",
                          background: "#181818",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
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







































