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

function ViewerStage() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: true },
    ],
    { onlySubscribed: true }
  );

  return (
    <GridLayout tracks={tracks} style={{ height: "70vh" }}>
      <ParticipantTile />
    </GridLayout>
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
      <button
        onClick={onStart}
        style={{
          height: 44,
          padding: "0 16px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "white",
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        Start Audio
      </button>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        {status === "idle" && "Tap once to enable sound in this tab."}
        {status === "ok" && "Audio enabled ✅"}
        {status === "fail" && "Audio blocked ❌ (check browser/site sound + permissions)"}
      </div>
    </div>
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

  if (!room) return <div style={{ padding: 16 }}>Missing room.</div>;
  if (!token || !serverUrl) return <div style={{ padding: 16 }}>Joining…</div>;

  return (
    <div style={{ padding: 16, background: "black", color: "white", minHeight: "100vh" }}>
      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>Live: {room}</div>

      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        audio={true}   // ✅ viewer playback ON
        video={false}  // ✅ viewer does NOT publish
        style={{ background: "black" }}
      >
        <RoomAudioRenderer />
        <StartAudioButton />
        <ViewerStage />
      </LiveKitRoom>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        If you still can’t hear: make sure the HOST mic is not muted and your browser tab/site is not muted.
      </div>
    </div>
  );
}
