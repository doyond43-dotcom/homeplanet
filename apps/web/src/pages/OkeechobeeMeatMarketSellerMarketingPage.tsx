import { useState } from "react";

type Product = {
  name: string;
  description?: string;
  price?: string;
  availability?: string;
};

type Props = {
  slug: string;
  sellerName: string;
  products: Product[];
};

const areas = [
  "Fort Pierce",
  "Vero Beach",
  "Hobe Sound",
  "Okeechobee",
  "Port St. Lucie",
  "Stuart"
];

const panel: React.CSSProperties = {
  background: "#fffdf8",
  border: "1px solid #dfd5c4",
  borderRadius: 22,
  padding: 20,
  marginBottom: 18,
  boxShadow: "0 10px 32px rgba(50,39,20,.06)"
};

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: 48,
  padding: 12,
  border: "1px solid #d6c9b6",
  borderRadius: 11,
  background: "#fff",
  color: "#17231b",
  fontSize: 16
};

const button: React.CSSProperties = {
  background: "#17231b",
  color: "#fff",
  border: 0,
  padding: "13px 20px",
  borderRadius: 11,
  fontWeight: 800,
  cursor: "pointer"
};

export default function SellerMarketing({
  slug,
  sellerName,
  products
}: Props) {
  const storageKey = `homeplanet-marketing-draft-v1:${slug}`;

  const [marketingOpen, setMarketingOpen] = useState(false);
  const [audience, setAudience] = useState("both");
  const [locations, setLocations] = useState<string[]>([]);
  const [goal, setGoal] = useState("orders");
  const [productName, setProductName] = useState("");
  const [details, setDetails] = useState("");
  const [draft, setDraft] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || "";
    } catch {
      return "";
    }
  });
  const [notice, setNotice] = useState("");

  const availableProducts = products.filter(p => p.name.trim());
  const chosenProduct = availableProducts.find(p => p.name === productName);

  function toggleArea(area: string) {
    setLocations(current =>
      current.includes(area)
        ? current.filter(a => a !== area)
        : [...current, area]
    );
  }

  function createCampaign() {
    setNotice("");

    const intro =
      goal === "orders"
        ? `Looking to order from ${sellerName}?`
        : goal === "return"
          ? `We'd love to welcome you back to ${sellerName}!`
          : `Discover ${sellerName}!`;

    const productText = chosenProduct
      ? `\n\nFeatured product: ${chosenProduct.name}` +
        (chosenProduct.description?.trim()
          ? `\n${chosenProduct.description.trim()}`
          : "") +
        (chosenProduct.price?.trim()
          ? `\nListed price: ${chosenProduct.price.trim()}`
          : "")
      : "";

    const areaText = locations.length
      ? `\n\nServing customers in: ${locations.join(", ")}.`
      : "";

    const additional = details.trim()
      ? `\n\n${details.trim()}`
      : "";

    const result =
      `${intro}${productText}${areaText}${additional}` +
      `\n\nContact ${sellerName} for current availability, ordering and pickup details.`;

    setDraft(result);

    try {
      localStorage.setItem(storageKey, result);
      setNotice("Campaign draft created and saved in this browser.");
    } catch {
      setNotice("Campaign draft created. Browser storage is unavailable.");
    }
  }

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setNotice("Campaign copied. You can paste it wherever you need.");
    } catch {
      setNotice("Copy unavailable. Select the draft text and copy it manually.");
    }
  }

  function updateDraft(value: string) {
    setDraft(value);
    setNotice("");
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      // Editing still works when browser storage is disabled.
    }
  }

  return (
    <section style={panel} aria-label="Grow Your Customers">
      <div style={{
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: 2,
        color: "#876c36"
      }}>
        HOMEPLANET / MARKETING
      </div>

      <h2 style={{
        fontSize: 30,
        margin: "10px 0 5px",
        letterSpacing: "-.03em"
      }}>
        Grow Your Customers
      </h2>

      <p style={{ color: "#667168", marginTop: 0 }}>
        One campaign. Two audiences. Let's make something useful.
      </p>

      <button
        type="button"
        aria-expanded={marketingOpen}
        onClick={() => setMarketingOpen(open => !open)}
        style={{
          ...button,
          width: "100%",
          marginTop: 12,
          background: "#193c2b"
        }}
      >
        {marketingOpen ? "Hide Marketing Tools ↑" : "Create Campaign ↓"}
      </button>

      {marketingOpen && <>
      <h3>Who do you want to reach?</h3>

      {[
        ["existing", "My existing customers"],
        ["new", "New customers nearby"],
        ["both", "Both — grow my business"]
      ].map(([value, label]) => (
        <label key={value} style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
          cursor: "pointer"
        }}>
          <input
            type="radio"
            name="homeplanet-campaign-audience"
            checked={audience === value}
            onChange={() => setAudience(value)}
          />
          {label}
        </label>
      ))}

      <h3 style={{ marginTop: 26 }}>
        Where do you serve customers?
      </h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))",
        gap: 12
      }}>
        {areas.map(area => (
          <label key={area} style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer"
          }}>
            <input
              type="checkbox"
              checked={locations.includes(area)}
              onChange={() => toggleArea(area)}
            />
            {area}
          </label>
        ))}
      </div>

      <p style={{ fontSize: 13, color: "#667168" }}>
        Select only areas your business actually serves.
        No locations are assumed.
      </p>

      <h3 style={{ marginTop: 26 }}>
        What's the goal of this campaign?
      </h3>

      {[
        ["orders", "Get more orders"],
        ["return", "Bring existing customers back"],
        ["awareness", "Introduce my business to new customers"]
      ].map(([value, label]) => (
        <label key={value} style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
          cursor: "pointer"
        }}>
          <input
            type="radio"
            name="homeplanet-campaign-goal"
            checked={goal === value}
            onChange={() => setGoal(value)}
          />
          {label}
        </label>
      ))}

      <h3 style={{ marginTop: 26 }}>
        What would you like to promote?
      </h3>

      <select
        style={input}
        value={productName}
        onChange={e => setProductName(e.target.value)}
      >
        <option value="">My business in general</option>
        {availableProducts.map((product, index) => (
          <option key={`${product.name}-${index}`} value={product.name}>
            {product.name}
          </option>
        ))}
      </select>

      <h3 style={{ marginTop: 24 }}>
        Anything else customers should know?
      </h3>

      <textarea
        style={{ ...input, minHeight: 100, resize: "vertical" }}
        value={details}
        onChange={e => setDetails(e.target.value)}
        placeholder="Example: Taking orders for next week's pickup."
      />

      <div style={{
        marginTop: 20,
        padding: 15,
        background: "#f5efe3",
        borderRadius: 13
      }}>
        <strong>Campaign direction</strong>
        <p style={{ marginBottom: 0, color: "#59665a" }}>
          {audience === "both"
            ? "Existing customers + local discovery"
            : audience === "existing"
              ? "Existing customer outreach"
              : "New local customer discovery"}
          {" · "}
          {locations.length ? locations.join(", ") : "Areas not selected"}
          {" · "}
          {goal === "orders"
            ? "Generate orders"
            : goal === "return"
              ? "Bring customers back"
              : "Introduce the business"}
        </p>
      </div>

      <button
        type="button"
        style={{ ...button, marginTop: 16 }}
        onClick={createCampaign}
      >
        Create My Campaign →
      </button>

      {draft && (
        <div style={{
          marginTop: 22,
          borderTop: "1px solid #dfd5c4",
          paddingTop: 20
        }}>
          <h3 style={{ marginTop: 0 }}>Your Campaign Draft</h3>

          <p style={{ color: "#667168", fontSize: 14 }}>
            Review and edit your message before using it.
            Changes are saved in this browser.
          </p>

          <textarea
            aria-label="Campaign draft"
            style={{
              ...input,
              minHeight: 220,
              resize: "vertical",
              lineHeight: 1.6
            }}
            value={draft}
            onChange={e => updateDraft(e.target.value)}
          />

          <button
            type="button"
            style={{ ...button, marginTop: 12 }}
            onClick={() => void copyDraft()}
          >
            Copy Campaign
          </button>

          <p style={{ color: "#667168", fontSize: 13 }}>
            Your draft stays inside HomePlanet. Automatic email,
            text and Facebook delivery will become available only
            after the sending connections are implemented.
          </p>
        </div>
      )}

      </>}

      {notice && (
        <p role="status" style={{
          color: "#27653c",
          fontWeight: 700,
          marginTop: 14
        }}>
          {notice}
        </p>
      )}
    </section>
  );
}