const fs = require("fs");

const file = "src/pages/HomeServicesLiveDemoFlow.tsx";
let text = fs.readFileSync(file, "utf8");

fs.copyFileSync(file, `${file}.before-footer-capture-cta`);

if (!text.includes('from "../lib/hpEvent"')) {
  const lines = text.split(/\r?\n/);
  let lastImport = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) lastImport = i;
  }
  lines.splice(lastImport + 1, 0, 'import { hpEvent } from "../lib/hpEvent";');
  text = lines.join("\n");
}

if (text.includes("Show Me What Mine Could Look Like")) {
  console.log("Footer CTA already exists. No change needed.");
  process.exit(0);
}

const footerCta = `
      <section
        style={{
          maxWidth: 1180,
          margin: "70px auto 40px",
          padding: "34px 24px",
          borderRadius: 28,
          border: "1px solid rgba(255,255,255,0.16)",
          background:
            "linear-gradient(135deg, rgba(255,122,24,0.18), rgba(0,0,0,0.82))",
          boxShadow: "0 28px 90px rgba(0,0,0,0.45)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "#ffb56b",
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Built By HomePlanet
        </div>

        <h2
          style={{
            margin: 0,
            color: "#fff",
            fontSize: "clamp(28px, 5vw, 52px)",
            lineHeight: 0.98,
            letterSpacing: "-0.05em",
          }}
        >
          Need something like this for your business?
        </h2>

        <p
          style={{
            maxWidth: 720,
            margin: "16px auto 24px",
            color: "rgba(255,255,255,0.78)",
            fontSize: 17,
            lineHeight: 1.55,
          }}
        >
          HomePlanet builds live pages with the work board underneath — so customers can request help and your business can track the job from first click to final payment.
        </p>

        <Link
          to="/planet/build-your-live-system"
          onClick={() =>
            hpEvent({
              event: "ridgeline_footer_homeplanet_cta_click",
              board: "homeplanet-live-pages",
              entityId: "show-me-what-mine-could-look-like",
              meta: {
                company: "RIDGELINE Pro Wash",
                source: "Ridgeline demo footer",
                path: window.location.pathname,
              },
            })
          }
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 58,
            padding: "0 28px",
            borderRadius: 999,
            background: "#ff7a18",
            color: "#120805",
            fontWeight: 950,
            fontSize: 16,
            textDecoration: "none",
            boxShadow: "0 18px 45px rgba(255,122,24,0.34)",
          }}
        >
          Show Me What Mine Could Look Like
        </Link>
      </section>
`;

const insertAt = text.lastIndexOf("</main>");
if (insertAt === -1) throw new Error("Could not find </main> in HomeServicesLiveDemoFlow.tsx");

text = text.slice(0, insertAt) + footerCta + "\n" + text.slice(insertAt);

fs.writeFileSync(file, text);
console.log("patched footer CTA into HomeServicesLiveDemoFlow.tsx");
