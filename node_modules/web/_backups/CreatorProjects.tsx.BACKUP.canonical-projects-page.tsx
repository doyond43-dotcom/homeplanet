import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProject,
  deleteProject,
  getActiveProjectId,
  listProjects,
  renameProject,
  setActiveProjectId,
  subscribeProjects,
  type HPProject,
} from "../lib/projectsStore";

const pageWrap: React.CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
  padding: "26px 16px",
  color: "#fff",
};

const card: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.35)",
  padding: 14,
};

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 12px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
};

const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const btnGhost: React.CSSProperties = {
  ...btn,
  background: "rgba(255,255,255,0.04)",
  fontWeight: 650,
  opacity: 0.95,
};

const input: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  padding: "10px 12px",
  outline: "none",
};

function norm(s: string) {
  return (s || "").toLowerCase().trim();
}

export default function CreatorProjects() {
  const nav = useNavigate();

  const [tick, setTick] = useState(0);
  useEffect(() => subscribeProjects(() => setTick((t) => t + 1)), []);

  const projects = useMemo(() => listProjects(), [tick]);
  const activeId = useMemo(() => getActiveProjectId(), [tick]);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeId) || null,
    [projects, activeId]
  );

  const [name, setName] = useState("");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const nq = norm(q);
    if (!nq) return projects;
    return projects.filter((p) => norm(p.name).includes(nq));
  }, [projects, q]);

  function onCreate() {
    const trimmed = name.trim();
    const p = createProject(trimmed || "Untitled Project");
    setActiveProjectId(p.id);
    setName("");
    nav("/creator/build");
  }

  function onOpen(p: HPProject) {
    setActiveProjectId(p.id);
    nav("/creator/build");
  }

  function onBack() {
    // if user has history, go back; otherwise go to build if an active project exists
    if (window.history.length > 1) nav(-1);
    else if (activeId) nav("/creator/build");
    else nav("/creator/projects");
  }

  return (
    <div style={pageWrap}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={{ margin: 0 }}>Creator Projects</h2>
          <div style={{ opacity: 0.72 }}>
            Canonical registry (v1). Pick a project, search it, open it.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button style={btnGhost} onClick={onBack}>← Back</button>

          {activeProject ? (
            <button style={btn} onClick={() => nav("/creator/build")} title="Open active project in Creator Build">
              Go to active: {activeProject.name.length > 18 ? activeProject.name.slice(0, 18) + "…" : activeProject.name}
            </button>
          ) : (
            <button style={{ ...btn, opacity: 0.6, cursor: "not-allowed" }} disabled>
              Go to active (none)
            </button>
          )}

          <button style={btnGhost} onClick={() => nav("/")}>Home</button>
        </div>
      </div>

      <div style={{ height: 14 }} />

      {/* Create */}
      <div style={card}>
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Create a project</div>
        <div style={{ display: "grid", gap: 10 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
            placeholder="Example: Creator flow that actually works"
            onKeyDown={(e) => {
              if (e.key === "Enter") onCreate();
            }}
          />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button style={btn} onClick={onCreate}>Create + Open</button>
            <button
              style={btnGhost}
              onClick={() => (activeId ? nav("/creator/build") : nav("/creator/projects"))}
              title="Uses active project"
            >
              Go to Build (active)
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 14 }} />

      {/* Search + List */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontWeight: 800 }}>Projects</div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>
            {q.trim() ? `matches: ${filtered.length} / ${projects.length}` : `count: ${projects.length}`}
          </div>
        </div>

        <div style={{ height: 10 }} />

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={input}
          placeholder="Search projects… (type a few letters)"
        />

        <div style={{ height: 12 }} />

        {projects.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No projects yet. Create one above.</div>
        ) : filtered.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No matches for “{q}”.</div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((p) => (
              <div key={p.id} style={row}>
                <div style={{ display: "grid", gap: 4 }}>
                  <div style={{ fontWeight: 900 }}>
                    {p.name}
                    {activeId === p.id ? (
                      <span style={{ marginLeft: 10, fontSize: 12, opacity: 0.8 }}>(active)</span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>
                    {new Date(p.updatedAt || p.createdAt).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button style={btn} onClick={() => onOpen(p)}>Open</button>
                  <button
                    style={btnGhost}
                    onClick={() => {
                      const next = prompt("Rename project:", p.name);
                      if (next != null) renameProject(p.id, next);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    style={btnGhost}
                    onClick={() => {
                      const ok = confirm(`Delete "${p.name}"?`);
                      if (ok) deleteProject(p.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
