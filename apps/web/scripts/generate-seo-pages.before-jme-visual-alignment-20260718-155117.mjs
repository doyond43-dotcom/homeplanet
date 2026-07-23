import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appDir = path.resolve(__dirname, "..");
const distDir = path.join(appDir, "dist");
const publicDir = path.join(appDir, "public");
const baseHtmlPath = path.join(distDir, "index.html");

const SITE_URL = "https://www.homeplanet.city";

const publicSeoRegistry = [
  {
    route: "/",
    title: "HomePlanet | Custom Systems for Local Service Businesses",
    description:
      "HomePlanet builds custom business systems for service businesses. Connect customer requests, estimates, scheduling, communication, payments, work photos, proof, and follow-up in one connected operating system.",
    image: `${SITE_URL}/og-homeplanet.png`,
    heading: "HomePlanet builds systems for real work.",
    body: `
      <section>
        <h2>Custom business systems built around real work</h2>
        <p>HomePlanet builds more than traditional websites. A public live page can help a customer, resident, or community member understand what is happening and take a clear next action. Instead of sending people through generic menus, disconnected forms, and contact pages that lead nowhere, a HomePlanet live system is designed around the real action that needs to happen next.</p>
        <p>Underneath the public page, a working system can organize requests, estimates, approvals, scheduling, photos, payment, proof, follow-up, and the timeline of what happened. The public experience and the operating workflow can work together so important information does not disappear between a website, text messages, handwritten notes, and separate software tools.</p>
      </section>
      <section>
        <h2>Turn customer requests into completed work</h2>
        <p>HomePlanet systems are designed around real operations. A service request, customer question, community need, or local opportunity can become active work instead of disappearing into random texts, paper notes, separate apps, or disconnected forms. The system can show what came in, what needs attention, what action happened, and what should happen next.</p>
        <p>For a local business, that may mean turning a quote request into an estimate, approval, scheduled job, work photos, payment, completed proof, and customer follow-up. For a community project, it may mean turning a public need into a clear response, organized follow-up, active coordination, and a visible record of the outcome. HomePlanet connects the public front door with the real work happening behind it.</p>
      </section>
      <section>
        <h2>Built around how your business already works</h2>
        <p>HomePlanet can start with a professional live page, grow into a complete business workflow, or become a custom operating system built around the way a person, team, or community already works. The goal is not to force every business or project into the same dashboard. The system should reflect the actual decisions, actions, communication, and proof that matter in that specific workflow.</p>
        <p>Local service businesses can use HomePlanet to make customer communication and job progress easier to follow. Community systems can make needs, offers, projects, and next actions easier to understand. Each public system can stay focused on its own purpose while using the same HomePlanet architecture for crawlable public pages, structured actions, connected workflows, and a clear history of what happened.</p>
      </section>

      <section>
        <h2>Explore real HomePlanet business systems</h2>
        <p>See public live pages and working system examples built for local businesses and community action.</p>
        <nav aria-label="Public HomePlanet live systems">
          <ul>
            <li><a href="/planet/slap-a-bug">Slap-A-Bug Pest Control in Okeechobee</a></li>
            <li><a href="/planet/demo/pest-control">Pest Control Live System Demo</a></li>
            <li><a href="/planet/okie-dokie-softwash">Okie Dokie Softwash Pressure Washing in Okeechobee</a></li>
            <li><a href="/planet/okeechobee">Okeechobee Together Community Action</a></li>
            <li><a href="/planet/vz-professional-lawncare">V&amp;Z Professional Lawncare in Okeechobee</a></li>
            <li><a href="/planet/jones-equipment-rental-repair">Jones Equipment Rental &amp; Repair</a></li>
            <li><a href="/onlytheessentials">Only The Essentials Cleaning in Okeechobee</a></li>
          </ul>
        </nav>
      </section>


    `,
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "HomePlanet",
          url: `${SITE_URL}/`
        },
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          name: "HomePlanet",
          url: `${SITE_URL}/`,
          publisher: {
            "@id": `${SITE_URL}/#organization`
          }
        }
      ]
    }
  },
  {
    route: "/planet/slap-a-bug",
    title: "Slap-A-Bug Pest Control | Okeechobee, FL",
    description:
      "Local pest control in Okeechobee for roaches, ants, spiders, rodents, termites, mosquitoes, and other pest problems. Request service directly.",
    image: `${SITE_URL}/images/slap-a-bug-truck-hero.webp`,
    heading: "Pest control in Okeechobee, Florida",
    body: `
      <section>
        <h2>Local pest control for common Okeechobee pest problems</h2>
        <p>Slap-A-Bug Pest Control helps local customers start with the pest problem they already recognize. Roaches, ants, spiders, rodents, termites, mosquitoes, and other pest concerns can move directly into a clear service request.</p>
      </section>
      <section>
        <h2>Request pest control service directly</h2>
        <p>The Slap-A-Bug live page is designed around customer action. Customers can identify the pest issue, provide contact details, and begin direct follow-up without navigating a long traditional website.</p>
      </section>
      <section>
        <h2>Local service with a working follow-up flow</h2>
        <p>A customer request can move into an active workflow for contact, scheduling, service notes, payment, proof, and review follow-up.</p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "PestControlService",
      name: "Slap-A-Bug Pest Control LLC",
      url: `${SITE_URL}/planet/slap-a-bug`,
      areaServed: {
        "@type": "City",
        name: "Okeechobee",
        addressRegion: "FL"
      }
    }
  },
  {
    route: "/planet/demo/pest-control",
    title: "Pest Control Live System Demo | HomePlanet",
    description:
      "Explore a HomePlanet pest control live system demo showing how customer requests can move into follow-up, scheduling, service work, payment, and proof.",
    image: `${SITE_URL}/og-homeplanet.png`,
    heading: "Pest control live system demo",
    body: `
      <section>
        <h2>See what happens after a customer clicks</h2>
        <p>This HomePlanet demonstration shows how a pest control business can turn a public service request into an active operating workflow.</p>
      </section>
      <section>
        <h2>Customer request to active work</h2>
        <p>The workflow can support customer follow-up, scheduling, service notes, payment, completed-job proof, and review requests in one connected system.</p>
      </section>
      <section>
        <h2>A live system instead of another static website</h2>
        <p>The demonstration is designed to show the difference between a page that only explains a business and a live system that helps move real work forward.</p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Pest Control Live System Demo",
      url: `${SITE_URL}/planet/demo/pest-control`,
      isPartOf: {
        "@type": "WebSite",
        name: "HomePlanet",
        url: `${SITE_URL}/`
      }
    }
  },
  {
    route: "/planet/okie-dokie-softwash",
    title: "Pressure Washing & Softwash in Okeechobee, FL",
    description:
      "Okeechobee pressure washing and softwash for homes, driveways, roofs, pool cages, patios, fences, and exterior property cleaning. Request an estimate.",
    image: `${SITE_URL}/images/okie-dokie-softwash-hero.webp`,
    heading: "Pressure Washing and Softwash in Okeechobee, Florida",
    body: `
      <section>
        <h2>Exterior cleaning services in Okeechobee</h2>
        <p>Okie Dokie Softwash provides exterior cleaning for homes and properties around Okeechobee, Florida. Customers can choose the area that needs cleaning, describe the condition of the property, and request an estimate through one clear service flow.</p>
        <p>Services can include house washing, driveway and walkway cleaning, roof softwashing, pool cage cleaning, patio cleaning, fence cleaning, and other exterior property cleaning needs.</p>
      </section>
      <section>
        <h2>Request a pressure cleaning estimate with property details</h2>
        <p>The Okie Dokie Softwash live page is built around a clear customer action. Customers can select the service, identify the approximate project size, explain gate or property access, describe the buildup or staining, and provide contact information.</p>
      </section>
      <section>
        <h2>From estimate request to active exterior cleaning workflow</h2>
        <p>A customer request is only the beginning of the job. The operating workflow underneath the page can support estimate review, customer follow-up, project approval, scheduling, work photos, payment, completed-job proof, and review requests.</p>
      </section>
      <section>
        <h2>Local pressure washing and softwash service around Okeechobee</h2>
        <p>Okie Dokie Softwash focuses on exterior cleaning needs common to Okeechobee homes and properties. Florida weather, humidity, organic growth, and outdoor exposure can affect driveways, house exteriors, roofs, pool cages, patios, fences, and other surfaces.</p>
        <p>The service page is designed to help local customers start with the cleaning need they already recognize and move directly into an estimate request.</p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Okie Dokie Softwash",
      url: `${SITE_URL}/planet/okie-dokie-softwash`,
      image: `${SITE_URL}/images/okie-dokie-softwash-hero.webp`,
      description:
        "Pressure washing, soft washing, and exterior property cleaning in Okeechobee, Florida.",
      areaServed: {
        "@type": "City",
        name: "Okeechobee",
        addressRegion: "FL"
      },
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "House Washing"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Driveway Cleaning"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Roof Softwashing"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Pool Cage Cleaning"
          }
        }
      ]
    }
  },
  {
    route: "/planet/okeechobee",
    title: "Okeechobee Together | Local Help & Community Action",
    description:
      "Okeechobee Together helps local people share needs, offers, opportunities, events, and community action through one connected local system.",
    image: `${SITE_URL}/og-homeplanet.png`,
    heading: "Okeechobee Together connects local needs with local action.",
    body: `
      <section>
        <h2>A community system for Okeechobee</h2>
        <p>Okeechobee Together gives local people a clearer way to share a need, offer help, create an opportunity, organize an event, or surface something the community should know.</p>
      </section>
      <section>
        <h2>Local needs and local help in one connected flow</h2>
        <p>Community action should not depend on one person manually coordinating every message. Okeechobee Together is designed so a public signal can create a clear next action and help the right people move the work forward.</p>
      </section>
      <section>
        <h2>Community coordination with a visible truth chain</h2>
        <p>Needs, actions, and outcomes can stay connected so people can understand where something started, what happened next, and what was completed.</p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Okeechobee Together",
      url: `${SITE_URL}/planet/okeechobee`,
      about: {
        "@type": "City",
        name: "Okeechobee",
        addressRegion: "FL"
      }
    }
  },
  {
    route: "/planet/vz-professional-lawncare",
    title: "V&Z Professional Lawncare | Okeechobee, FL",
    description:
      "V&Z Professional Lawncare provides mowing, edging, trimming, mulch installation, gutter cleaning, window cleaning, roof cleaning, and exterior property care.",
    image: `${SITE_URL}/images/vz-lawncare-eric-trimming-hero.jpeg`,
    heading: "Professional lawn and exterior property care in Okeechobee.",
    body: `
      <section>
        <h2>Lawn and exterior property care in Okeechobee</h2>
        <p>V&amp;Z Professional Lawncare provides local property care including mowing, edging, trimming, mulch installation, gutter cleaning, window cleaning, roof cleaning, and additional exterior services.</p>
      </section>
      <section>
        <h2>Start with the property work you need</h2>
        <p>Customers can begin with the service they need and provide property details, yard condition, access information, timing, and photos when useful for reviewing the work.</p>
      </section>
      <section>
        <h2>Direct communication and clear follow-up</h2>
        <p>The V&amp;Z live page is designed to move a customer from the property need into direct communication and a clear service workflow.</p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "V&Z Professional Lawncare LLC",
      url: `${SITE_URL}/planet/vz-professional-lawncare`,
      telephone: "+1-863-532-8123",
      areaServed: {
        "@type": "City",
        name: "Okeechobee",
        addressRegion: "FL"
      }
    }
  },
  {
    route: "/planet/jones-equipment-rental-repair",
    title: "Jones Equipment Rental & Repair | Equipment Rentals and Repair",
    description:
      "Request equipment rentals or start an equipment repair request with Jones Equipment Rental & Repair. Call or text JME at 615-602-1524.",
    image: `${SITE_URL}/images/jme-hero-service-truck-loader.jpg`,
    heading: "Jones Equipment Rental and Repair",
    body: `
      <section>
        <h2>Equipment rentals and equipment repair through one clear local system</h2>
        <p>Jones Equipment Rental &amp; Repair gives customers two direct ways to begin: request equipment for a job or start an equipment repair request. Customers can also call or text JME directly at 615-602-1524.</p>
      </section>
      <section>
        <h2>Request rental equipment and the dates you need it</h2>
        <p>The guided rental request starts with the equipment needed, requested start and return dates, the job or project, the location, and whether the customer wants to discuss pickup or delivery. Each answer is handled one step at a time instead of through one large blank form.</p>
        <p>Availability, pricing, deposits, scheduling, equipment condition, return details, and final payment can remain connected to the original rental request instead of being separated across text messages, paper notes, and disconnected systems.</p>
      </section>
      <section>
        <h2>Start an equipment repair request</h2>
        <p>The guided repair request begins by identifying the equipment, adding brand or model details when available, describing the problem, explaining whether the machine starts or moves, selecting photos, and providing the equipment location and customer contact information.</p>
        <p>Repair intake can stay connected to diagnosis, estimates, customer approval, parts, work status, photos, payment, pickup or delivery, and the completed repair outcome.</p>
      </section>
      <section>
        <h2>A connected history for customers, rentals, repairs, and equipment</h2>
        <p>The public page is the customer entrance. The operating system underneath can connect the customer, equipment, schedule, deposit, estimate, approval, parts, work, payment, proof, and final outcome.</p>
        <p>Each machine can eventually maintain a continuous history of rentals, returns, inspections, maintenance, repairs, photos, payments, status changes, and availability.</p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/planet/jones-equipment-rental-repair#business`,
      name: "Jones Equipment Rental & Repair",
      alternateName: "JME",
      url: `${SITE_URL}/planet/jones-equipment-rental-repair`,
      telephone: "+1-615-602-1524",
      image: `${SITE_URL}/images/jme-hero-service-truck-loader.jpg`,
      logo: `${SITE_URL}/images/jme-logo-primary.jpg`,
      description:
        "Equipment rentals and equipment repair with direct customer requests by phone, text, or the JME live page.",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-615-602-1524",
        contactType: "customer service",
        availableLanguage: "English"
      },
      makesOffer: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Equipment Rental Requests"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Equipment Repair Requests"
          }
        }
      ]
    }
  },
  {
    route: "/onlytheessentials",
    title: "Only The Essentials Cleaning | Okeechobee, FL",
    description:
      "Only The Essentials Cleaning provides local home cleaning in Okeechobee with a clear quote request for bedrooms, bathrooms, pets, home condition, photos, and scheduling.",
    image: `${SITE_URL}/images/only-the-essentials-cleaning-premium-logo.png`,
    heading: "Home cleaning in Okeechobee with a simpler quote request.",
    body: `
      <section>
        <h2>Local home cleaning in Okeechobee</h2>
        <p>Only The Essentials Cleaning helps local customers request a cleaning quote by starting with the details that actually affect the work.</p>
      </section>
      <section>
        <h2>Request a cleaning quote with the important home details</h2>
        <p>Customers can provide bedroom and bathroom counts, pet information, home condition, preferred timing, contact details, and property photos when helpful.</p>
      </section>
      <section>
        <h2>From cleaning quote to scheduled work</h2>
        <p>The connected cleaning workflow can support estimate review, customer approval, scheduling, work photos, payment, completed-job proof, review follow-up, and recurring cleaning opportunities.</p>
      </section>
    `,
    schema: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Only The Essentials Cleaning",
      url: `${SITE_URL}/onlytheessentials`,
      areaServed: {
        "@type": "City",
        name: "Okeechobee",
        addressRegion: "FL"
      },
      makesOffer: {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Home Cleaning"
        }
      }
    }
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function routeOutput(route) {
  if (route === "/") {
    return path.join(distDir, "index.html");
  }

  return path.join(
    distDir,
    ...route.split("/").filter(Boolean),
    "index.html"
  );
}

