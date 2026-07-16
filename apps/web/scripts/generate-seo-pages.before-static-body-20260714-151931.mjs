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

  fs.mkdirSync(path.dirname(route.output), { recursive: true });
  fs.writeFileSync(route.output, html, "utf8");

  console.log(`Generated SEO shell: ${route.output}`);
}
