// apps/web/src/routes/LiveAlias.tsx
import { Navigate, useParams } from "react-router-dom";

export default function LiveAlias() {
  const { slug } = useParams();

  // If this component is rendered without a slug (common when mounted under a "*" route),
  // do NOT redirect into /c/ (which then falls into your default /c/taylor-creek behavior).
  const raw = (slug ?? "").trim();

  if (!raw) {
    // Send to your safe landing/home route instead of forcing a shop.
    // Pick ONE canonical safe page:
    return <Navigate to="/" replace />;
    // or: return <Navigate to="/private-beta" replace />;
    // or: return <Navigate to="/city" replace />;
  }

  // Minimal safety: encode route segment
  const safe = encodeURIComponent(raw.toLowerCase());

  return <Navigate to={`/c/${safe}`} replace />;
}
