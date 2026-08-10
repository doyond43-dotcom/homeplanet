import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./PerformancePowerboatsTechPad.css";

type TimelineEvent = { at: string; label: string; type?: string; note?: string };
type PartLine = { id: string; description: string; quantity: number; status?: string };

type Project = {
  id: string;
  project_type: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_access_token: string;
  boat_year: string | null;
  boat_make_model: string | null;
  boat_length: string | null;
  boat_engines: string | null;
  boat_location: string | null;
  customer_request: string | null;
  current_milestone: string;
  next_action: string;
  assigned_to: string | null;
  waiting_on: string | null;
  team_found: string | null;
  work_performed: string | null;
  internal_notes: string | null;
  proof_photos: any[];
  parts: any[];
  timeline: TimelineEvent[];
};

const PHOTO_TYPES = ["Damage", "Inspection", "Progress", "Completion", "Water Test"];

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function boatLabel(project: Project) {
  return [project.boat_year, project.boat_make_model, project.boat_length, project.boat_engines]
    .filter(Boolean)
    .join(" · ");
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return value.trim();
}

function projectIdFromRoute(value: string | undefined) {
  if (!value) return null;
  const match = decodeURIComponent(value).match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i,
  );
  return match?.[0] ?? null;
}

function normalizeParts(parts: any[]): PartLine[] {
  return (parts ?? []).map((part) => ({
    id: String(part?.id || makeId()),
    description: String(part?.description || part?.name || ""),
    quantity: Math.max(1, Number(part?.quantity) || 1),
    status: part?.status ? String(part.status) : undefined,
  }));
}

