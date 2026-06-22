import React from "react";

const sourceDetails = [
  ["Source", "Facebook post"],
  ["Customer", "Sarah Miller"],
  ["Need", "Interior painting estimate"],
  ["Location", "Port St. Lucie"],
  ["Intent", "Wants quote this week"],
];

const customerMessages = [
  "Hi, can you give me a price for painting a living room and hallway?",
  "I can send photos. We also have a little trim damage in one area.",
  "We’re hoping to get it done sometime this week if possible.",
];

const photoCards = [
  "Living room wall",
  "Hallway angle",
  "Trim damage",
  "Paint color screenshot",
  "Extra wall photo",
];

const commonBreaks = [
  "Photos end up buried in messages",
  "Nobody remembers the trim damage",
  "No clear status",
  "Missed follow-up",
  "Estimate gets delayed",
  "Customer starts looking elsewhere",
];

const capturedDetails = [
  ["Customer", "Sarah Miller"],
  ["Source", "Facebook post"],
  ["Service", "Interior painting"],
  ["Spaces", "Living room + hallway"],
  ["Issue", "Trim damage"],
  ["Photos", "5 attached"],
  ["Timing", "Wants quote this week"],
  ["Status", "New lead"],
  ["Follow-Up", "Needed today"],
  ["Next Step", "Call or message back / schedule estimate"],
];

const nextSteps = [
  "Respond today",
  "Acknowledge the photos",
  "Confirm the scope",
  "Ask 1–2 missing questions",
  "Offer estimate visit or quote path",
  "Move lead to Estimate Needed",
];

const workflowStages = [
  ["New Lead", "Customer reached out and sent details."],
  ["Follow-Up Needed", "Owner needs to respond before the lead cools off."],
  ["Estimate Needed", "Scope is clear enough to start the quote path."],
  ["Scheduled", "Estimate visit or call gets placed on the calendar."],
  ["Quote Sent", "Customer gets a professional next step."],
  ["Waiting Approval", "The job is tracked instead of forgotten."],
];

