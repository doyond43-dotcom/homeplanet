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
import { Track } from "livekit-client";

/**
 * CreatorLive.tsx — mobile-stable host page
 * Fixes:
 * - Never render LiveKitRoom until token+serverUrl exist (prevents white screen)
 * - Proper deps for Go Live permission gate
 * - Audio unlock overlay fully disappears after unlock (no invisible tap-blocker)
 */

type TokenResponse = {
  token: string;
  url: string;
};

function getApiBase(): string {
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "https://www.homeplanet.city";
  }

  const raw = (import.meta.env.VITE_API_BASE ?? "") as unknown as string;
  const trimmed = String(raw).trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return "";
  return trimmed;
}

const API_BASE = getApiBase();

function isMobileUA() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function fetchLiveKitToken(room: string, identity: string) {
  const prefix = API_BASE ? API_BASE.replace(/\/+$/, "") : "";
  const endpoint = `${prefix}/api/livekit-token?room=${encodeURIComponent(
    room
  )}&identity=${encodeURIComponent(identity)}`;

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

function randId(prefix = "creator") {
  return `${prefix}_${Math.random().toString(16).slice(2)}`;
}

/** Host video stage */
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

/** Mobile audio unlock overlay */
function AudioUnlockOverlay({
  show,
  onUnlock,
}: {
  show: boolean;
  onUnlock: () => Promise<void> | void;
}) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.55)",
        zIndex: 30,
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          background: "rgba(20,20,20,0.92)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 14,
          padding: 16,
          color: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>
          Tap to start audio
        </div>
        <div
          style={{
            fontSize: 13,
            opacity: 0.9,
            marginBottom: 12,
            lineHeight: 1.35,
          }}
        >
          iPhone/Android browsers block audio until you tap. This unlocks playback so
          viewers can hear you and you can hear guests.
        </div>
        <button
          onClick={() => onUnlock()}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontWeight: 900,
            background: "white",
            color: "black",
          }}
        >
          Start Audio
        </button>
      </div>
    </div>
  );
}

/** Host controls */
function HostControls({
  wantMicOn,
  setWantMicOn,
  wantCamOn,
  setWantCamOn,
  onEnd,
  showAudioUnlock,
  onUnlockAudio,
}: {
  wantMicOn: boolean;
  setWantMicOn: (v: boolean) => void;
  wantCamOn: boolean;
  setWantCamOn: (v: boolean) => void;
  onEnd: () => void;
  showAudioUnlock: boolean;
  onUnlockAudio: () => Promise<void> | void;
}) {
  const room = useRoomContext();

  const toggleMic = async () => {
    const next = !wantMicOn;
    setWantMicOn(next);
    try {
      await room.localParticipant.setMicrophoneEnabled(next);
    } catch (e) {
      console.error("Mic toggle failed:", e);
    }
  };

  const toggleCam = async () => {
    const next = !wantCamOn;
    setWantCamOn(next);
    try {
      await room.localParticipant.setCameraEnabled(next);
    } catch (e) {
      console.error("Cam toggle failed:", e);
    }
  };

  return (
    <>
      <AudioUnlockOverlay show={showAudioUnlock} onUnlock={onUnlockAudio} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 12,
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
          display: "flex",
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.70), rgba(0,0,0,0.0))",
        }}
      >
        <button onClick={toggleMic}>{wantMicOn ? "Mic On" : "Mic Off"}</button>
        <button onClick={toggleCam}>{wantCamOn ? "Cam On" : "Cam Off"}</button>
        <button onClick={onEnd}>End</button>
      </div>
    </>
  );
}

function HostRoomInner({
  wantMicOn,
  setWantMicOn,
  wantCamOn,
  setWantCamOn,
  onEnd,
  mobile,
}: {
  wantMicOn: boolean;
  setWantMicOn: (v: boolean) => void;
  wantCamOn: boolean;
  setWantCamOn: (v: boolean) => void;
  onEnd: () => void;
  mobile: boolean;
}) {
  const room = useRoomContext();
  const [audioUnlocked, setAudioUnlocked] = useState(!mobile);

  const unlockAudio = useCallback(async () => {
    try {
      await room.startAudio();
      setAudioUnlocked(true);
    } catch {
      setAudioUnlocked(false);
    }
  }, [room]);

  useEffect(() => {
    (async () => {
      try {
        if (mobile) {
          try {
            await room.startAudio();
            setAudioUnlocked(true);
          } catch {
            setAudioUnlocked(false);
          }
        }

        await room.localParticipant.setMicrophoneEnabled(wantMicOn);
        await room.localParticipant.setCameraEnabled(wantCamOn);
      } catch (e) {
        console.error("Initial publish failed:", e);
      }
    })();
  }, []);

  return (
    <div style={{ position: "relative", height: "100dvh", width: "100vw" }}>
      <RoomAudioRenderer />
      <HostStage />
      <HostControls
        wantMicOn={wantMicOn}
        setWantMicOn={setWantMicOn}
        wantCamOn={wantCamOn}
        setWantCamOn={setWantCamOn}
        onEnd={onEnd}
        showAudioUnlock={mobile && !audioUnlocked}
        onUnlockAudio={unlockAudio}
      />
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

  const [phase, setPhase] =
    useState<"idle" | "loading" | "live" | "error">("idle");

  const [error, setError] = useState("");

  const [wantMicOn, setWantMicOn] = useState(true);
  const [wantCamOn, setWantCamOn] = useState(true);

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

  const readyToMount = phase === "live" && !!token && !!serverUrl;

  if (!readyToMount) {
    return (
      <div>
        <button onClick={onGoLive}>Go Live</button>
        {error && <pre>{error}</pre>}
      </div>
    );
  }

  return (
    <LiveKitRoom token={token} serverUrl={serverUrl} connect audio video>
      <HostRoomInner
        wantMicOn={wantMicOn}
        setWantMicOn={setWantMicOn}
        wantCamOn={wantCamOn}
        setWantCamOn={setWantCamOn}
        onEnd={() => navigate("/planet/creator")}
        mobile={mobile}
      />
    </LiveKitRoom>
  );
}

