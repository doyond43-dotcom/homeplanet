import { Link } from "react-router-dom";
import type { CSSProperties } from "react";

const includedItems = [
  {
    title: "Done-for-you Live Page",
    body:
      "A focused public page built around the main action your customer needs to take. No bloated website. No endless scroll chaos. Just the right front door.",
  },
  {
    title: "Customer intake",
    body:
      "A simple way for customers to tell you what they need, share the right details, and get into your workflow without a long back-and-forth message thread.",
  },
  {
    title: "Booking or request flow",
    body:
      "Depending on your business, the page can guide customers into a request, booking, quote, appointment, table action, or service workflow.",
  },
  {
    title: "Photo uploads",
    body:
      "Customers can send the photos you need up front so you can understand the job faster and avoid guessing from a vague message.",
  },
  {
    title: "Customer updates",
    body:
      "The system is built around keeping people informed so fewer customers are left wondering what happens next.",
  },
  {
    title: "Live work board",
    body:
      "Behind the Live Page is a simple board for the business side. Leads, requests, review links, and activation steps stay organized.",
  },
  {
    title: "Hosting and maintenance",
    body:
      "The page stays live, hosted, and maintained. Small updates are included so the page does not go stale right after launch.",
  },
  {
    title: "Review before payment",
    body:
      "The first version is built first. You only pay after you review it, approve it, and want to keep it live.",
  },
];

const examples = [
  {
    title: "Pressure washing",
    steps: ["Request", "Photos", "Estimate", "Schedule", "Work board", "Updates"],
  },
  {
    title: "Pest control",
    steps: ["Issue", "Appointment", "Notes", "Lead board", "Follow-up"],
  },
  {
    title: "Auto repair",
    steps: ["Vehicle", "Issue", "Photos", "Quote", "Status board"],
  },
  {
    title: "Restaurants",
    steps: ["Guest action", "Table flow", "Kitchen", "Crew", "Owner board"],
  },
];

