import { normalizeStringsDeep } from "../lib/text/normalizeText";

type Props = {
  rawText: string;
  projectId?: string | null;
};

function parseBuild(raw: string) {
  const text = normalizeStringsDeep(raw || "");

  const section = (label: string) => {
    const m = text.match(new RegExp(label + ":\\s*([\\s\\S]*?)(?:\\n\\n|$)", "i"));
    return m?.[1]?.trim() || "";
  };

  const lines = (s: string) =>
    s
      .split("\n")
      .map((x) => x.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean);

  return {
    h1: section("H1") || "Untitled Site",
    sub: section("Subheadline") || "Built from your description — ready to share",
    about: section("About"),
    services: lines(section("Services")),
    products: lines(section("Products")),
    testimonials: lines(section("Testimonials")),
    contactRaw: section("Contact"),
    footer: section("Footer"),
  };
}

export function BuildPreview({ rawText, projectId }: Props) {
  const parsed = parseBuild(rawText);

  const contactLines = parsed.contactRaw
    .split("\n")
    .map((l) => l.split(":").map((x) => x.trim()));

  const contact: any = {};
  for (const [k, v] of contactLines) {
    if (!k) continue;
    contact[k.toLowerCase()] = v || "";
  }

  return (
    <div
      style={{
        background: "#f4f4f4",
        borderRadius: 22,
        padding: 18,
        color: "black",
        fontFamily: "system-ui",
      }}
    >
      <h1>{parsed.h1}</h1>
      <div style={{ opacity: 0.7 }}>{parsed.sub}</div>

      <div style={{ marginTop: 14 }}>
        <strong>About</strong>
        <p>{parsed.about}</p>
      </div>

      {!!parsed.services.length && (
        <div>
          <strong>Services</strong>
          <ul>
            {parsed.services.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}

      {!!parsed.products.length && (
        <div>
          <strong>Products</strong>
          <ul>
            {parsed.products.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <strong>Contact</strong>
        <div>Location: {contact.location || ""}</div>
        <div>Phone: {contact.phone || ""}</div>
        <div>Email: {contact.email || ""}</div>
        <div>Instagram: {contact.instagram || ""}</div>
        <div>Website: {contact.website || ""}</div>
      </div>

      <div style={{ marginTop: 18, fontSize: 12, opacity: 0.6 }}>
        {parsed.footer || `${parsed.h1} — Built with HomePlanet`}
      </div>

      {projectId && (
        <div style={{ fontSize: 11, opacity: 0.5 }}>
          Project: {projectId.slice(0, 8)}
        </div>
      )}
    </div>
  );
}

export default BuildPreview;
