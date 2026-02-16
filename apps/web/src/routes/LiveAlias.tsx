import { Navigate, useParams } from "react-router-dom";

export default function LiveAlias() {
  const { slug } = useParams();
  const safe = slug ?? "";
  return <Navigate to={`/c/${safe}`} replace />;
}
