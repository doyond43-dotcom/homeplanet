import { useMemo } from "react";

type PreviewModel = {
  h1: string;
  subheadline: string;
  benefits: string[];
  proof: string[];
  cta: string;
};

function pickLine(text: string, label: string): string {
  const re = new RegExp(`^\\s*${label}\\s*:\\s*(.+)\\s*$`, "im");
  const m = text.match(re);
  return (m?.[1] ?? "").trim();
}

function sectionLines(text: string, header: string): string[] {
  // Finds lines under a header like "Benefits:" until the next blank line or next "X:" header.
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

    // bullets "- thing" or "• thing" or plain line
    const cleaned = line.replace(/^[-•]\s*/, "").trim();
    if (cleaned) out.push(cleaned);
  }

  return out;
}

function buildModel(text: string): PreviewModel {
  const h1 = pickLine(text, "H1") || "Untitled Page";
  const subheadline = pickLine(text, "Subheadline") || "";
  const cta = pickLine(text, "CTA") || "Get Started";

  const benefits = sectionLines(text, "Benefits");
  const proof = sectionLines(text, "Proof");

  return { h1, subheadline, benefits, proof, cta };
}

function escapeHtml(s: string) {
  return (s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toHtml(model: PreviewModel) {
  const benefitsLis = model.benefits.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
  const proofLis = model.proof.map((p) => `<li>${escapeHtml(p)}</li>`).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(model.h1)}</title>
  <style>
    body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:0;background:#0b0c10;color:#e9eef6}
    .wrap{max-width:980px;margin:0 auto;padding:28px}
    .card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:22px}
    h1{margin:0 0 10px;font-size:34px;letter-spacing:-.02em}
    .sub{opacity:.8;margin:0 0 18px;font-size:16px;line-height:1.5}
    h2{margin:18px 0 8px;font-size:14px;letter-spacing:.12em;text-transform:uppercase;opacity:.85}
    ul{margin:0;padding-left:18px;opacity:.92}
    li{margin:6px 0}
    .cta{display:inline-block;margin-top:18px;padding:12px 16px;border-radius:14px;
      background:#ffffff;color:#0b0c10;text-decoration:none;font-weight:800}
    .foot{margin-top:14px;opacity:.55;font-size:12px}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>${escapeHtml(model.h1)}</h1>
      ${model.subheadline ? `<p class="sub">${escapeHtml(model.subheadline)}</p>` : ""}
      ${model.benefits.length ? `<h2>Benefits</h2><ul>${benefitsLis}</ul>` : ""}
      ${model.proof.length ? `<h2>Proof</h2><ul>${proofLis}</ul>` : ""}
      <a class="cta" href="#">${escapeHtml(model.cta)}</a>
      <div class="foot">Generated from Creator Build (local export)</div>
    </div>
  </div>
</body>
</html>`;
}

export function BuildPreview({ text, projectId }: { text: string; projectId?: string | null }) {
  const model = useMemo(() => buildModel(text), [text]);

  function downloadHtml() {
    const html = toHtml(model);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = (model.h1 || "page").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    a.href = url;
    a.download = `${safe || "page"}${projectId ? "-" + projectId.slice(0, 6) : ""}.html`;
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

  return (
    <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.05)", padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ fontWeight: 900, letterSpacing: 0.2 }}>Live Preview</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={openFullscreen} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", cursor: "pointer", fontWeight: 800 }}>
            Open Fullscreen
          </button>
          <button onClick={downloadHtml} style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.16)", background: "rgba(255,255,255,0.06)", cursor: "pointer", fontWeight: 800 }}>
            Download HTML
          </button>
        </div>
      </div>

      <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.22)", padding: 16 }}>
        <div style={{ fontSize: 26, fontWeight: 950, marginBottom: 8, letterSpacing: -0.2 }}>{model.h1}</div>
        {model.subheadline && <div style={{ opacity: 0.8, marginBottom: 14, lineHeight: 1.5 }}>{model.subheadline}</div>}

        {model.benefits.length > 0 && (
          <>
            <div style={{ marginTop: 10, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.8 }}>Benefits</div>
            <ul style={{ margin: "8px 0 0 18px", opacity: 0.92 }}>
              {model.benefits.map((b, i) => (
                <li key={i} style={{ margin: "6px 0" }}>{b}</li>
              ))}
            </ul>
          </>
        )}

        {model.proof.length > 0 && (
          <>
            <div style={{ marginTop: 14, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.8 }}>Proof</div>
            <ul style={{ margin: "8px 0 0 18px", opacity: 0.92 }}>
              {model.proof.map((p, i) => (
                <li key={i} style={{ margin: "6px 0" }}>{p}</li>
              ))}
            </ul>
          </>
        )}

        <div style={{ marginTop: 16 }}>
          <button style={{ padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.92)", color: "#0b0c10", cursor: "pointer", fontWeight: 900 }}>
            {model.cta}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 10, opacity: 0.65, fontSize: 12 }}>
        Tip: Use lines like <b>H1:</b>, <b>Subheadline:</b>, sections <b>Benefits:</b> and <b>Proof:</b>, and <b>CTA:</b>
      </div>
    </div>
  );
}

