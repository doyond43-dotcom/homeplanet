export type HomePlanetStatus = "live" | "testing" | "planned";

export type HomePlanetPlanet = {
  id: string;
  name: string;
  description: string;
  status: HomePlanetStatus;
};

export type HomePlanetCity = {
  id: string;
  planetId: string;
  name: string;
  description: string;
  route?: string;
  status: HomePlanetStatus;
};

export type HomePlanetSharedTool = {
  id: string;
  name: string;
  description: string;
  route?: string;
  status: HomePlanetStatus;
};

export type BuildMySystemModule = {
  id: string;
  name: string;
  description: string;
  category:
    | "front-door"
    | "customer-flow"
    | "operations"
    | "money"
    | "communication"
    | "proof"
    | "intelligence"
    | "physical"
    | "automation";
  status: HomePlanetStatus;
  sharedToolId?: string;
};

export const homePlanetPlanets: HomePlanetPlanet[] = [
  {
    id: "service",
    name: "Service Planet",
    description:
      "Home services, field work, repair, maintenance, and local service businesses.",
    status: "live",
  },
  {
    id: "commerce",
    name: "Commerce Planet",
    description:
      "Local sellers, markets, inventory, ordering, pickup, delivery, and storefront systems.",
    status: "live",
  },
  {
    id: "creator",
    name: "Creator Planet",
    description:
      "Creators, studios, projects, media, collaboration, and creative production.",
    status: "testing",
  },
  {
    id: "community",
    name: "Community Planet",
    description:
      "Local needs, helpers, projects, events, and people coordinating around real-world problems.",
    status: "live",
  },
  {
    id: "guardian",
    name: "Guardian Planet",
    description:
      "Pet, livestock, household, identity, recovery, care, and protection systems.",
    status: "live",
  },
  {
    id: "experience",
    name: "Experience Planet",
    description:
      "Events, trips, attractions, physical experiences, QR moments, memory, and proof.",
    status: "testing",
  },
  {
    id: "education",
    name: "Education Planet",
    description:
      "Learning, student work, classroom coordination, and education systems.",
    status: "planned",
  },
  {
    id: "legal",
    name: "Legal Planet",
    description:
      "Client intake, documents, case workflows, updates, and legal service systems.",
    status: "testing",
  },
  {
    id: "health",
    name: "Health Planet",
    description:
      "Privacy-first care coordination, health workflows, and personal support systems.",
    status: "planned",
  },
];

export const homePlanetCities: HomePlanetCity[] = [
  {
    id: "home-services",
    planetId: "service",
    name: "Home Services City",
    description:
      "Requests, estimates, scheduling, field work, payments, and customer follow-up.",
    status: "live",
  },
  {
    id: "auto-repair",
    planetId: "service",
    name: "Auto Repair City",
    description:
      "Vehicle intake, diagnostics, approvals, parts, repair progress, and proof.",
    status: "testing",
  },
  {
    id: "lawn-care",
    planetId: "service",
    name: "Lawn Care City",
    description:
      "Local lawn service requests, routes, recurring work, customer updates, and payments.",
    status: "live",
  },
  {
    id: "cleaning",
    planetId: "service",
    name: "Cleaning City",
    description:
      "Cleaning requests, scheduling, service workflow, proof, payments, and repeat customers.",
    status: "live",
  },
  {
    id: "okeechobee-live-meat-market",
    planetId: "commerce",
    name: "Okeechobee Live Meat Market",
    description:
      "Local meat sellers, products, buyer requests, inventory, orders, pickup, and delivery.",
    route: "/planet/okeechobee/meat-market",
    status: "live",
  },
  {
    id: "local-sellers",
    planetId: "commerce",
    name: "Local Sellers",
    description:
      "Simple seller storefronts, inventory, orders, fulfillment, and customer contact.",
    status: "testing",
  },
  {
    id: "creator-city",
    planetId: "creator",
    name: "Creator City",
    description:
      "Projects, studios, media, builds, collaboration, and creator workflows.",
    route: "/city/creator",
    status: "testing",
  },
  {
    id: "okeechobee-together",
    planetId: "community",
    name: "Okeechobee Together",
    description:
      "Local needs, helpers, projects, events, and community coordination.",
    route: "/planet/okeechobee",
    status: "live",
  },
  {
    id: "guardian-pet",
    planetId: "guardian",
    name: "Guardian Pet",
    description:
      "Pet identity, recovery, care information, ownership, and found-pet contact.",
    route: "/planet/guardian-pet",
    status: "live",
  },
  {
    id: "livestock",
    planetId: "guardian",
    name: "Livestock",
    description:
      "Livestock identification, QR recovery, ownership, sightings, and ranch records.",
    status: "live",
  },
  {
    id: "experiences",
    planetId: "experience",
    name: "Experiences",
    description:
      "Trips, attractions, guest moments, physical interactions, and memory layers.",
    status: "testing",
  },
];

