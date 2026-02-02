import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useProjectStore } from "../state/projectStore";
import { ensureProject } from "../data/ensureProject";

type ProjectRow = {
  id: string;
  kind: string;
  title: string;
  status: string;
  updated_at: string;
  created_at: string;
};

export default function CreatorProjects() {
  const navigate = useNavigate();
  const { setActiveProjectId } = useProjectStore();

  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const active = useMemo(() => rows.filter(r => r.status !== "deleted"), [rows]);

  async function load() {
    setLoading(true);
    setErr(null);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) {
      setRows([]);
      setErr("Not authenticated");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("id, kind, title, status, updated_at, created_at")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      setErr(error.message);
      setRows([]);
    } else {
      setRows((data ?? []) as ProjectRow[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await load();
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createBuildProject() {
  console.log("[HP] New Build Project CLICKED", new Date().toISOString());
  try {
    console.log("[HP] Checking auth session...");
    const sess = await supabase.auth.getSession();
    console.log("[HP] Session:", sess?.data?.session ? "YES" : "NO", sess);


      setErr(null);
      const p = await ensureProject("build", "Untitled Build");
      setActiveProjectId(p.id);
      navigate("/planet/creator/build");
    } catch (e: any) {
      console.error("[HP] createBuildProject FAILED:", e);
      setErr(e?.message ?? String(e));
    }
  }

  return (
    <div style={{ padding: 18, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Creator Projects</h1>
          <div style={{ opacity: 0.82, fontSize: 12 }}>
            Canonical registry (projects table)
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => void load()}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(0,0,0,0.45)",
              color: "white",
              cursor: "pointer",
              fontWeight: 800
            }}
          >
            Refresh
          </button>

          <button
            onClick={() => void createBuildProject()}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(0,0,0,0.45)",
              color: "white",
              cursor: "pointer",
              fontWeight: 900
            }}
          >
            New Build Project
          </button>
        </div>
      </div>

      {loading && <div style={{ opacity: 0.8 }}>Loading…</div>}

      {!loading && err && (
        <div style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.24)" }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Could not load projects</div>
          <div style={{ opacity: 0.8, fontSize: 13 }}>{err}</div>
        </div>
      )}

      {!loading && !err && active.length === 0 && (
        <div style={{ padding: 14, borderRadius: 14, border: "1px solid rgba(255,255,255,0.24)" }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>No projects yet.</div>
          <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 12 }}>
            Create your first canonical build project.
          </div>

          <button
            onClick={() => void createBuildProject()}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(0,0,0,0.45)",
              color: "white",
              cursor: "pointer",
              fontWeight: 900
            }}
          >
            Create Build Project
          </button>
        </div>
      )}

      {!loading && !err && active.length > 0 && (
        <div style={{ display: "grid", gap: 10 }}>
          {active.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActiveProjectId(p.id);
                if (p.kind === "city") navigate("/planet/creator/city");
                else navigate("/planet/creator/build");
              }}
              style={{
                textAlign: "left",
                padding: 14,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.24)",
                background: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.92)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 800 }}>
                  {p.title?.trim() ? p.title : "Untitled"}
                </div>
                <div style={{ opacity: 0.82, fontSize: 12 }}>
                  {p.kind}
                </div>
              </div>

              <div style={{ opacity: 0.82, fontSize: 12, marginTop: 6 }}>
                {p.id}
              </div>

              <div style={{ opacity: 0.82, fontSize: 11, marginTop: 4 }}>
                Click to open
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}










