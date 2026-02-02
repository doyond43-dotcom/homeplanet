import React, { useMemo } from "react";

type Props = {
  text: string;
  projectId?: string | null;
};

type Parsed = {
  h1: string;
  subheadline: string;
  about: string;

  // "Goal" is optional; if present it shows under About
  goal: string[];

  // Contact fields can come from top-level lines OR Contact block
  location: string;
  hours: string;
  contact: { email?: string; phone?: string; instagram?: string; website?: string };

  // Business content blocks
  offer: string[]; // also accepts "Services"
  products: string[];
  testimonials: string[];
  policies: string[];

  // CTAs
  ctaPrimary: string;
  ctaSecondary: string;
  ctaTertiary: string;

  footer: string;
};

function safeText(x: any) {
  return String(x ?? "")
    .replace(/\uFFFD/g, "Ã¢â‚¬”")
    .replace(/\r\n/g, "\n")
    .trim();
}

function pickLine(block: string, label: string) {
  const m = block.match(new RegExp(`^${label}\\s*:\\s*(.*)$`, "im"));
  return (m?.[1] ?? "").trim();
}

// Tolerant section picker:
// - Supports headings like "About:" "Services:" "Products:" etc
// - Stops at the next "Heading:" line
function pickSection(block: string, heading: string) {
  const re = new RegExp(
    `${heading}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*\\n\\s*(?=[A-Za-z][A-Za-z ]{1,30}:)|\\n\\s*(?=[A-Za-z][A-Za-z ]{1,30}:)|\\n\\s*$)`,
    "i"
  );
  const m = block.match(re);
  return (m?.[1] ?? "").trim();
}

function linesToList(s: string) {
  return safeText(s)
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.replace(/^[-Ã¢â‚¬Â¢]\s*/, "").trim())
    .filter(Boolean);
}

