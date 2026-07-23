import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type FeaturedItem = {
  name: string;
  price: string;
};

type YardSaleDraft = {
  saleName: string;
  area: string;
  saleDate: string;
  startTime: string;
  description: string;
  contact: string;
  items: FeaturedItem[];
};

const YARD_SALE_DRAFT_KEY = "homeplanet-yard-sale-draft-v1";

function slugifyYardSale(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 68);

  return base || "yard-sale";
}

function makePublishSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

const emptyDraft: YardSaleDraft = {
  saleName: "",
  area: "",
  saleDate: "",
  startTime: "",
  description: "",
  contact: "",
  items: [{ name: "", price: "" }],
};

function loadDraft(): YardSaleDraft {
  if (typeof window === "undefined") {
    return emptyDraft;
  }

  try {
    const saved = window.localStorage.getItem(YARD_SALE_DRAFT_KEY);

    if (!saved) {
      return emptyDraft;
    }

    const parsed = JSON.parse(saved) as Partial<YardSaleDraft>;

    return {
      saleName: typeof parsed.saleName === "string" ? parsed.saleName : "",
      area: typeof parsed.area === "string" ? parsed.area : "",
      saleDate: typeof parsed.saleDate === "string" ? parsed.saleDate : "",
      startTime:
        typeof parsed.startTime === "string" ? parsed.startTime : "",
      description:
        typeof parsed.description === "string" ? parsed.description : "",
      contact: typeof parsed.contact === "string" ? parsed.contact : "",
      items:
        Array.isArray(parsed.items) && parsed.items.length > 0
          ? parsed.items.slice(0, 6).map((item) => ({
              name: typeof item?.name === "string" ? item.name : "",
              price: typeof item?.price === "string" ? item.price : "",
            }))
          : [{ name: "", price: "" }],
    };
  } catch {
    return emptyDraft;
  }
}

