import { useParams } from "react-router-dom";

const cuts: Record<string, { title: string; image: string; caption: string }> = {
  "sharp-fade-design": {
    title: "Sharp Fade + Design",
    image: "/images/all-clean-cuts-fade-design-01.jpg",
    caption: "Fresh out the chair at All Clean Cuts.",
  },
  "meet-the-shop": {
    title: "Meet The Shop",
    image: "/images/all-clean-cuts-boxing-pose.jpg",
    caption: "All Clean Cuts energy, Okeechobee style.",
  },
  "okeechobee-shop-energy": {
    title: "Okeechobee Shop Energy",
    image: "/images/all-clean-cuts-red-truck.jpg",
    caption: "Local shop. Real community. Clean cuts.",
  },
  "community-cuts": {
    title: "Community Cuts",
    image: "/images/all-clean-cuts-family-party.jpg",
    caption: "Cuts, family, and local memories.",
  },
};

export default function AllCleanCutsFreshCutPage() {
  const { cutSlug = "sharp-fade-design" } = useParams();
  const cut = cuts[cutSlug] || cuts["sharp-fade-design"];
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/planet/all-clean-cuts/fresh-cut/${cutSlug}`
      : `/planet/all-clean-cuts/fresh-cut/${cutSlug}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 18% 10%, rgba(59,130,246,0.22), transparent 34%), radial-gradient(circle at 82% 16%, rgba(239,68,68,0.20), transparent 30%), #030712",
        color: "white",
        padding: 24,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <button
        onClick={() => window.location.assign("/planet/all-clean-cuts")}
        style={{
          borderRadius: 999,
          border: "1px solid rgba(96,165,250,0.30)",
          background: "rgba(15,23,42,0.72)",
          color: "white",
          padding: "11px 18px",
          fontWeight: 950,
          cursor: "pointer",
          marginBottom: 18,
        }}
      >
        ← Back to All Clean Cuts
      </button>

      <section
        style={{
          maxWidth: 760,
          margin: "0 auto",
          borderRadius: 34,
          border: "1px solid rgba(96,165,250,0.24)",
          background:
            "linear-gradient(160deg, rgba(8,47,73,0.45), rgba(2,6,23,0.90))",
          padding: 24,
          boxShadow: "0 30px 100px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            borderRadius: 999,
            border: "1px solid rgba(239,68,68,0.35)",
            background: "rgba(239,68,68,0.18)",
            padding: "8px 14px",
            fontWeight: 950,
            letterSpacing: 1.4,
            color: "#ffffff",
            fontSize: 12,
          }}
        >
          FRESH CUT MOMENT
        </div>

        <h1 style={{ margin: "18px 0 10px", fontSize: 44, lineHeight: 1 }}>
          {cut.title}
        </h1>

        <p style={{ color: "rgba(226,232,240,0.72)", fontSize: 18 }}>
          {cut.caption}
        </p>

        <img
          src={cut.image}
          alt={cut.title}
          style={{
            width: "100%",
            maxHeight: 620,
            objectFit: "cover",
            objectPosition: "center 35%",
            borderRadius: 24,
            border: "1px solid rgba(96,165,250,0.20)",
            marginTop: 16,
          }}
        />

        <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
          <button
            onClick={() => {
              const message = `Check out this fresh cut from All Clean Cuts: ${shareUrl}`;
              window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
            }}
            style={{
              width: "100%",
              borderRadius: 999,
              border: "1px solid rgba(239,68,68,0.55)",
              background:
                "linear-gradient(135deg, rgba(239,68,68,0.28), rgba(37,99,235,0.18))",
              color: "white",
              padding: "15px 22px",
              fontWeight: 950,
              cursor: "pointer",
            }}
          >
            Text This Fresh Cut
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                window.alert("Fresh cut link copied.");
              }}
              style={socialButton}
            >
              Copy Link
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: cut.title,
                    text: "Check out this fresh cut from All Clean Cuts",
                    url: shareUrl,
                  });
                } else {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
                }
              }}
              style={socialButton}
            >
              Share
            </button>

            <button
              onClick={() =>
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
              }
              style={socialButton}
            >
              Facebook
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(shareUrl);
                window.alert("Instagram/TikTok link copied. Paste into story, bio, or post.");
              }}
              style={socialButton}
            >
              Instagram / TikTok
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            borderRadius: 18,
            border: "1px solid rgba(96,165,250,0.14)",
            background: "rgba(15,23,42,0.52)",
            padding: 12,
            color: "rgba(226,232,240,0.72)",
            wordBreak: "break-all",
            fontSize: 13,
          }}
        >
          {shareUrl}
        </div>
      </section>
    </main>
  );
}

const socialButton: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(96,165,250,0.22)",
  background: "rgba(15,23,42,0.72)",
  color: "white",
  padding: "14px 16px",
  fontWeight: 900,
  cursor: "pointer",
};
