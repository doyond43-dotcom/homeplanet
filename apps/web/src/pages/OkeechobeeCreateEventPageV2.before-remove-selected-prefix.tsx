import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type HelpCategory =
  | "Yard / Outdoor"
  | "Home Repair"
  | "AC / Appliance"
  | "Moving / Heavy Lifting"
  | "Food / Supplies"
  | "Transportation"
  | "Senior Help"
  | "Community / Volunteers"
  | "Other";

const categories: HelpCategory[] = [
  "Yard / Outdoor",
  "Home Repair",
  "AC / Appliance",
  "Moving / Heavy Lifting",
  "Food / Supplies",
  "Transportation",
  "Senior Help",
  "Community / Volunteers",
  "Other",
];

const yardConditions = [
  "Light cleanup",
  "Average / manageable",
  "Overgrown",
  "Heavy overgrowth",
  "Needs equipment",
  "Not sure",
];

const yardHelpTypes = [
  "Mowing",
  "Weed eating",
  "Branches / debris",
  "Garden help",
  "Fence / gate help",
  "Loading / hauling",
  "Needs tools",
  "Not sure",
];

const urgencyOptions = [
  "Today if possible",
  "This week",
  "When someone is available",
  "Planning ahead",
];

const whoOptions = [
  "Me",
  "A senior",
  "A family",
  "A neighbor",
  "A disabled resident",
  "Someone without transportation",
  "Other",
];

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export default function OkeechobeeCreateEventPageV2() {
  const navigate = useNavigate();

  const [category, setCategory] = useState<HelpCategory>("Yard / Outdoor");
  const [yardCondition, setYardCondition] = useState("Average / manageable");
  const [yardHelpTypesSelected, setYardHelpTypesSelected] = useState<string[]>(["Garden help"]);
  const [urgency, setUrgency] = useState("This week");
  const [whoFor, setWhoFor] = useState("A senior");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [location, setLocation] = useState("Okeechobee, FL");
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isYard = category === "Yard / Outdoor";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please add a short title.");
      return;
    }

    if (!story.trim()) {
      alert("Please add a few details about what is needed.");
      return;
    }

    setIsSubmitting(true);

    const slug = `${slugify(title)}-${Date.now().toString().slice(-5)}`;

    const guidedDetails = [
      `Category: ${category}`,
      isYard ? `Yard condition: ${yardCondition}` : "",
      isYard ? `What best describes the need: ${yardHelpTypesSelected.join(", ")}` : "",
      `Urgency: ${urgency}`,
      `Who this is for: ${whoFor}`,
      "",
      "Request details:",
      story.trim(),
    ].filter(Boolean).join("\n");

    const event = {
      slug,
      type: "Need",
      title: title.trim(),
      description: guidedDetails,
      location: location.trim(),
      contact: contact.trim(),
      status: "Pending Review",
      timeline: [{ label: "Request submitted for review", time: new Date().toISOString() }],
    };

    const { error } = await supabase.from("okeechobee_events").insert(event);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("Something went wrong submitting this request.");
      return;
    }

    alert("Request submitted for review. It will not go public until approved.");
    navigate("/planet/okeechobee");
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.kicker}>Okeechobee Together</p>
        <h1 style={styles.title}>What kind of help is needed?</h1>
        <p style={styles.subtitle}>
          Answer a few simple questions. Okeechobee Together will review the request before it goes public.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <section style={styles.section}>
            <p style={styles.sectionTitle}>1. Choose the type of need</p>
            <div style={styles.grid}>
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  style={{
                    ...styles.choice,
                    ...(category === item ? styles.choiceActive : {}),
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          {isYard && (
            <section style={styles.section}>
              <p style={styles.sectionTitle}>2. Yard / outdoor details</p>

              <label style={styles.label}>
                Yard condition
                <select style={styles.input} value={yardCondition} onChange={(e) => setYardCondition(e.target.value)}>
                  {yardConditions.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <div style={styles.label}>
                What best describes the need?
                <p style={styles.hint}>Select all that apply.</p>
                <div style={styles.grid}>
                  {yardHelpTypes.map((item) => {
                    const isSelected = yardHelpTypesSelected.includes(item);

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setYardHelpTypesSelected((current) =>
                            current.includes(item)
                              ? current.filter((value) => value !== item)
                              : [...current, item]
                          );
                        }}
                        style={{
                          ...styles.choice,
                          ...(isSelected ? styles.choiceActive : {}),
                        }}
                      >
                        {isSelected ? "? " : ""}{item}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          <section style={styles.section}>
            <p style={styles.sectionTitle}>{isYard ? "3" : "2"}. Timing and situation</p>

            <label style={styles.label}>
              How urgent is it?
              <select style={styles.input} value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                {urgencyOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label style={styles.label}>
              Who is this for?
              <select style={styles.input} value={whoFor} onChange={(e) => setWhoFor(e.target.value)}>
                {whoOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </section>

          <section style={styles.section}>
            <p style={styles.sectionTitle}>{isYard ? "4" : "3"}. Request details</p>

            <label style={styles.label}>
              Short title
              <input
                style={styles.input}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior needs help finishing garden"
              />
            </label>

            <label style={styles.label}>
              What is going on?
              <textarea
                style={{ ...styles.input, minHeight: 130, resize: "vertical" }}
                required
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Share the important details. Please do not post private addresses here if they should only be shared with confirmed helpers."
              />
            </label>

            <label style={styles.label}>
              General location
              <input
                style={styles.input}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Okeechobee, FL"
              />
            </label>

            <label style={styles.label}>
              Contact / private instructions
              <input
                style={styles.input}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Message Daniel, phone number, Messenger, or private instructions"
              />
            </label>
          </section>

          <div style={styles.notice}>
            Requests submitted here should be reviewed before they appear on the public board.
          </div>

          <button style={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit For Review"}
          </button>
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
    maxWidth: 760,
    margin: "0 auto",
    background: "#101010",
    border: "1px solid #242424",
    borderRadius: 24,
    padding: 24,
  },
  kicker: {
    color: "#39FF14",
    fontWeight: 900,
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
    gap: 18,
    marginTop: 26,
  },
  section: {
    display: "grid",
    gap: 14,
    background: "#151515",
    border: "1px solid #252525",
    borderRadius: 20,
    padding: 16,
  },
  sectionTitle: {
    margin: 0,
    color: "#39FF14",
    fontWeight: 900,
    letterSpacing: 0.2,
  },
  hint: {
    margin: "-4px 0 0",
    color: "#a8a8a8",
    fontSize: 14,
    fontWeight: 650,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 10,
  },
  choice: {
    border: "1px solid #333",
    borderRadius: 16,
    background: "#1b1b1b",
    color: "white",
    padding: "14px 12px",
    fontWeight: 850,
    cursor: "pointer",
    textAlign: "left",
  },
  choiceActive: {
    borderColor: "#39FF14",
    background: "rgba(57, 255, 20, 0.12)",
    color: "#39FF14",
  },
  label: {
    display: "grid",
    gap: 8,
    color: "#f5f5f5",
    fontWeight: 800,
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
  notice: {
    borderRadius: 16,
    border: "1px solid rgba(57, 255, 20, 0.35)",
    background: "rgba(57, 255, 20, 0.08)",
    color: "#d9ffd2",
    padding: 14,
    lineHeight: 1.45,
    fontWeight: 750,
  },
  button: {
    marginTop: 2,
    border: 0,
    borderRadius: 999,
    background: "#39FF14",
    color: "#050505",
    padding: "16px 18px",
    fontWeight: 950,
    fontSize: 16,
    cursor: "pointer",
  },
};



