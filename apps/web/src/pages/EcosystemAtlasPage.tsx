import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type AtlasKind =
  | "provider"
  | "helper"
  | "system"
  | "intelligence"
  | "demo"
  | "unverified";

type AtlasStatus = "active" | "paused" | "unverified";

type ReplySet = {
  facebook: string;
  messenger: string;
  text: string;
};

type AtlasEntry = {
  id: string;
  name: string;
  category: string;
  kind: AtlasKind;
  status: AtlasStatus;
  contact?: string;
  phone?: string;
  route?: string;
  boardRoute?: string;
  facebook?: string;
  areas: string[];
  services: string[];
  recommendation: string;
  proof: string;
  notes?: string;
  favorite?: boolean;
  replies: ReplySet;
};

const entries: AtlasEntry[] = [
  {
    id: "only-the-essentials",
    name: "Only The Essentials Cleaning",
    category: "Cleaning",
    kind: "provider",
    status: "active",
    contact: "Kaitlin",
    phone: "8638013179",
    route: "/planet/only-the-essentials-cleaning",
    areas: ["Okeechobee", "Surrounding areas — confirm availability"],
    services: [
      "Residential cleaning",
      "Recurring cleaning",
      "Deep cleaning",
      "Cleaning estimates",
    ],
    recommendation:
      "A local cleaning company with a clear customer request process and direct communication with Kaitlin.",
    proof:
      "HomePlanet built and supports the customer-facing Live Page, quote flow, Intelligence Dashboard, and Live Activity workflow.",
    notes:
      "Trusted HomePlanet working relationship. Use the public Live Page when someone needs a cleaner or wants to request a quote.",
    favorite: true,
    replies: {
      facebook:
        "Only The Essentials Cleaning may be able to help. Kaitlin has a simple page where you can see the service and send the cleaning details directly:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Here is Kaitlin’s page for Only The Essentials Cleaning. You can review the service and send your cleaning request directly:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Only The Essentials Cleaning / Kaitlin: {link}\nPhone: {phone}",
    },
  },
  {
    id: "florida-cooling",
    name: "Florida Cooling",
    category: "Air Conditioning",
    kind: "provider",
    status: "active",
    contact: "Uriel Manzone and Victor Pineda",
    phone: "8635326671",
    route: "/planet/florida-cooling",
    boardRoute: "/planet/florida-cooling/board",
    areas: ["Okeechobee", "Residential and commercial service"],
    services: [
      "Air-conditioning service",
      "HVAC diagnostics",
      "Residential HVAC",
      "Commercial HVAC",
      "Repair and service coordination",
    ],
    recommendation:
      "A local HVAC team that has repeatedly stepped up to help Okeechobee residents through community projects.",
    proof:
      "Uriel Manzone is the owner and license holder. Uriel and Victor have assisted multiple Okeechobee Together air-conditioning needs.",
    notes:
      "Trusted community partner. Public page route still needs final verification before adding a Copy Link action.",
    favorite: true,
    replies: {
      facebook:
        "Florida Cooling may be able to help. Uriel Manzone and Victor Pineda have stepped up for local families through Okeechobee Together. You can call or text them at {phone}.",
      messenger:
        "Florida Cooling handles residential and commercial HVAC work in Okeechobee. Uriel and Victor can be reached at {phone}.",
      text:
        "Florida Cooling — Uriel Manzone and Victor Pineda\nCall or text: {phone}",
    },
  },
  {
    id: "vz-professional-lawncare",
    name: "V&Z Professional Lawncare",
    category: "Lawn & Property Care",
    kind: "provider",
    status: "active",
    contact: "Eric Villalobos",
    phone: "8634477915",
    route: "/planet/vz-professional-lawncare",
    areas: ["Okeechobee"],
    services: [
      "Mowing",
      "Edging",
      "Trimming",
      "Mulch installation",
      "Gutter cleaning",
      "Window cleaning",
      "Roof cleaning",
      "Exterior property care",
    ],
    recommendation:
      "Eric does strong work whether he is handling his own route or helping alongside community projects.",
    proof:
      "V&Z has worked alongside Okeechobee Together on multiple local lawn projects.",
    notes:
      "Trusted local provider and community helper. Public Live Page is active.",
    favorite: true,
    replies: {
      facebook:
        "V&Z Professional Lawncare may be able to help. Eric handles lawn and exterior property care around Okeechobee. Here is the page where you can see the services and request an estimate:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Here is V&Z Professional Lawncare’s page. Eric handles mowing, trimming, mulch, cleaning, and other exterior property work:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "V&Z Professional Lawncare / Eric\n{link}\nPhone: {phone}",
    },
  },
  {
    id: "jones-equipment",
    name: "Jones Equipment Rental & Repair",
    category: "Equipment Rental & Repair",
    kind: "provider",
    status: "active",
    contact: "Daron Jones",
    phone: "6156021524",
    route: "/planet/jones-equipment-rental-repair",
    boardRoute: "/planet/jones-equipment-rental-repair/board",
    areas: ["Okeechobee and surrounding service area — confirm availability"],
    services: [
      "Equipment rental",
      "Equipment repair",
      "Rental requests",
      "Repair intake",
      "Equipment availability coordination",
    ],
    recommendation:
      "A direct local doorway for equipment rentals and repair requests without letting customer messages get buried.",
    proof:
      "Daron has contributed time and equipment through Okeechobee Together. HomePlanet built the rental and repair customer flow.",
    notes:
      "Trusted community partner with an active HomePlanet Live Page and operating workflow.",
    favorite: true,
    replies: {
      facebook:
        "Jones Equipment Rental & Repair may be able to help with the equipment or repair side. You can start with their page here:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Here is Jones Equipment Rental & Repair. The page has separate doorways for rentals and repair requests:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Jones Equipment Rental & Repair / Daron Jones\n{link}\nPhone: {phone}",
    },
  },
  {
    id: "bosch-well-septic",
    name: "Bosch Well & Septic",
    category: "Well & Septic",
    kind: "unverified",
    status: "unverified",
    areas: ["Service area not yet confirmed"],
    services: ["Well service", "Septic service", "New installations — confirm"],
    recommendation:
      "A local provider name to keep available when well or septic recommendations are requested.",
    proof:
      "Added to the Atlas as a known local company. Direct HomePlanet proof history and current contact details still need verification.",
    notes:
      "Do not present as personally verified yet. Add phone, Facebook, service area, and exact capabilities after confirmation.",
    replies: {
      facebook:
        "Bosch Well & Septic may be worth checking with for the well or septic side. I would confirm that they serve your location and handle the exact type of installation before scheduling.",
      messenger:
        "Bosch Well & Septic is one local company to check. Their current service area and availability still need to be confirmed.",
      text:
        "Bosch Well & Septic may be worth contacting. Please confirm service area, licensing, and the exact work they handle.",
    },
  },
  {
    id: "scotts-drilling",
    name: "Scott’s Drilling",
    category: "Well Drilling",
    kind: "unverified",
    status: "unverified",
    contact: "Tammy — full details not yet confirmed",
    areas: ["St. Lucie County mentioned in referral post", "Other areas unverified"],
    services: ["Well drilling", "New well installation — confirm"],
    recommendation:
      "A community-recommended well-drilling lead for posts requesting a new well.",
    proof:
      "Recommended publicly by Maria Shaheen, who said to mention that she referred the customer to Tammy.",
    notes:
      "Community recommendation only. Phone, Facebook page, licensing, service area, and new-construction availability still need verification.",
    replies: {
      facebook:
        "Scott’s Drilling was recommended here for the well side. Maria Shaheen suggested asking for Tammy and mentioning that Maria referred you. I would confirm service area and new-construction availability directly.",
      messenger:
        "Scott’s Drilling was recommended by Maria Shaheen for well work. Ask for Tammy and confirm that they serve the property location.",
      text:
        "Scott’s Drilling was community-recommended for well work. Ask for Tammy and mention Maria Shaheen’s referral. Details still need verification.",
    },
  },
  {
    id: "daniel-custom-systems",
    name: "Daniel — Building HomePlanet",
    category: "HomePlanet Systems",
    kind: "system",
    status: "active",
    contact: "Daniel Doyon",
    route: "/planet/custom-systems",
    boardRoute: "/planet/custom-systems/activity",
    areas: ["Local and remote system builds"],
    services: [
      "Custom operating systems",
      "Live Pages",
      "Live Boards",
      "Workflow architecture",
      "Customer request systems",
      "Operational intelligence",
    ],
    recommendation:
      "The primary explanation of how Daniel builds connected systems around how a business actually works.",
    proof:
      "Shows the HomePlanet method and working examples including Jones Equipment, Only The Essentials, and Okeechobee Together.",
    notes:
      "Use this as the primary founder and custom-systems introduction page.",
    favorite: true,
    replies: {
      facebook:
        "Daniel builds custom systems around how a business actually works — customer requests, jobs, approvals, scheduling, payments, proof, and follow-up. Here is the main page:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "This explains what Daniel is building through HomePlanet and how the customer-facing page connects to the working system underneath:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Daniel — Building HomePlanet\n{link}",
    },
  },
  {
    id: "build-live-system",
    name: "Build Your Live System",
    category: "HomePlanet Systems",
    kind: "system",
    status: "active",
    route: "/planet/build-your-live-system",
    areas: ["HomePlanet internal and customer intake"],
    services: [
      "System request intake",
      "Business problem selection",
      "Workflow discovery",
      "Customer-request planning",
    ],
    recommendation:
      "A guided starting point for identifying the real business problem before discussing software.",
    proof:
      "Connected to the HomePlanet custom-systems workflow.",
    notes:
      "Use when someone is interested in getting a system built and needs a guided starting point.",
    replies: {
      facebook:
        "This is the starting point for showing HomePlanet what is getting messy inside the business and what needs to be connected:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Use this page to choose the closest business problem and start the system request:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Start a HomePlanet system request: {link}",
    },
  },
  {
    id: "okeechobee-together",
    name: "Okeechobee Together",
    category: "Community System",
    kind: "system",
    status: "active",
    route: "/planet/okeechobee",
    boardRoute: "/planet/okeechobee/command",
    areas: ["Okeechobee County"],
    services: [
      "Community needs",
      "Volunteer connections",
      "Local business connections",
      "Project updates",
      "Public proof and outcomes",
    ],
    recommendation:
      "A community operating system connecting real needs, helpers, local businesses, resources, and outcomes.",
    proof:
      "Active community projects and documented help from local residents and businesses.",
    notes:
      "Not a marketplace, contractor service, or charity. Use for community connections and organized projects.",
    favorite: true,
    replies: {
      facebook:
        "Okeechobee Together helps connect local needs with helpers, businesses, resources, and clear outcomes. Here is the community page:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Here is the Okeechobee Together community page. It includes ways to ask for help, offer help, and follow active projects:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Okeechobee Together: {link}",
    },
  },
  {
    id: "home-services-demo",
    name: "Okee Dokie Home Services Demo",
    category: "Demonstration",
    kind: "demo",
    status: "active",
    route: "/planet/demo/home-services",
    boardRoute: "/planet/demo/home-services/board",
    areas: ["Working HomePlanet demonstration"],
    services: [
      "Customer-facing service page",
      "Service selection",
      "Request workflow",
      "Connected Live Board",
    ],
    recommendation:
      "A complete working home-services example showing the public customer experience and the operating board underneath.",
    proof:
      "The public page and connected board are active routes in the HomePlanet application.",
    notes:
      "Use this as the primary general demonstration for home-service companies.",
    favorite: true,
    replies: {
      facebook:
        "Here is a working HomePlanet home-services example. Customers can choose what they need and send the request into an organized Live Board underneath:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "This is the HomePlanet home-services demonstration with the customer page and connected Live Board:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "HomePlanet home-services demo: {link}",
    },
  },
  {
    id: "guardian-pet-tags",
    name: "HomePlanet Guardian Pet Tags",
    category: "Product System",
    kind: "system",
    status: "active",
    route: "/planet/guardian-pet",
    boardRoute: "/planet/guardian-pet/fulfillment",
    areas: ["Public product page", "Protected fulfillment workflow"],
    services: [
      "Pet recovery tags",
      "Finder contact workflow",
      "Owner privacy controls",
      "Order and fulfillment tracking",
    ],
    recommendation:
      "The complete HomePlanet pet recovery product with ordering, activation, finder communication, and fulfillment underneath.",
    proof:
      "The public product page and protected fulfillment board are active working routes.",
    notes:
      "The fulfillment page requires authorized access.",
    favorite: true,
    replies: {
      facebook:
        "HomePlanet Guardian Pet Tags help someone contact the owner quickly without exposing private information:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Here is the HomePlanet Guardian Pet Tag system and public product page:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "HomePlanet Guardian Pet Tags: {link}",
    },
  },
  {
    id: "guardian-bella-demo",
    name: "Bella's Live Guardian Tag",
    category: "Demonstration",
    kind: "demo",
    status: "active",
    route: "/planet/guardian-pet/pet/bella-demo",
    areas: ["Public finder demonstration"],
    services: [
      "Live tag demonstration",
      "Finder actions",
      "Contact-owner workflow",
      "Pet recovery experience",
    ],
    recommendation:
      "A direct demonstration of what someone sees after scanning a Guardian Pet Tag.",
    proof:
      "Bella's demonstration route is active and safe to share publicly.",
    notes:
      "Use this when someone needs to understand the finder experience immediately.",
    favorite: true,
    replies: {
      facebook:
        "Here is Bella's live demo tag so you can see exactly what someone would see after scanning a Guardian Pet Tag:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "This is Bella's live Guardian Tag demonstration:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Bella's Guardian Tag demo: {link}",
    },
  },
  {
    id: "cow-town-tags",
    name: "Cow Town Tags",
    category: "Product System",
    kind: "system",
    status: "active",
    route: "/planet/cow-town-tags",
    boardRoute: "/planet/cow-town-tags/order",
    areas: ["Livestock identification", "Ranch recovery system"],
    services: [
      "Livestock recovery tags",
      "Public QR recovery pages",
      "Ranch identification",
      "Tag ordering",
    ],
    recommendation:
      "A livestock recovery and ranch-management system built around visible ear tags and public scan pages.",
    proof:
      "The Cow Town Tags product page and order workflow are active routes.",
    notes:
      "Dynamic animal-tag pages and ownership-transfer links are intentionally not listed in the general Atlas.",
    favorite: true,
    replies: {
      facebook:
        "Cow Town Tags connects a visible livestock ear tag to a public recovery page so the right ranch can be reached faster:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Here is the Cow Town Tags livestock recovery and identification system:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Cow Town Tags: {link}",
    },
  },
  {
    id: "homeplanet-growth-board",
    name: "HomePlanet Growth Board",
    category: "Internal Board",
    kind: "system",
    status: "active",
    route: "/planet/homeplanet/growth",
    areas: ["HomePlanet internal operations"],
    services: [
      "Relationship management",
      "Opportunity tracking",
      "Follow-up actions",
      "Interaction history and Truth Chain",
      "Live Meat Market upgrade inquiries",
    ],
    recommendation:
      "HomePlanet's internal working board for turning relationships and opportunities into clear next actions.",
    proof:
      "Verified on Production with Farm Folks LLC and existing HomePlanet relationships.",
    notes:
      "Protected internal board. Sign-in required. Local: http://localhost:5173/planet/homeplanet/growth. Live: https://www.homeplanet.city/planet/homeplanet/growth.",
    favorite: true,
    replies: {
      facebook:
        "HomePlanet Growth Board is an internal, sign-in-protected operating system.",
      messenger:
        "HomePlanet Growth Board: {link} (authorized access required).",
      text:
        "HomePlanet Growth Board: {link} (authorized access required).",
    },
  },
  {
    id: "live-meat-market-seller-intelligence",
    name: "Live Meat Market Seller Intelligence",
    category: "Intelligence",
    kind: "intelligence",
    status: "active",
    route: "/planet/okeechobee/meat-market/seller/intelligence/:slug",
    areas: ["Okeechobee Live Meat Market"],
    services: [
      "Seller storefront views",
      "Product click tracking",
      "Buyer handoff tracking",
      "Product attention rankings",
      "7-day and all-time activity",
    ],
    recommendation:
      "The private Intelligence dashboard included with a free Live Meat Market seller listing.",
    proof:
      "Verified on Production using the Farm Folks LLC seller dashboard and activity reports.",
    notes:
      "Private seller access required. :slug is a route placeholder, not a working seller link. Open Intelligence through the seller's authenticated dashboard. Never store or share seller access tokens in Atlas. Local route: http://localhost:5173/planet/okeechobee/meat-market/seller/intelligence/:slug. Live route: https://www.homeplanet.city/planet/okeechobee/meat-market/seller/intelligence/:slug.",
    favorite: true,
    replies: {
      facebook:
        "Live Meat Market sellers can view their private storefront activity through their seller dashboard.",
      messenger:
        "Open your private seller dashboard and select Open Seller Intelligence.",
      text:
        "Seller Intelligence is available through your private Live Meat Market seller dashboard.",
    },
  },
  {
    id: "only-essentials-intelligence",
    name: "Only The Essentials Intelligence",
    category: "Intelligence",
    kind: "system",
    status: "active",
    route: "/planet/only-the-essentials/intelligence",
    boardRoute: "/planet/only-the-essentials/live-activity",
    areas: ["Kaitlin's working system"],
    services: [
      "Customer behavior intelligence",
      "Request visibility",
      "Live activity",
      "Business decision support",
    ],
    recommendation:
      "The intelligence and live-activity layer underneath Only The Essentials Cleaning.",
    proof:
      "Both routes are active and connected to Kaitlin's working HomePlanet system.",
    notes:
      "Operational page. Use for reviewing engagement and live customer activity.",
    favorite: true,
    replies: {
      facebook:
        "This is the intelligence layer HomePlanet built underneath Only The Essentials Cleaning:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Here is the Only The Essentials Intelligence Dashboard:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Only The Essentials Intelligence: {link}",
    },
  },
  {
    id: "only-essentials-messages",
    name: "Only The Essentials Messages",
    category: "Internal Board",
    kind: "system",
    status: "active",
    route: "/planet/only-the-essentials/messages",
    areas: ["Kaitlin's message workflow"],
    services: [
      "Organized customer messages",
      "Request review",
      "Conversation visibility",
      "Follow-up workflow",
    ],
    recommendation:
      "The organized message doorway designed to prevent customer requests from becoming buried.",
    proof:
      "The messages route is active inside the Only The Essentials system.",
    notes:
      "Operational page for the business workflow.",
    replies: {
      facebook:
        "This is the organized message workflow underneath the Only The Essentials customer experience:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Here is the Only The Essentials message board:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Only The Essentials Messages: {link}",
    },
  },
  {
    id: "ridgeline-system",
    name: "Ridgeline Home Services System",
    category: "Demonstration",
    kind: "demo",
    status: "active",
    route: "/planet/ridgeline",
    boardRoute: "/planet/ridgeline/intelligence",
    areas: ["Working production-style demonstration"],
    services: [
      "Home-service request flow",
      "Customer intake",
      "Business intelligence",
      "Request management",
    ],
    recommendation:
      "A production-style home-services flow with a customer request page and intelligence underneath.",
    proof:
      "The Ridgeline public flow, request route, and Intelligence Dashboard are active.",
    notes:
      "The direct request page is available at /planet/ridgeline/request.",
    replies: {
      facebook:
        "Here is the Ridgeline working example showing a customer-facing home-services flow and intelligence underneath:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "This is the Ridgeline HomePlanet demonstration:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Ridgeline HomePlanet demo: {link}",
    },
  },  {
    id: "homeplanet-notepad-add-customer",
    name: "HomePlanet Notepad - Add Customer",
    category: "Internal Tool",
    kind: "system",
    status: "active",
    route: "/planet/notepad#add-customer",
    areas: ["Internal HomePlanet tool"],
    services: [
      "Add customer",
      "Quick customer capture",
      "Working notes",
      "Customer organization",
    ],
    recommendation:
      "A direct doorway into the HomePlanet Notepad customer-entry workflow.",
    proof:
      "The active route opens directly to the Add Customer section.",
    notes:
      "Internal working tool. Do not share publicly unless the recipient should access it.",
    favorite: true,
    replies: {
      facebook:
        "HomePlanet Notepad customer entry: {link}",
      messenger:
        "Here is the HomePlanet Add Customer doorway:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "HomePlanet Add Customer: {link}",
    },
  },
  {
    id: "homeplanet-transportation",
    name: "HomePlanet Transportation",
    category: "HomePlanet Systems",
    kind: "system",
    status: "active",
    route: "/planet/transportation",
    boardRoute: "/planet/transportation/request",
    areas: ["Transportation workflow"],
    services: [
      "Transportation Live Page",
      "Ride or transportation request",
      "Customer intake",
      "Request organization",
    ],
    recommendation:
      "A HomePlanet transportation system with a public doorway and connected request flow.",
    proof:
      "Both the main Transportation page and request route are active.",
    notes:
      "Open the main page for the public experience and the second doorway for the direct request flow.",
    favorite: true,
    replies: {
      facebook:
        "Here is the HomePlanet Transportation page and request doorway:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "HomePlanet Transportation can collect and organize the transportation request here:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "HomePlanet Transportation: {link}",
    },
  },
  {
    id: "only-essentials-impulse",
    name: "Only The Essentials Impulse",
    category: "Internal Tool",
    kind: "system",
    status: "active",
    route: "/planet/only-the-essentials/impulse",
    areas: ["Only The Essentials working system"],
    services: [
      "Impulse conversation",
      "Customer signal capture",
      "Guided interaction",
      "Workflow testing",
    ],
    recommendation:
      "A working Only The Essentials conversation and customer-signal experience.",
    proof:
      "The Impulse route is active inside Kaitlin's HomePlanet system.",
    notes:
      "Working system doorway rather than the primary public cleaning page.",
    replies: {
      facebook:
        "Only The Essentials Impulse experience: {link}",
      messenger:
        "Here is the Only The Essentials Impulse workflow:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Only The Essentials Impulse: {link}",
    },
  },
  {
    id: "taylor-creek-demo-staff",
    name: "Taylor Creek Demo - Staff",
    category: "Internal Tool",
    kind: "demo",
    status: "active",
    route: "/live/taylor-creek-demo/staff",
    areas: ["Staff-facing demonstration"],
    services: [
      "Staff workflow",
      "Internal operations",
      "Live service coordination",
      "Working demonstration",
    ],
    recommendation:
      "A staff-facing HomePlanet demonstration for coordinating live work behind the customer experience.",
    proof:
      "The Taylor Creek staff route is active on the production site.",
    notes:
      "Staff and demonstration doorway. It is not the primary public customer page.",
    replies: {
      facebook:
        "Taylor Creek staff demonstration: {link}",
      messenger:
        "Here is the Taylor Creek staff-side demonstration:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Taylor Creek Staff Demo: {link}",
    },
  },
  {
    id: "restaurant-awareness-live",
    name: "Restaurant Awareness - Live",
    category: "Restaurant System",
    kind: "system",
    status: "active",
    route: "/planet/restaurant-awareness/live",
    areas: ["Restaurant awareness system"],
    services: [
      "Live restaurant awareness",
      "Operational visibility",
      "Customer and staff signals",
      "Real-time workflow",
    ],
    recommendation:
      "The primary live doorway into the HomePlanet Restaurant Awareness system.",
    proof:
      "The live Restaurant Awareness route is active.",
    favorite: true,
    replies: {
      facebook:
        "Here is the live HomePlanet Restaurant Awareness system:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Restaurant Awareness live doorway:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Restaurant Awareness Live: {link}",
    },
  },
  {
    id: "restaurant-awareness-kitchen",
    name: "Restaurant Awareness - Kitchen",
    category: "Restaurant System",
    kind: "system",
    status: "active",
    route: "/planet/restaurant-awareness/kitchen",
    areas: ["Kitchen operations"],
    services: [
      "Kitchen awareness",
      "Order visibility",
      "Operational signals",
      "Team coordination",
    ],
    recommendation:
      "The kitchen-facing doorway inside the Restaurant Awareness system.",
    proof:
      "The kitchen route is active on the production site.",
    notes:
      "Operational restaurant doorway.",
    replies: {
      facebook:
        "Restaurant Awareness kitchen doorway: {link}",
      messenger:
        "Here is the kitchen side of Restaurant Awareness:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Restaurant Awareness Kitchen: {link}",
    },
  },
  {
    id: "restaurant-awareness-drinks",
    name: "Restaurant Awareness - Drinks",
    category: "Restaurant System",
    kind: "system",
    status: "active",
    route: "/planet/restaurant-awareness/drinks",
    areas: ["Drink and beverage operations"],
    services: [
      "Drink workflow",
      "Beverage visibility",
      "Operational signals",
      "Team coordination",
    ],
    recommendation:
      "The drinks-facing doorway inside the Restaurant Awareness system.",
    proof:
      "The drinks route is active on the production site.",
    notes:
      "Operational restaurant doorway.",
    replies: {
      facebook:
        "Restaurant Awareness drinks doorway: {link}",
      messenger:
        "Here is the drinks side of Restaurant Awareness:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Restaurant Awareness Drinks: {link}",
    },
  },
  {
    id: "restaurant-awareness-crew",
    name: "Restaurant Awareness - Crew",
    category: "Restaurant System",
    kind: "system",
    status: "active",
    route: "/planet/restaurant-awareness/crew",
    areas: ["Restaurant crew operations"],
    services: [
      "Crew awareness",
      "Staff coordination",
      "Operational communication",
      "Live workflow",
    ],
    recommendation:
      "The crew-facing doorway inside the Restaurant Awareness system.",
    proof:
      "The crew route is active on the production site.",
    notes:
      "Operational restaurant doorway.",
    replies: {
      facebook:
        "Restaurant Awareness crew doorway: {link}",
      messenger:
        "Here is the crew side of Restaurant Awareness:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Restaurant Awareness Crew: {link}",
    },
  },
  {
    id: "echols-water-testing",
    name: "Echols Water Testing",
    category: "Water Services",
    kind: "provider",
    status: "active",
    route: "/planet/echols-water-testing",
    areas: ["Water testing service"],
    services: [
      "Water testing",
      "Customer information",
      "Service request",
      "Direct service doorway",
    ],
    recommendation:
      "A working customer-facing page for Echols Water Testing.",
    proof:
      "The public Echols Water Testing route is active on the production site.",
    notes:
      "Use this page when someone needs water-testing information or service.",
    favorite: true,
    replies: {
      facebook:
        "Echols Water Testing has a direct page where you can review the service and take the next step:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Here is the Echols Water Testing page:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "Echols Water Testing: {link}",
    },
  },
  {
    id: "jme-rental-setup",
    name: "JME Rental Setup",
    category: "Internal Tool",
    kind: "system",
    status: "active",
    route: "/jme/rental-setup",
    areas: ["Jones Equipment working system"],
    services: [
      "Rental setup",
      "Equipment preparation",
      "Rental workflow",
      "Operator organization",
    ],
    recommendation:
      "The working rental-setup doorway underneath Jones Equipment Rental and Repair.",
    proof:
      "The JME rental setup route is active on the production site.",
    notes:
      "Operational doorway connected to the Jones Equipment system.",
    replies: {
      facebook:
        "JME Rental Setup: {link}",
      messenger:
        "Here is the Jones Equipment rental-setup doorway:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "JME Rental Setup: {link}",
    },
  },  {
    id: "pest-control-demo",
    name: "Okee Dokie Pest Control Demo",
    category: "Demonstration",
    kind: "demo",
    status: "active",
    route: "/planet/demo/pest-control",
    boardRoute: "/planet/demo/pest-control/board",
    areas: ["Demonstration only"],
    services: [
      "Customer-facing pest request",
      "Issue selection",
      "Estimate request",
      "Demo Live Board",
      "Customer workflow demonstration",
    ],
    recommendation:
      "A polished working example showing how a local pest-control company could collect requests and organize the work underneath.",
    proof:
      "Active HomePlanet demonstration with both a public page and connected board experience.",
    notes:
      "Demo contact information is not a real pest-control business. Use only to demonstrate the system.",
    favorite: true,
    replies: {
      facebook:
        "I built a working pest-control example showing how customers can select the issue, request service, and move into an organized workflow instead of getting buried in messages:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      messenger:
        "Here is the pest-control Live Page demonstration. It also has a connected working board underneath:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
      text:
        "HomePlanet pest-control demo: {link}",
    },
  },
];

