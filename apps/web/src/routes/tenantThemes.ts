export type TenantTheme = {
  slug: string;
  brandName: string;
  locationLine: string;
  planetLabel: string; // the "planet" badge text
  tierLabel?: string;
  phoneLabel?: string;
  addressLabel?: string;
  // Accent tokens (keep simple; Tailwind classes)
  accentRingClass: string;
  accentBorderClass: string;
  accentTextClass: string;
  accentBgClass: string;
};

export const TENANT_THEMES: Record<string, TenantTheme> = {
  "taylor-creek": {
    slug: "taylor-creek",
    brandName: "Taylor Creek Auto Repair",
    locationLine: "Okeechobee, Florida",
    planetLabel: "Planet: Auto Services",
    tierLabel: "Gold Tier • Verified",
    phoneLabel: "(000) 000-0000",
    addressLabel: "Okeechobee, FL",
    // Taylor Creek identity: black/red accents (subtle)
    accentRingClass: "focus-visible:ring-red-500/40",
    accentBorderClass: "border-red-500/20",
    accentTextClass: "text-red-200",
    accentBgClass: "bg-red-500/10",
  },
};

export function getTenantTheme(slug: string | undefined | null) {
  if (!slug) return null;
  return TENANT_THEMES[slug] ?? null;
}
