import PresenceGridBoard from "../components/PresenceGridBoard";

export default function PresenceGridPreview() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background:
          "radial-gradient(1200px 760px at 6% 10%, rgba(6,182,212,0.12), transparent 52%)," +
          "radial-gradient(980px 720px at 88% 10%, rgba(168,85,247,0.10), transparent 50%)," +
          "radial-gradient(900px 780px at 52% 100%, rgba(37,99,235,0.09), transparent 50%)," +
          "#020617",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            marginBottom: 20,
            color: "#e2e8f0",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#67e8f9",
              marginBottom: 6,
            }}
          >
            HomePlanet Dev Preview
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            Presence Grid Board
          </div>

          <div style={{ color: "rgba(226,232,240,0.7)" }}>
            This is a standalone test page for the tic-tac-toe system layer.
            Nothing here affects production pages.
          </div>
        </div>

        <PresenceGridBoard />
      </div>
    </div>
  );
}