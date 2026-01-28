import React, { useMemo } from "react";

type Props = {
  text: string;
  projectId?: string | null;
};

type Parsed = {
  h1: string;
  subheadline: string;
  about: string;
  goal: string[];
  location: string;
  hours: string;
  contact: { email?: string; phone?: string; instagram?: string; website?: string };
  offer: string[];
  products: string[];
  testimonials: string[];
  policies: string[];
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;
  footer: string;
};

function pickLine(block: string, label: string) {
  const m = block.match(new RegExp(`^${label}\\s*:\\s*(.*)$`, "im"));
  return (m?.[1] ?? "").trim();
}

function pickSection(block: string, heading: string) {
  const m = block.match(new RegExp(`${heading}\\s*:\\s*([\\s\\S]*?)(\\n\\n[A-Za-z][A-Za-z ]{1,24}:|\\n\\s*$)`, "i"));
  return (m?.[1] ?? "").trim();
}

function linesToList(s: string) {
  return String(s || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function parseBuild(text: string): Parsed {
  const raw = String(text || "").trim();

  const h1 = pickLine(raw, "H1") || "Your Business";
  const subheadline = pickLine(raw, "Subheadline") || "Built from your description — ready to share";

  const about = pickSection(raw, "About") || "";
  const goal = linesToList(pickSection(raw, "Goal"));

  const location = pickLine(raw, "Location") || "";
  const hours = pickLine(raw, "Hours") || "";

  const contactBlock = pickSection(raw, "Contact");
  const emailInline = pickLine(raw, "Email") || (raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "");
  const phoneInline = pickLine(raw, "Phone") || (raw.match(/\b(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/)?.[0] ?? "");
  const instagramInline = pickLine(raw, "Instagram") || "";
  const websiteInline = pickLine(raw, "Website") || "";

  const offer = linesToList(pickSection(raw, "Offer"));
  const products = linesToList(pickSection(raw, "Products"));
  const testimonials = linesToList(pickSection(raw, "Testimonials"));
  const policies = linesToList(pickSection(raw, "Policies"));

  const ctaPrimary = pickLine(raw, "CTA") || "Contact";
  const ctaSecondary = pickLine(raw, "Secondary CTA") || "View Schedule";
  const ctaTertiary = pickLine(raw, "Tertiary CTA") || "Shop";

  const footer = pickSection(raw, "Footer") || "";

  // If user typed “Contact:” section with lines like “Email: …”
  const email = pickLine(contactBlock, "Email") || emailInline;
  const phone = pickLine(contactBlock, "Phone") || phoneInline;
  const instagram = pickLine(contactBlock, "Instagram") || instagramInline;
  const website = pickLine(contactBlock, "Website") || websiteInline;

  return {
    h1,
    subheadline,
    about,
    goal,
    location,
    hours,
    contact: { email, phone, instagram, website },
    offer,
    products,
    testimonials,
    policies,
    ctaPrimary,
    ctaSecondary,
    ctaTertiary,
    footer,
  };
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.08)",
        fontSize: 12,
        fontWeight: 800,
      }}
    >
      {children}
    </span>
  );
}

function Btn({ children, tone = "primary" }: { children: React.ReactNode; tone?: "primary" | "ghost" }) {
  const primary = tone === "primary";
  return (
    <button
      type="button"
      style={{
        height: 44,
        padding: "0 14px",
        borderRadius: 12,
        border: primary ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(0,0,0,0.12)",
        background: primary ? "black" : "white",
        color: primary ? "white" : "black",
        fontWeight: 900,
        cursor: "pointer",
        boxShadow: primary ? "0 10px 30px rgba(0,0,0,0.18)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid rgba(0,0,0,0.10)",
        background: "white",
        padding: 14,
        boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
        minHeight: 110,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 950, letterSpacing: 0.8, opacity: 0.6, marginBottom: 10 }}>
        {title.toUpperCase()}
      </div>
      {children}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  if (!items?.length) return <div style={{ opacity: 0.6 }}>—</div>;
  return (
    <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.5 }}>
      {items.map((x, i) => (
        <li key={i} style={{ marginBottom: 6 }}>
          {x}
        </li>
      ))}
    </ul>
  );
}