export const homePlanetSharedTools: HomePlanetSharedTool[] = [
  {
    id: "live-page",
    name: "Live Page",
    description:
      "The public-facing page where customers, residents, guests, or participants begin.",
    status: "live",
  },
  {
    id: "live-board",
    name: "Live Board",
    description:
      "A live operating board for incoming work, activity, status, and next actions.",
    status: "live",
  },
  {
    id: "work-drawer",
    name: "Work Drawer",
    description:
      "Keeps customer details, notes, files, estimates, actions, and history together.",
    status: "live",
  },
  {
    id: "tech-pad",
    name: "Tech Pad",
    description:
      "A field-friendly workspace for technicians, crews, installers, and operators.",
    status: "testing",
  },
  {
    id: "truth-chain",
    name: "Truth Chain",
    description:
      "A timestamped sequence of what happened, what changed, and what was completed.",
    status: "live",
  },
  {
    id: "requests",
    name: "Requests",
    description:
      "Customer or participant intake without forcing people through unnecessary accounts or apps.",
    status: "live",
  },
  {
    id: "estimates",
    name: "Estimates",
    description:
      "Create, send, review, and connect estimates directly to the work.",
    status: "live",
  },
  {
    id: "scheduling",
    name: "Scheduling",
    description:
      "Connect approved work to dates, times, routes, staff, and customer expectations.",
    status: "live",
  },
  {
    id: "customers",
    name: "Customers",
    description:
      "Keep people, contact details, work history, requests, and outcomes connected.",
    status: "live",
  },
  {
    id: "payments",
    name: "Payments",
    description:
      "Connect payment actions, confirmation, receipts, and completion to the work.",
    status: "live",
  },
  {
    id: "messages",
    name: "Messages",
    description:
      "Keep customer and team communication connected to the actual work instead of scattered conversations.",
    status: "live",
  },
  {
    id: "photos-files",
    name: "Photos / Files",
    description:
      "Attach images, documents, before-and-after proof, and other files directly to the record.",
    status: "live",
  },
  {
    id: "reviews",
    name: "Reviews",
    description:
      "Request and connect customer feedback after the outcome is complete.",
    status: "testing",
  },
  {
    id: "orders",
    name: "Orders",
    description:
      "Capture products, quantities, customer selections, fulfillment, and order status.",
    status: "live",
  },
  {
    id: "inventory",
    name: "Inventory",
    description:
      "Track available products, quantities, availability, and seller or business supply.",
    status: "live",
  },
  {
    id: "delivery",
    name: "Delivery",
    description:
      "Connect orders or work to pickup, delivery, route, handoff, and completion.",
    status: "testing",
  },
  {
    id: "employees",
    name: "Employees",
    description:
      "Connect staff, roles, assignments, work status, and operating responsibilities.",
    status: "testing",
  },
  {
    id: "forms",
    name: "Forms",
    description:
      "Create simple intake and information flows for customers, staff, projects, and operations.",
    status: "live",
  },
  {
    id: "intelligence",
    name: "Intelligence",
    description:
      "Turn activity, requests, patterns, and outcomes into useful operating awareness.",
    status: "live",
  },
  {
    id: "qr-entry",
    name: "QR / Physical Entry",
    description:
      "Connect real-world objects, locations, animals, events, or spaces directly into HomePlanet.",
    status: "live",
  },
  {
    id: "automations",
    name: "Automations",
    description:
      "Move repetitive follow-up, notifications, state changes, and coordination automatically.",
    status: "testing",
  },
  {
    id: "live-studio",
    name: "Live Studio",
    description:
      "Host live meetings, walkthroughs, training, presentations, and shared sessions.",
    route: "/planet/live-studio",
    status: "testing",
  },
];

