import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  useTracks,
  RoomAudioRenderer,
  useRoomContext,
} from "@livekit/components-react";
import { RoomEvent, Track } from "livekit-client";

type TokenResponse = { token: string; url: string };

type PulseType = "Clap" | "Hot" | "Marker" | "Comment";

type RoomTimelineEvent = {
  id: string;
  hpType: "live-studio-event";
  room: string;
  actor: string;
  role: "viewer";
  type: PulseType;
  text: string;
  createdAt: number;
};

type FloatPulse = {
  id: string;
  label: string;
  left: number;
};

function pulseLabel(type: PulseType) {
  if (type === "Clap") return "\uD83D\uDC4F";
  if (type === "Hot") return "\uD83D\uDD25";
  if (type === "Marker") return "\uD83D\uDCCD";
  return "\uD83D\uDCAC";
}

function pulseText(type: PulseType, actor: string, comment?: string) {
  if (type === "Clap") return `${actor} clapped.`;
  if (type === "Hot") return `${actor} marked this hot.`;
  if (type === "Marker") return `${actor} dropped a marker.`;
  return comment?.trim() ? `${actor} commented: ${comment.trim()}` : `${actor} commented.`;
}

function timeFrom(ms: number) {
  return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

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

function ViewerControls() {
  const room = useRoomContext();

  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  const toggleMic = async () => {
    const next = !micOn;
    setMicOn(next);

    try {
      await room.localParticipant.setMicrophoneEnabled(next);
    } catch (e) {
      console.error("Viewer mic toggle failed:", e);
      setMicOn(false);
    }
  };

  const toggleCam = async () => {
    const next = !camOn;
    setCamOn(next);

    try {
      await room.localParticipant.setCameraEnabled(next);
    } catch (e) {
      console.error("Viewer camera toggle failed:", e);
      setCamOn(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
      <button onClick={toggleMic} style={micOn ? viewerActiveButton : actionButton}>
        {micOn ? "Mic On" : "Mic Off"}
      </button>

      <button onClick={toggleCam} style={camOn ? viewerActiveButton : actionButton}>
        {camOn ? "Camera On" : "Camera Off"}
      </button>
    </div>
  );
}

function ViewerActions({
  roomName,
  actorName,
}: {
  roomName: string;
  actorName: string;
}) {
  const liveRoom = useRoomContext();

  const [claps, setClaps] = useState(0);
  const [hots, setHots] = useState(0);
  const [markers, setMarkers] = useState(0);
  const [comment, setComment] = useState("");
  const [timeline, setTimeline] = useState<RoomTimelineEvent[]>([]);
  const [floatPulse, setFloatPulse] = useState<FloatPulse[]>([]);

  const launchFloat = useCallback((label: string) => {
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
        return [event, ...items].slice(0, 20);
      });

      launchFloat(pulseLabel(event.type));
    },
    [launchFloat]
  );

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
        console.warn("Live Studio viewer event parse failed:", e);
      }
    };

    liveRoom.on(RoomEvent.DataReceived, onData);
    return () => {
      liveRoom.off(RoomEvent.DataReceived, onData);
    };
  }, [liveRoom, addTimelineEvent]);

  const publishTimelineEvent = useCallback(
    async (type: PulseType, customText?: string) => {
      const actor = actorName.trim() || "Viewer";
      const event: RoomTimelineEvent = {
        id: `${Date.now()}-${Math.random()}`,
        hpType: "live-studio-event",
        room: roomName,
        actor,
        role: "viewer",
        type,
        text: pulseText(type, actor, customText),
        createdAt: Date.now(),
      };

      addTimelineEvent(event);

      try {
        const encoded = new TextEncoder().encode(JSON.stringify(event));
        await liveRoom.localParticipant.publishData(encoded, { reliable: true });
      } catch (e) {
        console.error("Live Studio event publish failed:", e);
      }
    },
    [actorName, roomName, liveRoom, addTimelineEvent]
  );

  const onClap = () => {
    setClaps((v) => v + 1);
    publishTimelineEvent("Clap");
  };

  const onHot = () => {
    setHots((v) => v + 1);
    publishTimelineEvent("Hot");
  };

  const onMarker = () => {
    setMarkers((v) => v + 1);
    publishTimelineEvent("Marker");
  };

  const onComment = () => {
    const clean = comment.trim();
    if (!clean) return;
    publishTimelineEvent("Comment", clean);
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

        <div style={timelinePanel}>
          <div style={{ fontSize: 13, opacity: 0.7, fontWeight: 900 }}>
            ROOM TIMELINE
          </div>

          {timeline.length === 0 ? (
            <div style={{ marginTop: 10, opacity: 0.55, fontSize: 12 }}>
              Waiting for room activity.
            </div>
          ) : (
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              {timeline.map((item) => (
                <div key={item.id} style={timelineItem}>
                  <div style={{ fontSize: 12, opacity: 0.55 }}>
                    {timeFrom(item.createdAt)}
                  </div>
                  <div style={{ fontWeight: 900 }}>
                    {pulseLabel(item.type)} {item.actor}
                  </div>
                  <div style={{ opacity: 0.85 }}>{item.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function LiveViewer() {
  const { room } = useParams();
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState("");

  const [actorName, setActorName] = useState(() => {
    if (typeof window === "undefined") return "Viewer";
    return window.localStorage.getItem("hp_live_viewer_name") || "Viewer";
  });

  const roomName = String(room || "").trim();

  const viewerLinkName = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    return params.get("name") || "";
  }, []);

  useEffect(() => {
    if (!viewerLinkName) return;
    setActorName(viewerLinkName);
    window.localStorage.setItem("hp_live_viewer_name", viewerLinkName);
  }, [viewerLinkName]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("hp_live_viewer_name", actorName);
  }, [actorName]);

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

  if (!roomName) return <div style={pageShell}>Missing room.</div>;
  if (!token || !serverUrl) return <div style={pageShell}>Joining...</div>;

  return (
    <div style={pageShell}>
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

      <div style={headerRow}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 900 }}>
            HOMEPLANET LIVE STUDIO
          </div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>Live: {roomName}</div>
        </div>
      </div>

      <div style={identityCard}>
        <div style={{ fontSize: 12, opacity: 0.65, fontWeight: 900 }}>
          YOUR ROOM NAME
        </div>
        <input
          value={actorName}
          onChange={(e) => setActorName(e.target.value)}
          placeholder="Viewer name"
          style={identityInput}
        />
      </div>

      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        audio={false}
        video={false}
        style={{ background: "black" }}
      >
        <RoomAudioRenderer />
        <StartAudioButton />
        <ViewerControls />
        <ViewerStage />
        <ViewerActions roomName={roomName} actorName={actorName} />
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

const identityCard: React.CSSProperties = {
  marginBottom: 12,
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16,
  padding: 12,
  background: "rgba(255,255,255,0.04)",
};

const identityInput: React.CSSProperties = {
  marginTop: 8,
  width: "100%",
  boxSizing: "border-box",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  padding: "12px 14px",
  outline: "none",
  fontWeight: 800,
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

const timelinePanel: React.CSSProperties = {
  marginTop: 16,
  borderTop: "1px solid rgba(255,255,255,0.08)",
  paddingTop: 14,
};

const timelineItem: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: 10,
  background: "rgba(0,0,0,0.25)",
};