export function BuildPreview({ text, projectId }: Props) {
  const parsed = useMemo(() => parseBuild(text), [text]);

  // A “share link” placeholder for QR / scan card (can be replaced later with real project URL)
  const share = projectId ? `homeplanet.city/p/${String(projectId).slice(0, 8)}` : "homeplanet.city";

  return (
    <div
      style={{
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        padding: 12,
      }}
    >
      {/* “User site” surface */}
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          background: "#f6f6f7",
          border: "1px solid rgba(0,0,0,0.10)",
        }}
      >
        {/* Hero */}
        <div style={{ padding: 18, background: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 34, fontWeight: 950, letterSpacing: -0.8, lineHeight: 1.05, color: "black" }}>
                {parsed.h1}
              </div>
              <div style={{ marginTop: 8, fontSize: 14, opacity: 0.75, color: "black" }}>{parsed.subheadline}</div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                <Btn tone="primary">{parsed.ctaPrimary}</Btn>
                <Btn tone="ghost">{parsed.ctaSecondary}</Btn>
                <Chip>Scan: {share}</Chip>
              </div>
            </div>

            {/* QR Placeholder Card */}
            <div
              style={{
                width: 140,
                borderRadius: 16,
                border: "1px dashed rgba(0,0,0,0.22)",
                background: "rgba(0,0,0,0.03)",
                padding: 12,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  height: 92,
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.10)",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 950,
                  letterSpacing: 1,
                }}
              >
                QR
              </div>
              <div style={{ marginTop: 8, fontSize: 11, opacity: 0.7, color: "black" }}>
                Scan to book / share
              </div>
            </div>
          </div>
        </div>

        {/* Intake Grid */}
        <div style={{ padding: 14 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: 12,
            }}
          >
            <Card title="About">
              <div style={{ fontSize: 14, color: "black", lineHeight: 1.5, opacity: 0.92 }}>
                {parsed.about || "Describe what you do, who it’s for, and what you want customers to do."}
              </div>
              {!!parsed.goal.length && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 950, opacity: 0.65, marginBottom: 8 }}>GOAL</div>
                  <List items={parsed.goal} />
                </div>
              )}
            </Card>

            <Card title="Contact + Location">
              <div style={{ display: "grid", gap: 8, fontSize: 14, color: "black" }}>
                <div><b>Location:</b> {parsed.location || "—"}</div>
                <div><b>Hours:</b> {parsed.hours || "—"}</div>
                <div><b>Phone:</b> {parsed.contact.phone || "—"}</div>
                <div><b>Email:</b> {parsed.contact.email || "—"}</div>
                <div><b>Instagram:</b> {parsed.contact.instagram || "—"}</div>
                <div><b>Website:</b> {parsed.contact.website || "—"}</div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                <Btn tone="primary">{parsed.ctaSecondary}</Btn>
                <Btn tone="ghost">{parsed.ctaTertiary}</Btn>
              </div>
            </Card>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Card title="Offers">
              <List items={parsed.offer.length ? parsed.offer : ["$19 Trial Class (first time)", "Memberships / packs / private lessons"]} />
            </Card>

            <Card title="Products / Merch">
              <List
                items={
                  parsed.products.length
                    ? parsed.products
                    : ["Studio Tee — $24", "Hoodie — $45", "Water Bottle — $16", "Class Pack (5) — $79"]
                }
              />
            </Card>

            <Card title="Testimonials">
              <List
                items={
                  parsed.testimonials.length
                    ? parsed.testimonials
                    : ["“Best studio in town.” — Customer", "“Great vibe and flexible schedule.” — Customer"]
                }
              />
            </Card>

            <Card title="Policies">
              <List
                items={
                  parsed.policies.length
                    ? parsed.policies
                    : ["Arrive 10 minutes early for first class", "12-hour cancellation policy", "Guardian pickup required for kids"]
                }
              />
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: 14, background: "white", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, opacity: 0.75, color: "black" }}>
              {parsed.footer || `${parsed.h1} • Built with HomePlanet`}
            </div>
            <div style={{ fontSize: 12, opacity: 0.65, color: "black" }}>
              {projectId ? `Project: ${String(projectId).slice(0, 8)}` : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuildPreview;

