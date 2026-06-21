import React, { useEffect, useMemo, useState } from "react";

type ChallengeKey =
  | "Get More Customers"
  | "Organize My Business"
  | "My Website Isn't Working"
  | "Track Leads & Customers"
  | "Scheduling & Appointments"
  | "Show Me Real Examples";

type AwarenessStats = {
  totalVisits: number;
  intakeSubmissions: number;
  challengeClicks: Record<ChallengeKey, number>;
};

const challenges: {
  title: ChallengeKey;
  body: string;
}[] = [
  {
    title: "Get More Customers",
    body: "More calls. More messages. More opportunities.",
  },
  {
    title: "Organize My Business",
    body: "Customers, jobs, photos, notes, and follow-up in one place.",
  },
  {
    title: "My Website Isn't Working",
    body: "I have a website, but it isn't helping enough.",
  },
  {
    title: "Track Leads & Customers",
    body: "See what's working instead of guessing.",
  },
  {
    title: "Scheduling & Appointments",
    body: "Make booking and follow-up easier.",
  },
  {
    title: "Show Me Real Examples",
    body: "See real HomePlanet systems in action.",
  },
];

const emptyClicks = challenges.reduce((acc, item) => {
  acc[item.title] = 0;
  return acc;
}, {} as Record<ChallengeKey, number>);

const defaultStats: AwarenessStats = {
  totalVisits: 0,
  intakeSubmissions: 0,
  challengeClicks: emptyClicks,
};

const STORAGE_KEY = "homeplanet-market-awareness-v1";

function readStats(): AwarenessStats {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStats;

    const parsed = JSON.parse(raw) as AwarenessStats;

    return {
      totalVisits: Number(parsed.totalVisits || 0),
      intakeSubmissions: Number(parsed.intakeSubmissions || 0),
      challengeClicks: {
        ...emptyClicks,
        ...(parsed.challengeClicks || {}),
      },
    };
  } catch {
    return defaultStats;
  }
}

