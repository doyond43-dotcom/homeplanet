import { Link } from "react-router-dom";
import { useEffect } from "react";
import type { CSSProperties } from "react";

import { hpEvent } from "../lib/hpEvent";
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
  useEffect(() => {
    hpEvent({
      event: "live_pages_view",
      board: "homeplanet-live-pages",
      entityId: "live-pages-offer",
      meta: { path: window.location.pathname },
    });
  }, []);
  const page: CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 20% 0%, rgba(52,211,153,0.15), transparent 28%), radial-gradient(circle at 90% 20%, rgba(20,184,166,0.10), transparent 28%), linear-gradient(180deg, #050505 0%, #08110d 52%, #050505 100%)",
    color: "#e5e7eb",
    padding: "22px 18px 72px",
  };

  const wrap: CSSProperties = {
    width: "min(1180px, 100%)",
    margin: "0 auto",
  };

  const nav: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 22,
    padding: "0",
    background: "transparent",
    border: "0",
    boxShadow: "none",
  };

  const brand: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    color: "#e5e7eb",
    textDecoration: "none",
    minWidth: 0,
  };

  const mark: CSSProperties = {
    display: "none",
  };

  const brandText: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 0,
    lineHeight: 1,
  };

  const brandName: CSSProperties = {
    fontSize: 34,
    fontWeight: 1000,
    letterSpacing: "-0.045em",
    color: "#ffffff",
    lineHeight: 0.9,
    whiteSpace: "nowrap",
    textShadow:
      "0 0 18px rgba(255,255,255,0.12), 0 0 22px rgba(52,211,153,0.10)",
  };

  const brandSub: CSSProperties = {
    marginTop: 9,
    fontSize: 10,
    fontWeight: 1000,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "#d6b35f",
    whiteSpace: "nowrap",
    textShadow: "0 0 10px rgba(214,179,95,0.14)",
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
    fontWeight: 900,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginBottom: 12,
  };

  const h1: CSSProperties = {
    margin: 0,
    fontSize: "clamp(42px, 6.2vw, 66px)",
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
    color: "#e5e7eb",
    padding: "14px 18px",
    textDecoration: "none",
    fontWeight: 900,
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
      <div style={wrap}>        <section
          style={{
            ...shell,
            position: "relative",
            overflow: "hidden",
            minHeight: 640,
            padding: "clamp(34px, 6vw, 68px)",
            display: "flex",
            alignItems: "center",
            background:
              "linear-gradient(135deg, rgba(4,12,9,0.92), rgba(5,5,5,0.78))",
          }}
        >
          <img
            src="/images/a_sleek_futuristic_ui_concept_scene_with_a_dark_1.png"
            alt="HomePlanet Live Pages hero visual"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              opacity: 1,
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(4,4,4,0.985) 0%, rgba(4,4,4,0.95) 34%, rgba(4,4,4,0.62) 56%, rgba(4,4,4,0.16) 76%, rgba(4,4,4,0.02) 100%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 78% 42%, rgba(52,211,153,0.14), transparent 28%), radial-gradient(circle at 88% 18%, rgba(14,165,233,0.06), transparent 24%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: 550,
              padding: "10px 0 14px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-28px -36px -30px -24px",
                background:
                  "radial-gradient(circle at 18% 22%, rgba(0,0,0,0.62), rgba(0,0,0,0.34) 48%, rgba(0,0,0,0.12) 72%, transparent 100%)",
                filter: "blur(2px)",
                pointerEvents: "none",
                zIndex: -1,
              }}
            />
            <Link to="/planet/live-pages" style={{ ...brand, marginBottom: 42 }}>
              <span style={brandText}>
                <span style={brandName}>HomePlanet</span>
                <span style={brandSub}>LIVE PAGES FOR LOCAL BUSINESSES</span>
              </span>
            </Link>

            <div style={eyebrow}>DONE-FOR-YOU LIVE SYSTEMS</div>

            <h1 style={h1}>
              We build Live Pages for local businesses.
            </h1>

            <p style={{ ...sub, fontSize: 17, maxWidth: 515 }}>
              A Live Page is not just a website. It is the front door to the way your
              business actually runs.
            </p>

            <p
              style={{
                margin: "20px 0 0",
                color: "#dfe5ea",
                fontSize: "clamp(20px, 2.3vw, 26px)",
                lineHeight: 1.16,
                fontWeight: 750,
                letterSpacing: "-0.045em",
                maxWidth: 480,
              }}
            >
              Simple on the outside.
              <br />
              Organized underneath.
              <br />
              Built around your real workflow.
            </p>

            <div style={btnRow}>
