import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  GridLayout,
  ParticipantTile,
  useTracks,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { RoomEvent, Track } from "livekit-client";

type TokenResponse = {
  token: string;
  url: string;
};

type ReactionType = "Clap" | "Hot" | "Marker" | "Comment";

type HostPulseItem = {
  id: string;
  type: ReactionType;
  label: string;
  text: string;
  time: string;
  left: number;
};

function isMobileUA() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function fetchLiveKitToken(room: string, identity: string) {
  const endpoint = `/api/livekit-token?room=${encodeURIComponent(
    room
  )}&identity=${encodeURIComponent(identity)}&role=host`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Token fetch failed (${res.status}): ${text || res.statusText}`);
  }

  const data = (await res.json()) as Partial<TokenResponse>;
  if (!data?.token || !data?.url) throw new Error("Token response missing { token, url }");
  return data as TokenResponse;
}

function randId(prefix = "host") {
  return `${prefix}_${Math.random().toString(16).slice(2)}`;
}

function stamp() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function reactionLabel(type: ReactionType) {
  if (type === "Clap") return "👏";
  if (type === "Hot") return "🔥";
  if (type === "Marker") return "📍";
  return "💬";
}

function HostStage() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: true },
  ]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GridLayout tracks={tracks} style={{ height: "100%" }}>
        <ParticipantTile />
      </GridLayout>
    </div>
  );
}

function HostReactionLayer({
  onLocalReactionReady,
}: {
  onLocalReactionReady: (fn: (type: ReactionType, text?: string) => void) => void;
}) {
  const room = useRoomContext();
  const [items, setItems] = useState<HostPulseItem[]>([]);

  const addReaction = useCallback((type: ReactionType, text?: string) => {
    const label = reactionLabel(type);
    const cleanText =
      text ||
      (type === "Clap"
        ? "Viewer clapped."
        : type === "Hot"
        ? "Viewer marked this hot."
        : type === "Marker"
        ? "Viewer dropped a marker."
        : "Viewer commented.");

    const item: HostPulseItem = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      label,
      text: cleanText,
      time: stamp(),
      left: 18 + Math.floor(Math.random() * 64),
    };

    setItems((current) => [item, ...current].slice(0, 8));

    window.setTimeout(() => {
      setItems((current) => current.filter((i) => i.id !== item.id));
    }, 1700);
  }, []);

  useEffect(() => {
    onLocalReactionReady(addReaction);
  }, [addReaction, onLocalReactionReady]);

  useEffect(() => {
    const decoder = new TextDecoder();

    const onData = (payload: Uint8Array) => {
      try {
        const raw = decoder.decode(payload);
        const data = JSON.parse(raw) as {
          hpType?: string;
          type?: ReactionType;
          text?: string;
        };

        if (data.hpType !== "live-studio-reaction") return;
        if (!data.type) return;

        addReaction(data.type, data.text);
      } catch (e) {
        console.warn("Live Studio reaction parse failed:", e);
      }
    };

    room.on(RoomEvent.DataReceived, onData);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room, addReaction]);

  return (
    <>
      <div style={floatingLayer}>
        {items.map((item) => (
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

      <div style={hostPulsePanel}>
        <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 900 }}>
          ROOM PULSE
        </div>

        {items.length === 0 ? (
          <div style={{ marginTop: 8, opacity: 0.55, fontSize: 12 }}>
            Waiting for Clap, Hot, Marker, or Comment.
          </div>
        ) : (
          <div style={{ marginTop: 8, display: "grid", gap: 7 }}>
            {items.slice(0, 5).map((item) => (
              <div key={item.id} style={hostPulseItem}>
                <div style={{ opacity: 0.55, fontSize: 11 }}>{item.time}</div>
                <div style={{ fontWeight: 900 }}>
                  {item.label} {item.type}
                </div>
                <div style={{ opacity: 0.85, fontSize: 12 }}>{item.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function HostControls({
  onEnd,
  onHostReaction,
}: {
  onEnd: () => void;
  onHostReaction: (type: ReactionType, text?: string) => void;
}) {
  const room = useRoomContext();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);

  const toggleMic = async () => {
    const next = !micOn;
    setMicOn(next);
    await room.localParticipant.setMicrophoneEnabled(next);
  };

  const toggleCam = async () => {
    const next = !camOn;
    setCamOn(next);
    await room.localParticipant.setCameraEnabled(next);
  };

  const toggleScreenShare = async () => {
    const next = !screenOn;
    setScreenOn(next);

    try {
      await room.localParticipant.setScreenShareEnabled(next);
    } catch (e) {
      console.error("Screen share failed:", e);
      setScreenOn(false);
    }
  };

  return (
    <div style={hostBar}>
      <button onClick={toggleMic} style={micOn ? activeButton : offButton}>
        {micOn ? "Mic On" : "Mic Off"}
      </button>

      <button onClick={toggleCam} style={camOn ? activeButton : offButton}>
        {camOn ? "Camera On" : "Camera Off"}
      </button>

      <button onClick={toggleScreenShare} style={screenOn ? activeButton : barButton}>
        {screenOn ? "Sharing" : "Share Screen"}
      </button>

      <button onClick={() => onHostReaction("Clap", "Host clapped.")} style={barButton}>
        Clap
      </button>

      <button onClick={() => onHostReaction("Hot", "Host marked this hot.")} style={barButton}>
        Hot
      </button>

      <button onClick={() => onHostReaction("Marker", "Host dropped a marker.")} style={barButton}>
        Marker
      </button>

      <button onClick={onEnd} style={{ ...barButton, background: "#7f1d1d" }}>
        End
      </button>
    </div>
  );
}

export default function CreatorLive() {
  const navigate = useNavigate();
  const mobile = useMemo(() => isMobileUA(), []);
  const roomName = "creator-live";
  const [identity] = useState(() => randId("host"));

  const [serverUrl, setServerUrl] = useState("");
  const [token, setToken] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "live" | "error">("idle");
  const [error, setError] = useState("");
  const [hostReactionFn, setHostReactionFn] =
    useState<(type: ReactionType, text?: string) => void>(() => () => {});

  const onGoLive = useCallback(async () => {
    setPhase("loading");
    setError("");

    try {
      const resp = await fetchLiveKitToken(roomName, identity);
      setToken(resp.token);
      setServerUrl(resp.url);
      setPhase("live");
    } catch (e: any) {
      setError(e?.message || "Failed to go live");
      setPhase("error");
    }
  }, [roomName, identity]);

  if (phase !== "live" || !token || !serverUrl) {
    return (
      <div style={preLiveShell}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ opacity: 0.65, fontSize: 13, fontWeight: 800 }}>
            HOMEPLANET LIVE STUDIO
          </div>

          <h1 style={{ fontSize: 44, margin: "14px 0 8px" }}>
            Live Studio Host
          </h1>

          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 18 }}>
            Start a room, invite people, present, and capture the moments that matter.
          </p>

          <div style={preLiveCard}>
            <div>Phase: {phase}</div>
            <div>Room: {roomName}</div>
            <div>Mobile: {mobile ? "YES" : "NO"}</div>
            <div>Token: {token ? "YES" : "NO"}</div>
            <div>Server URL: {serverUrl ? "YES" : "NO"}</div>

            <button
              onClick={onGoLive}
              disabled={phase === "loading"}
              style={goLiveButton}
            >
              {phase === "loading" ? "Starting..." : "Go Live"}
            </button>

            {error && <pre style={errorBox}>{error}</pre>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom token={token} serverUrl={serverUrl} connect audio video>
      <div style={{ position: "relative", height: "100vh", width: "100vw", background: "black" }}>
        <style>{`
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
        `}</style>

        <RoomAudioRenderer />
        <HostStage />
        <HostReactionLayer
          onLocalReactionReady={(fn) => {
            setHostReactionFn(() => fn);
          }}
        />
        <HostControls
          onEnd={() => navigate("/planet/live-studio")}
          onHostReaction={hostReactionFn}
        />
      </div>
    </LiveKitRoom>
  );
}

const preLiveShell: React.CSSProperties = {
  minHeight: "100vh",
  background: "#050505",
  color: "white",
  padding: 28,
  fontFamily: "Inter, system-ui, sans-serif",
};

const preLiveCard: React.CSSProperties = {
  marginTop: 24,
  border: "1px solid rgba(255,255,255,.10)",
  borderRadius: 22,
  padding: 22,
  background: "rgba(255,255,255,.04)",
};

const goLiveButton: React.CSSProperties = {
  marginTop: 22,
  padding: "14px 22px",
  borderRadius: 14,
  border: "none",
  background: "white",
  color: "black",
  fontWeight: 900,
  cursor: "pointer",
};

const errorBox: React.CSSProperties = {
  marginTop: 18,
  padding: 14,
  borderRadius: 12,
  whiteSpace: "pre-wrap",
  background: "rgba(255,0,0,.12)",
  color: "#ffb4b4",
};

const hostBar: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  padding: 14,
  display: "flex",
  gap: 10,
  justifyContent: "center",
  flexWrap: "wrap",
  background: "linear-gradient(to top, rgba(0,0,0,.85), transparent)",
  zIndex: 20,
};

const barButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,.18)",
  background: "rgba(255,255,255,.10)",
  color: "white",
  borderRadius: 12,
  padding: "10px 12px",
  fontWeight: 800,
  cursor: "pointer",
};

const activeButton: React.CSSProperties = {
  ...barButton,
  background: "rgba(16,185,129,.28)",
  border: "1px solid rgba(52,211,153,.65)",
};

const offButton: React.CSSProperties = {
  ...barButton,
  background: "rgba(127,29,29,.5)",
  border: "1px solid rgba(248,113,113,.55)",
};

const floatingLayer: React.CSSProperties = {
  pointerEvents: "none",
  position: "fixed",
  left: 0,
  right: 0,
  top: "18%",
  height: "45%",
  zIndex: 60,
  overflow: "hidden",
};

const floatingPulse: React.CSSProperties = {
  position: "absolute",
  bottom: 0,
  fontSize: 46,
  filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.65))",
  animation: "hpPulseFloat 1.5s ease-out forwards",
};

const hostPulsePanel: React.CSSProperties = {
  position: "absolute",
  top: 18,
  right: 18,
  width: 280,
  maxHeight: "44vh",
  overflow: "hidden",
  zIndex: 25,
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 18,
  padding: 12,
  background: "rgba(0,0,0,0.48)",
  color: "white",
  backdropFilter: "blur(8px)",
};

const hostPulseItem: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: 8,
  background: "rgba(255,255,255,0.05)",
};