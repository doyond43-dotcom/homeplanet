import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ShareMetadata from "../components/ShareMetadata";
import { SHARE_METADATA } from "../lib/shareMetadata";

export default function OkeechobeeTogetherPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from("okeechobee_events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setEvents(data || []);
    }

    loadEvents();
  }, []);

  function helperCount(event: any) {
    return (event.timeline || []).filter((item: any) =>
      String(item.label || "").toLowerCase().includes("help") ||
      String(item.label || "").toLowerCase().includes("joined")
    ).length;
  }

  const sortedEvents = [...events].sort((a: any, b: any) => {
    if (a.status === "Resolved" && b.status !== "Resolved") return -1;
    if (a.status !== "Resolved" && b.status === "Resolved") return 1;
    return 0;
  });

  return (
    <>
      <ShareMetadata
        title={SHARE_METADATA["/planet/okeechobee"].title}
        description={SHARE_METADATA["/planet/okeechobee"].description}
        image={`https://www.homeplanet.city${SHARE_METADATA["/planet/okeechobee"].image}`}
        url="https://www.homeplanet.city/planet/okeechobee"
      />

    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>Okeechobee Together</p>
        <h1 style={styles.title}>Community Action Board</h1>

        <p style={styles.emotionalLine}>
          Real people. Real needs. Real local support.
        </p>

        <p style={styles.subtitle}>
          One flat tire.<br />
          One missed paycheck.<br />
          One broken AC unit.
        </p>

        <p style={styles.missionText}>
          That is all it takes for a family to fall behind.
        </p>

        <p style={styles.missionText}>
          This board connects people who need help with people willing to help.
        </p>

        <div style={styles.actionRow}>
          <Link to="/planet/okeechobee/create" style={styles.primaryButton}>
            I Need Help
          </Link>

          <a href="#projects" style={styles.secondaryButton}>
            I Want To Help
          </a>
        </div>

        <section id="projects" style={styles.board}>
          <h2 style={styles.sectionTitle}>Live Community Posts</h2>

          <div style={styles.list}>
            {sortedEvents.length === 0 ? (
              <div style={styles.emptyCard}>
                No live community posts yet. Create the first one.
              </div>
            ) : (
              sortedEvents.map((event) => (
                <Link
                  key={event.slug}
                  to={`/planet/okeechobee/event/${event.slug}`}
                  style={styles.eventCard}
                >
                  <div style={styles.metaRow}>
                    {event.status === "Resolved" ? (
                      <>
                        <span style={styles.metaItem}>
                          Need Met
                        </span>

                        <span style={styles.metaItem}>
                          {helperCount(event)} Neighbors Helped
                        </span>

                        <span style={styles.metaItem}>
                          Community Success
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={styles.metaItem}>
                          Local Need
                        </span>

                        <span style={styles.metaItem}>
                          {helperCount(event)} Helpers Joined
                        </span>

                        <span style={styles.metaItem}>
                          Community Responding
                        </span>
                      </>
                    )}
                  </div>

                  <h3 style={styles.eventTitle}>{event.title}</h3>
                  <p style={styles.eventText}>{event.description}</p>
                </Link>
              ))
            )}
          </div>
        </section>

        <div style={styles.footerBox}>
          <h2 style={styles.footerTitle}>This is only the beginning.</h2>
          <p style={styles.footerText}>
            Okeechobee deserves better local connection systems than scattered Facebook comments.
            This board is becoming the place where real needs, offers, and outcomes can live.
          </p>
        </div>
      </section>
    </main>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "white",
    padding: "28px 18px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    maxWidth: 760,
    margin: "0 auto",
    background: "#101010",
    border: "1px solid #242424",
    borderRadius: 24,
    padding: 24,
  },
  kicker: {
    color: "#39FF14",
    fontWeight: 800,
    margin: 0,
  },
  title: {
    margin: "10px 0 8px",
    fontSize: 42,
    lineHeight: 1.05,
  },
  subtitle: {
    color: "#e5e5e5",
    margin: 0,
    lineHeight: 1.7,
    fontSize: 18,
    fontWeight: 500,
  },
  emotionalLine: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: 900,
    marginTop: 12,
    marginBottom: 12,
    lineHeight: 1.3,
  },
  missionText: {
    color: "#dedede",
    lineHeight: 1.75,
    marginTop: 16,
    fontSize: 18,
    fontWeight: 500,
  },
  actionRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    width: "92%",
    marginTop: 24,
    marginRight: "auto",
    marginBottom: 24,
    marginLeft: "auto",
  },
  primaryButton: {
    display: "block",
    borderRadius: 999,
    background: "#39FF14",
    color: "#050505",
    padding: "15px 18px",
    fontWeight: 900,
    fontSize: 16,
    textAlign: "center",
    textDecoration: "none",
  },
  secondaryButton: {
    display: "block",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    border: "1px solid rgba(57,255,20,0.65)",
    padding: "15px 18px",
    fontWeight: 900,
    fontSize: 16,
    textAlign: "center",
    textDecoration: "none",
  },
  publicNotice: {
    background: "rgba(57, 255, 20, 0.08)",
    border: "1px solid rgba(57, 255, 20, 0.22)",
    borderRadius: 999,
    color: "#d8ffd2",
    fontWeight: 800,
    lineHeight: 1.4,
    margin: "28px 0",
    padding: "18px 22px",
    textAlign: "center",
  },
  board: {
    marginTop: 30,
  },
  sectionTitle: {
    margin: "0 0 14px",
    fontSize: 22,
  },
  list: {
    display: "grid",
    gap: 14,
  },
  emptyCard: {
    border: "1px solid #242424",
    borderRadius: 18,
    background: "#181818",
    padding: 18,
    color: "#e5e5e5",
  },
  eventCard: {
    display: "block",
    border: "1px solid #242424",
    borderRadius: 18,
    background: "#181818",
    padding: 18,
    color: "white",
    textDecoration: "none",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 18,
    marginBottom: 12,
    color: "#b8b8b8",
    fontSize: 14,
    fontWeight: 700,
  },

  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  eventTitle: {
    margin: "14px 0 6px",
    fontSize: 21,
    lineHeight: 1.2,
  },
  eventText: {
    color: "#dedede",
    margin: 0,
    lineHeight: 1.6,
    fontSize: 16,
  },
  footerBox: {
    marginTop: 28,
    border: "1px solid #242424",
    borderRadius: 18,
    background: "#181818",
    padding: 18,
  },
  footerTitle: {
    margin: 0,
    fontSize: 20,
  },
  footerText: {
    color: "#dedede",
    lineHeight: 1.6,
    margin: "10px 0 0",
    fontSize: 16,
  },
};

















