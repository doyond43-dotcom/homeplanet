// apps/web/src/service/ServiceRoutes.tsx
import { Routes, Route } from "react-router-dom";
import ServiceBoard from "./ServiceBoard";

export default function ServiceRoutes() {
  return (
    <Routes>
      <Route path=":shopSlug" element={<ServiceBoard />} />
      <Route path=":shopSlug/board" element={<ServiceBoard />} />
    </Routes>
  );
}