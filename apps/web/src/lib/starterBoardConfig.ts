export type StarterBoardFieldLabels = {
  item: string;
  concern: string;
  advisor: string;
  eta: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  stage: string;
};

export type StarterBoardActionConfig = {
  updateTitle: string;
  updateSubtitle: string;
  approvalTitle: string;
  approvalSubtitle: string;
  appointmentTitle: string;
  appointmentSubtitle: string;
  completionTitle: string;
  completionSubtitle: string;
};

export type StarterBoardConfig = {
  key: string;
  familyLabel: string;
  boardSubtitle: string;
  createButtonLabel: string;
  flowLabel: string;
  stages: string[];
  labels: StarterBoardFieldLabels;
  actions: StarterBoardActionConfig;
};

type ConfigInput = {
  businessType?: string;
  businessName?: string;
  primaryGoal?: string;
};

const baseLabels: StarterBoardFieldLabels = {
  item: "Vehicle",
  concern: "Customer Concern",
  advisor: "Advisor / Desk",
  eta: "ETA",
  phone: "Customer Phone",
  appointmentDate: "Appointment Date",
  appointmentTime: "Appointment Time",
  notes: "Notes",
  stage: "Stage",
};

const autoRepairGeneral: StarterBoardConfig = {
  key: "auto-repair-general",
  familyLabel: "Auto Repair Demo",
  boardSubtitle:
    "Built for service advisors, technician visibility, customer trust, and real-time repair flow.",
  createButtonLabel: "+ Add Repair Order",
  flowLabel: "Intake → Diagnose → Approve → Complete",
  stages: [
    "New Intake",
    "Diagnosing",
    "Waiting Approval",
    "In Bay",
    "Ready for Pickup",
  ],
  labels: {
    ...baseLabels,
    item: "Vehicle",
    concern: "Customer Concern",
    advisor: "Advisor / Desk",
  },
  actions: {
    updateTitle: "Status update",
    updateSubtitle: "General update to the customer",
    approvalTitle: "Approval request",
    approvalSubtitle: "Ask customer to approve the next repair step",
    appointmentTitle: "Appointment confirmation",
    appointmentSubtitle: "Confirm date and time with the customer",
    completionTitle: "Ready-for-pickup message",
    completionSubtitle: "Let the customer know the vehicle is ready",
  },
};

const diagnosticsShop: StarterBoardConfig = {
  key: "auto-repair-diagnostics",
  familyLabel: "Diagnostics Shop Demo",
  boardSubtitle:
    "Built for findings-first shops that need clear diagnosis, approval flow, and communication.",
  createButtonLabel: "+ Add Diagnostic Ticket",
  flowLabel: "Intake → Diagnosing → Findings Ready → Waiting Approval → Repairing",
  stages: [
    "New Intake",
    "Diagnosing",
    "Findings Ready",
    "Waiting Approval",
    "Repairing",
    "Ready for Pickup",
  ],
  labels: {
    ...baseLabels,
    item: "Vehicle",
    concern: "Reported Issue",
    advisor: "Service Writer",
  },
  actions: {
    updateTitle: "Diagnostic update",
    updateSubtitle: "Share current findings and status",
    approvalTitle: "Findings approval",
    approvalSubtitle: "Ask the customer to approve recommended work",
    appointmentTitle: "Diagnostic appointment",
    appointmentSubtitle: "Confirm diagnostic appointment details",
    completionTitle: "Repair completed",
    completionSubtitle: "Let the customer know the work is done",
  },
};

