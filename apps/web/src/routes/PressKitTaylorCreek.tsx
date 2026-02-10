import * as React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function PressKitTaylorCreek() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  // If you pass ?slug=pmqf6bn1gs, the demo buttons go to /c/pmqf6bn1gs
  // Otherwise it defaults to /c/taylor-creek (only works if that slug exists in public_pages)
  const slug = (sp.get("slug") || "taylor-creek").trim();

  const goIntake = () => nav(`/c/${encodeURIComponent(slug)}`);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05070d",
        color: "#e5e7eb",
        padding: "24px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>🪐 Taylor Creek Auto Repair</div>
            <div style={{ opacity: 0.8, marginTop: 4 }}>Powered by HomePlanet</div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <a href="#demo" style={topLinkStyle}>
              Demo
            </a>
            <a href="#downloads" style={topLinkStyle}>
              Downloads
            </a>
            <a href="#gov" style={topLinkStyle}>
              Government
            </a>
            <a href="#press" style={topLinkStyle}>
              Press
            </a>
          </div>
        </div>

        {/* Hero */}
        <div style={cardStyle}>
          <div style={{ fontSize: 13, opacity: 0.85, letterSpacing: 0.4 }}>PRESS KIT</div>
          <div style={{ fontSize: 28, fontWeight: 950, marginTop: 8, lineHeight: 1.15 }}>
            Public Proof Infrastructure for Real-World Submissions
          </div>
          <div style={{ marginTop: 10, lineHeight: 1.55, opacity: 0.92 }}>
            A live auto repair shop issuing receipts, timestamps, public lookups, and preserved PDF proof records — before disputes begin.
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <span style={pillStyle}>Receipt issued instantly</span>
            <span style={pillStyle}>Timestamped record</span>
            <span style={pillStyle}>Public lookup</span>
            <span style={pillStyle}>Downloadable PDF</span>
          </div>

          {/* Trust strip */}
          <div style={{ marginTop: 14, opacity: 0.9 }}>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: 0.4, opacity: 0.85 }}>
              TRUSTED FOR
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              <span style={miniPillStyle}>inspectors</span>
              <span style={miniPillStyle}>courts</span>
              <span style={miniPillStyle}>municipalities</span>
              <span style={miniPillStyle}>contractors</span>
              <span style={miniPillStyle}>schools</span>
            </div>
          </div>

          {/* Demo actions */}
          <div id="demo" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
            <button type="button" onClick={goIntake} style={primaryBtnStyle}>
              Run 60-Second Demo →
            </button>

            <button type="button" onClick={goIntake} style={secondaryBtnStyle as any}>
              Submit Request
            </button>

            <a href="/assets/press/taylor-creek/sample-receipt.pdf" style={secondaryBtnStyle as any}>
              Download Sample PDF
            </a>

            {/* Keep this, but it’s optional. If LiveKit isn't configured, it may hang on "joining". */}
            <Link to="/live/taylor-creek" style={secondaryBtnStyle as any}>
              Open Live Demo (optional)
            </Link>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
            Using slug: <code style={codeStyle}>{slug}</code> (set via <code style={codeStyle}>?slug=YOURSLUG</code>)
          </div>
        </div>

        {/* Demo flow */}
        <div style={cardStyle}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>The 60-Second Demo Flow</div>
          <ol style={{ marginTop: 10, lineHeight: 1.7, opacity: 0.92 }}>
            <li>Scan QR</li>
            <li>Submit</li>
            <li>Get Receipt</li>
            <li>Open Lookup</li>
            <li>See Timestamp</li>
            <li>Download PDF</li>
          </ol>
        </div>

        {/* Government / Court */}
        <div id="gov" style={cardStyle}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Government & Court Mode</div>
          <div style={{ marginTop: 10, lineHeight: 1.55, opacity: 0.92 }}>
            Same system. Different headline. Built for inspections, reporting, and chain-of-custody records.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            <span style={pillStyle}>Public Submissions, Verified</span>
            <span style={pillStyle}>Chain of Custody for Communities</span>
            <span style={pillStyle}>Receipts for Reality</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12, opacity: 0.9 }}>
            <span style={miniPillStyle}>code enforcement intake</span>
            <span style={miniPillStyle}>inspections</span>
            <span style={miniPillStyle}>citizen reports</span>
            <span style={miniPillStyle}>permit intake</span>
            <span style={miniPillStyle}>incident logs</span>
            <span style={miniPillStyle}>school submissions</span>
          </div>
        </div>

        {/* Downloads */}
        <div id="downloads" style={cardStyle}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Downloads</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            <a href="/assets/press/taylor-creek/one-pager.pdf" style={secondaryBtnStyle as any}>
              One-Pager PDF
            </a>
            <a href="/assets/press/taylor-creek/flow-diagram.pdf" style={secondaryBtnStyle as any}>
              Flow Diagram PDF
            </a>
            <a href="/assets/press/taylor-creek/sample-receipt.pdf" style={secondaryBtnStyle as any}>
              Sample Receipt PDF
            </a>
          </div>
        </div>

        {/* Press release */}
        <div id="press" style={cardStyle}>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Press Release</div>
          <div style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.55, opacity: 0.95 }}>
