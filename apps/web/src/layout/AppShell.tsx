import { Outlet } from "react-router-dom";
import { useMemo, useState } from "react";
import { PlanetSidebar } from "../components/PlanetSidebar";

export function AppShell() {
  const [witnessMode, setWitnessMode] = useState(false);

  const bg = useMemo(() => ({
    minHeight: "100vh",
    color: "white",
    background: "radial-gradient(1200px 700px at 20% 20%, rgba(80,120,255,0.12), transparent 60%), radial-gradient(1000px 700px at 80% 30%, rgba(255,80,200,0.10), transparent 55%), #07070B",
  }), []);

  return (
    <div style={bg}>
      <div style={{ display: "flex" }}>
        <PlanetSidebar
          witnessMode={witnessMode}
          onToggleWitnessMode={() => setWitnessMode((v) => !v)}
        />

        <main style={{
  flex: 1,
  minWidth: 0,
  padding: 22,
}}>
          <div style={{
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
            padding: 22,
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          }}>
            <Outlet context={{ witnessMode }} />
          </div>
        </main>
      </div>
    </div>
  );
}



