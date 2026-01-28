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
    | "dispute_log_generated"
    // Bays / BayCam (live emitted from /bays)
    | "bay_job_started"
    | "bay_phase_change"
    | "bay_snapshot"
    | "bay_clip";
  label: string;
  meta?: Record<string, any>;
};
