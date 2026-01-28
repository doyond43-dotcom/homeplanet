import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setBusy(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;

      setMsg("If that email exists, a reset link has been sent. Check your inbox (and spam).");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to send reset email");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ width: 360 }}>
      <h2 style={{ margin: 0, marginBottom: 10 }}>HomePlanet</h2>
      <p style={{ marginTop: 0, opacity: 0.75, fontSize: 13 }}>
        Reset your password via email.
      </p>

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

        {err && <div style={{ color: "salmon", fontSize: 13 }}>{err}</div>}
        {msg && <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>{msg}</div>}

        <button
          disabled={busy}
          style={{ padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}
        >
          {busy ? "Working…" : "Send reset link"}
        </button>
      </form>

      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.8 }}>
        <Link to="/login">Back to sign in</Link>
      </div>
    </div>
  );
}
