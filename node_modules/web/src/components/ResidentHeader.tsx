import { Link, useLocation, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";

type NavLink = { label: string; to: string };

export default function ResidentHeader({
  title,
  subtitle,
  backTo = "/",
  links = [],
}: {
  title: string;
  subtitle?: string;
  backTo?: string;
  links?: NavLink[];
}) {
  const nav = useNavigate();
  const loc = useLocation();

  function goBack() {
    // On a fresh load, react-router location.key is often "default"
    if (loc.key && loc.key !== "default") {
      nav(-1);
      return;
    }
    nav(backTo);
  }

  return (
    <div style={wrap}>
      <div style={left}>
        <button type="button" style={backBtn} onClick={goBack} title="Back">
          ← Back
        </button>

        <div style={{ display: "grid", gap: 2 }}>
          <div style={titleStyle}>{title}</div>
          {subtitle ? <div style={subStyle}>{subtitle}</div> : null}
        </div>
      </div>

      {links.length ? (
        <div style={right}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} style={linkBtn}>
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* styles */
const wrap: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 12px",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.35)",
  color: "#fff",
  marginBottom: 14,
};

const left: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
};

const right: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const backBtn: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  cursor: "pointer",
  fontSize: 12,
  opacity: 0.9,
  whiteSpace: "nowrap",
};

const linkBtn: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 10px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "transparent",
  color: "#fff",
  textDecoration: "none",
  fontSize: 12,
  opacity: 0.88,
  whiteSpace: "nowrap",
};

const titleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 0.2,
  lineHeight: 1.1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 520,
};

const subStyle: CSSProperties = {
  fontSize: 12,
  opacity: 0.65,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 520,
};
