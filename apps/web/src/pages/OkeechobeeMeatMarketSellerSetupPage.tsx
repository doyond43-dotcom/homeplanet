import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";

type ProductRow = {
  id?: string;
  name: string;
  category: string;
  price: string;
  package: string;
  checkoutPrice: string;
  marketMarker: string;
  quantityAvailable: string;
  pickupTiming: string;
  availability: string;
  description: string;
  imageUrl: string;
  externalOrderUrl: string;
  featured: boolean;
};

type Seller = {
  slug: string;
  name: string;
  email: string;
  heroImage: string;
  orderMethod: string;
  orderDestination: string;
  paymentProvider: string;
  paymentDestination: string;
  checkoutEnabled: boolean;
  fulfillment: string;
  pickupNote: string;
};

const emptyProduct = (): ProductRow => ({
  name: "",
  category: "",
  price: "",
  package: "",
  checkoutPrice: "",
  marketMarker: "",
  quantityAvailable: "",
  pickupTiming: "",
  availability: "Available now",
  description: "",
  imageUrl: "",
  externalOrderUrl: "",
  featured: false,
});

async function fileToJpegDataUrl(
  file: File,
  maxW = 1000,
  maxH = 1000,
  quality = 0.78
) {
  if (!/^image\//i.test(file.type)) {
    throw new Error("Please choose an image file.");
  }

  const url = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>(
      (resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = () =>
          reject(new Error("Could not load that image."));

        image.src = url;
      }
    );

    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;

    const widthRatio = maxW / Math.max(1, width);
    const heightRatio = maxH / Math.max(1, height);
    const ratio = Math.min(1, widthRatio, heightRatio);

    const nextWidth = Math.max(
      1,
      Math.round(width * ratio)
    );

    const nextHeight = Math.max(
      1,
      Math.round(height * ratio)
    );

    const canvas = document.createElement("canvas");
    canvas.width = nextWidth;
    canvas.height = nextHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Photo processing is unavailable.");
    }

    context.drawImage(
      img,
      0,
      0,
      nextWidth,
      nextHeight
    );

    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function compressStorefrontPhoto(file: File) {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read photo."));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not open photo."));
    img.src = source;
  });

  const maxWidth = 1400;
  const maxHeight = 900;
  const scale = Math.min(
    1,
    maxWidth / image.width,
    maxHeight / image.height
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare photo.");

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/jpeg", 0.78);
}

type SellerAnalyticsSummary = {
  storefrontViews: number;
  productClicks: number;
  buyerHandoffs: number;
  topProducts: Array<{
    name: string;
    clicks: number;
  }>;
};

