export type ModifierSeverity =
  | "none"
  | "light"
  | "moderate"
  | "heavy";

export interface EstimateModifier {
  id: string;
  name: string;
  category: string;
  operationalNote?: string;

  impacts: {
    light: {
      minutes: number;
      price: number;
    };
    moderate: {
      minutes: number;
      price: number;
    };
    heavy: {
      minutes: number;
      price: number;
    };
  };
}

export const HOME_SERVICE_MODIFIERS: EstimateModifier[] = [
  {
    id: "heavy-insect-casing-removal",
    name: "Heavy Insect Casing Removal",
    category: "Exterior Cleaning",
    operationalNote: "Bring Soffit Swiper",
    impacts: {
      light: { minutes: 10, price: 15 },
      moderate: { minutes: 25, price: 40 },
      heavy: { minutes: 45, price: 75 },
    },
  },
  {
    id: "spider-web-density",
    name: "Spider Web Density",
    category: "Exterior Cleaning",
    impacts: {
      light: { minutes: 5, price: 10 },
      moderate: { minutes: 15, price: 25 },
      heavy: { minutes: 30, price: 50 },
    },
  },
  {
    id: "oxidation-level",
    name: "Oxidation Level",
    category: "Exterior Cleaning",
    impacts: {
      light: { minutes: 10, price: 20 },
      moderate: { minutes: 30, price: 50 },
      heavy: { minutes: 60, price: 100 },
    },
  },
  {
    id: "rust-stains",
    name: "Rust Stains",
    category: "Exterior Cleaning",
    impacts: {
      light: { minutes: 10, price: 20 },
      moderate: { minutes: 20, price: 40 },
      heavy: { minutes: 45, price: 80 },
    },
  },
  {
    id: "heavy-mildew",
    name: "Heavy Mildew",
    category: "Exterior Cleaning",
    impacts: {
      light: { minutes: 15, price: 25 },
      moderate: { minutes: 30, price: 50 },
      heavy: { minutes: 60, price: 100 },
    },
  },
];