export default function LivePagesIncludedPage() {
  const page: CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 20% 0%, rgba(52,211,153,0.15), transparent 28%), radial-gradient(circle at 90% 20%, rgba(20,184,166,0.10), transparent 28%), linear-gradient(180deg, #050505 0%, #08110d 52%, #050505 100%)",
    color: "#f8fafc",
    padding: "24px 18px 72px",
  };

  const wrap: CSSProperties = {
    width: "min(980px, 100%)",
    margin: "0 auto",
  };

  const nav: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    marginBottom: 34,
  };

  const back: CSSProperties = {
    color: "#a7f3d0",
    textDecoration: "none",
    fontWeight: 950,
  };

  const pill: CSSProperties = {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#e5e7eb",
    padding: "10px 13px",
    textDecoration: "none",
    fontWeight: 950,
    fontSize: 13,
  };

  const messagePill: CSSProperties = {
    ...pill,
    border: "1px solid rgba(52,211,153,0.36)",
    background: "rgba(5,5,5,0.72)",
    color: "#bbf7d0",
    padding: "11px 15px",
    boxShadow: "0 0 24px rgba(52,211,153,0.16)",
  };

  const shell: CSSProperties = {
    borderRadius: 32,
    border: "1px solid rgba(255,255,255,0.09)",
    background:
      "linear-gradient(135deg, rgba(18,18,18,0.96), rgba(5,5,5,0.94))",
    boxShadow: "0 30px 90px rgba(0,0,0,0.42)",
    padding: "clamp(22px, 4vw, 42px)",
  };

  const eyebrow: CSSProperties = {
    color: "#34d399",
    fontSize: 13,
    fontWeight: 950,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginBottom: 12,
  };

  const h1: CSSProperties = {
    margin: 0,
    fontSize: "clamp(44px, 8vw, 82px)",
    lineHeight: 0.92,
    letterSpacing: "-0.075em",
  };

  const sub: CSSProperties = {
    marginTop: 18,
    color: "#cbd5e1",
    lineHeight: 1.6,
    fontSize: 18,
    maxWidth: 760,
  };

  const heroGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 16,
    marginTop: 24,
  };

  const visualCard: CSSProperties = {
    borderRadius: 26,
    border: "1px solid rgba(52,211,153,0.15)",
    background:
      "radial-gradient(circle at 50% 0%, rgba(52,211,153,0.18), transparent 45%), rgba(8,13,11,0.9)",
    padding: 18,
    minHeight: 260,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const boardLine: CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(15,23,42,0.65)",
    padding: "12px 13px",
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: 850,
  };

  const section: CSSProperties = {
    marginTop: 16,
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(8,8,8,0.76)",
    padding: "clamp(18px, 3vw, 28px)",
  };

  const h2: CSSProperties = {
    margin: 0,
    fontSize: "clamp(30px, 5vw, 52px)",
    lineHeight: 0.98,
    letterSpacing: "-0.06em",
  };

  const grid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
    marginTop: 18,
  };

  const card: CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.035)",
    padding: 16,
  };

  const chipWrap: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 12,
  };

  const chip: CSSProperties = {
    borderRadius: 999,
    border: "1px solid rgba(52,211,153,0.18)",
    background: "rgba(52,211,153,0.08)",
    color: "#bbf7d0",
    padding: "6px 9px",
    fontSize: 12,
    fontWeight: 900,
  };

  const cta: CSSProperties = {
    marginTop: 16,
    borderRadius: 30,
    border: "1px solid rgba(52,211,153,0.18)",
    background:
      "radial-gradient(circle at 80% 20%, rgba(52,211,153,0.25), transparent 34%), rgba(6,78,59,0.28)",
    padding: "clamp(20px, 4vw, 34px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  };

  const primary: CSSProperties = {
    borderRadius: 999,
    background: "#34d399",
    color: "#04110c",
    padding: "14px 18px",
    textDecoration: "none",
    fontWeight: 1000,
    boxShadow: "0 0 35px rgba(52,211,153,0.28)",
  };

  return (
    <main style={page}>
      <div style={wrap}>
        <nav style={nav}>
          <Link to="/planet/live-pages" style={back}>
            Back to Live Pages offer
          </Link>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/planet/message-us" style={messagePill}>Message us</Link>
          </div>
        </nav>

        <section style={shell}>
          <div style={eyebrow}>WHAT IS INCLUDED</div>
          <h1 style={h1}>A Live Page is not just a page.</h1>
          <p style={sub}>
            It is a focused customer entry point with a simple work board underneath. The outside helps
            customers take action. The inside helps you keep track of what needs to happen next.
          </p>

          <div style={heroGrid}>
            <div style={visualCard}>
              <div>
                <div style={eyebrow}>LIVE PAGE OUTSIDE</div>
                <h2 style={{ ...h2, fontSize: "clamp(30px, 4vw, 48px)" }}>
                  Customers know exactly what to do.
                </h2>
                <p style={{ ...sub, fontSize: 15 }}>
                  No confusion. No guessing. No giant website maze. They can request, book, upload,
                  explain, or start the right workflow.
                </p>
              </div>
</div>
          </div>
        </section>

        <section style={section}>
          <div style={eyebrow}>THE STARTER SYSTEM</div>
          <h2 style={h2}>What you get for $47/month after approval.</h2>
          <p style={{ ...sub, fontSize: 16 }}>
            The first version is built around one clear customer workflow. That keeps it useful,
            affordable, and easy to understand.
          </p>

          <div style={grid}>
            {includedItems.map((item) => (
              <article key={item.title} style={card}>
                <h3 style={{ margin: 0, fontSize: 18 }}>{item.title}</h3>
                <p style={{ margin: "9px 0 0", color: "#94a3b8", lineHeight: 1.5, fontSize: 14 }}>
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section style={section}>
          <div style={eyebrow}>WHY IT MATTERS</div>
          <h2 style={h2}>The page gets looked at. The system gets used.</h2>
          <p style={{ ...sub, fontSize: 16 }}>
            A normal website usually stops at information. A Live Page starts the workflow. That is the
            difference. The customer does not just read about you. They take the next step.
          </p>
        </section>

        <section style={section}>
          <div style={eyebrow}>BUSINESS EXAMPLES</div>
          <h2 style={h2}>The included workflow changes based on the business.</h2>

          <div style={grid}>
            {examples.map((example) => (
              <article key={example.title} style={card}>
                <h3 style={{ margin: 0, fontSize: 20 }}>{example.title}</h3>
                <div style={chipWrap}>
                  {example.steps.map((step) => (
                    <span key={step} style={chip}>
                      {step}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={section}>
          <div style={eyebrow}>THE FLOW</div>
          <h2 style={h2}>Built first. Reviewed next. Paid after approval.</h2>
          <p style={{ ...sub, fontSize: 16 }}>
            You message us, we confirm the main workflow, and we build the first version. You review it
            before paying to keep it live. That keeps the risk low and the work clear.
          </p>
        </section>

        <section style={cta}>
          <div>
            <div style={eyebrow}>FIRST COME, FIRST SERVED</div>
            <h2 style={{ ...h2, fontSize: "clamp(32px, 5vw, 56px)" }}>
              Ready to hold your place?
            </h2>
            <p style={{ ...sub, marginBottom: 28, fontSize: 15 }}>
              We build in order. Message us to hold your place in line.
            </p>
          </div>
                    <div style={{ marginBottom: 18 }}>
            <div style={{ color: "#facc15", fontSize: 22, fontWeight: 1000, marginBottom: 8 }}>
              Hold your place for $47/month.
            </div>
            <p style={{ color: "#cbd5e1", lineHeight: 1.55, margin: 0 }}>
              No upfront payment. We build the first version first. You only pay after it is built and approved.
            </p>
          </div>
<Link to="/planet/get-live" style={{ ...primary, marginTop: 14 }}>Hold my place</Link>
        </section>
      </div>
    </main>
  );
}













