import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  useTracks,
  RoomAudioRenderer,
  useRoomContext,
} from "@livekit/components-react";
import { Track } from "livekit-client";

type TokenResponse = { token: string; url: string };

type PulseItem = {
  id: string;
  type: "Clap" | "Hot" | "Marker" | "Comment";
  text: string;
  time: string;
};

type FloatPulse = {
  id: string;
  label: string;
  left: number;
};

function ViewerStage() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: true }
  );

  return (
    <div style={videoShell}>
      <GridLayout tracks={tracks} style={{ height: "70vh" }}>
        <ParticipantTile />
      </GridLayout>
    </div>
  );
}

function StartAudioButton() {
  const room = useRoomContext();
  const [status, setStatus] = useState<"idle" | "ok" | "fail">("idle");

  const onStart = useCallback(async () => {
    try {
      await room.startAudio();
      setStatus("ok");
    } catch (e) {
      console.error("startAudio failed:", e);
      setStatus("fail");
    }
  }, [room]);

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
      <button onClick={onStart} style={whiteButton}>
        Start Audio
      </button>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        {status === "idle" && "Tap once to enable sound in this tab."}
        {status === "ok" && "Audio enabled."}
        {status === "fail" && "Audio blocked. Check browser/site sound permissions."}
      </div>
    </div>
  );
}

function ViewerActions() {
  const [claps, setClaps] = useState(0);
  const [hots, setHots] = useState(0);
  const [markers, setMarkers] = useState(0);
  const [comment, setComment] = useState("");
  const [pulse, setPulse] = useState<PulseItem[]>([]);
  const [floatPulse, setFloatPulse] = useState<FloatPulse[]>([]);

  const stamp = () =>
    new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const launchFloat = (label: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const left = 18 + Math.floor(Math.random() * 64);

    setFloatPulse((items) => [...items, { id, label, left }]);

    window.setTimeout(() => {
      setFloatPulse((items) => items.filter((item) => item.id !== id));
    }, 1500);
  };

  const addPulse = (type: PulseItem["type"], text: string) => {
    setPulse((items) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        type,
        text,
        time: stamp(),
      },
      ...items,
    ].slice(0, 8));
  };

  const onClap = () => {
    setClaps((v) => v + 1);
    launchFloat("👏");
    addPulse("Clap", "Viewer clapped.");
  };

  const onHot = () => {
    setHots((v) => v + 1);
    launchFloat("🔥");
    addPulse("Hot", "Viewer marked this as hot.");
  };

  const onMarker = () => {
    setMarkers((v) => v + 1);
    launchFloat("📍");
    addPulse("Marker", "Viewer dropped a marker.");
  };

  const onComment = () => {
    const clean = comment.trim();
    if (!clean) return;
    launchFloat("💬");
    addPulse("Comment", clean);
    setComment("");
  };

  return (
    <>
      <div style={floatingLayer}>
        {floatPulse.map((item) => (
          <div
            key={item.id}
            style={{
              ...floatingPulse,
              left: `${item.left}%`,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      <div style={actionPanel}>
        <div style={{ fontSize: 13, opacity: 0.7, fontWeight: 900 }}>
          VIEWER ACTIONS
        </div>

        <div style={actionRow}>
          <button onClick={onClap} style={actionButton}>
            Clap {claps}
          </button>
          <button onClick={onHot} style={actionButton}>
            Hot {hots}
          </button>
          <button onClick={onMarker} style={actionButton}>
            Marker {markers}
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onComment();
            }}
            placeholder="Add a comment..."
            style={commentInput}
          />
          <button onClick={onComment} style={whiteButton}>
            Send
          </button>
        </div>

        {pulse.length > 0 && (
          <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
            {pulse.map((item) => (
              <div key={item.id} style={pulseItem}>
                <div style={{ fontSize: 12, opacity: 0.55 }}>{item.time}</div>
                <div style={{ fontWeight: 900 }}>{item.type}</div>
                <div style={{ opacity: 0.85 }}>{item.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function LiveViewer() {
  const { room } = useParams();
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");

  useEffect(() => {
    (async () => {
      const r = String(room || "").trim();
      if (!r) return;

      const res = await fetch(`/api/livekit-token?room=${encodeURIComponent(r)}&role=viewer`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as Partial<TokenResponse>;
      if (!data.token || !data.url) throw new Error("Token response missing token/url");

      setToken(data.token);
      setServerUrl(data.url);
    })().catch((e) => console.error(e));
  }, [room]);

  if (!room) return <div style={pageShell}>Missing room.</div>;
  if (!token || !serverUrl) return <div style={pageShell}>Joining...</div>;

  return (
    <div style={pageShell}>
      <div style={headerRow}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 900 }}>
            HOMEPLANET LIVE STUDIO
          </div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Live: {room}</div>
        </div>
      </div>

      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        audio={true}
        video={false}
        style={{ background: "black" }}
      >
        <RoomAudioRenderer />
        <StartAudioButton />
        <ViewerStage />
        <ViewerActions />
      </LiveKitRoom>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        If you cannot hear, make sure the host mic is not muted and your browser tab is not muted.
      </div>
    </div>
  );
}

const pageShell: React.CSSProperties = {
  position: "relative",
  padding: 16,
  background: "black",
  color: "white",
  minHeight: "100vh",
  fontFamily: "Inter, system-ui, sans-serif",
  overflowX: "hidden",
};

const headerRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};

const videoShell: React.CSSProperties = {
  position: "relative",
  borderRadius: 14,
  overflow: "hidden",
};

const whiteButton: React.CSSProperties = {
  height: 44,
  padding: "0 16px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "white",
  color: "black",
  fontWeight: 900,
  cursor: "pointer",
};

const floatingLayer: React.CSSProperties = {
  pointerEvents: "none",
  position: "fixed",
  left: 0,
  right: 0,
  top: "18%",
  height: "45%",
  zIndex: 50,
  overflow: "hidden",
};

const floatingPulse: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  fontSize: 42,
  filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.55))",
  animation: "hpPulseFloat 1.5s ease-out forwards",
};

const actionPanel: React.CSSProperties = {
  marginTop: 16,
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 18,
  padding: 14,
  background: "rgba(255,255,255,0.04)",
};

const actionRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 10,
};

const actionButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  borderRadius: 14,
  padding: "12px 14px",
  fontWeight: 900,
  cursor: "pointer",
};

const commentInput: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  padding: "0 14px",
  outline: "none",
};

const pulseItem: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: 10,
  background: "rgba(0,0,0,0.25)",
};

const style = document.createElement("style");
style.innerHTML = `
@keyframes hpPulseFloat {
  0% {
    transform: translateY(40px) scale(0.8);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  100% {
    transform: translateY(-220px) scale(1.25);
    opacity: 0;
  }
}
`;
document.head.appendChild(style);