const quickReplies = [
  {
    id: "send-working-page",
    label: "Send Working Page",
    category: "General",
    template:
      "Here is the working page where you can see everything and take the next step:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
  },
  {
    id: "provider-recommendation",
    label: "Recommend Provider",
    category: "Provider",
    template:
      "This local provider may be able to help. Their information and direct page are right here:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
  },
  {
    id: "send-live-page",
    label: "Send Live Page",
    category: "HomePlanet",
    template:
      "Here is the customer-facing Live Page. Everything is organized in one place so the request does not get buried:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
  },
  {
    id: "show-live-board",
    label: "Show Live Board",
    category: "HomePlanet",
    template:
      "This is the working Live Board underneath the customer page. It shows how the requests and work stay organized:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
  },
  {
    id: "how-to-help",
    label: "How To Help",
    category: "Community",
    template:
      "Thank you for wanting to help. The best place to start is right here:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
  },
  {
    id: "sponsor",
    label: "Sponsor This",
    category: "Community",
    template:
      "Thank you. You can see the need and help sponsor the difference directly from this page:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
  },
  {
    id: "request-received",
    label: "Request Received",
    category: "Follow-up",
    template:
      "Hi, this is Daniel with HomePlanet. We received your request and are reviewing the details now. We will follow up as soon as we can.",
  },
  {
    id: "checking-back",
    label: "Checking Back",
    category: "Follow-up",
    template:
      "Hi, this is Daniel checking back with you. I wanted to make sure you received the page and see whether you still need help.",
  },
  {
    id: "easy-next-step",
    label: "Easy Next Step",
    category: "General",
    template:
      "This makes the next step really easy:\n\n\u{1F447}\u{1F447}\u{1F447}\n\n{link}",
  },
];
const foundationLinks = [
  { label: "GreenBasket", path: "/planet/greenbasket" },
  { label: "WingIt", path: "/planet/wingit" },
  { label: "Delaney’s Gym", path: "/planet/delaneys-gym" },
  { label: "Garrett’s Laundromat", path: "/planet/garretts-laundromat" },
  { label: "Commons Coffee", path: "/planet/commons-coffee" },
  { label: "Community Pulse", path: "/planet/community-pulse" },
  { label: "Reasons To Show Up", path: "/planet/reasons-to-show-up" },
  { label: "Human Circulation", path: "/planet/human-circulation" },
  { label: "Awareness Layer", path: "/planet/awareness-layer" },
];

