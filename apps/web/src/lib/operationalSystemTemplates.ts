export type OperationalSystemType =
  | "home-services"
  | "auto-service"
  | "creative-orders"
  | "cleaning"
  | "generic";

export type OperationalStage = {
  id: string;
  label: string;
  description: string;
};

export type OperationalSystemTemplate = {
  type: OperationalSystemType;
  label: string;
  customerFrontDoor: boolean;
  liveBoard: boolean;
  staffBoard: boolean;
  requestFlow: boolean;
  jobDrawer: boolean;
  messages: boolean;
  scheduling: boolean;
  photoProof: boolean;
  paymentQr: boolean;
  proofTimeline: boolean;
  stages: OperationalStage[];
};

export function getOperationalSystemTemplate(businessType?: string): OperationalSystemTemplate {
  const raw = (businessType || "").toLowerCase();

  if (
    raw.includes("home") ||
    raw.includes("service") ||
    raw.includes("clean") ||
    raw.includes("wash") ||
    raw.includes("pressure") ||
    raw.includes("lawn") ||
    raw.includes("pool") ||
    raw.includes("roof")
  ) {
    return {
      type: "home-services",
      label: "Home Services Live System",
      customerFrontDoor: true,
      liveBoard: true,
      staffBoard: true,
      requestFlow: true,
      jobDrawer: true,
      messages: true,
      scheduling: true,
      photoProof: true,
      paymentQr: true,
      proofTimeline: true,
      stages: [
        { id: "new-request", label: "New Request", description: "Customer request received." },
        { id: "quote-review", label: "Quote Review", description: "Photos, address, and service details being reviewed." },
        { id: "waiting-approval", label: "Waiting Approval", description: "Estimate sent and waiting on customer approval." },
        { id: "scheduled", label: "Scheduled", description: "Job date and time confirmed." },
        { id: "in-progress", label: "In Progress", description: "Work is actively being completed." },
        { id: "photo-proof", label: "Photo Proof", description: "Before and after proof attached." },
        { id: "payment-due", label: "Payment Due", description: "Payment QR or invoice ready." },
        { id: "complete", label: "Complete", description: "Job finished, paid, and timestamped." }
      ]
    };
  }

  return {
    type: "generic",
    label: "HomePlanet Live System",
    customerFrontDoor: true,
    liveBoard: true,
    staffBoard: true,
    requestFlow: true,
    jobDrawer: true,
    messages: true,
    scheduling: true,
    photoProof: true,
    paymentQr: true,
    proofTimeline: true,
    stages: [
      { id: "new-request", label: "New Request", description: "New customer or project request received." },
      { id: "review", label: "Review", description: "Details are being reviewed." },
      { id: "approved", label: "Approved", description: "Work has been approved." },
      { id: "in-progress", label: "In Progress", description: "Work is active." },
      { id: "proof", label: "Proof Added", description: "Photos, notes, or proof attached." },
      { id: "payment", label: "Payment", description: "Payment or invoice ready." },
      { id: "complete", label: "Complete", description: "Work completed and timestamped." }
    ]
  };
}
