import CreatorDemoPanel from "../subsystems/creatorDemo/CreatorDemoPanel";
import ResidentHeader from "../components/ResidentHeader";

export default function DemoFlow() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 16px", color: "#fff" }}>
      <ResidentHeader title="Creator Demo Mode" subtitle="Public-safe preview of overlays + redaction (no business logic changed)." backTo="/" links={[{ label: "Home", to: "/" }, { label: "Bays", to: "/bays" }, { label: "Payments", to: "/payments" }]} />
      <h2 style={{ marginBottom: 6 }}>Creator Demo Mode</h2>
      <p style={{ opacity: 0.65, marginBottom: 14 }}>
        Public-safe preview of overlays + redaction. (No business logic changed.)
      </p>
      <CreatorDemoPanel />
    </div>
  );
}


