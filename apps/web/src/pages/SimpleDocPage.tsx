export default function SimpleDocPage({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h1 style={{ fontSize: 24, margin: 0 }}>{title}</h1>
      <p style={{ marginTop: 10, color: "rgba(255,255,255,0.70)", lineHeight: 1.6, maxWidth: 880 }}>
        {body}
      </p>
      <div style={{ marginTop: 14, color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
        (Placeholder page — we can render your PDFs / doctrine text here next.)
      </div>
    </div>
  );
}
