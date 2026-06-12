import React from "react";

const jobs = [
  {
    customer: "Maria Jenkins",
    service: "House Wash + Driveway",
    address: "123 Main Street",
    status: "IN MOTION",
  },
  {
    customer: "John Smith",
    service: "Fence Cleaning",
    address: "456 Oak Avenue",
    status: "PAYMENT DUE",
  },
  {
    customer: "Sarah Johnson",
    service: "Roof Wash",
    address: "789 Lake Road",
    status: "COMPLETE",
  },
];

export default function OperationalJobsDashboardV2() {
  return (
    <main style={page}>
      <div style={container}>
        <h1 style={title}>TODAY'S JOBS</h1>

        <div style={stats}>
          <div>3 Active Jobs</div>
          <div>1 Payment Due</div>
          <div>24 Completed</div>
        </div>

        <button style={newJobButton}>
          + New Job
        </button>

        <div style={jobList}>
          {jobs.map((job) => (
            <div key={job.customer} style={card}>
              <h2 style={customer}>{job.customer}</h2>

              <div style={service}>
                {job.service}
              </div>

              <div style={address}>
                ?? {job.address}
              </div>

              <div style={status}>
                {job.status}
              </div>

              <div style={actions}>
                <button style={actionButton}>?? Call</button>
                <button style={actionButton}>?? Text</button>
                <button style={actionButton}>?? Navigate</button>
              </div>

              <button style={openButton}>
                Open Job ?
              </button>
            </div>
          ))}
        </div>

        <div style={completed}>
          Completed Jobs (24) ?
        </div>
      </div>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#07111a",
  color: "#fff",
  padding: "24px",
};

const container: React.CSSProperties = {
  maxWidth: "900px",
  margin: "0 auto",
};

const title: React.CSSProperties = {
  fontSize: "42px",
  marginBottom: "16px",
};

const stats: React.CSSProperties = {
  display: "flex",
  gap: "20px",
  marginBottom: "20px",
  color: "#94a3b8",
  flexWrap: "wrap",
};

const newJobButton: React.CSSProperties = {
  padding: "14px 20px",
  borderRadius: "14px",
  border: 0,
  background: "#4ade80",
  color: "#07111a",
  fontWeight: 700,
  cursor: "pointer",
  marginBottom: "24px",
};

const jobList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const card: React.CSSProperties = {
  background: "#111827",
  borderRadius: "20px",
  padding: "20px",
  border: "1px solid rgba(255,255,255,.08)",
};

const customer: React.CSSProperties = {
  margin: 0,
  marginBottom: "10px",
};

const service: React.CSSProperties = {
  marginBottom: "8px",
};

const address: React.CSSProperties = {
  color: "#94a3b8",
  marginBottom: "12px",
};

const status: React.CSSProperties = {
  fontWeight: 700,
  color: "#4ade80",
  marginBottom: "14px",
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "14px",
};

const actionButton: React.CSSProperties = {
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,.1)",
  background: "#1f2937",
  color: "#fff",
  padding: "8px 12px",
  cursor: "pointer",
};

const openButton: React.CSSProperties = {
  width: "100%",
  borderRadius: "12px",
  border: 0,
  background: "#4ade80",
  color: "#07111a",
  padding: "14px",
  fontWeight: 700,
  cursor: "pointer",
};

const completed: React.CSSProperties = {
  marginTop: "24px",
  color: "#94a3b8",
  fontWeight: 700,
};
