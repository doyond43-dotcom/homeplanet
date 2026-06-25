import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function OkeechobeeEventPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadEvent() {
    if (!slug) return;

    const { data, error } = await supabase
      .from("okeechobee_events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(error);
      setEvent(null);
    } else {
      setEvent(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEvent();
  }, [slug]);

  async function joinEvent() {
    if (!event) return;

    const updatedTimeline = [
      ...(event.timeline || []),
      { label: "Someone offered to help", time: new Date().toISOString() },
    ];

    const { error } = await supabase
      .from("okeechobee_events")
      .update({ timeline: updatedTimeline })
      .eq("slug", event.slug);

    if (error) {
      console.error(error);
      alert("Something went wrong updating this post.");
      return;
    }

    setEvent({ ...event, timeline: updatedTimeline });
  }

  async function markResolved() {
    if (!event) return;

    const updatedTimeline = [
      ...(event.timeline || []),
      { label: "Need resolved", time: new Date().toISOString() },
    ];

    const { error } = await supabase
      .from("okeechobee_events")
      .update({ status: "Resolved", timeline: updatedTimeline })
      .eq("slug", event.slug);

    if (error) {
      console.error(error);
      alert("Something went wrong resolving this post.");
      return;
    }

    setEvent({ ...event, status: "Resolved", timeline: updatedTimeline });
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.subtitle}>Loading community post...</p>
        </section>
      </main>
    );
  }

  if (!event) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>Event not found</h1>
          <Link style={styles.link} to="/planet/okeechobee/create">Create one</Link>
        </section>
      </main>
    );
  }

  const helperCount = (event.timeline || []).filter((item: any) =>
    String(item.label || "").toLowerCase().includes("help") ||
    String(item.label || "").toLowerCase().includes("joined")
  ).length;

  const shareUrl = window.location.href;

  async function shareEvent() {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: event.description,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied.");
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>{event.type} · Okeechobee Together</p>
        <h1 style={styles.title}>{event.title}</h1>
        <p style={styles.subtitle}>{event.description}</p>

        <div style={styles.infoBox}>
          <p><strong>Status:</strong> {event.status}</p>
          <p><strong>Location:</strong> {event.location || "Not listed"}</p>
          <p><strong>Contact:</strong> {event.contact || "Not listed"}</p>
          <p><strong>Helpers:</strong> {helperCount}</p>
        </div>

        <div style={styles.actions}>
          {event.status === "Resolved" ? (
            <div style={styles.resolvedButton}>✓ Need Met</div>
          ) : (
            <>
              <button onClick={joinEvent} style={styles.primaryButton}>
                I&apos;ll Help
              </button>

              <button onClick={markResolved} style={styles.secondaryButton}>
                Mark Resolved
              </button>
            </>
          )}

          <button onClick={shareEvent} style={styles.secondaryButton}>
            Share This Event
          </button>
        </div>

        <section style={styles.timeline}>
          <h2 style={styles.sectionTitle}>Timeline</h2>

          {(event.timeline || []).map((item: any, index: number) => (
            <div key={index} style={styles.timelineItem}>
              <strong>{item.label}</strong>
              <p style={styles.time}>{new Date(item.time).toLocaleString()}</p>
            </div>
          ))}
        </section>

        <Link style={styles.link} to="/planet/okeechobee/create">
          Create another community post
        </Link>
      </section>
    </main>
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
    fontSize: 34,
    lineHeight: 1.05,
  },
  subtitle: {
    color: "#b8b8b8",
    margin: 0,
    lineHeight: 1.5,
  },
  infoBox: {
    marginTop: 22,
    padding: 16,
    border: "1px solid #2b2b2b",
    borderRadius: 18,
    background: "#181818",
    color: "#e8e8e8",
  },
  actions: {
    display: "grid",
    gap: 12,
    marginTop: 22,
  },
  primaryButton: {
    border: 0,
    borderRadius: 999,
    background: "#39FF14",
    color: "#050505",
    padding: "15px 18px",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
  resolvedButton: {
    borderRadius: 999,
    background: "#39FF14",
    color: "#050505",
    padding: "15px 18px",
    fontWeight: 900,
    fontSize: 16,
    textAlign: "center",
  },
  secondaryButton: {
    border: "1px solid #333",
    borderRadius: 999,
    background: "#181818",
    color: "white",
    padding: "15px 18px",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
  },
  timeline: {
    marginTop: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  timelineItem: {
    padding: "14px 0",
    borderBottom: "1px solid #242424",
  },
  time: {
    color: "#888",
    margin: "6px 0 0",
  },
  link: {
    display: "inline-block",
    marginTop: 28,
    color: "#39FF14",
    fontWeight: 800,
    textDecoration: "none",
  },
};
