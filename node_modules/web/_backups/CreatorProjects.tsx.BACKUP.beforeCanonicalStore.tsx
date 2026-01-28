import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { OrbitOffer, useOrbitLock } from "../orbitlock";

type Ctx = { witnessMode?: boolean };

type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: number; // Presence-first anchor moment
};

const STORAGE_KEY = "hp.creator.projects.v1";
const ACTIVE_PROJECT_KEY = "hp.creator.activeProjectId.v1";

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (p) =>
          p &&
          typeof p.id === "string" &&
          typeof p.name === "string" &&
          typeof p.createdAt === "number"
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

function saveProjects(items: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

function setActiveProjectId(id: string) {
  try {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } catch {
    // ignore
  }
}

function clearActiveProjectIdIfMatches(id: string) {
  try {
    const cur = localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (cur === id) localStorage.removeItem(ACTIVE_PROJECT_KEY);
  } catch {
    // ignore
  }
}

function formatTime(ms: number) {
  const d = new Date(ms);
  return d.toLocaleString();
}

export default function CreatorProjects() {
  const ctx = useOutletContext() as Ctx;
  const witness = !!ctx?.witnessMode;
  const nav = useNavigate();

  const [items, setItems] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const [pulse, setPulse] = useState(false);

  // ✅ Critical: prevent "wipe on mount"
  const hydratedRef = useRef(false);

  // Load once
  useEffect(() => {
    const loaded = loadProjects();
    setItems(loaded);
    hydratedRef.current = true;
  }, []);

  // ✅ Only persist AFTER hydration is complete
  useEffect(() => {
    if (!hydratedRef.current) return;
    saveProjects(items);
  }, [items]);

  const canCreate = useMemo(() => name.trim().length >= 2, [name]);

  const orbit = useOrbitLock({
    idleMs: 12000,
    enabled: true,
    canTrigger: () => items.length === 0 && name.trim().length === 0,
  });

  function guideMe() {
    orbit.dismiss();
    setError(null);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 900);

    window.setTimeout(() => {
      nameRef.current?.focus();
    }, 50);
  }

  function createProjectAndEnterBuild() {
    setError(null);

    const n = name.trim();
    if (n.length < 2) {
      setError("Project name must be at least 2 characters.");
      orbit.poke("invalid_create");
      return;
    }

    const now = Date.now();
    const id =
      globalThis.crypto && "randomUUID" in globalThis.crypto
        ? globalThis.crypto.randomUUID()
        : `p_${now}_${Math.random().toString(16).slice(2)}`;

    const p: Project = {
      id,
      name: n,
      description: desc.trim() ? desc.trim() : undefined,
      createdAt: now,
    };

    const next = [p, ...items];

    // Save immediately (feels real)
    saveProjects(next);
    setItems(next);

    // ✅ Active authority set BEFORE navigation
    setActiveProjectId(p.id);

    setName("");
    setDesc("");

    // Navigate into Build (replace avoids weird back-stack behavior)
    nav("/planet/creator/build", { replace: true });
  }

  function openProjectInBuild(id: string) {
    setActiveProjectId(id);
    nav("/planet/creator/build", { replace: true });
  }

  function removeProject(id: string) {
    const next = items.filter((p) => p.id !== id);
    saveProjects(next);
    clearActiveProjectIdIfMatches(id);
    setItems(next);
  }

  return (
    <div>
      <OrbitOffer
        open={orbit.open}
        label={orbit.label}
        reason={orbit.state.reason}
        onGuide={guideMe}
        onDismiss={orbit.dismiss}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, margin: 0 }}>🏙 Creator / Projects</h1>
          <p
            style={{
              marginTop: 10,
              color: "rgba(255,255,255,0.70)",
              lineHeight: 1.5,
              maxWidth: 900,
            }}
          >
            Start with an idea. It persists locally.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            padding: "8px 10px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
            background: witness ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
            color: witness ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.65)",
            fontSize: 12,
            height: 34,
          }}
        >
          <span style={{ fontWeight: 800 }}>Witness</span>
          <span>{witness ? "ON" : "OFF"}</span>
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.03)",
          padding: 14,
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 10 }}>New Project</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
          <input
            ref={nameRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name (required)"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              border: pulse ? "1px solid rgba(255,255,255,0.30)" : "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.25)",
              color: "rgba(255,255,255,0.92)",
              outline: "none",
              boxShadow: pulse ? "0 0 0 6px rgba(255,255,255,0.06)" : "none",
              transition: "box-shadow 250ms ease, border-color 250ms ease",
            }}
          />

          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.25)",
              color: "rgba(255,255,255,0.92)",
              outline: "none",
              resize: "vertical",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={createProjectAndEnterBuild}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: canCreate ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)",
                color: canCreate ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)",
                cursor: "pointer",
                fontWeight: 900,
              }}
              title={canCreate ? "Create and enter Build" : "Enter a project name first"}
            >
              Create → Enter Build
            </button>

            {error && <div style={{ color: "rgba(255,120,120,0.95)", fontSize: 12 }}>{error}</div>}

            <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
              Stored at: <span style={{ opacity: 0.9 }}>{STORAGE_KEY}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <div style={{ fontWeight: 800 }}>Projects</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>Count: {items.length}</div>
        </div>

        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                borderRadius: 18,
                border: "1px dashed rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.02)",
                padding: 16,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              No projects yet. Create your first one above.
            </div>
          ) : (
            items.map((p) => (
              <div
                key={p.id}
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.03)",
                  padding: 14,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 900 }}>{p.name}</div>
                  {witness && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: "4px 8px",
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.85)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Witnessed
                    </span>
                  )}
                </div>

                {p.description && (
                  <div style={{ marginTop: 8, color: "rgba(255,255,255,0.70)", lineHeight: 1.45 }}>{p.description}</div>
                )}

                <div style={{ marginTop: 10, color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.35 }}>
                  <div>
                    <b>Saved:</b> {formatTime(p.createdAt)}
                  </div>
                  <div style={{ marginTop: 2 }}>
                    <b>ID:</b> {p.id}
                  </div>
                </div>

                <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    onClick={() => openProjectInBuild(p.id)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.16)",
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.92)",
                      cursor: "pointer",
                      fontWeight: 900,
                    }}
                  >
                    Open → Build
                  </button>

                  <button
                    onClick={() => removeProject(p.id)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(0,0,0,0.20)",
                      color: "rgba(255,255,255,0.75)",
                      cursor: "pointer",
                      fontWeight: 800,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
