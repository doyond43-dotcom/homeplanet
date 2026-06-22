import React from "react";

const messyItems = [
  {
    label: "Facebook comment",
    text: "How much to paint a living room and hallway?",
  },
  {
    label: "Messenger DM",
    text: "Can you come this week? I can send photos.",
  },
  {
    label: "Texted photos",
    text: "3 wall photos, one damaged trim photo, one paint color screenshot.",
  },
  {
    label: "Missed call",
    text: "Customer called back while the owner was on another job.",
  },
  {
    label: "Owner memory",
    text: "Needs follow-up tomorrow. Maybe wants estimate Friday.",
  },
  {
    label: "No clear status",
    text: "Nobody knows if this is new, quoted, scheduled, or forgotten.",
  },
];

const workflowSteps = [
  "Customer clicked from Facebook",
  "Message turned into a lead",
  "Photos stayed with the request",
  "Notes stayed with the customer",
  "Follow-up became visible",
  "Estimate step is ready",
];

const leadDetails = [
  ["Customer", "Sierra Miller"],
  ["Source", "Facebook post"],
  ["Need", "Interior painting estimate"],
  ["Photos", "5 attached"],
  ["Notes", "Living room, hallway, trim damage, wants quote this week"],
  ["Status", "New lead"],
  ["Follow-Up", "Needed today"],
  ["Next Step", "Call or message back / schedule estimate"],
];

