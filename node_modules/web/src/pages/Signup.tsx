import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Signup() {
  const { signUp } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await signUp(email, password);
      // Depending on Supabase settings, user might need email confirmation.
      // We still send them to login and let the error message guide them if needed.
      nav("/login", { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Sign up failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ width: 360 }}>
      <h2 style={{ margin: 0, marginBottom: 10 }}>HomePlanet</h2>
      <p style={{ marginTop: 0, opacity: 0.75, fontSize: 13 }}>Create an account.</p>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          type="email"
          autoComplete="email"
          required
          style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.4)", color: "#fff" }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
          autoComplete="new-password"
          required
          style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.4)", color: "#fff" }}
        />

        {err && <div style={{ color: "salmon", fontSize: 13 }}>{err}</div>}

        <button
          disabled={busy}
          style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
        >
          {busy ? "Working…" : "Sign up"}
        </button>
      </form>

      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
}
