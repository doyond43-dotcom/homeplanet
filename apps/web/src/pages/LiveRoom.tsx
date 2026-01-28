
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  ControlBar,
  useTracks,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

function randId() {
  return "viewer_" + Math.random().toString(16).slice(2);
}

// ✅ Must render under <LiveKitRoom> so hooks can access Room context
function Stage() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: true },
  ]);

  return (
    <GridLayout tracks={tracks} style={{ height: "100%" }}>
      <ParticipantTile />
    </GridLayout>
  );
}

export default function LiveRoom() {
  const { room } = useParams();
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const identity = useMemo(() => randId(), []);

  useEffect(() => {
    if (!room) return;

    let alive = true;

    (async () => {
      try {
        setErr(null);

        const qs = new URLSearchParams({
          room,
          identity,
          name: "Viewer",
          role: "viewer",
        });

        const r = await fetch(`/api/livekit-token?${qs.toString()}`);
        const j = await r.json();

        if (!r.ok) throw new Error(j?.error ?? "token failed");
        if (!j?.token || typeof j.token !== "string") throw new Error("Bad token response");

        if (!alive) return;
        setToken(j.token);
        setUrl(j.url);
      } catch (e: any) {
        if (!alive) return;
        setErr(String(e?.message || e));
        console.warn("live token error", e);
      }
    })();

    return () => {
      alive = false;
    };
  }, [room, identity]);

  if (!room) return <div>Missing room.</div>;
  if (err) return <div style={{ padding: 18 }}>LiveKit error: {err}</div>;
  if (!token || !url) return <div style={{ opacity: 0.8 }}>Loading live stream…</div>;

  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ marginTop: 0 }}>Live: {room}</h2>

      <LiveKitRoom
        token={token}
        serverUrl={url}
        connect
        // viewer does NOT publish local mic/cam…
        video={false}
        // …but MUST enable audio playback pipeline for mobile/desktop viewers
        audio={true}
        data-lk-theme="default"
        style={{ height: "70vh" }}
      >
        {/* ✅ Ensures subscribed audio actually renders/plays */}
        <RoomAudioRenderer />

        <Stage />
        <ControlBar />
      </LiveKitRoom>
    </div>
  );
}

