import React from "react";
import { LifeDrawer } from "../components/life/LifeDrawer";

export default function LifePlanet() {
  return (
    <div className="p-3 md:p-6">
      <div className="mb-3">
        <div className="text-2xl font-semibold">Life</div>
        <div className="text-sm text-gray-600">Personal Presence Ledger (private by default)</div>
      </div>

      <LifeDrawer />
    </div>
  );
}
