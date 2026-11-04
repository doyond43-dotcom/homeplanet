import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function CreatorCityLiveStudio() {
  const [showForm, setShowForm] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinLink, setJoinLink] = useState("");
  const [joinError, setJoinError] = useState("");
  const [title, setTitle] = useState("HomePlanet Conversation");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [myMeetings, setMyMeetings] = useState<Array<{
    meetingId: string;
    title: string;
    status: string;
    createdAt: string;
    scheduledAt?: string | null;
    startedAt?: string | null;
    endedAt?: string | null;
  }>>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [loadingMeetings, setLoadingMeetings] = useState(true);
  const [meetingsError, setMeetingsError] = useState("");
  const [endingMeetingId, setEndingMeetingId] = useState("");
  const [endMeetingError, setEndMeetingError] = useState("");
  const [endMeetingWarning, setEndMeetingWarning] = useState("");
  const [inviting, setInviting] = useState(false);
  const [selectedInviteMeetingId, setSelectedInviteMeetingId] = useState("");
  const [invitationError, setInvitationError] = useState("");
  const [invitations, setInvitations] = useState<string[]>([]);

  function joinFromInvitation() {
    setJoinError("");
    try {
      const value = joinLink.trim();
      if (!value) throw new Error("Paste your invitation link first.");
      const parsed = new URL(value, window.location.origin);
      if (
        parsed.origin !== window.location.origin ||
        !/^\/live-studio\/join\/[A-Za-z0-9._~-]{16,}$/.test(parsed.pathname)
      ) {
        throw new Error("Use a valid HomePlanet invitation link.");
      }
      window.location.assign(parsed.pathname);
    } catch {
      setJoinError("Paste a valid HomePlanet invitation link.");
    }
  }

  async function createPrivateMeeting() {
    if (creating) return;

    setCreating(true);
    setError("");

    try {
      const cleanTitle = title.trim();

      if (!cleanTitle || cleanTitle.length > 200) {
        throw new Error("Enter a meeting title (maximum 200 characters).");
      }

      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !data.session?.access_token) {
        throw new Error("Please sign in to HomePlanet first.");
      }

      const response = await fetch("/api/live-studio-meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({
          title: cleanTitle,
          businessId: null,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : `Meeting creation unavailable (${response.status}).`
        );
      }

      if (
        typeof result.meetingId !== "string" ||
        !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(result.meetingId)
      ) {
        throw new Error("Invalid meeting creation response.");
      }

      setMeetingId(result.meetingId);
      setShowForm(false);
      window.location.assign(`/planet/live-studio/meeting/${encodeURIComponent(result.meetingId)}?creator=1&autojoin=1`);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to create the meeting."
      );
    } finally {
      setCreating(false);
    }
  }

  async function createGuestInvitation(selectedMeetingId?: string) {
    if (inviting || !(selectedMeetingId || meetingId)) return;

    if (selectedMeetingId) {
      if (selectedInviteMeetingId !== selectedMeetingId) {
        setInvitations([]);
      }
      setSelectedInviteMeetingId(selectedMeetingId);
    }

    setInviting(true);
    setInvitationError("");

    try {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !data.session?.access_token) {
        throw new Error("Please sign in to HomePlanet first.");
      }

      const response = await fetch("/api/live-studio-invitations", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({
          meetingId: selectedMeetingId || meetingId,
          guestRole: "participant",
          invitedEmail: null,
          expiresMinutes: 60,
          maxUses: 1,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : `Invitation creation unavailable (${response.status}).`
        );
      }

      if (
        typeof result.invitationToken !== "string" ||
        result.invitationToken.length < 16
      ) {
        throw new Error("Invalid invitation response.");
      }

      const invitationUrl =
        window.location.origin +
        "/live-studio/join/" +
        encodeURIComponent(result.invitationToken);

      setInvitations((previous) => [...previous, invitationUrl]);
    } catch (cause) {
      setInvitationError(
        cause instanceof Error
          ? cause.message
          : "Unable to create invitation."
      );
    } finally {
      setInviting(false);
    }
  }
  async function endMeeting(selectedMeetingId: string) {
    if (endingMeetingId) return;
    if (!window.confirm("End this meeting for everyone? This cannot be undone.")) return;
    setEndingMeetingId(selectedMeetingId);
    setEndMeetingError("");
    setEndMeetingWarning("");
    try {
      const { data, error: authError } = await supabase.auth.getSession();
      if (authError || !data.session?.access_token) throw new Error("Please sign in first.");
      const response = await fetch("/api/live-studio-end-meeting", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session.access_token}`,
        },
        body: JSON.stringify({ meetingId: selectedMeetingId }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "Unable to end meeting.");
      if (result.status !== "ended") throw new Error("Unexpected end meeting response.");
      if (selectedInviteMeetingId === selectedMeetingId) {
        setSelectedInviteMeetingId("");
        setInvitations([]);
      }
      await loadMyMeetings();
      if (result.cleanupPending) {
        setEndMeetingWarning("Meeting marked ended, but video-room cleanup needs administrator attention.");
      }
    } catch (cause) {
      setEndMeetingError(cause instanceof Error ? cause.message : "Unable to end meeting.");
    } finally {
      setEndingMeetingId("");
    }
  }

  async function loadMyMeetings() {
    setLoadingMeetings(true);
    setMeetingsError("");

    try {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !data.session?.access_token) {
        throw new Error("Sign in to view your meetings.");
      }

      const response = await fetch("/api/live-studio-meetings", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
        credentials: "same-origin",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Unable to load meetings."
        );
      }

      setMyMeetings(
        Array.isArray(result.meetings)
          ? result.meetings
          : []
      );
    } catch (cause) {
      setMeetingsError(
        cause instanceof Error
          ? cause.message
          : "Unable to load meetings."
      );
    } finally {
      setLoadingMeetings(false);
    }
  }

  useEffect(() => {
    void loadMyMeetings();
  }, []);
  function formatMeetingDate(value?: string | null): string {
    if (!value) return "Not recorded";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Not recorded" : date.toLocaleString();
  }

  function formatConversationDay(value?: string | null): string {
    if (!value) return "Date not recorded";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Date not recorded" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  function formatConversationTime(value?: string | null): string {
    if (!value) return "Not recorded";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Not recorded" : date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function formatMeetingDuration(start?: string | null, end?: string | null): string {
    if (!start || !end) return "Not recorded";
    const duration = new Date(end).getTime() - new Date(start).getTime();
    if (!Number.isFinite(duration) || duration < 0) return "Not recorded";
    const minutes = Math.floor(duration / 60000);
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
  }

  const cardStyle: React.CSSProperties = {
    border: "1px solid rgba(166,196,255,0.13)",
    borderRadius: 22,
    padding: 26,
    background: "rgba(16,24,45,0.92)",
  };
  const buttonStyle: React.CSSProperties = {
    padding: "14px 23px", borderRadius: 12, border: "none", cursor: "pointer",
    fontWeight: 750, fontSize: 15, background: "#8be5d1", color: "#091a2d",
  };

  return (
    <div style={{ minHeight: "100vh", color: "#f5f8ff", padding: "0 22px 85px",
      fontFamily: "Inter, system-ui, sans-serif", background:
      "radial-gradient(ellipse at 50% -15%, #253f83 0%, #0c1734 43%, #080d20 83%)" }}>
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "26px 0", gap: 14, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, letterSpacing: "0.16em", fontWeight: 800, color: "#a9d7ff" }}>
            HOMEPLANET <span style={{ color: "#839ac4" }}> / CREATOR CITY</span>
          </div>
          <div style={{ fontSize: 12, color: "#9db4d5" }}>POWERFUL UNDERNEATH. SIMPLE IN YOUR HANDS.</div>
        </header>
        <section style={{ position: "relative", overflow: "hidden", minHeight: 390, borderRadius: 28,
          border: "1px solid rgba(169,206,255,0.22)", boxShadow: "0 25px 90px rgba(0,0,0,.26)",
          background: "radial-gradient(ellipse at 88% 70%, rgba(133,55,205,.42), transparent 38%), radial-gradient(ellipse at 70% 16%, rgba(40,139,216,.4), transparent 50%), linear-gradient(115deg, #101f3b 7%, #162756 60%, #281d55)" }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: .54, pointerEvents: "none",
            backgroundImage: "linear-gradient(transparent 95%,rgba(117,187,255,.1) 96%), linear-gradient(90deg,transparent 96%,rgba(117,187,255,.1) 97%)",
            backgroundSize: "55px 55px", transform: "perspective(350px) rotateX(48deg) scale(1.6) translateY(35%)" }} />
          <div style={{ position: "relative", zIndex: 1, padding: "clamp(32px, 5.5vw, 72px)", maxWidth: 800 }}>
            <div style={{ fontSize: 12, letterSpacing: ".24em", color: "#9cdfff", fontWeight: 800 }}>
              YOUR CONNECTION STARTS HERE
            </div>
            <h1 style={{ fontSize: "clamp(49px, 7.5vw, 90px)", lineHeight: 1.04, letterSpacing: "-.055em",
              margin: "18px 0 20px", fontWeight: 850 }}>Live <span style={{ color: "#99dffe" }}>Studio.</span></h1>
            <p style={{ color: "#d2ddf5", fontSize: "clamp(17px, 2vw, 22px)", lineHeight: 1.55,
              maxWidth: 610, margin: "0 0 31px" }}>
              Your space to connect, create and share ideas. A private conversation with the people who matter to you.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button type="button" onClick={() => { setShowJoin(false); setShowForm(true); void createPrivateMeeting(); }}
                disabled={creating}
                style={{ ...buttonStyle, opacity: creating ? .65 : 1, background: "#92ddff", color: "#091b35" }}>{creating ? "Opening your video room..." : "Start a conversation"}</button>
              <button type="button" onClick={() => { setShowJoin(true); setShowForm(false); }}
                style={{ ...buttonStyle, color: "#f4f8ff", background: "rgba(13,24,52,.65)",
                  border: "1px solid rgba(194,221,255,.57)" }}>Join a conversation</button>
            </div>
            <p style={{ color: "#b2c5e0", fontSize: 12, marginTop: 22, marginBottom: 0 }}>
              Private by invitation · Secure video conversations
            </p>
          </div>
        </section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: 20, flexWrap: "wrap", margin: "39px 4px 22px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 23, letterSpacing: "-.025em" }}>Make space for connection.</h2>
            <p style={{ color: "#aabbd5", margin: "8px 0 0", fontSize: 15 }}>
              Catch up with friends. Work with a creator. Bring an idea to life together.
            </p>
          </div>
          <div style={{ color: "#a6bcda", fontSize: 13 }}>ONE STUDIO. YOUR PEOPLE.</div>
        </div>
        {showJoin && (
        <div id="hp-live-studio-join" style={{ ...cardStyle, marginBottom: 20 }}>
          <h2 style={{ marginTop: 0 }}>Join a conversation</h2>
          <p style={{ color: "#c7d3e0" }}>Already have a HomePlanet invitation? Paste the link here.</p>
          <form onSubmit={(event) => { event.preventDefault(); joinFromInvitation(); }}
            style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <input aria-label="Invitation link" type="text" value={joinLink}
              onChange={(event) => { setJoinLink(event.target.value); setJoinError(""); }}
              placeholder="Paste your invitation link"
              style={{ flex: "1 1 260px", minWidth: 0, padding: "12px 14px", background: "#172333", color: "#fff", border: "1px solid #425368", borderRadius: 10 }} />
            <button type="submit" style={buttonStyle}>Join</button>
          </form>
          {joinError && <p role="alert" style={{ color: "#ff9999" }}>{joinError}</p>}
        </div>
        )}

        <div style={{ display: "grid", gap: 20 }}>
          {(showForm || Boolean(meetingId)) && <div id="hp-live-studio-start" style={cardStyle}>
            <h2>Start a conversation</h2>
            <p>Create your private video space and invite the people you want to connect with.</p>

            {!showForm && !meetingId && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowForm(true);
                }}
                style={buttonStyle}
              >
                Start a conversation
              </button>
            )}

            {showForm && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void createPrivateMeeting();
                }}
                style={{ display: "grid", gap: 14, maxWidth: 480 }}
              >
                <label htmlFor="hp-meeting-title">
                  Meeting title
                </label>

                <input
                  id="hp-meeting-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={200}
                  required
                  style={{
                    padding: 14,
                    borderRadius: 10,
                    border: "1px solid #425368",
                    background: "#172333",
                    color: "#fff",
                    fontSize: 16,
                  }}
                />

                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    ...buttonStyle,
                    opacity: creating ? 0.6 : 1,
                  }}
                >
                  {creating ? "Creating..." : "Create Private Meeting"}
                </button>

                <button
                  type="button"
                  disabled={creating}
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  style={{
                    background: "transparent",
                    color: "#ddd",
                    border: "1px solid #425368",
                    borderRadius: 10,
                    padding: 12,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </form>
            )}

            {error && (
              <p role="alert" style={{ color: "#ff9999" }}>
                {error}
              </p>
            )}

            {meetingId && !selectedInviteMeetingId && (
              <div style={{ display: "grid", gap: 12 }}>
                <p style={{ color: "#79e4a5" }}>
                  Your video room is ready.
                </p>

                <a
                  href={`/planet/live-studio/meeting/${encodeURIComponent(meetingId)}`}
                  style={{
                    ...buttonStyle,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "fit-content",
                    textDecoration: "none",
                    background: "#92ddff",
                    color: "#091b35",
                  }}
                >
                  Enter My Video Room
                </a>

                                <div style={{ marginTop: 20 }}>
                  <h3>Invite Guests</h3>

                  <p style={{ fontSize: 14, opacity: 0.8 }}>
                    Create one private invitation for each participant.
                    Every guest joins this same meeting.
                  </p>

                  <button
                    type="button"
                    onClick={() => void createGuestInvitation()}
                    disabled={inviting}
                    style={{
                      ...buttonStyle,
                      opacity: inviting ? 0.6 : 1,
                    }}
                  >
                    {inviting
                      ? "Creating Invitation..."
                      : "Invite Someone"}
                  </button>

                  <p style={{ fontSize: 13, opacity: 0.8, marginTop: 10 }}>
                    How it works: Enter your video room, invite someone with a private link, and start talking when they join.
                  </p>

                  {invitationError && (
                    <p role="alert" style={{ color: "#ff9999" }}>
                      {invitationError}
                    </p>
                  )}

                  {invitations.map((url, index) => (
                    <div
                      key={url}
                      style={{
                        display: "grid",
                        gap: 8,
                        marginTop: 16,
                      }}
                    >
                      <label htmlFor={`invitation-${index}`}>
                        Guest {index + 1} Invitation
                      </label>

                      <input
                        id={`invitation-${index}`}
                        type="text"
                        readOnly
                        value={url}
                        onFocus={(event) => event.currentTarget.select()}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          padding: 12,
                          borderRadius: 10,
                          background: "#172333",
                          color: "#ffffff",
                          border: "1px solid #425368",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard.writeText(url).catch(() => {
                            setInvitationError(
                              "Copy unavailable. Select and copy the link above."
                            );
                          });
                        }}
                        style={{
                          padding: 10,
                          borderRadius: 10,
                          cursor: "pointer",
                          background: "#263b4d",
                          color: "#ffffff",
                          border: "1px solid #425368",
                        }}
                      >
                        Copy Guest {index + 1} Link
                      </button>
                    </div>
                  ))}

                  <p style={{ fontSize: 12, opacity: 0.65 }}>
                    Each link is private, expires after 60 minutes,
                    and permits one invitation redemption.
                    Only share it with the intended guest.
                  </p>
                </div>
              </div>
            )}
          </div>}


          {/* Creator City landing information — does not change conversation controls. */}
          <section aria-labelledby="hp-live-studio-ways-title" style={{ marginTop: 18 }}>
            <div style={{ marginBottom: 18 }}>
              <h2 id="hp-live-studio-ways-title" style={{ margin: 0, fontSize: 23, letterSpacing: "-.025em" }}>A space for every kind of connection.</h2>
              <p style={{ color: "#aabbd5", fontSize: 15, margin: "8px 0 0" }}>One private place to connect with the people in your world.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
              {[
                { symbol: "♡", title: "Catch up", description: "See friends and family, wherever they are." },
                { symbol: "✦", title: "Create together", description: "Share ideas with creators and collaborators." },
                { symbol: "▣", title: "Get things done", description: "Talk through a project and share your screen." },
              ].map((item) => (
                <div key={item.title} style={{ background: "rgba(20,33,63,.78)", border: "1px solid rgba(164,203,255,.14)", borderRadius: 18, padding: "22px 24px" }}>
                  <span aria-hidden="true" style={{ color: "#9ddffe", fontSize: 26, lineHeight: 1 }}>{item.symbol}</span>
                  <h3 style={{ margin: "14px 0 8px", fontSize: 18 }}>{item.title}</h3>
                  <p style={{ color: "#aebfda", margin: 0, lineHeight: 1.6, fontSize: 14 }}>{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="hp-live-studio-steps-title" style={{ ...cardStyle, marginTop: 2, padding: "25px 27px" }}>
            <h2 id="hp-live-studio-steps-title" style={{ margin: "0 0 17px", fontSize: 21 }}>Simple from the first hello.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {[
                { number: "01", title: "Start", description: "Create your private video room." },
                { number: "02", title: "Invite", description: "Share a private link with your people." },
                { number: "03", title: "Connect", description: "Join the room and start talking." },
              ].map((step) => (
                <div key={step.number} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                  <span aria-hidden="true" style={{ color: "#9bdfff", fontSize: 14, fontWeight: 800, letterSpacing: ".08em" }}>{step.number}</span>
                  <div>
                    <h3 style={{ margin: "0 0 5px", fontSize: 16 }}>{step.title}</h3>
                    <p style={{ color: "#b5c5dc", margin: 0, fontSize: 14, lineHeight: 1.6 }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <details style={{ ...cardStyle, marginTop: 20, width: "100%", maxWidth: 1000, marginLeft: "auto", marginRight: "auto", boxSizing: "border-box" }}>
            <summary style={{ cursor: "pointer", fontSize: 19, fontWeight: 750, padding: "4px 0" }}>
              My Studio <span style={{ fontSize: 13, fontWeight: 450, color: "#aabedc" }}>· Conversations & history</span>
            </summary>
            <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 17, marginBottom: 8 }}>Your Conversations</h2>

            <button
              type="button"
              onClick={() => void loadMyMeetings()}
              style={{
                ...buttonStyle,
                marginBottom: 10,
                padding: "8px 12px",
              }}
            >
              Refresh Conversations
            </button>

            {loadingMeetings && <p>Loading conversations...</p>}

            {endMeetingError && <p role="alert" style={{ color: "#ff9999" }}>{endMeetingError}</p>}
            {endMeetingWarning && <p role="alert" style={{ color: "#ffcc88" }}>{endMeetingWarning}</p>}

            {meetingsError && (
              <p role="alert" style={{ color: "#ff9999" }}>
                {meetingsError}
              </p>
            )}

            {!loadingMeetings &&
              !meetingsError &&
              myMeetings.length === 0 && (
                <p>No conversations yet.</p>
              )}

            {myMeetings.filter((meeting) => ["scheduled", "live"].includes(meeting.status)).map((meeting) => (
              <div key={meeting.meetingId} style={{
                width: "100%", boxSizing: "border-box", padding: "13px 16px", marginTop: 10,
                borderRadius: 12, background: "#172333", border: "1px solid #35455e",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 285px), 1fr))", gap: "18px 28px", alignItems: "start" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, overflowWrap: "anywhere" }}>{meeting.title}</div>
                    <div style={{ fontSize: 13, opacity: 0.7, marginTop: 5 }}>
                      {meeting.status === "live" ? "Live conversation" : "Ready to start"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 13 }}>
                      <a
                        href={`/planet/live-studio/meeting/${encodeURIComponent(meeting.meetingId)}?creator=1&autojoin=1`}
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "9px 14px", borderRadius: 8,
                          background: "#92ddff", color: "#091b35", fontWeight: 700, textDecoration: "none" }}
                      >
                        {meeting.status === "live" ? "Rejoin Conversation" : "Restart Conversation"}
                      </a>
                      <button
                        type="button"
                        onClick={() => void endMeeting(meeting.meetingId)}
                        disabled={Boolean(endingMeetingId)}
                        style={{ ...buttonStyle, padding: "9px 14px", borderRadius: 8, background: "#70474e",
                          border: "1px solid #91656d", color: "#ffffff", cursor: endingMeetingId ? "not-allowed" : "pointer",
                          opacity: endingMeetingId === meeting.meetingId ? 0.65 : 1 }}
                      >
                        {endingMeetingId === meeting.meetingId ? "Ending..." : "End Conversation"}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 9, fontSize: 13, color: "#bfd0e7" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e1eaf6" }}>
                      <span aria-hidden="true">▦ </span>
                      {formatConversationDay(meeting.createdAt)} · {new Date(meeting.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {!meeting.startedAt && !meeting.scheduledAt && <span style={{ opacity: 0.65, fontWeight: 400 }}> · Created</span>}
                      {!meeting.startedAt && meeting.scheduledAt && <span style={{ opacity: 0.65, fontWeight: 400 }}> · Scheduled</span>}
                    </div>
                    <div><span aria-hidden="true">◷ </span>Started: {formatConversationTime(meeting.startedAt)}</div>
                    <div><span aria-hidden="true">◷ </span>Ended: {formatConversationTime(meeting.endedAt)}</div>
                  </div>
                </div>

                {selectedInviteMeetingId === meeting.meetingId && (
                  <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                    {inviting && <p>Creating your guest link...</p>}

                    {invitationError && (
                      <p role="alert" style={{ color: "#ff9999" }}>
                        {invitationError}
                      </p>
                    )}

                    {invitations.map((url, index) => (
                      <div key={url} style={{ display: "grid", gap: 8 }}>
                        <label htmlFor={`saved-invite-${index}`}>
                          Guest {index + 1} Invitation
                        </label>

                        <input
                          id={`saved-invite-${index}`}
                          readOnly
                          value={url}
                          onFocus={(event) => event.currentTarget.select()}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: 12,
                            borderRadius: 10,
                            background: "#172333",
                            color: "#ffffff",
                            border: "1px solid #425368",
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => {
                            void navigator.clipboard.writeText(url).catch(() => {
                              setInvitationError(
                                "Copy unavailable. Select and copy the link above."
                              );
                            });
                          }}
                          style={buttonStyle}
                        >
                          Copy Guest {index + 1} Link
                        </button>
                      </div>
                    ))}

                    {invitations.length > 0 && (
                      <p style={{ fontSize: 12, opacity: 0.7 }}>
                        Each link expires after 60 minutes and allows one
                        initial redemption. Create a separate link per guest.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          <div style={cardStyle}>
            <h2>Conversation History</h2>

            {loadingMeetings && <p>Loading conversation history...</p>}

            {!loadingMeetings &&
              myMeetings.filter((meeting) =>
                ["ended", "canceled", "cancelled"].includes(meeting.status)
              ).length === 0 && (
                <p>No completed conversations yet.</p>
              )}

            {myMeetings
              .filter((meeting) =>
                ["ended", "canceled", "cancelled"].includes(meeting.status)
              )
              .map((meeting) => (
                <div
                  key={meeting.meetingId}
                  style={{
                    padding: 16,
                    marginTop: 12,
                    borderRadius: 12,
                    background: "#172333",
                    border: "1px solid #425368",
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={expandedHistoryId === meeting.meetingId}
                    aria-controls={`meeting-history-${meeting.meetingId}`}
                    onClick={() => setExpandedHistoryId((current) => current === meeting.meetingId ? null : meeting.meetingId)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      width: "100%", padding: 0, textAlign: "left", background: "transparent",
                      color: "#ffffff", border: "none", cursor: "pointer", font: "inherit",
                    }}
                  >
                    <span>
                      <span style={{ display: "block", fontWeight: 700 }}>{meeting.title}</span>
                      <span style={{ display: "block", fontSize: 13, opacity: 0.7, marginTop: 6 }}>
                        {meeting.status} · {formatMeetingDate(meeting.createdAt)}
                      </span>
                    </span>
                    <span style={{ color: "#79e4a5", whiteSpace: "nowrap", marginLeft: 12, fontWeight: 700 }}>
                      {expandedHistoryId === meeting.meetingId ? "Hide Details −" : "View Details +"}
                    </span>
                  </button>
                  {expandedHistoryId === meeting.meetingId && (
                    <div
                      id={`meeting-history-${meeting.meetingId}`}
                      style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #425368", display: "grid", gap: 10 }}
                    >
                      <div><strong>Conversation title:</strong> {meeting.title}</div>
                      <div><strong>Status:</strong> {meeting.status}</div>
                      <div><strong>Created:</strong> {formatMeetingDate(meeting.createdAt)}</div>
                      <div><strong>Scheduled:</strong> {formatMeetingDate(meeting.scheduledAt)}</div>
                      <div><strong>Started:</strong> {formatMeetingDate(meeting.startedAt)}</div>
                      <div><strong>Ended:</strong> {formatMeetingDate(meeting.endedAt)}</div>
                      <div><strong>Duration:</strong> {formatMeetingDuration(meeting.startedAt, meeting.endedAt)}</div>
                      <div style={{ fontSize: 12, opacity: 0.7, overflowWrap: "anywhere" }}>
                        Meeting ID: {meeting.meetingId}
                      </div>
                      <div style={{ fontSize: 13, opacity: 0.75, marginTop: 6 }}>
                        Participant history, recordings, transcripts, decisions, and Truth Chain records
                        are not available in this pilot history view unless separately captured.
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
          </div>
          </details>
        </div>
        <footer style={{ borderTop: "1px solid rgba(173,204,255,.15)", marginTop: 42, padding: "26px 4px 0", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ fontWeight: 750, fontSize: 16 }}>Your conversations. Your connections. Your space.</div>
            <div style={{ color: "#9fb5d3", fontSize: 13, marginTop: 7 }}>Powered by HomePlanet</div>
          </div>
          <div style={{ color: "#9fb5d3", fontSize: 12, alignSelf: "center" }}>Powerful underneath. Simple in your hands.</div>
        </footer>
      </div>
    </div>
  );
}
