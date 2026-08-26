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

export default function OkeechobeeMeatMarketSellerPage() {
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contact, setContact] = useState("");
  const [products, setProducts] = useState("");
  const [price, setPrice] = useState("");
  const [fulfillment, setFulfillment] = useState("Pickup");
  const [location, setLocation] = useState("Okeechobee");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (
      !businessName.trim() ||
      !contactName.trim() ||
      !contact.trim() ||
      !products.trim()
    ) {
      alert("Please add your ranch or business name, your name, contact info, and what you sell.");
      return;
    }

    setIsSubmitting(true);

    const cleanBusinessName = businessName.trim();
    const cleanContactName = contactName.trim();
    const cleanContact = contact.trim();
    const cleanProducts = products.trim();
    const cleanPrice = price.trim();
    const cleanLocation = location.trim() || "Okeechobee";
    const cleanLink = link.trim();
    const cleanNotes = notes.trim();
    const now = new Date().toISOString();

    const title = `Live Meat Market Seller: ${cleanBusinessName}`;

    const description = [
      `Ranch / Business: ${cleanBusinessName}`,
      `Contact Name: ${cleanContactName}`,
      `Best Contact: ${cleanContact}`,
      `Selling: ${cleanProducts}`,
      `Price / Package: ${cleanPrice || "Not provided"}`,
      `Pickup / Delivery: ${fulfillment}`,
      `Location: ${cleanLocation}`,
      `Website / Facebook / Order Link: ${cleanLink || "Not provided"}`,
      `Notes: ${cleanNotes || "None"}`,
    ].join("\n");

    const recordSlug = `${slugify(title)}-${Date.now()}`;

    const record = {
      title,
      slug: recordSlug,
      type: "Live Meat Market Seller",
      description,
      location: cleanLocation,
      contact: cleanContact,
      status: "Pending Review",
      project_needs: [],
      timeline: [
        {
          label: "Live Meat Market seller submitted",
          time: now,
        },
      ],
    };

    const { error } = await supabase
      .from("okeechobee_events")
      .insert(record);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("Something went wrong sending your listing.");
      return;
    }

    try {
      const notifyResponse = await fetch("/api/homeplanet-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: "okeechobee-meat-market-seller",
          slug: recordSlug,
        }),
      });

      if (!notifyResponse.ok) {
        const notifyError = await notifyResponse.json().catch(() => null);
        console.error("Listing saved, but notification failed:", notifyError);
      }
    } catch (notifyError) {
      console.error("Listing saved, but notification failed:", notifyError);
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <p style={styles.kicker}>Okeechobee Live Meat Market</p>
          <h1 style={styles.title}>Listing received.</h1>
          <p style={styles.text}>
            Thank you. We’ll review your information before anything is added to the public market.
          </p>

          <Link
            to="/planet/okeechobee/meat-market"
            style={styles.primaryButton}
          >
            Back To The Market
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <div style={styles.header}>
          <p style={styles.kicker}>Okeechobee Live Meat Market</p>
          <h1 style={styles.title}>Sell local meat.</h1>
          <p style={styles.text}>
            Ranchers, butchers, processors, and local meat shops can send us what they have available.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Ranch or business name
            <input
              style={styles.input}
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Example: Johnson Ranch"
            />
          </label>

          <label style={styles.label}>
            Your name
            <input
              style={styles.input}
              value={contactName}
              onChange={(event) => setContactName(event.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

          <label style={styles.label}>
            Phone or best contact
            <input
              style={styles.input}
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="Phone, text, email, or Messenger"
            />
          </label>

          <label style={styles.label}>
            What do you sell?
            <textarea
              style={styles.textarea}
              value={products}
              onChange={(event) => setProducts(event.target.value)}
              placeholder="Ground beef, steaks, quarter beef, whole beef, pork, custom cuts..."
              rows={3}
            />
          </label>

          <label style={styles.label}>
            Current price or package
            <input
              style={styles.input}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="$6.50/lb, 10-lb box $60, taking deposits..."
            />
          </label>

          <label style={styles.label}>
            Pickup or delivery?
            <select
              style={styles.input}
              value={fulfillment}
              onChange={(event) => setFulfillment(event.target.value)}
            >
              <option>Pickup</option>
              <option>Local delivery</option>
              <option>Pickup + local delivery</option>
              <option>Ask seller</option>
            </select>
          </label>

          <label style={styles.label}>
            Location
            <input
              style={styles.input}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Okeechobee, Buckhead Ridge, Fort Drum..."
            />
          </label>

          <label style={styles.label}>
            Website, Facebook, or order link
            <input
              style={styles.input}
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="Optional"
            />
          </label>

          <label style={styles.label}>
            Anything else we should know?
            <textarea
              style={styles.textarea}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Processing dates, minimum order, pickup days, special cuts..."
              rows={4}
            />
          </label>

          <button
            type="submit"
            style={styles.primaryButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Listing"}
          </button>
        </form>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top right, rgba(184,137,65,0.12), transparent 28rem), #f7f2e8",
    color: "#17231b",
    padding: "28px 16px 48px",
  },

  shell: {
    width: "min(100%, 720px)",
    margin: "0 auto",
  },

  card: {
    width: "min(100%, 720px)",
    margin: "80px auto 0",
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(23,35,27,0.1)",
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 18px 50px rgba(48,39,24,0.07)",
  },

  header: {
    marginBottom: "24px",
  },

  kicker: {
    margin: 0,
    color: "#755a2f",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },

  title: {
    margin: "10px 0 8px",
    fontSize: "clamp(38px, 8vw, 62px)",
    lineHeight: 0.96,
    letterSpacing: "-0.05em",
    fontWeight: 950,
  },

  text: {
    margin: 0,
    color: "#5f695f",
    fontSize: "17px",
    lineHeight: 1.55,
    fontWeight: 600,
  },

  form: {
    display: "grid",
    gap: "15px",
    padding: "22px",
    borderRadius: "26px",
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(23,35,27,0.1)",
    boxShadow: "0 16px 42px rgba(48,39,24,0.05)",
  },

  label: {
    display: "grid",
    gap: "7px",
    color: "#27382d",
    fontSize: "14px",
    fontWeight: 850,
  },

  input: {
    width: "100%",
    borderRadius: "14px",
    border: "1px solid rgba(25,60,43,0.16)",
    background: "#fffdf8",
    color: "#17231b",
    padding: "14px 15px",
    fontSize: "16px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    resize: "vertical",
    borderRadius: "14px",
    border: "1px solid rgba(25,60,43,0.16)",
    background: "#fffdf8",
    color: "#17231b",
    padding: "14px 15px",
    fontSize: "16px",
    lineHeight: 1.45,
    outline: "none",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "52px",
    border: 0,
    borderRadius: "15px",
    background: "#193c2b",
    color: "white",
    padding: "0 20px",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 950,
    cursor: "pointer",
  },
};

