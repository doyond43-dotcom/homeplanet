import { useEffect, useRef, useState } from "react";

type Project = {
  id: string;
  createdAt: number;
};

type Draft = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

const PROJECT_KEY = "hp.active.project.v1";
const DRAFTS_KEY = "hp.active.drafts.v1";

function now() {
  return Date.now();
}

function id(prefix: string) {
  return `${prefix}_${now()}_${Math.random().toString(16).slice(2)}`;
}

export default function CreatorBuild() {
  const [project, setProject] = useState<Project | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("Idle");

  const activeDraftId = useRef<string | null>(null);

  // ---------- bootstrap ----------
  useEffect(() => {
    const storedProject = localStorage.getItem(PROJECT_KEY);
    if (storedProject) {
      setProject(JSON.parse(storedProject));
    } else {
      const p = { id: id("p"), createdAt: now() };
      localStorage.setItem(PROJECT_KEY, JSON.stringify(p));
      setProject(p);
    }

    const storedDrafts = localStorage.getItem(DRAFTS_KEY);
    if (storedDrafts) {
      setDrafts(JSON.parse(storedDrafts));
    }
  }, []);

  // ---------- persist drafts ----------
  useEffect(() => {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  }, [drafts]);

  // ---------- auto-draft ----------
  function ensureDraft(nextTitle: string, nextBody: string) {
    if (!nextTitle.trim() && !nextBody.trim()) return;

    if (!activeDraftId.current) {
      const d: Draft = {
        id: id("d"),
        title: nextTitle || "Untitled Draft",
        body: nextBody,
        createdAt: now(),
        updatedAt: now(),
      };
      activeDraftId.current = d.id;
      setDrafts([d]);
      setStatus("Saved");
      return;
    }

    setDrafts(prev =>
      prev.map(d =>
        d.id === activeDraftId.current
          ? { ...d, title: nextTitle || "Untitled Draft", body: nextBody, updatedAt: now() }
          : d
      )
    );
    setStatus("Saved");
  }

  return (
    <div style={{ maxWidth: 760, margin: "60px auto", padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Start with an idea.</h1>

      <input
        value={title}
        onChange={e => {
          setTitle(e.target.value);
          ensureDraft(e.target.value, body);
        }}
        placeholder="What are you building?"
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          fontWeight: 700,
          borderRadius: 10,
          marginBottom: 12,
        }}
      />

      <textarea
        value={body}
        onChange={e => {
          setBody(e.target.value);
          ensureDraft(title, e.target.value);
        }}
        placeholder="Start typing. HomePlanet saves automatically."
        rows={7}
        style={{
          width: "100%",
          padding: 14,
          fontSize: 15,
          borderRadius: 10,
        }}
      />

      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.7 }}>
        ● {status}
      </div>

      {drafts.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <strong>Drafts</strong>
          {drafts.map(d => (
            <div key={d.id} style={{ marginTop: 8, opacity: 0.8 }}>
              {d.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
