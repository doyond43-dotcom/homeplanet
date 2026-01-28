import "./App.css";
import { UI_VERSION } from "./ui/uiVersion";
import CoreTruthView from "./CoreTruthView";
import { useAuth } from "./auth/AuthProvider";
import { usePresenceState } from "./lib/usePresenceState";
import { useSignals } from "./lib/useSignals";
import { useEffect, useMemo, useState, Suspense, lazy } from "react";

// Lazy-load flows so iOS Safari won’t crash the whole app at boot
const BookFlow = lazy(() => import("./flows/BookFlow"));
const AppFlow = lazy(() => import("./flows/AppFlow"));
const AnchorFlow = lazy(() => import("./flows/AnchorFlow"));
const AuthorFlow = lazy(() => import("./flows/AuthorFlow"));

type Resident = "home" | "book" | "app" | "anchor" | "author";

function dotColor(sev: number) {
  if (sev >= 4) return "rgba(255,180,120,0.95)";
  if (sev === 3) return "rgba(255,210,140,0.95)";
  if (sev === 2) return "rgba(160,200,255,0.95)";
  return "rgba(160,255,180,0.95)";
}

function ResidentShell({
  quiet,
  setQuiet,
  setResident,
  children,
}: {
  quiet: boolean;
  setQuiet: React.Dispatch<React.SetStateAction<boolean>>;
  setResident: React.Dispatch<React.SetStateAction<Resident>>;
  children: React.ReactNode;
}) {
  return (
    <div className={`hpWrap${quiet ? " quiet" : ""}`}>
      <div className="hpCard" style={{ marginTop: 18 }}>
        <div className="hpCardTitle">
          <span>Resident</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="hpBtnGhost" onClick={() => setResident("home")}>
              Back to Home
            </button>
            <button
              className="hpBtnGhost"
              onClick={() => setQuiet((q) => !q)}
              title="Toggle Quiet Mode"
            >
              Quiet: {quiet ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="hpCard" style={{ textAlign: "center", marginTop: 14 }}>
            <div style={{ opacity: 0.75, fontSize: 13 }}>Loading…</div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}

export default function App() {
  const { user, signOut } = useAuth();
  const { row, loading, err } = usePresenceState(4000);
  const { rows: signals = [], loading: sigLoading, err: sigErr } = useSignals(4000, 12);

  // Quiet Mode
  const [quiet, setQuiet] = useState<boolean>(() => {
    const v = localStorage.getItem("hp_quiet");
    return v ? v === "1" : true;
  });

  // Resident navigation
  const [resident, setResident] = useState<Resident>(() => {
    const v = localStorage.getItem("hp_resident");
    if (v === "book" || v === "app" || v === "anchor" || v === "author" || v === "home") {
      return v;
    }
    return "home";
  });

  useEffect(() => {
    localStorage.setItem("hp_quiet", quiet ? "1" : "0");
  }, [quiet]);

  useEffect(() => {
    localStorage.setItem("hp_resident", resident);
  }, [resident]);

  const topSignals = useMemo(() => {
    return quiet ? signals.slice(0, 8) : signals;
  }, [signals, quiet]);

  // ─────────────────────────
  // Resident views
  // ─────────────────────────

  if (resident === "book") {
    return (
      <ResidentShell quiet={quiet} setQuiet={setQuiet} setResident={setResident}>
        <BookFlow />
        <div className="hpActions">
          <button className="hpBtn" onClick={signOut}>Sign out</button>
        </div>
      </ResidentShell>
    );
  }

  if (resident === "app") {
    return (
      <ResidentShell quiet={quiet} setQuiet={setQuiet} setResident={setResident}>
        <AppFlow />
        <div className="hpActions">
          <button className="hpBtn" onClick={signOut}>Sign out</button>
        </div>
      </ResidentShell>
    );
  }

  if (resident === "anchor") {
    return (
      <ResidentShell quiet={quiet} setQuiet={setQuiet} setResident={setResident}>
        <AnchorFlow />
        <div className="hpActions">
          <button className="hpBtn" onClick={signOut}>Sign out</button>
        </div>
      </ResidentShell>
    );
  }

  if (resident === "author") {
    return (
      <ResidentShell quiet={quiet} setQuiet={setQuiet} setResident={setResident}>
        <AuthorFlow />
        <div className="hpActions">
          <button className="hpBtn" onClick={signOut}>Sign out</button>
        </div>
      </ResidentShell>
    );
  }

  // ─────────────────────────
  // Home view
  // ─────────────────────────

  return (
    <div className={`hpWrap${quiet ? " quiet" : ""}`}>
      <h1 className="hpTitle">HomePlanet</h1>

      <div className="hpSub">
        Signed in as <b>{user?.email}</b>
      </div>

      <div className="hpMeta">
        UI: <b>{UI_VERSION}</b>
      </div>

      <div className="hpRow">
        {loading && <div>Presence: loading…</div>}
        {err && <div style={{ color: "salmon" }}>Presence error: {err}</div>}
        {!loading && !err && (
          <div>
            Presence: <b>{row?.state ?? "unknown"}</b>{" "}
            <span style={{ opacity: 0.65 }}>
              (age {row?.age_seconds ?? "-"}s / ttl {row?.ttl_seconds ?? "-"}s, last {row?.last_kind ?? "-"})
            </span>
          </div>
        )}
      </div>

      {/* Residents launcher */}
      <div className="hpCard" style={{ padding: quiet ? 12 : 14 }}>
        <div className="hpCardTitle">
          <span>Residents</span>
          <button className="hpBtnGhost" onClick={() => setQuiet(q => !q)}>
            Quiet: {quiet ? "ON" : "OFF"}
          </button>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <button className="hpBtn" onClick={() => setResident("author")}>
            Write
          </button>

          <button className="hpBtn" onClick={() => setResident("book")}>
            Write a Book
          </button>

          <button className="hpBtn" onClick={() => setResident("app")}>
            Build an App
          </button>

          <button className="hpBtn" onClick={() => setResident("anchor")}>
            Anchor
          </button>
        </div>
      </div>

      {/* Signals feed */}
      <div className="hpCard">
        <div className="hpCardTitle">
          <span>Presence Signals (truth feed)</span>
          <span style={{ opacity: 0.55, fontSize: 12 }}>
            {quiet ? "showing 8" : `showing ${topSignals.length}`}
          </span>
        </div>

        {sigLoading && <div style={{ fontSize: 13, opacity: 0.8 }}>Signals: loading…</div>}
        {sigErr && <div style={{ fontSize: 13, color: "salmon" }}>Signals error: {sigErr}</div>}

        {!sigLoading && !sigErr && topSignals.length > 0 && (
          <div className="hpFeed" style={{ maxHeight: quiet ? 260 : 360 }}>
            {topSignals.map((s: any) => (
              <div key={s.id} className="hpItem">
                <div className="hpLeft">
                  <span className="hpDotWrap">
                    <span className="hpDot" style={{ background: dotColor(s.severity) }} />
                  </span>
                  <span className="hpSig">{s.signal}</span>
                  <span className="hpSev">sev {s.severity}</span>
                </div>
                <div className="hpTime">
                  {new Date(s.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hpActions">
        <button className="hpBtn" onClick={signOut}>Sign out</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <CoreTruthView />
      </div>
    </div>
  );
}


