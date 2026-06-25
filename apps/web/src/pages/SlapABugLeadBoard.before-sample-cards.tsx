const performanceStats = [
  { label: "Video Views", value: "3,200" },
  { label: "Landing Page Clicks", value: "187" },
  { label: "Leads", value: "42" },
  { label: "Conversion Rate", value: "42%" },
];

const operationalStats = [
  { label: "New Leads", value: 7 },
  { label: "Estimates Sent", value: 5 },
  { label: "Approved", value: 3 },
  { label: "Scheduled", value: 2 },
  { label: "Completed", value: 1 },
];

export default function SlapABugLeadBoard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "#fff",
        padding: "24px",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "32px",
          fontWeight: 900,
        }}
      >
        Slap-A-Bug Performance
      </h1>

      <p
        style={{
          color: "#8b8b8b",
          marginTop: "8px",
          marginBottom: "24px",
        }}
      >
        Video ? Click ? Lead ? Customer
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {performanceStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#121212",
              border: "1px solid #222",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div
              style={{
                color: "#8b8b8b",
                fontSize: "12px",
                textTransform: "uppercase",
              }}
            >
              {stat.label}
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: "#22c55e",
                marginTop: "8px",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <h2
        style={{
          marginBottom: "16px",
          fontSize: "24px",
          fontWeight: 900,
        }}
      >
        Slap-A-Bug Operations
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {operationalStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#121212",
              border: "1px solid #222",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div
              style={{
                color: "#8b8b8b",
                fontSize: "12px",
                textTransform: "uppercase",
              }}
            >
              {stat.label}
            </div>

            <div
              style={{
                fontSize: "32px",
                fontWeight: 900,
                color: "#22c55e",
                marginTop: "8px",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
        }}
      >
        {[
          "New Lead",
          "Estimate Sent",
          "Approved",
          "Scheduled",
          "Completed",
        ].map((column) => (
          <div
            key={column}
            style={{
              background: "#121212",
              borderRadius: "12px",
              padding: "12px",
              minHeight: "500px",
            }}
          >
            <h2>{column}</h2>
          </div>
        ))}
      </div>
    </main>
  );
}

