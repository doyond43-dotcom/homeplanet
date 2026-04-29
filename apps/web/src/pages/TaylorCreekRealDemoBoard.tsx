import AutoRepairLiveBoard from "./AutoRepairLiveBoard";

const demoJobs = [
  {
    id: "RO-1001",
    customer_name: "Sample Customer",
    vehicle: "2019 Dodge Ram",
    concern: "Brake vibration",
    stage: "Diagnosing",
    created_at: new Date().toISOString(),
  },
  {
    id: "RO-1002",
    customer_name: "Demo Walk-In",
    vehicle: "2017 Honda Accord",
    concern: "AC not cold",
    stage: "In Progress",
    created_at: new Date().toISOString(),
  },
  {
    id: "RO-1003",
    customer_name: "Test Customer",
    vehicle: "2021 Nissan Altima",
    concern: "Check engine light",
    stage: "Waiting Parts",
    created_at: new Date().toISOString(),
  }
];

export default function TaylorCreekRealDemoBoard() {
  return (
    <AutoRepairLiveBoard
      overrideJobs={demoJobs}
      demoMode
    />
  );
}
