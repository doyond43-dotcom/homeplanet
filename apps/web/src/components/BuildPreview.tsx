import React, { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

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
  const re = new RegExp(
    `${heading}\\s*:\\s*([\\s\\S]*?)(?:\\n\\s*\\n\\s*(?=[A-Za-z][A-Za-z ]{1,24}:)|\\n\\s*(?=[A-Za-z][A-Za-z ]{1,24}:)|\\n\\s*$)`,
    "i"
  );
  const m = block.match(re);
  return (m?.[1] ?? "").trim();
}

function pickAnySection(block: string, headings: string[]) {
  for (const h of headings) {
    const v = pickSection(block, h);
    if (v) return v;
  }
  return "";
}

function linesToList(s: string) {
  return String(s || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.replace(/^[- ]\s*/, "").trim())
    .filter(Boolean);
}

function parseBuild(text: string): Parsed {
  const raw = String(text || "").trim();

  const h1 = pickLine(raw, "H1") || "Your Business";
  const subheadline = pickLine(raw, "Subheadline") || "Built from your description   ready to share";

  const about = pickSection(raw, "About") || "";
  const goal = linesToList(pickSection(raw, "Goal"));

  const location = pickLine(raw, "Location") || "";
  const hours = pickLine(raw, "Hours") || "";

  const contactBlock = pickSection(raw, "Contact");
  const emailInline = pickLine(raw, "Email") || (raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "");
  const phoneInline =
    pickLine(raw, "Phone") ||
    (raw.match(/\b(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/)?.[0] ?? "");
  const instagramInline = pickLine(raw, "Instagram") || "";
  const websiteInline = pickLine(raw, "Website") || "";

  const offer = linesToList(
    pickAnySection(raw, ["Offer", "Offers", "Services", "What We Offer"])
  );

  const products = linesToList(
    pickAnySection(raw, ["Products", "Merch", "Merchandise", "Shop"])
  );

  const testimonials = linesToList(
    pickAnySection(raw, ["Testimonials", "Reviews", "Feedback"])
  );

  const policies = linesToList(
    pickAnySection(raw, ["Policies", "Rules", "Terms"])
  );

  const ctaPrimary = pickLine(raw, "CTA") || "Contact";
  const ctaSecondary = pickLine(raw, "Secondary CTA") || "View Schedule";
  const ctaTertiary = pickLine(raw, "Tertiary CTA") || "Shop";

  const footer = pickSection(raw, "Footer") || "";

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
  if (!items?.length) return <div style={{ opacity: 0.6 }}> </div>;
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

  const shortId = projectId ? String(projectId).slice(0, 8) : "";
  const shareUrl = projectId ? `https://homeplanet.city/p/${shortId}` : "https://homeplanet.city";
  const shareLabel = projectId ? `homeplanet.city/p/${shortId}` : "homeplanet.city";

  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const url = await QRCode.toDataURL(shareUrl, {
          width: 220,
          margin: 1,
          errorCorrectionLevel: "M",
        });
        if (!cancelled) setQrDataUrl(url);
      } catch {
        if (!cancelled) setQrDataUrl("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shareUrl]);

  return (
    <div
      style={{
        borderRadius: 22,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        padding: 12,
      }}
    >
      {/* User site surface */}
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          background: "#f6f6f7",
          border: "1px solid rgba(0,0,0,0.10)",
        }}
      >
        {/* Hero */}
        ...
