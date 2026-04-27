import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type MomentClip = {
  id?: string;
  name?: string;
  type?: string;
  order?: number;
  createdAt?: string;
};

type MomentPayload = {
  businessName?: string;
  businessType?: string;
  city?: string;
  boardSlug?: string;
  presenceId?: string;
  creatorMoment?: {
    title?: string;
    subtitle?: string;
    story?: string;
    statusLine?: string;
    clipCount?: number;
    launchedAt?: string;
    note?: string;
  };
  clips?: MomentClip[];
};

export default function CreatorMomentPage() {
  const nav = useNavigate();
  const { slug = "" } = useParams<{ slug: string }>();
  const [payload, setPayload] = useState<MomentPayload | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`creator-studio:${slug}:moment`);
      setPayload(raw ? JSON.parse(raw) : null);
    } catch {
      setPayload(null);
    }
  }, [slug]);

  const clips = useMemo(() => {
    return Array.isArray(payload?.clips)
      ? [...payload.clips].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      : [];
  }, [payload]);

  const boardSlug = payload?.boardSlug || slug;
  const title = payload?.creatorMoment?.title || "Creator Moment";
  const subtitle = payload?.creatorMoment?.subtitle || "Proof-in-motion tied to real work.";
  const story = payload?.creatorMoment?.story || "This moment was built from real work and launched through HomePlanet.";
  const status = payload?.creatorMoment?.statusLine || "Moment ready.";
  const presenceId = payload?.presenceId || "";

  const shell: React.CSSProperties = {
    minHeight: "100vh",
    background: "#07111f",
    color: "white",
    padding: 18,
  };

  const wrap: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
  };

  const card: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.045)",
    boxShadow: "0 18px 55px rgba(0,0,0,0.35)",
    padding: 18,
  };

  const pill: React.CSSProperties = {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 900,
    color: "rgba(255,255,255,0.88)",
  };

  const btn: React.CSSProperties = {
    height: 42,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 12,
  };

  const primary: React.CSSProperties = {
    ...btn,
    border: "1px solid rgba(0,255,150,0.35)",
    background: "rgba(0,255,150,0.10)",
    color: "rgba(220,255,245,0.95)",
  };

  if (!payload) {
    return (
      <div style={shell}>
        <div style={wrap}>
          <div style={card}>
            <h1 style={{ margin: 0, fontSize: 28 }}>Creator Moment</h1>
            <p style={{ color: "rgba(255,255,255,0.75)" }}>
              No saved moment found for this slug yet.
            </p>
            <button type="button" style={btn} onClick={() => nav("/planet/creator/studio")}>
              Back to Creator Studio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={shell}>
      <div style={wrap}>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 950, textTransform: "uppercase", color: "rgba(255,255,255,0.68)" }}>
            Creator Moment
          </div>

          <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.02 }}>
            {title}
          </h1>

          <p style={{ margin: 0, maxWidth: 760, color: "rgba(255,255,255,0.78)", lineHeight: 1.55 }}>
            {subtitle}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
            <div style={pill}>{payload.businessName || "Business"}</div>
            <div style={pill}>Board: {boardSlug}</div>
            {presenceId ? <div style={pill}>Presence: {presenceId}</div> : null}
            <div style={pill}>{clips.length} clips</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, .8fr)", gap: 18, marginTop: 18 }}>
          <div style={card}>
            <h2 style={{ margin: 0, fontSize: 20 }}>Clips</h2>

            {clips.length ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginTop: 14 }}>
                {clips.map((clip, index) => (
                  <div key={clip.id || index} style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.10)", padding: 14, background: "rgba(255,255,255,0.04)" }}>
                    <div style={{ fontSize: 12, fontWeight: 950, color: "rgba(255,255,255,0.62)" }}>
                      Clip #{clip.order ?? index + 1}
                    </div>
                    <div style={{ marginTop: 8, fontWeight: 900, wordBreak: "break-word" }}>
                      {clip.name || "Saved clip"}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.68)" }}>
                      {clip.type || "clip"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 14, borderRadius: 16, border: "1px dashed rgba(255,255,255,0.16)", padding: 18, color: "rgba(255,255,255,0.70)" }}>
                No clip list was saved with this moment yet.
              </div>
            )}
          </div>

          <div style={card}>
            <h2 style={{ margin: 0, fontSize: 20 }}>Status</h2>

            <div style={{ marginTop: 14, borderRadius: 16, background: "rgba(255,255,255,0.05)", padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 950, textTransform: "uppercase", color: "rgba(255,255,255,0.58)" }}>
                Current
              </div>
              <div style={{ marginTop: 6, fontWeight: 850, lineHeight: 1.45 }}>{status}</div>
            </div>

            <div style={{ marginTop: 12, borderRadius: 16, background: "rgba(255,255,255,0.05)", padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 950, textTransform: "uppercase", color: "rgba(255,255,255,0.58)" }}>
                Next Step
              </div>
              <div style={{ marginTop: 6, fontWeight: 850, lineHeight: 1.45 }}>
                Open the connected live board.
              </div>
            </div>

            <div style={{ marginTop: 12, borderRadius: 16, background: "rgba(255,255,255,0.05)", padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 950, textTransform: "uppercase", color: "rgba(255,255,255,0.58)" }}>
                Story
              </div>
              <div style={{ marginTop: 6, color: "rgba(255,255,255,0.78)", lineHeight: 1.55 }}>{story}</div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
              <button type="button" style={primary} onClick={() => nav(`/planet/live/${boardSlug}`)}>
                Open Live Board
              </button>
              <button type="button" style={btn} onClick={() => nav(`/planet/staff/${boardSlug}`)}>
                Staff Board
              </button>
              <button type="button" style={btn} onClick={() => nav(`/planet/lobby/${boardSlug}`)}>
                Lobby Board
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
