import { useMemo, useRef } from "react";

type PreviewModel = {
  h1: string;
  subheadline: string;
  about: string;
  benefits: string[];
  proof: string[];
  contact: string;
  cta: string;
};

function pickLine(text: string, label: string): string {
  const re = new RegExp(`^\\s*${label}\\s*:\\s*(.+)\\s*$`, "im");
  const m = (text ?? "").match(re);
  return (m?.[1] ?? "").trim();
}

function sectionLines(text: string, header: string): string[] {
  const lines = (text ?? "").split("\n");
  const out: string[] = [];
  let inSection = false;

  const headerRe = new RegExp(`^\\s*${header}\\s*:\\s*$`, "i");
  const nextHeaderRe = /^\s*[A-Za-z][A-Za-z0-9 _-]{0,24}\s*:\s*.*$/; // "Proof:" "CTA:" etc

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (!inSection) {
      if (headerRe.test(line)) inSection = true;
      continue;
    }

    if (!line) break;
    if (nextHeaderRe.test(line) && !/^-/.test(line)) break;

    const cleaned = line.replace(/^[-•]\s*/, "").trim();
    if (cleaned) out.push(cleaned);
  }

  return out;
}

function sectionBlock(text: string, header: string): string {
  const lines = (text ?? "").split("\n");
  let inSection = false;
  const out: string[] = [];

  const headerRe = new RegExp(`^\\s*${header}\\s*:\\s*$`, "i");
  const nextHeaderRe = /^\s*[A-Za-z][A-Za-z0-9 _-]{0,24}\s*:\s*.*$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inSection) {
      if (headerRe.test(line.trim())) inSection = true;
      continue;
    }

    if (!line.trim()) break;
    if (nextHeaderRe.test(line.trim()) && !/^-/.test(line.trim())) break;

    out.push(line);
  }

  return out.join("\n").trim();
}

function buildModel(text: string): PreviewModel {
  const h1 = pickLine(text, "H1") || "Your Site";
  const subheadline = pickLine(text, "Subheadline") || "";
  const about = sectionBlock(text, "About");
  const contact = sectionBlock(text, "Contact");

  // Default CTA should never be “Get Started” — that killed the demo.
  const cta = pickLine(text, "CTA") || "Contact";

  const benefits = sectionLines(text, "Benefits");
  const proof = sectionLines(text, "Proof");

  return { h1, subheadline, about, benefits, proof, contact, cta };
}

