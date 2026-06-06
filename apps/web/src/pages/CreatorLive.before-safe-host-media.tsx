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

type PulseType = "Clap" | "Hot" | "Marker" | "Comment" | "System";

type RoomTimelineEvent = {
  id: string;
  hpType: "live-studio-event";
  room: string;
  actor: string;
  role: "host" | "viewer" | "system";
  type: PulseType;
  text: string;
  createdAt: number;
};

type FloatPulse = {
  id: string;
  label: string;
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

function pulseLabel(type: PulseType) {
  if (type === "Clap") return "\uD83D\uDC4F";
  if (type === "Hot") return "\uD83D\uDD25";
  if (type === "Marker") return "\uD83D\uDCCD";
  if (type === "Comment") return "\uD83D\uDCAC";
  return "•";
}

function pulseText(type: PulseType, actor: string, customText?: string) {
  if (customText?.trim()) return customText.trim();
  if (type === "Clap") return `${actor} clapped.`;
  if (type === "Hot") return `${actor} marked this hot.`;
  if (type === "Marker") return `${actor} dropped a marker.`;
  if (type === "Comment") return `${actor} commented.`;
  return `${actor} updated the room.`;
}

function timeFrom(ms: number) {
  return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
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

function HostTimelineLayer({
  roomName,
  actorName,
  onLocalEventReady,
}: {
  roomName: string;
  actorName: string;
  onLocalEventReady: (fn: (type: PulseType, text?: string) => void) => void;
}) {
  const room = useRoomContext();
  const [timeline, setTimeline] = useState<RoomTimelineEvent[]>([]);
  const [floatPulse, setFloatPulse] = useState<FloatPulse[]>([]);

  const launchFloat = useCallback((label: string) => {
    if (label === "•") return;

    const id = `${Date.now()}-${Math.random()}`;
    const left = 18 + Math.floor(Math.random() * 64);

    setFloatPulse((items) => [...items, { id, label, left }]);

    window.setTimeout(() => {
      setFloatPulse((items) => items.filter((item) => item.id !== id));
    }, 1500);
  }, []);

  const addTimelineEvent = useCallback(
    (event: RoomTimelineEvent) => {
      setTimeline((items) => {
        if (items.some((item) => item.id === event.id)) return items;
        return [event, ...items].slice(0, 24);
      });

      launchFloat(pulseLabel(event.type));
    },
    [launchFloat]
  );

  const publishTimelineEvent = useCallback(
    async (type: PulseType, customText?: string) => {
      const actor = actorName.trim() || "Daniel";
      const event: RoomTimelineEvent = {
        id: `${Date.now()}-${Math.random()}`,
        hpType: "live-studio-event",
        room: roomName,
        actor,
        role: type === "System" ? "system" : "host",
        type,
        text: pulseText(type, actor, customText),
        createdAt: Date.now(),
      };

      addTimelineEvent(event);

      try {
        const encoded = new TextEncoder().encode(JSON.stringify(event));
        await room.localParticipant.publishData(encoded, { reliable: true });
      } catch (e) {
        console.error("Live Studio host event publish failed:", e);
      }
    },
    [actorName, roomName, room, addTimelineEvent]
  );

  useEffect(() => {
    onLocalEventReady(publishTimelineEvent);
  }, [publishTimelineEvent, onLocalEventReady]);

  useEffect(() => {
    const decoder = new TextDecoder();

    const onData = (payload: Uint8Array) => {
      try {
        const raw = decoder.decode(payload);
        const data = JSON.parse(raw) as RoomTimelineEvent;

        if (data.hpType !== "live-studio-event") return;
        if (!data.type || !data.actor || !data.createdAt) return;

        addTimelineEvent(data);
      } catch (e) {
        console.warn("Live Studio host event parse failed:", e);
      }
    };

    room.on(RoomEvent.DataReceived, onData);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room, addTimelineEvent]);

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

      <div style={hostPulsePanel}>
        <div style={{ fontSize: 11, opacity: 0.6, fontWeight: 900 }}>
          ROOM TIMELINE
        </div>

        {timeline.length === 0 ? (
          <div style={{ marginTop: 8, opacity: 0.55, fontSize: 12 }}>
            Waiting for room activity.
          </div>
        ) : (
          <div style={{ marginTop: 8, display: "grid", gap: 7 }}>
            {timeline.slice(0, 8).map((item) => (
              <div key={item.id} style={hostPulseItem}>
                <div style={{ opacity: 0.55, fontSize: 11 }}>
                  {timeFrom(item.createdAt)}
                </div>
                <div style={{ fontWeight: 900 }}>
                  {pulseLabel(item.type)} {item.actor}
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
  onHostEvent,
}: {
  onEnd: () => void;
  onHostEvent: (type: PulseType, text?: string) => void;
}) {
  const room = useRoomContext();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenOn, setScreenOn] = useState(false);

  const toggleMic = async () => {
    const next = !micOn;
    setMicOn(next);
    await room.localParticipant.setMicrophoneEnabled(next);
    onHostEvent("System", `Daniel turned microphone ${next ? "on" : "off"}.`);
  };

  const toggleCam = async () => {
    const next = !camOn;
    setCamOn(next);
    await room.localParticipant.setCameraEnabled(next);
    onHostEvent("System", `Daniel turned camera ${next ? "on" : "off"}.`);
  };

  const toggleScreenShare = async () => {
    const next = !screenOn;
    setScreenOn(next);

    try {
      await room.localParticipant.setScreenShareEnabled(next);
      onHostEvent("System", `Daniel ${next ? "started" : "stopped"} screen sharing.`);
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

      <button onClick={() => onHostEvent("Clap")} style={barButton}>
        Clap
      </button>

      <button onClick={() => onHostEvent("Hot")} style={barButton}>
        Hot
      </button>

      <button onClick={() => onHostEvent("Marker")} style={barButton}>
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
  const [hostEventFn, setHostEventFn] =
    useState<(type: PulseType, text?: string) => void>(() => () => {});

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
        <HostTimelineLayer
          roomName={roomName}
          actorName="Daniel"
          onLocalEventReady={(fn) => {
            setHostEventFn(() => fn);
          }}
        />
        <HostControls
          onEnd={() => navigate("/planet/live-studio")}
          onHostEvent={hostEventFn}
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
  width: 310,
  maxHeight: "54vh",
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