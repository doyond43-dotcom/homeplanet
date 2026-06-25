import { Link } from "react-router-dom";
import type { CSSProperties } from "react";

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

const examples = [
  {
    title: "Pressure Washing",
    body: "Turn messy messages into a clean request, photos, estimate, schedule, and job flow.",
    chips: ["Request", "Photos", "Estimate", "Schedule", "Work board", "Updates"],
  },
  {
    title: "Pest Control",
    body: "Let customers identify the issue, request service, and stay updated without Messenger chaos.",
    chips: ["Issue", "Appointment", "Notes", "Lead board", "Follow-up"],
  },
  {
    title: "Auto Repair",
    body: "Collect vehicle info, issue details, photos, and status updates in one simple system.",
    chips: ["Vehicle", "Issue", "Photos", "Quote", "Status board"],
  },
  {
    title: "Restaurants",
    body: "Create awareness between guests, crew, kitchen, drinks, and the owner without extra confusion.",
    chips: ["Guest action", "Table flow", "Kitchen", "Crew", "Owner board"],
  },
];

const faqs = [
  {
    q: "How much does it cost?",
    a: "$47/month after the first version is built and approved.",
  },
  {
    q: "Do I pay before it is built?",
    a: "No. The first version is built first. You only pay if you approve it and want to keep it live.",
  },
  {
    q: "What do I get?",
    a: "A focused Live Page System built around your main customer workflow. Live Page on the outside. Live work board underneath.",
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
      "radial-gradient(circle at 20% 0%, rgba(52,211,153,0.15), transparent 28%), radial-gradient(circle at 90% 20%, rgba(20,184,166,0.10), transparent 28%), linear-gradient(180deg, #050505 0%, #08110d 52%, #050505 100%)",
    color: "#f8fafc",
    padding: "22px 18px 72px",
  };

  const wrap: CSSProperties = {
    width: "min(1080px, 100%)",
    margin: "0 auto",
  };

  const nav: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 18,
    borderRadius: 24,
    border: "1px solid rgba(56,189,248,0.24)",
    background:
      "radial-gradient(circle at 8% 50%, rgba(56,189,248,0.20), transparent 22%), radial-gradient(circle at 88% 50%, rgba(52,211,153,0.10), transparent 28%), rgba(0,0,0,0.68)",
    padding: "10px 13px",
    boxShadow:
      "0 20px 70px rgba(0,0,0,0.42), 0 0 28px rgba(56,189,248,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
  };

  const brand: CSSProperties = {
    display: "flex",
    alignItems: "center",
    color: "#f8fafc",
    textDecoration: "none",
    minWidth: 0,
  };

  const mark: CSSProperties = {
    width: 430,
    maxWidth: "68vw",
    height: "auto",
    display: "block",
    objectFit: "contain",
    filter:
      "drop-shadow(0 0 18px rgba(56,189,248,0.18)) drop-shadow(0 0 14px rgba(52,211,153,0.08))",
  };

  const brandPlanet: CSSProperties = {
    width: 38,
    height: 38,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    flex: "0 0 auto",
    background:
      "radial-gradient(circle at 35% 28%, rgba(255,255,255,0.95), rgba(125,211,252,0.62) 22%, rgba(34,197,94,0.28) 47%, rgba(0,0,0,0.92) 72%)",
    border: "1px solid rgba(125,211,252,0.34)",
    boxShadow:
      "0 0 22px rgba(56,189,248,0.22), 0 0 18px rgba(52,211,153,0.14), inset 0 1px 0 rgba(255,255,255,0.28)",
  };

  const brandOrbit: CSSProperties = {
    width: 26,
    height: 10,
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.62)",
    transform: "rotate(-18deg)",
    opacity: 0.9,
  };

  const brandText: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1,
    minWidth: 0,
  };

  const brandName: CSSProperties = {
    fontSize: 20,
    fontWeight: 1000,
    letterSpacing: "-0.04em",
    color: "#ffffff",
    textShadow: "0 0 18px rgba(255,255,255,0.18)",
  };

  const brandSub: CSSProperties = {
    marginTop: 4,
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(187,247,208,0.78)",
  };

