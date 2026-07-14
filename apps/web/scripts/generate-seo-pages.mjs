import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const indexFile = path.join(distDir, "index.html");

if (!fs.existsSync(indexFile)) {
  throw new Error("dist/index.html was not found. Run this after vite build.");
}

const baseHtml = fs.readFileSync(indexFile, "utf8");

const routes = [
  {
    output: path.join(distDir, "planet", "slap-a-bug", "index.html"),
    title: "Slap-A-Bug Pest Control | Okeechobee, FL",
    description:
      "Local Okeechobee pest control for ants, roaches, rodents, spiders, mosquitoes and more. Call, text or request an estimate.",
    canonical: "https://www.homeplanet.city/planet/slap-a-bug",
    image:
      "https://www.homeplanet.city/images/slap-a-bug-truck-hero.png",
    schema: {
      "@context": "https://schema.org",
      "@type": "PestControlService",
      name: "Slap-A-Bug Pest Control LLC",
      url: "https://www.homeplanet.city/planet/slap-a-bug",
      telephone: "+1-863-368-3628",
      image:
        "https://www.homeplanet.city/images/slap-a-bug-truck-hero.png",
      description:
        "Local pest control serving Okeechobee homes, sheds, barns, RVs, mobile homes and businesses.",
      areaServed: {
        "@type": "City",
        name: "Okeechobee",
        addressRegion: "FL"
      }
    },
    bodyHtml: `
      <main>
        <h1>Slap-A-Bug Pest Control in Okeechobee, Florida</h1>

        <p>
          Slap-A-Bug Pest Control LLC provides local pest control services for
          homes, mobile homes, sheds, barns, RVs and businesses in the
          Okeechobee area. Customers can call, text or request an estimate for
          help with common pest problems.
        </p>

        <p>
          Slap-A-Bug Pest Control in Okeechobee, Florida helps local property
          owners respond to pest activity with direct communication and a simple
          way to request service. Whether the concern is inside a home, around
          an exterior area or affecting another structure on the property,
          customers can explain the problem and ask for local pest control help.
        </p>

        <section>
          <h2>Pest control for common Okeechobee pest problems</h2>

          <p>
            Pest issues can show up inside the home, around exterior areas,
            storage spaces and other structures on a property. Slap-A-Bug helps
            customers deal with ants, roaches, spiders, rodents, mosquitoes and
            other pest concerns.
          </p>

          <h3>Roach control</h3>
          <p>
            Request pest control help when roaches are active inside or around
            the property.
          </p>

          <h3>Ant control</h3>
          <p>
            Get help with ant activity around homes, buildings and exterior
            property areas.
          </p>

          <h3>Spider control</h3>
          <p>
            Contact Slap-A-Bug when spiders or recurring web activity become a
            problem around the property.
          </p>

          <h3>Rodent concerns</h3>
          <p>
            Request an estimate for rodent concerns affecting a home, shed,
            barn, RV or business.
          </p>

          <h3>Mosquito concerns</h3>
          <p>
            Ask about pest control options for mosquito activity around your
            Okeechobee property.
          </p>
        </section>

        <section>
          <h2>Local pest control with direct communication</h2>

          <p>
            Slap-A-Bug gives Okeechobee customers a direct way to explain the
            pest problem, choose the type of issue they are dealing with and
            request help. Customers can call or text Brad or use the online
            estimate request on the Slap-A-Bug page.
          </p>

          <p>
            Visit the
            <a href="https://www.homeplanet.city/">HomePlanet home page</a>
            to learn more about the local systems running on HomePlanet.
          </p>

          <p>
            Return to the
            <a href="https://www.homeplanet.city/planet/slap-a-bug">
              Slap-A-Bug pest control page
            </a>
            for local pest control information and estimate requests.
          </p>
        </section>
      </main>
    `
  }
];

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

for (const route of routes) {
  let html = baseHtml;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${route.title}</title>`
  );

  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${escapeAttribute(route.description)}" />`
  );

  html = html.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttribute(route.title)}" />`
  );

  html = html.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttribute(route.description)}" />`
  );

  html = html.replace(
    /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image" content="${route.image}" />`
  );

  html = html.replace(
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${route.canonical}" />`
  );

  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeAttribute(route.title)}" />`
  );

  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeAttribute(route.description)}" />`
  );

  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:image" content="${route.image}" />`
  );

  const seoHead = `
    <link rel="canonical" href="${route.canonical}" />
    <script type="application/ld+json">${JSON.stringify(route.schema)}</script>
  `;

  html = html.replace("</head>", `${seoHead}\n  </head>`);

  html = html.replace(
    /<div\s+id="root"><\/div>/i,
    `<div id="root">${route.bodyHtml}</div>`
  );

  fs.mkdirSync(path.dirname(route.output), { recursive: true });
  fs.writeFileSync(route.output, html, "utf8");

  console.log(`Generated SEO shell: ${route.output}`);
}
