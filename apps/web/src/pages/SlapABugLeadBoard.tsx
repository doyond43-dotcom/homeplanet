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


const sampleLeads = {
  "New Lead": {
    name: "John Smith",
    service: "Ant Control",
    source: "Facebook Video",
    status: "2 hours ago",
  },
  "Estimate Sent": {
    name: "Sarah Jones",
    service: "Roach Control",
    source: "Estimate Sent",
    status: "Today",
  },
  Approved: {
    name: "Mike Johnson",
    service: "Rodent Control",
    source: "Approved",
    status: "Ready",
  },
  Scheduled: {
    name: "Lisa Brown",
    service: "Spider Treatment",
    source: "Thursday 9:00 AM",
    status: "Scheduled",
  },
  Completed: {
    name: "Tom Wilson",
    service: "General Pest Control",
    source: "Completed Today",
    status: "Paid",
  },
};
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

<div
  style={{
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    padding: "12px",
    marginTop: "12px",
  }}
>
  <div style={{ fontWeight: 700 }}>
    {sampleLeads[column as keyof typeof sampleLeads]?.name}
  </div>

  <div
    style={{
      color: "#22c55e",
      marginTop: "6px",
    }}
  >
    {sampleLeads[column as keyof typeof sampleLeads]?.service}
  </div>

  <div
    style={{
      color: "#9ca3af",
      fontSize: "13px",
      marginTop: "8px",
    }}
  >
    {sampleLeads[column as keyof typeof sampleLeads]?.source}
  </div>

  <div
    style={{
      color: "#777",
      fontSize: "12px",
      marginTop: "4px",
    }}
  >
    {sampleLeads[column as keyof typeof sampleLeads]?.status}
  </div>
</div>
          </div>
        ))}
      </div>
    </main>
  );
}