function saveStats(next: AwarenessStats) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function AwarenessDashboard({ stats }: { stats: AwarenessStats }) {
  const mostSelectedChallenge = useMemo(() => {
    const rows = Object.entries(stats.challengeClicks) as [ChallengeKey, number][];
    const winner = rows.reduce(
      (best, current) => (current[1] > best[1] ? current : best),
      rows[0]
    );

    return winner && winner[1] > 0 ? winner[0] : "None yet";
  }, [stats.challengeClicks]);

  const totalChallengeClicks = useMemo(() => {
    return Object.values(stats.challengeClicks).reduce((sum, count) => sum + count, 0);
  }, [stats.challengeClicks]);

  const conversionRate = useMemo(() => {
    if (!stats.totalVisits) return "0%";
    return `${Math.round((stats.intakeSubmissions / stats.totalVisits) * 100)}%`;
  }, [stats.totalVisits, stats.intakeSubmissions]);

  return (
    <section style={styles.dashboardCard}>
      <div style={styles.dashboardHeader}>
        <div>
          <div style={styles.kicker}>Awareness Dashboard</div>
          <h1 style={styles.dashboardTitle}>HomePlanet Market Awareness</h1>
        </div>
      </div>

      <div style={styles.metricsGrid}>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Total Visits</span>
          <strong style={styles.metricValue}>{stats.totalVisits}</strong>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Challenge Clicks</span>
          <strong style={styles.metricValue}>{totalChallengeClicks}</strong>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Intake Submissions</span>
          <strong style={styles.metricValue}>{stats.intakeSubmissions}</strong>
        </div>
        <div style={styles.metricBox}>
          <span style={styles.metricLabel}>Conversion Rate</span>
          <strong style={styles.metricValue}>{conversionRate}</strong>
        </div>
      </div>

      <div style={styles.mostSelected}>
        Most Selected Challenge: <strong>{mostSelectedChallenge}</strong>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHead}>
          <span>Challenge</span>
          <span>Clicks</span>
        </div>

        {challenges.map((challenge) => (
          <div key={challenge.title} style={styles.tableRow}>
            <span>{challenge.title}</span>
            <strong>{stats.challengeClicks[challenge.title] || 0}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomePlanetMarketAwarenessDashboardV1() {
  const [stats, setStats] = useState<AwarenessStats>(defaultStats);

  useEffect(() => {
    setStats(readStats());
  }, []);

  return (
    <main style={styles.page}>
      <section style={styles.glowOne} />
      <section style={styles.glowTwo} />

      <div style={styles.shell}>
        <section style={styles.operatorHero}>
          <div style={styles.kicker}>HomePlanet Operator View</div>
          <h1 style={styles.operatorTitle}>Awareness Tracking</h1>
          <p style={styles.operatorSubtitle}>
            This is the internal view for watching what business owners click, what they care about,
            and which direction HomePlanet should build next.
          </p>
        </section>

        <AwarenessDashboard stats={stats} />
      </div>
    </main>
  );
}

export default function HomePlanetMarketAwarenessFunnelV1() {
  const [stats, setStats] = useState<AwarenessStats>(defaultStats);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeKey | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    improvement: "",
    name: "",
    phone: "",
    businessName: "",
  });

  useEffect(() => {
    const current = readStats();
    const next = {
      ...current,
      totalVisits: current.totalVisits + 1,
    };
    saveStats(next);
    setStats(next);
  }, []);

  function handleChallengeClick(challenge: ChallengeKey) {
    const current = readStats();
    const next: AwarenessStats = {
      ...current,
      challengeClicks: {
        ...emptyClicks,
        ...current.challengeClicks,
        [challenge]: (current.challengeClicks?.[challenge] || 0) + 1,
      },
    };

    saveStats(next);
    setStats(next);
    setSelectedChallenge(challenge);
    setSubmitted(false);
    setForm({
      improvement: "",
      name: "",
      phone: "",
      businessName: "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const current = readStats();
    const next: AwarenessStats = {
      ...current,
      intakeSubmissions: current.intakeSubmissions + 1,
    };

    saveStats(next);
    setStats(next);
    setSubmitted(true);
  }

  const showingIntake = Boolean(selectedChallenge);

  return (
    <main style={styles.page}>
      <section style={styles.glowOne} />
      <section style={styles.glowTwo} />

      <div style={styles.shell}>
        {!showingIntake ? (
          <>
            <section style={styles.hero}>
              <div style={styles.kicker}>HomePlanet Awareness Funnel V1</div>
              <h1 style={styles.title}>
                STOP GUESSING.
                <br />
                START BUILDING.
              </h1>
              <p style={styles.subtitle}>
                Tell us what you're trying to improve and we'll point you in the right direction.
              </p>
            </section>

            <section style={styles.challengeGrid} aria-label="Business challenge cards">
              {challenges.map((challenge) => (
                <button
                  key={challenge.title}
                  type="button"
                  style={styles.challengeCard}
                  onClick={() => handleChallengeClick(challenge.title)}
                >
                  <span style={styles.challengeTitle}>{challenge.title}</span>
                  <span style={styles.challengeBody}>{challenge.body}</span>
                </button>
              ))}
            </section>
          </>
        ) : (
          <section style={styles.intakeCard}>
            <button
              type="button"
              style={styles.backButton}
              onClick={() => {
                setSelectedChallenge("");
                setSubmitted(false);
              }}
            >
              ← Back
            </button>

            <div style={styles.kicker}>Intake Page</div>
            <h1 style={styles.intakeTitle}>Let's point this in the right direction.</h1>
            <p style={styles.intakeSubtitle}>
              You selected: <strong>{selectedChallenge}</strong>
            </p>

            {submitted ? (
              <div style={styles.successBox}>
                <h2 style={styles.successTitle}>Submitted.</h2>
                <p style={styles.successText}>
                  We got it. HomePlanet will use this to point the next step in the right direction.
                </p>
              </div>
            ) : (
              <form style={styles.form} onSubmit={handleSubmit}>
                <label style={styles.label}>
                  Challenge Selected
                  <input style={styles.input} value={selectedChallenge} readOnly />
                </label>

                <label style={styles.label}>
                  What are you trying to improve right now?
                  <textarea
                    style={styles.textarea}
                    value={form.improvement}
                    required
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        improvement: event.target.value,
                      }))
                    }
                  />
                </label>

                <label style={styles.label}>
                  Name
                  <input
                    style={styles.input}
                    value={form.name}
                    required
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>

                <label style={styles.label}>
                  Phone
                  <input
                    style={styles.input}
                    value={form.phone}
                    required
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                  />
                </label>

                <label style={styles.label}>
                  Business Name <span style={styles.optional}>(optional)</span>
                  <input
                    style={styles.input}
                    value={form.businessName}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        businessName: event.target.value,
                      }))
                    }
                  />
                </label>

                <button type="submit" style={styles.submitButton}>
                  Submit
                </button>
              </form>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "#030604",
    color: "#f4fff7",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  glowOne: {
    position: "absolute",
    top: "-180px",
    left: "-140px",
    width: "420px",
    height: "420px",
    borderRadius: "999px",
    background:
      "radial-gradient(circle, rgba(69,255,126,0.22) 0%, rgba(69,255,126,0.08) 38%, rgba(69,255,126,0) 72%)",
    pointerEvents: "none",
  },
  glowTwo: {
    position: "absolute",
    right: "-180px",
    bottom: "80px",
    width: "460px",
    height: "460px",
    borderRadius: "999px",
    background:
      "radial-gradient(circle, rgba(44,255,118,0.18) 0%, rgba(44,255,118,0.06) 40%, rgba(44,255,118,0) 74%)",
    pointerEvents: "none",
  },
  shell: {
    position: "relative",
    zIndex: 1,
    width: "min(1080px, calc(100% - 28px))",
    margin: "0 auto",
    padding: "34px 0 54px",
  },
  hero: {
    padding: "26px 0 18px",
  },
  kicker: {
    display: "inline-flex",
    color: "#5dff93",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    marginBottom: "14px",
  },
  title: {
    margin: 0,
    fontSize: "clamp(48px, 14vw, 104px)",
    lineHeight: 0.88,
    letterSpacing: "-0.08em",
    fontWeight: 1000,
  },
  subtitle: {
    maxWidth: "700px",
    margin: "22px 0 0",
    color: "rgba(244,255,247,0.78)",
    fontSize: "clamp(18px, 4vw, 27px)",
    lineHeight: 1.25,
    fontWeight: 750,
  },
  challengeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
    gap: "14px",
    marginTop: "30px",
  },
  challengeCard: {
    border: "1px solid rgba(93,255,147,0.22)",
    background:
      "linear-gradient(145deg, rgba(15,24,18,0.96), rgba(7,12,9,0.98))",
    borderRadius: "24px",
    minHeight: "170px",
    padding: "22px",
    color: "#f4fff7",
    textAlign: "left",
    boxShadow:
      "0 24px 60px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.06)",
    cursor: "pointer",
  },
  challengeTitle: {
    display: "block",
    color: "#ffffff",
    fontSize: "24px",
    lineHeight: 1,
    fontWeight: 950,
    letterSpacing: "-0.04em",
    marginBottom: "16px",
  },
  challengeBody: {
    display: "block",
    color: "rgba(244,255,247,0.72)",
    fontSize: "17px",
    lineHeight: 1.35,
    fontWeight: 750,
  },
  operatorHero: {
    padding: "26px 0 18px",
  },
  operatorTitle: {
    margin: 0,
    fontSize: "clamp(46px, 11vw, 92px)",
    lineHeight: 0.9,
    letterSpacing: "-0.08em",
    fontWeight: 1000,
  },
  operatorSubtitle: {
    maxWidth: "780px",
    margin: "18px 0 0",
    color: "rgba(244,255,247,0.74)",
    fontSize: "clamp(17px, 3.6vw, 24px)",
    lineHeight: 1.3,
    fontWeight: 750,
  },
  dashboardCard: {
    marginTop: "22px",
    border: "1px solid rgba(93,255,147,0.2)",
    borderRadius: "28px",
    padding: "20px",
    background:
      "linear-gradient(145deg, rgba(12,18,14,0.96), rgba(5,8,6,0.98))",
    boxShadow: "0 24px 70px rgba(0,0,0,0.46)",
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  dashboardTitle: {
    margin: 0,
    fontSize: "28px",
    letterSpacing: "-0.04em",
    lineHeight: 1,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "10px",
    marginBottom: "14px",
  },
  metricBox: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "18px",
    padding: "14px",
  },
  metricLabel: {
    display: "block",
    color: "rgba(244,255,247,0.62)",
    fontSize: "12px",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "8px",
  },
  metricValue: {
    display: "block",
    color: "#5dff93",
    fontSize: "30px",
    lineHeight: 1,
  },
  mostSelected: {
    border: "1px solid rgba(93,255,147,0.18)",
    background: "rgba(93,255,147,0.07)",
    borderRadius: "16px",
    padding: "13px 14px",
    color: "rgba(244,255,247,0.8)",
    fontSize: "15px",
    fontWeight: 800,
    marginBottom: "12px",
  },
  table: {
    overflow: "hidden",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  tableHead: {
    display: "grid",
    gridTemplateColumns: "1fr 80px",
    gap: "10px",
    padding: "13px 14px",
    color: "#5dff93",
    background: "rgba(93,255,147,0.08)",
    fontSize: "13px",
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 80px",
    gap: "10px",
    padding: "14px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    color: "rgba(244,255,247,0.84)",
    fontSize: "15px",
    fontWeight: 800,
  },
  intakeCard: {
    width: "min(760px, 100%)",
    margin: "20px auto 0",
    border: "1px solid rgba(93,255,147,0.22)",
    borderRadius: "30px",
    padding: "22px",
    background:
      "linear-gradient(145deg, rgba(14,22,17,0.97), rgba(5,8,6,0.99))",
    boxShadow: "0 30px 90px rgba(0,0,0,0.52)",
  },
  backButton: {
    border: "1px solid rgba(93,255,147,0.22)",
    background: "rgba(93,255,147,0.08)",
    color: "#5dff93",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "14px",
    fontWeight: 950,
    marginBottom: "24px",
    cursor: "pointer",
  },
  intakeTitle: {
    margin: 0,
    fontSize: "clamp(38px, 10vw, 74px)",
    lineHeight: 0.92,
    letterSpacing: "-0.075em",
    fontWeight: 1000,
  },
  intakeSubtitle: {
    color: "rgba(244,255,247,0.76)",
    fontSize: "18px",
    lineHeight: 1.35,
    fontWeight: 800,
    margin: "18px 0 0",
  },
  form: {
    display: "grid",
    gap: "14px",
    marginTop: "24px",
  },
  label: {
    display: "grid",
    gap: "8px",
    color: "#f4fff7",
    fontSize: "14px",
    fontWeight: 950,
    letterSpacing: "-0.01em",
  },
  optional: {
    color: "rgba(244,255,247,0.48)",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid rgba(93,255,147,0.18)",
    background: "rgba(0,0,0,0.3)",
    color: "#ffffff",
    borderRadius: "16px",
    padding: "15px 14px",
    fontSize: "17px",
    fontWeight: 750,
    outline: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "130px",
    resize: "vertical",
    border: "1px solid rgba(93,255,147,0.18)",
    background: "rgba(0,0,0,0.3)",
    color: "#ffffff",
    borderRadius: "16px",
    padding: "15px 14px",
    fontSize: "17px",
    fontWeight: 750,
    outline: "none",
    fontFamily: "inherit",
  },
  submitButton: {
    width: "100%",
    border: "0",
    borderRadius: "18px",
    padding: "18px 18px",
    background: "#5dff93",
    color: "#041006",
    fontSize: "18px",
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(93,255,147,0.2)",
  },
  successBox: {
    marginTop: "24px",
    border: "1px solid rgba(93,255,147,0.25)",
    background: "rgba(93,255,147,0.08)",
    borderRadius: "22px",
    padding: "22px",
  },
  successTitle: {
    margin: 0,
    color: "#5dff93",
    fontSize: "34px",
    letterSpacing: "-0.04em",
  },
  successText: {
    margin: "10px 0 0",
    color: "rgba(244,255,247,0.76)",
    fontSize: "17px",
    fontWeight: 800,
    lineHeight: 1.35,
  },
};

