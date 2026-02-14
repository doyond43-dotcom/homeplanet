import { useParams, Link } from "react-router-dom";

export default function PressPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0f14",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: 520,
          padding: 28,
          borderRadius: 14,
          background: "#111a22",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Press Page</h1>

        <p style={{ opacity: 0.8 }}>
          This confirms the press route is now separated from the intake form.
        </p>

        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 10,
            background: "rgba(0,200,255,0.08)",
            border: "1px solid rgba(0,200,255,0.25)",
            fontWeight: 600,
          }}
        >
          Slug detected: {slug}
        </div>

        <Link
          to={`/intake/${slug}`}
          style={{
            display: "block",
            marginTop: 22,
            textAlign: "center",
            padding: "14px 16px",
            borderRadius: 10,
            background: "#22c55e",
            color: "#000",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Open Intake Page for this location
        </Link>

        <p style={{ marginTop: 14, opacity: 0.6, fontSize: 13 }}>
          If you ever see the intake form directly on /press again, routing is broken.
        </p>
      </div>
    </div>
  );
}

