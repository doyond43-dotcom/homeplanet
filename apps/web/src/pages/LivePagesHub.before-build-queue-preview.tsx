import { Link } from "react-router-dom";
import type { CSSProperties } from "react";

type Example = {
  title: string;
  line: string;
  flow: string[];
};

const included = [
  "Done-for-you Live Page",
  "Customer intake",
  "Booking or request flow",
  "Photo uploads",
  "Customer updates",
  "Live work board",
  "Hosting",
  "Basic maintenance",
  "Small updates",
];

const examples: Example[] = [
  {
    title: "Pressure Washing",
    line: "Turn messy messages into a clean request, photo, estimate, schedule, and job flow.",
    flow: ["Request", "Photos", "Estimate", "Schedule", "Work board", "Updates"],
  },
  {
    title: "Pest Control",
    line: "Let customers identify the issue, request service, and stay updated without Messenger chaos.",
    flow: ["Issue", "Appointment", "Notes", "Lead board", "Follow-up"],
  },
  {
    title: "Auto Repair",
    line: "Collect vehicle info, issue details, photos, and status updates in one simple system.",
    flow: ["Vehicle", "Issue", "Photos", "Quote", "Status board"],
  },
  {
    title: "Restaurants",
    line: "Create awareness between guests, crew, kitchen, drinks, and the owner without extra confusion.",
    flow: ["Guest action", "Table flow", "Kitchen", "Crew", "Owner board"],
  },
];

const faqs = [
  {
    q: "How much does it cost?",
    a: "$47/month after your first version is built and approved.",
  },
  {
    q: "Do I pay before it is built?",
    a: "No. The first version is built first. You only pay if you approve it and want to keep it live.",
  },
  {
    q: "What do I get?",
    a: "One focused Live System built around your main customer workflow. Live Page on the outside. Live work board underneath.",
  },
  {
    q: "Does this include Google?",
    a: "We can connect your Live Page with your Google Business Profile and make it shareable and indexable. Google ads and ranking guarantees are separate.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. If you already have a domain, we can point it to your Live Page. If not, we can help you get one.",
  },
];

