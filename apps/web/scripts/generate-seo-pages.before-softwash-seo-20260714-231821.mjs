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
    body: `
      <main>
        <h1>Slap-A-Bug Pest Control in Okeechobee, Florida</h1>

        <section>
          <h2>Pest control for common Okeechobee pest problems</h2>
          <h3>Roach control</h3>
          <p>Local pest control support for roach activity in kitchens, bathrooms, garages, and other areas of the property.</p>

          <h3>Ant control</h3>
          <p>Help with ant trails, entry points, kitchens, bathrooms, porches, and recurring ant activity around the home.</p>

          <h3>Spider control</h3>
          <p>Spider concerns around porches, garages, corners, lanais, and exterior areas can be included in a pest request.</p>

          <h3>Rodent concerns</h3>
          <p>Customers can describe rodent activity around sheds, barns, garages, feed rooms, RVs, and storage spaces.</p>

          <h3>Mosquito concerns</h3>
          <p>Mosquito requests can include yards, shaded areas, trees, bushes, fence lines, and outdoor gathering spaces.</p>
        </section>

        <section>
          <h2>Local pest control with direct communication</h2>
          <p>Customers can call, text, request an estimate, or start with the pest problem they are dealing with. The Slap-A-Bug live page is designed to make the next action clear and send request details into the business workflow for follow-up.</p>
          <p>Requests can include the pest issue, where activity is being seen, the level of activity, contact information, and additional notes. This helps reduce repeated explanations and gives the pest control team useful details before following up.</p>
        </section>

        <nav>
          <a href="https://www.homeplanet.city/">HomePlanet home page</a>
          <a href="https://www.homeplanet.city/planet/slap-a-bug">Slap-A-Bug pest control page</a>
        </nav>
      </main>
    `,
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
    }
  },
  {
    output: path.join(distDir, "planet", "demo", "pest-control", "index.html"),
    title: "Pest Control Live System Demo | HomePlanet",
    description:
      "Explore a pest control live-page demo with customer intake, service requests, direct communication, and an operating workflow built by HomePlanet.",
    canonical: "https://www.homeplanet.city/planet/demo/pest-control",
    image:
      "https://www.homeplanet.city/images/homeplanet-your-workflow-live-v1.png",
    body: `
      <main>
        <h1>Okie Dokie Pest Control Live System Demo</h1>

        <p>Okie Dokie Pest Control is a fictional demonstration business created by HomePlanet to show how a local pest control live page and operating workflow can work together.</p>

        <section>
          <h2>A pest control page built around customer action</h2>
          <p>The demo gives customers a clear way to call, text, request an estimate, or select the pest problem they are dealing with. The goal is to reduce confusion and make the next action obvious.</p>

          <h3>Ant requests</h3>
          <p>Customers can start a request for ant trails, kitchens, bathrooms, pantries, porches, and entry-point activity.</p>

          <h3>Roach requests</h3>
          <p>Roach activity in kitchens, bathrooms, garages, rentals, and other interior areas can be described before follow-up.</p>

          <h3>Rodent requests</h3>
          <p>Rodent concerns around sheds, barns, garages, food storage areas, RVs, and other spaces can be sent through the request flow.</p>

          <h3>Spider requests</h3>
          <p>Customers can report spider activity around porches, garages, corners, laundry areas, exterior webs, and other property areas.</p>

          <h3>Flea and tick requests</h3>
          <p>The request flow can capture flea and tick concerns in yards, pet areas, rental properties, and locations with repeat activity.</p>

          <h3>Wasp and hornet requests</h3>
          <p>Nests, rooflines, sheds, barns, entry areas, and other wasp or hornet concerns can be identified before the pest control team follows up.</p>

          <h3>Mosquito service requests</h3>
          <p>Mosquito concerns can be selected in the request form for yards, shaded areas, trees, bushes, fence lines, and outdoor gathering spaces.</p>
        </section>

        <section>
          <h2>From a customer request to an active pest control workflow</h2>
          <p>This HomePlanet demonstration shows more than a traditional pest control website. Customer request details can move into an intelligence board where the operator can review active signals and open a customer workspace.</p>
          <p>The active workspace is designed around real next actions including customer follow-up, asking for photos, scheduling service, sending ready-to-edit messages, recording internal notes, tracking payment, adding proof, and requesting a review.</p>
          <p>The public live page and private operating workflow are connected so the customer-facing experience and the work behind the business do not have to live in separate disconnected systems.</p>
        </section>

        <section>
          <h2>Direct communication for local service businesses</h2>
          <p>Customers can explain the issue, identify where they are seeing activity, describe how serious the problem appears, and leave additional notes. The request gives the operator useful context before the first follow-up.</p>
          <p>The system is intentionally designed to stay clean and easy to use while still giving the business a deeper workflow underneath the public page.</p>
        </section>

        <section>
          <h2>A fictional pest control demo built by HomePlanet</h2>
          <p>Okie Dokie Pest Control is not represented as a real operating pest control company. The brand, phone number, reviews, and customer examples are fictional demo content used to demonstrate HomePlanet live-page and workflow capabilities for home service businesses.</p>
        </section>

        <nav>
          <a href="https://www.homeplanet.city/">HomePlanet home page</a>
          <a href="https://www.homeplanet.city/planet/demo/pest-control">Pest control live system demo</a>
        </nav>
      </main>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Okie Dokie Pest Control Live System Demo",
      url: "https://www.homeplanet.city/planet/demo/pest-control",
      description:
        "A fictional pest control live-page and workflow demonstration built by HomePlanet.",
      isPartOf: {
        "@type": "WebSite",
        name: "HomePlanet",
        url: "https://www.homeplanet.city/"
      },
      about: {
        "@type": "Thing",
        name: "Pest control business workflow demonstration"
      }
    }
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
    '<div id="root"></div>',
    `<div id="root">${route.body}</div>`
  );

  fs.mkdirSync(path.dirname(route.output), { recursive: true });
  fs.writeFileSync(route.output, html, "utf8");

  console.log(`Generated SEO shell: ${route.output}`);
}