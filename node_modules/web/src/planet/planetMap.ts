export type City = {
  id: string;
  label: string;
};

export type Planet = {
  id: string;
  label: string;
  subtitle?: string;
  cities: City[];
};

export type CoreLink = {
  id: string;
  label: string;
  to: string;
};

export const CORE_LINKS: CoreLink[] = [
  { id: "core", label: "HomePlanet Core", to: "/" },
  { id: "doctrine", label: "Doctrine", to: "/core/doctrine" },
  { id: "binder", label: "Binder Map", to: "/core/binder" },
];

export const PLANETS: Planet[] = [
  {
    id: "creator",
    label: "Creator",
    subtitle: "Build • Remix • Demo • Commerce",
    cities: [
      { id: "projects", label: "Projects" },
      { id: "demos", label: "Demos" },
      { id: "commerce", label: "Commerce" },
    ],
  },
  {
    id: "career",
    label: "Career",
    subtitle: "Timeline • Evidence • Reputation",
    cities: [
      { id: "timeline", label: "Timeline" },
      { id: "evidence", label: "Evidence" },
      { id: "reputation", label: "Reputation" },
    ],
  },
  {
    id: "vehicles",
    label: "Vehicles",
    subtitle: "Intake • Service • Disputes",
    cities: [
      { id: "intake", label: "Intake" },
      { id: "service-history", label: "Service History" },
      { id: "disputes", label: "Disputes" },
    ],
  },
  {
    id: "education",
    label: "Education",
    subtitle: "Presence • Submissions • Reviews",
    cities: [
      { id: "submissions", label: "Submissions" },
      { id: "reviews", label: "Reviews" },
      { id: "attendance", label: "Attendance" },
    ],
  },
  {
    id: "safety",
    label: "Safety & Identity",
    subtitle: "Age Anchor • Shield Events",
    cities: [
      { id: "age-anchor", label: "Age Anchor" },
      { id: "shield-events", label: "Shield Events" },
      { id: "trusted-circle", label: "Trusted Circle" },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    subtitle: "Pre-Auth • Caps • Proof",
    cities: [
      { id: "preauth", label: "Pre-Auth Caps" },
      { id: "disputes", label: "Dispute Proof" },
      { id: "ledger", label: "Ledger" },
    ],
  },
];

export const TELEMETRY_LENS = {
  id: "witness",
  label: "Witness Mode",
  subtitle: "Telemetry Lens (UI toggle)",
};