const quickServiceShop: StarterBoardConfig = {
  key: "auto-repair-quick-service",
  familyLabel: "Quick Service Demo",
  boardSubtitle:
    "Built for faster turn work like oil changes, batteries, and quick service lanes.",
  createButtonLabel: "+ Add Quick Service Ticket",
  flowLabel: "Drive-In → In Service → Finishing Up → Ready",
  stages: ["Drive-In", "In Service", "Finishing Up", "Ready"],
  labels: {
    ...baseLabels,
    item: "Vehicle",
    concern: "Requested Service",
    advisor: "Front Counter",
  },
  actions: {
    updateTitle: "Service update",
    updateSubtitle: "Let the customer know the current quick-service status",
    approvalTitle: "Additional service request",
    approvalSubtitle: "Ask about an extra recommended service",
    appointmentTitle: "Service confirmation",
    appointmentSubtitle: "Confirm date and time for the visit",
    completionTitle: "Service complete",
    completionSubtitle: "Let the customer know the vehicle is ready",
  },
};

const tireShop: StarterBoardConfig = {
  key: "auto-repair-tire",
  familyLabel: "Tire & Alignment Demo",
  boardSubtitle:
    "Built for tire, wheel, and alignment shops that need a simple high-clarity workflow.",
  createButtonLabel: "+ Add Tire Service Ticket",
  flowLabel: "Check-In → Tire Selection → Mount & Balance → Alignment → Ready",
  stages: [
    "Check-In",
    "Tire Selection",
    "Mount & Balance",
    "Alignment",
    "Ready for Pickup",
  ],
  labels: {
    ...baseLabels,
    item: "Vehicle",
    concern: "Tire / Alignment Need",
    advisor: "Service Desk",
  },
  actions: {
    updateTitle: "Service update",
    updateSubtitle: "Send tire or alignment progress update",
    approvalTitle: "Tire approval request",
    approvalSubtitle: "Ask customer to approve tire / alignment recommendation",
    appointmentTitle: "Service appointment",
    appointmentSubtitle: "Confirm tire or alignment appointment",
    completionTitle: "Tire service complete",
    completionSubtitle: "Let the customer know the vehicle is ready",
  },
};

const screenCompany: StarterBoardConfig = {
  key: "home-services-screen",
  familyLabel: "Screen Company Demo",
  boardSubtitle:
    "Built for screen, enclosure, patio, and rescreen businesses with field-to-install flow.",
  createButtonLabel: "+ Add Screen Job",
  flowLabel: "New Lead → Measure Scheduled → Quote Sent → Install Scheduled → Done",
  stages: [
    "New Lead",
    "Measure Scheduled",
    "Quote Sent",
    "Material Ordered",
    "Install Scheduled",
    "Done",
  ],
  labels: {
    item: "Property / Job",
    concern: "Service Need",
    advisor: "Estimator / Coordinator",
    eta: "Install / Visit Time",
    phone: "Customer Phone",
    appointmentDate: "Visit Date",
    appointmentTime: "Visit Time",
    notes: "Job Notes",
    stage: "Stage",
  },
  actions: {
    updateTitle: "Project update",
    updateSubtitle: "Share current project status",
    approvalTitle: "Quote follow-up",
    approvalSubtitle: "Ask customer to approve the quote or next step",
    appointmentTitle: "Measure / install confirmation",
    appointmentSubtitle: "Confirm date and time for the visit",
    completionTitle: "Project completed",
    completionSubtitle: "Let the customer know the job is finished",
  },
};

const awningCompany: StarterBoardConfig = {
  key: "home-services-awning",
  familyLabel: "Awning Company Demo",
  boardSubtitle:
    "Built for awning, shade, and exterior install businesses with estimate-to-install flow.",
  createButtonLabel: "+ Add Awning Project",
  flowLabel: "New Lead → Site Visit → Quote Sent → Materials → Install",
  stages: [
    "New Lead",
    "Site Visit Scheduled",
    "Quote Sent",
    "Material Ordered",
    "Install Scheduled",
    "Done",
  ],
  labels: {
    item: "Property / Project",
    concern: "Requested Work",
    advisor: "Estimator / Coordinator",
    eta: "Install / Visit Time",
    phone: "Customer Phone",
    appointmentDate: "Visit Date",
    appointmentTime: "Visit Time",
    notes: "Project Notes",
    stage: "Stage",
  },
  actions: {
    updateTitle: "Project update",
    updateSubtitle: "Send project status to the customer",
    approvalTitle: "Quote approval request",
    approvalSubtitle: "Ask customer to approve the awning proposal",
    appointmentTitle: "Visit confirmation",
    appointmentSubtitle: "Confirm site visit or install timing",
    completionTitle: "Install completed",
    completionSubtitle: "Let the customer know the install is done",
  },
};

