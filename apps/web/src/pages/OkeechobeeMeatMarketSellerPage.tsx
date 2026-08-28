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
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState("");
  const [price, setPrice] = useState("");
  const [fulfillment, setFulfillment] = useState("Pickup");
  const [location, setLocation] = useState("Okeechobee");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [listingPhoto, setListingPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (
      !businessName.trim() ||
      !contact.trim() ||
      !email.trim() ||
      !products.trim()
    ) {
      alert("Please add your ranch or business name, phone number, email, and what you have available.");
      return;
    }

    setIsSubmitting(true);

    const cleanBusinessName = businessName.trim();
    const cleanContactName = contactName.trim() || "Not provided";
    const cleanContact = contact.trim();
    const cleanEmail = email.trim();
    const cleanProducts = products.trim();
    const cleanPrice = price.trim();
    const cleanLocation = location.trim() || "Okeechobee";
    const cleanLink = link.trim();
    const cleanNotes = notes.trim();
    const now = new Date().toISOString();

    const title = `Live Meat Market Seller: ${cleanBusinessName}`;

    let listingPhotoUrl = "";
    let uploadedPhotoPath = "";

    if (listingPhoto) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(listingPhoto.type)) {
        alert("Please use a JPG, PNG, or WEBP photo.");
        setIsSubmitting(false);
        return;
      }

      const maxBytes = 8 * 1024 * 1024;

      if (listingPhoto.size > maxBytes) {
        alert("Please use a photo smaller than 8 MB.");
        setIsSubmitting(false);
        return;
      }

      const extension =
        listingPhoto.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeBusiness =
        slugify(cleanBusinessName) || "seller";

      uploadedPhotoPath =
        `${safeBusiness}/${Date.now()}-listing.${extension}`;

      const { error: photoUploadError } = await supabase.storage
        .from("okeechobee-meat-market-seller-images")
        .upload(uploadedPhotoPath, listingPhoto, {
          cacheControl: "3600",
          upsert: false,
          contentType: listingPhoto.type || undefined,
        });

      if (photoUploadError) {
        console.error(
          "Could not upload seller listing photo:",
          photoUploadError
        );
        alert("Your listing photo could not be uploaded. Please try again.");
        setIsSubmitting(false);
        return;
      }

      const { data: publicPhoto } = supabase.storage
        .from("okeechobee-meat-market-seller-images")
        .getPublicUrl(uploadedPhotoPath);

      listingPhotoUrl = publicPhoto.publicUrl || "";
    }

    const description = [
      `Ranch / Business: ${cleanBusinessName}`,
      `Contact Name: ${cleanContactName}`,
      `Best Contact: ${cleanContact}`,
      `Email: ${cleanEmail}`,
      `Selling: ${cleanProducts}`,
      `Price / Package: ${cleanPrice || "Not provided"}`,
      `Pickup / Delivery: ${fulfillment}`,
      `Location: ${cleanLocation}`,
      `Website / Facebook / Order Link: ${cleanLink || "Not provided"}`,
      `Listing Photo: ${listingPhotoUrl || "Not provided"}`,
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

      if (uploadedPhotoPath) {
        await supabase.storage
          .from("okeechobee-meat-market-seller-images")
          .remove([uploadedPhotoPath]);
      }

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
          <h1 style={styles.title}>Got it.</h1>
          <p style={styles.text}>
            We'll review it and get it added to the local market.
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
          <h1 style={styles.title}>Add what I have.</h1>
          <p style={styles.text}>
            Tell us what you have available. We will review it and help get it in front of local buyers.
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
            Phone number
            <input
              style={styles.input}
              type="tel"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder="Example: 863-555-1234"
              required
            />
          </label>

          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            
              required
            />
          </label>

          <label style={styles.label}>
            What do you have available?
            <textarea
              style={styles.textarea}
              value={products}
              onChange={(event) => setProducts(event.target.value)}
              placeholder="Ground beef, steaks, quarter beef, beef boxes, whole beef..."
              rows={3}
            />
          </label>

          <label style={styles.label}>
            Price or package
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
            Listing photo
            <input
              style={styles.input}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setListingPhoto(event.target.files?.[0] || null)
              }
            />
            <span
              style={{
                color: "#667068",
                fontSize: 12,
                lineHeight: 1.45,
                fontWeight: 600,
              }}
            >
              Optional. Choose one photo that represents your farm, ranch,
              animals, products, storefront, or business. JPG, PNG, or WEBP
              up to 8 MB.
            </span>
          </label>

          <label style={styles.label}>
            Anything else?
            <textarea
              style={styles.textarea}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Processing dates, minimum order, pickup days, special cuts..."
              rows={4}
            />
          </label>

                    <p
            style={{
              margin: "2px 0 4px",
              fontSize: 13,
              lineHeight: 1.5,
              color: "#667068",
            }}
          >
            We do not sell or give your information to third parties.
          </p>
          <button
            type="submit"
            style={styles.primaryButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add What I Have"}
          </button>

          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 16,
              fontSize: 13,
            }}
          >
            <Link
              to="/privacy"
              style={{ color: "#755a2f", fontWeight: 800 }}
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              style={{ color: "#755a2f", fontWeight: 800 }}
            >
              Terms of Use
            </Link>
          </div>
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