const planetCore: CSSProperties = {
    position: "relative",
    width: 34,
    height: 34,
    borderRadius: 999,
    background:
      "radial-gradient(circle at 32% 25%, #dbeafe, #38bdf8 22%, #2563eb 48%, #020617 84%)",
    border: "1px solid rgba(147,197,253,0.42)",
    boxShadow:
      "0 0 22px rgba(59,130,246,0.56), inset 0 0 12px rgba(255,255,255,0.18)",
  };

  const navBtn: CSSProperties = {
    borderRadius: 999,
    border: "1px solid rgba(52,211,153,0.30)",
    background:
      "linear-gradient(135deg, rgba(52,211,153,1), rgba(16,185,129,0.92))",
    color: "#04110c",
    padding: "12px 20px",
    textDecoration: "none",
    fontWeight: 1000,
    fontSize: 13,
    boxShadow: "0 0 30px rgba(52,211,153,0.30)",
    whiteSpace: "nowrap",
  };

  const shell: CSSProperties = {
    borderRadius: 32,
    border: "1px solid rgba(255,255,255,0.09)",
    background:
      "linear-gradient(135deg, rgba(18,18,18,0.96), rgba(5,5,5,0.94))",
    boxShadow: "0 30px 90px rgba(0,0,0,0.42)",
    padding: "clamp(22px, 4vw, 42px)",
  };

  const heroGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.08fr 0.92fr",
    gap: 16,
  };

  const panel: CSSProperties = {
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "radial-gradient(circle at 50% 0%, rgba(52,211,153,0.12), transparent 42%), rgba(8,8,8,0.78)",
    padding: "clamp(20px, 3vw, 30px)",
  };

  const pricePanel: CSSProperties = {
    ...panel,
    background:
      "radial-gradient(circle at 55% 15%, rgba(52,211,153,0.22), transparent 38%), rgba(8,13,11,0.92)",
  };

  const eyebrow: CSSProperties = {
    color: "#34d399",
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginBottom: 12,
  };

  const h1: CSSProperties = {
    margin: 0,
    fontSize: "clamp(46px, 7vw, 74px)",
    lineHeight: 0.9,
    letterSpacing: "-0.075em",
  };

  const h2: CSSProperties = {
    margin: 0,
    fontSize: "clamp(32px, 5vw, 56px)",
    lineHeight: 0.96,
    letterSpacing: "-0.065em",
  };

  const sub: CSSProperties = {
    marginTop: 16,
    color: "#cbd5e1",
    lineHeight: 1.6,
    fontSize: 16,
  };

  const approveBox: CSSProperties = {
    marginTop: 22,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.045)",
    padding: 16,
  };

  const btnRow: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 22,
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

  const secondary: CSSProperties = {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#f8fafc",
    padding: "14px 18px",
    textDecoration: "none",
    fontWeight: 950,
  };

  const price: CSSProperties = {
    margin: 0,
    fontSize: "clamp(72px, 10vw, 116px)",
    lineHeight: 0.85,
    letterSpacing: "-0.08em",
    color: "#34d399",
    textShadow: "0 0 44px rgba(52,211,153,0.26)",
  };

  const miniBoard: CSSProperties = {
    marginTop: 34,
    borderRadius: 22,
    border: "1px solid rgba(59,130,246,0.18)",
    background: "rgba(15,23,42,0.74)",
    padding: 14,
    display: "grid",
    gap: 8,
  };

  const boardLine: CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(2,6,23,0.52)",
    padding: "11px 12px",
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: 850,
  };

  const section: CSSProperties = {
    marginTop: 16,
    borderRadius: 30,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(8,8,8,0.76)",
    padding: "clamp(18px, 3vw, 28px)",
  };

  const blueSection: CSSProperties = {
    ...section,
    border: "1px solid rgba(96,165,250,0.10)",
    background:
      "radial-gradient(circle at 84% 18%, rgba(59,130,246,0.10), transparent 34%), radial-gradient(circle at 18% 8%, rgba(52,211,153,0.06), transparent 30%), rgba(8,8,8,0.76)",
  };

  const visualSection: CSSProperties = {
    marginTop: 16,
    borderRadius: 32,
    border: "1px solid rgba(52,211,153,0.15)",
    background:
      "radial-gradient(circle at 20% 10%, rgba(52,211,153,0.18), transparent 32%), radial-gradient(circle at 80% 30%, rgba(14,165,233,0.12), transparent 34%), rgba(4,12,9,0.92)",
    padding: "clamp(20px, 4vw, 34px)",
    overflow: "hidden",
  };

  const visualGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "0.86fr 1.14fr",
    gap: 18,
    alignItems: "center",
    marginTop: 18,
  };

  const phone: CSSProperties = {
    borderRadius: 34,
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.96), rgba(2,6,23,0.96))",
    padding: 14,
    minHeight: 360,
    boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
  };

  const phoneScreen: CSSProperties = {
    height: "100%",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    background:
      "radial-gradient(circle at 50% 0%, rgba(52,211,153,0.18), transparent 38%), #050505",
    padding: 16,
  };

  const screenCard: CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.045)",
    padding: 13,
    marginTop: 10,
  };

  const workBoard: CSSProperties = {
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.10)",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.78), rgba(5,5,5,0.92))",
    padding: 18,
    minHeight: 360,
    boxShadow: "0 24px 80px rgba(0,0,0,0.38)",
  };

  const columns: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginTop: 14,
  };

  const columnCard: CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.28)",
    padding: 12,
    minHeight: 190,
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

  const queueGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 10,
    marginTop: 18,
  };

  const cta: CSSProperties = {
    marginTop: 16,
    borderRadius: 30,
    border: "1px solid rgba(52,211,153,0.18)",
    background:
      "radial-gradient(circle at 80% 20%, rgba(52,211,153,0.25), transparent 34%), radial-gradient(circle at 18% 24%, rgba(59,130,246,0.10), transparent 32%), rgba(6,78,59,0.28)",
    padding: "clamp(20px, 4vw, 34px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  };

  return (
    <main style={page}>
      <div style={wrap}>
        <nav style={nav}>
          <Link to="/planet/live-pages" style={brand}>
            <img
              src="/images/homeplanet_live_pages_logo_REAL_TRANSPARENT.png"
              alt="HomePlanet Live Pages for local businesses"
              style={mark}
            />
          </Link>
        </nav>

        <section style={shell}>
          <div style={heroGrid}>
            <article style={panel}>
              <div style={eyebrow}>DONE-FOR-YOU LIVE SYSTEMS</div>
              <h1 style={h1}>I build Live Pages for local businesses.</h1>
              <p style={sub}>
                Live Page on the outside. Live work board underneath. Built around the main customer
                workflow that is slowing you down right now.
              </p>

              <div style={approveBox}>
                <strong style={{ display: "block", fontSize: 18 }}>
                  Only pay after it is built and approved.
                </strong>
                <p style={{ ...sub, marginTop: 7, fontSize: 14 }}>
                  One focused Live Page System for your main workflow. Customers can request, book,
                  upload photos, get updates, and stay out of your Messenger inbox.
                </p>
              </div>

              <div style={btnRow}>
                <Link to="/planet/get-live" style={primary}>
                  Hold My Place in Line
                </Link>
                <Link to="/planet/live-pages/included" style={secondary}>
                  See What Is Included
                </Link>
              </div>
            </article>

            <article style={pricePanel}>
              <div style={eyebrow}>STARTER LIVE PAGE SYSTEM</div>
              <h2 style={price}>$47</h2>
              <div style={{ color: "#bbf7d0", fontWeight: 950, fontSize: 20 }}>
                per month after approval
              </div>

              <div style={miniBoard}>
                <div style={eyebrow}>LIVE WORK BOARD PREVIEW</div>
                <div style={boardLine}>
                  <span>New request</span>
                  <span style={{ color: "#34d399" }}>Sarah M.</span>
                </div>
                <div style={boardLine}>
                  <span>Photos uploaded</span>
                  <span style={{ color: "#34d399" }}>3 files</span>
                </div>
                <div style={boardLine}>
                  <span>Estimate needed</span>
                  <span style={{ color: "#34d399" }}>Ready</span>
                </div>
                <div style={boardLine}>
                  <span>Review status</span>
                  <span style={{ color: "#34d399" }}>Building</span>
                </div>
              </div>

              <p style={{ ...sub, fontSize: 14 }}>
                Includes intake, booking/request flow, photo uploads, customer updates, hosting,
                basic maintenance, and a live work board.
              </p>

              <div style={{ color: "#34d399", fontWeight: 950 }}>
                First come, first served.
              </div>
            </article>
          </div>
        </section>

        <section style={section}>
          <div style={eyebrow}>THE DIFFERENCE</div>
          <h2 style={h2}>Websites get looked at. Live Pages get used.</h2>
          <p style={{ ...sub, marginBottom: 0 }}>
            A website usually stops at information. A Live Page starts the workflow and gives your
            business a simple place to catch the next step.
          </p>
        </section>

        <section style={visualSection}>
          <div style={eyebrow}>THE SYSTEM VIEW</div>
          <h2 style={h2}>One front door. One work board. One clear flow.</h2>
          <p style={{ ...sub, maxWidth: 760 }}>
            The customer sees a simple page. You see the work behind it. Requests, photos, review
            links, and activation steps stop floating around in random messages.
          </p>

          <div style={visualGrid}>
            <div style={phone}>
              <div style={phoneScreen}>
                <div style={eyebrow}>CUSTOMER SIDE</div>
                <h3 style={{ margin: 0, fontSize: 30, lineHeight: 1 }}>
                  Request service.
                </h3>
                <p style={{ ...sub, fontSize: 13 }}>
                  The customer knows what to do next.
                </p>
                <div style={screenCard}>
                  <strong>What do you need?</strong>
                  <div style={chipWrap}>
                    <span style={chip}>Estimate</span>
                    <span style={chip}>Booking</span>
                    <span style={chip}>Photos</span>
                  </div>
                </div>
                <div style={screenCard}>
                  <strong>Upload photos</strong>
                  <p style={{ ...sub, marginTop: 5, fontSize: 12 }}>
                    Job details come in before the back-and-forth starts.
                  </p>
                </div>
                <Link to="/planet/get-live" style={{ ...primary, display: "block", textAlign: "center", marginTop: 14 }}>
                  Start request
                </Link>
              </div>
            </div>

            <div style={workBoard}>
              <div style={eyebrow}>BUSINESS SIDE</div>
              <h3 style={{ margin: 0, fontSize: 34, lineHeight: 1 }}>
                The work has somewhere to land.
              </h3>
              <div style={columns}>
                {["Message received", "Ready for review", "Approved / Activate"].map((title, index) => (
                  <div key={title} style={columnCard}>
                    <div style={{ color: "#34d399", fontSize: 12, fontWeight: 950 }}>
                      0{index + 1}
                    </div>
                    <strong style={{ display: "block", marginTop: 8 }}>{title}</strong>
                    <div style={screenCard}>
                      <div style={{ fontWeight: 950 }}>Local business</div>
                      <p style={{ ...sub, marginTop: 5, fontSize: 12 }}>
                        Customer request, notes, links, and next step.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={blueSection}>
          <div style={eyebrow}>HOW IT WORKS</div>
          <h2 style={h2}>Built for you. Approved by you.</h2>

          <div style={grid}>
            {[
              ["Tell us what you do", "We learn your business type and main customer workflow."],
              ["We build the first version", "Your Live Page and work board are shaped around that workflow."],
              ["You review it", "You see the system before paying to keep it live."],
              ["You approve and go live", "$47/month keeps it hosted, maintained, and ready to use."],
            ].map(([title, body], index) => (
              <article key={title} style={card}>
                <div style={{ color: "#34d399", fontSize: 12, fontWeight: 950 }}>
                  0{index + 1}
                </div>
                <h3 style={{ margin: "12px 0 0", fontSize: 20 }}>{title}</h3>
                <p style={{ margin: "8px 0 0", color: "#94a3b8", lineHeight: 1.5, fontSize: 14 }}>
                  {body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section style={section} id="included">
          <div style={eyebrow}>WHAT IS INCLUDED</div>
          <h2 style={h2}>A Live Page on the outside. A work board underneath.</h2>
          <p style={{ ...sub, fontSize: 15 }}>
            This is not a feature checklist. It is one focused system built around how your customers
            start the work and how you keep the work moving.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
              marginTop: 20,
            }}
          >
            <article
              style={{
                ...card,
                minHeight: 250,
                background:
                  "radial-gradient(circle at 35% 0%, rgba(52,211,153,0.16), transparent 40%), rgba(255,255,255,0.035)",
              }}
            >
              <div style={eyebrow}>01 CUSTOMER SIDE</div>
              <h3 style={{ margin: 0, fontSize: 28, lineHeight: 1, letterSpacing: "-0.05em" }}>
                The public Live Page.
              </h3>
              <p style={{ margin: "12px 0 0", color: "#94a3b8", lineHeight: 1.55, fontSize: 14 }}>
                Customers get a clear place to request, book, upload photos, explain what they need,
                and understand what happens next.
              </p>
              <div style={chipWrap}>
                {["Customer intake", "Booking/request flow", "Photo uploads", "Customer updates"].map((item) => (
                  <span key={item} style={chip}>
                    {item}
                  </span>
                ))}
              </div>
            </article>

            <article
              style={{
                ...card,
                minHeight: 250,
                background:
                  "radial-gradient(circle at 35% 0%, rgba(14,165,233,0.14), transparent 40%), rgba(255,255,255,0.035)",
              }}
            >
              <div style={eyebrow}>02 BUSINESS SIDE</div>
              <h3 style={{ margin: 0, fontSize: 28, lineHeight: 1, letterSpacing: "-0.05em" }}>
                The live work board.
              </h3>
              <p style={{ margin: "12px 0 0", color: "#94a3b8", lineHeight: 1.55, fontSize: 14 }}>
                Leads, requests, notes, review links, and activation steps land in one place instead of
                getting buried in random messages.
              </p>
              <div style={chipWrap}>
                {["Lead queue", "Status movement", "Review links", "Payment activation"].map((item) => (
                  <span key={item} style={chip}>
                    {item}
                  </span>
                ))}
              </div>
            </article>

            <article
              style={{
                ...card,
                minHeight: 250,
                background:
                  "radial-gradient(circle at 35% 0%, rgba(52,211,153,0.12), transparent 40%), rgba(255,255,255,0.035)",
              }}
            >
              <div style={eyebrow}>03 KEPT ALIVE</div>
              <h3 style={{ margin: 0, fontSize: 28, lineHeight: 1, letterSpacing: "-0.05em" }}>
                Hosted and maintained.
              </h3>
              <p style={{ margin: "12px 0 0", color: "#94a3b8", lineHeight: 1.55, fontSize: 14 }}>
                The $47/month keeps the Live Page hosted, maintained, and ready for small updates so
                it does not go stale after launch.
              </p>
              <div style={chipWrap}>
                {["Hosting", "Basic maintenance", "Small updates", "Live system support"].map((item) => (
                  <span key={item} style={chip}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          </div>

          <div
            style={{
              marginTop: 14,
              borderRadius: 24,
              border: "1px solid rgba(52,211,153,0.16)",
              background:
                "linear-gradient(135deg, rgba(6,78,59,0.22), rgba(0,0,0,0.28))",
              padding: 18,
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ color: "#34d399", fontWeight: 950, fontSize: 13, letterSpacing: "0.12em" }}>
                BUILT FIRST. REVIEWED FIRST.
              </div>
              <div style={{ marginTop: 6, color: "#f8fafc", fontWeight: 950, fontSize: 20 }}>
                You only pay after the first version is built and approved.
              </div>
            </div>
            <Link to="/planet/live-pages/included" style={secondary}>
              View full breakdown
            </Link>
          </div>
        </section>
        <section style={blueSection}>
          <div style={eyebrow}>BUILT AROUND YOUR BUSINESS</div>
          <h2 style={h2}>Not every business needs the same system.</h2>
          <p style={{ ...sub, fontSize: 15 }}>
            A Live Page is shaped around the main customer action that matters most to your business.
            The outside stays simple for the customer. The work underneath is built around how you
            actually operate.
          </p>

          <div style={grid}>
            {[
              ["Local service work", "For businesses dealing with requests, photos, estimates, scheduling, job updates, and customer follow-up."],
              ["Appointment and request flow", "For businesses that need customers to explain what they need before the work can move forward."],
              ["Customer-to-staff awareness", "For businesses where the customer side, staff side, and owner side need to stay connected."],
              ["Custom local workflow", "For businesses that do not fit inside a cookie-cutter website or one-size-fits-all app."],
            ].map(([title, body]) => (
              <article key={title} style={card}>
                <h3 style={{ margin: 0, fontSize: 22 }}>{title}</h3>
                <p style={{ margin: "8px 0 0", color: "#94a3b8", lineHeight: 1.5, fontSize: 14 }}>
                  {body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section style={cta}>
          <div>
            <div style={eyebrow}>FIRST COME, FIRST SERVED</div>
            <h2 style={{ ...h2, fontSize: "clamp(32px, 5vw, 56px)" }}>
              Message us to hold your place in line.
            </h2>
            <p style={{ ...sub, marginBottom: 0, fontSize: 15 }}>
              We go by first-come, first-served messages. Please hold your place in line. We will get
              to everyone as quickly as we can.
            </p>
          </div>
          <Link to="/planet/get-live" style={primary}>
            Hold My Place
          </Link>
        </section>
      </div>
    </main>
  );
}