export const buildMySystemModules: BuildMySystemModule[] = [
  {
    id: "live-page",
    name: "Live Page",
    description:
      "Give customers one clear place to understand, request, buy, book, or begin.",
    category: "front-door",
    status: "live",
    sharedToolId: "live-page",
  },
  {
    id: "requests",
    name: "Requests",
    description:
      "Collect customer needs and job details without scattered texts, calls, or messages.",
    category: "customer-flow",
    status: "live",
    sharedToolId: "requests",
  },
  {
    id: "estimates",
    name: "Estimates",
    description:
      "Create and connect estimates directly to the customer and the work.",
    category: "customer-flow",
    status: "live",
    sharedToolId: "estimates",
  },
  {
    id: "scheduling",
    name: "Scheduling",
    description:
      "Move approved work into a clear schedule for customers and staff.",
    category: "operations",
    status: "live",
    sharedToolId: "scheduling",
  },
  {
    id: "customers",
    name: "Customers",
    description:
      "Keep contact details, history, requests, work, and outcomes together.",
    category: "customer-flow",
    status: "live",
    sharedToolId: "customers",
  },
  {
    id: "payments",
    name: "Payments",
    description:
      "Connect payment, confirmation, receipt, and completion to the job or order.",
    category: "money",
    status: "live",
    sharedToolId: "payments",
  },
  {
    id: "messages",
    name: "Messages",
    description:
      "Keep important communication attached to the work instead of lost across apps.",
    category: "communication",
    status: "live",
    sharedToolId: "messages",
  },
  {
    id: "photos-files",
    name: "Photos / Files",
    description:
      "Attach photos, documents, proof, and files directly to the record.",
    category: "proof",
    status: "live",
    sharedToolId: "photos-files",
  },
  {
    id: "reviews",
    name: "Reviews",
    description:
      "Ask for customer feedback after the work or order is complete.",
    category: "proof",
    status: "testing",
    sharedToolId: "reviews",
  },
  {
    id: "orders",
    name: "Orders",
    description:
      "Collect products, quantities, selections, fulfillment, and customer order status.",
    category: "operations",
    status: "live",
    sharedToolId: "orders",
  },
  {
    id: "inventory",
    name: "Inventory",
    description:
      "Track what is available, what moved, and what needs attention.",
    category: "operations",
    status: "live",
    sharedToolId: "inventory",
  },
  {
    id: "delivery",
    name: "Delivery",
    description:
      "Manage pickup, delivery, routes, handoff, and completion.",
    category: "operations",
    status: "testing",
    sharedToolId: "delivery",
  },
  {
    id: "employees",
    name: "Employees",
    description:
      "Connect team members, roles, assignments, and work responsibilities.",
    category: "operations",
    status: "testing",
    sharedToolId: "employees",
  },
  {
    id: "forms",
    name: "Forms",
    description:
      "Create simple forms for intake, updates, staff, projects, or customer information.",
    category: "customer-flow",
    status: "live",
    sharedToolId: "forms",
  },
  {
    id: "intelligence",
    name: "Intelligence",
    description:
      "See patterns, activity, customer signals, and useful next actions.",
    category: "intelligence",
    status: "live",
    sharedToolId: "intelligence",
  },
  {
    id: "qr-entry",
    name: "QR / Physical Entry",
    description:
      "Connect a physical object, location, product, animal, or experience directly into the system.",
    category: "physical",
    status: "live",
    sharedToolId: "qr-entry",
  },
  {
    id: "truth-chain",
    name: "Truth Chain",
    description:
      "Keep a clear timeline of requests, approvals, work, proof, payment, and outcomes.",
    category: "proof",
    status: "live",
    sharedToolId: "truth-chain",
  },
  {
    id: "automations",
    name: "Automations",
    description:
      "Reduce repetitive follow-up, reminders, notifications, and operating steps.",
    category: "automation",
    status: "testing",
    sharedToolId: "automations",
  },
  {
    id: "live-studio",
    name: "Live Studio",
    description:
      "Add live meetings, walkthroughs, training, presentations, or shared sessions.",
    category: "communication",
    status: "testing",
    sharedToolId: "live-studio",
  },
];