export default function PerformancePowerboatsTechPad() {
  const { id } = useParams();
  const projectId = projectIdFromRoute(id);
  const [project, setProject] = useState<Project | null>(null);
  const [parts, setParts] = useState<PartLine[]>([]);
  const [techNotes, setTechNotes] = useState("");
  const [findings, setFindings] = useState("");
  const [progress, setProgress] = useState("");
  const [waterTestNotes, setWaterTestNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function loadProject(showLoading = false) {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }
    if (showLoading) setLoading(true);
    const { data, error } = await supabase
      .from("performance_powerboat_projects")
      .select("*")
      .eq("id", projectId)
      .maybeSingle();

    if (error) {
      console.error(error);
      setProject(null);
    } else if (data) {
      const next = data as Project;
      setProject(next);
      setParts(normalizeParts(next.parts));
      setTechNotes(next.internal_notes || "");
      setFindings(next.team_found || "");
      const latestWaterTest = [...(next.timeline ?? [])].reverse().find((event) => event.type === "water_test");
      setWaterTestNotes(latestWaterTest?.note || "");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProject(true);
    if (!projectId) return;

    const channel = supabase
      .channel(`performance-tech-pad-${projectId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "performance_powerboat_projects",
        filter: `id=eq.${projectId}`,
      }, () => loadProject())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  const photosByType = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const photo of project?.proof_photos ?? []) {
      const category = String(photo?.category || photo?.label || "Project");
      counts[category] = (counts[category] || 0) + 1;
    }
    return counts;
  }, [project?.proof_photos]);

  async function updateProject(patch: Partial<Project>, event?: Omit<TimelineEvent, "at">) {
    if (!project) return false;
    setBusy(true);
    setFeedback("");
    const timeline = event
      ? [...(project.timeline ?? []), { ...event, at: new Date().toISOString() }]
      : project.timeline ?? [];
    const payload = { ...patch, timeline, updated_at: new Date().toISOString() };
    const { error } = await supabase
      .from("performance_powerboat_projects")
      .update(payload)
      .eq("id", project.id);

    if (error) {
      setFeedback(error.message);
      setBusy(false);
      return false;
    }
    setProject({ ...project, ...patch, timeline });
    setFeedback("Saved to work order.");
    setBusy(false);
    return true;
  }

  async function saveNotes() {
    await updateProject({ internal_notes: techNotes.trim() || null }, {
      label: "Technician notes updated",
      type: "technician_notes",
    });
  }

  async function saveFindings() {
    await updateProject({ team_found: findings.trim() || null }, {
      label: "Inspection findings updated",
      type: "inspection_findings",
    });
  }

  async function saveParts(requestOrder = false) {
    const clean = parts.filter((part) => part.description.trim()).map((part) => ({
      ...part,
      description: part.description.trim(),
      quantity: Math.max(1, Number(part.quantity) || 1),
      status: requestOrder ? "requested" : part.status,
    }));
    const patch: Partial<Project> = { parts: clean };
    if (requestOrder) {
      patch.waiting_on = "Parts / materials";
      patch.next_action = "Review requested parts / materials";
    }
    const saved = await updateProject(patch, {
      label: requestOrder
        ? `Parts order requested (${clean.length} item${clean.length === 1 ? "" : "s"})`
        : "Parts / materials list updated",
      type: requestOrder ? "parts_order_requested" : "parts_updated",
    });
    if (saved) setParts(clean);
  }

  async function addProgressUpdate() {
    const note = progress.trim();
    if (!note) return;
    const saved = await updateProject({}, {
      label: `Progress update — ${note}`,
      type: "progress_update",
      note,
    });
    if (saved) setProgress("");
  }

  async function saveWaterTest() {
    const note = waterTestNotes.trim();
    if (!note) return;
    const saved = await updateProject({
      current_milestone: "Water Test / Final Check",
      next_action: "Complete water test / final check",
    }, {
      label: `Water test / final check — ${note}`,
      type: "water_test",
      note,
    });
    if (saved) setWaterTestNotes("");
  }

  async function setWorkStatus(milestone: string, nextAction: string, label: string) {
    await updateProject({
      current_milestone: milestone,
      next_action: nextAction,
      waiting_on: null,
      status: milestone === "Ready" ? "ready" : "active",
    }, { label, type: "technician_status" });
  }

  async function uploadPhotos(category: string, files: FileList | null) {
    if (!files || !project) return;
    const chosen = Array.from(files).slice(0, 10);
    if (!chosen.length) return;
    if (chosen.some((file) => !file.type.startsWith("image/"))) {
      setFeedback("Choose image files only.");
      return;
    }

    setBusy(true);
    setFeedback("");
    try {
      const uploaded: any[] = [];
      for (const file of chosen) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `${project.id}/${project.customer_access_token}/tech/${category.toLowerCase().replace(/\s+/g, "-")}/${Date.now()}-${makeId()}-${safeName}`;
        const { error } = await supabase.storage
          .from("performance-powerboat-photos")
          .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type || undefined });
        if (error) throw error;
        const url = supabase.storage.from("performance-powerboat-photos").getPublicUrl(path).data.publicUrl;
        uploaded.push({ url, path, source: "technician", category, uploaded_at: new Date().toISOString(), name: file.name });
      }
      const nextPhotos = [...(project.proof_photos ?? []), ...uploaded];
      const timeline = [...(project.timeline ?? []), {
        at: new Date().toISOString(),
        label: `Technician added ${uploaded.length} ${category.toLowerCase()} photo${uploaded.length === 1 ? "" : "s"}`,
        type: "technician_photos",
      }];
      const { error } = await supabase
        .from("performance_powerboat_projects")
        .update({ proof_photos: nextPhotos, timeline, updated_at: new Date().toISOString() })
        .eq("id", project.id);
      if (error) throw error;
      setProject({ ...project, proof_photos: nextPhotos, timeline });
      setFeedback(`${uploaded.length} photo${uploaded.length === 1 ? "" : "s"} attached.`);
    } catch (error: any) {
      setFeedback(error?.message || "Photo upload failed.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <main className="ppt-page"><div className="ppt-state">Loading assigned work…</div></main>;
  if (!project) return <main className="ppt-page"><div className="ppt-state">This assigned job could not be opened.</div></main>;

  return (
    <main className="ppt-page">
      <header className="ppt-header">
        <div className="ppt-brand"><span>PERFORMANCE</span><strong>POWERBOATS</strong></div>
        <div className="ppt-pad-label">TECH PAD</div>
      </header>

      <div className="ppt-shell">
        <section className="ppt-job">
          <span>ASSIGNED WORK ORDER</span>
          <h1>{boatLabel(project) || project.project_type}</h1>
          <p>{project.project_type} · {project.assigned_to || "Unassigned"}</p>
        </section>

        <section className="ppt-card ppt-basics">
          <div><span>CUSTOMER</span><strong>{project.customer_name}</strong></div>
          <div><span>PHONE</span><a href={`tel:${normalizePhone(project.customer_phone)}`}>{project.customer_phone}</a></div>
          <div><span>LOCATION</span><strong>{project.boat_location || "Not provided"}</strong></div>
          <div className="ppt-wide"><span>CUSTOMER REPORTED</span><p>{project.customer_request || "No request details provided."}</p></div>
        </section>

        <section className="ppt-status-card">
          <div><span>CURRENT MILESTONE</span><strong>{project.current_milestone}</strong></div>
          <div><span>NEXT ACTION</span><strong>{project.next_action}</strong></div>
        </section>

        <section className="ppt-card">
          <div className="ppt-section-head"><span>01</span><h2>TECHNICIAN NOTES</h2></div>
          <textarea value={techNotes} onChange={(event) => setTechNotes(event.target.value)} placeholder="What should the team know while working on this boat?" />
          <button className="ppt-primary" disabled={busy} onClick={saveNotes}>SAVE NOTES</button>
        </section>

        <section className="ppt-card">
          <div className="ppt-section-head"><span>02</span><h2>INSPECTION FINDINGS</h2></div>
          <textarea value={findings} onChange={(event) => setFindings(event.target.value)} placeholder="Damage, condition, measurements, test results, and what was found…" />
          <button className="ppt-primary" disabled={busy} onClick={saveFindings}>SAVE FINDINGS</button>
        </section>

        <section className="ppt-card">
          <div className="ppt-section-head"><span>03</span><h2>PARTS + MATERIALS</h2></div>
          <div className="ppt-parts">
            {parts.map((part) => (
              <div className="ppt-part" key={part.id}>
                <input value={part.description} onChange={(event) => setParts((current) => current.map((item) => item.id === part.id ? { ...item, description: event.target.value } : item))} placeholder="Part or material" />
                <label><span>QTY</span><input type="number" min="1" inputMode="numeric" value={part.quantity} onChange={(event) => setParts((current) => current.map((item) => item.id === part.id ? { ...item, quantity: Math.max(1, Number(event.target.value) || 1) } : item))} /></label>
                <button aria-label="Remove part" onClick={() => setParts((current) => current.filter((item) => item.id !== part.id))}>×</button>
              </div>
            ))}
          </div>
          <button className="ppt-secondary" onClick={() => setParts((current) => [...current, { id: makeId(), description: "", quantity: 1 }])}>+ ADD PART / MATERIAL</button>
          <div className="ppt-action-row">
            <button disabled={busy} onClick={() => saveParts(false)}>SAVE LIST</button>
            <button className="ppt-primary" disabled={busy || !parts.some((part) => part.description.trim())} onClick={() => saveParts(true)}>CREATE / REQUEST ORDER</button>
          </div>
        </section>

        <section className="ppt-card">
          <div className="ppt-section-head"><span>04</span><h2>WORK PHOTOS</h2></div>
          <p className="ppt-help">Attach proof to this work order as the job moves through the shop and water.</p>
          <div className="ppt-photo-types">
            {PHOTO_TYPES.map((category) => (
              <label key={category} className="ppt-photo-button">
                <input type="file" accept="image/*" multiple disabled={busy} onChange={(event) => { uploadPhotos(category, event.target.files); event.currentTarget.value = ""; }} />
                <span>+ {category.toUpperCase()}</span>
                <small>{photosByType[category] || 0} attached</small>
              </label>
            ))}
          </div>
        </section>

        <section className="ppt-card">
          <div className="ppt-section-head"><span>05</span><h2>PROGRESS UPDATE</h2></div>
          <textarea value={progress} onChange={(event) => setProgress(event.target.value)} placeholder="What changed or was completed today?" />
          <button className="ppt-primary" disabled={busy || !progress.trim()} onClick={addProgressUpdate}>POST PROGRESS UPDATE</button>
        </section>

        <section className="ppt-card">
          <div className="ppt-section-head"><span>06</span><h2>WATER TEST / FINAL CHECK</h2></div>
          <textarea value={waterTestNotes} onChange={(event) => setWaterTestNotes(event.target.value)} placeholder="Performance, systems checked, issues found, and final result…" />
          <button className="ppt-primary" disabled={busy || !waterTestNotes.trim()} onClick={saveWaterTest}>SAVE FINAL CHECK</button>
        </section>

        <section className="ppt-card ppt-completion">
          <div className="ppt-section-head"><span>07</span><h2>UPDATE WORK STATUS</h2></div>
          <button disabled={busy} onClick={() => setWorkStatus("Work Underway", "Continue assigned work", "Technician started work")}>START / RESUME WORK</button>
          <button disabled={busy} onClick={() => setWorkStatus("Water Test / Final Check", "Complete water test / final check", "Work moved to water test / final check")}>MOVE TO FINAL CHECK</button>
          <button className="ppt-complete" disabled={busy} onClick={() => setWorkStatus("Ready", "Final review and customer handoff", "Technician marked work complete")}>MARK WORK COMPLETE</button>
        </section>

        <div className="ppt-feedback" aria-live="polite">{busy ? "Saving…" : feedback}</div>
      </div>
    </main>
  );
}