export default function BrightSideFlowDemo() {
  return (
    <main style={styles.page}>
      <section style={styles.glowOne} />
      <section style={styles.glowTwo} />

      <div style={styles.shell}>
        <section style={styles.hero}>
          <div style={styles.kicker}>BrightSide Home Services</div>
          <h1 style={styles.title}>
            A CUSTOMER REACHED OUT.
            <br />
            NOW WHAT?
          </h1>
          <p style={styles.subtitle}>
            This is what a real customer flow can look like after someone clicks a post, sends a
            message, shares photos, and expects a response.
          </p>
        </section>

        <section style={styles.sourceCard}>
          <div>
            <div style={styles.sectionKicker}>Where this lead came from</div>
            <h2 style={styles.sectionTitle}>Sarah clicked from a Facebook post.</h2>
            <p style={styles.sectionText}>
              The attention already happened. The question is whether the business catches the
              details and knows what to do next.
            </p>
          </div>

          <div style={styles.sourceGrid}>
            {sourceDetails.map(([label, value]) => (
              <div key={label} style={styles.sourceItem}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.twoColumn}>
          <div style={styles.panel}>
            <div style={styles.sectionKicker}>What the customer sent</div>
            <h2 style={styles.panelTitle}>The message came in fast.</h2>

            <div style={styles.messageStack}>
              {customerMessages.map((message) => (
                <div key={message} style={styles.messageBubble}>
                  {message}
                </div>
              ))}
            </div>

            <div style={styles.photoStrip}>
              {photoCards.map((photo, index) => (
                <div key={photo} style={styles.photoCard}>
                  <span style={styles.photoIcon}>IMG {index + 1}</span>
                  <strong>{photo}</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.panelDim}>
            <div style={styles.sectionKicker}>What usually goes wrong</div>
            <h2 style={styles.panelTitle}>This is where the lead starts slipping.</h2>

            <div style={styles.breakStack}>
              {commonBreaks.map((item) => (
                <div key={item} style={styles.breakItem}>
                  <span style={styles.warningDot}>!</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.systemCard}>
          <div style={styles.sectionKicker}>What HomePlanet captured</div>
          <h2 style={styles.systemTitle}>The same lead, organized.</h2>
          <p style={styles.sectionText}>
            Instead of living in comments, DMs, texts, screenshots, and memory, the customer becomes
            a clear lead with a next step.
          </p>

          <div style={styles.leadCard}>
            <div style={styles.leadHeader}>
              <div>
                <span style={styles.leadMini}>Lead Card</span>
                <h3 style={styles.leadName}>Sarah Miller</h3>
              </div>
              <span style={styles.statusPill}>New Lead</span>
            </div>

            <div style={styles.detailGrid}>
              {capturedDetails.map(([label, value]) => (
                <div key={label} style={styles.detailRow}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.intelligenceCard}>
          <div style={styles.sectionKicker}>Intelligence layer</div>
          <h2 style={styles.systemTitle}>What to do next.</h2>
          <p style={styles.sectionText}>
            This is the part that helps the business owner stop staring at scattered messages and
            start moving the customer forward.
          </p>

          <div style={styles.intelligenceGrid}>
            <div style={styles.nextStepCard}>
              <h3 style={styles.cardTitle}>Owner guidance</h3>
              <div style={styles.nextSteps}>
                {nextSteps.map((step, index) => (
                  <div key={step} style={styles.nextStepItem}>
                    <span style={styles.stepNumber}>{index + 1}</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.replyCard}>
              <h3 style={styles.cardTitle}>Suggested reply</h3>
              <p style={styles.replyText}>
                Hi Sarah, thanks for sending the photos. I can help with the living room and hallway.
                I also see the trim damage you mentioned. Are you planning to keep the same color or
                change it? I can take a closer look and get you a quote. Would today or tomorrow work
                better?
              </p>
            </div>
          </div>
        </section>

        <section style={styles.workflowCard}>
          <div style={styles.sectionKicker}>Workflow progression</div>
          <h2 style={styles.systemTitle}>The lead now has a path.</h2>

          <div style={styles.stageGrid}>
            {workflowStages.map(([stage, note], index) => (
              <div key={stage} style={styles.stageCard}>
                <span style={styles.stageNumber}>{index + 1}</span>
                <strong>{stage}</strong>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.bottomCta}>
          <h2 style={styles.ctaTitle}>This is what HomePlanet is built to do.</h2>
          <p style={styles.ctaText}>
            Not just bring in attention — but help organize what happens after the customer reaches
            out.
          </p>

          <div style={styles.ctaButtons}>
            <a style={styles.primaryButton} href="/planet/build-your-live-system">
              Build Your Live System
            </a>
          </div>
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
    left: "-160px",
    width: "460px",
    height: "460px",
    borderRadius: "999px",
    background:
      "radial-gradient(circle, rgba(69,255,126,0.24) 0%, rgba(69,255,126,0.08) 38%, rgba(69,255,126,0) 72%)",
    pointerEvents: "none",
  },
  glowTwo: {
    position: "absolute",
    right: "-180px",
    bottom: "160px",
    width: "520px",
    height: "520px",
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
    fontSize: "clamp(44px, 12vw, 104px)",
    lineHeight: 0.88,
    letterSpacing: "-0.08em",
    fontWeight: 1000,
  },
  subtitle: {
    maxWidth: "860px",
    margin: "22px 0 0",
    color: "rgba(244,255,247,0.8)",
    fontSize: "clamp(18px, 4vw, 28px)",
    lineHeight: 1.24,
    fontWeight: 800,
  },
  sourceCard: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)",
    gap: "16px",
    marginTop: "14px",
    border: "1px solid rgba(93,255,147,0.2)",
    background:
      "linear-gradient(145deg, rgba(15,24,18,0.94), rgba(7,12,9,0.98))",
    borderRadius: "30px",
    padding: "22px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.46)",
  },
  sectionKicker: {
    color: "#5dff93",
    fontSize: "12px",
    fontWeight: 950,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  sectionTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(30px, 7vw, 56px)",
    lineHeight: 0.95,
    letterSpacing: "-0.065em",
    fontWeight: 1000,
  },
  sectionText: {
    maxWidth: "820px",
    margin: "14px 0 0",
    color: "rgba(244,255,247,0.74)",
    fontSize: "17px",
    lineHeight: 1.35,
    fontWeight: 800,
  },
  sourceGrid: {
    display: "grid",
    gap: "10px",
  },
  sourceItem: {
    display: "grid",
    gridTemplateColumns: "92px 1fr",
    gap: "10px",
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "16px",
    padding: "12px",
    color: "rgba(244,255,247,0.62)",
    fontSize: "14px",
    fontWeight: 850,
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
    marginTop: "16px",
  },
  panel: {
    border: "1px solid rgba(93,255,147,0.18)",
    background:
      "linear-gradient(145deg, rgba(13,22,16,0.96), rgba(5,9,7,0.99))",
    borderRadius: "28px",
    padding: "20px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.46)",
  },
  panelDim: {
    border: "1px solid rgba(255,255,255,0.1)",
    background:
      "linear-gradient(145deg, rgba(18,18,18,0.96), rgba(7,8,7,0.98))",
    borderRadius: "28px",
    padding: "20px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.46)",
  },
  panelTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "32px",
    lineHeight: 0.98,
    letterSpacing: "-0.055em",
    fontWeight: 1000,
  },
  messageStack: {
    display: "grid",
    gap: "10px",
    marginTop: "16px",
  },
  messageBubble: {
    maxWidth: "92%",
    border: "1px solid rgba(93,255,147,0.16)",
    background: "rgba(93,255,147,0.08)",
    borderRadius: "18px",
    padding: "13px",
    color: "rgba(244,255,247,0.9)",
    fontSize: "15px",
    lineHeight: 1.35,
    fontWeight: 850,
  },
  photoStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "10px",
    marginTop: "16px",
  },
  photoCard: {
    minHeight: "86px",
    border: "1px solid rgba(255,255,255,0.1)",
    background:
      "radial-gradient(circle at 20% 10%, rgba(93,255,147,0.16), rgba(255,255,255,0.04) 52%, rgba(0,0,0,0.18) 100%)",
    borderRadius: "18px",
    padding: "12px",
    display: "grid",
    alignContent: "space-between",
    color: "rgba(244,255,247,0.86)",
    fontSize: "13px",
    fontWeight: 900,
  },
  photoIcon: {
    color: "#5dff93",
    fontSize: "11px",
    fontWeight: 1000,
    letterSpacing: "0.1em",
  },
  breakStack: {
    display: "grid",
    gap: "10px",
    marginTop: "16px",
  },
  breakItem: {
    display: "grid",
    gridTemplateColumns: "32px 1fr",
    gap: "10px",
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "16px",
    padding: "12px",
    color: "rgba(244,255,247,0.82)",
    fontSize: "15px",
    fontWeight: 850,
  },
  warningDot: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(244,255,247,0.74)",
    fontSize: "14px",
    fontWeight: 1000,
  },
  systemCard: {
    marginTop: "16px",
    border: "1px solid rgba(93,255,147,0.22)",
    background:
      "linear-gradient(145deg, rgba(12,24,16,0.98), rgba(5,9,7,0.99))",
    borderRadius: "30px",
    padding: "22px",
    boxShadow: "0 26px 80px rgba(0,0,0,0.48)",
  },
  systemTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(32px, 8vw, 64px)",
    lineHeight: 0.92,
    letterSpacing: "-0.07em",
    fontWeight: 1000,
  },
  leadCard: {
    marginTop: "18px",
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
    fontSize: "34px",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "10px",
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
  intelligenceCard: {
    marginTop: "16px",
    border: "1px solid rgba(93,255,147,0.22)",
    background:
      "radial-gradient(circle at 20% 0%, rgba(93,255,147,0.13), rgba(93,255,147,0.04) 38%, rgba(255,255,255,0.03) 100%)",
    borderRadius: "30px",
    padding: "22px",
    boxShadow: "0 26px 80px rgba(0,0,0,0.48)",
  },
  intelligenceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    marginTop: "18px",
  },
  nextStepCard: {
    border: "1px solid rgba(93,255,147,0.16)",
    background: "rgba(0,0,0,0.22)",
    borderRadius: "24px",
    padding: "16px",
  },
  replyCard: {
    border: "1px solid rgba(93,255,147,0.22)",
    background: "rgba(93,255,147,0.07)",
    borderRadius: "24px",
    padding: "16px",
  },
  cardTitle: {
    margin: "0 0 12px",
    color: "#ffffff",
    fontSize: "22px",
    letterSpacing: "-0.04em",
    fontWeight: 1000,
  },
  nextSteps: {
    display: "grid",
    gap: "10px",
  },
  nextStepItem: {
    display: "grid",
    gridTemplateColumns: "34px 1fr",
    gap: "10px",
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "15px",
    padding: "11px",
    color: "rgba(244,255,247,0.86)",
    fontSize: "15px",
    fontWeight: 850,
  },
  stepNumber: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    borderRadius: "999px",
    background: "rgba(93,255,147,0.12)",
    color: "#5dff93",
    fontSize: "13px",
    fontWeight: 1000,
  },
  replyText: {
    margin: 0,
    color: "rgba(244,255,247,0.9)",
    fontSize: "17px",
    lineHeight: 1.45,
    fontWeight: 850,
  },
  workflowCard: {
    marginTop: "16px",
    border: "1px solid rgba(93,255,147,0.2)",
    background:
      "linear-gradient(145deg, rgba(12,18,14,0.96), rgba(5,8,6,0.98))",
    borderRadius: "30px",
    padding: "22px",
    boxShadow: "0 24px 70px rgba(0,0,0,0.46)",
  },
  stageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginTop: "18px",
  },
  stageCard: {
    border: "1px solid rgba(93,255,147,0.14)",
    background: "rgba(0,0,0,0.2)",
    borderRadius: "18px",
    padding: "14px",
  },
  stageNumber: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    borderRadius: "999px",
    background: "rgba(93,255,147,0.12)",
    color: "#5dff93",
    fontSize: "13px",
    fontWeight: 1000,
    marginBottom: "10px",
  },
  bottomCta: {
    marginTop: "16px",
    border: "1px solid rgba(93,255,147,0.22)",
    background:
      "linear-gradient(145deg, rgba(15,24,18,0.94), rgba(7,12,9,0.98))",
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
    maxWidth: "820px",
    margin: "16px 0 0",
    color: "rgba(244,255,247,0.78)",
    fontSize: "18px",
    lineHeight: 1.35,
    fontWeight: 800,
  },
  ctaButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "20px",
  },
  primaryButton: {
    display: "inline-flex",
    borderRadius: "18px",
    padding: "15px 18px",
    background: "#5dff93",
    color: "#041006",
    fontSize: "16px",
    fontWeight: 1000,
    textDecoration: "none",
    boxShadow: "0 18px 40px rgba(93,255,147,0.2)",
  },
  secondaryButton: {
    display: "inline-flex",
    borderRadius: "18px",
    padding: "15px 18px",
    border: "1px solid rgba(93,255,147,0.24)",
    background: "rgba(93,255,147,0.07)",
    color: "#5dff93",
    fontSize: "16px",
    fontWeight: 1000,
    textDecoration: "none",
  },
};

