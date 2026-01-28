import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // When user clicks Supabase reset link, Supabase will establish a recovery session.
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      nav("/login", { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Failed to update password");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div style={{ width: 420, opacity: 0.8, fontSize: 13 }}>
        Open the password reset link from your email in this browser. Once loaded, you can set a new password here.
      </div>
    );
  }

  return (
    <div style={{ width: 360 }}>
      <h2 style={{ margin: 0, marginBottom: 10 }}>Set new password</h2>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="new password"
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
          {busy ? "Working…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
