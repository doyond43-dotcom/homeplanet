const fs = require("fs");
const path = "src/App.tsx";
let text = fs.readFileSync(path, "utf8");

const importMain = 'import HomePlanetTransportationPage from "./pages/HomePlanetTransportationPage";';
const importRequest = 'import HomePlanetTransportationRequestPage from "./pages/HomePlanetTransportationRequestPage";';

if (!text.includes(importRequest)) {
  text = text.replace(importMain, `${importMain}\n${importRequest}`);
}

const mainRoute = '<Route path="/planet/transportation" element={<HomePlanetTransportationPage />} />';
const requestRoute = '<Route path="/planet/transportation/request" element={<HomePlanetTransportationRequestPage />} />';

if (!text.includes('path="/planet/transportation/request"')) {
  text = text.replace(mainRoute, `${requestRoute}\n          ${mainRoute}`);
}

fs.writeFileSync(path, text);
console.log("Transportation request route wired.");
