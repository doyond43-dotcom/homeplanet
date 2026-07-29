export type CowTownPlanId =
  | "homestead"
  | "small-herd"
  | "working-ranch"
  | "large-ranch"
  | "ranch-pro"
  | "enterprise";

export type CowTownProductId =
  | "full-tag"
  | "sticker-upgrade";

export type CowTownPlan = {
  id: CowTownPlanId;
  name: string;
  animalLimit: number | null;
  monthlyPrice: number | null;
  description: string;
};

export type CowTownProduct = {
  id: CowTownProductId;
  name: string;
  unitPrice: number;
  description: string;
};

export const cowTownPlans: CowTownPlan[] = [
  {
    id: "homestead",
    name: "Homestead",
    animalLimit: 25,
    monthlyPrice: 9.99,
    description: "For small properties, family herds, and livestock owners getting started.",
  },
  {
    id: "small-herd",
    name: "Small Herd",
    animalLimit: 100,
    monthlyPrice: 19.99,
    description: "For growing herds that need recovery pages and organized animal records.",
  },
  {
    id: "working-ranch",
    name: "Working Ranch",
    animalLimit: 300,
    monthlyPrice: 39.99,
    description: "For active ranch operations managing multiple groups, pastures, or batches.",
  },
  {
    id: "large-ranch",
    name: "Large Ranch",
    animalLimit: 750,
    monthlyPrice: 69.99,
    description: "For larger operations needing serious bulk control and herd organization.",
  },
  {
    id: "ranch-pro",
    name: "Ranch Pro",
    animalLimit: 1500,
    monthlyPrice: 99.99,
    description: "For high-volume ranches managing hundreds or more active animals.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    animalLimit: null,
    monthlyPrice: null,
    description: "Custom capacity, onboarding, imports, and support for very large operations.",
  },
];

export const cowTownProducts: CowTownProduct[] = [
  {
    id: "full-tag",
    name: "Full Cow Town Tag",
    unitPrice: 14.99,
    description:
      "Oversized livestock ear tag with visible number, serialized QR code, Cow Town ID, and activated recovery page.",
  },
  {
    id: "sticker-upgrade",
    name: "Cow Town Sticker Upgrade",
    unitPrice: 7.99,
    description:
      "Durable serialized QR upgrade for an existing numbered livestock ear tag.",
  },
];

export const cowTownShipping = {
  flatRate: 5.95,
  freeThreshold: 100,
};

export function formatCowTownMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