type SellerAnalytics = {
  sevenDays: SellerAnalyticsSummary;
  allTime: SellerAnalyticsSummary;
};
export default function OkeechobeeMeatMarketSellerSetupPage() {
  const { slug } = useParams();

  const [token, setToken] = useState("");
  const [seller, setSeller] =
    useState<Seller | null>(null);

  const [products, setProducts] =
    useState<ProductRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] =
    useState<SellerAnalytics | null>(null);

  const [analyticsWindow, setAnalyticsWindow] =
    useState<"sevenDays" | "allTime">("sevenDays");


  useEffect(() => {
    const rawToken = window.location.hash
      .replace(/^#/, "")
      .trim();

    setToken(rawToken);

    console.log("[seller-setup-token]", {
      slug,
      length: rawToken.length,
      first4: rawToken.slice(0, 4),
      last4: rawToken.slice(-4),
    });

    if (!rawToken || !slug) {
      setError("This seller update link is incomplete.");
      setLoading(false);
      return;
    }

    void loadSeller(rawToken);
  }, [slug]);

  async function callSellerManage(
    rawToken: string,
    action: string,
    extra: Record<string, unknown> = {}
  ) {
    const response = await fetch(
      "/api/okeechobee-meat-market?route=seller-manage",
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

    const result = await response
      .json()
      .catch(() => null);

    if (!response.ok || result?.ok !== true) {
      throw new Error(
        result?.error ||
          "Could not update your seller page."
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

      setSeller({
        ...result.seller,
        heroImage: String(result.seller?.heroImage || ""),
        paymentProvider: String(
          result.seller?.paymentProvider || ""
        ),
        paymentDestination: String(
          result.seller?.paymentDestination || ""
        ),
        checkoutEnabled: Boolean(
          result.seller?.checkoutEnabled
        ),
      });

      setAnalytics(
        result.analytics && typeof result.analytics === "object"
          ? result.analytics
          : null
      );

      setProducts(
        (result.products || []).length
          ? result.products.map((product: any) => ({
              id: String(product.id || ""),
              name: String(product.name || ""),
              category: String(product.category || ""),
              price: String(product.price || ""),
              package: String(product.package || ""),
              checkoutPrice: String(product.checkout_price || ""),
              marketMarker: String(
                product.market_marker || ""
              ),
              quantityAvailable: String(
                product.quantity_available || ""
              ),
              pickupTiming: String(
                product.pickup_timing || ""
              ),
              availability: String(
                product.availability ||
                  "Available now"
              ),
              description: String(
                product.description || ""
              ),
              imageUrl: String(
                product.image_url || ""
              ),
              externalOrderUrl: String(
                product.external_order_url || ""
              ),
              featured: Boolean(product.featured),
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

  function updateProduct<K extends keyof ProductRow>(
    index: number,
    field: K,
    value: ProductRow[K]
  ) {
    setProducts((current) =>
      current.map((product, productIndex) =>
        productIndex === index
          ? {
              ...product,
              [field]: value,
            }
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
    if (
      products.length === 1 &&
      !products[0].name.trim()
    ) {
      return;
    }

    const product = products[index];

    if (
      product?.name.trim() &&
      !window.confirm(
        `Remove ${product.name} from your products?`
      )
    ) {
      return;
    }

    setProducts((current) => {
      const next = current.filter(
        (_, productIndex) => productIndex !== index
      );

      return next.length ? next : [emptyProduct()];
    });

    setSaved(false);
  }

  async function chooseProductPhoto(
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setError("");

      const imageUrl =
        await fileToJpegDataUrl(file);

      updateProduct(index, "imageUrl", imageUrl);
    } catch (photoError) {
      setError(
        photoError instanceof Error
          ? photoError.message
          : "Could not use that photo."
      );
    } finally {
      event.target.value = "";
    }
  }

  async function save() {
    if (!seller || !token || saving) return;

    const cleanProducts = products.filter(
      (product) => product.name.trim()
    );

    if (!cleanProducts.length) {
      setError(
        "Please keep at least one product on your page."
      );
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const result = await callSellerManage(
        token,
        "save",
        {
          heroImage: seller.heroImage,
          orderMethod: seller.orderMethod,
          orderDestination:
            seller.orderDestination,
          paymentProvider:
            seller.paymentProvider,
          paymentDestination:
            seller.paymentDestination,
          checkoutEnabled:
            seller.checkoutEnabled,
          fulfillment: seller.fulfillment,
          pickupNote: seller.pickupNote,
          products: cleanProducts,
        }
      );

      if (Array.isArray(result.products)) {
        setProducts(
          result.products.map((product: any) => ({
            id: String(product.id || ""),
            name: String(product.name || ""),
            category: String(
              product.category || ""
            ),
            price: String(product.price || ""),
            package: String(product.package || ""),
              checkoutPrice: String(product.checkout_price || ""),
            marketMarker: String(
              product.market_marker || ""
            ),
            quantityAvailable: String(
              product.quantity_available || ""
            ),
            pickupTiming: String(
              product.pickup_timing || ""
            ),
            availability: String(
              product.availability ||
                "Available now"
            ),
            description: String(
              product.description || ""
            ),
            imageUrl: String(
              product.image_url || ""
            ),
            externalOrderUrl: String(
              product.external_order_url || ""
            ),
            featured: Boolean(product.featured),
          }))
        );
      }

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

  async function connectSquare() {
    if (!seller || !token || !slug) return;

    const squareWindow = window.open(
      "",
      "_blank",
      "noopener,noreferrer"
    );

    if (!squareWindow) {
      setError(
        "Please allow pop-ups so Square can open."
      );
      return;
    }

    try {
      setError("");

      squareWindow.document.title =
        "Connecting Square...";

      const response = await fetch(
        "/api/okeechobee-meat-market?route=square-connect",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            token,
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (
        !response.ok ||
        result?.ok !== true ||
        !result?.authorizationUrl
      ) {
        throw new Error(
          result?.error ||
            "Could not connect Square."
        );
      }

      squareWindow.location.href =
        result.authorizationUrl;
    } catch (connectError) {
      squareWindow.close();

      setError(
        connectError instanceof Error
          ? connectError.message
          : "Could not connect Square."
      );
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.shell}>
          <div style={styles.card}>
            <strong>
              Loading your seller page...
            </strong>
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
            Manage what you have.
          </p>

          <p style={styles.help}>
            Add products, change prices, update
            availability and choose what buyers see on
            your public seller page.
          </p>
        </header>

        {analytics ? (
          <section
            style={{
              ...styles.section,
              background:
                "linear-gradient(145deg, #253029 0%, #303d34 100%)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.08)",
              boxShadow: "0 18px 42px rgba(23,35,27,.16)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#d8b75f",
                    marginBottom: 6,
                  }}
                >
                  Live Seller Activity
                </div>

                <h2
                  style={{
                    ...styles.sectionTitle,
                    color: "#fff",
                    marginBottom: 4,
                  }}
                >
                  Your Seller Activity
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,.68)",
                    fontSize: 14,
                    lineHeight: 1.45,
                  }}
                >
                  See how local shoppers are interacting
                  with your page.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  padding: 4,
                  borderRadius: 12,
                  background: "rgba(255,255,255,.07)",
                  gap: 4,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setAnalyticsWindow("sevenDays")
                  }
                  style={{
                    border: 0,
                    borderRadius: 9,
                    padding: "8px 11px",
                    fontWeight: 900,
                    fontSize: 12,
                    cursor: "pointer",
                    background:
                      analyticsWindow === "sevenDays"
                        ? "#d8b75f"
                        : "transparent",
                    color:
                      analyticsWindow === "sevenDays"
                        ? "#17231b"
                        : "#fff",
                  }}
                >
                  Last 7 Days
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAnalyticsWindow("allTime")
                  }
                  style={{
                    border: 0,
                    borderRadius: 9,
                    padding: "8px 11px",
                    fontWeight: 900,
                    fontSize: 12,
                    cursor: "pointer",
                    background:
                      analyticsWindow === "allTime"
                        ? "#d8b75f"
                        : "transparent",
                    color:
                      analyticsWindow === "allTime"
                        ? "#17231b"
                        : "#fff",
                  }}
                >
                  All Time
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(120px,1fr))",
                gap: 10,
                marginTop: 20,
              }}
            >
              {[
                {
                  value:
                    analytics[analyticsWindow]
                      .storefrontViews,
                  label: "Storefront Views",
                },
                {
                  value:
                    analytics[analyticsWindow]
                      .productClicks,
                  label: "Product Clicks",
                },
                {
                  value:
                    analytics[analyticsWindow]
                      .buyerHandoffs,
                  label: "Buyer Handoffs",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: "15px 14px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,.085)",
                    border:
                      "1px solid rgba(255,255,255,.14)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      lineHeight: 1,
                      fontWeight: 950,
                      color: "#fff",
                    }}
                  >
                    {stat.value.toLocaleString()}
                  </div>

                  <div
                    style={{
                      marginTop: 7,
                      color: "rgba(255,255,255,.62)",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {analytics[analyticsWindow].topProducts
              .length ? (
              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: "#fff",
                    marginBottom: 9,
                  }}
                >
                  Products Getting Attention
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 7,
                  }}
                >
                  {analytics[
                    analyticsWindow
                  ].topProducts.map((product, index) => (
                    <div
                      key={`${product.name}-${index}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: "9px 11px",
                        borderRadius: 10,
                        background:
                          "rgba(255,255,255,.045)",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(255,255,255,.86)",
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        {index + 1}. {product.name}
                      </span>

                      <span
                        style={{
                          color: "#d8b75f",
                          fontSize: 12,
                          fontWeight: 950,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.clicks}{" "}
                        {product.clicks === 1
                          ? "click"
                          : "clicks"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div
              style={{
                marginTop: 18,
                padding: "12px 13px",
                borderRadius: 12,
                background: "rgba(216,183,95,.10)",
                border: "1px solid rgba(216,183,95,.22)",
                color: "rgba(255,255,255,.78)",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: "#fff" }}>
                Keep the momentum going.
              </strong>{" "}
              Current products, photos, prices and
              availability make it easier for shoppers to
              act while they are looking.
            </div>
          </section>
        ) : null}

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Storefront Photo</h2>

          <p style={styles.help}>
            This is the large photo at the top of your public seller page.
          </p>

          {seller.heroImage ? (
            <img
              src={seller.heroImage}
              alt={`${seller.name} storefront`}
              style={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                borderRadius: 16,
                marginBottom: 12,
              }}
            />
          ) : null}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <label style={styles.choice}>
              {seller.heroImage ? "Change Storefront Photo" : "Add Storefront Photo"}

              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={async (event) => {
                  const file = event.target.files?.[0];

                  if (!file) return;

                  try {
                    const heroImage = await compressStorefrontPhoto(file);

                    setSeller({
                      ...seller,
                      heroImage,
                    });

                    setSaved(false);
                    setError("");
                  } catch (photoError) {
                    setError(
                      photoError instanceof Error
                        ? photoError.message
                        : "Could not use that photo."
                    );
                  } finally {
                    event.target.value = "";
                  }
                }}
              />
            </label>

            {seller.heroImage ? (
              <button
                type="button"
                style={styles.choice}
                onClick={() => {
                  setSeller({
                    ...seller,
                    heroImage: "",
                  });

                  setSaved(false);
                }}
              >
                Remove Photo
              </button>
            ) : null}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHead}>
            <div>
              <div style={styles.step}>1</div>

              <h2 style={styles.sectionTitle}>
                Your Products
              </h2>
            </div>

            <div style={styles.productCount}>
              {products.filter((product) =>
                product.name.trim()
              ).length}{" "}
              listed
            </div>
          </div>

          <p style={styles.help}>
            Keep everything here. Mark your best or
            current products as Featured for the public
            storefront.
          </p>

          <div style={styles.productList}>
            {products.map((product, index) => (
              <article
                key={product.id || `new-${index}`}
                style={styles.productCard}
              >
                <div style={styles.productTop}>
                  <strong style={styles.productNumber}>
                    {product.name.trim() ||
                      `Product ${index + 1}`}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      removeProduct(index)
                    }
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>

                <div style={styles.photoRow}>
                  <div style={styles.photoPreview}>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={
                          product.name ||
                          "Product preview"
                        }
                        style={styles.photoImage}
                      />
                    ) : (
                      <div
                        style={styles.photoPlaceholder}
                      >
                        Product photo
                      </div>
                    )}
                  </div>

                  <div style={styles.photoActions}>
                    <label style={styles.photoButton}>
                      {product.imageUrl
                        ? "Change Photo"
                        : "Add Photo"}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          void chooseProductPhoto(
                            index,
                            event
                          )
                        }
                        style={styles.hiddenInput}
                      />
                    </label>

                    {product.imageUrl ? (
                      <button
                        type="button"
                        onClick={() =>
                          updateProduct(
                            index,
                            "imageUrl",
                            ""
                          )
                        }
                        style={styles.smallRemove}
                      >
                        Remove photo
                      </button>
                    ) : null}
                  </div>
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

                <label style={styles.label}>
                  Category
                  <select
                    value={product.category}
                    onChange={(event) =>
                      updateProduct(
                        index,
                        "category",
                        event.target.value
                      )
                    }
                    style={styles.input}
                  >
                    <option value="">
                      Choose category
                    </option>
                    <option value="Beef">Beef</option>
                    <option value="Pork">Pork</option>
                    <option value="Chicken">
                      Chicken
                    </option>
                    <option value="Eggs">Eggs</option>
                    <option value="Lamb">Lamb</option>
                    <option value="Goat">Goat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Honey">Honey</option>
                    <option value="Other">Other</option>
                  </select>
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
                      placeholder="Example: $34/lb"
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

                  <label style={styles.label}>
                    Checkout price
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={product.checkoutPrice}
                      onChange={(event) =>
                        updateProduct(
                          index,
                          "checkoutPrice",
                          event.target.value
                        )
                      }
                      placeholder="Example: 33.00"
                      style={styles.input}
                    />
                    <span style={styles.help}>
                      Exact amount charged for one package.
                    </span>
                  </label>
                </div>

                <label style={styles.label}>
                  Market marker
                  <select
                    value={product.marketMarker}
                    onChange={(event) =>
                      updateProduct(
                        index,
                        "marketMarker",
                        event.target.value
                      )
                    }
                    style={styles.input}
                  >
                    <option value="">No marker</option>
                    <option value="Fresh Restock">
                      Fresh Restock
                    </option>
                    <option value="Seller Special">
                      Seller Special
                    </option>
                    <option value="Only a Few Left">
                      Only a Few Left
                    </option>
                    <option value="Taking Orders">
                      Taking Orders
                    </option>
                    <option value="Pickup This Week">
                      Pickup This Week
                    </option>
                  </select>
                </label>

                <div style={styles.twoColumn}>
                  <label style={styles.label}>
                    Quantity available
                    <input
                      value={product.quantityAvailable}
                      onChange={(event) =>
                        updateProduct(
                          index,
                          "quantityAvailable",
                          event.target.value
                        )
                      }
                      placeholder="Example: 6 packs left"
                      style={styles.input}
                    />
                  </label>

                  <label style={styles.label}>
                    Pickup timing
                    <input
                      value={product.pickupTiming}
                      onChange={(event) =>
                        updateProduct(
                          index,
                          "pickupTiming",
                          event.target.value
                        )
                      }
                      placeholder="Example: Saturday 10-1"
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
                    <option>
                      Limited availability
                    </option>
                    <option>Coming soon</option>
                    <option>Sold out</option>
                  </select>
                </label>

                <label style={styles.label}>
                  Details
                  <textarea
                    value={product.description}
                    onChange={(event) =>
                      updateProduct(
                        index,
                        "description",
                        event.target.value
                      )
                    }
                    placeholder="Anything buyers should know about this product."
                    style={styles.textarea}
                  />
                </label>

                <label style={styles.label}>
                  Direct product or order link
                  <input
                    value={product.externalOrderUrl}
                    onChange={(event) =>
                      updateProduct(
                        index,
                        "externalOrderUrl",
                        event.target.value
                      )
                    }
                    placeholder="https://..."
                    inputMode="url"
                    style={styles.input}
                  />
                </label>

                <button
                  type="button"
                  onClick={() =>
                    updateProduct(
                      index,
                      "featured",
                      !product.featured
                    )
                  }
                  style={
                    product.featured
                      ? styles.featuredActive
                      : styles.featuredButton
                  }
                >
                  <span>
                    {product.featured
                      ? "★ Featured on storefront"
                      : "☆ Feature on storefront"}
                  </span>

                  <span style={styles.featuredHint}>
                    {product.featured
                      ? "Shown first"
                      : "Tap to feature"}
                  </span>
                </button>
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
            {[
              "Pickup",
              "Delivery",
              "Pickup & Delivery",
            ].map((choice) => (
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
            ))}
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
              placeholder="Example: Saturday 10-12"
              style={styles.input}
            />
          </label>
        </section>

        <section style={styles.section}>
          <div style={styles.step}>3</div>

          <h2 style={styles.sectionTitle}>
            Get Paid
          </h2>

          <p style={styles.help}>
            Buyers pay through your payment account.
            HomePlanet organizes the order. Your money
            goes directly to you.
          </p>

          <p style={styles.help}>
            Checkout On lets customers order and pay online through your connected payment account.
            Checkout Off keeps things simple: customers can still see your products and contact you to order,
            and you collect payment however you normally do.
          </p>

          <div style={styles.choiceRow}>
            <button
              type="button"
              onClick={() => {
                setSeller({
                  ...seller,
                  checkoutEnabled: true,
                });
                setSaved(false);
              }}
              style={
                seller.checkoutEnabled
                  ? styles.choiceActive
                  : styles.choice
              }
            >
              Checkout On
            </button>

            <button
              type="button"
              onClick={() => {
                setSeller({
                  ...seller,
                  checkoutEnabled: false,
                });
                setSaved(false);
              }}
              style={
                !seller.checkoutEnabled
                  ? styles.choiceActive
                  : styles.choice
              }
            >
              Checkout Off
            </button>
          </div>

          {seller.checkoutEnabled ? (
            <>
              <label style={styles.label}>
                How do you get paid?

                <select
                  value={seller.paymentProvider}
                  onChange={(event) => {
                    setSeller({
                      ...seller,
                      paymentProvider:
                        event.target.value,
                    });
                    setSaved(false);
                  }}
                  style={styles.input}
                >
                  <option value="">
                    Choose payment provider
                  </option>
                  <option value="PayPal">
                    PayPal
                  </option>
                  <option value="Square">
                    Square
                  </option>
                  <option value="Stripe">
                    Stripe
                  </option>
                  <option value="Cash App">
                    Cash App
                  </option>
                  <option value="Zelle">
                    Zelle
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </label>

              {seller.paymentProvider === "Square" ? (
                <div style={styles.label}>
                  <span>Square account</span>

                  <button
                    type="button"
                    onClick={() => {
                      void connectSquare();
                    }}
                    style={styles.choiceActive}
                  >
                    Connect Square
                  </button>

                  <span style={styles.help}>
                    Connect your Square account so buyers can
                    pay you directly through Square checkout.
                  </span>
                </div>
              ) : (
                <label style={styles.label}>
                  Payment link or destination

                  <input
                    value={seller.paymentDestination}
                    onChange={(event) => {
                      setSeller({
                        ...seller,
                        paymentDestination:
                          event.target.value,
                      });
                      setSaved(false);
                    }}
                    placeholder={
                      seller.paymentProvider === "PayPal"
                        ? "PayPal checkout or payment link"
                        : seller.paymentProvider === "Stripe"
                          ? "Stripe payment link"
                          : seller.paymentProvider === "Cash App"
                            ? "Cash App payment link"
                            : seller.paymentProvider === "Zelle"
                              ? "Zelle payment destination"
                              : "Payment link"
                    }
                    style={styles.input}
                  />
                </label>
              )}

              <div style={styles.help}>
                Products marked available can use this
                checkout instead of making buyers message,
                call, or wait for confirmation.
              </div>
            </>
          ) : (
            <div style={styles.help}>
              Checkout is currently off. Buyers cannot
              complete payment through HomePlanet yet.
            </div>
          )}
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
          style={{
            ...styles.saveButton,
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving
            ? "Saving..."
            : `Save My ${seller.name} Page`}
        </button>

        <a
          href={`/planet/okeechobee/meat-market/seller/${seller.slug}`}
          target="_blank"
          rel="noreferrer"
          style={styles.viewLink}
        >
          View My Public Seller Page
        </a>

        <div style={styles.footerNote}>
          Your private update link controls this seller
          page. Keep it somewhere safe.
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
    maxWidth: 760,
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
    gap: 12,
  },

  productCount: {
    flexShrink: 0,
    borderRadius: 999,
    background: "#efe7d9",
    color: "#5f5037",
    padding: "7px 10px",
    fontSize: 12,
    fontWeight: 900,
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
    margin: "0 0 12px",
    fontSize: 25,
    letterSpacing: "-.025em",
  },

  productList: {
    display: "grid",
    gap: 16,
    marginTop: 18,
  },

  productCard: {
    border: "1px solid #e3d8c7",
    borderRadius: 20,
    padding: 17,
    background: "#faf6ee",
  },

  productTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  productNumber: {
    fontSize: 15,
  },

  removeButton: {
    border: 0,
    background: "transparent",
    color: "#a14b3c",
    fontWeight: 850,
    cursor: "pointer",
  },

  photoRow: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    background: "#fffdf8",
    border: "1px solid #e3d8c7",
  },

  photoPreview: {
    width: 88,
    height: 88,
    flexShrink: 0,
    borderRadius: 14,
    overflow: "hidden",
    background: "#eee5d6",
  },

  photoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  photoPlaceholder: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    padding: 8,
    boxSizing: "border-box",
    textAlign: "center",
    color: "#7b725f",
    fontSize: 12,
    fontWeight: 800,
  },

  photoActions: {
    display: "grid",
    gap: 7,
  },

  photoButton: {
    display: "inline-flex",
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    padding: "0 15px",
    borderRadius: 12,
    border: "1px solid #9b7b42",
    background: "#fffaf0",
    color: "#604a25",
    fontSize: 14,
    fontWeight: 950,
    cursor: "pointer",
  },

  hiddenInput: {
    display: "none",
  },

  smallRemove: {
    border: 0,
    padding: 0,
    background: "transparent",
    color: "#9c5247",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 800,
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

  textarea: {
    width: "100%",
    minHeight: 96,
    resize: "vertical",
    boxSizing: "border-box",
    borderRadius: 12,
    border: "1px solid #d6c9b6",
    padding: 13,
    background: "#fff",
    color: "#17231b",
    fontSize: 16,
    lineHeight: 1.45,
    fontFamily: "inherit",
  },

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(210px,1fr))",
    gap: 10,
  },

  featuredButton: {
    width: "100%",
    minHeight: 54,
    marginTop: 14,
    padding: "10px 14px",
    borderRadius: 13,
    border: "1px solid #d7c9ae",
    background: "#fffdf8",
    color: "#60543f",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    fontWeight: 900,
    cursor: "pointer",
  },

  featuredActive: {
    width: "100%",
    minHeight: 54,
    marginTop: 14,
    padding: "10px 14px",
    borderRadius: 13,
    border: "1px solid #9b7639",
    background: "#f5e8c8",
    color: "#5c431d",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    fontWeight: 950,
    cursor: "pointer",
  },

  featuredHint: {
    fontSize: 11,
    opacity: 0.72,
  },

  addButton: {
    width: "100%",
    minHeight: 54,
    marginTop: 16,
    borderRadius: 13,
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
    minHeight: 60,
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


