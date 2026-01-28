export type RedactionPreset = "safe_public" | "internal" | "off";

export type CreatorDemoConfig = {
  enabled: boolean;
  preset: RedactionPreset;
  maskCustomers: boolean;
  maskEmployees: boolean;
  maskAmounts: boolean;
  delaySeconds: number; // 0, 30, 60 etc.
};

export type DemoOverlayEvent = {
  id: string;
  ts: number;
  kind:
    | "presence_timestamp"
    | "handle_detected"
    | "stitch_applied"
    | "payment_cap_authorized"
    | "part_added"
    | "export_packet_updated"
    | "dispute_log_generated";
  label: string;
  meta?: Record<string, any>;
};
