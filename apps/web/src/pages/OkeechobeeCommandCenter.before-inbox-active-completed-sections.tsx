import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function OkeechobeeCommandCenter() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const { data, error } = await supabase
      .from("okeechobee_events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setEvents(data || []);
    }

    setLoading(false);
  }

  const totals = useMemo(() => {
    const activeProjects = events.length;

    const totalViews = events.reduce(
      (sum, event) => sum + (event.views || 0),
      0
    );

    const totalShares = events.reduce(
      (sum, event) => sum + (event.shares || 0),
      0
    );

    const totalHelpers = events.reduce((sum, event) => {
      const helpers = (event.timeline || []).filter((item: any) =>
        String(item.label || "").toLowerCase().includes("joined")
      ).length;

      return sum + helpers;
    }, 0);


    const needsAttention = events.filter((event) => {
      const helpers = (event.timeline || []).filter((item: any) =>
        String(item.label || "").toLowerCase().includes("joined")
      ).length;

      return helpers === 0;
    }).length;

    const strongResponse = events.filter((event) => {
      const views = event.views || 0;

      const helpers = (event.timeline || []).filter((item: any) =>
        String(item.label || "").toLowerCase().includes("joined")
      ).length;

      if (!views) return false;

      return (helpers / views) * 100 >= 20;
    }).length;

    const moderateResponse =
      activeProjects - needsAttention - strongResponse;

    return {
      activeProjects,
      totalViews,
      totalShares,
      totalHelpers,
      needsAttention,
      moderateResponse,
      strongResponse,
    };
  }, [events]);

  function helperCount(event: any) {
    return (event.timeline || []).filter((item: any) =>
      String(item.label || "").toLowerCase().includes("joined")
    ).length;
  }

  function responseRate(event: any) {
    const views = event.views || 0;
    const helpers = helperCount(event);

    if (!views) return 0;

    return Number(((helpers / views) * 100).toFixed(1));
  }

  function projectNeeds(event: any) {
    const title = String(event.title || "").toLowerCase();

    if (title.includes("recovery")) {
      return [
        "Wheelchair Ramp",
        "Electrician",
        "Transportation",
        "Bathroom Vanity"
      ];
    }

    if (title.includes("trailer")) {
      return [
        "Pickup Truck",
        "Loading Assistance"
      ];
    }

    if (title.includes("fence")) {
      return [
        "Fence Loading Help"
      ];
    }

    return [];
  }

  function responseLabel(event: any) {
    const rate = responseRate(event);

    if (rate >= 20) return "🟢 Strong Community Response";
    if (rate >= 10) return "🟡 Moderate Community Response";

    return "🔴 Needs Attention";
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <h1>Loading Command Center...</h1>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <div style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
        }}>
          <div style={{
            color: "#39FF14",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}>
            Okeechobee Together
          </div>

          <div style={{
            fontSize: 42,
            fontWeight: 900,
          }}>
            Community Operations Center
          </div>

          <div style={{
            color: "#999",
            marginTop: 8,
          }}>
            Active projects, volunteers, needs, and community response.
          </div>
        </div>

        <h1 style={{ display: "none" }}>
          Okeechobee Together Command Center
        </h1>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <strong>Active Projects</strong>
            <div>{totals.activeProjects}</div>
          </div>

          <div style={styles.statCard}>
            <strong>Total Helpers</strong>
            <div>{totals.totalHelpers}</div>
          </div>

          <div style={styles.statCard}>
            <strong>Total Views</strong>
            <div>{totals.totalViews}</div>
          </div>

          <div style={styles.statCard}>
            <strong>Total Shares</strong>
            <div>{totals.totalShares}</div>
          </div>
        </div>

        <div style={styles.cards}>
          {[...events]
            .sort((a, b) => responseRate(a) - responseRate(b))
            .map((event) => (
            <div key={event.id} style={styles.card}>
              <h2 style={styles.cardTitle}>{event.title}</h2>

              <p>{responseLabel(event)}</p>

              <p>Views: {event.views || 0}</p>
              <p>Shares: {event.shares || 0}</p>
              <p>Helpers: {helperCount(event)}</p>
              <p>Response Rate: {responseRate(event)}%</p>

              <Link
                to={`/planet/okeechobee/project/${event.slug}`}
                style={styles.button}
              >
                View Project
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "white",
    padding: 24,
    fontFamily: "Inter, sans-serif",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  title: {
    marginBottom: 24,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 18,
    padding: 20,
  },
  cards: {
    display: "grid",
    gap: 16,
  },
  card: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 18,
    padding: 20,
  },
  cardTitle: {
    marginTop: 0,
  },
  button: {
    display: "inline-block",
    marginTop: 12,
    padding: "10px 16px",
    borderRadius: 999,
    background: "#39FF14",
    color: "#050505",
    textDecoration: "none",
    fontWeight: 800,
  },
};