const curbPaintingCompany: StarterBoardConfig = {
  key: "home-services-curb-painting",
  familyLabel: "Curb Painting Demo",
  boardSubtitle:
    "Built for curb painting, address refresh, and route-based field service work with simple request-to-completion flow.",
  createButtonLabel: "+ Add Address Job",
  flowLabel: "New Request → Scheduled → On Route → Completed → Needs Follow-Up",
  stages: [
    "New Request",
    "Scheduled",
    "On Route",
    "Completed",
    "Needs Follow-Up",
  ],
  labels: {
    item: "Address / Property",
    concern: "Requested Service",
    advisor: "Crew / Operator",
    eta: "Route ETA",
    phone: "Customer Phone",
    appointmentDate: "Service Date",
    appointmentTime: "Service Window",
    notes: "Service Notes",
    stage: "Stage",
  },
  actions: {
    updateTitle: "Route update",
    updateSubtitle: "Send a live service update to the customer",
    approvalTitle: "Service confirmation",
    approvalSubtitle: "Confirm requested curb or address work",
    appointmentTitle: "Route confirmation",
    appointmentSubtitle: "Confirm service date and time window",
    completionTitle: "Service completed",
    completionSubtitle: "Let the customer know the curb work is done",
  },
};

const lawnRouteCompany: StarterBoardConfig = {
  key: "home-services-lawn-route",
  familyLabel: "Route Service Demo",
  boardSubtitle:
    "Built for lawn, route, and recurring field service businesses that need route visibility and customer-ready status.",
  createButtonLabel: "+ Add Route Stop",
  flowLabel: "New Request → Scheduled → On Route → Servicing → Completed",
  stages: [
    "New Request",
    "Scheduled",
    "On Route",
    "Servicing",
    "Completed",
  ],
  labels: {
    item: "Address / Property",
    concern: "Requested Service",
    advisor: "Crew / Operator",
    eta: "Route ETA",
    phone: "Customer Phone",
    appointmentDate: "Service Date",
    appointmentTime: "Service Window",
    notes: "Service Notes",
    stage: "Stage",
  },
  actions: {
    updateTitle: "Route update",
    updateSubtitle: "Let the customer know where their service stands",
    approvalTitle: "Service follow-up",
    approvalSubtitle: "Confirm work scope or extra service request",
    appointmentTitle: "Route confirmation",
    appointmentSubtitle: "Confirm service timing",
    completionTitle: "Service completed",
    completionSubtitle: "Let the customer know the stop is complete",
  },
};

const detailingCompany: StarterBoardConfig = {
  key: "home-services-detailing",
  familyLabel: "Detailing Demo",
  boardSubtitle:
    "Built for mobile detailing and vehicle care businesses with request-to-service flow instead of repair-shop language.",
  createButtonLabel: "+ Add Detail Job",
  flowLabel: "New Request → Scheduled → In Service → Finishing Up → Completed",
  stages: [
    "New Request",
    "Scheduled",
    "In Service",
    "Finishing Up",
    "Completed",
  ],
  labels: {
    item: "Vehicle / Service",
    concern: "Requested Service",
    advisor: "Detailer / Operator",
    eta: "Service ETA",
    phone: "Customer Phone",
    appointmentDate: "Service Date",
    appointmentTime: "Arrival Window",
    notes: "Service Notes",
    stage: "Stage",
  },
  actions: {
    updateTitle: "Service update",
    updateSubtitle: "Send a detailing progress update",
    approvalTitle: "Add-on approval",
    approvalSubtitle: "Confirm any add-on detailing service",
    appointmentTitle: "Detail appointment",
    appointmentSubtitle: "Confirm service date and arrival window",
    completionTitle: "Detail completed",
    completionSubtitle: "Let the customer know the detailing job is done",
  },
};

