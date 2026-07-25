import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function OkeechobeeEventPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showHelperForm, setShowHelperForm] = useState(false);
  const [helperName, setHelperName] = useState("");
  const [helperPhone, setHelperPhone] = useState("");
  const [helperEmail, setHelperEmail] = useState("");
  const [helperType, setHelperType] = useState("General Volunteer");
  const [helperNotes, setHelperNotes] = useState("");
  const [coordinatorBackground, setCoordinatorBackground] = useState("");
  const [coordinatorWhyHelp, setCoordinatorWhyHelp] = useState("");
  const [coordinatorAvailability, setCoordinatorAvailability] = useState("");
  const [savingHelper, setSavingHelper] = useState(false);

  async function loadEvent() {
    if (!slug) return;

    const { data, error } = await supabase
      .from("okeechobee_events")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(error);
      setEvent(null);
    } else {

      console.log("EVENT DATA:", data);

      const newViewCount = (data.views || 0) + 1;

      const referrer = document.referrer.toLowerCase();

      let source = "direct";

      if (referrer.includes("facebook.com")) {
        source = "facebook";
      } else if (referrer.includes("messenger.com")) {
        source = "messenger";
      } else if (referrer.length > 0) {
        source = "other";
      }

      const currentReferrers = data.referrers || {};

      const updatedReferrers = {
        ...currentReferrers,
        [source]: (currentReferrers[source] || 0) + 1,
      };

      const { error: analyticsError } = await supabase
        .from("okeechobee_events")
        .update({
          views: newViewCount,
          referrers: updatedReferrers,
        })
        .eq("slug", slug);

      console.log("Okeechobee analytics update", {
        newViewCount,
        source,
        updatedReferrers,
        analyticsError,
      });

      setEvent({
        ...data,
        views: newViewCount,
        referrers: updatedReferrers,
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEvent();
  }, [slug]);

  async function joinEvent(e: React.FormEvent) {
    e.preventDefault();

    if (!event || savingHelper) return;

    if (!helperName.trim() || !helperPhone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }

    setSavingHelper(true);

    const coordinatorDetails =
      helperType === "Project Coordinator"
        ? [
            coordinatorBackground.trim()
              ? `Background: ${coordinatorBackground.trim()}`
              : "",
            coordinatorWhyHelp.trim()
              ? `Why: ${coordinatorWhyHelp.trim()}`
              : "",
            coordinatorAvailability.trim()
              ? `Availability: ${coordinatorAvailability.trim()}`
              : "",
          ]
            .filter(Boolean)
            .join("\n")
        : "";

    const combinedNotes =
      [helperNotes.trim(), coordinatorDetails].filter(Boolean).join("\n\n") || null;

    const { error: helperError } = await supabase
      .from("okeechobee_project_helpers")
      .insert({
        event_slug: event.slug,
        name: helperName.trim(),
        phone: helperPhone.trim(),
        email: helperEmail.trim() || null,
        help_type: helperType,
        notes: combinedNotes,
      });

    if (helperError) {
      console.error(helperError);
      alert("Something went wrong saving your helper information.");
      setSavingHelper(false);
      return;
    }

    const updatedTimeline = [
      ...(event.timeline || []),
      {
        label: `${helperName.trim()} joined as ${helperType}`,
        time: new Date().toISOString(),
      },
    ];

    const { error: timelineError } = await supabase
      .from("okeechobee_events")
      .update({ timeline: updatedTimeline })
      .eq("slug", event.slug);

    if (timelineError) {
      console.error(timelineError);
      alert("Your helper info was saved, but the timeline did not update.");
      setSavingHelper(false);
      return;
    }

    setEvent({ ...event, timeline: updatedTimeline });
    setHelperName("");
    setHelperPhone("");
    setHelperEmail("");
    setHelperType("General Volunteer");
    setHelperNotes("");
    setShowHelperForm(false);
    setSavingHelper(false);
    alert("Thank you. Your information was saved.");
  }

  function formatLookingForItem(item: any) {
    if (typeof item === "string") return item;

    if (item && typeof item === "object") {
      return (
        item.title ||
        item.label ||
        item.name ||
        item.text ||
        item.value ||
        item.need ||
        item.type ||
        JSON.stringify(item)
      );
    }

    return String(item || "");
  }

  async function markResolved() {
    if (!event) return;

    const updatedTimeline = [
      ...(event.timeline || []),
      { label: "Need resolved", time: new Date().toISOString() },
    ];

    const { error } = await supabase
      .from("okeechobee_events")
      .update({ status: "Resolved", timeline: updatedTimeline })
      .eq("slug", event.slug);

    if (error) {
      console.error(error);
      alert("Something went wrong resolving this post.");
      return;
    }

    setEvent({ ...event, status: "Resolved", timeline: updatedTimeline });
  }

  if (loading) {
  
  const descriptionLines = String(event?.public_description || event?.description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  function renderDescriptionLine(line: string, index: number) {
    const clean = line.trim();

    if (clean.toLowerCase() === "request details:") {
      return (
        <p
          key={`description-line-${index}`}
          style={{
            margin: "18px 0 8px",
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#facc15",
          }}
        >
          Request details
        </p>
      );
    }

    const match = clean.match(/^([^:]{1,45}):\s*(.*)$/);

    if (match) {
      return (
        <div
          key={`description-line-${index}`}
          style={{
            display: "grid",
            gap: 6,
            padding: "12px 14px",
            borderRadius: 16,
            background: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(148, 163, 184, 0.22)",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#94a3b8",
            }}
          >
            {match[1]}
          </span>
          <span
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "#f8fafc",
            }}
          >
            {match[2] || "Not listed"}
          </span>
        </div>
      );
    }

    return (
      <p
        key={`description-line-${index}`}
        style={{
          margin: "0 0 12px",
          fontSize: 17,
          lineHeight: 1.75,
          color: "#e5e7eb",
        }}
      >
        {clean}
      </p>
    );
  }

  return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.subtitle}>Loading community post...</p>
        </section>
      </main>
    );
  }

  if (!event) {
  
  const descriptionLines = String(event?.public_description || event?.description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  function renderDescriptionLine(line: string, index: number) {
    const clean = line.trim();

    if (clean.toLowerCase() === "request details:") {
      return (
        <p
          key={`description-line-${index}`}
          style={{
            margin: "18px 0 8px",
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#facc15",
          }}
        >
          Request details
        </p>
      );
    }

    const match = clean.match(/^([^:]{1,45}):\s*(.*)$/);

    if (match) {
      return (
        <div
          key={`description-line-${index}`}
          style={{
            display: "grid",
            gap: 6,
            padding: "12px 14px",
            borderRadius: 16,
            background: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(148, 163, 184, 0.22)",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#94a3b8",
            }}
          >
            {match[1]}
          </span>
          <span
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "#f8fafc",
            }}
          >
            {match[2] || "Not listed"}
          </span>
        </div>
      );
    }

    return (
      <p
        key={`description-line-${index}`}
        style={{
          margin: "0 0 12px",
          fontSize: 17,
          lineHeight: 1.75,
          color: "#e5e7eb",
        }}
      >
        {clean}
      </p>
    );
  }

  return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>Event not found</h1>
          <Link style={styles.link} to="/planet/okeechobee/create">Create one</Link>
        </section>
      </main>
    );
  }

  const helperCount = (event.timeline || []).filter((item: any) =>
    String(item.label || "").toLowerCase().includes(" joined as ")
  ).length;

  const responseRate =
    (event.views || 0) > 0
      ? ((helperCount / (event.views || 1)) * 100).toFixed(1)
      : "0.0";

  const shareUrl = window.location.href;

  async function shareEvent() {
    if (!event) return;

    const newShareCount = (event.shares || 0) + 1;

    const { error } = await supabase
      .from("okeechobee_events")
      .update({
        shares: newShareCount,
      })
      .eq("slug", event.slug);

    if (!error) {
      setEvent({
        ...event,
        shares: newShareCount,
      });
    }

    if (navigator.share) {
      await navigator.share({
        title: event.public_title || event.title,
        text: event.public_description || event.description,
        url: shareUrl,
      });
    } else {

      console.log("EVENT DATA:", data);
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied.");
    }
  }


  const descriptionLines = String(event?.public_description || event?.description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  function renderDescriptionLine(line: string, index: number) {
    const clean = line.trim();

    if (clean.toLowerCase() === "request details:") {
      return (
        <p
          key={`description-line-${index}`}
          style={{
            margin: "18px 0 8px",
            fontSize: 13,
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#facc15",
          }}
        >
          Request details
        </p>
      );
    }

    const match = clean.match(/^([^:]{1,45}):\s*(.*)$/);

    if (match) {
      return (
        <div
          key={`description-line-${index}`}
          style={{
            display: "grid",
            gap: 6,
            padding: "12px 14px",
            borderRadius: 16,
            background: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(148, 163, 184, 0.22)",
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#94a3b8",
            }}
          >
            {match[1]}
          </span>
          <span
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "#f8fafc",
            }}
          >
            {match[2] || "Not listed"}
          </span>
        </div>
      );
    }

    return (
      <p
        key={`description-line-${index}`}
        style={{
          margin: "0 0 12px",
          fontSize: 17,
          lineHeight: 1.75,
          color: "#e5e7eb",
        }}
      >
        {clean}
      </p>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>{event.type} - Okeechobee Together</p>
        <h1 style={styles.title}>{event.public_title || event.title}</h1>
        <div style={styles.subtitle}>
          <div
            style={{
              display: "grid",
              gap: 12,
              marginTop: 18,
            }}
          >
            {descriptionLines.map((line, index) => renderDescriptionLine(line, index))}
          </div>

          {event.project_needs && Array.isArray(event.project_needs) && event.project_needs.length > 0 ? (
            <div
              style={{
                marginTop: 18,
                padding: "14px",
                borderRadius: 18,
                background: "rgba(22, 163, 74, 0.12)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
              }}
            >
              <p
                style={{
                  margin: "0 0 10px",
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#86efac",
                }}
              >
                Looking For
              </p>

              <p
                style={{
                  margin: "8px 0 14px",
                  color: "#d1fae5",
                  lineHeight: 1.6,
                  fontSize: 15,
                }}
              >
                If you're able to help with any of the following, we'd love to hear from you.
              </p>

              <div style={{ display: "grid", gap: 8 }}>
                {event.project_needs
                  .map((need: any) => formatLookingForItem(need))
                  .filter(Boolean)
                  .map((need: any, index: number) => (
                    <div
                      key={`need-${index}`}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.05)",
                        borderLeft: "4px solid #22c55e",
                        color: "#f8fafc",
                        lineHeight: 1.45,
                      }}
                    >
                      {need}
                    </div>
                  ))}
              </div>
            </div>
          ) : null}

          <p
            style={{
              margin: "20px 0 0",
              fontSize: 18,
              lineHeight: 1.55,
              fontWeight: 800,
              color: "#facc15",
            }}
          >
            A little time. A little care. A big difference.
          </p>
        </div>

        <div style={styles.infoBox}>
          <p><strong>Status:</strong> {event.status}</p>
          <p><strong>Location:</strong> {event.location || "Not listed"}</p>
          <p><strong>Contact:</strong> {event.contact || "Not listed"}</p>
          <p><strong>Helpers:</strong> {helperCount}</p>
        </div>


        <div style={styles.actions}>
          {event.status === "Resolved" ? (
            <div style={styles.resolvedButton}>? Need Met</div>
          ) : (
            <>
              <button onClick={() => setShowHelperForm(true)} style={styles.primaryButton}>
                I&apos;ll Help
              </button>


            </>
          )}

          <button onClick={shareEvent} style={styles.secondaryButton}>
            Share This Event
          </button>
        </div>

        {showHelperForm && (
          <div style={styles.modalOverlay}>
            <form onSubmit={joinEvent} style={styles.modalCard}>
              <h2 style={styles.modalTitle}>Join This Project</h2>
              <p style={styles.modalText}>
                Add your contact info so Okeechobee Together can coordinate help.
              </p>

              <label style={styles.label}>
                Name *
                <input
                  style={styles.input}
                  value={helperName}
                  onChange={(e) => setHelperName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>

              <label style={styles.label}>
                Phone Number *
                <input
                  style={styles.input}
                  value={helperPhone}
                  onChange={(e) => setHelperPhone(e.target.value)}
                  placeholder="Best phone number"
                  required
                />
              </label>

              <label style={styles.label}>
                Email Optional
                <input
                  style={styles.input}
                  value={helperEmail}
                  onChange={(e) => setHelperEmail(e.target.value)}
                  placeholder="Email if you want to include it"
                />
              </label>

              <label style={styles.label}>
                How can you help?
                <select
                  style={styles.input}
                  value={helperType}
                  onChange={(e) => setHelperType(e.target.value)}
                >
                  <option>Ramp Construction</option>
                  <option>Materials</option>
                  <option>Transportation</option>
                  <option>Work Opportunity</option>
                  <option>General Volunteer</option>
                  <option>Project Coordinator</option>
                  <option>Other</option>
                </select>
              </label>

              {helperType === "Project Coordinator" && (
                <>
                  <label style={styles.label}>
                    Background / Experience
                    <textarea
                      style={{ ...styles.input, minHeight: 90, resize: "vertical" }}
                      value={coordinatorBackground}
                      onChange={(e) => setCoordinatorBackground(e.target.value)}
                      placeholder="Tell us about your experience"
                    />
                  </label>

                  <label style={styles.label}>
                    Why would you like to coordinate this project?
                    <textarea
                      style={{ ...styles.input, minHeight: 90, resize: "vertical" }}
                      value={coordinatorWhyHelp}
                      onChange={(e) => setCoordinatorWhyHelp(e.target.value)}
                      placeholder="Why are you interested?"
                    />
                  </label>

                  <label style={styles.label}>
                    Availability
                    <input
                      style={styles.input}
                      value={coordinatorAvailability}
                      onChange={(e) => setCoordinatorAvailability(e.target.value)}
                      placeholder="Weekends, evenings, anytime, etc."
                    />
                  </label>
                </>
              )}

              <label style={styles.label}>
                Notes Optional
                <textarea
                  style={{ ...styles.input, minHeight: 90, resize: "vertical" }}
                  value={helperNotes}
                  onChange={(e) => setHelperNotes(e.target.value)}
                  placeholder="Anything helpful to know?"
                />
              </label>

              <div style={styles.modalActions}>
                <button type="submit" style={styles.primaryButton} disabled={savingHelper}>
                  {savingHelper ? "Saving..." : "Join Project"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowHelperForm(false)}
                  style={styles.secondaryButton}
                  disabled={savingHelper}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <section style={styles.timeline}>
          <h2 style={styles.sectionTitle}>Timeline</h2>

          {(event.timeline || []).map((item: any, index: number) => (
            <div key={index} style={styles.timelineItem}>
              <strong>{item.label}</strong>
              <p style={styles.time}>{new Date(item.time).toLocaleString()}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#050505",
    color: "white",
    padding: "28px 18px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    maxWidth: 760,
    margin: "0 auto",
    background: "#101010",
    border: "1px solid #242424",
    borderRadius: 24,
    padding: 24,
  },
  kicker: {
    color: "#39FF14",
    fontWeight: 800,
    margin: 0,
  },
  title: {
    margin: "10px 0 8px",
    fontSize: 34,
    lineHeight: 1.05,
  },
  subtitle: {
    color: "#b8b8b8",
    margin: 0,
    lineHeight: 1.5,
  },
  infoBox: {
    marginTop: 22,
    padding: 16,
    border: "1px solid #2b2b2b",
    borderRadius: 18,
    background: "#181818",
    color: "#e8e8e8",
  },
  actions: {
    display: "grid",
    gap: 12,
    marginTop: 22,
  },
  primaryButton: {
    border: 0,
    borderRadius: 999,
    background: "#39FF14",
    color: "#050505",
    padding: "15px 18px",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
  resolvedButton: {
    borderRadius: 999,
    background: "#39FF14",
    color: "#050505",
    padding: "15px 18px",
    fontWeight: 900,
    fontSize: 16,
    textAlign: "center",
  },
  secondaryButton: {
    border: "1px solid #333",
    borderRadius: 999,
    background: "#181818",
    color: "white",
    padding: "15px 18px",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
  },
  timeline: {
    marginTop: 32,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  timelineItem: {
    padding: "14px 0",
    borderBottom: "1px solid #242424",
  },
  time: {
    color: "#888",
    margin: "6px 0 0",
  },
  link: {
    display: "inline-block",
    marginTop: 28,
    color: "#39FF14",
    fontWeight: 800,
    textDecoration: "none",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.78)",
    zIndex: 50,
    display: "grid",
    placeItems: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "88vh",
    overflowY: "auto",
    background: "#101010",
    border: "1px solid #333",
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
  },
  modalTitle: {
    margin: "0 0 8px",
    fontSize: 26,
    lineHeight: 1.1,
  },
  modalText: {
    color: "#b8b8b8",
    lineHeight: 1.5,
    marginTop: 0,
    marginBottom: 18,
  },
  label: {
    display: "grid",
    gap: 8,
    color: "#f5f5f5",
    fontWeight: 800,
    marginTop: 14,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 14,
    border: "1px solid #333",
    background: "#181818",
    color: "white",
    padding: "14px 14px",
    fontSize: 16,
    outline: "none",
  },
  modalActions: {
    display: "grid",
    gap: 12,
    marginTop: 18,
  },
};

