// If "About" contains extra Ã¢â‚¬Å“schedule-likeÃ¢â‚¬Â lines, split it:
// - First paragraph stays About
// - Short leftover lines become Offers when Offers is empty
function splitAboutForOffer(aboutRaw: string) {
  const lines = safeText(aboutRaw).split("\n").map((x) => x.trim()).filter(Boolean);
  if (lines.length <= 3) return { about: safeText(aboutRaw), offerFromAbout: [] as string[] };

  const aboutLines: string[] = [];
  const rest: string[] = [];

  for (const line of lines) {
    if (aboutLines.length < 2 && line.length >= 50) aboutLines.push(line);
    else if (aboutLines.length < 1 && line.length >= 20) aboutLines.push(line);
    else rest.push(line);
  }

  const about = aboutLines.length ? aboutLines.join("\n") : lines.slice(0, 2).join("\n");
  const offerFromAbout = rest
    .map((x) => x.replace(/^[-Ã¢â‚¬Â¢]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 10);

  return { about, offerFromAbout };
}

function parseBuild(text: string): Parsed {
  const raw = safeText(text);

  const h1 = pickLine(raw, "H1") || "Your Business";
  const subheadline = pickLine(raw, "Subheadline") || "Built from your description Ã¢â‚¬” ready to share";

  const aboutSection = pickSection(raw, "About") || "";
  const goal = linesToList(pickSection(raw, "Goal"));

  // Contact details may appear top-level OR in Contact section
  const contactBlock = pickSection(raw, "Contact");
  const emailInline =
    pickLine(raw, "Email") || raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phoneInline =
    pickLine(raw, "Phone") ||
    raw.match(/\b(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/)?.[0] ||
    "";
  const instagramInline = pickLine(raw, "Instagram") || "";
  const websiteInline = pickLine(raw, "Website") || "";

  const location = pickLine(contactBlock, "Location") || pickLine(raw, "Location") || "";
  const hours = pickLine(contactBlock, "Hours") || pickLine(raw, "Hours") || "";

  const email = pickLine(contactBlock, "Email") || emailInline;
  const phone = pickLine(contactBlock, "Phone") || phoneInline;
  const instagram = pickLine(contactBlock, "Instagram") || instagramInline;
  const website = pickLine(contactBlock, "Website") || websiteInline;

  // Accept flexible headings (generator variants)
  const offerSection = pickSection(raw, "Offer") || pickSection(raw, "Services") || "";
  const productsSection =
    pickSection(raw, "Products") ||
    pickSection(raw, "Merch") ||
    pickSection(raw, "Merchandise") ||
    pickSection(raw, "Shop") ||
    "";
  const testimonialsSection =
    pickSection(raw, "Testimonials") || pickSection(raw, "Reviews") || pickSection(raw, "Feedback") || "";
  const policiesSection =
    pickSection(raw, "Policies") || pickSection(raw, "Rules") || pickSection(raw, "Terms") || "";

  let offer = linesToList(offerSection);
  const products = linesToList(productsSection);
  const testimonials = linesToList(testimonialsSection);
  const policies = linesToList(policiesSection);

  // If offers is empty but About has extra Ã¢â‚¬Å“schedule-likeÃ¢â‚¬Â lines, treat those as offers
  const { about, offerFromAbout } = splitAboutForOffer(aboutSection);
  if (!offer.length && offerFromAbout.length) offer = offerFromAbout;

  const ctaPrimary = pickLine(raw, "CTA") || "Contact";
  const ctaSecondary = pickLine(raw, "Secondary CTA") || "View Schedule";
  const ctaTertiary = pickLine(raw, "Tertiary CTA") || "Shop";

  const footer = pickSection(raw, "Footer") || "";

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

function Chip({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <span
      onClick={onClick}
      title={onClick ? "Click to copy" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 999,

        // Ã°Å¸”Â¥ readability fix for "Scan:" pill
        background: "rgba(0,0,0,0.10)",
        border: "1px solid rgba(0,0,0,0.18)",
        color: "rgba(0,0,0,0.90)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.10)",

        fontSize: 12,
        fontWeight: 800,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
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
        border: "1px solid rgba(0,0,0,0.12)",
        background: primary ? "black" : "white",
        color: primary ? "white" : "black",
        fontWeight: 900,
        cursor: "pointer",
        boxShadow: primary ? "0 10px 30px rgba(0,0,0,0.18)" : "none",
        whiteSpace: "nowrap",
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
  if (!items?.length) return <div style={{ opacity: 0.55, color: "black" }}>Ã¢â‚¬”</div>;
  return (
    <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.5, color: "black" }}>
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

  // Prefer a real URL format (so QR scanners recognize it)
  const shareUrl = projectId ? `https://homeplanet.city/p/${String(projectId).slice(0, 8)}` : `https://homeplanet.city`;

  // Real QR image via Google Chart (no npm install needed)
  const qrImg = `https://chart.googleapis.com/chart?cht=qr&chs=240x240&chl=${encodeURIComponent(shareUrl)}`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // best-effort
    }
  };

  return (
    <div
      style={{
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        padding: 12,
      }}
    >
      {/* Ã¢â‚¬Å“User siteÃ¢â‚¬Â surface */}
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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 34, fontWeight: 950, letterSpacing: -0.8, lineHeight: 1.05, color: "black" }}>
                {parsed.h1}
              </div>

              <div style={{ marginTop: 8, fontSize: 14, opacity: 0.75, color: "black" }}>{parsed.subheadline}</div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                <Btn tone="primary">{parsed.ctaPrimary}</Btn>
                <Btn tone="ghost">{parsed.ctaSecondary}</Btn>
                <Chip onClick={copyShare}>Scan: {shareUrl.replace(/^https?:\/\//, "")}</Chip>
              </div>
            </div>

            {/* QR Card */}
            <div
              style={{
                width: 160,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.10)",
                background: "rgba(0,0,0,0.03)",
                padding: 10,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 140,
                  margin: "0 auto",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={qrImg}
                  alt={`QR for ${shareUrl}`}
                  onError={(e) => {
                    // Hide broken image icon cleanly if Google blocks / fails
                    try {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    } catch {}
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ marginTop: 8, fontSize: 11, opacity: 0.7, color: "black" }}>Scan to book / share</div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{ padding: 14 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: 12,
            }}
          >
            <Card title="About">
              <div style={{ fontSize: 14, color: "black", lineHeight: 1.5, opacity: 0.92, whiteSpace: "pre-wrap" }}>
                {parsed.about || "Describe what you do, who itÃ¢â‚¬â„¢s for, and what you want customers to do."}
              </div>

              {!!parsed.goal.length && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 950, opacity: 0.65, marginBottom: 8, color: "black" }}>
                    GOAL
                  </div>
                  <List items={parsed.goal} />
                </div>
              )}
            </Card>

            <Card title="Contact + Location">
              <div style={{ display: "grid", gap: 8, fontSize: 14, color: "black" }}>
                <div>
                  <b>Location:</b> {parsed.location || "Add your city"}
                </div>
                <div>
                  <b>Hours:</b> {parsed.hours || "MonÃ¢â‚¬“Fri 9amÃ¢â‚¬“6pm"}
                </div>
                <div>
                  <b>Phone:</b> {parsed.contact.phone || "Add phone"}
                </div>
                <div>
                  <b>Email:</b> {parsed.contact.email || "Add email"}
                </div>
                <div>
                  <b>Instagram:</b> {parsed.contact.instagram || "Ã¢â‚¬”"}
                </div>
                <div>
                  <b>Website:</b> {parsed.contact.website || "Ã¢â‚¬”"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                <Btn tone="primary">{parsed.ctaSecondary}</Btn>
                <Btn tone="ghost">{parsed.ctaTertiary}</Btn>
              </div>
            </Card>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Card title="Offers / Services">
              <List
                items={
                  parsed.offer.length ? parsed.offer : ["$19 Trial Class (first time)", "Memberships / packs / private lessons", "Events / workshops"]
                }
              />
            </Card>

            <Card title="Products / Merch">
              <List
                items={
                  parsed.products.length ? parsed.products : ["Studio Tee Ã¢â‚¬” $24", "Hoodie Ã¢â‚¬” $45", "Water Bottle Ã¢â‚¬” $16", "Class Pack (5) Ã¢â‚¬” $79"]
                }
              />
            </Card>

            <Card title="Testimonials">
              <List
                items={
                  parsed.testimonials.length ? parsed.testimonials : ["Ã¢â‚¬Å“Best studio in town.Ã¢â‚¬Â Ã¢â‚¬” Customer", "Ã¢â‚¬Å“Great vibe and flexible schedule.Ã¢â‚¬Â Ã¢â‚¬” Customer"]
                }
              />
            </Card>

            <Card title="Policies">
              <List
                items={
                  parsed.policies.length ? parsed.policies : ["Arrive 10 minutes early for first class", "12-hour cancellation policy", "Guardian pickup required for kids"]
                }
              />
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: 14, background: "white", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, opacity: 0.75, color: "black" }}>{parsed.footer || `${parsed.h1} Ã¢â‚¬Â¢ Built with HomePlanet`}</div>
            <div style={{ fontSize: 12, opacity: 0.65, color: "black" }}>{projectId ? `Project: ${String(projectId).slice(0, 8)}` : ""}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuildPreview;
