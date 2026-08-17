import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function OkeechobeeResidentProjectPage() {
  const { slug } = useParams();

  const [token, setToken] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [needText, setNeedText] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    const rawToken = window.location.hash.replace(/^#/, "").trim();

    setToken(rawToken);

    if (!rawToken || !slug) {
      setError("This project management link is incomplete.");
      setLoading(false);
      return;
    }

    loadProject(rawToken);
  }, [slug]);

  async function callManage(
    rawToken: string,
    action: string,
    extra: Record<string, unknown> = {}
  ) {
    const response = await fetch("/api/okeechobee-manage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug,
        token: rawToken,
        action,
        ...extra,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.ok !== true) {
      throw new Error(
        result?.error || "Could not load your project."
      );
    }

    return result;
  }

  async function loadProject(rawToken = token) {
    try {
      setLoading(true);
      setError("");

      const result = await callManage(rawToken, "load");
      setData(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load your project."
      );
    } finally {
      setLoading(false);
    }
  }

  async function addNeed() {
    if (!needText.trim() || !token || working) return;

    try {
      setWorking(true);

      const result = await callManage(
        token,
        "add-need",
        {
          title: needText.trim(),
        }
      );

      setData(result);
      setNeedText("");
    } catch (actionError) {
      alert(
        actionError instanceof Error
          ? actionError.message
          : "Could not add the need."
      );
    } finally {
      setWorking(false);
    }
  }

  async function resolveProject() {
    if (!token || working) return;

    const confirmed = window.confirm(
      "Mark this project as resolved?"
    );

    if (!confirmed) return;

    try {
      setWorking(true);

      const result = await callManage(
        token,
        "resolve"
      );

      setData(result);
    } catch (actionError) {
      alert(
        actionError instanceof Error
          ? actionError.message
          : "Could not resolve the project."
      );
    } finally {
      setWorking(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p>Loading your project...</p>
        </section>
      </main>
    );
  }

  if (error || !data?.project) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.kicker}>
            Okeechobee Together
          </p>

          <h1 style={styles.title}>
            Project access unavailable
          </h1>

          <p style={styles.muted}>
            {error || "This management link could not be verified."}
          </p>

          <Link
            to="/planet/okeechobee"
            style={styles.secondaryButton}
          >
            Back to Okeechobee Together
          </Link>
        </section>
      </main>
    );
  }

  const project = data.project;

  const publicTitle =
    project.public_title ||
    project.title ||
    "Community Project";

  const needs = Array.isArray(project.project_needs)
    ? project.project_needs
    : [];

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>
          Okeechobee Together
        </p>

        <div style={styles.privateBadge}>
          Private Project Manager
        </div>

        <h1 style={styles.title}>
          {publicTitle}
        </h1>

        <p style={styles.muted}>
          Hi {data.residentName || "there"}. This is your
          private coordination page.
        </p>

        <div style={styles.statusBox}>
          <span>
            Status
          </span>

          <strong>
            {project.status}
          </strong>
        </div>

        <div style={styles.actions}>
          <a
            href={`/planet/okeechobee/event/${project.slug}`}
            style={styles.primaryButton}
          >
            View Public Project
          </a>

          {project.status !== "Resolved" && (
            <button
              type="button"
              onClick={resolveProject}
              disabled={working}
              style={styles.secondaryButton}
            >
              {working
                ? "Updating..."
                : "Mark Project Resolved"}
            </button>
          )}
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            What is still needed?
          </h2>

          {needs.length === 0 ? (
            <p style={styles.muted}>
              Nothing has been added to the needs board yet.
            </p>
          ) : (
            <div style={styles.list}>
              {needs.map((need: any) => (
                <div
                  key={need.id}
                  style={styles.item}
                >
                  <strong>
                    {need.status === "complete"
                      ? "Completed"
                      : "Needed"}
                  </strong>

                  <span>
                    {need.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {project.status !== "Resolved" && (
            <div style={styles.addRow}>
              <input
                value={needText}
                onChange={(event) =>
                  setNeedText(event.target.value)
                }
                placeholder="Example: Need someone with a trailer"
                style={styles.input}
              />

              <button
                type="button"
                onClick={addNeed}
                disabled={
                  working ||
                  !needText.trim()
                }
                style={styles.primaryButton}
              >
                Add Need
              </button>
            </div>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            People who offered to help
          </h2>

          {data.helpers.length === 0 ? (
            <p style={styles.muted}>
              No helpers have joined yet.
            </p>
          ) : (
            <div style={styles.list}>
              {data.helpers.map((helper: any) => (
                <article
                  key={helper.id}
                  style={styles.item}
                >
                  <strong>
                    {helper.name || "Volunteer"}
                  </strong>

                  <span>
                    {helper.help_type || "Volunteer"}
                  </span>

                  {helper.notes && (
                    <span style={styles.muted}>
                      {helper.notes}
                    </span>
                  )}

                  <div style={styles.smallActions}>
                    {helper.phone && (
                      <>
                        <a
                          href={`tel:${helper.phone}`}
                          style={styles.smallButton}
                        >
                          Call
                        </a>

                        <a
                          href={`sms:${helper.phone}`}
                          style={styles.smallButton}
                        >
                          Text
                        </a>
                      </>
                    )}

                    {helper.email && (
                      <a
                        href={`mailto:${helper.email}`}
                        style={styles.smallButton}
                      >
                        Email
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Volunteer availability
          </h2>

          {data.availability.length === 0 ? (
            <p style={styles.muted}>
              No availability has been added yet.
            </p>
          ) : (
            <div style={styles.list}>
              {data.availability.map(
                (item: any) => (
                  <div
                    key={item.id}
                    style={styles.item}
                  >
                    <strong>
                      {item.volunteer_name ||
                        "Volunteer"}
                    </strong>

                    <span>
                      {[item.best_day, item.best_time]
                        .filter(Boolean)
                        .join(" - ")}
                    </span>

                    {item.notes && (
                      <span style={styles.muted}>
                        {item.notes}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {(data.tasks.length > 0 ||
          data.materials.length > 0) && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Project coordination
            </h2>

            {data.tasks.length > 0 && (
              <>
                <h3>Tasks</h3>

                <div style={styles.list}>
                  {data.tasks.map((task: any) => (
                    <div
                      key={task.id}
                      style={styles.item}
                    >
                      <strong>
                        {task.title}
                      </strong>

                      <span>
                        {task.status || "Open"}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {data.materials.length > 0 && (
              <>
                <h3 style={{ marginTop: 22 }}>
                  Materials
                </h3>

                <div style={styles.list}>
                  {data.materials.map(
                    (material: any) => (
                      <div
                        key={material.id}
                        style={styles.item}
                      >
                        <strong>
                          {material.title}
                        </strong>

                        {material.assigned_to && (
                          <span>
                            Assigned to:{" "}
                            {material.assigned_to}
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </section>
        )}

        <p style={styles.footerNote}>
          Keep this page private. Anyone with your
          management link may be able to manage this project.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, any> = {
  page: {
    minHeight: "100vh",
    background: "#0b0b0b",
    color: "#f5f5f5",
    padding: "28px 16px 60px",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  card: {
    maxWidth: 760,
    margin: "0 auto",
  },

  kicker: {
    color: "#7ef17a",
    fontWeight: 800,
    marginBottom: 8,
  },

  privateBadge: {
    display: "inline-flex",
    padding: "7px 11px",
    borderRadius: 999,
    border: "1px solid #315c32",
    background: "#142315",
    color: "#9df69a",
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 16,
  },

  title: {
    fontSize: "clamp(30px, 7vw, 52px)",
    lineHeight: 1.02,
    margin: "0 0 12px",
  },

  muted: {
    color: "#a8a8a8",
    lineHeight: 1.55,
  },

  statusBox: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: 16,
    background: "#151515",
    border: "1px solid #292929",
    borderRadius: 14,
    marginTop: 22,
  },

  actions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 16,
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    border: 0,
    borderRadius: 10,
    background: "#39ff14",
    color: "#071006",
    fontWeight: 900,
    padding: "0 16px",
    textDecoration: "none",
    cursor: "pointer",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    border: "1px solid #3a3a3a",
    borderRadius: 10,
    background: "#181818",
    color: "#fff",
    fontWeight: 800,
    padding: "0 16px",
    textDecoration: "none",
    cursor: "pointer",
  },

  section: {
    marginTop: 28,
    padding: 18,
    border: "1px solid #272727",
    borderRadius: 16,
    background: "#111",
  },

  sectionTitle: {
    margin: "0 0 14px",
    fontSize: 22,
  },

  list: {
    display: "grid",
    gap: 10,
  },

  item: {
    display: "grid",
    gap: 5,
    padding: 14,
    borderRadius: 12,
    background: "#171717",
    border: "1px solid #2a2a2a",
  },

  addRow: {
    display: "grid",
    gap: 10,
    marginTop: 14,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 48,
    padding: "0 13px",
    borderRadius: 10,
    border: "1px solid #3a3a3a",
    background: "#0d0d0d",
    color: "#fff",
    fontSize: 16,
  },

  smallActions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 7,
  },

  smallButton: {
    display: "inline-flex",
    padding: "8px 11px",
    borderRadius: 8,
    border: "1px solid #3a3a3a",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 14,
  },

  footerNote: {
    color: "#777",
    lineHeight: 1.5,
    marginTop: 28,
    fontSize: 13,
  },
};
