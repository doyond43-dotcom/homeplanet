import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type EventType = "Need" | "Offer" | "Opportunity" | "Event" | "Alert";

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export default function OkeechobeeCreateEventPageV2() {
  const navigate = useNavigate();

  const [type, setType] = useState<EventType>("Need");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const slug = `${slugify(title)}-${Date.now().toString().slice(-5)}`;

    const event = {
      slug,
      type,
      title,
      description,
      location,
      contact,
      status: "Active",
      timeline: [{ label: "Event created", time: new Date().toISOString() }],
    };

    const { error } = await supabase.from("okeechobee_events").insert(event);

    if (error) {
      console.error(error);
      alert("Something went wrong creating this post.");
      return;
    }

    navigate(`/planet/okeechobee/event/${slug}`);
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>Okeechobee Together</p>
        <h1 style={styles.title}>Create a Community Request</h1>
        <p style={styles.subtitle}>
          Answer a few simple questions so Okeechobee Together can understand the need before it goes public.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Type
            <select style={styles.input} value={type} onChange={(e) => setType(e.target.value as EventType)}>
              <option>Need</option>
              <option>Offer</option>
              <option>Opportunity</option>
              <option>Event</option>
              <option>Alert</option>
            </select>
          </label>

          <label style={styles.label}>
            Title
            <input style={styles.input} required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Church needs 5 volunteers Friday" />
          </label>

          <label style={styles.label}>
            Description
            <textarea style={{ ...styles.input, minHeight: 120, resize: "vertical" }} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is happening? What help is needed?" />
          </label>

          <label style={styles.label}>
            Location
            <input style={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Okeechobee, FL" />
          </label>

          <label style={styles.label}>
            Contact
            <input style={styles.input} value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Phone, Messenger, email, or instructions" />
          </label>

          <button style={styles.button} type="submit">Submit For Review</button>
        </form>
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
    maxWidth: 720,
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
  form: {
    display: "grid",
    gap: 16,
    marginTop: 26,
  },
  label: {
    display: "grid",
    gap: 8,
    color: "#f5f5f5",
    fontWeight: 700,
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
  button: {
    marginTop: 8,
    border: 0,
    borderRadius: 999,
    background: "#39FF14",
    color: "#050505",
    padding: "15px 18px",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
};


