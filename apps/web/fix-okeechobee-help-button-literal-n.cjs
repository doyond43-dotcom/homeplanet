const fs = require("fs");

const path = "src/pages/OkeechobeeTogetherPage.tsx";
let text = fs.readFileSync(path, "utf8");

text = text.replace(/<Link\s+to="\/planet\/okeechobee\/create-v2"\s+style=\{styles\.secondaryButton\}>[\s\S]*?I Want To Help[\s\S]*?<\/Link>/, `<a href="#projects" style={styles.secondaryButton}>
            I Want To Help
          </a>`);

text = text.replace(/<a\s+href="#projects"\s+style=\{styles\.secondaryButton\}>[\s\S]*?I Want To Help[\s\S]*?<\/a>/, `<a href="#projects" style={styles.secondaryButton}>
            I Want To Help
          </a>`);

text = text.replace(/`n\s*I Want To Help\s*`n/g, "I Want To Help");

fs.writeFileSync(path, text);
console.log("Fixed I Want To Help button.");
