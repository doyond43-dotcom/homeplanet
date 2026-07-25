import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function OkeechobeeCommandCenter() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingSlug, setWorkingSlug] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");

  function openReview(event: any) {
    setSelectedEvent(event);
    setDraftTitle(event.public_title || event.title || "");
    setDraftDescription(event.public_description || event.description || "");
  }

  function closeReview() {
    setSelectedEvent(null);
  }


  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);

    const { data, error } = await supabase
      .from("okeechobee_events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setNotice("Could not load the projects.");
    } else {
      setEvents(data || []);
    }

    setLoading(false);
  }

  async function changeStatus(event: any, status: string) {
    if (status === "Archived Test") {
      const confirmed = window.confirm(
        `Archive "${event.title}" as a test or unused request?`
      );

      if (!confirmed) return;
    }

    setWorkingSlug(event.slug);
    setNotice("");

    const { error } = await supabase
      .from("okeechobee_events")
      .update({ status })
      .eq("slug", event.slug);

    if (error) {
      console.error(error);
      setNotice("The status could not be updated.");
      setWorkingSlug(null);
      return;
    }

    setEvents((current) =>
      current.map((item) =>
        item.slug === event.slug ? { ...item, status } : item
      )
    );

    if (status === "Active") {
      setNotice(`"${event.title}" is now active and ready to share.`);
    } else if (status === "Pending Review") {
      setNotice(`"${event.title}" has been paused.`);
    } else {
      setNotice(`"${event.title}" has been archived.`);
    }

    setWorkingSlug(null);
  }

  async function copyPublicLink(event: any) {
    const publicUrl = `${window.location.origin}/planet/okeechobee/event/${event.slug}`;

    try {
      await navigator.clipboard.writeText(publicUrl);
      setNotice(`Public link copied for "${event.title}".`);
    } catch (error) {
      console.error(error);
      window.prompt("Copy this public link:", publicUrl);
    }
  }

  function helperCount(event: any) {
    return (event.timeline || []).filter((item: any) =>
      String(item.label || "").toLowerCase().includes(" joined as ")
    ).length;
  }

  const pendingEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          String(event.status || "").toLowerCase() === "pending review"
      ),
    [events]
  );

  const activeEvents = useMemo(
    () =>
      events.filter(
        (event) => String(event.status || "").toLowerCase() === "active"
      ),
    [events]
  );

  const totals = useMemo(() => {
    return {
      activeProjects: activeEvents.length,
      totalHelpers: activeEvents.reduce(
        (sum, event) => sum + helperCount(event),
        0
      ),
      totalViews: activeEvents.reduce(
        (sum, event) => sum + (event.views || 0),
        0
      ),
      totalShares: activeEvents.reduce(
        (sum, event) => sum + (event.shares || 0),
        0
      ),
    };
  }, [activeEvents]);

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <h1>Loading Community Operations Center...</h1>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.hero}>
          <div style={styles.kicker}>Okeechobee Together</div>

          <h1 style={styles.heroTitle}>Community Operations Center</h1>

          <p style={styles.heroText}>
            Review new requests, activate real projects, and share the public
            project page.
          </p>
        </header>

        {notice ? <div style={styles.notice}>{notice}</div> : null}

        <section style={styles.section}>
          <div style={styles.sectionHeading}>
            <div>
              <div style={styles.sectionEyebrow}>Incoming requests</div>
              <h2 style={styles.sectionTitle}>Needs Waiting for Review</h2>
              <p style={styles.sectionText}>
                Review these before making them visible as active projects.
              </p>
            </div>

            <div style={styles.countBadge}>{pendingEvents.length}</div>
          </div>

          {pendingEvents.length === 0 ? (
            <div style={styles.emptyCard}>
              No requests are waiting for review.
            </div>
          ) : (
            <div style={styles.cards}>
              {pendingEvents.map((event) => (
                <article key={event.id} style={styles.pendingCard}>
                  <div style={styles.cardTop}>
                    <div>
                      <div style={styles.pendingBadge}>Pending Review</div>
                      <h3 style={styles.cardTitle}>{event.title}</h3>
                    </div>
                  </div>

                  <div style={styles.detailsGrid}>
                    <div style={styles.detailBox}>
                      <span style={styles.detailLabel}>Location</span>
                      <span>{event.location || "Not listed"}</span>
                    </div>

                    <div style={styles.detailBox}>
                      <span style={styles.detailLabel}>Contact</span>
                      <span>{event.contact || "Not listed"}</span>
                    </div>
                  </div>

                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={() => openReview(event)}
                    >
                      Review Request
                    </button>

                    <button
                      type="button"
                      style={styles.primaryButton}
                      disabled={workingSlug === event.slug}
                      onClick={() => changeStatus(event, "Active")}
                    >
                      {workingSlug === event.slug
                        ? "Updating..."
                        : "Make Active"}
                    </button>

                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={() => copyPublicLink(event)}
                    >
                      Copy Public Link
                    </button>

                    <button
                      type="button"
                      style={styles.archiveButton}
                      disabled={workingSlug === event.slug}
                      onClick={() => changeStatus(event, "Archived Test")}
                    >
                      Archive
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <strong>Active Projects</strong>
            <div style={styles.statNumber}>{totals.activeProjects}</div>
          </div>

          <div style={styles.statCard}>
            <strong>Total Helpers</strong>
            <div style={styles.statNumber}>{totals.totalHelpers}</div>
          </div>

          <div style={styles.statCard}>
            <strong>Total Views</strong>
            <div style={styles.statNumber}>{totals.totalViews}</div>
          </div>

          <div style={styles.statCard}>
            <strong>Total Shares</strong>
            <div style={styles.statNumber}>{totals.totalShares}</div>
          </div>
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeading}>
            <div>
              <div style={styles.sectionEyebrow}>Public projects</div>
              <h2 style={styles.sectionTitle}>Active Projects</h2>
              <p style={styles.sectionText}>
                These projects are currently visible to the community.
              </p>
            </div>

            <div style={styles.activeCountBadge}>{activeEvents.length}</div>
          </div>

          {activeEvents.length === 0 ? (
            <div style={styles.emptyCard}>There are no active projects.</div>
          ) : (
            <div style={styles.cards}>
              {activeEvents.map((event) => (
                <article key={event.id} style={styles.activeCard}>
                  <div style={styles.cardTop}>
                    <div>
                      <div style={styles.activeBadge}>Active</div>
                      <h3 style={styles.cardTitle}>{event.title}</h3>
                    </div>

                    <div style={styles.helperBadge}>
                      {helperCount(event)}{" "}
                      {helperCount(event) === 1 ? "helper" : "helpers"}
                    </div>
                  </div>

                  <div style={styles.projectStats}>
                    <span>{event.views || 0} views</span>
                    <span>{event.shares || 0} shares</span>
                  </div>

                  <div style={styles.actions}>
                    <Link
                      to={`/planet/okeechobee/project/${event.slug}`}
                      style={styles.primaryButton}
                    >
                      Open Workspace
                    </Link>

                    <Link
                      to={`/planet/okeechobee/event/${event.slug}`}
                      style={styles.secondaryButton}
                    >
                      Open Public Page
                    </Link>

                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={() => copyPublicLink(event)}
                    >
                      Copy Public Link
                    </button>

                    <button
                      type="button"
                      style={styles.pauseButton}
                      disabled={workingSlug === event.slug}
                      onClick={() => changeStatus(event, "Pending Review")}
                    >
                      {workingSlug === event.slug
                        ? "Updating..."
                        : "Pause Project"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        {selectedEvent && (
          <div style={styles.drawerBackdrop} onClick={closeReview}>
            <aside
              style={styles.drawer}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginTop: 0 }}>Review Request</h2>

              <div style={styles.drawerSection}>
                <div style={styles.detailLabel}>Resident Request</div>
                <div style={styles.readOnlyBox}>
                  <strong>{selectedEvent.title}</strong>
                  <div style={{ marginTop: 8 }}>
                    {selectedEvent.description || "No description provided."}
                  </div>
                </div>
              </div>

              <div style={styles.drawerSection}>
                <div style={styles.detailLabel}>Project Title</div>

                <input
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  style={styles.input}
                />

                <div style={{ height: 16 }} />

                <div style={styles.detailLabel}>Project Description</div>

                <textarea
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  style={styles.textarea}
                />
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.secondaryButton}
                  onClick={async () => {
                    if (!selectedEvent) return;

                    const { error } = await supabase
                      .from("okeechobee_events")
                      .update({
                        public_title: draftTitle,
                        public_description: draftDescription,
                      })
                      .eq("id", selectedEvent.id);

                    if (error) {
                      alert(error.message);
                      return;
                    }

                    await loadEvents();
                    closeReview();
                  }}
                >
                  Save
                </button>

                <button
                  style={styles.primaryButton}
                  onClick={async () => {
                    if (!selectedEvent) return;

                    const { error } = await supabase
                      .from("okeechobee_events")
                      .update({
                        public_title: draftTitle,
                        public_description: draftDescription,
                        status: "Published",
                      })
                      .eq("id", selectedEvent.id);

                    if (error) {
                      alert(error.message);
                      return;
                    }

                    await loadEvents();
                    closeReview();
                  }}
                >
                  Publish Project
                </button>

                <button
                  style={styles.archiveButton}
                  onClick={closeReview}
                >
                  Close
                </button>
              </div>
            </aside>
          </div>
        )}

      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "#ffffff",
    padding: "24px 16px 64px",
    fontFamily: "Inter, sans-serif",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  hero: {
    background: "#111111",
    border: "1px solid #242424",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  kicker: {
    color: "#39ff14",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(32px, 6vw, 48px)",
    lineHeight: 1.05,
  },
  heroText: {
    color: "#a3a3a3",
    margin: "12px 0 0",
    fontSize: 17,
    lineHeight: 1.55,
  },
  notice: {
    marginBottom: 20,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(57, 255, 20, 0.1)",
    border: "1px solid rgba(57, 255, 20, 0.32)",
    color: "#c8ffbe",
    fontWeight: 800,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeading: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 14,
  },
  sectionEyebrow: {
    color: "#8b8b8b",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  sectionTitle: {
    margin: 0,
    fontSize: "clamp(25px, 5vw, 34px)",
  },
  sectionText: {
    margin: "7px 0 0",
    color: "#9a9a9a",
    lineHeight: 1.5,
  },
  countBadge: {
    minWidth: 44,
    height: 44,
    display: "grid",
    placeItems: "center",
    borderRadius: 999,
    background: "#facc15",
    color: "#111111",
    fontWeight: 900,
    fontSize: 19,
  },
  activeCountBadge: {
    minWidth: 44,
    height: 44,
    display: "grid",
    placeItems: "center",
    borderRadius: 999,
    background: "#39ff14",
    color: "#050505",
    fontWeight: 900,
    fontSize: 19,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    background: "#111111",
    border: "1px solid #242424",
    borderRadius: 18,
    padding: 18,
    color: "#b7b7b7",
  },
  statNumber: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 30,
    fontWeight: 900,
  },
  cards: {
    display: "grid",
    gap: 14,
  },
  pendingCard: {
    background: "#111111",
    border: "1px solid rgba(250, 204, 21, 0.32)",
    borderRadius: 20,
    padding: 20,
  },
  activeCard: {
    background: "#111111",
    border: "1px solid rgba(57, 255, 20, 0.24)",
    borderRadius: 20,
    padding: 20,
  },
  emptyCard: {
    padding: 22,
    borderRadius: 18,
    border: "1px dashed #333333",
    color: "#999999",
    background: "#0d0d0d",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },
  cardTitle: {
    margin: "10px 0 0",
    fontSize: 23,
    lineHeight: 1.25,
  },
  pendingBadge: {
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(250, 204, 21, 0.14)",
    color: "#fde047",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  activeBadge: {
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(57, 255, 20, 0.12)",
    color: "#86ff70",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  helperBadge: {
    padding: "8px 11px",
    borderRadius: 999,
    background: "#1c1c1c",
    color: "#d4d4d4",
    fontWeight: 800,
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
    marginTop: 16,
  },
  detailBox: {
    display: "grid",
    gap: 5,
    padding: 13,
    borderRadius: 14,
    background: "#0b0b0b",
    border: "1px solid #242424",
    lineHeight: 1.45,
    overflowWrap: "anywhere",
  },
  detailLabel: {
    color: "#858585",
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  projectStats: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    marginTop: 14,
    color: "#9d9d9d",
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  primaryButton: {
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    padding: "11px 16px",
    borderRadius: 999,
    border: "1px solid #39ff14",
    background: "#39ff14",
    color: "#050505",
    textDecoration: "none",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 14,
  },
  secondaryButton: {
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    padding: "11px 16px",
    borderRadius: 999,
    border: "1px solid #343434",
    background: "#181818",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 850,
    cursor: "pointer",
    fontSize: 14,
  },
  pauseButton: {
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    padding: "11px 16px",
    borderRadius: 999,
    border: "1px solid rgba(250, 204, 21, 0.42)",
    background: "rgba(250, 204, 21, 0.08)",
    color: "#fde047",
    fontWeight: 850,
    cursor: "pointer",
    fontSize: 14,
  },
  archiveButton: {
    appearance: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    padding: "11px 16px",
    borderRadius: 999,
    border: "1px solid rgba(248, 113, 113, 0.35)",
    background: "rgba(248, 113, 113, 0.07)",
    color: "#fca5a5",
    fontWeight: 850,
    cursor: "pointer",
    fontSize: 14,
  },

  drawerBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.65)",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: 1000,
  },

  drawer: {
    width: "min(720px,100%)",
    height: "100%",
    overflowY: "auto",
    background: "#111111",
    padding: 28,
    borderLeft: "1px solid #2a2a2a",
  },

  drawerSection: {
    marginBottom: 24,
  },

  readOnlyBox: {
    background: "#0b0b0b",
    border: "1px solid #2b2b2b",
    borderRadius: 14,
    padding: 16,
    lineHeight: 1.6,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid #333",
    background: "#0d0d0d",
    color: "#fff",
    fontSize: 16,
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: 180,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #333",
    background: "#0d0d0d",
    color: "#fff",
    fontSize: 16,
    resize: "vertical",
    boxSizing: "border-box",
  },
};
