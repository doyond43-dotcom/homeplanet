import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./PerformancePowerboatsCustomerProjectPage.css";

type Project = {
  id: string;
  project_type: string;
  customer_name: string;
  boat_year: string | null;
  boat_make_model: string | null;
  boat_length: string | null;
  boat_engines: string | null;
  current_milestone: string;
  waiting_on: string | null;
  proof_photos: any[];
};

function boatLabel(project: Project) {
  return [
    project.boat_year,
    project.boat_make_model,
    project.boat_length,
    project.boat_engines,
  ]
    .filter(Boolean)
    .join(" · ");
}

export default function PerformancePowerboatsCustomerProjectPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!id || !token) {
      setLoading(false);
      return;
    }

    async function loadProject() {
      const { data, error } = await supabase.rpc(
        "get_performance_powerboat_customer_project",
        {
          p_project_id: id,
          p_token: token,
        }
      );

      if (error || !data?.length) {
        console.error(error);
        setProject(null);
      } else {
        setProject(data[0] as Project);
      }

      setLoading(false);
    }

    loadProject();
  }, [id, token]);

  async function uploadFiles(files: FileList | null) {
    if (!files || !project || !token) return;

    const chosen = Array.from(files).slice(0, 10);
    if (!chosen.length) return;
    if (chosen.some((file) => !file.type.startsWith("image/"))) {
      alert("Please choose image files only.");
      return;
    }

    setUploading(true);

    try {
      const uploaded: any[] = [];

      for (const file of chosen) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");

        const filePath =
          `${project.id}/${token}/customer/${Date.now()}-${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("performance-powerboat-photos")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || undefined,
          });

        if (uploadError) throw uploadError;

        const publicUrl = supabase.storage
          .from("performance-powerboat-photos")
          .getPublicUrl(filePath).data.publicUrl;

        uploaded.push({
          url: publicUrl,
          path: filePath,
          source: "customer",
          uploaded_at: new Date().toISOString(),
          name: file.name,
        });
      }

      const { data, error } = await supabase.rpc(
        "add_performance_powerboat_customer_photos",
        {
          p_project_id: project.id,
          p_token: token,
          p_photos: uploaded,
        }
      );

      if (error) throw error;
      if (!data) throw new Error("Project access could not be verified.");

      setProject((current) => current ? {
        ...current,
        proof_photos: [...(current.proof_photos ?? []), ...uploaded],
        waiting_on: null,
        current_milestone: "Reviewing Project",
      } : current);

      setDone(true);
    } catch (error: any) {
      alert(error?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function photoInput(
    label: string,
    options: { capture?: "environment"; multiple?: boolean } = {}
  ) {
    return (
      <label className="ppc-upload-choice">
        <input
          type="file"
          accept="image/*"
          capture={options.capture}
          multiple={options.multiple}
          disabled={uploading}
          onChange={(event) => {
            uploadFiles(event.target.files);
            event.currentTarget.value = "";
          }}
        />
        <strong>{label}</strong>
      </label>
    );
  }

  function uploadChoices(compact = false) {
    return (
      <div className={`ppc-upload ${compact ? "ppc-upload-compact" : ""}`}>
        {!compact && <span>+</span>}
        <strong>{uploading ? "UPLOADING..." : compact ? "ADD MORE PHOTOS" : "ADD PHOTOS"}</strong>
        <small>Choose several at once, take a photo, or select image files.</small>
        <div className="ppc-upload-choices">
          {photoInput("PHOTOS", { multiple: true })}
          {photoInput("CAMERA", { capture: "environment" })}
          {photoInput("FILES", { multiple: true })}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <main className="ppc-page">
        <div className="ppc-state">Loading project...</div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="ppc-page">
        <div className="ppc-state">
          This project link is invalid or has expired.
        </div>
      </main>
    );
  }

  return (
    <main className="ppc-page">
      <div className="ppc-shell">
        <div className="ppc-brand">
          <span>PERFORMANCE</span>
          <strong>POWERBOATS</strong>
        </div>

        <div className="ppc-kicker">YOUR PROJECT</div>

        <h1>{boatLabel(project) || project.project_type}</h1>
        <p className="ppc-type">{project.project_type}</p>

        {!done ? (
          <section className="ppc-card">
            <div className="ppc-requested">MAX REQUESTED PHOTOS</div>

            <h2>SHOW US WHAT YOU'RE WORKING WITH.</h2>

            <p>
              Add a few photos of the boat, hull, engines, damage, current
              setup, or anything else that helps Performance Powerboats
              understand the project.
            </p>

            {uploadChoices()}
          </section>
        ) : (
          <section className="ppc-card ppc-done">
            <div className="ppc-check">✓</div>
            <div className="ppc-requested">PHOTOS RECEIVED</div>
            <h2>GOT THEM.</h2>

            <p>
              {project.proof_photos.length} photo{project.proof_photos.length === 1 ? " is" : "s are"} attached to this Performance Powerboats
              project. Max's team can review them from here.
            </p>

            {uploadChoices(true)}
          </section>
        )}
      </div>
    </main>
  );
}
