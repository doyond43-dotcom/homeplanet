import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function LiveStudio() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("HomePlanet Live Studio - Private Pilot");
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

  function formatMeetingDuration(start?: string | null, end?: string | null): string {
    if (!start || !end) return "Not recorded";
    const duration = new Date(end).getTime() - new Date(start).getTime();
    if (!Number.isFinite(duration) || duration < 0) return "Not recorded";
    const minutes = Math.floor(duration / 60000);
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
  }

  const cardStyle: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 24,
    background: "rgba(255,255,255,0.03)",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "14px 20px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    background: "#79e4a5",
    color: "#102018",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        padding: "32px 20px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <div style={{ fontSize: 14, opacity: 0.7 }}>
            HOMEPLANET
          </div>

          <h1
            style={{
              margin: "12px 0",
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            Live Studio
          </h1>

          <p
            style={{
              opacity: 0.8,
              fontSize: 18,
              marginBottom: 0,
            }}
          >
            Broadcast. Meet. Present. Record.
          </p>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div style={cardStyle}>
            <h2>Start Session</h2>
            <p>Create a private meeting and invite people.</p>

            {!showForm && !meetingId && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowForm(true);
                }}
                style={buttonStyle}
              >
                Start Session
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
                  Private meeting selected.
                </p>

                <a
                  href={`/planet/live-studio/meeting/${encodeURIComponent(meetingId)}`}
                  style={{ color: "#79e4a5", fontWeight: 700 }}
                >
                  Open Private Host Meeting
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
                      : "Generate Guest Invitation"}
                  </button>

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
          </div>

          <div style={cardStyle}>
            <h2>Video Messages</h2>
            <p>Record welcome videos, introduce your business, and share customer updates.</p>
          </div>
          <div style={cardStyle}>
            <h2>Upcoming &amp; Active Meetings</h2>

            <button
              type="button"
              onClick={() => void loadMyMeetings()}
              style={{
                ...buttonStyle,
                marginBottom: 16,
              }}
            >
              Refresh Meetings
            </button>

            {loadingMeetings && <p>Loading meetings...</p>}

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
                <p>No meetings yet.</p>
              )}

            {myMeetings.filter((meeting) => ["scheduled", "live"].includes(meeting.status)).map((meeting) => (
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
                <div style={{ fontWeight: 700 }}>
                  {meeting.title}
                </div>

                <div style={{
                  fontSize: 13,
                  opacity: 0.7,
                  marginTop: 6,
                }}>
                  {meeting.status}
                </div>

                <a
                  href={`/planet/live-studio/meeting/${encodeURIComponent(meeting.meetingId)}`}
                  style={{
                    display: "inline-block",
                    marginTop: 12,
                    color: "#79e4a5",
                    fontWeight: 700,
                  }}
                >
                  Open Host Meeting
                </a>

                <button
                  type="button"
                  onClick={() => void createGuestInvitation(meeting.meetingId)}
                  disabled={inviting}
                  style={{
                    ...buttonStyle,
                    marginTop: 12,
                    marginLeft: 12,
                  }}
                >
                  Invite Guests
                </button>

                <button
                  type="button"
                  onClick={() => void endMeeting(meeting.meetingId)}
                  disabled={Boolean(endingMeetingId) || inviting}
                  style={{
                    ...buttonStyle,
                    marginTop: 12,
                    marginLeft: 12,
                    background: "#654147",
                    color: "#ffffff",
                  }}
                >
                  {endingMeetingId === meeting.meetingId ? "Ending..." : "End Meeting"}
                </button>

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
            <h2>Meeting History</h2>

            {loadingMeetings && <p>Loading history...</p>}

            {!loadingMeetings &&
              myMeetings.filter((meeting) =>
                ["ended", "canceled", "cancelled"].includes(meeting.status)
              ).length === 0 && (
                <p>No completed meetings yet.</p>
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
                      <div><strong>Meeting title:</strong> {meeting.title}</div>
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
        </div>
      </div>
    </div>
  );
}
