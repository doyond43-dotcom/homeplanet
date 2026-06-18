import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function OkeechobeeProjectWorkspace() {
  const { slug } = useParams();

  const [project, setProject] = useState<any>(null);
  const [helpers, setHelpers] = useState<any[]>([]);

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
                Current Priority
              </h2>

              <p>Hot Water Heater</p>
              <p>Toilet Replacement</p>
              <p>Rent Assistance ($700 Goal)</p>

              <hr style={{ borderColor: "#222" }} />

              <p><strong>Assigned Volunteer</strong></p>
              <p>Roy Gaylor</p>

              <p><strong>Status</strong></p>
              <p>Waiting On Materials</p>
            </div>

            <h2>Needs Board</h2>
            {project?.project_needs?.map((need: any) => (
              <p key={need.id}>
                {need.status === "complete" ? "?" : "?"} {need.title}
              </p>
            ))}
            <button
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
            }}
          >
            <h2>Materials Needed</h2>

            <p>? Small Hot Water Heater</p>
            <p>? Toilet</p>
            <p>? Toilet Paper</p>
            <p>? Laundry Soap</p>
            <p>? Hand Soap</p>
            <p>? Household Essentials</p>
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









