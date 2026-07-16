const fs = require("fs");

const path = "src/pages/OkeechobeeCreateEventPageV2.tsx";
let text = fs.readFileSync(path, "utf8");

// Add a tiny CSS layer for hover/focus polish.
if (!text.includes("okeechobeeCreatePolish")) {
  text = text.replace(
    `    <main style={styles.page}>`,
    `    <main style={styles.page}>
      <style>
        {\`
          .okeechobee-create-card {
            transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
          }

          .okeechobee-create-section {
            transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
          }

          .okeechobee-create-section:hover {
            border-color: rgba(57, 255, 20, 0.22);
            box-shadow: 0 0 22px rgba(57, 255, 20, 0.055);
            background: linear-gradient(135deg, #171717 0%, #131913 100%);
          }

          .okeechobee-create-choice {
            transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
          }

          .okeechobee-create-choice:hover {
            transform: translateY(-1px);
            border-color: rgba(57, 255, 20, 0.45);
            box-shadow: 0 0 18px rgba(57, 255, 20, 0.10);
            background: rgba(57, 255, 20, 0.07);
          }

          .okeechobee-create-input {
            transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
          }

          .okeechobee-create-input:focus {
            border-color: rgba(57, 255, 20, 0.7) !important;
            box-shadow: 0 0 0 3px rgba(57, 255, 20, 0.12);
            background: #111;
          }

          .okeechobee-create-submit {
            transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease;
          }

          .okeechobee-create-submit:hover {
            transform: translateY(-1px);
            box-shadow: 0 0 26px rgba(57, 255, 20, 0.32);
            filter: brightness(1.04);
          }
        \`}
      </style>`
  );
}

// Add class names without changing layout.
text = text.replace(
  `<section style={styles.card}>`,
  `<section className="okeechobee-create-card" style={styles.card}>`
);

text = text.replaceAll(
  `<section style={styles.section}>`,
  `<section className="okeechobee-create-section" style={styles.section}>`
);

text = text.replaceAll(
  `<button
                  key={item}`,
  `<button
                  className="okeechobee-create-choice"
                  key={item}`
);

text = text.replaceAll(
  `<button
                        key={item}`,
  `<button
                        className="okeechobee-create-choice"
                        key={item}`
);

text = text.replaceAll(
  `<select style={styles.input}`,
  `<select className="okeechobee-create-input" style={styles.input}`
);

text = text.replaceAll(
  `<input
                style={styles.input}`,
  `<input
                className="okeechobee-create-input"
                style={styles.input}`
);

text = text.replaceAll(
  `<textarea
                style={{ ...styles.input, minHeight: 130, resize: "vertical" }}`,
  `<textarea
                className="okeechobee-create-input"
                style={{ ...styles.input, minHeight: 130, resize: "vertical" }}`
);

text = text.replace(
  `<button style={styles.button} type="submit" disabled={isSubmitting}>`,
  `<button className="okeechobee-create-submit" style={styles.button} type="submit" disabled={isSubmitting}>`
);

fs.writeFileSync(path, text);
console.log("Small alive polish added to Okeechobee need form.");
