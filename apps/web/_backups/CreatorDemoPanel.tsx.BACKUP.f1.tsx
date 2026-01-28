import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { CSSProperties } from "react";
import type { CreatorDemoConfig, DemoOverlayEvent, RedactionPreset } from "./types";
import { redactSample } from "./redaction";
import { subscribeDemoOverlay } from "./bus";

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

export default function CreatorDemoPanel() {
  const [cfg, setCfg] = useState<CreatorDemoConfig>(defaultCfg);

  const [events, setEvents] = useState<DemoOverlayEvent[]>([
    { id: makeId(), ts: Date.now(), kind: "presence_timestamp", label: "Presence Timestamp Recorded" },
    { id: makeId(), ts: Date.now(), kind: "payment_cap_authorized", label: "Payment Cap Authorized — $250" },
  ]);

  // 🔥 Listen for overlay events from ANY resident (BaysFlow, Payments, etc.)
  useEffect(() => {
    return subscribeDemoOverlay((evt) => {
      setEvents((prev) => [evt, ...prev].slice(0, 12));
    });
  }, []);

  const sample = useMemo(() => {
    return redactSample(cfg, {
      customer: "Jane Doe",
      employee: "Tech Mike",
      amount: "$248.00",
      phone: "555-123-9876",
      notes: "Rear brakes + rotor replacement. Customer waiting.",
    });
  }, [cfg]);

  function push(kind: DemoOverlayEvent["kind"], label: string) {
    // local-only buttons (still useful for demo)
    const evt: DemoOverlayEvent = { id: makeId(), ts: Date.now(), kind, label };
    setEvents((prev) => [evt, ...prev].slice(0, 12));
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Creator Demo Mode</div>
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
          <div style={{ fontSize: 12, opacity: 0.7 }}>Live provenance overlays (preview)</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>tap buttons to generate</div>
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
                <span style={{ fontSize: 11, opacity: 0.7, minWidth: 80 }}>{fmt(e.ts)}</span>
                <span style={{ fontSize: 12 }}>{e.label}</span>
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
      <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
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
const card: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.35)",
  padding: 14,
  color: "#fff",
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
