// HomePlanet Live Board Template System
// One engine → many business types

export type JobStatus = "scheduled" | "in-progress" | "done";

// 🔒 Lock known system types (prevents chaos later)
export type TemplateType =
  | "cleaning"
  | "auto"
  | "beauty"
  | "lawn"
  | "general";

export type LiveBoardTemplate = {
  slug: string;
  businessName: string;
  type: TemplateType;

  phone: string;
  serviceArea: string;

  columns: Array<{
    key: JobStatus;
    label: string;
  }>;

  payment: {
    cashApp?: string;
    zelle?: string;
  };

  branding: {
    primary: string; // tailwind color hint
    accent: string;
  };

  sampleJobs: Array<{
    client: string;
    service: string;
    time: string;
    location: string;
    notes: string;
    status: JobStatus;
    paid: boolean;
  }>;
};

// 🔥 TEMPLATE REGISTRY
export const LIVE_BOARD_TEMPLATES: Record<string, LiveBoardTemplate> = {
  "only-the-essentials": {
    slug: "only-the-essentials",
    businessName: "Only The Essentials Cleaning LLC",
    type: "cleaning",

    phone: "863-801-3179",
    serviceArea: "Okeechobee & surrounding areas",

    columns: [
      { key: "scheduled", label: "Scheduled" },
      { key: "in-progress", label: "Active" },
      { key: "done", label: "Done" },
    ],

    payment: {
      cashApp: "$OnlyTheEssentials",
      zelle: "863-801-3179",
    },

    branding: {
      primary: "pink",
      accent: "cyan",
    },

    sampleJobs: [
      {
        client: "Mrs. Johnson",
        service: "Residential Cleaning",
        time: "9:00 AM",
        location: "Taylor Creek",
        notes: "Dog inside, friendly. Focus kitchen and floors.",
        status: "scheduled",
        paid: false,
      },
      {
        client: "Lakeview Airbnb",
        service: "Move-Out Clean",
        time: "11:30 AM",
        location: "Lakeview Estates",
        notes: "Key under mat. Bathrooms + fridge priority.",
        status: "scheduled",
        paid: false,
      },
      {
        client: "Martinez Family",
        service: "Deep Clean",
        time: "2:00 PM",
        location: "Okeechobee Blvd",
        notes: "Extra attention to baseboards.",
        status: "scheduled",
        paid: false,
      },
      {
        client: "Mr. Daniels",
        service: "Exterior Cleaning",
        time: "8:15 AM",
        location: "Riverside Dr",
        notes: "Patio + driveway rinse.",
        status: "in-progress",
        paid: false,
      },
      {
        client: "Sarah K.",
        service: "Residential Cleaning",
        time: "7:45 AM",
        location: "Okeechobee",
        notes: "Morning job complete.",
        status: "done",
        paid: true,
      },
    ],
  },
};

// 🔍 HELPER: safe lookup (prevents bugs)
export function getLiveBoardTemplate(slug: string): LiveBoardTemplate | null {
  if (!slug) return null;

  const normalized = slug.toLowerCase().trim();

  return LIVE_BOARD_TEMPLATES[normalized] || null;
}