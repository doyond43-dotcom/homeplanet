import React, { useMemo, useState } from "react";

type Snapshot = {
  id: string;
  capturedAt: string; // ISO
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AnchorTestScreen() {
  const name = "AnchorTest";
  const oneLiner =
    "Anchor lets you create a verifiable snapshot of a moment—time-stamped, preserved, and uneditable.";

  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  const status = useMemo(() => {
    if (!snapshot) return { label: "Idle", detail: "Ready when you are." };
    return {
      label: "Captured",
      detail: `Captured at ${formatTime(snapshot.capturedAt)} (read-only)`,
    };
  }, [snapshot]);

  function handleCreateSnapshot() {
    if (snapshot) return;

    const capturedAt = new Date().toISOString();
    const c = (globalThis as any)?.crypto;
    const id =
      (c?.randomUUID?.() as string | undefined) ??
      `snap_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    setSnapshot({ id, capturedAt });
  }

  function handleNewSession() {
    setSnapshot(null);
  }

  return (
    <div style={styles.wrap}>
      {/* Single calm surface (Write-a-Book vibe) */}
      <div style={styles.surface}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>{name}</h1>
            <div style={{ height: 10 }} />
            <p style={styles.subtitle}>{oneLiner}</p>
          </div>

          <span style={styles.badge}>{status.label}</span>
        </div>

        <div style={{ height: 18 }} />

        {/* ONE section (no nested box stacks) */}
        <div style={styles.section}>
          <div style={styles.kicker}>Status</div>
          <div style={{ height: 8 }} />
          <div style={styles.status}>{status.detail}</div>

          <div style={{ height: 18 }} />

          <button
            onClick={handleCreateSnapshot}
            disabled={!!snapshot}
            style={{
              ...styles.primaryBtn,
              opacity: snapshot ? 0.55 : 1,
              cursor: snapshot ? "not-allowed" : "pointer",
            }}
          >
            Create Snapshot
          </button>

          <div style={{ height: 14 }} />

          <div style={styles.metaRow}>
            <span style={styles.hint}>
              {snapshot
                ? "This snapshot is locked. Start a new session to create another."
                : "One tap creates a time-stamped record."}
            </span>

            <button
              onClick={handleNewSession}
              style={{
                ...styles.linkBtn,
                visibility: snapshot ? "visible" : "hidden",
              }}
            >
              New session
            </button>
          </div>
        </div>

        {snapshot && (
          <>
            <div style={{ height: 18 }} />
            <pre style={styles.readout}>
{`Snapshot
- id: ${snapshot.id}
- capturedAt: ${snapshot.capturedAt}`}
            </pre>
          </>
        )}

        <div style={{ height: 18 }} />

        <div style={styles.footerLine}>
          You are not shipping yet. You are building clarity.
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  // Outer wrapper so the HomePlanet page can breathe too
  wrap: {
    width: "100%",
    padding: "28px 16px", // forces page-level breathing even if parent is tight
    boxSizing: "border-box",
  },

  // The single main surface
  surface: {
    width: "min(760px, 100%)",
    margin: "0 auto",
    padding: 32, // BIG, obvious
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)",
    boxShadow: "0 18px 70px rgba(0,0,0,0.40)",
    boxSizing: "border-box",
  },

  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 18,
  },

  title: {
    margin: 0,
    fontSize: 30,
    letterSpacing: 0.2,
  },

  subtitle: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.65,
    color: "rgba(255,255,255,0.72)",
    maxWidth: 560,
  },

  badge: {
    fontSize: 12,
    padding: "7px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.86)",
    whiteSpace: "nowrap",
    marginTop: 4,
  },

  // One simple section (the “calm card”)
  section: {
    padding: 22, // BIG, obvious
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxSizing: "border-box",
  },

  kicker: {
    fontSize: 12,
    color: "rgba(255,255,255,0.62)",
  },

  status: {
    fontSize: 16,
    color: "rgba(255,255,255,0.92)",
  },

  primaryBtn: {
    width: "100%",
    padding: "16px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    fontWeight: 600,
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  hint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.62)",
  },

  linkBtn: {
    padding: "7px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "transparent",
    color: "rgba(255,255,255,0.82)",
    cursor: "pointer",
    fontSize: 12,
  },

  readout: {
    margin: 0,
    padding: 16,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    color: "rgba(255,255,255,0.86)",
    fontSize: 12,
    overflowX: "auto",
  },

  footerLine: {
    fontSize: 12,
    textAlign: "center",
    color: "rgba(255,255,255,0.45)",
  },
};
