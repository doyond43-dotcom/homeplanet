import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type ProductRow = {
  id?: string;
  name: string;
  price: string;
  package: string;
  availability: string;
};

type Seller = {
  slug: string;
  name: string;
  email: string;
  orderMethod: string;
  orderDestination: string;
  fulfillment: string;
  pickupNote: string;
};

const emptyProduct = (): ProductRow => ({
  name: "",
  price: "",
  package: "",
  availability: "Available now",
});

export default function OkeechobeeMeatMarketSellerSetupPage() {
  const { slug } = useParams();

  const [token, setToken] = useState("");
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const rawToken = window.location.hash
      .replace(/^#/, "")
      .trim();

    setToken(rawToken);

    if (!rawToken || !slug) {
      setError("This seller update link is incomplete.");
      setLoading(false);
      return;
    }

    loadSeller(rawToken);
  }, [slug]);

  async function callSellerManage(
    rawToken: string,
    action: string,
    extra: Record<string, unknown> = {}
  ) {
    const response = await fetch(
      "/api/okeechobee-meat-market-seller-manage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          token: rawToken,
          action,
          ...extra,
        }),
      }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok || result?.ok !== true) {
      throw new Error(
        result?.error || "Could not update your seller page."
      );
    }

    return result;
  }

  async function loadSeller(rawToken: string) {
    try {
      setLoading(true);
      setError("");

      const result = await callSellerManage(
        rawToken,
        "load"
      );

      setSeller(result.seller);

      setProducts(
        (result.products || []).length
          ? result.products.map((product: any) => ({
              id: product.id,
              name: String(product.name || ""),
              price: String(product.price || ""),
              package: String(product.package || ""),
              availability: String(
                product.availability || "Available now"
              ),
            }))
          : [emptyProduct()]
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load your seller page."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateProduct(
    index: number,
    field: keyof ProductRow,
    value: string
  ) {
    setProducts((current) =>
      current.map((product, productIndex) =>
        productIndex === index
          ? { ...product, [field]: value }
          : product
      )
    );

    setSaved(false);
  }

  function addProduct() {
    setProducts((current) => [
      ...current,
      emptyProduct(),
    ]);

    setSaved(false);
  }

  function removeProduct(index: number) {
    setProducts((current) =>
      current.filter((_, productIndex) =>
        productIndex !== index
      )
    );

    setSaved(false);
  }

  async function save() {
    if (!seller || !token || saving) return;

    const cleanProducts = products.filter(
      (product) => product.name.trim()
    );

    if (!cleanProducts.length) {
      setError("Please keep at least one product on your page.");
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      await callSellerManage(token, "save", {
        orderMethod: seller.orderMethod,
        orderDestination: seller.orderDestination,
        fulfillment: seller.fulfillment,
        pickupNote: seller.pickupNote,
        products: cleanProducts,
      });

      setSaved(true);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save your seller page."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.shell}>
          <div style={styles.card}>
            <strong>Loading your farm page...</strong>
          </div>
        </section>
      </main>
    );
  }

  if (error && !seller) {
    return (
      <main style={styles.page}>
        <section style={styles.shell}>
          <div style={styles.card}>
            <div style={styles.kicker}>
              Okeechobee Live Meat Market
            </div>

            <h1 style={styles.title}>
              We couldn't open this link.
            </h1>

            <p style={styles.help}>{error}</p>
          </div>
        </section>
      </main>
    );
  }

  if (!seller) return null;

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <header style={styles.header}>
          <div style={styles.kicker}>
            Okeechobee Live Meat Market
          </div>

          <h1 style={styles.title}>
            {seller.name}
          </h1>

          <p style={styles.subtitle}>
            Update what you have available.
          </p>

          <p style={styles.help}>
            Add your current products, prices and package sizes.
            This is what buyers will see on your seller page.
          </p>
        </header>

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <div>
              <div style={styles.step}>1</div>
              <h2 style={styles.sectionTitle}>
                What do you have?
              </h2>
            </div>
          </div>

          <div style={styles.productList}>
            {products.map((product, index) => (
              <article
                key={product.id || index}
                style={styles.productCard}
              >
                <div style={styles.productTop}>
                  <strong style={styles.productNumber}>
                    Product {index + 1}
                  </strong>

                  {products.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>

                <label style={styles.label}>
                  Product or cut
                  <input
                    value={product.name}
                    onChange={(event) =>
                      updateProduct(
                        index,
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="Example: Ribeye"
                    style={styles.input}
                  />
                </label>

                <div style={styles.twoColumn}>
                  <label style={styles.label}>
                    Price
                    <input
                      value={product.price}
                      onChange={(event) =>
                        updateProduct(
                          index,
                          "price",
                          event.target.value
                        )
                      }
                      placeholder="Example: $9.00/lb"
                      style={styles.input}
                    />
                  </label>

                  <label style={styles.label}>
                    Package / size
                    <input
                      value={product.package}
                      onChange={(event) =>
                        updateProduct(
                          index,
                          "package",
                          event.target.value
                        )
                      }
                      placeholder="Example: 1 lb package"
                      style={styles.input}
                    />
                  </label>
                </div>

                <label style={styles.label}>
                  Availability
                  <select
                    value={product.availability}
                    onChange={(event) =>
                      updateProduct(
                        index,
                        "availability",
                        event.target.value
                      )
                    }
                    style={styles.input}
                  >
                    <option>Available now</option>
                    <option>Limited availability</option>
                    <option>Coming soon</option>
                    <option>Sold out</option>
                  </select>
                </label>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={addProduct}
            style={styles.addButton}
          >
            + Add Another Product
          </button>
        </section>

        <section style={styles.section}>
          <div style={styles.step}>2</div>

          <h2 style={styles.sectionTitle}>
            How do customers get it?
          </h2>

          <div style={styles.choiceRow}>
            {["Pickup", "Delivery", "Pickup & Delivery"].map(
              (choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => {
                    setSeller({
                      ...seller,
                      fulfillment: choice,
                    });
                    setSaved(false);
                  }}
                  style={
                    seller.fulfillment === choice
                      ? styles.choiceActive
                      : styles.choice
                  }
                >
                  {choice}
                </button>
              )
            )}
          </div>

          <label style={styles.label}>
            Pickup or delivery note
            <input
              value={seller.pickupNote}
              onChange={(event) => {
                setSeller({
                  ...seller,
                  pickupNote: event.target.value,
                });
                setSaved(false);
              }}
              placeholder="Example: Open Farm Saturday 10-12"
              style={styles.input}
            />
          </label>
        </section>

        <section style={styles.section}>
          <div style={styles.step}>3</div>

          <h2 style={styles.sectionTitle}>
            Where should buyers order?
          </h2>

          <p style={styles.help}>
            We send the customer to you. You keep the customer
            and the sale.
          </p>

          <div style={styles.choiceRow}>
            {["Website", "Email", "Phone / Text", "Facebook"].map(
              (choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => {
                    setSeller({
                      ...seller,
                      orderMethod: choice,
                    });
                    setSaved(false);
                  }}
                  style={
                    seller.orderMethod === choice
                      ? styles.choiceActive
                      : styles.choice
                  }
                >
                  {choice}
                </button>
              )
            )}
          </div>

          <label style={styles.label}>
            {seller.orderMethod === "Website"
              ? "Website or order link"
              : seller.orderMethod === "Email"
                ? "Order email"
                : seller.orderMethod === "Phone / Text"
                  ? "Phone number"
                  : "Facebook page"}

            <input
              value={seller.orderDestination}
              onChange={(event) => {
                setSeller({
                  ...seller,
                  orderDestination: event.target.value,
                });
                setSaved(false);
              }}
              style={styles.input}
            />
          </label>
        </section>

        {error ? (
          <div style={styles.error}>{error}</div>
        ) : null}

        {saved ? (
          <div style={styles.success}>
            ✓ Your seller page is updated.
          </div>
        ) : null}

        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={styles.saveButton}
        >
          {saving
            ? "Saving..."
            : `Save My ${seller.name} Page`}
        </button>

        <a
          href={`/planet/okeechobee/meat-market/seller/${seller.slug}`}
          style={styles.viewLink}
        >
          View My Public Seller Page
        </a>

        <div style={styles.footerNote}>
          Need help? Email support and we can update it with you.
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f5efe3",
    color: "#17231b",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "24px 14px 60px",
  },

  shell: {
    width: "100%",
    maxWidth: 720,
    margin: "0 auto",
  },

  header: {
    padding: "18px 4px 26px",
  },

  kicker: {
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: "#876c36",
  },

  title: {
    margin: "10px 0 4px",
    fontSize: "clamp(36px,8vw,60px)",
    lineHeight: 0.98,
    letterSpacing: "-.045em",
  },

  subtitle: {
    margin: "14px 0 4px",
    fontSize: 22,
    fontWeight: 900,
  },

  help: {
    margin: "8px 0 0",
    color: "#667168",
    fontSize: 15,
    lineHeight: 1.55,
  },

  section: {
    background: "#fffdf8",
    border: "1px solid #dfd5c4",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    boxShadow: "0 10px 32px rgba(50,39,20,.06)",
  },

  sectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  step: {
    display: "inline-flex",
    width: 30,
    height: 30,
    borderRadius: 999,
    background: "#17231b",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 950,
    marginBottom: 8,
  },

  sectionTitle: {
    margin: "0 0 16px",
    fontSize: 25,
    letterSpacing: "-.025em",
  },

  productList: {
    display: "grid",
    gap: 14,
  },

  productCard: {
    border: "1px solid #e3d8c7",
    borderRadius: 18,
    padding: 16,
    background: "#faf6ee",
  },

  productTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  productNumber: {
    fontSize: 14,
  },

  removeButton: {
    border: 0,
    background: "transparent",
    color: "#a14b3c",
    fontWeight: 850,
    cursor: "pointer",
  },

  label: {
    display: "grid",
    gap: 7,
    marginTop: 13,
    fontSize: 14,
    fontWeight: 900,
  },

  input: {
    width: "100%",
    minHeight: 52,
    boxSizing: "border-box",
    borderRadius: 12,
    border: "1px solid #d6c9b6",
    padding: "0 13px",
    background: "#fff",
    color: "#17231b",
    fontSize: 16,
    fontFamily: "inherit",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(210px,1fr))",
    gap: 10,
  },

  addButton: {
    width: "100%",
    minHeight: 50,
    marginTop: 14,
    borderRadius: 12,
    border: "1px dashed #92743d",
    background: "#fffaf0",
    color: "#644e28",
    fontSize: 16,
    fontWeight: 950,
    cursor: "pointer",
  },

  choiceRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 14,
  },

  choice: {
    minHeight: 44,
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid #d4c8b7",
    background: "#fff",
    color: "#17231b",
    fontWeight: 850,
    cursor: "pointer",
  },

  choiceActive: {
    minHeight: 44,
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid #17231b",
    background: "#17231b",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  saveButton: {
    width: "100%",
    minHeight: 58,
    border: 0,
    borderRadius: 14,
    background: "#17231b",
    color: "#fff",
    fontSize: 18,
    fontWeight: 950,
    cursor: "pointer",
  },

  success: {
    borderRadius: 14,
    background: "#e8f4e8",
    border: "1px solid #b8d8b8",
    color: "#235b2a",
    padding: 14,
    marginBottom: 14,
    fontWeight: 900,
    textAlign: "center",
  },

  error: {
    borderRadius: 14,
    background: "#fff0ec",
    border: "1px solid #e4b6a9",
    color: "#8d3123",
    padding: 14,
    marginBottom: 14,
    fontWeight: 800,
  },

  viewLink: {
    display: "block",
    textAlign: "center",
    marginTop: 16,
    color: "#6c542b",
    fontWeight: 900,
    textDecoration: "none",
  },

  footerNote: {
    textAlign: "center",
    marginTop: 24,
    color: "#7b817c",
    fontSize: 13,
  },

  card: {
    padding: 22,
    borderRadius: 20,
    background: "#fffdf8",
    border: "1px solid #dfd5c4",
  },
};
