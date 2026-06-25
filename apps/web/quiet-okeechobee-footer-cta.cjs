const fs = require("fs");

const path = "src/pages/OkeechobeeTogetherPage.tsx";
let s = fs.readFileSync(path, "utf8");

function replaceStyle(name, body) {
  const re = new RegExp(`  ${name}: \\{[\\s\\S]*?\\n  \\},`);
  if (!re.test(s)) {
    console.error(`Could not find style: ${name}`);
    process.exit(1);
  }
  s = s.replace(re, `  ${name}: ${body},`);
}

replaceStyle("footerCtaBox", `{
    position: "relative",
    overflow: "hidden",
    marginTop: 14,
    padding: "18px 18px",
    borderRadius: 22,
    background:
      "radial-gradient(circle at 18% 0%, rgba(57,255,20,0.10), transparent 34%), linear-gradient(135deg, rgba(8,16,11,0.92), rgba(5,8,6,0.96))",
    border: "1px solid rgba(57,255,20,0.18)",
    boxShadow: "0 14px 42px rgba(0,0,0,0.38)",
    textAlign: "left",
  }`);

replaceStyle("footerCtaGlow", `{
    position: "absolute",
    inset: -80,
    background: "radial-gradient(circle, rgba(57,255,20,0.06), transparent 58%)",
    pointerEvents: "none",
  }`);

replaceStyle("footerCtaKicker", `{
    position: "relative",
    color: "#7dff9d",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    opacity: 0.82,
  }`);

replaceStyle("footerCtaTitle", `{
    position: "relative",
    margin: "8px 0 6px",
    maxWidth: 620,
    color: "#f8fafc",
    fontSize: 21,
    lineHeight: 1.18,
    letterSpacing: "-0.03em",
  }`);

replaceStyle("footerCtaText", `{
    position: "relative",
    maxWidth: 640,
    margin: "0 0 14px",
    color: "#b9c9bf",
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.55,
  }`);

replaceStyle("footerCtaButton", `{
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
    padding: "0 15px",
    borderRadius: 999,
    background: "rgba(57,255,20,0.12)",
    border: "1px solid rgba(57,255,20,0.28)",
    color: "#b7ffb0",
    fontSize: 13,
    fontWeight: 900,
    textDecoration: "none",
    boxShadow: "none",
  }`);

fs.writeFileSync(path, s);
console.log("Quieted Okeechobee footer CTA.");
