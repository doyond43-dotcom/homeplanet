import { Link } from "react-router-dom";
import type { CSSProperties } from "react";

export default function LivePagesHub() {
  const page: CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 20% 0%, rgba(52,211,153,0.15), transparent 28%), radial-gradient(circle at 90% 20%, rgba(20,184,166,0.10), transparent 28%), linear-gradient(180deg, #050505 0%, #08110d 52%, #050505 100%)",
    color: "#f8fafc",
    padding: "22px 18px 72px",
  };

  const wrap: CSSProperties = {
    width: "min(980px, 100%)",
    margin: "0 auto",
  };

  const nav: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 18,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.50)",
    padding: "9px 10px 9px 14px",
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
  };

  const brand: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 9,
    color: "#f8fafc",
    fontWeight: 950,
    fontSize: 13,
    textDecoration: "none",
  };

  const mark: CSSProperties = {
    width: 24,
    height: 24,
    borderRadius: 999,
    background:
      "radial-gradient(circle at 35% 30%, #67e8f9, #2563eb 42%, #020617 76%)",
    boxShadow: "0 0 28px rgba(52,211,153,0.24)",
  };

  const navBtn: CSSProperties = {
    borderRadius: 999,
    background: "#f8fafc",
    color: "#020617",
    padding: "9px 13px",
    textDecoration: "none",
    fontWeight: 1000,
    fontSize: 12,
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

  const differenceGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 0.9fr",
    gap: 18,
    alignItems: "center",
  };

  const imageSection: CSSProperties = {
    marginTop: 16,
    borderRadius: 32,
    border: "1px solid rgba(52,211,153,0.15)",
    background:
      "radial-gradient(circle at 22% 8%, rgba(52,211,153,0.18), transparent 34%), radial-gradient(circle at 82% 20%, rgba(14,165,233,0.12), transparent 34%), rgba(4,12,9,0.92)",
    padding: "clamp(20px, 4vw, 34px)",
    overflow: "hidden",
  };

  const imageGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "0.8fr 1.2fr",
    gap: 18,
    alignItems: "center",
    marginTop: 18,
  };

  const imageFrame: CSSProperties = {
    borderRadius: 30,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.32)",
    padding: 10,
    boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
  };

  const img: CSSProperties = {
    width: "100%",
    display: "block",
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const proofList: CSSProperties = {
    display: "grid",
    gap: 10,
  };

  const proofCard: CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.045)",
    padding: 14,
  };

  const howGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
    marginTop: 18,
  };

  const card: CSSProperties = {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.035)",
    padding: 16,
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

  return (
    <main style={page}>
      <div style={wrap}>
        <nav style={nav}>
          <Link to="/planet/live-pages" style={brand}>
            <span style={mark} />
            <span>HomePlanet</span>
          </Link>

          <Link to="/planet/get-live" style={navBtn}>
            Hold my place
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
                  Customers can request, book, upload photos, get updates, and stay out of your
                  Messenger inbox.
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
                Includes intake, request flow, photo uploads, customer updates, hosting, basic
                maintenance, and a live work board.
              </p>

              <div style={{ color: "#34d399", fontWeight: 950 }}>
                First come, first served.
              </div>
            </article>
          </div>
        </section>

        <section style={section}>
          <div style={differenceGrid}>
            <div>
              <div style={eyebrow}>THE DIFFERENCE</div>
              <h2 style={h2}>Websites get looked at. Live Pages get used.</h2>
            </div>
            <p style={{ ...sub, margin: 0 }}>
              A website usually stops at information. A Live Page starts the workflow and gives your
              business a simple place to catch the next step.
            </p>
          </div>
        </section>

        <section style={imageSection}>
          <div style={eyebrow}>THE SYSTEM PROOF</div>
          <h2 style={h2}>One public page. One working flow underneath.</h2>

          <div style={imageGrid}>
            <div style={proofList}>
              <div style={proofCard}>
                <div style={eyebrow}>01 CUSTOMER SIDE</div>
                <strong style={{ fontSize: 20 }}>They know what to do.</strong>
                <p style={{ ...sub, marginTop: 7, fontSize: 14 }}>
                  Request, book, upload photos, explain the job, and move forward without confusion.
                </p>
              </div>

              <div style={proofCard}>
                <div style={eyebrow}>02 BUSINESS SIDE</div>
                <strong style={{ fontSize: 20 }}>You know what is next.</strong>
                <p style={{ ...sub, marginTop: 7, fontSize: 14 }}>
                  Leads, notes, review links, and activation steps stop getting buried in messages.
                </p>
              </div>

              <Link to="/planet/live-pages/included" style={{ ...secondary, display: "inline-block", textAlign: "center" }}>
                View full breakdown
              </Link>
            </div>

            <div style={imageFrame}>
              <img
                src="/images/homeplanet-your-workflow-live-v1.png"
                alt="HomePlanet Live Page workflow preview"
                style={img}
              />
            </div>
          </div>
        </section>

        <section style={section}>
          <div style={eyebrow}>HOW IT WORKS</div>
          <h2 style={h2}>Built for you. Approved by you.</h2>

          <div style={howGrid}>
            {[
              ["01", "Tell us what you do", "We learn your business type and main customer workflow."],
              ["02", "We build the first version", "Your Live Page and work board are shaped around that workflow."],
              ["03", "You review it", "You see the system before paying to keep it live."],
              ["04", "You approve and go live", "$47/month keeps it hosted, maintained, and ready to use."],
            ].map(([num, title, body]) => (
              <article key={title} style={card}>
                <div style={{ color: "#34d399", fontSize: 13, fontWeight: 950 }}>
                  {num}
                </div>
                <h3 style={{ margin: "12px 0 0", fontSize: 20 }}>{title}</h3>
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