<Link to="/planet/get-live" onClick={(e) => { e.preventDefault(); hpEvent({ event: "live_pages_hold_place_click", board: "homeplanet-live-pages", entityId: "hold-place", meta: { path: window.location.pathname } }); window.setTimeout(() => { window.location.href = "/planet/get-live"; }, 120); }} style={primary}>
                Hold My Place in Line
              </Link>
              <Link to="/planet/home-services" onClick={(e) => { e.preventDefault(); hpEvent({ event: "live_pages_demo_click", board: "homeplanet-live-pages", entityId: "explore-demo", meta: { path: window.location.pathname } }); window.setTimeout(() => { window.location.href = "/planet/home-services"; }, 120); }} style={secondary}>
                Explore Live Demo
              </Link>
            </div>
          </div>
        </section>

        <section
  style={{
    marginTop: 26,
    borderRadius: 36,
    padding: "clamp(24px, 4vw, 38px)",
    border: "1px solid rgba(52,211,153,0.20)",
    background:
      "radial-gradient(circle at 12% 18%, rgba(52,211,153,0.18), transparent 30%), radial-gradient(circle at 85% 22%, rgba(16,185,129,0.12), transparent 26%), linear-gradient(135deg, rgba(5,8,8,0.98), rgba(2,3,3,0.98))",
    boxShadow:
      "0 30px 90px rgba(0,0,0,0.44), inset 0 0 0 1px rgba(52,211,153,0.04)",
    overflow: "hidden",
  }}
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: 20,
      alignItems: "stretch",
    }}
  >
    <div>
      <div style={eyebrow}>THE OFFER</div>

      <h2
        style={{
          ...h2,
          margin: "0 0 14px",
          fontSize: "clamp(52px, 8vw, 88px)",
          lineHeight: 0.92,
          letterSpacing: "-0.06em",
          maxWidth: 760,
        }}
      >
        <span style={{ color: "#6ee7b7" }}>$47/month</span> Live Page System.
      </h2>

      <p
        style={{
          margin: "0 0 12px",
          color: "#ecfdf5",
          fontSize: 24,
          fontWeight: 950,
          lineHeight: 1.2,
        }}
      >
        Nothing due upfront.
      </p>

      <p
        style={{
          margin: "0 0 22px",
          color: "#cbd5e1",
          fontSize: 18,
          lineHeight: 1.65,
          maxWidth: 720,
        }}
      >
        We build the first version around your real workflow first. You review it. You approve it.
        Only then does it go live for{" "}
        <span style={{ color: "#6ee7b7", fontWeight: 900 }}>$47/month</span>.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <Link
          to="/planet/get-live" onClick={(e) => { e.preventDefault(); hpEvent({ event: "live_pages_hold_place_click", board: "homeplanet-live-pages", entityId: "hold-place", meta: { path: window.location.pathname } }); window.setTimeout(() => { window.location.href = "/planet/get-live"; }, 120); }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 54,
            padding: "0 22px",
            borderRadius: 999,
            background: "#34d399",
            color: "#03110c",
            textDecoration: "none",
            fontWeight: 1000,
            fontSize: 16,
            boxShadow: "0 0 34px rgba(52,211,153,0.28)",
          }}
        >
          Hold My Place in Line
        </Link>

        <Link
          to="/planet/home-services" onClick={(e) => { e.preventDefault(); hpEvent({ event: "live_pages_demo_click", board: "homeplanet-live-pages", entityId: "explore-demo", meta: { path: window.location.pathname } }); window.setTimeout(() => { window.location.href = "/planet/home-services"; }, 120); }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 54,
            padding: "0 22px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "#f8fafc",
            textDecoration: "none",
            fontWeight: 900,
            fontSize: 16,
          }}
        >
          Explore Live Demo
        </Link>
      </div>

      <div
        style={{
          color: "#94a3b8",
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1.5,
        }}
      >
        First-come, first-served. Please hold your place in line — we will get to you.
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gap: 14,
        alignContent: "start",
      }}
    >
      {[
        {
          n: "01",
          title: "Built first",
          text: "No payment to start. We build the first version before you pay anything.",
        },
        {
          n: "02",
          title: "Approved by you",
          text: "You review it first. If you do not want it live, you do not pay.",
        },
        {
          n: "03",
          title: "Then $47/month",
          text: "Hosting, maintenance, and small updates included after approval.",
        },
      ].map((item) => (
        <div
          key={item.title}
          style={{
            borderRadius: 24,
            padding: "18px 18px 16px",
            border: "1px solid rgba(52,211,153,0.14)",
            background: "linear-gradient(180deg, rgba(10,14,18,0.94), rgba(4,7,8,0.94))",
          }}
        >
          <div style={{ color: "#34d399", fontSize: 12, fontWeight: 950, letterSpacing: "0.18em", marginBottom: 10 }}>
            {item.n}
          </div>
          <div style={{ color: "#f8fafc", fontSize: 22, fontWeight: 900, marginBottom: 6 }}>
            {item.title}
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 15, lineHeight: 1.6 }}>
            {item.text}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

        <section style={visualSection}>
          <div style={eyebrow}>THE SYSTEM VIEW</div>
          <h2 style={h2}>One front door. One work board. One clear flow.</h2>
          <p style={{ ...sub, maxWidth: 760 }}>
            The customer sees a simple page. You see the work behind it. Requests, photos, review
            links, and activation steps stop floating around in random messages.
          </p>

          <div style={visualGrid}>
            <div
              style={{
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(56,189,248,0.24)",
                background: "rgba(0,0,0,0.42)",
                boxShadow:
                  "0 22px 65px rgba(0,0,0,0.34), 0 0 28px rgba(56,189,248,0.12)",
              }}
            >
              <img
                src="/images/homeplanet-your-workflow-live-v1.png"
                alt="HomePlanet Live Page workflow preview"
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 285,
                  display: "block",
                  objectFit: "cover",
                }}
              />
            </div>

            <div style={workBoard}>
              <div style={eyebrow}>BUSINESS SIDE</div>
              <h3 style={{ margin: 0, fontSize: 34, lineHeight: 1 }}>
                The work has somewhere to land.
              </h3>
              <div style={columns}>
                {[
                  {
                    title: "Message received",
                    label: "Customer request",
                    text: "Contact info, service details, notes, and photos land in one clean place.",
                  },
                  {
                    title: "Ready for review",
                    label: "Business view",
                    text: "Review the request, check what is needed, and decide the next step.",
                  },
                  {
                    title: "Approved / Activate",
                    label: "Next action",
                    text: "Send the right link, confirm the job, collect payment, or move it into your work board.",
                  },
                ].map((item, index) => (
                  <div key={item.title} style={columnCard}>
                    <div style={{ color: "#34d399", fontSize: 12, fontWeight: 900 }}>
                      0{index + 1}
                    </div>
                    <strong style={{ display: "block", marginTop: 8 }}>{item.title}</strong>
                    <div style={screenCard}>
                      <div style={{ fontWeight: 900 }}>{item.label}</div>
                      <p style={{ ...sub, marginTop: 5, fontSize: 12 }}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section
          style={{
            ...blueSection,
            padding: "clamp(18px, 3vw, 26px)",
          }}
        >
          <div style={eyebrow}>HOW IT WORKS</div>
          <h2 style={{ ...h2, fontSize: "clamp(30px, 4.2vw, 48px)" }}>
            Built first. Reviewed first. Approved by you.
          </h2>

          <div
            style={{
              marginTop: 18,
              borderRadius: 24,
              border: "1px solid rgba(52,211,153,0.13)",
              background:
                "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(15,23,42,0.34), rgba(0,0,0,0.28))",
              padding: "14px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 10,
            }}
          >
            {[
              "Tell us what you do",
              "We build the first version",
              "You review it",
              "You approve and go live",
            ].map((title, index) => (
              <div
                key={title}
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(0,0,0,0.22)",
                  padding: "12px 13px",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  minHeight: 58,
                }}
              >
                <span
                  style={{
                    color: "#34d399",
                    fontSize: 12,
                    fontWeight: 950,
                    letterSpacing: "0.08em",
                  }}
                >
                  0{index + 1}
                </span>
                <strong style={{ fontSize: 15, lineHeight: 1.15 }}>
                  {title}
                </strong>
              </div>
            ))}
          </div>

          <p
            style={{
              margin: "14px 0 0",
              color: "#f8fafc",
              fontWeight: 900,
              fontSize: 16,
              lineHeight: 1.45,
            }}
          >
            You only pay after the first version is built and approved.
          </p>
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
              <h3 style={{ margin: 0, fontSize: 24, lineHeight: 1, letterSpacing: "-0.05em" }}>
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
              <h3 style={{ margin: 0, fontSize: 24, lineHeight: 1, letterSpacing: "-0.05em" }}>
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
              <h3 style={{ margin: 0, fontSize: 24, lineHeight: 1, letterSpacing: "-0.05em" }}>
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
              <div style={{ color: "#34d399", fontWeight: 900, fontSize: 13, letterSpacing: "0.12em" }}>
                BUILT FIRST. REVIEWED FIRST.
              </div>
              <div style={{ marginTop: 6, color: "#e5e7eb", fontWeight: 900, fontSize: 20 }}>
                You only pay after the first version is built and approved.
              </div>
            </div>
            <Link to="/planet/home-services" onClick={(e) => { e.preventDefault(); hpEvent({ event: "live_pages_demo_click", board: "homeplanet-live-pages", entityId: "explore-demo", meta: { path: window.location.pathname } }); window.setTimeout(() => { window.location.href = "/planet/home-services"; }, 120); }} style={secondary}>
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
              Let's build the right system for your business.
            </h2>
            <p style={{ ...sub, marginBottom: 0, fontSize: 15 }}>
              Message us to hold your place in line. First come, first served.
            </p>
          </div>
          <Link to="/planet/get-live" onClick={(e) => { e.preventDefault(); hpEvent({ event: "live_pages_hold_place_click", board: "homeplanet-live-pages", entityId: "hold-place", meta: { path: window.location.pathname } }); window.setTimeout(() => { window.location.href = "/planet/get-live"; }, 120); }} style={primary}>
            Hold My Place
          </Link>
        </section>
      </div>
    </main>
  );
}










































