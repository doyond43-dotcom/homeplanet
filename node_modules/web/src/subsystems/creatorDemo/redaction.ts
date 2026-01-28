import type { CreatorDemoConfig } from "./types";

export function maskValue(v: string, on: boolean) {
  if (!on) return v;
  if (!v) return v;
  return "••••••";
}

export function bucketAmount(v: string) {
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  if (!isFinite(n)) return v;
  if (n < 100) return "<$100";
  if (n <= 250) return "$100–$250";
  if (n <= 500) return "$250–$500";
  return ">$500";
}

export function redactSample(
  cfg: CreatorDemoConfig,
  sample: { customer: string; employee: string; amount: string; phone: string; notes: string }
) {
  const maskedCustomer = maskValue(sample.customer, cfg.maskCustomers);
  const maskedEmployee = maskValue(sample.employee, cfg.maskEmployees);

  const amount = cfg.maskAmounts ? bucketAmount(sample.amount) : sample.amount;

  // Always mask phone in demo unless preset is off
  const phone = cfg.preset === "off" ? sample.phone : "•••-•••-••••";

  // Notes are suppressed in safe_public
  const notes = cfg.preset === "safe_public" ? "Hidden in public demo mode" : sample.notes;

  return { ...sample, customer: maskedCustomer, employee: maskedEmployee, amount, phone, notes };
}
