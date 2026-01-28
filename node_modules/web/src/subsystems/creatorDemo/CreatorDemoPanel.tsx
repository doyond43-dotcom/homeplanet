import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { CSSProperties } from "react";
import type { CreatorDemoConfig, DemoOverlayEvent, RedactionPreset } from "./types";
import { redactSample } from "./redaction";

function makeId(prefix = "evt") {
  const c: any = typeof globalThis !== "undefined" ? (globalThis as any).crypto : undefined;
  return c?.randomUUID?.() ?? `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function fmt(ts: number) {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return String(ts);
  }
}

const defaultCfg: CreatorDemoConfig = {
  enabled: true,
  preset: "safe_public",
  maskCustomers: true,
  maskEmployees: true,
  maskAmounts: true,
  delaySeconds: 0,
};

type OverlayIn = Omit<DemoOverlayEvent, "id"> & { id?: string };

function railColor(kind: DemoOverlayEvent["kind"]) {
  // F1-style telemetry rails
  switch (kind) {
    case "presence_timestamp":
    case "bay_job_started":
      return "rgba(90,160,255,0.95)"; // blue
    case "payment_cap_authorized":
      return "rgba(120,255,170,0.95)"; // green
    case "part_added":
      return "rgba(255,200,90,0.95)"; // amber
    case "export_packet_updated":
      return "rgba(200,140,255,0.95)"; // purple
    case "dispute_log_generated":
      return "rgba(255,95,95,0.95)"; // red
    case "handle_detected":
    case "stitch_applied":
      return "rgba(255,255,255,0.75)"; // neutral
    case "bay_phase_change":
      return "rgba(120,255,170,0.95)"; // green-ish
    case "bay_snapshot":
      return "rgba(255,200,90,0.95)"; // amber
    case "bay_clip":
      return "rgba(200,140,255,0.95)"; // purple
    default:
      return "rgba(255,255,255,0.5)";
  }
}

export default function CreatorDemoPanel() {
  const [cfg, setCfg] = useState<CreatorDemoConfig>(defaultCfg);

  const [events, setEvents] = useState<DemoOverlayEvent[]>([
    { id: makeId(), ts: Date.now(), kind: "presence_timestamp", label: "Presence Timestamp Recorded" },
    { id: makeId(), ts: Date.now(), kind: "payment_cap_authorized", label: "Payment Cap Authorized — $250" },
  ]);

  const sample = useMemo(() => {
    return redactSample(cfg, {
      customer: "Jane Doe",
      employee: "Tech Mike",
      amount: "$248.00",
      phone: "555-123-9876",
      notes: "Rear brakes + rotor replacement. Customer waiting.",
    });
  }, [cfg]);

  function push(kind: DemoOverlayEvent["kind"], label: string, meta?: Record<string, any>) {
    const evt: DemoOverlayEvent = { id: makeId(), ts: Date.now(), kind, label, meta };
    setEvents((prev) => [evt, ...prev].slice(0, 10));
  }

  // Live listen from /bays
  useEffect(() => {
    const onWindow = (ev: any) => {
      const detail: OverlayIn | undefined = ev?.detail;
      if (!detail) return;
      push(detail.kind as any, detail.label, detail.meta);
    };

    window.addEventListener("hp_demo_overlay", onWindow as any);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("hp_demo_overlay");
      bc.onmessage = (msg) => {
        const d: OverlayIn | undefined = msg?.data;
        if (!d) return;
        push(d.kind as any, d.label, d.meta);
      };
    } catch {
      // ignore if unsupported
    }

    return () => {
      window.removeEventListener("hp_demo_overlay", onWindow as any);
      try {
        bc?.close();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.2 }}>Creator Demo Mode</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Overlay + redaction preview. Does not change business logic.
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
            <span style={{ opacity: 0.8 }}>Enabled</span>
            <input
              type="checkbox"
              checked={cfg.enabled}
              onChange={(e) => setCfg((p) => ({ ...p, enabled: e.target.checked }))}
            />
          </label>
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          <Row label="Redaction preset">
            <select
              value={cfg.preset}
              onChange={(e) => setCfg((p) => ({ ...p, preset: e.target.value as RedactionPreset }))}
              style={select}
            >
              <option value="safe_public">safe_public</option>
              <option value="internal">internal</option>
              <option value="off">off</option>
            </select>
          </Row>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ChipToggle label="Mask customers" on={cfg.maskCustomers} setOn={(on) => setCfg((p) => ({ ...p, maskCustomers: on }))} />
            <ChipToggle label="Mask employees" on={cfg.maskEmployees} setOn={(on) => setCfg((p) => ({ ...p, maskEmployees: on }))} />
            <ChipToggle label="Mask amounts" on={cfg.maskAmounts} setOn={(on) => setCfg((p) => ({ ...p, maskAmounts: on }))} />
          </div>

          <Row label="Delay (sec)">
            <input
              value={String(cfg.delaySeconds)}
              onChange={(e) => setCfg((p) => ({ ...p, delaySeconds: Math.max(0, Number(e.target.value || 0)) }))}
              style={input}
              placeholder="0"
            />
          </Row>
        </div>
      </div>

      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Live provenance overlays</div>
          <div style={{ fontSize: 12, opacity: 0.6, fontFamily: mono }}>
            listening: <span style={{ opacity: 0.85 }}>hp_demo_overlay</span>
          </div>
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={btnGhost} onClick={() => push("handle_detected", "Handle Detected → Claim Cluster")}>Handle</button>
          <button style={btnGhost} onClick={() => push("stitch_applied", "Paragraph Auto-stitched")}>Stitch</button>
          <button style={btnGhost} onClick={() => push("part_added", "Part Added — $87")}>Part</button>
          <button style={btnGhost} onClick={() => push("export_packet_updated", "Export Packet Updated")}>Export</button>
          <button style={btnGhost} onClick={() => push("dispute_log_generated", "Dispute Log Generated")}>Dispute</button>
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          {cfg.enabled ? (
            events.map((e) => (
              <div key={e.id} style={overlayRow}>
                <span style={{ ...rail, background: railColor(e.kind) }} />
                <span style={{ ...ts, minWidth: 88 }}>{fmt(e.ts)}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{e.label}</span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: 12, opacity: 0.6 }}>Demo Mode is off.</div>
          )}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Redaction preview</div>
        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          <KV k="Customer" v={sample.customer} />
          <KV k="Employee" v={sample.employee} />
          <KV k="Amount" v={sample.amount} />
          <KV k="Phone" v={sample.phone} />
          <KV k="Notes" v={sample.notes} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      {children}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div style={kvRow}>
      <div style={{ fontSize: 12, opacity: 0.65 }}>{k}</div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{v}</div>
    </div>
  );
}

function ChipToggle({ label, on, setOn }: { label: string; on: boolean; setOn: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      style={{
        padding: "7px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.16)",
        background: on ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
        color: "#fff",
        cursor: "pointer",
        fontSize: 12,
        opacity: on ? 1 : 0.85,
      }}
      title="Toggle"
    >
      {label}
    </button>
  );
}

/* styles */
const mono = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

const card: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.35)",
  padding: 14,
  color: "#fff",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset, 0 18px 50px rgba(0,0,0,0.45)",
};

const overlayRow: CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  padding: "10px 10px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
};

const rail: CSSProperties = {
  width: 3,
  height: 20,
  borderRadius: 999,
  boxShadow: "0 0 14px rgba(255,255,255,0.12)",
};

const ts: CSSProperties = {
  fontSize: 11,
  opacity: 0.75,
  fontFamily: mono,
  letterSpacing: 0.35,
};

const kvRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 10px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
};

const input: CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  padding: "8px 10px",
};

const select: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(0,0,0,0.35)",
  color: "#fff",
};

const btnGhost: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
  opacity: 0.9,
};
