import { useCallback, useMemo, useState } from "react";
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
import { Track } from "livekit-client";

type TokenResponse = {
  token: string;
  url: string;
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

function HostControls({ onEnd }: { onEnd: () => void }) {
  const room = useRoomContext();

  const toggleMic = async () => {
    await room.localParticipant.setMicrophoneEnabled(
      !room.localParticipant.isMicrophoneEnabled
    );
  };

  const toggleCam = async () => {
    await room.localParticipant.setCameraEnabled(
      !room.localParticipant.isCameraEnabled
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 14,
        display: "flex",
        gap: 10,
        justifyContent: "center",
        background: "linear-gradient(to top, rgba(0,0,0,.85), transparent)",
        zIndex: 20,
      }}
    >
      <button onClick={toggleMic} style={barButton}>Mic</button>
      <button onClick={toggleCam} style={barButton}>Camera</button>
      <button style={barButton}>Share Screen</button>
      <button style={barButton}>Clap</button>
      <button style={barButton}>Hot</button>
      <button style={barButton}>Marker</button>
      <button onClick={onEnd} style={{ ...barButton, background: "#7f1d1d" }}>End</button>
    </div>
  );
}

const barButton: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,.18)",
  background: "rgba(255,255,255,.10)",
  color: "white",
  borderRadius: 12,
  padding: "10px 12px",
  fontWeight: 800,
  cursor: "pointer",
};

export default function CreatorLive() {
  const navigate = useNavigate();
  const mobile = useMemo(() => isMobileUA(), []);
  const roomName = "creator-live";
  const [identity] = useState(() => randId("host"));

  const [serverUrl, setServerUrl] = useState("");
  const [token, setToken] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "live" | "error">("idle");
  const [error, setError] = useState("");

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
      <div
        style={{
          minHeight: "100vh",
          background: "#050505",
          color: "white",
          padding: 28,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
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

          <div
            style={{
              marginTop: 24,
              border: "1px solid rgba(255,255,255,.10)",
              borderRadius: 22,
              padding: 22,
              background: "rgba(255,255,255,.04)",
            }}
          >
            <div>Phase: {phase}</div>
            <div>Room: {roomName}</div>
            <div>Mobile: {mobile ? "YES" : "NO"}</div>
            <div>Token: {token ? "YES" : "NO"}</div>
            <div>Server URL: {serverUrl ? "YES" : "NO"}</div>

            <button
              onClick={onGoLive}
              disabled={phase === "loading"}
              style={{
                marginTop: 22,
                padding: "14px 22px",
                borderRadius: 14,
                border: "none",
                background: "white",
                color: "black",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {phase === "loading" ? "Starting..." : "Go Live"}
            </button>

            {error && (
              <pre
                style={{
                  marginTop: 18,
                  padding: 14,
                  borderRadius: 12,
                  whiteSpace: "pre-wrap",
                  background: "rgba(255,0,0,.12)",
                  color: "#ffb4b4",
                }}
              >
                {error}
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom token={token} serverUrl={serverUrl} connect audio video>
      <div style={{ position: "relative", height: "100vh", width: "100vw", background: "black" }}>
        <RoomAudioRenderer />
        <HostStage />
        <HostControls onEnd={() => navigate("/planet/live-studio")} />
      </div>
    </LiveKitRoom>
  );
}