const restaurantConfig: StarterBoardConfig = {
  key: "restaurant-rush",
  familyLabel: "Restaurant Rush Demo",
  boardSubtitle:
    "Built for fast-moving kitchens with live ticket flow, station awareness, and expo control.",
  createButtonLabel: "+ Add Ticket",
  flowLabel: "New Ticket → On Grill → Plating → Ready → Completed",
  stages: ["New Ticket", "On Grill", "Plating", "Ready", "Completed"],
  labels: {
    item: "Order / Table",
    concern: "Items Ordered",
    advisor: "Server",
    eta: "Ticket Time",
    phone: "Customer Phone",
    appointmentDate: "Pickup Time",
    appointmentTime: "Ready Time",
    notes: "Kitchen Notes",
    stage: "Stage",
  },
  actions: {
    updateTitle: "Kitchen update",
    updateSubtitle: "Update on ticket progress",
    approvalTitle: "Order check",
    approvalSubtitle: "Confirm or adjust items",
    appointmentTitle: "Pickup timing",
    appointmentSubtitle: "Confirm pickup or ready timing",
    completionTitle: "Order ready",
    completionSubtitle: "Notify that order is ready",
  },
};

function normalize(value?: string) {
  return (value || "").toLowerCase();
}

export function resolveStarterBoardConfig(
  input: ConfigInput,
): StarterBoardConfig {
  const businessType = normalize(input.businessType);
  const businessName = normalize(input.businessName);
  const primaryGoal = normalize(input.primaryGoal);
  const haystack = `${businessType} ${businessName} ${primaryGoal}`;

  if (
    haystack.includes("curb") ||
    haystack.includes("address painting") ||
    haystack.includes("curb painting") ||
    haystack.includes("house number") ||
    haystack.includes("address refresh")
  ) {
    return curbPaintingCompany;
  }

  if (
    haystack.includes("detail") ||
    haystack.includes("detailing") ||
    haystack.includes("car wash") ||
    haystack.includes("mobile wash")
  ) {
    return detailingCompany;
  }

  if (
    haystack.includes("lawn") ||
    haystack.includes("landscap") ||
    haystack.includes("route service") ||
    haystack.includes("trash pickup") ||
    haystack.includes("junk pickup") ||
    haystack.includes("pressure washing")
  ) {
    return lawnRouteCompany;
  }

  if (
    haystack.includes("screen") ||
    haystack.includes("rescreen") ||
    haystack.includes("lanai") ||
    haystack.includes("patio enclosure")
  ) {
    return screenCompany;
  }

  if (
    haystack.includes("awning") ||
    haystack.includes("shade") ||
    haystack.includes("canopy")
  ) {
    return awningCompany;
  }

  if (
    haystack.includes("diagnostic") ||
    haystack.includes("diagnostics") ||
    haystack.includes("check engine") ||
    haystack.includes("findings")
  ) {
    return diagnosticsShop;
  }

  if (
    haystack.includes("oil change") ||
    haystack.includes("quick service") ||
    haystack.includes("battery") ||
    haystack.includes("fast lube") ||
    haystack.includes("express service")
  ) {
    return quickServiceShop;
  }

  if (
    haystack.includes("tire") ||
    haystack.includes("alignment") ||
    haystack.includes("wheel")
  ) {
    return tireShop;
  }

  if (
    haystack.includes("restaurant") ||
    haystack.includes("kitchen") ||
    haystack.includes("food") ||
    haystack.includes("diner")
  ) {
    return restaurantConfig;
  }

  return autoRepairGeneral;
}