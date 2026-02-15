import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuildPreview from "../components/BuildPreview";
import { useProjectStore } from "../state/projectStore";

function safeStr(v: any): string {
  return v == null ? "" : String(v);
}

function normalizeListText(text: string): string {
  const rawLines = safeStr(text).split(/\r?\n/);

  const ensureDollar = (s: string) => {
    const t = s.trim();
    if (!t) return "";

    // Case 1: line is ONLY a number -> $<number>
    if (/^\d+(?:\.\d{1,2})?$/.test(t)) {
      return "$" + t;
    }

    // Case 2: line ends with separator + number -> add $ to the trailing number
    // Examples:
    // "Product 1 - 16"  => "Product 1 - $16"
    // "Service: 99"     => "Service: $99"
    // "Hoodie ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢”šÂ¬Ã…“ 45"     => "Hoodie ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢”šÂ¬Ã…“ $45"
    return t.replace(/([\-ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢”šÂ¬Ã…“ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢”šÂ¬Ã‚Â:]\s*)(\d+(?:\.\d{1,2})?)\s*$/, (_m, sep, num) => {
      return sep + "$" + num;
    });
  };

  const out = rawLines.map((line) => {
    const t = line.trim();
    if (!t) return "";

    const body = t.startsWith("- ") ? t.slice(2).trim() : t;

    // Always normalize back into "- " bullets
    return "- " + ensureDollar(body);
  });

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
export default function CreatorServices() {
  const nav = useNavigate();
  const { activeProjectId } = useProjectStore();

  const pidShort = activeProjectId ? activeProjectId.slice(0, 8) : "none";

  const keyServices = activeProjectId ? `hp_creator_services_${activeProjectId}` : "hp_creator_services_none";
  const keyProducts = activeProjectId ? `hp_creator_products_${activeProjectId}` : "hp_creator_products_none";

  const [services, setServices] = useState<string>("");
  const [products, setProducts] = useState<string>("");

  // load
  useEffect(() => {
    try {
      setServices(normalizeListText(localStorage.getItem(keyServices) ?? "- Hoodie - $45\n- 99\n- Private lessons - 75"));
      setProducts(normalizeListText(localStorage.getItem(keyProducts) ?? "- Water Bottle - 16\n- Gift cards - 25"));
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProjectId]);

  // save (debounced-ish via effect)
  useEffect(() => {
    try {
      localStorage.setItem(keyServices, normalizeListText(services));
      localStorage.setItem(keyProducts, normalizeListText(products));
    } catch {
      // ignore
    }
  }, [services, products, keyServices, keyProducts]);

  const buildText = useMemo(() => {
    const s = services.trim() ? services.trim() : "- 99";
    const p = products.trim() ? products.trim() : "- 16";

    // Keep it simple: BuildPreview already understands Services/Products headings.
    return `Services:\n${s}\n\nProducts:\n${p}\n`;
  }, [services, products]);

  const box: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    padding: 14,
  };

  const input: React.CSSProperties = {
    width: "100%",
    minHeight: 160,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.15)",
    color: "white",
    outline: "none",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: 13,
    lineHeight: "18px",
    resize: "vertical",
  };

  const btn: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Creator Studio ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢”šÂ¬Ã¢”žÂ¢ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒ”šÃ‚Â ÃƒÆ’Ã†’Ãƒ”šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡Ãƒ”šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢”šÂ¬Ã…Â¾Ãƒ”šÃ‚Â¢ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢”šÂ¬Ã¢”žÂ¢ÃƒÆ’Ã†’Ãƒ”šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡Ãƒ”šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒ”šÃ‚Â¡ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒ”¦Ã‚Â¡ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¢ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢”šÂ¬Ã¢”žÂ¢ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒ”¦Ã‚Â¡ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¢ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢”šÂ¬Ã¢”žÂ¢ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¢ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¢ÃƒÆ’Ã†’Ãƒ”šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡Ãƒ”šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒ”šÃ‚Â¡ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¬ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒ”šÃ‚Â¦ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¡ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢”šÂ¬Ã¢”žÂ¢ÃƒÆ’Ã†’Ãƒ”šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡Ãƒ”šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒ”šÃ‚Â¡ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒ”¦Ã‚Â¡ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¬ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢”šÂ¬Ã¢”žÂ¢ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒ”¦Ã‚Â¡ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¢ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢”šÂ¬Ã¢”žÂ¢ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¢ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¢ÃƒÆ’Ã†’Ãƒ”šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒ”¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¬ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¡ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒ”¦Ã‚Â¡ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â¬ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢”šÂ¬Ã¢”žÂ¢ÃƒÆ’Ã†’Ãƒ”šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡Ãƒ”šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒ”šÃ‚Â¡ÃƒÆ’Ã†’Ãƒ” Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒ”¦Ã‚Â¡ÃƒÆ’Ã†’ÃƒÂ¢Ã¢”šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒ”šÃ‚Â Services</div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Project: {pidShort}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={btn} onClick={() => nav("/planet/creator/studio")}>Studio</button>
          <button style={btn} onClick={() => nav("/planet/creator/build")}>Build</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 14 }}>
        <div style={box}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Services</div>
          <div style={{ opacity: 0.75, fontSize: 12, marginBottom: 10 }}>
            Use bullet lines. Prices auto-format on blur. Example: <span style={{ opacity: 0.9 }}>- Hoodie - 45</span>
          </div>

          <textarea
            style={input}
            value={services}
            onChange={(e) => setServices(e.target.value)}
            onBlur={() => setServices((v) => { const n = normalizeListText(v); console.log("[SERVICES BLUR]", { before: v, after: n }); return n; })}
            placeholder="- Service 1 - 45`n- Service 2 - 99"
          />

          <div style={{ height: 14 }} />

          <div style={{ fontWeight: 700, marginBottom: 6 }}>Products</div>
          <textarea
            style={input}
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            onBlur={() => setProducts((v) => { const n = normalizeListText(v); console.log("[PRODUCTS BLUR]", { before: v, after: n }); return n; })}
            placeholder="- Product 1 - 16`n- Product 2 - 24"
          />
        </div>

        <div style={box}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Preview</div>
          <BuildPreview rawText={buildText} projectId={activeProjectId} />
        </div>
      </div>
    </div>
  );
}


