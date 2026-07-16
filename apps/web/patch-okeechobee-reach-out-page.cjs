const fs = require("fs");

const routesPath = "src/planet/PlanetRoutes.tsx";
let routes = fs.readFileSync(routesPath, "utf8");

if (!routes.includes('import OkeechobeeReachOutPage from "../pages/OkeechobeeReachOutPage";')) {
  routes = routes.replace(
    'import OkeechobeeCreateEventPageV2 from "../pages/OkeechobeeCreateEventPageV2";',
    'import OkeechobeeCreateEventPageV2 from "../pages/OkeechobeeCreateEventPageV2";\nimport OkeechobeeReachOutPage from "../pages/OkeechobeeReachOutPage";'
  );
}

if (!routes.includes('path="okeechobee/reach-out"')) {
  routes = routes.replace(
    '<Route path="okeechobee/create-v2" element={<OkeechobeeCreateEventPageV2 />} />',
    '<Route path="okeechobee/create-v2" element={<OkeechobeeCreateEventPageV2 />} />\n      <Route path="okeechobee/reach-out" element={<OkeechobeeReachOutPage />} />'
  );
}

fs.writeFileSync(routesPath, routes);

const landingPath = "src/pages/OkeechobeeTogetherPage.tsx";
let landing = fs.readFileSync(landingPath, "utf8");

landing = landing.replace(/`n/g, "");

landing = landing.replace(
  /<Link\s+to="\/planet\/okeechobee\/create-v2"\s+style=\{styles\.primaryButton\}>\s*Reach Out To Us\s*<\/Link>/,
  `<Link to="/planet/okeechobee/reach-out" style={styles.primaryButton}>
              Reach Out To Us
            </Link>`
);

landing = landing.replace(
  /<a\s+href="#projects"\s+style=\{styles\.primaryButton\}>\s*Reach Out To Us\s*<\/a>/,
  `<Link to="/planet/okeechobee/reach-out" style={styles.primaryButton}>
              Reach Out To Us
            </Link>`
);

fs.writeFileSync(landingPath, landing);

console.log("Added Okeechobee reach-out page and route.");