export default function HomePlanetAfterTheClickDemo() {
  return (
    <main style={styles.page}>
      <section style={styles.glowOne} />
      <section style={styles.glowTwo} />

      <div style={styles.shell}>
        <section style={styles.hero}>
          <div style={styles.kicker}>HomePlanet Workflow Demo</div>
          <h1 style={styles.title}>
            AFTER THE CLICK.
            <br />
            THE REAL WORK STARTS.
          </h1>
          <p style={styles.subtitle}>
            A website, post, or ad can get attention. But the opportunity is won or lost by what
            happens next.
          </p>
        </section>

        <section style={styles.storyCard}>
          <div style={styles.storyEyebrow}>Sample business</div>
          <h2 style={styles.storyTitle}>BrightSide Home Services</h2>
          <p style={styles.storyText}>
            A customer sees a post, reaches out, sends photos, asks for a price, and expects a fast
            follow-up. This is where a lot of small businesses start losing track.
          </p>
        </section>

        <section style={styles.compareGrid}>
          <div style={styles.panel}>
            <div style={styles.panelTop}>
              <span style={styles.badgeDim}>Before</span>
              <h2 style={styles.panelTitle}>Scattered customer chaos</h2>
              <p style={styles.panelText}>
                The customer is interested, but the details are spread across comments, DMs, texts,
                screenshots, missed calls, and memory.
              </p>
            </div>

            <div style={styles.messStack}>
              {messyItems.map((item) => (
                <div key={item.label} style={styles.messItem}>
                  <span style={styles.messLabel}>{item.label}</span>
                  <p style={styles.messText}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.panelStrong}>
            <div style={styles.panelTop}>
              <span style={styles.badgeGreen}>After</span>
              <h2 style={styles.panelTitle}>The same lead in a live system</h2>
              <p style={styles.panelText}>
                The click becomes a visible workflow: customer, source, need, photos, notes, status,
                follow-up, and next step.
              </p>
            </div>

            <div style={styles.leadCard}>
              <div style={styles.leadHeader}>
                <div>
                  <span style={styles.leadMini}>Lead card</span>
                  <h3 style={styles.leadName}>Sierra Miller</h3>
                </div>
                <span style={styles.statusPill}>New lead</span>
              </div>

              <div style={styles.detailGrid}>
                {leadDetails.map(([label, value]) => (
                  <div key={label} style={styles.detailRow}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={styles.timelineCard}>
          <div style={styles.kicker}>Workflow timeline</div>
          <h2 style={styles.timelineTitle}>What changed after the click?</h2>

          <div style={styles.timeline}>
            {workflowSteps.map((step, index) => (
              <div key={step} style={styles.timelineItem}>
                <span style={styles.timelineNumber}>{index + 1}</span>
                <span style={styles.timelineText}>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.bottomCta}>
          <h2 style={styles.ctaTitle}>This is why HomePlanet is not just a website.</h2>
          <p style={styles.ctaText}>
            The page gets attention. The system catches what happens after attention turns into a
            customer, lead, message, job, estimate, booking, or follow-up.
          </p>
          <a style={styles.ctaButton} href="/planet/build-your-live-system">
            Build Your Live System
          </a>
        </section>
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
    width: "430px",
    height: "430px",
    borderRadius: "999px",
    background:
      "radial-gradient(circle, rgba(69,255,126,0.23) 0%, rgba(69,255,126,0.08) 38%, rgba(69,255,126,0) 72%)",
    pointerEvents: "none",
  },
  glowTwo: {
    position: "absolute",
    right: "-180px",
    bottom: "120px",
    width: "500px",
    height: "500px",
    borderRadius: "999px",
    background:
      "radial-gradient(circle, rgba(44,255,118,0.18) 0%, rgba(44,255,118,0.06) 40%, rgba(44,255,118,0) 74%)",
    pointerEvents: "none",
  },
  shell: {
    position: "relative",
    zIndex: 1,
    width: "min(1120px, calc(100% - 28px))",
    margin: "0 auto",
    padding: "34px 0 58px",
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
    fontSize: "clamp(46px, 13vw, 104px)",
    lineHeight: 0.88,
    letterSpacing: "-0.08em",
    fontWeight: 1000,
  },
  subtitle: {
    maxWidth: "820px",
    margin: "22px 0 0",
    color: "rgba(244,255,247,0.8)",
    fontSize: "clamp(18px, 4vw, 28px)",
    lineHeight: 1.24,
    fontWeight: 800,
  },
  storyCard: {
    marginTop: "14px",
    border: "1px solid rgba(93,255,147,0.18)",
    background:
      "linear-gradient(145deg, rgba(15,24,18,0.92), rgba(7,12,9,0.96))",
    borderRadius: "28px",
    padding: "22px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.42)",
  },
  storyEyebrow: {
    color: "#5dff93",
    fontSize: "12px",
    fontWeight: 950,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  storyTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(30px, 7vw, 54px)",
    lineHeight: 0.95,
    letterSpacing: "-0.065em",
    fontWeight: 1000,
  },
  storyText: {
    maxWidth: "840px",
    margin: "14px 0 0",
    color: "rgba(244,255,247,0.76)",
    fontSize: "18px",
    lineHeight: 1.35,
    fontWeight: 800,
  },
  compareGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
    marginTop: "16px",
  },
  panel: {
    border: "1px solid rgba(255,255,255,0.1)",
    background:
      "linear-gradient(145deg, rgba(18,18,18,0.96), rgba(7,8,7,0.98))",
    borderRadius: "28px",
    padding: "20px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.46)",
  },
  panelStrong: {
    border: "1px solid rgba(93,255,147,0.24)",
    background:
      "linear-gradient(145deg, rgba(12,24,16,0.98), rgba(5,9,7,0.99))",
    borderRadius: "28px",
    padding: "20px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.46)",
  },
  panelTop: {
    marginBottom: "16px",
  },
  badgeDim: {
    display: "inline-flex",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(244,255,247,0.7)",
    borderRadius: "999px",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "12px",
  },
  badgeGreen: {
    display: "inline-flex",
    border: "1px solid rgba(93,255,147,0.28)",
    background: "rgba(93,255,147,0.09)",
    color: "#5dff93",
    borderRadius: "999px",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "12px",
  },
  panelTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "30px",
    lineHeight: 0.98,
    letterSpacing: "-0.055em",
    fontWeight: 1000,
  },
  panelText: {
    margin: "12px 0 0",
    color: "rgba(244,255,247,0.7)",
    fontSize: "16px",
    lineHeight: 1.35,
    fontWeight: 750,
  },
  messStack: {
    display: "grid",
    gap: "10px",
  },
  messItem: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "18px",
    padding: "14px",
  },
  messLabel: {
    display: "block",
    color: "rgba(244,255,247,0.54)",
    fontSize: "12px",
    fontWeight: 950,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  messText: {
    margin: 0,
    color: "rgba(244,255,247,0.82)",
    fontSize: "15px",
    lineHeight: 1.35,
    fontWeight: 800,
  },
  leadCard: {
    border: "1px solid rgba(93,255,147,0.18)",
    background: "rgba(0,0,0,0.24)",
    borderRadius: "24px",
    padding: "16px",
  },
  leadHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "14px",
  },
  leadMini: {
    display: "block",
    color: "#5dff93",
    fontSize: "12px",
    fontWeight: 950,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  leadName: {
    margin: 0,
    color: "#ffffff",
    fontSize: "32px",
    letterSpacing: "-0.055em",
    lineHeight: 1,
  },
  statusPill: {
    border: "1px solid rgba(93,255,147,0.25)",
    background: "rgba(93,255,147,0.08)",
    color: "#5dff93",
    borderRadius: "999px",
    padding: "9px 11px",
    fontSize: "12px",
    fontWeight: 950,
    whiteSpace: "nowrap",
  },
  detailGrid: {
    display: "grid",
    gap: "9px",
  },
  detailRow: {
    display: "grid",
    gridTemplateColumns: "92px 1fr",
    gap: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "14px",
    padding: "11px",
    color: "rgba(244,255,247,0.6)",
    fontSize: "14px",
    fontWeight: 850,
  },
  timelineCard: {
    marginTop: "16px",
    border: "1px solid rgba(93,255,147,0.2)",
    background:
      "linear-gradient(145deg, rgba(12,18,14,0.96), rgba(5,8,6,0.98))",
    borderRadius: "28px",
    padding: "20px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.46)",
  },
  timelineTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(30px, 7vw, 54px)",
    lineHeight: 0.95,
    letterSpacing: "-0.065em",
    fontWeight: 1000,
  },
  timeline: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "10px",
    marginTop: "18px",
  },
  timelineItem: {
    display: "grid",
    gridTemplateColumns: "38px 1fr",
    alignItems: "center",
    gap: "10px",
    border: "1px solid rgba(93,255,147,0.14)",
    background: "rgba(0,0,0,0.2)",
    borderRadius: "18px",
    padding: "13px",
  },
  timelineNumber: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    background: "rgba(93,255,147,0.12)",
    color: "#5dff93",
    fontSize: "14px",
    fontWeight: 1000,
  },
  timelineText: {
    color: "rgba(244,255,247,0.86)",
    fontSize: "15px",
    lineHeight: 1.25,
    fontWeight: 850,
  },
  bottomCta: {
    marginTop: "16px",
    border: "1px solid rgba(93,255,147,0.22)",
    background:
      "radial-gradient(circle at 20% 0%, rgba(93,255,147,0.14), rgba(93,255,147,0.04) 38%, rgba(255,255,255,0.03) 100%)",
    borderRadius: "30px",
    padding: "24px",
    boxShadow: "0 26px 80px rgba(0,0,0,0.48)",
  },
  ctaTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(34px, 8vw, 68px)",
    lineHeight: 0.92,
    letterSpacing: "-0.075em",
    fontWeight: 1000,
  },
  ctaText: {
    maxWidth: "840px",
    margin: "16px 0 0",
    color: "rgba(244,255,247,0.78)",
    fontSize: "18px",
    lineHeight: 1.35,
    fontWeight: 800,
  },
  ctaButton: {
    display: "inline-flex",
    marginTop: "20px",
    borderRadius: "18px",
    padding: "15px 18px",
    background: "#5dff93",
    color: "#041006",
    fontSize: "16px",
    fontWeight: 1000,
    textDecoration: "none",
    boxShadow: "0 18px 40px rgba(93,255,147,0.2)",
  },
};
