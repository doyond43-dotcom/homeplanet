import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { ConnectionState, RoomEvent } from "livekit-client";
import { supabase } from "../lib/supabase";

type Connection = {
  token: string;
  url: string;
  room: string;
  guestRole?: "viewer" | "participant";
  sessionExpiresAt?: string;
};

type PrivateMeetingProps = {
  mode: "host" | "guest";
};

function ParticipantCounter() {
  const room = useRoomContext();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      setCount(
        room.state === ConnectionState.Connected
          ? 1 + room.remoteParticipants.size
          : 0
      );
    };

    update();

    room.on(RoomEvent.Connected, update);
    room.on(RoomEvent.ParticipantConnected, update);
    room.on(RoomEvent.ParticipantDisconnected, update);
    room.on(RoomEvent.Disconnected, update);

    return () => {
      room.off(RoomEvent.Connected, update);
      room.off(RoomEvent.ParticipantConnected, update);
      room.off(RoomEvent.ParticipantDisconnected, update);
      room.off(RoomEvent.Disconnected, update);
    };
  }, [room]);

  return (
    <div style={{
      position: "absolute",
      top: 58,
      left: 18,
      zIndex: 20,
      background: "#152235",
      color: "#79e4a5",
      padding: "10px 16px",
      borderRadius: 10,
      fontWeight: 700,
    }}>
      Connected: {count}
    </div>
  );
}
export default function LiveStudioPrivateMeeting({
  mode,
}: PrivateMeetingProps) {
  const { meetingId, invitationToken } = useParams();
  const [searchParams] = useSearchParams();

  const [connection, setConnection] = useState<Connection | null>(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [left, setLeft] = useState(false);
  const creatorMode = mode === "host" && searchParams.get("creator") === "1";
  const [inviteLink, setInviteLink] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const autoJoined = useRef(false);

  async function copyCreatorInvite() {
    if (!creatorMode || !meetingId || inviteBusy) return;
    setInviteBusy(true);
    setInviteError("");
    setCopied(false);
    try {
      // Generate a fresh, single-use guest link only when requested.
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session?.access_token) throw new Error("Sign in to invite someone.");
      const response = await fetch("/api/live-studio-invitations", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session.access_token}` },
        body: JSON.stringify({ meetingId, guestRole: "participant", invitedEmail: null, expiresMinutes: 60, maxUses: 1 }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Couldn't create an invitation.");
      if (typeof result.invitationToken !== "string" || result.invitationToken.length < 16) throw new Error("Invalid invitation response.");
      const link = `${window.location.origin}/live-studio/join/${encodeURIComponent(result.invitationToken)}`;
      setInviteLink(link);
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
      } catch {
        // Keep a selectable link displayed for browsers that block clipboard access.
        setInviteError("Copy the invitation link below to send it.");
      }
    } catch (cause) {
      setInviteError(cause instanceof Error ? cause.message : "Unable to invite someone.");
    } finally {
      setInviteBusy(false);
    }
  }

  const joinMeeting = useCallback(async () => {
    if (joining) return;

    setJoining(true);
    setError("");

    try {
      let endpoint: string;
      let body: Record<string, string>;
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (mode === "host") {
        const { data, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError || !data.session?.access_token) {
          throw new Error("Please sign in to HomePlanet.");
        }

        if (!meetingId) {
          throw new Error("Meeting ID missing.");
        }

        endpoint = "/api/live-studio-private-host-token";
        body = { meetingId };

        headers = {
          ...headers,
          Authorization: `Bearer ${data.session.access_token}`,
        };
      } else {
        const token =
          invitationToken || searchParams.get("invitation");

        if (!token) {
          throw new Error("Invitation is missing.");
        }

        endpoint = "/api/live-studio-guest-access";
        body = { invitationToken: token };
      }

      let response: Response;
      let result: Record<string, unknown> = {};

      // Returning guests can use the original invitation URL while their
      // protected, server-validated browser session remains active.
      // The server binds the reconnect cookie to the invitation's meeting.
      if (mode === "guest") {
        const guestToken = invitationToken || searchParams.get("invitation");
        if (!guestToken) throw new Error("Invitation is missing.");
        const reconnectResponse = await fetch("/api/live-studio-guest-reconnect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ invitationToken: guestToken }),
        });
        if (reconnectResponse.ok) {
          response = reconnectResponse;
          result = await response.json().catch(() => ({}));
        } else {
          response = await fetch(endpoint, {
            method: "POST", headers, credentials: "same-origin",
            body: JSON.stringify(body),
          });
          result = await response.json().catch(() => ({}));
        }
      } else {
        response = await fetch(endpoint, {
          method: "POST", headers, credentials: "same-origin",
          body: JSON.stringify(body),
        });
        result = await response.json().catch(() => ({}));
      }

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Unable to join the meeting."
        );
      }

      if (
        typeof result.token !== "string" ||
        typeof result.url !== "string" ||
        typeof result.room !== "string"
      ) {
        throw new Error("Invalid meeting connection.");
      }

      setConnection(result as Connection);
      setLeft(false);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Meeting connection unavailable."
      );
    } finally {
      setJoining(false);
    }
  }, [mode, meetingId, invitationToken, searchParams, joining]);

  useEffect(() => {
    if (creatorMode && searchParams.get("autojoin") === "1" && !autoJoined.current) {
      autoJoined.current = true;
      void joinMeeting();
    }
  }, [creatorMode, searchParams, joinMeeting]);

  if (left) {
    return (
      <main style={pageStyle}>
        <section style={welcomeStyle}>
          <h2>You left the meeting</h2>
          <p>Use your original link to rejoin while the meeting is active and your guest session remains valid.</p>
          <button type="button" onClick={() => { setLeft(false); void joinMeeting(); }} style={joinButtonStyle}>
            Rejoin Meeting
          </button>
        </section>
      </main>
    );
  }

  if (!connection) {
    return (
      <main style={pageStyle}>
        <section style={welcomeStyle}>
          <div style={{ fontSize: 14, letterSpacing: 2, color: "#8ef0b0" }}>
            HOMEPLANET SYSTEMS
          </div>

          <h1>Live Studio</h1>

          <p>
            {mode === "host"
              ? "Your private meeting is ready to open."
              : "You've been invited to a private HomePlanet meeting."}
          </p>

          {error && (
            <p role="alert" style={{ color: "#ff9999" }}>
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={joinMeeting}
            disabled={joining}
            style={joinButtonStyle}
          >
            {joining ? "Connecting..." : "Join Meeting"}
          </button>

          <p style={{ fontSize: 12, opacity: 0.65 }}>
            Powerful underneath. Simple in your hands.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <strong>HOMEPLANET LIVE STUDIO</strong>
        <span>{creatorMode ? "Your Conversation" : "Private Meeting"}</span>
      </header>

      {creatorMode && (
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "10px 18px", background: "#13213b" }}>
          <button type="button" onClick={() => void copyCreatorInvite()} disabled={inviteBusy}
            style={{ background: "#83e3b1", color: "#10213a", border: 0, borderRadius: 10, padding: "12px 20px", fontWeight: 750, cursor: "pointer" }}>
            {inviteBusy ? "Creating link..." : "Invite Someone"}
          </button>
          <span style={{ color: "#c7d6eb", fontSize: 13 }}>
            {copied ? "Link copied. Send it to someone to join your conversation." : "Invite someone to join your video conversation."}
          </span>
          {inviteError && <span role="alert" style={{ color: "#ffb1b1", fontSize: 13 }}>{inviteError}</span>}
          {inviteLink && <input aria-label="Guest invitation link" readOnly value={inviteLink} onFocus={(event) => event.target.select()}
            style={{ width: "100%", minWidth: 0, padding: 8, background: "#0b1529", border: "1px solid #48658c", color: "#fff", borderRadius: 6 }} />}
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0 }}>
        <style>{`
  /* homeplanet-video-layout-fix */
  .lk-video-conference,
  .lk-video-conference-inner,
  .lk-focus-layout-wrapper,
  .lk-grid-layout-wrapper,
  .lk-grid-layout {
    height: 100% !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }

  .lk-participant-tile {
    min-width: 0 !important;
    min-height: 0 !important;
    overflow: hidden !important;
  }

  .lk-chat-form input,
  .lk-chat-form textarea,
  .lk-chat-form .lk-chat-form-input,
  .lk-chat-form-input,
  .lk-chat-entry-input {
    background: #f3f6fb !important;
    color: #0b1529 !important;
    -webkit-text-fill-color: #0b1529 !important;
    caret-color: #0b1529 !important;
    opacity: 1 !important;
  }
  .lk-chat-form input::placeholder,
  .lk-chat-form textarea::placeholder {
    color: #65758b !important;
    -webkit-text-fill-color: #65758b !important;
  }
`}</style>
        <LiveKitRoom
          token={connection.token}
          serverUrl={connection.url}
          connect={true}
          audio={connection.guestRole !== "viewer"}
          video={connection.guestRole !== "viewer"}
          onConnected={() => {
            if (mode !== "host" || !meetingId) return;
            void supabase.auth.getSession().then(({ data }) => {
              const accessToken = data.session?.access_token;
              if (!accessToken) return;
              return fetch("/api/live-studio-start-meeting", {
                method: "POST", credentials: "same-origin",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
                body: JSON.stringify({ meetingId }),
              }).then(async (response) => {
                if (!response.ok) console.warn("Meeting start timestamp not recorded:", response.status);
              });
            }).catch(() => console.warn("Meeting start timestamp unavailable"));
          }}
          onDisconnected={() => {
            setConnection(null);
            setLeft(true);
          }}
          style={{ height: "100%" }}
        >
          <div style={{
            position: "absolute",
            top: 110,
            left: 18,
            zIndex: 20,
            background: "#152235",
            color: "#ffffff",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
          }}>
            Room: {connection.room}
          </div>
          <ParticipantCounter />
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </main>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: 0, height: "100dvh", overflow: "hidden",
  background: "#0a1422",
  color: "#ffffff",
  display: "flex",
  flexDirection: "column",
  fontFamily: "Arial, sans-serif",
};

const welcomeStyle: React.CSSProperties = {
  maxWidth: 520,
  width: "calc(100% - 40px)",
  margin: "auto",
  padding: 32,
  textAlign: "center",
  background: "#152235",
  borderRadius: 18,
};

const joinButtonStyle: React.CSSProperties = {
  border: 0,
  borderRadius: 12,
  background: "#70e4a0",
  color: "#102018",
  padding: "14px 28px",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 24px",
  background: "#111e30",
};