export default function LivePagesHub() {
  const page: CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% 0%, rgba(52,211,153,0.13), transparent 30%), radial-gradient(circle at 90% 42%, rgba(34,211,238,0.08), transparent 28%), linear-gradient(180deg, #050505 0%, #090909 52%, #050505 100%)",
    color: "#f8fafc",
    padding: "24px 18px 72px",
  };

  const wrap: CSSProperties = {
    width: "min(1120px, 100%)",
    margin: "0 auto",
  };

  const nav: CSSProperties = {
    height: 56,
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 999,
    background: "rgba(10,10,10,0.86)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 14px",
    marginBottom: 54,
    boxShadow: "0 18px 70px rgba(0,0,0,0.34)",
  };

  const brand: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "#fff",
    textDecoration: "none",
    fontWeight: 950,
  };

  const logo: CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 999,
    objectFit: "cover",
  };

  const navPill: CSSProperties = {
    borderRadius: 999,
    padding: "8px 12px",
    background: "#f8fafc",
    color: "#020617",
    textDecoration: "none",
    fontSize: 12,
    fontWeight: 950,
  };

  const hero: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.74fr)",
    gap: 28,
    alignItems: "stretch",
    marginBottom: 22,
  };

  const heroCard: CSSProperties = {
    borderRadius: 38,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "linear-gradient(135deg, rgba(17,17,17,0.96), rgba(6,6,6,0.96)), radial-gradient(circle at 18% 0%, rgba(52,211,153,0.15), transparent 34%)",
    padding: "clamp(26px, 5vw, 54px)",
    boxShadow: "0 34px 100px rgba(0,0,0,0.46)",
  };

  const eyebrow: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid rgba(52,211,153,0.28)",
    background: "rgba(6,78,59,0.16)",
    color: "#a7f3d0",
    borderRadius: 999,
    padding: "7px 11px",
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: "0.08em",
    marginBottom: 18,
  };

  const h1: CSSProperties = {
    margin: 0,
    fontSize: "clamp(44px, 7vw, 82px)",
    lineHeight: 0.91,
    letterSpacing: "-0.078em",
    color: "#f8fafc",
  };

  const sub: CSSProperties = {
    marginTop: 18,
    color: "#cbd5e1",
    lineHeight: 1.56,
    fontSize: 18,
    maxWidth: 720,
  };

  const pricePanel: CSSProperties = {
    borderRadius: 34,
    border: "1px solid rgba(52,211,153,0.18)",
    background:
      "radial-gradient(circle at 50% 0%, rgba(52,211,153,0.18), transparent 36%), rgba(9,9,9,0.9)",
    padding: 26,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 420,
    boxShadow: "0 34px 100px rgba(0,0,0,0.38)",
  };

  const price: CSSProperties = {
    margin: "18px 0 0",
    fontSize: "clamp(72px, 9vw, 118px)",
    lineHeight: 0.86,
    letterSpacing: "-0.08em",
    color: "#34d399",
    fontWeight: 950,
    textShadow: "0 0 34px rgba(52,211,153,0.22)",
  };

  const actions: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 26,
  };

  const primary: CSSProperties = {
    borderRadius: 999,
    padding: "14px 18px",
    background: "#34d399",
    color: "#022c22",
    fontWeight: 950,
    textDecoration: "none",
    boxShadow: "0 0 28px rgba(52,211,153,0.18)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const secondary: CSSProperties = {
    borderRadius: 999,
    padding: "14px 18px",
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    border: "1px solid rgba(255,255,255,0.14)",
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const strip: CSSProperties = {
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(12,12,12,0.82)",
    padding: 20,
    marginBottom: 18,
  };

  const h2: CSSProperties = {
    margin: 0,
    fontSize: "clamp(32px, 5vw, 58px)",
    lineHeight: 0.96,
    letterSpacing: "-0.07em",
  };

  const grid4: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 12,
    marginTop: 18,
  };

  const grid3: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 14,
    marginTop: 18,
  };

  const card: CSSProperties = {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(5,5,5,0.52)",
    padding: 18,
  };

  const tinyLabel: CSSProperties = {
    color: "#34d399",
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
  };

  const includedGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 10,
    marginTop: 18,
  };

  const includePill: CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.035)",
    padding: "12px 13px",
    color: "#e5e7eb",
    fontWeight: 850,
  };

  const exampleFlow: CSSProperties = {
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
    padding: "6px 8px",
    fontSize: 12,
    fontWeight: 850,
  };

  const faqGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 12,
    marginTop: 18,
  };

  const footer: CSSProperties = {
    marginTop: 18,
    borderRadius: 34,
    border: "1px solid rgba(52,211,153,0.18)",
    background:
      "linear-gradient(135deg, rgba(6,78,59,0.22), rgba(5,5,5,0.94))",
    padding: "clamp(24px, 5vw, 42px)",
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 18,
    alignItems: "center",
  };

  return (
    <main style={page}>
      <div style={wrap}>
        <nav style={nav}>
          <Link to="/" style={brand}>
            <img src="/images/HomePlanet-Official-Logo-V1.png" alt="HomePlanet" style={logo} />
            <span>HomePlanet</span>
          </Link>

          <Link to="/planet/get-live" style={navPill}>
            Hold my place
          </Link>
        </nav>

        <section style={hero} className="hp-live-offer-hero">
          <div style={heroCard}>
            <div style={eyebrow}>DONE-FOR-YOU LIVE SYSTEMS</div>

            <h1 style={h1}>I build Live Systems for local businesses.</h1>

            <p style={sub}>
              Live Page on the outside. Live work board underneath. Built around the main customer
              workflow that is slowing you down right now.
            </p>

            <div
              style={{
                marginTop: 24,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.035)",
                padding: 18,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 950, letterSpacing: "-0.04em" }}>
                Only pay after it is built and approved.
              </div>
              <p style={{ color: "#94a3b8", lineHeight: 1.5, marginBottom: 0 }}>
                One focused Live System for your main workflow. Customers can request, book,
                upload photos, get updates, and stay out of your Messenger inbox.
              </p>
            </div>

            <div style={actions}>
              <Link to="/planet/get-live" style={primary}>
                Hold My Place in Line
              </Link>
              <a href="#included" style={secondary}>
                See What Is Included
              </a>
            </div>
          </div>

          <aside style={pricePanel}>
            <div>
              <div style={tinyLabel}>Starter Live System</div>
              <div style={price}>$47</div>
              <div style={{ color: "#a7f3d0", fontSize: 30, fontWeight: 950, letterSpacing: "-0.05em" }}>
                per month
              </div>
            </div>

            <div>
              <p style={{ color: "#cbd5e1", lineHeight: 1.5, fontSize: 16 }}>
                Includes intake, booking/request flow, photo uploads, customer updates,
                hosting, basic maintenance, and a live work board.
              </p>
              <div style={{ color: "#34d399", fontWeight: 950 }}>
                First come, first served.
              </div>
            </div>
          </aside>
        </section>

        <section style={strip}>
          <div style={tinyLabel}>THE DIFFERENCE</div>
          <h2 style={{ ...h2, marginTop: 10 }}>
            A website gets looked at. A Live Page gets used.
          </h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.55, maxWidth: 820, fontSize: 17 }}>
            If customers still have to message you, text photos, ask for updates, chase estimates,
            and wonder what happens next, your website is not doing enough.
          </p>
        </section>

        <section style={strip}>
          <div style={tinyLabel}>HOW IT WORKS</div>
          <h2 style={{ ...h2, marginTop: 10 }}>Built for you. Approved by you.</h2>

          <div style={grid4}>
            {[
              ["01", "Tell us what you do", "We learn your business type and main customer workflow."],
              ["02", "We build the first version", "Your Live Page and work board are shaped around that workflow."],
              ["03", "You review it", "You see the system before paying to keep it live."],
              ["04", "You approve and go live", "$47/month keeps it hosted, maintained, and ready to use."],
            ].map(([num, title, text]) => (
              <article key={num} style={card}>
                <div style={tinyLabel}>{num}</div>
                <h3 style={{ margin: "12px 0 0", fontSize: 24, letterSpacing: "-0.045em" }}>{title}</h3>
                <p style={{ color: "#94a3b8", lineHeight: 1.45, marginBottom: 0 }}>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="included" style={strip}>
          <div style={tinyLabel}>WHAT IS INCLUDED</div>
          <h2 style={{ ...h2, marginTop: 10 }}>One focused Live System for your main workflow.</h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.55, maxWidth: 820, fontSize: 17 }}>
            This is not a dead website and it is not a random app. It is a focused system built around
            how your customers start the work and how you keep the work organized.
          </p>

          <div style={includedGrid}>
            {included.map((item) => (
              <div key={item} style={includePill}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section style={strip}>
          <div style={tinyLabel}>REAL WORKFLOW EXAMPLES</div>
          <h2 style={{ ...h2, marginTop: 10 }}>The system changes based on the business.</h2>

          <div style={grid3}>
            {examples.map((example) => (
              <article key={example.title} style={card}>
                <h3 style={{ margin: 0, fontSize: 26, letterSpacing: "-0.045em" }}>{example.title}</h3>
                <p style={{ color: "#94a3b8", lineHeight: 1.45 }}>{example.line}</p>
                <div style={exampleFlow}>
                  {example.flow.map((step) => (
                    <span key={step} style={chip}>
                      {step}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={strip}>
          <div style={tinyLabel}>COMMON QUESTIONS</div>
          <h2 style={{ ...h2, marginTop: 10 }}>Simple answers before you message.</h2>

          <div style={faqGrid}>
            {faqs.map((faq) => (
              <article key={faq.q} style={card}>
                <h3 style={{ margin: 0, fontSize: 22, letterSpacing: "-0.035em" }}>{faq.q}</h3>
                <p style={{ color: "#94a3b8", lineHeight: 1.5, marginBottom: 0 }}>{faq.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={footer} className="hp-live-offer-footer">
          <div>
            <div style={tinyLabel}>FIRST COME, FIRST SERVED</div>
            <h2 style={{ ...h2, marginTop: 10 }}>Message us to hold your place in line.</h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.55, maxWidth: 760, fontSize: 17, marginBottom: 0 }}>
              We go by first-come, first-served messages. Please hold your place in line.
              We will get to everyone as quickly as we can.
            </p>
          </div>

          <Link to="/planet/get-live" style={primary}>
            Hold My Place
          </Link>
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hp-live-offer-hero {
            grid-template-columns: 1fr !important;
          }

          .hp-live-offer-footer {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
