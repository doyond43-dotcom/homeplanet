import { useMemo, useState, type CSSProperties, type FormEvent } from "react";

type ArtStage =
  | "Order Received"
  | "Printed"
  | "Sprayed / Sealed"
  | "Framed / Wrapped"
  | "Packed / Shipped";

type ArtOrder = {
  id: string;
  customer: string;
  title: string;
  size: string;
  pieces: string;
  note: string;
  stage: ArtStage;
  createdAt: string;
  updatedAt: string;
};

const STAGES: ArtStage[] = [
  "Order Received",
  "Printed",
  "Sprayed / Sealed",
  "Framed / Wrapped",
  "Packed / Shipped",
];

const STATION_TARGETS: Array<{ key: string; label: string; targetStage: ArtStage }> = [
  { key: "print", label: "Print complete", targetStage: "Printed" },
  { key: "spray", label: "Spray complete", targetStage: "Sprayed / Sealed" },
  { key: "frame", label: "Frame / wrap complete", targetStage: "Framed / Wrapped" },
  { key: "pack", label: "Packed / shipped", targetStage: "Packed / Shipped" },
];

const STARTER_ORDERS: ArtOrder[] = [
  {
    id: "order-ocean-five-panel",
    customer: "Monster Order #RT-10482",
    title: "Five-piece ocean acrylic set",
    size: "60 x 32",
    pieces: "5-piece",
    note: "Acrylic panels printed upstairs. Needs clean inspection before boxing.",
    stage: "Printed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order-family-canvas",
    customer: "Etsy Order #ET-2291",
    title: "Custom family canvas",
    size: "40 x 32",
    pieces: "1-piece",
    note: "Canvas needs clear spray, frame wrap, and corner check before packaging.",
    stage: "Sprayed / Sealed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "order-city-triptych",
    customer: "Web Order #WEB-7813",
    title: "City skyline triptych",
    size: "48 x 24",
    pieces: "3-piece",
    note: "Frames already cut. Ready for stretch and staple.",
    stage: "Framed / Wrapped",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function uid(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readOrders(): ArtOrder[] {
  if (typeof window === "undefined") return STARTER_ORDERS;

  try {
    const raw = window.localStorage.getItem("hp-demo:art-production:orders");
    if (!raw) return STARTER_ORDERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : STARTER_ORDERS;
  } catch {
    return STARTER_ORDERS;
  }
}

function saveOrders(orders: ArtOrder[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem("hp-demo:art-production:orders", JSON.stringify(orders));
  } catch {}
}

function QRCodeImg({ value, size = 72 }: { value: string; size?: number }) {
  const src =
    "https://api.qrserver.com/v1/create-qr-code/?size=" +
    `${size}x${size}` +
    "&data=" +
    encodeURIComponent(value);

  return (
    <img
      src={src}
      width={size}
      height={size}
      style={{ borderRadius: 10, display: "block" }}
      alt="Order QR code"
    />
  );
}

function scanValueForOrder(order: ArtOrder) {
  return `HP_ART_ORDER:${order.id}`;
}

function parseScannedOrderId(value: string) {
  const clean = value.trim();
  if (!clean) return "";

  if (clean.includes("HP_ART_ORDER:")) {
    return clean.split("HP_ART_ORDER:").pop()?.trim() || "";
  }

  return clean;
}

async function copyText(value: string, label = "Copied.") {
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
    alert(label);
  } catch {
    alert(value);
  }
}

export default function ArtProductionBoard() {
  const [orders, setOrders] = useState<ArtOrder[]>(() => readOrders());
  const [showAdd, setShowAdd] = useState(false);
  const [showStationScan, setShowStationScan] = useState(false);
  const [stationKey, setStationKey] = useState("print");
  const [scanInput, setScanInput] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [customer, setCustomer] = useState("");
  const [title, setTitle] = useState("");
  const [size, setSize] = useState("");
  const [pieces, setPieces] = useState("");
  const [note, setNote] = useState("");

  const activeOrders = orders.filter((order) => order.stage !== "Packed / Shipped");
  const completedOrders = orders.filter((order) => order.stage === "Packed / Shipped");
  const selectedStation = STATION_TARGETS.find((station) => station.key === stationKey) ?? STATION_TARGETS[0];

  function commit(nextOrders: ArtOrder[]) {
    setOrders(nextOrders);
    saveOrders(nextOrders);
  }

  function addOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanCustomer = customer.trim();
    const cleanTitle = title.trim();
    const cleanSize = size.trim();
    const cleanPieces = pieces.trim();
    const cleanNote = note.trim();

    if (!cleanCustomer && !cleanTitle && !cleanNote) return;

    const now = new Date().toISOString();

    const order: ArtOrder = {
      id: uid("art-order"),
      customer: cleanCustomer || "New order",
      title: cleanTitle || "Artwork order",
      size: cleanSize || "Size not listed",
      pieces: cleanPieces || "Pieces not listed",
      note: cleanNote,
      stage: "Order Received",
      createdAt: now,
      updatedAt: now,
    };

    commit([order, ...orders]);
    setCustomer("");
    setTitle("");
    setSize("");
    setPieces("");
    setNote("");
    setShowAdd(false);
  }

  function moveOrder(orderId: string, stage: ArtStage) {
    commit(
      orders.map((order) =>
        order.id === orderId ? { ...order, stage, updatedAt: new Date().toISOString() } : order,
      ),
    );
  }

  function removeOrder(orderId: string) {
    commit(orders.filter((order) => order.id !== orderId));
  }

  function scanOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const orderId = parseScannedOrderId(scanInput);
    const found = orders.find((order) => order.id === orderId);

    if (!found) {
      setScanMessage("Order not found. Scan the order QR or paste the scan ID.");
      return;
    }

    const now = new Date().toISOString();
    const nextOrders = orders.map((order) =>
      order.id === found.id
        ? {
            ...order,
            stage: selectedStation.targetStage,
            updatedAt: now,
          }
        : order,
    );

    commit(nextOrders);
    setScanMessage(`${found.title} moved to ${selectedStation.targetStage}.`);
    setScanInput("");
  }

  function resetDemo() {
    commit(STARTER_ORDERS);
    setScanMessage("");
  }

  const stageCounts = useMemo(() => {
    return STAGES.reduce<Record<ArtStage, number>>((acc, stage) => {
      acc[stage] = orders.filter((order) => order.stage === stage).length;
      return acc;
    }, {} as Record<ArtStage, number>);
  }, [orders]);

  return (
    <div style={wrap}>
      <div style={shell}>
        <section style={hero}>
          <div>
            <span style={pill}>Art Production Live Board</span>
            <h1 style={h1}>Ready to Hang Art Flow</h1>
            <div style={subhead}>
              Print upstairs. Spray clear. Build frames. Stretch. Pack. Ship.
            </div>
          </div>

          <button
            type="button"
            style={primaryCircle}
            onClick={() => {
              setShowAdd((current) => !current);
              setShowStationScan(false);
            }}
          >
            {showAdd ? "Close" : "+ Add Order"}
          </button>
        </section>

        <section style={statsGrid}>
          <StatCard label="Active Orders" value={String(activeOrders.length)} />
          <StatCard label="Completed" value={String(completedOrders.length)} />
          <StatCard label="Stage Flow" value="5 steps" />
          <StatCard label="Proof Style" value="Production truth" />
        </section>

        {showAdd ? (
          <section style={{ ...card, border: "1px solid rgba(112,242,163,0.28)" }}>
            <div style={eyebrow}>New art order</div>
            <div style={smallMuted}>
              Adds directly into Order Received. Keep it light: order source, art title, size, pieces, and notes.
            </div>

            <form onSubmit={addOrder} style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <div style={formGrid}>
                <input
                  style={input}
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                  placeholder="Order source / customer"
                />
                <input
                  style={input}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Artwork title / order"
                />
                <input
                  style={input}
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                  placeholder="Size, ex: 40 x 32"
                />
                <input
                  style={input}
                  value={pieces}
                  onChange={(event) => setPieces(event.target.value)}
                  placeholder="Pieces, ex: 5-piece"
                />
              </div>

              <textarea
                style={textarea}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Production note, issue, packaging instruction, or quality check..."
              />

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button type="submit" style={primaryButton}>
                  Add to Order Received
                </button>
                <button type="button" style={button} onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {showStationScan ? (
          <section style={{ ...card, border: "1px solid rgba(103,232,249,0.26)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={eyebrow}>Station Scan Mode</div>
                <div style={smallMuted}>
                  Pick the station, scan the completed order, and the board moves it forward automatically.
                </div>
              </div>

              <button type="button" style={button} onClick={() => setShowStationScan(false)}>
                Close Scanner
              </button>
            </div>

            <form onSubmit={scanOrder} style={{ display: "grid", gap: 10, marginTop: 14 }}>
              <div style={formGrid}>
                <select
                  style={input}
                  value={stationKey}
                  onChange={(event) => {
                    setStationKey(event.target.value);
                    setScanMessage("");
                  }}
                >
                  {STATION_TARGETS.map((station) => (
                    <option key={station.key} value={station.key}>
                      {station.label} → {station.targetStage}
                    </option>
                  ))}
                </select>

                <input
                  style={input}
                  value={scanInput}
                  onChange={(event) => setScanInput(event.target.value)}
                  placeholder="Scan order QR or paste scan ID"
                  autoFocus
                />
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <button type="submit" style={primaryButton}>
                  Complete + Move Forward
                </button>

                <div style={{ color: "#70f2a3", fontSize: 12, fontWeight: 900, letterSpacing: 0.3 }}>
                  Scan when complete → move forward
                </div>
              </div>

              {scanMessage ? (
                <div style={{ color: scanMessage.includes("not found") ? "#fecaca" : "#bbf7d0", fontSize: 12, fontWeight: 900 }}>
                  {scanMessage}
                </div>
              ) : null}
            </form>
          </section>
        ) : null}

        <section style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={eyebrow}>Production floor</div>
              <div style={smallMuted}>
                One card per order. Move it as the artwork travels through print, spray, frame, wrap, pack, and ship.
              </div>
              <div style={{ marginTop: 4, color: "#70f2a3", fontSize: 12, fontWeight: 900, letterSpacing: 0.3 }}>
                Scan when complete → move forward
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                style={primaryButton}
                onClick={() => {
                  setShowStationScan((current) => !current);
                  setShowAdd(false);
                }}
              >
                Station Scan Mode
              </button>
              <button type="button" style={button} onClick={resetDemo}>
                Reset Demo Orders
              </button>
            </div>
          </div>

          <div style={boardGrid}>
            {STAGES.map((stage) => {
              const stageOrders = orders.filter((order) => order.stage === stage);

              return (
                <div key={stage} style={stageCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                    <div style={{ fontWeight: 950 }}>{stage}</div>
                    <div style={countBadge}>{stageCounts[stage]}</div>
                  </div>

                  {stageOrders.length === 0 ? <div style={emptyBox}>No orders here yet.</div> : null}

                  {stageOrders.map((order) => {
                    const scanId = scanValueForOrder(order);

                    return (
                      <div key={order.id} style={orderCard}>
                        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 10, alignItems: "start" }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: "#bae6fd", fontWeight: 950 }}>
                              {order.customer}
                            </div>
                            <div style={{ marginTop: 5, fontSize: 15, fontWeight: 950 }}>
                              {order.title}
                            </div>

                            <div style={detailGrid}>
                              <span>{order.size}</span>
                              <span>{order.pieces}</span>
                            </div>
                          </div>

                          <div style={{ background: "white", padding: 6, borderRadius: 12 }}>
                            <QRCodeImg value={scanId} size={58} />
                          </div>
                        </div>

                        {order.note ? <div style={noteText}>{order.note}</div> : null}

                        <div style={timeText}>Updated {new Date(order.updatedAt).toLocaleString()}</div>

                        <div style={{ marginTop: 7, color: "rgba(255,255,255,0.46)", fontSize: 10, overflowWrap: "anywhere" }}>
                          Scan ID: {order.id}
                        </div>

                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10 }}>
                          <button type="button" style={smallButton} onClick={() => copyText(scanId, "Scan ID copied.")}>
                            Copy Scan ID
                          </button>

                          {STAGES.filter((nextStage) => nextStage !== order.stage).map((nextStage) => (
                            <button
                              key={nextStage}
                              type="button"
                              style={smallButton}
                              onClick={() => moveOrder(order.id, nextStage)}
                            >
                              {nextStage}
                            </button>
                          ))}

                          <button
                            type="button"
                            style={removeButton}
                            onClick={() => removeOrder(order.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ ...card, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" style={primaryButton}>
            Production Board
          </button>
          <button type="button" style={button}>
            Packing View
          </button>
          <button type="button" style={button}>
            Customer Proof Later
          </button>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 950 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ marginTop: 8, fontSize: 18, fontWeight: 950 }}>{value}</div>
    </div>
  );
}

const wrap: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(900px 600px at 15% 10%, rgba(56,189,248,0.16), transparent 55%), linear-gradient(180deg, #020617 0%, #030712 100%)",
  color: "white",
  padding: 22,
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const shell: CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  display: "grid",
  gap: 16,
};

const hero: CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.045)",
  boxShadow: "0 20px 70px rgba(0,0,0,0.38)",
  padding: 18,
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  flexWrap: "wrap",
};

const card: CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.045)",
  boxShadow: "0 20px 70px rgba(0,0,0,0.38)",
  padding: 18,
};

const pill: CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  borderRadius: 999,
  border: "1px solid rgba(103,232,249,0.30)",
  background: "rgba(103,232,249,0.10)",
  color: "#bae6fd",
  padding: "7px 11px",
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: 1.3,
  textTransform: "uppercase",
};

const h1: CSSProperties = {
  margin: "14px 0 4px",
  fontSize: 42,
  lineHeight: 1,
  letterSpacing: -1.2,
};

const subhead: CSSProperties = {
  color: "rgba(255,255,255,0.68)",
  fontWeight: 800,
};

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const eyebrow: CSSProperties = {
  fontSize: 13,
  fontWeight: 950,
  color: "#bae6fd",
  letterSpacing: 1.2,
  textTransform: "uppercase",
};

const smallMuted: CSSProperties = {
  marginTop: 6,
  color: "rgba(255,255,255,0.62)",
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1.45,
};

const formGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 10,
};

const boardGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 12,
  marginTop: 14,
};

const stageCard: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.24)",
  padding: 14,
  minHeight: 220,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const countBadge: CSSProperties = {
  minWidth: 24,
  height: 24,
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 950,
  color: "rgba(255,255,255,0.74)",
};

