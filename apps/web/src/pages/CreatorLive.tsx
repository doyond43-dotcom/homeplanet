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
 * - Explicit "Go Live" user-gesture gate (required for iOS/Android audio/mic)
 * - Force mic permission prompt on tap via getUserMedia (prevents dead toggles)
 * - Token fetch happens on tap (not on mount)
 * - Connect only after token is ready
 * - On connect: startAudio() + publish mic (and optionally cam)
 * - No silent white screen: renders error state
 *
 * DEV NOTE:
 * - In local dev, Vite doesn't serve /api/* (your Vercel serverless functions),
 *   so we route token fetches to production when hostname === localhost.
 * - Otherwise uses VITE_API_BASE (if set) or same-origin.
 */

type TokenResponse = {
  token: string;
  url: string;
};

function getApiBase(): string {
  // Local dev: always hit deployed token endpoint
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "https://www.homeplanet.city";
  }

  // Non-local: prefer env if set, else same-origin ("")
  const raw = (import.meta.env.VITE_API_BASE ?? "") as unknown as string;
  const trimmed = String(raw).trim();

  // Guard against common bad values
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return "";

  return trimmed;
}

const API_BASE = getApiBase();

function isMobileUA() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function fetchLiveKitToken(room: string, identity: string) {
  // If API_BASE is empty, we want same-origin: "/api/..."
  const prefix = API_BASE ? API_BASE.replace(/\/+$/, "") : "";
  const endpoint = `${prefix}/api/livekit-token?room=${encodeURIComponent(room)}&identity=${encodeURIComponent(
    identity
  )}`;

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
        zIndex: 20,
        backdropFilter: "blur(4px)",
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
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Tap to start audio</div>
        <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 12, lineHeight: 1.35 }}>
          Mobile browsers block audio until you tap. This unlocks playback so viewers can hear you and you can hear
          guests.
        </div>
        <button
          onClick={() => onUnlock()}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Start Audio
        </button>
      </div>
    </div>
  );
}

/** Host controls that talk directly to the Room */
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
          background: "linear-gradient(to top, rgba(0,0,0,0.70), rgba(0,0,0,0.0))",
        }}
      >
        <button
          onClick={toggleMic}
          style={{
            height: 44,
            minWidth: 110,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            background: wantMicOn ? "white" : "rgba(255,255,255,0.10)",
            color: wantMicOn ? "black" : "white",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {wantMicOn ? "Mic On" : "Mic Off"}
        </button>

        <button
          onClick={toggleCam}
          style={{
            height: 44,
            minWidth: 110,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            background: wantCamOn ? "white" : "rgba(255,255,255,0.10)",
            color: wantCamOn ? "black" : "white",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {wantCamOn ? "Cam On" : "Cam Off"}
        </button>

        <button
          onClick={onEnd}
          style={{
            height: 44,
            minWidth: 110,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,60,60,0.95)",
            color: "white",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          End
        </button>
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
    } catch (e) {
      console.error("room.startAudio failed:", e);
    }
  }, [room]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (mobile) {
          try {
            await room.startAudio();
            if (!cancelled) setAudioUnlocked(true);
          } catch {
            if (!cancelled) setAudioUnlocked(false);
          }
        }

        await room.localParticipant.setMicrophoneEnabled(wantMicOn);
        await room.localParticipant.setCameraEnabled(wantCamOn);
      } catch (e) {
        console.error("Initial publish failed:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "relative", height: "100dvh", width: "100vw", background: "black" }}>
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
  const roomName = useMemo(() => "creator-live", []);

  const [identity] = useState(() => randId("host"));
  const [serverUrl, setServerUrl] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const [phase, setPhase] = useState<"idle" | "loading" | "live" | "error">("idle");
  const [error, setError] = useState<string>("");

  const [wantMicOn, setWantMicOn] = useState(true);
  const [wantCamOn, setWantCamOn] = useState(false);

  const [connect, setConnect] = useState(false);

  const onGoLive = useCallback(async () => {
    setError("");
    setPhase("loading");

    try {
      // Force mic permission prompt as part of user gesture (mobile reliability)
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          throw new Error(
            "Microphone permission is blocked. On iPhone Safari: tap aA in the address bar → Website Settings → Microphone → Allow, then reload."
          );
        }
      }

      const { token, url } = await fetchLiveKitToken(roomName, identity);
      setToken(token);
      setServerUrl(url);

      setConnect(true);
      setPhase("live");
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to go live.");
      setPhase("error");
      setConnect(false);
    }
  }, [roomName, identity]);

  const onEnd = useCallback(() => {
    setConnect(false);
    setPhase("idle");
    navigate("/planet/creator");
  }, [navigate]);

  if (phase !== "live") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "black",
          color: "white",
          padding: 16,
          paddingTop: "calc(16px + env(safe-area-inset-top))",
        }}
      >
        <div style={{ maxWidth: 520, width: "100%" }}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Creator Live</div>

          <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 14, lineHeight: 1.4 }}>
            {mobile
              ? "Mobile requires a tap to enable mic/audio. Hit Go Live to grant permissions and start streaming."
              : "Hit Go Live to start streaming."}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => setWantMicOn((v) => !v)}
              style={{
                height: 44,
                borderRadius: 12,
                padding: "0 14px",
                border: "1px solid rgba(255,255,255,0.18)",
                background: wantMicOn ? "white" : "rgba(255,255,255,0.10)",
                color: wantMicOn ? "black" : "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
              disabled={phase === "loading"}
            >
              {wantMicOn ? "Mic: ON" : "Mic: OFF"}
            </button>

            <button
              onClick={() => setWantCamOn((v) => !v)}
              style={{
                height: 44,
                borderRadius: 12,
                padding: "0 14px",
                border: "1px solid rgba(255,255,255,0.18)",
                background: wantCamOn ? "white" : "rgba(255,255,255,0.10)",
                color: wantCamOn ? "black" : "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
              disabled={phase === "loading"}
            >
              {wantCamOn ? "Cam: ON" : "Cam: OFF"}
            </button>
          </div>

          <button
            onClick={onGoLive}
            disabled={phase === "loading"}
            style={{
              width: "100%",
              height: 50,
              borderRadius: 14,
              border: "none",
              fontWeight: 900,
              cursor: "pointer",
              opacity: phase === "loading" ? 0.75 : 1,
            }}
          >
            {phase === "loading" ? "Starting…" : "Go Live"}
          </button>

          {phase === "error" && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(255,80,80,0.35)",
                background: "rgba(255,80,80,0.10)",
                color: "white",
                fontSize: 13,
                whiteSpace: "pre-wrap",
              }}
            >
              {error || "Unknown error"}
            </div>
          )}

          <div style={{ marginTop: 14, fontSize: 11, opacity: 0.6 }}>
            room: {roomName} • identity: {identity} • api: {API_BASE || "(same-origin)"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={connect}
      audio={true}
      video={true}
      onDisconnected={() => {
        setConnect(false);
        setPhase("idle");
      }}
      onError={(e) => {
        console.error("LiveKitRoom error:", e);
        setError(String((e as any)?.message || e));
        setPhase("error");
        setConnect(false);
      }}
      style={{ height: "100dvh", width: "100vw", background: "black" }}
    >
      <HostRoomInner
        wantMicOn={wantMicOn}
        setWantMicOn={setWantMicOn}
        wantCamOn={wantCamOn}
        setWantCamOn={setWantCamOn}
        onEnd={onEnd}
        mobile={mobile}
      />
    </LiveKitRoom>
  );
}
