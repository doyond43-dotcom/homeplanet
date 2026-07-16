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
        .in("status", ["Active", "Resolved"])
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

  function previewText(text: string) {
    const clean = String(text || "").replace(/\s+/g, " ").trim();
    if (clean.length <= 155) return clean;
    return clean.slice(0, 155).trim() + "...";
  }

  const activeEvents = events.filter((event: any) => event.status !== "Resolved");
  const completedEvents = events.filter((event: any) => event.status === "Resolved");

  return (
    <>
      <style>{`
        .okeechobee-event-card {
          transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease, background 180ms ease;
          cursor: pointer;
        }

        .okeechobee-event-card:hover {
          transform: translateY(-2px);
          border-color: rgba(57, 255, 20, 0.55) !important;
          background: linear-gradient(135deg, #1f1f1f 0%, #171f17 100%) !important;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(57, 255, 20, 0.12);
        }

        .okeechobee-event-card:hover h3 {
          color: #39FF14;
        }
      `}</style>

      <ShareMetadata
        title={SHARE_METADATA["/planet/okeechobee"].title}
        description={SHARE_METADATA["/planet/okeechobee"].description}
        image={`https://okeechobeetogether.org${SHARE_METADATA["/planet/okeechobee"].image}`}
        url="https://okeechobeetogether.org"
      />

    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>Okeechobee Together</p>
        <h1 style={styles.title}>Real People. Real Needs. Real Local Support.</h1>

        <p style={styles.emotionalLine}>
          A simple place for Okeechobee neighbors to ask for help, offer help, and follow local community projects.
        </p>

        <p style={styles.subtitle}>
          No drama.<br />
          No politics.<br />
          Just community action.
        </p>

        <div style={styles.actionRow}>
          <Link to="/planet/okeechobee/create-v2" style={styles.primaryButton}>
            I Need Help
          </Link>

          <a href="#projects" style={styles.secondaryButton}>
            I Want To Help
          </a>
        </div>

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gap: 14,
          }}
        >
          <div
            style={{
              padding: 18,
              borderRadius: 18,
              border: "1px solid #222",
              background: "#101010",
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>
              How it works
            </h2>

            <p style={{ margin: 0, color: "#bdbdbd", lineHeight: 1.6 }}>
              Someone shares a local need. Helpers, materials, and updates get organized in one place. The community can see what is happening and how to get involved.
            </p>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: 18,
              border: "1px solid rgba(57,255,20,0.25)",
              background: "linear-gradient(135deg, #101810 0%, #0b0b0b 100%)",
            }}
          >
            <h2 style={{ margin: "0 0 8px", fontSize: 22 }}>
              Want to help or know someone who needs support?
            </h2>

            <p style={{ margin: "0 0 14px", color: "#bdbdbd", lineHeight: 1.6 }}>
              Reach out if you want to volunteer, donate materials, share a local need, or stay connected with future projects.
            </p>

            <Link to="/planet/okeechobee/create-v2" style={styles.primaryButton}>
              Reach Out To Us
            </Link>
          </div>
        </div>

        <section id="projects" style={styles.board}>
          {completedEvents.length > 0 ? (
            <div style={{ marginBottom: 26 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#FFC457",
                      fontSize: 13,
                      fontWeight: 900,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Needs Met
                  </div>

                  <h2 style={{ ...styles.sectionTitle, margin: 0 }}>
                    Completed Projects
                  </h2>
                </div>

                <a
                  href="#active-needs"
                  style={{
                    color: "#7CFF6B",
                    fontSize: 14,
                    fontWeight: 800,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Open Needs ↓
                </a>
              </div>

              <div style={styles.list}>
                {completedEvents.map((event) => (
                  <Link
                    key={event.slug}
                    to={`/planet/okeechobee/event/${event.slug}`}
                    className="okeechobee-event-card"
                    style={styles.eventCard}
                  >
                    <div style={styles.metaRow}>
                      <span style={styles.metaItem}>Need Met</span>
                      <span style={styles.metaItem}>{helperCount(event)} Neighbors Helped</span>
                      <span style={styles.metaItem}>Community Success</span>
                    </div>

                    <h3 style={styles.eventTitle}>{event.title}</h3>
                    <p style={styles.eventText}>{previewText(event.description)}</p>

                    <div style={styles.cardActionRow}>
                      <span>Outcome recorded</span>
                      <strong>View Outcome &gt;</strong>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div id="active-needs">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <div
                  style={{
                    color: "#7CFF6B",
                    fontSize: 13,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Open Needs
                </div>

                <h2 style={{ ...styles.sectionTitle, margin: 0 }}>
                  Active Community Needs
                </h2>
              </div>
            </div>

            <div style={styles.list}>
              {activeEvents.length === 0 ? (
                <div style={styles.emptyCard}>
                  No active community needs right now.
                </div>
              ) : (
                activeEvents.map((event) => (
                  <Link
                    key={event.slug}
                    to={`/planet/okeechobee/event/${event.slug}`}
                    className="okeechobee-event-card"
                    style={styles.eventCard}
                  >
                    <div style={styles.metaRow}>
                      <span style={styles.metaItem}>Local Need</span>
                      <span style={styles.metaItem}>{helperCount(event)} Helpers Joined</span>
                      <span style={styles.metaItem}>Community Responding</span>
                    </div>

                    <h3 style={styles.eventTitle}>{event.title}</h3>
                    <p style={styles.eventText}>{previewText(event.description)}</p>

                    <div style={styles.cardActionRow}>
                      <span>Community need open</span>
                      <strong>View Need &gt;</strong>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
        <div style={styles.footerBox}>
          <h2 style={styles.footerTitle}>This is only the beginning.</h2>
          <p style={styles.footerText}>
            Okeechobee deserves better local connection systems than scattered Facebook comments.
            This board is becoming the place where real needs, offers, and outcomes can live.
          </p>
        </div>

        <div style={styles.footerCtaBox}>
          <div style={styles.footerCtaGlow} />
          <div style={styles.footerCtaKicker}>Built on HomePlanet</div>
          <h3 style={styles.footerCtaTitle}>
            Build something like this for your community, group, or local business.
          </h3>
          <p style={styles.footerCtaText}>
            Turn scattered messages, needs, offers, updates, and outcomes into one organized place where people can actually take action.
          </p>
          <Link to="/planet/build-your-live-system" style={styles.footerCtaButton}>
            Build Something Like This
          </Link>
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
  cardActionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid #262626",
    color: "#a8a8a8",
    fontSize: 13,
    fontWeight: 800,
  },
  footerBox: {
    marginTop: 30,
    padding: "28px 24px",
    borderRadius: 28,
    background: "linear-gradient(135deg, rgba(16,16,16,0.98), rgba(8,24,14,0.94))",
    border: "1px solid rgba(57,255,20,0.18)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  },
  footerTitle: {
    margin: 0,
    fontSize: 34,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
  },
  footerText: {
    margin: "12px 0 0",
    color: "#d7e5dc",
    fontSize: 17,
    fontWeight: 750,
    lineHeight: 1.65,
  },
  footerCtaBox: {
    position: "relative",
    overflow: "hidden",
    marginTop: 14,
    padding: "18px 18px",
    borderRadius: 22,
    background:
      "radial-gradient(circle at 18% 0%, rgba(57,255,20,0.10), transparent 34%), linear-gradient(135deg, rgba(8,16,11,0.92), rgba(5,8,6,0.96))",
    border: "1px solid rgba(57,255,20,0.18)",
    boxShadow: "0 14px 42px rgba(0,0,0,0.38)",
    textAlign: "left",
  },
  footerCtaGlow: {
    position: "absolute",
    inset: -80,
    background: "radial-gradient(circle, rgba(57,255,20,0.06), transparent 58%)",
    pointerEvents: "none",
  },
  footerCtaKicker: {
    position: "relative",
    color: "#7dff9d",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    opacity: 0.82,
  },
  footerCtaTitle: {
    position: "relative",
    margin: "8px 0 6px",
    maxWidth: 620,
    color: "#f8fafc",
    fontSize: 21,
    lineHeight: 1.18,
    letterSpacing: "-0.03em",
  },
  footerCtaText: {
    position: "relative",
    maxWidth: 640,
    margin: "0 0 14px",
    color: "#b9c9bf",
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.55,
  },
  footerCtaButton: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    padding: "0 15px",
    borderRadius: 999,
    background: "rgba(57,255,20,0.12)",
    border: "1px solid rgba(57,255,20,0.28)",
    color: "#b7ffb0",
    fontSize: 13,
    fontWeight: 900,
    textDecoration: "none",
    boxShadow: "none",
  },
};






























