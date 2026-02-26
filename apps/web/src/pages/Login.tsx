import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation() as any;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // If already signed in, go where RequireAuth wanted (or to Projects).
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) {
        const from = loc?.state?.from;
        nav(from || "/creator/projects", { replace: true });
      }
    });
    return () => { mounted = false; };
  }, [nav, loc]);

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.length > 0 && !busy;
  }, [email, password, busy]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      const from = (loc as any)?.state?.from;
      nav(from || "/creator/projects", { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="hpAuthPage">
      <div style={{ width: 360 }}>
        <h2 style={{ margin: 0, marginBottom: 10 }}>HomePlanet</h2>
        <p style={{ marginTop: 0, opacity: 0.75, fontSize: 13 }}>
          Sign in to continue.
        </p>

        <form onSubmit={onSubmit}>
          <div style={{ display: "grid", gap: 10 }}>
            <input
              type="email"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
                color: "rgba(255,255,255,0.92)",
              }}
            />

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
                color: "rgba(255,255,255,0.92)",
              }}
            />

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.92)",
                cursor: canSubmit ? "pointer" : "not-allowed",
                opacity: canSubmit ? 1 : 0.55,
                fontWeight: 800,
              }}
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>

            {err ? <div style={{ opacity: 0.9, fontSize: 13 }}>{err}</div> : null}

            <div style={{ display: "flex", gap: 10, fontSize: 13, opacity: 0.8 }}>
              <Link to="/signup">Sign up</Link>
              <span style={{ opacity: 0.5 }}>·</span>
              <Link to="/reset-password">Forgot password?</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
