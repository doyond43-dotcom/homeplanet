export type ActivationPillar = "business" | "restaurant" | "community" | "pages";

function normalize(value = "") {
  return value.toLowerCase().trim();
}

export function modulesForActivation(pillar: ActivationPillar, input = "") {
  const type = normalize(input);

  if (pillar === "restaurant") {
    return [
      "Table QR help requests",
      "Server board",
      "Kitchen notification board",
      "Owner live view",
      "Active table sessions",
      "Food/service request flow",
      "Customer comments",
      "Service timeline",
    ];
  }

  if (pillar === "community") {
    return [
      "Needs & offers",
      "Volunteer requests",
      "Local help posts",
      "Community events",
      "Student/helper participation",
      "Claimed help tracking",
      "Completion proof",
      "Community live view",
    ];
  }

  if (pillar === "pages") {
    return [
      "Premium local business page",
      "Service cards",
      "Visual landing section",
      "Contact buttons",
      "Lead request flow",
      "Before/after proof",
      "Reviews or trust section",
      "Simple public presence",
    ];
  }

  if (type.includes("restaurant") || type.includes("food") || type.includes("bar") || type.includes("grill") || type.includes("cafe") || type.includes("coffee")) {
    return modulesForActivation("restaurant", input);
  }

  if (type.includes("community") || type.includes("church") || type.includes("school") || type.includes("nonprofit") || type.includes("volunteer")) {
    return modulesForActivation("community", input);
  }

  if (type.includes("page") || type.includes("landing") || type.includes("website") || type.includes("presence")) {
    return modulesForActivation("pages", input);
  }

  if (type.includes("pressure") || type.includes("wash") || type.includes("clean") || type.includes("paint") || type.includes("landscap") || type.includes("lawn")) {
    return [
      "Customer request intake",
      "Job dispatch",
      "Crew routing",
      "Before & after photos",
      "Completion proof",
      "Payment links",
      "Customer updates",
      "Owner live view",
    ];
  }

  if (type.includes("hvac") || type.includes("electric") || type.includes("plumb") || type.includes("repair") || type.includes("handyman")) {
    return [
      "Repair request intake",
      "Diagnosis stage",
      "Estimate approval",
      "Technician dispatch",
      "Job notes",
      "Payment links",
      "Customer updates",
      "Owner live view",
    ];
  }

  return [
    "Customer request intake",
    "Job dispatch",
    "Live workflow stages",
    "Completion proof",
    "Payment links",
    "Customer updates",
    "Owner live view",
    "Business timeline",
  ];
}