function escapeHtml(s: string) {
  return (s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeHtmlWithBreaks(s: string) {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}

function toHtml(model: PreviewModel) {
  const benefitsLis = model.benefits.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
  const proofLis = model.proof.map((p) => `<li>${escapeHtml(p)}</li>`).join("");

  // CTA should *do* something. Default: scroll to contact.
  const ctaHref = "#contact";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(model.h1)}</title>
  <style>
    :root{
      --bg:#0b0c10;
      --card:rgba(255,255,255,.06);
      --border:rgba(255,255,255,.14);
      --text:#e9eef6;
      --muted:rgba(233,238,246,.78);
      --muted2:rgba(233,238,246,.62);
    }
    body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:0;background:var(--bg);color:var(--text)}
    .wrap{max-width:980px;margin:0 auto;padding:28px}
    .hero{padding:22px 22px 18px;border-radius:22px;border:1px solid var(--border);background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04))}
    h1{margin:0 0 10px;font-size:40px;letter-spacing:-.03em;line-height:1.05}
    .sub{opacity:.9;margin:0 0 14px;font-size:16px;line-height:1.5;color:var(--muted)}
    .ctaRow{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
    .cta{display:inline-block;padding:12px 16px;border-radius:14px;background:#ffffff;color:#0b0c10;text-decoration:none;font-weight:900}
    .cta2{display:inline-block;padding:12px 16px;border-radius:14px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:var(--text);text-decoration:none;font-weight:900}
    .grid{display:grid;grid-template-columns:1fr;gap:14px;margin-top:14px}
    @media (min-width:900px){ .grid{grid-template-columns:1.15fr .85fr} }
    .card{background:var(--card);border:1px solid var(--border);border-radius:18px;padding:18px}
    h2{margin:0 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.9;color:var(--muted2)}
    p{margin:0;color:var(--muted);line-height:1.55}
    ul{margin:0;padding-left:18px;opacity:.95}
    li{margin:7px 0;color:var(--muted)}
    .contactLine{margin:0;color:var(--muted);line-height:1.6}
    .foot{margin-top:14px;opacity:.55;font-size:12px;color:var(--muted2)}
    .anchor{scroll-margin-top:16px}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <h1>${escapeHtml(model.h1)}</h1>
      ${model.subheadline ? `<p class="sub">${escapeHtml(model.subheadline)}</p>` : `<p class="sub">A clean site built from your description.</p>`}
      <div class="ctaRow">
        <a class="cta" href="${ctaHref}">${escapeHtml(model.cta)}</a>
        <a class="cta2" href="#about">Learn More</a>
      </div>
    </div>

    <div class="grid">
      <div class="card anchor" id="about">
        <h2>About</h2>
        <p>${model.about ? escapeHtmlWithBreaks(model.about) : "Describe what you do, who it's for, and what you want customers to do."}</p>
      </div>

      <div class="card">
        ${model.benefits.length ? `<h2>Highlights</h2><ul>${benefitsLis}</ul>` : `<h2>Highlights</h2><p>Fast, simple, and ready to share.</p>`}
        ${model.proof.length ? `<div style="height:10px"></div><h2>Proof</h2><ul>${proofLis}</ul>` : ""}
      </div>

      <div class="card anchor" id="contact" style="grid-column:1 / -1">
        <h2>Contact</h2>
        <p class="contactLine">${model.contact ? escapeHtmlWithBreaks(model.contact) : "Add your email, phone, and location so people can reach you."}</p>
      </div>
    </div>

    <div class="foot">Built with HomePlanet • Local export</div>
  </div>
</body>
</html>`;
}

export function BuildPreview({ text, projectId }: { text: string; projectId?: string | null }) {
  const model = useMemo(() => buildModel(text), [text]);
  const contactRef = useRef<HTMLDivElement | null>(null);

  function downloadHtml() {
    const html = toHtml(model);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = (model.h1 || "site").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    a.href = url;
    a.download = `${safe || "site"}${projectId ? "-" + projectId.slice(0, 6) : ""}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function openFullscreen() {
    const html = toHtml(model);
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  function scrollToContact() {
    contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)", padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ fontWeight: 900, letterSpacing: 0.2 }}>Live Preview</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={openFullscreen} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", cursor: "pointer", fontWeight: 800 }}>
            Open
          </button>
          <button onClick={downloadHtml} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", cursor: "pointer", fontWeight: 800 }}>
            Download
          </button>
        </div>
      </div>

      <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.22)", padding: 16 }}>
        <div style={{ fontSize: 30, fontWeight: 980, marginBottom: 8, letterSpacing: -0.4, lineHeight: 1.05 }}>{model.h1}</div>
        {model.subheadline ? <div style={{ opacity: 0.85, marginBottom: 12, lineHeight: 1.5 }}>{model.subheadline}</div> : <div style={{ opacity: 0.75, marginBottom: 12 }}>A clean site built from your description.</div>}

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
          <button
            onClick={scrollToContact}
            style={{
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.92)",
              color: "#0b0c10",
              cursor: "pointer",
              fontWeight: 950,
            }}
          >
            {model.cta || "Contact"}
          </button>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.92)",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            Back to Top
          </button>
        </div>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.8, marginBottom: 6 }}>About</div>
          <div style={{ opacity: 0.88, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
            {model.about || "Describe what you do, who it's for, and what you want customers to do."}
          </div>
        </div>

        {model.benefits.length > 0 && (
          <>
            <div style={{ marginTop: 14, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.8 }}>Highlights</div>
            <ul style={{ margin: "8px 0 0 18px", opacity: 0.92 }}>
              {model.benefits.map((b, i) => (
                <li key={i} style={{ margin: "7px 0" }}>{b}</li>
              ))}
            </ul>
          </>
        )}

        {model.proof.length > 0 && (
          <>
            <div style={{ marginTop: 14, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.8 }}>Proof</div>
            <ul style={{ margin: "8px 0 0 18px", opacity: 0.92 }}>
              {model.proof.map((p, i) => (
                <li key={i} style={{ margin: "7px 0" }}>{p}</li>
              ))}
            </ul>
          </>
        )}

        <div ref={contactRef} style={{ marginTop: 16, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.8, marginBottom: 6 }}>Contact</div>
          <div style={{ opacity: 0.88, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {model.contact || "Add your email, phone, and location so people can reach you."}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, opacity: 0.6, fontSize: 12 }}>
        Built with HomePlanet
      </div>
    </div>
  );
}