function buildSeoHtml(baseHtml, page) {
  const escapedTitle = escapeHtml(page.title);
  const escapedDescription = escapeHtml(page.description);
  const escapedCanonical = escapeHtml(`${SITE_URL}${page.route}`);
  const escapedImage = escapeHtml(page.image);

  let html = baseHtml;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapedTitle}</title>`
  );

  html = html.replace(
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapedDescription}" />`
  );

  html = html.replace(
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${escapedTitle}" />`
  );

  html = html.replace(
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${escapedDescription}" />`
  );

  html = html.replace(
    /<meta\s+property=["']og:image["'][^>]*>/i,
    `<meta property="og:image" content="${escapedImage}" />`
  );

  html = html.replace(
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${escapedCanonical}" />`
  );

  html = html.replace(
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${escapedTitle}" />`
  );

  html = html.replace(
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${escapedDescription}" />`
  );

  html = html.replace(
    /<meta\s+name=["']twitter:image["'][^>]*>/i,
    `<meta name="twitter:image" content="${escapedImage}" />`
  );

  html = html.replace(
    /\s*<link\s+rel=["']canonical["'][^>]*>/gi,
    ""
  );

  html = html.replace(
    /\s*<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
    ""
  );

  const seoHead = `
    <link rel="canonical" href="${escapedCanonical}" />
    <script type="application/ld+json">${JSON.stringify(page.schema)}</script>`;

  html = html.replace("</head>", `${seoHead}\n  </head>`);

  const crawlableContent = `
    <main id="seo-content" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:normal;border:0;">
      <h1>${escapeHtml(page.heading)}</h1>
      ${page.body}
    </main>
    <div id="root"></div>`;

  html = html.replace(
    /<div\s+id=["']root["']\s*><\/div>/i,
    crawlableContent
  );

  return html;
}

if (!fs.existsSync(baseHtmlPath)) {
  throw new Error(`Base Vite HTML was not found: ${baseHtmlPath}`);
}

const baseHtml = fs.readFileSync(baseHtmlPath, "utf8");

for (const page of publicSeoRegistry) {
  const output = routeOutput(page.route);
  const html = buildSeoHtml(baseHtml, page);

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html, "utf8");

  console.log(`Generated SEO shell: ${output}`);
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicSeoRegistry
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.route}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapXml, "utf8");

console.log(
  `Generated sitemap from public SEO registry: ${publicSeoRegistry.length} URLs`
);