FOR IMMEDIATE RELEASE

Local Auto Repair Shop Launches Public Proof System for Service Requests and Receipts
Okeechobee, FL — February 10, 2026

Taylor Creek Auto Repair has launched a public-facing system that allows customers, inspectors, and reporters to submit service requests, receive instant receipts, and download timestamped PDF records—before any work begins.

Using a QR code posted at the shop or on its website, customers can submit a service request in seconds. They immediately receive a receipt ID, can look up their submission on a public page, and download a preserved PDF snapshot showing exactly what was submitted and when.

“This isn’t marketing. It’s documentation.”

The public demo is live now:
• Service intake: /c/[slug]
• Receipt lookup: /r/[receipt-id]
• Press kit: /press/taylor-creek

Media Contact: press@homeplanet.city
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <a href="mailto:press@homeplanet.city" style={secondaryBtnStyle as any}>
              Email Press
            </a>
            <button type="button" onClick={goIntake} style={secondaryBtnStyle as any}>
              Submit Request
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            opacity: 0.72,
            fontSize: 12,
            marginTop: 18,
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span>© HomePlanet — Public Proof Infrastructure</span>
          <span>•</span>
          <span>Receipts • Timestamping • Chain-of-Custody • Records</span>
          <span>•</span>
          <a href="#demo" style={footerLinkStyle}>
            Demo
          </a>
          <a href="#downloads" style={footerLinkStyle}>
            Downloads
          </a>
          <a href="#gov" style={footerLinkStyle}>
            Government
          </a>
          <a href="#press" style={footerLinkStyle}>
            Press
          </a>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  marginTop: 16,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 16,
  padding: 18,
  boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
};

const pillStyle: React.CSSProperties = {
  fontSize: 12,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(56,189,248,0.12)",
  border: "1px solid rgba(56,189,248,0.25)",
  color: "#7dd3fc",
  fontWeight: 900,
};

const miniPillStyle: React.CSSProperties = {
  fontSize: 12,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#e5e7eb",
  fontWeight: 800,
};

const primaryBtnStyle: React.CSSProperties = {
  background: "#38bdf8",
  color: "#021018",
  border: "none",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 950,
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  color: "#e5e7eb",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 900,
  textDecoration: "none",
  display: "inline-block",
  cursor: "pointer",
};

const topLinkStyle: React.CSSProperties = {
  color: "#93c5fd",
  textDecoration: "underline",
  textUnderlineOffset: 3,
  fontWeight: 900,
};

const footerLinkStyle: React.CSSProperties = {
  color: "#93c5fd",
  textDecoration: "underline",
  textUnderlineOffset: 3,
  fontWeight: 800,
};

const codeStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  padding: "2px 6px",
  borderRadius: 8,
};

