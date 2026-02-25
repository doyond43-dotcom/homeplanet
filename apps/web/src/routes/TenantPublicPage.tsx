// apps/web/src/routes/TenantPublicPage.tsx
import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import PublicPage from "./PublicPage";
import { getTenantTheme } from "./tenantThemes";
import { TenantShell } from "../components/TenantShell";

const RESERVED_SLUGS = new Set([
  "city",
  "service",
  "live",
  "c",
  "r",
  "press",
  "print",
  "assets",
  "login",
  "logout",
  "private-beta",
  "privatebeta",
  "api",
]);

export default function TenantPublicPage() {
  // If this component is mounted under a catch-all like "/:slug/*",
  // react-router provides both "slug" and "*" (the rest of the path).
  const params = useParams();
  const slugRaw = String((params as any)?.slug ?? "").trim();
  const restRaw = String((params as any)?.["*"] ?? "").trim();

  const slug = useMemo(() => slugRaw.toLowerCase(), [slugRaw]);

  // ✅ CRITICAL: If our "tenant catch-all" accidentally captures reserved routes
  // like /city/* or /live/*, bounce back to the intended absolute path.
  if (slug && RESERVED_SLUGS.has(slug)) {
    const to = `/${slug}${restRaw ? `/${restRaw}` : ""}`;
    return <Navigate to={to} replace />;
  }

  const theme = getTenantTheme(slugRaw);

  // No theme? Render the normal intake page exactly as before.
  if (!theme) return <PublicPage />;

  return (
    <TenantShell theme={theme}>
      <PublicPage />
    </TenantShell>
  );
}