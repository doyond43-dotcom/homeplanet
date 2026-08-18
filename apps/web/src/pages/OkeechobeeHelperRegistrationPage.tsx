import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const categories = [
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

export default function OkeechobeeHelperRegistrationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("Okeechobee");
  const [availability, setAvailability] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  function toggleCategory(category: string) {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (saving) return;

    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert("Please enter your name, email, and phone.");
      return;
    }

    if (selected.length === 0) {
      alert("Choose at least one type of help.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/okeechobee-helper-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            area,
            availability,
            categories: selected,
          }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.ok !== true) {
        throw new Error(
          result?.error || "Your helper profile could not be saved."
        );
      }

      setDone(true);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Your helper profile could not be saved."
      );
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.kicker}>Okeechobee Together</p>

          <h1 style={styles.title}>
            You're on the helper list.
          </h1>

          <p style={styles.text}>
            When an approved local project matches the kinds of
            help you selected, Okeechobee Together can email you
            the project and give you a quick way to volunteer.
          </p>

          <Link
            to="/planet/okeechobee"
            style={styles.primaryButton}
          >
            Back to Okeechobee Together
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <form style={styles.card} onSubmit={submit}>
        <Link
          to="/planet/okeechobee"
          style={styles.backLink}
        >
          ← Back to Okeechobee Together
        </Link>

        <p style={styles.kicker}>Okeechobee Together</p>

        <h1 style={styles.title}>
          I Want To Help
        </h1>

        <p style={styles.text}>
          Join once. Tell us what you can help with. When a
          matching local need is approved, we can send it to you.
        </p>

        <label style={styles.label}>
          Your name *
          <input
            style={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label style={styles.label}>
          Email *
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label style={styles.label}>
          Phone *
          <input
            style={styles.input}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </label>

        <label style={styles.label}>
          Area
          <input
            style={styles.input}
            value={area}
            onChange={(event) => setArea(event.target.value)}
          />
        </label>

        <div style={styles.section}>
          <strong>What can you help with?</strong>

          <div style={styles.categoryGrid}>
            {categories.map((category) => {
              const active = selected.includes(category);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  style={{
                    ...styles.categoryButton,
                    ...(active
                      ? styles.categoryButtonActive
                      : {}),
                  }}
                >
                  {active ? "✓ " : ""}
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <label style={styles.label}>
          General availability
          <textarea
            style={{
              ...styles.input,
              minHeight: 100,
              paddingTop: 12,
            }}
            value={availability}
            onChange={(event) =>
              setAvailability(event.target.value)
            }
            placeholder="Weekends, evenings, mornings, flexible, etc."
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          style={styles.primaryButton}
        >
          {saving ? "Saving..." : "Join The Helper Network"}
        </button>

        <p style={styles.privateNote}>
          Your contact information is used for community project
          coordination and is not displayed on the public project board.
        </p>
      </form>
    </main>
  );
}

const styles: Record<string, any> = {
  page: {
    minHeight: "100vh",
    background: "#070707",
    color: "#fff",
    padding: "28px 16px 60px",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  card: {
    maxWidth: 680,
    margin: "0 auto",
  },

  backLink: {
    color: "#bbb",
    textDecoration: "none",
    fontWeight: 700,
  },

  kicker: {
    color: "#72f56d",
    fontWeight: 900,
    marginTop: 28,
  },

  title: {
    fontSize: "clamp(38px, 9vw, 64px)",
    lineHeight: 1,
    margin: "10px 0 16px",
  },

  text: {
    color: "#bdbdbd",
    lineHeight: 1.6,
    fontSize: 18,
    marginBottom: 28,
  },

  label: {
    display: "grid",
    gap: 8,
    marginBottom: 18,
    fontWeight: 800,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: 52,
    background: "#111",
    color: "#fff",
    border: "1px solid #373737",
    borderRadius: 12,
    padding: "0 14px",
    fontSize: 16,
  },

  section: {
    display: "grid",
    gap: 14,
    marginBottom: 22,
  },

  categoryGrid: {
    display: "grid",
    gap: 9,
  },

  categoryButton: {
    textAlign: "left",
    padding: "14px",
    borderRadius: 12,
    border: "1px solid #353535",
    background: "#111",
    color: "#ddd",
    fontSize: 16,
    fontWeight: 800,
    cursor: "pointer",
  },

  categoryButtonActive: {
    background: "#142b14",
    border: "1px solid #54d94f",
    color: "#8cff87",
  },

  primaryButton: {
    display: "flex",
    width: "100%",
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    border: 0,
    borderRadius: 12,
    background: "#39ff14",
    color: "#071006",
    fontWeight: 900,
    fontSize: 18,
    textDecoration: "none",
    cursor: "pointer",
  },

  privateNote: {
    color: "#777",
    lineHeight: 1.5,
    fontSize: 13,
    marginTop: 18,
  },
};
