import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function OkeechobeeReachOutPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState("General question");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim() || !contact.trim() || !message.trim()) {
      alert("Please add your name, contact info, and message.");
      return;
    }

    setIsSubmitting(true);

    const cleanName = name.trim();
    const cleanTopic = topic.trim();
    const cleanMessage = message.trim();
    const now = new Date().toISOString();
    const title = `Reach Out: ${cleanTopic}`;

    const record = {
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      type: "Message",
      description: `${cleanName} reached out about: ${cleanTopic}\n\n${cleanMessage}`,
      location: "Okeechobee",
      contact: contact.trim(),
      status: "Pending Review",
      project_needs: [],
      timeline: [
        {
          label: "General message submitted",
          time: now,
        },
      ],
    };

    const { error } = await supabase.from("okeechobee_events").insert(record);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("Something went wrong sending this message.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={styles.kicker}>Okeechobee Together</p>
          <h1 style={styles.title}>Message received.</h1>
          <p style={styles.text}>
            Thank you for reaching out. We will review your message and follow up as soon as we can.
          </p>

          <Link to="/planet/okeechobee" style={styles.primaryButton}>
            Back To Okeechobee Together
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <Link to="/planet/okeechobee" style={styles.backLink}>
          ← Back to Okeechobee Together
        </Link>

        <div style={styles.header}>
          <p style={styles.kicker}>Okeechobee Together</p>
          <h1 style={styles.title}>Reach Out To Us</h1>
          <p style={styles.text}>
            Have a question, want to connect, know someone who may need support, have an idea, or need to share something with Okeechobee Together? Send a quick message here.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Name
            <input
              style={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </label>

          <label style={styles.label}>
            Best way to reach you
            <input
              style={styles.input}
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="Phone, Messenger, email, or best contact"
            />
          </label>

          <label style={styles.label}>
            What is this about?
            <select
              style={styles.input}
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            >
              <option>General question</option>
              <option>I know someone who may need help</option>
              <option>I want to offer help</option>
              <option>I have materials or tools</option>
              <option>I want to share an idea</option>
              <option>Community project question</option>
              <option>Something else</option>
            </select>
          </label>

          <label style={styles.label}>
            Message
            <textarea
              style={styles.textarea}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write the message here. Please do not post private addresses unless they should be shared with confirmed helpers."
            />
          </label>

          <button type="submit" style={styles.primaryButton} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(57,255,20,0.12), transparent 34%), #050505",
    color: "white",
    padding: "28px 18px 48px",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shell: {
    maxWidth: 760,
    margin: "0 auto",
  },
  backLink: {
    display: "inline-flex",
    color: "#39ff14",
    textDecoration: "none",
    fontWeight: 800,
    marginBottom: 22,
  },
  header: {
    marginBottom: 20,
  },
  card: {
    maxWidth: 680,
    margin: "80px auto 0",
    border: "1px solid rgba(57,255,20,0.28)",
    background: "linear-gradient(135deg, #111 0%, #080808 100%)",
    borderRadius: 22,
    padding: 24,
    boxShadow: "0 0 30px rgba(57,255,20,0.08)",
  },
  kicker: {
    margin: "0 0 8px",
    color: "#39ff14",
    fontSize: 13,
    fontWeight: 1000,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "clamp(34px, 8vw, 58px)",
    lineHeight: 0.95,
  },
  text: {
    margin: 0,
    color: "#cfcfcf",
    fontSize: 17,
    lineHeight: 1.55,
  },
  form: {
    display: "grid",
    gap: 16,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(15,15,15,0.92)",
    borderRadius: 22,
    padding: 20,
  },
  label: {
    display: "grid",
    gap: 8,
    color: "#e8e8e8",
    fontSize: 14,
    fontWeight: 900,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "#050505",
    color: "white",
    padding: "13px 14px",
    fontSize: 16,
    outline: "none",
  },
  textarea: {
    width: "100%",
    minHeight: 150,
    boxSizing: "border-box",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "#050505",
    color: "white",
    padding: "13px 14px",
    fontSize: 16,
    outline: "none",
    resize: "vertical",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: 0,
    borderRadius: 999,
    background: "#39ff14",
    color: "#061400",
    fontWeight: 1000,
    fontSize: 16,
    padding: "14px 20px",
    textDecoration: "none",
    cursor: "pointer",
  },
};