const categoryOptions = [
  "All",
  "Favorites",
  "Cleaning",
  "Air Conditioning",
  "Lawn & Property Care",
  "Well & Septic",
  "Well Drilling",
  "Equipment Rental & Repair",
  "HomePlanet Systems",
  "Community System",
  "Demonstration",
  "Unverified",
];

function displayPhone(phone?: string) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const PUBLIC_SITE_ORIGIN = "https://www.homeplanet.city";

function fullLink(route?: string) {
  if (!route) return "";
  if (/^https?:\/\//i.test(route)) return route;
  return `${PUBLIC_SITE_ORIGIN}${route}`;
}

function openLivePage(route?: string) {
  const liveUrl = fullLink(route);
  if (!liveUrl) return;
  window.location.assign(liveUrl);
}

function prepareReply(entry: AtlasEntry, type: keyof ReplySet) {
  return entry.replies[type]
    .replaceAll("{link}", fullLink(entry.route) || "Link not yet verified")
    .replaceAll("{phone}", displayPhone(entry.phone) || "Phone not yet verified");
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export default function EcosystemAtlasPage() {
  const [quickReplyLink, setQuickReplyLink] = useState(
    "https://www.homeplanet.city/planet/okeechobee"
  );
  const [quickReplyCopied, setQuickReplyCopied] = useState<string | null>(null);
  const [quickRepliesOpen, setQuickRepliesOpen] = useState(false);
  const [cardQuickReplyId, setCardQuickReplyId] = useState<string | null>(null);

  async function copyQuickReply(id: string, template: string) {
    const cleanLink = quickReplyLink.trim();
    const reply = template.includes("{link}")
      ? template.replaceAll("{link}", cleanLink || "PASTE LINK HERE")
      : template;

    await navigator.clipboard.writeText(reply);
    setQuickReplyCopied(id);

    window.setTimeout(() => {
      setQuickReplyCopied((current) => (current === id ? null : current));
    }, 1800);
  }

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("homeplanet-atlas-favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
        return;
      }

      setFavorites(entries.filter((entry) => entry.favorite).map((entry) => entry.id));
    } catch {
      setFavorites(entries.filter((entry) => entry.favorite).map((entry) => entry.id));
    }
  }, []);

  function updateFavorites(next: string[]) {
    setFavorites(next);
    window.localStorage.setItem("homeplanet-atlas-favorites", JSON.stringify(next));
  }

  function toggleFavorite(id: string) {
    updateFavorites(
      favorites.includes(id)
        ? favorites.filter((favoriteId) => favoriteId !== id)
        : [...favorites, id],
    );
  }

  async function handleCopy(label: string, value: string) {
    await copyText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesCategory =
        category === "All" ||
        (category === "Favorites" && favorites.includes(entry.id)) ||
        (category === "Unverified" && entry.status === "unverified") ||
        entry.category === category;

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const searchText = [
        entry.name,
        entry.category,
        entry.contact,
        entry.recommendation,
        entry.proof,
        entry.notes,
        ...entry.areas,
        ...entry.services,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchText.includes(normalizedQuery);
    });
  }, [category, favorites, query]);

  const trustedCount = entries.filter(
    (entry) => entry.status === "active" && entry.kind === "provider",
  ).length;

  const statusStyle = (entry: AtlasEntry) => {
    if (entry.status === "unverified") {
      return "border-amber-400/30 bg-amber-400/10 text-amber-200";
    }

    if (entry.kind === "demo") {
      return "border-sky-400/30 bg-sky-400/10 text-sky-200";
    }

    if (entry.kind === "system" || entry.kind === "intelligence") {
      return "border-lime-400/30 bg-lime-400/10 text-lime-200";
    }

    return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
  };

  const statusLabel = (entry: AtlasEntry) => {
    if (entry.status === "unverified") return "Unverified lead";
    if (entry.kind === "demo") return "Working demo";
    if (entry.kind === "system") return "HomePlanet system";
    if (entry.kind === "intelligence") return "Internal tool";
    if (entry.kind === "helper") return "Community helper";
    return "Trusted provider";
  };

  return (
    <div className="min-h-screen bg-[#020806] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <header className="rounded-[2rem] border border-lime-400/15 bg-gradient-to-br from-lime-400/[0.08] via-zinc-950 to-black p-5 shadow-[0_0_70px_rgba(132,204,22,0.08)] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-black uppercase tracking-[0.28em] text-lime-400">
              HomePlanet
            </div>

            <div className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-bold text-zinc-300">
              {trustedCount} trusted providers · {entries.length} Atlas entries
            </div>
          </div>

          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            Find the right local connection{" "}
            <span className="text-lime-400">in seconds.</span>
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            Search local providers, community helpers, HomePlanet systems, internal
            tools, and working demonstrations. Copy the link or the exact reply and
            keep moving.
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/50 p-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cleaner, septic, lawn, equipment, AC, person, company..."
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-4 text-base font-semibold text-white outline-none placeholder:text-zinc-600 focus:border-lime-400/50"
            />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {categoryOptions.map((option) => (
              <button
                key={option}
                onClick={() => setCategory(option)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
                  category === option
                    ? "border-lime-400 bg-lime-400 text-black"
                    : "border-white/10 bg-black/40 text-zinc-300 hover:border-white/25"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </header>

        <main className="mt-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>          <section className="mb-6 overflow-hidden rounded-3xl border border-lime-400/20 bg-zinc-950">
            <button
              type="button"
              onClick={() => setQuickRepliesOpen((current) => !current)}
              aria-expanded={quickRepliesOpen}
              className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
            >
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-lime-400">
                  Quick Replies
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-white">
                    Copy the reply. Keep moving.
                  </h2>

                  <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-black text-zinc-400">
                    {quickReplies.length} saved
                  </span>
                </div>
              </div>

              <span className="shrink-0 rounded-xl border border-lime-400/25 bg-lime-400/10 px-4 py-2 text-sm font-black text-lime-300">
                {quickRepliesOpen ? "Close Replies" : "Open Replies"}
              </span>
            </button>

            {quickRepliesOpen ? (
              <div className="border-t border-white/10 p-5 md:p-6">
                <p className="max-w-2xl text-sm leading-6 text-zinc-400">
                  Paste the page you are sending, then copy the exact response
                  you need. The fingers point down toward the link.
                </p>

                <label className="mt-5 block">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                    Link to include
                  </span>

                  <input
                    value={quickReplyLink}
                    onChange={(event) => setQuickReplyLink(event.target.value)}
                    placeholder="https://www.homeplanet.city/..."
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-lime-400/60"
                  />
                </label>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {quickReplies.map((reply) => (
                    <article
                      key={reply.id}
                      className="rounded-2xl border border-white/10 bg-black/40 p-4"
                    >
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">
                        {reply.category}
                      </div>

                      <h3 className="mt-1 text-base font-black text-white">
                        {reply.label}
                      </h3>

                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-400">
                        {reply.template
                          .replaceAll(
                            "\\u{1F447}",
                            String.fromCodePoint(0x1f447)
                          )
                          .replaceAll(
                            "{link}",
                            quickReplyLink.trim() || "PASTE LINK HERE"
                          )}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          copyQuickReply(reply.id, reply.template)
                        }
                        className="mt-4 w-full rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-3 text-sm font-black text-lime-300 transition hover:bg-lime-400/20"
                      >
                        {quickReplyCopied === reply.id
                          ? "Copied"
                          : "Copy Reply"}
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
<div className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
                Working directory
              </div>
              <h2 className="mt-2 text-2xl font-black">
                {category === "All" ? "Everything useful" : category}
              </h2>
            </div>

            <div className="text-sm font-bold text-zinc-500">
              {filteredEntries.length} found
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
              <div className="text-xl font-black">No Atlas match yet.</div>
              <p className="mt-2 text-zinc-400">
                Try another service, company, person, or category.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredEntries.map((entry) => {
                const expanded = expandedId === entry.id;
                const quickReplyOpen = cardQuickReplyId === entry.id;
                const link = fullLink(entry.route);

                return (
                  <article
                    key={entry.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-[0_18px_50px_rgba(0,0,0,0.25)]"
                  >
                    <div className="p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${statusStyle(entry)}`}
                            >
                              {statusLabel(entry)}
                            </span>

                            <span className="text-xs font-bold text-zinc-500">
                              {entry.category}
                            </span>
                          </div>

                          <h3 className="mt-3 text-2xl font-black leading-tight">
                            {entry.name}
                          </h3>

                          {entry.contact ? (
                            <p className="mt-1 text-sm font-semibold text-zinc-400">
                              {entry.contact}
                            </p>
                          ) : null}
                        </div>

                        <button
                          onClick={() => toggleFavorite(entry.id)}
                          aria-label={
                            favorites.includes(entry.id)
                              ? `Remove ${entry.name} from favorites`
                              : `Add ${entry.name} to favorites`
                          }
                          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border text-xl transition ${
                            favorites.includes(entry.id)
                              ? "border-lime-400/40 bg-lime-400/15 text-lime-300"
                              : "border-white/10 bg-black/40 text-zinc-600"
                          }`}
                        >
                          ★
                        </button>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-zinc-300">
                        {entry.recommendation}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.services.slice(0, 4).map((service) => (
                          <span
                            key={service}
                            className="rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-bold text-zinc-400"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      {entry.phone ? (
                        <a
                          href={`tel:${entry.phone}`}
                          className="mt-4 block text-lg font-black text-lime-400"
                        >
                          {displayPhone(entry.phone)}
                        </a>
                      ) : null}

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        {entry.route ? (
                          <>
{import.meta.env.DEV ? (
                            <button
                              onClick={() => window.location.assign(`http://localhost:5173${entry.route!}`)}
                              className="rounded-xl border border-lime-400/25 bg-lime-400/10 px-3 py-3 text-sm font-black text-lime-300 transition hover:border-lime-400/50"
                            >
                              Open Local
                            </button>
                            ) : null}

                            <button
                              onClick={() => openLivePage(entry.route)}
                              className="rounded-xl bg-lime-400 px-3 py-3 text-sm font-black text-black transition hover:bg-lime-300"
                            >
                              Open Live
                            </button>

                            <button
                              onClick={() =>
                                handleCopy(`${entry.id}-link`, link)
                              }
                              className="rounded-xl border border-white/10 bg-black/50 px-3 py-3 text-sm font-black text-white transition hover:border-lime-400/40"
                            >
                              {copied === `${entry.id}-link`
                                ? "Live Link Copied"
                                : "Copy Live Link"}
                            </button>
                          </>
                        ) : entry.phone ? (
                          <>
                            <a
                              href={`tel:${entry.phone}`}
                              className="rounded-xl bg-lime-400 px-3 py-3 text-center text-sm font-black text-black transition hover:bg-lime-300"
                            >
                              Call Now
                            </a>

                            <a
                              href={`sms:${entry.phone}`}
                              className="rounded-xl border border-white/10 bg-black/50 px-3 py-3 text-center text-sm font-black text-white transition hover:border-lime-400/40"
                            >
                              Text
                            </a>
                          </>
                        ) : (
                          <button
                            disabled
                            className="rounded-xl bg-zinc-800 px-3 py-3 text-sm font-black text-zinc-500"
                          >
                            Details Pending
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setCardQuickReplyId(
                              quickReplyOpen ? null : entry.id
                            )
                          }
                          aria-expanded={quickReplyOpen}
                          className="rounded-xl border border-lime-400/25 bg-lime-400/10 px-3 py-3 text-sm font-black text-lime-300 transition hover:bg-lime-400/20"
                        >
                          {quickReplyOpen
                            ? "Close Replies"
                            : "Quick Reply"}
                        </button>

                        <button
                          onClick={() =>
                            setExpandedId(expanded ? null : entry.id)
                          }
                          className="rounded-xl border border-white/10 bg-black/50 px-3 py-3 text-sm font-black text-zinc-300 transition hover:border-white/25"
                        >
                          {expanded ? "Hide Details" : "More Details"}
                        </button>                    </div>

                    </div>


                    {quickReplyOpen ? (
                      <div className="border-t border-lime-400/15 bg-lime-400/[0.035] p-5 md:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-black uppercase tracking-[0.18em] text-lime-400">
                              Quick Reply
                            </div>

                            <div className="mt-1 text-sm font-bold text-zinc-300">
                              {entry.name}
                            </div>
                          </div>

                          <div
                            className="text-xl"
                            aria-label="Fingers pointing toward the included link"
                          >
                            {"\u{1F447}\u{1F447}\u{1F447}"}
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3">
                          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                            <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                              Facebook
                            </div>

                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-300">
                              {prepareReply(entry, "facebook")}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  `${entry.id}-facebook-card`,
                                  prepareReply(entry, "facebook")
                                )
                              }
                              className="mt-3 w-full rounded-xl border border-lime-400/25 bg-lime-400/10 px-3 py-3 text-sm font-black text-lime-300"
                            >
                              {copied === `${entry.id}-facebook-card`
                                ? "Facebook Reply Copied"
                                : "Copy Facebook Reply"}
                            </button>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                            <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                              Messenger
                            </div>

                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-300">
                              {prepareReply(entry, "messenger")}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  `${entry.id}-messenger-card`,
                                  prepareReply(entry, "messenger")
                                )
                              }
                              className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm font-black text-white"
                            >
                              {copied === `${entry.id}-messenger-card`
                                ? "Messenger Reply Copied"
                                : "Copy Messenger Reply"}
                            </button>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                            <div className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
                              Text Message
                            </div>

                            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-300">
                              {prepareReply(entry, "text")}
                            </p>

                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  `${entry.id}-text-card`,
                                  prepareReply(entry, "text")
                                )
                              }
                              className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm font-black text-white"
                            >
                              {copied === `${entry.id}-text-card`
                                ? "Text Reply Copied"
                                : "Copy Text Reply"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {expanded ? (
                      <div className="border-t border-white/10 bg-black/35 p-5 md:p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <div className="text-xs font-black uppercase tracking-[0.16em] text-lime-400">
                              Why this is here
                            </div>
                            <p className="mt-2 text-sm leading-6 text-zinc-300">
                              {entry.proof}
                            </p>
                          </div>

                          <div>
                            <div className="text-xs font-black uppercase tracking-[0.16em] text-lime-400">
                              Areas served
                            </div>
                            <p className="mt-2 text-sm leading-6 text-zinc-300">
                              {entry.areas.join(" · ")}
                            </p>
                          </div>
                        </div>

                        {entry.notes ? (
                          <div className="mt-4 rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] p-4">
                            <div className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">
                              Internal notes
                            </div>
                            <p className="mt-2 text-sm leading-6 text-zinc-300">
                              {entry.notes}
                            </p>
                          </div>
                        ) : null}

                        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                          <button
                            onClick={() =>
                              handleCopy(
                                `${entry.id}-facebook-detail`,
                                prepareReply(entry, "facebook"),
                              )
                            }
                            className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm font-black"
                          >
                            Copy Facebook
                          </button>

                          <button
                            onClick={() =>
                              handleCopy(
                                `${entry.id}-messenger`,
                                prepareReply(entry, "messenger"),
                              )
                            }
                            className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm font-black"
                          >
                            Copy Messenger
                          </button>

                          <button
                            onClick={() =>
                              handleCopy(
                                `${entry.id}-text`,
                                prepareReply(entry, "text"),
                              )
                            }
                            className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-sm font-black"
                          >
                            Copy Text
                          </button>
                        </div>

                        {entry.boardRoute ? (
                          <button
                            onClick={() => navigate(entry.boardRoute!)}
                            className="mt-3 w-full rounded-xl border border-sky-400/25 bg-sky-400/10 px-3 py-3 text-sm font-black text-sky-200"
                          >
                            Open Connected Board
                          </button>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}

          <section className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-5 md:p-6">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
              Preserved from the original Atlas
            </div>
            <h2 className="mt-2 text-2xl font-black">
              HomePlanet Foundation & Concepts
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              The working directory now comes first, but the ecosystem identity,
              philosophy, and awareness pages remain available here.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {foundationLinks.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-left text-sm font-black text-zinc-300 transition hover:border-lime-400/30 hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}