export default function YardSaleStartPage() {
  const navigate = useNavigate();
  const [initialDraft] = useState<YardSaleDraft>(() => loadDraft());
  const [saleName, setSaleName] = useState(initialDraft.saleName);
  const [area, setArea] = useState(initialDraft.area);
  const [saleDate, setSaleDate] = useState(initialDraft.saleDate);
  const [startTime, setStartTime] = useState(initialDraft.startTime);
  const [description, setDescription] = useState(initialDraft.description);
  const [contact, setContact] = useState(initialDraft.contact);
  const [mainPhoto, setMainPhoto] = useState("");
  const [mainPhotoName, setMainPhotoName] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [items, setItems] = useState<FeaturedItem[]>(initialDraft.items);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const draft: YardSaleDraft = {
      saleName,
      area,
      saleDate,
      startTime,
      description,
      contact,
      items,
    };

    try {
      window.localStorage.setItem(
        YARD_SALE_DRAFT_KEY,
        JSON.stringify(draft),
      );
    } catch {
      // Draft saving should never block the builder.
    }
  }, [
    saleName,
    area,
    saleDate,
    startTime,
    description,
    contact,
    items,
  ]);

  const displayName = saleName.trim() || "Your Yard Sale";
  const displayArea = area.trim() || "Your neighborhood";
  const displayDescription =
    description.trim() ||
    "Add a short description so people know what they can expect to find.";

  const formattedDate = useMemo(() => {
    if (!saleDate) return "Choose a date";

    const parsed = new Date(`${saleDate}T12:00:00`);

    if (Number.isNaN(parsed.getTime())) return saleDate;

    return parsed.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [saleDate]);

  const updateItem = (
    index: number,
    field: keyof FeaturedItem,
    value: string,
  ) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => {
    if (items.length >= 6) return;
    setItems((current) => [...current, { name: "", price: "" }]);
  };

  const handleMainPhoto = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      setMainPhoto(reader.result);
      setMainPhotoName(file.name);
    };

    reader.readAsDataURL(file);
  };

  const publishYardSale = async () => {
    if (publishing) return;

    const cleanName = saleName.trim();
    const cleanArea = area.trim();
    const cleanDescription = description.trim();
    const cleanContact = contact.trim();

    const cleanItems = items
      .map((item) => ({
        name: item.name.trim(),
        price: item.price.trim(),
      }))
      .filter((item) => item.name);

    if (!cleanName) {
      window.alert("Please add the yard sale name.");
      return;
    }

    if (!cleanArea) {
      window.alert("Please add the neighborhood or general area.");
      return;
    }

    if (!saleDate) {
      window.alert("Please select the yard sale date.");
      return;
    }

    if (!startTime) {
      window.alert("Please select the start time.");
      return;
    }

    if (!cleanContact) {
      window.alert("Please add the best contact method.");
      return;
    }

    if (!mainPhoto) {
      window.alert("Please add one main yard sale photo.");
      return;
    }

    setPublishing(true);

    let uploadedPhotoPath = "";

    try {
      const slug =
        `${slugifyYardSale(cleanName)}-${makePublishSuffix()}`;

      const imageResponse = await fetch(mainPhoto);
      const imageBlob = await imageResponse.blob();

      const originalExtension =
        mainPhotoName.split(".").pop()?.toLowerCase() || "";

      const allowedExtension = [
        "jpg",
        "jpeg",
        "png",
        "webp",
        "heic",
        "heif",
      ].includes(originalExtension)
        ? originalExtension
        : imageBlob.type === "image/png"
          ? "png"
          : imageBlob.type === "image/webp"
            ? "webp"
            : "jpg";

      uploadedPhotoPath =
        `${slug}/${Date.now()}-main.${allowedExtension}`;

      const uploadResult = await supabase.storage
        .from("yard-sale-images")
        .upload(uploadedPhotoPath, imageBlob, {
          cacheControl: "3600",
          contentType: imageBlob.type || "image/jpeg",
          upsert: false,
        });

      if (uploadResult.error) {
        throw new Error(
          `Photo upload failed: ${uploadResult.error.message}`,
        );
      }

      const publicPhotoUrl = supabase.storage
        .from("yard-sale-images")
        .getPublicUrl(uploadedPhotoPath).data.publicUrl;

      const insertResult = await supabase
        .from("yard_sales")
        .insert({
          slug,
          sale_name: cleanName,
          area: cleanArea,
          sale_date: saleDate,
          start_time: startTime,
          description: cleanDescription,
          contact: cleanContact,
          featured_items: cleanItems,
          main_photo_url: publicPhotoUrl,
          main_photo_path: uploadedPhotoPath,
          status: "published",
        })
        .select("slug")
        .single();

      if (insertResult.error || !insertResult.data?.slug) {
        throw new Error(
          insertResult.error?.message ||
            "The yard sale page could not be saved.",
        );
      }

      try {
        window.localStorage.removeItem(YARD_SALE_DRAFT_KEY);
      } catch {
        // Successful publishing should not fail over local cleanup.
      }

      setReviewOpen(false);
      navigate(`/yard-sale/${insertResult.data.slug}`);
    } catch (error) {
      console.error("Yard sale publish failed:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "The yard sale page could not be published.",
      );
    } finally {
      setPublishing(false);
    }
  };

  return (
    <main className="ys-page">
      <header className="ys-header">
        <a href="/" className="ys-brand">
          HomePlanet
        </a>

        <a href="/" className="ys-back">
          Back to HomePlanet
        </a>
      </header>

      <section className="ys-hero">
        <div className="ys-eyebrow">Simple self-serve page</div>

        <h1>
          Start Your
          <span> Yard Sale Page.</span>
        </h1>

        <p>
          Add the basics, feature a few items, and see your page come together
          while you build it.
        </p>

        <div className="ys-steps">
          <span>1. Sale basics</span>
          <span>2. Featured items</span>
          <span>3. Review and publish</span>
        </div>
      </section>

      <section className="ys-builder">
        <div className="ys-form-column">
          <div className="ys-panel">
            <div className="ys-panel-heading">
              <span>01</span>
              <div>
                <strong>Sale basics</strong>
                <p>Tell people when, where, and what kind of sale it is.</p>
              </div>
            </div>

            <div className="ys-fields">
              <label>
                <span>Yard sale name</span>
                <input
                  value={saleName}
                  onChange={(event) => setSaleName(event.target.value)}
                  placeholder="Saturday neighborhood yard sale"
                />
              </label>

              <label>
                <span>Neighborhood or general area</span>
                <input
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  placeholder="Taylor Creek, Okeechobee"
                />
              </label>

              <div className="ys-field-row">
                <label>
                  <span>Date</span>
                  <input
                    type="date"
                    value={saleDate}
                    onChange={(event) => setSaleDate(event.target.value)}
                  />
                </label>

                <label>
                  <span>Start time</span>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                  />
                </label>
              </div>

              <label>
                <span>What will people find?</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Furniture, tools, clothes, kids items, home decor, and more."
                  rows={4}
                />
              </label>

              <label className="ys-photo-field">
                <span>Main yard sale photo</span>

                <div className="ys-photo-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleMainPhoto(event.target.files?.[0])
                    }
                  />

                  <strong>
                    {mainPhotoName || "Choose a wide photo"}
                  </strong>

                  <small>
                    Show the full setup, several good items, or yourself with
                    the sale. Horizontal daylight photos work best.
                  </small>
                </div>
              </label>

              <label>
                <span>Best contact method</span>
                <input
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  placeholder="Phone number, email, or Facebook name"
                />
              </label>
            </div>
          </div>

          <div className="ys-panel">
            <div className="ys-panel-heading">
              <span>02</span>
              <div>
                <strong>Featured items</strong>
                <p>Add a few things that will make people stop scrolling.</p>
              </div>
            </div>

            <div className="ys-items">
              {items.map((item, index) => (
                <div className="ys-item-row" key={index}>
                  <label>
                    <span>Item {index + 1}</span>
                    <input
                      value={item.name}
                      onChange={(event) =>
                        updateItem(index, "name", event.target.value)
                      }
                      placeholder="Solid wood side table"
                    />
                  </label>

                  <label className="ys-price-field">
                    <span>Price</span>
                    <input
                      value={item.price}
                      onChange={(event) =>
                        updateItem(index, "price", event.target.value)
                      }
                      placeholder="$35"
                    />
                  </label>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="ys-add-item"
              onClick={addItem}
              disabled={items.length >= 6}
            >
              {items.length >= 6 ? "Six items added" : "Add Another Item"}
            </button>
          </div>

          <div className="ys-publish-panel">
            <div>
              <span>03</span>
              <strong>Ready to make it live?</strong>
              <p>
                Review your page, confirm the details, and prepare your
                shareable yard sale link.
              </p>
            </div>

            <button type="button" onClick={() => setReviewOpen(true)}>
              Review and Publish
            </button>
          </div>
        </div>

        <aside className="ys-preview-column">
          <div className="ys-preview-label">Live preview</div>

          <article className="ys-preview">
            <div
              className="ys-preview-image"
              style={{
                backgroundImage: `
                  linear-gradient(180deg, transparent, rgba(2, 6, 4, 0.72)),
                  url("${mainPhoto || "/images/homeplanet-live-yard-sale.webp"}")
                `,
              }}
            >
              <div className="ys-preview-image-copy">
                <span>Yard sale</span>
                <strong>{displayName}</strong>
              </div>
            </div>

            <div className="ys-preview-content">
              <div className="ys-preview-status">
                <span>Upcoming sale</span>
                <b>Live page preview</b>
              </div>

              <h2>{displayName}</h2>

              <div className="ys-preview-details">
                <div>
                  <span>Date</span>
                  <strong>{formattedDate}</strong>
                </div>

                <div>
                  <span>Starts</span>
                  <strong>{startTime || "Choose a time"}</strong>
                </div>

                <div>
                  <span>Area</span>
                  <strong>{displayArea}</strong>
                </div>
              </div>

              <p>{displayDescription}</p>

              <div className="ys-preview-items">
                <span>Featured items</span>

                {items.some((item) => item.name.trim()) ? (
                  items
                    .filter((item) => item.name.trim())
                    .map((item, index) => (
                      <div key={`${item.name}-${index}`}>
                        <strong>{item.name}</strong>
                        <b>{item.price || "Ask seller"}</b>
                      </div>
                    ))
                ) : (
                  <div>
                    <strong>Your first featured item</strong>
                    <b>Add a price</b>
                  </div>
                )}
              </div>

              <button type="button">
                {contact.trim() ? "Contact Seller" : "Contact will appear here"}
              </button>
            </div>
          </article>

          <div className="ys-preview-note">
            Your finished page will have one clean link you can share on
            Facebook, text messages, signs, and neighborhood groups.
          </div>
        </aside>
      </section>

      {reviewOpen && (
        <div
          className="ys-review-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setReviewOpen(false);
            }
          }}
        >
          <section
            className="ys-review-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ys-review-title"
          >
            <div className="ys-review-head">
              <div>
                <span>Final review</span>
                <h2 id="ys-review-title">Your yard sale page is almost ready.</h2>
              </div>

              <button
                type="button"
                className="ys-review-close"
                onClick={() => setReviewOpen(false)}
                aria-label="Close review"
              >
                ×
              </button>
            </div>

            <div className="ys-review-summary">
              <div>
                <span>Sale</span>
                <strong>{displayName}</strong>
              </div>

              <div>
                <span>Date and time</span>
                <strong>
                  {formattedDate} · {startTime || "Time not selected"}
                </strong>
              </div>

              <div>
                <span>Area</span>
                <strong>{displayArea}</strong>
              </div>

              <div>
                <span>Featured items</span>
                <strong>
                  {items.filter((item) => item.name.trim()).length} added
                </strong>
              </div>

              <div>
                <span>Main photo</span>
                <strong>{mainPhotoName || "Example image currently used"}</strong>
              </div>

              <div>
                <span>Contact</span>
                <strong>{contact.trim() || "Contact method not added"}</strong>
              </div>
            </div>

            <div className="ys-review-includes">
              <span>Your finished page will include</span>

              <div>
                <p>One clean shareable HomePlanet link</p>
                <p>Your sale photo, date, time, area, and description</p>
                <p>Featured items with prices</p>
                <p>A clear way for shoppers to contact you</p>
                <p>A mobile-friendly page for Facebook, text, and signs</p>
              </div>
            </div>

            <div className="ys-review-notice">
              <strong>Your page will publish immediately.</strong>
              <p>
                Confirming creates the permanent yard sale page and sends you
                directly to the finished shareable link. No payment is charged
                during this test publish.
              </p>
            </div>

            <div className="ys-review-actions">
              <button
                type="button"
                className="ys-review-secondary"
                onClick={() => setReviewOpen(false)}
              >
                Keep Editing
              </button>

              <button
                type="button"
                className="ys-review-primary"
                onClick={publishYardSale}
                disabled={publishing}
              >
                {publishing ? "Publishing Page..." : "Publish My Yard Sale"}
              </button>
            </div>
          </section>
        </div>
      )}

      <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #020604;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        .ys-page {
          min-height: 100vh;
          padding: 0 24px 80px;
          background:
            radial-gradient(circle at 82% 8%, rgba(70, 255, 134, 0.1), transparent 25%),
            radial-gradient(circle at 10% 42%, rgba(70, 255, 134, 0.045), transparent 24%),
            #020604;
          color: #f1fff5;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .ys-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: min(1180px, 100%);
          margin: 0 auto;
          padding: 24px 0;
        }

        .ys-brand,
        .ys-back {
          color: inherit;
          text-decoration: none;
        }

        .ys-brand {
          color: #59ff91;
          font-size: 18px;
          font-weight: 950;
          letter-spacing: -0.04em;
        }

        .ys-back {
          color: rgba(236, 250, 240, 0.62);
          font-size: 13px;
          font-weight: 750;
        }

        .ys-hero {
          width: min(1180px, 100%);
          margin: 54px auto 0;
        }

        .ys-eyebrow,
        .ys-preview-label {
          color: #59ff91;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ys-hero h1 {
          max-width: 900px;
          margin: 20px 0 0;
          font-size: clamp(54px, 8vw, 104px);
          line-height: 0.9;
          letter-spacing: -0.075em;
        }

        .ys-hero h1 span {
          color: #59ff91;
        }

        .ys-hero > p {
          max-width: 670px;
          margin: 26px 0 0;
          color: rgba(236, 250, 240, 0.65);
          font-size: clamp(17px, 2vw, 21px);
          line-height: 1.6;
        }

        .ys-steps {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 30px;
        }

        .ys-steps span {
          padding: 10px 14px;
          border: 1px solid rgba(89, 255, 145, 0.15);
          border-radius: 999px;
          background: rgba(89, 255, 145, 0.045);
          color: rgba(236, 250, 240, 0.72);
          font-size: 12px;
          font-weight: 800;
        }

        .ys-builder {
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) minmax(360px, 0.94fr);
          gap: 28px;
          width: min(1180px, 100%);
          margin: 58px auto 0;
          align-items: start;
        }

        .ys-form-column {
          display: grid;
          gap: 20px;
        }

        .ys-panel,
        .ys-publish-panel,
        .ys-preview,
        .ys-preview-note {
          border: 1px solid rgba(255, 255, 255, 0.085);
          background: rgba(5, 12, 8, 0.82);
          box-shadow:
            0 26px 80px rgba(0, 0, 0, 0.28),
            inset 0 1px rgba(255, 255, 255, 0.035);
        }

        .ys-panel {
          padding: 26px;
          border-radius: 26px;
        }

        .ys-panel-heading {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .ys-panel-heading > span,
        .ys-publish-panel > div > span {
          color: rgba(89, 255, 145, 0.55);
          font-size: 12px;
          font-weight: 950;
        }

        .ys-panel-heading strong,
        .ys-publish-panel strong {
          display: block;
          font-size: 21px;
          letter-spacing: -0.035em;
        }

        .ys-panel-heading p,
        .ys-publish-panel p {
          margin: 7px 0 0;
          color: rgba(236, 250, 240, 0.52);
          font-size: 13px;
          line-height: 1.5;
        }

        .ys-fields,
        .ys-items {
          display: grid;
          gap: 16px;
          margin-top: 22px;
        }

        .ys-field-row,
        .ys-item-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        label {
          display: grid;
          gap: 8px;
        }

        label > span {
          color: rgba(236, 250, 240, 0.62);
          font-size: 12px;
          font-weight: 800;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          outline: none;
          background: rgba(255, 255, 255, 0.035);
          color: #f2fff6;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        input {
          min-height: 50px;
          padding: 0 14px;
        }

        textarea {
          resize: vertical;
          padding: 14px;
          line-height: 1.5;
        }

        input:focus,
        textarea:focus {
          border-color: rgba(89, 255, 145, 0.65);
          box-shadow: 0 0 0 4px rgba(89, 255, 145, 0.08);
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(236, 250, 240, 0.28);
        }

        .ys-photo-upload {
          position: relative;
          display: grid;
          gap: 7px;
          min-height: 104px;
          padding: 16px;
          border: 1px dashed rgba(89, 255, 145, 0.28);
          border-radius: 15px;
          background: rgba(89, 255, 145, 0.035);
          cursor: pointer;
        }

        .ys-photo-upload input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .ys-photo-upload strong {
          color: #8dffb2;
          font-size: 13px;
        }

        .ys-photo-upload small {
          max-width: 460px;
          color: rgba(236, 250, 240, 0.48);
          font-size: 11px;
          line-height: 1.5;
        }

        .ys-price-field {
          grid-template-columns: 1fr;
        }

        .ys-add-item {
          min-height: 46px;
          margin-top: 18px;
          padding: 0 17px;
          border: 1px solid rgba(89, 255, 145, 0.22);
          border-radius: 13px;
          background: rgba(89, 255, 145, 0.06);
          color: #8dffb2;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        }

        .ys-add-item:disabled {
          opacity: 0.48;
          cursor: default;
        }

        .ys-publish-panel {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: center;
          padding: 24px 26px;
          border-radius: 24px;
        }

        .ys-publish-panel button,
        .ys-preview-content > button {
          min-height: 50px;
          padding: 0 20px;
          border: 0;
          border-radius: 14px;
          background: #59ff91;
          color: #031008;
          font-size: 13px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 14px 34px rgba(70, 255, 134, 0.15);
        }

        .ys-preview-column {
          position: sticky;
          top: 22px;
        }

        .ys-preview-label {
          margin: 0 0 12px 4px;
        }

        .ys-preview {
          overflow: hidden;
          border-radius: 28px;
        }

        .ys-preview-image {
          position: relative;
          min-height: 250px;
          background-color: #07110b;
          background-position: center 52%;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .ys-preview-image-copy {
          position: absolute;
          right: 22px;
          bottom: 20px;
          left: 22px;
        }

        .ys-preview-image-copy span,
        .ys-preview-image-copy strong {
          display: block;
        }

        .ys-preview-image-copy span {
          color: #74ffa4;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .ys-preview-image-copy strong {
          margin-top: 7px;
          font-size: 26px;
          letter-spacing: -0.045em;
        }

        .ys-preview-content {
          padding: 24px;
        }

        .ys-preview-status {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          color: rgba(236, 250, 240, 0.42);
          font-size: 10px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .ys-preview-status b {
          color: #59ff91;
        }

        .ys-preview-content h2 {
          margin: 18px 0 0;
          font-size: 34px;
          line-height: 1;
          letter-spacing: -0.055em;
        }

        .ys-preview-details {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-top: 20px;
        }

        .ys-preview-details div {
          min-height: 78px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
        }

        .ys-preview-details span,
        .ys-preview-details strong {
          display: block;
        }

        .ys-preview-details span {
          color: rgba(236, 250, 240, 0.4);
          font-size: 9px;
          text-transform: uppercase;
        }

        .ys-preview-details strong {
          margin-top: 8px;
          font-size: 12px;
          line-height: 1.35;
        }

        .ys-preview-content > p {
          margin: 20px 0 0;
          color: rgba(236, 250, 240, 0.63);
          font-size: 13px;
          line-height: 1.6;
        }

        .ys-preview-items {
          display: grid;
          gap: 8px;
          margin-top: 22px;
        }

        .ys-preview-items > span {
          margin-bottom: 2px;
          color: #59ff91;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .ys-preview-items > div {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 13px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.025);
          font-size: 12px;
        }

        .ys-preview-items b {
          color: #76ffa5;
        }

        .ys-preview-content > button {
          width: 100%;
          margin-top: 20px;
        }

        .ys-preview-note {
          margin-top: 14px;
          padding: 17px 18px;
          border-radius: 17px;
          color: rgba(236, 250, 240, 0.54);
          font-size: 12px;
          line-height: 1.55;
        }

        .ys-review-backdrop {
          position: fixed;
          z-index: 1000;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 22px;
          overflow-y: auto;
          background: rgba(0, 4, 2, 0.82);
          backdrop-filter: blur(14px);
        }

        .ys-review-modal {
          width: min(680px, 100%);
          max-height: calc(100vh - 44px);
          overflow-y: auto;
          padding: 28px;
          border: 1px solid rgba(89, 255, 145, 0.18);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 85% 0%,
              rgba(89, 255, 145, 0.09),
              transparent 27%
            ),
            #07100b;
          box-shadow:
            0 40px 120px rgba(0, 0, 0, 0.58),
            inset 0 1px rgba(255, 255, 255, 0.04);
        }

        .ys-review-head {
          display: flex;
          justify-content: space-between;
          gap: 22px;
          align-items: flex-start;
        }

        .ys-review-head span,
        .ys-review-includes > span {
          color: #59ff91;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .ys-review-head h2 {
          max-width: 520px;
          margin: 10px 0 0;
          font-size: clamp(29px, 5vw, 45px);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .ys-review-close {
          display: grid;
          place-items: center;
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.035);
          color: rgba(242, 255, 246, 0.72);
          font-size: 25px;
          line-height: 1;
          cursor: pointer;
        }

        .ys-review-summary {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
          margin-top: 26px;
        }

        .ys-review-summary > div {
          min-height: 86px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.025);
        }

        .ys-review-summary span,
        .ys-review-summary strong {
          display: block;
        }

        .ys-review-summary span {
          color: rgba(236, 250, 240, 0.42);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .ys-review-summary strong {
          margin-top: 9px;
          font-size: 13px;
          line-height: 1.4;
        }

        .ys-review-includes {
          margin-top: 20px;
          padding: 18px;
          border: 1px solid rgba(89, 255, 145, 0.12);
          border-radius: 18px;
          background: rgba(89, 255, 145, 0.035);
        }

        .ys-review-includes > div {
          display: grid;
          gap: 9px;
          margin-top: 14px;
        }

        .ys-review-includes p {
          position: relative;
          margin: 0;
          padding-left: 18px;
          color: rgba(236, 250, 240, 0.7);
          font-size: 12px;
          line-height: 1.45;
        }

        .ys-review-includes p::before {
          content: "";
          position: absolute;
          top: 7px;
          left: 0;
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #59ff91;
          box-shadow: 0 0 12px rgba(89, 255, 145, 0.45);
        }

        .ys-review-notice {
          margin-top: 16px;
          padding: 16px 17px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.025);
        }

        .ys-review-notice strong {
          font-size: 13px;
        }

        .ys-review-notice p {
          margin: 6px 0 0;
          color: rgba(236, 250, 240, 0.5);
          font-size: 11px;
          line-height: 1.5;
        }

        .ys-review-actions {
          display: grid;
          grid-template-columns: 0.72fr 1.28fr;
          gap: 10px;
          margin-top: 20px;
        }

        .ys-review-actions button {
          min-height: 52px;
          padding: 0 17px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 950;
          cursor: pointer;
        }

        .ys-review-secondary {
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(242, 255, 246, 0.72);
        }

        .ys-review-primary {
          border: 0;
          background: #59ff91;
          color: #031008;
          box-shadow: 0 14px 34px rgba(70, 255, 134, 0.16);
        }

        @media (max-width: 900px) {
          .ys-builder {
            grid-template-columns: 1fr;
          }

          .ys-preview-column {
            position: static;
          }
        }

        @media (max-width: 620px) {
          .ys-page {
            padding: 0 16px 54px;
          }

          .ys-header {
            padding: 20px 0;
          }

          .ys-back {
            font-size: 11px;
          }

          .ys-hero {
            margin-top: 36px;
          }

          .ys-hero h1 {
            font-size: clamp(50px, 16vw, 72px);
          }

          .ys-builder {
            margin-top: 42px;
          }

          .ys-panel {
            padding: 21px;
            border-radius: 22px;
          }

          .ys-field-row,
          .ys-item-row,
          .ys-preview-details {
            grid-template-columns: 1fr;
          }

          .ys-publish-panel {
            align-items: stretch;
            flex-direction: column;
          }

          .ys-publish-panel button {
            width: 100%;
          }

          .ys-review-modal {
            padding: 22px;
            border-radius: 23px;
          }

          .ys-review-summary,
          .ys-review-actions {
            grid-template-columns: 1fr;
          }

          .ys-preview-image {
            min-height: 210px;
          }
        }
      `}</style>
    </main>
  );
}