const orderCard: CSSProperties = {
  borderRadius: 14,
  border: "1px solid rgba(112,242,163,0.18)",
  background: "rgba(112,242,163,0.07)",
  padding: 12,
};

const detailGrid: CSSProperties = {
  display: "flex",
  gap: 7,
  flexWrap: "wrap",
  marginTop: 8,
  color: "rgba(255,255,255,0.72)",
  fontSize: 11,
  fontWeight: 900,
};

const noteText: CSSProperties = {
  marginTop: 7,
  color: "rgba(255,255,255,0.68)",
  fontSize: 12,
  lineHeight: 1.45,
};

const timeText: CSSProperties = {
  marginTop: 8,
  color: "rgba(255,255,255,0.38)",
  fontSize: 11,
  fontWeight: 800,
};

const emptyBox: CSSProperties = {
  marginTop: 4,
  color: "rgba(255,255,255,0.55)",
  fontSize: 13,
  border: "1px dashed rgba(255,255,255,0.12)",
  borderRadius: 14,
  padding: 12,
};

const input: CSSProperties = {
  width: "100%",
  height: 42,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.28)",
  color: "white",
  padding: "0 12px",
  outline: "none",
  boxSizing: "border-box",
  fontWeight: 800,
};

const textarea: CSSProperties = {
  ...input,
  height: "auto",
  minHeight: 84,
  padding: 12,
  resize: "vertical",
  fontWeight: 700,
};

const button: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.07)",
  color: "white",
  borderRadius: 999,
  padding: "11px 14px",
  fontSize: 13,
  fontWeight: 950,
  cursor: "pointer",
};

const primaryButton: CSSProperties = {
  ...button,
  border: "1px solid rgba(112,242,163,0.45)",
  background: "#70f2a3",
  color: "#001018",
};

const primaryCircle: CSSProperties = {
  ...primaryButton,
  minWidth: 96,
  minHeight: 96,
  borderRadius: 999,
};

const smallButton: CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  borderRadius: 999,
  padding: "7px 9px",
  fontSize: 11,
  fontWeight: 900,
  cursor: "pointer",
};

const removeButton: CSSProperties = {
  ...smallButton,
  border: "1px solid rgba(248,113,113,0.26)",
  color: "#fecaca",
};
