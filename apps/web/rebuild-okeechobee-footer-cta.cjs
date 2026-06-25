const fs = require("fs");

const path = "src/pages/OkeechobeeTogetherPage.tsx";
let s = fs.readFileSync(path, "utf8");

const oldBlock = `        <div style={styles.footerBox}>
          <h2 style={styles.footerTitle}>This is only the beginning.</h2>
          <p style={styles.footerText}>
            Okeechobee deserves better local connection systems than scattered Facebook comments.
            This board is becoming the place where real needs, offers, and outcomes can live.
          </p>

          <div style={styles.footerCtaBox}>
            <h3 style={styles.footerCtaTitle}>
              Need something like this for your community, group, or local business?
            </h3>
            <p style={styles.footerCtaText}>
              Every intake, board, and business system built on HomePlanet helps organize real action, one person, one request, and one community at a time.
            </p>
            <Link to="/planet/build-your-live-system" style={styles.footerCtaButton}>
              Build Something Like This
            </Link>
          </div>
        </div>`;

const newBlock = `        <div style={styles.footerBox}>
          <h2 style={styles.footerTitle}>This is only the beginning.</h2>
          <p style={styles.footerText}>
            Okeechobee deserves better local connection systems than scattered Facebook comments.
            This board is becoming the place where real needs, offers, and outcomes can live.
          </p>
        </div>

        <div style={styles.footerCtaBox}>
          <div style={styles.footerCtaGlow} />
          <div style={styles.footerCtaKicker}>Built on HomePlanet</div>
          <h3 style={styles.footerCtaTitle}>
            Build something like this for your community, group, or local business.
          </h3>
          <p style={styles.footerCtaText}>
            Turn scattered messages, needs, offers, updates, and outcomes into one organized place where people can actually take action.
          </p>
          <Link to="/planet/build-your-live-system" style={styles.footerCtaButton}>
            Build Something Like This
          </Link>
        </div>`;

if (!s.includes(oldBlock)) {
  console.error("Could not find footer JSX block.");
  process.exit(1);
}

s = s.replace(oldBlock, newBlock);

function replaceStyle(name, body) {
  const re = new RegExp(`  ${name}: \\{[\\s\\S]*?\\n  \\},`);
  if (!re.test(s)) {
    console.error(`Could not find style: ${name}`);
    process.exit(1);
  }
  s = s.replace(re, `  ${name}: ${body},`);
}

replaceStyle("footerBox", `{
    marginTop: 30,
    padding: "28px 24px",
    borderRadius: 28,
    background: "linear-gradient(135deg, rgba(16,16,16,0.98), rgba(8,24,14,0.94))",
    border: "1px solid rgba(57,255,20,0.18)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
  }`);

replaceStyle("footerTitle", `{
    margin: 0,
    fontSize: 34,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
  }`);

replaceStyle("footerText", `{
    margin: "12px 0 0",
    color: "#d7e5dc",
    fontSize: 17,
    fontWeight: 750,
    lineHeight: 1.65,
  }`);

replaceStyle("footerCtaBox", `{
    position: "relative",
    overflow: "hidden",
    marginTop: 18,
    padding: "32px 24px",
    borderRadius: 32,
    background:
      "radial-gradient(circle at 18% 8%, rgba(57,255,20,0.22), transparent 34%), radial-gradient(circle at 90% 0%, rgba(34,197,94,0.18), transparent 30%), linear-gradient(135deg, rgba(7,18,11,0.98), rgba(4,8,6,0.98))",
    border: "1px solid rgba(57,255,20,0.34)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.58), 0 0 44px rgba(57,255,20,0.10)",
    textAlign: "center",
  }`);

replaceStyle("footerCtaTitle", `{
    position: "relative",
    margin: "10px auto 10px",
    maxWidth: 720,
    color: "#ffffff",
    fontSize: 34,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
  }`);

replaceStyle("footerCtaText", `{
    position: "relative",
    maxWidth: 680,
    margin: "0 auto 22px",
    color: "#cfe7d6",
    fontSize: 16,
    fontWeight: 750,
    lineHeight: 1.65,
  }`);

replaceStyle("footerCtaButton", `{
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    padding: "0 24px",
    borderRadius: 999,
    background: "linear-gradient(135deg, #39ff14, #b7ff4a)",
    color: "#031007",
    fontWeight: 950,
    textDecoration: "none",
    boxShadow: "0 14px 34px rgba(57,255,20,0.30)",
  }`);

s = s.replace(
  `  footerCtaTitle:`,
  `  footerCtaGlow: {
    position: "absolute",
    inset: -80,
    background: "radial-gradient(circle, rgba(57,255,20,0.12), transparent 56%)",
    pointerEvents: "none",
  },
  footerCtaKicker: {
    position: "relative",
    color: "#7dff9d",
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  footerCtaTitle:`
);

fs.writeFileSync(path, s);
console.log("Rebuilt Okeechobee footer CTA as separate live card.");
