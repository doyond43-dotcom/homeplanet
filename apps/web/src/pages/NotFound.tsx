export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#070707",
        color: "white",
        fontFamily: "system-ui, sans-serif",
        padding: 24
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>
          404 — Location not found
        </h1>

        <p style={{ opacity: 0.7 }}>
          This place doesn’t exist on HomePlanet yet.
        </p>
      </div>
    </div>
  );
}
